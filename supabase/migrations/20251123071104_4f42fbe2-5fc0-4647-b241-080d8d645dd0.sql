-- Fix search_path for update_guild_updated_at function
DROP TRIGGER IF EXISTS update_guilds_updated_at ON public.guilds;
DROP FUNCTION IF EXISTS update_guild_updated_at();

CREATE OR REPLACE FUNCTION update_guild_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER update_guilds_updated_at
  BEFORE UPDATE ON public.guilds
  FOR EACH ROW
  EXECUTE FUNCTION update_guild_updated_at();