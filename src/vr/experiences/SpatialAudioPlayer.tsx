import { useRef, useMemo, useState, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Interactive } from '@react-three/xr';
import * as THREE from 'three';
import { StarField } from '../components/StarField';
import { useStreamingAudio } from '../hooks/useStreamingAudio';
import {
  AUDIO_LIBRARY,
  AUDIO_CATEGORIES,
  SUITE_VOICES,
  type AudioEntry,
  type AudioCategory,
} from '@/data/audioLibraryData';

// ── Types ───────────────────────────────────────────────────────────────────

type Screen = 'menu' | 'library' | 'suite' | 'player';

const ITEMS_PER_PAGE = 8;

// Category colors for VR
const CATEGORY_COLORS: Record<string, string> = {
  all: '#888888',
  commentary: '#4488FF',
  tour: '#FF8800',
  apologetics: '#FF4444',
  devotional: '#FF88AA',
  study: '#44BB88',
  training: '#9944FF',
  music: '#FFD700',
};

// Suite voice colors
const SUITE_COLORS = ['#FFD700', '#FF44AA', '#44CCCC', '#888866', '#4488FF', '#8844FF'];

// ── Campfire Particles ──────────────────────────────────────────────────────

function CampfireParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 60;

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.3;
      pos[i * 3 + 1] = Math.random() * 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
      vel[i * 3] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 1] = 0.01 + Math.random() * 0.02;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    return [pos, vel];
  }, []);

  useFrame(() => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3] += velocities[i * 3];
      arr[i * 3 + 1] += velocities[i * 3 + 1];
      arr[i * 3 + 2] += velocities[i * 3 + 2];
      if (arr[i * 3 + 1] > 1.5) {
        arr[i * 3] = (Math.random() - 0.5) * 0.3;
        arr[i * 3 + 1] = 0;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.08} color="#FF6600" transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
    </points>
  );
}

// ── Campfire Scene (shared across screens) ──────────────────────────────────

function CampfireScene() {
  const fireRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (fireRef.current) {
      const t = clock.getElapsedTime();
      fireRef.current.intensity = 2 + Math.sin(t * 8) * 0.5 + Math.sin(t * 12) * 0.3;
    }
  });

  return (
    <group position={[0, -1.2, -2]}>
      <pointLight ref={fireRef} position={[0, 0.5, 0]} color="#FF4400" intensity={2.5} distance={10} castShadow />
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial color="#FF6600" transparent opacity={0.6} />
      </mesh>
      <CampfireParticles />
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.5, 0, Math.sin(angle) * 0.5]}>
            <sphereGeometry args={[0.08, 6, 6]} />
            <meshStandardMaterial color="#555" roughness={0.9} />
          </mesh>
        );
      })}
    </group>
  );
}

// ── VR Button Component ─────────────────────────────────────────────────────

interface VRButtonProps {
  position: [number, number, number];
  size?: [number, number];
  label: string;
  color: string;
  onSelect: () => void;
  fontSize?: number;
  sublabel?: string;
  disabled?: boolean;
}

function VRButton({ position, size = [2, 0.35], label, color, onSelect, fontSize = 0.09, sublabel, disabled }: VRButtonProps) {
  return (
    <group position={position}>
      <Interactive onSelect={disabled ? () => {} : onSelect}>
        <mesh onClick={disabled ? undefined : onSelect} onPointerDown={disabled ? undefined : onSelect}>
          <planeGeometry args={size} />
          <meshStandardMaterial
            color={disabled ? '#333' : '#1a1a2e'}
            emissive={color}
            emissiveIntensity={disabled ? 0.05 : 0.2}
          />
        </mesh>
      </Interactive>
      <Suspense fallback={null}>
        <Text position={[0, sublabel ? 0.04 : 0, 0.01]} fontSize={fontSize} color={disabled ? '#666' : '#eee'} anchorX="center" anchorY="middle" maxWidth={size[0] - 0.1}>
          {label}
        </Text>
        {sublabel && (
          <Text position={[0, -0.06, 0.01]} fontSize={0.055} color="#888" anchorX="center" anchorY="middle" maxWidth={size[0] - 0.1}>
            {sublabel}
          </Text>
        )}
      </Suspense>
    </group>
  );
}

// ── Menu Screen ─────────────────────────────────────────────────────────────

