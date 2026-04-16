import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

// Daily limits: 1/day, 2 on Friday, 0 on Saturday (Sabbath)
const getDailyLimit = (dayOfWeek: number): number => {
  if (dayOfWeek === 6) return 0; // Saturday (Sabbath) - no gems
  if (dayOfWeek === 5) return 2; // Friday - 2 gems
  return 1; // Sunday-Thursday - 1 gem
};

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const useGemLimit = () => {
  const [gemsToday, setGemsToday] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const now = new Date();
  const dayOfWeek = now.getDay();
  const dailyLimit = getDailyLimit(dayOfWeek);
  const isSabbath = dayOfWeek === 6;

  const fetchDailyGemCount = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Get the start of today (local time)
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const { count, error } = await supabase
        .from('user_gems')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startOfDay.toISOString());

      if (error) throw error;
      setGemsToday(count || 0);
    } catch (error) {
      console.error('Error fetching gem count:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDailyGemCount();
  }, [fetchDailyGemCount]);

  const canCreateGem = !isSabbath && gemsToday < dailyLimit;
  const gemsRemaining = Math.max(0, dailyLimit - gemsToday);

  const getLimitMessage = () => {
    if (isSabbath) {
      return "It's Sabbath! Take time to rest and reflect. Gem discovery resumes tomorrow.";
    }
    if (canCreateGem) {
      const isFriday = dayOfWeek === 5;
      if (isFriday) {
        return `You have ${gemsRemaining} gem${gemsRemaining === 1 ? '' : 's'} remaining today (${gemsToday}/2 used). It's Friday—double gems!`;
      }
      return `You have ${gemsRemaining} gem${gemsRemaining === 1 ? '' : 's'} remaining today (${gemsToday}/${dailyLimit} used).`;
    }
    const isFriday = dayOfWeek === 5;
    if (isFriday) {
      return "You've discovered your 2 Friday gems! Tomorrow is Sabbath rest, so come back Sunday for more.";
    }
    return `You've discovered your gem for ${dayNames[dayOfWeek]}! Return tomorrow for another treasure.`;
  };

  return {
    gemsToday,
    gemsRemaining,
    canCreateGem,
    isLoading,
    dailyLimit,
    isSabbath,
    dayOfWeek,
    dayName: dayNames[dayOfWeek],
    getLimitMessage,
    refetch: fetchDailyGemCount,
  };
};
