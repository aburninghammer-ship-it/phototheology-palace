-- Quick Devotion History Table
-- Stores user's quick devotion generations for history/recall

CREATE TABLE IF NOT EXISTS quick_devotion_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  theme TEXT NOT NULL,
  description TEXT,
  depth_level TEXT DEFAULT 'balanced',
  writing_style TEXT DEFAULT 'warm',
  devotion_content TEXT NOT NULL,
  scripture_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast user lookups
CREATE INDEX idx_quick_devotion_history_user_id ON quick_devotion_history(user_id);
CREATE INDEX idx_quick_devotion_history_created_at ON quick_devotion_history(created_at DESC);

-- Enable RLS
ALTER TABLE quick_devotion_history ENABLE ROW LEVEL SECURITY;

-- Users can only see their own history
CREATE POLICY "Users can view own quick devotion history"
  ON quick_devotion_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own history
CREATE POLICY "Users can insert own quick devotion history"
  ON quick_devotion_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own history
CREATE POLICY "Users can delete own quick devotion history"
  ON quick_devotion_history FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
