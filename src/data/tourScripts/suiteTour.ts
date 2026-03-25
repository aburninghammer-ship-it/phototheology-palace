import type { TourDefinition } from "./types";

export const SUITE_TOUR: TourDefinition = {
  id: "suite-overview",
  title: "The Phototheology Suite Tour",
  subtitle: "Reginald walks you through every tool (~15 min)",
  verse: "Colossians 3:16",
  verseText: "Let the word of Christ dwell in you richly in all wisdom.",
  emoji: "🏰",
  intro: {
    id: "intro",
    guide: "reginald",
    floor: 0,
    floorName: "Welcome",
    roomCode: "INTRO",
    roomName: "Introduction",
    title: "Welcome to the Suite Tour",
    script: `Good evening. I'm Reginald — your concierge and navigator for the Phototheology Suite. And tonight, it's just me. No Jeeves on this tour. Don't worry, he's not offended — he's probably in the Juice Room squeezing Habakkuk right now. But before I show you anything, let me be honest with you. Most people who use this platform never actually use it. They talk to Jeeves — maybe play a game or two — and miss eighty percent of what could change how they read the Bible forever. That ends tonight. Because here's what I've learned: the people who transform their Bible study aren't the ones who use every feature. They're the ones who use the right three features consistently. So tonight I'm going to show you everything — but more importantly, I'm going to show you where to start. If you only use three things after this tour, start here: open the Bible tab and read a chapter. Ask Jeeves one question about it. Play one game. That's day one. That's enough to change everything. But first, let me show you why this platform has over thirty features — and why you'll eventually want all of them. Colossians 3:16 says, "Let the word of Christ dwell in you richly in all wisdom." The Suite exists to make that dwelling rich. Let's begin.`,
    estimatedSeconds: 60,
  },
  segments: [
    // === SECTION 1: YOUR AI STUDY PARTNERS — "Understand the Bible" ===
    {
      id: "s1-jeeves",
      guide: "reginald",
      floor: 1,
      floorName: "Understand",
      roomCode: "AI",
      roomName: "Jeeves & Reginald",
      title: "Your AI Study Partners",
      script: `Let's start with the two people you'll interact with most — and the single most important feature in the platform. If you use nothing else, use this. Jeeves is your AI-powered Bible scholar. You can find him by tapping the Jeeves tab in the navigation. He operates in multiple modes. In General mode, you can ask him anything about the Bible — a verse, a doctrine, a theological question — and he'll respond with depth, warmth, and Phototheology-informed insight. He'll quote Scripture, apply PT principles, and give you gems you can save. In Juice Room mode, you hand him any book, chapter, or verse and he runs it through every room in the palace — Story, Imagination, Observation, Concentration, Dimensions, Sanctuary, Prophecy, Cycles, Three Heavens — and produces a comprehensive breakdown. It's like having a master theologian sit with you for an hour on any text. In Scrabble Polish mode, after a multiplayer game, Jeeves takes all the study entries and weaves them into a personalized manuscript for each player. In Reasoning mode — accessible at the Jeeves Reasoning Engine — he operates as Explorer, Auditor, or Architect, handling complex theological investigations with chain-of-thought reasoning. Then there's me — Reginald. I'm your navigator. When you're not sure which feature to use, ask me. I know every tool in the Suite, every game, every course, every route. I suggest next steps based on your progress, recommend games that train specific rooms, and help you build a study rhythm. Think of Jeeves as your professor and me as your academic advisor. You need both. But here's the key: Jeeves isn't here to replace your thinking — he's here to accelerate it. The goal isn't dependence. The goal is that one day you walk through Scripture and see what Jeeves sees, because you've trained your own eyes. He's a coach, not a crutch. And that's what makes this different from every other Bible app.`,
      estimatedSeconds: 70,
    },

    // === SECTION 2: THE PALACE — "Understand the Bible" ===
    {
      id: "s2-palace",
      guide: "reginald",
      floor: 1,
      floorName: "Understand",
      roomCode: "PAL",
      roomName: "The Palace",
      title: "The Palace: Your Study Framework",
      script: `The Palace is the heart of everything — the framework that gives every other feature its structure and purpose. You can access it from the Palace tab in the navigation. When you open it, you'll see all eight floors laid out visually — each floor with its rooms, each room with its code and description. You can tap any floor to explore its rooms in detail, or tap any room to get a full explanation with examples and practice exercises. The Palace Explorer gives you a visual, interactive map where you can browse room by room. Each room page explains the principle, shows how to apply it, and links you to related games and challenges that train that specific skill. This isn't just a reference — it's a living study center. You can also access the Palace Tour feature — the very feature playing this audio right now — where Jeeves and I walk you through every room using a specific passage. We currently have tours for Psalm 23 and Philippians 2:5-8, with more coming. These tours show you how to apply the method to real Scripture, step by step. Now here's the relief: you don't need to memorize all eight floors tonight. Most users start with just two or three rooms — Story Room, Observation Room, and Dimensions Room — and that alone transforms their study. The rest unfolds naturally as you grow. Think of the Palace like a gym. You don't use every machine on day one. You start with the basics, build strength, and add equipment as you're ready. The Palace is the skeleton; every other feature in the Suite is the muscle.`,
      estimatedSeconds: 55,
    },

    // === SECTION 3: BIBLE TOOLS — "Understand the Bible" ===
    {
      id: "s3-bible",
      guide: "reginald",
      floor: 2,
      floorName: "Understand",
      roomCode: "BIB",
      roomName: "Bible & Study Tools",
      title: "Bible Reading & Research Tools",
      script: `The Suite has a full Bible built in — King James Version — accessible from the Bible tab. You can navigate by book and chapter, search for keywords or phrases, and bookmark any verse with color-coded tags and personal notes. But it goes far beyond a basic Bible reader. The Audio Bible lets you listen to Scripture read aloud in multiple commentary voices — Epic Narrator for cinematic delivery, Urban Preacher for real-talk energy, Counselor for warm empathy, Ancient for authoritative weight, Scholar for analytical precision, and Preacher for natural pastoral tone. You can listen while you commute, exercise, or rest, and the commentary weaves in Phototheology insights as it reads. The Image Bible renders Scripture visually — AI-generated artwork for passages, giving you the Translation Room experience digitally. Every image is a mental anchor you can return to. The Interlinear Bible shows you Hebrew and Greek alongside the English, with Strong's numbers and definitions — that's your Def-Com Room in digital form. You don't need to know Greek or Hebrew; you just need to tap a word and the definition appears. The Bible Lexicon, Bible Atlas, and Bible Timeline give you dictionary definitions, geographical maps, and chronological placement for any person, place, or event in Scripture. The Bible Encyclopedia offers deep-dive articles on hundreds of biblical topics. And the Thematic Search lets you search Scripture by theme rather than keyword — ask for "passages about God's faithfulness" and it returns curated results. All of these tools work together. You read a passage, listen to it in the Audio Bible, see it in the Image Bible, look up words in the Interlinear, and place it on the Timeline. That's multi-sensory study — and it's all in one platform. This is how you understand the Bible — not just read it, but see it, hear it, feel it, and place it in its world.`,
      estimatedSeconds: 75,
    },

    // === SECTION 4: GAMES — "Practice the Bible" ===
    {
      id: "s4-games",
      guide: "reginald",
      floor: 3,
      floorName: "Practice",
      roomCode: "GAM",
      roomName: "Games Hub",
      title: "Games: Training Systems in Disguise",
      script: `Now let me show you one of the most unique parts of the Suite — and let me reframe what it is, because the word "games" undersells it. We have over thirty games. But here's the key — they're not games. They're training systems disguised as games. Every single one targets a specific Phototheology skill. You don't just play — you practice. And the practice sticks because it's fun. PT Scrabble is our flagship multiplayer game. Two to six players take turns placing Phototheology principle cards on a board, building chains of connection to a seed verse. Each play requires you to explain how your principle connects to the verse and to adjacent cards. Jeeves judges your explanations and awards points. At the end, every player gets a personalized polished manuscript. It trains every floor simultaneously. The Equation Builder and Equation Battle take the PT Equation — a symbolic chain of rooms applied to a verse — and turn it into a collaborative or competitive challenge. Players split the equation and each decode their portion. Jeeves combines and scores the results. Chain Chess layers Phototheology onto a chess game — every capture requires a biblical connection. The Freestyle Zone is open-ended creative practice. Sanctuary Run tests your knowledge of sanctuary furniture and theology. Connect 6 Draft trains genre classification. Christ Lock tests your ability to find Christ in any passage. Controversy Raid puts you in Great Controversy scenarios. Escape the Dragon is a Revelation-themed escape room. Witness Trial simulates a courtroom where you defend biblical claims with evidence. We also have classic games with PT twists: Jeopardy, Family Feud, Checkers, Tic-Tac-Toe, Connect Four — all requiring biblical knowledge to play. And for kids, we have a separate Kids Games hub with age-appropriate versions. Every game tells you which rooms it trains, so you can target your weak areas. You don't need to play them all. Start with one. Whichever one sounds fun. Because the best training is the training you actually do.`,
      estimatedSeconds: 75,
    },

    // === SECTION 5: CHALLENGES & GROWTH — "Practice the Bible" ===
    {
      id: "s5-challenges",
      guide: "reginald",
      floor: 3,
      floorName: "Practice",
      roomCode: "CHL",
      roomName: "Challenges & Growth",
      title: "Daily Challenges & Spiritual Growth",
      script: `The Challenge system keeps you growing every day — and it solves the number one problem in Bible study: inconsistency. Daily Challenges give you a new Phototheology exercise each day — sometimes it's an observation drill, sometimes a freestyle connection, sometimes a Concentration Room focus on a specific passage. Jeeves grades your submission and gives you feedback and a score. Five to ten minutes. That's all it takes. The Challenge Board shows community-wide challenges where you can see how others are tackling the same exercise. Community Challenges let you share your best work and see what others have discovered — it's iron sharpening iron. The Growth Journal is your personal space for tracking spiritual development over time. You log reflections, breakthroughs, prayer answers, and study milestones. Over weeks and months, you can look back and see how far you've come — and that backward look is incredibly motivating. Training Drills offer structured practice sessions — think of it like going to the gym, but for your Bible study muscles. Each drill targets a specific skill: observation speed, freestyle fluency, verse recall, pattern recognition. The Mastery Dashboard tracks your progress across all eight floors. It shows which rooms you've practiced, which games you've played, and where your gaps are — your spiritual fitness tracker. Achievements reward milestones. Certificates mark completions. And here's the mindset shift: you don't have to do everything. Most users start with just the Daily Challenge — five minutes a day. That one habit, maintained consistently, produces more growth than sporadic three-hour study sessions. Consistency beats intensity. Every time.`,
      estimatedSeconds: 65,
    },

    // === SECTION 6: MEMORY TOOLS — "Remember the Bible" ===
    {
      id: "s6-memory",
      guide: "reginald",
      floor: 4,
      floorName: "Remember",
      roomCode: "MEM",
      roomName: "Memory & Memorization",
      title: "Memory Tools & Scripture Memorization",
      script: `Let me talk about something most Bible apps ignore entirely: memory. Because reading without remembering is pouring water through a sieve. The Suite takes memory seriously — because the 1st Floor of the Palace is all about stocking your mind with Scripture, and that requires tools. The Memory section lets you create custom memorization lists — verses, chapters, entire passages. It uses spaced repetition and multiple game modes to help you retain what you learn. The First Letter Game shows you only the first letter of each word in a verse, training your brain to fill in the gaps. The Memory Palace Builder lets you create a mental palace — yes, a palace within the Palace — where you assign verses to rooms in a physical space you know, like your house. This ancient memory technique, combined with Phototheology's image-based approach, makes long-term memorization dramatically more effective. The 24FPS Gallery — tied to the 24FPS Room — gives you one symbolic image per chapter for the entire Bible. You can browse these as flashcards, study them in sequence, or use them as memory anchors. One image per chapter, strange enough to stick, deep enough to teach from. And the Memorization Verses feature curates the most important verses to memorize, organized by theme and difficulty, so you always know what to learn next. Memory isn't about brute force repetition. It's about images, stories, and connections — the very things the Palace trains you in. These tools are how you ensure that what you study stays with you. Because the goal isn't just to read the Bible — it's to carry it inside you.`,
      estimatedSeconds: 65,
    },

    // === SECTION 7: STUDY & SERMON TOOLS — "Teach & Share the Bible" ===
    {
      id: "s7-study",
      guide: "reginald",
      floor: 4,
      floorName: "Teach",
      roomCode: "STD",
      roomName: "Study & Sermon Features",
      title: "Deep Study, Sermons & Content Creation",
      script: `Now let me group together the features that help you go from student to teacher — because the Bible was never meant to be hoarded. It was meant to be shared. The Research Mode and Research Assistant give you a scholarly workspace where you can investigate topics across multiple sources, build arguments, and save findings — like having a seminary library in your pocket. My Studies is your personal study workspace — create, organize, and revisit studies on any topic. The Sermon Builder, Sermon Writer, and Sermon Simmer tools are specifically designed for pastors and teachers. The Builder structures a sermon from scratch. The Writer generates drafts based on your passage and theme. And the Simmer — this is unique — lets an idea develop slowly. You feed it a verse and a direction, and it produces a sermon that's been "slow-cooked" with depth. Sermon PowerPoint generates presentation slides from your sermon content. The Study Series Generator and Bible Study Series Builder let you create multi-week study curricula — perfect for small groups, Sabbath School classes, or personal deep dives. The Infographic Generator turns any study insight into a shareable visual — perfect for social media, church bulletins, or personal study walls. The Give Me a Gem feature — tap the button and Jeeves delivers a fresh, unexpected gem from Scripture. Like opening a surprise gift from the Word. The Analyze Thoughts feature lets you write out your thinking on a passage and have Jeeves evaluate it — checking theological accuracy, suggesting deeper connections, and affirming what you got right. It's like having a mentor read your homework. The Devotionals section offers curated devotional plans. And the Character Profiles feature provides deep-dive analyses of biblical characters with Phototheology principles. Every creative tool is designed to help you not just learn the Word but share it with others. The Suite doesn't just make you a better student — it makes you a better teacher. And this is how trained Bible thinkers operate: they don't just consume — they create, they teach, they give back what they've received.`,
      estimatedSeconds: 75,
    },

    // === SECTION 8: COURSES & LEARNING ===
    {
      id: "s8-courses",
      guide: "reginald",
      floor: 5,
      floorName: "Learn",
      roomCode: "CRS",
      roomName: "Courses & Training",
      title: "Structured Courses & Learning Paths",
      script: `For those who prefer structured learning over free exploration, the Suite offers multiple courses — and each one builds on the Palace framework. The Phototheology Course is the foundational curriculum — it walks you through all eight floors, room by room, with exercises, quizzes, and practical assignments. It's the best way to systematically learn the method. The Daniel Course and Revelation Course apply Phototheology specifically to apocalyptic prophecy — the 5th Floor Vision Room in action. These courses teach you to read Daniel and Revelation through the historicist lens with sanctuary, cycles, and three heavens frameworks fully integrated. The COTA Series — Church of the Anointed — is a comprehensive training program that includes defense mode for apologetics, helping you defend biblical truth with confidence and precision. The Blueprint Courses address real-life applications — weight loss, mental health, marriage, grief, financial stewardship, stress management, and breaking strongholds — all through a biblical lens. These show that Scripture isn't just for "spiritual" matters; it speaks to every dimension of human life. Learning Paths give you curated, step-by-step journeys based on your goals — whether you're a new believer, a pastor, a teacher, or a seasoned student. And the Daily Reading, Daily Verse, and Reading Plans features keep you in the Word every single day. Now here's the relief: you don't need to take every course. Pick one that matches where you are right now. If you're brand new, start the Phototheology Course. If you love prophecy, start Daniel. If you want practical life change, try a Blueprint Course. One course at a time. That's how this grows with you.`,
      estimatedSeconds: 70,
    },

    // === SECTION 9: COMMUNITY ===
    {
      id: "s9-community",
      guide: "reginald",
      floor: 5,
      floorName: "Connect",
      roomCode: "COM",
      roomName: "Community & Connection",
      title: "Community, Groups & Multiplayer",
      script: `Bible study was never meant to be solitary — and the Suite has a full community layer that makes studying together as natural as studying alone. The Community feed lets you share insights, gems, study breakthroughs, and encouragements with other users. Study Partners matches you with other users for accountability and shared study. Study Groups lets you create or join groups — a small group Bible study, a church class, a group of friends. The Multiplayer Lobby is where you join live games — PT Scrabble, Equation Battle, Chain Chess — with other real users. You can create private games with room codes or join public matches. Live Study rooms let you study in real time with others — audio, text, and shared screens — like a virtual Bible study classroom. The Church Hub — for churches that subscribe — provides a full digital campus: announcements, chat rooms, campaigns, study releases, and member management. Pastors can push weekly studies, track engagement, and connect with their congregation digitally. And Guilds let you form long-term teams that compete, study, and grow together. Community isn't a side feature — it's woven into the DNA of the Suite. Because iron sharpens iron, and a coal separated from the fire goes cold. You're learning to think in Scripture — and that's better done together.`,
      estimatedSeconds: 60,
    },

    // === SECTION 10: SPECIALIZED & KIDS ===
    {
      id: "s10-specialized",
      guide: "reginald",
      floor: 6,
      floorName: "Specialized",
      roomCode: "SPE",
      roomName: "Specialized & Family",
      title: "Specialized Features & Next Generation",
      script: `Let me highlight some specialized features that deserve their own spotlight — and the kids ecosystem, because this isn't just for you. It's for the next generation. The Prophecy Watch feature tracks current events through a prophetic lens. The Culture Controversy tool examines cultural issues through the Great Controversy framework. The Apologetics GPT is specifically trained for defending biblical truth with evidence-based responses. The Daniel and Revelation GPT is purpose-built for apocalyptic study. The Branch Study feature lets you take a single verse and branch outward in a visual tree format. The Mind Map Palace gives you a visual, spatial representation of your study. And the Ascensions and Expansions tool lets you practice the Five Ascensions and Four Expansions interactively. Now for the next generation: KidGPT is a child-friendly AI Bible study partner — Jeeves for kids. The PT Kids Games hub offers games designed specifically for children. The Treasure Hunt turns Bible study into an adventure. And the Escape Room feature creates immersive, timed challenges. Family worship just got a major upgrade. Parents can play PT Scrabble with their kids, do treasure hunts together, or ask KidGPT to tell a Bible story in a way that captivates young imaginations. Deuteronomy 6: teach them diligently, talk about them when you sit, when you walk, when you lie down, and when you rise up. The Suite gives you tools to do exactly that. The goal is generational — this isn't just a platform. It's a way of thinking about Scripture that passes from parent to child.`,
      estimatedSeconds: 65,
    },

    // === SECTION 11: YOUR FAST START PATH ===
    {
      id: "s11-faststart",
      guide: "reginald",
      floor: 7,
      floorName: "Start",
      roomCode: "FSP",
      roomName: "Fast Start Path",
      title: "Your Fast Start Path",
      script: `Now — this is the most important part of the entire tour. If you remember nothing else, remember this. You don't need to use all of this. Most users start with just two or three features. And here's the path I recommend for your first week. Day one: open the Bible tab. Read one chapter. Ask Jeeves one question about it. That's it. Day two: do it again with a different chapter. Save one gem from Jeeves' response. Day three: play one game. Any game. Whichever one catches your eye. Day four: try the Daily Challenge. Five minutes. Jeeves grades it. Done. Day five: read a chapter and try one room yourself — the Observation Room. Just write down ten things you notice. No interpretation. Just notice. Day six: ask Jeeves to run that same chapter through the Dimensions Room. See how five lenses change everything. Day seven: rest. Review your gems. Look at your progress dashboard. Notice how much you learned in six days with just ten to fifteen minutes a day. That's the fast start. Three features: Bible, Jeeves, one game. That's your foundation. Everything else grows from there. You're not building a habit of using a platform — you're building a habit of thinking in Scripture. And that habit will change your life. The Suite is designed so that even five minutes of daily engagement produces measurable growth. And I'm always here to adjust the plan. Tell me your goals, and I'll suggest a personalized rhythm that fits your life. That's what a concierge does — and I love it.`,
      estimatedSeconds: 65,
    },

    // === SECTION 12: THE BIGGER PICTURE ===
    {
      id: "s12-vision",
      guide: "reginald",
      floor: 8,
      floorName: "Vision",
      roomCode: "VIS",
      roomName: "The Bigger Picture",
      title: "Why This All Matters",
      script: `Let me close with why all of this matters — not the features, not the tools, but the reason behind them. The Phototheology Suite exists because the Word of God deserves the best tools the modern world can offer. We live in an age where entertainment has a billion-dollar infrastructure — streaming platforms, gaming engines, social networks — all designed to capture your attention. The Bible has been fighting for attention with one hand tied behind its back. Not anymore. The Suite brings the same level of engagement, interactivity, and beauty to Bible study that the entertainment industry brings to distraction. Games that teach. AI that guides. Communities that sharpen. Progress tracking that motivates. Visual tools that anchor memory. Audio that immerses. Creative tools that equip you to share. But the technology is only the scaffolding. The building is Christ. Every game points to Him. Every room reveals Him. Every challenge draws you closer to His mind. Every gem is a facet of His character. The Suite is the 1st through 7th floors — tools, methods, exercises, community. But the goal is the 8th Floor: the point where you no longer need the tools because the Word of Christ dwells in you richly. Reflexive. Natural. Alive. You think in Scripture. You see Christ in everything. You carry the Palace inside you. That's the vision. And every feature I've shown you tonight is a step on that staircase. You're not just learning a platform. You're learning to think like a biblical architect. And that identity — that way of seeing — will transform everything: your prayer life, your conversations, your relationships, your teaching, your very sense of who you are in Christ. Use the Suite. Explore every feature. Play every game. Take every course. But never forget: the destination isn't mastery of a platform. It's knowing Christ. The platform is just the means. He is the end.`,
      estimatedSeconds: 70,
    },
  ],
  outro: {
    id: "outro",
    guide: "reginald",
    floor: 8,
    floorName: "Closing",
    roomCode: "OUTRO",
    roomName: "Farewell",
    title: "Your Next Steps",
    script: `And there you have it — the complete Phototheology Suite. Tools to understand the Bible. Games to practice it. Memory systems to remember it. Courses, sermons, and creative tools to teach and share it. Community to grow together. And a framework — the Palace — that gives everything its structure and purpose. If you're feeling overwhelmed — stop. Breathe. You don't need everything today. Remember the fast start: Bible tab, Jeeves, one game. Three features. That's your first week. The Suite grows with you. It unfolds gradually, like a flower opening — each petal revealing another layer of beauty. And remember: I'm always here. Tap the Reginald tab anytime and tell me where you are, what you need, or what confuses you. I'll point you to the right tool, the right game, the right feature. That's my job — and I love it. From Reginald, your concierge and navigator: welcome to the Phototheology Suite. The Word of Christ is waiting to dwell in you richly. Let's make that happen together.`,
    estimatedSeconds: 45,
  },
};
