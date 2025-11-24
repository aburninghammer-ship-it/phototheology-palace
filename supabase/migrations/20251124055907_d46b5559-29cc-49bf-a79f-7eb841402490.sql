-- Add master_title and current_floor columns to profiles for sword display
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS master_title TEXT,
ADD COLUMN IF NOT EXISTS current_floor INTEGER DEFAULT 0;

-- Update Ivor Myers to Black Master status
UPDATE public.profiles 
SET master_title = 'black', current_floor = 8
WHERE id = 'a0e64f17-c9f0-4f71-ac72-d1ca52c8b99b';

-- Create or replace the get_or_create_conversation function if it doesn't exist
CREATE OR REPLACE FUNCTION public.get_or_create_conversation(other_user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  conversation_id UUID;
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  IF current_user_id = other_user_id THEN
    RAISE EXCEPTION 'Cannot create conversation with yourself';
  END IF;
  
  -- Try to find existing conversation (check both directions)
  SELECT id INTO conversation_id
  FROM public.conversations
  WHERE (participant1_id = current_user_id AND participant2_id = other_user_id)
     OR (participant1_id = other_user_id AND participant2_id = current_user_id)
  LIMIT 1;
  
  -- If no conversation exists, create one
  IF conversation_id IS NULL THEN
    INSERT INTO public.conversations (participant1_id, participant2_id)
    VALUES (current_user_id, other_user_id)
    RETURNING id INTO conversation_id;
  END IF;
  
  RETURN conversation_id;
END;
$$;