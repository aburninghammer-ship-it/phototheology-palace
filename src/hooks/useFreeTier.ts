import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface FreeTierAccess {
  // What tier the user is on
  tier: "free" | "trial" | "essential" | "premium" | "student";
  
  // Feature access
  canAccessFloor: (floorNumber: number) => boolean;
  canAccessRoom: (roomId: string) => boolean;
  canUseJeeves: boolean;
  canAccessDevotionals: boolean;
  canAccessDailyChallenge: boolean;
  canAccessCommunity: boolean;
  canAccessBibleReader: boolean;
  
  // Premium features
  canAccessAllFloors: boolean;
  canAccessAdvancedAI: boolean;
  canAccessPremiumGames: boolean;
  canAccessSermonBuilder: boolean;
  canAccessResearchMode: boolean;
  
  // Limits
  jeevesUsageToday: number;
  jeevesLimitReached: boolean;
  dailyChallengeSubmissionsThisWeek: number;
  challengeLimitReached: boolean;
  canPostInCommunity: boolean;
  
  // For UI
  isLoading: boolean;
  isPremium: boolean;
  showUpgradePrompt: (feature: string) => boolean;
}

// Free tier constants
const FREE_TIER_FLOORS = [1]; // Floor 1 only
const FREE_JEEVES_DAILY_LIMIT = 10;
const FREE_CHALLENGE_WEEKLY_LIMIT = 3;

// Rooms available in free tier (Floor 1 only - Furnishing)
const FREE_TIER_ROOMS = [
  "story-room", "imagination-room", "24fps", "bible-rendered", "translation-room", "gems-room"
];

export function useFreeTier(): FreeTierAccess {
  const { user } = useAuth();
  
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["user-subscription", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("subscription_status, subscription_tier, trial_ends_at, is_student, has_lifetime_access, promotional_access_expires_at")
        .eq("id", user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Count today's Jeeves usage
  const { data: jeevesUsage } = useQuery({
    queryKey: ["jeeves-daily-usage", user?.id],
    queryFn: async () => {
      if (!user) return 0;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count, error } = await supabase
        .from("deck_studies")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", today.toISOString());
      
      if (error) return 0;
      return count || 0;
    },
    enabled: !!user,
    refetchInterval: 60000, // Refresh every minute
  });

  // Count this week's challenge submissions
  const { data: challengeSubmissions } = useQuery({
    queryKey: ["challenge-weekly-usage", user?.id],
    queryFn: async () => {
      if (!user) return 0;
      
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const { count, error } = await supabase
        .from("challenge_submissions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", weekAgo.toISOString());
      
      if (error) return 0;
      return count || 0;
    },
    enabled: !!user,
  });

  // Determine user's tier
  const getTier = (): FreeTierAccess["tier"] => {
    if (!user || !profile) return "free";
    
    // Check lifetime access
    if (profile.has_lifetime_access) return "premium";
    
    // Check promotional access
    if (profile.promotional_access_expires_at && new Date(profile.promotional_access_expires_at) > new Date()) {
      return "premium";
    }
    
    if (profile.is_student) return "student";
    if (profile.subscription_status === "active") {
      return (profile.subscription_tier as FreeTierAccess["tier"]) || "premium";
    }
    if (profile.trial_ends_at && new Date(profile.trial_ends_at) > new Date()) {
      return "trial";
    }
    return "free";
  };

  const tier = getTier();
  const isPremium = ["premium", "essential", "trial", "student"].includes(tier);
  const isLoading = profileLoading;
  
  // Usage tracking
  const jeevesUsageToday = jeevesUsage || 0;
  const jeevesLimitReached = !isPremium && jeevesUsageToday >= FREE_JEEVES_DAILY_LIMIT;
  
  const dailyChallengeSubmissionsThisWeek = challengeSubmissions || 0;
  const challengeLimitReached = !isPremium && dailyChallengeSubmissionsThisWeek >= FREE_CHALLENGE_WEEKLY_LIMIT;
  
  // Feature access functions
  const canAccessFloor = (floorNumber: number): boolean => {
    if (isPremium) return true;
    return FREE_TIER_FLOORS.includes(floorNumber);
  };

  const canAccessRoom = (roomId: string): boolean => {
    if (isPremium) return true;
    return FREE_TIER_ROOMS.includes(roomId.toLowerCase());
  };

  const showUpgradePrompt = (feature: string): boolean => {
    return tier === "free";
  };

  return {
    tier,
    isLoading,
    isPremium,
    
    // Free tier features
    canAccessFloor,
    canAccessRoom,
    canUseJeeves: !jeevesLimitReached,
    canAccessDevotionals: true,
    canAccessDailyChallenge: !challengeLimitReached,
    canAccessCommunity: true,
    canAccessBibleReader: true,
    
    // Premium-only features
    canAccessAllFloors: isPremium,
    canAccessAdvancedAI: isPremium,
    canAccessPremiumGames: isPremium,
    canAccessSermonBuilder: isPremium,
    canAccessResearchMode: isPremium,
    
    // Limits
    jeevesUsageToday,
    jeevesLimitReached,
    dailyChallengeSubmissionsThisWeek,
    challengeLimitReached,
    canPostInCommunity: isPremium, // Free users can view only
    
    showUpgradePrompt,
  };
}

// Export constants for UI display
export const FREE_TIER_LIMITS = {
  floors: FREE_TIER_FLOORS,
  rooms: FREE_TIER_ROOMS,
  jeevesDaily: FREE_JEEVES_DAILY_LIMIT,
  challengesWeekly: FREE_CHALLENGE_WEEKLY_LIMIT,
};
