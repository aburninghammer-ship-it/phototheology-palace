import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * Change Spine: The backbone that guides every user through 4 phases:
 * 1. Orientation – reduce fear & confusion
 * 2. First Win – immediate felt value (save a Gem)
 * 3. Reinforcement – repeat the behavior
 * 4. Commitment – pay + identify as a member
 */

export type ChangePhase = 'orientation' | 'first_win' | 'reinforcement' | 'commitment';

// Date when Change Manager was deployed - users created before this are "existing users"
const CHANGE_MANAGER_LAUNCH_DATE = new Date('2024-12-19T00:00:00Z');

export interface ChangeSpineStatus {
  // Core tracking
  phase: ChangePhase;
  hasCompletedOrientation: boolean;
  hasAchievedFirstWin: boolean;
  firstWinType: string | null;
  
  // Progress metrics
  totalSessionsCompleted: number;
  totalStudiesSaved: number;
  totalGemsSaved: number;
  daysActive: number;
  
  // Guided path
  guidedPathStep: number;
  guidedPathCompleted: boolean;
  
  // Trial status
  trialDaysRemaining: number;
  isPaid: boolean;
  
  // New user detection
  isNewUser: boolean;
  
  // Loading state
  isLoading: boolean;
  
  // Actions
  markOrientationComplete: () => Promise<boolean>;
  advanceGuidedPath: () => Promise<boolean>;
  refreshStatus: () => void;
}

// Guided path steps (the 5 steps to first win)
export const GUIDED_PATH_STEPS = [
  { id: 0, label: 'Enter the Gatehouse', description: 'Begin your journey', path: '/gatehouse' },
  { id: 1, label: 'Read a Passage', description: 'Open the Bible reader', path: '/bible' },
  { id: 2, label: 'Meet Jeeves', description: 'Ask your AI guide a question', path: '/jeeves' },
  { id: 3, label: 'Save Your First Gem', description: 'Create a personal insight', path: '/gems-room' },
  { id: 4, label: 'Explore the Palace', description: 'Unlock full access', path: '/palace' },
];

