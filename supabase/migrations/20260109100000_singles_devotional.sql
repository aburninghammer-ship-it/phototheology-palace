-- Singles Devotional Feature
-- Daily devotionals and topical series for single Christians

-- ============================================
-- Table: singles_devotional_series
-- Topical series like "Trusting God's Timing", "Finding Contentment", etc.
-- ============================================
CREATE TABLE IF NOT EXISTS singles_devotional_series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  theme TEXT NOT NULL,
  cover_image_url TEXT,
  total_days INTEGER NOT NULL DEFAULT 7,
  difficulty TEXT DEFAULT 'all' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'all')),
  tags TEXT[] DEFAULT '{}',
  anchor_scriptures TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Table: singles_devotional_entries
-- Individual devotional entries (daily or part of series)
-- ============================================
CREATE TABLE IF NOT EXISTS singles_devotional_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  series_id UUID REFERENCES singles_devotional_series(id) ON DELETE CASCADE,
  day_number INTEGER, -- NULL for standalone daily devotionals

  -- Content
  title TEXT NOT NULL,
  scripture_reference TEXT NOT NULL,
  scripture_text TEXT, -- KJV text
  opening_thought TEXT NOT NULL,
  main_content TEXT NOT NULL,
  reflection_questions TEXT[] DEFAULT '{}',
  prayer_prompt TEXT,
  practical_application TEXT,

  -- PT Integration
  pt_room_focus TEXT, -- Which Palace room this devotional emphasizes
  christ_connection TEXT, -- How this points to Jesus

  -- Metadata
  date_for DATE, -- For daily devotionals without series
  is_generated BOOLEAN DEFAULT true,
  generation_prompt TEXT, -- The prompt used to generate (for reference)

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Table: user_singles_devotional_progress
-- Track user progress through series
-- ============================================
CREATE TABLE IF NOT EXISTS user_singles_devotional_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  series_id UUID REFERENCES singles_devotional_series(id) ON DELETE CASCADE,
  entry_id UUID REFERENCES singles_devotional_entries(id) ON DELETE CASCADE,

  completed_at TIMESTAMPTZ DEFAULT now(),
  notes TEXT, -- User's personal notes/reflections
  is_favorite BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(user_id, entry_id)
);

-- ============================================
-- Table: daily_singles_devotional_cache
-- Cache for AI-generated daily devotionals
-- ============================================
CREATE TABLE IF NOT EXISTS daily_singles_devotional_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date_for DATE NOT NULL UNIQUE,

  title TEXT NOT NULL,
  scripture_reference TEXT NOT NULL,
  scripture_text TEXT,
  opening_thought TEXT NOT NULL,
  main_content TEXT NOT NULL,
  reflection_questions TEXT[] DEFAULT '{}',
  prayer_prompt TEXT,
  practical_application TEXT,
  christ_connection TEXT,

  theme TEXT, -- What theme was used
  generated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_singles_series_featured ON singles_devotional_series(is_featured, is_active);
CREATE INDEX IF NOT EXISTS idx_singles_entries_series ON singles_devotional_entries(series_id, day_number);
CREATE INDEX IF NOT EXISTS idx_singles_entries_date ON singles_devotional_entries(date_for);
CREATE INDEX IF NOT EXISTS idx_singles_progress_user ON user_singles_devotional_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_singles_progress_series ON user_singles_devotional_progress(user_id, series_id);
CREATE INDEX IF NOT EXISTS idx_daily_singles_date ON daily_singles_devotional_cache(date_for);

-- ============================================
-- RLS Policies
-- ============================================
ALTER TABLE singles_devotional_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE singles_devotional_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_singles_devotional_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_singles_devotional_cache ENABLE ROW LEVEL SECURITY;

-- Series: Anyone can read
CREATE POLICY "Anyone can read singles devotional series"
  ON singles_devotional_series FOR SELECT
  USING (is_active = true);

-- Entries: Anyone can read
CREATE POLICY "Anyone can read singles devotional entries"
  ON singles_devotional_entries FOR SELECT
  USING (true);

