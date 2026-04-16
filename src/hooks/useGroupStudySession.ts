// Group Study Session Hook
// Real-time multiplayer Bible study with insights, voting, and chat

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type {
  StudySession,
  StudyParticipant,
  StudyInsight,
  ChatMessage,
  StudyPhase,
  CreateInsightInput,
  calculateInsightPoints,
  getNextPhase,
  STUDY_SCORING,
} from '@/types/groupStudy';

// Type cast for tables not yet in generated types
const db = supabase as any;

interface UseGroupStudySessionReturn {
  session: StudySession | null;
  participants: StudyParticipant[];
  myParticipant: StudyParticipant | null;
  insights: StudyInsight[];
  chatMessages: ChatMessage[];
  isLoading: boolean;
  error: string | null;

  // Actions
  createSession: (contentReference: string, contentText?: string) => Promise<string | null>;
  joinSession: (roomCode: string) => Promise<boolean>;
  leaveSession: () => Promise<void>;
  shareInsight: (input: CreateInsightInput) => Promise<boolean>;
  voteOnInsight: (insightId: string, vote: 1 | -1) => Promise<boolean>;
  removeVote: (insightId: string) => Promise<boolean>;
  sendChat: (message: string, messageType?: 'chat' | 'prayer' | 'announcement', replyToId?: string) => Promise<boolean>;
  advancePhase: () => Promise<boolean>;
  endSession: () => Promise<boolean>;

  // Host helpers
  isHost: boolean;
  refreshSession: () => void;
}

