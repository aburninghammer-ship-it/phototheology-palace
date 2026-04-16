import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const THEME_TYPES = [
  "symbol", "number", "person", "title", "object", "concept", "theme",
];

const THEME_POOL = [
  // Symbols
  { type: "symbol", keyword: "blood" },
  { type: "symbol", keyword: "water" },
  { type: "symbol", keyword: "fire" },
  { type: "symbol", keyword: "oil" },
  { type: "symbol", keyword: "bread" },
  { type: "symbol", keyword: "wine" },
  { type: "symbol", keyword: "lamb" },
  { type: "symbol", keyword: "dove" },
  { type: "symbol", keyword: "rock" },
  { type: "symbol", keyword: "sword" },
  { type: "symbol", keyword: "crown" },
  { type: "symbol", keyword: "door" },
  { type: "symbol", keyword: "key" },
  { type: "symbol", keyword: "seed" },
  { type: "symbol", keyword: "vine" },
  { type: "symbol", keyword: "salt" },
  { type: "symbol", keyword: "leaven" },
  { type: "symbol", keyword: "trumpet" },
  { type: "symbol", keyword: "veil" },
  { type: "symbol", keyword: "tree" },
  // Numbers
  { type: "number", keyword: "3" },
  { type: "number", keyword: "7" },
  { type: "number", keyword: "12" },
  { type: "number", keyword: "40" },
  { type: "number", keyword: "10" },
  { type: "number", keyword: "4" },
  { type: "number", keyword: "5" },
  { type: "number", keyword: "8" },
  { type: "number", keyword: "70" },
  { type: "number", keyword: "144" },
  // Persons
  { type: "person", keyword: "Melchizedek" },
  { type: "person", keyword: "Joseph" },
  { type: "person", keyword: "Moses" },
  { type: "person", keyword: "David" },
  { type: "person", keyword: "Elijah" },
  { type: "person", keyword: "Daniel" },
  { type: "person", keyword: "Ruth" },
  { type: "person", keyword: "Abraham" },
  { type: "person", keyword: "Joshua" },
  { type: "person", keyword: "Esther" },
  { type: "person", keyword: "Jonah" },
  { type: "person", keyword: "Samson" },
  // Titles
  { type: "title", keyword: "Son of Man" },
  { type: "title", keyword: "Lamb of God" },
  { type: "title", keyword: "King of Kings" },
  { type: "title", keyword: "High Priest" },
  { type: "title", keyword: "Good Shepherd" },
  { type: "title", keyword: "Bread of Life" },
  { type: "title", keyword: "Light of the World" },
  { type: "title", keyword: "Alpha and Omega" },
  // Objects
  { type: "object", keyword: "altar" },
  { type: "object", keyword: "ark" },
  { type: "object", keyword: "tabernacle" },
  { type: "object", keyword: "staff" },
  { type: "object", keyword: "stone" },
  { type: "object", keyword: "garment" },
  { type: "object", keyword: "scroll" },
  { type: "object", keyword: "shield" },
  // Concepts
  { type: "concept", keyword: "covenant" },
  { type: "concept", keyword: "sabbath rest" },
  { type: "concept", keyword: "firstborn" },
  { type: "concept", keyword: "atonement" },
  { type: "concept", keyword: "redemption" },
  { type: "concept", keyword: "wilderness" },
  { type: "concept", keyword: "exile and return" },
  { type: "concept", keyword: "inheritance" },
  { type: "concept", keyword: "sanctification" },
  { type: "concept", keyword: "intercession" },
];

