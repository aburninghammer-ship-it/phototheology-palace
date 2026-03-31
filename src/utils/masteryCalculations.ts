/**
 * Mastery System XP Calculation Utilities
 */

export interface XpCalculationParams {
  drillCompleted?: boolean;
  exerciseCompleted?: boolean;
  perfectScore?: boolean;
  drillScore?: number;
  timeBonus?: boolean;
}

/**
 * Base XP rewards
 */
export const BASE_XP = {
  DRILL_COMPLETION: 25,
  EXERCISE_COMPLETION: 15,
  PERFECT_SCORE: 50,
  TIME_BONUS: 10,
} as const;

/**
 * XP requirements for each mastery level
 */
export const XP_REQUIREMENTS = {
  1: 100,   // Novice → Apprentice
  2: 250,   // Apprentice → Practitioner
  3: 500,   // Practitioner → Expert
  4: 1000,  // Expert → Master
  5: 0,     // Master (max level)
} as const;

/**
 * Mastery level titles
 */
export const MASTERY_TITLES = {
  1: "Apprentice",
  2: "Journeyman",
  3: "Artisan",
  4: "Master",
  5: "Grand Phototheologist",
} as const;

/**
 * Global title progression (based on rooms mastered)
 */
export const GLOBAL_TITLES = [
  { 
    level: 1, 
    title: "Blue Master", 
    roomsRequired: 1,
    roomsMax: 3,
    streakRequired: 0,
    color: "blue",
    rewards: ["Blue Master title"]
  },
  { 
    level: 2, 
    title: "Red Master", 
    roomsRequired: 4,
    roomsMax: 9,
    streakRequired: 7,
    color: "red",
    rewards: ["Red Master title", "Red Challenges"]
  },
  { 
    level: 3, 
    title: "Gold Master", 
    roomsRequired: 10,
    roomsMax: 18,
    streakRequired: 14,
    color: "yellow",
    rewards: ["Gold Master title", "Advanced chain tools"]
  },
  { 
    level: 4, 
    title: "Purple Master", 
    roomsRequired: 19,
    roomsMax: 27,
    streakRequired: 21,
    color: "purple",
    rewards: ["Purple Master title", "Create-your-own drills"]
  },
  { 
    level: 5, 
    title: "White Master", 
    roomsRequired: 28,
    roomsMax: 37,
    streakRequired: 30,
    color: "gray",
    rewards: ["White Master title", "Temple Mode", "Prophecy maps"]
  },
  { 
    level: 6, 
    title: "Black Master", 
    roomsRequired: 38,
    roomsMax: 38,
    streakRequired: 60,
    color: "black",
    rewards: ["Black Master title", "Black Palace Mode", "Shadow Chains", "Prophetic Lattice Engine", "Mentor privileges", "8th-floor Revelation Chamber"]
  },
] as const;

/**
 * Calculate XP reward based on activity
 */
export const calculateXpReward = ({
  drillCompleted = false,
  exerciseCompleted = false,
  perfectScore = false,
  drillScore,
  timeBonus = false,
}: XpCalculationParams): number => {
  let xp = 0;

  if (drillCompleted) {
    xp += BASE_XP.DRILL_COMPLETION;
    
    // Add bonus XP based on drill score
    if (drillScore !== undefined) {
      const scoreBonus = Math.floor((drillScore / 100) * 25);
      xp += scoreBonus;
    }
  }

  if (exerciseCompleted) {
    xp += BASE_XP.EXERCISE_COMPLETION;
  }

  if (perfectScore) {
    xp += BASE_XP.PERFECT_SCORE;
  }

  if (timeBonus) {
    xp += BASE_XP.TIME_BONUS;
  }

  return xp;
};

/**
 * Calculate progress percentage to next level
 */
export const calculateProgressPercentage = (
  currentXp: number,
  xpRequired: number
): number => {
  if (xpRequired === 0) return 100; // Max level
  return Math.min((currentXp / xpRequired) * 100, 100);
};

/**
 * Get mastery title for a level
 */
export const getMasteryTitle = (level: number): string => {
  return MASTERY_TITLES[level as keyof typeof MASTERY_TITLES] || "Unknown";
};

/**
 * Get global title based on rooms mastered
 */
export const getGlobalTitle = (roomsMastered: number): string => {
  if (roomsMastered === 0) return "Aspiring Scholar";
  
  const title = [...GLOBAL_TITLES]
    .reverse()
    .find((t) => roomsMastered >= t.roomsRequired && roomsMastered <= t.roomsMax);
  
  return title?.title || "Aspiring Scholar";
};

/**
 * Get next global title milestone
 */
export const getNextGlobalTitleMilestone = (
  roomsMastered: number
): { title: string; roomsNeeded: number } | null => {
  const nextTitle = GLOBAL_TITLES.find((t) => roomsMastered < t.roomsRequired);
  
  if (!nextTitle) return null;
  
  return {
    title: nextTitle.title,
    roomsNeeded: nextTitle.roomsRequired - roomsMastered,
  };
};

/**
 * Calculate total XP needed to reach a specific level from level 1
 */
export const getTotalXpForLevel = (level: number): number => {
  let total = 0;
  for (let i = 1; i < level && i <= 4; i++) {
    total += XP_REQUIREMENTS[i as keyof typeof XP_REQUIREMENTS];
  }
  return total;
};
