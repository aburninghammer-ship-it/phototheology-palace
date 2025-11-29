import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UpgradePromptProps {
  feature: string;
  description?: string;
  className?: string;
}

export const UpgradePrompt = ({ feature, description, className = "" }: UpgradePromptProps) => {
  const navigate = useNavigate();

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
        <Button 
          onClick={() => navigate("/pricing")}
          className="gradient-palace"
        >
          <Crown className="mr-2 h-4 w-4" />
          Upgrade to Premium
        </Button>
        <p className="text-xs text-muted-foreground">
          Start with a 7-day free trial
        </p>
      </CardContent>
    </Card>
  );
};
