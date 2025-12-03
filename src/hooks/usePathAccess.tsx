import { useState, useEffect, useMemo } from "react";
import { useAuth } from "./useAuth";
import { useSubscription } from "./useSubscription";
import { usePath } from "./usePath";
import { getCurrentWeekInMonth, getPathCurriculum, getAllWeeksForPath } from "@/data/pathCurriculum";
import { supabase } from "@/integrations/supabase/client";

interface WeekAccessStatus {
  weekNumber: number;
  month: number;
  isUnlocked: boolean;
  reason?: 'free' | 'premium_required' | 'incomplete_previous' | 'time_locked';
  daysUntilUnlock?: number;
  activitiesCompleted: number;
  totalActivities: number;
  isComplete: boolean;
}

interface PathAccessState {
  isLoading: boolean;
  canAccessWeek: (month: number, weekNumber: number) => boolean;
  getWeekStatus: (month: number, weekNumber: number) => WeekAccessStatus | null;
  currentWeekStatus: WeekAccessStatus | null;
  needsPremiumForNextWeek: boolean;
  completedActivities: string[];
  refreshAccess: () => void;
}

// Week 1 is free, subsequent weeks require premium
const FREE_WEEKS = 1;
const DAYS_BETWEEN_WEEKS = 7;

export function usePathAccess(): PathAccessState {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const { activePath } = usePath();
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [weekStartDates, setWeekStartDates] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  const hasPremiumAccess = useMemo(() => {
    return subscription.hasAccess;
  }, [subscription]);

  // Load completed activities from database or localStorage
  useEffect(() => {
    loadProgress();
  }, [user, activePath]);

  const loadProgress = async () => {
    if (!activePath) {
      setIsLoading(false);
      return;
    }

    try {
      // Try to load from database first if user is logged in
      if (user) {
        const { data: dbProgress } = await supabase
          .from('path_activity_completions')
          .select('activity_id, completed_at')
          .eq('user_id', user.id)
          .eq('path_id', activePath.id);

        if (dbProgress && dbProgress.length > 0) {
          setCompletedActivities(dbProgress.map(p => p.activity_id));
          
          // Build week start dates from first activity completion per week
          const weekStarts: Record<string, string> = {};
          dbProgress.forEach(p => {
            const weekKey = getWeekKeyFromActivityId(p.activity_id);
            if (weekKey && (!weekStarts[weekKey] || new Date(p.completed_at) < new Date(weekStarts[weekKey]))) {
              weekStarts[weekKey] = p.completed_at;
            }
          });
          setWeekStartDates(weekStarts);
          setIsLoading(false);
          return;
        }
      }

      // Fall back to localStorage
      const key = `path-activities-${activePath.id}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        setCompletedActivities(parsed.activities || []);
        setWeekStartDates(parsed.weekStarts || {});
      }
    } catch (error) {
      console.error('Error loading path progress:', error);
    }
    
    setIsLoading(false);
  };

  // Helper to extract week info from activity ID (format: v1-w1-a1 = visual month 1 week 1 activity 1)
  const getWeekKeyFromActivityId = (activityId: string): string | null => {
    const match = activityId.match(/^([a-z])(\d+)-w(\d+)/);
    if (match) {
      return `${match[1]}${match[2]}-w${match[3]}`;
    }
    return null;
  };

  const getGlobalWeekNumber = (month: number, weekNumber: number): number => {
    return (month - 1) * 4 + weekNumber;
  };

  const getWeekStatus = (month: number, weekNumber: number): WeekAccessStatus | null => {
    if (!activePath) return null;

    const pathType = activePath.path_type;
    const monthCurriculum = getPathCurriculum(pathType as any, month);
    if (!monthCurriculum) return null;

    const weekOutline = monthCurriculum.weeks.find(w => w.weekNumber === weekNumber);
    if (!weekOutline) return null;

    const totalActivities = weekOutline.activities.length;
    const activitiesCompleted = weekOutline.activities.filter(
      a => completedActivities.includes(a.id)
    ).length;
    const isComplete = activitiesCompleted >= totalActivities;

    const globalWeek = getGlobalWeekNumber(month, weekNumber);
    
    // Week 1 is always free
    if (globalWeek === 1) {
      return {
        weekNumber,
        month,
        isUnlocked: true,
        reason: 'free',
        activitiesCompleted,
        totalActivities,
        isComplete
      };
    }

    // Check if premium is required
    if (globalWeek > FREE_WEEKS && !hasPremiumAccess) {
      return {
        weekNumber,
        month,
        isUnlocked: false,
        reason: 'premium_required',
        activitiesCompleted,
        totalActivities,
        isComplete
      };
    }

    // Check if previous week is complete
    const prevMonth = weekNumber === 1 ? month - 1 : month;
    const prevWeek = weekNumber === 1 ? 4 : weekNumber - 1;
    
    if (globalWeek > 1) {
      const prevMonthCurriculum = getPathCurriculum(pathType as any, prevMonth);
      if (prevMonthCurriculum) {
        const prevWeekOutline = prevMonthCurriculum.weeks.find(w => w.weekNumber === prevWeek);
        if (prevWeekOutline) {
          const prevCompleted = prevWeekOutline.activities.filter(
            a => completedActivities.includes(a.id)
          ).length;
          
          if (prevCompleted < prevWeekOutline.activities.length) {
            return {
              weekNumber,
              month,
              isUnlocked: false,
              reason: 'incomplete_previous',
              activitiesCompleted,
              totalActivities,
              isComplete
            };
          }
        }
      }
    }

    // Check time lock (7 days must pass since starting previous week)
    if (globalWeek > 1) {
      const prevWeekKey = `${pathType.charAt(0)}${prevMonth}-w${prevWeek}`;
      const prevWeekStart = weekStartDates[prevWeekKey];
      
      if (prevWeekStart) {
        const daysSinceStart = Math.floor(
          (Date.now() - new Date(prevWeekStart).getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (daysSinceStart < DAYS_BETWEEN_WEEKS) {
          return {
            weekNumber,
            month,
            isUnlocked: false,
            reason: 'time_locked',
            daysUntilUnlock: DAYS_BETWEEN_WEEKS - daysSinceStart,
            activitiesCompleted,
            totalActivities,
            isComplete
          };
        }
      }
    }

    return {
      weekNumber,
      month,
      isUnlocked: true,
      activitiesCompleted,
      totalActivities,
      isComplete
    };
  };

  const canAccessWeek = (month: number, weekNumber: number): boolean => {
    const status = getWeekStatus(month, weekNumber);
    return status?.isUnlocked ?? false;
  };

  const currentWeekStatus = useMemo(() => {
    if (!activePath) return null;
    const currentWeek = getCurrentWeekInMonth(activePath.started_at);
    return getWeekStatus(activePath.current_month, currentWeek);
  }, [activePath, completedActivities, weekStartDates, hasPremiumAccess]);

  const needsPremiumForNextWeek = useMemo(() => {
    if (!activePath || hasPremiumAccess) return false;
    const currentWeek = getCurrentWeekInMonth(activePath.started_at);
    const globalWeek = getGlobalWeekNumber(activePath.current_month, currentWeek);
    return globalWeek >= FREE_WEEKS;
  }, [activePath, hasPremiumAccess]);

  return {
    isLoading,
    canAccessWeek,
    getWeekStatus,
    currentWeekStatus,
    needsPremiumForNextWeek,
    completedActivities,
    refreshAccess: loadProgress
  };
}

// Helper hook to save activity completion
export function useSavePathActivity() {
  const { user } = useAuth();
  const { activePath } = usePath();

  const saveActivity = async (activityId: string) => {
    if (!activePath) return;

    const now = new Date().toISOString();

    if (user) {
      // Save to database
      await supabase
        .from('path_activity_completions')
        .upsert({
          user_id: user.id,
          path_id: activePath.id,
          activity_id: activityId,
          completed_at: now
        }, { onConflict: 'user_id,path_id,activity_id' });
    }

    // Also save to localStorage as backup
    const key = `path-activities-${activePath.id}`;
    const saved = localStorage.getItem(key);
    const data = saved ? JSON.parse(saved) : { activities: [], weekStarts: {} };
    
    if (!data.activities.includes(activityId)) {
      data.activities.push(activityId);
    }

    // Track week start
    const weekKey = activityId.match(/^([a-z])(\d+)-w(\d+)/);
    if (weekKey) {
      const key = `${weekKey[1]}${weekKey[2]}-w${weekKey[3]}`;
      if (!data.weekStarts[key]) {
        data.weekStarts[key] = now;
      }
    }

    localStorage.setItem(key, JSON.stringify(data));
  };

  const removeActivity = async (activityId: string) => {
    if (!activePath) return;

    if (user) {
      await supabase
        .from('path_activity_completions')
        .delete()
        .eq('user_id', user.id)
        .eq('path_id', activePath.id)
        .eq('activity_id', activityId);
    }

    const key = `path-activities-${activePath.id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      const data = JSON.parse(saved);
      data.activities = data.activities.filter((id: string) => id !== activityId);
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

  return { saveActivity, removeActivity };
}
