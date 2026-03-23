// Achievement tier system - matches database tier column
export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'black';

// Legacy function for backward compatibility (now uses tier from DB)
export const getTierFromPoints = (points: number): AchievementTier => {
  if (points >= 300) return 'black';
  if (points >= 100) return 'gold';
  if (points >= 50) return 'silver';
  return 'bronze';
};

export const tierColors: Record<AchievementTier, { bg: string; border: string; text: string; gradient: string; glow: string }> = {
  bronze: {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    border: 'border-orange-400',
    text: 'text-orange-700 dark:text-orange-300',
    gradient: 'from-orange-400 to-orange-600',
    glow: 'shadow-orange-500/30',
  },
  silver: {
    bg: 'bg-slate-100 dark:bg-slate-800/50',
    border: 'border-slate-400',
    text: 'text-slate-700 dark:text-slate-300',
    gradient: 'from-slate-300 to-slate-500',
    glow: 'shadow-slate-400/30',
  },
  gold: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/30',
    border: 'border-yellow-500',
    text: 'text-yellow-700 dark:text-yellow-300',
    gradient: 'from-yellow-400 to-amber-500',
    glow: 'shadow-yellow-500/40',
  },
  black: {
    bg: 'bg-slate-900 dark:bg-black',
    border: 'border-purple-500',
    text: 'text-white',
    gradient: 'from-slate-800 via-purple-900 to-slate-900',
    glow: 'shadow-purple-500/50',
  },
};

export const tierLabels: Record<AchievementTier, string> = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  black: 'Black Master',
};

export const tierOrder: AchievementTier[] = ['bronze', 'silver', 'gold', 'black'];

// Map requirement types to app routes
export const requirementRoutes: Record<string, { path: string; label: string }> = {
  // Memory
  rooms_completed: { path: '/palace', label: 'Go to Palace' },
  '24fps_chapters': { path: '/palace/floor/1/room/br', label: 'Start 24FPS' },
  
  // Mastery
  floors_completed: { path: '/palace', label: 'Explore Floors' },
  assessments_passed: { path: '/mastery', label: 'Take Assessment' },
  
  // Streaks
  study_streak: { path: '/reading-plans', label: 'Continue Streak' },
  monthly_streak: { path: '/streaks', label: 'View Streaks' },
  
  // Games
  games_completed: { path: '/games', label: 'Play Games' },
  escape_rooms_completed: { path: '/escape-room', label: 'Escape Rooms' },
  chain_chess_wins: { path: '/chain-chess', label: 'Play Chess' },
  
  // Scripture
  verses_memorized: { path: '/memory', label: 'Memorize Verses' },
  chapters_read: { path: '/bible', label: 'Read Bible' },
  books_completed: { path: '/bible', label: 'Continue Reading' },
  testaments_completed: { path: '/bible', label: 'Keep Reading' },
  
  // Devotionals
  devotional_days: { path: '/devotionals', label: 'Start Devotional' },
  devotional_plans_completed: { path: '/devotionals', label: 'View Plans' },
  devotionals_shared: { path: '/devotionals', label: 'Share Devotional' },
  ministry_devotionals: { path: '/devotionals', label: 'Help Others' },
  
  // Community
  posts_created: { path: '/community', label: 'Create Post' },
  comments_created: { path: '/community', label: 'Join Discussion' },
  community_interactions: { path: '/community', label: 'Engage' },
  likes_received: { path: '/community', label: 'View Posts' },
  
  // Partnership
  partners_found: { path: '/study-partners', label: 'Find Partner' },
  partnership_streak: { path: '/study-partners', label: 'Study Together' },
  partnership_bonus_xp: { path: '/study-partners', label: 'Earn XP' },
  group_formed: { path: '/study-partners', label: 'Form Group' },
  group_size: { path: '/study-partners', label: 'Grow Group' },
  disciples_trained: { path: '/study-partners', label: 'Train Others' },
  
  // Training
  drills_completed: { path: '/mastery', label: 'Start Training' },
  perfect_drills: { path: '/mastery', label: 'Practice Drills' },
  
  // Explorer
  features_used: { path: '/', label: 'Explore App' },
  floors_visited: { path: '/palace', label: 'Visit Floors' },
  tour_completed: { path: '/palace', label: 'Take Tour' },
  rooms_unlocked: { path: '/palace', label: 'Unlock Rooms' },
  
  // PT Coding
  codes_learned: { path: '/palace', label: 'Learn Codes' },
  dimensions_applied: { path: '/card-deck', label: 'Apply Dimensions' },
  connect6_completed: { path: '/card-deck', label: 'Chain Study' },
  sanctuary_maps: { path: '/games/blue-room', label: 'Map Sanctuary' },
  
  // Prophecy
  prophecy_studies: { path: '/daniel-course', label: 'Study Daniel' },
  prophecy_2300: { path: '/daniel-course', label: 'Learn 2300' },
  seven_churches: { path: '/revelation-course', label: 'Seven Churches' },
  beast_symbols: { path: '/revelation-course', label: 'Decode Beasts' },
  revelation_complete: { path: '/revelation-course', label: 'Study Revelation' },
  prophecy_track: { path: '/courses', label: 'Prophecy Track' },
  
  // Ministry
  prayers_offered: { path: '/community', label: 'Pray for Others' },
  ministry_challenges: { path: '/spiritual-training', label: 'Ministry Challenge' },
  groups_planted: { path: '/study-partners', label: 'Plant Group' },
  studies_led: { path: '/bible-study-series', label: 'Lead Studies' },
  ministry_training: { path: '/courses', label: 'Ministry Training' },
};

