import {
  SCRIPT_STORY_ROOM,
  SCRIPT_IMAGINATION_ROOM,
  SCRIPT_24FPS_ROOM,
  SCRIPT_BIBLE_RENDERED,
  SCRIPT_TRANSLATION_ROOM,
  SCRIPT_GEMS_ROOM,
  SCRIPT_OBSERVATION_ROOM,
  SCRIPT_DEFCOM_ROOM,
  SCRIPT_SYMBOLS_TYPES,
  SCRIPT_QUESTIONS_ROOM,
  SCRIPT_QA_ROOM,
  SCRIPT_NATURE_FREESTYLE,
  SCRIPT_PERSONAL_FREESTYLE,
  SCRIPT_BIBLE_FREESTYLE,
  SCRIPT_HISTORY_FREESTYLE,
  SCRIPT_LISTENING_ROOM,
  SCRIPT_CONCENTRATION_ROOM,
  SCRIPT_DIMENSIONS_ROOM,
  SCRIPT_CONNECT6_ROOM,
  SCRIPT_THEME_ROOM,
  SCRIPT_TIME_ZONE,
  SCRIPT_PATTERNS_ROOM,
  SCRIPT_PARALLELS_ROOM,
  SCRIPT_FRUIT_ROOM,
  SCRIPT_BLUE_ROOM,
  SCRIPT_PROPHECY_ROOM,
  SCRIPT_THREE_ANGELS,
  SCRIPT_FEASTS_ROOM,
  SCRIPT_FIRST_HEAVEN,
  SCRIPT_SECOND_HEAVEN,
  SCRIPT_THIRD_HEAVEN,
  SCRIPT_EIGHT_CYCLES,
  SCRIPT_JUICE_ROOM,
  SCRIPT_MATHEMATICS_ROOM,
  SCRIPT_FIRE_ROOM,
  SCRIPT_MEDITATION_ROOM,
  SCRIPT_SPEED_ROOM,
  SCRIPT_MASTER_FLOOR,
  SCRIPT_ASCENSIONS_EXPANSIONS,
  SCRIPT_EQUATIONS,
} from "./masterClassScripts";

export interface MasterClassProfessor {
  name: string;
  title: string;
  avatar?: string;
  voiceId: string;
}

export interface MasterClassDef {
  id: string;
  classNumber: number;
  title: string;
  subtitle: string;
  professor: MasterClassProfessor;
  roomId?: string;
  floorNumber?: number;
  duration: string;
  script: string;
  transcript?: string;
  status: "available";
}

