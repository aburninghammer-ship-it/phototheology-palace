
-- Create generated_spark_cards table
CREATE TABLE public.generated_spark_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  verse_anchors TEXT[] NOT NULL DEFAULT '{}',
  palace_rooms JSONB NOT NULL DEFAULT '[]',
  prompts JSONB NOT NULL DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'patterns',
  tags TEXT[] NOT NULL DEFAULT '{}',
  generation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  view_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for efficient date-based lookups
CREATE INDEX idx_generated_spark_cards_date ON public.generated_spark_cards (generation_date DESC);
CREATE INDEX idx_generated_spark_cards_active ON public.generated_spark_cards (is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE public.generated_spark_cards ENABLE ROW LEVEL SECURITY;

-- Public read policy (spark cards are visible to everyone)
CREATE POLICY "Anyone can view active spark cards"
  ON public.generated_spark_cards
  FOR SELECT
  USING (is_active = true);

-- Allow edge functions (service role) to insert
CREATE POLICY "Service role can insert spark cards"
  ON public.generated_spark_cards
  FOR INSERT
  WITH CHECK (true);

-- Allow service role to update
CREATE POLICY "Service role can update spark cards"
  ON public.generated_spark_cards
  FOR UPDATE
  USING (true);

-- View count increment function
CREATE OR REPLACE FUNCTION public.increment_spark_card_view(card_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.generated_spark_cards
  SET view_count = view_count + 1
  WHERE id = card_id;
END;
$$;

-- Enable pg_cron and pg_net for scheduled generation
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
