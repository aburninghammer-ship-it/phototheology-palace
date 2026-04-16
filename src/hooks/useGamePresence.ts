// Game Presence Hook
// Track online users and broadcast game invitations via Supabase Realtime

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface OnlineUser {
  odis: string;
  email: string;
  displayName: string;
  onlineAt: string;
}

// Note: 'odis' is intentionally named to avoid collision with Supabase presence internals
// It represents the user's unique identifier

export interface GameInvitation {
  id: string;
  hostUserId: string;
  hostName: string;
  gameId: string;
  roomCode: string;
  verse: {
    reference: string;
    text: string;
  };
  timestamp: string;
}

interface UseGamePresenceReturn {
  onlineUsers: OnlineUser[];
  activeInvitation: GameInvitation | null;
  isOnline: boolean;
  broadcastInvitation: (gameId: string, roomCode: string, verse: { reference: string; text: string }) => void;
  dismissInvitation: () => void;
  onlineCount: number;
}

const PRESENCE_CHANNEL = 'scrabble-pt-presence';

export function useGamePresence(): UseGamePresenceReturn {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [activeInvitation, setActiveInvitation] = useState<GameInvitation | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!user) {
      setIsOnline(false);
      return;
    }

    const channel = supabase.channel(PRESENCE_CHANNEL, {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    // Track presence state
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users: OnlineUser[] = [];

        Object.entries(state).forEach(([odis, presences]) => {
          if (Array.isArray(presences) && presences.length > 0) {
            const presence = presences[0] as any;
            users.push({
              odis,
              email: presence.email || '',
              displayName: presence.displayName || 'Anonymous',
              onlineAt: presence.online_at || new Date().toISOString(),
            });
          }
        });

        setOnlineUsers(users.filter(u => u.odis !== user.id)); // Exclude self
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        console.log('User joined:', key);
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        console.log('User left:', key);
      })
      // Listen for game invitations broadcast
      .on('broadcast', { event: 'game_invitation' }, ({ payload }) => {
        const invitation = payload as GameInvitation;
        // Don't show our own invitations
        if (invitation.hostUserId !== user.id) {
          setActiveInvitation(invitation);
          // Auto-dismiss after 30 seconds
          setTimeout(() => {
            setActiveInvitation(prev =>
              prev?.id === invitation.id ? null : prev
            );
          }, 30000);
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          const displayName = user.email?.split('@')[0] || 'Player';
          await channel.track({
            odis: user.id,
            email: user.email,
            displayName,
            online_at: new Date().toISOString(),
          });
          setIsOnline(true);
        }
      });

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
      channelRef.current = null;
      setIsOnline(false);
    };
  }, [user]);

  // Broadcast a game invitation to all online users
  const broadcastInvitation = useCallback((
    gameId: string,
    roomCode: string,
    verse: { reference: string; text: string }
  ) => {
    if (!channelRef.current || !user) return;

    const invitation: GameInvitation = {
      id: crypto.randomUUID(),
      hostUserId: user.id,
      hostName: user.email?.split('@')[0] || 'Player',
      gameId,
      roomCode,
      verse,
      timestamp: new Date().toISOString(),
    };

    channelRef.current.send({
      type: 'broadcast',
      event: 'game_invitation',
      payload: invitation,
    });
  }, [user]);

  const dismissInvitation = useCallback(() => {
    setActiveInvitation(null);
  }, []);

  return {
    onlineUsers,
    activeInvitation,
    isOnline,
    broadcastInvitation,
    dismissInvitation,
    onlineCount: onlineUsers.length,
  };
}
