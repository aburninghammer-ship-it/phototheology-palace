
CREATE TABLE public.pre_approved_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  access_type text NOT NULL DEFAULT 'lifetime',
  granted_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  redeemed_at timestamptz,
  redeemed_by uuid
);

ALTER TABLE public.pre_approved_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage pre_approved_emails"
  ON public.pre_approved_emails
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

CREATE OR REPLACE FUNCTION public.check_pre_approved_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  approved RECORD;
  user_email text;
BEGIN
  SELECT email INTO user_email FROM auth.users WHERE id = NEW.id;
  
  SELECT * INTO approved
  FROM public.pre_approved_emails
  WHERE email = user_email AND redeemed_at IS NULL;

  IF FOUND THEN
    UPDATE public.profiles
    SET 
      subscription_tier = 'premium',
      subscription_status = 'active',
      has_lifetime_access = true,
      lifetime_access_granted_at = now(),
      updated_at = now()
    WHERE id = NEW.id;

    UPDATE public.pre_approved_emails
    SET redeemed_at = now(), redeemed_by = NEW.id
    WHERE id = approved.id;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_check_pre_approved_email
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.check_pre_approved_email();
