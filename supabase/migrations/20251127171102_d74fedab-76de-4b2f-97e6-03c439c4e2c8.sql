-- Drop the duplicate trigger that's causing double notifications
DROP TRIGGER IF EXISTS on_message_received ON public.messages;