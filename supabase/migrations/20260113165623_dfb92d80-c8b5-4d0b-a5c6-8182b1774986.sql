-- Create pickaxe_connections table for tracking Pickaxe users
CREATE TABLE public.pickaxe_connections (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    pickaxe_email TEXT NOT NULL UNIQUE,
    pickaxe_name TEXT,
    pickaxe_picture TEXT,
    is_paid_user BOOLEAN DEFAULT false,
    spend_cents INTEGER DEFAULT 0,
    total_uses INTEGER DEFAULT 0,
    pickaxe_created_at TIMESTAMPTZ,
    pickaxe_active_at TIMESTAMPTZ,
    synced_at TIMESTAMPTZ DEFAULT now(),
    email_sent_at TIMESTAMPTZ,
    access_granted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pickaxe_connections ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage all connections
CREATE POLICY "Service role can manage pickaxe_connections"
ON public.pickaxe_connections
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Users can view their own connection
CREATE POLICY "Users can view own pickaxe connection"
ON public.pickaxe_connections
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Create index for email lookups
CREATE INDEX idx_pickaxe_connections_email ON public.pickaxe_connections(pickaxe_email);
CREATE INDEX idx_pickaxe_connections_user_id ON public.pickaxe_connections(user_id);

-- Create email campaign logs table
CREATE TABLE public.email_campaign_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_name TEXT NOT NULL,
    recipient_email TEXT NOT NULL,
    recipient_name TEXT,
    email_type TEXT NOT NULL, -- 'paid_access' or 'subscription_promo'
    status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed'
    error_message TEXT,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_campaign_logs ENABLE ROW LEVEL SECURITY;

-- Only service role can manage email logs
CREATE POLICY "Service role can manage email_campaign_logs"
ON public.email_campaign_logs
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);