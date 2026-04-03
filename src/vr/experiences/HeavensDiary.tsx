import { useRef, useMemo, useState } from 'react';
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

// ─── Tour Scenes ──────────────────────────────────────────
interface TourScene {
  id: string;
  label: string;
  subtitle: string;
  start: number;  // progress 0-1
  end: number;
  colors: { nebula: string[]; ambient: string; fog: string; accent: string };
  cameraPath: (t: number) => { x: number; y: number; z: number };
  particleColor: string;
  lightIntensity: number;
}

const TOUR_SCENES: TourScene[] = [
  {
    id: 'creation',
    label: 'In the Beginning',
    subtitle: 'Genesis 1:1 — God created the heavens and the earth',
    start: 0, end: 0.15,
    colors: { nebula: ['#0022AA', '#1144CC', '#003388', '#FFD700'], ambient: '#080818', fog: '#020210', accent: '#4488FF' },
    cameraPath: (t) => ({ x: Math.sin(t * Math.PI * 2) * 3, y: t * 4 - 2, z: -5 - t * 20 }),
    particleColor: '#4488FF',
    lightIntensity: 0.8,
  },
  {
    id: 'garden',
    label: 'The Garden',
    subtitle: 'Genesis 2:8 — God planted a garden eastward in Eden',
    start: 0.15, end: 0.30,
    colors: { nebula: ['#11AA44', '#88FF44', '#FFD700', '#22CC66'], ambient: '#0a1a08', fog: '#040a04', accent: '#44FF88' },
    cameraPath: (t) => ({ x: Math.sin(t * Math.PI * 4) * 5, y: 1 + Math.sin(t * Math.PI * 2) * 2, z: -10 - t * 15 }),
    particleColor: '#88FF44',
    lightIntensity: 1.2,
  },
  {
    id: 'cross',
    label: 'The Cross',
    subtitle: 'John 19:30 — It is finished',
    start: 0.30, end: 0.45,
    colors: { nebula: ['#880022', '#CC0044', '#FF4400', '#FFD700'], ambient: '#1a0808', fog: '#0a0404', accent: '#FF4444' },
    cameraPath: (t) => ({ x: Math.cos(t * Math.PI) * 2, y: -1 + t * 6, z: -8 - t * 10 }),
    particleColor: '#FF4444',
    lightIntensity: 0.6,
  },
  {
    id: 'resurrection',
    label: 'He Is Risen',
    subtitle: 'Matthew 28:6 — He is not here: for He is risen',
    start: 0.45, end: 0.60,
    colors: { nebula: ['#FFD700', '#FFFFFF', '#FFEE88', '#FFB700'], ambient: '#2a2200', fog: '#1a1100', accent: '#FFD700' },
    cameraPath: (t) => ({ x: Math.sin(t * Math.PI * 3) * 4, y: 2 + t * 5, z: -5 - t * 25 }),
    particleColor: '#FFD700',
    lightIntensity: 2.0,
  },
  {
    id: 'throne',
    label: 'The Throne Room',
    subtitle: 'Revelation 4:2 — A throne was set in heaven',
    start: 0.60, end: 0.80,
    colors: { nebula: ['#AA00FF', '#FFD700', '#FF44AA', '#0088FF'], ambient: '#180830', fog: '#0a0418', accent: '#CC88FF' },
    cameraPath: (t) => ({ x: Math.sin(t * Math.PI * 6) * 6, y: Math.sin(t * Math.PI * 3) * 3, z: -15 - t * 20 }),
    particleColor: '#CC88FF',
    lightIntensity: 1.5,
  },
  {
    id: 'newJerusalem',
    label: 'The Holy City',
    subtitle: 'Revelation 21:2 — New Jerusalem, coming down from God',
    start: 0.80, end: 1.0,
    colors: { nebula: ['#FFD700', '#FFEE88', '#FFFFFF', '#FFB700'], ambient: '#332800', fog: '#1a1400', accent: '#FFD700' },
    cameraPath: (t) => ({ x: 0, y: t * 8, z: -5 - t * 15 }),
    particleColor: '#FFD700',
    lightIntensity: 3.0,
  },
];

