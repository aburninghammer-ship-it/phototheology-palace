-- Enable pgcrypto for encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create schema for private functions first
CREATE SCHEMA IF NOT EXISTS private;

-- Create a secret key for token encryption
CREATE OR REPLACE FUNCTION private.get_encryption_key()
RETURNS bytea
LANGUAGE sql
IMMUTABLE
SECURITY DEFINER
SET search_path = private
AS $$
  SELECT decode(encode(sha256('tdjtumtdkjicnhlpqqzd_social_token_encryption_v1'::bytea), 'hex'), 'hex')
$$;

-- Function to encrypt social media tokens
CREATE OR REPLACE FUNCTION public.encrypt_token(plain_token text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF plain_token IS NULL OR plain_token = '' THEN
    RETURN plain_token;
  END IF;
  RETURN encode(pgp_sym_encrypt(plain_token, encode(private.get_encryption_key(), 'hex')), 'base64');
END;
$$;

-- Function to decrypt social media tokens
CREATE OR REPLACE FUNCTION public.decrypt_token(encrypted_token text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF encrypted_token IS NULL OR encrypted_token = '' THEN
    RETURN encrypted_token;
  END IF;
  RETURN pgp_sym_decrypt(decode(encrypted_token, 'base64'), encode(private.get_encryption_key(), 'hex'));
EXCEPTION WHEN OTHERS THEN
  RETURN encrypted_token;
END;
$$;

-- Add encrypted token columns
ALTER TABLE public.social_media_connections 
ADD COLUMN IF NOT EXISTS access_token_encrypted text,
ADD COLUMN IF NOT EXISTS refresh_token_encrypted text;

-- Migrate existing tokens to encrypted format
UPDATE public.social_media_connections
SET 
  access_token_encrypted = public.encrypt_token(access_token),
  refresh_token_encrypted = public.encrypt_token(refresh_token)
WHERE access_token_encrypted IS NULL AND access_token IS NOT NULL;

-- Create function to safely get public profile data (no sensitive fields)
CREATE OR REPLACE FUNCTION public.get_public_profile(profile_id uuid)
RETURNS TABLE (
  id uuid,
  username text,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.username,
    p.display_name,
    p.avatar_url,
    p.bio,
    p.created_at
  FROM public.profiles p
  WHERE p.id = profile_id;
$$;

-- Drop existing overly permissive policies on profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are publicly viewable" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile or admins can view all" ON public.profiles;

-- Ensure only owner and admins can see full profile data
CREATE POLICY "Users can view own profile or admins can view all"
ON public.profiles
FOR SELECT
USING (
  auth.uid() = id 
  OR public.has_role(auth.uid(), 'admin')
);

-- Grant execute on public profile function for safe lookups
GRANT EXECUTE ON FUNCTION public.get_public_profile(uuid) TO authenticated, anon;