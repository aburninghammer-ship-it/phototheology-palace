-- ============================================================================
-- SERMON DEEP DIVE - Living Manna Church Space
-- A comprehensive sermon study system with doctrinal safeguards
-- ============================================================================

-- Approved sermon sources (Living Manna only)
CREATE TABLE IF NOT EXISTS public.approved_sermon_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type TEXT NOT NULL CHECK (source_type IN ('youtube_channel', 'youtube_playlist', 'manual')),
  source_id TEXT NOT NULL, -- YouTube channel ID or playlist ID
  source_name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(source_type, source_id)
);

-- Insert approved Living Manna sources
INSERT INTO public.approved_sermon_sources (source_type, source_id, source_name, description) VALUES
  ('youtube_channel', 'UCPhototheology', 'Phototheology Official', 'Pastor Ivor Myers official channel'),
  ('youtube_channel', 'UCLivingManna', 'Living Manna Church', 'Living Manna Church official channel'),
  ('manual', 'pastor_upload', 'Pastor Direct Upload', 'Sermons uploaded directly by Pastor')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SERMONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.lm_sermons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Source information
  source_type TEXT NOT NULL CHECK (source_type IN ('youtube', 'audio_upload', 'video_upload', 'transcript_paste')),
  source_url TEXT, -- YouTube URL or file storage path
  source_id TEXT, -- YouTube video ID

  -- Metadata
  title TEXT NOT NULL,
  speaker TEXT NOT NULL DEFAULT 'Pastor Ivor Myers',
  sermon_date DATE,
  duration_seconds INTEGER,
  thumbnail_url TEXT,

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending',           -- Just submitted
    'fetching_transcript', -- Getting transcript
    'transcript_ready',  -- Has transcript, ready for analysis
    'analyzing',         -- AI analysis in progress
    'review_required',   -- Flagged for pastoral review
    'approved',          -- Analysis approved
    'published'          -- Visible to all members
  )),

  -- Ownership & visibility
  submitted_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'group', 'church', 'public')),

  -- Doctrinal review
  doctrinal_flags JSONB DEFAULT '[]'::jsonb, -- Array of {flag, reason, segment_id}
  review_notes TEXT,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_lm_sermons_status ON public.lm_sermons(status);
CREATE INDEX idx_lm_sermons_speaker ON public.lm_sermons(speaker);
CREATE INDEX idx_lm_sermons_date ON public.lm_sermons(sermon_date DESC);

-- ============================================================================
-- TRANSCRIPTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.lm_sermon_transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sermon_id UUID NOT NULL REFERENCES public.lm_sermons(id) ON DELETE CASCADE,

  -- Transcript versions
  raw_text TEXT NOT NULL,
  cleaned_text TEXT, -- After preprocessing

  -- Source info
  transcript_source TEXT NOT NULL CHECK (transcript_source IN (
    'youtube_auto',      -- YouTube's auto-generated
    'youtube_manual',    -- YouTube manually uploaded captions
    'whisper_transcribed', -- Our Whisper transcription
    'user_pasted'        -- User pasted directly
  )),

  -- Quality indicators
  confidence_score DECIMAL(3,2), -- 0.00 to 1.00
  word_count INTEGER,
  has_timestamps BOOLEAN DEFAULT false,

  -- Versioning
  version INTEGER NOT NULL DEFAULT 1,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  UNIQUE(sermon_id, version)
);

-- ============================================================================
-- SEGMENTS TABLE (The key to auditability)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.lm_sermon_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sermon_id UUID NOT NULL REFERENCES public.lm_sermons(id) ON DELETE CASCADE,

  -- Position
  segment_index INTEGER NOT NULL, -- Order in sermon
  start_time_seconds INTEGER, -- Nullable if no timestamps
  end_time_seconds INTEGER,

  -- Content
  segment_text TEXT NOT NULL,
  word_count INTEGER,

  -- Classification (sermon moves)
  segment_type TEXT CHECK (segment_type IN (
    'introduction',
    'scripture_reading',
    'exegesis',         -- Explaining the text
    'doctrine',         -- Theological teaching
    'illustration',     -- Story or example
    'application',      -- Practical instruction
    'appeal',           -- Call to action/decision
    'prayer',
    'transition',
    'conclusion',
    'other'
  )),

  -- AI confidence in classification
  type_confidence DECIMAL(3,2),

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  UNIQUE(sermon_id, segment_index)
);

