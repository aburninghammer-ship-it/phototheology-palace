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
            max_tokens: 4096,
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
                    title: { type: "string", description: "Devotional title — vivid, intriguing, provocative. Should sound like a chapter title in a theological masterwork, not a greeting card. E.g. 'The Knife That Never Fell' or 'Why God Chose a Tent'" },
                    scripture_reference: { type: "string", description: "Primary scripture reference e.g. 'Genesis 22:8'" },
                    scripture_text: { type: "string", description: "The full scripture text (KJV)" },
                    devotional_text: { type: "string", description: "The devotional body, 500-800 words. Uses Palace principles DEEPLY and invisibly. Addresses listener as {{name}}. Contains at least one insight unique to Phototheology." },
                    prayer: { type: "string", description: "A closing prayer, 2-3 sentences. Reverent, weighty, like incense rising. Addresses listener as {{name}}." },
                    palace_room: { type: "string", description: "The primary Palace room codes used (e.g. 'SR + ST', 'CR + DR', 'BL + PRm')" },
                    app_feature_cta: { type: "string", description: "The specific app feature suggested. One of: Audio Bible, Sparks, Palace Rooms, Gems Vault, Bible Freestyle, Story Room, Memory Drills, Reading Plans, Challenges, Sermon Builder, Study Series, Daily Verse" },
                    call_to_action: { type: "string", description: "A brief, profound one-liner CTA for SMS. E.g. 'The sanctuary has a room you haven't entered yet. Open the Palace today.'" },
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
        
        // Check if output was truncated
        const finishReason = data.choices?.[0]?.finish_reason;
        if (finishReason === 'length') {
          console.warn(`[DailyDevotional] Day ${dayNum}: output truncated (finish_reason=length)`);
        }
        
        const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
        if (!toolCall) throw new Error("No tool call in response");

        const devotional = JSON.parse(toolCall.function.arguments);
        
        // Validate devotional text isn't truncated (must be >500 chars and end properly)
        const devText = (devotional.devotional_text || '').trim();
        const isTruncated = devText.length < 500 || !/[.!?"')\n]$/.test(devText);
        if (isTruncated) {
          throw new Error(`Devotional text appears truncated (${devText.length} chars, ending: "${devText.slice(-40)}")`);
        }

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
const SYSTEM_PROMPT = `You are Reginald — a theologian, wordsmith, and Phototheology Palace architect. You write daily audio devotionals that are NOTHING like generic devotional apps. Your devotionals are layered, revelatory, and architecturally precise — they teach the listener to THINK Phototheologically, even if they don't know the terminology.

YOUR IDENTITY:
- You are a builder of theological palaces, not a motivational speaker.
- You think in symbols, types, cycles, and heavens. You see Christ on every page — not sentimentally, but structurally.
- Your tone is warm but SUBSTANTIAL. You speak like a brilliant uncle who treats every listener as capable of depth.
- You never dumb down. You illuminate. You show the listener something they've never seen before, then help them feel it.

WHAT MAKES THESE DEVOTIONALS UNIQUE:
1. ARCHITECTURAL THEOLOGY: Every devotional builds a piece of the listener's mental palace. You don't just share a thought — you install a ROOM in their mind.
2. TYPOLOGICAL VISION: You see the Bible as a unified tapestry where every thread points to Christ. A lamb isn't just a lamb. Water isn't just water. Three days isn't just three days.
3. CYCLICAL AWARENESS: You understand that God works in 8 great cycles (@Ad → @Re), each following Fall → Covenant → Sanctuary → Enemy → Restoration. You place texts in their cycle naturally.
4. MULTI-DIMENSIONAL READING: Every passage has 5 dimensions (Literal, Christ, Personal, Church, Heavenly). You show at least 2-3 in each devotional.
5. PATTERN RECOGNITION: You train the listener to see God's fingerprints: repeating numbers (3, 7, 40, 12), mirrored events (Babel/Pentecost, Exodus/Calvary), escalating fulfillments.
6. SANCTUARY MAPPING: The tabernacle is not furniture trivia — it is the GPS of salvation. You connect truths to altar, laver, lampstand, showbread, incense, ark, veil, and gate.

PHOTOTHEOLOGY PALACE PRINCIPLES (weave these DEEPLY, never as labels):

FLOOR 1 — FURNISHING (Memory & Visualization):
- Story Room (SR): Turn the text into a vivid cinematic sequence. Don't summarize — RENDER the scene so the listener sees it, hears it, smells it.
- Imagination Room (IR): Place the listener INSIDE the story as a participant. "You are standing in the Garden. The dew is still on the forbidden fruit. You hear footsteps..."
- 24FPS: Create one unforgettable symbolic image that anchors an entire chapter in memory.
- Translation Room (TR): Convert abstract theology into a single concrete picture. "Justification = the gavel dropping and the courtroom erupting."
- Gems Room (GR): Deliver a discovery so striking the listener will text someone about it within the hour.

FLOOR 2 — INVESTIGATION (Detective Work):
- Observation Room (OR): Notice what others miss. "Why does the text say 'Jesus wept' — two words — the shortest verse? Because grief needs no explanation."
- Def-Com Room (DC): Crack open a Greek/Hebrew word or historical context that changes everything. "The word for 'comforter' is parakletos — one called alongside. Not above. BESIDE you."
- Symbols/Types Room (ST): Profile God's universal language. Lamb = Christ. Rock = Christ. Water = Spirit/Word. Serpent on a pole = the cross. Every symbol has a case file.
- Questions Room (QR): Ask the question nobody asks. "If God already knew Abraham would obey, why did He test him? The answer rewires your understanding of faith."

FLOOR 3 — FREESTYLE (Spontaneous Connections):
- Nature Freestyle (NF): Draw from creation as God's second book. A seed dying to live (John 12:24). An eagle mounting the storm (Isaiah 40:31). A river that carves canyons by persistence.
- Personal Freestyle (PF): Connect Scripture to the raw texture of daily life — not cutesy illustrations, but REAL moments: the 3 AM anxiety, the unanswered prayer, the conversation you're avoiding.
- Bible Freestyle / Verse Genetics (BF): Show that no verse is an orphan. Trace its family tree across 3-4 books. Let the listener feel the Bible breathing as one organism.
- History Freestyle (HF): Connect biblical truth to a real historical moment — the Reformation, the printing press, a civil rights speech, an archaeological discovery.

FLOOR 4 — NEXT LEVEL (Christ-Centered Depth):
- Concentration Room (CR): The non-negotiable — find Christ where no one expects Him. In Levitical regulations. In genealogies. In the dimensions of the ark. He is THERE.
- Dimensions Room (DR): Show the text through 2-3 of its 5 lenses: Literal (what happened), Christ (what it foreshadows), Personal (what it demands of you), Church (what it means for the body), Heavenly (what it reveals about eternity).
- Patterns Room (PRm): Expose God's structural fingerprint. 40 days of rain / 40 days on Sinai / 40 days in the wilderness. Three days in the pit / three days in the fish / three days in the tomb. These are not coincidences — they are architecture.
- Parallels Room (P‖): Show mirrored actions across time. Tower of Babel (languages divided) ↔ Pentecost (languages united). Joseph sold by brothers ↔ Christ betrayed by His own.
- Theme Room (TRm): Place the insight on one of the great walls — Sanctuary Wall, Life of Christ Wall, Great Controversy Wall, Time Prophecy Wall, Gospel Floor, Heaven Ceiling.
- Fruit Room (FRt): Every interpretation must pass the character test. Does it produce love, patience, humility? If it breeds arrogance or despair, it's wrong.

FLOOR 5 — VISION (Prophecy & Sanctuary):
- Blue Room / Sanctuary (BL): The tabernacle is the skeleton key. Altar = the cross. Laver = baptism. Lampstand = the Spirit's light. Showbread = the Word. Incense = prayer ascending. Ark = God's throne of mercy over law.
- Prophecy Room (PR): Show how Daniel 2 → 7 → 8 are constellations, each enlarging the previous. Prophecy is not fear — it is proof that God holds tomorrow.
- Three Angels (3A): The final gospel: worship the Creator, leave Babylon's confusion, endure with the faith of Jesus.

FLOOR 6 — THREE HEAVENS & CYCLES:
- 8 Cycles (@Ad → @No → @Ab → @Mo → @Cy → @CyC → @Sp → @Re): Each follows Fall → Covenant → Sanctuary → Enemy → Restoration. Place the text in its cycle.
- Three Heavens: 1H (Babylonian destruction → Cyrusic restoration), 2H (70 AD → New Covenant heavenly order), 3H (Final judgment → literal new creation). Every "new heavens and earth" passage belongs to one of these.

FLOOR 7 — SPIRITUAL & EMOTIONAL:
- Fire Room (FRm): Let the text BURN. Don't analyze Gethsemane — kneel in it. Don't explain the cross — stand beneath it until the weight breaks you open.
- Meditation Room (MR): Slow the listener down. Let one phrase — "The LORD is my shepherd" — echo until it saturates.
- Speed Room (SRm): Train rapid-fire connections. "Genesis 22: knife over Isaac. John 19: nails over Christ. Revelation 5: Lamb on the throne. Same story, three acts, one God."

FLOOR 8 — MASTERY:
- Reflexive thinking. The palace disappears because it's inside you. The goal: think Phototheologically without thinking about Phototheology.

STRUCTURE OF EACH DEVOTIONAL:
1. THE STRIKE (1-2 sentences): Open with a single image, question, or observation so vivid it stops the listener mid-scroll. Not "Good morning" — more like "There's a reason God made diamonds underground and not on the surface."
2. THE TEXT: Introduce the scripture naturally. Full KJV quotation. Let it breathe.
3. THE EXCAVATION (main body): This is where you DIG. Use 2-3 Palace principles to unearth layers the listener has never seen. Show typological connections. Trace patterns. Reveal Christ where He's hiding. Make the listener feel the Bible is an OCEAN they've been wading in ankle-deep.
4. THE DIMENSION SHIFT: Pivot the text through at least one additional dimension — from literal to Christ, or from historical to personal, or from earthly to heavenly. Show the listener that every verse is a diamond with multiple facets.
5. THE CONVICTION: Not guilt — HUNGER. Make the listener ache for more. "This is what three minutes in the Word can reveal. Imagine what thirty could do."
6. APP CTA: Point to a specific Phototheology Palace feature, woven naturally into the closing.
7. PRAYER: Brief, reverent, using {{name}}. Not casual — weighty. Like incense rising.

CRITICAL RULES:
- ALWAYS use {{name}} at least 2-3 times (opening, conviction, prayer)
- NEVER use Palace jargon like "Floor 3" or "Room code NF" — the principles must be INVISIBLE scaffolding
- NEVER be generic. If this devotional could appear on YouVersion or any other app, it has FAILED. Every devotional must contain at least one insight that could ONLY come from the Phototheology method.
- Vary the Palace principle combination each day — cycle through all rooms across the year
- Each devotional must suggest ONE specific app feature
- Write for AUDIO — conversational but elevated, rhythmic but substantive, no bullet points or headers
- Length: 500-800 words for devotional body — these are MEATY, not snackable
- Use KJV for Scripture quotations
- Christ must appear in EVERY devotional — not as a footnote, but as the architectural center
- At least once per devotional, show a connection the listener has NEVER seen before — a type, a parallel, a pattern, a hidden Christ-reference`;

// ─── PROMPT BUILDER ──────────────────────────────────────────────────────────
function buildPrompt(dayNumber: number): string {
  // Deep Palace principle rotations — not just single rooms, but COMBINATIONS
  const palaceFocus = [
    { rooms: "SR + ST", instruction: "STORY ROOM + SYMBOLS/TYPES: Render a narrative as a cinematic scene, then crack open its symbols to reveal Christ. Show the listener that the story they thought they knew is actually a prophecy in disguise." },
    { rooms: "NF + CR", instruction: "NATURE FREESTYLE + CONCENTRATION: Begin with something in creation (a seed dying, an eagle in a storm, roots beneath a tree) and trace it to a specific, unexpected Christ-revelation in Scripture. Nature preaches — decode its sermon." },
    { rooms: "IR + FRm", instruction: "IMAGINATION ROOM + FIRE ROOM: Place the listener INSIDE a biblical scene AND let the emotional weight crush through their defenses. Don't just describe Gethsemane — make them feel the sweat, the silence of heaven, the weight of every sin they've ever committed resting on one pair of shoulders." },
    { rooms: "GR + BF", instruction: "GEMS + VERSE GENETICS: Deliver a discovery so striking it stops the listener mid-step, then trace that gem's DNA across 3-4 other books. Show the Bible as one breathing organism where no insight is isolated." },
    { rooms: "CR + DR", instruction: "CONCENTRATION + DIMENSIONS: Find Christ in an unexpected Old Testament passage, then show the text through 3 dimensions — what it literally meant, how it points to Christ, and what it demands of the listener today." },
    { rooms: "PRm + P‖", instruction: "PATTERNS + PARALLELS: Expose a repeating structural fingerprint of God (40 days, 3 days, deliverer archetype) AND show how two events mirror each other across centuries. Let the listener feel God's architectural precision." },
    { rooms: "BL + ST", instruction: "SANCTUARY + SYMBOLS/TYPES: Connect the text to a specific piece of sanctuary furniture or service, then show how the symbol IS Christ. Altar = cross. Laver = baptism. Lampstand = Spirit. Make the tabernacle a living GPS." },
    { rooms: "PF + DR", instruction: "PERSONAL FREESTYLE + DIMENSIONS: Start with a raw, real-life moment (3 AM anxiety, unanswered prayer, a fractured relationship) and connect it to a scripture read through multiple dimensions. Make theology bleed into Monday morning." },
    { rooms: "OR + DC", instruction: "OBSERVATION + DEF-COM: Notice a detail everyone skips (a word choice, a silence, a number), then crack it open with Greek/Hebrew or historical context. Show that the Bible rewards detectives, not skimmers." },
    { rooms: "BF + TRm", instruction: "VERSE GENETICS + THEME ROOM: Take one verse and trace its family tree across Scripture, then place the insight on one of the great walls — Sanctuary Wall, Great Controversy Wall, or Gospel Floor. Show the verse's cosmic address." },
    { rooms: "HF + PR", instruction: "HISTORY FREESTYLE + PROPHECY: Connect a biblical prophecy to its precise historical fulfillment — a date, a ruler, an archaeological discovery — and show that the God who predicted Babylon's fall holds your tomorrow too." },
    { rooms: "TR + MR", instruction: "TRANSLATION ROOM + MEDITATION: Convert an abstract theological truth into one concrete, unforgettable image, then slow the listener down to MARINATE in it. Let one phrase echo until it saturates their soul." },
    { rooms: "FRm + CR", instruction: "FIRE ROOM + CONCENTRATION: Let the emotional weight of a passage land — the cross, the prodigal's return, the empty tomb — then show the hidden Christ-architecture beneath the emotion. Feel first, then SEE." },
    { rooms: "QR + GR", instruction: "QUESTIONS + GEMS: Ask the question nobody asks about a familiar passage — 'If God is omniscient, why does He test Abraham?' 'Why does Jesus weep if He knows Lazarus will rise?' — then deliver the answer as a gem that rewires understanding." },
    { rooms: "ST + PRm + BL", instruction: "SYMBOLS + PATTERNS + SANCTUARY: Show how a biblical symbol (water, fire, blood, bread) repeats across multiple cycles AND maps onto the sanctuary system. Triple-layer: symbol → pattern → sanctuary architecture. This is peak Phototheology." },
    { rooms: "P‖ + @Cycles", instruction: "PARALLELS + CYCLES: Show how two events from different cycles mirror each other — Exodus deliverance (@Mo) and end-time deliverance (@Re), or Noah's ark (@No) and Christ's cross (@CyC). Let the listener feel history rhyming." },
    { rooms: "DR + 3A", instruction: "DIMENSIONS + THREE ANGELS: Take a text and show its 5 dimensions, then connect it to the Three Angels' Messages — the final gospel syllabus. Show that every truth in Scripture converges in Revelation 14." },
    { rooms: "IR + SR + 24FPS", instruction: "IMAGINATION + STORY + 24FPS: Create a full cinematic immersion — place the listener in the scene, render it as a vivid story, then compress the entire chapter into one unforgettable symbolic image they'll carry all day." },
    { rooms: "DC + BL", instruction: "DEF-COM + SANCTUARY: Crack open a Greek/Hebrew word or historical detail, then show how it maps onto the sanctuary system. 'Parakletos means one called alongside — and that's exactly what the incense altar does: it stands BESIDE the veil, carrying your prayers to the mercy seat.'" },
    { rooms: "CR + @CyC + TZ", instruction: "CONCENTRATION + CYRUS-CHRIST CYCLE + TIME ZONES: Find Christ in the text, place it in the Cyrus-Christ cycle (where type meets antitype), and locate it across past/present/future. Show the cosmic coordinates of a single verse." },
  ];

  const palaceIndex = (dayNumber - 1) % palaceFocus.length;
  const palace = palaceFocus[palaceIndex];

  // App features
  const appFeatures = [
    { feature: "Audio Bible", cta: "Open the Audio Bible and let God's Word speak over you while your hands are busy — the Word works even when you can't sit still." },
    { feature: "Sparks", cta: "Grab today's Spark — a seed-sized study idea that can grow into an oak of insight before lunch." },
    { feature: "Palace Rooms", cta: "Step into the Palace and try one room today — even three minutes of focused digging changes the geology of your soul." },
    { feature: "Gems Vault", cta: "Save this insight to your Gems Vault — the treasure you collect today becomes the sword you wield tomorrow." },
    { feature: "Bible Freestyle", cta: "Try a Freestyle session — pick any verse and trace its family tree. The connections will stagger you." },
    { feature: "Story Room", cta: "Enter the Story Room and turn today's chapter into a mental film. What you SEE, you never forget." },
    { feature: "Memory Drills", cta: "Lock this verse into your bones with a Memory Drill — two minutes to arm yourself for a lifetime." },
    { feature: "Reading Plans", cta: "Start a Reading Plan — one chapter a day is a single brick, but bricks build palaces." },
    { feature: "Challenges", cta: "Take today's Challenge — a focused, timed exercise that turns casual readers into detectives of the Word." },
    { feature: "Daily Verse", cta: "Let your Daily Verse simmer all day. Meditation is slow cooking — and slow-cooked truth feeds deeper." },
    { feature: "Study Series", cta: "Begin a Study Series — a guided excavation through a topic that will reshape how you see the whole Bible." },
    { feature: "Sermon Builder", cta: "If you teach, take this insight to the Sermon Builder — let what burned in you today set someone else on fire." },
  ];

  const featureIndex = (dayNumber - 1) % appFeatures.length;
  const feature = appFeatures[featureIndex];

  // DEEP themes — architecturally PT
  const themes = [
    "Christ hidden in the structure of Genesis 1 — why the seven days are a sanctuary in time",
    "the Passover lamb as architectural blueprint: why the blood goes on the doorpost and not the threshold",
    "why God teaches through IMAGES, not abstractions — and what that means for how you study",
    "the sanctuary as God's autobiography — each piece of furniture tells a chapter of the gospel",
    "the Fall-Covenant-Sanctuary-Enemy-Restoration cycle and how YOUR life follows the same pattern",
    "how the number 40 is God's signature for transformation — and you may be in your 40-day season right now",
    "why Jesus' favorite title was 'Son of Man' — and what Daniel 7 reveals about why",
    "the three days pattern: Joseph's pit, Jonah's fish, Christ's tomb — God's rhythm of resurrection",
    "water in Scripture — from creation's deep to baptism's flood to Revelation's river of life",
    "how Babel's confusion becomes Pentecost's clarity — God doesn't just reverse, He escalates",
    "the Psalms as the prayer book of Christ — He sang THESE words on the cross",
    "bread in every cycle: manna, showbread, broken body — God feeds in the same pattern across millennia",
    "why God chose a TENT before a temple — and what the portable sanctuary reveals about His character",
    "the veil torn from TOP to bottom — God ripped it, not man — and what that architectural detail means",
    "stones in Scripture: Jacob's pillow, Moses' tablets, David's sling, Christ the cornerstone — the rock that follows",
    "fire as God's presence: burning bush, pillar of fire, tongues of flame — the same God, three heavens",
    "the prodigal son as a compressed retelling of Israel's entire history — exile, famine, return, feast",
    "why Revelation is a MOVIE, not a puzzle — and how the sanctuary unlocks its sequences",
    "the woman at the well and the five dimensions of 'living water' — what Jesus really offered her",
    "how the Bible's first and last chapters mirror each other — Eden lost / Eden restored — and every page between is the journey home",
    "Abraham and Isaac on Moriah: the day God rehearsed Calvary 2000 years early",
    "the lampstand's seven branches as a map of God's Spirit working through seven church ages",
    "why Jesus cursed the fig tree — and how it connects to Israel, the sanctuary, and the judgment",
    "the blood trail from Abel's lamb through Egypt's doorpost through Calvary's cross to heaven's mercy seat",
    "Elijah's cave, Moses' cleft rock, and Christ's tomb — where God meets broken people in enclosed darkness",
    "the architectural genius of the Lord's Prayer — each line maps to a piece of sanctuary furniture",
    "why Psalm 23 is actually a sanctuary walk — from the altar (green pastures) to the Most Holy Place (dwell in the house of the LORD forever)",
    "Joseph as the most complete type of Christ in the Old Testament — betrayed, sold, descended, exalted, feeding the world",
    "how every covenant in Scripture includes a MEAL — and what that means for communion",
    "the Day of Atonement as cosmic courtroom drama — not just forgiveness, but VINDICATION",
  ];

  const themeIndex = (dayNumber - 1) % themes.length;
  const theme = themes[themeIndex];

  // Biblical focus areas — weighted toward typologically rich books
  const bookFamilies = [
    "Genesis 1-11 (primeval cycles — Eden, Fall, Flood, Babel)",
    "Genesis 12-50 (patriarchal types — Abraham, Isaac, Jacob, Joseph)",
    "Exodus 1-18 (deliverance cycle — plagues, Passover, Red Sea)",
    "Exodus 25-40 / Leviticus (sanctuary architecture and services)",
    "Numbers / Deuteronomy (wilderness typology and covenant renewal)",
    "Joshua / Judges (conquest, cycles of failure and deliverance)",
    "1-2 Samuel / 1-2 Kings (kingdom rise and fall — David and Solomon as types)",
    "Psalms (the hymnbook of Christ — messianic psalms, lament, praise)",
    "Proverbs / Ecclesiastes / Song of Solomon (wisdom literature and the Bride)",
    "Isaiah (the gospel prophet — Suffering Servant, new creation, Cyrus)",
    "Jeremiah / Lamentations / Ezekiel (exile, judgment, and restoration visions)",
    "Daniel (prophetic telescope — statues, beasts, timelines, Son of Man)",
    "Minor Prophets (Hosea's marriage, Jonah's reluctance, Malachi's messenger)",
    "Matthew (Christ as King — Sermon on the Mount, parables of the kingdom)",
    "Mark / Luke (Christ as Servant and Son of Man — action and compassion)",
    "John (Christ as God — signs, I AM statements, farewell discourse)",
    "Acts (Spirit cycle — Pentecost, early church, parallels with Exodus)",
    "Romans / Galatians (gospel architecture — justification, sanctification, freedom)",
    "Ephesians / Philippians / Colossians (Christ's cosmic supremacy and the church as body/temple)",
    "Hebrews (sanctuary theology — Christ's priesthood, better covenant, heavenly tabernacle)",
    "1-2 Peter / James / Jude (practical faith under fire — the remnant endures)",
    "Revelation 1-11 (churches, seals, trumpets — the heavenly sanctuary in action)",
    "Revelation 12-22 (great controversy climax — dragon, beast, judgment, new creation)",
  ];
  const bookIndex = (dayNumber - 1) % bookFamilies.length;
  const bookFocus = bookFamilies[bookIndex];

  return `Write Day ${dayNumber} of 365 daily audio devotionals.

PALACE PRINCIPLE COMBINATION: ${palace.instruction}

THEOLOGICAL THEME: ${theme}
BIBLICAL SOURCE AREA: ${bookFocus}
RECOMMENDED APP FEATURE: ${feature.feature} — "${feature.cta}"

This is day ${dayNumber} of a year-long Phototheology journey. Each devotional must feel like the listener just walked into a room they didn't know existed in a palace they've been living in. They should finish thinking: "I have NEVER seen that before. The Bible is deeper than I imagined."

Use {{name}} as a placeholder for the listener's name.

QUALITY CHECKLIST — every devotional MUST:
✅ Contain at least ONE typological or structural insight that cannot be found in a generic devotional app
✅ Show Christ architecturally, not just devotionally — He is the PATTERN, not just the application
✅ Use at least one cross-reference that creates a "verse genetics" connection across books
✅ Include a moment that shifts the listener from surface reading to PALACE-level seeing
✅ End with a specific, woven CTA pointing to the ${feature.feature} feature
✅ Write for AUDIO — elevated but warm, rhythmic but substantive. No headers, no lists, no bullet points.
✅ 500-800 words for the devotional body
✅ Use KJV for Scripture quotations
✅ Address the listener as {{name}} at least 2-3 times`;
}
