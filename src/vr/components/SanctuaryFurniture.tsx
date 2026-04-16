/**
 * Detailed 3D Sanctuary Furniture — proper shapes for each piece
 */
import { useRef, useMemo, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Interactive } from '@react-three/xr';
import * as THREE from 'three';

// ── Altar of Burnt Offering ──
export function AltarOfBurntOffering({ position = [0, 0, 0] as [number, number, number] }) {
  const fireRef = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    if (fireRef.current) {
      const t = clock.getElapsedTime();
      fireRef.current.intensity = 2 + Math.sin(t * 6) * 0.5 + Math.sin(t * 9) * 0.3;
    }
  });

  const w = 3.4, h = 1.37, d = 3.4; // 5 cubits × 5 cubits × 3 cubits

  return (
    <group position={position}>
      {/* Main altar body — hollow box */}
      <mesh position={[0, h / 2, 0]} castShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color="#8B6914" metalness={0.6} roughness={0.35} />
      </mesh>
      {/* Bronze grating inside (visible from top) */}
      <mesh position={[0, h * 0.5 + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w * 0.85, d * 0.85]} />
        <meshStandardMaterial color="#4a3a20" metalness={0.7} roughness={0.3} wireframe />
      </mesh>
      {/* Four horns on corners */}
      {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([cx, cz], i) => (
        <mesh key={i} position={[cx * w * 0.45, h + 0.15, cz * d * 0.45]}>
          <coneGeometry args={[0.12, 0.3, 8]} />
          <meshStandardMaterial color="#CD7F32" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
      {/* Bronze rim */}
      <mesh position={[0, h, 0]}>
        <boxGeometry args={[w + 0.1, 0.06, d + 0.1]} />
        <meshStandardMaterial color="#CD7F32" metalness={0.7} roughness={0.25} />
      </mesh>
      {/* Fire glow */}
      <pointLight ref={fireRef} position={[0, h + 0.3, 0]} color="#FF6622" intensity={2} distance={8} />
      {/* Fire particles */}
      <mesh position={[0, h + 0.2, 0]}>
        <sphereGeometry args={[0.4, 8, 6]} />
        <meshBasicMaterial color="#FF4400" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

// ── Bronze Laver ──
export function BronzeLaver({ position = [0, 0, 0] as [number, number, number] }) {
  const waterRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (waterRef.current) {
      waterRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Base/stand */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.35, 0.5, 0.6, 16]} />
        <meshStandardMaterial color="#CD7F32" metalness={0.75} roughness={0.25} />
      </mesh>
      {/* Stem */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.15, 0.25, 0.4, 12]} />
        <meshStandardMaterial color="#CD7F32" metalness={0.75} roughness={0.25} />
      </mesh>
      {/* Basin bowl */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.7, 0.4, 0.5, 24]} />
        <meshStandardMaterial color="#CD7F32" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Inner basin */}
      <mesh position={[0, 1.15, 0]}>
        <cylinderGeometry args={[0.6, 0.35, 0.35, 24]} />
        <meshStandardMaterial color="#8B6914" metalness={0.6} roughness={0.3} side={THREE.BackSide} />
      </mesh>
      {/* Water surface */}
      <mesh ref={waterRef} position={[0, 1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.55, 24]} />
        <meshStandardMaterial color="#4488CC" metalness={0.3} roughness={0.1} transparent opacity={0.7} />
      </mesh>
      {/* Reflective glow */}
      <pointLight position={[0, 1.4, 0]} color="#88BBFF" intensity={0.5} distance={4} />
    </group>
  );
}

