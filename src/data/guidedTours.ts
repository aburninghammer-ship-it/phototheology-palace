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

export const CHARACTER_PROFILES_TOUR: GuidedTourStep[] = [
  {
    id: "characters-welcome",
    title: "Welcome to Character Profiles",
    description: "Explore psychological-spiritual analyses of the Bible's most important figures.",
    narration: "Hello! Welcome to the Character Profiles gallery. Here you'll find in-depth psychological and spiritual analyses of Scripture's most important figures — from patriarchs and prophets to kings and apostles. Let me show you around.",
    tooltipPosition: "center",
  },
  {
    id: "characters-search",
    title: "Search & Filter",
    description: "Find characters by name, archetype, testament, or life situation.",
    narration: "Use the search bar to find any character by name. You can also filter by testament — Old or New — and by archetype, such as Warrior, Prophet, or Servant. There's even a situational filter so you can find characters who faced temptation, betrayal, or leadership pressure.",
    tooltipPosition: "bottom",
  },
  {
    id: "characters-cards",
    title: "Character Cards",
    description: "Each card shows the character's archetype, strengths, weaknesses, and a key lesson.",
    narration: "Each character card gives you a quick snapshot — their archetype badges, core strength and weakness, their mindset, and a key life lesson. Think of it as a flash card for spiritual leadership development.",
    tooltipPosition: "bottom",
  },
  {
    id: "characters-detail",
    title: "Deep Dive Profiles",
    description: "Click any character for a full profile with situations, responses, and AI-powered analysis.",
    narration: "Click any character to open their full profile. Inside you'll find detailed situation analyses — how they responded under pressure, what they got right, what they got wrong, and what we can learn. You can even request an AI-powered deep analysis from Jeeves.",
    tooltipPosition: "bottom",
  },
  {
    id: "characters-apply",
    title: "Apply to Your Life",
    description: "Use character lessons for personal growth, sermon prep, and Bible study groups.",
    narration: "The real power of Character Profiles is application. Use these lessons for personal devotion, sermon preparation, or small group discussion. Every character is a mirror — reflecting our own struggles and pointing us to Christ. That's the Character Profiles tab — explore and grow!",
    tooltipPosition: "bottom",
  },
];

export const ENCYCLOPEDIA_TOUR: GuidedTourStep[] = [
  {
    id: "encyclopedia-welcome",
    title: "Welcome to the Bible Encyclopedia",
    description: "An AI-powered biblical reference integrating Phototheology principles.",
    narration: "Hello! Welcome to the Bible Encyclopedia. This is your AI-powered reference tool — powered by Jeeves and rooted in Phototheology principles. Whether you need to look up a person, place, theme, or symbol, Jeeves will deliver a thorough, Christ-centered answer.",
    tooltipPosition: "center",
  },
  {
    id: "encyclopedia-categories",
    title: "Browse by Category",
    description: "Choose from themes, people, places, objects, symbols, numbers, feasts, and more.",
    narration: "Start by choosing a category. You can explore themes like Covenant and Exile, look up people like Moses or Paul, study places like Jerusalem, or dive into symbols, numbers, animals, and even the biblical feasts. Each category focuses the search so Jeeves gives you the most relevant answer.",
    tooltipPosition: "bottom",
  },
  {
    id: "encyclopedia-search",
    title: "Search Any Topic",
    description: "Type your question or topic and Jeeves will deliver a Phototheology-rich answer.",
    narration: "Type any question or topic into the search bar and hit search. Jeeves will generate a comprehensive, Phototheology-enriched article — complete with scripture references, palace room connections, and Christ-centered interpretation.",
    tooltipPosition: "bottom",
  },
  {
    id: "encyclopedia-random",
    title: "Surprise Me",
    description: "Hit the random button for a serendipitous discovery — let Jeeves pick the topic.",
    narration: "Feeling adventurous? Use the random entry button and let Jeeves surprise you with a topic you might never have searched for. It's a wonderful way to discover hidden gems in Scripture.",
    tooltipPosition: "bottom",
  },
  {
    id: "encyclopedia-results",
    title: "Rich Results",
    description: "Results include formatted text, scripture references, and maps when relevant.",
    narration: "When Jeeves delivers your result, you'll see beautifully formatted text with scripture references, contextual maps for places, and cross-references to other topics. It's like having a biblical scholar in your pocket. That's the Encyclopedia — search, discover, and grow!",
    tooltipPosition: "bottom",
  },
];

export const LIBRARIES_TOUR: GuidedTourStep[] = [
  {
    id: "libraries-welcome",
    title: "Welcome to Your Libraries",
    description: "All your saved content in one place — sparks, gems, bookmarks, highlights, notes, and more.",
    narration: "Hello! Welcome to your Libraries. This is your personal vault — every spark, gem, bookmark, highlight, note, sermon, and image you've saved across the platform lives here. Let me show you how it's organized.",
    tooltipPosition: "center",
  },
  {
    id: "libraries-stats",
    title: "Library Stats",
    description: "See at a glance how much content you've collected across all categories.",
    narration: "At the top you'll see your library statistics — how many sparks, gems, bookmarks, highlights, notes, sermons, and images you've saved. It's a quick pulse check on your study investment.",
    tooltipPosition: "bottom",
  },
  {
    id: "libraries-reference",
    title: "Reference Libraries",
    description: "Browse the PT Room Libraries — organized by Palace floor, each room has its own collection.",
    narration: "The Reference Libraries tab shows all the Phototheology Room Libraries, organized by Palace floor. Each room — from the Story Room to the Patterns Room — has its own curated collection. Click any room to explore its library.",
    tooltipPosition: "bottom",
  },
  {
    id: "libraries-personal",
    title: "Personal Collections",
    description: "Access your saved sparks, gems, bookmarks, highlights, verse notes, and sermons.",
    narration: "Switch to your personal collections to see everything you've saved — sparks of insight, gems from study, bookmarks, verse highlights, handwritten notes, and sermons you've built. Each collection is searchable and organized by date.",
    tooltipPosition: "bottom",
  },
  {
    id: "libraries-powerpoints",
    title: "PowerPoints & Media",
    description: "Your generated presentations and Bible images are stored here too.",
    narration: "Don't forget your media library! Any PowerPoint presentations or Bible images you've generated are stored here as well. You can preview, download, or share them anytime. That's your Libraries — your personal treasury of biblical study!",
    tooltipPosition: "bottom",
  },
];

