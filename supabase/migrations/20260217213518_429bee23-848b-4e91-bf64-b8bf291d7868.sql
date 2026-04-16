-- Allow church members to enroll themselves as baptism candidates
CREATE POLICY "Members can enroll themselves as candidates"
ON public.baptism_candidates
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM public.church_members
    WHERE church_id = baptism_candidates.church_id
    AND user_id = auth.uid()
  )
);