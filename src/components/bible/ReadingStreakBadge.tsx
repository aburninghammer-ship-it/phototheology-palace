import { Flame, BookOpen, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useReadingStreak } from "@/hooks/useReadingStreak";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ReadingStreakBadgeProps {
  compact?: boolean;
}

export const ReadingStreakBadge = ({ compact = false }: ReadingStreakBadgeProps) => {
  const { streak, loading } = useReadingStreak();

  if (loading) {
    return compact ? (
      <Skeleton className="h-8 w-20" />
    ) : (
      <Card className="p-4">
        <Skeleton className="h-16 w-full" />
      </Card>
    );
  }

  if (!streak) {
    return null;
  }

  const isOnFire = streak.current_streak >= 3;
  const isHot = streak.current_streak >= 7;

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant="outline" 
              className={cn(
                "gap-1 cursor-default",
                isHot && "bg-gradient-to-r from-orange-500 to-red-500 text-white border-none",
                isOnFire && !isHot && "bg-orange-100 text-orange-700 border-orange-300"
              )}
            >
              <Flame className={cn(
                "h-3 w-3",
                isHot && "animate-pulse"
              )} />
              {streak.current_streak} day{streak.current_streak !== 1 ? "s" : ""}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm">
              <p className="font-medium">Reading Streak</p>
              <p className="text-muted-foreground">
                Best: {streak.longest_streak} days • {streak.total_chapters_read} chapters read
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Card className={cn(
      "p-4",
      isHot && "bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-200"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-full",
            isHot ? "bg-gradient-to-r from-orange-500 to-red-500" : "bg-primary/10"
          )}>
            <Flame className={cn(
              "h-5 w-5",
              isHot ? "text-white animate-pulse" : "text-primary"
            )} />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {streak.current_streak}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                day streak
              </span>
            </p>
            <p className="text-xs text-muted-foreground">
              Keep reading daily to maintain your streak!
            </p>
          </div>
        </div>
        
        <div className="flex gap-4 text-center">
          <div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Trophy className="h-3 w-3" />
              <span className="text-xs">Best</span>
            </div>
            <p className="font-semibold">{streak.longest_streak}</p>
          </div>
          <div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <BookOpen className="h-3 w-3" />
              <span className="text-xs">Chapters</span>
            </div>
            <p className="font-semibold">{streak.total_chapters_read}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
