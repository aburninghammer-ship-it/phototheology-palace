/**
 * Daniel's Dream Decoder — VR Prophecy Game
 * Beasts fly toward you; identify the correct kingdom and era.
 * Uses Prophecy Room (PR) principles from Floor 5.
 */
import { useRef, useState, useCallback, useMemo, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Interactive } from '@react-three/xr';
import * as THREE from 'three';
import { StarField } from '../components/StarField';
import { BackToLobbyButton } from '../components/BackToLobbyButton';

interface Beast {
  id: string;
  name: string;
  chapter: string;
  symbol: string;
  description: string;
  kingdom: string;
  era: string;
  color: string;
  options: string[];
  correctIndex: number;
}

const BEASTS: Beast[] = [
  {
    id: 'lion', name: 'Winged Lion', chapter: 'Daniel 7:4',
    symbol: '🦁', description: "Like a lion with eagle's wings",
    kingdom: 'Babylon', era: '605–539 BC', color: '#FFD700',
    options: ['Babylon', 'Medo-Persia', 'Greece', 'Rome'], correctIndex: 0,
  },
  {
    id: 'bear', name: 'Lopsided Bear', chapter: 'Daniel 7:5',
    symbol: '🐻', description: 'Raised up on one side, three ribs in mouth',
    kingdom: 'Medo-Persia', era: '539–331 BC', color: '#C0C0C0',
    options: ['Babylon', 'Medo-Persia', 'Greece', 'Rome'], correctIndex: 1,
  },
  {
    id: 'leopard', name: 'Four-Winged Leopard', chapter: 'Daniel 7:6',
    symbol: '🐆', description: 'Four wings, four heads',
    kingdom: 'Greece', era: '331–168 BC', color: '#44AAFF',
    options: ['Medo-Persia', 'Greece', 'Rome', 'Divided Europe'], correctIndex: 1,
  },
  {
    id: 'dreadful', name: 'Dreadful Beast', chapter: 'Daniel 7:7',
    symbol: '🐲', description: 'Iron teeth, ten horns, exceedingly strong',
    kingdom: 'Rome', era: '168 BC–476 AD', color: '#FF4444',
    options: ['Greece', 'Rome', 'Divided Europe', 'Papal Rome'], correctIndex: 1,
  },
  {
    id: 'head-gold', name: 'Head of Gold', chapter: 'Daniel 2:32',
    symbol: '👑', description: 'The head of the great image was fine gold',
    kingdom: 'Babylon', era: '605–539 BC', color: '#FFD700',
    options: ['Babylon', 'Medo-Persia', 'Greece', 'Rome'], correctIndex: 0,
  },
  {
    id: 'chest-silver', name: 'Chest of Silver', chapter: 'Daniel 2:32',
    symbol: '🪙', description: 'Breast and arms of silver',
    kingdom: 'Medo-Persia', era: '539–331 BC', color: '#C0C0C0',
    options: ['Babylon', 'Medo-Persia', 'Greece', 'Rome'], correctIndex: 1,
  },
  {
    id: 'belly-bronze', name: 'Belly of Bronze', chapter: 'Daniel 2:32',
    symbol: '🔔', description: 'Belly and thighs of brass',
    kingdom: 'Greece', era: '331–168 BC', color: '#CD7F32',
    options: ['Babylon', 'Medo-Persia', 'Greece', 'Rome'], correctIndex: 2,
  },
  {
    id: 'legs-iron', name: 'Legs of Iron', chapter: 'Daniel 2:33',
    symbol: '⚔️', description: 'Legs of iron',
    kingdom: 'Rome', era: '168 BC–476 AD', color: '#888888',
    options: ['Medo-Persia', 'Greece', 'Rome', "God's Kingdom"], correctIndex: 2,
  },
  {
    id: 'stone', name: 'Stone Cut Without Hands', chapter: 'Daniel 2:34-35',
    symbol: '🪨', description: 'Smote the image and became a great mountain',
    kingdom: "God's Eternal Kingdom", era: 'Second Coming onward', color: '#88EEFF',
    options: ['Rome', 'Divided Europe', 'Papal Rome', "God's Kingdom"], correctIndex: 3,
  },
  {
    id: 'ram', name: 'Two-Horned Ram', chapter: 'Daniel 8:3-4',
    symbol: '🐏', description: 'Two horns, one higher than the other',
    kingdom: 'Medo-Persia', era: '539–331 BC', color: '#C0C0C0',
    options: ['Babylon', 'Medo-Persia', 'Greece', 'Rome'], correctIndex: 1,
  },
  {
    id: 'goat', name: 'He-Goat', chapter: 'Daniel 8:5-8',
    symbol: '🐐', description: 'Notable horn between the eyes, came from the west',
    kingdom: 'Greece (Alexander)', era: '331–168 BC', color: '#44AAFF',
    options: ['Medo-Persia', 'Greece', 'Rome', 'Divided Europe'], correctIndex: 1,
  },
];

