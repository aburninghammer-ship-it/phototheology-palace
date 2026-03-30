import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
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
      }
      setLoading(false);
    };
    fetch();
  }, [user, courseId]);

  const toggleDay = useCallback(async (day: number) => {
    if (!user) return;
    if (completedDays.includes(day)) {
      setCompletedDays(prev => prev.filter(d => d !== day));
      await supabase.from("user_course_progress").delete()
        .eq("user_id", user.id).eq("course_id", courseId).eq("day_number", day);
    } else {
      setCompletedDays(prev => [...prev, day]);
      await supabase.from("user_course_progress").insert({
        user_id: user.id, course_id: courseId, day_number: day,
        reflection_note: reflections[day] || null,
      });
      toast.success(`Day ${day} completed! 🎉`);
    }
  }, [user, courseId, completedDays, reflections]);

  const saveReflection = useCallback(async (day: number, note: string) => {
    if (!user) return;
    setReflections(prev => ({ ...prev, [day]: note }));
    if (completedDays.includes(day)) {
      await supabase.from("user_course_progress")
        .update({ reflection_note: note })
        .eq("user_id", user.id).eq("course_id", courseId).eq("day_number", day);
    }
  }, [user, courseId, completedDays]);

  return { completedDays, reflections, loading, toggleDay, saveReflection };
}
