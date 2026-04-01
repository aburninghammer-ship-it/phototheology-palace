import { Suspense, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Portal } from './components/Portal';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export type VRExperience = 'lobby' | 'sanctuary' | 'gallery' | 'audio' | 'heavensDiary' | 'arcade';

interface VRLobbyProps {
  onEnterExperience: (experience: VRExperience) => void;
}

/** Floating particles that drift upward and respawn */
function FloatingParticles({ count = 60 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 14,
      y: Math.random() * 5 - 1,
      z: (Math.random() - 0.5) * 14 - 2,
      speed: 0.1 + Math.random() * 0.2,
      wobble: Math.random() * Math.PI * 2,
      scale: 0.02 + Math.random() * 0.04,
    }));
  }, [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    particles.forEach((p, i) => {
      const y = ((p.y + p.speed * t) % 6) - 1;
      dummy.position.set(
        p.x + Math.sin(t * 0.5 + p.wobble) * 0.3,
        y,
        p.z + Math.cos(t * 0.4 + p.wobble) * 0.3,
      );
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#e8d5b7" transparent opacity={0.6} />
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
      <torusGeometry args={[radius, 0.01, 8, 64]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.5}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

/** Pulsing center orb */
function CenterOrb() {
  const ref = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const pulse = 1 + Math.sin(t * 1.5) * 0.15;
    ref.current.scale.setScalar(pulse);
    if (lightRef.current) {
      lightRef.current.intensity = 0.5 + Math.sin(t * 1.5) * 0.3;
    }
  });

  return (
    <group position={[0, 0.5, -2]}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color="#e8d5b7"
          emissive="#e8d5b7"
          emissiveIntensity={2}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Outer glow shell */}
      <mesh>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial color="#e8d5b7" transparent opacity={0.08} />
      </mesh>
      <pointLight ref={lightRef} color="#e8d5b7" intensity={0.5} distance={3} />
    </group>
  );
}

export function VRLobby({ onEnterExperience }: VRLobbyProps) {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.3} roughness={0.8} />
      </mesh>

      {/* Ceiling — subtle dark dome */}
      <mesh position={[0, 5, 0]}>
        <sphereGeometry args={[10, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#0a0a15" side={1} />
      </mesh>

      {/* Ambient lighting — boosted for XR visibility */}
      <ambientLight intensity={0.8} />
      <pointLight position={[0, 4, 0]} intensity={2} color="#e8d5b7" />
      <pointLight position={[-3, 3, -3]} intensity={1} color="#6366f1" />
      <pointLight position={[3, 3, -3]} intensity={1} color="#8b5cf6" />

      {/* Title — Suspense-wrapped so font loading doesn't block portal rendering */}
      <Suspense fallback={null}>
        <Text
          position={[0, 2.5, 0]}
          fontSize={0.35}
          color="#e8d5b7"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000"
        >
          PhototheologyOS VR Hub
        </Text>

        <Text
          position={[0, 2.1, 0]}
          fontSize={0.15}
          color="#888"
          anchorX="center"
          anchorY="middle"
        >
          Select a portal to begin your experience
        </Text>
      </Suspense>

      {/* Floating ambient particles */}
      <FloatingParticles />

      {/* Orbiting rings around center orb */}
      <OrbitRing radius={0.5} speed={0.4} color="#6366f1" yOffset={0} />
      <OrbitRing radius={0.7} speed={-0.25} color="#8b5cf6" yOffset={0.1} />
      <OrbitRing radius={0.35} speed={0.6} color="#e8d5b7" yOffset={-0.05} />

      {/* Pulsing center orb */}
      <CenterOrb />

      {/* Five portals arranged in a semicircle */}
      <Portal
        position={[-3, 0.5, -2]}
        rotation={[0, 0.5, 0]}
        label="The Sanctuary"
        color="#FFD700"
        onClick={() => onEnterExperience('sanctuary')}
      />
      <Portal
        position={[-1.5, 0.5, -3]}
        rotation={[0, 0.25, 0]}
        label="24FPS Gallery"
        color="#4488FF"
        onClick={() => onEnterExperience('gallery')}
      />
      <Portal
        position={[0, 0.5, -3.5]}
        rotation={[0, 0, 0]}
        label="Audio Theater"
        color="#9944FF"
        onClick={() => onEnterExperience('audio')}
      />
      <Portal
        position={[1.5, 0.5, -3]}
        rotation={[0, -0.25, 0]}
        label="Heaven's Diary"
        color="#44FFEE"
        onClick={() => onEnterExperience('heavensDiary')}
      />
      <Portal
        position={[3, 0.5, -2]}
        rotation={[0, -0.5, 0]}
        label="Game Arcade"
        color="#39FF14"
        onClick={() => onEnterExperience('arcade')}
      />
    </group>
  );
}
