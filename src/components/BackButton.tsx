import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useExperienceMode } from "@/contexts/ExperienceModeContext";

// Pages that shouldn't be navigated back to - these are entry points/onboarding
const SKIP_BACK_PATHS = [
  "/gatehouse",
  "/guesthouse",
  "/onboarding",
  "/auth",
  "/access",
];

// Map of current path patterns to their sensible "parent" routes
const getParentRoute = (pathname: string, isBasic: boolean): string => {
  const home = isBasic ? "/welcome" : "/dashboard";

  // Devotional profile detail pages go back to devotionals
  if (pathname.startsWith("/devotionals/profile/")) {
    return "/devotionals";
  }
  // Devotional plan detail pages go back to devotionals
  if (pathname.startsWith("/devotionals/") && pathname !== "/devotionals") {
    return "/devotionals";
  }
  // Bible reader pages go back to bible
  if (pathname.startsWith("/bible/")) {
    return "/bible";
  }
  // Palace room pages go back to palace
  if (pathname.startsWith("/palace/")) {
    return "/palace";
  }
  // Study detail pages go back to my-studies
  if (pathname.startsWith("/my-studies/")) {
    return "/my-studies";
  }
  // Default top-level pages go to home
  const topLevelParents: Record<string, string> = {
    "/devotionals": home,
    "/bible": home,
    "/palace": home,
    "/games": home,
    "/my-studies": home,
    "/profile": home,
    "/settings": home,
    "/community": home,
    "/audio-library": home,
    "/level-select": home,
  };
  return topLevelParents[pathname] || home;
};

export const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isBasic } = useExperienceMode();

  const home = isBasic ? "/welcome" : "/dashboard";

  // Don't show on home page or entry points
  if (
    location.pathname === "/" || 
    location.pathname === home ||
    location.pathname === "/welcome" ||
    location.pathname === "/dashboard" ||
    SKIP_BACK_PATHS.some(path => location.pathname.startsWith(path))
  ) {
    return null;
  }

  const handleBack = () => {
    const parentRoute = getParentRoute(location.pathname, isBasic);
    navigate(parentRoute);
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
