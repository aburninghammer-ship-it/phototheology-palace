-- Add column for per-user Gamma API key (encrypted in transit via RLS)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gamma_api_key text;

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.gamma_api_key IS 'User-specific Gamma.app API key for presentation generation';