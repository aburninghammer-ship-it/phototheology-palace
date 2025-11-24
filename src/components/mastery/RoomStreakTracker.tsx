import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, Calendar, TrendingUp } from "lucide-react";
import { format, subDays, isToday } from "date-fns";

interface RoomStreakTrackerProps {
  roomStreak: number;
  lastPracticeDate?: string;
  onPractice: () => void;
  isUpdating: boolean;
}

export const RoomStreakTracker: React.FC<RoomStreakTrackerProps> = ({
  roomStreak,
  lastPracticeDate,
  onPractice,
  isUpdating,
}) => {
  const canPracticeToday = !lastPracticeDate || !isToday(new Date(lastPracticeDate));
  
  // Generate last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return {
      date,
      day: format(date, "EEE")[0],
      practiced: false, // We'd need actual data to determine this
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5" />
          Room Practice Streak
        </CardTitle>
        <CardDescription>
          Practice this room daily to build mastery
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Streak */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="h-6 w-6 text-orange-500" />
              <span className="text-3xl font-bold">{roomStreak}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {roomStreak === 1 ? "day streak" : "days streak"}
            </p>
          </div>
          {canPracticeToday && (
            <Button
              onClick={onPractice}
              disabled={isUpdating}
              className="gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Practice Today
            </Button>
          )}
          {!canPracticeToday && (
            <Badge variant="default" className="gap-2">
              <Calendar className="h-3 w-3" />
              Practiced Today!
            </Badge>
          )}
        </div>

        {/* Visual Calendar (last 7 days) */}
        <div>
          <h4 className="text-sm font-medium mb-2">Practice History</h4>
          <div className="grid grid-cols-7 gap-2">
            {last7Days.map((day, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-1"
              >
                <span className="text-xs text-muted-foreground">{day.day}</span>
                <div
                  className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center ${
                    isToday(day.date) && canPracticeToday
                      ? "border-orange-500 bg-orange-500/10"
                      : isToday(day.date)
                      ? "border-green-500 bg-green-500/20"
                      : "border-muted bg-muted/50"
                  }`}
                >
                  {isToday(day.date) && !canPracticeToday && (
                    <Flame className="h-4 w-4 text-green-500" />
                  )}
                  {isToday(day.date) && canPracticeToday && (
                    <span className="text-xs font-medium text-muted-foreground">
                      {format(day.date, "d")}
                    </span>
                  )}
                  {!isToday(day.date) && (
                    <span className="text-xs text-muted-foreground">
                      {format(day.date, "d")}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Streak Milestones */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Milestones</h4>
          <div className="space-y-1">
            {[
              { days: 3, label: "Getting Started", unlocked: roomStreak >= 3 },
              { days: 7, label: "One Week Warrior", unlocked: roomStreak >= 7 },
              { days: 14, label: "Two Week Champion", unlocked: roomStreak >= 14 },
              { days: 30, label: "Monthly Master", unlocked: roomStreak >= 30 },
            ].map((milestone) => (
              <div
                key={milestone.days}
                className="flex items-center justify-between text-sm"
              >
                <span className={milestone.unlocked ? "font-medium" : "text-muted-foreground"}>
                  {milestone.label}
                </span>
                <Badge variant={milestone.unlocked ? "default" : "outline"}>
                  {milestone.days} days
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {lastPracticeDate && (
          <p className="text-xs text-muted-foreground text-center pt-2 border-t">
            Last practiced: {format(new Date(lastPracticeDate), "MMM d, yyyy")}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