// Get human-readable requirement labels
export const getRequirementLabel = (type: string, count: number): string => {
  const labels: Record<string, (n: number) => string> = {
    rooms_completed: (n) => `Complete ${n} room${n !== 1 ? 's' : ''}`,
    '24fps_chapters': (n) => `Complete ${n} 24FPS chapter${n !== 1 ? 's' : ''}`,
    floors_completed: (n) => `Master ${n} floor${n !== 1 ? 's' : ''}`,
    assessments_passed: (n) => `Pass ${n} assessment${n !== 1 ? 's' : ''}`,
    study_streak: (n) => `Reach ${n}-day streak`,
    monthly_streak: (n) => `Complete ${n} streak month${n !== 1 ? 's' : ''}`,
    games_completed: (n) => `Complete ${n} game${n !== 1 ? 's' : ''}`,
    escape_rooms_completed: (n) => `Complete ${n} escape room${n !== 1 ? 's' : ''}`,
    chain_chess_wins: (n) => `Win ${n} chess match${n !== 1 ? 'es' : ''}`,
    verses_memorized: (n) => `Memorize ${n} verse${n !== 1 ? 's' : ''}`,
    chapters_read: (n) => `Read ${n} chapter${n !== 1 ? 's' : ''}`,
    books_completed: (n) => `Complete ${n} book${n !== 1 ? 's' : ''}`,
    testaments_completed: (n) => `Complete ${n} testament${n !== 1 ? 's' : ''}`,
    devotional_days: (n) => `Complete ${n} devotional day${n !== 1 ? 's' : ''}`,
    devotional_plans_completed: (n) => `Complete ${n} devotional plan${n !== 1 ? 's' : ''}`,
    devotionals_shared: (n) => `Share ${n} devotional${n !== 1 ? 's' : ''}`,
    ministry_devotionals: (n) => `Send ${n} ministry devotional${n !== 1 ? 's' : ''}`,
    posts_created: (n) => `Create ${n} post${n !== 1 ? 's' : ''}`,
    comments_created: (n) => `Leave ${n} comment${n !== 1 ? 's' : ''}`,
    community_interactions: (n) => `Have ${n} interaction${n !== 1 ? 's' : ''}`,
    likes_received: (n) => `Receive ${n} like${n !== 1 ? 's' : ''}`,
    partners_found: (n) => `Find ${n} partner${n !== 1 ? 's' : ''}`,
    partnership_streak: (n) => `Maintain ${n}-day partner streak`,
    partnership_bonus_xp: (n) => `Earn ${n} partner XP`,
    group_formed: (n) => `Form ${n} study group${n !== 1 ? 's' : ''}`,
    group_size: (n) => `Grow group to ${n}+ members`,
    disciples_trained: (n) => `Train ${n} disciple${n !== 1 ? 's' : ''}`,
    drills_completed: (n) => `Complete ${n} drill${n !== 1 ? 's' : ''}`,
    perfect_drills: (n) => `Get ${n} perfect score${n !== 1 ? 's' : ''}`,
    features_used: (n) => `Try ${n} feature${n !== 1 ? 's' : ''}`,
    floors_visited: (n) => `Visit ${n} floor${n !== 1 ? 's' : ''}`,
    tour_completed: (n) => `Complete ${n} tour${n !== 1 ? 's' : ''}`,
    rooms_unlocked: (n) => `Unlock ${n} room${n !== 1 ? 's' : ''}`,
    codes_learned: (n) => `Learn ${n} PT code${n !== 1 ? 's' : ''}`,
    dimensions_applied: (n) => `Apply ${n} dimension${n !== 1 ? 's' : ''}`,
    connect6_completed: (n) => `Complete ${n} Connect-6 chain${n !== 1 ? 's' : ''}`,
    sanctuary_maps: (n) => `Create ${n} sanctuary map${n !== 1 ? 's' : ''}`,
    prophecy_studies: (n) => `Complete ${n} prophecy stud${n !== 1 ? 'ies' : 'y'}`,
    prophecy_2300: (n) => `Master ${n} prophecy timeline${n !== 1 ? 's' : ''}`,
    seven_churches: (n) => `Study ${n} church${n !== 1 ? 'es' : ''}`,
    beast_symbols: (n) => `Decode ${n} beast symbol${n !== 1 ? 's' : ''}`,
    revelation_complete: (n) => `Complete Revelation study`,
    prophecy_track: (n) => `Complete prophecy track`,
    prayers_offered: (n) => `Offer ${n} prayer${n !== 1 ? 's' : ''}`,
    ministry_challenges: (n) => `Complete ${n} ministry challenge${n !== 1 ? 's' : ''}`,
    groups_planted: (n) => `Plant ${n} group${n !== 1 ? 's' : ''}`,
    studies_led: (n) => `Lead ${n} Bible stud${n !== 1 ? 'ies' : 'y'}`,
    ministry_training: (n) => `Complete ministry training`,
  };
  
  const labelFn = labels[type];
  if (labelFn) return labelFn(count);
  return `Complete ${count} ${type.replace(/_/g, ' ')}`;
};
