-- ═══════════════════════════════════════════════════════════════════════════
-- PROPHECY WATCH SIGNALS TABLE
-- Stores structured data from Prophecy Watch Mode analyses
-- ═══════════════════════════════════════════════════════════════════════════

-- Create enum for signal types
CREATE TYPE prophecy_signal_type AS ENUM (
  'CHURCH_STATE',
  'CHRISTIAN_NATIONALISM',
  'SEVEN_MOUNTAINS',
  'NAR_NETWORKS',
  'GREAT_REPLACEMENT',
  'ANTI_DEI_PIPELINE',
  'MORAL_RESTORATION_LAWS',
  'SABBATH_SUNDAY_TRAJECTORY',
  'DECEPTION_PROPAGANDA',
  'ECONOMIC_COERCION',
  'RELIGIOUS_LIBERTY_WEAPONIZED',
  'OTHER'
);

-- Create enum for confidence levels
CREATE TYPE prophecy_confidence_level AS ENUM (
  'low',
  'medium',
  'high'
);

-- Create enum for status
CREATE TYPE prophecy_signal_status AS ENUM (
  'draft',
  'published',
  'archived'
);

-- Create enum for actor types
CREATE TYPE prophecy_actor_type AS ENUM (
  'person',
  'organization',
  'government_body',
  'media_outlet',
  'movement'
);

-- Create enum for source types
CREATE TYPE prophecy_source_type AS ENUM (
  'primary',
  'reputable_news',
  'academic',
  'official_statement',
  'other'
);

-- Main prophecy watch signals table
CREATE TABLE IF NOT EXISTS prophecy_watch_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),

  -- Core identification
  title TEXT NOT NULL CHECK (char_length(title) >= 5 AND char_length(title) <= 160),
  status prophecy_signal_status DEFAULT 'draft',

  -- Facts summary (array of bullet points)
  summary_facts TEXT[] NOT NULL CHECK (array_length(summary_facts, 1) >= 3),

  -- Event window
  event_start_date DATE NOT NULL,
  event_end_date DATE NOT NULL,

  -- Geographic scope
  regions TEXT[] NOT NULL CHECK (array_length(regions, 1) >= 1),

  -- Signal classification
  signal_types prophecy_signal_type[] NOT NULL CHECK (array_length(signal_types, 1) >= 1),

  -- Scoring
  intensity_score INTEGER NOT NULL CHECK (intensity_score >= 0 AND intensity_score <= 5),
  confidence_level prophecy_confidence_level NOT NULL,
  confidence_rationale TEXT CHECK (char_length(confidence_rationale) <= 1200),

  -- Counter-read
  alternative_explanation TEXT NOT NULL CHECK (char_length(alternative_explanation) >= 30),
  falsifiers TEXT[] NOT NULL CHECK (array_length(falsifiers, 1) >= 1),

  -- Mission implications
  mission_so_what TEXT[] NOT NULL CHECK (array_length(mission_so_what, 1) >= 3),

  -- Method documentation
  search_terms TEXT[] NOT NULL CHECK (array_length(search_terms, 1) >= 2),
  source_policy TEXT DEFAULT 'tiered_sources_primary_first',
  method_notes TEXT,

  -- Full analysis content (raw markdown from Jeeves)
  full_analysis TEXT,

  -- Search/filter optimization
  CONSTRAINT valid_event_window CHECK (event_end_date >= event_start_date)
);