function getCurrentScene(progress: number): TourScene {
  for (const scene of TOUR_SCENES) {
    if (progress >= scene.start && progress < scene.end) return scene;
  }
  return TOUR_SCENES[TOUR_SCENES.length - 1];
}

function getSceneLocalProgress(progress: number, scene: TourScene): number {
  return Math.max(0, Math.min(1, (progress - scene.start) / (scene.end - scene.start)));
}

// ─── WarpStars ────────────────────────────────────────────
const STAR_COUNT = 5000;
const CYLINDER_RADIUS = 40;
const CYLINDER_DEPTH = 140;

function initStarData() {
  const offsets = new Float32Array(STAR_COUNT * 3);
  const baseSizes = new Float32Array(STAR_COUNT);
  const colors = new Float32Array(STAR_COUNT * 3);
  for (let i = 0; i < STAR_COUNT; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = 2 + Math.random() * (CYLINDER_RADIUS - 2);
    offsets[i * 3] = Math.cos(angle) * r;
    offsets[i * 3 + 1] = Math.sin(angle) * r;
    offsets[i * 3 + 2] = -Math.random() * CYLINDER_DEPTH;
    baseSizes[i] = 0.02 + Math.random() * 0.1;
    const type = Math.random();
    if (type < 0.4) {
      colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.85 + Math.random() * 0.15; colors[i * 3 + 2] = 0.3 + Math.random() * 0.4;
    } else if (type < 0.6) {
      colors[i * 3] = 0.7 + Math.random() * 0.2; colors[i * 3 + 1] = 0.8 + Math.random() * 0.2; colors[i * 3 + 2] = 1.0;
    } else if (type < 0.75) {
      colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.6 + Math.random() * 0.2; colors[i * 3 + 2] = 0.2 + Math.random() * 0.2;
    } else {
      colors[i * 3] = 0.95; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 0.8;
    }
  }
  return { offsets, baseSizes, colors };
}

function WarpStars({ progress, scene, avgVolume }: { progress: number; scene: TourScene; avgVolume: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const starData = useMemo(() => initStarData(), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorObj = useMemo(() => new THREE.Color(), []);
  const starMap = useMemo(() => getSoftCircleTexture(), []);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const localT = getSceneLocalProgress(progress, scene);
    const speed = 0.3 + localT * 0.7 + avgVolume * 0.3;
    const zMove = speed * delta * 50;
    const { offsets, baseSizes, colors } = starData;
    const tintColor = new THREE.Color(scene.particleColor);

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
      const streakZ = 1 + speed * 3;
      const s = baseSizes[i] * (1 + avgVolume * 0.5);
      dummy.scale.set(s, s, s * streakZ);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      // Tint stars with scene color
      colorObj.setRGB(
        colors[i3] * 0.6 + tintColor.r * 0.4,
        colors[i3 + 1] * 0.6 + tintColor.g * 0.4,
        colors[i3 + 2] * 0.6 + tintColor.b * 0.4,
      );
      mesh.setColorAt(i, colorObj);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, STAR_COUNT]}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial map={starMap} color="#ffffff" transparent opacity={0.9} alphaTest={0.02} depthWrite={false} blending={THREE.AdditiveBlending} />
    </instancedMesh>
  );
}

// ─── Scene-Specific Geometry ─────────────────────────────

