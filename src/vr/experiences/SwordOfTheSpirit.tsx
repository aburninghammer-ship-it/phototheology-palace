/**
 * Sword of the Spirit — VR sword & shield battle
 *
 * Bad thoughts (dark orbs) fly toward you — STRIKE with sword (click/tap).
 * Good thoughts (golden orbs) fly toward you — BLOCK with shield (let them pass / click to absorb).
 * Armor gauge fills with absorbed good thoughts. Health depletes when bad thoughts hit you.
 *
 * Desktop: click orbs. VR: ray-select or swing controller.
 */
import { useRef, useMemo, useState, useCallback, Suspense, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Environment } from '@react-three/drei';
import { Interactive, useController } from '@react-three/xr';
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
  hitFlash: number;
}

type GameState = 'menu' | 'playing' | 'gameover';

// ── Pointed Sword 3D — tracks right VR controller when in headset ──

function SwordModel({ position, swinging }: { position: [number, number, number]; swinging: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const swingRef = useRef(0);
  const rightController = useController('right');

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Track VR right controller if available
    if (rightController?.controller) {
      const ctrl = rightController.controller;
      groupRef.current.position.copy(ctrl.position);
      groupRef.current.quaternion.copy(ctrl.quaternion);
      // Offset sword forward from grip
      groupRef.current.translateY(0.15);
      groupRef.current.translateZ(-0.05);
    }

    // Swing animation
    if (swinging) {
      swingRef.current = Math.min(1, swingRef.current + delta * 8);
    } else {
      swingRef.current = Math.max(0, swingRef.current - delta * 4);
    }

    // Only apply swing rotation when no controller (desktop mode)
    if (!rightController?.controller) {
      const swingAngle = Math.sin(swingRef.current * Math.PI) * 0.8;
      groupRef.current.rotation.z = -0.3 + swingAngle;
      groupRef.current.rotation.x = swingAngle * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Blade — pointed */}
      <mesh position={[0, 0.8, 0]}>
        <coneGeometry args={[0.06, 1.8, 4]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} emissive="#88AAFF" emissiveIntensity={0.3} />
      </mesh>
      {/* Cross guard */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[0.5, 0.06, 0.08]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Handle */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>
      {/* Pommel */}
      <mesh position={[0, -0.65, 0]}>
        <sphereGeometry args={[0.06, 8, 6]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Glow */}
      <pointLight position={[0, 0.5, 0]} color="#88CCFF" intensity={0.5 + (swinging ? 1.5 : 0)} distance={3} />
    </group>
  );
}

// ── Shield 3D — tracks left VR controller when in headset ──

function ShieldModel({ position, blocking }: { position: [number, number, number]; blocking: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const blockRef = useRef(0);
  const leftController = useController('left');

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Track VR left controller if available
    if (leftController?.controller) {
      const ctrl = leftController.controller;
      groupRef.current.position.copy(ctrl.position);
      groupRef.current.quaternion.copy(ctrl.quaternion);
      // Offset shield in front of hand
      groupRef.current.translateZ(-0.1);
    }

    // Block animation
    if (blocking) {
      blockRef.current = Math.min(1, blockRef.current + delta * 6);
    } else {
      blockRef.current = Math.max(0, blockRef.current - delta * 3);
    }

    // Desktop fallback positioning
    if (!leftController?.controller) {
      groupRef.current.position.z = position[2] + blockRef.current * -0.3;
      groupRef.current.scale.setScalar(1 + blockRef.current * 0.15);
    } else {
      groupRef.current.scale.setScalar(1 + blockRef.current * 0.15);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Shield face — rounded rectangle shape using a circle */}
      <mesh>
        <circleGeometry args={[0.4, 6]} />
        <meshStandardMaterial
          color="#FFD700"
          metalness={0.7}
          roughness={0.3}
          emissive="#AA8800"
          emissiveIntensity={blocking ? 0.8 : 0.2}
        />
      </mesh>
      {/* Shield rim */}
      <mesh position={[0, 0, -0.02]}>
        <ringGeometry args={[0.35, 0.42, 6]} />
        <meshStandardMaterial color="#886600" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Cross emblem on shield */}
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[0.05, 0.3, 0.01]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={blocking ? 1 : 0.3} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[0.2, 0.05, 0.01]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={blocking ? 1 : 0.3} />
      </mesh>
      {/* Shield glow */}
      <pointLight position={[0, 0, 0.3]} color="#FFD700" intensity={blocking ? 2 : 0.3} distance={3} />
    </group>
  );
}

// ── Orb Component ──

