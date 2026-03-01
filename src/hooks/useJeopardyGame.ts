// PT Jeopardy Game Hook
// Manages game state, AI question generation via Jeeves, and scoring

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { callJeeves } from '@/lib/jeevesClient';

// PT Room categories for Jeopardy
export const JEOPARDY_CATEGORIES = [
  { id: 'story', name: 'Story Room', description: 'Biblical narratives and their deeper meanings' },
  { id: 'sanctuary', name: 'Sanctuary Room', description: 'Tabernacle/Temple types and symbolism' },
  { id: 'connect6', name: 'Connect 6', description: 'Six-point connections across Scripture' },
  { id: 'symbols', name: 'Symbols Library', description: 'Biblical symbols and typology' },
  { id: 'christ', name: 'Christ-Centered', description: 'Christological connections throughout the Bible' },
  { id: 'freestyle', name: 'Freestyle', description: 'General Bible knowledge and application' },
  { id: 'defense', name: 'Defense Mode', description: 'Apologetics and defending the faith' },
] as const;

export type JeopardyCategory = typeof JEOPARDY_CATEGORIES[number];

export const POINT_VALUES = [100, 200, 300, 400, 500] as const;
export type PointValue = typeof POINT_VALUES[number];

export interface JeopardyTile {
  categoryId: string;
  points: PointValue;
  clue: string;
  answer: string;
  isRevealed: boolean;
  isHiddenGem: boolean; // Daily Double equivalent
  answeredBy: string | null;
  wasCorrect: boolean | null;
}

export interface JeopardyPlayer {
  id: string;
  name: string;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  categoryStats: Record<string, { correct: number; total: number }>;
}

export interface FinalRoundState {
  question: string;
  wagers: Record<string, number>;
  answers: Record<string, string>;
  results: Record<string, { correct: boolean; points: number }>;
  revealed: boolean;
}

type GamePhase = 'setup' | 'board' | 'clue' | 'answering' | 'judging' | 'result' | 'final_wager' | 'final_answer' | 'final_result' | 'debrief';

export interface JeopardyGameState {
  phase: GamePhase;
  categories: JeopardyCategory[];
  board: Record<string, JeopardyTile>;
  players: JeopardyPlayer[];
  currentTile: JeopardyTile | null;
  currentPlayerIndex: number;
  currentAnswer: string;
  timerSeconds: number;
  finalRound: FinalRoundState | null;
  tilesRemaining: number;
  judgmentResult: { correct: boolean; explanation: string; scriptureBonus: boolean; ptPrincipleBonus: boolean; christBonus: boolean } | null;
}

