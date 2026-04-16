import { useCallback, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useChurchMembership } from "./useChurchMembership";

interface EngagementSession {
  id?: string;
  studyId?: string;
  studyType?: string;
  contentType?: string;
  startedAt: Date;
}

export function useStudyEngagement() {
  const { user } = useAuth();
  const { churchId } = useChurchMembership();
  const currentSession = useRef<EngagementSession | null>(null);

  // Start tracking a study session
  const startSession = useCallback(
    async (options: {
      studyId?: string;
      studyType?: string;
      contentType?: string;
    }) => {
      if (!user) return null;

      // End any existing session first
      if (currentSession.current) {
        await endSession(false);
      }

      try {
        const { data, error } = await (supabase as any)
          .from("study_engagement_sessions")
          .insert({
            user_id: user.id,
            church_id: churchId || null,
            study_id: options.studyId || null,
            study_type: options.studyType || null,
            content_type: options.contentType || null,
          })
          .select()
          .single();

        if (error) throw error;

        currentSession.current = {
          id: data.id,
          studyId: options.studyId,
          studyType: options.studyType,
          contentType: options.contentType,
          startedAt: new Date(),
        };

        return data.id;
      } catch (error) {
        console.error("Error starting engagement session:", error);
        return null;
      }
    },
    [user, churchId]
  );

  // End the current session
  const endSession = useCallback(
    async (completed: boolean = true) => {
      if (!currentSession.current?.id) return;

      const session = currentSession.current;
      const durationSeconds = Math.floor(
        (new Date().getTime() - session.startedAt.getTime()) / 1000
      );

      try {
        await (supabase as any)
          .from("study_engagement_sessions")
          .update({
            ended_at: new Date().toISOString(),
            duration_seconds: durationSeconds,
            completed,
          })
          .eq("id", session.id);

        currentSession.current = null;
      } catch (error) {
        console.error("Error ending engagement session:", error);
      }
    },
    []
  );

  // Track a quick engagement (for pages without long sessions)
  const trackEngagement = useCallback(
    async (options: {
      studyId?: string;
      studyType?: string;
      contentType?: string;
      durationSeconds?: number;
      completed?: boolean;
    }) => {
      if (!user) return;

      try {
        await (supabase as any).from("study_engagement_sessions").insert({
          user_id: user.id,
          church_id: churchId || null,
          study_id: options.studyId || null,
          study_type: options.studyType || null,
          content_type: options.contentType || null,
          duration_seconds: options.durationSeconds || 0,
          completed: options.completed ?? true,
          ended_at: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error tracking engagement:", error);
      }
    },
    [user, churchId]
  );

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (currentSession.current) {
        // Fire and forget - don't await in cleanup
        endSession(false);
      }
    };
  }, [endSession]);

  return {
    startSession,
    endSession,
    trackEngagement,
  };
}
