-- Create table to track path activity completions
CREATE TABLE IF NOT EXISTS public.path_activity_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  path_id UUID NOT NULL,
  activity_id TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT path_activity_completions_unique UNIQUE (user_id, path_id, activity_id)
);

-- Enable RLS
ALTER TABLE public.path_activity_completions ENABLE ROW LEVEL SECURITY;

-- Users can view their own completions
CREATE POLICY "Users can view own path completions"
ON public.path_activity_completions
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own completions
CREATE POLICY "Users can insert own path completions"
ON public.path_activity_completions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own completions
CREATE POLICY "Users can delete own path completions"
ON public.path_activity_completions
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_path_activity_completions_user_path 
ON public.path_activity_completions(user_id, path_id);