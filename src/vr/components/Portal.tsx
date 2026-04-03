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

/** Procedural energy field texture */
function useEnergyTexture(color: string) {
  return useMemo(() => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const half = size / 2;

    // Radial gradient with color stops
    const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
    grad.addColorStop(0, `${color}CC`);
    grad.addColorStop(0.3, `${color}88`);
    grad.addColorStop(0.6, `${color}33`);
    grad.addColorStop(0.85, `${color}11`);
    grad.addColorStop(1, `${color}00`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // Concentric rings for energy feel
    ctx.strokeStyle = `${color}44`;
    ctx.lineWidth = 1;
    for (let r = 20; r < half; r += 18) {
      ctx.beginPath();
      ctx.arc(half, half, r, 0, Math.PI * 2);
      ctx.stroke();
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
  const runeRingRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const [hovered, setHovered] = useState(false);
  const energyTex = useEnergyTexture(color);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Outer ring slow rotation
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = t * 0.15;
      const s = hovered ? 1.06 : 1.0;
      outerRingRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.08);
    }

    // Inner ring counter-rotation
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = -t * 0.25;
    }

    // Rune ring faster rotation
    if (runeRingRef.current) {
      runeRingRef.current.rotation.z = t * 0.4;
    }

    // Energy field pulse
    if (energyRef.current) {
      const mat = energyRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = hovered
        ? 0.5 + Math.sin(t * 4) * 0.15
        : 0.25 + Math.sin(t * 2) * 0.1;
    }

    // Light intensity pulse
    if (lightRef.current) {
      lightRef.current.intensity = hovered
        ? 4 + Math.sin(t * 3) * 1.5
        : 2 + Math.sin(t * 1.5) * 0.8;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* === OUTER RING — thick metallic torus === */}
      <mesh ref={outerRingRef} castShadow>
        <torusGeometry args={[1.3, 0.08, 16, 64]} />
        <meshPhysicalMaterial
          color="#888"
          metalness={0.95}
          roughness={0.08}
          emissive={color}
          emissiveIntensity={hovered ? 0.6 : 0.15}
          clearcoat={1}
          clearcoatRoughness={0.05}
          iridescence={0.5}
          iridescenceIOR={1.5}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* === INNER RING — thinner accent ring === */}
      <mesh ref={innerRingRef}>
        <torusGeometry args={[1.15, 0.04, 12, 48]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.9}
          roughness={0.1}
          emissive={color}
          emissiveIntensity={0.8}
          clearcoat={0.8}
        />
      </mesh>

      {/* === RUNE RING — segmented decorative ring === */}
      <mesh ref={runeRingRef} position={[0, 0, 0.01]}>
        <torusGeometry args={[1.22, 0.02, 6, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* === LEFT PILLAR — ornate column === */}
      <group position={[-1.3, -0.7, 0]}>
        {/* Main column */}
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.1, 1.4, 8]} />
          <meshPhysicalMaterial
            color="#666"
            metalness={0.9}
            roughness={0.1}
            emissive={color}
            emissiveIntensity={0.05}
            clearcoat={0.6}
          />
        </mesh>
        {/* Base cap */}
        <mesh position={[0, -0.72, 0]} castShadow>
          <cylinderGeometry args={[0.14, 0.14, 0.06, 8]} />
          <meshPhysicalMaterial color="#555" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Top cap */}
        <mesh position={[0, 0.72, 0]}>
          <cylinderGeometry args={[0.12, 0.08, 0.06, 8]} />
          <meshPhysicalMaterial color="#555" metalness={0.9} roughness={0.1} emissive={color} emissiveIntensity={0.2} />
        </mesh>
      </group>

      {/* === RIGHT PILLAR — mirror of left === */}
      <group position={[1.3, -0.7, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.1, 1.4, 8]} />
          <meshPhysicalMaterial
            color="#666"
            metalness={0.9}
            roughness={0.1}
            emissive={color}
            emissiveIntensity={0.05}
            clearcoat={0.6}
          />
        </mesh>
        <mesh position={[0, -0.72, 0]} castShadow>
          <cylinderGeometry args={[0.14, 0.14, 0.06, 8]} />
          <meshPhysicalMaterial color="#555" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.72, 0]}>
          <cylinderGeometry args={[0.12, 0.08, 0.06, 8]} />
          <meshPhysicalMaterial color="#555" metalness={0.9} roughness={0.1} emissive={color} emissiveIntensity={0.2} />
        </mesh>
      </group>

      {/* === ENERGY FIELD — the portal surface === */}
      <mesh ref={energyRef} position={[0, 0, 0.02]}>
        <circleGeometry args={[1.1, 48]} />
        <meshBasicMaterial
          map={energyTex}
          color={color}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* === HIT AREA — invisible interactive surface === */}
      <Interactive onSelect={onClick} onHover={() => setHovered(true)} onBlur={() => setHovered(false)}>
        <mesh
          position={[0, 0, 0.05]}
          onClick={onClick}
          onPointerDown={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <circleGeometry args={[1.35, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.02} side={THREE.DoubleSide} />
        </mesh>
      </Interactive>

      {/* === LABEL — floating holographic text === */}
      <Suspense fallback={null}>
        <Text
          position={[0, 1.7, 0]}
          fontSize={0.16}
          color={color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.008}
          outlineColor="#000"
          font={undefined}
        >
          {label}
        </Text>
      </Suspense>

      {/* === GLOW LIGHTS === */}
      <pointLight
        ref={lightRef}
        position={[0, 0, 0.8]}
        color={color}
        intensity={2.5}
        distance={5}
        decay={2}
      />
      {/* Rim light behind portal */}
      <pointLight
        position={[0, 0, -0.5]}
        color={color}
        intensity={1}
        distance={3}
        decay={2}
      />
    </group>
  );
}
