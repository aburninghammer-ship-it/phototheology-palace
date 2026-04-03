import { useRef, useMemo, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Interactive } from '@react-three/xr';
import * as THREE from 'three';
import { NebulaClouds } from '../components/NebulaClouds';
import { useStreamingAudio } from '../hooks/useStreamingAudio';
import { getSoftCircleTexture, getNebulaBlobTexture } from '../utils/softTextures';
import { BackToLobbyButton } from '../components/BackToLobbyButton';

const AUDIO_SRC = '/audio/heavens-diary.m4a';

interface HeavensDiaryProps {
  onBack: () => void;
}

// Phase-based color palettes — much more vibrant
function getPhaseColors(progress: number): {
  nebula: string[];
  ambient: string;
  fogColor: string;
  starBrightness: number;
  accentColor: string;
} {
  if (progress < 0.2) {
    const t = progress / 0.2;
    return {
      nebula: ['#1144AA', '#2266CC', '#3388DD', '#FFD700'],
      ambient: '#1a1408',
      fogColor: '#050408',
      starBrightness: 0.4 + t * 0.6,
      accentColor: '#FFD700',
    };
  } else if (progress < 0.5) {
    return {
      nebula: ['#6600FF', '#FFD700', '#00CC88', '#FF4488'],
      ambient: '#161020',
      fogColor: '#080612',
      starBrightness: 1,
      accentColor: '#FFE088',
    };
  } else if (progress < 0.8) {
    return {
      nebula: ['#AA00FF', '#FF0088', '#FFD700', '#00FF88', '#0088FF'],
      ambient: '#221144',
      fogColor: '#0a0818',
      starBrightness: 0.8 + ((progress - 0.5) / 0.3) * 0.2,
      accentColor: '#FFCC66',
    };
  } else {
    const t = (progress - 0.8) / 0.2;
    return {
      nebula: ['#FFD700', '#FFA500', '#FFEE88', '#FFFFFF'],
      ambient: `#${Math.floor(0x44 + t * 0x44).toString(16).padStart(2, '0')}${Math.floor(0x33 + t * 0x44).toString(16).padStart(2, '0')}00`,
      fogColor: '#1a1100',
      starBrightness: 1 - t * 0.5,
      accentColor: '#FFD700',
    };
  }
}

// Compute travel speed from audio progress
function getSpeed(progress: number): number {
  if (progress < 0.05) return progress / 0.05 * 0.3;
  if (progress < 0.2) return 0.3 + ((progress - 0.05) / 0.15) * 0.7;
  if (progress < 0.5) return 1.0;
  if (progress < 0.8) return 0.8;
  return 0.8 * (1 - (progress - 0.8) / 0.2);
}

// ─── WarpStars ────────────────────────────────────────────
const STAR_COUNT = 4000;
const CYLINDER_RADIUS = 35;
const CYLINDER_DEPTH = 120;

interface StarData {
  offsets: Float32Array;
  baseSizes: Float32Array;
  colors: Float32Array;
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
    baseSizes[i] = 0.02 + Math.random() * 0.08;
    // Varied star colors — warm golden palette dominant
    const type = Math.random();
    if (type < 0.35) {
      // Warm gold
      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = 0.82 + Math.random() * 0.18;
      colors[i * 3 + 2] = 0.3 + Math.random() * 0.4;
    } else if (type < 0.55) {
      // Blue-white
      colors[i * 3] = 0.7 + Math.random() * 0.2;
      colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
      colors[i * 3 + 2] = 1.0;
    } else if (type < 0.7) {
      // Amber/orange
      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = 0.65 + Math.random() * 0.2;
      colors[i * 3 + 2] = 0.2 + Math.random() * 0.2;
    } else {
      // White-gold with slight variation
      const warmth = Math.random();
      colors[i * 3] = 0.95 + warmth * 0.05;
      colors[i * 3 + 1] = 0.88 + warmth * 0.08;
      colors[i * 3 + 2] = 0.7 + Math.random() * 0.2;
    }
  }
  return { offsets, baseSizes, colors };
}

