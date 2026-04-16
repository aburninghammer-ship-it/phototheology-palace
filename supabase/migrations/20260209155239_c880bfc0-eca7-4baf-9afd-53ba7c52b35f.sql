
-- Create public chat rooms table
CREATE TABLE public.public_chat_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '💬',
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.public_chat_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public chat rooms" ON public.public_chat_rooms
  FOR SELECT USING (true);

-- Create public chat messages table
CREATE TABLE public.public_chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.public_chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.public_chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view public chat messages" ON public.public_chat_messages
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can send public chat messages" ON public.public_chat_messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.public_chat_messages;

-- Seed default rooms
INSERT INTO public.public_chat_rooms (name, icon, description) VALUES
  ('General', '💬', 'General discussion'),
  ('Prayer Requests', '🙏', 'Share and pray for each other'),
  ('Questions', '❓', 'Ask Bible study questions');
