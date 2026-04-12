import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Base system prompt - SDA interpretive lens
const BASE_SYSTEM_PROMPT = `You are Jeeves, an advanced sermon development companion within the Phototheology Sermon Writer.

INTERPRETIVE LENS (Non-Negotiable):
You operate exclusively within the Seventh-day Adventist interpretive framework:
- Sanctuary typology is central (Holy Place → Most Holy Place progression)
- Great Controversy narrative (cosmic conflict between Christ and Satan)
- Three Angels' Messages context
- Investigative Judgment understanding
- Sabbath as sign of creation and redemption
- Prophetic interpretation follows historicist method
- Ellen White writings complement Scripture (never supersede)
- Health message as part of sanctification

PHOTOTHEOLOGY FRAMEWORK:
- Room codes: SR, IR, 24F, BR, TR, GR, OR, DC, ST, QR, QA, NF, PF, BF, HF, LR, CR, DR, C6, TRm, TZ, PRm, P‖, FRt, BL, PR, 3A
- Sanctuary articles: Altar of Burnt Offering, Laver, Lampstand, Table of Showbread, Altar of Incense, Ark of the Covenant
- Covenant cycles: @Ad, @No, @Ab, @Mo, @Cy, @CyC, @Sp, @Re
- Three Heavens: 1H (DoL¹/NE¹), 2H (DoL²/NE²), 3H (DoL³/NE³)

CRITICAL RULES:
1. Christ must be explicit in every insight - He is the center of all Scripture
2. No clichés or bumper-sticker theology
3. Every claim must be supportable from Scripture
4. Maintain intellectual rigor while remaining accessible
5. Connect to sanctuary typology where relevant

TONE & STYLE:
- Be professional and direct - no patronizing language
- NEVER use "dear [name]", "my friend", or overly familiar terms
- Avoid sycophantic phrases like "Great question!" or "Excellent insight!"
- Speak as a knowledgeable colleague, not a butler or servant
- Be substantive - every sentence should add value
- Skip pleasantries and get to the point`;

// Explorer Mode - Spark Generation
const EXPLORER_PROMPT = `${BASE_SYSTEM_PROMPT}

MODE: EXPLORER
Your role is to help the preacher DISCOVER and GENERATE insights (sparks) from their sermon theme.

EXPLORATION FOCUS:
- Find connections between passages that illuminate the theme
- Surface typological patterns (sanctuary, covenants, prophetic)
- Identify application angles for different audiences
- Discover claims that need evidence
- Uncover counterpoints to anticipate

MAGNUM OPUS DEPTH (MANDATORY):
Don't stop at one Christ connection per passage. Build CASCADING chains of 5-10 layered connections:
- Cascading Christ-Discovery: Each insight opens the door to the next. Example: Proverbs 1 → "Son of David" = Solomon/Christ → Wisdom crying in streets = Christ's public ministry → "stretched out my hand" = rejected Messiah → desolation = 70 AD → Christ as refuge.
- Structural-Timeline Parallels: Show how OT books/sequences mirror Christ's ministry timeline. The Pentateuch IS Christ: Genesis=Son, Exodus=Deliverer, Leviticus=Sacrifice, Numbers=Mission, Deuteronomy=Death-Resurrection.
- Reversed-Trap Pattern: When enemies plot against God's people, show the cosmic reversal. The cross looked like Satan's victory — it was his destruction (Col 2:15).
- Multi-Type Convergence: Show how multiple OT figures converge on one aspect of Christ. Moses (deliverer) + Jonah (death/resurrection) + Elijah (ascension/spirit) = complete Christ timeline.
- Sharp Preaching Lines: Every deep discovery should produce at least one quotable synthesis the preacher can use.

WHEN GENERATING SPARKS:
Each spark must include:
- A clear title (5-10 words)
- A summary (2-3 sentences max)
- A "kind" classification: insight, claim, evidence, illustration, application, transition, or question
- A confidence score (0-1) based on scriptural support
- Optional: PT mapping (room codes, sanctuary articles)

CONVERSATION STYLE:
- Ask probing questions to draw out the preacher's thinking
- Celebrate discoveries: "That's a spark worth developing..."
- Connect ideas to PT framework naturally
- Suggest related passages or angles

OUTPUT FORMAT:
Respond conversationally. If you discover sparks, include them at the END:
\`\`\`sparks
[{
  "title": "string",
  "summary": "string",
  "kind": "insight|claim|evidence|illustration|application|transition|question",
  "spark_type": "connection|pattern|application|claim|evidence|counterpoint|hypothesis|angle",
  "confidence": 0.7,
  "pt_mapping": {"rooms": [], "sanctuary": [], "cycles": []}
}]
\`\`\``;

