// ─── War College: Tiered Avatar Training System ────────────────────────────
// Central types, constants, and re-exports for the 56-day War College curriculum.

import type { AATSAvatarId } from "./aatsTrainingData";

// ── Enums & Literals ────────────────────────────────────────────────────────

export type WarfareType =
  | "philosophical-attackers"
  | "scriptural-revisionists"
  | "cross-religious-apologists"
  | "internal-critics"
  | "prophetic-framework-challengers"
  | "cultural-psychological-critics"
  | "syncretic-spiritualists"
  | "ultimate-composite";

export type DifficultyTier = "foundation" | "intermediate" | "advanced";

export type RankId =
  | "initiate"
  | "scholar"
  | "analyst"
  | "watchman"
  | "defender"
  | "apologist"
  | "weapon-forger"
  | "champion";

// ── Core Interfaces ─────────────────────────────────────────────────────────

export interface MasteryCheckQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface WarCollegeDay {
  day: number;
  title: string;
  warfareType: WarfareType;
  difficulty: DifficultyTier;
  estimatedMinutes: number;
  xpReward: number;
  instructorVoice: string;
  avatarPresence: string;
  tacticalBriefing: string;
  drill: string;
  forgeAWeapon: string;
  jeevesDebrief: string;
  masteryCheck: MasteryCheckQuestion[];
}

export interface WarCollegeTrack {
  avatarId: AATSAvatarId;
  avatarName: string;
  emoji: string;
  color: string;
  warfareType: WarfareType;
  description: string;
  days: WarCollegeDay[];
}

// ── Rank System ─────────────────────────────────────────────────────────────

export interface WarCollegeRank {
  id: RankId;
  title: string;
  xpRequired: number;
  emoji: string;
  description: string;
}

export const WAR_COLLEGE_RANKS: WarCollegeRank[] = [
  { id: "initiate", title: "Initiate", xpRequired: 0, emoji: "🛡️", description: "Beginning the journey" },
  { id: "scholar", title: "Scholar", xpRequired: 500, emoji: "📖", description: "Grounded in doctrine" },
  { id: "analyst", title: "Analyst", xpRequired: 1200, emoji: "🔍", description: "Detecting hidden assumptions" },
  { id: "watchman", title: "Watchman", xpRequired: 2000, emoji: "⚔️", description: "Standing guard on the wall" },
  { id: "defender", title: "Defender", xpRequired: 3500, emoji: "🗡️", description: "Skilled in counter-attack" },
  { id: "apologist", title: "Apologist", xpRequired: 5500, emoji: "🏛️", description: "Mastering apologetic discourse" },
  { id: "weapon-forger", title: "Weapon Forger", xpRequired: 8000, emoji: "🔨", description: "Crafting reusable arguments" },
  { id: "champion", title: "Champion", xpRequired: 12000, emoji: "👑", description: "War College graduate" },
];

// ── Warfare Classification ──────────────────────────────────────────────────

export interface WarfareClassification {
  id: WarfareType;
  title: string;
  description: string;
  avatarIds: AATSAvatarId[];
  color: string;
}

export const WARFARE_CLASSIFICATIONS: WarfareClassification[] = [
  {
    id: "philosophical-attackers",
    title: "Philosophical Attackers",
    description: "Empirical skepticism, logical positivism, and philosophical naturalism",
    avatarIds: ["atheist", "agnostic", "philosopher"],
    color: "text-slate-400",
  },
  {
    id: "scriptural-revisionists",
    title: "Scriptural Revisionists",
    description: "Reinterpretation of biblical authority and doctrinal frameworks",
    avatarIds: ["evangelical", "catholic", "progressive-christian", "jw"],
    color: "text-blue-400",
  },
  {
    id: "cross-religious-apologists",
    title: "Cross-Religious Apologists",
    description: "Arguments from competing Abrahamic and restorationist traditions",
    avatarIds: ["muslim", "jewish", "bhi", "mormon"],
    color: "text-amber-400",
  },
  {
    id: "internal-critics",
    title: "Internal Critics",
    description: "Former and disillusioned Adventist voices",
    avatarIds: ["former-sda", "offshoot-sda", "skeptical-exsda"],
    color: "text-rose-400",
  },
  {
    id: "prophetic-framework-challengers",
    title: "Prophetic Framework Challengers",
    description: "Alternative prophetic interpretation schools",
    avatarIds: ["preterist", "futurist", "anti-prophet"],
    color: "text-violet-400",
  },
  {
    id: "cultural-psychological-critics",
    title: "Cultural/Psychological Critics",
    description: "Secular academic and viral internet criticism",
    avatarIds: ["internet-skeptic", "secular-scholar"],
    color: "text-emerald-400",
  },
  {
    id: "syncretic-spiritualists",
    title: "Syncretic Spiritualists",
    description: "New Age and spiritualist syncretism",
    avatarIds: ["new-age"],
    color: "text-cyan-400",
  },
  {
    id: "ultimate-composite",
    title: "Ultimate Composite",
    description: "Goliath \u2014 the final boss combining all warfare types",
    avatarIds: [],
    color: "text-red-500",
  },
];

// ── Progressive Depth ───────────────────────────────────────────────────────

export const DIFFICULTY_RANGES: {
  tier: DifficultyTier;
  days: [number, number];
  label: string;
  minutes: string;
  xpRange: [number, number];
}[] = [
  { tier: "foundation", days: [1, 14], label: "Foundation", minutes: "25-30 min", xpRange: [100, 150] },
  { tier: "intermediate", days: [15, 35], label: "Intermediate", minutes: "35-45 min", xpRange: [150, 225] },
  { tier: "advanced", days: [36, 56], label: "Advanced", minutes: "45-60 min", xpRange: [225, 300] },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

export function getDifficultyTier(day: number): DifficultyTier {
  if (day <= 14) return "foundation";
  if (day <= 35) return "intermediate";
  return "advanced";
}

export function getXPForDay(day: number): number {
  if (day <= 14) return 100 + Math.floor((day - 1) * (50 / 13));
  if (day <= 35) return 150 + Math.floor((day - 15) * (75 / 20));
  return 225 + Math.floor((day - 36) * (75 / 20));
}

export function getRank(totalXP: number): WarCollegeRank {
  const sorted = [...WAR_COLLEGE_RANKS].sort((a, b) => b.xpRequired - a.xpRequired);
  return sorted.find((r) => totalXP >= r.xpRequired) || WAR_COLLEGE_RANKS[0];
}

export function getNextRank(totalXP: number): WarCollegeRank | null {
  const current = getRank(totalXP);
  const idx = WAR_COLLEGE_RANKS.findIndex((r) => r.id === current.id);
  return idx < WAR_COLLEGE_RANKS.length - 1 ? WAR_COLLEGE_RANKS[idx + 1] : null;
}
