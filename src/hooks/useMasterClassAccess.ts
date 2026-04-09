import { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { MASTER_CLASSES } from "@/data/masterClassData";
import type { MasterClassDef } from "@/data/masterClassData";

/**
 * Determines which master classes a user can access based on subscription status.
 *
 * - Free / trial users: only classes 1 & 2
 * - Paid users: 1 class unlocked per day since their paid subscription started
 *   (class N is unlocked N days after subscription start, class 1 on day 0)
 * - Creator mode (?creator=true): all classes
 */

const CREATOR_KEY = "master-class-creator";

function isCreatorMode(): boolean {
  try {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("creator") === "true") {
        localStorage.setItem(CREATOR_KEY, "true");
        return true;
      }
      return localStorage.getItem(CREATOR_KEY) === "true";
    }
  } catch {}
  return false;
}

export interface MasterClassAccessInfo {
  /** Number of classes the user can access */
  maxAccessible: number;
  /** Whether a specific class is accessible (by classNumber, 1-indexed) */
  isAccessible: (classNumber: number) => boolean;
  /** Whether the user is on free/trial (limited to 2) */
  isFreeOrTrial: boolean;
  /** Whether creator override is active */
  creatorMode: boolean;
}

export function useMasterClassAccess(): MasterClassAccessInfo {
  const { user, profile } = useAuth();
  const { isOnTrial, isExpired } = useTrialStatus();
  const creatorMode = isCreatorMode();

  const result = useMemo(() => {
    if (creatorMode) {
      return {
        maxAccessible: MASTER_CLASSES.length,
        isAccessible: () => true,
        isFreeOrTrial: false,
        creatorMode: true,
      };
    }

    // Determine if user is a paid subscriber
    const isPaid = !!(
      profile?.has_lifetime_access ||
      (profile?.subscription_status === "active" && profile?.subscription_tier)
    );

    if (!user || !isPaid || isOnTrial) {
      // Free or trial: only first 2
      return {
        maxAccessible: 2,
        isAccessible: (classNumber: number) => classNumber <= 2,
        isFreeOrTrial: true,
        creatorMode: false,
      };
    }

    // Paid user: drip 1 per day from subscription start
    // Use profile created_at as proxy for subscription start if no better field
    const subStart = profile?.subscription_start_date
      ? new Date(profile.subscription_start_date)
      : profile?.created_at
      ? new Date(profile.created_at)
      : new Date();

    const now = new Date();
    const daysSinceStart = Math.floor(
      (now.getTime() - subStart.getTime()) / (1000 * 60 * 60 * 24)
    );
    // Day 0 = class 1, day 1 = class 2, etc.
    const maxAccessible = Math.min(daysSinceStart + 1, MASTER_CLASSES.length);

    return {
      maxAccessible,
      isAccessible: (classNumber: number) => classNumber <= maxAccessible,
      isFreeOrTrial: false,
      creatorMode: false,
    };
  }, [user, profile, isOnTrial, creatorMode]);

  return result;
}
