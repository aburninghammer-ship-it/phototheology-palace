
-- Create table to store all Patreon members (synced from API)
CREATE TABLE public.patreon_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patreon_id TEXT NOT NULL UNIQUE,
  email TEXT,
  full_name TEXT,
  patron_status TEXT, -- 'active_patron', 'declined_patron', 'former_patron', 'free_member'
  pledge_cents INTEGER DEFAULT 0,
  lifetime_support_cents INTEGER DEFAULT 0,
  last_charge_status TEXT,
  last_charge_date TIMESTAMP WITH TIME ZONE,
  is_follower BOOLEAN DEFAULT false,
  joined_at TIMESTAMP WITH TIME ZONE,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for email lookups
CREATE INDEX idx_patreon_members_email ON public.patreon_members(email);
CREATE INDEX idx_patreon_members_patron_status ON public.patreon_members(patron_status);

-- Enable RLS
ALTER TABLE public.patreon_members ENABLE ROW LEVEL SECURITY;

-- Only admins can view
CREATE POLICY "Admins can view patreon members"
ON public.patreon_members
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);
