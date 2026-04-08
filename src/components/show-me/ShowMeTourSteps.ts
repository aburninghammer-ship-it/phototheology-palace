import type { GuidedTourStep } from "@/components/guided-tour/GuidedTourOverlay";

export const showMeTourSteps: GuidedTourStep[] = [
  {
    id: "welcome",
    title: "Welcome to PhototheologyOS",
    description: "This is a taste of what the full operating system can do. Each card below is a different way to experience Scripture — powered by AI, rooted in theology.",
    narration: "Welcome. What you're about to see is not another Bible app. This is PhototheologyOS — a system designed to reveal what's been hidden in plain sight. Let me walk you through what's available here.",
    tooltipPosition: "center",
  },
  {
    id: "verse-breakdown",
    title: "Verse Breakdown",
    description: "Type any verse and watch it unfold — layer by layer. Original language, theological depth, and hidden connections most people miss.",
    narration: "First up: the Verse Breakdown. Give it any verse and it will peel back the layers — the original language, the theological structure, the connections hiding beneath the English.",
    targetSelector: "[data-showme-card='verse']",
    tooltipPosition: "bottom",
  },
  {
    id: "epic-commentary",
    title: "Epic Commentary",
    description: "Hear Genesis 1 narrated not as a chapter — but as a cinematic experience. This is Scripture brought to life.",
    narration: "Next: Epic Commentary. This turns Genesis chapter one into a cinematic audio experience. Close your eyes and hear the creation like you never have before.",
    targetSelector: "[data-showme-card='commentary']",
    tooltipPosition: "bottom",
  },
  {
    id: "night-watch",
    title: "Night Watch",
    description: "A guided meditation at the foot of the cross. Fifteen minutes of Scripture, silence, and stillness.",
    narration: "The Night Watch. A fifteen-minute guided meditation through Matthew twenty-seven. This is what happens when Scripture becomes an experience, not just a text.",
    targetSelector: "[data-showme-card='meditation']",
    tooltipPosition: "bottom",
  },
  {
    id: "mind-map",
    title: "Mind Map",
    description: "See how one verse connects to the entire Bible — visually. Themes, cross-references, and hidden threads.",
    narration: "The Mind Map takes any verse and builds a visual web of connections — themes, cross-references, principles. You'll see how one verse touches the entire Bible.",
    targetSelector: "[data-showme-card='mindmap']",
    tooltipPosition: "bottom",
  },
  {
    id: "study-bible",
    title: "Study Bible",
    description: "Five dimensions of analysis on every verse. Strong's numbers, PT codes, cross-references, and AI commentary.",
    narration: "And the Study Bible — five dimensions of analysis on every single verse. Original language, theological codes, cross-references, and AI-powered commentary. All in one place.",
    targetSelector: "[data-showme-card='study']",
    tooltipPosition: "bottom",
  },
  {
    id: "cta",
    title: "Ready to Go Deeper?",
    description: "These samples are just the surface. The full PhototheologyOS gives you unlimited access to every tool, every floor, every room.",
    narration: "What you've just seen is only the surface. The full PhototheologyOS gives you unlimited access to every tool, every floor, every room in the Palace. When you're ready, the door is open.",
    targetSelector: "[data-showme-cta]",
    tooltipPosition: "bottom",
  },
];
