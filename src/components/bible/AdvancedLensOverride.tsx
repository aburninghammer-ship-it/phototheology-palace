import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { ROOM_CODES, getRoomByCode, getRoomsByFloor } from "@/data/canonicalRooms";

interface AdvancedLensOverrideProps {
  aiPrimaryRoom: string;
  currentOverride: string | null;
  onOverride: (roomCode: string | null) => void;
}

export const AdvancedLensOverride = ({
  aiPrimaryRoom,
  currentOverride,
  onOverride,
}: AdvancedLensOverrideProps) => {
  const aiRoom = getRoomByCode(aiPrimaryRoom);
  const overrideRoom = currentOverride ? getRoomByCode(currentOverride) : null;
  const roomsByFloor = getRoomsByFloor();

  return (
    <div className="rounded-lg border p-3 space-y-3 bg-muted/20">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Lens Override
        </span>
        {currentOverride && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs gap-1"
            onClick={() => onOverride(null)}
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs">
        <span className="text-muted-foreground">AI Primary:</span>
        <Badge variant="outline" className="text-xs">
          {aiRoom?.code.toUpperCase() || aiPrimaryRoom.toUpperCase()} — {aiRoom?.name || "Unknown"}
        </Badge>
      </div>

      {currentOverride && overrideRoom && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Your Override:</span>
          <Badge className="text-xs bg-amber-500/20 text-amber-700 border-amber-500/30">
            {overrideRoom.code.toUpperCase()} — {overrideRoom.name}
          </Badge>
        </div>
      )}

      <Select
        value={currentOverride || ""}
        onValueChange={(value) => onOverride(value || null)}
      >
        <SelectTrigger className="h-8 text-xs">
          <SelectValue placeholder="Choose a different primary lens..." />
        </SelectTrigger>
        <SelectContent className="max-h-64">
          {Array.from(roomsByFloor.entries())
            .sort(([a], [b]) => a - b)
            .map(([floor, rooms]) => (
              <div key={floor}>
                <div className="px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/50">
                  Floor {floor} — {rooms[0]?.floorName}
                </div>
                {rooms.map((room) => (
                  <SelectItem key={room.code} value={room.code} className="text-xs">
                    {room.code.toUpperCase()} — {room.name}
                  </SelectItem>
                ))}
              </div>
            ))}
        </SelectContent>
      </Select>

      {currentOverride && (
        <div className="flex items-start gap-2 rounded-md bg-amber-500/10 border border-amber-500/20 p-2">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-snug">
            Override active. The Meaning section stays exegetically neutral;
            Palace Framing reflects your chosen lens.
          </p>
        </div>
      )}
    </div>
  );
};
