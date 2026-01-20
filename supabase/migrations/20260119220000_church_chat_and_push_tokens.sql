-- =====================================================
-- CHURCH GROUP CHAT ROOMS & PUSH NOTIFICATION TOKENS
-- =====================================================

-- 1. Push Notification Device Tokens
-- Store device tokens for native push notifications
CREATE TABLE IF NOT EXISTS push_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('ios', 'android', 'web')),
  device_id TEXT, -- optional device identifier
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, token)
);

-- Index for fast lookups
CREATE INDEX idx_push_tokens_user_id ON push_tokens(user_id);
CREATE INDEX idx_push_tokens_active ON push_tokens(is_active) WHERE is_active = true;

-- RLS for push_tokens
ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own tokens"
  ON push_tokens FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 2. Church Chat Rooms
-- Group chat rooms for churches (general, prayer, announcements, etc.)
CREATE TABLE IF NOT EXISTS church_chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  room_type TEXT NOT NULL DEFAULT 'general' CHECK (room_type IN ('general', 'prayer', 'announcements', 'bible_study', 'fellowship', 'custom')),
  icon TEXT, -- emoji or icon identifier
  is_default BOOLEAN DEFAULT false, -- default rooms created with church
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX idx_church_chat_rooms_church_id ON church_chat_rooms(church_id);

-- RLS for church_chat_rooms
ALTER TABLE church_chat_rooms ENABLE ROW LEVEL SECURITY;

-- Church members can view chat rooms
CREATE POLICY "Church members can view chat rooms"
  ON church_chat_rooms FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM church_members
      WHERE church_members.church_id = church_chat_rooms.church_id
      AND church_members.user_id = auth.uid()
    )
  );

-- Church admins/leaders can manage chat rooms
CREATE POLICY "Church leaders can manage chat rooms"
  ON church_chat_rooms FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM church_members
      WHERE church_members.church_id = church_chat_rooms.church_id
      AND church_members.user_id = auth.uid()
      AND church_members.role IN ('admin', 'leader')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM church_members
      WHERE church_members.church_id = church_chat_rooms.church_id
      AND church_members.user_id = auth.uid()
      AND church_members.role IN ('admin', 'leader')
    )
  );

-- 3. Church Chat Messages
CREATE TABLE IF NOT EXISTS church_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES church_chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'prayer_request', 'announcement', 'scripture', 'image')),
  images TEXT[], -- array of image URLs
  reply_to_id UUID REFERENCES church_chat_messages(id) ON DELETE SET NULL,
  is_pinned BOOLEAN DEFAULT false,
  is_flagged BOOLEAN DEFAULT false,
  flagged_reason TEXT,
  is_visible BOOLEAN DEFAULT true,
  edited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_church_chat_messages_room_id ON church_chat_messages(room_id);
CREATE INDEX idx_church_chat_messages_sender_id ON church_chat_messages(sender_id);
CREATE INDEX idx_church_chat_messages_created_at ON church_chat_messages(created_at DESC);
CREATE INDEX idx_church_chat_messages_pinned ON church_chat_messages(room_id, is_pinned) WHERE is_pinned = true;

-- RLS for church_chat_messages
ALTER TABLE church_chat_messages ENABLE ROW LEVEL SECURITY;

-- Church members can view messages in rooms they have access to
CREATE POLICY "Church members can view chat messages"
  ON church_chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM church_chat_rooms r
      JOIN church_members cm ON cm.church_id = r.church_id
      WHERE r.id = church_chat_messages.room_id
      AND cm.user_id = auth.uid()
      AND church_chat_messages.is_visible = true
    )
  );

-- Church members can send messages
CREATE POLICY "Church members can send messages"
  ON church_chat_messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM church_chat_rooms r
      JOIN church_members cm ON cm.church_id = r.church_id
      WHERE r.id = room_id
      AND cm.user_id = auth.uid()
    )
  );

-- Users can edit their own messages
CREATE POLICY "Users can edit own messages"
  ON church_chat_messages FOR UPDATE
  USING (auth.uid() = sender_id)
  WITH CHECK (auth.uid() = sender_id);

