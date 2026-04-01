import { useState, Suspense, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Interactive } from '@react-three/xr';
import * as THREE from 'three';
import { palaceFloors, type Floor, type Room } from '@/data/palaceData';
import { CANONICAL_ROOMS } from '@/data/canonicalRooms';

// ── Floor theming ───────────────────────────────────────────────────────────

const FLOOR_COLORS: Record<number, string> = {
  1: '#FFD700', 2: '#4488FF', 3: '#44FF88', 4: '#9944FF',
  5: '#4466FF', 6: '#6688FF', 7: '#FF6622', 8: '#FFFFFF',
};

// Warm palace wall tints per floor
const FLOOR_WALL_TINT: Record<number, string> = {
  1: '#3a2a10', 2: '#1a2038', 3: '#1a3020', 4: '#2a1838',
  5: '#1a1a38', 6: '#1a2038', 7: '#382010', 8: '#282828',
};

const FLOOR_GROUND: Record<number, string> = {
  1: '#4a3820', 2: '#2a3040', 3: '#2a3828', 4: '#382840',
  5: '#282840', 6: '#2a3040', 7: '#403020', 8: '#383838',
};

type ViewMode = 'elevator' | 'floor' | 'room';

interface PalaceTourProps {
  onBack: () => void;
}

// ── Flickering Torch ────────────────────────────────────────────────────────

function Torch({ position, color = '#FF8822' }: { position: [number, number, number]; color?: string }) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!lightRef.current) return;
    const t = clock.getElapsedTime() + position[0] * 3;
    lightRef.current.intensity = 1.2 + Math.sin(t * 6) * 0.3 + Math.sin(t * 9) * 0.15;
  });

  return (
    <group position={position}>
      {/* Bracket */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.02, 0.03, 0.3, 6]} />
        <meshStandardMaterial color="#554433" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Flame glow */}
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} />
      </mesh>
      <pointLight ref={lightRef} position={[0, 0.1, 0]} color={color} intensity={1.2} distance={6} />
    </group>
  );
}

// ── Dust Motes (indoor particles) ───────────────────────────────────────────

function DustMotes({ color = '#e8d5b7', count = 30 }: { color?: string; count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const basePositions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = Math.random() * 3;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    return pos;
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
      </bufferGeometry>
      <pointsMaterial size={0.04} color={color} transparent opacity={0.35} depthWrite={false} sizeAttenuation />
    </points>
  );
}

// ── Column (reusable pillar) ────────────────────────────────────────────────

function Column({ position, height = 3.5, color = '#554840' }: { position: [number, number, number]; height?: number; color?: string }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, -1.1, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 0.15, 8]} />
        <meshStandardMaterial color={color} metalness={0.2} roughness={0.7} />
      </mesh>
      {/* Shaft */}
      <mesh position={[0, height / 2 - 1.2, 0]}>
        <cylinderGeometry args={[0.12, 0.14, height, 8]} />
        <meshStandardMaterial color={color} metalness={0.15} roughness={0.75} />
      </mesh>
      {/* Capital */}
      <mesh position={[0, height - 1.2, 0]}>
        <cylinderGeometry args={[0.2, 0.12, 0.2, 8]} />
        <meshStandardMaterial color={color} metalness={0.2} roughness={0.6} />
      </mesh>
    </group>
  );
}

// ── Palace Interior Shell (walls, floor, ceiling) ───────────────────────────

