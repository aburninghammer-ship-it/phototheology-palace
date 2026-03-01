import { Building2, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface RoomPrerequisitesProps {
  rooms: string[];
  compact?: boolean;
}

const roomNames: Record<string, { name: string; floor: number }> = {
  SR: { name: "Story Room", floor: 1 },
  IR: { name: "Imagination Room", floor: 1 },
  "24": { name: "24FPS Room", floor: 1 },
  BR: { name: "Bible Rendered", floor: 1 },
  TR: { name: "Translation Room", floor: 1 },
  GR: { name: "Gems Room", floor: 1 },
  OR: { name: "Observation Room", floor: 2 },
  DC: { name: "Def-Com Room", floor: 2 },
  ST: { name: "Symbols/Types Room", floor: 2 },
  QR: { name: "Questions Room", floor: 2 },
  QA: { name: "Q&A Chains Room", floor: 2 },
  NF: { name: "Nature Freestyle", floor: 3 },
  PF: { name: "Personal Freestyle", floor: 3 },
  BF: { name: "Bible Freestyle", floor: 3 },
  HF: { name: "History/Social Freestyle", floor: 3 },
  LR: { name: "Listening Room", floor: 3 },
  CR: { name: "Concentration Room", floor: 4 },
  DR: { name: "Dimensions Room", floor: 4 },
  C6: { name: "Connect-6", floor: 4 },
  TRm: { name: "Theme Room", floor: 4 },
  TZ: { name: "Time Zone", floor: 4 },
  PRm: { name: "Patterns Room", floor: 4 },
  "P||": { name: "Parallels Room", floor: 4 },
  FRt: { name: "Fruit Room", floor: 4 },
  BL: { name: "Blue Room — Sanctuary", floor: 5 },
  PR: { name: "Prophecy Room", floor: 5 },
  FE: { name: "Feasts Room", floor: 5 },
};

export const RoomPrerequisites = ({ rooms, compact = false }: RoomPrerequisitesProps) => {
  const navigate = useNavigate();

  if (rooms.length === 0) return null;

  if (compact) {
    return (
      <div className="flex flex-wrap gap-1">
        {rooms.map((roomTag) => {
          const room = roomNames[roomTag];
          return (
            <Badge key={roomTag} variant="secondary" className="text-xs">
              {roomTag}
              {room && ` - Floor ${room.floor}`}
            </Badge>
          );
        })}
      </div>
    );
  }

  return (
    <Alert className="border-primary/50 bg-primary/5">
      <Building2 className="h-4 w-4" />
      <AlertTitle className="text-sm font-semibold">Palace Rooms Required</AlertTitle>
      <AlertDescription className="space-y-3">
        <p className="text-sm">
          Understanding these rooms will help you excel in this challenge:
        </p>
        <div className="flex flex-wrap gap-2">
          {rooms.map((roomTag) => {
            const room = roomNames[roomTag];
            return (
              <Badge key={roomTag} variant="outline" className="text-xs">
                {roomTag}
                {room && ` - ${room.name} (Floor ${room.floor})`}
              </Badge>
            );
          })}
        </div>
        <Button
          onClick={() => navigate("/palace")}
          variant="link"
          size="sm"
          className="p-0 h-auto text-xs"
        >
          <BookOpen className="h-3 w-3 mr-1" />
          Learn about Palace Rooms
        </Button>
      </AlertDescription>
    </Alert>
  );
};
