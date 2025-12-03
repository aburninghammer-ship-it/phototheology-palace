import { PathType } from "@/hooks/usePath";

export interface WeekActivity {
  id: string;
  title: string;
  description: string;
  type: "reading" | "drill" | "exercise" | "reflection" | "challenge";
  duration: string;
  roomCode?: string;
  link?: string;
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

// ============================================
// VISUAL PATH - All 24 Months
// ============================================
const visualPathCurriculum: MonthCurriculum[] = [
  // YEAR 1 - FOUNDATION
  {
    month: 1,
    title: "Building Your Memory Palace",
    theme: "Foundation of Visual Bible Study",
    weeks: [
      {
        weekNumber: 1,
        title: "Introduction to Visual Memory",
        focus: "Learn the Memory Palace technique and Story Room (SR)",
        scripture: "Genesis 1-3",
        activities: [
          { id: "v1-w1-a1", title: "Watch: Memory Palace Introduction", description: "Learn the ancient art of the Memory Palace for Bible study", type: "reading", duration: "10 min", roomCode: "SR", link: "/palace/floor/1/room/story", icon: "📺" },
          { id: "v1-w1-a2", title: "Read Genesis 1-3", description: "Read slowly, noting vivid images: light bursting forth, the Garden, the serpent", type: "reading", duration: "20 min", link: "/bible/Genesis/1", icon: "📖" },
          { id: "v1-w1-a3", title: "Create Your First Room", description: "Pick a room in your home as your 'Creation Room' - place 7 objects for 7 days", type: "exercise", duration: "15 min", roomCode: "IR", link: "/palace/floor/1/room/imagination", icon: "🏠" },
          { id: "v1-w1-a4", title: "Story Visualization Drill", description: "Complete the Genesis story visualization exercise", type: "drill", duration: "10 min", roomCode: "SR", link: "/palace/floor/1/room/story", icon: "🎯" },
          { id: "v1-w1-a5", title: "Daily Review", description: "Walk through your Creation Room mentally before bed each night", type: "reflection", duration: "5 min daily", icon: "🌙" },
        ],
        milestone: "Can recall the 7 days of Creation using your memory palace",
      },
      {
        weekNumber: 2,
        title: "The Imagination Room",
        focus: "Step inside Bible stories through sanctified imagination",
        scripture: "Genesis 22 (Abraham and Isaac)",
        activities: [
          { id: "v1-w2-a1", title: "Learn: Imagination Room Principles", description: "Understanding how to immerse yourself in Scripture scenes", type: "reading", duration: "10 min", roomCode: "IR", link: "/palace/floor/1/room/imagination", icon: "📚" },
          { id: "v1-w2-a2", title: "Read Genesis 22", description: "Read the binding of Isaac, noting sensory details", type: "reading", duration: "15 min", link: "/bible/Genesis/22", icon: "📖" },
          { id: "v1-w2-a3", title: "Immersive Experience", description: "Close your eyes. Walk up Mount Moriah with Abraham. Feel the weight. See the ram.", type: "exercise", duration: "20 min", roomCode: "IR", icon: "👁️" },
          { id: "v1-w2-a4", title: "Draw the Scene", description: "Sketch three key moments from Genesis 22 (stick figures are fine!)", type: "exercise", duration: "15 min", icon: "✏️" },
          { id: "v1-w2-a5", title: "Connect to Christ", description: "How does this scene point to Jesus? Visualize the parallel with Calvary", type: "reflection", duration: "10 min", roomCode: "CR", icon: "✝️" },
        ],
        milestone: "Can 'walk through' Genesis 22 mentally with full sensory detail",
      },
      {
        weekNumber: 3,
        title: "24 Frames Per Second",
        focus: "Creating symbolic image anchors for each chapter",
        scripture: "Genesis 1-24 (overview)",
        activities: [
          { id: "v1-w3-a1", title: "Learn: 24FPS Method", description: "How to create one memorable image per chapter", type: "reading", duration: "10 min", roomCode: "24F", link: "/palace/floor/1/room/24fps", icon: "🎬" },
          { id: "v1-w3-a2", title: "Frame Genesis 1-12", description: "Create 12 symbolic images for the first 12 chapters", type: "exercise", duration: "30 min", roomCode: "24F", icon: "🖼️" },
          { id: "v1-w3-a3", title: "Frame Genesis 13-24", description: "Complete your 24-frame strip for Genesis 1-24", type: "exercise", duration: "30 min", roomCode: "24F", icon: "🖼️" },
          { id: "v1-w3-a4", title: "Speed Review Drill", description: "Can you 'flip through' all 24 frames in under 2 minutes?", type: "drill", duration: "10 min", icon: "⚡" },
          { id: "v1-w3-a5", title: "Teach Someone", description: "Explain 3 of your frames to a friend or family member", type: "exercise", duration: "15 min", icon: "🗣️" },
        ],
        milestone: "Can mentally 'flip through' Genesis 1-24 using your 24 frames",
      },
      {
        weekNumber: 4,
        title: "Translation & Gems",
        focus: "Converting verses into images and collecting insights",
        scripture: "Psalm 23",
        activities: [
          { id: "v1-w4-a1", title: "Learn: Translation Room", description: "How to turn abstract words into concrete images", type: "reading", duration: "10 min", roomCode: "TR", link: "/palace/floor/1/room/translation", icon: "📚" },
          { id: "v1-w4-a2", title: "Translate Psalm 23", description: "Create one vivid image for each verse of Psalm 23", type: "exercise", duration: "20 min", roomCode: "TR", icon: "🎨" },
          { id: "v1-w4-a3", title: "Gems Room Introduction", description: "Start your gem collection - record 3 insights from this month", type: "exercise", duration: "15 min", roomCode: "GR", link: "/palace/floor/1/room/gems", icon: "💎" },
          { id: "v1-w4-a4", title: "Month 1 Review", description: "Walk through all your memory locations from this month", type: "drill", duration: "20 min", icon: "🔄" },
          { id: "v1-w4-a5", title: "Monthly Gate Preparation", description: "Prepare for your Month 1 assessment", type: "reflection", duration: "15 min", link: "/dashboard", icon: "🚪" },
        ],
        milestone: "Ready for Month 1 Gate Assessment",
      },
    ],
    gateAssessment: "Demonstrate your Month 1 memory palace with at least 5 visual anchors. Explain how one image connects to Christ.",
  },
  {
    month: 2,
    title: "Expanding Your Visual Library",
    theme: "Building the Investigation Floor",
    weeks: [
      {
        weekNumber: 1,
        title: "The Observation Room",
        focus: "Training your eye to see what others miss",
        scripture: "Luke 15:11-32 (Prodigal Son)",
        activities: [
          { id: "v2-w1-a1", title: "Learn: Visual Observation", description: "How to notice details that paint the picture", type: "reading", duration: "10 min", roomCode: "OR", link: "/palace/floor/2/room/observation", icon: "🔍" },
          { id: "v2-w1-a2", title: "Read Luke 15:11-32", description: "Read 3 times, creating mental images for each scene", type: "reading", duration: "25 min", link: "/bible/Luke/15", icon: "📖" },
          { id: "v2-w1-a3", title: "Scene Mapping", description: "Draw a simple map of the prodigal's journey with images at each stop", type: "exercise", duration: "20 min", icon: "🗺️" },
          { id: "v2-w1-a4", title: "Color the Scene", description: "Assign colors to emotions in the story - what color is shame? Joy? Jealousy?", type: "exercise", duration: "15 min", icon: "🎨" },
          { id: "v2-w1-a5", title: "Daily Image Capture", description: "Find one striking image from your daily Bible reading", type: "reflection", duration: "10 min daily", icon: "📸" },
        ],
        milestone: "Can visualize the entire Prodigal Son story in sequence",
      },
      {
        weekNumber: 2,
        title: "Symbols & Types Visual",
        focus: "Seeing Christ through symbols",
        scripture: "Exodus 12 (Passover)",
        activities: [
          { id: "v2-w2-a1", title: "Learn: Symbol Visualization", description: "How to picture biblical symbols and types", type: "reading", duration: "10 min", roomCode: "ST", link: "/palace/floor/2/room/symbols", icon: "🎭" },
          { id: "v2-w2-a2", title: "Read Exodus 12", description: "Visualize every element: lamb, blood, doorposts, death angel", type: "reading", duration: "20 min", link: "/bible/Exodus/12", icon: "📖" },
          { id: "v2-w2-a3", title: "Create Symbol Cards", description: "Make visual flashcards for 10 Passover symbols", type: "exercise", duration: "25 min", icon: "🃏" },
          { id: "v2-w2-a4", title: "Overlay Exercise", description: "Picture Passover lamb, then overlay Christ on the cross - same pose", type: "exercise", duration: "15 min", roomCode: "CR", icon: "✝️" },
          { id: "v2-w2-a5", title: "Symbol Hunt", description: "Find 3 more Christ-symbols in Exodus 12 and visualize them", type: "drill", duration: "15 min", icon: "🔎" },
        ],
        milestone: "Can explain Passover visually with Christ connections",
      },
      {
        weekNumber: 3,
        title: "Building Image Chains",
        focus: "Linking visual stories together",
        scripture: "Daniel 2 (Image of Gold)",
        activities: [
          { id: "v2-w3-a1", title: "Read Daniel 2", description: "Visualize the statue: gold head, silver chest, bronze belly, iron legs, clay feet", type: "reading", duration: "20 min", link: "/bible/Daniel/2", icon: "📖" },
          { id: "v2-w3-a2", title: "Build the Statue", description: "Create a detailed mental image of Nebuchadnezzar's statue", type: "exercise", duration: "20 min", icon: "🗿" },
          { id: "v2-w3-a3", title: "Historical Overlay", description: "Add empire flags/symbols to each section of the statue", type: "exercise", duration: "15 min", icon: "🏛️" },
          { id: "v2-w3-a4", title: "The Stone", description: "Visualize the stone cut without hands - watch it strike and grow", type: "exercise", duration: "10 min", icon: "🪨" },
          { id: "v2-w3-a5", title: "Chain Link", description: "Connect Daniel 2 to Daniel 7 - same empires, different images", type: "drill", duration: "20 min", icon: "🔗" },
        ],
        milestone: "Can explain Daniel 2 prophecy using visual aids from memory",
      },
      {
        weekNumber: 4,
        title: "Month 2 Integration",
        focus: "Combining all visual techniques",
        scripture: "Review & Integration",
        activities: [
          { id: "v2-w4-a1", title: "Palace Walk-through", description: "Walk through all memory locations from Months 1-2", type: "drill", duration: "25 min", icon: "🏰" },
          { id: "v2-w4-a2", title: "Cross-Link Exercise", description: "Connect 3 stories from different books using visual bridges", type: "exercise", duration: "20 min", icon: "🌉" },
          { id: "v2-w4-a3", title: "Gem Collection", description: "Add 5 new gems to your collection with visual anchors", type: "exercise", duration: "15 min", roomCode: "GR", icon: "💎" },
          { id: "v2-w4-a4", title: "Speed Recall Test", description: "How many stories can you visualize in 5 minutes?", type: "challenge", duration: "15 min", icon: "⏱️" },
          { id: "v2-w4-a5", title: "Gate Preparation", description: "Prepare for Month 2 assessment", type: "reflection", duration: "15 min", icon: "🚪" },
        ],
        milestone: "Ready for Month 2 Gate Assessment",
      },
    ],
    gateAssessment: "Present a visual walk-through of the Passover and its Christ-connection, plus demonstrate your Daniel 2 visualization.",
  },
  {
    month: 3,
    title: "Freestyle Visual Connections",
    theme: "Seeing Scripture Everywhere",
    weeks: [
      {
        weekNumber: 1,
        title: "Nature Visualization",
        focus: "Finding Scripture in creation",
        scripture: "Psalm 19, Romans 1:20",
        activities: [
          { id: "v3-w1-a1", title: "Learn: Nature Freestyle", description: "How to connect nature to Scripture visually", type: "reading", duration: "10 min", roomCode: "NF", link: "/palace/floor/3/room/nature-freestyle", icon: "🌿" },
          { id: "v3-w1-a2", title: "Nature Walk", description: "Take a 20-minute walk, capturing 5 nature-Scripture connections", type: "exercise", duration: "30 min", icon: "🚶" },
          { id: "v3-w1-a3", title: "Sunrise Meditation", description: "Watch a sunrise and connect it to Malachi 4:2", type: "reflection", duration: "20 min", icon: "🌅" },
          { id: "v3-w1-a4", title: "Tree Study", description: "Study a tree and find 5 Scripture connections (Ps 1, John 15, etc.)", type: "exercise", duration: "15 min", icon: "🌳" },
          { id: "v3-w1-a5", title: "Creation Collage", description: "Create a mental collage of nature images tied to verses", type: "drill", duration: "15 min", icon: "🖼️" },
        ],
        milestone: "Can spontaneously connect nature scenes to Scripture",
      },
      {
        weekNumber: 2,
        title: "Personal Visual Journal",
        focus: "Your life as a picture book",
        scripture: "Personal application passages",
        activities: [
          { id: "v3-w2-a1", title: "Life Timeline", description: "Create a visual timeline of 5 key moments God worked in your life", type: "exercise", duration: "25 min", icon: "📊" },
          { id: "v3-w2-a2", title: "Scripture Overlay", description: "Attach a verse-image to each life event", type: "exercise", duration: "20 min", icon: "🏷️" },
          { id: "v3-w2-a3", title: "Current Challenge", description: "Picture a current struggle; what Bible scene matches it?", type: "reflection", duration: "15 min", icon: "🎯" },
          { id: "v3-w2-a4", title: "Victory Gallery", description: "Create a mental gallery of answered prayers with verse-images", type: "exercise", duration: "20 min", icon: "🏆" },
          { id: "v3-w2-a5", title: "Daily Snapshot", description: "Each day, capture one moment and link it to Scripture", type: "reflection", duration: "5 min daily", icon: "📷" },
        ],
        milestone: "Can see Scripture in daily life experiences",
      },
      {
        weekNumber: 3,
        title: "Verse Genetics Visual",
        focus: "Seeing how verses connect",
        scripture: "John 3:16 and its family",
        activities: [
          { id: "v3-w3-a1", title: "Learn: Verse Genetics", description: "How verses are related like family members", type: "reading", duration: "10 min", roomCode: "BF", icon: "🧬" },
          { id: "v3-w3-a2", title: "John 3:16 Family Tree", description: "Create a visual family tree of related verses", type: "exercise", duration: "25 min", icon: "🌲" },
          { id: "v3-w3-a3", title: "Sibling Verses", description: "Find and visualize 5 'sibling' verses to John 3:16", type: "drill", duration: "20 min", icon: "👯" },
          { id: "v3-w3-a4", title: "Distant Cousins", description: "Connect John 3:16 to unexpected OT passages visually", type: "exercise", duration: "15 min", icon: "🔗" },
          { id: "v3-w3-a5", title: "Family Portrait", description: "Create one unified image showing the verse family", type: "exercise", duration: "15 min", icon: "👨‍👩‍👧‍👦" },
        ],
        milestone: "Can trace visual connections between related verses",
      },
      {
        weekNumber: 4,
        title: "History & Culture Visual",
        focus: "Seeing Scripture in world events",
        scripture: "Daniel 7, Matthew 24",
        activities: [
          { id: "v3-w4-a1", title: "Historical Timeline", description: "Create a visual timeline: Daniel's prophecies to today", type: "exercise", duration: "30 min", icon: "📜" },
          { id: "v3-w4-a2", title: "Current Events", description: "Connect 3 current events to Bible prophecies visually", type: "exercise", duration: "20 min", icon: "📰" },
          { id: "v3-w4-a3", title: "Signs Gallery", description: "Create a mental gallery of end-time signs from Matthew 24", type: "exercise", duration: "20 min", icon: "🖼️" },
          { id: "v3-w4-a4", title: "Month Review", description: "Walk through all Month 3 visual connections", type: "drill", duration: "20 min", icon: "🔄" },
          { id: "v3-w4-a5", title: "Gate Preparation", description: "Prepare for Month 3 assessment", type: "reflection", duration: "15 min", icon: "🚪" },
        ],
        milestone: "Ready for Month 3 Gate Assessment",
      },
    ],
    gateAssessment: "Present 5 freestyle visual connections: 2 from nature, 1 personal, 1 verse-genetic, 1 historical.",
  },
  // Months 4-12: Continue pattern...
  ...generateVisualPathMonths(4, 12),
  // Year 2: Months 13-24
  ...generateVisualPathMonths(13, 24),
];

// ============================================
// ANALYTICAL PATH - All 24 Months
// ============================================
const analyticalPathCurriculum: MonthCurriculum[] = [
  {
    month: 1,
    title: "Detective Foundation",
    theme: "Building Your Investigation Skills",
    weeks: [
      {
        weekNumber: 1,
        title: "Observation Basics",
        focus: "Learning to see what others miss",
        scripture: "Luke 15:11-32 (Prodigal Son)",
        activities: [
          { id: "a1-w1-a1", title: "Learn: Observation Room", description: "The detective's notebook method", type: "reading", duration: "10 min", roomCode: "OR", link: "/palace/floor/2/room/observation", icon: "🔍" },
          { id: "a1-w1-a2", title: "Read Luke 15:11-32", description: "Read 3 times, noting every detail", type: "reading", duration: "20 min", link: "/bible/Luke/15", icon: "📖" },
          { id: "a1-w1-a3", title: "50 Observations", description: "List 50 observations from the Prodigal Son (no interpretation yet)", type: "exercise", duration: "30 min", roomCode: "OR", icon: "📝" },
          { id: "a1-w1-a4", title: "Pattern Hunt", description: "Find 5 patterns or repeated elements in the passage", type: "drill", duration: "15 min", icon: "🧩" },
          { id: "a1-w1-a5", title: "Daily Detail", description: "Pick one verse daily and list 10 observations", type: "reflection", duration: "10 min daily", icon: "📋" },
        ],
        milestone: "Can generate 50+ observations from any passage",
      },
      {
        weekNumber: 2,
        title: "Definitions & Context",
        focus: "Using the Def-Com Room for deeper study",
        scripture: "John 3:1-21",
        activities: [
          { id: "a1-w2-a1", title: "Learn: Def-Com Room", description: "Definitions and commentary research methods", type: "reading", duration: "10 min", roomCode: "DC", link: "/palace/floor/2/room/defcom", icon: "📚" },
          { id: "a1-w2-a2", title: "Word Study: 'Born Again'", description: "Research Greek behind 'born again' (gennao anothen)", type: "exercise", duration: "25 min", icon: "🔬" },
          { id: "a1-w2-a3", title: "Historical Context", description: "Research Nicodemus, Pharisees, and nighttime visits", type: "exercise", duration: "20 min", icon: "📜" },
          { id: "a1-w2-a4", title: "Cross-Reference Chain", description: "Build a chain from John 3:16 to 5 related verses", type: "drill", duration: "15 min", icon: "🔗" },
          { id: "a1-w2-a5", title: "Synthesis", description: "Write a 1-paragraph summary integrating all findings", type: "reflection", duration: "15 min", icon: "✍️" },
        ],
        milestone: "Can perform word studies and contextual research",
      },
      {
        weekNumber: 3,
        title: "Symbols & Types",
        focus: "Recognizing God's symbolic language",
        scripture: "Exodus 12 (Passover)",
        activities: [
          { id: "a1-w3-a1", title: "Learn: Symbols/Types Room", description: "Understanding biblical symbolism and typology", type: "reading", duration: "10 min", roomCode: "ST", link: "/palace/floor/2/room/symbols", icon: "🎭" },
          { id: "a1-w3-a2", title: "Read Exodus 12", description: "Identify every symbolic element in the Passover", type: "reading", duration: "20 min", link: "/bible/Exodus/12", icon: "📖" },
          { id: "a1-w3-a3", title: "Type Mapping", description: "Create a chart: Passover element → Christ fulfillment", type: "exercise", duration: "25 min", icon: "🗺️" },
          { id: "a1-w3-a4", title: "Symbol Dictionary", description: "Start a personal symbol reference list (lamb, blood, etc.)", type: "exercise", duration: "20 min", icon: "📓" },
          { id: "a1-w3-a5", title: "Type Hunt", description: "Find 3 more types of Christ in Exodus 1-15", type: "challenge", duration: "20 min", icon: "🎯" },
        ],
        milestone: "Can identify and explain biblical types and symbols",
      },
      {
        weekNumber: 4,
        title: "Questions & Chains",
        focus: "The art of asking the right questions",
        scripture: "Review month passages",
        activities: [
          { id: "a1-w4-a1", title: "Learn: Questions Room", description: "Intratextual, intertextual, and phototheological questions", type: "reading", duration: "10 min", roomCode: "QR", link: "/palace/floor/2/room/questions", icon: "❓" },
          { id: "a1-w4-a2", title: "75 Questions Challenge", description: "Generate 25 questions each: intra, inter, PT", type: "exercise", duration: "40 min", icon: "🧠" },
          { id: "a1-w4-a3", title: "Q&A Chains", description: "Use Scripture to answer Scripture - build 5 chains", type: "drill", duration: "20 min", roomCode: "QA", icon: "🔗" },
          { id: "a1-w4-a4", title: "Month Review", description: "Review all Month 1 detective findings", type: "drill", duration: "20 min", icon: "🔄" },
          { id: "a1-w4-a5", title: "Gate Preparation", description: "Prepare for Month 1 assessment", type: "reflection", duration: "15 min", icon: "🚪" },
        ],
        milestone: "Ready for Month 1 Gate Assessment",
      },
    ],
    gateAssessment: "Present a detailed analysis of one passage showing observations, definitions, symbols, and cross-references.",
  },
  {
    month: 2,
    title: "Pattern Recognition",
    theme: "Finding Structure in Scripture",
    weeks: [
      {
        weekNumber: 1,
        title: "Literary Structures",
        focus: "Identifying chiasms and parallelisms",
        scripture: "Genesis 1, Psalm 1",
        activities: [
          { id: "a2-w1-a1", title: "Learn: Literary Patterns", description: "Understanding chiastic and parallel structures", type: "reading", duration: "15 min", icon: "📐" },
          { id: "a2-w1-a2", title: "Map Genesis 1", description: "Chart the parallel days (1-4, 2-5, 3-6)", type: "exercise", duration: "25 min", icon: "📊" },
          { id: "a2-w1-a3", title: "Psalm 1 Chiasm", description: "Identify the A-B-B'-A' structure in Psalm 1", type: "exercise", duration: "20 min", icon: "🔄" },
          { id: "a2-w1-a4", title: "Structure Hunt", description: "Find 2 more chiastic passages in Psalms", type: "drill", duration: "20 min", icon: "🔍" },
          { id: "a2-w1-a5", title: "Daily Structure", description: "Identify one structural element daily", type: "reflection", duration: "10 min daily", icon: "🏗️" },
        ],
        milestone: "Can identify chiastic structures in Scripture",
      },
      {
        weekNumber: 2,
        title: "Number Patterns",
        focus: "Understanding biblical numerology",
        scripture: "Revelation survey",
        activities: [
          { id: "a2-w2-a1", title: "Biblical Numbers Guide", description: "Learn the significance of 3, 7, 12, 40, etc.", type: "reading", duration: "15 min", icon: "🔢" },
          { id: "a2-w2-a2", title: "Seven in Revelation", description: "List all sevens in Revelation with their meanings", type: "exercise", duration: "25 min", icon: "7️⃣" },
          { id: "a2-w2-a3", title: "40 Pattern", description: "Map all major '40' occurrences in Scripture", type: "exercise", duration: "20 min", icon: "4️⃣" },
          { id: "a2-w2-a4", title: "12 Tribes/Apostles", description: "Compare the 12 tribes to the 12 apostles", type: "drill", duration: "15 min", icon: "🔗" },
          { id: "a2-w2-a5", title: "Number Journal", description: "Track significant numbers in daily reading", type: "reflection", duration: "10 min daily", icon: "📓" },
        ],
        milestone: "Can explain significance of major biblical numbers",
      },
      {
        weekNumber: 3,
        title: "Prophetic Patterns",
        focus: "Repeat-and-enlarge method",
        scripture: "Daniel 2, 7, 8",
        activities: [
          { id: "a2-w3-a1", title: "Learn: Repeat-Enlarge", description: "How prophecy builds on itself", type: "reading", duration: "10 min", roomCode: "PR", icon: "📈" },
          { id: "a2-w3-a2", title: "Chart Daniel 2-7-8", description: "Create comparison chart of the three visions", type: "exercise", duration: "30 min", icon: "📊" },
          { id: "a2-w3-a3", title: "Parallel Analysis", description: "Map: Babylon → Medo-Persia → Greece → Rome across chapters", type: "exercise", duration: "25 min", icon: "🗺️" },
          { id: "a2-w3-a4", title: "New Details", description: "List what each chapter adds that previous didn't have", type: "drill", duration: "20 min", icon: "➕" },
          { id: "a2-w3-a5", title: "Stone/Son Connection", description: "Connect Daniel 2's stone to Daniel 7's Son of Man", type: "reflection", duration: "15 min", icon: "🪨" },
        ],
        milestone: "Can explain the repeat-and-enlarge prophetic method",
      },
      {
        weekNumber: 4,
        title: "Month 2 Integration",
        focus: "Combining pattern skills",
        scripture: "Review & Integration",
        activities: [
          { id: "a2-w4-a1", title: "Pattern Portfolio", description: "Compile all pattern discoveries from Month 2", type: "exercise", duration: "25 min", icon: "📁" },
          { id: "a2-w4-a2", title: "Cross-Pattern Links", description: "Connect literary, number, and prophetic patterns", type: "exercise", duration: "20 min", icon: "🔗" },
          { id: "a2-w4-a3", title: "New Passage Test", description: "Apply all pattern tools to a fresh passage", type: "challenge", duration: "25 min", icon: "🧪" },
          { id: "a2-w4-a4", title: "Month Review", description: "Review all Month 2 discoveries", type: "drill", duration: "15 min", icon: "🔄" },
          { id: "a2-w4-a5", title: "Gate Preparation", description: "Prepare for Month 2 assessment", type: "reflection", duration: "15 min", icon: "🚪" },
        ],
        milestone: "Ready for Month 2 Gate Assessment",
      },
    ],
    gateAssessment: "Present a multi-layered analysis showing literary structure, number patterns, and prophetic connections.",
  },
  {
    month: 3,
    title: "Christ-Centered Analysis",
    theme: "Finding Jesus in Every Text",
    weeks: [
      {
        weekNumber: 1,
        title: "The Concentration Room",
        focus: "Every text points to Christ",
        scripture: "Luke 24:13-35 (Emmaus Road)",
        activities: [
          { id: "a3-w1-a1", title: "Learn: Concentration Room", description: "How to find Christ in every passage", type: "reading", duration: "10 min", roomCode: "CR", link: "/palace/floor/4/room/concentration", icon: "🎯" },
          { id: "a3-w1-a2", title: "Emmaus Study", description: "Study how Jesus revealed Himself from Moses and Prophets", type: "exercise", duration: "25 min", link: "/bible/Luke/24", icon: "📖" },
          { id: "a3-w1-a3", title: "Genesis Christ-Hunt", description: "Find Christ in Genesis 1-3 (hints: Word, Light, Seed)", type: "exercise", duration: "20 min", icon: "🔍" },
          { id: "a3-w1-a4", title: "Psalms Christ-Hunt", description: "Identify Messianic themes in Psalms 2, 22, 110", type: "drill", duration: "20 min", icon: "🔍" },
          { id: "a3-w1-a5", title: "Daily Christ-Find", description: "Find one Christ-connection in daily reading", type: "reflection", duration: "10 min daily", icon: "✝️" },
        ],
        milestone: "Can find Christ-centered meaning in any OT passage",
      },
      {
        weekNumber: 2,
        title: "Five Dimensions",
        focus: "Multi-layered interpretation",
        scripture: "Exodus 12 revisited",
        activities: [
          { id: "a3-w2-a1", title: "Learn: Dimensions Room", description: "Literal, Christ, Personal, Church, Eternal dimensions", type: "reading", duration: "10 min", roomCode: "DR", link: "/palace/floor/4/room/dimensions", icon: "📐" },
          { id: "a3-w2-a2", title: "Exodus 12: All 5 Dimensions", description: "Apply all 5 dimensions to Passover", type: "exercise", duration: "30 min", icon: "🔬" },
          { id: "a3-w2-a3", title: "Psalm 23: 5 Dimensions", description: "Apply the 5 dimensions to Psalm 23", type: "exercise", duration: "25 min", icon: "📊" },
          { id: "a3-w2-a4", title: "Dimension Drill", description: "Quick 5-dimension analysis of 3 short passages", type: "drill", duration: "20 min", icon: "⚡" },
          { id: "a3-w2-a5", title: "Personal Application", description: "Focus on the 'Me' dimension in today's reading", type: "reflection", duration: "15 min", icon: "👤" },
        ],
        milestone: "Can apply 5-dimension analysis to any passage",
      },
      {
        weekNumber: 3,
        title: "Genre Analysis",
        focus: "Reading each genre correctly",
        scripture: "Multi-genre survey",
        activities: [
          { id: "a3-w3-a1", title: "Learn: Connect 6 Room", description: "The 6 major genres and their rules", type: "reading", duration: "15 min", roomCode: "C6", link: "/palace/floor/4/room/connect6", icon: "📚" },
          { id: "a3-w3-a2", title: "Poetry Analysis", description: "Analyze Psalm 139 using poetry rules", type: "exercise", duration: "20 min", icon: "📝" },
          { id: "a3-w3-a3", title: "Prophecy Analysis", description: "Analyze Isaiah 53 using prophecy rules", type: "exercise", duration: "20 min", icon: "🔮" },
          { id: "a3-w3-a4", title: "Parable Analysis", description: "Analyze Matthew 13 parables using parable rules", type: "exercise", duration: "20 min", icon: "🌾" },
          { id: "a3-w3-a5", title: "Genre Comparison", description: "Same topic (salvation) in 3 different genres", type: "drill", duration: "20 min", icon: "🔄" },
        ],
        milestone: "Can identify and properly interpret all 6 genres",
      },
      {
        weekNumber: 4,
        title: "Month 3 Integration",
        focus: "Full analytical toolkit",
        scripture: "Isaiah 53 deep dive",
        activities: [
          { id: "a3-w4-a1", title: "Complete Analysis", description: "Apply all tools to Isaiah 53: observations, patterns, Christ, dimensions, genre", type: "exercise", duration: "40 min", icon: "🔬" },
          { id: "a3-w4-a2", title: "Toolkit Review", description: "Review all analytical tools from Months 1-3", type: "drill", duration: "20 min", icon: "🧰" },
          { id: "a3-w4-a3", title: "Fresh Passage Test", description: "Apply full analysis to an unfamiliar passage", type: "challenge", duration: "25 min", icon: "🧪" },
          { id: "a3-w4-a4", title: "Gem Collection", description: "Record 10 best analytical gems from Month 3", type: "exercise", duration: "15 min", roomCode: "GR", icon: "💎" },
          { id: "a3-w4-a5", title: "Gate Preparation", description: "Prepare for Month 3 assessment", type: "reflection", duration: "15 min", icon: "🚪" },
        ],
        milestone: "Ready for Month 3 Gate Assessment",
      },
    ],
    gateAssessment: "Present a complete analysis of Isaiah 53 showing all dimensions, Christ-focus, patterns, and practical application.",
  },
  ...generateAnalyticalPathMonths(4, 12),
  ...generateAnalyticalPathMonths(13, 24),
];

// ============================================
// DEVOTIONAL PATH - All 24 Months
// ============================================
const devotionalPathCurriculum: MonthCurriculum[] = [
  {
    month: 1,
    title: "The Listening Heart",
    theme: "Learning to Hear God's Voice",
    weeks: [
      {
        weekNumber: 1,
        title: "Sacred Reading",
        focus: "Introduction to Lectio Divina",
        scripture: "Psalm 1",
        activities: [
          { id: "d1-w1-a1", title: "Learn: Lectio Divina", description: "The four movements: Read, Reflect, Respond, Rest", type: "reading", duration: "15 min", icon: "📚" },
          { id: "d1-w1-a2", title: "Lectio: Psalm 1", description: "Practice all 4 movements with Psalm 1", type: "exercise", duration: "30 min", icon: "🙏" },
          { id: "d1-w1-a3", title: "Journal Entry", description: "Write what God spoke to you through Psalm 1", type: "reflection", duration: "15 min", icon: "📓" },
          { id: "d1-w1-a4", title: "Daily Lectio", description: "Practice Lectio Divina with one verse each day", type: "reflection", duration: "15 min daily", icon: "🌅" },
          { id: "d1-w1-a5", title: "Share & Pray", description: "Share your insight with someone and pray together", type: "exercise", duration: "15 min", icon: "💬" },
        ],
        milestone: "Can practice Lectio Divina independently",
      },
      {
        weekNumber: 2,
        title: "Heart Questions",
        focus: "Personal application of Scripture",
        scripture: "James 1:19-27",
        activities: [
          { id: "d1-w2-a1", title: "Read James 1:19-27", description: "Read slowly, pausing to listen for God's voice", type: "reading", duration: "20 min", link: "/bible/James/1", icon: "📖" },
          { id: "d1-w2-a2", title: "Heart Questions", description: "Ask: What does this mean for ME today?", type: "reflection", duration: "20 min", icon: "❤️" },
          { id: "d1-w2-a3", title: "Mirror Exercise", description: "Reflect on being a doer vs. hearer of the Word", type: "exercise", duration: "15 min", icon: "🪞" },
          { id: "d1-w2-a4", title: "Action Step", description: "Choose ONE way to be a doer this week", type: "exercise", duration: "10 min", icon: "👣" },
          { id: "d1-w2-a5", title: "Evening Review", description: "Each night, review: Did I do what I heard?", type: "reflection", duration: "5 min daily", icon: "🌙" },
        ],
        milestone: "Can identify personal applications from any passage",
      },
      {
        weekNumber: 3,
        title: "Prayer & Scripture",
        focus: "Praying the Bible back to God",
        scripture: "Philippians 1:3-11",
        activities: [
          { id: "d1-w3-a1", title: "Read Philippians 1:3-11", description: "Notice Paul's prayer structure", type: "reading", duration: "15 min", link: "/bible/Philippians/1", icon: "📖" },
          { id: "d1-w3-a2", title: "Pray Paul's Prayer", description: "Personalize Paul's prayer for yourself", type: "exercise", duration: "20 min", icon: "🙏" },
          { id: "d1-w3-a3", title: "Prayer Journal", description: "Write out your Scripture-based prayers", type: "reflection", duration: "20 min", icon: "📓" },
          { id: "d1-w3-a4", title: "Intercessory Praying", description: "Pray this passage for 3 people by name", type: "exercise", duration: "15 min", icon: "🤝" },
          { id: "d1-w3-a5", title: "Daily Scripture Prayer", description: "Turn one verse into prayer each day", type: "reflection", duration: "10 min daily", icon: "⛪" },
        ],
        milestone: "Can transform any Scripture into prayer",
      },
      {
        weekNumber: 4,
        title: "The Fire Room",
        focus: "When Scripture moves your heart",
        scripture: "Isaiah 53",
        activities: [
          { id: "d1-w4-a1", title: "Read Isaiah 53", description: "Read slowly, letting each verse sink in", type: "reading", duration: "20 min", link: "/bible/Isaiah/53", icon: "📖" },
          { id: "d1-w4-a2", title: "Fire Room Experience", description: "Which verse pierces your heart? Stay there.", type: "exercise", duration: "30 min", roomCode: "FRm", link: "/palace/floor/7/room/fire", icon: "🔥" },
          { id: "d1-w4-a3", title: "Response Writing", description: "Write your response to the Suffering Servant", type: "reflection", duration: "20 min", icon: "✍️" },
          { id: "d1-w4-a4", title: "Month Review", description: "Review your journal entries from Month 1", type: "reflection", duration: "15 min", icon: "🔄" },
          { id: "d1-w4-a5", title: "Gate Preparation", description: "Prepare to share your devotional journey", type: "reflection", duration: "15 min", icon: "🚪" },
        ],
        milestone: "Ready for Month 1 Gate Assessment",
      },
    ],
    gateAssessment: "Share one Scripture passage that God used to speak to you this month and what action you took in response.",
  },
  {
    month: 2,
    title: "Meditation & Memorization",
    theme: "Hiding God's Word in Your Heart",
    weeks: [
      {
        weekNumber: 1,
        title: "Deep Meditation",
        focus: "Marinating in Scripture",
        scripture: "Psalm 119:9-16",
        activities: [
          { id: "d2-w1-a1", title: "Learn: Meditation Room", description: "Biblical meditation vs. empty meditation", type: "reading", duration: "10 min", roomCode: "MR", link: "/palace/floor/7/room/meditation", icon: "🧘" },
          { id: "d2-w1-a2", title: "Psalm 119:9-16 Meditation", description: "Spend 20 minutes on just these 8 verses", type: "exercise", duration: "25 min", icon: "📖" },
          { id: "d2-w1-a3", title: "Word-by-Word", description: "Take v.11 word by word: 'Thy...word...have I...'", type: "exercise", duration: "20 min", icon: "🔤" },
          { id: "d2-w1-a4", title: "Memorize Psalm 119:11", description: "Commit this verse to memory through meditation", type: "drill", duration: "15 min", icon: "🧠" },
          { id: "d2-w1-a5", title: "Daily Meditation", description: "10 minutes of slow, prayerful meditation daily", type: "reflection", duration: "10 min daily", icon: "🌅" },
        ],
        milestone: "Can spend 20+ minutes meditating on a single passage",
      },
      {
        weekNumber: 2,
        title: "Scripture Memory",
        focus: "Building your heart-treasure",
        scripture: "Psalm 23",
        activities: [
          { id: "d2-w2-a1", title: "Memorize Psalm 23", description: "Commit all 6 verses to memory this week", type: "drill", duration: "15 min daily", icon: "📜" },
          { id: "d2-w2-a2", title: "Phrase Meditation", description: "Meditate on 'The Lord is my shepherd' for 15 minutes", type: "exercise", duration: "15 min", icon: "🐑" },
          { id: "d2-w2-a3", title: "Personal Rewrite", description: "Write Psalm 23 in your own words from memory", type: "exercise", duration: "20 min", icon: "✍️" },
          { id: "d2-w2-a4", title: "Recite in Prayer", description: "Recite Psalm 23 as a prayer to God", type: "reflection", duration: "10 min", icon: "🙏" },
          { id: "d2-w2-a5", title: "Share with Someone", description: "Recite Psalm 23 to a friend or family member", type: "exercise", duration: "10 min", icon: "💬" },
        ],
        milestone: "Have Psalm 23 memorized and personally applied",
      },
      {
        weekNumber: 3,
        title: "Journaling Practice",
        focus: "Writing your way to understanding",
        scripture: "Various (journal prompts)",
        activities: [
          { id: "d2-w3-a1", title: "Gratitude Journal", description: "List 10 things from Scripture you're grateful for", type: "reflection", duration: "15 min", icon: "🙏" },
          { id: "d2-w3-a2", title: "Confession Journal", description: "Write prayers of confession based on Psalm 51", type: "reflection", duration: "20 min", icon: "💔" },
          { id: "d2-w3-a3", title: "Promise Journal", description: "Collect and personalize 5 Bible promises", type: "exercise", duration: "20 min", icon: "🌈" },
          { id: "d2-w3-a4", title: "Question Journal", description: "Write 10 questions you want to ask God", type: "reflection", duration: "15 min", icon: "❓" },
          { id: "d2-w3-a5", title: "Daily Entry", description: "Write one journal entry from each day's reading", type: "reflection", duration: "10 min daily", icon: "📓" },
        ],
        milestone: "Have established a regular journaling practice",
      },
      {
        weekNumber: 4,
        title: "Month 2 Integration",
        focus: "Combining meditation, memory, and journaling",
        scripture: "Romans 8:28-39",
        activities: [
          { id: "d2-w4-a1", title: "Full Practice", description: "Meditate, memorize, and journal on Romans 8:28-39", type: "exercise", duration: "40 min", icon: "📖" },
          { id: "d2-w4-a2", title: "Memory Review", description: "Review all memorized Scripture from Months 1-2", type: "drill", duration: "15 min", icon: "🔄" },
          { id: "d2-w4-a3", title: "Journal Review", description: "Read through your Month 2 journal entries", type: "reflection", duration: "15 min", icon: "📓" },
          { id: "d2-w4-a4", title: "Share Journey", description: "Share your devotional growth with someone", type: "exercise", duration: "15 min", icon: "💬" },
          { id: "d2-w4-a5", title: "Gate Preparation", description: "Prepare for Month 2 assessment", type: "reflection", duration: "15 min", icon: "🚪" },
        ],
        milestone: "Ready for Month 2 Gate Assessment",
      },
    ],
    gateAssessment: "Recite memorized Scripture and share journal insights showing spiritual growth from meditation practice.",
  },
  {
    month: 3,
    title: "Community & Accountability",
    theme: "Growing Together in the Word",
    weeks: [
      {
        weekNumber: 1,
        title: "Studying with Others",
        focus: "The blessing of community study",
        scripture: "Acts 2:42-47",
        activities: [
          { id: "d3-w1-a1", title: "Read Acts 2:42-47", description: "Notice the role of teaching and fellowship", type: "reading", duration: "15 min", link: "/bible/Acts/2", icon: "📖" },
          { id: "d3-w1-a2", title: "Find a Partner", description: "Identify someone to study Scripture with weekly", type: "exercise", duration: "20 min", icon: "🤝" },
          { id: "d3-w1-a3", title: "Group Discussion", description: "Lead or join a small group Bible discussion", type: "exercise", duration: "45 min", icon: "👥" },
          { id: "d3-w1-a4", title: "Share Insights", description: "Share 3 insights from your devotions with others", type: "exercise", duration: "15 min", icon: "💬" },
          { id: "d3-w1-a5", title: "Pray Together", description: "Pray with your study partner this week", type: "reflection", duration: "15 min", icon: "🙏" },
        ],
        milestone: "Have established an accountability relationship",
      },
      {
        weekNumber: 2,
        title: "Teaching Others",
        focus: "Sharing what you've learned",
        scripture: "2 Timothy 2:1-2",
        activities: [
          { id: "d3-w2-a1", title: "Read 2 Timothy 2:1-2", description: "Understand the multiplication principle", type: "reading", duration: "10 min", link: "/bible/2Timothy/2", icon: "📖" },
          { id: "d3-w2-a2", title: "Prepare a Lesson", description: "Prepare a 10-minute devotional to share", type: "exercise", duration: "30 min", icon: "📝" },
          { id: "d3-w2-a3", title: "Teach Someone", description: "Share your devotional with one person", type: "exercise", duration: "20 min", icon: "🗣️" },
          { id: "d3-w2-a4", title: "Get Feedback", description: "Ask for feedback on your teaching", type: "reflection", duration: "10 min", icon: "💭" },
          { id: "d3-w2-a5", title: "Improve & Repeat", description: "Revise and share with another person", type: "exercise", duration: "20 min", icon: "🔄" },
        ],
        milestone: "Have taught a devotional to at least 2 people",
      },
      {
        weekNumber: 3,
        title: "Serving with Scripture",
        focus: "Using God's Word to minister",
        scripture: "2 Corinthians 1:3-7",
        activities: [
          { id: "d3-w3-a1", title: "Read 2 Corinthians 1:3-7", description: "Understand comfort that flows to others", type: "reading", duration: "15 min", link: "/bible/2Corinthians/1", icon: "📖" },
          { id: "d3-w3-a2", title: "Comfort Verses", description: "Collect 10 verses for comforting others", type: "exercise", duration: "20 min", icon: "💝" },
          { id: "d3-w3-a3", title: "Write Encouragement", description: "Write 3 Scripture-based encouragement notes", type: "exercise", duration: "25 min", icon: "✉️" },
          { id: "d3-w3-a4", title: "Visit & Share", description: "Visit someone in need and share Scripture", type: "exercise", duration: "30 min", icon: "🏥" },
          { id: "d3-w3-a5", title: "Reflect", description: "Journal about serving others with the Word", type: "reflection", duration: "15 min", icon: "📓" },
        ],
        milestone: "Have ministered to others using Scripture",
      },
      {
        weekNumber: 4,
        title: "Month 3 Integration",
        focus: "Living devotionally in community",
        scripture: "Hebrews 10:19-25",
        activities: [
          { id: "d3-w4-a1", title: "Read Hebrews 10:19-25", description: "Meditate on 'not forsaking the assembling'", type: "reading", duration: "15 min", link: "/bible/Hebrews/10", icon: "📖" },
          { id: "d3-w4-a2", title: "Quarter Review", description: "Review your devotional journey (Months 1-3)", type: "reflection", duration: "25 min", icon: "🔄" },
          { id: "d3-w4-a3", title: "Testimony Prep", description: "Prepare a 3-minute testimony of growth", type: "exercise", duration: "20 min", icon: "📝" },
          { id: "d3-w4-a4", title: "Share Testimony", description: "Share your testimony with your study group", type: "exercise", duration: "15 min", icon: "💬" },
          { id: "d3-w4-a5", title: "Gate Preparation", description: "Prepare for Month 3 assessment", type: "reflection", duration: "15 min", icon: "🚪" },
        ],
        milestone: "Ready for Month 3 Gate Assessment",
      },
    ],
    gateAssessment: "Share testimony of spiritual growth, demonstrate teaching ability, and show evidence of ministering to others with Scripture.",
  },
  ...generateDevotionalPathMonths(4, 12),
  ...generateDevotionalPathMonths(13, 24),
];

// ============================================
// WARRIOR PATH - All 24 Months
// ============================================
const warriorPathCurriculum: MonthCurriculum[] = [
  {
    month: 1,
    title: "Boot Camp",
    theme: "Building Your Scripture Arsenal",
    weeks: [
      {
        weekNumber: 1,
        title: "Speed Foundations",
        focus: "Rapid recall basics",
        scripture: "Ephesians 6:10-18 (Armor of God)",
        activities: [
          { id: "w1-w1-a1", title: "Learn: Speed Room", description: "Rapid-fire study techniques for warriors", type: "reading", duration: "10 min", roomCode: "SRm", link: "/palace/floor/7/room/speed", icon: "⚡" },
          { id: "w1-w1-a2", title: "Memorize Ephesians 6:10-18", description: "Goal: Recite in under 90 seconds by week end", type: "drill", duration: "20 min daily", icon: "⚔️" },
          { id: "w1-w1-a3", title: "Speed Drill: Armor", description: "Name all 6 armor pieces in under 10 seconds", type: "drill", duration: "10 min", icon: "🛡️" },
          { id: "w1-w1-a4", title: "Verse Sprint", description: "How many armor verses can you quote in 2 minutes?", type: "challenge", duration: "15 min", icon: "🏃" },
          { id: "w1-w1-a5", title: "Battle Partner", description: "Find someone to quiz you daily", type: "exercise", duration: "10 min", icon: "🤺" },
        ],
        milestone: "Can recite Ephesians 6:10-18 in under 90 seconds",
      },
      {
        weekNumber: 2,
        title: "Scripture Sword",
        focus: "The Word as offensive weapon",
        scripture: "Matthew 4:1-11 (Temptation of Jesus)",
        activities: [
          { id: "w1-w2-a1", title: "Read Matthew 4:1-11", description: "Study how Jesus used Scripture as a weapon", type: "reading", duration: "15 min", link: "/bible/Matthew/4", icon: "📖" },
          { id: "w1-w2-a2", title: "Memorize Jesus' Replies", description: "Learn all 3 of Jesus' Scripture responses", type: "drill", duration: "20 min", icon: "⚔️" },
          { id: "w1-w2-a3", title: "Scenario Training", description: "Practice using verses against common temptations", type: "exercise", duration: "20 min", icon: "🎯" },
          { id: "w1-w2-a4", title: "Timed Retrieval", description: "Can you recall the right verse in 5 seconds?", type: "challenge", duration: "15 min", icon: "⏱️" },
          { id: "w1-w2-a5", title: "Daily Combat", description: "Counter each temptation today with Scripture", type: "reflection", duration: "5 min daily", icon: "💪" },
        ],
        milestone: "Can instantly counter temptations with Scripture",
      },
      {
        weekNumber: 3,
        title: "Battle Drills",
        focus: "Intensive practice sessions",
        scripture: "Romans 8:28-39",
        activities: [
          { id: "w1-w3-a1", title: "Memorize Romans 8:28-39", description: "The victory passage - own it completely!", type: "drill", duration: "25 min daily", icon: "📜" },
          { id: "w1-w3-a2", title: "Speed Test", description: "Full passage recitation - time yourself", type: "challenge", duration: "15 min", icon: "⏱️" },
          { id: "w1-w3-a3", title: "Verse ID Drill", description: "Someone reads a phrase, you complete it", type: "drill", duration: "20 min", icon: "🎯" },
          { id: "w1-w3-a4", title: "Scripture Battle", description: "Challenge someone to a memory duel", type: "challenge", duration: "20 min", icon: "⚔️" },
          { id: "w1-w3-a5", title: "Personal Record", description: "Beat yesterday's time - track progress", type: "drill", duration: "15 min", icon: "🏆" },
        ],
        milestone: "Can recite Romans 8:28-39 with 95% accuracy under pressure",
      },
      {
        weekNumber: 4,
        title: "Combat Ready",
        focus: "Month 1 culmination",
        scripture: "Review all month passages",
        activities: [
          { id: "w1-w4-a1", title: "Full Arsenal Review", description: "All month's verses in one session", type: "drill", duration: "30 min", icon: "🔄" },
          { id: "w1-w4-a2", title: "Random Recall", description: "Random verse prompts - instant response required", type: "challenge", duration: "20 min", icon: "🎲" },
          { id: "w1-w4-a3", title: "Pressure Test", description: "Recite under distraction or time pressure", type: "challenge", duration: "15 min", icon: "💨" },
          { id: "w1-w4-a4", title: "Teach & Test", description: "Teach your verses to someone else", type: "exercise", duration: "20 min", icon: "🗣️" },
          { id: "w1-w4-a5", title: "Gate Battle", description: "Prepare for combat assessment", type: "drill", duration: "20 min", icon: "🚪" },
        ],
        milestone: "Ready for Month 1 Gate Assessment",
      },
    ],
    gateAssessment: "Recite all passages (Eph 6:10-18, Matt 4 replies, Rom 8:28-39) with 95% accuracy under time pressure.",
  },
  {
    month: 2,
    title: "Defensive Warfare",
    theme: "Standing Firm Against Attack",
    weeks: [
      {
        weekNumber: 1,
        title: "Shield of Faith",
        focus: "Defending against doubt",
        scripture: "Hebrews 11:1-12",
        activities: [
          { id: "w2-w1-a1", title: "Memorize Hebrews 11:1-6", description: "The faith definition and hall of fame intro", type: "drill", duration: "20 min daily", icon: "🛡️" },
          { id: "w2-w1-a2", title: "Faith Heroes Drill", description: "Quick-fire: Name the faith hero and their act", type: "drill", duration: "15 min", icon: "⚡" },
          { id: "w2-w1-a3", title: "Doubt Combat", description: "Match doubts to faith verses - speed drill", type: "challenge", duration: "20 min", icon: "⚔️" },
          { id: "w2-w1-a4", title: "Personal Faith Arsenal", description: "Build your personal faith defense verses", type: "exercise", duration: "20 min", icon: "🏰" },
          { id: "w2-w1-a5", title: "Daily Shield", description: "Use one faith verse to combat doubt each day", type: "reflection", duration: "5 min daily", icon: "🛡️" },
        ],
        milestone: "Have 10+ faith verses ready for instant deployment",
      },
      {
        weekNumber: 2,
        title: "Truth Belt",
        focus: "Standing on absolute truth",
        scripture: "John 17:17, Psalm 119:160, John 8:31-32",
        activities: [
          { id: "w2-w2-a1", title: "Memorize Truth Verses", description: "5 key verses about God's truth", type: "drill", duration: "20 min daily", icon: "📜" },
          { id: "w2-w2-a2", title: "Lie Detection Drill", description: "Identify lies and counter with truth verses", type: "drill", duration: "20 min", icon: "🎯" },
          { id: "w2-w2-a3", title: "Speed Truth", description: "Quick-fire truth verse responses to common lies", type: "challenge", duration: "15 min", icon: "⚡" },
          { id: "w2-w2-a4", title: "Apologetics Sprint", description: "Timed defense of 5 Christian truths", type: "challenge", duration: "25 min", icon: "🏃" },
          { id: "w2-w2-a5", title: "Daily Truth", description: "Counter one cultural lie with Scripture", type: "reflection", duration: "10 min daily", icon: "✓" },
        ],
        milestone: "Can instantly counter lies with truth verses",
      },
      {
        weekNumber: 3,
        title: "Salvation Shoes",
        focus: "Gospel readiness",
        scripture: "Romans 10:9-17, 1 Peter 3:15",
        activities: [
          { id: "w2-w3-a1", title: "Gospel Memorization", description: "Memorize the Romans Road to salvation", type: "drill", duration: "25 min daily", icon: "📜" },
          { id: "w2-w3-a2", title: "60-Second Gospel", description: "Share the gospel clearly in 60 seconds", type: "challenge", duration: "20 min", icon: "⏱️" },
          { id: "w2-w3-a3", title: "Objection Drill", description: "Quick responses to common objections", type: "drill", duration: "20 min", icon: "🛡️" },
          { id: "w2-w3-a4", title: "Testimony Sprint", description: "Share your testimony in under 2 minutes", type: "challenge", duration: "15 min", icon: "🗣️" },
          { id: "w2-w3-a5", title: "Ready Every Day", description: "Practice gospel readiness in daily encounters", type: "reflection", duration: "10 min daily", icon: "👟" },
        ],
        milestone: "Can share the gospel clearly under time pressure",
      },
      {
        weekNumber: 4,
        title: "Defensive Integration",
        focus: "Full defensive armor",
        scripture: "Review & Integration",
        activities: [
          { id: "w2-w4-a1", title: "Full Armor Drill", description: "All defensive verses in rapid sequence", type: "drill", duration: "30 min", icon: "🛡️" },
          { id: "w2-w4-a2", title: "Scenario Combat", description: "Respond to random attack scenarios", type: "challenge", duration: "25 min", icon: "⚔️" },
          { id: "w2-w4-a3", title: "Team Battle", description: "Partner drill - attack and defend", type: "challenge", duration: "20 min", icon: "👥" },
          { id: "w2-w4-a4", title: "Month Review", description: "Review all Month 2 memory verses", type: "drill", duration: "20 min", icon: "🔄" },
          { id: "w2-w4-a5", title: "Gate Preparation", description: "Prepare for Month 2 assessment", type: "reflection", duration: "15 min", icon: "🚪" },
        ],
        milestone: "Ready for Month 2 Gate Assessment",
      },
    ],
    gateAssessment: "Demonstrate defensive arsenal: counter attacks on faith, truth, and gospel with instant Scripture responses.",
  },
  {
    month: 3,
    title: "Offensive Warfare",
    theme: "Taking Territory for the Kingdom",
    weeks: [
      {
        weekNumber: 1,
        title: "Great Commission Attack",
        focus: "Advancing the Kingdom",
        scripture: "Matthew 28:18-20, Acts 1:8",
        activities: [
          { id: "w3-w1-a1", title: "Memorize Commission", description: "Matthew 28:18-20 and Acts 1:8 word-perfect", type: "drill", duration: "20 min daily", icon: "📜" },
          { id: "w3-w1-a2", title: "Authority Drill", description: "Quick-fire verses on Christ's authority", type: "drill", duration: "15 min", icon: "👑" },
          { id: "w3-w1-a3", title: "Mission Strategy", description: "Develop your personal mission verse arsenal", type: "exercise", duration: "20 min", icon: "🗺️" },
          { id: "w3-w1-a4", title: "Outreach Sprint", description: "Practice quick gospel encounters", type: "challenge", duration: "20 min", icon: "🏃" },
          { id: "w3-w1-a5", title: "Daily Advance", description: "One intentional kingdom advance each day", type: "reflection", duration: "10 min daily", icon: "⚔️" },
        ],
        milestone: "Can articulate the Great Commission and personal role instantly",
      },
      {
        weekNumber: 2,
        title: "Spiritual Weapons",
        focus: "Prayer and proclamation",
        scripture: "2 Corinthians 10:3-5, James 5:16",
        activities: [
          { id: "w3-w2-a1", title: "Memorize Warfare Verses", description: "Key spiritual warfare passages", type: "drill", duration: "20 min daily", icon: "⚔️" },
          { id: "w3-w2-a2", title: "Prayer Combat", description: "Timed warfare prayer sessions", type: "challenge", duration: "20 min", icon: "🙏" },
          { id: "w3-w2-a3", title: "Stronghold Demolition", description: "Identify and pray against specific strongholds", type: "exercise", duration: "25 min", icon: "🏰" },
          { id: "w3-w2-a4", title: "Proclamation Drill", description: "Speak Scripture declarations with authority", type: "drill", duration: "15 min", icon: "📢" },
          { id: "w3-w2-a5", title: "Daily Warfare", description: "Engage in spiritual combat each day", type: "reflection", duration: "15 min daily", icon: "⚔️" },
        ],
        milestone: "Can engage in focused spiritual warfare with Scripture",
      },
      {
        weekNumber: 3,
        title: "Endurance Training",
        focus: "Fighting the long battle",
        scripture: "Hebrews 12:1-3, 2 Timothy 4:7-8",
        activities: [
          { id: "w3-w3-a1", title: "Memorize Endurance Verses", description: "Key verses for staying in the fight", type: "drill", duration: "20 min daily", icon: "📜" },
          { id: "w3-w3-a2", title: "Marathon Drill", description: "Extended memory recall session (30+ min)", type: "challenge", duration: "35 min", icon: "🏃" },
          { id: "w3-w3-a3", title: "Fatigue Test", description: "Recite verses accurately when tired", type: "challenge", duration: "20 min", icon: "😓" },
          { id: "w3-w3-a4", title: "Encourage Others", description: "Share endurance verses with struggling warriors", type: "exercise", duration: "15 min", icon: "💪" },
          { id: "w3-w3-a5", title: "Daily Perseverance", description: "Use endurance verses during daily challenges", type: "reflection", duration: "10 min daily", icon: "🎖️" },
        ],
        milestone: "Can maintain Scripture combat effectiveness under fatigue",
      },
      {
        weekNumber: 4,
        title: "Combat Integration",
        focus: "Full warrior deployment",
        scripture: "Review & Assessment",
        activities: [
          { id: "w3-w4-a1", title: "Full Arsenal Review", description: "All 3 months of memory verses", type: "drill", duration: "40 min", icon: "🔄" },
          { id: "w3-w4-a2", title: "Battle Simulation", description: "Complete spiritual battle scenario", type: "challenge", duration: "30 min", icon: "⚔️" },
          { id: "w3-w4-a3", title: "Tournament Prep", description: "Prepare for competitive Scripture challenges", type: "drill", duration: "25 min", icon: "🏆" },
          { id: "w3-w4-a4", title: "War Story", description: "Share a testimony of Scripture victory", type: "exercise", duration: "15 min", icon: "📖" },
          { id: "w3-w4-a5", title: "Gate Battle", description: "Prepare for Month 3 combat assessment", type: "reflection", duration: "15 min", icon: "🚪" },
        ],
        milestone: "Ready for Month 3 Gate Assessment",
      },
    ],
    gateAssessment: "Complete battle simulation: defend against attacks, launch offensive with gospel, demonstrate endurance under pressure.",
  },
  ...generateWarriorPathMonths(4, 12),
  ...generateWarriorPathMonths(13, 24),
];

// ============================================
// HELPER FUNCTIONS TO GENERATE REMAINING MONTHS
// ============================================

function generateVisualPathMonths(startMonth: number, endMonth: number): MonthCurriculum[] {
  const themes = [
    { title: "Advanced Memory Techniques", theme: "Expanding Your Palace", focus: ["Method of Loci Advanced", "Peg Systems", "Link Systems", "Review Mastery"] },
    { title: "Prophetic Visualization", theme: "Seeing the Future", focus: ["Daniel Visualized", "Revelation Images", "Sanctuary Blueprint", "End-Time Gallery"] },
    { title: "Gospel Story Gallery", theme: "Walking with Jesus", focus: ["Birth Narratives", "Ministry Miracles", "Parables Pictured", "Passion Week"] },
    { title: "Epistles Illustrated", theme: "Letters Come Alive", focus: ["Romans Road Map", "Corinthian Canvas", "Galatian Freedom", "Prison Epistles"] },
    { title: "Old Testament Epic", theme: "Grand Visual Narrative", focus: ["Patriarchs Gallery", "Exodus Epic", "Kingdom Chronicles", "Prophets Portraits"] },
    { title: "Integration & Mastery", theme: "Visual Bible Complete", focus: ["Testament Bridge", "Prophecy Fulfilled", "Christ Everywhere", "Final Gallery"] },
    // Year 2
    { title: "Teaching Through Images", theme: "Visual Communication", focus: ["Presentation Design", "Story Boarding", "Visual Aids", "Audience Engagement"] },
    { title: "Digital Memory Tools", theme: "Technology Integration", focus: ["Digital Palaces", "Image Creation", "Video Memory", "App Utilization"] },
    { title: "Cross-Cultural Visualization", theme: "Global Perspectives", focus: ["Eastern Art", "African Imagery", "Latin Expression", "Indigenous Views"] },
    { title: "Art History & Scripture", theme: "Masters' Perspectives", focus: ["Renaissance Masters", "Reformation Art", "Modern Expression", "Personal Creation"] },
    { title: "Advanced Synthesis", theme: "Complete Integration", focus: ["Multi-Book Murals", "Timeline Tapestry", "Theme Galleries", "Personal Masterpiece"] },
    { title: "Visual Path Mastery", theme: "Path Completion", focus: ["Final Review", "Capstone Project", "Certification Prep", "Legacy Creation"] },
  ];

  const months: MonthCurriculum[] = [];
  for (let m = startMonth; m <= endMonth; m++) {
    const themeIndex = (m - 4) % themes.length;
    const theme = themes[themeIndex] || themes[0];
    
    months.push({
      month: m,
      title: theme.title,
      theme: theme.theme,
      weeks: theme.focus.map((f, i) => ({
        weekNumber: i + 1,
        title: f,
        focus: `Month ${m}, Week ${i + 1} focus on ${f}`,
        scripture: getScriptureForMonth(m, i + 1, "visual"),
        activities: generateActivities(`v${m}-w${i + 1}`, f, "visual"),
        milestone: `Complete ${f} module`,
      })),
      gateAssessment: `Demonstrate Month ${m} visual mastery through comprehensive visualization project.`,
    });
  }
  return months;
}

function generateAnalyticalPathMonths(startMonth: number, endMonth: number): MonthCurriculum[] {
  const themes = [
    { title: "Advanced Hermeneutics", theme: "Deeper Interpretation", focus: ["Context Analysis", "Genre Mastery", "Cultural Background", "Synthesis Methods"] },
    { title: "Prophetic Analysis", theme: "Understanding Prophecy", focus: ["Daniel Deep Dive", "Revelation Structure", "Prophetic Patterns", "Timeline Analysis"] },
    { title: "Gospel Harmony", theme: "Synoptic Study", focus: ["Parallel Passages", "Unique Perspectives", "Chronology", "Integration"] },
    { title: "Epistolary Analysis", theme: "Letter Logic", focus: ["Pauline Theology", "General Epistles", "Argument Flow", "Application Bridge"] },
    { title: "OT Critical Study", theme: "Foundation Texts", focus: ["Pentateuch", "Historical Books", "Wisdom Literature", "Major Prophets"] },
    { title: "Integration Quarter", theme: "Comprehensive Analysis", focus: ["Cross-Testament", "Thematic Threads", "Doctrinal Synthesis", "Research Methods"] },
    // Year 2
    { title: "Original Languages", theme: "Greek & Hebrew Basics", focus: ["Greek Alphabet", "Hebrew Basics", "Word Studies", "Tool Mastery"] },
    { title: "Systematic Theology", theme: "Doctrine Building", focus: ["God & Christ", "Spirit & Salvation", "Church & End Times", "Integration"] },
    { title: "Historical Theology", theme: "Church History", focus: ["Early Church", "Medieval Period", "Reformation", "Modern Era"] },
    { title: "Apologetics", theme: "Defending Faith", focus: ["Evidence", "Philosophy", "Worldviews", "Engagement"] },
    { title: "Research Capstone", theme: "Original Contribution", focus: ["Topic Selection", "Research Methods", "Writing", "Presentation"] },
    { title: "Analytical Mastery", theme: "Path Completion", focus: ["Comprehensive Review", "Final Project", "Certification", "Teaching Others"] },
  ];

  const months: MonthCurriculum[] = [];
  for (let m = startMonth; m <= endMonth; m++) {
    const themeIndex = (m - 4) % themes.length;
    const theme = themes[themeIndex] || themes[0];
    
    months.push({
      month: m,
      title: theme.title,
      theme: theme.theme,
      weeks: theme.focus.map((f, i) => ({
        weekNumber: i + 1,
        title: f,
        focus: `Month ${m}, Week ${i + 1} focus on ${f}`,
        scripture: getScriptureForMonth(m, i + 1, "analytical"),
        activities: generateActivities(`a${m}-w${i + 1}`, f, "analytical"),
        milestone: `Complete ${f} analysis`,
      })),
      gateAssessment: `Present Month ${m} analytical research demonstrating mastery of ${theme.theme}.`,
    });
  }
  return months;
}

function generateDevotionalPathMonths(startMonth: number, endMonth: number): MonthCurriculum[] {
  const themes = [
    { title: "Deepening Prayer Life", theme: "Intimate Communion", focus: ["ACTS Prayer", "Listening Prayer", "Intercessory Prayer", "Warfare Prayer"] },
    { title: "Spiritual Disciplines", theme: "Habits of Grace", focus: ["Fasting", "Solitude", "Silence", "Sabbath"] },
    { title: "Character Formation", theme: "Fruit of the Spirit", focus: ["Love & Joy", "Peace & Patience", "Kindness & Goodness", "Faithfulness & Self-Control"] },
    { title: "Healing & Wholeness", theme: "Inner Life", focus: ["Forgiveness", "Grief & Loss", "Identity in Christ", "Freedom"] },
    { title: "Psalms Journey", theme: "Emotional Honesty", focus: ["Praise Psalms", "Lament Psalms", "Wisdom Psalms", "Messianic Psalms"] },
    { title: "Life Integration", theme: "Whole-Life Devotion", focus: ["Work & Worship", "Family Devotion", "Community Life", "Kingdom Living"] },
    // Year 2
    { title: "Contemplative Traditions", theme: "Historic Practices", focus: ["Desert Fathers", "Monastic Wisdom", "Mystics", "Modern Contemplatives"] },
    { title: "Missional Devotion", theme: "Outward Focus", focus: ["Compassion", "Justice", "Evangelism", "Global Awareness"] },
    { title: "Seasons of Life", theme: "Life Transitions", focus: ["Youth & Growth", "Adulthood", "Suffering", "Aging & Death"] },
    { title: "Leadership Devotion", theme: "Serving Others", focus: ["Servant Heart", "Wisdom", "Courage", "Legacy"] },
    { title: "Creative Worship", theme: "Artistic Expression", focus: ["Music & Song", "Visual Art", "Writing", "Movement"] },
    { title: "Devotional Mastery", theme: "Path Completion", focus: ["Life Review", "Spiritual Direction", "Testimony", "Sending"] },
  ];

  const months: MonthCurriculum[] = [];
  for (let m = startMonth; m <= endMonth; m++) {
    const themeIndex = (m - 4) % themes.length;
    const theme = themes[themeIndex] || themes[0];
    
    months.push({
      month: m,
      title: theme.title,
      theme: theme.theme,
      weeks: theme.focus.map((f, i) => ({
        weekNumber: i + 1,
        title: f,
        focus: `Month ${m}, Week ${i + 1} focus on ${f}`,
        scripture: getScriptureForMonth(m, i + 1, "devotional"),
        activities: generateActivities(`d${m}-w${i + 1}`, f, "devotional"),
        milestone: `Experience ${f} breakthrough`,
      })),
      gateAssessment: `Share Month ${m} devotional journey demonstrating growth in ${theme.theme}.`,
    });
  }
  return months;
}

function generateWarriorPathMonths(startMonth: number, endMonth: number): MonthCurriculum[] {
  const themes = [
    { title: "Advanced Combat", theme: "Elite Training", focus: ["Speed Mastery", "Endurance", "Precision", "Team Tactics"] },
    { title: "Apologetics Arsenal", theme: "Defending Truth", focus: ["Evidence", "Logic", "Worldviews", "Engagement"] },
    { title: "Gospel Deployment", theme: "Evangelism Training", focus: ["Personal Evangelism", "Group Methods", "Follow-Up", "Discipleship"] },
    { title: "Leadership Combat", theme: "Leading Others", focus: ["Vision", "Strategy", "Team Building", "Crisis Response"] },
    { title: "Scripture Mastery", theme: "Complete Arsenal", focus: ["OT Survey", "NT Survey", "Memory Systems", "Teaching Others"] },
    { title: "Integration Quarter", theme: "Full Deployment", focus: ["Multi-Front Warfare", "Sustained Combat", "Recovery", "Advancement"] },
    // Year 2
    { title: "Specialized Weapons", theme: "Advanced Tools", focus: ["Counseling", "Deliverance", "Healing Prayer", "Prophetic"] },
    { title: "Cultural Engagement", theme: "Marketplace Combat", focus: ["Workplace", "Media", "Politics", "Arts"] },
    { title: "Global Warfare", theme: "Mission Fields", focus: ["Unreached Peoples", "Persecuted Church", "Urban Ministry", "Rural Outreach"] },
    { title: "Mentorship", theme: "Raising Warriors", focus: ["Identifying Potential", "Training Methods", "Accountability", "Release"] },
    { title: "Legacy Building", theme: "Long-Term Impact", focus: ["Family Legacy", "Church Impact", "Community Transformation", "Kingdom Advancement"] },
    { title: "Warrior Mastery", theme: "Path Completion", focus: ["Final Review", "Capstone Battle", "Certification", "Commission"] },
  ];

  const months: MonthCurriculum[] = [];
  for (let m = startMonth; m <= endMonth; m++) {
    const themeIndex = (m - 4) % themes.length;
    const theme = themes[themeIndex] || themes[0];
    
    months.push({
      month: m,
      title: theme.title,
      theme: theme.theme,
      weeks: theme.focus.map((f, i) => ({
        weekNumber: i + 1,
        title: f,
        focus: `Month ${m}, Week ${i + 1} focus on ${f}`,
        scripture: getScriptureForMonth(m, i + 1, "warrior"),
        activities: generateActivities(`w${m}-w${i + 1}`, f, "warrior"),
        milestone: `Achieve ${f} combat readiness`,
      })),
      gateAssessment: `Complete Month ${m} battle assessment demonstrating mastery of ${theme.theme}.`,
    });
  }
  return months;
}

function getScriptureForMonth(month: number, week: number, path: string): string {
  // Return appropriate scripture based on month and path
  const scriptures: Record<string, string[]> = {
    visual: ["Genesis 37-50", "Exodus 1-15", "Joshua 1-12", "Judges highlights", "Ruth", "1 Samuel 1-20", "2 Samuel 1-12", "1 Kings 1-11", "Daniel 1-6", "Jonah", "Matthew 1-7", "Mark 1-8"],
    analytical: ["Romans 1-8", "Romans 9-16", "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Hebrews 1-6"],
    devotional: ["Psalms 1-30", "Psalms 31-60", "Psalms 61-90", "Psalms 91-120", "Psalms 121-150", "Proverbs 1-15", "Proverbs 16-31", "Ecclesiastes", "Song of Solomon", "Isaiah 40-55", "John 13-17", "1 John"],
    warrior: ["Joshua", "Judges", "1 Samuel", "2 Samuel", "1 Kings 17-22", "2 Kings 1-13", "Nehemiah", "Esther", "Daniel 1-6", "Acts 1-12", "Acts 13-28", "Revelation 1-3"],
  };
  const list = scriptures[path] || scriptures.visual;
  return list[(month + week) % list.length];
}

function generateActivities(prefix: string, focus: string, path: PathType): WeekActivity[] {
  const pathIcons: Record<PathType, string[]> = {
    visual: ["🎨", "👁️", "🖼️", "🎬", "💭"],
    analytical: ["🔍", "📊", "🔬", "📝", "🧩"],
    devotional: ["🙏", "📖", "✍️", "❤️", "🕊️"],
    warrior: ["⚔️", "🛡️", "🎯", "💪", "🏆"],
  };
  
  const pathTypes: Record<PathType, ("reading" | "drill" | "exercise" | "reflection" | "challenge")[]> = {
    visual: ["reading", "exercise", "exercise", "drill", "reflection"],
    analytical: ["reading", "exercise", "drill", "exercise", "reflection"],
    devotional: ["reading", "reflection", "exercise", "reflection", "reflection"],
    warrior: ["drill", "drill", "challenge", "challenge", "drill"],
  };

  const icons = pathIcons[path];
  const types = pathTypes[path];

  return [
    { id: `${prefix}-a1`, title: `Learn: ${focus}`, description: `Introduction to ${focus} concepts`, type: types[0], duration: "15 min", icon: icons[0] },
    { id: `${prefix}-a2`, title: `Practice: ${focus}`, description: `Apply ${focus} to Scripture`, type: types[1], duration: "20 min", icon: icons[1] },
    { id: `${prefix}-a3`, title: `${focus} Exercise`, description: `Hands-on ${focus} application`, type: types[2], duration: "25 min", icon: icons[2] },
    { id: `${prefix}-a4`, title: `${focus} Drill`, description: `Speed and accuracy with ${focus}`, type: types[3], duration: "15 min", icon: icons[3] },
    { id: `${prefix}-a5`, title: `Daily ${focus}`, description: `Integrate ${focus} into daily life`, type: types[4], duration: "10 min daily", icon: icons[4] },
  ];
}

// ============================================
// PATH CURRICULUM STORAGE & ACCESS
// ============================================
const pathCurricula: Record<PathType, MonthCurriculum[]> = {
  visual: visualPathCurriculum,
  analytical: analyticalPathCurriculum,
  devotional: devotionalPathCurriculum,
  warrior: warriorPathCurriculum,
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

// Get all weeks for a path
export const getAllWeeksForPath = (pathType: PathType): { month: number; week: WeekOutline }[] => {
  const curriculum = pathCurricula[pathType];
  const allWeeks: { month: number; week: WeekOutline }[] = [];
  
  curriculum.forEach((monthCurr) => {
    monthCurr.weeks.forEach((week) => {
      allWeeks.push({ month: monthCurr.month, week });
    });
  });
  
  return allWeeks;
};

export { pathCurricula };
