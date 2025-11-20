-- Step 2: Create security definer function and update policies
CREATE OR REPLACE FUNCTION public.is_video_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'video_admin'
  )
$$;

-- Update the training videos policy to require video_admin role
DROP POLICY IF EXISTS "Admins can manage videos" ON public.training_videos;

CREATE POLICY "Video admins can manage videos"
  ON public.training_videos
  FOR ALL
  USING (public.is_video_admin(auth.uid()));

-- Update storage policies for training-videos bucket
DROP POLICY IF EXISTS "Admins can upload training videos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete training videos" ON storage.objects;

CREATE POLICY "Video admins can upload training videos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'training-videos' AND
    public.is_video_admin(auth.uid())
  );

CREATE POLICY "Video admins can delete training videos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'training-videos' AND
    public.is_video_admin(auth.uid())
  );