import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { usePath, PATH_INFO, PathType } from "@/hooks/usePath";
import { 
  Route, Trophy, Clock, ChevronRight, Lock, Unlock, 
  Target, Calendar, Sparkles, Award
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PathSelectionWizard } from "./PathSelectionWizard";
import { MonthlyGateAssessment } from "./MonthlyGateAssessment";
import { useNavigate } from "react-router-dom";

export function PathDashboardWidget() {
  const navigate = useNavigate();
  const { 
    activePath, 
    isLoading, 
    getDaysUntilTrialEnds, 
    getPathProgress, 
    getMasterLevel,
    completions 
  } = usePath();
  const [showWizard, setShowWizard] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);

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

  // No path selected - show opt-in
  if (!activePath) {
    return (
      <>
        <Card className="glass-card border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Route className="h-5 w-5 text-primary" />
              Choose Your Learning Path
            </CardTitle>
            <CardDescription>
              Personalize your 2-year Phototheology journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {(["visual", "analytical", "devotional", "warrior"] as PathType[]).map((type) => (
                  <div 
                    key={type}
                    className={`w-10 h-10 rounded-full ${PATH_INFO[type].bgColor} border-2 border-background flex items-center justify-center text-lg`}
                  >
                    {PATH_INFO[type].icon}
                  </div>
                ))}
              </div>
              <Button onClick={() => setShowWizard(true)} className="flex-1">
                Get Started
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
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="text-xl">{pathData.icon}</span>
              {pathData.name}
            </CardTitle>
            <div className="flex items-center gap-2">
              {masterLevel > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Trophy className="h-3 w-3" />
                  Level {masterLevel}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Year {activePath.current_year} • Q{activePath.current_quarter} • Month {activePath.current_month}
              </span>
              <span className="text-muted-foreground">
                {progress.percentage.toFixed(0)}%
              </span>
            </div>
            <Progress value={progress.percentage} className="h-2" />
          </div>

          {/* Monthly Gate Status */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-amber-500" />
              <span className="text-sm">Month {activePath.current_month} Gate</span>
            </div>
            <Button size="sm" variant="outline" onClick={() => setShowAssessment(true)}>
              <Target className="mr-1 h-3 w-3" />
              Take Assessment
            </Button>
          </div>

          {/* Trial Notice */}
          {trialDays !== null && trialDays > 0 && (
            <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
              <Clock className="h-3 w-3" />
              <span>{trialDays} days left in trial period</span>
            </div>
          )}

          {/* Quick Action */}
          <Button 
            variant="secondary" 
            className="w-full"
            onClick={() => navigate("/palace")}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Continue Learning
          </Button>
        </CardContent>
      </Card>

      {/* Assessment Dialog */}
      <Dialog open={showAssessment} onOpenChange={setShowAssessment}>
        <DialogContent className="max-w-2xl p-6">
          <MonthlyGateAssessment 
            onComplete={(passed) => {
              setShowAssessment(false);
            }}
            onCancel={() => setShowAssessment(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
