import { DrillQuestion } from "@/hooks/useDrills";

// Story Room (SR) Drills - Story sequencing and beat identification
export const storyRoomDrills: DrillQuestion[] = [
  {
    id: "sr-1",
    question: "What is the correct order of Joseph's story beats?",
    options: [
      "Coat → Pit → Palace → Prison → Caravan",
      "Coat → Pit → Caravan → Prison → Palace",
      "Pit → Coat → Prison → Caravan → Palace",
      "Coat → Prison → Pit → Caravan → Palace",
    ],
    correctAnswer: 1,
    explanation: "Joseph received his coat, was thrown in a pit, sold to a caravan, imprisoned, then elevated to palace. This sequence shows God's providence through trials."
  },
  {
    id: "sr-2",
    question: "How many 'beats' should a well-crafted story summary typically have?",
    options: [
      "1-2 beats",
      "3-7 beats",
      "10-15 beats",
      "20+ beats",
    ],
    correctAnswer: 1,
    explanation: "The Story Room recommends 3-7 beats - enough to capture the full narrative arc without overwhelming detail."
  },
  {
    id: "sr-3",
    question: "What's the first step in the Story Room method?",
    options: [
      "Interpret the meaning",
      "Break story into beats",
      "Write a commentary",
      "Find cross-references",
    ],
    correctAnswer: 1,
    explanation: "Before interpretation comes chronology - you must first know what actually happened and in what order."
  },
];

// Gems Room (GR) Drills - Identifying connections between verses
export const gemsRoomDrills: DrillQuestion[] = [
  {
    id: "gr-1",
    question: "Which pairing creates a 'gem' showing Jesus as the Passover Lamb?",
    options: [
      "Gen 1:1 + Rev 1:1",
      "Ex 12 (Passover) + John 19:14 (crucifixion timing)",
      "Ps 23 + John 10",
      "Gen 3:15 + Luke 1:35",
    ],
    correctAnswer: 1,
    explanation: "Exodus 12 shows Passover lambs slain at twilight, and John 19:14 shows Jesus crucified at the exact same hour - revealing He is our Passover Lamb."
  },
  {
    id: "gr-2",
    question: "What makes a 'gem' different from a simple parallel?",
    options: [
      "It uses the same words",
      "It's from the same book",
      "It reveals a rare truth when texts combine",
      "It's easier to memorize",
    ],
    correctAnswer: 2,
    explanation: "A gem emerges when combining seemingly unrelated texts reveals a profound truth that wasn't obvious in either text alone."
  },
  {
    id: "gr-3",
    question: "How many verses should typically be combined to create a gem?",
    options: [
      "Always exactly 2",
      "2-4 verses",
      "5-10 verses",
      "As many as possible",
    ],
    correctAnswer: 1,
    explanation: "The Gems Room recommends 2-4 verses - focused enough to see clear connections without becoming unwieldy."
  },
];

// Symbols/Types Room (ST) Drills
export const symbolsRoomDrills: DrillQuestion[] = [
  {
    id: "st-1",
    question: "What does the symbol 'Rock' consistently point to in Scripture?",
    options: [
      "Peter the apostle",
      "Christ the foundation",
      "The temple",
      "The law",
    ],
    correctAnswer: 1,
    explanation: "Throughout Scripture, the Rock is Christ - our foundation, our refuge, and the source of living water (1 Cor 10:4, Matt 16:18)."
  },
  {
    id: "st-2",
    question: "Which is the correct approach to interpreting biblical symbols?",
    options: [
      "Use your imagination freely",
      "Look at canonical usage across Scripture",
      "Trust your first impression",
      "Ask what it means to you personally",
    ],
    correctAnswer: 1,
    explanation: "The Symbols Room teaches that we must trace how God consistently uses a symbol throughout the canon, not rely on free association."
  },
  {
    id: "st-3",
    question: "What is the primary purpose of typology?",
    options: [
      "To make Bible study more interesting",
      "To reveal Christ in the Old Testament",
      "To create allegories",
      "To prove doctrines",
    ],
    correctAnswer: 1,
    explanation: "Typology's main purpose is Christocentric - showing how Old Testament types point forward to their fulfillment in Christ."
  },
];

// Observation Room (OR) Drills
export const observationRoomDrills: DrillQuestion[] = [
  {
    id: "or-1",
    question: "In the Observation Room, when should you interpret what you see?",
    options: [
      "Immediately as you observe",
      "After gathering raw data",
      "While reading",
      "Before reading",
    ],
    correctAnswer: 1,
    explanation: "The Observation Room is about gathering raw data WITHOUT interpretation. Meaning comes later."
  },
  {
    id: "or-2",
    question: "How many observations should you aim for when studying a passage?",
    options: [
      "5-10 observations",
      "20-50 observations",
      "100+ observations",
      "As few as possible",
    ],
    correctAnswer: 1,
    explanation: "The Observation Room recommends 20-50 bullet observations to thoroughly examine a passage before interpretation."
  },
];

// Helper function to get drills by room ID
export const getDrillsByRoom = (roomId: string): DrillQuestion[] => {
  switch (roomId) {
    case "sr":
      return storyRoomDrills;
    case "gr":
      return gemsRoomDrills;
    case "st":
      return symbolsRoomDrills;
    case "or":
      return observationRoomDrills;
    default:
      return [];
  }
};

export const getDrillName = (roomId: string): string => {
  switch (roomId) {
    case "sr":
      return "Story Sequencing";
    case "gr":
      return "Gem Identification";
    case "st":
      return "Symbol Recognition";
    case "or":
      return "Observation Practice";
    default:
      return "Practice Drill";
  }
};
