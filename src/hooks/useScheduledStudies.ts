// Scheduled Studies Hook
// Manage scheduled group studies and RSVPs

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import type {
  ScheduledStudy,
  StudyRSVP,
  CreateScheduledStudyInput,
  generateStudyRoomCode,
} from '@/types/groupStudy';

// Type cast for tables not yet in generated types
const db = supabase as any;

interface UseScheduledStudiesReturn {
  scheduledStudies: ScheduledStudy[];
  isLoading: boolean;
  error: string | null;
  createScheduledStudy: (data: CreateScheduledStudyInput) => Promise<string | null>;
  updateRSVP: (studyId: string, status: 'going' | 'maybe' | 'not_going') => Promise<boolean>;
  removeRSVP: (studyId: string) => Promise<boolean>;
  cancelScheduledStudy: (studyId: string) => Promise<boolean>;
  startScheduledStudy: (studyId: string) => Promise<{ sessionId: string; roomCode: string } | null>;
  getStudyRSVPs: (studyId: string) => Promise<StudyRSVP[]>;
  refreshStudies: () => void;
}

export function useScheduledStudies(): UseScheduledStudiesReturn {
  const { user } = useAuth();
  const [scheduledStudies, setScheduledStudies] = useState<ScheduledStudy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all upcoming scheduled studies
  const fetchStudies = useCallback(async () => {
    if (!user) {
      setScheduledStudies([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Get scheduled studies that haven't passed
      const { data: studies, error: studiesError } = await db
        .from('scheduled_studies')
        .select('*')
        .gte('scheduled_at', new Date().toISOString())
        .in('status', ['scheduled'])
        .order('scheduled_at', { ascending: true });

      if (studiesError) throw studiesError;

      // Get RSVP counts and user's RSVP status
      const enrichedStudies: ScheduledStudy[] = await Promise.all(
        (studies || []).map(async (study: any) => {
          // Get RSVP count
          const { count } = await db
            .from('study_rsvps')
            .select('*', { count: 'exact', head: true })
            .eq('scheduled_study_id', study.id)
            .eq('status', 'going');

          // Get user's RSVP
          const { data: myRsvp } = await db
            .from('study_rsvps')
            .select('status')
            .eq('scheduled_study_id', study.id)
            .eq('user_id', user.id)
            .single();

          return {
            id: study.id,
            groupId: study.group_id,
            hostUserId: study.host_user_id,
            hostName: study.host_name,
            title: study.title,
            description: study.description,
            scheduledAt: study.scheduled_at,
            contentType: study.content_type,
            contentReference: study.content_reference,
            contentText: study.content_text,
            maxParticipants: study.max_participants,
            status: study.status,
            roomCode: study.room_code,
            rsvpCount: count || 0,
            myRsvp: myRsvp?.status || null,
            startedAt: study.started_at,
            endedAt: study.ended_at,
            createdAt: study.created_at,
          } as ScheduledStudy;
        })
      );

      setScheduledStudies(enrichedStudies);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching scheduled studies:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Initial fetch
  useEffect(() => {
    fetchStudies();
  }, [fetchStudies]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('scheduled-studies-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'scheduled_studies' },
        () => fetchStudies()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'study_rsvps' },
        () => fetchStudies()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchStudies]);

  // Create a scheduled study
  const createScheduledStudy = useCallback(async (data: CreateScheduledStudyInput): Promise<string | null> => {
    if (!user) {
      toast.error('Please sign in to schedule a study');
      return null;
    }

    try {
      const hostName = user.email?.split('@')[0] || 'Leader';

      const { data: study, error } = await db
        .from('scheduled_studies')
        .insert({
          group_id: data.groupId || null,
          host_user_id: user.id,
          host_name: hostName,
          title: data.title,
          description: data.description || null,
          scheduled_at: data.scheduledAt.toISOString(),
          content_type: data.contentType,
          content_reference: data.contentReference,
          content_text: data.contentText || null,
          max_participants: data.maxParticipants || 30,
        })
        .select()
        .single();

      if (error) throw error;

      // Auto-RSVP the host as going
      await db
        .from('study_rsvps')
        .insert({
          scheduled_study_id: study.id,
          user_id: user.id,
          user_name: hostName,
          status: 'going',
        });

      toast.success('Study scheduled!');
      return study.id;
    } catch (err: any) {
      console.error('Error creating scheduled study:', err);
      toast.error('Failed to schedule study');
      return null;
    }
  }, [user]);

  // Update RSVP status
  const updateRSVP = useCallback(async (studyId: string, status: 'going' | 'maybe' | 'not_going'): Promise<boolean> => {
    if (!user) {
      toast.error('Please sign in to RSVP');
      return false;
    }

    try {
      const userName = user.email?.split('@')[0] || 'Participant';

      const { error } = await db
        .from('study_rsvps')
        .upsert({
          scheduled_study_id: studyId,
          user_id: user.id,
          user_name: userName,
          status,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'scheduled_study_id,user_id',
        });

      if (error) throw error;

      const statusText = status === 'going' ? "You're in!" : status === 'maybe' ? 'Marked as maybe' : 'Marked as not going';
      toast.success(statusText);
      return true;
    } catch (err: any) {
      console.error('Error updating RSVP:', err);
      toast.error('Failed to update RSVP');
      return false;
    }
  }, [user]);

  // Remove RSVP
  const removeRSVP = useCallback(async (studyId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await db
        .from('study_rsvps')
        .delete()
        .eq('scheduled_study_id', studyId)
        .eq('user_id', user.id);

      if (error) throw error;
      toast.success('RSVP removed');
      return true;
    } catch (err: any) {
      console.error('Error removing RSVP:', err);
      toast.error('Failed to remove RSVP');
      return false;
    }
  }, [user]);

  // Cancel a scheduled study (host only)
  const cancelScheduledStudy = useCallback(async (studyId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await db
        .from('scheduled_studies')
        .update({ status: 'cancelled' })
        .eq('id', studyId)
        .eq('host_user_id', user.id);

      if (error) throw error;
      toast.success('Study cancelled');
      return true;
    } catch (err: any) {
      console.error('Error cancelling study:', err);
      toast.error('Failed to cancel study');
      return false;
    }
  }, [user]);

  // Start a scheduled study (host only) - creates the actual session
  const startScheduledStudy = useCallback(async (
    studyId: string
  ): Promise<{ sessionId: string; roomCode: string } | null> => {
    if (!user) return null;

    try {
      // Get the scheduled study
      const { data: study, error: studyError } = await db
        .from('scheduled_studies')
        .select('*')
        .eq('id', studyId)
        .eq('host_user_id', user.id)
        .single();

      if (studyError || !study) {
        toast.error('Study not found or you are not the host');
        return null;
      }

      // Generate room code
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let roomCode = '';
      for (let i = 0; i < 6; i++) {
        roomCode += chars[Math.floor(Math.random() * chars.length)];
      }

      // Create the live session
      const { data: session, error: sessionError } = await db
        .from('group_study_sessions')
        .insert({
          scheduled_study_id: studyId,
          room_code: roomCode,
          host_id: user.id,
          content_type: study.content_type,
          content_reference: study.content_reference,
          content_text: study.content_text,
          current_phase: 'gathering',
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Update the scheduled study with room code and status
      await db
        .from('scheduled_studies')
        .update({
          status: 'active',
          room_code: roomCode,
          started_at: new Date().toISOString(),
        })
        .eq('id', studyId);

      // Add host as first participant
      const hostName = user.email?.split('@')[0] || 'Host';
      await db
        .from('study_session_participants')
        .insert({
          session_id: session.id,
          user_id: user.id,
          display_name: hostName,
          score: 0,
        });

      toast.success('Study started!');
      return { sessionId: session.id, roomCode };
    } catch (err: any) {
      console.error('Error starting study:', err);
      toast.error('Failed to start study');
      return null;
    }
  }, [user]);

  // Get RSVPs for a specific study
  const getStudyRSVPs = useCallback(async (studyId: string): Promise<StudyRSVP[]> => {
    try {
      const { data, error } = await db
        .from('study_rsvps')
        .select('*')
        .eq('scheduled_study_id', studyId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return (data || []).map((rsvp: any) => ({
        id: rsvp.id,
        scheduledStudyId: rsvp.scheduled_study_id,
        userId: rsvp.user_id,
        userName: rsvp.user_name,
        status: rsvp.status,
        prayerRequest: rsvp.prayer_request,
        createdAt: rsvp.created_at,
        updatedAt: rsvp.updated_at,
      })) as StudyRSVP[];
    } catch (err: any) {
      console.error('Error fetching RSVPs:', err);
      return [];
    }
  }, []);

  return {
    scheduledStudies,
    isLoading,
    error,
    createScheduledStudy,
    updateRSVP,
    removeRSVP,
    cancelScheduledStudy,
    startScheduledStudy,
    getStudyRSVPs,
    refreshStudies: fetchStudies,
  };
}