export const NOTES_TOUR: GuidedTourStep[] = [
  {
    id: "notes-welcome",
    title: "Welcome to Notes",
    description: "Capture your thoughts, insights, and reflections as you study Scripture.",
    narration: "Hello! Welcome to your Notes hub. This is where all your study notes, quick thoughts, and verse annotations live. Whether you're journaling through a chapter or capturing a flash of insight, your notes are always here.",
    tooltipPosition: "center",
  },
  {
    id: "notes-quick",
    title: "Quick Notes",
    description: "Jot down fast thoughts that sync across devices — online or offline.",
    narration: "Quick Notes let you jot down fast thoughts anytime. They sync automatically when you're online, and they even work offline so you never lose an idea. Think of them as your digital sticky notes for Bible study.",
    tooltipPosition: "bottom",
  },
  {
    id: "notes-verse",
    title: "Verse Notes",
    description: "Your annotations tied to specific Bible verses — organized by book.",
    narration: "Verse Notes are your annotations tied to specific Bible passages. When you write a note on a verse in the Study Bible tab, it appears here organized by book. Click any note to jump straight back to that verse in context.",
    tooltipPosition: "bottom",
  },
  {
    id: "notes-sync",
    title: "Cloud Sync",
    description: "Your notes sync to the cloud automatically — available on any device.",
    narration: "Notice the sync indicator at the top — it tells you whether your notes are syncing to the cloud or saved locally. When you're online, everything is backed up automatically so you can access your notes from any device.",
    tooltipPosition: "bottom",
  },
  {
    id: "notes-organize",
    title: "Organize & Navigate",
    description: "Browse notes by type, delete old ones, or jump to the verse they reference.",
    narration: "Use the tabs to switch between Quick Notes and Verse Notes. You can delete notes you no longer need, or click the link icon to jump straight to the verse in the Study Bible. That's your Notes — capture every insight before it fades!",
    tooltipPosition: "bottom",
  },
];

export const ACHIEVEMENTS_TOUR: GuidedTourStep[] = [
  {
    id: "achievements-welcome",
    title: "Welcome to Achievements",
    description: "Unlock badges and track your mastery of Phototheology.",
    narration: "Hello! Welcome to the Achievements gallery. Here you can see every badge available in the platform, track which ones you've unlocked, and discover what it takes to earn the rest. Let me walk you through it.",
    tooltipPosition: "center",
  },
  {
    id: "achievements-progress",
    title: "Your Progress",
    description: "See how many achievements you've unlocked, your total points, and completion percentage.",
    narration: "At the top you'll see your achievement stats — how many you've unlocked out of the total, your accumulated points, and your overall completion percentage. These stats reflect your journey through the entire Phototheology system.",
    tooltipPosition: "bottom",
  },
  {
    id: "achievements-categories",
    title: "Browse by Category",
    description: "Filter achievements by category — rooms, drills, streaks, challenges, and more.",
    narration: "Use the category filter to browse achievements by type — Palace rooms, study drills, reading streaks, challenges, and special milestones. Each category has its own set of badges to earn.",
    tooltipPosition: "bottom",
  },
  {
    id: "achievements-roadmap",
    title: "Achievement Roadmap",
    description: "Switch to roadmap view to see the path ahead — what to unlock next.",
    narration: "Switch to the Roadmap tab for a visual journey of your progress. It shows which achievements are next in line and what requirements you need to meet. Think of it as your trail map through the Palace.",
    tooltipPosition: "bottom",
  },
  {
    id: "achievements-share",
    title: "Share & Certificates",
    description: "Share your achievements and generate certificates for major milestones.",
    narration: "When you unlock a major achievement, you can share it with your community or generate a certificate to commemorate the milestone. It's a wonderful way to celebrate your growth. That's the Achievements tab — keep climbing!",
    tooltipPosition: "bottom",
  },
];

