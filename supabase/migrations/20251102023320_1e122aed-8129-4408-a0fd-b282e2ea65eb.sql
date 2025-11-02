-- Update redeem_access_code function to properly grant subscription_status = 'active'
CREATE OR REPLACE FUNCTION public.redeem_access_code(code_input text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
    AND is_active = true
    AND (expires_at > now() OR expires_at IS NULL)
    AND (max_uses IS NULL OR used_count < max_uses);

  -- Check if code exists and is valid
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid or expired code');
  END IF;

  -- Get user profile
  SELECT * INTO user_profile
  FROM public.profiles
  WHERE id = current_user_id;

  -- Check if user already used this specific code
  IF user_profile.access_code_used = code_input THEN
    RETURN jsonb_build_object('success', false, 'error', 'You have already redeemed this code');
  END IF;

  -- Update uses count
  UPDATE public.special_access_codes
  SET used_count = used_count + 1
  WHERE code = code_input;

  -- Grant lifetime or temporary access
  IF code_record.is_lifetime THEN
    -- Grant lifetime access with active status
    UPDATE public.profiles
    SET 
      subscription_tier = 'premium',
      subscription_status = 'active',
      has_lifetime_access = true,
      lifetime_access_granted_at = now(),
      access_code_used = code_input,
      updated_at = now()
    WHERE id = current_user_id;
    
    RETURN jsonb_build_object(
      'success', true, 
      'message', 'Lifetime premium access granted!',
      'access_type', 'lifetime'
    );
  ELSE
    -- Grant temporary access with active status
    UPDATE public.profiles
    SET 
      subscription_tier = 'premium',
      subscription_status = 'active',
      promotional_access_expires_at = now() + (COALESCE(code_record.access_duration_months, 1) || ' months')::interval,
      access_code_used = code_input,
      updated_at = now()
    WHERE id = current_user_id;
    
    RETURN jsonb_build_object(
      'success', true, 
      'message', format('Premium access granted for %s months!', COALESCE(code_record.access_duration_months, 1)),
      'access_type', 'temporary',
      'duration_months', code_record.access_duration_months
    );
  END IF;
END;
$function$;