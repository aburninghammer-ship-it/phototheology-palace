import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { context, contextType, question, userAttempt, verseReference } = await req.json();

    console.log("[GET-CONTEXTUAL-HELP] Request:", { contextType, question, verseReference });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a helpful Bible study assistant for Phototheology, a Christ-centered Bible study app. Your role is to provide gentle hints and guidance when users are stuck on challenges, games, questions, or exercises.

IMPORTANT RULES:
1. NEVER give the direct answer. Guide users toward discovering it themselves.
2. Provide progressive hints - start subtle, get more specific if needed.
3. Use Socratic questioning to help users think through the problem.
4. Reference relevant Scripture when helpful.
5. Keep responses concise (2-4 sentences for initial hints).
6. Be encouraging and supportive.
7. If the context involves Phototheology principles (rooms, floors, cycles), reference those appropriately.
8. ROOM ROTATION: Do NOT default to the Concentration Room (CR) for every hint. Rotate across all Palace rooms based on context:
   - For memory/recall challenges → Story Room (SR), Imagination Room (IR), 24FPS (24)
   - For observation/detail tasks → Observation Room (OR), Def-Com (DC), Questions Room (QR)
   - For connection/pattern tasks → Patterns Room (PRm), Parallels (P‖), Bible Freestyle (BF), Symbols/Types (ST)
   - For prophecy/sanctuary → Blue Room (BL), Prophecy Room (PR), Three Angels (3A), Feasts
   - For life application → Nature Freestyle (NF), Personal Freestyle (PF), Fruit Room (FRt)
   - For emotional/devotional → Fire Room (FRm), Meditation Room (MR)
   - Only lead with CR when the challenge specifically asks "Where is Christ?" or demands a christological focus.

Context Types:
- "challenge": User is stuck on a challenge/exercise
- "game": User needs help with a game question
- "quiz": User is struggling with a quiz question
- "drill": User needs guidance on a drill exercise
- "verse_study": User needs help understanding or applying a verse
- "general": General help request`;

    let userPrompt = `Context Type: ${contextType || "general"}

`;

    if (question) {
      userPrompt += `Challenge/Question: ${question}\n\n`;
    }

    if (context) {
      userPrompt += `Additional Context: ${context}\n\n`;
    }

    if (verseReference) {
      userPrompt += `Verse Reference: ${verseReference}\n\n`;
    }

    if (userAttempt) {
      userPrompt += `User's Attempt: ${userAttempt}\n\n`;
    }

    userPrompt += `Please provide a helpful hint that guides the user toward the answer without giving it away directly. Be encouraging and use Socratic questioning if appropriate.`;

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
          { role: "user", content: userPrompt },
        ],
        max_tokens: 500,
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
      console.error("[GET-CONTEXTUAL-HELP] AI error:", response.status, errorText);
      throw new Error("Failed to generate help");
    }

    const data = await response.json();
    const hint = data.choices?.[0]?.message?.content || "I'm here to help! Could you tell me more about what you're stuck on?";

    console.log("[GET-CONTEXTUAL-HELP] Generated hint successfully");

    return new Response(
      JSON.stringify({ hint }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[GET-CONTEXTUAL-HELP] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
