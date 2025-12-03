import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { addDays, differenceInDays } from "date-fns";

export type PathType = "visual" | "analytical" | "devotional" | "warrior";

export interface UserPath {
  id: string;
  user_id: string;
  path_type: PathType;
  started_at: string;
  current_year: number;
  current_quarter: number;
  current_month: number;
  path_switches_used: number;
  trial_ends_at: string | null;
  is_active: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PathCompletion {
  id: string;
  user_id: string;
  path_type: string;
  started_at: string;
  completed_at: string;
  master_level: number;
  certificate_url: string | null;
}

export const PATH_INFO = {
  visual: {
    name: "Visual Path",
    icon: "🎨",
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/30",
    description: "Learn through vivid imagery and mental pictures",
    teachingStyle: "Picture this...",
    approach: "Imagery-rich, spatial metaphors, mental walkthroughs",
    strengths: ["Story visualization", "Memory palaces", "Scene immersion"],
  },
  analytical: {
    name: "Analytical Path",
    icon: "🔬",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    description: "Master through logic, patterns, and structure",
    teachingStyle: "Notice the pattern...",
    approach: "Logic trees, cross-references, structured analysis",
    strengths: ["Pattern recognition", "Cross-referencing", "Systematic study"],
  },
  devotional: {
    name: "Devotional Path",
    icon: "🙏",
    color: "from-purple-500 to-violet-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    description: "Grow through prayer, meditation, and reflection",
    teachingStyle: "Let's sit with this...",
    approach: "Lectio Divina, journaling, heart questions",
    strengths: ["Deep reflection", "Prayer integration", "Personal application"],
  },
  warrior: {
    name: "Warrior Path",
    icon: "⚔️",
    color: "from-orange-500 to-amber-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    description: "Conquer through challenges, speed, and competition",
    teachingStyle: "Prove it...",
    approach: "Timed drills, battle scenarios, ranked challenges",
    strengths: ["Speed recall", "Competitive learning", "Challenge mastery"],
  },
} as const;

export const usePath = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch active path
  const { data: activePath, isLoading: isLoadingPath } = useQuery({
    queryKey: ["user-path"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("user_paths")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;
      return data as UserPath | null;
    },
  });

  // Fetch path completions
  const { data: completions, isLoading: isLoadingCompletions } = useQuery({
    queryKey: ["path-completions"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("path_completions")
        .select("*")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false });

      if (error) throw error;
      return data as PathCompletion[];
    },
  });

  // Select path mutation
  const selectPath = useMutation({
    mutationFn: async (pathType: PathType) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const trialEndsAt = addDays(new Date(), 30).toISOString();

      const { data, error } = await supabase
        .from("user_paths")
        .insert({
          user_id: user.id,
          path_type: pathType,
          trial_ends_at: trialEndsAt,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;

      // Update profile with selected path
      await supabase
        .from("profiles")
        .update({ selected_path: pathType })
        .eq("id", user.id);

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-path"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({
        title: `${PATH_INFO[data.path_type as PathType].icon} Path Selected!`,
        description: `You've chosen the ${PATH_INFO[data.path_type as PathType].name}. Your 30-day trial begins now.`,
      });
    },
    onError: (error) => {
      console.error("Error selecting path:", error);
      toast({
        title: "Error selecting path",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  // Switch path mutation (only during trial)
  const switchPath = useMutation({
    mutationFn: async (newPathType: PathType) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (!activePath) throw new Error("No active path to switch from");

      // Check if in trial period
      const daysSinceStart = differenceInDays(new Date(), new Date(activePath.started_at));
      if (daysSinceStart > 30) {
        throw new Error("Trial period has ended. You cannot switch paths.");
      }

      if (activePath.path_switches_used >= 1) {
        throw new Error("You have already used your path switch.");
      }

      // Deactivate old path
      await supabase
        .from("user_paths")
        .update({ is_active: false })
        .eq("id", activePath.id);

      // Create new path
      const trialEndsAt = addDays(new Date(), 30 - daysSinceStart).toISOString();

      const { data, error } = await supabase
        .from("user_paths")
        .insert({
          user_id: user.id,
          path_type: newPathType,
          trial_ends_at: trialEndsAt,
          path_switches_used: 1,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;

      // Update profile
      await supabase
        .from("profiles")
        .update({ selected_path: newPathType })
        .eq("id", user.id);

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-path"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({
        title: `${PATH_INFO[data.path_type as PathType].icon} Path Switched!`,
        description: `You've switched to the ${PATH_INFO[data.path_type as PathType].name}.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Cannot switch path",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Helper functions
  const canSwitchPath = () => {
    if (!activePath) return false;
    const daysSinceStart = differenceInDays(new Date(), new Date(activePath.started_at));
    return daysSinceStart <= 30 && activePath.path_switches_used === 0;
  };

  const getDaysUntilTrialEnds = () => {
    if (!activePath?.trial_ends_at) return null;
    const days = differenceInDays(new Date(activePath.trial_ends_at), new Date());
    return days > 0 ? days : 0;
  };

  const getMasterLevel = () => {
    return completions?.length || 0;
  };

  const getPathProgress = () => {
    if (!activePath) return { percentage: 0, monthsCompleted: 0, totalMonths: 24 };
    const monthsCompleted = (activePath.current_year - 1) * 12 + activePath.current_month - 1;
    return {
      percentage: (monthsCompleted / 24) * 100,
      monthsCompleted,
      totalMonths: 24,
    };
  };

  return {
    activePath,
    completions,
    isLoading: isLoadingPath || isLoadingCompletions,
    selectPath: selectPath.mutate,
    isSelectingPath: selectPath.isPending,
    switchPath: switchPath.mutate,
    isSwitchingPath: switchPath.isPending,
    canSwitchPath,
    getDaysUntilTrialEnds,
    getMasterLevel,
    getPathProgress,
    pathInfo: PATH_INFO,
  };
};
