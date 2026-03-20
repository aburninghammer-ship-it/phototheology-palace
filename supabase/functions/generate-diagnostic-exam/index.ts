import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Room-specific test configurations keyed by room code
const ROOM_TEST_CONFIGS: Record<string, {
  discipline: string;
  questionTypes: string;
  sampleQuestions: string;
}> = {
  sr: {
    discipline: "Narrative sequence & mental movies. Collecting and memorizing Bible stories in vivid order.",
    questionTypes: "Identify narrative arcs, turning points, character roles. Arrange events in correct sequence. Identify the climax of a story. Name the resolution.",
    sampleQuestions: `- "What is the turning point in this passage?"
- "Which event comes BEFORE/AFTER this in the biblical narrative?"
- "What role does this character play in the story arc?"
- "Arrange these 5 events from Joseph's life in correct order"
- "Identify the resolution of this conflict in the story"`
  },
  ir: {
    discipline: "Sanctified imagination — stepping INSIDE the story. Sensory immersion and empathetic recall.",
    questionTypes: "Identify sensory details in passages, emotional weight, immersive elements. What would you see/hear/feel?",
    sampleQuestions: `- "If you were standing at the Red Sea, which sensory detail does the text emphasize?"
- "What emotional shift occurs in this passage?"
- "Which detail would be most vivid if you were physically present?"
- "What does this character likely FEEL at this moment based on context?"`
  },
  "24fps": {
    discipline: "One symbolic mnemonic image per chapter. Creating a mental film strip of Scripture.",
    questionTypes: "Match chapters to symbolic images. Create visual anchors. Identify which chapter a symbolic image represents.",
    sampleQuestions: `- "Which symbolic image best represents Genesis 22?"
- "If Genesis 3 were a single frame, what would dominate the image?"
- "Match these 4 symbolic images to their correct chapters"
- "What is the ONE image that captures Exodus 12?"`
  },
  br: {
    discipline: "One master image per 24-chapter block. ~51 panoramic images for the entire Bible.",
    questionTypes: "Identify themes across 24-chapter blocks. Structural memory at scale.",
    sampleQuestions: `- "What overarching theme connects Genesis 1–24?"
- "Which symbol best represents Genesis 25–50?"
- "Name the dominant narrative arc of Exodus 1–24"`
  },
  tr: {
    discipline: "Converting abstract text into concrete images. Words become pictures.",
    questionTypes: "Transform abstract verses into visual representations. Identify the best image for a concept.",
    sampleQuestions: `- "Convert Psalm 119:105 into a single concrete image"
- "Which image best represents 'the Word is a lamp'?"
- "Transform this abstract doctrine into a visual scene"`
  },
  gr: {
    discipline: "Storing striking insights and discoveries — the treasure chest of Phototheology.",
    questionTypes: "Identify gem-worthy insights. Recognize powerful connections others miss.",
    sampleQuestions: `- "What is the hidden insight in David picking up FIVE stones?"
- "Why are there 12 baskets left after feeding the 5,000?"
- "What gem connects these two seemingly unrelated passages?"`
  },
  or: {
    discipline: "Logging details without interpreting — the detective's notebook. Observation before interpretation.",
    questionTypes: "List observations. Distinguish observation from interpretation. Notice what casual readers miss.",
    sampleQuestions: `- "Which of these is an OBSERVATION vs. an INTERPRETATION?"
- "List 5 things you NOTICE in Luke 15:20 without explaining them"
- "What detail in this verse would a casual reader miss?"`
  },
  dc: {
    discipline: "Greek/Hebrew definitions + historical/cultural commentary. The forensic lab of Scripture.",
    questionTypes: "Word studies, cultural context, original language nuance.",
    sampleQuestions: `- "In John 21, what is the difference between agapao and phileo?"
- "What cultural context makes Revelation 3:18 cut deeper for Laodicea?"
- "What does the Hebrew word here reveal that English hides?"`
  },
  st: {
    discipline: "God's universal symbolic language. Symbols = recurring images. Types = OT shadows of Christ.",
    questionTypes: "Match symbols to meanings. Distinguish types from parallels. Identify typological fulfillment.",
    sampleQuestions: `- "What does 'lamb' symbolize across Scripture?"
- "Is the Passover lamb a TYPE or a PARALLEL? Explain."
- "Match these 5 symbols to their biblical meanings"`
  },
  qr: {
    discipline: "3×75 questions: intratextual, intertextual, Phototheological. Interrogation until truth shines.",
    questionTypes: "Classify questions by type. Generate penetrating questions. Identify which question type unlocks a passage.",
    sampleQuestions: `- "Is this question intratextual, intertextual, or Phototheological?"
- "What intratextual question would unlock the meaning of John 11:35?"
- "Generate an intertextual question connecting Psalm 23 and John 10"`
  },
  qa: {
    discipline: "Scripture answers Scripture. Cross-examining witnesses until truth is confirmed.",
    questionTypes: "Find Scripture that answers another Scripture. Build Q&A chains.",
    sampleQuestions: `- "Which verse ANSWERS the question raised by Genesis 22:8?"
- "Build a Q&A chain: this verse raises a question → which verse answers it?"
- "Cross-reference these two witnesses — do they agree or reveal tension?"`
  },
  nf: {
    discipline: "Seeing God's truth in creation. Nature as God's second book (Romans 1:20).",
    questionTypes: "Connect natural phenomena to spiritual truths. Freestyle nature-to-Scripture links.",
    sampleQuestions: `- "What does a seed represent spiritually? Support with Scripture."
- "Connect this natural process to the gospel"
- "How does the daily sunrise illustrate Malachi 4:2?"`
  },
  pf: {
    discipline: "Life experiences as object lessons. Your own story becomes teaching material.",
    questionTypes: "Connect life scenarios to biblical principles. See everyday events through Scripture.",
    sampleQuestions: `- "Being stuck in traffic → which biblical story does this echo?"
- "How does losing your keys connect to Luke 15?"
- "Connect this everyday scenario to a gospel truth"`
  },
  bf: {
    discipline: "Verse Genetics — tracing genealogies of thought between verses. Every verse has relatives.",
    questionTypes: "Connect verses to their siblings, cousins, distant relatives. Build verse family trees.",
    sampleQuestions: `- "John 3:16 and Romans 5:8 are 'brothers.' Why?"
- "Given this verse, name 3 related verses and explain the relationship"
- "Which of these 4 verses is the closest 'relative' to Genesis 22?"`
  },
  hf: {
    discipline: "Bible interprets secular history and culture. Current events through prophetic lens.",
    questionTypes: "Connect historical events to biblical principles. See prophecy in history.",
    sampleQuestions: `- "How does the printing press connect to God's providence?"
- "What biblical principle does social media's global reach echo?"
- "Connect this historical event to a biblical pattern"`
  },
  lr: {
    discipline: "Listening and instantly connecting to Scripture. Agile, responsive spiritual thinking.",
    questionTypes: "Hear a statement or testimony and connect to Scripture instantly.",
    sampleQuestions: `- "Someone shares they were healed. Which Scripture springs to mind first?"
- "A friend talks about anxiety. What verse responds?"
- "React to this testimony with a Scripture connection"`
  },
  cr: {
    discipline: "Every text MUST reveal Christ. The magnifying glass that bends all light to Jesus.",
    questionTypes: "Find Christ in unexpected passages. Explain how a text points to Jesus.",
    sampleQuestions: `- "Where is Christ in Exodus 17?"
- "How does Psalm 22 reveal Christ before the incarnation?"
- "Find the Christ-thread in this seemingly non-messianic passage"`
  },
  dr: {
    discipline: "5 dimensions: Literal, Christ, Me, Church, Heaven. Every passage viewed through 5 lights.",
    questionTypes: "Apply all 5 dimensions to a passage. Identify which dimension is missing from an interpretation.",
    sampleQuestions: `- "Apply all 5 dimensions to Exodus 12:13"
- "This interpretation covers Literal and Christ. What 3 dimensions are missing?"
- "Which dimension does this reading emphasize? What's missing?"`
  },
  c6: {
    discipline: "6 genres: Prophecy, Poetry, History, Gospels, Epistles, Parables. Genre shapes meaning.",
    questionTypes: "Classify passages by genre. Explain how genre affects interpretation.",
    sampleQuestions: `- "Is this passage Prophecy, Poetry, or History?"
- "How does reading this as Poetry vs. History change the meaning?"
- "Match these 6 passages to their correct genres"`
  },
  trm: {
    discipline: "Theme walls: Sanctuary, Life of Christ, Great Controversy, Time Prophecy, Gospel Floor, Heaven Ceiling.",
    questionTypes: "Place texts on correct theme walls. Identify which wall a passage belongs to.",
    sampleQuestions: `- "Which theme wall does Daniel 7:13-14 belong on?"
- "Place these 5 texts on their correct theme walls"
- "This verse touches multiple walls. Name them and explain."`
  },
  tz: {
    discipline: "6 zones: Heaven/Earth × Past/Present/Future. Locating passages in time and space.",
    questionTypes: "Assign passages to correct time zones. Distinguish past/present/future applications.",
    sampleQuestions: `- "Is Hebrews 9:24 past, present, or future? Heaven or Earth?"
- "Place this prophecy in its correct time zone"
- "This passage spans multiple time zones. Map it."`
  },
  prm: {
    discipline: "Recurring motifs: 40 days, 3 days, deliverer stories. God's fingerprints across Scripture.",
    questionTypes: "Identify patterns. Connect recurring numbers, themes, story structures.",
    sampleQuestions: `- "What pattern connects Noah (40 days), Moses (40 days), Jesus (40 days)?"
- "Identify the recurring motif in these 4 passages"
- "What 3-day pattern connects Joseph, Jonah, and Christ?"`
  },
  "p||": {
    discipline: "Mirrored ACTIONS across time. Not types (objects) — parallels are mirrored events.",
    questionTypes: "Identify parallels. Distinguish parallels from types. Spot mirrored historical actions.",
    sampleQuestions: `- "Babel (languages divided) parallels Pentecost (languages united). What's the parallel?"
- "Is this a TYPE or a PARALLEL? Explain the difference."
- "Identify the parallel action between Exodus and the return from Babylon"`
  },
  frt: {
    discipline: "Interpretation must produce Galatians 5:22-23 fruit. The taste-test of truth.",
    questionTypes: "Evaluate interpretations by their spiritual fruit. Identify toxic readings.",
    sampleQuestions: `- "Does this interpretation produce love or fear? Evaluate."
- "Which of these 3 readings of this passage produces the most Christlike fruit?"
- "This reading produces arrogance. How should it be corrected?"`
  },
  cec: {
    discipline: "Christ in Every Chapter. Name Christ's thread explicitly in each chapter.",
    questionTypes: "Find and name Christ's presence in specific chapters.",
    sampleQuestions: `- "Name Christ's thread in Genesis 3"
- "How is Christ present in 2 Kings 5?"
- "Trace the Christological thread through Psalm 119"`
  },
  r66: {
    discipline: "Trace one theme through all 66 books. Theology that walks Genesis to Revelation.",
    questionTypes: "Trace themes across multiple books. Identify the thread connecting distant books.",
    sampleQuestions: `- "Trace the 'lamb' theme from Genesis to Revelation in 5 key verses"
- "How does the theme of 'covenant' appear in Psalms vs. Hebrews?"
- "Connect this theme across at least 4 different books"`
  },
  bl: {
    discipline: "Sanctuary blueprint. Every piece of furniture maps to salvation history.",
    questionTypes: "Match furniture to gospel meaning. Trace the believer's journey through the sanctuary.",
    sampleQuestions: `- "What does the Altar of Incense represent in the gospel?"
- "Trace the believer's journey from Gate to Ark"
- "Match these 5 pieces of furniture to their Christ-centered meanings"`
  },
  pr: {
    discipline: "Daniel & Revelation prophecy. Historicist method. Repeat-and-enlarge timelines.",
    questionTypes: "Interpret prophetic symbols. Map prophetic timelines. Apply historicist method.",
    sampleQuestions: `- "How does Daniel 7 'repeat and enlarge' Daniel 2?"
- "What does the little horn represent in Daniel 7?"
- "Apply the historicist method to this prophetic passage"`
  },
  "3a": {
    discipline: "Three Angels' Messages (Rev 14:6-12). The final gospel syllabus.",
    questionTypes: "Content, sequence, and meaning of the three angels. Doctrinal convergence.",
    sampleQuestions: `- "What is the core command of the First Angel's Message?"
- "How do the Three Angels' Messages unify Sabbath, law, and gospel?"
- "What does 'Babylon is fallen' mean in the Second Angel's context?"`
  },
  feasts: {
    discipline: "Israel's feasts as prophetic markers pointing to Christ's work.",
    questionTypes: "Connect feasts to prophetic fulfillment. Identify which feast a passage echoes.",
    sampleQuestions: `- "Which feast does 1 Corinthians 5:7 fulfill?"
- "What is the prophetic significance of the Day of Atonement?"
- "Match these feasts to their NT fulfillments"`
  },
  "1h": {
    discipline: "First Heaven (DoL¹/NE¹). Babylon destroys Jerusalem → post-exilic restoration under Cyrus.",
    questionTypes: "Identify 1H passages. Distinguish 1H from 2H/3H. Map Cyrusic restoration.",
    sampleQuestions: `- "Does this passage belong to 1H, 2H, or 3H?"
- "What makes Isaiah 65's 'new heavens and earth' a 1H reference, not 3H?"
- "Map this passage to the correct Day-of-the-Lord horizon"`
  },
  "2h": {
    discipline: "Second Heaven (DoL²/NE²). 70 AD destruction → New-Covenant heavenly order.",
    questionTypes: "Identify 2H passages. Trace the transfer from earthly to heavenly sanctuary.",
    sampleQuestions: `- "Is Hebrews 12:26-28 describing 1H, 2H, or 3H?"
- "How does the Olivet Discourse relate to 2H?"
- "What 'new heavens and earth' language applies to 2H?"`
  },
  "3h": {
    discipline: "Third Heaven (DoL³/NE³). Final cosmic judgment → literal new creation.",
    questionTypes: "Identify 3H passages. Distinguish final from typological renewal.",
    sampleQuestions: `- "What makes 2 Peter 3 a 3H passage?"
- "How does Revelation 21-22 differ from Isaiah 65's NE language?"
- "Identify the 3H elements in this passage"`
  },
  cycles: {
    discipline: "Eight Cycles: @Ad through @Re. Fall → Covenant → Sanctuary → Enemy → Restoration.",
    questionTypes: "Match events to cycles. Identify the 5-part pattern. Trace cycle progression.",
    sampleQuestions: `- "Which cycle does the Exodus belong to?"
- "Identify the Fall→Covenant→Sanctuary→Enemy→Restoration pattern in @No"
- "What cycle does Pentecost initiate?"`
  },
  jr: {
    discipline: "Juice Room — squeeze one book through ALL PT principles. Extract every drop.",
    questionTypes: "Apply multiple rooms to one passage. Demonstrate integrated PT thinking.",
    sampleQuestions: `- "Apply SR + OR + CR + BL to Jonah chapter 2"
- "Juice this passage: which 5 rooms would you activate and why?"
- "Demonstrate full-spectrum PT analysis of this short text"`
  },
  frm: {
    discipline: "Fire Room — emotional weight of Scripture. The Word examines YOU.",
    questionTypes: "Identify emotional weight. Engage devotionally. Feel the conviction.",
    sampleQuestions: `- "What is the emotional weight of Isaiah 53:5?"
- "How should Gethsemane make you FEEL, not just think?"
- "Which word in this verse carries the heaviest emotional load?"`
  },
  mr: {
    discipline: "Meditation Room — slow marination in truth. Not emptying the mind, but saturating it.",
    questionTypes: "Slow-reading exercises. Identify what to pause on. Meditative engagement.",
    sampleQuestions: `- "In Psalm 23, which phrase deserves the longest pause? Why?"
- "How would you meditate on John 15:5 for 10 minutes?"
- "What shifts when you read this verse slowly vs. quickly?"`
  },
  srm: {
    discipline: "Speed Room — rapid application of PT principles. Sprint training for the mind.",
    questionTypes: "Quick connections. Rapid-fire recall. Timed associations.",
    sampleQuestions: `- "In 30 seconds: connect Matthew 28:18 to Daniel 7:14"
- "Rapid-fire: name 5 Christ connections in Genesis 1-11"
- "Speed-map this passage: floor, room, cycle, heaven — GO"`
  },
};

