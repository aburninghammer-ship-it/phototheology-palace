-- Create a function to automatically create notifications when a message is sent
CREATE OR REPLACE FUNCTION create_message_notification()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_message_sent ON messages;

-- Create trigger to fire when a new message is inserted
CREATE TRIGGER on_message_sent
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION create_message_notification();