-- Add reaction_type column to community_post_likes for rich reactions
ALTER TABLE community_post_likes ADD COLUMN IF NOT EXISTS reaction_type TEXT DEFAULT 'love';
