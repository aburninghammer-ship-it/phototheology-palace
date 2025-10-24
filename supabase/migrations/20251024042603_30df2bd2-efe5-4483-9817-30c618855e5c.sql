-- Redesign treasure hunts table for progressive clue system
DROP TABLE IF EXISTS treasure_hunt_participations CASCADE;
DROP TABLE IF EXISTS treasure_hunts CASCADE;

-- Create new treasure_hunts table with multi-clue structure
CREATE TABLE treasure_hunts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'pro', 'scholar')),
  category TEXT NOT NULL,
  time_limit_hours INTEGER NOT NULL DEFAULT 24,
  expires_at TIMESTAMPTZ NOT NULL,
  final_verse TEXT NOT NULL,
  final_verse_text TEXT NOT NULL,
  biblical_conclusion TEXT NOT NULL,
  clues JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create treasure_hunt_participations table
CREATE TABLE treasure_hunt_participations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  hunt_id UUID NOT NULL REFERENCES treasure_hunts(id) ON DELETE CASCADE,
  current_clue_number INTEGER NOT NULL DEFAULT 1,
  clues_completed JSONB NOT NULL DEFAULT '[]'::jsonb,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  time_elapsed_seconds INTEGER,
  total_attempts INTEGER NOT NULL DEFAULT 0,
  hints_used INTEGER NOT NULL DEFAULT 0,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(user_id, hunt_id)
);

-- Enable RLS
ALTER TABLE treasure_hunts ENABLE ROW LEVEL SECURITY;
ALTER TABLE treasure_hunt_participations ENABLE ROW LEVEL SECURITY;

-- Policies for treasure_hunts
CREATE POLICY "Treasure hunts viewable by all"
  ON treasure_hunts FOR SELECT
  USING (is_active = true);

-- Policies for treasure_hunt_participations
CREATE POLICY "Users can view own participations"
  ON treasure_hunt_participations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own participations"
  ON treasure_hunt_participations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own participations"
  ON treasure_hunt_participations FOR UPDATE
  USING (auth.uid() = user_id);

