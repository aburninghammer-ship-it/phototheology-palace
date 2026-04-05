import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Star, Crown, Zap, Building2, ArrowRight, CreditCard, Gift, GraduationCap, Volume2, Headphones, Mic } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { useTrackedPaymentLinks } from "@/hooks/useTrackedPaymentLinks";
import { useTranslation } from "react-i18next";

export default function Pricing() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [isStartingTrial, setIsStartingTrial] = useState(false);
  const paymentLinks = useTrackedPaymentLinks();

  // Handle trial/subscription success/cancelled from Stripe redirect
  useEffect(() => {
    const trialStatus = searchParams.get('trial');
    const subscriptionStatus = searchParams.get('subscription');

    const triggerCelebration = () => {
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }
        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#9b87f5', '#7E69AB', '#FFD700', '#FFA500', '#FF6B6B'],
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#9b87f5', '#7E69AB', '#FFD700', '#FFA500', '#FF6B6B'],
        });
      }, 250);
    };

    const sendPurchaseNotification = async (isTrialing: boolean, tier: string) => {
      try {
        await supabase.functions.invoke('send-purchase-notification', {
          body: {
            userEmail: user?.email || 'Unknown',
            userName: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Unknown',
            amount: 0, // Will be populated from Stripe on backend if needed
            currency: 'usd',
            subscriptionTier: tier,
            isTrialing,
            billingInterval: billingPeriod === 'annual' ? 'year' : 'month',
          },
        });
        console.log('Purchase notification sent successfully');
      } catch (error) {
        console.error('Failed to send purchase notification:', error);
      }
    };

    if (trialStatus === 'success') {
      triggerCelebration();
      toast.success(t('pricing.toasts.trialStarted'));
      // Send notification for trial start
      sendPurchaseNotification(true, 'premium');
      navigate('/palace', { replace: true });
    } else if (trialStatus === 'cancelled') {
      toast.info(t('pricing.toasts.trialCancelled'));
    } else if (subscriptionStatus === 'cancelled') {
      toast.info(t('pricing.toasts.subscriptionCancelled'));
    }
  }, [searchParams, navigate, user, billingPeriod]);

  const startTrialNow = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    // Start premium trial by default
    startTrialWithCard('premium');
  };

  const startTrialWithCard = async (plan: 'essential' | 'premium') => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setIsStartingTrial(true);
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_status, is_student, has_lifetime_access, payment_source")
        .eq("id", user.id)
        .single();

      // Check if user already has access
      if (profile?.has_lifetime_access) {
        toast.success(t('pricing.toasts.lifetimeAccess'));
        navigate("/palace");
        return;
      }

      if (profile?.is_student) {
        toast.success(t('pricing.toasts.studentAccess'));
        navigate("/palace");
        return;
      }

      if (profile?.subscription_status === "active") {
        toast.success(t('pricing.toasts.activeSubscription'));
        navigate("/palace");
        return;
      }

      // Check for Patreon access
      const { data: patreonConnection } = await supabase
        .from("patreon_connections")
        .select("is_active_patron, entitled_cents")
        .eq("user_id", user.id)
        .maybeSingle();

      if (patreonConnection?.is_active_patron && patreonConnection.entitled_cents >= 1500) {
        await supabase
          .from("profiles")
          .update({
            subscription_status: "active",
            subscription_tier: "premium",
            payment_source: "patreon",
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);
        toast.success(t('pricing.toasts.patreonLinked'));
        navigate("/palace");
        return;
      }

      // Check for Pickaxe access
      const { data: pickaxeConnection } = await supabase
        .from("pickaxe_connections")
        .select("is_paid_user")
        .eq("pickaxe_email", user.email?.toLowerCase() || "")
        .eq("is_paid_user", true)
        .maybeSingle();

      if (pickaxeConnection?.is_paid_user) {
        await supabase
          .from("profiles")
          .update({
            subscription_status: "active",
            subscription_tier: "premium",
            payment_source: "pickaxe" as any,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);
        toast.success(t('pricing.toasts.pickaxeLinked'));
        navigate("/palace");
        return;
      }

      // Check if this is a Lock-In Pass guest (skip trial, go straight to payment)
      const skipTrial = searchParams.get('skip_trial') === 'true';

      if (skipTrial) {
        // Direct subscription checkout — no trial period
        const { data, error } = await supabase.functions.invoke('create-subscription-checkout', {
          body: { plan, billing: billingPeriod },
        });
        if (error) throw error;
        if (data?.url) {
          window.location.href = data.url;
        }
      } else {
        // No external membership - proceed with Stripe checkout for trial
        const { data, error } = await supabase.functions.invoke('create-trial-checkout', {
          body: { plan, billing: billingPeriod },
        });
        if (error) throw error;
        if (data?.url) {
          window.location.href = data.url;
        }
      }
    } catch (error: any) {
      console.error("Error starting trial:", error);
      toast.error(t('pricing.toasts.trialFailed'));
    } finally {
      setIsStartingTrial(false);
    }
  };

  const [isSubscribing, setIsSubscribing] = useState(false);
  const [studentEmail, setStudentEmail] = useState('');
  const [isStudentCheckout, setIsStudentCheckout] = useState(false);

  const startStudentCheckout = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!studentEmail.trim()) {
      toast.error("Please enter your .edu student email");
      return;
    }
    const domain = studentEmail.trim().toLowerCase().split('@')[1] || '';
    if (!domain.endsWith('.edu') && !domain.endsWith('.edu.au') && !domain.endsWith('.ac.uk') && !domain.endsWith('.edu.br') && !domain.endsWith('.edu.mx')) {
      toast.error("Please enter a valid .edu email address");
      return;
    }
    setIsStudentCheckout(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-student-checkout', {
        body: { studentEmail: studentEmail.trim() },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error("Error starting student checkout:", error);
      toast.error(error.message || "Failed to start student checkout");
    } finally {
      setIsStudentCheckout(false);
    }
  };

  const startDirectSubscription = async (plan: 'essential' | 'premium') => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setIsSubscribing(true);
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_status, is_student")
        .eq("id", user.id)
        .single();

      if (profile?.is_student) {
        toast.success(t('pricing.toasts.studentAccess'));
        navigate("/palace");
        return;
      }

      if (profile?.subscription_status === "active") {
        toast.success(t('pricing.toasts.activeSubscription'));
        navigate("/palace");
        return;
      }

      // Call edge function to create Stripe checkout without trial
      const { data, error } = await supabase.functions.invoke('create-subscription-checkout', {
        body: { plan, billing: billingPeriod },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error("Error starting subscription:", error);
      toast.error(t('pricing.toasts.subscriptionFailed'));
    } finally {
      setIsSubscribing(false);
    }
  };

  // 3 plans: Free Trial, Essential, Premium
  const plans = [
    {
      id: "trial",
      name: t('pricing.plans.trial.name'),
      icon: Sparkles,
      iconColor: "text-green-600",
      monthlyPrice: "$0",
      annualPrice: "$0",
      period: t('pricing.plans.trial.period'),
      description: t('pricing.plans.trial.description'),
      badge: t('pricing.plans.trial.badge'),
      badgeVariant: "default" as const,
      ctaText: t('pricing.plans.trial.cta'),
      ctaVariant: "default" as const,
      monthlyUrl: "#",
      annualUrl: "#",
      features: [
        t('pricing.plans.trial.features.allFloors'),
        t('pricing.plans.trial.features.unlimitedAI'),
        t('pricing.plans.trial.features.allGames'),
        t('pricing.plans.trial.features.sevenDaysFree'),
        t('pricing.plans.trial.features.cancelAnytime'),
      ],
    },
    {
      id: "essential",
      name: t('pricing.plans.essential.name'),
      icon: Zap,
      iconColor: "text-blue-600",
      monthlyPrice: "$9",
      annualPrice: "$90",
      monthlySavings: null,
      annualSavings: t('pricing.plans.essential.annualSavings'),
      period: t('pricing.plans.essential.period'),
      description: t('pricing.plans.essential.description'),
      badge: t('pricing.plans.essential.badge'),
      badgeVariant: "secondary" as const,
      ctaText: t('pricing.plans.essential.cta'),
      ctaVariant: "default" as const,
      monthlyUrl: paymentLinks.essentialMonthly,
      annualUrl: paymentLinks.essentialAnnual,
      features: [
        t('pricing.plans.essential.features.allFloors'),
        t('pricing.plans.essential.features.bibleReader'),
        t('pricing.plans.essential.features.coreGames'),
        t('pricing.plans.essential.features.basicAI'),
        t('pricing.plans.essential.features.emailSupport'),
      ],
    },
    {
      id: "premium",
      name: t('pricing.plans.premium.name'),
      icon: Crown,
      iconColor: "text-purple-600",
      monthlyPrice: "$15",
      annualPrice: "$150",
      monthlySavings: null,
      annualSavings: t('pricing.plans.premium.annualSavings'),
      period: t('pricing.plans.premium.period'),
      description: t('pricing.plans.premium.description'),
      badge: t('pricing.plans.premium.badge'),
      badgeVariant: "default" as const,
      ctaText: t('pricing.plans.premium.cta'),
      ctaVariant: "default" as const,
      popular: true,
      features: [
        t('pricing.plans.premium.features.allFloors'),
        t('pricing.plans.premium.features.artOfWar'),
        t('pricing.plans.premium.features.specializedAI'),
        t('pricing.plans.premium.features.unlimitedHunts'),
        t('pricing.plans.premium.features.prioritySupport'),
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <SEO title={t('pricing.seo.title')} description={t('pricing.seo.description')} />
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4 gradient-palace text-white border-0 px-4 py-2 text-sm">
            <Sparkles className="h-3 w-3 mr-1" />
            {t('pricing.hero.badge')}
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-palace bg-clip-text text-transparent mb-4">
            {t('pricing.hero.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto mb-2">
            {t('pricing.hero.subtitle')}
          </p>
          <p className="text-sm text-muted-foreground">
            {t('pricing.hero.afterTrial')}
          </p>
          
          {/* Billing Period Toggle - Enhanced */}
          <div className="flex flex-col items-center justify-center gap-4 mt-8">
            <div className="flex items-center justify-center gap-4 p-2 rounded-2xl bg-muted/50 border-2 border-primary/20">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-3 rounded-xl font-semibold text-base transition-all ${
                  billingPeriod === 'monthly' 
                    ? 'bg-background text-foreground shadow-lg scale-105' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('pricing.billing.monthly')}
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                className={`px-6 py-3 rounded-xl font-semibold text-base transition-all ${
                  billingPeriod === 'annual'
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('pricing.billing.annual')}
              </button>
            </div>
            {billingPeriod === 'annual' && (
              <Badge variant="default" className="gradient-palace text-white border-0 px-4 py-2 text-base animate-pulse">
                <Sparkles className="h-4 w-4 mr-2" />
                {t('pricing.billing.annualSavingsBadge')}
              </Badge>
            )}
          </div>
        </div>

        {/* Start Trial CTA - Primary */}
        <Card className="mb-8 border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-accent/10 max-w-2xl mx-auto shadow-xl">
          <CardContent className="p-8 text-center">
            <Badge className="mb-4 gradient-palace text-white border-0 px-4 py-2">
              <Sparkles className="h-3 w-3 mr-1" />
              {t('pricing.trialCta.badge')}
            </Badge>
            <h3 className="text-2xl font-bold mb-3">{t('pricing.trialCta.title')}</h3>
            <p className="text-muted-foreground mb-2">
              {t('pricing.trialCta.descriptionPrefix')} <span className="font-semibold text-foreground">{t('pricing.trialCta.instantAccess')}</span> {t('pricing.trialCta.descriptionSuffix')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-6 text-sm">
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary">
                <Check className="h-3 w-3" /> {t('pricing.trialCta.noCharge')}
              </span>
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-muted-foreground">
                <CreditCard className="h-3 w-3" /> {t('pricing.trialCta.cancelAnytime')}
              </span>
            </div>
            <Button
              onClick={startTrialNow}
              className="gradient-palace text-lg px-8 py-6 h-auto"
              disabled={isStartingTrial}
            >
              {isStartingTrial ? t('pricing.trialCta.starting') : t('pricing.trialCta.startButton')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              {t('pricing.trialCta.reminder')}
            </p>
          </CardContent>
        </Card>

        {/* Access Code & Gift Links */}
        <div className="text-center mb-8 space-y-3">
          <p className="text-sm text-muted-foreground mb-2">{t('pricing.accessCode.prompt')}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              variant="outline"
              className="gap-2"
            >
              <Link to="/access">
                <Gift className="h-4 w-4" />
                {t('pricing.accessCode.redeem')}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="gap-2 border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
            >
              <Link to="/gift">
                <Gift className="h-4 w-4" />
                Gift PhototheologyOS or Share a Day Pass
              </Link>
            </Button>
          </div>
        </div>

        {/* Church Plans CTA */}
        <Card className="mb-12 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 max-w-4xl mx-auto">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">{t('pricing.church.title')}</h3>
                  <p className="text-muted-foreground mb-3">
                    {t('pricing.church.description')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{t('pricing.church.campaigns')}</Badge>
                    <Badge variant="secondary">{t('pricing.church.memberManagement')}</Badge>
                    <Badge variant="secondary">{t('pricing.church.analytics')}</Badge>
                  </div>
                </div>
              </div>
              <Button 
                asChild 
                size="lg"
                className="whitespace-nowrap gap-2"
              >
                <Link to="/church-signup">
                  {t('pricing.church.viewPlans')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Student Discount */}
        <Card className="mb-12 border-2 border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 to-teal-500/10 max-w-4xl mx-auto">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-emerald-500/10">
                  <GraduationCap className="h-8 w-8 text-emerald-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-2xl font-bold">Student Plan</h3>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">$7/mo</Badge>
                  </div>
                  <p className="text-muted-foreground mb-3">
                    Full Premium access at a student rate. Just verify your .edu email to unlock the discount.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 w-full">
                    <input
                      type="email"
                      placeholder="your.name@university.edu"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                    <Button
                      onClick={startStudentCheckout}
                      disabled={isStudentCheckout}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white whitespace-nowrap gap-2"
                    >
                      {isStudentCheckout ? 'Verifying...' : 'Get Student Rate'}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Accepted: .edu, .ac.uk, .edu.au, and other academic domains
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>


        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`glass-card relative ${
                plan.popular ? "border-primary shadow-2xl shadow-primary/20 scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="gradient-palace text-white border-0">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    {t('pricing.mostPopular')}
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <div className="mx-auto mb-4 p-4 rounded-2xl bg-muted/50 w-fit">
                  <plan.icon className={`h-8 w-8 ${plan.iconColor}`} />
                </div>
                <Badge variant={plan.badgeVariant} className="mx-auto mb-2">
                  {plan.badge}
                </Badge>
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <div className="text-5xl font-bold">
                    {billingPeriod === 'monthly' ? plan.monthlyPrice : plan.annualPrice}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {plan.id === 'free' ? (
                      `/ ${plan.period}`
                    ) : billingPeriod === 'monthly' ? (
                      t('pricing.perMonth')
                    ) : (
                      t('pricing.perYear')
                    )}
                  </div>
                  {billingPeriod === 'annual' && plan.annualSavings && (
                    <Badge variant="secondary" className="mt-2">
                      {plan.annualSavings}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pb-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                {plan.id === "trial" ? (
                  <Button
                    onClick={startTrialNow}
                    variant={plan.ctaVariant}
                    className="w-full gradient-palace"
                    size="lg"
                    disabled={isStartingTrial}
                  >
                    {isStartingTrial ? t('pricing.trialCta.starting') : plan.ctaText}
                  </Button>
                ) : (
                  <Button
                    onClick={() => startDirectSubscription(plan.id as 'essential' | 'premium')}
                    variant={plan.ctaVariant}
                    className="w-full gradient-palace"
                    size="lg"
                    disabled={isSubscribing}
                  >
                    {isSubscribing ? t('pricing.processing') : `${plan.ctaText} ${billingPeriod === 'annual' ? t('pricing.annualLabel') : t('pricing.monthlyLabel')}`}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Compare Plans Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-muted/50">
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-medium">{t('pricing.comparison.title')}</span>
            </div>
          </div>
          
          <Card className="glass-card max-w-4xl mx-auto">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-semibold">{t('pricing.comparison.feature')}</th>
                      <th className="text-center p-4 font-semibold">{t('pricing.comparison.freeTrial')}</th>
                      <th className="text-center p-4 font-semibold">{t('pricing.comparison.essential')}</th>
                      <th className="text-center p-4 font-semibold bg-primary/5">{t('pricing.comparison.premium')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4">{t('pricing.comparison.rows.palace')}</td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">{t('pricing.comparison.rows.bibleReader')}</td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">{t('pricing.comparison.rows.coreGames')}</td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">{t('pricing.comparison.rows.basicAI')}</td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b bg-yellow-500/5">
                      <td className="p-4 font-semibold">{t('pricing.comparison.rows.artOfWar')}</td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4 text-muted-foreground">{t('pricing.comparison.limited')}</td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">{t('pricing.comparison.rows.specializedAI')}</td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4 text-muted-foreground">{t('pricing.comparison.basic')}</td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">{t('pricing.comparison.rows.escapeRooms')}</td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4 text-muted-foreground">{t('pricing.comparison.limited')}</td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">{t('pricing.comparison.rows.prioritySupport')}</td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4 text-muted-foreground">{t('pricing.comparison.email')}</td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Why We Require a Card - Transparency Section */}
        <Card className="glass-card mt-12 max-w-3xl mx-auto border-2 border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <CreditCard className="h-6 w-6 text-amber-600" />
              </div>
              <CardTitle>{t('pricing.cardUpfront.title')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              {t('pricing.cardUpfront.description')}
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg bg-background/50 border">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  {t('pricing.cardUpfront.aiCosts.title')}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t('pricing.cardUpfront.aiCosts.description')}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-background/50 border">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  {t('pricing.cardUpfront.sustainability.title')}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t('pricing.cardUpfront.sustainability.description')}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-background/50 border">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  {t('pricing.cardUpfront.noCharge.title')}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t('pricing.cardUpfront.noCharge.description')}
                </p>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* FAQ or Additional Info */}
        <Card className="glass-card mt-8 max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>{t('pricing.faq.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">{t('pricing.faq.cancelAnytime.question')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('pricing.faq.cancelAnytime.answer')}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">{t('pricing.faq.paymentMethods.question')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('pricing.faq.paymentMethods.answer')}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">{t('pricing.faq.whyCard.question')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('pricing.faq.whyCard.answer')}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">{t('pricing.faq.cantAfford.question')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('pricing.faq.cantAfford.answerPrefix')} <Link to="/contact" className="text-primary hover:underline">{t('pricing.faq.cantAfford.reachOut')}</Link> {t('pricing.faq.cantAfford.answerSuffix')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}