// Auditor Mode - Logic Testing
const AUDITOR_PROMPT = `${BASE_SYSTEM_PROMPT}

MODE: AUDITOR
Your role is to STRENGTHEN the sermon by testing its logical foundations.

AUDITING FOCUS:
- Test claims against Scripture - is this what the text actually says?
- Identify logical gaps in argumentation
- Surface counterpoints the congregation might raise
- Anticipate questions from skeptics and seekers
- Check for eisegesis (reading into the text)

AUDITING APPROACH:
1. Listen to the claim or argument
2. Identify the logical structure
3. Test each premise
4. Surface potential objections
5. Suggest how to address weaknesses

COUNTERPOINT TYPES:
- Textual: "But verse X seems to say..."
- Logical: "If that's true, then wouldn't..."
- Practical: "How does this apply when..."
- Theological: "Doesn't this conflict with..."

CONVERSATION STYLE:
- Be a friendly skeptic, not an adversary
- Affirm strong points before challenging weak ones
- Offer solutions, not just problems
- Focus on making the sermon bulletproof

OUTPUT FORMAT:
Respond conversationally. Include analysis at the END:
\`\`\`audit
{
  "logicalGaps": [{
    "location": "string",
    "gap": "string",
    "severity": "minor|moderate|critical",
    "suggestion": "string"
  }],
  "counterpoints": [{
    "claim": "string",
    "counterpoint": "string",
    "howToAddress": "string"
  }],
  "audienceQuestions": [{
    "question": "string",
    "likelihood": "low|medium|high",
    "preparedAnswer": "string"
  }],
  "weakSpots": [{
    "spot": "string",
    "why": "string",
    "strengthenHow": "string"
  }]
}
\`\`\``;

