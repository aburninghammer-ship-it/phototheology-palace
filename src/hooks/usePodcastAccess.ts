import { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { useMasterClassAccess } from "@/hooks/useMasterClassAccess";
import { PODCAST_EPISODES } from "@/data/podcastData";

/**
 * Podcast access tiers:
 * - Episode 1: free for everyone (no login required)
 * - Episodes 2-3: available to trial users
 * - Episodes 4+: paid subscribers only
 * - Creator mode (?creator=true): all episodes
 */

export interface PodcastAccessInfo {
  isAccessible: (episodeNumber: number) => boolean;
  isFreeOrTrial: boolean;
  loading: boolean;
}

export function usePodcastAccess(): PodcastAccessInfo {
  const { user } = useAuth();
  const { isOnTrial } = useTrialStatus();
  const { creatorMode, isFreeOrTrial, loading } = useMasterClassAccess();

  return useMemo(() => {
    // Creator bypass
    if (creatorMode) {
      return {
        isAccessible: () => true,
        isFreeOrTrial: false,
        loading: false,
      };
    }

    if (loading) {
      return {
        isAccessible: (n: number) => n <= 1,
        isFreeOrTrial: true,
        loading: true,
      };
    }

    // Not logged in → episode 1 only
    if (!user) {
      return {
        isAccessible: (n: number) => n <= 1,
        isFreeOrTrial: true,
        loading: false,
      };
    }

    // Trial or free → episodes 1-3
    if (isFreeOrTrial || isOnTrial) {
      return {
        isAccessible: (n: number) => n <= 3,
        isFreeOrTrial: true,
        loading: false,
      };
    }

    // Paid → all episodes
    return {
      isAccessible: () => true,
      isFreeOrTrial: false,
      loading: false,
    };
  }, [user, isOnTrial, creatorMode, isFreeOrTrial, loading]);
}
