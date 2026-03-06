import { useMemo } from "react";
import { useSubscription } from "@/hooks/useSubscription";

export function useGideonAccess() {
  const { subscription, loading } = useSubscription();

  return useMemo(() => {
    const now = new Date();
    const day = now.getDay(); // 0=Sun, 5=Fri
    const hour = now.getHours();
    const isFridayNight = day === 5 && hour >= 18 && hour <= 23;

    const hasFullAccess = subscription.hasAccess;
    const canPlay = hasFullAccess || isFridayNight;
    const accessTier = hasFullAccess ? "full_suite" as const : "friday_pass" as const;

    const fridayWindowEnd = isFridayNight ? "11:59 PM" : null;

    return {
      canPlay,
      accessTier,
      isFridayNight,
      fridayWindowEnd,
      loading,
    };
  }, [subscription.hasAccess, loading]);
}