function MenuScreen({ onSelect }: { onSelect: (screen: 'library' | 'suite') => void }) {
  return (
    <group>
      <Suspense fallback={null}>
        <Text position={[0, 2.5, -2]} fontSize={0.25} color="#e8d5b7" anchorX="center" outlineWidth={0.01} outlineColor="#000">
          Audio Theater
        </Text>
        <Text position={[0, 2.2, -2]} fontSize={0.1} color="#888" anchorX="center">
          Choose your experience
        </Text>
      </Suspense>

      {/* Audio Library Button */}
      <group position={[-1.2, 1.2, -2.5]}>
        <Interactive onSelect={() => onSelect('library')}>
          <mesh onClick={() => onSelect('library')} onPointerDown={() => onSelect('library')}>
            <planeGeometry args={[1.8, 0.8]} />
            <meshStandardMaterial color="#1a1a3e" emissive="#4488FF" emissiveIntensity={0.25} />
          </mesh>
        </Interactive>
        <Suspense fallback={null}>
          <Text position={[0, 0.12, 0.01]} fontSize={0.13} color="#4488FF" anchorX="center" anchorY="middle">
            Audio Library
          </Text>
          <Text position={[0, -0.12, 0.01]} fontSize={0.065} color="#aaa" anchorX="center" anchorY="middle" maxWidth={1.6}>
            {AUDIO_LIBRARY.length} tracks across {AUDIO_CATEGORIES.length - 1} categories
          </Text>
        </Suspense>
      </group>

      {/* Audio Suite Button */}
      <group position={[1.2, 1.2, -2.5]}>
        <Interactive onSelect={() => onSelect('suite')}>
          <mesh onClick={() => onSelect('suite')} onPointerDown={() => onSelect('suite')}>
            <planeGeometry args={[1.8, 0.8]} />
            <meshStandardMaterial color="#2a1a2e" emissive="#9944FF" emissiveIntensity={0.25} />
          </mesh>
        </Interactive>
        <Suspense fallback={null}>
          <Text position={[0, 0.12, 0.01]} fontSize={0.13} color="#BB88FF" anchorX="center" anchorY="middle">
            Audio Suite
          </Text>
          <Text position={[0, -0.12, 0.01]} fontSize={0.065} color="#aaa" anchorX="center" anchorY="middle" maxWidth={1.6}>
            6 unique voices on key passages
          </Text>
        </Suspense>
      </group>
    </group>
  );
}

// ── Library Screen ──────────────────────────────────────────────────────────

function LibraryScreen({
  onSelectTrack,
  onBack,
}: {
  onSelectTrack: (entry: AudioEntry) => void;
  onBack: () => void;
}) {
  const [activeCategory, setActiveCategory] = useState<AudioCategory>('music');
  const [page, setPage] = useState(0);

  // Filter categories (skip 'all')
  const categories = AUDIO_CATEGORIES.filter((c) => c.id !== 'all');

  const tracks = useMemo(() => {
    return AUDIO_LIBRARY.filter((e) => e.category === activeCategory);
  }, [activeCategory]);

  const totalPages = Math.ceil(tracks.length / ITEMS_PER_PAGE);
  const pageItems = tracks.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  const handleCategoryChange = (cat: AudioCategory) => {
    setActiveCategory(cat);
    setPage(0);
  };

  return (
    <group>
      <Suspense fallback={null}>
        <Text position={[0, 2.5, -2]} fontSize={0.2} color="#e8d5b7" anchorX="center" outlineWidth={0.01} outlineColor="#000">
          Audio Library
        </Text>
      </Suspense>

      {/* Category tabs — left column */}
      <group position={[-3, 1.2, -1.5]} rotation={[0, 0.35, 0]}>
        {categories.map((cat, i) => (
          <VRButton
            key={cat.id}
            position={[0, -i * 0.32, 0]}
            size={[1.6, 0.26]}
            label={cat.label}
            color={CATEGORY_COLORS[cat.id] || '#888'}
            fontSize={0.07}
            onSelect={() => handleCategoryChange(cat.id)}
          />
        ))}
      </group>

      {/* Track list — center */}
      <group position={[0.3, 1.5, -2.5]}>
        {pageItems.map((entry, i) => {
          const hasAudio = !!entry.audioUrl;
          return (
            <VRButton
              key={entry.id}
              position={[0, -i * 0.3, 0]}
              size={[2.8, 0.25]}
              label={hasAudio ? entry.title : `${entry.title}  [Coming Soon]`}
              color={CATEGORY_COLORS[entry.category] || '#888'}
              fontSize={0.065}
              onSelect={() => onSelectTrack(entry)}
              disabled={!hasAudio}
            />
          );
        })}

        {/* Pagination */}
        {totalPages > 1 && (
          <group position={[0, -(pageItems.length) * 0.3 - 0.15, 0]}>
            {page > 0 && (
              <VRButton
                position={[-0.8, 0, 0]}
                size={[0.6, 0.22]}
                label="< Prev"
                color="#666"
                fontSize={0.06}
                onSelect={() => setPage((p) => p - 1)}
              />
            )}
            <Suspense fallback={null}>
              <Text position={[0, 0, 0.01]} fontSize={0.055} color="#888" anchorX="center">
                {page + 1} / {totalPages}
              </Text>
            </Suspense>
            {page < totalPages - 1 && (
              <VRButton
                position={[0.8, 0, 0]}
                size={[0.6, 0.22]}
                label="Next >"
                color="#666"
                fontSize={0.06}
                onSelect={() => setPage((p) => p + 1)}
              />
            )}
          </group>
        )}
      </group>

      {/* Back button */}
      <VRButton
        position={[0, -0.5, -1]}
        size={[1.2, 0.25]}
        label="< Back to Menu"
        color="#FF6666"
        fontSize={0.07}
        onSelect={onBack}
      />
    </group>
  );
}

