import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Sparkles, X } from 'lucide-react';
import { useChangeSpine, GUIDED_PATH_STEPS } from '@/hooks/useChangeSpine';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface GuidedPathChecklistProps {
  className?: string;
  minimized?: boolean;
}

export const GuidedPathChecklist = ({ className, minimized = false }: GuidedPathChecklistProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const changeSpine = useChangeSpine();
  const { 
    hasCompletedOrientation, 
    hasAchievedFirstWin, 
    guidedPathStep, 
    guidedPathCompleted,
    isLoading,
    isNewUser
  } = changeSpine;
  
  const [isExpanded, setIsExpanded] = useState(!minimized);
  const [dismissed, setDismissed] = useState(false);

  // Check localStorage for dismissal
  useEffect(() => {
    const wasDismissed = localStorage.getItem('guided_path_dismissed');
    if (wasDismissed === 'true' && hasAchievedFirstWin) {
      setDismissed(true);
    }
  }, [hasAchievedFirstWin]);

  // Don't show for existing users (only new users)
  if (!isNewUser) {
    return null;
  }

  // Don't show if dismissed, or still loading
  if (isLoading || dismissed) {
    return null;
  }

  // Don't show if first win achieved and path completed
  if (hasAchievedFirstWin && guidedPathCompleted) {
    return null;
  }

  const currentStep = guidedPathStep;
  const progressPercent = (currentStep / (GUIDED_PATH_STEPS.length - 1)) * 100;

  const handleStepClick = (step: typeof GUIDED_PATH_STEPS[0]) => {
    if (step.id <= currentStep + 1) {
      navigate(step.path);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('guided_path_dismissed', 'true');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={cn(
          "fixed bottom-24 md:bottom-4 right-4 z-40 w-80",
          "bg-background/95 backdrop-blur-lg border border-border rounded-xl shadow-2xl",
          className
        )}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 cursor-pointer border-b border-border/50"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-semibold text-sm">Your Path to Mastery</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {currentStep + 1}/{GUIDED_PATH_STEPS.length}
            </span>
            <ChevronRight 
              className={cn(
                "w-4 h-4 transition-transform text-muted-foreground",
                isExpanded && "rotate-90"
              )} 
            />
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-4 py-2">
          <Progress value={progressPercent} className="h-1.5" />
        </div>

        {/* Steps list */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 pt-0 space-y-2">
                {GUIDED_PATH_STEPS.map((step, index) => {
                  const isCompleted = index < currentStep || (index === 3 && hasAchievedFirstWin);
                  const isCurrent = index === currentStep;
                  const isLocked = index > currentStep + 1;
                  const isActive = location.pathname === step.path;

                  return (
                    <motion.div
                      key={step.id}
                      className={cn(
                        "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all",
                        isCompleted && "bg-primary/10",
                        isCurrent && !isActive && "bg-accent/50 border border-primary/30",
                        isActive && "bg-primary/20 border border-primary",
                        isLocked && "opacity-50 cursor-not-allowed",
                        !isLocked && !isCompleted && "hover:bg-accent/30"
                      )}
                      onClick={() => !isLocked && handleStepClick(step)}
                      whileHover={!isLocked ? { scale: 1.02 } : {}}
                      whileTap={!isLocked ? { scale: 0.98 } : {}}
                    >
                      {/* Step indicator */}
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold",
                        isCompleted && "bg-primary text-primary-foreground",
                        isCurrent && !isCompleted && "bg-primary/30 text-primary border-2 border-primary",
                        isLocked && "bg-muted text-muted-foreground"
                      )}>
                        {isCompleted ? <Check className="w-3.5 h-3.5" /> : index + 1}
                      </div>

                      {/* Step content */}
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm font-medium truncate",
                          isCompleted && "text-primary",
                          isLocked && "text-muted-foreground"
                        )}>
                          {step.label}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {step.description}
                        </p>
                      </div>

                      {/* Arrow for current */}
                      {isCurrent && !isCompleted && (
                        <ChevronRight className="w-4 h-4 text-primary" />
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* First Win CTA */}
              {!hasAchievedFirstWin && currentStep >= 2 && (
                <div className="p-4 pt-0">
                  <Button 
                    className="w-full" 
                    onClick={() => navigate('/give-me-a-gem')}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Save Your First Gem
                  </Button>
                </div>
              )}

              {/* Dismiss option - always show when path is at step 3+ or completed */}
              {(guidedPathCompleted || currentStep >= 3 || hasAchievedFirstWin) && (
                <div className="p-4 pt-0 border-t border-border/50">
                  <button
                    onClick={handleDismiss}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mx-auto"
                  >
                    <X className="w-3 h-3" />
                    Dismiss
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};
