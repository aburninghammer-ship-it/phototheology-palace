
-- Allow pass recipients to update their commentary selection
CREATE POLICY "Recipients can update commentary selection" ON public.lock_in_passes
  FOR UPDATE TO authenticated
  USING (recipient_user_id = auth.uid())
  WITH CHECK (recipient_user_id = auth.uid());

-- Allow pass recipients to read their own pass
CREATE POLICY "Recipients can view own passes" ON public.lock_in_passes
  FOR SELECT TO authenticated
  USING (recipient_user_id = auth.uid());