export const FEEDBACK_TOUR: GuidedTourStep[] = [
  {
    id: "feedback-welcome",
    title: "Welcome to Feedback",
    description: "Share your ideas, report bugs, and help shape the future of Phototheology.",
    narration: "Hello! Welcome to the Feedback page. This is where your voice matters most. Whether you've found a bug, have an idea for a new feature, or want to suggest an improvement — this is the place to share it. Let me walk you through it.",
    tooltipPosition: "center",
  },
  {
    id: "feedback-category",
    title: "Choose a Category",
    description: "Select whether you're reporting a bug, requesting a feature, or suggesting an improvement.",
    narration: "Start by selecting a category. Choose Bug Report if something isn't working right, Feature Request if you have an idea for something new, or Improvement if you'd like an existing feature to work better.",
    tooltipPosition: "bottom",
  },
  {
    id: "feedback-form",
    title: "Describe Your Idea",
    description: "Give your feedback a clear title and detailed description so we can act on it.",
    narration: "Give your feedback a clear, descriptive title and then write out the details. The more specific you are, the faster we can act on it. Screenshots and step-by-step descriptions are especially helpful for bug reports.",
    tooltipPosition: "bottom",
  },
  {
    id: "feedback-submit",
    title: "Submit & Track",
    description: "Once submitted, your feedback goes directly to the development team.",
    narration: "When you're ready, hit submit. Your feedback goes directly to the development team and helps prioritize what gets built next. Every submission matters — you're helping shape the future of Phototheology!",
    tooltipPosition: "bottom",
  },
  {
    id: "feedback-community",
    title: "Community Driven",
    description: "The best features in Phototheology started as user feedback — keep sharing!",
    narration: "Many of the best features in Phototheology started as user feedback just like yours. So don't hold back — your insights, frustrations, and dreams for the platform are invaluable. That's the Feedback page — speak up and help us grow!",
    tooltipPosition: "bottom",
  },
];

export const CULTURE_CONTROVERSY_TOUR: GuidedTourStep[] = [
  {
    id: "cc-welcome",
    title: "Welcome to Culture & Controversy",
    description: "Explore hot-button cultural topics through the lens of Scripture and Phototheology.",
    narration: "Hello! Welcome to Culture and Controversy. This is where faith meets the real world. You can explore any hot-button cultural topic — from politics to technology to social issues — and receive a thoughtful, Scripture-grounded analysis powered by Jeeves.",
    tooltipPosition: "center",
  },
  {
    id: "cc-quick-topics",
    title: "Quick Topics",
    description: "Choose from pre-loaded controversial topics or type your own.",
    narration: "Start with one of the pre-loaded topics — these cover some of the most debated issues of our time. Each one is designed to provoke thoughtful reflection, not knee-jerk reactions. Or type your own topic in the search bar.",
    tooltipPosition: "bottom",
  },
  {
    id: "cc-analysis",
    title: "AI-Powered Analysis",
    description: "Jeeves delivers a balanced, Scripture-rooted analysis with multiple perspectives.",
    narration: "When you submit a topic, Jeeves generates a comprehensive analysis. It presents multiple perspectives — biblical, historical, and cultural — while always grounding the discussion in Scripture and Phototheology principles.",
    tooltipPosition: "bottom",
  },
  {
    id: "cc-audio",
    title: "Listen to the Analysis",
    description: "Convert any analysis to audio and listen on the go.",
    narration: "Every analysis can be converted to audio so you can listen on the go. It's perfect for commutes, walks, or anytime you want to engage with difficult topics hands-free.",
    tooltipPosition: "bottom",
  },
  {
    id: "cc-apply",
    title: "Think Biblically",
    description: "Use these analyses for personal reflection, sermon prep, or small group discussions.",
    narration: "The goal isn't to give you pre-packaged answers — it's to train you to think biblically about complex issues. Use these analyses for personal reflection, sermon preparation, or to spark meaningful small group conversations. That's Culture and Controversy — engage with courage!",
    tooltipPosition: "bottom",
  },
];

export const BIBLE_LEXICON_TOUR: GuidedTourStep[] = [
  {
    id: "lexicon-welcome",
    title: "Welcome to the Bible Lexicon",
    description: "Study Hebrew and Greek words with definitions, semantic ranges, and usage data.",
    narration: "Hello! Welcome to the Bible Lexicon. This is your word-study laboratory — where you can dig into the original Hebrew and Greek behind every English translation. Whether you're a language student or just curious, this tool makes the original languages accessible.",
    tooltipPosition: "center",
  },
  {
    id: "lexicon-search",
    title: "Search Any Word",
    description: "Look up by Strong's number, English word, or original Hebrew/Greek.",
    narration: "Type any word into the search bar — you can use a Strong's number like H2713, an English word like 'love' or 'covenant', or even original Hebrew and Greek terms like 'agape' or 'shalom'. The lexicon will find the right entry.",
    tooltipPosition: "bottom",
  },
  {
    id: "lexicon-definition",
    title: "Full Definitions",
    description: "See transliterations, part of speech, and extended definitions for every word.",
    narration: "Each entry shows the original word, its transliteration, part of speech, and both a concise and extended definition. This gives you the full picture of what the word meant in its original context.",
    tooltipPosition: "bottom",
  },
  {
    id: "lexicon-semantic",
    title: "Semantic Range",
    description: "Discover all the ways a word is translated and used across Scripture.",
    narration: "The semantic range tab reveals all the different ways a single word is translated across the Bible. You'll see usage percentages and example verses for each meaning — essential for understanding the full breadth of a word.",
    tooltipPosition: "bottom",
  },
  {
    id: "lexicon-related",
    title: "Related Words & Verses",
    description: "Explore word families and key verses where each word appears.",
    narration: "Finally, explore related words — the word family tree — and key verses where the word appears most significantly. This connects your word study to the broader landscape of Scripture. That's the Bible Lexicon — dig deep into the language of God!",
    tooltipPosition: "bottom",
  },
];

