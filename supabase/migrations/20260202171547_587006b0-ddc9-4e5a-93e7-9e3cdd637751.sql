-- Create profile_devotions table for storing devotions generated for devotional profiles
CREATE TABLE public.profile_devotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.devotional_profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  scripture_reference TEXT NOT NULL,
  scripture_text TEXT NOT NULL,
  devotional_body TEXT NOT NULL,
  strike_line TEXT,
  prayer TEXT,
  memory_hook TEXT,
  sanctuary_connection TEXT,
  cycle_placement TEXT,
  types_and_symbols TEXT[],
  cross_references TEXT[],
  christ_name TEXT,
  christ_action TEXT,
  application TEXT,
  theme_used TEXT,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_shared BOOLEAN NOT NULL DEFAULT false,
  shared_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.profile_devotions ENABLE ROW LEVEL SECURITY;

-- Users can view their own devotions
CREATE POLICY "Users can view own profile devotions"
ON public.profile_devotions
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own devotions
CREATE POLICY "Users can insert own profile devotions"
ON public.profile_devotions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own devotions
CREATE POLICY "Users can update own profile devotions"
ON public.profile_devotions
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own devotions
CREATE POLICY "Users can delete own profile devotions"
ON public.profile_devotions
FOR DELETE
USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX idx_profile_devotions_profile_id ON public.profile_devotions(profile_id);
CREATE INDEX idx_profile_devotions_user_id ON public.profile_devotions(user_id);
CREATE INDEX idx_profile_devotions_created_at ON public.profile_devotions(created_at DESC);