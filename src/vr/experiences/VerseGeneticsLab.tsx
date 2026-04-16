/**
 * Verse Genetics Lab — VR Bible Freestyle Game
 * Two verses appear floating; identify the connection between them.
 * Uses Bible Freestyle Room (BF) / Verse Genetics principles from Floor 3.
 */
import { useRef, useState, useCallback, useMemo, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Interactive } from '@react-three/xr';
import * as THREE from 'three';
import { StarField } from '../components/StarField';
import { NebulaClouds } from '../components/NebulaClouds';
import { BackToLobbyButton } from '../components/BackToLobbyButton';

interface VersePair {
  verseA: { ref: string; text: string };
  verseB: { ref: string; text: string };
  connectionType: string;
  explanation: string;
  options: string[];
  correctIndex: number;
}

const VERSE_PAIRS: VersePair[] = [
  {
    verseA: { ref: 'Genesis 22:8', text: 'God will provide himself a lamb for a burnt offering' },
    verseB: { ref: 'John 1:29', text: 'Behold the Lamb of God, which taketh away the sin of the world' },
    connectionType: 'Type → Antitype',
    explanation: "Abraham's prophetic declaration finds fulfillment in Christ — the Lamb God provided.",
    options: ['Type → Antitype', 'Parallel Actions', 'Same Theme', 'Cause → Effect'],
    correctIndex: 0,
  },
  {
    verseA: { ref: 'Genesis 11:9', text: 'The LORD did there confound the language of all the earth' },
    verseB: { ref: 'Acts 2:4', text: 'They were all filled with the Holy Ghost, and began to speak with other tongues' },
    connectionType: 'Parallel Actions',
    explanation: 'Babel divided languages as judgment; Pentecost united them by the Spirit — a divine reversal.',
    options: ['Type → Antitype', 'Parallel Actions', 'Contrast', 'Prophetic Fulfillment'],
    correctIndex: 1,
  },
  {
    verseA: { ref: 'Exodus 12:13', text: 'When I see the blood, I will pass over you' },
    verseB: { ref: '1 Corinthians 5:7', text: 'Christ our passover is sacrificed for us' },
    connectionType: 'Type → Antitype',
    explanation: "The Passover lamb's blood prefigures Christ's sacrifice that delivers believers from judgment.",
    options: ['Same Theme', 'Type → Antitype', 'Parallel Actions', 'Prophetic Fulfillment'],
    correctIndex: 1,
  },
  {
    verseA: { ref: 'Psalm 22:1', text: 'My God, my God, why hast thou forsaken me?' },
    verseB: { ref: 'Matthew 27:46', text: 'Jesus cried with a loud voice, My God, my God, why hast thou forsaken me?' },
    connectionType: 'Prophetic Fulfillment',
    explanation: "David's psalm is the cry of Christ on the cross — 1,000 years later, the Son speaks David's words.",
    options: ['Same Theme', 'Parallel Actions', 'Prophetic Fulfillment', 'Contrast'],
    correctIndex: 2,
  },
  {
    verseA: { ref: 'Genesis 3:24', text: 'He placed cherubims and a flaming sword to keep the way of the tree of life' },
    verseB: { ref: 'Revelation 22:2', text: 'In the midst of the street of it, was the tree of life' },
    connectionType: 'Contrast',
    explanation: 'Eden barred access to the tree of life; New Jerusalem restores it — the curse is reversed.',
    options: ['Type → Antitype', 'Contrast', 'Same Theme', 'Parallel Actions'],
    correctIndex: 1,
  },
  {
    verseA: { ref: 'Jonah 1:17', text: 'Jonah was in the belly of the fish three days and three nights' },
    verseB: { ref: 'Matthew 12:40', text: 'So shall the Son of man be three days and three nights in the heart of the earth' },
    connectionType: 'Type → Antitype',
    explanation: "Jesus Himself identified Jonah's experience as a type of His own death and resurrection.",
    options: ['Contrast', 'Same Theme', 'Type → Antitype', 'Prophetic Fulfillment'],
    correctIndex: 2,
  },
  {
    verseA: { ref: 'Isaiah 53:5', text: 'He was wounded for our transgressions, bruised for our iniquities' },
    verseB: { ref: '1 Peter 2:24', text: 'Who his own self bare our sins in his own body on the tree' },
    connectionType: 'Prophetic Fulfillment',
    explanation: "Isaiah's suffering servant prophecy finds explicit NT fulfillment in Peter's testimony about Christ.",
    options: ['Same Theme', 'Contrast', 'Parallel Actions', 'Prophetic Fulfillment'],
    correctIndex: 3,
  },
  {
    verseA: { ref: 'Numbers 21:9', text: 'Moses made a serpent of brass, and put it upon a pole' },
    verseB: { ref: 'John 3:14', text: 'As Moses lifted up the serpent, even so must the Son of man be lifted up' },
    connectionType: 'Type → Antitype',
    explanation: 'Looking at the bronze serpent brought healing; looking to Christ on the cross brings salvation.',
    options: ['Type → Antitype', 'Same Theme', 'Contrast', 'Parallel Actions'],
    correctIndex: 0,
  },
];

