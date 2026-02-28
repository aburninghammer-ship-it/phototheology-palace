
-- Drop the problematic trigger that sets last_seen on EVERY profile update
DROP TRIGGER IF EXISTS update_profiles_last_seen ON public.profiles;
DROP FUNCTION IF EXISTS public.update_last_seen();
