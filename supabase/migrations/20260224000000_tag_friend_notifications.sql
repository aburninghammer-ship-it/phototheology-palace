-- Tag Friend / User Notifications System
-- Allows users to notify/tag friends to check out specific pages

-- User notifications table for in-app friend tagging
CREATE TABLE IF NOT EXISTS public.user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Who sent the notification
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Who receives the notification
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Notification content
  notification_type TEXT NOT NULL DEFAULT 'page_tag', -- 'page_tag', 'message', 'mention', etc.
  title TEXT NOT NULL,
  message TEXT,

  -- Page information
  page_url TEXT NOT NULL,
  page_title TEXT,
  page_description TEXT,

  -- Metadata
  data JSONB DEFAULT '{}'::jsonb,

  -- Status
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_notifications_recipient
  ON public.user_notifications(recipient_id, read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_notifications_sender
  ON public.user_notifications(sender_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_notifications_type
  ON public.user_notifications(notification_type);

-- Enable RLS
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

-- Users can view notifications sent to them
CREATE POLICY "Users can view their notifications"
  ON public.user_notifications FOR SELECT
  USING (recipient_id = auth.uid());

-- Users can view notifications they sent
CREATE POLICY "Users can view sent notifications"
  ON public.user_notifications FOR SELECT
  USING (sender_id = auth.uid());

-- Users can create notifications (tag friends)
CREATE POLICY "Users can create notifications"
  ON public.user_notifications FOR INSERT
  WITH CHECK (sender_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their notifications"
  ON public.user_notifications FOR UPDATE
  USING (recipient_id = auth.uid());

-- Users can delete notifications sent to them
CREATE POLICY "Users can delete their notifications"
  ON public.user_notifications FOR DELETE
  USING (recipient_id = auth.uid());

-- Function to get unread notification count
CREATE OR REPLACE FUNCTION public.get_unread_notification_count()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM public.user_notifications
    WHERE recipient_id = auth.uid() AND read = false
  );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_unread_notification_count() TO authenticated;
