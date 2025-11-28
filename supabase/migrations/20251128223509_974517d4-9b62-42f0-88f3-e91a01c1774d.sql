-- Verse highlights table for colored highlighting
CREATE TABLE public.verse_highlights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  color TEXT NOT NULL DEFAULT 'yellow',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, book, chapter, verse)
);

-- Verse notes table for personal notes
CREATE TABLE public.verse_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Reading streaks for gamification
CREATE TABLE public.reading_streaks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_read_date DATE,
  total_chapters_read INTEGER NOT NULL DEFAULT 0,
  total_verses_read INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Daily reading log for streak tracking
CREATE TABLE public.daily_reading_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  read_date DATE NOT NULL DEFAULT CURRENT_DATE,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verses_read INTEGER NOT NULL DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, read_date, book, chapter)
);

-- Enable RLS
ALTER TABLE public.verse_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verse_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_reading_log ENABLE ROW LEVEL SECURITY;

-- RLS policies for verse_highlights
CREATE POLICY "Users can view their own highlights" ON public.verse_highlights
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own highlights" ON public.verse_highlights
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own highlights" ON public.verse_highlights
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own highlights" ON public.verse_highlights
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for verse_notes
CREATE POLICY "Users can view their own notes" ON public.verse_notes
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own notes" ON public.verse_notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own notes" ON public.verse_notes
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own notes" ON public.verse_notes
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for reading_streaks
CREATE POLICY "Users can view their own streaks" ON public.reading_streaks
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own streaks" ON public.reading_streaks
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own streaks" ON public.reading_streaks
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for daily_reading_log
CREATE POLICY "Users can view their own reading log" ON public.daily_reading_log
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own reading log" ON public.daily_reading_log
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reading log" ON public.daily_reading_log
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to update reading streak
CREATE OR REPLACE FUNCTION public.update_reading_streak()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_streak RECORD;
  v_days_diff INTEGER;
BEGIN
  -- Get or create streak record
  INSERT INTO reading_streaks (user_id)
  VALUES (NEW.user_id)
  ON CONFLICT (user_id) DO NOTHING;
  
  SELECT * INTO v_streak
  FROM reading_streaks
  WHERE user_id = NEW.user_id
  FOR UPDATE;
  
  -- Calculate days difference
  IF v_streak.last_read_date IS NULL THEN
    v_days_diff := 999;
  ELSE
    v_days_diff := NEW.read_date - v_streak.last_read_date;
  END IF;
  
  -- Update streak logic
  IF v_days_diff = 0 THEN
    -- Same day, just update counts
    UPDATE reading_streaks
    SET 
      total_chapters_read = total_chapters_read + 1,
      total_verses_read = total_verses_read + NEW.verses_read,
      updated_at = now()
    WHERE user_id = NEW.user_id;
  ELSIF v_days_diff = 1 THEN
    -- Consecutive day, increment streak
    UPDATE reading_streaks
    SET 
      current_streak = current_streak + 1,
      longest_streak = GREATEST(longest_streak, current_streak + 1),
      last_read_date = NEW.read_date,
      total_chapters_read = total_chapters_read + 1,
      total_verses_read = total_verses_read + NEW.verses_read,
      updated_at = now()
    WHERE user_id = NEW.user_id;
  ELSE
    -- Streak broken, reset to 1
    UPDATE reading_streaks
    SET 
      current_streak = 1,
      last_read_date = NEW.read_date,
      total_chapters_read = total_chapters_read + 1,
      total_verses_read = total_verses_read + NEW.verses_read,
      updated_at = now()
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger for streak updates
CREATE TRIGGER update_streak_on_reading
  AFTER INSERT ON public.daily_reading_log
  FOR EACH ROW
  EXECUTE FUNCTION public.update_reading_streak();

-- Indexes for performance
CREATE INDEX idx_verse_highlights_user_book ON public.verse_highlights(user_id, book, chapter);
CREATE INDEX idx_verse_notes_user_book ON public.verse_notes(user_id, book, chapter);
CREATE INDEX idx_daily_reading_log_user_date ON public.daily_reading_log(user_id, read_date);