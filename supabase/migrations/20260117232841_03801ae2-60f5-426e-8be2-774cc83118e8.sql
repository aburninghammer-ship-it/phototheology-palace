
-- Create a public view for limited profile data (leaderboards, community) without exposing sensitive info
CREATE OR REPLACE VIEW public.profiles_public_info
WITH (security_invoker = on)
AS SELECT 
  id,
  username,
  display_name,
  avatar_url,
  level,
  points
FROM public.profiles;

-- Grant select on the view to authenticated users
GRANT SELECT ON public.profiles_public_info TO authenticated;
GRANT SELECT ON public.profiles_public_info TO anon;

-- Fix patreon_connections - users can only view their own connections
DROP POLICY IF EXISTS "Users can view their own Patreon connections" ON public.patreon_connections;
DROP POLICY IF EXISTS "Users can view own patreon connections" ON public.patreon_connections;

CREATE POLICY "Users can view own patreon data"
ON public.patreon_connections
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