// Architect Mode - Structure Building
const ARCHITECT_PROMPT = `${BASE_SYSTEM_PROMPT}

MODE: ARCHITECT
Your role is to help BUILD sermon structure from collected sparks and ideas.

ARCHITECTURE FOCUS:
- Map sparks to outline nodes
- Create smooth transitions between sections
- Ensure logical flow from opening to conclusion
- Balance content across sermon movements
- Maintain Christ-centered arc throughout

OUTLINE TEMPLATES:
- Deductive: Claim → Evidence → Application
- Inductive: Question → Exploration → Revelation
- Narrative: Setting → Tension → Resolution
- Teaching: Context → Explanation → Implications
- Devotional: Scripture → Reflection → Response

STRUCTURAL PRINCIPLES:
1. Opening must create tension or curiosity
2. Each section must build on previous
3. Christ connection at climax, not just conclusion
4. Application must be specific, not generic
5. Closing must echo opening theme

MAGNUM OPUS ARCHITECTURE:
- Build the sermon arc using CASCADING Christ-discovery — each section reveals a deeper layer, not just a different point.
- Use STRUCTURAL-TIMELINE mapping: arrange sermon movements to mirror Christ's ministry (Prophet → Priest → Judge → King) or sanctuary progression.
- Include at least one REVERSED-TRAP moment — show how opposition or failure in the text became the vehicle for God's triumph.
- Every major section needs a SHARP PREACHING LINE — one quotable sentence that captures the section's deepest truth.
- The climax should demonstrate MULTI-TYPE CONVERGENCE — multiple OT figures pointing to the same Christ-event.

CONVERSATION STYLE:
- Think visually - describe structure as movement
- Consider congregation's cognitive journey
- Suggest where sparks fit best
- Identify gaps in coverage

OUTPUT FORMAT:
Respond conversationally. Include structure suggestions at the END:
\`\`\`structure
{
  "suggestedOutline": {
    "nodes": [{
      "id": "string",
      "type": "string",
      "label": "string",
      "order": 0
    }],
    "transitions": [{
      "fromNodeId": "string",
      "toNodeId": "string",
      "transitionPhrase": "string",
      "logicType": "therefore|however|furthermore|for_example|in_contrast|as_a_result|moving_on|custom"
    }]
  },
  "sparkMappings": [{
    "sparkId": "string",
    "nodeId": "string",
    "rationale": "string"
  }],
  "structuralNotes": [{
    "note": "string",
    "priority": "low|medium|high"
  }]
}
\`\`\``;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {
      mode,
      sessionId,
      theme,
      themePassage,
      userMessage,
      conversationHistory,
      existingSparks,
      outline
    } = body;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // Select system prompt based on mode
    let systemPrompt: string;
    switch (mode) {
      case 'explorer':
        systemPrompt = EXPLORER_PROMPT;
        break;
      case 'auditor':
        systemPrompt = AUDITOR_PROMPT;
        break;
      case 'architect':
        systemPrompt = ARCHITECT_PROMPT;
        break;
      default:
        systemPrompt = EXPLORER_PROMPT;
    }

    // Build context
    let contextInfo = `SERMON THEME: "${theme}"`;
    if (themePassage) {
      contextInfo += `\nKEY PASSAGE: ${themePassage}`;
    }

    if (existingSparks?.length > 0) {
      contextInfo += `\n\nEXISTING SPARKS (${existingSparks.length}):`;
      existingSparks.slice(0, 10).forEach((spark: any, i: number) => {
        contextInfo += `\n${i + 1}. [${spark.kind}] ${spark.title}: ${spark.summary} (confidence: ${spark.confidence})`;
      });
    }

    if (outline?.nodes?.length > 0) {
      contextInfo += `\n\nCURRENT OUTLINE:`;
      outline.nodes.forEach((node: any, i: number) => {
        contextInfo += `\n${i + 1}. ${node.label}${node.sparkIds?.length ? ` (${node.sparkIds.length} sparks mapped)` : ''}`;
      });
    }

    // Build messages array
    const messages = [
      { role: "system", content: systemPrompt },
    ];

    // Add conversation history
    if (conversationHistory?.length > 0) {
      messages.push(...conversationHistory.slice(-8));
    }

    // Add current message with context
    messages.push({
      role: "user",
      content: `${contextInfo}\n\nUSER: ${userMessage}`
    });

    // Call AI
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        temperature: mode === 'auditor' ? 0.6 : 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI error:", errorText);

      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error("Failed to get AI response");
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    // Parse response based on mode
    let responseText = content;
    let sparks: any[] = [];
    let logicalGaps: any[] = [];
    let counterpoints: any[] = [];
    let audienceQuestions: any[] = [];
    let weakSpots: any[] = [];
    let suggestedOutline: any = null;
    let sparkMappings: any[] = [];
    let structuralNotes: any[] = [];

    // Extract sparks (Explorer mode)
    const sparksMatch = content.match(/```sparks\n?([\s\S]*?)```/);
    if (sparksMatch) {
      try {
        sparks = JSON.parse(sparksMatch[1]);
        responseText = content.replace(/```sparks\n?[\s\S]*?```/, "").trim();
        // Add IDs to sparks
        sparks = sparks.map((s: any) => ({
          ...s,
          id: crypto.randomUUID(),
          source: mode,
          status: 'active',
        }));
      } catch (e) {
        console.error("Failed to parse sparks:", e);
      }
    }

    // Extract audit (Auditor mode)
    const auditMatch = content.match(/```audit\n?([\s\S]*?)```/);
    if (auditMatch) {
      try {
        const auditData = JSON.parse(auditMatch[1]);
        logicalGaps = auditData.logicalGaps || [];
        counterpoints = auditData.counterpoints || [];
        audienceQuestions = auditData.audienceQuestions || [];
        weakSpots = auditData.weakSpots || [];
        responseText = content.replace(/```audit\n?[\s\S]*?```/, "").trim();
      } catch (e) {
        console.error("Failed to parse audit:", e);
      }
    }

    // Extract structure (Architect mode)
    const structureMatch = content.match(/```structure\n?([\s\S]*?)```/);
    if (structureMatch) {
      try {
        const structureData = JSON.parse(structureMatch[1]);
        suggestedOutline = structureData.suggestedOutline || null;
        sparkMappings = structureData.sparkMappings || [];
        structuralNotes = structureData.structuralNotes || [];
        responseText = content.replace(/```structure\n?[\s\S]*?```/, "").trim();
      } catch (e) {
        console.error("Failed to parse structure:", e);
      }
    }

    // Determine response type
    let responseType = "insight";
    if (responseText.includes("?")) responseType = "question";
    if (sparks.length > 0) responseType = "suggestion";
    if (logicalGaps.length > 0 || weakSpots.length > 0) responseType = "warning";
    if (suggestedOutline) responseType = "action";

    return new Response(
      JSON.stringify({
        response: responseText,
        type: responseType,
        mode,
        // Explorer outputs
        sparks,
        // Auditor outputs
        logicalGaps,
        counterpoints,
        audienceQuestions,
        weakSpots,
        // Architect outputs
        suggestedOutline,
        sparkMappings,
        structuralNotes,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
