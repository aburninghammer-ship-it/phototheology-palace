/**
 * Sanctuary Priest Simulator — Walk through tabernacle stations in order.
 * Teaches the Blue Room (BL) blueprint from Floor 5.
 */
import { useState, Suspense, useCallback } from 'react';
import { Text } from '@react-three/drei';
import { Interactive } from '@react-three/xr';
import * as THREE from 'three';
import { StarField } from '../components/StarField';
import { BackToLobbyButton } from '../components/BackToLobbyButton';
import {
  AltarOfBurntOffering,
  BronzeLaver,
  GoldenLampstand,
  TableOfShowbread,
  AltarOfIncense,
  ArkOfTheCovenant,
} from '../components/SanctuaryFurniture';

interface Station {
  id: string;
  name: string;
  zone: string;
  action: string;
  scripture: string;
  christConnection: string;
  color: string;
}

const STATIONS: Station[] = [
  {
    id: 'gate', name: 'Enter the Gate', zone: 'Courtyard',
    action: 'Present your sacrifice at the entrance — there is only one way in.',
    scripture: 'John 10:9 — "I am the door"',
    christConnection: 'Christ is the only gate to God. No other access.',
    color: '#FFFFFF',
  },
  {
    id: 'altar', name: 'Altar of Burnt Offering', zone: 'Courtyard',
    action: 'Lay hands on the lamb, confess sin, and the priest slays it. Blood is applied to the horns.',
    scripture: 'Romans 12:1 — "Present your body a living sacrifice"',
    christConnection: 'Christ is our sacrifice — His blood covers our sin on the altar of the cross.',
    color: '#CD7F32',
  },
  {
    id: 'laver', name: 'Bronze Laver', zone: 'Courtyard',
    action: 'Wash hands and feet before entering the Holy Place. Failure means death.',
    scripture: 'Ephesians 5:26 — "Washing of water by the word"',
    christConnection: 'Christ cleanses us by the Word. Daily washing is essential for service.',
    color: '#4488CC',
  },
  {
    id: 'lampstand', name: 'Golden Lampstand', zone: 'Holy Place',
    action: 'Trim the wicks, add olive oil. The lamp must never go out.',
    scripture: 'John 8:12 — "I am the light of the world"',
    christConnection: 'Christ is the Light. The Spirit (oil) fuels our witness. We must shine continually.',
    color: '#FFD700',
  },
  {
    id: 'showbread', name: 'Table of Showbread', zone: 'Holy Place',
    action: 'Replace the 12 loaves on Sabbath. Old loaves are eaten by priests in the holy place.',
    scripture: 'John 6:35 — "I am the bread of life"',
    christConnection: 'Christ sustains all 12 tribes. Fresh bread each Sabbath — resurrection morning brings new life.',
    color: '#D4A574',
  },
  {
    id: 'incense', name: 'Altar of Incense', zone: 'Holy Place',
    action: 'Burn the sacred incense compound morning and evening before the veil.',
    scripture: 'Revelation 8:3-4 — "The smoke of the incense, with the prayers of the saints"',
    christConnection: "Christ's intercession makes our prayers a sweet aroma to God.",
    color: '#FFDD88',
  },
  {
    id: 'ark', name: 'Ark of the Covenant', zone: 'Most Holy Place',
    action: 'Only once a year — enter with blood and incense. Sprinkle blood on the mercy seat.',
    scripture: 'Hebrews 9:12 — "By his own blood he entered in once into the holy place"',
    christConnection: 'Christ entered the heavenly Most Holy Place with His own blood — securing eternal redemption.',
    color: '#FFD700',
  },
];

type GameState = 'intro' | 'walking' | 'complete';

interface SanctuaryPriestSimProps {
  onBack: () => void;
}

