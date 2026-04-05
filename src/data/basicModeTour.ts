import type { GuidedTourStep } from "@/components/guided-tour/GuidedTourOverlay";

export const BASIC_MODE_TOUR: GuidedTourStep[] = [
  {
    id: "welcome",
    title: "Welcome to Phototheology",
    description: "Reginald and Jeeves welcome you to your personal Bible study experience.",
    narration: "Good day! I'm Reginald, and alongside me is Jeeves. We're delighted to welcome you to PhototheologyOS — the operating system for biblical thinking. Before we show you around, let us tell you something important. This is not just another AI Bible app. Most AI tools give you generic, surface-level answers pulled from the internet. Jeeves is fundamentally different. Behind every answer he gives, there's a complete theological reasoning engine — a system of thirty-eight interconnected principles organized across eight floors of biblical study. It's called the Phototheology Palace, and it's the kernel that powers everything you see here. When you ask Jeeves a question, he doesn't just search the internet. He runs your question through layers of analysis — examining the literal meaning, the Christ connection, the personal application, the prophetic significance, and the patterns that link your verse to dozens of others across the entire Bible. He traces how passages relate to each other like members of a family — siblings, cousins, distant relatives — finding connections that most people, and most AIs, miss entirely. And he always, always brings it back to Jesus. Other AIs give you information. Jeeves gives you revelation. Let us show you what that looks like.",
    tooltipPosition: "center",
  },
  {
    id: "ask-jeeves",
    title: "Ask Jeeves — Your AI Bible Scholar",
    description: "Deep, multi-layered, Christ-centered answers powered by the Phototheology engine.",
    narration: "This is where you talk to Jeeves. Ask him anything — a character study, a verse explanation, how two passages connect, what a prophecy means, or how a story applies to your life today. Here's what makes Jeeves unlike any other AI on the planet. When you ask a question, Jeeves doesn't just look up an answer. He processes it through the Phototheology engine — a system of thirty-eight rooms that examine Scripture from every possible angle. He checks the original language definitions. He traces symbols and types. He maps your passage onto the sanctuary blueprint. He locates it in prophetic timelines and historical cycles. He tests it across five dimensions — literal, Christ-centered, personal, communal, and eternal. And then he synthesizes all of that into a clear, warm, insightful response. Because of this engine, Jeeves will never answer the same question the same way twice. Ask him about the Good Shepherd today and he might show you the sanctuary connection. Ask again tomorrow and he might trace the shepherd motif from Genesis to Revelation. The depth is inexhaustible because the system behind it is designed to see Scripture the way a master theologian does — from every angle, through every lens. Try it. Ask him something you've always wondered about. Ask him to explain a passage you think you already know. You'll be surprised at what he finds.",
    targetSelector: "[data-tour='tab-chat']",
    tooltipPosition: "bottom",
  },
  {
    id: "chat-features",
    title: "Save, Voice, and Sample Questions",
    description: "Save conversations, use voice input, and explore curated sample questions.",
    narration: "A few things to know about your conversations with Jeeves. First — you can save any chat. Tap the save button and your conversation is stored in your personal library, so you can return to insights anytime. You'll never lose a breakthrough again. Second — you can speak to Jeeves. Tap the microphone icon and ask your question by voice. It's perfect for when you're driving, walking, or just thinking out loud. Third — notice the sample questions at the top. These aren't random. They're carefully chosen to demonstrate the range of what the Phototheology engine can do. Questions like 'How can I find Christ in the Old Testament?' or 'What principles can help me study the Bible better?' — each one is designed to show you a different facet of Jeeves's capabilities. Think of them as doorways into the system. And one more thing — Jeeves isn't just a teacher. He's also a study buddy. He'll share his own insights, ask you questions back, suggest related topics to explore, and gently encourage you to dig deeper. He's not here to lecture — he's here to study with you.",
    targetSelector: "[data-tour='tab-chat']",
    tooltipPosition: "bottom",
  },
  {
    id: "study-bible",
    title: "Study Bible — Read, Listen, Explore",
    description: "Read any book and chapter with commentary and eight unique audio voices.",
    narration: "The Study Bible is your reading room. Open any book of the Bible, read any chapter, and access rich commentary that goes far deeper than a standard study Bible. But here's something no other app offers — eight distinct audio commentary voices, each powered by ElevenLabs premium voice technology. An Epic Narrator who makes Scripture feel cinematic. A Modern Preacher who brings fire and urgency. A Gentle Counselor for comfort and pastoral care. An Ancient voice for authoritative, timeless weight. A Scholar for analytical precision. A Kids voice for ages eight to twelve. And the Mirror voice — a unique perspective that turns the passage into a personal reflection, speaking directly to your life. Each voice illuminates the same passage from a completely different angle. It's like having eight different mentors guiding you through the Word — and all of them are grounded in the same Christ-centered Phototheology framework that powers Jeeves.",
    targetSelector: "[data-tour='tab-bible']",
    tooltipPosition: "bottom",
  },
  {
    id: "chapel",
    title: "The Chapel — Your Daily Spiritual Home",
    description: "Devotionals, watches, reading plans, community, and life resources.",
    narration: "The Chapel is where your daily spiritual rhythm lives. Start your morning with a Morning Watch — a short, focused devotional to set your heart for the day. Wind down with a Night Watch — a cinematic, reflective meditation before sleep. Follow structured reading plans that walk you through Scripture over days or months. Access Living Manna — daily bread for your soul. Connect with your church community. And when life gets hard, you'll find resources rooted in biblical wisdom — guidance for marriage, grief, mental health, and wellness. The Chapel also houses your prayer journal, your growth tracker, and your personal spiritual timeline. No other Bible app gives you this combination: deep theology, daily devotion, community, and life support — all in one place, all powered by the same Phototheology engine that makes Jeeves so uniquely insightful.",
    targetSelector: "[data-tour='tab-chapel']",
    tooltipPosition: "bottom",
  },
  {
    id: "level-switch",
    title: "Three Levels — Grow at Your Pace",
    description: "PhototheologyOS has three experience levels. You're on Level 1 — and it's already powerful.",
    narration: "Now, one last thing — and this is important. PhototheologyOS has three distinct experience levels, and you're currently on Level 1. Think of Level 1 as the guest house. Everything you need for powerful, transformative Bible study is right here — Jeeves, the Study Bible, the Chapel, all powered by the full Phototheology engine working behind the scenes. You don't need to see the engine to benefit from it. But when you're ready — and only when you're ready — there are two more levels waiting for you. Each one unlocks new tools, new capabilities, and new ways to engage with Scripture that you simply won't find anywhere else. There's no rush. No pressure. Many people stay on Level 1 for weeks or months and find it more than enough. The system grows with you, not ahead of you. When curiosity calls, just tap this chip right here and you can explore what's next. But for now? You're exactly where you need to be. You have access to an AI Bible scholar that thinks deeper than any other AI on the market. You have eight premium audio commentary voices. You have a complete devotional and study ecosystem. This isn't a demo — this is the real thing. Enjoy the journey. Jeeves and I are always here. God bless.",
    targetSelector: "[data-tour='level-chip']",
    tooltipPosition: "bottom",
  },
];
