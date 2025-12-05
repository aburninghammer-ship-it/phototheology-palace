import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Eye, Search, Zap, BookOpen, Telescope, Globe, Flame, Crown, Lock, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { palaceFloors } from "@/data/palaceData";
import { useRoomUnlock } from "@/hooks/useRoomUnlock";
import { motion } from "framer-motion";
import { toast } from "sonner";

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
          const theme = FLOOR_THEMES[floor.number - 1];
          return (
            <FloorSection 
              key={floor.number} 
              floor={floor} 
              theme={theme}
              user={user}
              index={floorIndex}
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
  index: number;
}

const FloorSection = ({ floor, theme, user, index }: FloorSectionProps) => {
  const Icon = theme.icon;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="relative group rounded-2xl overflow-hidden border-2 border-white/20 shadow-[0_0_40px_-15px] shadow-current bg-card/50 backdrop-blur-sm hover:shadow-[0_0_60px_-10px] transition-all duration-500"
    >
      {/* Floor Header with glass effect */}
      <div className={`relative bg-gradient-to-r ${theme.gradient} p-6`}>
        {/* Animated shine */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%]" style={{ transition: 'transform 0.7s ease-in-out, opacity 0.3s' }} />
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            {/* Floor number with glass effect */}
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
          
          {/* Room count badge */}
          <div className="px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30">
            <span className="text-white text-sm font-semibold">
              {floor.rooms.length} rooms
            </span>
          </div>
        </div>
      </div>

      {/* Rooms Grid with glass background */}
      <div className="bg-gradient-to-b from-background/80 to-background p-8 backdrop-blur-sm">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {floor.rooms.map((room: any, roomIndex: number) => (
            <RoomDoor
              key={room.id}
              room={room}
              floorNumber={floor.number}
              theme={theme}
              user={user}
              index={roomIndex}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

interface RoomDoorProps {
  room: any;
  floorNumber: number;
  theme: typeof FLOOR_THEMES[0];
  user: any;
  index: number;
}

const RoomDoor = ({ room, floorNumber, theme, user, index }: RoomDoorProps) => {
  const { isUnlocked, loading } = useRoomUnlock(floorNumber, room.id);
  const navigate = useNavigate();
  
  const handleClick = (e: React.MouseEvent) => {
    if (loading) {
      e.preventDefault();
      return;
    }
    
    if (!isUnlocked) {
      e.preventDefault();
      toast.error("🔒 Room Locked", {
        description: `Complete the previous floors to unlock Floor ${floorNumber}. Progress through each floor in order to access new rooms.`,
        duration: 4000,
      });
      return;
    }
    
    navigate(`/palace/floor/${floorNumber}/room/${room.id}`);
  };
  
  return (
    <div
      onClick={handleClick}
      className="group/door relative cursor-pointer"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 }}
        className="flex flex-col gap-2"
      >
        {/* Door Card - Glass Design */}
        <div 
          className={`
            relative aspect-[3/4] rounded-xl overflow-hidden
            transition-all duration-300 cursor-pointer
            bg-card/80 backdrop-blur-sm border-2 border-white/20
            hover:scale-105 hover:border-white/40 
            shadow-lg hover:shadow-[0_0_30px_-10px] hover:shadow-current
            group-hover/door:bg-card/90
            ${!isUnlocked && !loading ? 'opacity-60' : ''}
          `}
        >
          {/* Gradient overlay on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-0 group-hover/door:opacity-20 transition-opacity duration-300`} />
          
          {/* Glass frame border */}
          <div className="absolute inset-3 border border-white/20 rounded-lg group-hover/door:border-white/40 transition-colors" />
          
          {/* Room tag at top with gradient */}
          <div className="absolute top-0 left-0 right-0 p-3 flex justify-center">
            <div className={`px-3 py-1 rounded-lg bg-gradient-to-r ${theme.gradient} shadow-lg`}>
              <span className="font-cinzel text-xs font-bold text-white tracking-wider">
                {room.tag}
              </span>
            </div>
          </div>
          
          {/* Center room name */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="text-center">
              <div className="font-cinzel text-sm font-bold text-foreground drop-shadow-lg leading-tight group-hover/door:text-primary transition-colors">
                {room.name}
              </div>
            </div>
          </div>

          {/* Lock/Unlock indicator with glass effect */}
          <div className="absolute bottom-3 right-3">
            {loading ? (
              <div className="w-7 h-7 rounded-full bg-muted/50 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" />
              </div>
            ) : isUnlocked ? (
              <div className="w-7 h-7 rounded-full bg-emerald-500/30 backdrop-blur-sm border border-emerald-400/50 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
            ) : (
              <div className="w-7 h-7 rounded-full bg-amber-500/30 backdrop-blur-sm border border-amber-400/50 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Lock className="w-4 h-4 text-amber-400" />
              </div>
            )}
          </div>

          {/* Shine effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover/door:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
        </div>
      </motion.div>
    </div>
  );
};
