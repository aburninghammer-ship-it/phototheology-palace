-- Create storage bucket for training videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('training-videos', 'training-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Create training_videos table
CREATE TABLE IF NOT EXISTS public.training_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  duration_seconds INTEGER,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.training_videos ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view published videos
CREATE POLICY "Anyone can view published videos"
  ON public.training_videos
  FOR SELECT
  USING (is_published = true);

-- Policy: Admins can do everything
CREATE POLICY "Admins can manage videos"
  ON public.training_videos
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create updated_at trigger
CREATE TRIGGER update_training_videos_updated_at
  BEFORE UPDATE ON public.training_videos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Storage policies for training-videos bucket
CREATE POLICY "Anyone can view training videos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'training-videos');

CREATE POLICY "Admins can upload training videos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'training-videos' AND
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete training videos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'training-videos' AND
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );