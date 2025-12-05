import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Lock, Sparkles } from "lucide-react";
import { useRoomUnlock } from "@/hooks/useRoomUnlock";
import { Room } from "@/data/palaceData";
import { motion } from "framer-motion";

interface FloorRoomCardProps {
  room: Room;
  floorNumber: number;
  gradient: string;
}

// Room emojis for visual flair
const roomEmojis: Record<string, string> = {
  sr: "📖", ir: "👁️", "24fps": "🎬", br: "🗺️", tr: "🎨", gr: "💎",
  or: "🔍", dc: "🧪", st: "🔗", qr: "❓", qa: "💬",
  nf: "🌿", pf: "🪞", bf: "🧬", hf: "📜", lr: "👂",
  cr: "✝️", dr: "💠", c6: "📚", trm: "🏛️", tz: "⏰", prm: "🎵", "p||": "🪞", frt: "🍇", cec: "👑", r66: "📿",
  bl: "⛪", pr: "🔮", "3a": "👼", fe: "🎊",
  "123h": "☁️", cycles: "🔄", jr: "🍊", math: "🔢",
  frm: "🔥", mr: "🙏", srm: "⚡"
};

// Unique gradients per room for visual distinction
const roomGradients: Record<string, string> = {
  // Floor 1 - Furnishing
  sr: "bg-gradient-to-br from-blue-500 to-blue-700",
  ir: "bg-gradient-to-br from-indigo-500 to-purple-600",
  "24fps": "bg-gradient-to-br from-violet-500 to-fuchsia-600",
  br: "bg-gradient-to-br from-cyan-500 to-blue-600",
  tr: "bg-gradient-to-br from-pink-500 to-rose-600",
  gr: "bg-gradient-to-br from-emerald-400 to-teal-600",
  // Floor 2 - Investigation
  or: "bg-gradient-to-br from-amber-500 to-orange-600",
  dc: "bg-gradient-to-br from-lime-500 to-green-600",
  st: "bg-gradient-to-br from-teal-500 to-cyan-600",
  qr: "bg-gradient-to-br from-yellow-500 to-amber-600",
  qa: "bg-gradient-to-br from-orange-500 to-red-500",
  // Floor 3 - Freestyle
  nf: "bg-gradient-to-br from-green-500 to-emerald-600",
  pf: "bg-gradient-to-br from-slate-500 to-zinc-600",
  bf: "bg-gradient-to-br from-purple-500 to-violet-600",
  hf: "bg-gradient-to-br from-stone-500 to-neutral-600",
  lr: "bg-gradient-to-br from-sky-500 to-blue-600",
  // Floor 4 - Next Level
  cr: "bg-gradient-to-br from-rose-500 to-pink-600",
  dr: "bg-gradient-to-br from-fuchsia-500 to-purple-600",
  c6: "bg-gradient-to-br from-indigo-600 to-blue-700",
  trm: "bg-gradient-to-br from-amber-600 to-yellow-700",
  tz: "bg-gradient-to-br from-cyan-600 to-teal-700",
  prm: "bg-gradient-to-br from-violet-600 to-indigo-700",
  "p||": "bg-gradient-to-br from-emerald-600 to-green-700",
  frt: "bg-gradient-to-br from-purple-500 to-violet-700",
  cec: "bg-gradient-to-br from-yellow-500 to-orange-600",
  r66: "bg-gradient-to-br from-red-500 to-rose-600",
  // Floor 5 - Vision
  bl: "bg-gradient-to-br from-blue-600 to-indigo-700",
  pr: "bg-gradient-to-br from-purple-600 to-fuchsia-700",
  "3a": "bg-gradient-to-br from-sky-600 to-cyan-700",
  fe: "bg-gradient-to-br from-orange-600 to-amber-700",
  // Floor 6 - Three Heavens
  "123h": "bg-gradient-to-br from-slate-600 to-gray-700",
  cycles: "bg-gradient-to-br from-teal-600 to-emerald-700",
  jr: "bg-gradient-to-br from-orange-500 to-yellow-600",
  math: "bg-gradient-to-br from-blue-700 to-indigo-800",
  // Floor 7 - Spiritual
  frm: "bg-gradient-to-br from-red-600 to-orange-700",
  mr: "bg-gradient-to-br from-indigo-700 to-purple-800",
  srm: "bg-gradient-to-br from-yellow-500 to-lime-600",
};

export const FloorRoomCard = ({ room, floorNumber, gradient }: FloorRoomCardProps) => {
  const { isUnlocked, loading } = useRoomUnlock(floorNumber, room.id);
  
  const showLocked = loading || !isUnlocked;
  const roomEmoji = roomEmojis[room.id] || "⭐";
  // Use room-specific gradient if available, otherwise fall back to floor gradient
  const roomGradient = roomGradients[room.id] || gradient;

  return (
    <Link 
      to={`/palace/floor/${floorNumber}/room/${room.id}`}
      className={showLocked ? "pointer-events-none" : ""}
    >
      <motion.div
        whileHover={showLocked ? {} : { scale: 1.02, y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Card variant="glass" className={`group h-full cursor-pointer transition-all duration-500 relative ${showLocked ? 'opacity-60' : ''}`}>
          {/* Animated gradient background overlay */}
          {!showLocked && (
            <div className={`absolute inset-0 ${roomGradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
          )}
          
          {/* Glowing top bar */}
          <div className={`h-1 ${roomGradient} ${!showLocked ? 'group-hover:h-2 group-hover:shadow-glow' : ''} transition-all duration-300`} />
          
          <CardHeader className="relative">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {/* Large emoji icon */}
                  <motion.div 
                    className="text-4xl"
                    animate={!showLocked ? { rotate: [0, -10, 10, 0] } : {}}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    {roomEmoji}
                  </motion.div>
                  
                  <div className="flex flex-col gap-2">
                    {showLocked && (
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-destructive" />
                        <Badge variant="destructive" className="text-xs">
                          {loading ? "Checking..." : "🔒 Locked"}
                        </Badge>
                      </div>
                    )}
                    <Badge className={`${roomGradient} text-white shadow-lg font-mono tracking-wide`}>
                      {room.tag}
                    </Badge>
                  </div>
                </div>
                
                <CardTitle className="text-2xl font-serif mb-2 flex items-center gap-2 group-hover:text-primary transition-colors">
                  {room.name}
                  {!showLocked && (
                    <Sparkles className="h-4 w-4 text-accent opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse" />
                  )}
                </CardTitle>
                
                <CardDescription className="text-base font-medium leading-relaxed">
                  {room.coreQuestion}
                </CardDescription>
              </div>
              
              {/* Animated arrow */}
              <motion.div 
                className={`p-3 rounded-full ${roomGradient} shadow-lg shrink-0`}
                whileHover={{ scale: 1.1, rotate: showLocked ? 0 : 15 }}
              >
                {showLocked ? (
                  <Lock className="h-5 w-5 text-white" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-white" />
                )}
              </motion.div>
            </div>
          </CardHeader>
          
          <CardContent className="relative">
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
              {room.purpose}
            </p>
            
            {/* Glowing bottom indicator */}
            {!showLocked && (
              <div className="flex items-center gap-2 text-xs text-primary font-medium">
                <Sparkles className="h-3 w-3" />
                <span>Click to enter room</span>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
};
