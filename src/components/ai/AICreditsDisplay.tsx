import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CreditPurchaseModal } from "@/components/CreditPurchaseModal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Zap,
  Crown,
  Loader2,
  Infinity
} from "lucide-react";
import { useAICredits, FEATURE_COSTS } from "@/hooks/useAICredits";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface AICreditsDisplayProps {
  variant?: "badge" | "full" | "compact";
  className?: string;
}

export function AICreditsDisplay({ variant = "badge", className }: AICreditsDisplayProps) {
  const navigate = useNavigate();
  const {
    creditsInfo,
    isLoading,
    packages,
    showPurchaseModal,
    setShowPurchaseModal,
  } = useAICredits();

  if (isLoading) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (!creditsInfo) return null;

  // Badge variant - compact display for nav bar
  if (variant === "badge") {
    return (
      <>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className={cn("gap-2", className)}>
              <Zap className="h-4 w-4 text-yellow-500" />
              {creditsInfo.has_unlimited ? (
                <span className="flex items-center gap-1">
                  <Infinity className="h-3 w-3" />
                  <span className="text-xs">Unlimited</span>
                </span>
              ) : (
                <span className="text-sm font-medium">{creditsInfo.credits_balance}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">AI Credits</h4>
                  <p className="text-sm text-muted-foreground">
                    Used for AI-powered features
                  </p>
                </div>
                {creditsInfo.has_unlimited ? (
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                    <Crown className="h-3 w-3 mr-1" />
                    Unlimited
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-lg">
                    {creditsInfo.credits_balance}
                  </Badge>
                )}
              </div>

              {!creditsInfo.has_unlimited && (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Credits remaining</span>
                      <span className="font-medium">{creditsInfo.credits_balance}</span>
                    </div>
                    <Progress
                      value={Math.min(100, (creditsInfo.credits_balance / 100) * 100)}
                      className="h-2"
                    />
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <p>This month: {creditsInfo.usage_this_month} credits used</p>
                    <p>Lifetime: {creditsInfo.lifetime_used} credits used</p>
                  </div>

                  <div className="pt-2 border-t space-y-2">
                    <Button
                      className="w-full"
                      onClick={() => setShowPurchaseModal(true)}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Buy More Credits
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate("/pricing")}
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade to Unlimited
                    </Button>
                  </div>
                </>
              )}

              {creditsInfo.has_unlimited && (
                <div className="text-sm text-muted-foreground">
                  <p>You have unlimited AI credits with your current plan.</p>
                  <p className="mt-1">This month: {creditsInfo.usage_this_month} AI operations</p>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        <CreditPurchaseModal
          open={showPurchaseModal}
          onOpenChange={setShowPurchaseModal}
          currentCredits={creditsInfo.credits_balance}
        />
      </>
    );
  }

  // Compact variant - inline display
  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Zap className="h-4 w-4 text-yellow-500" />
        {creditsInfo.has_unlimited ? (
          <Badge variant="secondary" className="text-xs">
            <Infinity className="h-3 w-3 mr-1" />
            Unlimited
          </Badge>
        ) : (
          <>
            <span className="text-sm font-medium">{creditsInfo.credits_balance} credits</span>
            {creditsInfo.credits_balance < 10 && (
              <Button
                variant="link"
                size="sm"
                className="text-xs p-0 h-auto"
                onClick={() => setShowPurchaseModal(true)}
              >
                Get more
              </Button>
            )}
          </>
        )}
      </div>
    );
  }

  // Full variant - detailed card display
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          AI Credits
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {creditsInfo.has_unlimited ? (
          <div className="text-center py-4">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-lg px-4 py-2">
              <Crown className="h-4 w-4 mr-2" />
              Unlimited AI Access
            </Badge>
            <p className="text-sm text-muted-foreground mt-2">
              You have unlimited AI credits with your premium subscription.
            </p>
          </div>
        ) : (
          <>
            <div className="text-center">
              <span className="text-4xl font-bold">{creditsInfo.credits_balance}</span>
              <span className="text-muted-foreground ml-2">credits</span>
            </div>

            <Progress
              value={Math.min(100, (creditsInfo.credits_balance / 100) * 100)}
              className="h-3"
            />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">This month</p>
                <p className="font-medium">{creditsInfo.usage_this_month} used</p>
              </div>
              <div>
                <p className="text-muted-foreground">Lifetime</p>
                <p className="font-medium">{creditsInfo.lifetime_used} used</p>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <h4 className="text-sm font-medium">Credit Costs</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(FEATURE_COSTS).map(([feature, cost]) => (
                  <div key={feature} className="flex justify-between">
                    <span className="text-muted-foreground capitalize">
                      {feature.replace(/-/g, " ")}
                    </span>
                    <span>{cost} credits</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                className="flex-1"
                onClick={() => setShowPurchaseModal(true)}
              >
                <Zap className="h-4 w-4 mr-2" />
                Buy Credits
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/pricing")}
              >
                <Crown className="h-4 w-4 mr-2" />
                Go Unlimited
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}



// Export for use in feature components
export function CreditsRequiredBadge({ feature }: { feature: string }) {
  const cost = FEATURE_COSTS[feature] || 1;
  return (
    <Badge variant="outline" className="text-xs gap-1">
      <Zap className="h-3 w-3 text-yellow-500" />
      {cost} credits
    </Badge>
  );
}
