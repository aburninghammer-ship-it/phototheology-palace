
-- Create defense_arsenal table for cross-device weapon sync
CREATE TABLE public.defense_arsenal (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT,
  argument TEXT NOT NULL,
  analysis TEXT NOT NULL,
  topic TEXT NOT NULL DEFAULT 'General',
  saved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.defense_arsenal ENABLE ROW LEVEL SECURITY;

-- Users can only access their own weapons
CREATE POLICY "Users can view own arsenal" ON public.defense_arsenal
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own arsenal" ON public.defense_arsenal
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own arsenal" ON public.defense_arsenal
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own arsenal" ON public.defense_arsenal
  FOR DELETE USING (auth.uid() = user_id);

-- Index for fast user lookups
CREATE INDEX idx_defense_arsenal_user_id ON public.defense_arsenal(user_id);
