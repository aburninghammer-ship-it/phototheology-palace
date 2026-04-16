export interface PackageWeek {
  weekNumber: number;
  title: string;
  sanctuaryElement: string;
  scriptureFocus: string[];
  memoryVerse: string;
  teachingContent: string;
  discussionQuestions: string[];
  palaceRoomConnections: string[];
  practicalExercise: string;
  weeklyChallenge: string;
}

export interface DiscipleshipPackage {
  id: string;
  packageType: string;
  title: string;
  subtitle: string;
  description: string;
  sanctuaryFurniture: string;
  icon: string;
  themeVerse: string;
  completionBenefits: string[];
  weeks: PackageWeek[];
}
