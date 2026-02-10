import { useState, useRef, Suspense, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, Stars, Float, RoundedBox, Sparkles as DreiSparkles, MeshDistortMaterial, GradientTexture, Environment } from "@react-three/drei";
import * as THREE from "three";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Film, ChevronLeft, ChevronRight, Info, Sparkles } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// ============ GENESIS 1-24 CHAPTER IMAGES ============
// Each chapter has ONE memorable visual trigger image

interface ChapterFrame {
  chapter: number;
  title: string;
  image: string; // Emoji/icon representation
  description: string;
  memoryTrigger: string;
  color: string;
}

const GENESIS_FRAMES: ChapterFrame[] = [
  {
    chapter: 1,
    title: "Creation",
    image: "🎂🌍",
    description: "God creates heavens and earth in 6 days",
    memoryTrigger: "Birthday cake with 'Earth' candles - celebrating creation's birthday!",
    color: "#4ade80"
  },
  {
    chapter: 2,
    title: "Garden & Marriage",
    image: "🌳💍",
    description: "Garden of Eden, Adam names animals, Eve created",
    memoryTrigger: "Wedding ring hanging on the Tree of Life",
    color: "#22c55e"
  },
  {
    chapter: 3,
    title: "The Fall",
    image: "🐍🍎⏰",
    description: "Serpent tempts, sin enters, curse pronounced",
    memoryTrigger: "Snake coiled around apple with ticking clock - time's up for innocence!",
    color: "#ef4444"
  },
  {
    chapter: 4,
    title: "Cain & Abel",
    image: "🩸🌾",
    description: "Two brothers, two offerings, first murder",
    memoryTrigger: "Blood dripping onto wheat sheaves",
    color: "#dc2626"
  },
  {
    chapter: 5,
    title: "Genealogy to Noah",
    image: "📜👴969",
    description: "Adam to Noah, Methuselah lives 969 years",
    memoryTrigger: "Ancient scroll with '969' in giant numbers",
    color: "#a78bfa"
  },
  {
    chapter: 6,
    title: "Wickedness & Ark Plans",
    image: "📐🚢😈",
    description: "Earth corrupt, God plans flood, Noah finds grace",
    memoryTrigger: "Blueprint/architect drawing of boat with demons fleeing",
    color: "#8b5cf6"
  },
  {
    chapter: 7,
    title: "The Flood Begins",
    image: "🌊🚪2️⃣",
    description: "Animals enter ark, 40 days rain",
    memoryTrigger: "Massive door with pairs of animals lined up, water rising",
    color: "#3b82f6"
  },
  {
    chapter: 8,
    title: "Waters Recede",
    image: "🕊️🫒",
    description: "Dove returns with olive branch",
    memoryTrigger: "White dove carrying green olive branch against rainbow sky",
    color: "#06b6d4"
  },
  {
    chapter: 9,
    title: "Rainbow Covenant",
    image: "🌈🍷",
    description: "God's promise, Noah's vineyard, Ham's sin",
    memoryTrigger: "Rainbow arching over wine barrel",
    color: "#f97316"
  },
  {
    chapter: 10,
    title: "Table of Nations",
    image: "🗺️👨‍👩‍👧‍👦70",
    description: "70 nations from Noah's sons",
    memoryTrigger: "World map with 70 flags sprouting from it",
    color: "#eab308"
  },
  {
    chapter: 11,
    title: "Tower of Babel",
    image: "🗼👅❓",
    description: "One language scattered, tower abandoned",
    memoryTrigger: "Half-built tower with confused speech bubbles",
    color: "#f59e0b"
  },
  {
    chapter: 12,
    title: "Abram's Call",
    image: "🎒⭐🏃",
    description: "Leave Ur, go to unknown land, great nation promise",
    memoryTrigger: "Backpack with star compass pointing forward",
    color: "#c9a227"
  },
  {
    chapter: 13,
    title: "Abram & Lot Separate",
    image: "⬅️➡️🏙️",
    description: "Lot chooses Sodom, Abram stays",
    memoryTrigger: "Fork in road - one path to glittering city, one to tents",
    color: "#84cc16"
  },
  {
    chapter: 14,
    title: "War & Melchizedek",
    image: "⚔️🍞🍷👑",
    description: "Rescue Lot, mysterious king-priest blesses",
    memoryTrigger: "Sword crossed with bread and wine chalice, crown floating above",
    color: "#7c3aed"
  },
  {
    chapter: 15,
    title: "Covenant of Stars",
    image: "⭐✂️🔥",
    description: "Count the stars, animal covenant, smoking furnace",
    memoryTrigger: "Night sky with stars and flaming torch passing through cut animals",
    color: "#1e3a5f"
  },
  {
    chapter: 16,
    title: "Hagar & Ishmael",
    image: "👁️💧🏜️",
    description: "Sarai's plan, Hagar flees, 'God who sees'",
    memoryTrigger: "Giant eye over desert well with pregnant woman",
    color: "#d97706"
  },
  {
    chapter: 17,
    title: "Circumcision Covenant",
    image: "✂️99💯",
    description: "New names, circumcision sign, Isaac promised at 100",
    memoryTrigger: "Scissors with numbers 99 and 100",
    color: "#be185d"
  },
  {
    chapter: 18,
    title: "Three Visitors",
    image: "👤👤👤🤰😂",
    description: "Angels visit, Sarah laughs, Sodom's fate discussed",
    memoryTrigger: "Three mysterious figures at tent, woman laughing behind door",
    color: "#0891b2"
  },
  {
    chapter: 19,
    title: "Sodom Destroyed",
    image: "🔥🧂👩",
    description: "Fire rains, Lot escapes, wife becomes salt pillar",
    memoryTrigger: "Salt pillar shaped like woman looking back at fire",
    color: "#991b1b"
  },
  {
    chapter: 20,
    title: "Abraham & Abimelech",
    image: "👑💭😴🚫",
    description: "Sister lie again, king's dream warning",
    memoryTrigger: "King sleeping with warning dream bubble",
    color: "#6366f1"
  },
  {
    chapter: 21,
    title: "Isaac Born, Ishmael Sent",
    image: "👶😂🏜️💧",
    description: "Laughter fulfilled, Hagar sent away, well provided",
    memoryTrigger: "Laughing baby next to desert water bottle",
    color: "#10b981"
  },
  {
    chapter: 22,
    title: "Sacrifice of Isaac",
    image: "🔪🐏⛰️",
    description: "Mount Moriah, knife raised, ram provided",
    memoryTrigger: "Knife suspended over altar, ram caught in bush",
    color: "#b91c1c"
  },
  {
    chapter: 23,
    title: "Sarah Dies",
    image: "⚰️💰🕳️",
    description: "Sarah dies at 127, cave purchased for burial",
    memoryTrigger: "Cave entrance with coins/silver being counted",
    color: "#4b5563"
  },
  {
    chapter: 24,
    title: "Bride for Isaac",
    image: "🐫💍🏺",
    description: "Servant's journey, Rebekah at well, divine match",
    memoryTrigger: "Camel caravan with engagement ring around water pitcher",
    color: "#ec4899"
  },
];

