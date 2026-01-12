// ============================================================================
// THE MAGNUM OPUS OF PHOTOTHEOLOGY - Core System Data
// ============================================================================
// This file contains the foundational data structures for the Phototheology
// Palace system, including floors, rooms, cycles, heavens, ascensions, and
// expansions as defined in the Magnum Opus teaching manual.
// ============================================================================

// ============================================================================
// SECTION I: CORE TYPE DEFINITIONS
// ============================================================================

export type FloorNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type ExpansionType = "width" | "time" | "depth" | "height";

export type AscensionLevel = "text" | "chapter" | "book" | "cycle" | "heaven";

export type CycleCode = "@Ad" | "@No" | "@Ab" | "@Mo" | "@Cy" | "@CyC" | "@Sp" | "@Re";

export type HeavenCode = "1H" | "2H" | "3H";

export type DayOfLordCode = "DoL1" | "DoL2" | "DoL3";

export type NewEarthCode = "NE1" | "NE2" | "NE3";

// Room codes by floor
export type Floor1RoomCode = "SR" | "IR" | "24F" | "BR" | "TR" | "GR";
export type Floor2RoomCode = "OR" | "DC" | "ST" | "QR" | "QA";
export type Floor3RoomCode = "NF" | "PF" | "BF" | "HF" | "LR";
export type Floor4RoomCode = "CR" | "DR" | "C6" | "TRm" | "TZ" | "PRm" | "P||" | "FRt" | "CEC" | "R66";
export type Floor5RoomCode = "BL" | "PR" | "3A" | "FR";
export type Floor6RoomCode = "JR"; // Plus cycles and heavens
export type Floor7RoomCode = "FRm" | "MR" | "SRm";
export type Floor8Code = "∞";

export type RoomCode =
  | Floor1RoomCode
  | Floor2RoomCode
  | Floor3RoomCode
  | Floor4RoomCode
  | Floor5RoomCode
  | Floor6RoomCode
  | Floor7RoomCode
  | Floor8Code;

// Theme Room walls/floor/ceiling
export type ThemeWall =
  | "sanctuary-wall"
  | "life-of-christ-wall"
  | "great-controversy-wall"
  | "time-prophecy-wall"
  | "gospel-floor"
  | "heaven-ceiling";

// Time Zone dimensions (6 total)
export type TimeZone =
  | "heaven-past"
  | "heaven-present"
  | "heaven-future"
  | "earth-past"
  | "earth-present"
  | "earth-future";

// Five Dimensions for the Dimensions Room
export type DimensionType = "literal" | "christ" | "me" | "church" | "heaven";

// Connect 6 genres
export type BibleGenre = "prophecy" | "poetry" | "history" | "gospels" | "epistles" | "parables";

// ============================================================================
// SECTION II: FLOOR STRUCTURE
// ============================================================================

export interface PTFloor {
  number: FloorNumber;
  name: string;
  subtitle: string;
  expansion: ExpansionType;
  description: string;
  purpose: string;
  analogy: string;
  rooms: string[]; // Room codes
}

export const ptFloors: PTFloor[] = [
  {
    number: 1,
    name: "Furnishing Floor",
    subtitle: "Memory & Visualization for Width",
    expansion: "width",
    description: "Load the canon's storyline into long-term memory as vivid scenes. Build your foundational library of stories, images, and gems.",
    purpose: "Fill the mind with as much Scripture as possible in a memorable way - stories, images, translations, and gems.",
    analogy: "Like a craftsman preparing a workshop or an architect furnishing a home - gathering and arranging raw material.",
    rooms: ["SR", "IR", "24F", "BR", "TR", "GR"]
  },
  {
    number: 2,
    name: "Investigation Floor",
    subtitle: "Detective Work for Width",
    expansion: "width",
    description: "Become a detective of the Word. Gather raw data, define terms, decode symbols, and interrogate the text with precision.",
    purpose: "Transform the Bible student into a detective who observes, questions, cross-examines, and follows leads.",
    analogy: "Like a detective's office: walls covered in evidence photos, notes on suspects, timelines mapped out.",
    rooms: ["OR", "DC", "ST", "QR", "QA"]
  },
  {
    number: 3,
    name: "Freestyle Floor",
    subtitle: "Connections for Time",
    expansion: "time",
    description: "Master the art of drawing object lessons from everything around you. Train your mind to spontaneously connect the physical world with spiritual truth.",
    purpose: "Train to think in Scripture on the fly - Bible study isn't confined to a desk.",
    analogy: "Like a hip hop artist freestyling over a beat - the content flows spontaneously from memory.",
    rooms: ["NF", "PF", "BF", "HF", "LR"]
  },
  {
    number: 4,
    name: "Next Level Floor",
    subtitle: "Christ-Centered Depth",
    expansion: "depth",
    description: "Every verse is now seen in relation to Christ, organized into dimensions, genres, themes, and parallels.",
    purpose: "Transform random insights into structured theology with Christ at the center.",
    analogy: "Like architecture: the first floors gathered materials, but this floor starts laying them into walls, beams, and rooms.",
    rooms: ["CR", "DR", "C6", "TRm", "TZ", "PRm", "P||", "FRt", "CEC", "R66"]
  },
  {
    number: 5,
    name: "Vision Floor",
    subtitle: "Prophecy & Sanctuary",
    expansion: "depth",
    description: "See the vast, panoramic sweep of prophecy and sanctuary. Local texts are fitted into God's master plan.",
    purpose: "Lift your eyes to see prophecy fulfilled in time and the sanctuary as the blueprint of redemption.",
    analogy: "Like a telescope - stepping back and seeing the whole skyscraper rising into the skyline.",
    rooms: ["BL", "PR", "3A", "FR"]
  },
  {
    number: 6,
    name: "Three Heavens Floor",
    subtitle: "Cycles & Cosmic Context",
    expansion: "depth",
    description: "Situate everything in the cosmic stage of history. See how texts fit within heavenly phases and prophetic cycles.",
    purpose: "Never read a text in isolation but always in cosmic context through cycles and heavens.",
    analogy: "Like a planetarium dome - you see how texts fit within heavenly phases and prophetic cycles.",
    rooms: ["JR"] // Plus cycles (@Ad-@Re) and heavens (1H-3H)
  },
  {
    number: 7,
    name: "Spiritual & Emotional Floor",
    subtitle: "Heart Transformation",
    expansion: "height",
    description: "Bible study is not just intellectual - it is transformational. Truth must reach the heart.",
    purpose: "Ensure that study produces transformation, not just knowledge.",
    analogy: "Like stepping into a furnace - the Word is not something you merely examine, it examines you.",
    rooms: ["FRm", "MR", "SRm"]
  },
  {
    number: 8,
    name: "Master Floor",
    subtitle: "Reflexive Phototheology",
    expansion: "height",
    description: "The palace is no longer outside of you - it is inside you. No rooms, just reflexive thinking.",
    purpose: "Phototheology becomes reflexive thought - the goal where the method disappears into mastery.",
    analogy: "Like driving - at first you think about pedals and mirrors, but eventually you just drive.",
    rooms: ["∞"]
  }
];

// ============================================================================
// SECTION III: ROOM DEFINITIONS
// ============================================================================

export interface PTRoom {
  code: RoomCode;
  name: string;
  floor: FloorNumber;
  icon: string;
  purpose: string;
  action: string;
  output: string;
  coreQuestion: string;
  method: string;
  keyPrinciples: string[];
  examples: string[];
  pitfalls: string[];
  deliverable: string;
}

