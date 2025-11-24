-- Fix RLS policies by dropping existing ones first
DROP POLICY IF EXISTS "Users can view own curriculum progress" ON room_curriculum_progress;
DROP POLICY IF EXISTS "Users can insert own curriculum progress" ON room_curriculum_progress;
DROP POLICY IF EXISTS "Users can update own curriculum progress" ON room_curriculum_progress;

-- Re-create RLS Policies
CREATE POLICY "Users can view own curriculum progress"
  ON room_curriculum_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own curriculum progress"
  ON room_curriculum_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own curriculum progress"
  ON room_curriculum_progress FOR UPDATE
  USING (auth.uid() = user_id);