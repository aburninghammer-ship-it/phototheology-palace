-- Backfill analytics_snapshots with historical data
-- This generates estimated historical snapshots based on profile creation dates

DO $$
DECLARE
  target_date DATE;
  start_date DATE := '2025-12-01'::DATE;  -- Start backfill from Dec 1, 2025
  end_date DATE := CURRENT_DATE - 1;       -- Up to yesterday
  v_stripe_active INTEGER;
  v_stripe_trialing INTEGER;
  v_stripe_cancelled INTEGER;
  v_tier_essential INTEGER;
  v_tier_premium INTEGER;
  v_tier_student INTEGER;
  v_mrr_cents INTEGER;
  v_patreon_active INTEGER;
  v_teachable_count INTEGER;
  v_pickaxe_count INTEGER;
  v_lifetime_access INTEGER;
  v_total_users INTEGER;
  v_new_signups INTEGER;
  v_active_churches INTEGER;
BEGIN
  -- Loop through each date from start to end
  target_date := start_date;

  WHILE target_date <= end_date LOOP
    -- Skip if we already have a snapshot for this date
    IF NOT EXISTS (SELECT 1 FROM public.analytics_snapshots WHERE snapshot_date = target_date) THEN

      -- Count users who existed by this date
      SELECT COALESCE(COUNT(*), 0) INTO v_total_users
      FROM public.profiles
      WHERE created_at::date <= target_date;

      -- Count new signups on this specific date
      SELECT COALESCE(COUNT(*), 0) INTO v_new_signups
      FROM public.profiles
      WHERE created_at::date = target_date;

      -- Count active Stripe subscriptions that existed by this date
      -- (users who were created by this date and currently have active stripe)
      SELECT COALESCE(COUNT(*), 0) INTO v_stripe_active
      FROM public.profiles
      WHERE created_at::date <= target_date
        AND subscription_status = 'active'
        AND payment_source = 'stripe';

      -- Count trials (estimate based on users who existed and are currently trialing)
      SELECT COALESCE(COUNT(*), 0) INTO v_stripe_trialing
      FROM public.profiles
      WHERE created_at::date <= target_date
        AND subscription_status = 'trial'
        AND trial_end_date > target_date;

      -- Cancelled count
      SELECT COALESCE(COUNT(*), 0) INTO v_stripe_cancelled
      FROM public.user_subscriptions
      WHERE payment_source = 'stripe'
        AND subscription_status = 'cancelled'
        AND COALESCE(updated_at, created_at)::date <= target_date;

      -- Tier breakdown
      SELECT
        COALESCE(COUNT(*) FILTER (WHERE subscription_tier = 'essential' AND subscription_status IN ('active', 'trial') AND created_at::date <= target_date), 0),
        COALESCE(COUNT(*) FILTER (WHERE subscription_tier = 'premium' AND subscription_status IN ('active', 'trial') AND created_at::date <= target_date), 0),
        COALESCE(COUNT(*) FILTER (WHERE subscription_tier = 'student' AND subscription_status IN ('active', 'trial') AND created_at::date <= target_date), 0)
      INTO v_tier_essential, v_tier_premium, v_tier_student
      FROM public.profiles;

      -- MRR estimate
      v_mrr_cents := (v_tier_essential * 900) + (v_tier_premium * 1500) + (v_tier_student * 500);

      -- Patreon (users connected by this date)
      SELECT COALESCE(COUNT(*), 0) INTO v_patreon_active
      FROM public.patreon_connections
      WHERE is_active_patron = true
        AND created_at::date <= target_date;

      -- Teachable
      BEGIN
        SELECT COALESCE(COUNT(*), 0) INTO v_teachable_count
        FROM public.teachable_students
        WHERE created_at::date <= target_date;
      EXCEPTION WHEN undefined_table THEN
        v_teachable_count := 0;
      END;

      -- Pickaxe
      BEGIN
        SELECT COALESCE(COUNT(*), 0) INTO v_pickaxe_count
        FROM public.pickaxe_connections
        WHERE created_at::date <= target_date;
      EXCEPTION WHEN undefined_table THEN
        v_pickaxe_count := 0;
      END;

      -- Lifetime access
      SELECT COALESCE(COUNT(*), 0) INTO v_lifetime_access
      FROM public.profiles
      WHERE subscription_tier = 'lifetime'
        AND created_at::date <= target_date;

      -- Active churches
      SELECT COALESCE(COUNT(*), 0) INTO v_active_churches
      FROM public.churches
      WHERE subscription_status = 'active'
        AND created_at::date <= target_date;

      -- Insert the backfilled snapshot
      INSERT INTO public.analytics_snapshots (
        snapshot_date,
        stripe_active,
        stripe_trialing,
        stripe_cancelled,
        tier_essential,
        tier_premium,
        tier_student,
        mrr_cents,
        patreon_active,
        teachable_count,
        pickaxe_count,
        lifetime_access,
        total_users,
        new_signups_today,
        active_churches,
        created_at
      ) VALUES (
        target_date,
        v_stripe_active,
        v_stripe_trialing,
        v_stripe_cancelled,
        v_tier_essential,
        v_tier_premium,
        v_tier_student,
        v_mrr_cents,
        v_patreon_active,
        v_teachable_count,
        v_pickaxe_count,
        v_lifetime_access,
        v_total_users,
        v_new_signups,
        v_active_churches,
        target_date + interval '23 hours 59 minutes'  -- Set created_at to end of that day
      )
      ON CONFLICT (snapshot_date) DO NOTHING;

    END IF;

    target_date := target_date + 1;
  END LOOP;

  RAISE NOTICE 'Backfill complete from % to %', start_date, end_date;
END;
$$;

-- Also record today's snapshot to ensure we have current data
SELECT public.record_analytics_snapshot();
