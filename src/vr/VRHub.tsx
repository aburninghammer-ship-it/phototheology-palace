import React, { useState, useCallback, useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const VRCanvas = React.lazy(() => import('./VRCanvas'));

class VRErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  state = { hasError: false, error: undefined as Error | undefined };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
          <AlertTriangle className="h-12 w-12 text-amber-500" />
          <h2 className="text-xl font-bold text-foreground">WebGL Not Available</h2>
          <p className="text-muted-foreground max-w-md">
            The VR experience requires WebGL which isn't available in this preview.
            Open this page on a Meta Quest 3 browser or a WebGL-capable desktop browser.
          </p>
          <p className="text-xs text-muted-foreground/60 font-mono">{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function VRHub() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  // Poll for SW updates every 15s and listen for statechange
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    let cancelled = false;

    const checkSW = async () => {
      try {
        const reg = await navigator.serviceWorker.getRegistration();
        if (!reg) return;
        await reg.update();
        if (reg.waiting) {
          setUpdateAvailable(true);
        }
        // Listen for installing worker to become waiting
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
            }
          });
        });
      } catch (e) {
        console.warn('VR SW check error:', e);
      }
    };

    checkSW();
    const interval = setInterval(() => {
      if (!cancelled) checkSW();
    }, 15_000);

    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  const applyUpdate = useCallback(() => {
    // Force a hard reload — works even when SW is absent (preview/iframe)
    try {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then((reg) => {
          if (reg?.waiting) {
            reg.waiting.postMessage({ type: 'SKIP_WAITING' });
          }
        }).catch(() => {});
      }
    } catch (_) {
      // ignore
    }
    // Use location.replace with cache-buster to guarantee a fresh load
    const target = new URL(window.location.href);
    target.searchParams.set('_r', Date.now().toString());
    window.location.replace(target.toString());
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        background: '#000',
      }}
    >
      <VRErrorBoundary>
        <React.Suspense
          fallback={
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
            </div>
          }
        >
          <VRCanvas />
        </React.Suspense>
      </VRErrorBoundary>

      {/* Always-visible reload button for VR — top-right */}
      <button
        onClick={applyUpdate}
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 10001,
          background: updateAvailable ? 'rgba(99,102,241,0.95)' : 'rgba(255,255,255,0.15)',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '10px 18px',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: updateAvailable ? '0 4px 20px rgba(99,102,241,0.5)' : '0 2px 8px rgba(0,0,0,0.3)',
        }}
      >
        <RefreshCw size={16} />
        {updateAvailable ? 'Update Available — Reload' : 'Reload'}
      </button>
    </div>
  );
}
