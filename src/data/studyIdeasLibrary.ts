// Study Ideas Library - Spark Cards and Guided Paths
// Following palaceData.ts pattern for static educational content

export interface SparkCard {
  id: string;
  title: string;
  verseAnchors: string[];
  palaceRooms: Array<{
    id: string;
    name: string;
    icon: string; // Lucide icon name
  }>;
  prompts: {
    observe: string;
    connect: string;
    discover: string;
  };
  category: "sanctuary" | "types" | "cycles" | "patterns" | "prophecy" | "elements";
  tags: string[];
}

export interface StudyPath {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  cardSequence: string[]; // Ordered array of SparkCard IDs
  estimatedSessions: number;
  category: string;
}

// ============================================
// SPARK CARDS (12 Initial)
// ============================================

export const sparkCards: SparkCard[] = [
  {
    id: "door-before-light",
    title: "The Door Before the Light",
    verseAnchors: ["Exodus 27:16", "Exodus 40:24"],
    palaceRooms: [
      { id: "bl", name: "Sanctuary", icon: "Church" },
      { id: "prm", name: "Patterns", icon: "Target" },
    ],
    prompts: {
      observe: "Why does the altar come before the lampstand in the sanctuary layout?",
      connect: "Where else in Scripture does sacrifice precede illumination?",
      discover: "What does this architectural order reveal about approaching God?",
    },
    category: "sanctuary",
    tags: ["sanctuary", "order", "altar", "lampstand", "layout"],
  },
  {
    id: "faces-that-shone",
    title: "Faces That Shone",
    verseAnchors: ["Exodus 34:29", "Matthew 17:2"],
    palaceRooms: [
      { id: "dr", name: "Presence", icon: "Sparkles" },
      { id: "cr", name: "Glory", icon: "Sun" },
    ],
    prompts: {
      observe: "What causes Moses' face to shine? What causes Jesus' face to shine?",
      connect: "Where else do faces or countenances shine in Scripture?",
      discover: "What is the relationship between divine encounter and visible transformation?",
    },
    category: "patterns",
    tags: ["glory", "shining", "transfiguration", "presence", "Moses", "Jesus"],
  },
  {
    id: "god-coming-down",
    title: "God 'Coming Down'",
    verseAnchors: ["Genesis 11:5", "Exodus 19:20"],
    palaceRooms: [
      { id: "dr", name: "Dimensions", icon: "Layers" },
      { id: "dr", name: "Presence", icon: "Sparkles" },
    ],
    prompts: {
      observe: "Why does an omnipresent God need to 'come down'?",
      connect: "Find other passages where God descends. What triggers His descent?",
      discover: "What does divine descent reveal about God's relational nature?",
    },
    category: "patterns",
    tags: ["descent", "presence", "theophany", "Babel", "Sinai"],
  },
  {
    id: "eastward-after-sin",
    title: "Eastward After Sin",
    verseAnchors: ["Genesis 3:24", "Genesis 4:16"],
    palaceRooms: [
      { id: "st", name: "Direction", icon: "Compass" },
      { id: "prm", name: "Exile", icon: "MapPin" },
    ],
    prompts: {
      observe: "Why are Adam/Eve and Cain both sent eastward?",
      connect: "Trace the 'eastward' movement throughout Genesis and beyond.",
      discover: "Are there texts where the movement reverses (westward to God)?",
    },
    category: "patterns",
    tags: ["east", "exile", "Eden", "Cain", "direction", "geography"],
  },
  {
    id: "blue-thread-mystery",
    title: "Blue Thread Mystery",
    verseAnchors: ["Numbers 15:38", "Exodus 26:31"],
    palaceRooms: [
      { id: "st", name: "Color", icon: "Palette" },
      { id: "st", name: "Law", icon: "Scale" },
    ],
    prompts: {
      observe: "Why specifically blue for the tassel thread? Why blue in the veil?",
      connect: "Where else does blue appear in sanctuary worship?",
      discover: "What does blue symbolize in the biblical color palette?",
    },
    category: "sanctuary",
    tags: ["blue", "color", "tassel", "veil", "sanctuary", "law"],
  },
  {
    id: "water-before-life",
    title: "Water Before Life",
    verseAnchors: ["Genesis 1:2", "John 3:5"],
    palaceRooms: [
      { id: "st", name: "Elements", icon: "Droplets" },
      { id: "st", name: "Spirit", icon: "Wind" },
    ],
    prompts: {
      observe: "What role does water play at creation? At new birth?",
      connect: "Trace water + Spirit combinations through Scripture.",
      discover: "Why does new life consistently emerge from/through water?",
    },
    category: "elements",
    tags: ["water", "Spirit", "creation", "baptism", "birth", "life"],
  },
  {
    id: "mountain-meetings",
    title: "Mountain Meetings",
    verseAnchors: ["Exodus 19:1-25", "Matthew 5:1-12"],
    palaceRooms: [
      { id: "st", name: "Mountain", icon: "Mountain" },
      { id: "prm", name: "Covenant", icon: "ScrollText" },
    ],
    prompts: {
      observe: "What happens on Sinai? What happens on the mount of Beatitudes?",
      connect: "List other significant mountain encounters in Scripture.",
      discover: "Why are mountains the preferred meeting places with God?",
    },
    category: "patterns",
    tags: ["mountain", "Sinai", "Sermon on Mount", "covenant", "law"],
  },
  {
    id: "falling-on-face",
    title: "Falling on the Face",
    verseAnchors: ["Numbers 16:4", "Revelation 1:17"],
    palaceRooms: [
      { id: "prm", name: "Posture", icon: "PersonStanding" },
      { id: "cr", name: "Glory", icon: "Sun" },
    ],
    prompts: {
      observe: "What causes Moses to fall on his face? What causes John to fall?",
      connect: "Find other 'falling on the face' moments in Scripture.",
      discover: "When do people fall before God vs. when do they stand?",
    },
    category: "patterns",
    tags: ["prostration", "posture", "glory", "reverence", "Moses", "John"],
  },
  {
    id: "blood-before-presence",
    title: "Blood Before Presence",
    verseAnchors: ["Leviticus 16:1-19", "Hebrews 9:1-14"],
    palaceRooms: [
      { id: "bl", name: "Sanctuary", icon: "Church" },
      { id: "bl", name: "Access", icon: "DoorOpen" },
    ],
    prompts: {
      observe: "What is the sequence of actions on the Day of Atonement?",
      connect: "How does Hebrews 9 interpret this order?",
      discover: "Why must blood always precede access to God's presence?",
    },
    category: "sanctuary",
    tags: ["blood", "atonement", "sanctuary", "access", "presence", "Day of Atonement"],
  },
  {
    id: "bread-of-presence",
    title: "Bread of Presence",
    verseAnchors: ["Exodus 25:30", "John 6:35-51"],
    palaceRooms: [
      { id: "bl", name: "Provision", icon: "Wheat" },
      { id: "dr", name: "Presence", icon: "Sparkles" },
    ],
    prompts: {
      observe: "What is the 'bread of the Presence' and where is it placed?",
      connect: "How does Jesus claim to be the bread of life?",
      discover: "What links bread, presence, and sustaining life?",
    },
    category: "sanctuary",
    tags: ["bread", "showbread", "presence", "Jesus", "sustenance", "sanctuary"],
  },
  {
    id: "veil-moments",
    title: "Veil Moments",
    verseAnchors: ["Exodus 26:33", "Matthew 27:51"],
    palaceRooms: [
      { id: "bl", name: "Separation", icon: "Divide" },
      { id: "bl", name: "Access", icon: "DoorOpen" },
    ],
    prompts: {
      observe: "What does the veil separate? What happens when it tears?",
      connect: "Where else do veils appear in Scripture (temple, Moses, women)?",
      discover: "What changes at the cross regarding divine access?",
    },
    category: "sanctuary",
    tags: ["veil", "separation", "access", "cross", "Most Holy Place"],
  },
  {
    id: "gates-eden-court",
    title: "Gates of Eden & Court",
    verseAnchors: ["Genesis 2:8", "Exodus 27:16"],
    palaceRooms: [
      { id: "prm", name: "Pattern", icon: "Target" },
      { id: "bl", name: "Sanctuary", icon: "Church" },
    ],
    prompts: {
      observe: "Compare Eden's entrance with the sanctuary courtyard gate.",
      connect: "What other Eden-sanctuary parallels can you find?",
      discover: "Is the sanctuary a recreation of Eden? Why would God do this?",
    },
    category: "sanctuary",
    tags: ["Eden", "sanctuary", "gate", "entrance", "paradise", "tabernacle"],
  },
  // ============================================
  // NEW CARDS (Batch 2 - 12 Additional)
  // ============================================
  {
    id: "seven-days-pattern",
    title: "Seven Days Creation Pattern",
    verseAnchors: ["Genesis 1:1-31", "Genesis 2:1-3", "Leviticus 23:3"],
    palaceRooms: [
      { id: "st", name: "Numbers", icon: "Hash" },
      { id: "prm", name: "Cycles", icon: "RefreshCw" },
    ],
    prompts: {
      observe: "What is the structure of creation week? What happens on each day?",
      connect: "Where else does the seven-day pattern appear (feasts, purification, marches)?",
      discover: "Why did God choose seven days? What does the Sabbath reveal about completion?",
    },
    category: "cycles",
    tags: ["seven", "creation", "Sabbath", "week", "numbers", "rest"],
  },
  {
    id: "burning-bush",
    title: "The Burning Bush",
    verseAnchors: ["Exodus 3:1-6", "Acts 7:30-34"],
    palaceRooms: [
      { id: "dr", name: "Presence", icon: "Sparkles" },
      { id: "st", name: "Fire", icon: "Flame" },
    ],
    prompts: {
      observe: "Why was the bush burning but not consumed? Why 'holy ground'?",
      connect: "Where else does fire represent God's presence without destroying?",
      discover: "What does the unconsumed bush reveal about dwelling with a holy God?",
    },
    category: "patterns",
    tags: ["fire", "presence", "Moses", "holy ground", "theophany", "burning"],
  },
  {
    id: "jacobs-ladder",
    title: "Jacob's Ladder",
    verseAnchors: ["Genesis 28:10-17", "John 1:51"],
    palaceRooms: [
      { id: "dr", name: "Dimensions", icon: "Layers" },
      { id: "prm", name: "Types", icon: "Copy" },
    ],
    prompts: {
      observe: "What does Jacob see? What is ascending and descending?",
      connect: "How does Jesus apply this to Himself in John 1?",
      discover: "How is Christ the connection between heaven and earth?",
    },
    category: "types",
    tags: ["ladder", "angels", "Jacob", "Jesus", "heaven", "connection"],
  },
  {
    id: "serpent-pole",
    title: "The Serpent on the Pole",
    verseAnchors: ["Numbers 21:8-9", "John 3:14-15"],
    palaceRooms: [
      { id: "prm", name: "Types", icon: "Copy" },
      { id: "bl", name: "Atonement", icon: "Cross" },
    ],
    prompts: {
      observe: "Why a bronze serpent? Why lifted up on a pole?",
      connect: "How does Jesus interpret this in John 3?",
      discover: "Why must looking bring healing? What does 'lifted up' foreshadow?",
    },
    category: "types",
    tags: ["serpent", "pole", "healing", "lifted up", "cross", "Jesus"],
  },
  {
    id: "crossing-jordan",
    title: "Crossing the Jordan",
    verseAnchors: ["Joshua 3:14-17", "Joshua 4:19-24", "Matthew 3:13-17"],
    palaceRooms: [
      { id: "st", name: "Water", icon: "Droplets" },
      { id: "prm", name: "Patterns", icon: "Target" },
    ],
    prompts: {
      observe: "How does the Jordan crossing parallel the Red Sea?",
      connect: "What other 'water crossings' lead to new beginnings in Scripture?",
      discover: "Why is Jesus baptized in the Jordan? What transition does it mark?",
    },
    category: "patterns",
    tags: ["Jordan", "crossing", "baptism", "promised land", "Red Sea", "water"],
  },
  {
    id: "ravens-provision",
    title: "Ravens & Unexpected Provision",
    verseAnchors: ["1 Kings 17:4-6", "Luke 12:24"],
    palaceRooms: [
      { id: "st", name: "Nature", icon: "Bird" },
      { id: "dr", name: "Providence", icon: "Gift" },
    ],
    prompts: {
      observe: "Why ravens—an unclean bird—to feed Elijah?",
      connect: "Where else does God use unexpected or 'unclean' means to provide?",
      discover: "What does raven-provision teach about trusting God's methods?",
    },
    category: "patterns",
    tags: ["ravens", "provision", "Elijah", "unclean", "trust", "nature"],
  },
  {
    id: "forty-pattern",
    title: "The Forty Days/Years Pattern",
    verseAnchors: ["Genesis 7:12", "Exodus 24:18", "Matthew 4:1-2"],
    palaceRooms: [
      { id: "st", name: "Numbers", icon: "Hash" },
      { id: "prm", name: "Testing", icon: "Scale" },
    ],
    prompts: {
      observe: "List the major 'forty' periods: flood, Sinai, wilderness, temptation.",
      connect: "What consistently happens during these forty periods?",
      discover: "Why forty? What does testing and preparation accomplish?",
    },
    category: "cycles",
    tags: ["forty", "testing", "wilderness", "preparation", "numbers", "pattern"],
  },
  {
    id: "two-adams",
    title: "First & Second Adam",
    verseAnchors: ["Romans 5:14-19", "1 Corinthians 15:45-49"],
    palaceRooms: [
      { id: "prm", name: "Types", icon: "Copy" },
      { id: "bl", name: "Redemption", icon: "Cross" },
    ],
    prompts: {
      observe: "What does Adam bring? What does Christ bring?",
      connect: "How do their choices mirror and reverse each other?",
      discover: "In what ways are all humans 'in Adam' or 'in Christ'?",
    },
    category: "types",
    tags: ["Adam", "Christ", "typology", "death", "life", "Romans"],
  },
  {
    id: "scarlet-cord",
    title: "The Scarlet Cord",
    verseAnchors: ["Joshua 2:18-21", "Exodus 12:13", "Hebrews 11:31"],
    palaceRooms: [
      { id: "st", name: "Color", icon: "Palette" },
      { id: "bl", name: "Salvation", icon: "ShieldCheck" },
    ],
    prompts: {
      observe: "What is Rahab told to display? What does it protect?",
      connect: "How does the scarlet cord parallel the Passover blood?",
      discover: "Why scarlet? What does Rahab's faith teach about salvation?",
    },
    category: "types",
    tags: ["scarlet", "cord", "Rahab", "blood", "Passover", "salvation"],
  },
  {
    id: "tree-of-life",
    title: "Tree of Life Reappearances",
    verseAnchors: ["Genesis 2:9", "Genesis 3:22-24", "Revelation 22:2"],
    palaceRooms: [
      { id: "st", name: "Nature", icon: "TreeDeciduous" },
      { id: "prm", name: "Patterns", icon: "Target" },
    ],
    prompts: {
      observe: "Where is the tree of life at creation? At the end?",
      connect: "Trace tree/wood imagery: cross, curse, blessing.",
      discover: "Why does the tree reappear in the New Jerusalem? What changed?",
    },
    category: "patterns",
    tags: ["tree", "life", "Eden", "Revelation", "healing", "paradise"],
  },
  {
    id: "oil-anointing",
    title: "Oil & Anointing",
    verseAnchors: ["Exodus 30:22-33", "1 Samuel 16:13", "Luke 4:18"],
    palaceRooms: [
      { id: "st", name: "Elements", icon: "Droplet" },
      { id: "dr", name: "Spirit", icon: "Wind" },
    ],
    prompts: {
      observe: "What was the holy anointing oil made of? Who received it?",
      connect: "How does oil connect to the Spirit in kings, priests, and Jesus?",
      discover: "Why is 'Messiah/Christ' literally 'Anointed One'? What does anointing confer?",
    },
    category: "elements",
    tags: ["oil", "anointing", "Spirit", "Messiah", "priest", "king"],
  },
  {
    id: "night-visions",
    title: "Night Visions & Encounters",
    verseAnchors: ["Genesis 15:12-17", "Genesis 46:2-4", "1 Kings 3:5-15"],
    palaceRooms: [
      { id: "dr", name: "Revelation", icon: "Moon" },
      { id: "dr", name: "Presence", icon: "Sparkles" },
    ],
    prompts: {
      observe: "What do Abraham, Jacob, and Solomon receive at night?",
      connect: "Find other night encounters: Jacob wrestling, Jesus praying, etc.",
      discover: "Why does God often speak in darkness? What does night-revelation teach?",
    },
    category: "patterns",
    tags: ["night", "vision", "dreams", "Abraham", "Jacob", "Solomon", "revelation"],
  },
];

