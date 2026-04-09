import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import { supabase } from "@/integrations/supabase/client";
import { MASTER_CLASSES } from "@/data/masterClassData";

/**
 * Determines which master classes a user can access based on subscription status.
 *
 * - Free / trial users: only classes 1 & 2
 * - Paid users: 1 class unlocked per day since subscription start
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
  maxAccessible: number;
  isAccessible: (classNumber: number) => boolean;
  isFreeOrTrial: boolean;
  creatorMode: boolean;
  loading: boolean;
}

export function useMasterClassAccess(): MasterClassAccessInfo {
  const { user } = useAuth();
  const { isOnTrial } = useTrialStatus();
  const creatorMode = isCreatorMode();
  const [profileData, setProfileData] = useState<{
    has_lifetime_access: boolean;
    subscription_status: string | null;
    subscription_tier: string | null;
    created_at: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("has_lifetime_access, subscription_status, subscription_tier, created_at")
        .eq("id", user.id)
        .single();
      setProfileData(data);
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  return useMemo(() => {
    if (creatorMode) {
      return {
        maxAccessible: MASTER_CLASSES.length,
        isAccessible: () => true,
        isFreeOrTrial: false,
        creatorMode: true,
        loading: false,
      };
    }

    if (loading || !user) {
      return {
        maxAccessible: 2,
        isAccessible: (n: number) => n <= 2,
        isFreeOrTrial: true,
        creatorMode: false,
        loading,
      };
    }

    const isPaid = !!(
      profileData?.has_lifetime_access ||
      (profileData?.subscription_status === "active" && profileData?.subscription_tier)
    );

    if (!isPaid || isOnTrial) {
      return {
        maxAccessible: 2,
        isAccessible: (n: number) => n <= 2,
        isFreeOrTrial: true,
        creatorMode: false,
        loading: false,
      };
    }

    // Paid user: drip 1 per day from profile creation (proxy for sub start)
    const subStart = profileData?.created_at
      ? new Date(profileData.created_at)
      : new Date();
    const now = new Date();
    const daysSinceStart = Math.floor(
      (now.getTime() - subStart.getTime()) / (1000 * 60 * 60 * 24)
    );
    const maxAccessible = Math.min(daysSinceStart + 1, MASTER_CLASSES.length);

    return {
      maxAccessible,
      isAccessible: (n: number) => n <= maxAccessible,
      isFreeOrTrial: false,
      creatorMode: false,
      loading: false,
    };
  }, [user, profileData, isOnTrial, creatorMode, loading]);
}