export const ptRooms: Record<RoomCode, PTRoom> = {
  // ========== FLOOR 1: FURNISHING ==========
  SR: {
    code: "SR",
    name: "Story Room",
    floor: 1,
    icon: "Book",
    purpose: "Transform biblical events into memorable, sequential scenes. Build your foundational library of stories you can instantly recall.",
    action: "Break down a narrative into 3-7 memorable 'beats' (major plot movements) and arrange them chronologically.",
    output: "A beat list with arrows showing sequence, plus a one-line plot summary.",
    coreQuestion: "What exactly happened—and in what order?",
    method: "Turn each story into a vivid mental movie. For example: Joseph's story = coat → pit → caravan → prison → palace.",
    keyPrinciples: [
      "Beats are like film shots - each freezes a distinct moment",
      "Use CONCRETE nouns (Altar, River, Mountain) over abstractions",
      "Chronology is king - mixing up order means failure",
      "The goal is MEMORABLE, not comprehensive",
      "If you need more than 7 beats, you're covering too much"
    ],
    examples: [
      "Genesis 37 (Joseph): Dream → Coat → Pit → Caravan → Egypt → Potiphar",
      "Exodus 14 (Red Sea): Trapped → Fear → 'Stand Still' → Staff → Waters Part → Crossing → Egypt Drowns",
      "Daniel 3: Idol Built → Bow or Burn → Three Refuse → Furnace Heated → Fourth Man → Untouched"
    ],
    pitfalls: [
      "Commentary before chronology",
      "Too many beats (10+)",
      "Using full sentences instead of punchy nouns/verbs",
      "Mixing up chronological order"
    ],
    deliverable: "Beat list (3-7 beats with arrows) + one-line plot summary"
  },

  IR: {
    code: "IR",
    name: "Imagination Room",
    floor: 1,
    icon: "Eye",
    purpose: "Experience Scripture with all five senses. Step inside the story as if you were there - not fantasy, but sanctified empathy.",
    action: "Immerse yourself in a biblical scene using sight, sound, touch, smell, and taste.",
    output: "A sensory paragraph describing your experience + one sentence of personal resonance.",
    coreQuestion: "What do you see, hear, feel, smell, and taste in this passage?",
    method: "Place yourself among the Israelites at the Red Sea, feeling sand beneath your feet, hearing the roar of water, seeing fish swim in walls of water.",
    keyPrinciples: [
      "Immersion anchors stories in emotional memory, not just intellectual recall",
      "Like jurors re-enacting scenes to feel their weight",
      "Not fantasy - empathy sanctified by the Spirit",
      "Memory becomes participation, not abstract recall"
    ],
    examples: [
      "Red Sea: Wind whipping your face, roar of water held back, salt spray on lips, towering walls on sides",
      "Gethsemane: Crushing weight on chest, cool night air, taste of copper fear, rough olive bark, distant soldiers' footsteps",
      "Pentecost: Flame resting on your head, speaking a new language, astonishment in the crowd"
    ],
    pitfalls: [
      "Speculation beyond text",
      "Melodrama",
      "Adding details Scripture doesn't give",
      "Making it about your creativity instead of the text's reality"
    ],
    deliverable: "Short sensory paragraph + one sentence of personal resonance"
  },

  "24F": {
    code: "24F",
    name: "24FPS Room",
    floor: 1,
    icon: "Film",
    purpose: "Create a visual GPS for the Bible - one memorable image per chapter for instant retrieval. Like a movie made of 24 frames per second.",
    action: "For each chapter, identify the MOST MEMORABLE element and convert it into a single, quirky visual image.",
    output: "A chapter-to-image index (e.g., 'Gen 1 = Birthday Cake Earth').",
    coreQuestion: "What image will make this chapter unforgettably findable?",
    method: "Genesis becomes 50 frames; Exodus, 40; Psalms, 150. Each frame is a strange, memorable image tied to the chapter.",
    keyPrinciples: [
      "Prioritize MEMORABLE over accurate",
      "Use concrete objects over abstract concepts (Knife > Faith)",
      "Quirky beats theological",
      "The image should be VISUAL - you should be able to draw it",
      "One image per chapter - don't try to capture everything"
    ],
    examples: [
      "Genesis 1 = Birthday Cake with 'Earth' written on it (Creation is Earth's birthday)",
      "Genesis 3 = Snake coiled around apple with ticking clock (Fall, time begins)",
      "Genesis 22 = Knife suspended over an altar (Abraham's test)",
      "Exodus 12 = Blood-painted door (Passover)"
    ],
    pitfalls: [
      "Using descriptive titles instead of IMAGES",
      "Making images too complex",
      "Trying to be theologically comprehensive",
      "Abstract images that you can't visualize"
    ],
    deliverable: "Chapter → Image table for the book being studied"
  },

  BR: {
    code: "BR",
    name: "Bible Rendered Room",
    floor: 1,
    icon: "Layers",
    purpose: "See the entire Bible at a glance - compress all 1,189 chapters into ~51 symbolic glyphs (one per 24-chapter block).",
    action: "Read a 24-chapter block, identify its central movement, and assign ONE simple symbolic glyph.",
    output: "A 51-frame legend mapping each 24-chapter block to its glyph with brief explanation.",
    coreQuestion: "What single symbol captures this 24-chapter block's essence?",
    method: "Genesis 1-24 = '/' (division: light/dark, land/sea, male/female). Genesis 25-50 = '×' (multiplication: 12 tribes).",
    keyPrinciples: [
      "Simplicity is power - complex glyphs defeat the purpose",
      "The glyph is a COMPRESSION tool, not comprehensive summary",
      "What matters is that YOURS works for YOU",
      "Once chosen, stick with it - consistency builds memory"
    ],
    examples: [
      "Genesis 1-24 = '/' (divisions emerge)",
      "Genesis 25-50 = 'SEED' (Patriarchs - promise carried through Abraham's line)",
      "Exodus 1-24 = '↑' (Ascent from slavery to Sinai covenant)",
      "Revelation 1-22 = '○+' (Completed circle - Eden restored and escalated)"
    ],
    pitfalls: [
      "Over-explaining the glyph",
      "Using more than 1 glyph per block",
      "Choosing glyphs too obscure to remember",
      "Changing your glyph system midstream"
    ],
    deliverable: "51-frame legend (Block range → Glyph → Brief explanation)"
  },

  TR: {
    code: "TR",
    name: "Translation Room",
    floor: 1,
    icon: "Image",
    purpose: "Convert words into pictures. Turn abstract concepts into concrete visual representations that stick in memory 6x better.",
    action: "Translate verses into icons, passages into 3-panel comics, or books into murals.",
    output: "Sketches or detailed descriptions of visual translations, labeled with verse references.",
    coreQuestion: "How can I translate this text into a visual storyline?",
    method: "Level 1: Verse → Icon. Level 2: Pericope → 3-Panel Comic. Level 3: Book → Mural.",
    keyPrinciples: [
      "Concrete beats abstract (Lamp > Truth, Vine > Relationship)",
      "Simplicity beats complexity",
      "Respect biblical metaphors - translate WHAT'S THERE",
      "Bad art is fine - memorability matters more than beauty"
    ],
    examples: [
      "Psalm 119:105 → Glowing scroll unrolled on a dark path",
      "John 15:1-8 → Vine trunk with branch-sockets, some green with grapes, others broken",
      "Prodigal Son → 3 panels: Son leaving, Son in pig pen, Father running"
    ],
    pitfalls: [
      "Keeping text abstract instead of pushing toward concrete visuals",
      "Mixing metaphors mid-scene",
      "Over-complicating the image",
      "Ignoring the biblical metaphor and inventing your own"
    ],
    deliverable: "Sketches or written descriptions with verse references"
  },

  GR: {
    code: "GR",
    name: "Gems Room",
    floor: 1,
    icon: "Gem",
    purpose: "Mine Scripture for rare truths by combining 2-4 unrelated texts until they illuminate each other with stunning clarity.",
    action: "Place 2-4 verses from different contexts side by side and identify the profound truth that emerges.",
    output: "Gem card with combined texts, the rare truth discovered, and practical use-case.",
    coreQuestion: "What beautiful truth emerges when I combine these seemingly unrelated texts?",
    method: "Take 2-4 verses from different books/contexts. Place them side by side. Identify the rare truth that emerges.",
    keyPrinciples: [
      "The result should be anchored in multiple clear texts",
      "Reveals something profound most readers miss",
      "Has practical application for preaching/teaching",
      "Each gem is a building block for later study"
    ],
    examples: [
      "Ex 12 (Passover at twilight) + Jn 19:14 → Jesus died at exact moment Passover lambs were slain",
      "Rahab's scarlet cord (Josh 2:18) + Passover blood on doorposts (Ex 12:13) → red marks of salvation",
      "Jesus fed 5,000 with 12 baskets left (for Israel) and 4,000 with 7 baskets (for nations)"
    ],
    pitfalls: [
      "Forced connections",
      "Trivia instead of theology",
      "Gem without clear text anchors"
    ],
    deliverable: "Gem card: Combined texts + rare truth + use-case"
  },

  // ========== FLOOR 2: INVESTIGATION ==========
  OR: {
    code: "OR",
    name: "Observation Room",
    floor: 2,
    icon: "Search",
    purpose: "Become a biblical detective. Gather raw data before interpretation - see what's actually on the page.",
    action: "Make 20-50 bullet-point observations. Start with WHAT IS HAPPENING (numbers, people, actions), then patterns.",
    output: "Observation sheet with 20-50 numbered bullet points.",
    coreQuestion: "As a detective, observe as much as you can. Start with WHAT IS HAPPENING.",
    method: "Log details without rushing to meaning. A detective doesn't start with theories - he starts with fingerprints.",
    keyPrinciples: [
      "Start with counting and listing",
      "If you interpret before observing, you'll miss crucial data",
      "Obvious observations count",
      "Quantity reveals quality - the 23rd observation often unlocks the passage",
      "Ask 'What's on the page?' not 'What does it mean?'"
    ],
    examples: [
      "Matt 25:1-4: 10 virgins total, 5 foolish + 5 wise = 50/50 split, All 10 have lamps, 1 bridegroom",
      "Luke 15:20: 5 actions by father (saw, filled, ran, threw arms, kissed), 0 actions by son (passive)"
    ],
    pitfalls: [
      "Skipping factual details",
      "Slipping into interpretation",
      "Stopping too early (fewer than 20 observations)",
      "Only observing 'theological' details"
    ],
    deliverable: "Observation sheet with 20-50 numbered bullet points"
  },

  DC: {
    code: "DC",
    name: "Def-Com Room",
    floor: 2,
    icon: "BookOpen",
    purpose: "Define key terms in original language and consult trusted commentaries. Stand on giants' shoulders while keeping feet in the text.",
    action: "Define 3-5 key terms using lexicons, note 1-2 cultural details, excerpt 2-3 trusted commentaries.",
    output: "Wordlist with definitions + cultural notes + commentary excerpts + synthesis paragraph.",
    coreQuestion: "What definitions and cultural context illuminate this text?",
    method: "Like a forensic lab. Words and contexts are tested under the microscope.",
    keyPrinciples: [
      "Original language > English translation when meanings diverge",
      "Commentaries inform but don't replace Scripture",
      "Cultural background illuminates but doesn't determine meaning",
      "Compare multiple commentaries"
    ],
    examples: [
      "John 21:15-17: agapao vs phileo - Jesus asks Peter with divine love, Peter responds with friendship love",
      "Rev 3:18: Laodicea was famous for eye-salve - Christ's offer is surgical irony"
    ],
    pitfalls: [
      "Letting commentary overrule clear Scripture",
      "Ignoring original language",
      "Reading modern English meaning into ancient words",
      "Using only one commentary"
    ],
    deliverable: "Wordlist + Cultural notes + Commentary excerpts + Synthesis"
  },

  ST: {
    code: "ST",
    name: "Symbols/Types Room",
    floor: 2,
    icon: "Shapes",
    purpose: "Build God's symbol dictionary. Track consistent imagery (Lamb, Rock, Light) through Scripture and see how it points to Christ.",
    action: "Trace a symbol's SCOPE (5-10 texts), define its SIGN (meaning), and show Christ-LOCUS (fulfillment).",
    output: "Reusable symbol cards showing: Symbol → Scope → Sign → Christ-locus.",
    coreQuestion: "What is this symbol's consistent biblical meaning and how does it find fulfillment in Christ?",
    method: "Every detective builds a profile. Note patterns of behavior that repeat across 'crimes.'",
    keyPrinciples: [
      "Let Scripture define symbols - not your imagination",
      "Symbols are CONSISTENT across the canon",
      "Multiple texts create biblical vocabulary",
      "Christ is the ultimate reality behind every type and symbol"
    ],
    examples: [
      "LAMB: Gen 22:8, Ex 12, Isa 53:7, Jn 1:29, Rev 5:6 → Substitutionary sacrifice → Christ is the Lamb of God",
      "ROCK: Ex 17:6, Deut 32:4, Ps 18:2, 1 Cor 10:4 → Immovable foundation → Christ is the Rock struck for us"
    ],
    pitfalls: [
      "Free-associating symbols without biblical warrant",
      "Ignoring canonical usage",
      "Missing Christ connections",
      "Allegorizing everything"
    ],
    deliverable: "Symbol cards: Symbol → Scope (5-10 texts) → Sign → Christ-locus"
  },

  QR: {
    code: "QR",
    name: "Questions Room",
    floor: 2,
    icon: "HelpCircle",
    purpose: "Generate 50-100 precision questions about any text. Quality of understanding equals quality of questions.",
    action: "Generate 50-100 questions in 3 categories: INTRA (inside passage), INTER (across Scripture), PALACE (PT framework).",
    output: "Three lists totaling 50-100 questions that expose hidden meaning.",
    coreQuestion: "What must be asked inside the text (INTRA), across texts (INTER), and through the Palace framework (PALACE)?",
    method: "The Questions Room is where interrogation happens. Detectives solve cases by asking relentless questions.",
    keyPrinciples: [
      "Quantity drives quality - push to 50-100 questions",
      "Write questions in your own words",
      "Good questions expose what you DON'T know",
      "Questions should be SPECIFIC, not vague"
    ],
    examples: [
      "INTRA: Why does John use shortest verb form in 'Jesus wept'?",
      "INTER: How does Jesus' weeping compare to His weeping over Jerusalem (Luke 19)?",
      "PALACE: Does this fit @CyC cycle's 'Fall' element (sharing human suffering)?"
    ],
    pitfalls: [
      "Stopping at surface-level questions",
      "Asking leading questions that assume the answer",
      "Generating fewer than 50 questions",
      "Only asking INTRA questions"
    ],
    deliverable: "Question map with three columns: INTRA | INTER | PALACE"
  },

  QA: {
    code: "QA",
    name: "Q&A Chains Room",
    floor: 2,
    icon: "Link",
    purpose: "Let Scripture interpret Scripture. Answer Questions Room inquiries by finding 2-4 biblical cross-references.",
    action: "Select 5-10 questions from QR, find 2-4 Scripture references per question, then synthesize.",
    output: "Answer chains: Question → 2-4 References → Synthesis.",
    coreQuestion: "Where does the Bible itself supply the answer?",
    method: "The courtroom where witnesses corroborate. Scripture is its own best witness; verses answer verses.",
    keyPrinciples: [
      "Scripture interprets Scripture - Reformation principle",
      "Quality of references matters: Clear texts > obscure texts",
      "Synthesis must be GROUNDED in cited texts",
      "Use NT to clarify OT, but don't flatten OT into NT"
    ],
    examples: [
      "Why did father run to prodigal? → Ps 103:13, Isa 49:15, Ezek 33:11 → Divine compassion cannot passively wait"
    ],
    pitfalls: [
      "Proof-texting out of context",
      "Weak synthesis",
      "Using only 1 text instead of 2-4",
      "Eisegesis in synthesis"
    ],
    deliverable: "Answer chains: Question → References → Synthesis (5-10 chains)"
  },

  // ========== FLOOR 3: FREESTYLE ==========
  NF: {
    code: "NF",
    name: "Nature Freestyle Room",
    floor: 3,
    icon: "Leaf",
    purpose: "See God's invisible attributes in visible creation. Transform trees, storms, animals into living sermons.",
    action: "Observe a natural object closely, identify 1-2 key characteristics, find the biblical parallel.",
    output: "Natural Object → Verse → One-sentence lesson.",
    coreQuestion: "What does this natural object or phenomenon teach about God's Word?",
    method: "Jesus constantly used nature to teach (birds, lilies, seeds, sheep, vines).",
    keyPrinciples: [
      "Don't INVENT meanings - find what SCRIPTURE says",
      "The best NF lessons are simple enough for a child",
      "Nature lessons illuminate Scripture, not replace it",
      "Physical observation trains spiritual observation"
    ],
    examples: [
      "Oak tree's deep roots → Psalm 1:3 → Visible strength depends on invisible depth",
      "Seed must be buried to sprout → John 12:24 → Dying to self precedes fruitfulness"
    ],
    pitfalls: [
      "Forced analogies Scripture doesn't support",
      "Ignoring context",
      "Overly complex lessons",
      "Replacing Scripture with nature"
    ],
    deliverable: "NF log: Natural Object → Verse → One-Line Lesson"
  },

  PF: {
    code: "PF",
    name: "Personal Freestyle Room",
    floor: 3,
    icon: "User",
    purpose: "Turn your biography into theology. See God's authorship in your story by placing experiences alongside biblical narratives.",
    action: "Identify a significant life event, find a biblical parallel, extract the spiritual lesson.",
    output: "Event → Parallel Biblical Text → Lesson Learned → Potential testimony use.",
    coreQuestion: "Where is God writing biblical lessons in the events of my life?",
    method: "Like a hip hop artist who raps about his struggles and victories - your own story as teaching material.",
    keyPrinciples: [
      "Your story is not the main story - Scripture is",
      "PF is NOT navel-gazing - it's seeing your life in redemptive narrative",
      "Avoid MORALISM - look for GRACE patterns",
      "PF entries become your most powerful teaching material"
    ],
    examples: [
      "Lost job unexpectedly → Joseph in prison (Gen 39-40) → Divine positioning in seeming derailment",
      "Betrayed by close friend → David/Ahithophel, Jesus/Judas → Betrayal pattern leads to enthronement"
    ],
    pitfalls: [
      "Self-centeredness",
      "Moralizing others",
      "Forcing parallels",
      "Bitterness disguised as theology"
    ],
    deliverable: "PF journal: Event → Parallel Text → Lesson → Testimony Use"
  },

  BF: {
    code: "BF",
    name: "Bible Freestyle Room",
    floor: 3,
    icon: "Network",
    purpose: "Every verse is related to every other verse - siblings, cousins, distant relatives. Train to see these connections instantly.",
    action: "Select any two verses, discover their genetic connection - how are they family?",
    output: "Verse Pair → Connection Type (Sibling/Cousin/Distant) → Explanation of theological DNA link.",
    coreQuestion: "How are these two verses related? Every verse is connected - find the family link!",
    method: "Think of Scripture as a massive family tree. No verse is an only child.",
    keyPrinciples: [
      "There are NO unrelated verses",
      "Word links ARE valid when concepts also align",
      "Distant connections are still connections",
      "Every connection reveals Christ as the thread holding all Scripture"
    ],
    examples: [
      "Lev 13:45 'Unclean' ↔ Isa 6:5 'I am undone' → Both reveal approaching Holy requires acknowledging corruption",
      "Gen 28:12 (Jacob's ladder) ↔ Jn 2:19 (temple) → Christ IS the ladder AND the temple - meeting place between heaven/earth"
    ],
    pitfalls: [
      "Giving up too fast - EVERY verse is connected",
      "Surface-level answers like 'Both are about God'",
      "Missing Christ as the deepest connection",
      "Not practicing speed"
    ],
    deliverable: "Verse Genetics Map: Two Verses → Relationship Type → Shared DNA"
  },

  HF: {
    code: "HF",
    name: "History/Social Freestyle Room",
    floor: 3,
    icon: "Globe",
    purpose: "See lessons in secular history and current events. Let the Bible interpret the world around you.",
    action: "Connect historical or current events to biblical patterns and principles.",
    output: "Historical Event → Biblical Parallel → Lesson for Today.",
    coreQuestion: "How does biblical truth interpret this historical or current event?",
    method: "Like a rapper who riffs on today's headlines - use events of the world as teaching points.",
    keyPrinciples: [
      "History, culture, and technology all become object lessons",
      "Nothing is random - all points back to Scripture",
      "Prophetic patterns repeat in history",
      "Current events illuminate biblical principles"
    ],
    examples: [
      "Printing press → God's providence for spreading truth globally",
      "Social media uniting world → Spirit of Babel: one voice, one language, global ambition"
    ],
    pitfalls: [
      "Reading too much into events",
      "Conspiracy theories replacing Scripture",
      "Ignoring historical context",
      "Making predictions Scripture doesn't make"
    ],
    deliverable: "HF log: Event → Biblical Parallel → Lesson"
  },

  LR: {
    code: "LR",
    name: "Listening Room",
    floor: 3,
    icon: "Headphones",
    purpose: "Learn to listen to sermons, testimonies, conversations, then instantly turn them into Scripture connections.",
    action: "Listen carefully, identify biblical connections, respond with Scripture-grounded insight.",
    output: "What I Heard → Scripture Connection → Application.",
    coreQuestion: "What biblical truth does this remind me of?",
    method: "Like a freestyle MC listening to another rapper's bar and instantly replying with his own.",
    keyPrinciples: [
      "Freestyle is not only about speaking - it's about hearing",
      "Become agile and responsive",
      "Use conversations as springboards for Scripture",
      "The more stored in memory, the faster the connections"
    ],
    examples: [
      "Friend shares healing → James 5:16 'the prayer of faith shall save the sick'",
      "Preacher quotes Rev 3 → Connect Laodicea's lukewarmness to today's complacency"
    ],
    pitfalls: [
      "Not actually listening - just waiting to speak",
      "Forced connections that don't fit",
      "Ignoring the speaker's actual point",
      "Making it about showing off knowledge"
    ],
    deliverable: "Listening log: What I Heard → Connection → Application"
  },

  // ========== FLOOR 4: NEXT LEVEL ==========
  CR: {
    code: "CR",
    name: "Concentration Room",
    floor: 4,
    icon: "Focus",
    purpose: "Every text or story must reveal Christ. Like a magnifying glass bending light until Christ comes into focus.",
    action: "Read any text and identify how Christ is revealed - as type, antitype, prophecy, or principle.",
    output: "Text → How Christ is Revealed → Supporting References.",
    coreQuestion: "Where is Christ in this text?",
    method: "No matter how ordinary the verse looks, the glass bends the light until Christ comes into focus.",
    keyPrinciples: [
      "Without this lens, Bible study collapses into moral lessons",
      "Christ is the center - John 5:39 'These are they which testify of me'",
      "Every Old Testament text points forward",
      "Every New Testament text points back and forward"
    ],
    examples: [
      "Exodus → Christ is the Deliverer and Passover Lamb",
      "Psalms → Christ is the Singer and the Song",
      "Daniel → Christ is the Son of Man, Judge, and Rock cut without hands"
    ],
    pitfalls: [
      "Forcing Christ where He isn't (allegorizing everything)",
      "Missing obvious Christ connections",
      "Settling for moral lessons instead of Christ",
      "Skipping to application without Christ"
    ],
    deliverable: "Christ connection for the studied text"
  },

  DR: {
    code: "DR",
    name: "Dimensions Room",
    floor: 4,
    icon: "Boxes",
    purpose: "Stretch every passage across five dimensions: Literal, Christ, Me, Church, Heaven.",
    action: "Take one text and interpret it through all five dimensional lenses.",
    output: "Five-dimension analysis of the passage.",
    coreQuestion: "How does this text apply at each dimension?",
    method: "Like looking at a diamond under five different lights. Each cut reflects a unique sparkle.",
    keyPrinciples: [
      "Every text has layers of meaning",
      "Start with Literal, build up to Heaven",
      "No dimension should be skipped",
      "All dimensions should harmonize"
    ],
    examples: [
      "Exodus 12: Literal (lamb's blood protects), Christ (He is the Passover), Me (apply by faith), Church (preserved by sacrifice), Heaven (foreshadows eternal deliverance)"
    ],
    pitfalls: [
      "Only seeing one dimension",
      "Making dimensions contradict each other",
      "Spiritualizing away the literal",
      "Missing personal application"
    ],
    deliverable: "5-dimension breakdown for the studied text"
  },

  C6: {
    code: "C6",
    name: "Connect 6 Room",
    floor: 4,
    icon: "Hexagon",
    purpose: "Take one text and connect with all 6 biblical genres. Or take accounts from each genre and connect them.",
    action: "Connect your text to Prophecy, Poetry, History, Gospels, Epistles, and Parables.",
    output: "Six-genre connection map.",
    coreQuestion: "How does this text connect to each of the six biblical genres?",
    method: "A freestyle exercise connecting one truth across all major biblical forms.",
    keyPrinciples: [
      "Each genre has its own hermeneutic",
      "Prophecy uses symbols, codes, numbers",
      "Poetry uses metaphor, rhythm, parallelism",
      "History tells events with theological undertones",
      "Gospels focus on Christ's life",
      "Epistles offer logical argument and doctrine",
      "Parables are simple stories with hidden depth"
    ],
    examples: [
      "Salvation: Prophecy (Isa 53), Poetry (Ps 22), History (Exodus), Gospel (John 3), Epistle (Rom 5), Parable (Lost Sheep)"
    ],
    pitfalls: [
      "Ignoring genre differences",
      "Forcing connections that don't exist",
      "Reading parables as history",
      "Reading poetry as literal prophecy"
    ],
    deliverable: "Connect 6 map for the studied topic"
  },

  TRm: {
    code: "TRm",
    name: "Theme Room",
    floor: 4,
    icon: "Layout",
    purpose: "Study any text against the backdrop of one of the six great themes: 4 walls, 1 floor, 1 ceiling.",
    action: "Identify which theme wall/floor/ceiling illuminates your text.",
    output: "Text → Theme Connection → Insight.",
    coreQuestion: "Which of the six themes does this text connect to?",
    method: "The room has 4 walls, 1 floor, and 1 ceiling - each representing a major biblical theme.",
    keyPrinciples: [
      "Sanctuary Wall - sanctuary system connections",
      "Life of Christ Wall - incarnation, ministry, death, resurrection",
      "Great Controversy Wall - cosmic battle between Christ and Satan",
      "Time Prophecy Wall - prophetic timelines",
      "Gospel Floor - the base: justification, sanctification, glorification",
      "Heaven Ceiling - final hope: new creation, eternal life, God's presence"
    ],
    examples: [
      "Exodus 12 → Sanctuary Wall (sacrifice), Life of Christ Wall (Calvary), Gospel Floor (atonement)"
    ],
    pitfalls: [
      "Ignoring the theme connections",
      "Only seeing one theme",
      "Missing the sanctuary pattern",
      "Disconnecting from Great Controversy"
    ],
    deliverable: "Theme connection analysis"
  },

  TZ: {
    code: "TZ",
    name: "Time Zone Room",
    floor: 4,
    icon: "Clock",
    purpose: "Locate passages across 6 time zones: Heaven/Earth × Past/Present/Future.",
    action: "Identify which of the 6 time zones your text relates to.",
    output: "Text → Time Zone Location → Significance.",
    coreQuestion: "Where does this text fall in the 6 time zones?",
    method: "Like tracking flights on a radar screen. Each verse is either landed, in-flight, or scheduled.",
    keyPrinciples: [
      "Heaven-Past: What happened in heaven before",
      "Heaven-Present: What is happening in heaven now",
      "Heaven-Future: What will happen in heaven",
      "Earth-Past: Historical events",
      "Earth-Present: Current application",
      "Earth-Future: Yet to be fulfilled"
    ],
    examples: [
      "Rev 4-5: Heaven-Present (Christ's current ministry)",
      "Gen 1: Earth-Past (creation), but also Heaven-Past (angels present)"
    ],
    pitfalls: [
      "Confusing past with present fulfillment",
      "Projecting future into wrong era",
      "Ignoring heavenly dimension",
      "Flattening time zones"
    ],
    deliverable: "Time zone location for studied text"
  },

  PRm: {
    code: "PRm",
    name: "Patterns Room",
    floor: 4,
    icon: "Grid",
    purpose: "Recognize God's repeating structural blueprints - a divine course repeated across Scripture.",
    action: "Identify recurring patterns that repeat with variation, like riffs in a symphony.",
    output: "Pattern identification with multiple witnesses and progression.",
    coreQuestion: "What recurring structure does God use here?",
    method: "A Pattern is not just 'this is like that' - it's 'this follows that, which follows that, in the same way every time.'",
    keyPrinciples: [
      "Sequential Progression: Patterns follow a logical order",
      "Multiple Witnesses: Appears across different contexts",
      "Reveals the Whole Story: Maps the journey from beginning to end",
      "The Pattern is a Course: Like a river from source to sea"
    ],
    examples: [
      "Waters Pattern: Eden → Nile → Red Sea → Jordan → Cherith → Galilee → Kidron → River of Life",
      "OT Offices: Prophet (earthly) → Priest (ascension) → Judge (1844) → King (Second Coming)"
    ],
    pitfalls: [
      "Confusing parallel with pattern",
      "Missing the sequential progression",
      "Not finding multiple witnesses",
      "Ignoring the redemptive course"
    ],
    deliverable: "Pattern map with progression and witnesses"
  },

  "P||": {
    code: "P||",
    name: "Parallels Room",
    floor: 4,
    icon: "Columns",
    purpose: "See mirrored actions across time. Unlike types (objects), parallels show how events or actions reflect each other.",
    action: "Identify two events that mirror each other with escalation.",
    output: "Event A → Event B → Echoes → Escalation → Lesson.",
    coreQuestion: "What mirrored actions do you see across Scripture?",
    method: "Like standing between two mirrors facing each other. Reflections multiply across generations.",
    keyPrinciples: [
      "Parallels deal with mirrored ACTIONS, not objects",
      "Look for escalation from OT to NT",
      "The second event often completes or reverses the first",
      "Parallels enrich Christ-focused interpretation"
    ],
    examples: [
      "Babel (languages divided) || Pentecost (languages united)",
      "Israel leaving Egypt → Israel leaving Babylon",
      "Jesus fasting 40 days || Israel wandering 40 years"
    ],
    pitfalls: [
      "Confusing types with parallels",
      "Missing the escalation",
      "Forcing parallels that don't exist",
      "Ignoring the lesson"
    ],
    deliverable: "Parallel analysis: Event A || Event B → Echoes → Escalation"
  },

  FRt: {
    code: "FRt",
    name: "Fruit Room",
    floor: 4,
    icon: "Apple",
    purpose: "Test interpretation by its fruit. What spiritual fruit does this text or interpretation reveal/produce?",
    action: "Connect text to the fruit of the Spirit and test interpretation against character transformation.",
    output: "Text → Fruit Connection → Character Application.",
    coreQuestion: "What fruit does this text reveal or connect to? Does this interpretation produce Christlike character?",
    method: "Every interpretation must pass the fruit test - Galatians 5:22-23.",
    keyPrinciples: [
      "If interpretation produces arrogance, despair, or hostility, it is false",
      "If it grows love, joy, peace, patience, kindness, goodness, faith, meekness, temperance, it is safe",
      "Truth should transform, not just inform",
      "Christlike character is the goal"
    ],
    examples: [
      "Prophecy study → Should produce patience and hope, not fear",
      "Law study → Should produce love for God and neighbor, not pride"
    ],
    pitfalls: [
      "Knowledge without transformation",
      "Correct doctrine with wrong spirit",
      "Missing personal application",
      "Using truth as weapon instead of healing"
    ],
    deliverable: "Fruit test analysis of interpretation"
  },

  CEC: {
    code: "CEC",
    name: "Christ in Every Chapter",
    floor: 4,
    icon: "BookOpen",
    purpose: "Every chapter must name and trace the line to Christ. You do not move on until the chapter's Christ-thread is explicit.",
    action: "Read a chapter and explicitly identify the Christ connection before moving on.",
    output: "Chapter → Christ Connection → Evidence.",
    coreQuestion: "How is Christ revealed in this specific chapter?",
    method: "Fidelity: you do not move on until the chapter's Christ-thread is explicit, anchored, and confessed.",
    keyPrinciples: [
      "Every chapter has a Christ thread",
      "Don't move on until you find it",
      "Make it explicit and anchored",
      "Confess the connection"
    ],
    examples: [
      "Genesis 1 → Christ as the Word through whom all was made",
      "Exodus 12 → Christ as the Passover Lamb",
      "Psalm 22 → Christ's crucifixion foretold"
    ],
    pitfalls: [
      "Skipping chapters without Christ connection",
      "Settling for vague connections",
      "Not anchoring in specific verses",
      "Moving on too quickly"
    ],
    deliverable: "Christ connection for each chapter studied"
  },

  R66: {
    code: "R66",
    name: "Route 66 Room",
    floor: 4,
    icon: "Route",
    purpose: "One theme must be traced through all 66 books with a crisp claim per book. Integrity at scale.",
    action: "Choose a theme and trace it through every book of the Bible.",
    output: "Theme → 66 Book Connections (one per book).",
    coreQuestion: "How does this theme appear in each of the 66 books?",
    method: "Theology that cannot walk Genesis to Revelation in clear steps is not ready for the pulpit.",
    keyPrinciples: [
      "Every theme should be traceable through all 66 books",
      "One crisp claim per book",
      "Integrity at scale tests your understanding",
      "The theme should be consistent yet developing"
    ],
    examples: [
      "The Lamb: Gen (God will provide), Ex (Passover), Lev (offerings)... Rev (Lamb on throne)",
      "The Kingdom: Gen (dominion), Ex (kingdom of priests)... Rev (kingdoms become Lord's)"
    ],
    pitfalls: [
      "Forcing theme where it doesn't fit",
      "Vague connections",
      "Skipping difficult books",
      "Inconsistent theme definition"
    ],
    deliverable: "66-book theme map"
  },

  // ========== FLOOR 5: VISION ==========
  BL: {
    code: "BL",
    name: "Blue Room (Sanctuary)",
    floor: 5,
    icon: "Building",
    purpose: "The architectural blueprint of salvation. Trace texts and doctrines back to sanctuary furniture and services.",
    action: "Connect your text to sanctuary elements: Gate, Altar, Laver, Lampstand, Bread, Incense, Veil, Ark.",
    output: "Text → Sanctuary Element → Christ Fulfillment.",
    coreQuestion: "How does this text connect to the sanctuary pattern?",
    method: "God told Moses to 'make all things according to the pattern' (Heb 8:5). The sanctuary is the map of salvation.",
    keyPrinciples: [
      "Altar of Burnt Offering = the cross",
      "Laver = baptism and cleansing",
      "Lampstand = light of the Spirit",
      "Table of Showbread = Word of God",
      "Altar of Incense = intercession",
      "Ark of the Covenant = law, mercy seat, God's throne",
      "Veil = Christ's flesh (Heb 10:20)",
      "Gate = Christ the Way"
    ],
    examples: [
      "John 6 (Bread of Life) → Table of Showbread → Christ as the Word that sustains",
      "Heb 10:19-22 → Veil torn → Access through Christ's body"
    ],
    pitfalls: [
      "Ignoring sanctuary connections",
      "Forcing elements that don't fit",
      "Missing the Christ fulfillment",
      "Treating sanctuary as mere history"
    ],
    deliverable: "Sanctuary connection analysis"
  },

  PR: {
    code: "PR",
    name: "Prophecy Room",
    floor: 5,
    icon: "Telescope",
    purpose: "Line up the stars of Daniel and Revelation and see their constellations. Master the historicist method.",
    action: "Map prophetic timelines and identify fulfillment patterns.",
    output: "Prophecy → Timeline → Fulfillment.",
    coreQuestion: "How does this prophecy fit the historicist timeline?",
    method: "Like astronomy. Each star (prophecy) looks isolated, but through the prophetic telescope they form constellations.",
    keyPrinciples: [
      "Daniel 2 = statue of empires",
      "Daniel 7 = beasts of kingdoms",
      "Daniel 8-9 = sanctuary and 2300 days",
      "Revelation 13 = beast, image, mark",
      "Revelation 14 = three angels",
      "Historicist method: prophecy fulfilled progressively from prophet's time to end"
    ],
    examples: [
      "Daniel 2 statue: Babylon → Medo-Persia → Greece → Rome → Divided Europe → God's Kingdom",
      "2300 days (Dan 8:14) → 1844 → Cleansing of heavenly sanctuary begins"
    ],
    pitfalls: [
      "Preterism (all fulfilled in past)",
      "Futurism (all in future)",
      "Date-setting beyond Scripture",
      "Missing progressive fulfillment"
    ],
    deliverable: "Prophecy timeline mapping"
  },

  "3A": {
    code: "3A",
    name: "Three Angels Room",
    floor: 5,
    icon: "Users",
    purpose: "Study the Three Angels' Messages (Rev 14:6-12) as the final gospel syllabus. The capstone of Phototheology.",
    action: "Connect your study to the three angels' messages - everlasting gospel, Babylon fallen, beast warning.",
    output: "Text → Three Angels Connection → Mission Application.",
    coreQuestion: "How does this text relate to the final gospel messages?",
    method: "All doctrines converge here: Sabbath, law, gospel, faith, prophecy, mission.",
    keyPrinciples: [
      "First Angel: Everlasting Gospel → Worship Creator → Judgment Hour",
      "Second Angel: Babylon is Fallen → False systems exposed",
      "Third Angel: Warning against beast, image, mark → Endurance of saints",
      "This is missional - preparing a people for Christ's return"
    ],
    examples: [
      "Sabbath → First Angel (worship Creator)",
      "Study of error → Second Angel (Babylon's fall)",
      "Revelation 13 → Third Angel (beast warning)"
    ],
    pitfalls: [
      "Fear-based presentation",
      "Missing the everlasting gospel foundation",
      "Treating as information, not transformation",
      "Forgetting the mission"
    ],
    deliverable: "Three Angels connection for studied text"
  },

  FR: {
    code: "FR",
    name: "Feasts Room",
    floor: 5,
    icon: "Calendar",
    purpose: "Connect texts and stories to the Feasts of Israel and their prophetic fulfillments.",
    action: "Identify which feast your text correlates with and trace its fulfillment.",
    output: "Text → Feast Connection → Christ Fulfillment.",
    coreQuestion: "Which feast does this text or story correlate with?",
    method: "The feasts are prophetic appointments - spring feasts fulfilled at First Coming, fall feasts at Second.",
    keyPrinciples: [
      "Passover → Christ's death",
      "Unleavened Bread → Christ's burial and sinless life",
      "Firstfruits → Christ's resurrection",
      "Pentecost → Holy Spirit poured out",
      "Trumpets → Warning, awakening, judgment announced",
      "Day of Atonement → Investigative judgment, cleansing",
      "Tabernacles → Second Coming, dwelling with God"
    ],
    examples: [
      "1 Cor 5:7 → Passover fulfilled in Christ our Passover",
      "Acts 2 → Pentecost fulfilled with Spirit outpouring",
      "Dan 8:14 → Day of Atonement, cleansing of sanctuary"
    ],
    pitfalls: [
      "Missing feast connections",
      "Confusing spring and fall feast fulfillments",
      "Ignoring prophetic timing",
      "Treating feasts as mere history"
    ],
    deliverable: "Feast connection analysis"
  },

  // ========== FLOOR 6: THREE HEAVENS ==========
  JR: {
    code: "JR",
    name: "Juice Room",
    floor: 6,
    icon: "Droplet",
    purpose: "Squeeze one book of the Bible with ALL Phototheology principles, extracting every drop of meaning.",
    action: "Run an entire book through every PT room and principle.",
    output: "Complete book analysis using all PT tools.",
    coreQuestion: "What do I get when I squeeze this book with every PT principle?",
    method: "Like putting an orange under a juicer. Twist and press until every drop comes out.",
    keyPrinciples: [
      "Use Story Room for narratives",
      "Apply Observation Room for details",
      "Translate in Translation Room",
      "Freestyle connections",
      "Concentration Room for Christ",
      "Theme & Time Zone for placement",
      "Map into Cycles and Heavens"
    ],
    examples: [
      "Jonah: Stories (fish, Nineveh), Christ (sign of Jonah), Cycles (@Mo pattern), Heaven (2H fulfillment)"
    ],
    pitfalls: [
      "Superficial squeezing",
      "Skipping rooms",
      "Not finding Christ",
      "Missing cycle placement"
    ],
    deliverable: "Complete book juice analysis"
  },

  // ========== FLOOR 7: SPIRITUAL/EMOTIONAL ==========
  FRm: {
    code: "FRm",
    name: "Fire Room",
    floor: 7,
    icon: "Flame",
    purpose: "Plunge into the emotional weight of Scripture. Let the text burn away apathy and ignite devotion.",
    action: "Enter the passage emotionally - feel the crushing weight, the joy, the terror, the peace.",
    output: "Emotional engagement record with Scripture passage.",
    coreQuestion: "What does this passage make me FEEL?",
    method: "You cannot remain neutral. The text burns away apathy and ignites devotion.",
    keyPrinciples: [
      "Gethsemane: feel the crushing loneliness",
      "Calvary: tremble at 'My God, why hast thou forsaken me?'",
      "Pentecost: feel the wind and fire shaking your soul",
      "Every true study should pass through fire"
    ],
    examples: [
      "Isaiah 53 → Feel the weight of 'a man of sorrows'",
      "Luke 15 → Feel the father's joy at son's return"
    ],
    pitfalls: [
      "Emotionalism without truth",
      "Avoiding emotional engagement",
      "Sentimentality replacing theology",
      "Manipulation instead of authentic encounter"
    ],
    deliverable: "Fire Room emotional engagement record"
  },

  MR: {
    code: "MR",
    name: "Meditation Room",
    floor: 7,
    icon: "Pause",
    purpose: "Slow down and marinate in truth. Meditation is not emptying the mind but saturating it with Scripture.",
    action: "Read slowly. Pause. Picture it. Pray it. Rest in it.",
    output: "Meditation notes on passage with personal prayers.",
    coreQuestion: "What happens when I slow down and let this text soak into my soul?",
    method: "Like slow cooking. A meal simmered for hours carries richer flavor than something microwaved.",
    keyPrinciples: [
      "Read slowly",
      "Pause after each phrase",
      "Picture what you read",
      "Pray the Scripture back to God",
      "Rest in the truth until it saturates you"
    ],
    examples: [
      "Psalm 23: 'The LORD is my shepherd' - pause, picture, pray, rest",
      "John 15: Imagine branches connected to vine, breathe the words"
    ],
    pitfalls: [
      "Rushing through",
      "Empty mind meditation",
      "Eastern mysticism instead of biblical meditation",
      "No actual encounter with God"
    ],
    deliverable: "Meditation journal entry"
  },

  SRm: {
    code: "SRm",
    name: "Speed Room",
    floor: 7,
    icon: "Zap",
    purpose: "Practice rapid application of PT principles. Build reflexes for quick ministry response.",
    action: "Flip through chapters quickly, making connections in seconds.",
    output: "Speed drill results showing quick connections made.",
    coreQuestion: "How fast can I make PT connections?",
    method: "Like sprint training for athletes. It builds reflexes.",
    keyPrinciples: [
      "Flip through Genesis 1-11 in 60 seconds",
      "Scan Gospels spotting Christ in parables, miracles, cross",
      "Rapid-fire map Revelation 12-14",
      "When asked a question, recall connections quickly"
    ],
    examples: [
      "Genesis 1-11: creation → fall → flood → Babel (60 seconds)",
      "Gospel of John: signs → I AM → cross → resurrection (2 minutes)"
    ],
    pitfalls: [
      "Speed without accuracy",
      "Shallow connections",
      "Missing the depth for speed",
      "Not practicing enough"
    ],
    deliverable: "Speed drill record"
  },

  // ========== FLOOR 8: MASTER ==========
  "∞": {
    code: "∞",
    name: "Reflexive Mastery",
    floor: 8,
    icon: "Infinity",
    purpose: "The palace is no longer outside of you - it is inside you. You no longer 'use rooms' - you just think Phototheologically.",
    action: "Teach and study without consciously using room labels. The method has become natural.",
    output: "Natural, reflexive Phototheological thinking and teaching.",
    coreQuestion: "Is PT now my natural way of thinking about Scripture?",
    method: "Like driving - you don't think about pedals and mirrors. Or like playing an instrument - scales were drills, now they flow.",
    keyPrinciples: [
      "You automatically recall story frames",
      "You naturally ask questions",
      "You reflexively place texts into cycles and heavens",
      "You automatically test meaning against fruit",
      "The palace is scaffolding - now you ARE the building"
    ],
    examples: [
      "Teaching a passage without naming rooms",
      "Conversation naturally weaves Scripture",
      "Questions and connections flow without effort"
    ],
    pitfalls: [
      "Pride in mastery",
      "Stopping growth",
      "Teaching method instead of Christ",
      "Forgetting dependence on Spirit"
    ],
    deliverable: "Living demonstration of reflexive PT"
  }
};

