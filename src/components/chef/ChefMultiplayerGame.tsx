import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ChefHat, Clock, Trophy, Loader2, ArrowRight, Skull } from "lucide-react";
import { ChefJudgingPanel } from "./ChefJudgingPanel";
import { useChefMultiplayer } from "@/hooks/useChefMultiplayer";

interface Props {
  game: ReturnType<typeof useChefMultiplayer>;
}

const ROUND_NAMES = ["Appetizer", "Entrée", "Dessert", "Signature Dish"];

export function ChefMultiplayerGame({ game }: Props) {
  const { gameState, timeRemaining, myTeam, isEliminated, mySubmission } = game;
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [explanation, setExplanation] = useState("");
  const [explanationStarted, setExplanationStarted] = useState(false);
  const [explanationTimeLeft, setExplanationTimeLeft] = useState(45);
  const explanationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Reset local state on new round
  useEffect(() => {
    setSelectedIngredients([]);
    setExplanation("");
    setExplanationStarted(false);
    setExplanationTimeLeft(45);
  }, [gameState.round]);

  // Explanation timer (45 seconds)
  useEffect(() => {
    if (!explanationStarted) return;
    if (explanationTimerRef.current) clearInterval(explanationTimerRef.current);

    explanationTimerRef.current = setInterval(() => {
      setExplanationTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(explanationTimerRef.current!);
          // Auto-submit when time runs out
          if (explanation.trim() && selectedIngredients.length > 0) {
            game.submitEntry(selectedIngredients, explanation);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => { if (explanationTimerRef.current) clearInterval(explanationTimerRef.current); };
  }, [explanationStarted]);

  // Anti-cheat: block paste in textarea
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
  }, []);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  const startExplanation = () => {
    if (selectedIngredients.length === 0) return;
    setExplanationStarted(true);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const handleSubmit = () => {
    game.submitEntry(selectedIngredients, explanation);
  };

  const toggleIngredient = (ingredient: string) => {
    setSelectedIngredients(prev =>
      prev.includes(ingredient) ? prev.filter(i => i !== ingredient) : [...prev, ingredient]
    );
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // === GAME COMPLETE ===
  if (gameState.winner || gameState.roundPhase === "complete") {
    const winnerTeam = gameState.teams.find(t => t.id === gameState.winner);
    return (
      <Card className="border-2 border-yellow-400">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">🏆</div>
          <CardTitle className="text-3xl">
            {winnerTeam ? `${winnerTeam.emoji} ${winnerTeam.name} Wins!` : "Game Over!"}
          </CardTitle>
          <CardDescription>The Chef Challenge is complete!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Show all eliminations */}
          <div className="space-y-2">
            <h3 className="font-semibold">Elimination History</h3>
            {gameState.eliminations.map((e, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <Badge variant="outline">Round {e.round}</Badge>
                <Skull className="h-4 w-4 text-red-500" />
                <span>{e.teamName}</span>
              </div>
            ))}
          </div>

          {/* Final scores for last round */}
          {gameState.judgeScores[`round-${gameState.round}`] && (
            <ChefJudgingPanel
              scores={gameState.judgeScores[`round-${gameState.round}`]}
              teams={gameState.teams}
            />
          )}

          <Button onClick={() => game.leaveRoom()} className="w-full" variant="outline">
            Back to Lobby
          </Button>
        </CardContent>
      </Card>
    );
  }

  // === WAITING FOR ROUND START ===
  if (gameState.roundPhase === "waiting" || (gameState.roundPhase === "elimination" && gameState.round < gameState.maxRounds)) {
    const nextRound = gameState.round + 1;
    const roundName = ROUND_NAMES[(nextRound - 1) % ROUND_NAMES.length];
    const lastRoundScores = gameState.judgeScores[`round-${gameState.round}`];
    const lastElimination = gameState.eliminations[gameState.eliminations.length - 1];

    return (
      <Card className="border-2 border-orange-300 dark:border-orange-700">
        <CardHeader className="text-center">
          <div className="text-5xl mb-2">
            {gameState.round === 0 ? "🍳" : isEliminated ? "😢" : "⏭️"}
          </div>
          <CardTitle className="text-2xl">
            {gameState.round === 0 
              ? "Ready to Cook!" 
              : isEliminated 
                ? "You've Been Eliminated!" 
                : `Round ${nextRound}: ${roundName}`}
          </CardTitle>
          {myTeam && (
            <Badge className="mx-auto mt-2">{myTeam.emoji} {myTeam.name}</Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Show last round results */}
          {lastRoundScores && (
            <div className="space-y-4">
              <h3 className="font-semibold text-center">Round {gameState.round} Results</h3>
              <ChefJudgingPanel
                scores={lastRoundScores}
                teams={gameState.teams.filter(t => !t.eliminated || t.eliminatedInRound === gameState.round)}
                eliminatedTeamId={lastElimination?.teamId}
              />
            </div>
          )}

          {/* Active teams */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Remaining Teams ({game.activeTeams.length})</h3>
            <div className="flex flex-wrap gap-2">
              {gameState.teams.map(t => (
                <Badge key={t.id} variant={t.eliminated ? "secondary" : "default"} className={t.eliminated ? "line-through opacity-50" : ""}>
                  {t.emoji} {t.name} {t.memberNames.length > 0 && `(${t.memberNames.join(", ")})`}
                </Badge>
              ))}
            </div>
          </div>

          {/* Host starts next round */}
          {game.isHost && !isEliminated && game.activeTeams.length > 1 && (
            <Button onClick={game.startRound} className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-6">
              <ChefHat className="mr-2" />
              Start Round {nextRound}: {roundName}
            </Button>
          )}

          {!game.isHost && !isEliminated && (
            <div className="text-center py-4">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-orange-600" />
              <p className="text-sm text-muted-foreground">Waiting for host to start Round {nextRound}...</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // === JUDGING PHASE ===
  if (gameState.roundPhase === "judging") {
    return (
      <Card className="border-2 border-purple-300 dark:border-purple-700">
        <CardHeader className="text-center">
          <div className="text-5xl mb-2">👨‍⚖️</div>
          <CardTitle>The Judges Are Tasting...</CardTitle>
          <CardDescription>Round {gameState.round}: {ROUND_NAMES[(gameState.round - 1) % ROUND_NAMES.length]}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {game.isHost && !game.judging && (
            <Button onClick={game.runJudging} className="w-full bg-purple-600 hover:bg-purple-700">
              🍽️ Let the Judges Taste!
            </Button>
          )}
          {game.judging && (
            <div className="text-center py-8 space-y-3">
              <div className="flex justify-center gap-4 text-4xl">
                <span className="animate-bounce" style={{ animationDelay: "0ms" }}>👑</span>
                <span className="animate-bounce" style={{ animationDelay: "200ms" }}>🎨</span>
                <span className="animate-bounce" style={{ animationDelay: "400ms" }}>✝️</span>
              </div>
              <p className="text-sm text-muted-foreground">Judge Solomon, Judge Miriam, and Judge Paul are deliberating...</p>
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-purple-600" />
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // === COOKING PHASE ===
  if (gameState.roundPhase === "cooking") {
    const roundName = ROUND_NAMES[(gameState.round - 1) % ROUND_NAMES.length];
    const ingredients = gameState.ingredientOptions?.[0] || [];

    return (
      <Card className="border-2 border-orange-300 dark:border-orange-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-orange-600" />
                Round {gameState.round}: {roundName}
              </CardTitle>
              <CardDescription>Theme: {gameState.currentTheme}</CardDescription>
            </div>
            <div className="text-right">
              <Badge
                variant={timeRemaining < 60 ? "destructive" : "outline"}
                className="text-lg px-4 py-1 font-mono"
              >
                <Clock className="h-4 w-4 mr-1" />
                {formatTime(timeRemaining)}
              </Badge>
              {myTeam && <div className="mt-1"><Badge>{myTeam.emoji} {myTeam.name}</Badge></div>}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isEliminated ? (
            <div className="text-center py-8">
              <p className="text-lg text-muted-foreground">You've been eliminated. Watching the remaining chefs cook! 👀</p>
            </div>
          ) : mySubmission ? (
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg text-center space-y-2">
              <div className="text-4xl">✅</div>
              <p className="font-semibold text-green-800 dark:text-green-200">Recipe Submitted!</p>
              <p className="text-sm text-muted-foreground">Waiting for other chefs to finish...</p>
            </div>
          ) : (
            <>
              {/* Verses */}
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                <h3 className="font-semibold mb-2">📖 Your Ingredients (Verses)</h3>
                <div className="space-y-2">
                  {gameState.verses.map((v, i) => (
                    <div key={i} className="text-sm">
                      <span className="font-bold text-orange-600">{v.reference}</span>
                      <span className="italic ml-2">"{v.text}"</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 1: MC Ingredient Selection */}
              {!explanationStarted && (
                <div className="space-y-3">
                  <h3 className="font-semibold">Step 1: Select Your Connections (pick 3+)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ingredients.map((ing, i) => (
                      <label
                        key={i}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedIngredients.includes(ing)
                            ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                            : "border-muted hover:border-orange-300"
                        }`}
                      >
                        <Checkbox
                          checked={selectedIngredients.includes(ing)}
                          onCheckedChange={() => toggleIngredient(ing)}
                        />
                        <span className="text-sm">{ing}</span>
                      </label>
                    ))}
                  </div>
                  <Button
                    onClick={startExplanation}
                    disabled={selectedIngredients.length < 3}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Lock Ingredients & Write Explanation ({selectedIngredients.length}/3 min)
                  </Button>
                </div>
              )}

              {/* Step 2: Timed Free-Text Explanation */}
              {explanationStarted && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Step 2: Explain Your Recipe (45s)</h3>
                    <Badge variant={explanationTimeLeft < 10 ? "destructive" : "outline"} className="font-mono text-lg">
                      {explanationTimeLeft}s
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground flex flex-wrap gap-1 mb-2">
                    Selected: {selectedIngredients.map(i => <Badge key={i} variant="secondary" className="text-xs">{i}</Badge>)}
                  </div>
                  <Textarea
                    ref={textareaRef}
                    value={explanation}
                    onChange={e => setExplanation(e.target.value)}
                    onPaste={handlePaste}
                    onContextMenu={handleContextMenu}
                    placeholder="Explain how these verses connect to the theme..."
                    className="min-h-[120px]"
                    disabled={explanationTimeLeft === 0}
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={!explanation.trim() || game.submitting}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {game.submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ChefHat className="mr-2 h-4 w-4" />}
                    Submit Recipe!
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Host can advance */}
          {game.isHost && timeRemaining <= 0 && gameState.roundPhase === "cooking" && (
            <Button onClick={game.advanceToJudging} className="w-full" variant="outline">
              ⏭️ Time's Up — Send to Judges
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return null;
}
