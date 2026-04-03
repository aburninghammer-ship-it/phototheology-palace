import { Suspense, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Portal } from './components/Portal';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export type VRExperience = 'lobby' | 'sanctuary' | 'gallery' | 'audio' | 'heavensDiary' | 'arcade' | 'palace' | 'nightWatch' | 'morningWatch' | 'swordOfTheSpirit';

interface VRLobbyProps {
  onEnterExperience: (experience: VRExperience) => void;
}

/** Floating particles — multi-colored, glowing */
function FloatingParticles({ count = 80 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorObj = useMemo(() => new THREE.Color(), []);

  const particles = useMemo(() => {
    const colors = ['#FFD700', '#6366f1', '#8b5cf6', '#44FFEE', '#FF6688', '#39FF14'];
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 16,
      y: Math.random() * 6 - 1,
      z: (Math.random() - 0.5) * 16 - 2,
      speed: 0.08 + Math.random() * 0.18,
      wobble: Math.random() * Math.PI * 2,
      scale: 0.02 + Math.random() * 0.05,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }, [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    particles.forEach((p, i) => {
      const y = ((p.y + p.speed * t) % 7) - 1;
      dummy.position.set(
        p.x + Math.sin(t * 0.5 + p.wobble) * 0.4,
        y,
        p.z + Math.cos(t * 0.4 + p.wobble) * 0.4,
      );
      dummy.scale.setScalar(p.scale);
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
      <meshBasicMaterial color="#ffffff" transparent opacity={0.7} blending={THREE.AdditiveBlending} depthWrite={false} />
    </instancedMesh>
  );
}

/** Slowly rotating ring around the center orb */
function OrbitRing({ radius, speed, color, yOffset }: { radius: number; speed: number; color: string; yOffset: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * speed;
    ref.current.rotation.x = Math.sin(clock.getElapsedTime() * speed * 0.3) * 0.2;
  });

  return (
    <mesh ref={ref} position={[0, 0.5 + yOffset, -2]}>
      <torusGeometry args={[radius, 0.015, 8, 64]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

/** Pulsing center orb — more vibrant */
function CenterOrb() {
  const ref = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const pulse = 1 + Math.sin(t * 1.5) * 0.18;
    ref.current.scale.setScalar(pulse);
    if (lightRef.current) {
      lightRef.current.intensity = 0.8 + Math.sin(t * 1.5) * 0.4;
    }
  });

  return (
    <group position={[0, 0.5, -2]}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={2.5}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Outer glow shell */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Second glow */}
      <mesh>
        <sphereGeometry args={[0.45, 12, 12]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.04} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <pointLight ref={lightRef} color="#FFD700" intensity={0.8} distance={5} />
    </group>
  );
}

export function VRLobby({ onEnterExperience }: VRLobbyProps) {
  return (
    <group>
      {/* Reflective dark floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
        <planeGeometry args={[22, 22]} />
        <meshStandardMaterial color="#12122a" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Subtle floor accent circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.19, -2]}>
        <ringGeometry args={[3, 6, 48]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.04} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Dark dome ceiling */}
      <mesh position={[0, 5, 0]}>
        <sphereGeometry args={[12, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#080815" side={1} />
      </mesh>

      {/* Fog for depth */}
      <fog attach="fog" args={['#0a0a18', 12, 30]} />

      {/* 3-point directional lighting */}
      <ambientLight intensity={0.25} color="#ccccee" />
      {/* Key: warm from above-right */}
      <directionalLight position={[4, 6, 2]} intensity={1.2} color="#FFD088" />
      {/* Fill: cool from left */}
      <directionalLight position={[-5, 3, 1]} intensity={0.4} color="#8888cc" />
      {/* Rim: indigo from behind */}
      <directionalLight position={[0, 3, -8]} intensity={0.6} color="#6366f1" />
      {/* Accent point lights for portal glow atmosphere */}
      <pointLight position={[-4, 3, -3]} intensity={0.6} color="#6366f1" distance={10} />
      <pointLight position={[4, 3, -3]} intensity={0.6} color="#8b5cf6" distance={10} />
      <pointLight position={[0, 2, -5]} intensity={0.4} color="#44FFEE" distance={8} />

      {/* Title */}
      <Suspense fallback={null}>
        <Text
          position={[0, 2.5, 0]}
          fontSize={0.35}
          color="#FFD700"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.012}
          outlineColor="#000"
        >
          PhototheologyOS VR Hub
        </Text>

        <Text
          position={[0, 2.1, 0]}
          fontSize={0.15}
          color="#AAAACC"
          anchorX="center"
          anchorY="middle"
        >
          Select a portal to begin your experience
        </Text>
      </Suspense>

      {/* Floating ambient particles — multi-colored */}
      <FloatingParticles />

      {/* Orbiting rings around center orb — more vibrant */}
      <OrbitRing radius={0.5} speed={0.4} color="#6366f1" yOffset={0} />
      <OrbitRing radius={0.7} speed={-0.25} color="#8b5cf6" yOffset={0.1} />
      <OrbitRing radius={0.35} speed={0.6} color="#FFD700" yOffset={-0.05} />
      <OrbitRing radius={0.9} speed={0.15} color="#44FFEE" yOffset={0.2} />

      {/* Pulsing center orb */}
      <CenterOrb />

      {/* Six portals in a wide semicircle (radius 5, ~27° apart) */}
      <Portal
        position={[-4.6, 0.5, -1.95]}
        rotation={[0, 1.17, 0]}
        label="The Sanctuary"
        color="#FFD700"
        onClick={() => onEnterExperience('sanctuary')}
      />
      <Portal
        position={[-3.2, 0.5, -3.8]}
        rotation={[0, 0.7, 0]}
        label="24FPS Gallery"
        color="#44AAFF"
        onClick={() => onEnterExperience('gallery')}
      />
      <Portal
        position={[-1.1, 0.5, -4.9]}
        rotation={[0, 0.23, 0]}
        label="Audio Theater"
        color="#BB66FF"
        onClick={() => onEnterExperience('audio')}
      />
      <Portal
        position={[1.1, 0.5, -4.9]}
        rotation={[0, -0.23, 0]}
        label="Heaven's Diary"
        color="#44FFEE"
        onClick={() => onEnterExperience('heavensDiary')}
      />
      <Portal
        position={[3.2, 0.5, -3.8]}
        rotation={[0, -0.7, 0]}
        label="Game Arcade"
        color="#39FF14"
        onClick={() => onEnterExperience('arcade')}
      />
      <Portal
        position={[4.6, 0.5, -1.95]}
        rotation={[0, -1.17, 0]}
        label="Tour the Palace"
        color="#FFB844"
        onClick={() => onEnterExperience('palace')}
      />

      {/* Watch portals — centered below main semicircle */}
      <Portal
        position={[-1.5, 0.5, -6.5]}
        rotation={[0, 0.15, 0]}
        label="Night Watch"
        color="#8b5cf6"
        onClick={() => onEnterExperience('nightWatch')}
      />
      <Portal
        position={[1.5, 0.5, -6.5]}
        rotation={[0, -0.15, 0]}
        label="Morning Watch"
        color="#f59e0b"
        onClick={() => onEnterExperience('morningWatch')}
      />

      {/* Sword of the Spirit game portal */}
      <Portal
        position={[0, 0.5, -7.5]}
        rotation={[0, 0, 0]}
        label="Sword of the Spirit"
        color="#FF4466"
        onClick={() => onEnterExperience('swordOfTheSpirit')}
      />
    </group>
  );
}
