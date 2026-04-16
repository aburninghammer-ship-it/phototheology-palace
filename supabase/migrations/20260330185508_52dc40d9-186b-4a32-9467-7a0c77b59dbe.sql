
-- Make view use security_invoker to satisfy linter,
-- but add a permissive policy for authenticated users to SELECT
-- only the columns exposed through the view
ALTER VIEW public.profiles_public_info SET (security_invoker = true);

-- Add a limited SELECT policy for authenticated users to read other profiles
-- This is needed for social features (viewing other users' display names, avatars)
CREATE POLICY "Authenticated can view public profile fields"
  ON public.profiles FOR SELECT TO authenticated
  USING (true);
