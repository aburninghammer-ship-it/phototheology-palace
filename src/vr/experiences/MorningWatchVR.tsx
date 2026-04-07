import { useRef, useMemo, useState, useCallback, Suspense } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
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
import { WATCH_TRACTS, type MorningWatchSession, type WatchTract } from '@/data/watchSeries';

interface MorningWatchVRProps {
  onBack: () => void;
}

function buildPrompt(session: MorningWatchSession, tractName: string): string {
  return `Generate a 12-minute Morning Watch activation script to be read aloud as audio. This must be LONG — approximately 2,000 to 2,500 words of spoken content, PLUS generous silence. Do NOT cut it short.

IMPORTANT: Ambient music plays underneath. Include EXTENDED SILENCES of 30-60 seconds where the music plays alone. These are sacred space — the music carries the activation.

Title: ${session.title}
Series: ${tractName}, Day ${session.dayNumber}
Paired Night Watch: "${session.pairedNightTitle}"
Night Insight: ${session.nightInsight}
Morning Scripture: ${session.morningScripture}
Activation Principle: ${session.activationPrinciple}
Energy: ${session.energy}
Commitment Style: ${session.commitmentStyle}
Scenario Types: ${session.scenarioTypes.join(', ')}

CRITICAL PHILOSOPHY — READ THIS FIRST:
This has ZERO to do with breathing, posture, or relaxation. Do NOT mention deep breathing. Do NOT mention posture. Do NOT mention "getting comfortable" or body awareness. This is CINEMATIC BIBLICAL MIND ACTIVATION.

ANTI-EASTERN GUARDRAIL (NON-NEGOTIABLE):
- NEVER use language from Eastern meditation, mindfulness, centering prayer, Lectio Divina, or contemplative mysticism.
- NEVER say: "empty your mind," "clear your thoughts," "let go of all thinking," "observe your thoughts without judgment," "be present," "center yourself," "find your inner stillness," "breathe into the space," "namaste," "mantra," "chakra," "energy flow," "universe," or any New Age terminology.
- This is BIBLICAL MEDITATION — FILLING the mind with Scripture, NOT emptying it. The mind is being actively LOADED with the thoughts of Christ, not cleared.
- Prayer is conversational and Scripture-based, NOT technique-based.
- Do NOT reference "meditation" generically. Use "Morning Watch" or "this time" instead.

TIME-OF-DAY CONTEXT: This is a MORNING Watch. Naturally reference "this morning" and "today" throughout — e.g., "This morning, you carry…", "Today, you walk differently…", "This morning, the download activates…" The listener knows it is morning. Anchor the experience in the start of the day.

PACING — INTER-SENTENCE PAUSES: Place a [pause] marker after EVERY 2-3 sentences to create 2-4 seconds of breathing room. The narration should feel unhurried with generous silence between thoughts.

Follow this 6-phase structure. Each phase flows seamlessly — no labels, no headers, no time references.

PHASE 1 — LOCK IN AND ACTIVATE (~2 minutes):
Open with energy and authority. "Lock in. The screen is still on. The download activates NOW." The listener's mind is a theater — this morning the film continues, but now they are BECOMING the character. Establish: "This is not emptying the mind — it is FILLING it with the mind of Christ and CARRYING it into your day." [pause]

PHASE 2 — RECALL THE SCENE (~1.5 minutes):
Flash back to last night: "${session.pairedNightTitle}". Trigger the memory vividly. "${session.nightInsight}." The listener should feel: last night you received; this morning you deploy.
End with [extended silence] — 30-45 seconds.

PHASE 3 — TRUTH DECLARATION (~2 minutes):
Morning Scripture: ${session.morningScripture}. Speak it with conviction — this is DECLARING, not reading. Unpack as identity upgrade: "This is who you are now. This is how you think now." Activation principle: ${session.activationPrinciple}. Repeat key phrase 2-3 times with [pause].
Follow with [extended silence] — 30-40 seconds.

PHASE 4 — OVERLAY ONTO REAL LIFE (~3 minutes):
Present 3 vivid real-life scenarios based on: ${session.scenarioTypes.join(', ')}. For each:
- Paint it cinematically with sensory detail
- Name the OLD reaction honestly
- OVERLAY the Master Mind: "The screen is still on. You see it differently now."
- Show Christ's pattern in THAT EXACT MOMENT
- [pause] after each
After final scenario: [extended silence] — 45-60 seconds.

PHASE 5 — LOCK THE DOWNLOAD (~1.5 minutes):
"The download is complete. The thoughts of Christ are running in your system." Declare: "I carry the mind of Christ today. His thoughts are my thoughts." [extended silence] — 30-40 seconds.

PHASE 6 — SEND-OFF WITH AUTHORITY (~1 minute):
${session.commitmentStyle} energy. "Today, you walk differently. When the old mind tries to run its program — you override it. You have a new operating system. The Master Mind." Identity statement from morning Scripture. "Now go. The screen is on. What you behold, you become."

CRITICAL RULES:
- Spoken content ~2,000-2,500 words. Remaining time is SILENCE with ambient music.
- ABSOLUTELY NO mention of breathing, deep breaths, posture, body position, getting comfortable, body scans, sitting up, planting feet, wiggling fingers, or physical relaxation. ZERO.
- The ONLY physical metaphor is MIND AS THEATER / SCREEN / OPERATING SYSTEM.
- Use THREE pause markers:
  [pause] = 3-5 seconds (frequent)
  [long pause] = 10-20 seconds (after key declarations)
  [extended silence] = 30-60 seconds of music only (at least 3-4 times)
- Morning Watch tone is CLEAR, BOLD, ACTIVATED — like a coach before a championship game. Energy: ${session.energy}.
- Cinematic and prophetic style. Mix short punchy lines and flowing sentences.
- Do NOT include section headers, stage directions, or meta-commentary.
- The power is in BEHOLDING and DEPLOYING. The download becomes the operating system.
- Second person ("you") throughout. End with authority and momentum.

TTS FORMATTING RULES (CRITICAL — this text will be read aloud by a text-to-speech engine):
- Write ALL scripture references in SPOKEN form: "John chapter one, verse one" NOT "John 1:1". "Genesis chapter three, verse fifteen" NOT "Genesis 3:15".
- Write numbers as words when under 100: "twelve disciples" not "12 disciples". "forty days" not "40 days".
- Avoid colons, slashes, or abbreviations that TTS will mispronounce.
- Use full book names: "First Corinthians" not "1 Cor". "Second Samuel" not "2 Sam".
- Write "verses" ranges naturally: "verses one through three" not "1-3".`;
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
      <meshBasicMaterial color="#FFB347" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
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
      <meshBasicMaterial color="#FF8C00" transparent opacity={0.12} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ── Sun with corona and audio-reactive glow ──
function SunMesh({ volume = 0 }: { volume?: number }) {
  const coronaRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pulse = 1 + Math.sin(t * 0.4) * 0.04 + volume * 0.12;
    if (coronaRef.current) coronaRef.current.scale.setScalar(pulse);
    if (haloRef.current) {
      (haloRef.current.material as THREE.MeshBasicMaterial).opacity = 0.1 + Math.sin(t * 0.3) * 0.03 + volume * 0.05;
      haloRef.current.scale.setScalar(pulse * 1.15);
    }
  });

  return (
    <group position={[0, 4, -45]}>
      {/* Sun disc */}
      <mesh>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial color="#FFE4B5" />
      </mesh>
      {/* Inner corona */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[4.5, 32, 32]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.BackSide} />
      </mesh>
      {/* Outer halo */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[8, 32, 32]} />
        <meshBasicMaterial color="#FF8C00" transparent opacity={0.08} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

// ── Terrain with rolling hills ──
function DawnTerrain() {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(100, 100, 48, 48);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getY(i);
      const dist = Math.sqrt(x * x + z * z);
      const flatRadius = 6;
      const hillFactor = Math.max(0, (dist - flatRadius) / 15);
      const height = hillFactor * (
        Math.sin(x * 0.06) * 2 +
        Math.cos(z * 0.05) * 2.5 +
        Math.sin(x * 0.12 + z * 0.1) * 1
      );
      pos.setZ(i, height);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.25, 0]} geometry={geo}>
      <meshStandardMaterial color="#1a1508" roughness={0.92} metalness={0} />
    </mesh>
  );
}

