-- Enable RLS on strongs_dictionary if not already enabled
ALTER TABLE strongs_dictionary ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow service role to insert strongs" ON strongs_dictionary;
DROP POLICY IF EXISTS "Allow public read access to strongs" ON strongs_dictionary;
DROP POLICY IF EXISTS "Strongs entries are viewable by everyone" ON strongs_dictionary;

-- Allow anyone to read Strong's entries (they are reference data)
CREATE POLICY "Strongs entries are viewable by everyone" 
ON strongs_dictionary
FOR SELECT 
USING (true);

-- Allow service role (edge functions) to insert/update Strong's entries
CREATE POLICY "Service role can manage strongs entries" 
ON strongs_dictionary
FOR ALL
USING (true)
WITH CHECK (true);

-- Allow admins to manage Strong's entries
CREATE POLICY "Admins can manage strongs entries" 
ON strongs_dictionary
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);