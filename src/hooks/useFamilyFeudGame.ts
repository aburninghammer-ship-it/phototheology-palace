// PT Family Feud Game Hook
// Team-based theological training with survey answers, Defense Mode, and Forge a Weapon

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { callJeeves } from '@/lib/jeevesClient';

// PT Room aligned categories
export const FEUD_CATEGORIES = [
  { id: 'story', name: 'Story Room', prompt: 'Bible stories, narratives, and character-based questions' },
  { id: 'sanctuary', name: 'Sanctuary Room', prompt: 'Tabernacle, Temple, and sanctuary-related questions' },
  { id: 'connect6', name: 'Connect 6', prompt: 'Connections and parallels across Scripture' },
  { id: 'symbols', name: 'Symbols Library', prompt: 'Biblical symbols, types, and metaphors' },
  { id: 'christ', name: 'Christ-Centered', prompt: 'Christological connections throughout the Bible' },
  { id: 'defense', name: 'Defense Mode', prompt: 'Apologetics, defending doctrine, and forging theological weapons' },
] as const;

export type FeudCategory = typeof FEUD_CATEGORIES[number];

export interface SurveyAnswer {
  text: string;
  points: number; // Higher = more popular/important answer
  revealed: boolean;
}

export interface FeudRound {
  category: FeudCategory;
  question: string;
  answers: SurveyAnswer[];
  isDefenseMode: boolean;
  defensePrompt?: string; // For defense mode: the argument to respond to
}

export interface FeudTeam {
  id: string;
  name: string;
  players: string[];
  score: number;
  strikes: number;
  roundsWon: number;
}

export interface ForgeWeaponRound {
  question: string;
  teamAnswers: Record<string, string>;
  teamScores: Record<string, number>;
  revealed: boolean;
}

type GamePhase = 'setup' | 'faceoff' | 'playing' | 'defense_response' | 'steal' | 'round_result' | 'forge_weapon' | 'forge_result' | 'debrief';

export interface FeudGameState {
  phase: GamePhase;
  teams: [FeudTeam, FeudTeam];
  rounds: FeudRound[];
  currentRoundIndex: number;
  currentTeamIndex: number; // 0 or 1
  currentPlayerIndex: number; // Within the team
  revealedCount: number;
  currentGuess: string;
  forgeWeapon: ForgeWeaponRound | null;
  totalRounds: number;
}

