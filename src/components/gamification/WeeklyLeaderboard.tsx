import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Crown, TrendingUp, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  userId: string;
  displayName: string;
  score: number;
  rank: number;
}

export const WeeklyLeaderboard = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly" | "allTime">("weekly");

  useEffect(() => {
    const loadLeaderboard = async () => {
      // Get activity counts for users
      const { data: challenges } = await supabase
        .from("challenge_submissions")
        .select("user_id");

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name");

      if (!challenges || !profiles) return;

      // Count submissions per user
      const scoreCounts: Record<string, number> = {};
      challenges.forEach(c => {
        scoreCounts[c.user_id] = (scoreCounts[c.user_id] || 0) + 50;
      });

      // Build leaderboard
      const entries: LeaderboardEntry[] = profiles
        .map(p => ({
          userId: p.id,
          displayName: p.display_name || "Anonymous",
          score: scoreCounts[p.id] || 0,
          rank: 0,
        }))
        .filter(e => e.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map((e, idx) => ({ ...e, rank: idx + 1 }));

      setLeaderboard(entries);

      // Find user's rank
      if (user) {
        const userEntry = entries.find(e => e.userId === user.id);
        setUserRank(userEntry?.rank || null);
      }
    };

    loadLeaderboard();
  }, [user, timeframe]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Medal className="h-5 w-5 text-amber-600" />;
      default: return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return "bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-950 dark:to-amber-950 border-yellow-300";
      case 2: return "bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-900 dark:to-slate-900 border-gray-300";
      case 3: return "bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-950 dark:to-orange-950 border-amber-300";
      default: return "";
    }
  };

  return (
    <Card variant="glass" className="overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500" />
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as typeof timeframe)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weekly" className="text-xs">Weekly</TabsTrigger>
            <TabsTrigger value="monthly" className="text-xs">Monthly</TabsTrigger>
            <TabsTrigger value="allTime" className="text-xs">All Time</TabsTrigger>
          </TabsList>
        </Tabs>

        {leaderboard.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No activity yet this period</p>
            <p className="text-xs">Complete challenges to climb the ranks!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboard.slice(0, 5).map((entry) => (
              <div
                key={entry.userId}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg border transition-all",
                  getRankStyle(entry.rank),
                  entry.userId === user?.id && "ring-2 ring-primary"
                )}
              >
                <div className="w-8 flex justify-center">
                  {getRankIcon(entry.rank)}
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-xs">
                    {entry.displayName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {entry.displayName}
                    {entry.userId === user?.id && <Badge variant="outline" className="ml-2 text-[10px]">You</Badge>}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">{entry.score.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">XP</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {userRank && userRank > 5 && (
          <div className="pt-2 border-t">
            <p className="text-sm text-center text-muted-foreground">
              Your Rank: <span className="font-bold text-primary">#{userRank}</span>
            </p>
          </div>
        )}

        {!userRank && user && (
          <div className="p-3 rounded-lg bg-primary/5 text-center">
            <TrendingUp className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-sm text-muted-foreground">Complete activities to join the leaderboard!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
