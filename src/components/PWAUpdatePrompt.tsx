import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';

const SUPPRESSED_BUILD_PREFIX = 'pwa_update_suppressed_build:';
const AUTO_REFRESHED_BUILD_PREFIX = 'pwa_auto_refreshed_build:';
const WAITING_SW_DISMISS_KEY = 'pwa_waiting_sw_dismissed';
export const MANUAL_UPDATE_REQUIRED_EVENT = 'pt:manual-update-required';
const BUILD_CHECK_INTERVAL_MS = 30_000;
const INITIAL_BUILD_CHECK_DELAY_MS = 4_000;

const isMetaWebView =
  /FBAN|FBAV|FB_IAB|FBIOS|Instagram/i.test(navigator.userAgent) &&
  !/OculusBrowser|Meta Quest/i.test(navigator.userAgent);

const isInIframe = (() => {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
})();

const isPreviewHost =
  window.location.hostname.includes('id-preview--') ||
  window.location.hostname.includes('lovableproject.com');

function readCurrentBuildTag(): string | null {
  return document.querySelector('meta[name="app-build"]')?.getAttribute('content') ?? null;
}

async function fetchLatestBuildTag(): Promise<string | null> {
  const url = `${window.location.origin}/?__buildcheck=${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const html = await fetch(url, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
      Pragma: 'no-cache',
    },
  }).then((response) => response.text());

  const match = html.match(/<meta\s+name=["']app-build["']\s+content=["']([^"']+)["']/i);
  return match?.[1] ?? null;
}

function suppressBuild(build: string | null): void {
  if (!build) return;
  localStorage.setItem(`${SUPPRESSED_BUILD_PREFIX}${build}`, '1');
}

function isBuildSuppressed(build: string | null): boolean {
  if (!build) return false;
  return localStorage.getItem(`${SUPPRESSED_BUILD_PREFIX}${build}`) === '1';
}

function hasAutoRefreshedBuild(build: string | null): boolean {
  if (!build) return false;
  return sessionStorage.getItem(`${AUTO_REFRESHED_BUILD_PREFIX}${build}`) === '1';
}

function markAutoRefreshedBuild(build: string | null): void {
  if (!build) return;
  sessionStorage.setItem(`${AUTO_REFRESHED_BUILD_PREFIX}${build}`, '1');
}

async function forceHardRefresh(queryKey: string, value: string) {
  try {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    }

    if ('caches' in window) {
      const cacheKeys = await caches.keys();
      await Promise.all(cacheKeys.map((key) => caches.delete(key)));
    }
  } finally {
    const target = new URL(window.location.href);
    target.searchParams.set(queryKey, value);
    window.location.replace(target.toString());
  }
}

export function PWAUpdatePrompt() {
  const [showReload, setShowReload] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [pendingBuild, setPendingBuild] = useState<string | null>(null);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      console.log('SW registered:', swUrl);

      if (registration?.waiting && sessionStorage.getItem(WAITING_SW_DISMISS_KEY) !== '1') {
        setShowReload(true);
      }
    },
    onNeedRefresh() {
      console.log('New content available, showing reload prompt');
      sessionStorage.removeItem(WAITING_SW_DISMISS_KEY);
      setShowReload(true);
    },
    onOfflineReady() {
      console.log('App ready for offline use');
    },
    onRegisterError(error) {
      console.error('SW registration error:', error);
    },
  });

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    if (sessionStorage.getItem(WAITING_SW_DISMISS_KEY) === '1') return;

    void navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration?.waiting) {
        setShowReload(true);
      }
    });
  }, []);

  useEffect(() => {
    if (needRefresh) {
      sessionStorage.removeItem(WAITING_SW_DISMISS_KEY);
      setShowReload(true);
    }
  }, [needRefresh]);

  useEffect(() => {
    const handleManualUpdateRequired = () => {
      sessionStorage.removeItem(WAITING_SW_DISMISS_KEY);
      setShowReload(true);
    };

    window.addEventListener(MANUAL_UPDATE_REQUIRED_EVENT, handleManualUpdateRequired);
    return () => window.removeEventListener(MANUAL_UPDATE_REQUIRED_EVENT, handleManualUpdateRequired);
  }, []);

  useEffect(() => {
    if (isMetaWebView || isPreviewHost || isInIframe) return;

    const currentBuild = readCurrentBuildTag();
    if (!currentBuild) return;

    let cancelled = false;

    const checkForPublishedUpdate = async () => {
      try {
        const nextBuild = await fetchLatestBuildTag();
        if (
          cancelled ||
          !nextBuild ||
          nextBuild === currentBuild ||
          isBuildSuppressed(nextBuild) ||
          hasAutoRefreshedBuild(nextBuild)
        ) {
          return;
        }

        if ('serviceWorker' in navigator) {
          await navigator.serviceWorker
            .getRegistration()
            .then((registration) => registration?.update())
            .catch(() => undefined);
        }

        markAutoRefreshedBuild(nextBuild);
        await forceHardRefresh('__app_refresh', `build-${nextBuild}`);
      } catch {
        // Ignore transient network/cache issues and retry on next poll.
      }
    };

    const timeoutId = window.setTimeout(() => {
      void checkForPublishedUpdate();
    }, INITIAL_BUILD_CHECK_DELAY_MS);

    const intervalId = window.setInterval(() => {
      void checkForPublishedUpdate();
    }, BUILD_CHECK_INTERVAL_MS);

    const handleVisibilityCheck = () => {
      if (document.visibilityState === 'visible') {
        void checkForPublishedUpdate();
      }
    };

    window.addEventListener('focus', handleVisibilityCheck);
    document.addEventListener('visibilitychange', handleVisibilityCheck);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
      window.removeEventListener('focus', handleVisibilityCheck);
      document.removeEventListener('visibilitychange', handleVisibilityCheck);
    };
  }, []);

  const handleUpdate = useCallback(async () => {
    if (isUpdating) return;

    setIsUpdating(true);
    sessionStorage.removeItem(WAITING_SW_DISMISS_KEY);

    try {
      if (isMetaWebView) {
        await forceHardRefresh('__meta_refresh', `manual-${Date.now()}`);
        return;
      }

      markAutoRefreshedBuild(pendingBuild);
      suppressBuild(pendingBuild);
      await forceHardRefresh('__app_refresh', pendingBuild ? `manual-${pendingBuild}` : `manual-${Date.now()}`);
    } catch (error) {
      console.error('Error during update:', error);
      await forceHardRefresh('__app_refresh', `fallback-${Date.now()}`);
    } finally {
      setIsUpdating(false);
    }
  }, [isUpdating, pendingBuild]);

  const close = useCallback(() => {
    suppressBuild(pendingBuild);
    sessionStorage.setItem(WAITING_SW_DISMISS_KEY, '1');
    setOfflineReady(false);
    setNeedRefresh(false);
    setShowReload(false);
  }, [pendingBuild, setNeedRefresh, setOfflineReady]);

  const showMetaReloadButton = isMetaWebView && !offlineReady && !showReload;

  if (!offlineReady && !showReload && !showMetaReloadButton) return null;

  return createPortal(
    <>
      {showMetaReloadButton ? (
        <div
          className="fixed bottom-4 right-4 z-[2147483646]"
          style={{
            bottom: 'max(1rem, calc(env(safe-area-inset-bottom, 0px) + 0.75rem))',
            right: 'max(1rem, calc(env(safe-area-inset-right, 0px) + 0.75rem))',
          }}
        >
          <Button onClick={handleUpdate} size="sm" className="shadow-2xl" disabled={isUpdating}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
            {isUpdating ? 'Reloading...' : 'Reload app'}
          </Button>
        </div>
      ) : null}

      {offlineReady || showReload ? (
        <div
          className="fixed inset-0 z-[2147483647] flex items-center justify-center p-4 overflow-visible"
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{ pointerEvents: 'auto' }}
            className="w-[min(92vw,22rem)] max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl border border-border bg-card/95 p-5 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 fade-in-0"
          >
            {offlineReady && !showReload ? (
              <>
                <div className="mb-2 flex items-center gap-2">
                  <Download className="h-5 w-5 text-accent" />
                  <h3 className="text-base font-bold text-foreground">Ready Offline</h3>
                </div>
                <p className="mb-4 break-words text-sm leading-relaxed text-muted-foreground">
                  The app is now available offline. You can use it without an internet connection.
                </p>
                <Button onClick={close} variant="outline" size="sm" className="w-full">
                  Dismiss
                </Button>
              </>
            ) : (
              <>
                <div className="mb-2 flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-bold text-foreground">New Version Available</h3>
                </div>
                <p className="mb-4 break-words text-sm leading-relaxed text-muted-foreground">
                  A new version is ready. Tap reload now to get the latest features and fixes.
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={handleUpdate}
                    variant="default"
                    size="sm"
                    className="flex-1"
                    disabled={isUpdating}
                  >
                    <RefreshCw className={`mr-1 h-3 w-3 ${isUpdating ? 'animate-spin' : ''}`} />
                    {isUpdating ? 'Updating...' : 'Reload Now'}
                  </Button>
                  <Button onClick={close} variant="outline" size="sm" className="flex-1" disabled={isUpdating}>
                    Later
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>,
    document.body,
  );
}

export function useCheckForUpdates() {
  const [isChecking, setIsChecking] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  const checkForUpdates = useCallback(async () => {
    setIsChecking(true);

    try {
      const currentBuild = readCurrentBuildTag();
      const latestBuild = await fetchLatestBuildTag().catch(() => null);

      if (
        currentBuild &&
        latestBuild &&
        latestBuild !== currentBuild &&
        !isBuildSuppressed(latestBuild)
      ) {
        setUpdateAvailable(true);
        return true;
      }

      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        await registration?.update();

        if (registration?.waiting) {
          setUpdateAvailable(true);
          return true;
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
    if (isMetaWebView) {
      await forceHardRefresh('__meta_refresh', `hook-${Date.now()}`);
      return;
    }

    await forceHardRefresh('__app_refresh', `hook-${Date.now()}`);
  }, []);

  return { checkForUpdates, applyUpdate, isChecking, updateAvailable };
}
