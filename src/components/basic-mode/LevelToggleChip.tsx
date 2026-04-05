/**
 * LevelToggleChip — Shows current experience level as a chip in the header.
 * Clicking opens a modal with descriptions of all 3 levels.
 */
import { useState } from "react";
import { useExperienceMode, type ExperienceMode } from "@/contexts/ExperienceModeContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Zap, Compass, Flame } from "lucide-react";

interface LevelInfo {
  mode: ExperienceMode;
  level: number;
  label: string;
  tagline: string;
  description: string;
  icon: typeof Zap;
  chipColor: string;
  activeGlow: string;
}

const LEVELS: LevelInfo[] = [
  {
    mode: "basic",
    level: 1,
    label: "Basic",
    tagline: "Just give me answers",
    description: "A clean, conversational experience. Ask Jeeves anything about the Bible, access the Study Bible, Audio Commentary, Reading Plans, and Daily Devotionals. The full Phototheology engine works behind the scenes — you just get the insights.",
    icon: Zap,
    chipColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    activeGlow: "ring-emerald-500/30",
  },
  {
    mode: "explorer",
    level: 2,
    label: "Explorer",
    tagline: "Teach me as I go",
    description: "Everything in Basic, plus guided access to Palace rooms and study tools. Phototheology concepts are introduced naturally — you'll learn the method through using it. Perfect for growing deeper.",
    icon: Compass,
    chipColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    activeGlow: "ring-amber-500/30",
  },
  {
    mode: "immersion",
    level: 3,
    label: "Immersion",
    tagline: "Show me everything",
    description: "The full Phototheology Operating System. All 8 Floors, 38+ Rooms, Cycles, Heavens, advanced research tools, VR Palace, and architectural study modes. Built for teachers, scholars, and power users.",
    icon: Flame,
    chipColor: "bg-violet-500/20 text-violet-400 border-violet-500/30",
    activeGlow: "ring-violet-500/30",
  },
];

export function LevelToggleChip() {
  const { mode, setMode } = useExperienceMode();
  const [open, setOpen] = useState(false);

  const current = LEVELS.find(l => l.mode === mode) || LEVELS[0];
  const CurrentIcon = current.icon;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all hover:brightness-125",
          current.chipColor
        )}
      >
        <CurrentIcon className="h-3 w-3" />
        Level {current.level}: {current.label}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[hsl(220,13%,12%)] border-[hsl(220,10%,20%)] text-[hsl(220,10%,90%)] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">Choose Your Level</DialogTitle>
            <DialogDescription className="text-[hsl(220,10%,55%)]">
              Switch anytime. Your progress is saved across all levels.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-2">
            {LEVELS.map((level) => {
              const isActive = mode === level.mode;
              const Icon = level.icon;
              return (
                <button
                  key={level.mode}
                  onClick={() => {
                    setMode(level.mode);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border-2 transition-all",
                    isActive
                      ? `${level.chipColor} ring-2 ${level.activeGlow}`
                      : "border-[hsl(220,10%,20%)] hover:border-[hsl(220,10%,30%)] bg-[hsl(220,13%,10%)]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      isActive ? "bg-white/10" : "bg-[hsl(220,10%,15%)]"
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">Level {level.level}: {level.label}</span>
                        {isActive && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 font-medium">Current</span>
                        )}
                      </div>
                      <span className="text-xs text-[hsl(220,10%,50%)]">{level.tagline}</span>
                    </div>
                  </div>
                  <p className="text-xs text-[hsl(220,10%,55%)] mt-2 leading-relaxed">{level.description}</p>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