// ============ 3D COMPONENTS ============

// Animated cosmic background orb
function CosmicBackground() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.05;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <mesh ref={meshRef} position={[50, 0, -80]} scale={[80, 80, 80]}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial
        color="#1a0a2e"
        distort={0.3}
        speed={1.5}
        roughness={1}
      >
        <GradientTexture
          stops={[0, 0.3, 0.6, 1]}
          colors={['#0f0520', '#1a0a2e', '#2d1b4e', '#0a0a1a']}
        />
      </MeshDistortMaterial>
    </mesh>
  );
}

// Floating particles around active frame
function ActiveFrameParticles({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      <DreiSparkles
        count={50}
        scale={[6, 8, 4]}
        size={3}
        speed={0.4}
        color={color}
        opacity={0.8}
      />
      {/* Outer glowing ring - thicker tube */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -5]}>
        <torusGeometry args={[3.5, 0.15, 16, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
      {/* Inner accent ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -5]}>
        <torusGeometry args={[3.2, 0.08, 16, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// Reflective floor
function ReflectiveFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[55, -6, -5]} receiveShadow>
      <planeGeometry args={[150, 30]} />
      <meshStandardMaterial
        color="#0a0a0a"
        metalness={0.9}
        roughness={0.1}
        envMapIntensity={0.5}
      />
    </mesh>
  );
}

// Animated light beams
function LightBeams() {
  const beamRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (beamRef.current) {
      beamRef.current.children.forEach((child, i) => {
        child.position.y = Math.sin(state.clock.elapsedTime * 0.5 + i * 0.5) * 0.5;
      });
    }
  });

  return (
    <group ref={beamRef}>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[i * 25, 10, -20]} rotation={[0.3, 0, 0]}>
          <coneGeometry args={[3, 20, 32, 1, true]} />
          <meshBasicMaterial
            color="#ffd700"
            transparent
            opacity={0.03}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

function CameraController({ targetChapter }: { targetChapter: number }) {
  const { camera } = useThree();
  const targetX = (targetChapter - 1) * 5;

  useFrame(() => {
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.lookAt(camera.position.x, 0, -5);
  });

  return null;
}

// Film strip rail
function FilmStrip() {
  return (
    <group>
      {/* Top rail - thicker and more substantial */}
      <mesh position={[55, 4, -5]}>
        <boxGeometry args={[130, 0.5, 0.7]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Top rail accent strip */}
      <mesh position={[55, 3.6, -4.6]}>
        <boxGeometry args={[130, 0.15, 0.15]} />
        <meshStandardMaterial color="#333333" metalness={0.6} />
      </mesh>
      {/* Bottom rail - thicker */}
      <mesh position={[55, -4, -5]}>
        <boxGeometry args={[130, 0.5, 0.7]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Bottom rail accent strip */}
      <mesh position={[55, -3.6, -4.6]}>
        <boxGeometry args={[130, 0.15, 0.15]} />
        <meshStandardMaterial color="#333333" metalness={0.6} />
      </mesh>
      {/* Sprocket holes - larger and more visible */}
      {Array.from({ length: 50 }).map((_, i) => (
        <group key={i}>
          <mesh position={[i * 2.5 - 2, 3.5, -4.5]}>
            <boxGeometry args={[0.5, 0.7, 0.4]} />
            <meshStandardMaterial color="#0a0a0a" />
          </mesh>
          <mesh position={[i * 2.5 - 2, -3.5, -4.5]}>
            <boxGeometry args={[0.5, 0.7, 0.4]} />
            <meshStandardMaterial color="#0a0a0a" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Individual chapter frame
interface FrameProps {
  frame: ChapterFrame;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

function ChapterFrameCard({ frame, index, isActive, onClick }: FrameProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const xPos = index * 5;

  useFrame((state) => {
    if (meshRef.current) {
      // Dramatic floating for active frame
      if (isActive) {
        meshRef.current.position.z = -5 + Math.sin(state.clock.elapsedTime * 2) * 0.15;
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
      }
      // Scale on hover
      const targetScale = hovered ? 1.08 : isActive ? 1.15 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, 1), 0.1);
    }
    // Animate glow ring
    if (glowRef.current && isActive) {
      glowRef.current.rotation.z = state.clock.elapsedTime * 0.5;
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      glowRef.current.scale.set(pulse, pulse, 1);
    }
  });

  return (
    <group position={[xPos, 0, 0]}>
      {/* Outer glow ring for active frame */}
      {isActive && (
        <mesh ref={glowRef} position={[0, 0, -5.2]}>
          <ringGeometry args={[2.8, 3.2, 64]} />
          <meshBasicMaterial color={frame.color} transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Frame backing with gradient effect */}
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
        position={[0, 0, -5]}
        castShadow
      >
        <RoundedBox args={[4, 5.5, 0.3]} radius={0.15}>
          <meshStandardMaterial
            color={isActive ? frame.color : hovered ? "#3a3a3a" : "#2a2a2a"}
            metalness={isActive ? 0.6 : 0.3}
            roughness={isActive ? 0.3 : 0.7}
            emissive={isActive ? frame.color : hovered ? frame.color : "#000000"}
            emissiveIntensity={isActive ? 0.5 : hovered ? 0.15 : 0}
          />
        </RoundedBox>
      </mesh>

      {/* Decorative corner accents */}
      {isActive && (
        <>
          <mesh position={[-1.7, 2.4, -4.7]}>
            <boxGeometry args={[0.4, 0.1, 0.1]} />
            <meshBasicMaterial color={frame.color} />
          </mesh>
          <mesh position={[-1.85, 2.25, -4.7]}>
            <boxGeometry args={[0.1, 0.4, 0.1]} />
            <meshBasicMaterial color={frame.color} />
          </mesh>
          <mesh position={[1.7, 2.4, -4.7]}>
            <boxGeometry args={[0.4, 0.1, 0.1]} />
            <meshBasicMaterial color={frame.color} />
          </mesh>
          <mesh position={[1.85, 2.25, -4.7]}>
            <boxGeometry args={[0.1, 0.4, 0.1]} />
            <meshBasicMaterial color={frame.color} />
          </mesh>
        </>
      )}

      {/* Chapter number badge with glow */}
      <Html position={[-1.5, 2.2, -4.7]} center>
        <div
          style={{
            background: `linear-gradient(135deg, ${frame.color}, ${frame.color}dd)`,
            color: 'white',
            padding: '6px 14px',
            borderRadius: '14px',
            fontSize: '15px',
            fontWeight: 'bold',
            boxShadow: isActive ? `0 0 20px ${frame.color}80, 0 4px 12px rgba(0,0,0,0.4)` : '0 2px 8px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.2)',
            transform: isActive ? 'scale(1.1)' : 'scale(1)',
            transition: 'all 0.3s ease',
          }}
        >
          Ch. {frame.chapter}
        </div>
      </Html>

      {/* Main image/emoji display with enhanced effects */}
      <Html position={[0, 0.3, -4.7]} center>
        <div
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          style={{
            fontSize: isActive ? '72px' : '52px',
            cursor: 'pointer',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: isActive ? 'drop-shadow(0 0 20px rgba(255,255,255,0.6))' : 'grayscale(40%) brightness(0.8)',
            textShadow: isActive ? `0 0 30px ${frame.color}, 0 0 60px ${frame.color}50` : 'none',
            transform: isActive ? 'translateY(-5px)' : 'translateY(0)',
          }}
        >
          {frame.image}
        </div>
      </Html>

      {/* Chapter title with better styling */}
      <Html position={[0, -1.8, -4.7]} center>
        <div
          style={{
            color: isActive ? '#ffffff' : '#aaaaaa',
            fontSize: isActive ? '16px' : '14px',
            fontWeight: 'bold',
            textAlign: 'center',
            maxWidth: '130px',
            textShadow: isActive ? `0 0 10px ${frame.color}, 0 2px 4px rgba(0,0,0,0.8)` : '0 2px 4px rgba(0,0,0,0.5)',
            transition: 'all 0.3s ease',
            letterSpacing: isActive ? '0.5px' : '0',
          }}
        >
          {frame.title}
        </div>
      </Html>

      {/* Enhanced lighting for active frame */}
      {isActive && (
        <>
          <pointLight position={[0, 0, -2]} intensity={2} color={frame.color} distance={10} />
          <pointLight position={[0, 3, -3]} intensity={0.8} color="#ffffff" distance={6} />
          <spotLight
            position={[0, 5, 2]}
            angle={0.4}
            penumbra={0.8}
            intensity={1.5}
            color={frame.color}
            target-position={[0, 0, -5]}
            castShadow
          />
        </>
      )}
    </group>
  );
}

// Projector light beam effect
function ProjectorBeam({ targetX }: { targetX: number }) {
  return (
    <group position={[targetX, 8, 5]}>
      <spotLight
        position={[0, 0, 0]}
        target-position={[0, -8, -10]}
        angle={0.3}
        penumbra={0.5}
        intensity={2}
        color="#ffd700"
        castShadow
      />
      {/* Projector housing */}
      <mesh>
        <boxGeometry args={[1.5, 1, 2]} />
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Lens */}
      <mesh position={[0, -0.3, 0.8]}>
        <cylinderGeometry args={[0.3, 0.4, 0.3]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.8} emissive="#ffd700" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

// Info panel for active chapter
function InfoPanel({ frame, visible }: { frame: ChapterFrame; visible: boolean }) {
  const { t } = useTranslation();
  if (!visible) return null;

  return (
    <Html position={[0, -6, 0]} center>
      <div
        style={{
          background: 'rgba(0,0,0,0.9)',
          border: `2px solid ${frame.color}`,
          borderRadius: '16px',
          padding: '20px',
          maxWidth: '400px',
          color: 'white',
          textAlign: 'center',
          boxShadow: `0 0 30px ${frame.color}40`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
          <Film style={{ width: '20px', height: '20px', color: frame.color }} />
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Genesis {frame.chapter}: {frame.title}</span>
        </div>
        <p style={{ fontSize: '14px', color: '#ccc', marginBottom: '12px' }}>
          {frame.description}
        </p>
        <div style={{ background: `${frame.color}20`, padding: '12px', borderRadius: '8px', border: `1px solid ${frame.color}50` }}>
          <p style={{ fontSize: '12px', color: '#aaa', marginBottom: '4px' }}>{t('games.room24fps.memoryTrigger').toUpperCase()}:</p>
          <p style={{ fontSize: '14px', fontWeight: 'bold', color: frame.color }}>
            {frame.memoryTrigger}
          </p>
        </div>
      </div>
    </Html>
  );
}

// ============ MAIN COMPONENT ============

export default function Room24FPS3D() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [currentChapter, setCurrentChapter] = useState(1);
  const [showInfo, setShowInfo] = useState(true);

  const currentFrame = GENESIS_FRAMES[currentChapter - 1];

  const goToChapter = useCallback((chapter: number) => {
    if (chapter >= 1 && chapter <= 24) {
      setCurrentChapter(chapter);
    }
  }, []);

  const nextChapter = () => goToChapter(currentChapter + 1);
  const prevChapter = () => goToChapter(currentChapter - 1);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* 3D Canvas */}
      <div className="fixed inset-0 top-16 z-0">
        <Canvas
          shadows
          camera={{ fov: 50, position: [0, 0, 12] }}
          dpr={isMobile ? [1, 1.5] : [1, 2]}
          gl={{ antialias: true, alpha: false }}
        >
          <Suspense fallback={null}>
            <CameraController targetChapter={currentChapter} />

            {/* Enhanced Lighting */}
            <ambientLight intensity={0.15} color="#4a4a6a" />
            <directionalLight position={[10, 15, 5]} intensity={0.6} color="#ffeedd" castShadow />
            <directionalLight position={[-10, 5, -10]} intensity={0.2} color="#6a8cff" />

            {/* Vivid Background */}
            <color attach="background" args={["#050510"]} />
            <fog attach="fog" args={['#0a0a1a', 30, 100]} />
            <CosmicBackground />
            <Stars radius={150} depth={80} count={3000} factor={5} fade speed={0.5} />

            {/* Animated light beams */}
            <LightBeams />

            {/* Reflective floor */}
            <ReflectiveFloor />

            {/* Film strip structure */}
            <FilmStrip />

            {/* Active frame particles */}
            <ActiveFrameParticles
              position={[(currentChapter - 1) * 5, 0, 0]}
              color={currentFrame.color}
            />

            {/* Chapter frames */}
            {GENESIS_FRAMES.map((frame, index) => (
              <ChapterFrameCard
                key={frame.chapter}
                frame={frame}
                index={index}
                isActive={currentChapter === frame.chapter}
                onClick={() => goToChapter(frame.chapter)}
              />
            ))}

            {/* Enhanced projector beam */}
            <ProjectorBeam targetX={(currentChapter - 1) * 5} />

            {/* Info panel */}
            <group position={[(currentChapter - 1) * 5, 0, 0]}>
              <InfoPanel frame={currentFrame} visible={showInfo} />
            </group>

            <OrbitControls
              enablePan={true}
              enableZoom={true}
              minDistance={8}
              maxDistance={25}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.8}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 container mx-auto px-4 pt-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={() => navigate("/games")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back')}
          </Button>
          <div className="flex items-center gap-2">
            <Film className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg">{t('games.room24fps.title')}</span>
            <Badge variant="secondary">{t('games.room24fps.genesisRange')}</Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowInfo(!showInfo)}
          >
            <Info className="h-4 w-4 mr-1" />
            {showInfo ? t('games.room24fps.hideInfo') : t('games.room24fps.showInfo')}
          </Button>
        </div>

        {/* Chapter Navigation */}
        <div className="fixed bottom-20 md:bottom-8 left-4 right-4 z-20">
          <Card className="bg-background/95 backdrop-blur max-w-2xl mx-auto">
            <CardContent className="py-4">
              <div className="flex items-center justify-between gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={prevChapter}
                  disabled={currentChapter <= 1}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <div className="flex-1 text-center">
                  <div className="text-3xl mb-1">{currentFrame.image}</div>
                  <div className="font-bold">{t('games.room24fps.chapter', { number: currentChapter })}</div>
                  <div className="text-sm text-muted-foreground">{currentFrame.title}</div>
                </div>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={nextChapter}
                  disabled={currentChapter >= 24}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              {/* Chapter dots */}
              <div className="flex justify-center gap-1 mt-4 flex-wrap">
                {GENESIS_FRAMES.map((frame) => (
                  <button
                    key={frame.chapter}
                    onClick={() => goToChapter(frame.chapter)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentChapter === frame.chapter
                        ? "scale-125"
                        : "opacity-50 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: frame.color }}
                    title={`Chapter ${frame.chapter}: ${frame.title}`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
