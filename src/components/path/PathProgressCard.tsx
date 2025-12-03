import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, Route, Trophy, AlertCircle, ChevronRight } from "lucide-react";
import { usePath, PATH_INFO, PathType } from "@/hooks/usePath";
import { useNavigate } from "react-router-dom";

interface PathProgressCardProps {
  compact?: boolean;
  onOpenWizard?: () => void;
}

export function PathProgressCard({ compact = false, onOpenWizard }: PathProgressCardProps) {
  const navigate = useNavigate();
  const { 
    activePath, 
    isLoading, 
    getDaysUntilTrialEnds, 
    canSwitchPath, 
    getPathProgress, 
    getMasterLevel,
    pathInfo 
  } = usePath();

  if (isLoading) {
    return (
      <Card className={compact ? "p-4" : ""}>
        <div className="animate-pulse space-y-4 p-4">
          <div className="h-4 bg-muted rounded w-1/3"></div>
          <div className="h-8 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  // No path selected - show opt-in card
  if (!activePath) {
    return (
      <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
        <CardContent className={compact ? "p-4" : "p-6"}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Route className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Choose Your Learning Path</h3>
              <p className="text-sm text-muted-foreground">
                Personalize your 2-year Phototheology journey
              </p>
            </div>
            <Button onClick={onOpenWizard} size={compact ? "sm" : "default"}>
              Get Started
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const pathType = activePath.path_type as PathType;
  const pathData = pathInfo[pathType];
  const progress = getPathProgress();
  const trialDays = getDaysUntilTrialEnds();
  const masterLevel = getMasterLevel();

  if (compact) {
    return (
      <Card className={`${pathData.bgColor} border ${pathData.borderColor}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{pathData.icon}</span>
              <span className="font-semibold">{pathData.name}</span>
            </div>
            {masterLevel > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                Level {masterLevel}
              </Badge>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Year {activePath.current_year}, Month {activePath.current_month}</span>
              <span>{progress.percentage.toFixed(0)}%</span>
            </div>
            <Progress value={progress.percentage} className="h-2" />
          </div>

          {trialDays !== null && trialDays > 0 && (
            <div className="mt-2 flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
              <Clock className="h-3 w-3" />
              {trialDays} days left to switch paths
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${pathData.bgColor} border ${pathData.borderColor}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{pathData.icon}</span>
            <div>
              <CardTitle className="text-xl">{pathData.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{pathData.description}</p>
            </div>
          </div>
          {masterLevel > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1 text-sm">
              <Trophy className="h-4 w-4" />
              Master Level {masterLevel}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">
              Year {activePath.current_year} • Quarter {activePath.current_quarter} • Month {activePath.current_month}
            </span>
            <span className="text-muted-foreground">
              {progress.monthsCompleted} / {progress.totalMonths} months
            </span>
          </div>
          <Progress value={progress.percentage} className="h-3" />
          <p className="text-xs text-muted-foreground text-center">
            {progress.percentage.toFixed(1)}% complete
          </p>
        </div>

        {/* Trial Period Notice */}
        {trialDays !== null && trialDays > 0 && canSwitchPath() && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-700 dark:text-amber-300">
                Trial Period: {trialDays} days remaining
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                You can switch to a different path once before your trial ends.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={onOpenWizard}
              >
                Switch Path
              </Button>
            </div>
          </div>
        )}

        {/* Teaching Style */}
        <div className="bg-background/50 rounded-lg p-3">
          <p className="text-xs font-medium text-muted-foreground mb-1">Your teaching style</p>
          <p className="text-sm italic">"{pathData.teachingStyle}"</p>
        </div>

        {/* Action Button */}
        <Button 
          className="w-full" 
          onClick={() => navigate("/palace")}
        >
          Continue Your Journey
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