const ICONS_BY_TYPE: Record<string, string[]> = {
  symbol: ["Droplets", "Flame", "Sparkles", "Gem"],
  number: ["Hash", "Calculator", "Grid3X3", "Binary"],
  person: ["User", "Crown", "Sword", "Shield"],
  title: ["Crown", "Star", "Sun", "Sparkles"],
  object: ["Box", "Landmark", "Scroll", "Shield"],
  concept: ["Brain", "Layers", "Target", "Compass"],
  theme: ["Route", "Map", "BookOpen", "Lightbulb"],
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY is not configured");

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let count = 10;
    try {
      const body = await req.json();
      count = body.count || 10;
    } catch { /* default */ }

    // Check if paths already generated today
    const today = new Date().toISOString().split("T")[0];
    const { count: existingCount } = await supabase
      .from("generated_study_paths")
      .select("*", { count: "exact", head: true })
      .eq("generation_date", today);

    if (existingCount && existingCount >= 10) {
      return new Response(
        JSON.stringify({ success: false, message: "Daily paths already generated", existing_count: existingCount }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get existing keywords to avoid duplicates in last 30 days
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const { data: recentPaths } = await supabase
      .from("generated_study_paths")
      .select("theme_keyword")
      .gte("generation_date", cutoff.toISOString().split("T")[0]);

    const usedKeywords = new Set((recentPaths || []).map((p: any) => p.theme_keyword.toLowerCase()));

    // Pick themes not used recently
    const available = THEME_POOL.filter(t => !usedKeywords.has(t.keyword.toLowerCase()));
    const selected = available.sort(() => Math.random() - 0.5).slice(0, count);

    // If not enough unique themes, allow some repeats
    while (selected.length < count) {
      const extra = THEME_POOL[Math.floor(Math.random() * THEME_POOL.length)];
      selected.push(extra);
    }

    const prompt = `You are a Phototheology study path generator. Generate exactly ${count} guided study paths. Each path traces ONE theme/symbol/concept through Scripture from Genesis to Revelation.

For each path I give you a theme_type and keyword. Create:
1. A compelling title (3-7 words)
2. A rich description (2-3 sentences) explaining what the student will discover
3. Exactly 5-7 sequential study steps tracing the theme through Scripture chronologically
4. A category from: sanctuary, types, cycles, patterns, prophecy, elements

Each step must have:
- title: a short evocative name for that stop on the journey
- verse_anchor: a specific KJV verse reference
- observe: what to notice in this passage about the theme
- connect: how this connects to the previous step or broader pattern
- discover: what this reveals about Christ or God's character

THEMES TO GENERATE:
${selected.map((t, i) => `${i + 1}. Type: ${t.type}, Keyword: "${t.keyword}"`).join("\n")}

THEOLOGICAL GUARDRAILS:
- Christ-centered throughout
- Historicist prophetic interpretation
- Sanctuary-anchored theology
- All verse references must be real KJV verses

Respond with ONLY a JSON array:
[
  {
    "theme_index": 0,
    "title": "Title Here",
    "description": "Description here.",
    "category": "patterns",
    "steps": [
      {
        "title": "Step Title",
        "verse_anchor": "Genesis 3:21",
        "observe": "What do you notice?",
        "connect": "How does this connect?",
        "discover": "What does this reveal?"
      }
    ]
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
            content: "You are a Phototheology Bible study expert. You create guided study paths that trace themes, symbols, persons, numbers, and concepts through the entire Bible using the Phototheology Palace method. Always respond with valid JSON only.",
          },
          { role: "user", content: prompt },
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
    if (!textContent) throw new Error("No content in AI response");

    const jsonMatch = textContent.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("Failed to parse AI response as JSON array");

    const pathsData = JSON.parse(jsonMatch[0]);
    const generatedPaths = [];

    for (const pathData of pathsData) {
      const themeIndex: number = pathData.theme_index ?? generatedPaths.length;
      const theme: any = selected[themeIndex] || selected[0];
      const icons: string[] = ICONS_BY_TYPE[theme.type] || ["Route"];
      const icon: string = icons[Math.floor(Math.random() * icons.length)];

      const { data: inserted, error } = await supabase
        .from("generated_study_paths")
        .insert({
          title: pathData.title,
          description: pathData.description,
          icon,
          theme_type: theme.type,
          theme_keyword: theme.keyword,
          category: pathData.category || "patterns",
          steps: pathData.steps || [],
          estimated_sessions: pathData.steps?.length || 5,
          generation_date: today,
        })
        .select()
        .single();

      if (error) {
        console.error("Insert error:", error);
        continue;
      }
      generatedPaths.push(inserted);
    }

    await supabase.from("study_path_generation_log").insert({
      generation_date: today,
      paths_generated: generatedPaths.length,
      success: true,
    });

    console.log(`Generated ${generatedPaths.length} study paths for ${today}`);

    return new Response(
      JSON.stringify({ success: true, generated_count: generatedPaths.length, paths: generatedPaths }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Generate daily paths error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      await supabase.from("study_path_generation_log").insert({
        generation_date: new Date().toISOString().split("T")[0],
        paths_generated: 0,
        success: false,
        error_message: errorMessage,
      });
    } catch { /* ignore */ }

    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