function CreationScene({ localT, avgVolume }: { localT: number; avgVolume: number }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.05) * 0.1;
  });

  return (
    <group ref={groupRef} position={[0, 0, -30]}>
      {/* Swirling proto-matter */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const r = 8 + i * 0.5;
        return (
          <mesh key={i} position={[Math.cos(angle) * r, Math.sin(angle) * r * 0.3, Math.sin(angle) * 3]}>
            <sphereGeometry args={[0.5 + Math.random() * 1.5, 12, 8]} />
            <meshStandardMaterial
              color={['#4488FF', '#2266CC', '#FFD700', '#6644AA'][i % 4]}
              emissive={['#2244AA', '#1133AA', '#AA8800', '#4422AA'][i % 4]}
              emissiveIntensity={0.8 + avgVolume * 0.5}
              transparent opacity={localT * 0.8}
            />
          </mesh>
        );
      })}
      {/* Central light burst */}
      <pointLight color="#FFFFFF" intensity={localT * 5 + avgVolume * 3} distance={40} />
      <mesh>
        <sphereGeometry args={[2 + localT * 3, 24, 24]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={localT * 0.3} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

function GardenScene({ localT, avgVolume }: { localT: number; avgVolume: number }) {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef} position={[0, -2, -25]}>
      {/* Trees of life — glowing pillars */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const r = 10;
        return (
          <group key={i} position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]}>
            <mesh>
              <cylinderGeometry args={[0.3, 0.5, 8, 8]} />
              <meshStandardMaterial color="#44AA22" emissive="#22CC44" emissiveIntensity={0.4 + avgVolume * 0.3} transparent opacity={localT} />
            </mesh>
            {/* Canopy */}
            <mesh position={[0, 5, 0]}>
              <sphereGeometry args={[2.5, 12, 8]} />
              <meshStandardMaterial color="#22CC44" emissive="#88FF44" emissiveIntensity={0.3 + avgVolume * 0.2} transparent opacity={localT * 0.7} />
            </mesh>
            {/* Fruit glow */}
            <pointLight position={[0, 4, 0]} color="#FFD700" intensity={0.5 * localT} distance={8} />
          </group>
        );
      })}
      {/* River of life */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <planeGeometry args={[3, 25]} />
        <meshBasicMaterial color="#44CCFF" transparent opacity={0.3 * localT} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* Warm golden sunlight */}
      <pointLight position={[0, 12, 0]} color="#FFD700" intensity={2 * localT} distance={30} />
    </group>
  );
}

function CrossScene({ localT, avgVolume }: { localT: number; avgVolume: number }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    // Slow dramatic rotation
    groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.05;
  });

  return (
    <group ref={groupRef} position={[0, 0, -20]}>
      {/* The Cross — glowing beams */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[0.6, 10, 0.6]} />
        <meshStandardMaterial color="#8B4513" emissive="#FF2200" emissiveIntensity={0.3 + avgVolume * 0.5} transparent opacity={localT} />
      </mesh>
      <mesh position={[0, 5, 0]}>
        <boxGeometry args={[6, 0.6, 0.6]} />
        <meshStandardMaterial color="#8B4513" emissive="#FF2200" emissiveIntensity={0.3 + avgVolume * 0.5} transparent opacity={localT} />
      </mesh>
      {/* Blood-red glow at base */}
      <pointLight position={[0, 0, 2]} color="#FF0000" intensity={localT * 3} distance={15} />
      {/* Crown of thorns ring */}
      <mesh position={[0, 7, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.8, 0.1, 8, 24]} />
        <meshStandardMaterial color="#8B6914" emissive="#FFD700" emissiveIntensity={0.5 * localT} transparent opacity={localT} />
      </mesh>
      {/* Darkness effect — dark atmosphere */}
      <mesh position={[0, 5, 0]}>
        <sphereGeometry args={[20, 16, 16]} />
        <meshBasicMaterial color="#110000" transparent opacity={0.2 * localT} side={THREE.BackSide} />
      </mesh>
      {/* Dramatic rays breaking through */}
      {localT > 0.5 && Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 3, 5, Math.sin(angle) * 3]} rotation={[0, 0, angle]}>
            <coneGeometry args={[0.3, 8 * (localT - 0.5) * 2, 4]} />
            <meshBasicMaterial color="#FFD700" transparent opacity={0.15 * localT} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
}

