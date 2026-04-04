import { useRef, useMemo, useState, useEffect, useCallback, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Environment } from '@react-three/drei';
import { Interactive } from '@react-three/xr';
import * as THREE from 'three';
import { StarField } from '../components/StarField';
import { NebulaClouds } from '../components/NebulaClouds';
import { useStreamingAudio } from '../hooks/useStreamingAudio';
import { BackToLobbyButton } from '../components/BackToLobbyButton';
import {
  AUDIO_LIBRARY,
  AUDIO_CATEGORIES,
  SUITE_VOICES,
  type AudioEntry,
  type AudioCategory,
} from '@/data/audioLibraryData';
import { supabase } from '@/integrations/supabase/client';

// ── TTS Generation ──────────────────────────────────────────────────────────

async function generateTTSUrl(text: string, voice?: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.functions.invoke('text-to-speech', {
      body: { text: text.trim(), voice: voice || 'nova', provider: 'openai', speed: 1.0, useCache: true },
    });
    if (error) throw error;
    if (data?.audioUrl) return data.audioUrl;
    if (data?.audioContent) {
      const blob = new Blob(
        [Uint8Array.from(atob(data.audioContent), (c) => c.charCodeAt(0))],
        { type: 'audio/mpeg' },
      );
      return URL.createObjectURL(blob);
    }
    return null;
  } catch (err) {
    console.error('[SpatialAudioPlayer] TTS error:', err);
    return null;
  }
}

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

// ── Energy Hearth Particles (replaces CampfireParticles) ──────────────────

function EnergyHearthParticles() {
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
      <pointsMaterial size={0.08} color="#4488FF" transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
    </points>
  );
}

// ── Energy Hearth Scene (replaces CampfireScene) ─────────────────────────────

function EnergyHearthScene() {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (lightRef.current) {
      const t = clock.getElapsedTime();
      lightRef.current.intensity = 2 + Math.sin(t * 8) * 0.5 + Math.sin(t * 12) * 0.3;
    }
  });

  return (
    <group position={[0, -1.2, -2]}>
      <pointLight ref={lightRef} position={[0, 0.5, 0]} color="#4466FF" intensity={2.5} distance={10} castShadow />
      {/* Core energy sphere */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial color="#44AAFF" transparent opacity={0.7} />
      </mesh>
      {/* Outer glow */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.25, 8, 8]} />
        <meshBasicMaterial color="#4488FF" transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <EnergyHearthParticles />
      {/* Crystal ring instead of stones */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.5, 0, Math.sin(angle) * 0.5]}>
            <octahedronGeometry args={[0.06, 0]} />
            <meshStandardMaterial color="#2244AA" emissive="#4466FF" emissiveIntensity={0.3} metalness={0.6} roughness={0.3} />
          </mesh>
        );
      })}
    </group>
  );
}

