import { useState, useRef, useMemo, Suspense } from 'react';
import { Text, Environment } from '@react-three/drei';
import { Interactive } from '@react-three/xr';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BackToLobbyButton } from '../components/BackToLobbyButton';

const GAMES = [
  { name: 'Escape Room', route: '/escape-room', emoji: '🔐', color: '#FF4444', glowColor: '#FF2222', desc: '28 themed escape rooms' },
  { name: 'Gideon 300', route: '/games/gideon-300', emoji: '⚔️', color: '#FFD700', glowColor: '#FFAA00', desc: "Lead Gideon's army" },
  { name: 'Chain Chess', route: '/chain-chess', emoji: '♟️', color: '#4488FF', glowColor: '#2266FF', desc: 'Biblical chess battles' },
  { name: 'Sanctuary Run', route: '/games/sanctuary-run', emoji: '🏃', color: '#FF8800', glowColor: '#FF6600', desc: 'Race through the temple' },
  { name: 'PT Jeopardy', route: '/games/pt-jeopardy', emoji: '🏆', color: '#BB44FF', glowColor: '#9922FF', desc: 'Test your knowledge' },
  { name: 'Freestyle Zone', route: '/games/freestyle-zone', emoji: '🎤', color: '#39FF14', glowColor: '#22DD00', desc: 'Creative expression' },
  { name: 'Escape the Dragon', route: '/games/escape-dragon', emoji: '🐉', color: '#FF3366', glowColor: '#DD1144', desc: 'Outrun the dragon' },
  { name: 'Master Exam', route: '/games/master-exam', emoji: '📝', color: '#44DDFF', glowColor: '#22BBFF', desc: 'Final challenge' },
] as const;

// Neon tube light along a wall
function NeonTube({ position, color, length = 4 }: { position: [number, number, number]; color: string; length?: number }) {
  const ref = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() + position[0] * 2;
    ref.current.intensity = 1.2 + Math.sin(t * 3) * 0.2 + Math.sin(t * 7) * 0.1;
  });

  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.02, 0.02, length, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </mesh>
      <pointLight ref={ref} color={color} intensity={1.2} distance={5} />
    </group>
  );
}

// Floating arcade particles
function ArcadeParticles({ count = 80 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const basePositions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = Math.random() * 4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    return pos;
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const arr = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const t = clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      arr[i * 3] = basePositions[i * 3] + Math.sin(t * 0.5 + i) * 0.3;
      arr[i * 3 + 1] = ((basePositions[i * 3 + 1] + t * 0.15) % 4);
      arr[i * 3 + 2] = basePositions[i * 3 + 2] + Math.cos(t * 0.3 + i) * 0.3;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={new Float32Array(basePositions)} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#39FF14" transparent opacity={0.5} depthWrite={false} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
}

interface GameScreenProps {
  name: string;
  route: string;
  emoji: string;
  color: string;
  glowColor: string;
  desc: string;
  position: [number, number, number];
  rotation: [number, number, number];
}

function GameScreen({ name, route, emoji, color, glowColor, desc, position, rotation }: GameScreenProps) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const target = hovered ? 1.08 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.1);
    if (glowRef.current) {
      const t = clock.getElapsedTime() + position[0] * 3;
      glowRef.current.intensity = 0.8 + Math.sin(t * 2) * 0.3;
    }
  });

  const handleClick = () => {
    // Navigate in same window so the game loads properly
    window.location.href = route;
  };

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Outer neon glow border */}
      <mesh position={[0, 0, -0.03]}>
        <planeGeometry args={[1.4, 1.1]} />
        <meshStandardMaterial
          color={color}
          emissive={glowColor}
          emissiveIntensity={hovered ? 2 : 1}
          transparent
          opacity={0.95}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Inner border accent */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[1.3, 1.0]} />
        <meshStandardMaterial color="#050510" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Screen face — Interactive for XR controller/hand select */}
      <Interactive
        onSelect={handleClick}
        onHover={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        <mesh onClick={handleClick} onPointerDown={handleClick}>
          <planeGeometry args={[1.2, 0.9]} />
          <meshStandardMaterial
            color="#0a0a20"
            emissive={color}
            emissiveIntensity={hovered ? 0.15 : 0.06}
            metalness={0.2}
            roughness={0.5}
          />
        </mesh>
      </Interactive>

      {/* Colored accent strip at top */}
      <mesh position={[0, 0.4, 0.001]}>
        <planeGeometry args={[1.18, 0.04]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Text labels */}
      <Suspense fallback={null}>
        <Text position={[0, 0.15, 0.01]} fontSize={0.25} anchorX="center" anchorY="middle">
          {emoji}
        </Text>
        <Text position={[0, -0.1, 0.01]} fontSize={0.1} color="#ffffff" anchorX="center" anchorY="middle" outlineWidth={0.005} outlineColor="#000">
          {name}
        </Text>
        <Text position={[0, -0.25, 0.01]} fontSize={0.06} color={color} anchorX="center" anchorY="middle">
          {desc}
        </Text>
      </Suspense>

      {/* Point light for glow effect */}
      <pointLight ref={glowRef} position={[0, 0, 0.8]} color={glowColor} intensity={0.8} distance={3} />
    </group>
  );
}

