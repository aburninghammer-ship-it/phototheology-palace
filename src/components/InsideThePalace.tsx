import { Brain, Building2, Target, Sparkles, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Building2,
    title: "Visual Memory System",
    description: "Every chapter becomes a room. Every theme becomes a floor.",
  },
  {
    icon: Target,
    title: "Pattern Detection",
    description: "Trace symbols, words, themes, and prophecies across Scripture.",
  },
  {
    icon: BookOpen,
    title: "See Jesus in Every Room",
    description: "Christ-centered pathways built into the app.",
  },
  {
    icon: Sparkles,
    title: "Guided Training With Jeeves",
    description: "AI drills, room mastery, and study pathways.",
  },
  {
    icon: Brain,
    title: "Prophecy Made Clear",
    description: "Daniel & Revelation integrated into your palace.",
  },
];

export const InsideThePalace = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          Inside the Palace
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <Icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
