import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const useAchievements = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [checking, setChecking] = useState(false);
  const [unlockedAchievement, setUnlockedAchievement] = useState<any>(null);

  const checkAndAwardAchievements = async () => {
    if (!user || checking) return;
    
    setChecking(true);
    try {
      // Get all achievements
      const { data: allAchievements } = await supabase
        .from("achievements")
        .select("*");

      if (!allAchievements) return;

      // Get user's current achievements
      const { data: userAchievements } = await supabase
        .from("user_achievements")
        .select("achievement_id")
        .eq("user_id", user.id);

      const unlockedIds = new Set(userAchievements?.map(a => a.achievement_id) || []);

      // Check each achievement
      for (const achievement of allAchievements) {
        if (unlockedIds.has(achievement.id)) continue;

        const shouldUnlock = await checkAchievementRequirement(
          achievement.requirement_type,
          achievement.requirement_count
        );

        if (shouldUnlock) {
          await unlockAchievement(achievement);
        }
      }
    } finally {
      setChecking(false);
    }
  };

  const checkAchievementRequirement = async (
    requirementType: string,
    requirementCount: number
  ): Promise<boolean> => {
    if (!user) return false;

    switch (requirementType) {
      case "rooms_completed": {
        const { count } = await supabase
          .from("room_progress")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .not("completed_at", "is", null);
        return (count || 0) >= requirementCount;
      }

      case "drills_completed": {
        const { count } = await supabase
          .from("drill_results")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);
        return (count || 0) >= requirementCount;
      }

      case "perfect_drills": {
        const { data: drills } = await supabase
          .from("drill_results")
          .select("score, max_score")
          .eq("user_id", user.id);
        
        const perfectCount = drills?.filter(d => d.score === d.max_score).length || 0;
        return perfectCount >= requirementCount;
      }

      case "study_streak": {
        const { data: profile } = await supabase
          .from("profiles")
          .select("daily_study_streak")
          .eq("id", user.id)
          .single();
        return (profile?.daily_study_streak || 0) >= requirementCount;
      }

      case "floors_completed": {
        const { data: rooms } = await supabase
          .from("room_progress")
          .select("floor_number")
          .eq("user_id", user.id)
          .not("completed_at", "is", null);
        
        const uniqueFloors = new Set(rooms?.map(r => r.floor_number) || []);
        return uniqueFloors.size >= requirementCount;
      }

      default:
        return false;
    }
  };

  const unlockAchievement = async (achievement: any) => {
    if (!user) return;

    const { error } = await supabase
      .from("user_achievements")
      .insert({
        user_id: user.id,
        achievement_id: achievement.id,
      });

    if (!error) {
      // Award points to user
      const { data: profile } = await supabase
        .from("profiles")
        .select("points")
        .eq("id", user.id)
        .single();

      await supabase
        .from("profiles")
        .update({ points: (profile?.points || 0) + (achievement.points || 0) })
        .eq("id", user.id);

      // Trigger animated notification
      setUnlockedAchievement(achievement);
    }
  };

  return {
    checkAndAwardAchievements,
    unlockAchievement,
    unlockedAchievement,
    clearUnlockedAchievement: () => setUnlockedAchievement(null),
  };
};