CREATE INDEX idx_lm_segments_sermon ON public.lm_sermon_segments(sermon_id);
CREATE INDEX idx_lm_segments_type ON public.lm_sermon_segments(segment_type);

-- ============================================================================
-- SCRIPTURE REFERENCES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.lm_sermon_scriptures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sermon_id UUID NOT NULL REFERENCES public.lm_sermons(id) ON DELETE CASCADE,
  segment_id UUID REFERENCES public.lm_sermon_segments(id) ON DELETE SET NULL,

  -- Reference details
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse_start INTEGER,
  verse_end INTEGER,
  reference_text TEXT NOT NULL, -- "John 3:16" or "Genesis 1:1-3"

  -- How it was referenced
  reference_type TEXT NOT NULL CHECK (reference_type IN (
    'explicit_quote',    -- Preacher quoted the verse
    'explicit_cite',     -- Preacher cited without quoting
    'implicit_allusion', -- AI detected allusion (lower confidence)
    'thematic_connection' -- Related theme, not direct reference
  )),

  -- The actual quoted text (if quoted)
  quoted_text TEXT,

  -- Confidence & verification
  confidence DECIMAL(3,2),
  verified_by_user BOOLEAN DEFAULT false,
  user_correction TEXT, -- If user corrected the reference

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_lm_scriptures_sermon ON public.lm_sermon_scriptures(sermon_id);
CREATE INDEX idx_lm_scriptures_book ON public.lm_sermon_scriptures(book);
CREATE INDEX idx_lm_scriptures_type ON public.lm_sermon_scriptures(reference_type);

-- ============================================================================
-- INSIGHTS TABLE (Claims, Themes, Questions)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.lm_sermon_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sermon_id UUID NOT NULL REFERENCES public.lm_sermons(id) ON DELETE CASCADE,

  -- Which segments this insight comes from
  segment_ids UUID[] NOT NULL DEFAULT '{}',

  -- Insight classification
  insight_type TEXT NOT NULL CHECK (insight_type IN (
    -- Claims (the Claim Ladder)
    'text_claim',        -- What the passage means
    'doctrine_claim',    -- Theological implication
    'prophetic_claim',   -- Prophetic/eschatological implication
    'practical_claim',   -- What listener must do

    -- Themes
    'theme_major',       -- Central sermon theme
    'theme_minor',       -- Supporting theme

    -- Questions
    'question_reflection',  -- Personal reflection
    'question_study',       -- Bible study question
    'question_discussion',  -- Group discussion
    'question_decision',    -- Decision/appeal question

    -- Structure
    'sermon_beat',       -- Key point in sermon map
    'key_quote',         -- Notable quotation
    'illustration_summary'
  )),

  -- Content
  title TEXT, -- Short title for the insight
  content TEXT NOT NULL, -- The insight itself
  supporting_text TEXT, -- Verbatim quote from transcript

  -- Citations (segment references for auditability)
  citations JSONB DEFAULT '[]'::jsonb, -- [{segment_id, timestamp, quote}]

  -- Scoring
  importance_score INTEGER CHECK (importance_score BETWEEN 0 AND 100),
  confidence DECIMAL(3,2),

  -- Doctrinal assessment
  doctrinal_alignment TEXT CHECK (doctrinal_alignment IN (
    'aligned',           -- Clearly SDA-aligned
    'supported',         -- Supported by SDA teaching
    'neutral',           -- Neither confirms nor contradicts
    'caution',           -- Requires careful interpretation
    'review_needed'      -- Needs pastoral review
  )) DEFAULT 'neutral',
  doctrinal_notes TEXT,

  -- Palace mapping
  palace_rooms TEXT[] DEFAULT '{}', -- Suggested Palace rooms
  palace_mapping_reason TEXT,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_lm_insights_sermon ON public.lm_sermon_insights(sermon_id);
CREATE INDEX idx_lm_insights_type ON public.lm_sermon_insights(insight_type);
CREATE INDEX idx_lm_insights_doctrinal ON public.lm_sermon_insights(doctrinal_alignment);