export const useChangeSpine = (): ChangeSpineStatus => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { subscription, loading: subscriptionLoading } = useSubscription(); // Use subscription hook for reliable paid status

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['change-spine-status', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          created_at,
          has_completed_orientation,
          orientation_completed_at,
          has_achieved_first_win,
          first_win_achieved_at,
          first_win_type,
          total_sessions_completed,
          total_studies_saved,
          total_gems_saved,
          days_active,
          change_phase,
          guided_path_step,
          guided_path_completed_at,
          trial_ends_at,
          subscription_status,
          subscription_tier,
          has_lifetime_access
        `)
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching change spine status:', error);
        return null;
      }

      return profile;
    },
    enabled: !!user,
    staleTime: 30000, // Cache for 30 seconds
  });

  // Calculate trial days remaining
  const calculateTrialDays = useCallback((): number => {
    if (!data?.trial_ends_at) return 0;
    const trialEnd = new Date(data.trial_ends_at);
    const now = new Date();
    const diffTime = trialEnd.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }, [data?.trial_ends_at]);

  // Check if user is paid - now integrates with useSubscription for reliability
  const isPaid = useCallback((): boolean => {
    // First check useSubscription (which includes Stripe direct check fallback)
    if (subscription.hasAccess) return true;
    if (subscription.tier && ['premium', 'essential', 'patron', 'student'].includes(subscription.tier)) return true;
    
    // Also check local profile data as backup
    if (!data) return false;
    if (data.has_lifetime_access) return true;
    if (data.subscription_status === 'active') return true;
    if (data.subscription_tier && ['premium', 'essential', 'patron', 'student'].includes(data.subscription_tier)) return true;
    return false;
  }, [data, subscription]);

  // Check if this is a new user (created after Change Manager launch)
  const isNewUser = useCallback((): boolean => {
    if (!data) return false;
    const profile = data as any;
    if (!profile.created_at) return true; // Assume new if no created_at
    
    const userCreatedAt = new Date(profile.created_at);
    return userCreatedAt >= CHANGE_MANAGER_LAUNCH_DATE;
  }, [data]);

  // Determine current phase based on status
  const determinePhase = useCallback((): ChangePhase => {
    if (!data) return 'orientation';
    
    // Cast to avoid TS issues with new columns
    const profile = data as any;
    
    if (!profile.has_completed_orientation) return 'orientation';
    if (!profile.has_achieved_first_win) return 'first_win';
    
    // Check if they're in reinforcement (have achieved first win but not committed)
    if (!isPaid()) return 'reinforcement';
    
    return 'commitment';
  }, [data, isPaid]);

  // Mark orientation as complete
  const markOrientationComplete = useCallback(async (): Promise<boolean> => {
    if (!user) return false;

    const { error } = await supabase
      .from('profiles')
      .update({
        has_completed_orientation: true,
        orientation_completed_at: new Date().toISOString(),
        change_phase: 'first_win',
        guided_path_step: Math.max(1, (data as any)?.guided_path_step || 0),
      })
      .eq('id', user.id);

    if (!error) {
      queryClient.invalidateQueries({ queryKey: ['change-spine-status'] });
      return true;
    }
    return false;
  }, [user, data, queryClient]);

  // Advance guided path step
  const advanceGuidedPath = useCallback(async (): Promise<boolean> => {
    if (!user) return false;
    
    const currentStep = (data as any)?.guided_path_step || 0;
    const nextStep = Math.min(currentStep + 1, GUIDED_PATH_STEPS.length - 1);
    
    const updates: any = {
      guided_path_step: nextStep,
    };
    
    // Mark complete if on last step
    if (nextStep === GUIDED_PATH_STEPS.length - 1) {
      updates.guided_path_completed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (!error) {
      queryClient.invalidateQueries({ queryKey: ['change-spine-status'] });
      return true;
    }
    return false;
  }, [user, data, queryClient]);

  // Handle case where data is not yet loaded
  const profile = data as any;

  const newUserStatus = isNewUser();

  return {
    phase: determinePhase(),
    hasCompletedOrientation: profile?.has_completed_orientation || false,
    hasAchievedFirstWin: profile?.has_achieved_first_win || false,
    firstWinType: profile?.first_win_type || null,
    
    totalSessionsCompleted: profile?.total_sessions_completed || 0,
    totalStudiesSaved: profile?.total_studies_saved || 0,
    totalGemsSaved: profile?.total_gems_saved || 0,
    daysActive: profile?.days_active || 0,
    
    guidedPathStep: profile?.guided_path_step || 0,
    guidedPathCompleted: !!profile?.guided_path_completed_at,
    
    trialDaysRemaining: calculateTrialDays(),
    isPaid: isPaid(),
    
    isNewUser: newUserStatus,
    
    isLoading: isLoading || subscriptionLoading,
    
    markOrientationComplete,
    advanceGuidedPath,
    refreshStatus: refetch,
  };
};

// Export for decision-making in routing - only applies to new users
export const shouldRedirectToOrientation = (status: ChangeSpineStatus): boolean => {
  if (!status.isNewUser) return false; // Skip for existing users
  return !status.isLoading && !status.hasCompletedOrientation && status.phase === 'orientation';
};

export const shouldShowFirstWinPrompt = (status: ChangeSpineStatus): boolean => {
  if (!status.isNewUser) return false; // Skip for existing users
  return !status.isLoading && status.hasCompletedOrientation && !status.hasAchievedFirstWin;
};

export const shouldEscalateUpgrade = (status: ChangeSpineStatus): boolean => {
  return !status.isLoading && status.trialDaysRemaining <= 3 && !status.isPaid;
};

// Check if guided path should be shown (only for new users who haven't completed first win)
export const shouldShowGuidedPath = (status: ChangeSpineStatus): boolean => {
  if (!status.isNewUser) return false; // Skip for existing users
  return !status.isLoading && !status.hasAchievedFirstWin;
};
