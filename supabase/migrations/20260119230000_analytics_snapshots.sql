-- Create analytics_snapshots table for automatic daily tracking
CREATE TABLE IF NOT EXISTS public.analytics_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date DATE NOT NULL UNIQUE,

  -- Subscription counts
  stripe_active INTEGER NOT NULL DEFAULT 0,
  stripe_trialing INTEGER NOT NULL DEFAULT 0,
  stripe_cancelled INTEGER NOT NULL DEFAULT 0,

  -- Tier breakdown
  tier_essential INTEGER NOT NULL DEFAULT 0,
  tier_premium INTEGER NOT NULL DEFAULT 0,
  tier_student INTEGER NOT NULL DEFAULT 0,

  -- Revenue
  mrr_cents INTEGER NOT NULL DEFAULT 0,

  -- Other sources
  patreon_active INTEGER NOT NULL DEFAULT 0,
  teachable_count INTEGER NOT NULL DEFAULT 0,
  pickaxe_count INTEGER NOT NULL DEFAULT 0,
  lifetime_access INTEGER NOT NULL DEFAULT 0,

  -- User counts
  total_users INTEGER NOT NULL DEFAULT 0,
  new_signups_today INTEGER NOT NULL DEFAULT 0,

  -- Church subscriptions
  active_churches INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for efficient date-range queries
CREATE INDEX IF NOT EXISTS idx_analytics_snapshots_date ON public.analytics_snapshots(snapshot_date DESC);

-- Enable RLS
ALTER TABLE public.analytics_snapshots ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can read snapshots
CREATE POLICY "Admins can read analytics snapshots"
  ON public.analytics_snapshots FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to record daily snapshot
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
  v_mrr_cents INTEGER;
  v_patreon_active INTEGER;
  v_teachable_count INTEGER;
  v_pickaxe_count INTEGER;
  v_lifetime_access INTEGER;
  v_total_users INTEGER;
  v_new_signups_today INTEGER;
  v_active_churches INTEGER;
BEGIN
  -- Count active Stripe subscriptions from profiles (matches Overview)
  SELECT COALESCE(COUNT(*), 0) INTO v_stripe_active
  FROM public.profiles
  WHERE subscription_status = 'active'
    AND payment_source = 'stripe';

  -- Count active 7-day trials from profiles (matches Overview "7-Day Trials" card)
  SELECT COALESCE(COUNT(*), 0) INTO v_stripe_trialing
  FROM public.profiles
  WHERE subscription_status = 'trial'
    AND trial_end_date > now();

  -- Count cancelled (from user_subscriptions for historical tracking)
  SELECT COALESCE(COUNT(*), 0) INTO v_stripe_cancelled
  FROM public.user_subscriptions
  WHERE payment_source = 'stripe'
    AND subscription_status = 'cancelled';

  -- Count by tier from profiles (matches Overview breakdown)
  SELECT
    COALESCE(COUNT(*) FILTER (WHERE subscription_tier = 'essential' AND subscription_status IN ('active', 'trial')), 0),
    COALESCE(COUNT(*) FILTER (WHERE subscription_tier = 'premium' AND subscription_status IN ('active', 'trial')), 0),
    COALESCE(COUNT(*) FILTER (WHERE subscription_tier = 'student' AND subscription_status IN ('active', 'trial')), 0)
  INTO v_tier_essential, v_tier_premium, v_tier_student
  FROM public.profiles;

  -- Estimate MRR (simplified: essential $9, premium $15, student $5)
  v_mrr_cents := (v_tier_essential * 900) + (v_tier_premium * 1500) + (v_tier_student * 500);

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
    mrr_cents,
    patreon_active,
    teachable_count,
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
    v_mrr_cents,
    v_patreon_active,
    v_teachable_count,
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
    mrr_cents = EXCLUDED.mrr_cents,
    patreon_active = EXCLUDED.patreon_active,
    teachable_count = EXCLUDED.teachable_count,
    pickaxe_count = EXCLUDED.pickaxe_count,
    lifetime_access = EXCLUDED.lifetime_access,
    total_users = EXCLUDED.total_users,
    new_signups_today = EXCLUDED.new_signups_today,
    active_churches = EXCLUDED.active_churches,
    created_at = now();
END;
$$;

-- Schedule daily snapshot at midnight UTC using pg_cron
-- Note: pg_cron must be enabled in your Supabase project
SELECT cron.schedule(
  'daily-analytics-snapshot',
  '0 0 * * *', -- Every day at midnight UTC
  'SELECT public.record_analytics_snapshot()'
);

-- Record initial snapshot immediately
SELECT public.record_analytics_snapshot();
