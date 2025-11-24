import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Book } from "lucide-react";

interface Activity {
  id: string;
  title: string;
  type: string;
  completed?: boolean;
}

interface CurriculumCompletionTrackerProps {
  activities: Activity[];
  completionPercentage: number;
  curriculum?: any;
}

export const CurriculumCompletionTracker: React.FC<CurriculumCompletionTrackerProps> = ({
  activities,
  completionPercentage,
  curriculum,
}) => {
  const totalActivities = activities.length;
  const completedActivities = activities.filter(a => a.completed).length;
  const isFullyComplete = completionPercentage >= 100 || curriculum?.curriculum_completed;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Book className="h-5 w-5" />
          Curriculum Completion
        </CardTitle>
        <CardDescription>
          Complete all training activities to unlock Level 5
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Progress</span>
            <Badge variant={isFullyComplete ? "default" : "outline"}>
              {completedActivities}/{totalActivities} Activities
            </Badge>
          </div>
          <Progress value={completionPercentage} className="h-2" />
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{completionPercentage}% Complete</span>
            {isFullyComplete && (
              <span className="text-green-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Curriculum Complete!
              </span>
            )}
          </div>
        </div>

        {/* Activity Breakdown */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Activities</h4>
          <div className="space-y-2">
            {activities.slice(0, 5).map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-2 rounded-lg border bg-card"
              >
                <div className="flex items-center gap-2">
                  {activity.completed ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm">{activity.title}</span>
                </div>
                <Badge variant={activity.completed ? "default" : "outline"} className="text-xs">
                  {activity.type}
                </Badge>
              </div>
            ))}
            {activities.length > 5 && (
              <p className="text-xs text-muted-foreground text-center pt-1">
                +{activities.length - 5} more activities
              </p>
            )}
          </div>
        </div>

        {/* Level 5 Gate Warning */}
        {!isFullyComplete && completionPercentage >= 75 && (
          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Almost there! Complete all activities to unlock Level 5.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