-- Progress: Users can manage their own progress
CREATE POLICY "Users can read own singles devotional progress"
  ON user_singles_devotional_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own singles devotional progress"
  ON user_singles_devotional_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own singles devotional progress"
  ON user_singles_devotional_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own singles devotional progress"
  ON user_singles_devotional_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Daily cache: Anyone can read
CREATE POLICY "Anyone can read daily singles devotional"
  ON daily_singles_devotional_cache FOR SELECT
  USING (true);

-- ============================================
-- Seed Initial Series
-- ============================================
INSERT INTO singles_devotional_series (title, description, theme, total_days, tags, anchor_scriptures, is_featured, sort_order) VALUES
(
  'Trusting God''s Timing',
  'A 7-day journey through Scripture exploring how to trust God''s perfect timing for your life, relationships, and future.',
  'trust',
  7,
  ARRAY['waiting', 'patience', 'faith', 'timing'],
  ARRAY['Ecclesiastes 3:11', 'Isaiah 40:31', 'Psalm 27:14', 'Habakkuk 2:3'],
  true,
  1
),
(
  'Finding Contentment in Singleness',
  'Discover the joy and purpose God has for you right now. Learn to thrive in your current season rather than just survive it.',
  'contentment',
  7,
  ARRAY['contentment', 'joy', 'purpose', 'gratitude'],
  ARRAY['Philippians 4:11-13', '1 Corinthians 7:32-35', 'Psalm 37:4', 'Matthew 6:33'],
  true,
  2
),
(
  'Identity in Christ',
  'Who are you when no one else defines you? Explore your true identity as a beloved child of God.',
  'identity',
  7,
  ARRAY['identity', 'worth', 'belonging', 'purpose'],
  ARRAY['Ephesians 1:4-6', '1 Peter 2:9', 'Galatians 2:20', 'John 1:12'],
  true,
  3
),
(
  'Purity of Heart',
  'More than a list of rules - discover the beauty of a heart fully devoted to God and the freedom purity brings.',
  'purity',
  7,
  ARRAY['purity', 'holiness', 'boundaries', 'freedom'],
  ARRAY['Psalm 51:10', 'Matthew 5:8', '1 Thessalonians 4:3-5', '2 Timothy 2:22'],
  false,
  4
),
(
  'Overcoming Loneliness',
  'You are never truly alone. Learn to experience God''s presence and build meaningful community.',
  'loneliness',
  7,
  ARRAY['loneliness', 'community', 'presence', 'connection'],
  ARRAY['Psalm 68:6', 'Hebrews 13:5', 'Deuteronomy 31:6', 'Matthew 28:20'],
  false,
  5
),
(
  'Serving Wholeheartedly',
  'Singleness is a gift for service. Discover how God can use your undivided attention for His kingdom.',
  'service',
  7,
  ARRAY['service', 'ministry', 'calling', 'purpose'],
  ARRAY['1 Corinthians 7:32-35', 'Romans 12:1', 'Galatians 5:13', 'Colossians 3:23-24'],
  false,
  6
),
(
  'Preparing for the Future',
  'Whether marriage or continued singleness, learn to prepare your heart and character for whatever God has ahead.',
  'preparation',
  7,
  ARRAY['preparation', 'growth', 'character', 'future'],
  ARRAY['Proverbs 24:27', 'Ruth 3:11', 'Proverbs 31:10-31', 'Matthew 25:1-13'],
  false,
  7
),
(
  'When Others Move On',
  'Navigating the emotions when friends marry while you remain single. Finding peace in your own journey.',
  'comparison',
  5,
  ARRAY['comparison', 'jealousy', 'peace', 'journey'],
  ARRAY['Galatians 6:4', 'Psalm 84:11', '2 Corinthians 10:12', 'Jeremiah 29:11'],
  false,
  8
);

-- Verify
SELECT title, theme, total_days, is_featured FROM singles_devotional_series ORDER BY sort_order;
