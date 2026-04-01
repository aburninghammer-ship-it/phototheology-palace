import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';

// Key for tracking recent updates to prevent prompt spam
const UPDATE_COOLDOWN_KEY = 'pwa_update_cooldown';
const UPDATE_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes cooldown after update

function isInCooldown(): boolean {
  const cooldownUntil = localStorage.getItem(UPDATE_COOLDOWN_KEY);
  if (!cooldownUntil) return false;
  return Date.now() < parseInt(cooldownUntil, 10);
}

function setCooldown(): void {
  localStorage.setItem(UPDATE_COOLDOWN_KEY, String(Date.now() + UPDATE_COOLDOWN_MS));
}

const isMetaWebView = /FBAN|FBAV|FB_IAB|FBIOS|Instagram|OculusBrowser|Meta Quest/i.test(navigator.userAgent);

export function PWAUpdatePrompt() {
  const [showReload, setShowReload] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Meta in-app browser fallback: SW updates don't fire, so poll build tag
  // Use full origin URL and multiple cache-busting strategies
  useEffect(() => {
    if (!isMetaWebView) return;
    const currentBuild = document.querySelector('meta[name="app-build"]')?.getAttribute('content');
    if (!currentBuild) return;

    const check = async () => {
      try {
        // Fetch with aggressive cache busting and explicit build-check marker.
        const url = `${location.origin}/?__buildcheck=${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const html = await fetch(url, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
            'Pragma': 'no-cache',
          },
        }).then(r => r.text());
        const match = html.match(/<meta\s+name=["']app-build["']\s+content=["']([^"']+)["']/i);
        const nextBuild = match?.[1];
        if (nextBuild && nextBuild !== currentBuild) {
          console.log('[PWA] Meta webview: new build detected, auto-reloading', { currentBuild, nextBuild });
          // In Meta webviews, auto-reload is more reliable than showing a prompt
          window.location.href = `${location.origin}/?_v=${Date.now()}`;
          return;
        }
      } catch (e) {
        console.error('[PWA] Meta webview build check failed:', e);
      }
    };

    // Check after 5s (let page settle), then every 20s
    const timeout = setTimeout(check, 5000);
    const id = setInterval(check, 20_000);
    return () => { clearTimeout(timeout); clearInterval(id); };
  }, []);
  
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      console.log('SW registered:', swUrl);
      if (r) {
        // Check for updates every 5 minutes (less aggressive)
        setInterval(() => {
          // Don't check if in cooldown
          if (!isInCooldown()) {
            console.log('Checking for SW update...');
            r.update();
          }
        }, 5 * 60 * 1000);
        
        // Only check immediately if not in cooldown
        if (!isInCooldown()) {
          r.update();
        }
      }
    },
    onNeedRefresh() {
      console.log('New content available, checking cooldown...');
      // Only show prompt if not in cooldown period
      if (!isInCooldown()) {
        console.log('Showing update prompt');
        setShowReload(true);
      } else {
        console.log('In cooldown period, skipping prompt');
      }
    },
    onOfflineReady() {
      console.log('App ready for offline use');
    },
    onRegisterError(error) {
      console.error('SW registration error:', error);
    },
  });

  useEffect(() => {
    // Only show if needRefresh is true AND not in cooldown
    if (needRefresh && !isInCooldown()) {
      setShowReload(true);
    }
  }, [needRefresh]);

  const handleUpdate = useCallback(async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    
    try {
      // Set cooldown before updating to prevent immediate re-prompt
      setCooldown();
      
      // Update the service worker
      await updateServiceWorker(true);
      
      // Wait for SW to activate, then reload
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration?.waiting) {
          // Send skip waiting message
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          
          // Wait for the new SW to activate
          await new Promise<void>((resolve) => {
            const onControllerChange = () => {
              navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
              resolve();
            };
            navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
            // Timeout after 3 seconds
            setTimeout(resolve, 3000);
          });
        }
      }
      
      // Reload the page
      window.location.reload();
    } catch (error) {
      console.error('Error during update:', error);
      setIsUpdating(false);
      // Still try to reload
      window.location.reload();
    }
  }, [updateServiceWorker, isUpdating]);

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
    setShowReload(false);
    // Set a shorter cooldown when user dismisses
    localStorage.setItem(UPDATE_COOLDOWN_KEY, String(Date.now() + 2 * 60 * 1000)); // 2 min cooldown
  };

  if (!offlineReady && !showReload) return null;

  return createPortal(
    <div className="fixed inset-0 z-[2147483647] flex items-center justify-center p-4 overflow-visible" style={{ pointerEvents: 'none' }}>
      <div style={{ pointerEvents: 'auto' }} className="w-[min(92vw,22rem)] max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl border border-border bg-card/95 p-5 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 fade-in-0">
        {offlineReady && !showReload ? (
          <>
            <div className="flex items-center gap-2 mb-2">
              <Download className="h-5 w-5 text-accent" />
              <h3 className="text-base font-bold text-foreground">Ready Offline</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 break-words">
              The app is now available offline. You can use it without an internet connection.
            </p>
            <Button onClick={close} variant="outline" size="sm" className="w-full">
              Dismiss
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              <h3 className="text-base font-bold text-foreground">New Version Available</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 break-words">
              A new version is ready. Refresh now to load the latest features and fixes.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={handleUpdate}
                variant="default"
                size="sm"
                className="flex-1"
                disabled={isUpdating}
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${isUpdating ? 'animate-spin' : ''}`} />
                {isUpdating ? 'Updating...' : 'Reload'}
              </Button>
              <Button onClick={close} variant="outline" size="sm" className="flex-1" disabled={isUpdating}>
                Later
              </Button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

// Export a hook for manual update checking from other components
export function useCheckForUpdates() {
  const [isChecking, setIsChecking] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  const checkForUpdates = useCallback(async () => {
    // Don't check if in cooldown
    if (isInCooldown()) {
      return false;
    }
    
    setIsChecking(true);
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          if (registration.waiting) {
            setUpdateAvailable(true);
            return true;
          }
        }
      }
      return false;
    } catch (error) {
      console.error('Error checking for updates:', error);
      return false;
    } finally {
      setIsChecking(false);
    }
  }, []);

  const applyUpdate = useCallback(async () => {
    setCooldown();
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration?.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    }
  }, []);

  return { checkForUpdates, applyUpdate, isChecking, updateAvailable };
}
