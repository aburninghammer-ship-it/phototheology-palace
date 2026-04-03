import { useRef, useMemo, useState, useCallback, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Interactive } from '@react-three/xr';
import * as THREE from 'three';
import { StarField } from '../components/StarField';
import { NebulaClouds } from '../components/NebulaClouds';
import { BackToLobbyButton } from '../components/BackToLobbyButton';
import { useStreamingAudio } from '../hooks/useStreamingAudio';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';
import { callJeeves } from '@/lib/jeevesClient';
import { supabase } from '@/integrations/supabase/client';
import { WATCH_TRACTS, type MorningWatchSession } from '@/data/watchSeries';

interface MorningWatchVRProps {
  onBack: () => void;
}

function buildPrompt(session: MorningWatchSession, tractName: string): string {
  return `Generate a 12-minute Morning Watch activation script to be read aloud as audio. This must be LONG — approximately 2,000 to 2,500 words of spoken content, PLUS generous silence. Do NOT cut it short.

IMPORTANT: Ambient music plays underneath the entire meditation. You do NOT need to fill every moment with words. Include EXTENDED SILENCES of 30-60 seconds where the music plays alone and the listener simply sits in what has been declared. These musical interludes are not awkward gaps — they are sacred space. The music carries the activation during these silences.

Title: ${session.title}
Series: ${tractName}, Day ${session.dayNumber}
Paired Night Watch: "${session.pairedNightTitle}"
Night Insight: ${session.nightInsight}
Morning Scripture: ${session.morningScripture}
Activation Principle: ${session.activationPrinciple}
Energy: ${session.energy}
Commitment Style: ${session.commitmentStyle}
Scenario Types: ${session.scenarioTypes.join(', ')}

Follow this 7-phase structure inspired by the Calm app's morning meditations. Each phase flows naturally into the next — no labels, no headers, no time references. The Morning Watch is more alert and directed than the Night Watch, but still includes generous moments of musical silence.

PHASE 1 — AWAKENING AND FRAMING (~2 minutes of audio):
Begin with a warm good morning. Invite the listener to sit up, plant their feet, and gather themselves. You may mention one centering breath, but do NOT dwell on breathing technique — move quickly into the purpose.

Explain that this is a Morning Watch — the activation half of the Master Mind practice. Last night you beheld the inner life of Christ — not just what He did, but how He thought and what He felt. Character is made up of thoughts and feelings, and to become like Christ in character, you must first behold those thoughts and feelings and then take them as your own. That is what you did last night. This morning, the goal is to CARRY those thoughts and feelings into your day — to think with Christ, to feel with Christ, to respond as He would. This is biblical meditation — not emptying the mind, but filling it with the mind of Christ until His character becomes yours. "Let this mind be in you which was also in Christ Jesus" (Philippians 2:5). Today you are not just remembering what Christ thought — you are thinking WITH Him. [pause]

PHASE 2 — REMEMBER LAST NIGHT (~1.5 minutes):
Recall last night's Master Mind insight from "${session.pairedNightTitle}". Briefly revisit the scene, the core truth. Weave in the night scripture naturally. The listener should feel continuity between night and morning.
End with [extended silence] — 30-45 seconds of music alone while the memory settles.

PHASE 3 — TRUTH DECLARATION (~2 minutes):
Shift to this morning's Scripture: ${session.morningScripture}. Speak it with weight and conviction. Then unpack it into an identity statement. The activation principle: ${session.activationPrinciple}. Repeat the key Scripture phrase 2-3 times with [pause] after each, letting it sink deeper.
Follow with [extended silence] — 30-40 seconds of music while the declaration reverberates.

PHASE 4 — MENTAL ALIGNMENT (~2 minutes):
Translate the pattern into today's thinking. Walk through the mental shift — from the old default reaction to the Christ-pattern response. Be specific and practical. Use [pause] generously. Steady and clear, like a coach walking you through a play.

PHASE 5 — REAL-LIFE SCENARIOS (~2.5 minutes):
Present 3 distinct, vivid scenarios based on: ${session.scenarioTypes.join(', ')}. For each: paint the situation concretely, name the old reaction honestly, then speak the Master Mind response. [pause] after each scenario. Make these feel REAL with sensory details.
After the final scenario, include [extended silence] — 45-60 seconds of music. Let the scenarios settle into the body.

PHASE 6 — OPEN STILLNESS (~1 minute):
Reduced guidance. "Take a moment to let these truths settle into your body." [extended silence] for 30-40 seconds. Only 1-2 sentences total. Let the music hold the space.

PHASE 7 — COMMITMENT AND SEND-OFF (~1 minute):
End with resolve, not a question. ${session.commitmentStyle} style commitment. Bring energy up slightly — resolute and warm. One final breath. A brief blessing or send-off.

CRITICAL RULES:
- Total meditation is 12 minutes. Spoken content should be ~2,000-2,500 words. The remaining time is filled by SILENCE where ambient music plays alone.
- Write in complete, flowing sentences. Every thought should read naturally when spoken aloud.
- Use THREE types of pause markers:
  [pause] = 3-5 seconds of silence (use frequently, after every 1-2 sentences)
  [long pause] = 10-20 seconds of silence (use after key truth declarations and between scenarios)
  [extended silence] = 30-60 seconds where ONLY the background music plays. Use at least 3-4 of these throughout the meditation, especially after emotionally rich moments. The guide does not always need to be speaking.
- Morning Watch tone is CLEAR, WARM, and DIRECTED — not dreamy. Energy level: ${session.energy}. Think of a trusted coach at sunrise, not a sleep guide.
- Do NOT include any time references, section headers, stage directions, or meta-commentary. Only words to be spoken aloud plus pause markers.
- This is BIBLICAL meditation — beholding the thoughts and feelings of Christ to become like Him in character. Character = thoughts + feelings. To be transformed, we behold His inner life, not just His actions. NOT emptying the mind, NOT breathing exercises, NOT Eastern mysticism. The power is in what you behold, not how you breathe.
- The Master Mind = the mind of Christ (Philippians 2:5). The goal is to observe how Christ thinks and feels, take those thoughts and feelings as your own, and walk in them — this is how Christlike character is formed.
- Night Watch: "Behold the thoughts and feelings of Christ — and receive them." Morning Watch: "Now take those thoughts as your own — and walk in them."
- Do NOT spend more than one sentence on breathing. The power is in beholding Christ, not in breath work.
- Second person ("you") throughout. End with resolve and momentum, not a question.`;
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
  const bgMusic = useBackgroundMusic('morning');

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
    // Start background music immediately — must be inside user gesture
    bgMusic.play();

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
      // Auto-play voice after a brief delay for the audio element to load
      setTimeout(() => audioControls.play(), 500);
    } catch (err) {
      console.error('[MorningWatchVR]', err);
      bgMusic.pause();
      setStatusText('Generation failed. Tap a session to retry.');
    } finally {
      setGenerating(false);
    }
  }, [audioControls, bgMusic]);

  return (
    <group>
      {/* Stars fading into dawn */}
      <StarField count={1500} radius={60} brightness={screen === 'playing' ? 0.3 + avgVolume * 0.2 : 0.4} />
      <NebulaClouds count={6} radius={30} colors={['#7C3AED', '#C026D3', '#DB2777', '#6B21A8']} opacity={0.08 + avgVolume * 0.06} />

      <HorizonGlow brightness={avgVolume} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0a0818" metalness={0.3} roughness={0.6} />
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
          <Interactive onSelect={() => { audioControls.togglePlayPause(); audioState.isPlaying ? bgMusic.pause() : bgMusic.play(); }}>
            <mesh position={[0, 1.2, -3.5]} onClick={() => { audioControls.togglePlayPause(); audioState.isPlaying ? bgMusic.pause() : bgMusic.play(); }} onPointerDown={() => { audioControls.togglePlayPause(); audioState.isPlaying ? bgMusic.pause() : bgMusic.play(); }}>
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
          <Interactive onSelect={() => { audioControls.pause(); bgMusic.pause(); setScreen('menu'); setAudioUrl(null); }}>
            <mesh
              position={[0, 0.55, -3.5]}
              onClick={() => { audioControls.pause(); bgMusic.pause(); setScreen('menu'); setAudioUrl(null); }}
              onPointerDown={() => { audioControls.pause(); bgMusic.pause(); setScreen('menu'); setAudioUrl(null); }}
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
