
-- ═══════════════════════════════════════════════════════════
-- FRIDAY NIGHT GAME NIGHT — Guest Access & Lead Generation
-- ═══════════════════════════════════════════════════════════

-- Invitations created by hosts
CREATE TABLE public.game_night_invites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  host_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invite_code TEXT NOT NULL UNIQUE,
  guest_name TEXT,
  guest_email TEXT,
  allowed_games TEXT[] NOT NULL DEFAULT '{}',
  max_uses INTEGER NOT NULL DEFAULT 1,
  times_used INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ -- auto-set to end of current game night window
);

-- Guest sessions (tracks each guest play session)
CREATE TABLE public.game_night_guests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invite_id UUID NOT NULL REFERENCES public.game_night_invites(id) ON DELETE CASCADE,
  guest_email TEXT NOT NULL,
  guest_name TEXT,
  session_token TEXT NOT NULL UNIQUE,
  games_played TEXT[] NOT NULL DEFAULT '{}',
  total_play_time_minutes INTEGER NOT NULL DEFAULT 0,
  first_played_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_active_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  converted_to_user BOOLEAN NOT NULL DEFAULT false,
  converted_at TIMESTAMPTZ,
  converted_user_id UUID
);

-- Follow-up tracking for guest email sequences
CREATE TABLE public.game_night_follow_ups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id UUID NOT NULL REFERENCES public.game_night_guests(id) ON DELETE CASCADE,
  follow_up_type TEXT NOT NULL, -- 'immediate', 'drip_day1', 'drip_day2', 'drip_day3', 'weekly_reminder'
  scheduled_for TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'cancelled'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for quick lookups
CREATE INDEX idx_game_night_invites_code ON public.game_night_invites(invite_code);
CREATE INDEX idx_game_night_invites_host ON public.game_night_invites(host_user_id);
CREATE INDEX idx_game_night_guests_email ON public.game_night_guests(guest_email);
CREATE INDEX idx_game_night_guests_token ON public.game_night_guests(session_token);
CREATE INDEX idx_game_night_follow_ups_status ON public.game_night_follow_ups(status, scheduled_for);

-- Enable RLS
ALTER TABLE public.game_night_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_night_guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_night_follow_ups ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Hosts manage their own invites
CREATE POLICY "Hosts can manage their invites"
  ON public.game_night_invites FOR ALL
  TO authenticated
  USING (host_user_id = auth.uid())
  WITH CHECK (host_user_id = auth.uid());

-- Guests table: hosts can view guests from their invites
CREATE POLICY "Hosts can view their guests"
  ON public.game_night_guests FOR SELECT
  TO authenticated
  USING (invite_id IN (
    SELECT id FROM public.game_night_invites WHERE host_user_id = auth.uid()
  ));

-- Allow anonymous insert for guest registration (guest doesn't have an account)
CREATE POLICY "Anyone can register as guest"
  ON public.game_night_guests FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous update for guest activity tracking
CREATE POLICY "Guests can update their session"
  ON public.game_night_guests FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow anon to read invite details (for validation)
CREATE POLICY "Anyone can read active invites"
  ON public.game_night_invites FOR SELECT
  TO anon
  USING (is_active = true);

-- Follow-ups: hosts can view, service role manages
CREATE POLICY "Hosts can view follow-ups for their guests"
  ON public.game_night_follow_ups FOR SELECT
  TO authenticated
  USING (guest_id IN (
    SELECT g.id FROM public.game_night_guests g
    JOIN public.game_night_invites i ON i.id = g.invite_id
    WHERE i.host_user_id = auth.uid()
  ));

-- Admin access for all game night tables
CREATE POLICY "Admins can manage all invites"
  ON public.game_night_invites FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all guests"
  ON public.game_night_guests FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all follow-ups"
  ON public.game_night_follow_ups FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- Helper function: Check if it's currently Friday Game Night (6pm-1am ET)
CREATE OR REPLACE FUNCTION public.is_game_night_active()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    EXTRACT(DOW FROM now() AT TIME ZONE 'America/New_York') = 5 
    AND EXTRACT(HOUR FROM now() AT TIME ZONE 'America/New_York') >= 18
  OR
    EXTRACT(DOW FROM now() AT TIME ZONE 'America/New_York') = 6
    AND EXTRACT(HOUR FROM now() AT TIME ZONE 'America/New_York') < 1;
$$;

-- Helper function: Generate unique invite code
CREATE OR REPLACE FUNCTION public.generate_game_night_invite_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  code TEXT;
  attempts INT := 0;
BEGIN
  LOOP
    code := 'FN' || UPPER(SUBSTRING(MD5(random()::TEXT || NOW()::TEXT) FROM 1 FOR 6));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.game_night_invites WHERE invite_code = code);
    attempts := attempts + 1;
    IF attempts > 100 THEN
      RAISE EXCEPTION 'Failed to generate unique invite code';
    END IF;
  END LOOP;
  RETURN code;
END;
$$;
