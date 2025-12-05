-- Update encrypt function to use extensions schema
CREATE OR REPLACE FUNCTION public.encrypt_token(plain_token text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  IF plain_token IS NULL OR plain_token = '' THEN
    RETURN plain_token;
  END IF;
  RETURN encode(extensions.pgp_sym_encrypt(plain_token, encode(private.get_encryption_key(), 'hex')), 'base64');
END;
$$;

-- Update decrypt function to use extensions schema  
CREATE OR REPLACE FUNCTION public.decrypt_token(encrypted_token text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  IF encrypted_token IS NULL OR encrypted_token = '' THEN
    RETURN encrypted_token;
  END IF;
  RETURN extensions.pgp_sym_decrypt(decode(encrypted_token, 'base64'), encode(private.get_encryption_key(), 'hex'));
EXCEPTION WHEN OTHERS THEN
  RETURN encrypted_token;
END;
$$;