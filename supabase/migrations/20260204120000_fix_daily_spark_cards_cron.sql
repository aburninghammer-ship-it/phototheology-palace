-- Fix daily spark cards cron job with proper authentication
-- The original cron job used a dynamic service role key which doesn't work

-- Ensure extensions are enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Remove old cron job if it exists
SELECT cron.unschedule('generate-daily-spark-cards');

-- Create new cron job with proper anon key authentication
-- Runs every day at 5:00 AM UTC (midnight EST) to generate 12 new spark cards
SELECT cron.schedule(
  'generate-daily-spark-cards',
  '0 5 * * *',  -- Every day at 5 AM UTC
  $$
  SELECT
    net.http_post(
      url:='https://tdjtumtdkjicnhlpqqzd.supabase.co/functions/v1/generate-daily-cards',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkanR1bXRka2ppY25obHBxcXpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNzIxNzMsImV4cCI6MjA3Njc0ODE3M30.jwQgnjHjz2v2w9-mKVKMy8mT8Q9VgknxFammzW4V9ng"}'::jsonb,
      body:='{"count": 12}'::jsonb
    ) as request_id;
  $$
);

-- Log table to track daily spark card generation
CREATE TABLE IF NOT EXISTS spark_card_generation_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generation_date DATE NOT NULL,
  cards_generated INTEGER NOT NULL DEFAULT 0,
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_spark_generation_date ON spark_card_generation_log(generation_date DESC);

-- Enable RLS
ALTER TABLE spark_card_generation_log ENABLE ROW LEVEL SECURITY;

-- Admins can view logs
CREATE POLICY "Admins can view spark generation logs" ON spark_card_generation_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Service role can insert
CREATE POLICY "Service can insert spark logs" ON spark_card_generation_log
  FOR INSERT WITH CHECK (true);
