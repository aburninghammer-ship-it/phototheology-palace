-- Sermon Writer Tables Migration
-- Creates tables for the new Sermon Writer feature with Jeeves modes,
-- Spark integration, Outline Builder, Polish Engine, and Versioning

-- =====================================================
-- TABLE 1: sermon_writer_sessions
-- Main session table for sermon writing
-- =====================================================
CREATE TABLE IF NOT EXISTS public.sermon_writer_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Core identity
  title TEXT,
  theme TEXT NOT NULL,
  theme_passage TEXT,

  -- Outline configuration
  outline_template TEXT NOT NULL DEFAULT 'deductive'
    CHECK (outline_template IN ('deductive', 'inductive', 'narrative', 'teaching', 'devotional', 'custom')),
  outline_data JSONB NOT NULL DEFAULT '{"nodes": [], "transitions": []}'::jsonb,

  -- Content
  content TEXT DEFAULT '',

  -- Session metadata
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'in_progress', 'complete', 'archived')),
  current_version_id UUID,

  -- Jeeves mode preference
  last_jeeves_mode TEXT DEFAULT 'explorer'
    CHECK (last_jeeves_mode IN ('explorer', 'auditor', 'architect')),

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sermon_writer_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own sermon writer sessions"
  ON public.sermon_writer_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sermon writer sessions"
  ON public.sermon_writer_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sermon writer sessions"
  ON public.sermon_writer_sessions
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sermon writer sessions"
  ON public.sermon_writer_sessions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_sermon_writer_sessions_user_id ON public.sermon_writer_sessions(user_id);
CREATE INDEX idx_sermon_writer_sessions_status ON public.sermon_writer_sessions(status);
CREATE INDEX idx_sermon_writer_sessions_updated ON public.sermon_writer_sessions(updated_at DESC);


-- =====================================================
-- TABLE 2: sermon_writer_sparks
-- Sparks generated for sermon writing with claim ladders
-- =====================================================
CREATE TABLE IF NOT EXISTS public.sermon_writer_sparks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.sermon_writer_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Spark identity
  spark_type TEXT NOT NULL DEFAULT 'insight'
    CHECK (spark_type IN ('connection', 'pattern', 'application', 'claim', 'evidence', 'counterpoint', 'hypothesis', 'angle')),
  kind TEXT NOT NULL DEFAULT 'insight'
    CHECK (kind IN ('insight', 'claim', 'evidence', 'illustration', 'application', 'transition', 'question')),

  -- Core content
  title TEXT NOT NULL,
  summary TEXT NOT NULL,

  -- Extended content (JSON for flexibility)
  claim_ladder JSONB,        -- {"rungs": [{level, claim, support}]}
  evidence JSONB,            -- {"items": [{type, content, source, relevance_note}]}
  counterpoints JSONB,       -- {"points": [{objection, response, strength}]}
  pt_mapping JSONB,          -- {"rooms": ["CR", "BL"], "cycles": [], "sanctuary": []}

  -- Metadata
  confidence NUMERIC(3,2) DEFAULT 0.7
    CHECK (confidence >= 0 AND confidence <= 1),
  novelty_score NUMERIC(3,2) DEFAULT 0.5
    CHECK (novelty_score >= 0 AND novelty_score <= 1),
  source TEXT NOT NULL DEFAULT 'explorer'
    CHECK (source IN ('explorer', 'auditor', 'architect', 'manual')),

  -- Outline integration
  outline_node_id TEXT,      -- Which outline node this spark is mapped to

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'archived', 'inserted', 'favorite')),
  inserted_at TIMESTAMPTZ,
  saved_at TIMESTAMPTZ,
  dismissed_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sermon_writer_sparks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own sermon writer sparks"
  ON public.sermon_writer_sparks
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sermon writer sparks"
  ON public.sermon_writer_sparks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sermon writer sparks"
  ON public.sermon_writer_sparks
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sermon writer sparks"
  ON public.sermon_writer_sparks
  FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_sermon_writer_sparks_session_id ON public.sermon_writer_sparks(session_id);
CREATE INDEX idx_sermon_writer_sparks_user_id ON public.sermon_writer_sparks(user_id);
CREATE INDEX idx_sermon_writer_sparks_status ON public.sermon_writer_sparks(status);
CREATE INDEX idx_sermon_writer_sparks_confidence ON public.sermon_writer_sparks(confidence);
CREATE INDEX idx_sermon_writer_sparks_kind ON public.sermon_writer_sparks(kind);
CREATE INDEX idx_sermon_writer_sparks_source ON public.sermon_writer_sparks(source);
CREATE INDEX idx_sermon_writer_sparks_outline_node ON public.sermon_writer_sparks(outline_node_id);