// ── Suite Screen ────────────────────────────────────────────────────────────

function SuiteScreen({
  onSelectVoice,
  onBack,
}: {
  onSelectVoice: (entry: AudioEntry) => void;
  onBack: () => void;
}) {
  return (
    <group>
      <Suspense fallback={null}>
        <Text position={[0, 2.5, -2]} fontSize={0.2} color="#BB88FF" anchorX="center" outlineWidth={0.01} outlineColor="#000">
          Audio Suite
        </Text>
        <Text position={[0, 2.2, -2]} fontSize={0.08} color="#888" anchorX="center">
          6 Voices — Each brings a unique perspective to Scripture
        </Text>
      </Suspense>

      {/* 6 voice cards in semicircle */}
      {SUITE_VOICES.map((voice, i) => {
        const angle = ((i - 2.5) / 5) * Math.PI * 0.6;
        const radius = 3.5;
        const x = Math.sin(angle) * radius;
        const z = -Math.cos(angle) * radius;
        const rotY = -angle;
        const color = SUITE_COLORS[i % SUITE_COLORS.length];

        return (
          <group key={voice.id} position={[x, 1, z]} rotation={[0, rotY, 0]}>
            <Interactive onSelect={() => onSelectVoice(voice)}>
              <mesh onClick={() => onSelectVoice(voice)} onPointerDown={() => onSelectVoice(voice)}>
                <planeGeometry args={[1.2, 0.7]} />
                <meshStandardMaterial color="#1a1a2e" emissive={color} emissiveIntensity={0.2} />
              </mesh>
            </Interactive>
            <Suspense fallback={null}>
              <Text position={[0, 0.15, 0.01]} fontSize={0.075} color={color} anchorX="center" maxWidth={1.1}>
                {voice.suiteVoiceName || voice.title}
              </Text>
              <Text position={[0, -0.05, 0.01]} fontSize={0.055} color="#ccc" anchorX="center" maxWidth={1.1}>
                {voice.suitePassage || ''}
              </Text>
              <Text position={[0, -0.2, 0.01]} fontSize={0.045} color="#888" anchorX="center">
                {voice.duration}
              </Text>
            </Suspense>
            <pointLight position={[0, 0, 0.3]} color={color} intensity={0.3} distance={2} />
          </group>
        );
      })}

      {/* Back button */}
      <VRButton
        position={[0, -0.5, -1]}
        size={[1.2, 0.25]}
        label="< Back to Menu"
        color="#FF6666"
        fontSize={0.07}
        onSelect={onBack}
      />
    </group>
  );
}

// ── Player Screen ───────────────────────────────────────────────────────────

