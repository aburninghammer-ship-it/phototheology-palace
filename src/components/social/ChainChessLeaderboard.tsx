import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Award, Swords, Crown, Flame, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ChallengeInvite } from "./ChallengeInvite";

interface LeaderEntry {
  id: string;
  username: string;
  display_name: string;
  wins: number;
  losses: number;
  streak: number;
  rating: number;
}

export const ChainChessLeaderboard = () => {
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
      // Fetch profiles with game stats
      // In a real implementation, this would query a dedicated chain_chess_stats table
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, display_name, points")
        .order("points", { ascending: false })
        .limit(50);

      if (profiles) {
        // Transform to leaderboard format (simulated stats for demo)
        const leaderData: LeaderEntry[] = profiles.map((p, idx) => ({
          id: p.id,
          username: p.username || `User ${idx + 1}`,
          display_name: p.display_name || p.username || `Player ${idx + 1}`,
          wins: Math.floor((p.points || 0) / 100),
          losses: Math.floor(Math.random() * 20),
          streak: Math.floor(Math.random() * 10),
          rating: 1000 + (p.points || 0)
        }));

        setLeaders(leaderData);

        // Find user rank
        if (user) {
          const rank = leaderData.findIndex(l => l.id === user.id);
          setUserRank(rank >= 0 ? rank + 1 : null);
        }
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (index === 1) return <Medal className="h-5 w-5 text-gray-400" />;
    if (index === 2) return <Award className="h-5 w-5 text-orange-600" />;
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Swords className="h-5 w-5 text-primary" />
              Chain Chess Rankings
            </CardTitle>
            <CardDescription>Top players in biblical strategy</CardDescription>
          </div>
          <ChallengeInvite challengeType="chess" />
        </div>
      </CardHeader>
      <CardContent>
        {/* Period Tabs */}
        <Tabs value={period} onValueChange={(v) => setPeriod(v as any)} className="mb-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weekly">This Week</TabsTrigger>
            <TabsTrigger value="monthly">This Month</TabsTrigger>
            <TabsTrigger value="all">All Time</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* User's rank highlight */}
        {userRank && (
          <div className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-primary" />
                <span className="font-medium">Your Rank</span>
              </div>
              <Badge variant="secondary" className="text-lg">#{userRank}</Badge>
            </div>
          </div>
        )}

        {/* Leaderboard List */}
        <div className="space-y-2">
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            leaders.slice(0, 10).map((leader, index) => {
              const isCurrentUser = leader.id === user?.id;
              const winRate = leader.wins + leader.losses > 0 
                ? Math.round((leader.wins / (leader.wins + leader.losses)) * 100)
                : 0;

              return (
                <div
                  key={leader.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isCurrentUser 
                      ? "bg-primary/10 border border-primary/30" 
                      : "bg-muted/50 hover:bg-muted"
                  }`}
                >
                  {/* Rank */}
                  <div className="w-8 h-8 flex items-center justify-center">
                    {getRankIcon(index) || (
                      <span className="text-muted-foreground font-mono">#{index + 1}</span>
                    )}
                  </div>

                  {/* Player Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {leader.display_name}
                      {isCurrentUser && <span className="text-primary ml-2">(You)</span>}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{leader.wins}W - {leader.losses}L</span>
                      <span>•</span>
                      <span>{winRate}% WR</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-3 shrink-0">
                    {leader.streak >= 3 && (
                      <Badge variant="outline" className="gap-1">
                        <Flame className="h-3 w-3 text-orange-500" />
                        {leader.streak}
                      </Badge>
                    )}
                    <div className="text-right">
                      <div className="font-bold text-primary">{leader.rating}</div>
                      <div className="text-xs text-muted-foreground">Rating</div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* View Full Leaderboard */}
        <Button variant="ghost" className="w-full mt-4" asChild>
          <a href="/leaderboard">
            <TrendingUp className="h-4 w-4 mr-2" />
            View Full Leaderboard
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};
