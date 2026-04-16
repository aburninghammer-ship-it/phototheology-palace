-- Study responses: insights, questions, testimonies, suggestions
CREATE TABLE IF NOT EXISTS public.study_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  study_id UUID NOT NULL,
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL,
  avatar_url TEXT,
  response_type TEXT NOT NULL,
  content TEXT NOT NULL,
  suggestion_action TEXT,
  suggestion_target TEXT,
  parent_id UUID,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Quick reactions on study content and responses
CREATE TABLE IF NOT EXISTS public.study_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  study_id UUID NOT NULL,
  user_id UUID NOT NULL,
  target_type TEXT NOT NULL,
  target_index INTEGER,
  target_id UUID,
  reaction TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(study_id, user_id, target_type, target_index, target_id, reaction)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_study_responses_study_id ON public.study_responses(study_id);
CREATE INDEX IF NOT EXISTS idx_study_responses_parent_id ON public.study_responses(parent_id);
CREATE INDEX IF NOT EXISTS idx_study_reactions_study_id ON public.study_reactions(study_id);
CREATE INDEX IF NOT EXISTS idx_study_reactions_target ON public.study_reactions(study_id, target_type, target_index);

-- RLS
ALTER TABLE public.study_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_reactions ENABLE ROW LEVEL SECURITY;

-- study_responses policies
CREATE POLICY "Anyone can read study responses"
  ON public.study_responses FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert own responses"
  ON public.study_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own responses"
  ON public.study_responses FOR DELETE
  USING (auth.uid() = user_id);

-- study_reactions policies
CREATE POLICY "Anyone can read study reactions"
  ON public.study_reactions FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert own reactions"
  ON public.study_reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reactions"
  ON public.study_reactions FOR DELETE
  USING (auth.uid() = user_id);
