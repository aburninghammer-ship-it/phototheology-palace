import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles, Check, X, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
  description?: string;
  benefits?: string[];
  limitType?: "jeeves" | "challenge" | "floor" | "room" | "feature";
  currentUsage?: number;
  maxUsage?: number;
}

// Track dismissals per session per feature
const dismissedFeatures = new Set<string>();

export const UpgradeModal = ({
  isOpen,
  onClose,
  feature,
  description,
  benefits,
  limitType,
  currentUsage,
  maxUsage,
}: UpgradeModalProps) => {
  const navigate = useNavigate();
  const [canDismiss, setCanDismiss] = useState(true);

  useEffect(() => {
    // Check if this feature was already dismissed this session
    if (dismissedFeatures.has(feature)) {
      setCanDismiss(false);
    } else {
      setCanDismiss(true);
    }
  }, [feature, isOpen]);

  const handleDismiss = () => {
    dismissedFeatures.add(feature);
    setCanDismiss(false);
    onClose();
  };

  const handleUpgrade = () => {
    onClose();
    navigate("/pricing");
  };

  const handleStartTrial = () => {
    onClose();
    navigate("/pricing?action=trial");
  };

  const defaultBenefits = [
    "All 8 Palace floors unlocked",
    "Unlimited Jeeves AI conversations",
    "Unlimited daily challenges",
    "Premium games & courses",
    "Sermon Builder & Research Mode",
  ];

  const displayBenefits = benefits || defaultBenefits;

  const getLimitMessage = () => {
    if (!limitType) return null;
    
    switch (limitType) {
      case "jeeves":
        return `You've used ${currentUsage || 0} of ${maxUsage || 10} free Jeeves conversations today.`;
      case "challenge":
        return `You've completed ${currentUsage || 0} of ${maxUsage || 3} free challenges this week.`;
      case "floor":
        return "This floor is only available to premium members.";
      case "room":
        return "This room is only available to premium members.";
      default:
        return "This feature is only available to premium members.";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl">Unlock {feature}</DialogTitle>
          <DialogDescription className="text-base">
            {description || `Get full access to ${feature} and much more.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Usage indicator */}
          {getLimitMessage() && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border/50">
              <Zap className="h-4 w-4 text-amber-500 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">{getLimitMessage()}</p>
            </div>
          )}

          {/* Benefits list */}
          <div className="space-y-2">
            <p className="text-sm font-medium">With Premium, you get:</p>
            <ul className="space-y-2">
              {displayBenefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Trial badge */}
          <div className="flex justify-center">
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" />
              30-day free trial available
            </Badge>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Button onClick={handleStartTrial} className="gradient-palace w-full">
            <Sparkles className="mr-2 h-4 w-4" />
            Start 30-Day Free Trial
          </Button>
          
          <Button onClick={handleUpgrade} variant="outline" className="w-full">
            View All Plans
          </Button>

          {canDismiss && (
            <Button 
              onClick={handleDismiss} 
              variant="ghost" 
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              Maybe later
            </Button>
          )}

          {!canDismiss && (
            <p className="text-xs text-center text-muted-foreground">
              Upgrade to continue using this feature
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Hook to manage upgrade modal state
export const useUpgradeModal = () => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    feature: string;
    description?: string;
    benefits?: string[];
    limitType?: "jeeves" | "challenge" | "floor" | "room" | "feature";
    currentUsage?: number;
    maxUsage?: number;
  }>({
    isOpen: false,
    feature: "",
  });

  const showUpgradeModal = (params: Omit<typeof modalState, "isOpen">) => {
    setModalState({ ...params, isOpen: true });
  };

  const closeUpgradeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  // Check if feature was already dismissed this session
  const wasFeatureDismissed = (feature: string) => dismissedFeatures.has(feature);

  return {
    modalState,
    showUpgradeModal,
    closeUpgradeModal,
    wasFeatureDismissed,
    UpgradeModalComponent: () => (
      <UpgradeModal
        isOpen={modalState.isOpen}
        onClose={closeUpgradeModal}
        feature={modalState.feature}
        description={modalState.description}
        benefits={modalState.benefits}
        limitType={modalState.limitType}
        currentUsage={modalState.currentUsage}
        maxUsage={modalState.maxUsage}
      />
    ),
  };
};
