import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { playMessageNotification } from '@/utils/notificationSound';
import { useGlobalLiveChatPref } from '@/hooks/useGlobalLiveChatPref';

export interface PublicChatRoom {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  room_type: 'global' | 'topic';
  display_order: number;
  unread_count: number;
}

export interface PublicChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  images: string[] | null;
  reply_to_id: string | null;
  is_pinned: boolean;
  created_at: string;
  sender?: {
    id: string;
    display_name: string;
    avatar_url: string | null;
    username: string | null;
  };
  reply_to?: {
    content: string;
    sender: { display_name: string };
  } | null;
}

interface TypingUser {
  user_id: string;
  display_name: string;
}

export interface ReactionGroup {
  emoji: string;
  user_ids: string[];
}

// message_id → array of { emoji, user_ids[] }
export type ReactionsMap = Record<string, ReactionGroup[]>;

interface UsePublicChatReturn {
  rooms: PublicChatRoom[];
  messages: PublicChatMessage[];
  activeRoomId: string | null;
  activeRoomSlug: string | null;
  setActiveRoom: (roomIdOrSlug: string) => void;
  typingUsers: TypingUser[];
  isLoading: boolean;
  sendMessage: (content: string, images?: string[], replyToId?: string | null) => Promise<void>;
  updateTypingIndicator: (isTyping: boolean) => void;
  markRoomAsRead: (roomId: string) => Promise<void>;
  pinnedMessages: PublicChatMessage[];
  totalUnread: number;
  deleteMessage: (messageId: string) => Promise<void>;
  editMessage: (messageId: string, newContent: string) => Promise<void>;
  getThreadMessages: (parentId: string) => PublicChatMessage[];
  reactions: ReactionsMap;
  toggleReaction: (messageId: string, emoji: string) => Promise<void>;
}

