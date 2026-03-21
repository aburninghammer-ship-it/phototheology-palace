import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Zap, Trophy, Play, RotateCcw, Users, Wifi, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { usePathActivityTracking } from "@/hooks/usePathActivityTracking";
import { useGameSession } from "@/hooks/useGameSession";
import { useGameMultiplayer } from "@/hooks/useGameMultiplayer";
import { MultiplayerLobby } from "@/components/games/MultiplayerLobby";
import { motion, AnimatePresence } from "framer-motion";
import { FloatingGameChat } from "@/components/games/FloatingGameChat";

interface Question {
  verse: string;
  reference: string;
  correctPrinciples: string[];
  options: string[];
}

const SAMPLE_QUESTIONS: Question[] = [
  {
    verse: "In the beginning God created the heaven and the earth.",
    reference: "Genesis 1:1",
    correctPrinciples: ["1D", "@Ad", "1H"],
    options: ["1D", "2D", "3D", "@Ad", "@Mo", "1H", "2H", "3H"]
  },
  {
    verse: "For God so loved the world, that he gave his only begotten Son...",
    reference: "John 3:16",
    correctPrinciples: ["2D", "Gospel Floor", "@CyC"],
    options: ["1D", "2D", "3D", "Gospel Floor", "@Ad", "@CyC", "1H", "2H"]
  },
  {
    verse: "And the LORD God formed man of the dust of the ground...",
    reference: "Genesis 2:7",
    correctPrinciples: ["1D", "@Ad", "Life of Christ Wall"],
    options: ["1D", "2D", "@Ad", "@No", "Life of Christ Wall", "1H", "2H", "Great Controversy Wall"]
  },
  {
    verse: "And I will put enmity between thee and the woman, and between thy seed and her seed...",
    reference: "Genesis 3:15",
    correctPrinciples: ["@Ad", "Great Controversy Wall", "Gospel Floor"],
    options: ["@Ad", "@No", "Great Controversy Wall", "Gospel Floor", "1D", "2D", "Life of Christ Wall", "1H"]
  },
  {
    verse: "By faith Noah, being warned of God of things not seen as yet, moved with fear, prepared an ark...",
    reference: "Hebrews 11:7",
    correctPrinciples: ["@No", "2H", "Sanctuary Wall"],
    options: ["@Ad", "@No", "@Ab", "1H", "2H", "3H", "Sanctuary Wall", "Gospel Floor"]
  },
  {
    verse: "And he said, Take now thy son, thine only son Isaac, whom thou lovest...",
    reference: "Genesis 22:2",
    correctPrinciples: ["@Ab", "Life of Christ Wall", "1H"],
    options: ["@Ad", "@Ab", "@Mo", "Life of Christ Wall", "Gospel Floor", "1H", "2H", "Great Controversy Wall"]
  },
  {
    verse: "Your lamb shall be without blemish, a male of the first year...",
    reference: "Exodus 12:5",
    correctPrinciples: ["@Mo", "Sanctuary Wall", "Life of Christ Wall"],
    options: ["@Ab", "@Mo", "@Cy", "Sanctuary Wall", "Life of Christ Wall", "Gospel Floor", "1H", "2H"]
  },
  {
    verse: "And I saw a new heaven and a new earth: for the first heaven and the first earth were passed away...",
    reference: "Revelation 21:1",
    correctPrinciples: ["3H", "@Re", "Gospel Floor"],
    options: ["1H", "2H", "3H", "@Sp", "@Re", "Gospel Floor", "Sanctuary Wall", "Great Controversy Wall"]
  },
];

const TIMER_SECONDS = 20;

interface GameState {
  currentQuestion: number;
  score: number;
  combo: number;
  selectedPrinciples: string[];
  gameStarted: boolean;
  gameOver: boolean;
}

const initialGameState: GameState = {
  currentQuestion: 0,
  score: 0,
  combo: 0,
  selectedPrinciples: [],
  gameStarted: false,
  gameOver: false,
};

type GameMode = "solo" | "online" | null;

