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

/** High-detail procedural energy field texture */
function useEnergyTexture(color: string) {
  return useMemo(() => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const half = size / 2;

    // Deep radial gradient with richer stops
    const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
    grad.addColorStop(0, '#FFFFFFDD');
    grad.addColorStop(0.08, `${color}CC`);
    grad.addColorStop(0.2, `${color}88`);
    grad.addColorStop(0.35, `${color}55`);
    grad.addColorStop(0.5, `${color}33`);
    grad.addColorStop(0.7, `${color}15`);
    grad.addColorStop(0.85, `${color}08`);
    grad.addColorStop(1, `${color}00`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // Concentric energy rings — variable spacing
    for (let r = 10; r < half; r += 8 + Math.sin(r * 0.1) * 4) {
      const opacity = Math.max(0, 100 - r * 0.7);
      ctx.strokeStyle = `${color}${Math.floor(opacity).toString(16).padStart(2, '0')}`;
      ctx.lineWidth = 1 + Math.sin(r * 0.2) * 0.5;
      ctx.beginPath();
      ctx.arc(half, half, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Radial energy lines
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 12) {
      ctx.strokeStyle = `${color}18`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(half + Math.cos(a) * 30, half + Math.sin(a) * 30);
      ctx.lineTo(half + Math.cos(a) * half * 0.9, half + Math.sin(a) * half * 0.9);
      ctx.stroke();
    }

    // Noise-like dots for depth
    for (let i = 0; i < 400; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * half * 0.85;
      const x = half + Math.cos(angle) * dist;
      const y = half + Math.sin(angle) * dist;
      const alpha = 0.05 + Math.random() * 0.25;
      const dotSize = 0.5 + Math.random() * 2;
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, dotSize, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [color]);
}

/** Rune symbols on outer ring texture */
function useRuneTexture() {
  return useMemo(() => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, size, size);
    const half = size / 2;

    // Small glyphs around the ring
    const glyphs = '✦✧◆◇▲△♦♢☆★◈⬥';
    ctx.font = '14px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const r = half * 0.85;
      const x = half + Math.cos(angle) * r;
      const y = half + Math.sin(angle) * r;
      ctx.fillStyle = `rgba(255,215,0,${0.3 + Math.random() * 0.4})`;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle + Math.PI / 2);
      ctx.fillText(glyphs[i % glyphs.length], 0, 0);
      ctx.restore();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);
}

export function Portal({ position, rotation = [0, 0, 0], label, color, onClick }: PortalProps) {
  // Counter-rotate label so text always faces the viewer correctly
  const labelYRotation = -rotation[1];
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const energyRef = useRef<THREE.Mesh>(null);
  const decorRingRef = useRef<THREE.Mesh>(null);
  const runeRingRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const [hovered, setHovered] = useState(false);
  const energyTex = useEnergyTexture(color);
  const runeTex = useRuneTexture();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = t * 0.1;
      const s = hovered ? 1.1 : 1.0;
      outerRingRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.06);
    }

    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = -t * 0.18;
    }

    if (decorRingRef.current) {
      decorRingRef.current.rotation.z = t * 0.3;
    }

    if (runeRingRef.current) {
      runeRingRef.current.rotation.z = -t * 0.05;
    }

    if (energyRef.current) {
      const mat = energyRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = hovered
        ? 0.6 + Math.sin(t * 5) * 0.15
        : 0.35 + Math.sin(t * 2) * 0.1;
      energyRef.current.rotation.z = t * 0.04;
    }

    if (lightRef.current) {
      lightRef.current.intensity = hovered
        ? 6 + Math.sin(t * 4) * 2
        : 3.5 + Math.sin(t * 1.5) * 1;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* === THICK OUTER RING — ornate golden metallic === */}
      <mesh ref={outerRingRef} castShadow>
        <torusGeometry args={[1.4, 0.14, 32, 80]} />
        <meshPhysicalMaterial
          color="#B8962E"
          metalness={0.97}
          roughness={0.04}
          emissive={color}
          emissiveIntensity={hovered ? 0.6 : 0.15}
          clearcoat={1}
          clearcoatRoughness={0.02}
          iridescence={0.4}
          iridescenceIOR={1.6}
          envMapIntensity={2.5}
        />
      </mesh>

      {/* === INNER ACCENT RING === */}
      <mesh ref={innerRingRef}>
        <torusGeometry args={[1.22, 0.06, 20, 64]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.94}
          roughness={0.06}
          emissive={color}
          emissiveIntensity={1.0}
          clearcoat={0.9}
          clearcoatRoughness={0.03}
        />
      </mesh>

      {/* === DECORATIVE SEGMENTED RING === */}
      <mesh ref={decorRingRef} position={[0, 0, 0.01]}>
        <torusGeometry args={[1.3, 0.028, 8, 20]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={1.5}
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* === RUNE / GLYPH RING === */}
      <mesh ref={runeRingRef} position={[0, 0, 0.03]}>
        <ringGeometry args={[1.5, 1.65, 64]} />
        <meshBasicMaterial
          map={runeTex}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* === OUTER GLOW RING === */}
      <mesh position={[0, 0, -0.02]}>
        <torusGeometry args={[1.45, 0.25, 12, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* === ENERGY FIELD — the portal surface === */}
      <mesh ref={energyRef} position={[0, 0, 0.02]}>
        <circleGeometry args={[1.16, 80]} />
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

      {/* === LEFT PILLAR === */}
      <PortalPillar position={[-1.5, -0.8, 0]} color={color} />

      {/* === RIGHT PILLAR === */}
      <PortalPillar position={[1.5, -0.8, 0]} color={color} />

      {/* === INTERACTIVE HIT AREA === */}
      <Interactive onSelect={onClick} onHover={() => setHovered(true)} onBlur={() => setHovered(false)}>
        <mesh
          position={[0, 0, 0.05]}
          onClick={onClick}
          onPointerDown={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <circleGeometry args={[1.5, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.02} side={THREE.DoubleSide} />
        </mesh>
      </Interactive>

      {/* === LABEL === */}
      <Suspense fallback={null}>
        <group position={[0, 1.9, 0]}>
          {/* Text glow backing */}
          <mesh position={[0, 0, -0.02]}>
            <planeGeometry args={[2.2, 0.35]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.08}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          <Text
            fontSize={0.16}
            color={color}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.012}
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
        position={[0, 0, 1.2]}
        color={color}
        intensity={3.5}
        distance={7}
        decay={2}
      />
      <pointLight position={[0, 0, -0.6]} color={color} intensity={1.5} distance={4} decay={2} />
      <pointLight position={[0, -1.5, 0.3]} color={color} intensity={1} distance={3.5} decay={2} />
    </group>
  );
}

/** Ornate portal pillar sub-component */
function PortalPillar({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      {/* Main column */}
      <mesh castShadow>
        <cylinderGeometry args={[0.08, 0.11, 1.7, 12]} />
        <meshPhysicalMaterial
          color="#7B6525"
          metalness={0.93}
          roughness={0.06}
          emissive={color}
          emissiveIntensity={0.04}
          clearcoat={0.8}
          envMapIntensity={1.8}
        />
      </mesh>
      {/* Base */}
      <mesh position={[0, -0.87, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.18, 0.1, 12]} />
        <meshPhysicalMaterial color="#6B5B25" metalness={0.9} roughness={0.08} clearcoat={0.5} />
      </mesh>
      {/* Capital */}
      <mesh position={[0, 0.87, 0]}>
        <cylinderGeometry args={[0.14, 0.08, 0.1, 12]} />
        <meshPhysicalMaterial
          color="#A08830"
          metalness={0.94}
          roughness={0.06}
          emissive={color}
          emissiveIntensity={0.2}
          clearcoat={0.8}
        />
      </mesh>
      {/* Capital ring */}
      <mesh position={[0, 0.82, 0]}>
        <torusGeometry args={[0.1, 0.01, 6, 20]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
}
