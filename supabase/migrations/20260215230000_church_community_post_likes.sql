-- Create a proper post likes table for per-user like tracking
CREATE TABLE IF NOT EXISTS public.church_community_post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.church_community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE public.church_community_post_likes ENABLE ROW LEVEL SECURITY;

-- Anyone with community access can see likes
CREATE POLICY "Church members can view post likes"
ON public.church_community_post_likes FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.church_community_posts p
    WHERE p.id = post_id
      AND public.has_church_community_access(auth.uid(), p.church_id)
  )
);

-- Users can insert their own likes
CREATE POLICY "Users can like posts"
ON public.church_community_post_likes FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM public.church_community_posts p
    WHERE p.id = post_id
      AND public.has_church_community_access(auth.uid(), p.church_id)
  )
);

-- Users can remove their own likes
CREATE POLICY "Users can unlike posts"
ON public.church_community_post_likes FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX idx_post_likes_post_id ON public.church_community_post_likes(post_id);
CREATE INDEX idx_post_likes_user_id ON public.church_community_post_likes(user_id);
