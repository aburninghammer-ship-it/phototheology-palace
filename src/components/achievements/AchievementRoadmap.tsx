import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Map, Trophy, ChevronRight, Lock, CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTierFromPoints, tierColors, tierLabels, requirementRoutes, getRequirementLabel } from "@/utils/achievementHelpers";
import { categoryIcons, categoryColors } from "@/utils/categoryIcons";

interface Achievement {
  id: string;
  name: string;
  description: string;
  points: number;
  requirement_type: string;
  requirement_count: number;
  category: string;
  icon: string;
}

interface AchievementRoadmapProps {
  achievements: Achievement[];
  userAchievements: Set<string>;
  userStats: {
    roomsCompleted: number;
    drillsCompleted: number;
    perfectDrills: number;
    studyStreak: number;
    floorsCompleted: number;
  };
}

export function AchievementRoadmap({ achievements, userAchievements, userStats }: AchievementRoadmapProps) {
  const navigate = useNavigate();

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

    return { current, target, percentage: Math.min((current / target) * 100, 100) };
  };

  // Group achievements by category
  const categories = Array.from(new Set(achievements.map(a => a.category || 'general')));
  
  const groupedAchievements = categories.map(category => {
    const categoryAchievements = achievements
      .filter(a => a.category === category)
      .sort((a, b) => (a.points || 0) - (b.points || 0)); // Sort by points ascending (easiest first)
    
    const unlocked = categoryAchievements.filter(a => userAchievements.has(a.id)).length;
    const total = categoryAchievements.length;
    
    return {
      category,
      achievements: categoryAchievements,
      unlocked,
      total,
      progress: (unlocked / total) * 100,
    };
  }).sort((a, b) => b.progress - a.progress); // Show most progress first

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5 text-primary" />
            Achievement Roadmap
          </CardTitle>
          <CardDescription>
            Your journey through Phototheology mastery — complete achievements to unlock the next tier
          </CardDescription>
        </CardHeader>
      </Card>

      {groupedAchievements.map(({ category, achievements: catAchievements, unlocked, total, progress }) => {
        const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons] || Trophy;
        const colorGradient = categoryColors[category as keyof typeof categoryColors] || categoryColors.general;

        return (
          <Card key={category} className="overflow-hidden">
            <CardHeader className={`bg-gradient-to-r ${colorGradient} text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <CategoryIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="capitalize text-white">{category} Path</CardTitle>
                    <CardDescription className="text-white/80">
                      {unlocked} of {total} completed
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  {Math.round(progress)}%
                </Badge>
              </div>
              <Progress value={progress} className="h-2 mt-3 bg-white/20" />
            </CardHeader>

            <CardContent className="p-0">
              <div className="relative">
                {/* Vertical line connecting achievements */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

                {catAchievements.map((achievement, index) => {
                  const isUnlocked = userAchievements.has(achievement.id);
                  const { current, target, percentage } = getProgress(achievement);
                  const tier = getTierFromPoints(achievement.points || 0);
                  const tierStyle = tierColors[tier];
                  const route = requirementRoutes[achievement.requirement_type];
                  const isNext = !isUnlocked && index > 0 && userAchievements.has(catAchievements[index - 1]?.id);
                  const isFirst = index === 0 && !isUnlocked;

                  return (
                    <div
                      key={achievement.id}
                      className={cn(
                        "relative flex items-start gap-4 p-4 border-b last:border-b-0 transition-colors",
                        isUnlocked && "bg-green-50/50 dark:bg-green-900/10",
                        (isNext || isFirst) && "bg-primary/5"
                      )}
                    >
                      {/* Node on the timeline */}
                      <div className="relative z-10 flex-shrink-0">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center border-2",
                            isUnlocked
                              ? "bg-green-500 border-green-500 text-white"
                              : percentage >= 75
                              ? "bg-yellow-100 border-yellow-500 text-yellow-700"
                              : "bg-background border-muted-foreground/30 text-muted-foreground"
                          )}
                        >
                          {isUnlocked ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : percentage >= 75 ? (
                            <Sparkles className="h-4 w-4" />
                          ) : (
                            <Lock className="h-3 w-3" />
                          )}
                        </div>
                      </div>

                      {/* Achievement content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xl">{achievement.icon || '🏆'}</span>
                              <h4 className={cn(
                                "font-semibold",
                                !isUnlocked && "text-muted-foreground"
                              )}>
                                {achievement.name}
                              </h4>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs",
                                  `bg-gradient-to-r ${tierStyle.gradient} text-white border-0`
                                )}
                              >
                                {tierLabels[tier]}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {achievement.description}
                            </p>
                          </div>

                          <Badge variant="secondary" className="flex-shrink-0">
                            +{achievement.points} pts
                          </Badge>
                        </div>

                        {/* Progress for locked achievements */}
                        {!isUnlocked && (
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">
                                {getRequirementLabel(achievement.requirement_type, achievement.requirement_count)}
                              </span>
                              <span className="font-medium">
                                {current}/{target}
                              </span>
                            </div>
                            <Progress value={percentage} className="h-1.5" />
                            
                            {route && (isNext || isFirst || percentage > 0) && (
                              <Button
                                size="sm"
                                variant={isNext || isFirst ? "default" : "outline"}
                                className="mt-2 gap-1"
                                onClick={() => navigate(route.path)}
                              >
                                {route.label}
                                <ChevronRight className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        )}

                        {isUnlocked && (
                          <Badge variant="outline" className="mt-2 text-green-600 border-green-300 bg-green-50">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
