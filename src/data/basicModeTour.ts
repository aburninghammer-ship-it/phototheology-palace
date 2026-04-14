import type { GuidedTourStep } from "@/components/guided-tour/GuidedTourOverlay";

export const BASIC_MODE_TOUR: GuidedTourStep[] = [
  {
    id: "welcome",
    title: "Welcome to Phototheology",
    description: "Reginald and Jeeves welcome you to your personal Bible study experience.",
    narration: "Good day! I'm Reginald, and alongside me is Jeeves. We're delighted to welcome you to PhototheologyOS — the operating system for biblical thinking. This is not just another AI Bible app. Most AI tools give you generic, surface-level answers pulled from the internet. Jeeves is fundamentally different. Behind every answer he gives, there's a complete theological reasoning engine — a system of thirty-eight interconnected principles organized across eight floors of biblical study. It's called the Phototheology Palace, and it's the kernel that powers everything you see here. When you ask Jeeves a question, he doesn't just search the internet. He runs your question through layers of analysis — examining the literal meaning, the Christ connection, the personal application, the prophetic significance, and the patterns that link your verse to dozens of others across the entire Bible. Other AIs give you information. Jeeves gives you revelation. Let us show you what that looks like.",
    tooltipPosition: "center",
  },
  {
    id: "spaces",
    title: "Spaces — Your Home Dashboard",
    description: "Quick access to all your tools, featured content, and daily resources.",
    narration: "This is your home base — Spaces. Think of it as your personal command center. From here you can access every tool available to you, see what's new, and jump straight into study. You'll find hero cards for your most powerful tools — the Commentary Suite with eight unique audio voices, the Verse Breakdown engine, the Mind Map, and much more. Each card takes you directly into a deep, Christ-centered experience. Scroll down to discover categorized tool grids organized by how you like to study — whether that's reading, listening, analyzing, or creating. Everything is one tap away.",
    targetSelector: "[data-tour='tab-home']",
    tooltipPosition: "bottom",
  },
  {
    id: "ask-jeeves",
    title: "Ask Jeeves — Your AI Bible Scholar",
    description: "Deep, multi-layered, Christ-centered answers powered by the Phototheology engine.",
    narration: "This is where you talk to Jeeves. Ask him anything — a character study, a verse explanation, how two passages connect, what a prophecy means, or how a story applies to your life today. When you ask a question, Jeeves processes it through the Phototheology engine — a system of thirty-eight rooms that examine Scripture from every possible angle. He checks the original language definitions. He traces symbols and types. He maps your passage onto the sanctuary blueprint. He locates it in prophetic timelines and historical cycles. He tests it across five dimensions — literal, Christ-centered, personal, communal, and eternal. And then he synthesizes all of that into a clear, warm, insightful response. You can save conversations, use voice input, and explore curated sample questions designed to show you the full range of what the engine can do. Jeeves isn't just a teacher — he's a study buddy who shares insights, asks you questions back, and gently encourages you to dig deeper.",
    targetSelector: "[data-tour='tab-chat']",
    tooltipPosition: "bottom",
  },
  {
    id: "study-bible",
    title: "Study Bible — Read, Listen, Explore",
    description: "Read any book and chapter with commentary and eight unique audio voices.",
    narration: "The Study Bible is your reading room. Open any book of the Bible, read any chapter, and access rich commentary that goes far deeper than a standard study Bible. But here's something no other app offers — eight distinct audio commentary voices, each powered by ElevenLabs premium voice technology. An Epic Narrator who makes Scripture feel cinematic. A Modern Preacher who brings fire and urgency. A Gentle Counselor for comfort and pastoral care. An Ancient voice for authoritative, timeless weight. A Scholar for analytical precision. A Kids voice for ages eight to twelve. And the Mirror voice — a unique perspective that turns the passage into a personal reflection, speaking directly to your life. Each voice illuminates the same passage from a completely different angle. It's like having eight different mentors guiding you through the Word.",
    targetSelector: "[data-tour='tab-bible']",
    tooltipPosition: "bottom",
  },
  {
    id: "chapel",
    title: "The Chapel — Your Daily Spiritual Home",
    description: "Devotionals, watches, reading plans, community, and life resources.",
    narration: "The Chapel is where your daily spiritual rhythm lives. Start your morning with a Morning Watch — a short, focused devotional to set your heart for the day. Wind down with a Night Watch — a cinematic, reflective meditation before sleep. Follow structured reading plans that walk you through Scripture over days or months. Access Living Manna — daily bread for your soul. Connect with your church community. And when life gets hard, you'll find resources rooted in biblical wisdom — guidance for marriage, grief, mental health, and wellness. No other Bible app gives you this combination: deep theology, daily devotion, community, and life support — all in one place.",
    targetSelector: "[data-tour='tab-chapel']",
    tooltipPosition: "bottom",
  },
  {
    id: "study-experience",
    title: "Study Experience — Go Deeper",
    description: "Structured tools for verse analysis, mind mapping, image generation, and more.",
    narration: "The Study Experience tab is your workbench. Here you'll find structured tools designed to take your study to the next level — without needing to understand the full Phototheology system. Use the Verse Breakdown to peel back layers of any passage. Open the Mind Map to see how one verse connects to the entire Bible. Try the Image Bible to visualize Scripture in a whole new way. Explore the Encyclopedia for deep-dive topical studies. And use the Analyze My Thoughts tool to let Jeeves evaluate your own theological reflections. Each tool is powered by the same engine that makes Jeeves so uniquely insightful — you just interact with it in different ways.",
    targetSelector: "[data-tour='tab-study']",
    tooltipPosition: "bottom",
  },
  {
    id: "level-switch",
    title: "Two Levels — Grow at Your Pace",
    description: "You're on Learn mode — and it's already powerful. Study mode awaits when you're ready.",
    narration: "One last thing — and this is important. PhototheologyOS has two experience levels, and you're currently on Learn. Think of Learn mode as the guest house. Everything you need for powerful, transformative Bible study is right here — Jeeves, the Study Bible, the Chapel, the Study Experience — all powered by the full Phototheology engine working behind the scenes. You don't need to see the engine to benefit from it. But when you're ready — and only when you're ready — there's Study mode waiting for you. It unlocks the full Memory Palace, the Sermon Builder, Defense Mode, and advanced research tools that let you engage with Scripture at a seminary level. There's no rush. No pressure. Many people stay on Learn mode for weeks or months and find it more than enough. The system grows with you, not ahead of you. When curiosity calls, just tap this toggle right here. But for now? You're exactly where you need to be. Enjoy the journey. Jeeves and I are always here. God bless.",
    targetSelector: "[data-tour='level-chip']",
    tooltipPosition: "bottom",
  },
];
