-- Preacher Mentor Commentary Engine v1 - Database Schema
-- 5 tables: passage_analysis_cache, commentary_core_versions, commentary_revision_log, user_study_prefs, user_lens_overrides

-- 1. Passage Analysis Cache - stores AI lens detection results
CREATE TABLE IF NOT EXISTS public.passage_analysis_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  passage_ref TEXT NOT NULL,
  primary_room TEXT NOT NULL,
  secondary_rooms TEXT[] NOT NULL DEFAULT '{}',
  genre TEXT NOT NULL DEFAULT 'narrative',
  doctrinal_sensitivity INTEGER NOT NULL DEFAULT 0,
  rationale JSONB NOT NULL DEFAULT '{}',
  signal_scores JSONB NOT NULL DEFAULT '{}',
  model_version TEXT NOT NULL DEFAULT 'v1',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(passage_ref, model_version)
);

ALTER TABLE public.passage_analysis_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read passage analysis cache"
ON public.passage_analysis_cache FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Service role can insert passage analysis"
ON public.passage_analysis_cache FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Service role can update passage analysis"
ON public.passage_analysis_cache FOR UPDATE
TO service_role
USING (true);

CREATE INDEX idx_passage_analysis_ref ON public.passage_analysis_cache(passage_ref);
CREATE INDEX idx_passage_analysis_primary ON public.passage_analysis_cache(primary_room);

-- 2. Commentary Core Versions - cached generated commentary sections
CREATE TABLE IF NOT EXISTS public.commentary_core_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  passage_ref TEXT NOT NULL,
  primary_room TEXT NOT NULL,
  meaning_section TEXT NOT NULL DEFAULT '',
  language_insight_section JSONB NOT NULL DEFAULT '[]',
  cross_scripture_section TEXT NOT NULL DEFAULT '',
  palace_framing_section TEXT NOT NULL DEFAULT '',
  preaching_orientation_section TEXT NOT NULL DEFAULT '',
  word_count INTEGER NOT NULL DEFAULT 0,
  compliance_report JSONB NOT NULL DEFAULT '{}',
  model_version TEXT NOT NULL DEFAULT 'v1',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(passage_ref, primary_room, model_version)
);

ALTER TABLE public.commentary_core_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read commentary versions"
ON public.commentary_core_versions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Service role can insert commentary versions"
ON public.commentary_core_versions FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Service role can update commentary versions"
ON public.commentary_core_versions FOR UPDATE
TO service_role
USING (true);

CREATE INDEX idx_commentary_ref ON public.commentary_core_versions(passage_ref);
CREATE INDEX idx_commentary_room ON public.commentary_core_versions(primary_room);

-- 3. Commentary Revision Log - track generation/regeneration events
CREATE TABLE IF NOT EXISTS public.commentary_revision_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commentary_id UUID NOT NULL REFERENCES public.commentary_core_versions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL DEFAULT 'generate',
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.commentary_revision_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own revision logs"
ON public.commentary_revision_log FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own revision logs"
ON public.commentary_revision_log FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_revision_commentary ON public.commentary_revision_log(commentary_id);
CREATE INDEX idx_revision_user ON public.commentary_revision_log(user_id);

-- 4. User Study Prefs - per-user scholarly/advanced settings for Preacher Mentor
CREATE TABLE IF NOT EXISTS public.user_study_prefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  scholarly_view BOOLEAN NOT NULL DEFAULT false,
  advanced_lens BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.user_study_prefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own study prefs"
ON public.user_study_prefs FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own study prefs"
ON public.user_study_prefs FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study prefs"
ON public.user_study_prefs FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX idx_study_prefs_user ON public.user_study_prefs(user_id);

-- 5. User Lens Overrides - per-user room overrides for passages
CREATE TABLE IF NOT EXISTS public.user_lens_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  passage_ref TEXT NOT NULL,
  override_primary_room TEXT NOT NULL,
  ai_original_primary TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, passage_ref)
);

ALTER TABLE public.user_lens_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own lens overrides"
ON public.user_lens_overrides FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lens overrides"
ON public.user_lens_overrides FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lens overrides"
ON public.user_lens_overrides FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lens overrides"
ON public.user_lens_overrides FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX idx_lens_overrides_user ON public.user_lens_overrides(user_id);
CREATE INDEX idx_lens_overrides_passage ON public.user_lens_overrides(passage_ref);
