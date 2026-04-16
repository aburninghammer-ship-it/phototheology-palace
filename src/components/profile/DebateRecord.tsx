import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface DebateRecordProps {
  userId: string;
}

interface DebateSession {
  id: string;
  topic: string;
  opponent_name?: string;
  outcome: string;
  difficulty: string;
  rounds_completed: number;
  xp_earned: number;
  completed_at: string;
}

const OUTCOME_STYLES: Record<string, string> = {
  win: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  loss: "bg-red-500/10 text-red-600 border-red-500/30",
  draw: "bg-amber-500/10 text-amber-600 border-amber-500/30",
};

export function DebateRecord({ userId }: DebateRecordProps) {
  const [sessions, setSessions] = useState<DebateSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchSessions = async () => {
      try {
        const { data } = await (supabase as any)
          .from("debate_challenge_sessions")
          .select("id, topic, opponent_name, outcome, difficulty, rounds_completed, xp_earned, completed_at")
          .eq("user_id", userId)
          .eq("is_public", true)
          .not("outcome", "is", null)
          .order("completed_at", { ascending: false })
          .limit(50);
        setSessions(data || []);
      } catch (err) {
        console.error("Error fetching debate sessions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-20 rounded-lg bg-muted/50" />
        <div className="h-32 rounded-lg bg-muted/50" />
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Shield className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
        <p className="text-muted-foreground">No public debate records yet.</p>
      </Card>
    );
  }

  const wins = sessions.filter((s) => s.outcome === "win").length;
  const losses = sessions.filter((s) => s.outcome === "loss").length;
  const draws = sessions.filter((s) => s.outcome === "draw").length;
  const totalXp = sessions.reduce((acc, s) => acc + (s.xp_earned || 0), 0);
  const winRate = sessions.length > 0 ? Math.round((wins / sessions.length) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <Card className="p-4">
        <div className="flex items-center gap-3 flex-wrap mb-3">
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">{wins}W</Badge>
          <Badge className="bg-red-500/10 text-red-600 border-red-500/30">{losses}L</Badge>
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30">{draws}D</Badge>
          <Badge variant="secondary">{totalXp.toLocaleString()} XP</Badge>
        </div>
        {/* Win rate bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Win Rate</span>
            <span>{winRate}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${winRate}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Recent sessions */}
      <div className="space-y-2">
        {sessions.slice(0, 10).map((session) => (
          <Card key={session.id} className="p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{session.topic || "Debate"}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant="outline" className={OUTCOME_STYLES[session.outcome] || ""}>
                    {session.outcome}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">{session.difficulty}</Badge>
                  <span className="text-[10px] text-muted-foreground">{session.rounds_completed} rounds</span>
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0">
                {session.completed_at && format(new Date(session.completed_at), "MMM d")}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
