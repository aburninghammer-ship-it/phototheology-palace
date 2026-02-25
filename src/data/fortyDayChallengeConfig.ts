// 40-Day Daily Debate Challenge Configuration
// Each day assigns a random opponent + topic pairing the user doesn't know in advance

export interface DayConfig {
  day: number;
  opponentId: string;
  topicId: string;
}

// Pre-shuffled 40-day rotation ensuring variety across opponents and topics
// Opponents cycle through all 10 + goliath, topics mix SDA defense and signature attacks
const OPPONENT_POOL = [
  "atheist", "muslim", "mormon", "jw", "evangelical",
  "catholic", "bhi", "former-sda", "offshoot-sda", "jewish",
];

const SDA_DEFENSE_TOPICS = [
  "sabbath", "state-of-dead", "hellfire", "law-gospel", "diet",
  "second-coming", "sanctuary-1844", "trinity", "prophecy",
  "remnant", "three-angels", "mark-of-the-beast", "investigative-judgment",
  "millennium", "new-covenant",
];

const SIGNATURE_ATTACK_TOPICS = [
  "sunday-is-new-sabbath", "soul-sleep-wrong", "eternal-hell",
  "no-law-for-christians", "secret-rapture", "all-foods-clean",
  "predestination", "purgatory", "naturalism", "problem-of-evil",
  "islamic-monotheism", "joseph-smith",
];

// Generate a deterministic but varied 40-day schedule using enrollment seed
export function generate40DaySchedule(seed: string): DayConfig[] {
  const schedule: DayConfig[] = [];
  // Simple hash to create variation per enrollment
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }

  for (let day = 1; day <= 40; day++) {
    const opIdx = Math.abs((hash + day * 7) % OPPONENT_POOL.length);
    // Mix SDA defense topics (70%) and signature attacks (30%)
    const useSignature = day % 3 === 0;
    const topicPool = useSignature ? SIGNATURE_ATTACK_TOPICS : SDA_DEFENSE_TOPICS;
    const topicIdx = Math.abs((hash + day * 13) % topicPool.length);

    schedule.push({
      day,
      opponentId: OPPONENT_POOL[opIdx],
      topicId: topicPool[topicIdx],
    });
  }

  return schedule;
}

// XP milestones for badges
export const BADGE_MILESTONES = {
  first_blood: { name: "First Blood", icon: "🩸", description: "Completed your first debate" },
  streak_5: { name: "5-Day Fire", icon: "🔥", description: "5 consecutive days of debate" },
  streak_10: { name: "10-Day Warrior", icon: "⚔️", description: "10 consecutive days of debate" },
  streak_20: { name: "20-Day Champion", icon: "🏆", description: "20 consecutive days of debate" },
  halfway: { name: "Halfway Hero", icon: "🎯", description: "Completed day 20 of 40" },
  finisher: { name: "40-Day Defender", icon: "👑", description: "Completed the full 40-day challenge!" },
  perfect_defense: { name: "Perfect Defense", icon: "🛡️", description: "Flawless theological accuracy" },
  scripture_warrior: { name: "Scripture Warrior", icon: "📖", description: "Used 5+ scripture references" },
  steel_wall: { name: "Steel Wall", icon: "🧱", description: "Impenetrable defense" },
  comeback_king: { name: "Comeback King", icon: "💪", description: "Recovered from a weak start" },
};

export const XP_LEVELS = [
  { level: 1, xpRequired: 0, title: "Novice Defender", emoji: "🛡️" },
  { level: 2, xpRequired: 300, title: "Apprentice Apologist", emoji: "📖" },
  { level: 3, xpRequired: 800, title: "Shield Bearer", emoji: "⚔️" },
  { level: 4, xpRequired: 1500, title: "Sword of Truth", emoji: "🗡️" },
  { level: 5, xpRequired: 2500, title: "Wall of Fire", emoji: "🔥" },
  { level: 6, xpRequired: 4000, title: "Remnant Champion", emoji: "🏆" },
  { level: 7, xpRequired: 6000, title: "Master Defender", emoji: "👑" },
];

export function getXPLevel(totalXP: number) {
  const sorted = [...XP_LEVELS].sort((a, b) => b.xpRequired - a.xpRequired);
  return sorted.find(l => totalXP >= l.xpRequired) || XP_LEVELS[0];
}
