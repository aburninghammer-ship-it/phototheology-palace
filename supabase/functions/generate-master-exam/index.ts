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

    const systemPrompt = `You are the Phototheology Palace Master Examiner. Generate a comprehensive master exam of EXACTLY 50 unique questions testing knowledge across the entire Phototheology system.

You MUST return ONLY a valid JSON object with a "questions" array. No markdown, no code blocks, no commentary — just raw JSON.

ENTROPY SEED: ${entropySeed} — Use this to ensure unique question selection every time.

CONTENT DOMAINS & QUESTION DISTRIBUTION:

1. PALACE ROOMS & METHODOLOGY (10 questions)
Palace has 8 floors with rooms:
- Floor 1 (Furnishing): Story Room (SR), Imagination Room (IR), 24FPS Room (24), Bible Rendered (BR), Translation Room (TR), Gems Room (GR)
- Floor 2 (Investigation): Observation Room (OR), Def-Com Room (DC), Symbols/Types Room (ST), Questions Room (QR), Q&A Room (QA)
- Floor 3 (Freestyle): Nature Freestyle (NF), Personal Freestyle (PF), Bible Freestyle (BF), History/Social Freestyle (HF), Listening Room (LR)
- Floor 4 (Next Level): Concentration Room (CR), Dimensions Room (DR), Connect 6 (C6), Theme Room (TRm), Time Zone (TZ), Patterns Room (PRm), Parallels Room (P‖), Fruit Room (FRt), Christ in Every Chapter (CEC), Room 66 (R66)
- Floor 5 (Vision): Blue Room/Sanctuary (BL), Prophecy Room (PR), Three Angels' Room (3A), Feasts Room
- Floor 6 (Three Heavens): 1H, 2H, 3H, Cycles, Judgment Room, Frameworks, Mathematics, Summary, Master Eight
- Floor 7 (Spiritual/Emotional Transformation)
- Floor 8 (Master/Reflexive Mastery)
Test: room purposes, methodologies, core questions, which floor/room for which skill.

2. APOLOGETICS / AATS (8 questions)
22 War College avatars across 3 rings:
- Ring 1 (Non-belief): atheist, scientist, agnostic, secular-scholar, philosopher, internet-skeptic, new-age
- Ring 2 (Non-Christian): muslim, jewish, bhi, mormon
- Ring 3 (Intra-Christian): evangelical, catholic, jw, progressive-christian, former-sda, offshoot-sda, skeptical-exsda, anti-prophet, preterist, futurist, pentecostal
Test: avatar arguments, SDA distinctive responses, ring classifications, apologetics strategies.

3. GEMS & TYPOLOGY (7 questions)
7 gem categories: typology, parallel, prophecy, wordplay, numerics, chiasm, symbol
Depths: beginner, intermediate, advanced
Examples: Passover Lamb, Bronze Serpent, Isaac's Sacrifice, Joseph as Christ type, Babel→Pentecost parallel
Test: identify gem types, match OT→NT connections, explain typological significance.

4. PROPHECY (6 questions)
6 time prophecies: @120 (120 years, probation), @400 (400 years, affliction), @70y (70 years, captivity), @490 (490 days/years, messianic), @1260 (1260 days/years, persecution), @2300 (2300 days/years, judgment)
Principles: Day-Year Principle, Recapitulation, Starting Points, Prophetic Time Units
Test: calculations, historical fulfillments, starting/ending points, spiritual significance.

5. SANCTUARY (5 questions)
Furniture: Altar of Sacrifice (courtyard, Christ's death), Laver (courtyard, baptism), Table of Shewbread (holy place, Bread of Life), Lampstand/Menorah (holy place, Light), Altar of Incense (holy place, intercession), Ark of Covenant (most holy, law/righteousness), Veil (between rooms, access through Christ)
Test: furniture meanings, gospel progression, Christ connections, personal/church applications.

6. CHRIST TYPES (5 questions)
Christ revealed in every book of the Bible. Categories: type, prophecy, title, symbol, theme, appearance.
Examples: Seed of the Woman (Gen 3:15), Ark of Salvation, Isaac the Beloved Son, Melchizedek Priest-King, Passover Lamb (Exod 12)
Test: identify Christ in specific books, match types to fulfillments, explain category distinctions.

7. PATTERNS & THEMES (5 questions)
Pattern categories: testing, election, deliverance, covenant, judgment, provision, encounter, course, structure, typology
Course patterns: Waters Course, Mountains Course
Three Heavens as Day-of-the-Lord cycles: 1H=Babylon destroys Jerusalem (586BC), 2H=Rome destroys Jerusalem (70AD), 3H=Final cosmic judgment
Test: identify pattern types, trace patterns across Scripture, explain DoL cycles.

8. MEMORIZATION & COURSES (4 questions)
5 Dimensions: Literal, Christ, Me, Church, Heaven
Room methodologies, study techniques, verse chain building
Test: apply dimensions to passages, identify correct methodology for scenarios.

QUESTION TYPE DISTRIBUTION:
- Multiple Choice (MC): ~20 questions — 4 options each, only one correct
- True/False (TF): ~15 questions — include nuanced statements that test real understanding
- Sentence (SA): ~15 questions — require 1-3 sentence answers; include a grading_rubric with key points

DIFFICULTY DISTRIBUTION:
- 30% Intermediate (15 questions)
- 50% Advanced (25 questions)
- 20% Master (10 questions)

CRITICAL RULES:
- Every question MUST have a correct_answer and explanation
- MC questions must have exactly 4 options
- TF correct_answer must be exactly "True" or "False"
- SA questions must have a grading_rubric listing 2-4 key points worth partial credit
- Vary questions — do NOT repeat similar questions
- Use specific Scripture references where applicable
- Questions should test UNDERSTANDING, not just recall

OUTPUT FORMAT — return ONLY this JSON (no markdown, no code fences):
{
  "questions": [
    {
      "id": 1,
      "category": "palace_rooms",
      "type": "mc",
      "difficulty": "intermediate",
      "question": "Which floor of the Phototheology Palace focuses on...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": "Option B",
      "explanation": "Floor 2 focuses on...",
      "scripture_ref": "John 5:39"
    },
    {
      "id": 2,
      "category": "apologetics",
      "type": "tf",
      "difficulty": "advanced",
      "question": "The Anti-Prophet Critic avatar belongs to Ring 2...",
      "correct_answer": "False",
      "explanation": "The Anti-Prophet Critic belongs to Ring 3..."
    },
    {
      "id": 3,
      "category": "gems_typology",
      "type": "sa",
      "difficulty": "master",
      "question": "Explain how Joseph serves as a type of Christ...",
      "correct_answer": "Joseph was betrayed by his brothers, sold for silver...",
      "explanation": "The Joseph-Christ typology includes...",
      "grading_rubric": ["Mentions betrayal parallel", "Notes exaltation after suffering", "Cites specific Scripture"]
    }
  ]
}

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

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      await supabaseClient
        .from("master_exam_attempts")
        .update({ status: "abandoned" })
        .eq("id", examRow.id);

      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please wait a moment and try again.");
      }
      if (response.status === 402) {
        throw new Error("AI credits exhausted.");
      }
      throw new Error(`AI generation failed (${response.status})`);
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