// ── Audio Waveform Visualization — ring of bars responding to audio ──
function AudioWaveform({ analyserData }: { analyserData: Uint8Array | null }) {
  const barsRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const barCount = 32;

  useFrame(() => {
    if (!barsRef.current) return;
    for (let i = 0; i < barCount; i++) {
      const angle = (i / barCount) * Math.PI * 2;
      const radius = 2.5;
      const value = analyserData ? analyserData[Math.floor(i * (analyserData.length / barCount))] / 255 : 0;
      const height = 0.05 + value * 1.2;
      dummy.position.set(
        Math.cos(angle) * radius,
        -1.2 + height / 2,
        Math.sin(angle) * radius - 2,
      );
      dummy.scale.set(0.06, height, 0.06);
      dummy.updateMatrix();
      barsRef.current.setMatrixAt(i, dummy.matrix);
    }
    barsRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={barsRef} args={[undefined, undefined, barCount]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#4488FF" emissive="#4488FF" emissiveIntensity={0.5} transparent opacity={0.7} />
    </instancedMesh>
  );
}

// ── Pulsar Effect — expanding rings from the hearth synchronized with audio ──
function PulsarEffect({ volume = 0 }: { volume?: number }) {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const refs = [ring1Ref, ring2Ref, ring3Ref];
    refs.forEach((ref, i) => {
      if (!ref.current) return;
      const offset = i * 1.2;
      const cycle = ((t * 0.6 + offset) % 3.6) / 3.6;
      const scale = 0.5 + cycle * 4 + volume * 2;
      ref.current.scale.setScalar(scale);
      (ref.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, (1 - cycle) * 0.12 * (0.5 + volume));
    });
  });

  return (
    <group position={[0, -0.5, -2]}>
      {[ring1Ref, ring2Ref, ring3Ref].map((ref, i) => (
        <mesh key={i} ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.9, 1, 32]} />
          <meshBasicMaterial color="#6644FF" transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

// ── Energy Rings ─────────────────────────────────────────────────────────────

function EnergyRings() {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ring1Ref.current) {
      ring1Ref.current.rotation.y = t * 0.15;
      ring1Ref.current.rotation.x = Math.sin(t * 0.1) * 0.1;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.1;
      ring2Ref.current.rotation.z = Math.cos(t * 0.08) * 0.15;
    }
  });

  return (
    <group position={[0, 1, -2]}>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[5, 0.02, 8, 64]} />
        <meshBasicMaterial color="#8844FF" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[6.5, 0.015, 8, 64]} />
        <meshBasicMaterial color="#4466FF" transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
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
          <Text position={[0, -0.06, 0.01]} fontSize={0.065} color="#888" anchorX="center" anchorY="middle" maxWidth={size[0] - 0.1}>
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
        <Text position={[0, 2.5, -2]} fontSize={0.25} color="#44DDFF" anchorX="center" outlineWidth={0.01} outlineColor="#001122">
          Audio Theater
        </Text>
        <Text position={[0, 2.2, -2]} fontSize={0.1} color="#8899bb" anchorX="center">
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
        <Text position={[0, 2.5, -2]} fontSize={0.2} color="#44DDFF" anchorX="center" outlineWidth={0.01} outlineColor="#001122">
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
          const hasAudio = !!entry.audioUrl || !!entry.audioMeta?.text;
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
        <Text position={[0, 2.5, -2]} fontSize={0.2} color="#BB88FF" anchorX="center" outlineWidth={0.01} outlineColor="#001122">
          Audio Suite
        </Text>
        <Text position={[0, 2.2, -2]} fontSize={0.08} color="#8899bb" anchorX="center">
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

// ── Transcript Panel ────────────────────────────────────────────────────────

