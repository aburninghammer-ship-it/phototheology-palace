// ─── War College Strategic Manuscript Types ─────────────────────────────────
// Ultra-immersive, long-form study format for AATS training.

export interface WarCollegeDay {
  dayNumber: number;
  title: string;
  subtitle: string;
  avatarId: string;
  avatarName: string;
  track: string;
  rank: WarCollegeRank;
  estimatedMinutes: number;
  /** The continuous manuscript body — raw markdown, long-form */
  manuscript: string;
  /** Post-manuscript tactical sections */
  defenseApplication: {
    commonObjection: string;
    eliteResponse: string;
  };
  forgeExercise: string;
  masteryChecks: string[];
  tomorrowTeaser: string;
}

export type WarCollegeRank =
  | "initiate"
  | "apprentice"
  | "strategist"
  | "tactician"
  | "commander";

export const RANK_CONFIG: Record<WarCollegeRank, {
  label: string;
  weeks: number[];
  color: string;
  emoji: string;
  description: string;
}> = {
  initiate: {
    label: "Initiate",
    weeks: [1, 2],
    color: "text-slate-400",
    emoji: "🛡️",
    description: "Foundational Formation — building epistemological foundations",
  },
  apprentice: {
    label: "Apprentice",
    weeks: [3, 4],
    color: "text-blue-400",
    emoji: "⚔️",
    description: "Advanced Engagement — confronting core challenges",
  },
  strategist: {
    label: "Strategist",
    weeks: [5, 6],
    color: "text-amber-400",
    emoji: "🎯",
    description: "Strategic Depth — multi-layered theological defense",
  },
  tactician: {
    label: "Tactician",
    weeks: [7, 8],
    color: "text-purple-400",
    emoji: "🏆",
    description: "Tactical Mastery — proactive theological offense",
  },
  commander: {
    label: "Commander",
    weeks: [9, 10],
    color: "text-red-400",
    emoji: "👑",
    description: "Elite Command — comprehensive battlefield dominance",
  },
};

export function getRankForWeek(week: number): WarCollegeRank {
  for (const [rank, config] of Object.entries(RANK_CONFIG)) {
    if (config.weeks.includes(week)) return rank as WarCollegeRank;
  }
  return "initiate";
}

export function getRankForDay(day: number): WarCollegeRank {
  const week = Math.ceil(day / 7);
  return getRankForWeek(week);
}

export interface WarCollegeTrack {
  id: string;
  title: string;
  avatarId: string;
  avatarName: string;
  description: string;
  totalDays: number;
  emoji: string;
}

export const WAR_COLLEGE_TRACKS: WarCollegeTrack[] = [
  {
    id: "philosophical-warfare",
    title: "Philosophical Warfare",
    avatarId: "atheist",
    avatarName: "Dr. Marcus Steele",
    description: "Reclaiming epistemology, reason, and metaphysical ground against naturalistic materialism",
    totalDays: 56,
    emoji: "🧠",
  },
  {
    id: "abrahamic-defense",
    title: "Abrahamic Defense",
    avatarId: "muslim",
    avatarName: "Imam Khalid",
    description: "Defending biblical authority and Christology against Islamic monotheism",
    totalDays: 56,
    emoji: "📖",
  },
  {
    id: "protestant-apologetics",
    title: "Protestant Apologetics",
    avatarId: "evangelical",
    avatarName: "Pastor Jake",
    description: "Navigating grace-alone theology, Sabbath challenges, and prophetic identity",
    totalDays: 56,
    emoji: "⛪",
  },
];