function PalaceInterior({ wallColor = '#3a2a10', floorColor = '#4a3820', accentColor = '#FFD700' }: {
  wallColor?: string; floorColor?: string; accentColor?: string;
}) {
  return (
    <group>
      {/* Stone floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, -2]} receiveShadow>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color={floorColor} metalness={0.15} roughness={0.85} />
      </mesh>

      {/* Vaulted ceiling */}
      <mesh position={[0, 4.5, -2]}>
        <sphereGeometry args={[9, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
        <meshStandardMaterial color="#1a1510" side={THREE.BackSide} roughness={0.9} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 1.5, -7]}>
        <planeGeometry args={[16, 6]} />
        <meshStandardMaterial color={wallColor} roughness={0.85} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-7, 1.5, -2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color={wallColor} roughness={0.85} />
      </mesh>

      {/* Right wall */}
      <mesh position={[7, 1.5, -2]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color={wallColor} roughness={0.85} />
      </mesh>

      {/* Columns — flanking the space */}
      <Column position={[-5, 0, -5]} color={wallColor} />
      <Column position={[5, 0, -5]} color={wallColor} />
      <Column position={[-5, 0, 1]} color={wallColor} />
      <Column position={[5, 0, 1]} color={wallColor} />

      {/* Accent trim along back wall */}
      <mesh position={[0, 3.2, -6.95]}>
        <boxGeometry args={[14, 0.08, 0.05]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.3} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.5, -6.95]}>
        <boxGeometry args={[14, 0.08, 0.05]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.15} metalness={0.8} roughness={0.2} />
      </mesh>
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
          <meshStandardMaterial color="#1a1510" emissive={color} emissiveIntensity={0.15} />
        </mesh>
      </Interactive>
      {/* Gold border */}
      <mesh position={[0, 0, -0.001]}>
        <planeGeometry args={[size[0] + 0.03, size[1] + 0.03]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.1} metalness={0.8} roughness={0.3} />
      </mesh>
      <Suspense fallback={null}>
        <Text position={[0, sublabel ? 0.04 : 0, 0.01]} fontSize={fontSize} color="#eee" anchorX="center" anchorY="middle" maxWidth={size[0] - 0.15}>
          {label}
        </Text>
        {sublabel && (
          <Text position={[0, -0.06, 0.01]} fontSize={0.05} color="#bba" anchorX="center" anchorY="middle" maxWidth={size[0] - 0.15}>
            {sublabel}
          </Text>
        )}
      </Suspense>
    </group>
  );
}

// ── Elevator View — Grand Atrium ────────────────────────────────────────────

