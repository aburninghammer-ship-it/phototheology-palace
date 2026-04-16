import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Themes for daily devotionals when no specific series is requested
const DAILY_THEMES = [
  { theme: "trust", focus: "Trusting God's timing and plan for your life" },
  { theme: "contentment", focus: "Finding joy and peace in your current season" },
  { theme: "identity", focus: "Knowing your worth and identity in Christ" },
  { theme: "purpose", focus: "Discovering and living out your God-given purpose" },
  { theme: "purity", focus: "Guarding your heart and honoring God with your body" },
  { theme: "community", focus: "Building meaningful connections and fighting loneliness" },
  { theme: "service", focus: "Using your singleness for kingdom impact" },
  { theme: "preparation", focus: "Growing in character and readiness for the future" },
  { theme: "waiting", focus: "Active waiting and using this season wisely" },
  { theme: "hope", focus: "Anchoring your hope in God's promises" },
];

const SYSTEM_PROMPT = `You are Jeeves, a compassionate and wise biblical counselor creating devotional content specifically for single Christians.

=== YOUR VOICE ===
- Warm, understanding, and encouraging (not preachy or condescending)
- Acknowledge the real challenges of singleness without being patronizing
- Balance honesty about struggles with hope and biblical truth
- Speak as someone who values singleness as a legitimate and purposeful season
- Never imply that marriage is the ultimate goal or that singleness is "less than"

=== THEOLOGICAL FOUNDATION ===
- Ground everything in Scripture (KJV only for quotes)
- Point consistently to Christ as the ultimate source of fulfillment
- Emphasize that worth and identity come from God, not relationship status
- Present singleness as Paul did in 1 Corinthians 7 - a gift with unique advantages for service
- Connect to sanctuary typology where appropriate (the believer as a temple of the Holy Spirit)

=== CONTENT GUIDELINES ===
- Be specific and practical, not vague platitudes
- Include real-world applications they can implement today
- Address common struggles honestly: loneliness, desire for companionship, watching others marry
- Offer hope without making false promises about future relationships
- Help them see their current season as valuable, not just a waiting room
- INCLUDE specific biblical examples, stories, or characters to illustrate points
- Reference biblical narratives of singles (Paul, Anna, John the Baptist, etc.) or others facing similar struggles
- Each devotional must offer a FRESH, UNIQUE insight - not the same lessons repeated
- Paint vivid biblical scenes - don't just quote verses, tell the story

=== AVOID ===
- Cliches like "Jesus is your boyfriend" or "God is writing your love story"
- Implying that if they just pray hard enough, God will send a spouse
- Making marriage sound like the reward for faithfulness
- Dismissing the genuine difficulty of singleness
- Generic Christian advice that isn't specifically relevant to singles

=== SCHOLAR CITATION RULE ===
When referencing any scholar, commentator, or theologian, include proper citation:
- Full name + life dates + work being referenced
- Example: "As Charles Spurgeon (1834-1892, Baptist, *Morning and Evening*) wrote..."

=== TITLE REQUIREMENTS ===
- Each title MUST be UNIQUE and specific to THIS devotional's central insight
- NEVER use generic titles like "Walking by Faith", "Trust in His Timing", "Finding Joy", "His Perfect Plan"
- Include a vivid, memorable word or phrase that makes this title stand out
- The title should make someone curious about what's inside
- Think of creative, fresh titles - not churchy clichés

=== OUTPUT FORMAT (JSON) ===
{
  "title": "UNIQUE 5-10 word title specific to this devotional's insight (no generic phrases)",
  "scriptureReference": "Book Chapter:Verse(s)",
  "scriptureText": "Full KJV text of the verse(s)",
  "openingThought": "1-2 sentences that hook the reader with a relatable scenario or question",
  "mainContent": "3-4 paragraphs of rich devotional content. Include personal application, biblical insight, and encouragement. Use paragraph breaks.",
  "reflectionQuestions": ["Question 1", "Question 2", "Question 3"],
  "prayerPrompt": "A guided prayer prompt (not the full prayer, but direction for their own prayer)",
  "practicalApplication": "One specific, actionable thing they can do today",
  "christConnection": "1-2 sentences showing how this truth ultimately points to Jesus"
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mode, seriesId, dayNumber, theme, userName } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    let userPrompt = "";
    let selectedTheme = theme;

    if (mode === "daily") {
      // Generate a daily devotional
      const todayStr = new Date().toISOString().split('T')[0];

      // Check cache first
      if (supabaseUrl && supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        const { data: cached } = await supabase
          .from("daily_singles_devotional_cache")
          .select("*")
          .eq("date_for", todayStr)
          .maybeSingle();

        if (cached) {
          console.log("[Singles Devotional] Cache hit for", todayStr);
          return new Response(
            JSON.stringify({ success: true, devotional: cached, cached: true }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      // Select a random theme if not provided
      if (!selectedTheme) {
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
        selectedTheme = DAILY_THEMES[dayOfYear % DAILY_THEMES.length];
      }

      const todayDate = new Date();
      const dateStr = todayDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

      userPrompt = `Generate a daily devotional for single Christians for ${dateStr}.

