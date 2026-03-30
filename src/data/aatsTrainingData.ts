// ─── AATS: Apologetics Avatar Training System ─────────────────────────────
// Central types, constants, and re-exports for the 6-phase training curriculum.

// ── Interfaces ──────────────────────────────────────────────────────────────

export interface AATSSubject {
  id: string;
  title: string;
  description: string;
}

export interface AATSSteelmanArgument {
  id: string;
  title: string;
  argument: string;
  hiddenAssumptions: string[];
  sdaResponse: string;
}

export interface AATSMindGame {
  id: string;
  name: string;
  description: string;
  example: string;
  detectionTip: string;
}

export interface AATSFallacy {
  id: string;
  name: string;
  definition: string;
  example: string;
  counterMove: string;
}

export interface AATSCounterStrategy {
  subjectId: string;
  title: string;
  sdaPosition: string;
  keyScriptures: string[];
  counterArguments: string[];
  closingStatement: string;
}

export interface AATSModule {
  id: string;
  subjectId: string;
  title: string;
  doctrineBrief: string;
  steelmanArguments: AATSSteelmanArgument[];
  hiddenAssumptions: string[];
  mindGames: AATSMindGame[];
  fallacies: AATSFallacy[];
  counterStrategy: AATSCounterStrategy;
  debateSimLink: string; // avatar ID for Defense Mode sparring
  debriefPrompt: string;
}

export interface AATSPhase {
  number: number;
  title: string;
  description: string;
  icon: string;
}

export interface AATSAvatarTraining {
  avatarId: string;
  avatarName: string;
  emoji: string;
  color: string;
  subjects: AATSSubject[];
  steelmanArguments: AATSSteelmanArgument[];
  mindGames: AATSMindGame[];
  fallacies: AATSFallacy[];
  counterStrategies: AATSCounterStrategy[];
  modules: AATSModule[];
}

// ── Constants ───────────────────────────────────────────────────────────────

export const AATS_PHASES: AATSPhase[] = [
  { number: 1, title: "Know Their Doctrine", description: "Study the core beliefs and theological positions of this worldview", icon: "BookOpen" },
  { number: 2, title: "Steelman Their Arguments", description: "Understand the strongest versions of their arguments", icon: "Shield" },
  { number: 3, title: "Detect Mind Games", description: "Identify psychological manipulation tactics they use", icon: "Brain" },
  { number: 4, title: "Expose Fallacies", description: "Recognize and counter logical fallacies in their reasoning", icon: "Zap" },
  { number: 5, title: "Master Counter-Strategies", description: "Build comprehensive SDA responses to each subject", icon: "Swords" },
  { number: 6, title: "Enter Combat", description: "Apply your training in live Defense Mode sparring", icon: "Flame" },
];

export const AATS_AVATAR_IDS = [
  "atheist",
  "scientist",
  "muslim",
  "evangelical",
  "catholic",
  "jw",
  "mormon",
  "bhi",
  "former-sda",
  "offshoot-sda",
  "jewish",
  "preterist",
  "futurist",
  "secular-scholar",
  "progressive-christian",
  "skeptical-exsda",
  "philosopher",
  "new-age",
  "anti-prophet",
  "internet-skeptic",
  "agnostic",
  "pentecostal",
  "anti-trinitarian",
] as const;

export type AATSAvatarId = (typeof AATS_AVATAR_IDS)[number];

export interface ArenaRing {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  avatarIds: AATSAvatarId[];
}

export const ARENA_RINGS: ArenaRing[] = [
  {
    id: "ring-1",
    title: "Ring 1 — Non-belief & Skepticism",
    description: "Atheists, agnostics, secular thinkers, and spiritual-but-not-religious challengers",
    icon: "HelpCircle",
    color: "text-slate-400",
    avatarIds: ["atheist", "scientist", "agnostic", "secular-scholar", "philosopher", "internet-skeptic", "new-age"],
  },
  {
    id: "ring-2",
    title: "Ring 2 — Non-Christian Religions",
    description: "Opponents from Islam, Judaism, Black Hebrew Israelites, and Mormonism",
    icon: "Users",
    color: "text-amber-400",
    avatarIds: ["muslim", "jewish", "bhi", "mormon"],
  },
  {
    id: "ring-3",
    title: "Ring 3 — Christianity",
    description: "Intra-Christian challengers including evangelicals, Catholics, ex-SDAs, and prophecy schools",
    icon: "Sparkles",
    color: "text-blue-400",
    avatarIds: ["evangelical", "catholic", "jw", "progressive-christian", "former-sda", "offshoot-sda", "skeptical-exsda", "anti-prophet", "preterist", "futurist", "pentecostal"],
  },
];

