import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface GameSession<T = Record<string, unknown>> {
  id: string;
  gameType: string;
  gameState: T;
  score: number;
  currentStep: number;
  totalSteps: number;
  isCompleted: boolean;
  startedAt: string;
  updatedAt: string;
}

interface UseGameSessionOptions<T> {
  gameType: string;
  initialState: T;
  totalSteps?: number;
  autoSaveInterval?: number; // in milliseconds, 0 to disable
}

interface UseGameSessionReturn<T> {
  session: GameSession<T> | null;
  gameState: T;
  isLoading: boolean;
  hasExistingSession: boolean;
  saveSession: (state: Partial<T>, score?: number, currentStep?: number) => Promise<void>;
  loadSession: () => Promise<void>;
  startNewGame: () => Promise<void>;
  resumeGame: () => void;
  completeGame: (finalScore: number) => Promise<void>;
  abandonSession: () => Promise<void>;
  setGameState: React.Dispatch<React.SetStateAction<T>>;
}

export function useGameSession<T extends object>({
  gameType,
  initialState,
  totalSteps = 0,
  autoSaveInterval = 30000, // Auto-save every 30 seconds by default
}: UseGameSessionOptions<T>): UseGameSessionReturn<T> {
  const { user } = useAuth();
  const [session, setSession] = useState<GameSession<T> | null>(null);
  const [gameState, setGameState] = useState<T>(initialState);
  const [isLoading, setIsLoading] = useState(true);
  const [hasExistingSession, setHasExistingSession] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    if (user) {
      checkExistingSession();
    } else {
      setIsLoading(false);
    }
  }, [user, gameType]);

  // Auto-save interval
  useEffect(() => {
    if (!session || !autoSaveInterval || session.isCompleted) return;

    const interval = setInterval(() => {
      saveSession(gameState);
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [session, gameState, autoSaveInterval]);

  const checkExistingSession = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("game_sessions")
        .select("*")
        .eq("user_id", user.id)
        .eq("game_type", gameType)
        .eq("is_completed", false)
        .eq("is_abandoned", false)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setHasExistingSession(true);
        setSession({
          id: data.id,
          gameType: data.game_type,
          gameState: data.game_state as T,
          score: data.score || 0,
          currentStep: data.current_step || 0,
          totalSteps: data.total_steps || 0,
          isCompleted: data.is_completed || false,
          startedAt: data.started_at,
          updatedAt: data.updated_at,
        });
      }
    } catch (error) {
      console.error("Error checking existing session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSession = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    await checkExistingSession();
  }, [user, gameType]);

  const startNewGame = useCallback(async () => {
    if (!user) {
      setGameState(initialState);
      setSession(null);
      setHasExistingSession(false);
      return;
    }

    try {
      // Abandon any existing session
      if (session && !session.isCompleted) {
        await supabase
          .from("game_sessions")
          .update({ is_abandoned: true })
          .eq("id", session.id);
      }

      // Create new session
      const { data, error } = await supabase
        .from("game_sessions")
        .insert([{
          user_id: user.id,
          game_type: gameType,
          game_state: JSON.parse(JSON.stringify(initialState)),
          total_steps: totalSteps,
          score: 0,
          current_step: 0,
        }])
        .select()
        .single();

      if (error) throw error;

      setSession({
        id: data.id,
        gameType: data.game_type,
        gameState: initialState,
        score: 0,
        currentStep: 0,
        totalSteps: totalSteps,
        isCompleted: false,
        startedAt: data.started_at,
        updatedAt: data.updated_at,
      });
      setGameState(initialState);
      setHasExistingSession(false);
    } catch (error) {
      console.error("Error starting new game:", error);
      toast.error("Failed to start game session");
    }
  }, [user, gameType, initialState, totalSteps, session]);

  const resumeGame = useCallback(() => {
    if (session) {
      setGameState(session.gameState);
      setHasExistingSession(false);
    }
  }, [session]);

  const saveSession = useCallback(async (
    state: Partial<T>,
    score?: number,
    currentStep?: number
  ) => {
    if (!user || !session) return;

    const newState = { ...gameState, ...state };
    
    try {
      const updateData: Record<string, unknown> = {
        game_state: newState,
        updated_at: new Date().toISOString(),
      };
      
      if (score !== undefined) updateData.score = score;
      if (currentStep !== undefined) updateData.current_step = currentStep;

      await supabase
        .from("game_sessions")
        .update(updateData)
        .eq("id", session.id);

      setGameState(newState as T);
      setSession(prev => prev ? {
        ...prev,
        gameState: newState as T,
        score: score ?? prev.score,
        currentStep: currentStep ?? prev.currentStep,
        updatedAt: new Date().toISOString(),
      } : null);
    } catch (error) {
      console.error("Error saving session:", error);
    }
  }, [user, session, gameState]);

  const completeGame = useCallback(async (finalScore: number) => {
    if (!user || !session) return;

    try {
      await supabase
        .from("game_sessions")
        .update({
          is_completed: true,
          score: finalScore,
          completed_at: new Date().toISOString(),
        })
        .eq("id", session.id);

      setSession(prev => prev ? { ...prev, isCompleted: true, score: finalScore } : null);
    } catch (error) {
      console.error("Error completing game:", error);
    }
  }, [user, session]);

  const abandonSession = useCallback(async () => {
    if (!user || !session) return;

    try {
      await supabase
        .from("game_sessions")
        .update({ is_abandoned: true })
        .eq("id", session.id);

      setSession(null);
      setHasExistingSession(false);
      setGameState(initialState);
    } catch (error) {
      console.error("Error abandoning session:", error);
    }
  }, [user, session, initialState]);

  return {
    session,
    gameState,
    isLoading,
    hasExistingSession,
    saveSession,
    loadSession,
    startNewGame,
    resumeGame,
    completeGame,
    abandonSession,
    setGameState,
  };
}

// Hook to get all active game sessions for the user
export function useActiveGameSessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchActiveSessions();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchActiveSessions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("game_sessions")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_completed", false)
        .eq("is_abandoned", false)
        .order("updated_at", { ascending: false });

      if (error) throw error;

      setSessions(data?.map(d => ({
        id: d.id,
        gameType: d.game_type,
        gameState: d.game_state as Record<string, unknown>,
        score: d.score || 0,
        currentStep: d.current_step || 0,
        totalSteps: d.total_steps || 0,
        isCompleted: d.is_completed || false,
        startedAt: d.started_at,
        updatedAt: d.updated_at,
      })) || []);
    } catch (error) {
      console.error("Error fetching active sessions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { sessions, isLoading, refetch: fetchActiveSessions };
}