type GameState = 'menu' | 'playing' | 'result';

function VerseCard({ position, reference, text, color }: {
  position: [number, number, number]; reference: string; text: string; color: string;
}) {
  const meshRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 1.5 + position[0]) * 0.05;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Card background */}
      <mesh>
        <planeGeometry args={[2, 1.2]} />
        <meshStandardMaterial color="#0a0a2e" emissive={color} emissiveIntensity={0.1} />
      </mesh>
      {/* Glow border */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[2.06, 1.26]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <Suspense fallback={null}>
        <Text position={[0, 0.35, 0.01]} fontSize={0.1} color={color} anchorX="center" anchorY="middle" maxWidth={1.8}>
          {reference}
        </Text>
        <Text position={[0, -0.1, 0.01]} fontSize={0.065} color="#ccddee" anchorX="center" anchorY="middle" maxWidth={1.7} lineHeight={1.3}>
          "{text}"
        </Text>
      </Suspense>
    </group>
  );
}

function DNAHelix() {
  const helixRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (helixRef.current) helixRef.current.rotation.y = clock.getElapsedTime() * 0.2;
  });

  const points = useMemo(() => {
    const pts: { x: number; y: number; z: number; color: string }[] = [];
    for (let i = 0; i < 40; i++) {
      const t = (i / 40) * Math.PI * 4;
      const y = (i / 40) * 6 - 3;
      pts.push({ x: Math.cos(t) * 0.3, y, z: Math.sin(t) * 0.3, color: '#44AAFF' });
      pts.push({ x: Math.cos(t + Math.PI) * 0.3, y, z: Math.sin(t + Math.PI) * 0.3, color: '#FF44AA' });
    }
    return pts;
  }, []);

  return (
    <group ref={helixRef} position={[0, 0, -3]}>
      {points.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[0.03, 4, 4]} />
          <meshBasicMaterial color={p.color} transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

interface VerseGeneticsLabProps {
  onBack: () => void;
}

export default function VerseGeneticsLab({ onBack }: VerseGeneticsLabProps) {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState<{ correct: boolean; explanation: string } | null>(null);
  const [pairs, setPairs] = useState<VersePair[]>([]);

  const currentPair = pairs[currentIndex] || null;

  const startGame = useCallback(() => {
    const shuffled = [...VERSE_PAIRS].sort(() => Math.random() - 0.5).slice(0, 6);
    setPairs(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setShowFeedback(null);
    setGameState('playing');
  }, []);

  const handleAnswer = useCallback((idx: number) => {
    if (!currentPair || showFeedback) return;
    const correct = idx === currentPair.correctIndex;
    if (correct) setScore((s) => s + 1);
    setShowFeedback({ correct, explanation: currentPair.explanation });

    setTimeout(() => {
      setShowFeedback(null);
      if (currentIndex + 1 >= pairs.length) {
        setGameState('result');
      } else {
        setCurrentIndex((i) => i + 1);
      }
    }, 3500);
  }, [currentPair, currentIndex, pairs.length, showFeedback]);

  return (
    <group>
      <StarField count={1500} radius={50} brightness={0.6} />
      <NebulaClouds count={6} radius={30} colors={['#4338CA', '#6B21A8', '#2563EB']} opacity={0.08} />
      <DNAHelix />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#060818" metalness={0.5} roughness={0.4} />
      </mesh>
      <ambientLight intensity={0.2} color="#aabbee" />
      <pointLight position={[0, 4, -3]} color="#6B21A8" intensity={1} distance={12} />
      <fog attach="fog" args={['#060818', 10, 30]} />

      {/* ── MENU ── */}
      {gameState === 'menu' && (
        <Suspense fallback={null}>
          <Text position={[0, 2.5, -4]} fontSize={0.3} color="#44AAFF" anchorX="center" outlineWidth={0.01} outlineColor="#001122">
            Verse Genetics Lab
          </Text>
          <Text position={[0, 2, -4]} fontSize={0.09} color="#8899bb" anchorX="center" maxWidth={4}>
            Two verses appear — identify the genetic connection between them
          </Text>
          <Text position={[0, 1.7, -4]} fontSize={0.07} color="#6688AA" anchorX="center">
            Bible Freestyle Room (BF) — Floor 3
          </Text>

          <Interactive onSelect={startGame}>
            <mesh position={[0, 1, -4]} onClick={startGame} onPointerDown={startGame}>
              <planeGeometry args={[2, 0.5]} />
              <meshStandardMaterial color="#0a0a2e" emissive="#44AAFF" emissiveIntensity={0.2} />
            </mesh>
          </Interactive>
          <Text position={[0, 1, -3.98]} fontSize={0.13} color="#44AAFF" anchorX="center" anchorY="middle">
            Enter the Lab
          </Text>
        </Suspense>
      )}

      {/* ── PLAYING ── */}
      {gameState === 'playing' && currentPair && (
        <Suspense fallback={null}>
          <Text position={[0, 2.8, -4]} fontSize={0.1} color="#44AAFF" anchorX="center">
            Pair {currentIndex + 1}/{pairs.length} — Score: {score}
          </Text>

          {/* Two verse cards side by side */}
          <VerseCard position={[-1.3, 1.6, -4.5]} reference={currentPair.verseA.ref} text={currentPair.verseA.text} color="#44AAFF" />
          <VerseCard position={[1.3, 1.6, -4.5]} reference={currentPair.verseB.ref} text={currentPair.verseB.text} color="#FF44AA" />

          {/* Connection line between cards */}
          <mesh position={[0, 1.6, -4.49]}>
            <planeGeometry args={[0.6, 0.02]} />
            <meshBasicMaterial color="#FFDD44" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>

          <Text position={[0, 0.6, -4]} fontSize={0.1} color="#FFDD88" anchorX="center">
            What is the genetic connection?
          </Text>

          {/* Answer options */}
          {currentPair.options.map((opt, i) => {
            const x = (i - 1.5) * 1.3;
            const isCorrect = showFeedback && i === currentPair.correctIndex;
            return (
              <group key={i} position={[x, 0.1, -4]}>
                <Interactive onSelect={() => handleAnswer(i)}>
                  <mesh onClick={() => handleAnswer(i)} onPointerDown={() => handleAnswer(i)}>
                    <planeGeometry args={[1.1, 0.35]} />
                    <meshStandardMaterial
                      color={isCorrect ? '#114411' : '#0a0a2e'}
                      emissive={isCorrect ? '#22FF44' : '#4466FF'}
                      emissiveIntensity={isCorrect ? 0.4 : 0.15}
                    />
                  </mesh>
                </Interactive>
                <Text position={[0, 0, 0.01]} fontSize={0.07} color={isCorrect ? '#22FF44' : '#ddeeff'} anchorX="center" anchorY="middle">
                  {opt}
                </Text>
              </group>
            );
          })}

          {/* Feedback */}
          {showFeedback && (
            <group position={[0, -0.5, -4]}>
              <Text position={[0, 0.15, 0]} fontSize={0.12} color={showFeedback.correct ? '#22FF44' : '#FF4444'} anchorX="center">
                {showFeedback.correct ? '✓ Correct!' : '✗ Not quite'}
              </Text>
              <Text position={[0, -0.1, 0]} fontSize={0.06} color="#aabbcc" anchorX="center" maxWidth={4}>
                {showFeedback.explanation}
              </Text>
            </group>
          )}
        </Suspense>
      )}

      {/* ── RESULTS ── */}
      {gameState === 'result' && (
        <Suspense fallback={null}>
          <Text position={[0, 2.5, -4]} fontSize={0.3} color="#44AAFF" anchorX="center" outlineWidth={0.01} outlineColor="#001122">
            Lab Results
          </Text>
          <Text position={[0, 2, -4]} fontSize={0.2} color={score >= pairs.length * 0.7 ? '#22FF44' : '#FFAA22'} anchorX="center">
            {score} / {pairs.length}
          </Text>
          <Text position={[0, 1.6, -4]} fontSize={0.09} color="#aabbcc" anchorX="center" maxWidth={4}>
            {score === pairs.length ? 'Perfect! Master Verse Geneticist!' :
             score >= pairs.length * 0.7 ? 'Strong connections! Your freestyle skills are sharp.' :
             'Keep connecting verses — every text has family across Scripture!'}
          </Text>

          <Interactive onSelect={startGame}>
            <mesh position={[0, 0.8, -4]} onClick={startGame} onPointerDown={startGame}>
              <planeGeometry args={[2, 0.5]} />
              <meshStandardMaterial color="#0a0a2e" emissive="#44AAFF" emissiveIntensity={0.2} />
            </mesh>
          </Interactive>
          <Text position={[0, 0.8, -3.98]} fontSize={0.12} color="#44AAFF" anchorX="center" anchorY="middle">
            Run Again
          </Text>
        </Suspense>
      )}

      <BackToLobbyButton onBack={onBack} position={[0, -0.5, -1.5]} />
    </group>
  );
}
