import { useState, useCallback, useEffect, useRef } from "react";
import { useGameMultiplayer } from "./useGameMultiplayer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export type TeamFormat = "teams" | "solo" | "pairs";
export type RoundPhase = "waiting" | "cooking" | "judging" | "elimination" | "complete";

export interface ChefTeam {
  id: string;
  name: string;
  emoji: string;
  memberIds: string[];
  memberNames: string[];
  eliminated: boolean;
  eliminatedInRound?: number;
}

export interface RoundSubmission {
  teamId: string;
  userId: string;
  selectedIngredients: string[]; // MC selections
  explanation: string; // timed free-text
  submittedAt: string;
}

export interface JudgeScore {
  accuracy: number;    // Judge Solomon
  creativity: number;  // Judge Miriam  
  christCenter: number; // Judge Paul
  completeness: number; // all judges
  total: number;
  feedback: string;
}

export interface ChefGameState {
  format: TeamFormat;
  round: number;
  maxRounds: number;
  roundPhase: RoundPhase;
  roundStartedAt: string | null;
  roundDuration: number; // seconds
  themes: string[];
  currentTheme: string;
  verses: Array<{ reference: string; text: string }>;
  ingredientOptions: string[][]; // MC options per round
  teams: ChefTeam[];
  submissions: Record<string, RoundSubmission[]>; // round -> submissions
  judgeScores: Record<string, Record<string, JudgeScore>>; // round -> teamId -> score
  eliminations: Array<{ round: number; teamId: string; teamName: string }>;
  winner: string | null;
}

const ROUND_THEMES = [
  "Salvation & Redemption",
  "The Sanctuary & Its Services",
  "Prophecy & End Times",
  "Christ in the Old Testament"
];

const TEAM_PRESETS: Array<{ name: string; emoji: string }> = [
  { name: "Team Solomon", emoji: "👑" },
  { name: "Team Elijah", emoji: "🔥" },
  { name: "Team Esther", emoji: "⭐" },
  { name: "Team Daniel", emoji: "🦁" },
];

const DEFAULT_STATE: ChefGameState = {
  format: "teams",
  round: 0,
  maxRounds: 4,
  roundPhase: "waiting",
  roundStartedAt: null,
  roundDuration: 600,
  themes: ROUND_THEMES,
  currentTheme: "",
  verses: [],
  ingredientOptions: [],
  teams: [],
  submissions: {},
  judgeScores: {},
  eliminations: [],
  winner: null,
};

