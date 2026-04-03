import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** Floating particles — purposeful, like fireflies or embers in a sanctuary */
export function SanctuaryParticles({ count = 120 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorObj = useMemo(() => new THREE.Color(), []);

  const particles = useMemo(() => {
    const colors = ['#FFD700', '#FFE4A0', '#FFFBE0', '#C5A050', '#8b7cc8', '#b8a0e0'];
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 20,
      y: Math.random() * 8 - 1,
      z: (Math.random() - 0.5) * 20 - 3,
      speed: 0.03 + Math.random() * 0.08,
      wobble: Math.random() * Math.PI * 2,
      scale: 0.015 + Math.random() * 0.035,
      color: colors[Math.floor(Math.random() * colors.length)],
      phase: Math.random() * Math.PI * 2,
    }));
  }, [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    particles.forEach((p, i) => {
      const y = ((p.y + p.speed * t) % 9) - 1;
      dummy.position.set(
        p.x + Math.sin(t * 0.3 + p.wobble) * 0.6,
        y,
        p.z + Math.cos(t * 0.25 + p.wobble) * 0.6,
      );
      // Twinkling
      const twinkle = 0.5 + Math.sin(t * 2 + p.phase) * 0.5;
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
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

/** Volumetric light shafts from above */
export function LightShafts() {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.05) * 0.1;
  });

  const shafts = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      x: (i - 2) * 2.5 + (Math.random() - 0.5) * 1.5,
      z: -3 + (Math.random() - 0.5) * 4,
      width: 0.4 + Math.random() * 0.6,
      opacity: 0.03 + Math.random() * 0.04,
    }));
  }, []);

  return (
    <group ref={ref}>
      {shafts.map((s, i) => (
        <mesh key={i} position={[s.x, 3, s.z]} rotation={[0, 0, (Math.random() - 0.5) * 0.1]}>
          <planeGeometry args={[s.width, 8]} />
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

/** Reflective floor with sanctuary feel */
export function SanctuaryFloor() {
  return (
    <group>
      {/* Primary floor — dark polished stone */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
        <circleGeometry args={[12, 64]} />
        <meshPhysicalMaterial
          color="#0c0c1e"
          metalness={0.7}
          roughness={0.15}
          clearcoat={0.5}
          clearcoatRoughness={0.1}
          envMapIntensity={1.0}
        />
      </mesh>

      {/* Floor ring accent — golden */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.19, -2]}>
        <ringGeometry args={[4.5, 4.6, 64]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Inner floor ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.19, -2]}>
        <ringGeometry args={[2.5, 2.55, 64]} />
        <meshStandardMaterial
          color="#6366f1"
          emissive="#6366f1"
          emissiveIntensity={0.4}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Floor glow under center */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.18, -2]}>
        <circleGeometry args={[2, 48]} />
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={0.04}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/** Floating architectural pillars around the space */
export function SanctuaryPillars() {
  const pillars = useMemo(() => {
    const items: { x: number; z: number; height: number; rotY: number }[] = [];
    const count = 8;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 8;
      items.push({
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius - 2,
        height: 5 + Math.random() * 2,
        rotY: angle,
      });
    }
    return items;
  }, []);

  return (
    <group>
      {pillars.map((p, i) => (
        <group key={i} position={[p.x, -1.2, p.z]}>
          {/* Main column */}
          <mesh castShadow>
            <cylinderGeometry args={[0.12, 0.15, p.height, 8]} />
            <meshPhysicalMaterial
              color="#1a1a2e"
              metalness={0.8}
              roughness={0.15}
              emissive="#6366f1"
              emissiveIntensity={0.03}
              clearcoat={0.4}
            />
          </mesh>
          {/* Top capital */}
          <mesh position={[0, p.height / 2, 0]}>
            <cylinderGeometry args={[0.2, 0.12, 0.15, 8]} />
            <meshPhysicalMaterial
              color="#2a2a3e"
              metalness={0.85}
              roughness={0.1}
              emissive="#FFD700"
              emissiveIntensity={0.1}
            />
          </mesh>
          {/* Base */}
          <mesh position={[0, -p.height / 2 + 0.05, 0]}>
            <cylinderGeometry args={[0.18, 0.2, 0.1, 8]} />
            <meshPhysicalMaterial color="#1a1a2e" metalness={0.8} roughness={0.15} />
          </mesh>
          {/* Pillar glow */}
          <pointLight
            position={[0, p.height / 2 + 0.3, 0]}
            color="#FFD700"
            intensity={0.3}
            distance={3}
            decay={2}
          />
        </group>
      ))}
    </group>
  );
}

/** Dome ceiling with stars */
export function SanctuaryDome() {
  const starsRef = useRef<THREE.Points>(null);

  const starPositions = useMemo(() => {
    const count = 400;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.45;
      const r = 14 + Math.random() * 2;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi) + 2;
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) - 2;
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = clock.getElapsedTime() * 0.01;
    }
  });

  return (
    <group>
      {/* Dome shell */}
      <mesh position={[0, 2, -2]}>
        <sphereGeometry args={[15, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#050510"
          side={THREE.BackSide}
          emissive="#0a0a20"
          emissiveIntensity={0.3}
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
          size={0.06}
          color="#FFE8B0"
          transparent
          opacity={0.8}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

/** Pulsing center orb — golden sacred orb */
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
      lightRef.current.intensity = 1.5 + Math.sin(t * 1.2) * 0.6;
    }
  });

  return (
    <group position={[0, 0.8, -2]}>
      {/* Core orb */}
      <mesh ref={orbRef}>
        <icosahedronGeometry args={[0.2, 2]} />
        <meshPhysicalMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={3}
          metalness={0.3}
          roughness={0.2}
          clearcoat={1}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Inner glow shell */}
      <mesh>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Outer glow shell */}
      <mesh>
        <sphereGeometry args={[0.55, 12, 12]} />
        <meshBasicMaterial
          color="#FFE8A0"
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Halo ring */}
      <mesh ref={haloRef}>
        <torusGeometry args={[0.5, 0.01, 8, 48]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={2}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Orbit rings */}
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[0.7, 0.008, 8, 48]} />
        <meshStandardMaterial
          color="#6366f1"
          emissive="#6366f1"
          emissiveIntensity={2}
          transparent
          opacity={0.4}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 6, Math.PI / 3, 0]}>
        <torusGeometry args={[0.85, 0.006, 8, 48]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={1.5}
          transparent
          opacity={0.3}
        />
      </mesh>

      <pointLight ref={lightRef} color="#FFD700" intensity={1.5} distance={8} decay={2} />
    </group>
  );
}
