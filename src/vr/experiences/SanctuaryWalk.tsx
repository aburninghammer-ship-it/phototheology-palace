import { useState, useMemo, useRef, Suspense } from 'react';
import { Text } from '@react-three/drei';
import { TeleportationPlane, Interactive } from '@react-three/xr';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  getSanctuaryElementsByZone,
  type SanctuaryZone,
  type SanctuaryElement,
} from '@/data/sanctuaryLibrary';
import { parseDimensions, cubitsToMeters } from '../utils/cubitsToMeters';
import { InfoPanel } from '../components/InfoPanel';
import { BackToLobbyButton } from '../components/BackToLobbyButton';

const ZONES: { id: SanctuaryZone; label: string; color: string; groundColor: string; ambientColor: string; zOffset: number }[] = [
  { id: 'camp', label: 'The Camp', color: '#CC8844', groundColor: '#3a2a1a', ambientColor: '#8B7355', zOffset: 0 },
  { id: 'courtyard', label: 'The Courtyard', color: '#DDDDDD', groundColor: '#2a2a2a', ambientColor: '#AAAAAA', zOffset: -12 },
  { id: 'holy-place', label: 'The Holy Place', color: '#FFD700', groundColor: '#2a2210', ambientColor: '#FFD088', zOffset: -24 },
  { id: 'most-holy-place', label: 'The Most Holy Place', color: '#FFD700', groundColor: '#2a2010', ambientColor: '#FFCC44', zOffset: -36 },
];

// Flickering torch for sanctuary atmosphere
function SanctuaryTorch({ position, color = '#FF8822' }: { position: [number, number, number]; color?: string }) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!lightRef.current) return;
    const t = clock.getElapsedTime() + position[0] * 5;
    lightRef.current.intensity = 1.5 + Math.sin(t * 5) * 0.4 + Math.sin(t * 8) * 0.2;
  });

  return (
    <group position={position}>
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.02, 0.035, 0.4, 6]} />
        <meshStandardMaterial color="#665544" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </mesh>
      <pointLight ref={lightRef} position={[0, 0.1, 0]} color={color} intensity={1.5} distance={8} />
    </group>
  );
}

