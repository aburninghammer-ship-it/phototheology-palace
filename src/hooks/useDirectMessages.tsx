import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_deleted: boolean;
  read_by?: string[];
}

export interface Conversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  other_user: {
    id: string;
    display_name: string;
    avatar_url: string | null;
    last_seen: string | null;
  };
  last_message?: Message;
  unread_count: number;
}

export const useDirectMessages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Fetch conversations with unread counts
  const fetchConversations = useCallback(async () => {
    if (!user) return;

    console.log('Fetching conversations for user:', user.id);
    try {
      const { data: convos, error } = await supabase
        .from('conversations')
        .select(`
          id,
          participant1_id,
          participant2_id,
          updated_at
        `)
        .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      console.log('Found conversations:', convos?.length || 0);

      // Fetch other user profiles and unread counts
      const conversationsWithData = await Promise.all(
        (convos || []).map(async (convo) => {
          const otherId = convo.participant1_id === user.id 
            ? convo.participant2_id 
            : convo.participant1_id;

          const { data: profile } = await supabase
            .from('profiles')
            .select('id, display_name, avatar_url, last_seen')
            .eq('id', otherId)
            .single();

          // Get last message
          const { data: lastMsg } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', convo.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // Count unread messages - first get read message IDs, then filter
          const { data: readStatus } = await supabase
            .from('message_read_status')
            .select('message_id')
            .eq('user_id', user.id);
          
          const readMessageIds = readStatus?.map(r => r.message_id) || [];
          
          // Build query for unread messages
          let unreadQuery = supabase
            .from('messages')
            .select('id')
            .eq('conversation_id', convo.id)
            .neq('sender_id', user.id);
          
          // Only add the NOT IN clause if there are read messages
          if (readMessageIds.length > 0) {
            unreadQuery = unreadQuery.not('id', 'in', `(${readMessageIds.join(',')})`);
          }
          
          const { data: unreadMessages } = await unreadQuery;

          return {
            ...convo,
            other_user: profile || {
              id: otherId,
              display_name: 'Unknown User',
              avatar_url: null,
              last_seen: null
            },
            last_message: lastMsg || undefined,
            unread_count: unreadMessages?.length || 0
          };
        })
      );

      setConversations(conversationsWithData);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Fetch messages for active conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          read_status:message_read_status(user_id)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const messagesWithReadStatus = (data || []).map(msg => ({
        ...msg,
        read_by: msg.read_status?.map((r: any) => r.user_id) || []
      }));

      setMessages(messagesWithReadStatus);

      // Mark messages as read
      const unreadMessageIds = messagesWithReadStatus
        .filter(msg => msg.sender_id !== user.id && !msg.read_by.includes(user.id))
        .map(msg => msg.id);

      if (unreadMessageIds.length > 0) {
        await supabase
          .from('message_read_status')
          .insert(
            unreadMessageIds.map(id => ({
              message_id: id,
              user_id: user.id
            }))
          );
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [user]);

  // Start a conversation with a user
  const startConversation = useCallback(async (otherUserId: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase.rpc('get_or_create_conversation', {
        other_user_id: otherUserId
      });

      if (error) throw error;

      setActiveConversationId(data);
      await fetchConversations();
      return data;
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to start conversation',
        variant: 'destructive'
      });
      return null;
    }
  }, [user, fetchConversations, toast]);

  // Send a message
  const sendMessage = useCallback(async (content: string) => {
    console.log('=== SENDING MESSAGE ===');
    console.log('User:', user?.id);
    console.log('Active Conversation:', activeConversationId);
    console.log('Content:', content.trim());
    
    if (!user) {
      console.error('❌ No user found');
      return;
    }
    
    if (!activeConversationId) {
      console.error('❌ No active conversation');
      toast({
        title: 'Error',
        description: 'No active conversation selected',
        variant: 'destructive'
      });
      return;
    }
    
    if (!content.trim()) {
      console.error('❌ Empty message');
      return;
    }

    try {
      console.log('📤 Inserting message into database...');
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: activeConversationId,
          sender_id: user.id,
          content: content.trim()
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Database error:', error);
        throw error;
      }
      
      console.log('✅ Message inserted successfully:', data);

      // Update conversation timestamp
      console.log('📅 Updating conversation timestamp...');
      const { error: updateError } = await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', activeConversationId);

      if (updateError) {
        console.error('⚠️ Failed to update conversation timestamp:', updateError);
      } else {
        console.log('✅ Conversation timestamp updated');
      }
    } catch (error: any) {
      console.error('❌ Error sending message:', error);
      toast({
        title: 'Failed to send message',
        description: error.message || 'Please try again',
        variant: 'destructive'
      });
    }
  }, [user, activeConversationId, toast]);

  // Update typing indicator
  const updateTypingIndicator = useCallback(async (isTyping: boolean) => {
    if (!user || !activeConversationId) return;

    try {
      if (isTyping) {
        await supabase
          .from('typing_indicators')
          .upsert({
            conversation_id: activeConversationId,
            user_id: user.id,
            updated_at: new Date().toISOString()
          });
      } else {
        await supabase
          .from('typing_indicators')
          .delete()
          .eq('conversation_id', activeConversationId)
          .eq('user_id', user.id);
      }
    } catch (error) {
      console.error('Error updating typing indicator:', error);
    }
  }, [user, activeConversationId]);

  // Set up realtime subscriptions
  useEffect(() => {
    if (!user) return;

    console.log('Setting up realtime subscriptions for user:', user.id);

    // Subscribe to new conversations
    const conversationsChannel = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations'
        },
        (payload) => {
          console.log('Conversation change detected:', payload);
          const conversation = payload.new as any;
          // Check if current user is a participant
          if (conversation.participant1_id === user.id || conversation.participant2_id === user.id) {
            fetchConversations();
          }
        }
      )
      .subscribe();

    // Subscribe to new messages
    const messagesChannel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        async (payload) => {
          const newMessage = payload.new as Message;
          console.log('New message received:', newMessage);
          
          // Check if this message is in a conversation we're part of
          const { data: conversation } = await supabase
            .from('conversations')
            .select('*')
            .eq('id', newMessage.conversation_id)
            .single();
          
          const isParticipant = conversation && 
            (conversation.participant1_id === user.id || conversation.participant2_id === user.id);
          
          if (!isParticipant) return;
          
          // If this is the active conversation, add the message
          if (newMessage.conversation_id === activeConversationId) {
            setMessages(prev => [...prev, { ...newMessage, read_by: [] }]);
          }
          
          // Always refresh conversations to update last message and ensure recipient sees it
          await fetchConversations();
          
          // Show notification if from another user and not in active conversation
          if (newMessage.sender_id !== user.id && newMessage.conversation_id !== activeConversationId) {
            const convId = newMessage.conversation_id;
            console.log('Showing notification for message from:', newMessage.sender_id, 'in conversation:', convId);
            
            toast({
              title: 'New Message',
              description: 'You have a new message',
              action: (
                <ToastAction
                  altText="View message"
                  onClick={() => {
                    console.log('Notification clicked - opening conversation:', convId);
                    // Use a fresh reference to ensure state update works
                    setActiveConversationId(convId);
                    // Force sidebar expansion via window event
                    window.dispatchEvent(new CustomEvent('open-chat-sidebar', { 
                      detail: { conversationId: convId } 
                    }));
                  }}
                >
                  View
                </ToastAction>
              )
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'message_read_status'
        },
        () => {
          // Refresh messages to update read status
          if (activeConversationId) {
            fetchMessages(activeConversationId);
          }
        }
      )
      .subscribe();

    // Subscribe to typing indicators
    const typingChannel = supabase
      .channel('typing-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'typing_indicators',
          filter: `conversation_id=eq.${activeConversationId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const indicator = payload.new as any;
            if (indicator.user_id !== user.id) {
              setTypingUsers(prev => new Set(prev).add(indicator.user_id));
            }
          } else if (payload.eventType === 'DELETE') {
            const indicator = payload.old as any;
            setTypingUsers(prev => {
              const newSet = new Set(prev);
              newSet.delete(indicator.user_id);
              return newSet;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(conversationsChannel);
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(typingChannel);
    };
  }, [user, activeConversationId, fetchConversations, fetchMessages, toast]);

  // Initial load
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Load messages when conversation changes
  useEffect(() => {
    console.log('Active conversation ID state changed to:', activeConversationId);
    if (activeConversationId) {
      console.log('Loading messages for conversation:', activeConversationId);
      fetchMessages(activeConversationId);
    } else {
      console.log('No active conversation, clearing messages');
      setMessages([]);
    }
  }, [activeConversationId, fetchMessages]);

  return {
    conversations,
    messages,
    activeConversationId,
    setActiveConversationId,
    startConversation,
    sendMessage,
    updateTypingIndicator,
    typingUsers,
    isLoading,
    refreshConversations: fetchConversations
  };
};