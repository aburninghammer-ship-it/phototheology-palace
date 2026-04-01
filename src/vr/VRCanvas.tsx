import React, { useState, Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { XR, VRButton, ARButton, useXR, Controllers, Hands } from '@react-three/xr';
import { OrbitControls, Environment } from '@react-three/drei';
import { BackSide } from 'three';
import { VRLobby, type VRExperience } from './VRLobby';

const SanctuaryWalk = React.lazy(() => import('./experiences/SanctuaryWalk'));
const GalleryCorridor = React.lazy(() => import('./experiences/GalleryCorridor'));
const SpatialAudioPlayer = React.lazy(() => import('./experiences/SpatialAudioPlayer'));
const HeavensDiary = React.lazy(() => import('./experiences/HeavensDiary'));
const GameArcade = React.lazy(() => import('./experiences/GameArcade'));

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

/** Loading indicator visible inside XR while lazy experiences load */
function XRLoadingFallback() {
  return (
    <mesh position={[0, 1.5, -3]}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshBasicMaterial color="#6366f1" wireframe />
    </mesh>
  );
}

/**
 * In XR, the headset becomes the active camera at the scene origin.
 * Shift the entire hub forward so Quest users spawn with the PT OS lobby in front of them
 * instead of inside the desktop-authored layout.
 */
function XRSceneAnchor({ children }: { children: React.ReactNode }) {
  const { isPresenting } = useXR();
  const sceneOffset: [number, number, number] = isPresenting ? [0, 0, -1.5] : [0, 0, 0];

  return <group position={sceneOffset}>{children}</group>;
}

function VRScene() {
  const [currentExperience, setCurrentExperience] = useState<VRExperience>('lobby');
  const goToLobby = useCallback(() => setCurrentExperience('lobby'), []);

  return (
    <>
      <DesktopControls />
      <Controllers rayMaterial={{ color: '#6366f1' }} />
      <Hands />

      <XRSceneAnchor>
        {/*
          Opaque black sky sphere — blocks AR passthrough in immersive mode.
          Always rendered so it serves as the scene background both on desktop and in XR.
          Uses meshBasicMaterial (no lighting needed) with BackSide rendering.
        */}
        <mesh renderOrder={-1}>
          <sphereGeometry args={[150, 32, 32]} />
          <meshBasicMaterial color="#0a0a15" side={BackSide} depthWrite={false} />
        </mesh>

        {/* Basic ambient light always on so geometry is visible even if Suspense is pending */}
        <ambientLight intensity={0.5} />

        <Suspense fallback={<XRLoadingFallback />}>
          {currentExperience === 'lobby' && (
            <VRLobby onEnterExperience={setCurrentExperience} />
          )}
          {currentExperience === 'sanctuary' && <SanctuaryWalk onBack={goToLobby} />}
          {currentExperience === 'gallery' && <GalleryCorridor onBack={goToLobby} />}
          {currentExperience === 'audio' && <SpatialAudioPlayer onBack={goToLobby} />}
          {currentExperience === 'heavensDiary' && <HeavensDiary onBack={goToLobby} />}
          {currentExperience === 'arcade' && <GameArcade onBack={goToLobby} />}
        </Suspense>
      </XRSceneAnchor>
    </>
  );
}

export default function VRCanvas() {
  const [xrError, setXrError] = useState<string | null>(null);

  const xrButtonStyle: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 200,
    padding: '16px 40px',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: 16,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Primary: VR mode — Quest 3's native immersive-vr */}
      <VRButton
        sessionInit={{
          optionalFeatures: ['hand-tracking', 'local-floor', 'bounded-floor'],
          requiredFeatures: ['local'],
        }}
        onError={(err) => {
          console.error('[VR] VR session error:', err.message);
          setXrError(err.message);
        }}
        style={{
          ...xrButtonStyle,
          bottom: 120,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          boxShadow: '0 4px 24px rgba(99,102,241,0.5)',
        }}
      >
        {(status: string) =>
          status === 'unsupported'
            ? 'VR Not Supported'
            : status === 'entered'
            ? 'Exit Immersive'
            : '🥽 Enter VR Mode'
        }
      </VRButton>

      {/* Fallback: AR mode — for passthrough / boundary-free entry */}
      <ARButton
        sessionInit={{
          optionalFeatures: ['hand-tracking', 'local-floor'],
          requiredFeatures: ['local'],
        }}
        onError={(err) => {
          console.error('[VR] AR session error:', err.message);
          setXrError(err.message);
        }}
        style={{
          ...xrButtonStyle,
          bottom: 60,
          background: 'linear-gradient(135deg, #059669, #10b981)',
          boxShadow: '0 4px 24px rgba(16,185,129,0.4)',
          fontSize: 16,
          padding: '12px 28px',
        }}
      >
        {(status: string) =>
          status === 'unsupported'
            ? 'AR Not Supported'
            : status === 'entered'
            ? 'Exit AR'
            : '📱 Enter AR Passthrough'
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

      {/* R3F Canvas — alpha:true required for AR compositor to show our rendered content */}
      <Canvas
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 1.6, 3], fov: 75, near: 0.1, far: 200 }}
      >
        <XR referenceSpace="local-floor" foveation={1} frameRate={72}>
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
