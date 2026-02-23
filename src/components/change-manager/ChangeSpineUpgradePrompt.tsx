import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, X, Clock, Sparkles } from 'lucide-react';
import { useChangeSpine, shouldEscalateUpgrade } from '@/hooks/useChangeSpine';
import { useAuth } from '@/hooks/useAuth';
import { useChurchMembership } from '@/hooks/useChurchMembership';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ChangeSpineUpgradePromptProps {
  className?: string;
}

/**
 * Upgrade prompt that escalates based on trial days remaining.
 * - 10+ days: Minimal/hidden
 * - 4-10 days: Subtle banner
 * - 1-3 days: Prominent banner with urgency
 * - 0 days: Full modal-like urgency
 */
export const ChangeSpineUpgradePrompt = ({ className }: ChangeSpineUpgradePromptProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const changeSpine = useChangeSpine();
  const { trialDaysRemaining, isPaid, isLoading, isNewUser, hasAchievedFirstWin } = changeSpine;
  const { isMember: isChurchMember, isLoading: churchLoading } = useChurchMembership();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  
  const [dismissed, setDismissed] = useState(false);

  // Reset dismissal each day
  useEffect(() => {
    const dismissedDate = localStorage.getItem('upgrade_prompt_dismissed_date');
    const today = new Date().toDateString();
    if (dismissedDate !== today) {
      setDismissed(false);
    }
  }, []);

  // Never show if not authenticated or already on pricing
  if (authLoading || !user || location.pathname === '/pricing') {
    return null;
  }

  // CRITICAL: Never show upgrade prompts to church members or admins
  if (isChurchMember || isAdmin) {
    return null;
  }

  // Don't show if paid, loading, or dismissed
  if (isLoading || churchLoading || adminLoading || isPaid || dismissed) {
    return null;
  }

  // Don't show for users with 7+ days remaining (unless they've achieved first win)
  if (trialDaysRemaining > 7) {
    return null;
  }

  // Only show to new users OR users who've hit the escalation threshold
  if (!isNewUser && !shouldEscalateUpgrade(changeSpine)) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('upgrade_prompt_dismissed_date', new Date().toDateString());
  };

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  // Determine urgency level
  const getUrgencyConfig = () => {
    if (trialDaysRemaining <= 0) {
      return {
        level: 'critical',
        bgClass: 'bg-destructive/10 border-destructive/50',
        iconColor: 'text-destructive',
        title: 'Your trial has ended',
        message: 'Continue your formation with full access to all Palace features.',
        buttonVariant: 'destructive' as const,
      };
    }
    if (trialDaysRemaining <= 3) {
      return {
        level: 'high',
        bgClass: 'bg-amber-500/10 border-amber-500/50',
        iconColor: 'text-amber-500',
        title: `${trialDaysRemaining} day${trialDaysRemaining === 1 ? '' : 's'} left in your trial`,
        message: 'Don\'t lose your progress. Unlock the full Palace experience.',
        buttonVariant: 'default' as const,
      };
    }
    return {
      level: 'medium',
      bgClass: 'bg-primary/5 border-primary/20',
      iconColor: 'text-primary',
      title: `${trialDaysRemaining} days left in your trial`,
      message: hasAchievedFirstWin 
        ? 'You\'ve saved your first Gem! Continue building your treasury.' 
        : 'Explore all features before your trial ends.',
      buttonVariant: 'outline' as const,
    };
  };

  const config = getUrgencyConfig();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        style={{ top: "calc(var(--app-header-height, 64px) + 0.75rem)" }}
        className={cn(
          "fixed left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-md",
          "border rounded-xl shadow-lg backdrop-blur-sm",
          config.bgClass,
          className
        )}
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className={cn("p-2 rounded-full bg-background/50", config.iconColor)}>
              {config.level === 'critical' ? (
                <Clock className="w-5 h-5" />
              ) : (
                <Crown className="w-5 h-5" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm">{config.title}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">{config.message}</p>
              
              <div className="flex items-center gap-2 mt-3">
                <Button 
                  size="sm" 
                  variant={config.buttonVariant}
                  onClick={handleUpgrade}
                  className="h-8"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  Upgrade Now
                </Button>
                {trialDaysRemaining > 0 && (
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={handleDismiss}
                    className="h-8 text-muted-foreground"
                  >
                    Later
                  </Button>
                )}
              </div>
            </div>

            {trialDaysRemaining > 0 && (
              <button
                onClick={handleDismiss}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
