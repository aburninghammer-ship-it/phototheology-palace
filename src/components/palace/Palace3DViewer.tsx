import { useState, useRef, Suspense, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import {
  OrbitControls,
  Text,
  Html,
  Box,
  Plane,
  Cylinder,
  Sphere,
  Float,
  Stars,
  useProgress,
  PerformanceMonitor,
  MeshDistortMaterial,
  GradientTexture,
  Sparkles,
  Cloud,
  Environment
} from "@react-three/drei";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslatedPalaceData } from "@/hooks/useTranslatedPalaceData";
import { ChevronUp, ChevronDown, Home, Info, Loader2, Smartphone, Monitor, Sparkles as SparklesIcon, Eye } from "lucide-react";

// Detect mobile device for performance optimization
const isMobile = typeof window !== 'undefined' && (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
  window.innerWidth < 768
);

// Enhanced floor color schemes with gradients and glow
const floorColors: Record<number, { primary: string; secondary: string; accent: string; glow: string; emissive: string }> = {
  1: { primary: "#5D4037", secondary: "#8D6E63", accent: "#FFD54F", glow: "#FFD700", emissive: "#FFA000" }, // Earth/Foundation - Warm browns
  2: { primary: "#1A237E", secondary: "#3949AB", accent: "#82B1FF", glow: "#448AFF", emissive: "#2962FF" }, // Investigation - Deep blue
  3: { primary: "#E65100", secondary: "#FF9800", accent: "#FFCC80", glow: "#FFB300", emissive: "#FF8F00" }, // Freestyle - Orange gold
  4: { primary: "#4A148C", secondary: "#7B1FA2", accent: "#EA80FC", glow: "#E040FB", emissive: "#AA00FF" }, // Next Level - Royal purple
  5: { primary: "#01579B", secondary: "#0288D1", accent: "#81D4FA", glow: "#40C4FF", emissive: "#00B0FF" }, // Vision - Sky blue
  6: { primary: "#004D40", secondary: "#00897B", accent: "#80CBC4", glow: "#1DE9B6", emissive: "#00BFA5" }, // Three Heavens - Teal
  7: { primary: "#B71C1C", secondary: "#E53935", accent: "#FF8A80", glow: "#FF5252", emissive: "#FF1744" }, // Spiritual - Fire red
  8: { primary: "#212121", secondary: "#424242", accent: "#E0E0E0", glow: "#FFFFFF", emissive: "#9E9E9E" }, // Master - Silver/white
};

// Floor names and icons
const floorNames: Record<number, string> = {
  1: "Furnishing",
  2: "Investigation", 
  3: "Freestyle",
  4: "Next Level",
  5: "Vision",
  6: "Three Heavens",
  7: "Spiritual",
  8: "Master",
};

const floorEmojis: Record<number, string> = {
  1: "📚",
  2: "🔍",
  3: "🎨",
  4: "⬆️",
  5: "👁️",
  6: "🌌",
  7: "🔥",
  8: "👑",
};

// Animated floating orb for atmosphere
function FloatingOrb({ position, color, size = 0.2, speed = 1 }: { position: [number, number, number]; color: string; size?: number; speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const startY = position[1];
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = startY + Math.sin(state.clock.elapsedTime * speed) * 0.5;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[size, 16, 16]} position={position}>
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={0.8} 
          transparent 
          opacity={0.7}
        />
      </Sphere>
    </Float>
  );
}

// Glowing ring effect for floor borders
function GlowRing({ radius, color, yPosition }: { radius: number; color: string; yPosition: number }) {
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ringRef.current) {
      const material = ringRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, yPosition + 0.01, 0]}>
      <ringGeometry args={[radius - 0.1, radius, 64]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} transparent opacity={0.6} side={THREE.DoubleSide} />
    </mesh>
  );
}

// Animated pillar with energy effect
function EnergyPillar({ position, height, color }: { position: [number, number, number]; height: number; color: string }) {
  const pillarRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (pillarRef.current) {
      const material = pillarRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.2 + Math.sin(state.clock.elapsedTime * 3) * 0.15;
    }
  });

  return (
    <group position={position}>
      <Cylinder ref={pillarRef} args={[0.3, 0.4, height, 8]}>
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={0.2}
          transparent 
          opacity={0.4}
        />
      </Cylinder>
      {/* Energy particles around pillar */}
      {!isMobile && (
        <Sparkles count={30} scale={[1, height, 1]} size={2} speed={0.5} color={color} />
      )}
    </group>
  );
}