// ── Golden Lampstand (Menorah) ──
export function GoldenLampstand({ position = [0, 0, 0] as [number, number, number] }) {
  const lightsRef = useRef<THREE.PointLight[]>([]);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    lightsRef.current.forEach((light, i) => {
      if (light) light.intensity = 1.2 + Math.sin(t * 3 + i * 0.8) * 0.3;
    });
  });

  const branchY = 1.0;
  const branchSpread = [0.6, 0.45, 0.3]; // outer, mid, inner

  return (
    <group position={position}>
      {/* Base — triangular pedestal */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.3, 0.45, 0.2, 3]} />
        <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Central shaft */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 1.4, 8]} />
        <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Almond blossom knobs on shaft */}
      {[0.4, 0.7, 1.0].map((y, i) => (
        <mesh key={`knob-${i}`} position={[0, y, 0]}>
          <sphereGeometry args={[0.06, 8, 6]} />
          <meshStandardMaterial color="#FFD700" metalness={0.85} roughness={0.15} />
        </mesh>
      ))}
      {/* 6 branches — curved arms from center shaft */}
      {[-1, 1].map((side) =>
        branchSpread.map((spread, i) => {
          const x = side * spread;
          const height = branchY + (2 - i) * 0.15;
          return (
            <group key={`branch-${side}-${i}`}>
              {/* Horizontal arm */}
              <mesh position={[x * 0.5, height - 0.1, 0]} rotation={[0, 0, side * 0.3]}>
                <cylinderGeometry args={[0.02, 0.025, spread * 1.1, 6]} />
                <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
              </mesh>
              {/* Vertical tip */}
              <mesh position={[x, height + 0.1, 0]}>
                <cylinderGeometry args={[0.02, 0.03, 0.3, 6]} />
                <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
              </mesh>
              {/* Flame cup */}
              <mesh position={[x, height + 0.28, 0]}>
                <cylinderGeometry args={[0.05, 0.03, 0.06, 8]} />
                <meshStandardMaterial color="#FFD700" metalness={0.85} roughness={0.15} />
              </mesh>
              {/* Flame */}
              <mesh position={[x, height + 0.35, 0]}>
                <sphereGeometry args={[0.04, 6, 6]} />
                <meshBasicMaterial color="#FFAA22" transparent opacity={0.9} />
              </mesh>
              <pointLight
                ref={(el) => { if (el) lightsRef.current[i * 2 + (side > 0 ? 1 : 0)] = el; }}
                position={[x, height + 0.4, 0]}
                color="#FFCC44"
                intensity={1}
                distance={3}
              />
            </group>
          );
        })
      )}
      {/* Center lamp */}
      <mesh position={[0, 1.55, 0]}>
        <cylinderGeometry args={[0.05, 0.03, 0.06, 8]} />
        <meshStandardMaterial color="#FFD700" metalness={0.85} roughness={0.15} />
      </mesh>
      <mesh position={[0, 1.62, 0]}>
        <sphereGeometry args={[0.05, 6, 6]} />
        <meshBasicMaterial color="#FFCC22" transparent opacity={0.9} />
      </mesh>
      <pointLight position={[0, 1.7, 0]} color="#FFCC44" intensity={1.5} distance={4} />
    </group>
  );
}