function ThoughtOrb({
  orb,
  onAction,
}: {
  orb: ActiveOrb;
  onAction: (id: number) => void;
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
    meshRef.current.rotation.y += 0.01;
  });

  const handleClick = () => {
    if (orb.alive) {
      onAction(orb.id);
    }
  };

  if (!orb.alive) return null;

  const baseColor = isBad ? '#FF2244' : '#FFD700';

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
      <Interactive onSelect={handleClick}>
        <mesh ref={meshRef} onClick={handleClick} onPointerDown={handleClick}>
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

      {/* Type indicator icon */}
      <Suspense fallback={null}>
        <Text
          position={[orb.position.x, orb.position.y + 0.5, orb.position.z]}
          fontSize={0.12}
          color={isBad ? '#FF6688' : '#FFEE88'}
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.005}
          outlineColor="#000"
        >
          {isBad ? '⚔️ STRIKE' : '🛡️ BLOCK'}
        </Text>
        <Text
          position={[orb.position.x, orb.position.y + 0.35, orb.position.z]}
          fontSize={0.07}
          color={isBad ? '#FF6688' : '#FFEE88'}
          anchorX="center"
          anchorY="bottom"
          maxWidth={1.5}
          textAlign="center"
          outlineWidth={0.003}
          outlineColor="#000"
        >
          {orb.thought.text}
        </Text>
      </Suspense>

      <pointLight
        position={[orb.position.x, orb.position.y, orb.position.z]}
        color={baseColor}
        intensity={0.3 + orb.hitFlash}
        distance={3}
      />
    </group>
  );
}

// ── Slash/Block effects ──

interface HitEffect {
  id: number;
  position: THREE.Vector3;
  color: string;
  type: 'slash' | 'block';
  time: number;
}

function HitEffects({ effects }: { effects: HitEffect[] }) {
  return (
    <>
      {effects.map((fx) => {
        const age = (Date.now() - fx.time) / 1000;
        if (age > 0.8) return null;
        const opacity = 1 - age / 0.8;
        const scale = 0.5 + age * 2;
        return (
          <group key={fx.id}>
            <mesh position={fx.position} scale={scale}>
              {fx.type === 'slash' ? (
                <ringGeometry args={[0.2, 0.35, 8]} />
              ) : (
                <circleGeometry args={[0.4, 16]} />
              )}
              <meshBasicMaterial
                color={fx.color}
                transparent
                opacity={opacity * 0.6}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
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
      <mesh position={[0, -0.28, 0]}>
        <planeGeometry args={[1, 0.06]} />
        <meshBasicMaterial color="#222" transparent opacity={0.8} />
      </mesh>
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

      {/* Instructions */}
      <group position={[0, -0.8, -3]}>
        <Suspense fallback={null}>
          <Text position={[-0.8, 0, 0]} fontSize={0.06} color="#FF6688" anchorX="center">
            ⚔️ STRIKE dark thoughts
          </Text>
          <Text position={[0.8, 0, 0]} fontSize={0.06} color="#FFEE88" anchorX="center">
            🛡️ BLOCK to absorb truth
          </Text>
        </Suspense>
      </group>

      <ArmorDisplay level={level} progress={armorProgress} />
    </group>
  );
}

// Dust/debris floating in arena
function ArenaDust({ count = 40 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const basePositions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = -0.5 + Math.random() * 3;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const arr = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const t = clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      arr[i * 3] = basePositions[i * 3] + Math.sin(t * 0.15 + i * 0.7) * 0.5;
      arr[i * 3 + 1] = ((basePositions[i * 3 + 1] + t * 0.04) % 3) - 0.5;
      arr[i * 3 + 2] = basePositions[i * 3 + 2] + Math.cos(t * 0.1 + i) * 0.4;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={new Float32Array(basePositions)} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#887766" transparent opacity={0.3} depthWrite={false} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
}

// ── Arena Pillars with Braziers ──
function ArenaPillars() {
  const brazierRefs = useRef<(THREE.PointLight | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    brazierRefs.current.forEach((light, i) => {
      if (light) {
        light.intensity = 1.2 + Math.sin(t * 5 + i * 2) * 0.4 + Math.sin(t * 8 + i) * 0.2;
      }
    });
  });

  const pillars = useMemo(() => {
    const arr: { x: number; z: number; angle: number }[] = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      arr.push({
        x: Math.cos(angle) * 7,
        z: Math.sin(angle) * 7,
        angle,
      });
    }
    return arr;
  }, []);

  return (
    <group>
      {pillars.map((p, i) => (
        <group key={i} position={[p.x, -1.2, p.z]}>
          {/* Stone pillar */}
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.15, 0.2, 3, 6]} />
            <meshStandardMaterial color="#1a1a2a" roughness={0.8} metalness={0.3} />
          </mesh>
          {/* Brazier bowl */}
          <mesh position={[0, 3.1, 0]}>
            <cylinderGeometry args={[0.25, 0.15, 0.15, 6]} />
            <meshStandardMaterial color="#2a2a3a" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* Fire glow */}
          <mesh position={[0, 3.3, 0]}>
            <sphereGeometry args={[0.12, 6, 6]} />
            <meshBasicMaterial color={i % 2 === 0 ? '#FF4466' : '#FFD700'} transparent opacity={0.7} />
          </mesh>
          <pointLight
            ref={(el) => { brazierRefs.current[i] = el; }}
            position={[0, 3.4, 0]}
            color={i % 2 === 0 ? '#FF4466' : '#FFD700'}
            intensity={1.2}
            distance={6}
          />
        </group>
      ))}
    </group>
  );
}

