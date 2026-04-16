// Chain Chess Data - All elements drawn from the Phototheology Palace

export interface PTRoom {
  id: string;
  name: string;
  tag: string;
  shortDescription: string;
  methodology: string;
  validationCriteria: string[];
  examples: string[];
}

export interface BiblicalBook {
  id: string;
  name: string;
  testament: "OT" | "NT";
  themes: string[];
  keyChapters: string[];
}

export interface PTPrinciple {
  id: string;
  name: string;
  shortName: string;
  description: string;
  validationCriteria: string[];
  subElements?: string[];
}

// PT ROOMS - Based on the 8-Floor Palace System
export const ptRooms: PTRoom[] = [
  // Floor 1: Furnishing - Memory & Visualization
  {
    id: "sr",
    name: "Story Room",
    tag: "SR",
    shortDescription: "Transform biblical events into memorable, sequential scenes",
    methodology: "Break narrative into 3-7 beats (major plot movements) arranged chronologically",
    validationCriteria: [
      "Must identify distinct narrative beats",
      "Must show chronological sequence",
      "Must use concrete nouns/verbs, not abstractions"
    ],
    examples: [
      "Genesis 37: Dream → Coat → Pit → Caravan → Egypt → Potiphar",
      "Exodus 14: Trapped → Fear → 'Stand Still' → Staff Raised → Waters Part → Crossing"
    ]
  },
  {
    id: "ir",
    name: "Imagination Room",
    tag: "IR",
    shortDescription: "Experience Scripture with all five senses",
    methodology: "Immerse yourself in a biblical scene using sight, sound, touch, smell, and taste",
    validationCriteria: [
      "Must include sensory details (at least 2-3 senses)",
      "Must create emotional/experiential engagement",
      "Should connect the scene to personal resonance"
    ],
    examples: [
      "Red Sea crossing: Wind whipping, roar of water, salt spray, towering walls",
      "Gethsemane: Crushing weight, cool night air, taste of copper fear"
    ]
  },
  {
    id: "24fps",
    name: "24FPS Room",
    tag: "24",
    shortDescription: "Create visual GPS for the Bible—one image per chapter",
    methodology: "Identify the MOST MEMORABLE element and convert to a single quirky visual",
    validationCriteria: [
      "Must be a single, memorable image",
      "Image must be findable/retrievable",
      "Focus on recall, not theological depth"
    ],
    examples: [
      "Gen 1 = Birthday Cake Earth",
      "Gen 3 = Snake + Apple + Clock"
    ]
  },
  {
    id: "gr",
    name: "Gems Room",
    tag: "GR",
    shortDescription: "Distill passages into portable, quotable insights",
    methodology: "Extract the 'diamond sentence' that captures the essence",
    validationCriteria: [
      "Must be concise and memorable",
      "Must capture the passage's core insight",
      "Should be applicable/transferable"
    ],
    examples: [
      "John 3: 'God's love is measured by what He gave, not what we deserve'",
      "Romans 8:28: 'Providence isn't comfort; it's coordination'"
    ]
  },
  // Floor 2: Framing - Context & Structure
  {
    id: "cr",
    name: "Concentration Room",
    tag: "CR",
    shortDescription: "Find Christ in every text",
    methodology: "Ask: Where is Christ? How does this point to, prepare for, or proceed from Him?",
    validationCriteria: [
      "Must explicitly identify Christ-connection",
      "Cannot leave text 'Christ-less'",
      "Should show how the text reveals Christ's person, work, or kingdom"
    ],
    examples: [
      "Joseph: 'Rejected by brothers, exalted to save them' = Christ",
      "Bronze serpent: 'Lifted up for healing by looking' = Cross"
    ]
  },
  {
    id: "qr",
    name: "Questions Room",
    tag: "QR",
    shortDescription: "Three-tiered interrogation method",
    methodology: "Ask intratextual, intertextual, and Phototheological questions",
    validationCriteria: [
      "Must include questions from at least 2 tiers",
      "Questions must be substantive, not superficial",
      "Should excavate, not just summarize"
    ],
    examples: [
      "Intratextual: Why 'lifted up' instead of 'crucified'?",
      "Intertextual: Where else is someone 'lifted up'?",
      "Phototheological: Which cycle does this belong to?"
    ]
  },
  {
    id: "dc",
    name: "Def-Com Room",
    tag: "DC",
    shortDescription: "Forensic analysis—definitions and commentary",
    methodology: "Examine Greek/Hebrew words and historical/cultural context",
    validationCriteria: [
      "Must include word study (Greek/Hebrew) OR historical context",
      "Should show how definition illuminates meaning",
      "Commentary must add interpretive value"
    ],
    examples: [
      "hypsoō = both physical elevation and exaltation in honor",
      "Roman crucifixion was designed for maximum visibility"
    ]
  },
  // Floor 3: Foundations - Cross-References
  {
    id: "pr",
    name: "Parallels Room",
    tag: "P‖",
    shortDescription: "Find mirrored actions across Scripture",
    methodology: "Identify events/actions that reflect each other structurally",
    validationCriteria: [
      "Must show structural correspondence",
      "Events must mirror (not just resemble)",
      "Should reveal how the second fulfills/restores the first"
    ],
    examples: [
      "Genesis 2:7 ↔ John 20:22: God breathes life → Christ breathes Spirit",
      "Eden ↔ New Jerusalem: Paradise lost → Paradise restored"
    ]
  },
  {
    id: "bl",
    name: "Blue Room (Sanctuary)",
    tag: "BL",
    shortDescription: "Trace texts back to Sanctuary furniture and services",
    methodology: "Connect passage to specific Sanctuary element: Altar, Laver, Lampstand, Table, Incense, Ark, etc.",
    validationCriteria: [
      "Must connect to specific Sanctuary furniture/service",
      "Should show how Sanctuary encodes the theology",
      "Connection must be substantive, not superficial"
    ],
    examples: [
      "Breath/Spirit → Lampstand's oil and flame",
      "Forgiveness → Day of Atonement scapegoat"
    ]
  },
  // Floor 4: Fire - Prophetic Patterns
  {
    id: "tz",
    name: "Time Zone Room",
    tag: "TZ",
    shortDescription: "Locate texts across six temporal-spatial zones",
    methodology: "Map: Heaven Past/Present/Future, Earth Past/Present/Future",
    validationCriteria: [
      "Must place text in at least 2 time zones",
      "Should show how the text spans/connects zones",
      "Temporal placement must be defensible"
    ],
    examples: [
      "Cross: Earth Past (type/serpent), Earth Present (Calvary), Heaven Present (intercession)",
      "Lamb slain 'from foundation of world' = Heaven Past"
    ]
  },
  {
    id: "prm",
    name: "Patterns Room",
    tag: "PRm",
    shortDescription: "Track God's fingerprints—motifs that repeat with variation",
    methodology: "Identify recurring patterns: 3 days, 40 days, lifted up, etc.",
    validationCriteria: [
      "Must identify a genuine biblical pattern",
      "Should show multiple instances of the pattern",
      "Pattern must illuminate the current text"
    ],
    examples: [
      "3 days: Jonah, Jesus, 'third day' Abraham saw Moriah",
      "40: Rain, wilderness, Sinai, temptation"
    ]
  },
  // Floor 5: Fruit - Application
  {
    id: "frt",
    name: "Fruit Room",
    tag: "FRt",
    shortDescription: "Test interpretation by its yield",
    methodology: "Does the interpretation produce the fruit of the Spirit?",
    validationCriteria: [
      "Must connect to practical/spiritual fruit",
      "Should show how text produces Christlike character",
      "Application must be grounded in exegesis"
    ],
    examples: [
      "Cross produces: love, joy, peace, patience, kindness...",
      "Each fruit maps to a crucifixion moment"
    ]
  },
  {
    id: "mr",
    name: "Meditation Room",
    tag: "MR",
    shortDescription: "Slow, phrase-by-phrase immersion",
    methodology: "Marinate, don't microwave. Pause at each clause.",
    validationCriteria: [
      "Must demonstrate slow, reflective engagement",
      "Should unpack individual words/phrases",
      "Depth over speed"
    ],
    examples: [
      "Pause after 'And I' — personal, not systemic",
      "Pause after 'lifted up' — feel the nails"
    ]
  },
  // Additional rooms
  {
    id: "or",
    name: "Observation Room",
    tag: "OR",
    shortDescription: "What does the text actually say?",
    methodology: "List every observable detail before interpretation",
    validationCriteria: [
      "Must list specific textual details",
      "Observation before interpretation",
      "Nothing added, nothing missed"
    ],
    examples: [
      "Who, What, When, Where, Why, How",
      "Repeated words, contrasts, comparisons"
    ]
  },
  {
    id: "dr",
    name: "Dimensions Room",
    tag: "DR",
    shortDescription: "Apply the 5D framework (1D-5D)",
    methodology: "Read text through: 1D (literal), 2D (historical), 3D (Christological), 4D (personal), 5D (eschatological)",
    validationCriteria: [
      "Must apply at least 2 dimensions",
      "Dimensions must be correctly applied",
      "Should show how dimensions enrich meaning"
    ],
    examples: [
      "Exodus: 1D=historical event, 3D=Christ delivers from sin, 5D=final deliverance"
    ]
  }
];

