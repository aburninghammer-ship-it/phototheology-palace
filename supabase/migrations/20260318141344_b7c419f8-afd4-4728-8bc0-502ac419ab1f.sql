
-- Add audio commentary selection to lock_in_passes
ALTER TABLE public.lock_in_passes
  ADD COLUMN commentary_book TEXT,
  ADD COLUMN commentary_chapter INTEGER,
  ADD COLUMN commentary_mode TEXT CHECK (commentary_mode IN ('epic', 'urban', 'counselor', 'ancient', 'preacher', 'scholar'));

-- Update the redeem function to include the audio commentary mission
CREATE OR REPLACE FUNCTION public.redeem_lock_in_pass(_token TEXT)
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
    AND status = 'active'
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid or already redeemed pass');
  END IF;

  _expires := now() + interval '5 days';

  UPDATE lock_in_passes
  SET 
    status = 'redeemed',
    activated_at = now(),
    expires_at = _expires,
    recipient_user_id = _recipient
  WHERE id = _pass.id;

  -- Create the 5 daily missions (now includes audio commentary on Day 3)
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
