-- Drop and recreate the function with proper ID ordering
CREATE OR REPLACE FUNCTION public.get_or_create_conversation(other_user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  conversation_id UUID;
  current_user_id UUID;
  p1_id UUID;
  p2_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  IF current_user_id = other_user_id THEN
    RAISE EXCEPTION 'Cannot create conversation with yourself';
  END IF;
  
  -- Order the IDs to satisfy the check constraint (participant1_id < participant2_id)
  IF current_user_id < other_user_id THEN
    p1_id := current_user_id;
    p2_id := other_user_id;
  ELSE
    p1_id := other_user_id;
    p2_id := current_user_id;
  END IF;
  
  -- Try to find existing conversation (with ordered IDs)
  SELECT id INTO conversation_id
  FROM public.conversations
  WHERE participant1_id = p1_id AND participant2_id = p2_id
  LIMIT 1;
  
  -- If no conversation exists, create one with ordered IDs
  IF conversation_id IS NULL THEN
    INSERT INTO public.conversations (participant1_id, participant2_id)
    VALUES (p1_id, p2_id)
    RETURNING id INTO conversation_id;
  END IF;
  
  RETURN conversation_id;
END;
$$;