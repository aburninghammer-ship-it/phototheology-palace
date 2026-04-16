CREATE OR REPLACE FUNCTION public.auto_join_preapproved_church()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  preapproval RECORD;
BEGIN
  -- Find any unclaimed pre-approval for this email
  FOR preapproval IN
    SELECT id, church_id, role
    FROM public.church_preapproved_members
    WHERE LOWER(email) = LOWER(NEW.email)
      AND claimed_at IS NULL
  LOOP
    -- Check they're not already a member
    IF NOT EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = preapproval.church_id AND user_id = NEW.id
    ) THEN
      INSERT INTO public.church_members (church_id, user_id, role)
      VALUES (preapproval.church_id, NEW.id, preapproval.role::church_member_role);
    END IF;

    -- Mark as claimed
    UPDATE public.church_preapproved_members
    SET claimed_at = now()
    WHERE id = preapproval.id;

    -- Notify admin via edge function (non-critical)
    BEGIN
      PERFORM net.http_post(
        url := current_setting('app.supabase_url', true) || '/functions/v1/send-admin-signup-email',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.supabase_anon_key', true)
        ),
        body := jsonb_build_object(
          'userName', COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
          'userEmail', NEW.email,
          'signupTime', now()::text,
          'churchMember', true,
          'churchId', preapproval.church_id::text
        )
      );
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Failed to send church member signup notification: %', SQLERRM;
    END;
  END LOOP;

  RETURN NEW;
END;
$function$;