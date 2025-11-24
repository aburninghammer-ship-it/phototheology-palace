import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Lock } from "lucide-react";

interface FloorRequirementsCardProps {
  floorNumber: number;
  isUnlocked: boolean;
  requirements: {
    roomsRequired: number;
    xpPerRoom: number;
    streakDays: number;
    curriculumPercent: number;
    assessmentRequired: boolean;
    teachingDemo?: boolean;
    retentionTests?: string[];
  };
}

const FLOOR_NAMES: Record<number, string> = {
  1: "Floor 1: Furnishing (Blue Master)",
  2: "Floor 2: Investigation (Red Master)",
  3: "Floor 3: Freestyle (Gold Master)",
  4: "Floor 4: Next Level (Purple Master)",
  5: "Floor 5: Vision (White Master)",
  6: "Floor 6: Three Heavens (White Master)",
  7: "Floor 7: Transformation (Black Candidate)",
  8: "Floor 8: Master (BLACK MASTER)",
};

export const FloorRequirementsCard: React.FC<FloorRequirementsCardProps> = ({
  floorNumber,
  isUnlocked,
  requirements,
}) => {
  const isFloor8 = floorNumber === 8;

  return (
    <Card className={!isUnlocked ? "opacity-60" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {isUnlocked ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <Lock className="h-5 w-5 text-muted-foreground" />
          )}
          {FLOOR_NAMES[floorNumber]}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <Circle className="h-4 w-4 mt-0.5" />
            <span>
              Complete <strong>{requirements.roomsRequired} rooms</strong> to mastery
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Circle className="h-4 w-4 mt-0.5" />
            <span>
              <strong>{requirements.xpPerRoom} XP</strong> per room
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Circle className="h-4 w-4 mt-0.5" />
            <span>
              <strong>{requirements.streakDays}-day streak</strong> per room
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Circle className="h-4 w-4 mt-0.5" />
            <span>
              <strong>{requirements.curriculumPercent}% curriculum</strong> completion
            </span>
          </div>
          {requirements.assessmentRequired && (
            <div className="flex items-start gap-2">
              <Circle className="h-4 w-4 mt-0.5" />
              <span>
                Pass <strong>{isFloor8 ? "95%" : "80%"}</strong> comprehensive assessment
              </span>
            </div>
          )}
          {requirements.teachingDemo && (
            <div className="flex items-start gap-2">
              <Circle className="h-4 w-4 mt-0.5" />
              <span>Complete teaching demonstration</span>
            </div>
          )}
          {requirements.retentionTests && requirements.retentionTests.length > 0 && (
            <div className="flex items-start gap-2">
              <Circle className="h-4 w-4 mt-0.5" />
              <span>Pass retention tests: {requirements.retentionTests.join(", ")}</span>
            </div>
          )}
        </div>

        {isFloor8 && (
          <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-xs font-bold text-destructive mb-1">⚠️ BLACK MASTER FINAL EXAM</p>
            <p className="text-xs text-muted-foreground">
              The hardest test in the system. 95% required. AI will push back on every weak answer.
              You must demonstrate REFLEXIVE mastery across the entire Palace.
            </p>
          </div>
        )}

        {!isUnlocked && (
          <Badge variant="outline" className="w-full justify-center gap-2 py-2">
            <Lock className="h-3 w-3" />
            Complete Floor {floorNumber - 1} to unlock
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};
