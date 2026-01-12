import { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  PerspectiveCamera,
  Html,
  Float,
  Sparkles
} from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Gem, RotateCcw, Sparkles as SparklesIcon } from 'lucide-react';
import { PalaceRoom3D } from '@/components/3d/PalaceRoom3D';

// Sample gems with Scripture insights
const SAMPLE_GEMS = [
  {
    id: 'gem-1',
    title: 'Passover Lamb Timing',
    insight: 'Jesus was crucified at the exact hour when Passover lambs were being slain throughout Jerusalem (John 19:14, Exodus 12:6)',
    reference: 'John 19:14',
    color: '#3b82f6',
    shape: 'diamond'
  },
  {
    id: 'gem-2',
    title: 'Twelve Baskets',
    insight: 'Jesus fed 5,000 with 12 baskets left over — one for each tribe of Israel. The Shepherd feeds His flock',
    reference: 'Matthew 14:20',
    color: '#22c55e',
    shape: 'emerald'
  },
  {
    id: 'gem-3',
    title: 'Seven Baskets',
    insight: 'Jesus fed 4,000 Gentiles with 7 baskets left — 7 representing completeness for ALL nations',
    reference: 'Matthew 15:37',
    color: '#f59e0b',
    shape: 'ruby'
  },
  {
    id: 'gem-4',
    title: 'The Father Ran',
    insight: 'In Luke 15, the father RAN to the prodigal — undignified for a patriarch, but love over honor',
    reference: 'Luke 15:20',
    color: '#ef4444',
    shape: 'heart'
  },
  {
    id: 'gem-5',
    title: 'Jesus Wept',
    insight: 'The shortest verse reveals the deepest truth: God grieves with us even when He knows resurrection is coming',
    reference: 'John 11:35',
    color: '#8b5cf6',
    shape: 'teardrop'
  },
  {
    id: 'gem-6',
    title: 'The Seventh Day',
    insight: 'God didn\'t REST because He was tired — He CEASED to show the work was complete and blessed',
    reference: 'Genesis 2:2-3',
    color: '#ec4899',
    shape: 'sapphire'
  },
  {
    id: 'gem-7',
    title: 'Passover Lamb',
    insight: 'The lamb was chosen on the 10th day and kept until the 14th — Jesus entered Jerusalem on the 10th and was crucified on the 14th',
    reference: 'Exodus 12:3-6',
    color: '#14b8a6',
    shape: 'diamond'
  },
  {
    id: 'gem-8',
    title: 'The Fourth Man',
    insight: 'In the fiery furnace, Nebuchadnezzar saw FOUR men, though only three were thrown in — Christ walks with us through fire',
    reference: 'Daniel 3:25',
    color: '#f97316',
    shape: 'crystal'
  }
];

// 3D Crystal/Gem component
interface Crystal3DProps {
  gem: typeof SAMPLE_GEMS[0];
  position: [number, number, number];
  isSelected: boolean;
  onClick: () => void;
}

function Crystal3D({ gem, position, isSelected, onClick }: Crystal3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Rotating animation
      meshRef.current.rotation.y += 0.01;
      
      // Floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.1;
      
      // Scale on hover/select
      const targetScale = isSelected ? 1.3 : hovered ? 1.15 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  const getGeometry = () => {
    switch (gem.shape) {
      case 'diamond':
        return <octahedronGeometry args={[0.5, 0]} />;
      case 'emerald':
        return <boxGeometry args={[0.6, 0.8, 0.4]} />;
      case 'ruby':
        return <dodecahedronGeometry args={[0.5, 0]} />;
      case 'heart':
        return <sphereGeometry args={[0.4, 16, 16]} />;
      case 'teardrop':
        return <coneGeometry args={[0.3, 0.8, 8]} />;
      case 'sapphire':
        return <icosahedronGeometry args={[0.5, 0]} />;
      case 'crystal':
        return <cylinderGeometry args={[0.2, 0.4, 0.8, 6]} />;
      default:
        return <octahedronGeometry args={[0.5, 0]} />;
    }
  };

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group position={position}>
        {/* Pedestal */}
        <mesh position={[0, -1.5, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.5, 0.3, 8]} />
          <meshStandardMaterial color="#DAA520" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, -1.2, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.6, 8]} />
          <meshStandardMaterial color="#4a4a4a" metalness={0.6} roughness={0.3} />
        </mesh>
        
        <mesh
          ref={meshRef}
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          castShadow
        >
          {getGeometry()}
          <meshStandardMaterial
            color={gem.color}
            metalness={0.3}
            roughness={0.1}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Inner glow */}
        <pointLight
          intensity={isSelected ? 2 : hovered ? 1 : 0.5}
          distance={3}
          color={gem.color}
        />

        {/* Label on hover */}
        {(hovered || isSelected) && (
          <Html position={[0, 1.2, 0]} center distanceFactor={8}>
            <div className="bg-black/80 text-white px-3 py-1 rounded-full text-sm whitespace-nowrap backdrop-blur-sm border border-primary/30">
              {gem.title}
            </div>
          </Html>
        )}
      </group>
    </Float>
  );
}

