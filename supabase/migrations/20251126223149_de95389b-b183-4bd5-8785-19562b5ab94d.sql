-- Break RLS recursion between memory_verse_lists and memory_list_collaborators
-- Simplify collaborator policies to avoid referencing memory_verse_lists

DROP POLICY IF EXISTS "Users can view collaborators of accessible lists" ON public.memory_list_collaborators;
DROP POLICY IF EXISTS "List owners can manage collaborators" ON public.memory_list_collaborators;

CREATE POLICY "Users can manage their collaborator rows"
ON public.memory_list_collaborators
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);