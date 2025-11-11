import { useAchievements } from "@/hooks/useAchievements";
import { AchievementNotification } from "./AchievementNotification";

export function AchievementProvider({ children }: { children: React.ReactNode }) {
  const { unlockedAchievement, clearUnlockedAchievement } = useAchievements();

  return (
    <>
      {children}
      <AchievementNotification 
        achievement={unlockedAchievement} 
        onClose={clearUnlockedAchievement}
      />
    </>
  );
}
