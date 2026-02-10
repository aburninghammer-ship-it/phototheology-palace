import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Sparkles, Lock } from "lucide-react";
import { Room } from "@/data/palaceData";
import { motion } from "framer-motion";
import { usePalaceTranslation } from "@/hooks/usePalaceTranslation";

interface FloorRoomCardProps {
  room: Room;
  floorNumber: number;
  gradient: string;
}

const roomEmojis: Record<string, string> = {
  sr: "📖", ir: "👁️", "24fps": "🎬", br: "🗺️", tr: "🎨", gr: "💎",
  or: "🔍", dc: "🧪", st: "🔗", qr: "❓", qa: "💬",
  nf: "🌿", pf: "🪞", bf: "🧬", hf: "📜", lr: "👂",
  cr: "✝️", dr: "💠", c6: "📚", trm: "🏛️", tz: "⏰", prm: "🎵", "p||": "🪞", frt: "🍇", cec: "👑", r66: "📿",
  bl: "⛪", pr: "🔮", "3a": "👼", fe: "🎊",
  "123h": "☁️", cycles: "🔄", jr: "🍊", math: "🔢",
  frm: "🔥", mr: "🙏", srm: "⚡",
  infinity: "♾️", freestyle: "✨"
};

const NEWLY_RENOVATED_ROOMS = new Set([
  "sr",
  "24fps",
  "gr",
  "st",
  "qa",
  "hf",
  "nf",
  "trm",
  "p||",
  "cec",
  "bl",
  "pr",
  "fe",
  "123h",
  "cycles",
  "math",
]);

const roomGradients: Record<string, string> = {
  sr: "bg-gradient-to-br from-blue-500 to-blue-700",
  ir: "bg-gradient-to-br from-indigo-500 to-purple-600",
  "24fps": "bg-gradient-to-br from-violet-500 to-fuchsia-600",
  br: "bg-gradient-to-br from-cyan-500 to-blue-600",
  tr: "bg-gradient-to-br from-pink-500 to-rose-600",
  gr: "bg-gradient-to-br from-emerald-400 to-teal-600",
  or: "bg-gradient-to-br from-amber-500 to-orange-600",
  dc: "bg-gradient-to-br from-lime-500 to-green-600",
  st: "bg-gradient-to-br from-teal-500 to-cyan-600",
  qr: "bg-gradient-to-br from-yellow-500 to-amber-600",
  qa: "bg-gradient-to-br from-orange-500 to-red-500",
  nf: "bg-gradient-to-br from-green-500 to-emerald-600",
  pf: "bg-gradient-to-br from-slate-500 to-zinc-600",
  bf: "bg-gradient-to-br from-purple-500 to-violet-600",
  hf: "bg-gradient-to-br from-stone-500 to-neutral-600",
  lr: "bg-gradient-to-br from-sky-500 to-blue-600",
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
  bl: "bg-gradient-to-br from-blue-600 to-indigo-700",
  pr: "bg-gradient-to-br from-purple-600 to-fuchsia-700",
  "3a": "bg-gradient-to-br from-sky-600 to-cyan-700",
  fe: "bg-gradient-to-br from-orange-600 to-amber-700",
  "123h": "bg-gradient-to-br from-slate-600 to-gray-700",
  cycles: "bg-gradient-to-br from-teal-600 to-emerald-700",
  jr: "bg-gradient-to-br from-orange-500 to-yellow-600",
  math: "bg-gradient-to-br from-blue-700 to-indigo-800",
  frm: "bg-gradient-to-br from-red-600 to-orange-700",
  mr: "bg-gradient-to-br from-indigo-700 to-purple-800",
  srm: "bg-gradient-to-br from-yellow-500 to-lime-600",
  infinity: "bg-gradient-to-br from-slate-700 to-zinc-900",
  freestyle: "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500",
};

export const FloorRoomCard = ({ room, floorNumber, gradient }: FloorRoomCardProps) => {
  const { t } = useTranslation();
  const { translateRoom } = usePalaceTranslation();
  const navigate = useNavigate();
  const tr = translateRoom(room);

  const showLocked = false;
  const roomEmoji = roomEmojis[room.id] || "⭐";
  const roomGradient = roomGradients[room.id] || gradient;
  const isNewlyRenovated = NEWLY_RENOVATED_ROOMS.has(room.id);

  const handleClick = () => {
    if (room.id === "freestyle") {
      navigate("/palace/freestyle");
    } else {
      navigate(`/palace/floor/${floorNumber}/room/${room.id}`);
    }
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <motion.div
        whileHover={showLocked ? {} : { scale: 1.02, y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Card variant="glass" className={`group h-full cursor-pointer transition-all duration-500 relative ${showLocked ? 'opacity-60' : ''}`}>
          {!showLocked && (
            <div className={`absolute inset-0 ${roomGradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
          )}

          <div className={`h-1 ${roomGradient} ${!showLocked ? 'group-hover:h-2 group-hover:shadow-glow' : ''} transition-all duration-300`} />

          <CardHeader className="relative">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
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
                          {t('floorRoomCard.locked')}
                        </Badge>
                      </div>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={`${roomGradient} text-white shadow-lg font-mono tracking-wide`}>
                        {room.tag}
                      </Badge>
                      {isNewlyRenovated && (
                        <Badge
                          className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-amber-900 shadow-lg text-xs font-bold animate-pulse border-2 border-amber-500"
                        >
                          {t('floorRoomCard.newlyRenovated')}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <CardTitle className="text-2xl font-serif mb-2 flex items-center gap-2 group-hover:text-primary transition-colors">
                  {tr.name}
                  {!showLocked && (
                    <Sparkles className="h-4 w-4 text-accent opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse" />
                  )}
                </CardTitle>

                <CardDescription className="text-base font-medium leading-relaxed">
                  {tr.coreQuestion}
                </CardDescription>
              </div>

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
              {tr.purpose}
            </p>

            {!showLocked && (
              <div className="flex items-center gap-2 text-xs text-primary font-medium">
                <Sparkles className="h-3 w-3" />
                <span>{t('floorRoomCard.clickToEnter')}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
