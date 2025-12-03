-- Drop the existing trigger and function
DROP TRIGGER IF EXISTS on_message_sent ON messages;
DROP FUNCTION IF EXISTS create_message_notification();

-- Create improved function that groups notifications from same sender
CREATE OR REPLACE FUNCTION create_message_notification()
RETURNS TRIGGER AS $$
DECLARE
  recipient_id UUID;
  sender_name TEXT;
  conversation_record RECORD;
  existing_notification_id UUID;
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
  
  -- Check for existing unread notification from this sender in this conversation
  SELECT id INTO existing_notification_id
  FROM notifications
  WHERE user_id = recipient_id
    AND type = 'direct_message'
    AND is_read = false
    AND metadata->>'conversation_id' = NEW.conversation_id::text
    AND metadata->>'sender_id' = NEW.sender_id::text
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF existing_notification_id IS NOT NULL THEN
    -- Update existing notification with latest message info
    UPDATE notifications
    SET 
      created_at = NOW(),
      metadata = jsonb_build_object(
        'conversation_id', NEW.conversation_id,
        'sender_id', NEW.sender_id,
        'message_id', NEW.id
      )
    WHERE id = existing_notification_id;
  ELSE
    -- Create new notification for the recipient
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
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_message_sent
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION create_message_notification();