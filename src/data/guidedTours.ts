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
