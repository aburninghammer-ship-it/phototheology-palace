import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COSMIC } from '../utils/cosmicTheme';

// ─── Procedural texture helpers ───────────────────────────────────────

function createNebulaTexture(
  size: number,
  colors: { stop: number; color: string }[],
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const half = size / 2;

  const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
  colors.forEach(({ stop, color }) => grad.addColorStop(stop, color));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function createFloorTexture(): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const half = size / 2;

  // Dark base
  ctx.fillStyle = '#0a0804';
  ctx.fillRect(0, 0, size, size);

  // Radial gold highlight in center
  const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
  grad.addColorStop(0, 'rgba(180,140,40,0.12)');
  grad.addColorStop(0.3, 'rgba(120,90,20,0.06)');
  grad.addColorStop(0.6, 'rgba(60,40,10,0.03)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Tile pattern — subtle grid lines
  ctx.strokeStyle = 'rgba(180,140,40,0.04)';
  ctx.lineWidth = 1;
  const tileSize = 64;
  for (let x = 0; x <= size; x += tileSize) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, size); ctx.stroke();
  }
  for (let y = 0; y <= size; y += tileSize) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(size, y); ctx.stroke();
  }

  // Noise specks for marble feel
  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const a = 0.02 + Math.random() * 0.04;
    ctx.fillStyle = `rgba(200,160,50,${a})`;
    ctx.fillRect(x, y, 1, 1);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

// ─── Floating golden ember particles ─────────────────────────────────

