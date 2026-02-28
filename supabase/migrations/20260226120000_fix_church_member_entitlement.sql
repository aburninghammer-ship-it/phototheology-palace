-- Fix church member entitlement: remove church subscription gate,
-- re-add church preapproval auto-link in handle_new_user,
-- and repair existing members/unclaimed preapprovals.

-- ============================================================
-- 1a. Fix has_church_access() — always grant access if user is
--     in church_members, regardless of church subscription_status
-- ============================================================
CREATE OR REPLACE FUNCTION public.has_church_access(_user_id UUID)
RETURNS TABLE (
  has_access BOOLEAN,
  church_id UUID,
  church_tier TEXT,
  role TEXT
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    true AS has_access,
    c.id AS church_id,
    c.tier::TEXT AS church_tier,
    cm.role::TEXT AS role
  FROM public.church_members cm
  JOIN public.churches c ON c.id = cm.church_id
  WHERE cm.user_id = _user_id
  LIMIT 1
$$;

-- ============================================================
-- 1b. Fix handle_new_user() — re-add church preapproval auto-link
--     (lost in migration 20260220175130) WITHOUT any
--     c.subscription_status = 'active' condition.
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_display_name text;
  v_subscription_tier text;
  v_trial_end timestamptz;
  v_raw_meta jsonb;
  v_trial_str text;
  v_username text;
  v_preapproval RECORD;
  v_church_linked boolean := false;
BEGIN
  v_raw_meta := COALESCE(new.raw_user_meta_data, '{}'::jsonb);

  -- Extract display name safely
  v_display_name := COALESCE(
    NULLIF(TRIM(v_raw_meta->>'full_name'), ''),
    NULLIF(TRIM(v_raw_meta->>'name'), ''),
    NULLIF(TRIM(v_raw_meta->>'display_name'), ''),
    SPLIT_PART(new.email, '@', 1)
  );

  -- Generate a username from display name or email
  v_username := COALESCE(
    NULLIF(TRIM(LOWER(REGEXP_REPLACE(v_raw_meta->>'username', '[^a-zA-Z0-9_]', '', 'g'))), ''),
    LOWER(REGEXP_REPLACE(SPLIT_PART(new.email, '@', 1), '[^a-zA-Z0-9_]', '', 'g')) || '_' || SUBSTRING(new.id::text, 1, 6)
  );

  -- Extract subscription tier safely, mapping non-standard values
  v_subscription_tier := COALESCE(
    NULLIF(TRIM(v_raw_meta->>'subscription_tier'), ''),
    'free'
  );
  IF v_subscription_tier NOT IN ('free', 'essential', 'premium', 'student', 'church', 'lifetime') THEN
    v_subscription_tier := 'free';
  END IF;

  -- Extract trial_ends_at safely
  v_trial_str := v_raw_meta->>'trial_ends_at';

  IF v_trial_str IS NULL OR v_trial_str = '' OR v_trial_str = 'null' OR v_trial_str = 'NULL' THEN
    v_trial_end := NULL;
  ELSE
    BEGIN
      v_trial_end := v_trial_str::timestamptz;
    EXCEPTION WHEN OTHERS THEN
      v_trial_end := NULL;
    END;
  END IF;

  -- If no valid trial_ends_at provided, set default 7-day trial for new free users
  IF v_trial_end IS NULL AND v_subscription_tier = 'free' THEN
    v_trial_end := NOW() + INTERVAL '7 days';
  END IF;

  -- ---- Church preapproval auto-link ----
  -- Check if this email is preapproved for any church (no subscription_status check)
  FOR v_preapproval IN
    SELECT pa.id AS preapproval_id, pa.church_id, pa.role
    FROM public.church_preapproved_members pa
    WHERE LOWER(pa.email) = LOWER(new.email)
      AND pa.claimed_at IS NULL
  LOOP
    -- Insert into church_members if not already there
    INSERT INTO public.church_members (church_id, user_id, role)
    VALUES (v_preapproval.church_id, new.id, v_preapproval.role)
    ON CONFLICT (church_id, user_id) DO NOTHING;

    -- Mark preapproval as claimed
    UPDATE public.church_preapproved_members
    SET claimed_at = NOW()
    WHERE id = v_preapproval.preapproval_id;

    v_church_linked := true;
  END LOOP;

  -- If user was linked to a church, override tier/status
  IF v_church_linked THEN
    v_subscription_tier := 'premium';
  END IF;

  INSERT INTO public.profiles (
    id,
    username,
    display_name,
    email,
    subscription_tier,
    subscription_status,
    payment_source,
    trial_ends_at,
    created_at,
    updated_at
  ) VALUES (
    new.id,
    v_username,
    v_display_name,
    new.email,
    v_subscription_tier,
    CASE
      WHEN v_church_linked THEN 'active'
      WHEN v_subscription_tier IN ('premium', 'church', 'lifetime') THEN 'active'
      WHEN v_subscription_tier = 'free' THEN 'trial'
      ELSE 'trial'
    END,
    CASE WHEN v_church_linked THEN 'church' ELSE NULL END,
    CASE WHEN v_church_linked THEN NULL ELSE v_trial_end END,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    display_name = COALESCE(EXCLUDED.display_name, profiles.display_name),
    email = COALESCE(EXCLUDED.email, profiles.email),
    username = COALESCE(profiles.username, EXCLUDED.username),
    -- If church-linked on this signup, force active/church
    subscription_status = CASE
      WHEN v_church_linked THEN 'active'
      ELSE COALESCE(profiles.subscription_status, EXCLUDED.subscription_status)
    END,
    payment_source = CASE
      WHEN v_church_linked THEN 'church'
      ELSE COALESCE(profiles.payment_source, EXCLUDED.payment_source)
    END,
    updated_at = NOW();

  RETURN new;
END;
$$;

-- ============================================================
-- 1c. Repair existing church members — set their profile to
--     active/church if they don't already have lifetime, stripe,
--     or patreon access.
-- ============================================================
UPDATE public.profiles p
SET
  subscription_status = 'active',
  payment_source = 'church',
  updated_at = NOW()
FROM public.church_members cm
WHERE cm.user_id = p.id
  AND (
    p.subscription_status IS DISTINCT FROM 'active'
    OR p.payment_source IS DISTINCT FROM 'church'
  )
  -- Don't override users who already have higher-priority access
  AND COALESCE(p.has_lifetime_access, false) = false
  AND COALESCE(p.payment_source, '') NOT IN ('stripe', 'patreon', 'pickaxe', 'teachable');

-- ============================================================
-- 1d. Repair unclaimed preapproved members — for preapprovals
--     where a matching auth.users email exists but was never
--     claimed (handle_new_user didn't have the logic).
-- ============================================================
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT pa.id AS preapproval_id, pa.church_id, pa.role, u.id AS user_id
    FROM public.church_preapproved_members pa
    JOIN auth.users u ON LOWER(u.email) = LOWER(pa.email)
    WHERE pa.claimed_at IS NULL
  LOOP
    -- Insert into church_members if not already there
    INSERT INTO public.church_members (church_id, user_id, role)
    VALUES (r.church_id, r.user_id, r.role)
    ON CONFLICT (church_id, user_id) DO NOTHING;

    -- Mark as claimed
    UPDATE public.church_preapproved_members
    SET claimed_at = NOW()
    WHERE id = r.preapproval_id;

    -- Fix their profile (same guard as 1c)
    UPDATE public.profiles
    SET
      subscription_status = 'active',
      payment_source = 'church',
      updated_at = NOW()
    WHERE id = r.user_id
      AND (
        subscription_status IS DISTINCT FROM 'active'
        OR payment_source IS DISTINCT FROM 'church'
      )
      AND COALESCE(has_lifetime_access, false) = false
      AND COALESCE(payment_source, '') NOT IN ('stripe', 'patreon', 'pickaxe', 'teachable');
  END LOOP;
END;
$$;
