
-- Table for pre-approved members (people invited by email before they have accounts)
CREATE TABLE public.church_preapproved_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  invited_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  claimed_at TIMESTAMPTZ,
  UNIQUE(church_id, email)
);

-- Enable RLS
ALTER TABLE public.church_preapproved_members ENABLE ROW LEVEL SECURITY;

-- Admins/leaders of the church can manage pre-approved members
CREATE POLICY "Church admins can manage preapproved members"
ON public.church_preapproved_members
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.church_members cm
    WHERE cm.church_id = church_preapproved_members.church_id
      AND cm.user_id = auth.uid()
      AND cm.role IN ('admin', 'leader')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.church_members cm
    WHERE cm.church_id = church_preapproved_members.church_id
      AND cm.user_id = auth.uid()
      AND cm.role IN ('admin', 'leader')
  )
);

-- Members can see their own preapproval record
CREATE POLICY "Users can view own preapproval"
ON public.church_preapproved_members
FOR SELECT
TO authenticated
USING (
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Trigger function: when a new user signs up, check if their email is pre-approved
CREATE OR REPLACE FUNCTION public.auto_join_preapproved_church()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
      VALUES (preapproval.church_id, NEW.id, preapproval.role);
    END IF;

    -- Mark as claimed
    UPDATE public.church_preapproved_members
    SET claimed_at = now()
    WHERE id = preapproval.id;
  END LOOP;

  RETURN NEW;
END;
$$;

-- Attach trigger to auth.users on insert (new signups)
CREATE TRIGGER on_auth_user_created_check_preapproval
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.auto_join_preapproved_church();
