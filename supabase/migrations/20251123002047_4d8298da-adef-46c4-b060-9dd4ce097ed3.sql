-- Create room mastery levels table
CREATE TABLE IF NOT EXISTS public.room_mastery_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  room_id TEXT NOT NULL,
  floor_number INTEGER NOT NULL,
  current_level INTEGER NOT NULL DEFAULT 1 CHECK (current_level BETWEEN 1 AND 5),
  level_1_completed_at TIMESTAMPTZ,
  level_2_completed_at TIMESTAMPTZ,
  level_3_completed_at TIMESTAMPTZ,
  level_4_completed_at TIMESTAMPTZ,
  level_5_completed_at TIMESTAMPTZ,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, room_id, floor_number)
);

-- Create mastery streaks table
CREATE TABLE IF NOT EXISTS public.mastery_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  global_streak INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create global master titles table
CREATE TABLE IF NOT EXISTS public.global_master_titles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  rooms_mastered INTEGER NOT NULL DEFAULT 0,
  current_title TEXT NOT NULL DEFAULT 'none',
  blue_master_at TIMESTAMPTZ,
  red_master_at TIMESTAMPTZ,
  gold_master_at TIMESTAMPTZ,
  purple_master_at TIMESTAMPTZ,
  white_master_at TIMESTAMPTZ,
  black_master_at TIMESTAMPTZ,
  total_xp INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create microlearning content table
CREATE TABLE IF NOT EXISTS public.microlearning_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id TEXT NOT NULL,
  floor_number INTEGER NOT NULL,
  lesson_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  principle TEXT NOT NULL,
  verse_example TEXT,
  application TEXT,
  reflection_question TEXT,
  estimated_seconds INTEGER NOT NULL DEFAULT 90,
  level_requirement INTEGER NOT NULL DEFAULT 1 CHECK (level_requirement BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(room_id, floor_number, lesson_number)
);

-- Create microlearning progress table
CREATE TABLE IF NOT EXISTS public.microlearning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  content_id UUID NOT NULL REFERENCES public.microlearning_content(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  time_spent_seconds INTEGER,
  user_response TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, content_id)
);

-- Enable RLS
ALTER TABLE public.room_mastery_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mastery_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_master_titles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.microlearning_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.microlearning_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for room_mastery_levels
CREATE POLICY "Users can view their own mastery levels"
  ON public.room_mastery_levels FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mastery levels"
  ON public.room_mastery_levels FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mastery levels"
  ON public.room_mastery_levels FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for mastery_streaks
CREATE POLICY "Users can view their own streaks"
  ON public.mastery_streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own streaks"
  ON public.mastery_streaks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks"
  ON public.mastery_streaks FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for global_master_titles
CREATE POLICY "Users can view all master titles"
  ON public.global_master_titles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own master title"
  ON public.global_master_titles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own master title"
  ON public.global_master_titles FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for microlearning_content
CREATE POLICY "Everyone can view microlearning content"
  ON public.microlearning_content FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage microlearning content"
  ON public.microlearning_content FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for microlearning_progress
CREATE POLICY "Users can view their own progress"
  ON public.microlearning_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON public.microlearning_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.microlearning_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_room_mastery_levels_user_id ON public.room_mastery_levels(user_id);
CREATE INDEX idx_room_mastery_levels_room_id ON public.room_mastery_levels(room_id);
CREATE INDEX idx_mastery_streaks_user_id ON public.mastery_streaks(user_id);
CREATE INDEX idx_global_master_titles_user_id ON public.global_master_titles(user_id);
CREATE INDEX idx_microlearning_content_room ON public.microlearning_content(room_id, floor_number);
CREATE INDEX idx_microlearning_progress_user_id ON public.microlearning_progress(user_id);

-- Create trigger to update updated_at columns
CREATE OR REPLACE FUNCTION update_mastery_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_room_mastery_levels_updated_at
  BEFORE UPDATE ON public.room_mastery_levels
  FOR EACH ROW
  EXECUTE FUNCTION update_mastery_updated_at();

CREATE TRIGGER update_mastery_streaks_updated_at
  BEFORE UPDATE ON public.mastery_streaks
  FOR EACH ROW
  EXECUTE FUNCTION update_mastery_updated_at();

CREATE TRIGGER update_global_master_titles_updated_at
  BEFORE UPDATE ON public.global_master_titles
  FOR EACH ROW
  EXECUTE FUNCTION update_mastery_updated_at();