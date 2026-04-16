import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useGameMultiplayer } from "@/hooks/useGameMultiplayer";
import { MultiplayerLobby } from "@/components/games/MultiplayerLobby";
import {
  Clock,
  HelpCircle,
  Trophy,
  Zap,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
  ChevronRight,
  Lightbulb,
  BookOpen,
  Volume2,
  VolumeX,
  ArrowRight,
  RotateCcw,
  Star,
  Sparkles,
  Key,
  AlertTriangle,
  Users
} from "lucide-react";
import {
  getEscapeRoomById,
  type EscapeRoom,
  type Puzzle,
  getMaxPoints
} from "@/data/escapeRoomData";

// Sound effects URLs (using Web Audio API for better performance)
const useSound = () => {
  const audioContext = useRef<AudioContext | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const initAudio = useCallback(() => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContext.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!soundEnabled) return;
    try {
      const ctx = initAudio();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      console.log('Audio not available');
    }
  }, [soundEnabled, initAudio]);

  const playSuccess = useCallback(() => {
    playTone(523.25, 0.1); // C5
    setTimeout(() => playTone(659.25, 0.1), 100); // E5
    setTimeout(() => playTone(783.99, 0.2), 200); // G5
  }, [playTone]);

  const playError = useCallback(() => {
    playTone(200, 0.3, 'sawtooth');
  }, [playTone]);

  const playUnlock = useCallback(() => {
    playTone(440, 0.1);
    setTimeout(() => playTone(554.37, 0.1), 100);
    setTimeout(() => playTone(659.25, 0.1), 200);
    setTimeout(() => playTone(880, 0.3), 300);
  }, [playTone]);

  const playVictory = useCallback(() => {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.2), i * 150);
    });
  }, [playTone]);

  return { playSuccess, playError, playUnlock, playVictory, soundEnabled, setSoundEnabled };
};

// Puzzle Components
interface PuzzleProps {
  puzzle: Puzzle;
  onSolve: (correct: boolean, answer: string) => void;
  showHint: boolean;
}

// Riddle Puzzle
const RiddlePuzzle = ({ puzzle, onSolve, showHint }: PuzzleProps) => {
  const { t } = useTranslation();
  const [answer, setAnswer] = useState("");

  const checkAnswer = () => {
    const normalizedAnswer = answer.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');
    const expectedAnswer = (puzzle.answer || "").toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');

    // Check for exact match or if the core answer words match
    const answerWords = normalizedAnswer.split(/\s+/);
    const expectedWords = expectedAnswer.split(/\s+/);

    // Check if all expected words are present in the answer (order doesn't matter for flexibility)
    const allWordsMatch = expectedWords.every(word =>
      answerWords.some(ansWord => ansWord === word || ansWord.startsWith(word) && word.length >= 3)
    );

    // Also accept if normalized answer equals expected
    const isCorrect = normalizedAnswer === expectedAnswer || allWordsMatch;
    onSolve(isCorrect, answer);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
        <p className="text-lg font-medium italic leading-relaxed">{puzzle.question}</p>
      </div>
      {showHint && puzzle.hint && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3"
        >
          <Lightbulb className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-600 dark:text-amber-400">{puzzle.hint}</p>
        </motion.div>
      )}
      <div className="flex gap-3">
        <Input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={t('escapeRoom.renovated.enterAnswerPlaceholder')}
          onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
          className="flex-1"
        />
        <Button onClick={checkAnswer} disabled={!answer.trim()}>
          {t('common.submit')}
        </Button>
      </div>
    </div>
  );
};

// Fill in the Blank Puzzle
const FillBlankPuzzle = ({ puzzle, onSolve, showHint }: PuzzleProps) => {
  const { t } = useTranslation();
  const [answer, setAnswer] = useState("");

  const checkAnswer = () => {
    const isCorrect = answer.toLowerCase().trim() === puzzle.answer?.toLowerCase();
    onSolve(isCorrect, answer);
  };

  // Highlight the blank
  const questionParts = puzzle.question.split('_______');

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-6">
        <p className="text-lg font-medium leading-relaxed">
          {questionParts[0]}
          <span className="inline-block min-w-[100px] border-b-2 border-primary mx-2 text-center">
            {answer || '______'}
          </span>
          {questionParts[1]}
        </p>
      </div>
      {showHint && puzzle.hint && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3"
        >
          <Lightbulb className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-600 dark:text-amber-400">{puzzle.hint}</p>
        </motion.div>
      )}
      <div className="flex gap-3">
        <Input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={t('escapeRoom.renovated.fillBlankPlaceholder')}
          onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
          className="flex-1"
        />
        <Button onClick={checkAnswer} disabled={!answer.trim()}>
          {t('common.submit')}
        </Button>
      </div>
    </div>
  );
};

