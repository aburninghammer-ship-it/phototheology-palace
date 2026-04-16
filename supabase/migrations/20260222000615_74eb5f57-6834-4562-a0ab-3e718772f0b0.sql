
-- Stream Key Vault: store RTMP keys per platform per church
CREATE TABLE public.church_stream_platforms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  platform_name TEXT NOT NULL, -- e.g. 'YouTube', 'Facebook', 'Twitch', 'Custom'
  rtmp_url TEXT NOT NULL DEFAULT '',
  stream_key TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(church_id, platform_name)
);

-- Enable RLS
ALTER TABLE public.church_stream_platforms ENABLE ROW LEVEL SECURITY;

-- Only church admins/leaders can view stream keys
CREATE POLICY "Church admins can view stream platforms"
  ON public.church_stream_platforms FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members cm
      WHERE cm.church_id = church_stream_platforms.church_id
        AND cm.user_id = auth.uid()
        AND cm.role IN ('admin', 'leader')
    )
  );

-- Only church admins can insert
CREATE POLICY "Church admins can insert stream platforms"
  ON public.church_stream_platforms FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.church_members cm
      WHERE cm.church_id = church_stream_platforms.church_id
        AND cm.user_id = auth.uid()
        AND cm.role = 'admin'
    )
  );

-- Only church admins can update
CREATE POLICY "Church admins can update stream platforms"
  ON public.church_stream_platforms FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members cm
      WHERE cm.church_id = church_stream_platforms.church_id
        AND cm.user_id = auth.uid()
        AND cm.role = 'admin'
    )
  );

-- Only church admins can delete
CREATE POLICY "Church admins can delete stream platforms"
  ON public.church_stream_platforms FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members cm
      WHERE cm.church_id = church_stream_platforms.church_id
        AND cm.user_id = auth.uid()
        AND cm.role = 'admin'
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_church_stream_platforms_updated_at
  BEFORE UPDATE ON public.church_stream_platforms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_church_updated_at();
