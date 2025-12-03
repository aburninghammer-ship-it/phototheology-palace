import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { usePath, PATH_INFO, PathType } from "@/hooks/usePath";
import { 
  getCurrentWeekInMonth, 
  getPathCurriculum, 
  getCurrentWeekOutline,
  WeekActivity 
} from "@/data/pathCurriculum";
import { 
  Calendar, BookOpen, Target, Clock, ChevronRight, 
  Sparkles, Trophy, ArrowRight, CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface PathWeekOutlineProps {
  compact?: boolean;
}

export function PathWeekOutline({ compact = false }: PathWeekOutlineProps) {
  const navigate = useNavigate();
  const { activePath, isLoading } = usePath();
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);

  // Load completed activities from localStorage
  useEffect(() => {
    if (activePath) {
      const key = `path-activities-${activePath.id}-${activePath.current_month}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        setCompletedActivities(JSON.parse(saved));
      }
    }
  }, [activePath]);

  // Save completed activities
  const toggleActivity = (activityId: string) => {
    if (!activePath) return;
    
    const key = `path-activities-${activePath.id}-${activePath.current_month}`;
    const newCompleted = completedActivities.includes(activityId)
      ? completedActivities.filter(id => id !== activityId)
      : [...completedActivities, activityId];
    
    setCompletedActivities(newCompleted);
    localStorage.setItem(key, JSON.stringify(newCompleted));
  };

  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!activePath) {
    return null;
  }

  const pathType = activePath.path_type as PathType;
  const pathData = PATH_INFO[pathType];
  const currentWeek = getCurrentWeekInMonth(activePath.started_at);
  const monthCurriculum = getPathCurriculum(pathType, activePath.current_month);
  const weekOutline = getCurrentWeekOutline(pathType, activePath.current_month, currentWeek);

  if (!monthCurriculum || !weekOutline) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Curriculum for month {activePath.current_month} is coming soon!
          </p>
        </CardContent>
      </Card>
    );
  }

  const completedCount = weekOutline.activities.filter(
    a => completedActivities.includes(a.id)
  ).length;
  const progressPercent = (completedCount / weekOutline.activities.length) * 100;

  if (compact) {
    return (
      <Card className={`glass-card ${pathData.bgColor} border ${pathData.borderColor}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <span>{pathData.icon}</span>
              Week {currentWeek}: {weekOutline.title}
            </CardTitle>
            <Badge variant="secondary">
              {completedCount}/{weekOutline.activities.length}
            </Badge>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </CardHeader>
        <CardContent>
          <Button 
            variant="secondary" 
            className="w-full"
            onClick={() => navigate("/path/week")}
          >
            View Week Outline
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className={`glass-card ${pathData.bgColor} border ${pathData.borderColor}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={pathData.borderColor}>
              <span className="mr-1">{pathData.icon}</span>
              {pathData.name}
            </Badge>
            <Badge variant="secondary">
              <Calendar className="mr-1 h-3 w-3" />
              Month {activePath.current_month}
            </Badge>
          </div>
          <CardTitle className="text-2xl mt-2">
            Week {currentWeek}: {weekOutline.title}
          </CardTitle>
          <CardDescription className="text-base">
            {weekOutline.focus}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Scripture Focus */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
            <BookOpen className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Scripture Focus</p>
              <p className="text-sm text-muted-foreground">{weekOutline.scripture}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Week Progress</span>
              <span className="text-muted-foreground">
                {completedCount} of {weekOutline.activities.length} activities
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          {/* Milestone */}
          {weekOutline.milestone && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <Trophy className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                  Week Goal
                </p>
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  {weekOutline.milestone}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activities List */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            This Week's Activities
          </CardTitle>
          <CardDescription>
            Complete each activity to progress through your path
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {weekOutline.activities.map((activity, index) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              index={index + 1}
              isCompleted={completedActivities.includes(activity.id)}
              onToggle={() => toggleActivity(activity.id)}
              onNavigate={() => activity.link && navigate(activity.link)}
            />
          ))}
        </CardContent>
      </Card>

      {/* Month Overview */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">{monthCurriculum.title}</CardTitle>
          <CardDescription>{monthCurriculum.theme}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {monthCurriculum.weeks.map((week) => (
              <div
                key={week.weekNumber}
                className={`flex-1 p-3 rounded-lg text-center transition-colors ${
                  week.weekNumber === currentWeek
                    ? `${pathData.bgColor} border ${pathData.borderColor}`
                    : week.weekNumber < currentWeek
                    ? "bg-primary/10"
                    : "bg-muted/50"
                }`}
              >
                <p className="text-xs text-muted-foreground">Week {week.weekNumber}</p>
                <p className="text-sm font-medium truncate">{week.title}</p>
                {week.weekNumber < currentWeek && (
                  <CheckCircle2 className="h-4 w-4 mx-auto mt-1 text-primary" />
                )}
              </div>
            ))}
          </div>

          {/* Gate Assessment Preview */}
          <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-dashed">
            <p className="text-sm font-medium">Month {activePath.current_month} Gate Assessment</p>
            <p className="text-xs text-muted-foreground mt-1">
              {monthCurriculum.gateAssessment}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Activity Item Component
interface ActivityItemProps {
  activity: WeekActivity;
  index: number;
  isCompleted: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}

function ActivityItem({ activity, index, isCompleted, onToggle, onNavigate }: ActivityItemProps) {
  const [showInstructions, setShowInstructions] = useState(false);
  
  const typeColors: Record<string, string> = {
    reading: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    drill: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    exercise: "bg-green-500/10 text-green-600 dark:text-green-400",
    reflection: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    challenge: "bg-red-500/10 text-red-600 dark:text-red-400",
  };

  // Parse instructions into bullet points
  const parseInstructions = (instructions: string | undefined): string[] => {
    if (!instructions) return [];
    // Split by numbered items or newlines
    return instructions
      .split(/\n/)
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.replace(/^\d+\.\s*/, '')); // Remove leading numbers
  };

  const instructionSteps = parseInstructions(activity.detailedInstructions);

  return (
    <div
      className={`rounded-lg border transition-all ${
        isCompleted
          ? "bg-primary/5 border-primary/20"
          : "bg-card hover:bg-accent/50"
      }`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={isCompleted}
            onCheckedChange={onToggle}
            className="mt-1"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg">{activity.icon}</span>
              <span className={`font-medium ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
                {activity.title}
              </span>
              <Badge variant="outline" className={typeColors[activity.type]}>
                {activity.type}
              </Badge>
              {activity.roomCode && (
                <Badge variant="secondary" className="text-xs">
                  {activity.roomCode}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {activity.description}
            </p>
            <div className="flex items-center gap-4 mt-2 flex-wrap">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {activity.duration}
              </span>
              {instructionSteps.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-xs border-primary/30 text-primary hover:bg-primary/10"
                  onClick={() => setShowInstructions(!showInstructions)}
                >
                  <BookOpen className="mr-1 h-3 w-3" />
                  {showInstructions ? "Hide" : "Show"} Instructions
                </Button>
              )}
              {activity.link && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={onNavigate}
                >
                  Go to activity
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Instructions Panel */}
      {showInstructions && instructionSteps.length > 0 && (
        <div className="px-4 pb-4">
          <div className="ml-8 p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              Step-by-Step Instructions
            </div>
            <ol className="space-y-2">
              {instructionSteps.map((step, idx) => (
                <li key={idx} className="flex gap-3 text-sm">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-muted-foreground pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
            
            {/* Look For section */}
            {activity.lookFor && activity.lookFor.length > 0 && (
              <div className="mt-4 pt-3 border-t border-primary/20">
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  What to Look For:
                </p>
                <ul className="space-y-1">
                  {activity.lookFor.map((item, idx) => (
                    <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-amber-500">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specific Verse reference */}
            {activity.specificVerse && (
              <div className="mt-3 pt-3 border-t border-primary/20">
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  Key Passage: {activity.specificVerse}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