/** Cross-avatar subjects that appear across multiple worldviews */
export const CROSS_AVATAR_SUBJECTS: { id: string; title: string; avatarIds: AATSAvatarId[] }[] = [
  { id: "trinity", title: "The Trinity", avatarIds: ["muslim", "jw", "mormon", "bhi", "jewish", "philosopher"] },
  { id: "sabbath", title: "The Sabbath", avatarIds: ["evangelical", "catholic", "atheist", "progressive-christian", "former-sda"] },
  { id: "deity-of-christ", title: "Deity of Christ", avatarIds: ["muslim", "jw", "atheist", "jewish", "new-age"] },
  { id: "bible-authority", title: "Bible Authority", avatarIds: ["muslim", "catholic", "mormon", "secular-scholar", "atheist"] },
  { id: "salvation", title: "Salvation & Works", avatarIds: ["evangelical", "catholic", "mormon", "progressive-christian", "pentecostal"] },
  { id: "law-gospel", title: "Law vs Grace", avatarIds: ["evangelical", "catholic", "former-sda", "pentecostal"] },
  { id: "state-of-dead", title: "State of the Dead", avatarIds: ["evangelical", "catholic", "mormon", "new-age"] },
  { id: "investigative-judgment", title: "Investigative Judgment", avatarIds: ["evangelical", "former-sda", "skeptical-exsda", "philosopher"] },
  { id: "spirit-of-prophecy", title: "Spirit of Prophecy", avatarIds: ["anti-prophet", "former-sda", "skeptical-exsda", "offshoot-sda"] },
  { id: "prophecy-interpretation", title: "Prophecy Interpretation", avatarIds: ["preterist", "futurist", "secular-scholar"] },
  { id: "remnant-church", title: "Remnant Church", avatarIds: ["evangelical", "catholic", "former-sda", "offshoot-sda"] },
];

// ── Re-exports ──────────────────────────────────────────────────────────────

export { UNIVERSAL_MIND_GAMES, UNIVERSAL_FALLACIES, DETECTION_EXERCISES } from "./aats/mindGamesLab";

// ── Imports & Map ───────────────────────────────────────────────────────────

import { atheistTraining } from "./aats/atheistTraining";
import { muslimTraining } from "./aats/muslimTraining";
import { evangelicalTraining } from "./aats/evangelicalTraining";
import { catholicTraining } from "./aats/catholicTraining";
import { jwTraining } from "./aats/jwTraining";
import { mormonTraining } from "./aats/mormonTraining";
import { bhiTraining } from "./aats/bhiTraining";
import { formerSdaTraining } from "./aats/formerSdaTraining";
import { offshootSdaTraining } from "./aats/offshootSdaTraining";
import { jewishTraining } from "./aats/jewishTraining";
import { preteristTraining } from "./aats/preteristTraining";
import { futuristTraining } from "./aats/futuristTraining";
import { secularScholarTraining } from "./aats/secularScholarTraining";
import { progressiveChristianTraining } from "./aats/progressiveChristianTraining";
import { skepticalExsdaTraining } from "./aats/skepticalExsdaTraining";
import { philosopherTraining } from "./aats/philosopherTraining";
import { newAgeTraining } from "./aats/newAgeTraining";
import { antiProphetTraining } from "./aats/antiProphetTraining";
import { internetSkepticTraining } from "./aats/internetSkepticTraining";
import { agnosticTraining } from "./aats/agnosticTraining";
import { scientistTraining } from "./aats/scientistTraining";
import { pentecostalTraining } from "./aats/pentecostalTraining";

const TRAINING_MAP: Record<AATSAvatarId, AATSAvatarTraining> = {
  atheist: atheistTraining,
  scientist: scientistTraining,
  muslim: muslimTraining,
  evangelical: evangelicalTraining,
  catholic: catholicTraining,
  jw: jwTraining,
  mormon: mormonTraining,
  bhi: bhiTraining,
  "former-sda": formerSdaTraining,
  "offshoot-sda": offshootSdaTraining,
  jewish: jewishTraining,
  preterist: preteristTraining,
  futurist: futuristTraining,
  "secular-scholar": secularScholarTraining,
  "progressive-christian": progressiveChristianTraining,
  "skeptical-exsda": skepticalExsdaTraining,
  philosopher: philosopherTraining,
  "new-age": newAgeTraining,
  "anti-prophet": antiProphetTraining,
  "internet-skeptic": internetSkepticTraining,
  agnostic: agnosticTraining,
  pentecostal: pentecostalTraining,
};

export function getAvatarTraining(avatarId: AATSAvatarId): AATSAvatarTraining {
  return TRAINING_MAP[avatarId];
}

export function getAllAvatarTrainings(): AATSAvatarTraining[] {
  return AATS_AVATAR_IDS.map((id) => TRAINING_MAP[id]);
}
