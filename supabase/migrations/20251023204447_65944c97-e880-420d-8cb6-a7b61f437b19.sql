-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule monthly game generation on the 1st of each month at midnight
SELECT cron.schedule(
  'generate-monthly-games',
  '0 0 1 * *', -- At 00:00 on day 1 of every month
  $$
  SELECT
    net.http_post(
        url:='https://tdjtumtdkjicnhlpqqzd.supabase.co/functions/v1/generate-monthly-games',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkanR1bXRka2ppY25obHBxcXpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNzIxNzMsImV4cCI6MjA3Njc0ODE3M30.jwQgnjHjz2v2w9-mKVKMy8mT8Q9VgknxFammzW4V9ng"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);