import { Suspense } from 'react';
import { Portal } from './components/Portal';
import { Text } from '@react-three/drei';
import {
  SanctuaryParticles,
  LightShafts,
  SanctuaryFloor,
  SanctuaryPillars,
  SanctuaryDome,
  CenterOrb,
} from './components/LobbyEnvironment';

export type VRExperience = 'lobby' | 'sanctuary' | 'gallery' | 'audio' | 'heavensDiary' | 'arcade' | 'palace' | 'nightWatch' | 'morningWatch' | 'swordOfTheSpirit';

interface VRLobbyProps {
  onEnterExperience: (experience: VRExperience) => void;
}

export function VRLobby({ onEnterExperience }: VRLobbyProps) {
  return (
    <group>
      {/* === ENVIRONMENT === */}
      <SanctuaryDome />
      <SanctuaryFloor />
      <SanctuaryPillars />
      <LightShafts />
      <SanctuaryParticles />
      <CenterOrb />

      {/* === LIGHTING RIG === */}
      {/* Ambient — low but warm */}
      <ambientLight intensity={0.15} color="#D4C5A0" />

      {/* Key light — warm from above-right (like a heavenly source) */}
      <directionalLight
        position={[5, 8, 3]}
        intensity={1.0}
        color="#FFE4B0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.1}
        shadow-camera-far={30}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Fill light — cool from left */}
      <directionalLight position={[-6, 4, 2]} intensity={0.3} color="#8888cc" />

      {/* Rim light — indigo from behind */}
      <directionalLight position={[0, 4, -10]} intensity={0.5} color="#6366f1" />

      {/* Portal atmosphere lights */}
      <pointLight position={[-5, 4, -3]} intensity={0.5} color="#FFD700" distance={12} decay={2} />
      <pointLight position={[5, 4, -3]} intensity={0.5} color="#8b5cf6" distance={12} decay={2} />
      <pointLight position={[0, 3, -7]} intensity={0.4} color="#44FFEE" distance={10} decay={2} />

      {/* Fog for depth */}
      <fog attach="fog" args={['#080818', 8, 25]} />

      {/* === TITLE === */}
      <Suspense fallback={null}>
        <Text
          position={[0, 3.2, -3]}
          fontSize={0.28}
          color="#FFD700"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.008}
          outlineColor="#000"
          maxWidth={8}
        >
          PhototheologyOS VR Hub
        </Text>

        <Text
          position={[0, 2.8, -3]}
          fontSize={0.11}
          color="#AAAACC"
          anchorX="center"
          anchorY="middle"
        >
          Step through a portal to begin your experience
        </Text>
      </Suspense>

      {/* === PORTALS — semicircle arrangement === */}
      <Portal
        position={[-4.6, 0.5, -1.95]}
        rotation={[0, 1.17, 0]}
        label="The Sanctuary"
        color="#FFD700"
        onClick={() => onEnterExperience('sanctuary')}
      />
      <Portal
        position={[-3.2, 0.5, -3.8]}
        rotation={[0, 0.7, 0]}
        label="24FPS Gallery"
        color="#44AAFF"
        onClick={() => onEnterExperience('gallery')}
      />
      <Portal
        position={[-1.1, 0.5, -4.9]}
        rotation={[0, 0.23, 0]}
        label="Audio Theater"
        color="#BB66FF"
        onClick={() => onEnterExperience('audio')}
      />
      <Portal
        position={[1.1, 0.5, -4.9]}
        rotation={[0, -0.23, 0]}
        label="Heaven's Diary"
        color="#44FFEE"
        onClick={() => onEnterExperience('heavensDiary')}
      />
      <Portal
        position={[3.2, 0.5, -3.8]}
        rotation={[0, -0.7, 0]}
        label="Game Arcade"
        color="#39FF14"
        onClick={() => onEnterExperience('arcade')}
      />
      <Portal
        position={[4.6, 0.5, -1.95]}
        rotation={[0, -1.17, 0]}
        label="Tour the Palace"
        color="#FFB844"
        onClick={() => onEnterExperience('palace')}
      />

      {/* Watch portals — centered below main semicircle */}
      <Portal
        position={[-1.5, 0.5, -6.5]}
        rotation={[0, 0.15, 0]}
        label="Night Watch"
        color="#8b5cf6"
        onClick={() => onEnterExperience('nightWatch')}
      />
      <Portal
        position={[1.5, 0.5, -6.5]}
        rotation={[0, -0.15, 0]}
        label="Morning Watch"
        color="#f59e0b"
        onClick={() => onEnterExperience('morningWatch')}
      />

      {/* Sword of the Spirit */}
      <Portal
        position={[0, 0.5, -7.5]}
        rotation={[0, 0, 0]}
        label="Sword of the Spirit"
        color="#FF4466"
        onClick={() => onEnterExperience('swordOfTheSpirit')}
      />
    </group>
  );
}
