-- Security Hardening v2 - Addresses Lovable security scan warnings
-- Fixes: Function Search Path Mutable, RLS Policy Always True on cache tables

-- ============================================================
-- 1. Fix Function Search Path Mutable
-- Add SET search_path = public to SECURITY DEFINER functions that lack it
-- ============================================================

-- Fix initialize_floor_progress (trigger function)
ALTER FUNCTION public.initialize_floor_progress()
SET search_path = public;

-- Fix create_message_notification (trigger function)
ALTER FUNCTION public.create_message_notification()
SET search_path = public;

-- Fix update_user_engagement (trigger function)
ALTER FUNCTION public.update_user_engagement()
SET search_path = public;

-- ============================================================
-- 2. Tighten RLS on Preacher Mentor cache tables
-- Cache tables should only allow INSERT/UPDATE via service_role
-- (edge functions run with service_role key for cache writes)
-- SELECT remains open to authenticated users for cache reads
-- ============================================================

-- passage_analysis_cache: Drop overly permissive INSERT/UPDATE policies
DROP POLICY IF EXISTS "Service role can insert passage analysis" ON public.passage_analysis_cache;
DROP POLICY IF EXISTS "Service role can update passage analysis" ON public.passage_analysis_cache;

-- Recreate with service_role restriction (only edge functions can write)
CREATE POLICY "Service role can insert passage analysis"
ON public.passage_analysis_cache FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Service role can update passage analysis"
ON public.passage_analysis_cache FOR UPDATE
TO service_role
USING (true);

-- commentary_core_versions: Drop overly permissive INSERT/UPDATE policies
DROP POLICY IF EXISTS "Service role can insert commentary versions" ON public.commentary_core_versions;
DROP POLICY IF EXISTS "Service role can update commentary versions" ON public.commentary_core_versions;

-- Recreate with service_role restriction
CREATE POLICY "Service role can insert commentary versions"
ON public.commentary_core_versions FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Service role can update commentary versions"
ON public.commentary_core_versions FOR UPDATE
TO service_role
USING (true);
