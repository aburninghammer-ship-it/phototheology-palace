import { Navigation } from "@/components/Navigation";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Star, Crown, Zap, GraduationCap, Building2, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();

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
      price: "$0",
      period: "7 days",
      description: "Try Phototheology risk-free",
      badge: "No Credit Card Required",
      badgeVariant: "secondary" as const,
      ctaText: "Start Free Trial",
      ctaVariant: "default" as const,
      ctaUrl: "#", // No Stripe link for free trial
      features: [
        "FULL ACCESS - Everything unlocked",
        "Access to The Palace (8 floors, 40+ rooms)",
        "The Phototheology Bible",
        "Daily Challenges",
        "All study tools",
        "Study groups",
        "My Studies library",
      ],
    },
    {
      id: "essential",
      name: "Essential",
      icon: Star,
      iconColor: "text-blue-600",
      price: "$9",
      period: "per month",
      description: "Perfect for serious Bible students",
      badge: "Payment Required",
      badgeVariant: "default" as const,
      ctaText: "Get Essential",
      ctaVariant: "default" as const,
      ctaUrl: "https://buy.stripe.com/4gM8wP6U37zoavefiY6EU07",
      features: [
        "Everything in Free Trial",
        "Phototheology GPT (main AI assistant)",
        "The Blueprint (10-lesson course)",
        "90-Day Training Course",
        "Art of War Training",
        "Unlimited Daily Challenges",
        "Sermon Builder with 5 Smooth Stones",
        "Research Mode with citations",
        "Flashcards & study games",
        "Bible Image Library",
        "Unlimited study groups",
        "Collaborative rooms",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      icon: Crown,
      iconColor: "text-purple-600",
      price: "$15",
      period: "per month",
      description: "Everything you need to master Phototheology",
      badge: "Most Popular",
      badgeVariant: "secondary" as const,
      ctaText: "Get Premium",
      ctaVariant: "default" as const,
      ctaUrl: "https://buy.stripe.com/aFa3cvemv7zo46Q9YE6EU08",
      popular: true,
      features: [
        "Everything in Essential",
        "All 5 AI Study GPTs (Kids, Daniel & Revelation, Apologetics, Lesson Quarterly)",
        "20+ Palace Games",
        "Chain Chess multiplayer",
        "Kids Games (all ages)",
        "Prophecy Watch alerts",
        "Culture & Controversy analysis",
        "Power of the Lamb devotionals",
        "Priority support",
        "Early access to new features",
      ],
    },
    {
      id: "student",
      name: "Student",
      icon: GraduationCap,
      iconColor: "text-green-600",
      price: "FREE",
      period: "for 1 year",
      description: "Full Premium access for verified students",
      badge: ".edu Email Required",
      badgeVariant: "default" as const,
      ctaText: "Verify Student Status",
      ctaVariant: "default" as const,
      ctaUrl: "/student-verify",
      features: [
        "Everything in Premium",
        "100% Free with .edu email",
        "Valid for 1 year",
        "Annual renewal required",
        "Support education",
        "All features unlocked",
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
                  <div className="text-5xl font-bold">{plan.price}</div>
                  <div className="text-sm text-muted-foreground mt-1">/ {plan.period}</div>
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
                    <Link to={plan.ctaUrl}>
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
                      href={plan.ctaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {plan.ctaText}
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
                      <td className="p-4">Memory Palace Access</td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Bible Reader & Search</td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Basic Games (Chain Chess, Verse Match)</td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Escape Rooms & Treasure Hunts</td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4 text-muted-foreground">Limited</td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">All Courses (Revelation, Daniel, etc.)</td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4 text-muted-foreground">1 Course</td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">AI Study Assistants (Jeeves, GPTs)</td>
                      <td className="text-center p-4 text-muted-foreground">Limited</td>
                      <td className="text-center p-4 text-muted-foreground">10 questions/day</td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Live Study Rooms</td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Community Features</td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                      <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Offline Access</td>
                      <td className="text-center p-4">—</td>
                      <td className="text-center p-4">—</td>
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
    </div>
  );
}
