import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json().catch(() => ({}));
    const batchStart = body.batchStart || 1;
    const batchSize = body.batchSize || 10;
    const batchEnd = Math.min(batchStart + batchSize - 1, 365);

    console.log(`[DailyDevotional] Generating days ${batchStart}-${batchEnd}`);

    // Check which days already exist
    const { data: existing } = await supabase
      .from("daily_audio_devotionals")
      .select("day_number")
      .gte("day_number", batchStart)
      .lte("day_number", batchEnd)
      .in("status", ["text_ready", "generating_audio", "ready"]);

    const existingDays = new Set((existing || []).map(d => d.day_number));
    const daysToGenerate: number[] = [];
    for (let i = batchStart; i <= batchEnd; i++) {
      if (!existingDays.has(i)) daysToGenerate.push(i);
    }

    if (daysToGenerate.length === 0) {
      return new Response(
        JSON.stringify({ message: "All days in this batch already generated", skipped: batchEnd - batchStart + 1 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results: any[] = [];

    for (const dayNum of daysToGenerate) {
      // Upsert as generating
      await supabase
        .from("daily_audio_devotionals")
        .upsert({
          day_number: dayNum,
          title: "",
          scripture_reference: "",
          devotional_text: "",
          status: "generating_text",
          updated_at: new Date().toISOString(),
        }, { onConflict: "day_number" });

      try {
        const prompt = buildPrompt(dayNum);

        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: prompt },
            ],
            tools: [{
              type: "function",
              function: {
                name: "create_devotional",
                description: "Create a daily devotional entry",
                parameters: {
                  type: "object",
                  properties: {
                    title: { type: "string", description: "Devotional title, evocative and warm" },
                    scripture_reference: { type: "string", description: "Primary scripture reference e.g. 'Psalm 119:105'" },
                    scripture_text: { type: "string", description: "The full scripture text (KJV)" },
                    devotional_text: { type: "string", description: "The devotional body, 400-700 words. Warm, encouraging, deep." },
                    prayer: { type: "string", description: "A closing prayer, 2-3 sentences." },
                  },
                  required: ["title", "scripture_reference", "scripture_text", "devotional_text", "prayer"],
                  additionalProperties: false,
                },
              },
            }],
            tool_choice: { type: "function", function: { name: "create_devotional" } },
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`AI gateway error ${response.status}: ${errText}`);
        }

        const data = await response.json();
        const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
        if (!toolCall) throw new Error("No tool call in response");

        const devotional = JSON.parse(toolCall.function.arguments);

        await supabase
          .from("daily_audio_devotionals")
          .update({
            title: devotional.title,
            scripture_reference: devotional.scripture_reference,
            scripture_text: devotional.scripture_text,
            devotional_text: devotional.devotional_text,
            prayer: devotional.prayer,
            status: "text_ready",
            updated_at: new Date().toISOString(),
          })
          .eq("day_number", dayNum);

        results.push({ day: dayNum, status: "text_ready", title: devotional.title });
        console.log(`[DailyDevotional] Day ${dayNum}: "${devotional.title}"`);
      } catch (err: any) {
        console.error(`[DailyDevotional] Day ${dayNum} failed:`, err.message);
        await supabase
          .from("daily_audio_devotionals")
          .update({ status: "failed", error_message: err.message, updated_at: new Date().toISOString() })
          .eq("day_number", dayNum);
        results.push({ day: dayNum, status: "failed", error: err.message });
      }
    }

    return new Response(
      JSON.stringify({ generated: results.length, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("[DailyDevotional] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

const SYSTEM_PROMPT = `You are a warm, Spirit-filled devotional writer for Phototheology Palace, a Bible study app rooted in Seventh-day Adventist theology. Your devotionals encourage believers to spend time with God in prayer and deep Bible study.

Your voice is:
- Warm and pastoral, like a trusted elder speaking heart to heart
- Deeply scriptural — every devotional is anchored in specific Bible texts (KJV)
- Encouraging about the beauty, depth, and transformative power of God's Word
- Practical — each devotional inspires the reader to open their Bible and pray
- Christ-centered — always pointing to Jesus as revealed in Scripture

Each devotional should:
1. Open with a compelling hook tied to the day's scripture
2. Explore the scripture with insight, drawing out beauty and depth
3. Connect the ancient text to present-day spiritual life
4. Encourage the reader to study more deeply and pray
5. Close with a brief, heartfelt prayer

Length: 400-700 words for the devotional body. Write in a way that sounds natural when read aloud (this will be converted to audio).`;

function buildPrompt(dayNumber: number): string {
  // Create thematic variety across the year
  const themes = [
    "the beauty of God's Word as a lamp and light",
    "the power of prayer as conversation with God",
    "finding Christ in the Old Testament stories",
    "the sanctuary and what it teaches about God's plan",
    "God's faithfulness through trials",
    "the Psalms as a school of prayer",
    "the parables of Jesus and hidden treasures",
    "prophecy as evidence of God's sovereignty",
    "the Sabbath as a gift of rest and renewal",
    "the promises of Scripture for daily strength",
    "the character of God revealed in nature and Scripture",
    "walking by faith in uncertain times",
    "the joy of discovering new gems in familiar passages",
    "the Holy Spirit as teacher and guide in study",
    "preparing for Christ's return through devotion",
    "the power of memorizing and meditating on Scripture",
    "lessons from Bible heroes of faith",
    "the gospel in the feasts and ceremonies of Israel",
    "how Bible study transforms the mind and heart",
    "the depth of God's love as revealed in the cross",
  ];

  const themeIndex = (dayNumber - 1) % themes.length;
  const theme = themes[themeIndex];

  // Vary the biblical focus across the year
  const bookFamilies = [
    "Genesis or Exodus", "Psalms", "Proverbs or Ecclesiastes", "Isaiah or Jeremiah",
    "Daniel or Revelation", "Matthew or Mark", "Luke", "John",
    "Romans or Galatians", "Ephesians or Philippians", "Hebrews", "1 or 2 Peter",
  ];
  const bookIndex = (dayNumber - 1) % bookFamilies.length;
  const bookFocus = bookFamilies[bookIndex];

  return `Write Day ${dayNumber} of 365 daily audio devotionals.

Theme focus: ${theme}
Suggested biblical source (but you may draw from anywhere): ${bookFocus}

This is day ${dayNumber} of a year-long journey encouraging believers to fall deeper in love with God's Word and prayer. Make this devotional unique, specific, and memorable. Choose a specific passage and mine it for beauty and depth.

Remember: this will be read aloud as audio, so write conversationally and naturally.`;
}
