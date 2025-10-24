import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface CourseProgress {
  id: string;
  course_name: string;
  completed_lessons: string[];
  current_lesson: string | null;
  progress_percentage: number;
  started_at: string;
  completed_at: string | null;
}

export const useCourseProgress = (courseName: string) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProgress();
    }
  }, [user, courseName]);

  const loadProgress = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("course_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("course_name", courseName)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;
      
      if (data) {
        setProgress({
          ...data,
          completed_lessons: data.completed_lessons as string[],
        });
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const startCourse = async () => {
    if (!user) return;

    try {
      const { error } = await supabase.from("course_progress").insert({
        user_id: user.id,
        course_name: courseName,
        completed_lessons: [],
        progress_percentage: 0,
      });

      if (error) throw error;
      loadProgress();
    } catch (error) {
      console.error("Error starting course:", error);
    }
  };

  const completeLesson = async (lessonId: string, totalLessons: number) => {
    if (!user || !progress) {
      if (!progress) await startCourse();
      return;
    }

    try {
      const completedLessons = [...(progress.completed_lessons || [])];
      if (!completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId);
      }

      const progressPercentage = Math.round(
        (completedLessons.length / totalLessons) * 100
      );
      const isCompleted = progressPercentage === 100;

      const { error } = await supabase
        .from("course_progress")
        .update({
          completed_lessons: completedLessons,
          progress_percentage: progressPercentage,
          completed_at: isCompleted ? new Date().toISOString() : null,
          last_accessed_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .eq("course_name", courseName);

      if (error) throw error;

      // Generate certificate if completed
      if (isCompleted) {
        await generateCertificate();
      }

      loadProgress();
    } catch (error) {
      console.error("Error completing lesson:", error);
    }
  };

  const generateCertificate = async () => {
    if (!user) return;

    try {
      const shareToken = `cert-${Math.random().toString(36).substring(7)}`;
      
      const { error } = await supabase.from("certificates").insert({
        user_id: user.id,
        certificate_type: "course_completion",
        course_name: courseName,
        share_token: shareToken,
        certificate_data: {
          courseName,
          completedAt: new Date().toISOString(),
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error generating certificate:", error);
    }
  };

  return { progress, loading, startCourse, completeLesson };
};