// ============================================================================
// SECTION IV: THE EIGHT CYCLES
// ============================================================================

export interface PTCycle {
  code: CycleCode;
  name: string;
  fullName: string;
  era: string;
  pattern: {
    fall: string;
    covenant: string;
    sanctuary: string;
    enemy: string;
    restoration: string;
  };
  analogy: string;
  keyTexts: string[];
}

export const ptCycles: Record<CycleCode, PTCycle> = {
  "@Ad": {
    code: "@Ad",
    name: "Adamic",
    fullName: "Adamic Cycle",
    era: "Eden to Flood",
    pattern: {
      fall: "Humanity rebels in Eden. Sin enters, exile begins.",
      covenant: "Genesis 3:15 - the seed promise. God assures a Deliverer.",
      sanctuary: "Skins cover shame; sacrifice instituted. Abel's offering points to substitution.",
      enemy: "The serpent continues his work; Cain murders Abel. The 'two seeds' theme is born.",
      restoration: "God raises Seth's line; worship continues."
    },
    analogy: "The pilot episode of the entire series. Every theme (fall, promise, blood, conflict, preservation) appears here first.",
    keyTexts: ["Genesis 3:15", "Genesis 4:4", "Genesis 5:3"]
  },
  "@No": {
    code: "@No",
    name: "Noahic",
    fullName: "Noahic Cycle",
    era: "Flood to Babel",
    pattern: {
      fall: "Violence fills the earth; imagination bent on evil (Gen 6:5, 11).",
      covenant: "God promises Noah salvation through an ark (Gen 6:18).",
      sanctuary: "The ark = floating temple. One door, one refuge, one family.",
      enemy: "Mockery, unbelief, then judgment waters.",
      restoration: "Rainbow covenant; new start with humanity."
    },
    analogy: "Like a reset button. The world is 'reformatted,' but sin still survives - showing external cleansing cannot solve the internal problem.",
    keyTexts: ["Genesis 6:18", "Genesis 9:9-17", "1 Peter 3:20-21"]
  },
  "@Ab": {
    code: "@Ab",
    name: "Abrahamic",
    fullName: "Abrahamic Cycle",
    era: "Call of Abraham to Egypt",
    pattern: {
      fall: "Nations scatter at Babel. Idolatry spreads.",
      covenant: "God calls Abram: 'I will bless all nations through you' (Gen 12:3).",
      sanctuary: "Altars everywhere Abram goes. Moriah reveals God will 'provide Himself a Lamb.'",
      enemy: "Pharaoh, famine, foreign kings, even Abraham's own impatience.",
      restoration: "Isaac's birth proves covenant rests on miracle, not human strength."
    },
    analogy: "Like choosing a main character. God narrows the focus to one family through whom the Seed will come.",
    keyTexts: ["Genesis 12:1-3", "Genesis 15:6", "Genesis 22:8"]
  },
  "@Mo": {
    code: "@Mo",
    name: "Mosaic",
    fullName: "Mosaic Cycle",
    era: "Exodus to Conquest",
    pattern: {
      fall: "Israel enslaved in Egypt; bondage as parable of sin.",
      covenant: "Exodus 6:7 - 'I will take you to me for a people.' Sinai covenant formalized.",
      sanctuary: "Tabernacle built, pattern of salvation established.",
      enemy: "Pharaoh's army, wilderness unbelief, hostile nations.",
      restoration: "Conquest of Canaan, sanctuary worship, covenant renewed."
    },
    analogy: "Like the launch of a nation-state - the covenant goes public, visible, and calendared.",
    keyTexts: ["Exodus 6:7", "Exodus 25:8", "Joshua 1:1-9"]
  },
  "@Cy": {
    code: "@Cy",
    name: "Cyrusic",
    fullName: "Cyrusic Cycle",
    era: "Exile to Restoration",
    pattern: {
      fall: "Babylon destroys temple; exile.",
      covenant: "Prophets promise return (Isaiah 44:28; Jeremiah 29:10). Cyrus named before birth.",
      sanctuary: "Altar rebuilt, temple foundations laid, worship restored.",
      enemy: "Opposition from locals, imperial decrees, spiritual compromise.",
      restoration: "Ezra and Nehemiah lead reforms, walls rebuilt, covenant renewed."
    },
    analogy: "The rebuilding season - the house of God is restored, but fragility remains.",
    keyTexts: ["Isaiah 44:28", "Jeremiah 29:10", "Ezra 1:1-4"]
  },
  "@CyC": {
    code: "@CyC",
    name: "Cyrus-Christ",
    fullName: "Cyrus-Christ Cycle",
    era: "Intertestamental to Cross",
    pattern: {
      fall: "Post-exilic nation still spiritually weak. Roman occupation looms.",
      covenant: "The true Anointed appears - Christ, the covenant embodied.",
      sanctuary: "Christ Himself is the temple (John 2:19). Cross = true altar. Resurrection = cornerstone.",
      enemy: "Herod, Caesar, Pharisees, Satan, sin, and death itself.",
      restoration: "Resurrection, ascension, heavenly ministry - true restoration of God's presence with man."
    },
    analogy: "The fulfillment arc - where type meets antitype, shadow meets substance.",
    keyTexts: ["John 2:19-21", "Hebrews 9:11-12", "Matthew 28:18"]
  },
  "@Sp": {
    code: "@Sp",
    name: "Spirit",
    fullName: "Holy Spirit Cycle",
    era: "Pentecost to Present",
    pattern: {
      fall: "Even after resurrection, disciples doubt, fear, and scatter.",
      covenant: "Promise of the Spirit: 'I will be with you always' (Matthew 28:20).",
      sanctuary: "Pentecost turns homes into micro-sanctuaries. Spirit lights the lampstand in every believer.",
      enemy: "Ananias' deceit, persecution, heresies, corruption, imperial pressure.",
      restoration: "Revivals, Reformation, missionary movements - Spirit-led renewal across ages."
    },
    analogy: "The spread arc - the message goes global, not by might, but by Spirit.",
    keyTexts: ["Acts 2:1-4", "Acts 1:8", "Revelation 2-3"]
  },
  "@Re": {
    code: "@Re",
    name: "Remnant",
    fullName: "Remnant Cycle",
    era: "End Times to Eternity",
    pattern: {
      fall: "Apostasy deepens; false worship rises; beast, image, and mark dominate.",
      covenant: "Revelation 12:17 - a commandment-keeping, Jesus-faithful remnant.",
      sanctuary: "Heavenly judgment in Most Holy Place (Daniel 8:14). Sanctuary explains the last conflict.",
      enemy: "Dragon, beast, false prophet - final confederacy against truth.",
      restoration: "Second Coming; God's people vindicated; new heaven and new earth."
    },
    analogy: "The final season - the climax where the great controversy ends and the Seed promise (Gen 3:15) is fully fulfilled.",
    keyTexts: ["Revelation 12:17", "Revelation 14:6-12", "Daniel 8:14"]
  }
};

