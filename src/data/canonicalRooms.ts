// Canonical Room Registry - Single source of truth for all valid Palace room codes
// Merged from: CommentaryPanel PRINCIPLE_OPTIONS, palaceData.ts rooms, pt-verse-analysis PALACE_ROOMS

import type { Genre } from "@/types/preacherMentor";

export interface CanonicalRoom {
  code: string;
  name: string;
  floor: number;
  floorName: string;
  method: string;
  signalKeywords: string[];
  genreAffinity: Genre[];
  promptTemplate: string;
  color: string;
}

const rooms: CanonicalRoom[] = [
  // Floor 1 - Furnishing (Memory & Visualization)
  {
    code: "sr",
    name: "Story Room",
    floor: 1,
    floorName: "Furnishing",
    method: "Store the story as a vivid mental movie — collect scenes before you interpret them",
    signalKeywords: ["story", "narrative", "journey", "traveled", "went", "came to", "said to"],
    genreAffinity: ["narrative", "gospel"],
    promptTemplate: "What scenes would you store from this passage? Picture the mental movie — who is there, what happens, what is said, what is felt?",
    color: "gradient-palace",
  },
  {
    code: "ir",
    name: "Imagination Room",
    floor: 1,
    floorName: "Furnishing",
    method: "Step inside the scene - feel, hear, smell, experience",
    signalKeywords: ["saw", "heard", "felt", "touched", "voice", "appeared", "vision"],
    genreAffinity: ["narrative", "gospel", "prophecy"],
    promptTemplate: "What sensory details in this text invite you to step inside the scene?",
    color: "gradient-ocean",
  },
  {
    code: "24fps",
    name: "24FPS Room",
    floor: 1,
    floorName: "Furnishing",
    method: "Create one symbolic image for this chapter",
    signalKeywords: ["image", "picture", "scene", "symbol", "sign"],
    genreAffinity: ["narrative", "prophecy", "apocalyptic"],
    promptTemplate: "What single image would capture the theological essence of this passage?",
    color: "gradient-royal",
  },
  {
    code: "br",
    name: "Bible Rendered",
    floor: 1,
    floorName: "Furnishing",
    method: "Map into the 24-chapter block pattern",
    signalKeywords: ["chapter", "structure", "pattern", "block", "section"],
    genreAffinity: ["narrative", "epistle", "prophecy"],
    promptTemplate: "Where does this passage sit within the broader structural pattern of its book?",
    color: "gradient-sunset",
  },
  {
    code: "tr",
    name: "Translation Room",
    floor: 1,
    floorName: "Furnishing",
    method: "Convert abstract words into concrete images",
    signalKeywords: ["meaning", "word", "translate", "term", "language", "definition"],
    genreAffinity: ["epistle", "wisdom", "doctrinal"],
    promptTemplate: "What abstract theological concepts here need concrete, memorable imagery?",
    color: "gradient-warmth",
  },
  {
    code: "gr",
    name: "Gems Room",
    floor: 1,
    floorName: "Furnishing",
    method: "Extract striking insights that shine with clarity",
    signalKeywords: ["insight", "gem", "striking", "remarkable", "key"],
    genreAffinity: ["narrative", "epistle", "poetry", "wisdom"],
    promptTemplate: "What unexpected gem of insight is hidden in this verse?",
    color: "gradient-palace",
  },

  // Floor 2 - Investigation (Detective Work)
  {
    code: "or",
    name: "Observation Room",
    floor: 2,
    floorName: "Investigation",
    method: "Log 30-50 details without interpretation",
    signalKeywords: ["detail", "observe", "notice", "see", "count", "list", "describe"],
    genreAffinity: ["narrative", "gospel", "law"],
    promptTemplate: "What details in this passage often go unnoticed on first reading?",
    color: "gradient-ocean",
  },
  {
    code: "dc",
    name: "Def-Com Room",
    floor: 2,
    floorName: "Investigation",
    method: "Analyze Greek/Hebrew definitions and cultural context",
    signalKeywords: ["hebrew", "greek", "definition", "original", "word study", "culture", "context"],
    genreAffinity: ["epistle", "doctrinal", "law", "wisdom"],
    promptTemplate: "Which key word in the original language reshapes how we understand this verse?",
    color: "gradient-royal",
  },
  {
    code: "st",
    name: "Symbols/Types Room",
    floor: 2,
    floorName: "Investigation",
    method: "Identify typological patterns pointing to Christ",
    signalKeywords: ["type", "symbol", "shadow", "antitype", "foreshadow", "figure", "represent"],
    genreAffinity: ["narrative", "prophecy", "apocalyptic", "law"],
    promptTemplate: "What typological pattern in this passage points forward to Christ's work?",
    color: "gradient-sunset",
  },
  {
    code: "qr",
    name: "Questions Room",
    floor: 2,
    floorName: "Investigation",
    method: "Ask intratextual, intertextual, and PT questions",
    signalKeywords: ["question", "why", "how", "what", "when", "who", "where"],
    genreAffinity: ["narrative", "epistle", "gospel", "wisdom"],
    promptTemplate: "What question does this passage raise that only the broader canon can answer?",
    color: "gradient-warmth",
  },
  {
    code: "qa",
    name: "Q&A Chains Room",
    floor: 2,
    floorName: "Investigation",
    method: "Cross-reference Scripture to answer Scripture",
    signalKeywords: ["answer", "cross-reference", "compare", "parallel", "echo"],
    genreAffinity: ["epistle", "doctrinal", "prophecy"],
    promptTemplate: "Where else in Scripture is this question asked — and answered differently?",
    color: "gradient-palace",
  },

  // Floor 3 - Freestyle (Connections)
  {
    code: "nf",
    name: "Nature Freestyle",
    floor: 3,
    floorName: "Freestyle",
    method: "Connect to creation illustrations",
    signalKeywords: ["nature", "creation", "earth", "sky", "water", "tree", "seed", "harvest"],
    genreAffinity: ["poetry", "wisdom", "gospel"],
    promptTemplate: "What natural phenomenon illustrates the spiritual principle in this passage?",
    color: "gradient-ocean",
  },
  {
    code: "pf",
    name: "Personal Freestyle",
    floor: 3,
    floorName: "Freestyle",
    method: "Apply to personal life experiences",
    signalKeywords: ["personal", "life", "experience", "heart", "soul", "daily", "walk"],
    genreAffinity: ["epistle", "wisdom", "poetry", "gospel"],
    promptTemplate: "How does this passage intersect with the lived experience of believers today?",
    color: "gradient-royal",
  },
  {
    code: "bf",
    name: "Bible Freestyle",
    floor: 3,
    floorName: "Freestyle",
    method: "Trace verse genetics - siblings, cousins, relatives",
    signalKeywords: ["genetics", "related", "sibling", "cousin", "family", "lineage"],
    genreAffinity: ["narrative", "epistle", "gospel", "doctrinal"],
    promptTemplate: "What are this verse's closest 'relatives' — passages that share its DNA?",
    color: "gradient-sunset",
  },
  {
    code: "hf",
    name: "History/Social Freestyle",
    floor: 3,
    floorName: "Freestyle",
    method: "Find historical parallels and lessons",
    signalKeywords: ["history", "empire", "king", "nation", "social", "culture", "period"],
    genreAffinity: ["narrative", "prophecy", "apocalyptic"],
    promptTemplate: "What historical event mirrors the dynamics in this passage?",
    color: "gradient-warmth",
  },
  {
    code: "lr",
    name: "Listening Room",
    floor: 3,
    floorName: "Freestyle",
    method: "Actively listen for connections",
    signalKeywords: ["listen", "hear", "voice", "still", "quiet", "speak", "word"],
    genreAffinity: ["poetry", "wisdom", "prophecy"],
    promptTemplate: "What is the Holy Spirit emphasizing when you sit quietly with this text?",
    color: "gradient-palace",
  },

  // Floor 4 - Next Level (Christ-Centered Depth)
  {
    code: "cr",
    name: "Concentration Room",
    floor: 4,
    floorName: "Next Level",
    method: "Locate Christ in this text",
    signalKeywords: ["christ", "jesus", "messiah", "lord", "savior", "lamb", "son of god"],
    genreAffinity: ["narrative", "epistle", "gospel", "prophecy", "doctrinal"],
    promptTemplate: "Where is Christ hidden or revealed in this passage?",
    color: "gradient-ocean",
  },
  {
    code: "dr",
    name: "Dimensions Room",
    floor: 4,
    floorName: "Next Level",
    method: "Apply 5D: Literal, Christ, Me, Church, Heaven",
    signalKeywords: ["dimension", "layer", "level", "literal", "spiritual", "application"],
    genreAffinity: ["narrative", "epistle", "gospel", "prophecy"],
    promptTemplate: "How does this passage read differently through each of the 5 dimensions?",
    color: "gradient-royal",
  },
  {
    code: "c6",
    name: "Connect-6",
    floor: 4,
    floorName: "Next Level",
    method: "Classify by genre and apply its rules",
    signalKeywords: ["genre", "classify", "type", "form", "literary", "style"],
    genreAffinity: ["narrative", "epistle", "poetry", "prophecy", "wisdom", "law"],
    promptTemplate: "What genre-specific interpretive rules apply to this passage?",
    color: "gradient-sunset",
  },
  {
    code: "trm",
    name: "Theme Room",
    floor: 4,
    floorName: "Next Level",
    method: "Place on Sanctuary/Great Controversy/Gospel walls",
    signalKeywords: ["theme", "wall", "sanctuary", "controversy", "gospel", "great"],
    genreAffinity: ["narrative", "prophecy", "doctrinal", "apocalyptic"],
    promptTemplate: "Which theological wall does this passage belong on — and what does it add to that wall?",
    color: "gradient-warmth",
  },
  {
    code: "tz",
    name: "Time Zone",
    floor: 4,
    floorName: "Next Level",
    method: "Assign past/present/future + heaven/earth",
    signalKeywords: ["time", "past", "present", "future", "heaven", "earth", "eternal"],
    genreAffinity: ["prophecy", "apocalyptic", "narrative"],
    promptTemplate: "Where does this passage sit on the heaven/earth and past/present/future grid?",
    color: "gradient-palace",
  },
  {
    code: "prm",
    name: "Patterns Room",
    floor: 4,
    floorName: "Next Level",
    method: "Identify recurring motifs (40 days, 3 days, etc.)",
    signalKeywords: ["pattern", "motif", "recurring", "cycle", "number", "forty", "seven", "three"],
    genreAffinity: ["narrative", "prophecy", "apocalyptic"],
    promptTemplate: "What recurring biblical pattern does this passage participate in?",
    color: "gradient-ocean",
  },
  {
    code: "p||",
    name: "Parallels Room",
    floor: 4,
    floorName: "Next Level",
    method: "Find mirrored actions across time",
    signalKeywords: ["parallel", "mirror", "echo", "repeat", "correspond", "match"],
    genreAffinity: ["narrative", "prophecy", "gospel"],
    promptTemplate: "What event in another era mirrors what happens in this passage?",
    color: "gradient-royal",
  },
  {
    code: "frt",
    name: "Fruit Room",
    floor: 4,
    floorName: "Next Level",
    method: "Test: Does it produce Gal 5:22-23 fruit?",
    signalKeywords: ["fruit", "spirit", "love", "joy", "peace", "patience", "kindness"],
    genreAffinity: ["epistle", "gospel", "wisdom"],
    promptTemplate: "What spiritual fruit does this passage cultivate in the life of the reader?",
    color: "gradient-sunset",
  },
  {
    code: "cec",
    name: "Christ in Every Chapter",
    floor: 4,
    floorName: "Next Level",
    method: "Find Christ's title/role and what He does in this text",
    signalKeywords: ["christ", "title", "role", "every chapter", "throughout"],
    genreAffinity: ["narrative", "epistle", "gospel", "prophecy", "law"],
    promptTemplate: "What title or role does Christ hold in this chapter, and how does He act?",
    color: "gradient-warmth",
  },
  {
    code: "r66",
    name: "Room 66",
    floor: 4,
    floorName: "Next Level",
    method: "Trace how this theme develops Genesis to Revelation",
    signalKeywords: ["genesis", "revelation", "trace", "develop", "canon", "bible-wide"],
    genreAffinity: ["narrative", "prophecy", "doctrinal", "apocalyptic"],
    promptTemplate: "How does this theme develop from its first mention in Genesis to its climax in Revelation?",
    color: "gradient-palace",
  },

  // Floor 5 - Vision (Prophecy & Sanctuary)
  {
    code: "bl",
    name: "Blue Room (Sanctuary)",
    floor: 5,
    floorName: "Vision",
    method: "Map to sanctuary furniture and services",
    signalKeywords: ["sanctuary", "temple", "tabernacle", "priest", "sacrifice", "altar", "holy", "veil", "ark", "lampstand", "incense", "atonement"],
    genreAffinity: ["law", "prophecy", "doctrinal", "narrative"],
    promptTemplate: "Which sanctuary article or service does this passage illuminate?",
    color: "gradient-ocean",
  },
  {
    code: "pr",
    name: "Prophecy Room",
    floor: 5,
    floorName: "Vision",
    method: "Connect to prophetic timeline and symbols",
    signalKeywords: ["prophecy", "prophetic", "vision", "dream", "beast", "horn", "seal", "trumpet", "time", "days", "weeks", "years"],
    genreAffinity: ["prophecy", "apocalyptic"],
    promptTemplate: "Where does this passage sit on the prophetic timeline and what does it reveal?",
    color: "gradient-royal",
  },
  {
    code: "3a",
    name: "Three Angels",
    floor: 5,
    floorName: "Vision",
    method: "Apply to the final gospel messages",
    signalKeywords: ["angel", "message", "judgment", "babylon", "beast", "mark", "worship", "commandment", "endtime"],
    genreAffinity: ["prophecy", "apocalyptic", "doctrinal"],
    promptTemplate: "How does this passage connect to the Three Angels' Messages of Revelation 14?",
    color: "gradient-sunset",
  },
  {
    code: "fe",
    name: "Feasts Room",
    floor: 5,
    floorName: "Vision",
    method: "Connect to Israel's feast calendar",
    signalKeywords: ["feast", "passover", "pentecost", "tabernacle", "atonement", "firstfruit", "trumpet", "unleavened"],
    genreAffinity: ["law", "narrative", "prophecy"],
    promptTemplate: "Which feast of Israel does this passage typologically fulfill or illuminate?",
    color: "gradient-warmth",
  },

  // Floor 6 - Three Heavens (Cycles & Cosmic Context)
  {
    code: "1h",
    name: "First Heaven (DoL1/NE1)",
    floor: 6,
    floorName: "Three Heavens",
    method: "Babylon destroys Jerusalem (586 BC) → Post-exilic restoration under Cyrus",
    signalKeywords: ["exile", "babylon", "captivity", "cyrus", "restoration", "rebuild", "return"],
    genreAffinity: ["narrative", "prophecy"],
    promptTemplate: "How does the Babylonian exile-restoration cycle illuminate this passage?",
    color: "gradient-palace",
  },
  {
    code: "2h",
    name: "Second Heaven (DoL2/NE2)",
    floor: 6,
    floorName: "Three Heavens",
    method: "Rome destroys Jerusalem (70 AD) → New-Covenant/heavenly sanctuary order",
    signalKeywords: ["rome", "destroy", "temple", "new covenant", "heavenly", "church"],
    genreAffinity: ["gospel", "epistle", "prophecy"],
    promptTemplate: "How does the destruction of Jerusalem in 70 AD and the new covenant reality reshape this text?",
    color: "gradient-ocean",
  },
  {
    code: "3h",
    name: "Third Heaven (DoL3/NE3)",
    floor: 6,
    floorName: "Three Heavens",
    method: "Final cosmic judgment (Rev 20) → Literal New Creation (Rev 21-22)",
    signalKeywords: ["new earth", "new creation", "judgment", "second coming", "eternal", "paradise"],
    genreAffinity: ["prophecy", "apocalyptic"],
    promptTemplate: "How does the final judgment and new creation lens transform this passage's meaning?",
    color: "gradient-royal",
  },
  {
    code: "jr",
    name: "Juice Room",
    floor: 6,
    floorName: "Three Heavens",
    method: "Squeeze text through ALL Palace principles",
    signalKeywords: ["juice", "squeeze", "comprehensive", "every room", "all principles"],
    genreAffinity: ["narrative", "gospel", "epistle", "poetry", "prophecy", "apocalyptic", "wisdom", "law", "doctrinal"],
    promptTemplate: "Squeeze this passage through every Palace room — extract every drop of meaning like an orange under a juicer.",
    color: "gradient-palace",
  },

  // Floor 7 - Spiritual & Emotional (Transformation)
  {
    code: "frm",
    name: "Fire Room",
    floor: 7,
    floorName: "Transformation",
    method: "Feel the emotional weight - let it convict",
    signalKeywords: ["fire", "conviction", "emotion", "weight", "burden", "passion", "zeal"],
    genreAffinity: ["prophecy", "poetry", "gospel"],
    promptTemplate: "What emotional weight does this passage carry, and what conviction does it press on the heart?",
    color: "gradient-royal",
  },
  {
    code: "mr",
    name: "Meditation Room",
    floor: 7,
    floorName: "Transformation",
    method: "Slow marination - repeat until saturated",
    signalKeywords: ["meditate", "ponder", "dwell", "slow", "deep", "saturate", "abide"],
    genreAffinity: ["poetry", "wisdom", "gospel"],
    promptTemplate: "What phrase in this passage rewards slow, repeated meditation?",
    color: "gradient-sunset",
  },
  {
    code: "srm",
    name: "Speed Room",
    floor: 7,
    floorName: "Transformation",
    method: "Rapid-fire connections in 60 seconds",
    signalKeywords: ["quick", "rapid", "connection", "link", "fast", "flash"],
    genreAffinity: ["narrative", "gospel", "epistle"],
    promptTemplate: "What rapid-fire associations does this verse trigger across the canon?",
    color: "gradient-warmth",
  },
];

// Build the canonical map
export const CANONICAL_ROOMS: ReadonlyMap<string, CanonicalRoom> = new Map(
  rooms.map((r) => [r.code, r])
);

// Frozen array of valid codes for dropdown population
export const ROOM_CODES: readonly string[] = Object.freeze(
  rooms.map((r) => r.code)
);

// Validators
export function isValidRoomCode(code: string): boolean {
  return CANONICAL_ROOMS.has(code.toLowerCase());
}

export function getRoomByCode(code: string): CanonicalRoom | undefined {
  return CANONICAL_ROOMS.get(code.toLowerCase());
}

export function formatRoomDisplay(code: string): string {
  const room = CANONICAL_ROOMS.get(code.toLowerCase());
  if (!room) return code;
  return `${room.name} (${room.code.toUpperCase()})`;
}

// Group rooms by floor for display
export function getRoomsByFloor(): Map<number, CanonicalRoom[]> {
  const byFloor = new Map<number, CanonicalRoom[]>();
  for (const room of rooms) {
    const existing = byFloor.get(room.floor) || [];
    existing.push(room);
    byFloor.set(room.floor, existing);
  }
  return byFloor;
}
