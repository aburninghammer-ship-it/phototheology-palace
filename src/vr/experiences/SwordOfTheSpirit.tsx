/**
 * Sword of the Spirit — VR thought-capture game
 *
 * Bad thoughts (dark orbs with text) fly toward you — slash them with the sword.
 * Good thoughts (golden orbs with scripture) fly toward you — catch them (let them pass through you).
 * Armor gauge fills with caught good thoughts. Health depletes when bad thoughts hit you.
 *
 * Desktop: click orbs. VR: ray-select or swing controller.
 */
import { useRef, useMemo, useState, useCallback, Suspense, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Interactive } from '@react-three/xr';
import * as THREE from 'three';
import { BackToLobbyButton } from '../components/BackToLobbyButton';
import { StarField } from '../components/StarField';

// ── Game Data ──

interface Thought {
  id: number;
  text: string;
  type: 'bad' | 'good';
  category?: string;
}

const BAD_THOUGHTS: Omit<Thought, 'id'>[] = [
  { text: 'You are not enough', type: 'bad', category: 'identity' },
  { text: 'Nobody cares', type: 'bad', category: 'isolation' },
  { text: 'God has abandoned you', type: 'bad', category: 'doubt' },
  { text: 'You will always fail', type: 'bad', category: 'despair' },
  { text: "It's too late for you", type: 'bad', category: 'shame' },
  { text: 'You are alone', type: 'bad', category: 'isolation' },
  { text: 'Your sin defines you', type: 'bad', category: 'shame' },
  { text: "Why even try?", type: 'bad', category: 'despair' },
  { text: 'God is angry at you', type: 'bad', category: 'fear' },
  { text: 'You are worthless', type: 'bad', category: 'identity' },
  { text: 'Nothing will change', type: 'bad', category: 'despair' },
  { text: 'You deserve this pain', type: 'bad', category: 'shame' },
  { text: "You can't be forgiven", type: 'bad', category: 'guilt' },
  { text: 'Give up', type: 'bad', category: 'despair' },
  { text: 'You are a fraud', type: 'bad', category: 'shame' },
];

const GOOD_THOUGHTS: Omit<Thought, 'id'>[] = [
  { text: 'I am fearfully made\nPsalm 139:14', type: 'good', category: 'identity' },
  { text: 'Nothing separates me\nRomans 8:38-39', type: 'good', category: 'security' },
  { text: 'He will never leave\nHebrews 13:5', type: 'good', category: 'presence' },
  { text: 'I can do all things\nPhilippians 4:13', type: 'good', category: 'strength' },
  { text: 'New creation in Christ\n2 Corinthians 5:17', type: 'good', category: 'identity' },
  { text: 'More than conquerors\nRomans 8:37', type: 'good', category: 'victory' },
  { text: 'His grace is sufficient\n2 Corinthians 12:9', type: 'good', category: 'grace' },
  { text: 'Plans to prosper\nJeremiah 29:11', type: 'good', category: 'hope' },
  { text: 'Perfect love casts out fear\n1 John 4:18', type: 'good', category: 'security' },
  { text: 'I am chosen\n1 Peter 2:9', type: 'good', category: 'identity' },
  { text: 'The Lord is my strength\nPsalm 28:7', type: 'good', category: 'strength' },
  { text: 'Forgiven and free\nColossians 1:14', type: 'good', category: 'grace' },
];

// ── Armor of God levels ──

interface ArmorLevel {
  name: string;
  piece: string;
  scripture: string;
  color: string;
  targetScore: number;
}

const ARMOR_LEVELS: ArmorLevel[] = [
  { name: 'Belt of Truth', piece: 'belt', scripture: 'Ephesians 6:14a', color: '#FFFFFF', targetScore: 100 },
  { name: 'Breastplate of Righteousness', piece: 'breastplate', scripture: 'Ephesians 6:14b', color: '#C0C0C0', targetScore: 250 },
  { name: 'Shoes of the Gospel', piece: 'shoes', scripture: 'Ephesians 6:15', color: '#CD7F32', targetScore: 450 },
  { name: 'Shield of Faith', piece: 'shield', scripture: 'Ephesians 6:16', color: '#FFD700', targetScore: 700 },
  { name: 'Helmet of Salvation', piece: 'helmet', scripture: 'Ephesians 6:17a', color: '#FFD700', targetScore: 1000 },
  { name: 'Sword of the Spirit', piece: 'sword', scripture: 'Ephesians 6:17b', color: '#88CCFF', targetScore: 1400 },
];

