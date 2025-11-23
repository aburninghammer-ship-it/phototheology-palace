import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

interface ReadingPlan {
  id: string;
  name: string;
  description: string | null;
  duration_days: number;
  plan_type: string;
  depth_mode: string;
  daily_schedule: any;
}

interface UserProgress {
  id: string;
  user_id: string;
  plan_id: string;
  current_day: number;
  last_completed_day: number;
  is_active: boolean;
  custom_settings: any;
  started_at: string;
  created_at: string;
  updated_at: string;
  preferred_translation?: string;
}

export const useReadingPlans = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [plans, setPlans] = useState<ReadingPlan[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
    if (user) {
      loadUserProgress();
    }
  }, [user]);

  const loadPlans = async () => {
    try {
      const { data, error } = await supabase
        .from("reading_plans")
        .select("*")
        .order("duration_days");

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error("Error loading reading plans:", error);
      toast({
        title: "Error",
        description: "Failed to load reading plans",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUserProgress = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("user_reading_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("started_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setUserProgress(data);
    } catch (error) {
      console.error("Error loading user progress:", error);
    }
  };

  const refetchProgress = async () => {
    await loadUserProgress();
  };

  const generateExercises = async (regenerate: boolean = false) => {
    if (!user || !userProgress) return null;

    try {
      const { data, error } = await supabase.functions.invoke('generate-reading-exercises', {
        body: {
          userProgressId: userProgress.id,
          dayNumber: userProgress.current_day,
          passages: [], // Will be computed in edge function based on plan
          depthMode: 'standard', // Will be fetched from plan in edge function
          regenerate
        }
      });

      if (error) throw error;
      return data?.exercises || null;
    } catch (error) {
      console.error('Error generating exercises:', error);
      toast({
        title: "Error",
        description: "Failed to generate exercises",
        variant: "destructive",
      });
      return null;
    }
  };

  const startPlan = async (planId: string, translation: string = "kjv") => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to start a reading plan",
        variant: "destructive",
      });
      return;
    }

    try {
      // First, deactivate any currently active plans for this user
      await supabase
        .from("user_reading_progress")
        .update({ is_active: false })
        .eq("user_id", user.id)
        .eq("is_active", true);

      // Check if there is already progress for this specific plan
      const { data: existing, error: existingError } = await supabase
        .from("user_reading_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("plan_id", planId)
        .maybeSingle();

      if (existingError && (existingError as any).code !== "PGRST116") throw existingError;

      let activeProgress: UserProgress | null = null;

      if (existing) {
        // Reactivate existing progress for this plan instead of inserting a duplicate
        const { data: updated, error: updateError } = await supabase
          .from("user_reading_progress")
          .update({
            is_active: true,
            current_day: existing.current_day || 1,
            preferred_translation: translation,
          })
          .eq("id", existing.id)
          .select()
          .single();

        if (updateError) throw updateError;
        activeProgress = updated as UserProgress;
      } else {
        // No prior record for this plan, create a fresh one
        const { data: inserted, error: insertError } = await supabase
          .from("user_reading_progress")
          .insert({
            user_id: user.id,
            plan_id: planId,
            current_day: 1,
            is_active: true,
            started_at: new Date().toISOString(),
            preferred_translation: translation,
          })
          .select()
          .single();

        if (insertError) throw insertError;
        activeProgress = inserted as UserProgress;
      }

      setUserProgress(activeProgress);
      toast({
        title: userProgress ? "Plan Switched!" : "Plan Started!",
        description: userProgress
          ? "Your new reading plan is now active"
          : "Your reading journey begins now",
      });
    } catch (error: any) {
      console.error("Error starting plan:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to start plan",
        variant: "destructive",
      });
    }
  };

  return {
    plans,
    userProgress,
    loading,
    startPlan,
    refetch: loadPlans,
    refetchProgress,
    generateExercises,
  };
};
