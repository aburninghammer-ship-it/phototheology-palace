/**
 * Room Training Curriculum Definitions
 * Each room has a structured path to mastery
 */

export type ActivityType = "reading" | "drill" | "exercise" | "milestone_test" | "reflection";

export interface CurriculumActivity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  xpReward: number;
  requiredForLevel?: number; // If set, must complete before advancing to this level
  unlockAtLevel?: number; // If set, only unlocked at this level
  estimatedMinutes?: number;
}

export interface RoomCurriculum {
  roomId: string;
  roomName: string;
  activities: CurriculumActivity[];
  milestoneTests: {
    level: number;
    activityId: string;
  }[];
}

/**
 * Default curriculum template (used for rooms without custom curriculum)
 */
export const getDefaultCurriculum = (roomId: string, roomName: string): RoomCurriculum => ({
  roomId,
  roomName,
  activities: [
    // Level 1: Novice - Foundation
    {
      id: `${roomId}-read-1`,
      type: "reading",
      title: "Introduction Reading",
      description: `Read the ${roomName} introduction and core principles`,
      xpReward: 10,
      requiredForLevel: 2,
      estimatedMinutes: 10,
    },
    {
      id: `${roomId}-drill-1`,
      type: "drill",
      title: "Basic Drill #1",
      description: "Complete your first practice drill",
      xpReward: 25,
      estimatedMinutes: 5,
    },
    {
      id: `${roomId}-drill-2`,
      type: "drill",
      title: "Basic Drill #2",
      description: "Reinforce foundational concepts",
      xpReward: 25,
      estimatedMinutes: 5,
    },
    {
      id: `${roomId}-milestone-1`,
      type: "milestone_test",
      title: "Level 1 Assessment",
      description: "Prove your novice understanding",
      xpReward: 50,
      requiredForLevel: 2,
      estimatedMinutes: 10,
    },

    // Level 2: Apprentice - Building
    {
      id: `${roomId}-drill-3`,
      type: "drill",
      title: "Intermediate Drill #1",
      description: "Apply concepts in new contexts",
      xpReward: 30,
      unlockAtLevel: 2,
      estimatedMinutes: 7,
    },
    {
      id: `${roomId}-exercise-1`,
      type: "exercise",
      title: "Practical Exercise #1",
      description: "Put principles into practice",
      xpReward: 15,
      unlockAtLevel: 2,
      estimatedMinutes: 10,
    },
    {
      id: `${roomId}-drill-4`,
      type: "drill",
      title: "Intermediate Drill #2",
      description: "Deepen your understanding",
      xpReward: 30,
      unlockAtLevel: 2,
      estimatedMinutes: 7,
    },
    {
      id: `${roomId}-milestone-2`,
      type: "milestone_test",
      title: "Level 2 Assessment",
      description: "Demonstrate apprentice mastery",
      xpReward: 75,
      requiredForLevel: 3,
      unlockAtLevel: 2,
      estimatedMinutes: 15,
    },

    // Level 3: Practitioner - Mastering
    {
      id: `${roomId}-drill-5`,
      type: "drill",
      title: "Advanced Drill #1",
      description: "Master complex applications",
      xpReward: 35,
      unlockAtLevel: 3,
      estimatedMinutes: 10,
    },
    {
      id: `${roomId}-exercise-2`,
      type: "exercise",
      title: "Practical Exercise #2",
      description: "Apply principles to real scenarios",
      xpReward: 20,
      unlockAtLevel: 3,
      estimatedMinutes: 15,
    },
    {
      id: `${roomId}-reflection-1`,
      type: "reflection",
      title: "Deep Reflection",
      description: "Journal your insights and connections",
      xpReward: 25,
      unlockAtLevel: 3,
      estimatedMinutes: 15,
    },
    {
      id: `${roomId}-milestone-3`,
      type: "milestone_test",
      title: "Level 3 Assessment",
      description: "Prove practitioner capability",
      xpReward: 100,
      requiredForLevel: 4,
      unlockAtLevel: 3,
      estimatedMinutes: 20,
    },

    // Level 4: Expert - Refinement
    {
      id: `${roomId}-drill-6`,
      type: "drill",
      title: "Expert Drill #1",
      description: "Tackle expert-level challenges",
      xpReward: 40,
      unlockAtLevel: 4,
      estimatedMinutes: 12,
    },
    {
      id: `${roomId}-exercise-3`,
      type: "exercise",
      title: "Teaching Exercise",
      description: "Prepare to teach this room's principles",
      xpReward: 25,
      unlockAtLevel: 4,
      estimatedMinutes: 20,
    },
    {
      id: `${roomId}-drill-7`,
      type: "drill",
      title: "Expert Drill #2",
      description: "Master all edge cases",
      xpReward: 40,
      unlockAtLevel: 4,
      estimatedMinutes: 12,
    },
    {
      id: `${roomId}-milestone-4`,
      type: "milestone_test",
      title: "Level 4 Assessment",
      description: "Demonstrate expert mastery",
      xpReward: 150,
      requiredForLevel: 5,
      unlockAtLevel: 4,
      estimatedMinutes: 25,
    },

    // Level 5: Master - Perfection
    {
      id: `${roomId}-drill-8`,
      type: "drill",
      title: "Master Drill #1",
      description: "Final mastery challenge",
      xpReward: 50,
      unlockAtLevel: 5,
      estimatedMinutes: 15,
    },
    {
      id: `${roomId}-exercise-4`,
      type: "exercise",
      title: "Master Application",
      description: "Demonstrate complete mastery in real-world application",
      xpReward: 30,
      unlockAtLevel: 5,
      estimatedMinutes: 25,
    },
    {
      id: `${roomId}-reflection-2`,
      type: "reflection",
      title: "Master Reflection",
      description: "Articulate your complete understanding",
      xpReward: 50,
      unlockAtLevel: 5,
      estimatedMinutes: 20,
    },
  ],
  milestoneTests: [
    { level: 2, activityId: `${roomId}-milestone-1` },
    { level: 3, activityId: `${roomId}-milestone-2` },
    { level: 4, activityId: `${roomId}-milestone-3` },
    { level: 5, activityId: `${roomId}-milestone-4` },
  ],
});

/**
 * Get curriculum for a specific room
 */
export const getRoomCurriculum = (roomId: string, roomName: string): RoomCurriculum => {
  // For now, all rooms use the default curriculum
  // In the future, specific rooms can have custom curricula
  return getDefaultCurriculum(roomId, roomName);
};
