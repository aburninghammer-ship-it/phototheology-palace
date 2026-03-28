import type { GuidedTourStep } from "@/components/guided-tour/GuidedTourOverlay";

export const DASHBOARD_TOUR: GuidedTourStep[] = [
  {
    id: "dashboard-welcome",
    title: "Welcome to Your Dashboard",
    description: "This is your home base — everything you need to stay on track with your Bible study journey.",
    narration: "Hello! Welcome to your personal Dashboard. This is your home base — the place where you can see your progress, pick up where you left off, and discover new tools. Let me walk you through it.",
    tooltipPosition: "center",
  },
  {
    id: "dashboard-streak",
    title: "Reading Streak & XP",
    description: "Track your daily streak, experience points, and level. Consistency is the key to mastering Scripture.",
    narration: "At the top you'll find your reading streak, experience points, and level. The more consistently you study, the higher your streak climbs. This gamification keeps you motivated and accountable.",
    tooltipPosition: "bottom",
  },
  {
    id: "dashboard-palace-progress",
    title: "Palace Progress",
    description: "See how far you've explored the Phototheology Palace — which floors and rooms you've visited and mastered.",
    narration: "The Palace Progress section shows how far you've journeyed through the eight floors of Phototheology. You can see which rooms you've explored, your mastery level, and what's waiting to be discovered.",
    tooltipPosition: "bottom",
  },
  {
    id: "dashboard-quick-actions",
    title: "Quick Actions & Tools",
    description: "Jump straight into study tools, AI prompts, quick notes, and the sermon forge — all from one place.",
    narration: "Your dashboard gives you quick access to study tools, AI prompts, your notes, and the sermon forge. Think of it as your command center — everything is one tap away.",
    tooltipPosition: "bottom",
  },
  {
    id: "dashboard-devotional",
    title: "Daily Audio Devotional",
    description: "Start your day with a personalized audio devotional, delivered fresh each morning.",
    narration: "Don't miss the Daily Audio Devotional. Each morning, a fresh devotional is generated just for you, complete with audio narration. It's the perfect way to start your study day.",
    tooltipPosition: "bottom",
  },
  {
    id: "dashboard-community",
    title: "Community & Challenges",
    description: "See what the community is doing, join weekly challenges, and climb the leaderboard.",
    narration: "Finally, stay connected with the community. You can see what others are studying, join weekly challenges, and compete on the leaderboard. Bible study is better together. That's your Dashboard — now go explore!",
    tooltipPosition: "bottom",
  },
];

export const GAMES_TOUR: GuidedTourStep[] = [
  {
    id: "games-welcome",
    title: "Welcome to the Games Hub",
    description: "Over 40 Bible-based games designed to reinforce Phototheology principles while having fun.",
    narration: "Hello! Welcome to the Games Hub. This isn't just entertainment — every game here is designed to reinforce a specific Phototheology principle. There are over 40 games, and I'll show you how to navigate them.",
    tooltipPosition: "center",
  },
  {
    id: "games-search-filter",
    title: "Search & Filter",
    description: "Search for specific games or filter by Palace floor to find games that match your current study level.",
    narration: "Use the search bar to find specific games, or filter by Palace floor. Each floor of the Palace has games designed for that level — so if you're working on the Investigation Floor, you can find detective-style games right away.",
    tooltipPosition: "bottom",
  },
  {
    id: "games-categories",
    title: "Game Categories",
    description: "Games are organized by type: memory, strategy, speed drills, multiplayer, and more.",
    narration: "Games are organized into categories like memory challenges, strategy games, speed drills, and multiplayer competitions. Whether you want a quick five-minute drill or an hour-long deep study game, there's something here for you.",
    tooltipPosition: "bottom",
  },
  {
    id: "games-multiplayer",
    title: "Multiplayer & Game Night",
    description: "Invite friends for real-time multiplayer games — perfect for study groups and game nights.",
    narration: "One of the most exciting features is multiplayer. You can invite friends to play in real-time — perfect for study groups, family game nights, or challenging your guild members. Bible study as a team sport!",
    tooltipPosition: "bottom",
  },
  {
    id: "games-leaderboard",
    title: "Rankings & Achievements",
    description: "Compete on leaderboards and earn achievements as you master each game.",
    narration: "As you play, you'll climb the leaderboards and unlock achievements. Each game tracks your progress, so you can see how you're improving over time. Now go pick a game and start playing!",
    tooltipPosition: "bottom",
  },
];