// Multiple Choice Puzzle
const MultipleChoicePuzzle = ({ puzzle, onSolve, showHint }: PuzzleProps) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<number | null>(null);

  const checkAnswer = () => {
    if (selected === null) return;
    const isCorrect = selected === puzzle.correctOption;
    onSolve(isCorrect, puzzle.options?.[selected] || "");
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-6">
        <p className="text-lg font-medium leading-relaxed">{puzzle.question}</p>
      </div>
      {showHint && puzzle.hint && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3"
        >
          <Lightbulb className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-600 dark:text-amber-400">{puzzle.hint}</p>
        </motion.div>
      )}
      <div className="grid gap-3">
        {puzzle.options?.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelected(index)}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              selected === index
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                selected === index ? 'bg-primary text-white' : 'bg-muted'
              }`}>
                {String.fromCharCode(65 + index)}
              </div>
              <span>{option}</span>
            </div>
          </motion.button>
        ))}
      </div>
      <Button onClick={checkAnswer} disabled={selected === null} className="w-full">
        {t('escapeRoom.renovated.lockInAnswer')}
      </Button>
    </div>
  );
};

// Sequence Puzzle
const SequencePuzzle = ({ puzzle, onSolve, showHint }: PuzzleProps) => {
  const { t } = useTranslation();
  const [order, setOrder] = useState<number[]>([]);
  const [available, setAvailable] = useState<number[]>(
    puzzle.items?.map((_, i) => i) || []
  );

  const addToSequence = (index: number) => {
    setOrder([...order, index]);
    setAvailable(available.filter(i => i !== index));
  };

  const removeFromSequence = (position: number) => {
    const removed = order[position];
    setOrder(order.filter((_, i) => i !== position));
    setAvailable([...available, removed].sort((a, b) => a - b));
  };

  const checkAnswer = () => {
    const isCorrect = JSON.stringify(order) === JSON.stringify(puzzle.correctOrder);
    onSolve(isCorrect, order.map(i => puzzle.items?.[i]).join(' -> '));
  };

  const reset = () => {
    setOrder([]);
    setAvailable(puzzle.items?.map((_, i) => i) || []);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-6">
        <p className="text-lg font-medium leading-relaxed">{puzzle.question}</p>
      </div>
      {showHint && puzzle.hint && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3"
        >
          <Lightbulb className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-600 dark:text-amber-400">{puzzle.hint}</p>
        </motion.div>
      )}

      {/* Your Sequence */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <ArrowRight className="h-4 w-4" /> {t('escapeRoom.renovated.yourSequence')}
        </label>
        <div className="min-h-[60px] p-3 border-2 border-dashed border-primary/30 rounded-lg flex flex-wrap gap-2">
          {order.length === 0 ? (
            <span className="text-muted-foreground text-sm">{t('escapeRoom.renovated.clickToAddInOrder')}</span>
          ) : (
            order.map((itemIndex, position) => (
              <motion.button
                key={`seq-${position}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => removeFromSequence(position)}
                className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm flex items-center gap-2 hover:bg-primary/80"
              >
                <span className="font-bold">{position + 1}.</span>
                {puzzle.items?.[itemIndex]}
                <XCircle className="h-4 w-4" />
              </motion.button>
            ))
          )}
        </div>
      </div>

      {/* Available Items */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t('escapeRoom.renovated.availableItems')}</label>
        <div className="flex flex-wrap gap-2">
          {available.map((itemIndex) => (
            <motion.button
              key={`avail-${itemIndex}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => addToSequence(itemIndex)}
              className="px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm"
            >
              {puzzle.items?.[itemIndex]}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={reset} className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4" /> {t('common.reset')}
        </Button>
        <Button
          onClick={checkAnswer}
          disabled={order.length !== puzzle.items?.length}
          className="flex-1"
        >
          {t('escapeRoom.renovated.checkOrder')}
        </Button>
      </div>
    </div>
  );
};

// Match Puzzle
const MatchPuzzle = ({ puzzle, onSolve, showHint }: PuzzleProps) => {
  const { t } = useTranslation();
  const [matches, setMatches] = useState<Record<number, number>>({});
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);

  const handleLeftClick = (index: number) => {
    setSelectedLeft(index);
  };

  const handleRightClick = (index: number) => {
    if (selectedLeft !== null) {
      setMatches({ ...matches, [selectedLeft]: index });
      setSelectedLeft(null);
    }
  };

  const clearMatch = (leftIndex: number) => {
    const newMatches = { ...matches };
    delete newMatches[leftIndex];
    setMatches(newMatches);
  };

  const checkAnswer = () => {
    // Check if all matches are correct
    const allCorrect = puzzle.pairs?.every((pair, index) => {
      return matches[index] === index;
    });
    onSolve(allCorrect || false, JSON.stringify(matches));
  };

  const reset = () => {
    setMatches({});
    setSelectedLeft(null);
  };

  // Shuffle right side for display
  const shuffledRightIndices = useRef<number[]>([]);
  if (shuffledRightIndices.current.length === 0 && puzzle.pairs) {
    shuffledRightIndices.current = puzzle.pairs.map((_, i) => i).sort(() => Math.random() - 0.5);
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 rounded-lg p-6">
        <p className="text-lg font-medium leading-relaxed">{puzzle.question}</p>
      </div>
      {showHint && puzzle.hint && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3"
        >
          <Lightbulb className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-600 dark:text-amber-400">{puzzle.hint}</p>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-2">
          {puzzle.pairs?.map((pair, index) => (
            <motion.button
              key={`left-${index}`}
              whileHover={{ scale: 1.02 }}
              onClick={() => matches[index] !== undefined ? clearMatch(index) : handleLeftClick(index)}
              className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                selectedLeft === index
                  ? 'border-primary bg-primary/10'
                  : matches[index] !== undefined
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm">{pair.left}</span>
                {matches[index] !== undefined && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-2">
          {shuffledRightIndices.current.map((originalIndex) => {
            const pair = puzzle.pairs?.[originalIndex];
            const isMatched = Object.values(matches).includes(originalIndex);
            return (
              <motion.button
                key={`right-${originalIndex}`}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleRightClick(originalIndex)}
                disabled={isMatched}
                className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                  isMatched
                    ? 'border-green-500 bg-green-500/10 opacity-50'
                    : selectedLeft !== null
                    ? 'border-primary/50 hover:border-primary bg-primary/5'
                    : 'border-border'
                }`}
              >
                <span className="text-sm">{pair?.right}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={reset} className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4" /> {t('common.reset')}
        </Button>
        <Button
          onClick={checkAnswer}
          disabled={Object.keys(matches).length !== puzzle.pairs?.length}
          className="flex-1"
        >
          {t('escapeRoom.renovated.checkMatches')}
        </Button>
      </div>
    </div>
  );
};

// Cipher Puzzle
const CipherPuzzle = ({ puzzle, onSolve, showHint }: PuzzleProps) => {
  const { t } = useTranslation();
  const [answer, setAnswer] = useState("");

  const checkAnswer = () => {
    const isCorrect = answer.toLowerCase().replace(/[^a-z]/g, '') ===
                      puzzle.answer?.toLowerCase().replace(/[^a-z]/g, '');
    onSolve(isCorrect, answer);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-6 space-y-4">
        <p className="text-lg font-medium leading-relaxed">{puzzle.question}</p>
        <div className="bg-black/20 p-4 rounded font-mono text-sm break-all">
          {puzzle.cipherText}
        </div>
        {puzzle.cipherKey && (
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Key className="h-4 w-4" />
            {t('escapeRoom.renovated.key')}: {puzzle.cipherKey}
          </div>
        )}
      </div>
      {showHint && puzzle.hint && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3"
        >
          <Lightbulb className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-600 dark:text-amber-400">{puzzle.hint}</p>
        </motion.div>
      )}
      <div className="flex gap-3">
        <Input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={t('escapeRoom.renovated.decodePlaceholder')}
          onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
          className="flex-1"
        />
        <Button onClick={checkAnswer} disabled={!answer.trim()}>
          {t('escapeRoom.renovated.decode')}
        </Button>
      </div>
    </div>
  );
};

