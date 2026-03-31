import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StarFieldProps {
  count?: number;
  radius?: number;
  brightness?: number; // 0-1, can be driven by audio analyser
}

export function StarField({ count = 2000, radius = 50, brightness = 1 }: StarFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Distribute on a sphere surface with some depth variation
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.7 + Math.random() * 0.3);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      sz[i] = 0.5 + Math.random() * 2;
    }
    return [pos, sz];
  }, [count, radius]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    // Slow rotation for sense of motion
    pointsRef.current.rotation.y = clock.getElapsedTime() * 0.01;
    pointsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.005) * 0.02;

    // Pulse brightness with audio
    const mat = pointsRef.current.material as THREE.PointsMaterial;
    mat.opacity = 0.6 + brightness * 0.4;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#ffffff"
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