// BIBLICAL BOOKS
export const biblicalBooks: BiblicalBook[] = [
  // Pentateuch
  { id: "genesis", name: "Genesis", testament: "OT", themes: ["Creation", "Fall", "Covenant", "Patriarchs"], keyChapters: ["1", "3", "12", "22", "37"] },
  { id: "exodus", name: "Exodus", testament: "OT", themes: ["Deliverance", "Law", "Tabernacle", "Passover"], keyChapters: ["3", "12", "14", "20", "40"] },
  { id: "leviticus", name: "Leviticus", testament: "OT", themes: ["Sacrifice", "Holiness", "Atonement", "Priesthood"], keyChapters: ["16", "17", "23"] },
  { id: "numbers", name: "Numbers", testament: "OT", themes: ["Wilderness", "Rebellion", "Faithfulness"], keyChapters: ["14", "21"] },
  { id: "deuteronomy", name: "Deuteronomy", testament: "OT", themes: ["Covenant renewal", "Law review", "Blessings/curses"], keyChapters: ["6", "28", "30"] },
  // Historical
  { id: "joshua", name: "Joshua", testament: "OT", themes: ["Conquest", "Promised land", "Faithfulness"], keyChapters: ["1", "24"] },
  { id: "judges", name: "Judges", testament: "OT", themes: ["Cycles of sin", "Deliverance", "Judges"], keyChapters: ["2", "17"] },
  { id: "ruth", name: "Ruth", testament: "OT", themes: ["Kinsman redeemer", "Loyalty", "Providence"], keyChapters: ["1", "4"] },
  { id: "1samuel", name: "1 Samuel", testament: "OT", themes: ["Kingdom", "Rejection", "David"], keyChapters: ["8", "16", "17"] },
  { id: "2samuel", name: "2 Samuel", testament: "OT", themes: ["David's reign", "Sin", "Covenant"], keyChapters: ["7", "11", "12"] },
  { id: "1kings", name: "1 Kings", testament: "OT", themes: ["Solomon", "Temple", "Division"], keyChapters: ["3", "8", "18"] },
  { id: "2kings", name: "2 Kings", testament: "OT", themes: ["Prophets", "Exile", "Judgment"], keyChapters: ["2", "17", "25"] },
  { id: "nehemiah", name: "Nehemiah", testament: "OT", themes: ["Restoration", "Rebuilding", "Renewal"], keyChapters: ["1", "8"] },
  { id: "esther", name: "Esther", testament: "OT", themes: ["Providence", "Deliverance", "Reversal"], keyChapters: ["4", "8"] },
  // Wisdom
  { id: "job", name: "Job", testament: "OT", themes: ["Suffering", "Sovereignty", "Faith"], keyChapters: ["1", "38", "42"] },
  { id: "psalms", name: "Psalms", testament: "OT", themes: ["Worship", "Lament", "Messiah", "Kingdom"], keyChapters: ["2", "22", "23", "51", "110", "119"] },
  { id: "proverbs", name: "Proverbs", testament: "OT", themes: ["Wisdom", "Fear of Lord", "Practical living"], keyChapters: ["1", "3", "8", "31"] },
  { id: "ecclesiastes", name: "Ecclesiastes", testament: "OT", themes: ["Vanity", "Meaning", "Fear God"], keyChapters: ["1", "3", "12"] },
  { id: "songofsolomon", name: "Song of Solomon", testament: "OT", themes: ["Love", "Marriage", "Christ and Church"], keyChapters: ["2", "8"] },
  // Major Prophets
  { id: "isaiah", name: "Isaiah", testament: "OT", themes: ["Messiah", "Servant", "Salvation", "Judgment"], keyChapters: ["6", "9", "40", "52", "53", "61"] },
  { id: "jeremiah", name: "Jeremiah", testament: "OT", themes: ["Judgment", "New covenant", "Weeping"], keyChapters: ["1", "29", "31"] },
  { id: "lamentations", name: "Lamentations", testament: "OT", themes: ["Grief", "Faithfulness", "Hope"], keyChapters: ["3"] },
  { id: "ezekiel", name: "Ezekiel", testament: "OT", themes: ["Glory", "Judgment", "Restoration", "Temple"], keyChapters: ["1", "37", "40"] },
  { id: "daniel", name: "Daniel", testament: "OT", themes: ["Prophecy", "Kingdoms", "Faithfulness", "End times"], keyChapters: ["2", "7", "9", "12"] },
  // Minor Prophets
  { id: "hosea", name: "Hosea", testament: "OT", themes: ["Unfaithfulness", "Restoration", "Love"], keyChapters: ["1", "11"] },
  { id: "joel", name: "Joel", testament: "OT", themes: ["Day of Lord", "Spirit", "Restoration"], keyChapters: ["2"] },
  { id: "jonah", name: "Jonah", testament: "OT", themes: ["Mercy", "Rebellion", "Repentance"], keyChapters: ["1", "2", "4"] },
  { id: "micah", name: "Micah", testament: "OT", themes: ["Justice", "Messiah", "Restoration"], keyChapters: ["5", "6"] },
  { id: "habakkuk", name: "Habakkuk", testament: "OT", themes: ["Faith", "Sovereignty", "Justice"], keyChapters: ["2", "3"] },
  { id: "zechariah", name: "Zechariah", testament: "OT", themes: ["Messiah", "Restoration", "End times"], keyChapters: ["9", "12", "14"] },
  { id: "malachi", name: "Malachi", testament: "OT", themes: ["Covenant faithfulness", "Messenger", "Judgment"], keyChapters: ["3", "4"] },
  // Gospels
  { id: "matthew", name: "Matthew", testament: "NT", themes: ["King", "Kingdom", "Fulfillment", "Messiah"], keyChapters: ["5", "13", "24", "28"] },
  { id: "mark", name: "Mark", testament: "NT", themes: ["Servant", "Action", "Suffering", "Discipleship"], keyChapters: ["8", "10", "15"] },
  { id: "luke", name: "Luke", testament: "NT", themes: ["Son of Man", "Compassion", "Prayer", "Spirit"], keyChapters: ["4", "15", "24"] },
  { id: "john", name: "John", testament: "NT", themes: ["Son of God", "Signs", "Belief", "Life"], keyChapters: ["1", "3", "6", "14", "17", "20"] },
  // Acts
  { id: "acts", name: "Acts", testament: "NT", themes: ["Spirit", "Church", "Mission", "Gospel spread"], keyChapters: ["1", "2", "9", "15", "17"] },
  // Pauline Epistles
  { id: "romans", name: "Romans", testament: "NT", themes: ["Gospel", "Justification", "Sanctification", "Glory"], keyChapters: ["1", "3", "5", "6", "8", "12"] },
  { id: "1corinthians", name: "1 Corinthians", testament: "NT", themes: ["Unity", "Gifts", "Love", "Resurrection"], keyChapters: ["1", "12", "13", "15"] },
  { id: "2corinthians", name: "2 Corinthians", testament: "NT", themes: ["Ministry", "Weakness", "Comfort", "Glory"], keyChapters: ["3", "4", "5", "12"] },
  { id: "galatians", name: "Galatians", testament: "NT", themes: ["Freedom", "Grace", "Spirit", "Faith"], keyChapters: ["2", "3", "5"] },
  { id: "ephesians", name: "Ephesians", testament: "NT", themes: ["Church", "Unity", "Armor", "In Christ"], keyChapters: ["1", "2", "4", "6"] },
  { id: "philippians", name: "Philippians", testament: "NT", themes: ["Joy", "Christ-mind", "Unity", "Press on"], keyChapters: ["1", "2", "3", "4"] },
  { id: "colossians", name: "Colossians", testament: "NT", themes: ["Supremacy of Christ", "Fullness", "New life"], keyChapters: ["1", "2", "3"] },
  { id: "hebrews", name: "Hebrews", testament: "NT", themes: ["Christ's superiority", "High Priest", "Faith", "Rest"], keyChapters: ["1", "4", "7", "10", "11", "12"] },
  { id: "james", name: "James", testament: "NT", themes: ["Faith and works", "Wisdom", "Trials", "Tongue"], keyChapters: ["1", "2", "3"] },
  { id: "1peter", name: "1 Peter", testament: "NT", themes: ["Suffering", "Hope", "Holy living", "Submission"], keyChapters: ["1", "2", "3"] },
  { id: "1john", name: "1 John", testament: "NT", themes: ["Love", "Light", "Life", "Assurance"], keyChapters: ["1", "3", "4"] },
  { id: "revelation", name: "Revelation", testament: "NT", themes: ["End times", "Lamb", "Victory", "New creation"], keyChapters: ["1", "4", "5", "12", "19", "20", "21", "22"] }
];

