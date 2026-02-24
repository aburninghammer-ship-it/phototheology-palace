
-- Fix MRR calculation to exclude trialing users
-- MRR should only count ACTIVE paying subscriptions, not trials

CREATE OR REPLACE FUNCTION public.record_analytics_snapshot()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  today DATE := CURRENT_DATE;
  v_stripe_active INTEGER;
  v_stripe_trialing INTEGER;
  v_stripe_cancelled INTEGER;
  v_tier_essential INTEGER;
  v_tier_premium INTEGER;
  v_tier_student INTEGER;
  v_tier_church INTEGER;
  v_mrr_cents INTEGER;
  v_patreon_active INTEGER;
  v_teachable_count INTEGER;
  v_pickaxe_count INTEGER;
  v_lifetime_access INTEGER;
  v_total_users INTEGER;
  v_new_signups_today INTEGER;
  v_active_churches INTEGER;
  -- Separate counts for active-only (for MRR)
  v_active_essential INTEGER;
  v_active_premium INTEGER;
  v_active_student INTEGER;
BEGIN
  -- Count active Stripe subscriptions from profiles (matches Overview)
  SELECT COALESCE(COUNT(*), 0) INTO v_stripe_active
  FROM public.profiles
  WHERE subscription_status = 'active'
    AND payment_source = 'stripe';

  -- Count active 7-day trials from profiles (matches Overview "7-Day Trials" card)
  -- FIXED: Use correct column name trial_ends_at
  SELECT COALESCE(COUNT(*), 0) INTO v_stripe_trialing
  FROM public.profiles
  WHERE subscription_status = 'trial'
    AND trial_ends_at > now();

  -- Count cancelled (from user_subscriptions for historical tracking)
  SELECT COALESCE(COUNT(*), 0) INTO v_stripe_cancelled
  FROM public.user_subscriptions
  WHERE payment_source = 'stripe'
    AND subscription_status = 'cancelled';

  -- Count by tier from profiles (includes active + trial for tier display)
  SELECT
    COALESCE(COUNT(*) FILTER (WHERE subscription_tier = 'essential' AND subscription_status IN ('active', 'trial')), 0),
    COALESCE(COUNT(*) FILTER (WHERE subscription_tier = 'premium' AND subscription_status IN ('active', 'trial')), 0),
    COALESCE(COUNT(*) FILTER (WHERE subscription_tier = 'student' AND subscription_status IN ('active', 'trial')), 0)
  INTO v_tier_essential, v_tier_premium, v_tier_student
  FROM public.profiles;

  -- Count church tier
  SELECT COALESCE(COUNT(*), 0) INTO v_tier_church
  FROM public.profiles
  WHERE subscription_tier = 'church' AND subscription_status IN ('active', 'trial');

  -- Count ACTIVE ONLY for MRR calculation (exclude trials - they haven't paid yet!)
  SELECT
    COALESCE(COUNT(*) FILTER (WHERE subscription_tier = 'essential' AND subscription_status = 'active'), 0),
    COALESCE(COUNT(*) FILTER (WHERE subscription_tier = 'premium' AND subscription_status = 'active'), 0),
    COALESCE(COUNT(*) FILTER (WHERE subscription_tier = 'student' AND subscription_status = 'active'), 0)
  INTO v_active_essential, v_active_premium, v_active_student
  FROM public.profiles;

  -- Calculate MRR from ACTIVE subscriptions only (not trials!)
  -- essential $9, premium $15, student $5
  v_mrr_cents := (v_active_essential * 900) + (v_active_premium * 1500) + (v_active_student * 500);

  -- Count Patreon
  SELECT COALESCE(COUNT(*), 0) INTO v_patreon_active
  FROM public.patreon_connections
  WHERE is_active_patron = true;

  -- Count Teachable
  SELECT COALESCE(COUNT(*), 0) INTO v_teachable_count
  FROM public.teachable_students;

  -- Count Pickaxe
  BEGIN
    SELECT COALESCE(COUNT(*), 0) INTO v_pickaxe_count
    FROM public.pickaxe_connections;
  EXCEPTION WHEN undefined_table THEN
    v_pickaxe_count := 0;
  END;

  -- Count lifetime access
  SELECT COALESCE(COUNT(*), 0) INTO v_lifetime_access
  FROM public.profiles
  WHERE subscription_tier = 'lifetime';

  -- Total users
  SELECT COALESCE(COUNT(*), 0) INTO v_total_users
  FROM public.profiles;

  -- New signups today
  SELECT COALESCE(COUNT(*), 0) INTO v_new_signups_today
  FROM public.profiles
  WHERE created_at::date = today;

  -- Active churches
  SELECT COALESCE(COUNT(*), 0) INTO v_active_churches
  FROM public.churches
  WHERE subscription_status = 'active';

  -- Insert or update today's snapshot
  INSERT INTO public.analytics_snapshots (
    snapshot_date,
    stripe_active,
    stripe_trialing,
    stripe_cancelled,
    tier_essential,
    tier_premium,
    tier_student,
    tier_church,
    mrr_cents,
    patreon_active,
    pickaxe_count,
    lifetime_access,
    total_users,
    new_signups_today,
    active_churches
  ) VALUES (
    today,
    v_stripe_active,
    v_stripe_trialing,
    v_stripe_cancelled,
    v_tier_essential,
    v_tier_premium,
    v_tier_student,
    v_tier_church,
    v_mrr_cents,
    v_patreon_active,
    v_pickaxe_count,
    v_lifetime_access,
    v_total_users,
    v_new_signups_today,
    v_active_churches
  )
  ON CONFLICT (snapshot_date) DO UPDATE SET
    stripe_active = EXCLUDED.stripe_active,
    stripe_trialing = EXCLUDED.stripe_trialing,
    stripe_cancelled = EXCLUDED.stripe_cancelled,
    tier_essential = EXCLUDED.tier_essential,
    tier_premium = EXCLUDED.tier_premium,
    tier_student = EXCLUDED.tier_student,
    tier_church = EXCLUDED.tier_church,
    mrr_cents = EXCLUDED.mrr_cents,
    patreon_active = EXCLUDED.patreon_active,
    pickaxe_count = EXCLUDED.pickaxe_count,
    lifetime_access = EXCLUDED.lifetime_access,
    total_users = EXCLUDED.total_users,
    new_signups_today = EXCLUDED.new_signups_today,
    active_churches = EXCLUDED.active_churches,
    created_at = now();
END;
$$;

-- Re-run today's snapshot with the corrected calculation
SELECT public.record_analytics_snapshot();
