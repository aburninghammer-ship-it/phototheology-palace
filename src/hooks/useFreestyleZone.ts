import { useState, useCallback, useRef, useEffect } from "react";
import { callJeeves } from "@/lib/jeevesClient";
import { useGameSession } from "@/hooks/useGameSession";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

// ── Types ──────────────────────────────────────────────────────────────

export type Difficulty = "beginner" | "intermediate" | "advanced" | "master";
export type GamePhase = "setup" | "active" | "complete";
export type FreestyleMode = "partial" | "whole" | "verse_storm" | "trinity_drop" | "constraint" | "opposites" | "target" | "palace_room";

export type DropCategory = "scripture" | "nature" | "everyday" | "history" | "human_experience" | "symbolic" | "action" | "tension_pair" | "abstract";
export type DropFocus = DropCategory | "random";

export interface Drop {
  category: DropCategory;
  drop: string;
  hint?: string;
}

export interface VerseStormDrop {
  verse: string;        // e.g. "John 3:16"
  verseText: string;
  objects: string[];    // 10-15 items
}

export interface TrinityDrop {
  object: string;
  concept: string;
  action: string;
  hint?: string;
  verse?: string;
  verseText?: string;
}

export interface ConstraintDrop {
  verse: string;
  verseText: string;
  constraint: string;
  drop: string;
}

export interface OppositesDrop {
  verse: string;
  verseText: string;
  pair: [string, string];
}

export interface TargetDrop {
  verse: string;
  verseText: string;
  targetPerson: string;
  targetDescription: string;
}

export interface PalaceRoomDrop {
  verse: string;
  verseText: string;
  roomName: string;
  roomCode: string;
}

export interface FactCheckIssue {
  claim: string;
  correction: string;
  severity: "minor" | "moderate" | "major";
}

export interface FactCheckResult {
  verified: boolean;
  issues: FactCheckIssue[];
  note: string;
}

export interface EvaluationScores {
  christConnection: number;
  depth: number;
  creativity: number;
  chainLink: number;
  totalScore: number;
  feedback: string;
  suggestion?: string;
  factCheck?: FactCheckResult;
}

export interface ChainEntry {
  drop: Drop;
  response: string | null; // null = passed
  scores: EvaluationScores | null;
  timestamp: number;
}

export interface SessionSummary {
  overallGrade: string;
  title: string;
  strengths: string[];
  growthAreas: string[];
  bestMoment: string;
  bestMomentDrop: number;
  patternNoticed: string;
  encouragement: string;
  streakHighlight: string;
  totalDrops: number;
  totalPasses: number;
  averageScore: number;
  recommendedNextDifficulty: Difficulty;
}

export interface JeevesDemo {
  title: string;
  chain: Array<{ drop: string; category: string; connection: string }>;
  conclusion: string;
  closingVerse: string;
}

export interface PolishedContent {
  title: string;
  content: string;
  keyVerses: string[];
  format: string;
}

export interface FreestyleGameState {
  phase: GamePhase;
  difficulty: Difficulty;
  dropFocus: DropFocus;
  freestyleMode: FreestyleMode;
  drops: Drop[];
  userResponses: string[];
  scores: EvaluationScores[];
  momentum: number;
  passCount: number;
  consecutivePasses: number;
  startTime: number;
  elapsedSeconds: number;
  players: string[];           // player names, empty = solo mode
  currentPlayerIndex: number;  // whose turn it is (index into players[])
  playerResponses: number[];   // maps each drop index → player index who responded
  // Verse Storm
  verseStormDrop: VerseStormDrop | null;
  stormTimeRemaining: number;
  // Mode-specific drops
  trinityDrop: TrinityDrop | null;
  constraintDrop: ConstraintDrop | null;
  oppositesDrop: OppositesDrop | null;
  targetDrop: TargetDrop | null;
  palaceRoomDrop: PalaceRoomDrop | null;
}

const INITIAL_STATE: FreestyleGameState = {
  phase: "setup",
  difficulty: "beginner",
  dropFocus: "random",
  freestyleMode: "whole",
  drops: [],
  userResponses: [],
  scores: [],
  momentum: 50,
  passCount: 0,
  consecutivePasses: 0,
  startTime: 0,
  elapsedSeconds: 0,
  players: [],
  currentPlayerIndex: 0,
  playerResponses: [],
  verseStormDrop: null,
  stormTimeRemaining: 0,
  trinityDrop: null,
  constraintDrop: null,
  oppositesDrop: null,
  targetDrop: null,
  palaceRoomDrop: null,
};

const SESSION_DURATION = 60 * 60; // 60 minutes in seconds
const MOMENTUM_DECAY_ON_PASS = 15;
const MOMENTUM_CONSECUTIVE_PASS_PENALTY = 5;

