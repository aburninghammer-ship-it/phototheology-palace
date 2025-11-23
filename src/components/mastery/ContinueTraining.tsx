import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Trophy, Clock } from "lucide-react";
import { CurriculumActivity } from "@/data/roomCurricula";

interface ContinueTrainingProps {
  nextActivity: CurriculumActivity | null;
  roomName: string;
  onContinue: () => void;
}

const getActivityIcon = (type: CurriculumActivity["type"]) => {
  switch (type) {
    case "reading": return "📖";
    case "drill": return "🎯";
    case "exercise": return "💪";
    case "milestone_test": return "🏆";
    case "reflection": return "📝";
    default: return "📌";
  }
};

export const ContinueTraining = ({ nextActivity, roomName, onContinue }: ContinueTrainingProps) => {
  if (!nextActivity) {
    return (
      <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
        <CardContent className="pt-6 text-center">
          <Trophy className="h-12 w-12 text-green-500 mx-auto mb-3" />
          <h3 className="font-semibold text-lg mb-2">All Caught Up! 🎉</h3>
          <p className="text-sm text-muted-foreground">
            You've completed all available activities in {roomName}.
            Keep practicing to maintain mastery!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary bg-gradient-to-br from-primary/10 to-accent/5">
      <CardContent className="pt-6">
        <Badge className="mb-3">CONTINUE YOUR TRAINING</Badge>
        <div className="flex items-start gap-4">
          <div className="text-4xl">{getActivityIcon(nextActivity.type)}</div>
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-semibold text-lg mb-1">{nextActivity.title}</h3>
              <p className="text-sm text-muted-foreground">
                {nextActivity.description}
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                +{nextActivity.xpReward} XP
              </span>
              {nextActivity.estimatedMinutes && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  ~{nextActivity.estimatedMinutes} min
                </span>
              )}
              {nextActivity.requiredForLevel && (
                <Badge variant="outline" className="text-xs">
                  Required for Level {nextActivity.requiredForLevel}
                </Badge>
              )}
            </div>

            <Button 
              onClick={onContinue}
              className="w-full group"
              size="lg"
            >
              Continue Training
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
