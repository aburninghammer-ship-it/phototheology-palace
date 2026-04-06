import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useChurchMembership } from '@/hooks/useChurchMembership';
import { useChangeSpine, shouldRedirectToOrientation, shouldEscalateUpgrade } from '@/hooks/useChangeSpine';

interface ChangeManagerProviderProps {
  children: React.ReactNode;
}

// Routes that don't require change management enforcement
const EXEMPT_ROUTES = [
  '/auth',
  '/login',
  '/signup',
  '/reset-password',
  '/join-church',
  '/pricing',
  '/demo',
  '/about',
  '/privacy',
  '/terms',
  '/welcome',
  '/pt-onboarding',
  '/fix-billing',
];

// Routes that ARE part of the guided path (allowed even before orientation complete)
const GUIDED_PATH_ROUTES = [
  '/gatehouse',
  '/bible',
  '/jeeves',
  '/give-me-a-gem',
  '/palace',
];

/**
 * ChangeManagerProvider: 
 * This component enforces the Change Spine phases through routing.
 * It gently guides users through the required sequence without feeling restrictive.
 */
export const ChangeManagerProvider = ({ children }: ChangeManagerProviderProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const changeSpine = useChangeSpine();
  const { isMember: isChurchMember } = useChurchMembership();

  useEffect(() => {
    // Skip if loading or no user
    if (changeSpine.isLoading || !user) return;

    // Skip all change management for church members
    if (isChurchMember) return;

    // Skip all change management for existing users
    if (!changeSpine.isNewUser) return;

    const currentPath = location.pathname;
    
    // Check if current route is exempt
    const isExempt = EXEMPT_ROUTES.some(route => currentPath.startsWith(route));
    if (isExempt) return;

    // Check if on guided path route
    const isGuidedPathRoute = GUIDED_PATH_ROUTES.some(route => currentPath.startsWith(route));

    // Phase 1: Orientation - redirect to gatehouse if not complete
    if (shouldRedirectToOrientation(changeSpine)) {
      // Allow guided path routes, but not other advanced features
      if (!isGuidedPathRoute && currentPath !== '/') {
        // Soft redirect - let them explore but show gatehouse first on next visit
        return;
      }
    }

    // Track when user visits key pages for guided path advancement
    if (isGuidedPathRoute) {
      // This could be enhanced to auto-advance steps based on page visits
      // For now, we'll let the explicit actions handle it
    }

    // Escalate upgrade prompts if trial ending (handled by other components)
    if (shouldEscalateUpgrade(changeSpine)) {
      // This triggers increased visibility of upgrade prompts
      // Actual UI is handled by UpgradePrompt component
    }

  }, [changeSpine, user, location.pathname, navigate]);

  return <>{children}</>;
};

/**
 * Hook to use change management decisions in components
 */
export const useChangeManager = () => {
  const changeSpine = useChangeSpine();
  const { isMember: isChurchMember } = useChurchMembership();

  return {
    ...changeSpine,
    
    // Convenience methods for components - never apply to church members
    shouldShowGuidedPath: !isChurchMember && changeSpine.isNewUser && !changeSpine.hasAchievedFirstWin && !changeSpine.isLoading,
    shouldPromptFirstWin: !isChurchMember && changeSpine.isNewUser && changeSpine.hasCompletedOrientation && !changeSpine.hasAchievedFirstWin,
    shouldEscalateUpgrade: !isChurchMember && shouldEscalateUpgrade(changeSpine),
    
    // Get identity messaging
    getIdentityMessage: () => {
      if (changeSpine.phase === 'orientation') return "Welcome, Seeker";
      if (changeSpine.phase === 'first_win') return "Builder in Training";
      if (changeSpine.phase === 'reinforcement') return "Rising Architect";
      if (changeSpine.phase === 'commitment') return "Sanctuary Architect";
      return "Seeker";
    },
    
    // Get encouragement message based on phase
    getEncouragement: () => {
      const { trialDaysRemaining, phase, totalGemsSaved } = changeSpine;
      
      if (phase === 'orientation') {
        return "Your first study takes just 7 minutes";
      }
      if (phase === 'first_win') {
        return "Save your first Gem to unlock the breakthrough";
      }
      if (phase === 'reinforcement') {
        if (totalGemsSaved >= 3) {
          return "You are already walking the path. Don't stop in the outer court.";
        }
        return `${totalGemsSaved} gems saved. Keep building your treasury.`;
      }
      if (trialDaysRemaining <= 3 && !changeSpine.isPaid) {
        return `Your trial ends in ${trialDaysRemaining} days. Continue your formation.`;
      }
      return "Continue your formation";
    },
  };
};
