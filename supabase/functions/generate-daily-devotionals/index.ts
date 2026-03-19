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
    const batchSize = body.batchSize || 3;

    // Auto-detect next batch: find highest existing day and start after it
    let batchStart = body.batchStart;
    if (!batchStart) {
      const { data: maxRow } = await supabase
        .from("daily_audio_devotionals")
        .select("day_number")
        .in("status", ["text_ready", "generating_audio", "ready"])
        .order("day_number", { ascending: false })
        .limit(1)
        .single();
      batchStart = maxRow ? maxRow.day_number + 1 : 1;
    }
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
                    title: { type: "string", description: "Devotional title — vivid, intriguing, and warm. Should spark curiosity." },
                    scripture_reference: { type: "string", description: "Primary scripture reference e.g. 'Psalm 119:105'" },
                    scripture_text: { type: "string", description: "The full scripture text (KJV)" },
                    devotional_text: { type: "string", description: "The devotional body, 400-700 words. Uses Palace principles naturally. Addresses listener as {{name}}. Ends with a specific app CTA." },
                    prayer: { type: "string", description: "A closing prayer, 2-3 sentences. Addresses listener as {{name}}." },
                    palace_room: { type: "string", description: "The primary Palace room code used (e.g. NF, IR, ST, BL, CR, PRm, etc.)" },
                    app_feature_cta: { type: "string", description: "The specific app feature suggested. One of: Audio Bible, Sparks, Palace Rooms, Gems, Bible Freestyle, Story Room, Memory Drills, Reading Plans, Challenges, Sermon Builder, Study Series, Daily Verse" },
                    call_to_action: { type: "string", description: "A brief, motivating one-liner CTA for the SMS. E.g. 'Open your Story Room and relive Joseph\\'s journey today.'" },
                  },
                  required: ["title", "scripture_reference", "scripture_text", "devotional_text", "prayer", "palace_room", "app_feature_cta", "call_to_action"],
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
            palace_room: devotional.palace_room,
            app_feature_cta: devotional.app_feature_cta,
            call_to_action: devotional.call_to_action,
            status: "text_ready",
            updated_at: new Date().toISOString(),
          })
          .eq("day_number", dayNum);

        results.push({ day: dayNum, status: "text_ready", title: devotional.title });
        console.log(`[DailyDevotional] Day ${dayNum}: "${devotional.title}" [${devotional.palace_room}]`);
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

// ─── SYSTEM PROMPT ───────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a warm, Spirit-filled devotional writer for Phototheology Palace — a Bible study app built on a palace of 8 ascending floors, each with rooms that teach specific Bible study principles. Your audience is busy believers who feel they DON'T have time for deep Bible study. Your mission: show them that even 3-5 minutes with God's Word can be transformative — and inspire them to carve out more.

YOUR VOICE:
- Warm, conversational, like a trusted friend grabbing coffee with the listener
- Never preachy or guilt-tripping — always encouraging, never shaming
- Use vivid imagery, object lessons, and nature analogies to make truth unforgettable
- Speak directly to the listener using {{name}} (this will be replaced with their actual name)
- Christ-centered — always pointing to Jesus as revealed in Scripture
- Practical — give one specific, doable takeaway they can act on TODAY

PHOTOTHEOLOGY PALACE PRINCIPLES (use these naturally, never as jargon):
You rotate through these approaches — weaving them in organically, never naming the "room" or "floor" directly:

1. STORY ROOM (SR) — Turn Scripture into vivid mental movies. Help them SEE the scene.
2. IMAGINATION ROOM (IR) — Step INSIDE the story. "Picture yourself standing at the Red Sea..."
3. NATURE FREESTYLE (NF) — Draw spiritual lessons from everyday nature: sunrise, seeds, storms, trees.
4. PERSONAL FREESTYLE (PF) — Connect Scripture to relatable daily-life moments: traffic, coffee, keys, deadlines.
5. BIBLE FREESTYLE (BF) — Show how one verse connects to others across Scripture (verse genetics).
6. SYMBOLS & TYPES (ST) — Reveal how objects/events point to Christ: lamb, rock, bread, water.
7. CONCENTRATION ROOM (CR) — Show Christ hidden in unexpected passages.
8. PATTERNS ROOM (PRm) — Highlight God's repeating patterns: 3 days, 40 days, deliverer stories.
9. BLUE ROOM / SANCTUARY (BL) — Connect truths to the sanctuary blueprint of salvation.
10. GEMS ROOM (GR) — Share a striking insight that "shines" — the kind that makes you say "I never noticed that!"
11. DIMENSIONS ROOM (DR) — Show a text from multiple angles: literal, Christ, personal, church, heaven.
12. PARALLELS (P‖) — Mirror actions across time: Babel/Pentecost, Exodus/Return.
13. FIRE ROOM (FRm) — Let the emotional weight of a passage land. Don't rush past the cross.
14. HISTORY FREESTYLE (HF) — Connect biblical truth to a moment in history or culture.

