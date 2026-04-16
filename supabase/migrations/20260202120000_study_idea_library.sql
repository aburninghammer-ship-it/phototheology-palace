-- Study Idea Library Tables
-- Supports Spark Cards shelf and Study Path progress tracking

-- User's saved spark cards (both static library cards and AI-generated ideas)
CREATE TABLE IF NOT EXISTS user_spark_card_shelf (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_type TEXT NOT NULL CHECK (card_type IN ('static', 'generated')),
  static_card_id TEXT, -- For static cards from studyIdeasLibrary.ts
  generated_idea JSONB, -- For AI-generated ideas (title, verses, rooms, prompts)
  saved_at TIMESTAMPTZ DEFAULT now(),
  notes TEXT, -- User's personal notes on this card
  completed_at TIMESTAMPTZ, -- When user completed studying this card
  CONSTRAINT unique_static_card UNIQUE(user_id, static_card_id),
  CONSTRAINT check_card_source CHECK (
    (card_type = 'static' AND static_card_id IS NOT NULL AND generated_idea IS NULL) OR
    (card_type = 'generated' AND generated_idea IS NOT NULL AND static_card_id IS NULL)
  )
);

-- User's progress through guided study paths
CREATE TABLE IF NOT EXISTS user_study_path_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  path_id TEXT NOT NULL, -- Static path ID from studyIdeasLibrary.ts
  current_card_index INTEGER DEFAULT 0,
  completed_cards TEXT[] DEFAULT '{}', -- Array of completed card IDs
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id, path_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_shelf_user_id ON user_spark_card_shelf(user_id);
CREATE INDEX IF NOT EXISTS idx_user_shelf_card_type ON user_spark_card_shelf(card_type);
CREATE INDEX IF NOT EXISTS idx_path_progress_user_id ON user_study_path_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_path_progress_active ON user_study_path_progress(user_id, is_active) WHERE is_active = true;

-- Row Level Security
ALTER TABLE user_spark_card_shelf ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_study_path_progress ENABLE ROW LEVEL SECURITY;

-- Users can only access their own shelf items
CREATE POLICY "Users manage own shelf" ON user_spark_card_shelf
  FOR ALL USING (auth.uid() = user_id);

-- Users can only access their own path progress
CREATE POLICY "Users manage own path progress" ON user_study_path_progress
  FOR ALL USING (auth.uid() = user_id);
