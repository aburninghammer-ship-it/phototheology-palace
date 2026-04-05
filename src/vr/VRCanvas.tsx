import React, { useState, Suspense, useCallback, useRef, useEffect, useMemo, Component, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { XR, VRButton, ARButton, useXR, Controllers, Hands, Interactive } from '@react-three/xr';
import { OrbitControls, Environment, Text } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ToneMapping, HueSaturation, BrightnessContrast } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import { BackSide } from 'three';
import * as THREE from 'three';
import { VRLobby, type VRExperience } from './VRLobby';

/** Silently swallow postprocessing crashes so the VR scene still renders */
class PostFXGuard extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(e: Error) { console.warn('[PostFX] disabled due to error:', e.message); }
  render() { return this.state.failed ? null : this.props.children; }
}

interface VRCanvasProps {
  initialExperience?: VRExperience;
  onBackToHub?: () => void;
}

const SanctuaryWalk = React.lazy(() => import('./experiences/SanctuaryWalk'));
const GalleryCorridor = React.lazy(() => import('./experiences/GalleryCorridor'));
const SpatialAudioPlayer = React.lazy(() => import('./experiences/SpatialAudioPlayer'));
const HeavensDiary = React.lazy(() => import('./experiences/HeavensDiary'));
const GameArcade = React.lazy(() => import('./experiences/GameArcade'));
const PalaceTour = React.lazy(() => import('./experiences/PalaceTour'));
const NightWatchVR = React.lazy(() => import('./experiences/NightWatchVR'));
const MorningWatchVR = React.lazy(() => import('./experiences/MorningWatchVR'));
const SwordOfTheSpirit = React.lazy(() => import('./experiences/SwordOfTheSpirit'));

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

/** Pulsing golden orb loading indicator */
function XRLoadingFallback() {
  const orbRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Points>(null);

  const particlePositions = React.useMemo(() => {
    const count = 30;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * 0.5;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = Math.sin(angle) * 0.5;
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (orbRef.current) {
      const s = 0.8 + Math.sin(t * 2) * 0.4;
      orbRef.current.scale.set(s, s, s);
    }
    if (ringRef.current) {
      ringRef.current.rotation.y = t * 0.5;
    }
  });

  return (
    <group position={[0, 1.5, -3]}>
      <mesh ref={orbRef}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Glow */}
      <mesh>
        <sphereGeometry args={[0.25, 12, 12]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.15} depthWrite={false} />
      </mesh>
      {/* Particle ring */}
      <points ref={ringRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={30} array={particlePositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.04} color="#FFD700" transparent opacity={0.6} depthWrite={false} sizeAttenuation />
      </points>
      <Suspense fallback={null}>
        <Text position={[0, -0.4, 0]} fontSize={0.08} color="#FFD700" anchorX="center">
          Loading...
        </Text>
      </Suspense>
    </group>
  );
}

