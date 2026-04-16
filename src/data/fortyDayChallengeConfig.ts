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
  "preterist", "futurist", "secular-scholar", "progressive-christian",
  "skeptical-exsda", "philosopher", "new-age", "anti-prophet", "internet-skeptic",
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

// Maps signature topics to the opponent who owns them.
// Signature topics should ONLY be debated by their owning opponent.
const SIGNATURE_TOPIC_OWNER: Record<string, string> = {
  "naturalism": "atheist",
  "problem-of-evil": "atheist",
  "secular-morality": "atheist",
  "evolution": "scientist",
  "age-of-earth": "scientist",
  "fossil-record": "scientist",
  "quran-preservation": "muslim",
  "islamic-monotheism": "muslim",
  "prophet-muhammad": "muslim",
  "joseph-smith": "mormon",
  "book-of-mormon": "mormon",
  "continuing-revelation": "mormon",
  "jehovah-only-god": "jw",
  "jesus-is-created": "jw",
  "paradise-earth": "jw",
  "sunday-resurrection": "evangelical",
  "grace-alone": "evangelical",
  "once-saved": "evangelical",
  "papal-authority": "catholic",
  "eucharist": "catholic",
  "sacred-tradition": "catholic",
  "true-israel-identity": "bhi",
  "salvation-israel-only": "bhi",
  "feast-days-required": "bhi",
  "ellen-white-exposed": "former-sda",
  "1844-debunked": "former-sda",
  "sda-to-freedom": "former-sda",
  "church-is-babylon": "offshoot-sda",
  "anti-trinity-sda": "offshoot-sda",
  "feast-days-mandatory": "offshoot-sda",
  "messiah-criteria": "jewish",
  "isaiah-53-israel": "jewish",
  "torah-eternal": "jewish",
  "preterism": "preterist",
  "antiochus-epiphanes": "preterist",
  "futurism": "futurist",
  "rapture": "futurist",
  "daniel-late-date": "secular-scholar",
  "bible-as-literature": "secular-scholar",
  "academic-criticism": "secular-scholar",
  "progressive-gospel": "progressive-christian",
  "inclusive-christianity": "progressive-christian",
  "universal-reconciliation": "progressive-christian",
  "religious-trauma": "skeptical-exsda",
  "sda-perfectionism": "skeptical-exsda",
  "conditional-acceptance": "skeptical-exsda",
  "divine-hiddenness": "philosopher",
  "free-will-paradox": "philosopher",
  "coherence-of-judgment": "philosopher",
  "consciousness-after-death": "new-age",
  "all-paths-valid": "new-age",
  "universal-energy": "new-age",
  "ew-plagiarism": "anti-prophet",
  "ew-false-prophecies": "anti-prophet",
  "ew-authority-test": "anti-prophet",
  "religion-debunked": "internet-skeptic",
  "science-vs-faith": "internet-skeptic",
  "bible-contradictions": "internet-skeptic",
  "honest-doubt": "agnostic",
  "faith-vs-evidence": "agnostic",
  "tongues-evidence": "pentecostal",
  "prosperity-gospel": "pentecostal",
  "name-only-salvation": "pentecostal",
  "sunday-is-new-sabbath": "evangelical",
  "soul-sleep-wrong": "evangelical",
  "eternal-hell": "evangelical",
  "no-law-for-christians": "evangelical",
  "secret-rapture": "evangelical",
  "all-foods-clean": "evangelical",
  "predestination": "evangelical",
  "purgatory": "catholic",
};

// Seeded PRNG (Mulberry32) — produces unique deterministic sequences per seed
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// Fisher-Yates shuffle using seeded random
function seededShuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Generate a deterministic but unique 40-day schedule per enrollment
export function generate40DaySchedule(seed: string): DayConfig[] {
  // Hash the seed string into a number for the PRNG
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  const rand = mulberry32(hash);

  // Build shuffled opponent rotation — enough cycles to fill 40 days
  let opponents: string[] = [];
  for (let cycle = 0; cycle < 4; cycle++) {
    opponents = opponents.concat(seededShuffle(OPPONENT_POOL, rand));
  }

  // Build shuffled topic pools
  const shuffledDefense = seededShuffle(SDA_DEFENSE_TOPICS, rand);
  const shuffledSignature = seededShuffle(SIGNATURE_ATTACK_TOPICS, rand);

  // Assemble schedule — match signature topics to their owning opponent,
  // and ensure no back-to-back same opponent
  const schedule: DayConfig[] = [];
  let dIdx = 0;
  let sIdx = 0;

  for (let day = 1; day <= 40; day++) {
    let opponentId = opponents[day - 1];

    // Prevent back-to-back same opponent
    if (day > 1 && opponentId === schedule[day - 2].opponentId) {
      let swapped = false;
      for (let j = day; j < opponents.length; j++) {
        if (opponents[j] !== opponentId) {
          [opponents[day - 1], opponents[j]] = [opponents[j], opponents[day - 1]];
          opponentId = opponents[day - 1];
          swapped = true;
          break;
        }
      }
      if (!swapped) {
        const alternatives = OPPONENT_POOL.filter(o => o !== opponentId);
        opponentId = alternatives[Math.floor(rand() * alternatives.length)];
      }
    }

    // Decide topic: 30% chance of a signature topic, but ONLY if it belongs
    // to this opponent. Otherwise fall back to a neutral SDA defense topic.
    let topicId: string;
    const trySignature = rand() < 0.3 && sIdx < shuffledSignature.length;

    if (trySignature) {
      const sigTopic = shuffledSignature[sIdx % shuffledSignature.length];
      const owner = SIGNATURE_TOPIC_OWNER[sigTopic];

      if (owner === opponentId) {
        // Perfect match — this opponent owns this signature topic
        topicId = sigTopic;
        sIdx++;
      } else {
        // Mismatch — give this opponent a neutral SDA defense topic instead
        topicId = shuffledDefense[dIdx % shuffledDefense.length];
        dIdx++;
      }
    } else {
      topicId = shuffledDefense[dIdx % shuffledDefense.length];
      dIdx++;
    }

    schedule.push({ day, opponentId, topicId });
  }

  return schedule;
}

// XP milestones for badges
export const BADGE_MILESTONES = {
  first_blood: { name: "First Blood", icon: "🩸", description: "Completed your first debate" },
  concession_victory: { name: "Smoke Screen", icon: "💨", description: "Forced your opponent to concede" },
  streak_5: { name: "5-Day Fire", icon: "🔥", description: "5 consecutive days of debate" },
  streak_10: { name: "10-Day Warrior", icon: "⚔️", description: "10 consecutive days of debate" },
  streak_20: { name: "20-Day Champion", icon: "🏆", description: "20 consecutive days of debate" },
  halfway: { name: "Halfway Hero", icon: "🎯", description: "Completed day 20 of 40" },
  finisher: { name: "40 Days of Smoke", icon: "👑", description: "Completed the full 40 Days of Smoke challenge!" },
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
