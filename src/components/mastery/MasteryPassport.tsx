import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAllRoomMasteries } from "@/hooks/useMastery";
import { useMasteryStreak } from "@/hooks/useMasteryStreak";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Award, Star, Trophy, Flame, Crown, Target, Sparkles, Medal, Scroll } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  points: number;
  earned_at?: string;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  "🚀": <Target className="h-5 w-5" />,
  "📚": <Scroll className="h-5 w-5" />,
  "👑": <Crown className="h-5 w-5" />,
  "🏛️": <Trophy className="h-5 w-5" />,
  "⚡": <Sparkles className="h-5 w-5" />,
  "💪": <Medal className="h-5 w-5" />,
  "⭐": <Star className="h-5 w-5" />,
  "🔥": <Flame className="h-5 w-5" />,
  "🏆": <Trophy className="h-5 w-5" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  explorer: "bg-blue-500/20 text-blue-500 border-blue-500/30",
  master: "bg-purple-500/20 text-purple-500 border-purple-500/30",
  scholar: "bg-green-500/20 text-green-500 border-green-500/30",
  perfectionist: "bg-amber-500/20 text-amber-500 border-amber-500/30",
  dedicated: "bg-orange-500/20 text-orange-500 border-orange-500/30",
};

export const MasteryPassport: React.FC = () => {
  const { data: masteries } = useAllRoomMasteries();
  const { streak } = useMasteryStreak();

  // Fetch user achievements
  const { data: userAchievements } = useQuery({
    queryKey: ["user-achievements"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { earned: [], all: [] };

      // Get all achievements
      const { data: allAchievements } = await supabase
        .from("achievements")
        .select("*");

      // Get user's earned achievements
      const { data: earned } = await supabase
        .from("user_achievements")
        .select("*, achievement:achievements(*)")
        .eq("user_id", user.id);

      const earnedIds = new Set(earned?.map(e => e.achievement_id) || []);
      const earnedAchievements = earned?.map(e => ({
        ...e.achievement,
        earned_at: e.earned_at,
      })) || [];

      return {
        earned: earnedAchievements as Achievement[],
        all: allAchievements || [],
        earnedIds,
      };
    },
  });

  const roomsMastered = masteries?.filter(m => m.mastery_level === 5).length || 0;
  const totalXp = masteries?.reduce((sum, m) => sum + m.xp_current, 0) || 0;
  
  // Calculate earned points
  let earnedPoints = 0;
  userAchievements?.earned?.forEach((a: Achievement) => {
    earnedPoints += a.points || 0;
  });

  // Group earned achievements by category
  const achievementsByCategory: Record<string, Achievement[]> = {};
  userAchievements?.earned?.forEach((ach: Achievement) => {
    const cat = ach.category || "other";
    if (!achievementsByCategory[cat]) achievementsByCategory[cat] = [];
    achievementsByCategory[cat].push(ach);
  });

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-6 w-6 text-primary" />
              Mastery Passport
            </CardTitle>
            <CardDescription>Your achievements and accomplishments</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{earnedPoints}</div>
            <div className="text-xs text-muted-foreground">Total Points</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-background/50 border">
          <div className="text-center">
            <div className="text-2xl font-bold">{roomsMastered}</div>
            <div className="text-xs text-muted-foreground">Rooms Mastered</div>
          </div>
          <div className="text-center border-x">
            <div className="text-2xl font-bold">{streak?.current_streak || 0}</div>
            <div className="text-xs text-muted-foreground">Current Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{userAchievements?.earned?.length || 0}</div>
            <div className="text-xs text-muted-foreground">Badges Earned</div>
          </div>
        </div>

        {/* Achievement Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Achievement Progress</span>
            <span className="text-xs text-muted-foreground">
              {userAchievements?.earned?.length || 0} / {userAchievements?.all?.length || 0}
            </span>
          </div>
          <Progress 
            value={((userAchievements?.earned?.length || 0) / (userAchievements?.all?.length || 1)) * 100}
            className="h-2"
          />
        </div>

        {/* Earned Badges */}
        {userAchievements?.earned && userAchievements.earned.length > 0 ? (
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              Earned Badges
            </h4>
            
            {Object.entries(achievementsByCategory).map(([category, achievements]) => (
              <div key={category}>
                <h5 className="text-xs uppercase text-muted-foreground mb-2 capitalize">
                  {category}
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {achievements.map((ach) => (
                    <div
                      key={ach.id}
                      className={cn(
                        "rounded-lg border-2 p-3 text-center transition-all hover:scale-105",
                        CATEGORY_COLORS[category] || "bg-muted/50 border-border"
                      )}
                    >
                      <div className="text-2xl mb-1">
                        {ICON_MAP[ach.icon] || ach.icon}
                      </div>
                      <div className="font-semibold text-sm">{ach.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        +{ach.points} pts
                      </div>
                      {ach.earned_at && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {format(new Date(ach.earned_at), "MMM d, yyyy")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Medal className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No badges earned yet</p>
            <p className="text-sm">Complete drills and exercises to earn your first badge!</p>
          </div>
        )}

        {/* Locked Badges Preview */}
        {userAchievements?.all && userAchievements.all.length > (userAchievements?.earned?.length || 0) && (
          <div>
            <h4 className="font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Next Badges to Earn
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(userAchievements.all as any[])
                .filter((a: any) => !userAchievements.earnedIds?.has(a.id))
                .slice(0, 4)
                .map((ach: any) => (
                  <div
                    key={ach.id}
                    className="rounded-lg border border-dashed border-muted-foreground/30 p-3 text-center opacity-60"
                  >
                    <div className="text-xl mb-1 grayscale">
                      {ICON_MAP[ach.icon] || ach.icon}
                    </div>
                    <div className="font-medium text-xs">{ach.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {ach.description}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};