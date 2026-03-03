import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { FloatingGameChat } from "@/components/games/FloatingGameChat";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { GameLeaderboard } from "@/components/GameLeaderboard";
import {
  Eye,
  ArrowLeft,
  Trophy,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Zap,
} from "lucide-react";
import {
  PACK_A,
  DIFFICULTIES,
  getSubjectColor,
  type VerseLevel,
  type VerbBlock,
  type DifficultySettings,
} from "@/data/observationFluxData";
import {
  validateObservation,
  checkForNonExistentVerb,
  type ValidationResult,
} from "@/lib/interpretationDetection";

// Falling block interface
interface FallingBlock {
  id: string;
  text: string;
  subject?: string;
  isPhrase?: boolean;
  isDecoy?: boolean;
  x: number; // Percentage
  y: number; // Percentage
  opacity: number;
  fadeStartTime?: number;
}

// Observation entry with validation
interface ObservationEntry {
  text: string;
  result: ValidationResult;
  timestamp: number;
}

const ObservationFlux = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  // Game state
  const [gameState, setGameState] = useState<"menu" | "playing" | "paused" | "levelComplete" | "complete">("menu");
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [difficulty, setDifficulty] = useState<DifficultySettings>(DIFFICULTIES[0]);
  const [score, setScore] = useState(0);
  const [fallingBlocks, setFallingBlocks] = useState<FallingBlock[]>([]);
  const [observations, setObservations] = useState<ObservationEntry[]>([]);
  const [inputText, setInputText] = useState("");
  const [missedVerbs, setMissedVerbs] = useState(0);
  const [verbsSpawned, setVerbsSpawned] = useState(0);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [caughtDecoys, setCaughtDecoys] = useState(0);
  const [wrongClicks, setWrongClicks] = useState(0);

  // Refs for game loop
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const spawnLoopRef = useRef<NodeJS.Timeout | null>(null);
  const verbIndexRef = useRef(0);

  // Current level data
  const currentLevel: VerseLevel | undefined = PACK_A.levels[currentLevelIndex];
  const totalLevels = PACK_A.levels.length;

  // Shuffle helper
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Ref to store shuffled blocks for the current level (so they don't re-shuffle mid-game)
  const shuffledBlocksRef = useRef<VerbBlock[]>([]);
  const lastLevelRef = useRef<number>(-1);

  // Get all verbs including decoys for current difficulty - SHUFFLED for fair gameplay
  const getAllBlocks = useCallback((): VerbBlock[] => {
    if (!currentLevel) return [];

    // Only re-shuffle when level changes (not on every call)
    if (lastLevelRef.current !== currentLevelIndex || shuffledBlocksRef.current.length === 0) {
      const blocks = [...currentLevel.verbs];
      if (difficulty.showDecoys && currentLevel.decoyVerbs) {
        currentLevel.decoyVerbs.forEach(decoy => {
          blocks.push({ text: decoy, isPhrase: false });
        });
      }
      // Shuffle so correct and decoy verbs are mixed together
      shuffledBlocksRef.current = shuffleArray(blocks);
      lastLevelRef.current = currentLevelIndex;
    }

    return shuffledBlocksRef.current;
  }, [currentLevel, difficulty, currentLevelIndex]);

  // Spawn a new falling block
  const spawnBlock = useCallback(() => {
    if (!currentLevel) return;

    const allBlocks = getAllBlocks();
    if (verbIndexRef.current >= allBlocks.length) {
      // All verbs spawned, wait for them to fall
      return;
    }

    const verbData = allBlocks[verbIndexRef.current];
    const isDecoy = currentLevel.decoyVerbs?.includes(verbData.text) || false;

    const newBlock: FallingBlock = {
      id: `block-${Date.now()}-${verbIndexRef.current}`,
      text: verbData.text,
      subject: verbData.subject,
      isPhrase: verbData.isPhrase,
      isDecoy,
      x: 15 + Math.random() * 70, // Random x between 15% and 85%
      y: -10,
      opacity: 1,
    };

    setFallingBlocks(prev => [...prev, newBlock]);
    setVerbsSpawned(prev => prev + 1);
    verbIndexRef.current++;
  }, [currentLevel, getAllBlocks]);

  // Game loop - move blocks down
  const gameLoop = useCallback(() => {
    const now = Date.now();

    setFallingBlocks(prev => {
      const updated = prev.map(block => {
        let newY = block.y + difficulty.fallSpeed;
        let newOpacity = block.opacity;

        // Handle fading for master difficulty
        if (difficulty.verbFadeDelay > 0 && !block.fadeStartTime) {
          return { ...block, y: newY, fadeStartTime: now };
        }
        if (block.fadeStartTime && difficulty.verbFadeDelay > 0) {
          const elapsed = now - block.fadeStartTime;
          if (elapsed > difficulty.verbFadeDelay) {
            newOpacity = Math.max(0.2, 1 - (elapsed - difficulty.verbFadeDelay) / 2000);
          }
        }

        return { ...block, y: newY, opacity: newOpacity };
      });

      // Remove blocks that fell off screen and track missed
      const stillFalling = updated.filter(block => {
        if (block.y > 100) {
          if (!block.isDecoy) {
            setMissedVerbs(m => m + 1);
            setScore(s => Math.max(0, s - 2)); // Penalty for missing
          }
          return false;
        }
        return true;
      });

      return stillFalling;
    });
  }, [difficulty]);

  // Start game
  const startGame = useCallback((difficultyId: string) => {
    const diff = DIFFICULTIES.find(d => d.id === difficultyId) || DIFFICULTIES[0];
    setDifficulty(diff);
    setGameState("playing");
    setScore(0);
    setFallingBlocks([]);
    setObservations([]);
    setInputText("");
    setMissedVerbs(0);
    setVerbsSpawned(0);
    setCaughtDecoys(0);
    setWrongClicks(0);
    verbIndexRef.current = 0;
    setScoreSaved(false);
    // Reset shuffled blocks to force re-shuffle
    shuffledBlocksRef.current = [];
    lastLevelRef.current = -1;
  }, []);

  // Pause/resume game
  const togglePause = useCallback(() => {
    setGameState(prev => prev === "playing" ? "paused" : "playing");
  }, []);

  // Handle clicking on a falling block - catch decoys!
  const handleBlockClick = useCallback((block: FallingBlock) => {
    if (gameState !== "playing") return;

    // Remove the clicked block
    setFallingBlocks(prev => prev.filter(b => b.id !== block.id));

    if (block.isDecoy) {
      // Correctly identified a decoy - bonus points!
      setCaughtDecoys(prev => prev + 1);
      setScore(prev => prev + 20);
      toast({
        title: t('games.observationFlux.decoyCaught'),
        description: t('games.observationFlux.decoyCaughtDesc', { verb: block.text }),
      });
    } else {
      // Incorrectly clicked a real verb - penalty!
      setWrongClicks(prev => prev + 1);
      setScore(prev => Math.max(0, prev - 10));
      toast({
        title: t('games.observationFlux.realVerb'),
        description: t('games.observationFlux.realVerbDesc', { verb: block.text }),
        variant: "destructive",
      });
    }
  }, [gameState, toast]);

  // Handle observation input
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  // Submit observation
  const submitObservation = useCallback(() => {
    if (!inputText.trim()) return;

    const lines = inputText.split("\n").filter(l => l.trim());

    lines.forEach(line => {
      const result = validateObservation(line);

      // Check for decoy verb references
      if (currentLevel) {
        const decoyCheck = checkForNonExistentVerb(
          line,
          currentLevel.verbs.map(v => v.text),
          currentLevel.decoyVerbs || []
        );
        if (decoyCheck) {
          result.valid = false;
          result.type = "hard_penalty";
          result.points = -5;
          result.feedback = `"${decoyCheck.verb}" doesn't appear in this verse!`;
        }
      }

      const entry: ObservationEntry = {
        text: line.trim(),
        result,
        timestamp: Date.now(),
      };

      setObservations(prev => [...prev, entry]);
      setScore(prev => Math.max(0, prev + result.points));

      // Show toast for penalties
      if (!result.valid) {
        toast({
          title: result.type === "hard_penalty" ? t('games.observationFlux.interpretationDetected') : t('games.observationFlux.rephraseNeeded'),
          description: result.feedback,
          variant: "destructive",
        });
      }
    });

    setInputText("");
  }, [inputText, currentLevel, toast]);

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitObservation();
    }
  };

  // Check level completion
  useEffect(() => {
    if (gameState !== "playing") return;

    const allBlocks = getAllBlocks();
    const allSpawned = verbIndexRef.current >= allBlocks.length;
    const allFallen = fallingBlocks.length === 0;

    if (allSpawned && allFallen && verbsSpawned > 0) {
      // Level complete
      if (currentLevelIndex < totalLevels - 1) {
        setGameState("levelComplete");
      } else {
        setGameState("complete");
      }
    }
  }, [gameState, fallingBlocks, verbsSpawned, currentLevelIndex, totalLevels, getAllBlocks]);

  // Game loops
  useEffect(() => {
    if (gameState === "playing") {
      // Movement loop
      gameLoopRef.current = setInterval(gameLoop, 50);

      // Spawn loop
      spawnLoopRef.current = setInterval(spawnBlock, difficulty.spawnInterval);

      // Initial spawn
      if (fallingBlocks.length === 0 && verbIndexRef.current === 0) {
        spawnBlock();
      }
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      if (spawnLoopRef.current) clearInterval(spawnLoopRef.current);
    }

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      if (spawnLoopRef.current) clearInterval(spawnLoopRef.current);
    };
  }, [gameState, gameLoop, spawnBlock, difficulty.spawnInterval, fallingBlocks.length]);

  // Save score on completion
  useEffect(() => {
    const saveScore = async () => {
      if (gameState === "complete" && user && !scoreSaved && score > 0) {
        try {
          await supabase.from("game_scores").insert({
            user_id: user.id,
            game_type: "observation_flux",
            score,
            mode: difficulty.id,
          });
          setScoreSaved(true);
        } catch (error) {
          console.error("Error saving score:", error);
        }
      }
    };
    saveScore();
  }, [gameState, user, score, scoreSaved, difficulty.id]);

  // Next level
  const nextLevel = useCallback(() => {
    setCurrentLevelIndex(prev => prev + 1);
    setFallingBlocks([]);
    setObservations([]);
    setInputText("");
    setMissedVerbs(0);
    setVerbsSpawned(0);
    verbIndexRef.current = 0;
    // Reset shuffled blocks to force re-shuffle for new level
    shuffledBlocksRef.current = [];
    setGameState("playing");
  }, []);

  // Restart game
  const restartGame = useCallback(() => {
    setCurrentLevelIndex(0);
    setGameState("menu");
    setScore(0);
    setScoreSaved(false);
    // Reset shuffled blocks
    shuffledBlocksRef.current = [];
    lastLevelRef.current = -1;
  }, []);

  // Get block style
  const getBlockStyle = (block: FallingBlock) => {
    let bgColor = "from-blue-600 to-blue-800";

    if (block.isDecoy) {
      bgColor = "from-gray-600 to-gray-800";
    } else if (difficulty.showSubjectColors && block.subject) {
      const subjectColor = getSubjectColor(block.subject);
      bgColor = subjectColor.replace("bg-", "from-") + " to-" + subjectColor.replace("bg-", "").replace("-500", "-700");
    }

    return bgColor;
  };

  // Render menu
  if (gameState === "menu") {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              variant="ghost"
              onClick={() => navigate("/games")}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> {t('common.backToGames')}
            </Button>

            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <div className="flex items-center gap-3">
                  <Eye className="h-8 w-8" />
                  <div>
                    <CardTitle className="text-2xl">{t('games.observationFlux.title')}</CardTitle>
                    <CardDescription className="text-blue-100">
                      {t('games.observationFlux.subtitle')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Rule Display */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-center">
                  <p className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                    {t('games.observationFlux.rule')}
                  </p>
                </div>

                {/* How to Play */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">{t('games.common.howToPlay')}</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <Zap className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      {t('games.observationFlux.instructions.verbBlocks')}
                    </li>
                    <li className="flex gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <strong>{t('games.observationFlux.instructions.tapDecoys')}</strong>
                    </li>
                    <li className="flex gap-2">
                      <Eye className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      {t('games.observationFlux.instructions.typeObservations')}
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {t('games.observationFlux.instructions.validExample')}
                    </li>
                    <li className="flex gap-2">
                      <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                      {t('games.observationFlux.instructions.invalidExample')}
                    </li>
                  </ul>
                </div>

                {/* Difficulty Selection */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">{t('games.observationFlux.selectDifficulty')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {DIFFICULTIES.map((diff) => (
                      <Button
                        key={diff.id}
                        variant="outline"
                        className={`h-auto py-4 flex flex-col items-start ${
                          diff.id === "beginner" ? "border-green-500" :
                          diff.id === "intermediate" ? "border-yellow-500" :
                          "border-red-500"
                        }`}
                        onClick={() => startGame(diff.id)}
                      >
                        <span className="font-semibold">{diff.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {diff.id === "beginner" && t('games.observationFlux.beginnerDesc')}
                          {diff.id === "intermediate" && t('games.observationFlux.intermediateDesc')}
                          {diff.id === "master" && t('games.observationFlux.masterDesc')}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Pack Info */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{PACK_A.name}</h4>
                      <p className="text-sm text-muted-foreground">{PACK_A.description}</p>
                    </div>
                    <Badge variant="secondary">{totalLevels} Levels</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    );
  }

  // Render game complete
  if (gameState === "complete") {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card>
                <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center">
                  <Trophy className="h-12 w-12 mx-auto mb-2" />
                  <CardTitle className="text-2xl">{t('games.observationFlux.packComplete')}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4 text-center">
                  <div className="text-4xl font-bold text-primary">{score}</div>
                  <p className="text-muted-foreground">{t('games.observationFlux.totalPoints')}</p>

                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                      <div className="text-2xl font-bold text-green-600">
                        {observations.filter(o => o.result.valid).length}
                      </div>
                      <p className="text-sm text-muted-foreground">{t('games.observationFlux.validObservations')}</p>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                      <div className="text-2xl font-bold text-amber-600">
                        {caughtDecoys}
                      </div>
                      <p className="text-sm text-muted-foreground">{t('games.observationFlux.decoysCaught')}</p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                      <div className="text-2xl font-bold text-red-600">
                        {observations.filter(o => !o.result.valid).length}
                      </div>
                      <p className="text-sm text-muted-foreground">{t('games.observationFlux.interpretationsCaught')}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-3">
                      <div className="text-2xl font-bold text-gray-600">
                        {wrongClicks}
                      </div>
                      <p className="text-sm text-muted-foreground">{t('games.observationFlux.wrongClicks')}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-center">
                    <Button onClick={restartGame} variant="outline">
                      <RotateCcw className="mr-2 h-4 w-4" /> {t('games.common.playAgain')}
                    </Button>
                    <Button onClick={() => navigate("/games")}>
                      {t('common.backToGames')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <GameLeaderboard
              gameType="observation_flux"
              currentScore={score}
            />
          </div>
        </main>
      </div>
    );
  }

  // Render level complete
  if (gameState === "levelComplete") {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center">
                <CheckCircle className="h-10 w-10 mx-auto mb-2" />
                <CardTitle>{t('games.observationFlux.levelComplete', { level: currentLevelIndex + 1 })}</CardTitle>
                <CardDescription className="text-green-100">
                  {currentLevel?.reference}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{score}</div>
                  <p className="text-muted-foreground">{t('games.observationFlux.currentScore')}</p>
                </div>

                {/* Show expected observations */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">{t('games.observationFlux.keyObservations')}:</h4>
                  <ul className="space-y-1 text-sm">
                    {currentLevel?.expectedObservations.map((obs, i) => (
                      <li key={i} className="flex gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {obs}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-center">
                  <Button onClick={nextLevel} size="lg">
                    {t('games.observationFlux.nextLevel')} <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    );
  }

  // Render playing/paused state
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-4 max-w-7xl">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/games")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Badge variant="outline" className="font-mono">
              {currentLevel?.reference}
            </Badge>
            <Badge variant="secondary">
              Level {currentLevelIndex + 1}/{totalLevels}
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-lg font-bold">{score} pts</div>
            <Button variant="outline" size="sm" onClick={togglePause}>
              {gameState === "paused" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* OR Rule Reminder */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-2 mb-4 text-center">
          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
            {t('games.observationFlux.rule')}
          </span>
        </div>

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Left: Falling Field (3 cols) */}
          <div className="lg:col-span-3">
            <Card className="h-[60vh] relative overflow-hidden">
              {/* Verse Text at Top */}
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-background via-background/80 to-transparent p-3 z-10">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {currentLevel?.text}
                </p>
              </div>

              {/* Falling Blocks - Click to catch decoys! */}
              <div className="absolute inset-0 pt-16">
                <AnimatePresence>
                  {fallingBlocks.map((block) => (
                    <motion.div
                      key={block.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: block.opacity, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleBlockClick(block)}
                      className={`absolute px-3 py-2 rounded-lg text-white font-medium text-sm shadow-lg cursor-pointer select-none transition-shadow hover:shadow-xl hover:ring-2 hover:ring-white/50 bg-gradient-to-br ${getBlockStyle(block)}`}
                      style={{
                        left: `${block.x}%`,
                        top: `${block.y}%`,
                        transform: "translateX(-50%)",
                        maxWidth: "45%",
                      }}
                    >
                      {block.text}
                      {difficulty.showSubjectColors && block.subject && (
                        <span className="ml-2 text-xs opacity-70">({block.subject})</span>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Paused Overlay */}
                {gameState === "paused" && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <div className="text-center">
                      <Pause className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-lg font-medium">{t('games.common.paused')}</p>
                      <Button onClick={togglePause} className="mt-4">
                        <Play className="mr-2 h-4 w-4" /> {t('games.common.resume')}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress at Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <Progress
                  value={(verbsSpawned / getAllBlocks().length) * 100}
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground text-center mt-1">
                  {verbsSpawned}/{getAllBlocks().length} verbs
                </p>
              </div>
            </Card>
          </div>

          {/* Right: Observation Console (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Input Area */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  {t('games.observationFlux.observationConsole')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  placeholder={t('games.observationFlux.inputPlaceholder')}
                  value={inputText}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className="min-h-[120px] resize-none"
                  disabled={gameState === "paused"}
                />
                <Button
                  onClick={submitObservation}
                  disabled={!inputText.trim() || gameState === "paused"}
                  className="w-full"
                >
                  {t('games.observationFlux.submitObservation')}
                </Button>
              </CardContent>
            </Card>

            {/* Observation Log */}
            <Card className="max-h-[35vh] overflow-y-auto">
              <CardHeader className="py-3 sticky top-0 bg-background z-10">
                <CardTitle className="text-base">
                  {t('games.observationFlux.observations', { count: observations.length })}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {observations.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {t('games.observationFlux.noObservations')}
                  </p>
                ) : (
                  observations.map((obs, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded-lg text-sm ${
                        obs.result.valid
                          ? obs.result.type === "bonus"
                            ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                            : "bg-muted/50"
                          : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {obs.result.valid ? (
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p>{obs.text}</p>
                          {obs.result.points !== 0 && (
                            <p className={`text-xs mt-1 ${obs.result.points > 0 ? "text-green-600" : "text-red-600"}`}>
                              {obs.result.points > 0 ? "+" : ""}{obs.result.points} pts
                              {obs.result.feedback && ` — ${obs.result.feedback}`}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-2">
              <Card className="p-3 text-center">
                <div className="text-lg font-bold text-green-600">
                  {observations.filter(o => o.result.valid).length}
                </div>
                <p className="text-xs text-muted-foreground">{t('games.observationFlux.valid')}</p>
              </Card>
              <Card className="p-3 text-center">
                <div className="text-lg font-bold text-amber-600">
                  {caughtDecoys}
                </div>
                <p className="text-xs text-muted-foreground">{t('games.observationFlux.caught')}</p>
              </Card>
              <Card className="p-3 text-center">
                <div className="text-lg font-bold text-red-600">
                  {wrongClicks}
                </div>
                <p className="text-xs text-muted-foreground">{t('games.observationFlux.wrong')}</p>
              </Card>
              <Card className="p-3 text-center">
                <div className="text-lg font-bold text-gray-600">
                  {missedVerbs}
                </div>
                <p className="text-xs text-muted-foreground">{t('games.observationFlux.missed')}</p>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <FloatingGameChat gameType="observation-flux" />
    </div>
  );
};

export default ObservationFlux;
