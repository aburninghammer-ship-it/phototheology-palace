
-- Update handle_new_user to auto-link pre-approved church members
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  v_supabase_url text;
  v_anon_key text;
  v_church_id uuid;
  v_church_tier text;
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', 'user_' || substring(new.id::text from 1 for 8)),
    COALESCE(new.raw_user_meta_data->>'display_name', 'User'),
    new.raw_user_meta_data->>'avatar_url'
  );

  -- Auto-link pre-approved church members
  -- Check if this user's email matches any pre-approved church member
  SELECT cpm.church_id, c.tier::text
  INTO v_church_id, v_church_tier
  FROM public.church_preapproved_members cpm
  JOIN public.churches c ON c.id = cpm.church_id
  WHERE lower(cpm.email) = lower(new.email)
    AND cpm.claimed_at IS NULL
    AND c.subscription_status = 'active'
  LIMIT 1;

  IF v_church_id IS NOT NULL THEN
    -- Add user to church_members
    INSERT INTO public.church_members (church_id, user_id, role)
    VALUES (v_church_id, new.id, 'member')
    ON CONFLICT DO NOTHING;

    -- Mark pre-approved record as claimed
    UPDATE public.church_preapproved_members
    SET claimed_at = now()
    WHERE lower(email) = lower(new.email)
      AND church_id = v_church_id;

    -- Set profile to active church member (bypasses trial/payment gate)
    UPDATE public.profiles
    SET subscription_status = 'active',
        subscription_tier = COALESCE(v_church_tier, 'premium'),
        payment_source = 'church',
        updated_at = now()
    WHERE id = new.id;
  END IF;

  -- Try to send signup notification (non-critical)
  BEGIN
    v_supabase_url := current_setting('app.supabase_url', true);
    v_anon_key := current_setting('app.supabase_anon_key', true);
    
    IF v_supabase_url IS NOT NULL AND v_anon_key IS NOT NULL THEN
      PERFORM net.http_post(
        url := v_supabase_url || '/functions/v1/send-signup-notification',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || v_anon_key
        ),
        body := jsonb_build_object(
          'userEmail', new.email,
          'displayName', COALESCE(new.raw_user_meta_data->>'display_name', 'User'),
          'userId', new.id::text,
          'subscriptionTier', CASE WHEN v_church_id IS NOT NULL THEN 'church' ELSE NULL END
        )
      );
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Failed to send signup notification: %', SQLERRM;
  END;
  
  RETURN new;
END;
$function$;
