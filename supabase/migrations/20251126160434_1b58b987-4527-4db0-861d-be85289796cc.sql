-- Create table for saved deck studies
CREATE TABLE IF NOT EXISTS public.deck_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  verse_text text NOT NULL,
  verse_reference text,
  cards_used jsonb NOT NULL DEFAULT '[]',
  conversation_history jsonb NOT NULL DEFAULT '[]',
  is_gem boolean DEFAULT false,
  gem_title text,
  gem_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.deck_studies ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own deck studies"
  ON public.deck_studies
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own deck studies"
  ON public.deck_studies
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own deck studies"
  ON public.deck_studies
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own deck studies"
  ON public.deck_studies
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_deck_studies_user_id ON public.deck_studies(user_id);
CREATE INDEX idx_deck_studies_is_gem ON public.deck_studies(is_gem) WHERE is_gem = true;