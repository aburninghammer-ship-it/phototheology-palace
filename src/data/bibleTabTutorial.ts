export interface BibleTutorialStep {
  id: string;
  title: string;
  description: string;
  narration: string;
  targetSelector?: string;
  tooltipPosition: "center" | "bottom";
}

export const BIBLE_TAB_TUTORIAL: BibleTutorialStep[] = [
  {
    id: "welcome",
    title: "Welcome to the Phototheology Study Bible",
    description: "Let me walk you through everything this powerful Study Bible can do. Sit back — I'll guide you automatically.",
    narration: "Hello! Welcome to the Phototheology Study Bible. I'm Reginald, and I'll walk you through this tool step by step. Just relax — this tour advances automatically so you can sit back and listen.",
    tooltipPosition: "center",
  },
  {
    id: "at-a-glance",
    title: "At a Glance Sidebar",
    description: "The 'At a Glance' sidebar gives you a bird's-eye view of every book in the Bible. Quickly jump to any book and chapter from here.",
    narration: "On the left side you'll find the At a Glance sidebar. This gives you a bird's-eye view of every book in the Bible, organized by Old and New Testament. You can quickly jump to any book and chapter from here — it's your navigation home base.",
    targetSelector: "[data-tutorial='at-a-glance-btn']",
    tooltipPosition: "bottom",
  },
  {
    id: "bible-navigation",
    title: "Search, Navigate & Discover",
    description: "Use the navigation bar to search for verses, browse books, find themes, and look up events. It's your command center for Scripture exploration.",
    narration: "The navigation bar is your command center. You can search for specific verses, browse books and chapters, search by theme or event, and even use AI-powered verse discovery. Think of it as your Scripture search engine.",
    targetSelector: ".bible-navigation-area",
    tooltipPosition: "bottom",
  },
  {
    id: "bible-reader",
    title: "The Bible Reader",
    description: "This is where Scripture comes alive. Read chapters verse by verse, with rich study tools available on every verse.",
    narration: "The Bible Reader is the heart of the Study Bible. Here you read Scripture verse by verse. But it's much more than just reading — tap on any verse to unlock a world of study tools, commentary, and cross-references.",
    targetSelector: ".bible-reader-area",
    tooltipPosition: "bottom",
  },
  {
    id: "verse-tools",
    title: "Verse-Level Study Tools",
    description: "Tap any verse to access highlights, notes, bookmarks, Strong's definitions, chain references, AI commentary, and more.",
    narration: "When you tap on a verse, a rich toolbar appears. You can highlight verses in different colors, add personal notes, bookmark important passages, view Strong's Hebrew and Greek definitions, explore chain references, and even get AI-powered commentary — all without leaving the page.",
    targetSelector: ".bible-reader-area",
    tooltipPosition: "bottom",
  },
  {
    id: "study-modes",
    title: "Study Modes",
    description: "Switch between Beginner, Advanced, Apologetics, and Preacher Mentor modes to customize your study depth.",
    narration: "The Study Bible adapts to your level. Switch between Beginner mode for simple reading, Advanced mode for deep study tools, Apologetics mode for defending the faith, and Preacher Mentor mode for sermon preparation. Each mode surfaces the tools most relevant to your goal.",
    targetSelector: ".bible-reader-area",
    tooltipPosition: "bottom",
  },
  {
    id: "dimension-filter",
    title: "The 5 Dimensions Filter",
    description: "Filter verse insights by Phototheology's 5 Dimensions: Literal, Christ, Personal, Church, and Heaven.",
    narration: "One of the most powerful features is the 5 Dimensions filter. Based on the Phototheology method, you can view any passage through five lenses: Literal meaning, Christ-centered typology, Personal application, Church-wide significance, and Heavenly or prophetic fulfillment. This is the Dimensions Room of the Palace, built right into your Bible.",
    targetSelector: ".bible-reader-area",
    tooltipPosition: "bottom",
  },
  {
    id: "research-mode",
    title: "Research Mode",
    description: "Enter Research Mode for a multi-panel layout — read Scripture, commentary, and cross-references side by side.",
    narration: "For deep study sessions, activate Research Mode. This opens a multi-panel layout where you can read Scripture, view commentary, and explore cross-references side by side. It's like having multiple books open on your desk at once.",
    targetSelector: "[data-tutorial='research-mode-btn']",
    tooltipPosition: "bottom",
  },
  {
    id: "audio-features",
    title: "Audio Bible & Commentary",
    description: "Listen to the Bible read aloud with AI-generated commentary. Perfect for commutes, devotions, or accessibility.",
    narration: "Don't forget the Audio Bible and Commentary feature. You can listen to any chapter read aloud and hear AI-generated commentary narrated in a calm, scholarly voice. It's perfect for commutes, morning devotions, or anytime you want to study hands-free.",
    targetSelector: "[data-tutorial='audio-bible-btn']",
    tooltipPosition: "bottom",
  },
  {
    id: "memorization",
    title: "Memorization Verses",
    description: "Save verses to your memorization list and practice recalling them with built-in tools.",
    narration: "The Memorization Verses feature lets you save key passages to a personal list and practice recalling them. Scripture memory is the foundation of the Palace — the more you store, the richer your connections become.",
    targetSelector: "[data-tutorial='memorization-btn']",
    tooltipPosition: "bottom",
  },
  {
    id: "conclusion",
    title: "You're Ready to Study!",
    description: "That's the tour! Dive in and let the Phototheology Study Bible transform how you engage with God's Word.",
    narration: "And that's the tour! The Phototheology Study Bible is designed to make Scripture come alive — whether you're a beginner or a seasoned scholar. Every tool here connects back to the Palace method. Dive in, explore, and let God's Word transform you. Happy studying!",
    tooltipPosition: "center",
  },
];
