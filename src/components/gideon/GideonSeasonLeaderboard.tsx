// @ts-nocheck - Gideon tables not yet in generated types
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, TrendingUp, Target, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GideonSeasonStats } from "@/types/gideon";

interface GideonSeasonLeaderboardProps {
  season?: string;
}

export function GideonSeasonLeaderboard({ season }: GideonSeasonLeaderboardProps) {
  const [stats, setStats] = useState<(GideonSeasonStats & { display_name?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  const currentSeason = season || (() => {
    const now = new Date();
    const quarter = Math.ceil((now.getMonth() + 1) / 3);
    return `${now.getFullYear()}-Q${quarter}`;
  })();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("gideon_season_stats")
        .select("*")
        .eq("season", currentSeason)
        .order("total_score", { ascending: false })
        .limit(50);

      if (data) {
        // Fetch display names
        const userIds = data.map((s: any) => s.user_id);
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, display_name, username")
          .in("id", userIds);

        const profileMap = new Map(
          (profiles || []).map((p: any) => [p.id, p.display_name || p.username || "Player"])
        );

        setStats(
          data.map((s: any) => ({
            ...s,
            display_name: profileMap.get(s.user_id) || "Player",
          }))
        );
      }
      setLoading(false);
    };

    load();
  }, [currentSeason]);

  if (loading) {
    return <div className="text-center text-muted-foreground">Loading season stats...</div>;
  }

  if (stats.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          No tournament data for {currentSeason} yet. Be the first to compete!
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Season Rankings — {currentSeason}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {stats.map((stat, i) => (
          <div
            key={stat.id}
            className={cn(
              "flex items-center justify-between p-3 rounded-lg",
              i < 3 ? "bg-amber-500/5 border border-amber-500/20" : "bg-muted/50"
            )}
          >
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-muted-foreground w-6">
                #{i + 1}
              </span>
              <div>
                <p className="font-medium">{stat.display_name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{stat.tournaments_played} played</span>
                  <span>{stat.tournaments_won} won</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono font-bold">{Math.round(stat.total_score)}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-0.5">
                  <Target className="w-3 h-3" />
                  {Math.round(stat.avg_accuracy)}%
                </span>
                {stat.current_win_streak > 1 && (
                  <span className="flex items-center gap-0.5 text-amber-500">
                    <Flame className="w-3 h-3" />
                    {stat.current_win_streak}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
