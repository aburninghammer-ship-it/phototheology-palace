-- First, drop existing policies if they exist to recreate them correctly
DROP POLICY IF EXISTS "Users can view their own studies" ON user_studies;
DROP POLICY IF EXISTS "Users can insert their own studies" ON user_studies;
DROP POLICY IF EXISTS "Users can update their own studies" ON user_studies;
DROP POLICY IF EXISTS "Users can delete their own studies" ON user_studies;

-- Create comprehensive RLS policies for user_studies table
-- Policy for viewing own studies
CREATE POLICY "Users can view their own studies"
ON user_studies
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy for inserting own studies (THIS IS THE KEY ONE)
CREATE POLICY "Users can insert their own studies"
ON user_studies
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy for updating own studies
CREATE POLICY "Users can update their own studies"
ON user_studies
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy for deleting own studies
CREATE POLICY "Users can delete their own studies"
ON user_studies
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);