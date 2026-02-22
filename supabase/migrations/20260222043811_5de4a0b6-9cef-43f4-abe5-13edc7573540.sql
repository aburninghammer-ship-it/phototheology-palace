
CREATE OR REPLACE FUNCTION public.cleanup_abandoned_signups()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_record RECORD;
  fk_record RECORD;
  deleted_count INTEGER := 0;
BEGIN
  FOR user_record IN 
    SELECT p.id, p.email
    FROM profiles p
    WHERE p.payment_source = 'manual'
      AND (p.subscription_tier IS NULL OR p.subscription_tier = 'free')
      AND (p.subscription_status IS NULL OR p.subscription_status IN ('none', 'trial', 'pending'))
      AND p.created_at < NOW() - INTERVAL '48 hours'
      AND p.has_lifetime_access = false
      AND NOT EXISTS (SELECT 1 FROM church_members cm WHERE cm.user_id = p.id)
      AND NOT EXISTS (SELECT 1 FROM patreon_connections pc WHERE pc.user_id = p.id AND pc.is_active_patron = true)
      AND NOT EXISTS (SELECT 1 FROM pickaxe_connections pk WHERE pk.pickaxe_email = p.email AND pk.is_paid_user = true)
  LOOP
    -- Dynamically delete from all public tables that reference auth.users
    FOR fk_record IN
      SELECT c.conrelid::regclass::text AS tbl, a.attname AS col
      FROM pg_constraint c
      JOIN pg_attribute a ON a.attnum = ANY(c.conkey) AND a.attrelid = c.conrelid
      JOIN pg_namespace n ON n.oid = c.connamespace
      WHERE c.confrelid = 'auth.users'::regclass
        AND c.contype = 'f'
        AND n.nspname = 'public'
    LOOP
      EXECUTE format('DELETE FROM %s WHERE %I = $1', fk_record.tbl, fk_record.col)
      USING user_record.id;
    END LOOP;

    -- Delete auth internals
    DELETE FROM auth.sessions WHERE user_id = user_record.id;
    DELETE FROM auth.mfa_factors WHERE user_id = user_record.id;
    DELETE FROM auth.one_time_tokens WHERE user_id = user_record.id;
    DELETE FROM auth.identities WHERE user_id = user_record.id;
    DELETE FROM auth.users WHERE id = user_record.id;
    
    deleted_count := deleted_count + 1;
    RAISE NOTICE 'Deleted abandoned signup: % (%)', user_record.id, user_record.email;
  END LOOP;
  
  RAISE NOTICE 'Cleanup complete. Deleted % abandoned accounts.', deleted_count;
END;
$$;