// ── Types ──

interface ActiveOrb {
  id: number;
  thought: Omit<Thought, 'id'>;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  alive: boolean;
  spawnTime: number;
  hitFlash: number; // 0-1 flash when hit
}

type GameState = 'menu' | 'playing' | 'gameover';

// ── Orb Component ──

function ThoughtOrb({
  orb,
  onSlash,
}: {
  orb: ActiveOrb;
  onSlash: (id: number) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const isBad = orb.thought.type === 'bad';

  useFrame(({ clock }) => {
    if (!meshRef.current || !orb.alive) return;
    meshRef.current.position.copy(orb.position);
    if (glowRef.current) {
      glowRef.current.position.copy(orb.position);
      const t = clock.getElapsedTime();
      const pulse = 1 + Math.sin(t * 3 + orb.id) * 0.15;
      glowRef.current.scale.setScalar(pulse);
    }
    // Gentle rotation
    meshRef.current.rotation.y += 0.01;
  });

  const handleClick = () => {
    if (isBad && orb.alive) {
      onSlash(orb.id);
    }
  };

  if (!orb.alive) return null;

  const baseColor = isBad ? '#FF2244' : '#FFD700';
  const glowColor = isBad ? '#880022' : '#886600';

  return (
    <group>
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.5, 12, 8]} />
        <meshBasicMaterial
          color={baseColor}
          transparent
          opacity={0.08 + orb.hitFlash * 0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Main orb */}
      <Interactive onSelect={() => handleClick()}>
        <mesh
          ref={meshRef}
          onClick={handleClick}
          onPointerDown={handleClick}
        >
          <sphereGeometry args={[0.25, 16, 12]} />
          <meshStandardMaterial
            color={orb.hitFlash > 0 ? '#FFFFFF' : baseColor}
            emissive={orb.hitFlash > 0 ? '#FFFFFF' : baseColor}
            emissiveIntensity={0.5 + orb.hitFlash * 2}
            transparent
            opacity={0.9}
            metalness={0.2}
            roughness={0.5}
          />
        </mesh>
      </Interactive>

      {/* Text label */}
      <Suspense fallback={null}>
        <Text
          position={[orb.position.x, orb.position.y + 0.4, orb.position.z]}
          fontSize={0.08}
          color={isBad ? '#FF6688' : '#FFEE88'}
          anchorX="center"
          anchorY="bottom"
          maxWidth={1.5}
          textAlign="center"
          outlineWidth={0.004}
          outlineColor="#000"
        >
          {orb.thought.text}
        </Text>
      </Suspense>

      {/* Point light */}
      <pointLight
        position={[orb.position.x, orb.position.y, orb.position.z]}
        color={baseColor}
        intensity={0.3 + orb.hitFlash}
        distance={3}
      />
    </group>
  );
}

// ── Slash effect particles ──

interface SlashEffect {
  id: number;
  position: THREE.Vector3;
  color: string;
  time: number;
}

