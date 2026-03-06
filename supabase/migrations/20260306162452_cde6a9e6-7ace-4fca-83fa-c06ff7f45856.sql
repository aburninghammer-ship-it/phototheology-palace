
-- Table for AI-generated guided study paths
CREATE TABLE public.generated_study_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Route',
  theme_type TEXT NOT NULL, -- 'symbol', 'number', 'person', 'title', 'object', 'concept', 'theme'
  theme_keyword TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'patterns',
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Each step: { title, verse_anchor, observe, connect, discover }
  estimated_sessions INTEGER NOT NULL DEFAULT 5,
  generation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  view_count INTEGER NOT NULL DEFAULT 0
);

-- Index for daily lookup
CREATE INDEX idx_generated_study_paths_date ON public.generated_study_paths(generation_date DESC);
CREATE INDEX idx_generated_study_paths_active ON public.generated_study_paths(is_active) WHERE is_active = true;

-- RLS
ALTER TABLE public.generated_study_paths ENABLE ROW LEVEL SECURITY;

-- Public read for all authenticated users
CREATE POLICY "Anyone can read active paths"
  ON public.generated_study_paths FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Generation log table
CREATE TABLE public.study_path_generation_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generation_date DATE NOT NULL,
  paths_generated INTEGER NOT NULL DEFAULT 0,
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.study_path_generation_log ENABLE ROW LEVEL SECURITY;
