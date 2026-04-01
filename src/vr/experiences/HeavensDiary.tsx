import { useMemo, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Interactive } from '@react-three/xr';
import * as THREE from 'three';
import { StarField } from '../components/StarField';
import { NebulaClouds } from '../components/NebulaClouds';
import { useStreamingAudio } from '../hooks/useStreamingAudio';

// The audio file URL — in production this should be a hosted/streamed URL
const AUDIO_SRC = '/audio/heavens-diary.m4a';

interface HeavensDiaryProps {
  onBack: () => void;
}

// Phase-based color palettes
function getPhaseColors(progress: number): {
  nebula: string[];
  ambient: string;
  fogColor: string;
  starBrightness: number;
} {
  if (progress < 0.2) {
    // Earth departure: blue to black
    const t = progress / 0.2;
    return {
      nebula: ['#0044aa', '#002266', '#001144'],
      ambient: `#${Math.floor(0x22 * (1 - t)).toString(16).padStart(2, '0')}${Math.floor(0x44 * (1 - t)).toString(16).padStart(2, '0')}${Math.floor(0x88 * (1 - t)).toString(16).padStart(2, '0')}`,
      fogColor: '#000011',
      starBrightness: 0.3 + t * 0.7,
    };
  } else if (progress < 0.5) {
    // Deep space cruise
    return {
      nebula: ['#1a0044', '#003366', '#004422'],
      ambient: '#111122',
      fogColor: '#000008',
      starBrightness: 1,
    };
  } else if (progress < 0.8) {
    // Cosmic wonder
    const t = (progress - 0.5) / 0.3;
    return {
      nebula: ['#660088', '#0066cc', '#cc4400', '#009944'],
      ambient: '#1a1133',
      fogColor: '#0a0818',
      starBrightness: 0.8 + t * 0.2,
    };
  } else {
    // Arrival — golden light
    const t = (progress - 0.8) / 0.2;
    return {
      nebula: ['#FFD700', '#FFA500', '#FFEE88'],
      ambient: `#${Math.floor(0x33 + t * 0x44).toString(16).padStart(2, '0')}${Math.floor(0x22 + t * 0x33).toString(16).padStart(2, '0')}00`,
      fogColor: '#1a1100',
      starBrightness: 1 - t * 0.5, // Stars fade as golden light intensifies
    };
  }
}

