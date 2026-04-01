import { useMemo, useRef, useState, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Instances, Instance } from '@react-three/drei';
import { TeleportationPlane, Interactive } from '@react-three/xr';
import * as THREE from 'three';

// Import all bible sets from allBooks
import {
  genesisSet,
  type ChapterFrame,
  type BibleSet,
} from '@/data/bible24fps/allBooks';

// We need to import all sets. Since allBooks.ts exports named sets,
// we'll import them all and collect them.
import * as allBooksData from '@/data/bible24fps/allBooks';

// Book color mapping — simple hash-based coloring per book
const BOOK_COLORS: Record<string, string> = {};
const COLOR_PALETTE = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F0B27A', '#82E0AA', '#F1948A', '#AED6F1', '#D7BDE2',
  '#A3E4D7', '#FAD7A0', '#D5F5E3', '#FADBD8', '#D4E6F1',
];

function getBookColor(book: string): string {
  if (!BOOK_COLORS[book]) {
    let hash = 0;
    for (let i = 0; i < book.length; i++) {
      hash = book.charCodeAt(i) + ((hash << 5) - hash);
    }
    BOOK_COLORS[book] = COLOR_PALETTE[Math.abs(hash) % COLOR_PALETTE.length];
  }
  return BOOK_COLORS[book];
}

// Collect all chapters from all exported BibleSets
function getAllChapters(): ChapterFrame[] {
  const chapters: ChapterFrame[] = [];
  const seen = new Set<string>();

  for (const key of Object.keys(allBooksData)) {
    const value = (allBooksData as Record<string, unknown>)[key];
    if (value && typeof value === 'object' && 'chapters' in value && 'testament' in value) {
      const set = value as BibleSet;
      for (const ch of set.chapters) {
        const id = `${ch.book}-${ch.chapter}`;
        if (!seen.has(id)) {
          seen.add(id);
          chapters.push(ch);
        }
      }
    }
  }
  return chapters;
}

interface FrameLabelProps {
  frame: ChapterFrame;
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
}

function FrameLabel({ frame, position, rotation, color }: FrameLabelProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position} rotation={rotation}>
      {/* Frame border glow */}
      <mesh position={[0, 0, -0.005]}>
        <planeGeometry args={[0.85, 1.05]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 1 : 0.3} transparent opacity={0.8} />
      </mesh>

      {/* Frame background with gradient feel */}
      <Interactive
        onSelect={() => {}}
        onHover={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        <mesh onClick={() => {}}>
          <planeGeometry args={[0.8, 1.0]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
      </Interactive>

      {/* Colored image area (top half) */}
      <mesh position={[0, 0.2, 0.001]}>
        <planeGeometry args={[0.72, 0.5]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.15}
          transparent
          opacity={0.25}
        />
      </mesh>

      {/* Large symbol as visual centerpiece */}
      <Text
        position={[0, 0.22, 0.01]}
        fontSize={0.22}
        anchorX="center"
        anchorY="middle"
        color={color}
      >
        {frame.symbol}
      </Text>

      {/* Color accent bar */}
      <mesh position={[0, -0.08, 0.001]}>
        <planeGeometry args={[0.72, 0.02]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
      </mesh>

      {/* Book + Chapter */}
      <Text
        position={[0, -0.15, 0.01]}
        fontSize={0.06}
        color={color}
        anchorX="center"
        anchorY="middle"
        maxWidth={0.7}
      >
        {frame.book} {frame.chapter}
      </Text>

      {/* Title */}
      <Text
        position={[0, -0.25, 0.01]}
        fontSize={0.05}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.7}
      >
        {frame.title}
      </Text>

      {/* Memory Hook */}
      <Text
        position={[0, -0.37, 0.01]}
        fontSize={0.035}
        color="#aaa"
        anchorX="center"
        anchorY="top"
        maxWidth={0.7}
        lineHeight={1.3}
      >
        {frame.memoryHook}
      </Text>
    </group>
  );
}

interface GalleryCorridorProps {
  onBack: () => void;
}

export default function GalleryCorridor({ onBack }: GalleryCorridorProps) {
  const allChapters = useMemo(() => getAllChapters(), []);

  // Arrange frames on both walls of a long corridor
  // Frame spacing: 1.2m apart along z-axis
  const FRAME_SPACING = 1.2;
  const WALL_OFFSET = 3; // x distance from center to wall
  const CORRIDOR_LENGTH = allChapters.length * FRAME_SPACING / 2;

  return (
    <group>
      {/* Corridor lighting */}
      <ambientLight intensity={0.2} />
      {/* Spot lights every 20 frames */}
      {Array.from({ length: Math.ceil(allChapters.length / 40) }, (_, i) => (
        <pointLight
          key={i}
          position={[0, 3, -i * FRAME_SPACING * 20]}
          intensity={1.5}
          distance={30}
          color="#e8d5b7"
        />
      ))}

      {/* Teleportation plane */}
      <TeleportationPlane leftHand rightHand maxDistance={20} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, -CORRIDOR_LENGTH / 2]} receiveShadow>
        <planeGeometry args={[8, CORRIDOR_LENGTH + 10]} />
        <meshStandardMaterial color="#1a1520" roughness={0.9} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-WALL_OFFSET - 0.5, 1, -CORRIDOR_LENGTH / 2]}>
        <boxGeometry args={[0.1, 5, CORRIDOR_LENGTH + 10]} />
        <meshStandardMaterial color="#2a2040" />
      </mesh>

      {/* Right wall */}
      <mesh position={[WALL_OFFSET + 0.5, 1, -CORRIDOR_LENGTH / 2]}>
        <boxGeometry args={[0.1, 5, CORRIDOR_LENGTH + 10]} />
        <meshStandardMaterial color="#2a2040" />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 3.5, -CORRIDOR_LENGTH / 2]}>
        <boxGeometry args={[8, 0.1, CORRIDOR_LENGTH + 10]} />
        <meshStandardMaterial color="#0a0a15" />
      </mesh>

      {/* Chapter frames on alternating walls */}
      {allChapters.map((frame, i) => {
        const side = i % 2 === 0 ? -1 : 1; // Alternate left/right
        const z = -Math.floor(i / 2) * FRAME_SPACING;
        const x = side * WALL_OFFSET;
        const rotY = side > 0 ? Math.PI / 2 : -Math.PI / 2;
        const color = getBookColor(frame.book);

        return (
          <FrameLabel
            key={`${frame.book}-${frame.chapter}`}
            frame={frame}
            position={[x, 0.5, z]}
            rotation={[0, rotY, 0]}
            color={color}
          />
        );
      })}

      {/* Entrance label */}
      <Text
        position={[0, 2, 2]}
        fontSize={0.25}
        color="#4488FF"
        anchorX="center"
        outlineWidth={0.01}
        outlineColor="#000"
      >
        24FPS Bible Gallery
      </Text>
      <Text
        position={[0, 1.6, 2]}
        fontSize={0.1}
        color="#888"
        anchorX="center"
      >
        Genesis 1 → Revelation 22 — {allChapters.length} chapter frames
      </Text>

      {/* Back button — XR compatible */}
      <Interactive onSelect={onBack}>
        <mesh position={[0, 0.2, 2.5]} onClick={onBack} onPointerDown={onBack}>
          <planeGeometry args={[1.5, 0.3]} />
          <meshBasicMaterial color="#331111" />
        </mesh>
      </Interactive>
      <Suspense fallback={null}>
        <Text position={[0, 0.2, 2.51]} fontSize={0.1} color="#FF6666" anchorX="center">
          ← Back to Lobby
        </Text>
      </Suspense>
    </group>
  );
}
