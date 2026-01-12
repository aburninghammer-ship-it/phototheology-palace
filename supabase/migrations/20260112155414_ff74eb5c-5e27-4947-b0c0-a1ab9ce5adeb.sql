-- PhotoTheology Adaptive Onboarding & Study Path System

-- Enum for user roles/contexts
CREATE TYPE public.pt_user_role AS ENUM (
  'pastor',
  'teacher',
  'lay_member',
  'student',
  'new_believer',
  'scholar',
  'explorer'
);

-- Enum for mastery levels (non-self-promotable)
CREATE TYPE public.pt_mastery_level AS ENUM (
  'beginner',
  'intermediate',
  'master'
);

-- Enum for primary study burdens
CREATE TYPE public.pt_study_burden AS ENUM (
  'prophecy',
  'sanctuary_gospel',
  'study_method',
  'parables_symbols',
  'sermon_building',
  'apologetics',
  'christ_centered',
  'study_habits'
);

-- Enum for pain point types
CREATE TYPE public.pt_pain_point_type AS ENUM (
  'diagnostic',
  'symptomatic'
);

-- User Study Profile (core onboarding data)
CREATE TABLE public.user_study_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Screen A: Primary Burdens (max 2)
  primary_burdens pt_study_burden[] NOT NULL DEFAULT '{}',
  
  -- Screen B: Role Context
  user_role pt_user_role NOT NULL DEFAULT 'lay_member',
  
  -- Screen C: Confidence Grid (0-3 for each domain)
  confidence_bible_storyline INT NOT NULL DEFAULT 0 CHECK (confidence_bible_storyline >= 0 AND confidence_bible_storyline <= 3),
  confidence_gospel_basics INT NOT NULL DEFAULT 0 CHECK (confidence_gospel_basics >= 0 AND confidence_gospel_basics <= 3),
  confidence_sanctuary_basics INT NOT NULL DEFAULT 0 CHECK (confidence_sanctuary_basics >= 0 AND confidence_sanctuary_basics <= 3),
  confidence_prophecy INT NOT NULL DEFAULT 0 CHECK (confidence_prophecy >= 0 AND confidence_prophecy <= 3),
  confidence_parables_symbols INT NOT NULL DEFAULT 0 CHECK (confidence_parables_symbols >= 0 AND confidence_parables_symbols <= 3),
  confidence_cross_referencing INT NOT NULL DEFAULT 0 CHECK (confidence_cross_referencing >= 0 AND confidence_cross_referencing <= 3),
  confidence_study_consistency INT NOT NULL DEFAULT 0 CHECK (confidence_study_consistency >= 0 AND confidence_study_consistency <= 3),
  
  -- Screen D (Optional): Pain Points
  pain_points JSONB DEFAULT '[]'::jsonb, -- Array of {point: string, type: 'diagnostic'|'symptomatic'}
  
  -- Time & Learning Style
  available_time_minutes INT NOT NULL DEFAULT 20,
  learning_preference TEXT NOT NULL DEFAULT 'structured_text' CHECK (learning_preference IN ('visual', 'structured_text', 'audio', 'interactive')),
  
  -- Current State
  current_level pt_mastery_level NOT NULL DEFAULT 'beginner',
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  onboarding_skipped BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Study Tracks (the paths users follow)
CREATE TABLE public.pt_study_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  burden_alignment pt_study_burden[] NOT NULL DEFAULT '{}', -- Which burdens this track addresses
  min_confidence_level INT NOT NULL DEFAULT 0, -- Minimum avg confidence for this track
  room_focus TEXT[] DEFAULT '{}', -- Palace rooms emphasized
  floor_focus INT[] DEFAULT '{}', -- Palace floors emphasized
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User's Active Study Path
CREATE TABLE public.user_study_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id UUID REFERENCES pt_study_tracks(id) ON DELETE SET NULL,
  
  -- Current state
  current_session_number INT NOT NULL DEFAULT 1,
  sessions_completed INT NOT NULL DEFAULT 0,
  
  -- Level tracking (earned, not self-assigned)
  demonstrated_level pt_mastery_level NOT NULL DEFAULT 'beginner',
  level_earned_at TIMESTAMPTZ,
  
  -- Competency metrics
  room_completions JSONB DEFAULT '{}'::jsonb, -- {room_code: completion_percentage}
  scenario_scores JSONB DEFAULT '[]'::jsonb, -- [{scenario_id, score, passed}]
  integration_tasks_completed INT NOT NULL DEFAULT 0,
  
  -- Recalibration
  last_recalibration_requested TIMESTAMPTZ,
  recalibration_count INT NOT NULL DEFAULT 0,
  
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(user_id, is_active) -- Only one active path per user
);

-- AI-Generated Sessions
CREATE TABLE public.pt_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path_id UUID NOT NULL REFERENCES user_study_paths(id) ON DELETE CASCADE,
  session_number INT NOT NULL,
  
  -- Session content (AI-generated)
  title TEXT NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('orientation', 'skill_focus', 'integration', 'mastery_check', 'recalibration')),
  
  -- Palace mapping
  primary_room_codes TEXT[] DEFAULT '{}',
  secondary_room_codes TEXT[] DEFAULT '{}',
  floor_numbers INT[] DEFAULT '{}',
  
  -- Content structure
  content JSONB NOT NULL DEFAULT '{}'::jsonb, -- {intro, exercises, reflection, next_steps}
  skill_focus TEXT, -- What skill user will develop
  confidence_targets TEXT[], -- What should improve
  
  -- Progress
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  time_spent_minutes INT DEFAULT 0,
  completion_score DECIMAL(5,2), -- 0-100
  
  -- Competency check results (if applicable)
  competency_check_passed BOOLEAN,
  competency_feedback TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Scenario Evaluations (for mastery gating)
