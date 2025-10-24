import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface RoomProgress {
  id: string;
  user_id: string;
  floor_number: number;
  room_id: string;
  completed_at: string | null;
  exercises_completed: any;
  drill_attempts: number;
  best_drill_score: number;
  notes: string | null;
}

export const useRoomProgress = (floorNumber: number, roomId: string) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<RoomProgress | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProgress = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("room_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("floor_number", floorNumber)
        .eq("room_id", roomId)
        .maybeSingle();

      if (error) throw error;
      setProgress(data);
    } catch (error) {
      console.error("Error fetching room progress:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [user, floorNumber, roomId]);

  const markExerciseComplete = async (exerciseType: string) => {
    if (!user) {
      toast.error("Please sign in to track progress");
      return;
    }

    try {
      const completedExercises = Array.isArray(progress?.exercises_completed) 
        ? progress.exercises_completed 
        : [];
      if (completedExercises.includes(exerciseType)) {
        toast.info("Exercise already completed");
        return;
      }

      const updatedExercises = [...completedExercises, exerciseType];

      if (progress) {
        const { data, error } = await supabase
          .from("room_progress")
          .update({ exercises_completed: updatedExercises })
          .eq("id", progress.id)
          .select()
          .single();

        if (error) throw error;
        setProgress(data);
      } else {
        const { data, error } = await supabase
          .from("room_progress")
          .insert({
            user_id: user.id,
            floor_number: floorNumber,
            room_id: roomId,
            exercises_completed: updatedExercises,
          })
          .select()
          .single();

        if (error) throw error;
        setProgress(data);
      }

      toast.success("Exercise completed!");
    } catch (error) {
      console.error("Error marking exercise complete:", error);
      toast.error("Failed to save progress");
    }
  };

  const recordDrillAttempt = async (score: number) => {
    if (!user) {
      toast.error("Please sign in to track progress");
      return;
    }

    try {
      const currentAttempts = progress?.drill_attempts || 0;
      const currentBest = progress?.best_drill_score || 0;

      if (progress) {
        const { data, error } = await supabase
          .from("room_progress")
          .update({
            drill_attempts: currentAttempts + 1,
            best_drill_score: Math.max(currentBest, score),
          })
          .eq("id", progress.id)
          .select()
          .single();

        if (error) throw error;
        setProgress(data);
      } else {
        const { data, error } = await supabase
          .from("room_progress")
          .insert({
            user_id: user.id,
            floor_number: floorNumber,
            room_id: roomId,
            drill_attempts: 1,
            best_drill_score: score,
          })
          .select()
          .single();

        if (error) throw error;
        setProgress(data);
      }

      if (score > currentBest) {
        toast.success("New best score!");
      }
    } catch (error) {
      console.error("Error recording drill attempt:", error);
      toast.error("Failed to save score");
    }
  };

  const markRoomComplete = async () => {
    if (!user) {
      toast.error("Please sign in to track progress");
      return;
    }

    try {
      if (progress) {
        const { data, error } = await supabase
          .from("room_progress")
          .update({ completed_at: new Date().toISOString() })
          .eq("id", progress.id)
          .select()
          .single();

        if (error) throw error;
        setProgress(data);
      } else {
        const { data, error } = await supabase
          .from("room_progress")
          .insert({
            user_id: user.id,
            floor_number: floorNumber,
            room_id: roomId,
            completed_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;
        setProgress(data);
      }

      toast.success("Room completed! 🎉");
    } catch (error) {
      console.error("Error marking room complete:", error);
      toast.error("Failed to mark room as complete");
    }
  };

  return {
    progress,
    loading,
    markExerciseComplete,
    recordDrillAttempt,
    markRoomComplete,
    refetch: fetchProgress,
  };
};