// ============================================================================
// SECTION V: THE THREE HEAVENS (Day of the Lord Framework)
// ============================================================================

export interface PTHeaven {
  code: HeavenCode;
  name: string;
  dayOfLord: DayOfLordCode;
  newEarth: NewEarthCode;
  judgment: string;
  newOrder: string;
  cyclesEmphasis: string;
  studyMap: string[];
  description: string;
}

export const ptHeavens: Record<HeavenCode, PTHeaven> = {
  "1H": {
    code: "1H",
    name: "First Heaven",
    dayOfLord: "DoL1",
    newEarth: "NE1",
    judgment: "586 BC - Babylon destroys Jerusalem",
    newOrder: "Post-exilic restoration under Cyrus (Ezra-Nehemiah; Isaiah 65-66 typological NE)",
    cyclesEmphasis: "@Mo → @Cy",
    studyMap: ["Jeremiah", "Ezekiel (early)", "Isaiah 40-66", "Ezra-Nehemiah"],
    description: "The first Day of the LORD culminates in Jerusalem's destruction by Babylon, followed by the first 'new heavens and new earth' as post-exilic restoration. Here 'new heavens and new earth' is prophetic restoration language: a renewed civic-worship order, a reconstituted people, a rebuilt sanctuary/walls. It is real yet typological."
  },
  "2H": {
    code: "2H",
    name: "Second Heaven",
    dayOfLord: "DoL2",
    newEarth: "NE2",
    judgment: "70 AD - Rome destroys Jerusalem/Temple",
    newOrder: "New-Covenant order: church as temple; heavenly sanctuary (Hebrews 8-12)",
    cyclesEmphasis: "@CyC → @Sp",
    studyMap: ["Synoptics (Olivet)", "Acts", "Hebrews", "1 Peter", "Revelation 1-3"],
    description: "The second Day of the LORD is the destruction of Jerusalem/Temple in 70 AD. Its 'new heavens and new earth' is the New-Covenant/heavenly sanctuary order established by the risen Christ and poured out by the Holy Spirit - the church as a living temple, Christ ministering in the heavenly sanctuary."
  },
  "3H": {
    code: "3H",
    name: "Third Heaven",
    dayOfLord: "DoL3",
    newEarth: "NE3",
    judgment: "Final global judgment (2 Peter 3; Revelation 20)",
    newOrder: "Literal New Creation (Revelation 21-22)",
    cyclesEmphasis: "@Re",
    studyMap: ["2 Peter 3", "Revelation 19-22", "Isaiah 66 (ultimate horizon)"],
    description: "The third Day of the LORD is the final, universal judgment culminating in the literal New Heavens and New Earth. This is the ultimate, ontological re-creation: no temple because 'the Lord God Almighty and the Lamb are its temple'; no night, curse, death, or sea of separation."
  }
};

