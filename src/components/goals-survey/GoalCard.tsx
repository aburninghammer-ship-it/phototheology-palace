import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GoalCategory } from "@/data/goalCategories";

interface GoalCardProps {
  goal: GoalCategory;
  selected: boolean;
  disabled: boolean;
  onToggle: () => void;
}

export function GoalCard({ goal, selected, disabled, onToggle }: GoalCardProps) {
  const Icon = goal.icon;

  return (
    <motion.button
      type="button"
      layout
      whileTap={!disabled || selected ? { scale: 0.96 } : undefined}
      onClick={onToggle}
      disabled={disabled && !selected}
      className={cn(
        "relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 sm:p-5 text-center transition-all duration-200 cursor-pointer",
        "bg-card hover:bg-accent/50",
        selected
          ? `bg-gradient-to-br ${goal.gradient.from}/10 ${goal.gradient.to}/10 ${goal.gradient.border} shadow-lg`
          : "border-border/50",
        disabled && !selected && "opacity-40 cursor-not-allowed"
      )}
    >
      {/* Checkmark badge */}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={cn(
            "absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-md",
            goal.gradient.from,
            goal.gradient.to
          )}
        >
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </motion.div>
      )}

      <span className="text-2xl sm:text-3xl">{goal.emoji}</span>

      <div className="flex items-center gap-1.5">
        <Icon className={cn("h-4 w-4", selected ? "text-foreground" : "text-muted-foreground")} />
        <span className="text-sm font-semibold">{goal.label}</span>
      </div>

      <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
        {goal.description}
      </p>
    </motion.button>
  );
}
