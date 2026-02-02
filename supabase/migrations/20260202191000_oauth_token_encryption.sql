-- OAuth Token Encryption Fix
-- Ensures all OAuth tokens are encrypted at rest

-- ============================================
-- 1. ENCRYPT CALENDAR CONNECTION TOKENS
-- ============================================

-- Add trigger to encrypt calendar tokens on insert/update
CREATE OR REPLACE FUNCTION public.encrypt_calendar_tokens()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Encrypt access_token if it's being set and doesn't look already encrypted
  IF NEW.access_token IS NOT NULL AND NEW.access_token != ''
     AND NEW.access_token NOT LIKE 'c2%' THEN
    NEW.access_token := public.encrypt_token(NEW.access_token);
  END IF;

  -- Encrypt refresh_token if it's being set and doesn't look already encrypted
  IF NEW.refresh_token IS NOT NULL AND NEW.refresh_token != ''
     AND NEW.refresh_token NOT LIKE 'c2%' THEN
    NEW.refresh_token := public.encrypt_token(NEW.refresh_token);
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger for calendar_connections if the table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'calendar_connections') THEN
    DROP TRIGGER IF EXISTS encrypt_calendar_tokens_trigger ON public.calendar_connections;
    CREATE TRIGGER encrypt_calendar_tokens_trigger
      BEFORE INSERT OR UPDATE ON public.calendar_connections
      FOR EACH ROW
      EXECUTE FUNCTION public.encrypt_calendar_tokens();

    -- Encrypt any existing unencrypted tokens
    UPDATE public.calendar_connections
    SET
      access_token = public.encrypt_token(access_token),
      refresh_token = public.encrypt_token(refresh_token)
    WHERE
      (access_token IS NOT NULL AND access_token NOT LIKE 'c2%')
      OR (refresh_token IS NOT NULL AND refresh_token NOT LIKE 'c2%');
  END IF;
END $$;

-- ============================================
-- 2. CREATE SECURE ACCESS FUNCTION FOR CALENDAR TOKENS
-- ============================================

CREATE OR REPLACE FUNCTION public.get_decrypted_calendar_tokens(_user_id uuid)
RETURNS TABLE(
  provider text,
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  calendar_id text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only allow users to access their own tokens
  IF _user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: Can only access own tokens';
  END IF;

  RETURN QUERY
  SELECT
    cc.provider,
    public.decrypt_token(cc.access_token),
    public.decrypt_token(cc.refresh_token),
    cc.token_expires_at,
    cc.calendar_id
  FROM public.calendar_connections cc
  WHERE cc.user_id = _user_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_decrypted_calendar_tokens(uuid) TO authenticated;

-- ============================================
-- 3. ENSURE SOCIAL MEDIA TOKENS USE ENCRYPTION
-- ============================================

-- Verify the social_media_connections trigger exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'social_media_connections') THEN
    -- Ensure any lingering unencrypted tokens are encrypted
    UPDATE public.social_media_connections
    SET
      access_token_encrypted = public.encrypt_token(access_token_encrypted)
    WHERE
      access_token_encrypted IS NOT NULL
      AND access_token_encrypted != ''
      AND access_token_encrypted NOT LIKE 'c2%';
  END IF;
END $$;

-- ============================================
-- 4. ADD COMMENTS
-- ============================================

COMMENT ON FUNCTION public.encrypt_calendar_tokens IS 'Trigger function to automatically encrypt OAuth tokens in calendar_connections table.';
COMMENT ON FUNCTION public.get_decrypted_calendar_tokens IS 'Secure function to retrieve decrypted calendar OAuth tokens. Only accessible by token owner.';
