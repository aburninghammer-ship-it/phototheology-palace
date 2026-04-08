import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface FreeTierAccess {
  // What tier the user is on
  tier: "free" | "trial" | "essential" | "premium" | "student" | "patron";
  
  // --- Free-tier features (zero cost, always available) ---
  canAccessFloor: (floorNumber: number) => boolean;
  canAccessRoom: (roomId: string) => boolean;
  canAccessDailyVerse: boolean;        // 1. Daily Verse
  canAccessStoryRoom: boolean;         // 2. Story Room browsing
  canAccessPalaceTour: boolean;        // 3. Palace Tour
  canAccess24FPS: boolean;             // 4. 24FPS chapter frames
  canAccessBookmarks: boolean;         // 5. Bookmarks & highlights
  canAccessCommunity: boolean;         // 6. Community feed (read-only)
  canAccessProfile: boolean;           // 7. Profile & onboarding
  canAccessWatches: boolean;           // 8. Morning/Night Watch (pre-recorded)
  canAccessBibleReader: boolean;       // 9. Bible reader (text only, no AI)
  canAccessAchievements: boolean;      // 10. Achievement badges
  canAccessImageBible: boolean;        // 11. Bible Rendered Room (Image Bible)
  
  // --- Metered free-tier features ---
  canUseJeeves: boolean;
  canAccessDevotionals: boolean;
  canAccessDailyChallenge: boolean;
  
  // --- Premium-only features (cost money / AI tokens) ---
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
        .from('profiles')
        .select('subscription_tier, subscription_status, has_lifetime_access, trial_ends_at, promotional_access_expires_at')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Check for church membership access (critical fix!)
  const { data: churchAccess, isLoading: churchLoading } = useQuery({
    queryKey: ["church-access", user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase.rpc('has_church_access', {
        _user_id: user.id
      }).single();

      if (error) return null;
      return data;
    },
    enabled: !!user,
  });

  // Also check for active Patreon connection - require $15/month minimum (1500 cents)
  const PATREON_MINIMUM_CENTS = 1500;
  const { data: patreonConnection } = useQuery({
    queryKey: ["patreon-connection", user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('patreon_connections')
        .select('is_active_patron, entitled_cents')
        .eq('user_id', user.id)
        .single();

      if (error) return null;
      return data;
    },
    enabled: !!user,
  });

  // Patreon grants access only if active AND meets minimum pledge
  const hasActivePatreon = patreonConnection?.is_active_patron && 
    (patreonConnection?.entitled_cents || 0) >= PATREON_MINIMUM_CENTS;

  // Check for Teachable student access
  const { data: teachableAccess } = useQuery({
    queryKey: ["teachable-access", user?.id],
    queryFn: async () => {
      if (!user) return false;

      const { data, error } = await supabase.rpc('has_teachable_access', {
        _user_id: user.id
      });

      if (error) return false;
      return data;
    },
    enabled: !!user,
  });

  // Check for Pickaxe premium access (paying Jeeves users)
  const { data: pickaxeAccess } = useQuery({
    queryKey: ["pickaxe-access", user?.id],
    queryFn: async () => {
      if (!user) return false;

      const { data, error } = await supabase
        .from('pickaxe_connections')
        .select('is_paid_user, user_id')
        .eq('user_id', user.id)
        .eq('is_paid_user', true)
        .maybeSingle();

      if (error) return false;
      return !!data;
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

  // Check if user has church access (grants premium)
  const hasChurchAccess = churchAccess?.has_access || false;

  // Check if user has Teachable student access
  const hasTeachableAccess = teachableAccess === true;

  // Check if user has Pickaxe premium access
  const hasPickaxeAccess = pickaxeAccess === true;

  // Determine user's tier
  const getTier = (): FreeTierAccess["tier"] => {
    if (!user) return "free";

    // Church membership grants premium access (even if profile row is missing)
    if (hasChurchAccess) return "premium";

    // Teachable students get premium access
    if (hasTeachableAccess) return "student";

    // Pickaxe paying users get premium access (Jeeves subscribers)
    if (hasPickaxeAccess) return "premium";

    // Patreon connection grants access independent of Stripe (if meets $15 min)
    if (hasActivePatreon) return "patron";

    // If we don't yet have profile data, default to free (UI should respect isLoading)
    if (!profile) return "free";

    if (profile.has_lifetime_access) return "premium";

    // CRITICAL: Check subscription_status === 'active' FIRST before checking tier values
    // This catches all paid subscribers regardless of how tier is stored
    if (profile.subscription_status === "active") {
      // Map stored tier to our tier type, default to premium if tier is missing
      const storedTier = profile.subscription_tier?.toLowerCase() as FreeTierAccess["tier"];
      if (storedTier === "patron") return "patron";
      if (storedTier === "student") return "student";
      if (storedTier === "essential") return "essential";
      // Default active subscribers to premium
      return "premium";
    }

    // Check if trial is active
    if (profile.trial_ends_at) {
      const trialEnd = new Date(profile.trial_ends_at);
      if (trialEnd > new Date()) return "trial";
    }

    // Check promotional access
    if (profile.promotional_access_expires_at) {
      const promoEnd = new Date(profile.promotional_access_expires_at);
      if (promoEnd > new Date()) return "premium";
    }

    // Fallback tier checks (for edge cases where status isn't 'active' but tier is set)
    if (profile.subscription_tier === "patron") return "patron";
    if (profile.subscription_tier === "student") return "student";
    if (profile.subscription_tier === "premium") return "premium";
    if (profile.subscription_tier === "essential") return "essential";

    return "free";
  };

  const tier = getTier();
  const isPremium = ["premium", "essential", "trial", "student", "patron"].includes(tier) || hasChurchAccess;
  const isLoading = profileLoading || churchLoading;
  
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
    if (isLoading) return false;
    return !isPremium;
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
    canAccessBibleReader: isPremium,
    
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