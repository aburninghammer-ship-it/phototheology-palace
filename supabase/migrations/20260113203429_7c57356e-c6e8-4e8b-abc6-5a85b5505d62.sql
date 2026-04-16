-- Update the trigger function to set 7-day trial instead of 14-day
CREATE OR REPLACE FUNCTION public.create_user_subscription()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.user_subscriptions (
    user_id,
    subscription_status,
    subscription_tier,
    created_at,
    trial_ends_at
  )
  VALUES (
    NEW.id,
    'trial',
    'premium',
    NOW(),
    NOW() + INTERVAL '7 days'
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;