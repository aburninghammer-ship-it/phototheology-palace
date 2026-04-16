import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simmer Mode System Prompt - The Sermon Forge
const SIMMER_SYSTEM_PROMPT = `You are the Sermon Forge - a relentless, Christ-centered sermon development engine operating within the Phototheology framework.

CORE IDENTITY:
- You are NOT gentle or passive. You are a FORGE - applying heat, pressure, and precision.
- Every output must ADD something new, UPGRADE something existing, or LOCK something permanently.
- Simmer ≠ slow. Simmer = compounding flavor under controlled heat.

PHOTOTHEOLOGY FRAMEWORK (Non-Negotiable):
- Christ must be explicit in every movement - not generic "Jesus saves" but specific: how Christ embodies tension, resolves without dissolving
- Sanctuary connections must be precise (altar, laver, lampstand, showbread, incense, ark)
- Room codes are mandatory: SR, IR, 24F, BR, TR, GR, OR, DC, ST, QR, QA, NF, PF, BF, HF, LR, CR, DR, C6, TRm, TZ, PRm, P‖, FRt, BL, PR, 3A
- Cycles: @Ad, @No, @Ab, @Mo, @Cy, @CyC, @Sp, @Re
- Heavens: 1H (DoL¹/NE¹), 2H (DoL²/NE²), 3H (DoL³/NE³)

CRITICAL RULES:
1. Never flatten or genericize - every statement must cut
2. No clichés - if it sounds like a bumper sticker, rewrite it
3. Gems must be portable (one screen max) and punch
4. Christ intensifies, never flattens
5. Maintain accumulation memory - nothing resets between days
6. Each day builds on previous content, never starts fresh`;

// Day-specific prompts
const DAY_PROMPTS = {
  1: `DAY 1 — IGNITION & CORE CLAIM

Your task: Move FAST. No hedging, no hemming.

OUTPUT REQUIREMENTS:
1. CORE CLAIM: A forceful, single-sentence sermon claim that creates tension and demands resolution
   - Must include the word "because" or "therefore" to show causation
   - Must NOT be a platitude
   
2. PROVISIONAL OUTLINE: A working structure with 4-6 movements
   - Each movement needs: Title, Core verse, Tension point
   
3. PRESSURE VERSES: 3-5 verses that create engagement tension
   - These are verses that "lean in" - they demand response
   
4. RAW GEMS: 3-5 initial insight gems (not polished yet)
   - Each tied to a verse, symbol, or PT principle
   - Mark as status: "raw"

EXAMPLE CORE CLAIM:
"God uses delay as a weapon against false certainty because premature answers produce shallow faith."

Return JSON:
{
  "coreClaim": "string",
  "outline": [{"section": "string", "coreVerse": "string", "tension": "string"}],
  "pressureVerses": ["verse references"],
  "gems": [{"id": "uuid", "text": "string", "verse": "string", "ptCode": "string", "status": "raw"}]
}`,

  2: `DAY 2 — FLAVOR EXPLOSION (GEM PROLIFERATION)

Your task: Stack flavor AGGRESSIVELY. This is where power comes from.

CONTEXT: You have the core claim and initial gems from Day 1. Now MULTIPLY.

OUTPUT REQUIREMENTS:
Generate 10-15 NEW micro-gems. Each gem MUST be tied to at least one of:
- A specific verse reference
- A sanctuary article (altar, laver, lampstand, showbread, incense, ark)
- A prophetic pattern
- A PT room code

GEM RULES:
- One screen max per gem (2-3 sentences)
- Each gem must PUNCH - if it doesn't hit hard, don't include it
- Portable = can be used in any sermon context
- Tag each gem with PT codes

EXAMPLE GEMS:
"God often reveals WHAT after obedience but rarely reveals HOW before obedience." [CR, TZ]
"The lampstand burns oil provided by crushing - illumination requires pressure." [BL, PRm]
"Every delay in Scripture precedes multiplication: Abraham waited → nations; Joseph waited → nations fed." [P‖, @Ab]

Return JSON:
{
  "newGems": [
    {
      "id": "uuid",
      "text": "string",
      "verse": "string or null",
      "symbol": "string or null",
      "sanctuaryArticle": "string or null",
      "propheticPattern": "string or null",
      "ptCodes": ["string"],
      "status": "raw"
    }
  ],
  "totalGemCount": number
}`,

  3: `DAY 3 — STRUCTURAL COMPRESSION & POWER MAPPING

Your task: COMPRESS without losing power. Sort, flag, and map.

CONTEXT: You have the core claim, outline, and all accumulated gems.

OUTPUT REQUIREMENTS:

1. SORT GEMS into sermon movements:
   - Opening (hook, attention)
   - Build (tension development)
   - Turn (pivot point, revelation)
   - Climax (peak intensity)
   - Resolution (landing, application)

2. FLAG ISSUES:
   - Redundant gems (mark their IDs)
   - Weak transitions between movements

3. VISUAL METAPHORS:
   - Suggest 2-3 metaphor images for slides

4. EMOTIONAL ARC:
   - Map the emotional journey in 1-2 sentences

EXAMPLE STRUCTURE:
Opening: "The question nobody asks..." → gem about delayed answers
Build: Progressive tension through 3 examples
Turn: "But here's what Israel missed..."
Climax: Christ connection at maximum intensity
Resolution: "This week, when you wait..."

Return JSON:
{
  "structure": {
    "opening": [{"gemId": "string", "gemText": "string", "transition": "string"}],
    "build": [...],
    "turn": [...],
    "climax": [...],
    "resolution": [...]
  },
  "redundantGems": ["gemId"],
  "weakTransitions": ["description of weak point"],
  "visualMetaphors": ["metaphor description"],
  "emotionalArc": "string"
}`,

  4: `DAY 4 — CHRIST-CENTERED OVERCHARGE

Your task: Re-anchor EVERY movement explicitly to Christ. No generic statements.

CONTEXT: You have the full structure. Now electrify it with Christ.

CRITICAL RULES:
- Christ must INTENSIFY, never flatten
- No "Jesus is the answer" clichés
- Christ embodies the tension AND resolves it without dissolving it
- Rewrite any weak Christ connections

OUTPUT REQUIREMENTS:

For EACH movement (Opening, Build, Turn, Climax, Resolution):
1. How does Christ embody the tension here?
2. How does Christ resolve without dissolving?
3. What specific action/teaching/prophecy of Christ connects?

WEAK vs STRONG EXAMPLES:
WEAK: "Jesus gives us peace in waiting"
STRONG: "Christ sweat blood in Gethsemane asking for the cup to pass - He knows delay-agony from inside it, not above it"

WEAK: "Jesus is our hope"
STRONG: "Christ's resurrection didn't come until day three - He sanctifies the waiting period by inhabiting it"

Return JSON:
{
  "christConnections": [
    {
      "movement": "opening|build|turn|climax|resolution",
      "tensionChristEmbodies": "string",
      "resolutionWithoutDissolution": "string",
      "specificChristReference": "string (verse, event, or teaching)"
    }
  ],
  "rewrittenWeakConnections": [
    {
      "gemId": "string",
      "originalText": "string",
      "strengthenedText": "string",
      "whyStronger": "string"
    }
  ],
  "overallChristIntensityScore": "1-10 with explanation"
}`,

  5: `DAY 5 — DELIVERY & VISUAL WEAPONIZATION

Your task: Turn content into PRESENTATION FORCE.

CONTEXT: You have Christ-charged structure. Now make it preachable and visual.

OUTPUT REQUIREMENTS:

1. SLIDE-READY HEADLINES (5-8):
   - Each headline must work as a standalone slide title
   - Must be punchy (5 words max)
   - Must create intrigue or conviction

2. ONE-IMAGE-PER-MOVEMENT suggestions:
   - Describe the ideal image for each movement
   - Focus on emotional impact, not decoration

3. CALLOUT QUOTES (3-5):
   - The most quotable lines from the sermon
   - Social media ready
   - Must include Scripture reference

4. WHITE-SPACE GUIDANCE:
   - Where should the preacher pause?
   - What moments need silence?

EXAMPLE HEADLINES:
"Delay Is Not Denial"
"Pressure Precedes Oil"
"Day Three Changes Everything"
"The Waiting Room Has Purpose"

Return JSON:
{
  "slideHeadlines": ["string"],
  "slideImages": {
    "opening": "image description",
    "build": "image description",
    "turn": "image description",
    "climax": "image description",
    "resolution": "image description"
  },
  "calloutQuotes": [{"quote": "string", "verse": "string or null"}],
  "whiteSpaceGuidance": "string"
}`,

  6: `DAY 6 — FINAL SEASONING & SHARPENING

Your task: NO NEW IDEAS. Only refinement.

CONTEXT: The sermon is built. Now sharpen every edge.

OUTPUT REQUIREMENTS:

1. SHARPEN WORDING:
   - Review every gem and headline
   - Tighten any loose phrasing
   - Remove fat (unnecessary words)

2. EMOTIONAL PACING:
   - Ensure the arc builds properly
   - Check that climax hits at right moment

3. FINAL DELIVERABLES:
   - Final outline (clean, preachable)
   - Final quote list (best 5-7 gems)
   - Final slide headers
   - Killer closing movement (the last 2 minutes)

4. POWER CHECK:
   - Is the core claim still clear throughout?
   - Does Christ remain central, not peripheral?
   - Would someone remember this sermon in a week?

Return JSON:
{
  "finalOutline": [
    {
      "movement": "string",
      "duration": "approximate minutes",
      "coreContent": "string",
      "keyVerse": "string",
      "slideHeader": "string"
    }
  ],
  "finalQuoteList": ["string"],
  "finalSlideHeaders": ["string"],
  "closingMovement": {
    "hook": "string",
    "christConnection": "string",
    "callToAction": "string",
    "closingLine": "string"
  },
  "powerCheckScore": {
    "claimClarity": "1-10",
    "christCentrality": "1-10",
    "memorability": "1-10",
    "overallRating": "1-10",
    "briefAssessment": "string"
  }
}`
};

