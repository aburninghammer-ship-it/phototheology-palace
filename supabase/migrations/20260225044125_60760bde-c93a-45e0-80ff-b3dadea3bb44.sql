
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
    longest_study_streak = NEW.longest_streak
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$function$;