interface RoomDoorProps {
  position: [number, number, number];
  room: {
    id: string;
    name: string;
    tag: string;
  };
  floorNumber: number;
  isUnlocked: boolean;
  onClick: () => void;
  index: number;
}

function RoomDoor({ position, room, floorNumber, isUnlocked, onClick, index }: RoomDoorProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const colors = floorColors[floorNumber];

  useFrame((state) => {
    if (meshRef.current) {
      // Breathing effect when hovered
      if (hovered) {
        meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 4) * 0.03);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
    if (glowRef.current && isUnlocked) {
      const material = glowRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.2;
    }
  });

  return (
    <group position={position}>
      {/* Door frame with beveled edges */}
      <Box args={[1.4, 2.6, 0.4]} position={[0, 1.3, -0.2]}>
        <meshStandardMaterial color="#1a1a2e" roughness={0.6} metalness={0.3} />
      </Box>

      {/* Inner door frame accent */}
      <Box args={[1.25, 2.45, 0.35]} position={[0, 1.3, -0.15]}>
        <meshStandardMaterial color={colors.primary} roughness={0.7} />
      </Box>

      {/* Main door with gradient effect */}
      <Box
        ref={meshRef}
        args={[1.1, 2.3, 0.2]}
        position={[0, 1.15, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <meshStandardMaterial
          color={hovered ? colors.accent : (isUnlocked ? colors.secondary : "#3a3a4a")}
          roughness={0.4}
          metalness={0.2}
          emissive={hovered ? colors.glow : (isUnlocked ? colors.emissive : "#000")}
          emissiveIntensity={hovered ? 0.5 : (isUnlocked ? 0.15 : 0)}
        />
      </Box>

      {/* Door glow effect */}
      {isUnlocked && (
        <Box ref={glowRef} args={[1.15, 2.35, 0.05]} position={[0, 1.15, 0.12]}>
          <meshStandardMaterial
            color={colors.accent}
            emissive={colors.glow}
            emissiveIntensity={0.3}
            transparent
            opacity={0.3}
          />
        </Box>
      )}

      {/* Ornate door handle */}
      <group position={[0.4, 1.1, 0.15]}>
        <Sphere args={[0.06, 16, 16]}>
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
        </Sphere>
        <Cylinder args={[0.03, 0.03, 0.15, 8]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.08]}>
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
        </Cylinder>
      </group>

      {/* Room tag with glow */}
      <Text
        position={[0, 2.1, 0.15]}
        fontSize={0.28}
        color={colors.accent}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor={colors.primary}
      >
        {room.tag}
      </Text>

      {/* Hover info panel */}
      {hovered && (
        <Html position={[0, 3.2, 0]} center style={{ pointerEvents: 'auto' }}>
          <div 
            className="bg-gradient-to-b from-black/95 to-gray-900/95 text-white px-5 py-3 rounded-xl shadow-2xl border border-white/20 min-w-[180px] backdrop-blur-sm max-h-[200px] overflow-y-auto overscroll-contain"
            data-scrollable="true"
            style={{ touchAction: 'pan-y', WebkitOverflowScrolling: 'touch' }}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <p className="font-bold text-base">{room.name}</p>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              <span>{floorEmojis[floorNumber]}</span>
              Floor {floorNumber} - {floorNames[floorNumber]}
            </p>
            {!isUnlocked && (
              <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                🔒 Complete previous rooms to unlock
              </p>
            )}
            {isUnlocked && (
              <p className="text-xs text-green-400 mt-2">✨ Click to enter</p>
            )}
          </div>
        </Html>
      )}

      {/* Lock indicator with animation */}
      {!isUnlocked && (
        <Float speed={3} rotationIntensity={0.5}>
          <Sphere args={[0.12, 16, 16]} position={[0, 0.4, 0.25]}>
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
          </Sphere>
        </Float>
      )}

      {/* Particle effect for unlocked doors */}
      {isUnlocked && !isMobile && (
        <Sparkles count={10} scale={[1.5, 3, 1]} size={1.5} speed={0.3} color={colors.glow} position={[0, 1.5, 0.3]} />
      )}

      {/* Point light for unlocked rooms */}
      {isUnlocked && (
        <pointLight position={[0, 1.5, 0.8]} color={colors.glow} intensity={0.4} distance={3} />
      )}
    </group>
  );
}

interface FloorPlatformProps {
  floorNumber: number;
  yPosition: number;
  rooms: Array<{ id: string; name: string; tag: string }>;
  onRoomClick: (roomId: string) => void;
  unlockedRooms: Set<string>;
  isCurrentFloor: boolean;
}

function FloorPlatform({ floorNumber, yPosition, rooms, onRoomClick, unlockedRooms, isCurrentFloor }: FloorPlatformProps) {
  const colors = floorColors[floorNumber];
  const roomsPerRow = 5;
  const spacing = 2.8;
  const platformRef = useRef<THREE.Mesh>(null);

  // Animate platform when it's the current floor
  useFrame((state) => {
    if (platformRef.current && isCurrentFloor) {
      const material = platformRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.05 + Math.sin(state.clock.elapsedTime * 2) * 0.03;
    }
  });

  // Calculate room positions in a grid
  const roomPositions = useMemo(() => {
    return rooms.map((room, index) => {
      const row = Math.floor(index / roomsPerRow);
      const col = index % roomsPerRow;
      const x = (col - (Math.min(rooms.length, roomsPerRow) - 1) / 2) * spacing;
      const z = -row * spacing - 3;
      return { room, position: [x, 0, z] as [number, number, number], index };
    });
  }, [rooms]);

  const platformWidth = Math.max(roomsPerRow * spacing + 6, 18);
  const platformDepth = Math.ceil(rooms.length / roomsPerRow) * spacing + 8;

  return (
    <group position={[0, yPosition, 0]}>
      {/* Main floor platform with gradient */}
      <Box ref={platformRef} args={[platformWidth, 0.6, platformDepth]} position={[0, -0.3, -platformDepth / 2 + 3]}>
        <meshStandardMaterial 
          color={colors.primary} 
          roughness={0.7}
          metalness={0.1}
          emissive={colors.emissive}
          emissiveIntensity={isCurrentFloor ? 0.05 : 0}
        />
      </Box>

      {/* Floor surface with pattern */}
      <Plane args={[platformWidth - 1, platformDepth - 1]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -platformDepth / 2 + 3]}>
        <meshStandardMaterial 
          color={colors.secondary} 
          roughness={0.8}
          transparent
          opacity={0.3}
        />
      </Plane>

      {/* Glowing edge trim */}
      <Box args={[platformWidth + 0.6, 0.4, 0.4]} position={[0, 0.2, 3]}>
        <meshStandardMaterial color={colors.secondary} emissive={colors.glow} emissiveIntensity={0.2} roughness={0.4} />
      </Box>

      {/* Side trims */}
      <Box args={[0.4, 0.4, platformDepth]} position={[-platformWidth / 2, 0.2, -platformDepth / 2 + 3]}>
        <meshStandardMaterial color={colors.secondary} emissive={colors.glow} emissiveIntensity={0.1} roughness={0.4} />
      </Box>
      <Box args={[0.4, 0.4, platformDepth]} position={[platformWidth / 2, 0.2, -platformDepth / 2 + 3]}>
        <meshStandardMaterial color={colors.secondary} emissive={colors.glow} emissiveIntensity={0.1} roughness={0.4} />
      </Box>

      {/* Glow ring around floor */}
      <GlowRing radius={platformWidth / 1.8} color={colors.glow} yPosition={0} />

      {/* Floor number monument */}
      <group position={[-platformWidth / 2 - 1.5, 0, 0]}>
        <Cylinder args={[0.5, 0.6, 4, 8]} position={[0, 2, 0]}>
          <meshStandardMaterial color={colors.secondary} roughness={0.5} metalness={0.2} emissive={colors.emissive} emissiveIntensity={0.1} />
        </Cylinder>
        {/* Top cap */}
        <Sphere args={[0.6, 16, 16]} position={[0, 4.2, 0]}>
          <meshStandardMaterial color={colors.accent} emissive={colors.glow} emissiveIntensity={0.3} metalness={0.3} />
        </Sphere>
        <Text
          position={[0, 2, 0.7]}
          fontSize={0.8}
          color={colors.accent}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#000"
        >
          {floorNumber}
        </Text>
      </group>

      {/* Floor name banner */}
      <group position={[0, 0.8, 4]}>
        <Box args={[6, 1, 0.1]}>
          <meshStandardMaterial color={colors.primary} roughness={0.6} />
        </Box>
        <Text
          position={[0, 0, 0.1]}
          fontSize={0.4}
          color={colors.accent}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000"
        >
          {floorEmojis[floorNumber]} {floorNames[floorNumber]} {floorEmojis[floorNumber]}
        </Text>
      </group>

      {/* Room doors */}
      {roomPositions.map(({ room, position, index }) => (
        <RoomDoor
          key={room.id}
          position={position}
          room={room}
          floorNumber={floorNumber}
          isUnlocked={unlockedRooms.has(room.id)}
          onClick={() => onRoomClick(room.id)}
          index={index}
        />
      ))}

      {/* Floating orbs for atmosphere */}
      {!isMobile && isCurrentFloor && (
        <>
          <FloatingOrb position={[-platformWidth / 3, 3, -2]} color={colors.glow} size={0.15} speed={1.5} />
          <FloatingOrb position={[platformWidth / 3, 4, -4]} color={colors.accent} size={0.12} speed={2} />
          <FloatingOrb position={[0, 3.5, -6]} color={colors.glow} size={0.18} speed={1.2} />
        </>
      )}

      {/* Ambient floor lighting */}
      <pointLight position={[0, 5, -2]} color={colors.glow} intensity={isCurrentFloor ? 0.8 : 0.3} distance={20} />
      <pointLight position={[-5, 3, -5]} color={colors.accent} intensity={0.2} distance={10} />
      <pointLight position={[5, 3, -5]} color={colors.accent} intensity={0.2} distance={10} />
      
      {/* Sparkles for current floor */}
      {!isMobile && isCurrentFloor && (
        <Sparkles count={50} scale={[platformWidth, 6, platformDepth]} size={2} speed={0.3} color={colors.glow} position={[0, 3, -platformDepth / 2 + 3]} />
      )}
    </group>
  );
}

