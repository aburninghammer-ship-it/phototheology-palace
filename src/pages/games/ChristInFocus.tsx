import { useState, useEffect, useRef, useCallback } from "react";
import { FloatingGameChat } from "@/components/games/FloatingGameChat";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Trophy,
  Star,
  Lock,
  CheckCircle2,
  XCircle,
  Zap,
  BookOpen,
  Target,
  Sparkles
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  allCRLevels,
  getLevelsByCategory,
  getLevelById,
  feedbackMessages,
  falseCenterDescriptions,
  scoringConfig,
  type CRLevel,
  type MotionElement,
  type LevelCategory,
  type Difficulty,
  type FalseCenterType,
} from "@/data/christInFocusData";

type GameState = 'menu' | 'categorySelect' | 'levelSelect' | 'playing' | 'paused' | 'levelComplete' | 'gameOver';

interface Position {
  x: number;
  y: number;
}

interface DraggableElement extends MotionElement {
  position: Position;
  isLocked: boolean;
  lockedTo: string | null;
  velocity: Position;
}

interface Connection {
  from: string;
  to: string;
  isCorrect: boolean;
}

const GAME_WIDTH = 360;
const GAME_HEIGHT = 540;
const ANCHOR_RADIUS = 55;
const ELEMENT_RADIUS = 40;
const LOCK_DISTANCE = 70;
const REPEL_DISTANCE = 100;
const DRIFT_SPEED = 0.2;

const getAnchorIcon = (icon: string) => {
  switch (icon) {
    case 'lamb': return '🐑';
    case 'cross': return '✝️';
    case 'high_priest': return '👑';
    case 'throne': return '🪑';
    case 'mediator': return '🙏';
    default: return '✝️';
  }
};

const getCategoryColor = (category: LevelCategory) => {
  switch (category) {
    case 'TORAH': return 'bg-amber-500';
    case 'PROPHETS': return 'bg-purple-500';
    case 'GOSPELS': return 'bg-red-500';
    case 'REVELATION': return 'bg-blue-500';
    default: return 'bg-gray-500';
  }
};

const getCategoryIcon = (category: LevelCategory) => {
  switch (category) {
    case 'TORAH': return '📜';
    case 'PROPHETS': return '📢';
    case 'GOSPELS': return '📖';
    case 'REVELATION': return '👁️';
    default: return '📚';
  }
};

const getDifficultyColor = (difficulty: Difficulty) => {
  switch (difficulty) {
    case 'beginner': return 'bg-green-500 text-white';
    case 'intermediate': return 'bg-yellow-500 text-black';
    case 'master': return 'bg-red-500 text-white';
    default: return 'bg-gray-500';
  }
};

