import { useRef, useMemo, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Interactive } from '@react-three/xr';
import * as THREE from 'three';
import { NebulaClouds } from '../components/NebulaClouds';
import { useStreamingAudio } from '../hooks/useStreamingAudio';

const AUDIO_SRC = '/audio/heavens-diary.m4a';

interface HeavensDiaryProps {
  onBack: () => void;
}

// Phase-based color palettes
function getPhaseColors(progress: number): {
  nebula: string[];
  ambient: string;
  fogColor: string;
  starBrightness: number;
} {
  if (progress < 0.2) {
    const t = progress / 0.2;
    return {
      nebula: ['#0044aa', '#002266', '#001144'],
      ambient: `#${Math.floor(0x22 * (1 - t)).toString(16).padStart(2, '0')}${Math.floor(0x44 * (1 - t)).toString(16).padStart(2, '0')}${Math.floor(0x88 * (1 - t)).toString(16).padStart(2, '0')}`,
      fogColor: '#000011',
      starBrightness: 0.3 + t * 0.7,
    };
  } else if (progress < 0.5) {
    return {
      nebula: ['#1a0044', '#003366', '#004422'],
      ambient: '#111122',
      fogColor: '#000008',
      starBrightness: 1,
    };
  } else if (progress < 0.8) {
    const t = (progress - 0.5) / 0.3;
    return {
      nebula: ['#660088', '#0066cc', '#cc4400', '#009944'],
      ambient: '#1a1133',
      fogColor: '#0a0818',
      starBrightness: 0.8 + t * 0.2,
    };
  } else {
    const t = (progress - 0.8) / 0.2;
    return {
      nebula: ['#FFD700', '#FFA500', '#FFEE88'],
      ambient: `#${Math.floor(0x33 + t * 0x44).toString(16).padStart(2, '0')}${Math.floor(0x22 + t * 0x33).toString(16).padStart(2, '0')}00`,
      fogColor: '#1a1100',
      starBrightness: 1 - t * 0.5,
    };
  }
}

// Compute travel speed from audio progress
function getSpeed(progress: number): number {
  if (progress < 0.05) return progress / 0.05 * 0.3; // ramp up
  if (progress < 0.2) return 0.3 + ((progress - 0.05) / 0.15) * 0.7; // accelerating
  if (progress < 0.5) return 1.0; // full warp
  if (progress < 0.8) return 0.8; // slight deceleration
  return 0.8 * (1 - (progress - 0.8) / 0.2); // fade to stop
}

// ─── WarpStars ────────────────────────────────────────────
const STAR_COUNT = 3000;
const CYLINDER_RADIUS = 30;
const CYLINDER_DEPTH = 100;

interface StarData {
  offsets: Float32Array;   // x, y, z per star
  baseSizes: Float32Array; // base scale per star
  colors: Float32Array;    // r, g, b per star
}

function initStarData(): StarData {
  const offsets = new Float32Array(STAR_COUNT * 3);
  const baseSizes = new Float32Array(STAR_COUNT);
  const colors = new Float32Array(STAR_COUNT * 3);
  for (let i = 0; i < STAR_COUNT; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = 2 + Math.random() * (CYLINDER_RADIUS - 2);
    offsets[i * 3] = Math.cos(angle) * r;
    offsets[i * 3 + 1] = Math.sin(angle) * r;
    offsets[i * 3 + 2] = -Math.random() * CYLINDER_DEPTH;
    baseSizes[i] = 0.02 + Math.random() * 0.06;
    // mostly white with slight color variation
    const warmth = Math.random();
    colors[i * 3] = 0.9 + warmth * 0.1;
    colors[i * 3 + 1] = 0.9 + warmth * 0.05;
    colors[i * 3 + 2] = 0.95 + Math.random() * 0.05;
  }
  return { offsets, baseSizes, colors };
}

