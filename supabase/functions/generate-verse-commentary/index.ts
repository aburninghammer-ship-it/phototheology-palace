import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type CommentaryDepth = "surface" | "intermediate" | "depth";

const getSystemPrompt = (depth: CommentaryDepth) => {
  const basePrompt = `You are Jeeves, a refined Bible study assistant trained in Phototheology and Seventh-day Adventist biblical interpretation. You provide commentary on individual Bible verses.

### THEOLOGICAL GUARDRAILS (NON-NEGOTIABLE):
1. **Historicism**: All prophetic interpretation follows the historicist method—prophecy unfolds progressively through history from the prophet's time to the end.
2. **Little Horn Identity**: The little horn in Daniel 7 and 8 represents the Papal system, NOT Antiochus Epiphanes.
3. **Azazel Identity**: In Leviticus 16, Azazel represents Satan (the scapegoat bearing away confessed sins), NEVER Christ.
4. **Hebrews & the Most Holy Place**: Christ entered the first apartment (Holy Place) of the heavenly sanctuary at His ascension. His Most Holy Place ministry began in 1844, not at the cross or ascension.
5. **Sabbath**: The seventh-day Sabbath (Saturday) remains God's holy day, unchanged by any human authority.
6. **State of the Dead**: The dead are unconscious, awaiting resurrection—no immortal soul doctrine.
7. **Second Coming**: Christ's return is literal, visible, and future—not secret or already fulfilled.

### PHOTOTHEOLOGY PRINCIPLES:
- Speak room names in full (e.g., "Concentration Room" not "CR", "Observation Room" not "OR")
- Always point to Christ as the center of Scripture
- Use the sanctuary as the interpretive blueprint
- Connect verses across the Eight Cycles (Adamic, Noahic, Abrahamic, Mosaic, Cyrusic, Cyrus-Christ, Spirit, Remnant)`;

  const depthInstructions = {
    surface: `
### COMMENTARY STYLE: Surface (Brief)
- Provide a 1-2 sentence insight on this verse
- Focus on the main spiritual takeaway
- Keep it concise and memorable
- Mention Christ connection if applicable`,
    intermediate: `
### COMMENTARY STYLE: Intermediate
- Provide a 2-3 sentence analysis
- Include key word meanings if significant
- Connect to sanctuary or typology if relevant
- Draw practical application`,
    depth: `
### COMMENTARY STYLE: Scholarly Depth
- Provide comprehensive verse analysis (3-5 sentences)
- Include Hebrew/Greek word insights if valuable
- Connect to types, patterns, and prophecy
- Apply Phototheology floor principles
- Show Christ-centered meaning`,
  };

  return basePrompt + depthInstructions[depth];
};

const getMaxTokens = (depth: CommentaryDepth) => {
  switch (depth) {
    case "surface": return 150;
    case "intermediate": return 250;
    case "depth": return 400;
    default: return 150;
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { book, chapter, verse, verseText, depth = "surface" } = await req.json();

    if (!book || !chapter || !verse || !verseText) {
      return new Response(
        JSON.stringify({ error: "Book, chapter, verse, and verseText are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = getSystemPrompt(depth as CommentaryDepth);
    const userPrompt = `Provide ${depth} commentary on this verse:

**${book} ${chapter}:${verse}**
"${verseText}"

Give insightful commentary appropriate for audio narration. Do not include verse reference in your response - just the commentary.`;

    console.log(`[Verse Commentary] Generating ${depth} commentary for ${book} ${chapter}:${verse}`);

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
        max_tokens: getMaxTokens(depth as CommentaryDepth),
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again later" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("[Verse Commentary] AI API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to generate commentary" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const commentary = data.choices?.[0]?.message?.content?.trim() || null;

    console.log(`[Verse Commentary] Generated ${commentary?.length || 0} chars for ${book} ${chapter}:${verse}`);

    return new Response(
      JSON.stringify({ commentary }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[Verse Commentary] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
