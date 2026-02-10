import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, Stars, Sparkles, Float } from "@react-three/drei";
import * as THREE from "three";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Trophy, Timer, Flame, HelpCircle, Star, Zap, RotateCcw, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { GameLeaderboard } from "@/components/GameLeaderboard";

// ============ DATA ============

type Difficulty = "easy" | "medium" | "hard" | "expert";

interface DifficultySettings {
  name: string;
  maxScenes: number;
  timeLimit: number | null;
  hintsAllowed: number;
  pointsMultiplier: number;
}

const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultySettings> = {
  easy: { name: "Easy", maxScenes: 4, timeLimit: null, hintsAllowed: 3, pointsMultiplier: 1 },
  medium: { name: "Medium", maxScenes: 5, timeLimit: 120, hintsAllowed: 2, pointsMultiplier: 1.5 },
  hard: { name: "Hard", maxScenes: 6, timeLimit: 60, hintsAllowed: 1, pointsMultiplier: 2 },
  expert: { name: "Expert", maxScenes: 8, timeLimit: 45, hintsAllowed: 0, pointsMultiplier: 3 },
};

interface StoryQuiz {
  story: string;
  sequence: string[];
  correct: string[];
  book: string;
  characters?: string[];
}

// Subset of stories for 3D version
const storyQuizzes: StoryQuiz[] = [
  {
    story: "Joseph's Journey",
    sequence: ["Coat of Many Colors", "Thrown in Pit", "Sold to Caravan", "Prison", "Pharaoh's Palace"],
    correct: ["Coat of Many Colors", "Thrown in Pit", "Sold to Caravan", "Prison", "Pharaoh's Palace"],
    book: "Genesis 37-50",
  },
  {
    story: "David and Goliath",
    sequence: ["Sling in Motion", "Stone in Flight", "Giant Falling", "Sword Raised"],
    correct: ["Sling in Motion", "Stone in Flight", "Giant Falling", "Sword Raised"],
    book: "1 Samuel 17",
  },
  {
    story: "Daniel's Trial",
    sequence: ["Refuses King's Table", "Fiery Furnace", "Lions' Den", "Vision of Beasts"],
    correct: ["Refuses King's Table", "Fiery Furnace", "Lions' Den", "Vision of Beasts"],
    book: "Daniel 1-7",
  },
  {
    story: "Exodus Journey",
    sequence: ["Burning Bush", "Ten Plagues", "Red Sea Crossing", "Mount Sinai", "Golden Calf", "Tabernacle Built"],
    correct: ["Burning Bush", "Ten Plagues", "Red Sea Crossing", "Mount Sinai", "Golden Calf", "Tabernacle Built"],
    book: "Exodus 3-40",
  },
  {
    story: "Christ's Passion",
    sequence: ["Last Supper", "Gethsemane", "Trial", "Crucifixion", "Burial", "Resurrection"],
    correct: ["Last Supper", "Gethsemane", "Trial", "Crucifixion", "Burial", "Resurrection"],
    book: "Matthew 26-28",
  },
  {
    story: "Noah's Flood",
    sequence: ["Ark Construction", "Animals Enter", "Rain Begins", "Flood Covers Earth", "Dove Returns with Olive", "Rainbow Covenant"],
    correct: ["Ark Construction", "Animals Enter", "Rain Begins", "Flood Covers Earth", "Dove Returns with Olive", "Rainbow Covenant"],
    book: "Genesis 6-9",
  },
  {
    story: "Creation Week",
    sequence: ["Light Created", "Firmament Divides Waters", "Dry Land and Plants", "Sun Moon and Stars", "Fish and Birds", "Animals and Man"],
    correct: ["Light Created", "Firmament Divides Waters", "Dry Land and Plants", "Sun Moon and Stars", "Fish and Birds", "Animals and Man"],
    book: "Genesis 1-2",
  },
  {
    story: "Jonah and the Great Fish",
    sequence: ["Called to Go to Nineveh", "Flees on Ship", "Storm Threatens Ship", "Thrown Overboard", "Swallowed by Fish", "Vomited onto Land"],
    correct: ["Called to Go to Nineveh", "Flees on Ship", "Storm Threatens Ship", "Thrown Overboard", "Swallowed by Fish", "Vomited onto Land"],
    book: "Jonah 1-2",
  },
  {
    story: "Prodigal Son",
    sequence: ["Asks for Inheritance", "Squanders Wealth", "Famine Comes", "Feeds Pigs", "Returns Home", "Father's Feast"],
    correct: ["Asks for Inheritance", "Squanders Wealth", "Famine Comes", "Feeds Pigs", "Returns Home", "Father's Feast"],
    book: "Luke 15:11-32",
  },
  {
    story: "Raising of Lazarus",
    sequence: ["Lazarus Falls Sick", "Jesus Delays", "Lazarus Dies", "Jesus Weeps", "Stone Rolled Away", "Lazarus Comes Out"],
    correct: ["Lazarus Falls Sick", "Jesus Delays", "Lazarus Dies", "Jesus Weeps", "Stone Rolled Away", "Lazarus Comes Out"],
    book: "John 11:1-44",
  },
];