type GameState = 'menu' | 'playing' | 'result';

interface ActiveBeast {
  beast: Beast;
  position: THREE.Vector3;
  targetZ: number;
  answered: boolean;
  correct: boolean | null;
}

function FloatingSymbol({ beast, position }: { beast: Beast; position: THREE.Vector3 }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.copy(position);
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.5;
      meshRef.current.position.y += Math.sin(clock.getElapsedTime() * 2) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Glowing orb behind symbol */}
      <mesh>
        <sphereGeometry args={[0.6, 16, 12]} />
        <meshStandardMaterial
          color={beast.color}
          emissive={beast.color}
          emissiveIntensity={0.4}
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Inner sphere */}
      <mesh>
        <sphereGeometry args={[0.3, 12, 8]} />
        <meshStandardMaterial color={beast.color} emissive={beast.color} emissiveIntensity={0.3} metalness={0.5} roughness={0.4} />
      </mesh>
      <Suspense fallback={null}>
        <Text position={[0, 0, 0.35]} fontSize={0.4} anchorX="center" anchorY="middle">
          {beast.symbol}
        </Text>
      </Suspense>
      <pointLight color={beast.color} intensity={1} distance={5} />
    </group>
  );
}

interface DanielsDreamDecoderProps {
  onBack: () => void;
}

