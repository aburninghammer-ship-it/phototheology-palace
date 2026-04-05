import { useState, Suspense, useMemo, useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Environment } from '@react-three/drei';
import { Interactive } from '@react-three/xr';
import * as THREE from 'three';
import { palaceFloors, type Floor, type Room } from '@/data/palaceData';
import { CANONICAL_ROOMS } from '@/data/canonicalRooms';
import { BackToLobbyButton } from '../components/BackToLobbyButton';

// ── Floor theming ───────────────────────────────────────────────────────────

const FLOOR_COLORS: Record<number, string> = {
  1: '#FFD700', 2: '#4488FF', 3: '#44FF88', 4: '#9944FF',
  5: '#4466FF', 6: '#6688FF', 7: '#FF6622', 8: '#FFFFFF',
};

// Holographic deep blue-black wall tints per floor
const FLOOR_WALL_TINT: Record<number, string> = {
  1: '#0a0e20', 2: '#080c22', 3: '#081018', 4: '#0c0820',
  5: '#080a22', 6: '#080c22', 7: '#100c18', 8: '#0c0c14',
};

const FLOOR_GROUND: Record<number, string> = {
  1: '#0a0e1e', 2: '#080c20', 3: '#081018', 4: '#0c0820',
  5: '#080a20', 6: '#080c20', 7: '#100c18', 8: '#0c0c14',
};

type ViewMode = 'elevator' | 'floor' | 'room';

interface PalaceTourProps {
  onBack: () => void;
}

// ── Energy Orb (replaces Torch) ─────────────────────────────────────────────

function EnergyOrb({ position, color = '#00CCFF' }: { position: [number, number, number]; color?: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + position[0] * 3;
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.1;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 1.5 + Math.sin(t * 2) * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Core sphere */}
      <mesh>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Glow shell */}
      <mesh>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <pointLight ref={lightRef} color={color} intensity={1.5} distance={6} />
    </group>
  );
}

// ── Floating Orbs (replaces DustMotes) ───────────────────────────────────────

function FloatingOrbs({ color = '#44CCFF', count = 30 }: { color?: string; count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const colors = ['#44CCFF', '#8844FF', '#00FFAA', '#FF44AA'];

  const [basePositions, colorArray] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = Math.random() * 3;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
      const c = new THREE.Color(colors[i % colors.length]);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const arr = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const t = clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      arr[i * 3] = basePositions[i * 3] + Math.sin(t * 0.3 + i) * 0.4;
      arr[i * 3 + 1] = ((basePositions[i * 3 + 1] + t * 0.08) % 3);
      arr[i * 3 + 2] = basePositions[i * 3 + 2] + Math.cos(t * 0.2 + i) * 0.3;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={new Float32Array(basePositions)} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colorArray} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.6}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ── HoloColumn (replaces Column) ─────────────────────────────────────────────

