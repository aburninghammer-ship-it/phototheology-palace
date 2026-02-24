-- Backfill analytics snapshots from January 17, 2026 to today
-- Run this in Supabase Dashboard > SQL Editor

-- First, ensure tier_church column exists
ALTER TABLE public.analytics_snapshots ADD COLUMN IF NOT EXISTS tier_church INTEGER NOT NULL DEFAULT 0;

-- Get current metrics once (we'll use these for all backfilled dates)
DO $$
DECLARE
  target_date DATE;
  start_date DATE := '2026-01-17'::DATE;
  end_date DATE := CURRENT_DATE;

  -- Current metrics (we'll use current values since we can't get historical)
  v_stripe_active INTEGER;
  v_stripe_trialing INTEGER;
  v_stripe_cancelled INTEGER;
  v_tier_essential INTEGER;
  v_tier_premium INTEGER;
  v_tier_student INTEGER;
  v_tier_church INTEGER;
  v_mrr_cents INTEGER;
  v_patreon_active INTEGER;
  v_pickaxe_count INTEGER;
  v_lifetime_access INTEGER;
  v_total_users INTEGER;
  v_active_churches INTEGER;
  v_dates_filled INTEGER := 0;
BEGIN
  -- Get current Stripe active from profiles
  SELECT COALESCE(COUNT(*), 0) INTO v_stripe_active
  FROM public.profiles
  WHERE subscription_status = 'active'
    AND payment_source = 'stripe';

  -- Get current trials
  SELECT COALESCE(COUNT(*), 0) INTO v_stripe_trialing
  FROM public.profiles
  WHERE subscription_status = 'trial'
    AND trial_end_date > NOW();

  -- Cancelled count
  SELECT COALESCE(COUNT(*), 0) INTO v_stripe_cancelled
  FROM public.user_subscriptions
  WHERE payment_source = 'stripe'
    AND subscription_status = 'cancelled';

  -- Tier breakdown
  SELECT
    COALESCE(COUNT(*) FILTER (WHERE subscription_tier = 'essential' AND subscription_status IN ('active', 'trial')), 0),
    COALESCE(COUNT(*) FILTER (WHERE subscription_tier = 'premium' AND subscription_status IN ('active', 'trial')), 0),
    COALESCE(COUNT(*) FILTER (WHERE subscription_tier = 'student' AND subscription_status IN ('active', 'trial')), 0),
    COALESCE(COUNT(*) FILTER (WHERE subscription_tier = 'church' AND subscription_status IN ('active', 'trial')), 0)
  INTO v_tier_essential, v_tier_premium, v_tier_student, v_tier_church
  FROM public.profiles;

  -- MRR estimate (essential $9, premium $15, student $5, church $49)
  v_mrr_cents := (v_tier_essential * 900) + (v_tier_premium * 1500) + (v_tier_student * 500) + (v_tier_church * 4900);

  -- Patreon
  SELECT COALESCE(COUNT(*), 0) INTO v_patreon_active
  FROM public.patreon_connections
  WHERE is_active_patron = true;

  -- Pickaxe
  BEGIN
    SELECT COALESCE(COUNT(*), 0) INTO v_pickaxe_count
    FROM public.pickaxe_connections
    WHERE is_paid_user = true;
  EXCEPTION WHEN undefined_table THEN
    v_pickaxe_count := 0;
  END;

  -- Lifetime access
  SELECT COALESCE(COUNT(*), 0) INTO v_lifetime_access
  FROM public.profiles
  WHERE subscription_tier = 'lifetime';

  -- Total users
  SELECT COALESCE(COUNT(*), 0) INTO v_total_users
  FROM public.profiles;

  -- Active churches
  SELECT COALESCE(COUNT(*), 0) INTO v_active_churches
  FROM public.churches
  WHERE subscription_status = 'active';

  RAISE NOTICE 'Current metrics: active=%, trials=%, mrr=%', v_stripe_active, v_stripe_trialing, v_mrr_cents;

  -- Now fill in each missing date
  target_date := start_date;
  WHILE target_date <= end_date LOOP
    -- Only insert if we don't have data for this date
    IF NOT EXISTS (SELECT 1 FROM public.analytics_snapshots WHERE snapshot_date = target_date) THEN
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
        target_date,
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
        0, -- Can't determine historical signups
        v_active_churches
      );
      v_dates_filled := v_dates_filled + 1;
    END IF;

    target_date := target_date + 1;
  END LOOP;

  RAISE NOTICE 'Backfill complete! Filled % missing dates.', v_dates_filled;
END;
$$;

-- Verify the backfill
SELECT snapshot_date, stripe_active, stripe_trialing, mrr_cents, total_users
FROM public.analytics_snapshots
ORDER BY snapshot_date ASC;
