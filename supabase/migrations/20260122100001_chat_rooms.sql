-- Group/Ministry Chat Rooms System
-- Real-time chat rooms for ministry teams, small groups, and church-wide communication

-- Chat rooms table
CREATE TABLE IF NOT EXISTS public.chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id),

  -- Room details
  name TEXT NOT NULL,
  description TEXT,
  room_type TEXT NOT NULL DEFAULT 'ministry' CHECK (room_type IN (
    'ministry',      -- Ministry team chats (worship, outreach, etc.)
    'small_group',   -- Small group chats
    'leaders',       -- Leadership only
    'announcement',  -- Broadcast channel (leaders post, members read)
    'prayer',        -- Prayer request channel
    'general'        -- General church chat
  )),

  -- Linking (optional - can be tied to a small group or ministry)
  small_group_id UUID REFERENCES public.small_groups(id) ON DELETE CASCADE,

  -- Settings
  is_private BOOLEAN DEFAULT false, -- Invite only vs open
  is_archived BOOLEAN DEFAULT false,
  allow_member_posts BOOLEAN DEFAULT true, -- For announcement channels

  -- Media
  icon_emoji TEXT, -- e.g., "🎵" for worship team
  cover_color TEXT DEFAULT '#6366f1', -- Hex color

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Chat room members
CREATE TABLE IF NOT EXISTS public.chat_room_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Role in room
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),

  -- Notification settings
  notifications_enabled BOOLEAN DEFAULT true,
  muted_until TIMESTAMP WITH TIME ZONE,

  -- Tracking
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  UNIQUE(room_id, user_id)
);

-- Chat messages
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Content
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),

  -- Attachments (for images/files)
  attachment_url TEXT,
  attachment_name TEXT,

  -- Reply threading
  reply_to_id UUID REFERENCES public.chat_messages(id),

  -- Reactions (JSON array of {emoji, user_ids})
  reactions JSONB DEFAULT '[]'::jsonb,

  -- Status
  is_edited BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Message read receipts (optional - for "seen by" feature)
CREATE TABLE IF NOT EXISTS public.chat_message_reads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES public.chat_messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  UNIQUE(message_id, user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_chat_rooms_church_id ON public.chat_rooms(church_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_type ON public.chat_rooms(room_type);
CREATE INDEX IF NOT EXISTS idx_chat_room_members_room_id ON public.chat_room_members(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_room_members_user_id ON public.chat_room_members(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id ON public.chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at DESC);

-- Enable RLS
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_message_reads ENABLE ROW LEVEL SECURITY;

-- Policies for chat_rooms
CREATE POLICY "Users can view rooms they are members of"
  ON public.chat_rooms FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_room_members
      WHERE room_id = chat_rooms.id AND user_id = auth.uid()
    ) OR
    -- Or public rooms in their church
    (NOT is_private AND EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = chat_rooms.church_id AND user_id = auth.uid()
    ))
  );

CREATE POLICY "Leaders can create rooms"
  ON public.chat_rooms FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = chat_rooms.church_id
        AND user_id = auth.uid()
        AND role IN ('admin', 'leader', 'pastor')
    )
  );

CREATE POLICY "Room admins can update rooms"
  ON public.chat_rooms FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_room_members
      WHERE room_id = chat_rooms.id
        AND user_id = auth.uid()
        AND role = 'admin'
    )
  );

-- Policies for chat_room_members
CREATE POLICY "Users can view room members"
  ON public.chat_room_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_room_members crm
      WHERE crm.room_id = chat_room_members.room_id AND crm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join public rooms"
  ON public.chat_room_members FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.chat_rooms
      WHERE id = room_id AND NOT is_private
    )
  );

CREATE POLICY "Users can leave rooms"
  ON public.chat_room_members FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for chat_messages
CREATE POLICY "Users can view messages in their rooms"
  ON public.chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_room_members
      WHERE room_id = chat_messages.room_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Members can send messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.chat_room_members
      WHERE room_id = chat_messages.room_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can edit their own messages"
  ON public.chat_messages FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies for read receipts
CREATE POLICY "Users can mark messages as read"
  ON public.chat_message_reads FOR ALL
  USING (auth.uid() = user_id);

-- Enable realtime for chat messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- Function to get unread message count for a user
CREATE OR REPLACE FUNCTION get_unread_count(p_room_id UUID, p_user_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.chat_messages m
  WHERE m.room_id = p_room_id
    AND m.created_at > (
      SELECT COALESCE(last_read_at, '1970-01-01'::timestamptz)
      FROM public.chat_room_members
      WHERE room_id = p_room_id AND user_id = p_user_id
    )
    AND m.user_id != p_user_id
    AND NOT m.is_deleted;
$$;

-- Function to update last read timestamp
CREATE OR REPLACE FUNCTION mark_room_as_read(p_room_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.chat_room_members
  SET last_read_at = now()
  WHERE room_id = p_room_id AND user_id = auth.uid();
END;
$$;
