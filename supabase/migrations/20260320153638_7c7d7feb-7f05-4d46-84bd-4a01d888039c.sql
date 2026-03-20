CREATE OR REPLACE FUNCTION public.trg_check_pre_approved_email()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  approved RECORD;
  user_email text;
BEGIN
  SELECT email INTO user_email FROM auth.users WHERE id = NEW.id;
  
  SELECT * INTO approved
  FROM public.pre_approved_emails
  WHERE email = user_email AND redeemed_at IS NULL;

  IF FOUND THEN
    IF approved.access_type = 'lifetime' OR approved.access_type IS NULL THEN
      UPDATE public.profiles
      SET 
        subscription_tier = 'premium',
        subscription_status = 'active',
        has_lifetime_access = true,
        lifetime_access_granted_at = now(),
        access_code_used = 'pre_approved',
        updated_at = now()
      WHERE id = NEW.id;
    ELSIF approved.access_type LIKE 'promotional_%_days' THEN
      -- Extract day count from access_type like 'promotional_7_days'
      DECLARE
        days_str text;
        days_count int;
      BEGIN
        days_str := replace(replace(approved.access_type, 'promotional_', ''), '_days', '');
        days_count := days_str::int;
        
        UPDATE public.profiles
        SET 
          subscription_tier = 'premium',
          subscription_status = 'active',
          promotional_access_expires_at = now() + (days_count || ' days')::interval,
          access_code_used = 'winback_7day',
          updated_at = now()
        WHERE id = NEW.id;
      END;
    ELSIF approved.access_type LIKE 'promotional_%_months' THEN
      -- Extract month count from access_type like 'promotional_2_months'
      DECLARE
        months_str text;
        months_count int;
      BEGIN
        months_str := replace(replace(approved.access_type, 'promotional_', ''), '_months', '');
        months_count := months_str::int;
        
        UPDATE public.profiles
        SET 
          subscription_tier = 'premium',
          subscription_status = 'active',
          promotional_access_expires_at = now() + (months_count || ' months')::interval,
          updated_at = now()
        WHERE id = NEW.id;
      END;
    ELSE
      -- Default: grant premium active
      UPDATE public.profiles
      SET 
        subscription_tier = 'premium',
        subscription_status = 'active',
        updated_at = now()
      WHERE id = NEW.id;
    END IF;

    UPDATE public.pre_approved_emails
    SET redeemed_at = now(), redeemed_by = NEW.id
    WHERE id = approved.id;
  END IF;

  RETURN NEW;
END;
$function$;