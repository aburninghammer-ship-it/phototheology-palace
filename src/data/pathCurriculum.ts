import { PathType } from "@/hooks/usePath";

export interface WeekActivity {
  id: string;
  title: string;
  description: string;
  type: "reading" | "drill" | "exercise" | "reflection" | "challenge";
  duration: string; // e.g., "15 min"
  roomCode?: string; // PT room code if applicable
  link?: string; // Where to go in the app
  icon: string;
}

export interface WeekOutline {
  weekNumber: number;
  title: string;
  focus: string;
  scripture: string;
  activities: WeekActivity[];
  milestone?: string;
}

export interface MonthCurriculum {
  month: number;
  title: string;
  theme: string;
  weeks: WeekOutline[];
  gateAssessment: string;
}

// Visual Path - Month 1 Curriculum (Foundation)
const visualPathMonth1: MonthCurriculum = {
  month: 1,
  title: "Building Your Memory Palace",
  theme: "Foundation of Visual Bible Study",
  weeks: [
    {
      weekNumber: 1,
      title: "Introduction to Visual Memory",
      focus: "Learn the basics of the Memory Palace technique and the Story Room (SR)",
      scripture: "Genesis 1-3",
      activities: [
        {
          id: "v1-w1-a1",
          title: "Watch: Memory Palace Introduction",
          description: "Learn the ancient art of the Memory Palace and how it applies to Bible study",
          type: "reading",
          duration: "10 min",
          roomCode: "SR",
          link: "/palace/floor/1/room/story",
          icon: "📺",
        },
        {
          id: "v1-w1-a2",
          title: "Read Genesis 1-3",
          description: "Read slowly, noting vivid images: light bursting forth, the Garden, the serpent",
          type: "reading",
          duration: "20 min",
          link: "/bible/Genesis/1",
          icon: "📖",
        },
        {
          id: "v1-w1-a3",
          title: "Create Your First Room",
          description: "Pick a room in your home as your 'Creation Room' - mentally place 7 objects for 7 days",
          type: "exercise",
          duration: "15 min",
          roomCode: "IR",
          link: "/palace/floor/1/room/imagination",
          icon: "🏠",
        },
        {
          id: "v1-w1-a4",
          title: "Story Visualization Drill",
          description: "Complete the Genesis story visualization exercise in the Story Room",
          type: "drill",
          duration: "10 min",
          roomCode: "SR",
          link: "/palace/floor/1/room/story",
          icon: "🎯",
        },
        {
          id: "v1-w1-a5",
          title: "Daily Review",
          description: "Walk through your Creation Room mentally before bed each night this week",
          type: "reflection",
          duration: "5 min daily",
          icon: "🌙",
        },
      ],
      milestone: "Can recall the 7 days of Creation using your memory palace",
    },
    {
      weekNumber: 2,
      title: "The Imagination Room",
      focus: "Step inside Bible stories through sanctified imagination",
      scripture: "Genesis 22 (Abraham and Isaac)",
      activities: [
        {
          id: "v1-w2-a1",
          title: "Learn: Imagination Room Principles",
          description: "Understanding how to immerse yourself in Scripture scenes",
          type: "reading",
          duration: "10 min",
          roomCode: "IR",
          link: "/palace/floor/1/room/imagination",
          icon: "📚",
        },
        {
          id: "v1-w2-a2",
          title: "Read Genesis 22",
          description: "Read the binding of Isaac, noting sensory details",
          type: "reading",
          duration: "15 min",
          link: "/bible/Genesis/22",
          icon: "📖",
        },
        {
          id: "v1-w2-a3",
          title: "Immersive Experience",
          description: "Close your eyes. Walk up Mount Moriah with Abraham. Feel the weight. See the ram.",
          type: "exercise",
          duration: "20 min",
          roomCode: "IR",
          icon: "👁️",
        },
        {
          id: "v1-w2-a4",
          title: "Draw the Scene",
          description: "Sketch (stick figures are fine!) three key moments from Genesis 22",
          type: "exercise",
          duration: "15 min",
          icon: "✏️",
        },
        {
          id: "v1-w2-a5",
          title: "Connect to Christ",
          description: "How does this scene point to Jesus? Visualize the parallel with Calvary",
          type: "reflection",
          duration: "10 min",
          roomCode: "CR",
          icon: "✝️",
        },
      ],
      milestone: "Can 'walk through' Genesis 22 mentally with full sensory detail",
    },
    {
      weekNumber: 3,
      title: "24 Frames Per Second",
      focus: "Creating symbolic image anchors for each chapter",
      scripture: "Genesis 1-24 (overview)",
      activities: [
        {
          id: "v1-w3-a1",
          title: "Learn: 24FPS Method",
          description: "How to create one memorable image per chapter",
          type: "reading",
          duration: "10 min",
          roomCode: "24F",
          link: "/palace/floor/1/room/24fps",
          icon: "🎬",
        },
        {
          id: "v1-w3-a2",
          title: "Frame Genesis 1-12",
          description: "Create 12 symbolic images for the first 12 chapters of Genesis",
          type: "exercise",
          duration: "30 min",
          roomCode: "24F",
          icon: "🖼️",
        },
        {
          id: "v1-w3-a3",
          title: "Frame Genesis 13-24",
          description: "Complete your 24-frame strip for Genesis 1-24",
          type: "exercise",
          duration: "30 min",
          roomCode: "24F",
          icon: "🖼️",
        },
        {
          id: "v1-w3-a4",
          title: "Speed Review Drill",
          description: "Can you 'flip through' all 24 frames in under 2 minutes?",
          type: "drill",
          duration: "10 min",
          icon: "⚡",
        },
        {
          id: "v1-w3-a5",
          title: "Teach Someone",
          description: "Explain 3 of your frames to a friend or family member",
          type: "exercise",
          duration: "15 min",
          icon: "🗣️",
        },
      ],
      milestone: "Can mentally 'flip through' Genesis 1-24 using your 24 frames",
    },
    {
      weekNumber: 4,
      title: "Translation & Gems",
      focus: "Converting verses into images and collecting insights",
      scripture: "Psalm 23",
      activities: [
        {
          id: "v1-w4-a1",
          title: "Learn: Translation Room",
          description: "How to turn abstract words into concrete images",
          type: "reading",
          duration: "10 min",
          roomCode: "TR",
          link: "/palace/floor/1/room/translation",
          icon: "📚",
        },
        {
          id: "v1-w4-a2",
          title: "Translate Psalm 23",
          description: "Create one vivid image for each verse of Psalm 23",
          type: "exercise",
          duration: "20 min",
          roomCode: "TR",
          icon: "🎨",
        },
        {
          id: "v1-w4-a3",
          title: "Gems Room Introduction",
          description: "Start your gem collection - record 3 insights from this month's study",
          type: "exercise",
          duration: "15 min",
          roomCode: "GR",
          link: "/palace/floor/1/room/gems",
          icon: "💎",
        },
        {
          id: "v1-w4-a4",
          title: "Month 1 Review",
          description: "Walk through all your memory locations from this month",
          type: "drill",
          duration: "20 min",
          icon: "🔄",
        },
        {
          id: "v1-w4-a5",
          title: "Monthly Gate Preparation",
          description: "Prepare for your Month 1 assessment",
          type: "reflection",
          duration: "15 min",
          link: "/dashboard",
          icon: "🚪",
        },
      ],
      milestone: "Ready for Month 1 Gate Assessment",
    },
  ],
  gateAssessment: "Demonstrate your Month 1 memory palace with at least 5 visual anchors. Explain how one image connects to Christ.",
};

