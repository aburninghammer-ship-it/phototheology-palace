import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { GideonWaterRations } from "./GideonWaterRations";
import { GideonPlayerStrip } from "./GideonPlayerStrip";
import { Check, X, BookOpen, ArrowRight, SkipForward } from "lucide-react";
import type { GideonTournament, GideonTournamentPlayer, GideonQuestionClient, GideonQuestion } from "@/types/gideon";

interface GideonRoundRevealProps {
  tournament: GideonTournament;
  currentQuestion: GideonQuestionClient | null;
  clientQuestion: GideonQuestionClient | null;
  revealQuestion: GideonQuestion | null;
  myPlayer: GideonTournamentPlayer | null;
  tournamentPlayers: GideonTournamentPlayer[];
  isHost: boolean;
  onAdvanceToNextQuestion: () => void;
  onAdvanceToNextRound: () => void;
  onAdvanceToSynthesis: () => void;
}

export function GideonRoundReveal({
  tournament,
  currentQuestion,
  clientQuestion,
  revealQuestion,
  myPlayer,
  tournamentPlayers,
  isHost,
  onAdvanceToNextQuestion,
  onAdvanceToNextRound,
  onAdvanceToSynthesis,
}: GideonRoundRevealProps) {
  // Full question with answer, fetched from DB during reveal
  const fullQuestion = revealQuestion;

  const myAnswer = myPlayer?.answers?.find(
    (a: any) => a.question_index === tournament.current_question_index
  );

  const activePlayers = tournamentPlayers.filter((p) => !p.is_eliminated);
  const currentRound = tournament.current_round;
  const questions = tournament.questions_data as GideonQuestion[];

  // Check if there are more questions in this round
  const nextIndex = tournament.current_question_index + 1;
  const nextQuestion = questions[nextIndex];
  const hasMoreInRound = nextQuestion && nextQuestion.round_assignment === currentRound;

  // Check if survivors qualify for synthesis
  const survivorCount = tournamentPlayers.filter((p) => !p.is_eliminated).length;
  const shouldSynthesize = survivorCount <= 6 || currentRound >= tournament.max_rounds;

  if (!fullQuestion || !clientQuestion) {
    return <div className="text-center text-muted-foreground">Loading reveal...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Round Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-lg px-3 py-1">
            Round {currentRound}
          </Badge>
          <Badge variant="secondary">
            Q{tournament.current_question_index + 1} — Answer Reveal
          </Badge>
        </div>
        {myPlayer && (
          <GideonWaterRations rations={myPlayer.water_rations} size="md" />
        )}
      </div>

      {/* Question + Answer Reveal */}
      <Card className="border-2">
        <CardContent className="pt-6 space-y-4">
          <p className="text-lg font-medium">{fullQuestion.prompt}</p>

          <div className="space-y-2">
            {clientQuestion.options.map((option, i) => {
              const isCorrect = option === fullQuestion.correct_answer;
              const wasMyAnswer = myAnswer?.answer === option;

              return (
                <div
                  key={i}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg border transition-all",
                    isCorrect && "bg-green-500/10 border-green-500/50",
                    wasMyAnswer && !isCorrect && "bg-red-500/10 border-red-500/50",
                    !isCorrect && !wasMyAnswer && "opacity-40"
                  )}
                >
                  {isCorrect ? (
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : wasMyAnswer ? (
                    <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                  ) : (
                    <span className="w-5 h-5 flex-shrink-0" />
                  )}
                  <span className={cn(
                    "font-medium",
                    isCorrect && "text-green-400",
                    wasMyAnswer && !isCorrect && "text-red-400"
                  )}>
                    {option}
                  </span>
                  {wasMyAnswer && (
                    <Badge variant="outline" className="ml-auto text-xs">
                      Your answer
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>

          {/* Explanation */}
          <div className="pt-2 border-t">
            <div className="flex items-start gap-2">
              <BookOpen className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">{fullQuestion.explanation}</p>
                {fullQuestion.cross_references?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {fullQuestion.cross_references.map((ref, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {ref}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* My result */}
          {myAnswer && (
            <div className={cn(
              "p-3 rounded-lg text-center font-medium",
              myAnswer.correct
                ? "bg-green-500/10 text-green-400"
                : "bg-red-500/10 text-red-400"
            )}>
              {myAnswer.correct ? (
                "Correct! Water rations preserved."
              ) : (
                "Incorrect — you lost a water ration."
              )}
            </div>
          )}

          {!myAnswer && (
            <div className="p-3 rounded-lg text-center font-medium bg-red-500/10 text-red-400">
              No answer submitted — you lost a water ration.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Player Strip */}
      <GideonPlayerStrip
        players={tournamentPlayers}
        currentQuestionIndex={tournament.current_question_index}
        myUserId={myPlayer?.user_id}
      />

      {/* Host Controls */}
      {isHost && (
        <div className="flex gap-2">
          {hasMoreInRound ? (
            <Button className="flex-1" onClick={onAdvanceToNextQuestion}>
              <ArrowRight className="w-4 h-4 mr-2" />
              Next Question
            </Button>
          ) : shouldSynthesize ? (
            <Button className="flex-1" onClick={onAdvanceToSynthesis}>
              <SkipForward className="w-4 h-4 mr-2" />
              Synthesis Round ({survivorCount} survivors)
            </Button>
          ) : (
            <Button className="flex-1" onClick={onAdvanceToNextRound}>
              <ArrowRight className="w-4 h-4 mr-2" />
              Next Round ({survivorCount} remain)
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
