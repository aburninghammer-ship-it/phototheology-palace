import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Palace room options for card generation
const PALACE_ROOMS = [
  { id: "bl", name: "Sanctuary", icon: "Church" },
  { id: "dr", name: "Presence", icon: "Sparkles" },
  { id: "cr", name: "Glory", icon: "Sun" },
  { id: "st", name: "Elements", icon: "Droplets" },
  { id: "prm", name: "Patterns", icon: "Target" },
  { id: "prm", name: "Types", icon: "Copy" },
  { id: "st", name: "Numbers", icon: "Hash" },
  { id: "prm", name: "Cycles", icon: "RefreshCw" },
  { id: "dr", name: "Revelation", icon: "Moon" },
  { id: "bl", name: "Atonement", icon: "Cross" },
  { id: "st", name: "Nature", icon: "TreeDeciduous" },
  { id: "dr", name: "Providence", icon: "Gift" },
];

// Categories for cards
const CATEGORIES = ["sanctuary", "types", "cycles", "patterns", "prophecy", "elements"];

// Biblical themes for variety
const THEMES = [
  "creation patterns", "sanctuary furniture", "wilderness journey",
  "covenant signs", "prophetic types", "Hebrew word study",
  "numerical symbolism", "geographic symbolism", "feast days",
  "sacrificial system", "priestly garments", "divine encounters",
  "messianic prophecy", "kingdom parables", "resurrection themes",
  "water symbolism", "fire symbolism", "light and darkness",
  "bread and wine", "shepherd imagery", "vine and branches",
  "temple architecture", "holy mountain themes", "angel visitations",
  "divine names", "prayer patterns", "blessing and curse",
  "redemption narrative", "exile and return", "new creation"
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body for count (default 12)
    let count = 12;
    try {
      const body = await req.json();
      count = body.count || 12;
    } catch {
      // Use default if no body
    }

    // Check how many cards were generated today
    const today = new Date().toISOString().split('T')[0];
    const { count: existingCount } = await supabase
      .from("generated_spark_cards")
      .select("*", { count: "exact", head: true })
      .eq("generation_date", today);

    if (existingCount && existingCount >= 12) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Daily cards already generated",
          existing_count: existingCount
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get existing card titles to avoid duplicates
    const { data: existingCards } = await supabase
      .from("generated_spark_cards")
      .select("title")
      .limit(100);

    const existingTitles = existingCards?.map(c => c.title.toLowerCase()) || [];

    // Select random themes for variety
    const shuffledThemes = THEMES.sort(() => Math.random() - 0.5).slice(0, count);

    const generatedCards = [];

    for (let i = 0; i < count; i++) {
      const theme = shuffledThemes[i % shuffledThemes.length];
      const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

      // Generate card using Claude
      const prompt = `You are a Phototheology study card generator. Create ONE unique study card for the theme: "${theme}"

Generate a card with:
1. A compelling, poetic title (3-6 words) that captures a biblical mystery or pattern
2. 2-3 specific verse anchors (e.g., "Genesis 1:2", "John 3:5")
3. Three prompts following the Observe-Connect-Discover pattern:
   - Observe: A concrete question about what the text says
   - Connect: A question linking this to other Scripture passages
   - Discover: A deeper theological question about meaning
4. 3-5 relevant tags (single words)

IMPORTANT:
- Do NOT use any of these existing titles: ${existingTitles.slice(0, 20).join(", ")}
- Verse references must be accurate and relevant to the theme
- Keep prompts concise but thought-provoking
- Focus on visual, structural, or typological patterns

Respond in this exact JSON format:
{
  "title": "The Title Here",
  "verse_anchors": ["Book Chapter:Verse", "Book Chapter:Verse"],
  "prompts": {
    "observe": "Question about what the text says?",
    "connect": "Question linking to other passages?",
    "discover": "Deeper theological question?"
  },
  "tags": ["tag1", "tag2", "tag3"]
}`;

      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": anthropicApiKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-3-haiku-20240307",
            max_tokens: 500,
            messages: [{ role: "user", content: prompt }],
          }),
        });

        if (!response.ok) {
          console.error(`AI API error: ${response.status}`);
          continue;
        }

        const aiResult = await response.json();
        const textContent = aiResult.content?.find((c: any) => c.type === "text")?.text;

        if (!textContent) continue;

        // Parse JSON from response
        const jsonMatch = textContent.match(/\{[\s\S]*\}/);
        if (!jsonMatch) continue;

        const cardData = JSON.parse(jsonMatch[0]);

        // Skip if title already exists
        if (existingTitles.includes(cardData.title.toLowerCase())) {
          continue;
        }

        // Select 2 random palace rooms
        const shuffledRooms = PALACE_ROOMS.sort(() => Math.random() - 0.5);
        const selectedRooms = shuffledRooms.slice(0, 2);

        // Insert into database
        const { data: insertedCard, error } = await supabase
          .from("generated_spark_cards")
          .insert({
            title: cardData.title,
            verse_anchors: cardData.verse_anchors,
            palace_rooms: selectedRooms,
            prompts: cardData.prompts,
            category: category,
            tags: cardData.tags,
            generation_date: today,
          })
          .select()
          .single();

        if (error) {
          console.error("Insert error:", error);
          continue;
        }

        generatedCards.push(insertedCard);
        existingTitles.push(cardData.title.toLowerCase());

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (cardError) {
        console.error("Error generating card:", cardError);
        continue;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        generated_count: generatedCards.length,
        cards: generatedCards,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Generate daily cards error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
