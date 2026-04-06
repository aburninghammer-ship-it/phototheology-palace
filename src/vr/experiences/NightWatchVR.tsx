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
import { WATCH_TRACTS, type WatchSession, type WatchTract } from '@/data/watchSeries';

interface NightWatchVRProps {
  onBack: () => void;
}

// ── Audio generation (same pipeline as useWatchPlayer) ──

function buildPrompt(session: WatchSession, tractName: string): string {
  return `Generate a 12-minute Night Watch meditation script to be read aloud as audio. This must be LONG — approximately 2,000 to 2,500 words of spoken content, PLUS generous silence. Do NOT cut it short.

IMPORTANT: Ambient music plays underneath the entire meditation. Include EXTENDED SILENCES of 30-60 seconds where the music plays alone and the listener remains in the scene. These musical interludes are sacred space.

Title: ${session.title}
Series: ${tractName}, Day ${session.dayNumber}
Scripture: ${session.scripture}
Scene: ${session.scene}
Master Mind Insight: ${session.masterMindInsight}
Mood: ${session.mood}
Primary Struggle: ${session.struggle}

CRITICAL PHILOSOPHY — READ THIS FIRST:
This meditation has ZERO to do with breathing, posture, or relaxation technique. Do NOT mention deep breathing. Do NOT mention posture. Do NOT mention "getting comfortable." Do NOT mention body scans or physical sensations. This is CINEMATIC BIBLICAL MIND TRANSPLANT.

The listener's mind is a movie theater. The screen is INSIDE them. What they place on that screen shapes who they become. Tonight, they project a scene from Scripture in VIVID FULL COLOR and step inside it. The goal: observe the THOUGHTS AND FEELINGS of Christ (or the biblical figure), then ASK THE HOLY SPIRIT TO DOWNLOAD those exact thoughts and feelings into their own mind. "Let this mind be in you which was also in Christ Jesus" (Philippians 2:5).

Follow this 6-phase structure. Each phase flows seamlessly — no labels, no headers, no time references.

PHASE 1 — LOCK IN (~2 minutes):
Open with authority. Command the listener to LOCK IN. This is not casual. This is sacred time — guard it. Push out distractions. Establish: "Your mind becomes a theater. The screen is within you. What you place on that screen will shape you." Introduce tonight's Scripture (${session.scripture}) and the Master Mind concept. [pause]

PHASE 2 — ENTER THE SCENE (~3 minutes):
"Step into the scene. See it. Not faintly. In FULL COLOR." Hyper-vivid, cinematic, present-tense narration of ${session.scene}. Extreme sensory detail. Place the listener INSIDE as a witness. [pause] after every 2-3 sentences. After the scene is fully painted, include [extended silence] — 45-60 seconds of pure music.

PHASE 3 — OBSERVE THE MIND (~2.5 minutes):
"Now stop. What is He thinking?" Shift from what is SEEN to what is THOUGHT AND FELT. Enter Christ's inner world. Show the CONTRAST between natural human reactions and Christ's Master Mind: ${session.masterMindInsight}. Use [long pause] generously. End with [extended silence] — 30-45 seconds.

PHASE 4 — DOWNLOAD (~2 minutes):
"Do not just observe. Enter." Guide the listener: "Lord, let me see what You see. Let me feel what You feel. Download Your thoughts into my thoughts. Replace my reactions with Yours." Address ${session.struggle} directly — overlay the scene onto real life. End with [extended silence] — 45-60 seconds.

PHASE 5 — IMPRINT (~1.5 minutes):
Reduce words dramatically. Hold the scene. Let it imprint. [extended silence] for 30-45 seconds. Only 2-3 sentences total.

PHASE 6 — SEAL AND CARRY (~1 minute):
"Say it: 'I receive the mind of Christ.' And mean it." Identity declaration from tonight's Scripture. "The screen never turns off. What you continue to behold, you will become."

CRITICAL RULES:
- Spoken content ~2,000-2,500 words. Remaining time is SILENCE with ambient music.
- ABSOLUTELY NO mention of breathing, deep breaths, posture, body position, getting comfortable, body scans, wiggling fingers, or physical relaxation. ZERO.
- The ONLY physical metaphor is the MIND AS A MOVIE THEATER / SCREEN.
- Use THREE pause markers:
  [pause] = 3-5 seconds (use frequently)
  [long pause] = 10-20 seconds (phases 3-4)
  [extended silence] = 30-60 seconds of music only (use at least 3-4 times)
- Cinematic and prophetic style. Mix short punchy lines and flowing sentences.
- Do NOT include section headers, stage directions, or meta-commentary.
- The power is in BEHOLDING, not breathing. The "Download" is literal — asking the Spirit to transplant Christ's thoughts and feelings.
- Second person ("you") throughout. Intimate. Authoritative. Cinematic.

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

// ── 1. Moon with glow halo ──
function Moon({ volume = 0 }: { volume?: number }) {
  const glowRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Gentle pulse + audio reactivity
    const pulse = 1 + Math.sin(t * 0.3) * 0.05 + volume * 0.15;
    if (glowRef.current) glowRef.current.scale.setScalar(pulse);
    if (haloRef.current) {
      (haloRef.current.material as THREE.MeshBasicMaterial).opacity = 0.08 + Math.sin(t * 0.2) * 0.02 + volume * 0.04;
      haloRef.current.scale.setScalar(pulse * 1.1);
    }
  });

  return (
    <group position={[15, 25, -35]}>
      {/* Moon surface */}
      <mesh>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshStandardMaterial color="#e8e4d4" emissive="#ddd8c8" emissiveIntensity={0.6} />
      </mesh>
      {/* Inner glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial color="#aabbdd" transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.BackSide} />
      </mesh>
      {/* Outer halo */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[6, 32, 32]} />
        <meshBasicMaterial color="#8899bb" transparent opacity={0.06} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

// ── 2. Rolling terrain hills ──
function Terrain() {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(120, 120, 64, 64);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getY(i); // in plane geometry, y maps to z after rotation
      const dist = Math.sqrt(x * x + z * z);
      // Keep center flat (the clearing), raise edges into hills
      const flatRadius = 10;
      const hillFactor = Math.max(0, (dist - flatRadius) / 20);
      const height = hillFactor * (
        Math.sin(x * 0.08) * 1.5 +
        Math.cos(z * 0.06) * 2 +
        Math.sin(x * 0.15 + z * 0.12) * 0.8
      );
      pos.setZ(i, height);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.25, 0]} geometry={geo}>
      <meshStandardMaterial color="#0a0f08" roughness={0.95} metalness={0} />
    </mesh>
  );
}

// ── 3. Tree silhouettes around the clearing ──
function TreeSilhouettes() {
  const trees = useMemo(() => {
    const arr: { x: number; z: number; height: number; trunkH: number; radius: number; rotation: number }[] = [];
    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const dist = 12 + Math.random() * 15;
      arr.push({
        x: Math.cos(angle) * dist,
        z: Math.sin(angle) * dist - 2,
        height: 3 + Math.random() * 5,
        trunkH: 1.5 + Math.random() * 2,
        radius: 0.8 + Math.random() * 1.2,
        rotation: Math.random() * 0.2 - 0.1,
      });
    }
    return arr;
  }, []);

  return (
    <group>
      {trees.map((t, i) => (
        <group key={i} position={[t.x, -1.2, t.z]} rotation={[0, 0, t.rotation]}>
          {/* Trunk */}
          <mesh position={[0, t.trunkH / 2, 0]}>
            <cylinderGeometry args={[0.08, 0.15, t.trunkH, 5]} />
            <meshStandardMaterial color="#0a0a08" />
          </mesh>
          {/* Canopy — pine cone shape */}
          <mesh position={[0, t.trunkH + t.height * 0.4, 0]}>
            <coneGeometry args={[t.radius, t.height, 6]} />
            <meshStandardMaterial color="#060d04" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ── 4. Reflective water puddles around the platform ──
function WaterReflection() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.22, 0]}>
      <ringGeometry args={[8.5, 14, 32]} />
      <meshPhysicalMaterial
        color="#060810"
        metalness={0.9}
        roughness={0.1}
        clearcoat={1}
        clearcoatRoughness={0.05}
        envMapIntensity={0.8}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

// ── 5. Drifting clouds across the moon ──
function DriftingClouds({ count = 6 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const clouds = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      x: -30 + i * 12 + (Math.random() - 0.5) * 8,
      y: 22 + Math.random() * 10,
      z: -30 - Math.random() * 15,
      speed: 0.15 + Math.random() * 0.2,
      scaleX: 4 + Math.random() * 6,
      scaleY: 0.8 + Math.random() * 1.2,
      opacity: 0.03 + Math.random() * 0.04,
    })),
  [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    clouds.forEach((c, i) => {
      const x = ((c.x + t * c.speed + 40) % 80) - 40;
      dummy.position.set(x, c.y, c.z);
      dummy.scale.set(c.scaleX, c.scaleY, 1);
      dummy.lookAt(x, c.y, c.z + 1); // face camera-ish direction
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color="#334466" transparent opacity={0.04} blending={THREE.NormalBlending} depthWrite={false} side={THREE.DoubleSide} />
    </instancedMesh>
  );
}

// ── 7. Ground-level fog layers ──
function GroundFog({ count = 12 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const wisps = useMemo(() =>
    Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 20,
      z: (Math.random() - 0.5) * 20 - 2,
      speed: 0.05 + Math.random() * 0.1,
      scaleX: 3 + Math.random() * 5,
      scaleZ: 2 + Math.random() * 3,
      phase: Math.random() * Math.PI * 2,
    })),
  [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    wisps.forEach((w, i) => {
      const opacity = 0.04 + Math.sin(t * 0.3 + w.phase) * 0.02;
      dummy.position.set(
        w.x + Math.sin(t * w.speed + w.phase) * 2,
        -1.0,
        w.z + Math.cos(t * w.speed * 0.7 + w.phase) * 1.5,
      );
      dummy.rotation.set(-Math.PI / 2, 0, t * w.speed * 0.1);
      dummy.scale.set(w.scaleX, w.scaleZ, 1);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      // Can't set per-instance opacity with instanced mesh, so use uniform
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    (meshRef.current.material as THREE.MeshBasicMaterial).opacity = 0.04 + Math.sin(t * 0.2) * 0.015;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <circleGeometry args={[1, 8]} />
      <meshBasicMaterial color="#1a2040" transparent opacity={0.04} blending={THREE.AdditiveBlending} depthWrite={false} />
    </instancedMesh>
  );
}

// ── 8. Stone platform detail — concentric rings + scattered rocks ──
function PlatformDetail() {
  const rocks = useMemo(() =>
    Array.from({ length: 15 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 7 + Math.random() * 2;
      return {
        x: Math.cos(angle) * dist,
        z: Math.sin(angle) * dist,
        scale: 0.1 + Math.random() * 0.25,
        rotY: Math.random() * Math.PI * 2,
      };
    }),
  []);

  return (
    <group>
      {/* Concentric etched rings */}
      {[2, 4, 6].map((r) => (
        <mesh key={r} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.18, 0]}>
          <ringGeometry args={[r - 0.02, r + 0.02, 64]} />
          <meshBasicMaterial color="#2a2a3f" transparent opacity={0.3} />
        </mesh>
      ))}
      {/* Scattered rocks around edge */}
      {rocks.map((r, i) => (
        <mesh key={i} position={[r.x, -1.15, r.z]} rotation={[0.2, r.rotY, 0.1]} scale={[r.scale, r.scale * 0.6, r.scale]}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#1a1a25" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

// ── 9. Constellation lines connecting some stars ──
function Constellations() {
  const lines = useMemo(() => {
    // Define a few simple constellation shapes
    const constellations: THREE.Vector3[][] = [];
    const makeConstellation = (points: [number, number, number][]) =>
      points.map((p) => new THREE.Vector3(...p));

    // Orion-like
    constellations.push(makeConstellation([
      [-8, 18, -40], [-6, 20, -42], [-5, 22, -40], [-4, 20, -38],
      [-3, 18, -40], [-5, 16, -41], [-7, 16, -39],
    ]));
    // Cross
    constellations.push(makeConstellation([
      [10, 25, -45], [10, 22, -44], [10, 19, -43],
    ]));
    constellations.push(makeConstellation([
      [8, 22, -44], [10, 22, -44], [12, 22, -44],
    ]));
    // Dipper-like
    constellations.push(makeConstellation([
      [20, 28, -50], [22, 27, -48], [24, 28, -47], [23, 30, -49],
      [20, 28, -50],
    ]));
    // Small triangle
    constellations.push(makeConstellation([
      [-20, 22, -38], [-18, 25, -40], [-16, 22, -39], [-20, 22, -38],
    ]));

    return constellations;
  }, []);

  return (
    <group>
      {lines.map((points, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={points.length}
              array={new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#334466" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
        </line>
      ))}
      {/* Star dots at constellation vertices */}
      {lines.flatMap((pts) => pts).map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.08, 4, 4]} />
          <meshBasicMaterial color="#aabbdd" transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

// ── 11. Gentle camera sway during meditation ──
function CameraSway({ active, intensity = 0.003 }: { active: boolean; intensity?: number }) {
  const { camera } = useThree();
  const baseRotation = useRef<THREE.Euler | null>(null);

  useFrame(({ clock }) => {
    if (!active) {
      baseRotation.current = null;
      return;
    }
    if (!baseRotation.current) {
      baseRotation.current = camera.rotation.clone();
    }
    const t = clock.getElapsedTime();
    camera.rotation.x = baseRotation.current.x + Math.sin(t * 0.15) * intensity;
    camera.rotation.z = baseRotation.current.z + Math.cos(t * 0.1) * intensity * 0.5;
  });

  return null;
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
      <Environment preset="night" background resolution={512} />

      {/* 1. Moon with audio-reactive glow */}
      <Moon volume={avgVolume} />

      {/* Vast star field */}
      <StarField count={3500} radius={60} brightness={screen === 'playing' ? 0.7 + avgVolume * 0.3 : 0.9} />
      <NebulaClouds count={8} radius={35} colors={['#0a1030', '#1a2060', '#0d1840', '#0a0828']} opacity={0.08 + avgVolume * 0.06} />

      {/* 9. Constellation lines */}
      <Constellations />

      {/* 5. Drifting clouds across the moon */}
      <DriftingClouds count={6} />

      {/* Shooting stars */}
      <ShootingStars />

      {/* 10. Fireflies — more during meditation */}
      <Fireflies count={screen === 'playing' ? 35 + Math.floor(avgVolume * 15) : 20} />

      {/* 2. Rolling terrain hills */}
      <Terrain />

      {/* 3. Tree silhouettes around clearing */}
      <TreeSilhouettes />

      {/* 4. Reflective water ring around platform */}
      <WaterReflection />

      {/* Stone platform / clearing */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
        <circleGeometry args={[8, 32]} />
        <meshPhysicalMaterial color="#1a1a2a" metalness={0.3} roughness={0.6} clearcoat={0.4} clearcoatRoughness={0.4} envMapIntensity={0.5} />
      </mesh>
      {/* Stone platform rim */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.19, 0]}>
        <ringGeometry args={[7.5, 8.2, 32]} />
        <meshPhysicalMaterial color="#2a2a3a" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* 8. Platform detail — etched rings + rocks */}
      <PlatformDetail />

      {/* 7. Ground fog layers */}
      <GroundFog count={12} />

      {/* 6. Audio-reactive moonlight — cool directional from moon direction */}
      <ambientLight intensity={0.06 + avgVolume * 0.04} color="#8899cc" />
      <directionalLight position={[15, 25, -35]} intensity={0.4 + avgVolume * 0.2} color="#aabbee" />
      <directionalLight position={[-5, 3, 2]} intensity={0.08} color="#667799" />
      <pointLight position={[0, 3, -2]} intensity={0.2 + avgVolume * 0.4} color="#6677aa" distance={12} />
      <pointLight position={[-3, 2, -4]} intensity={0.15 + avgVolume * 0.25} color="#556699" distance={8} />

      <fog attach="fog" args={['#030610', 12, 50]} />

      <MeditationParticles count={50} brightness={screen === 'playing' ? 0.5 + avgVolume * 0.5 : 0.6} />

      {/* 11. Gentle camera sway during meditation */}
      <CameraSway active={screen === 'playing'} />

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
