-- Daily Generated Spark Cards
-- Stores AI-generated spark cards that are added automatically each day

CREATE TABLE IF NOT EXISTS generated_spark_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  verse_anchors TEXT[] NOT NULL,
  palace_rooms JSONB NOT NULL, -- Array of {id, name, icon}
  prompts JSONB NOT NULL, -- {observe, connect, discover}
  category TEXT NOT NULL CHECK (category IN ('sanctuary', 'types', 'cycles', 'patterns', 'prophecy', 'elements')),
  tags TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  generation_date DATE DEFAULT CURRENT_DATE, -- Which day this was generated
  is_active BOOLEAN DEFAULT true, -- Can be hidden if needed
  quality_score INTEGER DEFAULT 0, -- For future rating/sorting
  view_count INTEGER DEFAULT 0 -- Track popularity
);

-- Index for efficient date-based queries
CREATE INDEX IF NOT EXISTS idx_spark_cards_date ON generated_spark_cards (generation_date DESC);
CREATE INDEX IF NOT EXISTS idx_spark_cards_category ON generated_spark_cards (category);
CREATE INDEX IF NOT EXISTS idx_spark_cards_active ON generated_spark_cards (is_active) WHERE is_active = true;

-- Enable RLS but allow public read access
ALTER TABLE generated_spark_cards ENABLE ROW LEVEL SECURITY;

-- Anyone can read active cards
CREATE POLICY "Public can read active cards" ON generated_spark_cards
  FOR SELECT USING (is_active = true);

-- Only service role can insert/update (for edge function)
CREATE POLICY "Service role can manage cards" ON generated_spark_cards
  FOR ALL USING (auth.role() = 'service_role');

-- Function to get cards for a specific date range
CREATE OR REPLACE FUNCTION get_recent_spark_cards(days_back INTEGER DEFAULT 30)
RETURNS SETOF generated_spark_cards
LANGUAGE sql
STABLE
AS $$
  SELECT * FROM generated_spark_cards
  WHERE is_active = true
    AND generation_date >= CURRENT_DATE - days_back
  ORDER BY generation_date DESC, created_at DESC;
$$;

-- Cron job to generate daily cards (runs at midnight UTC)
-- This creates the cron schedule - the actual function is called via Edge Function
SELECT cron.schedule(
  'generate-daily-spark-cards',
  '0 0 * * *', -- Every day at midnight UTC
  $$
  SELECT net.http_post(
    url := 'https://tdjtumtdkjicnhlpqqzd.supabase.co/functions/v1/generate-daily-cards',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := jsonb_build_object('count', 12)
  );
  $$
);