-- Leaders can moderate messages (flag, hide, pin)
CREATE POLICY "Leaders can moderate messages"
  ON church_chat_messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM church_chat_rooms r
      JOIN church_members cm ON cm.church_id = r.church_id
      WHERE r.id = church_chat_messages.room_id
      AND cm.user_id = auth.uid()
      AND cm.role IN ('admin', 'leader')
    )
  );

-- 4. Chat Room Read Status (for unread counts)
CREATE TABLE IF NOT EXISTS church_chat_read_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES church_chat_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_read_at TIMESTAMPTZ DEFAULT now(),
  last_read_message_id UUID REFERENCES church_chat_messages(id) ON DELETE SET NULL,
  UNIQUE(room_id, user_id)
);

CREATE INDEX idx_church_chat_read_status_user ON church_chat_read_status(user_id);

ALTER TABLE church_chat_read_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own read status"
  ON church_chat_read_status FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5. Typing Indicators for Group Chat
CREATE TABLE IF NOT EXISTS church_chat_typing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES church_chat_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(room_id, user_id)
);

ALTER TABLE church_chat_typing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage typing indicators"
  ON church_chat_typing FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM church_chat_rooms r
      JOIN church_members cm ON cm.church_id = r.church_id
      WHERE r.id = church_chat_typing.room_id
      AND cm.user_id = auth.uid()
    )
  );

-- Cleanup function for typing indicators (older than 10 seconds)
CREATE OR REPLACE FUNCTION cleanup_church_chat_typing()
RETURNS void AS $$
BEGIN
  DELETE FROM church_chat_typing WHERE updated_at < now() - interval '10 seconds';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Enable Realtime for chat tables
ALTER PUBLICATION supabase_realtime ADD TABLE church_chat_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE church_chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE church_chat_typing;
ALTER PUBLICATION supabase_realtime ADD TABLE push_tokens;

-- 7. Function to create default chat rooms when a church is created
CREATE OR REPLACE FUNCTION create_default_church_chat_rooms()
RETURNS TRIGGER AS $$
BEGIN
  -- Create General chat room
  INSERT INTO church_chat_rooms (church_id, name, description, room_type, icon, is_default, created_by)
  VALUES (NEW.id, 'General', 'General discussion for all church members', 'general', '💬', true, NULL);

  -- Create Prayer Requests room
  INSERT INTO church_chat_rooms (church_id, name, description, room_type, icon, is_default, created_by)
  VALUES (NEW.id, 'Prayer Requests', 'Share and support prayer needs', 'prayer', '🙏', true, NULL);

  -- Create Announcements room
  INSERT INTO church_chat_rooms (church_id, name, description, room_type, icon, is_default, created_by)
  VALUES (NEW.id, 'Announcements', 'Important church announcements', 'announcements', '📢', true, NULL);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create default rooms for new churches
DROP TRIGGER IF EXISTS on_church_created_add_chat_rooms ON churches;
CREATE TRIGGER on_church_created_add_chat_rooms
  AFTER INSERT ON churches
  FOR EACH ROW
  EXECUTE FUNCTION create_default_church_chat_rooms();

-- 8. Create default rooms for existing churches (one-time migration)
INSERT INTO church_chat_rooms (church_id, name, description, room_type, icon, is_default)
SELECT c.id, 'General', 'General discussion for all church members', 'general', '💬', true
FROM churches c
WHERE NOT EXISTS (
  SELECT 1 FROM church_chat_rooms ccr
  WHERE ccr.church_id = c.id AND ccr.room_type = 'general' AND ccr.is_default = true
);

INSERT INTO church_chat_rooms (church_id, name, description, room_type, icon, is_default)
SELECT c.id, 'Prayer Requests', 'Share and support prayer needs', 'prayer', '🙏', true
FROM churches c
WHERE NOT EXISTS (
  SELECT 1 FROM church_chat_rooms ccr
  WHERE ccr.church_id = c.id AND ccr.room_type = 'prayer' AND ccr.is_default = true
);

INSERT INTO church_chat_rooms (church_id, name, description, room_type, icon, is_default)
SELECT c.id, 'Announcements', 'Important church announcements', 'announcements', '📢', true
FROM churches c
WHERE NOT EXISTS (
  SELECT 1 FROM church_chat_rooms ccr
  WHERE ccr.church_id = c.id AND ccr.room_type = 'announcements' AND ccr.is_default = true
);