export const RESEARCH_ASSISTANT_TOUR: GuidedTourStep[] = [
  {
    id: "research-welcome",
    title: "Welcome to the Research Assistant",
    description: "Your AI-powered biblical research companion for deep study sessions.",
    narration: "Hello! Welcome to the Research Assistant. This is your AI-powered study companion for deep biblical research. Whether you're preparing a sermon, writing a paper, or just diving deep into a topic, the Research Assistant helps you explore Scripture systematically.",
    tooltipPosition: "center",
  },
  {
    id: "research-query",
    title: "Ask Any Question",
    description: "Type a research question or topic and Jeeves will conduct thorough biblical research.",
    narration: "Start by typing any research question or topic. Jeeves will conduct a thorough investigation — pulling from Scripture, cross-references, historical context, and Phototheology principles to build a comprehensive answer.",
    tooltipPosition: "bottom",
  },
  {
    id: "research-results",
    title: "Structured Results",
    description: "Results are organized with scripture references, context, and practical applications.",
    narration: "Your research results come back beautifully structured — with scripture references, historical and cultural context, theological analysis, and practical applications. It's like having a seminary library at your fingertips.",
    tooltipPosition: "bottom",
  },
  {
    id: "research-save",
    title: "Save & Resume",
    description: "Save your research sessions and resume them later — your work is never lost.",
    narration: "Every research session is saved automatically. You can come back later and resume exactly where you left off. Your research history builds over time into a personal theological library.",
    tooltipPosition: "bottom",
  },
  {
    id: "research-connect",
    title: "Connect to Your Study",
    description: "Use research findings in sermons, Bible studies, and personal devotions.",
    narration: "The real power is in connection. Take your research findings and feed them into sermons, Bible study series, or personal devotions. The Research Assistant doesn't replace your thinking — it amplifies it. That's your Research Assistant — study smarter!",
    tooltipPosition: "bottom",
  },
];

export const BIBLE_IMAGE_LIBRARY_TOUR: GuidedTourStep[] = [
  {
    id: "imagelib-welcome",
    title: "Welcome to the Bible Image Library",
    description: "Generate, collect, and organize AI-created biblical artwork.",
    narration: "Hello! Welcome to the Bible Image Library. This is your gallery of AI-generated biblical artwork — images created from Scripture passages, palace rooms, and your own descriptions. Let me show you how to use it.",
    tooltipPosition: "center",
  },
  {
    id: "imagelib-generate",
    title: "Generate New Images",
    description: "Describe a scene or enter a verse reference and Jeeves will create original artwork.",
    narration: "To create a new image, enter a description or a verse reference. Jeeves will generate original artwork that captures the scene. You can choose between Translation Room style — turning verses into visual representations — or 24FPS style for chapter-by-chapter frames.",
    tooltipPosition: "bottom",
  },
  {
    id: "imagelib-browse",
    title: "Browse Your Collection",
    description: "View all your images, filter by type, search by description, or browse by book.",
    narration: "Browse your collection using the tabs — view all images, filter by favorites, browse by Bible book, or explore the Genesis Pack with pre-generated frames for every chapter. Use the search bar to find specific images by description or verse.",
    tooltipPosition: "bottom",
  },
  {
    id: "imagelib-favorites",
    title: "Favorites & Organization",
    description: "Mark images as favorites, make them public, or delete ones you don't need.",
    narration: "Click the heart icon to favorite an image for quick access. You can also toggle images to public so other users can see them, or delete images you no longer need. Your library grows with your study journey.",
    tooltipPosition: "bottom",
  },
  {
    id: "imagelib-share",
    title: "Download & Share",
    description: "Download images for presentations, social media, or personal devotional use.",
    narration: "Every image can be downloaded for use in presentations, social media posts, or personal devotional material. You can also ask Jeeves to refine or regenerate images until they're exactly right. That's the Bible Image Library — see the Word come alive!",
    tooltipPosition: "bottom",
  },
];

export const SPIRITUAL_TRAINING_TOUR: GuidedTourStep[] = [
  {
    id: "spiritual-welcome",
    title: "Welcome to Spiritual Training",
    description: "Train your spirit like a warrior trains for battle — daily disciplines, combat arenas, and character growth.",
    narration: "Hello! Welcome to the Spiritual Training Dojo. This is where you build spiritual muscle through daily disciplines, combat scenarios, and character tracking. Let me show you what's here.",
    tooltipPosition: "center",
  },
  {
    id: "spiritual-encouragement",
    title: "Daily Victory Thought",
    description: "Start each session with an AI-generated encouragement drawn from Scripture.",
    narration: "At the top you'll find the Daily Victory Thought — an AI-generated encouragement pulled from Scripture to fuel your spirit before training begins. Tap the button to generate a fresh word for today.",
    tooltipPosition: "bottom",
  },
  {
    id: "spiritual-weapons",
    title: "Spiritual Weapons & Combat",
    description: "Learn to apply spiritual weapons to real-life situations using the Armor of God.",
    narration: "The Spiritual Weapons section lets you select a piece of the Armor of God and apply it to a real-life situation. The AI will coach you on how to wield that weapon effectively — turning doctrine into daily practice.",
    tooltipPosition: "bottom",
  },
  {
    id: "spiritual-lessons",
    title: "Dojo Lessons & Challenges",
    description: "Work through structured lessons on spiritual warfare, character building, and the Art of War.",
    narration: "Explore the Dojo Lessons — structured training modules covering spiritual warfare, the Art of War applied to Scripture, and character-building challenges. Complete them to track your warrior progress.",
    tooltipPosition: "bottom",
  },
  {
    id: "spiritual-mastery",
    title: "Character & Combat Arena",
    description: "Track your Fruit of the Spirit growth and test yourself in the Combat Arena.",
    narration: "Finally, track your Fruit of the Spirit growth with the Character Tracker, and test yourself in the Combat Arena with real-life scenario challenges. This is where knowledge becomes transformation. That's Spiritual Training — now go train!",
    tooltipPosition: "bottom",
  },
];

