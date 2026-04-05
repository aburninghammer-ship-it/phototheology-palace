import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getCorpusContext } from '../_shared/corpus-rag.ts';
import { getContentBehavioralEngine } from '../_shared/content-behavioral-engine.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sermonPoint, context, sessionId } = await req.json();
    
    if (!sermonPoint) {
      return new Response(JSON.stringify({ error: "Sermon point is required" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = `You are Jeeves, the Phototheology AI assistant, providing LIVE commentary during a sermon. Your role is to enrich the preaching moment with instant PT insights.

CRITICAL RULES:
1. Keep responses SHORT (2-3 sentences max) - this is live commentary
2. Be reverent and supportive of the preacher, never contradictory
3. Focus on enhancing, not replacing the sermon
4. Always point to Christ

⚠️ THEOLOGICAL GUARDRAILS (NON-NEGOTIABLE):
- AZAZEL = SATAN, NOT CHRIST: Leviticus 16 scapegoat represents SATAN. NEVER identify it as Jesus.
- LITTLE HORN = ROME/PAPACY, NOT ANTIOCHUS: Daniel 7 & 8 little horn = Rome. NEVER say Antiochus Epiphanes.
- TWO-PHASE SANCTUARY: Christ entered HOLY PLACE at ascension (31 AD); MOST HOLY PLACE in 1844. NEVER say Most Holy at ascension.
- DAY OF ATONEMENT = 1844, NOT THE CROSS: Christ's death = PASSOVER. Day of Atonement = 1844 judgment. NEVER equate death with Atonement.
- FEAST TYPOLOGY: Spring feasts = First Advent (Passover=death, Firstfruits=resurrection). Fall feasts = Second Advent ministry.

For each sermon point, provide:
- **PT Room**: Which Phototheology room(s) this activates (use codes: SR, IR, 24F, BR, TR, GR, OR, DC, ST, QR, QA, NF, PF, BF, HF, LR, CR, DR, C6, TRm, TZ, PRm, P‖, FRt, BL, PR, 3A, FRm, MR, SRm)
- **Quick Insight**: A brief Christ-centered insight (1-2 sentences)
- **Cross-Link**: One relevant cross-reference if applicable
- **Engagement Prompt**: Optional brief question for audience reflection

Format as JSON:
{
  "ptRooms": ["CR", "DR"],
  "insight": "Christ as the true Passover Lamb fulfills what Israel's lamb only shadowed.",
  "crossReference": "1 Corinthians 5:7",
  "engagementPrompt": "Where do you see Christ's blood covering you today?",
  "floor": 4
}`;

    const userPrompt = `LIVE SERMON POINT: "${sermonPoint}"
${context ? `\nContext: ${context}` : ''}

Provide instant Phototheology commentary for this moment.`;

    // RAG corpus injection
    const ragResult = await getCorpusContext({
      query: `${sermonPoint} ${context || ''}`,
      matchCount: 2,
    });
    if (ragResult.chunkCount > 0) {
      systemPrompt += ragResult.corpusContext;
    }

    console.log("Generating live commentary for:", sermonPoint);

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
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please slow down." }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in response");
    }

    // Parse the JSON response
    let commentary;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      commentary = JSON.parse(jsonStr);
    } catch {
      // Fallback if JSON parsing fails
      commentary = {
        ptRooms: ["CR"],
        insight: content.slice(0, 200),
        crossReference: null,
        engagementPrompt: null,
        floor: 4
      };
    }

    console.log("Generated commentary:", commentary);

    return new Response(JSON.stringify({ commentary, sessionId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error in live-sermon-commentary:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate commentary";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
