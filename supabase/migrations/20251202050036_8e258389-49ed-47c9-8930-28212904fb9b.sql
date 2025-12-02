-- Create user_process_state table for tracking all user activities
CREATE TABLE IF NOT EXISTS public.user_process_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  last_location TEXT,
  last_timestamp TIMESTAMPTZ DEFAULT now(),
  active_process TEXT,
  process_step INTEGER DEFAULT 0,
  process_total_steps INTEGER,
  notes TEXT,
  task_type TEXT,
  last_drill_session_id UUID,
  last_room_mastered TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT user_process_state_user_id_unique UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE public.user_process_state ENABLE ROW LEVEL SECURITY;

-- Policies for user_process_state
CREATE POLICY "Users can view own process state"
  ON public.user_process_state
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own process state"
  ON public.user_process_state
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own process state"
  ON public.user_process_state
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Add process tracking columns to drill_sessions
ALTER TABLE public.drill_sessions 
  ADD COLUMN IF NOT EXISTS current_step INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_steps INTEGER,
  ADD COLUMN IF NOT EXISTS last_room TEXT,
  ADD COLUMN IF NOT EXISTS is_abandoned BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS resume_data JSONB;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_process_state_user_id ON public.user_process_state(user_id);
CREATE INDEX IF NOT EXISTS idx_drill_sessions_user_abandoned ON public.drill_sessions(user_id, is_abandoned, updated_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user_process_state
DROP TRIGGER IF EXISTS update_user_process_state_updated_at ON public.user_process_state;
CREATE TRIGGER update_user_process_state_updated_at
  BEFORE UPDATE ON public.user_process_state
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();