function ResurrectionScene({ localT, avgVolume }: { localT: number; avgVolume: number }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.3;
  });

  return (
    <group ref={groupRef} position={[0, 0, -15]}>
      {/* Burst of golden light */}
      <mesh>
        <sphereGeometry args={[3 + localT * 8, 32, 32]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={localT * 0.4} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1 + localT * 4, 24, 24]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={localT * 0.6} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* Radiating light shafts */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} position={[0, 0, 0]} rotation={[Math.cos(angle) * 0.5, angle, 0]}>
            <coneGeometry args={[0.2, 15 * localT, 4]} />
            <meshBasicMaterial color="#FFEE88" transparent opacity={0.2 * localT + avgVolume * 0.1} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        );
      })}
      {/* Empty tomb stone rolled away */}
      <mesh position={[5, -3, 0]} rotation={[0, 0, localT * Math.PI * 0.3]}>
        <cylinderGeometry args={[1.5, 1.5, 0.5, 16]} />
        <meshStandardMaterial color="#888888" emissive="#444444" emissiveIntensity={0.2} transparent opacity={localT * 0.8} />
      </mesh>
      <pointLight color="#FFD700" intensity={localT * 8 + avgVolume * 3} distance={40} />
    </group>
  );
}

function ThroneScene({ localT, avgVolume }: { localT: number; avgVolume: number }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.05;
  });

  return (
    <group ref={groupRef} position={[0, 0, -25]}>
      {/* Throne — golden stepped platform */}
      {[0, 1, 2].map(step => (
        <mesh key={step} position={[0, step * 1.5, 0]}>
          <boxGeometry args={[6 - step * 1.5, 1, 4 - step]} />
          <meshStandardMaterial
            color="#FFD700" emissive="#AA8800" emissiveIntensity={0.5 + avgVolume * 0.3}
            metalness={0.8} roughness={0.2} transparent opacity={localT}
          />
        </mesh>
      ))}
      {/* Throne seat */}
      <mesh position={[0, 5, -0.5]}>
        <boxGeometry args={[2.5, 3, 1]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFAA00" emissiveIntensity={0.6} metalness={0.9} roughness={0.1} transparent opacity={localT} />
      </mesh>
      {/* Rainbow around throne — Revelation 4:3 */}
      <mesh position={[0, 6, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[5, 0.3, 16, 64, Math.PI]} />
        <meshBasicMaterial color="#44FFAA" transparent opacity={0.4 * localT} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* 24 Elder seats in circle */}
      {Array.from({ length: 24 }, (_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const r = 12;
        return (
          <mesh key={i} position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]}>
            <boxGeometry args={[0.8, 2, 0.8]} />
            <meshStandardMaterial color="#FFD700" emissive="#886600" emissiveIntensity={0.3} metalness={0.7} roughness={0.3} transparent opacity={localT * 0.7} />
          </mesh>
        );
      })}
      {/* Sea of glass */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <circleGeometry args={[15, 64]} />
        <meshPhysicalMaterial color="#88CCFF" transparent opacity={0.3 * localT} metalness={0.1} roughness={0.0} clearcoat={1} />
      </mesh>
      {/* Four living creatures — 4 glowing orbs */}
      {[[-3, 3, 3], [3, 3, 3], [-3, 3, -3], [3, 3, -3]].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh>
            <sphereGeometry args={[1, 16, 12]} />
            <meshBasicMaterial color={['#FF4444', '#4488FF', '#44FF44', '#FFD700'][i]} transparent opacity={0.5 * localT} blending={THREE.AdditiveBlending} />
          </mesh>
          <pointLight color={['#FF4444', '#4488FF', '#44FF44', '#FFD700'][i]} intensity={1 * localT} distance={8} />
        </group>
      ))}
      <pointLight position={[0, 10, 0]} color="#FFD700" intensity={localT * 5 + avgVolume * 2} distance={30} />
    </group>
  );
}

