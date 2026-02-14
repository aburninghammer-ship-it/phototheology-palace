import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Lock, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEventTracking } from "@/hooks/useEventTracking";
import { useChurchMembership } from "@/hooks/useChurchMembership";

interface UpgradePromptProps {
  feature: string;
  description?: string;
  className?: string;
  variant?: "card" | "inline" | "minimal";
  showTrialOption?: boolean;
}

export const UpgradePrompt = ({ 
  feature, 
  description, 
  className = "",
  variant = "card",
  showTrialOption = true,
}: UpgradePromptProps) => {
  const navigate = useNavigate();
  const { trackPaywallHit, trackUpgradeClick } = useEventTracking();
  const { isMember: isChurchMember } = useChurchMembership();

  // Track paywall hit on mount
  useEffect(() => {
    if (!isChurchMember) {
      trackPaywallHit(feature, `upgrade_prompt_${variant}`);
    }
  }, [feature, variant, trackPaywallHit, isChurchMember]);

  // CRITICAL: Never show upgrade prompts to church members
  if (isChurchMember) return null;

  const handleUpgrade = () => {
    trackUpgradeClick(`upgrade_prompt_${variant}`, feature);
    navigate("/pricing");
  };

  if (variant === "minimal") {
    return (
      <div className={`flex items-center gap-2 p-2 rounded-md bg-primary/5 border border-primary/20 ${className}`}>
        <Lock className="h-4 w-4 text-primary" />
        <span className="text-sm text-muted-foreground flex-1">{feature} requires Premium</span>
        <Button 
          onClick={handleUpgrade}
          size="sm"
          variant="ghost"
          className="text-primary hover:text-primary"
        >
          Upgrade
          <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={`flex items-center justify-between gap-4 p-4 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <Crown className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{feature}</p>
            <p className="text-sm text-muted-foreground">
              {description || "Upgrade to unlock this feature"}
            </p>
          </div>
        </div>
        <Button 
          onClick={handleUpgrade}
          className="gradient-palace shrink-0"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Upgrade
        </Button>
      </div>
    );
  }

  return (
    <Card className={`border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 ${className}`}>
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
          <Lock className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl">Unlock {feature}</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-muted-foreground">
          {description || `${feature} is available with a premium subscription.`}
        </p>
        
        <div className="flex flex-col gap-2">
          <Button 
            onClick={handleUpgrade}
            className="gradient-palace"
          >
            <Crown className="mr-2 h-4 w-4" />
            View Premium Plans
          </Button>
          
          {showTrialOption && (
            <Badge variant="secondary" className="mx-auto gap-1">
              <Sparkles className="h-3 w-3" />
              7-day free trial available
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
