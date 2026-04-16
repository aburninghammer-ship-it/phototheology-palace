
-- Create user_study_threads table
CREATE TABLE public.user_study_threads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  visibility TEXT NOT NULL DEFAULT 'private',
  is_public BOOLEAN NOT NULL DEFAULT false,
  entry_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_study_entries table
CREATE TABLE public.user_study_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id UUID NOT NULL REFERENCES public.user_study_threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  entry_type TEXT NOT NULL DEFAULT 'note',
  verse_reference TEXT,
  likes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_study_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_study_entries ENABLE ROW LEVEL SECURITY;

-- RLS for user_study_threads
CREATE POLICY "Users can view own threads" ON public.user_study_threads
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view public threads" ON public.user_study_threads
  FOR SELECT USING (is_public = true OR visibility = 'public');

CREATE POLICY "Users can insert own threads" ON public.user_study_threads
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own threads" ON public.user_study_threads
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own threads" ON public.user_study_threads
  FOR DELETE USING (user_id = auth.uid());

-- RLS for user_study_entries
CREATE POLICY "Users can view entries in accessible threads" ON public.user_study_entries
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.user_study_threads t
      WHERE t.id = thread_id AND (t.is_public = true OR t.visibility = 'public')
    )
  );

CREATE POLICY "Users can insert own entries" ON public.user_study_entries
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own entries" ON public.user_study_entries
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own entries" ON public.user_study_entries
  FOR DELETE USING (user_id = auth.uid());
