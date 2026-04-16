-- Create dojo_daily_training table for tracking daily exercises
CREATE TABLE IF NOT EXISTS dojo_daily_training (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  completed_exercises TEXT[] DEFAULT '{}',
  points INTEGER DEFAULT 0,
  reflection TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_dojo_daily_training_user_id ON dojo_daily_training(user_id);
CREATE INDEX IF NOT EXISTS idx_dojo_daily_training_date ON dojo_daily_training(date);
CREATE INDEX IF NOT EXISTS idx_dojo_daily_training_user_date ON dojo_daily_training(user_id, date);

-- Enable RLS
ALTER TABLE dojo_daily_training ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view own daily training"
  ON dojo_daily_training FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily training"
  ON dojo_daily_training FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily training"
  ON dojo_daily_training FOR UPDATE
  USING (auth.uid() = user_id);

-- Add warrior_stats table for tracking overall progress
CREATE TABLE IF NOT EXISTS dojo_warrior_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  total_xp INTEGER DEFAULT 0,
  current_rank TEXT DEFAULT 'Recruit',
  lessons_completed INTEGER DEFAULT 0,
  scenarios_won INTEGER DEFAULT 0,
  scenarios_attempted INTEGER DEFAULT 0,
  challenge_days_completed INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  weapons_practiced INTEGER DEFAULT 0,
  last_active_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_dojo_warrior_stats_user_id ON dojo_warrior_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_dojo_warrior_stats_total_xp ON dojo_warrior_stats(total_xp DESC);

-- Enable RLS
ALTER TABLE dojo_warrior_stats ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view own warrior stats"
  ON dojo_warrior_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view leaderboard stats"
  ON dojo_warrior_stats FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own warrior stats"
  ON dojo_warrior_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own warrior stats"
  ON dojo_warrior_stats FOR UPDATE
  USING (auth.uid() = user_id);
