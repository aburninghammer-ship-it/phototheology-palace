import {
  Gamepad2,
  BookOpen,
  Video,
  Radio,
  GitBranch,
  Sword,
  LayoutGrid,
  Layers,
  Shield,
  DoorOpen,
  Map,
  Eye,
  Zap,
  Search,
  Diamond,
  Church,
  Flame,
  Globe,
  Brain,
  Users,
  Target,
  Link,
  ChefHat,
  Clock,
  Cross,
  Puzzle,
  Mic,
  Trophy,
  GraduationCap,
  LucideIcon,
} from 'lucide-react';

export type ScheduledActivityType =
  // Games
  | 'scrabble-pt'
  | 'chain-chess'
  | 'principle-cards'
  | 'phototheology-uno'
  | 'escape-dragon'
  | 'escape-room'
  | 'treasure-hunt'
  | 'story-room'
  | 'parallels-match'
  | 'speed-verse'
  | 'observation-flux'
  | 'symbol-decoder'
  | 'chef-challenge'
  | 'concentration-room'
  | 'five-dimensions'
  | 'sanctuary-blueprint'
  | 'quick-play'
  | 'biblical-parallels'
  | 'sanctuary-run'
  | 'prophecy-timeline'
  | 'time-zone-invasion'
  | 'christ-lock'
  | 'principle-sprint'
  | 'pt-jeopardy'
  | 'pt-family-feud'
  | 'freestyle-zone'
  | 'gideon-300'
  | 'master-exam'
  // Studies
  | 'group-study'
  | 'live-study-room'
  | 'branch-study'
  | 'live-demo';

export interface SchedulableActivity {
  id: ScheduledActivityType;
  name: string;
  description: string;
  icon: LucideIcon;
  category: 'games' | 'studies';
  route: string;
  minPlayers: number;
  maxPlayers: number;
  supportsVerse: boolean;
  gradient: string;
  /** If true, this game is available for free during Friday Night Game Night (Fri 6-11:59 PM) */
  fridayNightFreePass?: boolean;
}

