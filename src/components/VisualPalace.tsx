import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRoomUnlock } from "@/hooks/useRoomUnlock";
import { palaceFloors } from "@/data/palaceData";

const floorGradients = [
  "gradient-palace",
  "gradient-royal",
  "gradient-ocean",
  "gradient-forest",
  "gradient-sunset",
  "gradient-warmth",
  "gradient-dreamy",
  "gradient-palace"
];

export const VisualPalace = () => {
  const { user } = useAuth();

  return (
    <div className="relative w-full max-w-7xl mx-auto">
      {/* Palace Structure */}
      <div className="relative flex flex-col-reverse gap-1">
        {palaceFloors.map((floor, floorIndex) => (
          <FloorSection 
            key={floor.number} 
            floor={floor} 
            gradient={floorGradients[floorIndex]}
            user={user}
          />
        ))}
      </div>

      {/* Palace Foundation */}
      <div className="h-8 bg-gradient-to-t from-border to-transparent rounded-b-lg" />
    </div>
  );
};

interface FloorSectionProps {
  floor: any;
  gradient: string;
  user: any;
}

const FloorSection = ({ floor, gradient, user }: FloorSectionProps) => {
  const roomsPerRow = Math.ceil(floor.rooms.length / 2);
  
  return (
    <div className="relative group">
      {/* Floor Header */}
      <div className={`${gradient} p-3 rounded-t-lg border-2 border-border flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <span className="text-white font-bold text-lg">Floor {floor.number}</span>
          <span className="text-white/90 text-sm font-medium">{floor.name}</span>
        </div>
        <span className="text-white/80 text-xs">{floor.rooms.length} rooms</span>
      </div>

      {/* Rooms Grid */}
      <div className="bg-card/50 backdrop-blur-sm border-2 border-t-0 border-border p-4 min-h-[120px]">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {floor.rooms.map((room: any) => (
            <RoomDoor
              key={room.id}
              room={room}
              floorNumber={floor.number}
              gradient={gradient}
              user={user}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface RoomDoorProps {
  room: any;
  floorNumber: number;
  gradient: string;
  user: any;
}

const RoomDoor = ({ room, floorNumber, gradient, user }: RoomDoorProps) => {
  const { isUnlocked, loading } = useRoomUnlock(floorNumber, room.id);

  return (
    <Link
      to={`/palace/floor/${floorNumber}/room/${room.id}`}
      className={`group relative ${!isUnlocked ? 'pointer-events-none' : ''}`}
    >
      <div 
        className={`
          relative aspect-[3/4] rounded-lg border-2 
          transition-all duration-300 cursor-pointer
          ${isUnlocked 
            ? `${gradient} hover:scale-105 hover:shadow-lg` 
            : 'bg-muted border-muted-foreground/20 opacity-60'
          }
        `}
      >
        {/* Door Frame */}
        <div className="absolute inset-2 bg-card/20 rounded-md border border-white/20" />
        
        {/* Door Handle */}
        <div className={`
          absolute left-3 top-1/2 -translate-y-1/2 
          w-2 h-2 rounded-full 
          ${isUnlocked ? 'bg-white/80' : 'bg-muted-foreground/40'}
        `} />

        {/* Lock Indicator */}
        {!isUnlocked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Lock className="h-4 w-4 text-destructive" />
          </div>
        )}

        {/* Room Tag Tooltip */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          <div className="bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-lg border">
            {room.tag}
          </div>
        </div>
      </div>
    </Link>
  );
};
