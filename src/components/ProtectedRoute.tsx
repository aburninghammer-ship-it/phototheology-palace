import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useFeatureGate } from "@/hooks/useFeatureGate";
import { getMinModeForPath } from "@/config/featureRegistry";
import { UpgradePromptPage } from "@/components/experience-mode/UpgradePromptPage";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [verifying, setVerifying] = useState(true);
  const [verifiedUser, setVerifiedUser] = useState<any>(null);

  // Double-check session on mount to handle race conditions
  useEffect(() => {
    const verifySession = async () => {
      console.log("[ProtectedRoute] Verifying session for path:", location.pathname);
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error("[ProtectedRoute] Session verification error:", error);
      }

      console.log("[ProtectedRoute] Verified session:", session?.user?.email ?? "none");
      setVerifiedUser(session?.user ?? null);
      setVerifying(false);
    };

    verifySession();
  }, [location.pathname]);

  useEffect(() => {
    const effectiveUser = verifiedUser || user;
    const isLoading = loading || verifying;

    console.log("[ProtectedRoute] Check - Path:", location.pathname, "Loading:", isLoading, "User:", effectiveUser?.email ?? "none");

    // Only redirect if we're done loading AND there's no user
    if (!isLoading && !effectiveUser) {
      const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
      console.log("[ProtectedRoute] Redirecting to /auth (no user found)", { redirect });
      navigate(`/auth?redirect=${redirect}`, { replace: true });
    }
  }, [user, verifiedUser, loading, verifying, navigate, location.pathname, location.search]);

  const effectiveUser = verifiedUser || user;
  const isLoading = loading || verifying;

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-dreamy">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If still no user after loading, show nothing (redirect will happen in useEffect)
  if (!effectiveUser) {
    return null;
  }

  // User is authenticated — check experience mode gating
  return <ModeGatedContent>{children}</ModeGatedContent>;
};

/** Checks if the current route is accessible for the user's experience mode */
function ModeGatedContent({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { isAccessible } = useFeatureGate();

  if (!isAccessible(location.pathname)) {
    const requiredMode = getMinModeForPath(location.pathname);
    return <UpgradePromptPage requiredMode={requiredMode} />;
  }

  return <>{children}</>;
}