export const SCHEDULABLE_ACTIVITIES: SchedulableActivity[] = [
  // ── Games ──────────────────────────────────────────────
  {
    id: 'story-room',
    name: 'Story Room Challenge',
    description: 'Arrange biblical stories in sequence',
    icon: BookOpen,
    category: 'games',
    route: '/games/story-room',
    minPlayers: 1,
    maxPlayers: 10,
    supportsVerse: false,
    gradient: 'from-emerald-500 to-green-600',
  },
  {
    id: 'parallels-match',
    name: 'Parallels Match',
    description: 'Match biblical parallels across Scripture',
    icon: Link,
    category: 'games',
    route: '/games/palace-cards',
    minPlayers: 1,
    maxPlayers: 4,
    supportsVerse: false,
    gradient: 'from-teal-500 to-cyan-500',
  },
  {
    id: 'speed-verse',
    name: 'Speed Verse Recall',
    description: 'Memorize and recall verses under time pressure',
    icon: Zap,
    category: 'games',
    route: '/games/speed-verse-3d',
    minPlayers: 1,
    maxPlayers: 10,
    supportsVerse: true,
    gradient: 'from-yellow-400 to-orange-500',
  },
  {
    id: 'principle-cards',
    name: 'Principle Cards',
    description: 'Multiplayer card game with Palace principles',
    icon: LayoutGrid,
    category: 'games',
    route: '/games/principle-cards',
    minPlayers: 2,
    maxPlayers: 6,
    supportsVerse: false,
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    id: 'observation-flux',
    name: 'Observation Flux',
    description: 'Type observations as verb blocks fall',
    icon: Eye,
    category: 'games',
    route: '/games/observation-room',
    minPlayers: 1,
    maxPlayers: 6,
    supportsVerse: true,
    gradient: 'from-sky-500 to-blue-600',
  },
  {
    id: 'symbol-decoder',
    name: 'Symbol Decoder',
    description: 'Match biblical symbols to their meanings',
    icon: Search,
    category: 'games',
    route: '/games/symbol-decoder',
    minPlayers: 1,
    maxPlayers: 4,
    supportsVerse: false,
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    id: 'chef-challenge',
    name: 'The Chef Challenge',
    description: 'Create a biblical recipe using only verse references',
    icon: ChefHat,
    category: 'games',
    route: '/games/chef-challenge',
    minPlayers: 1,
    maxPlayers: 8,
    supportsVerse: true,
    gradient: 'from-orange-500 to-red-500',
    fridayNightFreePass: true,
  },
  {
    id: 'concentration-room',
    name: 'Find Christ',
    description: 'Reveal Christ in every passage of Scripture',
    icon: Cross,
    category: 'games',
    route: '/games/concentration-room',
    minPlayers: 1,
    maxPlayers: 6,
    supportsVerse: true,
    gradient: 'from-amber-500 to-yellow-600',
  },
  {
    id: 'five-dimensions',
    name: 'Five Dimensions',
    description: 'View verses through Literal, Christ, Me, Church, Heaven',
    icon: Diamond,
    category: 'games',
    route: '/games/dimensions-room',
    minPlayers: 1,
    maxPlayers: 6,
    supportsVerse: true,
    gradient: 'from-fuchsia-500 to-pink-600',
  },
  {
    id: 'sanctuary-blueprint',
    name: 'Sanctuary Blueprint',
    description: 'Match sanctuary articles to their gospel meanings',
    icon: Church,
    category: 'games',
    route: '/games/blue-room',
    minPlayers: 1,
    maxPlayers: 6,
    supportsVerse: false,
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'quick-play',
    name: 'Quick Play',
    description: 'Fast PT symbol chain rounds inside PT Scrabble',
    icon: Flame,
    category: 'games',
    route: '/pt-scrabble?mode=quick',
    minPlayers: 1,
    maxPlayers: 4,
    supportsVerse: true,
    gradient: 'from-red-500 to-orange-600',
  },
  {
    id: 'biblical-parallels',
    name: 'Biblical Parallels Match',
    description: 'Match OT events with NT fulfillments',
    icon: Layers,
    category: 'games',
    route: '/games/concentration',
    minPlayers: 1,
    maxPlayers: 4,
    supportsVerse: false,
    gradient: 'from-indigo-500 to-blue-500',
  },
  {
    id: 'sanctuary-run',
    name: 'Sanctuary Run',
    description: 'Tell the gospel through 3 random sanctuary items',
    icon: Church,
    category: 'games',
    route: '/games/sanctuary-run',
    minPlayers: 1,
    maxPlayers: 4,
    supportsVerse: false,
    gradient: 'from-cyan-500 to-teal-600',
  },
  {
    id: 'prophecy-timeline',
    name: 'Prophecy Timeline',
    description: 'Place prophecies and fulfillments on a timeline',
    icon: Clock,
    category: 'games',
    route: '/training-drills',
    minPlayers: 1,
    maxPlayers: 6,
    supportsVerse: false,
    gradient: 'from-slate-500 to-gray-600',
  },
  {
    id: 'time-zone-invasion',
    name: 'Time Zone Invasion',
    description: 'Pick 2 time zones for a verse and defend your framing',
    icon: Globe,
    category: 'games',
    route: '/games/time-zone-invasion',
    minPlayers: 1,
    maxPlayers: 4,
    supportsVerse: true,
    gradient: 'from-green-500 to-emerald-600',
  },
  {
    id: 'christ-lock',
    name: 'Christ Lock',
    description: 'Draw a Christ-focus card and explain how the verse reveals Jesus',
    icon: Cross,
    category: 'games',
    route: '/games/christ-lock',
    minPlayers: 1,
    maxPlayers: 4,
    supportsVerse: true,
    gradient: 'from-yellow-500 to-amber-600',
  },
  {
    id: 'chain-chess',
    name: 'Chain Chess',
    description: 'Build biblical commentary chains vs opponent',
    icon: Sword,
    category: 'games',
    route: '/chain-chess',
    minPlayers: 2,
    maxPlayers: 2,
    supportsVerse: false,
    gradient: 'from-amber-500 to-orange-500',
    fridayNightFreePass: true,
  },
  {
    id: 'escape-dragon',
    name: 'Escape the Dragon',
    description: 'Co-op end-time survival game',
    icon: Shield,
    category: 'games',
    route: '/games/escape-dragon',
    minPlayers: 1,
    maxPlayers: 4,
    supportsVerse: false,
    gradient: 'from-slate-600 to-slate-800',
  },
  {
    id: 'escape-room',
    name: 'Escape Room',
    description: 'Solve biblical puzzles to escape',
    icon: DoorOpen,
    category: 'games',
    route: '/escape-room',
    minPlayers: 1,
    maxPlayers: 4,
    supportsVerse: false,
    gradient: 'from-indigo-500 to-purple-600',
    fridayNightFreePass: true,
  },
  {
    id: 'treasure-hunt',
    name: 'Treasure Hunt',
    description: 'Follow biblical clues to find treasure',
    icon: Map,
    category: 'games',
    route: '/treasure-hunt',
    minPlayers: 1,
    maxPlayers: 6,
    supportsVerse: false,
    gradient: 'from-yellow-500 to-amber-600',
  },
  {
    id: 'principle-sprint',
    name: 'Principle Sprint',
    description: 'Speed-identify PT principles for each verse',
    icon: Zap,
    category: 'games',
    route: '/games/principle-sprint',
    minPlayers: 1,
    maxPlayers: 6,
    supportsVerse: true,
    gradient: 'from-lime-500 to-green-500',
  },
  {
    id: 'phototheology-uno',
    name: 'Phototheology Uno',
    description: 'Biblical connections card game',
    icon: Layers,
    category: 'games',
    route: '/games/phototheology-uno',
    minPlayers: 2,
    maxPlayers: 8,
    supportsVerse: false,
    gradient: 'from-red-500 to-yellow-500',
    fridayNightFreePass: true,
  },
  {
    id: 'scrabble-pt',
    name: 'PT Scrabble',
    description: 'Build theological connections on a shared board',
    icon: Gamepad2,
    category: 'games',
    route: '/pt-scrabble',
    minPlayers: 2,
    maxPlayers: 20,
    supportsVerse: true,
    gradient: 'from-purple-500 to-blue-500',
    fridayNightFreePass: true,
  },
  {
    id: 'pt-jeopardy',
    name: 'PT Jeopardy',
    description: 'Bible knowledge Jeopardy-style with PT categories',
    icon: Brain,
    category: 'games',
    route: '/games/pt-jeopardy',
    minPlayers: 1,
    maxPlayers: 8,
    supportsVerse: false,
    gradient: 'from-blue-600 to-purple-600',
    fridayNightFreePass: true,
  },
  {
    id: 'pt-family-feud',
    name: 'PT Family Feud',
    description: 'Team-based Bible trivia with survey-style answers',
    icon: Users,
    category: 'games',
    route: '/games/pt-family-feud',
    minPlayers: 4,
    maxPlayers: 20,
    supportsVerse: false,
    gradient: 'from-orange-500 to-red-600',
  },
  {
    id: 'freestyle-zone',
    name: 'Freestyler Training Zone',
    description: 'Train theological reflexes with random prompts from Scripture, nature, and history',
    icon: Mic,
    category: 'games',
    route: '/games/freestyle-zone',
    minPlayers: 1,
    maxPlayers: 6,
    supportsVerse: false,
    gradient: 'from-orange-500 via-red-500 to-yellow-500',
  },
  {
    id: 'gideon-300',
    name: 'Gideon 300 Tournament',
    description: 'Live multiplayer elimination tournament — start with 300, refine to the remnant',
    icon: Trophy,
    category: 'games',
    route: '/games/gideon-300',
    minPlayers: 2,
    maxPlayers: 300,
    supportsVerse: false,
    gradient: 'from-amber-600 to-red-700',
  },
  {
    id: 'master-exam',
    name: 'Test Me: Master Exam',
    description: '50 AI-generated questions across all Palace domains — timed 90-minute assessment',
    icon: GraduationCap,
    category: 'games',
    route: '/games/master-exam',
    minPlayers: 1,
    maxPlayers: 1,
    supportsVerse: false,
    gradient: 'from-slate-600 to-indigo-700',
  },

  // ── Studies ─────────────────────────────────────────────
  {
    id: 'group-study',
    name: 'Group Bible Study',
    description: 'Gamified insights, voting, and discussion',
    icon: BookOpen,
    category: 'studies',
    route: '/group-study',
    minPlayers: 2,
    maxPlayers: 20,
    supportsVerse: true,
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'live-study-room',
    name: 'Live Study Room',
    description: 'Real-time collaborative study with voice',
    icon: Video,
    category: 'studies',
    route: '/live-study',
    minPlayers: 2,
    maxPlayers: 12,
    supportsVerse: true,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'branch-study',
    name: 'Branch Study Session',
    description: 'Interactive branching study with cross-references',
    icon: GitBranch,
    category: 'studies',
    route: '/branch-study',
    minPlayers: 2,
    maxPlayers: 8,
    supportsVerse: true,
    gradient: 'from-green-500 to-emerald-600',
  },
  {
    id: 'live-demo',
    name: 'Live',
    description: 'Go live with camera or screen share for teaching sessions',
    icon: Radio,
    category: 'studies',
    route: '/live-demo',
    minPlayers: 1,
    maxPlayers: 100,
    supportsVerse: false,
    gradient: 'from-red-500 to-rose-600',
  },
];

export function getActivityById(id: string): SchedulableActivity | undefined {
  return SCHEDULABLE_ACTIVITIES.find((a) => a.id === id);
}

export function getActivitiesByCategory(category: 'games' | 'studies'): SchedulableActivity[] {
  return SCHEDULABLE_ACTIVITIES.filter((a) => a.category === category);
}

export function getGameActivities(): SchedulableActivity[] {
  return getActivitiesByCategory('games');
}

export function getStudyActivities(): SchedulableActivity[] {
  return getActivitiesByCategory('studies');
}

/** Games eligible for free day passes on Friday Night Game Night */
export function getFridayNightFreePassGames(): SchedulableActivity[] {
  return SCHEDULABLE_ACTIVITIES.filter((a) => a.fridayNightFreePass);
}

/** IDs of games that allow Friday Night free passes */
export const FRIDAY_NIGHT_FREE_PASS_IDS: Set<ScheduledActivityType> = new Set(
  SCHEDULABLE_ACTIVITIES.filter((a) => a.fridayNightFreePass).map((a) => a.id)
);
