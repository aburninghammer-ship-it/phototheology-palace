import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** Floating golden ember particles */
export function SanctuaryParticles({ count = 200 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorObj = useMemo(() => new THREE.Color(), []);

  const particles = useMemo(() => {
    const colors = ['#FFD700', '#FFE4A0', '#FFFBE0', '#F5C542', '#E8A317', '#FFF8DC'];
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 24,
      y: Math.random() * 10 - 1,
      z: (Math.random() - 0.5) * 24 - 3,
      speed: 0.02 + Math.random() * 0.06,
      wobble: Math.random() * Math.PI * 2,
      scale: 0.01 + Math.random() * 0.03,
      color: colors[Math.floor(Math.random() * colors.length)],
      phase: Math.random() * Math.PI * 2,
    }));
  }, [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    particles.forEach((p, i) => {
      const y = ((p.y + p.speed * t) % 11) - 1;
      dummy.position.set(
        p.x + Math.sin(t * 0.2 + p.wobble) * 0.8,
        y,
        p.z + Math.cos(t * 0.15 + p.wobble) * 0.8,
      );
      const twinkle = 0.4 + Math.sin(t * 2.5 + p.phase) * 0.6;
      dummy.scale.setScalar(p.scale * twinkle);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      colorObj.set(p.color);
      meshRef.current!.setColorAt(i, colorObj);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

/** Warm golden light shafts from above */
export function LightShafts() {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.03) * 0.08;
  });

  const shafts = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      x: (i - 3.5) * 2.2 + (Math.random() - 0.5) * 1,
      z: -3 + (Math.random() - 0.5) * 3,
      width: 0.5 + Math.random() * 0.8,
      opacity: 0.04 + Math.random() * 0.05,
    }));
  }, []);

  return (
    <group ref={ref}>
      {shafts.map((s, i) => (
        <mesh key={i} position={[s.x, 4, s.z]} rotation={[0, 0, (Math.random() - 0.5) * 0.08]}>
          <planeGeometry args={[s.width, 10]} />
          <meshBasicMaterial
            color="#FFD700"
            transparent
            opacity={s.opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Golden reflective floor */
export function SanctuaryFloor() {
  return (
    <group>
      {/* Primary floor — warm golden polished stone */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
        <circleGeometry args={[15, 64]} />
        <meshPhysicalMaterial
          color="#1a1408"
          metalness={0.85}
          roughness={0.08}
          clearcoat={0.8}
          clearcoatRoughness={0.05}
          envMapIntensity={2.0}
        />
      </mesh>

      {/* Outer golden ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.19, -2]}>
        <ringGeometry args={[6, 6.15, 64]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={0.6}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Inner golden ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.19, -2]}>
        <ringGeometry args={[3.5, 3.6, 64]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Floor glow — golden warmth */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.18, -2]}>
        <circleGeometry args={[3, 48]} />
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/** Grand golden pillars with torch flames */
export function SanctuaryPillars() {
  const pillars = useMemo(() => {
    const items: { x: number; z: number; height: number }[] = [];
    const count = 10;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 9;
      items.push({
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius - 2,
        height: 6 + Math.random() * 1.5,
      });
    }
    return items;
  }, []);

  return (
    <group>
      {pillars.map((p, i) => (
        <group key={i} position={[p.x, -1.2, p.z]}>
          {/* Main column — golden */}
          <mesh castShadow>
            <cylinderGeometry args={[0.18, 0.22, p.height, 12]} />
            <meshPhysicalMaterial
              color="#8B7535"
              metalness={0.9}
              roughness={0.1}
              emissive="#FFD700"
              emissiveIntensity={0.04}
              clearcoat={0.6}
              envMapIntensity={1.5}
            />
          </mesh>
          {/* Top ornate capital */}
          <mesh position={[0, p.height / 2, 0]}>
            <cylinderGeometry args={[0.3, 0.18, 0.25, 12]} />
            <meshPhysicalMaterial
              color="#A08830"
              metalness={0.92}
              roughness={0.08}
              emissive="#FFD700"
              emissiveIntensity={0.15}
              clearcoat={0.8}
            />
          </mesh>
          {/* Decorative ring on capital */}
          <mesh position={[0, p.height / 2 - 0.15, 0]}>
            <torusGeometry args={[0.22, 0.02, 8, 24]} />
            <meshStandardMaterial
              color="#FFD700"
              emissive="#FFD700"
              emissiveIntensity={0.8}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          {/* Base pedestal */}
          <mesh position={[0, -p.height / 2 + 0.08, 0]}>
            <cylinderGeometry args={[0.28, 0.32, 0.16, 12]} />
            <meshPhysicalMaterial color="#6B5B25" metalness={0.85} roughness={0.12} clearcoat={0.5} />
          </mesh>
          {/* Torch flame light */}
          <pointLight
            position={[0, p.height / 2 + 0.5, 0]}
            color="#FFB347"
            intensity={0.6}
            distance={4}
            decay={2}
          />
          {/* Flame glow sphere */}
          <mesh position={[0, p.height / 2 + 0.35, 0]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial
              color="#FFD700"
              transparent
              opacity={0.7}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Cosmic dome ceiling — nebula + stars */
export function SanctuaryDome() {
  const starsRef = useRef<THREE.Points>(null);

  const starPositions = useMemo(() => {
    const count = 600;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.5;
      const r = 16 + Math.random() * 3;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi) + 2;
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) - 2;
    }
    return pos;
  }, []);

  const starSizes = useMemo(() => {
    const count = 600;
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      sizes[i] = 0.03 + Math.random() * 0.08;
    }
    return sizes;
  }, []);

  useFrame(({ clock }) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = clock.getElapsedTime() * 0.005;
    }
  });

  return (
    <group>
      {/* Dome shell — deep cosmic blue-gold */}
      <mesh position={[0, 2, -2]}>
        <sphereGeometry args={[18, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#050510"
          side={THREE.BackSide}
          emissive="#0a0820"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Nebula glow layer 1 — warm gold */}
      <mesh position={[3, 8, -6]}>
        <sphereGeometry args={[4, 16, 16]} />
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={0.015}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Nebula glow layer 2 — purple */}
      <mesh position={[-4, 10, -3]}>
        <sphereGeometry args={[5, 16, 16]} />
        <meshBasicMaterial
          color="#6B3FA0"
          transparent
          opacity={0.012}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Stars */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={starPositions.length / 3}
            array={starPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.07}
          color="#FFE8B0"
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

/** Pulsing center orb — golden sacred light */
export function CenterOrb() {
  const orbRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (orbRef.current) {
      const pulse = 1 + Math.sin(t * 1.2) * 0.15;
      orbRef.current.scale.setScalar(pulse);
      orbRef.current.rotation.y = t * 0.2;
    }
    if (haloRef.current) {
      haloRef.current.rotation.z = t * 0.1;
      haloRef.current.rotation.x = Math.sin(t * 0.3) * 0.15;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 2 + Math.sin(t * 1.2) * 0.8;
    }
  });

  return (
    <group position={[0, 1.0, -3]}>
      {/* Core orb */}
      <mesh ref={orbRef}>
        <icosahedronGeometry args={[0.25, 3]} />
        <meshPhysicalMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={4}
          metalness={0.3}
          roughness={0.15}
          clearcoat={1}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Inner glow */}
      <mesh>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[0.7, 12, 12]} />
        <meshBasicMaterial
          color="#FFE8A0"
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Main halo ring */}
      <mesh ref={haloRef}>
        <torusGeometry args={[0.6, 0.015, 8, 48]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={3}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Second orbit ring */}
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.85, 0.008, 8, 48]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={2}
          transparent
          opacity={0.4}
        />
      </mesh>

      <pointLight ref={lightRef} color="#FFD700" intensity={2} distance={10} decay={2} />
    </group>
  );
}

/** Candlestick/torch flanking portals */
export function Candlestick({ position }: { position: [number, number, number] }) {
  const flameRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + position[0] * 5;
    if (flameRef.current) {
      const s = 0.8 + Math.sin(t * 6) * 0.2 + Math.sin(t * 9) * 0.1;
      flameRef.current.scale.set(s, s * 1.3, s);
    }
    if (lightRef.current) {
      lightRef.current.intensity = 0.8 + Math.sin(t * 5) * 0.3;
    }
  });

  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.1, 0.1, 8]} />
        <meshPhysicalMaterial color="#8B7535" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Stem */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 0.9, 8]} />
        <meshPhysicalMaterial color="#A08830" metalness={0.9} roughness={0.1} clearcoat={0.5} />
      </mesh>
      {/* Cup */}
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.06, 0.03, 0.08, 8]} />
        <meshPhysicalMaterial color="#8B7535" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Flame */}
      <mesh ref={flameRef} position={[0, 1.08, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <pointLight ref={lightRef} position={[0, 1.1, 0]} color="#FFB347" intensity={0.8} distance={3} decay={2} />
    </group>
  );
}
