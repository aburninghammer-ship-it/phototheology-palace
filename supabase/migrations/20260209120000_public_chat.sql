-- =====================================================
-- LIVE PUBLIC CHAT FEATURE
-- Global feed + topic rooms with realtime messaging
-- =====================================================

-- 1. Public Chat Rooms (predefined topics + global)
CREATE TABLE IF NOT EXISTS public.public_chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  room_type TEXT NOT NULL DEFAULT 'topic' CHECK (room_type IN ('global', 'topic')),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Public Chat Messages
CREATE TABLE IF NOT EXISTS public.public_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.public_chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  images TEXT[],
  reply_to_id UUID REFERENCES public.public_chat_messages(id) ON DELETE SET NULL,
  is_visible BOOLEAN DEFAULT true,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_public_chat_messages_room ON public.public_chat_messages(room_id);
CREATE INDEX idx_public_chat_messages_created ON public.public_chat_messages(room_id, created_at DESC);
CREATE INDEX idx_public_chat_messages_sender ON public.public_chat_messages(sender_id);
CREATE INDEX idx_public_chat_messages_pinned ON public.public_chat_messages(room_id, is_pinned) WHERE is_pinned = true;

-- 3. Read Status (for unread badges)
CREATE TABLE IF NOT EXISTS public.public_chat_read_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.public_chat_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_read_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(room_id, user_id)
);

CREATE INDEX idx_public_chat_read_status_user ON public.public_chat_read_status(user_id);

-- 4. Typing Indicators
CREATE TABLE IF NOT EXISTS public.public_chat_typing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.public_chat_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(room_id, user_id)
);

-- =====================================================
-- RLS POLICIES
-- =====================================================

ALTER TABLE public.public_chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_chat_read_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_chat_typing ENABLE ROW LEVEL SECURITY;

-- Rooms: All authenticated users can view
CREATE POLICY "Authenticated users can view public rooms"
  ON public.public_chat_rooms FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Messages: All authenticated users can view visible messages
CREATE POLICY "Authenticated users can view messages"
  ON public.public_chat_messages FOR SELECT
  TO authenticated
  USING (is_visible = true);

-- Messages: Authenticated users can send messages
CREATE POLICY "Authenticated users can send messages"
  ON public.public_chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- Messages: Users can soft-delete their own
CREATE POLICY "Users can update own messages"
  ON public.public_chat_messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = sender_id);

-- Read Status: Users manage their own
CREATE POLICY "Users can manage own read status"
  ON public.public_chat_read_status FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Typing: Users manage their own in any room
CREATE POLICY "Users can manage typing indicators"
  ON public.public_chat_typing FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- ENABLE REALTIME
-- =====================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.public_chat_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.public_chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.public_chat_typing;

-- =====================================================
-- SEED DEFAULT ROOMS
-- =====================================================

INSERT INTO public.public_chat_rooms (slug, name, description, icon, room_type, display_order) VALUES
  ('global', 'Global Chat', 'Main public feed - chat with everyone!', '🌍', 'global', 0),
  ('prayer', 'Prayer Requests', 'Share and support prayer needs', '🙏', 'topic', 1),
  ('questions', 'Bible Questions', 'Ask and answer Bible questions', '❓', 'topic', 2),
  ('prophecy', 'Prophecy Discussion', 'Discuss Daniel, Revelation & prophecy', '📖', 'topic', 3),
  ('testimony', 'Testimonies', 'Share what God is doing in your life', '✨', 'topic', 4);

-- Cleanup function for stale typing indicators
CREATE OR REPLACE FUNCTION cleanup_public_chat_typing()
RETURNS void AS $$
BEGIN
  DELETE FROM public.public_chat_typing WHERE updated_at < now() - interval '10 seconds';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
