-- Fix RLS policies for flashcard_sets to allow edge function inserts
DROP POLICY IF EXISTS "Users can insert their own flashcard sets" ON flashcard_sets;

CREATE POLICY "Users can insert their own flashcard sets"
ON flashcard_sets
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Fix RLS policies for bible_images to allow edge function inserts
DROP POLICY IF EXISTS "Users can insert their own images" ON bible_images;

CREATE POLICY "Users can insert their own images"
ON bible_images
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Also ensure SELECT policies exist
DROP POLICY IF EXISTS "Users can view their own flashcard sets" ON flashcard_sets;

CREATE POLICY "Users can view their own flashcard sets"
ON flashcard_sets
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can view their own images" ON bible_images;

CREATE POLICY "Users can view their own images"
ON bible_images
FOR SELECT
TO authenticated
USING (user_id = auth.uid());