// ── Screen Shake on Hit ──
function ScreenShake({ shakeIntensity }: { shakeIntensity: number }) {
  const { camera } = useThree();
  const basePos = useRef<THREE.Vector3 | null>(null);

  useFrame(() => {
    if (shakeIntensity <= 0) {
      basePos.current = null;
      return;
    }
    if (!basePos.current) basePos.current = camera.position.clone();
    camera.position.x = basePos.current.x + (Math.random() - 0.5) * shakeIntensity * 0.08;
    camera.position.y = basePos.current.y + (Math.random() - 0.5) * shakeIntensity * 0.04;
  });

  return null;
}

// ── Arena environment ──

function BattleArena() {
  return (
    <group>
      {/* Environment IBL for dramatic arena reflections */}
      <Environment preset="night" background resolution={512} />

      {/* Arena floor — stone-like */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshPhysicalMaterial color="#0c0c1a" metalness={0.6} roughness={0.3} clearcoat={0.4} clearcoatRoughness={0.3} envMapIntensity={0.4} />
      </mesh>
      <gridHelper args={[20, 30, '#1a1a4a', '#0a0a2a']} position={[0, -1.19, 0]} />

      {/* Arena ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.18, 0]}>
        <ringGeometry args={[2, 2.2, 32]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Outer arena ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.18, 0]}>
        <ringGeometry args={[6, 6.15, 48]} />
        <meshBasicMaterial color="#FF4466" transparent opacity={0.08} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Dramatic dome sky */}
      <mesh position={[0, 5, 0]}>
        <sphereGeometry args={[15, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#040412" side={THREE.BackSide} />
      </mesh>

      {/* Dramatic overhead lighting */}
      <ambientLight intensity={0.12} color="#222244" />
      <pointLight position={[0, 6, 0]} intensity={0.8} color="#6366f1" distance={18} />
      <pointLight position={[-5, 3, -5]} intensity={0.5} color="#FF4466" distance={12} />
      <pointLight position={[5, 3, -5]} intensity={0.5} color="#FFD700" distance={12} />

      <directionalLight position={[0, 12, -5]} intensity={0.6} color="#6366f1" />
      <directionalLight position={[-8, 4, 3]} intensity={0.35} color="#FF4466" />
      <directionalLight position={[8, 4, 3]} intensity={0.35} color="#FFD700" />

      <fog attach="fog" args={['#040412', 12, 28]} />

      <StarField count={1500} radius={14} brightness={0.5} />
      <ArenaDust count={50} />

      {/* Stone pillars with braziers around the arena */}
      <ArenaPillars />
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
  const [swordSwinging, setSwordSwinging] = useState(false);
  const [shieldBlocking, setShieldBlocking] = useState(false);
  const [shakeIntensity, setShakeIntensity] = useState(0);

  const orbsRef = useRef<ActiveOrb[]>([]);
  const [orbs, setOrbs] = useState<ActiveOrb[]>([]);
  const [effects, setEffects] = useState<HitEffect[]>([]);

  const spawnTimerRef = useRef(0);
  const difficultyRef = useRef(1);
  const comboRef = useRef(0);
  const scoreRef = useRef(0);
  const healthRef = useRef(100);

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

  const handleAction = useCallback((id: number) => {
    const orb = orbsRef.current.find((o) => o.id === id);
    if (!orb || !orb.alive) return;

    orb.alive = false;
    orb.hitFlash = 1;

    if (orb.thought.type === 'bad') {
      // SWORD STRIKE — slash the dark thought!
      setSwordSwinging(true);
      setTimeout(() => setSwordSwinging(false), 300);

      const newCombo = comboRef.current + 1;
      const points = 10 * Math.min(newCombo, 10);
      setCombo(newCombo);
      setScore((s) => {
        const newScore = s + points;
        const currentLvl = ARMOR_LEVELS.findIndex((a) => newScore < a.targetScore);
        if (currentLvl > 0) setArmorLevel(currentLvl);
        else if (currentLvl === -1) setArmorLevel(ARMOR_LEVELS.length - 1);
        return newScore;
      });

      setEffects((prev) => [
        ...prev.slice(-10),
        { id: nextFxId++, position: orb.position.clone(), color: '#FF4466', type: 'slash', time: Date.now() },
      ]);
    } else {
      // SHIELD BLOCK — absorb the truth!
      setShieldBlocking(true);
      setTimeout(() => setShieldBlocking(false), 400);

      const newCombo = comboRef.current + 1;
      setCombo(newCombo);
      setScore((s) => s + 25);

      setEffects((prev) => [
        ...prev.slice(-10),
        { id: nextFxId++, position: orb.position.clone(), color: '#FFD700', type: 'block', time: Date.now() },
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
      const isBad = Math.random() < 0.6;
      const pool = isBad ? BAD_THOUGHTS : GOOD_THOUGHTS;
      const thought = pool[Math.floor(Math.random() * pool.length)];

      const angle = (Math.random() - 0.5) * Math.PI * 0.8;
      const dist = 6 + Math.random() * 3;
      const spawnPos = new THREE.Vector3(
        Math.sin(angle) * dist,
        0.5 + Math.random() * 2,
        -Math.cos(angle) * dist,
      );

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
      spawnTimerRef.current = Math.max(0.6, 2.5 - difficultyRef.current * 0.3);
      difficultyRef.current = Math.min(5, 1 + scoreRef.current / 200);
    }

    // Update orbs
    let healthDelta = 0;
    let lostCombo = false;

    for (const orb of orbsRef.current) {
      if (!orb.alive) {
        orb.hitFlash = Math.max(0, orb.hitFlash - delta * 4);
        continue;
      }

      orb.position.add(orb.velocity.clone().multiplyScalar(delta));

      const distToPlayer = orb.position.distanceTo(new THREE.Vector3(0, 1.2, 0));

      if (distToPlayer < 0.8) {
        orb.alive = false;
        if (orb.thought.type === 'bad') {
          // Bad thought hit you — lose health
          healthDelta -= 15;
          lostCombo = true;
        } else {
          // Good thought passed through — missed block, small penalty
          healthDelta -= 5;
        }
      }

      if (orb.position.z > 5) {
        orb.alive = false;
      }
    }

    if (healthDelta !== 0) {
      // Screen shake on damage
      setShakeIntensity(Math.abs(healthDelta) / 15);
      setTimeout(() => setShakeIntensity(0), 200);
      setHealth((h) => {
        const newH = Math.max(0, Math.min(100, h + healthDelta));
        healthRef.current = newH;
        if (newH <= 0) setGameState('gameover');
        return newH;
      });
    }
    if (lostCombo) {
      setCombo(0);
      comboRef.current = 0;
    }

    orbsRef.current = orbsRef.current.filter(
      (o) => o.alive || now - o.spawnTime < 2000,
    );

    if (scoreRef.current > wave * 200) {
      setWave((w) => w + 1);
    }

    setOrbs([...orbsRef.current]);
  });

  // Clean up old effects
  useEffect(() => {
    const interval = setInterval(() => {
      setEffects((prev) => prev.filter((fx) => Date.now() - fx.time < 1000));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const currentArmorTarget = ARMOR_LEVELS[Math.min(armorLevel, ARMOR_LEVELS.length - 1)];
  const prevTarget = armorLevel > 0 ? ARMOR_LEVELS[armorLevel - 1].targetScore : 0;
  const armorProgress = Math.min(1, (score - prevTarget) / (currentArmorTarget.targetScore - prevTarget));

  return (
    <group>
      <BattleArena />
      <ScreenShake shakeIntensity={shakeIntensity} />

      {/* Sword (right side) */}
      <SwordModel position={[0.7, 0.3, -0.5]} swinging={swordSwinging} />

      {/* Shield (left side) */}
      <ShieldModel position={[-0.6, 0.6, -0.5]} blocking={shieldBlocking} />

      {/* ─── MENU ─── */}
      {gameState === 'menu' && (
        <Suspense fallback={null}>
          <Text position={[0, 2.5, -3]} fontSize={0.3} color="#FFD700" anchorX="center" outlineWidth={0.012} outlineColor="#000">
            Sword of the Spirit
          </Text>
          <Text position={[0, 2.1, -3]} fontSize={0.1} color="#888" anchorX="center">
            Ephesians 6:17 — "The sword of the Spirit, which is the word of God"
          </Text>

          <Text position={[0, 1.5, -3]} fontSize={0.08} color="#aaa" anchorX="center" maxWidth={3.5} textAlign="center">
            ⚔️ STRIKE dark thoughts with the Sword{'\n'}🛡️ BLOCK to absorb golden truths with the Shield{'\n'}Collect all 6 pieces of the Armor of God.
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

          {orbs.filter((o) => o.alive || o.hitFlash > 0).map((orb) => (
            <ThoughtOrb key={orb.id} orb={orb} onAction={handleAction} />
          ))}

          <HitEffects effects={effects} />

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
