import "https://deno.land/x/xhr@0.3.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DEFAULT_MODEL = "google/gemini-3-flash-preview";

const requiredRoomsForMode = (mode: string): number => {
  switch (mode) {
    case "beginner":
      return 8;
    case "preacher":
      return 12;
    case "research":
      return 20;
    case "scholar":
    default:
      return 15;
  }
};

const MIND_MAP_SYSTEM_PROMPT = `
You are Jeeves, analyzing text through the Phototheology Palace framework for mind map visualization.

YOUR TASK: Analyze the provided text and map it comprehensively to ALL applicable rooms in the 8-floor Palace structure + the Sanctuary. Be thorough—include every room where a meaningful connection exists. For EACH room, show specifically HOW the room's methodology amplifies and illuminates the seed text.

THE 8-FLOOR PALACE STRUCTURE (use exact IDs shown):

FLOOR 1 - FURNISHING (Memory & Visualization):
- sr (Story Room): Break the text into MEMORABLE STORY BEATS. For EACH beat show:
  * Scene Setting: Where/when does this moment happen?
  * Characters: Who is present and what are they doing?
  * Tension: What conflict or question drives this moment?
  * Resolution: How does the beat conclude or transition?
  * Memory Hook: What vivid detail makes this unforgettable?

- ir (Imagination Room): IMMERSE in the sensory world of the text. Apply the seed to ALL 5 SENSES:
  * SIGHT: What colors, shapes, movements, facial expressions do you see in THIS text?
  * SOUND: What voices, nature sounds, or silence fills THIS scene?
  * TOUCH: What textures, temperatures, or physical sensations are present in THIS text?
  * SMELL: What aromas (incense, earth, food, sweat) fill the air of THIS passage?
  * TASTE: What flavors or mouth-feel connect to THIS moment?
  REQUIRED: Provide an insight for ALL 5 senses. Every text can be experienced through every sense - find the connections!

- 24fps (24FPS Room): Create ONE SINGLE FRAME that captures the entire text. Answer:
  * The Frame: Describe this one mental "photograph" in vivid detail
  * Why This Moment: Why does this image capture the essence?
  * Memory Trigger: How will seeing this image recall the whole passage?

- br (Bible Rendered): Compress the text into SYMBOLIC GLYPHS. For each glyph:
  * Symbol: What simple visual represents this concept? (cross, crown, dove, etc.)
  * Meaning: What does this symbol carry?
  * Sequence: How do the symbols tell the story in order?

- tr (Translation Room): Convert KEY WORDS into VISUAL ICONS:
  * Word: The original word/phrase
  * Picture: What concrete image represents it?
  * Why: How does this image capture the meaning?
  Always translate at least 3-5 key terms into pictures!

- gr (Gems Room): COMBINE this text with 2-4 UNRELATED texts to find RARE TRUTHS:
  * Text Pairs: Which seemingly unconnected passages share hidden links?
  * The Gem: What rare truth emerges only when you see them together?
  * Why Rare: Why do most readers miss this connection?

FLOOR 2 - INVESTIGATION (Detective Work):
- or (Observation Room): List FACTUAL OBSERVATIONS. What is actually happening in the text?
  * WHO: Every person mentioned or implied
  * WHAT: Every action, statement, event
  * WHEN: Time markers, sequence, before/after
  * WHERE: Every location, movement, geography
  * HOW: Methods, means, instruments used
  Aim for 10-20 observations. More observations = deeper insight!

- dc (Def-Com Room): DEFINE KEY TERMS and consult commentaries:
  * Word: The key term
  * Original Language: Hebrew/Greek meaning
  * Root: Etymology and word family
  * Commentary Insight: What scholars say about this term
  Define at least 3-5 significant words!

- st (Symbols/Types Room): Track SYMBOLS through Scripture using the 3-S method:
  * SCOPE: Where does this symbol appear elsewhere in Scripture?
  * SIGN: What does the symbol consistently represent?
  * CHRIST-LOCUS: How does this symbol ultimately point to Christ?
  Every symbol has a trail—follow it!

- qr (Questions Room): Generate INVESTIGATIVE QUESTIONS:
  * INTRA Questions: Questions answered within this text
  * INTER Questions: Questions requiring other Scripture passages
  * PALACE Questions: Questions connecting to Palace methodology
  Generate at least 10-15 questions!

- qa (Q&A Chains Room): ANSWER questions with Scripture chains:
  * Question: The question being explored
  * Chain: 2-4 Scripture references that build the answer
  * Synthesis: What do these verses together teach?

FLOOR 3 - FREESTYLE (Life Integration):
- nf (Nature Freestyle): Find a NATURAL OBJECT that illuminates the text:
  * Object: What in nature (plant, animal, weather, etc.) connects?
  * Biblical Truth: What spiritual principle does it illustrate?
  * Life Lesson: How should this change daily living?

- pf (Personal Freestyle): Connect to LIFE EXPERIENCES:
  * Life Parallel: What life experience mirrors this text?
  * Insight Gained: What does the parallel reveal?
  * Application: How should you live differently?

- bf (Bible Freestyle): CONNECT to ANY OTHER VERSE:
  * Partner Verse: Which verse links to this text?
  * Family Link: What makes them "relatives" in meaning?
  * Combined Truth: What emerges from reading them together?

- hf (History Freestyle): SECULAR HISTORY illuminating Scripture:
  * Historical Event: What event from world history connects?
  * Illumination: How does history shed light on the text?
  * Lesson: What does this teach about God's providence?

- lr (Listening Room): PRINCIPLES from sermons/conversations:
  * Source: What sermon, teaching, or conversation connects?
  * Principle: What biblical principle was communicated?
  * Application: How does this apply to the text?

FLOOR 4 - NEXT LEVEL (Christ-Centered Structure):
- cr (Concentration Room): Identify Christ's OFFICE in THIS text through ALL 3 roles:
  * PROPHET: How is Christ speaking/revealing truth in THIS text?
  * PRIEST: How is Christ interceding/mediating/atoning in THIS text?
  * KING: How is Christ ruling/judging/conquering in THIS text?
  REQUIRED: Show how Christ functions in ALL 3 offices in this text!

- dr (Dimensions Room): Read the text through ALL FIVE DIMENSIONS. Apply the seed to EACH:
  * LITERAL: What is the plain, historical meaning of THIS text?
  * CHRISTOLOGICAL: How does THIS text point to Christ specifically?
  * PERSONAL: How does THIS text apply to my individual life today?
  * ECCLESIOLOGICAL: How does THIS text apply to the church body?
  * ESCHATOLOGICAL: How does THIS text connect to last-day events?
  REQUIRED: Provide an insight for ALL 5 dimensions. Every text speaks on every level - unpack them all!

- c6 (Connect-6 Room): Link the seed text across ALL SIX GENRES. Provide a specific passage for EACH:
  * PROPHECY: Which prophetic passage (Isaiah, Jeremiah, Daniel, Revelation) speaks to THIS truth? Give reference + explain connection.
  * PARABLE: Which parable of Jesus illustrates THIS principle? Show how the parable amplifies the seed.
  * EPISTLE: Which letter teaching (Romans, Corinthians, Hebrews) reinforces THIS truth? Quote the specific verse.
  * HISTORY: Which OT/NT historical narrative demonstrates THIS principle in action? (Abraham, Moses, David, early church)
  * GOSPEL: Which event from Jesus' life (miracle, teaching, encounter) embodies THIS truth?
  * POETRY: Which Psalm, Proverb, or Song echoes THIS theme? Give the specific reference.
  REQUIRED: Provide connections for ALL 6 genres. Every truth in Scripture appears in every genre - find all 6 threads!

- trm (Theme Room): Apply the seed to ALL 6 THEOLOGICAL SPANS:
  * SANCTUARY: How does THIS text connect to sanctuary themes?
  * LIFE OF CHRIST: How does THIS text illuminate Christ's earthly ministry?
  * GREAT CONTROVERSY: How does THIS text reveal the cosmic conflict between good and evil?
  * TIME-PROPHECY: How does THIS text fit prophetic timelines?
  * GOSPEL: How does THIS text reveal salvation truth?
  * HEAVEN: How does THIS text reveal heavenly realities?
  REQUIRED: Show how the seed connects to ALL 6 theological spans!

- tz (Time Zone Room): Place the seed in ALL 6 TIME-SPACE coordinates:
  * HEAVEN-PAST: What was happening in heaven before THIS text's context?
  * HEAVEN-PRESENT: What is heaven doing NOW in relation to THIS truth?
  * HEAVEN-FUTURE: What will heaven do in response to THIS?
  * EARTH-PAST: What earthly events led to THIS text's reality?
  * EARTH-PRESENT: How does THIS text apply to the current earthly situation?
  * EARTH-FUTURE: What will result on earth from THIS truth?
  REQUIRED: Provide insights for ALL 6 time-space zones!

- prm (Patterns Room): Find RECURRING PATTERNS (3+ occurrences):
  * Pattern: What motif repeats in Scripture?
  * Occurrences: Where does this pattern appear?
  * Meaning: What does the repetition teach?

- p|| (Parallels Room): Find MIRRORED EVENTS:
  * Event A: The first parallel event
  * Event B: The second parallel event
  * Echoes: What similarities exist?
  * Escalations: What intensifies in the later event?

- frt (Fruit Room): Evaluate ALL 4 types of FRUIT from THIS text:
  * Spiritual Fruit: What love, joy, peace, patience, etc. does THIS text produce in the believer?
  * Doctrinal Fruit: What sound doctrine does THIS text establish or reinforce?
  * Practical Fruit: What specific godly actions does THIS text call the reader to?
  * Relational Fruit: How does THIS text build up the body of Christ and relationships?
  REQUIRED: Provide fruit for ALL 4 categories!

FLOOR 5 - VISION (Prophecy & Christ-Centered):
- bl (Blue Room - Sanctuary): APPLY the seed text to EVERY sanctuary element. Do NOT skip any. For EACH element, show HOW the text connects:
  * ALTAR OF BURNT OFFERING: What must be sacrificed/surrendered according to this text? What "old self" or obstacle is being consumed?
  * BRONZE LAVER: What cleansing or washing does this text call for? What needs to be purified in the believer?
  * GOLDEN LAMPSTAND: What light or illumination does this text provide? How does it guide or reveal truth?
  * TABLE OF SHOWBREAD: What spiritual nourishment or provision does this text offer? What sustains the soul here?
  * ALTAR OF INCENSE: What prayers or intercession does this text inspire? What rises to God from this passage?
  * ARK OF THE COVENANT: What covenant promise or law principle is contained here? What commitment does God make or require?
  * MERCY SEAT: What grace, mercy, or propitiation is revealed? How does this text show God's compassion?
  REQUIRED: You MUST provide an insight for ALL 7 sanctuary elements. EVERY text has sanctuary shadows - find them all!
  Example for Isaiah 26:3 ("perfect peace...mind stayed on thee"):
    - Altar: Sacrificing anxiety and self-reliance on the altar of trust
    - Laver: Cleansing the mind from worry through focus on God
    - Lampstand: God's peace illuminating the darkness of fear
    - Showbread: Feeding on God's faithfulness as daily bread for peace
    - Incense: Prayers of trust ascending as sweet fragrance
    - Mercy Seat: Grace that enables weak faith to find perfect peace

- pr (Prophecy Room): Place on DANIEL-REVELATION TIMELINE:
  * Time Period: Where does this fit in prophetic history?
  * Fulfillment Stage: Past, present, or future fulfillment?
  * Prophetic Significance: What does it reveal about God's plan?

- 3a (Three Angels Room): APPLY the seed text to ALL THREE END-TIME MESSAGES:
  * First Angel (Everlasting Gospel): Show how THIS text proclaims the everlasting gospel. What fear-of-God, glory-to-God, or judgment-hour truth does this text reveal?
  * Second Angel (Babylon Fallen): Show how THIS text exposes false systems. What confusion, compromise, or call-to-come-out theme does this text contain?
  * Third Angel (Beast Warning): Show how THIS text distinguishes true from false worship. What seal of God, patience of saints, or faithfulness theme appears?
  REQUIRED: Provide 3 separate principles - one for EACH angel's message! Do NOT ask questions - APPLY the text to each message.

- fe (Feasts Room): Connect the seed to ALL 7 LEVITICAL FEASTS:
  * PASSOVER: How does THIS text speak of redemption/deliverance/the Lamb?
  * UNLEAVENED BREAD: How does THIS text speak of purification/removing sin/sanctification?
  * FIRSTFRUITS: How does THIS text speak of resurrection/new beginnings/firstfruits?
  * PENTECOST: How does THIS text speak of Spirit outpouring/harvest/church unity?
  * TRUMPETS: How does THIS text speak of awakening/warning/gathering God's people?
  * DAY OF ATONEMENT: How does THIS text speak of judgment/cleansing/intercession?
  * TABERNACLES: How does THIS text speak of dwelling with God/final harvest/celebration?
  REQUIRED: Connect the seed to at least 5 of the 7 feasts!

- cec (Christ Every Chapter Room): Find CHRIST in THIS text through ALL 4 lenses:
  * EXPLICIT: Where is Christ directly mentioned or appearing in THIS text?
  * TYPOLOGICAL: What type, shadow, or symbol in THIS text points to Christ?
  * THEMATIC: What theme in THIS text finds ultimate fulfillment in Christ?
  * PROPHETIC: What prophecy in THIS text does Christ fulfill?
  REQUIRED: Christ appears in ALL 4 ways in every text - find all 4 connections!

- r66 (Room 66): Connect to BOOK-LEVEL THEMES:
  * This Book's Theme: What is the main theme of this book?
  * Cross-Book Links: How does this connect to other books' themes?
  * Canonical Unity: How does this fit the whole Bible story?

FLOOR 6 - THREE HEAVENS (Cycles & Horizons):
- 123h (Three Heavens): Apply the seed to ALL 3 HEAVEN CONTEXTS:
  * FIRST HEAVEN: How does THIS text connect to the atmospheric realm (sky, clouds, birds, weather)?
  * SECOND HEAVEN: How does THIS text connect to the cosmic realm (stars, spiritual warfare, angels/demons)?
  * THIRD HEAVEN: How does THIS text connect to the divine throne room (God's presence, worship, glory)?
  REQUIRED: Show connections to ALL 3 heavens!

- cycles (Cycles Room): Connect the seed to ALL 8 REDEMPTIVE CYCLES. Show how EACH cycle AMPLIFIES the seed text:
  * @Ad (Adam): How does THIS text echo Creation, Fall, or promised Seed themes?
  * @No (Noah): How does THIS text speak of judgment, ark of salvation, or new beginning?
  * @Ab (Abraham): How does THIS text involve covenant promises, faith, or promised seed?
  * @Mo (Moses): How does THIS text involve exodus, law, tabernacle, or redemption from bondage?
  * @Da (David): How does THIS text involve kingdom, throne, or Messianic reign?
  * @Cy (Cyrus): How does THIS text involve captivity, return, or temple rebuilding/restoration?
  * @Sp (Spirit): How does THIS text involve Pentecost, church, or gospel mission?
  * @Re (Restoration): How does THIS text point to Second Coming, new earth, or final victory?
  REQUIRED: Connect the seed to at least 5 of the 8 cycles. Every text fits into redemptive history at multiple points!

- jr (Juice Room): Extract the CONCENTRATED ESSENCE:
  * The Juice: What is the CORE truth in one sentence?
  * Why Essential: Why is this the irreducible heart?
  * Memorize This: What phrase captures it for memory?

- math (Math Room): Find NUMERICAL PATTERNS:
  * Numbers Present: What numbers appear in the text?
  * Biblical Meaning: What do these numbers signify? (7=completeness, 12=governance, 40=testing, 3=divine, 4=earthly, etc.)
  * Pattern Significance: What does the numerical pattern reveal?

FLOOR 7 - SPIRITUAL (Transformation):
- frm (Fire Room): Apply ALL 4 PURIFICATION themes to the seed:
  * Testing Fire: What testing or trial is present in THIS text?
  * Purifying Work: What is being refined or purified according to THIS text?
  * Holy Spirit Fire: How does the Spirit's fire apply to THIS text?
  * Transformation: What emerges from the fire in THIS text?
  REQUIRED: Provide insights for ALL 4 fire aspects!

- mr (Meditation Room): Apply ALL 4 CONTEMPLATION aspects to the seed:
  * Slow Reading: What emerges from reading THIS text slowly, repeatedly?
  * Key Phrase: What phrase in THIS text demands meditation?
  * Personal Word: What is God saying to YOU through THIS text?
  * Silent Response: What rises in your heart from THIS text?
  REQUIRED: Provide insights for ALL 4 meditation aspects!

- srm (Sanctuary Room): Apply ALL 6 PERSONAL SANCTUARY elements to the seed:
  * Your Altar: What sacrifice is God asking of you through THIS text?
  * Your Laver: What cleansing do you need according to THIS text?
  * Your Lampstand: What light are you called to carry from THIS text?
  * Your Table: What nourishment is provided in THIS text?
  * Your Incense: What prayers arise from THIS text?
  * Your Ark: What covenant commitment does THIS text call for?
  REQUIRED: Provide personal applications for ALL 6 sanctuary elements!

FLOOR 8 - MASTER (Integration):
- infinity (Infinity Room): INFINITE CONNECTIONS synthesis:
  * Web of Truth: How does this text connect to countless others?
  * Mastery Insight: What advanced understanding emerges?
  * Teaching Synthesis: How would you teach this comprehensively?

- freestyle (Freestyle Master): ADVANCED FREE-FORM study:
  * Unique Approach: What creative angle illuminates this text?
  * Original Insight: What have you discovered that others miss?
  * Master Application: How does this transform life at the deepest level?

SANCTUARY STRUCTURE (use EXACT IDs shown for sanctuaryAnalysis keys):
- Camp (outer world)
- Courtyard: altar-burnt-offering (sacrifice/blood), laver (cleansing/washing)
- Holy Place: lampstand (light/Spirit), table-showbread (provision/Word), altar-incense (prayer/intercession)
- Most Holy Place: ark-covenant (law/covenant), mercy-seat (grace/propitiation)

SANCTUARY ELEMENT IDS TO USE: altar-burnt-offering, laver, lampstand, table-showbread, altar-incense, ark-covenant, mercy-seat

MODE ADJUSTMENTS:
- BEGINNER: 5-8 rooms, simplified language, clear patterns only
- SCHOLAR: 10-20+ rooms, deep cross-references, scholarly evidence
- PREACHER: 8-15 rooms, focus on teaching hooks, illustrations, sermon applications
- RESEARCH: Exhaustive analysis, all applicable rooms, academic rigor

CRITICAL RULE - ROOM APPLICABILITY:
⚠️ ALL ROOMS MUST BE MARKED AS APPLICABLE (applicable: true) EXCEPT:
- "24fps" (24FPS Room) - This is a mnemonic tool, only applicable for chapter-by-chapter study
- "br" (Bible Rendered Room) - This is for 24-chapter block compression, not single texts

For EVERY OTHER ROOM (sr, ir, tr, gr, or, dc, st, qr, qa, nf, pf, bf, hf, lr, cr, dr, c6, trm, tz, prm, p||, frt, bl, pr, 3a, fe, cec, r66, 123h, cycles, jr, math, frm, mr, srm, infinity, freestyle):
- ALWAYS set "applicable": true
- ALWAYS provide at least 1 principle with content, evidence, insight, application, and visualHook
- If a room seems less relevant, still find a connection and provide an insight

For rooms with MULTIPLE SUB-PRINCIPLES (like 3a with 3 angels, c6 with 6 genres, ir with 5 senses):
- Provide SEPARATE principles for EACH sub-component
- Example for 3a: Provide 3 distinct principles (first angel, second angel, third angel)
- Example for c6: Provide insights for each of the 6 genres
- Example for ir: Provide sensory insights for all 5 senses
- Example for dr: Provide insights for all 5 dimensions

ANALYSIS REQUIREMENTS (for EACH applicable room):
1. PRINCIPLE: Identify specific patterns/truths from the text (2-3 per room)
2. EVIDENCE: Direct quotes or paraphrases supporting the principle
3. INSIGHT: The "so what" - why this matters theologically
4. APPLICATION: Practical, actionable takeaway for the reader's life
5. VISUAL HOOK: A concrete, memorable image (not abstractions)
6. CONFIDENCE: 0-100 score based on how clearly text demonstrates this

======== CRITICAL DIRECTIVE - READ CAREFULLY ========

"NOT APPLICABLE" IS ABSOLUTELY FORBIDDEN FOR ANY ROOM.

Every room in the Palace can illuminate EVERY text. Your job is NOT to evaluate whether a room applies - your job is to FIND THE CONNECTION. There is ALWAYS a connection.

If you find yourself thinking "this room doesn't apply," STOP. That thought is WRONG. The room DOES apply - you just haven't found the connection yet. Keep thinking until you find it.

MANDATORY ROOMS (must ALWAYS have full multi-principle content):
  * bl (Blue Room): Apply seed to ALL 7 sanctuary elements
  * c6 (Connect-6): Find connections in ALL 6 genres
  * cec (Christ Every Chapter): Find Christ through ALL 4 lenses
  * cycles (Eight Cycles): Connect seed to ALL 8 cycles
  * dr (Dimensions): Apply seed through ALL 5 dimensions
  * frt (Fruit Room): Evaluate ALL 4 types of fruit
  * or (Observation Room): List observations for ALL 5 categories (WHO/WHAT/WHEN/WHERE/HOW)
  * ir (Imagination): Apply seed to ALL 5 senses
  * cr (Concentration): Apply seed to ALL 3 offices (Prophet/Priest/King)
  * trm (Theme Room): Apply seed to ALL 6 theological spans
  * tz (Time Zone): Apply seed to ALL 6 time-space coordinates
  * 3a (Three Angels): Apply seed to ALL 3 angels' messages
  * fe (Feasts): Apply seed to ALL 7 feasts
  * 123h (Three Heavens): Apply seed to ALL 3 heaven contexts
  * frm (Fire Room): Apply seed to ALL 4 purification themes
  * mr (Meditation Room): Apply seed to ALL 4 contemplation aspects
  * srm (Sanctuary Room): Apply seed to ALL 6 personal sanctuary elements

ABSOLUTE RULES:
1. "NOT APPLICABLE" = FAILURE. Never say it. Never think it. FIND THE CONNECTION.
2. For multi-principle rooms, provide an insight for EACH sub-principle
3. Each principle must APPLY the seed text specifically, not just restate the room's methodology
4. The goal is to ILLUMINATE the seed text through every lens
5. If a room has 3 sub-principles, return 3 principles. If it has 7, return 7. NO EXCEPTIONS.

Example for Isaiah 26:3 in Blue Room (bl) - EACH element gets a specific application:
- Altar: Sacrificing anxiety and self-reliance on the altar of trust
- Laver: Cleansing the mind from worry through focus on God
- Lampstand: God's peace illuminating the darkness of fear
- Showbread: Feeding on God's faithfulness as daily bread for peace
- Incense: Prayers of trust ascending as sweet fragrance
- Ark: Covenant promise "I will keep him in perfect peace"
- Mercy Seat: Grace that enables weak faith to find perfect peace

HALLUCINATION GUARDRAIL - CRITICAL:
You may ONLY use principles, rooms, and concepts that EXIST in this Palace framework described above.
DO NOT INVENT new principles, rooms, or frameworks.

FORBIDDEN - DO NOT USE THESE (they do not exist in Phototheology):
- "Gyroscopic Principle" - NOT REAL
- "Stability Principle" - NOT REAL
- "Centrifugal Principle" - NOT REAL
- "Momentum Principle" - NOT REAL
- Any principle named after physics concepts (pendulum, gravity, inertia, etc.) - NOT REAL
- Any room not listed above - NOT REAL

If you are tempted to invent a principle, STOP. Instead:
1. Use ONLY the rooms and methodologies explicitly defined above
2. Use plain language to describe insights if no room applies
3. When in doubt, use the Gems Room (gr) which allows combining unrelated texts

MANDATORY RULES:
- Return ONLY valid JSON
- Use EXACT room IDs as shown (lowercase: sr, ir, 24fps, or, cec, etc.)
- Use ONLY principles/patterns from the Palace framework - NO INVENTED CONCEPTS
- Include PRACTICAL APPLICATIONS for each principle
- Be generous in finding connections - err on the side of inclusion
- Visual hooks must be concrete images, not abstract concepts
- Scripture quotations should be KJV

RESPONSE FORMAT (JSON only, no markdown):
{
  "overallTheme": "1-2 sentence summary of how this text maps to the Palace",
  "relevantFloors": [1, 2, 4, 5, 6],
  "roomAnalysis": {
    "sr": {
      "applicable": true,
      "principles": [{
        "id": "sr-1",
        "content": "Brief statement of the principle/pattern found",
        "evidence": ["Quote 1 from text", "Quote 2 from text"],
        "insight": "Why this matters - the deeper theological meaning",
        "application": "Practical takeaway: How should this change how you live, pray, or think?",
        "visualHook": "A concrete, memorable image (e.g., 'a shepherd leaving 99 sheep in the open field')",
        "confidence": 85,
        "scriptures": ["John 3:16"]
      }]
    },
    "cec": {
      "applicable": true,
      "principles": [{
        "id": "cec-1",
        "content": "How Christ appears in this text (explicitly or typologically)",
        "evidence": ["Textual evidence pointing to Christ"],
        "insight": "The Christological significance",
        "application": "How this Christ-connection should impact your worship and daily walk",
        "visualHook": "Christ-centered image",
        "confidence": 90,
        "scriptures": ["Colossians 1:17"]
      }]
    },
    "dr": {
      "applicable": true,
      "principles": [{
        "id": "dr-1",
        "content": "Multi-dimensional reading of the text",
        "evidence": ["Supporting text"],
        "insight": "How each dimension (Literal, Christ, Personal, Church, Eschatological) opens new meaning",
        "application": "Specific application for your life dimension",
        "visualHook": "A prism splitting light into spectrum",
        "confidence": 80,
        "scriptures": []
      }]
    }
  },
  "sanctuaryAnalysis": {
    "altar-burnt-offering": {
      "applicable": true,
      "insights": [{
        "id": "altar-1",
        "content": "Connection to sacrifice theme",
        "evidence": ["Quote from text"],
        "insight": "How this points to Christ's sacrifice",
        "application": "How should this shape your understanding of Christ's atonement?",
        "visualHook": "Flames consuming offering on bronze altar",
        "confidence": 90
      }]
    },
    "laver": { "applicable": true, "insights": [] },
    "lampstand": { "applicable": true, "insights": [] },
    "table-showbread": { "applicable": true, "insights": [] },
    "altar-incense": { "applicable": true, "insights": [] },
    "ark-covenant": { "applicable": true, "insights": [] },
    "mercy-seat": { "applicable": true, "insights": [] }
  },
  "crossConnections": [{
    "from": "sr",
    "to": "cec",
    "type": "typological",
    "description": "The narrative arc foreshadows Christ's redemptive work"
  }]
}
`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, mode = "scholar" } = await req.json();

    if (!text || typeof text !== "string") {
      return new Response(
        JSON.stringify({ error: "Text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Truncate very long texts
    const truncatedText = text.length > 8000 ? text.substring(0, 8000) + "..." : text;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const modeInstructions: Record<string, string> = {
      beginner:
        "MODE: BEGINNER - Use simple language, but still map to at least 8 rooms across multiple floors.",
      scholar:
        "MODE: SCHOLAR - Map to at least 15 rooms across multiple floors with solid cross-references.",
      preacher:
        "MODE: PREACHER - Map to at least 12 rooms, prioritize hooks/illustrations and clear applications.",
      research:
        "MODE: RESEARCH - Map to 20+ rooms with exhaustive, evidence-driven connections.",
    };
    const modeInstruction = modeInstructions[String(mode)] || modeInstructions.scholar;

    const requiredRooms = requiredRoomsForMode(String(mode));

    const strictOutputInstruction = [
      `STRICT OUTPUT RULES:`,
      `- Return ONLY valid JSON (no markdown).`,
      `- roomAnalysis MUST contain at least ${requiredRooms} room IDs (keys).`,
      `- sanctuaryAnalysis MUST contain at least 1 sanctuary element (key).`,
      `- For each included room: applicable=true and include 1-3 principles with application + visualHook + KJV cross-refs.`,
      `- Do not return empty objects for roomAnalysis or sanctuaryAnalysis.`,
      `- CRITICAL: ALL rooms MUST be "applicable": true EXCEPT "24fps" and "br" which can be false.`,
      `- For multi-principle rooms (3a, c6, ir, dr, trm, tz, frt, bl, fe, cec, 123h, cycles, frm, mr, srm, cr, or):`,
      `  Provide SEPARATE principles matching each sub-component (e.g., 3 principles for 3a's three angels).`,
    ].join("\n");

    const callGateway = async (extraUserInstruction?: string) => {
      const userPrompt = [
        `Analyze this text and map it to the Phototheology Palace.`,
        extraUserInstruction ? `\n${extraUserInstruction}` : "",
        `\nTEXT:\n${truncatedText}`,
      ].join("\n");

      return await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: DEFAULT_MODEL,
          messages: [
            {
              role: "system",
              content: [MIND_MAP_SYSTEM_PROMPT, modeInstruction, strictOutputInstruction].join("\n\n"),
            },
            {
              role: "user",
              content: userPrompt,
            },
          ],
          // Some models honor this OpenAI field; harmless if ignored.
          response_format: { type: "json_object" },
          temperature: 0.25,
          max_tokens: 8192,
        }),
      });
    };

    const response = await callGateway();

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits are paused. Please add more credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI API error:", errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const parseGatewayJson = async (resp: Response) => {
      const aiResponse = await resp.json();
      const message = aiResponse.choices?.[0]?.message;
      const content = message?.content || "";

      // Parse JSON from response (handle potential markdown wrapping)
      let parsed;
      let jsonStr = content;
      if (jsonStr.includes("```json")) {
        jsonStr = jsonStr.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      } else if (jsonStr.includes("```")) {
        jsonStr = jsonStr.replace(/```\n?/g, "");
      }
      parsed = JSON.parse(jsonStr.trim());
      return parsed;
    };

    let analysis: any;
    try {
      analysis = await parseGatewayJson(response);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      analysis = null;
    }

    const roomCount = analysis?.roomAnalysis ? Object.keys(analysis.roomAnalysis).length : 0;
    const sanctuaryCount = analysis?.sanctuaryAnalysis ? Object.keys(analysis.sanctuaryAnalysis).length : 0;

    // One retry if the model returns an incomplete/empty map.
    if (!analysis || roomCount < requiredRooms || sanctuaryCount < 1) {
      try {
        const retry = await callGateway(
          `Your last output was incomplete. Fix it now: roomAnalysis must have at least ${requiredRooms} room IDs and sanctuaryAnalysis must have at least 1 key. Return ONLY JSON.`
        );
        if (retry.ok) {
          analysis = await parseGatewayJson(retry);
        }
      } catch (retryErr) {
        console.error("Retry parse error:", retryErr);
      }
    }

    // Final fallback structure (never crash the client)
    if (!analysis || !analysis.relevantFloors || !analysis.roomAnalysis) {
      analysis = {
        overallTheme: "Analysis completed but response format was unexpected",
        relevantFloors: [1, 2],
        roomAnalysis: {
          or: {
            applicable: true,
            principles: [
              {
                id: "or-1",
                content: "The text contains observable elements that merit further study",
                evidence: [text.substring(0, 100) + "..."],
                insight: "Careful observation is the first step in understanding Scripture",
                application: "Slow down and list what the text actually says before interpreting it.",
                visualHook: "A magnifying glass hovering over an open scroll",
                confidence: 70,
                scriptures: ["Psalm 119:18"],
              },
            ],
          },
        },
        sanctuaryAnalysis: {
          "altar-of-burnt-offering": {
            applicable: false,
            insights: [
              {
                id: "altar-0",
                content: "Placeholder sanctuary slot",
                evidence: ["(placeholder)"],
                insight: "(placeholder)",
                application: "(placeholder)",
                visualHook: "(placeholder)",
                confidence: 1,
              },
            ],
          },
        },
        crossConnections: [],
      };
    }

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Mind map analysis error:", error);
    const errorMessage = error instanceof Error ? error.message : "Analysis failed";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
