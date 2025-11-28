import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface DevotionalPlan {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  theme: string;
  format: "standard" | "24fps" | "blueprint" | "room-driven" | "verse-genetics";
  duration: number;
  study_style: string;
  is_public: boolean;
  share_token: string | null;
  status: "draft" | "generating" | "active" | "completed";
  current_day: number;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface DevotionalDay {
  id: string;
  plan_id: string;
  day_number: number;
  title: string;
  scripture_reference: string;
  scripture_text: string | null;
  room_assignment: string | null;
  floor_number: number | null;
  visual_imagery: string | null;
  memory_hook: string | null;
  cross_references: string[];
  application: string | null;
  prayer: string | null;
  challenge: string | null;
  journal_prompt: string | null;
  sanctuary_station: string | null;
  christ_connection: string;
}

export interface DevotionalProgress {
  id: string;
  user_id: string;
  plan_id: string;
  day_id: string;
  completed_at: string;
  journal_entry: string | null;
  reflection_notes: string | null;
  time_spent_minutes: number | null;
  rating: number | null;
}

export function useDevotionals() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's devotional plans
  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ["devotional-plans", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("devotional_plans")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as DevotionalPlan[];
    },
    enabled: !!user?.id,
  });

  // Create a new devotional plan
  const createPlan = useMutation({
    mutationFn: async (planData: {
      title: string;
      description?: string;
      theme: string;
      format: string;
      duration: number;
      studyStyle: string;
    }) => {
      const { data, error } = await supabase
        .from("devotional_plans")
        .insert({
          user_id: user?.id,
          title: planData.title,
          description: planData.description,
          theme: planData.theme,
          format: planData.format,
          duration: planData.duration,
          study_style: planData.studyStyle,
          status: "draft",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devotional-plans"] });
    },
    onError: (error) => {
      toast({
        title: "Error creating devotional",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Generate devotional content
  const generateDevotional = useMutation({
    mutationFn: async (params: {
      planId: string;
      theme: string;
      format: string;
      duration: number;
      studyStyle: string;
      profileName?: string;
      // CADE context
      primaryIssue?: string;
      issueDescription?: string;
      issueSeverity?: string;
    }) => {
      const { data, error } = await supabase.functions.invoke("generate-devotional", {
        body: params,
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devotional-plans"] });
      toast({
        title: "Devotional Generated!",
        description: "Your personalized devotional is ready.",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete a plan
  const deletePlan = useMutation({
    mutationFn: async (planId: string) => {
      const { error } = await supabase
        .from("devotional_plans")
        .delete()
        .eq("id", planId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devotional-plans"] });
      toast({
        title: "Devotional Deleted",
        description: "The devotional plan has been removed.",
      });
    },
  });

  return {
    plans,
    plansLoading,
    createPlan,
    generateDevotional,
    deletePlan,
    isGenerating: generateDevotional.isPending,
  };
}

export function useDevotionalPlan(planId: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch single plan with days
  const { data: plan, isLoading: planLoading } = useQuery({
    queryKey: ["devotional-plan", planId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("devotional_plans")
        .select("*")
        .eq("id", planId)
        .single();

      if (error) throw error;
      return data as DevotionalPlan;
    },
    enabled: !!planId,
  });

  // Fetch days for the plan
  const { data: days, isLoading: daysLoading } = useQuery({
    queryKey: ["devotional-days", planId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("devotional_days")
        .select("*")
        .eq("plan_id", planId)
        .order("day_number", { ascending: true });

      if (error) throw error;
      return data as DevotionalDay[];
    },
    enabled: !!planId,
  });

  // Fetch user progress
  const { data: progress } = useQuery({
    queryKey: ["devotional-progress", planId, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("devotional_progress")
        .select("*")
        .eq("plan_id", planId)
        .eq("user_id", user?.id);

      if (error) throw error;
      return data as DevotionalProgress[];
    },
    enabled: !!planId && !!user?.id,
  });

  // Mark a day as complete
  const completeDay = useMutation({
    mutationFn: async (params: {
      dayId: string;
      journalEntry?: string;
      reflectionNotes?: string;
      timeSpent?: number;
      rating?: number;
    }) => {
      const { data, error } = await supabase
        .from("devotional_progress")
        .insert({
          user_id: user?.id,
          plan_id: planId,
          day_id: params.dayId,
          journal_entry: params.journalEntry,
          reflection_notes: params.reflectionNotes,
          time_spent_minutes: params.timeSpent,
          rating: params.rating,
        })
        .select()
        .single();

      if (error) throw error;

      // Update current_day in plan
      const completedCount = (progress?.length || 0) + 1;
      await supabase
        .from("devotional_plans")
        .update({
          current_day: completedCount,
          ...(completedCount >= (plan?.duration || 0) ? { status: "completed", completed_at: new Date().toISOString() } : {}),
        })
        .eq("id", planId);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devotional-progress", planId] });
      queryClient.invalidateQueries({ queryKey: ["devotional-plan", planId] });
      toast({
        title: "Day Completed!",
        description: "Your progress has been saved.",
      });
    },
  });

  const completedDayIds = new Set(progress?.map((p) => p.day_id) || []);

  return {
    plan,
    days,
    progress,
    planLoading,
    daysLoading,
    completeDay,
    completedDayIds,
    isCompleting: completeDay.isPending,
  };
}
