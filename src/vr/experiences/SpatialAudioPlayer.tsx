import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { StarField } from '../components/StarField';

interface SpatialAudioPlayerProps {
  onBack: () => void;
}

// Simple fire particle system
function CampfireParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 60;

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.3;
      pos[i * 3 + 1] = Math.random() * 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
      vel[i * 3] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 1] = 0.01 + Math.random() * 0.02;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    return [pos, vel];
  }, []);

  useFrame(() => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3] += velocities[i * 3];
      arr[i * 3 + 1] += velocities[i * 3 + 1];
      arr[i * 3 + 2] += velocities[i * 3 + 2];
      // Reset particles that float too high
      if (arr[i * 3 + 1] > 1.5) {
        arr[i * 3] = (Math.random() - 0.5) * 0.3;
        arr[i * 3 + 1] = 0;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#FF6600"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function LogMesh({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return (
    <mesh position={position} rotation={rotation} castShadow>
      <cylinderGeometry args={[0.06, 0.08, 0.8, 8]} />
      <meshStandardMaterial color="#4a3528" roughness={0.9} />
    </mesh>
  );
}

export default function SpatialAudioPlayer({ onBack }: SpatialAudioPlayerProps) {
  const fireRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (fireRef.current) {
      const t = clock.getElapsedTime();
      fireRef.current.intensity = 2 + Math.sin(t * 8) * 0.5 + Math.sin(t * 12) * 0.3;
    }
  });

  return (
    <group>
      {/* Night sky */}
      <StarField count={1500} radius={80} />

      {/* Ambient moonlight */}
      <ambientLight intensity={0.05} color="#4466aa" />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
        <circleGeometry args={[15, 32]} />
        <meshStandardMaterial color="#1a1508" roughness={0.95} />
      </mesh>

      {/* Campfire group */}
      <group position={[0, -1.2, -2]}>
        {/* Fire light */}
        <pointLight
          ref={fireRef}
          position={[0, 0.5, 0]}
          color="#FF4400"
          intensity={2.5}
          distance={10}
          castShadow
        />

        {/* Fire glow orb */}
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshBasicMaterial color="#FF6600" transparent opacity={0.6} />
        </mesh>

        {/* Fire particles */}
        <CampfireParticles />

        {/* Logs */}
        <LogMesh position={[-0.15, 0.05, 0]} rotation={[0, 0.3, Math.PI / 12]} />
        <LogMesh position={[0.15, 0.05, 0]} rotation={[0, -0.3, -Math.PI / 12]} />
        <LogMesh position={[0, 0.05, -0.1]} rotation={[Math.PI / 12, Math.PI / 2, 0]} />

        {/* Stone ring around fire */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 0.5, 0, Math.sin(angle) * 0.5]}
            >
              <sphereGeometry args={[0.08, 6, 6]} />
              <meshStandardMaterial color="#555" roughness={0.9} />
            </mesh>
          );
        })}
      </group>

      {/* Audio info */}
      <Text
        position={[0, 2, -2]}
        fontSize={0.2}
        color="#e8d5b7"
        anchorX="center"
        outlineWidth={0.01}
        outlineColor="#000"
      >
        Audio Theater
      </Text>
      <Text
        position={[0, 1.7, -2]}
        fontSize={0.1}
        color="#888"
        anchorX="center"
      >
        Sit by the fire and listen to Epic Commentary
      </Text>

      <Text
        position={[0, 1.3, -2]}
        fontSize={0.08}
        color="#aaa"
        anchorX="center"
      >
        Use controller buttons to play/pause audio
      </Text>

      {/* Sitting stones/logs for user */}
      <mesh position={[0, -0.9, 0.5]} castShadow>
        <cylinderGeometry args={[0.3, 0.35, 0.3, 8]} />
        <meshStandardMaterial color="#555" roughness={0.9} />
      </mesh>

      {/* Back button */}
      <Text
        position={[0, 0.2, 2]}
        fontSize={0.1}
        color="#FF6666"
        anchorX="center"
        onClick={onBack}
      >
        ← Back to Lobby
      </Text>
    </group>
  );
}
