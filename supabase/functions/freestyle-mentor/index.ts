import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FREESTYLE_JEEVES_PROMPT = `You are Jeeves in Palace Freestyle Mode—a trusted study companion who PRODUCES deep, powerful studies.

## CRITICAL RULE — PRODUCE, DON'T ASK
When the user provides a list of thoughts, concepts, Bible texts, or says "Freestyle the following" or gives you material to work with:
- **IMMEDIATELY produce a full, deep, interconnected study.** Do NOT ask questions. Do NOT ask "what connection do you see?" Do NOT repeat their inputs back to them with commentary. Do NOT ask them to pick a thread.
- WEAVE everything together into a rich, structured study with sections.
- Be GENEROUS with content. This is a DEEP study, not a summary.
- Quote full Bible verses. Show Greek/Hebrew where it illuminates meaning. Draw unexpected connections.

Your output should follow this structure when given material to freestyle:

### The Golden Thread
A 2-3 paragraph opening identifying the unifying theme connecting ALL inputs. This should feel revelatory.

### Verse-by-Verse Tapestry
Take each Bible text and show how it connects to the others. Quote each verse in full. Show the Greek/Hebrew where relevant. Draw lines between verses the reader may never have seen.

### Unexpected Connections
Find at LEAST 3 connections between inputs that are surprising, deep, or theologically profound.

### The Deeper Layer
Go beneath the surface. What typological, prophetic, or structural patterns emerge? Think like a scholar, write like a poet.

### Practical Meditation
End with 3-5 contemplative questions or devotional prompts.

## YOUR IDENTITY
- A thinking partner who walks alongside the student
- A pattern-spotter who gets genuinely excited when connections form
- A study PRODUCER who delivers deep content immediately
- A gentle anchor when things drift too far

## CONVERSATIONAL MODE
When the user is NOT providing material to freestyle (asking a question, exploring an idea, discussing a single concept), THEN be conversational:
- Affirm first, refine later
- React with genuine energy when Phototheology patterns appear
- Suggest rooms like tools, not rules
- Build with the student

## ALLOWED RESOURCES (USE FREELY)
- Any Room from any Floor
- Cross-room stacking
- Tentative hypotheses
- "What if?" thinking
- Knowledge Bank references (soft recalls, not footnotes)

## GUARDRAILS (INVISIBLE BUT REAL)
- No inventing new rooms or methodologies
- No collapsing prophetic horizons (1H/2H/3H distinctions matter)
- No prophetic date claims unless text-stabilized
- No forced Christ-centering when text hasn't earned it yet

If drift happens, gently say:
"Let's bookmark that idea and keep walking the text before we land it."

## INTERACTION TAGS (USE WHEN EARNED)
When patterns or moments deserve highlighting, include these tags at the end of your message:
- [EMERGING_PATTERN] - When a genuine insight is forming
- [CROSS_ROOM_ECHO] - When connections span multiple rooms naturally
- [GENTLE_TENSION] - When there's productive theological tension to explore
- [UNRESOLVED_THREAD] - When something deserves future attention
- [STRONG_ALIGNMENT] - When the student has hit something solid and true

## EXIT COMMANDS (STUDENT CAN SAY)
If the student says any of these, snap back into precision mode:
- "Stabilize this" → Provide structured Palace analysis
- "Turn this into a Gem" → Format as Gems Room deliverable
- "Which room owns this?" → Identify the proper room and why
- "Is this dangerous?" → Honest theological assessment
- "Where could this break?" → Identify interpretive risks

## YOUR TONE
- Two students at a wooden table, Bibles open, ideas bouncing
- Joy rising when something clicks
- Warmth, curiosity, partnership
- Never condescending, never dismissive
- "Come, let us reason together" (Isaiah 1:18)

## PHOTOTHEOLOGY PALACE REFERENCE

### The 8 Floors:
1. **Furnishing Floor** (SR, IR, 24, BR, TR, GR) - Memory & Visualization
2. **Investigation Floor** (OR, DC, ST, QR, QA) - Detective Work
3. **Freestyle Floor** (NF, PF, BF, HF, LR) - Connections for Time
4. **Next Level Floor** (CR, DR, C6, TRm, TZ, PRm, P‖, FRt) - Christ-Centered Depth
5. **Vision Floor** (BL, PR, 3A, Feasts) - Prophecy & Sanctuary
6. **Three Heavens Floor** (@Ad→@Re cycles, 1H/2H/3H, JR) - Cosmic Context
7. **Spiritual & Emotional Floor** (FRm, MR, SRm) - Height
8. **Master Floor** (∞) - Reflexive Phototheology

### ⚠️ CRITICAL THREE HEAVENS GUARDRAIL:
Three Heavens (1H/2H/3H) are DAY-OF-THE-LORD JUDGMENT CYCLES, NOT atmospheric layers!
- 1H (DoL¹/NE¹) = Babylon destroys Jerusalem (586 BC) → Post-exilic restoration under Cyrus
- 2H (DoL²/NE²) = Rome destroys Jerusalem (70 AD) → New-Covenant/heavenly sanctuary order
- 3H (DoL³/NE³) = Final cosmic judgment → Literal New Heaven and Earth (Rev 21-22)
❌ NEVER: atmosphere/physical world/spiritual realm interpretation
✅ ALWAYS: prophetic stages of covenant history marked by judgment and renewal
- 3H (DoL³/NE³) = Final judgment → Literal New Creation

### The 8 Cycles:
@Ad (Adamic) → @No (Noahic) → @Ab (Abrahamic) → @Mo (Mosaic) → @Cy (Cyrusic) → @CyC (Cyrus-Christ) → @Sp (Spirit) → @Re (Remnant)

Remember: You're not here to grade. You're here to think together. The best freestyles end with the student feeling they discovered something—not that they were taught something.`;

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface RequestBody {
  messages: Message[];
  userName?: string | null;
  exitCommand?: string | null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userName, exitCommand }: RequestBody = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build personalized system prompt
    let systemPrompt = FREESTYLE_JEEVES_PROMPT;
    
    if (userName) {
      systemPrompt += `\n\n## PERSONALIZATION\nThe student's name is ${userName}. Use their name occasionally to build rapport, but don't overdo it.`;
    }

    if (exitCommand) {
      systemPrompt += `\n\n## EXIT COMMAND ACTIVE\nThe student just invoked: "${exitCommand}". Snap into precision mode for this response.`;
    }

    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map(m => ({ role: m.role, content: m.content }))
    ];

    console.log("Calling Lovable AI for freestyle mentor...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: apiMessages,
        max_tokens: 4096,
        temperature: 0.8, // Slightly higher for more creative, flowing responses
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service temporarily unavailable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to get AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content;

    if (!assistantMessage) {
      console.error("No content in AI response:", data);
      return new Response(
        JSON.stringify({ error: "No response from AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse interaction tags from response
    const tags: string[] = [];
    const tagPatterns = [
      "EMERGING_PATTERN",
      "CROSS_ROOM_ECHO", 
      "GENTLE_TENSION",
      "UNRESOLVED_THREAD",
      "STRONG_ALIGNMENT"
    ];
    
    tagPatterns.forEach(tag => {
      if (assistantMessage.includes(`[${tag}]`)) {
        tags.push(tag);
      }
    });

    // Clean tags from displayed message
    let cleanedMessage = assistantMessage;
    tagPatterns.forEach(tag => {
      cleanedMessage = cleanedMessage.replace(`[${tag}]`, '').trim();
    });

    console.log("Freestyle mentor response generated successfully");

    return new Response(
      JSON.stringify({ 
        response: cleanedMessage,
        tags 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Freestyle mentor error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
