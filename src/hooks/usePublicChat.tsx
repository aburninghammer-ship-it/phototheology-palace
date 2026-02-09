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

  // Fetch rooms with unread counts
  const fetchRooms = useCallback(async () => {
    if (!user) return;

    try {
      const { data: roomsData, error } = await (supabase as any)
        .from('public_chat_rooms')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;

      // Get read statuses
      const { data: readStatus } = await (supabase as any)
        .from('public_chat_read_status')
        .select('room_id, last_read_at')
        .eq('user_id', user.id);

      const readMap = new Map((readStatus || []).map((r: any) => [r.room_id, r.last_read_at]));

      // Calculate unread counts
      const roomsWithUnread = await Promise.all(
        (roomsData || []).map(async (room: any) => {
          const lastRead = readMap.get(room.id);
          let unreadCount = 0;

          const query = (supabase as any)
            .from('public_chat_messages')
            .select('*', { count: 'exact', head: true })
            .eq('room_id', room.id)
            .eq('is_visible', true)
            .neq('sender_id', user.id);

          if (lastRead) {
            query.gt('created_at', lastRead);
          }

          const { count } = await query;
          unreadCount = count ?? 0;

          return { ...room, unread_count: unreadCount };
        })
      );

      setRooms(roomsWithUnread as PublicChatRoom[]);

      // Auto-select global room if none selected
      if (!activeRoomId && roomsWithUnread.length > 0) {
        const globalRoom = roomsWithUnread.find((r: any) => r.slug === 'global');
        if (globalRoom) {
          setActiveRoomId(globalRoom.id);
          setActiveRoomSlug(globalRoom.slug);
        }
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
          sender:profiles!sender_id(id, display_name, avatar_url, username),
          reply_to:public_chat_messages!reply_to_id(
            content,
            sender:profiles!sender_id(display_name)
          )
        `)
        .eq('room_id', activeRoomId)
        .eq('is_visible', true)
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) throw error;
      setMessages((data || []) as unknown as PublicChatMessage[]);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [activeRoomId]);

  // Fetch typing users
  const fetchTypingUsers = useCallback(async () => {
    if (!activeRoomId || !user) return;

    try {
      const { data } = await (supabase as any)
        .from('public_chat_typing')
        .select(`
          user_id,
          profiles:user_id(display_name)
        `)
        .eq('room_id', activeRoomId)
        .neq('user_id', user.id)
        .gt('updated_at', new Date(Date.now() - 10000).toISOString());

      setTypingUsers(
        (data || []).map((d: any) => ({
          user_id: d.user_id,
          display_name: d.profiles?.display_name || 'Someone',
        }))
      );
    } catch (error) {
      console.error('Error fetching typing users:', error);
    }
  }, [activeRoomId, user]);

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
      const { error } = await (supabase as any).from('public_chat_messages').insert({
        room_id: activeRoomId,
        sender_id: user.id,
        content: content.trim(),
        images: images || null,
        reply_to_id: replyToId || null,
      });

      if (error) throw error;
      updateTypingIndicator(false);
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    }
  }, [activeRoomId, user, toast]);

  // Typing indicator
  const updateTypingIndicator = useCallback((isTyping: boolean) => {
    if (!activeRoomId || !user) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (isTyping) {
      (supabase as any).from('public_chat_typing').upsert({
        room_id: activeRoomId,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'room_id,user_id' }).then(() => {});

      typingTimeoutRef.current = setTimeout(() => {
        updateTypingIndicator(false);
      }, 5000);
    } else {
      (supabase as any)
        .from('public_chat_typing')
        .delete()
        .eq('room_id', activeRoomId)
        .eq('user_id', user.id)
        .then(() => {});
    }
  }, [activeRoomId, user]);

  // Mark room as read
  const markRoomAsRead = useCallback(async (roomId: string) => {
    if (!user) return;

    try {
      await (supabase as any).from('public_chat_read_status').upsert({
        room_id: roomId,
        user_id: user.id,
        last_read_at: new Date().toISOString(),
      }, { onConflict: 'room_id,user_id' });

      setRooms(prev =>
        prev.map(r => (r.id === roomId ? { ...r, unread_count: 0 } : r))
      );
    } catch (error) {
      console.error('Error marking room as read:', error);
    }
  }, [user]);

  // Initial fetch
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Mark as read when room changes
  useEffect(() => {
    if (activeRoomId) {
      markRoomAsRead(activeRoomId);
    }
  }, [activeRoomId, markRoomAsRead]);

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
            sender: sender || { id: newMessage.sender_id, display_name: 'Unknown', avatar_url: null, username: null },
          };

          // Add to messages if current room
          if (newMessage.room_id === activeRoomId) {
            setMessages(prev => [...prev, messageWithSender]);
          }

          // Update unread count if from another user
          if (newMessage.sender_id !== user.id) {
            setRooms(prev =>
              prev.map(r =>
                r.id === newMessage.room_id && r.id !== activeRoomId
                  ? { ...r, unread_count: r.unread_count + 1 }
                  : r
              )
            );

            if (newMessage.room_id !== activeRoomId) {
              playMessageNotification();
            }
          }
        }
      )
      .subscribe();

    return () => {
      messagesChannel.unsubscribe();
    };
  }, [user, activeRoomId]);

  // Typing indicators subscription
  useEffect(() => {
    if (!user || !activeRoomId) return;

    const typingChannel = supabase
      .channel(`public-chat-typing-${activeRoomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'public_chat_typing',
          filter: `room_id=eq.${activeRoomId}`,
        },
        () => {
          fetchTypingUsers();
        }
      )
      .subscribe();

    return () => {
      typingChannel.unsubscribe();
    };
  }, [user, activeRoomId, fetchTypingUsers]);

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
