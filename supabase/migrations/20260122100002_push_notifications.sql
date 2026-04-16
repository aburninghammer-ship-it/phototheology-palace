-- Push Notifications System
-- Adds push token and notification preferences to profiles
-- Creates logging table for sent notifications

-- Add push notification columns to profiles if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'push_token'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN push_token TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'notification_preferences'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN notification_preferences JSONB DEFAULT '{
      "enabled": true,
      "events": true,
      "messages": true,
      "announcements": true,
      "study_reminders": true,
      "prayer_requests": true
    }'::jsonb;
  END IF;
END $$;

-- Push notification logs table for tracking
CREATE TABLE IF NOT EXISTS public.push_notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Target users
  user_ids UUID[] NOT NULL,
  
  -- Notification content
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB,
  
  -- Metadata
  notification_type TEXT,
  sent_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  
  -- Church context (optional)
  church_id UUID REFERENCES public.churches(id),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for querying logs
CREATE INDEX IF NOT EXISTS idx_push_notification_logs_created_at 
  ON public.push_notification_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_push_notification_logs_church_id 
  ON public.push_notification_logs(church_id);

-- Enable RLS
ALTER TABLE public.push_notification_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view notification logs
CREATE POLICY "Admins can view notification logs"
  ON public.push_notification_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    ) OR
    -- Church leaders can view their church's logs
    (church_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = push_notification_logs.church_id
        AND user_id = auth.uid()
        AND role IN ('admin', 'leader', 'pastor')
    ))
  );

-- Service role can insert logs
CREATE POLICY "Service role can insert logs"
  ON public.push_notification_logs FOR INSERT
  WITH CHECK (true);
