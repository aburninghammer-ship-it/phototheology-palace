// @ts-nocheck - Gideon tables not yet in generated types
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import type {
  GideonTournament,
  GideonTournamentPlayer,
  GideonQuestionClient,
  GideonQuestion,
  GideonSettings,
  PlayerAnswer,
  TIMER_CONFIGS,
} from "@/types/gideon";
import type { GameRoom } from "@/hooks/useGameMultiplayer";

// Strip answers from questions so non-host clients can't cheat
function stripAnswers(tournament: GideonTournament): GideonTournament {
  if (!tournament.questions_data || tournament.questions_data.length === 0) return tournament;
  return {
    ...tournament,
    questions_data: (tournament.questions_data as GideonQuestion[]).map((q) => ({
      ...q,
      correct_answer: "",
      explanation: "",
    })),
  };
}

export function useGideon300(room: GameRoom | null, isHost: boolean) {
  const { user } = useAuth();
  const [tournament, setTournament] = useState<GideonTournament | null>(null);
  const [tournamentPlayers, setTournamentPlayers] = useState<GideonTournamentPlayer[]>([]);
  const [clientQuestions, setClientQuestions] = useState<GideonQuestionClient[]>([]);
  const [revealQuestion, setRevealQuestion] = useState<GideonQuestion | null>(null);
  const [hostOnline, setHostOnline] = useState(true);

  const myTournamentPlayer = tournamentPlayers.find((p) => p.user_id === user?.id) || null;

  // Safe setter: host gets full data, players get stripped data
  const setTournamentSafe = useCallback((data: GideonTournament) => {
    setTournament(isHost ? data : stripAnswers(data));
  }, [isHost]);

  // Fetch tournament when room becomes available
  const fetchTournament = useCallback(async (roomId: string) => {
    const { data } = await supabase
      .from("gideon_tournaments")
      .select("*")
      .eq("game_room_id", roomId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      setTournamentSafe(data as unknown as GideonTournament);
    }
  }, [setTournamentSafe]);

  const fetchPlayers = useCallback(async (tournamentId: string) => {
    const { data } = await supabase
      .from("gideon_tournament_players")
      .select("*")
      .eq("tournament_id", tournamentId)
      .order("total_score", { ascending: false });

    if (data) {
      setTournamentPlayers(data as unknown as GideonTournamentPlayer[]);
    }
  }, []);

  // Subscribe to tournament changes
  useEffect(() => {
    if (!room?.id) return;

    fetchTournament(room.id);

    const channel = supabase
      .channel(`gideon-tournament-${room.id}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "gideon_tournaments",
        filter: `game_room_id=eq.${room.id}`,
      }, (payload) => {
        if (payload.new) {
          setTournamentSafe(payload.new as unknown as GideonTournament);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [room?.id, fetchTournament]);

  // Host presence tracking
  useEffect(() => {
    if (!room?.id || !user) return;

    const presenceChannel = supabase.channel(`gideon-presence-${room.id}`);

    presenceChannel
      .on("presence", { event: "sync" }, () => {
        const state = presenceChannel.presenceState();
        const hostPresent = Object.values(state).some((presences: any) =>
          presences.some((p: any) => p.user_id === room.host_id)
        );
        setHostOnline(hostPresent);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await presenceChannel.track({ user_id: user.id });
        }
      });

    return () => {
      supabase.removeChannel(presenceChannel);
    };
  }, [room?.id, room?.host_id, user]);

  // Subscribe to player changes when tournament exists
  useEffect(() => {
    if (!tournament?.id) return;

    fetchPlayers(tournament.id);

    const channel = supabase
      .channel(`gideon-players-${tournament.id}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "gideon_tournament_players",
        filter: `tournament_id=eq.${tournament.id}`,
      }, () => {
        fetchPlayers(tournament.id);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tournament?.id, fetchPlayers]);

  // Extract client-safe questions when tournament updates
  useEffect(() => {
    if (!tournament?.questions_data || tournament.questions_data.length === 0) return;

    const stripped = (tournament.questions_data as GideonQuestion[]).map((q) => ({
      id: q.id,
      prompt: q.prompt,
      options: q.options,
      pt_room_tag: q.pt_room_tag,
      difficulty: q.difficulty,
      strike_impact: q.strike_impact,
      round_assignment: q.round_assignment,
      source: q.source,
    }));
    setClientQuestions(stripped);
  }, [tournament?.questions_data]);

  const currentQuestion = clientQuestions[tournament?.current_question_index || 0] || null;

  // Fetch full question with answer for reveal phase
  const fetchRevealQuestion = useCallback(async (questionIndex: number): Promise<GideonQuestion | null> => {
    if (!tournament?.id) return null;

    const { data } = await supabase
      .from("gideon_tournaments")
      .select("questions_data")
      .eq("id", tournament.id)
      .single();

    if (data?.questions_data) {
      const fullQuestion = (data.questions_data as GideonQuestion[])[questionIndex];
      setRevealQuestion(fullQuestion || null);
      return fullQuestion || null;
    }
    return null;
  }, [tournament?.id]);

  // Auto-fetch reveal question when phase changes to reveal
  useEffect(() => {
    if (tournament?.round_phase === "reveal" || tournament?.round_phase === "camp_teaching") {
      fetchRevealQuestion(tournament.current_question_index);
    } else {
      setRevealQuestion(null);
    }
  }, [tournament?.round_phase, tournament?.current_question_index, fetchRevealQuestion]);

  // ========== HOST ACTIONS ==========

  const createTournament = useCallback(async (roomId: string, settings: GideonSettings) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from("gideon_tournaments")
      .insert({
        game_room_id: roomId,
        host_id: user.id,
        theme: settings.theme,
        difficulty_tier: settings.difficulty_tier,
        pt_room_focus: settings.pt_room_focus,
        max_rounds: settings.max_rounds,
        timer_mode: settings.timer_mode,
        false_prophet_round: settings.false_prophet_round,
        status: "waiting",
        round_phase: "lobby",
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to create tournament: " + error.message);
      return null;
    }

    setTournamentSafe(data as unknown as GideonTournament);

    // Register the host as a tournament player
    await supabase.from("gideon_tournament_players").insert({
      tournament_id: data.id,
      user_id: user.id,
      display_name: "Host",
    });

    return data;
  }, [user]);

  const startTournament = useCallback(async (tournamentId: string) => {
    if (!user || !isHost) return;

    // Update to generating state
    await supabase.from("gideon_tournaments")
      .update({ status: "generating", round_phase: "generating" })
      .eq("id", tournamentId);

    // Register all room players as tournament players
    if (room) {
      const { data: roomPlayers } = await supabase
        .from("game_room_players")
        .select("*")
        .eq("room_id", room.id);

      if (roomPlayers) {
        for (const rp of roomPlayers) {
          // Upsert to handle host already being registered
          await supabase.from("gideon_tournament_players").upsert({
            tournament_id: tournamentId,
            user_id: rp.user_id,
            display_name: rp.display_name,
          }, { onConflict: "tournament_id,user_id" });
        }
      }
    }

    // Call edge function to generate questions
    try {
      toast.info("Generating tournament questions...");
      const { data, error } = await supabase.functions.invoke("generate-gideon-questions", {
        body: { tournament_id: tournamentId },
      });

      if (error) throw error;

      // Start the game — set to round 1, question phase
      const timerMode = tournament?.timer_mode || "standard";
      const timerSeconds = timerMode === "advanced" ? 20 : 25;

      await supabase.from("gideon_tournaments").update({
        status: "active",
        current_round: 1,
        round_phase: "question",
        current_question_index: 0,
        round_timer_seconds: timerSeconds,
        round_started_at: new Date().toISOString(),
      }).eq("id", tournamentId);

      // Also mark game_room as active
      if (room) {
        await supabase.from("game_rooms").update({
          status: "active",
          updated_at: new Date().toISOString(),
        }).eq("id", room.id);
      }

      toast.success("Tournament started!");
    } catch (err: any) {
      toast.error("Failed to generate questions: " + (err.message || "Unknown error"));
      await supabase.from("gideon_tournaments")
        .update({ status: "abandoned", round_phase: "lobby" })
        .eq("id", tournamentId);
    }
  }, [user, isHost, room, tournament?.timer_mode]);

  const processRoundEnd = useCallback(async () => {
    if (!tournament || !isHost) return;

    // Host fetches full questions from DB (authoritative source of correct answers)
    const { data: freshTournament } = await supabase
      .from("gideon_tournaments")
      .select("questions_data")
      .eq("id", tournament.id)
      .single();

    const fullQuestions = (freshTournament?.questions_data || []) as GideonQuestion[];
    const roundQuestions = fullQuestions.filter((q) => q.round_assignment === tournament.current_round);
    const roundQuestionIndexes = roundQuestions.map((q) => fullQuestions.indexOf(q));

    // Fetch fresh player data
    const { data: players } = await supabase
      .from("gideon_tournament_players")
      .select("*")
      .eq("tournament_id", tournament.id);

    if (players) {
      for (const p of players) {
        if (p.is_eliminated) continue;

        const playerAnswers = (p.answers || []) as PlayerAnswer[];
        let wrongCount = 0;
        let earlyLockBonus = p.early_lock_bonus || 0;
        let highRiskBonus = p.high_risk_bonus || 0;
        const gradedAnswers = [...playerAnswers];

        for (const qIdx of roundQuestionIndexes) {
          const fullQ = fullQuestions[qIdx];
          if (!fullQ) continue;

          const playerAnswer = playerAnswers.find((a) => a.question_index === qIdx);

          if (!playerAnswer) {
            // Unanswered = wrong
            wrongCount++;
          } else {
            // Grade the answer
            const isCorrect = playerAnswer.answer === fullQ.correct_answer;
            // Update the answer's correct field in the array
            const idx = gradedAnswers.findIndex((a) => a.question_index === qIdx);
            if (idx !== -1) {
              gradedAnswers[idx] = { ...gradedAnswers[idx], correct: isCorrect };
            }

            if (!isCorrect) {
              wrongCount++;
            } else {
              // Early lock bonus
              const timerDuration = tournament.round_timer_seconds * 1000;
              if (playerAnswer.time_ms < timerDuration * 0.4) {
                earlyLockBonus += 5;
              }
              // High risk bonus
              if (fullQ.difficulty >= 4) {
                highRiskBonus += 10;
              }
            }
          }
        }

        // Update player with graded answers, ration deductions, and bonuses
        const newRations = Math.max(0, p.water_rations - wrongCount);
        const isNowEliminated = newRations <= 0;

        await supabase.from("gideon_tournament_players").update({
          answers: gradedAnswers,
          water_rations: newRations,
          early_lock_bonus: earlyLockBonus,
          high_risk_bonus: highRiskBonus,
          ...(isNowEliminated ? {
            is_eliminated: true,
            eliminated_at_round: tournament.current_round,
            in_camp_mode: true,
          } : {}),
        }).eq("id", p.id);
      }
    }

    // Brief camp teaching phase
    await supabase.from("gideon_tournaments").update({
      round_phase: "camp_teaching",
    }).eq("id", tournament.id);
  }, [tournament, isHost]);

  const advanceToNextQuestion = useCallback(async () => {
    if (!tournament || !isHost) return;

    const questions = tournament.questions_data as GideonQuestion[];
    const currentIndex = tournament.current_question_index;
    const currentRound = tournament.current_round;

    // If we're in question phase, move to reveal
    if (tournament.round_phase === "question") {
      await supabase.from("gideon_tournaments").update({
        round_phase: "reveal",
        round_started_at: null,
      }).eq("id", tournament.id);
      return;
    }

    // If in reveal, check if there are more questions in this round
    const nextIndex = currentIndex + 1;
    const nextQuestion = questions[nextIndex];

    if (nextQuestion && nextQuestion.round_assignment === currentRound) {
      // More questions in this round
      const timerConfig = tournament.timer_mode === "advanced"
        ? [20, 20, 15, 15, 12, 12, 12, 12]
        : [25, 25, 20, 20, 15, 15, 15, 15];
      const timerSeconds = timerConfig[currentRound - 1] || 15;

      await supabase.from("gideon_tournaments").update({
        round_phase: "question",
        current_question_index: nextIndex,
        round_timer_seconds: timerSeconds,
        round_started_at: new Date().toISOString(),
      }).eq("id", tournament.id);
    } else {
      // End of round — process eliminations, then camp teaching or next round
      await processRoundEnd();
    }
  }, [tournament, isHost, processRoundEnd]);

  const advanceToNextRound = useCallback(async () => {
    if (!tournament || !isHost) return;

    const nextRound = tournament.current_round + 1;
    const questions = tournament.questions_data as GideonQuestion[];

    // Check if we should go to synthesis
    const activePlayers = tournamentPlayers.filter((p) => !p.is_eliminated);
    const shouldSynthesize = activePlayers.length <= 6 || nextRound > tournament.max_rounds;

    if (shouldSynthesize) {
      await advanceToSynthesis();
      return;
    }

    // Find first question of next round
    const nextQuestionIndex = questions.findIndex((q) => q.round_assignment === nextRound);
    if (nextQuestionIndex === -1) {
      await advanceToSynthesis();
      return;
    }

    const timerConfig = tournament.timer_mode === "advanced"
      ? [20, 20, 15, 15, 12, 12, 12, 12]
      : [25, 25, 20, 20, 15, 15, 15, 15];
    const timerSeconds = timerConfig[nextRound - 1] || 15;

    await supabase.from("gideon_tournaments").update({
      current_round: nextRound,
      round_phase: "question",
      current_question_index: nextQuestionIndex,
      round_timer_seconds: timerSeconds,
      round_started_at: new Date().toISOString(),
    }).eq("id", tournament.id);
  }, [tournament, isHost, tournamentPlayers]);

  const advanceToSynthesis = useCallback(async () => {
    if (!tournament || !isHost) return;

    await supabase.from("gideon_tournaments").update({
      round_phase: "synthesis",
      round_started_at: new Date().toISOString(),
      round_timer_seconds: 150,
    }).eq("id", tournament.id);
  }, [tournament, isHost]);

  const advanceToResults = useCallback(async () => {
    if (!tournament || !isHost) return;

    // Trigger grading
    try {
      toast.info("Grading synthesis answers...");
      await supabase.functions.invoke("grade-gideon-synthesis", {
        body: { tournament_id: tournament.id },
      });
    } catch (err) {
      console.error("Grading error:", err);
    }

    await supabase.from("gideon_tournaments").update({
      round_phase: "complete",
      status: "completed",
    }).eq("id", tournament.id);

    // Mark game room as completed
    if (room) {
      await supabase.from("game_rooms").update({
        status: "completed",
        updated_at: new Date().toISOString(),
      }).eq("id", room.id);
    }
  }, [tournament, isHost, room]);

  // ========== PLAYER ACTIONS ==========

  const submitAnswer = useCallback(async (questionIndex: number, answer: string, timeMs: number) => {
    if (!user || !tournament || !myTournamentPlayer) return;

    // Player submits answer without knowing correctness.
    // Correctness is determined authoritatively by processRoundEnd (host-side DB fetch).
    const newAnswer: PlayerAnswer = {
      question_index: questionIndex,
      answer,
      correct: false, // Placeholder — host will grade during processRoundEnd
      time_ms: timeMs,
      round: tournament.current_round,
    };

    const currentAnswers = myTournamentPlayer.answers || [];
    const updatedAnswers = [...currentAnswers, newAnswer];

    await supabase.from("gideon_tournament_players").update({
      answers: updatedAnswers,
      survival_depth: tournament.current_round,
    }).eq("id", myTournamentPlayer.id);
  }, [user, tournament, myTournamentPlayer]);

  const submitSynthesisAnswer = useCallback(async (answer: string) => {
    if (!user || !tournament || !myTournamentPlayer) return;

    // Store synthesis answer in player's answers array
    const currentAnswers = myTournamentPlayer.answers || [];
    const synthAnswer: PlayerAnswer = {
      question_index: -1, // Special index for synthesis
      answer,
      correct: false, // Will be determined by AI grading
      time_ms: 0,
      round: -1,
    };

    await supabase.from("gideon_tournament_players").update({
      answers: [...currentAnswers, synthAnswer],
    }).eq("id", myTournamentPlayer.id);

    toast.success("Synthesis answer submitted!");
  }, [user, tournament, myTournamentPlayer]);

  return {
    tournament,
    tournamentPlayers,
    myTournamentPlayer,
    clientQuestions,
    currentQuestion,
    revealQuestion,
    hostOnline,
    createTournament,
    startTournament,
    submitAnswer,
    submitSynthesisAnswer,
    advanceToNextQuestion,
    advanceToNextRound,
    advanceToSynthesis,
    advanceToResults,
  };
}
