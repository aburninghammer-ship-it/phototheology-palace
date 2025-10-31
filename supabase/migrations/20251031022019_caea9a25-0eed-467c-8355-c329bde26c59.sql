-- Add is_lifetime column to special_access_codes table
ALTER TABLE public.special_access_codes 
ADD COLUMN IF NOT EXISTS is_lifetime boolean DEFAULT false;

-- Drop existing function first
DROP FUNCTION IF EXISTS public.redeem_access_code(text);

-- Create the redeem_access_code function to handle lifetime access
CREATE OR REPLACE FUNCTION public.redeem_access_code(code_input text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  code_record RECORD;
  user_profile RECORD;
BEGIN
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
  WHERE id = auth.uid();

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
    WHERE id = auth.uid();
    
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
    WHERE id = auth.uid();
    
    RETURN jsonb_build_object(
      'success', true, 
      'message', 'Access granted!',
      'access_type', 'temporary',
      'duration_months', code_record.access_duration_months
    );
  END IF;
END;
$$;