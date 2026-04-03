import { useRef, useState, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Interactive } from '@react-three/xr';
import * as THREE from 'three';

interface PortalProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  label: string;
  color: string;
  onClick: () => void;
}

export function Portal({ position, rotation = [0, 0, 0], label, color, onClick }: PortalProps) {
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const archRef = useRef<THREE.Mesh>(null);
  const shimmerRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = hovered ? 1.5 : (0.5 + Math.sin(t * 2) * 0.3);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.3;
    }
    // Hover scale on arch
    if (archRef.current) {
      const targetScale = hovered ? 1.05 : 1.0;
      archRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
    // Shimmer on inner surface
    if (shimmerRef.current) {
      const mat = shimmerRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.08 + Math.sin(t * 3) * 0.04 + (hovered ? 0.06 : 0);
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Arch frame */}
      <mesh ref={archRef} castShadow>
        <torusGeometry args={[1.2, 0.12, 8, 32, Math.PI]} />
        <meshPhysicalMaterial
          color="#444"
          metalness={0.85}
          roughness={0.15}
          emissive={color}
          emissiveIntensity={hovered ? 0.3 : 0}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
          iridescence={0.3}
          iridescenceIOR={1.3}
        />
      </mesh>

      {/* Left pillar */}
      <mesh position={[-1.2, -0.6, 0]} castShadow>
        <boxGeometry args={[0.16, 1.2, 0.16]} />
        <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Right pillar */}
      <mesh position={[1.2, -0.6, 0]} castShadow>
        <boxGeometry args={[0.16, 1.2, 0.16]} />
        <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Glowing portal surface (visual only) */}
      <mesh
        ref={glowRef}
        position={[0, 0, 0.01]}
      >
        <circleGeometry args={[1.1, 32, 0, Math.PI]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/*
        Full-portal hit area — a large plane covering the entire portal.
        Uses a very subtle tint so Three.js raycaster registers it.
        Interactive wraps it for XR controller/hand select; onClick for desktop.
      */}
      <Interactive onSelect={onClick} onHover={() => setHovered(true)} onBlur={() => setHovered(false)}>
        <mesh position={[0, 0, 0.05]} onClick={onClick} onPointerDown={onClick}
          onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
          <planeGeometry args={[2.6, 2.8]} />
          <meshBasicMaterial color={color} transparent opacity={0.08} side={THREE.DoubleSide} />
        </mesh>
      </Interactive>

      {/* Shimmer surface */}
      <mesh ref={shimmerRef} position={[0, 0, 0.03]}>
        <circleGeometry args={[1.05, 32, 0, Math.PI]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      {/* Animated ring */}
      <mesh ref={ringRef} position={[0, 0, 0.02]}>
        <ringGeometry args={[0.9, 1.0, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Label — wrapped in Suspense so font loading doesn't block the portal */}
      <Suspense fallback={null}>
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="black"
        >
          {label}
        </Text>
      </Suspense>

      {/* Point light for glow effect */}
      <pointLight position={[0, 0, 0.5]} color={color} intensity={2} distance={4} />
    </group>
  );
}
