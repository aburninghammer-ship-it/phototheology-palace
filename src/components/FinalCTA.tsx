import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const FinalCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold">
          It's Time to Study the Word<br />
          <span className="text-primary">The Way Your Mind Was Designed to Learn It</span>
        </h2>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Join thousands who are finally understanding Scripture through the visual palace system.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button
            size="lg"
            onClick={() => navigate("/pricing")}
            className="text-lg px-8 py-6 h-auto group gradient-palace"
          >
            Start 7-Day Free Trial
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              const element = document.getElementById("how-it-works");
              element?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-lg px-8 py-6 h-auto"
          >
            Watch Demo
          </Button>
          
          <Button
            size="lg"
            variant="secondary"
            onClick={() => window.open("https://phototheologygamedeck.com/", "_blank")}
            className="text-lg px-8 py-6 h-auto"
          >
            Get the Card Deck
          </Button>
        </div>

        <p className="text-sm text-muted-foreground pt-4">
          Full premium access for 7 days • Cancel anytime
        </p>

        <p className="text-sm text-muted-foreground/80 pt-2">
          <span 
            onClick={() => navigate("/auth?patreon=true")} 
            className="text-primary/80 hover:text-primary cursor-pointer underline underline-offset-2 transition-colors"
          >
            Already a Patron? Connect now for full access →
          </span>
        </p>
      </div>
    </section>
  );
};