const EXAM_CONFIGS: Record<string, {
  name: string;
  timeSeconds: number;
  questionCount: number;
  systemPrompt: string;
  categories: string[];
}> = {
  foundation: {
    name: "Foundation Diagnostic",
    timeSeconds: 3600,
    questionCount: 50,
    categories: [
      "floor_identification", "room_purposes", "room_methodology",
      "system_flow", "codes_shorthand", "expansions_ascensions",
      "principle_distinctions", "room_selection"
    ],
    systemPrompt: `You are the PT Foundation Diagnostic Examiner. Generate EXACTLY 50 questions testing whether the user understands the Phototheology Palace framework.

ENTROPY SEED: {{ENTROPY}}

=== WHAT THIS TEST COVERS ===
This is the "Do they understand the map?" test. It checks:
- Names and purpose of all 8 floors
- Names and functions of every room
- How the PT system flows (Width→Time→Depth→Height)
- What kind of thinking belongs in each room
- Difference between observation, connection, symbolism, Christ-centered reading, prophecy, application, and freestyle
- PT codes and shorthand
- Five Ascensions and Four Expansions

=== PALACE ROOMS (EXACT DEFINITIONS) ===

FLOOR 1 — FURNISHING (Memory & Visualization for Width):
- Story Room (SR): Collect and memorize Bible stories in sequence as vivid mental movies. NOT interpretation — just collecting stories.
- Imagination Room (IR): Step INSIDE the story as if you were there. Sanctified empathy.
- 24FPS Room (24): One symbolic mnemonic image per chapter. Mental film strip.
- Bible Rendered (BR): One master image per 24-chapter block. ~51 images for entire Bible.
- Translation Room (TR): Convert abstract text into concrete images.
- Gems Room (GR): Store striking insights and discoveries.

FLOOR 2 — INVESTIGATION (Detective Work for Width):
- Observation Room (OR): Log details without interpreting. Detective's notebook.
- Def-Com Room (DC): Greek/Hebrew definitions + historical/cultural commentary.
- Symbols/Types Room (ST): God's imagery profiles. Symbols = universal language. Types = OT shadows.
- Questions Room (QR): 3×75 questions: intratextual, intertextual, Phototheological.
- Q&A Room (QA): Scripture answers Scripture. Cross-examine witnesses.

FLOOR 3 — FREESTYLE (Spontaneous Connections for Time):
- Nature Freestyle (NF): See God's truth in creation.
- Personal Freestyle (PF): Life experiences as object lessons.
- Bible Freestyle / Verse Genetics (BF): Trace genealogies of thought between verses.
- History/Social Freestyle (HF): Bible interprets secular history and culture.
- Listening Room (LR): Listen and instantly connect to Scripture.

FLOOR 4 — NEXT LEVEL (Christ-Centered Depth):
- Concentration Room (CR): Every text MUST reveal Christ.
- Dimensions Room (DR): 5 dimensions: Literal, Christ, Me, Church, Heaven.
- Connect 6 (C6): 6 genres: Prophecy, Poetry, History, Gospels, Epistles, Parables.
- Theme Room (TRm): Walls: Sanctuary, Life of Christ, Great Controversy, Time Prophecy, Gospel Floor, Heaven Ceiling.
- Time Zone (TZ): 6 zones: Heaven/Earth × Past/Present/Future.
- Patterns Room (PRm): Recurring motifs: 40 days, 3 days, deliverer stories.
- Parallels Room (P‖): Mirrored ACTIONS across time.
- Fruit Room (FRt): Interpretation must produce Gal 5:22-23 fruit.
- Christ in Every Chapter (CEC): Name Christ's thread explicitly.
- Room 66 (R66): Trace one theme through all 66 books.

FLOOR 5 — VISION (Prophecy & Sanctuary):
- Blue Room / Sanctuary (BL): Sanctuary blueprint.
- Prophecy Room (PR): Daniel & Revelation. Historicist method.
- Three Angels' Room (3A): Rev 14:6-12 capstone.
- Feasts Room: Israel's feasts as prophetic markers.

FLOOR 6 — THREE HEAVENS & CYCLES:
- 1H (DoL¹/NE¹), 2H (DoL²/NE²), 3H (DoL³/NE³)
- Eight Cycles: @Ad, @No, @Ab, @Mo, @Cy, @CyC, @Sp, @Re
- Juice Room (JR): Squeeze one book through ALL principles.

FLOOR 7 — SPIRITUAL/EMOTIONAL:
- Fire Room (FRm), Meditation Room (MR), Speed Room (SRm)

FLOOR 8 — MASTER: No rooms. Reflexive mastery (∞).

=== FIVE ASCENSIONS ===
Asc-1 (Text) → Asc-2 (Chapter) → Asc-3 (Book) → Asc-4 (Cycle) → Asc-5 (Heaven)

=== FOUR EXPANSIONS ===
Width (Floors 1-2), Time (Floor 3), Depth (Floors 4-5-6), Height (Floors 7-8)

=== QUESTION DISTRIBUTION ===
1. FLOOR IDENTIFICATION (8q): Which floor does this room belong to? Match rooms to floors.
2. ROOM PURPOSES (8q): What does this room do? Distinguish similar rooms.
3. ROOM METHODOLOGY (7q): HOW do you use this room? What exercises does it require?
4. SYSTEM FLOW (6q): How do floors connect? Why does order matter?
5. CODES & SHORTHAND (6q): What do these codes mean? Match codes to rooms/principles.
6. EXPANSIONS & ASCENSIONS (5q): Test Width/Time/Depth/Height and Asc-1 through Asc-5.
7. PRINCIPLE DISTINCTIONS (5q): What's the difference between observation vs interpretation, types vs parallels, etc.
8. ROOM SELECTION (5q): "Which PT room best handles this task?" scenario questions.

TYPES: ~20 MC (4 options), ~15 TF, ~15 SA (with grading_rubric).
DIFFICULTY: 40% intermediate, 40% advanced, 20% master.

CRITICAL: NEVER attribute a room to the wrong floor. Double-check every answer.

OUTPUT: raw JSON only, no markdown:
{"questions":[{"id":1,"category":"floor_identification","type":"mc","difficulty":"intermediate","question":"...","options":["A","B","C","D"],"correct_answer":"B","explanation":"..."}]}

Valid categories: floor_identification, room_purposes, room_methodology, system_flow, codes_shorthand, expansions_ascensions, principle_distinctions, room_selection`
  },
  prophecy_sanctuary: {
    name: "Prophecy & Sanctuary",
    timeSeconds: 3600,
    questionCount: 50,
    categories: [
      "sanctuary_furniture", "sanctuary_progression", "daniel_prophecy",
      "revelation_structure", "three_heavens", "cycles", "time_prophecy",
      "three_angels", "feasts", "prophetic_method"
    ],
    systemPrompt: `You are the PT Prophecy & Sanctuary Diagnostic Examiner. Generate EXACTLY 50 questions testing prophetic structure, sanctuary mapping, Three Heavens, cycles, and prophetic methodology.

ENTROPY SEED: {{ENTROPY}}

=== WHAT THIS TEST COVERS ===
This tests whether the user can navigate prophecy and sanctuary with PT precision:
- Sanctuary furniture meanings and gospel progression
- Daniel's prophetic structure (chapters 2, 7, 8-9, 10-12)
- Revelation's flow and connections to Daniel
- Three Heavens framework (DoL¹/NE¹, DoL²/NE², DoL³/NE³)
- Eight Cycles (@Ad through @Re) and their patterns
- Time prophecies: @120, @400, @70y, @490, @1260, @2300
- Day-Year Principle
- Three Angels' Messages (Rev 14:6-12)
- Israel's Feasts as prophetic markers
- Historicist method vs other approaches

=== SANCTUARY BLUEPRINT (Blue Room / BL) ===
- Gate: Entry point. Christ is the door (John 10:9).
- Altar of Burnt Offering: Cross/sacrifice. Complete surrender.
- Laver: Baptism/cleansing. Sanctification by the Word (Eph 5:26).
- Lampstand: Light of the Spirit. Seven-branch = completeness.
- Table of Showbread: Word of God. Bread of Life (John 6:35).
- Altar of Incense: Intercession/prayer. Christ's mediation.
- Veil: Access to God's presence. Torn at the cross (Matt 27:51).
- Ark of the Covenant: Law (tables), mercy seat (propitiation), God's throne.

=== THREE HEAVENS ===
- 1H (DoL¹/NE¹): Babylon destroys Jerusalem 586BC → post-exilic restoration under Cyrus. "New heavens and earth" = prophetic restoration language (Isa 65-66). Cycles: @Mo → @Cy.
- 2H (DoL²/NE²): Rome destroys Jerusalem 70AD → New-Covenant order. Church as temple, Christ in heavenly sanctuary (Heb 8-12). Cycles: @CyC → @Sp.
- 3H (DoL³/NE³): Final cosmic judgment → literal new creation (Rev 21-22). No temple needed. Cycle: @Re.

=== EIGHT CYCLES ===
Pattern: Fall → Covenant → Sanctuary → Enemy → Restoration
@Ad (Adamic), @No (Noahic), @Ab (Abrahamic), @Mo (Mosaic), @Cy (Cyrusic), @CyC (Cyrus-Christ), @Sp (Holy Spirit), @Re (Remnant)

=== KEY TIME PROPHECIES ===
- @120: 120 years before the Flood (Gen 6:3)
- @400: 400 years of affliction (Gen 15:13)
- @70y: 70 years of Babylonian captivity (Jer 25:11-12)
- @490: 70 weeks / 490 years (Dan 9:24-27)
- @1260: 1260 days/42 months/3.5 times (Dan 7:25; Rev 12:6, 13:5)
- @2300: 2300 evening-mornings (Dan 8:14) → 1844 cleansing of sanctuary
- Day-Year Principle: Num 14:34, Ezek 4:6

=== THREE ANGELS' MESSAGES (Rev 14:6-12) ===
1st Angel: Everlasting Gospel → worship Creator → judgment hour
2nd Angel: Babylon is fallen → false systems exposed
3rd Angel: Warning against beast/image/mark → endurance of saints

=== FEASTS OF ISRAEL ===
Passover, Unleavened Bread, Firstfruits, Pentecost, Trumpets, Day of Atonement, Tabernacles

=== REVELATION STRUCTURE ===
Rev 1-3: Churches (historical periods)
Rev 4-5: Throne room / Lamb
Rev 6-7: Seals
Rev 8-11: Trumpets (including Rev 10 little book, Rev 11 Two Witnesses)
Rev 12-14: Great Controversy panorama → Three Angels
Rev 15-18: Plagues / Babylon's fall
Rev 19-22: Second Coming → New Earth

=== QUESTION DISTRIBUTION ===
1. SANCTUARY FURNITURE (6q): What does each piece mean? Gospel progression through sanctuary.
2. SANCTUARY PROGRESSION (4q): How does the believer move through the sanctuary experience?
3. DANIEL PROPHECY (6q): Structures of Dan 2, 7, 8-9. Repeat-and-enlarge.
4. REVELATION STRUCTURE (5q): Flow of Revelation, connections to Daniel.
5. THREE HEAVENS (6q): Identify which heaven a passage belongs to. DoL/NE framework.
6. CYCLES (5q): Match events to cycles. Identify the Fall→Covenant→Sanctuary→Enemy→Restoration pattern.
7. TIME PROPHECY (6q): Calculate and identify prophetic time periods. Day-Year Principle.
8. THREE ANGELS (4q): Content, sequence, and meaning of Rev 14:6-12.
9. FEASTS (4q): Connect feasts to prophetic fulfillment.
10. PROPHETIC METHOD (4q): Historicist method, interpretation principles.

TYPES: ~20 MC (4 options), ~15 TF, ~15 SA (with grading_rubric).
DIFFICULTY: 30% intermediate, 45% advanced, 25% master.

OUTPUT: raw JSON only, no markdown:
{"questions":[{"id":1,"category":"sanctuary_furniture","type":"mc","difficulty":"intermediate","question":"...","options":["A","B","C","D"],"correct_answer":"B","explanation":"...","scripture_ref":"Heb 9:4"}]}

Valid categories: sanctuary_furniture, sanctuary_progression, daniel_prophecy, revelation_structure, three_heavens, cycles, time_prophecy, three_angels, feasts, prophetic_method`
  }
};

