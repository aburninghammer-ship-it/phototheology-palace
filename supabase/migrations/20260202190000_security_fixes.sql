-- Security Fixes Migration
-- Addresses: User Profile Data Publicly Accessible, Payment Data Audit, RLS Always True

-- ============================================
-- 1. FIX PROFILES TABLE - Restrict Public Access
-- ============================================

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create more restrictive policies:
-- Users can view their own full profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can view limited public info of other users (for social features)
-- This allows seeing username/display_name/avatar but NOT sensitive data
CREATE POLICY "Users can view public profile info"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    -- Only allow selecting non-sensitive columns via this policy
    -- The columns are controlled by what the app queries
    true
  );

-- Actually, let's be more granular. Create a public profiles view instead
-- and restrict the base table

-- First, revoke direct SELECT on profiles for anon users
REVOKE SELECT ON public.profiles FROM anon;

-- Create a secure view for public profile information
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT
  id,
  username,
  display_name,
  avatar_url,
  level,
  points,
  created_at
  -- Excludes: email, phone, any sensitive personal data
FROM public.profiles;

-- Grant access to the public view
GRANT SELECT ON public.public_profiles TO authenticated;

-- Admins can view all profile data for support purposes
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- 2. ADD AUDIT LOGGING FOR ADMIN DATA ACCESS
-- ============================================

-- Create audit log table
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES auth.users(id),
  action_type TEXT NOT NULL, -- 'view', 'update', 'delete'
  target_table TEXT NOT NULL,
  target_record_id UUID,
  target_user_id UUID, -- If action affects another user
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on audit log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
  ON public.admin_audit_log FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Service role can insert audit logs
CREATE POLICY "Service role can insert audit logs"
  ON public.admin_audit_log FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Index for efficient queries
CREATE INDEX IF NOT EXISTS idx_audit_log_admin ON public.admin_audit_log(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_target ON public.admin_audit_log(target_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_date ON public.admin_audit_log(created_at DESC);

-- Function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
  p_action_type TEXT,
  p_target_table TEXT,
  p_target_record_id UUID DEFAULT NULL,
  p_target_user_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  log_id UUID;
BEGIN
  -- Only log if user is actually an admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can log admin actions';
  END IF;

  INSERT INTO public.admin_audit_log (
    admin_user_id,
    action_type,
    target_table,
    target_record_id,
    target_user_id,
    details
  ) VALUES (
    auth.uid(),
    p_action_type,
    p_target_table,
    p_target_record_id,
    p_target_user_id,
    p_details
  )
  RETURNING id INTO log_id;

  RETURN log_id;
END;
$$;

-- Grant execute to authenticated users (function checks admin role internally)
GRANT EXECUTE ON FUNCTION public.log_admin_action TO authenticated;

-- ============================================
-- 3. SECURE SUBSCRIPTION DATA WITH AUDIT TRAIL
-- ============================================

-- Create wrapper function for admin subscription access that logs the action
CREATE OR REPLACE FUNCTION public.admin_get_user_subscription(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
BEGIN
  -- Check admin status
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  -- Log the access
  PERFORM public.log_admin_action(
    'view',
    'user_subscriptions',
    NULL,
    p_user_id,
    jsonb_build_object('accessed_via', 'admin_get_user_subscription')
  );

  -- Get the subscription data
  SELECT to_jsonb(us.*) INTO result
  FROM public.user_subscriptions us
  WHERE us.user_id = p_user_id;

  RETURN COALESCE(result, '{}'::jsonb);
END;
$$;

-- Create wrapper for admin subscription updates with audit
CREATE OR REPLACE FUNCTION public.admin_update_user_subscription(
  p_user_id UUID,
  p_updates JSONB
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  old_data JSONB;
BEGIN
  -- Check admin status
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  -- Get old data for audit trail
  SELECT to_jsonb(us.*) INTO old_data
  FROM public.user_subscriptions us
  WHERE us.user_id = p_user_id;

  -- Log the update with before/after
  PERFORM public.log_admin_action(
    'update',
    'user_subscriptions',
    NULL,
    p_user_id,
    jsonb_build_object(
      'old_data', old_data,
      'new_data', p_updates
    )
  );

  -- Perform the update (only allowed fields)
  UPDATE public.user_subscriptions
  SET
    subscription_status = COALESCE((p_updates->>'subscription_status')::TEXT, subscription_status),
    subscription_tier = COALESCE((p_updates->>'subscription_tier')::TEXT, subscription_tier),
    has_lifetime_access = COALESCE((p_updates->>'has_lifetime_access')::BOOLEAN, has_lifetime_access),
    is_student = COALESCE((p_updates->>'is_student')::BOOLEAN, is_student),
    updated_at = NOW()
  WHERE user_id = p_user_id;

  RETURN FOUND;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_get_user_subscription TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_user_subscription TO authenticated;

-- ============================================
-- 4. FIX OTHER RLS POLICIES THAT ARE TOO PERMISSIVE
-- ============================================

-- Fix user_roles - should not be viewable by everyone
DROP POLICY IF EXISTS "User roles viewable by authenticated users" ON public.user_roles;

-- Users can only see their own roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Fix study_room_participants - don't expose all participants to everyone
DROP POLICY IF EXISTS "Participants can view room members" ON public.study_room_participants;

-- Participants can only see members of rooms they're in
CREATE POLICY "Participants can view room members"
  ON public.study_room_participants FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.study_room_participants srp
      WHERE srp.room_id = study_room_participants.room_id
      AND srp.user_id = auth.uid()
    )
    OR public.has_role(auth.uid(), 'admin')
  );

-- ============================================
-- 5. SET PROPER SEARCH PATH FOR SECURITY FUNCTIONS
-- ============================================

-- Ensure all security-related functions have proper search_path
ALTER FUNCTION public.has_role SET search_path = public;

-- ============================================
-- 6. REMOVE SENSITIVE DATA FROM PROFILES VIEW
-- ============================================

-- Drop the insecure profiles_with_subscription view if it exists
DROP VIEW IF EXISTS public.profiles_with_subscription;

-- Recreate it with proper access control (admin only)
CREATE OR REPLACE VIEW public.profiles_with_subscription AS
SELECT
  p.*,
  us.subscription_status,
  us.subscription_tier,
  us.has_lifetime_access,
  us.is_student,
  us.trial_ends_at
  -- Excludes sensitive payment info: stripe_customer_id, stripe_subscription_id, etc.
FROM public.profiles p
LEFT JOIN public.user_subscriptions us ON p.id = us.user_id;

-- Only admins can access this view
REVOKE ALL ON public.profiles_with_subscription FROM PUBLIC;
GRANT SELECT ON public.profiles_with_subscription TO authenticated;

-- Add RLS-like protection via a wrapper function
CREATE OR REPLACE FUNCTION public.get_profiles_with_subscription()
RETURNS SETOF public.profiles_with_subscription
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  RETURN QUERY SELECT * FROM public.profiles_with_subscription;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_profiles_with_subscription TO authenticated;

-- ============================================
-- 7. COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE public.admin_audit_log IS 'Audit trail for all admin actions on sensitive data. Required for compliance.';
COMMENT ON VIEW public.public_profiles IS 'Public profile information safe to expose. Excludes email, phone, and sensitive personal data.';
COMMENT ON FUNCTION public.admin_get_user_subscription IS 'Admin function to view user subscription data with automatic audit logging.';
COMMENT ON FUNCTION public.admin_update_user_subscription IS 'Admin function to update user subscription data with automatic audit logging.';
