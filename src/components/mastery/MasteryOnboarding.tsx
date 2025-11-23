import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Dumbbell, Crown, Sparkles, ArrowRight, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MasteryOnboardingProps {
  roomName: string;
  onStartPractice: () => void;
}

export const MasteryOnboarding = ({ roomName, onStartPractice }: MasteryOnboardingProps) => {
  return (
    <Card className="border-2 border-primary bg-gradient-to-br from-primary/10 via-accent/5 to-background">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          <CardTitle className="text-2xl">Start Your Mastery Journey</CardTitle>
        </div>
        <CardDescription className="text-base">
          Master {roomName} through practice, earn XP, and unlock exclusive rewards
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* How it Works */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            How Mastery Works
          </h3>
          
          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                1
              </div>
              <div>
                <p className="font-medium">Complete Practice Drills</p>
                <p className="text-sm text-muted-foreground">
                  Test your understanding with interactive exercises
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                2
              </div>
              <div>
                <p className="font-medium">Earn XP & Level Up</p>
                <p className="text-sm text-muted-foreground">
                  Each drill completion awards XP. Progress through 5 mastery levels
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                3
              </div>
              <div>
                <p className="font-medium">Unlock Rewards</p>
                <p className="text-sm text-muted-foreground">
                  Access AI Mentor at Expert level, earn badges, and track your growth
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mastery Levels */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">The 5 Mastery Levels</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            {[
              { level: 1, name: "Novice", color: "bg-gray-500" },
              { level: 2, name: "Apprentice", color: "bg-blue-500" },
              { level: 3, name: "Practitioner", color: "bg-green-500" },
              { level: 4, name: "Expert", color: "bg-purple-500" },
              { level: 5, name: "Master", color: "bg-amber-500" },
            ].map((item) => (
              <div
                key={item.level}
                className="flex flex-col items-center p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center text-white font-bold text-sm mb-2`}>
                  {item.level}
                </div>
                <span className="text-xs font-medium text-center">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* XP Rewards */}
        <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            XP Rewards
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Drill: <strong>25 XP</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Exercise: <strong>15 XP</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-amber-500" />
              <span>Perfect Score: <strong>+50 XP</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <span>Time Bonus: <strong>+10 XP</strong></span>
            </div>
          </div>
        </div>

        {/* Special Unlocks */}
        <div className="rounded-lg border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-500/5 p-4 space-y-2">
          <h4 className="font-semibold flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            Special Unlocks
          </h4>
          <ul className="space-y-1 text-sm">
            <li className="flex items-start gap-2">
              <Badge variant="outline" className="text-xs">Lv 4</Badge>
              <span><strong>AI Mentor Mode:</strong> Get personalized guidance and coaching</span>
            </li>
            <li className="flex items-start gap-2">
              <Badge variant="outline" className="text-xs">Lv 5</Badge>
              <span><strong>Master Badge:</strong> Display your expertise in this room</span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <Button 
          onClick={onStartPractice}
          size="lg" 
          className="w-full group"
        >
          <Dumbbell className="h-5 w-5 mr-2" />
          Start Your First Practice
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Tip: Set this as your Focus Room to prioritize your mastery journey
        </p>
      </CardContent>
    </Card>
  );
};
