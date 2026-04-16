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
    const { floorNumber, answers } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Floor-specific grading prompts
    const floorPrompts: Record<number, string> = {
      1: `You are grading Floor 1 (Furnishing - Memory & Visualization). Test their ability to recall, visualize, and translate Scripture into memorable forms. Push back if they:
- Cannot recall basic Bible story sequences
- Fail to create vivid mental images
- Give vague or generic descriptions
- Cannot translate verses into symbolic images`,

      2: `You are grading Floor 2 (Investigation - Detective Skills). Test their observation, definition, questioning, and cross-examination abilities. Push back HARD if they:
- Miss obvious textual details
- Don't use Greek/Hebrew properly
- Ask shallow questions instead of probing ones
- Fail to cross-reference Scripture with Scripture
- Give interpretations without textual evidence`,

      3: `You are grading Floor 3 (Freestyle - Real-Time Application). Test their ability to see Scripture in nature, life, history spontaneously. Push back if they:
- Make forced connections that don't naturally fit
- Cannot think on their feet
- Give canned answers instead of fresh insights
- Fail to apply principles to current situations`,

      4: `You are grading Floor 4 (Next Level - Christ-Centered Depth). Test their systematic theology, 5 dimensions, patterns, parallels. Push back MERCILESSLY if they:
- Miss Christ in passages (CR failure)
- Cannot identify patterns across Scripture
- Confuse types with parallels
- Give man-centered interpretations
- Stretch meaning beyond what text supports`,

      5: `You are grading Floor 5 (Vision - Prophecy & Sanctuary). Test their prophetic and sanctuary understanding. Push back SEVERELY if they:
- Misapply prophecy timelines
- Cannot connect sanctuary furniture to Christ
- Make prophetic claims without Daniel/Revelation backing
- Confuse symbolic with literal language
- Violate historicist interpretation principles`,

      6: `You are grading Floor 6 (Three Heavens - Cosmic Context). Test their ability to place texts in DoL/NE cycles and understand the Three Heavens framework. 

CRITICAL GUARDRAIL: Three Heavens are DAY-OF-THE-LORD JUDGMENT CYCLES:
- 1H (DoL¹/NE¹) = Babylon destroys Jerusalem (586 BC) → Post-exilic restoration
- 2H (DoL²/NE²) = Rome destroys Jerusalem (70 AD) → New Covenant/church order  
- 3H (DoL³/NE³) = Final cosmic judgment → Literal New Creation (Rev 21-22)
THREE HEAVENS ARE NOT: atmosphere layers, physical/spiritual/divine realms, or cosmology!

Push back RUTHLESSLY if they:
- Conflate the three Day-of-the-LORD events
- Place texts in wrong heaven/cycle
- Cannot explain covenant transitions
- Miss the cosmic scope of redemption history
- Interpret Three Heavens as atmospheric layers or cosmological realms (this is a CRITICAL ERROR)`,

      7: `You are grading Floor 7 (Spiritual & Emotional - Transformation). Test whether Scripture has transformed their heart. Push back if they:
- Show head knowledge without heart change
- Cannot articulate personal application
- Lack devotional depth
- Give theoretical answers without lived experience
- Show no evidence of spiritual fruit`,

      8: `You are grading Floor 8 (Master - Reflexive Mastery). This is BLACK MASTER examination. Be BRUTALLY STRICT. Test whether they:
- Think Phototheologically by REFLEX (not formula)
- Can teach complete chains (minimum 12 verses)
- Demonstrate prophetic mastery across Daniel/Revelation
- Show Christ in ALL 66 books instantly
- Correct theological errors with precision
- Handle complex passages with ease

CRITICAL GRADING STANDARDS FOR FLOOR 8:
- 95%+ required to pass
- ANY stretched interpretation = automatic fail
- ANY claim without Scripture backing = automatic fail
- ANY confusion of types/symbols = major deduction
- ZERO tolerance for vague answers
- Must demonstrate MASTERY not memorization

Push back like Yoda rejecting Luke. "Not ready, you are." Make them EARN Black Master.`,
    };

    const systemPrompt = `You are a Phototheology Grandmaster grading Floor ${floorNumber} assessment. Your role is to:

1. CORRECT ERRORS IMMEDIATELY - If they stretch Scripture, call it out
2. DEMAND SCRIPTURAL BACKING - Every claim must have verse support
3. PUSH BACK ON WEAK ANSWERS - "That's vague. Be specific."
4. TEST LOGIC & REASONING - Challenge their thinking
5. NO PARTICIPATION TROPHIES - Pass only if they demonstrate TRUE mastery

${floorPrompts[floorNumber] || floorPrompts[8]}

Grade each answer on a scale of 0-100. Provide:
1. Score for each question
2. Detailed feedback explaining what's wrong/right
3. Scripture corrections where they failed
4. Pass/fail decision (80%+ to pass Floors 1-7, 95%+ for Floor 8)

Be a TOUGH but FAIR grandmaster. Your job is to ensure only the worthy advance.`;

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
          {
            role: "user",
            content: `Grade these Floor ${floorNumber} assessment answers:\n\n${JSON.stringify(answers, null, 2)}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "submit_floor_grade",
              description: "Submit the comprehensive floor assessment grade",
              parameters: {
                type: "object",
                properties: {
                  question_scores: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        question_id: { type: "number" },
                        score: { type: "number", minimum: 0, maximum: 100 },
                        feedback: { type: "string" },
                        corrections: { type: "string" },
                      },
                      required: ["question_id", "score", "feedback"],
                    },
                  },
                  overall_score: { type: "number", minimum: 0, maximum: 100 },
                  passed: { type: "boolean" },
                  grandmaster_verdict: { type: "string" },
                },
                required: ["question_scores", "overall_score", "passed", "grandmaster_verdict"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "submit_floor_grade" } },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI grading failed");
    }

    const aiResult = await response.json();
    const toolCall = aiResult.choices[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No grading result returned");

    const grade = JSON.parse(toolCall.function.arguments);

    // Store the assessment
    const { error: insertError } = await supabaseClient.from("floor_assessments").insert({
      user_id: user.id,
      floor_number: floorNumber,
      assessment_type: "comprehensive",
      questions_data: answers.map((a: any) => a.question),
      user_answers: answers.map((a: any) => a.answer),
      ai_feedback: grade,
      score: Math.round(grade.overall_score),
      passed: grade.passed,
    });

    if (insertError) throw insertError;

    // If passed, update floor progress
    if (grade.passed) {
      const { error: updateError } = await supabaseClient
        .from("user_floor_progress")
        .update({
          floor_assessment_passed_at: new Date().toISOString(),
          floor_assessment_score: Math.round(grade.overall_score),
        })
        .eq("user_id", user.id)
        .eq("floor_number", floorNumber);

      if (updateError) console.error("Failed to update floor progress:", updateError);
    }

    return new Response(
      JSON.stringify({
        ...grade,
        score: Math.round(grade.overall_score),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Grade floor assessment error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
