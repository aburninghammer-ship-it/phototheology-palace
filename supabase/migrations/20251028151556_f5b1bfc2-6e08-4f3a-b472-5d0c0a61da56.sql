-- Create church tier enum
CREATE TYPE public.church_tier AS ENUM ('tier1', 'tier2', 'tier3');

-- Create church member role enum
CREATE TYPE public.church_member_role AS ENUM ('admin', 'leader', 'member');

-- Churches table
CREATE TABLE public.churches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tier public.church_tier NOT NULL DEFAULT 'tier1',
  max_seats INTEGER NOT NULL DEFAULT 50,
  subscription_status TEXT NOT NULL DEFAULT 'active',
  stripe_customer_id TEXT,
  billing_email TEXT NOT NULL,
  contact_person TEXT,
  contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  subscription_started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  subscription_ends_at TIMESTAMP WITH TIME ZONE,
  branded_name TEXT,
  logo_url TEXT
);

-- Church members table (links users to churches)
CREATE TABLE public.church_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.church_member_role NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  invited_by UUID REFERENCES auth.users(id),
  UNIQUE(church_id, user_id)
);

-- Church invitations table
CREATE TABLE public.church_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  invited_email TEXT NOT NULL,
  invitation_code TEXT NOT NULL UNIQUE,
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  role public.church_member_role NOT NULL DEFAULT 'member',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(church_id, invited_email)
);

-- Church campaigns (church-wide study challenges)
CREATE TABLE public.church_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES public.challenges(id),
  title TEXT NOT NULL,
  description TEXT,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Church campaign participation tracking
CREATE TABLE public.church_campaign_participation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.church_campaigns(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(campaign_id, user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_campaign_participation ENABLE ROW LEVEL SECURITY;

-- RLS Policies for churches
CREATE POLICY "Church admins can view their church"
  ON public.churches FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_members.church_id = churches.id
        AND church_members.user_id = auth.uid()
        AND church_members.role = 'admin'
    )
  );

CREATE POLICY "Church admins can update their church"
  ON public.churches FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_members.church_id = churches.id
        AND church_members.user_id = auth.uid()
        AND church_members.role = 'admin'
    )
  );

-- RLS Policies for church_members
CREATE POLICY "Members can view their church members"
  ON public.church_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members cm
      WHERE cm.church_id = church_members.church_id
        AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert church members"
  ON public.church_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_members.church_id = church_members.church_id
        AND church_members.user_id = auth.uid()
        AND church_members.role = 'admin'
    )
  );

CREATE POLICY "Admins can update church members"
  ON public.church_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members cm
      WHERE cm.church_id = church_members.church_id
        AND cm.user_id = auth.uid()
        AND cm.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete church members"
  ON public.church_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members cm
      WHERE cm.church_id = church_members.church_id
        AND cm.user_id = auth.uid()
        AND cm.role = 'admin'
    )
  );

-- RLS Policies for church_invitations
CREATE POLICY "Admins and leaders can view invitations"
  ON public.church_invitations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_members.church_id = church_invitations.church_id
        AND church_members.user_id = auth.uid()
        AND church_members.role IN ('admin', 'leader')
    )
  );

CREATE POLICY "Admins and leaders can create invitations"
  ON public.church_invitations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_members.church_id = church_invitations.church_id
        AND church_members.user_id = auth.uid()
        AND church_members.role IN ('admin', 'leader')
    )
  );

CREATE POLICY "Admins can delete invitations"
  ON public.church_invitations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_members.church_id = church_invitations.church_id
        AND church_members.user_id = auth.uid()
        AND church_members.role = 'admin'
    )
  );

-- RLS Policies for church_campaigns
CREATE POLICY "Church members can view campaigns"
  ON public.church_campaigns FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_members.church_id = church_campaigns.church_id
        AND church_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Leaders can create campaigns"
  ON public.church_campaigns FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_members.church_id = church_campaigns.church_id
        AND church_members.user_id = auth.uid()
        AND church_members.role IN ('admin', 'leader')
    )
  );

