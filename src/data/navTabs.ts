import {
  Building2, BookOpen, Brain, Lightbulb, Gem, Network, Image, Sparkles,
  Calendar, Search, Video, StickyNote, Library, Zap, Trophy, Target,
  Sword, MessageSquare, CreditCard, Users, Crown, Church, Layers, Shield, Gamepad2,
  CalendarDays,
  Film,
  LayoutGrid,
  GraduationCap,
  User,
  PersonStanding,
  Eye,
  Scale,
  Headphones,
  Megaphone,
  Moon,
  Sun
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavTab {
  id: string;
  to: string;
  label: string;
  shortLabel?: string; // For mobile/compact display
  icon: LucideIcon;
  logoUrl?: string; // Optional image URL to display instead of icon
  gradient: {
    from: string;
    to: string;
    border: string;
    text: string;
    glow: string;
  };
  isDropdown?: boolean;
  dropdownItems?: { to: string; label: string; icon?: LucideIcon }[];
  requiresChurchMember?: boolean;
}

// Default tab order - users can customize this
export const DEFAULT_NAV_TABS: NavTab[] = [
  {
    id: "study-experience",
    to: "/study-experience",
    label: "Study Experience",
    shortLabel: "Study",
    icon: Layers,
    gradient: {
      from: "from-blue-500/10",
      to: "to-indigo-500/10",
      border: "border-blue-500/20",
      text: "from-blue-600 to-indigo-600",
      glow: "rgba(59,130,246,0.5)"
    }
  },
  {
    id: "test-me",
    to: "/test-me",
    label: "Test Me",
    shortLabel: "Test Me",
    icon: GraduationCap,
    gradient: {
      from: "from-red-500/10",
      to: "to-orange-500/10",
      border: "border-red-500/20",
      text: "from-red-600 to-orange-600",
      glow: "rgba(239,68,68,0.5)"
    }
  },
  {
    id: "prophecy-watch",
    to: "/prophecy-watch",
    label: "Prophecy Watch",
    icon: Eye,
    gradient: {
      from: "from-indigo-500/10",
      to: "to-blue-500/10",
      border: "border-indigo-500/20",
      text: "from-indigo-600 to-blue-600",
      glow: "rgba(99,102,241,0.5)"
    }
  },
  {
    id: "culture-controversy",
    to: "/culture-controversy",
    label: "Christ & Culture",
    shortLabel: "Culture",
    icon: Scale,
    gradient: {
      from: "from-rose-500/10",
      to: "to-pink-500/10",
      border: "border-rose-500/20",
      text: "from-rose-600 to-pink-600",
      glow: "rgba(244,63,94,0.5)"
    }
  },
  {
    id: "my-profile",
    to: "/my-profile",
    label: "My Profile",
    icon: User,
    gradient: {
      from: "from-violet-500/10",
      to: "to-purple-500/10",
      border: "border-violet-500/20",
      text: "from-violet-600 to-purple-600",
      glow: "rgba(139,92,246,0.5)"
    }
  },
  {
    id: "palace",
    to: "/palace",
    label: "Palace",
    icon: Building2,
    gradient: {
      from: "from-amber-500/10",
      to: "to-orange-500/10",
      border: "border-amber-500/20",
      text: "from-amber-600 to-orange-600",
      glow: "rgba(245,158,11,0.5)"
    }
  },
  {
    id: "palace-tour",
    to: "/palace/tour",
    label: "Tour the Palace",
    shortLabel: "Tour",
    icon: Headphones,
    gradient: {
      from: "from-teal-500/10",
      to: "to-cyan-500/10",
      border: "border-teal-500/20",
      text: "from-teal-600 to-cyan-600",
      glow: "rgba(20,184,166,0.5)"
    }
  },
  {
    id: "freestyle",
    to: "/palace/freestyle",
    label: "Freestyle",
    icon: Zap,
    gradient: {
      from: "from-lime-500/10",
      to: "to-green-500/10",
      border: "border-lime-500/20",
      text: "from-lime-600 to-green-600",
      glow: "rgba(132,204,22,0.5)"
    }
  },
  {
    id: "church-space",
    to: "/living-manna",
    label: "My Church Space",
    shortLabel: "Church",
    icon: Church,
    gradient: {
      from: "from-emerald-500/10",
      to: "to-green-500/10",
      border: "border-emerald-500/20",
      text: "from-emerald-600 to-green-600",
      glow: "rgba(16,185,129,0.5)"
    },
    requiresChurchMember: true
  },
  {
    id: "bible",
    to: "/bible",
    label: "Phototheology Study Bible",
    shortLabel: "Study Bible",
    icon: BookOpen,
    gradient: {
      from: "from-blue-500/10",
      to: "to-cyan-500/10",
      border: "border-blue-500/20",
      text: "from-blue-600 to-cyan-600",
      glow: "rgba(59,130,246,0.5)"
    }
  },
  {
    id: "study-buddy",
    to: "/study-buddy",
    label: "Study Buddy",
    icon: Brain,
    gradient: {
      from: "from-slate-500/10",
      to: "to-zinc-500/10",
      border: "border-slate-500/20",
      text: "from-slate-500 to-zinc-500",
      glow: "rgba(100,116,139,0.5)"
    }
  },
  {
    id: "research-assistant",
    to: "/research-assistant",
    label: "Research Assistant",
    shortLabel: "Research",
    icon: GraduationCap,
    gradient: {
      from: "from-emerald-500/10",
      to: "to-teal-500/10",
      border: "border-emerald-500/20",
      text: "from-emerald-600 to-teal-600",
      glow: "rgba(16,185,129,0.5)"
    }
  },
  {
    id: "study-ideas",
    to: "/study-ideas",
    label: "Study Ideas",
    icon: Lightbulb,
    gradient: {
      from: "from-amber-500/10",
      to: "to-yellow-500/10",
      border: "border-amber-500/20",
      text: "from-amber-600 to-yellow-600",
      glow: "rgba(245,158,11,0.5)"
    }
  },
  {
    id: "give-me-a-gem",
    to: "/give-me-a-gem",
    label: "Give Me A Gem",
    shortLabel: "Gem",
    icon: Gem,
    gradient: {
      from: "from-emerald-500/10",
      to: "to-teal-500/10",
      border: "border-emerald-500/20",
      text: "from-emerald-600 to-teal-600",
      glow: "rgba(16,185,129,0.5)"
    }
  },
  {
    id: "mind-map",
    to: "/mind-map",
    label: "Mind Map Palace",
    shortLabel: "Mind Map",
    icon: Network,
    gradient: {
      from: "from-indigo-500/10",
      to: "to-violet-500/10",
      border: "border-indigo-500/20",
      text: "from-indigo-600 to-violet-600",
      glow: "rgba(99,102,241,0.5)"
    }
  },
  {
    id: "image-bible",
    to: "/image-bible",
    label: "PT Image Bible",
    shortLabel: "Image Bible",
    icon: Image,
    gradient: {
      from: "from-amber-500/10",
      to: "to-orange-500/10",
      border: "border-amber-500/20",
      text: "from-amber-600 to-orange-600",
      glow: "rgba(245,158,11,0.5)"
    }
  },
  {
    id: "card-deck",
    to: "/card-deck",
    label: "Phototheology Study Deck",
    shortLabel: "Study Deck",
    icon: Sparkles,
    gradient: {
      from: "from-violet-500/10",
      to: "to-purple-500/10",
      border: "border-violet-500/20",
      text: "from-violet-600 to-purple-600",
      glow: "rgba(139,92,246,0.5)"
    }
  },
  {
    id: "reading-plans",
    to: "/reading-plans",
    label: "Reading Plans",
    icon: Calendar,
    gradient: {
      from: "from-emerald-500/10",
      to: "to-teal-500/10",
      border: "border-emerald-500/20",
      text: "from-emerald-600 to-teal-600",
      glow: "rgba(16,185,129,0.5)"
    }
  },
  {
    id: "devotionals",
    to: "/devotionals",
    label: "Devotionals",
    icon: BookOpen,
    gradient: {
      from: "from-pink-500/10",
      to: "to-rose-500/10",
      border: "border-pink-500/20",
      text: "from-pink-600 to-rose-600",
      glow: "rgba(236,72,153,0.5)"
    }
  },
  {
    id: "night-watches",
    to: "/night-watches",
    label: "Night Watches",
    shortLabel: "Night",
    icon: Moon,
    gradient: {
      from: "from-indigo-500/10",
      to: "to-violet-500/10",
      border: "border-indigo-500/20",
      text: "from-indigo-600 to-violet-600",
      glow: "rgba(99,102,241,0.5)"
    }
  },
  {
    id: "morning-watches",
    to: "/morning-watches",
    label: "Morning Watches",
    shortLabel: "Morning",
    icon: Sun,
    gradient: {
      from: "from-amber-500/10",
      to: "to-orange-500/10",
      border: "border-amber-500/20",
      text: "from-amber-600 to-orange-600",
      glow: "rgba(245,158,11,0.5)"
    }
  },
  {
    id: "character-profiles",
    to: "/character-profiles",
    label: "Character Profiles",
    shortLabel: "Characters",
    icon: PersonStanding,
    gradient: {
      from: "from-indigo-500/10",
      to: "to-purple-500/10",
      border: "border-indigo-500/20",
      text: "from-indigo-600 to-purple-600",
      glow: "rgba(99,102,241,0.5)"
    }
  },
  {
    id: "encyclopedia",
    to: "/encyclopedia",
    label: "Encyclopedia",
    icon: Search,
    gradient: {
      from: "from-indigo-500/10",
      to: "to-blue-500/10",
      border: "border-indigo-500/20",
      text: "from-indigo-600 to-blue-600",
      glow: "rgba(99,102,241,0.5)"
    }
  },
  {
    id: "video-training",
    to: "/video-training",
    label: "Video Training",
    shortLabel: "Videos",
    icon: Video,
    gradient: {
      from: "from-red-500/10",
      to: "to-orange-500/10",
      border: "border-red-500/20",
      text: "from-red-600 to-orange-600",
      glow: "rgba(239,68,68,0.5)"
    }
  },
  {
    id: "my-studies",
    to: "/my-studies",
    label: "My Studies",
    icon: BookOpen,
    gradient: {
      from: "from-sky-500/10",
      to: "to-blue-500/10",
      border: "border-sky-500/20",
      text: "from-sky-600 to-blue-600",
      glow: "rgba(14,165,233,0.5)"
    }
  },
  {
    id: "notes",
    to: "/notes",
    label: "Notes",
    icon: StickyNote,
    gradient: {
      from: "from-yellow-500/10",
      to: "to-amber-500/10",
      border: "border-yellow-500/20",
      text: "from-yellow-600 to-amber-600",
      glow: "rgba(234,179,8,0.5)"
    }
  },
  {
    id: "libraries",
    to: "/libraries",
    label: "Libraries",
    icon: Library,
    gradient: {
      from: "from-indigo-500/10",
      to: "to-purple-500/10",
      border: "border-indigo-500/20",
      text: "from-indigo-600 to-purple-600",
      glow: "rgba(99,102,241,0.5)"
    }
  },
  {
    id: "cota-series",
    to: "/cota-series",
    label: "COTA Series",
    shortLabel: "COTA",
    icon: Crown,
    gradient: {
      from: "from-amber-500/10",
      to: "to-orange-500/10",
      border: "border-amber-500/20",
      text: "from-amber-600 to-orange-600",
      glow: "rgba(245,158,11,0.5)"
    }
  },
  {
    id: "games",
    to: "/games",
    label: "Games",
    icon: Zap,
    gradient: {
      from: "from-fuchsia-500/10",
      to: "to-pink-500/10",
      border: "border-fuchsia-500/20",
      text: "from-fuchsia-600 to-pink-600",
      glow: "rgba(217,70,239,0.5)"
    }
  },
  {
    id: "schedule",
    to: "/schedule",
    label: "Scheduled Games",
    shortLabel: "Schedule",
    icon: CalendarDays,
    gradient: {
      from: "from-sky-500/10",
      to: "to-indigo-500/10",
      border: "border-sky-500/20",
      text: "from-sky-600 to-indigo-600",
      glow: "rgba(14,165,233,0.5)"
    }
  },
  {
    id: "memory",
    to: "/memory",
    label: "Memory Palace",
    shortLabel: "Memory",
    icon: Brain,
    gradient: {
      from: "from-cyan-500/10",
      to: "to-teal-500/10",
      border: "border-cyan-500/20",
      text: "from-cyan-600 to-teal-600",
      glow: "rgba(6,182,212,0.5)"
    }
  },
  {
    id: "study-tools",
    to: "#",
    label: "Study Tools",
    icon: Layers,
    isDropdown: true,
    gradient: {
      from: "from-emerald-500/10",
      to: "to-teal-500/10",
      border: "border-emerald-500/20",
      text: "from-emerald-600 to-teal-600",
      glow: "rgba(16,185,129,0.5)"
    },
    dropdownItems: [
      { to: "/study-experience", label: "Ultimate Study Experience (U.S.E)", icon: Layers },
      { to: "/interlinear", label: "Interlinear Bible" },
      { to: "/bible-lexicon", label: "Greek/Hebrew Lexicon" },
      { to: "/bible-timeline", label: "Bible Timeline" },
      { to: "/bible-atlas", label: "Bible Atlas" },
      { to: "/flashcards", label: "Flashcards", icon: Layers },
      { to: "/daily-reading", label: "Daily Reading", icon: Calendar },
      { to: "/training-drills", label: "Training Drills", icon: Target },
      { to: "/study-partners", label: "Study Partners", icon: Users },
      { to: "/sources", label: "Source Library" },
      { to: "/infographics", label: "Infographic Generator" },
      { to: "/study-series", label: "Study Series" }
    ]
  },
  {
    id: "leaderboard",
    to: "/leaderboard",
    label: "Leaderboard",
    icon: Trophy,
    gradient: {
      from: "from-yellow-500/10",
      to: "to-amber-500/10",
      border: "border-yellow-500/20",
      text: "from-yellow-600 to-amber-600",
      glow: "rgba(234,179,8,0.5)"
    }
  },
  {
    id: "drill-drill",
    to: "/drill-drill",
    label: "Gather Fragments",
    shortLabel: "Fragments",
    icon: Target,
    gradient: {
      from: "from-orange-500/10",
      to: "to-red-500/10",
      border: "border-orange-500/20",
      text: "from-orange-600 to-red-600",
      glow: "rgba(249,115,22,0.5)"
    }
  },
  {
    id: "analyze-thoughts",
    to: "/analyze-thoughts",
    label: "Analyze My Thoughts",
    shortLabel: "Analyze",
    icon: Lightbulb,
    gradient: {
      from: "from-yellow-500/10",
      to: "to-amber-500/10",
      border: "border-yellow-500/20",
      text: "from-yellow-600 to-amber-600",
      glow: "rgba(234,179,8,0.5)"
    }
  },
  {
    id: "polish",
    to: "/polish",
    label: "Polish",
    shortLabel: "Polish",
    icon: Film,
    gradient: {
      from: "from-fuchsia-500/10",
      to: "to-purple-500/10",
      border: "border-fuchsia-500/20",
      text: "from-fuchsia-600 to-purple-600",
      glow: "rgba(217,70,239,0.5)"
    }
  },
  {
    id: "spiritual-training",
    to: "/spiritual-training",
    label: "Christian Art of War Dojo",
    shortLabel: "Dojo",
    icon: Sword,
    gradient: {
      from: "from-red-500/10",
      to: "to-rose-500/10",
      border: "border-red-500/20",
      text: "from-red-600 to-rose-600",
      glow: "rgba(239,68,68,0.5)"
    }
  },
  {
    id: "gpts",
    to: "#",
    label: "GPTs",
    icon: Sparkles,
    isDropdown: true,
    gradient: {
      from: "from-violet-500/10",
      to: "to-purple-500/10",
      border: "border-violet-500/20",
      text: "from-violet-600 to-purple-600",
      glow: "rgba(139,92,246,0.5)"
    },
    dropdownItems: [
      { to: "/phototheologygpt", label: "Phototheology GPT" },
      { to: "/branch-study", label: "BranchStudy" },
      { to: "/kidgpt", label: "Kid GPT" },
      { to: "/daniel-revelation-gpt", label: "Daniel & Revelation GPT" },
      { to: "/apologetics-gpt", label: "Apologetics GPT" }
    ]
  },
  {
    id: "blueprints",
    to: "#",
    label: "Blueprints",
    icon: Building2,
    isDropdown: true,
    gradient: {
      from: "from-blue-500/10",
      to: "to-indigo-500/10",
      border: "border-blue-500/20",
      text: "from-blue-600 to-indigo-600",
      glow: "rgba(59,130,246,0.5)"
    },
    dropdownItems: [
      { to: "/blueprint-marriage", label: "Dating & Marriage" },
      { to: "/blueprint-grief", label: "Grieving" },
      { to: "/blueprint-stronghold", label: "Breaking Strongholds" },
      { to: "/blueprint-weight-loss", label: "Weight Loss" },
      { to: "/blueprint-mental-health", label: "Mental Health" }
    ]
  },
  {
    id: "courses",
    to: "/courses",
    label: "Courses",
    icon: BookOpen,
    gradient: {
      from: "from-emerald-500/10",
      to: "to-green-500/10",
      border: "border-emerald-500/20",
      text: "from-emerald-600 to-green-600",
      glow: "rgba(16,185,129,0.5)"
    }
  },
  {
    id: "challenges",
    to: "#",
    label: "Challenges",
    icon: Zap,
    isDropdown: true,
    gradient: {
      from: "from-orange-500/10",
      to: "to-red-500/10",
      border: "border-orange-500/20",
      text: "from-orange-600 to-red-600",
      glow: "rgba(249,115,22,0.5)"
    },
    dropdownItems: [
      { to: "/daily-challenges", label: "Daily Challenges" },
      { to: "/challenge-board", label: "Public Challenge Board" },
      { to: "/genesis-challenge", label: "Genesis High Rise" }
    ]
  },
  {
    id: "achievements",
    to: "/achievements",
    label: "Achievements",
    icon: Trophy,
    gradient: {
      from: "from-amber-500/10",
      to: "to-yellow-500/10",
      border: "border-amber-500/20",
      text: "from-amber-600 to-yellow-600",
      glow: "rgba(245,158,11,0.5)"
    }
  },
  {
    id: "mastery",
    to: "/mastery",
    label: "Mastery",
    icon: Crown,
    gradient: {
      from: "from-rose-500/10",
      to: "to-pink-500/10",
      border: "border-rose-500/20",
      text: "from-rose-600 to-pink-600",
      glow: "rgba(244,63,94,0.5)"
    }
  },
  {
    id: "series",
    to: "/bible-study-series",
    label: "Series",
    icon: BookOpen,
    gradient: {
      from: "from-sky-500/10",
      to: "to-blue-500/10",
      border: "border-sky-500/20",
      text: "from-sky-600 to-blue-600",
      glow: "rgba(14,165,233,0.5)"
    }
  },
  {
    id: "sermon-builder",
    to: "/sermon-builder",
    label: "Sermon Builder",
    shortLabel: "Sermons",
    icon: MessageSquare,
    gradient: {
      from: "from-purple-500/10",
      to: "to-fuchsia-500/10",
      border: "border-purple-500/20",
      text: "from-purple-600 to-fuchsia-600",
      glow: "rgba(168,85,247,0.5)"
    }
  },
  {
    id: "sermon-ideas",
    to: "/sermon-ideas",
    label: "My Sermon Ideas",
    shortLabel: "Sermon Ideas",
    icon: Lightbulb,
    gradient: {
      from: "from-orange-500/10",
      to: "to-amber-500/10",
      border: "border-orange-500/20",
      text: "from-orange-600 to-amber-600",
      glow: "rgba(249,115,22,0.5)"
    }
  },
  {
    id: "pricing",
    to: "/pricing",
    label: "Pricing",
    icon: CreditCard,
    gradient: {
      from: "from-lime-500/10",
      to: "to-green-500/10",
      border: "border-lime-500/20",
      text: "from-lime-600 to-green-600",
      glow: "rgba(132,204,22,0.5)"
    }
  },
  {
    id: "workspace",
    to: "/workspace",
    label: "Workspace",
    shortLabel: "Workspace",
    icon: LayoutGrid,
    gradient: {
      from: "from-slate-500/10",
      to: "to-zinc-500/10",
      border: "border-slate-500/20",
      text: "from-slate-600 to-zinc-600",
      glow: "rgba(100,116,139,0.5)"
    }
  },
  {
    id: "amplify",
    to: "/amplify",
    label: "Amplify",
    shortLabel: "Amplify",
    icon: Zap,
    gradient: {
      from: "from-blue-500/10",
      to: "to-indigo-500/10",
      border: "border-blue-500/20",
      text: "from-blue-600 to-indigo-600",
      glow: "rgba(59,130,246,0.5)"
    }
  },
  {
    id: "remix",
    to: "/remix",
    label: "Remix",
    shortLabel: "Remix",
    icon: Megaphone,
    gradient: {
      from: "from-amber-500/10",
      to: "to-orange-500/10",
      border: "border-amber-500/20",
      text: "from-amber-600 to-orange-600",
      glow: "rgba(245,158,11,0.5)"
    }
  },
  {
    id: "community",
    to: "#",
    label: "Community",
    icon: Users,
    isDropdown: true,
    gradient: {
      from: "from-teal-500/10",
      to: "to-cyan-500/10",
      border: "border-teal-500/20",
      text: "from-teal-600 to-cyan-600",
      glow: "rgba(20,184,166,0.5)"
    },
    dropdownItems: [
      { to: "/community", label: "Community Feed", icon: Users },
      { to: "/discover", label: "Discover People", icon: Search },
      { to: "/pt-multiplayer", label: "PT Multiplayer", icon: Gamepad2 },
      { to: "/guilds", label: "Guilds", icon: Shield }
    ]
  }
];

// Get tab by ID
export function getTabById(id: string): NavTab | undefined {
  return DEFAULT_NAV_TABS.find(tab => tab.id === id);
}

// Get ordered tabs based on user preferences
export function getOrderedTabs(
  pinnedIds: string[],
  customOrder: string[],
  isChurchMember: boolean = false
): NavTab[] {
  // Filter out church-only tabs if not a member
  const availableTabs = DEFAULT_NAV_TABS.filter(
    tab => !tab.requiresChurchMember || isChurchMember
  );

  // Get pinned tabs first (in pinned order)
  const pinnedTabs = pinnedIds
    .map(id => availableTabs.find(tab => tab.id === id))
    .filter((tab): tab is NavTab => tab !== undefined);

  // Get remaining tabs, ordered by customOrder if available
  const remainingTabs = availableTabs.filter(tab => !pinnedIds.includes(tab.id));

  if (customOrder.length > 0) {
    remainingTabs.sort((a, b) => {
      const aIndex = customOrder.indexOf(a.id);
      const bIndex = customOrder.indexOf(b.id);
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  }

  return [...pinnedTabs, ...remainingTabs];
}
