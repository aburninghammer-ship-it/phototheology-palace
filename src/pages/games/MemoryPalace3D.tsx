import { useState, useEffect, useRef, Suspense } from "react";
import { FloatingGameChat } from "@/components/games/FloatingGameChat";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Text,
  Html,
  Box,
  Plane,
  Cylinder,
  Sphere,
  Stars
} from "@react-three/drei";
import * as THREE from "three";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Home, MapPin, Trophy, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface PalaceLocation {
  id: string;
  verse_reference: string;
  verse_text: string;
  location_name: string;
  visualization: string;
  order_index: number;
}

// 3D Room component for each location
interface Room3DProps {
  location: PalaceLocation;
  roomIndex: number;
  isActive: boolean;
  isVisited: boolean;
  showVerse: boolean;
  totalRooms: number;
}

function Room3D({ location, roomIndex, isActive, isVisited, showVerse, totalRooms }: Room3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Position rooms in a circular path
  const angle = (roomIndex / totalRooms) * Math.PI * 2;
  const radius = 8;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  // Room glow animation
  useFrame((state) => {
    if (groupRef.current && isActive) {
      groupRef.current.position.y = 0.1 * Math.sin(state.clock.elapsedTime * 2);
    }
  });

  const getBaseColor = () => {
    if (isActive) return "#8b5cf6"; // Purple for active
    if (isVisited) return "#22c55e"; // Green for visited
    return "#6b7280"; // Gray for unvisited
  };

  return (
    <group ref={groupRef} position={[x, 0, z]}>
      {/* Room platform - thicker and more substantial */}
      <Cylinder args={[2, 2.3, 0.5, 8]} position={[0, 0.25, 0]}>
        <meshStandardMaterial
          color={getBaseColor()}
          roughness={0.5}
          metalness={0.2}
          emissive={isActive ? "#8b5cf6" : "#000000"}
          emissiveIntensity={isActive ? 0.3 : 0}
        />
      </Cylinder>
      {/* Platform edge trim */}
      <Cylinder args={[2.05, 2.35, 0.12, 8]} position={[0, 0.06, 0]}>
        <meshStandardMaterial color="#d4af37" metalness={0.5} roughness={0.4} />
      </Cylinder>

      {/* Room pillars - thicker and more proportional */}
      {[0, 1, 2, 3].map((i) => {
        const pillarAngle = (i / 4) * Math.PI * 2;
        const px = Math.sin(pillarAngle) * 1.7;
        const pz = Math.cos(pillarAngle) * 1.7;
        return (
          <group key={i} position={[px, 1.5, pz]}>
            {/* Pillar base */}
            <Cylinder args={[0.25, 0.28, 0.2, 12]} position={[0, -1.15, 0]}>
              <meshStandardMaterial color="#d4af37" metalness={0.6} roughness={0.3} />
            </Cylinder>
            {/* Main pillar shaft - thicker */}
            <Cylinder args={[0.2, 0.23, 2.3, 12]}>
              <meshStandardMaterial color="#d4af37" metalness={0.6} roughness={0.3} />
            </Cylinder>
            {/* Pillar cap - thicker */}
            <Box args={[0.5, 0.2, 0.5]} position={[0, 1.25, 0]}>
              <meshStandardMaterial color="#d4af37" metalness={0.6} roughness={0.3} />
            </Box>
          </group>
        );
      })}

      {/* Room number marker */}
      <group position={[0, 0.5, 0]}>
        <Sphere args={[0.4, 16, 16]}>
          <meshStandardMaterial
            color={isActive ? "#fbbf24" : isVisited ? "#22c55e" : "#9ca3af"}
            emissive={isActive ? "#fbbf24" : "#000000"}
            emissiveIntensity={isActive ? 0.5 : 0}
          />
        </Sphere>
        <Text
          position={[0, 0, 0.45]}
          fontSize={0.3}
          color="#000000"
          anchorX="center"
          anchorY="middle"
        >
          {roomIndex + 1}
        </Text>
      </group>

      {/* Floating scroll for the verse - thicker and more visible */}
      {isActive && (
        <group position={[0, 2.4, 0]}>
          {/* Scroll body */}
          <Cylinder args={[0.15, 0.15, 0.8, 12]} rotation={[0, 0, Math.PI / 2]}>
            <meshStandardMaterial color="#f5deb3" roughness={0.6} />
          </Cylinder>
          {/* Scroll end caps - thicker */}
          <Cylinder args={[0.2, 0.2, 0.12, 12]} position={[-0.46, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <meshStandardMaterial color="#8B4513" roughness={0.5} />
          </Cylinder>
          <Cylinder args={[0.2, 0.2, 0.12, 12]} position={[0.46, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <meshStandardMaterial color="#8B4513" roughness={0.5} />
          </Cylinder>
        </group>
      )}

      {/* Light for active room */}
      {isActive && (
        <pointLight position={[0, 3, 0]} color="#8b5cf6" intensity={1} distance={6} />
      )}

      {/* Location label */}
      <Html position={[0, 3.5, 0]} center distanceFactor={10}>
        <div className={`px-3 py-2 rounded-lg text-center whitespace-nowrap transition-all ${
          isActive
            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
            : isVisited
              ? 'bg-green-600/80 text-white'
              : 'bg-gray-700/80 text-gray-300'
        }`}>
          <div className="flex items-center gap-2">
            <MapPin className="h-3 w-3" />
            <span className="text-sm font-medium">{location.location_name}</span>
          </div>
        </div>
      </Html>
    </group>
  );
}

// Central monument
function CentralMonument({ progress }: { progress: number }) {
  const monumentRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (monumentRef.current) {
      monumentRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={monumentRef} position={[0, 0, 0]}>
      {/* Base - thicker and more substantial */}
      <Cylinder args={[1.8, 2.2, 0.7, 8]} position={[0, 0.35, 0]}>
        <meshStandardMaterial color="#1a1a2e" metalness={0.5} roughness={0.3} />
      </Cylinder>
      {/* Base decorative ring */}
      <Cylinder args={[1.9, 2.3, 0.15, 8]} position={[0, 0.08, 0]}>
        <meshStandardMaterial color="#d4af37" metalness={0.6} roughness={0.3} />
      </Cylinder>

      {/* Progress pillar - thicker */}
      <Cylinder args={[0.5, 0.5, progress * 4, 16]} position={[0, progress * 2 + 0.7, 0]}>
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </Cylinder>
      {/* Inner glow pillar */}
      <Cylinder args={[0.35, 0.35, progress * 4, 16]} position={[0, progress * 2 + 0.7, 0]}>
        <meshStandardMaterial
          color="#a78bfa"
          emissive="#a78bfa"
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
        />
      </Cylinder>

      {/* Crown */}
      {progress >= 1 && (
        <group position={[0, 4.7, 0]}>
          <Sphere args={[0.6, 16, 16]}>
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#fbbf24"
              emissiveIntensity={1}
            />
          </Sphere>
          <pointLight color="#fbbf24" intensity={2} distance={8} />
        </group>
      )}

      {/* Floating percentage */}
      <Html position={[0, 1.5, 0]} center>
        <div className="bg-black/80 px-3 py-1 rounded-full text-white text-sm font-bold">
          {Math.round(progress * 100)}%
        </div>
      </Html>
    </group>
  );
}

// Path connecting rooms
function PathConnector({ roomCount }: { roomCount: number }) {
  const points: THREE.Vector3[] = [];
  const segments = 64;

  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const radius = 8;
    points.push(new THREE.Vector3(
      Math.sin(angle) * radius,
      0.02,
      Math.cos(angle) * radius
    ));
  }

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#8b5cf6" linewidth={2} transparent opacity={0.5} />
    </line>
  );
}

// Camera controller that focuses on active room
function CameraFocus({ activeIndex, totalRooms }: { activeIndex: number; totalRooms: number }) {
  const { camera } = useThree();

  useEffect(() => {
    const angle = (activeIndex / totalRooms) * Math.PI * 2;
    const radius = 8;
    const targetX = Math.sin(angle) * radius;
    const targetZ = Math.cos(angle) * radius;

    // Position camera to look at active room
    const camRadius = 14;
    const camAngle = angle + Math.PI * 0.15; // Slightly offset
    camera.position.set(
      Math.sin(camAngle) * camRadius,
      6,
      Math.cos(camAngle) * camRadius
    );
    camera.lookAt(targetX, 1, targetZ);
  }, [activeIndex, totalRooms, camera]);

  return null;
}

// Main 3D Scene
interface Palace3DSceneProps {
  locations: PalaceLocation[];
  currentIndex: number;
  visitedRooms: Set<number>;
  showVerse: boolean;
}

function Palace3DScene({ locations, currentIndex, visitedRooms, showVerse }: Palace3DSceneProps) {
  const progress = visitedRooms.size / locations.length;

  return (
    <>
      {/* Starry sky */}
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

      {/* Ground */}
      <Plane args={[50, 50]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1a1a2e" roughness={0.9} />
      </Plane>

      {/* Circular path */}
      <PathConnector roomCount={locations.length} />

      {/* Central progress monument */}
      <CentralMonument progress={progress} />

      {/* Room locations */}
      {locations.map((location, index) => (
        <Room3D
          key={location.id}
          location={location}
          roomIndex={index}
          isActive={index === currentIndex}
          isVisited={visitedRooms.has(index)}
          showVerse={showVerse && index === currentIndex}
          totalRooms={locations.length}
        />
      ))}

      {/* Camera focus */}
      <CameraFocus activeIndex={currentIndex} totalRooms={locations.length} />

      {/* Lighting */}
      <ambientLight intensity={0.3} color="#9ca3af" />
      <directionalLight position={[10, 20, 10]} intensity={0.5} color="#ffffff" />
      <hemisphereLight args={['#4a00e0', '#1a1a2e', 0.4]} />
    </>
  );
}

// Main component
export default function MemoryPalace3D() {
  const { listId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [locations, setLocations] = useState<PalaceLocation[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showVerse, setShowVerse] = useState(false);
  const [visitedRooms, setVisitedRooms] = useState<Set<number>>(new Set());
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPalace();
  }, [listId]);

  const loadPalace = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data, error } = await (supabase as any)
      .from("memory_palace_locations")
      .select("*")
      .eq("user_id", user.id)
      .eq("list_id", listId)
      .order("order_index");

    if (error) {
      toast.error(t('games.memoryPalace.failedToLoad'));
      navigate("/memory");
      return;
    }

    if (!data || data.length === 0) {
      toast.error(t('games.memoryPalace.noPalaceFound'));
      navigate(`/memory/palace-builder/${listId}`);
      return;
    }

    setLocations(data);
    setLoading(false);
  };

  const handleNext = () => {
    // Mark current as visited
    setVisitedRooms(prev => new Set([...prev, currentIndex]));

    if (currentIndex < locations.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowVerse(false);
    } else {
      // All rooms visited
      setVisitedRooms(prev => new Set([...prev, currentIndex]));
      setCompleted(true);
      toast.success(t('games.memoryPalace.walkComplete'));
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowVerse(false);
    }
  };

  const handleRoomClick = (index: number) => {
    setCurrentIndex(index);
    setShowVerse(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <Sparkles className="h-12 w-12 mx-auto mb-4 animate-pulse text-purple-400" />
          <p className="text-lg">{t('games.memoryPalace.loading')}</p>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-purple-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-slate-800/90 border-purple-500/30 text-white">
          <CardContent className="pt-6 space-y-6 text-center">
            <div className="text-6xl">🏛️</div>
            <h2 className="text-2xl font-bold text-purple-300">{t('games.memoryPalace.walkComplete')}</h2>
            <p className="text-gray-300">
              {t('games.memoryPalace.walkedThroughAll', { count: locations.length })}
            </p>

            <div className="bg-purple-900/50 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2 text-yellow-400">
                <Trophy className="h-5 w-5" />
                <span className="font-bold">{t('games.memoryPalace.roomsVisited', { visited: locations.length, total: locations.length })}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => navigate("/memory")}
                variant="outline"
                className="flex-1 border-white/30 text-white hover:bg-white/10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('games.memoryPalace.backToLists')}
              </Button>
              <Button
                onClick={() => {
                  setCurrentIndex(0);
                  setShowVerse(false);
                  setVisitedRooms(new Set());
                  setCompleted(false);
                }}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {t('games.memoryPalace.walkAgain')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentLocation = locations[currentIndex];

  return (
    <div className="min-h-screen bg-slate-900 relative">
      {/* 3D Canvas */}
      <Canvas shadows camera={{ fov: 60, position: [0, 8, 14] }}>
        <Suspense fallback={null}>
          <Palace3DScene
            locations={locations}
            currentIndex={currentIndex}
            visitedRooms={visitedRooms}
            showVerse={showVerse}
          />
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={8}
            maxDistance={25}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.5}
          />
        </Suspense>
      </Canvas>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/memory")}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> {t('games.memoryPalace.exitPalace')}
          </Button>

          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-purple-400 border-purple-400/30">
              <Home className="h-3 w-3 mr-1" /> {currentIndex + 1} / {locations.length}
            </Badge>
            <Badge variant="outline" className="text-green-400 border-green-400/30">
              <Trophy className="h-3 w-3 mr-1" /> {t('games.memoryPalace.visitedCount', { count: visitedRooms.size })}
            </Badge>
          </div>
        </div>
      </div>

      {/* Bottom panel - Current location info */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <Card className="max-w-2xl mx-auto bg-black/80 backdrop-blur-md border-purple-500/30 text-white">
          <CardContent className="p-4 space-y-4">
            {/* Location header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-purple-300 uppercase tracking-wide">{t('games.memoryPalace.currentLocation')}</p>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-purple-400" />
                  {currentLocation.location_name}
                </h3>
              </div>
              <Badge className="bg-purple-600">{t('games.memoryPalace.roomNumber', { number: currentIndex + 1 })}</Badge>
            </div>

            {/* Visualization */}
            <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-500/20">
              <p className="text-xs text-purple-300 mb-1">{t('games.memoryPalace.yourVisualization')}:</p>
              <p className="text-sm text-gray-200">{currentLocation.visualization}</p>
            </div>

            {/* Verse reveal section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-purple-300">{t('games.memoryPalace.theVerse')}:</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowVerse(!showVerse)}
                  className="text-purple-300 hover:text-white hover:bg-purple-600/30"
                >
                  {showVerse ? (
                    <>
                      <EyeOff className="mr-2 h-4 w-4" />
                      {t('games.memoryPalace.hide')}
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      {t('games.memoryPalace.reveal')}
                    </>
                  )}
                </Button>
              </div>

              {showVerse ? (
                <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-lg p-4 border border-purple-400/30 animate-in fade-in-50 duration-300">
                  <p className="font-semibold text-purple-300">{currentLocation.verse_reference}</p>
                  <p className="text-sm mt-1 text-gray-200">{currentLocation.verse_text}</p>
                </div>
              ) : (
                <div className="bg-gray-800/50 rounded-lg p-4 border-2 border-dashed border-gray-600/50">
                  <p className="text-center text-sm text-gray-400">
                    {t('games.memoryPalace.recallVerse')}
                  </p>
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                variant="outline"
                className="flex-1 border-white/30 text-white hover:bg-white/10 disabled:opacity-30"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('games.common.previous')}
              </Button>
              <Button
                onClick={handleNext}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {currentIndex < locations.length - 1 ? (
                  <>
                    {t('games.memoryPalace.nextRoom')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    {t('games.memoryPalace.completeWalk')}
                    <Trophy className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Room selector (mini-map) */}
      <div className="absolute top-20 right-4 z-10">
        <Card className="bg-black/70 backdrop-blur-sm border-purple-500/30 p-2">
          <div className="flex flex-wrap gap-1 max-w-[120px]">
            {locations.map((_, index) => (
              <button
                key={index}
                onClick={() => handleRoomClick(index)}
                className={`w-6 h-6 rounded-full text-xs font-bold transition-all ${
                  index === currentIndex
                    ? 'bg-purple-600 text-white scale-110'
                    : visitedRooms.has(index)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Controls help */}
      <div className="absolute bottom-4 left-4 z-10 hidden md:block">
        <Card className="bg-black/50 border-white/10 text-white/70 text-xs p-2">
          <p>{t('games.memoryPalace.controlsHelp')}</p>
        </Card>
      </div>
      <FloatingGameChat gameType="memory-palace-3d" />
    </div>
  );
}
