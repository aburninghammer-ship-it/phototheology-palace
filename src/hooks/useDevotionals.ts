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
  status: "draft" | "generating" | "active" | "completed" | "failed";
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
  devotional_text: string | null; // New essay-style content
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
      
      // Auto-mark stuck "generating" plans as failed (if stuck for more than 10 minutes)
      const now = new Date();
      const stuckPlans = (data as DevotionalPlan[])?.filter(p => {
        if (p.status !== "generating") return false;
        const updatedAt = new Date(p.created_at);
        const diffMinutes = (now.getTime() - updatedAt.getTime()) / (1000 * 60);
        return diffMinutes > 10; // Consider stuck after 10 minutes
      });
      
      // Mark stuck plans as failed silently
      if (stuckPlans && stuckPlans.length > 0) {
        for (const plan of stuckPlans) {
          await supabase
            .from("devotional_plans")
            .update({ status: "failed" })
            .eq("id", plan.id);
        }
        // Return updated data
        const { data: refreshedData } = await supabase
          .from("devotional_plans")
          .select("*")
          .eq("user_id", user?.id)
          .order("created_at", { ascending: false });
        return refreshedData as DevotionalPlan[];
      }
      
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
      try {
        const { data, error } = await supabase.functions.invoke("generate-devotional", {
          body: params,
        });

        if (error) {
          // Check for specific error types
          if (error.message?.includes("FunctionsFetchError") || error.message?.includes("Failed to send") || error.message?.includes("network")) {
            throw new Error("Day 1 generation timed out. The system will automatically retry. Please check back in a few minutes.");
          }
          throw error;
        }
        if (data?.error) throw new Error(data.error);
        return data;
      } catch (err: any) {
        // Handle timeout/network errors more gracefully
        if (err.name === "FunctionsFetchError" || err.message?.includes("Failed to send") || err.message?.includes("network")) {
          throw new Error("Day 1 generation timed out. The system will automatically retry. Please check back in a few minutes.");
        }
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devotional-plans"] });
      toast({
        title: "Day 1 Generated!",
        description: "Your devotional has started. Subsequent days will unlock daily.",
      });
    },
    onError: (error) => {
      // For timeouts, show an encouraging message since the system will auto-retry
      const isTimeout = error.message?.includes("timed out") || error.message?.includes("retry") || error.message?.includes("network");
      toast({
        title: isTimeout ? "Taking Longer Than Expected" : "Generation Issue",
        description: isTimeout 
          ? "Your devotional is being prepared. Please wait a moment and try again."
          : error.message,
        variant: "default",
      });
    },
  });

  // Update a plan's title/theme
  const updatePlan = useMutation({
    mutationFn: async (params: { planId: string; title: string; theme: string }) => {
      const { error } = await supabase
        .from("devotional_plans")
        .update({ title: params.title, theme: params.theme })
        .eq("id", params.planId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devotional-plans"] });
      toast({
        title: "Devotional Updated",
        description: "Title and theme have been saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating devotional",
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

  // Extend an existing devotional plan
  const extendPlan = useMutation({
    mutationFn: async (params: {
      planId: string;
      additionalDays: number;
      theme: string;
      format: string;
      studyStyle: string;
      existingDuration: number;
    }) => {
      const startFromDay = params.existingDuration + 1;

      const { data, error } = await supabase.functions.invoke("generate-devotional", {
        body: {
          planId: params.planId,
          theme: params.theme,
          format: params.format,
          duration: params.additionalDays,
          studyStyle: params.studyStyle,
          isExtension: true,
          startFromDay,
          existingDuration: params.existingDuration,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["devotional-plans"] });
      queryClient.invalidateQueries({ queryKey: ["devotional-plan", variables.planId] });
      queryClient.invalidateQueries({ queryKey: ["devotional-days", variables.planId] });
      toast({
        title: "Devotional Extended!",
        description: `Added ${variables.additionalDays} more days to your journey.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Extension In Progress",
        description: error.message || "Your devotional is being extended. Please wait...",
        variant: "default",
      });
    },
  });

  return {
    plans,
    plansLoading,
    createPlan,
    updatePlan,
    generateDevotional,
    extendPlan,
    deletePlan,
    isGenerating: generateDevotional.isPending,
    isExtending: extendPlan.isPending,
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

  // Mark a day as complete (upsert to handle re-completion)
  const completeDay = useMutation({
    mutationFn: async (params: {
      dayId: string;
      journalEntry?: string;
      reflectionNotes?: string;
      timeSpent?: number;
      rating?: number;
    }) => {
      // Use upsert to handle the unique constraint on (user_id, day_id)
      const { data, error } = await supabase
        .from("devotional_progress")
        .upsert({
          user_id: user?.id,
          plan_id: planId,
          day_id: params.dayId,
          journal_entry: params.journalEntry,
          reflection_notes: params.reflectionNotes,
          time_spent_minutes: params.timeSpent,
          rating: params.rating,
          completed_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,day_id',
        })
        .select()
        .single();

      if (error) throw error;

      // Recalculate completed count from actual progress
      const { count, error: countError } = await supabase
        .from("devotional_progress")
        .select("*", { count: "exact", head: true })
        .eq("plan_id", planId)
        .eq("user_id", user?.id);

      if (countError) throw countError;

      const completedCount = count || 0;
      const { error: updateError } = await supabase
        .from("devotional_plans")
        .update({
          current_day: completedCount,
          ...(completedCount >= (plan?.duration || 0) ? { status: "completed", completed_at: new Date().toISOString() } : {}),
        })
        .eq("id", planId);

      if (updateError) throw updateError;

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
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save progress. Please try again.",
        variant: "destructive",
      });
    },
  });

  const completedDayIds = new Set(progress?.map((p) => p.day_id) || []);

  // Calculate which day number is currently unlocked based on started_at
  // Day 1 unlocks on start date, Day 2 on the NEXT calendar day, etc.
  const getUnlockedDayNumber = (): number => {
    if (!plan?.started_at) return 1;
    
    // Get started date (just the date part, no time)
    const startedAt = new Date(plan.started_at);
    const startDate = new Date(startedAt.getFullYear(), startedAt.getMonth(), startedAt.getDate());
    
    // Get today's date (just the date part, no time)
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Calculate calendar days since start (0 on start day, 1 on next day, etc.)
    const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Day number = days since start + 1 (Day 1 on start date, Day 2 on next calendar day)
    return Math.min(Math.max(daysSinceStart + 1, 1), plan.duration);
  };

  const unlockedDayNumber = getUnlockedDayNumber();

  // Helper to check if a specific day is unlocked
  const isDayUnlocked = (dayNumber: number): boolean => {
    return dayNumber <= unlockedDayNumber;
  };

  return {
    plan,
    days,
    progress,
    planLoading,
    daysLoading,
    completeDay,
    completedDayIds,
    isCompleting: completeDay.isPending,
    unlockedDayNumber,
    isDayUnlocked,
  };
}
