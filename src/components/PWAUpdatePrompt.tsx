import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Download } from 'lucide-react';

export function PWAUpdatePrompt() {
  const [showReload, setShowReload] = useState(false);
  
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (r) {
        // Check for updates every hour
        setInterval(() => {
          r.update();
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      setShowReload(true);
    }
  }, [needRefresh]);

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
    setShowReload(false);
  };

  if (!offlineReady && !showReload) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md animate-in slide-in-from-bottom-4">
      {offlineReady && !showReload && (
        <Alert className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Download className="h-4 w-4" />
          <AlertTitle>App ready for offline use</AlertTitle>
          <AlertDescription className="mt-2 flex items-center gap-2">
            <span className="flex-1 text-sm">The app is now available offline</span>
            <Button onClick={close} variant="outline" size="sm">
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {showReload && (
        <Alert className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Download className="h-4 w-4" />
          <AlertTitle>New version available</AlertTitle>
          <AlertDescription className="mt-2 flex items-center gap-2">
            <span className="flex-1 text-sm">Click reload to update to the latest version</span>
            <Button 
              onClick={() => {
                updateServiceWorker(true);
                window.location.reload();
              }} 
              variant="default" 
              size="sm"
            >
              Reload
            </Button>
            <Button onClick={close} variant="outline" size="sm">
              Later
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
