import { useRef, useMemo, useState, useCallback, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Interactive } from '@react-three/xr';
import * as THREE from 'three';
import { StarField } from '../components/StarField';
import { NebulaClouds } from '../components/NebulaClouds';
import { BackToLobbyButton } from '../components/BackToLobbyButton';
import { useStreamingAudio } from '../hooks/useStreamingAudio';
import { callJeeves } from '@/lib/jeevesClient';
import { supabase } from '@/integrations/supabase/client';
import { WATCH_TRACTS, type MorningWatchSession } from '@/data/watchSeries';

interface MorningWatchVRProps {
  onBack: () => void;
}

function buildPrompt(session: MorningWatchSession, tractName: string): string {
  return `Generate a Morning Watch activation script to be read aloud as audio.
Title: ${session.title}
Series: ${tractName}, Day ${session.dayNumber}
Paired Night Watch: "${session.pairedNightTitle}"
Night Insight: ${session.nightInsight}
Morning Scripture: ${session.morningScripture}
Activation Principle: ${session.activationPrinciple}
Energy: ${session.energy}

Structure the script in 5 phases (no time stamps, no duration labels — just flow naturally):
1. REMEMBER — Brief recall of last night's Master Mind insight.
2. TRUTH DECLARATION — Core Scripture spoken with weight, followed by an identity statement.
3. MENTAL ALIGNMENT — Translate the pattern into today's thinking.
4. REAL-LIFE SCENARIOS — 3 distinct scenarios: situation, old reaction, then the Master Mind response.
5. COMMITMENT — Brief, resolute, memorable.

CRITICAL RULES:
- Write in complete, flowing sentences. Not fragments or bullet-style phrases.
- Include [pause] markers generously between sentences and sections.
- Do NOT include any time references. The listener should not be aware of time.
- Do NOT include stage directions, section headers, or meta-commentary. Only words to be spoken aloud.
- The Master Mind = the mind of Christ (Philippians 2:5).
- Tone should be CLEAR and DIRECT, not dreamy. Energy: ${session.energy}.
- Use "you" throughout. Second person. End with resolve, not a question.`;
}

