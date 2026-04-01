import { useState, Suspense, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Interactive } from '@react-three/xr';
import * as THREE from 'three';
import { StarField } from '../components/StarField';
import { palaceFloors, type Floor, type Room } from '@/data/palaceData';
import { CANONICAL_ROOMS } from '@/data/canonicalRooms';

// ── Floor theming ───────────────────────────────────────────────────────────

const FLOOR_COLORS: Record<number, string> = {
  1: '#FFD700', // Furnishing — Amber/Gold
  2: '#4488FF', // Investigation — Cool Blue
  3: '#44FF88', // Freestyle — Green
  4: '#9944FF', // Next Level — Purple
  5: '#4466FF', // Vision — Deep Blue
  6: '#6688FF', // Three Heavens — Cosmic Blue
  7: '#FF6622', // Transformation — Orange/Red
  8: '#FFFFFF', // Master — White/Silver
};

const FLOOR_GROUND: Record<number, string> = {
  1: '#2a2008', 2: '#0a1528', 3: '#082018', 4: '#1a0828',
  5: '#0a0c28', 6: '#0c1028', 7: '#281008', 8: '#181818',
};

// ── Types ───────────────────────────────────────────────────────────────────

type ViewMode = 'elevator' | 'floor' | 'room';

interface PalaceTourProps {
  onBack: () => void;
}

// ── VR Button ───────────────────────────────────────────────────────────────

function VRButton({
  position,
  size = [2, 0.35],
  label,
  color,
  onSelect,
  fontSize = 0.08,
  sublabel,
}: {
  position: [number, number, number];
  size?: [number, number];
  label: string;
  color: string;
  onSelect: () => void;
  fontSize?: number;
  sublabel?: string;
}) {
  return (
    <group position={position}>
      <Interactive onSelect={onSelect}>
        <mesh onClick={onSelect}>
          <planeGeometry args={size} />
          <meshStandardMaterial color="#1a1a2e" emissive={color} emissiveIntensity={0.2} />
        </mesh>
      </Interactive>
      <Suspense fallback={null}>
        <Text position={[0, sublabel ? 0.04 : 0, 0.01]} fontSize={fontSize} color="#eee" anchorX="center" anchorY="middle" maxWidth={size[0] - 0.15}>
          {label}
        </Text>
        {sublabel && (
          <Text position={[0, -0.06, 0.01]} fontSize={0.05} color="#aaa" anchorX="center" anchorY="middle" maxWidth={size[0] - 0.15}>
            {sublabel}
          </Text>
        )}
      </Suspense>
    </group>
  );
}

// ── Ambient Particles ───────────────────────────────────────────────────────

function FloorParticles({ color }: { color: string }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 40;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = Math.random() * 4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const arr = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const t = clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] = ((positions[i * 3 + 1] + t * 0.15) % 4);
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={new Float32Array(positions)} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color={color} transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
    </points>
  );
}

// ── Elevator View ───────────────────────────────────────────────────────────

function ElevatorView({
  onSelectFloor,
  onBack,
}: {
  onSelectFloor: (floorNum: number) => void;
  onBack: () => void;
}) {
  return (
    <group>
      <Suspense fallback={null}>
        <Text position={[0, 3, -3]} fontSize={0.25} color="#E8B84B" anchorX="center" outlineWidth={0.01} outlineColor="#000">
          Phototheology Palace
        </Text>
        <Text position={[0, 2.65, -3]} fontSize={0.1} color="#888" anchorX="center">
          8 Floors — Select a floor to explore
        </Text>
      </Suspense>

      {/* Floor buttons in vertical column */}
      <group position={[0, 1.8, -3]}>
        {palaceFloors.map((floor, i) => {
          const color = FLOOR_COLORS[floor.number] || '#888';
          return (
            <VRButton
              key={floor.number}
              position={[0, -i * 0.38, 0]}
              size={[3, 0.32]}
              label={`Floor ${floor.number}: ${floor.name}`}
              sublabel={`${floor.subtitle} — ${floor.rooms.length} rooms`}
              color={color}
              fontSize={0.075}
              onSelect={() => onSelectFloor(floor.number)}
            />
          );
        })}
      </group>

      {/* Back to Lobby */}
      <VRButton
        position={[0, -1.5, -1]}
        size={[1.5, 0.3]}
        label="< Back to Lobby"
        color="#FF6666"
        fontSize={0.08}
        onSelect={onBack}
      />
    </group>
  );
}

