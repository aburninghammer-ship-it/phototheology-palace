import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface StudyStatus {
  readingPlanIncomplete: boolean;
  devotionalIncomplete: boolean;
  palacePracticeIncomplete: boolean;
  memoryIncomplete: boolean;
  streakAtRisk: boolean;
  currentStreak: number;
}

export const StudyRemindersNotification = () => {
  const { user } = useAuth();
  const lastCheckDate = useRef<string | null>(null);
  const preferencesRef = useRef<{
    reading_plan_reminders: boolean | null;
    devotional_reminders: boolean | null;
    palace_practice_reminders: boolean | null;
    memory_challenge_reminders: boolean | null;
    streak_protection_alerts: boolean | null;
  } | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchPreferences = async () => {
      const { data } = await supabase
        .from("notification_preferences")
        .select("reading_plan_reminders, devotional_reminders, palace_practice_reminders, memory_challenge_reminders, streak_protection_alerts")
        .eq("user_id", user.id)
        .maybeSingle();
      
      preferencesRef.current = data;
    };

    fetchPreferences();
  }, [user]);

  useEffect(() => {
    if (!user || !("Notification" in window) || Notification.permission !== "granted") {
      return;
    }

    const checkStudyStatus = async (): Promise<StudyStatus> => {
      const today = new Date().toISOString().split('T')[0];
      
      // Check reading plan progress
      const { data: readingProgress } = await supabase
        .from("user_reading_progress")
        .select("id, current_day")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .maybeSingle();

      let readingPlanIncomplete = false;
      if (readingProgress) {
        const { data: todayCompletion } = await supabase
          .from("daily_reading_completions")
          .select("id")
          .eq("user_progress_id", readingProgress.id)
          .gte("completed_at", today)
          .maybeSingle();
        readingPlanIncomplete = !todayCompletion;
      }

      // Check devotional progress
      const { data: devotionalProgress } = await supabase
        .from("devotional_progress")
        .select("id")
        .eq("user_id", user.id)
        .gte("completed_at", today)
        .limit(1);
      const devotionalIncomplete = !devotionalProgress || devotionalProgress.length === 0;

      // Check palace practice (drill results)
      const { data: drillResults } = await supabase
        .from("drill_results")
        .select("id")
        .eq("user_id", user.id)
        .gte("completed_at", today)
        .limit(1);
      const palacePracticeIncomplete = !drillResults || drillResults.length === 0;

      // Check memory challenges
      const { data: memoryResults } = await supabase
        .from("challenge_submissions")
        .select("id")
        .eq("user_id", user.id)
        .gte("created_at", today)
        .limit(1);
      const memoryIncomplete = !memoryResults || memoryResults.length === 0;

      // Check streak status
      const { data: streakData } = await supabase
        .from("mastery_streaks")
        .select("current_streak, last_activity_date")
        .eq("user_id", user.id)
        .maybeSingle();

      let streakAtRisk = false;
      let currentStreak = 0;
      if (streakData && streakData.current_streak && streakData.current_streak > 0) {
        currentStreak = streakData.current_streak;
        const lastActivity = new Date(streakData.last_activity_date!);
        const todayDate = new Date();
        const diffTime = todayDate.getTime() - lastActivity.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        // Streak at risk if last activity was yesterday and no activity today
        streakAtRisk = diffDays >= 1 && currentStreak >= 3;
      }

      return {
        readingPlanIncomplete,
        devotionalIncomplete,
        palacePracticeIncomplete,
        memoryIncomplete,
        streakAtRisk,
        currentStreak
      };
    };

    const sendReminders = async () => {
      const prefs = preferencesRef.current;
      if (!prefs) return;

      const now = new Date();
      const today = now.toDateString();
      
      // Don't send if already sent today
      if (lastCheckDate.current === today) return;

      // Check if it's 8 AM within 5-minute window
      if (now.getHours() !== 8 || now.getMinutes() >= 5) return;

      const status = await checkStudyStatus();
      const reminders: string[] = [];

      // Check each activity type
      if (prefs.reading_plan_reminders && status.readingPlanIncomplete) {
        reminders.push("📖 Reading Plan");
      }
      if (prefs.devotional_reminders && status.devotionalIncomplete) {
        reminders.push("🙏 Devotional");
      }
      if (prefs.palace_practice_reminders && status.palacePracticeIncomplete) {
        reminders.push("🏛️ Palace Practice");
      }
      if (prefs.memory_challenge_reminders && status.memoryIncomplete) {
        reminders.push("🧠 Memory Challenge");
      }

      // Send combined reminder if there are incomplete activities
      if (reminders.length > 0) {
        new Notification("📚 Daily Study Reminder", {
          body: `Don't forget to complete today's:\n${reminders.join("\n")}`,
          icon: "/favicon.ico",
          tag: "study-reminder"
        });
      }

      // Streak protection alert (separate notification)
      if (prefs.streak_protection_alerts && status.streakAtRisk) {
        new Notification("🔥 Streak Alert!", {
          body: `Your ${status.currentStreak}-day streak is at risk! Complete any activity today to keep it alive.`,
          icon: "/favicon.ico",
          tag: "streak-alert"
        });
      }

      lastCheckDate.current = today;
    };

    // Check every minute
    const interval = setInterval(sendReminders, 60000);
    sendReminders(); // Check immediately

    return () => clearInterval(interval);
  }, [user]);

  return null; // Background component
};
