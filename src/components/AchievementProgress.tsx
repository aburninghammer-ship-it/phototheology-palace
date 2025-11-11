import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Zap } from "lucide-react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  points: number;
  requirement_type: string;
  requirement_count: number;
  category: string;
}

interface AchievementProgressProps {
  achievements: Achievement[];
  userAchievements: any[];
  userStats: {
    roomsCompleted: number;
    drillsCompleted: number;
    perfectDrills: number;
    studyStreak: number;
    floorsCompleted: number;
  };
}

export function AchievementProgress({ achievements, userAchievements, userStats }: AchievementProgressProps) {
  const unlockedIds = new Set(userAchievements?.map(a => a.achievement_id) || []);
  const lockedAchievements = achievements.filter(a => !unlockedIds.has(a.id));

  const getProgress = (achievement: Achievement) => {
    let current = 0;
    const target = achievement.requirement_count;

    switch (achievement.requirement_type) {
      case "rooms_completed":
        current = userStats.roomsCompleted;
        break;
      case "drills_completed":
        current = userStats.drillsCompleted;
        break;
      case "perfect_drills":
        current = userStats.perfectDrills;
        break;
      case "study_streak":
        current = userStats.studyStreak;
        break;
      case "floors_completed":
        current = userStats.floorsCompleted;
        break;
    }

    const percentage = Math.min((current / target) * 100, 100);
    const remaining = Math.max(target - current, 0);

    return { current, target, percentage, remaining };
  };

  // Sort by closest to completion
  const sortedAchievements = lockedAchievements
    .map(achievement => ({
      ...achievement,
      ...getProgress(achievement)
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);

  if (sortedAchievements.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Achievement Progress
          </CardTitle>
          <CardDescription>
            Congratulations! You've unlocked all available achievements!
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Next Milestones
        </CardTitle>
        <CardDescription>
          You're on your way to unlocking these achievements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedAchievements.map((achievement) => (
          <div key={achievement.id} className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm">{achievement.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    {achievement.points} pts
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {achievement.description}
                </p>
              </div>
              {achievement.percentage >= 75 && (
                <Zap className="h-4 w-4 text-yellow-500 animate-pulse" />
              )}
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  {achievement.current} / {achievement.target}
                </span>
                <span className="font-medium">
                  {achievement.remaining} more to go
                </span>
              </div>
              <Progress value={achievement.percentage} className="h-2" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
