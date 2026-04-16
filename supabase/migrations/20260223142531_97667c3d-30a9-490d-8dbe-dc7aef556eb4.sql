
-- Update the trigger function to set 30-day trial instead of 7-day
CREATE OR REPLACE FUNCTION public.create_user_subscription()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_trial_end TIMESTAMPTZ;
  v_subscription_tier TEXT;
BEGIN
  -- Check if trial_ends_at is provided (e.g., from special access codes)
  v_trial_end := NEW.trial_ends_at;
  v_subscription_tier := COALESCE(NEW.subscription_tier, 'free');

  -- If no valid trial_ends_at provided, set default 30-day trial for new free users
  IF v_trial_end IS NULL AND v_subscription_tier = 'free' THEN
    v_trial_end := NOW() + INTERVAL '30 days';
  END IF;

  INSERT INTO public.user_subscriptions (
    user_id,
    subscription_tier,
    created_at,
    trial_ends_at,
    subscription_status
  ) VALUES (
    NEW.id,
    'premium',
    NOW(),
    v_trial_end,
    'trial'
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;
