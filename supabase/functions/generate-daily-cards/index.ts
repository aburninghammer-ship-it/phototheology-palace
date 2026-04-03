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

const CATEGORIES = ["sanctuary", "types", "cycles", "patterns", "prophecy", "elements"];

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
  "redemption narrative", "exile and return", "new creation",
  "blood covenant", "stone memorials", "garments and robes",
  "seed and harvest", "firstborn themes", "rainbow covenant",
  "burning bush encounters", "pillar of cloud and fire", "manna from heaven",
  "cities of refuge", "kinsman redeemer", "day of atonement",
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    if (!lovableApiKey) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let count = 12;
    try {
      const body = await req.json();
      count = body.count || 12;
    } catch {
      // Use default
    }

    // Check if cards already generated today
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

    // Get existing titles to avoid duplicates
    const { data: existingCards } = await supabase
      .from("generated_spark_cards")
      .select("title")
      .order("created_at", { ascending: false })
      .limit(200);

    const existingTitles = existingCards?.map(c => c.title.toLowerCase()) || [];

    // Select random themes
    const shuffledThemes = THEMES.sort(() => Math.random() - 0.5).slice(0, count);

    // Generate all 12 cards in a single AI call for efficiency
    const prompt = `You are a Phototheology study card generator rooted in Scripture. Generate exactly ${count} unique study cards, each on a different theme from this list: ${shuffledThemes.map((t, i) => `${i+1}. ${t}`).join(", ")}.

For each card provide:
1. A compelling, poetic title (3-6 words) capturing a biblical mystery or pattern
2. 2-3 specific KJV verse anchors (e.g., "Genesis 1:2", "John 3:5")
3. Three prompts (Observe-Connect-Discover):
   - Observe: concrete question about what the text says
   - Connect: question linking to other Scripture passages
   - Discover: deeper theological question
4. A category from: sanctuary, types, cycles, patterns, prophecy, elements
5. 3-5 relevant single-word tags

CRITICAL RULES:
- Do NOT use any of these existing titles: ${existingTitles.slice(0, 50).join(", ")}
- All verse references must be real and relevant
- Each card must be distinct in theme and content
- Focus on visual, structural, or typological patterns from the Phototheology Palace method

Respond with ONLY a JSON array:
[
  {
    "title": "Title Here",
    "verse_anchors": ["Book Chapter:Verse", "Book Chapter:Verse"],
    "prompts": {
      "observe": "Question?",
      "connect": "Question?",
      "discover": "Question?"
    },
    "category": "patterns",
    "tags": ["tag1", "tag2", "tag3"]
  }
]`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are a Phototheology Bible study expert. You create study cards that help believers discover Christ-centered patterns, types, and symbols throughout Scripture using the Phototheology Palace method. Always respond with valid JSON only."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.9,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiResult = await aiResponse.json();
    const textContent = aiResult.choices?.[0]?.message?.content;

    if (!textContent) {
      throw new Error("No content in AI response");
    }

    // Parse JSON array from response
    const jsonMatch = textContent.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error("Could not parse JSON from:", textContent.substring(0, 200));
      throw new Error("Failed to parse AI response as JSON array");
    }

    let cardsData: any[];
    try {
      cardsData = JSON.parse(jsonMatch[0]);
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr, "Raw:", jsonMatch[0].substring(0, 300));
      throw new Error("Failed to parse AI JSON response");
    }

    const generatedCards = [];
    const debugInfo = {
      ai_cards_count: cardsData.length,
      duplicates_skipped: 0,
      insert_errors: [] as string[],
      existing_titles_count: existingTitles.length,
      existing_today: existingCount || 0,
    };

    for (const cardData of cardsData) {
      // Skip duplicates
      if (existingTitles.includes(cardData.title?.toLowerCase())) {
        debugInfo.duplicates_skipped++;
        continue;
      }

      // Validate category
      const category = CATEGORIES.includes(cardData.category) ? cardData.category : CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

      // Select 2 random palace rooms
      const shuffledRooms = [...PALACE_ROOMS].sort(() => Math.random() - 0.5);
      const selectedRooms = shuffledRooms.slice(0, 2);

      const { data: insertedCard, error } = await supabase
        .from("generated_spark_cards")
        .insert({
          title: cardData.title,
          verse_anchors: cardData.verse_anchors || [],
          palace_rooms: selectedRooms,
          prompts: cardData.prompts || { observe: "", connect: "", discover: "" },
          category,
          tags: cardData.tags || [],
          generation_date: today,
        })
        .select()
        .single();

      if (error) {
        console.error("Insert error:", error);
        debugInfo.insert_errors.push(`${cardData.title}: ${error.message}`);
        continue;
      }

      generatedCards.push(insertedCard);
      existingTitles.push(cardData.title.toLowerCase());
    }

    // Log the generation
    try {
      await supabase
        .from("spark_card_generation_log")
        .insert({
          generation_date: today,
          cards_generated: generatedCards.length,
          success: generatedCards.length > 0,
          error_message: generatedCards.length === 0
            ? `AI returned ${debugInfo.ai_cards_count} cards, ${debugInfo.duplicates_skipped} duplicates skipped, ${debugInfo.insert_errors.length} insert errors`
            : null,
        });
    } catch {
      // Log table may not exist yet — skip logging
    }

    console.log(`Generated ${generatedCards.length} spark cards for ${today}. Debug:`, JSON.stringify(debugInfo));

    return new Response(
      JSON.stringify({
        success: true,
        generated_count: generatedCards.length,
        cards: generatedCards,
        debug: debugInfo,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Generate daily cards error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    // Try to log the failure
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      await supabase.from("spark_card_generation_log").insert({
        generation_date: new Date().toISOString().split('T')[0],
        cards_generated: 0,
        success: false,
        error_message: errorMessage,
      }).catch(() => {});
    } catch { /* ignore logging failure */ }

    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