export function SanctuaryParticles({ count = 350 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorObj = useMemo(() => new THREE.Color(), []);

  const particles = useMemo(() => {
    const colors = ['#C4B5FD', '#93C5FD', '#F9A8D4', '#67E8F9', '#FFFFFF', '#E9D5FF', '#A78BFA'];
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 28,
      y: Math.random() * 12 - 1,
      z: (Math.random() - 0.5) * 28 - 3,
      speed: 0.015 + Math.random() * 0.05,
      wobble: Math.random() * Math.PI * 2,
      scale: 0.008 + Math.random() * 0.035,
      color: colors[Math.floor(Math.random() * colors.length)],
      phase: Math.random() * Math.PI * 2,
      drift: 0.3 + Math.random() * 1.2,
    }));
  }, [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    particles.forEach((p, i) => {
      const y = ((p.y + p.speed * t) % 13) - 1;
      dummy.position.set(
        p.x + Math.sin(t * 0.15 + p.wobble) * p.drift,
        y,
        p.z + Math.cos(t * 0.12 + p.wobble) * p.drift,
      );
      const twinkle = 0.3 + Math.sin(t * 3 + p.phase) * 0.4 + Math.sin(t * 7 + p.phase * 2) * 0.3;
      dummy.scale.setScalar(p.scale * Math.max(0.1, twinkle));
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
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.95}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

// ─── Volumetric light shafts ─────────────────────────────────────────

export function LightShafts() {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = Math.sin(t * 0.025) * 0.06;
    // Animate individual shaft opacity
    ref.current.children.forEach((child, i) => {
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      if (mat && mat.opacity !== undefined) {
        mat.opacity = 0.03 + Math.sin(t * 0.3 + i * 1.5) * 0.02;
      }
    });
  });

  const shafts = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      x: (i - 5.5) * 1.8 + (Math.random() - 0.5) * 0.8,
      z: -4 + (Math.random() - 0.5) * 4,
      width: 0.4 + Math.random() * 0.6,
      opacity: 0.03 + Math.random() * 0.04,
      angle: (Math.random() - 0.5) * 0.06,
    }));
  }, []);

  return (
    <group ref={ref}>
      {shafts.map((s, i) => (
        <mesh key={i} position={[s.x, 5, s.z]} rotation={[0, 0, s.angle]}>
          <planeGeometry args={[s.width, 14]} />
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

// ─── Golden reflective floor with procedural texture ──────────────────

export function SanctuaryFloor() {
  const floorTex = useMemo(() => createFloorTexture(), []);

  return (
    <group>
      {/* Primary floor — dark gold polished marble */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
        <circleGeometry args={[18, 96]} />
        <meshPhysicalMaterial
          map={floorTex}
          color="#1a1408"
          metalness={0.92}
          roughness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.03}
          envMapIntensity={2.5}
          reflectivity={1}
        />
      </mesh>

      {/* Ornate concentric rings */}
      {[4, 6.5, 9, 11.5].map((r, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.19, 0]}>
          <ringGeometry args={[r, r + 0.08, 96]} />
          <meshStandardMaterial
            color="#FFD700"
            emissive="#FFD700"
            emissiveIntensity={0.5 - i * 0.08}
            transparent
            opacity={0.35 - i * 0.05}
          />
        </mesh>
      ))}

      {/* Central sacred geometry — star pattern */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const len = 3.5;
        return (
          <mesh
            key={`ray-${i}`}
            rotation={[-Math.PI / 2, 0, angle]}
            position={[0, -1.185, 0]}
          >
            <planeGeometry args={[0.03, len]} />
            <meshStandardMaterial
              color="#FFD700"
              emissive="#FFD700"
              emissiveIntensity={0.8}
              transparent
              opacity={0.25}
            />
          </mesh>
        );
      })}

      {/* Floor glow — golden warmth from center */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.18, 0]}>
        <circleGeometry args={[5, 64]} />
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

// ─── Grand golden pillars with animated torch flames ────────────────

export function SanctuaryPillars() {
  const flameRefs = useRef<(THREE.Mesh | null)[]>([]);
  const lightRefs = useRef<(THREE.PointLight | null)[]>([]);

  const pillars = useMemo(() => {
    const items: { x: number; z: number; height: number; angle: number }[] = [];
    const count = 12;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 10;
      items.push({
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius - 2,
        height: 7 + Math.random() * 1,
        angle,
      });
    }
    return items;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    pillars.forEach((p, i) => {
      const flame = flameRefs.current[i];
      const light = lightRefs.current[i];
      const offset = p.x * 3 + p.z * 2;
      if (flame) {
        const s = 0.7 + Math.sin(t * 8 + offset) * 0.2 + Math.sin(t * 13 + offset) * 0.1;
        flame.scale.set(s, s * 1.4 + Math.sin(t * 6 + offset) * 0.3, s);
      }
      if (light) {
        light.intensity = 0.6 + Math.sin(t * 5 + offset) * 0.25 + Math.sin(t * 11 + offset) * 0.15;
      }
    });
  });

  return (
    <group>
      {pillars.map((p, i) => (
        <group key={i} position={[p.x, -1.2, p.z]}>
          {/* Fluted column body */}
          <mesh castShadow>
            <cylinderGeometry args={[0.16, 0.22, p.height, 16]} />
            <meshPhysicalMaterial
              color="#7B6525"
              metalness={0.93}
              roughness={0.07}
              emissive="#FFD700"
              emissiveIntensity={0.03}
              clearcoat={0.8}
              clearcoatRoughness={0.05}
              envMapIntensity={2.0}
            />
          </mesh>

          {/* Ornate capital — layered */}
          <mesh position={[0, p.height / 2, 0]}>
            <cylinderGeometry args={[0.32, 0.16, 0.3, 16]} />
            <meshPhysicalMaterial
              color="#A08830"
              metalness={0.95}
              roughness={0.05}
              emissive="#FFD700"
              emissiveIntensity={0.2}
              clearcoat={1}
            />
          </mesh>
          {/* Capital crown ring */}
          <mesh position={[0, p.height / 2 + 0.12, 0]}>
            <torusGeometry args={[0.28, 0.025, 8, 32]} />
            <meshStandardMaterial
              color="#FFD700"
              emissive="#FFD700"
              emissiveIntensity={1.2}
              metalness={0.95}
              roughness={0.05}
            />
          </mesh>
          {/* Secondary decorative ring */}
          <mesh position={[0, p.height / 2 - 0.2, 0]}>
            <torusGeometry args={[0.2, 0.015, 6, 24]} />
            <meshStandardMaterial
              color="#FFD700"
              emissive="#FFD700"
              emissiveIntensity={0.6}
              transparent
              opacity={0.7}
            />
          </mesh>

          {/* Mid-column decorative band */}
          <mesh position={[0, 0, 0]}>
            <torusGeometry args={[0.19, 0.012, 6, 24]} />
            <meshStandardMaterial
              color="#D4A830"
              emissive="#FFD700"
              emissiveIntensity={0.3}
              transparent
              opacity={0.5}
            />
          </mesh>

          {/* Base pedestal — wider, more ornate */}
          <mesh position={[0, -p.height / 2 + 0.1, 0]}>
            <cylinderGeometry args={[0.3, 0.38, 0.2, 16]} />
            <meshPhysicalMaterial
              color="#6B5B25"
              metalness={0.88}
              roughness={0.1}
              clearcoat={0.6}
            />
          </mesh>
          {/* Base ring */}
          <mesh position={[0, -p.height / 2 + 0.2, 0]}>
            <torusGeometry args={[0.32, 0.015, 6, 24]} />
            <meshStandardMaterial
              color="#FFD700"
              emissive="#FFD700"
              emissiveIntensity={0.4}
              transparent
              opacity={0.5}
            />
          </mesh>

          {/* Torch flame — multi-layered for realism */}
          <group position={[0, p.height / 2 + 0.35, 0]}>
            {/* Outer glow */}
            <mesh>
              <sphereGeometry args={[0.15, 12, 12]} />
              <meshBasicMaterial
                color="#FF8800"
                transparent
                opacity={0.15}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
            {/* Mid flame */}
            <mesh>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshBasicMaterial
                color="#FFAA22"
                transparent
                opacity={0.4}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
            {/* Core flame */}
            <mesh ref={el => { flameRefs.current[i] = el; }}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshBasicMaterial
                color="#FFD700"
                transparent
                opacity={0.95}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          </group>

          <pointLight
            ref={el => { lightRefs.current[i] = el; }}
            position={[0, p.height / 2 + 0.5, 0]}
            color="#FFB347"
            intensity={0.6}
            distance={5}
            decay={2}
          />
        </group>
      ))}
    </group>
  );
}

