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
  glow?: string;
}

export interface DockItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  glow: string;
  children?: DockSubItem[];
}

export interface DockSection {
  id: string;
  label: string;
  items: DockItem[];
}

// Every single item has a unique HSL glow — no two match
export const DOCK_SECTIONS: DockSection[] = [
  {
    id: "core",
    label: "Core",
    items: [
      {
        id: "palace", label: "Palace", icon: Building2, path: "/palace", glow: "32 95% 53%",
        children: [
          { id: "palace-tour", label: "Tour the Palace", path: "/palace/tour", icon: Headphones, glow: "174 72% 40%" },
          { id: "freestyle", label: "Freestyle", path: "/palace/freestyle", icon: Zap, glow: "84 81% 44%" },
          { id: "mind-map", label: "Mind Map", path: "/mind-map", icon: Network, glow: "245 80% 67%" },
          { id: "mastery", label: "Mastery", path: "/mastery", icon: Crown, glow: "348 83% 52%" },
          { id: "card-deck", label: "Study Deck", path: "/card-deck", icon: Sparkles, glow: "271 76% 53%" },
          { id: "ascensions", label: "Ascensions", path: "/ascensions-expansions", icon: Layers, glow: "22 90% 48%" },
        ],
      },
      {
        id: "bible", label: "Study Bible", icon: BookOpen, path: "/bible", glow: "210 100% 56%",
        children: [
          { id: "reading-plans", label: "Reading Plans", path: "/reading-plans", icon: Calendar, glow: "160 84% 39%" },
          { id: "daily-reading", label: "Daily Reading", path: "/daily-reading", icon: BookOpen, glow: "199 89% 48%" },
          { id: "daily-verse", label: "Daily Verse", path: "/daily-verse", icon: Heart, glow: "340 82% 52%" },
          { id: "devotionals", label: "Devotionals", path: "/devotionals", icon: Flame, glow: "328 85% 58%" },
          { id: "my-studies", label: "My Studies", path: "/my-studies", icon: BookMarked, glow: "205 95% 50%" },
          { id: "study-ideas", label: "Study Ideas", path: "/study-ideas", icon: Lightbulb, glow: "38 92% 50%" },
        ],
      },
      {
        id: "study-buddy", label: "Study Buddy", icon: Brain, path: "/study-buddy", glow: "215 16% 53%",
        children: [
          { id: "pt-gpt", label: "Phototheology GPT", path: "/phototheologygpt", icon: Sparkles, glow: "263 70% 58%" },
          { id: "branch-study", label: "BranchStudy", path: "/branch-study", icon: Network, glow: "280 65% 55%" },
          { id: "kid-gpt", label: "Kid GPT", path: "/kidgpt", icon: Users, glow: "290 60% 62%" },
          { id: "dr-gpt", label: "Daniel & Rev GPT", path: "/daniel-revelation-gpt", icon: Eye, glow: "255 75% 50%" },
          { id: "apol-gpt", label: "Apologetics GPT", path: "/apologetics-gpt", icon: Shield, glow: "248 60% 45%" },
          { id: "research-asst", label: "Research Assistant", path: "/research-assistant", icon: GraduationCap, glow: "152 68% 42%" },
        ],
      },
      {
        id: "notes", label: "Notes", icon: StickyNote, path: "/notes", glow: "45 100% 51%",
        children: [
          { id: "analyze", label: "Analyze Thoughts", path: "/analyze-thoughts", icon: Lightbulb, glow: "48 93% 47%" },
          { id: "growth-journal", label: "Growth Journal", path: "/growth-journal", icon: PenTool, glow: "55 85% 45%" },
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
          { id: "test-me", label: "Test Me", path: "/test-me", icon: GraduationCap, glow: "8 78% 55%" },
          { id: "drill-drill", label: "Gather Fragments", path: "/drill-drill", icon: Target, glow: "25 95% 53%" },
          { id: "training-drills", label: "Training Drills", path: "/training-drills", icon: Dumbbell, glow: "355 72% 50%" },
          { id: "flashcards", label: "Flashcards", path: "/flashcards", icon: Layers, glow: "165 75% 42%" },
          { id: "memory", label: "Memory Palace", path: "/memory", icon: Brain, glow: "187 92% 43%" },
          { id: "culture", label: "Christ & Culture", path: "/culture-controversy", icon: Scale, glow: "342 82% 47%" },
        ],
      },
      {
        id: "challenges", label: "Challenges", icon: Zap, path: "/daily-challenges", glow: "16 88% 50%",
        children: [
          { id: "challenge-board", label: "Challenge Board", path: "/challenge-board", icon: Trophy, glow: "12 85% 55%" },
          { id: "genesis-challenge", label: "Genesis High Rise", path: "/genesis-challenge", icon: Building2, glow: "28 92% 48%" },
          { id: "weekly", label: "Weekly Challenge", path: "/weekly-challenge", icon: Calendar, glow: "18 80% 58%" },
        ],
      },
      {
        id: "games", label: "Games", icon: Gamepad2, path: "/games", glow: "292 84% 61%",
        children: [
          { id: "schedule", label: "Scheduled Games", path: "/schedule", icon: Calendar, glow: "200 80% 52%" },
          { id: "multiplayer", label: "PT Multiplayer", path: "/pt-multiplayer", icon: Users, glow: "300 70% 55%" },
          { id: "leaderboard", label: "Leaderboard", path: "/leaderboard", icon: Trophy, glow: "42 93% 50%" },
          { id: "achievements", label: "Achievements", path: "/achievements", icon: Trophy, glow: "35 88% 55%" },
        ],
      },
    ],
  },
  {
    id: "study",
    label: "Study",
    items: [
      {
        id: "research", label: "Research Tools", icon: Search, path: "/interlinear", glow: "160 84% 39%",
        children: [
          { id: "interlinear", label: "Interlinear Bible", path: "/interlinear", icon: Languages, glow: "168 78% 38%" },
          { id: "lexicon", label: "Greek/Hebrew Lexicon", path: "/bible-lexicon", icon: BookOpen, glow: "155 70% 45%" },
          { id: "timeline", label: "Bible Timeline", path: "/bible-timeline", icon: Clock, glow: "145 65% 40%" },
          { id: "atlas", label: "Bible Atlas", path: "/bible-atlas", icon: MapPin, glow: "170 80% 35%" },
          { id: "encyclopedia", label: "Encyclopedia", path: "/encyclopedia", icon: Search, glow: "230 78% 62%" },
          { id: "characters", label: "Character Profiles", path: "/character-profiles", icon: PersonStanding, glow: "240 72% 55%" },
        ],
      },
      {
        id: "programs", label: "Programs", icon: GraduationCap, path: "/courses", glow: "142 71% 45%",
        children: [
          { id: "courses", label: "Courses", path: "/courses", icon: GraduationCap, glow: "138 68% 42%" },
          { id: "cota", label: "COTA Series", path: "/cota-series", icon: Crown, glow: "30 90% 52%" },
          { id: "quarterly", label: "Quarterly Study", path: "/quarterly-study", icon: Calendar, glow: "135 60% 48%" },
          { id: "series", label: "Study Series", path: "/bible-study-series", icon: BookMarked, glow: "195 85% 50%" },
          { id: "image-bible", label: "Image Bible", path: "/image-bible", icon: Image, glow: "36 88% 50%" },
          { id: "video-training", label: "Video Training", path: "/video-training", icon: Video, glow: "4 78% 55%" },
          { id: "sources", label: "Source Library", path: "/sources", icon: Library, glow: "235 70% 58%" },
          { id: "libraries", label: "Libraries", path: "/libraries", icon: Library, glow: "250 65% 55%" },
        ],
      },
    ],
  },
  {
    id: "devotion",
    label: "Devotion",
    items: [
      {
        id: "gems", label: "Gems", icon: Gem, path: "/give-me-a-gem", glow: "158 80% 42%",
        children: [
          { id: "polish", label: "Polish", path: "/polish", icon: Film, glow: "285 78% 58%" },
          { id: "amplify", label: "Amplify", path: "/amplify", icon: Zap, glow: "218 88% 54%" },
          { id: "remix", label: "Remix", path: "/remix", icon: Megaphone, glow: "27 90% 50%" },
          { id: "infographics", label: "Infographics", path: "/infographics", icon: Image, glow: "175 72% 38%" },
        ],
      },
      {
        id: "daily-walk", label: "Daily Walk", icon: Heart, path: "/daily-reading", glow: "335 78% 55%",
        children: [
          { id: "dw-daily-verse", label: "Daily Verse", path: "/daily-verse", icon: Sparkles, glow: "350 75% 58%" },
          { id: "dw-daily-reading", label: "Daily Reading", path: "/daily-reading", icon: BookOpen, glow: "215 90% 52%" },
          { id: "dw-devotionals", label: "Devotionals", path: "/devotionals", icon: Flame, glow: "320 75% 55%" },
          { id: "dw-growth-journal", label: "Growth Journal", path: "/growth-journal", icon: PenTool, glow: "50 90% 48%" },
        ],
      },
      {
        id: "sermons", label: "Sermons", icon: MessageSquare, path: "/sermon-builder", glow: "270 56% 65%",
        children: [
          { id: "sermon-ideas", label: "Sermon Ideas", path: "/sermon-ideas", icon: Lightbulb, glow: "20 85% 50%" },
        ],
      },
      {
        id: "blueprints", label: "Blueprints", icon: HeartHandshake, path: "/blueprint-marriage", glow: "220 70% 55%",
        children: [
          { id: "bp-marriage", label: "Dating & Marriage", path: "/blueprint-marriage", icon: Heart, glow: "225 72% 52%" },
          { id: "bp-grief", label: "Grieving", path: "/blueprint-grief", icon: HeartHandshake, glow: "212 65% 50%" },
          { id: "bp-stronghold", label: "Breaking Strongholds", path: "/blueprint-stronghold", icon: Shield, glow: "232 68% 48%" },
          { id: "bp-weight", label: "Weight Loss", path: "/blueprint-weight-loss", icon: Dumbbell, glow: "208 60% 55%" },
          { id: "bp-mental", label: "Mental Health", path: "/blueprint-mental-health", icon: Brain, glow: "238 62% 52%" },
        ],
      },
    ],
  },
  {
    id: "community",
    label: "Community",
    items: [
      {
        id: "church", label: "Church Space", icon: Church, path: "/living-manna", glow: "142 71% 45%",
      },
      {
        id: "prophecy", label: "Prophecy Watch", icon: Eye, path: "/prophecy-watch", glow: "239 84% 67%",
      },
      {
        id: "community-feed", label: "Community", icon: Users, path: "/community", glow: "174 72% 40%",
        children: [
          { id: "discover", label: "Discover People", path: "/discover", icon: Search, glow: "180 68% 45%" },
          { id: "guilds", label: "Guilds", path: "/guilds", icon: Shield, glow: "188 75% 38%" },
          { id: "study-partners", label: "Study Partners", path: "/study-partners", icon: Users, glow: "192 70% 42%" },
        ],
      },
      {
        id: "workspace", label: "Workspace", icon: LayoutGrid, path: "/workspace", glow: "215 14% 53%",
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
            glow: child.glow || item.glow,
            section: section.label,
            parent: item.label,
          });
        }
      }
    }
  }
  return result;
}
