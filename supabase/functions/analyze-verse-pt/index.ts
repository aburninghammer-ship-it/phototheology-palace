import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { verse_reference, verse_text } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a Phototheology (PT) expert analyzing Bible verses. 

For each verse, identify:
1. Christ-centered interpretation (how does this point to Christ?)
2. Applicable PT dimensions (1D=Literal, 2D=Christ, 3D=Personal, 4D=Church, 5D=Heaven)
3. Cycles (@Ad, @No, @Ab, @Mo, @Cy, @CyC, @Sp, @Re)
4. Horizons (1H=First Heaven/Earth, 2H=Second Heaven/Church Age, 3H=Final New Creation)
5. Sanctuary connections (Gate, Altar, Laver, Lampstand, Table, Incense, Veil, Ark)
6. Feast connections (Passover, Unleavened-Bread, Firstfruits, Pentecost, Trumpets, Atonement, Tabernacles)
7. Walls (Sanctuary Wall, Life of Christ Wall, Great Controversy Wall, Time-Prophecy Wall)
8. Cross-references to related verses with the same PT principles

Return ONLY valid JSON with this structure:
{
  "christ_center": "string explaining how this points to Christ",
  "dimensions": ["1D", "2D", etc.],
  "cycles": ["@Mo", "@CyC", etc.],
  "horizons": ["1H", "2H", "3H"],
  "sanctuary_connections": [{"article": "Altar", "explanation": "..."}],
  "feast_connections": [{"feast": "Passover", "explanation": "..."}],
  "walls": ["Sanctuary Wall", etc.],
  "cross_references": [{"verse": "John 1:29", "reason": "Both show Christ as the Lamb", "principles": ["@Mo", "Altar"]}]
}`;

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
          { role: "user", content: `Analyze this verse using PT principles:\n\nReference: ${verse_reference}\nText: ${verse_text}` }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI analysis failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON response
    let ptInsights;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      ptInsights = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse PT analysis");
    }

    return new Response(JSON.stringify({ pt_insights: ptInsights }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-verse-pt:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
