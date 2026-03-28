import {
  Building2, BookOpen, Brain, StickyNote, Sword, Zap, Gem, Gamepad2,
  Search, Clock, MapPin, Languages, BookMarked, Crown, Layers,
  Sparkles, GraduationCap, Eye, Calendar, CalendarDays,
  MessageSquare, Users, Trophy, Target, Church, LayoutGrid,
  Headphones, Image, Network, Film, PersonStanding, Shield,
  Lightbulb, Video, Library, Scale, Megaphone, CreditCard,
  Heart, Flame, Dumbbell, PenTool, HeartHandshake, User,
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

// Flat list matching exactly the original navigation tabs from navTabs.ts
// Every item has a unique HSL glow
export const DOCK_ITEMS: DockItem[] = [
  { id: "test-me", label: "Test Me", icon: GraduationCap, path: "/test-me", glow: "0 84% 60%" },
  { id: "prophecy-watch", label: "Prophecy Watch", icon: Eye, path: "/prophecy-watch", glow: "239 84% 67%" },
  { id: "culture-controversy", label: "Christ & Culture", icon: Scale, path: "/culture-controversy", glow: "342 82% 54%" },
  { id: "my-profile", label: "My Profile", icon: User, path: "/my-profile", glow: "263 70% 58%" },
  { id: "palace", label: "Palace", icon: Building2, path: "/palace", glow: "32 95% 53%" },
  { id: "palace-tour", label: "Tour the Palace", icon: Headphones, path: "/palace/tour", glow: "174 72% 40%" },
  { id: "freestyle", label: "Freestyle", icon: Zap, path: "/palace/freestyle", glow: "84 81% 44%" },
  { id: "church-space", label: "My Church Space", icon: Church, path: "/living-manna", glow: "142 71% 45%" },
  { id: "bible", label: "Study Bible", icon: BookOpen, path: "/bible", glow: "210 100% 56%" },
  { id: "study-buddy", label: "Study Buddy", icon: Brain, path: "/study-buddy", glow: "215 16% 53%" },
  { id: "research-assistant", label: "Research Assistant", icon: GraduationCap, path: "/research-assistant", glow: "152 68% 42%" },
  { id: "study-ideas", label: "Study Ideas", icon: Lightbulb, path: "/study-ideas", glow: "38 92% 50%" },
  { id: "give-me-a-gem", label: "Give Me A Gem", icon: Gem, path: "/give-me-a-gem", glow: "158 80% 42%" },
  { id: "mind-map", label: "Mind Map Palace", icon: Network, path: "/mind-map", glow: "245 80% 67%" },
  { id: "image-bible", label: "PT Image Bible", icon: Image, path: "/image-bible", glow: "36 88% 50%" },
  { id: "card-deck", label: "Study Deck", icon: Sparkles, path: "/card-deck", glow: "271 76% 53%" },
  { id: "reading-plans", label: "Reading Plans", icon: Calendar, path: "/reading-plans", glow: "160 84% 39%" },
  { id: "devotionals", label: "Devotionals", icon: Flame, path: "/devotionals", glow: "328 85% 58%" },
  { id: "character-profiles", label: "Character Profiles", icon: PersonStanding, path: "/character-profiles", glow: "240 72% 55%" },
  { id: "encyclopedia", label: "Encyclopedia", icon: Search, path: "/encyclopedia", glow: "230 78% 62%" },
  { id: "video-training", label: "Video Training", icon: Video, path: "/video-training", glow: "4 78% 55%" },
  { id: "my-studies", label: "My Studies", icon: BookMarked, path: "/my-studies", glow: "205 95% 50%" },
  { id: "notes", label: "Notes", icon: StickyNote, path: "/notes", glow: "45 100% 51%" },
  { id: "libraries", label: "Libraries", icon: Library, path: "/libraries", glow: "250 65% 55%" },
  { id: "cota-series", label: "COTA Series", icon: Crown, path: "/cota-series", glow: "30 90% 52%" },
  { id: "games", label: "Games", icon: Gamepad2, path: "/games", glow: "292 84% 61%" },
  { id: "schedule", label: "Scheduled Games", icon: CalendarDays, path: "/schedule", glow: "200 80% 52%" },
  { id: "memory", label: "Memory Palace", icon: Brain, path: "/memory", glow: "187 92% 43%" },
  {
    id: "study-tools", label: "Study Tools", icon: Layers, path: "/interlinear", glow: "160 70% 42%",
    children: [
      { id: "interlinear", label: "Interlinear Bible", path: "/interlinear", icon: Languages, glow: "168 78% 38%" },
      { id: "lexicon", label: "Greek/Hebrew Lexicon", path: "/bible-lexicon", icon: BookOpen, glow: "155 70% 45%" },
      { id: "timeline", label: "Bible Timeline", path: "/bible-timeline", icon: Clock, glow: "145 65% 40%" },
      { id: "atlas", label: "Bible Atlas", path: "/bible-atlas", icon: MapPin, glow: "170 80% 35%" },
      { id: "flashcards", label: "Flashcards", path: "/flashcards", icon: Layers, glow: "165 75% 42%" },
      { id: "daily-reading", label: "Daily Reading", path: "/daily-reading", icon: Calendar, glow: "199 89% 48%" },
      { id: "training-drills", label: "Training Drills", path: "/training-drills", icon: Target, glow: "355 72% 50%" },
      { id: "study-partners", label: "Study Partners", path: "/study-partners", icon: Users, glow: "192 70% 42%" },
      { id: "sources", label: "Source Library", path: "/sources", icon: Library, glow: "235 70% 58%" },
      { id: "infographics", label: "Infographic Generator", path: "/infographics", icon: Image, glow: "175 72% 38%" },
      { id: "study-series", label: "Study Series", path: "/study-series", icon: BookMarked, glow: "195 85% 50%" },
    ],
  },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy, path: "/leaderboard", glow: "42 93% 50%" },
  { id: "drill-drill", label: "Gather Fragments", icon: Target, path: "/drill-drill", glow: "25 95% 53%" },
  { id: "analyze-thoughts", label: "Analyze My Thoughts", icon: Lightbulb, path: "/analyze-thoughts", glow: "48 93% 47%" },
  { id: "polish", label: "Polish", icon: Film, path: "/polish", glow: "285 78% 58%" },
  { id: "spiritual-training", label: "Dojo", icon: Sword, path: "/spiritual-training", glow: "0 72% 50%" },
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
    id: "blueprints", label: "Blueprints", icon: HeartHandshake, path: "/blueprint-marriage", glow: "220 70% 55%",
    children: [
      { id: "bp-marriage", label: "Dating & Marriage", path: "/blueprint-marriage", icon: Heart, glow: "225 72% 52%" },
      { id: "bp-grief", label: "Grieving", path: "/blueprint-grief", icon: HeartHandshake, glow: "212 65% 50%" },
      { id: "bp-stronghold", label: "Breaking Strongholds", path: "/blueprint-stronghold", icon: Shield, glow: "232 68% 48%" },
      { id: "bp-weight", label: "Weight Loss", path: "/blueprint-weight-loss", icon: Dumbbell, glow: "208 60% 55%" },
      { id: "bp-mental", label: "Mental Health", path: "/blueprint-mental-health", icon: Brain, glow: "238 62% 52%" },
    ],
  },
  { id: "courses", label: "Courses", icon: GraduationCap, path: "/courses", glow: "138 68% 42%" },
  {
    id: "challenges", label: "Challenges", icon: Zap, path: "/daily-challenges", glow: "16 88% 50%",
    children: [
      { id: "daily-challenges", label: "Daily Challenges", path: "/daily-challenges", icon: Zap, glow: "12 85% 55%" },
      { id: "challenge-board", label: "Public Challenge Board", path: "/challenge-board", icon: Trophy, glow: "28 92% 48%" },
      { id: "genesis-challenge", label: "Genesis High Rise", path: "/genesis-challenge", icon: Building2, glow: "18 80% 58%" },
    ],
  },
  { id: "achievements", label: "Achievements", icon: Trophy, path: "/achievements", glow: "35 88% 55%" },
  { id: "mastery", label: "Mastery", icon: Crown, path: "/mastery", glow: "348 83% 52%" },
  { id: "series", label: "Series", icon: BookOpen, path: "/bible-study-series", glow: "195 85% 50%" },
  { id: "sermon-builder", label: "Sermon Builder", icon: MessageSquare, path: "/sermon-builder", glow: "270 56% 65%" },
  { id: "sermon-ideas", label: "My Sermon Ideas", icon: Lightbulb, path: "/sermon-ideas", glow: "20 85% 50%" },
  { id: "pricing", label: "Pricing", icon: CreditCard, path: "/pricing", glow: "84 75% 48%" },
  { id: "workspace", label: "Workspace", icon: LayoutGrid, path: "/workspace", glow: "215 14% 53%" },
  { id: "amplify", label: "Amplify", icon: Megaphone, path: "/amplify", glow: "218 88% 54%" },
  { id: "remix", label: "Remix", icon: Megaphone, path: "/remix", glow: "27 90% 50%" },
  {
    id: "community", label: "Community", icon: Users, path: "/community", glow: "174 72% 40%",
    children: [
      { id: "community-feed", label: "Community Feed", path: "/community", icon: Users, glow: "180 68% 45%" },
      { id: "discover", label: "Discover People", path: "/discover", icon: Search, glow: "188 75% 38%" },
      { id: "multiplayer", label: "PT Multiplayer", path: "/pt-multiplayer", icon: Gamepad2, glow: "300 70% 55%" },
      { id: "guilds", label: "Guilds", path: "/guilds", icon: Shield, glow: "192 70% 42%" },
    ],
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
