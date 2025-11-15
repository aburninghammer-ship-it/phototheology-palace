-- Fix Function Search Path Mutable security issue
-- Add SET search_path = public to all SECURITY DEFINER functions that are missing it

-- Fix create_message_notification function
CREATE OR REPLACE FUNCTION create_message_notification()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recipient_id UUID;
  sender_name TEXT;
  conversation_record RECORD;
BEGIN
  -- Get the conversation details
  SELECT * INTO conversation_record
  FROM conversations
  WHERE id = NEW.conversation_id;
  
  -- Determine the recipient (the other participant)
  IF conversation_record.participant1_id = NEW.sender_id THEN
    recipient_id := conversation_record.participant2_id;
  ELSE
    recipient_id := conversation_record.participant1_id;
  END IF;
  
  -- Get sender's display name
  SELECT display_name INTO sender_name
  FROM profiles
  WHERE id = NEW.sender_id;
  
  -- Create notification for the recipient
  INSERT INTO notifications (
    user_id,
    type,
    title,
    message,
    metadata
  ) VALUES (
    recipient_id,
    'direct_message',
    'New Message',
    sender_name || ' sent you a message',
    jsonb_build_object(
      'conversation_id', NEW.conversation_id,
      'sender_id', NEW.sender_id,
      'message_id', NEW.id
    )
  );
  
  RETURN NEW;
END;
$$;

-- Fix notify_message_received function
CREATE OR REPLACE FUNCTION notify_message_received()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  sender_profile RECORD;
  recipient_id UUID;
BEGIN
  -- Get sender's profile information
  SELECT display_name INTO sender_profile
  FROM profiles
  WHERE id = NEW.sender_id;

  -- Determine the recipient (the other user in the conversation)
  SELECT 
    CASE 
      WHEN c.participant1_id = NEW.sender_id THEN c.participant2_id
      ELSE c.participant1_id
    END INTO recipient_id
  FROM conversations c
  WHERE c.id = NEW.conversation_id;

  -- Create notification for recipient (not for sender) with metadata
  IF recipient_id IS NOT NULL AND recipient_id != NEW.sender_id THEN
    INSERT INTO notifications (user_id, type, title, message, metadata)
    VALUES (
      recipient_id,
      'message',
      'New Message',
      COALESCE(sender_profile.display_name, 'Someone') || ' sent you a message',
      jsonb_build_object(
        'conversation_id', NEW.conversation_id,
        'sender_id', NEW.sender_id
      )
    );
  END IF;

  RETURN NEW;
END;
$$;