-- Add cron job to generate devotional days hourly
-- This catches any plans that are behind schedule
SELECT cron.schedule(
  'generate-devotional-days-hourly',
  '0 * * * *', -- Every hour
  $$
  SELECT net.http_post(
    url := 'https://tdjtumtdkjicnhlpqqzd.supabase.co/functions/v1/batch-generate-devotional-days',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkanR1bXRka2ppY25obHBxcXpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNzIxNzMsImV4cCI6MjA3Njc0ODE3M30.jwQgnjHjz2v2w9-mKVKMy8mT8Q9VgknxFammzW4V9ng"}'::jsonb,
    body := '{"maxPlans": 20, "maxDaysPerPlan": 3}'::jsonb
  ) AS request_id;
  $$
);