export function useChefMultiplayer() {
  const { user } = useAuth();
  const multiplayer = useGameMultiplayer("chef_challenge");
  const [gameState, setGameState] = useState<ChefGameState>(DEFAULT_STATE);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [judging, setJudging] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync game state from room
  useEffect(() => {
    if (multiplayer.room?.game_state && typeof multiplayer.room.game_state === "object") {
      const state = multiplayer.room.game_state as any;
      if (state.format) {
        setGameState(state as ChefGameState);
      }
    }
  }, [multiplayer.room?.game_state]);

  // Timer logic
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (gameState.roundPhase === "cooking" && gameState.roundStartedAt) {
      const updateTimer = () => {
        const elapsed = (Date.now() - new Date(gameState.roundStartedAt!).getTime()) / 1000;
        const remaining = Math.max(0, gameState.roundDuration - elapsed);
        setTimeRemaining(Math.ceil(remaining));
        if (remaining <= 0 && multiplayer.isHost) {
          // Auto-advance to judging
          advanceToJudging();
        }
      };
      updateTimer();
      timerRef.current = setInterval(updateTimer, 1000);
    }

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameState.roundPhase, gameState.roundStartedAt, gameState.roundDuration]);

  const createTeams = useCallback((format: TeamFormat, players: typeof multiplayer.players) => {
    if (format === "solo") {
      return players.map((p, i) => ({
        id: `solo-${p.user_id}`,
        name: p.display_name,
        emoji: ["🧑‍🍳", "👨‍🍳", "👩‍🍳", "🍳", "🔪", "🍲", "🥘", "🫕"][i % 8],
        memberIds: [p.user_id],
        memberNames: [p.display_name],
        eliminated: false,
      }));
    }

    if (format === "pairs") {
      const teams: ChefTeam[] = [];
      for (let i = 0; i < players.length; i += 2) {
        const members = [players[i]];
        if (players[i + 1]) members.push(players[i + 1]);
        teams.push({
          id: `pair-${i}`,
          name: `Pair ${teams.length + 1}`,
          emoji: TEAM_PRESETS[teams.length % TEAM_PRESETS.length].emoji,
          memberIds: members.map(m => m.user_id),
          memberNames: members.map(m => m.display_name),
          eliminated: false,
        });
      }
      return teams;
    }

    // Teams format - distribute players into 4 teams
    const teamCount = Math.min(4, Math.max(2, Math.ceil(players.length / 2)));
    const teams: ChefTeam[] = Array.from({ length: teamCount }, (_, i) => ({
      id: `team-${i}`,
      name: TEAM_PRESETS[i].name,
      emoji: TEAM_PRESETS[i].emoji,
      memberIds: [],
      memberNames: [],
      eliminated: false,
    }));

    players.forEach((p, i) => {
      const teamIdx = i % teamCount;
      teams[teamIdx].memberIds.push(p.user_id);
      teams[teamIdx].memberNames.push(p.display_name);
    });

    return teams;
  }, []);

  const startGame = useCallback(async (format: TeamFormat) => {
    if (!multiplayer.isHost || !multiplayer.room) return;

    const teams = createTeams(format, multiplayer.players);
    const maxRounds = Math.min(4, teams.length); // Can't have more rounds than teams - 1

    const initialState: ChefGameState = {
      ...DEFAULT_STATE,
      format,
      maxRounds,
      teams,
    };

    await multiplayer.startGame(initialState, multiplayer.room.host_id);
    toast.success("Chef Challenge started!");
  }, [multiplayer, createTeams]);

  const startRound = useCallback(async () => {
    if (!multiplayer.isHost) return;

    const nextRound = gameState.round + 1;
    const theme = ROUND_THEMES[(nextRound - 1) % ROUND_THEMES.length];

    // Generate verses + MC ingredient options via Jeeves
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "chef_round_setup",
          theme,
          round: nextRound,
          difficulty: nextRound === 1 ? "intermediate" : nextRound === 2 ? "pro" : "master",
        }
      });

      if (error) throw error;

      const newState: ChefGameState = {
        ...gameState,
        round: nextRound,
        roundPhase: "cooking",
        roundStartedAt: new Date().toISOString(),
        currentTheme: theme,
        verses: data.verses || [],
        ingredientOptions: data.ingredientOptions || [],
      };

      await multiplayer.updateGameState(newState, undefined, "active");
    } catch (err: any) {
      toast.error("Failed to start round: " + (err.message || "Unknown error"));
    }
  }, [multiplayer, gameState]);

  const submitEntry = useCallback(async (
    selectedIngredients: string[],
    explanation: string
  ) => {
    if (!user || !multiplayer.room) return;
    setSubmitting(true);

    try {
      const myTeam = gameState.teams.find(t => t.memberIds.includes(user.id));
      if (!myTeam) throw new Error("You're not on a team");

      const roundKey = `round-${gameState.round}`;
      const submission: RoundSubmission = {
        teamId: myTeam.id,
        userId: user.id,
        selectedIngredients,
        explanation,
        submittedAt: new Date().toISOString(),
      };

      const currentSubmissions = { ...gameState.submissions };
      if (!currentSubmissions[roundKey]) currentSubmissions[roundKey] = [];
      
      // Replace existing submission from this user
      currentSubmissions[roundKey] = currentSubmissions[roundKey].filter(s => s.userId !== user.id);
      currentSubmissions[roundKey].push(submission);

      const newState = { ...gameState, submissions: currentSubmissions };
      await multiplayer.updateGameState(newState);
      toast.success("Recipe submitted! 🍽️");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  }, [user, multiplayer, gameState]);

  const advanceToJudging = useCallback(async () => {
    if (!multiplayer.isHost) return;
    const newState = { ...gameState, roundPhase: "judging" as RoundPhase };
    await multiplayer.updateGameState(newState);
  }, [multiplayer, gameState]);

  const runJudging = useCallback(async () => {
    if (!multiplayer.isHost) return;
    setJudging(true);

    try {
      const roundKey = `round-${gameState.round}`;
      const roundSubmissions = gameState.submissions[roundKey] || [];
      const activeTeams = gameState.teams.filter(t => !t.eliminated);

      // Build team submissions map
      const teamSubmissions: Record<string, RoundSubmission[]> = {};
      for (const sub of roundSubmissions) {
        if (!teamSubmissions[sub.teamId]) teamSubmissions[sub.teamId] = [];
        teamSubmissions[sub.teamId].push(sub);
      }

      // Call Jeeves to judge each team
      const scores: Record<string, JudgeScore> = {};

      for (const team of activeTeams) {
        const subs = teamSubmissions[team.id] || [];
        const combinedExplanation = subs.map(s => 
          `Ingredients: ${s.selectedIngredients.join(", ")}\nExplanation: ${s.explanation}`
        ).join("\n---\n") || "No submission";

        const { data, error } = await supabase.functions.invoke("jeeves", {
          body: {
            mode: "chef_judge",
            theme: gameState.currentTheme,
            verses: gameState.verses,
            teamName: team.name,
            submission: combinedExplanation,
            round: gameState.round,
          }
        });

        if (error) {
          console.error("Judging error for team", team.name, error);
          scores[team.id] = { accuracy: 5, creativity: 5, christCenter: 5, completeness: 5, total: 20, feedback: "Judging error" };
        } else {
          scores[team.id] = data as JudgeScore;
        }
      }

      // Find lowest scorer for elimination
      let lowestTeamId = "";
      let lowestScore = Infinity;
      for (const [teamId, score] of Object.entries(scores)) {
        if (score.total < lowestScore) {
          lowestScore = score.total;
          lowestTeamId = teamId;
        }
      }

      // Update state
      const newJudgeScores = { ...gameState.judgeScores, [roundKey]: scores };
      const newEliminations = [...gameState.eliminations];
      const newTeams = gameState.teams.map(t => {
        if (t.id === lowestTeamId) {
          newEliminations.push({ round: gameState.round, teamId: t.id, teamName: t.name });
          return { ...t, eliminated: true, eliminatedInRound: gameState.round };
        }
        return t;
      });

      const remainingTeams = newTeams.filter(t => !t.eliminated);
      const isGameOver = remainingTeams.length <= 1 || gameState.round >= gameState.maxRounds;

      const newState: ChefGameState = {
        ...gameState,
        roundPhase: "elimination",
        judgeScores: newJudgeScores,
        eliminations: newEliminations,
        teams: newTeams,
        winner: isGameOver && remainingTeams.length > 0 ? remainingTeams[0].id : null,
      };

      await multiplayer.updateGameState(
        newState,
        undefined,
        isGameOver ? "completed" : "active",
        isGameOver && remainingTeams.length > 0 
          ? remainingTeams[0].memberIds[0] 
          : undefined
      );
    } catch (err: any) {
      toast.error("Judging failed: " + (err.message || "Unknown"));
    } finally {
      setJudging(false);
    }
  }, [multiplayer, gameState]);

  const myTeam = gameState.teams.find(t => user && t.memberIds.includes(user.id));
  const isEliminated = myTeam?.eliminated ?? false;
  const roundKey = `round-${gameState.round}`;
  const mySubmission = (gameState.submissions[roundKey] || []).find(s => s.userId === user?.id);
  const activeTeams = gameState.teams.filter(t => !t.eliminated);

  return {
    ...multiplayer,
    gameState,
    timeRemaining,
    submitting,
    judging,
    myTeam,
    isEliminated,
    mySubmission,
    activeTeams,
    startGame,
    startRound,
    submitEntry,
    advanceToJudging,
    runJudging,
  };
}
