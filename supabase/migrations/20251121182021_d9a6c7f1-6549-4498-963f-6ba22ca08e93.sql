-- Create tables for Dojo training and challenge tracking

-- Table for tracking 30-day challenge progress
CREATE TABLE IF NOT EXISTS public.dojo_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  challenge_type TEXT NOT NULL, -- 'kindness', 'grace', 'forgiveness', 'humility', etc.
  day_number INTEGER NOT NULL CHECK (day_number >= 1 AND day_number <= 30),
  completed_at TIMESTAMP WITH TIME ZONE,
  reflection TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, challenge_type, day_number)
);

-- Table for tracking lesson progress
CREATE TABLE IF NOT EXISTS public.dojo_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  lesson_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  notes TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Table for tracking warrior characteristics development
CREATE TABLE IF NOT EXISTS public.warrior_characteristics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  characteristic_name TEXT NOT NULL, -- 'courage', 'diligence', 'unity_of_purpose', etc.
  level INTEGER DEFAULT 1 CHECK (level >= 1 AND level <= 10),
  practices_completed INTEGER DEFAULT 0,
  last_practiced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, characteristic_name)
);

-- Enable RLS
ALTER TABLE public.dojo_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dojo_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warrior_characteristics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for dojo_challenges
CREATE POLICY "Users can view their own challenge progress"
  ON public.dojo_challenges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own challenge progress"
  ON public.dojo_challenges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own challenge progress"
  ON public.dojo_challenges FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for dojo_lessons
CREATE POLICY "Users can view their own lesson progress"
  ON public.dojo_lessons FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lesson progress"
  ON public.dojo_lessons FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lesson progress"
  ON public.dojo_lessons FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for warrior_characteristics
CREATE POLICY "Users can view their own characteristics"
  ON public.warrior_characteristics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own characteristics"
  ON public.warrior_characteristics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own characteristics"
  ON public.warrior_characteristics FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_dojo_challenges_user_id ON public.dojo_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_dojo_lessons_user_id ON public.dojo_lessons(user_id);
CREATE INDEX IF NOT EXISTS idx_warrior_characteristics_user_id ON public.warrior_characteristics(user_id);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_dojo_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_dojo_lessons_updated_at
  BEFORE UPDATE ON public.dojo_lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_dojo_updated_at();

CREATE TRIGGER update_warrior_characteristics_updated_at
  BEFORE UPDATE ON public.warrior_characteristics
  FOR EACH ROW
  EXECUTE FUNCTION update_dojo_updated_at();