// Loading indicator component
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 text-white">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
          <div className="absolute inset-0 h-12 w-12 rounded-full bg-purple-500/20 animate-ping" />
        </div>
        <p className="text-sm font-medium">{progress.toFixed(0)}% loaded</p>
        <p className="text-xs text-gray-400">Preparing the Palace...</p>
      </div>
    </Html>
  );
}

// Camera controller with floor focus and smooth transitions
function CameraController({ targetFloor, onFloorChange }: { targetFloor: number; onFloorChange?: (floor: number) => void }) {
  const { camera } = useThree();
  const targetY = useRef((targetFloor - 1) * 8);
  const transitionSpeed = isMobile ? 0.04 : 0.06;

  useEffect(() => {
    targetY.current = (targetFloor - 1) * 8 + 5;
  }, [targetFloor]);

  useFrame(() => {
    const currentY = camera.position.y;
    const diff = targetY.current - currentY;
    if (Math.abs(diff) > 0.1) {
      camera.position.y += diff * transitionSpeed;
    }
  });

  return null;
}

// Swipe gesture handler for mobile floor navigation
function useSwipeGesture(onSwipeUp: () => void, onSwipeDown: () => void) {
  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    // Don't intercept if touching a scrollable element
    const target = e.target as HTMLElement;
    if (target.closest('[data-scrollable="true"]') || target.closest('.overflow-auto') || target.closest('.overflow-y-auto')) {
      touchStartY.current = null;
      return;
    }
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (touchStartY.current === null || touchStartX.current === null) return;

    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;
    const diffY = touchStartY.current - touchEndY;
    const diffX = touchStartX.current - touchEndX;
    const threshold = 50;

    // Only trigger floor change if vertical swipe is more dominant than horizontal
    if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > threshold) {
      if (diffY > 0) {
        onSwipeUp();
      } else {
        onSwipeDown();
      }
    }

    touchStartY.current = null;
    touchStartX.current = null;
  }, [onSwipeUp, onSwipeDown]);

  useEffect(() => {
    if (!isMobile) return;

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);
}

