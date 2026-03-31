import {
  Building2, BookOpen, Brain, StickyNote, Sword, Zap, Gem, Gamepad2,
  Search, Crown, Layers,
  Sparkles, GraduationCap, Eye, Calendar, CalendarDays,
  MessageSquare, Users, Trophy, Target, Church, LayoutGrid,
  Headphones, Image, Network, Film, PersonStanding, Shield,
  Lightbulb, Video, Library, Scale, Megaphone, CreditCard,
  Heart, Dumbbell, HeartHandshake, User, Flame, BookMarked,
  Languages, Microscope, Map, Clock, BookText, ImageIcon, Layers3,
  Glasses,
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

// ONLY top-level tabs from navTabs.ts (no dropdown sub-items)
// Organized under 13 major categories
export const DOCK_ITEMS: DockItem[] = [
  {
    id: "palace", label: "Palace", icon: Building2, path: "/palace", glow: "32 95% 53%",
    children: [
      { id: "palace-tour", label: "Tour the Palace", path: "/palace/tour", icon: Headphones, glow: "174 72% 40%" },
      { id: "freestyle", label: "Freestyle", path: "/palace/freestyle", icon: Zap, glow: "84 81% 44%" },
      { id: "mind-map", label: "Mind Map Palace", path: "/mind-map", icon: Network, glow: "245 80% 67%" },
      { id: "memory", label: "Memory Palace", path: "/memory", icon: Brain, glow: "187 92% 43%" },
      { id: "image-bible", label: "PT Image Bible", path: "/image-bible", icon: Image, glow: "36 88% 50%" },
      { id: "card-deck", label: "Study Deck", path: "/card-deck", icon: Sparkles, glow: "271 76% 53%" },
    ],
  },
  {
    id: "bible", label: "Study Bible", icon: BookOpen, path: "/bible", glow: "210 100% 56%",
    children: [
      { id: "encyclopedia", label: "Encyclopedia", path: "/encyclopedia", icon: Search, glow: "230 78% 62%" },
      { id: "character-profiles", label: "Character Profiles", path: "/character-profiles", icon: PersonStanding, glow: "240 72% 55%" },
      { id: "study-buddy", label: "Study Buddy", path: "/study-buddy", icon: Brain, glow: "215 16% 53%" },
      { id: "research-assistant", label: "Research Assistant", path: "/research-assistant", icon: GraduationCap, glow: "152 68% 42%" },
      { id: "give-me-a-gem", label: "Give Me A Gem", path: "/give-me-a-gem", icon: Gem, glow: "158 80% 42%" },
      { id: "analyze-thoughts", label: "Analyze My Thoughts", path: "/analyze-thoughts", icon: Lightbulb, glow: "48 93% 47%" },
      { id: "drill-drill", label: "Gather Fragments", path: "/drill-drill", icon: Target, glow: "25 95% 53%" },
      { id: "genealogy-decoder", label: "Genealogy Decoder", path: "/research-assistant?tab=genealogy", icon: Network, glow: "320 70% 55%" },
      { id: "my-studies", label: "My Studies", path: "/my-studies", icon: BookMarked, glow: "205 95% 50%" },
      { id: "study-ideas", label: "Study Ideas", path: "/study-ideas", icon: Lightbulb, glow: "38 92% 50%" },
    ],
  },
  {
    id: "study-tools", label: "Study Tools", icon: Layers3, path: "/bible-lexicon", glow: "180 70% 45%",
    children: [
      { id: "interlinear", label: "Interlinear Bible", path: "/bible/John/1?strongs=true", icon: BookText, glow: "210 80% 50%" },
      { id: "lexicon", label: "Greek/Hebrew Lexicon", path: "/bible-lexicon", icon: Languages, glow: "220 75% 55%" },
      { id: "bible-timeline", label: "Bible Timeline", path: "/bible-timeline", icon: Clock, glow: "40 90% 50%" },
      { id: "bible-atlas", label: "Bible Atlas", path: "/bible-atlas", icon: Map, glow: "160 70% 45%" },
      { id: "flashcards", label: "Flashcards", path: "/card-deck", icon: Sparkles, glow: "271 76% 53%" },
      { id: "daily-reading", label: "Daily Reading", path: "/daily-reading", icon: Calendar, glow: "160 84% 39%" },
      { id: "training-drills", label: "Training Drills", path: "/test-me", icon: Target, glow: "0 84% 60%" },
      { id: "study-partners", label: "Study Partners", path: "/community", icon: Users, glow: "174 72% 40%" },
      { id: "source-library", label: "Source Library", path: "/libraries", icon: Library, glow: "250 65% 55%" },
      { id: "infographic-gen", label: "Infographic Generator", path: "/image-bible", icon: ImageIcon, glow: "36 88% 50%" },
      { id: "study-series", label: "Study Series", path: "/bible-study-series", icon: BookOpen, glow: "195 85% 50%" },
    ],
  },
  {
    id: "pt-course", label: "PT Course", icon: BookText, path: "/phototheology-course", glow: "32 90% 50%",
  },
  {
    id: "training", label: "Training", icon: GraduationCap, path: "/test-me", glow: "0 84% 60%",
    children: [
      { id: "test-me", label: "Test Me", path: "/test-me", icon: GraduationCap, glow: "0 84% 60%" },
      { id: "video-training", label: "Video Training", path: "/video-training", icon: Video, glow: "4 78% 55%" },
      { id: "courses", label: "Courses", path: "/courses", icon: GraduationCap, glow: "138 68% 42%" },
      { id: "mastery", label: "Mastery", path: "/mastery", icon: Crown, glow: "348 83% 52%" },
      { id: "spiritual-training", label: "Dojo", path: "/spiritual-training", icon: Sword, glow: "0 72% 50%" },
    ],
  },
  {
    id: "audio-library", label: "Audio Library", icon: Headphones, path: "/audio-library", glow: "280 75% 60%",
  },
  {
    id: "devotional", label: "Devotional", icon: Flame, path: "/devotionals", glow: "328 85% 58%",
    children: [
      { id: "devotionals", label: "Devotionals", path: "/devotionals", icon: Flame, glow: "328 85% 58%" },
      { id: "reading-plans", label: "Reading Plans", path: "/reading-plans", icon: Calendar, glow: "160 84% 39%" },
      { id: "notes", label: "Notes", path: "/notes", icon: StickyNote, glow: "45 100% 51%" },
      { id: "prophecy-watch", label: "Prophecy Watch", path: "/prophecy-watch", icon: Eye, glow: "239 84% 67%" },
      { id: "culture-controversy", label: "Christ & Culture", path: "/culture-controversy", icon: Scale, glow: "342 82% 54%" },
    ],
  },
  {
    id: "cota", label: "COTA", icon: Crown, path: "/cota-series", glow: "30 90% 52%",
    children: [
      { id: "cota-series", label: "COTA Series", path: "/cota-series", icon: Crown, glow: "30 90% 52%" },
    ],
  },
  {
    id: "games", label: "Games", icon: Gamepad2, path: "/games", glow: "292 84% 61%",
    children: [
      { id: "schedule", label: "Scheduled Games", path: "/schedule", icon: CalendarDays, glow: "200 80% 52%" },
    ],
  },
  {
    id: "challenges", label: "Challenges", icon: Zap, path: "/daily-challenges", glow: "16 88% 50%",
    children: [
      { id: "daily-challenges", label: "Daily Challenges", path: "/daily-challenges", icon: Zap, glow: "12 85% 55%" },
      { id: "challenge-board", label: "Public Challenge Board", path: "/challenge-board", icon: Trophy, glow: "28 92% 48%" },
      { id: "leaderboard", label: "Leaderboard", path: "/leaderboard", icon: Trophy, glow: "42 93% 50%" },
      { id: "achievements", label: "Achievements", path: "/achievements", icon: Trophy, glow: "35 88% 55%" },
      
    ],
  },
  {
    id: "sermon", label: "Sermon Builder", icon: MessageSquare, path: "/sermon-builder", glow: "270 56% 65%",
    children: [
      { id: "sermon-ideas", label: "My Sermon Ideas", path: "/sermon-ideas", icon: Lightbulb, glow: "20 85% 50%" },
      { id: "amplify", label: "Amplify", path: "/amplify", icon: Megaphone, glow: "218 88% 54%" },
      { id: "remix", label: "Remix", path: "/remix", icon: Megaphone, glow: "27 90% 50%" },
      { id: "polish", label: "Polish", path: "/polish", icon: Film, glow: "285 78% 58%" },
    ],
  },
  {
    id: "blueprints", label: "Blueprint", icon: HeartHandshake, path: "/blueprint-marriage", glow: "220 70% 55%",
    children: [
      { id: "bp-marriage", label: "Dating & Marriage", path: "/blueprint-marriage", icon: Heart, glow: "225 72% 52%" },
      { id: "bp-grief", label: "Grieving", path: "/blueprint-grief", icon: HeartHandshake, glow: "212 65% 50%" },
      { id: "bp-stronghold", label: "Breaking Strongholds", path: "/blueprint-stronghold", icon: Shield, glow: "232 68% 48%" },
      { id: "bp-weight", label: "Weight Loss", path: "/blueprint-weight-loss", icon: Dumbbell, glow: "208 60% 55%" },
      { id: "bp-mental", label: "Mental Health", path: "/blueprint-mental-health", icon: Brain, glow: "238 62% 52%" },
    ],
  },
  {
    id: "gpts", label: "GPTs", icon: Sparkles, path: "/phototheologygpt", glow: "263 70% 58%",
    children: [
      { id: "pt-gpt", label: "Phototheology GPT", path: "/phototheologygpt", icon: Sparkles, glow: "268 72% 55%" },
      { id: "branch-study", label: "BranchStudy", path: "/branch-study", icon: Network, glow: "280 65% 55%" },
      { id: "kid-gpt", label: "Kid GPT", path: "/kidgpt", icon: Users, glow: "290 60% 62%" },
      { id: "dr-gpt", label: "Daniel & Revelation GPT", path: "/daniel-revelation-gpt", icon: Eye, glow: "255 75% 50%" },
      { id: "apol-gpt", label: "Apologetics GPT", path: "/apologetics-gpt", icon: Shield, glow: "248 60% 45%" },
    ],
  },
  {
    id: "community", label: "Community", icon: Users, path: "/community", glow: "174 72% 40%",
    children: [
      { id: "my-profile", label: "My Profile", path: "/my-profile", icon: User, glow: "263 70% 58%" },
    ],
  },
  {
    id: "church", label: "My Church Space", icon: Church, path: "/living-manna", glow: "142 71% 45%",
  },
  {
    id: "pricing", label: "Pricing", icon: CreditCard, path: "/pricing", glow: "84 75% 48%",
  },
  {
    id: "workspace", label: "Workspace", icon: LayoutGrid, path: "/workspace", glow: "215 14% 53%",
  },
];

/** Flatten all items + children into a searchable list */
export function getAllDockItems(): { label: string; path: string; icon: LucideIcon; glow: string; parent?: string }[] {
  const result: { label: string; path: string; icon: LucideIcon; glow: string; parent?: string }[] = [];
  for (const item of DOCK_ITEMS) {
    result.push({ label: item.label, path: item.path, icon: item.icon, glow: item.glow });
    if (item.children) {
      for (const child of item.children) {
        result.push({
          label: child.label,
          path: child.path,
          icon: child.icon || item.icon,
          glow: child.glow || item.glow,
          parent: item.label,
        });
      }
    }
  }
  return result;
}
