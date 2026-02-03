import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Pages that shouldn't be navigated back to
const SKIP_BACK_PATHS = [
  "/gatehouse",
  "/onboarding",
  "/auth",
];

// Map of current paths to their sensible "parent" routes
const PARENT_ROUTES: Record<string, string> = {
  "/devotionals": "/dashboard",
  "/bible": "/dashboard",
  "/palace": "/dashboard",
  "/games": "/dashboard",
  "/my-studies": "/dashboard",
  "/profile": "/dashboard",
  "/settings": "/dashboard",
};

export const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on dashboard/home page
  if (location.pathname === "/" || location.pathname === "/dashboard") {
    return null;
  }

  const handleBack = () => {
    // Check if we have meaningful history to go back to
    // window.history.length > 2 means there's more than just the current page and initial load
    const hasHistory = window.history.length > 2;
    
    // Get the referrer to check if we came from a problematic page
    const referrer = document.referrer;
    const shouldSkipHistory = SKIP_BACK_PATHS.some(path => referrer.includes(path));
    
    if (hasHistory && !shouldSkipHistory) {
      navigate(-1);
    } else {
      // Find a sensible parent route or default to dashboard
      const parentRoute = PARENT_ROUTES[location.pathname] || "/dashboard";
      navigate(parentRoute, { replace: true });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBack}
      className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="hidden sm:inline">Back</span>
    </Button>
  );
};