-- Actors involved in signals (separate table for many-to-many)
CREATE TABLE IF NOT EXISTS prophecy_signal_actors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id UUID REFERENCES prophecy_watch_signals(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (char_length(name) >= 2 AND char_length(name) <= 120),
  actor_type prophecy_actor_type NOT NULL,
  role TEXT CHECK (char_length(role) <= 160),
  affiliation TEXT CHECK (char_length(affiliation) <= 160),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Prophetic anchors (Scripture references with notes)
CREATE TABLE IF NOT EXISTS prophecy_signal_anchors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id UUID REFERENCES prophecy_watch_signals(id) ON DELETE CASCADE,
  book TEXT NOT NULL CHECK (book IN ('Daniel', 'Revelation', 'Other')),
  scripture_references TEXT[] NOT NULL CHECK (array_length(scripture_references, 1) >= 1),
  note TEXT NOT NULL CHECK (char_length(note) >= 10 AND char_length(note) <= 500),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Evidence pack items
CREATE TABLE IF NOT EXISTS prophecy_signal_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id UUID REFERENCES prophecy_watch_signals(id) ON DELETE CASCADE,
  source_type prophecy_source_type NOT NULL,
  publisher TEXT NOT NULL CHECK (char_length(publisher) >= 2 AND char_length(publisher) <= 120),
  title TEXT NOT NULL CHECK (char_length(title) >= 5 AND char_length(title) <= 220),
  author TEXT CHECK (char_length(author) <= 120),
  url TEXT,
  published_at TIMESTAMPTZ,
  accessed_at TIMESTAMPTZ DEFAULT now(),
  excerpt TEXT CHECK (char_length(excerpt) <= 350),
  video_timestamp TEXT CHECK (video_timestamp ~ '^([0-9]{1,2}:)?[0-9]{1,2}:[0-9]{2}$'),
  claim_supported TEXT NOT NULL CHECK (char_length(claim_supported) >= 10 AND char_length(claim_supported) <= 280),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Relevance map entries (per-signal thread analysis)
CREATE TABLE IF NOT EXISTS prophecy_signal_relevance_map (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id UUID REFERENCES prophecy_watch_signals(id) ON DELETE CASCADE,
  signal_type prophecy_signal_type NOT NULL,
  mechanism TEXT NOT NULL CHECK (char_length(mechanism) >= 20 AND char_length(mechanism) <= 700),
  anchors TEXT[] NOT NULL CHECK (array_length(anchors, 1) >= 1),
  confidence_level prophecy_confidence_level NOT NULL,
  notes TEXT CHECK (char_length(notes) <= 700),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX idx_prophecy_signals_created_at ON prophecy_watch_signals(created_at DESC);
CREATE INDEX idx_prophecy_signals_intensity ON prophecy_watch_signals(intensity_score DESC);
CREATE INDEX idx_prophecy_signals_status ON prophecy_watch_signals(status);
CREATE INDEX idx_prophecy_signals_signal_types ON prophecy_watch_signals USING GIN(signal_types);
CREATE INDEX idx_prophecy_signals_regions ON prophecy_watch_signals USING GIN(regions);
CREATE INDEX idx_prophecy_signal_actors_signal ON prophecy_signal_actors(signal_id);
CREATE INDEX idx_prophecy_signal_anchors_signal ON prophecy_signal_anchors(signal_id);
CREATE INDEX idx_prophecy_signal_evidence_signal ON prophecy_signal_evidence(signal_id);
CREATE INDEX idx_prophecy_signal_relevance_signal ON prophecy_signal_relevance_map(signal_id);

-- Enable RLS
ALTER TABLE prophecy_watch_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE prophecy_signal_actors ENABLE ROW LEVEL SECURITY;
ALTER TABLE prophecy_signal_anchors ENABLE ROW LEVEL SECURITY;
ALTER TABLE prophecy_signal_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE prophecy_signal_relevance_map ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Anyone can read published signals, only creator can edit
CREATE POLICY "Published signals are viewable by everyone"
  ON prophecy_watch_signals FOR SELECT
  USING (status = 'published' OR auth.uid() = created_by);

CREATE POLICY "Users can create their own signals"
  ON prophecy_watch_signals FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own signals"
  ON prophecy_watch_signals FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own signals"
  ON prophecy_watch_signals FOR DELETE
  USING (auth.uid() = created_by);

-- Policies for related tables (cascade from parent signal permissions)
CREATE POLICY "Actors visible with parent signal"
  ON prophecy_signal_actors FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM prophecy_watch_signals
    WHERE id = signal_id AND (status = 'published' OR auth.uid() = created_by)
  ));

CREATE POLICY "Actors editable by signal creator"
  ON prophecy_signal_actors FOR ALL
  USING (EXISTS (
    SELECT 1 FROM prophecy_watch_signals
    WHERE id = signal_id AND auth.uid() = created_by
  ));

CREATE POLICY "Anchors visible with parent signal"
  ON prophecy_signal_anchors FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM prophecy_watch_signals
    WHERE id = signal_id AND (status = 'published' OR auth.uid() = created_by)
  ));

CREATE POLICY "Anchors editable by signal creator"
  ON prophecy_signal_anchors FOR ALL
  USING (EXISTS (
    SELECT 1 FROM prophecy_watch_signals
    WHERE id = signal_id AND auth.uid() = created_by
  ));

CREATE POLICY "Evidence visible with parent signal"
  ON prophecy_signal_evidence FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM prophecy_watch_signals
    WHERE id = signal_id AND (status = 'published' OR auth.uid() = created_by)
  ));

CREATE POLICY "Evidence editable by signal creator"
  ON prophecy_signal_evidence FOR ALL
  USING (EXISTS (
    SELECT 1 FROM prophecy_watch_signals
    WHERE id = signal_id AND auth.uid() = created_by
  ));

CREATE POLICY "Relevance map visible with parent signal"
  ON prophecy_signal_relevance_map FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM prophecy_watch_signals
    WHERE id = signal_id AND (status = 'published' OR auth.uid() = created_by)
  ));

CREATE POLICY "Relevance map editable by signal creator"
  ON prophecy_signal_relevance_map FOR ALL
  USING (EXISTS (
    SELECT 1 FROM prophecy_watch_signals
    WHERE id = signal_id AND auth.uid() = created_by
  ));

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_prophecy_signal_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prophecy_signal_updated_at
  BEFORE UPDATE ON prophecy_watch_signals
  FOR EACH ROW
  EXECUTE FUNCTION update_prophecy_signal_updated_at();
