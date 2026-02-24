import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles, ArrowRight, Zap, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useChurchMembership } from "@/hooks/useChurchMembership";

interface InlineUpgradeCardProps {
  feature: string;
  description?: string;
  variant?: "compact" | "full" | "banner";
  limitType?: "jeeves" | "challenge" | "floor" | "room";
  currentUsage?: number;
  maxUsage?: number;
  className?: string;
}

export const InlineUpgradeCard = ({
  feature,
  description,
  variant = "compact",
  limitType,
  currentUsage,
  maxUsage,
  className = "",
}: InlineUpgradeCardProps) => {
  const navigate = useNavigate();
  const { isMember: isChurchMember } = useChurchMembership();

  // CRITICAL: Never show upgrade cards to church members
  if (isChurchMember) return null;

  const getLimitText = () => {
    if (!limitType || currentUsage === undefined || maxUsage === undefined) return null;
    
    const remaining = maxUsage - currentUsage;
    
    switch (limitType) {
      case "jeeves":
        return remaining > 0 
          ? `${remaining} free conversations remaining today`
          : "Daily limit reached";
      case "challenge":
        return remaining > 0 
          ? `${remaining} free challenges remaining this week`
          : "Weekly limit reached";
      default:
        return null;
    }
  };

  const limitText = getLimitText();
  const isLimitReached = currentUsage !== undefined && maxUsage !== undefined && currentUsage >= maxUsage;

  if (variant === "banner") {
    return (
      <div className={`w-full p-3 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-y border-primary/20 ${className}`}>
        <div className="flex items-center justify-between gap-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              {isLimitReached ? (
                <Lock className="h-4 w-4 text-primary" />
              ) : (
                <Zap className="h-4 w-4 text-primary" />
              )}
            </div>
            <div>
              <p className="font-medium text-sm">{feature}</p>
              {limitText && (
                <p className="text-xs text-muted-foreground">{limitText}</p>
              )}
            </div>
          </div>
          <Button 
            onClick={() => navigate("/pricing")}
            size="sm"
            className="gradient-palace gap-1"
          >
            <Sparkles className="h-3 w-3" />
            Upgrade
          </Button>
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 ${className}`}>
        <div className="p-2 rounded-full bg-primary/10">
          <Crown className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{feature}</p>
          {limitText && (
            <p className="text-xs text-muted-foreground">{limitText}</p>
          )}
        </div>
        <Button 
          onClick={() => navigate("/pricing")}
          size="sm"
          variant="outline"
          className="gap-1 shrink-0"
        >
          Upgrade
          <ArrowRight className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  // Full variant
  return (
    <Card className={`border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
            <Crown className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">{feature}</h3>
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="h-3 w-3" />
                Premium
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {description || `Unlock ${feature} with a premium subscription.`}
            </p>
            
            {limitText && (
              <div className="flex items-center gap-2 mb-4 p-2 rounded-md bg-muted/50">
                <Zap className="h-4 w-4 text-amber-500" />
                <span className="text-sm">{limitText}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={() => navigate("/pricing?action=trial")}
                className="gradient-palace"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Start Free Trial
              </Button>
              <Button 
                onClick={() => navigate("/pricing")}
                variant="outline"
              >
                View Plans
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