// ─── Cosmic dome ceiling with nebula layers & animated stars ────────

export function SanctuaryDome() {
  const starsRef = useRef<THREE.Points>(null);

  const { positions: starPositions, colors: starColors } = useMemo(() => {
    const count = 1200;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorObj = new THREE.Color();
    const palette = COSMIC.starPalette;

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.55;
      const r = 17 + Math.random() * 4;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi) + 2;
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) - 2;

      colorObj.set(palette[Math.floor(Math.random() * palette.length)]);
      col[i * 3] = colorObj.r;
      col[i * 3 + 1] = colorObj.g;
      col[i * 3 + 2] = colorObj.b;
    }
    return { positions: pos, colors: col };
  }, []);

  const nebulaTex1 = useMemo(() => createNebulaTexture(512, [
    { stop: 0, color: 'rgba(107,33,168,0.2)' },
    { stop: 0.3, color: 'rgba(192,38,211,0.1)' },
    { stop: 0.6, color: 'rgba(67,56,202,0.05)' },
    { stop: 1, color: 'rgba(0,0,0,0)' },
  ]), []);

  const nebulaTex2 = useMemo(() => createNebulaTexture(512, [
    { stop: 0, color: 'rgba(124,58,237,0.15)' },
    { stop: 0.4, color: 'rgba(37,99,235,0.08)' },
    { stop: 0.7, color: 'rgba(30,27,75,0.03)' },
    { stop: 1, color: 'rgba(0,0,0,0)' },
  ]), []);

  const nebulaTex3 = useMemo(() => createNebulaTexture(512, [
    { stop: 0, color: 'rgba(219,39,119,0.12)' },
    { stop: 0.3, color: 'rgba(192,38,211,0.06)' },
    { stop: 0.7, color: 'rgba(67,56,202,0.03)' },
    { stop: 1, color: 'rgba(0,0,0,0)' },
  ]), []);

  useFrame(({ clock }) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = clock.getElapsedTime() * 0.003;
    }
  });

  return (
    <group>
      {/* Dome shell — deep cosmic */}
      <mesh position={[0, 2, -2]}>
        <sphereGeometry args={[20, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#060818"
          side={THREE.BackSide}
          emissive="#0c1030"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Nebula clouds — multiple positioned layers */}
      <mesh position={[4, 10, -8]}>
        <planeGeometry args={[12, 12]} />
        <meshBasicMaterial
          map={nebulaTex1}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[-5, 12, -4]} rotation={[0.3, 0.5, 0.2]}>
        <planeGeometry args={[14, 14]} />
        <meshBasicMaterial
          map={nebulaTex2}
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[2, 9, -12]} rotation={[-0.1, -0.3, 0.1]}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial
          map={nebulaTex3}
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Stars with vertex colors */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={starPositions.length / 3}
            array={starPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={starColors.length / 3}
            array={starColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          transparent
          opacity={0.95}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexColors
        />
      </points>
    </group>
  );
}

// ─── Sacred center orb with orbiting rings ───────────────────────────