export const DEVOTIONALS_TOUR: GuidedTourStep[] = [
  {
    id: "devotionals-welcome",
    title: "Welcome to Devotionals",
    description: "Create personalized devotional plans using Phototheology principles — or generate one for a friend.",
    narration: "Hello! Welcome to the Devotionals section. Here you can create personalized devotional plans based on Phototheology principles. Whether it's a 7-day plan or a 90-day deep study, this tool tailors everything to your needs.",
    tooltipPosition: "center",
  },
  {
    id: "devotionals-create",
    title: "Create a Devotional",
    description: "Use the wizard to generate a custom devotional plan — choose your topic, duration, format, and Palace room focus.",
    narration: "Tap 'Create Devotional' to launch the wizard. You'll choose a topic, duration, and format — including special Phototheology formats like 24FPS Visual, Blueprint, or Verse Genetics. The AI generates a complete plan tailored to your chosen Palace room.",
    tooltipPosition: "bottom",
  },
  {
    id: "devotionals-profiles",
    title: "Devotional Profiles",
    description: "Create profiles for different life stages or needs — then generate devotionals customized to each one.",
    narration: "You can also create Devotional Profiles — for yourself, your spouse, your kids, or anyone else. Each profile captures their spiritual needs and stage, so generated devotionals are perfectly customized.",
    tooltipPosition: "bottom",
  },
  {
    id: "devotionals-for-friend",
    title: "Gift a Devotional",
    description: "Generate a devotional for a friend and share it with them — a powerful way to minister to others.",
    narration: "One of the most beautiful features is gifting a devotional. You can create a custom devotional plan for a friend going through a tough time, a new believer, or anyone who needs encouragement. It's ministry at the tap of a button.",
    tooltipPosition: "bottom",
  },
  {
    id: "devotionals-church",
    title: "Church Devotionals",
    description: "Create church-wide devotional plans that your entire congregation can follow together.",
    narration: "If you're part of a church, you can access Church Devotionals — coordinated plans that your entire congregation follows together. It's a powerful way to unify your church around Scripture. That's your Devotionals hub — now go create something meaningful!",
    tooltipPosition: "bottom",
  },
];

export const COTA_TOUR: GuidedTourStep[] = [
  {
    id: "cota-welcome",
    title: "Welcome to the COTA Series",
    description: "The Conflict of the Ages series — Ellen White's masterwork brought to life with AI-powered study tools.",
    narration: "Hello! Welcome to the COTA Series — the Conflict of the Ages collection by Ellen White, brought to life with AI-powered study tools. This section lets you read, listen, study, and defend the truths found in these foundational books.",
    tooltipPosition: "center",
  },
  {
    id: "cota-library",
    title: "COTA Library",
    description: "Browse all five books: Patriarchs & Prophets, Prophets & Kings, Desire of Ages, Acts of the Apostles, and Great Controversy.",
    narration: "The Library tab gives you access to all five books in the Conflict of the Ages series. You can read chapters, listen to audio narration, and access AI-generated study notes — all integrated with the Phototheology Palace framework.",
    tooltipPosition: "bottom",
  },
  {
    id: "cota-defense",
    title: "Defense Mode",
    description: "Practice defending Adventist beliefs using passages from the Spirit of Prophecy and Scripture together.",
    narration: "Defense Mode is where you train to defend your faith. It pairs Spirit of Prophecy passages with Scripture to help you articulate and defend key Adventist doctrines. Think of it as the Apologetics Room of the COTA series.",
    tooltipPosition: "bottom",
  },
  {
    id: "cota-aats",
    title: "AATS War College",
    description: "Advanced Adventist Theological Studies — deep training modules for serious students of prophecy and doctrine.",
    narration: "The AATS War College is for advanced students. It offers deep theological training modules covering prophecy, sanctuary doctrine, and the great controversy theme. This is where you go from student to scholar. That's the COTA Series — dive in and let these books transform your understanding!",
    tooltipPosition: "bottom",
  },
];

