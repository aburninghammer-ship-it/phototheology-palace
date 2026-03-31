import { useState, useRef, useMemo } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const GAMES = [
  { name: 'Escape Room', route: '/escape-room', emoji: '🔐', color: '#FF4444', desc: '28 themed escape rooms' },
  { name: 'Gideon 300', route: '/games/gideon-300', emoji: '⚔️', color: '#FFD700', desc: 'Lead Gideon\'s army' },
  { name: 'Chain Chess', route: '/chain-chess', emoji: '♟️', color: '#4488FF', desc: 'Biblical chess battles' },
  { name: 'Sanctuary Run', route: '/games/sanctuary-run', emoji: '🏃', color: '#FFD700', desc: 'Race through the temple' },
  { name: 'PT Jeopardy', route: '/games/pt-jeopardy', emoji: '🏆', color: '#9944FF', desc: 'Test your knowledge' },
  { name: 'Freestyle Zone', route: '/games/freestyle-zone', emoji: '🎤', color: '#39FF14', desc: 'Creative expression' },
  { name: 'Escape the Dragon', route: '/games/escape-dragon', emoji: '🐉', color: '#FF4444', desc: 'Outrun the dragon' },
  { name: 'Master Exam', route: '/games/master-exam', emoji: '📝', color: '#4488FF', desc: 'Final challenge' },
] as const;

interface GameScreenProps {
  name: string;
  route: string;
  emoji: string;
  color: string;
  desc: string;
  position: [number, number, number];
  rotation: [number, number, number];
}

function GameScreen({ name, route, emoji, color, desc, position, rotation }: GameScreenProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!groupRef.current) return;
    const target = hovered ? 1.08 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.1);
  });

  const handleClick = () => {
    window.location.href = route;
  };

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Glow border */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[1.3, 1.0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 1.5 : 0.8}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Screen face */}
      <mesh
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={[1.2, 0.9]} />
        <meshBasicMaterial color="#111122" />
      </mesh>

      {/* Emoji */}
      <Text
        position={[0, 0.15, 0.01]}
        fontSize={0.25}
        anchorX="center"
        anchorY="middle"
      >
        {emoji}
      </Text>

      {/* Game name */}
      <Text
        position={[0, -0.1, 0.01]}
        fontSize={0.1}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {name}
      </Text>

      {/* Description */}
      <Text
        position={[0, -0.25, 0.01]}
        fontSize={0.06}
        color="#aaaaaa"
        anchorX="center"
        anchorY="middle"
      >
        {desc}
      </Text>

      {/* Point light for glow effect */}
      <pointLight position={[0, 0, 0.5]} color={color} intensity={0.4} distance={2} />
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
      {/* Dark floor with neon grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#050510" metalness={0.5} roughness={0.6} />
      </mesh>

      {/* Grid lines on floor */}
      <gridHelper
        args={[20, 40, '#39FF1433', '#39FF1418']}
        position={[0, -1.19, 0]}
      />

      {/* Dark ceiling */}
      <mesh position={[0, 5, 0]}>
        <sphereGeometry args={[10, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#050510" side={1} />
      </mesh>

      {/* Neon ambient lighting */}
      <ambientLight intensity={0.15} color="#39FF14" />
      <pointLight position={[0, 4, 0]} intensity={0.6} color="#39FF14" />
      <pointLight position={[-4, 3, -2]} intensity={0.3} color="#9944FF" />
      <pointLight position={[4, 3, -2]} intensity={0.3} color="#9944FF" />

      {/* Title */}
      <Text
        position={[0, 3.2, -2]}
        fontSize={0.4}
        color="#39FF14"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000"
      >
        🕹️ Game Arcade
      </Text>

      <Text
        position={[0, 2.8, -2]}
        fontSize={0.12}
        color="#888"
        anchorX="center"
        anchorY="middle"
      >
        Tap a screen to play
      </Text>

      {/* Game screens */}
      {screens.map((screen) => (
        <GameScreen key={screen.name} {...screen} />
      ))}

      {/* Back button */}
      <Text
        position={[0, 0.3, 2]}
        fontSize={0.1}
        color="#FF6666"
        anchorX="center"
        onClick={onBack}
      >
        ← Back to Lobby
      </Text>
    </group>
  );
}