/** Fade-to-black overlay that follows the camera */
function FadeOverlay({ fadeState }: { fadeState: 'idle' | 'out' | 'in' }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const opacityRef = useRef(0);
  const { camera } = useThree();

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Animate opacity
    if (fadeState === 'out') {
      opacityRef.current = Math.min(1, opacityRef.current + delta / 0.3);
    } else if (fadeState === 'in') {
      opacityRef.current = Math.max(0, opacityRef.current - delta / 0.3);
    }

    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = opacityRef.current;
    meshRef.current.visible = opacityRef.current > 0.001;

    // Follow camera
    meshRef.current.position.copy(camera.position);
    meshRef.current.quaternion.copy(camera.quaternion);
    meshRef.current.translateZ(-0.3);
  });

  return (
    <mesh ref={meshRef} renderOrder={9999}>
      <planeGeometry args={[4, 4]} />
      <meshBasicMaterial color="#000000" transparent opacity={0} depthTest={false} />
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

/** 3D reload button visible inside XR sessions — only appears when an update is available */
function VRReloadButton() {
  const { isPresenting } = useXR();
  const [hovered, setHovered] = useState(false);
  const [updateReady, setUpdateReady] = useState(false);

  useEffect(() => {
    if (!isPresenting) return;

    const checkBuildTag = async () => {
      try {
        const currentBuild = document.querySelector('meta[name="app-build"]')?.getAttribute('content');
        if (!currentBuild) return;

        const url = `${window.location.origin}/?__buildcheck=${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const html = await fetch(url, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache, no-store, max-age=0', Pragma: 'no-cache' },
        }).then(r => r.text());

        const match = html.match(/<meta\s+name=["']app-build["']\s+content=["']([^"']+)["']/i);
        if (match?.[1] && match[1] !== currentBuild) {
          setUpdateReady(true);
        }
      } catch { /* ignore */ }
    };

    checkBuildTag();
    const id = window.setInterval(checkBuildTag, 30_000);
    return () => window.clearInterval(id);
  }, [isPresenting]);

  if (!isPresenting || !updateReady) return null;

  return (
    <group position={[2, 2.8, -2]}>
      <Interactive
        onSelect={() => window.location.reload()}
        onHover={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        <mesh>
          <planeGeometry args={[0.6, 0.2]} />
          <meshBasicMaterial
            color={hovered ? '#22c55e' : '#1a7a3a'}
            transparent
            opacity={0.9}
          />
        </mesh>
      </Interactive>
      <mesh position={[0, 0, -0.001]}>
        <planeGeometry args={[0.64, 0.24]} />
        <meshBasicMaterial color={hovered ? '#4ade80' : '#166534'} transparent opacity={0.6} />
      </mesh>
      <Suspense fallback={null}>
        <Text
          position={[0, 0, 0.001]}
          fontSize={0.065}
          color="#fff"
          anchorX="center"
          anchorY="middle"
        >
          ↻ Update Ready
        </Text>
      </Suspense>
    </group>
  );
}

function VRScene({ initialExperience = 'lobby', onBackToHub }: { initialExperience?: VRExperience; onBackToHub?: () => void }) {
  const [currentExperience, setCurrentExperience] = useState<VRExperience>(initialExperience);
  const [displayedExperience, setDisplayedExperience] = useState<VRExperience>(initialExperience);
  const [fadeState, setFadeState] = useState<'idle' | 'out' | 'in'>('idle');
  const pendingExperience = useRef<VRExperience | null>(null);

  const handleExperienceChange = useCallback((next: VRExperience) => {
    if (fadeState !== 'idle') return;
    pendingExperience.current = next;
    setFadeState('out');

    // After fade-out, swap scene, then fade-in
    setTimeout(() => {
      setDisplayedExperience(next);
      setCurrentExperience(next);
      setFadeState('in');
      setTimeout(() => {
        setFadeState('idle');
      }, 350);
    }, 300);
  }, [fadeState]);

  const goToLobby = useCallback(() => {
    if (onBackToHub) {
      onBackToHub();
    } else {
      handleExperienceChange('lobby');
    }
  }, [handleExperienceChange, onBackToHub]);

  const grading = useMemo(() => {
    switch (displayedExperience) {
      case 'sanctuary': return { hue: 0.05, saturation: 0.15, contrast: 0.1 };
      case 'nightWatch': return { hue: -0.05, saturation: 0.08, contrast: 0.06 };
      case 'morningWatch': return { hue: 0.08, saturation: 0.15, contrast: 0.08 };
      default: return { hue: 0, saturation: 0.12, contrast: 0.08 };
    }
  }, [displayedExperience]);

  return (
    <>
      <DesktopControls />
      <Controllers rayMaterial={{ color: '#6366f1' }} />
      <Hands />
      <VRReloadButton />

      <XRSceneAnchor>
        <mesh renderOrder={-1}>
          <sphereGeometry args={[150, 32, 32]} />
          <meshBasicMaterial color="#060818" side={BackSide} depthWrite={false} />
        </mesh>

        <ambientLight intensity={0.2} color="#D4C5A0" />
        <Environment preset="night" background={false} environmentIntensity={0.6} />

        <Suspense fallback={<XRLoadingFallback />}>
          {displayedExperience === 'lobby' && (
            <VRLobby onEnterExperience={handleExperienceChange} />
          )}
          {displayedExperience === 'sanctuary' && <SanctuaryWalk onBack={goToLobby} />}
          {displayedExperience === 'gallery' && <GalleryCorridor onBack={goToLobby} />}
          {displayedExperience === 'audio' && <SpatialAudioPlayer onBack={goToLobby} />}
          {displayedExperience === 'heavensDiary' && <HeavensDiary onBack={goToLobby} />}
          {displayedExperience === 'arcade' && <GameArcade onBack={goToLobby} />}
          {displayedExperience === 'palace' && <PalaceTour onBack={goToLobby} />}
          {displayedExperience === 'nightWatch' && <NightWatchVR onBack={goToLobby} />}
          {displayedExperience === 'morningWatch' && <MorningWatchVR onBack={goToLobby} />}
          {displayedExperience === 'swordOfTheSpirit' && <SwordOfTheSpirit onBack={goToLobby} />}
        </Suspense>

        <FadeOverlay fadeState={fadeState} />
      </XRSceneAnchor>

      {/* Global post-processing — cinematic look; guarded so VR still works if it crashes */}
      <PostFXGuard>
        <EffectComposer multisampling={4}>
          <Bloom intensity={1.0} luminanceThreshold={0.35} luminanceSmoothing={0.9} mipmapBlur radius={0.85} />
          <BrightnessContrast brightness={0.03} contrast={grading.contrast + 0.06} />
          <HueSaturation hue={grading.hue} saturation={grading.saturation + 0.08} />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          <Vignette eskil={false} offset={0.2} darkness={0.8} />
        </EffectComposer>
      </PostFXGuard>
    </>
  );
}

export default function VRCanvas({ initialExperience, onBackToHub }: VRCanvasProps) {
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
        dpr={[1, 2]}
        shadows
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.NoToneMapping,
          shadowMap: { type: THREE.PCFSoftShadowMap },
        } as any}
        camera={{ position: [0, 1.6, 3], fov: 75, near: 0.1, far: 200 }}
      >
        <XR referenceSpace="local-floor" foveation={1} frameRate={72}>
          <VRScene initialExperience={initialExperience} onBackToHub={onBackToHub} />
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
