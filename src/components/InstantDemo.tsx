import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const InstantDemo = () => {
  const navigate = useNavigate();

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <Badge variant="secondary" className="mb-4">
          <Sparkles className="w-4 h-4 mr-2" />
          Try it now - No signup required
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          See How It Works Instantly
        </h2>
        <p className="text-muted-foreground text-lg">
          Here's a sample of how Phototheology transforms your Bible study
        </p>
      </div>

      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              John 3:16 (KJV)
            </CardTitle>
            <Badge variant="outline" className="text-xs">Floor 1: Story Room</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Bible Verse */}
          <div className="bg-background/80 backdrop-blur-sm p-6 rounded-lg border border-border/50">
            <p className="text-lg leading-relaxed italic">
              "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."
            </p>
          </div>

          {/* AI-Powered Insight */}
          <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
            <div className="flex items-start gap-3 mb-3">
              <Sparkles className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-2">Visual Memory Hook</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Picture a massive gift box labeled "The World" with arms wrapped around it. 
                  Inside the box is a radiant figure—God's Son—stepping out toward you. 
                  The gift tag reads: "Believe = Everlasting Life." This image captures God's 
                  sacrificial love and the simple condition of belief leading to eternal life.
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-background/60 rounded border border-border/30">
              <p className="text-sm font-semibold mb-2">🎯 Key Connections:</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• <span className="font-medium">Cross-reference:</span> 1 John 4:9-10 (God's love made manifest)</li>
                <li>• <span className="font-medium">Type fulfilled:</span> Bronze serpent (Numbers 21:9) → Christ lifted up</li>
                <li>• <span className="font-medium">Palace room:</span> Concentration Room (Christ-centered)</li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              size="lg" 
              onClick={() => navigate("/auth")}
              className="flex-1"
            >
              Start Your Journey Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/interactive-demo")}
              className="flex-1"
            >
              Take Full Tour
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            ✨ Unlock full access to all 8 floors, games, and personalized AI coaching
          </p>
        </CardContent>
      </Card>
    </section>
  );
};