-- Security Fixes Migration
-- Addresses: Email exposure, Church info access, Extensions in public

-- ============================================
-- 1. FIX EMAIL ADDRESSES EXPOSURE
-- ============================================
-- Create a secure function that only returns the current user's email
-- This prevents direct access to auth.users email column

CREATE OR REPLACE FUNCTION public.get_current_user_email()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT email FROM auth.users WHERE id = auth.uid();
$$;

-- Grant execute to authenticated users only
REVOKE ALL ON FUNCTION public.get_current_user_email() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_current_user_email() TO authenticated;

-- Create a safe view for user profile data (no direct email access)
CREATE OR REPLACE VIEW public.safe_user_profiles AS
SELECT
  p.id,
  p.username,
  p.display_name,
  p.avatar_url,
  p.points,
  p.level,
  p.created_at,
  p.last_seen,
  -- Only include email if it's the current user
  CASE WHEN p.id = auth.uid() THEN public.get_current_user_email() ELSE NULL END as email
FROM public.profiles p;

-- Grant access to the safe view
GRANT SELECT ON public.safe_user_profiles TO authenticated;

-- ============================================
-- 2. FIX CHURCH INFORMATION ACCESS CONTROL
-- ============================================

-- Ensure RLS is enabled on all church-related tables
ALTER TABLE IF EXISTS public.churches ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.church_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.church_guest_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.church_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.church_community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.church_community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.church_devotionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.church_prayer_requests ENABLE ROW LEVEL SECURITY;

-- Create a secure helper function to check church membership
CREATE OR REPLACE FUNCTION public.is_church_member(p_user_id UUID, p_church_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.church_members
    WHERE user_id = p_user_id
    AND church_id = p_church_id
  );
$$;

-- Create a secure helper function to check church admin status
CREATE OR REPLACE FUNCTION public.is_church_admin(p_user_id UUID, p_church_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.church_members
    WHERE user_id = p_user_id
    AND church_id = p_church_id
    AND role = 'admin'
  );
$$;

-- Grant execute permissions
REVOKE ALL ON FUNCTION public.is_church_member(UUID, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_church_member(UUID, UUID) TO authenticated;

REVOKE ALL ON FUNCTION public.is_church_admin(UUID, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_church_admin(UUID, UUID) TO authenticated;

-- Drop potentially permissive policies on churches table
DROP POLICY IF EXISTS "Anyone can view churches" ON public.churches;
DROP POLICY IF EXISTS "Public can view churches" ON public.churches;
DROP POLICY IF EXISTS "All users can view churches" ON public.churches;

-- Ensure only members can view their churches
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'churches' AND policyname = 'Members only view their churches'
  ) THEN
    CREATE POLICY "Members only view their churches"
    ON public.churches
    FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.church_members cm
        WHERE cm.church_id = churches.id
        AND cm.user_id = auth.uid()
      )
    );
  END IF;
END $$;

-- ============================================
-- 3. FIX EXTENSION IN PUBLIC SCHEMA
-- ============================================
-- Move extensions to dedicated 'extensions' schema
-- Note: This should be run by admin, some extensions may need special handling

-- Create extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Grant usage to public
GRANT USAGE ON SCHEMA extensions TO PUBLIC;

-- Note: Moving existing extensions requires superuser access and may cause issues
-- with existing code. The following is informational - actual migration should
-- be done carefully in production.

-- For new extensions, ensure they're created in the extensions schema:
-- Example: CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

-- Add comment about schema usage
COMMENT ON SCHEMA extensions IS 'Schema for PostgreSQL extensions to avoid polluting public schema';

-- ============================================
-- 4. ADDITIONAL SECURITY HARDENING
-- ============================================

-- Revoke unnecessary permissions from public role
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM anon;

-- Ensure service_role has proper access for edge functions
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- Ensure authenticated role has basic access
GRANT USAGE ON SCHEMA public TO authenticated;

-- Create audit log for sensitive operations (optional but recommended)
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT,
  record_id TEXT,
  details JSONB,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on audit log - only admins can view
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only platform admins can view audit log"
ON public.security_audit_log
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- Index for efficient queries
CREATE INDEX IF NOT EXISTS idx_security_audit_log_user_id ON public.security_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_created_at ON public.security_audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_action ON public.security_audit_log(action);