export default function ChristInFocus() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  // Game state
  const [gameState, setGameState] = useState<GameState>('menu');
  const [selectedCategory, setSelectedCategory] = useState<LevelCategory | null>(null);
  const [currentLevel, setCurrentLevel] = useState<CRLevel | null>(null);
  const [unlockedLevels, setUnlockedLevels] = useState<Set<string>>(() => new Set(allCRLevels.map(l => l.id)));

  // Playing state
  const [elements, setElements] = useState<DraggableElement[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [falseCentersShown, setFalseCentersShown] = useState<{ id: string; label: string; type: FalseCenterType }[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });

  // Scoring
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [falseCenterAttempts, setFalseCenterAttempts] = useState(0);
  const [connectionStartTime, setConnectionStartTime] = useState<number | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'warning'>('success');

  // Stability meter (100 = fully stable)
  const [stability, setStability] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [hintElementId, setHintElementId] = useState<string | null>(null);

  // High scores
  const [highScores, setHighScores] = useState<Record<string, number>>({});

  // Load unlocked levels and high scores from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('christInFocus_unlocked');
    if (saved) {
      setUnlockedLevels(new Set(JSON.parse(saved)));
    }
    const scores = localStorage.getItem('christInFocus_scores');
    if (scores) {
      setHighScores(JSON.parse(scores));
    }
  }, []);

  // Save unlocked levels
  const saveUnlockedLevels = useCallback((levels: Set<string>) => {
    localStorage.setItem('christInFocus_unlocked', JSON.stringify([...levels]));
  }, []);

  // Initialize level
  const initializeLevel = useCallback((level: CRLevel) => {
    const centerX = GAME_WIDTH / 2;
    const centerY = GAME_HEIGHT / 2;

    // Position elements in a circle around the center
    const elementCount = level.motionElements.length;
    const radius = Math.min(GAME_WIDTH, GAME_HEIGHT) * 0.35;

    const initialElements: DraggableElement[] = level.motionElements.map((el, index) => {
      const angle = (index / elementCount) * Math.PI * 2 - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      // Random drift direction
      const driftAngle = Math.random() * Math.PI * 2;

      return {
        ...el,
        position: { x, y },
        isLocked: false,
        lockedTo: null,
        velocity: {
          x: Math.cos(driftAngle) * DRIFT_SPEED,
          y: Math.sin(driftAngle) * DRIFT_SPEED,
        },
      };
    });

    setElements(initialElements);
    setConnections([]);
    setFalseCentersShown([]);
    setScore(0);
    setStreak(0);
    setFalseCenterAttempts(0);
    setStability(0);
    setFeedbackMessage(null);
    setCurrentLevel(level);
    setGameState('playing');
    setConnectionStartTime(Date.now());
  }, []);

  // Drift animation loop
  useEffect(() => {
    if (gameState !== 'playing') {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const animate = () => {
      setElements(prev => prev.map(el => {
        if (el.isLocked || el.id === draggingId) return el;

        let { x, y } = el.position;
        let { x: vx, y: vy } = el.velocity;

        // Apply velocity
        x += vx;
        y += vy;

        // Bounce off walls
        const margin = ELEMENT_RADIUS;
        if (x < margin || x > GAME_WIDTH - margin) {
          vx = -vx;
          x = Math.max(margin, Math.min(GAME_WIDTH - margin, x));
        }
        if (y < margin || y > GAME_HEIGHT - margin) {
          vy = -vy;
          y = Math.max(margin, Math.min(GAME_HEIGHT - margin, y));
        }

        // Slight random drift change
        if (Math.random() < 0.02) {
          const driftAngle = Math.random() * Math.PI * 2;
          vx = Math.cos(driftAngle) * DRIFT_SPEED;
          vy = Math.sin(driftAngle) * DRIFT_SPEED;
        }

        return {
          ...el,
          position: { x, y },
          velocity: { x: vx, y: vy },
        };
      }));

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, draggingId]);

  // Check for level completion
  useEffect(() => {
    if (!currentLevel || gameState !== 'playing') return;

    const lockedElements = elements.filter(el => el.isLocked);
    const totalRequired = currentLevel.requiredConnections.length;
    const correctConnections = connections.filter(c => c.isCorrect).length;

    // Update stability
    const newStability = Math.round((correctConnections / totalRequired) * 100);
    setStability(newStability);

    // Check win condition
    if (correctConnections >= totalRequired && lockedElements.length >= currentLevel.motionElements.length - 1) {
      // Level complete!
      setTimeout(() => {
        // Unlock next level
        const allLevels = allCRLevels;
        const currentIndex = allLevels.findIndex(l => l.id === currentLevel.id);
        if (currentIndex < allLevels.length - 1) {
          const nextLevel = allLevels[currentIndex + 1];
          const newUnlocked = new Set(unlockedLevels);
          newUnlocked.add(nextLevel.id);
          setUnlockedLevels(newUnlocked);
          saveUnlockedLevels(newUnlocked);
        }

        // Calculate final score
        let finalScore = score;
        finalScore += scoringConfig.stabilityBonus;
        if (falseCenterAttempts === 0) {
          finalScore += scoringConfig.purityBonus;
        }

        setScore(finalScore);

        // Save high score
        if (!highScores[currentLevel.id] || finalScore > highScores[currentLevel.id]) {
          const newScores = { ...highScores, [currentLevel.id]: finalScore };
          setHighScores(newScores);
          localStorage.setItem('christInFocus_scores', JSON.stringify(newScores));
        }

        // Save to Supabase
        saveScoreToSupabase(finalScore);

        setGameState('levelComplete');
      }, 500);
    }
  }, [connections, elements, currentLevel, gameState, score, falseCenterAttempts, unlockedLevels, highScores, saveUnlockedLevels]);

  const saveScoreToSupabase = async (finalScore: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !currentLevel) return;

      await supabase.from('game_scores').insert({
        user_id: user.id,
        game_type: 'christ_in_focus',
        score: finalScore,
        metadata: {
          level_id: currentLevel.id,
          level_name: currentLevel.reference,
          category: currentLevel.category,
          difficulty: currentLevel.difficulty,
          false_center_attempts: falseCenterAttempts,
        }
      });
    } catch (err) {
      console.error('Failed to save score:', err);
    }
  };

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, elementId: string) => {
    if (gameState !== 'playing') return;

    const element = elements.find(el => el.id === elementId);
    if (!element || element.isLocked) return;

    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (!rect) return;

    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    setDraggingId(elementId);
    setDragOffset({
      x: clientX - rect.left - element.position.x,
      y: clientY - rect.top - element.position.y,
    });

    if (!connectionStartTime) {
      setConnectionStartTime(Date.now());
    }
  };

  // Handle drag move
  const handleDragMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!draggingId || gameState !== 'playing') return;

    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (!rect) return;

    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const newX = Math.max(ELEMENT_RADIUS, Math.min(GAME_WIDTH - ELEMENT_RADIUS, clientX - rect.left - dragOffset.x));
    const newY = Math.max(ELEMENT_RADIUS, Math.min(GAME_HEIGHT - ELEMENT_RADIUS, clientY - rect.top - dragOffset.y));

    setElements(prev => prev.map(el => {
      if (el.id !== draggingId) return el;
      return { ...el, position: { x: newX, y: newY } };
    }));
  }, [draggingId, dragOffset, gameState]);

  // Handle drag end - check for connections
  const handleDragEnd = useCallback(() => {
    if (!draggingId || !currentLevel || gameState !== 'playing') {
      setDraggingId(null);
      return;
    }

    const element = elements.find(el => el.id === draggingId);
    if (!element) {
      setDraggingId(null);
      return;
    }

    const centerX = GAME_WIDTH / 2;
    const centerY = GAME_HEIGHT / 2;

    // Check distance to Christ anchor
    const distToAnchor = Math.sqrt(
      Math.pow(element.position.x - centerX, 2) +
      Math.pow(element.position.y - centerY, 2)
    );

    // Check if element should connect to anchor
    if (distToAnchor < LOCK_DISTANCE && element.correctTarget === currentLevel.christAnchor.id) {
      // Correct connection to anchor!
      handleCorrectConnection(element, currentLevel.christAnchor.id);
    } else if (distToAnchor < LOCK_DISTANCE && element.correctTarget !== currentLevel.christAnchor.id) {
      // Wrong direct connection to anchor
      handleWrongConnection(element);
    } else {
      // Check for connections to other elements
      let connected = false;
      for (const otherEl of elements) {
        if (otherEl.id === element.id || !otherEl.isLocked) continue;

        const dist = Math.sqrt(
          Math.pow(element.position.x - otherEl.position.x, 2) +
          Math.pow(element.position.y - otherEl.position.y, 2)
        );

        if (dist < LOCK_DISTANCE) {
          if (element.correctTarget === otherEl.id) {
            // Correct connection to another element!
            handleCorrectConnection(element, otherEl.id);
            connected = true;
            break;
          } else {
            // Wrong connection
            handleWrongConnection(element);
            connected = true;
            break;
          }
        }
      }

      // Check for false centers
      if (!connected) {
        for (const fc of currentLevel.falseCenters) {
          // False centers appear at specific positions
          const fcPositions: Record<string, Position> = {
            [currentLevel.falseCenters[0]?.id || '']: { x: 60, y: GAME_HEIGHT - 60 },
            [currentLevel.falseCenters[1]?.id || '']: { x: GAME_WIDTH - 60, y: GAME_HEIGHT - 60 },
            [currentLevel.falseCenters[2]?.id || '']: { x: GAME_WIDTH - 60, y: 60 },
          };

          const fcPos = fcPositions[fc.id];
          if (!fcPos) continue;

          const distToFc = Math.sqrt(
            Math.pow(element.position.x - fcPos.x, 2) +
            Math.pow(element.position.y - fcPos.y, 2)
          );

          if (distToFc < LOCK_DISTANCE) {
            handleFalseCenterAttempt(fc);
            break;
          }
        }
      }
    }

    setDraggingId(null);
  }, [draggingId, elements, currentLevel, gameState]);

  const handleCorrectConnection = (element: DraggableElement, targetId: string) => {
    // Calculate speed bonus
    const timeTaken = connectionStartTime ? (Date.now() - connectionStartTime) / 1000 : 10;
    let speedBonus = scoringConfig.speedBonus.slow;
    if (timeTaken < 3) speedBonus = scoringConfig.speedBonus.fast;
    else if (timeTaken < 6) speedBonus = scoringConfig.speedBonus.medium;

    // Calculate score with streak
    const newStreak = streak + 1;
    const baseScore = scoringConfig.correctConnection + speedBonus;
    const multiplier = newStreak >= 3 ? scoringConfig.streakMultiplier : 1;
    const earnedScore = Math.round(baseScore * multiplier);

    setScore(prev => prev + earnedScore);
    setStreak(newStreak);

    // Lock element
    const targetEl = elements.find(el => el.id === targetId);
    const targetPos = targetId === currentLevel?.christAnchor.id
      ? { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 }
      : targetEl?.position || { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 };

    // Position near target
    const angle = Math.random() * Math.PI * 2;
    const offset = ELEMENT_RADIUS * 1.5;

    setElements(prev => prev.map(el => {
      if (el.id !== element.id) return el;
      return {
        ...el,
        isLocked: true,
        lockedTo: targetId,
        position: {
          x: targetPos.x + Math.cos(angle) * offset,
          y: targetPos.y + Math.sin(angle) * offset,
        },
        velocity: { x: 0, y: 0 },
      };
    }));

    // Add connection
    setConnections(prev => [...prev, { from: element.id, to: targetId, isCorrect: true }]);

    // Show success feedback
    const msg = feedbackMessages.success[Math.floor(Math.random() * feedbackMessages.success.length)];
    showFeedback(msg, 'success');

    setConnectionStartTime(Date.now());
  };

  const handleWrongConnection = (element: DraggableElement) => {
    setStreak(0);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);

    // Repel element
    const centerX = GAME_WIDTH / 2;
    const centerY = GAME_HEIGHT / 2;
    const angle = Math.atan2(element.position.y - centerY, element.position.x - centerX);
    const repelX = centerX + Math.cos(angle) * REPEL_DISTANCE * 1.5;
    const repelY = centerY + Math.sin(angle) * REPEL_DISTANCE * 1.5;

    setElements(prev => prev.map(el => {
      if (el.id !== element.id) return el;
      return {
        ...el,
        position: {
          x: Math.max(ELEMENT_RADIUS, Math.min(GAME_WIDTH - ELEMENT_RADIUS, repelX)),
          y: Math.max(ELEMENT_RADIUS, Math.min(GAME_HEIGHT - ELEMENT_RADIUS, repelY)),
        },
      };
    }));

    // Show medium feedback
    const msg = feedbackMessages.medium[Math.floor(Math.random() * feedbackMessages.medium.length)];
    showFeedback(msg, 'warning');
  };

  const handleFalseCenterAttempt = (fc: { id: string; label: string; type: FalseCenterType }) => {
    setFalseCenterAttempts(prev => prev + 1);
    setScore(prev => Math.max(0, prev + scoringConfig.falseCenterPenalty));
    setStreak(0);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);

    // Show false center
    if (!falseCentersShown.find(f => f.id === fc.id)) {
      setFalseCentersShown(prev => [...prev, fc]);
    }

    // Show strong feedback
    const msg = feedbackMessages.strong[Math.floor(Math.random() * feedbackMessages.strong.length)];
    showFeedback(`${msg} ${falseCenterDescriptions[fc.type]}`, 'error');
  };

  const showFeedback = (message: string, type: 'success' | 'error' | 'warning') => {
    setFeedbackMessage(message);
    setFeedbackType(type);
    setTimeout(() => setFeedbackMessage(null), 2500);
  };

  // Render menu
  const renderMenu = () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-md mx-auto">
        <Button variant="ghost" onClick={() => navigate('/games')} className="text-white mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> {t('common.backToGames')}
        </Button>

        <div className="text-center mb-8">
          <div className="text-6xl mb-4">✝️</div>
          <h1 className="text-3xl font-bold text-white mb-2">{t('games.christInFocus.title')}</h1>
          <p className="text-purple-200">{t('games.christInFocus.subtitle')}</p>
          <p className="text-sm text-purple-300 mt-2 italic">{t('games.christInFocus.motto')}</p>
        </div>

        <Card className="bg-white/10 border-purple-500/30 mb-6">
          <CardContent className="p-6">
            <Target className="h-10 w-10 mx-auto mb-3 text-purple-300" />
            <h2 className="text-xl font-bold text-white mb-3 text-center">How to Play</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-lg">1.</span>
                <p className="text-purple-200">A <span className="text-yellow-400 font-bold">gold circle</span> in the center represents Christ. Floating <span className="text-purple-400 font-bold">purple circles</span> are verse words.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">2.</span>
                <p className="text-purple-200"><span className="font-bold text-white">Drag</span> each word toward Christ (gold center) or toward another word it connects to. If correct, it locks in place and turns <span className="text-green-400 font-bold">green</span>.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">3.</span>
                <p className="text-purple-200">Some words connect to Christ directly. Others connect through another word first. <span className="text-white font-bold">Tap a word</span> to see a hint about its target.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">4.</span>
                <p className="text-purple-200"><span className="text-red-400 font-bold">Avoid</span> the gray circles in the corners — those are <span className="text-red-400">false centers</span> (wrong interpretations).</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">5.</span>
                <p className="text-purple-200">Connect all words correctly to complete the level and reveal the Christ-centered lesson.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Button
            onClick={() => setGameState('categorySelect')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg"
          >
            <Play className="h-5 w-5 mr-2" /> {t('games.christInFocus.startCampaign')}
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              const beginnerLevels = allCRLevels.filter(l => l.difficulty === 'beginner');
              const randomLevel = beginnerLevels[Math.floor(Math.random() * beginnerLevels.length)];
              initializeLevel(randomLevel);
            }}
            className="w-full border-purple-500 text-purple-200 hover:bg-purple-500/20 py-4"
          >
            <Zap className="h-4 w-4 mr-2" /> {t('games.christInFocus.quickPlay')}
          </Button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-purple-300 text-sm">
            {t('games.christInFocus.floorLabel')}
          </p>
          <p className="text-purple-400 text-xs mt-1">
            {t('games.christInFocus.floorDescription')}
          </p>
        </div>
      </div>
    </div>
  );

  // Render category select
  const renderCategorySelect = () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-md mx-auto">
        <Button variant="ghost" onClick={() => setGameState('menu')} className="text-white mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> {t('common.back')}
        </Button>

        <h2 className="text-2xl font-bold text-white text-center mb-6">{t('games.christInFocus.selectCategory')}</h2>

        <div className="grid grid-cols-2 gap-4">
          {(['TORAH', 'PROPHETS', 'GOSPELS', 'REVELATION'] as LevelCategory[]).map(category => {
            const levels = getLevelsByCategory(category);
            const unlockedCount = levels.filter(l => unlockedLevels.has(l.id)).length;

            return (
              <Card
                key={category}
                className="bg-white/10 border-purple-500/30 cursor-pointer hover:bg-white/20 transition-colors"
                onClick={() => {
                  setSelectedCategory(category);
                  setGameState('levelSelect');
                }}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-4xl mb-2">{getCategoryIcon(category)}</div>
                  <h3 className="text-lg font-bold text-white">{category}</h3>
                  <p className="text-purple-300 text-sm">
                    {t('games.christInFocus.unlockedCount', { unlocked: unlockedCount, total: levels.length })}
                  </p>
                  <div className={`h-1 rounded mt-2 ${getCategoryColor(category)}`}
                       style={{ width: `${(unlockedCount / levels.length) * 100}%` }} />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Render level select
  const renderLevelSelect = () => {
    if (!selectedCategory) return null;
    const levels = getLevelsByCategory(selectedCategory);

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-md mx-auto">
          <Button variant="ghost" onClick={() => setGameState('categorySelect')} className="text-white mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> {t('common.back')}
          </Button>

          <div className="text-center mb-6">
            <div className="text-4xl mb-2">{getCategoryIcon(selectedCategory)}</div>
            <h2 className="text-2xl font-bold text-white">{selectedCategory}</h2>
          </div>

          <div className="space-y-3">
            {levels.map((level, index) => {
              const isUnlocked = unlockedLevels.has(level.id);
              const bestScore = highScores[level.id];

              return (
                <Card
                  key={level.id}
                  className={`border-purple-500/30 transition-all ${
                    isUnlocked
                      ? 'bg-white/10 cursor-pointer hover:bg-white/20'
                      : 'bg-black/30 opacity-60'
                  }`}
                  onClick={() => isUnlocked && initializeLevel(level)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {isUnlocked ? (
                          bestScore ? (
                            <CheckCircle2 className="h-6 w-6 text-green-400" />
                          ) : (
                            <Target className="h-6 w-6 text-purple-400" />
                          )
                        ) : (
                          <Lock className="h-6 w-6 text-gray-500" />
                        )}
                        <div>
                          <h3 className="text-white font-medium">{level.reference}</h3>
                          <p className="text-purple-300 text-sm line-clamp-1">{level.verse.slice(0, 40)}...</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getDifficultyColor(level.difficulty)}>
                          {level.difficulty}
                        </Badge>
                        {bestScore && (
                          <p className="text-yellow-400 text-sm mt-1">
                            <Star className="h-3 w-3 inline" /> {bestScore}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Render playing
  const renderPlaying = () => {
    if (!currentLevel) return null;

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 p-2 sm:p-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <Button variant="ghost" size="sm" onClick={() => setGameState('paused')} className="text-white">
              <Pause className="h-4 w-4" />
            </Button>
            <div className="text-center">
              <p className="text-purple-200 text-xs">{currentLevel.reference}</p>
              <Badge className={getDifficultyColor(currentLevel.difficulty)}>
                {currentLevel.difficulty}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-yellow-400 font-bold">{score}</p>
              {streak >= 3 && <p className="text-orange-400 text-xs">🔥 x{streak}</p>}
            </div>
          </div>

          {/* Verse */}
          <Card className="bg-black/30 border-purple-500/30 mb-2">
            <CardContent className="p-2">
              <p className="text-purple-100 text-sm italic text-center">"{currentLevel.verse}"</p>
            </CardContent>
          </Card>

          {/* Stability meter */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-purple-300 text-xs">{t('games.christInFocus.stability')}</span>
            <Progress value={stability} className="flex-1 h-2" />
            <span className="text-purple-300 text-xs">{stability}%</span>
          </div>

          {/* Game area */}
          <div
            ref={gameAreaRef}
            className={`relative bg-black/50 rounded-lg border-2 border-purple-500/50 overflow-hidden touch-none ${
              isShaking ? 'animate-shake' : ''
            }`}
            style={{ width: GAME_WIDTH, height: GAME_HEIGHT, margin: '0 auto' }}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            {/* Christ Anchor (center) */}
            <motion.div
              className="absolute flex flex-col items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 shadow-lg shadow-yellow-500/50"
              style={{
                left: GAME_WIDTH / 2 - ANCHOR_RADIUS,
                top: GAME_HEIGHT / 2 - ANCHOR_RADIUS,
                width: ANCHOR_RADIUS * 2,
                height: ANCHOR_RADIUS * 2,
              }}
              animate={{
                scale: [1, 1.05, 1],
                boxShadow: ['0 0 20px rgba(234,179,8,0.5)', '0 0 30px rgba(234,179,8,0.7)', '0 0 20px rgba(234,179,8,0.5)'],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-2xl">{getAnchorIcon(currentLevel.christAnchor.icon)}</span>
              <span className="text-[10px] text-amber-900 font-bold text-center px-1 leading-tight">
                {currentLevel.christAnchor.label}
              </span>
            </motion.div>

            {/* False centers (corners) */}
            {currentLevel.falseCenters.map((fc, index) => {
              const positions = [
                { x: 60, y: GAME_HEIGHT - 60 },
                { x: GAME_WIDTH - 60, y: GAME_HEIGHT - 60 },
                { x: GAME_WIDTH - 60, y: 60 },
              ];
              const pos = positions[index];
              if (!pos) return null;
              const isRevealed = falseCentersShown.find(f => f.id === fc.id);

              return (
                <motion.div
                  key={fc.id}
                  className={`absolute flex items-center justify-center rounded-full border-2 ${
                    isRevealed
                      ? 'bg-red-900/80 border-red-500'
                      : 'bg-gray-800/50 border-gray-600/50'
                  }`}
                  style={{
                    left: pos.x - 30,
                    top: pos.y - 30,
                    width: 60,
                    height: 60,
                  }}
                  animate={isRevealed ? { scale: [1, 1.1, 1] } : {}}
                >
                  <span className={`text-[9px] text-center px-1 ${isRevealed ? 'text-red-200' : 'text-gray-500'}`}>
                    {isRevealed ? fc.label : '?'}
                  </span>
                </motion.div>
              );
            })}

            {/* Connection lines */}
            <svg className="absolute inset-0 pointer-events-none" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
              {connections.map((conn, index) => {
                const fromEl = elements.find(el => el.id === conn.from);
                const toEl = conn.to === currentLevel.christAnchor.id
                  ? null
                  : elements.find(el => el.id === conn.to);

                const fromPos = fromEl?.position || { x: 0, y: 0 };
                const toPos = toEl?.position || { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 };

                return (
                  <motion.line
                    key={index}
                    x1={fromPos.x}
                    y1={fromPos.y}
                    x2={toPos.x}
                    y2={toPos.y}
                    stroke={conn.isCorrect ? '#22c55e' : '#ef4444'}
                    strokeWidth={2}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                );
              })}
            </svg>

            {/* Draggable elements */}
            {elements.map(element => {
              const isHinted = hintElementId === element.id;
              const targetLabel = element.correctTarget === currentLevel.christAnchor.id
                ? currentLevel.christAnchor.label
                : elements.find(el => el.id === element.correctTarget)?.label || '?';

              return (
                <motion.div
                  key={element.id}
                  className={`absolute flex flex-col items-center justify-center rounded-full cursor-grab active:cursor-grabbing select-none ${
                    element.isLocked
                      ? 'bg-green-600 border-2 border-green-400'
                      : isHinted
                        ? 'bg-purple-500 border-2 border-yellow-400 shadow-lg shadow-yellow-400/30'
                        : 'bg-purple-600 border-2 border-purple-400 hover:bg-purple-500'
                  }`}
                  style={{
                    left: element.position.x - ELEMENT_RADIUS,
                    top: element.position.y - ELEMENT_RADIUS,
                    width: ELEMENT_RADIUS * 2,
                    height: ELEMENT_RADIUS * 2,
                    zIndex: draggingId === element.id ? 100 : isHinted ? 50 : 10,
                  }}
                  animate={element.isLocked ? { scale: [1, 1.1, 1] } : {}}
                  transition={element.isLocked ? { duration: 0.3 } : {}}
                  onMouseDown={(e) => handleDragStart(e, element.id)}
                  onTouchStart={(e) => handleDragStart(e, element.id)}
                  onClick={() => {
                    if (!element.isLocked && !draggingId) {
                      setHintElementId(prev => prev === element.id ? null : element.id);
                    }
                  }}
                >
                  <span className="text-white text-xs font-bold text-center px-1 leading-tight">
                    {element.label}
                  </span>
                  {isHinted && !element.isLocked && (
                    <span className="text-yellow-300 text-[8px] text-center leading-tight mt-0.5">
                      → {targetLabel.length > 10 ? targetLabel.slice(0, 10) + '…' : targetLabel}
                    </span>
                  )}
                </motion.div>
              );
            })}

            {/* Feedback message */}
            <AnimatePresence>
              {feedbackMessage && (
                <motion.div
                  className={`absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg text-white text-sm font-medium text-center max-w-[90%] ${
                    feedbackType === 'success' ? 'bg-green-600' :
                    feedbackType === 'error' ? 'bg-red-600' : 'bg-yellow-600'
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {feedbackMessage}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* PT Room badge */}
          <div className="text-center mt-2">
            <Badge variant="outline" className="text-purple-300 border-purple-500">
              {currentLevel.ptRoom}
            </Badge>
          </div>
        </div>
      </div>
    );
  };

  // Render paused
  const renderPaused = () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 p-4 flex items-center justify-center">
      <Card className="bg-white/10 border-purple-500/30 w-full max-w-sm">
        <CardContent className="p-6 text-center">
          <Pause className="h-12 w-12 mx-auto mb-4 text-purple-300" />
          <h2 className="text-2xl font-bold text-white mb-4">{t('games.common.paused')}</h2>

          <div className="space-y-3">
            <Button onClick={() => setGameState('playing')} className="w-full bg-purple-600 hover:bg-purple-700">
              <Play className="h-4 w-4 mr-2" /> {t('games.common.resume')}
            </Button>
            <Button
              variant="outline"
              onClick={() => currentLevel && initializeLevel(currentLevel)}
              className="w-full border-purple-500 text-purple-200"
            >
              <RotateCcw className="h-4 w-4 mr-2" /> {t('games.christInFocus.restartLevel')}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setGameState('menu')}
              className="w-full text-purple-300"
            >
              {t('games.common.exitToMenu')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render level complete
  const renderLevelComplete = () => {
    if (!currentLevel) return null;

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-md mx-auto">
          <Card className="bg-white/10 border-purple-500/30">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                >
                  <Sparkles className="h-16 w-16 mx-auto text-yellow-400 mb-4" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-2">{t('games.christInFocus.christIsInFocus')}</h2>
                <p className="text-purple-200">{currentLevel.reference}</p>
              </div>

              {/* Score breakdown */}
              <div className="bg-black/30 rounded-lg p-4 mb-6">
                <div className="flex justify-between text-purple-200 mb-2">
                  <span>{t('games.christInFocus.connections')}</span>
                  <span>{connections.filter(c => c.isCorrect).length}</span>
                </div>
                <div className="flex justify-between text-purple-200 mb-2">
                  <span>{t('games.christInFocus.falseCenterAttempts')}</span>
                  <span className={falseCenterAttempts > 0 ? 'text-red-400' : 'text-green-400'}>
                    {falseCenterAttempts}
                  </span>
                </div>
                <div className="flex justify-between text-yellow-400 font-bold text-lg border-t border-purple-500/30 pt-2 mt-2">
                  <span>{t('games.common.totalScore')}</span>
                  <span>{score}</span>
                </div>
              </div>

              {/* Christ Focus Summary */}
              <div className="bg-amber-900/30 border border-amber-500/30 rounded-lg p-4 mb-6">
                <h3 className="text-amber-300 font-bold mb-2 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" /> {t('games.christInFocus.christFocusSummary')}
                </h3>
                <p className="text-amber-100 text-sm italic">{currentLevel.christFocusSummary}</p>
              </div>

              {/* Lesson */}
              <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 mb-6">
                <h3 className="text-purple-300 font-bold mb-2">{t('games.christInFocus.keyInsight')}</h3>
                <p className="text-purple-100 text-sm">{currentLevel.lesson}</p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {(() => {
                  const allLevels = allCRLevels;
                  const currentIndex = allLevels.findIndex(l => l.id === currentLevel.id);
                  const nextLevel = currentIndex < allLevels.length - 1 ? allLevels[currentIndex + 1] : null;

                  if (nextLevel && unlockedLevels.has(nextLevel.id)) {
                    return (
                      <Button
                        onClick={() => initializeLevel(nextLevel)}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        {t('games.common.nextLevel', { name: nextLevel.reference })}
                      </Button>
                    );
                  }
                  return null;
                })()}

                <Button
                  variant="outline"
                  onClick={() => currentLevel && initializeLevel(currentLevel)}
                  className="w-full border-purple-500 text-purple-200"
                >
                  <RotateCcw className="h-4 w-4 mr-2" /> {t('games.common.playAgain')}
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => setGameState('menu')}
                  className="w-full text-purple-300"
                >
                  {t('games.common.backToMenu')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // Main render
  const content = (() => {
    switch (gameState) {
      case 'menu': return renderMenu();
      case 'categorySelect': return renderCategorySelect();
      case 'levelSelect': return renderLevelSelect();
      case 'playing': return renderPlaying();
      case 'paused': return renderPaused();
      case 'levelComplete': return renderLevelComplete();
      default: return renderMenu();
    }
  })();

  return (
    <>
      {content}
      <FloatingGameChat gameType="christ-in-focus" />
    </>
  );
}