function NewJerusalemScene({ localT, avgVolume }: { localT: number; avgVolume: number }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = 10 - localT * 12; // Descending city
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.08;
  });

  return (
    <group ref={groupRef} position={[0, 10, -30]}>
      {/* City walls — 4 sides of golden cubic */}
      {[0, 1, 2, 3].map(side => {
        const angle = (side / 4) * Math.PI * 2;
        return (
          <mesh key={side} position={[Math.cos(angle) * 8, 4, Math.sin(angle) * 8]} rotation={[0, -angle, 0]}>
            <boxGeometry args={[12, 8, 0.5]} />
            <meshPhysicalMaterial
              color="#FFD700" emissive="#FFAA00" emissiveIntensity={0.5 + avgVolume * 0.3}
              metalness={0.9} roughness={0.05} clearcoat={1} transparent opacity={localT * 0.8}
            />
          </mesh>
        );
      })}
      {/* 12 Gates — pearls */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 8.5, 2, Math.sin(angle) * 8.5]}>
            <sphereGeometry args={[0.8, 16, 12]} />
            <meshPhysicalMaterial color="#FFFFFF" emissive="#FFEEDD" emissiveIntensity={0.6} metalness={0.1} roughness={0.0} clearcoat={1} transparent opacity={localT} />
          </mesh>
        );
      })}
      {/* Street of gold */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <planeGeometry args={[4, 20]} />
        <meshPhysicalMaterial color="#FFD700" emissive="#AA8800" emissiveIntensity={0.4} metalness={0.95} roughness={0.05} clearcoat={1} transparent opacity={localT * 0.7} />
      </mesh>
      {/* River of life from throne */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.2, 0]}>
        <planeGeometry args={[1.5, 20]} />
        <meshBasicMaterial color="#44EEFF" transparent opacity={0.4 * localT} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* Tree of life */}
      <group position={[0, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.4, 0.6, 6, 8]} />
          <meshStandardMaterial color="#88AA44" emissive="#44CC22" emissiveIntensity={0.5} transparent opacity={localT} />
        </mesh>
        <mesh position={[0, 4, 0]}>
          <sphereGeometry args={[3, 16, 12]} />
          <meshStandardMaterial color="#22FF44" emissive="#88FF44" emissiveIntensity={0.4 + avgVolume * 0.3} transparent opacity={localT * 0.6} />
        </mesh>
      </group>
      {/* Glory light — no need for sun */}
      <pointLight position={[0, 15, 0]} color="#FFFFFF" intensity={localT * 10} distance={50} />
      <pointLight position={[0, 5, 0]} color="#FFD700" intensity={localT * 5 + avgVolume * 3} distance={30} />
    </group>
  );
}

// ─── Speed Lines ──────────────────────────────────────────
const SPEED_LINE_COUNT = 60;

function SpeedLines({ speed, color }: { speed: number; color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const lines = useMemo(() =>
    Array.from({ length: SPEED_LINE_COUNT }, (_, i) => {
      const angle = (i / SPEED_LINE_COUNT) * Math.PI * 2;
      const radius = 2;
      return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, angle };
    }), []);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = speed * 0.6;
      }
    });
  });

  if (speed < 0.1) return null;

  return (
    <group ref={groupRef} position={[0, 0, -1]}>
      {lines.map((line, i) => (
        <mesh key={i} position={[line.x, line.y, -1]} rotation={[0, 0, line.angle]}>
          <cylinderGeometry args={[0.004, 0.004, 0.5 + speed * 2.5, 3]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Cockpit Porthole ────────────────────────────────────
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
        <meshPhysicalMaterial color="#8B7535" emissive={phaseColor} emissiveIntensity={0.2} metalness={0.92} roughness={0.08} clearcoat={0.8} clearcoatRoughness={0.05} />
      </mesh>
      <mesh position={[0, 0, -1.48]}>
        <torusGeometry args={[1.72, 0.025, 8, 48]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
      </mesh>
    </>
  );
}

// ─── Floating Particles ──────────────────────────────────
function FloatingEmbers({ count, color, avgVolume }: { count: number; color: string; avgVolume: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particleData = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        x: (Math.random() - 0.5) * 30,
        y: (Math.random() - 0.5) * 20,
        z: -Math.random() * 40 - 5,
        speedX: (Math.random() - 0.5) * 0.02,
        speedY: Math.random() * 0.01 + 0.005,
        phase: Math.random() * Math.PI * 2,
        size: 0.03 + Math.random() * 0.08,
      });
    }
    return data;
  }, [count]);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = clock.getElapsedTime();
    for (let i = 0; i < particleData.length; i++) {
      const p = particleData[i];
      const pulse = 1 + Math.sin(t * 2 + p.phase) * 0.3 + avgVolume * 0.5;
      dummy.position.set(
        p.x + Math.sin(t * 0.5 + p.phase) * 2,
        p.y + Math.sin(t * p.speedY * 10 + p.phase) * 3,
        p.z,
      );
      dummy.scale.setScalar(p.size * pulse);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  const map = useMemo(() => getSoftCircleTexture(), []);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={map} color={color} transparent opacity={0.6} depthWrite={false} blending={THREE.AdditiveBlending} />
    </instancedMesh>
  );
}

