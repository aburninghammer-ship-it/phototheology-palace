import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";
import { getPathById } from "@/data/studyIdeasLibrary";

export interface PathProgress {
  id: string;
  user_id: string;
  path_id: string;
  current_card_index: number;
  completed_cards: string[];
  started_at: string;
  completed_at: string | null;
  is_active: boolean;
}

export const usePathProgress = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pathProgress, setPathProgress] = useState<PathProgress[]>([]);
  const [loading, setLoading] = useState(false);

  const loadProgress = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from("user_study_path_progress")
        .select("*")
        .eq("user_id", user.id)
        .order("started_at", { ascending: false });

      if (error) throw error;
      setPathProgress((data as PathProgress[]) || []);
    } catch (error) {
      console.error("Error loading path progress:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadProgress();
    }
  }, [user, loadProgress]);

  const startPath = async (pathId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to start a study path",
        variant: "destructive",
      });
      return null;
    }

    // Check if already started
    const existing = pathProgress.find((p) => p.path_id === pathId);
    if (existing) {
      // Reactivate if needed
      if (!existing.is_active) {
        await (supabase as any)
          .from("user_study_path_progress")
          .update({ is_active: true })
          .eq("id", existing.id);
        loadProgress();
      }
      return existing;
    }

    try {
      const { data, error } = await (supabase as any)
        .from("user_study_path_progress")
        .insert({
          user_id: user.id,
          path_id: pathId,
          current_card_index: 0,
          completed_cards: [],
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;

      const path = getPathById(pathId);
      toast({
        title: "Path started",
        description: `You've begun "${path?.title || pathId}"`,
      });

      loadProgress();
      return data as PathProgress;
    } catch (error: any) {
      console.error("Error starting path:", error);
      const errorMsg = error?.message || error?.details || "Failed to start study path";
      toast({
        title: "Error",
        description: errorMsg.includes("does not exist")
          ? "Study paths feature needs database setup. Please contact support."
          : errorMsg,
        variant: "destructive",
      });
      return null;
    }
  };

  const completeCard = async (pathId: string, cardId: string) => {
    const progress = pathProgress.find((p) => p.path_id === pathId);
    if (!progress) return false;

    const path = getPathById(pathId);
    if (!path) return false;

    const newCompletedCards = [...progress.completed_cards];
    if (!newCompletedCards.includes(cardId)) {
      newCompletedCards.push(cardId);
    }

    // Calculate next card index
    const currentIndex = path.cardSequence.indexOf(cardId);
    const nextIndex = Math.min(currentIndex + 1, path.cardSequence.length - 1);

    // Check if path is complete
    const isPathComplete = newCompletedCards.length === path.cardSequence.length;

    try {
      const { error } = await (supabase as any)
        .from("user_study_path_progress")
        .update({
          completed_cards: newCompletedCards,
          current_card_index: nextIndex,
          completed_at: isPathComplete ? new Date().toISOString() : null,
        })
        .eq("id", progress.id);

      if (error) throw error;

      if (isPathComplete) {
        toast({
          title: "Path completed!",
          description: `Congratulations! You've finished "${path.title}"`,
        });
      } else {
        toast({
          title: "Card completed",
          description: `${newCompletedCards.length}/${path.cardSequence.length} cards done`,
        });
      }

      loadProgress();
      return true;
    } catch (error) {
      console.error("Error completing card:", error);
      return false;
    }
  };

  const setCurrentCard = async (pathId: string, cardIndex: number) => {
    const progress = pathProgress.find((p) => p.path_id === pathId);
    if (!progress) return false;

    try {
      const { error } = await (supabase as any)
        .from("user_study_path_progress")
        .update({ current_card_index: cardIndex })
        .eq("id", progress.id);

      if (error) throw error;
      loadProgress();
      return true;
    } catch (error) {
      console.error("Error updating current card:", error);
      return false;
    }
  };

  const pausePath = async (pathId: string) => {
    const progress = pathProgress.find((p) => p.path_id === pathId);
    if (!progress) return false;

    try {
      const { error } = await (supabase as any)
        .from("user_study_path_progress")
        .update({ is_active: false })
        .eq("id", progress.id);

      if (error) throw error;

      toast({
        title: "Path paused",
        description: "You can resume anytime",
      });

      loadProgress();
      return true;
    } catch (error) {
      console.error("Error pausing path:", error);
      return false;
    }
  };

  const resetPath = async (pathId: string) => {
    const progress = pathProgress.find((p) => p.path_id === pathId);
    if (!progress) return false;

    try {
      const { error } = await (supabase as any)
        .from("user_study_path_progress")
        .update({
          current_card_index: 0,
          completed_cards: [],
          completed_at: null,
          is_active: true,
        })
        .eq("id", progress.id);

      if (error) throw error;

      toast({
        title: "Path reset",
        description: "Starting fresh!",
      });

      loadProgress();
      return true;
    } catch (error) {
      console.error("Error resetting path:", error);
      return false;
    }
  };

  const getProgressForPath = (pathId: string): PathProgress | undefined => {
    return pathProgress.find((p) => p.path_id === pathId);
  };

  const getActivePaths = (): PathProgress[] => {
    return pathProgress.filter((p) => p.is_active && !p.completed_at);
  };

  const getCompletedPaths = (): PathProgress[] => {
    return pathProgress.filter((p) => p.completed_at !== null);
  };

  const isCardCompleted = (pathId: string, cardId: string): boolean => {
    const progress = getProgressForPath(pathId);
    return progress?.completed_cards.includes(cardId) ?? false;
  };

  const getProgressPercentage = (pathId: string): number => {
    const progress = getProgressForPath(pathId);
    const path = getPathById(pathId);
    if (!progress || !path) return 0;
    return Math.round((progress.completed_cards.length / path.cardSequence.length) * 100);
  };

  return {
    pathProgress,
    loading,
    startPath,
    completeCard,
    setCurrentCard,
    pausePath,
    resetPath,
    getProgressForPath,
    getActivePaths,
    getCompletedPaths,
    isCardCompleted,
    getProgressPercentage,
    refresh: loadProgress,
  };
};
