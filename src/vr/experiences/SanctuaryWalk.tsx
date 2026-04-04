import { useState, useMemo, useRef, Suspense, useCallback } from 'react';
import { Text } from '@react-three/drei';
import { TeleportationPlane, Interactive, useController } from '@react-three/xr';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import {
  getSanctuaryElementsByZone,
  type SanctuaryZone,
  type SanctuaryElement,
} from '@/data/sanctuaryLibrary';
import { parseDimensions, cubitsToMeters } from '../utils/cubitsToMeters';
import sanctuaryExterior from '@/assets/vr/sanctuary-exterior.png';
import sanctuaryHolyPlace from '@/assets/vr/sanctuary-holy-place.png';
import sanctuaryMostHoly from '@/assets/vr/sanctuary-most-holy.png';
import { InfoPanel } from '../components/InfoPanel';
import { BackToLobbyButton } from '../components/BackToLobbyButton';

const ZONES: { id: SanctuaryZone; label: string; color: string; groundColor: string; ambientColor: string; zOffset: number }[] = [
  { id: 'camp', label: 'The Camp', color: '#CC8844', groundColor: '#3a2a1a', ambientColor: '#8B7355', zOffset: 0 },
  { id: 'courtyard', label: 'The Courtyard', color: '#DDDDDD', groundColor: '#2a2a2a', ambientColor: '#AAAAAA', zOffset: -12 },
  { id: 'holy-place', label: 'The Holy Place', color: '#FFD700', groundColor: '#2a2210', ambientColor: '#FFD088', zOffset: -24 },
  { id: 'most-holy-place', label: 'The Most Holy Place', color: '#FFD700', groundColor: '#2a2010', ambientColor: '#FFCC44', zOffset: -36 },
];

const ZONE_BACKDROPS: Record<string, string> = {
  'camp': sanctuaryExterior,
  'courtyard': sanctuaryExterior,
  'holy-place': sanctuaryHolyPlace,
  'most-holy-place': sanctuaryMostHoly,
};

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

/** Reads VR thumbstick and drives smooth locomotion along the sanctuary path */
function useThumbstickLocomotion(
  posRef: React.MutableRefObject<number>,
  setActiveZone: (z: number) => void,
  speed: number = 4,
) {
  const rightController = useController('right');
  const leftController = useController('left');

  useFrame((_, delta) => {
    // Read thumbstick Y axis from either controller (axes[3] = forward/back)
    let axisY = 0;
    const rGP = rightController?.inputSource?.gamepad;
    const lGP = leftController?.inputSource?.gamepad;
    if (rGP && rGP.axes.length >= 4) axisY = rGP.axes[3];
    if (Math.abs(axisY) < 0.15 && lGP && lGP.axes.length >= 4) axisY = lGP.axes[3];

    // Dead zone
    if (Math.abs(axisY) < 0.15) return;

    // Move (pushing stick forward = negative axis = walk deeper into sanctuary)
    const minZ = ZONES[ZONES.length - 1].zOffset;
    const maxZ = ZONES[0].zOffset;
    posRef.current = Math.max(minZ, Math.min(maxZ, posRef.current + axisY * speed * delta));

    // Update active zone based on current position
    let closest = 0;
    let closestDist = Infinity;
    for (let i = 0; i < ZONES.length; i++) {
      const dist = Math.abs(posRef.current - ZONES[i].zOffset);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    }
    setActiveZone(closest);
  });
}

/** Smoothly interpolates the scene group position each frame */
function useSmoothPosition(groupRef: React.RefObject<THREE.Group | null>, posRef: React.MutableRefObject<number>) {
  const currentZ = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    // Lerp toward target
    currentZ.current += ((-posRef.current) - currentZ.current) * Math.min(1, delta * 6);
    groupRef.current.position.z = currentZ.current;
  });
}

