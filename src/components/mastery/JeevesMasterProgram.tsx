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
    <Card className="border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/5 shadow-lg shadow-emerald-500/10">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <Bot className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <CardTitle className="text-xl mb-1 text-emerald-900 dark:text-emerald-100">
                🎯 Start Your Official Mastery Journey
              </CardTitle>
              <CardDescription className="text-base font-medium text-emerald-700 dark:text-emerald-300">
                You haven't started the {roomName} mastery program yet
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">
            <Sparkles className="h-3 w-3 mr-1" />
            Official Program
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Important Notice */}
        <div className="p-4 rounded-lg bg-emerald-500/10 border-2 border-emerald-500/30 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Target className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-emerald-900 dark:text-emerald-100">
                This is NOT casual practice — This is your official mastery program
              </p>
              <p className="text-sm text-emerald-800 dark:text-emerald-200 leading-relaxed">
                When you click "Begin Mastery Program" below, you'll officially enroll in a structured, 5-level training journey for <strong>{roomPrinciple.toLowerCase()}</strong>. Jeeves will guide you from Novice to Master with lessons, drills, and assessments. Your progress will be tracked and saved.
              </p>
            </div>
          </div>
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
            className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-base shadow-lg"
            size="lg"
          >
            <Trophy className="mr-2 h-5 w-5" />
            🚀 Yes, Start My Official Mastery Program
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
