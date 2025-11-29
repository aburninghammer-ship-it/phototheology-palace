import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const FreeTierBanner = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const freeFeatures = [
    "Palace Floor 1 (6 Rooms)",
    "Daily Devotionals",
    "Jeeves AI (10/day)",
    "Challenges (3/week)",
    "Bible Reader",
    "Community (View Only)"
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Start Free. <span className="text-primary">No Credit Card.</span>
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Explore the basics free forever. Upgrade to unlock the full palace.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {freeFeatures.map((feature, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border/50"
            >
              <Check className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-sm font-medium">{feature}</span>
            </div>
          ))}
        </div>

        <Button
          size="lg"
          onClick={() => navigate(user ? "/palace" : "/auth")}
          className="gradient-palace text-lg px-8"
        >
          Get Started Free
        </Button>
        
        <p className="text-xs text-muted-foreground mt-4">
          Upgrade anytime to unlock all 8 floors, advanced AI, and premium features
        </p>
      </div>
    </section>
  );
};
