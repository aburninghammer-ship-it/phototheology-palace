
-- Track which church notification emails have been sent
CREATE TABLE IF NOT EXISTS public.church_email_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id uuid REFERENCES public.churches(id) ON DELETE CASCADE NOT NULL,
  recipient_user_id uuid NOT NULL,
  recipient_email text NOT NULL,
  notification_type text NOT NULL, -- 'announcement', 'event', 'community_post'
  reference_id uuid, -- ID of the announcement/event/post
  subject text NOT NULL,
  sent_at timestamptz DEFAULT now(),
  status text DEFAULT 'sent'
);

ALTER TABLE public.church_email_log ENABLE ROW LEVEL SECURITY;

-- Only admins of the church can view the log
CREATE POLICY "Church admins can view email logs"
  ON public.church_email_log FOR SELECT
  TO authenticated
  USING (public.is_church_admin(auth.uid(), church_id));

-- Service role inserts (edge function)
CREATE POLICY "Service role can insert email logs"
  ON public.church_email_log FOR INSERT
  TO authenticated
  WITH CHECK (false);
