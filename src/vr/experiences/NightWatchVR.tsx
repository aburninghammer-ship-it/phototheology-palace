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
import { WATCH_TRACTS, type WatchSession, type WatchTract } from '@/data/watchSeries';

interface NightWatchVRProps {
  onBack: () => void;
}

// ── Audio generation (same pipeline as useWatchPlayer) ──

function buildPrompt(session: WatchSession, tractName: string): string {
  return `Generate a 15-minute Night Watch meditation script to be read aloud as audio. This must be LONG — approximately 2,500 to 3,000 words. Do NOT cut it short.

Title: ${session.title}
Series: ${tractName}, Day ${session.dayNumber}
Scripture: ${session.scripture}
Scene: ${session.scene}
Master Mind Insight: ${session.masterMindInsight}
Mood: ${session.mood}
Primary Struggle: ${session.struggle}

Follow this 7-phase structure inspired by the Calm app. Each phase flows naturally into the next — no labels, no headers, no time references. Just seamless spoken narration.

PHASE 1 — SETTLING AND FRAMING (~2 minutes of audio):
Begin with a warm welcome. Invite the listener to get comfortable and be still. You may mention one calming breath, but do NOT dwell on breathing technique as if it has mystical power. Move quickly into framing the purpose:

Explain that this is a Night Watch — a practice of beholding the thoughts and feelings of Christ. Biblical meditation is not about emptying the mind or breathing exercises. It is about filling the mind with the thoughts of Jesus. The goal tonight is to step into a scene from Scripture, observe how Christ thinks and feels, and begin to take those thoughts and feelings as your own. "Let this mind be in you which was also in Christ Jesus" (Philippians 2:5). Tonight, you are accessing the Master Mind. [pause]

Then briefly introduce tonight's specific theme and Scripture (${session.scripture}), connecting it to ${session.struggle}.

PHASE 2 — TEACHING (~2 minutes):
Go deeper into the Scripture and tonight's theme. Weave in the Scripture naturally. Connect it to the human experience of ${session.struggle}. This should feel like a wise friend sharing insight by firelight.

PHASE 3 — TRANSITION TO SCENE (~1 minute):
Gently shift from teaching into immersive experience. Bridge the listener from intellectual understanding into embodied imagination. Pacing begins to slow here.

PHASE 4 — SCENE IMMERSION (~4 minutes):
Present-tense, sensory-rich narration of the biblical scene (${session.scene}). Paint the setting with vivid detail. Place the listener inside the scene as a witness. Let them observe Christ. Pacing should be notably slower, with [long pause] after every 2-3 sentences. Let images breathe.

PHASE 5 — MASTER MIND MOMENT (~3 minutes):
This is the heart. Observe what Christ does. The Master Mind insight: ${session.masterMindInsight}. Speak this truth over the listener. Address ${session.struggle} with direct compassion. Use very long pauses here. Minimal words, maximum weight.

PHASE 6 — OPEN AWARENESS / SILENCE (~2.5 minutes):
Reduce verbal guidance dramatically. Offer a single gentle prompt, then [long pause] [long pause] [long pause] for extended silence. Another brief prompt. Another long silence. Only 3-4 sentences total in this phase.

PHASE 7 — GENTLE RETURN AND CLOSE (~1.5 minutes):
Slowly bring awareness back. Brief closing reflection tying back to the opening theme. End with an identity statement rooted in Scripture. Final breath together. Soft close.

CRITICAL RULES:
- THIS MUST BE 2,500-3,000 WORDS. A 15-minute meditation requires substantial content. Do NOT write a short script.
- Write in complete, flowing sentences. Every thought should read naturally when spoken aloud.
- Use TWO types of pause markers:
  [pause] = 3-5 seconds of silence (use frequently, after every 1-2 sentences)
  [long pause] = 10-20 seconds of silence (use in phases 5-6, and between breaths in phase 1)
- The pacing must DECELERATE through the session. Phases 1-2: conversational. Phases 3-4: noticeably slower. Phases 5-6: very slow, spacious. Phase 7: gentle return.
- Do NOT include any time references, section headers, stage directions, or meta-commentary. Only words to be spoken aloud plus pause markers.
- This is BIBLICAL meditation — beholding the thoughts and feelings of Christ and making them your own. NOT emptying the mind, NOT breathing exercises. The power is in what you behold, not how you breathe.
- The Master Mind = the mind of Christ (Philippians 2:5). The goal is to ACCESS His thoughts and feelings and take them as your own.
- Do NOT spend more than one sentence on breathing. Get to the Scripture and Christ quickly.
- Second person ("you") throughout. Intimate. Cinematic.`;
}