export function useGroupStudySession(sessionId?: string): UseGroupStudySessionReturn {
  const { user } = useAuth();
  const [session, setSession] = useState<StudySession | null>(null);
  const [participants, setParticipants] = useState<StudyParticipant[]>([]);
  const [insights, setInsights] = useState<StudyInsight[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [myParticipantId, setMyParticipantId] = useState<string | null>(null);

  // Derive myParticipant and isHost
  const myParticipant = participants.find(p => p.id === myParticipantId) || null;
  const isHost = session?.hostId === user?.id;

  // Load session if sessionId provided
  useEffect(() => {
    if (sessionId) {
      loadSession(sessionId);
    }
  }, [sessionId]);

  // Subscribe to realtime updates when session exists
  useEffect(() => {
    if (!session?.id) return;

    const channel = supabase
      .channel(`group-study-${session.id}`)
      // Session state changes
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'group_study_sessions', filter: `id=eq.${session.id}` },
        (payload) => {
          if (payload.eventType === 'UPDATE' && payload.new) {
            const updated = payload.new as any;
            setSession(prev => prev ? {
              ...prev,
              currentPhase: updated.current_phase,
              phaseEndsAt: updated.phase_ends_at,
              totalInsights: updated.total_insights,
              totalVotes: updated.total_votes,
              endedAt: updated.ended_at,
            } : null);
          }
        }
      )
      // Participant changes
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'study_session_participants', filter: `session_id=eq.${session.id}` },
        () => loadParticipants(session.id)
      )
      // New insights
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'study_insights', filter: `session_id=eq.${session.id}` },
        () => loadInsights(session.id)
      )
      // Vote changes
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'insight_votes' },
        () => loadInsights(session.id)
      )
      // Chat messages
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'study_session_chat', filter: `session_id=eq.${session.id}` },
        (payload) => {
          if (payload.new) {
            const msg = payload.new as any;
            const newMessage: ChatMessage = {
              id: msg.id,
              sessionId: msg.session_id,
              userId: msg.user_id,
              userName: msg.user_name,
              message: msg.message,
              messageType: msg.message_type,
              replyToId: msg.reply_to_id,
              createdAt: msg.created_at,
            };
            setChatMessages(prev => [...prev, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.id]);

  // Load session data
  const loadSession = async (id: string) => {
    try {
      setIsLoading(true);

      const { data, error: fetchError } = await db
        .from('group_study_sessions')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      if (!data) throw new Error('Session not found');

      setSession({
        id: data.id,
        scheduledStudyId: data.scheduled_study_id,
        roomCode: data.room_code,
        hostId: data.host_id,
        contentType: data.content_type,
        contentReference: data.content_reference,
        contentText: data.content_text,
        currentPhase: data.current_phase,
        phaseEndsAt: data.phase_ends_at,
        totalInsights: data.total_insights || 0,
        totalVotes: data.total_votes || 0,
        startedAt: data.started_at,
        endedAt: data.ended_at,
      });

      await Promise.all([
        loadParticipants(id),
        loadInsights(id),
        loadChatMessages(id),
      ]);
    } catch (err: any) {
      console.error('Error loading session:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Load participants
  const loadParticipants = async (sessionId: string) => {
    try {
      const { data, error: fetchError } = await db
        .from('study_session_participants')
        .select('*')
        .eq('session_id', sessionId)
        .order('score', { ascending: false });

      if (fetchError) throw fetchError;

      const mapped: StudyParticipant[] = (data || []).map((p: any) => ({
        id: p.id,
        sessionId: p.session_id,
        userId: p.user_id,
        displayName: p.display_name,
        avatarUrl: p.avatar_url,
        score: p.score || 0,
        insightsShared: p.insights_shared || 0,
        votesCast: p.votes_cast || 0,
        isConnected: p.is_connected,
        joinedAt: p.joined_at,
        lastSeenAt: p.last_seen_at,
      }));

      setParticipants(mapped);

      // Find my participant
      if (user) {
        const me = mapped.find(p => p.userId === user.id);
        if (me) setMyParticipantId(me.id);
      }
    } catch (err: any) {
      console.error('Error loading participants:', err);
    }
  };

  // Load insights with vote status
  const loadInsights = async (sessionId: string) => {
    try {
      const { data, error: fetchError } = await db
        .from('study_insights')
        .select(`
          *,
          participant:study_session_participants!participant_id(display_name, avatar_url)
        `)
        .eq('session_id', sessionId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Get my votes if logged in
      let myVotes: Record<string, number> = {};
      if (user) {
        const { data: voteData } = await db
          .from('insight_votes')
          .select('insight_id, vote')
          .eq('user_id', user.id);

        if (voteData) {
          myVotes = voteData.reduce((acc: Record<string, number>, v: any) => {
            acc[v.insight_id] = v.vote;
            return acc;
          }, {});
        }
      }

      const mapped: StudyInsight[] = (data || []).map((i: any) => ({
        id: i.id,
        sessionId: i.session_id,
        participantId: i.participant_id,
        userId: i.user_id,
        participantName: i.participant?.display_name,
        participantAvatar: i.participant?.avatar_url,
        insightText: i.insight_text,
        verseReference: i.verse_reference,
        ptPrinciple: i.pt_principle,
        crossReferences: i.cross_references || [],
        isChristConnection: i.is_christ_connection,
        basePoints: i.base_points,
        bonusPoints: i.bonus_points,
        totalPoints: i.total_points,
        votesUp: i.votes_up || 0,
        votesDown: i.votes_down || 0,
        voteScore: i.vote_score || 0,
        myVote: myVotes[i.id] as 1 | -1 | undefined || null,
        status: i.status,
        createdAt: i.created_at,
      }));

      setInsights(mapped);
    } catch (err: any) {
      console.error('Error loading insights:', err);
    }
  };

  // Load chat messages
  const loadChatMessages = async (sessionId: string) => {
    try {
      const { data, error: fetchError } = await db
        .from('study_session_chat')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      const mapped: ChatMessage[] = (data || []).map((m: any) => ({
        id: m.id,
        sessionId: m.session_id,
        userId: m.user_id,
        userName: m.user_name,
        message: m.message,
        messageType: m.message_type,
        replyToId: m.reply_to_id,
        createdAt: m.created_at,
      }));

      setChatMessages(mapped);
    } catch (err: any) {
      console.error('Error loading chat:', err);
    }
  };

  // Create a new session (returns session ID on success)
  const createSession = useCallback(async (contentReference: string, contentText?: string): Promise<string | null> => {
    if (!user) {
      toast.error('Please sign in to create a session');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { generateStudyRoomCode } = await import('@/types/groupStudy');
      const roomCode = generateStudyRoomCode();

      // Get display name
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('id', user.id)
        .single();

      const displayName = profile?.display_name || user.email?.split('@')[0] || 'Host';

      // Create the session
      const { data: sessionData, error: sessionError } = await db
        .from('group_study_sessions')
        .insert({
          room_code: roomCode,
          host_id: user.id,
          content_type: 'passage',
          content_reference: contentReference,
          content_text: contentText || null,
          current_phase: 'gathering',
          status: 'active',
          total_insights: 0,
          total_votes: 0,
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Auto-add creator as participant
      const { data: participantData, error: participantError } = await db
        .from('study_session_participants')
        .insert({
          session_id: sessionData.id,
          user_id: user.id,
          display_name: displayName,
          avatar_url: profile?.avatar_url,
          score: 0,
          insights_shared: 0,
          votes_cast: 0,
          is_connected: true,
        })
        .select()
        .single();

      if (participantError) throw participantError;

      setMyParticipantId(participantData.id);
      await loadSession(sessionData.id);
      toast.success(`Session created! Code: ${roomCode}`);
      return sessionData.id;
    } catch (err: any) {
      console.error('Error creating session:', err);
      setError(err.message);
      toast.error('Failed to create session');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Join a session by room code
  const joinSession = useCallback(async (roomCode: string): Promise<boolean> => {
    if (!user) {
      toast.error('Please sign in to join');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Find session by room code
      const { data: sessionData, error: sessionError } = await db
        .from('group_study_sessions')
        .select('*')
        .eq('room_code', roomCode.toUpperCase())
        .is('ended_at', null)
        .single();

      if (sessionError || !sessionData) {
        toast.error('Session not found or has ended');
        return false;
      }

      // Check if already a participant
      const { data: existingParticipant } = await db
        .from('study_session_participants')
        .select('id')
        .eq('session_id', sessionData.id)
        .eq('user_id', user.id)
        .single();

      if (existingParticipant) {
        // Already in session, just load it
        setMyParticipantId(existingParticipant.id);
        await loadSession(sessionData.id);
        toast.success('Rejoined session!');
        return true;
      }

      // Get display name
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('id', user.id)
        .single();

      const displayName = profile?.display_name || user.email?.split('@')[0] || 'Participant';

      // Join as new participant
      const { data: participantData, error: participantError } = await db
        .from('study_session_participants')
        .insert({
          session_id: sessionData.id,
          user_id: user.id,
          display_name: displayName,
          avatar_url: profile?.avatar_url,
          score: 0,
          insights_shared: 0,
          votes_cast: 0,
        })
        .select()
        .single();

      if (participantError) throw participantError;

      setMyParticipantId(participantData.id);
      await loadSession(sessionData.id);
      toast.success('Joined session!');
      return true;
    } catch (err: any) {
      console.error('Error joining session:', err);
      setError(err.message);
      toast.error('Failed to join session');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Leave session
  const leaveSession = useCallback(async (): Promise<void> => {
    if (myParticipant && session) {
      try {
        // Mark as disconnected rather than deleting
        await db
          .from('study_session_participants')
          .update({ is_connected: false })
          .eq('id', myParticipant.id);
      } catch (err) {
        console.error('Error leaving session:', err);
      }
    }

    setSession(null);
    setParticipants([]);
    setInsights([]);
    setChatMessages([]);
    setMyParticipantId(null);
  }, [myParticipant, session]);

  // Share an insight
  const shareInsight = useCallback(async (input: CreateInsightInput): Promise<boolean> => {
    if (!session || !myParticipant || !user) {
      toast.error('Not in a session');
      return false;
    }

    if (session.currentPhase !== 'sharing') {
      toast.error('Insights can only be shared during the sharing phase');
      return false;
    }

    if (!input.insightText.trim()) {
      toast.error('Please enter your insight');
      return false;
    }

    setIsLoading(true);

    try {
      // Import scoring function dynamically to avoid circular deps
      const { calculateInsightPoints, STUDY_SCORING } = await import('@/types/groupStudy');

      // Calculate points
      const crossRefCount = input.crossReferences?.length || 0;
      const { basePoints, bonusPoints, totalPoints } = calculateInsightPoints(
        input.isChristConnection || false,
        !!input.ptPrinciple,
        crossRefCount
      );

      // Create the insight
      const { error: insertError } = await db
        .from('study_insights')
        .insert({
          session_id: session.id,
          participant_id: myParticipant.id,
          user_id: user.id,
          insight_text: input.insightText.trim(),
          verse_reference: input.verseReference || null,
          pt_principle: input.ptPrinciple || null,
          cross_references: input.crossReferences || [],
          is_christ_connection: input.isChristConnection || false,
          base_points: basePoints,
          bonus_points: bonusPoints,
          total_points: totalPoints,
        });

      if (insertError) throw insertError;

      // Update participant stats
      await db
        .from('study_session_participants')
        .update({
          score: myParticipant.score + totalPoints,
          insights_shared: myParticipant.insightsShared + 1,
        })
        .eq('id', myParticipant.id);

      // Update session stats
      await db
        .from('group_study_sessions')
        .update({
          total_insights: session.totalInsights + 1,
        })
        .eq('id', session.id);

      toast.success(`Insight shared! +${totalPoints} points`);
      return true;
    } catch (err: any) {
      console.error('Error sharing insight:', err);
      toast.error('Failed to share insight');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [session, myParticipant, user]);

  // Vote on an insight
  const voteOnInsight = useCallback(async (insightId: string, vote: 1 | -1): Promise<boolean> => {
    if (!user || !myParticipant || !session) {
      toast.error('Not in a session');
      return false;
    }

    if (session.currentPhase !== 'sharing') {
      toast.error('Voting is only allowed during the sharing phase');
      return false;
    }

    // Can't vote on your own insight
    const insight = insights.find(i => i.id === insightId);
    if (insight?.userId === user.id) {
      toast.error("You can't vote on your own insight");
      return false;
    }

    try {
      // Check existing vote
      const { data: existingVote } = await db
        .from('insight_votes')
        .select('id, vote')
        .eq('insight_id', insightId)
        .eq('user_id', user.id)
        .single();

      if (existingVote) {
        if (existingVote.vote === vote) {
          // Same vote, just return
          return true;
        }
        // Update existing vote
        await db
          .from('insight_votes')
          .update({ vote })
          .eq('id', existingVote.id);
      } else {
        // Create new vote
        await db
          .from('insight_votes')
          .insert({
            insight_id: insightId,
            user_id: user.id,
            vote,
          });

        // Update participant's votes cast (only for new votes)
        await db
          .from('study_session_participants')
          .update({
            votes_cast: myParticipant.votesCast + 1,
          })
          .eq('id', myParticipant.id);
      }

      // Recalculate insight vote counts
      const { data: voteCounts } = await db
        .from('insight_votes')
        .select('vote')
        .eq('insight_id', insightId);

      const upVotes = (voteCounts || []).filter((v: any) => v.vote === 1).length;
      const downVotes = (voteCounts || []).filter((v: any) => v.vote === -1).length;

      await db
        .from('study_insights')
        .update({
          votes_up: upVotes,
          votes_down: downVotes,
          vote_score: upVotes - downVotes,
        })
        .eq('id', insightId);

      // Update session total votes
      await db
        .from('group_study_sessions')
        .update({
          total_votes: session.totalVotes + 1,
        })
        .eq('id', session.id);

      return true;
    } catch (err: any) {
      console.error('Error voting:', err);
      toast.error('Failed to vote');
      return false;
    }
  }, [user, myParticipant, session, insights]);

  // Remove vote
  const removeVote = useCallback(async (insightId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      await db
        .from('insight_votes')
        .delete()
        .eq('insight_id', insightId)
        .eq('user_id', user.id);

      // Recalculate insight vote counts
      const { data: voteCounts } = await db
        .from('insight_votes')
        .select('vote')
        .eq('insight_id', insightId);

      const upVotes = (voteCounts || []).filter((v: any) => v.vote === 1).length;
      const downVotes = (voteCounts || []).filter((v: any) => v.vote === -1).length;

      await db
        .from('study_insights')
        .update({
          votes_up: upVotes,
          votes_down: downVotes,
          vote_score: upVotes - downVotes,
        })
        .eq('id', insightId);

      return true;
    } catch (err: any) {
      console.error('Error removing vote:', err);
      return false;
    }
  }, [user]);

  // Send chat message
  const sendChat = useCallback(async (
    message: string,
    messageType: 'chat' | 'prayer' | 'announcement' = 'chat',
    replyToId?: string
  ): Promise<boolean> => {
    if (!session || !user) {
      toast.error('Not in a session');
      return false;
    }

    if (!message.trim()) return false;

    try {
      const displayName = myParticipant?.displayName || user.email?.split('@')[0] || 'Anonymous';

      await db
        .from('study_session_chat')
        .insert({
          session_id: session.id,
          user_id: user.id,
          user_name: displayName,
          message: message.trim(),
          message_type: messageType,
          reply_to_id: replyToId || null,
        });

      return true;
    } catch (err: any) {
      console.error('Error sending chat:', err);
      toast.error('Failed to send message');
      return false;
    }
  }, [session, user, myParticipant]);

  // Advance to next phase (host only)
  const advancePhase = useCallback(async (): Promise<boolean> => {
    if (!session || !isHost) {
      toast.error('Only the host can advance phases');
      return false;
    }

    try {
      const { getNextPhase, STUDY_PHASES } = await import('@/types/groupStudy');
      const nextPhase = getNextPhase(session.currentPhase);

      if (!nextPhase) {
        toast.error('Already at final phase');
        return false;
      }

      // Get phase config for timer
      const phaseConfig = STUDY_PHASES.find(p => p.name === nextPhase);
      const phaseEndsAt = phaseConfig?.defaultDuration
        ? new Date(Date.now() + phaseConfig.defaultDuration * 1000).toISOString()
        : null;

      await db
        .from('group_study_sessions')
        .update({
          current_phase: nextPhase,
          phase_ends_at: phaseEndsAt,
        })
        .eq('id', session.id);

      // Announce phase change
      await db
        .from('study_session_chat')
        .insert({
          session_id: session.id,
          user_id: user!.id,
          user_name: 'System',
          message: `Phase changed to: ${phaseConfig?.label || nextPhase}`,
          message_type: 'announcement',
        });

      toast.success(`Advanced to ${phaseConfig?.label || nextPhase}`);
      return true;
    } catch (err: any) {
      console.error('Error advancing phase:', err);
      toast.error('Failed to advance phase');
      return false;
    }
  }, [session, isHost, user]);

  // End session (host only)
  const endSession = useCallback(async (): Promise<boolean> => {
    if (!session || !isHost) {
      toast.error('Only the host can end the session');
      return false;
    }

    try {
      await db
        .from('group_study_sessions')
        .update({
          ended_at: new Date().toISOString(),
        })
        .eq('id', session.id);

      // Also update the scheduled study if linked
      if (session.scheduledStudyId) {
        await db
          .from('scheduled_studies')
          .update({
            status: 'completed',
            ended_at: new Date().toISOString(),
          })
          .eq('id', session.scheduledStudyId);
      }

      toast.success('Session ended');
      return true;
    } catch (err: any) {
      console.error('Error ending session:', err);
      toast.error('Failed to end session');
      return false;
    }
  }, [session, isHost]);

  // Refresh session data
  const refreshSession = useCallback(() => {
    if (session?.id) {
      loadSession(session.id);
    }
  }, [session?.id]);

  return {
    session,
    participants,
    myParticipant,
    insights,
    chatMessages,
    isLoading,
    error,

    createSession,
    joinSession,
    leaveSession,
    shareInsight,
    voteOnInsight,
    removeVote,
    sendChat,
    advancePhase,
    endSession,

    isHost,
    refreshSession,
  };
}
