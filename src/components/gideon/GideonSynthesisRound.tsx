// @ts-nocheck - Gideon tables not yet in generated types
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useGideonTimer } from "@/hooks/useGideonTimer";
import { GideonPlayerStrip } from "./GideonPlayerStrip";
import { Sparkles, Clock, Send, Eye, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GideonTournament, GideonTournamentPlayer, GideonQuestion } from "@/types/gideon";
import { SYNTHESIS_TIMER_SECONDS } from "@/types/gideon";

interface GideonSynthesisRoundProps {
  tournament: GideonTournament;
  myPlayer: GideonTournamentPlayer | null;
  tournamentPlayers: GideonTournamentPlayer[];
  onSubmitSynthesis: (answer: string) => Promise<void>;
  isHost: boolean;
  onAdvanceToResults: () => void;
  isEliminated: boolean;
}

export function GideonSynthesisRound({
  tournament,
  myPlayer,
  tournamentPlayers,
  onSubmitSynthesis,
  isHost,
  onAdvanceToResults,
  isEliminated,
}: GideonSynthesisRoundProps) {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { timeRemaining, isExpired, progress, timerColor, barColor } = useGideonTimer({
    roundStartedAt: tournament.round_started_at,
    durationSeconds: SYNTHESIS_TIMER_SECONDS,
    isActive: tournament.round_phase === "synthesis",
  });

  // Find the synthesis question (last question in questions_data)
  const questions = tournament.questions_data as GideonQuestion[];
  const synthesisQuestion = questions.find((q) => q.source === "synthesis") || questions[questions.length - 1];

  const handleSubmit = async () => {
    if (!answer.trim() || submitted || submitting) return;
    setSubmitting(true);
    await onSubmitSynthesis(answer.trim());
    setSubmitted(true);
    setSubmitting(false);
  };

  const activePlayers = tournamentPlayers.filter((p) => !p.is_eliminated);
  const hasAllSubmitted = activePlayers.every((p) =>
    p.answers?.some((a: any) => a.question_index === -1)
  );

  if (isEliminated) {
    return (
      <div className="space-y-4">
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Eye className="w-8 h-8 text-amber-500" />
              <div>
                <h2 className="text-xl font-bold">Synthesis Round — Spectating</h2>
                <p className="text-sm text-muted-foreground">
                  Watch the survivors compete in the final synthesis challenge.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <GideonPlayerStrip
          players={tournamentPlayers}
          currentQuestionIndex={-1}
          myUserId={myPlayer?.user_id}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Synthesis Header */}
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-lg px-3 py-1 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Synthesis Round
        </Badge>
        <Badge variant="secondary">
          {activePlayers.length} Survivors
        </Badge>
      </div>

      {/* Timer */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className={cn("flex items-center gap-1 font-mono font-bold", timerColor)}>
            <Clock className="w-4 h-4" />
            {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, "0")}
          </span>
        </div>
        <Progress value={progress * 100} className="h-2" />
      </div>

      {/* Synthesis Prompt */}
      <Card className="border-2 border-amber-500/30">
        <CardHeader>
          <CardTitle className="text-lg">Final Synthesis Challenge</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg leading-relaxed">
            {synthesisQuestion?.prompt || "Synthesize your knowledge from multiple Palace rooms in a written response."}
          </p>

          {submitted ? (
            <div className="p-4 rounded-lg bg-green-500/10 text-green-400 text-center">
              Answer submitted! Waiting for AI grading...
            </div>
          ) : (
            <>
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write your synthesis answer here (2-3 sentences integrating concepts from multiple Palace rooms)..."
                className="min-h-[120px] resize-none"
                disabled={isExpired}
              />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {answer.length} characters
                </span>
                <Button
                  onClick={handleSubmit}
                  disabled={!answer.trim() || isExpired || submitting}
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Submit Answer
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Player Strip */}
      <GideonPlayerStrip
        players={tournamentPlayers}
        currentQuestionIndex={-1}
        myUserId={myPlayer?.user_id}
      />

      {/* Host Controls */}
      {isHost && (isExpired || hasAllSubmitted) && (
        <Button className="w-full" onClick={onAdvanceToResults}>
          <Sparkles className="w-4 h-4 mr-2" />
          Grade & Show Results
        </Button>
      )}
    </div>
  );
}