function ProgressRing({ progress }: { progress: number }) {
  const geometry = useMemo(() => {
    return new THREE.RingGeometry(1.8, 1.85, 64, 1, 0, progress * Math.PI * 2);
  }, [progress]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <primitive object={geometry} attach="geometry" />
      <meshBasicMaterial
        color="#44FFEE"
        transparent
        opacity={0.4}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function GoldenLightTunnel({ intensity }: { intensity: number }) {
  if (intensity <= 0) return null;

  return (
    <group>
      {/* Central golden glow */}
      <mesh position={[0, 0, -20]}>
        <sphereGeometry args={[3 + intensity * 5, 16, 16]} />
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={intensity * 0.3}
          side={THREE.BackSide}
        />
      </mesh>
      <pointLight
        position={[0, 0, -15]}
        color="#FFD700"
        intensity={intensity * 5}
        distance={40}
      />
      {/* Light rays (simple cones) */}
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 4,
              Math.sin(angle) * 4,
              -25,
            ]}
            rotation={[0, 0, angle]}
          >
            <coneGeometry args={[0.5 + intensity * 2, 15, 4]} />
            <meshBasicMaterial
              color="#FFD700"
              transparent
              opacity={intensity * 0.1}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export default function HeavensDiary({ onBack }: HeavensDiaryProps) {
  const [audioState, audioControls] = useStreamingAudio(AUDIO_SRC);

  // Compute average volume from analyser
  const avgVolume = useMemo(() => {
    if (!audioState.analyserData) return 0;
    const sum = audioState.analyserData.reduce((a, b) => a + b, 0);
    return sum / audioState.analyserData.length / 255;
  }, [audioState.analyserData]);

  const phase = getPhaseColors(audioState.progress);
  const arrivalIntensity = audioState.progress > 0.8 ? (audioState.progress - 0.8) / 0.2 : 0;

  // Compute phase label
  const phaseLabel = audioState.progress < 0.2
    ? 'Earth Departure'
    : audioState.progress < 0.5
      ? 'Deep Space'
      : audioState.progress < 0.8
        ? 'Cosmic Wonder'
        : 'Arrival';

  return (
    <group>
      {/* Dynamic ambient light */}
      <ambientLight intensity={0.1} color={phase.ambient} />

      {/* Star field with audio-reactive brightness */}
      <StarField
        count={2000}
        radius={50}
        brightness={phase.starBrightness * (1 + avgVolume * 0.3)}
      />

      {/* Nebula clouds — colors and opacity change with progress */}
      <NebulaClouds
        count={15}
        radius={35}
        colors={phase.nebula}
        opacity={0.1 + avgVolume * 0.15}
      />

      {/* Golden light tunnel for arrival phase */}
      <GoldenLightTunnel intensity={arrivalIntensity} />

      {/* Earth departure atmosphere (blue glow below at start) */}
      {audioState.progress < 0.25 && (
        <mesh position={[0, -20, 0]}>
          <sphereGeometry args={[15, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshBasicMaterial
            color="#2244aa"
            transparent
            opacity={0.3 * (1 - audioState.progress / 0.25)}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* Progress ring around user */}
      <ProgressRing progress={audioState.progress} />

      {/* Title and controls */}
      <Text
        position={[0, 2.5, -3]}
        fontSize={0.25}
        color="#44FFEE"
        anchorX="center"
        outlineWidth={0.01}
        outlineColor="#000"
      >
        Heaven's Diary
      </Text>

      {/* Phase indicator */}
      <Text
        position={[0, 2.1, -3]}
        fontSize={0.1}
        color="#888"
        anchorX="center"
      >
        {phaseLabel}
      </Text>

      {/* Play/Pause button — XR compatible */}
      <Interactive onSelect={audioControls.togglePlayPause}>
        <mesh
          position={[0, 1.5, -3]}
          onClick={audioControls.togglePlayPause}
        >
          <circleGeometry args={[0.15, 32]} />
          <meshStandardMaterial
            color={audioState.isPlaying ? '#FF4444' : '#44FF44'}
            emissive={audioState.isPlaying ? '#FF4444' : '#44FF44'}
            emissiveIntensity={0.5}
          />
        </mesh>
      </Interactive>
      <Text
        position={[0, 1.5, -2.98]}
        fontSize={0.08}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {audioState.isPlaying ? '⏸' : '▶'}
      </Text>

      {/* Time display */}
      <Text
        position={[0, 1.2, -3]}
        fontSize={0.06}
        color="#aaa"
        anchorX="center"
      >
        {formatTime(audioState.currentTime)} / {formatTime(audioState.duration)}
      </Text>

      {/* Loading indicator */}
      {audioState.isLoading && (
        <Text
          position={[0, 1.0, -3]}
          fontSize={0.06}
          color="#FFD700"
          anchorX="center"
        >
          Loading audio...
        </Text>
      )}

      {/* Back button — XR compatible */}
      <Interactive onSelect={onBack}>
        <mesh position={[0, 0.2, 2]} onClick={onBack}>
          <planeGeometry args={[1.5, 0.3]} />
          <meshBasicMaterial color="#331111" />
        </mesh>
      </Interactive>
      <Suspense fallback={null}>
        <Text position={[0, 0.2, 2.01]} fontSize={0.1} color="#FF6666" anchorX="center">
          ← Back to Lobby
        </Text>
      </Suspense>
    </group>
  );
}

function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
