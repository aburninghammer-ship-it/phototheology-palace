
-- FIX 2 continued: profiles view without xp column
DROP VIEW IF EXISTS public.profiles_public_info;

CREATE VIEW public.profiles_public_info AS
SELECT 
  id,
  username,
  display_name,
  avatar_url,
  cover_photo_url,
  bio,
  location,
  website,
  ministry_tags,
  interests,
  social_links,
  is_profile_public,
  points,
  level,
  daily_study_streak,
  master_title,
  current_floor,
  created_at
FROM public.profiles;

GRANT SELECT ON public.profiles_public_info TO authenticated;
GRANT SELECT ON public.profiles_public_info TO anon;
