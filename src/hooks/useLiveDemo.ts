import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface LiveDemoSession {
  id: string;
  title: string;
  description: string | null;
  status: 'scheduled' | 'live' | 'ended';
  scheduled_for: string | null;
  started_at: string | null;
  viewer_count: number;
}

interface Viewer {
  id: string;
  user_id: string;
  display_name: string | null;
  joined_at: string;
}

export function useLiveDemo() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeSession, setActiveSession] = useState<LiveDemoSession | null>(null);
  const [viewers, setViewers] = useState<Viewer[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Check for active live session
  const checkActiveSession = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('live_demo_sessions')
        .select('*')
        .eq('status', 'live')
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setActiveSession(data as LiveDemoSession);
      } else {
        setActiveSession(null);
      }
    } catch (error) {
      console.error('Error checking active session:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if current user is admin (host)
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsHost(false);
        return;
      }
      const { data } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      setIsHost(!!data);
    };
    checkAdmin();
  }, [user]);

  // Subscribe to session updates
  useEffect(() => {
    checkActiveSession();

    const channel = supabase
      .channel('live-demo-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'live_demo_sessions'
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const session = payload.new as LiveDemoSession;
            if (session.status === 'live') {
              setActiveSession(session);
            } else if (session.status === 'ended') {
              setActiveSession(null);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [checkActiveSession]);

  // Join session as viewer
  const joinSession = useCallback(async (sessionId: string) => {
    if (!user) return;

    try {
      // Get display name
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single();

      // Upsert viewer record
      await supabase
        .from('live_demo_viewers')
        .upsert({
          session_id: sessionId,
          user_id: user.id,
          display_name: profile?.display_name || 'Anonymous',
          joined_at: new Date().toISOString()
        }, {
          onConflict: 'session_id,user_id'
        });

      // Subscribe to presence channel for real-time viewer count
      channelRef.current = supabase
        .channel(`live-demo-${sessionId}`)
        .on('presence', { event: 'sync' }, () => {
          const state = channelRef.current?.presenceState() || {};
          const viewerList = Object.values(state).flat().map((v: any) => ({
            id: v.user_id || crypto.randomUUID(),
            user_id: v.user_id,
            display_name: v.display_name,
            joined_at: v.joined_at
          })) as Viewer[];
          setViewers(viewerList);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channelRef.current?.track({
              user_id: user.id,
              display_name: profile?.display_name || 'Anonymous',
              joined_at: new Date().toISOString()
            });
          }
        });

    } catch (error) {
      console.error('Error joining session:', error);
    }
  }, [user]);

  // Leave session
  const leaveSession = useCallback(async (sessionId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('live_demo_viewers')
        .update({ left_at: new Date().toISOString() })
        .eq('session_id', sessionId)
        .eq('user_id', user.id);

      if (channelRef.current) {
        await supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    } catch (error) {
      console.error('Error leaving session:', error);
    }
  }, [user]);

  // Host: Start a live session
  const startSession = useCallback(async (title: string, description?: string) => {
    if (!user || !isHost) return null;

    try {
      const { data, error } = await supabase
        .from('live_demo_sessions')
        .insert({
          host_id: user.id,
          title,
          description,
          status: 'live',
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setActiveSession(data as LiveDemoSession);

      // Notify all users except host via notifications table
      const { data: allProfiles } = await supabase
        .from('profiles')
        .select('id')
        .neq('id', user.id);

      if (allProfiles && allProfiles.length > 0) {
        const notifications = allProfiles.map(p => ({
          user_id: p.id,
          type: 'live_session',
          title: '🔴 Live Now!',
          message: `"${title}" is live. Tap to join!`,
          link: '/live-demo',
          is_read: false,
        }));
        await supabase.from('notifications').insert(notifications);
      }

      toast({ title: "You're live!", description: "Subscribers are being notified." });
      
      return data.id;
    } catch (error) {
      console.error('Error starting session:', error);
      toast({ title: "Failed to start session", variant: "destructive" });
      return null;
    }
  }, [user, isHost, toast]);

  // Host: End the live session
  const endSession = useCallback(async () => {
    if (!activeSession || !isHost) return;

    try {
      await supabase
        .from('live_demo_sessions')
        .update({
          status: 'ended',
          ended_at: new Date().toISOString(),
          viewer_count: viewers.length
        })
        .eq('id', activeSession.id);

      if (channelRef.current) {
        await supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      setActiveSession(null);
      setViewers([]);
      toast({ title: "Session ended" });
    } catch (error) {
      console.error('Error ending session:', error);
    }
  }, [activeSession, isHost, viewers.length, toast]);

  // Host: Delete a session (only ended sessions)
  const deleteSession = useCallback(async (sessionId: string) => {
    if (!user || !isHost) return false;

    try {
      // First delete viewers
      await supabase
        .from('live_demo_viewers')
        .delete()
        .eq('session_id', sessionId);

      // Then delete the session
      const { error } = await supabase
        .from('live_demo_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('status', 'ended'); // Only allow deleting ended sessions

      if (error) throw error;

      toast({ title: "Session deleted" });
      return true;
    } catch (error) {
      console.error('Error deleting session:', error);
      toast({ title: "Failed to delete session", variant: "destructive" });
      return false;
    }
  }, [user, isHost, toast]);

  // Get past sessions for host
  const [pastSessions, setPastSessions] = useState<LiveDemoSession[]>([]);
  
  const fetchPastSessions = useCallback(async () => {
    if (!isHost) return;
    
    const { data } = await supabase
      .from('live_demo_sessions')
      .select('*')
      .eq('status', 'ended')
      .order('ended_at', { ascending: false })
      .limit(10);
    
    if (data) {
      setPastSessions(data as LiveDemoSession[]);
    }
  }, [isHost]);

  useEffect(() => {
    if (isHost) {
      fetchPastSessions();
    }
  }, [isHost, fetchPastSessions]);

  return {
    activeSession,
    viewers,
    viewerCount: viewers.length,
    isHost,
    loading,
    pastSessions,
    joinSession,
    leaveSession,
    startSession,
    endSession,
    deleteSession,
    fetchPastSessions,
    refresh: checkActiveSession
  };
}