// Path curriculum storage
const pathCurricula: Record<PathType, MonthCurriculum[]> = {
  visual: [visualPathMonth1],
  analytical: [
    {
      month: 1,
      title: "Detective Foundation",
      theme: "Building Your Investigation Skills",
      weeks: [
        {
          weekNumber: 1,
          title: "Observation Basics",
          focus: "Learning to see what others miss in Scripture",
          scripture: "Luke 15:11-32 (Prodigal Son)",
          activities: [
            { id: "a1-w1-a1", title: "Learn: Observation Room", description: "The detective's notebook method", type: "reading", duration: "10 min", roomCode: "OR", icon: "🔍" },
            { id: "a1-w1-a2", title: "Read Luke 15:11-32", description: "Read 3 times, noting every detail", type: "reading", duration: "20 min", icon: "📖" },
            { id: "a1-w1-a3", title: "50 Observations", description: "List 50 observations from the Prodigal Son", type: "exercise", duration: "30 min", roomCode: "OR", icon: "📝" },
            { id: "a1-w1-a4", title: "Pattern Hunt", description: "Find 5 patterns or repeated elements", type: "drill", duration: "15 min", icon: "🧩" },
            { id: "a1-w1-a5", title: "Daily Detail", description: "Pick one verse daily and list 10 observations", type: "reflection", duration: "10 min daily", icon: "📋" },
          ],
        },
        {
          weekNumber: 2,
          title: "Definitions & Context",
          focus: "Using the Def-Com Room for deeper study",
          scripture: "John 3:1-21",
          activities: [
            { id: "a1-w2-a1", title: "Learn: Def-Com Room", description: "Definitions and commentary methods", type: "reading", duration: "10 min", roomCode: "DC", icon: "📚" },
            { id: "a1-w2-a2", title: "Word Study: 'Born Again'", description: "Research the Greek behind 'born again'", type: "exercise", duration: "25 min", icon: "🔬" },
            { id: "a1-w2-a3", title: "Historical Context", description: "Research Nicodemus and Pharisees", type: "exercise", duration: "20 min", icon: "📜" },
            { id: "a1-w2-a4", title: "Cross-Reference Chain", description: "Build a chain from John 3:16 to 5 related verses", type: "drill", duration: "15 min", icon: "🔗" },
            { id: "a1-w2-a5", title: "Synthesis", description: "Write a 1-paragraph summary integrating your findings", type: "reflection", duration: "15 min", icon: "✍️" },
          ],
        },
        {
          weekNumber: 3,
          title: "Symbols & Types",
          focus: "Recognizing God's symbolic language",
          scripture: "Exodus 12 (Passover)",
          activities: [
            { id: "a1-w3-a1", title: "Learn: Symbols/Types Room", description: "Understanding biblical symbolism", type: "reading", duration: "10 min", roomCode: "ST", icon: "🎭" },
            { id: "a1-w3-a2", title: "Read Exodus 12", description: "Identify every symbolic element", type: "reading", duration: "20 min", icon: "📖" },
            { id: "a1-w3-a3", title: "Type Mapping", description: "Map Passover lamb → Christ connections", type: "exercise", duration: "25 min", icon: "🗺️" },
            { id: "a1-w3-a4", title: "Symbol Dictionary", description: "Start a personal symbol reference list", type: "exercise", duration: "20 min", icon: "📓" },
            { id: "a1-w3-a5", title: "Type Hunt", description: "Find 3 more types of Christ in Exodus", type: "challenge", duration: "20 min", icon: "🎯" },
          ],
        },
        {
          weekNumber: 4,
          title: "Questions & Chains",
          focus: "The art of asking the right questions",
          scripture: "Review Month 1 passages",
          activities: [
            { id: "a1-w4-a1", title: "Learn: Questions Room", description: "Intra-, inter-, and phototheological questions", type: "reading", duration: "10 min", roomCode: "QR", icon: "❓" },
            { id: "a1-w4-a2", title: "75 Questions Challenge", description: "Generate 25 questions each: intra, inter, PT", type: "exercise", duration: "40 min", icon: "🧠" },
            { id: "a1-w4-a3", title: "Q&A Chains", description: "Use Scripture to answer Scripture", type: "drill", duration: "20 min", roomCode: "QA", icon: "🔗" },
            { id: "a1-w4-a4", title: "Month Review", description: "Review all month 1 findings", type: "drill", duration: "20 min", icon: "🔄" },
            { id: "a1-w4-a5", title: "Gate Prep", description: "Prepare for Month 1 assessment", type: "reflection", duration: "15 min", icon: "🚪" },
          ],
        },
      ],
      gateAssessment: "Present a detailed analysis of one passage showing observations, definitions, symbols, and cross-references.",
    },
  ],
  devotional: [
    {
      month: 1,
      title: "The Listening Heart",
      theme: "Learning to Hear God's Voice in Scripture",
      weeks: [
        {
          weekNumber: 1,
          title: "Sacred Reading",
          focus: "Introduction to Lectio Divina",
          scripture: "Psalm 1",
          activities: [
            { id: "d1-w1-a1", title: "Learn: Lectio Divina", description: "The ancient art of divine reading", type: "reading", duration: "15 min", icon: "📚" },
            { id: "d1-w1-a2", title: "Lectio: Psalm 1", description: "Practice the 4 movements with Psalm 1", type: "exercise", duration: "30 min", icon: "🙏" },
            { id: "d1-w1-a3", title: "Journal Entry", description: "Write what God spoke to you through Psalm 1", type: "reflection", duration: "15 min", icon: "📓" },
            { id: "d1-w1-a4", title: "Daily Lectio", description: "Practice Lectio Divina with one verse daily", type: "reflection", duration: "15 min daily", icon: "🌅" },
            { id: "d1-w1-a5", title: "Share & Pray", description: "Share your insight with someone and pray together", type: "exercise", duration: "15 min", icon: "💬" },
          ],
        },
        {
          weekNumber: 2,
          title: "Heart Questions",
          focus: "Personal application of Scripture",
          scripture: "James 1:19-27",
          activities: [
            { id: "d1-w2-a1", title: "Read James 1:19-27", description: "Read slowly, pausing to listen", type: "reading", duration: "20 min", icon: "📖" },
            { id: "d1-w2-a2", title: "Heart Questions", description: "Ask: What does this mean for ME today?", type: "reflection", duration: "20 min", icon: "❤️" },
            { id: "d1-w2-a3", title: "Mirror Exercise", description: "What does James say about being a doer vs hearer?", type: "exercise", duration: "15 min", icon: "🪞" },
            { id: "d1-w2-a4", title: "Action Step", description: "Choose ONE way to be a doer this week", type: "exercise", duration: "10 min", icon: "👣" },
            { id: "d1-w2-a5", title: "Evening Review", description: "Each night, review: Did I do what I heard?", type: "reflection", duration: "5 min daily", icon: "🌙" },
          ],
        },
        {
          weekNumber: 3,
          title: "Prayer & Scripture",
          focus: "Praying the Bible back to God",
          scripture: "Philippians 1:3-11",
          activities: [
            { id: "d1-w3-a1", title: "Read Phil 1:3-11", description: "Notice Paul's prayer structure", type: "reading", duration: "15 min", icon: "📖" },
            { id: "d1-w3-a2", title: "Pray Paul's Prayer", description: "Personalize Paul's prayer for yourself", type: "exercise", duration: "20 min", icon: "🙏" },
            { id: "d1-w3-a3", title: "Prayer Journal", description: "Write out your Scripture-based prayers", type: "reflection", duration: "20 min", icon: "📓" },
            { id: "d1-w3-a4", title: "Intercessory Praying", description: "Pray this passage for 3 people by name", type: "exercise", duration: "15 min", icon: "🤝" },
            { id: "d1-w3-a5", title: "Daily Scripture Prayer", description: "Turn one verse into prayer each day", type: "reflection", duration: "10 min daily", icon: "⛪" },
          ],
        },
        {
          weekNumber: 4,
          title: "Fire Room Experience",
          focus: "When Scripture moves your heart",
          scripture: "Isaiah 53",
          activities: [
            { id: "d1-w4-a1", title: "Read Isaiah 53", description: "Read slowly, letting each verse sink in", type: "reading", duration: "20 min", icon: "📖" },
            { id: "d1-w4-a2", title: "Fire Room", description: "Which verse pierces your heart? Stay there.", type: "exercise", duration: "30 min", roomCode: "FRm", icon: "🔥" },
            { id: "d1-w4-a3", title: "Confession & Response", description: "Write your response to the Suffering Servant", type: "reflection", duration: "20 min", icon: "✍️" },
            { id: "d1-w4-a4", title: "Month Review", description: "Review your journal entries from Month 1", type: "reflection", duration: "15 min", icon: "🔄" },
            { id: "d1-w4-a5", title: "Gate Prep", description: "Prepare to share your journey", type: "reflection", duration: "15 min", icon: "🚪" },
          ],
        },
      ],
      gateAssessment: "Share one Scripture passage that God used to speak to you this month and what action you took in response.",
    },
  ],
  warrior: [
    {
      month: 1,
      title: "Boot Camp",
      theme: "Building Your Scripture Arsenal",
      weeks: [
        {
          weekNumber: 1,
          title: "Speed Foundations",
          focus: "Rapid recall basics",
          scripture: "Armor of God (Ephesians 6:10-18)",
          activities: [
            { id: "w1-w1-a1", title: "Learn: Speed Room", description: "Rapid-fire study techniques", type: "reading", duration: "10 min", roomCode: "SRm", icon: "⚡" },
            { id: "w1-w1-a2", title: "Memorize Eph 6:10-18", description: "Goal: Recite in under 90 seconds by week end", type: "drill", duration: "20 min daily", icon: "⚔️" },
            { id: "w1-w1-a3", title: "Speed Drill: Armor", description: "Name all 6 armor pieces in 10 seconds", type: "drill", duration: "10 min", icon: "🛡️" },
            { id: "w1-w1-a4", title: "Verse Sprint", description: "How many armor verses can you quote in 2 min?", type: "challenge", duration: "15 min", icon: "🏃" },
            { id: "w1-w1-a5", title: "Battle Partner", description: "Find someone to quiz you daily", type: "exercise", duration: "10 min", icon: "🤺" },
          ],
        },
        {
          weekNumber: 2,
          title: "Scripture Sword",
          focus: "The Word as offensive weapon",
          scripture: "Matthew 4:1-11 (Temptation)",
          activities: [
            { id: "w1-w2-a1", title: "Read Matt 4:1-11", description: "Study how Jesus used Scripture as weapon", type: "reading", duration: "15 min", icon: "📖" },
            { id: "w1-w2-a2", title: "Memorize Jesus' Replies", description: "Learn all 3 of Jesus' responses", type: "drill", duration: "20 min", icon: "⚔️" },
            { id: "w1-w2-a3", title: "Scenario Training", description: "Practice using verses against common temptations", type: "exercise", duration: "20 min", icon: "🎯" },
            { id: "w1-w2-a4", title: "Timed Retrieval", description: "Can you recall the right verse in 5 seconds?", type: "challenge", duration: "15 min", icon: "⏱️" },
            { id: "w1-w2-a5", title: "Daily Combat", description: "Each temptation today, counter with Scripture", type: "reflection", duration: "5 min daily", icon: "💪" },
          ],
        },
        {
          weekNumber: 3,
          title: "Battle Drills",
          focus: "Intensive practice sessions",
          scripture: "Romans 8:28-39",
          activities: [
            { id: "w1-w3-a1", title: "Memorize Rom 8:28-39", description: "The victory passage - own it!", type: "drill", duration: "25 min daily", icon: "📜" },
            { id: "w1-w3-a2", title: "Speed Test", description: "Full passage recitation timed", type: "challenge", duration: "15 min", icon: "⏱️" },
            { id: "w1-w3-a3", title: "Verse Identification", description: "Someone reads a phrase, you complete it", type: "drill", duration: "20 min", icon: "🎯" },
            { id: "w1-w3-a4", title: "Scripture Battle", description: "Challenge someone to a memory duel", type: "challenge", duration: "20 min", icon: "⚔️" },
            { id: "w1-w3-a5", title: "Personal Record", description: "Beat yesterday's time!", type: "drill", duration: "15 min", icon: "🏆" },
          ],
        },
        {
          weekNumber: 4,
          title: "Combat Ready",
          focus: "Month 1 culmination",
          scripture: "Review all month passages",
          activities: [
            { id: "w1-w4-a1", title: "Full Arsenal Review", description: "All month's verses in one session", type: "drill", duration: "30 min", icon: "🔄" },
            { id: "w1-w4-a2", title: "Random Recall", description: "Random verse prompts - instant response", type: "challenge", duration: "20 min", icon: "🎲" },
            { id: "w1-w4-a3", title: "Pressure Test", description: "Recite under distraction or time pressure", type: "challenge", duration: "15 min", icon: "💨" },
            { id: "w1-w4-a4", title: "Teach & Test", description: "Teach your verses to someone else", type: "exercise", duration: "20 min", icon: "🗣️" },
            { id: "w1-w4-a5", title: "Gate Battle", description: "Prepare for combat assessment", type: "drill", duration: "20 min", icon: "🚪" },
          ],
        },
      ],
      gateAssessment: "Recite all memorized passages (Eph 6:10-18, Matt 4 replies, Rom 8:28-39) with at least 95% accuracy under time pressure.",
    },
  ],
};

// Get current week in the month (1-4)
export const getCurrentWeekInMonth = (startDate: string): number => {
  const start = new Date(startDate);
  const now = new Date();
  const daysSinceStart = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const weekNumber = Math.floor(daysSinceStart / 7) % 4 + 1;
  return Math.min(weekNumber, 4);
};

// Get curriculum for a specific path and month
export const getPathCurriculum = (pathType: PathType, month: number): MonthCurriculum | null => {
  const curriculum = pathCurricula[pathType];
  return curriculum.find((m) => m.month === month) || null;
};

// Get current week's outline
export const getCurrentWeekOutline = (
  pathType: PathType,
  month: number,
  weekNumber: number
): WeekOutline | null => {
  const monthCurriculum = getPathCurriculum(pathType, month);
  if (!monthCurriculum) return null;
  return monthCurriculum.weeks.find((w) => w.weekNumber === weekNumber) || null;
};

export { pathCurricula };
