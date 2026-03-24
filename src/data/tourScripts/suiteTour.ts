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
    script: `Good evening. I'm Reginald, your concierge and navigator for the Phototheology Suite — and tonight, it's just me. No Jeeves on this tour. Don't worry, he's not offended — he's probably in the Juice Room squeezing Habakkuk right now. Tonight I want to do something different. Instead of walking through a passage room by room, I want to walk you through the Suite itself — every major feature, every tool, every game, every resource — so you know exactly what's available to you and how to use it. Because here's the honest truth: most users only scratch the surface. They find Jeeves, they love the conversations, maybe they play a game or two — and they never discover the other twenty-five features that could transform their study. That's like buying a palace and only living in the foyer. So tonight, I'm giving you the full tour. By the end, you'll know every room in this digital palace, what it does, and when to use it. Colossians 3:16 says, "Let the word of Christ dwell in you richly in all wisdom." The Suite exists to make that dwelling rich — to give you every tool the modern age can offer for the ancient task of knowing God through His Word. Let's begin.`,
    estimatedSeconds: 60,
  },
  segments: [
    // === SECTION 1: YOUR AI STUDY PARTNERS ===
    {
      id: "s1-jeeves",
      guide: "reginald",
      floor: 1,
      floorName: "AI Partners",
      roomCode: "AI",
      roomName: "Jeeves & Reginald",
      title: "Your AI Study Partners",
      script: `Let's start with the two people you'll interact with most: Jeeves and me. Jeeves is your AI-powered Bible scholar. You can find him by tapping the Jeeves tab in the navigation. He operates in multiple modes. In General mode, you can ask him anything about the Bible — a verse, a doctrine, a theological question — and he'll respond with depth, warmth, and Phototheology-informed insight. He'll quote Scripture, apply PT principles, and give you gems you can save. In Juice Room mode, you hand him any book, chapter, or verse and he runs it through every room in the palace — Story, Imagination, Observation, Concentration, Dimensions, Sanctuary, Prophecy, Cycles, Three Heavens — and produces a comprehensive breakdown. It's like having a master theologian sit with you for an hour on any text. In Scrabble Polish mode, after a multiplayer game, Jeeves takes all the study entries and weaves them into a personalized manuscript for each player. In Reasoning mode — accessible at the Jeeves Reasoning Engine — he operates as Explorer, Auditor, or Architect, handling complex theological investigations with chain-of-thought reasoning. Then there's me — Reginald. I'm your navigator. When you're not sure which feature to use, ask me. I know every tool in the Suite, every game, every course, every route. I suggest next steps based on your progress, recommend games that train specific rooms, and help you build a study rhythm. I also know the COTA Series, the War College, and all the Freestyle and Training Dojo features. Think of Jeeves as your professor and me as your academic advisor. You need both.`,
      estimatedSeconds: 70,
    },

    // === SECTION 2: THE PALACE ===
    {
      id: "s2-palace",
      guide: "reginald",
      floor: 1,
      floorName: "Palace",
      roomCode: "PAL",
      roomName: "The Palace",
      title: "The Palace: Your Study Framework",
      script: `The Palace is the heart of everything. You can access it from the Palace tab in the navigation. When you open it, you'll see all eight floors laid out visually — each floor with its rooms, each room with its code and description. You can tap any floor to explore its rooms in detail, or tap any room to get a full explanation with examples and practice exercises. The Palace Explorer gives you a visual, interactive map where you can browse room by room. Each room page explains the principle, shows how to apply it, and links you to related games and challenges that train that specific skill. This isn't just a reference — it's a living study center. You can also access the Palace Tour feature — the very feature playing this audio right now — where Jeeves and I walk you through every room using a specific passage. We currently have tours for Psalm 23 and Philippians 2:5-8, with more coming. These tours show you how to apply the method to real Scripture, step by step. The Palace is your framework. Every other feature in the Suite connects back to it. Games train specific rooms. Challenges test your skills in specific rooms. Jeeves applies rooms to texts. The Palace is the skeleton; everything else is the muscle.`,
      estimatedSeconds: 55,
    },

    // === SECTION 3: BIBLE TOOLS ===
    {
      id: "s3-bible",
      guide: "reginald",
      floor: 2,
      floorName: "Bible Tools",
      roomCode: "BIB",
      roomName: "Bible & Study Tools",
      title: "Bible Reading & Research Tools",
      script: `The Suite has a full Bible built in — King James Version — accessible from the Bible tab. You can navigate by book and chapter, search for keywords or phrases, and bookmark any verse with color-coded tags and personal notes. But it goes far beyond a basic Bible reader. The Audio Bible lets you listen to Scripture read aloud in multiple commentary voices — Epic Narrator for cinematic delivery, Urban Preacher for real-talk energy, Counselor for warm empathy, Ancient for authoritative weight, Scholar for analytical precision, and Preacher for natural pastoral tone. You can listen while you commute, exercise, or rest, and the commentary weaves in Phototheology insights as it reads. The Image Bible renders Scripture visually — AI-generated artwork for passages, giving you the Translation Room experience digitally. Every image is a mental anchor you can return to. The Interlinear Bible shows you Hebrew and Greek alongside the English, with Strong's numbers and definitions — that's your Def-Com Room in digital form. You don't need to know Greek or Hebrew; you just need to tap a word and the definition appears. The Bible Lexicon, Bible Atlas, and Bible Timeline give you dictionary definitions, geographical maps, and chronological placement for any person, place, or event in Scripture. The Bible Encyclopedia offers deep-dive articles on hundreds of biblical topics. And the Thematic Search lets you search Scripture by theme rather than keyword — ask for "passages about God's faithfulness" and it returns curated results. All of these tools work together. You read a passage, listen to it in the Audio Bible, see it in the Image Bible, look up words in the Interlinear, and place it on the Timeline. That's multi-sensory study — and it's all in one platform.`,
      estimatedSeconds: 75,
    },

    // === SECTION 4: STUDY FEATURES ===
    {
      id: "s4-study",
      guide: "reginald",
      floor: 2,
      floorName: "Study",
      roomCode: "STD",
      roomName: "Study Features",
      title: "Deep Study & Research",
      script: `Beyond the Bible reader, the Suite has serious study tools for those who want to go deep. The Research Mode and Research Assistant give you a scholarly workspace where you can investigate topics across multiple sources, build arguments, and save findings — like having a seminary library in your pocket. The Polish feature takes your raw study notes, journal entries, or Scrabble game results and lets Jeeves transform them into polished, publication-ready manuscripts. It's like having an editor who's also a theologian. My Studies is your personal study workspace — create, organize, and revisit studies on any topic. You can write, annotate, and build structured documents over time. The Sermon Builder, Sermon Writer, and Sermon Simmer tools are specifically designed for pastors and teachers. The Builder helps you structure a sermon from scratch. The Writer generates drafts based on your passage and theme. The Simmer lets an idea develop slowly — you feed it a verse and a direction, and it produces a sermon that's been "slow-cooked" with depth. Sermon PowerPoint even generates presentation slides from your sermon content. The Study Series Generator and Bible Study Series Builder let you create multi-week study curricula — perfect for small groups, Sabbath School classes, or personal deep dives. You design the arc, and Jeeves helps fill in the content. The Quarterly Study feature aligns with the international Sabbath School quarterly, giving you Phototheology-enhanced commentary on the current week's lesson. And the Daily Reading, Daily Verse, and Reading Plans features keep you in the Word every single day with structured, progress-tracked devotional rhythms.`,
      estimatedSeconds: 70,
    },

    // === SECTION 5: GAMES ===
    {
      id: "s5-games",
      guide: "reginald",
      floor: 3,
      floorName: "Games",
      roomCode: "GAM",
      roomName: "Games Hub",
      title: "Games: Learning Through Play",
      script: `Now let me show you one of the most unique parts of the Suite: the Games Hub. We have over thirty games, and every single one trains a specific Phototheology skill. This isn't entertainment for entertainment's sake — it's deliberate practice disguised as fun. PT Scrabble is our flagship multiplayer game. Two to six players take turns placing Phototheology principle cards on a board, building chains of connection to a seed verse. Each play requires you to explain how your principle connects to the verse and to adjacent cards. Jeeves judges your explanations and awards points. At the end, every player gets a personalized polish manuscript. It trains every floor simultaneously. The Equation Builder and Equation Battle take the PT Equation — a symbolic chain of rooms applied to a verse — and turn it into a collaborative or competitive challenge. Players split the equation and each decode their portion. Jeeves combines and scores the results. Chain Chess layers Phototheology onto a chess game — every capture requires a biblical connection. The Freestyle Zone is open-ended creative practice. Sanctuary Run tests your knowledge of sanctuary furniture and theology. Connect 6 Draft trains genre classification. Christ Lock tests your ability to find Christ in any passage. Controversy Raid puts you in Great Controversy scenarios. Escape the Dragon is a Revelation-themed escape room. Witness Trial simulates a courtroom where you defend biblical claims with evidence. We also have classic games with PT twists: Jeopardy, Family Feud, Checkers, Tic-Tac-Toe, Connect Four — all requiring biblical knowledge to play. And for kids, we have a separate Kids Games hub with age-appropriate versions. The Games Hub is accessible from the navigation bar. Every game tells you which rooms it trains, so you can target your weak areas.`,
      estimatedSeconds: 75,
    },

    // === SECTION 6: CHALLENGES & GROWTH ===
    {
      id: "s6-challenges",
      guide: "reginald",
      floor: 3,
      floorName: "Challenges",
      roomCode: "CHL",
      roomName: "Challenges & Growth",
      title: "Daily Challenges & Spiritual Growth",
      script: `The Challenge system keeps you growing every day. Daily Challenges give you a new Phototheology exercise each day — sometimes it's an observation drill, sometimes a freestyle connection, sometimes a Concentration Room focus on a specific passage. Jeeves grades your submission and gives you feedback and a score. The Challenge Board shows community-wide challenges where you can see how others are tackling the same exercise. Community Challenges let you share your best work and see what others have discovered — it's iron sharpening iron. The Growth Journal is your personal space for tracking spiritual development over time. You log reflections, breakthroughs, prayer answers, and study milestones. Over weeks and months, you can look back and see how far you've come. The Training Drills feature offers structured practice sessions — think of it like going to the gym, but for your Bible study muscles. Each drill targets a specific skill: observation speed, freestyle fluency, verse recall, pattern recognition. The Mastery Dashboard tracks your progress across all eight floors. It shows which rooms you've practiced, which games you've played, and where your gaps are. Think of it as your spiritual fitness tracker. And Achievements reward milestones — complete a certain number of studies, play a certain number of games, maintain a streak, and you earn badges that reflect genuine growth. Certificates are available for completing courses and mastery levels, giving you tangible proof of your development.`,
      estimatedSeconds: 65,
    },

    // === SECTION 7: MEMORY TOOLS ===
    {
      id: "s7-memory",
      guide: "reginald",
      floor: 4,
      floorName: "Memory",
      roomCode: "MEM",
      roomName: "Memory & Memorization",
      title: "Memory Tools & Scripture Memorization",
      script: `The Suite takes memory seriously — because the 1st Floor of the Palace is all about stocking your mind with Scripture, and that requires tools. The Memory section lets you create custom memorization lists — verses, chapters, entire passages. It uses spaced repetition and multiple game modes to help you retain what you learn. The First Letter Game shows you only the first letter of each word in a verse, training your brain to fill in the gaps. The Memory Palace Builder lets you create a mental palace — yes, a palace within the Palace — where you assign verses to rooms in a physical space you know, like your house. This ancient memory technique, combined with Phototheology's image-based approach, makes long-term memorization dramatically more effective. The Verse Memory Hall is your trophy room — every verse you've mastered is displayed there, and you can review them anytime. Flashcards offer traditional study card practice with Phototheology-enhanced content — not just the verse text, but the gems, the images, and the room connections attached to each verse. The 24FPS Gallery — tied to the 24FPS Room — gives you one symbolic image per chapter for the entire Bible. You can browse these as flashcards, study them in sequence, or use them as memory anchors. And the Memorization Verses feature curates the most important verses to memorize, organized by theme and difficulty, so you always know what to learn next. Memory isn't about brute force repetition. It's about images, stories, and connections. The Suite gives you all three.`,
      estimatedSeconds: 65,
    },

    // === SECTION 8: COURSES & LEARNING ===
    {
      id: "s8-courses",
      guide: "reginald",
      floor: 4,
      floorName: "Courses",
      roomCode: "CRS",
      roomName: "Courses & Training",
      title: "Structured Courses & Learning Paths",
      script: `For those who want structured learning rather than free exploration, the Suite offers multiple courses. The Phototheology Course is the foundational curriculum — it walks you through all eight floors, room by room, with exercises, quizzes, and practical assignments. It's the best way to systematically learn the method. The Daniel Course and Revelation Course apply Phototheology specifically to apocalyptic prophecy — the 5th Floor Vision Room in action. These courses teach you to read Daniel and Revelation through the historicist lens with sanctuary, cycles, and three heavens frameworks fully integrated. The COTA Series — Church of the Anointed — is a comprehensive training program that includes defense mode for apologetics, helping you defend biblical truth with confidence and precision. The Blueprint Courses address real-life applications — weight loss, mental health, marriage, grief, financial stewardship, stress management, and breaking strongholds — all through a biblical lens. These show that Scripture isn't just for "spiritual" matters; it speaks to every dimension of human life. The Revelation Course for Kids makes prophecy accessible to younger learners with age-appropriate language and interactive elements. Learning Paths — accessible from the Paths tab — give you curated, step-by-step journeys through the Suite based on your goals. Whether you're a new believer, a pastor, a teacher, or a seasoned student, there's a path designed for you. And the Video Training library offers instructional videos covering Phototheology principles, palace walkthroughs, and practical demonstrations.`,
      estimatedSeconds: 70,
    },

    // === SECTION 9: COMMUNITY ===
    {
      id: "s9-community",
      guide: "reginald",
      floor: 5,
      floorName: "Community",
      roomCode: "COM",
      roomName: "Community & Connection",
      title: "Community, Groups & Multiplayer",
      script: `Bible study was never meant to be solitary. The Suite has a full community layer. The Community feed lets you share insights, gems, study breakthroughs, and encouragements with other users. You can follow people whose study style inspires you, and their posts appear in your Following Feed. Study Partners matches you with other users for accountability and shared study. Study Groups lets you create or join groups — a small group Bible study, a church class, a group of friends — and study together with shared content and discussion. The Multiplayer Lobby is where you join live games — PT Scrabble, Equation Battle, Chain Chess — with other real users. You can create private games with room codes for your friends or join public matches. Live Study rooms let you study in real time with others — audio, text, and shared screens — like a virtual Bible study classroom. The Church Hub — for churches that subscribe — provides a full digital campus: announcements, chat rooms, campaigns, study releases, and member management. Pastors can push weekly studies, track engagement, and connect with their congregation digitally. The Leaderboard shows top performers across games, challenges, and study streaks — healthy competition that drives deeper engagement. And Guilds let you form long-term teams that compete together, study together, and grow together. Community isn't a side feature — it's woven into the DNA of the Suite.`,
      estimatedSeconds: 65,
    },

    // === SECTION 10: CREATIVE TOOLS ===
    {
      id: "s10-creative",
      guide: "reginald",
      floor: 5,
      floorName: "Creative",
      roomCode: "CRE",
      roomName: "Creative & Content Tools",
      title: "Creative & Content Generation",
      script: `The Suite also equips you to create content — not just consume it. The Infographic Generator turns any study insight, verse breakdown, or theological concept into a shareable visual infographic. It's perfect for social media, church bulletins, or personal study walls. The Bible Image Library stores AI-generated artwork organized by book, chapter, and theme — your personal gallery of biblical scenes that you can use for teaching, meditation, or sharing. The Sparks Library collects quick-fire insights and ideas — short, punchy biblical observations you can browse for inspiration or share with others. The Give Me a Gem feature is exactly what it sounds like — tap the button and Jeeves delivers a fresh, unexpected gem from Scripture. It's like opening a surprise gift from the Word every time. The Analyze Thoughts feature lets you write out your thinking on a passage and have Jeeves evaluate it — checking your theological accuracy, suggesting deeper connections, and affirming what you got right. It's like having a mentor read your homework. The Devotionals section offers curated devotional plans — daily readings with Phototheology-enhanced commentary — that you can follow personally or share with others. You can even create your own devotional series. And the Character Profiles feature provides deep-dive analyses of biblical characters — their arcs, their significance, their Christ-connections — all generated with Phototheology principles. Every creative tool is designed to help you not just learn the Word but share it with others. The Suite doesn't just make you a better student — it makes you a better teacher.`,
      estimatedSeconds: 70,
    },

    // === SECTION 11: SPECIALIZED FEATURES ===
    {
      id: "s11-specialized",
      guide: "reginald",
      floor: 6,
      floorName: "Specialized",
      roomCode: "SPE",
      roomName: "Specialized Features",
      title: "Specialized & Advanced Features",
      script: `Let me highlight some specialized features that deserve their own spotlight. The Prophecy Watch feature tracks current events through a prophetic lens — connecting headlines to biblical prophecy with discernment and balance. The Culture Controversy tool examines cultural issues through the Great Controversy framework, helping you think biblically about contemporary debates. The Apologetics GPT — separate from Jeeves — is specifically trained for defending biblical truth. If you're facing tough questions from skeptics, this is your tool. It provides evidence-based responses rooted in Scripture, history, and logic. The Daniel and Revelation GPT is purpose-built for apocalyptic study — it knows the beasts, the timelines, the sanctuary connections, and the historicist interpretations inside and out. The Branch Study feature lets you take a single verse and branch outward — exploring its connections to other texts, themes, cycles, and heavens in a visual, tree-like format. It's Bible Freestyle made visible. The Mind Map Palace gives you a visual, spatial representation of your study — nodes, connections, clusters — like a digital whiteboard for theological thinking. The Ascensions and Expansions tool lets you practice the Five Ascensions and Four Expansions interactively — moving from text to chapter to book to cycle to heaven, and stretching across width, time, depth, and height. And the Source Library curates reliable theological sources — books, articles, and references — organized by topic, so you always know where to go for deeper reading beyond the Suite itself. Each of these features addresses a specific need. You don't need to use all of them every day — but knowing they exist means you'll never hit a wall without a tool to break through it.`,
      estimatedSeconds: 75,
    },

    // === SECTION 12: KIDS & FAMILY ===
    {
      id: "s12-kids",
      guide: "reginald",
      floor: 6,
      floorName: "Family",
      roomCode: "KID",
      roomName: "Kids & Family",
      title: "Kids, Family & Next Generation",
      script: `The Suite isn't just for adults. We have an entire kids ecosystem. KidGPT is a child-friendly AI Bible study partner — it speaks in age-appropriate language, uses simple illustrations, and makes Scripture accessible for young minds. It's Jeeves for the next generation. The PT Kids Games hub offers games designed specifically for children — simpler rules, brighter visuals, and age-appropriate biblical content. These games train the same Phototheology principles but at a level kids can engage with. The Revelation Course for Kids makes prophecy approachable for younger learners — no beast nightmares, just wonder at God's plan. The Treasure Hunt feature turns Bible study into an adventure — kids follow clues through Scripture, solving puzzles and discovering gems along the way. And the Escape Room feature creates immersive, timed challenges where kids — or adults — work through biblical scenarios to "escape" by answering questions and making connections. Family worship just got a major upgrade. Parents can play PT Scrabble with their kids, do treasure hunts together, or simply ask KidGPT to tell a Bible story in a way that captivates young imaginations. The goal is generational — Phototheology isn't just for this generation. It's a way of thinking about Scripture that parents can pass to children, who pass it to their children. Deuteronomy 6: teach them diligently, talk about them when you sit, when you walk, when you lie down, and when you rise up. The Suite gives you tools to do exactly that.`,
      estimatedSeconds: 65,
    },

    // === SECTION 13: PERSONAL & PROGRESS ===
    {
      id: "s13-progress",
      guide: "reginald",
      floor: 7,
      floorName: "Progress",
      roomCode: "PRG",
      roomName: "Your Progress",
      title: "Tracking Your Growth",
      script: `Let me talk about how the Suite tracks your growth — because growth that isn't measured is growth that's easily abandoned. The My Progress dashboard gives you a comprehensive view of your activity: study sessions completed, games played, challenges submitted, streaks maintained, rooms practiced, and floors explored. It shows you where you're strong and where you have gaps. The Streaks feature tracks your daily consistency. Every day you engage with the Suite — whether it's a Jeeves conversation, a game, a challenge, or a Bible reading — your streak grows. And streaks matter, because consistency is the key to mastery. The Mastery Dashboard maps your progress onto the eight floors of the Palace. You can see which rooms you've spent time in and which ones you've neglected. If you've been living in the Freestyle Floor but haven't touched the Vision Floor, it'll show you — and I'll suggest activities to fill those gaps. Achievements and Certificates give you tangible markers of progress. Completing courses, maintaining long streaks, reaching mastery milestones — these are all recognized and celebrated. The Spiritual Training feature provides structured physical-spiritual wellness practices, integrating biblical principles with daily habits. Your Profile page shows your public-facing study identity — your achievements, your favorite gems, your community contributions. Other users can see your profile and be inspired by your journey. And Notes gives you a private space to capture thoughts, reflections, and ideas that come to you during study — a digital journal that's always accessible. Every feature in the Suite feeds data back to your progress tracking. Nothing is wasted. Every game you play, every challenge you complete, every conversation with Jeeves — it all counts toward your growth. The Suite remembers even when you forget.`,
      estimatedSeconds: 70,
    },

    // === SECTION 14: PUTTING IT ALL TOGETHER ===
    {
      id: "s14-rhythm",
      guide: "reginald",
      floor: 7,
      floorName: "Rhythm",
      roomCode: "RHY",
      roomName: "Daily Rhythm",
      title: "Building Your Daily Rhythm",
      script: `Now let me help you put it all together — because having thirty-plus features is overwhelming if you don't know where to start. Here's what a daily rhythm might look like. Morning: Start with the Daily Verse or Daily Reading. Spend five minutes in the Audio Bible, letting the Word wash over you while you prepare for the day. That's your Meditation Room practice. Midday: Take a lunch break and do the Daily Challenge. It takes five to ten minutes. Jeeves grades it, you get a score, and you've practiced a specific room. That's your Investigation Floor training. Evening: Play one game — PT Scrabble with a friend, or a solo game like Sanctuary Run or Christ Lock. Fifteen minutes of play that trains multiple rooms simultaneously. That's your Freestyle and Next Level practice. Weekend: Do a deeper study. Open Jeeves in Juice Room mode, hand him a chapter, and let him run it through the palace. Save the gems. Add to your Growth Journal. Review your Mastery Dashboard. That's your Depth Expansion. Monthly: Take a course lesson. Work through one section of the Phototheology Course or the Daniel Course. Review your certificates and achievements. Set goals for the next month. That's your structured learning. You don't have to do everything every day. The key is consistency — a little bit every day adds up to transformation over time. The Suite is designed so that even five minutes of daily engagement produces measurable growth. And I'm always here to adjust the plan. If you tell me your goals, I'll suggest a personalized rhythm that fits your life. That's what a concierge does.`,
      estimatedSeconds: 70,
    },

    // === SECTION 15: THE BIGGER PICTURE ===
    {
      id: "s15-vision",
      guide: "reginald",
      floor: 8,
      floorName: "Vision",
      roomCode: "VIS",
      roomName: "The Bigger Picture",
      title: "Why This All Matters",
      script: `Let me close with why all of this matters — not the features, not the tools, but the reason behind them. The Phototheology Suite exists because the Word of God deserves the best tools the modern world can offer. We live in an age where entertainment has a billion-dollar infrastructure — streaming platforms, gaming engines, social networks — all designed to capture your attention. The Bible has been fighting for attention with one hand tied behind its back. Not anymore. The Suite brings the same level of engagement, interactivity, and beauty to Bible study that the entertainment industry brings to distraction. Games that teach. AI that guides. Communities that sharpen. Progress tracking that motivates. Visual tools that anchor memory. Audio that immerses. Creative tools that equip you to share. But the technology is only the scaffolding. The building is Christ. Every game points to Him. Every room reveals Him. Every challenge draws you closer to His mind. Every gem is a facet of His character. The Suite is the 1st through 7th floors — tools, methods, exercises, community. But the goal is the 8th Floor: the point where you no longer need the tools because the Word of Christ dwells in you richly. Reflexive. Natural. Alive. You think in Scripture. You see Christ in everything. You carry the Palace inside you. That's the vision. And every feature I've shown you tonight is a step on that staircase. Use the Suite. Explore every feature. Play every game. Take every course. But never forget: the destination isn't mastery of a platform. It's knowing Christ. The platform is just the means. He is the end.`,
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
    script: `And there you have it — the complete Phototheology Suite, from AI study partners to games, from Bible tools to courses, from memory systems to community, from kids' features to advanced research, all woven together by the eight-floor Palace that gives everything its structure and purpose. If you're feeling overwhelmed — don't be. You don't have to use everything today. Start with three things: open your Bible in the Suite and read a chapter. Ask Jeeves one question about it. Play one game. That's day one. Tomorrow, do it again. The day after, try a challenge. The week after, start a course. Let the Suite unfold gradually, like a flower opening — each petal revealing another layer of beauty. And remember: I'm always here. Tap the Reginald tab anytime and tell me where you are, what you need, or what confuses you. I'll point you to the right tool, the right game, the right feature. That's my job — and I love it. From Reginald, your concierge and navigator: welcome to the Phototheology Suite. The Word of Christ is waiting to dwell in you richly. Let's make that happen together.`,
    estimatedSeconds: 50,
  },
};
