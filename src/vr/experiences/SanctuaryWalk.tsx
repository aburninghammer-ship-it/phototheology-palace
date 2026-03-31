import { useState, useMemo } from 'react';
import { Text } from '@react-three/drei';
import { TeleportationPlane } from '@react-three/xr';
import {
  getSanctuaryElementsByZone,
  type SanctuaryZone,
  type SanctuaryElement,
} from '@/data/sanctuaryLibrary';
import { parseDimensions, cubitsToMeters } from '../utils/cubitsToMeters';
import { InfoPanel } from '../components/InfoPanel';

const ZONES: { id: SanctuaryZone; label: string; color: string; zOffset: number }[] = [
  { id: 'camp', label: 'The Camp', color: '#8B7355', zOffset: 0 },
  { id: 'courtyard', label: 'The Courtyard', color: '#C0C0C0', zOffset: -12 },
  { id: 'holy-place', label: 'The Holy Place', color: '#FFD700', zOffset: -24 },
  { id: 'most-holy-place', label: 'The Most Holy Place', color: '#FFD700', zOffset: -36 },
];

interface FurnitureMeshProps {
  element: SanctuaryElement;
  position: [number, number, number];
  color: string;
}

function FurnitureMesh({ element, position, color }: FurnitureMeshProps) {
  const [showInfo, setShowInfo] = useState(false);

  const dims = useMemo(() => {
    if (!element.dimensions) return { width: 0.5, height: 0.5, depth: 0.5 };
    const parsed = parseDimensions(element.dimensions);
    if (!parsed) return { width: 0.5, height: 0.5, depth: 0.5 };
    // Clamp for VR visibility — very small items get a minimum size
    return {
      width: Math.max(parsed.width, 0.2),
      height: Math.max(parsed.height, 0.2),
      depth: Math.max(parsed.depth, 0.2),
    };
  }, [element.dimensions]);

  // Use cylinder for laver/altar-like items, box for others
  const isRound = element.name.toLowerCase().includes('laver') ||
    element.name.toLowerCase().includes('lampstand');

  return (
    <group position={position}>
      {/* Furniture mesh */}
      <mesh
        position={[0, dims.height / 2, 0]}
        onClick={() => setShowInfo(!showInfo)}
        castShadow
      >
        {isRound ? (
          <cylinderGeometry args={[dims.width / 2, dims.width / 2, dims.height, 16]} />
        ) : (
          <boxGeometry args={[dims.width, dims.height, dims.depth]} />
        )}
        <meshStandardMaterial
          color={color}
          metalness={color === '#FFD700' ? 0.8 : 0.3}
          roughness={color === '#FFD700' ? 0.2 : 0.6}
        />
      </mesh>

      {/* Name label below */}
      <Text
        position={[0, -0.1, 0.3]}
        fontSize={0.08}
        color="white"
        anchorX="center"
        anchorY="top"
        outlineWidth={0.005}
        outlineColor="black"
      >
        {element.name}
      </Text>

      {/* Hebrew name */}
      {element.hebrewName && (
        <Text
          position={[0, -0.25, 0.3]}
          fontSize={0.06}
          color="#aaa"
          anchorX="center"
          anchorY="top"
        >
          {element.hebrewName}
        </Text>
      )}

      {/* Detailed info panel on click */}
      {showInfo && (
        <InfoPanel
          position={[0, dims.height + 0.8, 0]}
          title={element.name}
          subtitle={element.hebrewName ? `${element.hebrewName} — ${element.hebrewMeaning || ''}` : undefined}
          body={element.christConnection}
          color={color}
          width={1.5}
        />
      )}
    </group>
  );
}

interface SanctuaryWalkProps {
  onBack: () => void;
}

export default function SanctuaryWalk({ onBack }: SanctuaryWalkProps) {
  const [activeZone, setActiveZone] = useState(0);

  const zoneData = useMemo(() => {
    return ZONES.map((zone) => ({
      ...zone,
      elements: getSanctuaryElementsByZone(zone.id),
    }));
  }, []);

  return (
    <group>
      {/* Warm ambient light */}
      <ambientLight intensity={0.4} color="#fff5e6" />
      <directionalLight position={[5, 10, 5]} intensity={0.8} color="#ffe8c4" castShadow />

      {/* Teleportation ground plane */}
      <TeleportationPlane
        leftHand
        rightHand
        maxDistance={20}
      />

      {/* Visible ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, -18]} receiveShadow>
        <planeGeometry args={[12, 50]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.9} />
      </mesh>

      {/* Zone labels and elements */}
      {zoneData.map((zone, zoneIdx) => (
        <group key={zone.id} position={[0, 0, zone.zOffset]}>
          {/* Zone title */}
          <Text
            position={[0, 2.5, 0]}
            fontSize={0.3}
            color={zone.color}
            anchorX="center"
            outlineWidth={0.01}
            outlineColor="#000"
          >
            {zone.label}
          </Text>

          {/* Zone boundary markers */}
          <mesh position={[-5, 0, 0]}>
            <boxGeometry args={[0.1, 3, 0.1]} />
            <meshStandardMaterial color={zone.color} emissive={zone.color} emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[5, 0, 0]}>
            <boxGeometry args={[0.1, 3, 0.1]} />
            <meshStandardMaterial color={zone.color} emissive={zone.color} emissiveIntensity={0.3} />
          </mesh>

          {/* Furniture elements laid out in a row */}
          {zone.elements.map((el, i) => {
            const spacing = 2.5;
            const totalWidth = (zone.elements.length - 1) * spacing;
            const x = -totalWidth / 2 + i * spacing;
            const furnitureColor =
              zone.id === 'holy-place' || zone.id === 'most-holy-place'
                ? '#FFD700'
                : zone.id === 'courtyard'
                  ? '#CD7F32'
                  : '#8B7355';
            return (
              <FurnitureMesh
                key={el.id}
                element={el}
                position={[x, -1.2, -2]}
                color={furnitureColor}
              />
            );
          })}
        </group>
      ))}

      {/* Zone navigation buttons */}
      <group position={[0, 0.5, 1]}>
        <Text
          position={[-1, 0, 0]}
          fontSize={0.12}
          color={activeZone > 0 ? '#fff' : '#555'}
          anchorX="center"
          onClick={() => activeZone > 0 && setActiveZone(activeZone - 1)}
        >
          ← Previous Zone
        </Text>
        <Text
          position={[0, 0, 0]}
          fontSize={0.1}
          color="#aaa"
          anchorX="center"
        >
          {ZONES[activeZone].label}
        </Text>
        <Text
          position={[1, 0, 0]}
          fontSize={0.12}
          color={activeZone < ZONES.length - 1 ? '#fff' : '#555'}
          anchorX="center"
          onClick={() => activeZone < ZONES.length - 1 && setActiveZone(activeZone + 1)}
        >
          Next Zone →
        </Text>
      </group>

      {/* Back button */}
      <Text
        position={[0, 0.2, 1.5]}
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
