-- Study Engagement Analytics System
-- Tracks user engagement with Bible studies, devotionals, and learning content

-- Study sessions table - tracks when users engage with content
CREATE TABLE IF NOT EXISTS public.study_engagement_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  church_id UUID REFERENCES public.churches(id) ON DELETE SET NULL,
  
  -- Content type and reference
  content_type TEXT NOT NULL CHECK (content_type IN (
    'central_study',    -- Church central study
    'devotional',       -- Daily devotional
    'bible_reading',    -- Bible reading session
    'memory_practice',  -- Memory palace practice
    'challenge',        -- Weekly challenges
    'sermon',           -- Sermon viewing
    'video_training',   -- Training videos
    'small_group'       -- Small group study session
  )),
  content_id TEXT,         -- Reference to specific content (study ID, verse range, etc.)
  content_title TEXT,      -- Title for easy querying
  
  -- Engagement metrics
  action TEXT NOT NULL CHECK (action IN ('started', 'completed', 'progress', 'interacted')),
  progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  duration_seconds INTEGER DEFAULT 0,
  
  -- Additional metadata
  metadata JSONB DEFAULT '{}'::jsonb,  -- Extra context like {verse_count: 5, questions_answered: 3}
  
  -- Session context
  session_id TEXT,         -- Group related events together
  device_type TEXT CHECK (device_type IN ('mobile', 'tablet', 'desktop', 'unknown')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Daily engagement summaries (pre-aggregated for performance)
CREATE TABLE IF NOT EXISTS public.study_engagement_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  summary_date DATE NOT NULL,
  church_id UUID REFERENCES public.churches(id) ON DELETE CASCADE,
  
  -- Session counts
  total_sessions INTEGER DEFAULT 0,
  unique_users INTEGER DEFAULT 0,
  
  -- Content type breakdown
  central_study_sessions INTEGER DEFAULT 0,
  devotional_sessions INTEGER DEFAULT 0,
  bible_reading_sessions INTEGER DEFAULT 0,
  memory_practice_sessions INTEGER DEFAULT 0,
  challenge_sessions INTEGER DEFAULT 0,
  sermon_sessions INTEGER DEFAULT 0,
  
  -- Completion metrics
  total_completions INTEGER DEFAULT 0,
  avg_completion_percent NUMERIC(5,2) DEFAULT 0,
  
  -- Time metrics
  total_duration_minutes INTEGER DEFAULT 0,
  avg_session_minutes NUMERIC(5,2) DEFAULT 0,
  
  -- Popular content (stored as JSON array)
  top_content JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(summary_date, church_id)
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_study_engagement_logs_user_id 
  ON public.study_engagement_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_study_engagement_logs_church_id 
  ON public.study_engagement_logs(church_id);
CREATE INDEX IF NOT EXISTS idx_study_engagement_logs_created_at 
  ON public.study_engagement_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_study_engagement_logs_content_type 
  ON public.study_engagement_logs(content_type);
CREATE INDEX IF NOT EXISTS idx_study_engagement_daily_date 
  ON public.study_engagement_daily(summary_date DESC);
CREATE INDEX IF NOT EXISTS idx_study_engagement_daily_church 
  ON public.study_engagement_daily(church_id, summary_date DESC);

-- Enable RLS
ALTER TABLE public.study_engagement_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_engagement_daily ENABLE ROW LEVEL SECURITY;

-- Policies for study_engagement_logs
CREATE POLICY "Users can log their own engagement"
  ON public.study_engagement_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own engagement"
  ON public.study_engagement_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all engagement"
  ON public.study_engagement_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Church leaders can view their church engagement"
  ON public.study_engagement_logs FOR SELECT
  USING (
    church_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = study_engagement_logs.church_id
        AND user_id = auth.uid()
        AND role IN ('admin', 'leader', 'pastor')
    )
  );

-- Policies for study_engagement_daily
CREATE POLICY "Admins can view all summaries"
  ON public.study_engagement_daily FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Church leaders can view their church summaries"
  ON public.study_engagement_daily FOR SELECT
  USING (
    church_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = study_engagement_daily.church_id
        AND user_id = auth.uid()
        AND role IN ('admin', 'leader', 'pastor')
    )
  );

