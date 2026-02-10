import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Pause, RotateCcw, Trophy, Lock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import {
  BiblePiece,
  LevelConfig,
  RuleId,
  PIECES,
  LEVELS,
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  ROOM_COLORS,
  RULE_DEFINITIONS,
  getPiecesForLevel,
  evaluateRowForClear,
} from '@/data/bibleTetrisData';

// Game constants
const GRID_COLS = 6;
const GRID_ROWS = 10;
const BASE_FALL_INTERVAL = 1500; // ms between piece movements
const CLEARS_TO_WIN = 5; // Number of valid clears needed to complete a level

type GameState = 'menu' | 'levelSelect' | 'playing' | 'paused' | 'levelComplete' | 'gameOver';

interface GridCell {
  piece: BiblePiece | null;
  isClearing: boolean;
}

interface FallingPiece {
  piece: BiblePiece;
  col: number;
  row: number;
}

const BibleTetris: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Game state
  const [gameState, setGameState] = useState<GameState>('menu');
  const [currentLevel, setCurrentLevel] = useState<LevelConfig | null>(null);
  const [unlockedLevels, setUnlockedLevels] = useState<string[]>(['LV1_WEIGHT_OF_THE_CUP']);

  // Grid state
  const [grid, setGrid] = useState<GridCell[][]>(() =>
    Array(GRID_ROWS).fill(null).map(() =>
      Array(GRID_COLS).fill(null).map(() => ({ piece: null, isClearing: false }))
    )
  );
  const [fallingPiece, setFallingPiece] = useState<FallingPiece | null>(null);
  const [nextPiece, setNextPiece] = useState<BiblePiece | null>(null);

  // Score and progress
  const [score, setScore] = useState(0);
  const [validClears, setValidClears] = useState(0);
  const [confusion, setConfusion] = useState(0);
  const [streak, setStreak] = useState(0);

  // Feedback
  const [lastClearResult, setLastClearResult] = useState<{
    success: boolean;
    rules: RuleId[];
    message: string;
  } | null>(null);

  // Timing
  const gameLoopRef = useRef<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Load unlocked levels from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bible_tetris_unlocked');
    if (saved) {
      try {
        setUnlockedLevels(JSON.parse(saved));
      } catch {
        // Keep default
      }
    }
  }, []);

  // Save unlocked levels
  const unlockLevel = useCallback((levelId: string) => {
    setUnlockedLevels(prev => {
      if (prev.includes(levelId)) return prev;
      const updated = [...prev, levelId];
      localStorage.setItem('bible_tetris_unlocked', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Get random piece from level pool
  const getRandomPiece = useCallback((level: LevelConfig): BiblePiece => {
    const pieces = getPiecesForLevel(level);
    // Weight by rarity
    const weighted: BiblePiece[] = [];
    pieces.forEach(p => {
      const count = p.rarity === 'common' ? 4 : p.rarity === 'uncommon' ? 2 : 1;
      for (let i = 0; i < count; i++) weighted.push(p);
    });
    return weighted[Math.floor(Math.random() * weighted.length)];
  }, []);

  // Spawn new piece
  const spawnPiece = useCallback(() => {
    if (!currentLevel) return;

    const piece = nextPiece || getRandomPiece(currentLevel);
    const col = Math.floor(Math.random() * GRID_COLS);

    // Check if spawn position is blocked
    if (grid[0][col].piece !== null) {
      // Game over - pieces stacked to top
      setGameState('gameOver');
      return;
    }

    setFallingPiece({ piece, col, row: 0 });
    setNextPiece(getRandomPiece(currentLevel));
  }, [currentLevel, nextPiece, grid, getRandomPiece]);

  // Move piece down
  const movePieceDown = useCallback(() => {
    if (!fallingPiece) return;

    const newRow = fallingPiece.row + 1;

    // Check if piece can move down
    if (newRow >= GRID_ROWS || grid[newRow][fallingPiece.col].piece !== null) {
      // Land the piece
      setGrid(prev => {
        const newGrid = prev.map(row => row.map(cell => ({ ...cell })));
        newGrid[fallingPiece.row][fallingPiece.col] = {
          piece: fallingPiece.piece,
          isClearing: false
        };
        return newGrid;
      });
      setFallingPiece(null);
    } else {
      setFallingPiece(prev => prev ? { ...prev, row: newRow } : null);
    }
  }, [fallingPiece, grid]);

  // Move piece horizontally
  const movePieceHorizontal = useCallback((direction: -1 | 1) => {
    if (!fallingPiece) return;

    const newCol = fallingPiece.col + direction;
    if (newCol < 0 || newCol >= GRID_COLS) return;
    if (grid[fallingPiece.row][newCol].piece !== null) return;

    setFallingPiece(prev => prev ? { ...prev, col: newCol } : null);
  }, [fallingPiece, grid]);

  // Drop piece instantly
  const dropPiece = useCallback(() => {
    if (!fallingPiece) return;

    let dropRow = fallingPiece.row;
    while (dropRow + 1 < GRID_ROWS && grid[dropRow + 1][fallingPiece.col].piece === null) {
      dropRow++;
    }

    setGrid(prev => {
      const newGrid = prev.map(row => row.map(cell => ({ ...cell })));
      newGrid[dropRow][fallingPiece.col] = {
        piece: fallingPiece.piece,
        isClearing: false
      };
      return newGrid;
    });
    setFallingPiece(null);
  }, [fallingPiece, grid]);

  // Check for complete rows and evaluate
  const checkRows = useCallback(() => {
    if (!currentLevel) return;

    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    let clearedAny = false;
    let totalPoints = 0;
    let satisfiedRulesThisClear: RuleId[] = [];
    let hadUntestedDeception = false;

    for (let r = GRID_ROWS - 1; r >= 0; r--) {
      const row = newGrid[r];
      const pieces = row.map(c => c.piece).filter((p): p is BiblePiece => p !== null);

      // Row is full when all cells have pieces
      if (pieces.length === GRID_COLS) {
        const result = evaluateRowForClear(pieces, currentLevel.required_rules as RuleId[]);

        if (result.cleared) {
          // Valid clear!
          clearedAny = true;
          satisfiedRulesThisClear = result.satisfiedRules;

          // Mark row for clearing animation
          for (let c = 0; c < GRID_COLS; c++) {
            newGrid[r][c].isClearing = true;
          }

          // Calculate points
          const basePoints = 100 * result.satisfiedRules.length;
          const streakBonus = Math.floor(streak * 10);
          totalPoints += basePoints + streakBonus;

          if (result.hasUntestedDeception) {
            hadUntestedDeception = true;
          }
        } else {
          // Failed clear - add confusion
          const confusionGain = pieces.some(p => p.is_deception) ? 30 : 15;
          setConfusion(prev => Math.min(prev + confusionGain, currentLevel.confusion_threshold));

          setLastClearResult({
            success: false,
            rules: result.failedRules,
            message: `Row doesn't satisfy any required rules!`
          });

          // Convert to junk (clear the row but penalize)
          for (let c = 0; c < GRID_COLS; c++) {
            newGrid[r][c] = { piece: null, isClearing: false };
          }

          setStreak(0);
        }
      }
    }

    if (clearedAny) {
      setScore(prev => prev + totalPoints);
      setStreak(prev => prev + 1);
      setValidClears(prev => prev + 1);

      if (hadUntestedDeception) {
        setConfusion(prev => Math.min(prev + 20, currentLevel.confusion_threshold));
        setLastClearResult({
          success: true,
          rules: satisfiedRulesThisClear,
          message: `Cleared but untested deception added confusion!`
        });
      } else {
        setLastClearResult({
          success: true,
          rules: satisfiedRulesThisClear,
          message: `+${totalPoints} points! Rules satisfied: ${satisfiedRulesThisClear.length}`
        });
      }

      // Remove cleared rows and shift down
      setTimeout(() => {
        setGrid(prev => {
          const clearedRowIndices = prev
            .map((row, idx) => row.some(c => c.isClearing) ? idx : -1)
            .filter(idx => idx !== -1);

          if (clearedRowIndices.length === 0) return prev;

          const remainingRows = prev.filter((_, idx) => !clearedRowIndices.includes(idx));
          const emptyRows = Array(clearedRowIndices.length).fill(null).map(() =>
            Array(GRID_COLS).fill(null).map(() => ({ piece: null, isClearing: false }))
          );

          return [...emptyRows, ...remainingRows];
        });
      }, 300);
    }

    setGrid(newGrid);
  }, [currentLevel, grid, streak]);

  // Check win/lose conditions
  useEffect(() => {
    if (gameState !== 'playing' || !currentLevel) return;

    // Check win
    if (validClears >= CLEARS_TO_WIN) {
      setGameState('levelComplete');

      // Unlock next level
      const currentIdx = LEVELS.findIndex(l => l.id === currentLevel.id);
      if (currentIdx < LEVELS.length - 1) {
        unlockLevel(LEVELS[currentIdx + 1].id);
      }

      // Save score
      if (user) {
        supabase.from('game_scores').insert({
          user_id: user.id,
          game_type: 'bible_tetris',
          score: score,
          mode: currentLevel.id,
        }).then(() => {});
      }

      return;
    }

    // Check lose (confusion threshold)
    if (confusion >= currentLevel.confusion_threshold) {
      setGameState('gameOver');
      toast.error(t('games.bibleTetris.confusionOverwhelmed'));
    }
  }, [validClears, confusion, currentLevel, gameState, user, score, unlockLevel]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing' || isPaused) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    const interval = currentLevel
      ? BASE_FALL_INTERVAL / currentLevel.speed_curve.start
      : BASE_FALL_INTERVAL;

    gameLoopRef.current = window.setInterval(() => {
      if (fallingPiece) {
        movePieceDown();
      } else {
        checkRows();
        spawnPiece();
      }
    }, interval);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState, isPaused, fallingPiece, currentLevel, movePieceDown, checkRows, spawnPiece]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing' || isPaused) return;

      switch (e.key) {
        case 'ArrowLeft':
          movePieceHorizontal(-1);
          break;
        case 'ArrowRight':
          movePieceHorizontal(1);
          break;
        case 'ArrowDown':
          movePieceDown();
          break;
        case ' ':
          dropPiece();
          break;
        case 'p':
        case 'P':
          setIsPaused(true);
          setGameState('paused');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, isPaused, movePieceHorizontal, movePieceDown, dropPiece]);

  // Start level
  const startLevel = (level: LevelConfig) => {
    setCurrentLevel(level);
    setGrid(Array(GRID_ROWS).fill(null).map(() =>
      Array(GRID_COLS).fill(null).map(() => ({ piece: null, isClearing: false }))
    ));
    setFallingPiece(null);
    setNextPiece(getRandomPiece(level));
    setScore(0);
    setValidClears(0);
    setConfusion(0);
    setStreak(0);
    setLastClearResult(null);
    setIsPaused(false);
    setGameState('playing');
  };

  // Render piece cell
  const renderPieceCell = (piece: BiblePiece, isClearing: boolean = false) => (
    <div
      className={`w-full h-full rounded flex flex-col items-center justify-center p-1 text-white text-xs font-medium transition-all
        bg-gradient-to-br ${CATEGORY_COLORS[piece.category]}
        ${isClearing ? 'animate-pulse scale-110' : ''}
        ${piece.is_deception ? 'ring-2 ring-red-500 ring-opacity-50' : ''}
      `}
    >
      <span className="text-lg">{CATEGORY_ICONS[piece.category]}</span>
      <span className="truncate w-full text-center text-[10px]">{piece.label}</span>
    </div>
  );

  // Menu screen
  const renderMenu = () => (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-black text-white">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button onClick={() => navigate('/games')} variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> {t('common.backToGames')}
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
            {t('games.bibleTetris.title')}
          </h1>
          <p className="text-gray-400">{t('games.bibleTetris.subtitle')}</p>
        </div>

        <Card className="bg-gray-900/50 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-xl">{t('games.common.howToPlay')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl">1.</span>
              <div>
                <p className="font-semibold text-amber-400">{t('games.bibleTetris.piecesFall')}</p>
                <p className="text-gray-400">{t('games.bibleTetris.piecesFallDesc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">2.</span>
              <div>
                <p className="font-semibold text-green-400">{t('games.bibleTetris.matchRules')}</p>
                <p className="text-gray-400">{t('games.bibleTetris.matchRulesDesc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">3.</span>
              <div>
                <p className="font-semibold text-red-400">{t('games.bibleTetris.avoidConfusion')}</p>
                <p className="text-gray-400">{t('games.bibleTetris.avoidConfusionDesc')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => setGameState('levelSelect')}
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
          >
            <Play className="mr-2 h-5 w-5" /> {t('games.bibleTetris.campaign')}
          </Button>
        </div>
      </div>
    </div>
  );

  // Level select screen
  const renderLevelSelect = () => (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-black text-white">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button onClick={() => setGameState('menu')} variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> {t('common.back')}
        </Button>

        <h2 className="text-2xl font-bold mb-6 text-center">{t('games.bibleTetris.selectLevel')}</h2>

        <div className="space-y-4">
          {LEVELS.map((level, idx) => {
            const isUnlocked = unlockedLevels.includes(level.id);
            return (
              <Card
                key={level.id}
                className={`border transition-all ${
                  isUnlocked
                    ? 'bg-gray-900/50 border-gray-700 hover:border-amber-500 cursor-pointer'
                    : 'bg-gray-900/30 border-gray-800 opacity-60'
                }`}
                onClick={() => isUnlocked && startLevel(level)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isUnlocked ? 'bg-amber-500/20' : 'bg-gray-700/50'
                      }`}>
                        {isUnlocked ? (
                          <span className="text-amber-400 font-bold">{idx + 1}</span>
                        ) : (
                          <Lock className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{level.title}</h3>
                        <p className="text-xs text-gray-400">{level.difficulty}</p>
                      </div>
                    </div>
                    <Badge variant={
                      level.difficulty === 'Beginner' ? 'secondary' :
                      level.difficulty === 'Intermediate' ? 'default' : 'destructive'
                    }>
                      {level.difficulty}
                    </Badge>
                  </div>
                  {isUnlocked && (
                    <p className="mt-2 text-sm text-gray-400 italic">"{level.study_question}"</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Playing screen
  const renderPlaying = () => {
    if (!currentLevel) return null;

    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-black text-white p-2">
        {/* Header */}
        <div className="flex justify-between items-center mb-2 px-2">
          <Button variant="ghost" size="sm" onClick={() => {
            setIsPaused(true);
            setGameState('paused');
          }}>
            <Pause className="h-4 w-4" />
          </Button>
          <div className="text-center">
            <div className="text-sm font-bold">{currentLevel.title}</div>
            <div className="text-xs text-gray-400">{currentLevel.difficulty}</div>
          </div>
          <div className="text-right">
            <div className="text-amber-400 font-bold">{score}</div>
            <div className="text-xs text-gray-400">{t('games.bibleTetris.clearsProgress', { current: validClears, total: CLEARS_TO_WIN })}</div>
          </div>
        </div>

        {/* Confusion meter */}
        <div className="px-2 mb-2">
          <div className="flex items-center gap-2 text-xs">
            <AlertTriangle className="h-3 w-3 text-red-400" />
            <span className="text-gray-400">{t('games.bibleTetris.confusion')}</span>
            <Progress
              value={(confusion / currentLevel.confusion_threshold) * 100}
              className="flex-1 h-2"
            />
            <span className="text-red-400">{confusion}/{currentLevel.confusion_threshold}</span>
          </div>
        </div>

        {/* Required rules */}
        <div className="px-2 mb-2">
          <div className="flex flex-wrap gap-1">
            {currentLevel.required_rules.map(ruleId => (
              <Badge key={ruleId} variant="outline" className="text-xs">
                {RULE_DEFINITIONS[ruleId as RuleId]?.shortDesc || ruleId}
              </Badge>
            ))}
          </div>
        </div>

        {/* Feedback */}
        {lastClearResult && (
          <div className={`mx-2 mb-2 p-2 rounded text-xs ${
            lastClearResult.success ? 'bg-green-900/50 border border-green-700' : 'bg-red-900/50 border border-red-700'
          }`}>
            <div className="flex items-center gap-2">
              {lastClearResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-400" />
              ) : (
                <XCircle className="h-4 w-4 text-red-400" />
              )}
              <span>{lastClearResult.message}</span>
            </div>
          </div>
        )}

        {/* Game grid */}
        <div className="flex justify-center mb-4">
          <div
            className="grid gap-1 p-2 bg-gray-900/50 rounded-lg border border-gray-700"
            style={{
              gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
              width: `${GRID_COLS * 52}px`
            }}
          >
            {grid.map((row, r) =>
              row.map((cell, c) => {
                const isFallingHere = fallingPiece && fallingPiece.row === r && fallingPiece.col === c;
                return (
                  <div
                    key={`${r}-${c}`}
                    className="w-12 h-12 bg-gray-800/50 rounded border border-gray-700"
                  >
                    {isFallingHere && fallingPiece ? (
                      renderPieceCell(fallingPiece.piece)
                    ) : cell.piece ? (
                      renderPieceCell(cell.piece, cell.isClearing)
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Next piece preview */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">{t('games.bibleTetris.next')}</div>
            <div className="w-14 h-14 bg-gray-800/50 rounded border border-gray-700 p-1">
              {nextPiece && renderPieceCell(nextPiece)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">{t('games.common.streak')}</div>
            <div className="w-14 h-14 bg-gray-800/50 rounded border border-gray-700 flex items-center justify-center">
              <span className="text-2xl font-bold text-orange-400">{streak}</span>
            </div>
          </div>
        </div>

        {/* Touch controls */}
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            size="lg"
            className="w-16 h-16"
            onClick={() => movePieceHorizontal(-1)}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-16 h-16"
            onClick={dropPiece}
          >
            {t('games.bibleTetris.drop')}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-16 h-16"
            onClick={() => movePieceHorizontal(1)}
          >
            <ArrowLeft className="h-6 w-6 rotate-180" />
          </Button>
        </div>
      </div>
    );
  };

  // Paused screen
  const renderPaused = () => (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-black text-white flex items-center justify-center">
      <Card className="bg-gray-900/90 border-gray-700 max-w-sm w-full mx-4">
        <CardContent className="p-8 text-center">
          <Pause className="h-16 w-16 mx-auto mb-4 text-amber-400" />
          <h2 className="text-2xl font-bold mb-6">{t('games.common.paused')}</h2>
          <div className="space-y-4">
            <Button
              onClick={() => {
                setIsPaused(false);
                setGameState('playing');
              }}
              className="w-full"
            >
              <Play className="mr-2 h-4 w-4" /> {t('games.common.resume')}
            </Button>
            <Button
              variant="outline"
              onClick={() => setGameState('menu')}
              className="w-full"
            >
              {t('games.common.quitToMenu')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Level complete screen
  const renderLevelComplete = () => {
    if (!currentLevel) return null;

    const currentIdx = LEVELS.findIndex(l => l.id === currentLevel.id);
    const nextLevel = currentIdx < LEVELS.length - 1 ? LEVELS[currentIdx + 1] : null;

    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-black text-white flex items-center justify-center p-4">
        <Card className="bg-gray-900/90 border-gray-700 max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Trophy className="h-20 w-20 mx-auto mb-4 text-yellow-400" />
            <h2 className="text-2xl font-bold mb-2">{t('games.common.levelComplete')}</h2>
            <p className="text-gray-400 mb-4">{currentLevel.title}</p>

            <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
              <div className="text-4xl font-bold text-amber-400 mb-1">{score}</div>
              <div className="text-sm text-gray-400">{t('games.common.points')}</div>
            </div>

            <div className="bg-blue-900/30 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm font-semibold text-blue-400 mb-2">{t('games.bibleTetris.studyInsight')}:</p>
              <p className="text-sm text-gray-300">{currentLevel.post_level_insight}</p>
            </div>

            <div className="space-y-3">
              {nextLevel && (
                <Button
                  onClick={() => startLevel(nextLevel)}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600"
                >
                  {t('games.common.nextLevel', { name: nextLevel.title })}
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => startLevel(currentLevel)}
                className="w-full"
              >
                <RotateCcw className="mr-2 h-4 w-4" /> {t('games.bibleTetris.replay')}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setGameState('menu')}
                className="w-full"
              >
                {t('games.common.backToMenu')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Game over screen
  const renderGameOver = () => (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-black text-white flex items-center justify-center p-4">
      <Card className="bg-gray-900/90 border-gray-700 max-w-sm w-full">
        <CardContent className="p-8 text-center">
          <XCircle className="h-16 w-16 mx-auto mb-4 text-red-400" />
          <h2 className="text-2xl font-bold mb-2">{t('games.common.gameOver')}</h2>
          <p className="text-gray-400 mb-6">
            {confusion >= (currentLevel?.confusion_threshold || 0)
              ? t('games.bibleTetris.confusionOverwhelmed')
              : t('games.bibleTetris.piecesStackedTooHigh')}
          </p>

          <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
            <div className="text-3xl font-bold text-amber-400 mb-1">{score}</div>
            <div className="text-sm text-gray-400">{t('games.bibleTetris.pointsWithClears', { clears: validClears })}</div>
          </div>

          <div className="space-y-3">
            {currentLevel && (
              <Button
                onClick={() => startLevel(currentLevel)}
                className="w-full"
              >
                <RotateCcw className="mr-2 h-4 w-4" /> {t('games.common.tryAgain')}
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => setGameState('menu')}
              className="w-full"
            >
              {t('games.common.backToMenu')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render based on game state
  switch (gameState) {
    case 'levelSelect':
      return renderLevelSelect();
    case 'playing':
      return renderPlaying();
    case 'paused':
      return renderPaused();
    case 'levelComplete':
      return renderLevelComplete();
    case 'gameOver':
      return renderGameOver();
    default:
      return renderMenu();
  }
};

export default BibleTetris;