export const VIDEO_TRAINING_TOUR: GuidedTourStep[] = [
  {
    id: "video-welcome",
    title: "Welcome to Video Training",
    description: "Watch step-by-step video tutorials on how to use every feature of Phototheology.",
    narration: "Hello! Welcome to Video Training. This is your library of step-by-step video tutorials showing you how to use every feature of the Phototheology platform. Let me walk you through it.",
    tooltipPosition: "center",
  },
  {
    id: "video-categories",
    title: "Browse by Category",
    description: "Filter videos by category — general tutorials, Palace methods, advanced techniques, and more.",
    narration: "Use the category tabs to filter videos by topic — whether you're looking for general tutorials, Palace methodology, advanced techniques, or specific feature walkthroughs. Everything is organized for quick access.",
    tooltipPosition: "bottom",
  },
  {
    id: "video-player",
    title: "Watch & Learn",
    description: "Click any video to play it. Each tutorial walks you through the feature with clear, visual instructions.",
    narration: "Click any video card to open the player. Each tutorial walks you through the feature with clear, visual instructions. You can watch at your own pace and replay sections as needed.",
    tooltipPosition: "bottom",
  },
  {
    id: "video-share",
    title: "Share Tutorials",
    description: "Share helpful tutorials with friends or your church community.",
    narration: "Found a tutorial that helped you? Use the share button to send it to friends, post it in your church community, or bookmark it for later. Sharing knowledge multiplies impact.",
    tooltipPosition: "bottom",
  },
  {
    id: "video-admin",
    title: "Admin Uploads",
    description: "Video admins can upload new tutorials directly from this page.",
    narration: "If you're a video admin, you can upload new tutorials directly from this page — add a title, description, category, and video file. That's Video Training — learn visually, grow practically!",
    tooltipPosition: "bottom",
  },
];

export const COMMUNITY_TOUR: GuidedTourStep[] = [
  {
    id: "community-welcome",
    title: "Welcome to the Palace Lounge",
    description: "A community space where iron sharpens iron — share insights, ask questions, and encourage one another.",
    narration: "Hello! Welcome to the Palace Lounge — the community hub where believers sharpen one another. Here you can share insights, ask questions, post prayer requests, and encourage each other on the journey. Let me show you around.",
    tooltipPosition: "center",
  },
  {
    id: "community-post",
    title: "Create a Post",
    description: "Share a study insight, question, or prayer request with the community.",
    narration: "Use the Quick Post bar or the Create Post button to share something — whether it's a study insight, a theological question, a prayer request, or a testimony. Choose a category and add tags to help others find your post.",
    tooltipPosition: "bottom",
  },
  {
    id: "community-interact",
    title: "Like, Comment & Reply",
    description: "Engage with posts through likes, comments, and threaded replies.",
    narration: "Engage with the community by liking posts, leaving comments, and replying to specific threads. The more you interact, the richer the conversation becomes. You can also edit or delete your own posts and comments.",
    tooltipPosition: "bottom",
  },
  {
    id: "community-filter",
    title: "Sort & Filter",
    description: "Sort by latest, trending, or needs feedback. Filter by category to find what matters most.",
    narration: "Use the sort options to view posts by latest, most commented, trending, or those that need feedback. Filter by category — general discussion, prayer, study questions — to find exactly what you're looking for.",
    tooltipPosition: "bottom",
  },
  {
    id: "community-spotlight",
    title: "Weekly Spotlight & Challenges",
    description: "Check the weekly spotlight and daily challenges to stay engaged.",
    narration: "Keep an eye on the Weekly Spotlight for featured posts and the Daily Challenge banner for community-wide activities. The Palace Lounge is more than a forum — it's your family of scholars. Welcome home!",
    tooltipPosition: "bottom",
  },
];

export const LIVING_MANNA_TOUR: GuidedTourStep[] = [
  {
    id: "manna-welcome",
    title: "Welcome to Living Manna",
    description: "Your church's discipleship hub — connecting members through study, worship, and community.",
    narration: "Hello! Welcome to Living Manna — your church's discipleship home base. This is where your congregation connects for study, worship, small groups, and spiritual growth. Let me show you what's available.",
    tooltipPosition: "center",
  },
  {
    id: "manna-home",
    title: "Member Home",
    description: "See announcements, upcoming events, and your church's activity at a glance.",
    narration: "The Home tab gives you a snapshot of your church community — announcements, upcoming events, and recent activity. It's your church bulletin board, always up to date.",
    tooltipPosition: "bottom",
  },
  {
    id: "manna-learn",
    title: "Learn & Grow Tabs",
    description: "Access Bible studies, devotionals, small groups, and spiritual growth resources.",
    narration: "The Learn and Grow tabs provide access to church Bible studies, weekly devotionals, small group discussions, and spiritual growth resources. Everything your church needs for discipleship is organized right here.",
    tooltipPosition: "bottom",
  },
  {
    id: "manna-connect",
    title: "Connect & Serve",
    description: "Chat with members, join small groups, find serving opportunities, and support your church.",
    narration: "Use the Connect tab for church chat rooms and direct messaging. The Serve tab shows ministry opportunities, and the Giving tab makes it easy to support your church financially. Community is at the heart of Living Manna.",
    tooltipPosition: "bottom",
  },
  {
    id: "manna-baptism",
    title: "Baptism Track & More",
    description: "Track baptism candidates, access youth spaces, and explore the full church platform.",
    narration: "Living Manna also includes a Baptism Track for preparing candidates, a Youth Space for younger members, and specialized ministry tools. It's a complete church platform — all in one place. Welcome to your church family!",
    tooltipPosition: "bottom",
  },
];