TODAY'S THEME: ${typeof selectedTheme === 'object' ? selectedTheme.focus : selectedTheme}

${userName ? `The reader's name is ${userName}. You may address them by name occasionally to make it personal.` : ''}

Create a FRESH, encouraging devotional that speaks to the hearts of singles navigating faith and life.
Choose an appropriate Scripture passage that illuminates this theme.
Make it practical, biblical, and genuinely helpful for their day.

CRITICAL: Create a UNIQUE title - not generic religious phrases. The title should be memorable and specific to the insight you share.`;

    } else if (mode === "series" && seriesId) {
      // Generate content for a specific series day
      if (supabaseUrl && supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        const { data: series, error } = await supabase
          .from("singles_devotional_series")
          .select("*")
          .eq("id", seriesId)
          .single();

        if (error || !series) {
          throw new Error("Series not found");
        }

        const anchorScripture = series.anchor_scriptures?.[dayNumber - 1] || series.anchor_scriptures?.[0] || "Psalm 37:4";

        userPrompt = `Generate Day ${dayNumber} of ${series.total_days} for the series: "${series.title}"

SERIES DESCRIPTION: ${series.description}
SERIES THEME: ${series.theme}
TODAY'S ANCHOR SCRIPTURE: ${anchorScripture}

${userName ? `The reader's name is ${userName}. You may address them by name occasionally.` : ''}

This is part of a progressive journey. Day ${dayNumber} should:
${dayNumber === 1 ? "- Introduce the theme and set the foundation" : ""}
${dayNumber === series.total_days ? "- Bring the series to a meaningful conclusion with practical next steps" : ""}
${dayNumber > 1 && dayNumber < series.total_days ? "- Build on previous days while introducing new insights" : ""}

Create devotional content that fits this specific day in the journey.`;
      }
    } else {
      // Default: generate based on provided theme
      userPrompt = `Generate a devotional for single Christians on the theme of: ${selectedTheme || 'finding purpose in singleness'}

${userName ? `The reader's name is ${userName}. Address them by name occasionally.` : ''}

Create thoughtful, biblical content that speaks to this specific aspect of the single Christian's journey.`;
    }

    console.log(`[Singles Devotional] Generating ${mode} devotional${seriesId ? ` for series ${seriesId} day ${dayNumber}` : ''}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 4096,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Singles Devotional] AI API error: ${errorText}`);
      throw new Error(`AI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    let devotionalData;
    try {
      devotionalData = JSON.parse(content);
    } catch (parseError) {
      console.error("[Singles Devotional] Failed to parse AI response:", content);
      throw new Error("Failed to parse AI response as JSON");
    }

    // Cache daily devotionals
    if (mode === "daily" && supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      const today = new Date().toISOString().split('T')[0];

      await supabase.from("daily_singles_devotional_cache").upsert({
        date_for: today,
        title: devotionalData.title,
        scripture_reference: devotionalData.scriptureReference,
        scripture_text: devotionalData.scriptureText,
        opening_thought: devotionalData.openingThought,
        main_content: devotionalData.mainContent,
        reflection_questions: devotionalData.reflectionQuestions,
        prayer_prompt: devotionalData.prayerPrompt,
        practical_application: devotionalData.practicalApplication,
        christ_connection: devotionalData.christConnection,
        theme: typeof selectedTheme === 'object' ? selectedTheme.theme : selectedTheme,
      }, { onConflict: "date_for" });

      console.log("[Singles Devotional] Cached daily devotional for", today);
    }

    console.log(`[Singles Devotional] Successfully generated: ${devotionalData.title}`);

    return new Response(
      JSON.stringify({
        success: true,
        devotional: devotionalData,
        cached: false,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("[Singles Devotional] Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