// ── Table of Showbread ──
export function TableOfShowbread({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position}>
      {/* Four legs */}
      {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([x, z], i) => (
        <mesh key={i} position={[x * 0.4, 0.34, z * 0.2]}>
          <cylinderGeometry args={[0.03, 0.04, 0.68, 6]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
      {/* Table top */}
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[0.91, 0.06, 0.46]} />
        <meshStandardMaterial color="#FFD700" metalness={0.85} roughness={0.15} />
      </mesh>
      {/* Crown molding rim */}
      <mesh position={[0, 0.76, 0]}>
        <boxGeometry args={[0.97, 0.04, 0.52]} />
        <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} transparent opacity={0.8} />
      </mesh>
      {/* 12 loaves — two stacks of 6 */}
      {[-0.18, 0.18].map((zOff, stack) =>
        Array.from({ length: 6 }, (_, i) => (
          <mesh key={`loaf-${stack}-${i}`} position={[-0.3 + i * 0.12, 0.78 + (stack === 0 ? 0 : 0.04), zOff]}>
            <boxGeometry args={[0.1, 0.04, 0.12]} />
            <meshStandardMaterial color="#D4A574" roughness={0.9} metalness={0.05} />
          </mesh>
        ))
      )}
      {/* Frankincense bowls */}
      {[-0.35, 0.35].map((x, i) => (
        <mesh key={`bowl-${i}`} position={[x, 0.82, 0]}>
          <sphereGeometry args={[0.04, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#FFD700" metalness={0.85} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

// ── Altar of Incense ──
export function AltarOfIncense({ position = [0, 0, 0] as [number, number, number] }) {
  const smokeRef = useRef<THREE.Points>(null);
  const particleCount = 30;
  const basePositions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.3;
      pos[i * 3 + 1] = Math.random() * 1.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (!smokeRef.current) return;
    const arr = smokeRef.current.geometry.attributes.position.array as Float32Array;
    const t = clock.getElapsedTime();
    for (let i = 0; i < particleCount; i++) {
      arr[i * 3] = basePositions[i * 3] + Math.sin(t * 0.5 + i) * 0.1;
      arr[i * 3 + 1] = ((basePositions[i * 3 + 1] + t * 0.1) % 2);
      arr[i * 3 + 2] = basePositions[i * 3 + 2] + Math.cos(t * 0.3 + i) * 0.1;
    }
    smokeRef.current.geometry.attributes.position.needsUpdate = true;
  });

  const w = 0.46, h = 0.91, d = 0.46; // 1 cubit × 2 cubits × 1 cubit

  return (
    <group position={position}>
      {/* Main body */}
      <mesh position={[0, h / 2, 0]} castShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color="#FFD700" metalness={0.85} roughness={0.15} />
      </mesh>
      {/* Crown molding */}
      <mesh position={[0, h, 0]}>
        <boxGeometry args={[w + 0.04, 0.04, d + 0.04]} />
        <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Four horns */}
      {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([cx, cz], i) => (
        <mesh key={i} position={[cx * w * 0.45, h + 0.08, cz * d * 0.45]}>
          <coneGeometry args={[0.04, 0.12, 6]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
      {/* Incense bowl on top */}
      <mesh position={[0, h + 0.03, 0]}>
        <cylinderGeometry args={[0.12, 0.08, 0.05, 12]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Rising smoke particles */}
      <points ref={smokeRef} position={[0, h + 0.1, 0]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particleCount} array={new Float32Array(basePositions)} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#DDCC88" transparent opacity={0.25} depthWrite={false} sizeAttenuation blending={THREE.AdditiveBlending} />
      </points>
      <pointLight position={[0, h + 0.3, 0]} color="#FFDD88" intensity={0.6} distance={4} />
    </group>
  );
}

// ── The Veil ──
export function TheVeil({ position = [0, 0, 0] as [number, number, number] }) {
  const veilRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (veilRef.current) {
      // Subtle wave animation
      const t = clock.getElapsedTime();
      veilRef.current.position.z = position[2] + Math.sin(t * 0.5) * 0.01;
    }
  });

  return (
    <group position={position}>
      {/* Main curtain */}
      <mesh ref={veilRef}>
        <planeGeometry args={[4.57, 4.57]} /> {/* 10 cubits × 10 cubits */}
        <meshStandardMaterial
          color="#2a1060"
          emissive="#4400AA"
          emissiveIntensity={0.1}
          roughness={0.8}
          metalness={0.1}
          side={THREE.DoubleSide}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Cherubim embroidery — suggested by golden symbols */}
      {[-1, 1].map((side, i) => (
        <Suspense key={i} fallback={null}>
          <Text
            position={[side * 1, 0.5, 0.02]}
            fontSize={0.6}
            color="#FFD700"
            anchorX="center"
            anchorY="middle"
          >
            ✦
          </Text>
        </Suspense>
      ))}
      {/* Support pillars */}
      {[-2, -0.67, 0.67, 2].map((x, i) => (
        <mesh key={i} position={[x, 0, -0.05]}>
          <cylinderGeometry args={[0.06, 0.06, 4.57, 8]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
      {/* Holy glow from beyond */}
      <pointLight position={[0, 1, -0.5]} color="#FFD700" intensity={0.4} distance={6} />
    </group>
  );
}

// ── Ark of the Covenant ──
export function ArkOfTheCovenant({ position = [0, 0, 0] as [number, number, number] }) {
  const glowRef = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    if (glowRef.current) {
      const t = clock.getElapsedTime();
      glowRef.current.intensity = 2 + Math.sin(t * 1.5) * 0.5;
    }
  });

  const w = 1.14, h = 0.69, d = 0.69; // 2.5 × 1.5 × 1.5 cubits

  return (
    <group position={position}>
      {/* Main chest */}
      <mesh position={[0, h / 2, 0]} castShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Crown molding */}
      <mesh position={[0, h, 0]}>
        <boxGeometry args={[w + 0.04, 0.04, d + 0.04]} />
        <meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.05} emissive="#FFD700" emissiveIntensity={0.2} />
      </mesh>
      {/* Carrying poles */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[0, h * 0.35, side * (d / 2 + 0.03)]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, w + 0.5, 8]} />
          <meshStandardMaterial color="#FFD700" metalness={0.85} roughness={0.15} />
        </mesh>
      ))}
      {/* Rings for poles */}
      {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([ex, ez], i) => (
        <mesh key={i} position={[ex * (w / 2), h * 0.35, ez * (d / 2 + 0.03)]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.05, 0.015, 8, 12]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
      {/* Mercy Seat (lid) */}
      <mesh position={[0, h + 0.04, 0]}>
        <boxGeometry args={[w + 0.02, 0.06, d + 0.02]} />
        <meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.05} emissive="#FFD700" emissiveIntensity={0.15} />
      </mesh>
      {/* Cherubim */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * w * 0.35, h + 0.35, 0]}>
          {/* Body */}
          <mesh>
            <coneGeometry args={[0.12, 0.4, 6]} />
            <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Head */}
          <mesh position={[0, 0.25, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Wings — spread upward and inward */}
          <mesh position={[side * -0.12, 0.3, 0]} rotation={[0, 0, side * -0.6]}>
            <planeGeometry args={[0.3, 0.2]} />
            <meshStandardMaterial color="#FFD700" metalness={0.85} roughness={0.15} side={THREE.DoubleSide} transparent opacity={0.9} />
          </mesh>
          <mesh position={[side * 0.08, 0.35, 0]} rotation={[0, 0, side * 0.3]}>
            <planeGeometry args={[0.25, 0.18]} />
            <meshStandardMaterial color="#FFD700" metalness={0.85} roughness={0.15} side={THREE.DoubleSide} transparent opacity={0.9} />
          </mesh>
        </group>
      ))}
      {/* Shekinah glory light */}
      <pointLight ref={glowRef} position={[0, h + 0.8, 0]} color="#FFD700" intensity={2} distance={8} />
      <mesh position={[0, h + 0.6, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshBasicMaterial color="#FFEE88" transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

// ── Courtyard Gate ──
export function CourtyardGate({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position}>
      {/* Four pillars */}
      {[-3, -1, 1, 3].map((x, i) => (
        <mesh key={i} position={[x, 1.14, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 2.28, 8]} />
          <meshStandardMaterial color="#CD7F32" metalness={0.6} roughness={0.35} />
        </mesh>
      ))}
      {/* Curtain fabric */}
      <mesh position={[0, 1.14, 0]}>
        <planeGeometry args={[9.14, 2.28]} /> {/* 20 cubits × 5 cubits */}
        <meshStandardMaterial
          color="#FFFFFF"
          emissive="#4444AA"
          emissiveIntensity={0.05}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
          roughness={0.9}
        />
      </mesh>
      {/* Blue, purple, scarlet stripes */}
      {[
        { color: '#2244AA', y: 0.5 },
        { color: '#6622AA', y: 0 },
        { color: '#CC2222', y: -0.5 },
      ].map((stripe, i) => (
        <mesh key={i} position={[0, 1.14 + stripe.y, 0.01]}>
          <planeGeometry args={[8, 0.2]} />
          <meshBasicMaterial color={stripe.color} transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

// ── Courtyard Fence ──
export function CourtyardFence({ position = [0, 0, 0] as [number, number, number] }) {
  const fenceLength = 45.72; // 100 cubits
  const fenceWidth = 22.86; // 50 cubits
  const fenceHeight = 2.28; // 5 cubits

  return (
    <group position={position}>
      {/* White linen walls — 4 sides */}
      {/* North */}
      <mesh position={[0, fenceHeight / 2, -fenceWidth / 2]}>
        <planeGeometry args={[fenceLength, fenceHeight]} />
        <meshStandardMaterial color="#F5F5DC" transparent opacity={0.3} side={THREE.DoubleSide} roughness={0.9} />
      </mesh>
      {/* South */}
      <mesh position={[0, fenceHeight / 2, fenceWidth / 2]}>
        <planeGeometry args={[fenceLength, fenceHeight]} />
        <meshStandardMaterial color="#F5F5DC" transparent opacity={0.3} side={THREE.DoubleSide} roughness={0.9} />
      </mesh>
      {/* West */}
      <mesh position={[-fenceLength / 2, fenceHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[fenceWidth, fenceHeight]} />
        <meshStandardMaterial color="#F5F5DC" transparent opacity={0.3} side={THREE.DoubleSide} roughness={0.9} />
      </mesh>
      {/* East (with gap for gate) */}
      <mesh position={[fenceLength / 2, fenceHeight / 2, -fenceWidth * 0.3]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[fenceWidth * 0.4, fenceHeight]} />
        <meshStandardMaterial color="#F5F5DC" transparent opacity={0.3} side={THREE.DoubleSide} roughness={0.9} />
      </mesh>
      <mesh position={[fenceLength / 2, fenceHeight / 2, fenceWidth * 0.3]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[fenceWidth * 0.4, fenceHeight]} />
        <meshStandardMaterial color="#F5F5DC" transparent opacity={0.3} side={THREE.DoubleSide} roughness={0.9} />
      </mesh>
    </group>
  );
}

// ── Map element ID to component ──
export function getFurnitureComponent(elementId: string): React.FC<{ position: [number, number, number] }> | null {
  const map: Record<string, React.FC<{ position: [number, number, number] }>> = {
    'altar-burnt-offering': AltarOfBurntOffering,
    'laver': BronzeLaver,
    'courtyard-gate': CourtyardGate,
    'lampstand': GoldenLampstand,
    'table-showbread': TableOfShowbread,
    'altar-incense': AltarOfIncense,
    'veil': TheVeil,
    'ark-covenant': ArkOfTheCovenant,
    'mercy-seat': ArkOfTheCovenant, // combined with ark
  };
  return map[elementId] || null;
}