// ============================================
// STUDY PATHS (3 Initial)
// ============================================

export const studyPaths: StudyPath[] = [
  {
    id: "sanctuary-path",
    title: "The Sanctuary Path",
    description: "Trace God's architectural blueprint for dwelling with humanity—from Eden's garden to the heavenly temple. Discover how every piece of furniture, every curtain, and every ritual points to Christ and His ministry.",
    icon: "Church",
    cardSequence: [
      "gates-eden-court",
      "blood-before-presence",
      "door-before-light",
      "veil-moments",
      "bread-of-presence",
      "blue-thread-mystery",
      "faces-that-shone",
      "water-before-life",
    ],
    estimatedSessions: 8,
    category: "sanctuary",
  },
  {
    id: "mountain-path",
    title: "The Mountain Path",
    description: "Ascend Scripture's sacred peaks—Sinai, Carmel, Zion, Olivet, Transfiguration, and the mountain of Revelation. Discover why God consistently meets His people at high places.",
    icon: "Mountain",
    cardSequence: [
      "mountain-meetings",
      "god-coming-down",
      "falling-on-face",
      "faces-that-shone",
    ],
    estimatedSessions: 7,
    category: "patterns",
  },
  {
    id: "water-path",
    title: "The Water Path",
    description: "Follow the flow of living water through Scripture—from creation's waters to the crystal sea. Trace how water, Spirit, and new life interweave from Genesis to Revelation.",
    icon: "Waves",
    cardSequence: [
      "water-before-life",
      "blood-before-presence",
      "veil-moments",
    ],
    estimatedSessions: 7,
    category: "elements",
  },
];

// Helper functions
export const getCardById = (id: string): SparkCard | undefined => {
  return sparkCards.find((card) => card.id === id);
};

export const getPathById = (id: string): StudyPath | undefined => {
  return studyPaths.find((path) => path.id === id);
};

export const getCardsForPath = (pathId: string): SparkCard[] => {
  const path = getPathById(pathId);
  if (!path) return [];
  return path.cardSequence
    .map((cardId) => getCardById(cardId))
    .filter((card): card is SparkCard => card !== undefined);
};

export const getCardsByCategory = (category: SparkCard["category"]): SparkCard[] => {
  return sparkCards.filter((card) => card.category === category);
};

// Category display names
export const categoryLabels: Record<SparkCard["category"], string> = {
  sanctuary: "Sanctuary Studies",
  types: "Types & Shadows",
  cycles: "Redemptive Cycles",
  patterns: "Biblical Patterns",
  prophecy: "Prophetic Studies",
  elements: "Elements & Nature",
};
