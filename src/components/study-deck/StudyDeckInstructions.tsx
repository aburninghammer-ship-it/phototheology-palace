import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, BookOpen, Lightbulb } from "lucide-react";

export const StudyDeckInstructions = () => {
  return (
    <Card className="border-2 border-primary/40 bg-gradient-to-br from-background via-primary/5 to-background relative overflow-hidden">
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 animate-pulse-glow opacity-30" />
      
      <CardHeader className="relative">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-4xl">🎴</div>
          <CardTitle className="text-2xl">How to Use the Study Deck</CardTitle>
        </div>
        <p className="text-muted-foreground">
          Transform your Bible study with Phototheology principles — three simple steps
        </p>
      </CardHeader>
      
      <CardContent className="relative">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="text-lg px-3 py-1">
                Step 1
              </Badge>
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            </div>
            <h3 className="font-bold text-xl flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              Draw a Card
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Let <strong>Jeeves pick</strong> a random principle card for you, or <strong>choose your own</strong> from the deck below. Each card represents a Phototheology lens to apply to Scripture.
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="text-lg px-3 py-1">
                Step 2
              </Badge>
              <BookOpen className="h-5 w-5 text-primary animate-pulse" />
            </div>
            <h3 className="font-bold text-xl flex items-center gap-2">
              <span className="text-2xl">📖</span>
              Apply to Passage
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Enter a <strong>verse or story</strong>, then use the card's principle to interpret, observe, or connect. Answer the card's guiding question with biblical insight.
            </p>
          </div>

          {/* Step 3 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="text-lg px-3 py-1">
                Step 3
              </Badge>
              <Lightbulb className="h-5 w-5 text-primary animate-pulse" />
            </div>
            <h3 className="font-bold text-xl flex items-center gap-2">
              <span className="text-2xl">💎</span>
              Get Feedback
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Submit your answer and receive <strong>Jeeves' feedback</strong>. Save discoveries as gems, export as PDF, or continue the conversation to deepen understanding.
            </p>
          </div>
        </div>

        {/* Quick tip */}
        <div className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-lg">
          <p className="text-sm flex items-start gap-2">
            <span className="text-xl">💡</span>
            <span>
              <strong>Pro Tip:</strong> Start with easier principles (Floor 1-2) like <Badge variant="outline" className="mx-1">SR</Badge> Story Room 
              or <Badge variant="outline" className="mx-1">OR</Badge> Observation, then advance to deeper ones like 
              <Badge variant="outline" className="mx-1">DR-2D</Badge> Christological or <Badge variant="outline" className="mx-1">@CyC</Badge> Cyrus-Christ Cycle.
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
