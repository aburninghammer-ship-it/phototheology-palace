// Re-export data from main data files
export { palaceFloors, type Floor, type Room } from '@/data/palaceData';
export {
  sanctuaryZones,
  sanctuaryElements,
  type SanctuaryElement,
  type SanctuaryZone,
} from '@/data/sanctuaryLibrary';

// Floor themes - Each floor has a distinct color for easy identification
export const FLOOR_THEMES = [
  {
    // Floor 1: Furnishing - Purple/Violet (Memory & Visualization)
    gradient: "from-violet-600 via-purple-600 to-fuchsia-600",
    symbol: "eye",
    tagline: "Build Your Visual Library",
    primaryColor: "#8b5cf6" // violet-500
  },
  {
    // Floor 2: Investigation - Blue (Detective Work)
    gradient: "from-blue-600 via-blue-500 to-indigo-600",
    symbol: "search",
    tagline: "Investigate Every Detail",
    primaryColor: "#3b82f6" // blue-500
  },
  {
    // Floor 3: Freestyle - Teal/Cyan (Life Integration)
    gradient: "from-teal-500 via-cyan-500 to-teal-600",
    symbol: "zap",
    tagline: "Connect Scripture to Life",
    primaryColor: "#14b8a6" // teal-500
  },
  {
    // Floor 4: Next Level - Green (Christ-Centered Structure)
    gradient: "from-green-600 via-emerald-500 to-green-500",
    symbol: "book-open",
    tagline: "See Christ in Everything",
    primaryColor: "#22c55e" // green-500
  },
  {
    // Floor 5: Vision - Orange/Amber (Prophecy & Sanctuary)
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
    symbol: "telescope",
    tagline: "Unlock Prophecy & Sanctuary",
    primaryColor: "#f97316" // orange-500
  },
  {
    // Floor 6: Three Heavens - Red/Rose (Cycles & Horizons)
    gradient: "from-red-600 via-rose-500 to-red-500",
    symbol: "globe",
    tagline: "Master Cycles & Horizons",
    primaryColor: "#ef4444" // red-500
  },
  {
    // Floor 7: Spiritual - Pink/Magenta (Transformation)
    gradient: "from-pink-600 via-fuchsia-500 to-pink-500",
    symbol: "flame",
    tagline: "Experience Transformation",
    primaryColor: "#ec4899" // pink-500
  },
  {
    // Floor 8: Master - Gold/Yellow (Integration & Mastery)
    gradient: "from-yellow-500 via-amber-400 to-yellow-400",
    symbol: "crown",
    tagline: "Become the Master",
    primaryColor: "#eab308" // yellow-500
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

// Layout constants - Increased spacing to prevent overlap
export const LAYOUT_CONFIG = {
  rootPosition: { x: 0, y: 0 },
  floorRadius: 800,      // Generous space between root and floors
  roomRadius: 500,       // Wide spacing between floors and rooms
  sanctuaryOffset: { x: 0, y: 1200 },  // Well below main tree
  zoneRadius: 350,       // Space between sanctuary zones
  nodeSpacing: {
    floor: 220,          // Ample floor-to-floor spacing
    room: 180,           // Room breathing room
    principle: 140,      // Principle card spacing
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
