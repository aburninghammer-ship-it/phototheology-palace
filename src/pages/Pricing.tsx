import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Star, Crown, Zap, GraduationCap, Building2, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const startFreeTrial = async () => {
    if (!user) {
      // Not logged in, redirect to auth
      navigate("/auth");
      return;
    }

    try {
      // Check if user already has an active trial or subscription
      const { data: profile } = await supabase
        .from("profiles")
        .select("trial_started_at, trial_ends_at, subscription_status, is_student")
        .eq("id", user.id)
        .single();

      if (profile?.is_student) {
        toast.success("You already have free student access!");
        navigate("/");
        return;
      }

      if (profile?.subscription_status === "active") {
        toast.success("You already have an active subscription!");
        navigate("/");
        return;
      }

      if (profile?.trial_started_at && profile?.trial_ends_at) {
        const trialEnd = new Date(profile.trial_ends_at);
        if (trialEnd > new Date()) {
          toast.success("Your free trial is already active!");
          navigate("/");
          return;
        }
      }

      // Start free trial
      const trialStartDate = new Date();
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 7);

      const { error } = await supabase
        .from("profiles")
        .update({
          trial_started_at: trialStartDate.toISOString(),
          trial_ends_at: trialEndDate.toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("🎉 Free trial activated! Enjoy 7 days of full access.");
      navigate("/");
    } catch (error: any) {
      console.error("Error starting trial:", error);
      toast.error("Failed to start trial. Please try again.");
    }
  };

  const plans = [
    {
      id: "free",
      name: "Free Trial",
      icon: Sparkles,
      iconColor: "text-gray-600",
      monthlyPrice: "$0",
      annualPrice: "$0",
      period: "7 days",
      description: "Try Phototheology risk-free",
      badge: "No Credit Card Required",
      badgeVariant: "secondary" as const,
      ctaText: "Start Free Trial",
      ctaVariant: "default" as const,
      monthlyUrl: "#",
      annualUrl: "#",
      features: [
        "FULL ACCESS - Everything unlocked for 7 days",
        "The Palace (8 floors, 40+ rooms)",
        "Bible Reader with search & Strong's",
        "Daily Challenges & Training Drills",
        "Core games (Chain Chess, Verse Match)",
        "Live Study Rooms",
        "Community & Study Partners",
        "Basic AI assistance",
      ],
    },
    {
      id: "essential",
      name: "Essential",
      icon: Star,
      iconColor: "text-blue-600",
      monthlyPrice: "$9",
      annualPrice: "$90",
      monthlySavings: null,
      annualSavings: "Save $18/year",
      period: "per month",
      description: "Perfect for serious Bible students",
      badge: "Best Value",
      badgeVariant: "default" as const,
      ctaText: "Get Essential",
      ctaVariant: "default" as const,
      monthlyUrl: "https://buy.stripe.com/4gM8wP6U37zoavefiY6EU07",
      annualUrl: "https://buy.stripe.com/4gM8wPguD4ncdHqc6M6EU0a",
      features: [
        "Everything in Free Trial (continued)",
        "Phototheology GPT - Main AI Assistant",
        "The Blueprint Course (10 lessons)",
        "90-Day Phototheology Training Course",
        "Bible Rendered Room with visual frames",
        "Sermon Builder with 5 Smooth Stones method",
        "Research Mode with citations",
        "Flashcards & Memory Tools",
        "Bible Image Library access",
        "Growth Journal & Spiritual Training",
        "Unlimited Daily Challenges",
        "Treasure Hunts & Escape Rooms (limited)",
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
      description: "Everything you need to master Phototheology",
      badge: "Most Popular",
      badgeVariant: "secondary" as const,
      ctaText: "Get Premium",
      ctaVariant: "default" as const,
      monthlyUrl: "https://buy.stripe.com/aFa3cvemv7zo46Q9YE6EU08",
      annualUrl: "https://buy.stripe.com/eVq8wPfqz06WcDm7Qw6EU0b",
      popular: true,
      features: [
        "Everything in Essential",
        "All 4 Specialized AI GPTs:",
        "  • Kid GPT (family-friendly learning)",
        "  • Daniel & Revelation GPT",
        "  • Apologetics GPT",
        "  • Quarterly Study GPT",
        "All 4 Courses (Daniel, Revelation, Revelation Kids)",
        "20+ Palace-based Games (Story Room, Blue Room, etc.)",
        "Advanced multiplayer games",
        "All Kids Games (age-appropriate content)",
        "Unlimited Treasure Hunts & Escape Rooms",
        "Prophecy Watch alerts",
        "Culture & Controversy analysis",
        "Critics Analysis tool",
        "Power of the Lamb devotionals",
        "Bible Study Leader tools",
        "Priority support",
        "Early access to new features",
      ],
    },
    {
      id: "student",
      name: "Student",
      icon: GraduationCap,
      iconColor: "text-green-600",
      monthlyPrice: "$4.99",
      annualPrice: "$49.99",
      period: "per month",
      description: "Full Premium access for verified students",
      badge: ".edu Email Required",
      badgeVariant: "default" as const,
      ctaText: "Verify Student Status",
      ctaVariant: "default" as const,
      monthlyUrl: "/student-verify",
      annualUrl: "/student-verify",
      features: [
        "Everything in Premium - 100% FREE",
        "All AI GPTs unlocked",
        "All courses & games",
        "Valid for 1 academic year",
        "Simple annual renewal with .edu email",
        "Support Christian education",
        "No credit card ever required",
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
            <Zap className="h-3 w-3 mr-1" />
            7-Day Free Trial • No Credit Card Required
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-palace bg-clip-text text-transparent mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start with a free trial, upgrade anytime to unlock more features
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
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
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
                    ) : plan.id === 'student' ? (
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
                {plan.id === "student" ? (
                  <Button
                    asChild
                    variant={plan.ctaVariant}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    <Link to={billingPeriod === 'monthly' ? plan.monthlyUrl : plan.annualUrl}>
                      {plan.ctaText}
                    </Link>
                  </Button>
                ) : plan.id === "free" ? (
                  <Button
                    onClick={startFreeTrial}
                    variant={plan.ctaVariant}
                    className="w-full"
                    size="lg"
                  >
                    {plan.ctaText}
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant={plan.ctaVariant}
                    className="w-full gradient-palace"
                    size="lg"
                  >
                    <a
                      href={billingPeriod === 'monthly' ? plan.monthlyUrl : plan.annualUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {plan.ctaText} {billingPeriod === 'annual' ? '(Annual)' : '(Monthly)'}
                    </a>
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
          
          <Card className="glass-card max-w-5xl mx-auto">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-semibold">Feature</th>
                      <th className="text-center p-4 font-semibold">Free Trial</th>
                      <th className="text-center p-4 font-semibold">Essential</th>
                      <th className="text-center p-4 font-semibold bg-primary/5">Premium</th>
                      <th className="text-center p-4 font-semibold">Student</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4">The Palace (8 Floors, 40+ Rooms)</td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Bible Reader with Strong's & Chain References</td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Core Games (Chain Chess, Verse Match, etc.)</td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">20+ Palace-Based Games</td>
                      <td className="text-center p-4">—</td>
                      <td className="text-center p-4">—</td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Kids Games (All Ages)</td>
                      <td className="text-center p-4">—</td>
                      <td className="text-center p-4">—</td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Escape Rooms & Treasure Hunts</td>
                      <td className="text-center p-4">—</td>
                      <td className="text-center p-4 text-muted-foreground">Limited</td>
                      <td className="text-center p-4 bg-primary/5">Unlimited</td>
                      <td className="text-center p-4">Unlimited</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Phototheology GPT (Main AI)</td>
                      <td className="text-center p-4 text-muted-foreground">Limited</td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">All 4 Specialized AI GPTs</td>
                      <td className="text-center p-4">—</td>
                      <td className="text-center p-4">—</td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">The Blueprint Course</td>
                      <td className="text-center p-4">—</td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">All Courses (Daniel, Revelation, Kids)</td>
                      <td className="text-center p-4">—</td>
                      <td className="text-center p-4">—</td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Sermon Builder & 5 Smooth Stones</td>
                      <td className="text-center p-4">—</td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Research Mode with Citations</td>
                      <td className="text-center p-4">—</td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Bible Image Library</td>
                      <td className="text-center p-4">—</td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Prophecy Watch & Culture Analysis</td>
                      <td className="text-center p-4">—</td>
                      <td className="text-center p-4">—</td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Live Study Rooms & Partners</td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Community & Leaderboards</td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="p-4">Priority Support</td>
                      <td className="text-center p-4">—</td>
                      <td className="text-center p-4">—</td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
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
            <div>
              <h3 className="font-semibold mb-2">How does the student plan work?</h3>
              <p className="text-sm text-muted-foreground">
                Students with a valid .edu email get free Premium access for 1 year. After that, you'll need to verify your student status again to renew.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}
