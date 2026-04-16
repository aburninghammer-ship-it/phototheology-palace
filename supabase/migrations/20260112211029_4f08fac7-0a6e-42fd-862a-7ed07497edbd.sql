-- Fix the trigger to use the correct function and backfill missing trial users

-- First, ensure the trigger uses the correct function
DROP TRIGGER IF EXISTS on_auth_user_subscription_created ON auth.users;
DROP FUNCTION IF EXISTS public.create_user_subscription();

-- Recreate the trigger function with 14-day trial
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_subscriptions (
    user_id,
    subscription_status,
    subscription_tier,
    trial_ends_at
  ) VALUES (
    NEW.id,
    'trial',
    'premium',
    NOW() + INTERVAL '14 days'
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Re-create the trigger
CREATE TRIGGER on_auth_user_subscription_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_subscription();

-- Backfill missing users who signed up recently (last 14 days) with trial status
INSERT INTO public.user_subscriptions (
  user_id,
  subscription_status,
  subscription_tier,
  trial_ends_at
)
SELECT 
  p.id,
  'trial',
  'premium',
  p.created_at + INTERVAL '14 days'
FROM profiles p
LEFT JOIN user_subscriptions us ON us.user_id = p.id
WHERE us.user_id IS NULL
  AND p.created_at >= NOW() - INTERVAL '14 days'
ON CONFLICT (user_id) DO NOTHING;