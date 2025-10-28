import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GameScore {
  id: string;
  user_id: string;
  score: number;
  mode: string | null;
  created_at: string;
  metadata: any;
  profiles: {
    display_name: string | null;
    username: string;
  };
}

interface GameLeaderboardProps {
  gameType: string;
  currentScore?: number;
}

export const GameLeaderboard = ({ gameType, currentScore }: GameLeaderboardProps) => {
  const { user } = useAuth();
  const [topScores, setTopScores] = useState<GameScore[]>([]);
  const [yourBest, setYourBest] = useState<GameScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState<"all" | "today" | "week">("all");

  useEffect(() => {
    loadScores();
  }, [gameType, timeFrame]);

  const loadScores = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("game_scores")
        .select(`
          *,
          profiles (
            display_name,
            username
          )
        `)
        .eq("game_type", gameType)
        .order("score", { ascending: false })
        .limit(10);

      // Apply time filters
      if (timeFrame === "today") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        query = query.gte("created_at", today.toISOString());
      } else if (timeFrame === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        query = query.gte("created_at", weekAgo.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;
      setTopScores(data || []);

      // Get user's best score
      if (user) {
        const { data: userScore } = await supabase
          .from("game_scores")
          .select(`
            *,
            profiles (
              display_name,
              username
            )
          `)
          .eq("game_type", gameType)
          .eq("user_id", user.id)
          .order("score", { ascending: false })
          .limit(1)
          .single();

        setYourBest(userScore);
      }
    } catch (error) {
      console.error("Error loading scores:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 1:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 2:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>;
    }
  };

  const getPlayerRank = () => {
    if (!yourBest) return null;
    const rank = topScores.findIndex(score => score.user_id === user?.id);
    return rank === -1 ? null : rank + 1;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">Loading scores...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Leaderboard
          </CardTitle>
          {currentScore !== undefined && (
            <Badge className="gradient-palace text-white">
              Your Score: {currentScore}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={timeFrame} onValueChange={(v) => setTimeFrame(v as any)} className="mb-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Time</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
          </TabsList>
        </Tabs>

        {yourBest && getPlayerRank() && (
          <div className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge className="gradient-palace text-white">Your Best</Badge>
                <span className="font-semibold">
                  {yourBest.profiles?.display_name || yourBest.profiles?.username}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">{yourBest.score}</span>
                <Badge variant="outline">Rank #{getPlayerRank()}</Badge>
              </div>
            </div>
          </div>
        )}

        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {topScores.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Trophy className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No scores yet. Be the first!</p>
              </div>
            ) : (
              topScores.map((score, index) => (
                <div
                  key={score.id}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                    score.user_id === user?.id
                      ? "bg-primary/10 border-2 border-primary/30"
                      : "bg-card hover:bg-accent/50"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 flex justify-center">{getRankIcon(index)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">
                        {score.profiles?.display_name || score.profiles?.username}
                        {score.user_id === user?.id && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            You
                          </Badge>
                        )}
                      </div>
                      {score.mode && (
                        <div className="text-xs text-muted-foreground">
                          {score.mode}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-bold text-lg text-primary">{score.score}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(score.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
