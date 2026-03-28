import { useState } from "react";
import { Heart, Zap, Globe, BookOpen, Users, Headphones, Shield, ArrowLeft, Server, TrendingUp, DollarSign, Coffee, Gift, Crown } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const PRESET_AMOUNTS = [5, 25, 50, 100, 250, 500];

const IMPACT_ITEMS = [
  { icon: BookOpen, text: "Add more advanced commentary capabilities" },
  { icon: Zap, text: "Expand the Phototheology Palace with new rooms, tools, and learning paths" },
  { icon: Shield, text: "Improve system speed and stability" },
  { icon: Headphones, text: "Integrate better audio, music, and multilingual features" },
  { icon: Users, text: "Build discipleship courses and ministry labs directly into the app" },
  { icon: Heart, text: "Provide scholarships for those who cannot afford subscriptions" },
  { icon: Globe, text: "Keep app access as affordable as possible for everyone" },
];

const SUPPORT_TIERS = [
  { amount: 5, label: "Supporter", icon: Coffee, description: "A small gift with a big impact. Every dollar helps keep the servers running.", color: "text-amber-500" },
  { amount: 25, label: "Partner", icon: Gift, description: "Covers a portion of AI processing costs for one day of Jeeves commentary.", color: "text-emerald-500" },
  { amount: 50, label: "Builder", icon: Zap, description: "Helps fund a day of development work on new features and rooms.", color: "text-blue-500" },
  { amount: 100, label: "Champion", icon: Shield, description: "Covers server and database costs for hundreds of active users.", color: "text-purple-500" },
  { amount: 250, label: "Patron", icon: Crown, description: "Funds a full week of infrastructure and AI costs as we scale.", color: "text-amber-400" },
  { amount: 500, label: "Pillar", icon: Heart, description: "A transformative gift that directly accelerates the next major release.", color: "text-rose-500" },
];

