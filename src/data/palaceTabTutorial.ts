/**
 * Interactive step-by-step tutorial for the Palace Tab UI.
 * Reginald walks users through each section of the Palace page.
 */

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  /** CSS selector or element ID to highlight. null = full-screen overlay */
  targetSelector: string | null;
  /** Which tab should be active during this step */
  activeTab?: "explore" | "progress" | "audio-tour";
  /** Reginald's spoken narration for TTS */
  narration: string;
  /** Position of the tooltip relative to the highlight */
  tooltipPosition: "top" | "bottom" | "left" | "right" | "center";
  estimatedSeconds: number;
}

export const PALACE_TAB_TUTORIAL: TutorialStep[] = [
  {
    id: "welcome",
    title: "Welcome to the Palace Tab",
    description: "This is your command center for the entire Phototheology study system. Let me show you around.",
    targetSelector: null,
    narration: `Hello, welcome to the Palace tab tutorial. I'm Reginald, and I'm going to walk you through every section of this page so you know exactly how to navigate it. This tab is your command center — everything you need for structured Bible study lives right here. Let's get started.`,
    tooltipPosition: "center",
    estimatedSeconds: 15,
  },
  {
    id: "progress-card",
    title: "Your Progress Tracker",
    description: "This card shows how many rooms you've completed out of the total. It updates automatically as you study each room.",
    targetSelector: ".palace-progress-card",
    narration: `Right at the top you'll see your progress card. It tells you how many rooms you've completed out of the total — and shows your percentage. Every time you finish studying a room, this updates automatically. It's your at-a-glance view of how far you've come through the Palace.`,
    tooltipPosition: "bottom",
    estimatedSeconds: 12,
  },
  {
    id: "action-buttons",
    title: "Quick Action Buttons",
    description: "Use 'Continue Learning' to jump into a quiz, or start a 'Guided Tour' for a step-by-step walkthrough of the rooms.",
    targetSelector: ".palace-action-buttons",
    narration: `Below that you'll find the quick action buttons. 'Continue Learning' takes you straight into the Palace Quiz — a fast way to test and reinforce your knowledge of each room. The 'Guided Tour' button launches an interactive walkthrough that introduces the rooms one at a time. These are your two fastest ways to engage with the Palace system.`,
    tooltipPosition: "bottom",
    estimatedSeconds: 14,
  },
  {
    id: "floor-overview",
    title: "The Eight Floors at a Glance",
    description: "This card lists all 8 floors with their purpose. Tap any floor to jump straight to its rooms.",
    targetSelector: ".palace-floor-overview",
    narration: `This card is your map of the entire Palace. All eight floors are listed here with a brief description of what each one teaches. Floor 1 fills your memory. Floor 2 makes you a detective. Floor 3 trains freestyle. And so on up to Floor 8 where it all becomes reflexive. You can tap any floor here to jump straight to its rooms.`,
    tooltipPosition: "top",
    estimatedSeconds: 16,
  },
  {
    id: "tabs-explore",
    title: "The Explore Tab",
    description: "This is the main view. Toggle between 'Guided' mode (simplified, progressive) and 'Full' mode (all rooms at once).",
    targetSelector: ".palace-tabs",
    activeTab: "explore",
    narration: `Now let's look at the three tabs. The first is Explore — this is where you browse all the floors and rooms. You have two view modes here. 'Guided' mode shows rooms progressively — great for beginners who don't want to feel overwhelmed. 'Full' mode shows every room on every floor at once — perfect once you're familiar with the system. Toggle between them with the buttons at the top right.`,
    tooltipPosition: "top",
    estimatedSeconds: 18,
  },
  {
    id: "view-modes",
    title: "Guided vs Full View",
    description: "Guided mode reveals rooms progressively as you learn. Full mode shows the complete visual palace with all 38+ rooms.",
    targetSelector: ".palace-view-toggle",
    activeTab: "explore",
    narration: `In Guided mode, rooms are revealed based on your progress — start simple, build up. In Full mode, you see the complete visual palace with all rooms across all eight floors. I recommend starting with Guided mode and switching to Full once you've explored at least the first three floors.`,
    tooltipPosition: "bottom",
    estimatedSeconds: 12,
  },
  {
    id: "tabs-audio",
    title: "The Audio Tour Tab",
    description: "Listen to guided audio tours where Reginald and Jeeves walk through Scripture using Palace rooms. Multiple tours available.",
    targetSelector: ".palace-tabs",
    activeTab: "audio-tour",
    narration: `The second tab is Audio Tour. This is where you can listen to guided tours — like the one playing on the Tour page. We have tours for Psalm 23, Philippians 2, and the full Suite overview. Each tour walks you through Scripture using Palace rooms, so you hear the method applied to real passages. It's the best way to understand how the rooms work together.`,
    tooltipPosition: "top",
    estimatedSeconds: 16,
  },
  {
    id: "tabs-progress",
    title: "The Progress Tab",
    description: "See your detailed progress breakdown by floor. Track which rooms you've completed and where to go next.",
    targetSelector: ".palace-tabs",
    activeTab: "progress",
    narration: `The third tab is Progress. Here you get a detailed breakdown of your journey — how many rooms you've completed on each floor, with individual progress bars. When you complete every room, you'll unlock the ability to take the Master Exam and earn your Palace certificate. This tab is your accountability partner.`,
    tooltipPosition: "top",
    estimatedSeconds: 14,
  },
  {
    id: "opening-rooms",
    title: "Opening a Room",
    description: "Tap any room card to open it. Each room has a 'Learn' section explaining the method and a 'Practice' section with tools.",
    targetSelector: null,
    narration: `When you tap any room — whether from the Explore tab or the floor overview — you'll land on that room's detail page. Every room has two core sections. The 'Learn' section explains the method with examples. The 'Practice' section links to specific tools and games that train that skill. For example, the Observation Room links to the Detective Challenge. The Sanctuary Room links to the Sanctuary Explorer. Each room connects you to the right tools automatically.`,
    tooltipPosition: "center",
    estimatedSeconds: 18,
  },
  {
    id: "voice-chat",
    title: "Talk to Reginald",
    description: "Use the voice chat widget to ask Reginald questions about the Palace anytime. He knows every room.",
    targetSelector: ".palace-voice-widget",
    narration: `And don't forget — if you're ever confused or want guidance, you can talk to me right here through the voice chat widget. Ask me which room to study next, what a room means, or how to apply a specific method. I'm always here.`,
    tooltipPosition: "top",
    estimatedSeconds: 10,
  },
  {
    id: "wrap-up",
    title: "You're Ready!",
    description: "Start with Floor 1's Story Room. Read one chapter, observe 10 details, and you're on your way.",
    targetSelector: null,
    narration: `And that's the Palace tab. You now know where everything lives — your progress, the floors, the rooms, the views, the audio tours, and the voice assistant. My recommendation? Start with Floor 1, Story Room. Read one chapter, note ten observations, and you're already building your palace. Let's go.`,
    tooltipPosition: "center",
    estimatedSeconds: 14,
  },
];
