-- Phase 5: Enhanced Analytics Tables

-- User events table for granular funnel tracking
CREATE TABLE IF NOT EXISTS public.user_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  page_path TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add session tracking to page_views
ALTER TABLE public.page_views 
ADD COLUMN IF NOT EXISTS session_duration_ms INTEGER,
ADD COLUMN IF NOT EXISTS scroll_depth INTEGER,
ADD COLUMN IF NOT EXISTS session_id TEXT;

-- Add cohort tracking to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS cohort_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS first_meaningful_action_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;

-- Experiments table for A/B testing
CREATE TABLE IF NOT EXISTS public.experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  variants JSONB NOT NULL DEFAULT '["control", "variant"]',
  is_active BOOLEAN DEFAULT true,
  traffic_percentage INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ
);

-- Experiment assignments
CREATE TABLE IF NOT EXISTS public.experiment_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id UUID REFERENCES public.experiments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  variant TEXT NOT NULL,
  assigned_at TIMESTAMPTZ DEFAULT now(),
  converted_at TIMESTAMPTZ,
  UNIQUE(experiment_id, user_id)
);

-- Enable RLS
ALTER TABLE public.user_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiment_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_events
CREATE POLICY "Users can insert own events" ON public.user_events
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can view own events" ON public.user_events
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- RLS for experiments (public read for active)
CREATE POLICY "Anyone can read active experiments" ON public.experiments
  FOR SELECT USING (is_active = true);

-- RLS for experiment_assignments
CREATE POLICY "Users can view own assignments" ON public.experiment_assignments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assignments" ON public.experiment_assignments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Index for fast event queries
CREATE INDEX IF NOT EXISTS idx_user_events_user_type ON public.user_events(user_id, event_type);
CREATE INDEX IF NOT EXISTS idx_user_events_created ON public.user_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_experiment_assignments_experiment ON public.experiment_assignments(experiment_id);