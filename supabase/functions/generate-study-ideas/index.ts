import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getCorpusContext } from '../_shared/corpus-rag.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { input } = await req.json();

    if (!input || typeof input !== "string") {
      return new Response(
        JSON.stringify({ error: "Input is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY not configured");
    }

    let systemPrompt = `You are Jeeves, a Phototheology study idea generator. Your task is to generate 8 unique, compelling study ideas based on the user's input (a word, verse, or theme).

⚠️ THEOLOGICAL GUARDRAILS (NON-NEGOTIABLE):
- AZAZEL = SATAN, NOT CHRIST (Leviticus 16 scapegoat = Satan)
- LITTLE HORN = ROME/PAPACY, NOT ANTIOCHUS (Daniel 7 & 8)
- TWO-PHASE SANCTUARY: Holy Place at ascension (31 AD); Most Holy Place in 1844
- DAY OF ATONEMENT = 1844, NOT THE CROSS (Christ's death = Passover)
- SPRING FEASTS = First Advent; FALL FEASTS = Second Advent ministry

PHOTOTHEOLOGY PRINCIPLES TO APPLY:
1. Observation Room (OR): What raw details are in the text?
2. Symbols/Types Room (ST): What recurring symbols or types are present?
3. Patterns Room (PRm): What structural patterns recur?
4. Parallels Room (P‖): What mirror events exist across Scripture?
5. Christ Connection (CR): How does this point to Christ?
6. Sanctuary Room (BL): How does this connect to sanctuary teaching?
7. Three Heavens (123H): Personal, Church, and Eschatological applications
8. Cycles Room (@): Where is this in the 8 redemptive cycles?

RULES:
- Generate exactly 8 study ideas
- Each idea should have a poetic/evocative title (3-6 words)
- Include 2-3 specific verse anchors per idea
- Map each idea to 1-2 Palace Rooms
- Create 3 prompts per idea: Observe, Connect, Discover
- Ensure variety: different rooms, different Bible periods, different angles
- Be Christ-centered but not forced
- NO markdown formatting
- Titles should spark curiosity

OUTPUT FORMAT (JSON array, no markdown):
{
  "ideas": [
    {
      "title": "Poetic Evocative Title",
      "verses": ["Genesis 22:8", "John 1:29"],
      "rooms": [
        { "id": "st", "name": "Symbols/Types", "icon": "Compass" },
        { "id": "cr", "name": "Christ", "icon": "Crown" }
      ],
      "observePrompt": "What details do you notice about X?",
      "connectPrompt": "Where else does this pattern appear?",
      "discoverPrompt": "What does this reveal about God's character?"
    }
  ]
}

ROOM ID REFERENCE:
- sr: Story Room (Book icon)
- or: Observation Room (Search icon)
- st: Symbols/Types (Compass icon)
- prm: Patterns (Target icon)
- p||: Parallels (GitCompare icon)
- cr: Christ (Crown icon)
- bl: Sanctuary (Church icon)
- fe: Feasts (CalendarDays icon)
- 123h: Three Heavens (Scale icon)
- cycles: Cycles (Zap icon)
- dr: Dimensions/Presence (Layers icon)`;

    const userPrompt = `Generate 8 Phototheology study ideas based on this input: "${input}"

The ideas should explore different angles, different Bible sections, and different Palace Rooms. Make them compelling and thought-provoking.`;

    // RAG corpus injection
    const ragResult = await getCorpusContext({
      query: input.slice(0, 4000),
      matchCount: 2,
    });
    if (ragResult.chunkCount > 0) {
      systemPrompt += ragResult.corpusContext;
    }

    console.log("Generating study ideas for input:", input);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        messages: [
          {
            role: "user",
            content: userPrompt,
          },
        ],
        system: systemPrompt,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error:", response.status, errorText);
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.content?.[0]?.text;

    if (!content) {
      throw new Error("No content in API response");
    }

    // Parse the JSON response
    let parsedContent;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Content:", content);
      throw new Error("Failed to parse AI response");
    }

    console.log("Generated", parsedContent.ideas?.length || 0, "ideas");

    return new Response(JSON.stringify(parsedContent), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-study-ideas:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
