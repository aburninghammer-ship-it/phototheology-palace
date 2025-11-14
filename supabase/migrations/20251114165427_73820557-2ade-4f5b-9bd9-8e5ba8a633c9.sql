-- Fix the message notification trigger to include proper metadata and correct column names
DROP TRIGGER IF EXISTS on_message_received ON messages;
DROP FUNCTION IF EXISTS notify_message_received();

CREATE OR REPLACE FUNCTION notify_message_received()
RETURNS TRIGGER AS $$
DECLARE
  sender_profile RECORD;
  recipient_id UUID;
BEGIN
  -- Get sender's profile information
  SELECT display_name INTO sender_profile
  FROM profiles
  WHERE id = NEW.sender_id;

  -- Determine the recipient (the other user in the conversation)
  -- Note: conversations table uses participant1_id and participant2_id
  SELECT 
    CASE 
      WHEN c.participant1_id = NEW.sender_id THEN c.participant2_id
      ELSE c.participant1_id
    END INTO recipient_id
  FROM conversations c
  WHERE c.id = NEW.conversation_id;

  -- Create notification for recipient (not for sender) with metadata for opening the conversation
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
CREATE TRIGGER on_message_received
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_message_received();