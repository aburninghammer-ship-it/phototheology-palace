import { useState, useRef, Suspense, useEffect } from "react";
import { FloatingGameChat } from "@/components/games/FloatingGameChat";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Text,
  Html,
  useTexture,
  Box,
  Plane,
  Cylinder,
  Sphere
} from "@react-three/drei";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Lock, Unlock, Lightbulb, Check, X, HelpCircle, Trophy, Clock } from "lucide-react";
import { toast } from "sonner";
import { escapeRooms, type Puzzle, type EscapeRoom } from "@/data/escapeRoomData";

// Interactive 3D Object component
interface InteractiveObjectProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  objectType: 'scroll' | 'chest' | 'tablet' | 'altar' | 'lampstand' | 'door' | 'veil' | 'pillar';
  puzzleIndex: number;
  isSolved: boolean;
  isActive: boolean;
  onClick: () => void;
  label: string;
}

function InteractiveObject({
  position,
  rotation = [0, 0, 0],
  scale = 1,
  objectType,
  puzzleIndex,
  isSolved,
  isActive,
  onClick,
  label
}: InteractiveObjectProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Hover animation
  useFrame((state) => {
    if (meshRef.current) {
      if (hovered && !isSolved) {
        meshRef.current.scale.setScalar(scale * 1.1);
      } else {
        meshRef.current.scale.setScalar(scale);
      }
    }
  });

  const getObjectColor = () => {
    if (isSolved) return "#22c55e"; // Green for solved
    if (hovered) return "#fbbf24"; // Yellow for hover
    if (isActive) return "#8b5cf6"; // Purple for active/available
    return "#6b7280"; // Gray for locked
  };

  const renderObject = () => {
    switch (objectType) {
      case 'scroll':
        return (
          <group>
            <Cylinder args={[0.15, 0.15, 0.8, 16]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color={getObjectColor()} roughness={0.6} />
            </Cylinder>
            {/* Scroll ends */}
            <Cylinder args={[0.2, 0.2, 0.1, 16]} position={[-0.45, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#8B4513" roughness={0.4} />
            </Cylinder>
            <Cylinder args={[0.2, 0.2, 0.1, 16]} position={[0.45, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#8B4513" roughness={0.4} />
            </Cylinder>
          </group>
        );

      case 'chest':
        return (
          <group>
            {/* Base */}
            <Box args={[0.8, 0.5, 0.5]}>
              <meshStandardMaterial color={getObjectColor()} roughness={0.5} />
            </Box>
            {/* Lid */}
            <Box
              args={[0.82, 0.1, 0.52]}
              position={[0, isSolved ? 0.5 : 0.3, isSolved ? -0.2 : 0]}
              rotation={[isSolved ? -Math.PI / 3 : 0, 0, 0]}
            >
              <meshStandardMaterial color={getObjectColor()} roughness={0.5} />
            </Box>
            {/* Lock */}
            {!isSolved && (
              <Box args={[0.1, 0.15, 0.05]} position={[0, 0.1, 0.27]}>
                <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
              </Box>
            )}
          </group>
        );

      case 'tablet':
        return (
          <Box args={[0.6, 0.8, 0.1]}>
            <meshStandardMaterial color={getObjectColor()} roughness={0.7} />
          </Box>
        );

      case 'altar':
        return (
          <group>
            {/* Altar base */}
            <Box args={[1.2, 0.8, 1.2]}>
              <meshStandardMaterial color={getObjectColor()} roughness={0.8} />
            </Box>
            {/* Fire bowl */}
            <Cylinder args={[0.3, 0.4, 0.2, 16]} position={[0, 0.5, 0]}>
              <meshStandardMaterial color="#4a3728" roughness={0.6} />
            </Cylinder>
            {/* Flames */}
            {isSolved && (
              <pointLight position={[0, 0.8, 0]} color="#ff6b35" intensity={2} distance={3} />
            )}
          </group>
        );

      case 'lampstand':
        return (
          <group>
            {/* Base - wider and taller */}
            <Cylinder args={[0.35, 0.45, 0.15, 16]}>
              <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
            </Cylinder>
            {/* Base ring decoration */}
            <Cylinder args={[0.38, 0.38, 0.05, 16]} position={[0, 0.1, 0]}>
              <meshStandardMaterial color="#DAA520" metalness={0.7} roughness={0.3} />
            </Cylinder>
            {/* Main stem - thicker and more proportional */}
            <Cylinder args={[0.1, 0.12, 1.5, 12]} position={[0, 0.8, 0]}>
              <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
            </Cylinder>
            {/* Stem decorative bulge */}
            <Sphere args={[0.14, 12, 12]} position={[0, 0.6, 0]}>
              <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
            </Sphere>
            {/* Branches - simplified menorah with holders */}
            {[-0.4, -0.2, 0, 0.2, 0.4].map((x, i) => (
              <group key={i}>
                {/* Lamp holder cup */}
                <Cylinder args={[0.1, 0.08, 0.08, 12]} position={[x, 1.45, 0]}>
                  <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
                </Cylinder>
                {/* Lamp flame bowl */}
                <Sphere args={[0.1, 16, 16]} position={[x, 1.55, 0]}>
                  <meshStandardMaterial color={getObjectColor()} emissive={isSolved ? "#ffaa00" : "#000"} emissiveIntensity={isSolved ? 0.5 : 0} />
                </Sphere>
                {isSolved && (
                  <pointLight position={[x, 1.7, 0]} color="#ffaa00" intensity={0.5} distance={2} />
                )}
              </group>
            ))}
          </group>
        );

      case 'door':
        return (
          <group>
            {/* Door frame */}
            <Box args={[1.5, 2.5, 0.2]} position={[0, 0, -0.15]}>
              <meshStandardMaterial color="#4a3728" roughness={0.6} />
            </Box>
            {/* Door */}
            <Box
              args={[1.3, 2.3, 0.15]}
              position={[isSolved ? -0.6 : 0, 0, 0]}
              rotation={[0, isSolved ? -Math.PI / 3 : 0, 0]}
            >
              <meshStandardMaterial color={getObjectColor()} roughness={0.5} />
            </Box>
            {/* Door handle */}
            <Sphere args={[0.08, 16, 16]} position={[0.5, 0, 0.1]}>
              <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
            </Sphere>
          </group>
        );

      case 'veil':
        return (
          <Box args={[2, 3, 0.05]}>
            <meshStandardMaterial
              color={getObjectColor()}
              roughness={0.9}
              transparent
              opacity={isSolved ? 0.3 : 0.9}
            />
          </Box>
        );

      case 'pillar':
        return (
          <group>
            <Cylinder args={[0.3, 0.35, 3, 16]}>
              <meshStandardMaterial color={getObjectColor()} roughness={0.7} />
            </Cylinder>
            {/* Capital */}
            <Box args={[0.6, 0.2, 0.6]} position={[0, 1.6, 0]}>
              <meshStandardMaterial color={getObjectColor()} roughness={0.7} />
            </Box>
          </group>
        );

      default:
        return (
          <Box args={[0.5, 0.5, 0.5]}>
            <meshStandardMaterial color={getObjectColor()} />
          </Box>
        );
    }
  };

  return (
    <group
      position={position}
      rotation={rotation as [number, number, number]}
      ref={meshRef}
      onClick={(e) => {
        e.stopPropagation();
        if (!isSolved) onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = isSolved ? 'default' : 'pointer';
      }}
      onPointerOut={(e) => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      {renderObject()}

      {/* Floating label */}
      {(hovered || isActive) && !isSolved && (
        <Html position={[0, 1.5, 0]} center>
          <div className="bg-black/80 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap">
            {label}
            {isSolved && " ✓"}
          </div>
        </Html>
      )}

      {/* Solved indicator */}
      {isSolved && (
        <Html position={[0, 1, 0]} center>
          <div className="text-2xl">✓</div>
        </Html>
      )}

      {/* Glow effect for unsolved active objects */}
      {isActive && !isSolved && (
        <pointLight position={[0, 0.5, 0]} color="#8b5cf6" intensity={0.5} distance={2} />
      )}
    </group>
  );
}

// Sanctuary Room Environment
interface SanctuaryRoomProps {
  puzzles: Puzzle[];
  solvedPuzzles: Set<number>;
  currentPuzzle: number;
  onObjectClick: (index: number) => void;
}

function SanctuaryRoom({ puzzles, solvedPuzzles, currentPuzzle, onObjectClick }: SanctuaryRoomProps) {
  // Room dimensions
  const roomWidth = 12;
  const roomDepth = 16;
  const roomHeight = 6;

  // Object positions mapped to puzzles
  const objectConfigs: { type: InteractiveObjectProps['objectType']; position: [number, number, number]; rotation?: [number, number, number]; label: string }[] = [
    { type: 'altar', position: [0, 0.4, -6], label: 'Altar of Burnt Offering' },
    { type: 'lampstand', position: [-4, 0, -2], label: 'Golden Lampstand' },
    { type: 'tablet', position: [4, 1.2, -5], rotation: [0, -0.3, 0], label: 'Stone Tablets' },
    { type: 'scroll', position: [-3, 1, 2], label: 'Ancient Scroll' },
    { type: 'chest', position: [3, 0.25, 0], label: 'Treasure Chest' },
    { type: 'veil', position: [0, 1.5, -7], label: 'Holy Veil' },
  ];

  return (
    <group>
      {/* Floor - stone texture */}
      <Plane args={[roomWidth, roomDepth]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#3d3d3d" roughness={0.9} />
      </Plane>

      {/* Ceiling */}
      <Plane args={[roomWidth, roomDepth]} rotation={[Math.PI / 2, 0, 0]} position={[0, roomHeight, 0]}>
        <meshStandardMaterial color="#2d2d2d" roughness={0.8} />
      </Plane>

      {/* Walls */}
      {/* Back wall */}
      <Plane args={[roomWidth, roomHeight]} position={[0, roomHeight / 2, -roomDepth / 2]}>
        <meshStandardMaterial color="#4a4a4a" roughness={0.8} />
      </Plane>

      {/* Front wall (with opening) */}
      <Plane args={[roomWidth, roomHeight]} position={[0, roomHeight / 2, roomDepth / 2]} rotation={[0, Math.PI, 0]}>
        <meshStandardMaterial color="#4a4a4a" roughness={0.8} />
      </Plane>

      {/* Left wall */}
      <Plane args={[roomDepth, roomHeight]} position={[-roomWidth / 2, roomHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color="#3a3a3a" roughness={0.8} />
      </Plane>

      {/* Right wall */}
      <Plane args={[roomDepth, roomHeight]} position={[roomWidth / 2, roomHeight / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <meshStandardMaterial color="#3a3a3a" roughness={0.8} />
      </Plane>

      {/* Decorative pillars */}
      <InteractiveObject
        position={[-4, 1.5, -6]}
        objectType="pillar"
        puzzleIndex={-1}
        isSolved={true}
        isActive={false}
        onClick={() => {}}
        label=""
      />
      <InteractiveObject
        position={[4, 1.5, -6]}
        objectType="pillar"
        puzzleIndex={-1}
        isSolved={true}
        isActive={false}
        onClick={() => {}}
        label=""
      />

      {/* Interactive puzzle objects */}
      {objectConfigs.slice(0, puzzles.length).map((config, index) => (
        <InteractiveObject
          key={index}
          position={config.position}
          rotation={config.rotation}
          objectType={config.type}
          puzzleIndex={index}
          isSolved={solvedPuzzles.has(index)}
          isActive={index <= Math.max(...Array.from(solvedPuzzles), -1) + 1}
          onClick={() => onObjectClick(index)}
          label={config.label}
        />
      ))}

      {/* Ambient torches */}
      <pointLight position={[-5, 4, -4]} color="#ff6b35" intensity={1} distance={8} />
      <pointLight position={[5, 4, -4]} color="#ff6b35" intensity={1} distance={8} />
      <pointLight position={[0, 4, 4]} color="#ff6b35" intensity={0.5} distance={6} />

      {/* Main light */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[0, 10, 5]} intensity={0.5} />
    </group>
  );
}

// ============================================
// EXODUS ROOM - Desert/Egyptian Theme
// ============================================
function ExodusRoom({ puzzles, solvedPuzzles, currentPuzzle, onObjectClick }: SanctuaryRoomProps) {
  const roomWidth = 14;
  const roomDepth = 18;
  const roomHeight = 8;

  const objectConfigs: { type: InteractiveObjectProps['objectType']; position: [number, number, number]; rotation?: [number, number, number]; label: string }[] = [
    { type: 'tablet', position: [0, 1.5, -7], label: 'Ten Commandments' },
    { type: 'scroll', position: [-5, 1, -3], label: 'Moses\' Staff Scroll' },
    { type: 'altar', position: [5, 0.4, -5], label: 'Altar of Sacrifice' },
    { type: 'chest', position: [-4, 0.25, 2], label: 'Egyptian Treasure' },
    { type: 'pillar', position: [4, 1.5, 0], label: 'Pillar of Fire' },
    { type: 'door', position: [0, 1.25, -8], label: 'Passover Door' },
  ];

  return (
    <group>
      {/* Sandy floor */}
      <Plane args={[roomWidth, roomDepth]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#C2A060" roughness={1} />
      </Plane>

      {/* Open sky ceiling with stars */}
      <Plane args={[roomWidth, roomDepth]} rotation={[Math.PI / 2, 0, 0]} position={[0, roomHeight, 0]}>
        <meshStandardMaterial color="#0a0a2a" roughness={0.5} />
      </Plane>

      {/* Stone walls - Egyptian style */}
      <Plane args={[roomWidth, roomHeight]} position={[0, roomHeight / 2, -roomDepth / 2]}>
        <meshStandardMaterial color="#8B7355" roughness={0.9} />
      </Plane>
      <Plane args={[roomWidth, roomHeight]} position={[0, roomHeight / 2, roomDepth / 2]} rotation={[0, Math.PI, 0]}>
        <meshStandardMaterial color="#8B7355" roughness={0.9} />
      </Plane>
      <Plane args={[roomDepth, roomHeight]} position={[-roomWidth / 2, roomHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color="#A08060" roughness={0.9} />
      </Plane>
      <Plane args={[roomDepth, roomHeight]} position={[roomWidth / 2, roomHeight / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <meshStandardMaterial color="#A08060" roughness={0.9} />
      </Plane>

      {/* Burning bush effect */}
      <group position={[-6, 0, -6]}>
        <Sphere args={[0.8, 16, 16]}>
          <meshStandardMaterial color="#2d5a27" roughness={0.8} />
        </Sphere>
        <pointLight position={[0, 1, 0]} color="#ff4500" intensity={2} distance={4} />
        <pointLight position={[0, 0.5, 0]} color="#ffa500" intensity={1} distance={3} />
      </group>

      {/* Interactive objects */}
      {objectConfigs.slice(0, puzzles.length).map((config, index) => (
        <InteractiveObject
          key={index}
          position={config.position}
          rotation={config.rotation}
          objectType={config.type}
          puzzleIndex={index}
          isSolved={solvedPuzzles.has(index)}
          isActive={index <= Math.max(...Array.from(solvedPuzzles), -1) + 1}
          onClick={() => onObjectClick(index)}
          label={config.label}
        />
      ))}

      {/* Desert lighting - warm */}
      <ambientLight intensity={0.3} color="#ffe4b5" />
      <directionalLight position={[5, 15, 5]} intensity={0.8} color="#ffd700" />
      <pointLight position={[0, 5, 0]} color="#ff6b35" intensity={0.3} distance={15} />
    </group>
  );
}

// ============================================
// PROPHECY ROOM - Mystical/Vision Theme
// ============================================
function ProphecyRoom({ puzzles, solvedPuzzles, currentPuzzle, onObjectClick }: SanctuaryRoomProps) {
  const roomWidth = 12;
  const roomDepth = 16;
  const roomHeight = 10;

  const objectConfigs: { type: InteractiveObjectProps['objectType']; position: [number, number, number]; rotation?: [number, number, number]; label: string }[] = [
    { type: 'scroll', position: [0, 1.5, -6], label: 'Sealed Scroll' },
    { type: 'lampstand', position: [-4, 0, -4], label: 'Seven Lamps' },
    { type: 'tablet', position: [4, 1.2, -5], label: 'Vision Tablet' },
    { type: 'chest', position: [-3, 0.25, 1], label: 'Ark of Secrets' },
    { type: 'veil', position: [3, 1.5, -2], label: 'Veil of Mystery' },
    { type: 'altar', position: [0, 0.4, 3], label: 'Incense Altar' },
  ];

  return (
    <group>
      {/* Marble floor */}
      <Plane args={[roomWidth, roomDepth]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.2} />
      </Plane>

      {/* Starry dome ceiling */}
      <Sphere args={[12, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#0a0a1a" side={THREE.BackSide} />
      </Sphere>

      {/* Mystical walls */}
      <Plane args={[roomWidth, roomHeight]} position={[0, roomHeight / 2, -roomDepth / 2]}>
        <meshStandardMaterial color="#16213e" roughness={0.7} />
      </Plane>
      <Plane args={[roomWidth, roomHeight]} position={[0, roomHeight / 2, roomDepth / 2]} rotation={[0, Math.PI, 0]}>
        <meshStandardMaterial color="#16213e" roughness={0.7} />
      </Plane>
      <Plane args={[roomDepth, roomHeight]} position={[-roomWidth / 2, roomHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color="#1a1a3e" roughness={0.7} />
      </Plane>
      <Plane args={[roomDepth, roomHeight]} position={[roomWidth / 2, roomHeight / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <meshStandardMaterial color="#1a1a3e" roughness={0.7} />
      </Plane>

      {/* Floating orbs of light */}
      {[[-3, 6, -4], [3, 5, -3], [0, 7, 0], [-2, 4, 3], [4, 6, 2]].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <Sphere args={[0.15, 16, 16]}>
            <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.8} />
          </Sphere>
          <pointLight color="#8b5cf6" intensity={0.5} distance={4} />
        </group>
      ))}

      {/* Interactive objects */}
      {objectConfigs.slice(0, puzzles.length).map((config, index) => (
        <InteractiveObject
          key={index}
          position={config.position}
          rotation={config.rotation}
          objectType={config.type}
          puzzleIndex={index}
          isSolved={solvedPuzzles.has(index)}
          isActive={index <= Math.max(...Array.from(solvedPuzzles), -1) + 1}
          onClick={() => onObjectClick(index)}
          label={config.label}
        />
      ))}

      {/* Mystical lighting */}
      <ambientLight intensity={0.15} color="#4a00e0" />
      <directionalLight position={[0, 10, 5]} intensity={0.3} color="#8e2de2" />
      <pointLight position={[0, 8, 0]} color="#8b5cf6" intensity={1} distance={20} />
    </group>
  );
}

// ============================================
// GARDEN/PARABLES ROOM - Nature Theme
// ============================================
function GardenRoom({ puzzles, solvedPuzzles, currentPuzzle, onObjectClick }: SanctuaryRoomProps) {
  const roomWidth = 16;
  const roomDepth = 20;
  const roomHeight = 8;

  const objectConfigs: { type: InteractiveObjectProps['objectType']; position: [number, number, number]; rotation?: [number, number, number]; label: string }[] = [
    { type: 'scroll', position: [0, 1, -8], label: 'Parable Scroll' },
    { type: 'chest', position: [-5, 0.25, -4], label: 'Seed Box' },
    { type: 'altar', position: [5, 0.4, -6], label: 'Stone Altar' },
    { type: 'tablet', position: [-4, 1.2, 2], label: 'Wisdom Tablet' },
    { type: 'door', position: [4, 1.25, 0], label: 'Narrow Gate' },
    { type: 'lampstand', position: [0, 0, 4], label: 'Oil Lamp' },
  ];

  return (
    <group>
      {/* Grass floor */}
      <Plane args={[roomWidth, roomDepth]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#228B22" roughness={1} />
      </Plane>

      {/* Open sky */}
      <Plane args={[roomWidth * 2, roomDepth * 2]} rotation={[Math.PI / 2, 0, 0]} position={[0, roomHeight, 0]}>
        <meshStandardMaterial color="#87CEEB" roughness={0.5} />
      </Plane>

      {/* Garden walls - hedges */}
      <Box args={[roomWidth, 3, 1]} position={[0, 1.5, -roomDepth / 2]}>
        <meshStandardMaterial color="#2d5a27" roughness={0.9} />
      </Box>
      <Box args={[1, 3, roomDepth]} position={[-roomWidth / 2, 1.5, 0]}>
        <meshStandardMaterial color="#2d5a27" roughness={0.9} />
      </Box>
      <Box args={[1, 3, roomDepth]} position={[roomWidth / 2, 1.5, 0]}>
        <meshStandardMaterial color="#2d5a27" roughness={0.9} />
      </Box>

      {/* Trees */}
      {[[-6, 0, -7], [6, 0, -7], [-6, 0, 5], [6, 0, 5]].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <Cylinder args={[0.3, 0.4, 2, 8]} position={[0, 1, 0]}>
            <meshStandardMaterial color="#8B4513" roughness={0.9} />
          </Cylinder>
          <Sphere args={[1.5, 16, 16]} position={[0, 3, 0]}>
            <meshStandardMaterial color="#228B22" roughness={0.8} />
          </Sphere>
        </group>
      ))}

      {/* Flowers scattered */}
      {Array.from({ length: 12 }).map((_, i) => (
        <Sphere
          key={i}
          args={[0.15, 8, 8]}
          position={[(Math.random() - 0.5) * 12, 0.15, (Math.random() - 0.5) * 16]}
        >
          <meshStandardMaterial color={['#ff69b4', '#ffff00', '#ff4500', '#9932cc'][i % 4]} />
        </Sphere>
      ))}

      {/* Interactive objects */}
      {objectConfigs.slice(0, puzzles.length).map((config, index) => (
        <InteractiveObject
          key={index}
          position={config.position}
          rotation={config.rotation}
          objectType={config.type}
          puzzleIndex={index}
          isSolved={solvedPuzzles.has(index)}
          isActive={index <= Math.max(...Array.from(solvedPuzzles), -1) + 1}
          onClick={() => onObjectClick(index)}
          label={config.label}
        />
      ))}

      {/* Sunlight */}
      <ambientLight intensity={0.5} color="#fffacd" />
      <directionalLight position={[10, 15, 10]} intensity={1} color="#fff8dc" castShadow />
      <hemisphereLight args={['#87CEEB', '#228B22', 0.6]} />
    </group>
  );
}

// ============================================
// CREATION ROOM - Cosmic Theme
// ============================================
function CreationRoom({ puzzles, solvedPuzzles, currentPuzzle, onObjectClick }: SanctuaryRoomProps) {
  const roomWidth = 14;
  const roomDepth = 18;
  const roomHeight = 12;

  const objectConfigs: { type: InteractiveObjectProps['objectType']; position: [number, number, number]; rotation?: [number, number, number]; label: string }[] = [
    { type: 'lampstand', position: [0, 0, -7], label: 'Light of Day 1' },
    { type: 'scroll', position: [-5, 1.5, -4], label: 'Genesis Scroll' },
    { type: 'tablet', position: [5, 1.2, -5], label: 'Creation Tablet' },
    { type: 'altar', position: [0, 0.4, 0], label: 'Sabbath Rest Altar' },
    { type: 'chest', position: [-4, 0.25, 4], label: 'Garden Treasure' },
    { type: 'veil', position: [4, 1.5, 3], label: 'Veil of Days' },
  ];

  return (
    <group>
      {/* Water floor - day 2 */}
      <Plane args={[roomWidth, roomDepth]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1a3a5c" roughness={0.2} metalness={0.5} />
      </Plane>

      {/* Cosmic dome */}
      <Sphere args={[15, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#0a0010" side={THREE.BackSide} />
      </Sphere>

      {/* Floating land masses - day 3 */}
      <Box args={[4, 0.5, 4]} position={[-4, 0.25, -5]}>
        <meshStandardMaterial color="#654321" roughness={0.9} />
      </Box>
      <Box args={[3, 0.5, 3]} position={[4, 0.25, -3]}>
        <meshStandardMaterial color="#654321" roughness={0.9} />
      </Box>

      {/* Sun and Moon - day 4 */}
      <group position={[6, 8, -6]}>
        <Sphere args={[1.5, 16, 16]}>
          <meshStandardMaterial color="#ffd700" emissive="#ffa500" emissiveIntensity={1} />
        </Sphere>
        <pointLight color="#ffd700" intensity={2} distance={20} />
      </group>
      <group position={[-6, 6, -4]}>
        <Sphere args={[0.8, 16, 16]}>
          <meshStandardMaterial color="#c0c0c0" emissive="#a0a0a0" emissiveIntensity={0.3} />
        </Sphere>
        <pointLight color="#c0c0ff" intensity={0.5} distance={10} />
      </group>

      {/* Stars scattered */}
      {Array.from({ length: 50 }).map((_, i) => (
        <Sphere
          key={i}
          args={[0.05, 8, 8]}
          position={[
            (Math.random() - 0.5) * 25,
            5 + Math.random() * 8,
            (Math.random() - 0.5) * 25
          ]}
        >
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
        </Sphere>
      ))}

      {/* Interactive objects */}
      {objectConfigs.slice(0, puzzles.length).map((config, index) => (
        <InteractiveObject
          key={index}
          position={config.position}
          rotation={config.rotation}
          objectType={config.type}
          puzzleIndex={index}
          isSolved={solvedPuzzles.has(index)}
          isActive={index <= Math.max(...Array.from(solvedPuzzles), -1) + 1}
          onClick={() => onObjectClick(index)}
          label={config.label}
        />
      ))}

      {/* Cosmic lighting */}
      <ambientLight intensity={0.1} color="#4a00e0" />
      <directionalLight position={[6, 10, -6]} intensity={0.6} color="#ffd700" />
    </group>
  );
}

// Room selector based on theme
function getRoomComponent(theme: string) {
  switch (theme.toLowerCase()) {
    case 'exodus':
      return ExodusRoom;
    case 'prophecy':
      return ProphecyRoom;
    case 'parables':
      return GardenRoom;
    case 'creation':
      return CreationRoom;
    case 'sanctuary':
    default:
      return SanctuaryRoom;
  }
}

// Camera controller
function CameraController() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 1, -2);
  }, [camera]);

  return null;
}

// Main component
export default function EscapeRoom3D() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { roomId } = useParams();

  // Find room data
  const room = escapeRooms.find(r => r.id === roomId) || escapeRooms[0];

  // Game state
  const [solvedPuzzles, setSolvedPuzzles] = useState<Set<number>>(new Set());
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState<number | null>(null);
  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  // Timer
  useEffect(() => {
    if (gameComplete || showIntro) return;

    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, gameComplete, showIntro]);

  // Check game completion
  useEffect(() => {
    if (solvedPuzzles.size === room.puzzles.length && room.puzzles.length > 0) {
      setGameComplete(true);
      toast.success(t('games.escapeRoom.roomEscaped'));
    }
  }, [solvedPuzzles, room.puzzles.length]);

  const handleObjectClick = (index: number) => {
    if (solvedPuzzles.has(index)) return;
    // Allow clicking any unsolved puzzle (not strictly sequential for better exploration)
    setCurrentPuzzleIndex(index);
    setAnswer("");
    setShowHint(false);
  };

  const currentPuzzle = currentPuzzleIndex !== null ? room.puzzles[currentPuzzleIndex] : null;

  const checkAnswer = () => {
    if (!currentPuzzle || currentPuzzleIndex === null) return;

    const normalizedAnswer = answer.toLowerCase().trim();
    const normalizedCorrect = currentPuzzle.answer?.toLowerCase().trim() || "";

    // Flexible matching
    const isCorrect = normalizedAnswer === normalizedCorrect ||
      normalizedCorrect.split(' ').every(word => normalizedAnswer.includes(word));

    if (isCorrect) {
      const pointsEarned = showHint ? Math.max(currentPuzzle.points - 5, 5) : currentPuzzle.points;
      setScore(prev => prev + pointsEarned);
      setSolvedPuzzles(prev => new Set([...prev, currentPuzzleIndex]));
      toast.success(t('games.common.correctPlusPoints', { points: pointsEarned }));

      // Show clue revealed
      setTimeout(() => {
        toast.info(currentPuzzle.clueRevealed, { duration: 5000 });
        setCurrentPuzzleIndex(null);
      }, 1000);
    } else {
      toast.error(t('games.common.notQuiteRightTryAgain'));
    }
  };

  const useHint = () => {
    setShowHint(true);
    setHintsUsed(prev => prev + 1);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (solvedPuzzles.size / room.puzzles.length) * 100;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/escape-room')} className="text-white">
            <ArrowLeft className="h-4 w-4 mr-2" /> {t('games.escapeRoom.exitRoom')}
          </Button>

          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-white border-white/30">
              <Clock className="h-3 w-3 mr-1" /> {formatTime(elapsedTime)}
            </Badge>
            <Badge variant="outline" className="text-yellow-400 border-yellow-400/30">
              <Trophy className="h-3 w-3 mr-1" /> {score} pts
            </Badge>
            <Badge variant="outline" className="text-purple-400 border-purple-400/30">
              {t('games.escapeRoom.solvedCount', { solved: solvedPuzzles.size, total: room.puzzles.length })}
            </Badge>
          </div>
        </div>

        {/* Progress bar */}
        <div className="max-w-6xl mx-auto mt-2">
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas shadows camera={{ fov: 60, position: [0, 2, 8] }}>
        <Suspense fallback={null}>
          <CameraController />
          {(() => {
            const RoomComponent = getRoomComponent(room.theme);
            return (
              <RoomComponent
                puzzles={room.puzzles}
                solvedPuzzles={solvedPuzzles}
                currentPuzzle={currentPuzzleIndex ?? 0}
                onObjectClick={handleObjectClick}
              />
            );
          })()}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={3}
            maxDistance={12}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2}
            target={[0, 1, -2]}
          />
          <Environment preset="night" />
        </Suspense>
      </Canvas>

      {/* Instructions overlay */}
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="bg-black/70 border-white/20 text-white max-w-xs">
          <CardContent className="p-3 text-sm">
            <p className="text-purple-300 font-medium mb-1">{t('games.escapeRoom.controls')}:</p>
            <p>• {t('games.escapeRoom.dragToLook')}</p>
            <p>• {t('games.escapeRoom.scrollToZoom')}</p>
            <p>• {t('games.escapeRoom.clickGlowing')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Intro Dialog */}
      <Dialog open={showIntro} onOpenChange={setShowIntro}>
        <DialogContent className="bg-slate-900 border-purple-500/30 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <span className="text-4xl">{room.icon}</span>
              {room.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-purple-200 italic">{room.storyIntro}</p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <Badge className={
                room.difficulty === 'easy' ? 'bg-green-600' :
                room.difficulty === 'medium' ? 'bg-yellow-600' :
                room.difficulty === 'hard' ? 'bg-orange-600' : 'bg-red-600'
              }>
                {room.difficulty}
              </Badge>
              <span>{t('games.escapeRoom.puzzlesCount', { count: room.puzzles.length })}</span>
              <span>{t('games.escapeRoom.timeLimitMin', { minutes: room.timeLimit })}</span>
            </div>
            <Button onClick={() => setShowIntro(false)} className="w-full bg-purple-600 hover:bg-purple-700">
              {t('games.escapeRoom.enterTheRoom')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Puzzle Dialog */}
      <Dialog open={currentPuzzleIndex !== null} onOpenChange={() => setCurrentPuzzleIndex(null)}>
        <DialogContent className="bg-slate-900 border-purple-500/30 text-white max-w-lg">
          {currentPuzzle && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {t('games.escapeRoom.puzzleNumber', { number: (currentPuzzleIndex ?? 0) + 1 })}: {currentPuzzle.type.replace('-', ' ').toUpperCase()}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Principle badge */}
                <Badge variant="outline" className="text-purple-300 border-purple-500">
                  {currentPuzzle.principle.room} - {currentPuzzle.principle.name}
                </Badge>

                {/* Question */}
                <div className="bg-black/50 rounded-lg p-4">
                  <p className="text-lg">{currentPuzzle.question}</p>
                </div>

                {/* Hint */}
                {showHint && currentPuzzle.hint && (
                  <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                    <p className="text-yellow-200 text-sm">
                      <Lightbulb className="h-4 w-4 inline mr-2" />
                      {currentPuzzle.hint}
                    </p>
                  </div>
                )}

                {/* Answer input for riddle/fill-blank */}
                {(currentPuzzle.type === 'riddle' || currentPuzzle.type === 'fill-blank') && (
                  <Input
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder={t('games.escapeRoom.enterYourAnswer')}
                    className="bg-black/50 border-purple-500/50 text-white"
                    onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                  />
                )}

                {/* Multiple choice */}
                {currentPuzzle.type === 'multiple-choice' && currentPuzzle.options && (
                  <div className="grid grid-cols-2 gap-2">
                    {currentPuzzle.options.map((option, idx) => (
                      <Button
                        key={idx}
                        variant={answer === option ? "default" : "outline"}
                        className={answer === option ? "bg-purple-600" : "border-purple-500/50"}
                        onClick={() => setAnswer(option)}
                      >
                        {String.fromCharCode(65 + idx)}. {option}
                      </Button>
                    ))}
                  </div>
                )}

                {/* Points info */}
                <p className="text-sm text-gray-400">
                  {t('games.common.points')}: {currentPuzzle.points} {showHint && t('games.escapeRoom.minusForHint')}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  {!showHint && currentPuzzle.hint && (
                    <Button variant="outline" onClick={useHint} className="border-yellow-500/50 text-yellow-400">
                      <Lightbulb className="h-4 w-4 mr-2" /> {t('games.escapeRoom.useHint')}
                    </Button>
                  )}
                  <Button onClick={checkAnswer} className="flex-1 bg-purple-600 hover:bg-purple-700">
                    <Check className="h-4 w-4 mr-2" /> {t('games.common.submitAnswer')}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Game Complete Dialog */}
      <Dialog open={gameComplete} onOpenChange={() => {}}>
        <DialogContent className="bg-slate-900 border-green-500/30 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center text-green-400">
              {t('games.escapeRoom.roomEscapedTitle')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <div className="text-6xl">{room.icon}</div>
            <h3 className="text-xl font-bold">{room.title}</h3>

            <div className="grid grid-cols-3 gap-4 py-4">
              <div className="bg-black/50 rounded-lg p-3">
                <p className="text-2xl font-bold text-yellow-400">{score}</p>
                <p className="text-sm text-gray-400">{t('games.common.points')}</p>
              </div>
              <div className="bg-black/50 rounded-lg p-3">
                <p className="text-2xl font-bold text-blue-400">{formatTime(elapsedTime)}</p>
                <p className="text-sm text-gray-400">{t('games.common.time')}</p>
              </div>
              <div className="bg-black/50 rounded-lg p-3">
                <p className="text-2xl font-bold text-purple-400">{hintsUsed}</p>
                <p className="text-sm text-gray-400">{t('games.common.hintsUsed')}</p>
              </div>
            </div>

            {/* Final answer */}
            <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
              <p className="text-green-200 font-medium mb-2">{t('games.escapeRoom.mysteryRevealed')}:</p>
              <p className="text-white">{room.finalAnswer.explanation}</p>
              <p className="text-green-300 text-sm mt-2 italic">{room.finalAnswer.verse}</p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/escape-room')} className="flex-1 border-white/30">
                {t('games.escapeRoom.backToRooms')}
              </Button>
              <Button
                onClick={() => {
                  setSolvedPuzzles(new Set());
                  setScore(0);
                  setHintsUsed(0);
                  setGameComplete(false);
                  setShowIntro(true);
                }}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {t('games.common.playAgain')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <FloatingGameChat gameType="escape-room-3d" />
    </div>
  );
}