export default function DonationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDonate = async () => {
    const amount = selectedAmount || Number(customAmount);
    
    if (!amount || amount < 1) {
      toast.error("Please select or enter a valid amount");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-donation", {
        body: { email: user?.email, amount },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Donation error:", error);
      toast.error("Failed to start donation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Donate" description="Support the Phototheology mission. As more users join, costs grow. Your one-time donation helps keep PhototheologyOS running and accessible for everyone." />
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="text-center">
            <Heart className="h-16 w-16 text-primary mx-auto mb-6 animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Help Keep Phototheology Running
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mt-4 max-w-2xl mx-auto">
              As our community grows, so do the costs to keep PhototheologyOS alive and improving. Your one-time donation makes a real difference.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* The Reality Section */}
        <Card className="border-destructive/30 bg-destructive/5 mb-10">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-destructive/10 text-destructive shrink-0">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">Here's the reality</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Every user who joins Phototheology increases the cost to run it. AI commentary from Jeeves, real-time study tools, server bandwidth, database storage, cloud hosting — <strong className="text-foreground">these costs scale with every new person who walks through the Palace doors.</strong>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost breakdown */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <Card className="border-border">
            <CardContent className="p-5 text-center">
              <Server className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-1">Server & Hosting</h3>
              <p className="text-sm text-muted-foreground">Databases, cloud infrastructure, and bandwidth grow with every active user</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-5 text-center">
              <Zap className="h-8 w-8 text-amber-500 mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-1">AI Processing</h3>
              <p className="text-sm text-muted-foreground">Jeeves commentary, study analysis, and intelligent features require real-time AI calls</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-5 text-center">
              <Shield className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-1">Development</h3>
              <p className="text-sm text-muted-foreground">New rooms, features, bug fixes, and security updates require ongoing development</p>
            </CardContent>
          </Card>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-lg text-muted-foreground leading-relaxed">
            We want Phototheology to remain <strong className="text-foreground">accessible and affordable for everyone</strong> — students, pastors, parents, missionaries, and anyone hungry for deeper Bible study. But the more our community grows, the harder it becomes to keep costs manageable without help.
          </p>

          <Card className="my-8 border-primary/20 bg-primary/5 not-prose">
            <CardContent className="p-6 md:p-8 text-center">
              <DollarSign className="h-10 w-10 text-primary mx-auto mb-4" />
              <p className="text-xl font-bold text-foreground mb-2">
                This is not a subscription. This is not recurring.
              </p>
              <p className="text-muted-foreground">
                Just a one-time gift at whatever level feels right for you. Whether it's $5 or $500, every donation goes directly toward keeping the lights on and building what's next.
              </p>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
            Your donation directly fuels the mission.
          </h2>

          <p className="text-muted-foreground leading-relaxed">
            When you give, you're not just supporting an app — you're investing in a <strong className="text-foreground">global discipleship ecosystem</strong> designed to train people to study Scripture deeply, share the gospel boldly, and build ministries that change lives.
          </p>

          <h3 className="text-xl font-semibold text-foreground mt-10 mb-6">
            Your donation helps us:
          </h3>

          <div className="grid gap-4 not-prose">
            {IMPACT_ITEMS.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors"
              >
                <div className="p-2 rounded-full bg-primary/10 text-primary shrink-0">
                  <item.icon className="h-5 w-5" />
                </div>
                <p className="text-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Support Tiers */}
        <div className="mt-14 mb-10">
          <h2 className="text-2xl font-bold text-foreground text-center mb-2">Choose Your Level of Support</h2>
          <p className="text-center text-muted-foreground mb-8">Every tier is a one-time gift. Pick what feels right.</p>

          <div className="grid md:grid-cols-2 gap-4">
            {SUPPORT_TIERS.map((tier) => (
              <Card
                key={tier.amount}
                className={`cursor-pointer transition-all hover:shadow-lg ${selectedAmount === tier.amount ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/40'}`}
                onClick={() => { setSelectedAmount(tier.amount); setCustomAmount(""); }}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-full bg-card border shrink-0 ${tier.color}`}>
                      <tier.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">{tier.label}</span>
                          <Badge variant="secondary" className="text-xs">${tier.amount}</Badge>
                        </div>
                        {selectedAmount === tier.amount && (
                          <Badge className="bg-primary text-primary-foreground text-xs">Selected</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{tier.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Donation Card */}
        <Card className="border-2 border-primary/30">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-foreground text-center mb-2">
              Make a One-Time Donation
            </h3>
            <p className="text-center text-muted-foreground mb-6">Select a tier above, choose a preset amount, or enter your own.</p>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
              {PRESET_AMOUNTS.map((amount) => (
                <Button
                  key={amount}
                  variant={selectedAmount === amount ? "default" : "outline"}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount("");
                  }}
                  className="text-lg font-semibold"
                >
                  ${amount}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-muted-foreground whitespace-nowrap">Or enter custom:</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                  className="pl-8"
                  min="1"
                />
              </div>
            </div>

            <Button
              onClick={handleDonate}
              disabled={isLoading || (!selectedAmount && !customAmount)}
              size="lg"
              className="w-full text-lg py-6"
            >
              <Heart className="mr-2 h-5 w-5" />
              {isLoading ? "Processing..." : `Donate ${selectedAmount ? `$${selectedAmount}` : customAmount ? `$${customAmount}` : ""}`}
            </Button>

            <p className="text-center text-xs text-muted-foreground mt-4">
              Secure payment via Stripe. One-time charge only — no recurring billing.
            </p>
          </CardContent>
        </Card>

        {/* Closing */}
        <div className="mt-12 text-center">
          <div className="my-8 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Every gift — large or small — keeps this mission moving.
            </h3>
            <p className="text-muted-foreground">
              You help create a world where anyone, anywhere, can study the Bible with clarity, depth, and joy.
              <br />
              You help build tools that will impact homes, churches, ministries, and entire communities.
            </p>
          </div>
          <p className="text-lg text-muted-foreground italic">
            Thank you for standing with us.
          </p>
          <p className="text-xl font-semibold text-foreground mt-2">
            Together, we are building something far bigger than an app — we are building a movement.
          </p>
        </div>
      </div>
    </div>
  );
}
