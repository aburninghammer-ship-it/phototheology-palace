-- Fix profiles table: restrict to users viewing only their own profile
-- Drop existing overly permissive SELECT policies
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;

-- Create restrictive policy: users can only view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Admins can view all profiles for management
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Revoke direct access from anon
REVOKE SELECT ON public.profiles FROM anon;