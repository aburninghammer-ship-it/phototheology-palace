import { useRef, useState, Suspense, useMemo } from 'react';
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

/** Procedural energy field texture with more detail */
function useEnergyTexture(color: string) {
  return useMemo(() => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const half = size / 2;

    // Deep radial gradient
    const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
    grad.addColorStop(0, '#FFFFFFCC');
    grad.addColorStop(0.15, `${color}BB`);
    grad.addColorStop(0.35, `${color}66`);
    grad.addColorStop(0.55, `${color}33`);
    grad.addColorStop(0.75, `${color}11`);
    grad.addColorStop(1, `${color}00`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // Concentric energy rings
    for (let r = 15; r < half; r += 12) {
      const opacity = Math.max(0, 80 - r);
      ctx.strokeStyle = `${color}${Math.floor(opacity).toString(16).padStart(2, '0')}`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(half, half, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Noise-like dots for depth
    for (let i = 0; i < 200; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * half * 0.8;
      const x = half + Math.cos(angle) * dist;
      const y = half + Math.sin(angle) * dist;
      const alpha = 0.1 + Math.random() * 0.3;
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fillRect(x, y, 1.5, 1.5);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [color]);
}

export function Portal({ position, rotation = [0, 0, 0], label, color, onClick }: PortalProps) {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const energyRef = useRef<THREE.Mesh>(null);
  const decorRingRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const [hovered, setHovered] = useState(false);
  const energyTex = useEnergyTexture(color);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = t * 0.12;
      const s = hovered ? 1.08 : 1.0;
      outerRingRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.08);
    }

    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = -t * 0.2;
    }

    if (decorRingRef.current) {
      decorRingRef.current.rotation.z = t * 0.35;
    }

    if (energyRef.current) {
      const mat = energyRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = hovered
        ? 0.55 + Math.sin(t * 4) * 0.15
        : 0.3 + Math.sin(t * 2) * 0.1;
      // Subtle rotation of energy field
      energyRef.current.rotation.z = t * 0.05;
    }

    if (lightRef.current) {
      lightRef.current.intensity = hovered
        ? 5 + Math.sin(t * 3) * 2
        : 3 + Math.sin(t * 1.5) * 1;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* === THICK OUTER RING — ornate golden metallic === */}
      <mesh ref={outerRingRef} castShadow>
        <torusGeometry args={[1.35, 0.12, 24, 64]} />
        <meshPhysicalMaterial
          color="#B8962E"
          metalness={0.95}
          roughness={0.06}
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0.12}
          clearcoat={1}
          clearcoatRoughness={0.03}
          iridescence={0.3}
          iridescenceIOR={1.5}
          envMapIntensity={2.0}
        />
      </mesh>

      {/* === INNER ACCENT RING === */}
      <mesh ref={innerRingRef}>
        <torusGeometry args={[1.18, 0.05, 16, 48]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.92}
          roughness={0.08}
          emissive={color}
          emissiveIntensity={0.9}
          clearcoat={0.8}
        />
      </mesh>

      {/* === DECORATIVE SEGMENTED RING === */}
      <mesh ref={decorRingRef} position={[0, 0, 0.01]}>
        <torusGeometry args={[1.26, 0.025, 6, 16]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={1.2}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* === OUTER GLOW RING (soft bloom feeder) === */}
      <mesh position={[0, 0, -0.02]}>
        <torusGeometry args={[1.4, 0.2, 12, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.04}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* === ENERGY FIELD — the portal surface === */}
      <mesh ref={energyRef} position={[0, 0, 0.02]}>
        <circleGeometry args={[1.12, 64]} />
        <meshBasicMaterial
          map={energyTex}
          color={color}
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* === LEFT PILLAR — golden ornate column === */}
      <group position={[-1.4, -0.8, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.09, 0.12, 1.6, 10]} />
          <meshPhysicalMaterial
            color="#8B7535"
            metalness={0.92}
            roughness={0.08}
            emissive={color}
            emissiveIntensity={0.03}
            clearcoat={0.7}
          />
        </mesh>
        <mesh position={[0, -0.82, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.18, 0.08, 10]} />
          <meshPhysicalMaterial color="#6B5B25" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.82, 0]}>
          <cylinderGeometry args={[0.14, 0.09, 0.08, 10]} />
          <meshPhysicalMaterial color="#A08830" metalness={0.92} roughness={0.08} emissive={color} emissiveIntensity={0.15} />
        </mesh>
      </group>

      {/* === RIGHT PILLAR === */}
      <group position={[1.4, -0.8, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.09, 0.12, 1.6, 10]} />
          <meshPhysicalMaterial
            color="#8B7535"
            metalness={0.92}
            roughness={0.08}
            emissive={color}
            emissiveIntensity={0.03}
            clearcoat={0.7}
          />
        </mesh>
        <mesh position={[0, -0.82, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.18, 0.08, 10]} />
          <meshPhysicalMaterial color="#6B5B25" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.82, 0]}>
          <cylinderGeometry args={[0.14, 0.09, 0.08, 10]} />
          <meshPhysicalMaterial color="#A08830" metalness={0.92} roughness={0.08} emissive={color} emissiveIntensity={0.15} />
        </mesh>
      </group>

      {/* === INTERACTIVE HIT AREA === */}
      <Interactive onSelect={onClick} onHover={() => setHovered(true)} onBlur={() => setHovered(false)}>
        <mesh
          position={[0, 0, 0.05]}
          onClick={onClick}
          onPointerDown={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <circleGeometry args={[1.4, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.02} side={THREE.DoubleSide} />
        </mesh>
      </Interactive>

      {/* === LABEL — counter-rotate so text always faces forward === */}
      <Suspense fallback={null}>
        <group position={[0, 1.8, 0]}>
          <Text
            fontSize={0.15}
            color={color}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.008}
            outlineColor="#000"
            font={undefined}
          >
            {label}
          </Text>
        </group>
      </Suspense>

      {/* === GLOW LIGHTS === */}
      <pointLight
        ref={lightRef}
        position={[0, 0, 1]}
        color={color}
        intensity={3}
        distance={6}
        decay={2}
      />
      <pointLight
        position={[0, 0, -0.6]}
        color={color}
        intensity={1.5}
        distance={4}
        decay={2}
      />
      {/* Ground reflection light */}
      <pointLight
        position={[0, -1.5, 0.3]}
        color={color}
        intensity={0.8}
        distance={3}
        decay={2}
      />
    </group>
  );
}