-- Insert sample progressive treasure hunts
INSERT INTO treasure_hunts (title, difficulty, category, time_limit_hours, expires_at, final_verse, final_verse_text, biblical_conclusion, clues) VALUES
(
  'The Lamb''s Victory Path',
  'pro',
  'full-palace',
  24,
  now() + interval '7 days',
  'Revelation 5:6',
  'And I beheld, and, lo, in the midst of the throne and of the four beasts, and in the midst of the elders, stood a Lamb as it had been slain, having seven horns and seven eyes, which are the seven Spirits of God sent forth into all the earth.',
  'The Lamb standing as slain in the throne room reveals the central truth of redemption: Christ''s sacrifice is eternally present before God, His completed work of atonement the foundation of all heavenly worship and earthly victory.',
  '[
    {
      "clue_number": 1,
      "hint": "I am thinking of a concept that bridges heaven and earth—a being that appears weak yet holds all power, shows death yet grants all life. This paradox is the foundation of both worship and warfare in the cosmic conflict.",
      "clue_type": "theme",
      "correct_answers": ["sacrifice", "atonement", "lamb", "redemption", "substitution"],
      "explanation": "The theme is sacrificial redemption—the Lamb who was slain."
    },
    {
      "clue_number": 2,
      "hint": "To understand this paradox, you must enter a room where types meet antitypes, where shadows find their substance. The methodology here reveals how Old Testament symbols point to New Testament realities. Which Palace room unlocks this?",
      "clue_type": "room",
      "correct_answers": ["TR", "Type Room", "Types Room", "Typology", "Type and Antitype"],
      "explanation": "The Type Room (TR) reveals how Old Testament sacrificial lambs point to Christ."
    },
    {
      "clue_number": 3,
      "hint": "Within this room, a specific principle emerges: the sacrificial lamb in the sanctuary service points directly to a cosmic reality. What is the antitype—the fulfillment—that all those temple lambs were shadowing?",
      "clue_type": "principle",
      "correct_answers": ["Christ as the Lamb", "Jesus the Lamb", "Lamb of God", "Slain Lamb", "Christ the sacrifice"],
      "explanation": "The principle is TYPE and ANTITYPE: sanctuary lambs point to Christ as God''s Lamb."
    },
    {
      "clue_number": 4,
      "hint": "Now find Jeeves'' verse: Where in Scripture do we see this Lamb—bearing the marks of slaughter yet standing in victory—positioned at the very center of God''s throne room, holding the seven Spirits of God? This verse reveals the Lamb''s eternal presence in heaven''s sanctuary.",
      "clue_type": "verse",
      "correct_answers": ["Revelation 5:6", "Rev 5:6", "Revelation 5 6", "Rev. 5:6"],
      "explanation": "Revelation 5:6 shows the slain Lamb standing in the midst of the throne."
    }
  ]'::jsonb
),
(
  'The Prophetic Timeline',
  'scholar',
  'prophecy',
  24,
  now() + interval '7 days',
  'Daniel 8:14',
  'And he said unto me, Unto two thousand and three hundred days; then shall the sanctuary be cleansed.',
  'This verse anchors the longest time prophecy in Scripture, revealing God''s timeline for judgment and the cleansing of heaven''s sanctuary—a prophecy that spans millennia and culminates in the final vindication of God''s character.',
  '[
    {
      "clue_number": 1,
      "hint": "I am thinking of a prophetic timeline that spans from ancient Persia to the end of time—the longest time prophecy in the Bible. It involves not earthly temples but a heavenly sanctuary, and its fulfillment marks the beginning of judgment.",
      "clue_type": "theme",
      "correct_answers": ["2300 days", "sanctuary cleansing", "investigative judgment", "day of atonement prophecy", "2300 evening morning"],
      "explanation": "The theme is the 2300-day prophecy concerning sanctuary cleansing."
    },
    {
      "clue_number": 2,
      "hint": "To decode this timeline, you need a room that specializes in prophetic parallels—where Old Testament events find their prophetic echoes in future fulfillments. This methodology reveals patterns across time. Which Palace room is this?",
      "clue_type": "room",
      "correct_answers": ["PR", "Parallel Room", "Parallels Room", "Prophetic Parallel", "Parallel Events"],
      "explanation": "The Parallel Room (PR) identifies prophetic patterns and their fulfillments."
    },
    {
      "clue_number": 3,
      "hint": "Within this prophetic framework, identify the specific parallel: the earthly Day of Atonement—when Israel''s sanctuary was cleansed—points to what heavenly event? What is the antitype judgment that began in 1844?",
      "clue_type": "principle",
      "correct_answers": ["investigative judgment", "pre-advent judgment", "heavenly day of atonement", "sanctuary judgment", "cleansing of heavenly sanctuary"],
      "explanation": "The principle: Earthly Day of Atonement points to Heavenly Investigative Judgment (1844)."
    },
    {
      "clue_number": 4,
      "hint": "Find Jeeves'' verse: In Daniel''s vision, where is the specific timeframe given—2300 evening-mornings—after which the sanctuary would be cleansed or justified? This verse contains the mathematical key to 1844.",
      "clue_type": "verse",
      "correct_answers": ["Daniel 8:14", "Dan 8:14", "Daniel 8 14", "Dan. 8:14"],
      "explanation": "Daniel 8:14 contains the 2300-day prophecy."
    }
  ]'::jsonb
),
(
  'The Character Reflection',
  'beginner',
  'sanctuary',
  24,
  now() + interval '7 days',
  'Exodus 25:8',
  'And let them make me a sanctuary; that I may dwell among them.',
  'God''s desire to dwell among His people through the sanctuary reveals His ultimate goal: intimate relationship. The sanctuary system teaches that God doesn''t merely want to save us from sin—He wants to live with us, transforming us into dwelling places for His presence.',
  '[
    {
      "clue_number": 1,
      "hint": "I am thinking of God''s deepest desire expressed through architecture—not just a place of sacrifice, but a place of presence. This concept reveals why God gave such detailed instructions for a physical structure in the wilderness.",
      "clue_type": "theme",
      "correct_answers": ["God dwelling with man", "divine presence", "immanuel", "God with us", "tabernacle presence"],
      "explanation": "The theme is God''s desire to dwell among His people."
    },
    {
      "clue_number": 2,
      "hint": "To understand this desire, enter the room that explores how sanctuary furniture and rituals reflect God''s character. This methodology shows how physical objects teach spiritual truths. Which Palace room reveals God through symbols?",
      "clue_type": "room",
      "correct_answers": ["SR", "Symbol Room", "Symbols Room", "Symbolism", "Symbolic"],
      "explanation": "The Symbol Room (SR) reveals how sanctuary elements reflect God''s character."
    },
    {
      "clue_number": 3,
      "hint": "Within the sanctuary system, what is the core principle? The entire tabernacle structure—from the courtyard to the Most Holy Place—symbolizes what journey or relationship between God and humanity?",
      "clue_type": "principle",
      "correct_answers": ["plan of salvation", "path to God", "restoration to God", "reconciliation", "way to the throne"],
      "explanation": "The principle: The sanctuary layout symbolizes the plan of salvation—humanity''s journey back to God."
    },
    {
      "clue_number": 4,
      "hint": "Find Jeeves'' verse: Where does God explicitly state His purpose for the sanctuary—His desire to dwell among His people? This command to Moses reveals the why behind the entire sanctuary system.",
      "clue_type": "verse",
      "correct_answers": ["Exodus 25:8", "Ex 25:8", "Exodus 25 8", "Ex. 25:8"],
      "explanation": "Exodus 25:8 states God''s purpose: that I may dwell among them."
    }
  ]'::jsonb
);