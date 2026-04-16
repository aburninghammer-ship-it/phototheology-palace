// Phototheology Palace Output Engine
// Defines output types, quality tests, room definitions with hyperlink support, and contextual adaptation
// Used by all Jeeves-powered features: Study Buddy, Ask Jeeves, Sermon Writer, Analyze Thoughts, Fragments, etc.

// ══════════════════════════════════════════════════════════════════════════════
// ROOM DEFINITIONS - For Hyperlink Display
// Each room has id, name, floor, code, and explanation for user education
// ══════════════════════════════════════════════════════════════════════════════

export interface RoomDefinition {
  id: string;
  code: string;
  name: string;
  floor: number;
  floorName: string;
  icon: string;
  purpose: string;
  coreQuestion: string;
  methodology: string;
  example: string;
}

export const ROOM_DEFINITIONS: Record<string, RoomDefinition> = {
  // FLOOR 1 - FURNISHING (Memory & Visualization)
  sr: {
    id: "sr",
    code: "SR",
    name: "Story Room",
    floor: 1,
    floorName: "Furnishing",
    icon: "📖",
    purpose: "Stock the mind with raw biblical material in memorable form.",
    coreQuestion: "What exactly happened—and in what order?",
    methodology: "Break the narrative into 3-7 memorable 'beats' (major plot movements). Name each with a punchy noun or verb. Arrange chronologically with arrows showing sequence.",
    example: "Genesis 37: Dream → Coat → Pit → Caravan → Egypt → Potiphar"
  },
  ir: {
    id: "ir",
    code: "IR",
    name: "Imagination Room",
    floor: 1,
    floorName: "Furnishing",
    icon: "👁️",
    purpose: "Step inside the story with sanctified empathy.",
    coreQuestion: "What do you see, hear, feel, smell, and taste in this passage?",
    methodology: "Immerse yourself in the scene using all five senses. Don't just recall—experience. Place yourself IN the moment.",
    example: "At the Red Sea: Feel the ground trembling. Hear the Egyptian chariots behind you. Smell the salt air. See the wall of water on each side. Taste the fear turning to awe."
  },
  "24": {
    id: "24",
    code: "24",
    name: "24FPS Room",
    floor: 1,
    floorName: "Furnishing",
    icon: "🎬",
    purpose: "Create one memorable mental snapshot per chapter.",
    coreQuestion: "What single symbolic frame captures this chapter?",
    methodology: "Freeze one strange, vivid image that anchors the entire chapter in memory. The weirder, the stickier.",
    example: "Genesis 22: A knife suspended over an altar, with a ram caught in thorns behind."
  },
  br: {
    id: "br",
    code: "BR",
    name: "Bible Rendered",
    floor: 1,
    floorName: "Furnishing",
    icon: "🖼️",
    purpose: "Zoom out to see the master image for a block of chapters.",
    coreQuestion: "Where does this fit in the panoramic 'trailer' of Scripture?",
    methodology: "Create one glyph or image per 24-chapter block. Compress the canon into memorable visual units.",
    example: "Genesis 1-24: A garden, a flood, a tower, a tent—creation to covenant."
  },
  tr: {
    id: "tr",
    code: "TR",
    name: "Translation Room",
    floor: 1,
    floorName: "Furnishing",
    icon: "🔤",
    purpose: "Convert abstract text into concrete visual images.",
    coreQuestion: "How do I turn these words into pictures?",
    methodology: "Transform abstract concepts into tangible images. 'Thy word is a lamp' becomes a glowing scroll lighting a dark path.",
    example: "'The LORD is my shepherd' → A shepherd's crook resting against a still pool at dusk."
  },
  gr: {
    id: "gr",
    code: "GR",
    name: "Gems Room",
    floor: 1,
    floorName: "Furnishing",
    icon: "💎",
    purpose: "Discover striking insights that make you say 'I never noticed that before.'",
    coreQuestion: "What rare truth shines from this text?",
    methodology: "Combine 2-4 unrelated texts to find hidden connections. Look for the detail everyone else walked past.",
    example: "David picked 5 stones because Goliath had 4 brothers (2 Sam 21:22). He wasn't preparing for failure—he was planning to finish the family."
  },

  // FLOOR 2 - INVESTIGATION (Detective Work)
  or: {
    id: "or",
    code: "OR",
    name: "Observation Room",
    floor: 2,
    floorName: "Investigation",
    icon: "🔍",
    purpose: "Analyze the text like a detective building a case.",
    coreQuestion: "What do I notice before I interpret?",
    methodology: "Log 20-50 observations without interpreting. Who, what, when, where, how. Bag the fingerprints before building the theory.",
    example: "John 11: Notice Jesus waited 2 days (v6), Lazarus was dead 4 days (v17), the tomb was a cave (v38), Jesus wept (v35)—shortest verse, deepest emotion."
  },
  dc: {
    id: "dc",
    code: "DC",
    name: "Def-Com Room",
    floor: 2,
    floorName: "Investigation",
    icon: "📚",
    purpose: "Run the forensic lab on key terms.",
    coreQuestion: "What do the original words mean, and what context am I missing?",
    methodology: "Examine Greek/Hebrew definitions. Note historical/cultural context. Consult trusted commentaries as expert witnesses.",
    example: "'Pasach' (pass over) may mean 'hover protectively' like a bird over its nest (cf. Isaiah 31:5). God wasn't skipping—He was standing guard."
  },
  st: {
    id: "st",
    code: "ST",
    name: "Symbols/Types Room",
    floor: 2,
    floorName: "Investigation",
    icon: "🐑",
    purpose: "Decode symbols and identify types pointing to Christ.",
    coreQuestion: "What symbols are present, and where do they lead?",
    methodology: "Track symbols (lamb, rock, water, fire, light, door, vine, bread) through Scripture. Identify types that point forward to Christ.",
    example: "The bronze serpent (Num 21) → Christ lifted up on the cross (John 3:14). Same shape, same salvation, same look-and-live invitation."
  },
  qr: {
    id: "qr",
    code: "QR",
    name: "Questions Room",
    floor: 2,
    floorName: "Investigation",
    icon: "❓",
    purpose: "Interrogate the text with penetrating questions.",
    coreQuestion: "What questions does this text raise?",
    methodology: "Generate 3 types: INTRA (inside this text), INTER (across Scripture), PALACE (which PT rooms activate?).",
    example: "INTRA: Why hyssop, not cedar? INTER: Where else does hyssop appear? PALACE: Which sanctuary element connects?"
  },
  qa: {
    id: "qa",
    code: "QA",
    name: "Q&A Room",
    floor: 2,
    floorName: "Investigation",
    icon: "⚖️",
    purpose: "Let Scripture answer Scripture.",
    coreQuestion: "Which verse answers the question I raised?",
    methodology: "Cross-examine witnesses. Build Scripture chains. If two witnesses align, you've cracked the case.",
    example: "Q: Why blood on the doorposts? A: Hebrews 9:22—'without shedding of blood is no remission.' Scripture answers Scripture."
  },

  // FLOOR 3 - FREESTYLE (Spontaneous Connections)
  nf: {
    id: "nf",
    code: "NF",
    name: "Nature Freestyle",
    floor: 3,
    floorName: "Freestyle",
    icon: "🌿",
    purpose: "See Scripture lessons in nature.",
    coreQuestion: "What in creation illustrates this truth?",
    methodology: "Connect text to trees, storms, seasons, animals—God's second book (Romans 1:20).",
    example: "Psalm 1's tree planted by water → A believer rooted in the Word draws nourishment unseen, bears fruit in season."
  },
  pf: {
    id: "pf",
    code: "PF",
    name: "Personal Freestyle",
    floor: 3,
    floorName: "Freestyle",
    icon: "🪞",
    purpose: "Your life becomes the object lesson.",
    coreQuestion: "What life experience mirrors this text?",
    methodology: "Traffic = Red Sea patience. Lost keys = Luke 15. Your story becomes teaching material.",
    example: "That job you lost → Joseph's pit. The waiting season → David's wilderness years. God writes sermons in your biography."
  },
  bf: {
    id: "bf",
    code: "BF",
    name: "Bible Freestyle / Verse Genetics",
    floor: 3,
    floorName: "Freestyle",
    icon: "🧬",
    purpose: "Trace the genealogy of thought between verses.",
    coreQuestion: "What are this verse's relatives?",
    methodology: "Find siblings (same theme), cousins (linked by typology), distant relatives (centuries apart, same family).",
    example: "Genesis 3:15 (seed of woman) is grandfather to Isaiah 7:14 (virgin birth) is parent to Matthew 1:23 (Immanuel)."
  },
  hf: {
    id: "hf",
    code: "HF",
    name: "History/Social Freestyle",
    floor: 3,
    floorName: "Freestyle",
    icon: "🏛️",
    purpose: "Let the Bible interpret the world around you.",
    coreQuestion: "What in history, culture, or current events illustrates this?",
    methodology: "See lessons in secular history, technology, news. The Bible provides the lens; the world provides the examples.",
    example: "The tower of Babel → every human attempt at unity without God (League of Nations, UN, globalism). Same blueprint, same outcome."
  },
  lr: {
    id: "lr",
    code: "LR",
    name: "Listening Room",
    floor: 3,
    floorName: "Freestyle",
    icon: "👂",
    purpose: "Turn conversations and sermons into Scripture connections.",
    coreQuestion: "What have I heard that connects to this text?",
    methodology: "Be agile and responsive. Use sermons, testimonies, and conversations as springboards.",
    example: "A friend's testimony about forgiveness → Joseph forgiving his brothers → Christ forgiving from the cross. One story unlocks three."
  },

  // FLOOR 4 - NEXT LEVEL (Christ-Centered Structure)
  cr: {
    id: "cr",
    code: "CR",
    name: "Concentration Room",
    floor: 4,
    floorName: "Next Level",
    icon: "✝️",
    purpose: "THE cardinal rule: every text must reveal Christ.",
    coreQuestion: "Where is Jesus in this passage?",
    methodology: "If Christ is not visible, you have not finished studying. John 5:39, Luke 24:27. Go back through ST, PRm, P‖, BL—the types and symbols will lead you to Him.",
    example: "Genesis 22: Isaac carries wood up the mountain (Christ carried the cross). Abraham's words: 'God will provide himself a lamb' (John 1:29)."
  },
  dr: {
    id: "dr",
    code: "DR",
    name: "Dimensions Room",
    floor: 4,
    floorName: "Next Level",
    icon: "📐",
    purpose: "Stretch the passage across five dimensions.",
    coreQuestion: "How does this text apply at every level?",
    methodology: "1) Literal—what it means. 2) Christ—how it points to Jesus. 3) Me—personal application. 4) Church—corporate application. 5) Heaven—eternal reality.",
    example: "'The LORD is my shepherd' → Literal: David's experience. Christ: Jesus the Good Shepherd. Me: My daily guidance. Church: Pastoral care. Heaven: The Lamb as Shepherd (Rev 7:17)."
  },
  c6: {
    id: "c6",
    code: "C6",
    name: "Connect 6 Room",
    floor: 4,
    floorName: "Next Level",
    icon: "🔗",
    purpose: "Classify by genre and find cross-genre connections.",
    coreQuestion: "What genre is this, and how does this truth appear in other genres?",
    methodology: "Prophecy, Poetry, History, Gospels, Epistles, Parables. Each has its own rules. Don't critique a rap like a symphony.",
    example: "The Passover: History (Exodus 12), Poetry (Psalm 114), Prophecy (Isaiah 53), Gospel (John 19), Epistle (1 Cor 5:7), Parable (Luke 15 - lost son returns to feast)."
  },
  trm: {
    id: "trm",
    code: "TRm",
    name: "Theme Room",
    floor: 4,
    floorName: "Next Level",
    icon: "🧱",
    purpose: "Place the text on the great structural walls.",
    coreQuestion: "Which major biblical theme does this connect to?",
    methodology: "Sanctuary Wall, Life of Christ Wall, Great Controversy Wall, Time Prophecy Wall, Gospel Floor, Heaven Ceiling.",
    example: "Exodus 12 hangs on: Sanctuary Wall (altar/blood), Life of Christ (Lamb of God), Great Controversy (destroyer vs. protector), Gospel Floor (saved by blood)."
  },
  tz: {
    id: "tz",
    code: "TZ",
    name: "Time Zone Room",
    floor: 4,
    floorName: "Next Level",
    icon: "⏰",
    purpose: "Locate the passage across six time-space coordinates.",
    coreQuestion: "Where has this landed, where is it in flight, and where is it scheduled to arrive?",
    methodology: "Past/Present/Future × Heaven/Earth. Six zones total.",
    example: "The Passover: Earth-Past (Egypt), Earth-Present (Lord's Supper), Earth-Future (Marriage Supper), Heaven-Past (Lamb slain before foundation), Heaven-Present (Christ interceding), Heaven-Future (eternal fellowship)."
  },
  prm: {
    id: "prm",
    code: "PRm",
    name: "Patterns Room",
    floor: 4,
    floorName: "Next Level",
    icon: "🔄",
    purpose: "Identify God's fingerprint motifs.",
    coreQuestion: "What recurring pattern appears here?",
    methodology: "40 days (flood, Sinai, wilderness, Jesus' fast), 3 days (Joseph, Jonah, tomb), deliverer stories (Moses, Samson, David → Christ).",
    example: "3-day pattern: Joseph in prison, Jonah in fish, Jesus in tomb. Each emerged to new life and greater authority."
  },
  "p||": {
    id: "p||",
    code: "P‖",
    name: "Parallels Room",
    floor: 4,
    floorName: "Next Level",
    icon: "⚡",
    purpose: "Find mirrored ACTIONS across time.",
    coreQuestion: "What event echoes this one?",
    methodology: "Not just symbols—mirrored actions. Babel ↔ Pentecost. Egypt exodus ↔ Babylon return. Jesus fasting 40 days ↔ Israel wandering 40 years.",
    example: "Babel: One language scattered into many. Pentecost: Many languages united into one message. What sin divided, the Spirit reunited."
  },
  frt: {
    id: "frt",
    code: "FRt",
    name: "Fruit Room",
    floor: 4,
    floorName: "Next Level",
    icon: "🍇",
    purpose: "Test the interpretation by its fruit.",
    coreQuestion: "Does this produce love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control?",
    methodology: "Gal 5:22-23 is the quality control. If it breeds arrogance, fear, or despair—it fails. Rewrite.",
    example: "'When I see the blood' produces assurance, not anxiety. Peace, not performance pressure. The Fruit Test passes."
  },
  cec: {
    id: "cec",
    code: "CEC",
    name: "Christ in Every Chapter",
    floor: 4,
    floorName: "Next Level",
    icon: "📍",
    purpose: "Name and trace the Christ-thread explicitly.",
    coreQuestion: "What is the Christ-thread in this chapter?",
    methodology: "Do not move on until the Christ-connection is anchored and confessed. Every chapter has one.",
    example: "Exodus 12: Christ is the Lamb whose blood protects from death. Explicit, anchored, confessed."
  },
  r66: {
    id: "r66",
    code: "R66",
    name: "Room 66",
    floor: 4,
    floorName: "Next Level",
    icon: "📚",
    purpose: "Trace a theme through all 66 books.",
    coreQuestion: "Can this truth be found in every book of the Bible?",
    methodology: "One crisp claim per book. The blood, the Lamb, the covenant—trace it Genesis to Revelation.",
    example: "The Lamb: Genesis (skins to cover sin), Exodus (Passover), Leviticus (sacrifices), ... Revelation (Lamb on the throne)."
  },

  // FLOOR 5 - VISION (Prophecy & Sanctuary)
  bl: {
    id: "bl",
    code: "BL",
    name: "Blue Room / Sanctuary",
    floor: 5,
    floorName: "Vision",
    icon: "⛺",
    purpose: "Connect the text to the sanctuary blueprint.",
    coreQuestion: "Which sanctuary element does this illuminate?",
    methodology: "Altar (cross), Laver (baptism/cleansing), Lampstand (Spirit/light), Showbread (Word/provision), Incense (intercession), Veil (access), Ark (law/covenant), Mercy Seat (grace).",
    example: "Passover blood on doorposts → Altar of Burnt Offering. The first piece of furniture, the entry point. No blood, no entry."
  },
  pr: {
    id: "pr",
    code: "PR",
    name: "Prophecy Room",
    floor: 5,
    floorName: "Vision",
    icon: "🔮",
    purpose: "Align the prophetic stars.",
    coreQuestion: "How does this text fit the historicist timeline?",
    methodology: "Daniel 2 (statue), Daniel 7 (beasts), Daniel 8-9 (sanctuary/2300 days), Revelation 13 (beast/image/mark), Revelation 14 (three angels).",
    example: "The Passover lamb points to Christ, but also to the daily sacrifice, which points to the heavenly sanctuary ministry ongoing now."
  },
  "3a": {
    id: "3a",
    code: "3A",
    name: "Three Angels' Room",
    floor: 5,
    floorName: "Vision",
    icon: "👼",
    purpose: "Connect to the Three Angels' Messages.",
    coreQuestion: "How does this text relate to Revelation 14:6-12?",
    methodology: "Everlasting gospel, Babylon fallen, beast/image/mark warning. All doctrines converge here.",
    example: "Passover: Fear God (first angel), come out of Egypt/Babylon (second angel), don't receive the mark of the beast—receive the blood-mark of the Lamb (third angel)."
  },
  fe: {
    id: "fe",
    code: "FE",
    name: "Feasts Room",
    floor: 5,
    floorName: "Vision",
    icon: "🎉",
    purpose: "Connect to Israel's feast calendar.",
    coreQuestion: "Which feast does this text correlate with?",
    methodology: "Passover, Unleavened Bread, Firstfruits, Pentecost (spring = First Advent). Trumpets, Atonement, Tabernacles (fall = Second Advent ministry).",
    example: "Exodus 12 = Passover (Feast #1). Christ crucified on Passover, buried on Unleavened Bread, rose on Firstfruits. He didn't just fulfill prophecy—He fulfilled the calendar."
  },

  // FLOOR 6 - THREE HEAVENS (Cycles & Cosmic Context)
  "1h": {
    id: "1h",
    code: "1H",
    name: "First Heaven",
    floor: 6,
    floorName: "Three Heavens",
    icon: "🌅",
    purpose: "Place text in the first Day-of-the-LORD horizon.",
    coreQuestion: "How does this relate to Babylon's destruction and post-exilic restoration?",
    methodology: "DoL¹/NE¹: Babylon destroys Jerusalem (586 BC) → first 'new heavens & earth' = post-exilic restoration under Cyrus.",
    example: "Isaiah 65-66's 'new heavens and new earth' has typological fulfillment in the return from Babylon—not just NE³."
  },
  "2h": {
    id: "2h",
    code: "2H",
    name: "Second Heaven",
    floor: 6,
    floorName: "Three Heavens",
    icon: "🌄",
    purpose: "Place text in the second Day-of-the-LORD horizon.",
    coreQuestion: "How does this relate to 70 AD and the New Covenant order?",
    methodology: "DoL²/NE²: Rome destroys Jerusalem (70 AD) → second 'new heavens & earth' = New-Covenant order, church as living temple, Christ in heavenly sanctuary.",
    example: "Hebrews 8-12 describes a 'new heavens and earth' that is NOW—the heavenly sanctuary order we live in today."
  },
  "3h": {
    id: "3h",
    code: "3H",
    name: "Third Heaven",
    floor: 6,
    floorName: "Three Heavens",
    icon: "🌌",
    purpose: "Place text in the final Day-of-the-LORD horizon.",
    coreQuestion: "How does this point to final judgment and the literal New Creation?",
    methodology: "DoL³/NE³: Cosmic judgment (2 Pet 3; Rev 20) → literal New Heavens & New Earth (Rev 21-22).",
    example: "Revelation 21-22 is NE³—the literal, eternal, final new creation where God dwells with His people forever."
  },
  cycles: {
    id: "cycles",
    code: "@Cycles",
    name: "Eight Cycles",
    floor: 6,
    floorName: "Three Heavens",
    icon: "🔁",
    purpose: "Place text in its covenant cycle.",
    coreQuestion: "Which redemptive cycle does this belong to?",
    methodology: "@Ad (Adamic), @No (Noahic), @Ab (Abrahamic), @Mo (Mosaic), @Cy (Cyrusic), @CyC (Cyrus-Christ), @Sp (Spirit), @Re (Remnant). Each follows: Fall → Covenant → Sanctuary → Enemy → Restoration.",
    example: "Exodus 12 is @Mo (Mosaic cycle): Fall (Egyptian bondage), Covenant (blood on doorposts), Sanctuary (tabernacle coming), Enemy (Pharaoh/destroyer), Restoration (Promised Land)."
  },
  jr: {
    id: "jr",
    code: "JR",
    name: "Juice Room",
    floor: 6,
    floorName: "Three Heavens",
    icon: "🍊",
    purpose: "Squeeze the text through ALL principles at once.",
    coreQuestion: "What emerges when you apply every room?",
    methodology: "Like an orange under a juicer—twist and press until nothing remains unsqueezed. Extract every drop.",
    example: "Run an entire book through all Palace principles. Leave nothing on the table."
  },

  // FLOOR 7 - SPIRITUAL & EMOTIONAL (Transformation)
  frm: {
    id: "frm",
    code: "FRm",
    name: "Fire Room",
    floor: 7,
    floorName: "Spiritual",
    icon: "🔥",
    purpose: "Feel the emotional weight. The Word examines YOU.",
    coreQuestion: "Does this move my heart?",
    methodology: "Don't just analyze Gethsemane—feel the crushing loneliness. Don't parse Calvary's Greek—tremble at 'Why hast thou forsaken me?' The text burns away apathy.",
    example: "The Passover lamb was selected on day 10, lived with the family 4 days, then was killed. They knew the lamb. The children played with it. Then they watched it die. FEEL that."
  },
  mr: {
    id: "mr",
    code: "MR",
    name: "Meditation Room",
    floor: 7,
    floorName: "Spiritual",
    icon: "🧘",
    purpose: "Slow down. Marinate in truth.",
    coreQuestion: "What emerges from slow, repeated reading?",
    methodology: "Read slowly, pause, picture, pray, rest. This is slow cooking—simmered Scripture carries richer flavor than microwaved reading.",
    example: "'When I see the blood, I will pass over you.' Read it again. Slowly. 'When I see the blood.' Not you. I. Sit with that."
  },
  srm: {
    id: "srm",
    code: "SRm",
    name: "Speed Room",
    floor: 7,
    floorName: "Spiritual",
    icon: "⚡",
    purpose: "Sprint training for rapid connections.",
    coreQuestion: "How quickly can I connect this to Christ and other texts?",
    methodology: "Practice rapid application of PT principles. Flip through chapters, make connections in seconds, map themes instantly. Build reflexes for ministry moments.",
    example: "Someone mentions 'hyssop' → instantly recall Passover, Psalm 51:7, John 19:29. Three connections in three seconds."
  },

  // FLOOR 8 - MASTER (Reflexive Mastery)
  master: {
    id: "master",
    code: "M8",
    name: "Master Floor",
    floor: 8,
    floorName: "Master",
    icon: "♾️",
    purpose: "The Palace is inside you. Reflexive, natural, Christ-saturated thought.",
    coreQuestion: "Do I think Phototheologically without thinking about the method?",
    methodology: "No rooms. No codes. No labels. You read a text and instantly run through story, questions, types, Christ, dimensions, sanctuary—all without naming the rooms.",
    example: "You hear a verse and immediately see Christ, feel the weight, know the cycle, spot the pattern. The Palace is scaffolding—and now it's internalized."
  }
};

