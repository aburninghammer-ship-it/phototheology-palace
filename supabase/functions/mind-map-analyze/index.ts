import "https://deno.land/x/xhr@0.3.0/mod.ts";
import { getContentBehavioralEngine } from "../_shared/content-behavioral-engine.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { THEOLOGICAL_GUARDRAILS } from "../_shared/palace-prompt.ts";
import { QUALITY_TESTS, GOLDEN_RULE } from "../_shared/palace-output-engine.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DEFAULT_MODEL = "google/gemini-3-flash-preview";

const requiredRoomsForMode = (mode: string): number => {
  switch (mode) {
    case "beginner":
      return 12;
    case "preacher":
      return 18;
    case "research":
      return 30;
    case "scholar":
    default:
      return 25;
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
- 123h (Three Heavens): Apply the seed to ALL 3 HEAVEN CONTEXTS. For EACH heaven, provide a SPECIFIC APPLICATION:
  * FIRST HEAVEN (1H - DoL¹/NE¹): The Babylonian destruction and post-exilic restoration (586 BC to Cyrus). How does THIS text speak to themes of exile, judgment, temple rebuilding, or covenant renewal? APPLICATION: How should you respond to seasons of loss and restoration?
  * SECOND HEAVEN (2H - DoL²/NE²): The 70 AD destruction and New Covenant order. How does THIS text apply to the church age, Christ's heavenly ministry, or the transfer from earthly to heavenly temple? APPLICATION: How does this truth shape your participation in Christ's heavenly priesthood today?
  * THIRD HEAVEN (3H - DoL³/NE³): The final Day of the Lord and literal New Creation (Rev 21-22). How does THIS text point to final judgment, second coming, or eternal dwelling with God? APPLICATION: How should anticipation of NE³ change your priorities and hope today?
  REQUIRED: Provide 3 SEPARATE principles—one for EACH heaven context. Each MUST include a practical APPLICATION, not just a question!

- cycles (Cycles Room): Connect the seed to ALL 8 REDEMPTIVE CYCLES. You MUST generate EXACTLY 8 separate principles - one for EACH cycle:
  * @Ad (Adamic): How does THIS text echo Creation, Fall, or promised Seed themes? (REQUIRED)
  * @No (Noahic): How does THIS text speak of judgment, ark of salvation, or new beginning? (REQUIRED)
  * @Ab (Abrahamic): How does THIS text involve covenant promises, faith, or promised seed? (REQUIRED)
  * @Mo (Mosaic): How does THIS text involve exodus, law, tabernacle, or redemption from bondage? (REQUIRED)
  * @Cy (Cyrusic): How does THIS text involve captivity, return, or temple rebuilding/restoration? (REQUIRED)
  * @CyC (Cyrus-Christ): How does THIS text connect typology between Cyrus as deliverer and Christ as ultimate Deliverer? (REQUIRED)
  * @Sp (Spirit): How does THIS text involve Pentecost, church, or gospel mission? (REQUIRED)
  * @Re (Remnant): How does THIS text point to Second Coming, new earth, or final victory? (REQUIRED)
  ⚠️ MANDATORY: You MUST generate EXACTLY 8 principles for the cycles room - one for EACH cycle (@Ad, @No, @Ab, @Mo, @Cy, @CyC, @Sp, @Re). Do NOT skip any cycle. Every text speaks to ALL 8 cycles of redemptive history!

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

CRITICAL RULE - POPULATE ALL ROOMS:
⚠️ You MUST generate principles for EVERY ROOM listed above. Every text in the Bible connects to every room — that is the entire point of the Phototheology Palace. Your job is to FIND the connection, not to skip it.

ROOM APPLICABILITY:
- "24fps" (24FPS Room) - Only applicable for chapter-by-chapter study
- "br" (Bible Rendered Room) - Only for 24-chapter block compression
- ALL OTHER ROOMS: Set "applicable": true and provide at least 1 principle with substantial content.

ALWAYS-APPLICABLE ROOMS (NEVER skip these — they apply to EVERY text):
- sr, ir, or, st, dc, qr, qa (Floors 1-2: Every text has a story, images, observations, symbols, definitions, questions)
- bf, nf, pf, hf (Floor 3: Every text connects to other verses, nature, life, history)
- cr, dr, c6, trm, tz, prm, frt, cec (Floor 4: Every text reveals Christ, has dimensions, themes, time zones, patterns, fruit)
- bl, pr, 3a, fe (Floor 5: Every text has sanctuary shadows, prophetic placement, angel message connections, feast connections)
- 123h, cycles, jr (Floor 6: Every text sits in a heaven horizon and redemptive cycle)
- frm, mr, srm (Floor 7: Every text has emotional fire, meditation depth, and speed connections)
- infinity, freestyle (Floor 8: Every text has mastery-level synthesis)

⚠️ QUALITY STANDARDS FOR EVERY CONNECTION:
1. TEXTUAL ANCHOR: Point to specific words/themes IN THE SEED TEXT that ground the connection.
2. SPECIFICITY: The insight must be SPECIFIC to THIS text, not generic.
3. ILLUMINATION: The room's methodology must reveal NEW INSIGHT about the seed text.
4. CONFIDENCE SCORES: Rate honestly (50-100). Lower confidence is fine — but STILL GENERATE the principle.

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

${THEOLOGICAL_GUARDRAILS}

QUALITY TESTS (apply to every output):
${QUALITY_TESTS.map(t => `• ${t.name} (${t.room}): ${t.question}`).join('\n')}

${GOLDEN_RULE}

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
    "laver": { "applicable": true, "insights": [{ "id": "laver-1", "content": "How the text speaks to cleansing and purification", "evidence": ["Relevant quote"], "insight": "The deeper washing this passage points to", "application": "Bring your unclean areas to God's Word daily for washing", "visualHook": "Hands plunging into a bronze basin of clear water", "confidence": 85 }] },
    "lampstand": { "applicable": true, "insights": [{ "id": "lamp-1", "content": "How the text illuminates truth", "evidence": ["Relevant quote"], "insight": "What this passage reveals about walking in light", "application": "Let this truth become a lamp for your daily decisions", "visualHook": "Seven-branched golden lampstand casting warm light on priestly garments", "confidence": 85 }] },
    "table-showbread": { "applicable": true, "insights": [{ "id": "bread-1", "content": "What spiritual nourishment this text provides", "evidence": ["Relevant quote"], "insight": "How this passage feeds the soul", "application": "Return to this passage as daily bread for your spirit", "visualHook": "Twelve loaves of warm bread arranged on a golden table", "confidence": 85 }] },
    "altar-incense": { "applicable": true, "insights": [{ "id": "incense-1", "content": "What prayers this text inspires", "evidence": ["Relevant quote"], "insight": "The intercession this passage calls for", "application": "Let this truth shape your prayer life this week", "visualHook": "Fragrant smoke spiraling upward from a golden altar", "confidence": 85 }] },
    "ark-covenant": { "applicable": true, "insights": [{ "id": "ark-1", "content": "What covenant promise this text reveals", "evidence": ["Relevant quote"], "insight": "The law and covenant principle at the heart of this passage", "application": "Commit to the covenant standard this text calls you to", "visualHook": "Stone tablets resting inside the golden ark beneath cherubim wings", "confidence": 85 }] },
    "mercy-seat": { "applicable": true, "insights": [{ "id": "mercy-1", "content": "What grace and propitiation this text reveals", "evidence": ["Relevant quote"], "insight": "How this passage reveals God's mercy meeting His justice", "application": "Rest in the mercy this text proclaims over your failures", "visualHook": "Blood sprinkled on the golden mercy seat between two cherubim", "confidence": 85 }] }
  },
  "crossConnections": [{
    "from": "sr",
    "to": "cec",
    "type": "typological",
    "description": "The narrative arc foreshadows Christ's redemptive work"
  }]
}
`;

// ─── EXPOUND action handler (merged from mind-map-expound) ───
async function handleExpound(body: any) {
  const { principleContent, insight, seedText, roomTag } = body;
  if (!principleContent || !seedText) throw new Error("Principle content and seed text are required");

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

  const expoundSystemPrompt = `You are a master Phototheology scholar with deep expertise in biblical exegesis and the Palace system. Your task is to EXPOUND on a principle, revealing its DEEP, NON-OBVIOUS connections to the seed text.

