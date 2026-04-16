-- Daily Gem Clips table for admin viral video clip script generation
CREATE TABLE public.daily_gem_clips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  gem_insight TEXT NOT NULL,
  transcript TEXT NOT NULL,
  scripture TEXT NOT NULL,
  cta TEXT NOT NULL,
  full_content TEXT NOT NULL,
  generated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.daily_gem_clips ENABLE ROW LEVEL SECURITY;

-- Admin-only read policy
CREATE POLICY "Admin users can read daily gem clips"
  ON public.daily_gem_clips
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Admin-only insert policy
CREATE POLICY "Admin users can insert daily gem clips"
  ON public.daily_gem_clips
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Admin-only delete policy
CREATE POLICY "Admin users can delete daily gem clips"
  ON public.daily_gem_clips
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );
