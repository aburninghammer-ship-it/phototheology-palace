// ============================================================================
// FORGE & DEFEND — 6-Week Defense Mode Challenge Configuration
// ============================================================================

export interface DifficultyTier {
  weeks: number[];
  tier: "foundational" | "advanced" | "elite";
  label: string;
  topics: string[];
}

export interface TeamLevel {
  id: string;
  label: string;
  minPoints: number;
  color: string;
  emoji: string;
}

export interface ScoringRule {
  battleWin: number;
  roundScoreMultiplier: number;
  weaponForged: number;
  weaponUsedInBattle: number;
  participationBonus: number;
  carryPenalty: number;
  memberAbsent: number;
  noWeaponsUsed: number;
  bossVictory: number;
  perfectWeek: number;
}

export const DIFFICULTY_TIERS: DifficultyTier[] = [
  {
    weeks: [1, 2],
    tier: "foundational",
    label: "Foundational",
    topics: ["sabbath", "state-of-dead", "hellfire", "law-gospel", "diet", "second-coming", "new-covenant", "millennium"],
  },
  {
    weeks: [3, 4],
    tier: "advanced",
    label: "Advanced Theological",
    topics: ["sanctuary-1844", "trinity", "little-horn", "prophecy", "rapture", "tongues", "antichrist", "investigative-judgment", "scapegoat", "preterism", "futurism"],
  },
  {
    weeks: [5, 6],
    tier: "elite",
    label: "Elite Endgame",
    topics: ["remnant", "preterism", "futurism", "israel-identity", "antiochus-epiphanes", "three-angels", "mark-of-the-beast"],
  },
];

export const TEAM_LEVELS: TeamLevel[] = [
  { id: "bronze", label: "Bronze Defenders", minPoints: 0, color: "amber-700", emoji: "🛡️" },
  { id: "silver", label: "Silver Apologists", minPoints: 500, color: "gray-400", emoji: "⚔️" },
  { id: "gold", label: "Gold Warriors", minPoints: 1200, color: "yellow-500", emoji: "🏆" },
  { id: "platinum", label: "Platinum Champions", minPoints: 2500, color: "cyan-400", emoji: "💎" },
  { id: "remnant-elite", label: "Remnant Elite", minPoints: 5000, color: "purple-500", emoji: "👑" },
];

export const SCORING: ScoringRule = {
  battleWin: 100,
  roundScoreMultiplier: 10,    // per round quality score (1-10) x 10
  weaponForged: 25,
  weaponUsedInBattle: 15,
  participationBonus: 50,      // all members spoke equally
  carryPenalty: -30,           // one member did >60% of speaking
  memberAbsent: -20,           // member absent from battle
  noWeaponsUsed: -10,          // using no forged weapons
  bossVictory: 300,
  perfectWeek: 75,             // all battles completed + balanced
};

export const AI_ENEMY_SQUADS: Record<string, { name: string; opponents: string[]; description: string }> = {
  "atheist-trio": {
    name: "The Secular Front",
    opponents: ["atheist", "secular-scholar", "philosopher"],
    description: "Empirical skeptics + academic critics + philosophical challengers",
  },
  "abrahamic-trio": {
    name: "The Abrahamic Council",
    opponents: ["muslim", "catholic", "evangelical"],
    description: "Islamic monotheism + Catholic tradition + Protestant grace-alone",
  },
  "identity-trio": {
    name: "The Identity Legion",
    opponents: ["bhi", "mormon", "jw"],
    description: "Ethnic Israel claims + restored gospel + Watchtower theology",
  },
  "insider-trio": {
    name: "The Insider Threat",
    opponents: ["former-sda", "skeptical-exsda", "anti-prophet"],
    description: "Ex-Adventist critics + trauma survivors + Ellen White specialists",
  },
  "modern-trio": {
    name: "The Modern Challenge",
    opponents: ["progressive-christian", "new-age", "internet-skeptic"],
    description: "Progressive theology + New Age spirituality + viral skepticism",
  },
  "charismatic-trio": {
    name: "The Charismatic Front",
    opponents: ["pentecostal", "evangelical", "progressive-christian"],
    description: "Pentecostal fire + evangelical grace-alone + progressive inclusion",
  },
  "prophecy-trio": {
    name: "The Prophecy Tribunal",
    opponents: ["preterist", "futurist", "secular-scholar"],
    description: "70 AD fulfillment + dispensational futurism + academic dating criticism",
  },
};

export const WEEKLY_CADENCE = {
  prepDays: ["Monday", "Tuesday", "Wednesday"],
  battleDays: ["Thursday", "Friday", "Saturday"],
  reviewDay: "Sunday",
  battlesPerWeek: 3,
};

export function getTierForWeek(week: number): DifficultyTier {
  return DIFFICULTY_TIERS.find((t) => t.weeks.includes(week)) || DIFFICULTY_TIERS[0];
}

export function getTeamLevel(points: number): TeamLevel {
  const sorted = [...TEAM_LEVELS].sort((a, b) => b.minPoints - a.minPoints);
  return sorted.find((l) => points >= l.minPoints) || TEAM_LEVELS[0];
}

export function calculateCarryPenalty(
  speakingTimes: { memberId: string; seconds: number }[]
): { penalty: number; isCarrying: boolean; carrierIds: string[]; absentIds: string[] } {
  const total = speakingTimes.reduce((sum, m) => sum + m.seconds, 0);
  if (total === 0) return { penalty: 0, isCarrying: false, carrierIds: [], absentIds: [] };

  const carrierIds: string[] = [];
  const absentIds: string[] = [];

  for (const m of speakingTimes) {
    const pct = m.seconds / total;
    if (pct > 0.6) carrierIds.push(m.memberId);
    if (pct < 0.05) absentIds.push(m.memberId);
  }

  let penalty = 0;
  if (carrierIds.length > 0) penalty += SCORING.carryPenalty;
  penalty += absentIds.length * SCORING.memberAbsent;

  return { penalty, isCarrying: carrierIds.length > 0, carrierIds, absentIds };
}

export function calculateBattlePoints(
  roundScores: number[],
  won: boolean,
  weaponsUsed: number,
  participationBalanced: boolean,
  isBoss: boolean
): number {
  let points = 0;
  // Round scores (each judge score 1-10 multiplied by 10)
  points += roundScores.reduce((sum, s) => sum + s * SCORING.roundScoreMultiplier, 0);
  // Win bonus
  if (won) points += isBoss ? SCORING.bossVictory : SCORING.battleWin;
  // Weapon usage
  points += weaponsUsed * SCORING.weaponUsedInBattle;
  // Participation bonus
  if (participationBalanced) points += SCORING.participationBonus;
  // No weapons penalty
  if (weaponsUsed === 0) points += SCORING.noWeaponsUsed;

  return Math.max(0, points);
}
