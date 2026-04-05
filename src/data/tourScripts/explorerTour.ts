import type { TourDefinition } from "./types";

export const EXPLORER_TOUR: TourDefinition = {
  id: "explorer-overview",
  title: "Explorer Mode — Your Palace Journey",
  subtitle: "Reginald introduces Study, Games, University & Chapel (~10 min)",
  verse: "Proverbs 25:2",
  verseText: "It is the glory of God to conceal a thing: but the honour of kings is to search out a matter.",
  emoji: "🧭",
  intro: {
    id: "explorer-intro",
    guide: "reginald",
    floor: 0,
    floorName: "Welcome",
    roomCode: "INTRO",
    roomName: "Introduction",
    title: "Welcome to Explorer Mode",
    script: `Hello — I'm Reginald, your concierge and navigator. Welcome to Explorer Mode — Level 2 of PhototheologyOS. You've moved beyond the basics, and now you're standing at the gates of the Phototheology Palace. This is where everything begins to click. Explorer Mode gives you four powerful spaces: Study, Games, University, and Chapel. Together, they'll transform how you read, remember, and experience the Bible. You don't need to master everything today. I'm going to walk you through each space, show you the highlights, and give you a clear starting point. Proverbs 25:2 says, "It is the glory of God to conceal a thing: but the honour of kings is to search out a matter." That's what Explorer Mode is about — searching out the treasures God has hidden in His Word. Let's begin.`,
    estimatedSeconds: 40,
  },
  segments: [
    // === THE PALACE ===
    {
      id: "ex-palace",
      guide: "reginald",
      floor: 1,
      floorName: "Foundation",
      roomCode: "PAL",
      roomName: "The Palace",
      title: "The Phototheology Palace",
      script: `The Palace is the heart of everything — the framework that gives every other feature its structure and purpose. When you open it, you'll see all eight floors laid out visually — each floor with its rooms, each room with its code and description. You can tap any floor to explore its rooms in detail, or tap any room to get a full explanation with examples and practice exercises. Now here's the relief: you don't need to memorize all eight floors right now. Most users start with just two or three rooms — Story Room, Observation Room, and Dimensions Room — and that alone transforms their study. The rest unfolds naturally as you grow. Think of the Palace like a gym. You don't use every machine on day one. You start with the basics, build strength, and add equipment as you're ready. The Palace is the skeleton; every feature you'll use is the muscle.`,
      estimatedSeconds: 40,
    },

    // === STUDY SPACE ===
    {
      id: "ex-study",
      guide: "reginald",
      floor: 2,
      floorName: "Study",
      roomCode: "STD",
      roomName: "Study Space",
      title: "Study Space: Your Bible Workshop",
      script: `The Study Space is your primary workshop. It's where reading becomes research and research becomes revelation. You have a full King James Bible built in — navigate by book and chapter, search keywords, and bookmark verses with color-coded tags and personal notes. The Audio Bible lets you listen to Scripture in multiple commentary voices — Epic Narrator for cinematic delivery, Scholar for analytical precision, Counselor for warm empathy, and more. You can listen while you commute, exercise, or rest. The Image Bible renders Scripture visually — AI-generated artwork that gives you the Translation Room experience digitally. Every image becomes a mental anchor. The Interlinear Bible shows Hebrew and Greek alongside English with Strong's numbers — that's your Def-Com Room in digital form. Tap a word and the definition appears instantly. The Bible Timeline places every person, place, and event on a chronological map. The Genealogy Decoder takes the "begats" most people skip and unlocks them as treasure maps — tracing the theological significance of every name and lineage. And Jeeves is always here. Ask him anything about a passage, and he'll respond with depth, warmth, and Phototheology-informed insight. Ask him to "juice" a chapter and he'll run it through every room in the Palace. Study Space is where your daily Bible study lives. Start here.`,
      estimatedSeconds: 55,
    },

    // === GAMES SPACE ===
    {
      id: "ex-games",
      guide: "reginald",
      floor: 3,
      floorName: "Games",
      roomCode: "GAM",
      roomName: "Games Space",
      title: "Games: Training Systems in Disguise",
      script: `Now let me reframe something — because the word "games" undersells it. These aren't games. They're training systems disguised as games. Every single one targets a specific Phototheology skill. You don't just play — you practice. And the practice sticks because it's fun. PT Scrabble is our flagship: two to six players place principle cards on a board, building chains of connection to a seed verse. Jeeves judges your explanations and awards points. The Equation Builder trains you to build PT Equations — symbolic chains of rooms applied to a verse. Chain Chess layers Phototheology onto chess — every capture requires a biblical connection. Sanctuary Run tests your sanctuary theology. Christ Lock tests your ability to find Christ in any passage. Symbol Decoder trains you to recognize biblical symbols. Observation Flux tests your observation speed. Frame Snapshot ties to the 24FPS Room. And we have classic games with PT twists: Jeopardy, Family Feud, Checkers, Connect Four, and PT Uno — all requiring biblical knowledge to play. Daily Challenges give you a new exercise each day — five to ten minutes, Jeeves grades it, done. Start with one game. Whichever one sounds fun. The best training is the training you actually do.`,
      estimatedSeconds: 50,
    },

    // === UNIVERSITY SPACE ===
    {
      id: "ex-university",
      guide: "reginald",
      floor: 4,
      floorName: "University",
      roomCode: "UNI",
      roomName: "University Space",
      title: "University: Structured Learning",
      script: `For those who prefer structured learning over free exploration, the University Space offers guided courses that build on the Palace framework. The Phototheology Course is the foundational curriculum — it walks you through all eight floors, room by room, with exercises, quizzes, and practical assignments. It's the best way to systematically learn the method. The Daniel Course and Revelation Course apply Phototheology specifically to apocalyptic prophecy — the 5th Floor Vision Room in action. These teach you to read Daniel and Revelation through the historicist lens with sanctuary, cycles, and three heavens frameworks fully integrated. The Blueprint Courses address real-life applications — weight loss, mental health, marriage, grief, financial stewardship — all through a biblical lens. These show that Scripture speaks to every dimension of human life. The 90-Day Phototheology Course takes you through a structured daily journey with assignments, milestones, and measurable growth. Pick one course that matches where you are. If you're new to Phototheology, start the Phototheology Course. If you love prophecy, start Daniel. One course at a time — that's how growth compounds.`,
      estimatedSeconds: 50,
    },

    // === CHAPEL SPACE ===
    {
      id: "ex-chapel",
      guide: "reginald",
      floor: 5,
      floorName: "Chapel",
      roomCode: "CHP",
      roomName: "Chapel Space",
      title: "Chapel: Where Study Becomes Worship",
      script: `The Chapel is where intellect meets the heart — where study becomes worship. This is the 7th Floor brought to life: fire, meditation, and devotion. The Night Watches feature is a guided late-night devotional experience — Scripture, reflection prompts, and ambient audio designed for those quiet hours when the world is still and God's voice is clearest. The Morning Watch mirrors it for the dawn hours — greeting the day with the Word. Daily Devotionals offer curated readings with Phototheology insights woven in. The Prayer Journal gives you space to record prayers, track answers, and see God's faithfulness over time. The Growth Journal tracks your spiritual development — breakthroughs, reflections, and milestones. And the Audio Devotional delivers fresh content you can listen to daily. The Chapel reminds you that Phototheology is never just intellectual — it's transformational. The Fire Room isn't a concept; it's an experience. Come here when you need to feel the Word, not just study it. Come here when your heart needs what your mind already knows.`,
      estimatedSeconds: 45,
    },

    // === FAST START ===
    {
      id: "ex-faststart",
      guide: "reginald",
      floor: 6,
      floorName: "Start",
      roomCode: "FSP",
      roomName: "Fast Start",
      title: "Your Explorer Fast Start",
      script: `Now — the most important part. Here's your first week in Explorer Mode. Day one: open the Palace. Browse the eight floors. Read the description of Floor 1 — the Furnishing Floor. Then open the Bible and read one chapter. Day two: ask Jeeves one question about that chapter. Save one gem from his response. Day three: play one game. Any game. Whichever catches your eye. Day four: try the Daily Challenge. Five minutes. Jeeves grades it. Done. Day five: start the Phototheology Course — just lesson one. Day six: visit the Chapel. Try the Night Watch or Morning Watch. Let the Word settle into your heart. Day seven: rest. Review your gems. Check your progress. Notice how much you've grown in just one week. Four spaces. Six days. Ten to fifteen minutes each. That's Explorer Mode. And when you're ready for more — when you want sermon tools, apologetics, mastery training, and the full advanced toolkit — Level 3 Immersion Mode will be waiting. But for now, explore. The Palace is yours. And I'm always here to guide you.`,
      estimatedSeconds: 50,
    },
  ],
  outro: {
    id: "explorer-outro",
    guide: "reginald",
    floor: 0,
    floorName: "Closing",
    roomCode: "OUTRO",
    roomName: "Farewell",
    title: "Go Explore",
    script: `And that's Explorer Mode — four spaces designed to build your foundation: Study for reading and research, Games for practice and training, University for structured learning, and Chapel for worship and devotion. You don't need everything today. Start with the Palace and one chapter. Ask Jeeves one question. Play one game. That's enough to change how you see the Bible. I'm always here — tap the Reginald tab anytime and I'll point you to your next step. Welcome to the Palace, Explorer. The Word of Christ is waiting. Let's search it out together.`,
    estimatedSeconds: 30,
  },
};
