import { Suspense } from 'react';
import { Text } from '@react-three/drei';
import { Interactive } from '@react-three/xr';

interface BackToLobbyButtonProps {
  onBack: () => void;
  position?: [number, number, number];
}

export function BackToLobbyButton({ onBack, position = [0, 0.2, 1.5] }: BackToLobbyButtonProps) {
  return (
    <group position={position}>
      <Interactive onSelect={onBack}>
        <mesh onClick={onBack} onPointerDown={onBack}>
          <planeGeometry args={[1.5, 0.3]} />
          <meshStandardMaterial
            color="#220808"
            emissive="#FF4444"
            emissiveIntensity={0.15}
          />
        </mesh>
      </Interactive>
      <Suspense fallback={null}>
        <Text position={[0, 0, 0.01]} fontSize={0.11} color="#FF6666" anchorX="center" anchorY="middle">
          Back to Lobby
        </Text>
      </Suspense>
    </group>
  );
}
