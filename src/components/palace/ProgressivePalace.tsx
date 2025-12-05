import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight, Lock, CheckCircle, Sparkles, Play, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { palaceFloors } from "@/data/palaceData";
import { useRoomUnlock } from "@/hooks/useRoomUnlock";
import { usePalaceProgress } from "@/hooks/usePalaceProgress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const FLOOR_THEMES = [
  { gradient: "from-violet-600 to-purple-600", icon: "📚", name: "Furnishing" },
  { gradient: "from-blue-600 to-indigo-600", icon: "🔍", name: "Investigation" },
  { gradient: "from-cyan-600 to-teal-600", icon: "⚡", name: "Freestyle" },
  { gradient: "from-emerald-600 to-green-600", icon: "✝️", name: "Next Level" },
  { gradient: "from-amber-600 to-orange-600", icon: "🔭", name: "Vision" },
  { gradient: "from-rose-600 to-pink-600", icon: "🌍", name: "Three Heavens" },
  { gradient: "from-violet-600 to-indigo-600", icon: "🔥", name: "Spiritual" },
  { gradient: "from-yellow-600 to-amber-600", icon: "👑", name: "Master" },
];

interface ProgressivePalaceProps {
  showStartHere?: boolean;
}

export const ProgressivePalace = ({ showStartHere = true }: ProgressivePalaceProps) => {
  const { user } = useAuth();
  const { progressPercentage } = usePalaceProgress();
  
  // Progressive disclosure: only first 2 floors expanded by default for new users
  const [expandedFloors, setExpandedFloors] = useState<number[]>(
    progressPercentage < 10 ? [1, 2] : [1, 2, 3, 4, 5, 6, 7, 8]
  );

  const toggleFloor = (floorNum: number) => {
    setExpandedFloors(prev => 
      prev.includes(floorNum) 
        ? prev.filter(f => f !== floorNum)
        : [...prev, floorNum]
    );
  };

  const expandAll = () => setExpandedFloors([1, 2, 3, 4, 5, 6, 7, 8]);
  const collapseAll = () => setExpandedFloors([]);

  return (
    <div className="space-y-6">
      {/* Start Here Guide for new users */}
      {showStartHere && progressPercentage < 20 && (
        <StartHereGuide />
      )}

      {/* Quick Actions */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={expandAll}>
            Expand All
          </Button>
          <Button variant="ghost" size="sm" onClick={collapseAll}>
            Collapse All
          </Button>
        </div>
        <Badge variant="outline" className="text-sm">
          {progressPercentage}% Complete
        </Badge>
      </div>

      {/* Progressive Floor List */}
      <div className="space-y-3">
        {palaceFloors.map((floor, idx) => {
          const theme = FLOOR_THEMES[idx];
          const isExpanded = expandedFloors.includes(floor.number);
          const isLocked = floor.number > 2 && progressPercentage < (floor.number - 2) * 12;
          
          return (
            <div key={floor.number} className="rounded-xl border border-border overflow-hidden">
              {/* Floor Header */}
              <button
                onClick={() => !isLocked && toggleFloor(floor.number)}
                disabled={isLocked}
                className={cn(
                  "w-full flex items-center justify-between p-4 transition-all",
                  `bg-gradient-to-r ${theme.gradient}`,
                  isLocked && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{theme.icon}</span>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">Floor {floor.number}</span>
                      <span className="text-white/80">•</span>
                      <span className="text-white/90">{floor.name}</span>
                      {isLocked && <Lock className="h-4 w-4 text-white/60" />}
                    </div>
                    <span className="text-white/70 text-sm">{floor.rooms.length} rooms</span>
                  </div>
                </div>
                {!isLocked && (
                  isExpanded 
                    ? <ChevronDown className="h-5 w-5 text-white" />
                    : <ChevronRight className="h-5 w-5 text-white" />
                )}
              </button>

              {/* Rooms Grid */}
              <AnimatePresence>
                {isExpanded && !isLocked && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-card"
                  >
                    <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                      {floor.rooms.map((room) => (
                        <RoomCard
                          key={room.id}
                          room={room}
                          floorNumber={floor.number}
                          gradient={theme.gradient}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Start Here Guide Component
const StartHereGuide = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-background to-accent/10 p-6"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-lg">Start Your Journey Here</h3>
        </div>
        
        <p className="text-muted-foreground mb-4">
          New to Phototheology? Follow this guided path to build your foundation.
        </p>

        <div className="space-y-3">
          <GuidedStep 
            step={1}
            title="Story Room (SR)"
            description="Learn to break stories into memorable beats"
            link="/palace/floor/1/room/sr"
            time="10 min"
          />
          <GuidedStep 
            step={2}
            title="Imagination Room (IR)"
            description="Experience Scripture with all 5 senses"
            link="/palace/floor/1/room/ir"
            time="5 min"
          />
          <GuidedStep 
            step={3}
            title="24FPS Room"
            description="Create visual anchors for each chapter"
            link="/palace/floor/1/room/24fps"
            time="5 min"
          />
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <Button asChild className="w-full gradient-palace">
            <Link to="/palace/floor/1/room/sr">
              <Play className="h-4 w-4 mr-2" />
              Begin with Story Room
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

interface GuidedStepProps {
  step: number;
  title: string;
  description: string;
  link: string;
  time: string;
}

const GuidedStep = ({ step, title, description, link, time }: GuidedStepProps) => (
  <Link
    to={link}
    className="flex items-center gap-3 p-3 rounded-lg bg-card hover:bg-accent/50 transition-colors border border-border"
  >
    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
      {step}
    </div>
    <div className="flex-1">
      <div className="font-medium text-sm">{title}</div>
      <div className="text-xs text-muted-foreground">{description}</div>
    </div>
    <Badge variant="secondary" className="text-xs">{time}</Badge>
  </Link>
);

// Room icons/emojis for visual flair
const roomIcons: Record<string, string> = {
  sr: "📖", ir: "👁️", "24fps": "🎬", br: "🗺️", tr: "🎨", gr: "💎",
  or: "🔍", dc: "🧪", st: "🔗", qr: "❓", qa: "💬",
  nf: "🌿", pf: "🪞", bf: "🧬", hf: "📜", lr: "👂",
  cr: "✝️", dr: "💠", c6: "📚", trm: "🏛️", tz: "⏰", prm: "🎵", "p||": "🪞", frt: "🍇", cec: "👑", r66: "📿",
  bl: "⛪", pr: "🔮", "3a": "👼", fe: "🎊",
  "123h": "☁️", cycles: "🔄", jr: "🍊", math: "🔢",
  frm: "🔥", mr: "🙏", srm: "⚡"
};

// Room Card Component
interface RoomCardProps {
  room: any;
  floorNumber: number;
  gradient: string;
}

const RoomCard = ({ room, floorNumber, gradient }: RoomCardProps) => {
  const { isUnlocked, loading } = useRoomUnlock(floorNumber, room.id);
  const roomIcon = roomIcons[room.id] || "⭐";

  return (
    <Link
      to={`/palace/floor/${floorNumber}/room/${room.id}`}
      className="group relative"
    >
      <div className={cn(
        "aspect-square rounded-lg p-3 transition-all hover:scale-105 overflow-hidden",
        `bg-gradient-to-br ${gradient}`,
        "flex flex-col items-center justify-center text-center relative"
      )}>
        {/* Large background emoji/icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20 text-6xl pointer-events-none">
          {roomIcon}
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <span className="font-bold text-white text-sm mb-1 drop-shadow-md">{room.tag}</span>
          <span className="text-white/90 text-xs leading-tight drop-shadow-sm block">{room.name}</span>
        </div>
        
        {/* Status indicator */}
        <div className="absolute bottom-2 right-2 z-10">
          {loading ? (
            <div className="w-4 h-4 rounded-full bg-gray-500/50 animate-pulse" />
          ) : isUnlocked ? (
            <CheckCircle className="w-4 h-4 text-green-400 drop-shadow-md" />
          ) : (
            <Lock className="w-4 h-4 text-white/50" />
          )}
        </div>
      </div>
    </Link>
  );
};
