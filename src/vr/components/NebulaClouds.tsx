import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface NebulaCloudProps {
  position: [number, number, number];
  color: string;
  scale?: number;
  opacity?: number;
  zSpeed?: number;
}

function NebulaCloud({ position, color, scale = 5, opacity = 0.15, zSpeed = 0 }: NebulaCloudProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);
  const baseZ = useRef(position[2]);

  useFrame(({ clock, camera }, delta) => {
    if (!meshRef.current) return;
    // Billboard: always face camera
    meshRef.current.quaternion.copy(camera.quaternion);
    // Gentle drift
    const t = clock.getElapsedTime();
    meshRef.current.position.x = position[0] + Math.sin(t * 0.05 + offset) * 2;
    meshRef.current.position.y = position[1] + Math.cos(t * 0.03 + offset) * 1;

    // Z-travel: rush toward user when speed > 0
    baseZ.current += zSpeed * delta;
    // Reset if passed behind user
    if (baseZ.current > 20) {
      baseZ.current = -40 - Math.random() * 20;
    }
    meshRef.current.position.z = baseZ.current + Math.sin(t * 0.04 + offset) * 1.5;
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

interface NebulaCloudsProps {
  count?: number;
  radius?: number;
  colors?: string[];
  opacity?: number;
  zSpeed?: number;
}

export function NebulaClouds({
  count = 12,
  radius = 30,
  colors = ['#4a0080', '#0044aa', '#006644', '#880044'],
  opacity = 0.15,
  zSpeed = 0,
}: NebulaCloudsProps) {
  const clouds = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.5 + Math.random() * 0.5);
      return {
        position: [
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi),
        ] as [number, number, number],
        color: colors[i % colors.length],
        scale: 3 + Math.random() * 8,
      };
    });
  }, [count, radius, colors]);

  return (
    <group>
      {clouds.map((cloud, i) => (
        <NebulaCloud
          key={i}
          position={cloud.position}
          color={cloud.color}
          scale={cloud.scale}
          opacity={opacity}
          zSpeed={zSpeed}
        />
      ))}
    </group>
  );
}
