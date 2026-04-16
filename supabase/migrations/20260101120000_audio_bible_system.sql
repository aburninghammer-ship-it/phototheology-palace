-- Audio Bible System Database Schema
-- Stores commentaries, themes, reading sequences, and audio cache

-- Commentary tiers enum
CREATE TYPE commentary_tier AS ENUM ('surface', 'intermediate', 'scholarly');

-- Bible commentaries table - stores pre-generated commentaries
CREATE TABLE IF NOT EXISTS bible_commentaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  tier commentary_tier NOT NULL DEFAULT 'surface',
  commentary_text TEXT NOT NULL,
  audio_url TEXT, -- Cached TTS audio URL
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Unique constraint per verse and tier
  UNIQUE(book, chapter, verse, tier)
);

-- Create index for fast lookups
CREATE INDEX idx_commentaries_lookup ON bible_commentaries(book, chapter, verse);
CREATE INDEX idx_commentaries_book_chapter ON bible_commentaries(book, chapter);

-- Commentary themes table - defines available themes
CREATE TABLE IF NOT EXISTS commentary_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE, -- e.g., "love", "patience", "sabbath", "faith"
  display_name TEXT NOT NULL, -- e.g., "Love", "Patience", "The Sabbath"
  description TEXT,
  icon TEXT, -- emoji or icon name
  category TEXT, -- e.g., "virtues", "doctrines", "prophecy"
  verse_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Theme verses - links verses to themes
CREATE TABLE IF NOT EXISTS theme_verses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_id UUID NOT NULL REFERENCES commentary_themes(id) ON DELETE CASCADE,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  verse_text TEXT, -- Cached verse text
  relevance_score INTEGER DEFAULT 5, -- 1-10, how relevant to theme
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(theme_id, book, chapter, verse)
);

CREATE INDEX idx_theme_verses_theme ON theme_verses(theme_id);
CREATE INDEX idx_theme_verses_lookup ON theme_verses(book, chapter, verse);

-- User reading sequences - custom reading lists
CREATE TABLE IF NOT EXISTS user_reading_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  sequence_type TEXT NOT NULL DEFAULT 'custom', -- 'custom', 'book', 'theme', 'series'
  items JSONB NOT NULL DEFAULT '[]', -- Array of {book, chapter, startVerse?, endVerse?}
  settings JSONB DEFAULT '{}', -- {commentaryTier, voice, speed, etc.}
  is_public BOOLEAN DEFAULT FALSE,
  play_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reading_sequences_user ON user_reading_sequences(user_id);

-- Audio cache - stores generated TTS audio URLs
CREATE TABLE IF NOT EXISTS audio_bible_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key TEXT NOT NULL UNIQUE, -- Hash of content + voice + settings
  audio_url TEXT NOT NULL,
  content_type TEXT NOT NULL, -- 'verse', 'commentary', 'chapter'
  book TEXT,
  chapter INTEGER,
  verse INTEGER,
  tier commentary_tier,
  voice TEXT DEFAULT 'onyx',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audio_cache_key ON audio_bible_cache(cache_key);
CREATE INDEX idx_audio_cache_lookup ON audio_bible_cache(book, chapter, verse, tier);

-- User listening history - tracks what users have listened to
CREATE TABLE IF NOT EXISTS user_listening_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER,
  commentary_tier commentary_tier,
  listened_at TIMESTAMPTZ DEFAULT NOW(),
  completed BOOLEAN DEFAULT FALSE,
  duration_seconds INTEGER
);

CREATE INDEX idx_listening_history_user ON user_listening_history(user_id);
CREATE INDEX idx_listening_history_recent ON user_listening_history(user_id, listened_at DESC);

-- Theological safeguards - stores rules for commentary generation
CREATE TABLE IF NOT EXISTS theological_safeguards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  applies_to JSONB, -- {books: [...], topics: [...]}
  correct_interpretation TEXT NOT NULL,
  incorrect_interpretations TEXT[], -- Array of things to avoid
  priority INTEGER DEFAULT 5,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default theological safeguards
INSERT INTO theological_safeguards (rule_name, description, applies_to, correct_interpretation, incorrect_interpretations, priority) VALUES
('scapegoat_not_jesus',
 'The scapegoat (Azazel) in Leviticus 16 represents Satan, not Jesus',
 '{"books": ["Leviticus"], "topics": ["scapegoat", "day of atonement", "azazel"]}',
 'The scapegoat represents Satan who bears responsibility for originating sin. The Lord''s goat (slain) represents Christ. The scapegoat is sent into the wilderness alive, symbolizing Satan''s ultimate fate.',
 ARRAY['scapegoat represents Jesus', 'both goats represent Christ', 'Azazel is another name for Christ'],
 10),

('hebrews_temple_location',
 'Hebrews teaches Christ entered the heavenly temple, not specifically the Most Holy Place at ascension',
 '{"books": ["Hebrews"], "topics": ["sanctuary", "heavenly temple", "most holy place"]}',
 'Hebrews contrasts the earthly temple with the heavenly. It affirms Christ ministers in the true heavenly sanctuary but does not specify He entered the Most Holy Place at His ascension. The two-apartment ministry is preserved.',
 ARRAY['Christ entered Most Holy Place at ascension', 'Hebrews teaches immediate entry to Most Holy', 'no distinction between holy and most holy in heaven'],
 10),

