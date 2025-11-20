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
        .single();

      if (error && error.code !== "PGRST116") throw error;
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

  const startPlan = async (planId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to start a reading plan",
        variant: "destructive",
      });
      return;
    }

    try {
      // Deactivate any existing active plans
      if (userProgress) {
        await supabase
          .from("user_reading_progress")
          .update({ is_active: false })
          .eq("user_id", user.id)
          .eq("is_active", true);
      }

      // Start the new plan
      const { data, error } = await supabase
        .from("user_reading_progress")
        .insert({
          user_id: user.id,
          plan_id: planId,
          current_day: 1,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      
      setUserProgress(data);
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
