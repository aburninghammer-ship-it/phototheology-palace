
-- Create function to delete abandoned signup accounts
-- These are accounts where payment_source='manual', subscription_tier is free/null,
-- and created more than 48 hours ago (never completed Stripe checkout)
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
      -- Make sure they're not a church member
      AND NOT EXISTS (
        SELECT 1 FROM church_members cm WHERE cm.user_id = p.id
      )
      -- Make sure they have no active Stripe, Patreon, etc.
      AND NOT EXISTS (
        SELECT 1 FROM patreon_connections pc 
        WHERE pc.user_id = p.id AND pc.is_active_patron = true
      )
      AND NOT EXISTS (
        SELECT 1 FROM pickaxe_connections pk 
        WHERE pk.pickaxe_email = p.email AND pk.is_paid_user = true
      )
  LOOP
    -- Delete user data
    DELETE FROM user_subscriptions WHERE user_id = user_record.id;
    DELETE FROM notifications WHERE user_id = user_record.id;
    DELETE FROM bookmarks WHERE user_id = user_record.id;
    DELETE FROM profiles WHERE id = user_record.id;
    DELETE FROM auth.users WHERE id = user_record.id;
    
    deleted_count := deleted_count + 1;
    RAISE NOTICE 'Deleted abandoned signup: % (%)', user_record.id, user_record.email;
  END LOOP;
  
  RAISE NOTICE 'Cleanup complete. Deleted % abandoned accounts.', deleted_count;
END;
$$;

-- Schedule cleanup to run daily at 3 AM UTC
SELECT cron.schedule(
  'cleanup-abandoned-signups',
  '0 3 * * *',
  $$SELECT public.cleanup_abandoned_signups()$$
);
