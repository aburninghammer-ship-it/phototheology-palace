import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tournament_id } = await req.json();
    if (!tournament_id) throw new Error("Missing tournament_id");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Fetch tournament
    const { data: tournament, error: fetchError } = await supabaseClient
      .from("gideon_tournaments")
      .select("*")
      .eq("id", tournament_id)
      .single();

    if (fetchError || !tournament) throw new Error("Tournament not found");

    // Fetch all players
    const { data: players, error: playersError } = await supabaseClient
      .from("gideon_tournament_players")
      .select("*")
      .eq("tournament_id", tournament_id);

    if (playersError || !players) throw new Error("Failed to fetch players");

    const questions = tournament.questions_data as any[];
    const synthesisQuestion = questions.find((q: any) => q.source === "synthesis") || questions[questions.length - 1];

    // Collect synthesis answers from non-eliminated players
    const synthesisAnswers = players
      .filter((p: any) => !p.is_eliminated)
      .map((p: any) => {
        const synthAnswer = p.answers?.find((a: any) => a.question_index === -1);
        return {
          player_id: p.id,
          user_id: p.user_id,
          display_name: p.display_name,
          answer: synthAnswer?.answer || "",
        };
      });

    // AI grade synthesis answers
    let synthesisScores: Record<string, number> = {};

    if (synthesisAnswers.some((a: any) => a.answer)) {
      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

      const gradingPrompt = `Grade these synthesis answers from a Gideon 300 Bible tournament.

SYNTHESIS QUESTION: ${synthesisQuestion?.prompt || "Synthesize concepts from multiple Palace rooms."}
CORRECT ANSWER GUIDE: ${synthesisQuestion?.correct_answer || "Should demonstrate integration of concepts from at least 2 Palace rooms."}

PLAYER ANSWERS:
${JSON.stringify(synthesisAnswers.map((a: any) => ({
  player_id: a.player_id,
  answer: a.answer,
})), null, 2)}

Grade each answer 0-100 based on:
- Biblical accuracy (40%)
- Integration across Palace rooms (30%)
- Depth of understanding (30%)`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: "You are a Phototheology tournament grader. Grade synthesis answers fairly.",
            },
            { role: "user", content: gradingPrompt },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "submit_grades",
                description: "Submit synthesis grades",
                parameters: {
                  type: "object",
                  properties: {
                    grades: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          player_id: { type: "string" },
                          score: { type: "number", minimum: 0, maximum: 100 },
                          feedback: { type: "string" },
                        },
                        required: ["player_id", "score", "feedback"],
                      },
                    },
                  },
                  required: ["grades"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "submit_grades" } },
        }),
      });

      if (response.ok) {
        const aiResult = await response.json();
        const toolCall = aiResult.choices[0]?.message?.tool_calls?.[0];
        if (toolCall) {
          const parsed = JSON.parse(toolCall.function.arguments);
          for (const g of parsed.grades) {
            synthesisScores[g.player_id] = g.score;
          }
        }
      }
    }

    // Compute final scores and leaderboard
    const maxRounds = tournament.max_rounds || 8;
    const leaderboard: any[] = [];

    for (const player of players) {
      const answers = player.answers || [];
      const mcAnswers = answers.filter((a: any) => a.question_index !== -1);
      const totalAnswered = mcAnswers.length;
      const totalCorrect = mcAnswers.filter((a: any) => a.correct).length;
      const accuracyPct = totalAnswered > 0 ? (totalCorrect / totalAnswered) * 100 : 0;

      const survivalDepth = player.is_eliminated ? (player.eliminated_at_round || 0) : maxRounds;
      const survivalMultiplier = 1.0 + (survivalDepth / maxRounds);

      const earlyLockBonus = player.early_lock_bonus || 0;
      const highRiskBonus = player.high_risk_bonus || 0;

      const rawSynthesisScore = synthesisScores[player.id] || 0;
      const synthesisBonus = rawSynthesisScore / 2; // Scale 0-100 to 0-50

      const totalScore = (accuracyPct * survivalMultiplier) + earlyLockBonus + highRiskBonus + synthesisBonus;

      // Update player record
      await supabaseClient.from("gideon_tournament_players").update({
        accuracy_pct: Math.round(accuracyPct * 100) / 100,
        survival_depth: survivalDepth,
        total_score: Math.round(totalScore * 100) / 100,
        synthesis_score: rawSynthesisScore,
      }).eq("id", player.id);

      leaderboard.push({
        user_id: player.user_id,
        display_name: player.display_name,
        rank: 0,
        total_score: Math.round(totalScore * 100) / 100,
        accuracy_pct: Math.round(accuracyPct * 100) / 100,
        survival_depth: survivalDepth,
        early_lock_bonus: earlyLockBonus,
        high_risk_bonus: highRiskBonus,
        synthesis_score: synthesisBonus,
        water_rations_remaining: player.water_rations,
        is_eliminated: player.is_eliminated,
      });
    }

    // Sort by total score descending and assign ranks
    leaderboard.sort((a, b) => b.total_score - a.total_score);
    leaderboard.forEach((entry, i) => {
      entry.rank = i + 1;
    });

    const winnerId = leaderboard[0]?.user_id || null;

    // Update tournament with final leaderboard
    await supabaseClient.from("gideon_tournaments").update({
      final_leaderboard: leaderboard,
      winner_user_id: winnerId,
      status: "completed",
      round_phase: "complete",
    }).eq("id", tournament_id);

    // Update player ranks
    for (const entry of leaderboard) {
      await supabaseClient.from("gideon_tournament_players").update({
        final_rank: entry.rank,
      }).eq("tournament_id", tournament_id).eq("user_id", entry.user_id);
    }

    // Insert into game_scores for leaderboard
    for (const entry of leaderboard) {
      await supabaseClient.from("game_scores").insert({
        user_id: entry.user_id,
        game_type: "gideon_300",
        score: Math.round(entry.total_score),
        mode: "multiplayer",
        metadata: {
          tournament_id,
          rank: entry.rank,
          accuracy_pct: entry.accuracy_pct,
          survival_depth: entry.survival_depth,
        },
      });
    }

    // Update season stats for full_suite players
    for (const player of players) {
      if (player.access_tier !== "full_suite") continue;

      const entry = leaderboard.find((e: any) => e.user_id === player.user_id);
      if (!entry) continue;

      const now = new Date();
      const quarter = Math.ceil((now.getMonth() + 1) / 3);
      const season = `${now.getFullYear()}-Q${quarter}`;

      // Upsert season stats
      const { data: existing } = await supabaseClient
        .from("gideon_season_stats")
        .select("*")
        .eq("user_id", player.user_id)
        .eq("season", season)
        .maybeSingle();

      const mcAnswers = (player.answers || []).filter((a: any) => a.question_index !== -1);
      const totalCorrect = mcAnswers.filter((a: any) => a.correct).length;
      const isWinner = entry.rank === 1;

      if (existing) {
        const newPlayed = existing.tournaments_played + 1;
        const newWon = existing.tournaments_won + (isWinner ? 1 : 0);
        const newAnswered = existing.total_questions_answered + mcAnswers.length;
        const newCorrect = existing.total_questions_correct + totalCorrect;
        const newStreak = isWinner ? existing.current_win_streak + 1 : 0;

        await supabaseClient.from("gideon_season_stats").update({
          tournaments_played: newPlayed,
          tournaments_won: newWon,
          total_questions_answered: newAnswered,
          total_questions_correct: newCorrect,
          avg_accuracy: newAnswered > 0 ? Math.round((newCorrect / newAnswered) * 10000) / 100 : 0,
          avg_survival_depth: Math.round(((existing.avg_survival_depth * (newPlayed - 1) + entry.survival_depth) / newPlayed) * 100) / 100,
          total_score: existing.total_score + entry.total_score,
          best_single_tournament_score: Math.max(existing.best_single_tournament_score, entry.total_score),
          current_win_streak: newStreak,
          best_win_streak: Math.max(existing.best_win_streak, newStreak),
          updated_at: new Date().toISOString(),
        }).eq("id", existing.id);
      } else {
        await supabaseClient.from("gideon_season_stats").insert({
          user_id: player.user_id,
          season,
          tournaments_played: 1,
          tournaments_won: isWinner ? 1 : 0,
          total_questions_answered: mcAnswers.length,
          total_questions_correct: totalCorrect,
          avg_accuracy: mcAnswers.length > 0 ? Math.round((totalCorrect / mcAnswers.length) * 10000) / 100 : 0,
          avg_survival_depth: entry.survival_depth,
          total_score: entry.total_score,
          best_single_tournament_score: entry.total_score,
          current_win_streak: isWinner ? 1 : 0,
          best_win_streak: isWinner ? 1 : 0,
        });
      }
    }

    // Update game room winner
    if (winnerId) {
      await supabaseClient.from("game_rooms").update({
        winner_user_id: winnerId,
        status: "completed",
      }).eq("id", tournament.game_room_id);
    }

    return new Response(
      JSON.stringify({ success: true, leaderboard }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Grade gideon synthesis error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
