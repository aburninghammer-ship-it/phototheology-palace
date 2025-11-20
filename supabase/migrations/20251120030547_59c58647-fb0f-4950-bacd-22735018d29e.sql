-- Add video_tutorials column to notification_preferences
ALTER TABLE public.notification_preferences 
ADD COLUMN IF NOT EXISTS video_tutorials boolean DEFAULT true;

-- Create function to notify users about new videos
CREATE OR REPLACE FUNCTION public.notify_new_video()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only send notifications for newly published videos
  IF NEW.is_published = true AND (TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.is_published = false)) THEN
    INSERT INTO public.notifications (user_id, type, title, message, link, metadata)
    SELECT 
      p.id,
      'video_tutorial',
      'New Video Tutorial Available',
      'A new tutorial "' || NEW.title || '" is now available in the ' || COALESCE(NEW.category, 'General') || ' category.',
      '/video-training',
      jsonb_build_object(
        'video_id', NEW.id,
        'category', NEW.category,
        'title', NEW.title
      )
    FROM public.profiles p
    LEFT JOIN public.notification_preferences np ON np.user_id = p.id
    WHERE COALESCE(np.video_tutorials, true) = true;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for new video notifications
DROP TRIGGER IF EXISTS on_video_published ON public.training_videos;
CREATE TRIGGER on_video_published
  AFTER INSERT OR UPDATE ON public.training_videos
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_video();

-- Enable realtime for training_videos table
ALTER TABLE public.training_videos REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.training_videos;