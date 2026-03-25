import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { studyText, rooms } = await req.json();

    if (!studyText || studyText.length < 100) {
      return new Response(JSON.stringify({ error: "Study text must be at least 100 characters" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!rooms || rooms.length === 0) {
      return new Response(JSON.stringify({ error: "At least one Palace room must be selected" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const roomList = rooms.map((r: string, i: number) => `${i + 1}. ${r}`).join("\n");

    const systemPrompt = `You are Jeeves, the Phototheology Palace AI tutor. You are an expert in the Phototheology method — a systematic Bible study framework structured as an 8-floor palace with specific rooms on each floor.

Your task: Take the user's study text and AMPLIFY it by running it through each of the selected Palace rooms. For each room, provide a deep, substantive analysis that demonstrates mastery of that room's methodology.

CRITICAL RULES:
1. Use KJV Bible text when quoting Scripture
2. Every room section must be at least 2-3 paragraphs of substantive content
3. Always find Christ in the text (Concentration Room lens applies even when not explicitly selected)
4. Use the exact Phototheology codes (SR, IR, CR, DR, etc.) as section headers
5. Connect insights across rooms — show how discoveries in one room illuminate another
6. Extract and highlight "Gems" (striking insights) throughout
7. Present as a single flowing scholarly report with clear room headers
8. End with a "Palace Summary" that synthesizes the key amplified insights
9. Be specific — quote exact verses, name exact types/symbols, identify exact patterns
10. Write in a warm but scholarly pastoral tone

FORMAT:
# 🏛️ Amplified Study Report

## [Room Code] — [Room Name]
[Deep analysis applying this room's methodology to the study text]

...repeat for each selected room...

## 💎 Gems Extracted
[Numbered list of the most striking discoveries]

## 🏛️ Palace Summary
[Synthesis of how all rooms together reveal deeper truth]`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Here is my study text:\n\n---\n${studyText}\n---\n\nPlease amplify this study through the following Palace rooms:\n${roomList}\n\nProvide deep, substantive analysis for each room. Find Christ. Extract gems. Synthesize everything.`
          }
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited — please try again in a moment" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted — please add funds" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const report = data.choices?.[0]?.message?.content || "No report generated.";

    return new Response(JSON.stringify({ report }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Amplify error:", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