CREATE POLICY "Leaders can update campaigns"
  ON public.church_campaigns FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_members.church_id = church_campaigns.church_id
        AND church_members.user_id = auth.uid()
        AND church_members.role IN ('admin', 'leader')
    )
  );

-- RLS Policies for church_campaign_participation
CREATE POLICY "Members can view campaign participation"
  ON public.church_campaign_participation FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.church_campaigns cc
      JOIN public.church_members cm ON cm.church_id = cc.church_id
      WHERE cc.id = church_campaign_participation.campaign_id
        AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can track their own participation"
  ON public.church_campaign_participation FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Members can update their own participation"
  ON public.church_campaign_participation FOR UPDATE
  USING (auth.uid() = user_id);

-- Helper function to check if user is church admin
CREATE OR REPLACE FUNCTION public.is_church_admin(_user_id UUID, _church_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.church_members
    WHERE church_id = _church_id
      AND user_id = _user_id
      AND role = 'admin'
  )
$$;

-- Helper function to get available seats for a church
CREATE OR REPLACE FUNCTION public.get_available_seats(_church_id UUID)
RETURNS INTEGER
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.max_seats - COUNT(cm.id)::INTEGER
  FROM public.churches c
  LEFT JOIN public.church_members cm ON cm.church_id = c.id
  WHERE c.id = _church_id
  GROUP BY c.max_seats
$$;

-- Helper function to check church access (for useSubscription hook)
CREATE OR REPLACE FUNCTION public.has_church_access(_user_id UUID)
RETURNS TABLE (
  has_access BOOLEAN,
  church_id UUID,
  church_tier TEXT,
  role TEXT
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    CASE 
      WHEN c.subscription_status = 'active' 
        AND (c.subscription_ends_at IS NULL OR c.subscription_ends_at > NOW())
      THEN true
      ELSE false
    END as has_access,
    c.id as church_id,
    c.tier::TEXT as church_tier,
    cm.role::TEXT as role
  FROM public.church_members cm
  JOIN public.churches c ON c.id = cm.church_id
  WHERE cm.user_id = _user_id
  LIMIT 1
$$;

-- Function to accept church invitation
CREATE OR REPLACE FUNCTION public.accept_church_invitation(_invitation_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  invitation_record church_invitations;
  available_seats INTEGER;
  user_id UUID;
BEGIN
  user_id := auth.uid();
  
  IF user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  
  -- Get invitation
  SELECT * INTO invitation_record
  FROM church_invitations
  WHERE invitation_code = _invitation_code
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid invitation code');
  END IF;
  
  IF invitation_record.status != 'pending' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invitation already used');
  END IF;
  
  IF invitation_record.expires_at < NOW() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invitation expired');
  END IF;
  
  -- Check seat availability
  available_seats := get_available_seats(invitation_record.church_id);
  
  IF available_seats <= 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'No seats available. Church needs to upgrade.');
  END IF;
  
  -- Add user to church
  INSERT INTO church_members (church_id, user_id, role, invited_by)
  VALUES (
    invitation_record.church_id,
    user_id,
    invitation_record.role,
    invitation_record.invited_by
  );
  
  -- Mark invitation as accepted
  UPDATE church_invitations
  SET status = 'accepted', accepted_at = NOW()
  WHERE id = invitation_record.id;
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Successfully joined church!',
    'church_id', invitation_record.church_id
  );
END;
$$;

-- Trigger to update church updated_at
CREATE OR REPLACE FUNCTION public.update_church_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_churches_updated_at
  BEFORE UPDATE ON public.churches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_church_updated_at();

-- Indexes for performance
CREATE INDEX idx_church_members_user_id ON public.church_members(user_id);
CREATE INDEX idx_church_members_church_id ON public.church_members(church_id);
CREATE INDEX idx_church_invitations_code ON public.church_invitations(invitation_code);
CREATE INDEX idx_church_invitations_church_id ON public.church_invitations(church_id);
CREATE INDEX idx_church_campaigns_church_id ON public.church_campaigns(church_id);
CREATE INDEX idx_church_campaign_participation_campaign_id ON public.church_campaign_participation(campaign_id);
CREATE INDEX idx_church_campaign_participation_user_id ON public.church_campaign_participation(user_id);