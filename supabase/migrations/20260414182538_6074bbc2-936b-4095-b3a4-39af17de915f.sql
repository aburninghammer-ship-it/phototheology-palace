
DROP POLICY IF EXISTS "Authenticated can view public profile fields" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view other profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own full profile" ON public.profiles;

CREATE POLICY "Users can view own full profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- Drop and recreate the view with safe columns only
DROP VIEW IF EXISTS public.profiles_public_info CASCADE;

CREATE VIEW public.profiles_public_info AS
SELECT 
  id, username, display_name, avatar_url, bio, master_title, 
  current_floor, points, created_at,
  daily_study_streak, longest_study_streak, total_gems_saved,
  is_profile_public, cover_photo_url, location, ministry_tags,
  primary_role, social_links, level, looking_for_partner
FROM public.profiles;
