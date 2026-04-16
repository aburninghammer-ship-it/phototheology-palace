/**
 * Observation Flux Level Data
 *
 * Pack A: Agency & Action (10 levels)
 * Each verse has pre-extracted verbs for the falling blocks system
 */

export interface VerbBlock {
  text: string;
  subject?: string; // For color-coding in Beginner mode
  isPhrase?: boolean; // Multi-word verb phrases
}

export interface VerseLevel {
  id: number;
  reference: string;
  text: string;
  verbs: VerbBlock[];
  subjectAnchors: string[]; // Subject blocks for advanced levels
  decoyVerbs: string[]; // Plausible but NOT in verse (Master mode)
  expectedObservations: string[]; // For scoring/feedback
}

export interface VersePack {
  id: string;
  name: string;
  description: string;
  floor: number;
  roomCode: string;
  levels: VerseLevel[];
}

// Pack A: Agency & Action (Starter)
export const PACK_A: VersePack = {
  id: "pack_a",
  name: "Agency & Action",
  description: "Train 'who does what' under motion pressure",
  floor: 2,
  roomCode: "OR",
  levels: [
    {
      id: 1,
      reference: "Luke 15:20",
      text: "And he arose, and came to his father. But when he was yet a great way off, his father saw him, and had compassion, and ran, and fell on his neck, and kissed him.",
      verbs: [
        { text: "arose", subject: "son" },
        { text: "came", subject: "son" },
        { text: "saw", subject: "father" },
        { text: "had compassion", subject: "father", isPhrase: true },
        { text: "ran", subject: "father" },
        { text: "fell on his neck", subject: "father", isPhrase: true },
        { text: "kissed", subject: "father" },
      ],
      subjectAnchors: ["father", "son"],
      decoyVerbs: ["forgave", "repented", "embraced", "welcomed", "accepted"],
      expectedObservations: [
        "Seven verbs appear in this verse",
        "Two characters are mentioned",
        "The son performs two actions (arose, came)",
        "The father performs five actions",
        "Physical movement verbs precede physical contact verbs",
        "The phrase 'had compassion' appears",
      ],
    },
    {
      id: 2,
      reference: "Mark 4:39",
      text: "And he arose, and rebuked the wind, and said unto the sea, Peace, be still. And the wind ceased, and there was a great calm.",
      verbs: [
        { text: "arose", subject: "Jesus" },
        { text: "rebuked", subject: "Jesus" },
        { text: "said", subject: "Jesus" },
        { text: "ceased", subject: "wind" },
        { text: "was", subject: "calm" },
      ],
      subjectAnchors: ["he", "wind", "sea"],
      decoyVerbs: ["commanded", "calmed", "stilled", "silenced", "controlled"],
      expectedObservations: [
        "Five verbs appear in this verse",
        "Jesus performs three actions",
        "The wind performs one action (ceased)",
        "Speech is recorded: 'Peace, be still'",
        "Jesus' actions precede the wind's action",
      ],
    },
    {
      id: 3,
      reference: "John 11:35-44",
      text: "Jesus wept. Then said the Jews, Behold how he loved him! Jesus therefore again groaning in himself cometh to the grave. It was a cave, and a stone lay upon it. Jesus said, Take ye away the stone. Martha, the sister of him that was dead, saith unto him, Lord, by this time he stinketh: for he hath been dead four days. Jesus saith unto her, Said I not unto thee, that, if thou wouldest believe, thou shouldest see the glory of God? Then they took away the stone from the place where the dead was laid. And Jesus lifted up his eyes, and said, Father, I thank thee that thou hast heard me. And I knew that thou hearest me always: but because of the people which stand by I said it, that they may believe that thou hast sent me. And when he thus had spoken, he cried with a loud voice, Lazarus, come forth. And he that was dead came forth, bound hand and foot with graveclothes: and his face was bound about with a napkin. Jesus saith unto them, Loose him, and let him go.",
      verbs: [
        { text: "wept", subject: "Jesus" },
        { text: "said", subject: "Jews" },
        { text: "groaning", subject: "Jesus" },
        { text: "cometh", subject: "Jesus" },
        { text: "lay", subject: "stone" },
        { text: "said", subject: "Jesus" },
        { text: "saith", subject: "Martha" },
        { text: "saith", subject: "Jesus" },
        { text: "took away", subject: "they", isPhrase: true },
        { text: "lifted up", subject: "Jesus", isPhrase: true },
        { text: "said", subject: "Jesus" },
        { text: "cried", subject: "Jesus" },
        { text: "came forth", subject: "Lazarus", isPhrase: true },
        { text: "saith", subject: "Jesus" },
      ],
      subjectAnchors: ["Jesus", "Jews", "Martha", "Lazarus", "they"],
      decoyVerbs: ["raised", "resurrected", "healed", "revived", "restored"],
      expectedObservations: [
        "Jesus wept - two words form a complete sentence",
        "Multiple characters speak in this passage",
        "Jesus speaks multiple times",
        "Lazarus comes forth - one action attributed to him",
        "The stone is mentioned twice",
        "Physical actions and speech alternate",
      ],
    },
    {
      id: 4,
      reference: "Matthew 14:29-31",
      text: "And he said, Come. And when Peter was come down out of the ship, he walked on the water, to go to Jesus. But when he saw the wind boisterous, he was afraid, and beginning to sink, he cried, saying, Lord, save me. And immediately Jesus stretched forth his hand, and caught him, and said unto him, O thou of little faith, wherefore didst thou doubt?",
      verbs: [
        { text: "said", subject: "Jesus" },
        { text: "was come down", subject: "Peter", isPhrase: true },
        { text: "walked", subject: "Peter" },
        { text: "saw", subject: "Peter" },
        { text: "was afraid", subject: "Peter", isPhrase: true },
        { text: "beginning to sink", subject: "Peter", isPhrase: true },
        { text: "cried", subject: "Peter" },
        { text: "stretched forth", subject: "Jesus", isPhrase: true },
        { text: "caught", subject: "Jesus" },
        { text: "said", subject: "Jesus" },
      ],
      subjectAnchors: ["Peter", "Jesus", "wind"],
      decoyVerbs: ["drowned", "rescued", "saved", "doubted", "trusted"],
      expectedObservations: [
        "Peter performs six actions",
        "Jesus performs four actions",
        "Peter's fear is stated explicitly ('was afraid')",
        "Jesus speaks twice",
        "Physical actions dominate over speech",
        "Peter's sinking precedes Jesus' rescue",
      ],
    },
    {
      id: 5,
      reference: "Exodus 14:21-22",
      text: "And Moses stretched out his hand over the sea; and the LORD caused the sea to go back by a strong east wind all that night, and made the sea dry land, and the waters were divided. And the children of Israel went into the midst of the sea upon the dry ground: and the waters were a wall unto them on their right hand, and on their left.",
      verbs: [
        { text: "stretched out", subject: "Moses", isPhrase: true },
        { text: "caused", subject: "LORD" },
        { text: "go back", subject: "sea", isPhrase: true },
        { text: "made", subject: "LORD" },
        { text: "were divided", subject: "waters", isPhrase: true },
        { text: "went", subject: "children of Israel" },
        { text: "were", subject: "waters" },
      ],
      subjectAnchors: ["Moses", "LORD", "sea", "waters", "children of Israel"],
      decoyVerbs: ["parted", "split", "opened", "crossed", "delivered"],
      expectedObservations: [
        "Moses performs one action (stretched out)",
        "The LORD performs two actions (caused, made)",
        "The sea and waters are subjects of verbs",
        "Children of Israel perform one action (went)",
        "Wind is mentioned as instrument, not agent",
        "Right and left are mentioned",
      ],
    },
    {
      id: 6,
      reference: "1 Samuel 17:48-51",
      text: "And it came to pass, when the Philistine arose, and came and drew nigh to meet David, that David hasted, and ran toward the army to meet the Philistine. And David put his hand in his bag, and took thence a stone, and slang it, and smote the Philistine in his forehead, that the stone sunk into his forehead; and he fell upon his face to the earth. So David prevailed over the Philistine with a sling and with a stone, and smote the Philistine, and slew him; but there was no sword in the hand of David.",
      verbs: [
        { text: "arose", subject: "Philistine" },
        { text: "came", subject: "Philistine" },
        { text: "drew nigh", subject: "Philistine", isPhrase: true },
        { text: "hasted", subject: "David" },
        { text: "ran", subject: "David" },
        { text: "put", subject: "David" },
        { text: "took", subject: "David" },
        { text: "slang", subject: "David" },
        { text: "smote", subject: "David" },
        { text: "sunk", subject: "stone" },
        { text: "fell", subject: "Philistine" },
        { text: "prevailed", subject: "David" },
        { text: "smote", subject: "David" },
        { text: "slew", subject: "David" },
      ],
      subjectAnchors: ["David", "Philistine", "stone"],
      decoyVerbs: ["killed", "defeated", "conquered", "threw", "hit"],
      expectedObservations: [
        "David performs more actions than the Philistine",
        "The Philistine performs three actions initially",
        "David's actions form a sequence: put, took, slang, smote",
        "The stone sunk - the stone is an agent",
        "Smote appears twice",
        "No sword mentioned as being used",
      ],
    },
    {
      id: 7,
      reference: "Daniel 6:16-23",
      text: "Then the king commanded, and they brought Daniel, and cast him into the den of lions. Now the king spake and said unto Daniel, Thy God whom thou servest continually, he will deliver thee. And a stone was brought, and laid upon the mouth of the den; and the king sealed it with his own signet, and with the signet of his lords; that the purpose might not be changed concerning Daniel. Then the king went to his palace, and passed the night fasting: neither were instruments of musick brought before him: and his sleep went from him. Then the king arose very early in the morning, and went in haste unto the den of lions. And when he came to the den, he cried with a lamentable voice unto Daniel: and the king spake and said to Daniel, O Daniel, servant of the living God, is thy God, whom thou servest continually, able to deliver thee from the lions? Then said Daniel unto the king, O king, live for ever. My God hath sent his angel, and hath shut the lions' mouths, that they have not hurt me: forasmuch as before him innocency was found in me; and also before thee, O king, have I done no hurt. Then was the king exceeding glad for him, and commanded that they should take Daniel up out of the den. So Daniel was taken up out of the den, and no manner of hurt was found upon him, because he believed in his God.",
      verbs: [
        { text: "commanded", subject: "king" },
        { text: "brought", subject: "they" },
        { text: "cast", subject: "they" },
        { text: "spake", subject: "king" },
        { text: "said", subject: "king" },
        { text: "was brought", subject: "stone", isPhrase: true },
        { text: "laid", subject: "stone" },
        { text: "sealed", subject: "king" },
        { text: "went", subject: "king" },
        { text: "passed", subject: "king" },
        { text: "went", subject: "sleep" },
        { text: "arose", subject: "king" },
        { text: "went", subject: "king" },
        { text: "came", subject: "king" },
        { text: "cried", subject: "king" },
        { text: "spake", subject: "king" },
        { text: "said", subject: "king" },
        { text: "said", subject: "Daniel" },
        { text: "sent", subject: "God" },
        { text: "shut", subject: "God" },
        { text: "commanded", subject: "king" },
        { text: "was taken up", subject: "Daniel", isPhrase: true },
      ],
      subjectAnchors: ["king", "Daniel", "they", "stone", "God", "angel"],
      decoyVerbs: ["prayed", "rescued", "saved", "protected", "delivered"],
      expectedObservations: [
        "The king performs more actions than Daniel",
        "Daniel speaks once",
        "The king speaks multiple times",
        "God is credited with sending and shutting",
        "The word 'went' appears multiple times",
        "Commanded appears twice",
        "No prayer action is explicitly stated",
      ],
    },
    {
      id: 8,
      reference: "Acts 2:1-4",
      text: "And when the day of Pentecost was fully come, they were all with one accord in one place. And suddenly there came a sound from heaven as of a rushing mighty wind, and it filled all the house where they were sitting. And there appeared unto them cloven tongues like as of fire, and it sat upon each of them. And they were all filled with the Holy Ghost, and began to speak with other tongues, as the Spirit gave them utterance.",
      verbs: [
        { text: "was fully come", subject: "day", isPhrase: true },
        { text: "were", subject: "they" },
        { text: "came", subject: "sound" },
        { text: "filled", subject: "it/sound" },
        { text: "were sitting", subject: "they", isPhrase: true },
        { text: "appeared", subject: "tongues" },
        { text: "sat", subject: "it/fire" },
        { text: "were filled", subject: "they", isPhrase: true },
        { text: "began to speak", subject: "they", isPhrase: true },
        { text: "gave", subject: "Spirit" },
      ],
      subjectAnchors: ["they", "sound", "tongues", "Spirit"],
      decoyVerbs: ["prayed", "received", "baptized", "anointed", "empowered"],
      expectedObservations: [
        "The sound came - the sound is an agent",
        "Fire sat upon each - fire is an agent",
        "They began to speak - not 'they spoke'",
        "The Spirit gave utterance",
        "Filled appears twice with different agents",
        "Wind and fire are described, not commanded",
      ],
    },
    {
      id: 9,
      reference: "Revelation 1:17-18",
      text: "And when I saw him, I fell at his feet as dead. And he laid his right hand upon me, saying, Fear not; I am the first and the last: I am he that liveth, and was dead; and, behold, I am alive for evermore, Amen; and have the keys of hell and of death.",
      verbs: [
        { text: "saw", subject: "I/John" },
        { text: "fell", subject: "I/John" },
        { text: "laid", subject: "he/Christ" },
        { text: "saying", subject: "he/Christ" },
        { text: "am", subject: "I/Christ" },
        { text: "liveth", subject: "he/Christ" },
        { text: "was dead", subject: "he/Christ", isPhrase: true },
        { text: "am alive", subject: "I/Christ", isPhrase: true },
        { text: "have", subject: "I/Christ" },
      ],
      subjectAnchors: ["I", "he", "John", "Christ"],
      decoyVerbs: ["worshipped", "trembled", "touched", "raised", "comforted"],
      expectedObservations: [
        "John performs two actions: saw, fell",
        "Christ performs physical action: laid hand",
        "Christ speaks in first person",
        "Dead and alive are both stated",
        "Keys are mentioned as possessed, not used",
        "Right hand is specified",
      ],
    },
    {
      id: 10,
      reference: "Isaiah 6:6-8",
      text: "Then flew one of the seraphims unto me, having a live coal in his hand, which he had taken with the tongs from off the altar: And he laid it upon my mouth, and said, Lo, this hath touched thy lips; and thine iniquity is taken away, and thy sin purged. Also I heard the voice of the Lord, saying, Whom shall I send, and who will go for us? Then said I, Here am I; send me.",
      verbs: [
        { text: "flew", subject: "seraphim" },
        { text: "having", subject: "seraphim" },
        { text: "had taken", subject: "seraphim", isPhrase: true },
        { text: "laid", subject: "he/seraphim" },
        { text: "said", subject: "he/seraphim" },
        { text: "hath touched", subject: "coal", isPhrase: true },
        { text: "is taken away", subject: "iniquity", isPhrase: true },
        { text: "purged", subject: "sin" },
        { text: "heard", subject: "I/Isaiah" },
        { text: "saying", subject: "Lord" },
        { text: "send", subject: "Lord question" },
        { text: "go", subject: "who question" },
        { text: "said", subject: "I/Isaiah" },
        { text: "send", subject: "imperative" },
      ],
      subjectAnchors: ["seraphim", "I/Isaiah", "Lord", "coal"],
      decoyVerbs: ["cleansed", "forgave", "called", "anointed", "commissioned"],
      expectedObservations: [
        "The seraphim flew - physical motion",
        "The coal touched - the coal is agent",
        "Isaiah heard and said",
        "The Lord asks questions",
        "Send appears twice (question and command)",
        "Tongs are mentioned as instrument",
      ],
    },
  ],
};