CRITICAL RULES:
1. Go BEYOND surface-level connections. Find the hidden theological threads.
2. Every insight must trace back to the specific seed text provided.
3. Use the Palace methodology: types, patterns, dimensions, cross-references.
4. Make connections that would surprise and delight a serious Bible student.
5. Always cite Scripture (KJV preferred) to support your claims.
6. Think typologically - how does this pattern repeat across Scripture?
7. Consider sanctuary implications if applicable.

Respond ONLY with valid JSON in this exact format:
{
  "deepConnection": "A 2-3 sentence profound insight revealing the NON-OBVIOUS connection between this principle and the seed text.",
  "seedRelevance": "Explain specifically HOW this principle illuminates the seed text in a new way.",
  "hiddenPattern": "Identify a recurring biblical pattern this principle reveals.",
  "practicalDepth": "A transformative application that goes beyond 'pray more' or 'trust God'.",
  "scripturalChain": ["Verse 1", "Verse 2", "Verse 3"],
  "palaceRooms": ["Room code and why it connects"]
}`;

  const userPrompt = `SEED TEXT:\n"""\n${seedText.substring(0, 1500)}\n"""\n\nPRINCIPLE TO EXPOUND:\n"""\n${principleContent}\n"""\n\nCURRENT INSIGHT:\n"""\n${insight}\n"""\n\n${roomTag ? `PALACE ROOM: ${roomTag}` : ''}\n\nNow EXPOUND this principle. Go deep.`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "google/gemini-3-flash-preview", messages: [{ role: "system", content: expoundSystemPrompt + "\n\n" + getContentBehavioralEngine() }, { role: "user", content: userPrompt }], max_tokens: 1500, temperature: 0.7 }),
  });

  if (!response.ok) {
    if (response.status === 429) return { error: "Rate limits exceeded, please try again later.", _status: 429 };
    if (response.status === 402) return { error: "Payment required, please add funds.", _status: 402 };
    throw new Error(`AI gateway error: ${response.status}`);
  }

  const data = await response.json();
  const aiResponse = data.choices?.[0]?.message?.content || "";
  let parsed;
  try {
    const cleaned = aiResponse.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
    else throw new Error("No JSON found");
  } catch {
    parsed = {
      deepConnection: "This principle reveals a deeper layer of meaning when viewed through the lens of the seed text.",
      seedRelevance: "The connection illuminates patterns that resonate throughout Scripture.",
      hiddenPattern: "This pattern appears across multiple biblical narratives.",
      practicalDepth: "Apply this understanding by meditating on how this pattern plays out in your own spiritual journey.",
      scripturalChain: ["John 3:16", "Romans 5:8", "Ephesians 2:8-9"],
      palaceRooms: ["CR - Christ at center of all interpretation"],
    };
  }
  return parsed;
}

// ─── STUDY action handler (merged from mind-map-study) ───
async function handleStudy(body: any) {
  const { text, mode = "scholar" } = body;
  if (!text || typeof text !== "string") throw new Error("Text is required");

  const truncatedText = text.length > 10000 ? text.substring(0, 10000) + "..." : text;
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

  // Import shared prompts inline
  const { PALACE_SYSTEM_PROMPT, THEOLOGICAL_GUARDRAILS: TG2 } = await import("../_shared/palace-prompt.ts");
  const { QUALITY_TESTS: QT2, OUTPUT_TYPES, GOLDEN_RULE: GR2 } = await import("../_shared/palace-output-engine.ts");
  const { getCorpusContext } = await import('../_shared/corpus-rag.ts');

  const STUDY_SYSTEM_PROMPT = `${PALACE_SYSTEM_PROMPT}\n\n${TG2}\n\nSTUDY GENERATION MODE:\nGenerate a comprehensive devotional study based on the provided seed text using the full Phototheology Palace framework above.\n\nSTUDY REQUIREMENTS:\n1. TITLE: Create an engaging, descriptive title.\n2. INTRODUCTION: 2-3 compelling sentences.\n3. SECTIONS (3-5):\n   - Clear title, rich content (2-4 paragraphs), palace connections, supporting scriptures (KJV)\n4. APPLICATION POINTS (3-5): Practical, actionable takeaways.\n5. CLOSING PRAYER.\n6. RELATED PASSAGES: 3-5 cross-references.\n\nMODE: ${mode.toUpperCase()}\n\nOUTPUT TYPE: ${OUTPUT_TYPES.devotional.name}\n${OUTPUT_TYPES.devotional.description}\n${OUTPUT_TYPES.devotional.requirements.map((r: string) => `• ${r}`).join('\n')}\n\nQUALITY TESTS:\n${QT2.map((t: any) => `• ${t.name} (${t.room}): ${t.question}`).join('\n')}\n\n${GR2}\n\nReturn ONLY valid JSON.`;

  const modeInstructions: Record<string, string> = {
    beginner: "MODE: BEGINNER - Simple language, fewer sections.",
    scholar: "MODE: SCHOLAR - Deep analysis, comprehensive cross-references.",
    preacher: "MODE: PREACHER - Teaching hooks, illustrations, sermon-ready content.",
    research: "MODE: RESEARCH - Exhaustive academic analysis.",
  };

  const ragResult = await getCorpusContext({ query: truncatedText.slice(0, 4000), matchCount: 2 });
  const ragSection = ragResult.chunkCount > 0 ? ragResult.corpusContext : '';

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: STUDY_SYSTEM_PROMPT + "\n\n" + getContentBehavioralEngine() + "\n\n" + (modeInstructions[mode] || modeInstructions.scholar) + ragSection },
        { role: "user", content: `Generate a comprehensive Phototheology study based on this seed text:\n\n${truncatedText}` },
      ],
      temperature: 0.7,
      max_tokens: 8192,
    }),
  });

  if (!response.ok) throw new Error(`AI API error: ${response.status}`);
  const aiResponse = await response.json();
  const content = aiResponse.choices?.[0]?.message?.content || "";

  let study;
  try {
    let jsonStr = content;
    if (jsonStr.includes("```json")) jsonStr = jsonStr.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    else if (jsonStr.includes("```")) jsonStr = jsonStr.replace(/```\n?/g, "");
    study = JSON.parse(jsonStr.trim());
  } catch {
    study = {
      title: "Study of the Provided Text",
      introduction: "This study explores the rich truths contained in your seed text through the Phototheology Palace framework.",
      sections: [{ title: "Initial Observations", content: "The text presents foundational truths.", palaceConnections: ["Floor 2: Investigation"], scriptures: ["Psalm 119:18"] }],
      applicationPoints: ["Meditate on the key truths discovered"],
      closingPrayer: "Heavenly Father, thank You for Your Word. In Jesus' name, Amen.",
      relatedPassages: ["John 5:39", "2 Timothy 3:16-17"],
    };
  }
  return study;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const action = body.action || "analyze";

    // Route to sub-handlers
    if (action === "expound") {
      const result = await handleExpound(body);
      const status = result?._status || 200;
      if (result?._status) delete result._status;
      return new Response(JSON.stringify(result), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "study") {
      const result = await handleStudy(body);
      return new Response(JSON.stringify(result), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Default: analyze action
    const { text, mode = "scholar", fullStudy = false } = body;

    if (!text || typeof text !== "string") {
      return new Response(
        JSON.stringify({ error: "Text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Truncate very long texts — allow more for full study (sermons, articles)
    const maxChars = fullStudy ? 20000 : 8000;
    const truncatedText = text.length > maxChars ? text.substring(0, maxChars) + "..." : text;

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

    const fullStudyInstruction = fullStudy
      ? [
          `⚠️ FULL STUDY MODE ACTIVE — Populate every room WHERE A GENUINE CONNECTION EXISTS with substantial study content. Skip rooms where the connection would be forced.`,
          `This is NOT a room description exercise. For EACH room, you must APPLY the seed text through that room's methodology.`,
          ``,
          `CONTENT DEPTH REQUIREMENTS (NON-NEGOTIABLE):`,
          `- "content" field: At least 2-3 full sentences that APPLY the seed text through the room's methodology. Not a label — a developed thought.`,
          `- "evidence" array: At least 2 direct quotes or paraphrases FROM THE SEED TEXT, plus 1-2 supporting Scripture references.`,
          `- "insight" field: At least 2-3 sentences explaining the theological significance and WHY this matters.`,
          `- "application" field: At least 1-2 sentences giving a CONCRETE imperative action the reader should take.`,
          `- "visualHook" field: A vivid, specific mental image (not a generic phrase).`,
          ``,
          `WRONG (too shallow — this will be REJECTED):`,
          `  { "content": "The Prophecy Room examines prophetic symbols", "evidence": [], "insight": "This is relevant", "application": "Study prophecy" }`,
          ``,
          `RIGHT (substantial — this is what EVERY principle must look like):`,
          `  { "content": "Paul's appeal to the Corinthians echoes Moses lifting the bronze serpent in Numbers 21:8-9. Just as Israel had to LOOK at the lifted serpent to live, Paul urges believers to fix their eyes on the crucified Christ as the only remedy for the serpent's venom of sin.", "evidence": ["'For he hath made him to be sin for us, who knew no sin' (2 Corinthians 5:21)", "'As Moses lifted up the serpent in the wilderness, even so must the Son of man be lifted up' (John 3:14)"], "insight": "The typological connection reveals that Christ on the cross BECAME the embodiment of that which was killing humanity — sin itself — so that by looking to Him in faith, spiritual death is reversed just as physical death was reversed in the wilderness.", "application": "When besetting sins feel unconquerable, do not look inward at your failure — look UP at the One who became sin for you. Fix your gaze daily on the cross, not on the serpent's bite.", "visualHook": "A bronze serpent gleaming on a pole in the desert sun, with hundreds of dying Israelites turning their heads toward it and color returning to their faces" }`,
          ``,
          `- Every applicable room MUST have at least 1-3 principles at this depth level. Rooms without genuine connections should be marked applicable: false.`,
          `- Multi-sub-principle rooms (ir=5 senses, c6=6 genres, cycles=8 cycles, etc.) should provide sub-principles WHERE THE CONNECTION IS GENUINE — skip sub-components that would be forced.`,
          `- You are generating a COMPLETE Bible study. Fill applicable rooms with real, deep, text-specific insights. Quality over forced coverage.`,
          `- sanctuaryAnalysis elements MUST each have at least 1 insight with full content — NO EMPTY ARRAYS.`,
          `- Do NOT return any principle with an empty "content", "evidence", "insight", or "application" field.`,
        ].join("\n")
      : "";

    const strictOutputInstruction = [
      `STRICT OUTPUT RULES:`,
      `- Return ONLY valid JSON (no markdown).`,
      `- roomAnalysis MUST contain at least ${requiredRooms} room IDs (keys).`,
      `- You MUST include these rooms at minimum: sr, ir, or, cr, dr, trm, bl, pr, 123h, cycles, cec, 3a, frm.`,
      `- sanctuaryAnalysis MUST contain all 7 sanctuary elements.`,
      `- For each included room: set applicable=true and include 1-3 principles with application + visualHook + KJV cross-refs.`,
      `- Only mark rooms applicable=false for 24fps and br (which require specific study types).`,
      `- Do not return empty objects for roomAnalysis or sanctuaryAnalysis.`,
      `- For multi-principle rooms (3a, c6, ir, dr, trm, tz, frt, bl, fe, cec, 123h, cycles, frm, mr, srm, cr, or):`,
      `  Provide SEPARATE principles for each sub-component.`,
    ].join("\n");

    // Full study needs much higher token limit to fill all 35+ rooms with substantial content
    // Regular mode also needs sufficient tokens — 8192 was too low and caused truncated JSON,
    // leaving many rooms with "No insights generated yet"
    const maxTokens = fullStudy ? 65536 : 16384;

    const callGateway = async (extraUserInstruction?: string) => {
      const userPrompt = [
        fullStudy
          ? `Generate a COMPLETE Bible study for this text, applying it through EVERY room in the Phototheology Palace. Do NOT describe rooms — APPLY the text through each room's methodology with specific insights, evidence, and applications.`
          : `Analyze this text and map it to the Phototheology Palace.`,
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
              content: [MIND_MAP_SYSTEM_PROMPT, modeInstruction, strictOutputInstruction, fullStudyInstruction].filter(Boolean).join("\n\n"),
            },
            {
              role: "user",
              content: userPrompt,
            },
          ],
          // Some models honor this OpenAI field; harmless if ignored.
          response_format: { type: "json_object" },
          temperature: 0.25,
          max_tokens: maxTokens,
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
    // For full study, check that rooms actually have principles with real content (not empty strings)
    const populatedRoomCount = analysis?.roomAnalysis
      ? Object.values(analysis.roomAnalysis).filter((r: any) =>
          r.principles && r.principles.length > 0 &&
          r.principles.some((p: any) => p.content && p.content.length > 30)
        ).length
      : 0;
    // Check sanctuary elements have actual insights
    const populatedSanctuaryCount = analysis?.sanctuaryAnalysis
      ? Object.values(analysis.sanctuaryAnalysis).filter((s: any) =>
          s.insights && s.insights.length > 0 &&
          s.insights.some((i: any) => i.content && i.content.length > 20)
        ).length
      : 0;
    const minRequiredRooms = fullStudy ? Math.max(requiredRooms, 20) : requiredRooms;

    // One retry if the model returns an incomplete/empty/shallow map.
    const needsRetry = !analysis
      || roomCount < minRequiredRooms
      || sanctuaryCount < 1
      || (fullStudy && populatedRoomCount < 15)
      || (fullStudy && populatedSanctuaryCount < 5);

    if (needsRetry) {
      try {
        const retryInstruction = fullStudy
          ? `Your last output was REJECTED because ${populatedRoomCount} rooms had real content but we need at least 15, and ${populatedSanctuaryCount} sanctuary elements had content but we need at least 5. You MUST populate ALL rooms with SUBSTANTIAL study content — each principle needs 2-3 sentences of "content", 2+ "evidence" quotes from the text, 2-3 sentences of "insight", and a concrete "application". NO empty strings, NO placeholder text. roomAnalysis must have at least ${minRequiredRooms} room IDs. ALL 7 sanctuary elements must have insights with full content. Return ONLY JSON.`
          : `Your last output was incomplete. Fix it now: roomAnalysis must have at least ${requiredRooms} room IDs and sanctuaryAnalysis must have at least 1 key. Return ONLY JSON.`;
        const retry = await callGateway(retryInstruction);
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
