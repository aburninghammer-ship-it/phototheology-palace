import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Brain, CheckCircle2, Loader2, Trophy, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface WeeklyMemoryVerseProps {
  churchId: string;
}

const STATUS_LABELS: Record<string, string> = {
  started: "Just Started",
  practicing: "Practicing",
  memorized: "Memorized",
  mastered: "Mastered",
};

const STATUS_ORDER = ["started", "practicing", "memorized", "mastered"];

export function WeeklyMemoryVerse({ churchId }: WeeklyMemoryVerseProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [verse, setVerse] = useState<any>(null);
  const [myProgress, setMyProgress] = useState<any>(null);
  const [congregationStats, setCongregationStats] = useState({ total: 0, mastered: 0, practicing: 0 });

  useEffect(() => {
    if (user && churchId) loadData();
  }, [user, churchId]);

  const loadData = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const { data: verseData } = await (supabase as any)
        .from("church_weekly_verses")
        .select("*")
        .eq("church_id", churchId)
        .lte("week_start", today)
        .gte("week_end", today)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!verseData) {
        setLoading(false);
        return;
      }
      setVerse(verseData);

      const [progressRes, statsRes] = await Promise.all([
        (supabase as any).from("church_weekly_verse_progress")
          .select("*")
          .eq("weekly_verse_id", verseData.id)
          .eq("user_id", user!.id)
          .maybeSingle(),
        (supabase as any).from("church_weekly_verse_progress")
          .select("status")
          .eq("weekly_verse_id", verseData.id),
      ]);

      setMyProgress(progressRes.data);
      if (statsRes.data) {
        setCongregationStats({
          total: statsRes.data.length,
          mastered: statsRes.data.filter((p: any) => p.status === "mastered").length,
          practicing: statsRes.data.filter((p: any) => p.status === "practicing" || p.status === "memorized").length,
        });
      }
    } catch (err) {
      console.error("Error loading weekly verse:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!user || !verse) return;
    try {
      const data = {
        weekly_verse_id: verse.id,
        user_id: user.id,
        status: newStatus,
        practice_count: (myProgress?.practice_count || 0) + 1,
        last_practiced_at: new Date().toISOString(),
        ...(newStatus === "mastered" ? { mastered_at: new Date().toISOString() } : {}),
      };

      if (myProgress) {
        await (supabase as any).from("church_weekly_verse_progress")
          .update(data)
          .eq("id", myProgress.id);
      } else {
        await (supabase as any).from("church_weekly_verse_progress").insert(data);
      }

      toast.success(newStatus === "mastered" ? "Verse mastered! Great work!" : `Progress updated: ${STATUS_LABELS[newStatus]}`);
      loadData();
    } catch (err) {
      toast.error("Failed to update progress");
    }
  };

  if (loading) {
    return <Card variant="glass"><CardContent className="p-6 flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></CardContent></Card>;
  }

  if (!verse) {
    return (
      <Card variant="glass">
        <CardContent className="p-6 text-center">
          <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No memory verse set for this week yet.</p>
        </CardContent>
      </Card>
    );
  }

  const currentIdx = STATUS_ORDER.indexOf(myProgress?.status || "");
  const progressPercent = myProgress ? ((currentIdx + 1) / STATUS_ORDER.length) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Verse Card */}
      <Card variant="glass">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">This Week's Memory Verse</CardTitle>
            </div>
            <Badge variant="outline">{verse.translation}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <blockquote className="border-l-4 border-primary pl-4 py-2">
            <p className="text-lg italic leading-relaxed">{verse.verse_text}</p>
            <footer className="mt-2 text-sm font-semibold text-primary">{verse.verse_reference}</footer>
          </blockquote>

          {/* My Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">My Progress</span>
              <span className="text-muted-foreground">{myProgress ? STATUS_LABELS[myProgress.status] : "Not started"}</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          {/* Status Buttons */}
          <div className="flex flex-wrap gap-2">
            {STATUS_ORDER.map((status) => (
              <Button
                key={status}
                variant={myProgress?.status === status ? "default" : "outline"}
                size="sm"
                onClick={() => updateStatus(status)}
                disabled={myProgress?.status === "mastered" && status !== "mastered"}
              >
                {status === "mastered" && <Trophy className="h-3 w-3 mr-1" />}
                {status === "mastered" && myProgress?.status === "mastered" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                {STATUS_LABELS[status]}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Congregation Progress */}
      <Card variant="glass">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm font-medium">Congregation Progress</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{congregationStats.total}</p>
              <p className="text-xs text-muted-foreground">Participating</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-500">{congregationStats.practicing}</p>
              <p className="text-xs text-muted-foreground">Practicing</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-500">{congregationStats.mastered}</p>
              <p className="text-xs text-muted-foreground">Mastered</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
