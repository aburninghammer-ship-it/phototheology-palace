import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useGideonTimer } from "@/hooks/useGideonTimer";
import { GideonWaterRations } from "./GideonWaterRations";
import { GideonPlayerStrip } from "./GideonPlayerStrip";
import { Clock, AlertTriangle, Zap } from "lucide-react";
import type { GideonTournament, GideonTournamentPlayer, GideonQuestionClient } from "@/types/gideon";

interface GideonRoundActiveProps {
  tournament: GideonTournament;
  currentQuestion: GideonQuestionClient | null;
  myPlayer: GideonTournamentPlayer | null;
  tournamentPlayers: GideonTournamentPlayer[];
  onSubmitAnswer: (questionIndex: number, answer: string, timeMs: number) => Promise<void>;
  isHost: boolean;
  onAdvanceToReveal: () => void;
}

export function GideonRoundActive({
  tournament,
  currentQuestion,
  myPlayer,
  tournamentPlayers,
  onSubmitAnswer,
  isHost,
  onAdvanceToReveal,
}: GideonRoundActiveProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const answerStartTime = useRef(Date.now());

  const { timeRemaining, isExpired, progress, timerColor, barColor } = useGideonTimer({
    roundStartedAt: tournament.round_started_at,
    durationSeconds: tournament.round_timer_seconds,
    isActive: tournament.round_phase === "question",
  });

  // Check if already answered this question
  const alreadyAnswered = myPlayer?.answers?.some(
    (a: any) => a.question_index === tournament.current_question_index
  );

  const handleSelectAnswer = async (answer: string) => {
    if (hasSubmitted || alreadyAnswered || isExpired) return;

    setSelectedAnswer(answer);
    setHasSubmitted(true);

    const timeMs = Date.now() - answerStartTime.current;
    await onSubmitAnswer(tournament.current_question_index, answer, timeMs);
  };

  // Auto-advance when timer expires (host only)
  const autoAdvancedRef = useRef(false);
  useEffect(() => {
    if (isExpired && isHost && !autoAdvancedRef.current) {
      autoAdvancedRef.current = true;
      const timer = setTimeout(() => onAdvanceToReveal(), 2000);
      return () => clearTimeout(timer);
    }
  }, [isExpired, isHost, onAdvanceToReveal]);

  // Reset state when question changes
  const questionKey = `${tournament.current_round}-${tournament.current_question_index}`;

  if (!currentQuestion) {
    return <div className="text-center text-muted-foreground">Loading question...</div>;
  }

  const activePlayers = tournamentPlayers.filter((p) => !p.is_eliminated);
  const answeredCount = activePlayers.filter((p) =>
    p.answers?.some((a: any) => a.question_index === tournament.current_question_index)
  ).length;

  return (
    <div className="space-y-4" key={questionKey}>
      {/* Round + Question Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-lg px-3 py-1">
            Round {tournament.current_round}
          </Badge>
          <Badge variant="secondary">
            Q{tournament.current_question_index + 1}
          </Badge>
          {currentQuestion.source === "false_prophet" && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> False Prophet
            </Badge>
          )}
        </div>
        {myPlayer && (
          <GideonWaterRations rations={myPlayer.water_rations} size="md" />
        )}
      </div>

      {/* Timer Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className={cn("flex items-center gap-1 font-mono font-bold", timerColor)}>
            <Clock className="w-4 h-4" />
            {timeRemaining}s
          </span>
          <span className="text-muted-foreground">
            {answeredCount}/{activePlayers.length} answered
          </span>
        </div>
        <Progress value={progress * 100} className="h-2" />
      </div>

      {/* Question */}
      <Card className="border-2">
        <CardContent className="pt-6">
          <div className="flex items-start gap-2 mb-1">
            {currentQuestion.difficulty >= 4 && (
              <Zap className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            )}
            <p className="text-lg font-medium leading-relaxed">
              {currentQuestion.prompt}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {currentQuestion.pt_room_tag}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Difficulty {currentQuestion.difficulty}/5
            </Badge>
            {currentQuestion.strike_impact === "high" && (
              <Badge className="text-xs bg-amber-500/20 text-amber-500 border-amber-500/30">
                High Risk +10
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Answer Options */}
      <div className="grid grid-cols-1 gap-2">
        {currentQuestion.options.map((option, i) => {
          const isSelected = selectedAnswer === option;
          const isDisabled = hasSubmitted || alreadyAnswered || isExpired;

          return (
            <Button
              key={i}
              variant="outline"
              className={cn(
                "h-auto py-3 px-4 text-left justify-start whitespace-normal",
                isSelected && "ring-2 ring-amber-500 bg-amber-500/10 border-amber-500",
                isDisabled && !isSelected && "opacity-50"
              )}
              disabled={isDisabled}
              onClick={() => handleSelectAnswer(option)}
            >
              <span className="font-bold mr-2 text-muted-foreground">
                {String.fromCharCode(65 + i)}.
              </span>
              {option}
            </Button>
          );
        })}
      </div>

      {(hasSubmitted || alreadyAnswered) && (
        <p className="text-center text-muted-foreground text-sm">
          Answer submitted! Waiting for other players...
        </p>
      )}

      {isExpired && !hasSubmitted && !alreadyAnswered && (
        <p className="text-center text-red-400 text-sm font-medium">
          Time's up! No answer submitted — you lose a water ration.
        </p>
      )}

      {/* Player Strip */}
      <GideonPlayerStrip
        players={tournamentPlayers}
        currentQuestionIndex={tournament.current_question_index}
        myUserId={myPlayer?.user_id}
      />

      {/* Host advance button */}
      {isHost && (isExpired || answeredCount >= activePlayers.length) && (
        <Button className="w-full" onClick={onAdvanceToReveal}>
          Reveal Answer
        </Button>
      )}
    </div>
  );
}