STRUCTURE OF EACH DEVOTIONAL:
1. HOOK (1-2 sentences): Start with a vivid object lesson, nature image, or relatable moment that grabs attention.
2. SCRIPTURE ANCHOR: Introduce the day's passage naturally. Quote KJV.
3. PALACE EXPLORATION (main body): Unpack the passage using 1-2 Palace principles. Make them SEE what they've been missing. Show that the Bible is an ocean, not a puddle.
4. THE NUDGE: Gently challenge the "I don't have time" mindset. Reframe: "You have 3 minutes for social media — you have 3 minutes for the God of the universe." Be creative. Never repeat the same nudge.
5. APP CTA: End with a specific, personalized call to action pointing to a feature in Phototheology Palace. E.g., "{{name}}, open up the Story Room today and relive David's encounter with Goliath. Let the stones fly in your imagination."
6. PRAYER: Brief, heartfelt, using {{name}}.

CRITICAL RULES:
- ALWAYS use {{name}} at least 2-3 times in the devotional (opening, CTA, prayer)
- NEVER use Palace jargon like "Floor 3" or "Room code NF" — weave principles naturally
- Vary the Palace principle used each day — cycle through all of them
- Each devotional must suggest ONE specific app feature to try today
- Write for AUDIO — conversational, natural rhythm, no bullet points or headers
- Length: 400-700 words for devotional body
- Use KJV for Scripture quotations`;

// ─── PROMPT BUILDER ──────────────────────────────────────────────────────────
function buildPrompt(dayNumber: number): string {
  // Rotate through Palace principles
  const palaceFocus = [
    { room: "SR", instruction: "Use the STORY ROOM approach — turn a passage into a vivid mental movie. Help the listener see, hear, smell, and feel the scene." },
    { room: "NF", instruction: "Use a NATURE FREESTYLE — start with something in nature (a seed, a storm, a sunrise, an eagle, a river) and draw a spiritual parallel to a scripture." },
    { room: "IR", instruction: "Use the IMAGINATION ROOM — place the listener INSIDE a Bible scene. 'Imagine you're standing there...' Make it immersive and personal." },
    { room: "ST", instruction: "Use SYMBOLS & TYPES — show how an object or event in Scripture (lamb, rock, bread, water, serpent, fire) is actually pointing to Christ." },
    { room: "CR", instruction: "Use the CONCENTRATION ROOM — find Christ in an unexpected or overlooked passage. Show that He's on every page." },
    { room: "PF", instruction: "Use PERSONAL FREESTYLE — start with a relatable everyday moment (being stuck in traffic, losing your keys, waiting in line) and connect it to a Bible truth." },
    { room: "GR", instruction: "Use the GEMS ROOM — share a striking biblical insight, the kind that makes someone say 'I never noticed that before!' Make it sparkle." },
    { room: "PRm", instruction: "Use the PATTERNS ROOM — show a pattern God repeats in Scripture (40 days, 3 days, deliverer stories, fall-covenant-restoration). Let the pattern reveal God's character." },
    { room: "BL", instruction: "Use the BLUE ROOM / SANCTUARY — connect a passage or truth to the sanctuary system (altar, laver, lampstand, showbread, incense, ark). Show how it maps salvation." },
    { room: "BF", instruction: "Use BIBLE FREESTYLE (verse genetics) — start with one verse and show how it's connected to 2-3 other verses across different books. Build a chain of meaning." },
    { room: "DR", instruction: "Use the DIMENSIONS ROOM — take one passage and show it from multiple angles: what it literally meant, how it points to Christ, how it applies to the listener today, and what it means for eternity." },
    { room: "P‖", instruction: "Use PARALLELS — show how a biblical event mirrors another across time (Babel/Pentecost, Exodus/return from Babylon, Joseph/Christ). Let the echoes speak." },
    { room: "FRm", instruction: "Use the FIRE ROOM — don't analyze, FEEL. Let the emotional weight of a passage (Gethsemane, the prodigal's return, the woman at the well) land in the listener's heart." },
    { room: "HF", instruction: "Use HISTORY FREESTYLE — connect a biblical truth to a moment in history, a cultural shift, or a modern event. Show the Bible is always relevant." },
  ];

  const palaceIndex = (dayNumber - 1) % palaceFocus.length;
  const palace = palaceFocus[palaceIndex];

  // Rotate through app features to recommend
  const appFeatures = [
    { feature: "Audio Bible", cta: "Listen to today's chapter in the Audio Bible — let God's Word wash over you while you commute." },
    { feature: "Sparks", cta: "Check out today's Spark Card — a bite-sized study idea you can explore in under 5 minutes." },
    { feature: "Palace Rooms", cta: "Visit the Palace and try one room exercise today — even 3 minutes sharpens your sword." },
    { feature: "Gems", cta: "Start collecting Gems — save the insights that strike you as you read. Your treasure chest is waiting." },
    { feature: "Bible Freestyle", cta: "Try a Bible Freestyle session — pick any verse and see where the Spirit takes you." },
    { feature: "Story Room", cta: "Open the Story Room and turn a chapter into a mental movie. You'll never forget it." },
    { feature: "Memory Drills", cta: "Run a quick Memory Drill — 2 minutes to lock a verse into your heart forever." },
    { feature: "Reading Plans", cta: "Start a Reading Plan today — even one chapter a day changes everything over time." },
    { feature: "Challenges", cta: "Take on today's Challenge — a fun, focused way to flex your Bible muscles." },
    { feature: "Daily Verse", cta: "Meditate on your Daily Verse — let one text simmer in your heart all day." },
    { feature: "Study Series", cta: "Begin a Study Series — a guided journey through a topic that will transform how you see Scripture." },
    { feature: "Sermon Builder", cta: "If you teach or share, try the Sermon Builder — let today's insight become someone else's blessing." },
  ];

  const featureIndex = (dayNumber - 1) % appFeatures.length;
  const feature = appFeatures[featureIndex];

  // Thematic variety
  const themes = [
    "the transformative power of even 3 minutes in God's Word",
    "how prayer is simply conversation — and God is always listening",
    "discovering Christ hidden in Old Testament narratives",
    "the sanctuary as God's GPS for your spiritual journey",
    "God's faithfulness when life feels too heavy",
    "the Psalms as honest prayers for real people",
    "the parables of Jesus — tiny stories hiding ocean-deep truths",
    "prophecy as proof that God holds tomorrow",
    "the Sabbath as God's weekly reset button for the soul",
    "the promises of Scripture as armor for your hardest days",
    "how nature preaches sermons if you have eyes to see",
    "walking by faith when the path disappears",
    "the joy of finding a gem you've never noticed before",
    "the Holy Spirit as your personal study partner",
    "living with urgency and peace as we await Christ's return",
    "the power of hiding God's Word in your memory",
    "lessons from flawed heroes who trusted God anyway",
    "the gospel woven into Israel's feasts and ceremonies",
    "how Bible study literally rewires your mind for hope",
    "the staggering depth of God's love revealed at Calvary",
  ];

  const themeIndex = (dayNumber - 1) % themes.length;
  const theme = themes[themeIndex];

  // Vary biblical focus
  const bookFamilies = [
    "Genesis or Exodus", "Psalms", "Proverbs or Ecclesiastes", "Isaiah or Jeremiah",
    "Daniel or Revelation", "Matthew or Mark", "Luke", "John",
    "Romans or Galatians", "Ephesians or Philippians", "Hebrews", "1 or 2 Peter",
  ];
  const bookIndex = (dayNumber - 1) % bookFamilies.length;
  const bookFocus = bookFamilies[bookIndex];

  // Nature object lessons for variety
  const objectLessons = [
    "a seed buried in dark soil", "the first light at dawn", "an eagle riding a storm updraft",
    "a river that never stops flowing", "a tree with roots deeper than its height",
    "a diamond formed under pressure", "the North Star that never moves",
    "a caterpillar dissolving to become a butterfly", "bread rising in the oven",
    "a lighthouse in fog", "the tide that always returns", "a vine and its branches",
    "rain falling on both gardens and deserts", "a key that fits only one lock",
    "a mirror reflecting what's really there", "fire that refines gold",
    "a shepherd's voice the sheep recognize", "an anchor holding against the current",
    "a compass needle always pointing north", "thunder following lightning without fail",
  ];
  const objectIndex = (dayNumber - 1) % objectLessons.length;
  const objectLesson = objectLessons[objectIndex];

  return `Write Day ${dayNumber} of 365 daily audio devotionals.

PALACE PRINCIPLE TO USE: ${palace.instruction}

THEME: ${theme}
SUGGESTED OBJECT LESSON (optional, use if it fits naturally): ${objectLesson}
SUGGESTED BIBLICAL SOURCE (but draw from anywhere): ${bookFocus}
RECOMMENDED APP FEATURE TO SUGGEST: ${feature.feature} — "${feature.cta}"

This is day ${dayNumber} of a year-long journey designed for busy people who think they don't have time for deep Bible study. Your job is to show them that even a few minutes changes everything — and to make them HUNGRY for more.

Use {{name}} as a placeholder for the listener's name (it will be replaced with their real name when delivered).

IMPORTANT REMINDERS:
- Start with a hook that grabs a busy person — not a generic "Good morning"
- Show, don't tell. Use the Palace principle to DEMONSTRATE how rich the Bible is
- The "nudge" should reframe time, not guilt-trip. Be creative and fresh each day.
- End with a specific, actionable CTA pointing to the ${feature.feature} feature
- Write for AUDIO — natural, conversational, rhythmic. No headers or lists.
- Use KJV for Scripture quotations`;
}
