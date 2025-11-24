import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, BookOpen, Trophy, Target, Sparkles } from "lucide-react";
import { useState } from "react";

interface JeevesMasterProgramProps {
  roomName: string;
  roomPrinciple: string;
  onStartProgram: () => void;
}

export const JeevesMasterProgram = ({
  roomName,
  roomPrinciple,
  onStartProgram
}: JeevesMasterProgramProps) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl mb-1">
                Master {roomName} with Jeeves
              </CardTitle>
              <CardDescription className="text-base">
                Your AI guide through a structured mastery program
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            <Sparkles className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Welcome Message */}
        <div className="p-4 rounded-lg bg-card border space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Bot className="h-4 w-4 text-primary" />
            <span>Jeeves says:</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            "Welcome! I'm Jeeves, your personal Phototheology mentor. I'll guide you through mastering <strong>{roomPrinciple.toLowerCase()}</strong>. Together, we'll progress through 5 levels—from Novice to Master—using structured lessons, practice drills, and personalized feedback."
          </p>
        </div>

        {/* Program Features */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
            <BookOpen className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Structured Curriculum</p>
              <p className="text-xs text-muted-foreground">Step-by-step lessons designed for lasting comprehension</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
            <Target className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Interactive Drills</p>
              <p className="text-xs text-muted-foreground">Practice with instant feedback and explanations</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
            <Trophy className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Milestone Assessments</p>
              <p className="text-xs text-muted-foreground">Prove your mastery at each level to unlock the next</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
            <Bot className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Personalized Guidance</p>
              <p className="text-xs text-muted-foreground">Ask questions and get tailored explanations anytime</p>
            </div>
          </div>
        </div>

        {/* Program Overview */}
        {showDetails && (
          <ScrollArea className="h-64 rounded-lg border bg-card p-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-500/20 flex items-center justify-center text-xs">1</span>
                  Level 1: Novice
                </h4>
                <p className="text-xs text-muted-foreground ml-8">
                  Learn the foundational concepts. Complete introductory readings and basic drills. Pass your first assessment to advance.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs">2</span>
                  Level 2: Apprentice
                </h4>
                <p className="text-xs text-muted-foreground ml-8">
                  Build on your foundation with intermediate exercises. Apply the principle in various contexts. Develop consistency through practice.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs">3</span>
                  Level 3: Practitioner
                </h4>
                <p className="text-xs text-muted-foreground ml-8">
                  Demonstrate confident application. Teach others the principle. Create your own examples and connections.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs">4</span>
                  Level 4: Expert
                </h4>
                <p className="text-xs text-muted-foreground ml-8">
                  Deep understanding and intuitive application. Unlock Mentor Mode for advanced AI guidance. Help others through their journey.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-300/20 flex items-center justify-center text-xs">5</span>
                  Level 5: Master
                </h4>
                <p className="text-xs text-muted-foreground ml-8">
                  Complete mastery. The principle is permanently encoded in your thinking. You can teach, apply, and expand upon it effortlessly.
                </p>
              </div>
            </div>
          </ScrollArea>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <Button 
            onClick={onStartProgram}
            className="w-full h-11 gradient-palace"
            size="lg"
          >
            <Trophy className="mr-2 h-5 w-5" />
            Begin Mastery Program
          </Button>
          
          <Button
            onClick={() => setShowDetails(!showDetails)}
            variant="ghost"
            size="sm"
            className="text-xs"
          >
            {showDetails ? "Hide" : "View"} Program Details
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground pt-2 border-t">
          💡 Your progress is saved automatically. You can pause and resume anytime.
        </p>
      </CardContent>
    </Card>
  );
};