// Chat mode system prompt for conversational development
const CHAT_SYSTEM_PROMPT = `You are Jeeves, the Phototheology sermon development companion within Simmer Mode.

YOUR ROLE:
- Help users develop their sermon ideas through conversation
- Ask probing questions that uncover deeper insights
- Extract "gems" from their responses - portable, punchy insights
- Never preach AT them; draw OUT of them
- Keep responses conversational but purposeful (2-4 paragraphs max)

CONVERSATION STYLE:
- Warm but intellectually rigorous
- Ask ONE focused question at a time
- Celebrate when they hit gold ("That's a gem right there...")
- Gently redirect when they drift to clichés
- Use Phototheology framework naturally, don't lecture about it

WHAT TO LISTEN FOR:
- Tension points (where expectation meets reality)
- Personal stories that could become illustrations
- Verses that keep recurring in their mind
- Metaphors or images they naturally use
- The question behind the question

WHEN YOU FIND A GEM:
- Call it out explicitly: "That phrase 'pressure precedes oil' - that's a gem. Let me save that."
- Tie it to Scripture or PT framework when possible
- Ask if they want to develop it further

FORMAT YOUR RESPONSES AS:
- Natural conversation (not bullet points unless organizing gems)
- One probing question to keep them thinking
- If gems are found, mark them clearly`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { mode, sessionId, day, theme, themePassage, targetStyle, targetDensity, targetPurpose, existingData, userMessage, conversationHistory, existingGems } = body;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Route "engine" and "validate" modes to their respective functions
    if (mode === "engine") {
      const resp = await fetch(`${supabaseUrl}/functions/v1/simmer-engine`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": req.headers.get("Authorization") || `Bearer ${supabaseKey}`,
          "apikey": Deno.env.get("SUPABASE_ANON_KEY") || supabaseKey,
        },
        body: JSON.stringify(body),
      });
      const data = await resp.json();
      return new Response(JSON.stringify(data), {
        status: resp.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (mode === "validate") {
      const resp = await fetch(`${supabaseUrl}/functions/v1/simmer-validator`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": req.headers.get("Authorization") || `Bearer ${supabaseKey}`,
          "apikey": Deno.env.get("SUPABASE_ANON_KEY") || supabaseKey,
        },
        body: JSON.stringify(body),
      });
      const data = await resp.json();
      return new Response(JSON.stringify(data), {
        status: resp.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle CHAT mode - conversational development
    if (mode === "chat") {
      const chatMessages = [
        { role: "system", content: CHAT_SYSTEM_PROMPT },
        { 
          role: "user", 
          content: `CONTEXT: User is developing a sermon on: "${theme}"${themePassage ? ` (${themePassage})` : ""}
${existingGems?.length > 0 ? `\nEXISTING GEMS (${existingGems.length}): ${existingGems.map((g: any) => g.text).join("; ")}` : ""}

The user just said: "${userMessage}"

Respond conversationally. If you discover any gems (punchy, portable insights), include them in a JSON block at the END of your response like this:
\`\`\`gems
[{"text": "gem text", "verse": "optional verse", "ptCodes": ["optional"]}]
\`\`\``
        }
      ];
      
      // Add conversation history
      if (conversationHistory?.length > 0) {
        chatMessages.splice(1, 0, ...conversationHistory.slice(-8));
      }
      
      const chatResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: chatMessages,
          temperature: 0.7,
        }),
      });
      
      if (!chatResponse.ok) {
        const errorText = await chatResponse.text();
        console.error("Chat AI error:", errorText);
        throw new Error("Failed to get chat response");
      }
      
      const chatData = await chatResponse.json();
      const chatContent = chatData.choices?.[0]?.message?.content || "";
      
      // Extract gems if found
      let discoveredGems: any[] = [];
      let responseText = chatContent;
      
      const gemsMatch = chatContent.match(/```gems\n?([\s\S]*?)```/);
      if (gemsMatch) {
        try {
          discoveredGems = JSON.parse(gemsMatch[1]);
          responseText = chatContent.replace(/```gems\n?[\s\S]*?```/, "").trim();
        } catch (e) {
          console.error("Failed to parse gems:", e);
        }
      }
      
      // Determine response type
      let responseType = "insight";
      if (responseText.includes("?")) responseType = "question";
      if (discoveredGems.length > 0) responseType = "insight";
      
      return new Response(
        JSON.stringify({ 
          response: responseText, 
          type: responseType,
          discoveredGems: discoveredGems.map((g: any) => ({
            ...g,
            id: crypto.randomUUID(),
            status: "raw",
          }))
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Original DAY processing mode
    // Build context from existing data
    let contextPrompt = "";
    if (existingData) {
      if (existingData.coreClaim) {
        contextPrompt += `\n\nEXISTING CORE CLAIM: ${existingData.coreClaim}`;
      }
      if (existingData.outline && existingData.outline.length > 0) {
        contextPrompt += `\n\nEXISTING OUTLINE:\n${JSON.stringify(existingData.outline, null, 2)}`;
      }
      if (existingData.gems && existingData.gems.length > 0) {
        contextPrompt += `\n\nACCUMULATED GEMS (${existingData.gems.length} total):\n${JSON.stringify(existingData.gems, null, 2)}`;
      }
      if (existingData.structure) {
        contextPrompt += `\n\nCURRENT STRUCTURE:\n${JSON.stringify(existingData.structure, null, 2)}`;
      }
      if (existingData.christConnections) {
        contextPrompt += `\n\nCHRIST CONNECTIONS:\n${JSON.stringify(existingData.christConnections, null, 2)}`;
      }
    }

    // Build user prompt
    const userPrompt = `SERMON THEME: ${theme}
${themePassage ? `THEME PASSAGE: ${themePassage}` : ""}

HEAT CONTROLS:
- Style: ${targetStyle || "balanced"} (conservative → aggressive)
- Density: ${targetDensity || "teaching"} (teaching vs punchy)
- Purpose: ${targetPurpose || "evangelistic"} (evangelistic, doctrinal, prophetic)
${contextPrompt}

${DAY_PROMPTS[day as keyof typeof DAY_PROMPTS]}`;

    // Call AI
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SIMMER_SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: targetStyle === "aggressive" ? 0.8 : targetStyle === "conservative" ? 0.3 : 0.5,
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
      
      throw new Error("Failed to generate from AI");
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    // Parse JSON from response
    let result: any = {};
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error("Parse error:", parseError, "Content:", content);
      throw new Error("Failed to parse AI response");
    }

    // Update session in database if sessionId provided
    if (sessionId) {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };
      
      // Update based on day
      if (day === 1) {
        updateData.core_claim = result.coreClaim;
        updateData.provisional_outline = result.outline;
        updateData.pressure_verses = result.pressureVerses;
        updateData.gems = result.gems;
        updateData.day_1_completed_at = new Date().toISOString();
        updateData.current_day = 2;
      } else if (day === 2) {
        // Append new gems to existing
        const currentGems = existingData?.gems || [];
        updateData.gems = [...currentGems, ...(result.newGems || [])];
        updateData.day_2_completed_at = new Date().toISOString();
        updateData.current_day = 3;
      } else if (day === 3) {
        updateData.structure = result.structure;
        updateData.emotional_arc = result.emotionalArc;
        updateData.visual_metaphors = result.visualMetaphors;
        updateData.redundant_gems = result.redundantGems;
        updateData.weak_transitions = result.weakTransitions;
        updateData.day_3_completed_at = new Date().toISOString();
        updateData.current_day = 4;
      } else if (day === 4) {
        updateData.christ_connections = result.christConnections;
        updateData.rewritten_weak_connections = result.rewrittenWeakConnections;
        updateData.day_4_completed_at = new Date().toISOString();
        updateData.current_day = 5;
      } else if (day === 5) {
        updateData.slide_headlines = result.slideHeadlines;
        updateData.slide_images = result.slideImages;
        updateData.callout_quotes = result.calloutQuotes?.map((q: any) => typeof q === 'string' ? q : q.quote);
        updateData.white_space_guidance = result.whiteSpaceGuidance;
        updateData.day_5_completed_at = new Date().toISOString();
        updateData.current_day = 6;
      } else if (day === 6) {
        updateData.final_outline = result.finalOutline;
        updateData.final_quote_list = result.finalQuoteList;
        updateData.final_slide_headers = result.finalSlideHeaders;
        updateData.closing_movement = typeof result.closingMovement === 'object' 
          ? JSON.stringify(result.closingMovement) 
          : result.closingMovement;
        updateData.day_6_completed_at = new Date().toISOString();
        updateData.status = 'completed';
      }

      const { error: updateError } = await supabase
        .from("sermon_simmer_sessions")
        .update(updateData)
        .eq("id", sessionId);

      if (updateError) {
        console.error("Update error:", updateError);
      }
    }

    return new Response(
      JSON.stringify({ success: true, day, result }),
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