function WarpStars({ progress, brightness }: { progress: number; brightness: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const starData = useMemo(() => initStarData(), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorObj = useMemo(() => new THREE.Color(), []);
  const starMap = useMemo(() => getSoftCircleTexture(), []);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const speed = getSpeed(progress);
    const zMove = speed * delta * 45;
    const { offsets, baseSizes, colors } = starData;

    for (let i = 0; i < STAR_COUNT; i++) {
      const i3 = i * 3;
      offsets[i3 + 2] += zMove;

      if (offsets[i3 + 2] > 10) {
        offsets[i3 + 2] = -CYLINDER_DEPTH + Math.random() * 5;
        const angle = Math.random() * Math.PI * 2;
        const r = 2 + Math.random() * (CYLINDER_RADIUS - 2);
        offsets[i3] = Math.cos(angle) * r;
        offsets[i3 + 1] = Math.sin(angle) * r;
      }

      dummy.position.set(offsets[i3], offsets[i3 + 1], offsets[i3 + 2]);
      const streakZ = 1 + speed * 4;
      const s = baseSizes[i];
      dummy.scale.set(s, s, s * streakZ);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      // Phase-based color tinting
      const cr = colors[i3], cg = colors[i3 + 1], cb = colors[i3 + 2];
      if (progress > 0.5 && progress < 0.8) {
        const t = (progress - 0.5) / 0.3;
        colorObj.setRGB(
          cr * (1 - t * 0.2) + t * 0.4,
          cg * (1 - t * 0.3),
          cb * (1 - t * 0.1) + t * 0.5,
        );
      } else if (progress >= 0.8) {
        const t = (progress - 0.8) / 0.2;
        colorObj.setRGB(
          cr * (1 - t * 0.2) + t * 0.8,
          cg * (1 - t * 0.1) + t * 0.5,
          cb * (1 - t * 0.5),
        );
      } else {
        colorObj.setRGB(cr, cg, cb);
      }
      mesh.setColorAt(i, colorObj);
    }

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

    const mat = mesh.material as THREE.MeshBasicMaterial;
    mat.opacity = brightness * (progress >= 0.8 ? 1 - (progress - 0.8) / 0.2 : 1);
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, STAR_COUNT]}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial
        map={starMap}
        color="#ffffff"
        transparent
        opacity={0.9}
        alphaTest={0.02}
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
  type: 'sphere' | 'cluster' | 'plane' | 'binary' | 'ringedPlanet';
}

