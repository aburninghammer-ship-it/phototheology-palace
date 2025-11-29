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
  
  // For UI
  isLoading: boolean;
  isPremium: boolean;
  showUpgradePrompt: (feature: string) => boolean;
}

// Free tier gets floors 1-2 (6 rooms each = 12 rooms)
const FREE_TIER_FLOORS = [1, 2];

// Rooms available in free tier (Floor 1 + Floor 2)
const FREE_TIER_ROOMS = [
  // Floor 1 - Furnishing (Memory & Visualization)
  "story-room", "imagination-room", "24fps", "bible-rendered", "translation-room", "gems-room",
  // Floor 2 - Investigation
  "observation-room", "def-com", "symbols-types", "questions-room", "qa-internship"
];

export function useFreeTier(): FreeTierAccess {
  const { user } = useAuth();
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ["user-subscription", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("subscription_status, subscription_tier, trial_ends_at, is_student")
        .eq("id", user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Determine user's tier
  const getTier = (): FreeTierAccess["tier"] => {
    if (!user || !profile) return "free";
    
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
    
    // Free tier features (always available)
    canAccessFloor,
    canAccessRoom,
    canUseJeeves: true, // Basic Jeeves is free
    canAccessDevotionals: true, // Devotionals are free
    canAccessDailyChallenge: true,
    canAccessCommunity: true,
    canAccessBibleReader: true,
    
    // Premium-only features
    canAccessAllFloors: isPremium,
    canAccessAdvancedAI: isPremium,
    canAccessPremiumGames: isPremium,
    canAccessSermonBuilder: isPremium,
    canAccessResearchMode: isPremium,
    
    showUpgradePrompt,
  };
}
