
-- 1. Add encrypted column for gamma API key
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gamma_api_key_encrypted TEXT;

-- 2. Create encryption trigger for gamma_api_key
CREATE OR REPLACE FUNCTION public.encrypt_gamma_api_key()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.gamma_api_key IS NOT NULL AND NEW.gamma_api_key != '' 
     AND NEW.gamma_api_key != '[ENCRYPTED]' THEN
    NEW.gamma_api_key_encrypted := public.encrypt_token(NEW.gamma_api_key);
    NEW.gamma_api_key := '[ENCRYPTED]';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER encrypt_gamma_key_trigger
  BEFORE INSERT OR UPDATE OF gamma_api_key ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.encrypt_gamma_api_key();

-- 3. Create decryption function (user can only get own key)
CREATE OR REPLACE FUNCTION public.get_decrypted_gamma_key(_user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF _user_id != auth.uid() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  RETURN (
    SELECT public.decrypt_token(gamma_api_key_encrypted)
    FROM public.profiles
    WHERE id = _user_id AND gamma_api_key_encrypted IS NOT NULL
  );
END;
$$;

-- 4. Migrate existing plaintext keys to encrypted
UPDATE public.profiles
SET gamma_api_key = gamma_api_key
WHERE gamma_api_key IS NOT NULL 
  AND gamma_api_key != '' 
  AND gamma_api_key != '[ENCRYPTED]'
  AND gamma_api_key_encrypted IS NULL;

-- 5. Tighten bible-audio bucket: public read, service-role write
DROP POLICY IF EXISTS "Allow authenticated users to manage bible audio" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to read bible audio" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to insert bible audio" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to update bible audio" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to delete bible audio" ON storage.objects;

CREATE POLICY "Public can read bible audio"
ON storage.objects FOR SELECT
USING (bucket_id = 'bible-audio');

CREATE POLICY "Only service role can write bible audio"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'bible-audio' AND auth.role() = 'service_role');

CREATE POLICY "Only service role can update bible audio"
ON storage.objects FOR UPDATE
USING (bucket_id = 'bible-audio' AND auth.role() = 'service_role');

CREATE POLICY "Only service role can delete bible audio"
ON storage.objects FOR DELETE
USING (bucket_id = 'bible-audio' AND auth.role() = 'service_role');

-- 6. Tighten products bucket: public read, admin write
DROP POLICY IF EXISTS "Allow authenticated users to manage products" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to read products" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to insert products" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to update products" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to delete products" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can read products" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload products" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update products" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON storage.objects;

CREATE POLICY "Public can read products"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

CREATE POLICY "Only service role can write products"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'products' AND auth.role() = 'service_role');

CREATE POLICY "Only service role can update products"
ON storage.objects FOR UPDATE
USING (bucket_id = 'products' AND auth.role() = 'service_role');

CREATE POLICY "Only service role can delete products"
ON storage.objects FOR DELETE
USING (bucket_id = 'products' AND auth.role() = 'service_role');
