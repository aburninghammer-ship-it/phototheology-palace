import { Book, Eye, Film, Image, Gem, Target, Layers, Brain, Flame } from "lucide-react";

export const PALACE_PRINCIPLES = {
  SR: {
    name: "Story Room",
    tag: "SR",
    icon: Book,
    description: "Breaking biblical events into memorable sequence beats\u2014like film frames that capture the essential plot movements."
  },
  IR: {
    name: "Imagination Room",
    tag: "IR",
    icon: Eye,
    description: "Stepping inside the story with all five senses to create emotional memory that transforms information into experience."
  },
  "24FPS": {
    name: "24FPS Room",
    tag: "24",
    icon: Film,
    description: "Creating one memorable visual image per chapter for instant recall\u2014like a mental GPS for the Bible."
  },
  TR: {
    name: "Translation Room",
    tag: "TR",
    icon: Image,
    description: "Converting abstract words into concrete pictures. Verses become icons, passages become comics, books become murals."
  },
  GR: {
    name: "Gems Room",
    tag: "GR",
    icon: Gem,
    description: "Mining Scripture by combining 2-4 unrelated texts until they illuminate each other with stunning clarity."
  },
  CR: {
    name: "Concentration Room",
    tag: "CR",
    icon: Target,
    description: "The Christ-centered lens: every text must pass through this room. Where is Jesus? How does this point to Him?"
  },
  DR: {
    name: "Dimensions Room",
    tag: "DR",
    icon: Layers,
    description: "Stretching each passage across five dimensions: Literal, Christ, Me, Church, and Heaven."
  },
  PRm: {
    name: "Patterns Room",
    tag: "PRm",
    icon: Brain,
    description: "Recognizing God's fingerprints across Scripture\u2014recurring motifs like 40 days, 3 days, deliverer stories."
  },
  BL: {
    name: "Blue Room (Sanctuary)",
    tag: "BL",
    icon: Flame,
    description: "The architectural blueprint of salvation: altar, laver, lampstand, showbread, incense, ark\u2014all pointing to Christ."
  }
};

export interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface PrincipleApplication {
  principle: keyof typeof PALACE_PRINCIPLES;
  application: string;
  exercise: string;
}

export interface StudyContent {
  id: number;
  title: string;
  summary: string;
  openingStory: string;
  mainTeaching: string;
  keyPassages: string[];
  memoryVerse: string;
  questions: Question[];
  principleApplications: PrincipleApplication[];
  reflection: string;
  takeHomeChallenge: string;
}
