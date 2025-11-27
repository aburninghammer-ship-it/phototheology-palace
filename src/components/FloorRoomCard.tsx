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
  frm: "🔥", mr: "🧘", srm: "⚡"
};

export const FloorRoomCard = ({ room, floorNumber, gradient }: FloorRoomCardProps) => {
  const { isUnlocked, loading } = useRoomUnlock(floorNumber, room.id);
  
  const showLocked = loading || !isUnlocked;
  const roomEmoji = roomEmojis[room.id] || "⭐";

  return (
    <Link 
      to={`/palace/floor/${floorNumber}/room/${room.id}`}
      className={showLocked ? "pointer-events-none" : ""}
    >
      <motion.div
        whileHover={showLocked ? {} : { scale: 1.02, y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Card className={`group h-full cursor-pointer transition-all duration-500 relative overflow-hidden border-2 hover:border-primary/50 ${showLocked ? 'opacity-60' : 'hover:shadow-glow'}`}>
          {/* Animated gradient background overlay */}
          {!showLocked && (
            <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
          )}
          
          {/* Glowing top bar */}
          <div className={`h-1 ${gradient} ${!showLocked ? 'group-hover:h-2 group-hover:shadow-glow' : ''} transition-all duration-300`} />
          
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
                    <Badge className={`${gradient} text-white shadow-lg font-mono tracking-wide`}>
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
                className={`p-3 rounded-full ${gradient} shadow-lg shrink-0`}
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