('revelation_4_5_holy_place',
 'Revelation 4-5 depicts the Holy Place of the heavenly sanctuary, not the Most Holy Place',
 '{"books": ["Revelation"], "topics": ["throne room", "seven lamps", "revelation 4", "revelation 5"]}',
 'The seven lamps of fire (Rev 4:5) correspond to the seven-branched lampstand in the Holy Place. The scene shows Christ''s inauguration and intercessory ministry, not the Most Holy Place judgment scene which begins in later chapters.',
 ARRAY['Revelation 4-5 is Most Holy Place', 'throne room is Most Holy Place', 'judgment begins in Revelation 4'],
 10),

('little_horn_papacy',
 'The little horn in Daniel 7 and 8 represents papal Rome, never Antiochus Epiphanes',
 '{"books": ["Daniel"], "topics": ["little horn", "antiochus", "papacy", "daniel 7", "daniel 8"]}',
 'The little horn arises from the fourth beast (Rome) and continues until the judgment. It represents the papal system that persecuted saints for 1260 years. Daniel 8''s little horn also points to Rome (pagan and papal phases).',
 ARRAY['little horn is Antiochus Epiphanes', 'Daniel 8 fulfilled in 2nd century BC', 'little horn is a past figure only'],
 10),

('daniel_11_40_satan',
 'Daniel 11:40-45 describes Satan appearing as Christ in end-time deception',
 '{"books": ["Daniel"], "topics": ["daniel 11", "king of the north", "end times"]}',
 'The king of the north in Daniel 11:40-45 represents Satan''s final deception, appearing as Christ to deceive the world. This is the ultimate counterfeit before Christ''s true return.',
 ARRAY['king of north is a literal nation', 'fulfilled in ancient history', 'refers to Turkey or Russia'],
 10),

('three_heavens_prophecy',
 'Apply the Three Heavens hermeneutic to prophetic interpretation',
 '{"books": ["Isaiah", "Jeremiah", "Ezekiel", "Daniel", "Revelation"], "topics": ["prophecy", "interpretation"]}',
 'Pre-exilic and post-exilic prophecies often have multiple fulfillments: (1) immediate/historical, (2) Messianic/Christ''s first advent, (3) eschatological/end-time. Recognize all three dimensions when interpreting.',
 ARRAY['single fulfillment only', 'purely historical interpretation', 'ignore typological patterns'],
 8);

-- Insert default themes
INSERT INTO commentary_themes (name, display_name, description, icon, category) VALUES
('love', 'Love', 'Verses about God''s love and loving others', '❤️', 'virtues'),
('faith', 'Faith', 'Verses about faith, trust, and belief', '🙏', 'virtues'),
('patience', 'Patience', 'Verses about patience and endurance', '⏳', 'virtues'),
('hope', 'Hope', 'Verses about hope and future promises', '🌟', 'virtues'),
('peace', 'Peace', 'Verses about peace with God and others', '🕊️', 'virtues'),
('sabbath', 'The Sabbath', 'Verses about the Sabbath rest', '📖', 'doctrines'),
('sanctuary', 'Sanctuary', 'Verses about the sanctuary and Christ''s ministry', '⛪', 'doctrines'),
('second_coming', 'Second Coming', 'Verses about Christ''s return', '👑', 'doctrines'),
('prophecy', 'Prophecy', 'Major prophetic passages', '🔮', 'prophecy'),
('salvation', 'Salvation', 'Verses about salvation and redemption', '✝️', 'doctrines'),
('creation', 'Creation', 'Verses about God as Creator', '🌍', 'doctrines'),
('judgment', 'Judgment', 'Verses about God''s judgment', '⚖️', 'doctrines');

-- Enable RLS
ALTER TABLE bible_commentaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE commentary_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reading_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_bible_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_listening_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE theological_safeguards ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Commentaries are readable by all authenticated users
CREATE POLICY "Commentaries readable by authenticated users" ON bible_commentaries
  FOR SELECT TO authenticated USING (true);

-- Themes are readable by all
CREATE POLICY "Themes readable by all" ON commentary_themes
  FOR SELECT USING (true);

-- Theme verses readable by all
CREATE POLICY "Theme verses readable by all" ON theme_verses
  FOR SELECT USING (true);

-- Users can manage their own reading sequences
CREATE POLICY "Users manage own sequences" ON user_reading_sequences
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Public sequences readable by all authenticated
CREATE POLICY "Public sequences readable" ON user_reading_sequences
  FOR SELECT TO authenticated USING (is_public = true);

-- Audio cache readable by authenticated
CREATE POLICY "Audio cache readable" ON audio_bible_cache
  FOR SELECT TO authenticated USING (true);

-- Users manage own listening history
CREATE POLICY "Users manage own history" ON user_listening_history
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Safeguards readable by service role only (for edge functions)
CREATE POLICY "Safeguards readable by service" ON theological_safeguards
  FOR SELECT TO service_role USING (true);

-- Function to update theme verse counts
CREATE OR REPLACE FUNCTION update_theme_verse_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE commentary_themes SET verse_count = verse_count + 1 WHERE id = NEW.theme_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE commentary_themes SET verse_count = verse_count - 1 WHERE id = OLD.theme_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_theme_count
AFTER INSERT OR DELETE ON theme_verses
FOR EACH ROW EXECUTE FUNCTION update_theme_verse_count();
