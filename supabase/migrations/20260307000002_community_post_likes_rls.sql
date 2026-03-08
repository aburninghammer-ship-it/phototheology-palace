-- Ensure community_post_likes table has proper RLS policies.
-- The table exists but may not have RLS enabled or policies configured.

ALTER TABLE public.community_post_likes ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can see likes (for counting)
DROP POLICY IF EXISTS "Anyone can view community likes" ON public.community_post_likes;
CREATE POLICY "Anyone can view community likes"
  ON public.community_post_likes
  FOR SELECT
  TO authenticated
  USING (true);

-- Users can insert their own likes
DROP POLICY IF EXISTS "Users can like community posts" ON public.community_post_likes;
CREATE POLICY "Users can like community posts"
  ON public.community_post_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can remove their own likes
DROP POLICY IF EXISTS "Users can unlike community posts" ON public.community_post_likes;
CREATE POLICY "Users can unlike community posts"
  ON public.community_post_likes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_community_post_likes_post_id ON public.community_post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_community_post_likes_user_id ON public.community_post_likes(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_community_post_likes_unique ON public.community_post_likes(post_id, user_id);
