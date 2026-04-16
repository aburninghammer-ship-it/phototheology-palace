-- Create table for tracking user progress on study paths
CREATE TABLE public.user_study_path_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  path_id TEXT NOT NULL,
  current_card_index INTEGER NOT NULL DEFAULT 0,
  completed_cards TEXT[] NOT NULL DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, path_id)
);

-- Enable RLS
ALTER TABLE public.user_study_path_progress ENABLE ROW LEVEL SECURITY;

-- Users can view their own progress
CREATE POLICY "Users can view own study path progress"
  ON public.user_study_path_progress
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own progress
CREATE POLICY "Users can create own study path progress"
  ON public.user_study_path_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update own study path progress"
  ON public.user_study_path_progress
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own progress
CREATE POLICY "Users can delete own study path progress"
  ON public.user_study_path_progress
  FOR DELETE
  USING (auth.uid() = user_id);

-- Index for faster lookups
CREATE INDEX idx_user_study_path_progress_user_id ON public.user_study_path_progress(user_id);
CREATE INDEX idx_user_study_path_progress_path_id ON public.user_study_path_progress(path_id);