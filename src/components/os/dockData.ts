import {
  Building2, BookOpen, Brain, StickyNote, Sword, Zap, Gem, Gamepad2,
  Search, Clock, MapPin, Languages, BookMarked, Crown, Layers,
  Sparkles, GraduationCap, Eye,
  MessageSquare, Users, Trophy, Target, Church, LayoutGrid,
  Headphones, Image, Network, Calendar, Film, PersonStanding, Shield,
  Lightbulb, Video, Library, Scale, Megaphone,
  Heart, Flame, Dumbbell, PenTool, HeartHandshake,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface DockSubItem {
  id: string;
  label: string;
  path: string;
  icon?: LucideIcon;
}

export interface DockItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  glow: string; // HSL values without hsl() wrapper
  children?: DockSubItem[];
}

export interface DockSection {
  id: string;
  label: string;
  items: DockItem[];
}

export const DOCK_SECTIONS: DockSection[] = [
  {
    id: "core",
    label: "Core",
    items: [
      {
        id: "palace", label: "Palace", icon: Building2, path: "/palace", glow: "32 95% 53%",
        children: [
          { id: "palace-tour", label: "Tour the Palace", path: "/palace/tour", icon: Headphones },
          { id: "freestyle", label: "Freestyle", path: "/palace/freestyle", icon: Zap },
          { id: "mind-map", label: "Mind Map", path: "/mind-map", icon: Network },
          { id: "mastery", label: "Mastery", path: "/mastery", icon: Crown },
          { id: "card-deck", label: "Study Deck", path: "/card-deck", icon: Sparkles },
          { id: "ascensions", label: "Ascensions", path: "/ascensions-expansions", icon: Layers },
        ],
      },
      {
        id: "bible", label: "Study Bible", icon: BookOpen, path: "/bible", glow: "210 100% 56%",
        children: [
          { id: "reading-plans", label: "Reading Plans", path: "/reading-plans", icon: Calendar },
          { id: "daily-reading", label: "Daily Reading", path: "/daily-reading", icon: BookOpen },
          { id: "daily-verse", label: "Daily Verse", path: "/daily-verse", icon: Heart },
          { id: "devotionals", label: "Devotionals", path: "/devotionals", icon: Flame },
          { id: "my-studies", label: "My Studies", path: "/my-studies", icon: BookMarked },
          { id: "study-ideas", label: "Study Ideas", path: "/study-ideas", icon: Lightbulb },
        ],
      },
      {
        id: "study-buddy", label: "Study Buddy", icon: Brain, path: "/study-buddy", glow: "270 70% 60%",
        children: [
          { id: "pt-gpt", label: "Phototheology GPT", path: "/phototheologygpt", icon: Sparkles },
          { id: "branch-study", label: "BranchStudy", path: "/branch-study", icon: Network },
          { id: "kid-gpt", label: "Kid GPT", path: "/kidgpt", icon: Users },
          { id: "dr-gpt", label: "Daniel & Rev GPT", path: "/daniel-revelation-gpt", icon: Eye },
          { id: "apol-gpt", label: "Apologetics GPT", path: "/apologetics-gpt", icon: Shield },
          { id: "research-asst", label: "Research Assistant", path: "/research-assistant", icon: GraduationCap },
        ],
      },
      {
        id: "notes", label: "Notes", icon: StickyNote, path: "/notes", glow: "45 100% 51%",
        children: [
          { id: "analyze", label: "Analyze Thoughts", path: "/analyze-thoughts", icon: Lightbulb },
          { id: "growth-journal", label: "Growth Journal", path: "/growth-journal", icon: PenTool },
        ],
      },
    ],
  },
  {
    id: "train",
    label: "Train",
    items: [
      {
        id: "defense", label: "Defense Mode", icon: Sword, path: "/spiritual-training", glow: "0 84% 60%",
        children: [
          { id: "test-me", label: "Test Me", path: "/test-me", icon: GraduationCap },
          { id: "drill-drill", label: "Gather Fragments", path: "/drill-drill", icon: Target },
          { id: "training-drills", label: "Training Drills", path: "/training-drills", icon: Dumbbell },
          { id: "flashcards", label: "Flashcards", path: "/flashcards", icon: Layers },
          { id: "memory", label: "Memory Palace", path: "/memory", icon: Brain },
          { id: "culture", label: "Christ & Culture", path: "/culture-controversy", icon: Scale },
        ],
      },
      {
        id: "challenges", label: "Challenges", icon: Zap, path: "/daily-challenges", glow: "25 95% 53%",
        children: [
          { id: "challenge-board", label: "Challenge Board", path: "/challenge-board", icon: Trophy },
          { id: "genesis-challenge", label: "Genesis High Rise", path: "/genesis-challenge", icon: Building2 },
          { id: "weekly", label: "Weekly Challenge", path: "/weekly-challenge", icon: Calendar },
        ],
      },
      {
        id: "games", label: "Games", icon: Gamepad2, path: "/games", glow: "280 70% 60%",
        children: [
          { id: "schedule", label: "Scheduled Games", path: "/schedule", icon: Calendar },
          { id: "multiplayer", label: "PT Multiplayer", path: "/pt-multiplayer", icon: Users },
          { id: "leaderboard", label: "Leaderboard", path: "/leaderboard", icon: Trophy },
          { id: "achievements", label: "Achievements", path: "/achievements", icon: Trophy },
        ],
      },
    ],
  },
  {
    id: "study",
    label: "Study",
    items: [
      {
        id: "research", label: "Research Tools", icon: Search, path: "/interlinear", glow: "180 70% 50%",
        children: [
          { id: "interlinear", label: "Interlinear Bible", path: "/interlinear", icon: Languages },
          { id: "lexicon", label: "Greek/Hebrew Lexicon", path: "/bible-lexicon", icon: BookOpen },
          { id: "timeline", label: "Bible Timeline", path: "/bible-timeline", icon: Clock },
          { id: "atlas", label: "Bible Atlas", path: "/bible-atlas", icon: MapPin },
          { id: "encyclopedia", label: "Encyclopedia", path: "/encyclopedia", icon: Search },
          { id: "characters", label: "Character Profiles", path: "/character-profiles", icon: PersonStanding },
        ],
      },
      {
        id: "programs", label: "Programs", icon: GraduationCap, path: "/courses", glow: "142 70% 45%",
        children: [
          { id: "courses", label: "Courses", path: "/courses", icon: GraduationCap },
          { id: "cota", label: "COTA Series", path: "/cota-series", icon: Crown },
          { id: "quarterly", label: "Quarterly Study", path: "/quarterly-study", icon: Calendar },
          { id: "series", label: "Study Series", path: "/bible-study-series", icon: BookMarked },
          { id: "image-bible", label: "Image Bible", path: "/image-bible", icon: Image },
          { id: "video-training", label: "Video Training", path: "/video-training", icon: Video },
          { id: "sources", label: "Source Library", path: "/sources", icon: Library },
          { id: "libraries", label: "Libraries", path: "/libraries", icon: Library },
        ],
      },
    ],
  },
  {
    id: "devotion",
    label: "Devotion",
    items: [
      {
        id: "gems", label: "Gems", icon: Gem, path: "/give-me-a-gem", glow: "160 70% 45%",
        children: [
          { id: "polish", label: "Polish", path: "/polish", icon: Film },
          { id: "amplify", label: "Amplify", path: "/amplify", icon: Zap },
          { id: "remix", label: "Remix", path: "/remix", icon: Megaphone },
          { id: "infographics", label: "Infographics", path: "/infographics", icon: Image },
        ],
      },
      {
        id: "daily-walk", label: "Daily Walk", icon: Heart, path: "/daily-reading", glow: "340 70% 55%",
        children: [
          { id: "dw-daily-verse", label: "Daily Verse", path: "/daily-verse", icon: Sparkles },
          { id: "dw-daily-reading", label: "Daily Reading", path: "/daily-reading", icon: BookOpen },
          { id: "dw-devotionals", label: "Devotionals", path: "/devotionals", icon: Flame },
          { id: "dw-growth-journal", label: "Growth Journal", path: "/growth-journal", icon: PenTool },
        ],
      },
      {
        id: "sermons", label: "Sermons", icon: MessageSquare, path: "/sermon-builder", glow: "270 60% 55%",
        children: [
          { id: "sermon-ideas", label: "Sermon Ideas", path: "/sermon-ideas", icon: Lightbulb },
        ],
      },
      {
        id: "blueprints", label: "Blueprints", icon: HeartHandshake, path: "/blueprint-marriage", glow: "320 60% 55%",
        children: [
          { id: "bp-marriage", label: "Dating & Marriage", path: "/blueprint-marriage", icon: Heart },
          { id: "bp-grief", label: "Grieving", path: "/blueprint-grief", icon: HeartHandshake },
          { id: "bp-stronghold", label: "Breaking Strongholds", path: "/blueprint-stronghold", icon: Shield },
          { id: "bp-weight", label: "Weight Loss", path: "/blueprint-weight-loss", icon: Dumbbell },
          { id: "bp-mental", label: "Mental Health", path: "/blueprint-mental-health", icon: Brain },
        ],
      },
    ],
  },
  {
    id: "community",
    label: "Community",
    items: [
      {
        id: "church", label: "Church Space", icon: Church, path: "/living-manna", glow: "142 70% 40%",
      },
      {
        id: "prophecy", label: "Prophecy Watch", icon: Eye, path: "/prophecy-watch", glow: "250 60% 55%",
      },
      {
        id: "community-feed", label: "Community", icon: Users, path: "/community", glow: "180 60% 50%",
        children: [
          { id: "discover", label: "Discover People", path: "/discover", icon: Search },
          { id: "guilds", label: "Guilds", path: "/guilds", icon: Shield },
          { id: "study-partners", label: "Study Partners", path: "/study-partners", icon: Users },
        ],
      },
      {
        id: "workspace", label: "Workspace", icon: LayoutGrid, path: "/workspace", glow: "210 60% 50%",
      },
    ],
  },
];

/** Flatten all items + children into a searchable list */
export function getAllDockItems(): { label: string; path: string; icon: LucideIcon; glow: string; section: string; parent?: string }[] {
  const result: { label: string; path: string; icon: LucideIcon; glow: string; section: string; parent?: string }[] = [];
  for (const section of DOCK_SECTIONS) {
    for (const item of section.items) {
      result.push({ label: item.label, path: item.path, icon: item.icon, glow: item.glow, section: section.label });
      if (item.children) {
        for (const child of item.children) {
          result.push({
            label: child.label,
            path: child.path,
            icon: child.icon || item.icon,
            glow: item.glow,
            section: section.label,
            parent: item.label,
          });
        }
      }
    }
  }
  return result;
}
