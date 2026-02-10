import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, Stars, Text } from "@react-three/drei";
import * as THREE from "three";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Trophy, Timer, Flame, Star, Zap, RotateCcw, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { GameLeaderboard } from "@/components/GameLeaderboard";

// ============ DATA ============

type Difficulty = "easy" | "medium" | "hard" | "expert";

interface DifficultySettings {
  name: string;
  timeLimit: number;
  blockSpeed: number;
  spawnInterval: number;
  pointsMultiplier: number;
}

const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultySettings> = {
  easy: { name: "Easy", timeLimit: 120, blockSpeed: 0.02, spawnInterval: 3000, pointsMultiplier: 1 },
  medium: { name: "Medium", timeLimit: 90, blockSpeed: 0.03, spawnInterval: 2500, pointsMultiplier: 1.5 },
  hard: { name: "Hard", timeLimit: 60, blockSpeed: 0.04, spawnInterval: 2000, pointsMultiplier: 2 },
  expert: { name: "Expert", timeLimit: 45, blockSpeed: 0.05, spawnInterval: 1500, pointsMultiplier: 3 },
};

interface VerseChallenge {
  reference: string;
  fullText: string;
  words: string[];
  missingIndices: number[];
}

// Verse challenges with words to recall
const verseChallenges: VerseChallenge[] = [
  {
    reference: "John 3:16",
    fullText: "For God so loved the world that he gave his only begotten Son",
    words: ["For", "God", "so", "loved", "the", "world", "that", "he", "gave", "his", "only", "begotten", "Son"],
    missingIndices: [1, 3, 8, 12],
  },
  {
    reference: "Psalm 23:1",
    fullText: "The Lord is my shepherd I shall not want",
    words: ["The", "Lord", "is", "my", "shepherd", "I", "shall", "not", "want"],
    missingIndices: [1, 4, 6],
  },
  {
    reference: "Romans 8:28",
    fullText: "All things work together for good to them that love God",
    words: ["All", "things", "work", "together", "for", "good", "to", "them", "that", "love", "God"],
    missingIndices: [0, 2, 5, 10],
  },
  {
    reference: "Philippians 4:13",
    fullText: "I can do all things through Christ which strengtheneth me",
    words: ["I", "can", "do", "all", "things", "through", "Christ", "which", "strengtheneth", "me"],
    missingIndices: [2, 4, 6, 8],
  },
  {
    reference: "Proverbs 3:5",
    fullText: "Trust in the Lord with all thine heart and lean not unto thine own understanding",
    words: ["Trust", "in", "the", "Lord", "with", "all", "thine", "heart", "and", "lean", "not", "unto", "thine", "own", "understanding"],
    missingIndices: [0, 3, 7, 14],
  },
  {
    reference: "Isaiah 40:31",
    fullText: "They that wait upon the Lord shall renew their strength",
    words: ["They", "that", "wait", "upon", "the", "Lord", "shall", "renew", "their", "strength"],
    missingIndices: [2, 5, 7, 9],
  },
  {
    reference: "Matthew 6:33",
    fullText: "Seek ye first the kingdom of God and his righteousness",
    words: ["Seek", "ye", "first", "the", "kingdom", "of", "God", "and", "his", "righteousness"],
    missingIndices: [0, 4, 6, 9],
  },
  {
    reference: "Jeremiah 29:11",
    fullText: "For I know the thoughts that I think toward you saith the Lord",
    words: ["For", "I", "know", "the", "thoughts", "that", "I", "think", "toward", "you", "saith", "the", "Lord"],
    missingIndices: [2, 4, 7, 12],
  },
  {
    reference: "Genesis 1:1",
    fullText: "In the beginning God created the heaven and the earth",
    words: ["In", "the", "beginning", "God", "created", "the", "heaven", "and", "the", "earth"],
    missingIndices: [2, 3, 4, 6, 9],
  },
  {
    reference: "Psalm 119:105",
    fullText: "Thy word is a lamp unto my feet and a light unto my path",
    words: ["Thy", "word", "is", "a", "lamp", "unto", "my", "feet", "and", "a", "light", "unto", "my", "path"],
    missingIndices: [1, 4, 7, 10, 13],
  },
];

// ============ 3D COMPONENTS ============

function CameraController({ target }: { target: [number, number, number] }) {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3(...target));

  useEffect(() => {
    targetRef.current.set(...target);
  }, [target]);

  useFrame(() => {
    camera.position.lerp(targetRef.current, 0.03);
    camera.lookAt(0, 0, -10);
  });

  return null;
}

