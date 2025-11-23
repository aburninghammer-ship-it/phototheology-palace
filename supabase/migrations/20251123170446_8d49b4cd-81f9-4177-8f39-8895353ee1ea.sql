-- Create room curriculum progress table
CREATE TABLE IF NOT EXISTS public.room_curriculum_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  room_id TEXT NOT NULL,
  floor_number INTEGER NOT NULL,
  current_activity_index INTEGER DEFAULT 0,
  completed_activities JSONB DEFAULT '[]'::jsonb,
  milestone_tests_passed JSONB DEFAULT '{}'::jsonb,
  curriculum_completed BOOLEAN DEFAULT false,
  last_activity_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, room_id)
);

-- Enable RLS
ALTER TABLE public.room_curriculum_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own curriculum progress"
  ON public.room_curriculum_progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own curriculum progress"
  ON public.room_curriculum_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own curriculum progress"
  ON public.room_curriculum_progress
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_room_curriculum_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_room_curriculum_progress_updated_at
  BEFORE UPDATE ON public.room_curriculum_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_room_curriculum_updated_at();

-- Index for faster queries
CREATE INDEX idx_room_curriculum_user_room ON public.room_curriculum_progress(user_id, room_id);