// ============================================================================
// SECTION VI: THE FIVE ASCENSIONS
// ============================================================================

export interface PTAscension {
  level: number;
  code: string;
  name: AscensionLevel;
  staticDescription: string;
  dynamicDescription: string;
  example: string;
}

export const ptAscensions: PTAscension[] = [
  {
    level: 1,
    code: "Asc-1",
    name: "text",
    staticDescription: "Study the word itself. Definitions, grammar, and lexical nuance.",
    dynamicDescription: "Pick any verse and zoom into its word-level details. See what unexpected gems appear.",
    example: "tetelestai in John 19:30 = 'paid in full'"
  },
  {
    level: 2,
    code: "Asc-2",
    name: "chapter",
    staticDescription: "Place the verse into its chapter storyline.",
    dynamicDescription: "Connect a verse into a different chapter elsewhere. New resonance emerges.",
    example: "John 19:30 within the crucifixion arc vs. next to Isaiah 53"
  },
  {
    level: 3,
    code: "Asc-3",
    name: "book",
    staticDescription: "Fit the chapter into the book's overarching theme.",
    dynamicDescription: "Place the chapter in another book's frame for fresh perspective.",
    example: "John's theme = 'that you may believe' (20:31)"
  },
  {
    level: 4,
    code: "Asc-4",
    name: "cycle",
    staticDescription: "Place the book within its covenant cycle (@Ad → @Re).",
    dynamicDescription: "Move the book into another cycle to test echoes.",
    example: "John belongs to @CyC (Cyrus-Christ) → climax of covenant fulfillment"
  },
  {
    level: 5,
    code: "Asc-5",
    name: "heaven",
    staticDescription: "Place the text in its correct Day-of-the-LORD horizon (1H, 2H, 3H).",
    dynamicDescription: "Let the verse travel upward into other heavens for analogy.",
    example: "John 19:30 = 2H (DoL2/NE2) — inauguration of the heavenly order"
  }
];

