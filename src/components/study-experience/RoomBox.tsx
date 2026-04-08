import { Check, ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { RoomSubPrinciples, SubPrinciple } from "@/components/mind-map/data/roomSubPrinciples";
import { cn } from "@/lib/utils";

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

  return (
    <div
      className={cn(
        "border-2 rounded-xl bg-card/60 backdrop-blur-sm transition-all duration-300",
        isSuggested
          ? "border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)] animate-pulse"
          : "border-blue-500/40 hover:border-blue-400/60",
        disabled && "opacity-50 pointer-events-none"
      )}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 text-left"
        disabled={disabled}
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{room.roomName}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
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
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
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