const BODIES: CelestialBody[] = [
  // Earth — vibrant blue-green with atmosphere glow
  { name: 'earth', triggerStart: 0.08, triggerEnd: 0.22, offsetX: -5, offsetY: -3, startZ: -60, color: '#2288EE', emissive: '#1166CC', scale: 3, type: 'sphere' },
  // Moon — silvery with craters implied
  { name: 'moon', triggerStart: 0.2, triggerEnd: 0.32, offsetX: 6, offsetY: 2, startZ: -60, color: '#CCCCCC', emissive: '#888888', scale: 1, type: 'sphere' },
  // Asteroids — colorful rocky debris
  { name: 'asteroids', triggerStart: 0.3, triggerEnd: 0.42, offsetX: -3, offsetY: 1, startZ: -60, color: '#AA8866', emissive: '#665544', scale: 0.5, type: 'cluster' },
  // Gas Giant — vibrant orange/red banded planet with ring
  { name: 'gasGiant', triggerStart: 0.45, triggerEnd: 0.58, offsetX: 10, offsetY: -2, startZ: -70, color: '#FF8844', emissive: '#CC6622', scale: 6, type: 'ringedPlanet' },
  // Nebula Wall — vivid purple/magenta/cyan
  { name: 'nebulaWall', triggerStart: 0.6, triggerEnd: 0.72, offsetX: 0, offsetY: 0, startZ: -60, color: '#CC44FF', emissive: '#8822CC', scale: 25, type: 'plane' },
  // Binary Stars — bright blue and gold
  { name: 'binaryStars', triggerStart: 0.7, triggerEnd: 0.82, offsetX: -8, offsetY: 4, startZ: -65, color: '#FFD700', emissive: '#FFAA00', scale: 1.5, type: 'binary' },
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
      const z = body.startZ + t * 80;
      grp.position.set(body.offsetX, body.offsetY, z);

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
            <>
              <mesh>
                <sphereGeometry args={[body.scale, 24, 16]} />
                <meshStandardMaterial
                  color={body.color}
                  emissive={body.emissive}
                  emissiveIntensity={0.6}
                  transparent
                  metalness={0.1}
                  roughness={0.7}
                />
              </mesh>
              {/* Atmosphere glow */}
              <mesh>
                <sphereGeometry args={[body.scale * 1.15, 16, 12]} />
                <meshBasicMaterial
                  color={body.color}
                  transparent
                  opacity={0.12}
                  side={THREE.BackSide}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </mesh>
              <pointLight color={body.emissive} intensity={0.5} distance={body.scale * 4} />
            </>
          )}
          {body.type === 'ringedPlanet' && (
            <>
              <mesh>
                <sphereGeometry args={[body.scale, 24, 16]} />
                <meshStandardMaterial
                  color={body.color}
                  emissive={body.emissive}
                  emissiveIntensity={0.4}
                  transparent
                  metalness={0.1}
                  roughness={0.6}
                />
              </mesh>
              {/* Planet ring */}
              <mesh rotation={[Math.PI * 0.35, 0, 0]}>
                <ringGeometry args={[body.scale * 1.3, body.scale * 2, 64]} />
                <meshBasicMaterial
                  color="#FFCC88"
                  transparent
                  opacity={0.4}
                  side={THREE.DoubleSide}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </mesh>
              {/* Inner ring */}
              <mesh rotation={[Math.PI * 0.35, 0, 0]}>
                <ringGeometry args={[body.scale * 1.1, body.scale * 1.3, 64]} />
                <meshBasicMaterial
                  color="#CC8844"
                  transparent
                  opacity={0.25}
                  side={THREE.DoubleSide}
                  depthWrite={false}
                />
              </mesh>
              <pointLight color={body.emissive} intensity={1} distance={20} />
            </>
          )}
          {body.type === 'cluster' && (
            <>
              {Array.from({ length: 18 }, (_, j) => {
                const a = (j / 18) * Math.PI * 2;
                const r = 1 + Math.random() * 4;
                const rockColor = ['#AA7744', '#887766', '#BB9955', '#776655'][j % 4];
                return (
                  <mesh key={j} position={[Math.cos(a) * r, Math.sin(a) * r * 0.5, Math.sin(a + j) * 2]}>
                    <dodecahedronGeometry args={[body.scale * (0.3 + Math.random() * 0.8), 0]} />
                    <meshStandardMaterial
                      color={rockColor}
                      emissive={body.emissive}
                      emissiveIntensity={0.2}
                      transparent
                      roughness={0.9}
                    />
                  </mesh>
                );
              })}
            </>
          )}
          {body.type === 'plane' && (
            <>
              {/* Soft nebula cloud layers instead of flat squares */}
              {[
                { pos: [0, 0, 0] as [number, number, number], color: '#CC44FF', s: body.scale * 1.8, o: 0.2 },
                { pos: [3, 2, 2] as [number, number, number], color: '#FF44AA', s: body.scale * 1.4, o: 0.15 },
                { pos: [-4, -1, -1] as [number, number, number], color: '#44CCFF', s: body.scale * 1.0, o: 0.12 },
                { pos: [2, -2, 3] as [number, number, number], color: '#8844FF', s: body.scale * 1.2, o: 0.1 },
                { pos: [-2, 3, -2] as [number, number, number], color: '#FF88CC', s: body.scale * 0.9, o: 0.1 },
              ].map((layer, li) => (
                <mesh key={li} position={layer.pos}>
                  <planeGeometry args={[layer.s, layer.s]} />
                  <meshBasicMaterial
                    map={getNebulaBlobTexture()}
                    color={layer.color}
                    transparent
                    opacity={layer.o}
                    blending={THREE.AdditiveBlending}
                    side={THREE.DoubleSide}
                    depthWrite={false}
                  />
                </mesh>
              ))}
              <pointLight color="#CC44FF" intensity={2} distance={30} />
            </>
          )}
          {body.type === 'binary' && (
            <>
              <mesh position={[-2, 0, 0]}>
                <sphereGeometry args={[body.scale, 16, 12]} />
                <meshStandardMaterial color="#FFD700" emissive="#FFAA00" emissiveIntensity={1.5} transparent />
              </mesh>
              {/* Sun corona */}
              <mesh position={[-2, 0, 0]}>
                <sphereGeometry args={[body.scale * 1.8, 12, 8]} />
                <meshBasicMaterial color="#FFD700" transparent opacity={0.08} blending={THREE.AdditiveBlending} depthWrite={false} />
              </mesh>
              <mesh position={[2, 0, 0]}>
                <sphereGeometry args={[body.scale * 0.7, 16, 12]} />
                <meshStandardMaterial color="#88CCFF" emissive="#44AAFF" emissiveIntensity={1.5} transparent />
              </mesh>
              <mesh position={[2, 0, 0]}>
                <sphereGeometry args={[body.scale * 1.2, 12, 8]} />
                <meshBasicMaterial color="#88CCFF" transparent opacity={0.06} blending={THREE.AdditiveBlending} depthWrite={false} />
              </mesh>
              <pointLight position={[-2, 0, 0]} color="#FFD700" intensity={4} distance={25} />
              <pointLight position={[2, 0, 0]} color="#88CCFF" intensity={3} distance={20} />
            </>
          )}
        </group>
      ))}
    </group>
  );
}

