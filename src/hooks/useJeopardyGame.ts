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

// Fallback question bank so the game always works even if Jeeves is unavailable
const FALLBACK_QUESTIONS: Record<string, { clue: string; answer: string }[]> = {
  story: [
    { clue: 'This patriarch was asked to sacrifice his son on Mount Moriah, foreshadowing Christ as the Lamb of God.', answer: 'Who is Abraham?' },
    { clue: 'After this prophet was swallowed by a great fish, he spent three days inside — a type of Christ\'s burial and resurrection.', answer: 'Who is Jonah?' },
    { clue: 'This deliverer led Israel through the Red Sea on dry ground, typifying baptism and deliverance through Christ.', answer: 'Who is Moses?' },
    { clue: 'This shepherd boy defeated a giant with a sling and a stone, prefiguring Christ conquering sin.', answer: 'Who is David?' },
    { clue: 'This patriarch\'s coat of many colors and betrayal by his brothers foreshadows Christ\'s rejection and exaltation.', answer: 'Who is Joseph?' },
  ],
  sanctuary: [
    { clue: 'This piece of sanctuary furniture held the Ten Commandments, Aaron\'s rod, and a pot of manna.', answer: 'What is the Ark of the Covenant?' },
    { clue: 'The blood of the sacrifice was first applied here, representing initial confession and repentance.', answer: 'What is the Altar of Burnt Offering?' },
    { clue: 'This veil separated the Holy Place from the Most Holy Place and was torn at Christ\'s crucifixion.', answer: 'What is the inner veil (second curtain)?' },
    { clue: 'This golden fixture with seven branches provided the only light in the Holy Place, representing Christ as the Light of the World.', answer: 'What is the Lampstand (Menorah)?' },
    { clue: 'On this annual day the High Priest entered the Most Holy Place to cleanse the sanctuary from the accumulated sins of the people.', answer: 'What is the Day of Atonement (Yom Kippur)?' },
  ],
  connect6: [
    { clue: 'Name the six days of Creation in Genesis 1 — each one reveals a layer of God\'s redemptive design.', answer: 'What are Light, Firmament, Land/Vegetation, Luminaries, Sea/Air creatures, Land creatures/Man?' },
    { clue: 'This letter to the churches in Revelation 2-3 addresses seven churches; name the first and last.', answer: 'What are Ephesus and Laodicea?' },
    { clue: 'Isaiah 11:2 lists attributes of the Spirit resting on the Messiah. Name three.', answer: 'What are wisdom, understanding, counsel, might, knowledge, fear of the Lord?' },
    { clue: 'The armor of God in Ephesians 6 includes this piece that protects the heart.', answer: 'What is the breastplate of righteousness?' },
    { clue: 'Jesus spoke seven last words from the cross. The final one in John 19:30 was this Greek word meaning "paid in full."', answer: 'What is Tetelestai (It is finished)?' },
  ],
  symbols: [
    { clue: 'In Daniel 7, this metal-and-clay mixture in the statue\'s feet represents a divided kingdom.', answer: 'What is iron mixed with clay?' },
    { clue: 'This symbol in Revelation 12 represents God\'s people — clothed with the sun, moon under her feet, crown of twelve stars.', answer: 'What is the Woman?' },
    { clue: 'In biblical typology, leaven consistently represents this spiritual concept.', answer: 'What is sin (or false doctrine)?' },
    { clue: 'The bronze serpent lifted up by Moses in the wilderness was a type of this New Testament event.', answer: 'What is Christ lifted up on the cross?' },
    { clue: 'In Revelation, the number 666 is identified as this.', answer: 'What is the number of the beast (number of a man)?' },
  ],
  christ: [
    { clue: 'Hebrews 4:14-15 calls Jesus this title, emphasizing He can sympathize with our weaknesses.', answer: 'What is our Great High Priest?' },
    { clue: 'In John 15, Jesus uses this agricultural metaphor to describe the believer\'s dependence on Him.', answer: 'What is the Vine and branches?' },
    { clue: 'Colossians 1:15 calls Christ this, meaning He is the visible representation of the invisible God.', answer: 'What is the image of the invisible God?' },
    { clue: 'This title used in Revelation 5 emphasizes Christ\'s sacrificial and kingly role simultaneously.', answer: 'What is the Lamb (who was slain)?' },
    { clue: 'In Isaiah 9:6, the Messiah is given four names. Name the one that declares His deity.', answer: 'What is Mighty God (or Everlasting Father)?' },
  ],
  freestyle: [
    { clue: 'This Old Testament book never mentions God by name yet powerfully demonstrates His providence.', answer: 'What is Esther?' },
    { clue: 'Paul wrote this prison epistle focused on joy, containing the famous "I can do all things through Christ" verse.', answer: 'What is Philippians?' },
    { clue: 'This is the shortest verse in the Bible (in English), found in John 11:35.', answer: 'What is "Jesus wept"?' },
    { clue: 'The Bereans in Acts 17:11 were commended for doing this daily with the Scriptures.', answer: 'What is searching/examining the Scriptures?' },
    { clue: 'This prophet was told to marry an unfaithful wife as a living parable of God\'s love for wayward Israel.', answer: 'Who is Hosea?' },
  ],
  defense: [
    { clue: 'This common objection says a good God cannot coexist with evil — yet the Bible frames suffering within this larger narrative.', answer: 'What is the Great Controversy (Problem of Evil)?' },
    { clue: 'Critics claim the Bible was assembled by council vote. This early church event is often mistakenly credited with "choosing" the biblical canon.', answer: 'What is the Council of Nicaea?' },
    { clue: 'When skeptics claim the resurrection was invented, this minimal-facts argument uses only data that critical scholars accept.', answer: 'What is the minimal facts approach (Habermas)?' },
    { clue: 'This apologetic approach starts with Scripture\'s self-attestation rather than neutral evidence to defend the faith.', answer: 'What is presuppositional apologetics?' },
    { clue: 'The claim that "science disproves God" commits this logical fallacy by assuming only material explanations are valid.', answer: 'What is scientism (or the category error/begging the question)?' },
  ],
};

