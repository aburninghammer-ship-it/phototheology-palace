import type { GuidedTourStep } from "@/components/guided-tour/GuidedTourOverlay";

export const BASIC_MODE_TOUR: GuidedTourStep[] = [
  {
    id: "welcome",
    title: "Welcome to Phototheology",
    description: "Reginald and Jeeves welcome you to your personal Bible study experience.",
    narration: "Good day! I'm Reginald, and alongside me is Jeeves. We're delighted to welcome you. Before we show you around, let us tell you something important — this is not just another AI Bible app. Most AI tools give you generic, surface-level answers pulled from the internet. Jeeves is different. He's been trained on a complete theological study system — one that traces Christ through every chapter, connects verses across the entire Bible like a family tree, and examines Scripture through multiple dimensions that most people never even consider. When you ask Jeeves a question, you're not getting a Wikipedia summary. You're getting the kind of answer a seasoned theologian would give after hours of study — delivered in seconds. Let us show you what that looks like.",
    tooltipPosition: "center",
  },
  {
    id: "ask-jeeves",
    title: "Ask Jeeves — Not Your Average AI",
    description: "Deep, multi-layered, Christ-centered answers — not generic internet summaries.",
    narration: "This is where you talk to Jeeves. Ask him anything — a character study, a verse explanation, how two passages connect, what a prophecy means, or how a story applies to your life today. Here's what makes Jeeves different from ChatGPT or any other AI: Jeeves doesn't just look up an answer. He examines your question through layers of analysis — the literal meaning, the Christ connection, the personal application, the prophetic significance, the patterns across Scripture. He traces how verses relate to each other like family members — siblings, cousins, distant relatives — finding connections most people miss entirely. And he always, always brings it back to Jesus. Other AIs might give you information. Jeeves gives you revelation.",
    targetSelector: "[data-tour='tab-chat']",
    tooltipPosition: "bottom",
  },
  {
    id: "study-bible",
    title: "Study Bible — Read, Listen, Explore",
    description: "Read any book and chapter with commentary and eight unique audio voices.",
    narration: "The Study Bible is your reading room. Open any book of the Bible, read any chapter, and access rich commentary that goes far deeper than a standard study Bible. But here's something no other app offers — eight distinct audio commentary voices. An Epic Narrator who makes Scripture feel cinematic. A Modern Preacher who brings fire and urgency. A Gentle Counselor for comfort. A Scholar for precision. Each voice illuminates the same passage from a completely different angle. It's like having eight different mentors guiding you through the Word — and all of them are grounded in the same Christ-centered framework that powers Jeeves.",
    targetSelector: "[data-tour='tab-bible']",
    tooltipPosition: "bottom",
  },
  {
    id: "chapel",
    title: "The Chapel — Your Daily Spiritual Home",
    description: "Devotionals, watches, reading plans, community, and life resources.",
    narration: "The Chapel is where your daily spiritual rhythm lives. Start your morning with a Morning Watch — a short, focused devotional to set your heart for the day. Wind down with a Night Watch — a cinematic, reflective meditation before sleep. Follow structured reading plans that walk you through Scripture over days or months. Connect with your church community. And when life gets hard, you'll find resources rooted in biblical wisdom — guidance for marriage, grief, mental health, and wellness. No other Bible app gives you this combination: deep theology, daily devotion, community, and life support — all in one place, all powered by the same engine that makes Jeeves so uniquely insightful.",
    targetSelector: "[data-tour='tab-chapel']",
    tooltipPosition: "bottom",
  },
  {
    id: "level-switch",
    title: "Grow When You're Ready",
    description: "Tap here anytime to unlock deeper study experiences.",
    narration: "Finally — see this chip up here? What you're using now is already more powerful than most Bible apps on the market. But when you're ready for more — more tools, more depth, entirely new ways to study Scripture — just tap here. There are two additional levels that unlock capabilities you won't find anywhere else. But there's no rush. Everything you need for powerful, life-changing Bible study is right here, right now. This isn't just AI — it's a study companion built on a system that sees Christ in every chapter, connects every verse, and transforms how you read the Word. Enjoy the journey. Jeeves and I are always here. God bless.",
    targetSelector: "[data-tour='level-chip']",
    tooltipPosition: "bottom",
  },
];