// PT PRINCIPLES - Based on the Phototheology framework
export const ptPrinciples: PTPrinciple[] = [
  {
    id: "three-heavens",
    name: "The Three Heavens Principle",
    shortName: "1H, 2H, 3H",
    description: "Scripture operates across three 'Day of the Lord' horizons: 1H (DoL¹/NE¹) = typological/OT foreshadowing, 2H (DoL²/NE²) = Christ-event/Church age, 3H (DoL³/NE³) = eschatological/eternal",
    validationCriteria: [
      "Must identify which heaven(s) the text operates in",
      "Should show progression or connection across heavens",
      "Placement must be defensible from context"
    ],
    subElements: ["1H - First Heaven/DoL¹", "2H - Second Heaven/DoL²", "3H - Third Heaven/DoL³"]
  },
  {
    id: "eight-cycles",
    name: "The Eight Cycles",
    shortName: "@Cycles",
    description: "Scripture reveals eight major cycles of God's redemptive work, each with: Fall → Covenant → Sanctuary → Enemy → Restoration",
    validationCriteria: [
      "Must correctly identify the cycle",
      "Should show how text fits the cycle's pattern",
      "Connection to cycle structure must be clear"
    ],
    subElements: ["@Ed (Edenic)", "@No (Noahic)", "@Ab (Abrahamic)", "@Mo (Mosaic)", "@Da (Davidic)", "@Ex (Exilic)", "@CyC (Cyrus-Christ)", "@Re (Remnant)"]
  },
  {
    id: "five-dimensions",
    name: "The Five Dimensions",
    shortName: "5D",
    description: "Every text can be read through five lenses: 1D (literal/historical), 2D (moral/typological), 3D (Christological/allegorical), 4D (personal/tropological), 5D (eschatological/anagogical)",
    validationCriteria: [
      "Must apply at least 2 dimensions correctly",
      "Dimensions should build on each other",
      "Application must be grounded in the text"
    ],
    subElements: ["1D - Literal", "2D - Moral/Historical", "3D - Christological", "4D - Personal", "5D - Eschatological"]
  },
  {
    id: "repeat-enlarge",
    name: "Repeat & Enlarge",
    shortName: "R&E",
    description: "Scripture often presents a summary, then enlarges with details. Recognizing this pattern prevents misinterpretation.",
    validationCriteria: [
      "Must show the summary/enlargement structure",
      "Should demonstrate how details expand the summary",
      "Pattern must be demonstrably present"
    ],
    subElements: []
  },
  {
    id: "type-antitype",
    name: "Type & Antitype",
    shortName: "T→AT",
    description: "OT shadows (types) find their substance (antitypes) in Christ and His kingdom. The antitype is always greater.",
    validationCriteria: [
      "Must identify genuine type-antitype relationship",
      "Should show how antitype exceeds/fulfills the type",
      "Connection must be intentional, not incidental"
    ],
    subElements: []
  },
  {
    id: "day-of-lord",
    name: "Day of the Lord Horizons",
    shortName: "DoL",
    description: "The 'Day of the Lord' appears in multiple horizons throughout Scripture—local judgments foreshadowing ultimate judgment.",
    validationCriteria: [
      "Must identify specific DoL reference or pattern",
      "Should show how local judgment prefigures cosmic",
      "Horizons must be correctly distinguished"
    ],
    subElements: ["Local DoL", "National DoL", "Cosmic DoL"]
  },
  {
    id: "chiasm",
    name: "Chiastic Structure",
    shortName: "Chiasm",
    description: "Hebrew literary device where ideas are arranged in A-B-C-B'-A' pattern, with the center being the climax.",
    validationCriteria: [
      "Must demonstrate actual chiastic arrangement",
      "Center point must be identifiable",
      "Parallel elements must genuinely correspond"
    ],
    subElements: []
  },
  {
    id: "sanctuary-hermeneutic",
    name: "Sanctuary Hermeneutic",
    shortName: "Sanctuary",
    description: "The Hebrew Sanctuary provides the interpretive framework for understanding salvation, Christ's ministry, and eschatology.",
    validationCriteria: [
      "Must connect to specific Sanctuary element",
      "Should show how Sanctuary structure illuminates meaning",
      "Connection must be theologically coherent"
    ],
    subElements: ["Court", "Holy Place", "Most Holy Place", "Furniture", "Services"]
  }
];

