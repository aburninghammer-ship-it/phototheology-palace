
-- Fix infinite recursion in RLS policies by using SECURITY DEFINER functions

-- First, drop existing problematic policies
DROP POLICY IF EXISTS "Users can view their own and shared studies" ON user_studies;
DROP POLICY IF EXISTS "Users can update their own studies or studies with edit permiss" ON user_studies;
DROP POLICY IF EXISTS "Users can view collaborators of their studies" ON study_collaborators;
DROP POLICY IF EXISTS "Study owners can add collaborators" ON study_collaborators;
DROP POLICY IF EXISTS "Study owners can update collaborator permissions" ON study_collaborators;
DROP POLICY IF EXISTS "Study owners can remove collaborators" ON study_collaborators;

-- Create SECURITY DEFINER functions to check permissions without triggering recursive policies
CREATE OR REPLACE FUNCTION public.is_study_owner(study_id_param uuid, user_id_param uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_studies
    WHERE id = study_id_param AND user_id = user_id_param
  );
$$;

CREATE OR REPLACE FUNCTION public.has_study_access(study_id_param uuid, user_id_param uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_studies
    WHERE id = study_id_param AND user_id = user_id_param
  ) OR EXISTS (
    SELECT 1 FROM study_collaborators
    WHERE study_id = study_id_param AND user_id = user_id_param
  );
$$;

CREATE OR REPLACE FUNCTION public.has_study_edit_access(study_id_param uuid, user_id_param uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_studies
    WHERE id = study_id_param AND user_id = user_id_param
  ) OR EXISTS (
    SELECT 1 FROM study_collaborators
    WHERE study_id = study_id_param 
      AND user_id = user_id_param 
      AND permission = 'edit'
  );
$$;

-- Recreate user_studies policies using SECURITY DEFINER functions
CREATE POLICY "Users can view their own and shared studies"
ON user_studies FOR SELECT
TO public
USING (has_study_access(id, auth.uid()));

CREATE POLICY "Users can update their own studies or studies with edit access"
ON user_studies FOR UPDATE
TO public
USING (has_study_edit_access(id, auth.uid()));

-- Recreate study_collaborators policies using SECURITY DEFINER functions
CREATE POLICY "Users can view collaborators of studies they have access to"
ON study_collaborators FOR SELECT
TO public
USING (has_study_access(study_id, auth.uid()));

CREATE POLICY "Study owners can add collaborators"
ON study_collaborators FOR INSERT
TO public
WITH CHECK (is_study_owner(study_id, auth.uid()));

CREATE POLICY "Study owners can update collaborator permissions"
ON study_collaborators FOR UPDATE
TO public
USING (is_study_owner(study_id, auth.uid()));

CREATE POLICY "Study owners can remove collaborators"
ON study_collaborators FOR DELETE
TO public
USING (is_study_owner(study_id, auth.uid()));
