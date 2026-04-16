import { Suspense, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Interactive } from '@react-three/xr';
import * as THREE from 'three';

interface BackToLobbyButtonProps {
  onBack: () => void;
  position?: [number, number, number];
  label?: string;
}

export function BackToLobbyButton({ onBack, position = [0, 0.2, -1.5], label = '← Back' }: BackToLobbyButtonProps) {
  const glowRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pulse = 0.4 + Math.sin(t * 2.5) * 0.2;
    if (glowRef.current) {
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = pulse;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 0.4 + Math.sin(t * 2.5) * 0.2;
    }
  });

  return (
    <group position={position}>
      {/* Pulsing glow border */}
      <mesh ref={glowRef} position={[0, 0, -0.01]}>
        <planeGeometry args={[2.0, 0.48]} />
        <meshBasicMaterial
          color="#00AAFF"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <Interactive onSelect={onBack}>
        <mesh onClick={onBack} onPointerDown={onBack}>
          <planeGeometry args={[1.8, 0.4]} />
          <meshStandardMaterial
            color="#0a1428"
            emissive="#00AAFF"
            emissiveIntensity={0.25}
          />
        </mesh>
      </Interactive>

      <Suspense fallback={null}>
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.14}
          color="#66DDFF"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.006}
          outlineColor="#003366"
        >
          {label}
        </Text>
      </Suspense>

      <pointLight ref={lightRef} position={[0, 0, 0.3]} color="#00AAFF" intensity={0.4} distance={3} />
    </group>
  );
}