// ============ 3D COMPONENTS ============

function CameraController({ cameraTarget }: { cameraTarget: [number, number, number] }) {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3(...cameraTarget));

  useEffect(() => {
    targetRef.current.set(...cameraTarget);
  }, [cameraTarget]);

  useFrame(() => {
    camera.position.lerp(targetRef.current, 0.02);
    camera.lookAt(0, 2, 0);
  });

  return null;
}

// Animated torch flame
function TorchFlame({ position }: { position: [number, number, number] }) {
  const flameRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (flameRef.current) {
      flameRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 8 + position[0]) * 0.2;
      flameRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 6 + position[1]) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Torch holder */}
      <mesh>
        <cylinderGeometry args={[0.08, 0.12, 0.6]} />
        <meshStandardMaterial color="#4a3020" roughness={0.8} metalness={0.3} />
      </mesh>
      {/* Torch bowl */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.15, 0.1, 0.15]} />
        <meshStandardMaterial color="#2a1a10" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Flame glow */}
      <group ref={flameRef} position={[0, 0.5, 0]}>
        <mesh>
          <coneGeometry args={[0.08, 0.3, 8]} />
          <meshBasicMaterial color="#ff6600" transparent opacity={0.9} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <coneGeometry args={[0.05, 0.2, 8]} />
          <meshBasicMaterial color="#ffcc00" transparent opacity={0.8} />
        </mesh>
      </group>
      <pointLight position={[0, 0.5, 0]} intensity={0.8} distance={10} color="#ff9944" />
      <Sparkles count={10} scale={[0.5, 1, 0.5]} size={1} speed={2} color="#ff6600" position={[0, 0.6, 0]} />
    </group>
  );
}

