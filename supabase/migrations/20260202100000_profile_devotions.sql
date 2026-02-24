-- Create table to store generated devotions for profiles
CREATE TABLE IF NOT EXISTS profile_devotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES devotional_profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Core devotion content
  title TEXT NOT NULL,
  scripture_reference TEXT NOT NULL,
  scripture_text TEXT NOT NULL,
  devotional_body TEXT NOT NULL,
  strike_line TEXT,
  prayer TEXT,
  memory_hook TEXT,

  -- Phototheology-rich fields
  sanctuary_connection TEXT,
  cycle_placement TEXT,
  types_and_symbols TEXT[],
  cross_references TEXT[],
  christ_name TEXT,
  christ_action TEXT,
  application TEXT,

  -- Metadata
  theme_used TEXT,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_shared BOOLEAN DEFAULT FALSE,
  shared_at TIMESTAMPTZ,

  -- Indexes for common queries
  CONSTRAINT fk_profile FOREIGN KEY (profile_id) REFERENCES devotional_profiles(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_profile_devotions_profile_id ON profile_devotions(profile_id);
CREATE INDEX idx_profile_devotions_user_id ON profile_devotions(user_id);
CREATE INDEX idx_profile_devotions_created_at ON profile_devotions(created_at DESC);

-- Enable RLS
ALTER TABLE profile_devotions ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access devotions they created
CREATE POLICY "Users can view their own profile devotions"
  ON profile_devotions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile devotions"
  ON profile_devotions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile devotions"
  ON profile_devotions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile devotions"
  ON profile_devotions FOR DELETE
  USING (auth.uid() = user_id);
