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
  Candlestick,
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

      {/* === CANDLESTICKS flanking portals === */}
      <Candlestick position={[-6.8, -1.2, -1.5]} />
      <Candlestick position={[-4.5, -1.2, -3.8]} />
      <Candlestick position={[-2.2, -1.2, -5]} />
      <Candlestick position={[2.2, -1.2, -5]} />
      <Candlestick position={[4.5, -1.2, -3.8]} />
      <Candlestick position={[6.8, -1.2, -1.5]} />

      {/* === LIGHTING RIG — rich warm golden sanctuary === */}
      <ambientLight intensity={0.25} color="#C4B5FD" />

      {/* Key light — warm golden from above */}
      <directionalLight
        position={[5, 12, 3]}
        intensity={1.4}
        color="#C4B5FD"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.1}
        shadow-camera-far={35}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
      />

      {/* Fill light — warm from left */}
      <directionalLight position={[-8, 6, 2]} intensity={0.5} color="#7C3AED" />

      {/* Rim light — purple from behind */}
      <directionalLight position={[0, 6, -12]} intensity={0.7} color="#C026D3" />

      {/* Overhead zenith light */}
      <directionalLight position={[0, 15, -3]} intensity={0.3} color="#E9D5FF" />

      {/* Portal atmosphere lights */}
      <pointLight position={[-6, 5, -3]} intensity={0.8} color="#7C3AED" distance={16} decay={2} />
      <pointLight position={[6, 5, -3]} intensity={0.8} color="#7C3AED" distance={16} decay={2} />
      <pointLight position={[0, 4, -8]} intensity={0.6} color="#C4B5FD" distance={14} decay={2} />
      <pointLight position={[0, 1, 2]} intensity={0.4} color="#C026D3" distance={8} decay={2} />

      {/* Floor warmth & reflections */}
      <pointLight position={[0, -0.8, -2]} intensity={0.6} color="#7C3AED" distance={10} decay={2} />

      {/* Fog for depth — warm tint, deeper range */}
      <fog attach="fog" args={['#060818', 12, 32]} />

      {/* === TITLE === */}
      <Suspense fallback={null}>
        <Text
          position={[0, 3.5, -4]}
          fontSize={0.32}
          color="#C4B5FD"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000"
          maxWidth={10}
          font={undefined}
        >
          PhototheologyOS VR Hub
        </Text>

        <Text
          position={[0, 3.0, -4]}
          fontSize={0.12}
          color="#93C5FD"
          anchorX="center"
          anchorY="middle"
        >
          Select a portal to begin your experience
        </Text>
      </Suspense>

      {/* === MAIN PORTALS — wide semicircle of 6 === */}
      <Portal
        position={[-5.8, 0.5, -2]}
        rotation={[0, 1.0, 0]}
        label="The Sanctuary"
        color="#FFD700"
        onClick={() => onEnterExperience('sanctuary')}
      />
      <Portal
        position={[-3.5, 0.5, -4.2]}
        rotation={[0, 0.6, 0]}
        label="24FPS Gallery"
        color="#44AAFF"
        onClick={() => onEnterExperience('gallery')}
      />
      <Portal
        position={[-1.0, 0.5, -5.5]}
        rotation={[0, 0.2, 0]}
        label="Audio Theater"
        color="#BB66FF"
        onClick={() => onEnterExperience('audio')}
      />
      <Portal
        position={[1.0, 0.5, -5.5]}
        rotation={[0, -0.2, 0]}
        label="Heaven's Diary"
        color="#44FFEE"
        onClick={() => onEnterExperience('heavensDiary')}
      />
      <Portal
        position={[3.5, 0.5, -4.2]}
        rotation={[0, -0.6, 0]}
        label="Game Arcade"
        color="#39FF14"
        onClick={() => onEnterExperience('arcade')}
      />
      <Portal
        position={[5.8, 0.5, -2]}
        rotation={[0, -1.0, 0]}
        label="Tour the Palace"
        color="#FFB844"
        onClick={() => onEnterExperience('palace')}
      />

      {/* === SECONDARY PORTALS — forward row, clearly visible === */}
      <Portal
        position={[-4.0, 0.5, 1.5]}
        rotation={[0, 1.4, 0]}
        label="Night Watch"
        color="#8b5cf6"
        onClick={() => onEnterExperience('nightWatch')}
      />
      <Portal
        position={[4.0, 0.5, 1.5]}
        rotation={[0, -1.4, 0]}
        label="Morning Watch"
        color="#f59e0b"
        onClick={() => onEnterExperience('morningWatch')}
      />
      <Portal
        position={[0, 0.5, 3.5]}
        rotation={[0, Math.PI, 0]}
        label="Sword of the Spirit"
        color="#FF4466"
        onClick={() => onEnterExperience('swordOfTheSpirit')}
      />

      {/* Candlesticks for secondary portals */}
      <Candlestick position={[-5.3, -1.2, 1.8]} />
      <Candlestick position={[5.3, -1.2, 1.8]} />
      <Candlestick position={[-1.3, -1.2, 1.3]} />
      <Candlestick position={[1.3, -1.2, 1.3]} />
    </group>
  );
}
