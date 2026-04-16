import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

// Types matching database enums
export type PTUserRole = 'pastor' | 'teacher' | 'lay_member' | 'student' | 'new_believer' | 'scholar' | 'explorer';
export type PTMasteryLevel = 'beginner' | 'intermediate' | 'master';
export type PTStudyBurden = 'prophecy' | 'sanctuary_gospel' | 'study_method' | 'parables_symbols' | 'sermon_building' | 'apologetics' | 'christ_centered' | 'study_habits';

export interface PainPoint {
  point: string;
  type: 'diagnostic' | 'symptomatic';
}

export interface UserStudyProfile {
  id: string;
  user_id: string;
  primary_burdens: PTStudyBurden[];
  user_role: PTUserRole;
  confidence_bible_storyline: number;
  confidence_gospel_basics: number;
  confidence_sanctuary_basics: number;
  confidence_prophecy: number;
  confidence_parables_symbols: number;
  confidence_cross_referencing: number;
  confidence_study_consistency: number;
  pain_points: PainPoint[];
  available_time_minutes: number;
  learning_preference: 'visual' | 'structured_text' | 'audio' | 'interactive';
  current_level: PTMasteryLevel;
  onboarding_completed: boolean;
  onboarding_skipped: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudyTrack {
  id: string;
  name: string;
  description: string;
  burden_alignment: PTStudyBurden[];
  min_confidence_level: number;
  room_focus: string[];
  floor_focus: number[];
}

export interface UserStudyPath {
  id: string;
  user_id: string;
  track_id: string;
  current_session_number: number;
  sessions_completed: number;
  demonstrated_level: PTMasteryLevel;
  level_earned_at: string | null;
  room_completions: Record<string, number>;
  scenario_scores: Array<{ scenario_id: string; score: number; passed: boolean }>;
  integration_tasks_completed: number;
  last_recalibration_requested: string | null;
  recalibration_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  track?: StudyTrack;
}

export interface PTSession {
  id: string;
  path_id: string;
  session_number: number;
  title: string;
  session_type: 'orientation' | 'skill_focus' | 'integration' | 'mastery_check' | 'recalibration';
  primary_room_codes: string[];
  secondary_room_codes: string[];
  floor_numbers: number[];
  content: {
    intro?: string;
    exercises?: Array<{ type: string; instruction: string; content: any }>;
    reflection?: string;
    next_steps?: string[];
  };
  skill_focus: string | null;
  confidence_targets: string[];
  started_at: string | null;
  completed_at: string | null;
  time_spent_minutes: number;
  completion_score: number | null;
  competency_check_passed: boolean | null;
  competency_feedback: string | null;
  created_at: string;
}

// Default fallback profile when onboarding is skipped
const FALLBACK_PROFILE: Partial<UserStudyProfile> = {
  user_role: 'lay_member',
  primary_burdens: ['study_habits'],
  confidence_bible_storyline: 1,
  confidence_gospel_basics: 1,
  confidence_sanctuary_basics: 0,
  confidence_prophecy: 0,
  confidence_parables_symbols: 0,
  confidence_cross_referencing: 0,
  confidence_study_consistency: 0,
  pain_points: [{ point: "I don't know what matters most", type: 'symptomatic' }],
  available_time_minutes: 20,
  learning_preference: 'structured_text',
  current_level: 'beginner',
  onboarding_skipped: true,
};

export const useStudyProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch study profile
  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ['study-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('user_study_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) return null;
      return {
        ...data,
        pain_points: (data.pain_points as unknown as PainPoint[]) || [],
      } as UserStudyProfile;
    },
    enabled: !!user?.id,
  });

  // Fetch study tracks
  const { data: tracks } = useQuery({
    queryKey: ['study-tracks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pt_study_tracks')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as StudyTrack[];
    },
  });

  // Fetch active study path
  const { data: activePath, isLoading: pathLoading } = useQuery({
    queryKey: ['active-study-path', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('user_study_paths')
        .select(`
          *,
          track:pt_study_tracks(*)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) return null;
      return {
        ...data,
        room_completions: (data.room_completions as unknown as Record<string, number>) || {},
        scenario_scores: (data.scenario_scores as unknown as Array<{ scenario_id: string; score: number; passed: boolean }>) || [],
      } as UserStudyPath;
    },
    enabled: !!user?.id,
  });

  // Fetch sessions for active path
  const { data: sessions } = useQuery({
    queryKey: ['path-sessions', activePath?.id],
    queryFn: async () => {
      if (!activePath?.id) return [];
      
      const { data, error } = await supabase
        .from('pt_sessions')
        .select('*')
        .eq('path_id', activePath.id)
        .order('session_number');
      
      if (error) throw error;
      return data as PTSession[];
    },
    enabled: !!activePath?.id,
  });

  // Create or update study profile
  const saveProfile = useMutation({
    mutationFn: async (profileData: Partial<UserStudyProfile>) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data: existing } = await supabase
        .from('user_study_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        const updateData = {
          ...profileData,
          pain_points: profileData.pain_points as unknown as any,
          updated_at: new Date().toISOString(),
        };
        const { data, error } = await supabase
          .from('user_study_profiles')
          .update(updateData)
          .eq('user_id', user.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        const insertData = {
          user_id: user.id,
          ...profileData,
          pain_points: profileData.pain_points as unknown as any,
        };
        const { data, error } = await supabase
          .from('user_study_profiles')
          .insert(insertData)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-profile'] });
    },
    onError: (error) => {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    },
  });

  // Skip onboarding with fallback profile
  const skipOnboarding = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      return saveProfile.mutateAsync(FALLBACK_PROFILE);
    },
  });

  // Create study path after onboarding
  const createStudyPath = useMutation({
    mutationFn: async (trackId: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Deactivate any existing active paths
      await supabase
        .from('user_study_paths')
        .update({ is_active: false })
        .eq('user_id', user.id)
        .eq('is_active', true);

      const { data, error } = await supabase
        .from('user_study_paths')
        .insert({
          user_id: user.id,
          track_id: trackId,
          is_active: true,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-study-path'] });
    },
  });

  // Generate initial sessions via AI
  const generateSessions = useMutation({
    mutationFn: async (pathId: string) => {
      const { data, error } = await supabase.functions.invoke('generate-pt-sessions', {
        body: { 
          pathId,
          count: 3, // First 3 sessions
        },
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['path-sessions'] });
      toast.success('Your personalized sessions are ready!');
    },
    onError: (error) => {
      console.error('Error generating sessions:', error);
      toast.error('Failed to generate sessions');
    },
  });

  // Complete a session
  const completeSession = useMutation({
    mutationFn: async ({ sessionId, score }: { sessionId: string; score: number }) => {
      const { data, error } = await supabase
        .from('pt_sessions')
        .update({
          completed_at: new Date().toISOString(),
          completion_score: score,
        })
        .eq('id', sessionId)
        .select()
        .single();
      
      if (error) throw error;

      // Update path progress
      if (activePath) {
        await supabase
          .from('user_study_paths')
          .update({
            sessions_completed: activePath.sessions_completed + 1,
            current_session_number: activePath.current_session_number + 1,
          })
          .eq('id', activePath.id);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['path-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['active-study-path'] });
    },
  });

  // Determine if user needs onboarding
  const needsOnboarding = !profile || (!profile.onboarding_completed && !profile.onboarding_skipped);
  
  // Get recommended track based on profile
  const getRecommendedTrack = (): StudyTrack | undefined => {
    if (!profile || !tracks) return undefined;
    
    const primaryBurden = profile.primary_burdens[0];
    return tracks.find(t => t.burden_alignment.includes(primaryBurden));
  };

  // Calculate average confidence
  const getAverageConfidence = (): number => {
    if (!profile) return 0;
    const total = 
      profile.confidence_bible_storyline +
      profile.confidence_gospel_basics +
      profile.confidence_sanctuary_basics +
      profile.confidence_prophecy +
      profile.confidence_parables_symbols +
      profile.confidence_cross_referencing +
      profile.confidence_study_consistency;
    return Math.round((total / 7) * 100) / 100;
  };

  // Get current session
  const getCurrentSession = (): PTSession | undefined => {
    if (!sessions || !activePath) return undefined;
    return sessions.find(s => s.session_number === activePath.current_session_number);
  };

  return {
    // Data
    profile,
    tracks,
    activePath,
    sessions,
    
    // Loading states
    isLoading: profileLoading || pathLoading,
    error: profileError,
    
    // Computed
    needsOnboarding,
    recommendedTrack: getRecommendedTrack(),
    averageConfidence: getAverageConfidence(),
    currentSession: getCurrentSession(),
    
    // Mutations
    saveProfile: saveProfile.mutate,
    skipOnboarding: skipOnboarding.mutate,
    createStudyPath: createStudyPath.mutate,
    generateSessions: generateSessions.mutate,
    completeSession: completeSession.mutate,
    
    // Loading states for mutations
    isSaving: saveProfile.isPending,
    isCreatingPath: createStudyPath.isPending,
    isGeneratingSessions: generateSessions.isPending,
  };
};
