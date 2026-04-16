import { useState, useCallback } from "react";
import { useFreeTier, FREE_TIER_LIMITS } from "./useFreeTier";

// Track which features have been dismissed this session
const sessionDismissals = new Set<string>();

interface UseUpgradeGateOptions {
  feature: string;
  limitType?: "jeeves" | "challenge" | "floor" | "room" | "feature";
  floorNumber?: number;
  roomId?: string;
}

interface UpgradeGateResult {
  // Whether access is allowed
  hasAccess: boolean;
  
  // Whether to show the upgrade modal
  shouldShowModal: boolean;
  
  // Dismiss the modal for this session
  dismissModal: () => void;
  
  // Check and potentially trigger modal
  checkAccess: () => boolean;
  
  // Usage info for limits
  currentUsage: number;
  maxUsage: number;
  
  // Loading state
  isLoading: boolean;
}

export function useUpgradeGate(options: UseUpgradeGateOptions): UpgradeGateResult {
  const { feature, limitType, floorNumber, roomId } = options;
  const freeTier = useFreeTier();
  const [showModal, setShowModal] = useState(false);

  // Determine access and usage based on limit type
  const getAccessInfo = useCallback(() => {
    switch (limitType) {
      case "jeeves":
        return {
          hasAccess: freeTier.canUseJeeves,
          currentUsage: freeTier.jeevesUsageToday,
          maxUsage: FREE_TIER_LIMITS.jeevesDaily,
        };
      case "challenge":
        return {
          hasAccess: freeTier.canAccessDailyChallenge,
          currentUsage: freeTier.dailyChallengeSubmissionsThisWeek,
          maxUsage: FREE_TIER_LIMITS.challengesWeekly,
        };
      case "floor":
        return {
          hasAccess: floorNumber ? freeTier.canAccessFloor(floorNumber) : true,
          currentUsage: 0,
          maxUsage: 0,
        };
      case "room":
        return {
          hasAccess: roomId ? freeTier.canAccessRoom(roomId) : true,
          currentUsage: 0,
          maxUsage: 0,
        };
      default:
        return {
          hasAccess: freeTier.isPremium,
          currentUsage: 0,
          maxUsage: 0,
        };
    }
  }, [freeTier, limitType, floorNumber, roomId]);

  const { hasAccess, currentUsage, maxUsage } = getAccessInfo();

  // Check if this feature was already dismissed
  const wasDismissed = sessionDismissals.has(feature);

  // Whether to show the modal
  // Guard: never show while entitlement checks are still loading (prevents false upgrade prompts)
  const shouldShowModal = !hasAccess && showModal && !wasDismissed && !freeTier.isLoading;

  const dismissModal = useCallback(() => {
    sessionDismissals.add(feature);
    setShowModal(false);
  }, [feature]);

  // Check access and trigger modal if needed
  const checkAccess = useCallback((): boolean => {
    // Don't show paywalls while entitlement checks are still loading
    // (prevents false "upgrade" prompts during login / slow network)
    if (freeTier.isLoading) {
      return true;
    }

    if (hasAccess) {
      return true;
    }

    // If already dismissed, still block but don't show modal again
    if (!wasDismissed) {
      setShowModal(true);
    }
    
    return false;
  }, [freeTier.isLoading, hasAccess, wasDismissed]);

  return {
    hasAccess,
    shouldShowModal,
    dismissModal,
    checkAccess,
    currentUsage,
    maxUsage,
    isLoading: freeTier.isLoading,
  };
}

// Helper to reset all dismissals (e.g., on logout)
export function resetUpgradeDismissals() {
  sessionDismissals.clear();
}