// ── Floor View ──────────────────────────────────────────────────────────────

function FloorView({
  floor,
  onSelectRoom,
  onFloorChange,
  onBackToElevator,
}: {
  floor: Floor;
  onSelectRoom: (room: Room) => void;
  onFloorChange: (delta: number) => void;
  onBackToElevator: () => void;
}) {
  const floorColor = FLOOR_COLORS[floor.number] || '#888';
  const groundColor = FLOOR_GROUND[floor.number] || '#1a1a2e';
  const rooms = floor.rooms;

  return (
    <group>
      {/* Floor-themed ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, -2]} receiveShadow>
        <circleGeometry args={[12, 32]} />
        <meshStandardMaterial color={groundColor} roughness={0.9} />
      </mesh>

      {/* Floor-themed accent light */}
      <pointLight position={[0, 3, -2]} color={floorColor} intensity={1.5} distance={12} />

      {/* Particles */}
      <FloorParticles color={floorColor} />

      {/* Floor header */}
      <Suspense fallback={null}>
        <Text position={[0, 2.8, -3]} fontSize={0.22} color={floorColor} anchorX="center" outlineWidth={0.01} outlineColor="#000">
          Floor {floor.number}: {floor.name}
        </Text>
        <Text position={[0, 2.5, -3]} fontSize={0.09} color="#aaa" anchorX="center" maxWidth={4}>
          {floor.subtitle} — {floor.rooms.length} rooms
        </Text>
      </Suspense>

      {/* Room portals in semicircle */}
      {rooms.map((room, i) => {
        const angleSpread = Math.min(Math.PI * 0.7, rooms.length * 0.18);
        const angle = rooms.length === 1
          ? 0
          : ((i / (rooms.length - 1)) - 0.5) * angleSpread;
        const radius = 4;
        const x = Math.sin(angle) * radius;
        const z = -Math.cos(angle) * radius;
        const rotY = -angle;

        const canonical = CANONICAL_ROOMS.get(room.id);
        const roomColor = floorColor; // Use floor color for consistency

        return (
          <group key={room.id} position={[x, 0.8, z]} rotation={[0, rotY, 0]}>
            <Interactive onSelect={() => onSelectRoom(room)}>
              <mesh onClick={() => onSelectRoom(room)}>
                <planeGeometry args={[1.3, 0.6]} />
                <meshStandardMaterial color="#1a1a2e" emissive={roomColor} emissiveIntensity={0.2} />
              </mesh>
            </Interactive>
            <Suspense fallback={null}>
              <Text position={[0, 0.1, 0.01]} fontSize={0.07} color={roomColor} anchorX="center" maxWidth={1.2}>
                {room.name}
              </Text>
              <Text position={[0, -0.1, 0.01]} fontSize={0.055} color="#888" anchorX="center">
                [{room.tag.toUpperCase()}]
              </Text>
            </Suspense>
            <pointLight position={[0, 0, 0.3]} color={roomColor} intensity={0.2} distance={1.5} />
          </group>
        );
      })}

      {/* Floor navigation */}
      {floor.number > 1 && (
        <VRButton
          position={[-3, 0.5, 0]}
          size={[1, 0.3]}
          label={`< Floor ${floor.number - 1}`}
          color="#666"
          fontSize={0.06}
          onSelect={() => onFloorChange(-1)}
        />
      )}
      {floor.number < 8 && (
        <VRButton
          position={[3, 0.5, 0]}
          size={[1, 0.3]}
          label={`Floor ${floor.number + 1} >`}
          color="#666"
          fontSize={0.06}
          onSelect={() => onFloorChange(1)}
        />
      )}

      {/* Back to Elevator */}
      <VRButton
        position={[0, -0.8, 2]}
        size={[1.5, 0.3]}
        label="< Back to Elevator"
        color="#FF6666"
        fontSize={0.08}
        onSelect={onBackToElevator}
      />
    </group>
  );
}

// ── Room View ───────────────────────────────────────────────────────────────