function TranscriptPanel({ text, progress, color }: { text: string; progress: number; color: string }) {
  const sentences = useMemo(() => text.split(/(?<=[.!?])\s+/).filter((s) => s.trim()), [text]);

  const currentIdx = Math.min(Math.floor(progress * sentences.length), sentences.length - 1);
  const windowStart = Math.max(0, currentIdx - 3);
  const windowEnd = Math.min(sentences.length, currentIdx + 4);
  const visible = sentences.slice(windowStart, windowEnd);

  return (
    <group position={[0, 0.7, -2]}>
      {/* Background panel */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[3.2, 0.8]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.5} />
      </mesh>

      <Suspense fallback={null}>
        {visible.map((sentence, i) => {
          const actualIdx = windowStart + i;
          const isCurrent = actualIdx === currentIdx;
          const yOffset = (visible.length / 2 - i - 0.5) * 0.1;
          return (
            <Text
              key={actualIdx}
              position={[0, yOffset, 0.01]}
              fontSize={isCurrent ? 0.065 : 0.055}
              color={isCurrent ? color : '#888'}
              anchorX="center"
              anchorY="middle"
              maxWidth={2.9}
            >
              {sentence}
            </Text>
          );
        })}
      </Suspense>
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
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [ttsStatus, setTtsStatus] = useState<string>('');
  const [ttsGenerating, setTtsGenerating] = useState(false);

  const audioUrl = entry.audioUrl || generatedUrl || '';
  const [audioState, audioControls] = useStreamingAudio(audioUrl);

  const trackColor = CATEGORY_COLORS[entry.category] || '#FFD700';
  const needsTTS = !entry.audioUrl && !!entry.audioMeta?.text;

  // Auto-generate TTS for entries without audioUrl
  useEffect(() => {
    if (!needsTTS || generatedUrl || ttsGenerating) return;
    let cancelled = false;

    const generate = async () => {
      setTtsGenerating(true);
      setTtsStatus('Generating audio...');
      try {
        const voice = entry.audioMeta?.voice as string | undefined;
        const url = await generateTTSUrl(entry.audioMeta.text as string, voice);
        if (cancelled) return;
        if (url) {
          setGeneratedUrl(url);
          setTtsStatus('');
          setTimeout(() => audioControls.play(), 500);
        } else {
          setTtsStatus('Audio generation failed');
        }
      } catch {
        if (!cancelled) setTtsStatus('Audio generation failed');
      } finally {
        if (!cancelled) setTtsGenerating(false);
      }
    };

    generate();
    return () => { cancelled = true; };
  }, [needsTTS, entry.id]);

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
        <Text position={[0, 2.5, -2]} fontSize={0.18} color="#44DDFF" anchorX="center" outlineWidth={0.01} outlineColor="#001122">
          {ttsGenerating ? 'Generating...' : 'Now Playing'}
        </Text>
        <Text position={[0, 2.1, -2]} fontSize={0.1} color={trackColor} anchorX="center" maxWidth={3}>
          {entry.title}
        </Text>
        <Text position={[0, 1.85, -2]} fontSize={0.07} color="#aaa" anchorX="center" maxWidth={3}>
          {ttsStatus || (entry.description.slice(0, 100) + (entry.description.length > 100 ? '...' : ''))}
        </Text>
        <Text position={[0, 1.6, -2]} fontSize={0.07} color="#888" anchorX="center">
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

      {/* Transcript panel */}
      {entry.audioMeta?.text && (
        <TranscriptPanel
          text={entry.audioMeta.text as string}
          progress={audioState.progress}
          color={trackColor}
        />
      )}

      {/* Back button */}
      <VRButton
        position={[0, -0.2, -1.5]}
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
    if (!entry.audioUrl && !entry.audioMeta?.text) return;
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
      {/* HDRI for cinematic IBL reflections */}
      <Environment preset="night" background />

      <StarField count={3000} radius={80} />
      <NebulaClouds count={10} radius={50} colors={['#0a1040', '#182060', '#0c0830', '#060420']} opacity={0.1} />
      <ambientLight intensity={0.1} color="#334466" />
      <directionalLight position={[0, 5, -3]} intensity={0.35} color="#4466aa" />
      <directionalLight position={[-4, 3, 2]} intensity={0.2} color="#442266" />

      {/* Dark reflective floor with blue emissive */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
        <circleGeometry args={[15, 32]} />
        <meshPhysicalMaterial color="#080816" emissive="#112244" emissiveIntensity={0.1} metalness={0.8} roughness={0.2} clearcoat={0.6} clearcoatRoughness={0.15} envMapIntensity={0.5} />
      </mesh>

      {/* Concentric glow rings on floor */}
      {[3, 5, 7, 10].map((radius, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.18, 0]}>
          <ringGeometry args={[radius - 0.02, radius + 0.02, 64]} />
          <meshBasicMaterial color="#2244AA" transparent opacity={0.15 - i * 0.025} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Energy Rings */}
      <EnergyRings />

      {/* Audio Waveform — visible during playback (decorative, no live data from parent) */}
      <AudioWaveform analyserData={null} />

      {/* Pulsar effect from hearth */}
      <PulsarEffect volume={0} />

      {/* Enhanced lighting */}
      <pointLight position={[0, -0.5, -2]} color="#2244AA" intensity={0.8} distance={12} />
      <pointLight position={[0, 5, -2]} color="#6644AA" intensity={0.6} distance={15} />

      {/* Energy Hearth — always visible */}
      <EnergyHearthScene />

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
      <BackToLobbyButton onBack={onBack} position={[0, -0.8, -1.5]} />
    </group>
  );
}
