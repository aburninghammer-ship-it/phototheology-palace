import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Route, Trophy, Clock, ChevronRight, Sparkles } from "lucide-react";
import { usePath, PATH_INFO, PathType } from "@/hooks/usePath";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { PathSelectionWizard } from "./PathSelectionWizard";

export function PathProfileSection() {
  const { 
    activePath, 
    isLoading, 
    getDaysUntilTrialEnds, 
    canSwitchPath, 
    getPathProgress, 
    getMasterLevel,
    completions 
  } = usePath();
  const [showWizard, setShowWizard] = useState(false);

  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-8 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No path selected
  if (!activePath) {
    return (
      <>
        <Card className="glass-card border-2 border-dashed border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route className="h-5 w-5 text-primary" />
              Learning Path
            </CardTitle>
            <CardDescription>
              Personalize your 2-year Phototheology journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <p className="text-muted-foreground mb-4">
                Choose your learning path to have Jeeves adapt his teaching to match how you learn best.
              </p>
              <Button onClick={() => setShowWizard(true)}>
                Choose Your Path
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Dialog open={showWizard} onOpenChange={setShowWizard}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden">
            <PathSelectionWizard 
              onComplete={() => setShowWizard(false)}
              onCancel={() => setShowWizard(false)}
              showCancel={true}
            />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  const pathType = activePath.path_type as PathType;
  const pathData = PATH_INFO[pathType];
  const progress = getPathProgress();
  const trialDays = getDaysUntilTrialEnds();
  const masterLevel = getMasterLevel();

  return (
    <>
      <Card className={`glass-card ${pathData.bgColor} border ${pathData.borderColor}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">{pathData.icon}</span>
              {pathData.name}
            </CardTitle>
            {masterLevel > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                Master Level {masterLevel}
              </Badge>
            )}
          </div>
          <CardDescription>{pathData.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                Year {activePath.current_year} • Quarter {activePath.current_quarter} • Month {activePath.current_month}
              </span>
              <span className="text-muted-foreground">
                {progress.monthsCompleted} / {progress.totalMonths} months
              </span>
            </div>
            <Progress value={progress.percentage} className="h-2" />
          </div>

          {/* Teaching Style */}
          <div className="bg-background/50 rounded-lg p-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">Jeeves teaches you with</p>
            <p className="text-sm italic">"{pathData.teachingStyle}"</p>
          </div>

          {/* Strengths */}
          <div className="flex flex-wrap gap-2">
            {pathData.strengths.map((strength) => (
              <Badge key={strength} variant="outline" className="text-xs">
                {strength}
              </Badge>
            ))}
          </div>

          {/* Trial Notice */}
          {trialDays !== null && trialDays > 0 && canSwitchPath() && (
            <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 pt-2 border-t">
              <Clock className="h-4 w-4" />
              <span>{trialDays} days left to switch paths</span>
              <Button 
                variant="link" 
                size="sm" 
                className="ml-auto p-0 h-auto text-amber-600 dark:text-amber-400"
                onClick={() => setShowWizard(true)}
              >
                Switch
              </Button>
            </div>
          )}

          {/* Completions */}
          {completions && completions.length > 0 && (
            <div className="pt-2 border-t">
              <p className="text-xs font-medium text-muted-foreground mb-2">Completed Paths</p>
              <div className="flex flex-wrap gap-2">
                {completions.map((c) => (
                  <Badge key={c.id} variant="secondary" className="text-xs">
                    {PATH_INFO[c.path_type as PathType]?.icon} {PATH_INFO[c.path_type as PathType]?.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showWizard} onOpenChange={setShowWizard}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <PathSelectionWizard 
            onComplete={() => setShowWizard(false)}
            onCancel={() => setShowWizard(false)}
            showCancel={true}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