function buildRoomTestPrompt(roomCode: string, roomName: string, entropy: string): string {
  const roomConfig = ROOM_TEST_CONFIGS[roomCode];
  if (!roomConfig) {
    throw new Error(`Unknown room code: ${roomCode}`);
  }

  return `You are the PT Room Intelligence Examiner for the "${roomName}" room. Generate EXACTLY 50 questions that test mastery of this specific room's discipline.

ENTROPY SEED: ${entropy}

=== ROOM: ${roomName} (Code: ${roomCode.toUpperCase()}) ===
DISCIPLINE: ${roomConfig.discipline}

=== QUESTION TYPES FOR THIS ROOM ===
${roomConfig.questionTypes}

=== SAMPLE QUESTION STYLES ===
${roomConfig.sampleQuestions}

=== CRITICAL RULES ===
1. ALL 50 questions must test the specific discipline of the ${roomName}. Do NOT test general Bible knowledge or other rooms.
2. Questions must require the student to APPLY the room's method, not just recall facts about it.
3. Use REAL Bible passages and scenarios — never generic placeholders.
4. Vary difficulty: 30% intermediate (apply the method to familiar passages), 40% advanced (apply to unexpected passages), 30% master (combine with other principles, spot subtle errors).
5. Mix question types: ~20 MC (4 options), ~15 TF, ~15 SA (with grading_rubric for AI grading).
6. Every question must have a clear, defensible correct_answer and explanation.
7. For SA questions, include a grading_rubric array of 3-5 key points the answer must include.
8. NEVER repeat the same passage or concept twice.

=== CATEGORIES ===
Use these categories to distribute questions evenly:
- "room_application" (20q): Apply the room's method to specific passages
- "room_distinction" (10q): Distinguish this room's work from similar rooms
- "room_depth" (10q): Advanced/nuanced application of the room's principles
- "room_integration" (10q): How this room connects to other PT principles

OUTPUT: raw JSON only, no markdown code blocks:
{"questions":[{"id":1,"category":"room_application","type":"mc","difficulty":"intermediate","question":"...","options":["A","B","C","D"],"correct_answer":"B","explanation":"...","scripture_ref":"Gen 22:1-14"}]}

Valid categories: room_application, room_distinction, room_depth, room_integration`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { exam_type, room_code, room_name } = body;
    const effectiveType = exam_type || "foundation";

    // Determine if this is a room test
    const isRoomTest = effectiveType === "room_test";

    if (isRoomTest && (!room_code || !room_name)) {
      throw new Error("room_code and room_name are required for room_test type");
    }

    if (!isRoomTest && !EXAM_CONFIGS[effectiveType]) {
      throw new Error(`Invalid exam type: ${effectiveType}. Valid types: ${Object.keys(EXAM_CONFIGS).join(", ")}, room_test`);
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const questionCount = isRoomTest ? 50 : EXAM_CONFIGS[effectiveType].questionCount;
    const timeSeconds = isRoomTest ? 2700 : EXAM_CONFIGS[effectiveType].timeSeconds; // 45 min for room tests
    const examName = isRoomTest ? `Room Test: ${room_name}` : EXAM_CONFIGS[effectiveType].name;

    // Create exam row
    const { data: examRow, error: insertError } = await supabaseClient
      .from("master_exam_attempts")
      .insert({
        user_id: user.id,
        status: "generating",
        exam_type: isRoomTest ? `room_test_${room_code}` : effectiveType,
        total_questions: questionCount,
      })
      .select("id")
      .single();

    if (insertError) throw new Error(`DB insert failed: ${insertError.message}`);

    const entropySeed = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    let systemPrompt: string;
    if (isRoomTest) {
      systemPrompt = buildRoomTestPrompt(room_code, room_name, entropySeed);
    } else {
      systemPrompt = EXAM_CONFIGS[effectiveType].systemPrompt.replace("{{ENTROPY}}", entropySeed);
    }

    console.log(`Generating ${isRoomTest ? `room test (${room_name})` : effectiveType} exam...`);

    const modelsToTry = ["openai/gpt-5", "google/gemini-2.5-flash"];
    let response: Response | null = null;

    for (const model of modelsToTry) {
      console.log(`Trying model: ${model}`);
      response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Generate the ${questionCount}-question ${examName} exam now. Return ONLY raw JSON — no markdown code blocks. Ensure variety and rigor.` },
          ],
          max_tokens: 32768,
        }),
      });
      if (response.ok) break;
      console.warn(`Model ${model} failed with status ${response.status}`);
    }

    if (!response || !response.ok) {
      const errorText = response ? await response.text() : "All models failed";
      console.error("AI gateway error:", response?.status, errorText);
      await supabaseClient
        .from("master_exam_attempts")
        .update({ status: "abandoned" })
        .eq("id", examRow.id);

      if (response?.status === 429) throw new Error("Rate limit exceeded. Please wait and try again.");
      if (response?.status === 402) throw new Error("AI credits exhausted.");
      throw new Error("Failed to generate exam questions");
    }

    const aiResult = await response.json();
    let rawContent: string;
    const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
    rawContent = toolCall ? toolCall.function.arguments : (aiResult.choices?.[0]?.message?.content || "");

    if (!rawContent) {
      await supabaseClient.from("master_exam_attempts").update({ status: "abandoned" }).eq("id", examRow.id);
      throw new Error("No exam data returned from AI");
    }

    let cleanContent = rawContent.trim();
    if (cleanContent.startsWith("```")) {
      cleanContent = cleanContent.replace(/```json?\n?/g, "").replace(/```\s*$/g, "").trim();
    }

    let examData: { questions: any[] };
    try {
      examData = JSON.parse(cleanContent);
    } catch {
      await supabaseClient.from("master_exam_attempts").update({ status: "abandoned" }).eq("id", examRow.id);
      throw new Error("Failed to parse exam data");
    }

    if (!examData.questions?.length) {
      await supabaseClient.from("master_exam_attempts").update({ status: "abandoned" }).eq("id", examRow.id);
      throw new Error("Invalid exam structure from AI");
    }

    const validCategories = isRoomTest
      ? ["room_application", "room_distinction", "room_depth", "room_integration"]
      : EXAM_CONFIGS[effectiveType].categories;

    const questions = examData.questions.map((q: any, i: number) => ({
      id: i + 1,
      category: q.category || validCategories[0],
      type: q.type || "mc",
      difficulty: q.difficulty || "intermediate",
      question: q.question || "",
      options: q.type === "mc" ? (q.options || []) : undefined,
      correct_answer: q.correct_answer || "",
      explanation: q.explanation || "",
      grading_rubric: q.type === "sa" ? (q.grading_rubric || []) : undefined,
      scripture_ref: q.scripture_ref || undefined,
    }));

    await supabaseClient
      .from("master_exam_attempts")
      .update({
        questions_data: questions,
        total_questions: questions.length,
        status: "in_progress",
        started_at: new Date().toISOString(),
      })
      .eq("id", examRow.id);

    const clientQuestions = questions.map((q: any) => ({
      id: q.id, category: q.category, type: q.type, difficulty: q.difficulty,
      question: q.question, options: q.options, scripture_ref: q.scripture_ref,
    }));

    console.log(`${examName} exam ${examRow.id} generated with ${clientQuestions.length} questions`);

    return new Response(
      JSON.stringify({
        exam_id: examRow.id,
        questions: clientQuestions,
        time_limit_seconds: timeSeconds,
        exam_type: isRoomTest ? `room_test_${room_code}` : effectiveType,
        room_name: isRoomTest ? room_name : undefined,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Generate diagnostic exam error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
