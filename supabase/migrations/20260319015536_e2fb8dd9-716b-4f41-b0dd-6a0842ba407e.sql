
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
  _activated_count INTEGER;
  _max_passes INTEGER := 5;
  _new_pass RECORD;
  _month_start TIMESTAMPTZ;
  _month_end TIMESTAMPTZ;
BEGIN
  _user_id := auth.uid();
  IF _user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  -- Count only ACTIVATED passes this month (not just created)
  _month_start := date_trunc('month', now());
  _month_end := _month_start + interval '1 month';

  SELECT count(*) INTO _activated_count
  FROM lock_in_passes
  WHERE created_by = _user_id
    AND activated_at IS NOT NULL
    AND created_at >= _month_start
    AND created_at < _month_end;

  IF _activated_count >= _max_passes THEN
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

  RETURN jsonb_build_object(
    'success', true,
    'pass_id', _new_pass.id,
    'pass_token', _new_pass.pass_token,
    'passes_remaining', _max_passes - _activated_count
  );
END;
$$;