export const BIBLE_REFERENCE_TOUR: GuidedTourStep[] = [
  {
    id: "bibleref-welcome",
    title: "Welcome to the PT Codebook",
    description: "The complete Phototheology reference manual — all principles, cycles, symbols, and memory tools in one place.",
    narration: "Hello! Welcome to the Phototheology Codebook — your complete reference manual for the entire system. All eight floors, all cycles, all symbols, and all memory tools are documented right here. Let me walk you through it.",
    tooltipPosition: "center",
  },
  {
    id: "bibleref-principles",
    title: "PT Principles",
    description: "Browse all eight floors of the Palace with every room, its code, and its purpose.",
    narration: "The PT Principles tab lays out all eight floors of the Palace. Each floor lists its rooms with their codes and purposes. You can also see the Five Ascensions and Four Expansions — the framework that ties everything together.",
    tooltipPosition: "bottom",
  },
  {
    id: "bibleref-cycles",
    title: "Cycles & Heavens",
    description: "Explore the eight redemptive cycles and three heavens that map salvation history.",
    narration: "The Cycles and Heavens tab maps the eight great cycles of redemption — from Adam to the Remnant — and the Three Heavens framework showing the Day of the Lord patterns. This is the cosmic stage of Phototheology.",
    tooltipPosition: "bottom",
  },
  {
    id: "bibleref-symbols",
    title: "Symbol Library",
    description: "A searchable library of biblical symbols, types, and their meanings.",
    narration: "The Symbol Library is a searchable catalog of biblical symbols and types — from lambs to mountains, from water to fire. Each entry shows its meaning and key Scripture references. It's your quick-reference decoder ring.",
    tooltipPosition: "bottom",
  },
  {
    id: "bibleref-memory",
    title: "Memory Tools",
    description: "Access mnemonic tools, room codes, and study aids to internalize the system.",
    narration: "Finally, the Memory Tools tab provides mnemonics, room codes, and study aids to help you internalize the entire Phototheology system. Use these tools until the Palace becomes reflexive — that's the goal of Floor Eight. That's the Codebook — your complete reference!",
    tooltipPosition: "bottom",
  },
];

export const DAILY_CHALLENGES_TOUR: GuidedTourStep[] = [
  {
    id: "challenges-welcome",
    title: "Welcome to Daily Challenges",
    description: "Sharpen your Phototheology skills with daily exercises that train every principle.",
    narration: "Hello! Welcome to Daily Challenges — your training ground for sharpening every Phototheology principle. Each day brings a fresh challenge designed to strengthen your biblical thinking. Let me show you how it works.",
    tooltipPosition: "center",
  },
  {
    id: "challenges-daily",
    title: "Today's Challenge",
    description: "Each day features a rotating challenge type — dimension drills, sanctuary maps, fruit checks, and more.",
    narration: "The Daily tab presents today's challenge. Challenges rotate through different types — dimension drills, sanctuary maps, Christ-chapter exercises, fruit checks, and more. Each one targets a specific Palace principle.",
    tooltipPosition: "bottom",
  },
  {
    id: "challenges-types",
    title: "Challenge Types",
    description: "Explore specialized challenges like Chef Recipe, Equation Decode, and 70 Questions.",
    narration: "Use the tabs to access specialized challenge types — Chef Recipe challenges for creative connections, Equation Decode for symbolic thinking, and the intense 70 Questions drill. Each type builds different biblical muscles.",
    tooltipPosition: "bottom",
  },
  {
    id: "challenges-archive",
    title: "Archive & Progress",
    description: "Review past submissions and track your challenge completion history.",
    narration: "The Archive tab stores all your past submissions so you can review your growth over time. Track which principles you've practiced and see how your biblical thinking has sharpened month by month.",
    tooltipPosition: "bottom",
  },
  {
    id: "challenges-community",
    title: "Community & Sharing",
    description: "Share your challenge completions and see what others are discovering.",
    narration: "Share your challenge completions with the community and see what others are discovering. The Community feed lets you learn from fellow scholars and get inspired by different approaches. That's Daily Challenges — train daily, grow exponentially!",
    tooltipPosition: "bottom",
  },
];

export const PROPHECY_WATCH_TOUR: GuidedTourStep[] = [
  {
    id: "prophecy-welcome",
    title: "Welcome to Prophecy Watch",
    description: "An evidence-driven watchtower tracking prophetic developments in real-time.",
    narration: "Hello! Welcome to Prophecy Watch — your evidence-driven watchtower for tracking prophetic developments through a disciplined biblical lens. This tool connects current events to prophetic timelines. Let me walk you through it.",
    tooltipPosition: "center",
  },
  {
    id: "prophecy-query",
    title: "Run a Watch Query",
    description: "Enter a topic or current event and let Jeeves analyze it through prophetic frameworks.",
    narration: "Enter a topic, headline, or current event into the query box. Select a focus area — church-state relations, religious liberty, economic coercion, or any of the prophetic signal categories. Then let Jeeves analyze it through the lens of biblical prophecy.",
    tooltipPosition: "bottom",
  },
  {
    id: "prophecy-signals",
    title: "Signal Categories",
    description: "Track developments across categories like Christian Nationalism, Sunday laws, and religious liberty.",
    narration: "Prophecy Watch tracks developments across specific signal categories — from church-state dynamics to Sunday legislation trajectories. Each signal is rated by intensity and mapped to prophetic anchors in Daniel and Revelation.",
    tooltipPosition: "bottom",
  },
  {
    id: "prophecy-link",
    title: "Analyze Articles",
    description: "Paste a news article URL for instant prophetic analysis and biblical context.",
    narration: "You can also paste a news article URL for instant analysis. Jeeves will extract the key claims, map them to prophetic signals, provide counter-reads for balanced thinking, and suggest mission implications.",
    tooltipPosition: "bottom",
  },
  {
    id: "prophecy-results",
    title: "Analysis Results",
    description: "Get structured analysis with evidence, prophetic anchors, and mission implications.",
    narration: "Results include structured analysis with evidence citations, prophetic anchor verses, confidence ratings, and actionable mission implications. Think of it as your prophetic intelligence briefing. That's Prophecy Watch — eyes open, Bible ready!",
    tooltipPosition: "bottom",
  },
];

