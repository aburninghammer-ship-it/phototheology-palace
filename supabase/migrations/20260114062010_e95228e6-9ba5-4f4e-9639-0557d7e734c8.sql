
-- =====================================================
-- PHOTOTHEOLOGY STUDY BUDDY: MASTER SCHEMA MIGRATION
-- Implements cognitive reasoning architecture for Jeeves
-- =====================================================

-- 1. CREATE ENUMS
-- =====================================================

-- Spark status lifecycle
CREATE TYPE spark_status AS ENUM ('draft', 'saved', 'promoted', 'archived');

-- Jeeves operating modes
CREATE TYPE jeeves_mode AS ENUM ('explorer', 'auditor', 'architect');

-- Interpretive lens
CREATE TYPE interpretive_lens AS ENUM ('sda', 'neutral_historical', 'comparative');

-- Spark kind (what type of reasoning object)
CREATE TYPE spark_kind AS ENUM ('hypothesis', 'pattern', 'parallel', 'warning', 'application', 'question');

-- Confidence level (epistemic certainty)
CREATE TYPE confidence_level AS ENUM ('speculative', 'tentative', 'moderate', 'strong');

-- Verification state (evidence quality)
CREATE TYPE verification_state AS ENUM ('unverified', 'textually_supported', 'historically_supported', 'logic_checked', 'counterpoints_added', 'validated');

-- Source type
CREATE TYPE source_type AS ENUM ('scripture', 'sop', 'historical_primary', 'historical_secondary', 'theology_reference', 'dictionary_encyclopedia', 'user_note', 'web_article', 'video_transcript');

-- Source credibility tier
CREATE TYPE credibility_tier AS ENUM ('A', 'B', 'C', 'D');

-- Source stance
CREATE TYPE source_stance AS ENUM ('supports_sda_standard', 'neutral', 'critiques_sda_standard', 'mixed');

-- Rights flag for sources
CREATE TYPE rights_flag AS ENUM ('ok_store_fulltext', 'store_excerpt_only', 'reference_only');

-- Source role in spark
CREATE TYPE source_role AS ENUM ('supports', 'context', 'counter', 'method');

-- Claim ladder status
CREATE TYPE claim_ladder_status AS ENUM ('draft', 'saved', 'validated');

-- Spark-ladder relationship
CREATE TYPE spark_ladder_relationship AS ENUM ('originated_from', 'expanded_into');

-- 2. ALTER SPARKS TABLE - Add new columns
-- =====================================================

-- Add new columns to existing sparks table
ALTER TABLE public.sparks 
  ADD COLUMN IF NOT EXISTS session_id UUID,
  ADD COLUMN IF NOT EXISTS status spark_status DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS mode jeeves_mode DEFAULT 'explorer',
  ADD COLUMN IF NOT EXISTS lens interpretive_lens DEFAULT 'sda',
  ADD COLUMN IF NOT EXISTS kind spark_kind,
  ADD COLUMN IF NOT EXISTS summary TEXT,
  ADD COLUMN IF NOT EXISTS claim_text TEXT,
  ADD COLUMN IF NOT EXISTS confidence_lvl confidence_level DEFAULT 'tentative',
  ADD COLUMN IF NOT EXISTS confidence_notes TEXT,
  ADD COLUMN IF NOT EXISTS verification verification_state DEFAULT 'unverified',
  ADD COLUMN IF NOT EXISTS needs JSONB DEFAULT '{"needs_text": true, "needs_history": false, "needs_counterpoint": false}'::jsonb,
  ADD COLUMN IF NOT EXISTS assumptions JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS counterpoints JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS next_actions JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS anchors JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Create index for session lookups
CREATE INDEX IF NOT EXISTS idx_sparks_session_id ON public.sparks(session_id);
CREATE INDEX IF NOT EXISTS idx_sparks_status ON public.sparks(status);
CREATE INDEX IF NOT EXISTS idx_sparks_mode ON public.sparks(mode);
CREATE INDEX IF NOT EXISTS idx_sparks_kind ON public.sparks(kind);

