-- Create bible_study_series table
CREATE TABLE public.bible_study_series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  audience_type TEXT NOT NULL CHECK (audience_type IN ('adults', 'youth', 'mixed', 'new-believers', 'seekers')),
  context TEXT NOT NULL CHECK (context IN ('sabbath-school', 'small-group', 'evangelistic', 'youth-group', 'online')),
  primary_goal TEXT NOT NULL,
  theme_subject TEXT NOT NULL,
  lesson_count INTEGER NOT NULL CHECK (lesson_count BETWEEN 4 AND 12),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_template BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create bible_study_lessons table
CREATE TABLE public.bible_study_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  series_id UUID NOT NULL REFERENCES public.bible_study_series(id) ON DELETE CASCADE,
  lesson_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  big_idea TEXT,
  main_floors TEXT[] DEFAULT ARRAY[]::TEXT[],
  key_rooms TEXT[] DEFAULT ARRAY[]::TEXT[],
  key_passages TEXT,
  core_points TEXT[] DEFAULT ARRAY[]::TEXT[],
  palace_mapping_notes TEXT,
  christ_emphasis TEXT,
  discussion_questions TEXT[] DEFAULT ARRAY[]::TEXT[],
  palace_activity TEXT,
  take_home_challenge TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(series_id, lesson_number)
);

-- Enable RLS on bible_study_series
ALTER TABLE public.bible_study_series ENABLE ROW LEVEL SECURITY;

-- Policies for bible_study_series
CREATE POLICY "Users can view their own series"
  ON public.bible_study_series FOR SELECT
  USING (auth.uid() = user_id OR is_template = true);

CREATE POLICY "Users can create their own series"
  ON public.bible_study_series FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own series"
  ON public.bible_study_series FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own series"
  ON public.bible_study_series FOR DELETE
  USING (auth.uid() = user_id);

-- Enable RLS on bible_study_lessons
ALTER TABLE public.bible_study_lessons ENABLE ROW LEVEL SECURITY;

-- Policies for bible_study_lessons
CREATE POLICY "Users can view lessons from their series or templates"
  ON public.bible_study_lessons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bible_study_series
      WHERE id = series_id
      AND (user_id = auth.uid() OR is_template = true)
    )
  );

CREATE POLICY "Users can create lessons for their series"
  ON public.bible_study_lessons FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bible_study_series
      WHERE id = series_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update lessons in their series"
  ON public.bible_study_lessons FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.bible_study_series
      WHERE id = series_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete lessons from their series"
  ON public.bible_study_lessons FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.bible_study_series
      WHERE id = series_id AND user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX idx_bible_study_series_user_id ON public.bible_study_series(user_id);
CREATE INDEX idx_bible_study_series_is_template ON public.bible_study_series(is_template);
CREATE INDEX idx_bible_study_lessons_series_id ON public.bible_study_lessons(series_id);

-- Create trigger for updated_at on series
CREATE TRIGGER update_bible_study_series_updated_at
  BEFORE UPDATE ON public.bible_study_series
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on lessons
CREATE TRIGGER update_bible_study_lessons_updated_at
  BEFORE UPDATE ON public.bible_study_lessons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();