-- Fix: lock_in_missions.user_id has a FK to auth.users, but anonymous guests
-- don't have an auth.users row. When redeem_lock_in_pass inserts missions with
-- COALESCE(auth.uid(), gen_random_uuid()), the random UUID violates the FK
-- constraint, causing the entire redemption to fail silently.

-- Step 1: Drop the FK constraint on user_id so anonymous guests can have missions
ALTER TABLE public.lock_in_missions
  DROP CONSTRAINT IF EXISTS lock_in_missions_user_id_fkey;

-- Step 2: Allow NULL user_id for anonymous guests
ALTER TABLE public.lock_in_missions
  ALTER COLUMN user_id DROP NOT NULL;

-- Step 3: Fix the redeem function to use NULL user_id for anonymous guests
-- instead of a random UUID that violates FK constraints
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

  -- Create the 5 daily missions (user_id is NULL for anonymous guests)
  INSERT INTO lock_in_missions (pass_id, user_id, day_number, mission_title, mission_description) VALUES
    (_pass.id, _recipient, 1, 'Discover a Hidden Gem', 'Find ONE insight you''ve never seen before using the Bible study tools. Save it to your Gems collection.'),
    (_pass.id, _recipient, 2, 'Build Your First Study', 'Create a guided Bible study on any passage. Use the Study Builder to organize your thoughts.'),
    (_pass.id, _recipient, 3, 'Listen to the Commentary Suite', 'Choose ONE chapter and ONE commentary voice (Epic Narrator, Counselor, Urban Preacher, Ancient, Preacher, or Scholar). Listen and be transformed. You can replay this commentary all 5 days!'),
    (_pass.id, _recipient, 4, 'Freestyle Connection', 'Use Freestyle Mode to connect a Bible verse to something in your daily life. Share it if you dare!'),
    (_pass.id, _recipient, 5, 'Create & Share', 'Build a sermon outline, study graphic, or devotional. Share your creation with the community.');

  RETURN jsonb_build_object(
    'success', true,
    'expires_at', _expires,
    'message', 'Your 5-Day Lock-In Pass is now active!'
  );
END;
$$;

-- Step 4: Add RLS policy so anonymous users can view missions by pass_id
-- (they identify via sessionStorage token, not auth)
CREATE POLICY "Anon can view missions by pass" ON public.lock_in_missions
  FOR SELECT TO anon
  USING (true);
