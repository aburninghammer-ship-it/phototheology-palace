
CREATE OR REPLACE FUNCTION public.apply_pre_registered_grant()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  grant_record RECORD;
BEGIN
  SELECT * INTO grant_record
  FROM public.pre_registered_grants
  WHERE LOWER(email) = LOWER(NEW.email)
    AND redeemed_at IS NULL
  LIMIT 1;

  IF FOUND THEN
    IF grant_record.grant_type = 'lifetime' THEN
      -- Grant lifetime access
      UPDATE public.profiles
      SET has_lifetime_access = true,
          lifetime_access_granted_at = now(),
          subscription_tier = 'premium',
          subscription_status = 'active',
          updated_at = now()
      WHERE id = NEW.id;

      -- Also update user_subscriptions
      INSERT INTO public.user_subscriptions (user_id, subscription_status, subscription_tier, has_lifetime_access)
      VALUES (NEW.id, 'active', 'premium', true)
      ON CONFLICT (user_id) DO UPDATE SET
        subscription_status = 'active',
        subscription_tier = 'premium',
        has_lifetime_access = true,
        updated_at = now();
    ELSE
      -- Grant time-limited promotional access
      UPDATE public.profiles
      SET promotional_access_expires_at = now() + (grant_record.duration_days || ' days')::interval,
          subscription_tier = 'premium',
          subscription_status = 'active',
          updated_at = now()
      WHERE id = NEW.id;

      INSERT INTO public.user_subscriptions (user_id, subscription_status, subscription_tier, promotional_access_expires_at)
      VALUES (NEW.id, 'active', 'premium', now() + (grant_record.duration_days || ' days')::interval)
      ON CONFLICT (user_id) DO UPDATE SET
        subscription_status = 'active',
        subscription_tier = 'premium',
        promotional_access_expires_at = now() + (grant_record.duration_days || ' days')::interval,
        updated_at = now();
    END IF;

    -- Mark grant as redeemed
    UPDATE public.pre_registered_grants
    SET redeemed_at = now(), redeemed_by = NEW.id
    WHERE id = grant_record.id;
  END IF;

  RETURN NEW;
END;
$function$;