-- ============================================================================
-- SERMON GEMS (User-saved insights)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.lm_sermon_gems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sermon_id UUID NOT NULL REFERENCES public.lm_sermons(id) ON DELETE CASCADE,

  -- Can be linked to an auto-generated insight or standalone
  insight_id UUID REFERENCES public.lm_sermon_insights(id) ON DELETE SET NULL,
  segment_id UUID REFERENCES public.lm_sermon_segments(id) ON DELETE SET NULL,

  -- Gem content
  gem_type TEXT NOT NULL CHECK (gem_type IN (
    'insight',
    'quote',
    'outline',
    'illustration',
    'warning',
    'appeal',
    'cross_reference',
    'personal_note',
    'study_question'
  )),

  title TEXT NOT NULL,
  content TEXT NOT NULL,

  -- Source citation
  transcript_quote TEXT, -- Verbatim from sermon
  timestamp_seconds INTEGER,

  -- Organization
  scripture_links TEXT[] DEFAULT '{}', -- ["John 3:16", "Genesis 1:1"]
  palace_room TEXT, -- Single room assignment
  tags TEXT[] DEFAULT '{}',

  -- User notes
  user_notes TEXT,

  -- Visibility
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'group', 'church')),

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_lm_gems_user ON public.lm_sermon_gems(user_id);
CREATE INDEX idx_lm_gems_sermon ON public.lm_sermon_gems(sermon_id);
CREATE INDEX idx_lm_gems_room ON public.lm_sermon_gems(palace_room);
CREATE INDEX idx_lm_gems_tags ON public.lm_sermon_gems USING GIN(tags);

-- ============================================================================
-- STUDY PACKETS (House Fire ready)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.lm_study_packets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sermon_id UUID NOT NULL REFERENCES public.lm_sermons(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id),

  -- Packet metadata
  title TEXT NOT NULL,
  description TEXT,

  -- Type and structure
  packet_type TEXT NOT NULL CHECK (packet_type IN (
    'quick_3day',        -- 3-day personal study
    'weekly_7day',       -- 7-day personal study
    'house_fire_single', -- Single session House Fire
    'house_fire_series', -- Multi-session House Fire (4 sessions)
    'youth_study',       -- Youth-friendly version
    'custom'
  )),

  -- The packet content (structured JSON)
  structure JSONB NOT NULL, -- Full packet structure

  -- Facilitator vs participant versions
  facilitator_notes JSONB, -- Additional notes for leaders

  -- Time estimates
  estimated_minutes INTEGER,

  -- Status
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'published')),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,

  -- Visibility
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'group', 'church')),

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_lm_packets_sermon ON public.lm_study_packets(sermon_id);
CREATE INDEX idx_lm_packets_type ON public.lm_study_packets(packet_type);
CREATE INDEX idx_lm_packets_status ON public.lm_study_packets(status);

