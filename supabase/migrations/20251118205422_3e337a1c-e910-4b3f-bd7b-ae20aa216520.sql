-- Create genesis_challenge_participants table
CREATE TABLE IF NOT EXISTS public.genesis_challenge_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  current_day INTEGER DEFAULT 1,
  completed_floors INTEGER[] DEFAULT ARRAY[]::INTEGER[],
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(email)
);

-- Create genesis_challenge_progress table for daily tracking
CREATE TABLE IF NOT EXISTS public.genesis_challenge_daily_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES public.genesis_challenge_participants(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL CHECK (day_number >= 1 AND day_number <= 7),
  floors_completed INTEGER[] DEFAULT ARRAY[]::INTEGER[],
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(participant_id, day_number)
);

-- Enable RLS
ALTER TABLE public.genesis_challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genesis_challenge_daily_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for participants (public can insert, users can view their own)
CREATE POLICY "Anyone can sign up for challenge"
  ON public.genesis_challenge_participants
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own progress"
  ON public.genesis_challenge_participants
  FOR SELECT
  USING (
    auth.uid() = user_id OR
    email = current_setting('request.jwt.claims', true)::json->>'email'
  );

CREATE POLICY "Users can update their own progress"
  ON public.genesis_challenge_participants
  FOR UPDATE
  USING (
    auth.uid() = user_id OR
    email = current_setting('request.jwt.claims', true)::json->>'email'
  );

-- RLS Policies for daily progress
CREATE POLICY "Users can view their own daily progress"
  ON public.genesis_challenge_daily_progress
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.genesis_challenge_participants
      WHERE id = participant_id
      AND (auth.uid() = user_id OR email = current_setting('request.jwt.claims', true)::json->>'email')
    )
  );

CREATE POLICY "Users can insert their own daily progress"
  ON public.genesis_challenge_daily_progress
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.genesis_challenge_participants
      WHERE id = participant_id
      AND (auth.uid() = user_id OR email = current_setting('request.jwt.claims', true)::json->>'email')
    )
  );

CREATE POLICY "Users can update their own daily progress"
  ON public.genesis_challenge_daily_progress
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.genesis_challenge_participants
      WHERE id = participant_id
      AND (auth.uid() = user_id OR email = current_setting('request.jwt.claims', true)::json->>'email')
    )
  );

-- Create indexes for performance
CREATE INDEX idx_genesis_participants_email ON public.genesis_challenge_participants(email);
CREATE INDEX idx_genesis_participants_user_id ON public.genesis_challenge_participants(user_id);
CREATE INDEX idx_genesis_daily_progress_participant ON public.genesis_challenge_daily_progress(participant_id);

-- Create function to update last_active_at
CREATE OR REPLACE FUNCTION update_genesis_challenge_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.genesis_challenge_participants
  SET last_active_at = now()
  WHERE id = NEW.participant_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for activity tracking
CREATE TRIGGER update_challenge_activity_trigger
  AFTER INSERT OR UPDATE ON public.genesis_challenge_daily_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_genesis_challenge_activity();