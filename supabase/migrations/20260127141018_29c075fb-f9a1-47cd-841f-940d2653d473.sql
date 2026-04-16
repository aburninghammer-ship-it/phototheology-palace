-- Update the handle_new_user_subscription trigger to NOT auto-create trials
-- Users must go through Stripe checkout OR have Patreon/Pickaxe/Teachable access

CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Create a pending subscription record (not a trial)
  -- User must complete Stripe checkout OR have external membership (Patreon/Pickaxe/Teachable)
  INSERT INTO public.user_subscriptions (
    user_id,
    subscription_status,
    subscription_tier,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    'pending',  -- Changed from 'trial' to 'pending'
    'free',     -- Changed from 'essential' to 'free'
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;