// Helper function to get room by ID
export function getRoomDefinition(roomId: string): RoomDefinition | undefined {
  return ROOM_DEFINITIONS[roomId.toLowerCase()];
}

// Helper to format room tag for display (with hyperlink data)
export function formatRoomTag(roomId: string): { code: string; name: string; url: string } {
  const room = getRoomDefinition(roomId);
  if (!room) return { code: roomId.toUpperCase(), name: "Unknown Room", url: "#" };
  return {
    code: room.code,
    name: room.name,
    url: `/palace/room/${room.id}` // Frontend route for room details
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// OUTPUT TYPES - Each type has specific format, length, tone, and requirements
// ══════════════════════════════════════════════════════════════════════════════

export interface OutputTypeDefinition {
  id: string;
  name: string;
  icon: string;
  description: string;
  length: string;
  tone: string;
  structure: string;
  roomVisibility: string;
  requirements: string[];
  qualityBar: string;
}

export const OUTPUT_TYPES: Record<string, OutputTypeDefinition> = {
  gem: {
    id: "gem",
    name: "Gem",
    icon: "💎",
    description: "A single striking insight—the kind that makes someone stop and say 'I never saw that before.'",
    length: "2-5 sentences",
    tone: "Punchy, vivid, surprising. Like finding a diamond in a field.",
    structure: "One insight, one supporting detail, one landing thought.",
    roomVisibility: "Tag the gem with the 1-3 rooms that produced it, e.g., (OR + ST + CR).",
    requirements: [
      "Must be TEXTUALLY grounded—cite the verse or detail",
      "Must connect to Christ, even if subtly",
      "Prefer UNEXPECTED angles—don't give the insight everyone knows",
      "Use one vivid image or analogy to make it stick"
    ],
    qualityBar: "David didn't pick up five stones because he doubted—Goliath had four brothers (2 Sam 21:22). David wasn't preparing for failure. He was planning to finish the whole family. | Proverbs 1:17: 'No bird walks into a trap it can see — but men walked into judgment while staring directly at Wisdom Himself.' The cross was a trap for the trappers (Col 2:15). | Abel's blood cries for justice; Christ's blood cries for mercy. That is not repetition — that is escalation (Heb 12:24)."
  },

  commentary: {
    id: "commentary",
    name: "Commentary",
    icon: "📖",
    description: "Verse-by-verse or passage-level explanation with scholarly care and spiritual warmth.",
    length: "1-3 paragraphs per verse or section",
    tone: "Teacher-guide. Warm but precise.",
    structure: "Verse reference → Observation → Definition/Context → Typological connection → Christ-connection → Application",
    roomVisibility: "Weave room tags naturally into the commentary. When you shift from observation to symbol to Christ-connection, the user sees the rooms change.",
    requirements: [
      "Lead with what the text SAYS (OR) before what it MEANS (CR, DR)",
      "Include at least one original-language insight (DC) when it deepens meaning",
      "Include at least one cross-reference (QA/BF) that illuminates",
      "Always land on Christ (CR)—commentary that ends in history or moral advice has stopped short",
      "Don't moralize without first gospelizing—imperative follows indicative"
    ],
    qualityBar: "Cascading Christ-discovery: Proverbs 1 yields 7+ layered connections — Son of David → Wisdom as Christ → rejected Messiah → Judas → 70 AD → covenant lawsuit → Christ as refuge. Each layer builds on the last. EVERY passage has this depth when you dig. | Commentary that stops at one Christ-mention has stopped short."
  },

  devotional: {
    id: "devotional",
    name: "Devotional",
    icon: "🕊️",
    description: "A personal, heart-level reflection that moves from text to transformation.",
    length: "3-6 paragraphs, 5-7 minute read",
    tone: "Intimate, warm, convicting without condemning, hopeful.",
    structure: "HOOK (scene/question) → TEXT (immersion) → TURN (reveal deeper layer) → MIRROR (hold to reader's life) → LAND (end with Christ, gospel, hope)",
    roomVisibility: "After the devotional, include a 'Palace Path' showing the rooms that shaped the reflection, e.g., IR → OR → DC → ST → CR → BL → P‖ → DR → FRm → FRt",
    requirements: [
      "NEVER open with 'Today's text is...'—use a hook",
      "One profound turn beats three medium ones—go deep, not wide",
      "Use concrete images, not abstract religious language",
      "Every devotional must pass the Fire Room test (moves the heart)",
      "Every devotional must pass the Fruit Room test (produces gospel fruit, not guilt)"
    ],
    qualityBar: "'The man of God in 1 Kings 13 was sent by God, spoke truth, refused reward — then listened to a false prophet and was judged. Had Christ sinned, this would have been His end. But Christ resisted every lie — and died for us instead.' What-if shadow types make Christ's perfection vivid by contrast."
  },

  sparks: {
    id: "sparks",
    name: "Sparks",
    icon: "⚡",
    description: "Rapid-fire connections, questions, or provocations designed to ignite further study.",
    length: "1-3 sentences maximum per spark",
    tone: "Sharp, curious, provocative. Like a study partner who says 'Wait—did you notice THIS?'",
    structure: "Room tag + Insight/Question + Hook",
    roomVisibility: "Tag each spark with its room source, e.g., (ST + P‖).",
    requirements: [
      "Sparks RAISE questions or MAKE connections—they don't answer everything",
      "Can be: cross-reference pairing, typological link, pattern, 'what if' question, sanctuary connection",
      "One spark that genuinely ignites is worth ten that fizzle"
    ],
    qualityBar: "(ST + P‖) Hyssop applied the blood in Exodus 12. Hyssop delivered the vinegar in John 19. Same plant, two lambs. What does that say about God's attention to detail across fifteen centuries? | (PRm + P‖) Psalms 22-23-24 = Death → Burial → Resurrection. 'He was forsaken in Psalm 22, walked through death in Psalm 23, and reigns in Psalm 24.' Three psalms, one journey. | (C6 + TRm) The Pentateuch IS Christ's ministry timeline: Genesis=Son, Exodus=Deliverer, Leviticus=Sacrifice, Numbers=Mission, Deuteronomy=Death-Resurrection."
  },

  studyBuddy: {
    id: "studyBuddy",
    name: "Study Buddy",
    icon: "🧠",
    description: "Real-time conversational study companion that responds to user notes and sparks connections.",
    length: "Variable—responds to what user writes",
    tone: "Conversational, warm, witty. Like a brilliant friend who happens to be trained in PT.",
    structure: "Read user notes → Respond directly → Spark connections → Source claims → Suggest rooms → Provide Christ-connection → Ask follow-up question",
    roomVisibility: "Tag sparks, sources, and room suggestions with clickable room codes.",
    requirements: [
      "RESPOND directly to what the user typed—this is essential",
      "Celebrate discoveries with genuine enthusiasm",
      "Ask follow-up questions naturally",
      "Never sound like a textbook—sound like a thoughtful friend",
      "If user asks a question, ANSWER it directly first, then add depth"
    ],
    qualityBar: "User: 'I notice the blood is on the doorposts but not the threshold.' → 'Brilliant observation! (OR) You've spotted something Hebrews 10:29 will later make explicit—the blood of Christ is never to be trampled underfoot. The architecture of salvation was preaching before the epistle was written. What made you notice that detail?'"
  },

  askJeeves: {
    id: "askJeeves",
    name: "Ask Jeeves",
    icon: "🎩",
    description: "Direct question-and-answer format for specific biblical or theological questions.",
    length: "1-4 paragraphs depending on question complexity",
    tone: "Authoritative but warm. The butler who knows everything but never condescends.",
    structure: "Direct answer → Supporting Scripture → Palace-powered depth → Practical takeaway",
    roomVisibility: "Tag the rooms that informed the answer.",
    requirements: [
      "ANSWER the question directly in the first sentence",
      "Ground every answer in Scripture",
      "Show which Palace rooms produced the insight",
      "Connect to Christ when applicable (almost always)",
      "End with something actionable or thought-provoking"
    ],
    qualityBar: "Q: 'Why hyssop?' A: (DC + ST + P‖) Hyssop was a common weed that grew out of walls—the humblest plant in Palestine. Yet God chose it to carry the most powerful substance in the universe: the blood of the lamb. At Calvary, the echo returns (John 19:29). God uses the ordinary to deliver the extraordinary. Your weakness isn't disqualifying; it's the hyssop in His hand."
  },

  sermonWriter: {
    id: "sermonWriter",
    name: "Sermon Writer",
    icon: "🎤",
    description: "Sermon development assistance—outlines, illustrations, applications, and Christ-centered structure.",
    length: "Variable—from quick hooks to full outlines",
    tone: "Preacher-to-preacher. Collegial, practical, inspiring.",
    structure: "Theme → Text → Christ-connection → Main points (with room tags) → Illustrations → Applications → Landing",
    roomVisibility: "Each main point should show which rooms informed it. Help the preacher teach PT while they preach.",
    requirements: [
      "Every sermon must have a clear Christ-connection (CR)—not tacked on, but load-bearing",
      "Provide multiple illustration options (NF, PF, HF)",
      "Include sanctuary connections when applicable (BL)",
      "Balance doctrinal depth with practical application (DR)",
      "Suggest hooks that grab attention from the first sentence"
    ],
    qualityBar: "Point 2: The Shape of Salvation (OR + BL) 'Notice the blood placement—lintel and two side posts, but never the threshold. The doorframe forms the shape of a cross. Every Israelite family stood inside the silhouette of Calvary centuries before Calvary existed. [Illustration: Child's drawing of a door. They draw a cross without knowing it.] Application: You are already standing inside what Christ accomplished. Stop trying to earn your way in—you're already covered.'"
  },

  analyzeThoughts: {
    id: "analyzeThoughts",
    name: "Analyze My Thoughts",
    icon: "💭",
    description: "Deep analysis of user's theological thoughts, insights, or questions through the Palace framework.",
    length: "2-5 paragraphs of analysis",
    tone: "Thoughtful, validating where appropriate, gently correcting where needed.",
    structure: "Acknowledge thought → Identify which rooms it touches → Deepen with additional connections → Test against guardrails → Suggest next steps",
    roomVisibility: "Show which rooms the user's thought already activated, and which rooms could deepen it.",
    requirements: [
      "Honor the user's insight—don't dismiss or immediately correct",
      "Identify the Palace rooms their thinking already touched",
      "Add depth from rooms they haven't considered",
      "Gently correct if the thought violates theological guardrails",
      "Suggest a 'Drill Deeper' direction for further study"
    ],
    qualityBar: "User thought: 'The lamb was innocent but died for the guilty—like a substitution.' Analysis: 'You've activated the Concentration Room (CR) with a direct Christ-typology. The substitutionary thread is exactly right. But push further: (ST) Why a lamb specifically, not a bull or goat? (BL) Which sanctuary offering does this parallel? (PRm) Where else does this substitution pattern appear? You're on the trail—keep digging.'"
  },

  fragments: {
    id: "fragments",
    name: "Gather Fragments",
    icon: "🧩",
    description: "Comprehensive drilling of a verse or thought through all Palace rooms—'that nothing be lost' (John 6:12).",
    length: "Full Palace output—response for each applicable room",
    tone: "Thorough, revelatory, cumulative. Each room adds another fragment.",
    structure: "Process text through all 8 floors, all applicable rooms. Show room-by-room insights. Build to Christ-centered synthesis.",
    roomVisibility: "EVERY insight tagged with its room. This is the teaching tool—users learn the Palace by watching it work.",
    requirements: [
      "Touch EVERY floor—no skipping",
      "Show room code for every insight",
      "Don't force connections—if a room yields nothing, skip it",
      "Always surface: SR, OR, ST, CR, DR, BL, FRm, FRt, Cycle, Heaven",
      "End with synthesis: Palace Path + Concentrated Essence"
    ],
    qualityBar: "See the full Exodus 12:21-23 sample output with Gem, Commentary, Devotional, and Sparks."
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// QUALITY TESTS - Run on every output before delivering
// ══════════════════════════════════════════════════════════════════════════════

export interface QualityTest {
  id: string;
  name: string;
  room: string;
  question: string;
  passCondition: string;
  failIndicators: string[];
}

export const QUALITY_TESTS: QualityTest[] = [
  {
    id: "christ",
    name: "The Christ Test",
    room: "CR",
    question: "Is Jesus in this? Not as a footnote, but as the heartbeat?",
    passCondition: "If you removed the Christ-connection, the output would collapse. Christ is load-bearing, not decorative.",
    failIndicators: [
      "Christ mentioned only in the last sentence",
      "Output 'works' without the Christ-connection",
      "Jesus added as an afterthought, not woven throughout"
    ]
  },
  {
    id: "discovery",
    name: "The 'I Never Saw That' Test",
    room: "GR",
    question: "Would a regular churchgoer discover something new?",
    passCondition: "The insight would make someone stop and say 'I never noticed that before.'",
    failIndicators: [
      "Insight is something they'd hear in any Sunday sermon",
      "Surface-level observation without deeper connection",
      "Generic devotional language without specific textual grounding"
    ]
  },
  {
    id: "grounding",
    name: "The Grounding Test",
    room: "OR + QA",
    question: "Is every claim anchored in Scripture?",
    passCondition: "No floating spirituality. Every insight is cited, shown, grounded. Scripture does the heavy lifting.",
    failIndicators: [
      "Claims without verse references",
      "Spiritual abstractions without textual basis",
      "Commentary unsupported by the actual text"
    ]
  },
  {
    id: "heart",
    name: "The Heart Test",
    room: "FRm",
    question: "Does this move something inside?",
    passCondition: "Knowledge that reaches the heart. The reader feels gratitude, awe, conviction, or hope.",
    failIndicators: [
      "Intellectually interesting but emotionally flat",
      "Information without transformation",
      "Head knowledge that never descends to the heart"
    ]
  },
  {
    id: "cascade",
    name: "The Cascade Test",
    room: "CR + ST + P‖",
    question: "Does this output contain multiple layered Christ connections that build on each other?",
    passCondition: "At least 3 cascading connections where each insight opens the door to the next — not isolated mentions, but a chain of discovery.",
    failIndicators: [
      "Only one surface-level Christ mention",
      "Christ connections that don't build on each other",
      "Generic typology without specific textual grounding",
      "Missing the 'I never saw that before' factor"
    ]
  },
  {
    id: "fruit",
    name: "The Fruit Test",
    room: "FRt",
    question: "Does this interpretation produce Christlike character?",
    passCondition: "Galatians 5:22-23: love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control.",
    failIndicators: [
      "Produces arrogance, not humility",
      "Produces fear without faith",
      "Produces despair, not hope",
      "Produces knowledge without worship"
    ]
  }
];

// ══════════════════════════════════════════════════════════════════════════════
// CONTEXTUAL ADAPTATION - Different approaches for different inputs
// ══════════════════════════════════════════════════════════════════════════════

export interface ContextualApproach {
  inputType: string;
  description: string;
  priorityOutputs: string[];
  priorityRooms: string[];
  approach: string;
}

export const CONTEXTUAL_APPROACHES: ContextualApproach[] = [
  {
    inputType: "single_verse",
    description: "One verse reference",
    priorityOutputs: ["gem", "sparks"],
    priorityRooms: ["or", "dc", "st", "cr", "gr"],
    approach: "Go microscopic. Extract maximum insight from minimum text. Every word matters."
  },
  {
    inputType: "passage",
    description: "3-10 verses",
    priorityOutputs: ["commentary", "devotional"],
    priorityRooms: ["sr", "ir", "or", "st", "cr", "dr", "bl", "frm"],
    approach: "Walk the narrative. Let the story unfold. Show the Christ-thread through the passage."
  },
  {
    inputType: "chapter",
    description: "Full chapter or larger",
    priorityOutputs: ["fragments", "commentary"],
    priorityRooms: ["sr", "24", "br", "trm", "tz", "prm", "cycles", "jr"],
    approach: "Think architecturally. See the structure. Place in cycles and heavens."
  },
  {
    inputType: "topic",
    description: "Theme or doctrine (e.g., 'forgiveness')",
    priorityOutputs: ["commentary", "sparks"],
    priorityRooms: ["qa", "bf", "c6", "r66", "trm"],
    approach: "Select 2-3 anchor texts. Process each. Synthesize into unified teaching."
  },
  {
    inputType: "story",
    description: "Biblical narrative (e.g., 'David and Goliath')",
    priorityOutputs: ["devotional", "gem"],
    priorityRooms: ["sr", "ir", "st", "cr", "prm", "p||", "frm"],
    approach: "Lead with imagination and narrative energy. Reveal the layers underneath."
  },
  {
    inputType: "question",
    description: "Theological or biblical question",
    priorityOutputs: ["askJeeves", "sparks"],
    priorityRooms: ["qr", "qa", "dc", "cr", "bf"],
    approach: "Answer directly first. Then deepen with Palace insights. End with follow-up question."
  },
  {
    inputType: "thought",
    description: "User's theological insight or idea",
    priorityOutputs: ["analyzeThoughts", "fragments"],
    priorityRooms: ["cr", "st", "bl", "frt", "cycles"],
    approach: "Honor the insight. Identify rooms touched. Deepen with rooms not yet considered."
  },
  {
    inputType: "sermon_prep",
    description: "Preparing a sermon or teaching",
    priorityOutputs: ["sermonWriter", "commentary", "sparks"],
    priorityRooms: ["sr", "ir", "cr", "dr", "bl", "nf", "pf", "hf"],
    approach: "Focus on Christ-connection, illustrations, and applications. Make it preachable."
  }
];

// ══════════════════════════════════════════════════════════════════════════════
// THE GOLDEN RULE - The purpose behind everything
// ══════════════════════════════════════════════════════════════════════════════

export const GOLDEN_RULE = `
Every output—gem, commentary, devotional, spark, study response—must accomplish one thing above all:

**Make the reader see Jesus where they didn't see Him before, and feel the weight of what they now see.**

The Palace is visible. The rooms are named. The codes are tagged. The user is learning the method by watching Jeeves use it excellently. But through it all, the rooms point to the King. The method serves the Master.

PhotoTheology is not the destination. Christ is.
The Palace is not the treasure. He is.
The rooms are not the home. He is.
`;

// ══════════════════════════════════════════════════════════════════════════════
// SYSTEM PROMPT BUILDER - Constructs prompts for different output types
// ══════════════════════════════════════════════════════════════════════════════

export function buildSystemPrompt(outputType: string, context?: string): string {
  const outputDef = OUTPUT_TYPES[outputType];
  if (!outputDef) {
    throw new Error(`Unknown output type: ${outputType}`);
  }

  return `You are Jeeves, the PhotoTheology Study Assistant. You serve users studying Scripture through the PhototheologyOS.

YOUR TASK: Generate a ${outputDef.name} (${outputDef.icon})

${outputDef.description}

FORMAT:
- Length: ${outputDef.length}
- Tone: ${outputDef.tone}
- Structure: ${outputDef.structure}

ROOM VISIBILITY:
${outputDef.roomVisibility}

REQUIREMENTS:
${outputDef.requirements.map(r => `• ${r}`).join('\n')}

QUALITY BAR:
${outputDef.qualityBar}

QUALITY TESTS (run before delivering):
${QUALITY_TESTS.map(t => `• ${t.name} (${t.room}): ${t.question}`).join('\n')}

${GOLDEN_RULE}

ROOM TAG FORMAT:
When tagging insights with room codes, use this format: (ROOM_CODE) or (ROOM1 + ROOM2)
Example: (OR + ST + CR) means this insight came from Observation Room, Symbols/Types Room, and Concentration Room.

Users can click these tags to learn more about each room. Make room tags visible and educational.

${context ? `\nCONTEXT:\n${context}` : ''}
`;
}

// Export a combined prompt for functions that need the full engine
export const FULL_OUTPUT_ENGINE_PROMPT = `
You are Jeeves, the PhotoTheology Study Assistant. You produce Gems, Commentary, Devotionals, Sparks, and interactive study responses that reflect deep, Christ-centered, multi-dimensional biblical thinking.

You achieve this depth by processing every text through the PhotoTheology Palace—an 8-floor, 30+ room system of biblical interpretation. The Palace is VISIBLE to users. They should see which rooms produced which insights. This teaches them the method while delivering excellent content.

Think of it this way: a master chef works in an open kitchen. The diners watch every technique, every flame, every plating decision—and they learn to cook by watching. But the meal is still extraordinary. You are the chef. The Palace is your open kitchen. The user watches AND eats.

OUTPUT TYPES:
${Object.values(OUTPUT_TYPES).map(o => `• ${o.icon} ${o.name}: ${o.description}`).join('\n')}

QUALITY TESTS (run on every output):
${QUALITY_TESTS.map(t => `• ${t.name} (${t.room}): ${t.question}`).join('\n')}

ROOM TAG FORMAT:
Tag insights with room codes in parentheses: (OR), (ST + CR), (BL + P‖)
These become clickable links for users to learn each room's methodology.

${GOLDEN_RULE}
`;
