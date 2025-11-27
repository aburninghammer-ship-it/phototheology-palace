-- Add tags column to community_posts
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Add index for tag searching
CREATE INDEX IF NOT EXISTS idx_community_posts_tags ON public.community_posts USING GIN(tags);

-- Add full-text search index
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS search_vector tsvector;

CREATE INDEX IF NOT EXISTS idx_community_posts_search ON public.community_posts USING GIN(search_vector);

-- Create trigger to update search vector
CREATE OR REPLACE FUNCTION update_community_posts_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', COALESCE(NEW.title, '') || ' ' || COALESCE(NEW.content, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER community_posts_search_vector_trigger
  BEFORE INSERT OR UPDATE ON public.community_posts
  FOR EACH ROW EXECUTE FUNCTION update_community_posts_search_vector();

-- Update existing posts with search vector
UPDATE public.community_posts SET search_vector = to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(content, ''));

-- Add shared_content column for PT integrations (stores JSON with type, id, title, preview)
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS shared_content jsonb;

-- Create community_post_notifications table for reply notifications
CREATE TABLE IF NOT EXISTS public.community_post_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES public.community_comments(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('reply', 'comment', 'mention')),
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- RLS for notifications
ALTER TABLE public.community_post_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON public.community_post_notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.community_post_notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" ON public.community_post_notifications
  FOR INSERT WITH CHECK (true);

-- Trigger to create notification when someone comments on your post
CREATE OR REPLACE FUNCTION notify_post_author_on_comment()
RETURNS TRIGGER AS $$
DECLARE
  post_author_id uuid;
BEGIN
  -- Get post author
  SELECT user_id INTO post_author_id FROM public.community_posts WHERE id = NEW.post_id;
  
  -- Don't notify if commenting on own post
  IF post_author_id != NEW.user_id THEN
    INSERT INTO public.community_post_notifications (user_id, post_id, comment_id, type)
    VALUES (post_author_id, NEW.post_id, NEW.id, 'comment');
  END IF;
  
  -- If replying to a comment, notify parent comment author
  IF NEW.parent_comment_id IS NOT NULL THEN
    DECLARE
      parent_author_id uuid;
    BEGIN
      SELECT user_id INTO parent_author_id FROM public.community_comments WHERE id = NEW.parent_comment_id;
      
      IF parent_author_id != NEW.user_id AND parent_author_id != post_author_id THEN
        INSERT INTO public.community_post_notifications (user_id, post_id, comment_id, type)
        VALUES (parent_author_id, NEW.post_id, NEW.id, 'reply');
      END IF;
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER community_comment_notification_trigger
  AFTER INSERT ON public.community_comments
  FOR EACH ROW EXECUTE FUNCTION notify_post_author_on_comment();

-- Add has_seen_community_guidelines to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS has_seen_community_guidelines boolean DEFAULT false;