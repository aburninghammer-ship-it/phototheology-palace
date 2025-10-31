-- Fix search_path security issue
CREATE OR REPLACE FUNCTION public.redeem_access_code(code_input text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  code_record RECORD;
  user_profile RECORD;
  current_user_id UUID;
BEGIN
  -- Check if user is authenticated
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'You must be logged in to redeem an access code');
  END IF;

  -- Get the code details
  SELECT * INTO code_record
  FROM public.special_access_codes
  WHERE code = code_input
    AND (expires_at > now() OR expires_at IS NULL)
    AND (max_uses IS NULL OR uses < max_uses);

  -- Check if code exists and is valid
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid or expired code');
  END IF;

  -- Get user profile
  SELECT * INTO user_profile
  FROM public.profiles
  WHERE id = current_user_id;

  -- Update uses count
  UPDATE public.special_access_codes
  SET uses = uses + 1
  WHERE code = code_input;

  -- Grant lifetime or temporary access
  IF code_record.is_lifetime THEN
    -- Grant lifetime access (set expiry to far future)
    UPDATE public.profiles
    SET 
      subscription_tier = 'premium',
      promotional_expires_at = '2099-12-31'::timestamp,
      updated_at = now()
    WHERE id = current_user_id;
    
    RETURN jsonb_build_object(
      'success', true, 
      'message', 'Lifetime access granted!',
      'access_type', 'lifetime'
    );
  ELSE
    -- Grant temporary access based on duration
    UPDATE public.profiles
    SET 
      subscription_tier = 'premium',
      promotional_expires_at = now() + (COALESCE(code_record.access_duration_months, 1) || ' months')::interval,
      updated_at = now()
    WHERE id = current_user_id;
    
    RETURN jsonb_build_object(
      'success', true, 
      'message', 'Access granted!',
      'access_type', 'temporary',
      'duration_months', code_record.access_duration_months
    );
  END IF;
END;
$$;