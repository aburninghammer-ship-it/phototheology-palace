import { useRef, useMemo, useState, useCallback, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Environment } from '@react-three/drei';
import { Interactive } from '@react-three/xr';
import * as THREE from 'three';
import { StarField } from '../components/StarField';
import { NebulaClouds } from '../components/NebulaClouds';
import { BackToLobbyButton } from '../components/BackToLobbyButton';
import { useStreamingAudio } from '../hooks/useStreamingAudio';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';
import { callJeeves } from '@/lib/jeevesClient';
import { supabase } from '@/integrations/supabase/client';
import { WATCH_TRACTS, type WatchSession, type WatchTract } from '@/data/watchSeries';

interface NightWatchVRProps {
  onBack: () => void;
}

// ── Audio generation (same pipeline as useWatchPlayer) ──

function buildPrompt(session: WatchSession, tractName: string): string {
  return `Generate a 12-minute Night Watch meditation script to be read aloud as audio. This must be LONG — approximately 2,000 to 2,500 words of spoken content, PLUS generous silence. Do NOT cut it short.

IMPORTANT: Ambient music plays underneath the entire meditation. You do NOT need to fill every moment with words. Include EXTENDED SILENCES of 30-60 seconds where the music plays alone and the listener simply rests in what has been said. These musical interludes are not awkward gaps — they are sacred space. The music carries the meditation during these silences.

Title: ${session.title}
Series: ${tractName}, Day ${session.dayNumber}
Scripture: ${session.scripture}
Scene: ${session.scene}
Master Mind Insight: ${session.masterMindInsight}
Mood: ${session.mood}
Primary Struggle: ${session.struggle}

Follow this 7-phase structure inspired by the Calm app. Each phase flows naturally into the next — no labels, no headers, no time references. Just seamless spoken narration with generous silence.

PHASE 1 — SETTLING AND FRAMING (~2 minutes of audio):
Begin with a warm welcome. Invite the listener to get comfortable and be still. You may mention one calming breath, but do NOT dwell on breathing technique as if it has mystical power. Move quickly into framing the purpose:

Explain that this is a Night Watch — a practice of beholding the mind of Christ. Our deepest goal as believers is to become like Christ in character. And character is made up of thoughts and feelings — how a person thinks, what moves them, what they feel in the face of pressure, loss, joy, or injustice. To become like Christ, we must behold Him — not just His actions, but the thoughts behind those actions and the feelings that drove them. That is what biblical meditation is: fixing your gaze on Jesus, watching how He thinks and feels, and letting those thoughts and feelings reshape your own from the inside out. "Let this mind be in you which was also in Christ Jesus" (Philippians 2:5). Tonight, you are stepping into a scene from Scripture to observe the inner life of Christ — His Master Mind — and begin to take His thoughts and feelings as your own. [pause]

Then briefly introduce tonight's specific theme and Scripture (${session.scripture}), connecting it to ${session.struggle}.

PHASE 2 — TEACHING (~2 minutes):
Go deeper into the Scripture and tonight's theme. Weave in the Scripture naturally. Connect it to the human experience of ${session.struggle}. This should feel like a wise friend sharing insight by firelight.
End this phase with [extended silence] — let the music carry the listener for 30-45 seconds.

PHASE 3 — TRANSITION TO SCENE (~1 minute):
Gently shift from teaching into immersive experience. Bridge the listener from intellectual understanding into embodied imagination. Pacing begins to slow here.

PHASE 4 — SCENE IMMERSION (~3 minutes):
Present-tense, sensory-rich narration of the biblical scene (${session.scene}). Paint the setting with vivid detail. Place the listener inside the scene as a witness. Let them observe Christ. Pacing should be notably slower, with [long pause] after every 2-3 sentences. Let images breathe.
After the scene is painted, include [extended silence] — 45-60 seconds of pure music while the listener remains in the scene.

PHASE 5 — MASTER MIND MOMENT (~2 minutes):
This is the heart. Observe what Christ does. The Master Mind insight: ${session.masterMindInsight}. Speak this truth over the listener. Address ${session.struggle} with direct compassion. Use very long pauses here. Minimal words, maximum weight.
End with [extended silence] — 30-45 seconds of music.

PHASE 6 — OPEN AWARENESS / SILENCE (~1.5 minutes):
Reduce verbal guidance dramatically. Offer a single gentle prompt, then [extended silence] for 45-60 seconds. Only 1-2 sentences total in this phase. Let the music hold the space.

PHASE 7 — GENTLE RETURN AND CLOSE (~1 minute):
Slowly bring awareness back. Brief closing reflection tying back to the opening theme. End with an identity statement rooted in Scripture. Final breath together. Soft close.

CRITICAL RULES:
- Total meditation is 12 minutes. Spoken content should be ~2,000-2,500 words. The remaining time is filled by SILENCE where ambient music plays alone.
- Write in complete, flowing sentences. Every thought should read naturally when spoken aloud.
- Use THREE types of pause markers:
  [pause] = 3-5 seconds of silence (use frequently, after every 1-2 sentences)
  [long pause] = 10-20 seconds of silence (use in phases 4-5, and between breaths in phase 1)
  [extended silence] = 30-60 seconds where ONLY the background music plays. Use at least 3-4 of these throughout the meditation, especially after emotionally rich moments. The guide does not always need to be speaking.
- The pacing must DECELERATE through the session. Phases 1-2: conversational. Phases 3-4: noticeably slower. Phases 5-6: very slow, spacious. Phase 7: gentle return.
- Do NOT include any time references, section headers, stage directions, or meta-commentary. Only words to be spoken aloud plus pause markers.
- This is BIBLICAL meditation — beholding the thoughts and feelings of Christ to become like Him in character. Character is thoughts + feelings. To be transformed into His likeness, we must behold His inner life, not just His actions. NOT emptying the mind, NOT breathing exercises. The power is in what you behold, not how you breathe.
- The Master Mind = the mind of Christ (Philippians 2:5). The goal is to observe how Christ thinks and feels, and take those thoughts and feelings as your own — this is how character is formed.
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
      <meshBasicMaterial color="#8899cc" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
    </instancedMesh>
  );
}

// Shooting stars — occasional bright streaks across the sky
function ShootingStars() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = 5;

  const stars = useMemo(() =>
    Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 40,
      y: 15 + Math.random() * 20,
      z: -20 - Math.random() * 30,
      speed: 8 + Math.random() * 12,
      angle: -0.3 - Math.random() * 0.4,
      offset: Math.random() * 60,
      length: 0.3 + Math.random() * 0.5,
    })),
  []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    stars.forEach((s, i) => {
      const cycle = ((t + s.offset) % 20) / 20;
      const visible = cycle < 0.05;
      const progress = visible ? cycle / 0.05 : 0;
      dummy.position.set(
        s.x + progress * s.speed * 3,
        s.y - progress * s.speed * Math.abs(s.angle) * 3,
        s.z,
      );
      dummy.scale.setScalar(visible ? s.length * (1 - progress * 0.5) : 0);
      dummy.rotation.z = s.angle;
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    (meshRef.current.material as THREE.MeshBasicMaterial).opacity = 0.9;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <planeGeometry args={[2, 0.02]} />
      <meshBasicMaterial color="#FFFFFF" transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
    </instancedMesh>
  );
}

// Fireflies near ground — warm yellowish dots that drift lazily
function Fireflies({ count = 25 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const flies = useMemo(() =>
    Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 12,
      y: -1 + Math.random() * 1.5,
      z: (Math.random() - 0.5) * 12 - 2,
      speed: 0.2 + Math.random() * 0.3,
      wobble: Math.random() * Math.PI * 2,
      blinkPhase: Math.random() * Math.PI * 2,
    })),
  [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    flies.forEach((f, i) => {
      const blink = Math.max(0, Math.sin(t * 2 + f.blinkPhase));
      dummy.position.set(
        f.x + Math.sin(t * f.speed + f.wobble) * 0.8,
        f.y + Math.sin(t * 0.5 + f.wobble) * 0.3,
        f.z + Math.cos(t * f.speed * 0.7 + f.wobble) * 0.6,
      );
      dummy.scale.setScalar(0.02 * blink);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#FFEE88" transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
    </instancedMesh>
  );
}

// ── Screens ──

type Screen = 'tracts' | 'sessions' | 'playing';

const SESSIONS_PER_PAGE = 7;

const TRACT_TYPE_COLORS: Record<string, string> = {
  free: '#22CC66',
  '40-day': '#FFD700',
  '365-day': '#FF6644',
};

function formatTime(s: number): string {
  if (!s || !isFinite(s)) return '0:00';
  return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
}

export default function NightWatchVR({ onBack }: NightWatchVRProps) {
  const [screen, setScreen] = useState<Screen>('tracts');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [activeSession, setActiveSession] = useState<{ session: WatchSession; tractName: string } | null>(null);
  const [selectedTract, setSelectedTract] = useState<WatchTract | null>(null);
  const [sessionPage, setSessionPage] = useState(0);
  const [tractPage, setTractPage] = useState(0);

  const [audioState, audioControls] = useStreamingAudio(audioUrl || '');
  const bgMusic = useBackgroundMusic('night');

  // All tracts (show all — populated ones playable, others "Coming Soon")
  const allTracts = useMemo(() => WATCH_TRACTS, []);
  const tractPages = Math.ceil(allTracts.length / 6);
  const visibleTracts = allTracts.slice(tractPage * 6, (tractPage + 1) * 6);

  // Sessions in selected tract (paginated)
  const tractSessions = useMemo(() => {
    if (!selectedTract) return [];
    return selectedTract.sessions;
  }, [selectedTract]);

  const sessionPages = Math.ceil(tractSessions.length / SESSIONS_PER_PAGE);
  const visibleSessions = tractSessions.slice(
    sessionPage * SESSIONS_PER_PAGE,
    (sessionPage + 1) * SESSIONS_PER_PAGE,
  );

  const avgVolume = useMemo(() => {
    if (!audioState.analyserData) return 0;
    const sum = audioState.analyserData.reduce((a: number, b: number) => a + b, 0);
    return sum / audioState.analyserData.length / 255;
  }, [audioState.analyserData]);

  const handleSelectSession = useCallback(async (session: WatchSession, tractName: string) => {
    // Start background music immediately — must be inside user gesture
    bgMusic.play();

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
      // Auto-play voice after a brief delay for the audio element to load
      setTimeout(() => audioControls.play(), 500);
    } catch (err) {
      console.error('[NightWatchVR]', err);
      bgMusic.pause();
      setStatusText('Generation failed. Tap a session to retry.');
    } finally {
      setGenerating(false);
    }
  }, [audioControls, bgMusic]);

  return (
    <group>
      {/* HDRI night sky for IBL reflections */}
      <Environment preset="night" background />

      {/* Vast star field */}
      <StarField count={3500} radius={60} brightness={screen === 'playing' ? 0.7 + avgVolume * 0.3 : 0.9} />
      <NebulaClouds count={8} radius={35} colors={['#0a1030', '#1a2060', '#0d1840', '#0a0828']} opacity={0.08 + avgVolume * 0.06} />

      {/* Shooting stars */}
      <ShootingStars />

      {/* Fireflies near ground */}
      <Fireflies count={20} />

      {/* Stone platform / clearing */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
        <circleGeometry args={[8, 32]} />
        <meshPhysicalMaterial color="#1a1a2a" metalness={0.3} roughness={0.6} clearcoat={0.4} clearcoatRoughness={0.4} />
      </mesh>
      {/* Stone platform rim */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.19, 0]}>
        <ringGeometry args={[7.5, 8.2, 32]} />
        <meshPhysicalMaterial color="#2a2a3a" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* Moonlight — cool directional from above */}
      <ambientLight intensity={0.08} color="#8899cc" />
      <directionalLight position={[2, 12, -8]} intensity={0.5} color="#aabbee" />
      <directionalLight position={[-5, 3, 2]} intensity={0.1} color="#667799" />
      <pointLight position={[0, 3, -2]} intensity={0.3 + avgVolume * 0.3} color="#6677aa" distance={12} />
      <pointLight position={[-3, 2, -4]} intensity={0.2 + avgVolume * 0.2} color="#556699" distance={8} />

      <fog attach="fog" args={['#040810', 15, 55]} />

      <MeditationParticles count={50} brightness={screen === 'playing' ? 0.5 + avgVolume * 0.5 : 0.6} />

      {/* ─── TRACT SELECTION SCREEN ─── */}
      {screen === 'tracts' && (
        <Suspense fallback={null}>
          <Text position={[0, 2.6, -4]} fontSize={0.3} color="#8b5cf6" anchorX="center" outlineWidth={0.01} outlineColor="#000">
            Night Watch
          </Text>
          <Text position={[0, 2.25, -4]} fontSize={0.1} color="#6366f1" anchorX="center">
            Choose a meditation series
          </Text>

          {/* Tract cards — 2 columns, 3 rows per page */}
          {visibleTracts.map((tract, i) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const x = (col - 0.5) * 2.8;
            const y = 1.5 - row * 0.55;
            const hasSessions = tract.sessions.length > 0;
            const typeColor = TRACT_TYPE_COLORS[tract.type] || '#888';

            return (
              <group key={tract.id} position={[x, y, -4]}>
                <Interactive onSelect={() => {
                  if (hasSessions) {
                    setSelectedTract(tract);
                    setSessionPage(0);
                    setScreen('sessions');
                  }
                }}>
                  <mesh
                    onClick={() => {
                      if (hasSessions) {
                        setSelectedTract(tract);
                        setSessionPage(0);
                        setScreen('sessions');
                      }
                    }}
                    onPointerDown={() => {
                      if (hasSessions) {
                        setSelectedTract(tract);
                        setSessionPage(0);
                        setScreen('sessions');
                      }
                    }}
                  >
                    <planeGeometry args={[2.5, 0.45]} />
                    <meshStandardMaterial
                      color={hasSessions ? '#0f0a2a' : '#0a0815'}
                      emissive={typeColor}
                      emissiveIntensity={hasSessions ? 0.12 : 0.03}
                    />
                  </mesh>
                </Interactive>
                {/* Type badge */}
                <mesh position={[1.05, 0.15, 0.01]}>
                  <planeGeometry args={[0.4, 0.12]} />
                  <meshBasicMaterial color={typeColor} transparent opacity={hasSessions ? 0.8 : 0.3} />
                </mesh>
                <Text position={[1.05, 0.15, 0.02]} fontSize={0.04} color="#000" anchorX="center" anchorY="middle">
                  {tract.type === 'free' ? 'FREE' : tract.type.toUpperCase()}
                </Text>
                <Text position={[-0.1, 0.05, 0.01]} fontSize={0.07} color={hasSessions ? '#a78bfa' : '#555'} anchorX="center" anchorY="middle" maxWidth={2.2}>
                  {tract.icon} {tract.name}
                </Text>
                <Text position={[-0.1, -0.12, 0.01]} fontSize={0.04} color={hasSessions ? '#6366f1' : '#444'} anchorX="center" anchorY="middle" maxWidth={2.2}>
                  {hasSessions ? `${tract.totalSessions} sessions — ${tract.subtitle}` : 'Coming Soon'}
                </Text>
              </group>
            );
          })}

          {/* Pagination */}
          {tractPages > 1 && (
            <group position={[0, -0.4, -4]}>
              {tractPage > 0 && (
                <Interactive onSelect={() => setTractPage((p) => p - 1)}>
                  <mesh position={[-1.2, 0, 0]} onClick={() => setTractPage((p) => p - 1)}>
                    <planeGeometry args={[0.8, 0.25]} />
                    <meshStandardMaterial color="#0f0a2a" emissive="#6366f1" emissiveIntensity={0.15} />
                  </mesh>
                </Interactive>
              )}
              {tractPage > 0 && (
                <Text position={[-1.2, 0, 0.01]} fontSize={0.07} color="#a78bfa" anchorX="center" anchorY="middle">
                  ← Prev
                </Text>
              )}
              <Text position={[0, 0, 0.01]} fontSize={0.06} color="#666" anchorX="center" anchorY="middle">
                {tractPage + 1} / {tractPages}
              </Text>
              {tractPage < tractPages - 1 && (
                <Interactive onSelect={() => setTractPage((p) => p + 1)}>
                  <mesh position={[1.2, 0, 0]} onClick={() => setTractPage((p) => p + 1)}>
                    <planeGeometry args={[0.8, 0.25]} />
                    <meshStandardMaterial color="#0f0a2a" emissive="#6366f1" emissiveIntensity={0.15} />
                  </mesh>
                </Interactive>
              )}
              {tractPage < tractPages - 1 && (
                <Text position={[1.2, 0, 0.01]} fontSize={0.07} color="#a78bfa" anchorX="center" anchorY="middle">
                  Next →
                </Text>
              )}
            </group>
          )}
        </Suspense>
      )}

      {/* ─── SESSION SELECTION SCREEN ─── */}
      {screen === 'sessions' && selectedTract && (
        <Suspense fallback={null}>
          <Text position={[0, 2.6, -4]} fontSize={0.22} color="#8b5cf6" anchorX="center" outlineWidth={0.008} outlineColor="#000">
            {selectedTract.icon} {selectedTract.name}
          </Text>
          <Text position={[0, 2.3, -4]} fontSize={0.08} color="#6366f1" anchorX="center">
            {selectedTract.subtitle} — {selectedTract.totalSessions} sessions
          </Text>

          {statusText && (
            <Text position={[0, 2.0, -4]} fontSize={0.09} color="#a78bfa" anchorX="center">
              {statusText}
            </Text>
          )}

          {/* Session buttons — row layout */}
          {visibleSessions.map((session, i) => {
            const x = (i - Math.min(visibleSessions.length - 1, SESSIONS_PER_PAGE - 1) / 2) * 0.9;
            return (
              <group key={session.dayNumber} position={[x, 1.2, -4]}>
                <Interactive onSelect={() => !generating && handleSelectSession(session, selectedTract.name)}>
                  <mesh
                    onClick={() => !generating && handleSelectSession(session, selectedTract.name)}
                    onPointerDown={() => !generating && handleSelectSession(session, selectedTract.name)}
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
                  Day {session.dayNumber}
                </Text>
                <Text position={[0, -0.06, 0.01]} fontSize={0.05} color="#7c3aed" anchorX="center" anchorY="middle" maxWidth={0.65}>
                  {session.title}
                </Text>
                <Text position={[0, -0.2, 0.01]} fontSize={0.04} color="#4c1d95" anchorX="center" anchorY="middle" maxWidth={0.65}>
                  {session.scripture}
                </Text>
              </group>
            );
          })}

          {/* Session pagination */}
          {sessionPages > 1 && (
            <group position={[0, 0.4, -4]}>
              {sessionPage > 0 && (
                <Interactive onSelect={() => setSessionPage((p) => p - 1)}>
                  <mesh position={[-1.5, 0, 0]} onClick={() => setSessionPage((p) => p - 1)}>
                    <planeGeometry args={[0.8, 0.25]} />
                    <meshStandardMaterial color="#0f0a2a" emissive="#6366f1" emissiveIntensity={0.15} />
                  </mesh>
                </Interactive>
              )}
              {sessionPage > 0 && (
                <Text position={[-1.5, 0, 0.01]} fontSize={0.07} color="#a78bfa" anchorX="center" anchorY="middle">
                  ← Prev
                </Text>
              )}
              <Text position={[0, 0, 0.01]} fontSize={0.06} color="#666" anchorX="center" anchorY="middle">
                Page {sessionPage + 1} / {sessionPages}
              </Text>
              {sessionPage < sessionPages - 1 && (
                <Interactive onSelect={() => setSessionPage((p) => p + 1)}>
                  <mesh position={[1.5, 0, 0]} onClick={() => setSessionPage((p) => p + 1)}>
                    <planeGeometry args={[0.8, 0.25]} />
                    <meshStandardMaterial color="#0f0a2a" emissive="#6366f1" emissiveIntensity={0.15} />
                  </mesh>
                </Interactive>
              )}
              {sessionPage < sessionPages - 1 && (
                <Text position={[1.5, 0, 0.01]} fontSize={0.07} color="#a78bfa" anchorX="center" anchorY="middle">
                  Next →
                </Text>
              )}
            </group>
          )}

          {/* Back to tracts */}
          <Interactive onSelect={() => setScreen('tracts')}>
            <mesh position={[0, -0.2, -3.5]} onClick={() => setScreen('tracts')} onPointerDown={() => setScreen('tracts')}>
              <planeGeometry args={[1.4, 0.25]} />
              <meshStandardMaterial color="#0f0a2a" emissive="#4338ca" emissiveIntensity={0.1} />
            </mesh>
          </Interactive>
          <Text position={[0, -0.2, -3.48]} fontSize={0.08} color="#7c3aed" anchorX="center" anchorY="middle">
            ← Back to Series
          </Text>

          {generating && (
            <group position={[0, 0.7, -3]}>
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
          <Interactive onSelect={() => { audioControls.togglePlayPause(); audioState.isPlaying ? bgMusic.pause() : bgMusic.play(); }}>
            <mesh position={[0, 1.2, -3.5]} onClick={() => { audioControls.togglePlayPause(); audioState.isPlaying ? bgMusic.pause() : bgMusic.play(); }} onPointerDown={() => { audioControls.togglePlayPause(); audioState.isPlaying ? bgMusic.pause() : bgMusic.play(); }}>
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
          <Interactive onSelect={() => { audioControls.pause(); bgMusic.pause(); setScreen('sessions'); setAudioUrl(null); }}>
            <mesh
              position={[0, 0.55, -3.5]}
              onClick={() => { audioControls.pause(); bgMusic.pause(); setScreen('sessions'); setAudioUrl(null); }}
              onPointerDown={() => { audioControls.pause(); bgMusic.pause(); setScreen('sessions'); setAudioUrl(null); }}
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