export default function SanctuaryPriestSim({ onBack }: SanctuaryPriestSimProps) {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [currentStation, setCurrentStation] = useState(0);
  const [showDetail, setShowDetail] = useState(false);

  const station = STATIONS[currentStation];

  const startWalk = useCallback(() => {
    setCurrentStation(0);
    setShowDetail(false);
    setGameState('walking');
  }, []);

  const handlePerformAction = useCallback(() => {
    setShowDetail(true);
  }, []);

  const handleNext = useCallback(() => {
    setShowDetail(false);
    if (currentStation + 1 >= STATIONS.length) {
      setGameState('complete');
    } else {
      setCurrentStation((s) => s + 1);
    }
  }, [currentStation]);

  // Determine which furniture to show
  const furniturePosition: [number, number, number] = [0, -1.2, -5];

  return (
    <group>
      <StarField count={800} radius={40} brightness={0.3} />

      {/* Desert ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#2a2010" roughness={0.85} metalness={0.1} />
      </mesh>

      {/* Sky dome */}
      <mesh>
        <sphereGeometry args={[30, 24, 12]} />
        <meshBasicMaterial color="#1a1520" side={THREE.BackSide} />
      </mesh>

      <ambientLight intensity={0.3} color="#fff5e6" />
      <directionalLight position={[5, 10, 3]} intensity={1} color="#ffe8c4" />
      <fog attach="fog" args={['#1a1520', 10, 30]} />

      {/* ── INTRO ── */}
      {gameState === 'intro' && (
        <Suspense fallback={null}>
          <Text position={[0, 2.5, -4]} fontSize={0.28} color="#FFD700" anchorX="center" outlineWidth={0.01} outlineColor="#000">
            Sanctuary Priest Simulator
          </Text>
          <Text position={[0, 2, -4]} fontSize={0.09} color="#aabbcc" anchorX="center" maxWidth={4}>
            Walk through each station of the tabernacle in order, performing the priestly service and learning the Christ connection.
          </Text>
          <Text position={[0, 1.6, -4]} fontSize={0.07} color="#6688AA" anchorX="center">
            Blue Room (BL) — Floor 5
          </Text>

          <Interactive onSelect={startWalk}>
            <mesh position={[0, 1, -4]} onClick={startWalk} onPointerDown={startWalk}>
              <planeGeometry args={[2.5, 0.5]} />
              <meshStandardMaterial color="#0a0a2e" emissive="#FFD700" emissiveIntensity={0.2} />
            </mesh>
          </Interactive>
          <Text position={[0, 1, -3.98]} fontSize={0.13} color="#FFD700" anchorX="center" anchorY="middle">
            Begin Priestly Walk
          </Text>
        </Suspense>
      )}

      {/* ── WALKING ── */}
      {gameState === 'walking' && station && (
        <Suspense fallback={null}>
          {/* Progress indicator */}
          <Text position={[0, 2.8, -4]} fontSize={0.08} color="#888" anchorX="center">
            Station {currentStation + 1} of {STATIONS.length} — {station.zone}
          </Text>

          {/* Station name */}
          <Text position={[0, 2.5, -4]} fontSize={0.22} color={station.color} anchorX="center" outlineWidth={0.008} outlineColor="#000">
            {station.name}
          </Text>

          {/* Furniture display */}
          {station.id === 'altar' && <AltarOfBurntOffering position={furniturePosition} />}
          {station.id === 'laver' && <BronzeLaver position={furniturePosition} />}
          {station.id === 'lampstand' && <GoldenLampstand position={furniturePosition} />}
          {station.id === 'showbread' && <TableOfShowbread position={furniturePosition} />}
          {station.id === 'incense' && <AltarOfIncense position={furniturePosition} />}
          {station.id === 'ark' && <ArkOfTheCovenant position={furniturePosition} />}

          {/* Gate gets a special curtain display */}
          {station.id === 'gate' && (
            <mesh position={[0, 0.5, -5]}>
              <planeGeometry args={[3, 2]} />
              <meshStandardMaterial color="#FFFFFF" emissive="#4444AA" emissiveIntensity={0.05} transparent opacity={0.7} side={THREE.DoubleSide} />
            </mesh>
          )}

          {/* Action prompt */}
          {!showDetail && (
            <group>
              <Text position={[0, 0.5, -3]} fontSize={0.08} color="#ccddee" anchorX="center" maxWidth={3.5}>
                {station.action}
              </Text>

              <Interactive onSelect={handlePerformAction}>
                <mesh position={[0, -0.1, -3]} onClick={handlePerformAction} onPointerDown={handlePerformAction}>
                  <planeGeometry args={[2, 0.4]} />
                  <meshStandardMaterial color="#0a0a2e" emissive={station.color} emissiveIntensity={0.2} />
                </mesh>
              </Interactive>
              <Text position={[0, -0.1, -2.98]} fontSize={0.1} color={station.color} anchorX="center" anchorY="middle">
                Perform Service
              </Text>
            </group>
          )}

          {/* Detail reveal */}
          {showDetail && (
            <group>
              {/* Scripture */}
              <mesh position={[0, 0.5, -3.01]}>
                <planeGeometry args={[3.5, 1.2]} />
                <meshBasicMaterial color="#000000" transparent opacity={0.6} />
              </mesh>
              <Text position={[0, 0.8, -3]} fontSize={0.08} color={station.color} anchorX="center" maxWidth={3}>
                {station.scripture}
              </Text>
              <Text position={[0, 0.5, -3]} fontSize={0.07} color="#ccddee" anchorX="center" maxWidth={3} lineHeight={1.3}>
                {station.christConnection}
              </Text>

              {/* Next button */}
              <Interactive onSelect={handleNext}>
                <mesh position={[0, 0, -3]} onClick={handleNext} onPointerDown={handleNext}>
                  <planeGeometry args={[2, 0.4]} />
                  <meshStandardMaterial color="#0a0a2e" emissive="#44FF88" emissiveIntensity={0.2} />
                </mesh>
              </Interactive>
              <Text position={[0, 0, -2.98]} fontSize={0.1} color="#44FF88" anchorX="center" anchorY="middle">
                {currentStation + 1 >= STATIONS.length ? 'Complete Walk' : 'Next Station →'}
              </Text>
            </group>
          )}
        </Suspense>
      )}

      {/* ── COMPLETE ── */}
      {gameState === 'complete' && (
        <Suspense fallback={null}>
          <Text position={[0, 2.5, -4]} fontSize={0.28} color="#FFD700" anchorX="center" outlineWidth={0.01} outlineColor="#000">
            Walk Complete!
          </Text>
          <Text position={[0, 2, -4]} fontSize={0.09} color="#ccddee" anchorX="center" maxWidth={4}>
            You have walked the path of the priest — from the gate to the Most Holy Place. Every station points to Christ.
          </Text>
          <Text position={[0, 1.5, -4]} fontSize={0.08} color="#88BBFF" anchorX="center" maxWidth={4}>
            "Having therefore, brethren, boldness to enter into the holiest by the blood of Jesus" — Hebrews 10:19
          </Text>

          <Interactive onSelect={startWalk}>
            <mesh position={[0, 0.8, -4]} onClick={startWalk} onPointerDown={startWalk}>
              <planeGeometry args={[2, 0.5]} />
              <meshStandardMaterial color="#0a0a2e" emissive="#FFD700" emissiveIntensity={0.2} />
            </mesh>
          </Interactive>
          <Text position={[0, 0.8, -3.98]} fontSize={0.12} color="#FFD700" anchorX="center" anchorY="middle">
            Walk Again
          </Text>
        </Suspense>
      )}

      <BackToLobbyButton onBack={onBack} position={[0, -0.5, -1.5]} />
    </group>
  );
}
