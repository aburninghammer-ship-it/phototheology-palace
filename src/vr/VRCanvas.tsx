import React, { useState, Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { XR, VRButton, ARButton } from '@react-three/xr';
import { OrbitControls } from '@react-three/drei';
import { VRLobby, type VRExperience } from './VRLobby';

const SanctuaryWalk = React.lazy(() => import('./experiences/SanctuaryWalk'));
const GalleryCorridor = React.lazy(() => import('./experiences/GalleryCorridor'));
const SpatialAudioPlayer = React.lazy(() => import('./experiences/SpatialAudioPlayer'));
const HeavensDiary = React.lazy(() => import('./experiences/HeavensDiary'));

function VRScene() {
  const [currentExperience, setCurrentExperience] = useState<VRExperience>('lobby');
  const goToLobby = useCallback(() => setCurrentExperience('lobby'), []);

  return (
    <Suspense fallback={null}>
      {/* OrbitControls for desktop/mobile browser preview (drag to look around) */}
      <OrbitControls
        target={[0, 1, -3]}
        enablePan={false}
        enableZoom={true}
        minDistance={0.5}
        maxDistance={20}
        maxPolarAngle={Math.PI * 0.85}
      />

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
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* R3F Canvas — fills the parent div */}
      <Canvas
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: false }}
        camera={{ position: [0, 2.5, 4], fov: 75, near: 0.1, far: 200 }}
      >
        <XR>
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