const CLASS_1_SCRIPT = `Welcome to Phototheology. My name is Professor Elias, and I will be your guide through this introduction to one of the most comprehensive Bible study systems ever assembled.

[pause]

Before we begin, let me ask you a question. Have you ever read a chapter of the Bible and walked away feeling like you barely scratched the surface? Like there was something deeper waiting for you, but you did not have the tools to reach it?

If so, you are not alone. Most believers read Scripture faithfully, but few have a systematic method for mining its full depth. Phototheology changes that.

[pause]

So what is Phototheology? The word comes from three Greek roots. Phos, meaning light. Theos, meaning God. And logos, meaning word or study. Put them together and you get the study of God through light. And that is exactly what this system does. It illuminates every chapter of Scripture until you can see Christ shining through it.

[long pause]

At its core, Phototheology answers one question. How do I see Christ in every chapter of the Bible? Not just the obvious ones. Not just the Gospels or the Messianic psalms. Every chapter. Genesis to Revelation. All sixty-six books. All one thousand one hundred and eighty-nine chapters.

The system is built on three convictions. First, the Bible is one unified testimony to Jesus Christ. As He said in John chapter five verse thirty-nine, Search the scriptures, for in them ye think ye have eternal life, and they are they which testify of me. Second, visual memory is more powerful than verbal memory. And third, study must bear fruit. Knowledge without transformation is dead.

[long pause]

Phototheology is organized as a Memory Palace. Seven floors, each with a series of rooms. Each room teaches a specific Bible study skill. As you move from floor one to floor seven, you progress from foundational skills to advanced mastery. And beyond floor seven, the Eighth Floor, where the Palace disappears because it is inside you.

[pause]

Floor One is Furnishing: memory and visualization. Six rooms including the Story Room, Imagination Room, 24FPS Room, Bible Rendered, Translation Room, and Gems Room.

[pause]

Floor Two is Investigation: detective work. The Observation Room, Def-Com Room, Symbols and Types, Questions Room, and Q and A Chains.

[pause]

Floor Three is Freestyle: creative connections. Nature, Personal, Bible, History Freestyle, and the Listening Room.

[pause]

Floor Four is Next Level: Christ-centered depth. The largest floor with Concentration, Dimensions, Connect-6, Theme, Time Zone, Patterns, Parallels, and the Fruit Room.

[pause]

Floor Five is Vision: prophecy and sanctuary. The Blue Room, Prophecy Room, Three Angels, and Feasts Room.

[pause]

Floor Six is Three Heavens and Cycles. The cosmic perspective.

[pause]

Floor Seven is Transformation. Fire, Meditation, and Speed.

[long pause]

You do not have to master them all at once. The Palace is designed as a journey. Each room builds on the one before it.

[pause]

Let me give you a taste. Genesis chapter twenty-two. The binding of Isaac. In the Story Room, you see a father and son climbing a mountain. In the Imagination Room, you feel the weight of the wood on Isaac's back. In the Concentration Room, you find Christ: Abraham is a type of the Father, Isaac a type of the Son, the ram is the substitute, and Mount Moriah is Calvary. In the Dimensions Room, you see five layers: literal test of faith, Christ preview of the cross, personal call to surrender, church revelation of redemption's cost, and heavenly pointer to the Lamb slain from the foundation of the world.

[pause]

One chapter. Five rooms. And we have barely begun.

[long pause]

That is the Phototheology promise. In the classes that follow, each professor will take you deep into their assigned room. Some will be intense and scholarly. Others warm and pastoral. Each brings a unique voice.

[pause]

This is your invitation. Step into the Palace. The door is open. Christ is waiting in every room.

[pause]

I am Professor Elias. Welcome to the Master Class.`;

