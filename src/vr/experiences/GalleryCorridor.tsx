import { useMemo, useRef, useState, useEffect, Suspense } from 'react';
import { useFrame, useThree, useLoader } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { TeleportationPlane, Interactive } from '@react-three/xr';
import * as THREE from 'three';
import { BackToLobbyButton } from '../components/BackToLobbyButton';

// Import genesis images
import { genesisImages } from '@/assets/24fps/genesis';

// Import all bible sets from allBooks
import {
  type ChapterFrame,
  type BibleSet,
} from '@/data/bible24fps/allBooks';

import * as allBooksData from '@/data/bible24fps/allBooks';

// Rich color palette for book differentiation
const BOOK_COLORS: Record<string, string> = {};
const COLOR_PALETTE = [
  '#FF4466', '#44DDFF', '#FFD700', '#44FF88', '#FF8844',
  '#BB66FF', '#FF44AA', '#44FFCC', '#FFAA22', '#66AAFF',
  '#FF6688', '#88FF44', '#FF44DD', '#44AAFF', '#FFCC44',
  '#AA44FF', '#FF8866', '#22FFAA', '#FF6644', '#88DDFF',
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

// Build a map of genesis chapter number -> image URL
function getGenesisImageUrl(book: string, chapter: number): string | null {
  if (book !== 'Genesis') return null;
  const idx = chapter - 1;
  if (idx >= 0 && idx < genesisImages.length) {
    return genesisImages[idx];
  }
  return null;
}

// Component that loads and displays an actual image texture
function ImageFrame({ imageUrl, width, height }: { imageUrl: string; width: number; height: number }) {
  const texture = useLoader(THREE.TextureLoader, imageUrl);
  return (
    <mesh position={[0, 0.2, 0.002]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

interface FrameLabelProps {
  frame: ChapterFrame;
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
}

function FrameLabel({ frame, position, rotation, color }: FrameLabelProps) {
  const [hovered, setHovered] = useState(false);
  const imageUrl = getGenesisImageUrl(frame.book, frame.chapter);

  return (
    <group position={position} rotation={rotation}>
      {/* Ornate frame border with gold trim */}
      <mesh position={[0, 0, -0.008]}>
        <planeGeometry args={[0.9, 1.1]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={hovered ? 0.4 : 0.15}
          metalness={0.85}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Frame inner border */}
      <mesh position={[0, 0, -0.006]}>
        <planeGeometry args={[0.86, 1.06]} />
        <meshStandardMaterial color="#1a1520" metalness={0.3} roughness={0.5} />
      </mesh>

      {/* Frame background */}
      <Interactive
        onSelect={() => {}}
        onHover={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        <mesh onClick={() => {}} onPointerDown={() => {}}>
          <planeGeometry args={[0.82, 1.02]} />
          <meshStandardMaterial
            color="#0a0a18"
            emissive={color}
            emissiveIntensity={hovered ? 0.08 : 0.03}
          />
        </mesh>
      </Interactive>

      {/* Actual image if available, otherwise colored placeholder with symbol */}
      {imageUrl ? (
        <Suspense fallback={
          <mesh position={[0, 0.2, 0.001]}>
            <planeGeometry args={[0.74, 0.52]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.12} transparent opacity={0.35} />
          </mesh>
        }>
          <ImageFrame imageUrl={imageUrl} width={0.74} height={0.52} />
        </Suspense>
      ) : (
        <>
          {/* Colored image area (fallback for non-Genesis) */}
          <mesh position={[0, 0.2, 0.001]}>
            <planeGeometry args={[0.74, 0.52]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={hovered ? 0.3 : 0.12}
              transparent
              opacity={0.35}
            />
          </mesh>
          {/* Large symbol as visual centerpiece */}
          <Text position={[0, 0.22, 0.01]} fontSize={0.24} anchorX="center" anchorY="middle" color={color}>
            {frame.symbol}
          </Text>
        </>
      )}

      {/* Color accent bar */}
      <mesh position={[0, -0.08, 0.001]}>
        <planeGeometry args={[0.74, 0.025]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} />
      </mesh>

      {/* Book + Chapter */}
      <Text position={[0, -0.15, 0.01]} fontSize={0.065} color={color} anchorX="center" anchorY="middle" maxWidth={0.72}>
        {frame.book} {frame.chapter}
      </Text>

      {/* Title */}
      <Text position={[0, -0.25, 0.01]} fontSize={0.05} color="#eeeeff" anchorX="center" anchorY="middle" maxWidth={0.72}>
        {frame.title}
      </Text>

      {/* Memory Hook */}
      <Text position={[0, -0.37, 0.01]} fontSize={0.055} color="#aaaacc" anchorX="center" anchorY="top" maxWidth={0.72} lineHeight={1.3}>
        {frame.memoryHook}
      </Text>
    </group>
  );
}

// Keyboard + mouse navigation controller
function WalkController() {
  const { camera, gl } = useThree();
  const keysRef = useRef<Set<string>>(new Set());
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const yaw = useRef(0);
  const pitch = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => keysRef.current.add(e.key.toLowerCase());
    const handleKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.key.toLowerCase());

    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseUp = () => { isDragging.current = false; };
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      yaw.current -= dx * 0.003;
      pitch.current -= dy * 0.003;
      pitch.current = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, pitch.current));
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    const canvas = gl.domElement;
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gl]);

  useFrame((_, delta) => {
    const speed = 4 * delta;
    const keys = keysRef.current;

    // Build direction from yaw
    const forward = new THREE.Vector3(-Math.sin(yaw.current), 0, -Math.cos(yaw.current));
    const right = new THREE.Vector3(Math.cos(yaw.current), 0, -Math.sin(yaw.current));

    if (keys.has('w') || keys.has('arrowup')) camera.position.addScaledVector(forward, speed);
    if (keys.has('s') || keys.has('arrowdown')) camera.position.addScaledVector(forward, -speed);
    if (keys.has('a') || keys.has('arrowleft')) camera.position.addScaledVector(right, -speed);
    if (keys.has('d') || keys.has('arrowright')) camera.position.addScaledVector(right, speed);

    // Clamp position within corridor
    camera.position.x = Math.max(-2.5, Math.min(2.5, camera.position.x));
    camera.position.y = 0;

    // Apply rotation from mouse drag
    const euler = new THREE.Euler(pitch.current, yaw.current, 0, 'YXZ');
    camera.quaternion.setFromEuler(euler);
  });

  return null;
}

interface GalleryCorridorProps {
  onBack: () => void;
}

export default function GalleryCorridor({ onBack }: GalleryCorridorProps) {
  const allChapters = useMemo(() => getAllChapters(), []);
  const { camera } = useThree();
  const frameCounterRef = useRef(0);
  const [visibleRange, setVisibleRange] = useState({ startIdx: 0, endIdx: 100 });

  const FRAME_SPACING = 1.2;
  const WALL_OFFSET = 3;
  const CORRIDOR_LENGTH = allChapters.length * FRAME_SPACING / 2;
  const CULL_DISTANCE = 30;

  // Frustum culling: update visible range every 10 frames
  useFrame(() => {
    frameCounterRef.current++;
    if (frameCounterRef.current % 10 !== 0) return;

    const camZ = camera.position.z;
    let startIdx = Infinity;
    let endIdx = -1;

    for (let i = 0; i < allChapters.length; i++) {
      const z = -Math.floor(i / 2) * FRAME_SPACING;
      if (Math.abs(z - camZ) < CULL_DISTANCE) {
        if (i < startIdx) startIdx = i;
        if (i > endIdx) endIdx = i;
      }
    }

    if (startIdx === Infinity) { startIdx = 0; endIdx = 50; }
    startIdx = Math.max(0, startIdx - 4);
    endIdx = Math.min(allChapters.length - 1, endIdx + 4);

    setVisibleRange((prev) => {
      if (prev.startIdx === startIdx && prev.endIdx === endIdx) return prev;
      return { startIdx, endIdx };
    });
  });

  const visibleChapters = useMemo(() => {
    return allChapters.slice(visibleRange.startIdx, visibleRange.endIdx + 1).map((frame, sliceIdx) => ({
      frame,
      originalIdx: visibleRange.startIdx + sliceIdx,
    }));
  }, [allChapters, visibleRange]);

  const visibleLightIndices = useMemo(() => {
    const indices: number[] = [];
    const totalLights = Math.ceil(allChapters.length / 40);
    for (let i = 0; i < totalLights; i++) {
      const lightZ = -i * FRAME_SPACING * 20;
      if (Math.abs(lightZ - (visibleRange.startIdx > 0 ? -Math.floor(visibleRange.startIdx / 2) * FRAME_SPACING : 0)) < CULL_DISTANCE + 20) {
        indices.push(i);
      }
    }
    return indices;
  }, [allChapters.length, visibleRange.startIdx]);

  return (
    <group>
      {/* Keyboard + mouse walk controller */}
      <WalkController />

      {/* Rich ambient lighting */}
      <ambientLight intensity={0.4} color="#e8d0ff" />

      {/* Spot lights — only render visible ones */}
      {visibleLightIndices.map((i) => (
        <group key={i}>
          <pointLight
            position={[0, 3, -i * FRAME_SPACING * 20]}
            intensity={1.8}
            distance={35}
            color="#FFD088"
          />
          <pointLight
            position={[i % 2 === 0 ? -2.5 : 2.5, 2, -i * FRAME_SPACING * 20]}
            intensity={0.4}
            distance={15}
            color={i % 3 === 0 ? '#6666FF' : i % 3 === 1 ? '#FF6666' : '#66FF66'}
          />
        </group>
      ))}

      {/* Fog for atmospheric depth */}
      <fog attach="fog" args={['#0a0a18', 8, 40]} />

      {/* Teleportation plane for VR controllers */}
      <TeleportationPlane leftHand rightHand maxDistance={20} />

      {/* Rich marble floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, -CORRIDOR_LENGTH / 2]} receiveShadow>
        <planeGeometry args={[8, CORRIDOR_LENGTH + 10]} />
        <meshStandardMaterial color="#1a1520" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* Floor runner (decorative center strip) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.19, -CORRIDOR_LENGTH / 2]}>
        <planeGeometry args={[2, CORRIDOR_LENGTH + 10]} />
        <meshStandardMaterial color="#2a1830" emissive="#4400AA" emissiveIntensity={0.03} metalness={0.3} roughness={0.6} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-WALL_OFFSET - 0.5, 1, -CORRIDOR_LENGTH / 2]}>
        <boxGeometry args={[0.15, 5, CORRIDOR_LENGTH + 10]} />
        <meshStandardMaterial color="#2a1840" roughness={0.7} />
      </mesh>

      {/* Right wall */}
      <mesh position={[WALL_OFFSET + 0.5, 1, -CORRIDOR_LENGTH / 2]}>
        <boxGeometry args={[0.15, 5, CORRIDOR_LENGTH + 10]} />
        <meshStandardMaterial color="#2a1840" roughness={0.7} />
      </mesh>

      {/* Gold trim along walls */}
      <mesh position={[-WALL_OFFSET - 0.44, 2.8, -CORRIDOR_LENGTH / 2]}>
        <boxGeometry args={[0.03, 0.06, CORRIDOR_LENGTH + 10]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.2} metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[WALL_OFFSET + 0.44, 2.8, -CORRIDOR_LENGTH / 2]}>
        <boxGeometry args={[0.03, 0.06, CORRIDOR_LENGTH + 10]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.2} metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Vaulted ceiling */}
      <mesh position={[0, 3.8, -CORRIDOR_LENGTH / 2]}>
        <boxGeometry args={[8.2, 0.15, CORRIDOR_LENGTH + 10]} />
        <meshStandardMaterial color="#0a0a15" roughness={0.9} />
      </mesh>

      {/* Chapter frames — only visible range rendered */}
      {visibleChapters.map(({ frame, originalIdx }) => {
        const side = originalIdx % 2 === 0 ? -1 : 1;
        const z = -Math.floor(originalIdx / 2) * FRAME_SPACING;
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
      <Suspense fallback={null}>
        <Text position={[0, 2, 2]} fontSize={0.28} color="#44AAFF" anchorX="center" outlineWidth={0.012} outlineColor="#000">
          24FPS Bible Gallery
        </Text>
        <Text position={[0, 1.6, 2]} fontSize={0.1} color="#AAAACC" anchorX="center">
          Genesis 1 → Revelation 22 — {allChapters.length} chapter frames
        </Text>
        <Text position={[0, 1.2, 2]} fontSize={0.08} color="#88AACC" anchorX="center">
          WASD or Arrow Keys to walk • Click + Drag to look around
        </Text>
      </Suspense>

      {/* Back button */}
      <BackToLobbyButton onBack={onBack} />
    </group>
  );
}