// All available packs
export const ALL_PACKS: VersePack[] = [PACK_A];

// Get a pack by ID
export function getPack(packId: string): VersePack | undefined {
  return ALL_PACKS.find(p => p.id === packId);
}

// Get a level from a pack
export function getLevel(packId: string, levelId: number): VerseLevel | undefined {
  const pack = getPack(packId);
  return pack?.levels.find(l => l.id === levelId);
}

// Difficulty settings
export interface DifficultySettings {
  id: string;
  name: string;
  fallSpeed: number; // Percentage per 50ms tick
  spawnInterval: number; // ms between spawns
  showSubjectColors: boolean;
  showDecoys: boolean;
  verbFadeDelay: number; // ms before verb text fades (0 = no fade)
}

export const DIFFICULTIES: DifficultySettings[] = [
  {
    id: "beginner",
    name: "Beginner",
    fallSpeed: 0.4,
    spawnInterval: 2500,
    showSubjectColors: true,
    showDecoys: true, // Decoys in all modes now
    verbFadeDelay: 0,
  },
  {
    id: "intermediate",
    name: "Intermediate",
    fallSpeed: 0.6,
    spawnInterval: 1800,
    showSubjectColors: false,
    showDecoys: true,
    verbFadeDelay: 0,
  },
  {
    id: "master",
    name: "Master",
    fallSpeed: 0.9,
    spawnInterval: 1200,
    showSubjectColors: false,
    showDecoys: true,
    verbFadeDelay: 1500,
  },
];

// Subject color mapping
export const SUBJECT_COLORS: Record<string, string> = {
  father: "bg-blue-500",
  son: "bg-green-500",
  Jesus: "bg-amber-500",
  Peter: "bg-purple-500",
  David: "bg-red-500",
  Moses: "bg-orange-500",
  LORD: "bg-yellow-500",
  king: "bg-indigo-500",
  Daniel: "bg-teal-500",
  seraphim: "bg-pink-500",
  default: "bg-slate-500",
};

export function getSubjectColor(subject?: string): string {
  if (!subject) return SUBJECT_COLORS.default;
  // Check for partial matches
  for (const [key, color] of Object.entries(SUBJECT_COLORS)) {
    if (subject.toLowerCase().includes(key.toLowerCase())) {
      return color;
    }
  }
  return SUBJECT_COLORS.default;
}
