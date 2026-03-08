import { BookOpen, Zap, Heart, Trophy, BarChart3 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ShareSourceType =
  | "bible_study"
  | "devotional"
  | "freestyle_quote"
  | "achievement"
  | "progress_card";

export interface SharedContent {
  source_type: ShareSourceType;
  source_id?: string;
  source_title: string;
  source_excerpt: string;
  verse_reference?: string;
  source_icon?: string;
  source_metadata?: Record<string, any>;
}

interface ShareSourceConfig {
  label: string;
  color: string;
  badgeClass: string;
  icon: LucideIcon;
}

export const SHARE_SOURCE_CONFIG: Record<ShareSourceType, ShareSourceConfig> = {
  bible_study: {
    label: "Bible Study",
    color: "blue",
    badgeClass: "bg-blue-500/10 text-blue-600 border-blue-500/30",
    icon: BookOpen,
  },
  devotional: {
    label: "Devotional",
    color: "pink",
    badgeClass: "bg-pink-500/10 text-pink-600 border-pink-500/30",
    icon: Heart,
  },
  freestyle_quote: {
    label: "Freestyle",
    color: "lime",
    badgeClass: "bg-lime-500/10 text-lime-600 border-lime-500/30",
    icon: Zap,
  },
  achievement: {
    label: "Achievement",
    color: "amber",
    badgeClass: "bg-amber-500/10 text-amber-600 border-amber-500/30",
    icon: Trophy,
  },
  progress_card: {
    label: "Progress",
    color: "violet",
    badgeClass: "bg-violet-500/10 text-violet-600 border-violet-500/30",
    icon: BarChart3,
  },
};
