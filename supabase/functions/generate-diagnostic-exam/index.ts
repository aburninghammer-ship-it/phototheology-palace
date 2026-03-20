import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const EXAM_CONFIGS: Record<string, {
  name: string;
  timeSeconds: number;
  questionCount: number;
  systemPrompt: string;
  categories: string[];
}> = {
  foundation: {
    name: "Foundation Diagnostic",
    timeSeconds: 3600, // 60 min
    questionCount: 50,
    categories: [
      "floor_identification", "room_purposes", "room_methodology",
      "system_flow", "codes_shorthand", "expansions_ascensions",
      "principle_distinctions", "room_selection"
    ],
    systemPrompt: `You are the PT Foundation Diagnostic Examiner. Generate EXACTLY 50 questions testing whether the user understands the Phototheology Palace framework.

ENTROPY SEED: {{ENTROPY}}

=== WHAT THIS TEST COVERS ===
This is the "Do they understand the map?" test. It checks:
- Names and purpose of all 8 floors
- Names and functions of every room
- How the PT system flows (Width→Time→Depth→Height)
- What kind of thinking belongs in each room
- Difference between observation, connection, symbolism, Christ-centered reading, prophecy, application, and freestyle
- PT codes and shorthand
- Five Ascensions and Four Expansions

=== PALACE ROOMS (EXACT DEFINITIONS) ===

FLOOR 1 — FURNISHING (Memory & Visualization for Width):
- Story Room (SR): Collect and memorize Bible stories in sequence as vivid mental movies. NOT interpretation — just collecting stories.
- Imagination Room (IR): Step INSIDE the story as if you were there. Sanctified empathy.
- 24FPS Room (24): One symbolic mnemonic image per chapter. Mental film strip.
- Bible Rendered (BR): One master image per 24-chapter block. ~51 images for entire Bible.
- Translation Room (TR): Convert abstract text into concrete images.
- Gems Room (GR): Store striking insights and discoveries.

FLOOR 2 — INVESTIGATION (Detective Work for Width):
- Observation Room (OR): Log details without interpreting. Detective's notebook.
- Def-Com Room (DC): Greek/Hebrew definitions + historical/cultural commentary.
- Symbols/Types Room (ST): God's imagery profiles. Symbols = universal language. Types = OT shadows.
- Questions Room (QR): 3×75 questions: intratextual, intertextual, Phototheological.
- Q&A Room (QA): Scripture answers Scripture. Cross-examine witnesses.

FLOOR 3 — FREESTYLE (Spontaneous Connections for Time):
- Nature Freestyle (NF): See God's truth in creation.
- Personal Freestyle (PF): Life experiences as object lessons.
- Bible Freestyle / Verse Genetics (BF): Trace genealogies of thought between verses.
- History/Social Freestyle (HF): Bible interprets secular history and culture.
- Listening Room (LR): Listen and instantly connect to Scripture.

FLOOR 4 — NEXT LEVEL (Christ-Centered Depth):
- Concentration Room (CR): Every text MUST reveal Christ.
- Dimensions Room (DR): 5 dimensions: Literal, Christ, Me, Church, Heaven.
- Connect 6 (C6): 6 genres: Prophecy, Poetry, History, Gospels, Epistles, Parables.
- Theme Room (TRm): Walls: Sanctuary, Life of Christ, Great Controversy, Time Prophecy, Gospel Floor, Heaven Ceiling.
- Time Zone (TZ): 6 zones: Heaven/Earth × Past/Present/Future.
- Patterns Room (PRm): Recurring motifs: 40 days, 3 days, deliverer stories.
- Parallels Room (P‖): Mirrored ACTIONS across time.
- Fruit Room (FRt): Interpretation must produce Gal 5:22-23 fruit.
- Christ in Every Chapter (CEC): Name Christ's thread explicitly.
- Room 66 (R66): Trace one theme through all 66 books.

FLOOR 5 — VISION (Prophecy & Sanctuary):
- Blue Room / Sanctuary (BL): Sanctuary blueprint.
- Prophecy Room (PR): Daniel & Revelation. Historicist method.
- Three Angels' Room (3A): Rev 14:6-12 capstone.
- Feasts Room: Israel's feasts as prophetic markers.

FLOOR 6 — THREE HEAVENS & CYCLES:
- 1H (DoL¹/NE¹), 2H (DoL²/NE²), 3H (DoL³/NE³)
- Eight Cycles: @Ad, @No, @Ab, @Mo, @Cy, @CyC, @Sp, @Re
- Juice Room (JR): Squeeze one book through ALL principles.

FLOOR 7 — SPIRITUAL/EMOTIONAL:
- Fire Room (FRm), Meditation Room (MR), Speed Room (SRm)

FLOOR 8 — MASTER: No rooms. Reflexive mastery (∞).

=== FIVE ASCENSIONS ===
Asc-1 (Text) → Asc-2 (Chapter) → Asc-3 (Book) → Asc-4 (Cycle) → Asc-5 (Heaven)

=== FOUR EXPANSIONS ===
Width (Floors 1-2), Time (Floor 3), Depth (Floors 4-5-6), Height (Floors 7-8)

=== QUESTION DISTRIBUTION ===
1. FLOOR IDENTIFICATION (8q): Which floor does this room belong to? Match rooms to floors.
2. ROOM PURPOSES (8q): What does this room do? Distinguish similar rooms.
3. ROOM METHODOLOGY (7q): HOW do you use this room? What exercises does it require?
4. SYSTEM FLOW (6q): How do floors connect? Why does order matter?
5. CODES & SHORTHAND (6q): What do these codes mean? Match codes to rooms/principles.
6. EXPANSIONS & ASCENSIONS (5q): Test Width/Time/Depth/Height and Asc-1 through Asc-5.
7. PRINCIPLE DISTINCTIONS (5q): What's the difference between observation vs interpretation, types vs parallels, etc.
8. ROOM SELECTION (5q): "Which PT room best handles this task?" scenario questions.

TYPES: ~20 MC (4 options), ~15 TF, ~15 SA (with grading_rubric).
DIFFICULTY: 40% intermediate, 40% advanced, 20% master.

CRITICAL: NEVER attribute a room to the wrong floor. Double-check every answer.

OUTPUT: raw JSON only, no markdown:
{"questions":[{"id":1,"category":"floor_identification","type":"mc","difficulty":"intermediate","question":"...","options":["A","B","C","D"],"correct_answer":"B","explanation":"..."}]}

Valid categories: floor_identification, room_purposes, room_methodology, system_flow, codes_shorthand, expansions_ascensions, principle_distinctions, room_selection`
  },
  prophecy_sanctuary: {
    name: "Prophecy & Sanctuary",
    timeSeconds: 3600,
    questionCount: 50,
    categories: [
      "sanctuary_furniture", "sanctuary_progression", "daniel_prophecy",
      "revelation_structure", "three_heavens", "cycles", "time_prophecy",
      "three_angels", "feasts", "prophetic_method"
    ],
    systemPrompt: `You are the PT Prophecy & Sanctuary Diagnostic Examiner. Generate EXACTLY 50 questions testing prophetic structure, sanctuary mapping, Three Heavens, cycles, and prophetic methodology.

ENTROPY SEED: {{ENTROPY}}

=== WHAT THIS TEST COVERS ===
This tests whether the user can navigate prophecy and sanctuary with PT precision:
- Sanctuary furniture meanings and gospel progression
- Daniel's prophetic structure (chapters 2, 7, 8-9, 10-12)
- Revelation's flow and connections to Daniel
- Three Heavens framework (DoL¹/NE¹, DoL²/NE², DoL³/NE³)
- Eight Cycles (@Ad through @Re) and their patterns
- Time prophecies: @120, @400, @70y, @490, @1260, @2300
- Day-Year Principle
- Three Angels' Messages (Rev 14:6-12)
- Israel's Feasts as prophetic markers
- Historicist method vs other approaches

=== SANCTUARY BLUEPRINT (Blue Room / BL) ===
- Gate: Entry point. Christ is the door (John 10:9).
- Altar of Burnt Offering: Cross/sacrifice. Complete surrender.
- Laver: Baptism/cleansing. Sanctification by the Word (Eph 5:26).
- Lampstand: Light of the Spirit. Seven-branch = completeness.
- Table of Showbread: Word of God. Bread of Life (John 6:35).
- Altar of Incense: Intercession/prayer. Christ's mediation.
- Veil: Access to God's presence. Torn at the cross (Matt 27:51).
- Ark of the Covenant: Law (tables), mercy seat (propitiation), God's throne.

=== THREE HEAVENS ===
- 1H (DoL¹/NE¹): Babylon destroys Jerusalem 586BC → post-exilic restoration under Cyrus. "New heavens and earth" = prophetic restoration language (Isa 65-66). Cycles: @Mo → @Cy.
- 2H (DoL²/NE²): Rome destroys Jerusalem 70AD → New-Covenant order. Church as temple, Christ in heavenly sanctuary (Heb 8-12). Cycles: @CyC → @Sp.
- 3H (DoL³/NE³): Final cosmic judgment → literal new creation (Rev 21-22). No temple needed. Cycle: @Re.

=== EIGHT CYCLES ===
Pattern: Fall → Covenant → Sanctuary → Enemy → Restoration
@Ad (Adamic), @No (Noahic), @Ab (Abrahamic), @Mo (Mosaic), @Cy (Cyrusic), @CyC (Cyrus-Christ), @Sp (Holy Spirit), @Re (Remnant)

=== KEY TIME PROPHECIES ===
- @120: 120 years before the Flood (Gen 6:3)
- @400: 400 years of affliction (Gen 15:13)
- @70y: 70 years of Babylonian captivity (Jer 25:11-12)
- @490: 70 weeks / 490 years (Dan 9:24-27)
- @1260: 1260 days/42 months/3.5 times (Dan 7:25; Rev 12:6, 13:5)
- @2300: 2300 evening-mornings (Dan 8:14) → 1844 cleansing of sanctuary
- Day-Year Principle: Num 14:34, Ezek 4:6

=== THREE ANGELS' MESSAGES (Rev 14:6-12) ===
1st Angel: Everlasting Gospel → worship Creator → judgment hour
2nd Angel: Babylon is fallen → false systems exposed
3rd Angel: Warning against beast/image/mark → endurance of saints

=== FEASTS OF ISRAEL ===
Passover, Unleavened Bread, Firstfruits, Pentecost, Trumpets, Day of Atonement, Tabernacles

=== REVELATION STRUCTURE ===
Rev 1-3: Churches (historical periods)
Rev 4-5: Throne room / Lamb
Rev 6-7: Seals
Rev 8-11: Trumpets (including Rev 10 little book, Rev 11 Two Witnesses)
Rev 12-14: Great Controversy panorama → Three Angels
Rev 15-18: Plagues / Babylon's fall
Rev 19-22: Second Coming → New Earth

=== QUESTION DISTRIBUTION ===
1. SANCTUARY FURNITURE (6q): What does each piece mean? Gospel progression through sanctuary.
2. SANCTUARY PROGRESSION (4q): How does the believer move through the sanctuary experience?
3. DANIEL PROPHECY (6q): Structures of Dan 2, 7, 8-9. Repeat-and-enlarge.
4. REVELATION STRUCTURE (5q): Flow of Revelation, connections to Daniel.
5. THREE HEAVENS (6q): Identify which heaven a passage belongs to. DoL/NE framework.
6. CYCLES (5q): Match events to cycles. Identify the Fall→Covenant→Sanctuary→Enemy→Restoration pattern.
7. TIME PROPHECY (6q): Calculate and identify prophetic time periods. Day-Year Principle.
8. THREE ANGELS (4q): Content, sequence, and meaning of Rev 14:6-12.
9. FEASTS (4q): Connect feasts to prophetic fulfillment.
10. PROPHETIC METHOD (4q): Historicist method, interpretation principles.

TYPES: ~20 MC (4 options), ~15 TF, ~15 SA (with grading_rubric).
DIFFICULTY: 30% intermediate, 45% advanced, 25% master.

OUTPUT: raw JSON only, no markdown:
{"questions":[{"id":1,"category":"sanctuary_furniture","type":"mc","difficulty":"intermediate","question":"...","options":["A","B","C","D"],"correct_answer":"B","explanation":"...","scripture_ref":"Heb 9:4"}]}

Valid categories: sanctuary_furniture, sanctuary_progression, daniel_prophecy, revelation_structure, three_heavens, cycles, time_prophecy, three_angels, feasts, prophetic_method`
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { exam_type } = await req.json().catch(() => ({ exam_type: "foundation" }));
    
    const config = EXAM_CONFIGS[exam_type];
    if (!config) {
      throw new Error(`Invalid exam type: ${exam_type}. Valid types: ${Object.keys(EXAM_CONFIGS).join(", ")}`);
    }

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

    // Create exam row
    const { data: examRow, error: insertError } = await supabaseClient
      .from("master_exam_attempts")
      .insert({
        user_id: user.id,
        status: "generating",
        exam_type,
        total_questions: config.questionCount,
      })
      .select("id")
      .single();

    if (insertError) throw new Error(`DB insert failed: ${insertError.message}`);

    const entropySeed = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const systemPrompt = config.systemPrompt.replace("{{ENTROPY}}", entropySeed);

    console.log(`Generating ${exam_type} exam...`);

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
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Generate the ${config.questionCount}-question ${config.name} exam now. Return ONLY raw JSON — no markdown code blocks. Ensure variety and rigor.` },
          ],
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

      if (response?.status === 429) throw new Error("Rate limit exceeded. Please wait and try again.");
      if (response?.status === 402) throw new Error("AI credits exhausted.");
      throw new Error("Failed to generate exam questions");
    }

    const aiResult = await response.json();
    let rawContent: string;
    const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
    rawContent = toolCall ? toolCall.function.arguments : (aiResult.choices?.[0]?.message?.content || "");

    if (!rawContent) {
      await supabaseClient.from("master_exam_attempts").update({ status: "abandoned" }).eq("id", examRow.id);
      throw new Error("No exam data returned from AI");
    }

    let cleanContent = rawContent.trim();
    if (cleanContent.startsWith("```")) {
      cleanContent = cleanContent.replace(/```json?\n?/g, "").replace(/```\s*$/g, "").trim();
    }

    let examData: { questions: any[] };
    try {
      examData = JSON.parse(cleanContent);
    } catch {
      await supabaseClient.from("master_exam_attempts").update({ status: "abandoned" }).eq("id", examRow.id);
      throw new Error("Failed to parse exam data");
    }

    if (!examData.questions?.length) {
      await supabaseClient.from("master_exam_attempts").update({ status: "abandoned" }).eq("id", examRow.id);
      throw new Error("Invalid exam structure from AI");
    }

    const questions = examData.questions.map((q: any, i: number) => ({
      id: i + 1,
      category: q.category || config.categories[0],
      type: q.type || "mc",
      difficulty: q.difficulty || "intermediate",
      question: q.question || "",
      options: q.type === "mc" ? (q.options || []) : undefined,
      correct_answer: q.correct_answer || "",
      explanation: q.explanation || "",
      grading_rubric: q.type === "sa" ? (q.grading_rubric || []) : undefined,
      scripture_ref: q.scripture_ref || undefined,
    }));

    await supabaseClient
      .from("master_exam_attempts")
      .update({
        questions_data: questions,
        total_questions: questions.length,
        status: "in_progress",
        started_at: new Date().toISOString(),
      })
      .eq("id", examRow.id);

    const clientQuestions = questions.map((q: any) => ({
      id: q.id, category: q.category, type: q.type, difficulty: q.difficulty,
      question: q.question, options: q.options, scripture_ref: q.scripture_ref,
    }));

    console.log(`${exam_type} exam ${examRow.id} generated with ${clientQuestions.length} questions`);

    return new Response(
      JSON.stringify({
        exam_id: examRow.id,
        questions: clientQuestions,
        time_limit_seconds: config.timeSeconds,
        exam_type,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Generate diagnostic exam error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
