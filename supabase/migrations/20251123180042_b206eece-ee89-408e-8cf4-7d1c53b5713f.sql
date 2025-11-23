-- Create table for daily verse breakdowns
CREATE TABLE IF NOT EXISTS public.daily_verses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  verse_reference TEXT NOT NULL,
  verse_text TEXT NOT NULL,
  principles_used TEXT[] NOT NULL,
  breakdown JSONB NOT NULL,
  date DATE NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on date for quick lookups
CREATE INDEX IF NOT EXISTS idx_daily_verses_date ON public.daily_verses(date);

-- Enable RLS
ALTER TABLE public.daily_verses ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read daily verses
CREATE POLICY "Anyone can view daily verses"
  ON public.daily_verses
  FOR SELECT
  USING (true);

-- Create table to track user verse readings
CREATE TABLE IF NOT EXISTS public.user_verse_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  verse_id UUID NOT NULL REFERENCES public.daily_verses(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, verse_id)
);

-- Enable RLS
ALTER TABLE public.user_verse_readings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own readings
CREATE POLICY "Users can view their own readings"
  ON public.user_verse_readings
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own readings
CREATE POLICY "Users can mark verses as read"
  ON public.user_verse_readings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_user_verse_readings_user ON public.user_verse_readings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_verse_readings_verse ON public.user_verse_readings(verse_id);