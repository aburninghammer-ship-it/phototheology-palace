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

    // Fetch tournament config
    const { data: tournament, error: fetchError } = await supabaseClient
      .from("gideon_tournaments")
      .select("*")
      .eq("id", tournament_id)
      .eq("host_id", user.id)
      .single();

    if (fetchError || !tournament) throw new Error("Tournament not found or not host");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const entropySeed = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const maxRounds = tournament.max_rounds || 8;
    const questionsPerRound = 3; // 3 questions per round
    const totalQuestions = maxRounds * questionsPerRound + 1; // +1 for synthesis prompt
    const theme = tournament.theme || "general";
    const difficulty = tournament.difficulty_tier || "standard";
    const falseProphet = tournament.false_prophet_round;
    const roomFocus = tournament.pt_room_focus?.length > 0
      ? tournament.pt_room_focus.join(", ")
      : "All rooms";

    const themeInstructions: Record<string, string> = {
      general: "Cover all Palace domains evenly: rooms/methodology, typology, prophecy, sanctuary, apologetics, patterns.",
      prophecy: "Focus 60% on time prophecies (@120, @400, @70y, @490, @1260, @2300), prophetic principles, fulfillments. 40% general.",
      sanctuary: "Focus 60% on sanctuary furniture, services, gospel progression, Christ connections. 40% general.",
      typology: "Focus 60% on types, parallels, gems (typology, parallel, prophecy, wordplay, numerics, chiasm, symbol). 40% general.",
      apologetics: "Focus 60% on AATS War College avatars, rings, apologetics strategies, SDA distinctives. 40% general.",
    };

    const falseProphetInstructions = falseProphet
      ? `\n\nFALSE PROPHET ROUND: For round ${Math.ceil(maxRounds / 2)}, generate 3 "False Prophet" questions. These present theological distortions that SOUND correct but contain subtle errors. The correct answer is the one that identifies/refutes the distortion. Mark these with source: "false_prophet".`
      : "";

    const systemPrompt = `You are the Gideon 300 Tournament Question Master for the Phototheology Palace.
Generate EXACTLY ${totalQuestions} multiple-choice questions for a ${maxRounds}-round tournament.

ENTROPY SEED: ${entropySeed}

THEME: ${theme}
${themeInstructions[theme] || themeInstructions.general}

ROOM FOCUS: ${roomFocus}

DIFFICULTY: ${difficulty === "advanced" ? "Lean harder — 40% difficulty 3, 40% difficulty 4, 20% difficulty 5" : "Standard — 30% difficulty 2, 40% difficulty 3, 20% difficulty 4, 10% difficulty 5"}

DIFFICULTY RAMPING: Earlier rounds should have easier questions (difficulty 2-3), later rounds harder (difficulty 4-5).

PALACE ROOMS REFERENCE:
- Floor 1: Story Room (SR), Imagination Room (IR), 24FPS (24), Bible Rendered (BR), Translation Room (TR), Gems Room (GR)
- Floor 2: Observation Room (OR), Def-Com Room (DC), Symbols/Types Room (ST), Questions Room (QR), Q&A Room (QA)
- Floor 3: Nature Freestyle (NF), Personal Freestyle (PF), Bible Freestyle (BF), History Freestyle (HF), Listening Room (LR)
- Floor 4: Concentration Room (CR), Dimensions Room (DR), Connect 6 (C6), Theme Room (TRm), Time Zone (TZ), Patterns Room (PRm), Parallels (P‖), Fruit Room (FRt), Christ in Every Chapter (CEC), Room 66 (R66)
- Floor 5: Blue Room (BL), Prophecy Room (PR), Three Angels (3A), Feasts Room
- Floor 6: Three Heavens (1H, 2H, 3H), Cycles, Judgment, Frameworks, Mathematics, Summary, Master Eight
${falseProphetInstructions}

The LAST question (id: ${totalQuestions}) is a SYNTHESIS PROMPT — not multiple choice. It should require the player to write 2-3 sentences integrating concepts from at least 2 different Palace rooms. Include it with source: "synthesis".

RULES:
- Each question has exactly 4 options, one correct
- Include cross-references (Scripture references) where applicable
- Vary questions — no repeats
- Assign round_assignment from 1 to ${maxRounds} (${questionsPerRound} questions per round)
- The synthesis question gets round_assignment: ${maxRounds + 1}

OUTPUT FORMAT — return ONLY raw JSON, no markdown:
{
  "questions": [
    {
      "id": 1,
      "prompt": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": "Option B",
      "explanation": "Why this is correct...",
      "cross_references": ["John 3:16", "Romans 5:8"],
      "pt_room_tag": "QA",
      "difficulty": 3,
      "estimated_miss_rate": 0.4,
      "strike_impact": "standard",
      "round_assignment": 1,
      "source": "ai"
    }
  ]
}`;

    console.log(`Generating ${totalQuestions} questions for tournament ${tournament_id}...`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate the ${totalQuestions}-question Gideon 300 tournament now. Return ONLY raw JSON — no markdown code blocks.` },
        ],
        max_tokens: 32768,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      await supabaseClient
        .from("gideon_tournaments")
        .update({ status: "abandoned", round_phase: "lobby" })
        .eq("id", tournament_id);

      if (response.status === 429) throw new Error("Rate limit exceeded. Please wait and try again.");
      if (response.status === 402) throw new Error("AI credits exhausted.");
      throw new Error(`AI generation failed (${response.status})`);
    }

    const aiResult = await response.json();

    let rawContent: string;
    const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall) {
      rawContent = toolCall.function.arguments;
    } else {
      rawContent = aiResult.choices?.[0]?.message?.content || "";
    }

    if (!rawContent) {
      await supabaseClient
        .from("gideon_tournaments")
        .update({ status: "abandoned", round_phase: "lobby" })
        .eq("id", tournament_id);
      throw new Error("No question data returned from AI");
    }

    let cleanContent = rawContent.trim();
    if (cleanContent.startsWith("```")) {
      cleanContent = cleanContent.replace(/```json?\n?/g, "").replace(/```\s*$/g, "").trim();
    }

    let questionsData: { questions: any[] };
    try {
      questionsData = JSON.parse(cleanContent);
    } catch (parseErr) {
      console.error("JSON parse error:", (parseErr as Error).message, cleanContent.slice(0, 200));
      await supabaseClient
        .from("gideon_tournaments")
        .update({ status: "abandoned", round_phase: "lobby" })
        .eq("id", tournament_id);
      throw new Error("Failed to parse question data");
    }

    if (!questionsData.questions || !Array.isArray(questionsData.questions) || questionsData.questions.length === 0) {
      await supabaseClient
        .from("gideon_tournaments")
        .update({ status: "abandoned", round_phase: "lobby" })
        .eq("id", tournament_id);
      throw new Error("Invalid question structure from AI");
    }

    // Normalize questions
    const questions = questionsData.questions.map((q: any, i: number) => ({
      id: i + 1,
      prompt: q.prompt || q.question || "",
      options: q.options || ["A", "B", "C", "D"],
      correct_answer: q.correct_answer || q.options?.[0] || "",
      explanation: q.explanation || "",
      cross_references: q.cross_references || [],
      pt_room_tag: q.pt_room_tag || "QA",
      difficulty: Math.min(5, Math.max(1, q.difficulty || 3)),
      estimated_miss_rate: q.estimated_miss_rate || 0.3,
      strike_impact: q.difficulty >= 4 ? "high" : "standard",
      round_assignment: q.round_assignment || Math.ceil((i + 1) / questionsPerRound),
      source: q.source || "ai",
    }));

    console.log(`Parsed ${questions.length} questions, storing...`);

    // Store full questions in tournament
    const { error: updateError } = await supabaseClient
      .from("gideon_tournaments")
      .update({
        questions_data: questions,
        ai_question_count: questions.length,
      })
      .eq("id", tournament_id);

    if (updateError) {
      console.error("DB update error:", updateError);
      throw new Error(`Failed to save questions: ${updateError.message}`);
    }

    console.log(`Tournament ${tournament_id}: ${questions.length} questions generated successfully`);

    return new Response(
      JSON.stringify({ success: true, question_count: questions.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Generate gideon questions error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
