import { useLockInPass } from "@/hooks/useLockInPass";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, ArrowRight, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * Conversion banner shown to Lock-In Pass holders.
 * - Day 1-2: Warm encouragement
 * - Day 3-4: Gentle nudge
 * - Day 5: Strong CTA
 */
export function LockInConversionBanner() {
  const { hasPass, currentDay, daysLeft, completedCount } = useLockInPass();
  const navigate = useNavigate();

  if (!hasPass) return null;

  // Day 1-2: subtle encouragement
  if (currentDay <= 2) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <Flame className="h-5 w-5 text-amber-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">
            Lock-In Pass — Day {currentDay} of 5
          </p>
          <p className="text-xs text-muted-foreground">
            {completedCount > 0
              ? `${completedCount} mission${completedCount > 1 ? "s" : ""} complete! Keep exploring.`
              : "Complete today's mission to unlock the full experience."}
          </p>
        </div>
        <Badge variant="outline" className="text-amber-600 border-amber-500/30 shrink-0">
          {daysLeft}d left
        </Badge>
      </div>
    );
  }

  // Day 3-4: nudge
  if (currentDay <= 4) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30">
        <Clock className="h-5 w-5 text-amber-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">
            You've unlocked something most believers never see...
          </p>
          <p className="text-xs text-muted-foreground">
            {completedCount} missions done. {5 - completedCount} more to complete the Lock-In. {daysLeft} day{daysLeft !== 1 ? "s" : ""} remaining.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="shrink-0 border-amber-500/30 text-amber-600"
          onClick={() => navigate("/pricing")}
        >
          Keep Access
        </Button>
      </div>
    );
  }

  // Day 5: strong CTA
  return (
    <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-amber-500/15 to-red-500/15 border-2 border-amber-500/40">
      <Flame className="h-6 w-6 text-amber-500 shrink-0 animate-pulse" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-amber-700 dark:text-amber-300">
          Your Lock-In Pass expires {daysLeft <= 1 ? "today" : `in ${daysLeft} days`}!
        </p>
        <p className="text-xs text-muted-foreground">
          Don't lose your progress. {completedCount}/5 missions completed. Continue your journey.
        </p>
      </div>
      <Button
        size="sm"
        className="shrink-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white"
        onClick={() => navigate("/pricing")}
      >
        Continue <ArrowRight className="h-3 w-3 ml-1" />
      </Button>
    </div>
  );
}