-- ============================================================================
-- DOCTRINAL FRAMEWORK (SDA Guardrails)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.lm_doctrinal_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Theme identification
  theme_key TEXT NOT NULL UNIQUE, -- e.g., 'sabbath', 'sanctuary', 'state_of_dead'
  theme_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'fundamental_belief',  -- 28 Fundamental Beliefs
    'distinctive_doctrine', -- SDA distinctive teachings
    'prophetic_understanding',
    'health_message',
    'lifestyle',
    'general_christian'
  )),

  -- For AI analysis
  keywords TEXT[] DEFAULT '{}', -- Words that suggest this theme
  scripture_anchors TEXT[] DEFAULT '{}', -- Key verses for this theme

  -- Palace mapping
  primary_palace_rooms TEXT[] DEFAULT '{}',

  description TEXT,
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert core SDA doctrinal themes
INSERT INTO public.lm_doctrinal_themes (theme_key, theme_name, category, keywords, scripture_anchors, primary_palace_rooms) VALUES
  ('sabbath', 'Sabbath', 'fundamental_belief',
   ARRAY['sabbath', 'seventh day', 'saturday', 'day of rest', 'fourth commandment', 'creation rest'],
   ARRAY['Genesis 2:1-3', 'Exodus 20:8-11', 'Isaiah 58:13-14', 'Mark 2:27-28'],
   ARRAY['Sanctuary', 'Prophecy', 'Christ-Centered']),

  ('sanctuary', 'Sanctuary/Heavenly Ministry', 'fundamental_belief',
   ARRAY['sanctuary', 'heavenly temple', 'most holy place', 'day of atonement', 'high priest', 'mediator', 'intercession'],
   ARRAY['Hebrews 8:1-2', 'Hebrews 9:11-12', 'Daniel 8:14', 'Leviticus 16'],
   ARRAY['Sanctuary', 'Typology', 'Prophecy']),

  ('second_coming', 'Second Coming', 'fundamental_belief',
   ARRAY['second coming', 'return of christ', 'advent', 'coming in clouds', 'rapture', 'parousia'],
   ARRAY['Matthew 24:30-31', 'Acts 1:11', '1 Thessalonians 4:16-17', 'Revelation 1:7'],
   ARRAY['Prophecy', 'Christ-Centered']),

  ('state_of_dead', 'State of the Dead', 'distinctive_doctrine',
   ARRAY['death', 'sleep', 'soul sleep', 'resurrection', 'immortality', 'spirit returns'],
   ARRAY['Ecclesiastes 9:5-6', 'John 11:11-14', '1 Thessalonians 4:13-18', 'Job 14:12'],
   ARRAY['Doctrine', 'Prophecy']),

  ('three_angels', 'Three Angels Messages', 'prophetic_understanding',
   ARRAY['three angels', 'first angel', 'second angel', 'third angel', 'babylon', 'mark of beast', 'fear god'],
   ARRAY['Revelation 14:6-12'],
   ARRAY['Prophecy', 'Sanctuary']),

  ('remnant', 'Remnant Church', 'distinctive_doctrine',
   ARRAY['remnant', 'commandments of god', 'testimony of jesus', 'spirit of prophecy', 'last day church'],
   ARRAY['Revelation 12:17', 'Revelation 19:10'],
   ARRAY['Prophecy', 'Story']),

  ('great_controversy', 'Great Controversy', 'fundamental_belief',
   ARRAY['great controversy', 'cosmic conflict', 'lucifer', 'war in heaven', 'sin origin', 'vindication'],
   ARRAY['Isaiah 14:12-14', 'Ezekiel 28:12-17', 'Revelation 12:7-9'],
   ARRAY['Story', 'Prophecy', 'Christ-Centered']),

  ('investigative_judgment', 'Investigative Judgment', 'prophetic_understanding',
   ARRAY['investigative judgment', 'pre-advent judgment', '1844', 'cleansing of sanctuary', 'books opened'],
   ARRAY['Daniel 7:9-10', 'Daniel 8:14', 'Revelation 14:7'],
   ARRAY['Prophecy', 'Sanctuary', 'Typology']),

  ('health_message', 'Health Message', 'health_message',
   ARRAY['health', 'body temple', 'clean unclean', 'temperance', 'diet', 'lifestyle'],
   ARRAY['1 Corinthians 6:19-20', 'Daniel 1:8', 'Leviticus 11'],
   ARRAY['Doctrine', 'Practical']),

  ('spirit_prophecy', 'Spirit of Prophecy', 'distinctive_doctrine',
   ARRAY['ellen white', 'spirit of prophecy', 'prophetic gift', 'testimonies', 'messenger'],
   ARRAY['Revelation 12:17', 'Revelation 19:10', '1 Corinthians 12:28'],
   ARRAY['Prophecy', 'Story']),

  ('justification', 'Justification by Faith', 'fundamental_belief',
   ARRAY['justification', 'righteousness by faith', 'grace', 'imputed righteousness', 'faith alone'],
   ARRAY['Romans 3:23-24', 'Ephesians 2:8-9', 'Galatians 2:16'],
   ARRAY['Christ-Centered', 'Doctrine']),

  ('sanctification', 'Sanctification', 'fundamental_belief',
   ARRAY['sanctification', 'holy living', 'character development', 'perfection', 'overcoming'],
   ARRAY['1 Thessalonians 4:3', 'Hebrews 12:14', '2 Peter 3:18'],
   ARRAY['Christ-Centered', 'Practical']),

  ('law_grace', 'Law and Grace', 'fundamental_belief',
   ARRAY['law', 'grace', 'ten commandments', 'moral law', 'obedience', 'legalism', 'antinomianism'],
   ARRAY['Romans 6:14-15', 'James 2:10-12', 'Matthew 5:17-19'],
   ARRAY['Doctrine', 'Christ-Centered']),

  ('baptism', 'Baptism', 'fundamental_belief',
   ARRAY['baptism', 'immersion', 'buried with christ', 'new life'],
   ARRAY['Romans 6:3-4', 'Matthew 28:19', 'Acts 2:38'],
   ARRAY['Doctrine', 'Typology']),

  ('creation', 'Creation', 'fundamental_belief',
   ARRAY['creation', 'six days', 'genesis', 'creator', 'design'],
   ARRAY['Genesis 1-2', 'Exodus 20:11', 'Psalm 33:6'],
   ARRAY['Story', 'Doctrine'])
ON CONFLICT (theme_key) DO NOTHING;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.lm_sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lm_sermon_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lm_sermon_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lm_sermon_scriptures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lm_sermon_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lm_sermon_gems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lm_study_packets ENABLE ROW LEVEL SECURITY;

