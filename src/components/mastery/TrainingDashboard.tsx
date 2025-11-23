import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, CheckCircle, Lock, Clock, Trophy } from "lucide-react";
import { CurriculumActivity } from "@/data/roomCurricula";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TrainingDashboardProps {
  roomName: string;
  curriculum: {
    activities: CurriculumActivity[];
  };
  completedActivities: string[];
  currentLevel: number;
  onActivityClick: (activity: CurriculumActivity) => void;
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

const getActivityColor = (type: CurriculumActivity["type"]) => {
  switch (type) {
    case "reading": return "bg-blue-500/10 border-blue-500/30 text-blue-600";
    case "drill": return "bg-green-500/10 border-green-500/30 text-green-600";
    case "exercise": return "bg-purple-500/10 border-purple-500/30 text-purple-600";
    case "milestone_test": return "bg-amber-500/10 border-amber-500/30 text-amber-600";
    case "reflection": return "bg-pink-500/10 border-pink-500/30 text-pink-600";
    default: return "bg-gray-500/10 border-gray-500/30 text-gray-600";
  }
};

export const TrainingDashboard = ({
  roomName,
  curriculum,
  completedActivities,
  currentLevel,
  onActivityClick,
}: TrainingDashboardProps) => {
  const availableActivities = curriculum.activities.filter((activity) => {
    if (activity.unlockAtLevel && activity.unlockAtLevel > currentLevel) {
      return false;
    }
    return true;
  });

  const completedCount = availableActivities.filter((a) => 
    completedActivities.includes(a.id)
  ).length;

  const completionPercentage = availableActivities.length > 0 
    ? Math.round((completedCount / availableActivities.length) * 100) 
    : 0;

  const nextActivity = availableActivities.find((a) => !completedActivities.includes(a.id));

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Training Path
            </CardTitle>
            <CardDescription>
              Your structured journey to master {roomName}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-lg px-4">
            {completedCount} / {availableActivities.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Curriculum Progress</span>
            <span className="font-semibold">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-3" />
        </div>

        {/* Next Activity Highlight */}
        {nextActivity && (
          <Card className="border-2 border-primary bg-primary/5">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <div className="text-3xl">{getActivityIcon(nextActivity.type)}</div>
                <div className="flex-1 space-y-2">
                  <div>
                    <Badge className="mb-1 text-xs">NEXT UP</Badge>
                    <h4 className="font-semibold">{nextActivity.title}</h4>
                    <p className="text-sm text-muted-foreground">{nextActivity.description}</p>
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
                  </div>
                  <Button 
                    onClick={() => onActivityClick(nextActivity)}
                    className="w-full mt-2"
                  >
                    Continue Training
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Activity Checklist */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            All Activities
          </h4>
          <div className="space-y-2">
            {availableActivities.map((activity, index) => {
              const isCompleted = completedActivities.includes(activity.id);
              const isNext = nextActivity?.id === activity.id;
              const isLocked = activity.unlockAtLevel && activity.unlockAtLevel > currentLevel;

              return (
                <div
                  key={activity.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border transition-all",
                    isCompleted && "bg-green-500/5 border-green-500/30",
                    isNext && "border-primary border-2",
                    isLocked && "opacity-50",
                    !isCompleted && !isLocked && "hover:bg-accent/50 cursor-pointer"
                  )}
                  onClick={() => !isCompleted && !isLocked && onActivityClick(activity)}
                >
                  <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">{activity.title}</span>
                      {isNext && <Badge variant="default" className="text-xs">NEXT</Badge>}
                      {activity.requiredForLevel && (
                        <Badge variant="outline" className="text-xs">
                          Required for Lv{activity.requiredForLevel}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {isCompleted && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {isLocked && (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    )}
                    {!isCompleted && !isLocked && (
                      <Button size="sm" variant="ghost">
                        Start
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Locked Activities Preview */}
        {curriculum.activities.some((a) => a.unlockAtLevel && a.unlockAtLevel > currentLevel) && (
          <div className="space-y-2 pt-4 border-t">
            <h4 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Locked Activities ({curriculum.activities.filter((a) => a.unlockAtLevel && a.unlockAtLevel > currentLevel).length})
            </h4>
            <p className="text-xs text-muted-foreground">
              Level up to unlock more advanced training activities
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
