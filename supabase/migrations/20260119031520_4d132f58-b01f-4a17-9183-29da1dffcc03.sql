-- Create subscription analytics snapshots table
CREATE TABLE public.subscription_analytics_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  snapshot_date DATE NOT NULL UNIQUE,
  active_subscriptions INTEGER DEFAULT 0,
  trialing_subscriptions INTEGER DEFAULT 0,
  canceled_subscriptions INTEGER DEFAULT 0,
  total_users INTEGER DEFAULT 0,
  lifetime_access INTEGER DEFAULT 0,
  active_patrons INTEGER DEFAULT 0,
  pickaxe_paid INTEGER DEFAULT 0,
  mrr_cents INTEGER DEFAULT 0,
  essential_count INTEGER DEFAULT 0,
  premium_count INTEGER DEFAULT 0,
  student_count INTEGER DEFAULT 0,
  church_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscription_analytics_snapshots ENABLE ROW LEVEL SECURITY;

-- Admin-only read access
CREATE POLICY "Admins can read analytics snapshots"
ON public.subscription_analytics_snapshots
FOR SELECT
USING (
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Create index for date queries
CREATE INDEX idx_analytics_snapshot_date ON public.subscription_analytics_snapshots(snapshot_date DESC);