// Heavenly track environment
function TrackEnvironment() {
  return (
    <group>
      {/* Platform/Gate area */}
      <mesh position={[0, -1, 0]} receiveShadow>
        <cylinderGeometry args={[8, 10, 0.5, 32]} />
        <meshStandardMaterial color="#c9a227" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Golden track extending into distance */}
      <mesh position={[0, -0.7, -25]} receiveShadow>
        <boxGeometry args={[6, 0.5, 50]} />
        <meshStandardMaterial color="#daa520" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Track edges/rails */}
      {[-3.3, 3.3].map((x, i) => (
        <mesh key={i} position={[x, -0.35, -25]}>
          <boxGeometry args={[0.5, 0.6, 50]} />
          <meshStandardMaterial color="#b8860b" roughness={0.5} metalness={0.5} />
        </mesh>
      ))}

      {/* Gate/Arch */}
      <group position={[0, 3, 2]}>
        {/* Left pillar */}
        <mesh position={[-4, 0, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.8, 8]} />
          <meshStandardMaterial color="#daa520" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Left pillar capital */}
        <mesh position={[-4, 4.2, 0]} castShadow>
          <boxGeometry args={[1.8, 0.5, 1.8]} />
          <meshStandardMaterial color="#ffd700" roughness={0.2} metalness={0.9} />
        </mesh>
        {/* Right pillar */}
        <mesh position={[4, 0, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.8, 8]} />
          <meshStandardMaterial color="#daa520" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Right pillar capital */}
        <mesh position={[4, 4.2, 0]} castShadow>
          <boxGeometry args={[1.8, 0.5, 1.8]} />
          <meshStandardMaterial color="#ffd700" roughness={0.2} metalness={0.9} />
        </mesh>
        {/* Arch top */}
        <mesh position={[0, 4.5, 0]} castShadow>
          <boxGeometry args={[10, 1.5, 1.5]} />
          <meshStandardMaterial color="#ffd700" roughness={0.2} metalness={0.9} />
        </mesh>
        {/* Gate glow */}
        <pointLight position={[0, 2, 1]} intensity={1} color="#ffd700" distance={15} />
      </group>

      {/* Cloud platforms on sides */}
      {[[-12, 2, -10], [12, 2, -10], [-10, 4, -25], [10, 4, -25]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[3, 16, 16]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.6} roughness={1} />
        </mesh>
      ))}

      {/* Ambient track lights */}
      {[-20, -35, -50].map((z, i) => (
        <pointLight key={i} position={[0, 2, z]} intensity={0.3} color="#ffd700" distance={10} />
      ))}
    </group>
  );
}

// Word Block racing down track
interface WordBlockProps {
  word: string;
  position: [number, number, number];
  isCorrect: boolean;
  isTarget: boolean;
  onClick: () => void;
  speed: number;
}

function WordBlock({ word, position, isCorrect, isTarget, onClick, speed }: WordBlockProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [zPos, setZPos] = useState(position[2]);

  useFrame(() => {
    if (meshRef.current) {
      // Move toward player
      setZPos(prev => prev + speed);
      meshRef.current.position.z = zPos;

      // Floating animation
      meshRef.current.position.y = position[1] + Math.sin(Date.now() * 0.003 + position[0]) * 0.1;

      // Pulse scale on hover
      const scale = hovered ? 1.15 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });

  const color = isTarget
    ? hovered ? "#4ade80" : "#22c55e"
    : hovered ? "#f97316" : "#ea580c";

  return (
    <group position={[position[0], position[1], zPos]}>
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
      >
        <boxGeometry args={[2.4, 1.4, 0.6]} />
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.5}
          emissive={color}
          emissiveIntensity={hovered ? 0.3 : 0.1}
        />
      </mesh>

      {/* Word text */}
      <Html position={[0, 0, 0.25]} center distanceFactor={10}>
        <div
          style={{
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            border: isTarget ? '2px solid #22c55e' : '2px solid #ea580c',
          }}
        >
          {word}
        </div>
      </Html>

      {/* Glow for target words */}
      {isTarget && (
        <pointLight position={[0, 0, 0.5]} intensity={0.5} color="#22c55e" distance={3} />
      )}
    </group>
  );
}

