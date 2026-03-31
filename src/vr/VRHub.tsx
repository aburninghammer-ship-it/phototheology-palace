import React, { useState, Suspense, useCallback } from 'react';
import { Glasses, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Error boundary for WebGL/Three.js crashes
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

// Lazy-load heavy 3D deps so they don't block initial render
const VRCanvas = React.lazy(() => import('./VRCanvas'));

export default function VRHub() {
  return (
    <div className="w-full h-screen bg-black relative">
      <VRErrorBoundary>
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <Glasses className="h-10 w-10 text-primary animate-pulse" />
              <p className="text-muted-foreground">Loading VR Experience...</p>
            </div>
          }
        >
          <VRCanvas />
        </Suspense>
      </VRErrorBoundary>
    </div>
  );
}
