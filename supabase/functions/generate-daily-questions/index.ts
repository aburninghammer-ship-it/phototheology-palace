import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PALACE_PRINCIPLE_AREAS = [
  { area: "Sanctuary Blueprint", hint: "Ask about sanctuary furniture, the tabernacle layout, or how the sanctuary reveals salvation" },
  { area: "Christ Types & Shadows", hint: "Ask about OT characters or events that foreshadow Christ — Joseph, Moses, David, the Passover lamb" },
  { area: "Prophetic Timelines", hint: "Ask about Daniel's prophecies, the 2300 days, the 70 weeks, or Revelation's beasts and angels" },
  { area: "Pattern Recognition", hint: "Ask about recurring numbers (3, 7, 12, 40), cycles, or repeated story structures in Scripture" },
  { area: "The 5 Perspectives", hint: "Ask to see a verse through Literal, Christ-centered, Personal, Church, and Heavenly lenses" },
  { area: "Verse Genetics & Cross-References", hint: "Ask how two distant verses are related — find 'sibling' and 'cousin' verses" },
  { area: "Observation & Investigation", hint: "Ask to investigate small details in a passage — names, numbers, sequence, word choices" },
  { area: "Nature & Freestyle Connections", hint: "Ask how everyday objects or nature scenes illustrate biblical truth" },
  { area: "The 8 Cycles of History", hint: "Ask about how history repeats from Adam to the Remnant in covenant cycles" },
  { area: "Symbols & Types Decoding", hint: "Ask about biblical symbols — water, fire, oil, bread, wine, rock, lion, lamb" },
  { area: "The Three Heavens Framework", hint: "Ask about how prophecies apply to different eras — Babylon's fall, 70 AD, or the final new earth" },
  { area: "The Fruit Test", hint: "Ask about how to test whether an interpretation is spiritually healthy and Christ-honoring" },
  { area: "Ellen White & Spirit of Prophecy", hint: "Ask about prophetic gift, fulfilled predictions, or how her writings illuminate Scripture" },
  { area: "Apologetics & Defense", hint: "Ask about defending biblical doctrines — Sabbath, state of the dead, the sanctuary" },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    const supabase = createClient(supabaseUrl, supabaseKey);

    const today = new Date().toISOString().split("T")[0];

    // Check if we already generated for today
    const { data: existing } = await supabase
      .from("generated_sample_questions")
      .select("id")
      .eq("generation_date", today)
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ message: "Already generated for today", date: today }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Pick 6 random principle areas
    const shuffled = [...PALACE_PRINCIPLE_AREAS].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 6);

    if (!lovableKey) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const prompt = `Generate exactly 6 Bible study sample questions for a chat interface. Each question should be engaging, specific, and invite deep study.

For each question, I'll give you the theological area it should explore. Make the question feel natural and curious — like something a real student would ask. Keep each question under 60 characters so it fits on a button.

The 6 areas are:
${selected.map((s, i) => `${i + 1}. ${s.area}: ${s.hint}`).join("\n")}

Return a JSON array of exactly 6 objects, each with:
- "text": the question text (under 60 chars)
- "emoji": one relevant emoji
- "principle": which Palace principle area this targets (use the area name I gave you)

IMPORTANT: Questions must be specific and intriguing, NOT generic. 
BAD: "What does the Bible say about love?"
GOOD: "Why did Jesus weep if He knew He'd raise Lazarus?"
GOOD: "What do the 5 stones David picked up really mean?"
GOOD: "How does the altar of incense point to Christ?"`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: "You are a Bible study question generator. Return ONLY valid JSON — no markdown, no code fences. Return an array of 6 objects." },
          { role: "user", content: prompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "save_questions",
            description: "Save the 6 generated sample questions",
            parameters: {
              type: "object",
              properties: {
                questions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      text: { type: "string", description: "Question text, under 60 characters" },
                      emoji: { type: "string", description: "One emoji" },
                      principle: { type: "string", description: "Palace principle area name" },
                    },
                    required: ["text", "emoji", "principle"],
                  },
                  minItems: 6,
                  maxItems: 6,
                },
              },
              required: ["questions"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "save_questions" } },
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    
    // Extract from tool call
    let questions;
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      questions = parsed.questions;
    } else {
      throw new Error("No tool call in AI response");
    }

    if (!Array.isArray(questions) || questions.length !== 6) {
      throw new Error("Invalid question count: " + JSON.stringify(questions).slice(0, 200));
    }

    // Store in DB
    const { error: insertError } = await supabase
      .from("generated_sample_questions")
      .insert({
        generation_date: today,
        questions,
      });

    if (insertError) throw insertError;

    return new Response(JSON.stringify({ success: true, date: today, questions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("generate-daily-questions error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
