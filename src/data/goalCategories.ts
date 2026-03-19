import {
  Brain, MessageSquare, Shield, BookOpen, Crown,
  Search, GraduationCap, Church, Gamepad2,
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
    id: "memorization",
    label: "Memorization",
    description: "Memorize Scripture and build mental palaces",
    icon: Brain,
    emoji: "\u{1F9E0}",
    tabs: ["memory", "drill-drill", "study-tools", "palace"],
    gradient: { from: "from-cyan-500", to: "to-teal-500", border: "border-cyan-500/40" },
  },
  {
    id: "sermons",
    label: "Sermons",
    description: "Craft and organize powerful sermons",
    icon: MessageSquare,
    emoji: "\u{1F3A4}",
    tabs: ["sermon-builder", "sermon-ideas", "research-assistant", "bible"],
    gradient: { from: "from-purple-500", to: "to-fuchsia-500", border: "border-purple-500/40" },
  },
  {
    id: "apologetics",
    label: "Apologetics",
    description: "Defend your faith with confidence",
    icon: Shield,
    emoji: "\u{1F6E1}\u{FE0F}",
    tabs: ["spiritual-training", "gpts", "palace", "freestyle"],
    gradient: { from: "from-red-500", to: "to-rose-500", border: "border-red-500/40" },
  },
  {
    id: "study",
    label: "Study",
    description: "Deep Bible study with AI-powered tools",
    icon: BookOpen,
    emoji: "\u{1F4D6}",
    tabs: ["bible", "study-buddy", "reading-plans", "devotionals", "study-ideas", "give-me-a-gem"],
    gradient: { from: "from-blue-500", to: "to-cyan-500", border: "border-blue-500/40" },
  },
  {
    id: "mastery",
    label: "Mastery",
    description: "Master every room and floor of the Palace",
    icon: Crown,
    emoji: "\u{1F451}",
    tabs: ["palace", "mastery", "courses", "freestyle", "achievements"],
    gradient: { from: "from-amber-500", to: "to-orange-500", border: "border-amber-500/40" },
  },
  {
    id: "research",
    label: "Research",
    description: "Explore encyclopedias, lexicons, and libraries",
    icon: Search,
    emoji: "\u{1F50D}",
    tabs: ["research-assistant", "encyclopedia", "study-tools", "bible", "libraries"],
    gradient: { from: "from-emerald-500", to: "to-teal-500", border: "border-emerald-500/40" },
  },
  {
    id: "teaching",
    label: "Teaching",
    description: "Create lessons, courses, and video content",
    icon: GraduationCap,
    emoji: "\u{1F393}",
    tabs: ["gpts", "video-training", "series", "courses", "bible"],
    gradient: { from: "from-violet-500", to: "to-purple-500", border: "border-violet-500/40" },
  },
  {
    id: "church_ministry",
    label: "Church Ministry",
    description: "Tools for pastors and ministry leaders",
    icon: Church,
    emoji: "\u{26EA}",
    tabs: ["church-space", "blueprints", "community", "devotionals"],
    gradient: { from: "from-emerald-500", to: "to-green-500", border: "border-emerald-500/40" },
  },
  {
    id: "games_community",
    label: "Games & Community",
    description: "Play, compete, and grow with others",
    icon: Gamepad2,
    emoji: "\u{1F3AE}",
    tabs: ["games", "leaderboard", "community", "drill-drill", "schedule"],
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
