import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { calculateXpReward } from "@/utils/masteryCalculations";

export interface RoomMastery {
  id: string;
  user_id: string;
  room_id: string;
  floor_number: number;
  mastery_level: number;
  xp_current: number;
  xp_required: number;
  total_drills_completed: number;
  total_exercises_completed: number;
  perfect_scores_count: number;
  last_activity_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface XpRewardResult {
  xp_awarded: number;
  new_xp: number;
  new_level: number;
  leveled_up: boolean;
  xp_required: number;
}

// Helper to record partnership mastery activity
async function recordPartnershipActivity(userId: string, xpEarned: number) {
  try {
    // Get active partnership
    const { data: partnership } = await supabase
      .from('study_partnerships')
      .select('id')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .eq('status', 'active')
      .maybeSingle();

    if (!partnership) return;

    const today = new Date().toISOString().split('T')[0];
    
    // Check if record exists
    const { data: existing } = await supabase
      .from('partnership_daily_activity')
      .select('id, xp_earned')
      .eq('partnership_id', partnership.id)
      .eq('user_id', userId)
      .eq('activity_date', today)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('partnership_daily_activity')
        .update({
          completed_mastery: true,
          xp_earned: (existing.xp_earned || 0) + xpEarned,
        })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('partnership_daily_activity')
        .insert({
          partnership_id: partnership.id,
          user_id: userId,
          activity_date: today,
          completed_mastery: true,
          xp_earned: xpEarned,
        });
    }
  } catch (error) {
    console.error('Failed to record partnership activity:', error);
  }
}

export const useMastery = (roomId: string, floorNumber: number) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch room mastery data
  const { data: mastery, isLoading } = useQuery({
    queryKey: ["room-mastery", roomId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("room_mastery_levels")
        .select("*")
        .eq("user_id", user.id)
        .eq("room_id", roomId)
        .maybeSingle();

      if (error) throw error;
      return data as RoomMastery | null;
    },
  });

  // Award XP mutation
  const awardXp = useMutation({
    mutationFn: async ({
      xpAmount,
      drillCompleted = false,
      exerciseCompleted = false,
      perfectScore = false,
    }: {
      xpAmount?: number;
      drillCompleted?: boolean;
      exerciseCompleted?: boolean;
      perfectScore?: boolean;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Calculate XP if not provided
      const finalXp = xpAmount || calculateXpReward({
        drillCompleted,
        exerciseCompleted,
        perfectScore,
      });

      const { data, error } = await supabase.rpc("award_room_xp", {
        p_user_id: user.id,
        p_room_id: roomId,
        p_floor_number: floorNumber,
        p_xp_amount: finalXp,
        p_drill_completed: drillCompleted,
        p_exercise_completed: exerciseCompleted,
        p_perfect_score: perfectScore,
      });

      if (error) throw error;
      return data as unknown as XpRewardResult;
    },
    onSuccess: async (result) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["room-mastery", roomId] });
      queryClient.invalidateQueries({ queryKey: ["global-master-title"] });
      queryClient.invalidateQueries({ queryKey: ["partnership-activity"] });

      // Record partnership activity
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await recordPartnershipActivity(user.id, result.xp_awarded);
      }

      // Show toast notification
      if (result.leveled_up) {
        toast({
          title: "🎉 Level Up!",
          description: `You've reached Mastery Level ${result.new_level} in this room!`,
          duration: 5000,
        });
      } else {
        toast({
          title: "XP Earned!",
          description: `+${result.xp_awarded} XP (${result.new_xp}/${result.xp_required})`,
          duration: 3000,
        });
      }
    },
    onError: (error) => {
      console.error("Failed to award XP:", error);
      toast({
        title: "Error",
        description: "Failed to award XP. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    mastery,
    isLoading,
    awardXp: awardXp.mutate,
    isAwarding: awardXp.isPending,
  };
};

// Hook for fetching global master title
export const useGlobalMasterTitle = () => {
  return useQuery({
    queryKey: ["global-master-title"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("global_master_titles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });
};

// Hook for fetching all room masteries
export const useAllRoomMasteries = () => {
  return useQuery({
    queryKey: ["all-room-masteries"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("room_mastery_levels")
        .select("*")
        .eq("user_id", user.id)
        .order("mastery_level", { ascending: false });

      if (error) throw error;
      return data as RoomMastery[];
    },
  });
};
