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
  LucideIcon,
} from 'lucide-react';

export type ScheduledActivityType =
  | 'scrabble-pt'
  | 'chain-chess'
  | 'principle-cards'
  | 'phototheology-uno'
  | 'escape-dragon'
  | 'escape-room'
  | 'treasure-hunt'
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
}

export const SCHEDULABLE_ACTIVITIES: SchedulableActivity[] = [
  // Games
  {
    id: 'scrabble-pt',
    name: 'PT Scrabble',
    description: 'Build theological connections on a shared board',
    icon: Gamepad2,
    category: 'games',
    route: '/pt-scrabble',
    minPlayers: 2,
    maxPlayers: 10,
    supportsVerse: true,
    gradient: 'from-purple-500 to-blue-500',
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

  // Studies
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