function SceneBackdrop({ zoneId }: { zoneId: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const backdropUrl = ZONE_BACKDROPS[zoneId];
  const texture = useLoader(THREE.TextureLoader, backdropUrl || sanctuaryExterior);

  useFrame(({ camera }) => {
    if (!meshRef.current) return;
    meshRef.current.quaternion.copy(camera.quaternion);
  });

  return (
    <mesh ref={meshRef} position={[0, 2, -40]}>
      <planeGeometry args={[60, 34]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.4}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

interface SanctuaryWalkProps {
  onBack: () => void;
}

export default function SanctuaryWalk({ onBack }: SanctuaryWalkProps) {
  const [activeZone, setActiveZone] = useState(0);
  const sceneRef = useRef<THREE.Group>(null);
  // Continuous Z position for smooth joystick movement
  const posRef = useRef(ZONES[0].zOffset);

  const zoneData = useMemo(() => {
    return ZONES.map((zone) => ({
      ...zone,
      elements: getSanctuaryElementsByZone(zone.id),
    }));
  }, []);

  const goPrev = useCallback(() => {
    if (activeZone > 0) {
      const newZone = activeZone - 1;
      setActiveZone(newZone);
      posRef.current = ZONES[newZone].zOffset;
    }
  }, [activeZone]);

  const goNext = useCallback(() => {
    if (activeZone < ZONES.length - 1) {
      const newZone = activeZone + 1;
      setActiveZone(newZone);
      posRef.current = ZONES[newZone].zOffset;
    }
  }, [activeZone]);

  // Thumbstick locomotion in VR
  useThumbstickLocomotion(posRef, setActiveZone);
  // Smooth scene position interpolation
  useSmoothPosition(sceneRef, posRef);

  const currentZone = ZONES[activeZone];

  return (
    <>
    <group ref={sceneRef}>
      <SceneBackdrop zoneId={ZONES[activeZone].id} />

      {/* Rich warm lighting */}
      <ambientLight intensity={0.3} color="#fff5e6" />
      <directionalLight position={[5, 10, 5]} intensity={1} color="#ffe8c4" castShadow />
      <directionalLight position={[-5, 4, -3]} intensity={0.4} color="#ffd088" />
      <directionalLight position={[0, 2, 8]} intensity={0.3} color="#ffe8d0" />

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
        <meshPhysicalMaterial color="#3a2a1a" roughness={0.7} metalness={0.2} clearcoat={0.3} clearcoatRoughness={0.8} />
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
          <IncenseParticles position={[0, 0, -2]} color={zone.color} count={30} />

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

    </group>

    {/* ── Zone Navigation HUD ── outside moving group, stays at camera position */}
    <group position={[0, 0.1, 0.5]}>
      {/* Dark nav panel background */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[4.8, 0.9]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.6} />
      </mesh>

      {/* Zone indicator dots */}
      {ZONES.map((zone, i) => (
        <group key={zone.id} position={[(i - 1.5) * 0.5, 0.2, 0]}>
          <mesh>
            <circleGeometry args={[i === activeZone ? 0.08 : 0.05, 16]} />
            <meshBasicMaterial
              color={zone.color}
              transparent
              opacity={i === activeZone ? 1 : 0.3}
            />
          </mesh>
          <Suspense fallback={null}>
            <Text position={[0, -0.12, 0.01]} fontSize={0.04} color={i === activeZone ? '#fff' : '#666'} anchorX="center">
              {zone.label}
            </Text>
          </Suspense>
        </group>
      ))}

      {/* Previous button — large and clear */}
      <Interactive onSelect={goPrev}>
        <mesh position={[-1.8, -0.05, 0]} onClick={goPrev} onPointerDown={goPrev}>
          <planeGeometry args={[1.2, 0.5]} />
          <meshStandardMaterial
            color={activeZone > 0 ? '#1a1a30' : '#111118'}
            emissive={activeZone > 0 ? currentZone.color : '#333'}
            emissiveIntensity={activeZone > 0 ? 0.2 : 0.02}
          />
        </mesh>
      </Interactive>
      <Suspense fallback={null}>
        <Text position={[-1.8, -0.05, 0.01]} fontSize={0.12} color={activeZone > 0 ? '#fff' : '#555'} anchorX="center" anchorY="middle">
          ← Previous
        </Text>
      </Suspense>

      {/* Next button — large and clear */}
      <Interactive onSelect={goNext}>
        <mesh position={[1.8, -0.05, 0]} onClick={goNext} onPointerDown={goNext}>
          <planeGeometry args={[1.2, 0.5]} />
          <meshStandardMaterial
            color={activeZone < ZONES.length - 1 ? '#1a1a30' : '#111118'}
            emissive={activeZone < ZONES.length - 1 ? currentZone.color : '#333'}
            emissiveIntensity={activeZone < ZONES.length - 1 ? 0.2 : 0.02}
          />
        </mesh>
      </Interactive>
      <Suspense fallback={null}>
        <Text position={[1.8, -0.05, 0.01]} fontSize={0.12} color={activeZone < ZONES.length - 1 ? '#fff' : '#555'} anchorX="center" anchorY="middle">
          Next →
        </Text>
      </Suspense>
    </group>

    {/* Back button — positioned clearly below nav */}
    <BackToLobbyButton onBack={onBack} position={[0, -0.5, 0.5]} />
    </>
  );
}