function HoloColumn({ position, height = 3.5, color = '#00AAFF' }: { position: [number, number, number]; height?: number; color?: string }) {
  const torusRef = useRef<THREE.Mesh>(null);
  const orbRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + position[0] * 2;
    if (torusRef.current) {
      torusRef.current.rotation.y = t * 0.5;
      torusRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    }
    if (orbRef.current) {
      (orbRef.current.material as THREE.MeshBasicMaterial).opacity = 0.5 + Math.sin(t * 2) * 0.2;
    }
  });

  return (
    <group position={position}>
      {/* Base glow disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.1, 0]}>
        <circleGeometry args={[0.25, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Translucent outer cylinder */}
      <mesh position={[0, height / 2 - 1.2, 0]}>
        <cylinderGeometry args={[0.14, 0.16, height, 8]} />
        <meshStandardMaterial
          color="#0a1428"
          emissive={color}
          emissiveIntensity={0.15}
          transparent
          opacity={0.5}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Bright inner core */}
      <mesh position={[0, height / 2 - 1.2, 0]}>
        <cylinderGeometry args={[0.04, 0.04, height, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Spinning torus ring at mid height */}
      <mesh ref={torusRef} position={[0, height / 2 - 1.2, 0]}>
        <torusGeometry args={[0.22, 0.015, 8, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Top orb */}
      <mesh ref={orbRef} position={[0, height - 1.2, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      <pointLight position={[0, height / 2 - 1.2, 0]} color={color} intensity={0.5} distance={4} />
    </group>
  );
}

// ── Holographic Palace Interior (replaces PalaceInterior) ────────────────────

function HoloPalaceInterior({ wallColor = '#0a0e20', floorColor = '#0a0e1e', accentColor = '#00AAFF' }: {
  wallColor?: string; floorColor?: string; accentColor?: string;
}) {
  return (
    <group>
      {/* Dark indigo floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, -2]} receiveShadow>
        <planeGeometry args={[16, 16]} />
        <meshPhysicalMaterial color={floorColor} emissive={accentColor} emissiveIntensity={0.02} metalness={0.6} roughness={0.3} clearcoat={0.6} clearcoatRoughness={0.2} envMapIntensity={0.4} />
      </mesh>

      {/* Emissive grid lines on floor */}
      <gridHelper args={[16, 32, accentColor, accentColor]} position={[0, -1.19, -2]} />

      {/* Dark dome ceiling */}
      <mesh position={[0, 4.5, -2]}>
        <sphereGeometry args={[9, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
        <meshStandardMaterial color="#030310" side={THREE.BackSide} roughness={0.9} />
      </mesh>

      {/* Back wall — translucent dark with glowing edge trim */}
      <mesh position={[0, 1.5, -7]}>
        <planeGeometry args={[16, 6]} />
        <meshStandardMaterial color={wallColor} emissive={accentColor} emissiveIntensity={0.02} roughness={0.85} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-7, 1.5, -2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color={wallColor} emissive={accentColor} emissiveIntensity={0.02} roughness={0.85} />
      </mesh>

      {/* Right wall */}
      <mesh position={[7, 1.5, -2]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color={wallColor} emissive={accentColor} emissiveIntensity={0.02} roughness={0.85} />
      </mesh>

      {/* Glowing edge trim — top of back wall */}
      <mesh position={[0, 3.2, -6.95]}>
        <boxGeometry args={[14, 0.04, 0.03]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Bottom trim */}
      <mesh position={[0, -0.5, -6.95]}>
        <boxGeometry args={[14, 0.04, 0.03]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* HoloColumns — flanking the space */}
      <HoloColumn position={[-5, 0, -5]} color={accentColor} />
      <HoloColumn position={[5, 0, -5]} color={accentColor} />
      <HoloColumn position={[-5, 0, 1]} color={accentColor} />
      <HoloColumn position={[5, 0, 1]} color={accentColor} />
    </group>
  );
}

// ── VR Button ───────────────────────────────────────────────────────────────

function VRButton({
  position, size = [2, 0.35], label, color, onSelect, fontSize = 0.08, sublabel,
}: {
  position: [number, number, number]; size?: [number, number]; label: string;
  color: string; onSelect: () => void; fontSize?: number; sublabel?: string;
}) {
  return (
    <group position={position}>
      <Interactive onSelect={onSelect}>
        <mesh onClick={onSelect} onPointerDown={onSelect}>
          <planeGeometry args={size} />
          <meshStandardMaterial color="#0a0a20" emissive={color} emissiveIntensity={0.15} />
        </mesh>
      </Interactive>
      {/* Glow border */}
      <mesh position={[0, 0, -0.001]}>
        <planeGeometry args={[size[0] + 0.03, size[1] + 0.03]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <Suspense fallback={null}>
        <Text position={[0, sublabel ? 0.04 : 0, 0.01]} fontSize={fontSize} color="#eee" anchorX="center" anchorY="middle" maxWidth={size[0] - 0.15}>
          {label}
        </Text>
        {sublabel && (
          <Text position={[0, -0.06, 0.01]} fontSize={0.05} color="#8899bb" anchorX="center" anchorY="middle" maxWidth={size[0] - 0.15}>
            {sublabel}
          </Text>
        )}
      </Suspense>
    </group>
  );
}

// ── Holographic Scan Line — sweeps up and down ──
function HoloScanLine({ color = '#00CCFF' }: { color?: string }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y = -1 + ((t * 0.4) % 5);
    (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.03 + Math.sin(t * 2) * 0.01;
  });

  return (
    <mesh ref={ref} position={[0, 0, -3]}>
      <planeGeometry args={[16, 0.02]} />
      <meshBasicMaterial color={color} transparent opacity={0.03} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

// ── Data Stream Particles — vertical rising data-like dots ──
function DataStreams({ color = '#00CCFF', count = 40 }: { color?: string; count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const streams = useMemo(() =>
    Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 14,
      z: (Math.random() - 0.5) * 12 - 2,
      speed: 0.5 + Math.random() * 1,
      phase: Math.random() * 10,
      size: 0.015 + Math.random() * 0.02,
    })),
  [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    streams.forEach((s, i) => {
      const y = ((s.phase + t * s.speed) % 5) - 1.2;
      const blink = Math.max(0, Math.sin(t * 4 + s.phase * 3));
      dummy.position.set(s.x, y, s.z);
      dummy.scale.setScalar(s.size * blink);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={color} transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
    </instancedMesh>
  );
}

// ── Holographic Wave Ring — expanding rings on the floor ──
function HoloWaveRings({ color = '#00CCFF' }: { color?: string }) {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ring1Ref.current) {
      const s1 = ((t * 0.5) % 3) * 3;
      ring1Ref.current.scale.setScalar(s1);
      (ring1Ref.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.08 * (1 - s1 / 9));
    }
    if (ring2Ref.current) {
      const s2 = (((t * 0.5 + 1.5) % 3)) * 3;
      ring2Ref.current.scale.setScalar(s2);
      (ring2Ref.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.08 * (1 - s2 / 9));
    }
  });

  return (
    <group position={[0, -1.17, -2]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh ref={ring1Ref}>
        <ringGeometry args={[0.9, 1, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={ring2Ref}>
        <ringGeometry args={[0.9, 1, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

// ── Elevator View — Holographic Atrium ──────────────────────────────────────

function ElevatorView({
  onSelectFloor, onBack,
}: {
  onSelectFloor: (floorNum: number) => void; onBack: () => void;
}) {
  return (
    <group>
      <HoloPalaceInterior wallColor="#0a0e20" floorColor="#0a0e1e" accentColor="#00AAFF" />

      {/* Holographic lighting */}
      <ambientLight intensity={0.45} color="#aabbee" />
      <pointLight position={[0, 3.5, -3]} color="#00CCFF" intensity={1.5} distance={12} />
      <pointLight position={[-4, 2, -2]} color="#4488FF" intensity={0.6} distance={8} />
      <pointLight position={[4, 2, -2]} color="#8844FF" intensity={0.6} distance={8} />

      {/* Energy Orbs */}
      <EnergyOrb position={[-5.5, 2.5, -4]} />
      <EnergyOrb position={[5.5, 2.5, -4]} />
      <EnergyOrb position={[-5.5, 2.5, 0]} color="#8844FF" />
      <EnergyOrb position={[5.5, 2.5, 0]} color="#8844FF" />

      <FloatingOrbs color="#44CCFF" />

      {/* Holographic effects */}
      <HoloScanLine />
      <DataStreams count={40} />
      <HoloWaveRings />

      {/* Fog */}
      <fog attach="fog" args={['#050515', 8, 25]} />

      <Suspense fallback={null}>
        <Text position={[0, 3.2, -5]} fontSize={0.28} color="#44DDFF" anchorX="center" outlineWidth={0.01} outlineColor="#001122">
          The Phototheology Palace
        </Text>
        <Text position={[0, 2.85, -5]} fontSize={0.1} color="#8899bb" anchorX="center">
          8 Floors of Biblical Study — Select a floor
        </Text>
      </Suspense>

      {/* Floor buttons — arranged as two columns */}
      <group position={[-1.6, 1.8, -4.5]}>
        {palaceFloors.slice(0, 4).map((floor, i) => {
          const color = FLOOR_COLORS[floor.number] || '#888';
          return (
            <VRButton
              key={floor.number}
              position={[0, -i * 0.42, 0]}
              size={[2.8, 0.35]}
              label={`Floor ${floor.number}: ${floor.name}`}
              sublabel={`${floor.subtitle} — ${floor.rooms.length} rooms`}
              color={color}
              fontSize={0.07}
              onSelect={() => onSelectFloor(floor.number)}
            />
          );
        })}
      </group>
      <group position={[1.6, 1.8, -4.5]}>
        {palaceFloors.slice(4, 8).map((floor, i) => {
          const color = FLOOR_COLORS[floor.number] || '#888';
          return (
            <VRButton
              key={floor.number}
              position={[0, -i * 0.42, 0]}
              size={[2.8, 0.35]}
              label={`Floor ${floor.number}: ${floor.name}`}
              sublabel={`${floor.subtitle} — ${floor.rooms.length} rooms`}
              color={color}
              fontSize={0.07}
              onSelect={() => onSelectFloor(floor.number)}
            />
          );
        })}
      </group>

      {/* Back to Lobby */}
      <BackToLobbyButton onBack={onBack} position={[0, -0.8, -1.5]} />
    </group>
  );
}

// ── Floor View — Themed Corridor ────────────────────────────────────────────

function FloorView({
  floor, onSelectRoom, onFloorChange, onBackToElevator,
}: {
  floor: Floor; onSelectRoom: (room: Room) => void;
  onFloorChange: (delta: number) => void; onBackToElevator: () => void;
}) {
  const floorColor = FLOOR_COLORS[floor.number] || '#888';
  const wallColor = FLOOR_WALL_TINT[floor.number] || '#0a0e20';
  const groundColor = FLOOR_GROUND[floor.number] || '#0a0e1e';

  return (
    <group>
      <HoloPalaceInterior wallColor={wallColor} floorColor={groundColor} accentColor={floorColor} />

      {/* Holographic ambient + floor-themed accent */}
      <ambientLight intensity={0.4} color="#aabbee" />
      <pointLight position={[0, 3.5, -3]} color={floorColor} intensity={1} distance={10} />
      <pointLight position={[0, 3.5, -3]} color="#00CCFF" intensity={0.8} distance={10} />

      {/* Energy orbs with floor tint */}
      <EnergyOrb position={[-5.5, 2.5, -4]} color={floorColor} />
      <EnergyOrb position={[5.5, 2.5, -4]} color={floorColor} />

      <FloatingOrbs color={floorColor} count={20} />
      <fog attach="fog" args={['#050515', 8, 22]} />

      {/* Floor header banner */}
      <group position={[0, 3, -6.5]}>
        <mesh>
          <planeGeometry args={[5, 0.8]} />
          <meshStandardMaterial color="#060610" emissive={floorColor} emissiveIntensity={0.05} />
        </mesh>
        <Suspense fallback={null}>
          <Text position={[0, 0.1, 0.01]} fontSize={0.2} color={floorColor} anchorX="center" outlineWidth={0.01} outlineColor="#001122">
            Floor {floor.number}: {floor.name}
          </Text>
          <Text position={[0, -0.15, 0.01]} fontSize={0.08} color="#8899bb" anchorX="center">
            {floor.subtitle} — {floor.rooms.length} rooms
          </Text>
        </Suspense>
      </group>

      {/* Room doorways in semicircle */}
      {floor.rooms.map((room, i) => {
        const angleSpread = Math.min(Math.PI * 0.65, floor.rooms.length * 0.17);
        const angle = floor.rooms.length === 1
          ? 0 : ((i / (floor.rooms.length - 1)) - 0.5) * angleSpread;
        const radius = 4.5;
        const x = Math.sin(angle) * radius;
        const z = -Math.cos(angle) * radius - 1;
        const rotY = -angle;

        return (
          <group key={room.id} position={[x, 0.5, z]} rotation={[0, rotY, 0]}>
            {/* Door frame — glowing edges */}
            <mesh position={[-0.55, 0.3, -0.02]}>
              <boxGeometry args={[0.04, 1.4, 0.04]} />
              <meshBasicMaterial color={floorColor} transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
            <mesh position={[0.55, 0.3, -0.02]}>
              <boxGeometry args={[0.04, 1.4, 0.04]} />
              <meshBasicMaterial color={floorColor} transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
            <mesh position={[0, 1.02, -0.02]}>
              <boxGeometry args={[1.14, 0.04, 0.04]} />
              <meshBasicMaterial color={floorColor} transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>

            {/* Door surface — clickable */}
            <Interactive onSelect={() => onSelectRoom(room)}>
              <mesh onClick={() => onSelectRoom(room)} onPointerDown={() => onSelectRoom(room)}>
                <planeGeometry args={[1.04, 1.3]} />
                <meshStandardMaterial color="#060610" emissive={floorColor} emissiveIntensity={0.12} />
              </mesh>
            </Interactive>

            {/* Room name plate */}
            <Suspense fallback={null}>
              <Text position={[0, 0.25, 0.02]} fontSize={0.065} color={floorColor} anchorX="center" maxWidth={0.9}>
                {room.name}
              </Text>
              <Text position={[0, 0.05, 0.02]} fontSize={0.05} color="#7788aa" anchorX="center">
                [{room.tag.toUpperCase()}]
              </Text>
            </Suspense>

            {/* Soft glow above door */}
            <pointLight position={[0, 1.2, 0.2]} color={floorColor} intensity={0.3} distance={2} />
          </group>
        );
      })}

      {/* Floor navigation */}
      {floor.number > 1 && (
        <VRButton
          position={[-5, 1, 0]}
          size={[1.2, 0.35]}
          label={`Floor ${floor.number - 1}`}
          color="#4488AA"
          fontSize={0.065}
          onSelect={() => onFloorChange(-1)}
        />
      )}
      {floor.number < 8 && (
        <VRButton
          position={[5, 1, 0]}
          size={[1.2, 0.35]}
          label={`Floor ${floor.number + 1}`}
          color="#4488AA"
          fontSize={0.065}
          onSelect={() => onFloorChange(1)}
        />
      )}

      <VRButton
        position={[0, -0.8, -1.5]}
        size={[1.5, 0.3]}
        label="< Back to Elevator"
        color="#4488AA"
        fontSize={0.08}
        onSelect={onBackToElevator}
      />
    </group>
  );
}

// ── Room View — Study Chamber ───────────────────────────────────────────────

function RoomView({
  room, floorNumber, onBack,
}: {
  room: Room; floorNumber: number; onBack: () => void;
}) {
  const floorColor = FLOOR_COLORS[floorNumber] || '#888';
  const wallColor = FLOOR_WALL_TINT[floorNumber] || '#0a0e20';
  const groundColor = FLOOR_GROUND[floorNumber] || '#0a0e1e';

  const methodPreview = room.method.slice(0, 200) + (room.method.length > 200 ? '...' : '');
  const examplesPreview = room.examples.slice(0, 2).map((ex) =>
    ex.length > 100 ? ex.slice(0, 100) + '...' : ex
  );

  return (
    <group>
      <HoloPalaceInterior wallColor={wallColor} floorColor={groundColor} accentColor={floorColor} />

      {/* Study chamber lighting — holographic */}
      <ambientLight intensity={0.35} color="#aabbee" />
      <pointLight position={[0, 3, -3]} color="#00CCFF" intensity={1} distance={8} />
      <pointLight position={[0, 2, -3.2]} color={floorColor} intensity={0.8} distance={6} />

      <EnergyOrb position={[-3, 2.5, -5]} color={floorColor} />
      <EnergyOrb position={[3, 2.5, -5]} color={floorColor} />

      <FloatingOrbs color={floorColor} count={15} />
      <fog attach="fog" args={['#050515', 6, 18]} />

      {/* Scroll / parchment panel on back wall */}
      <mesh position={[0, 1.5, -6.4]}>
        <planeGeometry args={[4.2, 3.2]} />
        <meshStandardMaterial color="#060610" emissive={floorColor} emissiveIntensity={0.02} />
      </mesh>
      {/* Glowing frame around panel */}
      <mesh position={[0, 1.5, -6.38]}>
        <planeGeometry args={[4.35, 3.35]} />
        <meshBasicMaterial color={floorColor} transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      <Suspense fallback={null}>
        <Text position={[0, 2.9, -6.35]} fontSize={0.18} color={floorColor} anchorX="center" outlineWidth={0.01} outlineColor="#001122">
          {room.name}
        </Text>
        <Text position={[0, 2.65, -6.35]} fontSize={0.07} color="#7788aa" anchorX="center">
          [{room.tag.toUpperCase()}] — Floor {floorNumber}: {palaceFloors[floorNumber - 1]?.name}
        </Text>

        {/* Purpose */}
        <Text position={[-1.9, 2.35, -6.35]} fontSize={0.06} color="#44DDFF" anchorX="left">
          Purpose
        </Text>
        <Text position={[-1.9, 2.1, -6.35]} fontSize={0.06} color="#ccd" anchorX="left" maxWidth={3.6} lineHeight={1.3}>
          {room.purpose.slice(0, 200)}{room.purpose.length > 200 ? '...' : ''}
        </Text>

        {/* Core Question */}
        <Text position={[-1.9, 1.6, -6.35]} fontSize={0.06} color="#AA88FF" anchorX="left">
          Core Question
        </Text>
        <Text position={[-1.9, 1.4, -6.35]} fontSize={0.055} color="#eee" anchorX="left" maxWidth={3.6} lineHeight={1.3}>
          {room.coreQuestion}
        </Text>

        {/* Method */}
        <Text position={[-1.9, 1.1, -6.35]} fontSize={0.06} color="#44AAFF" anchorX="left">
          Method
        </Text>
        <Text position={[-1.9, 0.7, -6.35]} fontSize={0.055} color="#aab" anchorX="left" maxWidth={3.6} lineHeight={1.3}>
          {methodPreview}
        </Text>

        {/* Examples */}
        {examplesPreview.length > 0 && (
          <>
            <Text position={[-1.9, 0.35, -6.35]} fontSize={0.06} color="#44FFAA" anchorX="left">
              Examples
            </Text>
            {examplesPreview.map((ex, i) => (
              <Text key={i} position={[-1.9, 0.15 - i * 0.18, -6.35]} fontSize={0.055} color="#99a" anchorX="left" maxWidth={3.6} lineHeight={1.2}>
                {ex}
              </Text>
            ))}
          </>
        )}
      </Suspense>

      <VRButton
        position={[0, -0.8, -1.5]}
        size={[1.5, 0.3]}
        label="< Back to Floor"
        color="#4488AA"
        fontSize={0.08}
        onSelect={onBack}
      />
    </group>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function PalaceTour({ onBack }: PalaceTourProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('elevator');
  const [currentFloor, setCurrentFloor] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const floor = palaceFloors.find((f) => f.number === currentFloor) || palaceFloors[0];

  const handleSelectFloor = (floorNum: number) => {
    setCurrentFloor(floorNum);
    setViewMode('floor');
  };

  const handleSelectRoom = (room: Room) => {
    setSelectedRoom(room);
    setViewMode('room');
  };

  const handleFloorChange = (delta: number) => {
    const next = currentFloor + delta;
    if (next >= 1 && next <= 8) setCurrentFloor(next);
  };

  return (
    <group>
      {/* Environment IBL for rich reflections on interior surfaces */}
      <Environment preset="lobby" resolution={512} />

      {/* Opaque dark interior sky */}
      <mesh renderOrder={-1}>
        <sphereGeometry args={[30, 16, 16]} />
        <meshBasicMaterial color="#0a0818" side={THREE.BackSide} depthWrite={false} />
      </mesh>

      <directionalLight position={[5, 8, 5]} intensity={0.6} color="#FFD088" />
      <directionalLight position={[-5, 4, -3]} intensity={0.3} color="#8866CC" />

      {viewMode === 'elevator' && (
        <ElevatorView onSelectFloor={handleSelectFloor} onBack={onBack} />
      )}
      {viewMode === 'floor' && (
        <FloorView
          floor={floor}
          onSelectRoom={handleSelectRoom}
          onFloorChange={handleFloorChange}
          onBackToElevator={() => setViewMode('elevator')}
        />
      )}
      {viewMode === 'room' && selectedRoom && (
        <RoomView room={selectedRoom} floorNumber={currentFloor} onBack={() => setViewMode('floor')} />
      )}
    </group>
  );
}
