import React, { useState, Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { XR, VRButton, ARButton, useXR } from '@react-three/xr';
import { OrbitControls } from '@react-three/drei';
import { VRLobby, type VRExperience } from './VRLobby';

const SanctuaryWalk = React.lazy(() => import('./experiences/SanctuaryWalk'));
const GalleryCorridor = React.lazy(() => import('./experiences/GalleryCorridor'));
const SpatialAudioPlayer = React.lazy(() => import('./experiences/SpatialAudioPlayer'));
const HeavensDiary = React.lazy(() => import('./experiences/HeavensDiary'));

/** Disable OrbitControls when inside an XR session (head tracking takes over) */
function DesktopControls() {
  const { isPresenting } = useXR();
  if (isPresenting) return null;
  return (
    <OrbitControls
      target={[0, 1, -3]}
      enablePan={false}
      enableZoom={true}
      minDistance={0.5}
      maxDistance={20}
      maxPolarAngle={Math.PI * 0.85}
    />
  );
}

function VRScene() {
  const [currentExperience, setCurrentExperience] = useState<VRExperience>('lobby');
  const goToLobby = useCallback(() => setCurrentExperience('lobby'), []);

  return (
    <Suspense fallback={null}>
      <DesktopControls />

      {currentExperience === 'lobby' && (
        <VRLobby onEnterExperience={setCurrentExperience} />
      )}
      {currentExperience === 'sanctuary' && <SanctuaryWalk onBack={goToLobby} />}
      {currentExperience === 'gallery' && <GalleryCorridor onBack={goToLobby} />}
      {currentExperience === 'audio' && <SpatialAudioPlayer onBack={goToLobby} />}
      {currentExperience === 'heavensDiary' && <HeavensDiary onBack={goToLobby} />}
    </Suspense>
  );
}

export default function VRCanvas() {
  const [xrError, setXrError] = useState<string | null>(null);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* XR session buttons */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 200,
          display: 'flex',
          gap: 12,
        }}
      >
        <VRButton
          sessionInit={{
            optionalFeatures: ['hand-tracking', 'local-floor'],
            requiredFeatures: ['local'],
          }}
          onError={(err) => setXrError(`VR: ${err.message}`)}
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
        />
        <ARButton
          sessionInit={{
            optionalFeatures: ['hand-tracking', 'local-floor'],
            requiredFeatures: ['local'],
          }}
          onError={(err) => setXrError(`AR: ${err.message}`)}
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
        />
      </div>

      {/* XR error message */}
      {xrError && (
        <div
          style={{
            position: 'absolute',
            top: 70,
            right: 16,
            zIndex: 200,
            background: 'rgba(220,40,40,0.9)',
            color: '#fff',
            padding: '10px 16px',
            borderRadius: 8,
            fontSize: 13,
            maxWidth: 320,
          }}
        >
          {xrError}
          <button
            onClick={() => setXrError(null)}
            style={{ marginLeft: 12, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* R3F Canvas — fills the parent div */}
      <Canvas
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: false }}
        camera={{ position: [0, 2.5, 4], fov: 75, near: 0.1, far: 200 }}
      >
        <XR referenceSpace="local" foveation={1} frameRate={72}>
          <VRScene />
        </XR>
      </Canvas>

      {/* Non-XR notice */}
      <div
        style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#ccc',
          fontSize: 15,
          textAlign: 'center',
          zIndex: 100,
          background: 'rgba(0,0,0,0.7)',
          padding: '10px 20px',
          borderRadius: 8,
          pointerEvents: 'none',
        }}
      >
        For the full experience, open this page on Meta Quest 3 browser and click "Enter VR"
      </div>

      {/* Quest 3 boundary tip */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#f0c040',
          fontSize: 13,
          textAlign: 'center',
          zIndex: 100,
          background: 'rgba(0,0,0,0.7)',
          padding: '8px 16px',
          borderRadius: 8,
          pointerEvents: 'none',
          maxWidth: 400,
        }}
      >
        Quest 3: If prompted for a boundary, choose "Stationary" (small circle). You must set up a guardian boundary before entering VR.
      </div>

      {/* Desktop controls hint */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#aaa',
          fontSize: 13,
          textAlign: 'center',
          zIndex: 100,
          background: 'rgba(0,0,0,0.6)',
          padding: '8px 16px',
          borderRadius: 8,
          pointerEvents: 'none',
        }}
      >
        Drag to look around · Scroll to zoom · Click portals to enter
      </div>
    </div>
  );
}
