/**
 * ExperienceModeSelector — Toggle between Simple, Guided, and Master modes
 */
import { motion } from "framer-motion";
import { useExperienceMode, type ExperienceMode } from "@/contexts/ExperienceModeContext";
import { Eye, BookOpen, Wrench } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ModeOption {
  mode: ExperienceMode;
  label: string;
  tagline: string;
  description: string;
  icon: typeof Eye;
  color: string;
  bgActive: string;
}

const MODE_OPTIONS: ModeOption[] = [
  {
    mode: "simple",
    label: "Simple",
    tagline: "Just show me insights",
    description: "Clean, action-based experience. No technical terminology — just understanding, application, and discovery.",
    icon: Eye,
    color: "text-emerald-400",
    bgActive: "bg-emerald-500/20 border-emerald-500/50",
  },
  {
    mode: "guided",
    label: "Guided",
    tagline: "Teach me as I go",
    description: "See insights first, then learn the principles behind them. Phototheology concepts are introduced naturally through use.",
    icon: BookOpen,
    color: "text-amber-400",
    bgActive: "bg-amber-500/20 border-amber-500/50",
  },
  {
    mode: "master",
    label: "Master",
    tagline: "Show me everything",
    description: "Full access to all 8 Floors, Rooms, Codes, Cycles, and architectural tools. Built for teachers and advanced students.",
    icon: Wrench,
    color: "text-violet-400",
    bgActive: "bg-violet-500/20 border-violet-500/50",
  },
];

interface ExperienceModeSelectorProps {
  variant?: "full" | "compact";
  className?: string;
}

export function ExperienceModeSelector({ variant = "full", className }: ExperienceModeSelectorProps) {
  const { mode, setMode } = useExperienceMode();

  if (variant === "compact") {
    return (
      <div className={cn("flex gap-1 bg-muted/50 rounded-lg p-1", className)}>
        {MODE_OPTIONS.map((opt) => {
          const isActive = mode === opt.mode;
          const Icon = opt.icon;
          return (
            <button
              key={opt.mode}
              onClick={() => setMode(opt.mode)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                isActive
                  ? `${opt.bgActive} ${opt.color} border`
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {opt.label}
            </button>
          );
        })}
      </div>
    );
  }

  // Full variant
  return (
    <div className={cn("space-y-3", className)}>
      <div>
        <h3 className="text-lg font-semibold text-foreground">Experience Mode</h3>
        <p className="text-sm text-muted-foreground">
          Choose how much of the Phototheology system you want to see
        </p>
      </div>

      <div className="grid gap-3">
        {MODE_OPTIONS.map((opt) => {
          const isActive = mode === opt.mode;
          const Icon = opt.icon;
          return (
            <motion.div key={opt.mode} whileTap={{ scale: 0.98 }}>
              <Card
                onClick={() => setMode(opt.mode)}
                className={cn(
                  "p-4 cursor-pointer border-2 transition-all",
                  isActive
                    ? `${opt.bgActive}`
                    : "border-transparent hover:border-muted-foreground/20"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("mt-0.5 p-2 rounded-lg bg-muted/50", isActive && opt.color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{opt.label}</span>
                      <span className="text-xs text-muted-foreground">— {opt.tagline}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{opt.description}</p>
                  </div>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={cn("w-3 h-3 rounded-full mt-1.5", opt.color.replace("text-", "bg-"))}
                    />
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