function SlashParticles({ effects }: { effects: SlashEffect[] }) {
  return (
    <>
      {effects.map((fx) => {
        const age = (Date.now() - fx.time) / 1000;
        if (age > 0.8) return null;
        const opacity = 1 - age / 0.8;
        const scale = 0.5 + age * 2;
        return (
          <mesh key={fx.id} position={fx.position} scale={scale}>
            <ringGeometry args={[0.2, 0.35, 8]} />
            <meshBasicMaterial
              color={fx.color}
              transparent
              opacity={opacity * 0.6}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </>
  );
}

// ── Armor Display ──

function ArmorDisplay({ level, progress }: { level: number; progress: number }) {
  const currentArmor = ARMOR_LEVELS[Math.min(level, ARMOR_LEVELS.length - 1)];

  return (
    <group position={[2.5, 2.2, -3]}>
      <Suspense fallback={null}>
        <Text position={[0, 0, 0]} fontSize={0.08} color={currentArmor.color} anchorX="center">
          {currentArmor.name}
        </Text>
        <Text position={[0, -0.14, 0]} fontSize={0.05} color="#888" anchorX="center">
          {currentArmor.scripture}
        </Text>
      </Suspense>
      {/* Progress bar background */}
      <mesh position={[0, -0.28, 0]}>
        <planeGeometry args={[1, 0.06]} />
        <meshBasicMaterial color="#222" transparent opacity={0.8} />
      </mesh>
      {/* Progress bar fill */}
      <mesh position={[-0.5 + (progress * 0.5), -0.28, 0.001]}>
        <planeGeometry args={[Math.max(progress, 0.01), 0.05]} />
        <meshBasicMaterial color={currentArmor.color} />
      </mesh>
    </group>
  );
}

// ── HUD ──

function GameHUD({ health, score, combo, level, armorProgress }: {
  health: number;
  score: number;
  combo: number;
  level: number;
  armorProgress: number;
}) {
  return (
    <group>
      {/* Health bar */}
      <group position={[-2.5, 2.5, -3]}>
        <Suspense fallback={null}>
          <Text position={[0, 0, 0]} fontSize={0.08} color="#FF4444" anchorX="center">
            HEALTH
          </Text>
        </Suspense>
        <mesh position={[0, -0.14, 0]}>
          <planeGeometry args={[1, 0.08]} />
          <meshBasicMaterial color="#330000" transparent opacity={0.8} />
        </mesh>
        <mesh position={[-0.5 + (health / 100 * 0.5), -0.14, 0.001]}>
          <planeGeometry args={[Math.max(health / 100, 0.01), 0.07]} />
          <meshBasicMaterial color={health > 30 ? '#FF4444' : '#FF0000'} />
        </mesh>
      </group>

      {/* Score */}
      <group position={[0, 2.8, -3]}>
        <Suspense fallback={null}>
          <Text position={[0, 0, 0]} fontSize={0.15} color="#FFD700" anchorX="center" outlineWidth={0.006} outlineColor="#000">
            {score}
          </Text>
          {combo > 1 && (
            <Text position={[0, -0.2, 0]} fontSize={0.08} color="#FF8800" anchorX="center">
              {combo}x COMBO
            </Text>
          )}
        </Suspense>
      </group>

      {/* Armor gauge */}
      <ArmorDisplay level={level} progress={armorProgress} />
    </group>
  );
}

// ── Arena environment ──

function BattleArena() {
  return (
    <group>
      {/* Dark floor with glowing grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#080818" metalness={0.6} roughness={0.3} />
      </mesh>
      <gridHelper args={[20, 30, '#1a1a4a', '#0a0a2a']} position={[0, -1.19, 0]} />

      {/* Subtle ring on floor around player */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.18, 0]}>
        <ringGeometry args={[2, 2.2, 32]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Dome */}
      <mesh position={[0, 5, 0]}>
        <sphereGeometry args={[15, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#040412" side={THREE.BackSide} />
      </mesh>

      {/* Atmospheric lighting */}
      <ambientLight intensity={0.15} color="#222244" />
      <pointLight position={[0, 4, 0]} intensity={0.5} color="#6366f1" distance={15} />
      <pointLight position={[-5, 3, -5]} intensity={0.4} color="#FF4466" distance={10} />
      <pointLight position={[5, 3, -5]} intensity={0.4} color="#FFD700" distance={10} />

      <fog attach="fog" args={['#040412', 10, 25]} />

      <StarField count={1000} radius={14} brightness={0.4} />
    </group>
  );
}

// ── Main Game ──

interface SwordOfTheSpiritProps {
  onBack: () => void;
}

let nextOrbId = 0;
let nextFxId = 0;

export default function SwordOfTheSpirit({ onBack }: SwordOfTheSpiritProps) {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [health, setHealth] = useState(100);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [armorLevel, setArmorLevel] = useState(0);
  const [wave, setWave] = useState(1);

  const orbsRef = useRef<ActiveOrb[]>([]);
  const [orbs, setOrbs] = useState<ActiveOrb[]>([]);
  const [effects, setEffects] = useState<SlashEffect[]>([]);

  const spawnTimerRef = useRef(0);
  const difficultyRef = useRef(1);
  const comboRef = useRef(0);
  const scoreRef = useRef(0);
  const healthRef = useRef(100);

  // Keep refs in sync
  useEffect(() => { comboRef.current = combo; }, [combo]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { healthRef.current = health; }, [health]);

  const startGame = useCallback(() => {
    setGameState('playing');
    setHealth(100);
    setScore(0);
    setCombo(0);
    setArmorLevel(0);
    setWave(1);
    orbsRef.current = [];
    setOrbs([]);
    setEffects([]);
    spawnTimerRef.current = 0;
    difficultyRef.current = 1;
    healthRef.current = 100;
    scoreRef.current = 0;
    comboRef.current = 0;
    nextOrbId = 0;
  }, []);

  const handleSlash = useCallback((id: number) => {
    const orb = orbsRef.current.find((o) => o.id === id);
    if (!orb || !orb.alive) return;

    if (orb.thought.type === 'bad') {
      // Slash bad thought — score!
      orb.alive = false;
      orb.hitFlash = 1;
      const newCombo = comboRef.current + 1;
      const points = 10 * Math.min(newCombo, 10);
      setCombo(newCombo);
      setScore((s) => {
        const newScore = s + points;
        // Check armor level up
        const currentLvl = ARMOR_LEVELS.findIndex((a) => newScore < a.targetScore);
        if (currentLvl > 0) setArmorLevel(currentLvl);
        else if (currentLvl === -1) setArmorLevel(ARMOR_LEVELS.length - 1);
        return newScore;
      });

      // Spawn slash effect
      setEffects((prev) => [
        ...prev.slice(-10),
        { id: nextFxId++, position: orb.position.clone(), color: '#FF4466', time: Date.now() },
      ]);
    }
  }, []);

  // Game loop
  useFrame((_, delta) => {
    if (gameState !== 'playing') return;

    const now = Date.now();

    // Spawn orbs
    spawnTimerRef.current -= delta;
    if (spawnTimerRef.current <= 0) {
      const isBad = Math.random() < 0.6; // 60% bad, 40% good
      const pool = isBad ? BAD_THOUGHTS : GOOD_THOUGHTS;
      const thought = pool[Math.floor(Math.random() * pool.length)];

      // Spawn from random position in front arc
      const angle = (Math.random() - 0.5) * Math.PI * 0.8;
      const dist = 6 + Math.random() * 3;
      const spawnPos = new THREE.Vector3(
        Math.sin(angle) * dist,
        0.5 + Math.random() * 2,
        -Math.cos(angle) * dist,
      );

      // Move toward player (0, 1.2, 0)
      const dir = new THREE.Vector3(0, 1.2, 0).sub(spawnPos).normalize();
      const speed = 0.8 + difficultyRef.current * 0.3;

      const orb: ActiveOrb = {
        id: nextOrbId++,
        thought,
        position: spawnPos,
        velocity: dir.multiplyScalar(speed),
        alive: true,
        spawnTime: now,
        hitFlash: 0,
      };

      orbsRef.current.push(orb);

      // Spawn interval decreases with difficulty
      spawnTimerRef.current = Math.max(0.6, 2.5 - difficultyRef.current * 0.3);

      // Increase difficulty over time
      difficultyRef.current = Math.min(5, 1 + scoreRef.current / 200);
    }

    // Update orbs
    let healthDelta = 0;
    let scoreDelta = 0;
    let lostCombo = false;

    for (const orb of orbsRef.current) {
      if (!orb.alive) {
        orb.hitFlash = Math.max(0, orb.hitFlash - delta * 4);
        continue;
      }

      // Move
      orb.position.add(orb.velocity.clone().multiplyScalar(delta));

      // Check if reached player zone (distance < 0.8 from origin)
      const distToPlayer = orb.position.distanceTo(new THREE.Vector3(0, 1.2, 0));

      if (distToPlayer < 0.8) {
        orb.alive = false;
        if (orb.thought.type === 'bad') {
          // Bad thought hit — lose health
          healthDelta -= 15;
          lostCombo = true;
        } else {
          // Good thought caught — bonus score!
          scoreDelta += 25;
          setEffects((prev) => [
            ...prev.slice(-10),
            { id: nextFxId++, position: orb.position.clone(), color: '#FFD700', time: Date.now() },
          ]);
        }
      }

      // Remove if too far behind
      if (orb.position.z > 5) {
        orb.alive = false;
        if (orb.thought.type === 'good') {
          // Missed a good thought — small penalty
          healthDelta -= 5;
        }
      }
    }

    // Apply deltas
    if (healthDelta !== 0) {
      setHealth((h) => {
        const newH = Math.max(0, Math.min(100, h + healthDelta));
        healthRef.current = newH;
        if (newH <= 0) setGameState('gameover');
        return newH;
      });
    }
    if (scoreDelta > 0) {
      setScore((s) => s + scoreDelta);
    }
    if (lostCombo) {
      setCombo(0);
      comboRef.current = 0;
    }

    // Clean up dead orbs older than 2s
    orbsRef.current = orbsRef.current.filter(
      (o) => o.alive || now - o.spawnTime < 2000,
    );

    // Wave progression
    if (scoreRef.current > wave * 200) {
      setWave((w) => w + 1);
    }

    // Sync rendered orbs
    setOrbs([...orbsRef.current]);
  });

  // Clean up old effects
  useEffect(() => {
    const interval = setInterval(() => {
      setEffects((prev) => prev.filter((fx) => Date.now() - fx.time < 1000));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Armor progress for current level
  const currentArmorTarget = ARMOR_LEVELS[Math.min(armorLevel, ARMOR_LEVELS.length - 1)];
  const prevTarget = armorLevel > 0 ? ARMOR_LEVELS[armorLevel - 1].targetScore : 0;
  const armorProgress = Math.min(1, (score - prevTarget) / (currentArmorTarget.targetScore - prevTarget));

  return (
    <group>
      <BattleArena />

      {/* ─── MENU ─── */}
      {gameState === 'menu' && (
        <Suspense fallback={null}>
          <Text position={[0, 2.5, -3]} fontSize={0.3} color="#FFD700" anchorX="center" outlineWidth={0.012} outlineColor="#000">
            Sword of the Spirit
          </Text>
          <Text position={[0, 2.1, -3]} fontSize={0.1} color="#888" anchorX="center">
            Ephesians 6:17 — "The sword of the Spirit, which is the word of God"
          </Text>

          <Text position={[0, 1.5, -3]} fontSize={0.08} color="#aaa" anchorX="center" maxWidth={3} textAlign="center">
            Slash the dark thoughts. Let the golden truths reach you.{'\n'}Collect all 6 pieces of the Armor of God.
          </Text>

          <Interactive onSelect={startGame}>
            <mesh position={[0, 0.8, -3]} onClick={startGame} onPointerDown={startGame}>
              <planeGeometry args={[1.8, 0.5]} />
              <meshStandardMaterial color="#1a1a30" emissive="#FFD700" emissiveIntensity={0.3} />
            </mesh>
          </Interactive>
          <Text position={[0, 0.8, -2.98]} fontSize={0.15} color="#FFD700" anchorX="center" anchorY="middle">
            Begin Battle
          </Text>
        </Suspense>
      )}

      {/* ─── PLAYING ─── */}
      {gameState === 'playing' && (
        <>
          <GameHUD
            health={health}
            score={score}
            combo={combo}
            level={armorLevel}
            armorProgress={armorProgress}
          />

          {/* Thought orbs */}
          {orbs.filter((o) => o.alive || o.hitFlash > 0).map((orb) => (
            <ThoughtOrb key={orb.id} orb={orb} onSlash={handleSlash} />
          ))}

          {/* Slash effects */}
          <SlashParticles effects={effects} />

          {/* Wave indicator */}
          <Suspense fallback={null}>
            <Text position={[-2.5, 2.2, -3]} fontSize={0.06} color="#666" anchorX="center">
              Wave {wave}
            </Text>
          </Suspense>
        </>
      )}

      {/* ─── GAME OVER ─── */}
      {gameState === 'gameover' && (
        <Suspense fallback={null}>
          <Text position={[0, 2.5, -3]} fontSize={0.3} color="#FF4444" anchorX="center" outlineWidth={0.012} outlineColor="#000">
            Overwhelmed
          </Text>
          <Text position={[0, 2.0, -3]} fontSize={0.12} color="#FFD700" anchorX="center">
            Score: {score}
          </Text>
          <Text position={[0, 1.7, -3]} fontSize={0.08} color="#888" anchorX="center">
            Armor Level: {ARMOR_LEVELS[Math.min(armorLevel, ARMOR_LEVELS.length - 1)].name}
          </Text>
          <Text position={[0, 1.3, -3]} fontSize={0.07} color="#666" anchorX="center" maxWidth={3} textAlign="center">
            "Put on the full armor of God, so that you can take your stand{'\n'}against the devil's schemes." — Ephesians 6:11
          </Text>

          <Interactive onSelect={startGame}>
            <mesh position={[0, 0.7, -3]} onClick={startGame} onPointerDown={startGame}>
              <planeGeometry args={[1.8, 0.5]} />
              <meshStandardMaterial color="#1a1a30" emissive="#FFD700" emissiveIntensity={0.3} />
            </mesh>
          </Interactive>
          <Text position={[0, 0.7, -2.98]} fontSize={0.15} color="#FFD700" anchorX="center" anchorY="middle">
            Fight Again
          </Text>
        </Suspense>
      )}

      <BackToLobbyButton onBack={onBack} position={[0, -0.5, 0.5]} />
    </group>
  );
}
