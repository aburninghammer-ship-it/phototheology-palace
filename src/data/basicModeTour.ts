import type { GuidedTourStep } from "@/components/guided-tour/GuidedTourOverlay";

export const BASIC_MODE_TOUR: GuidedTourStep[] = [
  {
    id: "welcome",
    title: "Welcome to Phototheology",
    description: "Reginald and Jeeves welcome you to your personal Bible study experience.",
    narration: "Good day! I'm Reginald, and alongside me is Jeeves. We're delighted to welcome you. This is your personal Bible study suite — designed to help you explore Scripture deeply, hear God's Word come alive, and grow spiritually every single day. Everything here is built to make Bible study rich, meaningful, and enjoyable — whether you have five minutes or five hours. Let us show you what you can do.",
    tooltipPosition: "center",
  },
  {
    id: "ask-jeeves",
    title: "Ask Jeeves — Your Bible Companion",
    description: "Ask any Bible question and receive a rich, Christ-centered answer.",
    narration: "This is where you talk to Jeeves. You can ask him anything about the Bible — a character study, a verse explanation, a tough theological question, how two passages connect, or even what a story means for your life today. Jeeves doesn't give shallow answers. He digs deep, finds the threads that run through Scripture, and always brings it back to Christ. Think of him as a wise study partner who never gets tired and always has something profound to share. Just type your question and let him work.",
    targetSelector: "[data-tour='tab-chat']",
    tooltipPosition: "bottom",
  },
  {
    id: "study-bible",
    title: "Study Bible — Read, Listen, Explore",
    description: "Read any book and chapter with commentary and eight unique audio voices.",
    narration: "The Study Bible is your reading room. Open any book of the Bible, read any chapter, and dive into rich commentary that helps you understand what you're reading. But here's where it gets special — you can also listen. We have eight distinct audio commentary voices: an Epic Narrator who makes Scripture feel cinematic, a Modern Preacher who brings fire and urgency, a Gentle Counselor for comfort, and more. Each voice gives you a different experience of the same truth. It's like hearing a sermon, a lecture, and a meditation all in one place.",
    targetSelector: "[data-tour='tab-bible']",
    tooltipPosition: "bottom",
  },
  {
    id: "chapel",
    title: "The Chapel — Your Daily Spiritual Home",
    description: "Devotionals, watches, reading plans, community, and life resources.",
    narration: "The Chapel is where your daily spiritual rhythm lives. Start your morning with a Morning Watch — a short, focused devotional to set your heart for the day. Wind down with a Night Watch — a cinematic, reflective meditation before sleep. Follow structured reading plans that walk you through Scripture over days or months. Connect with your church community. And when life gets hard, you'll find resources here too — guidance for marriage, grief, mental health, and wellness, all rooted in biblical wisdom. The Chapel is designed so that every time you open the app, there's something waiting for you.",
    targetSelector: "[data-tour='tab-chapel']",
    tooltipPosition: "bottom",
  },
  {
    id: "level-switch",
    title: "Grow When You're Ready",
    description: "Tap here anytime to unlock deeper study experiences.",
    narration: "Finally, one more thing. See this chip up here? When you feel ready for more — more tools, more depth, more ways to explore Scripture — just tap it. There are two additional levels that open up new capabilities and new ways to study. But there's no rush. Everything you need for powerful, life-changing Bible study is right here. Enjoy the journey. And remember — Jeeves and I are always here to help. God bless.",
    targetSelector: "[data-tour='level-chip']",
    tooltipPosition: "bottom",
  },
];
