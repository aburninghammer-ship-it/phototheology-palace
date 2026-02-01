// Guest House Mode Configuration
// A simplified, welcoming experience for new users

export const GUEST_HOUSE_CONFIG = {
  // Paths that are available in Guest House mode
  paths: [
    '/palace',
    '/image-bible',
    '/devotionals',
    '/study-buddy',
    '/games',
    '/daily-challenges',
    '/genesis-challenge',
  ],

  // Navigation tab labels and paths for Guest House mode
  tabs: [
    { path: '/palace', label: 'Palace', icon: 'castle' },
    { path: '/image-bible', label: 'PT Image Bible', icon: 'image' },
    { path: '/devotionals', label: 'Devotionals', icon: 'heart' },
    { path: '/study-buddy', label: 'Study Buddy', icon: 'brain' },
    { path: '/games', label: 'Games', icon: 'gamepad' },
    { path: '/daily-challenges', label: 'Challenges', icon: 'trophy' },
  ],

  // Warm color theme for Guest House
  theme: {
    // Primary colors
    primary: '#f59e0b', // amber-500
    primaryHover: '#d97706', // amber-600
    primaryLight: '#fef3c7', // amber-100

    // Background colors
    navBackground: 'from-amber-50 to-orange-50',
    navBackgroundDark: 'from-amber-900/20 to-orange-900/20',

    // Accent colors
    accent: '#92400e', // amber-800
    accentLight: '#fcd34d', // amber-300

    // Tab colors
    tabActive: 'from-amber-500 to-orange-500',
    tabHover: 'bg-amber-100/50 dark:bg-amber-800/20',
  },

  // Welcome modal content
  welcomeMessage: {
    title: "Welcome to the Guest House",
    subtitle: "Your gentle introduction to the Phototheology Bible Study Suite",
    description: "We've curated the essential tools to help you get started on your spiritual journey. Take your time exploring these foundations - when you're ready for more, the full suite awaits!",

    guestHouseDescription: "Perfect for getting started. Six carefully selected tools to build your foundation.",
    fullSuiteDescription: "Unlock the complete Phototheology experience with 30+ powerful study tools.",

    features: [
      { icon: 'castle', label: 'Palace', description: 'Your personal study sanctuary' },
      { icon: 'image', label: 'PT Image Bible', description: 'Visual Bible experience' },
      { icon: 'heart', label: 'Devotionals', description: 'Daily spiritual nourishment' },
      { icon: 'brain', label: 'Study Buddy', description: 'AI-assisted Bible study' },
      { icon: 'gamepad', label: 'Games', description: 'Learn while playing' },
      { icon: 'trophy', label: 'Challenges', description: 'Test your knowledge' },
    ],

    ctaGuestHouse: "Start in Guest House",
    ctaFullSuite: "Explore Full Suite",
    switchAnytime: "You can switch between modes anytime from your account menu.",
  },

  // Badge/indicator text
  badge: {
    text: "Guest House",
    tooltip: "You're in simplified mode. Click to access more features.",
  },
};

// Helper function to check if a path is available in Guest House mode
export const isGuestHousePath = (path: string): boolean => {
  return GUEST_HOUSE_CONFIG.paths.some(p =>
    path === p || path.startsWith(p + '/')
  );
};

// Helper function to get Guest House tab by path
export const getGuestHouseTab = (path: string) => {
  return GUEST_HOUSE_CONFIG.tabs.find(tab =>
    path === tab.path || path.startsWith(tab.path + '/')
  );
};
