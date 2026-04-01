import { useRef, useMemo, useState, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Interactive } from '@react-three/xr';
import * as THREE from 'three';
import { StarField } from '../components/StarField';
import { useStreamingAudio } from '../hooks/useStreamingAudio';

const TRACKS = [
  { name: 'Amazing Grace (Epic)', file: '/audio/amazing-grace-epic.mp3', color: '#FFD700' },
  { name: 'Dreams of Joseph', file: '/audio/dreams-of-joseph.mp3', color: '#4ECDC4' },
  { name: 'Eternal Echoes', file: '/audio/eternal-echoes.mp3', color: '#9944FF' },
  { name: 'Moses in the Desert', file: '/audio/moses-in-the-desert.mp3', color: '#FF6B6B' },
  { name: 'Wings of Stillness', file: '/audio/wings-of-stillness.mp3', color: '#45B7D1' },
  { name: 'White Horse', file: '/audio/white-horse.mp3', color: '#F0F0F0' },
  { name: 'When He Cometh', file: '/audio/when-he-cometh.mp3', color: '#82E0AA' },
  { name: 'The Ride', file: '/audio/the-ride.mp3', color: '#F0B27A' },
  { name: 'Flight', file: '/audio/flight.mp3', color: '#AED6F1' },
  { name: 'Follow', file: '/audio/follow.mp3', color: '#BB8FCE' },
  { name: 'Fly', file: '/audio/fly.mp3', color: '#85C1E9' },
];

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

interface TrackButtonProps {
  track: typeof TRACKS[number];
  position: [number, number, number];
  isActive: boolean;
  onSelect: () => void;
}

function TrackButton({ track, position, isActive, onSelect }: TrackButtonProps) {
  return (
    <group position={position}>
      <Interactive onSelect={onSelect}>
        <mesh onClick={onSelect}>
          <planeGeometry args={[2.2, 0.25]} />
          <meshStandardMaterial
            color={isActive ? track.color : '#1a1a2e'}
            emissive={track.color}
            emissiveIntensity={isActive ? 0.8 : 0.15}
          />
        </mesh>
      </Interactive>
      <Suspense fallback={null}>
        <Text position={[0, 0, 0.01]} fontSize={0.08} color={isActive ? '#000' : '#ddd'} anchorX="center" anchorY="middle">
          {isActive ? '♫ ' : ''}{track.name}
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

interface SpatialAudioPlayerProps {
  onBack: () => void;
}

export default function SpatialAudioPlayer({ onBack }: SpatialAudioPlayerProps) {
  const [trackIndex, setTrackIndex] = useState(0);
  const currentTrack = TRACKS[trackIndex];
  const [audioState, audioControls] = useStreamingAudio(currentTrack.file);

  const fireRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (fireRef.current) {
      const t = clock.getElapsedTime();
      fireRef.current.intensity = 2 + Math.sin(t * 8) * 0.5 + Math.sin(t * 12) * 0.3;
    }
  });

  const selectTrack = (idx: number) => {
    audioControls.pause();
    setTrackIndex(idx);
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

      {/* Campfire */}
      <group position={[0, -1.2, -2]}>
        <pointLight ref={fireRef} position={[0, 0.5, 0]} color="#FF4400" intensity={2.5} distance={10} castShadow />
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshBasicMaterial color="#FF6600" transparent opacity={0.6} />
        </mesh>
        <CampfireParticles />
        {/* Stone ring */}
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

      {/* Title */}
      <Suspense fallback={null}>
        <Text position={[0, 2.5, -2]} fontSize={0.25} color="#e8d5b7" anchorX="center" outlineWidth={0.01} outlineColor="#000">
          Audio Theater
        </Text>
        <Text position={[0, 2.2, -2]} fontSize={0.1} color="#888" anchorX="center">
          Select a track and sit by the fire
        </Text>
      </Suspense>

      {/* Now Playing + Controls */}
      <Suspense fallback={null}>
        <Text position={[0, 1.8, -2]} fontSize={0.08} color={currentTrack.color} anchorX="center">
          Now: {currentTrack.name}
        </Text>
        <Text position={[0, 1.55, -2]} fontSize={0.06} color="#aaa" anchorX="center">
          {formatTime(audioState.currentTime)} / {formatTime(audioState.duration)}
          {audioState.isLoading ? '  Loading...' : ''}
        </Text>
      </Suspense>

      {/* Play/Pause button */}
      <Interactive onSelect={audioControls.togglePlayPause}>
        <mesh position={[0, 1.35, -2]} onClick={audioControls.togglePlayPause}>
          <circleGeometry args={[0.12, 32]} />
          <meshStandardMaterial
            color={audioState.isPlaying ? '#FF4444' : '#44FF44'}
            emissive={audioState.isPlaying ? '#FF4444' : '#44FF44'}
            emissiveIntensity={0.5}
          />
        </mesh>
      </Interactive>
      <Suspense fallback={null}>
        <Text position={[0, 1.35, -1.98]} fontSize={0.07} color="white" anchorX="center" anchorY="middle">
          {audioState.isPlaying ? '⏸' : '▶'}
        </Text>
      </Suspense>

      {/* Track list — arranged as a curved panel to the left */}
      <group position={[-2.5, 0.8, -1.5]} rotation={[0, 0.4, 0]}>
        {TRACKS.map((track, i) => (
          <TrackButton
            key={track.file}
            track={track}
            position={[0, -i * 0.3, 0]}
            isActive={i === trackIndex}
            onSelect={() => selectTrack(i)}
          />
        ))}
      </group>

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
