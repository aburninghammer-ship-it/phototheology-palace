import React, { useState, Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { XR } from '@react-three/xr';
import { Text } from '@react-three/drei';
import { useXRSessionStore } from './hooks/useXRSession';
import { VRLobby, type VRExperience } from './VRLobby';

// Lazy-load experiences so they're tree-shaken when not used
const SanctuaryWalk = React.lazy(() => import('./experiences/SanctuaryWalk'));
const GalleryCorridor = React.lazy(() => import('./experiences/GalleryCorridor'));
const SpatialAudioPlayer = React.lazy(() => import('./experiences/SpatialAudioPlayer'));
const HeavensDiary = React.lazy(() => import('./experiences/HeavensDiary'));

function LoadingFallback() {
  return (
    <Text position={[0, 1.5, -2]} fontSize={0.2} color="white" anchorX="center">
      Loading experience...
    </Text>
  );
}

function VRScene() {
  const [currentExperience, setCurrentExperience] = useState<VRExperience>('lobby');

  const goToLobby = useCallback(() => setCurrentExperience('lobby'), []);

  return (
    <>
      {currentExperience === 'lobby' && (
        <VRLobby onEnterExperience={setCurrentExperience} />
      )}

      <Suspense fallback={<LoadingFallback />}>
        {currentExperience === 'sanctuary' && (
          <SanctuaryWalk onBack={goToLobby} />
        )}
        {currentExperience === 'gallery' && (
          <GalleryCorridor onBack={goToLobby} />
        )}
        {currentExperience === 'audio' && (
          <SpatialAudioPlayer onBack={goToLobby} />
        )}
        {currentExperience === 'heavensDiary' && (
          <HeavensDiary onBack={goToLobby} />
        )}
      </Suspense>
    </>
  );
}

export default function VRHub() {
  const store = useXRSessionStore();

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      {/* Non-XR fallback UI */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          gap: 12,
        }}
      >
        <button
          onClick={() => store.enterVR()}
          style={{
            padding: '12px 24px',
            background: '#4488FF',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontSize: 16,
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Enter VR
        </button>
        <button
          onClick={() => store.enterAR()}
          style={{
            padding: '12px 24px',
            background: '#44FFEE',
            color: '#000',
            border: 'none',
            borderRadius: 8,
            fontSize: 16,
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Enter AR
        </button>
      </div>

      <Canvas
        gl={{ antialias: true, alpha: false }}
        camera={{ position: [0, 1.6, 0], fov: 75, near: 0.1, far: 200 }}
      >
        <XR store={store}>
          <VRScene />
        </XR>
      </Canvas>

      {/* Non-XR notice for desktop browsers */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#666',
          fontSize: 14,
          textAlign: 'center',
          zIndex: 10,
        }}
      >
        For the full experience, open this page on Meta Quest 3 browser and click "Enter VR"
      </div>
    </div>
  );
}
