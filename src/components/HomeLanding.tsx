import { useAuth } from "@/hooks/useAuth";
import { useFreeTier } from "@/hooks/useFreeTier";
import Gatehouse from "@/pages/Gatehouse";
import { lazy, Suspense } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";

const ShowMe = lazy(() => import("@/pages/ShowMe"));

/**
 * Root landing component:
 * - Unauthenticated visitors → ShowMe demo page
 * - Authenticated free-tier (no subscription) → ShowMe page (with account features)
 * - Trial / paid subscribers → Gatehouse (full app)
 */
export function HomeLanding() {
  const { user, loading } = useAuth();
  const { tier, isLoading: tierLoading } = useFreeTier();

  if (loading || (user && tierLoading)) return <LoadingScreen />;

  // Unauthenticated → ShowMe
  if (!user) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <ShowMe />
      </Suspense>
    );
  }

  // Authenticated free-tier → ShowMe (they have an account but no subscription)
  if (tier === "free") {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <ShowMe />
      </Suspense>
    );
  }

  // Trial, essential, premium, student, patron → full app
  return <Gatehouse />;
}
