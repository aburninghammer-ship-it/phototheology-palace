// ─── War College Strategic Manuscript Types ─────────────────────────────────
// Ultra-immersive, long-form study format for AATS training.
// ALL 21 avatars × 56 days = fully AI-generated manuscripts.

import { AATS_AVATAR_IDS, getAvatarTraining, type AATSAvatarId } from "@/data/aatsTrainingData";
import { DEFENSE_OPPONENTS } from "@/data/defenseModeOpponents";

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
  ringId: string;
}

// ─── Track title mapping per avatar ─────────────────────────────────────────
const TRACK_TITLES: Record<string, { title: string; description: string }> = {
  atheist: {
    title: "Philosophical Warfare",
    description: "Reclaiming epistemology, reason, and metaphysical ground against naturalistic materialism",
  },
  scientist: {
    title: "Empirical Battlefront",
    description: "Defending creation, the Flood, and biblical history against empirical and scientific objections",
  },
  muslim: {
    title: "Abrahamic Defense",
    description: "Defending biblical authority and Christology against Islamic monotheism",
  },
  evangelical: {
    title: "Protestant Apologetics",
    description: "Navigating grace-alone theology, Sabbath challenges, and prophetic identity",
  },
  catholic: {
    title: "Rome & Reformation",
    description: "Confronting papal authority, tradition supremacy, and sacramental theology",
  },
  jw: {
    title: "Watchtower Deconstruction",
    description: "Exposing Christological distortion, false prophecy, and organizational control",
  },
  mormon: {
    title: "Latter-Day Analysis",
    description: "Challenging extra-biblical revelation, polytheism, and prophetic authority claims",
  },
  bhi: {
    title: "Israelite Identity Crisis",
    description: "Addressing racial exclusivism, covenant theology distortion, and identity-based hermeneutics",
  },
  "former-sda": {
    title: "Remnant Under Fire",
    description: "Defending Adventist identity against those who once held it",
  },
  "offshoot-sda": {
    title: "Splinter Theology",
    description: "Addressing offshoots that radicalize, distort, or fragment SDA theology",
  },
  jewish: {
    title: "Messianic Confrontation",
    description: "Defending Christ as the Messiah against rabbinic Judaism's rejection",
  },
  preterist: {
    title: "Prophecy Fulfilled Fallacy",
    description: "Refuting the claim that all prophecy was fulfilled by 70 AD",
  },
  futurist: {
    title: "Dispensational Dismantlement",
    description: "Confronting secret rapture, two-covenant theology, and prophetic misplacement",
  },
  "secular-scholar": {
    title: "Academy vs. Revelation",
    description: "Defending Scripture against higher criticism, JEDP hypothesis, and textual skepticism",
  },
  "progressive-christian": {
    title: "Progressive Theology Exposed",
    description: "Confronting moral relativism, deconstruction theology, and redefined doctrines",
  },
  "skeptical-exsda": {
    title: "The Wounded Skeptic",
    description: "Engaging hurt, disillusioned former believers with truth and compassion",
  },
  philosopher: {
    title: "Philosophical Battleground",
    description: "Engaging existentialism, moral subjectivism, and anti-theistic philosophy",
  },
  "new-age": {
    title: "Cosmic Deception",
    description: "Confronting pantheism, spiritual universalism, and occult infiltration of Christianity",
  },
  "anti-prophet": {
    title: "Prophetic Defense",
    description: "Defending the Spirit of Prophecy against attacks on Ellen White's authority and integrity",
  },
  "internet-skeptic": {
    title: "Digital Battlefield",
    description: "Refuting viral contradictions, meme theology, and surface-level skepticism",
  },
  agnostic: {
    title: "The Uncertainty Front",
    description: "Engaging honest doubt with epistemological clarity and evidential faith",
  },
};

// ─── Ring classification ────────────────────────────────────────────────────
function getRingId(avatarId: string): string {
  const ring1 = ["atheist", "scientist", "agnostic", "secular-scholar", "philosopher", "internet-skeptic", "new-age"];
  const ring2 = ["muslim", "jewish", "bhi", "mormon"];
  if (ring1.includes(avatarId)) return "ring-1";
  if (ring2.includes(avatarId)) return "ring-2";
  return "ring-3";
}

// ─── Generate ALL War College tracks from AATS avatars ──────────────────────
export const WAR_COLLEGE_TRACKS: WarCollegeTrack[] = AATS_AVATAR_IDS.map((avatarId) => {
  const training = getAvatarTraining(avatarId);
  const meta = TRACK_TITLES[avatarId] || {
    title: `${training.avatarName} Warfare`,
    description: `Strategic apologetics formation against ${training.avatarName}`,
  };

  return {
    id: `wc-${avatarId}`,
    title: meta.title,
    avatarId,
    avatarName: training.avatarName,
    description: meta.description,
    totalDays: 56,
    emoji: training.emoji,
    ringId: getRingId(avatarId),
  };
});

// ─── Grouped by ring for display ────────────────────────────────────────────
export const WAR_COLLEGE_RINGS = [
  {
    id: "ring-1",
    title: "Ring 1 — Non-Belief & Skepticism",
    color: "text-slate-400",
    tracks: WAR_COLLEGE_TRACKS.filter((t) => t.ringId === "ring-1"),
  },
  {
    id: "ring-2",
    title: "Ring 2 — Non-Christian Religions",
    color: "text-amber-400",
    tracks: WAR_COLLEGE_TRACKS.filter((t) => t.ringId === "ring-2"),
  },
  {
    id: "ring-3",
    title: "Ring 3 — Intra-Christian Challengers",
    color: "text-blue-400",
    tracks: WAR_COLLEGE_TRACKS.filter((t) => t.ringId === "ring-3"),
  },
];
