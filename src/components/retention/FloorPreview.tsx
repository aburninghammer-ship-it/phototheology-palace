import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FloorPreviewProps {
  floorNumber: number;
  title: string;
  description: string;
  roomPreviews: string[];
  isLocked: boolean;
}

export function FloorPreview({
  floorNumber,
  title,
  description,
  roomPreviews,
  isLocked,
}: FloorPreviewProps) {
  if (!isLocked) return null;

  return (
    <Card className="relative overflow-hidden border-dashed border-2 border-muted-foreground/30">
      {/* Locked overlay */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
        <div className="text-center p-4">
          <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Complete Floor {floorNumber - 1} to unlock
          </p>
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="h-4 w-4 text-muted-foreground" />
            Coming Up: Floor {floorNumber}
          </CardTitle>
          <Badge variant="secondary">Preview</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
        
        <div className="flex flex-wrap gap-2">
          {roomPreviews.map((room, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {room}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Floor data for previews
export const FLOOR_PREVIEWS = [
  {
    floorNumber: 2,
    title: "Investigation Floor",
    description: "Become a detective of Scripture with observation and definition tools.",
    roomPreviews: ["Observation Room", "Def-Com Room", "Symbols/Types Room", "Questions Room"],
  },
  {
    floorNumber: 3,
    title: "Freestyle Floor",
    description: "Train spontaneous Bible thinking through nature, life, and history.",
    roomPreviews: ["Nature Freestyle", "Personal Freestyle", "Bible Freestyle", "History Freestyle"],
  },
  {
    floorNumber: 4,
    title: "Next Level Floor",
    description: "Christ-centered depth with dimensions, themes, and patterns.",
    roomPreviews: ["Concentration Room", "Dimensions Room", "Theme Room", "Patterns Room"],
  },
  {
    floorNumber: 5,
    title: "Vision Floor",
    description: "Prophecy and sanctuary united in God's master plan.",
    roomPreviews: ["Blue Room", "Prophecy Room", "Three Angels Room"],
  },
  {
    floorNumber: 6,
    title: "Three Heavens Floor",
    description: "Cycles of history and cosmic dimensions.",
    roomPreviews: ["8 Cycles", "Three Heavens", "Juice Room"],
  },
  {
    floorNumber: 7,
    title: "Spiritual Floor",
    description: "Devotional engagement through fire, meditation, and speed.",
    roomPreviews: ["Fire Room", "Meditation Room", "Speed Room"],
  },
  {
    floorNumber: 8,
    title: "Master Floor",
    description: "Reflexive Phototheology — the palace is now inside you.",
    roomPreviews: ["Full Integration", "Teaching Mode", "Creation Mode"],
  },
];
