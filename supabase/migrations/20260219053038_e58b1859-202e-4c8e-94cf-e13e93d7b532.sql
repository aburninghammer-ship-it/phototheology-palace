
-- Fix the handle_new_user trigger to handle null timestamps properly
-- The issue is that raw_user_meta_data values are being passed as the string "null"
-- instead of proper SQL NULL values

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_display_name text;
  v_subscription_tier text;
  v_trial_end timestamptz;
  v_raw_meta jsonb;
BEGIN
  v_raw_meta := COALESCE(new.raw_user_meta_data, '{}'::jsonb);

  -- Extract display name safely
  v_display_name := COALESCE(
    NULLIF(TRIM(v_raw_meta->>'full_name'), ''),
    NULLIF(TRIM(v_raw_meta->>'name'), ''),
    NULLIF(TRIM(v_raw_meta->>'display_name'), ''),
    SPLIT_PART(new.email, '@', 1)
  );

  -- Extract subscription tier safely, mapping non-standard values
  v_subscription_tier := COALESCE(
    NULLIF(TRIM(v_raw_meta->>'subscription_tier'), ''),
    'free'
  );
  -- Map non-standard tiers to valid ones
  IF v_subscription_tier NOT IN ('free', 'essential', 'premium', 'student', 'church', 'lifetime') THEN
    v_subscription_tier := 'free';
  END IF;

  -- Extract trial_ends_at safely - handle string "null" and invalid timestamps
  BEGIN
    v_trial_end := (v_raw_meta->>'trial_ends_at')::timestamptz;
  EXCEPTION WHEN OTHERS THEN
    v_trial_end := NULL;
  END;

  -- If no valid trial_ends_at provided, set default 7-day trial for new free users
  IF v_trial_end IS NULL AND v_subscription_tier = 'free' THEN
    v_trial_end := NOW() + INTERVAL '7 days';
  END IF;

  INSERT INTO public.profiles (
    id,
    display_name,
    email,
    subscription_tier,
    subscription_status,
    trial_ends_at,
    created_at,
    updated_at
  ) VALUES (
    new.id,
    v_display_name,
    new.email,
    v_subscription_tier,
    CASE 
      WHEN v_subscription_tier IN ('premium', 'church', 'lifetime') THEN 'active'
      WHEN v_subscription_tier = 'free' THEN 'trial'
      ELSE 'trial'
    END,
    v_trial_end,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    display_name = COALESCE(EXCLUDED.display_name, profiles.display_name),
    email = COALESCE(EXCLUDED.email, profiles.email),
    updated_at = NOW();

  RETURN new;
END;
$$;
