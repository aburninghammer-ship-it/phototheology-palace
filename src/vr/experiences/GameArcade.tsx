import { useState, useRef, useMemo, Suspense } from 'react';
import { Text } from '@react-three/drei';
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
function ArcadeParticles({ count = 40 }: { count?: number }) {
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
    // Open in new tab to preserve VR session stability
    window.open(route, '_blank');
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
      {/* Dark reflective floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#050510" metalness={0.7} roughness={0.3} />
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

      {/* Floating particles */}
      <ArcadeParticles />

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
