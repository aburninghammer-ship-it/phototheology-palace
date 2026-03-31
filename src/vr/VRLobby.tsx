import { Portal } from './components/Portal';
import { Text } from '@react-three/drei';

export type VRExperience = 'lobby' | 'sanctuary' | 'gallery' | 'audio' | 'heavensDiary' | 'arcade';

interface VRLobbyProps {
  onEnterExperience: (experience: VRExperience) => void;
}

export function VRLobby({ onEnterExperience }: VRLobbyProps) {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.3} roughness={0.8} />
      </mesh>

      {/* Ceiling — subtle dark dome */}
      <mesh position={[0, 5, 0]}>
        <sphereGeometry args={[10, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#0a0a15" side={1} />
      </mesh>

      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 4, 0]} intensity={1} color="#e8d5b7" />

      {/* Title */}
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.35}
        color="#e8d5b7"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000"
      >
        PhototheologyOS VR Hub
      </Text>

      <Text
        position={[0, 2.1, 0]}
        fontSize={0.15}
        color="#888"
        anchorX="center"
        anchorY="middle"
      >
        Select a portal to begin your experience
      </Text>

      {/* Five portals arranged in a semicircle in front of the user */}
      <Portal
        position={[-4, 0, -3]}
        rotation={[0, 0.5, 0]}
        label="The Sanctuary"
        color="#FFD700"
        onClick={() => onEnterExperience('sanctuary')}
      />
      <Portal
        position={[-2, 0, -4.5]}
        rotation={[0, 0.25, 0]}
        label="24FPS Gallery"
        color="#4488FF"
        onClick={() => onEnterExperience('gallery')}
      />
      <Portal
        position={[0, 0, -5]}
        rotation={[0, 0, 0]}
        label="Audio Theater"
        color="#9944FF"
        onClick={() => onEnterExperience('audio')}
      />
      <Portal
        position={[2, 0, -4.5]}
        rotation={[0, -0.25, 0]}
        label="Heaven's Diary"
        color="#44FFEE"
        onClick={() => onEnterExperience('heavensDiary')}
      />
      <Portal
        position={[4, 0, -3]}
        rotation={[0, -0.5, 0]}
        label="Game Arcade"
        color="#39FF14"
        onClick={() => onEnterExperience('arcade')}
      />

      {/* Decorative center element — glowing orb */}
      <mesh position={[0, 0.5, -2]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color="#e8d5b7"
          emissive="#e8d5b7"
          emissiveIntensity={2}
          transparent
          opacity={0.8}
        />
      </mesh>
      <pointLight position={[0, 0.5, -2]} color="#e8d5b7" intensity={0.5} distance={3} />
    </group>
  );
}
