import {
  Brain, MessageSquare, Shield, BookOpen, Crown,
  Search, GraduationCap, Church, Gamepad2,
  Headphones, Eye, Layers,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface GoalCategory {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  emoji: string;
  tabs: string[];
  gradient: { from: string; to: string; border: string };
}

export const GOAL_CATEGORIES: GoalCategory[] = [
  {
    id: "study",
    label: "Bible Study",
    description: "Deep study with AI commentary, lexicons, and the Study Experience",
    icon: Layers,
    emoji: "\u{1F4D6}",
    tabs: ["study-experience", "bible", "study-buddy", "reading-plans", "give-me-a-gem", "research-assistant"],
    gradient: { from: "from-blue-500", to: "to-indigo-500", border: "border-blue-500/40" },
  },
  {
    id: "memorization",
    label: "Memorization",
    description: "Build mental palaces, drill verses, and test your recall",
    icon: Brain,
    emoji: "\u{1F9E0}",
    tabs: ["memory", "drill-drill", "test-me", "palace", "card-deck"],
    gradient: { from: "from-cyan-500", to: "to-teal-500", border: "border-cyan-500/40" },
  },
  {
    id: "listening",
    label: "Listening",
    description: "Curate playlists mixing commentary, podcasts, devotions, and readings",
    icon: Headphones,
    emoji: "\u{1F3A7}",
    tabs: ["playlist", "podcast", "morning-watches", "night-watches", "devotionals"],
    gradient: { from: "from-violet-500", to: "to-fuchsia-500", border: "border-violet-500/40" },
  },
  {
    id: "sermons",
    label: "Sermons",
    description: "Build, research, and amplify powerful sermons",
    icon: MessageSquare,
    emoji: "\u{1F3A4}",
    tabs: ["sermon-builder", "sermon-ideas", "research-assistant", "amplify", "bible"],
    gradient: { from: "from-purple-500", to: "to-fuchsia-500", border: "border-purple-500/40" },
  },
  {
    id: "apologetics",
    label: "Apologetics",
    description: "Train in the Dojo, engage Christ & Culture, defend your faith",
    icon: Shield,
    emoji: "\u{1F6E1}\u{FE0F}",
    tabs: ["spiritual-training", "culture-controversy", "gpts", "palace", "freestyle"],
    gradient: { from: "from-red-500", to: "to-rose-500", border: "border-red-500/40" },
  },
  {
    id: "prophecy",
    label: "Prophecy",
    description: "Track prophetic fulfillment and study Daniel & Revelation",
    icon: Eye,
    emoji: "\u{1F52E}",
    tabs: ["prophecy-watch", "bible", "encyclopedia", "character-profiles", "gpts"],
    gradient: { from: "from-indigo-500", to: "to-blue-500", border: "border-indigo-500/40" },
  },
  {
    id: "research",
    label: "Research",
    description: "Explore encyclopedias, lexicons, mind maps, and libraries",
    icon: Search,
    emoji: "\u{1F50D}",
    tabs: ["research-assistant", "encyclopedia", "mind-map", "libraries", "study-tools"],
    gradient: { from: "from-emerald-500", to: "to-teal-500", border: "border-emerald-500/40" },
  },
  {
    id: "church_ministry",
    label: "Church & Ministry",
    description: "Tools for pastors, teachers, and ministry leaders",
    icon: Church,
    emoji: "\u{26EA}",
    tabs: ["church-space", "blueprints", "sermon-builder", "courses", "community"],
    gradient: { from: "from-emerald-500", to: "to-green-500", border: "border-emerald-500/40" },
  },
  {
    id: "games_community",
    label: "Games & Community",
    description: "Compete, test your knowledge, and grow with others",
    icon: Gamepad2,
    emoji: "\u{1F3AE}",
    tabs: ["games", "test-me", "leaderboard", "community", "schedule", "drill-drill"],
    gradient: { from: "from-fuchsia-500", to: "to-pink-500", border: "border-fuchsia-500/40" },
  },
];

/** Given selected goal IDs, return a deduped ordered list of tab IDs */
export function getTabIdsFromGoals(goalIds: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const goalId of goalIds) {
    const goal = GOAL_CATEGORIES.find((g) => g.id === goalId);
    if (!goal) continue;
    for (const tabId of goal.tabs) {
      if (!seen.has(tabId)) {
        seen.add(tabId);
        result.push(tabId);
      }
    }
  }
  return result;
}
