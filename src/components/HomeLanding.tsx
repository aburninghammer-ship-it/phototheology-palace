import { useAuth } from "@/hooks/useAuth";
import Gatehouse from "@/pages/Gatehouse";
import { lazy, Suspense } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";

const ShowMe = lazy(() => import("@/pages/ShowMe"));

/**
 * Root landing component: unauthenticated visitors see the ShowMe demo page,
 * authenticated users see the Gatehouse.
 */
export function HomeLanding() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (user) return <Gatehouse />;

  return (
    <Suspense fallback={<LoadingScreen />}>
      <ShowMe />
    </Suspense>
  );
}
