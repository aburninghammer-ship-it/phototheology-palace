import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { playMessageNotification } from '@/utils/notificationSound';

export interface ChatRoom {
  id: string;
  church_id: string;
  name: string;
  description: string | null;
  room_type: 'general' | 'prayer' | 'announcements' | 'bible_study' | 'fellowship' | 'custom';
  icon: string | null;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  unread_count: number;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'prayer_request' | 'announcement' | 'scripture' | 'image';
  images: string[] | null;
  reply_to_id: string | null;
  is_pinned: boolean;
  is_visible: boolean;
  edited_at: string | null;
  created_at: string;
  sender?: {
    display_name: string;
    avatar_url: string | null;
  };
  reply_to?: {
    content: string;
    sender: {
      display_name: string;
    };
  } | null;
}

interface TypingUser {
  user_id: string;
  display_name: string;
}

interface UseChurchChatRoomsReturn {
  rooms: ChatRoom[];
  messages: ChatMessage[];
  activeRoomId: string | null;
  setActiveRoomId: (roomId: string | null) => void;
  typingUsers: TypingUser[];
  isLoading: boolean;
  sendMessage: (content: string, messageType?: ChatMessage['message_type'], images?: string[], replyToId?: string | null) => Promise<void>;
  updateTypingIndicator: (isTyping: boolean) => void;
  markRoomAsRead: (roomId: string) => Promise<void>;
  pinMessage: (messageId: string, isPinned: boolean) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  createRoom: (name: string, description: string, roomType: ChatRoom['room_type'], icon?: string) => Promise<void>;
}