-- 3. CREATE SOURCES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Source Identity
  source_type source_type NOT NULL,
  title TEXT NOT NULL,
  author TEXT,
  publisher TEXT,
  publication_year INTEGER,
  url TEXT,
  accessed_at TIMESTAMPTZ,
  
  -- Scripture fields
  bible_translation TEXT,
  scripture_ref TEXT,
  scripture_text TEXT,
  
  -- SOP fields
  sop_work TEXT,
  sop_ref TEXT,
  quote_text TEXT,
  
  -- Evidence quality
  credibility credibility_tier DEFAULT 'B',
  stance source_stance DEFAULT 'neutral',
  summary TEXT,
  keywords TEXT[] DEFAULT '{}',
  
  -- Rights/licensing
  rights rights_flag DEFAULT 'reference_only',
  max_excerpt_chars INTEGER DEFAULT 600,
  
  -- Ownership
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  library_id UUID,
  
  -- Constraints
  CONSTRAINT scripture_requires_ref CHECK (
    source_type != 'scripture' OR scripture_ref IS NOT NULL
  ),
  CONSTRAINT web_requires_url CHECK (
    source_type != 'web_article' OR url IS NOT NULL
  )
);

-- Indexes for sources
CREATE INDEX IF NOT EXISTS idx_sources_type ON public.sources(source_type);
CREATE INDEX IF NOT EXISTS idx_sources_user ON public.sources(user_id);
CREATE INDEX IF NOT EXISTS idx_sources_scripture_ref ON public.sources(scripture_ref) WHERE scripture_ref IS NOT NULL;

-- Enable RLS
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sources
CREATE POLICY "Users can view their own sources"
  ON public.sources FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create sources"
  ON public.sources FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own sources"
  ON public.sources FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sources"
  ON public.sources FOR DELETE
  USING (auth.uid() = user_id);

-- 4. CREATE SPARK_SOURCES JOIN TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.spark_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spark_id UUID NOT NULL REFERENCES public.sparks(id) ON DELETE CASCADE,
  source_id UUID NOT NULL REFERENCES public.sources(id) ON DELETE CASCADE,
  role source_role DEFAULT 'supports',
  relevance SMALLINT DEFAULT 50 CHECK (relevance >= 0 AND relevance <= 100),
  excerpt TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(spark_id, source_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_spark_sources_spark ON public.spark_sources(spark_id);
CREATE INDEX IF NOT EXISTS idx_spark_sources_source ON public.spark_sources(source_id);

-- Enable RLS
ALTER TABLE public.spark_sources ENABLE ROW LEVEL SECURITY;

-- RLS via spark ownership
CREATE POLICY "Users can manage spark_sources via spark ownership"
  ON public.spark_sources FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.sparks 
      WHERE sparks.id = spark_sources.spark_id 
      AND sparks.user_id = auth.uid()
    )
  );

-- 5. CREATE SPARK_ROOMS JOIN TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.spark_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spark_id UUID NOT NULL REFERENCES public.sparks(id) ON DELETE CASCADE,
  room_code TEXT NOT NULL,
  trigger_reason TEXT,
  cognitive_move TEXT,
  suggested_next_step TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(spark_id, room_code)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_spark_rooms_spark ON public.spark_rooms(spark_id);
CREATE INDEX IF NOT EXISTS idx_spark_rooms_code ON public.spark_rooms(room_code);

-- Enable RLS
ALTER TABLE public.spark_rooms ENABLE ROW LEVEL SECURITY;

-- RLS via spark ownership
CREATE POLICY "Users can manage spark_rooms via spark ownership"
  ON public.spark_rooms FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.sparks 
      WHERE sparks.id = spark_rooms.spark_id 
      AND sparks.user_id = auth.uid()
    )
  );