export const BIBLE_TIMELINE_TOUR: GuidedTourStep[] = [
  {
    id: "timeline-welcome",
    title: "Welcome to Bible Timeline",
    description: "Explore the chronological sweep of Scripture from Creation to the New Earth.",
    narration: "Hello! Welcome to the Bible Timeline — a chronological journey through Scripture from Creation to the New Earth. Every major event is mapped to its era, cycle, and heaven. Let me show you how to navigate it.",
    tooltipPosition: "center",
  },
  {
    id: "timeline-eras",
    title: "Filter by Era",
    description: "Filter events by era — Patriarchs, Exodus, Kingdom, Exile, and more.",
    narration: "Use the era badges to filter events by period — Creation and Patriarchs, Exodus and Conquest, Kingdom Era, Exile and Return, and the New Testament age. Each era is color-coded for quick visual reference.",
    tooltipPosition: "bottom",
  },
  {
    id: "timeline-events",
    title: "Explore Events",
    description: "Each event includes dates, descriptions, Scripture references, and PT cycle placement.",
    narration: "Click any event to see its full details — approximate dates, descriptions, Scripture references, and its placement within the Phototheology cycles and heavens. This connects history to theology in a single view.",
    tooltipPosition: "bottom",
  },
  {
    id: "timeline-search",
    title: "Search Events",
    description: "Use the search bar to find specific events, people, or locations in the timeline.",
    narration: "The search bar lets you quickly find specific events, people, or locations. Type a name like Moses or a place like Babylon and the timeline filters instantly. That's the Bible Timeline — history made visible!",
    tooltipPosition: "bottom",
  },
];

export const BIBLE_ATLAS_TOUR: GuidedTourStep[] = [
  {
    id: "atlas-welcome",
    title: "Welcome to Bible Atlas",
    description: "Explore key locations from Scripture — cities, mountains, rivers, and regions.",
    narration: "Hello! Welcome to the Bible Atlas — your geographic guide to Scripture. Explore the cities, mountains, rivers, and regions where biblical history unfolded. Let me show you around.",
    tooltipPosition: "center",
  },
  {
    id: "atlas-categories",
    title: "Filter by Category",
    description: "Browse locations by type — cities, mountains, bodies of water, or regions.",
    narration: "Filter locations by category — cities like Jerusalem and Babylon, mountains like Sinai and Moriah, bodies of water like the Jordan and Red Sea, or regions like Galilee and Judea. Each category has its own icon.",
    tooltipPosition: "bottom",
  },
  {
    id: "atlas-details",
    title: "Location Details",
    description: "Each location includes modern names, descriptions, Scripture references, and key events.",
    narration: "Click any location to see its modern name, a rich description, Scripture references, and the key events that happened there. This connects geography to theology — knowing where helps you understand why.",
    tooltipPosition: "bottom",
  },
  {
    id: "atlas-search",
    title: "Search Locations",
    description: "Quickly find any biblical location using the search bar.",
    narration: "Use the search bar to find any location instantly. Whether you're preparing a sermon or studying a passage, the Atlas puts biblical geography at your fingertips. That's the Bible Atlas — walk where they walked!",
    tooltipPosition: "bottom",
  },
];

export const MUSIC_TOUR: GuidedTourStep[] = [
  {
    id: "music-welcome",
    title: "Welcome to the Music Room",
    description: "Set the atmosphere for your study with curated ambient music and worship tracks.",
    narration: "Hello! Welcome to the Music Room — your soundtrack for study and devotion. Choose from curated ambient categories to set the perfect atmosphere while you explore the Palace. Let me show you what's here.",
    tooltipPosition: "center",
  },
  {
    id: "music-categories",
    title: "Music Categories",
    description: "Browse categories like Worship, Ambient, Focus, and more to find your study soundtrack.",
    narration: "Browse through music categories — worship, ambient, focus, prayer, and more. Each category is curated to complement different study moods and activities within the Phototheology system.",
    tooltipPosition: "bottom",
  },
  {
    id: "music-controls",
    title: "Volume & Playback",
    description: "Control volume, mute, and select tracks. Music auto-ducks when narration plays.",
    narration: "Use the volume slider to set your preferred level. The music automatically ducks when narration or commentary plays, so your study audio is never competing. Toggle mute for quick silence. That's the Music Room — study in atmosphere!",
    tooltipPosition: "bottom",
  },
];

export const SOURCE_LIBRARY_TOUR: GuidedTourStep[] = [
  {
    id: "source-welcome",
    title: "Welcome to Source Library",
    description: "Upload and manage study documents — PDFs, Word docs, and more.",
    narration: "Hello! Welcome to the Source Library — your personal document vault for study materials. Upload PDFs, Word documents, PowerPoint files, and text files to build your research collection. Let me walk you through it.",
    tooltipPosition: "center",
  },
  {
    id: "source-upload",
    title: "Upload Documents",
    description: "Drag and drop or browse to upload study materials in multiple formats.",
    narration: "Upload documents by dragging and dropping or browsing your files. The library supports PDF, DOCX, PPTX, and TXT formats. Each upload is automatically categorized and searchable.",
    tooltipPosition: "bottom",
  },
  {
    id: "source-browse",
    title: "Browse & Filter",
    description: "Search, filter by type, and organize your documents with favorites.",
    narration: "Browse your collection with search and type filters. Mark important documents as favorites for quick access. Switch between grid and list views to find what you need.",
    tooltipPosition: "bottom",
  },
  {
    id: "source-actions",
    title: "Generate From Sources",
    description: "Turn uploaded documents into infographics, study series, and more.",
    narration: "The real power is in generation — turn any uploaded document into an infographic or a full Bible study series. Your sources become the raw material for teaching and sharing. That's the Source Library — your research foundation!",
    tooltipPosition: "bottom",
  },
];