export const COURSES_TOUR: GuidedTourStep[] = [
  {
    id: "courses-welcome",
    title: "Welcome to Courses",
    description: "Structured learning paths that take you from beginner to master in Phototheology and Bible prophecy.",
    narration: "Hello! Welcome to Courses. These are structured learning paths designed to take you from beginner to master. Each course follows a curriculum with daily lessons, quizzes, and Palace room integration.",
    tooltipPosition: "center",
  },
  {
    id: "courses-phototheology",
    title: "Phototheology Course",
    description: "The flagship course — learn the complete Palace method floor by floor, room by room.",
    narration: "The flagship course is the Phototheology Course. It teaches you the complete Palace method, floor by floor and room by room. It's available for adults and multiple age groups so the whole family can learn together.",
    tooltipPosition: "bottom",
  },
  {
    id: "courses-blueprint",
    title: "Blueprint Course",
    description: "Master prophecy foundations — the sanctuary, its symbolism, and end-time events.",
    narration: "The Blueprint Course focuses on prophecy foundations — the sanctuary system, its symbolism, and how it connects to end-time events. This is the Vision Floor of the Palace turned into a structured curriculum.",
    tooltipPosition: "bottom",
  },
  {
    id: "courses-daniel-revelation",
    title: "Daniel & Revelation Courses",
    description: "Deep-dive courses into the prophetic books with interactive timelines and visual aids.",
    narration: "The Daniel and Revelation courses take you deep into the prophetic books. With interactive timelines, visual aids, and AI-powered explanations, these courses make prophecy accessible and unforgettable.",
    tooltipPosition: "bottom",
  },
  {
    id: "courses-age-groups",
    title: "Age-Appropriate Learning",
    description: "Every course offers versions for different age groups — adults, teens, and children.",
    narration: "Every course offers age-appropriate versions. Adults get the full depth, teens get engaging activities, and children get fun, visual lessons. The whole family can study together, each at their own level. That's Courses — pick one and start your journey!",
    tooltipPosition: "bottom",
  },
];

export const STUDY_BUDDY_TOUR: GuidedTourStep[] = [
  {
    id: "study-buddy-welcome",
    title: "Welcome to Study Buddy",
    description: "Your AI-powered study companion that walks alongside you through any passage of Scripture.",
    narration: "Hello! Welcome to Study Buddy — your personal AI-powered study companion. Think of me as a fellow student sitting beside you, ready to explore any passage of Scripture together. Let me show you how it works.",
    tooltipPosition: "center",
  },
  {
    id: "study-buddy-passage",
    title: "Choose Your Passage",
    description: "Select any book, chapter, and verse to begin studying — or paste a passage directly.",
    narration: "Start by selecting a book, chapter, and verse. You can study a single verse, a chapter, or even paste a passage directly. Study Buddy will pull up the text and prepare contextual insights for you.",
    tooltipPosition: "bottom",
  },
  {
    id: "study-buddy-prompts",
    title: "AI Study Prompts",
    description: "Use pre-built Phototheology prompts or ask your own questions — each one activates a different Palace room.",
    narration: "The real power is in the prompts. You'll find pre-built Phototheology prompts — each one designed to activate a specific Palace room. Tap Observation to run the Observation Room, or Concentration to find Christ in the passage. You can also type your own questions.",
    tooltipPosition: "bottom",
  },
  {
    id: "study-buddy-sessions",
    title: "Saved Study Sessions",
    description: "Every conversation is saved so you can pick up where you left off — your study journal lives here.",
    narration: "Every study session is automatically saved. You can return to any previous session, review your insights, and continue where you left off. Think of it as your digital study journal — always organized, always accessible.",
    tooltipPosition: "bottom",
  },
  {
    id: "study-buddy-modes",
    title: "Study Modes & Focus",
    description: "Switch between guided study, deep dive, and freestyle modes to match your study style.",
    narration: "You can switch between different study modes — guided study walks you step by step, deep dive goes intensive on one passage, and freestyle lets you explore freely. Match the mode to your study goal. That's Study Buddy — your companion through the Word!",
    tooltipPosition: "bottom",
  },
];

