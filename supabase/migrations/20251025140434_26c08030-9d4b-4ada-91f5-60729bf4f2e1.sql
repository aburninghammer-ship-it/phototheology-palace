-- Fix nullable user_id columns where RLS policies depend on them
-- First, delete any orphaned records with NULL user_id (if any exist)

-- Clean up any NULL user_id records
DELETE FROM challenge_submissions WHERE user_id IS NULL;
DELETE FROM community_comments WHERE user_id IS NULL;
DELETE FROM community_posts WHERE user_id IS NULL;
DELETE FROM game_chat WHERE user_id IS NULL;

-- Now make the columns NOT NULL
ALTER TABLE challenge_submissions 
  ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE community_comments 
  ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE community_posts 
  ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE game_chat 
  ALTER COLUMN user_id SET NOT NULL;

-- For games table, player1_id should not be nullable since it's the creator
ALTER TABLE games 
  ALTER COLUMN player1_id SET NOT NULL;

-- Add comments explaining the security rationale
COMMENT ON COLUMN challenge_submissions.user_id IS 'Required for RLS policy - users can only insert their own submissions';
COMMENT ON COLUMN community_comments.user_id IS 'Required for RLS policy - users can only create their own comments';
COMMENT ON COLUMN community_posts.user_id IS 'Required for RLS policy - users can only create their own posts';
COMMENT ON COLUMN game_chat.user_id IS 'Required for RLS policy - users can only send their own messages';
COMMENT ON COLUMN games.player1_id IS 'Required - the user creating the game must be identified';