-- Drop constraint if it exists (in case of stale cache)
ALTER TABLE community_posts DROP CONSTRAINT IF EXISTS community_posts_user_id_fkey;

-- Add foreign key relationship between community_posts and profiles
ALTER TABLE community_posts
ADD CONSTRAINT community_posts_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES profiles(id)
ON DELETE CASCADE;