export function CenterOrb() {
  const orbRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const orbit2Ref = useRef<THREE.Mesh>(null);
  const orbit3Ref = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (orbRef.current) {
      const pulse = 1 + Math.sin(t * 1.2) * 0.12 + Math.sin(t * 3) * 0.05;
      orbRef.current.scale.setScalar(pulse);
      orbRef.current.rotation.y = t * 0.3;
      orbRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
    }
    if (haloRef.current) {
      haloRef.current.rotation.z = t * 0.15;
      haloRef.current.rotation.x = Math.sin(t * 0.25) * 0.2;
    }
    if (orbit2Ref.current) {
      orbit2Ref.current.rotation.y = t * 0.2;
      orbit2Ref.current.rotation.z = t * 0.1;
    }
    if (orbit3Ref.current) {
      orbit3Ref.current.rotation.x = t * 0.12;
      orbit3Ref.current.rotation.z = -t * 0.08;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 3 + Math.sin(t * 1.5) * 1;
    }
  });

  return (
    <group position={[0, 1.0, -3]}>
      {/* Core sacred orb */}
      <mesh ref={orbRef}>
        <icosahedronGeometry args={[0.3, 4]} />
        <meshPhysicalMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={5}
          metalness={0.4}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.02}
          transparent
          opacity={0.97}
        />
      </mesh>

      {/* Inner corona */}
      <mesh>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Mid glow */}
      <mesh>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial
          color="#FFE8A0"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Outer atmospheric glow */}
      <mesh>
        <sphereGeometry args={[1.3, 12, 12]} />
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={0.03}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Primary halo ring */}
      <mesh ref={haloRef}>
        <torusGeometry args={[0.7, 0.018, 12, 64]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={4}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Second orbit ring */}
      <mesh ref={orbit2Ref} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.95, 0.01, 8, 64]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={2.5}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Third orbit ring — perpendicular */}
      <mesh ref={orbit3Ref} rotation={[Math.PI / 2, Math.PI / 4, 0]}>
        <torusGeometry args={[1.1, 0.006, 6, 48]} />
        <meshStandardMaterial
          color="#FFE4A0"
          emissive="#FFD700"
          emissiveIntensity={1.5}
          transparent
          opacity={0.3}
        />
      </mesh>

      <pointLight ref={lightRef} color="#FFD700" intensity={3} distance={12} decay={2} />
      <pointLight color="#FFA500" intensity={1} distance={6} decay={2} position={[0, -0.5, 0]} />
    </group>
  );
}

// ─── Candlestick / torch for portal flanking ─────────────────────────

export function Candlestick({ position }: { position: [number, number, number] }) {
  const flameRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + position[0] * 5 + position[2] * 3;
    if (flameRef.current) {
      const s = 0.7 + Math.sin(t * 7) * 0.2 + Math.sin(t * 11) * 0.1;
      flameRef.current.scale.set(s, s * 1.4 + Math.sin(t * 5) * 0.2, s);
    }
    if (lightRef.current) {
      lightRef.current.intensity = 0.7 + Math.sin(t * 6) * 0.25 + Math.sin(t * 10) * 0.15;
    }
  });

  return (
    <group position={position}>
      {/* Ornate base */}
      <mesh>
        <cylinderGeometry args={[0.07, 0.12, 0.12, 10]} />
        <meshPhysicalMaterial color="#8B7535" metalness={0.92} roughness={0.08} clearcoat={0.5} />
      </mesh>
      {/* Stem */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.025, 0.04, 0.9, 10]} />
        <meshPhysicalMaterial color="#A08830" metalness={0.92} roughness={0.08} clearcoat={0.6} />
      </mesh>
      {/* Mid-stem ornament */}
      <mesh position={[0, 0.5, 0]}>
        <torusGeometry args={[0.04, 0.008, 6, 16]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
      </mesh>
      {/* Cup */}
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.065, 0.025, 0.1, 10]} />
        <meshPhysicalMaterial color="#8B7535" metalness={0.92} roughness={0.08} />
      </mesh>
      {/* Flame outer glow */}
      <mesh position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial
          color="#FF8800"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Flame core */}
      <mesh ref={flameRef} position={[0, 1.08, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <pointLight
        ref={lightRef}
        position={[0, 1.15, 0]}
        color="#FFB347"
        intensity={0.7}
        distance={3.5}
        decay={2}
      />
    </group>
  );
}
