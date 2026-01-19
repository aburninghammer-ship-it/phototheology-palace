-- Create a pg_cron job to automatically record analytics snapshot daily at 6 AM UTC
SELECT cron.schedule(
  'daily-analytics-snapshot',
  '0 6 * * *',
  $$
  SELECT net.http_post(
    url := current_setting('app.supabase_functions_url') || '/record-analytics-snapshot',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key')
    ),
    body := '{}'::jsonb
  );
  $$
);