function ElevatorView({
  onSelectFloor, onBack,
}: {
  onSelectFloor: (floorNum: number) => void; onBack: () => void;
}) {
  return (
    <group>
      <PalaceInterior wallColor="#2a2018" floorColor="#3a3020" accentColor="#E8B84B" />

      {/* Warm lighting */}
      <ambientLight intensity={0.25} color="#e8d0a0" />
      <pointLight position={[0, 3.5, -3]} color="#FFD088" intensity={1.5} distance={12} />

      {/* Torches */}
      <Torch position={[-5.5, 2.5, -4]} />
      <Torch position={[5.5, 2.5, -4]} />
      <Torch position={[-5.5, 2.5, 0]} />
      <Torch position={[5.5, 2.5, 0]} />

      <DustMotes color="#e8d5b7" />

      {/* Fog */}
      <fog attach="fog" args={['#1a1510', 8, 25]} />

      <Suspense fallback={null}>
        <Text position={[0, 3.2, -5]} fontSize={0.28} color="#E8B84B" anchorX="center" outlineWidth={0.01} outlineColor="#000">
          The Phototheology Palace
        </Text>
        <Text position={[0, 2.85, -5]} fontSize={0.1} color="#bba888" anchorX="center">
          8 Floors of Biblical Study — Select a floor
        </Text>
      </Suspense>

      {/* Floor buttons — arranged as two columns (like a grand directory) */}
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
      <VRButton
        position={[0, -0.8, 2]}
        size={[1.5, 0.3]}
        label="< Back to Lobby"
        color="#AA6644"
        fontSize={0.08}
        onSelect={onBack}
      />
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
  const wallColor = FLOOR_WALL_TINT[floor.number] || '#2a2018';
  const groundColor = FLOOR_GROUND[floor.number] || '#3a3020';

  return (
    <group>
      <PalaceInterior wallColor={wallColor} floorColor={groundColor} accentColor={floorColor} />

      {/* Warm ambient + floor-themed accent */}
      <ambientLight intensity={0.2} color="#e8d0a0" />
      <pointLight position={[0, 3.5, -3]} color={floorColor} intensity={1} distance={10} />
      <pointLight position={[0, 3.5, -3]} color="#FFD088" intensity={0.8} distance={10} />

      {/* Torches with floor tint */}
      <Torch position={[-5.5, 2.5, -4]} color={floorColor} />
      <Torch position={[5.5, 2.5, -4]} color={floorColor} />

      <DustMotes color={floorColor} count={20} />
      <fog attach="fog" args={[wallColor, 8, 22]} />

      {/* Floor header banner */}
      <group position={[0, 3, -6.5]}>
        {/* Banner backing */}
        <mesh>
          <planeGeometry args={[5, 0.8]} />
          <meshStandardMaterial color="#1a1208" emissive={floorColor} emissiveIntensity={0.05} />
        </mesh>
        <Suspense fallback={null}>
          <Text position={[0, 0.1, 0.01]} fontSize={0.2} color={floorColor} anchorX="center" outlineWidth={0.01} outlineColor="#000">
            Floor {floor.number}: {floor.name}
          </Text>
          <Text position={[0, -0.15, 0.01]} fontSize={0.08} color="#bba888" anchorX="center">
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
            {/* Door frame */}
            <mesh position={[-0.55, 0.3, -0.02]}>
              <boxGeometry args={[0.06, 1.4, 0.06]} />
              <meshStandardMaterial color="#443322" metalness={0.3} roughness={0.6} />
            </mesh>
            <mesh position={[0.55, 0.3, -0.02]}>
              <boxGeometry args={[0.06, 1.4, 0.06]} />
              <meshStandardMaterial color="#443322" metalness={0.3} roughness={0.6} />
            </mesh>
            <mesh position={[0, 1.02, -0.02]}>
              <boxGeometry args={[1.16, 0.06, 0.06]} />
              <meshStandardMaterial color="#443322" metalness={0.3} roughness={0.6} />
            </mesh>

            {/* Door surface — clickable */}
            <Interactive onSelect={() => onSelectRoom(room)}>
              <mesh onClick={() => onSelectRoom(room)} onPointerDown={() => onSelectRoom(room)}>
                <planeGeometry args={[1.04, 1.3]} />
                <meshStandardMaterial color="#1a1208" emissive={floorColor} emissiveIntensity={0.12} />
              </mesh>
            </Interactive>

            {/* Room name plate */}
            <Suspense fallback={null}>
              <Text position={[0, 0.25, 0.02]} fontSize={0.065} color={floorColor} anchorX="center" maxWidth={0.9}>
                {room.name}
              </Text>
              <Text position={[0, 0.05, 0.02]} fontSize={0.05} color="#998877" anchorX="center">
                [{room.tag.toUpperCase()}]
              </Text>
            </Suspense>

            {/* Soft glow above door */}
            <pointLight position={[0, 1.2, 0.2]} color={floorColor} intensity={0.3} distance={2} />
          </group>
        );
      })}

      {/* Floor navigation — ornate side buttons */}
      {floor.number > 1 && (
        <VRButton
          position={[-5, 1, 0]}
          size={[1.2, 0.35]}
          label={`Floor ${floor.number - 1}`}
          color="#AA8855"
          fontSize={0.065}
          onSelect={() => onFloorChange(-1)}
        />
      )}
      {floor.number < 8 && (
        <VRButton
          position={[5, 1, 0]}
          size={[1.2, 0.35]}
          label={`Floor ${floor.number + 1}`}
          color="#AA8855"
          fontSize={0.065}
          onSelect={() => onFloorChange(1)}
        />
      )}

      <VRButton
        position={[0, -0.8, 2.5]}
        size={[1.5, 0.3]}
        label="< Back to Elevator"
        color="#AA6644"
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
  const wallColor = FLOOR_WALL_TINT[floorNumber] || '#2a2018';
  const groundColor = FLOOR_GROUND[floorNumber] || '#3a3020';

  const methodPreview = room.method.slice(0, 200) + (room.method.length > 200 ? '...' : '');
  const examplesPreview = room.examples.slice(0, 2).map((ex) =>
    ex.length > 100 ? ex.slice(0, 100) + '...' : ex
  );

  return (
    <group>
      <PalaceInterior wallColor={wallColor} floorColor={groundColor} accentColor={floorColor} />

      {/* Study chamber lighting — warm + focused */}
      <ambientLight intensity={0.15} color="#e8d0a0" />
      <pointLight position={[0, 3, -3]} color="#FFD088" intensity={1} distance={8} />
      <pointLight position={[0, 2, -3.2]} color={floorColor} intensity={0.8} distance={6} />

      <Torch position={[-3, 2.5, -5]} color={floorColor} />
      <Torch position={[3, 2.5, -5]} color={floorColor} />

      <DustMotes color={floorColor} count={15} />
      <fog attach="fog" args={[wallColor, 6, 18]} />

      {/* Scroll / parchment panel on back wall */}
      <mesh position={[0, 1.5, -6.4]}>
        <planeGeometry args={[4.2, 3.2]} />
        <meshStandardMaterial color="#2a2218" emissive={floorColor} emissiveIntensity={0.02} />
      </mesh>
      {/* Gold frame around panel */}
      <mesh position={[0, 1.5, -6.38]}>
        <planeGeometry args={[4.35, 3.35]} />
        <meshStandardMaterial color={floorColor} emissive={floorColor} emissiveIntensity={0.08} metalness={0.8} roughness={0.3} />
      </mesh>

      <Suspense fallback={null}>
        <Text position={[0, 2.9, -6.35]} fontSize={0.18} color={floorColor} anchorX="center" outlineWidth={0.01} outlineColor="#000">
          {room.name}
        </Text>
        <Text position={[0, 2.65, -6.35]} fontSize={0.07} color="#998877" anchorX="center">
          [{room.tag.toUpperCase()}] — Floor {floorNumber}: {palaceFloors[floorNumber - 1]?.name}
        </Text>

        {/* Purpose */}
        <Text position={[-1.9, 2.35, -6.35]} fontSize={0.06} color="#E8B84B" anchorX="left">
          Purpose
        </Text>
        <Text position={[-1.9, 2.1, -6.35]} fontSize={0.05} color="#ddc" anchorX="left" maxWidth={3.6} lineHeight={1.3}>
          {room.purpose.slice(0, 200)}{room.purpose.length > 200 ? '...' : ''}
        </Text>

        {/* Core Question */}
        <Text position={[-1.9, 1.6, -6.35]} fontSize={0.06} color="#FFAA55" anchorX="left">
          Core Question
        </Text>
        <Text position={[-1.9, 1.4, -6.35]} fontSize={0.055} color="#eee" anchorX="left" maxWidth={3.6} lineHeight={1.3}>
          {room.coreQuestion}
        </Text>

        {/* Method */}
        <Text position={[-1.9, 1.1, -6.35]} fontSize={0.06} color="#88BBFF" anchorX="left">
          Method
        </Text>
        <Text position={[-1.9, 0.7, -6.35]} fontSize={0.04} color="#ccb" anchorX="left" maxWidth={3.6} lineHeight={1.3}>
          {methodPreview}
        </Text>

        {/* Examples */}
        {examplesPreview.length > 0 && (
          <>
            <Text position={[-1.9, 0.35, -6.35]} fontSize={0.06} color="#88DD88" anchorX="left">
              Examples
            </Text>
            {examplesPreview.map((ex, i) => (
              <Text key={i} position={[-1.9, 0.15 - i * 0.18, -6.35]} fontSize={0.038} color="#bba" anchorX="left" maxWidth={3.6} lineHeight={1.2}>
                {ex}
              </Text>
            ))}
          </>
        )}
      </Suspense>

      <VRButton
        position={[0, -0.8, 2.5]}
        size={[1.5, 0.3]}
        label="< Back to Floor"
        color="#AA6644"
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
      {/* No StarField — we're indoors now */}

      {/* Opaque dark interior sky — blocks any background bleed */}
      <mesh renderOrder={-1}>
        <sphereGeometry args={[30, 16, 16]} />
        <meshBasicMaterial color="#0a0808" side={THREE.BackSide} depthWrite={false} />
      </mesh>

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