// ============================================================================
// SECTION VII: THE FOUR EXPANSIONS
// ============================================================================

export interface PTExpansion {
  type: ExpansionType;
  name: string;
  floors: FloorNumber[];
  description: string;
  analogy: string;
}

export const ptExpansions: Record<ExpansionType, PTExpansion> = {
  width: {
    type: "width",
    name: "Width Expansion",
    floors: [1, 2],
    description: "The horizontal spread of your study: raw material stocked into memory. Stories, frames, renderings, translations, gems, observations, definitions, symbols, questions.",
    analogy: "Like a library - without enough books, research is thin."
  },
  time: {
    type: "time",
    name: "Time Expansion",
    floors: [3],
    description: "Stretches Scripture through the entire day. Nature, personal life, history, and conversations become raw material for reflection.",
    analogy: "Like freestyle rap - you flow with whatever life throws at you."
  },
  depth: {
    type: "depth",
    name: "Depth Expansion",
    floors: [4, 5, 6],
    description: "Plunges beneath surface reading into theological and cosmic structure. Christ-centered interpretation, prophecy, sanctuary, cycles, and heavens.",
    analogy: "Like deep-sea diving - you see reefs, trenches, and shipwrecks that casual swimmers never touch."
  },
  height: {
    type: "height",
    name: "Height Expansion",
    floors: [7, 8],
    description: "Lifts study from intellect into experience and mastery. Fire, meditation, speed, and reflexive mastery.",
    analogy: "Like mountain climbing - at the peak, you don't just see the map, you see the world."
  }
};