export const READING_PLANS_TOUR: GuidedTourStep[] = [
  {
    id: "reading-plans-welcome",
    title: "Welcome to Reading Plans",
    description: "Structured Bible reading plans that guide you through Scripture with daily assignments and progress tracking.",
    narration: "Hello! Welcome to Reading Plans. These are structured paths through Scripture — each one gives you daily reading assignments, tracks your progress, and keeps you accountable. Let me walk you through the features.",
    tooltipPosition: "center",
  },
  {
    id: "reading-plans-active",
    title: "Your Active Plan",
    description: "See your current reading plan, today's assignment, and how far you've progressed.",
    narration: "At the top you'll see your active reading plan. It shows today's reading assignment, your overall progress percentage, and how many days you've completed. Just tap to open today's reading and start studying.",
    tooltipPosition: "bottom",
  },
  {
    id: "reading-plans-browse",
    title: "Browse Plans",
    description: "Choose from pre-built plans — chronological, thematic, book-by-book, or Phototheology-focused.",
    narration: "Browse through our library of reading plans. You'll find chronological plans that read Scripture in historical order, thematic plans focused on topics like prophecy or the sanctuary, book-by-book deep dives, and plans aligned with specific Palace floors.",
    tooltipPosition: "bottom",
  },
  {
    id: "reading-plans-custom",
    title: "Custom Plan Builder",
    description: "Build your own reading plan — choose the books, pace, and duration that work for you.",
    narration: "Want something unique? The Custom Plan Builder lets you create your own reading plan. Choose which books to include, set your pace — whether it's a chapter a day or three — and pick a start date. The system does the rest.",
    tooltipPosition: "bottom",
  },
  {
    id: "reading-plans-tracking",
    title: "Progress & Streaks",
    description: "Track your reading streak and see completion stats — consistency builds mastery.",
    narration: "Your progress is tracked automatically. You'll see your reading streak, completion percentage, and daily consistency. The more consistently you read, the more you'll retain. That's Reading Plans — pick one and start your journey through the Word!",
    tooltipPosition: "bottom",
  },
];

export const SERMON_BUILDER_TOUR: GuidedTourStep[] = [
  {
    id: "sermon-welcome",
    title: "Welcome to Sermon Builder",
    description: "A complete sermon preparation studio — from idea to delivery, all powered by Phototheology principles.",
    narration: "Hello! Welcome to the Sermon Builder — your complete sermon preparation studio. Whether you're a pastor, Bible worker, or lay preacher, this tool takes you from initial idea to polished sermon, all powered by Phototheology principles.",
    tooltipPosition: "center",
  },
  {
    id: "sermon-forge",
    title: "The Sermon Forge",
    description: "Start with a theme, text, or topic — the AI helps you shape your sermon structure step by step.",
    narration: "The Sermon Forge is where it all begins. Enter a theme, a key text, or a topic, and the AI helps you build a sermon outline. It walks you through the Simmer Method — letting ideas develop naturally, just like a good meal simmered slowly.",
    tooltipPosition: "bottom",
  },
  {
    id: "sermon-armory",
    title: "Scripture Armory",
    description: "Build a collection of supporting verses — search, organize, and attach them to your sermon.",
    narration: "The Scripture Armory is your verse collection tool. Search for supporting passages, organize them by theme, and attach them to specific sermon points. It's like building a quiver of arrows before the battle.",
    tooltipPosition: "bottom",
  },
  {
    id: "sermon-writing",
    title: "Writing & Polishing",
    description: "Write your sermon with rich text editing, AI suggestions, and Phototheology integration.",
    narration: "Once your outline is ready, move to the writing stage. The rich text editor gives you AI suggestions, Phototheology integration, and automatic formatting. When you're done, use the Polish tab to refine your language and flow.",
    tooltipPosition: "bottom",
  },
  {
    id: "sermon-export",
    title: "Export & Present",
    description: "Export your sermon as PDF, PowerPoint, or share it with your congregation directly.",
    narration: "When your sermon is ready, export it as a PDF for your notes, generate a PowerPoint for presentation, or share it directly with your congregation. From idea to pulpit — that's the Sermon Builder!",
    tooltipPosition: "bottom",
  },
];

