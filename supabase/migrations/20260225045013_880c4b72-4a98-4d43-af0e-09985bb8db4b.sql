
-- Table to store emails that should receive lifetime access on signup
CREATE TABLE public.pending_lifetime_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  granted_by TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  claimed_at TIMESTAMPTZ,
  claimed_by UUID
);

ALTER TABLE public.pending_lifetime_grants ENABLE ROW LEVEL SECURITY;

-- Only admins can view/manage
CREATE POLICY "Admins can manage lifetime grants"
ON public.pending_lifetime_grants
FOR ALL
USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

-- Create trigger function to auto-grant lifetime on signup
CREATE OR REPLACE FUNCTION public.auto_grant_lifetime_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  grant_record RECORD;
BEGIN
  SELECT * INTO grant_record
  FROM public.pending_lifetime_grants
  WHERE LOWER(email) = LOWER(NEW.email)
    AND claimed_at IS NULL;

  IF FOUND THEN
    -- Update profile with lifetime access
    UPDATE public.profiles
    SET 
      subscription_tier = 'premium',
      subscription_status = 'active',
      has_lifetime_access = true,
      lifetime_access_granted_at = now(),
      updated_at = now()
    WHERE id = NEW.id;

    -- Mark grant as claimed
    UPDATE public.pending_lifetime_grants
    SET claimed_at = now(), claimed_by = NEW.id
    WHERE id = grant_record.id;
  END IF;

  RETURN NEW;
END;
$$;

-- Attach trigger to auth.users (fires after insert, same as pre-approved church trigger)
CREATE TRIGGER on_signup_grant_lifetime
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_grant_lifetime_access();

-- Insert the pending grant for friendministry@yahoo.com
INSERT INTO public.pending_lifetime_grants (email, granted_by)
VALUES ('friendministry@yahoo.com', 'admin');