// ============================================================================
// SECTION VIII: THEME ROOM WALLS/FLOOR/CEILING
// ============================================================================

export interface ThemeCategory {
  code: ThemeWall;
  name: string;
  type: "wall" | "floor" | "ceiling";
  description: string;
  keyTexts: string[];
  icon: string;
  color: string;
}

export const themeCategories: Record<ThemeWall, ThemeCategory> = {
  "sanctuary-wall": {
    code: "sanctuary-wall",
    name: "Sanctuary Wall",
    type: "wall",
    description: "Every text that connects to the sanctuary system - furniture, services, priesthood, feasts.",
    keyTexts: ["Exodus 25-40", "Leviticus 16", "Hebrews 8-10"],
    icon: "Building",
    color: "blue"
  },
  "life-of-christ-wall": {
    code: "life-of-christ-wall",
    name: "Life of Christ Wall",
    type: "wall",
    description: "Texts that anchor in Christ's incarnation, ministry, death, and resurrection.",
    keyTexts: ["Matthew-John", "Isaiah 53", "Philippians 2:5-11"],
    icon: "Cross",
    color: "red"
  },
  "great-controversy-wall": {
    code: "great-controversy-wall",
    name: "Great Controversy Wall",
    type: "wall",
    description: "Texts that reveal the cosmic battle between Christ and Satan.",
    keyTexts: ["Isaiah 14:12-15", "Ezekiel 28:12-19", "Revelation 12"],
    icon: "Swords",
    color: "purple"
  },
  "time-prophecy-wall": {
    code: "time-prophecy-wall",
    name: "Time Prophecy Wall",
    type: "wall",
    description: "Verses tied to prophetic timelines - 2300 days, 70 weeks, 1260 days, etc.",
    keyTexts: ["Daniel 8:14", "Daniel 9:24-27", "Revelation 11-13"],
    icon: "Clock",
    color: "amber"
  },
  "gospel-floor": {
    code: "gospel-floor",
    name: "Gospel Floor",
    type: "floor",
    description: "The base of all truth: justification, sanctification, glorification.",
    keyTexts: ["Romans 3-8", "Galatians 2:16-21", "Ephesians 2:8-10"],
    icon: "Heart",
    color: "green"
  },
  "heaven-ceiling": {
    code: "heaven-ceiling",
    name: "Heaven Ceiling",
    type: "ceiling",
    description: "The final hope: new creation, eternal life, God's presence forever.",
    keyTexts: ["Revelation 21-22", "1 Corinthians 15", "1 Thessalonians 4:16-17"],
    icon: "Cloud",
    color: "sky"
  }
};

