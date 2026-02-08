-- Tighten Profile Security
-- Fix: Remove overly permissive "USING (true)" policy on profiles
-- Addresses Lovable security scan errors

-- ============================================
-- 1. FIX PROFILES TABLE - Remove permissive policy
-- ============================================

-- Drop the overly permissive policy that allows viewing all profiles
DROP POLICY IF EXISTS "Users can view public profile info" ON public.profiles;

-- Keep only the strict policies:
-- "Users can view own profile" (already exists)
-- "Admins can view all profiles" (already exists)

-- ============================================
-- 2. SECURE SMS TABLES WITH PHONE NUMBERS
-- ============================================

-- Ensure devotional_profiles has proper RLS for phone data
-- (This table already has RLS, but let's ensure phone columns are protected)

-- Drop any overly permissive policies on devotional_profiles
DROP POLICY IF EXISTS "Anyone can view devotional profiles" ON public.devotional_profiles;
DROP POLICY IF EXISTS "Public can view devotional profiles" ON public.devotional_profiles;

-- Ensure users can only access their own devotional profiles
DO $$
BEGIN
  -- Check if policy exists before creating
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'devotional_profiles'
    AND policyname = 'Users can view own devotional profiles'
  ) THEN
    CREATE POLICY "Users can view own devotional profiles"
      ON public.devotional_profiles FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;
END $$;

-- ============================================
-- 3. SECURE CHURCH MEMBER DATA WITH PHONE
-- ============================================

-- Ensure church member contact info is protected
-- Only church admins and the member themselves can see phone numbers

DO $$
BEGIN
  -- Drop any overly permissive policy on church_members if it exists
  DROP POLICY IF EXISTS "Anyone can view church members" ON public.church_members;
  DROP POLICY IF EXISTS "Public can view church members" ON public.church_members;
EXCEPTION
  WHEN undefined_table THEN
    NULL; -- Table doesn't exist, skip
END $$;

-- ============================================
-- 4. ADD SECURITY COMMENTS
-- ============================================

COMMENT ON POLICY "Users can view own profile" ON public.profiles IS
  'Users can only view their own full profile data including email. Public profile info should use the public_profiles view.';

-- ============================================
-- 5. ENSURE ANON CANNOT ACCESS SENSITIVE TABLES
-- ============================================

-- Revoke direct access to sensitive tables from anonymous users
DO $$
BEGIN
  REVOKE ALL ON public.profiles FROM anon;
  REVOKE ALL ON public.sms_devotional_recipients FROM anon;
  REVOKE ALL ON public.sms_send_log FROM anon;
EXCEPTION
  WHEN undefined_table THEN
    NULL; -- Table doesn't exist, skip
END $$;
