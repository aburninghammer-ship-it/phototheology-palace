import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Lock } from "lucide-react";
import { useRoomUnlock } from "@/hooks/useRoomUnlock";
import { Room } from "@/data/palaceData";

interface FloorRoomCardProps {
  room: Room;
  floorNumber: number;
  gradient: string;
}

export const FloorRoomCard = ({ room, floorNumber, gradient }: FloorRoomCardProps) => {
  const { isUnlocked, loading } = useRoomUnlock(floorNumber, room.id);
  
  // Show locked appearance during loading to prevent flash
  const showLocked = loading || !isUnlocked;

  return (
    <Link 
      to={`/palace/floor/${floorNumber}/room/${room.id}`}
      className={showLocked ? "pointer-events-none" : ""}
    >
      <Card className={`group hover-lift h-full cursor-pointer transition-all duration-300 ${showLocked ? 'opacity-60' : ''}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                {showLocked && (
                  <Lock className="h-4 w-4 text-destructive" />
                )}
                <Badge className={`${gradient} text-white`}>
                  {room.tag}
                </Badge>
                {showLocked && (
                  <Badge variant="destructive" className="text-xs">
                    {loading ? "Checking..." : "Locked"}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl mb-2">{room.name}</CardTitle>
              <CardDescription className="text-sm">
                {room.coreQuestion}
              </CardDescription>
            </div>
            <div className={`p-2 rounded-full ${gradient}`}>
              {showLocked ? (
                <Lock className="h-4 w-4 text-white" />
              ) : (
                <ChevronRight className="h-4 w-4 text-white" />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {room.purpose}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};