// CHALLENGE CATEGORIES - For game selection
export const challengeCategories = {
  rooms: ptRooms.map(r => ({ id: r.id, name: r.name, category: "PT Room" })),
  books: biblicalBooks.map(b => ({ id: b.id, name: b.name, category: "Biblical Book" })),
  principles: ptPrinciples.map(p => ({ id: p.id, name: p.name, shortName: p.shortName, category: "PT Principle" }))
};

// GAME RULES
export const chainChessRules = {
  objective: "Demonstrate mastery of Phototheology by connecting verses through PT Rooms, Biblical Books, and PT Principles",
  winCondition: "Match continues until one player accumulates three failed connections (strikes)",
  strikesForLoss: 3,
  roundsForTiebreaker: 10,
  validConnectionCriteria: [
    "Genuinely engages the assigned Room, Book, or Principle (not surface mention)",
    "Extends or deepens the previous comment (not merely restates)",
    "Demonstrates actual PT methodology (not generic Bible study)"
  ],
  invalidConnectionCriteria: [
    "Only name-drops the element without substantive use",
    "Contradicts PT guardrails (e.g., missing Christ-centeredness, wrong cycle placement)",
    "Fails to logically bridge from the previous comment"
  ],
  bonusPointCriteria: [
    "Exceptional synthesis across multiple PT elements",
    "Discovering a connection neither player had seen before",
    "Completing a full cycle through all three categories without a strike"
  ]
};

// Helper functions
export function getRandomRoom(): PTRoom {
  return ptRooms[Math.floor(Math.random() * ptRooms.length)];
}

export function getRandomBook(): BiblicalBook {
  return biblicalBooks[Math.floor(Math.random() * biblicalBooks.length)];
}

export function getRandomPrinciple(): PTPrinciple {
  return ptPrinciples[Math.floor(Math.random() * ptPrinciples.length)];
}

export function getRandomChallenge(): { type: "room" | "book" | "principle"; item: PTRoom | BiblicalBook | PTPrinciple } {
  const types = ["room", "book", "principle"] as const;
  const type = types[Math.floor(Math.random() * types.length)];

  switch (type) {
    case "room": return { type, item: getRandomRoom() };
    case "book": return { type, item: getRandomBook() };
    case "principle": return { type, item: getRandomPrinciple() };
  }
}

export function getRoomById(id: string): PTRoom | undefined {
  return ptRooms.find(r => r.id === id);
}

export function getBookById(id: string): BiblicalBook | undefined {
  return biblicalBooks.find(b => b.id === id);
}

export function getPrincipleById(id: string): PTPrinciple | undefined {
  return ptPrinciples.find(p => p.id === id);
}