export const useChurchChatRooms = (churchId: string | null): UseChurchChatRoomsReturn => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch chat rooms for church
  const fetchRooms = useCallback(async () => {
    if (!churchId || !user) return;

    try {
      // Get rooms with unread counts
      const { data: roomsData, error } = await (supabase as any)
        .from('church_chat_rooms')
        .select('*')
        .eq('church_id', churchId)
        .eq('is_active', true)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Get read status for unread counts
      const { data: readStatus } = await (supabase as any)
        .from('church_chat_read_status')
        .select('room_id, last_read_at')
        .eq('user_id', user.id);

      const readMap = new Map((readStatus || []).map((r: any) => [r.room_id, r.last_read_at]));

      // Calculate unread counts
      const roomsWithUnread = await Promise.all(
        (roomsData || []).map(async (room) => {
          const lastRead = readMap.get(room.id);
          let unreadCount = 0;

          if (lastRead) {
            const { count } = await (supabase as any)
              .from('church_chat_messages')
              .select('*', { count: 'exact', head: true })
              .eq('room_id', room.id)
              .eq('is_visible', true)
              .gt('created_at', lastRead)
              .neq('sender_id', user.id);

            unreadCount = count ?? 0;
          } else {
            // No read status - count all messages
            const { count } = await (supabase as any)
              .from('church_chat_messages')
              .select('*', { count: 'exact', head: true })
              .eq('room_id', room.id)
              .eq('is_visible', true)
              .neq('sender_id', user.id);

            unreadCount = count ?? 0;
          }

          return { ...room, unread_count: unreadCount };
        })
      );

      setRooms(roomsWithUnread as ChatRoom[]);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    } finally {
      setIsLoading(false);
    }
  }, [churchId, user]);

  // Fetch messages for active room
  const fetchMessages = useCallback(async () => {
    if (!activeRoomId) {
      setMessages([]);
      return;
    }

    try {
      const { data, error } = await (supabase as any)
        .from('church_chat_messages')
        .select(`
          *,
          sender:profiles!sender_id(display_name, avatar_url),
          reply_to:church_chat_messages!reply_to_id(
            content,
            sender:profiles!sender_id(display_name)
          )
        `)
        .eq('room_id', activeRoomId)
        .eq('is_visible', true)
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) throw error;

      setMessages((data || []) as unknown as ChatMessage[]);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [activeRoomId]);

  // Fetch typing users
  const fetchTypingUsers = useCallback(async () => {
    if (!activeRoomId || !user) return;

    try {
      const { data } = await (supabase as any)
        .from('church_chat_typing')
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

  // Initial fetch
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Set up realtime subscriptions
  useEffect(() => {
    if (!churchId || !user) return;

    // Subscribe to new messages
    const messagesChannel = supabase
      .channel(`church-chat-messages-${churchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'church_chat_messages',
        },
        async (payload) => {
          const newMessage = payload.new as any;

          // Check if message is for a room we have access to
          const room = rooms.find(r => r.id === newMessage.room_id);
          if (!room) return;

          // Fetch sender info
          const { data: sender } = await supabase
            .from('profiles')
            .select('display_name, avatar_url')
            .eq('id', newMessage.sender_id)
            .single();

          const messageWithSender: ChatMessage = {
            ...newMessage,
            sender: sender || { display_name: 'Unknown', avatar_url: null },
          };

          // If this is the active room, add to messages
          if (newMessage.room_id === activeRoomId) {
            setMessages(prev => [...prev, messageWithSender]);
          }

          // Update unread count for the room
          if (newMessage.sender_id !== user.id) {
            setRooms(prev =>
              prev.map(r =>
                r.id === newMessage.room_id
                  ? { ...r, unread_count: r.unread_count + 1 }
                  : r
              )
            );

            // Play notification sound if not in active room
            if (newMessage.room_id !== activeRoomId) {
              playMessageNotification();
            }
          }
        }
      )
      .subscribe();

    // Subscribe to typing indicators
    const typingChannel = supabase
      .channel(`church-chat-typing-${activeRoomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'church_chat_typing',
          filter: `room_id=eq.${activeRoomId}`,
        },
        () => {
          fetchTypingUsers();
        }
      )
      .subscribe();

    return () => {
      messagesChannel.unsubscribe();
      typingChannel.unsubscribe();
    };
  }, [churchId, user, rooms, activeRoomId, fetchTypingUsers]);

  // Send message
  const sendMessage = useCallback(async (
    content: string,
    messageType: ChatMessage['message_type'] = 'text',
    images?: string[],
    replyToId?: string | null
  ) => {
    if (!activeRoomId || !user || !content.trim()) return;

    try {
      const { error } = await (supabase as any).from('church_chat_messages').insert({
        room_id: activeRoomId,
        sender_id: user.id,
        content: content.trim(),
        message_type: messageType,
        images: images || null,
        reply_to_id: replyToId || null,
      });

      if (error) throw error;

      // Clear typing indicator
      updateTypingIndicator(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    }
  }, [activeRoomId, user, toast]);

  // Update typing indicator
  const updateTypingIndicator = useCallback((isTyping: boolean) => {
    if (!activeRoomId || !user) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (isTyping) {
      // Upsert typing indicator
      (supabase as any).from('church_chat_typing').upsert({
        room_id: activeRoomId,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'room_id,user_id',
      }).then(() => {});

      // Auto-remove after 5 seconds
      typingTimeoutRef.current = setTimeout(() => {
        updateTypingIndicator(false);
      }, 5000);
    } else {
      // Remove typing indicator
      (supabase as any)
        .from('church_chat_typing')
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
      // Get latest message
      const { data: latestMessage } = await (supabase as any)
        .from('church_chat_messages')
        .select('id')
        .eq('room_id', roomId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      await (supabase as any).from('church_chat_read_status').upsert({
        room_id: roomId,
        user_id: user.id,
        last_read_at: new Date().toISOString(),
        last_read_message_id: latestMessage?.id || null,
      }, {
        onConflict: 'room_id,user_id',
      });

      // Update local state
      setRooms(prev =>
        prev.map(r => (r.id === roomId ? { ...r, unread_count: 0 } : r))
      );
    } catch (error) {
      console.error('Error marking room as read:', error);
    }
  }, [user]);

  // Pin/unpin message (leaders only)
  const pinMessage = useCallback(async (messageId: string, isPinned: boolean) => {
    try {
      const { error } = await (supabase as any)
        .from('church_chat_messages')
        .update({ is_pinned: isPinned })
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prev =>
        prev.map(m => (m.id === messageId ? { ...m, is_pinned: isPinned } : m))
      );
    } catch (error) {
      console.error('Error pinning message:', error);
    }
  }, []);

  // Delete message (soft delete - hide)
  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('church_chat_messages')
        .update({ is_visible: false })
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prev => prev.filter(m => m.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  }, []);

  // Create new room (leaders only)
  const createRoom = useCallback(async (
    name: string,
    description: string,
    roomType: ChatRoom['room_type'],
    icon?: string
  ) => {
    if (!churchId || !user) return;

    try {
      const { data, error } = await (supabase as any).from('church_chat_rooms').insert({
        church_id: churchId,
        name,
        description,
        room_type: roomType,
        icon: icon || null,
        created_by: user.id,
      }).select().single();

      if (error) throw error;

      setRooms(prev => [...prev, { ...data, unread_count: 0 } as ChatRoom]);

      toast({
        title: 'Room Created',
        description: `"${name}" chat room has been created.`,
      });
    } catch (error) {
      console.error('Error creating room:', error);
      toast({
        title: 'Error',
        description: 'Failed to create chat room.',
        variant: 'destructive',
      });
    }
  }, [churchId, user, toast]);

  // Mark room as read when switching to it
  useEffect(() => {
    if (activeRoomId) {
      markRoomAsRead(activeRoomId);
    }
  }, [activeRoomId, markRoomAsRead]);

  return {
    rooms,
    messages,
    activeRoomId,
    setActiveRoomId,
    typingUsers,
    isLoading,
    sendMessage,
    updateTypingIndicator,
    markRoomAsRead,
    pinMessage,
    deleteMessage,
    createRoom,
  };
};
