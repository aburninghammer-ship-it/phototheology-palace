import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ProgressEntry {
  day_number: number;
  completed_at: string;
  reflection_note: string | null;
}

export function useCourseProgress(courseId: string = "phototheology") {
  const { user } = useAuth();
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [reflections, setReflections] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [courseStartDate, setCourseStartDate] = useState<Date | null>(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const fetch = async () => {
      const { data, error } = await supabase
        .from("user_course_progress")
        .select("day_number, completed_at, reflection_note")
        .eq("user_id", user.id)
        .eq("course_id", courseId);
      if (!error && data) {
        setCompletedDays(data.map((d: ProgressEntry) => d.day_number));
        const refs: Record<number, string> = {};
        data.forEach((d: ProgressEntry) => { if (d.reflection_note) refs[d.day_number] = d.reflection_note; });
        setReflections(refs);

        // Derive start date from earliest completed_at
        if (data.length > 0) {
          const earliest = data.reduce((min: ProgressEntry, d: ProgressEntry) =>
            new Date(d.completed_at) < new Date(min.completed_at) ? d : min, data[0]);
          setCourseStartDate(new Date(earliest.completed_at));
        }
      }
      setLoading(false);
    };
    fetch();
  }, [user, courseId]);

  /**
   * Returns the day number that is currently unlocked based on real calendar days.
   * Day 1 is always available. After Day 1 is completed, Day N unlocks N-1 days later.
   */
  const getUnlockedDay = useCallback((): number => {
    if (!courseStartDate) return 1; // Only Day 1 available before starting
    const now = new Date();
    const msPerDay = 24 * 60 * 60 * 1000;
    const daysSinceStart = Math.floor((now.getTime() - courseStartDate.getTime()) / msPerDay);
    return Math.min(daysSinceStart + 1, 90); // +1 because Day 1 is day 0
  }, [courseStartDate]);

  const isDayUnlocked = useCallback((day: number): boolean => {
    return day <= getUnlockedDay();
  }, [getUnlockedDay]);

  const isDayCompletable = useCallback((day: number): boolean => {
    if (!isDayUnlocked(day)) return false;
    // All previous days must be completed
    for (let i = 1; i < day; i++) {
      if (!completedDays.includes(i)) return false;
    }
    return true;
  }, [isDayUnlocked, completedDays]);

  const toggleDay = useCallback(async (day: number) => {
    if (!user) return;

    // Prevent completing locked/out-of-order days
    if (!completedDays.includes(day) && !isDayCompletable(day)) {
      if (!isDayUnlocked(day)) {
        const daysUntil = day - getUnlockedDay();
        toast.error(`Day ${day} unlocks in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`, {
          description: "This course is designed to be completed over 90 real days."
        });
      } else {
        toast.error(`Complete previous days first`, {
          description: `You need to finish all days before Day ${day}.`
        });
      }
      return;
    }

    if (completedDays.includes(day)) {
      setCompletedDays(prev => prev.filter(d => d !== day));
      await supabase.from("user_course_progress").delete()
        .eq("user_id", user.id).eq("course_id", courseId).eq("day_number", day);
    } else {
      setCompletedDays(prev => [...prev, day]);
      const now = new Date().toISOString();
      await supabase.from("user_course_progress").insert({
        user_id: user.id, course_id: courseId, day_number: day,
        reflection_note: reflections[day] || null,
      });
      // If this is the first day completed, set start date
      if (!courseStartDate) {
        setCourseStartDate(new Date(now));
      }
      toast.success(`Day ${day} completed! 🎉`);
    }
  }, [user, courseId, completedDays, reflections, isDayCompletable, isDayUnlocked, getUnlockedDay, courseStartDate]);

  const saveReflection = useCallback(async (day: number, note: string) => {
    if (!user) return;
    setReflections(prev => ({ ...prev, [day]: note }));
    if (completedDays.includes(day)) {
      await supabase.from("user_course_progress")
        .update({ reflection_note: note })
        .eq("user_id", user.id).eq("course_id", courseId).eq("day_number", day);
    }
  }, [user, courseId, completedDays]);

  return {
    completedDays, reflections, loading, toggleDay, saveReflection,
    courseStartDate, getUnlockedDay, isDayUnlocked, isDayCompletable
  };
}