export const FLASHCARDS_TOUR: GuidedTourStep[] = [
  {
    id: "flashcards-welcome",
    title: "Welcome to Flashcards",
    description: "Create, study, and share flashcard sets for Scripture memorization and doctrine review.",
    narration: "Hello! Welcome to Flashcards — your tool for Scripture memorization and doctrine review. Create custom sets, generate them with AI, or study community-shared decks. Let me show you how it works.",
    tooltipPosition: "center",
  },
  {
    id: "flashcards-create",
    title: "Create & Generate",
    description: "Build flashcard sets manually or use AI to generate them from any topic or passage.",
    narration: "Create flashcard sets manually by adding your own cards, or let AI generate a complete set from any topic, passage, or doctrine. AI-generated cards include verse references and contextual explanations.",
    tooltipPosition: "bottom",
  },
  {
    id: "flashcards-study",
    title: "Study Mode",
    description: "Flip through cards, track progress, and choose your preferred Bible translation.",
    narration: "Enter Study Mode to flip through your cards one by one. Track your progress, choose your preferred Bible translation, and pick up right where you left off with session persistence.",
    tooltipPosition: "bottom",
  },
  {
    id: "flashcards-community",
    title: "Public Sets",
    description: "Browse and study flashcard sets shared by the community.",
    narration: "The Public tab lets you browse flashcard sets shared by other users. Find sets on topics you're studying and add them to your collection. That's Flashcards — memorize Scripture, master doctrine!",
    tooltipPosition: "bottom",
  },
];

export const GIVE_ME_A_GEM_TOUR: GuidedTourStep[] = [
  {
    id: "gem-welcome",
    title: "Welcome to Give Me a Gem",
    description: "Discover powerful biblical insights — each one a treasure from the Gems Room of the Palace.",
    narration: "Hello! Welcome to Give Me a Gem — your portal to the Gems Room of the Phototheology Palace. Each gem is a powerful biblical insight crafted by Jeeves, ready to enrich your study and teaching. Let me show you how it works.",
    tooltipPosition: "center",
  },
  {
    id: "gem-styles",
    title: "Choose Your Style",
    description: "Select from multiple gem styles — theological, devotional, prophetic, apologetic, and more.",
    narration: "Choose a gem style that matches your mood or study focus — theological depth, devotional warmth, prophetic insight, apologetic sharpness, or let it be random for a surprise. You can also specify a passage to focus on.",
    tooltipPosition: "bottom",
  },
  {
    id: "gem-interact",
    title: "Interact & Expand",
    description: "Highlight text to ask follow-up questions. Jeeves will expound on any part of the gem.",
    narration: "Once your gem appears, highlight any text to ask Jeeves follow-up questions. Use the quick question buttons or type your own. Each expansion digs deeper, turning one gem into an entire study session.",
    tooltipPosition: "bottom",
  },
  {
    id: "gem-save",
    title: "Save & Collect",
    description: "Save gems to your collection and track your Gem Warrior rank.",
    narration: "Save gems to your personal collection and watch your Gem Warrior rank grow. The more gems you collect and interact with, the higher you climb. That's Give Me a Gem — mine the Word for treasure!",
    tooltipPosition: "bottom",
  },
];

export const QUARTERLY_STUDY_TOUR: GuidedTourStep[] = [
  {
    id: "quarterly-welcome",
    title: "Welcome to Quarterly Study",
    description: "Study the Sabbath School quarterly lesson with Jeeves as your Phototheology guide.",
    narration: "Hello! Welcome to Quarterly Study — where the weekly Sabbath School lesson meets the power of Phototheology. Jeeves analyzes each lesson through Palace principles, cycles, and heavens. Let me show you how to use it.",
    tooltipPosition: "center",
  },
  {
    id: "quarterly-lessons",
    title: "Select a Lesson",
    description: "Browse the current quarter's lessons and select any day to study.",
    narration: "Browse the current quarter's lessons in the sidebar. Each lesson is broken into daily sections. Select a day to load its content, and the study textarea will automatically populate with the lesson material.",
    tooltipPosition: "bottom",
  },
  {
    id: "quarterly-analyze",
    title: "Jeeves Analysis",
    description: "Choose a Palace room or principle, then let Jeeves analyze the lesson through that lens.",
    narration: "Select a Palace room or principle from the dropdown, optionally add your own question, then hit Analyze. Jeeves will process the lesson through your chosen Phototheology lens — giving you insights no commentary can match.",
    tooltipPosition: "bottom",
  },
  {
    id: "quarterly-results",
    title: "Study Results",
    description: "Get rich, structured analysis with Christ-centered connections and practical applications.",
    narration: "The analysis results include Christ-centered connections, practical applications, and Palace principle mappings. You can run multiple analyses on the same lesson using different rooms for a comprehensive study. That's Quarterly Study — transform your Sabbath School experience!",
    tooltipPosition: "bottom",
  },
];
