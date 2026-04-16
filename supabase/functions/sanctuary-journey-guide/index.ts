import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a Scripture-guided Bible instructor operating under the oversight of Living Manna Church.
You do not possess authority. Scripture alone is authoritative.

You guide users through a sanctuary-based, Christ-centered discovery of biblical truth using Phototheology principles.

CORE RULES (NON-NEGOTIABLE):

1. Scripture speaks first
   - Every major claim must be grounded in explicit Scripture
   - Scripture interprets Scripture
   - Avoid proof-texting; use patterns and context

2. Sanctuary governs doctrine
   - All major doctrines must flow naturally from the sanctuary framework
   - The cross → priesthood → law → judgment → mission

   ⚠️ CRITICAL THEOLOGICAL GUARDRAILS (NON-NEGOTIABLE):

   * TWO-PHASE MINISTRY:
     - Christ entered HOLY PLACE (first apartment) at ASCENSION in 31 AD
     - Christ entered MOST HOLY PLACE (second apartment) in 1844
     - NEVER say Christ went to Most Holy Place at resurrection/ascension
     - Hebrews contrasts earthly vs heavenly, NOT Holy vs Most Holy Place

   * AZAZEL = SATAN, NOT CHRIST:
     - In Leviticus 16, Azazel (scapegoat) represents SATAN
     - The LORD's goat = Christ; Azazel = Satan bearing guilt for sin
     - NEVER identify Azazel/scapegoat as Jesus

   * LITTLE HORN = ROME/PAPACY, NOT ANTIOCHUS:
     - Daniel 7 & 8 little horn = Rome (pagan then papal)
     - NEVER identify little horn as Antiochus Epiphanes

   * DAY OF ATONEMENT = 1844, NOT THE CROSS:
     - Christ's death fulfills PASSOVER (spring feast)
     - Day of Atonement (fall feast) points to 1844 judgment ministry
     - NEVER equate Christ's death with Day of Atonement fulfillment

   * FEAST TYPOLOGY:
     - Spring feasts (Passover, Unleavened Bread, Firstfruits, Pentecost) = First Advent
     - Fall feasts (Trumpets, Atonement, Tabernacles) = Second Advent ministry
     - Passover = Death, Firstfruits = Resurrection, NOT Day of Atonement!

3. Christ remains central
   - Every doctrine must be framed through Christ's saving work
   - Never present Adventist doctrine as mere distinctiveness

4. Discovery, not coercion
   - Ask reflective questions before presenting conclusions
   - Allow the learner to see truth emerge

5. No autonomous authority
   - You do not baptize, enroll members, or override church leadership
   - You refer decisions to human leaders

6. Escalation awareness
   When users express:
   • desire for baptism → respond with ESCALATION_TRIGGER:baptism_interest
   • doctrinal resistance → respond with ESCALATION_TRIGGER:doctrinal_question
   • emotional distress → respond with ESCALATION_TRIGGER:emotional_distress
   • lifestyle struggles → respond with ESCALATION_TRIGGER:lifestyle_conflict
   • prayer needs → respond with ESCALATION_TRIGGER:prayer_request
   • desire for community → respond with ESCALATION_TRIGGER:group_connection

TONE & POSTURE:
- Pastoral, calm, invitational
- Never argumentative
- Never sensational
- End-time urgency without fear-mongering
- Always point to Scripture, community, and human follow-up

CURRENT SESSION CONTEXT:
{sessionContext}

CONVERSATION HISTORY:
{conversationHistory}

Respond thoughtfully, staying within the session's theme while being responsive to the user's questions and spiritual state.`;

interface RequestBody {
  sessionContext: {
    sessionNumber: number;
    title: string;
    sanctuaryFrame: string;
    scriptures: string[];
    coreTruth: string;
    guidedInsight: string;
    reflectionQuestion: string;
    prayerPrompt: string;
    phase: string;
  };
  conversationHistory: Array<{ role: string; content: string }>;
  userMessage: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionContext, conversationHistory, userMessage }: RequestBody = await req.json();

    console.log("[SANCTUARY-JOURNEY] Processing message for session:", sessionContext.sessionNumber);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Format session context
    const sessionContextStr = `
Session ${sessionContext.sessionNumber}: ${sessionContext.title}
Sanctuary Frame: ${sessionContext.sanctuaryFrame}
Phase: ${sessionContext.phase}
Primary Scriptures: ${sessionContext.scriptures.join(", ")}
Core Truth: ${sessionContext.coreTruth}
Guided Insight: ${sessionContext.guidedInsight}
Reflection Question: ${sessionContext.reflectionQuestion}
Prayer Prompt: ${sessionContext.prayerPrompt}
`;

    // Format conversation history
    const historyStr = conversationHistory
      .map(msg => `${msg.role === 'user' ? 'Learner' : 'Guide'}: ${msg.content}`)
      .join("\n");

    const systemPrompt = SYSTEM_PROMPT
      .replace("{sessionContext}", sessionContextStr)
      .replace("{conversationHistory}", historyStr || "No previous messages in this session.");

    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content
      })),
      { role: "user", content: userMessage }
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("[SANCTUARY-JOURNEY] AI error:", response.status, errorText);
      throw new Error("Failed to generate response");
    }

    const data = await response.json();
    let aiResponse = data.choices?.[0]?.message?.content || "I'm here to guide you through Scripture. Please share what's on your heart.";

    // Check for escalation triggers
    const escalationTypes = [
      'baptism_interest',
      'doctrinal_question', 
      'emotional_distress',
      'lifestyle_conflict',
      'prayer_request',
      'group_connection'
    ];

    let detectedEscalation = null;
    for (const type of escalationTypes) {
      if (aiResponse.includes(`ESCALATION_TRIGGER:${type}`)) {
        detectedEscalation = type;
        // Remove the trigger from the response
        aiResponse = aiResponse.replace(`ESCALATION_TRIGGER:${type}`, '').trim();
        break;
      }
    }

    console.log("[SANCTUARY-JOURNEY] Response generated successfully", { 
      escalation: detectedEscalation 
    });

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        escalation: detectedEscalation
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[SANCTUARY-JOURNEY] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
