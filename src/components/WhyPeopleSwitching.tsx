import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

const benefits = [
  "Learn Bible 5x faster with visual memory techniques",
  "Never forget a verse again with the Palace method",
  "See Christ in every chapter through proven patterns",
  "AI-guided training that reinforces long-term memory",
  "Prophecy clarity through structure, not guesswork",
  "Join 1000's who finally understand what they study",
];

export const WhyPeopleSwitching = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Why People Are Switching to Phototheology
          </h2>
          
          <p className="text-xl text-muted-foreground">
            The Bible Finally Makes Sense
          </p>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            People don't struggle because they lack hunger.<br />
            They struggle because they lack a system.
          </p>

          <div className="bg-card border rounded-lg p-8 text-left max-w-2xl mx-auto">
            <p className="text-lg font-semibold mb-6 text-center">
              Phototheology gives you:
            </p>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                  <span className="text-lg">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="text-lg px-8 py-6 h-auto"
          >
            Start Free Trial
          </Button>
        </div>
      </div>
    </section>
  );
};