// Treasure chest component
function TreasureChest({ isOpen }: { isOpen: boolean }) {
  const lidRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (lidRef.current) {
      const targetRotation = isOpen ? -Math.PI / 2 : 0;
      lidRef.current.rotation.x = THREE.MathUtils.lerp(
        lidRef.current.rotation.x,
        targetRotation,
        0.05
      );
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Chest body */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[2.5, 1, 1.5]} />
        <meshStandardMaterial color="#8B4513" roughness={0.6} />
      </mesh>
      
      {/* Gold trim */}
      <mesh position={[0, 1.01, 0]}>
        <boxGeometry args={[2.6, 0.1, 1.6]} />
        <meshStandardMaterial color="#DAA520" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Lid */}
      <mesh 
        ref={lidRef} 
        position={[0, 1.1, -0.75]}
      >
        <group position={[0, 0, 0.75]}>
          <mesh castShadow>
            <boxGeometry args={[2.5, 0.2, 1.5]} />
            <meshStandardMaterial color="#8B4513" roughness={0.6} />
          </mesh>
          {/* Lid curved top */}
          <mesh position={[0, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.75, 0.75, 2.5, 16, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#8B4513" roughness={0.6} />
          </mesh>
        </group>
      </mesh>

      {/* Lock */}
      <mesh position={[0, 0.5, 0.76]}>
        <boxGeometry args={[0.3, 0.4, 0.1]} />
        <meshStandardMaterial color="#DAA520" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Gold glow from inside when open */}
      {isOpen && (
        <pointLight position={[0, 0.8, 0]} intensity={2} distance={5} color="#FFD700" />
      )}
    </group>
  );
}

// Treasury room contents
function TreasuryContents({ gems, selectedGem, onSelectGem, chestOpen }: {
  gems: typeof SAMPLE_GEMS;
  selectedGem: typeof SAMPLE_GEMS[0] | null;
  onSelectGem: (gem: typeof SAMPLE_GEMS[0] | null) => void;
  chestOpen: boolean;
}) {
  // Arrange gems in a circle around the chest
  const gemPositions = gems.map((_, i) => {
    const angle = (i / gems.length) * Math.PI * 2;
    const radius = 5;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    return [x, 2, z] as [number, number, number];
  });

  return (
    <>
      {/* Central treasure chest */}
      <TreasureChest isOpen={chestOpen} />
      
      {/* Floating gems on pedestals */}
      {gems.map((gem, i) => (
        <Crystal3D
          key={gem.id}
          gem={gem}
          position={gemPositions[i]}
          isSelected={selectedGem?.id === gem.id}
          onClick={() => onSelectGem(gem === selectedGem ? null : gem)}
        />
      ))}

      {/* Decorative floor pattern */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[2, 8, 8]} />
        <meshStandardMaterial color="#DAA520" metalness={0.6} roughness={0.4} transparent opacity={0.3} />
      </mesh>

      {/* Magical sparkles */}
      <Sparkles
        count={150}
        scale={[20, 10, 20]}
        size={2}
        speed={0.3}
        color="#FFD700"
      />
    </>
  );
}

interface Gems3DViewerProps {
  onClose?: () => void;
  userGems?: typeof SAMPLE_GEMS;
}

export function Gems3DViewer({ onClose, userGems }: Gems3DViewerProps) {
  const [selectedGem, setSelectedGem] = useState<typeof SAMPLE_GEMS[0] | null>(null);
  const [chestOpen, setChestOpen] = useState(true);

  const gems = userGems || SAMPLE_GEMS;

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden border border-border">
      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 6, 12]} fov={50} />
          
          <PalaceRoom3D theme="treasury" width={30} height={10} depth={25}>
            <TreasuryContents 
              gems={gems}
              selectedGem={selectedGem}
              onSelectGem={setSelectedGem}
              chestOpen={chestOpen}
            />
          </PalaceRoom3D>
          
          <OrbitControls 
            enableZoom={true}
            enablePan={false}
            minDistance={6}
            maxDistance={18}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.2}
            target={[0, 1, 0]}
          />
          <Environment preset="night" />
        </Suspense>
      </Canvas>

      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
        <Card className="bg-background/90 backdrop-blur-sm pointer-events-auto">
          <CardContent className="p-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Gem className="h-5 w-5 text-primary" />
              💎 Gems Treasury
            </h3>
            <p className="text-sm text-muted-foreground">
              {gems.length} precious insights collected
            </p>
          </CardContent>
        </Card>

        <div className="flex gap-2 pointer-events-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setChestOpen(!chestOpen)}
            className="bg-background/90 backdrop-blur-sm"
          >
            <SparklesIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSelectedGem(null)}
            className="bg-background/90 backdrop-blur-sm"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          {onClose && (
            <Button
              variant="outline"
              size="icon"
              onClick={onClose}
              className="bg-background/90 backdrop-blur-sm"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Selected Gem Detail Panel */}
      {selectedGem && (
        <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
          <Card className="bg-background/95 backdrop-blur-sm border-primary/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: selectedGem.color + '30' }}
                >
                  <Gem className="h-5 w-5" style={{ color: selectedGem.color }} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg">{selectedGem.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{selectedGem.reference}</p>
                  <p className="text-sm">{selectedGem.insight}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedGem(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Instructions */}
      {!selectedGem && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
          <p className="text-white/70 text-xs bg-black/50 px-3 py-2 rounded-full backdrop-blur-sm">
            Click crystals to reveal insights • Drag to rotate • Scroll to zoom
          </p>
        </div>
      )}
    </div>
  );
}

export default Gems3DViewer;