function getRandomCategories(count: number): JeopardyCategory[] {
  const shuffled = [...JEOPARDY_CATEGORIES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateBoardKey(categoryId: string, points: PointValue): string {
  return `${categoryId}-${points}`;
}

export function useJeopardyGame() {
  const [state, setState] = useState<JeopardyGameState>({
    phase: 'setup',
    categories: [],
    board: {},
    players: [],
    currentTile: null,
    currentPlayerIndex: 0,
    currentAnswer: '',
    timerSeconds: 30,
    finalRound: null,
    tilesRemaining: 0,
    judgmentResult: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Initialize game with player names
  const startGame = useCallback(async (playerNames: string[]) => {
    setIsLoading(true);
    try {
      const categories = getRandomCategories(6);
      const players: JeopardyPlayer[] = playerNames.map((name, idx) => ({
        id: `player-${idx}`,
        name,
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        categoryStats: {},
      }));

      // Determine Hidden Gem tiles (1-2 per game)
      const hiddenGemCount = Math.random() > 0.5 ? 2 : 1;
      const allKeys = categories.flatMap(cat => POINT_VALUES.map(p => generateBoardKey(cat.id, p)));
      const shuffledKeys = [...allKeys].sort(() => Math.random() - 0.5);
      const hiddenGemKeys = new Set(shuffledKeys.slice(0, hiddenGemCount));

      // Build initial board (clues generated on demand)
      const board: Record<string, JeopardyTile> = {};
      for (const cat of categories) {
        for (const points of POINT_VALUES) {
          const key = generateBoardKey(cat.id, points);
          board[key] = {
            categoryId: cat.id,
            points,
            clue: '',
            answer: '',
            isRevealed: false,
            isHiddenGem: hiddenGemKeys.has(key),
            answeredBy: null,
            wasCorrect: null,
          };
        }
      }

      setState({
        phase: 'board',
        categories,
        board,
        players,
        currentTile: null,
        currentPlayerIndex: 0,
        currentAnswer: '',
        timerSeconds: 30,
        finalRound: null,
        tilesRemaining: allKeys.length,
        judgmentResult: null,
      });
    } catch (err) {
      toast.error('Failed to start game');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Select a tile and generate question via Jeeves
  const selectTile = useCallback(async (categoryId: string, points: PointValue) => {
    const key = generateBoardKey(categoryId, points);
    const tile = state.board[key];
    if (!tile || tile.isRevealed) return;

    setIsLoading(true);
    try {
      const category = state.categories.find(c => c.id === categoryId);
      const difficultyLabel = points <= 200 ? 'easy' : points <= 400 ? 'medium' : 'hard';

      // Generate question via Jeeves
      const { data, error } = await callJeeves({
        mode: 'jeopardy_question',
        message: `Generate a Jeopardy-style clue and answer for the category "${category?.name || categoryId}" (${category?.description || ''}). Difficulty: ${difficultyLabel} (${points} points). The clue should be phrased as a statement (the answer should be phrased as "What is..."). Return JSON: {"clue": "...", "answer": "..."}`,
        category: category?.name,
        difficulty: difficultyLabel,
        points,
      }, 'pt-jeopardy');

      let clue = `${category?.name} question for ${points} points`;
      let answer = 'Answer not available';

      if (data) {
        try {
          const parsed = typeof data === 'string' ? JSON.parse(data) : data;
          const responseText = parsed.response || parsed.message || (typeof parsed === 'string' ? parsed : JSON.stringify(parsed));

          // Try to extract JSON from response
          const jsonMatch = responseText.match(/\{[\s\S]*"clue"[\s\S]*"answer"[\s\S]*\}/);
          if (jsonMatch) {
            const questionData = JSON.parse(jsonMatch[0]);
            clue = questionData.clue || clue;
            answer = questionData.answer || answer;
          } else {
            clue = responseText;
          }
        } catch {
          clue = typeof data === 'string' ? data : JSON.stringify(data);
        }
      }

      const updatedTile: JeopardyTile = { ...tile, clue, answer, isRevealed: true };

      setState(prev => ({
        ...prev,
        phase: tile.isHiddenGem ? 'clue' : 'clue',
        board: { ...prev.board, [key]: updatedTile },
        currentTile: updatedTile,
        currentAnswer: '',
        timerSeconds: 30,
        judgmentResult: null,
      }));
    } catch (err) {
      toast.error('Failed to generate question');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [state.board, state.categories]);

  // Submit answer for judging
  const submitAnswer = useCallback(async (answer: string) => {
    if (!state.currentTile) return;

    setIsLoading(true);
    setState(prev => ({ ...prev, phase: 'judging', currentAnswer: answer }));

    try {
      const { data } = await callJeeves({
        mode: 'jeopardy_judge',
        message: `Judge this Jeopardy answer. Clue: "${state.currentTile.clue}". Expected answer: "${state.currentTile.answer}". Player's answer: "${answer}". Is it correct or close enough? Also check: 1) Did they cite specific Scripture? 2) Did they reference a PT Principle? 3) Did they make a Christ connection? Return JSON: {"correct": true/false, "explanation": "...", "scriptureBonus": true/false, "ptPrincipleBonus": true/false, "christBonus": true/false}`,
        clue: state.currentTile.clue,
        expectedAnswer: state.currentTile.answer,
        playerAnswer: answer,
      }, 'pt-jeopardy');

      let result = { correct: false, explanation: 'Could not judge answer', scriptureBonus: false, ptPrincipleBonus: false, christBonus: false };

      if (data) {
        try {
          const parsed = typeof data === 'string' ? JSON.parse(data) : data;
          const responseText = parsed.response || parsed.message || (typeof parsed === 'string' ? parsed : JSON.stringify(parsed));
          const jsonMatch = responseText.match(/\{[\s\S]*"correct"[\s\S]*\}/);
          if (jsonMatch) {
            result = { ...result, ...JSON.parse(jsonMatch[0]) };
          }
        } catch {
          // Keep default
        }
      }

      // Calculate points
      const currentPlayer = state.players[state.currentPlayerIndex];
      const basePoints = state.currentTile.points;
      const hiddenGemMultiplier = state.currentTile.isHiddenGem ? 2 : 1;
      let totalPoints = result.correct ? basePoints * hiddenGemMultiplier : -basePoints;
      if (result.correct) {
        if (result.scriptureBonus) totalPoints += 25;
        if (result.ptPrincipleBonus) totalPoints += 50;
        if (result.christBonus) totalPoints += 25;
      }

      const key = generateBoardKey(state.currentTile.categoryId, state.currentTile.points);

      setState(prev => {
        const updatedPlayers = [...prev.players];
        const player = { ...updatedPlayers[prev.currentPlayerIndex] };
        player.score += totalPoints;
        if (result.correct) {
          player.correctAnswers += 1;
        } else {
          player.wrongAnswers += 1;
        }
        // Track category stats
        const catStats = player.categoryStats[state.currentTile!.categoryId] || { correct: 0, total: 0 };
        catStats.total += 1;
        if (result.correct) catStats.correct += 1;
        player.categoryStats = { ...player.categoryStats, [state.currentTile!.categoryId]: catStats };
        updatedPlayers[prev.currentPlayerIndex] = player;

        return {
          ...prev,
          phase: 'result',
          players: updatedPlayers,
          board: {
            ...prev.board,
            [key]: { ...prev.board[key], answeredBy: currentPlayer.id, wasCorrect: result.correct },
          },
          judgmentResult: result,
          tilesRemaining: prev.tilesRemaining - 1,
        };
      });
    } catch (err) {
      toast.error('Failed to judge answer');
      console.error(err);
      setState(prev => ({ ...prev, phase: 'board' }));
    } finally {
      setIsLoading(false);
    }
  }, [state.currentTile, state.players, state.currentPlayerIndex]);

  // Skip / time out
  const skipQuestion = useCallback(() => {
    if (!state.currentTile) return;

    const key = generateBoardKey(state.currentTile.categoryId, state.currentTile.points);

    setState(prev => ({
      ...prev,
      phase: 'result',
      board: { ...prev.board, [key]: { ...prev.board[key], answeredBy: null, wasCorrect: false } },
      judgmentResult: { correct: false, explanation: `Time's up! The answer was: ${state.currentTile?.answer}`, scriptureBonus: false, ptPrincipleBonus: false, christBonus: false },
      tilesRemaining: prev.tilesRemaining - 1,
    }));
  }, [state.currentTile]);

  // Return to board (next player's turn)
  const returnToBoard = useCallback(() => {
    // Check if final round
    if (state.tilesRemaining <= 0) {
      startFinalRound();
      return;
    }

    setState(prev => ({
      ...prev,
      phase: 'board',
      currentTile: null,
      currentAnswer: '',
      currentPlayerIndex: (prev.currentPlayerIndex + 1) % prev.players.length,
      judgmentResult: null,
    }));
  }, [state.tilesRemaining]);

  // Final round - "Forge a Weapon"
  const startFinalRound = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await callJeeves({
        mode: 'jeopardy_final',
        message: 'Generate a final "Forge a Weapon" Jeopardy question. This should be an open-ended theological question that requires deep scriptural reasoning and application of PT principles. Return JSON: {"question": "..."}',
      }, 'pt-jeopardy');

      let question = 'How does the entire Sanctuary system point to the plan of salvation through Christ?';
      if (data) {
        try {
          const parsed = typeof data === 'string' ? JSON.parse(data) : data;
          const responseText = parsed.response || parsed.message || '';
          const jsonMatch = responseText.match(/\{[\s\S]*"question"[\s\S]*\}/);
          if (jsonMatch) {
            question = JSON.parse(jsonMatch[0]).question || question;
          }
        } catch { /* keep default */ }
      }

      setState(prev => ({
        ...prev,
        phase: 'final_wager',
        finalRound: {
          question,
          wagers: {},
          answers: {},
          results: {},
          revealed: false,
        },
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Set final wager
  const setFinalWager = useCallback((playerId: string, wager: number) => {
    setState(prev => {
      if (!prev.finalRound) return prev;
      const wagers = { ...prev.finalRound.wagers, [playerId]: wager };
      const allWagered = prev.players.every(p => wagers[p.id] !== undefined);
      return {
        ...prev,
        phase: allWagered ? 'final_answer' : 'final_wager',
        finalRound: { ...prev.finalRound, wagers },
      };
    });
  }, []);

  // Submit final answer
  const submitFinalAnswer = useCallback((playerId: string, answer: string) => {
    setState(prev => {
      if (!prev.finalRound) return prev;
      const answers = { ...prev.finalRound.answers, [playerId]: answer };
      const allAnswered = prev.players.every(p => answers[p.id] !== undefined);
      return {
        ...prev,
        finalRound: { ...prev.finalRound, answers },
        phase: allAnswered ? 'final_result' : 'final_answer',
      };
    });
  }, []);

  // Judge final answers
  const judgeFinalAnswers = useCallback(async () => {
    if (!state.finalRound) return;
    setIsLoading(true);

    try {
      const results: Record<string, { correct: boolean; points: number }> = {};

      for (const player of state.players) {
        const answer = state.finalRound.answers[player.id] || '';
        const wager = state.finalRound.wagers[player.id] || 0;

        const { data } = await callJeeves({
          mode: 'jeopardy_judge',
          message: `Judge this Final Jeopardy answer. Question: "${state.finalRound.question}". Player's answer: "${answer}". Is it a strong, theologically sound response? Return JSON: {"correct": true/false, "explanation": "..."}`,
          question: state.finalRound.question,
          playerAnswer: answer,
        }, 'pt-jeopardy');

        let correct = false;
        if (data) {
          try {
            const parsed = typeof data === 'string' ? JSON.parse(data) : data;
            const responseText = parsed.response || parsed.message || '';
            const jsonMatch = responseText.match(/\{[\s\S]*"correct"[\s\S]*\}/);
            if (jsonMatch) {
              correct = JSON.parse(jsonMatch[0]).correct;
            }
          } catch { /* keep false */ }
        }

        results[player.id] = {
          correct,
          points: correct ? wager : -wager,
        };
      }

      setState(prev => {
        const updatedPlayers = prev.players.map(p => ({
          ...p,
          score: p.score + (results[p.id]?.points || 0),
        }));

        return {
          ...prev,
          players: updatedPlayers,
          finalRound: prev.finalRound ? { ...prev.finalRound, results, revealed: true } : null,
        };
      });
    } catch (err) {
      toast.error('Failed to judge final answers');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [state.finalRound, state.players]);

  // Go to debrief
  const goToDebrief = useCallback(() => {
    setState(prev => ({ ...prev, phase: 'debrief' }));
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    setState({
      phase: 'setup',
      categories: [],
      board: {},
      players: [],
      currentTile: null,
      currentPlayerIndex: 0,
      currentAnswer: '',
      timerSeconds: 30,
      finalRound: null,
      tilesRemaining: 0,
      judgmentResult: null,
    });
  }, []);

  return {
    state,
    isLoading,
    startGame,
    selectTile,
    submitAnswer,
    skipQuestion,
    returnToBoard,
    setFinalWager,
    submitFinalAnswer,
    judgeFinalAnswers,
    goToDebrief,
    resetGame,
  };
}
