import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface ReadingStreak {
  current_streak: number;
  longest_streak: number;
  last_read_date: string | null;
  total_chapters_read: number;
  total_verses_read: number;
}

export const useReadingStreak = () => {
  const { user } = useAuth();
  const [streak, setStreak] = useState<ReadingStreak | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStreak();
    } else {
      setStreak(null);
      setLoading(false);
    }
  }, [user]);

  const fetchStreak = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("reading_streaks")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      setStreak(data);
    } catch (error) {
      console.error("Error fetching streak:", error);
    } finally {
      setLoading(false);
    }
  };

  const logReading = async (book: string, chapter: number, versesRead: number = 0, timeSpentSeconds: number = 0) => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from("daily_reading_log")
        .upsert({
          user_id: user.id,
          read_date: today,
          book,
          chapter,
          verses_read: versesRead,
          time_spent_seconds: timeSpentSeconds,
        }, {
          onConflict: "user_id,read_date,book,chapter"
        });

      if (error) throw error;
      
      // Refresh streak data
      await fetchStreak();
    } catch (error) {
      console.error("Error logging reading:", error);
    }
  };

  const getTodayProgress = async () => {
    if (!user) return [];

    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from("daily_reading_log")
        .select("*")
        .eq("user_id", user.id)
        .eq("read_date", today);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching today's progress:", error);
      return [];
    }
  };

  return {
    streak,
    loading,
    logReading,
    getTodayProgress,
    refreshStreak: fetchStreak,
  };
};
