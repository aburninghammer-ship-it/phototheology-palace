-- Drop existing policy and create proper ones
DROP POLICY IF EXISTS "Users can manage own dismissals" ON public.announcement_dismissals;

-- Policy for SELECT - users can view their own dismissals
CREATE POLICY "Users can view own dismissals"
ON public.announcement_dismissals
FOR SELECT
USING (auth.uid() = user_id);

-- Policy for INSERT - users can create their own dismissals
CREATE POLICY "Users can create own dismissals"
ON public.announcement_dismissals
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy for DELETE - users can delete their own dismissals
CREATE POLICY "Users can delete own dismissals"
ON public.announcement_dismissals
FOR DELETE
USING (auth.uid() = user_id);