// Library environment - Enhanced with more detail
function LibraryEnvironment() {
  const bookColors = ["#8B4513", "#A0522D", "#6B4423", "#8B0000", "#2F4F4F", "#4B0082", "#654321", "#800000", "#3D2817"];

  return (
    <group>
      {/* Floor - rich wooden texture */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color="#3d2817" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Floor rug in center */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 2]} receiveShadow>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial color="#5c2e0f" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 2]} receiveShadow>
        <planeGeometry args={[9, 5]} />
        <meshStandardMaterial color="#8b4513" roughness={0.9} />
      </mesh>

      {/* Back Wall with wainscoting */}
      <mesh position={[0, 5, -10]} receiveShadow>
        <planeGeometry args={[24, 10]} />
        <meshStandardMaterial color="#3d2a1e" roughness={0.8} />
      </mesh>
      {/* Wainscoting panels */}
      {[-8, -4, 0, 4, 8].map((x, i) => (
        <mesh key={i} position={[x, 2, -9.9]}>
          <boxGeometry args={[3.5, 3.5, 0.1]} />
          <meshStandardMaterial color="#5c4033" roughness={0.7} />
        </mesh>
      ))}

      {/* Side Walls */}
      <mesh position={[-12, 5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color="#3d2a1e" roughness={0.8} />
      </mesh>
      <mesh position={[12, 5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color="#3d2a1e" roughness={0.8} />
      </mesh>

      {/* Ceiling with exposed beams */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 10, 0]}>
        <planeGeometry args={[24, 20]} />
        <meshStandardMaterial color="#2a1f14" />
      </mesh>
      {/* Ceiling beams */}
      {[-8, 0, 8].map((x, i) => (
        <mesh key={i} position={[x, 9.7, 0]}>
          <boxGeometry args={[0.5, 0.6, 20]} />
          <meshStandardMaterial color="#3d2817" roughness={0.7} />
        </mesh>
      ))}

      {/* BACK WALL BOOKSHELVES - Full wall coverage */}
      {[-9, -6, -3, 0, 3, 6, 9].map((x, i) => (
        <group key={`back-${i}`} position={[x, 4.5, -9.5]}>
          {/* Bookshelf frame */}
          <mesh castShadow>
            <boxGeometry args={[2.8, 8, 1]} />
            <meshStandardMaterial color="#4a3020" roughness={0.7} />
          </mesh>
          {/* Shelf dividers */}
          {[0, 1, 2, 3, 4].map((shelf) => (
            <mesh key={shelf} position={[0, shelf * 1.5 - 3, 0.1]}>
              <boxGeometry args={[2.6, 0.12, 0.9]} />
              <meshStandardMaterial color="#3d2817" />
            </mesh>
          ))}
          {/* Books on each shelf - properly spaced */}
          {[0, 1, 2, 3, 4].map((shelf) => (
            <group key={shelf} position={[0, shelf * 1.5 - 2.3, 0.2]}>
              {[-1.05, -0.7, -0.35, 0, 0.35, 0.7, 1.05].map((bx, bi) => (
                <mesh key={bi} position={[bx, 0, 0]} rotation={[0, 0, (bi % 3 - 1) * 0.03]}>
                  <boxGeometry args={[0.28, 0.85 + (bi % 3) * 0.15, 0.4]} />
                  <meshStandardMaterial color={bookColors[(i + bi + shelf) % bookColors.length]} roughness={0.8} />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      ))}

      {/* SIDE WALL BOOKSHELVES - Left */}
      {[-6, -2, 2, 6].map((z, i) => (
        <group key={`left-${i}`} position={[-11.5, 4, z]} rotation={[0, Math.PI / 2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[2.5, 7, 0.8]} />
            <meshStandardMaterial color="#4a3020" roughness={0.7} />
          </mesh>
          {[0, 1, 2, 3].map((shelf) => (
            <group key={shelf} position={[0, shelf * 1.5 - 2, 0.2]}>
              {[-0.9, -0.45, 0, 0.45, 0.9].map((bx, bi) => (
                <mesh key={bi} position={[bx, 0, 0]} rotation={[0, 0, (bi % 2 - 0.5) * 0.02]}>
                  <boxGeometry args={[0.35, 0.75 + (bi % 2) * 0.2, 0.38]} />
                  <meshStandardMaterial color={bookColors[(i + bi + shelf + 3) % bookColors.length]} />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      ))}

      {/* SIDE WALL BOOKSHELVES - Right */}
      {[-6, -2, 2, 6].map((z, i) => (
        <group key={`right-${i}`} position={[11.5, 4, z]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[2.5, 7, 0.8]} />
            <meshStandardMaterial color="#4a3020" roughness={0.7} />
          </mesh>
          {[0, 1, 2, 3].map((shelf) => (
            <group key={shelf} position={[0, shelf * 1.5 - 2, 0.2]}>
              {[-0.9, -0.45, 0, 0.45, 0.9].map((bx, bi) => (
                <mesh key={bi} position={[bx, 0, 0]} rotation={[0, 0, (bi % 2 - 0.5) * 0.02]}>
                  <boxGeometry args={[0.35, 0.75 + (bi % 2) * 0.2, 0.38]} />
                  <meshStandardMaterial color={bookColors[(i + bi + shelf + 5) % bookColors.length]} />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      ))}

      {/* Stage Platform - More elaborate */}
      <mesh position={[0, 0.15, -5]} receiveShadow castShadow>
        <boxGeometry args={[16, 0.4, 8]} />
        <meshStandardMaterial color="#5c4033" roughness={0.6} />
      </mesh>
      {/* Stage edge trim */}
      <mesh position={[0, 0.35, -1.05]}>
        <boxGeometry args={[16, 0.15, 0.2]} />
        <meshStandardMaterial color="#8B7355" metalness={0.3} />
      </mesh>

      {/* Reading tables on sides */}
      {[[-7, 0.6, 4], [7, 0.6, 4]].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          {/* Table top */}
          <mesh castShadow>
            <boxGeometry args={[2.2, 0.15, 1.4]} />
            <meshStandardMaterial color="#5c4033" roughness={0.6} />
          </mesh>
          {/* Table legs - thicker and sturdier */}
          {[[-0.9, -0.4, 0.5], [0.9, -0.4, 0.5], [-0.9, -0.4, -0.5], [0.9, -0.4, -0.5]].map((legPos, li) => (
            <mesh key={li} position={legPos as [number, number, number]}>
              <boxGeometry args={[0.15, 0.7, 0.15]} />
              <meshStandardMaterial color="#4a3020" />
            </mesh>
          ))}
          {/* Books on table - stacked */}
          <mesh position={[0.3, 0.18, 0]}>
            <boxGeometry args={[0.5, 0.12, 0.35]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          <mesh position={[0.25, 0.32, 0.05]} rotation={[0, 0.1, 0]}>
            <boxGeometry args={[0.45, 0.1, 0.32]} />
            <meshStandardMaterial color="#654321" />
          </mesh>
        </group>
      ))}

      {/* Wall torches - more of them */}
      {[
        [-11, 5, -6], [-11, 5, 0], [-11, 5, 6],
        [11, 5, -6], [11, 5, 0], [11, 5, 6],
        [-6, 6, -9.5], [0, 6, -9.5], [6, 6, -9.5]
      ].map((pos, i) => (
        <TorchFlame key={i} position={pos as [number, number, number]} />
      ))}

      {/* Grand Chandelier */}
      <group position={[0, 8.5, 0]}>
        {/* Chain - thicker and more substantial */}
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 1.5]} />
          <meshStandardMaterial color="#8B7355" metalness={0.7} />
        </mesh>
        {/* Chain mount at ceiling */}
        <mesh position={[0, 1.55, 0]}>
          <cylinderGeometry args={[0.2, 0.18, 0.15]} />
          <meshStandardMaterial color="#8B7355" metalness={0.6} />
        </mesh>
        {/* Main ring - thicker tube */}
        <mesh>
          <torusGeometry args={[1.5, 0.18, 16, 32]} />
          <meshStandardMaterial color="#8B7355" metalness={0.6} roughness={0.4} />
        </mesh>
        {/* Inner decorative ring */}
        <mesh position={[0, 0.1, 0]}>
          <torusGeometry args={[1.2, 0.08, 16, 32]} />
          <meshStandardMaterial color="#a08050" metalness={0.5} roughness={0.5} />
        </mesh>
        {/* Candle holders - thicker and sturdier */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <group key={i} position={[Math.cos(angle) * 1.5, -0.2, Math.sin(angle) * 1.5]}>
              {/* Candle cup */}
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.1, 0.08, 0.1]} />
                <meshStandardMaterial color="#8B7355" metalness={0.6} />
              </mesh>
              {/* Candle */}
              <mesh position={[0, 0.12, 0]}>
                <cylinderGeometry args={[0.06, 0.07, 0.2]} />
                <meshStandardMaterial color="#f5f5dc" />
              </mesh>
              <pointLight position={[0, 0.3, 0]} intensity={0.3} distance={6} color="#ffcc88" />
            </group>
          );
        })}
      </group>

      {/* Ambient dust particles */}
      <Sparkles count={100} scale={[20, 10, 20]} size={0.5} speed={0.2} color="#ffd700" opacity={0.3} />

      {/* Central warm light */}
      <pointLight position={[0, 7, 0]} intensity={0.5} color="#ffcc88" distance={15} />
      <ambientLight intensity={0.1} color="#ffe4c4" />
    </group>
  );
}

// Scene Tablet - clickable 3D tablet showing a scene
interface SceneTabletProps {
  text: string;
  position: [number, number, number];
  isSelected: boolean;
  isPlaced: boolean;
  orderNumber?: number;
  onClick: () => void;
}

function SceneTablet({ text, position, isSelected, isPlaced, orderNumber, onClick }: SceneTabletProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      // Floating animation on the group
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.1;
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.03;
    }
    if (meshRef.current) {
      // Scale on hover
      const targetScale = hovered ? 1.15 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
    }
    // Pulsing glow
    if (glowRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      glowRef.current.scale.set(pulse, pulse, 1);
    }
  });

  const color = isPlaced ? "#2d5a27" : isSelected ? "#c9a227" : hovered ? "#c9a227" : "#5a4a38";
  const glowColor = isPlaced ? "#00ff88" : "#ffd700";

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef} position={[position[0], position[1], position[2]]}>
        {/* Outer glow ring */}
        {(hovered || isPlaced) && (
          <mesh ref={glowRef} position={[0, 0, -0.1]}>
            <ringGeometry args={[1.5, 1.8, 32]} />
            <meshBasicMaterial color={glowColor} transparent opacity={0.5} side={THREE.DoubleSide} />
          </mesh>
        )}

        {/* Magical sparkles around tablet */}
        {hovered && (
          <Sparkles count={20} scale={[3, 2, 1]} size={2} speed={0.5} color="#ffd700" />
        )}

        {/* Clickable mesh - larger and more prominent */}
        <mesh
          ref={meshRef}
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
          onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
          castShadow
        >
          <boxGeometry args={[2.8, 1.8, 0.4]} />
          <meshStandardMaterial
            color={color}
            roughness={0.4}
            metalness={hovered ? 0.3 : 0.1}
            emissive={hovered ? "#c9a227" : "#000000"}
            emissiveIntensity={hovered ? 0.3 : 0}
          />
        </mesh>

        {/* Decorative border */}
        <mesh position={[0, 0, 0.21]}>
          <boxGeometry args={[2.9, 1.9, 0.02]} />
          <meshStandardMaterial color={hovered ? "#ffd700" : "#8B7355"} metalness={0.5} />
        </mesh>

        {/* Text on tablet */}
        <Html
          position={[0, 0, 0.25]}
          center
          distanceFactor={8}
          occlude={false}
          zIndexRange={[100, 100]}
        >
          <div
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            style={{
              background: hovered
                ? 'linear-gradient(135deg, rgba(201, 162, 39, 0.95), rgba(139, 90, 43, 0.95))'
                : 'linear-gradient(135deg, rgba(30,20,10,0.95), rgba(50,35,20,0.95))',
              color: 'white',
              padding: '14px 24px',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              maxWidth: '220px',
              textAlign: 'center',
              cursor: 'pointer',
              pointerEvents: 'auto',
              transition: 'all 0.3s ease',
              border: hovered ? '3px solid #ffd700' : '2px solid rgba(201,162,39,0.5)',
              boxShadow: hovered ? '0 0 25px rgba(255,215,0,0.6)' : '0 4px 15px rgba(0,0,0,0.5)',
              transform: hovered ? 'scale(1.05)' : 'scale(1)',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            {orderNumber !== undefined && (
              <span style={{ color: '#ffd700', marginRight: '8px', fontSize: '18px' }}>
                {orderNumber}.
              </span>
            )}
            {text}
          </div>
        </Html>

        {/* Enhanced glow effect for selected/placed */}
        {(isSelected || isPlaced) && (
          <>
            <pointLight position={[0, 0, 1]} intensity={0.8} distance={5} color={glowColor} />
            <pointLight position={[0, 0, -0.5]} intensity={0.3} distance={3} color={glowColor} />
          </>
        )}

        {/* Always-on subtle light */}
        <pointLight position={[0, 0, 0.5]} intensity={hovered ? 0.5 : 0.15} distance={4} color="#ffd700" />
      </group>
    </Float>
  );
}

// Answer Slot - where arranged tablets go
interface AnswerSlotProps {
  index: number;
  position: [number, number, number];
  scene: string | null;
  onRemove: () => void;
}

function AnswerSlot({ index, position, scene, onRemove }: AnswerSlotProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      {/* Slot base */}
      <mesh receiveShadow>
        <boxGeometry args={[2.8, 0.1, 1.2]} />
        <meshStandardMaterial
          color={scene ? "#3d6b35" : "#2a2a2a"}
          roughness={0.8}
        />
      </mesh>

      {/* Number marker */}
      <Html position={[-1.2, 0.2, 0]} center distanceFactor={10} style={{ pointerEvents: 'none' }}>
        <div
          style={{
            background: '#c9a227',
            color: 'black',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '14px',
            pointerEvents: 'none',
          }}
        >
          {index + 1}
        </div>
      </Html>

      {/* Scene text if filled - clickable to remove */}
      {scene && (
        <group>
          <mesh
            position={[0, 0.5, 0]}
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
            onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
          >
            <boxGeometry args={[2.4, 0.8, 0.2]} />
            <meshStandardMaterial color={hovered ? "#5a9a52" : "#3d6b35"} />
          </mesh>
          <Html
            position={[0, 0.5, 0.15]}
            center
            distanceFactor={10}
            occlude={false}
            zIndexRange={[0, 0]}
            style={{ pointerEvents: 'none' }}
          >
            <div
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              style={{
                background: hovered ? 'rgba(255,100,100,0.9)' : 'rgba(0,0,0,0.8)',
                color: 'white',
                padding: '6px 14px',
                borderRadius: '4px',
                fontSize: '12px',
                maxWidth: '180px',
                textAlign: 'center',
                cursor: 'pointer',
                pointerEvents: 'auto',
                transition: 'all 0.2s ease',
                border: hovered ? '2px solid #ff6666' : '2px solid transparent',
              }}
            >
              {scene}
              {hovered && <span style={{ marginLeft: '8px', fontSize: '10px' }}>✕</span>}
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}

// Story title pedestal
function StoryPedestal({ title, book }: { title: string; book: string }) {
  return (
    <group position={[0, 2, -6]}>
      {/* Pedestal */}
      <mesh position={[0, -1, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.7, 2, 8]} />
        <meshStandardMaterial color="#5c4033" roughness={0.6} />
      </mesh>

      {/* Book stand */}
      <mesh position={[0, 0.3, 0]} rotation={[-0.3, 0, 0]} castShadow>
        <boxGeometry args={[1.5, 0.1, 1]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Title display */}
      <Html position={[0, 1.5, 0]} center distanceFactor={8}>
        <div
          style={{
            background: 'linear-gradient(135deg, #c9a227, #8B4513)',
            color: 'white',
            padding: '16px 32px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{title}</div>
          <div style={{ fontSize: '14px', opacity: 0.9, marginTop: '4px' }}>{book}</div>
        </div>
      </Html>
    </group>
  );
}

// ============ MAIN COMPONENT ============

export default function StoryRoom3D() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();

  // Game state
  const [gameState, setGameState] = useState<"menu" | "playing" | "complete">("menu");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [availableQuizzes, setAvailableQuizzes] = useState<StoryQuiz[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<StoryQuiz | null>(null);

  // Sequence game state
  const [availableScenes, setAvailableScenes] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);

  // Scoring
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintsRemaining, setHintsRemaining] = useState(2);

  // Timer
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);

  // UI
  const [feedback, setFeedback] = useState<string>("");
  const [showHint, setShowHint] = useState(false);

  // Camera position based on game state
  const cameraTarget: [number, number, number] = gameState === "menu" ? [0, 5, 12] : [0, 4, 8];

  // Shuffle helper
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Start game
  const startGame = useCallback(() => {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    const shuffled = shuffleArray([...storyQuizzes]);
    const sessionQuizzes = shuffled.slice(0, 10);

    setAvailableQuizzes(sessionQuizzes);
    setCurrentQuizIndex(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setCorrectAnswers(0);
    setTotalAttempts(0);
    setHintsUsed(0);
    setHintsRemaining(settings.hintsAllowed);
    setGameState("playing");

    if (sessionQuizzes.length > 0) {
      setupChallenge(sessionQuizzes[0], settings);
    }
  }, [difficulty]);

  // Setup challenge
  const setupChallenge = useCallback((quiz: StoryQuiz, settings: DifficultySettings) => {
    setCurrentQuiz(quiz);
    setFeedback("");
    setShowHint(false);

    const limitedSequence = quiz.sequence.slice(0, settings.maxScenes);
    setAvailableScenes(shuffleArray(limitedSequence));
    setUserSequence([]);

    if (settings.timeLimit) {
      setTimeRemaining(settings.timeLimit);
      setTimerActive(true);
    } else {
      setTimeRemaining(null);
      setTimerActive(false);
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (!timerActive || timeRemaining === null) return;

    if (timeRemaining <= 0) {
      setTimerActive(false);
      setFeedback(t('games.common.timeUp'));
      toast({
        title: t('games.common.timeUp'),
        description: t('games.storyRoom3d.movingToNext'),
        variant: "destructive",
      });
      setTimeout(() => moveToNextQuiz(), 2000);
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => prev !== null ? prev - 1 : null);
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive, timeRemaining]);

  // Handle scene click
  const handleSceneClick = (scene: string) => {
    if (userSequence.includes(scene)) return;
    setUserSequence([...userSequence, scene]);
    setAvailableScenes(availableScenes.filter(s => s !== scene));
  };

  // Handle remove from sequence
  const handleRemoveScene = (index: number) => {
    const scene = userSequence[index];
    setAvailableScenes([...availableScenes, scene]);
    setUserSequence(userSequence.filter((_, i) => i !== index));
  };

  // Use hint
  const useHint = () => {
    if (hintsRemaining <= 0 || !currentQuiz) return;
    setHintsRemaining(prev => prev - 1);
    setHintsUsed(prev => prev + 1);
    setShowHint(true);
    toast({
      title: t('games.common.hintUsed'),
      description: t('games.storyRoom3d.storyStartsWith', { scene: currentQuiz.correct[0] }),
    });
  };

  // Check answer
  const checkAnswer = () => {
    if (!currentQuiz) return;

    setTotalAttempts(prev => prev + 1);
    setTimerActive(false);

    const settings = DIFFICULTY_SETTINGS[difficulty];
    const limitedCorrect = currentQuiz.correct.slice(0, settings.maxScenes);
    const isCorrect = JSON.stringify(userSequence) === JSON.stringify(limitedCorrect);

    if (isCorrect) {
      const basePoints = 100;
      const multiplier = settings.pointsMultiplier;
      const streakBonus = streak * 10;
      const timeBonus = timeRemaining ? Math.floor(timeRemaining / 2) : 0;
      const hintPenalty = hintsUsed * 20;
      const pointsEarned = Math.max(0, Math.floor((basePoints + streakBonus + timeBonus - hintPenalty) * multiplier));

      setScore(prev => prev + pointsEarned);
      setStreak(prev => prev + 1);
      setBestStreak(prev => Math.max(prev, streak + 1));
      setCorrectAnswers(prev => prev + 1);
      setFeedback(t('games.common.correctPlusPoints', { points: pointsEarned }));

      toast({
        title: t('games.common.correct'),
        description: t('games.common.plusPointsStreak', { points: pointsEarned, streak: streak + 1 }),
      });

      setTimeout(() => moveToNextQuiz(), 2000);
    } else {
      setStreak(0);
      setFeedback(t('games.storyRoom3d.incorrectSequence'));
      toast({
        title: t('games.common.notQuiteRight'),
        description: t('games.storyRoom3d.checkOrderTryAgain'),
        variant: "destructive",
      });
    }
  };

  // Move to next quiz
  const moveToNextQuiz = () => {
    const nextIndex = currentQuizIndex + 1;

    if (nextIndex >= availableQuizzes.length) {
      setGameState("complete");
      saveScore();
    } else {
      setCurrentQuizIndex(nextIndex);
      setupChallenge(availableQuizzes[nextIndex], DIFFICULTY_SETTINGS[difficulty]);
    }
  };

  // Skip quiz
  const skipQuiz = () => {
    setStreak(0);
    moveToNextQuiz();
  };

  // Save score
  const saveScore = async () => {
    if (!user || score === 0) return;

    try {
      await supabase.from("game_scores").insert({
        user_id: user.id,
        game_type: "story_room_3d",
        score: score,
        mode: difficulty,
        metadata: {
          total_questions: totalAttempts,
          correct_answers: correctAnswers,
          best_streak: bestStreak,
          hints_used: hintsUsed,
          completed_at: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  const settings = DIFFICULTY_SETTINGS[difficulty];
  const maxSlots = currentQuiz ? Math.min(currentQuiz.sequence.length, settings.maxScenes) : 0;

  // Completion screen
  if (gameState === "complete") {
    const accuracy = totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0;

    return (
      <div className="min-h-screen bg-background pb-24 md:pb-8">
        <Navigation />
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Trophy className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
                <CardTitle className="text-3xl">{t('games.common.sessionComplete')}</CardTitle>
                <CardDescription>
                  {t('games.storyRoom3d.masteredStoryRoom')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <div className="text-3xl font-bold text-primary">{score}</div>
                    <div className="text-sm text-muted-foreground">{t('games.common.totalScore')}</div>
                  </div>
                  <div className="p-4 bg-green-500/10 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{accuracy}%</div>
                    <div className="text-sm text-muted-foreground">{t('games.common.accuracy')}</div>
                  </div>
                  <div className="p-4 bg-orange-500/10 rounded-lg">
                    <div className="text-3xl font-bold text-orange-600">{bestStreak}</div>
                    <div className="text-sm text-muted-foreground">{t('games.common.bestStreak')}</div>
                  </div>
                  <div className="p-4 bg-purple-500/10 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">{correctAnswers}</div>
                    <div className="text-sm text-muted-foreground">{t('games.common.correct')}</div>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button onClick={() => navigate("/games")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t('games.common.backToGames')}
                  </Button>
                  <Button onClick={() => setGameState("menu")} variant="outline">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    {t('games.common.playAgain')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <GameLeaderboard gameType="story_room_3d" currentScore={score} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* 3D Canvas */}
      <div className="fixed inset-0 top-16 z-0">
        <Canvas shadows camera={{ fov: 60, position: [0, 5, 12] }}>
          <Suspense fallback={null}>
            <CameraController cameraTarget={cameraTarget} />

            {/* Lighting */}
            <ambientLight intensity={0.2} />
            <directionalLight
              position={[5, 10, 5]}
              intensity={0.5}
              castShadow
              shadow-mapSize={[1024, 1024]}
            />

            {/* Environment */}
            <LibraryEnvironment />
            <Stars radius={100} depth={50} count={1000} factor={4} fade />

            {/* Game content when playing */}
            {gameState === "playing" && currentQuiz && (
              <>
                {/* Story title pedestal */}
                <StoryPedestal title={currentQuiz.story} book={currentQuiz.book} />

                {/* Available scene tablets (in semicircle) */}
                {availableScenes.map((scene, i) => {
                  const angle = (Math.PI * 0.6) * (i / Math.max(1, availableScenes.length - 1)) - Math.PI * 0.3;
                  const radius = 5;
                  const x = Math.sin(angle) * radius;
                  const z = Math.cos(angle) * radius - 2;
                  return (
                    <SceneTablet
                      key={scene}
                      text={scene}
                      position={[x, 3, z]}
                      isSelected={false}
                      isPlaced={false}
                      onClick={() => handleSceneClick(scene)}
                    />
                  );
                })}

                {/* Answer slots (in a row on stage) */}
                {Array.from({ length: maxSlots }).map((_, i) => {
                  const x = (i - (maxSlots - 1) / 2) * 3;
                  return (
                    <AnswerSlot
                      key={i}
                      index={i}
                      position={[x, 0.5, -4]}
                      scene={userSequence[i] || null}
                      onRemove={() => handleRemoveScene(i)}
                    />
                  );
                })}
              </>
            )}

            <OrbitControls
              enablePan={false}
              enableZoom={true}
              minDistance={5}
              maxDistance={15}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 2.5}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 container mx-auto px-4 pt-4">
        {/* Menu Screen */}
        {gameState === "menu" && (
          <div className="max-w-2xl mx-auto mt-8">
            <Card className="bg-background/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-3xl flex items-center gap-3">
                  <span className="text-4xl">📚</span>
                  {t('games.storyRoom3d.title')}
                </CardTitle>
                <CardDescription>
                  {t('games.storyRoom3d.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Difficulty Selection */}
                <div>
                  <h3 className="font-semibold mb-3">{t('games.common.selectDifficulty')}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(Object.keys(DIFFICULTY_SETTINGS) as Difficulty[]).map((d) => {
                      const s = DIFFICULTY_SETTINGS[d];
                      const colors = {
                        easy: "bg-green-500",
                        medium: "bg-yellow-500",
                        hard: "bg-orange-500",
                        expert: "bg-red-500",
                      };
                      return (
                        <Card
                          key={d}
                          className={`cursor-pointer transition-all ${
                            difficulty === d
                              ? "ring-2 ring-primary border-primary"
                              : "hover:border-primary/50"
                          }`}
                          onClick={() => setDifficulty(d)}
                        >
                          <CardContent className="p-4 text-center">
                            <div className={`inline-flex p-2 rounded-full ${colors[d]} text-white mb-2`}>
                              {d === "easy" && <Star className="h-5 w-5" />}
                              {d === "medium" && <Flame className="h-5 w-5" />}
                              {d === "hard" && <Zap className="h-5 w-5" />}
                              {d === "expert" && <Trophy className="h-5 w-5" />}
                            </div>
                            <div className="font-semibold">{t(`games.common.difficulty.${d}`)}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {t('games.common.hintsCount', { count: s.hintsAllowed })}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {s.timeLimit ? t('games.common.timeLimit', { seconds: s.timeLimit }) : t('games.common.noTimer')}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                <Button onClick={startGame} size="lg" className="w-full">
                  {t('games.storyRoom3d.enterLibrary')}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate("/games")}
                  className="w-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t('games.common.backToGames')}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Playing UI */}
        {gameState === "playing" && currentQuiz && (
          <>
            {/* Top bar */}
            <Card className="bg-background/95 backdrop-blur mb-4">
              <CardContent className="py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge className={difficulty === "easy" ? "bg-green-500" : difficulty === "medium" ? "bg-yellow-500" : difficulty === "hard" ? "bg-orange-500" : "bg-red-500"}>
                      {settings.name}
                    </Badge>
                    <span className="font-bold text-xl">{score} pts</span>
                    <div className="flex items-center gap-1 text-sm">
                      <Flame className={`h-4 w-4 ${streak > 0 ? "text-orange-500" : ""}`} />
                      {streak}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {timeRemaining !== null && (
                      <div className={`flex items-center gap-1 font-mono text-lg ${timeRemaining <= 10 ? "text-red-500 animate-pulse" : ""}`}>
                        <Timer className="h-5 w-5" />
                        {timeRemaining}s
                      </div>
                    )}
                    <Badge variant="outline">
                      {currentQuizIndex + 1} / {availableQuizzes.length}
                    </Badge>
                  </div>
                </div>

                <Progress value={((currentQuizIndex + 1) / availableQuizzes.length) * 100} className="mt-2" />
              </CardContent>
            </Card>

            {/* Bottom action bar */}
            <div className="fixed bottom-20 md:bottom-4 left-4 right-4 z-20">
              <Card className="bg-background/95 backdrop-blur max-w-4xl mx-auto">
                <CardContent className="py-4">
                  {/* Feedback */}
                  {feedback && (
                    <div className={`mb-4 p-3 rounded-lg flex items-center gap-3 ${
                      feedback.includes("Correct")
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {feedback.includes("Correct") ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                      <span className="font-medium">{feedback}</span>
                    </div>
                  )}

                  {/* Hint */}
                  {showHint && currentQuiz && (
                    <div className="mb-4 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg border border-amber-300">
                      <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                        <HelpCircle className="h-5 w-5" />
                        <span className="font-medium">{t('games.storyRoom3d.hintStartWith', { scene: currentQuiz.correct[0] })}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {t('games.storyRoom3d.clickTablets', { placed: userSequence.length, total: maxSlots })}
                    </div>

                    <div className="flex gap-2">
                      {hintsRemaining > 0 && !showHint && (
                        <Button onClick={useHint} variant="outline" size="sm">
                          <HelpCircle className="mr-2 h-4 w-4" />
                          {t('games.common.hint')} ({hintsRemaining})
                        </Button>
                      )}

                      <Button onClick={skipQuiz} variant="ghost" size="sm">
                        {t('games.common.skip')}
                      </Button>

                      <Button
                        onClick={checkAnswer}
                        disabled={userSequence.length !== maxSlots}
                        size="sm"
                      >
                        {t('games.common.checkAnswer')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