export default function PrincipleSprint() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const pathActivityId = searchParams.get('pathActivityId') || undefined;
  const roomParam = searchParams.get('room') || undefined;
  const { user } = useAuth();
  const { markPathActivityComplete } = usePathActivityTracking();
  
  const multiplayer = useGameMultiplayer("principle_sprint");

  const {
    session,
    isLoading,
    hasExistingSession,
    saveSession,
    startNewGame,
    resumeGame,
    completeGame,
  } = useGameSession<GameState>({
    gameType: "principle_sprint",
    initialState: initialGameState,
    totalSteps: SAMPLE_QUESTIONS.length,
    autoSaveInterval: 5000,
  });

  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedPrinciples, setSelectedPrinciples] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [combo, setCombo] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [lastCorrectPrinciples, setLastCorrectPrinciples] = useState<string[]>([]);

  // Auto-join room from URL param
  useEffect(() => {
    if (roomParam && !multiplayer.room) {
      setGameMode("online");
      multiplayer.joinRoom(roomParam);
    }
  }, [roomParam]);

  // Listen for multiplayer game start
  useEffect(() => {
    if (multiplayer.room?.status === "active" && gameMode === "online" && !gameStarted) {
      handleStartSoloOrOnline();
    }
  }, [multiplayer.room?.status]);

  // Listen for multiplayer game state updates
  useEffect(() => {
    if (gameMode !== "online" || !multiplayer.room) return;
    
    const gameState = multiplayer.room.game_state as any;
    if (gameState?.currentQuestion !== undefined && gameState.currentQuestion !== currentQuestion) {
      setCurrentQuestion(gameState.currentQuestion);
      setSelectedPrinciples([]);
      setTimeLeft(TIMER_SECONDS);
      setShowFeedback(false);
    }
  }, [multiplayer.room?.game_state]);

  // Sync state when resuming
  useEffect(() => {
    if (session && hasExistingSession === false && session.gameState.gameStarted) {
      setCurrentQuestion(session.gameState.currentQuestion);
      setScore(session.gameState.score);
      setCombo(session.gameState.combo);
      setSelectedPrinciples(session.gameState.selectedPrinciples || []);
      setGameStarted(session.gameState.gameStarted);
      setGameOver(session.gameState.gameOver);
    }
  }, [session, hasExistingSession]);

  // Save state when it changes
  useEffect(() => {
    if (gameStarted && !gameOver && session) {
      saveSession({
        currentQuestion,
        score,
        combo,
        selectedPrinciples,
        gameStarted,
        gameOver,
      }, score, currentQuestion);
    }
  }, [currentQuestion, score, combo, gameStarted]);

  const handleTimeout = useCallback(() => {
    if (showFeedback) return;
    toast.error(t('games.common.timesUp'));
    setCombo(0);
    
    const correct = SAMPLE_QUESTIONS[currentQuestion].correctPrinciples;
    setLastCorrectPrinciples(correct);
    setLastAnswerCorrect(false);
    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
      if (currentQuestion < SAMPLE_QUESTIONS.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedPrinciples([]);
        setTimeLeft(TIMER_SECONDS);
      } else {
        endGame();
      }
    }, 2500);
  }, [currentQuestion, showFeedback]);

  useEffect(() => {
    if (!gameStarted || gameOver || showFeedback) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver, currentQuestion, showFeedback, handleTimeout]);

  const togglePrinciple = (principle: string) => {
    if (showFeedback) return;
    setSelectedPrinciples((prev) =>
      prev.includes(principle)
        ? prev.filter((p) => p !== principle)
        : [...prev, principle]
    );
  };

  const handleSubmit = () => {
    if (showFeedback) return;
    const correct = SAMPLE_QUESTIONS[currentQuestion].correctPrinciples;
    
    // Check how many correct answers the user got
    const correctSelected = selectedPrinciples.filter((p) => correct.includes(p));
    const incorrectSelected = selectedPrinciples.filter((p) => !correct.includes(p));
    
    // Full match = perfect, partial = partial credit, wrong = fail
    const isPerfect = correctSelected.length === correct.length && incorrectSelected.length === 0;
    const isPartial = correctSelected.length > 0 && !isPerfect;
    
    setLastCorrectPrinciples(correct);

    if (isPerfect) {
      const timeBonus = timeLeft * 10;
      const comboBonus = combo * 50;
      const points = 100 + timeBonus + comboBonus;
      setScore((prev) => prev + points);
      setCombo((prev) => prev + 1);
      setLastAnswerCorrect(true);
      toast.success(`+${points} points! ${combo > 0 ? `${combo + 1}x combo!` : ''}`);
    } else if (isPartial) {
      // Partial credit: points per correct answer
      const partialPoints = correctSelected.length * 30;
      setScore((prev) => prev + partialPoints);
      setCombo(0);
      setLastAnswerCorrect(false);
      toast.info(`Partial! +${partialPoints} points (${correctSelected.length}/${correct.length} correct)`);
    } else {
      setCombo(0);
      setLastAnswerCorrect(false);
      toast.error("Incorrect!");
    }

    setShowFeedback(true);

    // Show feedback for 2.5s then advance
    setTimeout(() => {
      setShowFeedback(false);
      if (currentQuestion < SAMPLE_QUESTIONS.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedPrinciples([]);
        setTimeLeft(TIMER_SECONDS);
      } else {
        endGame();
      }
    }, 2500);
  };

  const endGame = async () => {
    setGameOver(true);
    await completeGame(score);
    
    if (user) {
      await supabase.from("game_scores").insert({
        user_id: user.id,
        game_type: "principle_sprint",
        score,
        metadata: { questions: SAMPLE_QUESTIONS.length }
      });
      if (pathActivityId) {
        await markPathActivityComplete(pathActivityId);
      }
    }

    // Update multiplayer score
    if (gameMode === "online" && multiplayer.room) {
      multiplayer.updateGameState({
        playerScores: {
          ...(multiplayer.room.game_state as any)?.playerScores,
          [user?.id || '']: score,
        }
      });
    }
  };

  const handleStartSoloOrOnline = async () => {
    await startNewGame();
    setGameStarted(true);
    setScore(0);
    setCombo(0);
    setCurrentQuestion(0);
    setSelectedPrinciples([]);
    setTimeLeft(TIMER_SECONDS);
    setGameOver(false);
    setShowFeedback(false);
  };

  const handleResumeGame = () => {
    resumeGame();
    setGameMode("solo");
    setTimeLeft(TIMER_SECONDS);
  };

  const handleMultiplayerStart = () => {
    multiplayer.startGame({ currentQuestion: 0 }, user?.id || '');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-6 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">{t('common.loading')}</div>
      </div>
    );
  }

  // Mode selection screen
  if (!gameMode && !gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-6">
        <Button variant="ghost" onClick={() => navigate("/games")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('games.common.backToGames')}
        </Button>

        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center space-y-6">
            <div className="flex justify-center">
              <Zap className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl font-bold">{t('games.principleSprint.title')}</h1>
            <p className="text-muted-foreground text-lg">
              Identify the correct Phototheology principles for each verse. You get {TIMER_SECONDS} seconds per question. Partial credit for partially correct answers!
            </p>

            {hasExistingSession && session && (
              <Card className="p-4 bg-primary/10 border-primary/20">
                <p className="text-sm text-muted-foreground mb-2">{t('games.principleSprint.unfinishedGame')}</p>
                <div className="flex items-center justify-center gap-4 text-sm mb-3">
                  <span>Q{session.gameState.currentQuestion + 1}/{SAMPLE_QUESTIONS.length}</span>
                  <span>•</span>
                  <span>Score: {session.gameState.score}</span>
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleResumeGame} className="flex-1">
                    <Play className="mr-2 h-4 w-4" />
                    Continue
                  </Button>
                  <Button variant="outline" onClick={() => { setGameMode("solo"); handleStartSoloOrOnline(); }} className="flex-1">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Start Fresh
                  </Button>
                </div>
              </Card>
            )}

            <div className="space-y-2 text-left">
              <h3 className="font-semibold">{t('games.common.howToPlay')}</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Read the verse and select ALL matching Palace principles</li>
                <li>Perfect match = 100pts + time bonus + combo bonus</li>
                <li>Partial match = 30pts per correct principle</li>
                <li>After submitting, correct answers are highlighted in green</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button size="lg" onClick={() => { setGameMode("solo"); handleStartSoloOrOnline(); }} className="w-full">
                <Play className="mr-2 h-5 w-5" />
                Solo Sprint
              </Button>
              <Button size="lg" variant="outline" onClick={() => setGameMode("online")} className="w-full">
                <Wifi className="mr-2 h-5 w-5" />
                Online Multiplayer
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Multiplayer lobby
  if (gameMode === "online" && !gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-6">
        <MultiplayerLobby
          room={multiplayer.room}
          players={multiplayer.players}
          loading={multiplayer.loading}
          isHost={multiplayer.isHost}
          minPlayers={2}
          maxPlayers={8}
          gameName="PT Principle Sprint"
          onCreateRoom={multiplayer.createRoom}
          onJoinRoom={multiplayer.joinRoom}
          onStartGame={handleMultiplayerStart}
          onLeaveRoom={() => { multiplayer.leaveRoom(); setGameMode(null); }}
          onBack={() => setGameMode(null)}
        />
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center space-y-6">
            <Trophy className="h-16 w-16 text-primary mx-auto" />
            <h1 className="text-4xl font-bold">{t('games.common.gameComplete')}</h1>
            <div className="text-6xl font-bold text-primary">{score}</div>
            <p className="text-muted-foreground">{t('games.common.finalScore')}</p>

            {/* Multiplayer scores */}
            {gameMode === "online" && multiplayer.players.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Leaderboard</h3>
                {multiplayer.players
                  .sort((a, b) => (b.score || 0) - (a.score || 0))
                  .map((p, i) => (
                    <div key={p.id} className="flex items-center justify-between p-2 rounded bg-muted/50">
                      <span className="flex items-center gap-2">
                        <span className="font-bold text-primary">#{i + 1}</span>
                        {p.display_name}
                      </span>
                      <span className="font-bold">{p.score || 0}</span>
                    </div>
                  ))}
              </div>
            )}

            <div className="flex gap-4">
              <Button onClick={() => { setGameMode(null); setGameStarted(false); setGameOver(false); }} className="flex-1">
                {t('games.common.playAgain')}
              </Button>
              <Button variant="outline" onClick={() => navigate("/games")} className="flex-1">
                {t('games.common.backToGames')}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const question = SAMPLE_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / SAMPLE_QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/games")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('games.common.exit')}
          </Button>
          <div className="flex items-center gap-4">
            {gameMode === "online" && (
              <Badge variant="outline" className="gap-1">
                <Users className="h-3 w-3" />
                {multiplayer.players.length}
              </Badge>
            )}
            {combo > 0 && (
              <Badge variant="default" className="text-lg">
                {combo}x Combo
              </Badge>
            )}
            <div className="text-2xl font-bold">Score: {score}</div>
          </div>
        </div>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {SAMPLE_QUESTIONS.length}
            </div>
            <div className={`text-2xl font-bold ${timeLeft <= 5 ? "text-destructive animate-pulse" : ""}`}>
              {timeLeft}s
            </div>
          </div>
          <Progress value={progress} />
        </Card>

        <Card className="p-8 space-y-6">
          <div className="space-y-2">
            <Badge variant="outline">{question.reference}</Badge>
            <p className="text-2xl">{question.verse}</p>
          </div>

          <div className="space-y-3">
            <p className="font-semibold">
              Select the matching principles ({question.correctPrinciples.length} correct):
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <AnimatePresence mode="wait">
                {question.options.map((option) => {
                  const isSelected = selectedPrinciples.includes(option);
                  const isCorrectAnswer = lastCorrectPrinciples.includes(option);

                  let variant: "default" | "outline" | "destructive" = isSelected ? "default" : "outline";
                  let extraClass = isSelected && !showFeedback
                    ? "ring-2 ring-primary ring-offset-2 bg-primary text-primary-foreground"
                    : "";

                  if (showFeedback) {
                    if (isCorrectAnswer) {
                      extraClass = "!bg-green-600 !text-white !border-green-600 ring-2 ring-green-400";
                    } else if (isSelected && !isCorrectAnswer) {
                      extraClass = "!bg-destructive !text-destructive-foreground !border-destructive";
                    }
                  }

                  return (
                    <motion.div
                      key={option}
                      initial={false}
                      animate={showFeedback && isCorrectAnswer ? { scale: [1, 1.05, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      <Button
                        variant={variant}
                        onClick={() => togglePrinciple(option)}
                        disabled={showFeedback}
                        className={`h-16 w-full relative ${extraClass}`}
                      >
                        {option}
                        {showFeedback && isCorrectAnswer && (
                          <CheckCircle2 className="absolute top-1 right-1 h-4 w-4 text-white" />
                        )}
                        {showFeedback && isSelected && !isCorrectAnswer && (
                          <XCircle className="absolute top-1 right-1 h-4 w-4" />
                        )}
                      </Button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg text-center font-semibold ${
                lastAnswerCorrect
                  ? "bg-green-500/20 text-green-700 dark:text-green-300"
                  : "bg-orange-500/20 text-orange-700 dark:text-orange-300"
              }`}
            >
              {lastAnswerCorrect
                ? "Perfect match! 🎯"
                : `Correct answers: ${lastCorrectPrinciples.join(", ")}`}
            </motion.div>
          )}

          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={selectedPrinciples.length === 0 || showFeedback}
            className="w-full"
          >
            {t('games.common.submitAnswer')}
          </Button>
        </Card>
      </div>
      <FloatingGameChat roomId={multiplayer.room?.id} gameType="principle-sprint" />
    </div>
  );
}