// ── CRT Scanline overlay on screens ──
function ScanlineOverlay({ position, rotation, width = 1.2, height = 0.9 }: {
  position: [number, number, number]; rotation: [number, number, number]; width?: number; height?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.03 + Math.sin(t * 60) * 0.01;
  });

  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial color="#00FF00" transparent opacity={0.03} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

// ── Laser beam energy walls between screens ──
function LaserWalls() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = 6;

  const beams = useMemo(() => {
    const arr: { x: number; z: number; rotY: number; color: string }[] = [];
    const arcAngle = Math.PI * 0.8;
    const startAngle = -arcAngle / 2;
    const radius = 5.3;
    for (let i = 0; i < count; i++) {
      const angle = startAngle + ((i + 0.5) / GAMES.length) * arcAngle;
      arr.push({
        x: Math.sin(angle) * radius,
        z: -Math.cos(angle) * radius,
        rotY: -angle,
        color: ['#39FF14', '#BB44FF', '#FF4444', '#4488FF', '#FFD700', '#FF3366'][i],
      });
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    beams.forEach((b, i) => {
      dummy.position.set(b.x, 0.5 + Math.sin(t * 2 + i) * 0.1, b.z);
      dummy.rotation.set(0, b.rotY, 0);
      dummy.scale.set(0.01, 2.5, 0.01);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    (meshRef.current.material as THREE.MeshBasicMaterial).opacity = 0.3 + Math.sin(t * 4) * 0.1;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#39FF14" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
    </instancedMesh>
  );
}

// ── Holographic floating arcade sign ──
function ArcadeHoloSign() {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y = 4 + Math.sin(t * 0.5) * 0.15;
    ref.current.rotation.y = Math.sin(t * 0.2) * 0.05;
  });

  return (
    <group ref={ref} position={[0, 4, -3]}>
      {/* Glow backing */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[4, 0.6]} />
        <meshBasicMaterial color="#39FF14" transparent opacity={0.04} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Border lines */}
      <mesh position={[0, 0.28, 0]}>
        <planeGeometry args={[3.8, 0.01]} />
        <meshBasicMaterial color="#39FF14" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh position={[0, -0.28, 0]}>
        <planeGeometry args={[3.8, 0.01]} />
        <meshBasicMaterial color="#39FF14" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

// ── Floor pulse rings ──
function FloorPulseRings() {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ring1Ref.current) {
      const s = ((t * 0.3) % 2) * 4;
      ring1Ref.current.scale.setScalar(s);
      (ring1Ref.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.06 * (1 - s / 8));
    }
    if (ring2Ref.current) {
      const s = (((t * 0.3 + 1) % 2)) * 4;
      ring2Ref.current.scale.setScalar(s);
      (ring2Ref.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.06 * (1 - s / 8));
    }
  });

  return (
    <group position={[0, -1.17, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh ref={ring1Ref}>
        <ringGeometry args={[0.9, 1, 32]} />
        <meshBasicMaterial color="#39FF14" transparent opacity={0.06} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={ring2Ref}>
        <ringGeometry args={[0.9, 1, 32]} />
        <meshBasicMaterial color="#BB44FF" transparent opacity={0.06} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

interface GameArcadeProps {
  onBack: () => void;
}

export default function GameArcade({ onBack }: GameArcadeProps) {
  const screens = useMemo(() => {
    const count = GAMES.length;
    const arcAngle = Math.PI * 0.8;
    const startAngle = -arcAngle / 2;
    const radius = 5;

    return GAMES.map((game, i) => {
      const angle = startAngle + (i / (count - 1)) * arcAngle;
      const x = Math.sin(angle) * radius;
      const z = -Math.cos(angle) * radius;
      const rotY = -angle;
      return {
        ...game,
        position: [x, 1.5, z] as [number, number, number],
        rotation: [0, rotY, 0] as [number, number, number],
      };
    });
  }, []);

  return (
    <group>
      {/* Environment IBL for neon reflections */}
      <Environment preset="city" background resolution={512} />

      {/* Dark reflective floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshPhysicalMaterial color="#050510" metalness={0.85} roughness={0.15} clearcoat={0.7} clearcoatRoughness={0.1} envMapIntensity={0.3} />
      </mesh>

      {/* Neon grid on floor */}
      <gridHelper args={[20, 40, '#39FF14', '#194a0a']} position={[0, -1.19, 0]} />

      {/* Second grid layer for depth */}
      <gridHelper args={[20, 20, '#9944FF', '#220044']} position={[0, -1.18, 0]} />

      {/* Dark dome ceiling with subtle stars */}
      <mesh position={[0, 5, 0]}>
        <sphereGeometry args={[12, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#050510" side={1} />
      </mesh>

      {/* Vibrant multi-colored lighting */}
      <ambientLight intensity={0.35} color="#444466" />
      <directionalLight position={[0, 5, 0]} intensity={0.3} color="#39FF14" />
      <directionalLight position={[-5, 3, -3]} intensity={0.2} color="#BB44FF" />
      <pointLight position={[0, 4, 0]} intensity={1.2} color="#39FF14" distance={15} />
      <pointLight position={[-5, 3, -3]} intensity={0.8} color="#BB44FF" distance={10} />
      <pointLight position={[5, 3, -3]} intensity={0.8} color="#FF4444" distance={10} />
      <pointLight position={[0, 3, -5]} intensity={0.6} color="#4488FF" distance={10} />
      <pointLight position={[-3, 2, 1]} intensity={0.4} color="#FFD700" distance={8} />
      <pointLight position={[3, 2, 1]} intensity={0.4} color="#FF3366" distance={8} />

      {/* Neon tube lights on walls */}
      <NeonTube position={[-6, 3, -3]} color="#39FF14" length={5} />
      <NeonTube position={[6, 3, -3]} color="#BB44FF" length={5} />
      <NeonTube position={[-4, 0.5, -6]} color="#FF4444" />
      <NeonTube position={[4, 0.5, -6]} color="#4488FF" />

      {/* Floating particles — doubled */}
      <ArcadeParticles count={120} />

      {/* Laser beam walls between screens */}
      <LaserWalls />

      {/* Holographic floating sign */}
      <ArcadeHoloSign />

      {/* Floor pulse rings */}
      <FloorPulseRings />

      {/* Fog for atmosphere */}
      <fog attach="fog" args={['#050510', 10, 25]} />

      {/* Title */}
      <Suspense fallback={null}>
        <Text
          position={[0, 3.2, -2]}
          fontSize={0.4}
          color="#39FF14"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.015}
          outlineColor="#000"
        >
          Game Arcade
        </Text>
        <Text position={[0, 2.8, -2]} fontSize={0.12} color="#BB88FF" anchorX="center" anchorY="middle">
          Tap a screen to play
        </Text>
      </Suspense>

      {/* Game screens */}
      {screens.map((screen) => (
        <GameScreen key={screen.name} {...screen} />
      ))}

      {/* Back button */}
      <BackToLobbyButton onBack={onBack} position={[0, 0.3, -1.5]} />
    </group>
  );
}