export const usePublicChat = (): UsePublicChatReturn => {
  const { user } = useAuth();
  const { toast } = useToast();
  const liveChatEnabled = useGlobalLiveChatPref();
  const [rooms, setRooms] = useState<PublicChatRoom[]>([]);
  const [messages, setMessages] = useState<PublicChatMessage[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [activeRoomSlug, setActiveRoomSlug] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reactions, setReactions] = useState<ReactionsMap>({});
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const instanceIdRef = useRef(Math.random().toString(36).slice(2, 8));

  // Fetch rooms — works with minimal schema (no slug/is_active/display_order)
  const fetchRooms = useCallback(async () => {
    if (!user) return;

    try {
      const { data: roomsData, error } = await (supabase as any)
        .from('public_chat_rooms')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      const roomsWithDefaults = (roomsData || []).map((room: any, idx: number) => ({
        ...room,
        slug: room.slug || room.name?.toLowerCase().replace(/\s+/g, '-') || `room-${idx}`,
        room_type: room.room_type || 'global',
        display_order: room.display_order ?? idx,
        unread_count: 0,
      }));

      setRooms(roomsWithDefaults as PublicChatRoom[]);

      // Auto-select first room if none selected
      if (!activeRoomId && roomsWithDefaults.length > 0) {
        setActiveRoomId(roomsWithDefaults[0].id);
        setActiveRoomSlug(roomsWithDefaults[0].slug);
      }
    } catch (error) {
      console.error('Error fetching public chat rooms:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, activeRoomId]);

  // Fetch messages for active room
  const fetchMessages = useCallback(async () => {
    if (!activeRoomId) {
      setMessages([]);
      return;
    }

    try {
      // Load all messages — no limit so old threads remain visible and commentable
      const { data, error } = await (supabase as any)
        .from('public_chat_messages')
        .select(`
          *,
          sender:profiles!sender_id(id, display_name, avatar_url, username)
        `)
        .eq('room_id', activeRoomId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const mapped = (data || []).map((msg: any) => ({
        ...msg,
        images: msg.images || null,
        reply_to_id: msg.reply_to_id || null,
        is_pinned: msg.is_pinned ?? false,
        is_deleted: msg.is_deleted ?? false,
        reply_to: null,
      }));

      setMessages(mapped as PublicChatMessage[]);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [activeRoomId]);

  // Set active room by ID or slug
  const setActiveRoom = useCallback((roomIdOrSlug: string) => {
    const room = rooms.find(r => r.id === roomIdOrSlug || r.slug === roomIdOrSlug);
    if (room) {
      setActiveRoomId(room.id);
      setActiveRoomSlug(room.slug);
    }
  }, [rooms]);

  // Send message
  const sendMessage = useCallback(async (
    content: string,
    images?: string[],
    replyToId?: string | null
  ) => {
    if (!activeRoomId || !user || (!content.trim() && (!images || images.length === 0))) return;

    try {
      const insertData: any = {
        room_id: activeRoomId,
        sender_id: user.id,
        content: content.trim(),
      };

      if (replyToId) {
        insertData.reply_to_id = replyToId;
      }

      if (images && images.length > 0) {
        insertData.images = images;
      }

      const { error } = await (supabase as any).from('public_chat_messages').insert(insertData);

      if (error) throw error;

      // Immediately refetch to show the message
      await fetchMessages();
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    }
  }, [activeRoomId, user, toast, fetchMessages]);

  // Delete (soft-delete) own message
  const deleteMessage = useCallback(async (messageId: string) => {
    if (!user) return;
    try {
      const { error } = await (supabase as any)
        .from('public_chat_messages')
        .update({ is_deleted: true, content: '[deleted]', updated_at: new Date().toISOString() })
        .eq('id', messageId)
        .eq('sender_id', user.id);

      if (error) throw error;

      setMessages(prev =>
        prev.map(m => m.id === messageId ? { ...m, is_deleted: true, content: '[deleted]' } as any : m)
      );
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({ title: 'Error', description: 'Failed to delete message.', variant: 'destructive' });
    }
  }, [user, toast]);

  // Edit own message
  const editMessage = useCallback(async (messageId: string, newContent: string) => {
    if (!user || !newContent.trim()) return;
    try {
      const { error } = await (supabase as any)
        .from('public_chat_messages')
        .update({ content: newContent.trim(), updated_at: new Date().toISOString() })
        .eq('id', messageId)
        .eq('sender_id', user.id);

      if (error) throw error;

      setMessages(prev =>
        prev.map(m => m.id === messageId ? { ...m, content: newContent.trim(), updated_at: new Date().toISOString() } as any : m)
      );
    } catch (error) {
      console.error('Error editing message:', error);
      toast({ title: 'Error', description: 'Failed to edit message.', variant: 'destructive' });
    }
  }, [user, toast]);

  // Get thread messages (replies to a parent)
  const getThreadMessages = useCallback((parentId: string) => {
    return messages.filter(m => m.reply_to_id === parentId);
  }, [messages]);

  // Fetch reactions for a set of message IDs and group by message+emoji
  const fetchReactions = useCallback(async (messageIds: string[]) => {
    if (messageIds.length === 0) return;
    try {
      const { data, error } = await (supabase as any)
        .from('public_chat_reactions')
        .select('message_id, user_id, emoji')
        .in('message_id', messageIds);

      if (error) throw error;

      const map: ReactionsMap = {};
      for (const row of data || []) {
        if (!map[row.message_id]) map[row.message_id] = [];
        const group = map[row.message_id].find((g: ReactionGroup) => g.emoji === row.emoji);
        if (group) {
          if (!group.user_ids.includes(row.user_id)) group.user_ids.push(row.user_id);
        } else {
          map[row.message_id].push({ emoji: row.emoji, user_ids: [row.user_id] });
        }
      }
      setReactions(map);
    } catch (err) {
      console.error('Error fetching reactions:', err);
    }
  }, []);

  // Toggle a reaction (add or remove)
  const toggleReaction = useCallback(async (messageId: string, emoji: string) => {
    if (!user) return;

    const existing = reactions[messageId]?.find(g => g.emoji === emoji);
    const alreadyReacted = existing?.user_ids.includes(user.id);

    // Optimistic update
    setReactions(prev => {
      const groups = [...(prev[messageId] || [])];
      const idx = groups.findIndex(g => g.emoji === emoji);
      if (alreadyReacted) {
        if (idx !== -1) {
          const updated = { ...groups[idx], user_ids: groups[idx].user_ids.filter(id => id !== user.id) };
          if (updated.user_ids.length === 0) groups.splice(idx, 1);
          else groups[idx] = updated;
        }
      } else {
        if (idx !== -1) {
          groups[idx] = { ...groups[idx], user_ids: [...groups[idx].user_ids, user.id] };
        } else {
          groups.push({ emoji, user_ids: [user.id] });
        }
      }
      return { ...prev, [messageId]: groups };
    });

    try {
      if (alreadyReacted) {
        await (supabase as any)
          .from('public_chat_reactions')
          .delete()
          .eq('message_id', messageId)
          .eq('user_id', user.id)
          .eq('emoji', emoji);
      } else {
        await (supabase as any)
          .from('public_chat_reactions')
          .insert({ message_id: messageId, user_id: user.id, emoji });
      }
    } catch (err) {
      console.error('Error toggling reaction:', err);
      // Re-fetch to correct state
      const ids = messages.map(m => m.id);
      fetchReactions(ids);
    }
  }, [user, reactions, messages, fetchReactions]);

  // Typing indicator (no-op if table doesn't exist)
  const updateTypingIndicator = useCallback((_isTyping: boolean) => {
    // Typing table may not exist yet — silently skip
  }, []);

  // Mark room as read (no-op if table doesn't exist)
  const markRoomAsRead = useCallback(async (_roomId: string) => {
    // Read status table may not exist yet — silently skip
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Fetch reactions whenever messages change
  useEffect(() => {
    const ids = messages.map(m => m.id);
    if (ids.length > 0) fetchReactions(ids);
  }, [messages, fetchReactions]);

  // Realtime subscriptions
  useEffect(() => {
    if (!user) return;

    const messagesChannel = supabase
      .channel(`public-chat-messages-${instanceIdRef.current}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'public_chat_messages',
        },
        async (payload) => {
          const row = (payload.new || payload.old) as any;
          if (!row?.room_id) return;

          // Keep active room fully in sync across all clients
          if (row.room_id === activeRoomId) {
            await fetchMessages();
          }

          // Play sound for off-room messages from others (only if enabled)
          if (payload.eventType === 'INSERT' && row.sender_id !== user.id && row.room_id !== activeRoomId && liveChatEnabled) {
            playMessageNotification();
          }
        }
      )
      .subscribe();

    const reactionsChannel = supabase
      .channel(`public-chat-reactions-${instanceIdRef.current}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'public_chat_reactions',
        },
        (payload) => {
          const row = (payload.new || payload.old) as any;
          if (!row?.message_id) return;

          if (payload.eventType === 'INSERT') {
            setReactions(prev => {
              const groups = [...(prev[row.message_id] || [])];
              const idx = groups.findIndex(g => g.emoji === row.emoji);
              if (idx !== -1) {
                if (!groups[idx].user_ids.includes(row.user_id)) {
                  groups[idx] = { ...groups[idx], user_ids: [...groups[idx].user_ids, row.user_id] };
                }
              } else {
                groups.push({ emoji: row.emoji, user_ids: [row.user_id] });
              }
              return { ...prev, [row.message_id]: groups };
            });
          } else if (payload.eventType === 'DELETE') {
            setReactions(prev => {
              const groups = [...(prev[row.message_id] || [])];
              const idx = groups.findIndex(g => g.emoji === row.emoji);
              if (idx !== -1) {
                const updated = { ...groups[idx], user_ids: groups[idx].user_ids.filter((id: string) => id !== row.user_id) };
                if (updated.user_ids.length === 0) groups.splice(idx, 1);
                else groups[idx] = updated;
              }
              return { ...prev, [row.message_id]: groups };
            });
          }
        }
      )
      .subscribe();

    return () => {
      messagesChannel.unsubscribe();
      reactionsChannel.unsubscribe();
    };
  }, [user, activeRoomId, fetchMessages, liveChatEnabled]);

  // Fallback sync in case a realtime event is dropped on poor connections
  useEffect(() => {
    if (!user || !activeRoomId) return;

    const interval = setInterval(() => {
      fetchMessages();
    }, 6000);

    return () => clearInterval(interval);
  }, [user, activeRoomId, fetchMessages]);

  // Computed values
  const pinnedMessages = messages.filter(m => m.is_pinned);
  const totalUnread = rooms.reduce((sum, r) => sum + r.unread_count, 0);

  return {
    rooms,
    messages,
    activeRoomId,
    activeRoomSlug,
    setActiveRoom,
    typingUsers,
    isLoading,
    sendMessage,
    updateTypingIndicator,
    markRoomAsRead,
    pinnedMessages,
    totalUnread,
    deleteMessage,
    editMessage,
    getThreadMessages,
    reactions,
    toggleReaction,
  };
};
