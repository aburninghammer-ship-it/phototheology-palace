import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "./ui/alert";
import { WifiOff, Wifi, HardDrive } from "lucide-react";
import { Button } from "./ui/button";

export const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        setTimeout(() => setWasOffline(false), 3000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [wasOffline]);

  if (isOnline && !wasOffline) return null;

  return (
    <div className="fixed bottom-24 md:bottom-4 right-4 z-50 max-w-sm animate-slide-up">
      <Alert variant={isOnline ? "default" : "destructive"}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {isOnline ? (
              <>
                <Wifi className="h-4 w-4" />
                <AlertDescription>Back online! Your changes will sync.</AlertDescription>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4" />
                <AlertDescription>
                  You're offline. Some features may not work.
                </AlertDescription>
              </>
            )}
          </div>
          {!isOnline && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/offline-content'}
              className="ml-2 flex-shrink-0"
            >
              <HardDrive className="w-3 h-3 mr-1" />
              View Cache
            </Button>
          )}
        </div>
      </Alert>
    </div>
  );
};
