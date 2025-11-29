import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Crown, Medal, Flame, Gamepad2 } from "lucide-react";

interface LeaderEntry {
  id: string;
  display_name: string;
  avatar_url: string | null;
  total_score: number;
  games_played: number;
  best_game: string;
  streak: number;
}

export const UnifiedGameRankings = () => {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState<LeaderEntry[]>([]);
  const [period, setPeriod] = useState<"weekly" | "monthly" | "all">("weekly");
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    fetchLeaders();
  }, [period, user]);

  const fetchLeaders = async () => {
    setLoading(true);
    try {
      let dateFilter = new Date();
      if (period === "weekly") {
        dateFilter.setDate(dateFilter.getDate() - 7);
      } else if (period === "monthly") {
        dateFilter.setMonth(dateFilter.getMonth() - 1);
      } else {
        dateFilter = new Date(0);
      }

      // Get aggregated scores per user
      const { data: scores, error } = await supabase
        .from("game_scores")
        .select("user_id, score, game_type, created_at")
        .gte("created_at", dateFilter.toISOString())
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Aggregate scores by user
      const userScores = new Map<string, { total: number; games: number; bestGame: string; bestScore: number }>();
      
      scores?.forEach((score) => {
        const existing = userScores.get(score.user_id) || { total: 0, games: 0, bestGame: "", bestScore: 0 };
        existing.total += score.score || 0;
        existing.games += 1;
        if ((score.score || 0) > existing.bestScore) {
          existing.bestScore = score.score || 0;
          existing.bestGame = score.game_type || "Unknown";
        }
        userScores.set(score.user_id, existing);
      });

      // Get user profiles
      const userIds = Array.from(userScores.keys());
      if (userIds.length === 0) {
        setLeaders([]);
        setLoading(false);
        return;
      }

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url")
        .in("id", userIds);

      const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

      // Build leaderboard
      const leaderboard: LeaderEntry[] = Array.from(userScores.entries())
        .map(([userId, stats]) => {
          const profile = profileMap.get(userId);
          return {
            id: userId,
            display_name: profile?.display_name || "Unknown",
            avatar_url: profile?.avatar_url || null,
            total_score: stats.total,
            games_played: stats.games,
            best_game: stats.bestGame,
            streak: Math.floor(stats.games / 3), // Simple streak calculation
          };
        })
        .sort((a, b) => b.total_score - a.total_score)
        .slice(0, 10);

      setLeaders(leaderboard);

      // Find user's rank
      if (user) {
        const allRanked = Array.from(userScores.entries())
          .sort((a, b) => b[1].total - a[1].total);
        const userIndex = allRanked.findIndex(([id]) => id === user.id);
        setUserRank(userIndex >= 0 ? userIndex + 1 : null);
      }
    } catch (error) {
      console.error("Error fetching leaders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-400" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const formatGameName = (gameType: string) => {
    return gameType
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <Card variant="glass">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <CardTitle className="text-lg">Overall Game Rankings</CardTitle>
          </div>
          <Gamepad2 className="h-5 w-5 text-muted-foreground" />
        </div>
        <CardDescription>Top players across all games</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="weekly">This Week</TabsTrigger>
            <TabsTrigger value="monthly">This Month</TabsTrigger>
            <TabsTrigger value="all">All Time</TabsTrigger>
          </TabsList>

          {userRank && (
            <div className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Your Rank</span>
                <Badge variant="secondary" className="bg-primary/20">
                  #{userRank}
                </Badge>
              </div>
            </div>
          )}

          <TabsContent value={period} className="space-y-2 mt-0">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16 ml-auto" />
                </div>
              ))
            ) : leaders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Gamepad2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No game scores yet for this period</p>
                <p className="text-sm">Play some games to appear on the leaderboard!</p>
              </div>
            ) : (
              leaders.map((leader, index) => (
                <div
                  key={leader.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    leader.id === user?.id
                      ? "bg-primary/15 border border-primary/30"
                      : "bg-muted/50 hover:bg-muted/70"
                  }`}
                >
                  <div className="w-8 flex justify-center">{getRankIcon(index + 1)}</div>
                  <Avatar className="h-9 w-9 border-2 border-background">
                    <AvatarImage src={leader.avatar_url || undefined} />
                    <AvatarFallback className="text-xs">
                      {leader.display_name?.slice(0, 2).toUpperCase() || "??"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{leader.display_name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <span>{leader.games_played} games</span>
                      <span>·</span>
                      <span className="truncate">Best: {formatGameName(leader.best_game)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">
                      {leader.total_score.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">points</div>
                  </div>
                  {leader.streak >= 3 && (
                    <Badge variant="outline" className="gap-1 border-orange-500/50">
                      <Flame className="h-3 w-3 text-orange-500" />
                      {leader.streak}
                    </Badge>
                  )}
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