async function generateTTSUrl(script: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.functions.invoke('text-to-speech', {
      body: { text: script.trim(), voice: 'nova', provider: 'openai', speed: 1.0, useCache: true },
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
    console.error('[NightWatchVR] TTS error:', err);
    return null;
  }
}

// ── Visual components ──

function MeditationParticles({ count = 40, brightness = 1 }: { count?: number; brightness?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() =>
    Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 10,
      y: Math.random() * 5 - 1,
      z: (Math.random() - 0.5) * 10 - 2,
      speed: 0.02 + Math.random() * 0.06,
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
      <meshBasicMaterial color="#8b5cf6" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
    </instancedMesh>
  );
}

// ── Screens ──

type Screen = 'menu' | 'playing';

function formatTime(s: number): string {
  if (!s || !isFinite(s)) return '0:00';
  return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
}

export default function NightWatchVR({ onBack }: NightWatchVRProps) {
  const [screen, setScreen] = useState<Screen>('menu');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [activeSession, setActiveSession] = useState<{ session: WatchSession; tractName: string } | null>(null);

  const [audioState, audioControls] = useStreamingAudio(audioUrl || '');

  // Get tracts that have night sessions
  const availableTracts = useMemo(() =>
    WATCH_TRACTS.filter((t) => t.sessions.length > 0),
  []);

  // Flatten first 7 sessions from the free tract for quick access
  const quickSessions = useMemo(() => {
    const free = availableTracts.find((t) => t.isFree);
    if (!free) return [];
    return free.sessions.slice(0, 7).map((s) => ({ session: s, tractName: free.name, tractId: free.id }));
  }, [availableTracts]);

  const avgVolume = useMemo(() => {
    if (!audioState.analyserData) return 0;
    const sum = audioState.analyserData.reduce((a: number, b: number) => a + b, 0);
    return sum / audioState.analyserData.length / 255;
  }, [audioState.analyserData]);

  const handleSelectSession = useCallback(async (session: WatchSession, tractName: string) => {
    setGenerating(true);
    setStatusText('Generating meditation script...');
    setActiveSession({ session, tractName });

    try {
      const prompt = buildPrompt(session, tractName);
      const { data, error } = await callJeeves(
        { mode: 'night-watch', message: prompt },
        'night-watches',
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
      // Auto-play after a brief delay for the audio element to load
      setTimeout(() => audioControls.play(), 500);
    } catch (err) {
      console.error('[NightWatchVR]', err);
      setStatusText('Generation failed. Tap a session to retry.');
    } finally {
      setGenerating(false);
    }
  }, [audioControls]);

  return (
    <group>
      {/* Deep space backdrop */}
      <StarField count={2500} radius={60} brightness={screen === 'playing' ? 0.6 + avgVolume * 0.4 : 0.8} />
      <NebulaClouds count={8} radius={35} colors={['#2e1065', '#312e81', '#1e1b4b', '#4c1d95']} opacity={0.1 + avgVolume * 0.1} />

      {/* Subtle floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0a0a20" metalness={0.3} roughness={0.6} />
      </mesh>

      {/* Lighting */}
      <ambientLight intensity={0.15} color="#ccccee" />
      <pointLight position={[0, 3, -2]} intensity={0.4 + avgVolume * 0.3} color="#6366f1" distance={12} />
      <pointLight position={[-3, 2, -4]} intensity={0.3 + avgVolume * 0.2} color="#8b5cf6" distance={8} />

      <MeditationParticles brightness={screen === 'playing' ? 0.5 + avgVolume * 0.5 : 0.6} />

      {/* ─── MENU SCREEN ─── */}
      {screen === 'menu' && (
        <Suspense fallback={null}>
          <Text position={[0, 2.4, -4]} fontSize={0.3} color="#8b5cf6" anchorX="center" outlineWidth={0.01} outlineColor="#000">
            Night Watch
          </Text>
          <Text position={[0, 2.05, -4]} fontSize={0.1} color="#6366f1" anchorX="center">
            Select a session to begin your meditation
          </Text>

          {/* Status text */}
          {statusText && (
            <Text position={[0, 1.75, -4]} fontSize={0.09} color="#a78bfa" anchorX="center">
              {statusText}
            </Text>
          )}

          {/* Session buttons — arranged in a row */}
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
                    <meshStandardMaterial
                      color="#0f0a2a"
                      emissive="#6366f1"
                      emissiveIntensity={generating ? 0.05 : 0.15}
                    />
                  </mesh>
                </Interactive>
                <Text position={[0, 0.12, 0.01]} fontSize={0.12} color="#a78bfa" anchorX="center" anchorY="middle">
                  Day {qs.session.dayNumber}
                </Text>
                <Text position={[0, -0.06, 0.01]} fontSize={0.05} color="#7c3aed" anchorX="center" anchorY="middle" maxWidth={0.65}>
                  {qs.session.title}
                </Text>
                <Text position={[0, -0.2, 0.01]} fontSize={0.04} color="#4c1d95" anchorX="center" anchorY="middle" maxWidth={0.65}>
                  {qs.session.scripture}
                </Text>
              </group>
            );
          })}

          {/* Generating spinner indicator */}
          {generating && (
            <group position={[0, 0.5, -3]}>
              <mesh>
                <torusGeometry args={[0.15, 0.02, 8, 32]} />
                <meshBasicMaterial color="#8b5cf6" transparent opacity={0.6} />
              </mesh>
            </group>
          )}
        </Suspense>
      )}

      {/* ─── PLAYING SCREEN ─── */}
      {screen === 'playing' && activeSession && (
        <Suspense fallback={null}>
          {/* Session title */}
          <Text position={[0, 2.4, -4]} fontSize={0.22} color="#8b5cf6" anchorX="center" outlineWidth={0.008} outlineColor="#000">
            {activeSession.session.title}
          </Text>
          <Text position={[0, 2.1, -4]} fontSize={0.1} color="#6366f1" anchorX="center">
            {activeSession.tractName} — Day {activeSession.session.dayNumber}
          </Text>

          {/* Floating scripture reference */}
          <Text position={[0, 1.8, -4]} fontSize={0.08} color="#4338ca" anchorX="center">
            {activeSession.session.scripture}
          </Text>

          {/* Play/Pause button */}
          <Interactive onSelect={audioControls.togglePlayPause}>
            <mesh position={[0, 1.2, -3.5]} onClick={audioControls.togglePlayPause} onPointerDown={audioControls.togglePlayPause}>
              <circleGeometry args={[0.2, 32]} />
              <meshStandardMaterial
                color={audioState.isPlaying ? '#7c3aed' : '#8b5cf6'}
                emissive={audioState.isPlaying ? '#7c3aed' : '#8b5cf6'}
                emissiveIntensity={0.6 + avgVolume * 0.4}
              />
            </mesh>
          </Interactive>
          <Text position={[0, 1.2, -3.48]} fontSize={0.12} color="white" anchorX="center" anchorY="middle">
            {audioState.isPlaying ? '⏸' : '▶'}
          </Text>

          {/* Time display */}
          <Text position={[0, 0.85, -3.5]} fontSize={0.07} color="#a78bfa" anchorX="center">
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
              <meshStandardMaterial color="#0f0a2a" emissive="#4338ca" emissiveIntensity={0.1} />
            </mesh>
          </Interactive>
          <Text position={[0, 0.55, -3.48]} fontSize={0.08} color="#7c3aed" anchorX="center" anchorY="middle">
            Choose Another Session
          </Text>
        </Suspense>
      )}

      <BackToLobbyButton onBack={onBack} position={[0, -0.3, -1.2]} />
    </group>
  );
}
