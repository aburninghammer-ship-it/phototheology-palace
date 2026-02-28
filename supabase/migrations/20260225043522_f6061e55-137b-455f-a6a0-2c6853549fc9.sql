
-- Create a function that syncs reading_streaks data into profiles streak columns
-- This will be called by a trigger on reading_streaks updates
CREATE OR REPLACE FUNCTION public.sync_reading_streak_to_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE profiles
  SET 
    daily_study_streak = NEW.current_streak,
    longest_study_streak = NEW.longest_streak,
    updated_at = now()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$function$;

-- Trigger to auto-sync reading streaks to profiles
DROP TRIGGER IF EXISTS sync_reading_streak_trigger ON reading_streaks;
CREATE TRIGGER sync_reading_streak_trigger
AFTER INSERT OR UPDATE ON reading_streaks
FOR EACH ROW
EXECUTE FUNCTION sync_reading_streak_to_profile();

-- Create a function that syncs mastery_streaks to profiles 
CREATE OR REPLACE FUNCTION public.sync_mastery_streak_to_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE global_master_titles
  SET 
    global_streak_days = NEW.current_streak,
    last_global_practice_date = NEW.last_activity_date,
    updated_at = now()
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS sync_mastery_streak_trigger ON mastery_streaks;
CREATE TRIGGER sync_mastery_streak_trigger
AFTER INSERT OR UPDATE ON mastery_streaks
FOR EACH ROW
EXECUTE FUNCTION sync_mastery_streak_to_profile();

-- Backfill: sync existing reading_streaks data into profiles
UPDATE profiles p
SET 
  daily_study_streak = rs.current_streak,
  longest_study_streak = rs.longest_streak
FROM reading_streaks rs
WHERE rs.user_id = p.id AND rs.current_streak > 0;

-- Backfill: sync gem creation streaks from user_gems activity
-- Count consecutive days of gem creation for each user
UPDATE profiles p
SET gem_creation_streak = sub.streak_count,
    longest_gem_streak = sub.streak_count
FROM (
  SELECT user_id, COUNT(DISTINCT DATE(created_at)) as streak_count
  FROM user_gems
  WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY user_id
) sub
WHERE sub.user_id = p.id AND sub.streak_count > 0;
