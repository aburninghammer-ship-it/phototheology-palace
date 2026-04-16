import { useState, useEffect } from "react";
import { RotateCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileOrientationTipProps {
  className?: string;
}

export function MobileOrientationTip({ className }: MobileOrientationTipProps) {
  const isMobile = useIsMobile();
  const [dismissed, setDismissed] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    // Check if user has dismissed this tip before
    const hasDismissed = localStorage.getItem("orientation_tip_dismissed");
    if (hasDismissed) {
      setDismissed(true);
    }

    // Check orientation
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("orientation_tip_dismissed", "true");
  };

  // Only show on mobile, when not dismissed, and when in portrait mode
  if (!isMobile || dismissed || isLandscape) {
    return null;
  }

  return (
    <div className={`bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-lg p-3 flex items-center gap-3 ${className}`}>
      <div className="flex-shrink-0 p-2 bg-amber-500/20 rounded-full">
        <RotateCw className="h-5 w-5 text-amber-600 dark:text-amber-400 animate-pulse" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
          📱 Tip: Rotate your phone horizontally for the full tabs experience!
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="flex-shrink-0 h-8 w-8 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
        onClick={handleDismiss}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