// ─── Progress Ring ────────────────────────────────────────
function ProgressRing({ progress, color }: { progress: number; color: string }) {
  const geometry = useMemo(() => new THREE.RingGeometry(1.8, 1.88, 64, 1, 0, progress * Math.PI * 2), [progress]);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <primitive object={geometry} attach="geometry" />
      <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

// ─── Scene Transition Overlay ─────────────────────────────
function SceneTransition({ progress, scenes }: { progress: number; scenes: TourScene[] }) {
  // Show brief flash at scene boundaries
  const isTransitioning = useMemo(() => {
    for (const scene of scenes) {
      const dist = Math.abs(progress - scene.start);
      if (dist < 0.015 && scene.start > 0) return dist / 0.015;
    }
    return 0;
  }, [progress, scenes]);

  if (isTransitioning <= 0) return null;

  return (
    <mesh position={[0, 0, -2]}>
      <planeGeometry args={[20, 20]} />
      <meshBasicMaterial color="#FFFFFF" transparent opacity={(1 - isTransitioning) * 0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

// ─── Main Component ───────────────────────────────────────
export default function HeavensDiary({ onBack }: HeavensDiaryProps) {
  const [audioState, audioControls] = useStreamingAudio(AUDIO_SRC);
  const sceneGroupRef = useRef<THREE.Group>(null);
  const cameraGroupRef = useRef<THREE.Group>(null);

  const avgVolume = useMemo(() => {
    if (!audioState.analyserData) return 0;
    const sum = audioState.analyserData.reduce((a: number, b: number) => a + b, 0);
    return sum / audioState.analyserData.length / 255;
  }, [audioState.analyserData]);

  const bassVolume = useMemo(() => {
    if (!audioState.analyserData || audioState.analyserData.length < 8) return 0;
    let sum = 0;
    for (let i = 0; i < 8; i++) sum += audioState.analyserData[i];
    return sum / 8 / 255;
  }, [audioState.analyserData]);

  const currentScene = getCurrentScene(audioState.progress);
  const localT = getSceneLocalProgress(audioState.progress, currentScene);
  const speed = 0.3 + localT * 0.7 + avgVolume * 0.3;

  // Camera flythrough path
  useFrame(({ clock }) => {
    if (!cameraGroupRef.current) return;
    const camPos = currentScene.cameraPath(localT);
    const target = cameraGroupRef.current.position;
    target.x += (camPos.x * 0.3 - target.x) * 0.02;
    target.y += (camPos.y * 0.3 - target.y) * 0.02;

    // Audio-reactive shake
    const t = clock.getElapsedTime();
    const shakeX = Math.sin(t * 17) * bassVolume * 0.03;
    const shakeY = Math.cos(t * 13) * bassVolume * 0.02;
    target.x += shakeX;
    target.y += shakeY;
  });

  return (
    <group ref={sceneGroupRef}>
      <group ref={cameraGroupRef}>
        {/* Dynamic ambient */}
        <ambientLight intensity={0.3} color={currentScene.colors.ambient} />
        <directionalLight position={[0, 5, -10]} intensity={0.4} color="#FFE4B0" />

        {/* Scene accent lights */}
        <pointLight position={[-5, 3, -5]} color={currentScene.colors.accent} intensity={currentScene.lightIntensity + avgVolume * 0.8} distance={25} />
        <pointLight position={[5, 3, -5]} color={currentScene.colors.nebula[1] || currentScene.colors.accent} intensity={1 + avgVolume * 0.6} distance={20} />

        {/* Warp stars */}
        <WarpStars progress={audioState.progress} scene={currentScene} avgVolume={avgVolume} />

        {/* Nebula clouds */}
        <NebulaClouds count={18} radius={40} colors={currentScene.colors.nebula} opacity={0.12 + avgVolume * 0.15} zSpeed={speed * 15} />

        {/* Scene-specific geometry */}
        {currentScene.id === 'creation' && <CreationScene localT={localT} avgVolume={avgVolume} />}
        {currentScene.id === 'garden' && <GardenScene localT={localT} avgVolume={avgVolume} />}
        {currentScene.id === 'cross' && <CrossScene localT={localT} avgVolume={avgVolume} />}
        {currentScene.id === 'resurrection' && <ResurrectionScene localT={localT} avgVolume={avgVolume} />}
        {currentScene.id === 'throne' && <ThroneScene localT={localT} avgVolume={avgVolume} />}
        {currentScene.id === 'newJerusalem' && <NewJerusalemScene localT={localT} avgVolume={avgVolume} />}

        {/* Speed lines */}
        <SpeedLines speed={speed} color={currentScene.particleColor} />

        {/* Floating embers */}
        <FloatingEmbers count={200} color={currentScene.particleColor} avgVolume={avgVolume} />

        {/* Scene transition flash */}
        <SceneTransition progress={audioState.progress} scenes={TOUR_SCENES} />

        {/* Cockpit porthole */}
        <CockpitPorthole phaseColor={currentScene.colors.accent} />

        {/* Progress ring */}
        <ProgressRing progress={audioState.progress} color={currentScene.colors.accent} />

        {/* Fog */}
        <fog attach="fog" args={[currentScene.colors.fog, 12, 55]} />

        {/* Title */}
        <Text position={[0, 2.5, -3]} fontSize={0.25} color={currentScene.colors.accent} anchorX="center" outlineWidth={0.012} outlineColor="#000">
          Heaven's Diary
        </Text>

        {/* Scene label */}
        <Text position={[0, 2.15, -3]} fontSize={0.14} color="#FFFFFF" anchorX="center" outlineWidth={0.008} outlineColor="#000">
          {currentScene.label}
        </Text>

        {/* Scripture subtitle */}
        <Text position={[0, 1.9, -3]} fontSize={0.07} color="#CCCCAA" anchorX="center" maxWidth={3}>
          {currentScene.subtitle}
        </Text>

        {/* Play/Pause button */}
        <Interactive onSelect={audioControls.togglePlayPause}>
          <mesh position={[0, 1.45, -3]} onClick={audioControls.togglePlayPause} onPointerDown={audioControls.togglePlayPause}>
            <circleGeometry args={[0.18, 32]} />
            <meshStandardMaterial
              color={audioState.isPlaying ? '#FF4444' : '#44FF44'}
              emissive={audioState.isPlaying ? '#FF4444' : '#44FF44'}
              emissiveIntensity={0.8}
            />
          </mesh>
        </Interactive>
        <Text position={[0, 1.45, -2.98]} fontSize={0.1} color="white" anchorX="center" anchorY="middle">
          {audioState.isPlaying ? '⏸' : '▶'}
        </Text>

        {/* Time display */}
        <Text position={[0, 1.15, -3]} fontSize={0.07} color="#CCCCEE" anchorX="center">
          {formatTime(audioState.currentTime)} / {formatTime(audioState.duration)}
          {audioState.isLoading ? '  Loading...' : ''}
        </Text>

        {/* Scene progress dots */}
        <group position={[0, 1.0, -3]}>
          {TOUR_SCENES.map((scene, i) => {
            const isCurrent = scene.id === currentScene.id;
            const isPast = audioState.progress >= scene.end;
            return (
              <mesh key={scene.id} position={[(i - (TOUR_SCENES.length - 1) / 2) * 0.2, 0, 0]}>
                <circleGeometry args={[isCurrent ? 0.04 : 0.025, 16]} />
                <meshBasicMaterial
                  color={isCurrent ? scene.colors.accent : isPast ? '#888888' : '#444444'}
                  transparent opacity={isCurrent ? 1 : 0.6}
                />
              </mesh>
            );
          })}
        </group>

        {/* Back button */}
        <BackToLobbyButton onBack={onBack} position={[0, 0.2, -1.5]} />
      </group>
    </group>
  );
}

function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
