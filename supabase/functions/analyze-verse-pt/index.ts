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

    const systemPrompt = `You are a Phototheology Master analyzing Scripture through the comprehensive 8-Floor Palace framework.

For each verse, provide deep analysis across these dimensions:

**CHRIST-CENTERED INTERPRETATION**:
Every text must reveal Christ (John 5:39, Luke 24:27). Show HOW Christ appears in this specific verse.

**PT DIMENSIONS** (5D Analysis):
1D = Literal (what text says plainly)
2D = Christ (how it points to Jesus)
3D = Personal (application to individual life)
4D = Church (corporate body, ecclesiology)
5D = Heaven (celestial realm, eternal reality)

**CYCLES** (Redemption History):
@Ad = Adamic (Eden → Promise)
@No = Noahic (Flood → Covenant)
@Ab = Abrahamic (Call → Nations)
@Mo = Mosaic (Exodus → Sanctuary)
@Cy = Cyrusic (Exile → Return)
@CyC = Cyrus-Christ (Type → Antitype)
@Sp = Spirit (Pentecost → Mission)
@Re = Remnant (Final witness → Second Coming)

**THREE HEAVENS** (Day of the LORD stages):
1H (DoL¹/NE¹) = Babylon destroys Jerusalem → Post-exilic restoration
2H (DoL²/NE²) = 70 AD → New Covenant/Heavenly sanctuary order
3H (DoL³/NE³) = Final judgment → Literal New Creation

**SANCTUARY CONNECTIONS** (Blueprint of Salvation):
Gate, Altar, Laver, Lampstand, Table, Incense, Veil, Ark
Connect to SPECIFIC furniture with biblical reference.

**FEAST CONNECTIONS** (Israel's Calendar → Christ):
Passover, Unleavened Bread, Firstfruits, Pentecost, Trumpets, Atonement, Tabernacles
Show how verse correlates to feast significance.

**WALLS** (Palace Architecture):
- Sanctuary Wall: Texts tied to tabernacle/temple system
- Life of Christ Wall: Incarnation, ministry, death, resurrection
- Great Controversy Wall: Cosmic battle, Satan vs Christ
- Time Prophecy Wall: Daniel/Revelation timelines

**CROSS-REFERENCES**:
Provide related verses showing same PT principles with:
- Verse reference (book chapter:verse)
- Reason for connection
- PT principles shared (dimensions, cycles, sanctuary, etc.)

Return ONLY valid JSON with this structure:
{
  "christ_center": "Explicit explanation of how Christ appears in this verse",
  "dimensions": ["1D", "2D", "3D", "4D", "5D"],
  "cycles": ["@Mo", "@CyC"],
  "horizons": ["1H", "2H", "3H"],
  "sanctuary_connections": [{"article": "Altar", "explanation": "Specific connection with reference"}],
  "feast_connections": [{"feast": "Passover", "explanation": "How verse relates to feast"}],
  "walls": ["Sanctuary Wall", "Life of Christ Wall"],
  "cross_references": [{"verse": "John 1:29", "reason": "Both show Christ as Lamb", "principles": ["@Mo", "Altar"]}]
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
