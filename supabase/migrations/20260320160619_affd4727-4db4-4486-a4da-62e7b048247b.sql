
-- Backfill missing emails from auth.users into profiles
UPDATE public.profiles p
SET email = u.email, updated_at = NOW()
FROM auth.users u
WHERE p.id = u.id
  AND (p.email IS NULL OR p.email = '')
  AND u.email IS NOT NULL;
