import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "./ui/alert";
import { WifiOff, Wifi, Database } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);
  const navigate = useNavigate();

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
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-slide-up">
      <Alert variant={isOnline ? "default" : "destructive"}>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <>
              <Wifi className="h-4 w-4" />
              <AlertDescription>Back online! Your changes will sync.</AlertDescription>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4" />
              <div className="flex-1">
                <AlertDescription className="mb-2">
                  You're offline. Using cached content.
                </AlertDescription>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/offline-manager')}
                  className="w-full"
                >
                  <Database className="h-3 w-3 mr-2" />
                  Manage Offline Content
                </Button>
              </div>
            </>
          )}
        </div>
      </Alert>
    </div>
  );
};