function getRandomCategories(count: number): JeopardyCategory[] {
  const shuffled = [...JEOPARDY_CATEGORIES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function getFallbackQuestion(categoryId: string, points: number): { clue: string; answer: string } {
  const questions = FALLBACK_QUESTIONS[categoryId] || FALLBACK_QUESTIONS.freestyle;
  // Use points to pick different questions (100=0, 200=1, etc.)
  const idx = Math.floor((points / 100) - 1) % questions.length;
  return questions[idx];
}

function generateBoardKey(categoryId: string, points: PointValue): string {
  return `${categoryId}-${points}`;
}

function normalizeJeopardyAnswer(value: string): string {
  return value
    .toLowerCase()
    .replace(/^(what|who|where|when|why|how)\s+(is|are|was|were)\s+(the\s+|a\s+|an\s+)?/i, '')
    .replace(/[^\w\s&/,-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isLikelyCorrectAnswer(expected: string, player: string): boolean {
  const expectedNorm = normalizeJeopardyAnswer(expected);
  const playerNorm = normalizeJeopardyAnswer(player);

  if (!expectedNorm || !playerNorm) return false;
  if (expectedNorm === playerNorm) return true;
  if (expectedNorm.includes(playerNorm) || playerNorm.includes(expectedNorm)) return true;

  const splitParts = (value: string) =>
    value
      .split(/\s*(?:,|and|&|\/)\s*/)
      .map((part) => part.trim())
      .filter(Boolean);

  const expectedParts = splitParts(expectedNorm);
  const playerParts = splitParts(playerNorm);

  if (expectedParts.length > 1) {
    return expectedParts.every((part) =>
      playerParts.some((playerPart) => playerPart.includes(part) || part.includes(playerPart))
    );
  }

  return false;
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

      // Start with fallback questions so game always works
      const fallback = getFallbackQuestion(categoryId, points);
      let clue = fallback.clue;
      let answer = fallback.answer;

      if (data) {
        try {
          // Handle various response shapes from Jeeves
          const parsed = typeof data === 'string' ? JSON.parse(data) : data;
          // Server may return {clue, answer} directly
          if (parsed.clue) {
            clue = parsed.clue;
            answer = parsed.answer || answer;
          } else {
            // Try extracting from various response shapes
            const responseText = parsed?.response || parsed?.message || parsed?.text || parsed?.data?.response || parsed?.data?.text || (typeof parsed === 'string' ? parsed : '');
            if (responseText) {
              const jsonMatch = responseText.match(/\{[\s\S]*?"clue"[\s\S]*?"answer"[\s\S]*?\}/);
              if (jsonMatch) {
                const questionData = JSON.parse(jsonMatch[0]);
                if (questionData.clue && questionData.answer) {
                  clue = questionData.clue;
                  answer = questionData.answer;
                }
              }
            }
          }
        } catch {
          // Keep fallback question
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
      const { data, error } = await callJeeves({
        mode: 'jeopardy_judge',
        message: `Judge this Jeopardy answer. Clue: "${state.currentTile.clue}". Expected answer: "${state.currentTile.answer}". Player's answer: "${answer}". Is it correct or close enough? Also check: 1) Did they cite specific Scripture? 2) Did they reference a PT Principle? 3) Did they make a Christ connection? Return JSON: {"correct": true/false, "explanation": "...", "scriptureBonus": true/false, "ptPrincipleBonus": true/false, "christBonus": true/false}`,
        clue: state.currentTile.clue,
        expectedAnswer: state.currentTile.answer,
        playerAnswer: answer,
      }, 'pt-jeopardy');

      let result = { correct: false, explanation: 'Could not judge answer', scriptureBonus: false, ptPrincipleBonus: false, christBonus: false };

      if (error) {
        console.warn('Jeopardy judge error, using local fallback:', error.message);
      }

      if (data) {
        try {
          const parsed = typeof data === 'string' ? JSON.parse(data) : (data as Record<string, any>);
          // Server may return judgment either directly or nested under data
          if (parsed?.correct !== undefined) {
            result = { ...result, ...parsed };
          } else if (parsed?.data?.correct !== undefined) {
            result = { ...result, ...parsed.data };
          } else {
            const responseText = parsed?.response || parsed?.message || (typeof parsed === 'string' ? parsed : JSON.stringify(parsed));
            const jsonMatch = responseText.match(/\{[\s\S]*"correct"[\s\S]*\}/);
            if (jsonMatch) {
              const extracted = JSON.parse(jsonMatch[0]);
              if (extracted?.correct !== undefined) {
                result = { ...result, ...extracted };
              }
            }
          }
        } catch {
          // Keep default and use local fallback below
        }
      }

      if (result.explanation === 'Could not judge answer') {
        const localCorrect = isLikelyCorrectAnswer(state.currentTile.answer, answer);
        result = {
          ...result,
          correct: localCorrect,
          explanation: localCorrect ? 'Answer accepted (local match).' : 'Answer did not match expected answer.',
        };
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
