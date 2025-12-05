-- Fix Function Search Path Mutable warnings by adding SET search_path = public

-- 1. Fix create_message_notification
CREATE OR REPLACE FUNCTION public.create_message_notification()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  recipient_id UUID;
  sender_name TEXT;
  conversation_record RECORD;
  existing_notification_id UUID;
BEGIN
  SELECT * INTO conversation_record
  FROM conversations
  WHERE id = NEW.conversation_id;
  
  IF conversation_record.participant1_id = NEW.sender_id THEN
    recipient_id := conversation_record.participant2_id;
  ELSE
    recipient_id := conversation_record.participant1_id;
  END IF;
  
  SELECT display_name INTO sender_name
  FROM profiles
  WHERE id = NEW.sender_id;
  
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
$function$;

-- 2. Fix increment_prayer_count
CREATE OR REPLACE FUNCTION public.increment_prayer_count()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  UPDATE public.prayer_requests
  SET prayer_count = prayer_count + 1
  WHERE id = NEW.prayer_request_id;
  RETURN NEW;
END;
$function$;

-- 3. Fix update_gems_updated_at
CREATE OR REPLACE FUNCTION public.update_gems_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 4. Fix update_genesis_challenge_activity
CREATE OR REPLACE FUNCTION public.update_genesis_challenge_activity()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  UPDATE public.genesis_challenge_participants
  SET last_active_at = now()
  WHERE id = NEW.participant_id;
  RETURN NEW;
END;
$function$;

-- 5. Fix update_mastery_updated_at
CREATE OR REPLACE FUNCTION public.update_mastery_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- 6. Fix update_memory_lists_updated_at
CREATE OR REPLACE FUNCTION public.update_memory_lists_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 7. Fix update_pt_card_battles_updated_at
CREATE OR REPLACE FUNCTION public.update_pt_card_battles_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 8. Fix update_user_reading_progress_updated_at
CREATE OR REPLACE FUNCTION public.update_user_reading_progress_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 9. Fix update_verse_mapping_timestamp
CREATE OR REPLACE FUNCTION public.update_verse_mapping_timestamp()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;