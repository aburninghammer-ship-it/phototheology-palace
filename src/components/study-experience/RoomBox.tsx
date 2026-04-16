import { Check, ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { RoomSubPrinciples, SubPrinciple } from "@/components/mind-map/data/roomSubPrinciples";
import { cn } from "@/lib/utils";

const ROOM_THEME: Record<string, { border: string; glow: string; text: string; badge: string }> = {
  dr:     { border: "border-violet-400/50",  glow: "shadow-[0_0_18px_-4px_rgba(139,92,246,0.4)]",  text: "text-violet-300",  badge: "bg-violet-500/20 text-violet-300" },
  c6:     { border: "border-blue-400/50",    glow: "shadow-[0_0_18px_-4px_rgba(59,130,246,0.4)]",   text: "text-blue-300",    badge: "bg-blue-500/20 text-blue-300" },
  tz:     { border: "border-cyan-400/50",    glow: "shadow-[0_0_18px_-4px_rgba(34,211,238,0.4)]",   text: "text-cyan-300",    badge: "bg-cyan-500/20 text-cyan-300" },
  cr:     { border: "border-amber-400/50",   glow: "shadow-[0_0_18px_-4px_rgba(251,191,36,0.4)]",   text: "text-amber-300",   badge: "bg-amber-500/20 text-amber-300" },
  bl:     { border: "border-indigo-400/50",  glow: "shadow-[0_0_18px_-4px_rgba(99,102,241,0.4)]",   text: "text-indigo-300",  badge: "bg-indigo-500/20 text-indigo-300" },
  cec:    { border: "border-emerald-400/50", glow: "shadow-[0_0_18px_-4px_rgba(52,211,153,0.4)]",   text: "text-emerald-300", badge: "bg-emerald-500/20 text-emerald-300" },
  ir:     { border: "border-rose-400/50",    glow: "shadow-[0_0_18px_-4px_rgba(251,113,133,0.4)]",  text: "text-rose-300",    badge: "bg-rose-500/20 text-rose-300" },
  or:     { border: "border-orange-400/50",  glow: "shadow-[0_0_18px_-4px_rgba(251,146,60,0.4)]",   text: "text-orange-300",  badge: "bg-orange-500/20 text-orange-300" },
  trm:    { border: "border-pink-400/50",    glow: "shadow-[0_0_18px_-4px_rgba(236,72,153,0.4)]",   text: "text-pink-300",    badge: "bg-pink-500/20 text-pink-300" },
  frt:    { border: "border-lime-400/50",    glow: "shadow-[0_0_18px_-4px_rgba(163,230,53,0.4)]",   text: "text-lime-300",    badge: "bg-lime-500/20 text-lime-300" },
  '3a':   { border: "border-red-400/50",     glow: "shadow-[0_0_18px_-4px_rgba(248,113,113,0.4)]",  text: "text-red-300",     badge: "bg-red-500/20 text-red-300" },
  fe:     { border: "border-yellow-400/50",  glow: "shadow-[0_0_18px_-4px_rgba(250,204,21,0.4)]",   text: "text-yellow-300",  badge: "bg-yellow-500/20 text-yellow-300" },
  '123h': { border: "border-sky-400/50",     glow: "shadow-[0_0_18px_-4px_rgba(56,189,248,0.4)]",   text: "text-sky-300",     badge: "bg-sky-500/20 text-sky-300" },
  cycles: { border: "border-teal-400/50",    glow: "shadow-[0_0_18px_-4px_rgba(45,212,191,0.4)]",   text: "text-teal-300",    badge: "bg-teal-500/20 text-teal-300" },
  frm:    { border: "border-orange-500/50",  glow: "shadow-[0_0_18px_-4px_rgba(249,115,22,0.4)]",   text: "text-orange-300",  badge: "bg-orange-500/20 text-orange-300" },
  mr:     { border: "border-purple-400/50",  glow: "shadow-[0_0_18px_-4px_rgba(192,132,252,0.4)]",  text: "text-purple-300",  badge: "bg-purple-500/20 text-purple-300" },
  srm:    { border: "border-fuchsia-400/50", glow: "shadow-[0_0_18px_-4px_rgba(232,121,249,0.4)]",  text: "text-fuchsia-300", badge: "bg-fuchsia-500/20 text-fuchsia-300" },
};

const DEFAULT_THEME = { border: "border-blue-400/50", glow: "shadow-[0_0_18px_-4px_rgba(59,130,246,0.4)]", text: "text-blue-300", badge: "bg-blue-500/20 text-blue-300" };

interface RoomBoxProps {
  room: RoomSubPrinciples;
  floor: number;
  expanded: boolean;
  onToggle: () => void;
  onPrincipleClick: (principle: SubPrinciple) => void;
  usedPrinciples: Set<string>;
  loadingPrinciple: string | null;
  suggestedPrinciple?: string | null;
  disabled: boolean;
}

export function RoomBox({
  room,
  floor,
  expanded,
  onToggle,
  onPrincipleClick,
  usedPrinciples,
  loadingPrinciple,
  suggestedPrinciple,
  disabled,
}: RoomBoxProps) {
  const isSuggested = suggestedPrinciple && room.subPrinciples.some((p) => p.id === suggestedPrinciple);
  const theme = ROOM_THEME[room.roomId] || DEFAULT_THEME;

  return (
    <div
      className={cn(
        "border rounded-xl bg-card/30 backdrop-blur-xl transition-all duration-300 ring-1 ring-white/5",
        theme.border,
        theme.glow,
        isSuggested
          ? "animate-pulse"
          : "hover:scale-[1.01]",
        disabled && "opacity-50 pointer-events-none"
      )}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 text-left"
        disabled={disabled}
      >
        <div className="flex items-center gap-2">
          <span className={cn("font-semibold text-sm", theme.text)}>{room.roomName}</span>
          <span className={cn("text-[10px] px-1.5 py-0.5 rounded", theme.badge)}>
            F{floor}
          </span>
        </div>
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0, overflow: "hidden" }}
            animate={{ height: "auto", opacity: 1, overflow: "visible" }}
            exit={{ height: 0, opacity: 0, overflow: "hidden" }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-3 pb-3 space-y-1">
              {room.subPrinciples.map((p, i) => {
                const isUsed = usedPrinciples.has(p.id);
                const isLoading = loadingPrinciple === p.id;
                const isSuggestedItem = suggestedPrinciple === p.id;

                return (
                  <button
                    key={p.id}
                    onClick={() => onPrincipleClick(p)}
                    disabled={isLoading}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors text-left",
                      isSuggestedItem
                        ? "bg-blue-500/20 text-blue-300 ring-1 ring-blue-400/50"
                        : isUsed
                          ? "bg-green-500/10 text-green-400"
                          : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span className="text-xs text-muted-foreground w-4">{i + 1}.</span>
                    <span className="flex-1">{p.name}</span>
                    {isUsed && <Check className="w-3.5 h-3.5 text-green-400" />}
                    {isLoading && (
                      <div className="w-3.5 h-3.5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
