import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type ContentType = 
  | 'central_study'
  | 'devotional'
  | 'bible_reading'
  | 'memory_practice'
  | 'challenge'
  | 'sermon'
  | 'video_training'
  | 'small_group';

export type ActionType = 'started' | 'completed' | 'progress' | 'interacted';

export interface EngagementLog {
  content_type: ContentType;
  action: ActionType;
  content_id?: string;
  content_title?: string;
  progress_percent?: number;
  duration_seconds?: number;
  metadata?: Record<string, any>;
  session_id?: string;
  church_id?: string;
}

export interface DailyEngagementSummary {
  summary_date: string;
  total_sessions: number;
  unique_users: number;
  central_study_sessions: number;
  devotional_sessions: number;
  bible_reading_sessions: number;
  memory_practice_sessions: number;
  challenge_sessions: number;
  sermon_sessions: number;
  total_completions: number;
  avg_completion_percent: number;
  total_duration_minutes: number;
  avg_session_minutes: number;
}

// Hook for logging engagement
export function useStudyEngagement(churchId?: string) {
  const { user } = useAuth();
  const [sessionId] = useState(() => crypto.randomUUID());
  const [sessionStartTime] = useState(() => Date.now());

  // Log an engagement event
  const logEngagement = useCallback(async (log: EngagementLog) => {
    if (!user) return { success: false, error: "Not authenticated" };

    try {
      const { data, error } = await (supabase.rpc as any)('log_study_engagement', {
        p_content_type: log.content_type,
        p_action: log.action,
        p_content_id: log.content_id || null,
        p_content_title: log.content_title || null,
        p_progress_percent: log.progress_percent || 0,
        p_duration_seconds: log.duration_seconds || 0,
        p_metadata: log.metadata || {},
        p_session_id: log.session_id || sessionId,
        p_church_id: log.church_id || churchId || null,
      });

      if (error) throw error;
      return { success: true, id: data };
    } catch (error: any) {
      console.error("Error logging engagement:", error);
      return { success: false, error: error.message };
    }
  }, [user, sessionId, churchId]);

  // Convenience methods for common actions
  const startSession = useCallback((
    contentType: ContentType,
    contentId?: string,
    contentTitle?: string
  ) => {
    return logEngagement({
      content_type: contentType,
      action: 'started',
      content_id: contentId,
      content_title: contentTitle,
    });
  }, [logEngagement]);

  const completeSession = useCallback((
    contentType: ContentType,
    contentId?: string,
    contentTitle?: string,
    durationSeconds?: number
  ) => {
    const duration = durationSeconds || Math.floor((Date.now() - sessionStartTime) / 1000);
    return logEngagement({
      content_type: contentType,
      action: 'completed',
      content_id: contentId,
      content_title: contentTitle,
      progress_percent: 100,
      duration_seconds: duration,
    });
  }, [logEngagement, sessionStartTime]);

  const updateProgress = useCallback((
    contentType: ContentType,
    progressPercent: number,
    contentId?: string,
    contentTitle?: string
  ) => {
    return logEngagement({
      content_type: contentType,
      action: 'progress',
      content_id: contentId,
      content_title: contentTitle,
      progress_percent: progressPercent,
    });
  }, [logEngagement]);

  return {
    logEngagement,
    startSession,
    completeSession,
    updateProgress,
    sessionId,
  };
}

// Hook for fetching engagement analytics (for admins/leaders)
export function useStudyEngagementAnalytics(churchId?: string, days: number = 30) {
  const [data, setData] = useState<DailyEngagementSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('study_engagement_daily')
        .select('*')
        .gte('summary_date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('summary_date', { ascending: true });

      if (churchId) {
        query = query.eq('church_id', churchId);
      } else {
        query = query.is('church_id', null);
      }

      const { data: summaries, error: queryError } = await query;

      if (queryError) throw queryError;
      setData(summaries || []);
    } catch (err: any) {
      console.error("Error fetching engagement analytics:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [churchId, days]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Calculate summary stats
  const summary = data.length > 0 ? {
    totalSessions: data.reduce((sum, d) => sum + d.total_sessions, 0),
    avgDailySessions: Math.round(data.reduce((sum, d) => sum + d.total_sessions, 0) / data.length),
    totalUniqueUsers: new Set(data.flatMap(d => d.unique_users)).size,
    totalCompletions: data.reduce((sum, d) => sum + d.total_completions, 0),
    avgCompletionRate: Math.round(
      data.reduce((sum, d) => sum + d.avg_completion_percent, 0) / data.length
    ),
    totalStudyMinutes: data.reduce((sum, d) => sum + d.total_duration_minutes, 0),
    avgSessionMinutes: Math.round(
      data.reduce((sum, d) => sum + d.avg_session_minutes, 0) / data.length * 10
    ) / 10,
    mostPopularContent: getMostPopularContentType(data),
  } : null;

  return {
    data,
    loading,
    error,
    refetch: fetchAnalytics,
    summary,
  };
}

// Helper to determine most popular content type
function getMostPopularContentType(data: DailyEngagementSummary[]): string {
  const totals = {
    'Bible Study': data.reduce((sum, d) => sum + d.central_study_sessions, 0),
    'Devotional': data.reduce((sum, d) => sum + d.devotional_sessions, 0),
    'Bible Reading': data.reduce((sum, d) => sum + d.bible_reading_sessions, 0),
    'Memory Practice': data.reduce((sum, d) => sum + d.memory_practice_sessions, 0),
    'Challenge': data.reduce((sum, d) => sum + d.challenge_sessions, 0),
    'Sermon': data.reduce((sum, d) => sum + d.sermon_sessions, 0),
  };

  let max = 0;
  let popular = 'Bible Study';
  for (const [type, count] of Object.entries(totals)) {
    if (count > max) {
      max = count;
      popular = type;
    }
  }
  return popular;
}