-- =====================================================
-- TABLE 3: sermon_writer_versions
-- Version history for sermon writing sessions
-- =====================================================
CREATE TABLE IF NOT EXISTS public.sermon_writer_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.sermon_writer_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Version metadata
  version_number INTEGER NOT NULL,
  version_name TEXT,
  parent_version_id UUID REFERENCES public.sermon_writer_versions(id),

  -- Snapshot data
  outline_snapshot JSONB NOT NULL,
  sparks_snapshot JSONB NOT NULL DEFAULT '[]'::jsonb,
  content_snapshot TEXT,

  -- What changed
  change_type TEXT NOT NULL
    CHECK (change_type IN ('spark_edit', 'claim_ladder', 'outline_revision', 'polish_pass', 'manual_save', 'auto_save')),
  change_description TEXT,

  -- Source of change
  changed_by TEXT DEFAULT 'user'
    CHECK (changed_by IN ('user', 'jeeves', 'polish', 'auto')),

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Unique version per session
  UNIQUE(session_id, version_number)
);

-- Enable RLS
ALTER TABLE public.sermon_writer_versions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own sermon writer versions"
  ON public.sermon_writer_versions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sermon writer versions"
  ON public.sermon_writer_versions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sermon writer versions"
  ON public.sermon_writer_versions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_sermon_writer_versions_session_id ON public.sermon_writer_versions(session_id);
CREATE INDEX idx_sermon_writer_versions_parent ON public.sermon_writer_versions(parent_version_id);
CREATE INDEX idx_sermon_writer_versions_created ON public.sermon_writer_versions(created_at DESC);


-- =====================================================
-- TABLE 4: sermon_writer_polish_snapshots
-- Snapshots for polish operations with validation
-- =====================================================
CREATE TABLE IF NOT EXISTS public.sermon_writer_polish_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.sermon_writer_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  version_id UUID REFERENCES public.sermon_writer_versions(id),

  -- Snapshot before polish
  content_before TEXT NOT NULL,
  outline_before JSONB NOT NULL,

  -- Polish operation details
  polish_mode TEXT NOT NULL
    CHECK (polish_mode IN ('logical_flow', 'scripture_integration', 'cognitive_load', 'application', 'persuasive')),

  -- Target (what was polished)
  target_type TEXT DEFAULT 'full'
    CHECK (target_type IN ('full', 'section', 'paragraph', 'spark')),
  target_id TEXT,

  -- Validation results
  validation JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Content after polish
  content_after TEXT,
  outline_after JSONB,

  -- AI response details
  ai_explanation TEXT,
  diff_summary TEXT,

  -- Status
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'applied', 'rolled_back', 'rejected')),

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  applied_at TIMESTAMPTZ,
  rolled_back_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.sermon_writer_polish_snapshots ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own polish snapshots"
  ON public.sermon_writer_polish_snapshots
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own polish snapshots"
  ON public.sermon_writer_polish_snapshots
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own polish snapshots"
  ON public.sermon_writer_polish_snapshots
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own polish snapshots"
  ON public.sermon_writer_polish_snapshots
  FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_sermon_writer_polish_session_id ON public.sermon_writer_polish_snapshots(session_id);
CREATE INDEX idx_sermon_writer_polish_status ON public.sermon_writer_polish_snapshots(status);
CREATE INDEX idx_sermon_writer_polish_mode ON public.sermon_writer_polish_snapshots(polish_mode);


-- =====================================================
-- Add foreign key for current_version_id after versions table exists
-- =====================================================
ALTER TABLE public.sermon_writer_sessions
  ADD CONSTRAINT fk_current_version
  FOREIGN KEY (current_version_id)
  REFERENCES public.sermon_writer_versions(id)
  ON DELETE SET NULL;


-- =====================================================
-- Function to update updated_at timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_sermon_writer_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_sermon_writer_sessions_updated_at
  BEFORE UPDATE ON public.sermon_writer_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_sermon_writer_updated_at();

CREATE TRIGGER update_sermon_writer_sparks_updated_at
  BEFORE UPDATE ON public.sermon_writer_sparks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_sermon_writer_updated_at();