export const LEADERBOARD_TOUR: GuidedTourStep[] = [
  {
    id: "leaderboard-welcome",
    title: "Welcome to the Leaderboard",
    description: "See how you rank among fellow students — track points, streaks, and achievements across the community.",
    narration: "Hello! Welcome to the Leaderboard. This is where you see how you rank among fellow Phototheology students. It's not about competition — it's about motivation. Seeing others grow pushes you to keep studying. Let me show you around.",
    tooltipPosition: "center",
  },
  {
    id: "leaderboard-rankings",
    title: "Overall Rankings",
    description: "The main leaderboard shows total points earned from studies, challenges, games, and room completions.",
    narration: "The main leaderboard ranks students by total points. You earn points from completing studies, winning challenges, playing games, and mastering Palace rooms. The more you engage, the higher you climb.",
    tooltipPosition: "bottom",
  },
  {
    id: "leaderboard-categories",
    title: "Category Rankings",
    description: "Switch to category view to see leaders in specific areas — challenges, rooms, streaks, and more.",
    narration: "Switch to the category view to see rankings in specific areas. Who has the longest study streak? Who has mastered the most Palace rooms? Who has completed the most challenges? Each category highlights different strengths.",
    tooltipPosition: "bottom",
  },
  {
    id: "leaderboard-time",
    title: "Time Periods",
    description: "Filter by all-time, monthly, or weekly to see who's performing right now.",
    narration: "You can filter the leaderboard by time period — all-time shows lifetime achievement, monthly shows this month's top performers, and weekly highlights who's on fire right now. It keeps things fresh and competitive.",
    tooltipPosition: "bottom",
  },
  {
    id: "leaderboard-your-rank",
    title: "Your Rank & Stats",
    description: "See your personal ranking, points breakdown, and how close you are to the next level.",
    narration: "Your personal stats appear at the top — your current rank, total points, study streak, and achievement count. Use it as a mirror to see your growth. That's the Leaderboard — now go earn your place!",
    tooltipPosition: "bottom",
  },
];

export const MEMORY_PALACE_TOUR: GuidedTourStep[] = [
  {
    id: "memory-welcome",
    title: "Welcome to Memory Palace",
    description: "Build, practice, and master memory lists using proven techniques — from Bible verses to Palace room codes.",
    narration: "Hello! Welcome to the Memory Palace. This is where you build, practice, and master memory lists using proven techniques. Whether you're memorizing Bible verses, Palace room codes, or prophetic timelines — this tool makes it stick.",
    tooltipPosition: "center",
  },
  {
    id: "memory-lists",
    title: "Your Memory Lists",
    description: "Create custom memory lists with text, images, and audio — then practice with spaced repetition.",
    narration: "Start by creating memory lists. Each list can contain text, images, and audio cues. The system uses spaced repetition — showing you items right before you'd forget them — to lock knowledge into long-term memory.",
    tooltipPosition: "bottom",
  },
  {
    id: "memory-games",
    title: "Memory Games",
    description: "Practice your lists through interactive games — matching, speed recall, and sequence challenges.",
    narration: "Once you have a list, practice it through interactive games. Matching games test recognition, speed recall tests your reflexes, and sequence challenges test your ordering. Each game mode reinforces memory differently.",
    tooltipPosition: "bottom",
  },
  {
    id: "memory-templates",
    title: "Templates & Community",
    description: "Use pre-built templates or share your lists with the community — learn from each other.",
    narration: "Don't want to build from scratch? Browse pre-built templates covering common topics — the 28 Fundamentals, Bible book order, prophetic timelines, and more. You can also explore community-created lists and share your own.",
    tooltipPosition: "bottom",
  },
  {
    id: "memory-mastery",
    title: "PT Mastery Tracker",
    description: "Track your mastery of Phototheology concepts — see which rooms and principles you've memorized.",
    narration: "The PT Mastery Tracker shows how well you've memorized the Phototheology system itself — rooms, codes, principles, and techniques. As you master each element, your tracker fills up. That's the Memory Palace — build your mind into a fortress of truth!",
    tooltipPosition: "bottom",
  },
];
