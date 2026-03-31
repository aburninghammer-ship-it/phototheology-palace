import React, { useState, Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { XR, ARButton, useXR } from '@react-three/xr';
import { OrbitControls } from '@react-three/drei';
import { BackSide } from 'three';
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

/**
 * Black sky sphere that blocks AR passthrough cameras.
 * Only rendered during XR sessions so the scene looks like VR
 * even though we use AR mode (to bypass Quest 3 boundary requirement).
 */
function BlackSkySphere() {
  const { isPresenting } = useXR();
  if (!isPresenting) return null;
  return (
    <mesh>
      <sphereGeometry args={[100, 32, 32]} />
      <meshBasicMaterial color="#000000" side={BackSide} />
    </mesh>
  );
}

function VRScene() {
  const [currentExperience, setCurrentExperience] = useState<VRExperience>('lobby');
  const goToLobby = useCallback(() => setCurrentExperience('lobby'), []);

  return (
    <Suspense fallback={null}>
      <DesktopControls />
      <BlackSkySphere />

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
      {/* Primary XR button — uses AR mode to bypass Quest 3 boundary requirement */}
      <ARButton
        sessionInit={{
          optionalFeatures: ['hand-tracking', 'local-floor'],
          requiredFeatures: ['local'],
        }}
        onError={(err) => setXrError(err.message)}
        style={{
          position: 'absolute',
          bottom: 120,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 200,
          padding: '16px 40px',
          fontSize: 20,
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: '#fff',
          border: '2px solid rgba(255,255,255,0.3)',
          borderRadius: 16,
          cursor: 'pointer',
          boxShadow: '0 4px 24px rgba(99,102,241,0.5)',
          whiteSpace: 'nowrap',
        }}
      >
        {(status: string) =>
          status === 'unsupported'
            ? 'XR Not Supported'
            : status === 'entered'
            ? 'Exit Immersive'
            : '🥽 Enter Immersive Mode'
        }
      </ARButton>

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

      {/* R3F Canvas */}
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
        Open on Meta Quest 3 and tap "Enter Immersive Mode"
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
