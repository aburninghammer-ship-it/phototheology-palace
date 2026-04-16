-- Create analytics_snapshots table for dashboard charts
CREATE TABLE IF NOT EXISTS public.analytics_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  snapshot_date DATE NOT NULL UNIQUE,
  stripe_active INTEGER NOT NULL DEFAULT 0,
  stripe_trialing INTEGER NOT NULL DEFAULT 0,
  stripe_cancelled INTEGER NOT NULL DEFAULT 0,
  tier_essential INTEGER NOT NULL DEFAULT 0,
  tier_premium INTEGER NOT NULL DEFAULT 0,
  tier_student INTEGER NOT NULL DEFAULT 0,
  tier_church INTEGER NOT NULL DEFAULT 0,
  mrr_cents INTEGER NOT NULL DEFAULT 0,
  patreon_active INTEGER NOT NULL DEFAULT 0,
  pickaxe_count INTEGER NOT NULL DEFAULT 0,
  lifetime_access INTEGER NOT NULL DEFAULT 0,
  total_users INTEGER NOT NULL DEFAULT 0,
  new_signups_today INTEGER NOT NULL DEFAULT 0,
  active_churches INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.analytics_snapshots ENABLE ROW LEVEL SECURITY;

-- Only admins can read/write analytics snapshots
CREATE POLICY "Admins can view analytics snapshots"
ON public.analytics_snapshots
FOR SELECT
USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can insert analytics snapshots"
ON public.analytics_snapshots
FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Create index for faster date-based queries
CREATE INDEX idx_analytics_snapshots_date ON public.analytics_snapshots(snapshot_date DESC);