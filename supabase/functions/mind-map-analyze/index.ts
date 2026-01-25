import "https://deno.land/x/xhr@0.3.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MIND_MAP_SYSTEM_PROMPT = `
You are Jeeves, analyzing text through the Phototheology Palace framework for mind map visualization.

YOUR TASK: Analyze the provided text and identify how it maps to the 8-floor Palace structure + the Sanctuary.

THE 8-FLOOR PALACE STRUCTURE:
- Floor 1 (Furnishing): Story Room (SR), Imagination Room (IR), 24FPS Room (24), Bible Rendered (BR), Translation Room (TR), Gems Room (GR)
- Floor 2 (Investigation): Observation Room (OR), Def-Com Room (DC), Symbols/Types Room (ST), Questions Room (QR), Q&A Chains Room (QA)
- Floor 3 (Freestyle): Nature Freestyle (NF), Personal Freestyle (PF), Bible Freestyle (BF), History Freestyle (HF), Listening Room (LR)
- Floor 4 (Next Level): Concentration Room (CR), Dimensions Room (DR), Connect-6 Room (C6), Theme Room (TRm), Time Zone Room (TZ), Parallels Room (PRm), Fruit Room (FRt), Christ Every Chapter (CEC), Room 66 (R66)
- Floor 5 (Vision): Blue Room (BL), Prophecy Room (PR), Three Angels Room (3A), Feasts Room (FR)
- Floor 6 (Three Heavens): Juice Room (JR), plus 8 Cycles and 3 Heavens framework
- Floor 7 (Spiritual): Fire Room (FRm), Meditation Room (MR), Sanctuary Room (SRm)
- Floor 8 (Master): Infinity/Mastery level

SANCTUARY STRUCTURE:
- Camp (outer world)
- Courtyard: Altar of Burnt Offering, Bronze Laver
- Holy Place: Golden Lampstand, Table of Showbread, Altar of Incense
- Most Holy Place: Ark of the Covenant, Mercy Seat, Cherubim

MODE ADJUSTMENTS:
- BEGINNER: Max 5 rooms, simplified language, clear patterns only
- SCHOLAR: All applicable rooms, deep cross-references, scholarly evidence
- PREACHER: Focus on teaching hooks, illustrations, sermon applications
- RESEARCH: Exhaustive analysis, academic rigor, all confidence scores

ANALYSIS REQUIREMENTS:

For each RELEVANT room (skip rooms that don't apply):
1. Identify specific principles/patterns from the text
2. Provide evidence (direct quotes or paraphrases from the text)
3. Generate insight (the "so what" - why this matters)
4. Create visual hook (a memorable image that captures this truth)
5. Confidence score (0-100 based on how clearly text demonstrates this)

For SANCTUARY elements, identify if the text connects to:
- Sacrifice/atonement themes (Altar)
- Cleansing/purification themes (Laver)
- Light/guidance themes (Lampstand)
- Sustenance/fellowship themes (Showbread)
- Prayer/intercession themes (Incense)
- Law/covenant themes (Ark)
- Mercy/grace themes (Mercy Seat)

CROSS-CONNECTIONS to identify:
- Thematic parallels (same theme in different rooms)
- Typological fulfillment (OT type → NT antitype)
- Chronological sequence (time progression)
- Contrast patterns (opposition or inversion)

MANDATORY RULES:
- Return ONLY valid JSON
- Use ONLY the room IDs listed above (lowercase: sr, ir, or, cec, etc.)
- Skip rooms that don't apply - don't force connections
- Be specific with evidence - cite actual text
- Visual hooks should be concrete images, not abstractions
- Scripture quotations must be KJV

RESPONSE FORMAT (JSON only, no markdown):
{
  "overallTheme": "1-2 sentence summary of how this text maps to the Palace",
  "relevantFloors": [1, 2, 4],
  "roomAnalysis": {
    "sr": {
      "applicable": true,
      "principles": [{
        "id": "sr-1",
        "content": "Brief statement of the principle/pattern found",
        "evidence": ["Quote 1 from text", "Quote 2 from text"],
        "insight": "Why this matters - the deeper meaning",
        "visualHook": "A concrete, memorable image",
        "confidence": 85,
        "scriptures": ["John 3:16"]
      }]
    },
    "or": {
      "applicable": false,
      "principles": []
    }
  },
  "sanctuaryAnalysis": {
    "altar-of-burnt-offering": {
      "applicable": true,
      "insights": [{
        "id": "altar-1",
        "content": "Connection to sacrifice theme",
        "evidence": ["Quote from text"],
        "insight": "How this points to Christ's sacrifice",
        "visualHook": "Flames consuming offering on bronze altar",
        "confidence": 90
      }]
    }
  },
  "crossConnections": [{
    "from": "sr",
    "to": "cec",
    "type": "typological",
    "description": "The narrative arc foreshadows Christ's redemptive work"
  }]
}
`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, mode = "scholar" } = await req.json();

    if (!text || typeof text !== "string") {
      return new Response(
        JSON.stringify({ error: "Text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Truncate very long texts
    const truncatedText = text.length > 8000 ? text.substring(0, 8000) + "..." : text;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const modeInstruction = {
      beginner: "MODE: BEGINNER - Keep analysis simple with max 5 rooms.",
      scholar: "MODE: SCHOLAR - Provide comprehensive analysis across all applicable rooms.",
      preacher: "MODE: PREACHER - Focus on teaching hooks and sermon applications.",
      research: "MODE: RESEARCH - Exhaustive academic analysis with all confidence scores.",
    }[mode] || "MODE: SCHOLAR";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: MIND_MAP_SYSTEM_PROMPT + "\n\n" + modeInstruction,
          },
          {
            role: "user",
            content: `Analyze this text and map it to the Phototheology Palace:\n\n${truncatedText}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content || "";

    // Parse JSON from response (handle potential markdown wrapping)
    let analysis;
    try {
      // Remove markdown code blocks if present
      let jsonStr = content;
      if (jsonStr.includes("```json")) {
        jsonStr = jsonStr.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      } else if (jsonStr.includes("```")) {
        jsonStr = jsonStr.replace(/```\n?/g, "");
      }
      analysis = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Content:", content);
      // Return a basic fallback structure
      analysis = {
        overallTheme: "Analysis completed but response format was unexpected",
        relevantFloors: [1, 2],
        roomAnalysis: {
          or: {
            applicable: true,
            principles: [{
              id: "or-1",
              content: "The text contains observable elements that merit further study",
              evidence: [text.substring(0, 100) + "..."],
              insight: "Careful observation is the first step in understanding Scripture",
              visualHook: "A magnifying glass hovering over an open scroll",
              confidence: 70,
            }],
          },
        },
        sanctuaryAnalysis: {},
        crossConnections: [],
      };
    }

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Mind map analysis error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Analysis failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
