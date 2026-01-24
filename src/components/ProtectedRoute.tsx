import { ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("[ProtectedRoute] Check - Path:", location.pathname, "Loading:", loading, "User:", user?.email ?? "none");

    // Only redirect if we're done loading AND there's no user
    if (!loading && !user) {
      const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
      console.log("[ProtectedRoute] Redirecting to /auth (no user found)", { redirect });
      navigate(`/auth?redirect=${redirect}`, { replace: true });
    }
  }, [user, loading, navigate, location.pathname, location.search]);

  // Show loading while checking auth status
  if (loading) {
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
  if (!user) {
    return null;
  }

  // User is authenticated, show the protected content
  return <>{children}</>;
};
