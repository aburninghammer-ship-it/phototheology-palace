import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Lock, Unlock, Trophy, Flame, Brain } from "lucide-react";
import { useState } from "react";
import { FloorAssessmentDialog } from "./FloorAssessmentDialog";

interface FloorProgressTowerProps {
  floors: any[];
  globalTitle: any;
}

const FLOOR_COLORS: Record<number, string> = {
  1: "bg-blue-500",
  2: "bg-red-500",
  3: "bg-yellow-500",
  4: "bg-purple-500",
  5: "bg-white",
  6: "bg-white",
  7: "bg-gray-800",
  8: "bg-black",
};

const FLOOR_TITLES: Record<number, string> = {
  1: "Blue Master",
  2: "Red Master",
  3: "Gold Master",
  4: "Purple Master",
  5: "White Master",
  6: "White Master",
  7: "Black Candidate",
  8: "Black Master",
};

const FLOOR_NAMES: Record<number, string> = {
  1: "Furnishing",
  2: "Investigation",
  3: "Freestyle",
  4: "Next Level",
  5: "Vision",
  6: "Three Heavens",
  7: "Transformation",
  8: "Master",
};

export const FloorProgressTower: React.FC<FloorProgressTowerProps> = ({
  floors,
  globalTitle,
}) => {
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6" />
            The Palace Ascent
          </CardTitle>
          <CardDescription>
            Climb all 8 floors to achieve Black Master status
          </CardDescription>
          {globalTitle?.master_title && (
            <Badge className={`${FLOOR_COLORS[globalTitle.current_floor - 1] || "bg-blue-500"} text-white`}>
              Current: {FLOOR_TITLES[globalTitle.current_floor - 1]}
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Render floors 8 → 1 (bottom to top visually) */}
            {floors
              .sort((a, b) => b.floor_number - a.floor_number)
              .map((floor) => {
                const isCompleted = !!floor.floor_completed_at;
                const isUnlocked = floor.is_unlocked;
                const isCurrent = floor.floor_number === globalTitle?.current_floor;
                const progressPercent = (floor.rooms_completed / floor.rooms_required) * 100;

                return (
                  <div
                    key={floor.floor_number}
                    className={`relative p-4 rounded-lg border-2 transition-all ${
                      isCompleted
                        ? "border-green-500 bg-green-500/10"
                        : isCurrent
                        ? "border-primary bg-primary/5 animate-pulse"
                        : isUnlocked
                        ? "border-border bg-card hover:border-primary/50"
                        : "border-muted bg-muted/30"
                    }`}
                  >
                    {/* Floor Number Badge */}
                    <div className="absolute -left-3 -top-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                          FLOOR_COLORS[floor.floor_number]
                        } ${!isUnlocked && "opacity-40"}`}
                      >
                        {floor.floor_number}
                      </div>
                    </div>

                    <div className="flex items-start justify-between ml-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {isCompleted ? (
                            <Trophy className="h-5 w-5 text-green-500" />
                          ) : isUnlocked ? (
                            <Unlock className="h-5 w-5 text-primary" />
                          ) : (
                            <Lock className="h-5 w-5 text-muted-foreground" />
                          )}
                          <h3 className="font-bold">{FLOOR_NAMES[floor.floor_number]}</h3>
                          {floor.floor_number === 8 && (
                            <Badge variant="destructive" className="text-xs">
                              FINAL EXAM
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground mb-2">
                          {isCompleted
                            ? `✅ Completed - ${FLOOR_TITLES[floor.floor_number]} Earned`
                            : `Complete ${floor.rooms_required} rooms to unlock assessment`}
                        </p>

                        {/* Room Progress */}
                        {isUnlocked && !isCompleted && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span>Rooms: {floor.rooms_completed}/{floor.rooms_required}</span>
                              <span>{Math.round(progressPercent)}%</span>
                            </div>
                            <Progress value={progressPercent} className="h-1.5" />
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="ml-4">
                        {isCompleted && (
                          <Badge variant="default" className="gap-1">
                            <Trophy className="h-3 w-3" />
                            Passed
                          </Badge>
                        )}
                        {!isCompleted &&
                          isUnlocked &&
                          floor.rooms_completed >= floor.rooms_required && (
                            <Button
                              size="sm"
                              onClick={() => setSelectedFloor(floor.floor_number)}
                              className="gap-2"
                            >
                              <Brain className="h-3 w-3" />
                              Take Assessment
                            </Button>
                          )}
                        {!isUnlocked && (
                          <Badge variant="outline" className="gap-1">
                            <Lock className="h-3 w-3" />
                            Locked
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Floor 8 Special Warning */}
                    {floor.floor_number === 8 && isUnlocked && (
                      <div className="mt-3 p-2 rounded bg-destructive/10 border border-destructive/20">
                        <p className="text-xs font-semibold text-destructive flex items-center gap-1">
                          <Flame className="h-3 w-3" />
                          BLACK MASTER EXAM: 95% required. No mercy. Be ready.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>

          {/* Legend */}
          <div className="mt-6 p-3 rounded-lg bg-muted/50 text-xs space-y-1">
            <p className="font-semibold mb-2">Master Title Progression:</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span>Blue Master (Floor 1)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span>Red Master (Floor 2)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span>Gold Master (Floor 3)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span>Purple Master (Floor 4)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-white border border-border" />
                <span>White Master (Floors 5-6)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-black" />
                <span>Black Master (Floor 8)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedFloor && (
        <FloorAssessmentDialog
          floorNumber={selectedFloor}
          open={!!selectedFloor}
          onOpenChange={(open) => !open && setSelectedFloor(null)}
          onSuccess={() => {
            setSelectedFloor(null);
          }}
        />
      )}
    </>
  );
};
