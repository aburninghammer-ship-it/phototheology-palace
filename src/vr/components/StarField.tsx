import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COSMIC } from '../utils/cosmicTheme';

interface StarFieldProps {
  count?: number;
  radius?: number;
  brightness?: number;
  showMoon?: boolean;
  showShootingStars?: boolean;
}

export function StarField({
  count = 2000,
  radius = 50,
  brightness = 1,
  showMoon = true,
  showShootingStars = true,
}: StarFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, sizes, colors] = useMemo(() => {
    const palette = COSMIC.starPalette;
    const colorObj = new THREE.Color();
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.7 + Math.random() * 0.3);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      sz[i] = 0.5 + Math.random() * 2;
      colorObj.set(palette[Math.floor(Math.random() * palette.length)]);
      col[i * 3] = colorObj.r;
      col[i * 3 + 1] = colorObj.g;
      col[i * 3 + 2] = colorObj.b;
    }
    return [pos, sz, col];
  }, [count, radius]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = clock.getElapsedTime() * 0.01;
    pointsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.005) * 0.02;
    const mat = pointsRef.current.material as THREE.PointsMaterial;
    mat.opacity = 0.6 + brightness * 0.4;
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
          <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          transparent
          opacity={0.8}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexColors
        />
      </points>

      {showMoon && <CosmicMoon />}
      {showShootingStars && <ShootingStars />}
    </group>
  );
}

/** Glowing moon orb */
function CosmicMoon() {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    // Gentle pulse
    const s = 1 + Math.sin(t * 0.5) * 0.03;
    ref.current.scale.setScalar(s);
  });

  return (
    <group ref={ref} position={[15, 18, -25]}>
      {/* Core sphere */}
      <mesh>
        <sphereGeometry args={[2, 24, 24]} />
        <meshBasicMaterial color={COSMIC.moonCore} />
      </mesh>
      {/* Inner glow */}
      <mesh>
        <sphereGeometry args={[2.6, 16, 16]} />
        <meshBasicMaterial
          color={COSMIC.moonGlow}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Outer halo */}
      <mesh>
        <sphereGeometry args={[4, 12, 12]} />
        <meshBasicMaterial
          color="#C4B5FD"
          transparent
          opacity={0.04}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <pointLight color={COSMIC.moonGlow} intensity={0.8} distance={60} decay={2} />
    </group>
  );
}

/** Animated shooting star streaks */
function ShootingStars() {
  const count = 5;
  const refs = useRef<(THREE.Mesh | null)[]>([]);

  const meteors = useMemo(() =>
    Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 60,
      y: 15 + Math.random() * 20,
      z: -20 - Math.random() * 30,
      speed: 8 + Math.random() * 12,
      angle: -0.5 - Math.random() * 0.8,       // downward angle
      length: 1 + Math.random() * 2,
      delay: Math.random() * 20,                // stagger starts
      period: 8 + Math.random() * 15,           // how often it fires
    })),
  []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meteors.forEach((m, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;

      const cycleT = (t - m.delay) % m.period;
      const duration = 1.5; // visible for 1.5s per cycle

      if (cycleT < 0 || cycleT > duration) {
        mesh.visible = false;
        return;
      }

      mesh.visible = true;
      const progress = cycleT / duration;
      const travel = progress * m.speed * duration;

      mesh.position.set(
        m.x + Math.cos(m.angle) * travel,
        m.y + Math.sin(m.angle) * travel,
        m.z,
      );

      // Fade in then out
      const alpha = progress < 0.2 ? progress / 0.2 : 1 - (progress - 0.2) / 0.8;
      (mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, alpha * 0.9);
    });
  });

  return (
    <group>
      {meteors.map((m, i) => (
        <mesh
          key={i}
          ref={el => { refs.current[i] = el; }}
          rotation={[0, 0, m.angle]}
          visible={false}
        >
          <planeGeometry args={[m.length, 0.04]} />
          <meshBasicMaterial
            color={COSMIC.shootingCore}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}
