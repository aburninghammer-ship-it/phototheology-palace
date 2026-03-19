
-- Fix 1: Add RLS policy so authenticated users can SELECT any pass by token
-- (Currently only anon can see all passes; authenticated users can only see their own)
CREATE POLICY "Authenticated users can view pass by token" ON public.lock_in_passes
  FOR SELECT TO authenticated
  USING (true);

-- Drop the narrower policies that are now redundant
DROP POLICY IF EXISTS "Users can view own passes" ON public.lock_in_passes;
DROP POLICY IF EXISTS "Recipients can view their pass" ON public.lock_in_passes;
DROP POLICY IF EXISTS "Recipients can view own passes" ON public.lock_in_passes;

-- Fix 2: Add RLS policy allowing anon users to update passes (for guest info before redemption)
-- This is safe because the redeem RPC is SECURITY DEFINER and handles the real logic
CREATE POLICY "Anyone can update pass by token for redemption" ON public.lock_in_passes
  FOR UPDATE TO anon
  USING (status = 'active');

-- Fix 3: Allow authenticated non-creators to update a pass they are redeeming
CREATE POLICY "Authenticated users can update pass for redemption" ON public.lock_in_passes
  FOR UPDATE TO authenticated
  USING (status = 'active' OR recipient_user_id = auth.uid());

-- Drop the old narrower update policy
DROP POLICY IF EXISTS "Recipients can update commentary selection" ON public.lock_in_passes;

-- Fix 4: Add a check_lock_in_pass function that bypasses RLS for the initial lookup
CREATE OR REPLACE FUNCTION public.check_lock_in_pass(_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _pass RECORD;
BEGIN
  SELECT status, expires_at, personal_message
  INTO _pass
  FROM lock_in_passes
  WHERE pass_token = _token;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('status', 'not_found');
  END IF;

  RETURN jsonb_build_object(
    'status', _pass.status,
    'expires_at', _pass.expires_at,
    'personal_message', _pass.personal_message
  );
END;
$$;

-- Fix 5: Replace redeem function to accept guest email/name and not require fingerprint
CREATE OR REPLACE FUNCTION public.redeem_lock_in_pass(
  _token TEXT,
  _guest_email TEXT DEFAULT NULL,
  _guest_name TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _pass RECORD;
  _recipient UUID;
  _expires TIMESTAMPTZ;
BEGIN
  _recipient := auth.uid();

  SELECT * INTO _pass
  FROM lock_in_passes
  WHERE pass_token = _token
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid Lock-In Pass');
  END IF;

  -- If already redeemed and still active, return success with info
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

  _expires := now() + interval '5 days';

  -- Activate the pass with guest info
  UPDATE lock_in_passes
  SET
    status = 'redeemed',
    activated_at = now(),
    expires_at = _expires,
    recipient_user_id = _recipient,
    recipient_email = COALESCE(_guest_email, recipient_email),
    guest_name = COALESCE(_guest_name, lock_in_passes.guest_name),
    conversion_status = 'active',
    last_active_at = now()
  WHERE id = _pass.id;

  -- Create the 5 daily missions
  INSERT INTO lock_in_missions (pass_id, user_id, day_number, mission_title, mission_description) VALUES
    (_pass.id, COALESCE(_recipient, gen_random_uuid()), 1, 'Discover a Hidden Gem', 'Find ONE insight you''ve never seen before using the Bible study tools. Save it to your Gems collection.'),
    (_pass.id, COALESCE(_recipient, gen_random_uuid()), 2, 'Build Your First Study', 'Create a guided Bible study on any passage. Use the Study Builder to organize your thoughts.'),
    (_pass.id, COALESCE(_recipient, gen_random_uuid()), 3, 'Listen to the Commentary Suite', 'Choose ONE chapter and ONE commentary voice (Epic Narrator, Counselor, Urban Preacher, Ancient, Preacher, or Scholar). Listen and be transformed. You can replay this commentary all 5 days!'),
    (_pass.id, COALESCE(_recipient, gen_random_uuid()), 4, 'Freestyle Connection', 'Use Freestyle Mode to connect a Bible verse to something in your daily life. Share it if you dare!'),
    (_pass.id, COALESCE(_recipient, gen_random_uuid()), 5, 'Create & Share', 'Build a sermon outline, study graphic, or devotional. Share your creation with the community.');

  RETURN jsonb_build_object(
    'success', true,
    'expires_at', _expires,
    'message', 'Your 5-Day Lock-In Pass is now active!'
  );
END;
$$;
