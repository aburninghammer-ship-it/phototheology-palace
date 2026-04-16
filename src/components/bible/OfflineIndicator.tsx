import { useState, useEffect } from "react";
import { WifiOff, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Show briefly when coming back online
      setShowIndicator(true);
      setTimeout(() => setShowIndicator(false), 3000);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setShowIndicator(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Show indicator if starting offline
    if (!navigator.onLine) {
      setShowIndicator(true);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!showIndicator) return null;

  return (
    <Badge
      variant="outline"
      className={cn(
        "fixed bottom-24 md:bottom-4 left-4 z-50 gap-1.5 transition-all duration-300",
        isOnline
          ? "bg-green-100 text-green-700 border-green-300"
          : "bg-amber-100 text-amber-700 border-amber-300 animate-pulse"
      )}
    >
      {isOnline ? (
        <>
          <Wifi className="h-3 w-3" />
          Back Online
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          Offline Mode
        </>
      )}
    </Badge>
  );
};