-- 6. CREATE CLAIM_LADDERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.claim_ladders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Claim structure
  claim TEXT NOT NULL,
  textual_basis JSONB DEFAULT '[]'::jsonb,
  historical_anchor JSONB,
  logical_move TEXT,
  theological_implication TEXT,
  risk_counterpoint JSONB DEFAULT '[]'::jsonb,
  validation_notes TEXT,
  
  -- Status
  status claim_ladder_status DEFAULT 'draft'
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_claim_ladders_user ON public.claim_ladders(user_id);
CREATE INDEX IF NOT EXISTS idx_claim_ladders_status ON public.claim_ladders(status);

-- Enable RLS
ALTER TABLE public.claim_ladders ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own claim ladders"
  ON public.claim_ladders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create claim ladders"
  ON public.claim_ladders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own claim ladders"
  ON public.claim_ladders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own claim ladders"
  ON public.claim_ladders FOR DELETE
  USING (auth.uid() = user_id);

-- 7. CREATE SPARK_CLAIM_LADDERS JOIN TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.spark_claim_ladders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spark_id UUID NOT NULL REFERENCES public.sparks(id) ON DELETE CASCADE,
  claim_ladder_id UUID NOT NULL REFERENCES public.claim_ladders(id) ON DELETE CASCADE,
  relationship spark_ladder_relationship DEFAULT 'originated_from',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(spark_id, claim_ladder_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_spark_claim_ladders_spark ON public.spark_claim_ladders(spark_id);
CREATE INDEX IF NOT EXISTS idx_spark_claim_ladders_ladder ON public.spark_claim_ladders(claim_ladder_id);

-- Enable RLS
ALTER TABLE public.spark_claim_ladders ENABLE ROW LEVEL SECURITY;

-- RLS via spark ownership
CREATE POLICY "Users can manage spark_claim_ladders via spark ownership"
  ON public.spark_claim_ladders FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.sparks 
      WHERE sparks.id = spark_claim_ladders.spark_id 
      AND sparks.user_id = auth.uid()
    )
  );

-- 8. CREATE SOURCE_EXCERPTS TABLE (optional but useful)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.source_excerpts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES public.sources(id) ON DELETE CASCADE,
  excerpt TEXT NOT NULL,
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  added_by UUID REFERENCES auth.users(id),
  rights_checked BOOLEAN DEFAULT false
);

-- Index
CREATE INDEX IF NOT EXISTS idx_source_excerpts_source ON public.source_excerpts(source_id);

-- Enable RLS
ALTER TABLE public.source_excerpts ENABLE ROW LEVEL SECURITY;

-- RLS via source ownership
CREATE POLICY "Users can manage excerpts via source ownership"
  ON public.source_excerpts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.sources 
      WHERE sources.id = source_excerpts.source_id 
      AND (sources.user_id = auth.uid() OR sources.user_id IS NULL)
    )
  );

-- 9. CREATE VALIDATION TRIGGER FOR STRONG CONFIDENCE
-- =====================================================

CREATE OR REPLACE FUNCTION validate_strong_confidence()
RETURNS TRIGGER AS $$
BEGIN
  -- Rule 1: "Strong" cannot exist without evidence
  IF NEW.confidence_lvl = 'strong' THEN
    -- Check if at least one supporting source exists
    IF NOT EXISTS (
      SELECT 1 FROM public.spark_sources 
      WHERE spark_id = NEW.id AND role = 'supports'
    ) THEN
      RAISE EXCEPTION 'Strong confidence requires at least one supporting source';
    END IF;
    
    -- Check verification state
    IF NEW.verification = 'unverified' THEN
      RAISE EXCEPTION 'Strong confidence requires verification state beyond unverified';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Note: We'll create the trigger after initial data migration to avoid conflicts
-- CREATE TRIGGER enforce_strong_confidence
--   BEFORE UPDATE ON public.sparks
--   FOR EACH ROW
--   WHEN (NEW.confidence_lvl = 'strong')
--   EXECUTE FUNCTION validate_strong_confidence();

-- 10. UPDATE TIMESTAMP TRIGGER
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sparks_updated_at
  BEFORE UPDATE ON public.sparks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sources_updated_at
  BEFORE UPDATE ON public.sources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_claim_ladders_updated_at
  BEFORE UPDATE ON public.claim_ladders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
