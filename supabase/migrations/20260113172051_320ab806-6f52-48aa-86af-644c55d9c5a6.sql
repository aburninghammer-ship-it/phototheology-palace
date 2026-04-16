-- Allow admins to view all Teachable students
CREATE POLICY "Admins can view all Teachable students"
ON public.teachable_students
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  )
);