async function generateTTSUrl(script: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.functions.invoke('text-to-speech', {
      body: { text: script.trim(), voice: 'onyx', provider: 'openai', speed: 0.9, useCache: true },
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
    console.error('[MorningWatchVR] TTS error:', err);
    return null;
  }
}

// ── Visual: Sunrise particles ──

function SunriseParticles({ count = 40, brightness = 1 }: { count?: number; brightness?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() =>
    Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 10,
      y: Math.random() * 5 - 1,
      z: (Math.random() - 0.5) * 10 - 2,
      speed: 0.03 + Math.random() * 0.07,
      wobble: Math.random() * Math.PI * 2,
      scale: 0.015 + Math.random() * 0.03,
    })),
  [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.3 + brightness * 0.4;
    particles.forEach((p, i) => {
      const y = ((p.y + p.speed * t) % 6) - 1;
      dummy.position.set(
        p.x + Math.sin(t * 0.3 + p.wobble) * 0.3,
        y,
        p.z + Math.cos(t * 0.2 + p.wobble) * 0.3,
      );
      dummy.scale.setScalar(p.scale * (0.8 + brightness * 0.4));
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#f59e0b" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
    </instancedMesh>
  );
}

function HorizonGlow({ brightness = 0 }: { brightness?: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.08 + Math.sin(t * 0.3) * 0.03 + brightness * 0.05;
  });

  return (
    <mesh ref={ref} position={[0, -0.5, -15]} rotation={[-0.2, 0, 0]}>
      <planeGeometry args={[40, 8]} />
      <meshBasicMaterial color="#f59e0b" transparent opacity={0.08} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

type Screen = 'menu' | 'playing';

function formatTime(s: number): string {
  if (!s || !isFinite(s)) return '0:00';
  return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
}

export default function MorningWatchVR({ onBack }: MorningWatchVRProps) {
  const [screen, setScreen] = useState<Screen>('menu');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [activeSession, setActiveSession] = useState<{ session: MorningWatchSession; tractName: string } | null>(null);

  const [audioState, audioControls] = useStreamingAudio(audioUrl || '');

  const quickSessions = useMemo(() => {
    const tract = WATCH_TRACTS.find((t) => t.mornings && t.mornings.length > 0);
    if (!tract || !tract.mornings) return [];
    return tract.mornings.slice(0, 7).map((s) => ({ session: s, tractName: tract.name }));
  }, []);

  const avgVolume = useMemo(() => {
    if (!audioState.analyserData) return 0;
    const sum = audioState.analyserData.reduce((a: number, b: number) => a + b, 0);
    return sum / audioState.analyserData.length / 255;
  }, [audioState.analyserData]);

  const handleSelectSession = useCallback(async (session: MorningWatchSession, tractName: string) => {
    setGenerating(true);
    setStatusText('Generating activation script...');
    setActiveSession({ session, tractName });

    try {
      const prompt = buildPrompt(session, tractName);
      const { data, error } = await callJeeves(
        { mode: 'morning-watch', message: prompt },
        'morning-watches',
      );
      if (error) throw new Error(String(error));

      const d = data as Record<string, unknown> | string | null;
      const script = typeof d === 'string' ? d : d ? String((d as any).response || (d as any).result || JSON.stringify(d)) : '';
      if (!script) throw new Error('Empty script');

      setStatusText('Converting to audio...');
      const url = await generateTTSUrl(script);
      if (!url) throw new Error('TTS failed');

      setAudioUrl(url);
      setScreen('playing');
      setStatusText('');
      setTimeout(() => audioControls.play(), 500);
    } catch (err) {
      console.error('[MorningWatchVR]', err);
      setStatusText('Generation failed. Tap a session to retry.');
    } finally {
      setGenerating(false);
    }
  }, [audioControls]);

  return (
    <group>
      {/* Stars fading into dawn */}
      <StarField count={1500} radius={60} brightness={screen === 'playing' ? 0.3 + avgVolume * 0.2 : 0.4} />
      <NebulaClouds count={6} radius={30} colors={['#92400e', '#78350f', '#7c2d12', '#451a03']} opacity={0.08 + avgVolume * 0.06} />

      <HorizonGlow brightness={avgVolume} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a0f05" metalness={0.3} roughness={0.6} />
      </mesh>

      {/* Lighting — warm sunrise */}
      <ambientLight intensity={0.2} color="#fef3c7" />
      <pointLight position={[0, 3, -6]} intensity={0.6 + avgVolume * 0.4} color="#f59e0b" distance={15} />
      <pointLight position={[-3, 2, -4]} intensity={0.3 + avgVolume * 0.2} color="#d97706" distance={8} />

      <SunriseParticles brightness={screen === 'playing' ? 0.5 + avgVolume * 0.5 : 0.6} />

      {/* ─── MENU SCREEN ─── */}
      {screen === 'menu' && (
        <Suspense fallback={null}>
          <Text position={[0, 2.4, -4]} fontSize={0.3} color="#f59e0b" anchorX="center" outlineWidth={0.01} outlineColor="#000">
            Morning Watch
          </Text>
          <Text position={[0, 2.05, -4]} fontSize={0.1} color="#d97706" anchorX="center">
            Select a session to begin your activation
          </Text>

          {statusText && (
            <Text position={[0, 1.75, -4]} fontSize={0.09} color="#fbbf24" anchorX="center">
              {statusText}
            </Text>
          )}

          {quickSessions.map((qs, i) => {
            const x = (i - 3) * 0.9;
            return (
              <group key={qs.session.dayNumber} position={[x, 1.2, -4]}>
                <Interactive onSelect={() => !generating && handleSelectSession(qs.session, qs.tractName)}>
                  <mesh
                    onClick={() => !generating && handleSelectSession(qs.session, qs.tractName)}
                    onPointerDown={() => !generating && handleSelectSession(qs.session, qs.tractName)}
                  >
                    <planeGeometry args={[0.75, 0.6]} />
                    <meshStandardMaterial color="#1a0f05" emissive="#f59e0b" emissiveIntensity={generating ? 0.05 : 0.15} />
                  </mesh>
                </Interactive>
                <Text position={[0, 0.12, 0.01]} fontSize={0.12} color="#fbbf24" anchorX="center" anchorY="middle">
                  Day {qs.session.dayNumber}
                </Text>
                <Text position={[0, -0.06, 0.01]} fontSize={0.05} color="#d97706" anchorX="center" anchorY="middle" maxWidth={0.65}>
                  {qs.session.title}
                </Text>
                <Text position={[0, -0.2, 0.01]} fontSize={0.04} color="#92400e" anchorX="center" anchorY="middle" maxWidth={0.65}>
                  {qs.session.morningScripture}
                </Text>
              </group>
            );
          })}
        </Suspense>
      )}

      {/* ─── PLAYING SCREEN ─── */}
      {screen === 'playing' && activeSession && (
        <Suspense fallback={null}>
          <Text position={[0, 2.4, -4]} fontSize={0.22} color="#f59e0b" anchorX="center" outlineWidth={0.008} outlineColor="#000">
            {activeSession.session.title}
          </Text>
          <Text position={[0, 2.1, -4]} fontSize={0.1} color="#d97706" anchorX="center">
            {activeSession.tractName} — Day {activeSession.session.dayNumber}
          </Text>
          <Text position={[0, 1.8, -4]} fontSize={0.08} color="#92400e" anchorX="center">
            {activeSession.session.morningScripture}
          </Text>

          {/* Play/Pause */}
          <Interactive onSelect={audioControls.togglePlayPause}>
            <mesh position={[0, 1.2, -3.5]} onClick={audioControls.togglePlayPause} onPointerDown={audioControls.togglePlayPause}>
              <circleGeometry args={[0.2, 32]} />
              <meshStandardMaterial
                color={audioState.isPlaying ? '#d97706' : '#f59e0b'}
                emissive={audioState.isPlaying ? '#d97706' : '#f59e0b'}
                emissiveIntensity={0.6 + avgVolume * 0.4}
              />
            </mesh>
          </Interactive>
          <Text position={[0, 1.2, -3.48]} fontSize={0.12} color="white" anchorX="center" anchorY="middle">
            {audioState.isPlaying ? '⏸' : '▶'}
          </Text>

          <Text position={[0, 0.85, -3.5]} fontSize={0.07} color="#fbbf24" anchorX="center">
            {formatTime(audioState.currentTime)} / {formatTime(audioState.duration)}
            {audioState.isLoading ? '  Loading...' : ''}
          </Text>

          {/* Back to session select */}
          <Interactive onSelect={() => { audioControls.pause(); setScreen('menu'); setAudioUrl(null); }}>
            <mesh
              position={[0, 0.55, -3.5]}
              onClick={() => { audioControls.pause(); setScreen('menu'); setAudioUrl(null); }}
              onPointerDown={() => { audioControls.pause(); setScreen('menu'); setAudioUrl(null); }}
            >
              <planeGeometry args={[1.2, 0.25]} />
              <meshStandardMaterial color="#1a0f05" emissive="#92400e" emissiveIntensity={0.1} />
            </mesh>
          </Interactive>
          <Text position={[0, 0.55, -3.48]} fontSize={0.08} color="#d97706" anchorX="center" anchorY="middle">
            Choose Another Session
          </Text>
        </Suspense>
      )}

      <BackToLobbyButton onBack={onBack} position={[0, -0.3, -1.2]} />
    </group>
  );
}