export function useFamilyFeudGame() {
  const [state, setState] = useState<FeudGameState>({
    phase: 'setup',
    teams: [
      { id: 'team-1', name: 'Team 1', players: [], score: 0, strikes: 0, roundsWon: 0 },
      { id: 'team-2', name: 'Team 2', players: [], score: 0, strikes: 0, roundsWon: 0 },
    ],
    rounds: [],
    currentRoundIndex: 0,
    currentTeamIndex: 0,
    currentPlayerIndex: 0,
    revealedCount: 0,
    currentGuess: '',
    forgeWeapon: null,
    totalRounds: 5,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Generate survey answers via Jeeves
  const generateRound = useCallback(async (category: FeudCategory, isDefense: boolean): Promise<FeudRound | null> => {
    try {
      const prompt = isDefense
        ? `For a Family Feud-style game in Defense Mode (apologetics), generate a question like "Name a common argument against [doctrine]" and provide 6 ranked survey answers. Also include a "defensePrompt" — the specific theological argument the team must respond to. Return JSON: {"question": "...", "defensePrompt": "...", "answers": [{"text": "...", "points": 40}, {"text": "...", "points": 30}, ...]}`
        : `For a Family Feud-style Bible game in the category "${category.name}" (${category.prompt}), generate a question and 6 ranked survey answers. Top answers should be worth more points (e.g. 40, 30, 20, 15, 10, 5). Return JSON: {"question": "...", "answers": [{"text": "...", "points": 40}, ...]}`;

      const { data } = await callJeeves({
        mode: 'family_feud_round',
        message: prompt,
        category: category.name,
        isDefense,
      }, 'pt-family-feud');

      let question = `Name something from ${category.name}`;
      let answers: SurveyAnswer[] = [];
      let defensePrompt: string | undefined;

      if (data) {
        try {
          const parsed = typeof data === 'string' ? JSON.parse(data) : data;
          const responseText = parsed.response || parsed.message || (typeof parsed === 'string' ? parsed : JSON.stringify(parsed));
          const jsonMatch = responseText.match(/\{[\s\S]*"question"[\s\S]*"answers"[\s\S]*\}/);
          if (jsonMatch) {
            const roundData = JSON.parse(jsonMatch[0]);
            question = roundData.question || question;
            defensePrompt = roundData.defensePrompt;
            answers = (roundData.answers || []).map((a: any) => ({
              text: a.text,
              points: a.points || 10,
              revealed: false,
            }));
          }
        } catch { /* use defaults */ }
      }

      // Ensure we have at least some answers
      if (answers.length === 0) {
        answers = [
          { text: 'Answer 1', points: 40, revealed: false },
          { text: 'Answer 2', points: 30, revealed: false },
          { text: 'Answer 3', points: 20, revealed: false },
          { text: 'Answer 4', points: 15, revealed: false },
          { text: 'Answer 5', points: 10, revealed: false },
          { text: 'Answer 6', points: 5, revealed: false },
        ];
      }

      return {
        category,
        question,
        answers: answers.sort((a, b) => b.points - a.points),
        isDefenseMode: isDefense,
        defensePrompt,
      };
    } catch (err) {
      console.error('Error generating round:', err);
      return null;
    }
  }, []);

  // Start game
  const startGame = useCallback(async (team1Name: string, team1Players: string[], team2Name: string, team2Players: string[]) => {
    setIsLoading(true);
    try {
      // Select categories and generate rounds
      const shuffledCategories = [...FEUD_CATEGORIES].sort(() => Math.random() - 0.5);
      const roundCount = 5;
      const rounds: FeudRound[] = [];

      for (let i = 0; i < roundCount; i++) {
        const cat = shuffledCategories[i % shuffledCategories.length];
        const isDefense = i === roundCount - 2; // Second-to-last round is defense
        const round = await generateRound(cat, isDefense);
        if (round) rounds.push(round);
      }

      if (rounds.length === 0) {
        toast.error('Failed to generate questions');
        return;
      }

      setState({
        phase: 'faceoff',
        teams: [
          { id: 'team-1', name: team1Name, players: team1Players, score: 0, strikes: 0, roundsWon: 0 },
          { id: 'team-2', name: team2Name, players: team2Players, score: 0, strikes: 0, roundsWon: 0 },
        ],
        rounds,
        currentRoundIndex: 0,
        currentTeamIndex: 0,
        currentPlayerIndex: 0,
        revealedCount: 0,
        currentGuess: '',
        forgeWeapon: null,
        totalRounds: rounds.length,
      });
    } catch (err) {
      toast.error('Failed to start game');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [generateRound]);

  // Start playing (after face-off)
  const startRound = useCallback((winningTeamIndex: number) => {
    setState(prev => ({
      ...prev,
      phase: 'playing',
      currentTeamIndex: winningTeamIndex,
      currentPlayerIndex: 0,
      revealedCount: 0,
      currentGuess: '',
      teams: prev.teams.map((t, idx) => ({ ...t, strikes: 0 })) as [FeudTeam, FeudTeam],
    }));
  }, []);

  // Submit guess
  const submitGuess = useCallback(async (guess: string) => {
    if (!guess.trim()) return;

    const currentRound = state.rounds[state.currentRoundIndex];
    if (!currentRound) return;

    setIsLoading(true);

    try {
      // Use Jeeves to judge if guess matches any unrevealed answer
      const unrevealedAnswers = currentRound.answers.filter(a => !a.revealed);
      const { data } = await callJeeves({
        mode: 'family_feud_judge',
        message: `In Family Feud, the question is: "${currentRound.question}". The player guessed: "${guess}". The remaining unrevealed answers are: ${unrevealedAnswers.map(a => `"${a.text}"`).join(', ')}. Does the guess match any of these answers (exact or close enough)? Return JSON: {"matched": true/false, "matchedAnswer": "exact text of matched answer or null", "scriptureBonus": true/false}`,
        question: currentRound.question,
        guess,
        answers: unrevealedAnswers.map(a => a.text),
      }, 'pt-family-feud');

      let matched = false;
      let matchedText: string | null = null;
      let scriptureBonus = false;

      if (data) {
        try {
          const parsed = typeof data === 'string' ? JSON.parse(data) : data;
          const responseText = parsed.response || parsed.message || '';
          const jsonMatch = responseText.match(/\{[\s\S]*"matched"[\s\S]*\}/);
          if (jsonMatch) {
            const result = JSON.parse(jsonMatch[0]);
            matched = result.matched;
            matchedText = result.matchedAnswer;
            scriptureBonus = result.scriptureBonus;
          }
        } catch { /* keep defaults */ }
      }

      setState(prev => {
        const round = { ...prev.rounds[prev.currentRoundIndex] };
        const teams = [...prev.teams] as [FeudTeam, FeudTeam];
        const currentTeam = { ...teams[prev.currentTeamIndex] };
        let phase = prev.phase;
        let revealedCount = prev.revealedCount;

        if (matched && matchedText) {
          // Reveal the matched answer
          round.answers = round.answers.map(a =>
            a.text === matchedText ? { ...a, revealed: true } : a
          );
          const matchedAnswer = round.answers.find(a => a.text === matchedText);
          const points = (matchedAnswer?.points || 10) + (scriptureBonus ? 25 : 0);
          currentTeam.score += points;
          revealedCount += 1;

          // Check if all answers revealed
          if (round.answers.every(a => a.revealed)) {
            phase = 'round_result';
            currentTeam.roundsWon += 1;
          }
        } else {
          // Strike!
          currentTeam.strikes += 1;

          if (currentTeam.strikes >= 3) {
            // Other team gets to steal
            phase = 'steal';
          }
        }

        teams[prev.currentTeamIndex] = currentTeam;

        const updatedRounds = [...prev.rounds];
        updatedRounds[prev.currentRoundIndex] = round;

        return {
          ...prev,
          phase,
          rounds: updatedRounds,
          teams,
          revealedCount,
          currentGuess: '',
          currentPlayerIndex: (prev.currentPlayerIndex + 1) % currentTeam.players.length,
        };
      });
    } catch (err) {
      toast.error('Failed to judge guess');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [state.rounds, state.currentRoundIndex]);

  // Steal attempt
  const attemptSteal = useCallback(async (guess: string) => {
    if (!guess.trim()) return;

    // Similar to submitGuess but for the other team
    const currentRound = state.rounds[state.currentRoundIndex];
    if (!currentRound) return;

    setIsLoading(true);
    try {
      const unrevealedAnswers = currentRound.answers.filter(a => !a.revealed);
      const { data } = await callJeeves({
        mode: 'family_feud_judge',
        message: `In Family Feud steal attempt, the question is: "${currentRound.question}". The player guessed: "${guess}". Unrevealed answers: ${unrevealedAnswers.map(a => `"${a.text}"`).join(', ')}. Does the guess match the #1 unrevealed answer? Return JSON: {"matched": true/false, "matchedAnswer": "..."}`,
        question: currentRound.question,
        guess,
        answers: unrevealedAnswers.map(a => a.text),
      }, 'pt-family-feud');

      let matched = false;

      if (data) {
        try {
          const parsed = typeof data === 'string' ? JSON.parse(data) : data;
          const responseText = parsed.response || parsed.message || '';
          const jsonMatch = responseText.match(/\{[\s\S]*"matched"[\s\S]*\}/);
          if (jsonMatch) {
            matched = JSON.parse(jsonMatch[0]).matched;
          }
        } catch { /* keep false */ }
      }

      setState(prev => {
        const teams = [...prev.teams] as [FeudTeam, FeudTeam];
        const stealingTeamIndex = prev.currentTeamIndex === 0 ? 1 : 0;
        const stealingTeam = { ...teams[stealingTeamIndex] };

        if (matched) {
          // Steal successful — get all remaining points
          const round = prev.rounds[prev.currentRoundIndex];
          const remainingPoints = round.answers.filter(a => !a.revealed).reduce((sum, a) => sum + a.points, 0);
          stealingTeam.score += remainingPoints;
          stealingTeam.roundsWon += 1;
        } else {
          // Steal failed — points go to original team
          const playingTeam = { ...teams[prev.currentTeamIndex] };
          const round = prev.rounds[prev.currentRoundIndex];
          const remainingPoints = round.answers.filter(a => !a.revealed).reduce((sum, a) => sum + a.points, 0);
          playingTeam.score += remainingPoints;
          playingTeam.roundsWon += 1;
          teams[prev.currentTeamIndex] = playingTeam;
        }

        teams[stealingTeamIndex] = stealingTeam;

        // Reveal all answers
        const updatedRounds = [...prev.rounds];
        updatedRounds[prev.currentRoundIndex] = {
          ...updatedRounds[prev.currentRoundIndex],
          answers: updatedRounds[prev.currentRoundIndex].answers.map(a => ({ ...a, revealed: true })),
        };

        return {
          ...prev,
          phase: 'round_result',
          teams,
          rounds: updatedRounds,
        };
      });
    } catch (err) {
      toast.error('Failed to judge steal');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [state.rounds, state.currentRoundIndex]);

  // Next round
  const nextRound = useCallback(() => {
    setState(prev => {
      const nextIndex = prev.currentRoundIndex + 1;

      // Check if game should end (go to Forge a Weapon)
      if (nextIndex >= prev.rounds.length) {
        return { ...prev, phase: 'forge_weapon' as GamePhase };
      }

      return {
        ...prev,
        phase: 'faceoff',
        currentRoundIndex: nextIndex,
        currentTeamIndex: 0,
        currentPlayerIndex: 0,
        revealedCount: 0,
        currentGuess: '',
        teams: prev.teams.map(t => ({ ...t, strikes: 0 })) as [FeudTeam, FeudTeam],
      };
    });
  }, []);

  // Start Forge a Weapon round
  const startForgeWeapon = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await callJeeves({
        mode: 'family_feud_forge',
        message: 'Generate a "Forge a Weapon" championship round question for PT Family Feud. This should be an open-ended theological question that requires teams to construct a strong scriptural argument. Return JSON: {"question": "..."}',
      }, 'pt-family-feud');

      let question = 'Using at least 3 Scripture references, explain how the sanctuary system reveals God\'s plan of salvation.';
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
        forgeWeapon: { question, teamAnswers: {}, teamScores: {}, revealed: false },
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Submit forge weapon answer
  const submitForgeAnswer = useCallback((teamId: string, answer: string) => {
    setState(prev => {
      if (!prev.forgeWeapon) return prev;
      const teamAnswers = { ...prev.forgeWeapon.teamAnswers, [teamId]: answer };
      const allSubmitted = prev.teams.every(t => teamAnswers[t.id]);
      return {
        ...prev,
        phase: allSubmitted ? 'forge_result' : prev.phase,
        forgeWeapon: { ...prev.forgeWeapon, teamAnswers },
      };
    });
  }, []);

  // Judge forge weapon
  const judgeForgeWeapon = useCallback(async () => {
    if (!state.forgeWeapon) return;
    setIsLoading(true);

    try {
      const teamScores: Record<string, number> = {};

      for (const team of state.teams) {
        const answer = state.forgeWeapon.teamAnswers[team.id] || '';
        const { data } = await callJeeves({
          mode: 'family_feud_judge_forge',
          message: `Judge this "Forge a Weapon" answer. Question: "${state.forgeWeapon.question}". Team's response: "${answer}". Score on a scale of 0-100 based on: theological depth, Scripture citations, PT principles applied, Christ-centered reasoning. Return JSON: {"score": 75, "feedback": "..."}`,
          question: state.forgeWeapon.question,
          teamAnswer: answer,
        }, 'pt-family-feud');

        let score = 50;
        if (data) {
          try {
            const parsed = typeof data === 'string' ? JSON.parse(data) : data;
            const responseText = parsed.response || parsed.message || '';
            const jsonMatch = responseText.match(/\{[\s\S]*"score"[\s\S]*\}/);
            if (jsonMatch) {
              score = JSON.parse(jsonMatch[0]).score || 50;
            }
          } catch { /* keep default */ }
        }

        teamScores[team.id] = score;
      }

      setState(prev => {
        const updatedTeams = prev.teams.map(t => ({
          ...t,
          score: t.score + (teamScores[t.id] || 0),
        })) as [FeudTeam, FeudTeam];

        return {
          ...prev,
          teams: updatedTeams,
          forgeWeapon: prev.forgeWeapon ? { ...prev.forgeWeapon, teamScores, revealed: true } : null,
        };
      });
    } catch (err) {
      toast.error('Failed to judge Forge a Weapon');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [state.forgeWeapon, state.teams]);

  // Go to debrief
  const goToDebrief = useCallback(() => {
    setState(prev => ({ ...prev, phase: 'debrief' }));
  }, []);

  // Reset
  const resetGame = useCallback(() => {
    setState({
      phase: 'setup',
      teams: [
        { id: 'team-1', name: 'Team 1', players: [], score: 0, strikes: 0, roundsWon: 0 },
        { id: 'team-2', name: 'Team 2', players: [], score: 0, strikes: 0, roundsWon: 0 },
      ],
      rounds: [],
      currentRoundIndex: 0,
      currentTeamIndex: 0,
      currentPlayerIndex: 0,
      revealedCount: 0,
      currentGuess: '',
      forgeWeapon: null,
      totalRounds: 5,
    });
  }, []);

  return {
    state,
    isLoading,
    startGame,
    startRound,
    submitGuess,
    attemptSteal,
    nextRound,
    startForgeWeapon,
    submitForgeAnswer,
    judgeForgeWeapon,
    goToDebrief,
    resetGame,
  };
}