interface Palace3DViewerProps {
  unlockedRooms?: Set<string>;
  onClose?: () => void;
}

export function Palace3DViewer({ unlockedRooms = new Set(), onClose }: Palace3DViewerProps) {
  const navigate = useNavigate();
  const { translatedFloors: floors } = useTranslatedPalaceData();
  const [currentFloor, setCurrentFloor] = useState(1);
  const [showHelp, setShowHelp] = useState(true);
  const [dpr, setDpr] = useState(isMobile ? 1 : 1.5);
  const [showEffects, setShowEffects] = useState(!isMobile);

  // Swipe gesture for mobile floor navigation
  const goUp = useCallback(() => setCurrentFloor(f => Math.min(8, f + 1)), []);
  const goDown = useCallback(() => setCurrentFloor(f => Math.max(1, f - 1)), []);
  useSwipeGesture(goUp, goDown);

  // Auto-hide help after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowHelp(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleRoomClick = (roomId: string) => {
    const floor = floors.find(f => f.rooms.some(r => r.id === roomId));
    if (floor) {
      navigate(`/palace/floor/${floor.number}/room/${roomId}`);
    }
  };

  const floorSpacing = 8;
  const colors = floorColors[currentFloor];

  return (
    <div className="relative w-full h-full min-h-[600px] bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 rounded-xl overflow-hidden border border-white/10">
      {/* Floor navigation UI */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          className="bg-black/60 border-white/30 text-white hover:bg-black/80 backdrop-blur-sm"
        >
          <Home className="h-4 w-4 mr-2" /> Exit 3D
        </Button>
        {!isMobile && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEffects(!showEffects)}
            className="bg-black/60 border-white/30 text-white hover:bg-black/80 backdrop-blur-sm"
          >
            <SparklesIcon className="h-4 w-4 mr-2" /> {showEffects ? 'Simple' : 'Effects'}
          </Button>
        )}
      </div>

      {/* Floor selector */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-2 bg-black/60 backdrop-blur-sm rounded-xl p-3 border border-white/20">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentFloor(Math.min(8, currentFloor + 1))}
          disabled={currentFloor >= 8}
          className="text-white hover:bg-white/20"
        >
          <ChevronUp className="h-5 w-5" />
        </Button>

        <div className="flex flex-col gap-1.5">
          {[8, 7, 6, 5, 4, 3, 2, 1].map(floor => {
            const floorColor = floorColors[floor];
            return (
              <button
                key={floor}
                onClick={() => setCurrentFloor(floor)}
                className={`w-9 h-9 rounded-lg text-sm font-bold transition-all flex items-center justify-center ${
                  currentFloor === floor
                    ? 'scale-110 shadow-lg ring-2 ring-white/50'
                    : 'hover:scale-105'
                }`}
                style={{
                  backgroundColor: currentFloor === floor ? floorColor.accent : floorColor.primary,
                  color: currentFloor === floor ? '#000' : '#fff',
                  boxShadow: currentFloor === floor ? `0 0 20px ${floorColor.glow}` : 'none'
                }}
              >
                {floorEmojis[floor]}
              </button>
            );
          })}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentFloor(Math.max(1, currentFloor - 1))}
          disabled={currentFloor <= 1}
          className="text-white hover:bg-white/20"
        >
          <ChevronDown className="h-5 w-5" />
        </Button>
      </div>

      {/* Current floor info */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        <div 
          className="px-6 py-3 rounded-xl backdrop-blur-sm border border-white/20 flex items-center gap-3 shadow-2xl"
          style={{ 
            backgroundColor: `${colors.primary}dd`,
            boxShadow: `0 0 30px ${colors.glow}40`
          }}
        >
          <span className="text-2xl">{floorEmojis[currentFloor]}</span>
          <div>
            <p className="text-white font-bold text-lg">Floor {currentFloor}</p>
            <p className="text-white/80 text-sm">{floorNames[currentFloor]}</p>
          </div>
        </div>
      </div>

      {/* Help tooltip */}
      {showHelp && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 bg-black/90 backdrop-blur-sm text-white px-5 py-4 rounded-xl max-w-sm text-center border border-white/20 shadow-2xl">
          {isMobile ? (
            <>
              <p className="text-sm font-semibold flex items-center justify-center gap-2 mb-2">
                <Smartphone className="h-4 w-4" /> Mobile Controls
              </p>
              <div className="text-sm space-y-1 text-gray-300">
                <p>👆 Pinch to zoom</p>
                <p>👋 Drag to look around</p>
                <p>⬆️ Swipe up/down to change floors</p>
                <p>👆 Tap doors to enter rooms</p>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold flex items-center justify-center gap-2 mb-2">
                <Monitor className="h-4 w-4" /> Desktop Controls
              </p>
              <div className="text-sm space-y-1 text-gray-300">
                <p>🖱️ Drag to look around</p>
                <p>📜 Scroll to zoom</p>
                <p>🚪 Click doors to enter rooms</p>
                <p>🔢 Use floor buttons to navigate</p>
              </div>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHelp(false)}
            className="mt-3 text-xs text-gray-400 hover:text-white"
          >
            Got it ✓
          </Button>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas
        shadows={!isMobile}
        camera={{ fov: 60, position: [18, 10, 25] }}
        dpr={dpr}
        performance={{ min: 0.5 }}
      >
        <PerformanceMonitor
          onDecline={() => {
            setDpr(1);
            setShowEffects(false);
          }}
          onIncline={() => setDpr(isMobile ? 1 : 1.5)}
        />
        <Suspense fallback={<Loader />}>
          <CameraController targetFloor={currentFloor} />

          {/* Dynamic background based on floor */}
          <color attach="background" args={[colors.primary]} />
          <fog attach="fog" args={[colors.primary, 30, 100]} />
          
          {/* Stars with floor-based color */}
          <Stars 
            radius={100} 
            depth={50} 
            count={isMobile ? 800 : 2500} 
            factor={4} 
            saturation={0.5} 
            fade 
            speed={0.5}
          />

          {/* Clouds for atmosphere */}
          {showEffects && !isMobile && (
            <>
              <Cloud position={[-20, 40, -30]} speed={0.2} opacity={0.3} color={colors.glow} />
              <Cloud position={[25, 50, -40]} speed={0.3} opacity={0.2} color={colors.accent} />
            </>
          )}

          {/* Lighting */}
          <ambientLight intensity={0.25} />
          <directionalLight 
            position={[15, 60, 15]} 
            intensity={0.6} 
            castShadow 
            shadow-mapSize={[1024, 1024]}
            color={colors.accent}
          />
          <pointLight position={[0, 30, 0]} intensity={0.3} color={colors.glow} />

          {/* Palace floors */}
          {floors.map((floor) => (
            <FloorPlatform
              key={floor.number}
              floorNumber={floor.number}
              yPosition={(floor.number - 1) * floorSpacing}
              rooms={floor.rooms.map(r => ({ id: r.id, name: r.name, tag: r.tag }))}
              onRoomClick={handleRoomClick}
              unlockedRooms={unlockedRooms}
              isCurrentFloor={floor.number === currentFloor}
            />
          ))}

          {/* Central energy pillars connecting floors */}
          <EnergyPillar 
            position={[10, 4 * floorSpacing - 4, -8]} 
            height={8 * floorSpacing} 
            color={colors.glow} 
          />
          <EnergyPillar 
            position={[-10, 4 * floorSpacing - 4, -8]} 
            height={8 * floorSpacing} 
            color={colors.accent} 
          />

          {/* Floating center piece */}
          <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
            <group position={[0, (currentFloor - 1) * floorSpacing + 6, -5]}>
              <Sphere args={[0.8, 32, 32]}>
                <meshStandardMaterial 
                  color={colors.glow} 
                  emissive={colors.glow} 
                  emissiveIntensity={0.6}
                  transparent
                  opacity={0.8}
                />
              </Sphere>
              {showEffects && (
                <Sparkles count={20} scale={3} size={3} speed={0.5} color={colors.accent} />
              )}
            </group>
          </Float>

          {/* Camera controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            minDistance={10}
            maxDistance={60}
            minPolarAngle={Math.PI / 8}
            maxPolarAngle={Math.PI / 2.1}
            target={[0, (currentFloor - 1) * floorSpacing + 3, -5]}
            rotateSpeed={0.5}
            zoomSpeed={0.8}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
