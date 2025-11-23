import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAllRoomMasteries } from "@/hooks/useMastery";
import { MasteryBadge } from "./MasteryBadge";
import { Map as MapIcon, TrendingUp, Lock } from "lucide-react";
import { palaceFloors } from "@/data/palaceData";

export const MasteryMap = () => {
  const { data: masteries, isLoading } = useAllRoomMasteries();

  if (isLoading) {
    return <div className="text-center py-8">Loading mastery map...</div>;
  }

  // Create a lookup object for room progress
  const roomProgressMap: Record<string, number> = {};
  masteries?.forEach(m => {
    roomProgressMap[m.room_id] = m.mastery_level;
  });

  // Calculate suggested path based on strengths
  const getSuggestedRooms = () => {
    // Suggest rooms with level 0 or 1 that connect to mastered areas
    const noviceRooms = palaceFloors
      .flatMap(floor => floor.rooms.map(r => ({ ...r, floorNumber: floor.number })))
      .filter(room => {
        const level = roomProgressMap[room.id] || 0;
        return level <= 1;
      })
      .slice(0, 5);
    
    return noviceRooms;
  };

  const suggestedRooms = getSuggestedRooms();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapIcon className="h-5 w-5" />
            Your Mastery Journey
          </CardTitle>
          <CardDescription>
            Visualize your progress through the Palace rooms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {palaceFloors.map((floor) => (
              <div key={floor.number} className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  Floor {floor.number}: {floor.name}
                  <span className="text-sm text-muted-foreground font-normal">
                    ({floor.rooms.filter(r => (roomProgressMap[r.id] || 0) === 5).length}/{floor.rooms.length} mastered)
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {floor.rooms.map((room) => {
                    const level = roomProgressMap[room.id] || 0;
                    const isStarted = level > 0;
                    const isMastered = level === 5;

                    return (
                      <div
                        key={room.id}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          isMastered
                            ? "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-amber-300"
                            : isStarted
                            ? "bg-accent/50 border-primary/30"
                            : "bg-muted/30 border-border"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="font-semibold text-sm mb-1">{room.name}</div>
                            <div className="text-xs text-muted-foreground">{room.tag}</div>
                          </div>
                          {isStarted ? (
                            <MasteryBadge level={level} size="sm" showTitle={false} />
                          ) : (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        {isStarted && (
                          <div className="mt-2">
                            <div className="w-full bg-background/50 rounded-full h-1.5">
                              <div
                                className="bg-primary rounded-full h-1.5 transition-all"
                                style={{ width: `${(level / 5) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Suggested Path */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Suggested Path
          </CardTitle>
          <CardDescription>
            Rooms recommended based on your current progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          {suggestedRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {suggestedRooms.map((room) => {
                const level = roomProgressMap[room.id] || 0;
                return (
                  <div
                    key={room.id}
                    className="p-4 rounded-lg bg-background border-2 border-primary/20"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold">{room.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Floor {room.floorNumber} • {room.tag}
                        </div>
                      </div>
                      {level > 0 && <MasteryBadge level={level} size="sm" showTitle={false} />}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{room.purpose}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Complete your first activities to get personalized recommendations!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
