-- Allow admins to view all Pickaxe connections
CREATE POLICY "Admins can view all Pickaxe connections"
ON public.pickaxe_connections
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'
  )
  OR EXISTS (
    SELECT 1
    FROM public.admin_users au
    WHERE au.user_id = auth.uid()
  )
);