function WarpStars({ progress, brightness }: { progress: number; brightness: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const starData = useMemo(() => initStarData(), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorObj = useMemo(() => new THREE.Color(), []);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const speed = getSpeed(progress);
    const zMove = speed * delta * 40; // world units per frame
    const { offsets, baseSizes, colors } = starData;

    for (let i = 0; i < STAR_COUNT; i++) {
      const i3 = i * 3;
      // Move toward user
      offsets[i3 + 2] += zMove;

      // Reset stars that passed behind user
      if (offsets[i3 + 2] > 10) {
        offsets[i3 + 2] = -CYLINDER_DEPTH + Math.random() * 5;
        const angle = Math.random() * Math.PI * 2;
        const r = 2 + Math.random() * (CYLINDER_RADIUS - 2);
        offsets[i3] = Math.cos(angle) * r;
        offsets[i3 + 1] = Math.sin(angle) * r;
      }

      dummy.position.set(offsets[i3], offsets[i3 + 1], offsets[i3 + 2]);
      // Elongate into streaks along z based on speed
      const streakZ = 1 + speed * 3;
      const s = baseSizes[i];
      dummy.scale.set(s, s, s * streakZ);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      // Tint during cosmic wonder phase (0.5-0.8)
      const cr = colors[i3];
      const cg = colors[i3 + 1];
      const cb = colors[i3 + 2];
      if (progress > 0.5 && progress < 0.8) {
        const t = (progress - 0.5) / 0.3;
        colorObj.setRGB(
          cr * (1 - t * 0.3) + t * 0.3,
          cg * (1 - t * 0.5),
          cb * (1 - t * 0.2) + t * 0.4,
        );
      } else if (progress >= 0.8) {
        // Golden tint during arrival
        const t = (progress - 0.8) / 0.2;
        colorObj.setRGB(cr, cg * (1 - t * 0.3), cb * (1 - t * 0.6));
      } else {
        colorObj.setRGB(cr, cg, cb);
      }
      mesh.setColorAt(i, colorObj);
    }

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

    // Fade opacity with arrival
    const mat = mesh.material as THREE.MeshBasicMaterial;
    mat.opacity = brightness * (progress >= 0.8 ? 1 - (progress - 0.8) / 0.2 : 1);
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, STAR_COUNT]}>
      <sphereGeometry args={[1, 4, 3]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}

// ─── CelestialBodies ──────────────────────────────────────
interface CelestialBody {
  name: string;
  triggerStart: number;
  triggerEnd: number;
  offsetX: number;
  offsetY: number;
  startZ: number;
  color: string;
  emissive: string;
  scale: number;
  type: 'sphere' | 'cluster' | 'plane' | 'binary';
}

const BODIES: CelestialBody[] = [
  { name: 'earth', triggerStart: 0.08, triggerEnd: 0.22, offsetX: -5, offsetY: -3, startZ: -60, color: '#2266cc', emissive: '#113366', scale: 3, type: 'sphere' },
  { name: 'moon', triggerStart: 0.2, triggerEnd: 0.32, offsetX: 6, offsetY: 2, startZ: -60, color: '#999999', emissive: '#444444', scale: 1, type: 'sphere' },
  { name: 'asteroids', triggerStart: 0.3, triggerEnd: 0.42, offsetX: -3, offsetY: 1, startZ: -60, color: '#665544', emissive: '#332211', scale: 0.5, type: 'cluster' },
  { name: 'gasGiant', triggerStart: 0.45, triggerEnd: 0.58, offsetX: 10, offsetY: -2, startZ: -70, color: '#cc8844', emissive: '#664422', scale: 6, type: 'sphere' },
  { name: 'nebulaWall', triggerStart: 0.6, triggerEnd: 0.72, offsetX: 0, offsetY: 0, startZ: -60, color: '#9933cc', emissive: '#6622aa', scale: 20, type: 'plane' },
  { name: 'binaryStars', triggerStart: 0.7, triggerEnd: 0.82, offsetX: -8, offsetY: 4, startZ: -65, color: '#ffcc44', emissive: '#ffaa22', scale: 1.5, type: 'binary' },
];

function CelestialBodies({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRefs = useRef<(THREE.Group | null)[]>(new Array(BODIES.length).fill(null));

  useFrame(() => {
    for (let i = 0; i < BODIES.length; i++) {
      const body = BODIES[i];
      const grp = bodyRefs.current[i];
      if (!grp) continue;

      const { triggerStart, triggerEnd } = body;
      if (progress < triggerStart || progress > triggerEnd) {
        grp.visible = false;
        continue;
      }

      grp.visible = true;
      const t = (progress - triggerStart) / (triggerEnd - triggerStart);
      // Move from startZ toward user and past
      const z = body.startZ + t * 80;
      grp.position.set(body.offsetX, body.offsetY, z);

      // Fade in / fade out
      const fade = t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1;
      grp.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
          if (mat.opacity !== undefined) {
            mat.opacity = fade;
            mat.transparent = true;
          }
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {BODIES.map((body, i) => (
        <group key={body.name} ref={(el) => { bodyRefs.current[i] = el; }} visible={false}>
          {body.type === 'sphere' && (
            <mesh>
              <sphereGeometry args={[body.scale, 16, 12]} />
              <meshStandardMaterial
                color={body.color}
                emissive={body.emissive}
                emissiveIntensity={0.5}
                transparent
              />
            </mesh>
          )}
          {body.type === 'cluster' && (
            <>
              {Array.from({ length: 12 }, (_, j) => {
                const a = (j / 12) * Math.PI * 2;
                const r = 1 + Math.random() * 3;
                return (
                  <mesh key={j} position={[Math.cos(a) * r, Math.sin(a) * r * 0.5, Math.sin(a + j) * 2]}>
                    <dodecahedronGeometry args={[body.scale * (0.5 + Math.random()), 0]} />
                    <meshStandardMaterial
                      color={body.color}
                      emissive={body.emissive}
                      emissiveIntensity={0.3}
                      transparent
                    />
                  </mesh>
                );
              })}
            </>
          )}
          {body.type === 'plane' && (
            <mesh>
              <planeGeometry args={[body.scale * 2, body.scale]} />
              <meshBasicMaterial
                color={body.color}
                transparent
                opacity={0.3}
                blending={THREE.AdditiveBlending}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
          )}
          {body.type === 'binary' && (
            <>
              <mesh position={[-2, 0, 0]}>
                <sphereGeometry args={[body.scale, 12, 8]} />
                <meshStandardMaterial
                  color={body.color}
                  emissive={body.emissive}
                  emissiveIntensity={1}
                  transparent
                />
              </mesh>
              <mesh position={[2, 0, 0]}>
                <sphereGeometry args={[body.scale * 0.7, 12, 8]} />
                <meshStandardMaterial
                  color="#88aaff"
                  emissive="#4466cc"
                  emissiveIntensity={1}
                  transparent
                />
              </mesh>
              <pointLight position={[0, 0, 0]} color={body.color} intensity={3} distance={20} />
            </>
          )}
        </group>
      ))}
    </group>
  );
}

// ─── SpeedLines ───────────────────────────────────────────
const SPEED_LINE_COUNT = 40;

function SpeedLines({ speed }: { speed: number }) {
  const groupRef = useRef<THREE.Group>(null);

  const lines = useMemo(() => {
    return Array.from({ length: SPEED_LINE_COUNT }, (_, i) => {
      const angle = (i / SPEED_LINE_COUNT) * Math.PI * 2;
      const radius = 1.8;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        angle,
      };
    });
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = speed * 0.6;
      }
    });
  });

  if (speed < 0.05) return null;

  return (
    <group ref={groupRef} position={[0, 0, -1]}>
      {lines.map((line, i) => (
        <mesh
          key={i}
          position={[line.x, line.y, -1]}
          rotation={[0, 0, line.angle]}
        >
          <cylinderGeometry args={[0.003, 0.003, 0.5 + speed * 1.5, 3]} />
          <meshBasicMaterial
            color="#aaccff"
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── CockpitPorthole ─────────────────────────────────────
function CockpitPorthole({ phaseColor }: { phaseColor: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.15 + Math.sin(clock.getElapsedTime() * 0.5) * 0.05;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -1.5]}>
      <torusGeometry args={[1.8, 0.06, 8, 48]} />
      <meshStandardMaterial
        color="#222233"
        emissive={phaseColor}
        emissiveIntensity={0.15}
        metalness={0.8}
        roughness={0.3}
      />
    </mesh>
  );
}

// ─── ProgressRing ─────────────────────────────────────────
function ProgressRing({ progress }: { progress: number }) {
  const geometry = useMemo(() => {
    return new THREE.RingGeometry(1.8, 1.85, 64, 1, 0, progress * Math.PI * 2);
  }, [progress]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <primitive object={geometry} attach="geometry" />
      <meshBasicMaterial color="#44FFEE" transparent opacity={0.4} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ─── GoldenLightTunnel ────────────────────────────────────
function GoldenLightTunnel({ intensity }: { intensity: number }) {
  if (intensity <= 0) return null;

  return (
    <group>
      <mesh position={[0, 0, -20]}>
        <sphereGeometry args={[3 + intensity * 5, 16, 16]} />
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={intensity * 0.3}
          side={THREE.BackSide}
        />
      </mesh>
      <pointLight position={[0, 0, -15]} color="#FFD700" intensity={intensity * 5} distance={40} />
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 4, Math.sin(angle) * 4, -25]}
            rotation={[0, 0, angle]}
          >
            <coneGeometry args={[0.5 + intensity * 2, 15, 4]} />
            <meshBasicMaterial
              color="#FFD700"
              transparent
              opacity={intensity * 0.1}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// ─── Main Component ───────────────────────────────────────
export default function HeavensDiary({ onBack }: HeavensDiaryProps) {
  const [audioState, audioControls] = useStreamingAudio(AUDIO_SRC);
  const sceneGroupRef = useRef<THREE.Group>(null);

  // Compute average volume from analyser
  const avgVolume = useMemo(() => {
    if (!audioState.analyserData) return 0;
    const sum = audioState.analyserData.reduce((a, b) => a + b, 0);
    return sum / audioState.analyserData.length / 255;
  }, [audioState.analyserData]);

  // Bass volume (low frequency bins) for camera shake
  const bassVolume = useMemo(() => {
    if (!audioState.analyserData || audioState.analyserData.length < 8) return 0;
    let sum = 0;
    for (let i = 0; i < 8; i++) sum += audioState.analyserData[i];
    return sum / 8 / 255;
  }, [audioState.analyserData]);

  const phase = getPhaseColors(audioState.progress);
  const speed = getSpeed(audioState.progress);
  const arrivalIntensity = audioState.progress > 0.8 ? (audioState.progress - 0.8) / 0.2 : 0;

  const phaseLabel = audioState.progress < 0.2
    ? 'Earth Departure'
    : audioState.progress < 0.5
      ? 'Deep Space'
      : audioState.progress < 0.8
        ? 'Cosmic Wonder'
        : 'Arrival';

  // Audio-reactive camera shake
  useFrame(({ clock }) => {
    if (!sceneGroupRef.current) return;
    const t = clock.getElapsedTime();
    const shakeX = Math.sin(t * 17) * bassVolume * 0.02 + Math.sin(t * 7) * avgVolume * 0.005;
    const shakeY = Math.cos(t * 13) * bassVolume * 0.015 + Math.cos(t * 11) * avgVolume * 0.004;
    sceneGroupRef.current.position.x = shakeX;
    sceneGroupRef.current.position.y = shakeY;
  });

  return (
    <group ref={sceneGroupRef}>
      {/* Dynamic ambient light */}
      <ambientLight intensity={0.1} color={phase.ambient} />

      {/* Warp star field */}
      <WarpStars
        progress={audioState.progress}
        brightness={phase.starBrightness * (1 + avgVolume * 0.3)}
      />

      {/* Nebula clouds — now with z-rush */}
      <NebulaClouds
        count={15}
        radius={35}
        colors={phase.nebula}
        opacity={0.1 + avgVolume * 0.15}
        zSpeed={speed * 15}
      />

      {/* Celestial bodies flying past */}
      <CelestialBodies progress={audioState.progress} />

      {/* Peripheral speed lines */}
      <SpeedLines speed={speed} />

      {/* Cockpit porthole frame */}
      <CockpitPorthole phaseColor={phase.nebula[0]} />

      {/* Golden light tunnel for arrival phase */}
      <GoldenLightTunnel intensity={arrivalIntensity} />

      {/* Earth departure atmosphere */}
      {audioState.progress < 0.25 && (
        <mesh position={[0, -20, 0]}>
          <sphereGeometry args={[15, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshBasicMaterial
            color="#2244aa"
            transparent
            opacity={0.3 * (1 - audioState.progress / 0.25)}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* Progress ring */}
      <ProgressRing progress={audioState.progress} />

      {/* Title */}
      <Text
        position={[0, 2.5, -3]}
        fontSize={0.25}
        color="#44FFEE"
        anchorX="center"
        outlineWidth={0.01}
        outlineColor="#000"
      >
        Heaven's Diary
      </Text>

      {/* Phase indicator */}
      <Text position={[0, 2.1, -3]} fontSize={0.1} color="#888" anchorX="center">
        {phaseLabel}
      </Text>

      {/* Play/Pause button */}
      <Interactive onSelect={audioControls.togglePlayPause}>
        <mesh position={[0, 1.5, -3]} onClick={audioControls.togglePlayPause}>
          <circleGeometry args={[0.15, 32]} />
          <meshStandardMaterial
            color={audioState.isPlaying ? '#FF4444' : '#44FF44'}
            emissive={audioState.isPlaying ? '#FF4444' : '#44FF44'}
            emissiveIntensity={0.5}
          />
        </mesh>
      </Interactive>
      <Text
        position={[0, 1.5, -2.98]}
        fontSize={0.08}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {audioState.isPlaying ? '⏸' : '▶'}
      </Text>

      {/* Time display */}
      <Text position={[0, 1.2, -3]} fontSize={0.06} color="#aaa" anchorX="center">
        {formatTime(audioState.currentTime)} / {formatTime(audioState.duration)}
      </Text>

      {/* Loading indicator */}
      {audioState.isLoading && (
        <Text position={[0, 1.0, -3]} fontSize={0.06} color="#FFD700" anchorX="center">
          Loading audio...
        </Text>
      )}

      {/* Back button */}
      <Interactive onSelect={onBack}>
        <mesh position={[0, 0.2, 2]} onClick={onBack}>
          <planeGeometry args={[1.5, 0.3]} />
          <meshBasicMaterial color="#331111" />
        </mesh>
      </Interactive>
      <Suspense fallback={null}>
        <Text position={[0, 0.2, 2.01]} fontSize={0.1} color="#FF6666" anchorX="center">
          ← Back to Lobby
        </Text>
      </Suspense>
    </group>
  );
}

function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