// Score display pillar
function ScorePillar({ score, streak }: { score: number; streak: number }) {
  const { t } = useTranslation();
  const height = Math.min(10, 2 + score / 50);

  return (
    <group position={[7, 0, 0]}>
      {/* Base */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[1, 1.2, 1]} />
        <meshStandardMaterial color="#8b4513" roughness={0.6} />
      </mesh>

      {/* Score column */}
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.6, 0.6, height]} />
        <meshStandardMaterial
          color="#ffd700"
          roughness={0.2}
          metalness={0.8}
          emissive="#ffa500"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Score display */}
      <Html position={[0, height + 1, 0]} center distanceFactor={8}>
        <div
          style={{
            background: 'linear-gradient(135deg, #ffd700, #ff8c00)',
            color: 'black',
            padding: '12px 24px',
            borderRadius: '12px',
            textAlign: 'center',
            fontWeight: 'bold',
            boxShadow: '0 4px 20px rgba(255,215,0,0.5)',
          }}
        >
          <div style={{ fontSize: '24px' }}>{score}</div>
          <div style={{ fontSize: '12px' }}>{t('games.common.points').toUpperCase()}</div>
          {streak > 1 && (
            <div style={{ fontSize: '14px', color: '#dc2626', marginTop: '4px' }}>
              x{streak} {t('games.common.streak').toUpperCase()}
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}

// Timer hourglass
function TimerHourglass({ timeRemaining, totalTime }: { timeRemaining: number; totalTime: number }) {
  const ratio = timeRemaining / totalTime;
  const rotationSpeed = Math.max(0.01, 0.05 * (1 - ratio)); // Faster as time runs out

  const glassRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (glassRef.current) {
      glassRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <group position={[-7, 2, 0]} ref={glassRef}>
      {/* Top bulb */}
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[1.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.6} />
      </mesh>

      {/* Bottom bulb */}
      <mesh position={[0, -1.8, 0]} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[1.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.6} />
      </mesh>

      {/* Sand remaining (top) */}
      <mesh position={[0, 1.4 + ratio * 0.4, 0]}>
        <coneGeometry args={[0.7 * ratio, ratio * 1.2, 16]} />
        <meshStandardMaterial color="#daa520" />
      </mesh>

      {/* Sand accumulated (bottom) */}
      <mesh position={[0, -2.2 + (1 - ratio) * 0.4, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.7 * (1 - ratio), (1 - ratio) * 1.2, 16]} />
        <meshStandardMaterial color="#daa520" />
      </mesh>

      {/* Frame - left */}
      <mesh position={[-0.9, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 4.5]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      {/* Frame - right */}
      <mesh position={[0.9, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 4.5]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      {/* Frame - top cap */}
      <mesh position={[0, 2.25, 0]}>
        <boxGeometry args={[2.2, 0.3, 0.5]} />
        <meshStandardMaterial color="#5c3317" />
      </mesh>
      {/* Frame - bottom cap */}
      <mesh position={[0, -2.25, 0]}>
        <boxGeometry args={[2.2, 0.3, 0.5]} />
        <meshStandardMaterial color="#5c3317" />
      </mesh>

      {/* Time display */}
      <Html position={[0, 3, 0]} center distanceFactor={8}>
        <div
          style={{
            background: timeRemaining <= 10 ? '#dc2626' : '#1e3a5f',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '18px',
            animation: timeRemaining <= 10 ? 'pulse 0.5s infinite' : 'none',
          }}
        >
          {timeRemaining}s
        </div>
      </Html>
    </group>
  );
}

// Verse display
function VerseDisplay({ verse, filledWords }: { verse: VerseChallenge; filledWords: Map<number, string> }) {
  return (
    <Html position={[0, 6, -5]} center distanceFactor={6}>
      <div
        style={{
          background: 'rgba(0,0,0,0.85)',
          color: 'white',
          padding: '20px 32px',
          borderRadius: '16px',
          maxWidth: '600px',
          textAlign: 'center',
          border: '2px solid #c9a227',
        }}
      >
        <div style={{ fontSize: '14px', color: '#c9a227', marginBottom: '12px' }}>
          {verse.reference}
        </div>
        <div style={{ fontSize: '18px', lineHeight: 1.6 }}>
          {verse.words.map((word, i) => {
            const isMissing = verse.missingIndices.includes(i);
            const filledWord = filledWords.get(i);

            if (isMissing) {
              return (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    minWidth: '60px',
                    padding: '2px 8px',
                    margin: '2px',
                    background: filledWord ? '#22c55e' : '#374151',
                    borderRadius: '4px',
                    border: filledWord ? '2px solid #16a34a' : '2px dashed #6b7280',
                  }}
                >
                  {filledWord || '___'}
                </span>
              );
            }
            return <span key={i}>{word} </span>;
          })}
        </div>
      </div>
    </Html>
  );
}

// ============ MAIN COMPONENT ============

interface FallingWord {
  id: string;
  word: string;
  isCorrect: boolean;
  targetIndex: number;
  lane: number;
  zPosition: number;
}

export default function SpeedVerse3D() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();

  // Game state
  const [gameState, setGameState] = useState<"menu" | "playing" | "complete">("menu");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [verses, setVerses] = useState<VerseChallenge[]>([]);

  // Word state
  const [fallingWords, setFallingWords] = useState<FallingWord[]>([]);
  const [filledWords, setFilledWords] = useState<Map<number, string>>(new Map());
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0);

  // Scoring
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);

  // Timer
  const [timeRemaining, setTimeRemaining] = useState(90);
  const [totalTime, setTotalTime] = useState(90);

  // UI
  const [feedback, setFeedback] = useState<{ type: "correct" | "wrong"; message: string } | null>(null);

  // Camera
  const cameraTarget: [number, number, number] = gameState === "menu" ? [0, 8, 15] : [0, 4, 8];

  const settings = DIFFICULTY_SETTINGS[difficulty];
  const currentVerse = verses[currentVerseIndex];

  // Shuffle helper
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Start game
  const startGame = useCallback(() => {
    const shuffled = shuffleArray([...verseChallenges]);
    setVerses(shuffled);
    setCurrentVerseIndex(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setFilledWords(new Map());
    setFallingWords([]);
    setCurrentTargetIndex(0);
    setTimeRemaining(settings.timeLimit);
    setTotalTime(settings.timeLimit);
    setGameState("playing");
  }, [settings.timeLimit]);

  // Spawn words
  useEffect(() => {
    if (gameState !== "playing" || !currentVerse) return;

    const spawnWord = () => {
      const missingIndices = currentVerse.missingIndices.filter(i => !filledWords.has(i));
      if (missingIndices.length === 0) return;

      // Current target is the first unfilled missing index
      const targetIndex = missingIndices[0];
      const correctWord = currentVerse.words[targetIndex];

      // Get some wrong words
      const wrongWords = shuffleArray(
        verseChallenges
          .flatMap(v => v.words)
          .filter(w => w !== correctWord && w.length > 2)
      ).slice(0, 2);

      // Create mix of correct and wrong words
      const wordsToSpawn = shuffleArray([
        { word: correctWord, isCorrect: true },
        ...wrongWords.map(w => ({ word: w, isCorrect: false }))
      ]);

      const lanes = [-2, 0, 2];
      const shuffledLanes = shuffleArray([...lanes]);

      wordsToSpawn.forEach((w, i) => {
        if (i < 3) {
          const newWord: FallingWord = {
            id: crypto.randomUUID(),
            word: w.word,
            isCorrect: w.isCorrect,
            targetIndex,
            lane: shuffledLanes[i],
            zPosition: -50 - i * 5,
          };
          setFallingWords(prev => [...prev, newWord]);
        }
      });
    };

    const interval = setInterval(spawnWord, settings.spawnInterval);
    spawnWord(); // Initial spawn

    return () => clearInterval(interval);
  }, [gameState, currentVerse, filledWords, settings.spawnInterval]);

  // Move words and check for passing gate
  useEffect(() => {
    if (gameState !== "playing") return;

    const moveInterval = setInterval(() => {
      setFallingWords(prev => {
        return prev
          .map(w => ({ ...w, zPosition: w.zPosition + settings.blockSpeed * 50 }))
          .filter(w => {
            // Remove words that passed the gate
            if (w.zPosition > 5) {
              if (w.isCorrect) {
                // Missed correct word
                setStreak(0);
              }
              return false;
            }
            return true;
          });
      });
    }, 50);

    return () => clearInterval(moveInterval);
  }, [gameState, settings.blockSpeed]);

  // Timer
  useEffect(() => {
    if (gameState !== "playing") return;

    if (timeRemaining <= 0) {
      endGame();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeRemaining]);

  // Handle word click
  const handleWordClick = (wordId: string, word: string, isCorrect: boolean, targetIndex: number) => {
    // Remove clicked word
    setFallingWords(prev => prev.filter(w => w.id !== wordId));

    if (isCorrect) {
      // Fill in the word
      setFilledWords(prev => new Map(prev).set(targetIndex, word));

      const points = Math.floor(10 * settings.pointsMultiplier * (1 + streak * 0.1));
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setBestStreak(prev => Math.max(prev, streak + 1));
      setCorrectAnswers(prev => prev + 1);

      setFeedback({ type: "correct", message: t('games.common.plusPoints', { points }) });
      setTimeout(() => setFeedback(null), 1000);

      toast({
        title: t('games.common.correct'),
        description: t('games.common.plusPoints', { points }),
      });

      // Check if verse is complete
      const newFilledWords = new Map(filledWords).set(targetIndex, word);
      const allFilled = currentVerse.missingIndices.every(i => newFilledWords.has(i));

      if (allFilled) {
        // Move to next verse
        setTimeout(() => {
          if (currentVerseIndex + 1 >= verses.length) {
            endGame();
          } else {
            setCurrentVerseIndex(prev => prev + 1);
            setFilledWords(new Map());
            setFallingWords([]);
          }
        }, 1500);
      }
    } else {
      setStreak(0);
      setWrongAnswers(prev => prev + 1);
      setFeedback({ type: "wrong", message: t('games.speedVerse.wrongWord') });
      setTimeout(() => setFeedback(null), 1000);

      toast({
        title: t('games.common.wrong'),
        description: t('games.speedVerse.notRightWord'),
        variant: "destructive",
      });
    }
  };

  // End game
  const endGame = () => {
    setGameState("complete");
    saveScore();
  };

  // Save score
  const saveScore = async () => {
    if (!user || score === 0) return;

    try {
      await supabase.from("game_scores").insert({
        user_id: user.id,
        game_type: "speed_verse_3d",
        score: score,
        mode: difficulty,
        metadata: {
          correct_answers: correctAnswers,
          wrong_answers: wrongAnswers,
          best_streak: bestStreak,
          verses_completed: currentVerseIndex,
          completed_at: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  // Completion screen
  if (gameState === "complete") {
    const accuracy = correctAnswers + wrongAnswers > 0
      ? Math.round((correctAnswers / (correctAnswers + wrongAnswers)) * 100)
      : 0;

    return (
      <div className="min-h-screen bg-background pb-24 md:pb-8">
        <Navigation />
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Trophy className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
                <CardTitle className="text-3xl">{t('games.speedVerse.raceComplete')}</CardTitle>
                <CardDescription>
                  {t('games.speedVerse.raceCompleteDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <div className="text-3xl font-bold text-primary">{score}</div>
                    <div className="text-sm text-muted-foreground">{t('games.common.totalScore')}</div>
                  </div>
                  <div className="p-4 bg-green-500/10 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{accuracy}%</div>
                    <div className="text-sm text-muted-foreground">{t('games.common.accuracy')}</div>
                  </div>
                  <div className="p-4 bg-orange-500/10 rounded-lg">
                    <div className="text-3xl font-bold text-orange-600">{bestStreak}</div>
                    <div className="text-sm text-muted-foreground">{t('games.common.bestStreak')}</div>
                  </div>
                  <div className="p-4 bg-purple-500/10 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">{currentVerseIndex}</div>
                    <div className="text-sm text-muted-foreground">{t('games.speedVerse.verses')}</div>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button onClick={() => navigate("/games")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t('games.common.backToGames')}
                  </Button>
                  <Button onClick={() => setGameState("menu")} variant="outline">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    {t('games.common.playAgain')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <GameLeaderboard gameType="speed_verse_3d" currentScore={score} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* 3D Canvas */}
      <div className="fixed inset-0 top-16 z-0">
        <Canvas shadows camera={{ fov: 60, position: [0, 8, 15] }}>
          <Suspense fallback={null}>
            <CameraController target={cameraTarget} />

            {/* Lighting */}
            <ambientLight intensity={0.3} />
            <directionalLight
              position={[10, 20, 10]}
              intensity={0.8}
              castShadow
            />

            {/* Environment */}
            <color attach="background" args={["#0a1628"]} />
            <Stars radius={200} depth={100} count={3000} factor={6} fade />
            <TrackEnvironment />

            {/* Game content when playing */}
            {gameState === "playing" && currentVerse && (
              <>
                {/* Verse display */}
                <VerseDisplay verse={currentVerse} filledWords={filledWords} />

                {/* Falling words */}
                {fallingWords.map(fw => (
                  <WordBlock
                    key={fw.id}
                    word={fw.word}
                    position={[fw.lane, 1.5, fw.zPosition]}
                    isCorrect={fw.isCorrect}
                    isTarget={fw.isCorrect}
                    onClick={() => handleWordClick(fw.id, fw.word, fw.isCorrect, fw.targetIndex)}
                    speed={settings.blockSpeed}
                  />
                ))}

                {/* Score pillar */}
                <ScorePillar score={score} streak={streak} />

                {/* Timer */}
                <TimerHourglass timeRemaining={timeRemaining} totalTime={totalTime} />
              </>
            )}

            <OrbitControls
              enablePan={false}
              enableZoom={true}
              minDistance={8}
              maxDistance={20}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 2.2}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 container mx-auto px-4 pt-4">
        {/* Menu Screen */}
        {gameState === "menu" && (
          <div className="max-w-2xl mx-auto mt-8">
            <Card className="bg-background/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-3xl flex items-center gap-3">
                  <span className="text-4xl">&#x26A1;</span>
                  {t('games.speedVerse.title')}
                </CardTitle>
                <CardDescription>
                  {t('games.speedVerse.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Difficulty Selection */}
                <div>
                  <h3 className="font-semibold mb-3">{t('games.common.selectDifficulty')}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(Object.keys(DIFFICULTY_SETTINGS) as Difficulty[]).map((d) => {
                      const s = DIFFICULTY_SETTINGS[d];
                      const colors = {
                        easy: "bg-green-500",
                        medium: "bg-yellow-500",
                        hard: "bg-orange-500",
                        expert: "bg-red-500",
                      };
                      return (
                        <Card
                          key={d}
                          className={`cursor-pointer transition-all ${
                            difficulty === d
                              ? "ring-2 ring-primary border-primary"
                              : "hover:border-primary/50"
                          }`}
                          onClick={() => setDifficulty(d)}
                        >
                          <CardContent className="p-4 text-center">
                            <div className={`inline-flex p-2 rounded-full ${colors[d]} text-white mb-2`}>
                              {d === "easy" && <Star className="h-5 w-5" />}
                              {d === "medium" && <Flame className="h-5 w-5" />}
                              {d === "hard" && <Zap className="h-5 w-5" />}
                              {d === "expert" && <Trophy className="h-5 w-5" />}
                            </div>
                            <div className="font-semibold">{t(`games.common.difficulty.${d}`)}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {t('games.common.timeLimit', { seconds: s.timeLimit })}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {t('games.common.pointsMultiplier', { multiplier: s.pointsMultiplier })}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                <Button onClick={startGame} size="lg" className="w-full">
                  {t('games.speedVerse.startRacing')}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate("/games")}
                  className="w-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t('games.common.backToGames')}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Playing UI */}
        {gameState === "playing" && currentVerse && (
          <>
            {/* Top bar */}
            <Card className="bg-background/95 backdrop-blur mb-4">
              <CardContent className="py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge className={difficulty === "easy" ? "bg-green-500" : difficulty === "medium" ? "bg-yellow-500" : difficulty === "hard" ? "bg-orange-500" : "bg-red-500"}>
                      {settings.name}
                    </Badge>
                    <span className="font-bold text-xl">{score} pts</span>
                    <div className="flex items-center gap-1 text-sm">
                      <Flame className={`h-4 w-4 ${streak > 0 ? "text-orange-500" : ""}`} />
                      {streak}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-1 font-mono text-lg ${timeRemaining <= 10 ? "text-red-500 animate-pulse" : ""}`}>
                      <Timer className="h-5 w-5" />
                      {timeRemaining}s
                    </div>
                    <Badge variant="outline">
                      {t('games.speedVerse.verseProgress', { current: currentVerseIndex + 1, total: verses.length })}
                    </Badge>
                  </div>
                </div>

                <Progress value={((currentVerseIndex + 1) / verses.length) * 100} className="mt-2" />
              </CardContent>
            </Card>

            {/* Feedback overlay */}
            {feedback && (
              <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
                <div className={`px-8 py-4 rounded-xl text-2xl font-bold ${
                  feedback.type === "correct"
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}>
                  {feedback.type === "correct" ? <CheckCircle className="inline mr-2" /> : <XCircle className="inline mr-2" />}
                  {feedback.message}
                </div>
              </div>
            )}

            {/* Bottom instruction */}
            <div className="fixed bottom-20 md:bottom-4 left-4 right-4 z-20">
              <Card className="bg-background/95 backdrop-blur max-w-2xl mx-auto">
                <CardContent className="py-3 text-center">
                  <p className="text-sm text-muted-foreground">
                    {t('games.speedVerse.clickGreen')} {t('games.speedVerse.avoidOrange')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
