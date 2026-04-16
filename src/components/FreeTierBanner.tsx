import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, ArrowRight, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const FreeTierBanner = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const trialFeatures = [
    { name: "All 8 Palace Floors", description: "Complete visual Bible study system" },
    { name: "Unlimited Jeeves AI", description: "AI-powered Bible analysis" },
    { name: "All Premium Games", description: "Full access to 20+ games" },
    { name: "Art of War Dojo", description: "Complete spiritual warfare training" },
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="max-w-4xl mx-auto text-center">
        <Badge className="mb-4 gap-1 gradient-palace text-white border-0">
          <Sparkles className="h-3 w-3" />
          30-Day Free Trial
        </Badge>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Try Everything Free for 30 Days. <span className="text-primary">No Restrictions.</span>
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Experience the complete Palace for 30 days. Choose your plan when you're ready.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {trialFeatures.map((feature, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border/50 text-left"
            >
              <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-sm font-medium block">{feature.name}</span>
                <span className="text-xs text-muted-foreground">{feature.description}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Button
            size="lg"
            onClick={() => navigate(user ? "/pricing" : "/auth")}
            className="gradient-palace text-lg px-8 gap-2"
          >
            Start 30-Day Free Trial
            <ArrowRight className="h-5 w-5" />
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/pricing")}
            className="gap-2"
          >
            <Gift className="h-4 w-4" />
            View All Plans
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mt-6">
          Full premium access for 30 days. Cancel anytime.
        </p>
      </div>
    </section>
  );
};
