-- Enable RLS on email_send_log table
ALTER TABLE public.email_send_log ENABLE ROW LEVEL SECURITY;

-- Users can only view their own email logs
CREATE POLICY "Users can view their own email logs"
ON public.email_send_log
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own email logs
CREATE POLICY "Users can insert their own email logs"
ON public.email_send_log
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all email logs
CREATE POLICY "Admins can view all email logs"
ON public.email_send_log
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);