import { useMemo } from 'react';
import { createXRStore } from '@react-three/xr';

export function useXRSessionStore() {
  const store = useMemo(
    () =>
      createXRStore({
        // Request immersive VR with local-floor reference space
        // Quest 3 supports hand tracking natively
      }),
    []
  );
  return store;
}
