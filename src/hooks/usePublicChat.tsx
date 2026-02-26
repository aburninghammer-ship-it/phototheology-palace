import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { playMessageNotification } from '@/utils/notificationSound';

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
}

export const usePublicChat = (): UsePublicChatReturn => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rooms, setRooms] = useState<PublicChatRoom[]>([]);
  const [messages, setMessages] = useState<PublicChatMessage[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [activeRoomSlug, setActiveRoomSlug] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      const { data, error } = await (supabase as any)
        .from('public_chat_messages')
        .select(`
          *,
          sender:profiles!sender_id(id, display_name, avatar_url, username)
        `)
        .eq('room_id', activeRoomId)
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) throw error;

      const mapped = (data || []).map((msg: any) => ({
        ...msg,
        images: msg.images || null,
        reply_to_id: msg.reply_to_id || null,
        is_pinned: msg.is_pinned ?? false,
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
    if (!activeRoomId || !user || !content.trim()) return;

    try {
      const insertData: any = {
        room_id: activeRoomId,
        sender_id: user.id,
        content: content.trim(),
      };

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

  // Realtime subscriptions
  useEffect(() => {
    if (!user) return;

    const messagesChannel = supabase
      .channel('public-chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'public_chat_messages',
        },
        async (payload) => {
          const newMessage = payload.new as any;

          // Fetch sender info
          const { data: sender } = await supabase
            .from('profiles')
            .select('id, display_name, avatar_url, username')
            .eq('id', newMessage.sender_id)
            .single();

          const messageWithSender: PublicChatMessage = {
            ...newMessage,
            images: newMessage.images || null,
            reply_to_id: newMessage.reply_to_id || null,
            is_pinned: newMessage.is_pinned ?? false,
            reply_to: null,
            sender: sender || { id: newMessage.sender_id, display_name: 'Unknown', avatar_url: null, username: null },
          };

          // Add to messages if current room
          if (newMessage.room_id === activeRoomId) {
            setMessages(prev => {
              // Avoid duplicates
              if (prev.some(m => m.id === newMessage.id)) return prev;
              return [...prev, messageWithSender];
            });
          }

          // Play sound for messages from others
          if (newMessage.sender_id !== user.id && newMessage.room_id !== activeRoomId) {
            playMessageNotification();
          }
        }
      )
      .subscribe();

    return () => {
      messagesChannel.unsubscribe();
    };
  }, [user, activeRoomId]);

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
  };
};
