// Achievement tier system based on points
export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export const getTierFromPoints = (points: number): AchievementTier => {
  if (points >= 100) return 'diamond';
  if (points >= 75) return 'platinum';
  if (points >= 50) return 'gold';
  if (points >= 25) return 'silver';
  return 'bronze';
};

export const tierColors: Record<AchievementTier, { bg: string; border: string; text: string; gradient: string }> = {
  bronze: {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    border: 'border-orange-400',
    text: 'text-orange-700 dark:text-orange-300',
    gradient: 'from-orange-400 to-orange-600',
  },
  silver: {
    bg: 'bg-slate-100 dark:bg-slate-800/50',
    border: 'border-slate-400',
    text: 'text-slate-700 dark:text-slate-300',
    gradient: 'from-slate-300 to-slate-500',
  },
  gold: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/30',
    border: 'border-yellow-500',
    text: 'text-yellow-700 dark:text-yellow-300',
    gradient: 'from-yellow-400 to-yellow-600',
  },
  platinum: {
    bg: 'bg-cyan-50 dark:bg-cyan-900/30',
    border: 'border-cyan-400',
    text: 'text-cyan-700 dark:text-cyan-300',
    gradient: 'from-cyan-300 to-cyan-500',
  },
  diamond: {
    bg: 'bg-purple-50 dark:bg-purple-900/30',
    border: 'border-purple-400',
    text: 'text-purple-700 dark:text-purple-300',
    gradient: 'from-purple-400 to-pink-500',
  },
};

export const tierLabels: Record<AchievementTier, string> = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum',
  diamond: 'Diamond',
};

// Map requirement types to app routes
export const requirementRoutes: Record<string, { path: string; label: string }> = {
  rooms_completed: { path: '/palace', label: 'Go to Palace' },
  drills_completed: { path: '/mastery', label: 'Start Training' },
  perfect_drills: { path: '/mastery', label: 'Practice Drills' },
  study_streak: { path: '/reading-plans', label: 'Continue Streak' },
  floors_completed: { path: '/palace', label: 'Explore Floors' },
};

// Get human-readable requirement labels
export const getRequirementLabel = (type: string, count: number): string => {
  switch (type) {
    case 'rooms_completed':
      return `Complete ${count} room${count !== 1 ? 's' : ''}`;
    case 'drills_completed':
      return `Complete ${count} drill${count !== 1 ? 's' : ''}`;
    case 'perfect_drills':
      return `Get ${count} perfect score${count !== 1 ? 's' : ''}`;
    case 'study_streak':
      return `Reach ${count}-day streak`;
    case 'floors_completed':
      return `Master ${count} floor${count !== 1 ? 's' : ''}`;
    default:
      return `Complete ${count} ${type.replace(/_/g, ' ')}`;
  }
};
