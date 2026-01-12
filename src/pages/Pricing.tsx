import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Star, Crown, Zap, Building2, ArrowRight, CreditCard, Gift } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";

export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [isStartingTrial, setIsStartingTrial] = useState(false);

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

    if (trialStatus === 'success') {
      triggerCelebration();
      toast.success("🎉 Your 7-day free trial has started! Enjoy full Premium access.");
      navigate('/palace', { replace: true });
    } else if (trialStatus === 'cancelled') {
      toast.info("Trial checkout was cancelled. No worries, you can try again anytime!");
    } else if (subscriptionStatus === 'cancelled') {
      toast.info("Subscription checkout was cancelled. No worries, you can try again anytime!");
    }
  }, [searchParams, navigate]);

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
        .select("subscription_status, is_student")
        .eq("id", user.id)
        .single();

      if (profile?.is_student) {
        toast.success("You already have free student access!");
        navigate("/palace");
        return;
      }

      if (profile?.subscription_status === "active") {
        toast.success("You already have an active subscription!");
        navigate("/palace");
        return;
      }

      // Call edge function to create Stripe checkout with trial
      const { data, error } = await supabase.functions.invoke('create-trial-checkout', {
        body: { plan, billing: billingPeriod },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error("Error starting trial:", error);
      toast.error("Failed to start trial. Please try again.");
    } finally {
      setIsStartingTrial(false);
    }
  };

  const [isSubscribing, setIsSubscribing] = useState(false);

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
        toast.success("You already have free student access!");
        navigate("/palace");
        return;
      }

      if (profile?.subscription_status === "active") {
        toast.success("You already have an active subscription!");
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
      toast.error("Failed to start subscription. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  // 3 plans: Free Trial, Essential, Premium
  const plans = [
    {
      id: "trial",
      name: "7-Day Free Trial",
      icon: Sparkles,
      iconColor: "text-green-600",
      monthlyPrice: "$0",
      annualPrice: "$0",
      period: "for 7 days",
      description: "Full Premium access — no restrictions",
      badge: "Start Free Today",
      badgeVariant: "default" as const,
      ctaText: "Start Free Trial",
      ctaVariant: "default" as const,
      monthlyUrl: "#",
      annualUrl: "#",
      features: [
        "All 8 Palace Floors unlocked",
        "Unlimited AI conversations",
        "All games, courses & tools",
        "Credit card required to start",
        "Cancel anytime",
      ],
    },
    {
      id: "essential",
      name: "Essential",
      icon: Zap,
      iconColor: "text-blue-600",
      monthlyPrice: "$9",
      annualPrice: "$90",
      monthlySavings: null,
      annualSavings: "Save $18/year",
      period: "per month",
      description: "Core Bible study tools",
      badge: "Great Value",
      badgeVariant: "secondary" as const,
      ctaText: "Get Essential",
      ctaVariant: "default" as const,
      monthlyUrl: "https://buy.stripe.com/9AQ5kD1zJ2f41YI9YE6EU01",
      annualUrl: "https://buy.stripe.com/bIY14n7Y73jaaqe9YE6EU02",
      features: [
        "All 8 Palace Floors + 40+ Rooms",
        "Bible Reader with Strong's",
        "Core games & memory tools",
        "Basic AI conversations",
        "Email support",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      icon: Crown,
      iconColor: "text-purple-600",
      monthlyPrice: "$15",
      annualPrice: "$150",
      monthlySavings: null,
      annualSavings: "Save $30/year",
      period: "per month",
      description: "Complete mastery system",
      badge: "Full Access",
      badgeVariant: "default" as const,
      ctaText: "Get Premium",
      ctaVariant: "default" as const,
      popular: true,
      features: [
        "All 8 Palace Floors + 40+ Rooms",
        "Complete Art of War Dojo (30+ lessons)",
        "All 4 specialized AI GPTs",
        "Unlimited Treasure Hunts & Escape Rooms",
        "Priority support + early access",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4 gradient-palace text-white border-0">
            <Sparkles className="h-3 w-3 mr-1" />
            7-Day Free Trial • Full Access
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-palace bg-clip-text text-transparent mb-4">
            Master Bible Study for Free
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            7-day free trial. Full access. $15/mo after.
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
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                className={`px-6 py-3 rounded-xl font-semibold text-base transition-all ${
                  billingPeriod === 'annual' 
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Annual
              </button>
            </div>
            {billingPeriod === 'annual' && (
              <Badge variant="default" className="gradient-palace text-white border-0 px-4 py-2 text-base animate-pulse">
                <Sparkles className="h-4 w-4 mr-2" />
                Save 2 Months Free - Best Value!
              </Badge>
            )}
          </div>
        </div>

        {/* Start Trial CTA - Primary */}
        <Card className="mb-8 border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-accent/10 max-w-2xl mx-auto">
          <CardContent className="p-6 text-center">
            <Badge className="mb-3 gradient-palace text-white border-0">
              <Sparkles className="h-3 w-3 mr-1" />
              Most Popular Choice
            </Badge>
            <h3 className="text-xl font-bold mb-2">Start Your 7-Day Free Trial</h3>
            <p className="text-muted-foreground mb-4">
              Get instant access to all Premium features — no restrictions.
              <span className="flex items-center justify-center gap-1 mt-1 text-sm font-medium text-primary">
                <CreditCard className="h-3 w-3" /> Credit card required • Cancel anytime
              </span>
            </p>
            <Button 
              onClick={startTrialNow}
              className="gradient-palace"
              disabled={isStartingTrial}
            >
              {isStartingTrial ? "Starting..." : "Start 7-Day Free Trial"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Access Code Link */}
        <div className="text-center mb-8">
          <p className="text-sm text-muted-foreground mb-2">Have a special access code?</p>
          <Button 
            asChild
            variant="outline"
            className="gap-2"
          >
            <Link to="/access">
              <Gift className="h-4 w-4" />
              Redeem Access Code
            </Link>
          </Button>
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
                  <h3 className="text-2xl font-bold mb-2">Looking for Church Licensing?</h3>
                  <p className="text-muted-foreground mb-3">
                    Unite your entire congregation around one discipleship system. Get bulk pricing for 50-300 members.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Church-Wide Campaigns</Badge>
                    <Badge variant="secondary">Member Management</Badge>
                    <Badge variant="secondary">Analytics</Badge>
                  </div>
                </div>
              </div>
              <Button 
                asChild 
                size="lg"
                className="whitespace-nowrap gap-2"
              >
                <Link to="/church-signup">
                  View Church Plans
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Cards */}
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
                    Most Popular
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
                      '/ per month'
                    ) : (
                      '/ per year'
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
                    {isStartingTrial ? "Starting..." : plan.ctaText}
                  </Button>
                ) : (
                  <Button
                    onClick={() => startDirectSubscription(plan.id as 'essential' | 'premium')}
                    variant={plan.ctaVariant}
                    className="w-full gradient-palace"
                    size="lg"
                    disabled={isSubscribing}
                  >
                    {isSubscribing ? "Processing..." : `${plan.ctaText} ${billingPeriod === 'annual' ? '(Annual)' : '(Monthly)'}`}
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
              <span className="font-medium">Feature Comparison</span>
            </div>
          </div>
          
          <Card className="glass-card max-w-4xl mx-auto">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-semibold">Feature</th>
                      <th className="text-center p-4 font-semibold">Free Trial</th>
                      <th className="text-center p-4 font-semibold">Essential</th>
                      <th className="text-center p-4 font-semibold bg-primary/5">Premium</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4">The Palace (8 Floors, 40+ Rooms)</td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Bible Reader with Strong's</td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Core Games & Memory Tools</td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Basic AI Conversations</td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b bg-yellow-500/5">
                      <td className="p-4 font-semibold">⚔️ Art of War Dojo (30+ lessons)</td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4 text-muted-foreground">Limited</td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">All 4 Specialized AI GPTs</td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4 text-muted-foreground">Basic</td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Escape Rooms & Treasure Hunts</td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4 text-muted-foreground">Limited</td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Priority Support</td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4 text-muted-foreground">Email</td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ or Additional Info */}
        <Card className="glass-card mt-12 max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! You can cancel your subscription at any time. Your access continues until the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-sm text-muted-foreground">
                We accept all major credit cards through our secure Stripe payment processor.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Is my free trial really free?</h3>
              <p className="text-sm text-muted-foreground">
                Absolutely! No credit card required. You get full access to all features for 7 days with no commitments.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}
