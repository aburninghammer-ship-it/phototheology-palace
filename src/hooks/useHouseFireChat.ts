import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface HouseFireMessage {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  created_at: string;
  sender_name?: string;
  sender_avatar?: string;
}

export function useHouseFireChat(groupId: string | null) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<HouseFireMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [roomId, setRoomId] = useState<string | null>(null);
  const channelRef = useRef<any>(null);

  // Find or create chat room for this group
  const ensureRoom = useCallback(async () => {
    if (!groupId || !user) return null;

    // Check for existing room
    const { data: existing } = await (supabase
      .from('chat_rooms' as any)
      .select('id')
      .eq('small_group_id', groupId)
      .single() as any);

    if (existing?.id) return existing.id;

    // Create room
    const { data: group } = await (supabase
      .from('small_groups' as any)
      .select('name, church_id')
      .eq('id', groupId)
      .single() as any);

    if (!group) return null;

    const { data: newRoom, error } = await (supabase
      .from('chat_rooms' as any)
      .insert({
        name: group.name,
        room_type: 'small_group',
        church_id: group.church_id,
        small_group_id: groupId,
        created_by: user.id,
        is_private: true
      })
      .select('id')
      .single() as any);

    if (error) {
      console.error('Error creating chat room:', error);
      return null;
    }

    return newRoom?.id || null;
  }, [groupId, user]);

  // Load messages with sender info
  const loadMessages = useCallback(async (rid: string) => {
    const { data, error } = await (supabase
      .from('chat_messages' as any)
      .select(`
        id, room_id, sender_id, content, message_type, created_at,
        profiles:sender_id (display_name, avatar_url)
      `)
      .eq('room_id', rid)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true })
      .limit(100) as any);

    if (error) {
      console.error('Error loading messages:', error);
      return;
    }

    setMessages(
      (data || []).map((m: any) => ({
        ...m,
        sender_name: m.profiles?.display_name || 'Unknown',
        sender_avatar: m.profiles?.avatar_url || null
      }))
    );
  }, []);

  // Init room + subscribe
  useEffect(() => {
    if (!groupId || !user) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      const rid = await ensureRoom();
      if (cancelled || !rid) {
        setLoading(false);
        return;
      }

      setRoomId(rid);
      await loadMessages(rid);
      setLoading(false);

      // Realtime subscription
      const channel = supabase
        .channel(`house-fire-chat-${rid}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: `room_id=eq.${rid}`
          },
          async (payload) => {
            const msg = payload.new as any;
            // Fetch sender profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('display_name, avatar_url')
              .eq('id', msg.sender_id)
              .single();

            setMessages(prev => [
              ...prev,
              {
                ...msg,
                sender_name: profile?.display_name || 'Unknown',
                sender_avatar: profile?.avatar_url || null
              }
            ]);
          }
        )
        .subscribe();

      channelRef.current = channel;
    })();

    return () => {
      cancelled = true;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [groupId, user?.id]);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!roomId || !user || !content.trim()) return;

    const { error } = await (supabase
      .from('chat_messages' as any)
      .insert({
        room_id: roomId,
        sender_id: user.id,
        content: content.trim(),
        message_type: 'text'
      }) as any);

    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }, [roomId, user]);

  return { messages, loading, sendMessage, roomId };
}
