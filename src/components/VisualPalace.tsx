import { Link } from "react-router-dom";
import { Lock, Sparkles, Eye, Search, Zap, BookOpen, Telescope, Globe, Flame, Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRoomUnlock } from "@/hooks/useRoomUnlock";
import { palaceFloors } from "@/data/palaceData";

// Floor-specific icons and theming
const FLOOR_THEMES = [
  {
    icon: Eye,
    gradient: "from-violet-600 via-purple-600 to-fuchsia-600",
    symbol: "📚",
    tagline: "Build Your Visual Library"
  },
  {
    icon: Search,
    gradient: "from-blue-600 via-indigo-600 to-blue-700",
    symbol: "🔍",
    tagline: "Investigate Every Detail"
  },
  {
    icon: Zap,
    gradient: "from-cyan-600 via-teal-600 to-emerald-600",
    symbol: "⚡",
    tagline: "Connect Scripture to Life"
  },
  {
    icon: BookOpen,
    gradient: "from-emerald-600 via-green-600 to-teal-600",
    symbol: "✝️",
    tagline: "See Christ in Everything"
  },
  {
    icon: Telescope,
    gradient: "from-amber-600 via-orange-600 to-red-600",
    symbol: "🔭",
    tagline: "Unlock Prophecy & Sanctuary"
  },
  {
    icon: Globe,
    gradient: "from-rose-600 via-pink-600 to-red-600",
    symbol: "🌍",
    tagline: "Master Cycles & Horizons"
  },
  {
    icon: Flame,
    gradient: "from-violet-600 via-purple-600 to-indigo-600",
    symbol: "🔥",
    tagline: "Experience Transformation"
  },
  {
    icon: Crown,
    gradient: "from-yellow-600 via-amber-600 to-orange-600",
    symbol: "👑",
    tagline: "Become the Master"
  }
];

export const VisualPalace = () => {
  const { user } = useAuth();

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4">
      {/* Palace Title */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="inline-flex items-center gap-3 mb-4">
          <Sparkles className="h-6 w-6 text-primary" />
          <h2 className="font-cinzel text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            The Eight-Floor Palace
          </h2>
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <p className="font-cormorant text-lg text-muted-foreground italic">
          Master the Art of Phototheology
        </p>
      </div>

      {/* Palace Structure */}
      <div className="relative flex flex-col-reverse gap-6">
        {palaceFloors.map((floor, floorIndex) => {
          const theme = FLOOR_THEMES[floorIndex];
          return (
            <FloorSection 
              key={floor.number} 
              floor={floor} 
              theme={theme}
              user={user}
            />
          );
        })}
      </div>
    </div>
  );
};

interface FloorSectionProps {
  floor: any;
  theme: typeof FLOOR_THEMES[0];
  user: any;
}

const FloorSection = ({ floor, theme, user }: FloorSectionProps) => {
  const Icon = theme.icon;
  
  return (
    <div className="relative group rounded-2xl overflow-hidden border border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Floor Header - Simplified */}
      <div className={`relative bg-gradient-to-r ${theme.gradient} p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Floor number */}
            <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg">
              <span className="font-cinzel text-2xl font-bold text-white">
                {floor.number}
              </span>
            </div>
            
            {/* Floor info */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-white" />
                <span className="font-cinzel text-xl font-bold text-white">
                  {floor.name}
                </span>
              </div>
              <span className="font-cormorant text-white/80 text-sm italic">
                {theme.tagline}
              </span>
            </div>
          </div>
          
          {/* Room count */}
          <div className="px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30">
            <span className="text-white text-sm font-semibold">
              {floor.rooms.length} rooms
            </span>
          </div>
        </div>
      </div>

      {/* Rooms Grid - Simplified */}
      <div className="bg-gradient-to-b from-muted/20 to-background p-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {floor.rooms.map((room: any) => (
            <RoomDoor
              key={room.id}
              room={room}
              floorNumber={floor.number}
              theme={theme}
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
  theme: typeof FLOOR_THEMES[0];
  user: any;
}

const RoomDoor = ({ room, floorNumber, theme, user }: RoomDoorProps) => {
  const { isUnlocked, loading } = useRoomUnlock(floorNumber, room.id);

  return (
    <Link
      to={`/palace/floor/${floorNumber}/room/${room.id}`}
      className={`group relative ${!isUnlocked ? 'pointer-events-none' : ''}`}
    >
      <div className="flex flex-col gap-2">
        {/* Door Card - Clean Design */}
        <div 
          className={`
            relative aspect-[3/4] rounded-xl overflow-hidden
            transition-all duration-300 cursor-pointer
            ${isUnlocked 
              ? `bg-gradient-to-br ${theme.gradient} hover:scale-105 shadow-lg hover:shadow-2xl` 
              : 'bg-gradient-to-br from-muted to-muted-foreground/20 opacity-50'
            }
          `}
        >
          {/* Simple border frame */}
          <div className="absolute inset-4 border border-white/30 rounded-lg" />
          
          {/* Room tag at top */}
          <div className="absolute top-0 left-0 right-0 p-3 flex justify-center">
            <div className="px-3 py-1 rounded-lg bg-black/40 backdrop-blur-sm border border-white/20">
              <span className="font-cinzel text-xs font-bold text-white tracking-wider">
                {room.tag}
              </span>
            </div>
          </div>
          
          {/* Center room name */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="text-center">
              <div className="font-cinzel text-sm font-bold text-white drop-shadow-lg leading-tight">
                {room.name}
              </div>
            </div>
          </div>

          {/* Lock/Unlock indicator */}
          <div className="absolute bottom-3 right-3">
            {isUnlocked ? (
              <div className="w-6 h-6 rounded-full bg-green-500/30 backdrop-blur-sm border border-green-400/50 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-green-400" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-red-500/30 backdrop-blur-sm border border-red-400/50 flex items-center justify-center">
                <Lock className="h-3 w-3 text-red-400" />
              </div>
            )}
          </div>

          {/* Subtle shine on hover */}
          {isUnlocked && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
          )}
        </div>
      </div>
    </Link>
  );
};