function RoomView({
  room,
  floorNumber,
  onBack,
}: {
  room: Room;
  floorNumber: number;
  onBack: () => void;
}) {
  const floorColor = FLOOR_COLORS[floorNumber] || '#888';

  // Truncate method for display
  const methodPreview = room.method.slice(0, 200) + (room.method.length > 200 ? '...' : '');
  const examplesPreview = room.examples.slice(0, 3).map((ex) =>
    ex.length > 120 ? ex.slice(0, 120) + '...' : ex
  );

  return (
    <group>
      {/* Accent lighting */}
      <pointLight position={[0, 3, -2]} color={floorColor} intensity={2} distance={10} />
      <pointLight position={[-2, 2, -2]} color={floorColor} intensity={0.5} distance={6} />

      {/* Info panel background */}
      <mesh position={[0, 1.3, -3.5]}>
        <planeGeometry args={[4, 3]} />
        <meshStandardMaterial color="#0a0a15" emissive={floorColor} emissiveIntensity={0.03} transparent opacity={0.9} />
      </mesh>

      <Suspense fallback={null}>
        {/* Room name and code */}
        <Text position={[0, 2.6, -3.48]} fontSize={0.18} color={floorColor} anchorX="center" outlineWidth={0.01} outlineColor="#000">
          {room.name}
        </Text>
        <Text position={[0, 2.35, -3.48]} fontSize={0.08} color="#888" anchorX="center">
          [{room.tag.toUpperCase()}] — Floor {floorNumber}
        </Text>

        {/* Purpose */}
        <Text position={[-1.8, 2.1, -3.48]} fontSize={0.065} color="#BB88FF" anchorX="left">
          Purpose
        </Text>
        <Text position={[-1.8, 1.85, -3.48]} fontSize={0.055} color="#ccc" anchorX="left" maxWidth={3.5} lineHeight={1.3}>
          {room.purpose.slice(0, 180)}{room.purpose.length > 180 ? '...' : ''}
        </Text>

        {/* Core Question */}
        <Text position={[-1.8, 1.4, -3.48]} fontSize={0.065} color="#FFAA44" anchorX="left">
          Core Question
        </Text>
        <Text position={[-1.8, 1.2, -3.48]} fontSize={0.06} color="#eee" anchorX="left" maxWidth={3.5} lineHeight={1.3}>
          {room.coreQuestion}
        </Text>

        {/* Method preview */}
        <Text position={[-1.8, 0.9, -3.48]} fontSize={0.065} color="#44BBFF" anchorX="left">
          Method
        </Text>
        <Text position={[-1.8, 0.55, -3.48]} fontSize={0.045} color="#bbb" anchorX="left" maxWidth={3.5} lineHeight={1.3}>
          {methodPreview}
        </Text>

        {/* Examples */}
        {examplesPreview.length > 0 && (
          <>
            <Text position={[-1.8, 0.15, -3.48]} fontSize={0.065} color="#44FF88" anchorX="left">
              Examples
            </Text>
            {examplesPreview.map((ex, i) => (
              <Text key={i} position={[-1.8, -0.05 - i * 0.2, -3.48]} fontSize={0.04} color="#aaa" anchorX="left" maxWidth={3.5} lineHeight={1.2}>
                {ex}
              </Text>
            ))}
          </>
        )}
      </Suspense>

      {/* Back button */}
      <VRButton
        position={[0, -0.8, 2]}
        size={[1.5, 0.3]}
        label="< Back to Floor"
        color="#FF6666"
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
  const floorColor = FLOOR_COLORS[currentFloor] || '#888';

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
    if (next >= 1 && next <= 8) {
      setCurrentFloor(next);
    }
  };

  return (
    <group>
      <StarField count={1200} radius={80} />
      <ambientLight intensity={0.15} color="#4466aa" />

      {/* Default ground (elevator view uses this) */}
      {viewMode === 'elevator' && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
          <circleGeometry args={[15, 32]} />
          <meshStandardMaterial color="#1a1508" roughness={0.95} />
        </mesh>
      )}

      {/* Views — only render current */}
      {viewMode === 'elevator' && (
        <ElevatorView
          onSelectFloor={handleSelectFloor}
          onBack={onBack}
        />
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
        <RoomView
          room={selectedRoom}
          floorNumber={currentFloor}
          onBack={() => setViewMode('floor')}
        />
      )}
    </group>
  );
}
