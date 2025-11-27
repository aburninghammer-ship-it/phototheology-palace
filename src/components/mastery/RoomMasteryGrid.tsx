import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAllRoomMasteries, RoomMastery } from "@/hooks/useMastery";
import { palaceFloors } from "@/data/palaceData";
import { Link } from "react-router-dom";
import { Target, Star, Lock, ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const MASTERY_COLORS = {
  1: { bg: "bg-slate-500/20", border: "border-slate-500/30", text: "text-slate-500" },
  2: { bg: "bg-blue-500/20", border: "border-blue-500/30", text: "text-blue-500" },
  3: { bg: "bg-purple-500/20", border: "border-purple-500/30", text: "text-purple-500" },
  4: { bg: "bg-amber-500/20", border: "border-amber-500/30", text: "text-amber-500" },
  5: { bg: "bg-gradient-to-r from-amber-400/20 to-yellow-300/20", border: "border-yellow-500/50", text: "text-yellow-500" },
};

const LEVEL_NAMES = ["", "Novice", "Apprentice", "Practitioner", "Expert", "Master"];

interface RoomMasteryGridProps {
  filterFloor?: number;
  showTrainButton?: boolean;
}

export const RoomMasteryGrid: React.FC<RoomMasteryGridProps> = ({ 
  filterFloor,
  showTrainButton = true 
}) => {
  const { data: masteries, isLoading } = useAllRoomMasteries();

  const getMasteryForRoom = (roomId: string): RoomMastery | undefined => {
    return masteries?.find(m => m.room_id === roomId);
  };

  const getProgressPercentage = (mastery: RoomMastery | undefined): number => {
    if (!mastery || mastery.mastery_level === 5) return mastery?.mastery_level === 5 ? 100 : 0;
    return Math.min((mastery.xp_current / mastery.xp_required) * 100, 100);
  };

  const floors = filterFloor 
    ? palaceFloors.filter(f => f.number === filterFloor)
    : palaceFloors;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Loading room mastery data...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {floors.map((floor) => (
        <Card key={floor.number} className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg font-bold">Floor {floor.number}</span>
              <Badge variant="outline">{floor.name}</Badge>
            </CardTitle>
            <CardDescription>{floor.subtitle}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {floor.rooms.map((room) => {
                const mastery = getMasteryForRoom(room.id);
                const level = mastery?.mastery_level || 0;
                const progress = getProgressPercentage(mastery);
                const colors = level > 0 
                  ? MASTERY_COLORS[level as keyof typeof MASTERY_COLORS] 
                  : { bg: "bg-muted/50", border: "border-border", text: "text-muted-foreground" };

                return (
                  <div
                    key={room.id}
                    className={cn(
                      "rounded-lg border-2 p-3 transition-all hover:shadow-md",
                      colors.bg,
                      colors.border
                    )}
                  >
                    {/* Room Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs font-mono">
                            {room.tag}
                          </Badge>
                          {level === 5 && (
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                        <h4 className="font-semibold text-sm mt-1 truncate">{room.name}</h4>
                      </div>
                      {level > 0 && (
                        <Badge className={cn("text-xs", colors.text, "bg-background/80")}>
                          L{level}
                        </Badge>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className={level > 0 ? colors.text : "text-muted-foreground"}>
                          {level > 0 ? LEVEL_NAMES[level] : "Not Started"}
                        </span>
                        {mastery && level < 5 && (
                          <span className="text-muted-foreground">
                            {mastery.xp_current}/{mastery.xp_required} XP
                          </span>
                        )}
                      </div>
                      <Progress 
                        value={progress} 
                        className={cn("h-1.5", level === 5 && "bg-yellow-200")}
                      />
                    </div>

                    {/* Stats */}
                    {mastery && (
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                        <span>{mastery.total_drills_completed} drills</span>
                        <span>{mastery.total_exercises_completed} exercises</span>
                      </div>
                    )}

                    {/* Train Button */}
                    {showTrainButton && (
                      <Button
                        asChild
                        size="sm"
                        variant={level > 0 ? "default" : "outline"}
                        className="w-full mt-1"
                      >
                        <Link to={`/palace/floor/${floor.number}/room/${room.id}`}>
                          <Zap className="h-3 w-3 mr-1" />
                          {level > 0 ? "Continue Training" : "Start Training"}
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </Link>
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};