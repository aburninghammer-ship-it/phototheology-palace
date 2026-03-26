-- Fix SMS devotional cron job
-- Re-register to ensure it's active and extensions are enabled

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Remove old job if it exists (safe to call even if not found)
SELECT cron.unschedule('sms-send-devotionals-hourly');

-- Re-register: fires every hour on the hour
SELECT cron.schedule(
  'sms-send-devotionals-hourly',
  '0 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://tdjtumtdkjicnhlpqqzd.supabase.co/functions/v1/sms-send-devotionals',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkanR1bXRka2ppY25obHBxcXpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNzIxNzMsImV4cCI6MjA3Njc0ODE3M30.jwQgnjHjz2v2w9-mKVKMy8mT8Q9VgknxFammzW4V9ng'
    ),
    body := '{}'::jsonb
  );
  $$
);
