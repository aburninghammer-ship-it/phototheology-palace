-- ============================================
-- EMAIL CAMPAIGN AUTOMATION CRON JOBS
-- ============================================
-- This migration sets up automated email campaigns:
-- 1. Daily email orchestrator for signed-up users (onboarding + habit sequences)
-- 2. Weekly outreach to Patreon, Teachable, and Pickaxe users who haven't signed up

-- Ensure pg_cron and pg_net extensions are enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- ============================================
-- 1. DAILY EMAIL ORCHESTRATOR
-- Runs every day at 7:00 AM UTC
-- Sends onboarding emails (days 0-7) and habit emails (days 1-14)
-- to users who have signed up and are in an active sequence
-- ============================================
SELECT cron.schedule(
  'daily-email-orchestrator',
  '0 7 * * *',  -- Every day at 7 AM UTC
  $$
  SELECT
    net.http_post(
      url:='https://tdjtumtdkjicnhlpqqzd.supabase.co/functions/v1/daily-email-orchestrator',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkanR1bXRka2ppY25obHBxcXpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNzIxNzMsImV4cCI6MjA3Njc0ODE3M30.jwQgnjHjz2v2w9-mKVKMy8mT8Q9VgknxFammzW4V9ng"}'::jsonb,
      body:='{}'::jsonb
    ) as request_id;
  $$
);

-- ============================================
-- 2. WEEKLY AUTOMATED OUTREACH
-- Runs every Monday at 10:00 AM UTC
-- Sends outreach emails to Patreon, Teachable, and Pickaxe users
-- who haven't signed up for the app yet
-- (Only sends to users who haven't received an outreach email in the last 30 days)
-- ============================================
SELECT cron.schedule(
  'weekly-automated-outreach',
  '0 10 * * 1',  -- Every Monday at 10 AM UTC
  $$
  SELECT
    net.http_post(
      url:='https://tdjtumtdkjicnhlpqqzd.supabase.co/functions/v1/automated-outreach',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkanR1bXRka2ppY25obHBxcXpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNzIxNzMsImV4cCI6MjA3Njc0ODE3M30.jwQgnjHjz2v2w9-mKVKMy8mT8Q9VgknxFammzW4V9ng"}'::jsonb,
      body:='{}'::jsonb
    ) as request_id;
  $$
);

-- ============================================
-- Ensure email_campaign_logs table exists for tracking
-- ============================================
CREATE TABLE IF NOT EXISTS email_campaign_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  email_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_email_campaign_logs_lookup
  ON email_campaign_logs(recipient_email, campaign_name, sent_at);

-- Enable RLS
ALTER TABLE email_campaign_logs ENABLE ROW LEVEL SECURITY;

-- Admin can view all logs
CREATE POLICY "Admins can view email campaign logs" ON email_campaign_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Service role can insert (for edge functions)
CREATE POLICY "Service can insert email logs" ON email_campaign_logs
  FOR INSERT WITH CHECK (true);

-- ============================================
-- Ensure email_sequence_progress table exists for daily orchestrator
-- ============================================
CREATE TABLE IF NOT EXISTS email_sequence_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sequence_type TEXT NOT NULL, -- 'onboarding' or 'habit'
  current_day INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  last_email_sent_at TIMESTAMP WITH TIME ZONE,
  next_email_due_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, sequence_type)
);

-- Add index for efficient cron queries
CREATE INDEX IF NOT EXISTS idx_email_sequence_due
  ON email_sequence_progress(is_active, is_completed, next_email_due_at);

-- Enable RLS
ALTER TABLE email_sequence_progress ENABLE ROW LEVEL SECURITY;

-- Users can view their own progress
CREATE POLICY "Users can view own sequence progress" ON email_sequence_progress
  FOR SELECT USING (auth.uid() = user_id);

-- Service role can manage sequences
CREATE POLICY "Service can manage sequences" ON email_sequence_progress
  FOR ALL USING (true);

-- ============================================
-- Ensure email_send_log table exists for tracking individual sends
-- ============================================
CREATE TABLE IF NOT EXISTS email_send_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  sequence_type TEXT,
  day_number INTEGER,
  email_subject TEXT,
  status TEXT NOT NULL,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_send_log_user ON email_send_log(user_id, created_at);

-- Enable RLS
ALTER TABLE email_send_log ENABLE ROW LEVEL SECURITY;

-- Admins can view logs
CREATE POLICY "Admins can view email send logs" ON email_send_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- Function to start email sequence for new users
-- Called automatically when a new user signs up
-- ============================================
CREATE OR REPLACE FUNCTION start_user_email_sequences()
RETURNS TRIGGER AS $$
BEGIN
  -- Start onboarding sequence
  INSERT INTO email_sequence_progress (user_id, sequence_type, current_day, next_email_due_at)
  VALUES (NEW.id, 'onboarding', 0, NOW())
  ON CONFLICT (user_id, sequence_type) DO NOTHING;

  -- Start habit sequence (starts after a delay)
  INSERT INTO email_sequence_progress (user_id, sequence_type, current_day, next_email_due_at)
  VALUES (NEW.id, 'habit', 1, NOW() + INTERVAL '1 day')
  ON CONFLICT (user_id, sequence_type) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on profiles table (created when user signs up)
DROP TRIGGER IF EXISTS trigger_start_email_sequences ON profiles;
CREATE TRIGGER trigger_start_email_sequences
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION start_user_email_sequences();

-- ============================================
-- Summary of what this migration creates:
-- ============================================
-- CRON JOBS:
--   1. daily-email-orchestrator: Runs daily at 7 AM UTC
--      - Sends onboarding emails to new users (days 0-7)
--      - Sends habit-building emails (days 1-14)
--
--   2. weekly-automated-outreach: Runs Mondays at 10 AM UTC
--      - Emails Patreon members who haven't signed up
--      - Emails Teachable students who haven't signed up
--      - Emails Pickaxe users who haven't signed up
--      - Respects 30-day cooldown (won't re-email within 30 days)
--
-- TABLES:
--   - email_campaign_logs: Tracks all outreach emails sent
--   - email_sequence_progress: Tracks user progress in email sequences
--   - email_send_log: Logs individual email sends
--
-- TRIGGERS:
--   - Automatically starts email sequences when new user signs up
