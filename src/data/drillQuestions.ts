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
  {
    id: "or-3",
    question: "What should you observe FIRST in any passage?",
    options: [
      "Theological meanings",
      "What is happening: numbers, people, objects, actions",
      "How it applies to your life",
      "What commentaries say",
    ],
    correctAnswer: 1,
    explanation: "Start with 'WHAT IS HAPPENING' — count the people, objects, and actions. Raw factual details come before interpretation."
  },
  {
    id: "or-4",
    question: "Which of these is a proper observation (not an interpretation)?",
    options: [
      "This story teaches us to trust God",
      "The passage mentions 3 specific people and 2 locations",
      "The oil in this verse symbolizes the Holy Spirit",
      "God is showing us to always be prepared",
    ],
    correctAnswer: 1,
    explanation: "Counting specific details (3 people, 2 locations) is pure observation. The others are interpretations or applications."
  },
  {
    id: "or-5",
    question: "Which observation category tracks 'how many people, objects, actions'?",
    options: [
      "Grammar observations",
      "What is happening (factual details)",
      "Theological observations",
      "Application observations",
    ],
    correctAnswer: 1,
    explanation: "'What is happening' captures factual details: numbers, who/what/where/when, and actions — the foundation of observation."
  },
];

// Concentration Room (CR) Drills - Cascading Christ-Discovery (Magnum Opus)
export const concentrationRoomDrills: DrillQuestion[] = [
  {
    id: "cr-1",
    question: "What is 'Cascading Christ-Discovery' in Phototheology?",
    options: [
      "Finding one Christ connection per passage",
      "Building chains of 5-10 layered Christ connections where each insight opens the next",
      "Listing every mention of Jesus in a book",
      "Comparing Christ to one OT figure",
    ],
    correctAnswer: 1,
    explanation: "Cascading Christ-Discovery builds chains of layered connections. Example: Proverbs 1 → 'Son of David' = Solomon/Christ → Wisdom crying in streets = Christ's public ministry → 'stretched out my hand' = rejected Messiah → desolation = 70 AD. Each layer builds on the last."
  },
  {
    id: "cr-2",
    question: "Which thinking pattern shows how OT books mirror Christ's ministry timeline?",
    options: [
      "Multi-Type Convergence",
      "Structural-Timeline Mapping",
      "Reversed-Trap Pattern",
      "What-If Shadow Types",
    ],
    correctAnswer: 1,
    explanation: "Structural-Timeline Mapping shows how books/sequences mirror Christ's ministry. Example: The Pentateuch IS Christ — Genesis=Son, Exodus=Deliverer, Leviticus=Sacrifice, Numbers=Mission, Deuteronomy=Death-Resurrection."
  },
  {
    id: "cr-3",
    question: "In the Reversed-Trap Pattern, what happened at the cross?",
    options: [
      "Satan won a temporary victory",
      "Christ avoided the trap entirely",
      "The trap set for Christ became the trap that destroyed the trapper (Col 2:15)",
      "The disciples sprang the trap early",
    ],
    correctAnswer: 2,
    explanation: "The cross is the ultimate Reversed Trap. It looked like Satan's victory — but it was his destruction. Christ SAW the trap, walked in willingly, and the cross became the instrument of Satan's defeat (Col 2:15)."
  },
  {
    id: "cr-4",
    question: "What is a 'What-If Shadow Type'?",
    options: [
      "A type that is unclear or debatable",
      "An OT figure who FAILED where Christ SUCCEEDED, showing what would have happened if Christ had sinned",
      "A hypothetical scenario not found in Scripture",
      "A type that only appears in the shadows of prophecy",
    ],
    correctAnswer: 1,
    explanation: "What-If Shadow Types use failed OT figures to illuminate Christ's triumph. Example: The man of God in 1 Kings 13 (sent, obedient, then deceived, then judged) = what Christ's story WOULD have looked like if He had sinned. Christ passed every test the types failed."
  },
  {
    id: "cr-5",
    question: "Which is the best example of Multi-Type Convergence for Christ's ministry?",
    options: [
      "David as a type of Christ in all ways",
      "Moses (deliverer, threatened at birth) + Jonah (death/burial/resurrection) + Elijah (ascension/spirit poured out)",
      "Abraham offering Isaac",
      "Joseph in Egypt",
    ],
    correctAnswer: 1,
    explanation: "Multi-Type Convergence shows how MULTIPLE OT figures converge on one aspect of Christ. Moses=deliverer threatened at birth, Jonah=death-burial-resurrection, Elijah=ascension and Spirit poured out — together they map Christ's entire ministry from birth to Pentecost."
  },
];

// Parallels Room (P‖) Drills - Structural-Timeline Patterns (Magnum Opus)
export const parallelsRoomDrills: DrillQuestion[] = [
  {
    id: "p-1",
    question: "How does the Pentateuch map to Christ's ministry timeline?",
    options: [
      "Genesis=Law, Exodus=Grace, Leviticus=Faith, Numbers=Hope, Deuteronomy=Love",
      "Genesis=Son/Identity, Exodus=Deliverer/Mission, Leviticus=Sacrifice/Atonement, Numbers=Church/Mission, Deuteronomy=Death-Resurrection",
      "Each book represents a different disciple",
      "The Pentateuch doesn't map to Christ",
    ],
    correctAnswer: 1,
    explanation: "The Pentateuch IS Christ's ministry timeline: Genesis reveals the Son (identity), Exodus the Deliverer (mission), Leviticus the Sacrifice (atonement), Numbers the Church (mission), Deuteronomy the Death and Resurrection (covenant completion)."
  },
  {
    id: "p-2",
    question: "What structural parallel do Psalms 22-23-24 form?",
    options: [
      "Past, Present, Future",
      "Death, Burial/Journey through death, Resurrection-Ascension",
      "Father, Son, Holy Spirit",
      "Creation, Fall, Redemption",
    ],
    correctAnswer: 1,
    explanation: "Psalms 22-23-24 form a sequential Christ-trilogy: Psalm 22 = the cross (death), Psalm 23 = walking through the valley of the shadow of death (burial), Psalm 24 = 'Lift up your heads, O ye gates' — the King of glory entering (resurrection-ascension)."
  },
  {
    id: "p-3",
    question: "How does Matthew 18:15-17 (church discipline) scale to cosmic application?",
    options: [
      "It doesn't — it's only about local church",
      "Private → witnesses → church → separation mirrors God's prophetic process: Christ comes personally → Two Witnesses 1260 years → Church judgment message 1844 → final separation",
      "It teaches three steps of evangelism",
      "It parallels the three angels' messages only",
    ],
    correctAnswer: 1,
    explanation: "This is Micro-to-Macro Scaling. The local church discipline process (private → witnesses → church → separation) mirrors God's cosmic redemptive process: Christ comes personally → Two Witnesses (1260 years) → Church judgment message (1844) → final separation."
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
    case "cr":
      return concentrationRoomDrills;
    case "p":
      return parallelsRoomDrills;
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
    case "cr":
      return "Cascading Christ-Discovery";
    case "p":
      return "Structural Parallels";
    default:
      return "Practice Drill";
  }
};