// Main Component
export default function EscapeRoomPlayRenovated() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { playSuccess, playError, playUnlock, playVictory, soundEnabled, setSoundEnabled } = useSound();

  // Multiplayer
  const multiplayer = useGameMultiplayer("escape_room");
  const [gameMode, setGameMode] = useState<"solo" | "online" | null>(null);
  const autoJoinCode = searchParams.get("room");

  // Auto-join from URL
  useEffect(() => {
    if (autoJoinCode && !multiplayer.room) {
      setGameMode("online");
      multiplayer.joinRoom(autoJoinCode);
    }
  }, [autoJoinCode]);

  const [room, setRoom] = useState<EscapeRoom | null>(null);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [solvedPuzzles, setSolvedPuzzles] = useState<Set<string>>(new Set());
  const [cluesRevealed, setCluesRevealed] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showPrinciple, setShowPrinciple] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'solved' | 'failed'>('playing');
  const [finalAnswerInput, setFinalAnswerInput] = useState("");
  const [showFinalPuzzle, setShowFinalPuzzle] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [wrongAnswerShake, setWrongAnswerShake] = useState(false);
  const isMultiplayer = gameMode === "online" && multiplayer.room;

  // Sync multiplayer game state when host updates
  useEffect(() => {
    if (!isMultiplayer || !multiplayer.room?.game_state) return;
    const gs = multiplayer.room.game_state as any;
    if (!gs.puzzleIndex && gs.puzzleIndex !== 0) return;

    // Only non-hosts sync from game state
    if (!multiplayer.isHost) {
      setCurrentPuzzleIndex(gs.puzzleIndex ?? 0);
      setSolvedPuzzles(new Set(gs.solvedPuzzles ?? []));
      setCluesRevealed(gs.cluesRevealed ?? []);
      setScore(gs.score ?? 0);
      setHintsUsed(gs.hintsUsed ?? 0);
      setShowFinalPuzzle(gs.showFinalPuzzle ?? false);
      if (gs.gameState === 'solved') setGameState('solved');
      if (gs.gameState === 'failed') setGameState('failed');
    }
  }, [multiplayer.room?.game_state, multiplayer.room?.updated_at]);

  // When multiplayer room goes active, start the game
  useEffect(() => {
    if (isMultiplayer && multiplayer.room?.status === "active" && gameMode === "online") {
      // Game has started
    }
  }, [multiplayer.room?.status]);

  // Load room data
  useEffect(() => {
    if (roomId) {
      const roomData = getEscapeRoomById(roomId);
      if (roomData) {
        setRoom(roomData);
      } else {
        toast.error(t('escapeRoom.renovated.roomNotFound'));
        navigate('/escape-room');
      }
    }
  }, [roomId, navigate]);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing' || !room) return;

    const timer = setInterval(() => {
      setTimeElapsed(prev => {
        const newTime = prev + 1;
        if (newTime >= room.timeLimit * 60) {
          setGameState('failed');
          return prev;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, room]);

  // Save progress to Supabase
  const saveProgress = useCallback(async () => {
    if (!user || !room) return;

    try {
      await supabase.from('escape_room_attempts').upsert({
        room_id: room.id,
        user_id: user.id,
        score,
        hints_used: hintsUsed,
        time_elapsed_seconds: timeElapsed,
        completed_at: gameState === 'solved' ? new Date().toISOString() : null,
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }, [user, room, score, hintsUsed, timeElapsed, gameState]);

  useEffect(() => {
    if (gameState === 'solved') {
      saveProgress();
    }
  }, [gameState, saveProgress]);

  // Broadcast multiplayer state
  const broadcastState = useCallback((overrides: Record<string, any> = {}) => {
    if (!isMultiplayer || !multiplayer.isHost) return;
    multiplayer.updateGameState({
      puzzleIndex: currentPuzzleIndex,
      solvedPuzzles: [...solvedPuzzles],
      cluesRevealed,
      score,
      hintsUsed,
      showFinalPuzzle,
      gameState,
      ...overrides,
    });
  }, [isMultiplayer, multiplayer.isHost, currentPuzzleIndex, solvedPuzzles, cluesRevealed, score, hintsUsed, showFinalPuzzle, gameState]);

  const handlePuzzleSolved = (correct: boolean, answer: string) => {
    if (!room) return;

    // In multiplayer, only allow current turn player to answer (or any player in co-op)
    const currentPuzzle = room.puzzles[currentPuzzleIndex];

    if (correct) {
      playSuccess();
      const newSolved = new Set([...solvedPuzzles, currentPuzzle.id]);
      const newClues = [...cluesRevealed, currentPuzzle.clueRevealed];
      const newScore = score + currentPuzzle.points;
      setSolvedPuzzles(newSolved);
      setCluesRevealed(newClues);
      setScore(newScore);

      // Find who solved it for multiplayer display
      if (isMultiplayer && multiplayer.myPlayer) {
        toast.success(
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div>
              <div className="font-bold">{multiplayer.myPlayer.display_name} solved it! +{currentPuzzle.points} pts</div>
              <div className="text-sm opacity-80">{t('escapeRoom.renovated.clueRevealed')}</div>
            </div>
          </div>,
          { duration: 3000 }
        );
      } else {
        toast.success(
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div>
              <div className="font-bold">{t('escapeRoom.renovated.correctPoints', { points: currentPuzzle.points })}</div>
              <div className="text-sm opacity-80">{t('escapeRoom.renovated.clueRevealed')}</div>
            </div>
          </div>,
          { duration: 3000 }
        );
      }

      // Move to next puzzle or show final
      setTimeout(() => {
        if (currentPuzzleIndex < room.puzzles.length - 1) {
          const newIndex = currentPuzzleIndex + 1;
          setCurrentPuzzleIndex(newIndex);
          setShowHint(false);
          setShowPrinciple(false);
          playUnlock();
          // Broadcast updated state
          if (isMultiplayer && multiplayer.isHost) {
            multiplayer.updateGameState({
              puzzleIndex: newIndex,
              solvedPuzzles: [...newSolved],
              cluesRevealed: newClues,
              score: newScore,
              hintsUsed,
              showFinalPuzzle: false,
              gameState: 'playing',
            });
          }
        } else {
          setShowFinalPuzzle(true);
          playUnlock();
          if (isMultiplayer && multiplayer.isHost) {
            multiplayer.updateGameState({
              puzzleIndex: currentPuzzleIndex,
              solvedPuzzles: [...newSolved],
              cluesRevealed: newClues,
              score: newScore,
              hintsUsed,
              showFinalPuzzle: true,
              gameState: 'playing',
            });
          }
        }
      }, 1500);
    } else {
      playError();
      setWrongAnswerShake(true);
      setTimeout(() => setWrongAnswerShake(false), 500);

      toast.error(
        <div className="flex items-center gap-2">
          <XCircle className="h-5 w-5 text-red-500" />
          <div>
            <div className="font-bold">{t('escapeRoom.renovated.notQuiteRight')}</div>
            <div className="text-sm opacity-80">{t('escapeRoom.renovated.tryAgainOrHint')}</div>
          </div>
        </div>,
        { duration: 2000 }
      );
    }
  };

  const requestHint = () => {
    if (hintsUsed >= 3) {
      toast.error(t('escapeRoom.renovated.noHintsRemaining'));
      return;
    }
    const newHints = hintsUsed + 1;
    const newScore = Math.max(0, score - 5);
    setHintsUsed(newHints);
    setScore(newScore);
    setShowHint(true);
    toast.info(t('escapeRoom.renovated.hintRevealedPoints'));
    
    // Broadcast hint usage in multiplayer
    if (isMultiplayer && multiplayer.isHost) {
      multiplayer.updateGameState({
        puzzleIndex: currentPuzzleIndex,
        solvedPuzzles: [...solvedPuzzles],
        cluesRevealed,
        score: newScore,
        hintsUsed: newHints,
        showFinalPuzzle,
        gameState: 'playing',
      });
    }
  };

  const checkFinalAnswer = () => {
    if (!room) return;

    setAttempts(prev => prev + 1);

    // Normalize answers for comparison
    const normalizedInput = finalAnswerInput.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');
    const expectedAnswer = room.finalAnswer.answer.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');

    // Check for exact match first
    const exactMatch = normalizedInput === expectedAnswer;

    // Check if all key words from expected answer are in input
    const expectedWords = expectedAnswer.split(/\s+/).filter(w => w.length >= 3);
    const inputWords = normalizedInput.split(/\s+/);
    const keyWordsMatch = expectedWords.length > 0 && expectedWords.every(word =>
      inputWords.some(inputWord => inputWord === word || inputWord.startsWith(word))
    );

    // Also allow if the input exactly matches the first significant word of the expected answer
    const firstWord = expectedWords[0];
    const exactFirstWordMatch = firstWord && inputWords.some(w => w === firstWord);

    const isCorrect = exactMatch || keyWordsMatch || exactFirstWordMatch;

    if (isCorrect) {
      playVictory();
      setGameState('solved');

      // Calculate time bonus
      const timeRemaining = room.timeLimit * 60 - timeElapsed;
      const timeBonus = Math.floor(timeRemaining / 10);
      setScore(prev => prev + timeBonus + 50); // 50 bonus for solving

      // Broadcast victory in multiplayer
      if (isMultiplayer && multiplayer.isHost) {
        multiplayer.updateGameState({
          puzzleIndex: currentPuzzleIndex,
          solvedPuzzles: [...solvedPuzzles],
          cluesRevealed,
          score: score + timeBonus + 50,
          hintsUsed,
          showFinalPuzzle: true,
          gameState: 'solved',
        }, undefined, 'completed');
      }

      toast.success(
        <div className="text-center">
          <div className="text-2xl mb-2">{isMultiplayer ? '🎉 Team Escaped!' : t('escapeRoom.renovated.youEscaped')}</div>
          <div>{t('escapeRoom.renovated.timeBonusEscapeBonus', { timeBonus })}</div>
        </div>,
        { duration: 5000 }
      );
    } else {
      playError();
      setWrongAnswerShake(true);
      setTimeout(() => setWrongAnswerShake(false), 500);

      if (attempts >= 2) {
        toast.error(
          <div>
            <div className="font-bold">{t('escapeRoom.renovated.notTheAnswer')}</div>
            <div className="text-sm">{t('escapeRoom.renovated.hintLabel')}: {room.finalAnswer.hint}</div>
          </div>,
          { duration: 4000 }
        );
      } else {
        toast.error(t('escapeRoom.renovated.reviewClues'));
      }
    }
  };

  if (!room) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p>{t('escapeRoom.renovated.loading')}</p>
        </div>
      </div>
    );
  }

  // Mode Selection Screen (before game starts)
  if (!gameMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <Navigation />
        <main className="container mx-auto px-4 pt-24 pb-12 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <div className="text-5xl mb-4">{room.icon}</div>
              <h1 className="text-3xl font-bold">{room.title}</h1>
              <p className="text-muted-foreground">{room.storyIntro?.slice(0, 120)}...</p>
            </div>

            <div className="grid gap-4">
              <Card
                className="cursor-pointer border-2 hover:border-primary/50 transition-all"
                onClick={() => setGameMode("solo")}
              >
                <CardContent className="pt-6 flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Solo Mode</h3>
                    <p className="text-sm text-muted-foreground">Race against the clock on your own</p>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer border-2 hover:border-primary/50 transition-all"
                onClick={() => setGameMode("online")}
              >
                <CardContent className="pt-6 flex items-center gap-4">
                  <div className="p-3 rounded-full bg-accent/10">
                    <Users className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Team Mode (Online)</h3>
                    <p className="text-sm text-muted-foreground">Solve puzzles with 2–4 friends in real time</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button variant="outline" onClick={() => navigate('/escape-room')} className="w-full">
              Back to Escape Rooms
            </Button>
          </motion.div>
        </main>
      </div>
    );
  }

  // Multiplayer Lobby (waiting for players)
  if (gameMode === "online" && (!multiplayer.room || multiplayer.room.status === "waiting")) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <Navigation />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <MultiplayerLobby
            room={multiplayer.room}
            players={multiplayer.players}
            loading={multiplayer.loading}
            isHost={multiplayer.isHost}
            minPlayers={2}
            maxPlayers={4}
            gameName={`Escape Room: ${room.title}`}
            onCreateRoom={(max) => multiplayer.createRoom(max || 4, { roomId: room.id })}
            onJoinRoom={(code) => multiplayer.joinRoom(code)}
            onStartGame={() => {
              multiplayer.startGame({
                puzzleIndex: 0,
                solvedPuzzles: [],
                cluesRevealed: [],
                score: 0,
                hintsUsed: 0,
                showFinalPuzzle: false,
                gameState: 'playing',
              }, multiplayer.players[0]?.user_id || user?.id || '');
            }}
            onLeaveRoom={() => {
              multiplayer.leaveRoom();
              setGameMode(null);
            }}
            onBack={() => setGameMode(null)}
          />
        </main>
      </div>
    );
  }

  const currentPuzzle = room.puzzles[currentPuzzleIndex];
  const progress = (solvedPuzzles.size / room.puzzles.length) * 100;
  const timeRemaining = room.timeLimit * 60 - timeElapsed;
  const minutesRemaining = Math.floor(timeRemaining / 60);
  const secondsRemaining = timeRemaining % 60;
  const maxPoints = getMaxPoints(room);

  // Victory Screen
  if (gameState === 'solved') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <Navigation />
        <main className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-8"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 bg-clip-text text-transparent">
              {isMultiplayer ? '🎉 Team Escaped!' : t('escapeRoom.renovated.escaped')}
            </h1>
            <p className="text-xl text-muted-foreground">{room.title}</p>

            {/* Team Members on Victory */}
            {isMultiplayer && multiplayer.players.length > 0 && (
              <div className="flex items-center justify-center gap-3 flex-wrap">
                {multiplayer.players.map((player) => (
                  <Badge key={player.id} variant="secondary" className="text-sm px-3 py-1">
                    {player.display_name}
                  </Badge>
                ))}
              </div>
            )}

            <Card className="max-w-md mx-auto">
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <Trophy className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
                    <div className="text-2xl font-bold">{score}</div>
                    <div className="text-xs text-muted-foreground">{t('escapeRoom.renovated.points')}</div>
                  </div>
                  <div>
                    <Clock className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                    <div className="text-2xl font-bold">{Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</div>
                    <div className="text-xs text-muted-foreground">{t('escapeRoom.renovated.time')}</div>
                  </div>
                  <div>
                    <HelpCircle className="h-8 w-8 mx-auto text-amber-500 mb-2" />
                    <div className="text-2xl font-bold">{hintsUsed}</div>
                    <div className="text-xs text-muted-foreground">{t('escapeRoom.renovated.hintsUsed')}</div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-bold mb-2">{t('escapeRoom.renovated.theAnswer')}</h3>
                  <p className="text-lg text-primary font-semibold">{room.finalAnswer.answer}</p>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-bold mb-2">{t('escapeRoom.renovated.explanation')}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{room.finalAnswer.explanation}</p>
                </div>

                <div className="bg-primary/10 rounded-lg p-4">
                  <BookOpen className="h-5 w-5 text-primary mb-2" />
                  <p className="text-sm italic">{room.finalAnswer.verse}</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => navigate('/escape-room')}>
                {t('escapeRoom.renovated.backToRooms')}
              </Button>
              <Button onClick={() => window.location.reload()}>
                {t('escapeRoom.renovated.playAgain')}
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // Failed Screen
  if (gameState === 'failed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-destructive/5">
        <Navigation />
        <main className="container mx-auto px-4 pt-24 pb-12 max-w-4xl text-center space-y-8">
          <div className="text-6xl mb-4">⏱️</div>
          <h1 className="text-4xl font-bold text-destructive">{t('escapeRoom.renovated.timesUp')}</h1>
          <p className="text-muted-foreground">{t('escapeRoom.renovated.ranOutOfTime', { title: room.title })}</p>

          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">{t('escapeRoom.renovated.answerWas')}</p>
                <p className="text-lg font-bold text-primary">{room.finalAnswer.answer}</p>
              </div>
              <p className="text-sm text-muted-foreground">{room.finalAnswer.explanation}</p>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => navigate('/escape-room')}>
              {t('escapeRoom.renovated.backToRooms')}
            </Button>
            <Button onClick={() => window.location.reload()}>
              {t('escapeRoom.renovated.tryAgain')}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${room.backgroundGradient}`}>
      <Navigation />

      <main className="container mx-auto px-4 pt-20 pb-12 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">{room.icon}</span>
              {room.title}
            </h1>
            <Badge variant="outline" className="mt-2 bg-white/10 text-white border-white/20">
              {room.theme} - {room.difficulty.charAt(0).toUpperCase() + room.difficulty.slice(1)}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-white"
          >
            {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
        </div>

        {/* Stats Bar */}
        <Card className="mb-6 bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-white">
                  <Clock className="h-5 w-5" />
                  <span className={`font-mono text-lg ${timeRemaining < 60 ? 'text-red-400 animate-pulse' : ''}`}>
                    {minutesRemaining}:{secondsRemaining.toString().padStart(2, '0')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  <span className="font-bold">{score}/{maxPoints + 50}</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <HelpCircle className="h-5 w-5" />
                  <span>{t('escapeRoom.renovated.hintsCount', { count: 3 - hintsUsed })}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="text-sm">{t('escapeRoom.renovated.puzzleProgress', { current: currentPuzzleIndex + 1, total: room.puzzles.length })}</span>
                <Progress value={progress} className="w-32 h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teammates Bar (Multiplayer) */}
        {isMultiplayer && multiplayer.players.length > 0 && (
          <div className="mb-6 flex items-center gap-3 flex-wrap">
            <Badge variant="outline" className="bg-white/10 text-white border-white/20">
              <Users className="h-3 w-3 mr-1" /> Team
            </Badge>
            {multiplayer.players.map((player) => (
              <div
                key={player.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
              >
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {player.display_name[0]?.toUpperCase()}
                </div>
                <span className="text-sm text-white font-medium">{player.display_name}</span>
                {player.user_id === user?.id && (
                  <span className="text-xs text-white/60">(you)</span>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Puzzle Area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {!showFinalPuzzle ? (
                <motion.div
                  key={currentPuzzle.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card className={`${wrongAnswerShake ? 'animate-shake' : ''}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <Badge className="mb-2">{currentPuzzle.type.replace('-', ' ').toUpperCase()}</Badge>
                          <CardTitle className="text-xl">{t('escapeRoom.renovated.puzzleNumber', { number: currentPuzzleIndex + 1 })}</CardTitle>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">{currentPuzzle.points}</div>
                          <div className="text-xs text-muted-foreground">{t('escapeRoom.renovated.points')}</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Mission Briefing - Shows at the start of each puzzle */}
                      {currentPuzzleIndex === 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-4 space-y-2"
                        >
                          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                            <AlertTriangle className="h-4 w-4" />
                            {t('escapeRoom.renovated.missionBriefing')}
                          </div>
                          <p className="text-sm text-muted-foreground italic">{room.storyIntro}</p>
                        </motion.div>
                      )}

                      {/* Your Mission for this Puzzle */}
                      <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-lg p-4 space-y-2">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                          <Zap className="h-4 w-4" />
                          {t('escapeRoom.renovated.yourMission')}
                        </div>
                        <p className="text-sm font-medium">
                          {currentPuzzle.type === 'riddle' && t('escapeRoom.renovated.missionRiddle')}
                          {currentPuzzle.type === 'fill-blank' && t('escapeRoom.renovated.missionFillBlank')}
                          {currentPuzzle.type === 'multiple-choice' && t('escapeRoom.renovated.missionMultipleChoice')}
                          {currentPuzzle.type === 'sequence' && t('escapeRoom.renovated.missionSequence')}
                          {currentPuzzle.type === 'match' && t('escapeRoom.renovated.missionMatch')}
                          {currentPuzzle.type === 'cipher' && t('escapeRoom.renovated.missionCipher')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t('escapeRoom.renovated.collectCluesInstruction')}
                        </p>
                      </div>

                      {/* Principle Explainer */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPrinciple(!showPrinciple)}
                        className="w-full justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          {currentPuzzle.principle.name} ({currentPuzzle.principle.roomTag})
                        </span>
                        <ChevronRight className={`h-4 w-4 transition-transform ${showPrinciple ? 'rotate-90' : ''}`} />
                      </Button>

                      <AnimatePresence>
                        {showPrinciple && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <Card className="bg-primary/5 border-primary/20">
                              <CardContent className="pt-4 space-y-3">
                                <div>
                                  <h4 className="font-semibold text-sm text-primary mb-1">{t('escapeRoom.renovated.whatIs', { name: currentPuzzle.principle.name })}</h4>
                                  <p className="text-sm text-muted-foreground">{currentPuzzle.principle.explanation}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-sm text-primary mb-1">{t('escapeRoom.renovated.howToApply')}</h4>
                                  <p className="text-sm text-muted-foreground">{currentPuzzle.principle.howToApply}</p>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {t('escapeRoom.renovated.from')}: {currentPuzzle.principle.room}
                                </Badge>
                              </CardContent>
                            </Card>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Puzzle Component */}
                      {currentPuzzle.type === 'riddle' && (
                        <RiddlePuzzle puzzle={currentPuzzle} onSolve={handlePuzzleSolved} showHint={showHint} />
                      )}
                      {currentPuzzle.type === 'fill-blank' && (
                        <FillBlankPuzzle puzzle={currentPuzzle} onSolve={handlePuzzleSolved} showHint={showHint} />
                      )}
                      {currentPuzzle.type === 'multiple-choice' && (
                        <MultipleChoicePuzzle puzzle={currentPuzzle} onSolve={handlePuzzleSolved} showHint={showHint} />
                      )}
                      {currentPuzzle.type === 'sequence' && (
                        <SequencePuzzle puzzle={currentPuzzle} onSolve={handlePuzzleSolved} showHint={showHint} />
                      )}
                      {currentPuzzle.type === 'match' && (
                        <MatchPuzzle puzzle={currentPuzzle} onSolve={handlePuzzleSolved} showHint={showHint} />
                      )}
                      {currentPuzzle.type === 'cipher' && (
                        <CipherPuzzle puzzle={currentPuzzle} onSolve={handlePuzzleSolved} showHint={showHint} />
                      )}

                      {/* Hint Button */}
                      {!showHint && hintsUsed < 3 && (
                        <Button variant="outline" onClick={requestHint} className="w-full">
                          <Lightbulb className="h-4 w-4 mr-2" />
                          {t('escapeRoom.renovated.useHint', { remaining: 3 - hintsUsed })}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card className={`border-2 border-primary ${wrongAnswerShake ? 'animate-shake' : ''}`}>
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary rounded-full">
                          <Key className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl">{t('escapeRoom.renovated.finalLock')}</CardTitle>
                          <CardDescription>{t('escapeRoom.renovated.useCluesForAnswer')}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-lg p-6">
                        <h3 className="font-bold mb-2">{t('escapeRoom.renovated.theQuestion')}</h3>
                        <p className="text-lg">
                          {t('escapeRoom.renovated.finalQuestion', { type: room.finalAnswer.type })}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Input
                          value={finalAnswerInput}
                          onChange={(e) => setFinalAnswerInput(e.target.value)}
                          placeholder={t('escapeRoom.renovated.finalAnswerPlaceholder')}
                          onKeyDown={(e) => e.key === 'Enter' && checkFinalAnswer()}
                          className="flex-1 text-lg"
                        />
                        <Button onClick={checkFinalAnswer} size="lg" disabled={!finalAnswerInput.trim()}>
                          <Unlock className="h-5 w-5 mr-2" />
                          {t('escapeRoom.renovated.escape')}
                        </Button>
                      </div>

                      {attempts >= 2 && (
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-amber-600 dark:text-amber-400">
                            {t('escapeRoom.renovated.hintLabel')}: {room.finalAnswer.hint}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar - Clues */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  {t('escapeRoom.renovated.cluesGathered')}
                </CardTitle>
                <CardDescription>
                  {t('escapeRoom.renovated.cluesFound', { found: cluesRevealed.length, total: room.puzzles.length })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {cluesRevealed.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Lock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">{t('escapeRoom.renovated.solvePuzzlesToReveal')}</p>
                      </div>
                    ) : (
                      cluesRevealed.map((clue, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-lg p-3"
                        >
                          <div className="flex items-start gap-2">
                            <Star className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm">{clue}</p>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Story Intro (First Load) */}
        {currentPuzzleIndex === 0 && solvedPuzzles.size === 0 && (
          <Card className="mt-6 bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                {room.storyIntro}
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
