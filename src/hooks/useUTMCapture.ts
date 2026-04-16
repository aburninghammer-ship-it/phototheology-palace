import { useEffect } from 'react';
import { captureUTMParams } from '@/utils/trackingUtils';

/**
 * Hook to capture UTM parameters on app initialization
 * Place this in a top-level component that mounts once
 */
export function useUTMCapture() {
  useEffect(() => {
    captureUTMParams();
  }, []);
}
