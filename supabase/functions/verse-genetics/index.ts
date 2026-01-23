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
    const { book, chapter, verse, verseText } = await req.json();

    console.log("Verse Genetics request:", { book, chapter, verse });

    const prompt = `You are a Phototheology expert analyzing verse relationships (Verse Genetics).

Verse: ${book} ${chapter}:${verse}
Text: "${verseText}"

Find related verses across Scripture using the Phototheology "Verse Genetics" framework:

1. SIBLINGS (same theme, direct connection) - verses that share the same core theological idea or wording
2. COUSINS (related by typology or pattern) - verses connected through types, shadows, or prophetic patterns
3. DISTANT RELATIVES (thematic echo across Testaments) - verses that share themes but are separated by time/Testament

For each relationship found, provide:
- The reference (e.g., "Romans 5:8")
- A brief excerpt of the verse text
- The relationship type (sibling/cousin/distant)
- The connecting theme
- A confidence percentage (how strong is this connection)

Return 5-8 related verses total, prioritizing the strongest connections.

Format your response as JSON:
{
  "relations": [
    {
      "reference": "Romans 5:8",
      "text": "But God commendeth his love toward us...",
      "relationship": "sibling",
      "theme": "God's sacrificial love",
      "confidence": 95
    }
  ]
}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": Deno.env.get("ANTHROPIC_API_KEY") || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        messages: [
          { role: "user", content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }

    const aiData = await response.json();
    const content = aiData.content?.[0]?.text || "{}";
    
    // Parse the JSON response
    let relations = [];
    try {
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        relations = parsed.relations || [];
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
    }

    return new Response(
      JSON.stringify({ 
        relations,
        book,
        chapter,
        verse
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Verse Genetics error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        relations: []
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
