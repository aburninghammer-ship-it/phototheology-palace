import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Trophy, Send, Loader2, Star, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

interface LeaderboardEntry {
  id: string;
  user_id: string;
  challenge_type: string;
  title: string;
  content: string | null;
  jeeves_score: number;
  jeeves_feedback: string | null;
  jeeves_highlights: string[] | null;
  created_at: string;
  displayName?: string;
}

interface ChallengeInlineSubmissionsProps {
  challengeType: "chef" | "equation" | "daily";
  challengeTitle: string;
  challengeDescription: string;
  challengeContent?: string;
  difficulty?: string;
}

export const ChallengeInlineSubmissions = ({
  challengeType,
  challengeTitle,
  challengeDescription,
  challengeContent,
  difficulty,
}: ChallengeInlineSubmissionsProps) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answer, setAnswer] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchEntries();

    const channel = supabase
      .channel(`leaderboard-${challengeType}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "challenge_leaderboard",
        filter: `challenge_type=eq.${challengeType}`,
      }, () => fetchEntries())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [challengeType]);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("challenge_leaderboard")
        .select("*")
        .eq("challenge_type", challengeType)
        .order("jeeves_score", { ascending: false })
        .limit(20);

      if (error) throw error;

      const userIds = [...new Set((data || []).map(e => e.user_id))];
      const { data: profiles } = userIds.length > 0
        ? await supabase.from("profiles").select("id, display_name, username").in("id", userIds)
        : { data: [] };

      const profileMap = new Map((profiles || []).map(p => [p.id, p]));

      setEntries((data || []).map(e => ({
        ...e,
        displayName: profileMap.get(e.user_id)?.display_name || profileMap.get(e.user_id)?.username || "Anonymous",
      })));
    } catch (err) {
      console.error("Error fetching submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Sign in to submit your answer");
      return;
    }
    if (!answer.trim()) {
      toast.error("Write your answer first");
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("rate-challenge", {
        body: {
          challengeType,
          title: challengeTitle,
          description: challengeDescription,
          content: answer.trim(),
          difficulty,
        },
      });

      if (error) throw error;

      toast.success(`Jeeves rated your answer: ${data.score}/100! 🏆`);
      setAnswer("");
      fetchEntries();
    } catch (err: any) {
      console.error("Submit error:", err);
      toast.error("Failed to submit — try again");
    } finally {
      setSubmitting(false);
    }
  };

  const getMedalEmoji = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-yellow-500";
    if (score >= 75) return "text-green-500";
    if (score >= 50) return "text-blue-500";
    return "text-muted-foreground";
  };

  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center gap-2">
        <Trophy className="h-5 w-5 text-yellow-500" />
        <h3 className="text-lg font-bold">Community Answers</h3>
        <Badge variant="secondary" className="text-xs">
          {entries.length} submission{entries.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Submit your answer */}
      <Card className="border-primary/20">
        <CardContent className="p-4 space-y-3">
          <p className="text-sm font-medium">Post your answer and get rated by Jeeves:</p>
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Write your response to this challenge..."
            rows={4}
            disabled={submitting}
          />
          <Button
            onClick={handleSubmit}
            disabled={submitting || !answer.trim()}
            className="w-full gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Jeeves is rating...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit & Get Rated
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Ranked submissions */}
      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : entries.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Star className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No submissions yet — be the first!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, index) => {
            const isExpanded = expandedId === entry.id;
            return (
              <Card
                key={entry.id}
                className={`cursor-pointer transition-all hover:shadow-sm ${index < 3 ? "border-primary/20" : ""}`}
                onClick={() => setExpandedId(isExpanded ? null : entry.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold min-w-[32px] text-center">
                      {getMedalEmoji(index)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold truncate">{entry.displayName}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(entry.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {!isExpanded && entry.content && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {entry.content.slice(0, 120)}...
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xl font-bold ${getScoreColor(entry.jeeves_score)}`}>
                        {entry.jeeves_score}
                      </span>
                      <span className="text-xs text-muted-foreground">/100</span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t space-y-2">
                      {entry.content && (
                        <p className="text-sm whitespace-pre-wrap">{entry.content}</p>
                      )}
                      {entry.jeeves_highlights && entry.jeeves_highlights.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-muted-foreground">Strengths:</p>
                          {entry.jeeves_highlights.map((h, i) => (
                            <p key={i} className="text-xs flex items-start gap-1">
                              <span className="text-green-500 mt-0.5">✓</span> {h}
                            </p>
                          ))}
                        </div>
                      )}
                      {entry.jeeves_feedback && (
                        <p className="text-xs italic text-muted-foreground">
                          Jeeves: "{entry.jeeves_feedback}"
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