// ── Scattered trees/bushes around the clearing ──
function DawnTrees() {
  const trees = useMemo(() => {
    const arr: { x: number; z: number; height: number; trunkH: number; radius: number; type: 'tree' | 'bush' }[] = [];
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const dist = 10 + Math.random() * 18;
      arr.push({
        x: Math.cos(angle) * dist,
        z: Math.sin(angle) * dist - 2,
        height: 2 + Math.random() * 4,
        trunkH: 1 + Math.random() * 1.5,
        radius: 0.6 + Math.random() * 1,
        type: Math.random() > 0.4 ? 'tree' : 'bush',
      });
    }
    return arr;
  }, []);

  return (
    <group>
      {trees.map((t, i) => (
        <group key={i} position={[t.x, -1.2, t.z]}>
          {t.type === 'tree' ? (
            <>
              <mesh position={[0, t.trunkH / 2, 0]}>
                <cylinderGeometry args={[0.06, 0.12, t.trunkH, 5]} />
                <meshStandardMaterial color="#2a1a08" />
              </mesh>
              <mesh position={[0, t.trunkH + t.height * 0.35, 0]}>
                <sphereGeometry args={[t.radius, 6, 6]} />
                <meshStandardMaterial color="#1a2a08" />
              </mesh>
            </>
          ) : (
            <mesh position={[0, t.radius * 0.4, 0]}>
              <sphereGeometry args={[t.radius * 0.6, 5, 5]} />
              <meshStandardMaterial color="#1a2808" />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

// ── Drifting golden clouds ──
function DawnClouds({ count = 8 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const clouds = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      x: -35 + i * 10 + (Math.random() - 0.5) * 6,
      y: 8 + Math.random() * 8,
      z: -30 - Math.random() * 15,
      speed: 0.1 + Math.random() * 0.15,
      scaleX: 5 + Math.random() * 8,
      scaleY: 1 + Math.random() * 1.5,
    })),
  [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    clouds.forEach((c, i) => {
      const x = ((c.x + t * c.speed + 45) % 90) - 45;
      dummy.position.set(x, c.y, c.z);
      dummy.scale.set(c.scaleX, c.scaleY, 1);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color="#FFD088" transparent opacity={0.06} depthWrite={false} side={THREE.DoubleSide} />
    </instancedMesh>
  );
}

// ── Ground mist that pools at low elevation ──
function DawnMist({ count = 15 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const wisps = useMemo(() =>
    Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 24,
      z: (Math.random() - 0.5) * 24 - 2,
      speed: 0.04 + Math.random() * 0.08,
      scaleX: 3 + Math.random() * 5,
      scaleZ: 2 + Math.random() * 3,
      phase: Math.random() * Math.PI * 2,
    })),
  [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    wisps.forEach((w, i) => {
      dummy.position.set(
        w.x + Math.sin(t * w.speed + w.phase) * 2,
        -0.9,
        w.z + Math.cos(t * w.speed * 0.7 + w.phase) * 1.5,
      );
      dummy.rotation.set(-Math.PI / 2, 0, t * w.speed * 0.1);
      dummy.scale.set(w.scaleX, w.scaleZ, 1);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    (meshRef.current.material as THREE.MeshBasicMaterial).opacity = 0.05 + Math.sin(t * 0.25) * 0.02;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <circleGeometry args={[1, 8]} />
      <meshBasicMaterial color="#FFD088" transparent opacity={0.05} blending={THREE.AdditiveBlending} depthWrite={false} />
    </instancedMesh>
  );
}

// ── Gentle camera sway during meditation ──
function MorningSway({ active, intensity = 0.002 }: { active: boolean; intensity?: number }) {
  const { camera } = useThree();
  const baseRotation = useRef<THREE.Euler | null>(null);

  useFrame(({ clock }) => {
    if (!active) { baseRotation.current = null; return; }
    if (!baseRotation.current) baseRotation.current = camera.rotation.clone();
    const t = clock.getElapsedTime();
    camera.rotation.x = baseRotation.current.x + Math.sin(t * 0.12) * intensity;
    camera.rotation.z = baseRotation.current.z + Math.cos(t * 0.08) * intensity * 0.5;
  });

  return null;
}

// ── Golden grass patches on the ground ──
function GrassPatches() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = 60;

  const patches = useMemo(() =>
    Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 3 + Math.random() * 8;
      return {
        x: Math.cos(angle) * dist,
        z: Math.sin(angle) * dist,
        scale: 0.05 + Math.random() * 0.1,
        rotY: Math.random() * Math.PI,
        phase: Math.random() * Math.PI * 2,
      };
    }),
  []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    patches.forEach((p, i) => {
      dummy.position.set(p.x, -1.15, p.z);
      dummy.rotation.set(0, p.rotY, Math.sin(t * 0.8 + p.phase) * 0.15);
      dummy.scale.set(p.scale, p.scale * 2, p.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <coneGeometry args={[1, 3, 3]} />
      <meshStandardMaterial color="#8B7355" roughness={0.9} />
    </instancedMesh>
  );
}

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

export default function MorningWatchVR({ onBack }: MorningWatchVRProps) {
  const [screen, setScreen] = useState<Screen>('tracts');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [activeSession, setActiveSession] = useState<{ session: MorningWatchSession; tractName: string } | null>(null);
  const [selectedTract, setSelectedTract] = useState<WatchTract | null>(null);
  const [sessionPage, setSessionPage] = useState(0);
  const [tractPage, setTractPage] = useState(0);

  const [audioState, audioControls] = useStreamingAudio(audioUrl || '');
  const bgMusic = useBackgroundMusic('morning');

  // All tracts — show those with mornings as playable
  const allTracts = useMemo(() => WATCH_TRACTS, []);
  const tractPages = Math.ceil(allTracts.length / 6);
  const visibleTracts = allTracts.slice(tractPage * 6, (tractPage + 1) * 6);

  // Morning sessions in selected tract (paginated)
  const tractSessions = useMemo(() => {
    if (!selectedTract || !selectedTract.mornings) return [];
    return selectedTract.mornings;
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
      {/* HDRI dawn skybox + image-based lighting */}
      <Environment preset="dawn" background resolution={512} />

      {/* Visible sun with corona */}
      <SunMesh volume={avgVolume} />

      {/* Fading stars at dawn — subtle */}
      <StarField count={800} radius={60} brightness={screen === 'playing' ? 0.1 + avgVolume * 0.1 : 0.15} />
      <NebulaClouds count={6} radius={30} colors={['#FFB347', '#FF8C00', '#FFD700', '#FFA07A']} opacity={0.06 + avgVolume * 0.04} />

      {/* Drifting golden clouds */}
      <DawnClouds count={8} />

      <HorizonGlow brightness={avgVolume} />

      {/* Terrain with rolling hills */}
      <DawnTerrain />

      {/* Trees and bushes around clearing */}
      <DawnTrees />

      {/* Grass patches on ground */}
      <GrassPatches />

      {/* Ground mist */}
      <DawnMist count={15} />

      {/* Warm earth clearing */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
        <circleGeometry args={[6, 32]} />
        <meshPhysicalMaterial color="#2a1f10" metalness={0.15} roughness={0.8} clearcoat={0.2} clearcoatRoughness={0.9} envMapIntensity={0.3} />
      </mesh>

      {/* Lighting — warm golden sunrise from sun direction */}
      <ambientLight intensity={0.3 + avgVolume * 0.08} color="#FFF5E6" />
      <directionalLight position={[0, 4, -45]} intensity={0.7 + avgVolume * 0.25} color="#FFB347" />
      <directionalLight position={[-4, 3, 2]} intensity={0.25} color="#FFA07A" />
      <pointLight position={[0, 3, -6]} intensity={0.4 + avgVolume * 0.5} color="#FFD700" distance={15} />
      <pointLight position={[-3, 2, -4]} intensity={0.25 + avgVolume * 0.25} color="#FF8C00" distance={8} />

      <fog attach="fog" args={['#1a150e', 12, 50]} />

      <SunriseParticles count={60} brightness={screen === 'playing' ? 0.5 + avgVolume * 0.5 : 0.6} />

      {/* Camera sway during meditation */}
      <MorningSway active={screen === 'playing'} />

      {/* ─── TRACT SELECTION SCREEN ─── */}
      {screen === 'tracts' && (
        <Suspense fallback={null}>
          <Text position={[0, 2.6, -4]} fontSize={0.3} color="#f59e0b" anchorX="center" outlineWidth={0.01} outlineColor="#000">
            Morning Watch
          </Text>
          <Text position={[0, 2.25, -4]} fontSize={0.1} color="#d97706" anchorX="center">
            Choose an activation series
          </Text>

          {/* Tract cards — 2 columns, 3 rows per page */}
          {visibleTracts.map((tract, i) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const x = (col - 0.5) * 2.8;
            const y = 1.5 - row * 0.55;
            const hasMornings = !!(tract.mornings && tract.mornings.length > 0);
            const typeColor = TRACT_TYPE_COLORS[tract.type] || '#888';

            return (
              <group key={tract.id} position={[x, y, -4]}>
                <Interactive onSelect={() => {
                  if (hasMornings) {
                    setSelectedTract(tract);
                    setSessionPage(0);
                    setScreen('sessions');
                  }
                }}>
                  <mesh
                    onClick={() => {
                      if (hasMornings) {
                        setSelectedTract(tract);
                        setSessionPage(0);
                        setScreen('sessions');
                      }
                    }}
                    onPointerDown={() => {
                      if (hasMornings) {
                        setSelectedTract(tract);
                        setSessionPage(0);
                        setScreen('sessions');
                      }
                    }}
                  >
                    <planeGeometry args={[2.5, 0.45]} />
                    <meshStandardMaterial
                      color={hasMornings ? '#1a0f05' : '#0f0a05'}
                      emissive={typeColor}
                      emissiveIntensity={hasMornings ? 0.12 : 0.03}
                    />
                  </mesh>
                </Interactive>
                {/* Type badge */}
                <mesh position={[1.05, 0.15, 0.01]}>
                  <planeGeometry args={[0.4, 0.12]} />
                  <meshBasicMaterial color={typeColor} transparent opacity={hasMornings ? 0.8 : 0.3} />
                </mesh>
                <Text position={[1.05, 0.15, 0.02]} fontSize={0.04} color="#000" anchorX="center" anchorY="middle">
                  {tract.type === 'free' ? 'FREE' : tract.type.toUpperCase()}
                </Text>
                <Text position={[-0.1, 0.05, 0.01]} fontSize={0.07} color={hasMornings ? '#fbbf24' : '#555'} anchorX="center" anchorY="middle" maxWidth={2.2}>
                  {tract.icon} {tract.name}
                </Text>
                <Text position={[-0.1, -0.12, 0.01]} fontSize={0.04} color={hasMornings ? '#d97706' : '#444'} anchorX="center" anchorY="middle" maxWidth={2.2}>
                  {hasMornings ? `${tract.mornings!.length} sessions — ${tract.subtitle}` : 'Coming Soon'}
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
                    <meshStandardMaterial color="#1a0f05" emissive="#d97706" emissiveIntensity={0.15} />
                  </mesh>
                </Interactive>
              )}
              {tractPage > 0 && (
                <Text position={[-1.2, 0, 0.01]} fontSize={0.07} color="#fbbf24" anchorX="center" anchorY="middle">
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
                    <meshStandardMaterial color="#1a0f05" emissive="#d97706" emissiveIntensity={0.15} />
                  </mesh>
                </Interactive>
              )}
              {tractPage < tractPages - 1 && (
                <Text position={[1.2, 0, 0.01]} fontSize={0.07} color="#fbbf24" anchorX="center" anchorY="middle">
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
          <Text position={[0, 2.6, -4]} fontSize={0.22} color="#f59e0b" anchorX="center" outlineWidth={0.008} outlineColor="#000">
            {selectedTract.icon} {selectedTract.name}
          </Text>
          <Text position={[0, 2.3, -4]} fontSize={0.08} color="#d97706" anchorX="center">
            {selectedTract.subtitle} — {tractSessions.length} morning sessions
          </Text>

          {statusText && (
            <Text position={[0, 2.0, -4]} fontSize={0.09} color="#fbbf24" anchorX="center">
              {statusText}
            </Text>
          )}

          {/* Session buttons */}
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
                    <meshStandardMaterial color="#1a0f05" emissive="#f59e0b" emissiveIntensity={generating ? 0.05 : 0.15} />
                  </mesh>
                </Interactive>
                <Text position={[0, 0.12, 0.01]} fontSize={0.12} color="#fbbf24" anchorX="center" anchorY="middle">
                  Day {session.dayNumber}
                </Text>
                <Text position={[0, -0.06, 0.01]} fontSize={0.05} color="#d97706" anchorX="center" anchorY="middle" maxWidth={0.65}>
                  {session.title}
                </Text>
                <Text position={[0, -0.2, 0.01]} fontSize={0.04} color="#92400e" anchorX="center" anchorY="middle" maxWidth={0.65}>
                  {session.morningScripture}
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
                    <meshStandardMaterial color="#1a0f05" emissive="#d97706" emissiveIntensity={0.15} />
                  </mesh>
                </Interactive>
              )}
              {sessionPage > 0 && (
                <Text position={[-1.5, 0, 0.01]} fontSize={0.07} color="#fbbf24" anchorX="center" anchorY="middle">
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
                    <meshStandardMaterial color="#1a0f05" emissive="#d97706" emissiveIntensity={0.15} />
                  </mesh>
                </Interactive>
              )}
              {sessionPage < sessionPages - 1 && (
                <Text position={[1.5, 0, 0.01]} fontSize={0.07} color="#fbbf24" anchorX="center" anchorY="middle">
                  Next →
                </Text>
              )}
            </group>
          )}

          {/* Back to tracts */}
          <Interactive onSelect={() => setScreen('tracts')}>
            <mesh position={[0, -0.2, -3.5]} onClick={() => setScreen('tracts')} onPointerDown={() => setScreen('tracts')}>
              <planeGeometry args={[1.4, 0.25]} />
              <meshStandardMaterial color="#1a0f05" emissive="#92400e" emissiveIntensity={0.1} />
            </mesh>
          </Interactive>
          <Text position={[0, -0.2, -3.48]} fontSize={0.08} color="#d97706" anchorX="center" anchorY="middle">
            ← Back to Series
          </Text>

          {generating && (
            <group position={[0, 0.7, -3]}>
              <mesh>
                <torusGeometry args={[0.15, 0.02, 8, 32]} />
                <meshBasicMaterial color="#f59e0b" transparent opacity={0.6} />
              </mesh>
            </group>
          )}
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
          <Interactive onSelect={() => { audioControls.pause(); bgMusic.pause(); setScreen('sessions'); setAudioUrl(null); }}>
            <mesh
              position={[0, 0.55, -3.5]}
              onClick={() => { audioControls.pause(); bgMusic.pause(); setScreen('sessions'); setAudioUrl(null); }}
              onPointerDown={() => { audioControls.pause(); bgMusic.pause(); setScreen('sessions'); setAudioUrl(null); }}
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
