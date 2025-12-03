-- Track user's active path journey
CREATE TABLE user_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  path_type TEXT NOT NULL CHECK (path_type IN ('visual', 'analytical', 'devotional', 'warrior')),
  started_at TIMESTAMPTZ DEFAULT now(),
  current_year INTEGER DEFAULT 1 CHECK (current_year IN (1, 2)),
  current_quarter INTEGER DEFAULT 1 CHECK (current_quarter BETWEEN 1 AND 8),
  current_month INTEGER DEFAULT 1 CHECK (current_month BETWEEN 1 AND 24),
  path_switches_used INTEGER DEFAULT 0,
  trial_ends_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, path_type, is_active)
);

-- Record completed paths for Master Level tracking
CREATE TABLE path_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  path_type TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT now(),
  master_level INTEGER NOT NULL,
  certificate_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Track monthly mastery gate attempts
CREATE TABLE monthly_gates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  path_type TEXT NOT NULL,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  passed BOOLEAN DEFAULT false,
  flagged_for_review BOOLEAN DEFAULT false,
  attempts INTEGER DEFAULT 0,
  last_attempt_at TIMESTAMPTZ,
  passed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, path_type, year, month)
);

-- Add path columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS selected_path TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS path_master_level INTEGER DEFAULT 0;

-- Enable RLS
ALTER TABLE user_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE path_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_gates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_paths
CREATE POLICY "Users can view their own paths"
  ON user_paths FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own paths"
  ON user_paths FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own paths"
  ON user_paths FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for path_completions
CREATE POLICY "Users can view their own completions"
  ON path_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own completions"
  ON path_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for monthly_gates
CREATE POLICY "Users can view their own gates"
  ON monthly_gates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own gates"
  ON monthly_gates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own gates"
  ON monthly_gates FOR UPDATE
  USING (auth.uid() = user_id);