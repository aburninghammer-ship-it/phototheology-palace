import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getContentBehavioralEngine } from "../_shared/content-behavioral-engine.ts";
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

CRITICAL GUARDRAILS (ENFORCE STRICTLY):
1. ALWAYS use KJV text - this is mandatory, not optional
2. NEVER claim Hebrews teaches Christ entered the "Most Holy Place" at His ascension
3. The Greek "τὰ ἅγια" (ta hagia) means "the holies/sanctuary" - NOT "Most Holy Place"
4. Christ entered the Holy Place at ascension; Most Holy Place ministry began in 1844
5. If analyzing Hebrews 6:19, 9:12, 9:24, or 10:19 - explicitly clarify the Greek term

HEBREWS SANCTUARY DOCTRINE:
- Hebrews 10:19 KJV: "Having therefore, brethren, boldness to enter into the holiest by the blood of Jesus" 
  → "holiest" (ta hagia) = the sanctuary as a whole, NOT the Most Holy Place specifically
- Hebrews 9:12 KJV: "by his own blood he entered in once into the holy place"
  → "holy place" = the sanctuary, not the inner compartment
- Modern versions incorrectly translate "ta hagia" as "Most Holy Place" - WARN about this

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

**THREE HEAVENS** (Day of the LORD judgment cycles - NOT atmospheric layers!):
⚠️ CRITICAL GUARDRAIL: Never interpret as atmosphere/physical world/spiritual realm!
1H (DoL¹/NE¹) = FIRST Day of the LORD: Babylon destroys Jerusalem (586 BC) → Post-exilic restoration under Cyrus
2H (DoL²/NE²) = SECOND Day of the LORD: Rome destroys Jerusalem (70 AD) → New Covenant/Church as living temple
3H (DoL³/NE³) = THIRD Day of the LORD: Final cosmic judgment → Literal New Heaven and Earth (Rev 21-22)
These are prophetic stages of covenant history, NOT cosmological layers!

**SANCTUARY CONNECTIONS** (Blueprint of Salvation):
Gate, Altar, Laver, Lampstand, Table, Incense, Veil, Ark
Connect to SPECIFIC furniture with biblical reference.
REMEMBER: Christ ministers in the heavenly sanctuary - Holy Place from ascension, Most Holy Place from 1844.

DAY OF ATONEMENT GUARDRAIL (CRITICAL):
- The Day of Atonement is NOT fulfilled in the death of Christ
- Just as Pentecost was fulfilled 50 days AFTER Christ's death, the Day of Atonement points to 1844
- The cross fulfills PASSOVER; Day of Atonement fulfillment began in 1844
- NEVER suggest Christ's death fulfills the Day of Atonement

AZAZEL GUARDRAIL (NON-NEGOTIABLE):
- In Leviticus 16, Azazel (scapegoat) represents SATAN, NOT Christ
- The LORD's goat = Christ; Azazel = Satan bearing guilt for sin
- NEVER identify Azazel/scapegoat as Jesus - that is heresy

LITTLE HORN GUARDRAIL (NON-NEGOTIABLE):
- Daniel 7 little horn = Papal Rome rising from the 10 divisions
- Daniel 8 little horn = Rome (pagan then papal) attacking the sanctuary
- NEVER identify little horn as Antiochus Epiphanes - that is preterism

**FEAST CONNECTIONS** (Israel's Calendar → Christ):
Passover, Unleavened Bread, Firstfruits, Pentecost, Trumpets, Atonement, Tabernacles
Show how verse correlates to feast significance.

**WALLS** (Palace Architecture):
- Sanctuary Wall: Texts tied to tabernacle/temple system
- Life of Christ Wall: Incarnation, ministry, death, resurrection
- Great Controversy Wall: Cosmic battle, Satan vs Christ
- Time Prophecy Wall: Daniel/Revelation timelines

**HEBREW/GREEK ANALYSIS**:
Identify 2-4 key words with:
- Original word (Hebrew/Greek)
- Transliteration
- Strong's number (if applicable)
- Core meaning
IMPORTANT: For Hebrews passages, always clarify that "ta hagia" means "the holies/sanctuary" not "Most Holy Place"

**CROSS-REFERENCES**:
Provide 3-5 related verses showing same PT principles with:
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
  "hebrew_greek": {
    "key_words": [
      {"word": "ἀγαπάω", "transliteration": "agapaō", "strong": "G25", "meaning": "sacrificial love"},
      {"word": "κόσμος", "transliteration": "kosmos", "strong": "G2889", "meaning": "world/humanity"}
    ]
  },
  "cross_references": [
    {"verse": "John 1:29", "reason": "Both show Christ as Lamb", "principles": ["@Mo", "Altar", "2D"]},
    {"verse": "Romans 5:8", "reason": "God's love demonstrated in Christ", "principles": ["@CyC", "2D", "3D"]}
  ]
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
      let jsonStr = content;
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1].trim();
      }
      
      // Parse and normalize the response
      const parsed = JSON.parse(jsonStr);
      
      // Normalize dimensions if they're objects with explanations
      if (parsed.dimensions && typeof parsed.dimensions === 'object') {
        if (Array.isArray(parsed.dimensions)) {
          // If it's an array but items are strings with explanations, extract just the codes
          parsed.dimensions = parsed.dimensions.map((dim: any) => {
            if (typeof dim === 'string') {
              // Extract dimension code (1D, 2D, etc.) from string like "1D: explanation"
              const match = dim.match(/^(\d+D)/);
              return match ? match[1] : dim;
            }
            return dim;
          });
        } else {
          // If it's an object, extract just the keys
          parsed.dimensions = Object.keys(parsed.dimensions);
        }
      }
      
      ptInsights = parsed;
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      console.error("Parse error:", parseError);
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