// ─── SpeedLines ───────────────────────────────────────────
const SPEED_LINE_COUNT = 50;

function SpeedLines({ speed }: { speed: number }) {
  const groupRef = useRef<THREE.Group>(null);

  const lines = useMemo(() => {
    return Array.from({ length: SPEED_LINE_COUNT }, (_, i) => {
      const angle = (i / SPEED_LINE_COUNT) * Math.PI * 2;
      const radius = 1.8;
      const colorIdx = i % 3;
      const color = colorIdx === 0 ? '#aaccff' : colorIdx === 1 ? '#ffaacc' : '#aaffcc';
      return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, angle, color };
    });
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = speed * 0.7;
      }
    });
  });

  if (speed < 0.05) return null;

  return (
    <group ref={groupRef} position={[0, 0, -1]}>
      {lines.map((line, i) => (
        <mesh key={i} position={[line.x, line.y, -1]} rotation={[0, 0, line.angle]}>
          <cylinderGeometry args={[0.004, 0.004, 0.5 + speed * 2, 3]} />
          <meshBasicMaterial color={line.color} transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
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
    mat.emissiveIntensity = 0.2 + Math.sin(clock.getElapsedTime() * 0.5) * 0.08;
  });

  return (
    <>
      <mesh ref={meshRef} position={[0, 0, -1.5]}>
        <torusGeometry args={[1.8, 0.1, 16, 64]} />
        <meshPhysicalMaterial
          color="#8B7535"
          emissive={phaseColor}
          emissiveIntensity={0.2}
          metalness={0.92}
          roughness={0.08}
          clearcoat={0.8}
          clearcoatRoughness={0.05}
        />
      </mesh>
      {/* Inner glow ring — golden */}
      <mesh position={[0, 0, -1.48]}>
        <torusGeometry args={[1.72, 0.025, 8, 48]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* Outer decorative ring */}
      <mesh position={[0, 0, -1.52]}>
        <torusGeometry args={[1.88, 0.02, 8, 48]} />
        <meshStandardMaterial
          color="#A08830"
          emissive="#FFD700"
          emissiveIntensity={0.4}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.6}
        />
      </mesh>
    </>
  );
}

