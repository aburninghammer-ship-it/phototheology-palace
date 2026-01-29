-- Create function to expire stale trials
CREATE OR REPLACE FUNCTION public.expire_stale_trials()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update user_subscriptions table
  UPDATE public.user_subscriptions
  SET subscription_status = 'expired'
  WHERE subscription_status = 'trial'
    AND trial_ends_at IS NOT NULL
    AND trial_ends_at < NOW();
    
  -- Also update profiles table to stay in sync
  UPDATE public.profiles
  SET subscription_status = 'expired'
  WHERE subscription_status = 'trial'
    AND id IN (
      SELECT user_id FROM public.user_subscriptions
      WHERE subscription_status = 'expired'
        AND trial_ends_at IS NOT NULL
        AND trial_ends_at < NOW()
    );
END;
$$;

-- Schedule the job to run daily at midnight UTC
SELECT cron.schedule(
  'expire-stale-trials',
  '0 0 * * *',
  $$SELECT public.expire_stale_trials()$$
);