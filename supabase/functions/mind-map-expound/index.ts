import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { principleContent, insight, seedText, roomTag } = await req.json();

    if (!principleContent || !seedText) {
      throw new Error("Principle content and seed text are required");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a master Phototheology scholar with deep expertise in biblical exegesis and the Palace system. Your task is to EXPOUND on a principle, revealing its DEEP, NON-OBVIOUS connections to the seed text.

CRITICAL RULES:
1. Go BEYOND surface-level connections. Find the hidden theological threads.
2. Every insight must trace back to the specific seed text provided.
3. Use the Palace methodology: types, patterns, dimensions, cross-references.
4. Make connections that would surprise and delight a serious Bible student.
5. Always cite Scripture (KJV preferred) to support your claims.
6. Think typologically - how does this pattern repeat across Scripture?
7. Consider sanctuary implications if applicable.

Respond ONLY with valid JSON in this exact format:
{
  "deepConnection": "A 2-3 sentence profound insight revealing the NON-OBVIOUS connection between this principle and the seed text. This should be something a casual reader would miss.",
  "seedRelevance": "Explain specifically HOW this principle illuminates the seed text in a new way. What did we miss before seeing this connection?",
  "hiddenPattern": "Identify a recurring biblical pattern this principle reveals. Show how it appears across multiple books/eras of Scripture.",
  "practicalDepth": "A transformative application that goes beyond 'pray more' or 'trust God' - something specific and actionable that flows from this deep understanding.",
  "scripturalChain": ["Verse 1", "Verse 2", "Verse 3"],
  "palaceRooms": ["Room code and why it connects"]
}`;

    const userPrompt = `SEED TEXT (the original input being studied):
"""
${seedText.substring(0, 1500)}
"""

PRINCIPLE TO EXPOUND:
"""
${principleContent}
"""

CURRENT INSIGHT:
"""
${insight}
"""

${roomTag ? `PALACE ROOM: ${roomTag}` : ''}

Now EXPOUND this principle. Go deep. Find the hidden connections to the seed. What would a master Bible scholar see that others miss?`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "";

    // Parse JSON from response
    let parsed;
    try {
      // Clean control characters
      const cleaned = aiResponse.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiResponse);
      // Fallback response
      parsed = {
        deepConnection: "This principle reveals a deeper layer of meaning when viewed through the lens of the seed text.",
        seedRelevance: "The connection illuminates patterns that resonate throughout Scripture.",
        hiddenPattern: "This pattern appears across multiple biblical narratives, showing God's consistent methodology.",
        practicalDepth: "Apply this understanding by meditating on how this pattern plays out in your own spiritual journey.",
        scripturalChain: ["John 3:16", "Romans 5:8", "Ephesians 2:8-9"],
        palaceRooms: ["CR - Christ at center of all interpretation"],
      };
    }

    return new Response(
      JSON.stringify(parsed),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("mind-map-expound error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