const STORM_DURATION: Record<Difficulty, number> = {
  beginner: 300,
  intermediate: 240,
  advanced: 180,
  master: 120,
};

// ── Cross-session drop history (localStorage) ──────────────────────────
const DROP_HISTORY_KEY = "freestyle_drop_history";
const DROP_HISTORY_MAX = 500; // remember last 500 drops across all sessions
const DROP_HISTORY_EXPIRY_DAYS = 30;

function getDropHistory(): string[] {
  try {
    const raw = localStorage.getItem(DROP_HISTORY_KEY);
    if (!raw) return [];
    const { drops, timestamp } = JSON.parse(raw);
    // Expire after 7 days
    if (Date.now() - timestamp > DROP_HISTORY_EXPIRY_DAYS * 86400000) {
      localStorage.removeItem(DROP_HISTORY_KEY);
      return [];
    }
    return drops || [];
  } catch {
    return [];
  }
}

function addToDropHistory(dropText: string) {
  try {
    const existing = getDropHistory();
    const updated = [...existing, dropText].slice(-DROP_HISTORY_MAX);
    localStorage.setItem(DROP_HISTORY_KEY, JSON.stringify({ drops: updated, timestamp: Date.now() }));
  } catch { /* localStorage full or unavailable */ }
}

// Fallback drops used when Jeeves is unreachable — cycled through, never repeated back-to-back
const FALLBACK_DROPS: Drop[] = [
  { category: "scripture", drop: "The empty tomb on resurrection morning" },
  { category: "nature", drop: "A seed that must die before it can grow" },
  { category: "everyday", drop: "A mirror that only shows what stands before it" },
  { category: "history", drop: "The walls of Jericho falling without a sword" },
  { category: "human_experience", drop: "A child learning to walk by falling" },
  { category: "symbolic", drop: "The lamb led silently to slaughter" },
  { category: "scripture", drop: "Moses striking the rock at Horeb" },
  { category: "nature", drop: "Lightning illuminating an entire landscape in an instant" },
  { category: "everyday", drop: "Bread rising in the oven" },
  { category: "symbolic", drop: "A door that opens from one side only" },
];

// Category display info
export const CATEGORY_CONFIG: Record<DropCategory, { label: string; color: string; emoji: string }> = {
  scripture: { label: "Scripture", color: "bg-blue-500", emoji: "📖" },
  nature: { label: "Nature", color: "bg-green-500", emoji: "🌿" },
  everyday: { label: "Everyday", color: "bg-yellow-500", emoji: "☀️" },
  history: { label: "History", color: "bg-amber-700", emoji: "🏛️" },
  human_experience: { label: "Human Experience", color: "bg-purple-500", emoji: "💭" },
  symbolic: { label: "Symbolic", color: "bg-red-500", emoji: "🔮" },
  action: { label: "Action", color: "bg-cyan-500", emoji: "⚡" },
  tension_pair: { label: "Tension", color: "bg-red-600", emoji: "⚔️" },
  abstract: { label: "Abstract", color: "bg-violet-500", emoji: "🧠" },
};

export const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; description: string; color: string }> = {
  beginner: {
    label: "Beginner",
    description: "Familiar drops with clear Christ connections. Scripture, nature, and everyday life.",
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  },
  intermediate: {
    label: "Intermediate",
    description: "Broader categories, more nuanced prompts. Expects specific Scripture references.",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  },
  advanced: {
    label: "Advanced",
    description: "Obscure and surprising drops. Expects typological depth and chain awareness.",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  },
  master: {
    label: "Master",
    description: "Abstract, paradoxical, culturally complex. Only for seasoned Phototheologists.",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  },
};

// ── Hook ───────────────────────────────────────────────────────────────