function PlayerScreen({
  entry,
  onBack,
}: {
  entry: AudioEntry;
  onBack: () => void;
}) {
  const audioUrl = entry.audioUrl || '';
  const [audioState, audioControls] = useStreamingAudio(audioUrl);

  const trackColor = CATEGORY_COLORS[entry.category] || '#FFD700';

  const formatTime = (seconds: number): string => {
    if (!seconds || !isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <group>
      {/* Now Playing info */}
      <Suspense fallback={null}>
        <Text position={[0, 2.5, -2]} fontSize={0.18} color="#e8d5b7" anchorX="center" outlineWidth={0.01} outlineColor="#000">
          Now Playing
        </Text>
        <Text position={[0, 2.1, -2]} fontSize={0.1} color={trackColor} anchorX="center" maxWidth={3}>
          {entry.title}
        </Text>
        <Text position={[0, 1.85, -2]} fontSize={0.06} color="#aaa" anchorX="center" maxWidth={3}>
          {entry.description.slice(0, 100)}{entry.description.length > 100 ? '...' : ''}
        </Text>
        <Text position={[0, 1.6, -2]} fontSize={0.06} color="#888" anchorX="center">
          {formatTime(audioState.currentTime)} / {formatTime(audioState.duration)}
          {audioState.isLoading ? '  Loading...' : ''}
        </Text>
      </Suspense>

      {/* Play/Pause button */}
      <Interactive onSelect={audioControls.togglePlayPause}>
        <mesh position={[0, 1.35, -2]} onClick={audioControls.togglePlayPause} onPointerDown={audioControls.togglePlayPause}>
          <circleGeometry args={[0.15, 32]} />
          <meshStandardMaterial
            color={audioState.isPlaying ? '#FF4444' : '#44FF44'}
            emissive={audioState.isPlaying ? '#FF4444' : '#44FF44'}
            emissiveIntensity={0.5}
          />
        </mesh>
      </Interactive>
      <Suspense fallback={null}>
        <Text position={[0, 1.35, -1.98]} fontSize={0.09} color="white" anchorX="center" anchorY="middle">
          {audioState.isPlaying ? '||' : '>'}
        </Text>
      </Suspense>

      {/* Back button */}
      <VRButton
        position={[0, 0.2, 2]}
        size={[1.5, 0.3]}
        label="< Back"
        color="#FF6666"
        fontSize={0.1}
        onSelect={onBack}
      />
    </group>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

interface SpatialAudioPlayerProps {
  onBack: () => void;
}

export default function SpatialAudioPlayer({ onBack }: SpatialAudioPlayerProps) {
  const [screen, setScreen] = useState<Screen>('menu');
  const [selectedEntry, setSelectedEntry] = useState<AudioEntry | null>(null);
  const [returnScreen, setReturnScreen] = useState<'library' | 'suite'>('library');

  const handleSelectTrack = (entry: AudioEntry) => {
    if (!entry.audioUrl) return;
    setSelectedEntry(entry);
    setReturnScreen('library');
    setScreen('player');
  };

  const handleSelectVoice = (entry: AudioEntry) => {
    setSelectedEntry(entry);
    setReturnScreen('suite');
    setScreen('player');
  };

  const handlePlayerBack = () => {
    setScreen(returnScreen);
  };

  return (
    <group>
      <StarField count={1500} radius={80} />
      <ambientLight intensity={0.05} color="#4466aa" />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
        <circleGeometry args={[15, 32]} />
        <meshStandardMaterial color="#1a1508" roughness={0.95} />
      </mesh>

      {/* Campfire — always visible */}
      <CampfireScene />

      {/* Screens */}
      {screen === 'menu' && (
        <MenuScreen onSelect={(s) => setScreen(s)} />
      )}
      {screen === 'library' && (
        <LibraryScreen onSelectTrack={handleSelectTrack} onBack={() => setScreen('menu')} />
      )}
      {screen === 'suite' && (
        <SuiteScreen
          onSelectVoice={handleSelectVoice}
          onBack={() => setScreen('menu')}
        />
      )}
      {screen === 'player' && selectedEntry && (
        <PlayerScreen entry={selectedEntry} onBack={handlePlayerBack} />
      )}

      {/* Back to Lobby — always visible */}
      <Interactive onSelect={onBack}>
        <mesh position={[0, -0.8, 2.5]} onClick={onBack} onPointerDown={onBack}>
          <planeGeometry args={[1.5, 0.3]} />
          <meshBasicMaterial color="#331111" />
        </mesh>
      </Interactive>
      <Suspense fallback={null}>
        <Text position={[0, -0.8, 2.51]} fontSize={0.1} color="#FF6666" anchorX="center">
          {'<'} Back to Lobby
        </Text>
      </Suspense>
    </group>
  );
}