// ─── ProgressRing ─────────────────────────────────────────
function ProgressRing({ progress, color }: { progress: number; color: string }) {
  const geometry = useMemo(() => {
    return new THREE.RingGeometry(1.8, 1.88, 64, 1, 0, progress * Math.PI * 2);
  }, [progress]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <primitive object={geometry} attach="geometry" />
      <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

// ─── GoldenLightTunnel ────────────────────────────────────
function GoldenLightTunnel({ intensity }: { intensity: number }) {
  if (intensity <= 0) return null;

  return (
    <group>
      {/* Central golden sun */}
      <mesh position={[0, 0, -20]}>
        <sphereGeometry args={[3 + intensity * 6, 24, 24]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={intensity * 0.4} side={THREE.BackSide} />
      </mesh>
      {/* Bright corona */}
      <mesh position={[0, 0, -18]}>
        <sphereGeometry args={[5 + intensity * 10, 16, 16]} />
        <meshBasicMaterial color="#FFEE88" transparent opacity={intensity * 0.12} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <pointLight position={[0, 0, -15]} color="#FFD700" intensity={intensity * 8} distance={50} />
      <pointLight position={[0, 0, -10]} color="#FFEE88" intensity={intensity * 3} distance={30} />
      {/* Light rays */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 5, Math.sin(angle) * 5, -25]} rotation={[0, 0, angle]}>
            <coneGeometry args={[0.8 + intensity * 3, 20, 4]} />
            <meshBasicMaterial color="#FFD700" transparent opacity={intensity * 0.12} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
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

  const avgVolume = useMemo(() => {
    if (!audioState.analyserData) return 0;
    const sum = audioState.analyserData.reduce((a, b) => a + b, 0);
    return sum / audioState.analyserData.length / 255;
  }, [audioState.analyserData]);

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
    const shakeX = Math.sin(t * 17) * bassVolume * 0.025 + Math.sin(t * 7) * avgVolume * 0.006;
    const shakeY = Math.cos(t * 13) * bassVolume * 0.018 + Math.cos(t * 11) * avgVolume * 0.005;
    sceneGroupRef.current.position.x = shakeX;
    sceneGroupRef.current.position.y = shakeY;
  });

  return (
    <group ref={sceneGroupRef}>
      {/* Dynamic ambient light — warm golden base */}
      <ambientLight intensity={0.35} color={phase.ambient} />

      {/* Directional fill — warm golden */}
      <directionalLight position={[0, 5, -10]} intensity={0.4} color="#FFE4B0" />

      {/* Phase-reactive accent lights — golden warmth */}
      <pointLight position={[-5, 3, -5]} color={phase.accentColor} intensity={1.5 + avgVolume * 0.8} distance={25} />
      <pointLight position={[5, 3, -5]} color={phase.nebula[1] || phase.accentColor} intensity={1.0 + avgVolume * 0.6} distance={20} />
      <pointLight position={[0, -2, -10]} color="#FFD700" intensity={0.6} distance={20} />

      {/* Warp star field — more stars, more color */}
      <WarpStars
        progress={audioState.progress}
        brightness={phase.starBrightness * (1 + avgVolume * 0.4)}
      />

      {/* Nebula clouds — more, brighter */}
      <NebulaClouds
        count={20}
        radius={40}
        colors={phase.nebula}
        opacity={0.15 + avgVolume * 0.2}
        zSpeed={speed * 18}
      />

      {/* Celestial bodies flying past */}
      <CelestialBodies progress={audioState.progress} />

      {/* Peripheral speed lines — with color variety */}
      <SpeedLines speed={speed} />


      {/* Golden light tunnel for arrival phase */}
      <GoldenLightTunnel intensity={arrivalIntensity} />

      {/* Earth departure atmosphere — vivid blue */}
      {audioState.progress < 0.25 && (
        <>
          <mesh position={[0, -20, 0]}>
            <sphereGeometry args={[15, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshBasicMaterial
              color="#3366FF"
              transparent
              opacity={0.35 * (1 - audioState.progress / 0.25)}
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </>
      )}


      {/* Fog for depth */}
      <fog attach="fog" args={[phase.fogColor, 15, 60]} />

      {/* Title */}
      <Text
        position={[0, 2.5, -3]}
        fontSize={0.25}
        color={phase.accentColor}
        anchorX="center"
        outlineWidth={0.012}
        outlineColor="#000"
      >
        Heaven's Diary
      </Text>

      {/* Phase indicator */}
      <Text position={[0, 2.1, -3]} fontSize={0.1} color="#AAAACC" anchorX="center">
        {phaseLabel}
      </Text>

      {/* Play/Pause button */}
      <Interactive onSelect={audioControls.togglePlayPause}>
        <mesh position={[0, 1.5, -3]} onClick={audioControls.togglePlayPause} onPointerDown={audioControls.togglePlayPause}>
          <circleGeometry args={[0.18, 32]} />
          <meshStandardMaterial
            color={audioState.isPlaying ? '#FF4444' : '#44FF44'}
            emissive={audioState.isPlaying ? '#FF4444' : '#44FF44'}
            emissiveIntensity={0.8}
          />
        </mesh>
      </Interactive>
      <Text position={[0, 1.5, -2.98]} fontSize={0.1} color="white" anchorX="center" anchorY="middle">
        {audioState.isPlaying ? '⏸' : '▶'}
      </Text>

      {/* Time display */}
      <Text position={[0, 1.2, -3]} fontSize={0.07} color="#CCCCEE" anchorX="center">
        {formatTime(audioState.currentTime)} / {formatTime(audioState.duration)}
        {audioState.isLoading ? '  Loading...' : ''}
      </Text>

      {/* Back button */}
      <BackToLobbyButton onBack={onBack} position={[0, 0.2, -1.5]} />
    </group>
  );
}

function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