// ============================================================================
// SECTION IX: TIME ZONES (6 total)
// ============================================================================

export interface TimeZoneInfo {
  code: TimeZone;
  name: string;
  realm: "heaven" | "earth";
  tense: "past" | "present" | "future";
  description: string;
  examples: string[];
}

export const timeZones: Record<TimeZone, TimeZoneInfo> = {
  "heaven-past": {
    code: "heaven-past",
    name: "Heaven Past",
    realm: "heaven",
    tense: "past",
    description: "What happened in heaven before - creation, fall of Lucifer, councils of God.",
    examples: ["Job 1-2 (heavenly council)", "Isaiah 14:12-15 (Lucifer's fall)", "Rev 12:7-9 (war in heaven)"]
  },
  "heaven-present": {
    code: "heaven-present",
    name: "Heaven Present",
    realm: "heaven",
    tense: "present",
    description: "What is happening in heaven now - Christ's intercession, judgment, angelic ministry.",
    examples: ["Revelation 4-5", "Hebrews 7:25", "Daniel 7:9-10"]
  },
  "heaven-future": {
    code: "heaven-future",
    name: "Heaven Future",
    realm: "heaven",
    tense: "future",
    description: "What will happen in heaven - final judgment, rewards, eternal worship.",
    examples: ["Revelation 20:11-15", "Revelation 21:3-4", "1 Corinthians 15:24-28"]
  },
  "earth-past": {
    code: "earth-past",
    name: "Earth Past",
    realm: "earth",
    tense: "past",
    description: "Historical events on earth - creation, patriarchs, Israel, Christ's earthly ministry.",
    examples: ["Genesis 1-11", "Exodus events", "Gospel narratives"]
  },
  "earth-present": {
    code: "earth-present",
    name: "Earth Present",
    realm: "earth",
    tense: "present",
    description: "Current application - how Scripture applies to the church age now.",
    examples: ["Church age teachings", "Epistles' instructions", "Present Christian life"]
  },
  "earth-future": {
    code: "earth-future",
    name: "Earth Future",
    realm: "earth",
    tense: "future",
    description: "Yet to be fulfilled on earth - Second Coming, millennium, new earth.",
    examples: ["1 Thessalonians 4:16-17", "Revelation 19:11-21", "Revelation 21-22"]
  }
};

// ============================================================================
// SECTION X: GUARDRAILS
// ============================================================================

export interface PTGuardrail {
  number: number;
  name: string;
  rule: string;
  explanation: string;
}

export const ptGuardrails: PTGuardrail[] = [
  {
    number: 1,
    name: "Christ-Centered Rule",
    rule: "Every study must pass through the Concentration Room.",
    explanation: "If Christ is not visible, you have misread the text. (John 5:39, Luke 24:27)"
  },
  {
    number: 2,
    name: "No Mutation Rule",
    rule: "Do not invent new floors, rooms, or cycles. Do not rename existing ones.",
    explanation: "The system is complete. Mutation leads to confusion."
  },
  {
    number: 3,
    name: "Cycle Placement Rule",
    rule: "Every text belongs to a cycle.",
    explanation: "Misplacing a passage into the wrong cycle leads to distorted interpretation."
  },
  {
    number: 4,
    name: "Heaven Horizon Rule",
    rule: "Always identify which Day of the LORD / New Heavens & Earth a prophecy points to.",
    explanation: "Flattening all 'new heavens and new earth' into one horizon is a critical error."
  },
  {
    number: 5,
    name: "Fruit Rule",
    rule: "Every interpretation must be tested in the Fruit Room.",
    explanation: "If it produces arrogance, despair, or hostility, it is false. If it grows the fruit of the Spirit, it is safe."
  },
  {
    number: 6,
    name: "Static/Dynamic Balance",
    rule: "Use Static Ascension for anchoring; use Dynamic Ascension for creative exploration.",
    explanation: "Never replace static with dynamic - use them together."
  },
  {
    number: 7,
    name: "Typology vs. Parallels Rule",
    rule: "Types = objects, offices, or events pointing forward. Parallels = mirrored actions across time.",
    explanation: "Do not confuse them."
  },
  {
    number: 8,
    name: "Don't Skip Floors Rule",
    rule: "Do not jump straight to 5th or 6th Floor without building memory, observation, and freestyle first.",
    explanation: "Skipping early floors creates shallow, brittle study."
  },
  {
    number: 9,
    name: "No Idolizing the Method Rule",
    rule: "The palace is scaffolding.",
    explanation: "The goal is not 'knowing Phototheology' but knowing Christ."
  },
  {
    number: 10,
    name: "Word + Spirit Rule",
    rule: "The system trains the mind, but the Spirit gives life.",
    explanation: "Prayer, humility, and dependence on God must accompany every use of Phototheology."
  }
];

// ============================================================================
// SECTION XI: HELPER FUNCTIONS
// ============================================================================

export const getFloorByNumber = (num: FloorNumber): PTFloor | undefined => {
  return ptFloors.find(f => f.number === num);
};

export const getRoomsByFloor = (floorNum: FloorNumber): PTRoom[] => {
  return Object.values(ptRooms).filter(r => r.floor === floorNum);
};

export const getRoomByCode = (code: RoomCode): PTRoom | undefined => {
  return ptRooms[code];
};

export const getCycleByCode = (code: CycleCode): PTCycle | undefined => {
  return ptCycles[code];
};

export const getHeavenByCode = (code: HeavenCode): PTHeaven | undefined => {
  return ptHeavens[code];
};

export const getExpansionForFloor = (floorNum: FloorNumber): ExpansionType | undefined => {
  const floor = getFloorByNumber(floorNum);
  return floor?.expansion;
};

export const getFloorsByExpansion = (expansion: ExpansionType): PTFloor[] => {
  return ptFloors.filter(f => f.expansion === expansion);
};

export const getAllRoomCodes = (): RoomCode[] => {
  return Object.keys(ptRooms) as RoomCode[];
};

export const getAllCycleCodes = (): CycleCode[] => {
  return Object.keys(ptCycles) as CycleCode[];
};

export const getAllHeavenCodes = (): HeavenCode[] => {
  return Object.keys(ptHeavens) as HeavenCode[];
};

// ============================================================================
// SECTION XII: ROOM CODE MAPPINGS FOR COMPATIBILITY
// ============================================================================

// Map old room codes to new standardized codes
export const roomCodeAliases: Record<string, RoomCode> = {
  // Floor 1
  "sr": "SR",
  "ir": "IR",
  "24fps": "24F",
  "24": "24F",
  "br": "BR",
  "tr": "TR",
  "#TR": "TR",
  "gr": "GR",

  // Floor 2
  "or": "OR",
  "dc": "DC",
  "st": "ST",
  "@T": "ST",
  "qr": "QR",
  "?": "QR",
  "qa": "QA",
  "?!": "QA",

  // Floor 3
  "nf": "NF",
  "pf": "PF",
  "bf": "BF",
  "hf": "HF",
  "lr": "LR",

  // Floor 4
  "cr": "CR",
  "dr": "DR",
  "c6": "C6",
  "trm": "TRm",
  "tz": "TZ",
  "prm": "PRm",
  "p||": "P||",
  "frt": "FRt",
  "cec": "CEC",
  "r66": "R66",

  // Floor 5
  "bl": "BL",
  "pr": "PR",
  "3a": "3A",
  "fr": "FR",

  // Floor 6
  "jr": "JR",

  // Floor 7
  "frm": "FRm",
  "mr": "MR",
  "srm": "SRm",

  // Floor 8
  "master": "∞"
};

export const normalizeRoomCode = (code: string): RoomCode | undefined => {
  const normalized = roomCodeAliases[code.toLowerCase()] || roomCodeAliases[code];
  return normalized || (ptRooms[code as RoomCode] ? code as RoomCode : undefined);
};
