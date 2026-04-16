
CREATE OR REPLACE FUNCTION public.cleanup_abandoned_signups()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_record RECORD;
  deleted_count INTEGER := 0;
BEGIN
  FOR user_record IN 
    SELECT p.id, p.email
    FROM profiles p
    LEFT JOIN user_subscriptions us ON us.user_id = p.id
    WHERE p.payment_source = 'manual'
      AND (p.subscription_tier IS NULL OR p.subscription_tier = 'free')
      AND (p.subscription_status IS NULL OR p.subscription_status IN ('none', 'trial', 'pending'))
      AND p.created_at < NOW() - INTERVAL '48 hours'
      AND p.has_lifetime_access = false
      AND NOT EXISTS (
        SELECT 1 FROM church_members cm WHERE cm.user_id = p.id
      )
      AND NOT EXISTS (
        SELECT 1 FROM patreon_connections pc 
        WHERE pc.user_id = p.id AND pc.is_active_patron = true
      )
      AND NOT EXISTS (
        SELECT 1 FROM pickaxe_connections pk 
        WHERE pk.pickaxe_email = p.email AND pk.is_paid_user = true
      )
  LOOP
    -- Delete all possible user data (catch FK issues)
    DELETE FROM generated_gems WHERE generated_for_user_id = user_record.id;
    DELETE FROM user_subscriptions WHERE user_id = user_record.id;
    DELETE FROM notifications WHERE user_id = user_record.id;
    DELETE FROM bookmarks WHERE user_id = user_record.id;
    DELETE FROM user_studies WHERE user_id = user_record.id;
    DELETE FROM course_progress WHERE user_id = user_record.id;
    DELETE FROM challenge_submissions WHERE user_id = user_record.id;
    DELETE FROM drill_results WHERE user_id = user_record.id;
    DELETE FROM game_scores WHERE user_id = user_record.id;
    DELETE FROM user_achievements WHERE user_id = user_record.id;
    DELETE FROM room_mastery_levels WHERE user_id = user_record.id;
    DELETE FROM mastery_streaks WHERE user_id = user_record.id;
    DELETE FROM reading_plans WHERE user_id = user_record.id;
    DELETE FROM user_reading_progress WHERE user_id = user_record.id;
    DELETE FROM christ_chapter_findings WHERE user_id = user_record.id;
    DELETE FROM bible_images WHERE user_id = user_record.id;
    DELETE FROM user_gems WHERE user_id = user_record.id;
    DELETE FROM study_collaborators WHERE user_id = user_record.id;
    DELETE FROM flashcard_sets WHERE user_id = user_record.id;
    DELETE FROM dojo_lessons WHERE user_id = user_record.id;
    DELETE FROM dojo_challenges WHERE user_id = user_record.id;
    DELETE FROM user_floor_progress WHERE user_id = user_record.id;
    DELETE FROM global_master_titles WHERE user_id = user_record.id;
    DELETE FROM user_engagement WHERE user_id = user_record.id;
    DELETE FROM reading_streaks WHERE user_id = user_record.id;
    DELETE FROM profiles WHERE id = user_record.id;
    DELETE FROM auth.users WHERE id = user_record.id;
    
    deleted_count := deleted_count + 1;
    RAISE NOTICE 'Deleted abandoned signup: % (%)', user_record.id, user_record.email;
  END LOOP;
  
  RAISE NOTICE 'Cleanup complete. Deleted % abandoned accounts.', deleted_count;
END;
$$;