export default function DanielsDreamDecoder({ onBack }: DanielsDreamDecoderProps) {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [showFeedback, setShowFeedback] = useState<{ correct: boolean; answer: string } | null>(null);
  const [shuffledBeasts, setShuffledBeasts] = useState<Beast[]>([]);

  const currentBeast = shuffledBeasts[currentIndex] || null;

  const startGame = useCallback(() => {
    const shuffled = [...BEASTS].sort(() => Math.random() - 0.5).slice(0, 8);
    setShuffledBeasts(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setTotalAnswered(0);
    setShowFeedback(null);
    setGameState('playing');
  }, []);

  const handleAnswer = useCallback((optionIndex: number) => {
    if (!currentBeast || showFeedback) return;
    const correct = optionIndex === currentBeast.correctIndex;
    if (correct) setScore((s) => s + 1);
    setTotalAnswered((t) => t + 1);
    setShowFeedback({ correct, answer: currentBeast.kingdom });

    setTimeout(() => {
      setShowFeedback(null);
      if (currentIndex + 1 >= shuffledBeasts.length) {
        setGameState('result');
      } else {
        setCurrentIndex((i) => i + 1);
      }
    }, 2000);
  }, [currentBeast, currentIndex, shuffledBeasts.length, showFeedback]);

  return (
    <group>
      {/* Environment */}
      <StarField count={2000} radius={50} brightness={0.7} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#080818" metalness={0.5} roughness={0.4} />
      </mesh>
      <ambientLight intensity={0.2} color="#aabbee" />
      <pointLight position={[0, 5, -3]} color="#4466FF" intensity={1} distance={15} />
      <fog attach="fog" args={['#060818', 10, 30]} />

      {/* ── MENU ── */}
      {gameState === 'menu' && (
        <Suspense fallback={null}>
          <Text position={[0, 2.5, -4]} fontSize={0.35} color="#FFD700" anchorX="center" outlineWidth={0.012} outlineColor="#000">
            Daniel's Dream Decoder
          </Text>
          <Text position={[0, 2, -4]} fontSize={0.1} color="#aabbcc" anchorX="center" maxWidth={4}>
            Identify the kingdoms from Daniel's prophecies — beasts, metals, and visions
          </Text>
          <Text position={[0, 1.6, -4]} fontSize={0.08} color="#6688AA" anchorX="center">
            Prophecy Room (PR) — Floor 5
          </Text>

          <Interactive onSelect={startGame}>
            <mesh position={[0, 1, -4]} onClick={startGame} onPointerDown={startGame}>
              <planeGeometry args={[2, 0.5]} />
              <meshStandardMaterial color="#0a0a2e" emissive="#FFD700" emissiveIntensity={0.25} />
            </mesh>
          </Interactive>
          <Text position={[0, 1, -3.98]} fontSize={0.15} color="#FFD700" anchorX="center" anchorY="middle">
            Start Game
          </Text>
        </Suspense>
      )}

      {/* ── PLAYING ── */}
      {gameState === 'playing' && currentBeast && (
        <Suspense fallback={null}>
          {/* Score */}
          <Text position={[0, 2.8, -4]} fontSize={0.12} color="#FFD700" anchorX="center">
            Score: {score}/{totalAnswered} — Question {currentIndex + 1}/{shuffledBeasts.length}
          </Text>

          {/* Beast display */}
          <FloatingSymbol beast={currentBeast} position={new THREE.Vector3(0, 1.5, -5)} />

          <Text position={[0, 2.3, -4]} fontSize={0.18} color={currentBeast.color} anchorX="center" outlineWidth={0.008} outlineColor="#000">
            {currentBeast.name}
          </Text>
          <Text position={[0, 2, -4]} fontSize={0.08} color="#8899bb" anchorX="center">
            {currentBeast.chapter}
          </Text>
          <Text position={[0, 0.6, -4]} fontSize={0.09} color="#ccddee" anchorX="center" maxWidth={3}>
            "{currentBeast.description}"
          </Text>
          <Text position={[0, 0.3, -4]} fontSize={0.1} color="#88AACC" anchorX="center">
            Which kingdom does this represent?
          </Text>

          {/* Answer buttons */}
          {currentBeast.options.map((option, i) => {
            const x = (i - 1.5) * 1.3;
            const isCorrectAnswer = showFeedback && i === currentBeast.correctIndex;
            const isWrongChoice = showFeedback && !showFeedback.correct && i !== currentBeast.correctIndex;
            const bgColor = isCorrectAnswer ? '#114411' : showFeedback ? '#1a1a2e' : '#0a0a2e';
            const emissiveColor = isCorrectAnswer ? '#22FF44' : '#4466FF';

            return (
              <group key={i} position={[x, -0.2, -4]}>
                <Interactive onSelect={() => handleAnswer(i)}>
                  <mesh onClick={() => handleAnswer(i)} onPointerDown={() => handleAnswer(i)}>
                    <planeGeometry args={[1.1, 0.4]} />
                    <meshStandardMaterial color={bgColor} emissive={emissiveColor} emissiveIntensity={isCorrectAnswer ? 0.4 : 0.15} />
                  </mesh>
                </Interactive>
                <Text position={[0, 0, 0.01]} fontSize={0.09} color={isCorrectAnswer ? '#22FF44' : '#ddeeff'} anchorX="center" anchorY="middle">
                  {option}
                </Text>
              </group>
            );
          })}

          {/* Feedback */}
          {showFeedback && (
            <Text position={[0, -0.7, -4]} fontSize={0.15} color={showFeedback.correct ? '#22FF44' : '#FF4444'} anchorX="center">
              {showFeedback.correct ? '✓ Correct!' : `✗ It was ${showFeedback.answer}`}
            </Text>
          )}
        </Suspense>
      )}

      {/* ── RESULTS ── */}
      {gameState === 'result' && (
        <Suspense fallback={null}>
          <Text position={[0, 2.5, -4]} fontSize={0.3} color="#FFD700" anchorX="center" outlineWidth={0.01} outlineColor="#000">
            Prophecy Decoded!
          </Text>
          <Text position={[0, 2, -4]} fontSize={0.2} color={score >= shuffledBeasts.length * 0.7 ? '#22FF44' : '#FFAA22'} anchorX="center">
            {score} / {shuffledBeasts.length}
          </Text>
          <Text position={[0, 1.6, -4]} fontSize={0.1} color="#aabbcc" anchorX="center">
            {score === shuffledBeasts.length ? 'Perfect! You are a Master Prophet Decoder!' :
             score >= shuffledBeasts.length * 0.7 ? 'Well done! The prophecies are becoming clear!' :
             'Keep studying Daniel 2, 7, and 8 — the prophecies will open up!'}
          </Text>

          <Interactive onSelect={startGame}>
            <mesh position={[0, 0.8, -4]} onClick={startGame} onPointerDown={startGame}>
              <planeGeometry args={[2, 0.5]} />
              <meshStandardMaterial color="#0a0a2e" emissive="#FFD700" emissiveIntensity={0.2} />
            </mesh>
          </Interactive>
          <Text position={[0, 0.8, -3.98]} fontSize={0.12} color="#FFD700" anchorX="center" anchorY="middle">
            Play Again
          </Text>
        </Suspense>
      )}

      <BackToLobbyButton onBack={onBack} position={[0, -0.5, -1.5]} />
    </group>
  );
}