export const MASTER_CLASSES: MasterClassDef[] = [
  { id: "class-1-introduction", classNumber: 1, title: "Introduction to Phototheology", subtitle: "The System", professor: { name: "Professor Elias", title: "System Architect", voiceId: "scholar" }, duration: "~10 min", script: CLASS_1_SCRIPT, status: "available" },

  // Floor 1: Furnishing
  { id: "class-2-story-room", classNumber: 2, title: "The Story Room", subtitle: "Narrative Recall", professor: { name: "Professor Ashworth", title: "Narrative Specialist", voiceId: "epic" }, roomId: "SR", floorNumber: 1, duration: "~23 min", script: SCRIPT_STORY_ROOM, status: "available" },
  { id: "class-3-imagination-room", classNumber: 3, title: "The Imagination Room", subtitle: "Sensory Immersion", professor: { name: "Professor Danvers", title: "Immersion Guide", voiceId: "ancient" }, roomId: "IR", floorNumber: 1, duration: "~21 min", script: SCRIPT_IMAGINATION_ROOM, status: "available" },
  { id: "class-4-24fps-room", classNumber: 4, title: "The 24FPS Room", subtitle: "Visual Mapping", professor: { name: "Professor Kingsley", title: "Visual Architect", voiceId: "george" }, roomId: "24FPS", floorNumber: 1, duration: "~16 min", script: SCRIPT_24FPS_ROOM, status: "available" },
  { id: "class-5-bible-rendered", classNumber: 5, title: "Bible Rendered", subtitle: "51-Glyph Panorama", professor: { name: "Professor Mercer", title: "Panoramic Scholar", voiceId: "brian" }, roomId: "BR", floorNumber: 1, duration: "~16 min", script: SCRIPT_BIBLE_RENDERED, status: "available" },
  { id: "class-6-translation-room", classNumber: 6, title: "The Translation Room", subtitle: "Words into Pictures", professor: { name: "Professor Thorne", title: "Language Translator", voiceId: "callum" }, roomId: "TR", floorNumber: 1, duration: "~17 min", script: SCRIPT_TRANSLATION_ROOM, status: "available" },
  { id: "class-7-gems-room", classNumber: 7, title: "The Gems Room", subtitle: "Mining Treasures", professor: { name: "Professor Jewel", title: "Gem Collector", voiceId: "sarah" }, roomId: "GR", floorNumber: 1, duration: "~17 min", script: SCRIPT_GEMS_ROOM, status: "available" },

  // Floor 2: Investigation
  { id: "class-8-observation-room", classNumber: 8, title: "The Observation Room", subtitle: "Detective's Notebook", professor: { name: "Professor Hale", title: "Chief Investigator", voiceId: "roger" }, roomId: "OR", floorNumber: 2, duration: "~21 min", script: SCRIPT_OBSERVATION_ROOM, status: "available" },
  { id: "class-9-defcom-room", classNumber: 9, title: "The Def-Com Room", subtitle: "Forensic Lab", professor: { name: "Professor Lexis", title: "Linguistic Forensicist", voiceId: "daniel" }, roomId: "DC", floorNumber: 2, duration: "~17 min", script: SCRIPT_DEFCOM_ROOM, status: "available" },
  { id: "class-10-symbols-types", classNumber: 10, title: "Symbols & Types Room", subtitle: "God's Visual Language", professor: { name: "Professor Whitfield", title: "Typology Expert", voiceId: "preacher" }, roomId: "ST", floorNumber: 2, duration: "~17 min", script: SCRIPT_SYMBOLS_TYPES, status: "available" },
  { id: "class-11-questions-room", classNumber: 11, title: "The Questions Room", subtitle: "Interrogation Chamber", professor: { name: "Professor Query", title: "Chief Interrogator", voiceId: "alice" }, roomId: "QR", floorNumber: 2, duration: "~16 min", script: SCRIPT_QUESTIONS_ROOM, status: "available" },
  { id: "class-12-qa-room", classNumber: 12, title: "The Q&A Chains Room", subtitle: "Scripture Answers Scripture", professor: { name: "Professor Cross", title: "Cross-Examiner", voiceId: "charlie" }, roomId: "QA", floorNumber: 2, duration: "~17 min", script: SCRIPT_QA_ROOM, status: "available" },

  // Floor 3: Freestyle
  { id: "class-13-nature-freestyle", classNumber: 13, title: "Nature Freestyle", subtitle: "God's Second Book", professor: { name: "Professor Rivers", title: "Creation Guide", voiceId: "counselor" }, roomId: "NF", floorNumber: 3, duration: "~25 min", script: SCRIPT_NATURE_FREESTYLE, status: "available" },
  { id: "class-14-personal-freestyle", classNumber: 14, title: "Personal Freestyle", subtitle: "Life as Lesson", professor: { name: "Professor Hart", title: "Life Application Coach", voiceId: "jessica" }, roomId: "PF", floorNumber: 3, duration: "~23 min", script: SCRIPT_PERSONAL_FREESTYLE, status: "available" },
  { id: "class-15-bible-freestyle", classNumber: 15, title: "Bible Freestyle", subtitle: "Verse Genetics", professor: { name: "Professor Strand", title: "Verse Genealogist", voiceId: "liam" }, roomId: "BF", floorNumber: 3, duration: "~20 min", script: SCRIPT_BIBLE_FREESTYLE, status: "available" },
  { id: "class-16-history-freestyle", classNumber: 16, title: "History Freestyle", subtitle: "Bible Meets World", professor: { name: "Professor Archford", title: "Historical Analyst", voiceId: "will" }, roomId: "HF", floorNumber: 3, duration: "~23 min", script: SCRIPT_HISTORY_FREESTYLE, status: "available" },
  { id: "class-17-listening-room", classNumber: 17, title: "The Listening Room", subtitle: "Responsive Connection", professor: { name: "Professor Keene", title: "Active Listener", voiceId: "matilda" }, roomId: "LR", floorNumber: 3, duration: "~25 min", script: SCRIPT_LISTENING_ROOM, status: "available" },

  // Floor 4: Next Level
  { id: "class-18-concentration-room", classNumber: 18, title: "The Concentration Room", subtitle: "Finding Christ in Every Text", professor: { name: "Professor Whitmore", title: "Christological Scholar", voiceId: "eric" }, roomId: "CR", floorNumber: 4, duration: "~22 min", script: SCRIPT_CONCENTRATION_ROOM, status: "available" },
  { id: "class-19-dimensions-room", classNumber: 19, title: "The Dimensions Room", subtitle: "Five-Dimensional Lens", professor: { name: "Professor Prism", title: "Dimensional Theologian", voiceId: "lily" }, roomId: "DR", floorNumber: 4, duration: "~19 min", script: SCRIPT_DIMENSIONS_ROOM, status: "available" },
  { id: "class-20-connect6-room", classNumber: 20, title: "The Connect-6 Room", subtitle: "Genre Classification", professor: { name: "Professor Reedman", title: "Genre Specialist", voiceId: "bill" }, roomId: "C6", floorNumber: 4, duration: "~15 min", script: SCRIPT_CONNECT6_ROOM, status: "available" },
  { id: "class-21-theme-room", classNumber: 21, title: "The Theme Room", subtitle: "Walls of Theology", professor: { name: "Professor Magnus", title: "Structural Theologian", voiceId: "epic" }, roomId: "TRM", floorNumber: 4, duration: "~17 min", script: SCRIPT_THEME_ROOM, status: "available" },
  { id: "class-22-time-zone", classNumber: 22, title: "The Time Zone Room", subtitle: "Past, Present, Future", professor: { name: "Professor Epoch", title: "Timeline Navigator", voiceId: "george" }, roomId: "TZ", floorNumber: 4, duration: "~14 min", script: SCRIPT_TIME_ZONE, status: "available" },
  { id: "class-23-patterns-room", classNumber: 23, title: "The Patterns Room", subtitle: "God's Fingerprints", professor: { name: "Professor Weaver", title: "Pattern Tracker", voiceId: "brian" }, roomId: "PRM", floorNumber: 4, duration: "~13 min", script: SCRIPT_PATTERNS_ROOM, status: "available" },
  { id: "class-24-parallels-room", classNumber: 24, title: "The Parallels Room", subtitle: "Mirrored Actions", professor: { name: "Professor Mirror", title: "Parallel Historian", voiceId: "ancient" }, roomId: "P||", floorNumber: 4, duration: "~14 min", script: SCRIPT_PARALLELS_ROOM, status: "available" },
  { id: "class-25-fruit-room", classNumber: 25, title: "The Fruit Room", subtitle: "The Final Test", professor: { name: "Professor Bloom", title: "Spiritual Examiner", voiceId: "counselor" }, roomId: "FRT", floorNumber: 4, duration: "~18 min", script: SCRIPT_FRUIT_ROOM, status: "available" },

  // Floor 5: Vision
  { id: "class-26-blue-room", classNumber: 26, title: "The Blue Room", subtitle: "Sanctuary Blueprint", professor: { name: "Professor Temple", title: "Sanctuary Scholar", voiceId: "scholar" }, roomId: "BL", floorNumber: 5, duration: "~22 min", script: SCRIPT_BLUE_ROOM, status: "available" },
  { id: "class-27-prophecy-room", classNumber: 27, title: "The Prophecy Room", subtitle: "Prophetic Telescope", professor: { name: "Professor Blackwell", title: "Prophecy Historian", voiceId: "preacher" }, roomId: "PR", floorNumber: 5, duration: "~15 min", script: SCRIPT_PROPHECY_ROOM, status: "available" },
  { id: "class-28-three-angels", classNumber: 28, title: "Three Angels' Room", subtitle: "Final Gospel", professor: { name: "Professor Herald", title: "Message Bearer", voiceId: "roger" }, roomId: "3A", floorNumber: 5, duration: "~15 min", script: SCRIPT_THREE_ANGELS, status: "available" },
  { id: "class-29-feasts-room", classNumber: 29, title: "The Feasts Room", subtitle: "God's Calendar", professor: { name: "Professor Moadim", title: "Feast Calendar Scholar", voiceId: "sarah" }, roomId: "FE", floorNumber: 5, duration: "~14 min", script: SCRIPT_FEASTS_ROOM, status: "available" },

  // Floor 6: Three Heavens & Cycles
  { id: "class-30-first-heaven", classNumber: 30, title: "First Heaven", subtitle: "Babylon & Restoration", professor: { name: "Professor Babylon", title: "Exile Historian", voiceId: "ancient" }, roomId: "1H", floorNumber: 6, duration: "~11 min", script: SCRIPT_FIRST_HEAVEN, status: "available" },
  { id: "class-31-second-heaven", classNumber: 31, title: "Second Heaven", subtitle: "Rome & New Covenant", professor: { name: "Professor Roman", title: "New Covenant Scholar", voiceId: "eric" }, roomId: "2H", floorNumber: 6, duration: "~12 min", script: SCRIPT_SECOND_HEAVEN, status: "available" },
  { id: "class-32-third-heaven", classNumber: 32, title: "Third Heaven", subtitle: "Final New Creation", professor: { name: "Professor Novus", title: "Eschatology Guide", voiceId: "lily" }, roomId: "3H", floorNumber: 6, duration: "~12 min", script: SCRIPT_THIRD_HEAVEN, status: "available" },
  { id: "class-33-eight-cycles", classNumber: 33, title: "Eight Covenant Cycles", subtitle: "Adam to Remnant", professor: { name: "Professor Covenant", title: "Covenant Historian", voiceId: "bill" }, roomId: "CYCLES", floorNumber: 6, duration: "~14 min", script: SCRIPT_EIGHT_CYCLES, status: "available" },
  { id: "class-34-juice-room", classNumber: 34, title: "The Juice Room", subtitle: "Squeeze Every Drop", professor: { name: "Professor Squeeze", title: "Integration Master", voiceId: "jessica" }, roomId: "JR", floorNumber: 6, duration: "~14 min", script: SCRIPT_JUICE_ROOM, status: "available" },
  { id: "class-35-mathematics-room", classNumber: 35, title: "The Mathematics Room", subtitle: "Time Prophecy Structures", professor: { name: "Professor Chronos", title: "Prophetic Mathematician", voiceId: "callum" }, roomId: "MATH", floorNumber: 6, duration: "~16 min", script: SCRIPT_MATHEMATICS_ROOM, status: "available" },

  // Floor 7: Transformation
  { id: "class-36-fire-room", classNumber: 36, title: "The Fire Room", subtitle: "Emotional Weight", professor: { name: "Professor Flame", title: "Devotional Fire-Keeper", voiceId: "preacher" }, roomId: "FRM", floorNumber: 7, duration: "~24 min", script: SCRIPT_FIRE_ROOM, status: "available" },
  { id: "class-37-meditation-room", classNumber: 37, title: "The Meditation Room", subtitle: "Slow Saturation", professor: { name: "Professor Stillwater", title: "Meditation Guide", voiceId: "counselor" }, roomId: "MR", floorNumber: 7, duration: "~20 min", script: SCRIPT_MEDITATION_ROOM, status: "available" },
  { id: "class-38-speed-room", classNumber: 38, title: "The Speed Room", subtitle: "Rapid-Fire Connections", professor: { name: "Professor Flash", title: "Reflex Trainer", voiceId: "liam" }, roomId: "SRM", floorNumber: 7, duration: "~15 min", script: SCRIPT_SPEED_ROOM, status: "available" },

  // Master Floor
  { id: "class-39-master-floor", classNumber: 39, title: "The Master Floor", subtitle: "Reflexive Mastery", professor: { name: "Professor Elias", title: "System Architect", voiceId: "scholar" }, floorNumber: 8, duration: "~23 min", script: SCRIPT_MASTER_FLOOR, status: "available" },

  // Advanced Classes
  { id: "class-40-ascensions-expansions", classNumber: 40, title: "Ascensions & Expansions", subtitle: "Climbing & Growing", professor: { name: "Professor Zenith", title: "Ascension & Expansion Architect", voiceId: "counselor" }, duration: "~28 min", script: SCRIPT_ASCENSIONS_EXPANSIONS, status: "available" },
  { id: "class-41-equations", classNumber: 41, title: "Biblical Equations", subtitle: "Theological Formulas", professor: { name: "Professor Axiom", title: "Equation Architect", voiceId: "scholar" }, duration: "~23 min", script: SCRIPT_EQUATIONS, status: "available" },
];

export function getMasterClassById(id: string): MasterClassDef | undefined {
  return MASTER_CLASSES.find((c) => c.id === id);
}

export function getAvailableClasses(): MasterClassDef[] {
  return MASTER_CLASSES.filter((c) => c.status === "available");
}