CREATE TABLE public.pt_scenario_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES pt_sessions(id) ON DELETE SET NULL,
  
  -- Scenario details
  scenario_type TEXT NOT NULL CHECK (scenario_type IN ('interpretation', 'diagnosis', 'construction', 'integration')),
  scenario_prompt TEXT NOT NULL,
  user_response TEXT,
  
  -- AI grading
  ai_evaluation JSONB, -- {score, feedback, areas_strong, areas_weak, demonstrates_mastery}
  score DECIMAL(5,2),
  passed BOOLEAN,
  
  -- Palace context
  rooms_tested TEXT[] DEFAULT '{}',
  floors_tested INT[] DEFAULT '{}',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Recalibration Requests
CREATE TABLE public.pt_recalibration_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  path_id UUID REFERENCES user_study_paths(id) ON DELETE SET NULL,
  
  -- Request details
  reason TEXT,
  requested_level pt_mastery_level,
  
  -- Evaluation result
  evaluation_result JSONB, -- AI assessment of readiness
  approved BOOLEAN,
  new_level pt_mastery_level,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.user_study_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pt_study_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_study_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pt_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pt_scenario_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pt_recalibration_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own study profile" ON public.user_study_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own study profile" ON public.user_study_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study profile" ON public.user_study_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view study tracks" ON public.pt_study_tracks
  FOR SELECT USING (true);

CREATE POLICY "Users can view their own study paths" ON public.user_study_paths
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own study paths" ON public.user_study_paths
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study paths" ON public.user_study_paths
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own sessions" ON public.pt_sessions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_study_paths WHERE id = pt_sessions.path_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can insert their own sessions" ON public.pt_sessions
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_study_paths WHERE id = pt_sessions.path_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can update their own sessions" ON public.pt_sessions
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_study_paths WHERE id = pt_sessions.path_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can view their own evaluations" ON public.pt_scenario_evaluations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own evaluations" ON public.pt_scenario_evaluations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own recalibration requests" ON public.pt_recalibration_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recalibration requests" ON public.pt_recalibration_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_user_study_profiles_user ON public.user_study_profiles(user_id);
CREATE INDEX idx_user_study_paths_user ON public.user_study_paths(user_id);
CREATE INDEX idx_user_study_paths_active ON public.user_study_paths(user_id, is_active) WHERE is_active = true;
CREATE INDEX idx_pt_sessions_path ON public.pt_sessions(path_id);
CREATE INDEX idx_pt_sessions_number ON public.pt_sessions(path_id, session_number);

-- Insert default study tracks
INSERT INTO public.pt_study_tracks (name, description, burden_alignment, min_confidence_level, room_focus, floor_focus) VALUES
  ('Prophecy Foundations', 'Understanding Daniel & Revelation through the Palace framework', ARRAY['prophecy']::pt_study_burden[], 0, ARRAY['PR', 'BL', '3A'], ARRAY[5, 6]),
  ('Sanctuary & Gospel', 'The sanctuary as the blueprint of salvation', ARRAY['sanctuary_gospel']::pt_study_burden[], 0, ARRAY['BL', 'CR', 'DR'], ARRAY[4, 5]),
  ('Study Method Mastery', 'Learning to study the Bible properly using PT principles', ARRAY['study_method']::pt_study_burden[], 0, ARRAY['OR', 'DC', 'QR', 'QA'], ARRAY[1, 2]),
  ('Symbols & Parables', 'Understanding symbolic and parabolic language', ARRAY['parables_symbols']::pt_study_burden[], 0, ARRAY['ST', 'TR', 'C6'], ARRAY[2, 4]),
  ('Sermon Building', 'Constructing Christ-centered messages', ARRAY['sermon_building']::pt_study_burden[], 1, ARRAY['CR', 'DR', 'TRm', 'FRt'], ARRAY[4, 7]),
  ('Apologetics Training', 'Answering difficult Bible questions', ARRAY['apologetics']::pt_study_burden[], 1, ARRAY['DC', 'QR', 'QA', 'PRm'], ARRAY[2, 4]),
  ('Christ-Centered Focus', 'Finding Christ in every text', ARRAY['christ_centered']::pt_study_burden[], 0, ARRAY['CR', 'DR', 'FRt'], ARRAY[4, 7]),
  ('Foundations', 'Default path for building consistent Bible study habits', ARRAY['study_habits']::pt_study_burden[], 0, ARRAY['SR', 'IR', 'GR'], ARRAY[1, 3]);

-- Update trigger
CREATE OR REPLACE FUNCTION update_study_profile_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_study_profiles_timestamp
  BEFORE UPDATE ON public.user_study_profiles
  FOR EACH ROW EXECUTE FUNCTION update_study_profile_timestamp();

CREATE TRIGGER update_user_study_paths_timestamp
  BEFORE UPDATE ON public.user_study_paths
  FOR EACH ROW EXECUTE FUNCTION update_study_profile_timestamp();