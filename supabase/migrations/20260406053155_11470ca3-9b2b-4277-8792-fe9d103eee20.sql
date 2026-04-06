
-- Table to pre-register promotional access for emails before they sign up
CREATE TABLE IF NOT EXISTS public.pre_registered_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  grant_type TEXT NOT NULL DEFAULT 'promotional', -- 'promotional', 'lifetime', etc.
  duration_days INTEGER NOT NULL DEFAULT 90,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  redeemed_at TIMESTAMPTZ,
  redeemed_by UUID
);

ALTER TABLE public.pre_registered_grants ENABLE ROW LEVEL SECURITY;

-- Only admins can view/manage grants
CREATE POLICY "Admins can manage pre_registered_grants"
  ON public.pre_registered_grants
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );

-- Trigger: when a new profile is created, check for pre-registered grants
CREATE OR REPLACE FUNCTION public.apply_pre_registered_grant()
RETURNS TRIGGER AS $$
DECLARE
  grant_record RECORD;
BEGIN
  SELECT * INTO grant_record
  FROM public.pre_registered_grants
  WHERE email = NEW.email
    AND redeemed_at IS NULL
  LIMIT 1;

  IF FOUND THEN
    -- Apply promotional access
    UPDATE public.profiles
    SET promotional_access_expires_at = now() + (grant_record.duration_days || ' days')::interval,
        subscription_tier = 'premium',
        subscription_status = 'active'
    WHERE id = NEW.id;

    -- Mark grant as redeemed
    UPDATE public.pre_registered_grants
    SET redeemed_at = now(), redeemed_by = NEW.id
    WHERE id = grant_record.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trg_apply_pre_registered_grant
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.apply_pre_registered_grant();