-- Function to log engagement
CREATE OR REPLACE FUNCTION log_study_engagement(
  p_content_type TEXT,
  p_action TEXT,
  p_content_id TEXT DEFAULT NULL,
  p_content_title TEXT DEFAULT NULL,
  p_progress_percent INTEGER DEFAULT 0,
  p_duration_seconds INTEGER DEFAULT 0,
  p_metadata JSONB DEFAULT '{}'::jsonb,
  p_session_id TEXT DEFAULT NULL,
  p_church_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO public.study_engagement_logs (
    user_id,
    church_id,
    content_type,
    content_id,
    content_title,
    action,
    progress_percent,
    duration_seconds,
    metadata,
    session_id
  ) VALUES (
    auth.uid(),
    p_church_id,
    p_content_type,
    p_content_id,
    p_content_title,
    p_action,
    p_progress_percent,
    p_duration_seconds,
    p_metadata,
    COALESCE(p_session_id, gen_random_uuid()::text)
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;

-- Function to generate daily summaries (called by cron)
CREATE OR REPLACE FUNCTION generate_study_engagement_summary(p_date DATE DEFAULT CURRENT_DATE - INTERVAL '1 day')
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Generate summaries for each church
  INSERT INTO public.study_engagement_daily (
    summary_date,
    church_id,
    total_sessions,
    unique_users,
    central_study_sessions,
    devotional_sessions,
    bible_reading_sessions,
    memory_practice_sessions,
    challenge_sessions,
    sermon_sessions,
    total_completions,
    avg_completion_percent,
    total_duration_minutes,
    avg_session_minutes
  )
  SELECT
    p_date,
    church_id,
    COUNT(*),
    COUNT(DISTINCT user_id),
    COUNT(*) FILTER (WHERE content_type = 'central_study'),
    COUNT(*) FILTER (WHERE content_type = 'devotional'),
    COUNT(*) FILTER (WHERE content_type = 'bible_reading'),
    COUNT(*) FILTER (WHERE content_type = 'memory_practice'),
    COUNT(*) FILTER (WHERE content_type = 'challenge'),
    COUNT(*) FILTER (WHERE content_type = 'sermon'),
    COUNT(*) FILTER (WHERE action = 'completed'),
    ROUND(AVG(progress_percent), 2),
    ROUND(SUM(duration_seconds) / 60.0),
    ROUND(AVG(duration_seconds) / 60.0, 2)
  FROM public.study_engagement_logs
  WHERE created_at::date = p_date
  GROUP BY church_id
  ON CONFLICT (summary_date, church_id)
  DO UPDATE SET
    total_sessions = EXCLUDED.total_sessions,
    unique_users = EXCLUDED.unique_users,
    central_study_sessions = EXCLUDED.central_study_sessions,
    devotional_sessions = EXCLUDED.devotional_sessions,
    bible_reading_sessions = EXCLUDED.bible_reading_sessions,
    memory_practice_sessions = EXCLUDED.memory_practice_sessions,
    challenge_sessions = EXCLUDED.challenge_sessions,
    sermon_sessions = EXCLUDED.sermon_sessions,
    total_completions = EXCLUDED.total_completions,
    avg_completion_percent = EXCLUDED.avg_completion_percent,
    total_duration_minutes = EXCLUDED.total_duration_minutes,
    avg_session_minutes = EXCLUDED.avg_session_minutes;

  -- Generate platform-wide summary (church_id = NULL)
  INSERT INTO public.study_engagement_daily (
    summary_date,
    church_id,
    total_sessions,
    unique_users,
    central_study_sessions,
    devotional_sessions,
    bible_reading_sessions,
    memory_practice_sessions,
    challenge_sessions,
    sermon_sessions,
    total_completions,
    avg_completion_percent,
    total_duration_minutes,
    avg_session_minutes
  )
  SELECT
    p_date,
    NULL,
    COUNT(*),
    COUNT(DISTINCT user_id),
    COUNT(*) FILTER (WHERE content_type = 'central_study'),
    COUNT(*) FILTER (WHERE content_type = 'devotional'),
    COUNT(*) FILTER (WHERE content_type = 'bible_reading'),
    COUNT(*) FILTER (WHERE content_type = 'memory_practice'),
    COUNT(*) FILTER (WHERE content_type = 'challenge'),
    COUNT(*) FILTER (WHERE content_type = 'sermon'),
    COUNT(*) FILTER (WHERE action = 'completed'),
    ROUND(AVG(progress_percent), 2),
    ROUND(SUM(duration_seconds) / 60.0),
    ROUND(AVG(duration_seconds) / 60.0, 2)
  FROM public.study_engagement_logs
  WHERE created_at::date = p_date
  ON CONFLICT (summary_date, church_id)
  DO UPDATE SET
    total_sessions = EXCLUDED.total_sessions,
    unique_users = EXCLUDED.unique_users,
    central_study_sessions = EXCLUDED.central_study_sessions,
    devotional_sessions = EXCLUDED.devotional_sessions,
    bible_reading_sessions = EXCLUDED.bible_reading_sessions,
    memory_practice_sessions = EXCLUDED.memory_practice_sessions,
    challenge_sessions = EXCLUDED.challenge_sessions,
    sermon_sessions = EXCLUDED.sermon_sessions,
    total_completions = EXCLUDED.total_completions,
    avg_completion_percent = EXCLUDED.avg_completion_percent,
    total_duration_minutes = EXCLUDED.total_duration_minutes,
    avg_session_minutes = EXCLUDED.avg_session_minutes;
END;
$$;

-- Function to get engagement stats for a church
CREATE OR REPLACE FUNCTION get_church_engagement_stats(
  p_church_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  summary_date DATE,
  total_sessions INTEGER,
  unique_users INTEGER,
  total_completions INTEGER,
  avg_completion_percent NUMERIC,
  total_duration_minutes INTEGER
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    summary_date,
    total_sessions,
    unique_users,
    total_completions,
    avg_completion_percent,
    total_duration_minutes
  FROM public.study_engagement_daily
  WHERE church_id = p_church_id
    AND summary_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
  ORDER BY summary_date ASC;
$$;
