
-- Lock-In Pass system: 5-day passes members can share (5/month)

-- Main passes table
CREATE TABLE public.lock_in_passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pass_token TEXT NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex') UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'redeemed', 'expired', 'revoked')),
  recipient_email TEXT,
  recipient_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  activated_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  personal_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Daily mission progress for pass holders
CREATE TABLE public.lock_in_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pass_id UUID REFERENCES public.lock_in_passes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  day_number INTEGER NOT NULL CHECK (day_number BETWEEN 1 AND 5),
  mission_title TEXT NOT NULL,
  mission_description TEXT NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (pass_id, day_number)
);

-- Monthly invite tracking
CREATE TABLE public.lock_in_monthly_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  month_year TEXT NOT NULL, -- e.g. '2026-03'
  passes_created INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, month_year)
);

-- Enable RLS
ALTER TABLE public.lock_in_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lock_in_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lock_in_monthly_usage ENABLE ROW LEVEL SECURITY;

-- RLS: Creators can see their own passes
CREATE POLICY "Users can view own passes" ON public.lock_in_passes
  FOR SELECT TO authenticated
  USING (created_by = auth.uid());

-- RLS: Creators can insert passes
CREATE POLICY "Users can create passes" ON public.lock_in_passes
  FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());

-- RLS: Anyone can view a pass by token (for redemption - anon)
CREATE POLICY "Anyone can view pass by token" ON public.lock_in_passes
  FOR SELECT TO anon
  USING (true);

-- RLS: Recipients can view their pass
CREATE POLICY "Recipients can view their pass" ON public.lock_in_passes
  FOR SELECT TO authenticated
  USING (recipient_user_id = auth.uid());

-- RLS: Missions - users can see and update their own
CREATE POLICY "Users can view own missions" ON public.lock_in_missions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own missions" ON public.lock_in_missions
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- RLS: Monthly usage - users can see their own
CREATE POLICY "Users can view own monthly usage" ON public.lock_in_monthly_usage
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Function to create a Lock-In Pass with monthly limit check
CREATE OR REPLACE FUNCTION public.create_lock_in_pass(
  _personal_message TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _user_id UUID;
  _month TEXT;
  _current_count INTEGER;
  _max_passes INTEGER := 5;
  _new_pass RECORD;
BEGIN
  _user_id := auth.uid();
  IF _user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  _month := to_char(now(), 'YYYY-MM');

  -- Get or create monthly usage
  INSERT INTO lock_in_monthly_usage (user_id, month_year, passes_created)
  VALUES (_user_id, _month, 0)
  ON CONFLICT (user_id, month_year) DO NOTHING;

  SELECT passes_created INTO _current_count
  FROM lock_in_monthly_usage
  WHERE user_id = _user_id AND month_year = _month;

  IF _current_count >= _max_passes THEN
    RETURN jsonb_build_object(
      'success', false, 
      'error', format('You''ve used all %s Lock-In Passes this month. Resets next month!', _max_passes),
      'passes_remaining', 0
    );
  END IF;

  -- Create the pass
  INSERT INTO lock_in_passes (created_by, personal_message)
  VALUES (_user_id, _personal_message)
  RETURNING * INTO _new_pass;

  -- Increment usage
  UPDATE lock_in_monthly_usage
  SET passes_created = passes_created + 1, updated_at = now()
  WHERE user_id = _user_id AND month_year = _month;

  RETURN jsonb_build_object(
    'success', true,
    'pass_token', _new_pass.pass_token,
    'passes_remaining', _max_passes - _current_count - 1
  );
END;
$$;

-- Function to redeem a Lock-In Pass
CREATE OR REPLACE FUNCTION public.redeem_lock_in_pass(
  _token TEXT,
  _user_id_or_fingerprint TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _pass RECORD;
  _expires TIMESTAMPTZ;
  _recipient UUID;
BEGIN
  -- Get the pass
  SELECT * INTO _pass
  FROM lock_in_passes
  WHERE pass_token = _token
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid Lock-In Pass');
  END IF;

  IF _pass.status = 'redeemed' AND _pass.expires_at > now() THEN
    RETURN jsonb_build_object(
      'success', true, 
      'already_active', true,
      'expires_at', _pass.expires_at
    );
  END IF;

  IF _pass.status != 'active' THEN
    RETURN jsonb_build_object('success', false, 'error', 'This Lock-In Pass has already been used or expired');
  END IF;

  _expires := now() + INTERVAL '5 days';
  _recipient := auth.uid();

  -- Activate the pass
  UPDATE lock_in_passes
  SET 
    status = 'redeemed',
    activated_at = now(),
    expires_at = _expires,
    recipient_user_id = _recipient
  WHERE id = _pass.id;

  -- Create the 5 daily missions
  INSERT INTO lock_in_missions (pass_id, user_id, day_number, mission_title, mission_description) VALUES
    (_pass.id, COALESCE(_recipient, gen_random_uuid()), 1, 'Discover a Hidden Gem', 'Find ONE insight you''ve never seen before using the Bible study tools. Save it to your Gems collection.'),
    (_pass.id, COALESCE(_recipient, gen_random_uuid()), 2, 'Build Your First Study', 'Create a guided Bible study on any passage. Use the Study Builder to organize your thoughts.'),
    (_pass.id, COALESCE(_recipient, gen_random_uuid()), 3, 'Enter the Palace', 'Explore the Memory Palace and complete one room exercise. See how Scripture comes alive visually.'),
    (_pass.id, COALESCE(_recipient, gen_random_uuid()), 4, 'Freestyle Connection', 'Use Freestyle Mode to connect a Bible verse to something in your daily life. Share it if you dare!'),
    (_pass.id, COALESCE(_recipient, gen_random_uuid()), 5, 'Create & Share', 'Build a sermon outline, study graphic, or devotional. Share your creation with the community.');

  RETURN jsonb_build_object(
    'success', true,
    'expires_at', _expires,
    'message', 'Your 5-Day Lock-In Pass is now active!'
  );
END;
$$;

-- Function to check if user has active lock-in pass
CREATE OR REPLACE FUNCTION public.get_active_lock_in_pass(_user_id_or_fingerprint TEXT DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _pass RECORD;
  _user_id UUID;
BEGIN
  _user_id := auth.uid();
  
  SELECT * INTO _pass
  FROM lock_in_passes
  WHERE (recipient_user_id = _user_id OR pass_token = _user_id_or_fingerprint)
    AND status = 'redeemed'
    AND expires_at > now()
  ORDER BY expires_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('has_pass', false);
  END IF;

  RETURN jsonb_build_object(
    'has_pass', true,
    'pass_id', _pass.id,
    'expires_at', _pass.expires_at,
    'days_left', GREATEST(0, EXTRACT(DAY FROM _pass.expires_at - now())::INTEGER + 1),
    'personal_message', _pass.personal_message
  );
END;
$$;
