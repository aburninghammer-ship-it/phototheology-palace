import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

// List of rooms with libraries (show "Newly Renovated" badge)
const RENOVATED_ROOMS = [
  // Floor 1 - Furnishing
  "sr",     // Story Room - has bibleStoryLibrary
  "24fps",  // 24FPS Room - has library
  "gr",     // Gems Room - has gemsLibrary

  // Floor 2 - Investigation
  "st",     // Symbols Room - has bibleSymbolLibrary
  "qa",     // Q&A Room - has questionAnswerLibrary

  // Floor 3 - Freestyle
  "hf",     // Historical Freestyle Room - has historicalFreestyleLibrary
  "nf",     // Nature Freestyle Room - has natureFreestyleLibrary

  // Floor 4 - Next Level
  "trm",    // Theme Room - has themesLibrary (6 walls/floor/ceiling)
  "p||",    // Parallels Room - has parallelsLibrary
  "ptn",    // Patterns Room - has patternsLibrary
  "cec",    // Christ Every Chapter - has christTypesLibrary

  // Floor 5 - Vision
  "bl",     // Blue Room (Sanctuary) - has sanctuaryLibrary
  "pr",     // Prophecy Room - has prophecyLibrary
  "fe",     // Feasts Room - has feastsLibrary

  // Floor 6 - Three Heavens
  "123h",   // Three Heavens Room - has threeHeavensLibrary
  "cycles", // Eight Cycles Room - has cyclesLibrary

  // Other
  "math",   // Mathematics Room - has mathematicsLibrary
];

// Renovation date - rooms updated after this date show the badge
const RENOVATION_DATE = new Date("2025-01-01");

export const useNewlyRenovatedRoom = (roomId: string) => {
  const { user } = useAuth();

  const { data: hasSeen, isLoading } = useQuery({
    queryKey: ["room-renovated-seen", roomId, user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      // Check if user has visited this room since renovation
      const { data, error } = await supabase
        .from("room_progress")
        .select("updated_at")
        .eq("user_id", user.id)
        .eq("room_id", roomId)
        .gte("updated_at", RENOVATION_DATE.toISOString())
        .maybeSingle();

      if (error) {
        console.error("Error checking room visit:", error);
        return false;
      }

      return !!data;
    },
    enabled: !!user && RENOVATED_ROOMS.includes(roomId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const isRenovated = RENOVATED_ROOMS.includes(roomId);
  const showBadge = isRenovated && !hasSeen && !isLoading;

  return {
    isRenovated,
    showBadge,
    isLoading,
  };
};

// Export the list for use elsewhere
export const RECENTLY_RENOVATED_ROOMS = RENOVATED_ROOMS;
