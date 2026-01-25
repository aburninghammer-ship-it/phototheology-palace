// Re-export data from main data files
export { palaceFloors, type Floor, type Room } from '@/data/palaceData';
export {
  sanctuaryZones,
  sanctuaryElements,
  type SanctuaryElement,
  type SanctuaryZone,
} from '@/data/sanctuaryLibrary';

// Floor themes (from VisualPalace.tsx)
export const FLOOR_THEMES = [
  {
    gradient: "from-violet-600 via-purple-600 to-fuchsia-600",
    symbol: "eye",
    tagline: "Build Your Visual Library"
  },
  {
    gradient: "from-blue-600 via-indigo-600 to-blue-700",
    symbol: "search",
    tagline: "Investigate Every Detail"
  },
  {
    gradient: "from-cyan-600 via-teal-600 to-emerald-600",
    symbol: "zap",
    tagline: "Connect Scripture to Life"
  },
  {
    gradient: "from-emerald-600 via-green-600 to-teal-600",
    symbol: "book-open",
    tagline: "See Christ in Everything"
  },
  {
    gradient: "from-amber-600 via-orange-600 to-red-600",
    symbol: "telescope",
    tagline: "Unlock Prophecy & Sanctuary"
  },
  {
    gradient: "from-rose-600 via-pink-600 to-red-600",
    symbol: "globe",
    tagline: "Master Cycles & Horizons"
  },
  {
    gradient: "from-violet-600 via-purple-600 to-indigo-600",
    symbol: "flame",
    tagline: "Experience Transformation"
  },
  {
    gradient: "from-yellow-600 via-amber-600 to-orange-600",
    symbol: "crown",
    tagline: "Become the Master"
  }
];

// Sanctuary zone colors
export const SANCTUARY_ZONE_COLORS: Record<string, string> = {
  'camp': 'from-gray-500 to-gray-600',
  'courtyard': 'from-amber-500 to-orange-500',
  'holy-place': 'from-blue-500 to-indigo-500',
  'most-holy-place': 'from-purple-500 to-violet-600',
};

// Analysis mode configurations
export const ANALYSIS_MODE_CONFIG = {
  beginner: {
    label: 'Beginner',
    description: 'Simplified, fewer nodes (3-5 rooms max)',
    maxRooms: 5,
    includeConfidenceScores: false,
    includeScholarlyEvidence: false,
  },
  scholar: {
    label: 'Scholar',
    description: 'Dense, all applicable rooms with cross-references',
    maxRooms: null,
    includeConfidenceScores: true,
    includeScholarlyEvidence: true,
  },
  preacher: {
    label: 'Preacher',
    description: 'Sermon-optimized with teaching hooks',
    maxRooms: 10,
    includeConfidenceScores: false,
    includeScholarlyEvidence: false,
  },
  research: {
    label: 'Research',
    description: 'Exhaustive analysis with academic rigor',
    maxRooms: null,
    includeConfidenceScores: true,
    includeScholarlyEvidence: true,
  },
};

// Layout constants
export const LAYOUT_CONFIG = {
  rootPosition: { x: 0, y: 0 },
  floorRadius: 350,
  roomRadius: 200,
  sanctuaryOffset: { x: 0, y: 500 },
  zoneRadius: 180,
  nodeSpacing: {
    floor: 100,
    room: 80,
    principle: 60,
  },
};

// Node styling
export const NODE_STYLES = {
  root: {
    width: 280,
    height: 120,
  },
  floor: {
    width: 200,
    height: 80,
  },
  room: {
    width: 160,
    height: 70,
  },
  sanctuary: {
    width: 220,
    height: 90,
  },
  sanctuaryZone: {
    width: 180,
    height: 75,
  },
  sanctuaryElement: {
    width: 150,
    height: 65,
  },
  principle: {
    width: 200,
    height: 100,
  },
};
