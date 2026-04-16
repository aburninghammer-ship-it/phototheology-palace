import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Flame, Headphones, Lock, Sparkles, Star, Trophy } from "lucide-react";
import { useLockInPass } from "@/hooks/useLockInPass";
import { LockInCommentaryPicker } from "@/components/LockInCommentaryPicker";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import confetti from "canvas-confetti";

const MISSION_ICONS = [
  <Sparkles className="h-4 w-4" />,
  <Star className="h-4 w-4" />,
  <Headphones className="h-4 w-4" />,
  <Flame className="h-4 w-4" />,
  <Trophy className="h-4 w-4" />,
];

export function LockInMissionTracker() {
  const { hasPass, passId, missions, currentDay, daysLeft, completedCount, completeMission, expiresAt, commentaryBook, commentaryChapter, commentaryMode } = useLockInPass();
  const navigate = useNavigate();

  if (!hasPass || missions.length === 0) return null;

  const progress = (completedCount / 5) * 100;

  const handleComplete = async (missionId: string, dayNumber: number) => {
    const success = await completeMission(missionId);
    if (success) {
      toast.success(`Day ${dayNumber} mission complete! 🔥`);
      if (completedCount + 1 === 5) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.5 },
          colors: ["#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"],
        });
        toast.success("ALL MISSIONS COMPLETE! You're locked in! 🏆");
      }
    }
  };

  return (
    <Card className="border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Flame className="h-5 w-5 text-amber-500" />
            Lock-In Pass — Day {currentDay} of 5
          </CardTitle>
          <Badge variant="outline" className="text-amber-600 border-amber-500/30">
            {daysLeft}d left
          </Badge>
        </div>
        <Progress value={progress} className="h-2 mt-2" />
        <p className="text-xs text-muted-foreground mt-1">
          {completedCount}/5 missions completed
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {missions.map((mission, i) => {
          const isAvailable = i + 1 <= currentDay;
          const isCompleted = mission.is_completed;

          return (
            <div
              key={mission.id}
              className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                isCompleted
                  ? "bg-green-500/10 border border-green-500/20"
                  : isAvailable
                  ? "bg-amber-500/5 border border-amber-500/20"
                  : "bg-muted/30 border border-border opacity-60"
              }`}
            >
              <div className="mt-0.5">
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : isAvailable ? (
                  <Circle className="h-5 w-5 text-amber-500" />
                ) : (
                  <Lock className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-medium text-muted-foreground">Day {mission.day_number}</span>
                  {MISSION_ICONS[i]}
                </div>
                <p className="font-medium text-sm">{mission.mission_title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{mission.mission_description}</p>
                {isAvailable && !isCompleted && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 text-amber-600 border-amber-500/30 hover:bg-amber-500/10"
                    onClick={() => handleComplete(mission.id, mission.day_number)}
                  >
                    Mark Complete
                  </Button>
                )}
              </div>
            </div>
          );
        })}

        {/* Commentary Picker — always visible for pass holders */}
        {passId && (
          <LockInCommentaryPicker
            passId={passId}
            selectedBook={commentaryBook}
            selectedChapter={commentaryChapter}
            selectedMode={commentaryMode}
            onSelectionSaved={() => window.location.reload()}
          />
        )}

        {completedCount === 5 && (
          <div className="text-center pt-2">
            <p className="text-sm font-medium mb-2">
              You've experienced the full power of Phototheology! 🎉
            </p>
            <Button
              onClick={() => navigate("/pricing")}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
            >
              Continue Your Journey — View Plans
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
