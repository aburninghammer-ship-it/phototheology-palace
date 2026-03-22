
-- 1. Drop FK constraint on lock_in_missions.user_id
ALTER TABLE public.lock_in_missions
  DROP CONSTRAINT IF EXISTS lock_in_missions_user_id_fkey;

-- 2. Make user_id nullable for anonymous guests
ALTER TABLE public.lock_in_missions
  ALTER COLUMN user_id DROP NOT NULL;

-- 3. Update redeem function to pass NULL for anonymous users
CREATE OR REPLACE FUNCTION public.redeem_lock_in_pass(_token text, _user_id_or_fingerprint text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _pass RECORD;
  _expires TIMESTAMPTZ;
  _recipient UUID;
BEGIN
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
  _recipient := auth.uid(); -- NULL for anonymous guests

  UPDATE lock_in_passes
  SET 
    status = 'redeemed',
    activated_at = now(),
    expires_at = _expires,
    recipient_user_id = _recipient
  WHERE id = _pass.id;

  -- Create 5 daily missions with NULL user_id for anonymous guests
  INSERT INTO lock_in_missions (pass_id, user_id, day_number, mission_title, mission_description) VALUES
    (_pass.id, _recipient, 1, 'Discover a Hidden Gem', 'Find ONE insight you''ve never seen before using the Bible study tools. Save it to your Gems collection.'),
    (_pass.id, _recipient, 2, 'Build Your First Study', 'Create a guided Bible study on any passage. Use the Study Builder to organize your thoughts.'),
    (_pass.id, _recipient, 3, 'Enter the Palace', 'Explore the Memory Palace and complete one room exercise. See how Scripture comes alive visually.'),
    (_pass.id, _recipient, 4, 'Freestyle Connection', 'Use Freestyle Mode to connect a Bible verse to something in your daily life. Share it if you dare!'),
    (_pass.id, _recipient, 5, 'Create & Share', 'Build a sermon outline, study graphic, or devotional. Share your creation with the community.');

  RETURN jsonb_build_object(
    'success', true,
    'expires_at', _expires,
    'message', 'Your 5-Day Lock-In Pass is now active!'
  );
END;
$function$;

-- 4. Add RLS policy for anonymous mission viewing by pass_id
CREATE POLICY "Anyone can view missions by pass_id"
  ON public.lock_in_missions
  FOR SELECT
  USING (true);
