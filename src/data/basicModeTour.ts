import type { GuidedTourStep } from "@/components/guided-tour/GuidedTourOverlay";

export const BASIC_MODE_TOUR: GuidedTourStep[] = [
  {
    id: "welcome",
    title: "Welcome to Level 1 — Basic Mode",
    description: "Your clean, simple Bible study experience. Everything you need — nothing you don't. Let me show you around.",
    narration: "Welcome to Level 1, the Basic experience. I'm Reginald, your guide. This mode gives you powerful, Christ-centered Bible study tools without the complexity. Think of it as your personal Bible study suite — simple on the surface, but deeply rooted in Phototheology under the hood. Let me walk you through each tool.",
    tooltipPosition: "center",
  },
  {
    id: "ask-jeeves",
    title: "Ask Jeeves — Your Bible AI",
    description: "Ask any Bible question and get deep, Christ-centered answers powered by advanced theological analysis.",
    narration: "First up is Ask Jeeves — your personal Bible AI assistant. You can ask Jeeves anything: a verse breakdown, a doctrinal question, a character study, a theme trace. Behind the scenes, Jeeves analyzes your question through multiple layers of biblical scholarship before giving you a rich, Christ-centered answer. It's like having a master theologian in your pocket.",
    targetSelector: "[data-tour='tab-chat']",
    tooltipPosition: "bottom",
  },
  {
    id: "study-bible",
    title: "Study Bible — Read with Commentary",
    description: "Read Scripture with built-in commentary, audio narration in 8 voices, cross-references, and deep study tools.",
    narration: "Next is the Study Bible. This is where you read Scripture with powerful commentary layered in. You can explore any book, any chapter, with study notes, cross-references, and our eight-voice audio commentary suite built right in — Epic Narrator, Modern Preacher, Counselor, and more. Each voice illuminates Scripture from a unique angle. It's your complete Bible reading and listening experience.",
    targetSelector: "[data-tour='tab-bible']",
    tooltipPosition: "bottom",
  },
  {
    id: "chapel",
    title: "Phototheology Chapel",
    description: "Your spiritual hub — devotionals, morning & night watches, reading plans, church community, and life resources all in one place.",
    narration: "The Chapel is your spiritual home base. Everything devotional lives here: Morning Watches to start your day with God, Night Watches for cinematic evening meditations, daily audio devotionals written using Phototheology principles, structured reading plans, and your church community hub. You'll also find life resources — marriage guidance, grief support, mental health, and wellness — all grounded in Scripture. It's everything you need for daily spiritual formation, all in one beautiful space.",
    targetSelector: "[data-tour='tab-chapel']",
    tooltipPosition: "bottom",
  },
  {
    id: "level-switch",
    title: "Switch Levels Anytime",
    description: "Ready for more? Tap the level chip to explore Level 2 (Explorer) or Level 3 (Immersion) with the full Palace system.",
    narration: "One more thing — see that level chip at the top? You can switch between levels anytime. Level 2, Explorer, introduces you to the Palace rooms with guided coaching. Level 3, Immersion, opens the full eight-floor Palace operating system with all 38 rooms, cycles, heavens, and advanced research tools. But for now, Level 1 has everything you need for deep, meaningful Bible study. Enjoy the journey, and remember — Christ is in every chapter.",
    targetSelector: "[data-tour='level-chip']",
    tooltipPosition: "bottom",
  },
];