// Floating dust/incense particles
function IncenseParticles({ position, color = '#FFD700', count = 20 }: { position: [number, number, number]; color?: string; count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const basePositions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 1] = Math.random() * 3;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return pos;
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const arr = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const t = clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      arr[i * 3] = basePositions[i * 3] + Math.sin(t * 0.2 + i * 0.5) * 0.5;
      arr[i * 3 + 1] = ((basePositions[i * 3 + 1] + t * 0.06) % 3.5);
      arr[i * 3 + 2] = basePositions[i * 3 + 2] + Math.cos(t * 0.15 + i) * 0.3;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} position={position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={new Float32Array(basePositions)} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color={color} transparent opacity={0.4} depthWrite={false} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
}

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
    return {
      width: Math.max(parsed.width, 0.2),
      height: Math.max(parsed.height, 0.2),
      depth: Math.max(parsed.depth, 0.2),
    };
  }, [element.dimensions]);

  const isRound = element.name.toLowerCase().includes('laver') ||
    element.name.toLowerCase().includes('lampstand');

  const toggle = () => setShowInfo(!showInfo);

  return (
    <group position={position}>
      <Interactive onSelect={toggle}>
        <mesh
          position={[0, dims.height / 2, 0]}
          onClick={toggle}
          onPointerDown={toggle}
          castShadow
        >
          {isRound ? (
            <cylinderGeometry args={[dims.width / 2, dims.width / 2, dims.height, 16]} />
          ) : (
            <boxGeometry args={[dims.width, dims.height, dims.depth]} />
          )}
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.15}
            metalness={color === '#FFD700' ? 0.85 : 0.3}
            roughness={color === '#FFD700' ? 0.15 : 0.6}
          />
        </mesh>
      </Interactive>

      {/* Pedestal glow ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[Math.max(dims.width, dims.depth) * 0.6, Math.max(dims.width, dims.depth) * 0.8, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      <Suspense fallback={null}>
        <Text
          position={[0, -0.1, 0.3]}
          fontSize={0.09}
          color="#ffffff"
          anchorX="center"
          anchorY="top"
          outlineWidth={0.006}
          outlineColor="black"
        >
          {element.name}
        </Text>

        {element.hebrewName && (
          <Text position={[0, -0.28, 0.3]} fontSize={0.075} color={color} anchorX="center" anchorY="top">
            {element.hebrewName}
          </Text>
        )}
      </Suspense>

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

      {/* Gentle item spotlight */}
      <pointLight position={[0, dims.height + 0.5, 0.5]} color={color} intensity={0.3} distance={3} />
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

  const goPrev = () => activeZone > 0 && setActiveZone(activeZone - 1);
  const goNext = () => activeZone < ZONES.length - 1 && setActiveZone(activeZone + 1);

  const targetZ = ZONES[activeZone].zOffset;
  const currentZone = ZONES[activeZone];

  return (
    <group position={[0, 0, -targetZ]}>
      {/* Rich warm lighting */}
      <ambientLight intensity={0.3} color="#fff5e6" />
      <directionalLight position={[5, 10, 5]} intensity={1} color="#ffe8c4" castShadow />

      {/* Sky dome — warm desert gradient */}
      <mesh>
        <sphereGeometry args={[60, 24, 16]} />
        <meshBasicMaterial color="#1a1520" side={THREE.BackSide} />
      </mesh>

      {/* Fog for depth */}
      <fog attach="fog" args={['#1a1520', 12, 45]} />

      <TeleportationPlane leftHand rightHand maxDistance={20} />

      {/* Rich ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, -18]} receiveShadow>
        <planeGeometry args={[14, 55]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.85} metalness={0.1} />
      </mesh>

      {/* Decorative path center */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.19, -18]}>
        <planeGeometry args={[3, 55]} />
        <meshStandardMaterial color="#4a3a2a" roughness={0.8} metalness={0.15} />
      </mesh>

      {zoneData.map((zone) => (
        <group key={zone.id} position={[0, 0, zone.zOffset]}>
          {/* Zone title — vibrant */}
          <Suspense fallback={null}>
            <Text
              position={[0, 2.8, 0]}
              fontSize={0.35}
              color={zone.color}
              anchorX="center"
              outlineWidth={0.012}
              outlineColor="#000"
            >
              {zone.label}
            </Text>
          </Suspense>

          {/* Zone boundary pillars with glow */}
          <mesh position={[-5, 0.5, 0]}>
            <cylinderGeometry args={[0.1, 0.12, 3.5, 8]} />
            <meshStandardMaterial color={zone.color} emissive={zone.color} emissiveIntensity={0.3} metalness={0.5} roughness={0.3} />
          </mesh>
          <mesh position={[5, 0.5, 0]}>
            <cylinderGeometry args={[0.1, 0.12, 3.5, 8]} />
            <meshStandardMaterial color={zone.color} emissive={zone.color} emissiveIntensity={0.3} metalness={0.5} roughness={0.3} />
          </mesh>

          {/* Zone-colored ground accent */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.18, -3]}>
            <planeGeometry args={[10, 8]} />
            <meshStandardMaterial color={zone.groundColor} emissive={zone.color} emissiveIntensity={0.02} roughness={0.8} />
          </mesh>

          {/* Torches flanking zone */}
          <SanctuaryTorch position={[-4, 2, -2]} color={zone.ambientColor} />
          <SanctuaryTorch position={[4, 2, -2]} color={zone.ambientColor} />

          {/* Zone ambient light */}
          <pointLight position={[0, 3, -3]} color={zone.ambientColor} intensity={0.8} distance={12} />

          {/* Floating incense/dust particles */}
          <IncenseParticles position={[0, 0, -2]} color={zone.color} count={15} />

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

      {/* Zone navigation — styled buttons */}
      <group position={[0, 0.5, 1]}>
        <Interactive onSelect={goPrev}>
          <mesh position={[-1.2, 0, 0]} onClick={goPrev} onPointerDown={goPrev}>
            <planeGeometry args={[1.2, 0.3]} />
            <meshStandardMaterial
              color={activeZone > 0 ? '#1a1a30' : '#111118'}
              emissive={activeZone > 0 ? currentZone.color : '#333'}
              emissiveIntensity={activeZone > 0 ? 0.15 : 0.02}
            />
          </mesh>
        </Interactive>
        <Suspense fallback={null}>
          <Text position={[-1.2, 0, 0.01]} fontSize={0.1} color={activeZone > 0 ? '#fff' : '#555'} anchorX="center">
            Previous Zone
          </Text>
          <Text position={[0, 0, 0.01]} fontSize={0.11} color={currentZone.color} anchorX="center" outlineWidth={0.005} outlineColor="#000">
            {ZONES[activeZone].label}
          </Text>
          <Text position={[1.2, 0, 0.01]} fontSize={0.1} color={activeZone < ZONES.length - 1 ? '#fff' : '#555'} anchorX="center">
            Next Zone
          </Text>
        </Suspense>
        <Interactive onSelect={goNext}>
          <mesh position={[1.2, 0, 0]} onClick={goNext} onPointerDown={goNext}>
            <planeGeometry args={[1.0, 0.3]} />
            <meshStandardMaterial
              color={activeZone < ZONES.length - 1 ? '#1a1a30' : '#111118'}
              emissive={activeZone < ZONES.length - 1 ? currentZone.color : '#333'}
              emissiveIntensity={activeZone < ZONES.length - 1 ? 0.15 : 0.02}
            />
          </mesh>
        </Interactive>
      </group>

      {/* Back button */}
      <BackToLobbyButton onBack={onBack} />
    </group>
  );
}