export function useFreestyleZone() {
  const { user } = useAuth();

  // Game session persistence
  const {
    gameState,
    setGameState,
    saveSession,
    startNewGame,
    completeGame,
    session,
    hasExistingSession,
    resumeGame,
    abandonSession,
    isLoading: sessionLoading,
  } = useGameSession<FreestyleGameState>({
    gameType: "freestyle_zone",
    initialState: INITIAL_STATE,
    autoSaveInterval: 15000,
  });

  // Transient UI state (not persisted)
  const [isGeneratingDrop, setIsGeneratingDrop] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isGeneratingDemo, setIsGeneratingDemo] = useState(false);
  const [isPolishing, setIsPolishing] = useState(false);
  const [isAskingJeeves, setIsAskingJeeves] = useState(false);
  const [jeevesAssist, setJeevesAssist] = useState<string | null>(null);
  const [currentFeedback, setCurrentFeedback] = useState<EvaluationScores | null>(null);
  const [sessionSummary, setSessionSummary] = useState<SessionSummary | null>(null);
  const [jeevesDemo, setJeevesDemo] = useState<JeevesDemo | null>(null);
  const [polishedContent, setPolishedContent] = useState<PolishedContent | null>(null);
  const [prefetchedDrop, setPrefetchedDrop] = useState<Drop | null>(null);

  // Refs
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stormTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const savedSessionIdRef = useRef<string | null>(null);
  const gameStateRef = useRef<FreestyleGameState>(gameState);
  const pendingStormAutoSubmitRef = useRef(false);

  // Keep ref in sync with state to avoid stale closures
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // Timer effect
  useEffect(() => {
    if (gameState.phase !== "active") {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setGameState(prev => {
        const elapsed = Math.floor((Date.now() - prev.startTime) / 1000);
        if (elapsed >= SESSION_DURATION) {
          // Auto-end session
          if (timerRef.current) clearInterval(timerRef.current);
          return { ...prev, phase: "complete", elapsedSeconds: SESSION_DURATION };
        }
        return { ...prev, elapsedSeconds: elapsed };
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState.phase, gameState.startTime, setGameState]);

  // Auto-complete when timer expires
  useEffect(() => {
    if (gameState.phase === "active" && gameState.elapsedSeconds >= SESSION_DURATION) {
      endSession();
    }
  }, [gameState.elapsedSeconds]);

  // Storm countdown timer
  useEffect(() => {
    if (gameState.phase !== "active" || gameState.freestyleMode !== "verse_storm" || !gameState.verseStormDrop) {
      if (stormTimerRef.current) clearInterval(stormTimerRef.current);
      return;
    }

    stormTimerRef.current = setInterval(() => {
      setGameState(prev => {
        if (prev.stormTimeRemaining <= 1) {
          if (stormTimerRef.current) clearInterval(stormTimerRef.current);
          pendingStormAutoSubmitRef.current = true;
          return { ...prev, stormTimeRemaining: 0 };
        }
        return { ...prev, stormTimeRemaining: prev.stormTimeRemaining - 1 };
      });
    }, 1000);

    return () => {
      if (stormTimerRef.current) clearInterval(stormTimerRef.current);
    };
  }, [gameState.phase, gameState.freestyleMode, gameState.verseStormDrop, setGameState]);

  // ── Helpers ────────────────────────────────────────────────────────

  const buildChainHistory = useCallback((): ChainEntry[] => {
    return gameState.drops.map((drop, i) => ({
      drop,
      response: gameState.userResponses[i] ?? null,
      scores: gameState.scores[i] ?? null,
      timestamp: 0,
    }));
  }, [gameState.drops, gameState.userResponses, gameState.scores]);

  const updateMomentum = useCallback((newScore: number, wasPassed: boolean) => {
    setGameState(prev => {
      let momentum = prev.momentum;

      if (wasPassed) {
        momentum -= MOMENTUM_DECAY_ON_PASS + (prev.consecutivePasses * MOMENTUM_CONSECUTIVE_PASS_PENALTY);
      } else {
        // Weighted moving average: 70% old momentum, 30% new score (mapped to 0-100)
        const scorePercent = (newScore / 40) * 100;
        momentum = momentum * 0.7 + scorePercent * 0.3;
      }

      return { ...prev, momentum: Math.max(0, Math.min(100, momentum)) };
    });
  }, [setGameState]);

  // ── Actions ────────────────────────────────────────────────────────

  const startSession = useCallback(async (difficulty: Difficulty, dropFocus: DropFocus = "random", players: string[] = [], freestyleMode: FreestyleMode = "whole") => {
    await startNewGame();
    const startTime = Date.now();
    setGameState({
      ...INITIAL_STATE,
      phase: "active",
      difficulty,
      dropFocus,
      freestyleMode,
      startTime,
      momentum: 50,
      players,
      currentPlayerIndex: 0,
      playerResponses: [],
    });
    setCurrentFeedback(null);
    setSessionSummary(null);
    setJeevesDemo(null);
    setPolishedContent(null);
    setPrefetchedDrop(null);

    // Generate first drop — verse storm uses its own generator
    if (freestyleMode === "verse_storm") {
      await generateVerseStorm(difficulty);
    } else {
      await generateNextDrop(difficulty, [], 0, freestyleMode);
    }
  }, [startNewGame, setGameState]);

  const generateNextDrop = useCallback(async (
    difficulty?: Difficulty,
    previousDrops?: Drop[],
    dropCount?: number,
    mode?: FreestyleMode,
  ) => {
    const diff = difficulty || gameState.difficulty;
    const prevDrops = previousDrops || gameState.drops;
    const count = dropCount ?? gameState.drops.length;
    const currentMode = mode || gameState.freestyleMode;

    // Verse storm uses its own generator
    if (currentMode === "verse_storm") {
      await generateVerseStorm(diff);
      return;
    }

    // Mode-specific drop generators
    if (["trinity_drop", "constraint", "opposites", "target", "palace_room"].includes(currentMode)) {
      await generateModeDrop(currentMode, diff, prevDrops, count);
      return;
    }

    const lastDropText = prevDrops[prevDrops.length - 1]?.drop;

    // Use prefetched drop if available AND not a duplicate of the last drop
    if (prefetchedDrop && !difficulty && prefetchedDrop.drop !== lastDropText) {
      const drop = prefetchedDrop;
      setPrefetchedDrop(null);
      setGameState(prev => ({
        ...prev,
        drops: [...prev.drops, drop],
      }));
      prefetchNextDrop(diff, [...prevDrops, drop], count + 1);
      return;
    }

    // Clear stale/duplicate prefetch
    if (prefetchedDrop) setPrefetchedDrop(null);

    setIsGeneratingDrop(true);
    try {
      const crossSessionHistory = getDropHistory();
      const focus = gameState.dropFocus || "random";
      const { data } = await callJeeves({
        mode: "freestyle_generate_drop",
        difficulty: diff,
        previousDrops: prevDrops.slice(-5).map(d => d.drop),
        recentDropHistory: crossSessionHistory.slice(-100),
        dropCount: count,
        dropFocus: focus !== "random" ? focus : undefined,
      }, "freestyle-zone");

      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      if (!parsed.drop) throw new Error("Empty drop from Jeeves");

      const drop: Drop = {
        category: parsed.category || "scripture",
        drop: parsed.drop,
        hint: parsed.hint,
      };

      // Guard against Jeeves returning the same drop
      if (drop.drop === lastDropText) throw new Error("Duplicate drop");

      addToDropHistory(drop.drop);

      setGameState(prev => ({
        ...prev,
        drops: [...prev.drops, drop],
      }));

      prefetchNextDrop(diff, [...prevDrops, drop], count + 1);
    } catch (error) {
      console.error("Failed to generate drop:", error);
      // Pick a fallback that wasn't used recently
      const usedTexts = new Set(prevDrops.slice(-5).map(d => d.drop));
      const fallback = FALLBACK_DROPS.find(f => !usedTexts.has(f.drop)) || FALLBACK_DROPS[0];
      setGameState(prev => ({
        ...prev,
        drops: [...prev.drops, fallback],
      }));
    } finally {
      setIsGeneratingDrop(false);
    }
  }, [gameState.difficulty, gameState.drops, gameState.dropFocus, gameState.freestyleMode, prefetchedDrop, setGameState]);

  const prefetchNextDrop = useCallback(async (
    difficulty: Difficulty,
    previousDrops: Drop[],
    dropCount: number
  ) => {
    try {
      const crossSessionHistory = getDropHistory();
      const focus = gameState.dropFocus || "random";
      const { data } = await callJeeves({
        mode: "freestyle_generate_drop",
        difficulty,
        previousDrops: previousDrops.slice(-5).map(d => d.drop),
        recentDropHistory: crossSessionHistory.slice(-100),
        dropCount,
        dropFocus: focus !== "random" ? focus : undefined,
      }, "freestyle-zone");

      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      if (parsed.drop) {
        setPrefetchedDrop({
          category: parsed.category || "scripture",
          drop: parsed.drop,
          hint: parsed.hint,
        });
      }
    } catch {
      // Silently fail on prefetch — generateNextDrop will use fallback pool
    }
  }, [gameState.dropFocus]);

  // ── Verse Storm Generator ────────────────────────────────────────────

  const generateVerseStorm = useCallback(async (difficulty?: Difficulty) => {
    const diff = difficulty || gameState.difficulty;
    setIsGeneratingDrop(true);
    try {
      const { data } = await callJeeves({
        mode: "freestyle_generate_verse_storm",
        difficulty: diff,
        previousDrops: gameState.drops.slice(-5).map(d => d.drop),
      }, "freestyle-zone");

      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      if (!parsed.verse || !parsed.objects?.length) throw new Error("Invalid storm data");

      const stormDrop: VerseStormDrop = {
        verse: parsed.verse,
        verseText: parsed.verseText || "",
        objects: parsed.objects.slice(0, 15),
      };

      // Also create a regular Drop entry for chain tracking
      const drop: Drop = {
        category: "scripture",
        drop: `[Storm] ${stormDrop.verse}: ${stormDrop.objects.length} objects`,
      };

      setGameState(prev => ({
        ...prev,
        drops: [...prev.drops, drop],
        verseStormDrop: stormDrop,
        stormTimeRemaining: STORM_DURATION[diff],
      }));
    } catch (error) {
      console.error("Failed to generate verse storm:", error);
      // Fallback storm
      const fallbackStorm: VerseStormDrop = {
        verse: "Romans 8:28",
        verseText: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
        objects: ["a broken clock", "a seed in dry ground", "a detour sign", "a surgeon's scalpel", "a refiner's fire", "a winding river", "a closed door", "a farmer's plow", "a diamond under pressure", "a shepherd's staff"],
      };
      const drop: Drop = {
        category: "scripture",
        drop: `[Storm] ${fallbackStorm.verse}: ${fallbackStorm.objects.length} objects`,
      };
      setGameState(prev => ({
        ...prev,
        drops: [...prev.drops, drop],
        verseStormDrop: fallbackStorm,
        stormTimeRemaining: STORM_DURATION[gameState.difficulty],
      }));
    } finally {
      setIsGeneratingDrop(false);
    }
  }, [gameState.difficulty, gameState.drops, setGameState]);

  const submitStormResponse = useCallback(async (response: string) => {
    if (gameState.phase !== "active") return;
    if (stormTimerRef.current) clearInterval(stormTimerRef.current);

    setIsEvaluating(true);
    setCurrentFeedback(null);

    try {
      const { data, error } = await callJeeves({
        mode: "freestyle_evaluate_verse_storm",
        verseStormDrop: gameState.verseStormDrop,
        userResponse: response,
        difficulty: gameState.difficulty,
        timeUsed: STORM_DURATION[gameState.difficulty] - gameState.stormTimeRemaining,
      }, "freestyle-zone");

      if (error || !data) throw new Error(error?.message || "No response");

      const parsed = typeof data === "string" ? JSON.parse(data) : data;

      const scores: EvaluationScores = {
        christConnection: parsed.christConnection ?? 5,
        depth: parsed.depth ?? 5,
        creativity: parsed.creativity ?? 5,
        chainLink: parsed.objectsConnected ?? 0,
        totalScore: parsed.totalScore ?? 20,
        feedback: parsed.feedback || "Storm complete!",
        suggestion: parsed.suggestion,
      };

      // Store objectsConnected in the scores for display
      (scores as any).objectsConnected = parsed.objectsConnected ?? 0;
      (scores as any).totalObjects = gameState.verseStormDrop?.objects.length ?? 0;

      setCurrentFeedback(scores);
      updateMomentum(scores.totalScore, false);

      setGameState(prev => ({
        ...prev,
        userResponses: [...prev.userResponses, response],
        scores: [...prev.scores, scores],
        consecutivePasses: 0,
        playerResponses: [...prev.playerResponses, prev.currentPlayerIndex],
      }));

      await saveSession({
        userResponses: [...gameState.userResponses, response],
        scores: [...gameState.scores, scores],
      });
    } catch (error) {
      console.error("Failed to evaluate storm:", error);
      const fallbackScores: EvaluationScores = {
        christConnection: 5, depth: 5, creativity: 5, chainLink: 5,
        totalScore: 20,
        feedback: "Storm evaluated — keep going!",
      };
      setCurrentFeedback(fallbackScores);
      setGameState(prev => ({
        ...prev,
        userResponses: [...prev.userResponses, response],
        scores: [...prev.scores, fallbackScores],
        consecutivePasses: 0,
        playerResponses: [...prev.playerResponses, prev.currentPlayerIndex],
      }));
    } finally {
      setIsEvaluating(false);
    }
  }, [gameState, updateMomentum, setGameState, saveSession]);

  // ── Mode-Specific Drop Generator ──────────────────────────────────

  const generateModeDrop = useCallback(async (
    mode: FreestyleMode,
    difficulty: Difficulty,
    previousDrops: Drop[],
    dropCount: number,
  ) => {
    setIsGeneratingDrop(true);
    const focusMap: Record<string, string> = {
      trinity_drop: "trinity",
      constraint: "constraint",
      opposites: "opposites",
      target: "target",
      palace_room: "palace_room",
    };

    try {
      const { data } = await callJeeves({
        mode: "freestyle_generate_drop",
        difficulty,
        previousDrops: previousDrops.slice(-5).map(d => d.drop),
        recentDropHistory: getDropHistory().slice(-100),
        dropCount,
        dropFocus: focusMap[mode],
      }, "freestyle-zone");

      const parsed = typeof data === "string" ? JSON.parse(data) : data;

      // Create a regular drop for chain tracking
      const dropText = parsed.drop || parsed.object || parsed.verse || "Unknown drop";
      const drop: Drop = {
        category: parsed.category || "scripture",
        drop: dropText,
        hint: parsed.hint,
      };

      addToDropHistory(drop.drop);

      // Build mode-specific data
      const stateUpdate: Partial<FreestyleGameState> = {
        drops: [...previousDrops, drop],
        trinityDrop: null,
        constraintDrop: null,
        oppositesDrop: null,
        targetDrop: null,
        palaceRoomDrop: null,
      };

      if (mode === "trinity_drop") {
        stateUpdate.trinityDrop = {
          object: parsed.object || parsed.drop || dropText,
          concept: parsed.concept || "Redemption",
          action: parsed.action || "Surrender",
          hint: parsed.hint,
          verse: parsed.verse,
          verseText: parsed.verseText,
        };
      } else if (mode === "constraint") {
        stateUpdate.constraintDrop = {
          verse: parsed.verse || "John 1:1",
          verseText: parsed.verseText || "",
          constraint: parsed.constraint || "Use only one-syllable words",
          drop: parsed.drop || dropText,
        };
      } else if (mode === "opposites") {
        stateUpdate.oppositesDrop = {
          verse: parsed.verse || "John 1:1",
          verseText: parsed.verseText || "",
          pair: parsed.pair || [parsed.drop || "Light", "Darkness"],
        };
      } else if (mode === "target") {
        stateUpdate.targetDrop = {
          verse: parsed.verse || "John 1:1",
          verseText: parsed.verseText || "",
          targetPerson: parsed.targetPerson || "A skeptical friend",
          targetDescription: parsed.targetDescription || "Someone questioning God's goodness",
        };
      } else if (mode === "palace_room") {
        stateUpdate.palaceRoomDrop = {
          verse: parsed.verse || "John 1:1",
          verseText: parsed.verseText || "",
          roomName: parsed.roomName || "The Throne Room",
          roomCode: parsed.roomCode || "THRONE",
        };
      }

      setGameState(prev => ({ ...prev, ...stateUpdate }));
    } catch (error) {
      console.error("Failed to generate mode drop:", error);
      const usedTexts = new Set(previousDrops.slice(-5).map(d => d.drop));
      const fallback = FALLBACK_DROPS.find(f => !usedTexts.has(f.drop)) || FALLBACK_DROPS[0];
      setGameState(prev => ({
        ...prev,
        drops: [...prev.drops, fallback],
        trinityDrop: null, constraintDrop: null, oppositesDrop: null, targetDrop: null, palaceRoomDrop: null,
      }));
    } finally {
      setIsGeneratingDrop(false);
    }
  }, [setGameState]);

  const submitResponse = useCallback(async (response: string) => {
    if (!response.trim() || gameState.phase !== "active") return;

    const currentDrop = gameState.drops[gameState.drops.length - 1];
    if (!currentDrop) return;

    setIsEvaluating(true);
    setCurrentFeedback(null);

    try {
      const chainHistory = buildChainHistory().slice(-10);

      const { data, error } = await callJeeves({
        mode: "freestyle_evaluate",
        drop: currentDrop,
        userResponse: response,
        chainHistory: gameState.freestyleMode === "whole" ? chainHistory : [],
        difficulty: gameState.difficulty,
        freestyleMode: gameState.freestyleMode,
      }, "freestyle-zone");

      if (error || !data) {
        console.error("Jeeves evaluation error:", error);
        throw new Error(error?.message || "No response from evaluator");
      }

      const parsed = typeof data === "string" ? JSON.parse(data) : data;

      if (!parsed || typeof parsed !== "object") {
        throw new Error("Invalid evaluation response format");
      }

      const scores: EvaluationScores = {
        christConnection: parsed.christConnection ?? 5,
        depth: parsed.depth ?? 5,
        creativity: parsed.creativity ?? 5,
        chainLink: parsed.chainLink ?? 5,
        totalScore: parsed.totalScore ?? 20,
        feedback: parsed.feedback || "Keep going!",
        suggestion: parsed.suggestion,
      };

      setCurrentFeedback(scores);
      updateMomentum(scores.totalScore, false);

      setGameState(prev => ({
        ...prev,
        userResponses: [...prev.userResponses, response],
        scores: [...prev.scores, scores],
        consecutivePasses: 0,
        playerResponses: [...prev.playerResponses, prev.currentPlayerIndex],
      }));

      // Background fact-check — fire and forget, updates feedback when done
      callJeeves({
        mode: "freestyle_fact_check",
        drop: currentDrop,
        userResponse: response,
      }, "freestyle-zone").then(({ data: fcData }) => {
        if (fcData) {
          const fcParsed = typeof fcData === "string" ? JSON.parse(fcData) : fcData;
          if (fcParsed && typeof fcParsed === "object") {
            const factCheck: FactCheckResult = {
              verified: fcParsed.verified ?? true,
              issues: fcParsed.issues || [],
              note: fcParsed.note || "Verified.",
            };
            setCurrentFeedback(prev => prev ? { ...prev, factCheck } : prev);
            // Also update the scores array in game state
            setGameState(prev => {
              const updatedScores = [...prev.scores];
              if (updatedScores.length > 0) {
                updatedScores[updatedScores.length - 1] = {
                  ...updatedScores[updatedScores.length - 1],
                  factCheck,
                };
              }
              return { ...prev, scores: updatedScores };
            });
          }
        }
      }).catch(err => console.error("Fact-check failed (non-blocking):", err));

      // Save to session
      await saveSession({
        userResponses: [...gameState.userResponses, response],
        scores: [...gameState.scores, scores],
      });
    } catch (error) {
      console.error("Failed to evaluate response:", error);

      // Provide fallback feedback so the user isn't stuck
      const fallbackScores: EvaluationScores = {
        christConnection: 5,
        depth: 5,
        creativity: 5,
        chainLink: 5,
        totalScore: 20,
        feedback: "Jeeves couldn't evaluate this one — your response was recorded. Keep going!",
        suggestion: "Try the next drop while Jeeves warms back up.",
      };

      setCurrentFeedback(fallbackScores);
      updateMomentum(fallbackScores.totalScore, false);

      setGameState(prev => ({
        ...prev,
        userResponses: [...prev.userResponses, response],
        scores: [...prev.scores, fallbackScores],
        consecutivePasses: 0,
        playerResponses: [...prev.playerResponses, prev.currentPlayerIndex],
      }));
    } finally {
      setIsEvaluating(false);
    }
  }, [gameState, buildChainHistory, updateMomentum, setGameState, saveSession]);

  const rotatePlayer = useCallback(() => {
    if (gameState.players.length > 0) {
      setGameState(prev => ({
        ...prev,
        currentPlayerIndex: (prev.currentPlayerIndex + 1) % prev.players.length,
      }));
    }
  }, [gameState.players.length, setGameState]);

  const passDrop = useCallback(async () => {
    if (gameState.phase !== "active") return;

    updateMomentum(0, true);

    setGameState(prev => ({
      ...prev,
      userResponses: [...prev.userResponses, ""],
      passCount: prev.passCount + 1,
      consecutivePasses: prev.consecutivePasses + 1,
      playerResponses: [...prev.playerResponses, prev.currentPlayerIndex],
    }));

    setCurrentFeedback(null);
    rotatePlayer();
    await generateNextDrop();
  }, [gameState.phase, updateMomentum, setGameState, generateNextDrop, rotatePlayer]);

  const advanceToNextDrop = useCallback(async () => {
    setCurrentFeedback(null);
    setJeevesAssist(null);
    rotatePlayer();
    if (gameState.freestyleMode === "verse_storm") {
      await generateVerseStorm();
    } else {
      await generateNextDrop();
    }
  }, [generateNextDrop, generateVerseStorm, gameState.freestyleMode, rotatePlayer]);

  const askJeevesForHelp = useCallback(async () => {
    if (gameState.phase !== "active") return;

    const currentDrop = gameState.drops[gameState.drops.length - 1];
    if (!currentDrop) return;

    setIsAskingJeeves(true);
    setJeevesAssist(null);

    try {
      const chainHistory = buildChainHistory().slice(-10);

      const { data, error } = await callJeeves({
        mode: "freestyle_jeeves_assist",
        drop: currentDrop,
        chainHistory: gameState.freestyleMode === "whole" ? chainHistory : [],
        difficulty: gameState.difficulty,
        freestyleMode: gameState.freestyleMode,
      }, "freestyle-zone");

      if (error || !data) {
        throw new Error("Jeeves couldn't assist right now");
      }

      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      const connection = parsed.connection || parsed.response || "Jeeves is thinking...";
      const keyInsight = parsed.keyInsight ? `\n\n💡 ${parsed.keyInsight}` : "";
      setJeevesAssist(connection + keyInsight);

      // Record Jeeves' assist as the response for this drop (so it appears in chain history)
      setGameState(prev => ({
        ...prev,
        userResponses: [...prev.userResponses, `[Jeeves freestyled] ${connection}`],
        scores: [...prev.scores, {
          christConnection: 0, depth: 0, creativity: 0, chainLink: 0,
          totalScore: 0, feedback: "Jeeves handled this one.",
        }],
        playerResponses: [...prev.playerResponses, prev.currentPlayerIndex],
      }));

      // Auto-advance to next drop after a delay so the player can read Jeeves' response
      setTimeout(() => {
        setJeevesAssist(null);
        setCurrentFeedback(null);
        rotatePlayer();
        generateNextDrop();
      }, 5000);
    } catch (err) {
      console.error("Jeeves assist error:", err);
      setJeevesAssist("Jeeves couldn't connect to this one right now. Try your best or pass!");
    } finally {
      setIsAskingJeeves(false);
    }
  }, [gameState, buildChainHistory, generateNextDrop, setGameState, rotatePlayer]);

  const endSession = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current);

    setGameState(prev => ({
      ...prev,
      phase: "complete",
      elapsedSeconds: Math.floor((Date.now() - prev.startTime) / 1000),
    }));

    // Read from ref to avoid stale closure
    const gs = gameStateRef.current;

    // Calculate final score
    const totalScore = gs.scores.reduce((sum, s) => sum + s.totalScore, 0);
    const avgScore = gs.scores.length > 0 ? totalScore / gs.scores.length : 0;
    const finalScore = Math.round(avgScore * 2.5); // Scale to 0-100

    await completeGame(finalScore);

    // Save to game_scores table with full session data for later viewing
    if (user) {
      try {
        const { data: inserted } = await supabase.from("game_scores").insert({
          user_id: user.id,
          game_type: "freestyle_zone",
          score: finalScore,
          metadata: {
            difficulty: gs.difficulty,
            dropFocus: gs.dropFocus || "random",
            freestyleMode: gs.freestyleMode,
            totalDrops: gs.drops.length,
            passCount: gs.passCount,
            duration: Math.floor((Date.now() - gs.startTime) / 1000),
            momentum: gs.momentum,
            drops: gs.drops,
            responses: gs.userResponses,
            scores: gs.scores,
            ...(gs.players.length > 0 ? {
              players: gs.players,
              playerResponses: gs.playerResponses,
            } : {}),
          } as any,
        }).select("id").single();
        if (inserted) savedSessionIdRef.current = inserted.id;
      } catch {
        // Non-critical
      }
    }
  }, [completeGame, setGameState, user]);

  const generateSessionSummary = useCallback(async () => {
    setIsGeneratingSummary(true);
    const gs = gameStateRef.current;
    try {
      const { data } = await callJeeves({
        mode: "freestyle_session_summary",
        sessionData: {
          drops: gs.drops,
          responses: gs.userResponses,
          scores: gs.scores,
          difficulty: gs.difficulty,
          passCount: gs.passCount,
          duration: gs.elapsedSeconds,
        },
      }, "freestyle-zone");

      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      setSessionSummary(parsed as SessionSummary);
    } catch (error) {
      console.error("Failed to generate summary:", error);
    } finally {
      setIsGeneratingSummary(false);
    }
  }, []);

  const generateJeevesDemo = useCallback(async () => {
    setIsGeneratingDemo(true);
    const gs = gameStateRef.current;
    try {
      const { data } = await callJeeves({
        mode: "freestyle_jeeves_demo",
        drops: gs.drops,
        responses: gs.userResponses,
        difficulty: gs.difficulty,
      }, "freestyle-zone");

      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      setJeevesDemo(parsed as JeevesDemo);
    } catch (error) {
      console.error("Failed to generate Jeeves demo:", error);
    } finally {
      setIsGeneratingDemo(false);
    }
  }, []);

  const polishSession = useCallback(async (format: string) => {
    setIsPolishing(true);
    setPolishedContent(null);
    const gs = gameStateRef.current;
    try {
      const { data } = await callJeeves({
        mode: "freestyle_polish",
        sessionData: {
          drops: gs.drops,
          responses: gs.userResponses,
        },
        format,
      }, "freestyle-zone");

      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      setPolishedContent(parsed as PolishedContent);

      // Save polished content to the game_scores row
      if (savedSessionIdRef.current && user) {
        try {
          const { data: existing } = await supabase
            .from("game_scores")
            .select("metadata")
            .eq("id", savedSessionIdRef.current)
            .single();
          if (existing) {
            const meta = (existing.metadata as Record<string, unknown>) || {};
            await supabase
              .from("game_scores")
              .update({
                metadata: { ...meta, polishedContent: parsed } as any,
              })
              .eq("id", savedSessionIdRef.current);
          }
        } catch {
          // Non-critical
        }
      }
    } catch (error) {
      console.error("Failed to polish session:", error);
    } finally {
      setIsPolishing(false);
    }
  }, [user]);

  // Computed values
  const timeRemaining = SESSION_DURATION - gameState.elapsedSeconds;
  const currentDropIndex = gameState.drops.length - 1;
  const currentDrop = gameState.drops[currentDropIndex] || null;
  const answeredCount = gameState.userResponses.filter(r => r !== "").length;

  return {
    // State
    gameState,
    currentDrop,
    currentDropIndex,
    currentFeedback,
    sessionSummary,
    jeevesDemo,
    polishedContent,
    timeRemaining,
    answeredCount,
    pendingStormAutoSubmitRef,

    // Loading states
    isGeneratingDrop,
    isEvaluating,
    isAskingJeeves,
    isGeneratingSummary,
    isGeneratingDemo,
    isPolishing,
    sessionLoading,

    // Session management
    hasExistingSession,
    resumeGame,

    // Jeeves assist
    jeevesAssist,

    // Actions
    startSession,
    submitResponse,
    submitStormResponse,
    passDrop,
    advanceToNextDrop,
    askJeevesForHelp,
    endSession,
    abandonSession,
    generateSessionSummary,
    generateJeevesDemo,
    polishSession,
  };
}
