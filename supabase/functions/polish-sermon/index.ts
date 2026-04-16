import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a Sermon Coach trained in PhotoTheology principles and classical homiletics.

Your role is NOT to rewrite the sermon.
Your role is to REVEAL what's already there and what COULD be there.

⚠️ CRITICAL THREE HEAVENS GUARDRAIL:
The "Three Heavens" in Phototheology are NOT atmospheric layers (sky/space/God's throne) or generic categories (physical/spiritual/divine).
They are THREE DAY-OF-THE-LORD JUDGMENT CYCLES — prophetic horizons of covenant history:
- 1H (DoL¹/NE¹) = Babylon destroys Jerusalem (586 BC) → Post-exilic restoration under Cyrus. "New heavens and earth" = renewed civic-worship order (Isa 65-66 typological horizon, Ezra-Nehemiah).
- 2H (DoL²/NE²) = Rome destroys Jerusalem (70 AD) → New-Covenant/heavenly sanctuary order. Temple transfers from stone to body/people (John 2:19, 1 Cor 3:16). Christ ministers in the heavenly sanctuary (Heb 8-10). Kingdom that cannot be shaken (Heb 12:28).
- 3H (DoL³/NE³) = Final cosmic judgment → Literal New Heavens and New Earth (2 Pet 3, Rev 21-22). No temple needed, the Lamb is its light.
🚫 NEVER use: "Physical/Earthly", "Spiritual/Cosmic", "Divine/New Creation" as Three Heavens labels.
✅ ALWAYS use the Day-of-the-Lord prophetic horizon framework above.

ANALYSIS FRAMEWORK:

1. AMPLIFY - Find gems the preacher planted but didn't polish:
   - Phrases with deeper meaning than they realized
   - Scripture connections they touched but didn't develop
   - Typological threads they started but didn't complete

2. DISCOVER - Surface missed opportunities:
   - Christ connections they may not have seen
   - Sanctuary patterns relevant to their text
   - Prophetic frameworks that could deepen the message
   - "Three Heavens" applications if appropriate (using the Day-of-the-Lord framework above)

3. TIGHTEN - Identify structural improvements:
   - Redundancies to cut
   - Transitions to smooth
   - Points to sharpen
   - Illustrations that compete with the text

4. ARC - Analyze emotional and theological flow:
   - Where is the current climax?
   - Is the "Oh Wow" moment positioned correctly?
   - Does the buildup earn the payoff?

TONE: Coach, not critic. Encouraging, not condescending.
Every suggestion should feel like a gift, not a correction.

IMPORTANT:
- Return your result by calling the provided tool.
- Do not wrap output in markdown.
- Fill every field; use empty arrays ([]) rather than omitting keys.`;

const POLISH_ANALYSIS_TOOL = {
  type: "function",
  function: {
    name: "return_polish_analysis",
    description: "Return a structured sermon polish analysis in the expected schema.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["snapshot", "amplify", "missed", "tighten", "arc", "ptEnhancement", "checklist"],
      properties: {
        snapshot: {
          type: "object",
          additionalProperties: false,
          required: [
            "structureScore",
            "structureNote",
            "scriptureDensity",
            "scriptureDensityNote",
            "christConnection",
            "christConnectionNote",
            "applicationClarity",
            "applicationClarityNote",
            "emotionalArc",
            "emotionalArcNote",
            "estimatedLength",
            "pointCount",
            "scriptureReferences",
          ],
          properties: {
            structureScore: { type: "integer", minimum: 0, maximum: 100 },
            structureNote: { type: "string" },
            scriptureDensity: { type: "integer", minimum: 0, maximum: 100 },
            scriptureDensityNote: { type: "string" },
            christConnection: { type: "integer", minimum: 0, maximum: 100 },
            christConnectionNote: { type: "string" },
            applicationClarity: { type: "integer", minimum: 0, maximum: 100 },
            applicationClarityNote: { type: "string" },
            emotionalArc: { type: "integer", minimum: 0, maximum: 100 },
            emotionalArcNote: { type: "string" },
            estimatedLength: { type: "string" },
            pointCount: { type: "string" },
            scriptureReferences: { type: "integer", minimum: 0 },
          },
        },
        amplify: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            required: ["quote", "insight", "suggestion"],
            properties: {
              quote: { type: "string" },
              insight: { type: "string" },
              suggestion: { type: "string" },
            },
          },
        },
        missed: {
          type: "object",
          additionalProperties: false,
          required: ["typological", "sanctuary", "prophetic", "threeHeavens"],
          properties: {
            typological: { type: "array", items: { type: "string" } },
            sanctuary: { type: "array", items: { type: "string" } },
            prophetic: { type: "array", items: { type: "string" } },
            threeHeavens: { type: "array", items: { type: "string" } },
          },
        },
        tighten: {
          type: "object",
          additionalProperties: false,
          required: ["cut", "clarify", "strengthen"],
          properties: {
            cut: { type: "array", items: { type: "string" } },
            clarify: { type: "array", items: { type: "string" } },
            strengthen: { type: "array", items: { type: "string" } },
          },
        },
        arc: {
          type: "object",
          additionalProperties: false,
          required: ["currentFlow", "issue", "suggestedFix", "climaxPosition"],
          properties: {
            currentFlow: { type: "string" },
            issue: { type: "string" },
            suggestedFix: { type: "string" },
            climaxPosition: { type: "string" },
          },
        },
        ptEnhancement: {
          type: "object",
          additionalProperties: false,
          required: ["currentDimensions", "missingDimensions", "suggestions"],
          properties: {
            currentDimensions: { type: "array", items: { type: "string" } },
            missingDimensions: { type: "array", items: { type: "string" } },
            suggestions: {
              type: "object",
              additionalProperties: false,
              required: ["observationRoom", "concentrationRoom", "symbolsRoom", "sanctuaryRoom", "fireRoom"],
              properties: {
                observationRoom: { type: "array", items: { type: "string" } },
                concentrationRoom: { type: "array", items: { type: "string" } },
                symbolsRoom: { type: "array", items: { type: "string" } },
                sanctuaryRoom: { type: "array", items: { type: "string" } },
                fireRoom: { type: "array", items: { type: "string" } },
              },
            },
          },
        },
        checklist: {
          type: "object",
          additionalProperties: false,
          required: ["structure", "content", "delivery", "spiritual"],
          properties: {
            structure: { type: "array", items: { type: "string" } },
            content: { type: "array", items: { type: "string" } },
            delivery: { type: "array", items: { type: "string" } },
            spiritual: { type: "array", items: { type: "string" } },
          },
        },
      },
    },
  },
} as const;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sermonText, mainText, centralTheme, analysisDepth } = await req.json();

    if (!sermonText || sermonText.length < 50) {
      return new Response(
        JSON.stringify({ error: "Please provide a sermon with at least 50 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Adjust prompt based on analysis depth
    let depthInstruction = "";
    switch (analysisDepth) {
      case "quick":
        depthInstruction =
          "Provide a QUICK analysis. Focus on the top 2-3 insights in each category. Keep it brief and actionable.";
        break;
      case "full":
        depthInstruction =
          "Provide a COMPREHENSIVE PhotoTheology analysis. Go deep into typology, sanctuary patterns, prophetic frameworks, and all PT dimensions. Leave no stone unturned.";
        break;
      default: // deep
        depthInstruction =
          "Provide a thorough analysis covering all categories with meaningful depth. Balance comprehensiveness with clarity.";
    }

    const userPrompt = `Analyze this sermon draft and provide coaching feedback.

MAIN TEXT: ${mainText || "Not specified"}
CENTRAL THEME: ${centralTheme || "Not specified"}

ANALYSIS DEPTH: ${depthInstruction}

SERMON DRAFT:
"""
${sermonText}
"""

Remember: Be a coach, not a critic. Celebrate what's working before suggesting improvements. Every suggestion should feel like a gift.`;

    console.log("Calling Lovable AI Gateway for sermon polish...");
    console.log("Sermon length:", sermonText.length, "characters");
    console.log("Analysis depth:", analysisDepth);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        temperature: 0.2,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        tools: [POLISH_ANALYSIS_TOOL],
        tool_choice: { type: "function", function: { name: "return_polish_analysis" } },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message;

    // Prefer tool-calling output (much more reliable than JSON-in-text)
    const toolArgs = message?.tool_calls?.[0]?.function?.arguments as string | undefined;

    let analysis: unknown;

    if (toolArgs) {
      console.log("Received tool call response, parsing arguments...");
      try {
        analysis = JSON.parse(toolArgs);
      } catch (e) {
        console.error("Tool arguments JSON.parse failed:", e);
        throw new Error("Failed to parse structured analysis output");
      }
    } else {
      // Fallback: attempt to parse content
      const content = message?.content as string | undefined;
      if (!content) throw new Error("No tool call or content in AI response");

      console.log("No tool call found; falling back to parsing content as JSON...");

      let cleanContent = content.trim();

      // Remove markdown code blocks
      if (cleanContent.startsWith("```json")) cleanContent = cleanContent.slice(7);
      else if (cleanContent.startsWith("```")) cleanContent = cleanContent.slice(3);
      if (cleanContent.endsWith("```")) cleanContent = cleanContent.slice(0, -3);
      cleanContent = cleanContent.trim();

      try {
        analysis = JSON.parse(cleanContent);
      } catch {
        const firstBrace = cleanContent.indexOf("{");
        const lastBrace = cleanContent.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          analysis = JSON.parse(cleanContent.substring(firstBrace, lastBrace + 1));
        } else {
          throw new Error("Could not find valid JSON in AI response");
        }
      }
    }

    console.log("Successfully parsed sermon analysis");

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in polish-sermon function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to analyze sermon" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

