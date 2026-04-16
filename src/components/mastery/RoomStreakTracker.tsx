import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, Calendar, TrendingUp } from "lucide-react";
import { format, subDays, isToday } from "date-fns";
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const canPracticeToday = !lastPracticeDate || !isToday(new Date(lastPracticeDate));

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return {
      date,
      day: format(date, "EEE")[0],
      practiced: false,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5" />
          {t('roomStreak.title')}
        </CardTitle>
        <CardDescription>
          {t('roomStreak.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="h-6 w-6 text-orange-500" />
              <span className="text-3xl font-bold">{roomStreak}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {roomStreak === 1 ? t('roomStreak.dayStreak') : t('roomStreak.daysStreak')}
            </p>
          </div>
          {canPracticeToday && (
            <Button
              onClick={onPractice}
              disabled={isUpdating}
              className="gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              {t('roomStreak.practiceToday')}
            </Button>
          )}
          {!canPracticeToday && (
            <Badge variant="default" className="gap-2">
              <Calendar className="h-3 w-3" />
              {t('roomStreak.practicedToday')}
            </Badge>
          )}
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">{t('roomStreak.practiceHistory')}</h4>
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

        <div className="space-y-2">
          <h4 className="text-sm font-medium">{t('roomStreak.milestones')}</h4>
          <div className="space-y-1">
            {[
              { days: 3, label: t('roomStreak.gettingStarted'), unlocked: roomStreak >= 3 },
              { days: 7, label: t('roomStreak.oneWeekWarrior'), unlocked: roomStreak >= 7 },
              { days: 14, label: t('roomStreak.twoWeekChampion'), unlocked: roomStreak >= 14 },
              { days: 30, label: t('roomStreak.monthlyMaster'), unlocked: roomStreak >= 30 },
            ].map((milestone) => (
              <div
                key={milestone.days}
                className="flex items-center justify-between text-sm"
              >
                <span className={milestone.unlocked ? "font-medium" : "text-muted-foreground"}>
                  {milestone.label}
                </span>
                <Badge variant={milestone.unlocked ? "default" : "outline"}>
                  {t('roomStreak.days', { count: milestone.days })}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {lastPracticeDate && (
          <p className="text-xs text-muted-foreground text-center pt-2 border-t">
            {t('roomStreak.lastPracticed', { date: format(new Date(lastPracticeDate), "MMM d, yyyy") })}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
