import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronRight, Lock, CheckCircle, Sparkles, Play, BookOpen, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useExperienceMode } from "@/contexts/ExperienceModeContext";
import { useTranslatedPalaceData } from "@/hooks/useTranslatedPalaceData";
import { useRoomUnlock } from "@/hooks/useRoomUnlock";
import { usePalaceProgress } from "@/hooks/usePalaceProgress";
import { useNewlyRenovatedRoom } from "@/hooks/useNewlyRenovatedRoom";
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
  const { t } = useTranslation();
  const { user } = useAuth();
  const { mode } = useExperienceMode();
  const { translatedFloors } = useTranslatedPalaceData();
  const { progressPercentage } = usePalaceProgress();

  /** Is this floor hard-locked by the current experience mode? */
  const isFloorLockedByMode = (floorNum: number): boolean => {
    if (mode === "basic") return true; // All floors locked in basic
    if (mode === "explorer") return floorNum > 3; // Floors 4-8 locked in Explorer
    return false; // Immersion: all open
  };

  const getFloorLockMessage = (floorNum: number): string => {
    if (mode === "basic") return "Upgrade to Explorer to unlock the Palace";
    if (mode === "explorer" && floorNum > 3) return "Complete Floor 3 first, or upgrade to Immersion";
    return "";
  };
  
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
            {t('palace.expandAll', 'Expand All')}
          </Button>
          <Button variant="ghost" size="sm" onClick={collapseAll}>
            {t('palace.collapseAll', 'Collapse All')}
          </Button>
        </div>
        <Badge variant="outline" className="text-sm">
          {t('palace.percentComplete', { percent: progressPercentage })}
        </Badge>
      </div>

      {/* Progressive Floor List */}
      <div className="space-y-3">
        {translatedFloors.map((floor, idx) => {
          const theme = FLOOR_THEMES[idx];
          const modeLocked = isFloorLockedByMode(floor.number);
          const isExpanded = !modeLocked && expandedFloors.includes(floor.number);
          // Soft lock: show warning but allow access
          const hasWarning = !modeLocked && floor.number > 2 && progressPercentage < (floor.number - 2) * 12;

          return (
            <div key={floor.number} className={cn("rounded-xl border border-border overflow-hidden", modeLocked && "opacity-50")}>
              {/* Floor Header */}
              <button
                onClick={modeLocked ? undefined : () => toggleFloor(floor.number)}
                className={cn(
                  "w-full flex items-center justify-between p-4 transition-all",
                  `bg-gradient-to-r ${theme.gradient}`,
                  modeLocked && "cursor-not-allowed"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{theme.icon}</span>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{t('palace.floorNumber', { number: floor.number, defaultValue: `Floor ${floor.number}` })}</span>
                      <span className="text-white/80">•</span>
                      <span className="text-white/90">{floor.name}</span>
                      {modeLocked && (
                        <Lock className="h-4 w-4 text-white/70" />
                      )}
                      {hasWarning && (
                        <span className="text-amber-300 text-xs" title={t('palace.completeEarlierFirst', 'Recommended: complete earlier floors first')}>⚠️</span>
                      )}
                    </div>
                    <span className="text-white/70 text-sm">
                      {modeLocked
                        ? getFloorLockMessage(floor.number)
                        : t('palace.roomsCount', { count: floor.rooms.length, defaultValue: `${floor.rooms.length} rooms` })}
                    </span>
                  </div>
                </div>
                {modeLocked ? (
                  <Lock className="h-5 w-5 text-white/50" />
                ) : isExpanded ? (
                  <ChevronDown className="h-5 w-5 text-white" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-white" />
                )}
              </button>

              {/* Rooms Grid */}
              <AnimatePresence>
                {isExpanded && (
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
  const { t } = useTranslation();
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
          <h3 className="font-bold text-lg">{t('palace.startJourneyHere', 'Start Your Journey Here')}</h3>
        </div>
        
        <p className="text-muted-foreground mb-4">
          {t('palace.newToPhototheology', 'New to Phototheology? Follow this guided path to build your foundation.')}
        </p>

        <div className="space-y-3">
          <GuidedStep 
            step={1}
            title={t('palace.storyRoomSR', 'Story Room (SR)')}
            description={t('palace.storyRoomDesc', 'Learn to break stories into memorable beats')}
            link="/palace/floor/1/room/sr"
            time={t('palace.tenMin', '10 min')}
          />
          <GuidedStep 
            step={2}
            title={t('palace.imaginationRoomIR', 'Imagination Room (IR)')}
            description={t('palace.imaginationRoomDesc', 'Experience Scripture with all 5 senses')}
            link="/palace/floor/1/room/ir"
            time={t('palace.fiveMin', '5 min')}
          />
          <GuidedStep 
            step={3}
            title={t('palace.twentyFourFPSRoom', '24FPS Room')}
            description={t('palace.twentyFourFPSDesc', 'Create visual anchors for each chapter')}
            link="/palace/floor/1/room/24fps"
            time={t('palace.fiveMin', '5 min')}
          />
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <Button asChild className="w-full gradient-palace">
            <Link to="/palace/floor/1/room/sr">
              <Play className="h-4 w-4 mr-2" />
              {t('palace.beginWithStoryRoom', 'Begin with Story Room')}
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

// Import unique room images
// Floor 1 - Furnishing
import srImg from "@/assets/rooms/sr-story-room.jpg";
import irImg from "@/assets/rooms/ir-imagination-room.jpg";
import f24Img from "@/assets/rooms/24fps-room.jpg";
import brImg from "@/assets/rooms/br-bible-rendered.jpg";
import trImg from "@/assets/rooms/tr-translation-room.jpg";
import grImg from "@/assets/rooms/gr-gems-room.jpg";
// Floor 2 - Investigation
import orImg from "@/assets/rooms/or-observation-room.jpg";
import dcImg from "@/assets/rooms/dc-defcom-room.jpg";
import stImg from "@/assets/rooms/st-symbols-room.jpg";
import qrImg from "@/assets/rooms/qr-questions-room.jpg";
import qaImg from "@/assets/rooms/qa-answers-room.jpg";
// Floor 3 - Freestyle
import nfImg from "@/assets/rooms/nf-nature-room.jpg";
import pfImg from "@/assets/rooms/pf-personal-room.jpg";
import bfImg from "@/assets/rooms/bf-bible-freestyle.jpg";
import hfImg from "@/assets/rooms/hf-history-room.jpg";
import lrImg from "@/assets/rooms/lr-listening-room.jpg";
// Floor 4 - Next Level
import crImg from "@/assets/rooms/cr-concentration-room.jpg";
import drImg from "@/assets/rooms/dr-dimensions-room.jpg";
import c6Img from "@/assets/rooms/c6-connect-room.jpg";
import trmImg from "@/assets/rooms/trm-theme-room.jpg";
import tzImg from "@/assets/rooms/tz-timezone-room.jpg";
import prmImg from "@/assets/rooms/prm-patterns-room.jpg";
import pImg from "@/assets/rooms/p-parallels-room.jpg";
import frtImg from "@/assets/rooms/frt-fruit-room.jpg";
import cecImg from "@/assets/rooms/cec-christ-chapter.jpg";
import r66Img from "@/assets/rooms/r66-room.jpg";
// Floor 5 - Vision
import blImg from "@/assets/rooms/bl-sanctuary-room.jpg";
import prImg from "@/assets/rooms/pr-prophecy-room.jpg";
import a3Img from "@/assets/rooms/3a-angels-room.jpg";
import feImg from "@/assets/rooms/fe-feasts-room.jpg";
// Floor 6 - Three Heavens
import h123Img from "@/assets/rooms/123h-heavens-room.jpg";
import cyclesImg from "@/assets/rooms/cycles-room.jpg";
import jrImg from "@/assets/rooms/jr-juice-room.jpg";
import mathImg from "@/assets/rooms/math-room.jpg";
// Floor 7 - Spiritual
import frmImg from "@/assets/rooms/frm-fire-room.jpg";
import mrImg from "@/assets/rooms/mr-meditation-room.jpg";
import srmImg from "@/assets/rooms/srm-speed-room.jpg";
// Floor 8 - Master
import infinityImg from "@/assets/rooms/infinity-room.jpg";
// Fallback
import storyRoomImg from "@/assets/rooms/story-room.jpg";

// Room image mappings by room ID for unique visuals
const roomImageMap: Record<string, string> = {
  // Floor 1
  sr: srImg, ir: irImg, "24fps": f24Img, br: brImg, tr: trImg, gr: grImg,
  // Floor 2
  or: orImg, dc: dcImg, st: stImg, qr: qrImg, qa: qaImg,
  // Floor 3
  nf: nfImg, pf: pfImg, bf: bfImg, hf: hfImg, lr: lrImg,
  // Floor 4
  cr: crImg, dr: drImg, c6: c6Img, trm: trmImg, tz: tzImg, prm: prmImg,
  "p||": pImg, frt: frtImg, cec: cecImg, r66: r66Img,
  // Floor 5
  bl: blImg, pr: prImg, "3a": a3Img, fe: feImg,
  // Floor 6
  "123h": h123Img, cycles: cyclesImg, jr: jrImg, math: mathImg,
  // Floor 7
  frm: frmImg, mr: mrImg, srm: srmImg,
  // Floor 8
  infinity: infinityImg,
};

// Get unique room image by room ID
const getRoomImage = (roomId: string, floorNumber: number): string => {
  return roomImageMap[roomId] || storyRoomImg;
};

// Room Card Component
interface RoomCardProps {
  room: any;
  floorNumber: number;
  gradient: string;
}

const RoomCard = ({ room, floorNumber, gradient }: RoomCardProps) => {
  const { t } = useTranslation();
  const { isUnlocked, loading } = useRoomUnlock(floorNumber, room.id);
  const { isRenovated } = useNewlyRenovatedRoom(room.id);
  const roomImage = getRoomImage(room.id, floorNumber);

  return (
    <Link
      to={`/palace/floor/${floorNumber}/room/${room.id}`}
      className="group relative"
    >
      <div className={cn(
        "aspect-square rounded-xl transition-all hover:scale-105 overflow-hidden",
        "flex flex-col items-end justify-end text-center relative shadow-lg"
      )}>
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${roomImage})` }}
        />

        {/* Gradient overlay for text readability */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
        )} />

        
        {/* Content */}
        <div className="relative z-10 p-3 w-full text-left">
          <span className="inline-block px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold text-xs uppercase tracking-wide shadow-md mb-1">
            {room.tag}
          </span>
          <span className="text-white font-semibold text-sm leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] block">
            {room.name}
          </span>
        </div>
        
        {/* Status indicator */}
        <div className="absolute top-2 right-2 z-10">
          {loading ? (
            <div className="w-5 h-5 rounded-full bg-gray-500/50 animate-pulse" />
          ) : isUnlocked ? (
            <CheckCircle className="w-5 h-5 text-green-400 drop-shadow-lg" />
          ) : (
            <Lock className="w-5 h-5 text-white/70 drop-shadow-lg" />
          )}
        </div>
      </div>
    </Link>
  );
};