-- Sermons: Published visible to all authenticated, others to owner/admin
CREATE POLICY "Users can view published sermons"
  ON public.lm_sermons FOR SELECT
  USING (
    visibility = 'public' OR
    visibility = 'church' OR
    submitted_by = auth.uid() OR
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Authenticated users can submit sermons"
  ON public.lm_sermons FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Owners and admins can update sermons"
  ON public.lm_sermons FOR UPDATE
  USING (
    submitted_by = auth.uid() OR
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Transcripts: Same as parent sermon
CREATE POLICY "Users can view transcripts of accessible sermons"
  ON public.lm_sermon_transcripts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.lm_sermons s
      WHERE s.id = sermon_id AND (
        s.visibility IN ('public', 'church') OR
        s.submitted_by = auth.uid() OR
        EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
      )
    )
  );

-- Segments, Scriptures, Insights: Same pattern
CREATE POLICY "Users can view segments of accessible sermons"
  ON public.lm_sermon_segments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.lm_sermons s
      WHERE s.id = sermon_id AND (
        s.visibility IN ('public', 'church') OR
        s.submitted_by = auth.uid() OR
        EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
      )
    )
  );

CREATE POLICY "Users can view scriptures of accessible sermons"
  ON public.lm_sermon_scriptures FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.lm_sermons s
      WHERE s.id = sermon_id AND (
        s.visibility IN ('public', 'church') OR
        s.submitted_by = auth.uid() OR
        EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
      )
    )
  );

CREATE POLICY "Users can view insights of accessible sermons"
  ON public.lm_sermon_insights FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.lm_sermons s
      WHERE s.id = sermon_id AND (
        s.visibility IN ('public', 'church') OR
        s.submitted_by = auth.uid() OR
        EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
      )
    )
  );

-- Gems: Users see their own + church-visible
CREATE POLICY "Users can view their own gems"
  ON public.lm_sermon_gems FOR SELECT
  USING (user_id = auth.uid() OR visibility = 'church');

CREATE POLICY "Users can create their own gems"
  ON public.lm_sermon_gems FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own gems"
  ON public.lm_sermon_gems FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own gems"
  ON public.lm_sermon_gems FOR DELETE
  USING (user_id = auth.uid());

-- Study Packets
CREATE POLICY "Users can view published study packets"
  ON public.lm_study_packets FOR SELECT
  USING (
    status = 'published' OR
    created_by = auth.uid() OR
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can create study packets"
  ON public.lm_study_packets FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own packets"
  ON public.lm_study_packets FOR UPDATE
  USING (
    created_by = auth.uid() OR
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to check if a YouTube URL is from an approved source
CREATE OR REPLACE FUNCTION public.is_approved_sermon_source(youtube_url TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  video_id TEXT;
BEGIN
  -- For MVP, allow all Living Manna related content
  -- In production, this would check against approved_sermon_sources

  -- Extract video ID from various YouTube URL formats
  video_id := substring(youtube_url from 'v=([a-zA-Z0-9_-]+)');
  IF video_id IS NULL THEN
    video_id := substring(youtube_url from 'youtu\.be/([a-zA-Z0-9_-]+)');
  END IF;

  -- For now, return true to allow submission
  -- Pastor approval workflow will validate content
  RETURN TRUE;
END;
$$;

-- Function to get sermon with full details
CREATE OR REPLACE FUNCTION public.get_sermon_deep_dive(p_sermon_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'sermon', row_to_json(s),
    'transcript', (
      SELECT row_to_json(t) FROM public.lm_sermon_transcripts t
      WHERE t.sermon_id = s.id
      ORDER BY t.version DESC LIMIT 1
    ),
    'segments', (
      SELECT jsonb_agg(row_to_json(seg) ORDER BY seg.segment_index)
      FROM public.lm_sermon_segments seg WHERE seg.sermon_id = s.id
    ),
    'scriptures', (
      SELECT jsonb_agg(row_to_json(scr))
      FROM public.lm_sermon_scriptures scr WHERE scr.sermon_id = s.id
    ),
    'insights', (
      SELECT jsonb_agg(row_to_json(ins))
      FROM public.lm_sermon_insights ins WHERE ins.sermon_id = s.id
    )
  ) INTO result
  FROM public.lm_sermons s
  WHERE s.id = p_sermon_id;

  RETURN result;
END;
$$;
