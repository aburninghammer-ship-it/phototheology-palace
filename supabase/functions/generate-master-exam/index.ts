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

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Create the exam row with generating status
    const { data: examRow, error: insertError } = await supabaseClient
      .from("master_exam_attempts")
      .insert({
        user_id: user.id,
        status: "generating",
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error(`DB insert failed: ${insertError.message}`);
    }

    const entropySeed = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    const systemPrompt = `You are the Phototheology Palace Master Examiner. Generate EXACTLY 50 unique questions. Return ONLY valid JSON with a "questions" array. No markdown, no code blocks.

ENTROPY SEED: ${entropySeed}

CRITICAL ACCURACY REQUIREMENT: Every question and answer MUST be 100% accurate according to the definitions below. If a room belongs to Floor 2, do NOT list it among Floor 1 options. Double-check every answer against these exact definitions.

=== PALACE ROOMS (EXACT DEFINITIONS) ===

FLOOR 1 — FURNISHING (Memory & Visualization for Width):
- Story Room (SR): Collect and memorize Bible stories in sequence as vivid mental movies. NOT interpretation — just collecting stories.
- Imagination Room (IR): Step INSIDE the story as if you were there. Sanctified empathy — feel the sand, hear the crowd.
- 24FPS Room (24): One symbolic mnemonic image per chapter. Turns Scripture into a mental film strip.
- Bible Rendered (BR): One master image per 24-chapter block. Scan entire Bible in ~51 images.
- Translation Room (TR): Convert abstract text into concrete images. Verses become pictures.
- Gems Room (GR): Store striking insights. Select 2-3 random unrelated verses and find hidden theological connections.

FLOOR 2 — INVESTIGATION (Detective Work for Width):
- Observation Room (OR): Log details like a detective's notebook. 30-50 observations per passage without interpreting.
- Def-Com Room (DC): The forensic lab. Greek/Hebrew definitions + historical/cultural commentary. Linguistic analysis and cultural context.
- Symbols/Types Room (ST): Build profiles of God's imagery. Symbols = universal language (Lamb=Christ). Types = OT shadows pointing to Christ.
- Questions Room (QR): Interrogate text with 3×75 questions: intratextual, intertextual, Phototheological.
- Q&A Room (QA): Cross-examine witnesses. Scripture answers Scripture.

FLOOR 3 — FREESTYLE (Spontaneous Connections for Time):
- Nature Freestyle (NF): See God's truth in creation (Rom 1:20).
- Personal Freestyle (PF): Life experiences become object lessons.
- Bible Freestyle / Verse Genetics (BF): Every verse related to every other — trace genealogies of thought.
- History/Social Freestyle (HF): Bible interprets secular history, culture, current events.
- Listening Room (LR): Listen to sermons/conversations, instantly connect to Scripture.

FLOOR 4 — NEXT LEVEL (Christ-Centered Depth):
- Concentration Room (CR): Every text MUST reveal Christ (John 5:39).
- Dimensions Room (DR): 5 dimensions: Literal, Christ, Me, Church, Heaven.
- Connect 6 (C6): 6 genres: Prophecy, Poetry, History, Gospels, Epistles, Parables.
- Theme Room (TRm): Structural walls: Sanctuary, Life of Christ, Great Controversy, Time Prophecy, Gospel Floor, Heaven Ceiling.
- Time Zone (TZ): 6 zones: Heaven/Earth × Past/Present/Future.
- Patterns Room (PRm): Recurring motifs: 40 days, 3 days, deliverer stories.
- Parallels Room (P‖): Mirrored ACTIONS across time. Babel↔Pentecost.
- Fruit Room (FRt): Interpretation must produce Gal 5:22-23 fruit.
- Christ in Every Chapter (CEC): Name Christ's thread in every chapter explicitly.
- Room 66 (R66): Trace one theme through all 66 books.

FLOOR 5 — VISION (Prophecy & Sanctuary):
- Blue Room / Sanctuary (BL): Sanctuary blueprint. Altar=cross, Laver=baptism, Lampstand=Spirit, Shewbread=Word, Incense=intercession, Ark=law/mercy/throne, Veil=access, Gate=entry.
- Prophecy Room (PR): Daniel & Revelation telescope. Historicist method.
- Three Angels' Room (3A): Rev 14:6-12 capstone.
- Feasts Room: Connect texts to Israel's feasts as prophetic markers.

FLOOR 6 — THREE HEAVENS & CYCLES:
- 1H (DoL¹/NE¹) = Babylon destroys Jerusalem 586BC → post-exilic restoration.
- 2H (DoL²/NE²) = Rome destroys Jerusalem 70AD → New Covenant order.
- 3H (DoL³/NE³) = Final cosmic judgment → new creation Rev 21-22.
- Eight Cycles: @Ad, @No, @Ab, @Mo, @Cy, @CyC, @Sp, @Re. Pattern: Fall→Covenant→Sanctuary→Enemy→Restoration.
- Juice Room (JR): Squeeze one book through ALL principles.

FLOOR 7 — SPIRITUAL/EMOTIONAL:
- Fire Room (FRm): Feel Scripture's emotional weight.
- Meditation Room (MR): Slow marination in truth.
- Speed Room (SRm): Rapid application drills.

FLOOR 8 — MASTER: No rooms. Reflexive Phototheological thought.

=== FIVE ASCENSIONS ===
Asc-1 (Text) → Asc-2 (Chapter) → Asc-3 (Book) → Asc-4 (Cycle) → Asc-5 (Heaven). Static=anchored. Dynamic=creative.

=== FOUR EXPANSIONS ===
Width (Floors 1-2), Time (Floor 3), Depth (Floors 4-5-6), Height (Floors 7-8)

=== QUESTION DISTRIBUTION ===
1. PALACE ROOMS (10 questions): Test exact room purposes, floor assignments, methodology distinctions. VERIFY every room-floor mapping before finalizing.
2. APOLOGETICS/AATS (8 questions): 22 avatars, 3 rings. Ring 1 (Non-belief), Ring 2 (Non-Christian), Ring 3 (Intra-Christian).
3. GEMS & TYPOLOGY (7 questions): 7 categories: typology, parallel, prophecy, wordplay, numerics, chiasm, symbol.
4. PROPHECY (6 questions): @120, @400, @70y, @490, @1260, @2300. Day-Year Principle.
5. SANCTUARY (5 questions): Furniture meanings, gospel progression.
6. CHRIST TYPES (5 questions): Categories: type, prophecy, title, symbol, theme, appearance.
7. PATTERNS & THEMES (5 questions): DoL cycles, pattern categories.
8. MEMORIZATION & COURSES (4 questions): 5 Dimensions, Ascensions, Expansions.

TYPES: ~20 MC (4 options), ~15 TF, ~15 SA (with grading_rubric).
DIFFICULTY: 30% intermediate, 50% advanced, 20% master.

RULES:
- correct_answer and explanation required for every question
- MC: exactly 4 options, correct_answer must match one option exactly
- TF: correct_answer "True" or "False"
- SA: grading_rubric array of 2-4 key points
- NEVER attribute a room to the wrong floor
- Use KJV Scripture references where applicable

OUTPUT: raw JSON only, no markdown:
{"questions":[{"id":1,"category":"palace_rooms","type":"mc","difficulty":"intermediate","question":"...","options":["A","B","C","D"],"correct_answer":"B","explanation":"...","scripture_ref":"John 5:39"}]}

Valid categories: palace_rooms, apologetics, gems_typology, prophecy, sanctuary, christ_types, patterns_themes, memorization_courses
Valid types: mc, tf, sa
Valid difficulties: intermediate, advanced, master`;

    console.log("Calling AI gateway for exam generation...");

    const aiMessages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: "Generate the 50-question master exam now. Return ONLY raw JSON — no markdown code blocks, no commentary. Ensure variety and rigor." },
    ];

    // Try GPT-5 first, fallback to Gemini Flash
    const modelsToTry = ["openai/gpt-5", "google/gemini-2.5-flash"];
    let response: Response | null = null;

    for (const model of modelsToTry) {
      console.log(`Trying model: ${model}`);
      response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: aiMessages,
          max_tokens: 32768,
        }),
      });
      if (response.ok) break;
      console.warn(`Model ${model} failed with status ${response.status}`);
    }

    if (!response || !response.ok) {
      const errorText = response ? await response.text() : "All models failed";
      console.error("AI gateway error:", response?.status, errorText);
      await supabaseClient
        .from("master_exam_attempts")
        .update({ status: "abandoned" })
        .eq("id", examRow.id);

      if (response?.status === 429) {
        throw new Error("Rate limit exceeded. Please wait a moment and try again.");
      }
      if (response?.status === 402) {
        throw new Error("AI credits exhausted.");
      }
      throw new Error("Failed to generate exam questions");
    }

    const aiResult = await response.json();
    console.log("AI response received, parsing...");

    // Extract content — support both tool call and direct text responses
    let rawContent: string;
    const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall) {
      rawContent = toolCall.function.arguments;
    } else {
      rawContent = aiResult.choices?.[0]?.message?.content || "";
    }

    if (!rawContent) {
      console.error("No content in AI response:", JSON.stringify(aiResult).slice(0, 500));
      await supabaseClient
        .from("master_exam_attempts")
        .update({ status: "abandoned" })
        .eq("id", examRow.id);
      throw new Error("No exam data returned from AI");
    }

    // Clean markdown code blocks if present
    let cleanContent = rawContent.trim();
    if (cleanContent.startsWith("```")) {
      cleanContent = cleanContent.replace(/```json?\n?/g, "").replace(/```\s*$/g, "").trim();
    }

    let examData: { questions: any[] };
    try {
      examData = JSON.parse(cleanContent);
    } catch (parseErr) {
      console.error("JSON parse error:", (parseErr as Error).message, "Content preview:", cleanContent.slice(0, 200));
      await supabaseClient
        .from("master_exam_attempts")
        .update({ status: "abandoned" })
        .eq("id", examRow.id);
      throw new Error("Failed to parse exam data");
    }

    if (!examData.questions || !Array.isArray(examData.questions) || examData.questions.length === 0) {
      console.error("Invalid exam structure:", Object.keys(examData));
      await supabaseClient
        .from("master_exam_attempts")
        .update({ status: "abandoned" })
        .eq("id", examRow.id);
      throw new Error("Invalid exam structure from AI");
    }

    console.log(`Parsed ${examData.questions.length} questions`);

    // Ensure each question has required fields and normalize IDs
    const questions = examData.questions.map((q: any, i: number) => ({
      id: i + 1,
      category: q.category || "palace_rooms",
      type: q.type || "mc",
      difficulty: q.difficulty || "intermediate",
      question: q.question || "",
      options: q.type === "mc" ? (q.options || []) : undefined,
      correct_answer: q.correct_answer || "",
      explanation: q.explanation || "",
      grading_rubric: q.type === "sa" ? (q.grading_rubric || []) : undefined,
      scripture_ref: q.scripture_ref || undefined,
    }));

    // Store full questions (with answers) in DB
    const { error: updateError } = await supabaseClient
      .from("master_exam_attempts")
      .update({
        questions_data: questions,
        total_questions: questions.length,
        status: "in_progress",
        started_at: new Date().toISOString(),
      })
      .eq("id", examRow.id);

    if (updateError) {
      console.error("DB update error:", updateError);
      throw new Error(`Failed to save exam: ${updateError.message}`);
    }

    // Strip correct answers, explanations, and rubrics before sending to client
    const clientQuestions = questions.map((q: any) => ({
      id: q.id,
      category: q.category,
      type: q.type,
      difficulty: q.difficulty,
      question: q.question,
      options: q.options,
      scripture_ref: q.scripture_ref,
    }));

    console.log(`Exam ${examRow.id} generated successfully with ${clientQuestions.length} questions`);

    return new Response(
      JSON.stringify({
        exam_id: examRow.id,
        questions: clientQuestions,
        time_limit_seconds: 5400,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Generate master exam error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
