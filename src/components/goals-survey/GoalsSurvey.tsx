import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GOAL_CATEGORIES } from "@/data/goalCategories";
import { GoalCard } from "./GoalCard";

const MAX_GOALS = 3;

interface GoalsSurveyProps {
  /** Pre-selected goals (for edit mode) */
  initialGoals?: string[];
  onComplete: (selectedGoalIds: string[]) => void | Promise<void>;
  onSkip?: () => void | Promise<void>;
  /** Label for submit button */
  submitLabel?: string;
}

export function GoalsSurvey({
  initialGoals = [],
  onComplete,
  onSkip,
  submitLabel = "Personalize My Experience",
}: GoalsSurveyProps) {
  const [selected, setSelected] = useState<string[]>(initialGoals);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialGoals.length > 0) setSelected(initialGoals);
  }, [initialGoals]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (selected.length === 0) return;
    setSubmitting(true);
    try {
      await onComplete(selected);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <div className="inline-flex p-3 rounded-full bg-primary/10 mb-2">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold">
          What do you want to accomplish?
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Pick up to {MAX_GOALS} goals — we'll personalize your tabs and tools.
        </p>
      </motion.div>

      {/* Counter dots */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: MAX_GOALS }).map((_, i) => (
          <div
            key={i}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
              i < selected.length
                ? "bg-primary scale-110"
                : "bg-muted-foreground/20"
            }`}
          />
        ))}
        <span className="ml-2 text-xs text-muted-foreground">
          {selected.length}/{MAX_GOALS}
        </span>
      </div>

      {/* Card grid: 3 columns on desktop, 2 on mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"
      >
        {GOAL_CATEGORIES.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            selected={selected.includes(goal.id)}
            disabled={selected.length >= MAX_GOALS}
            onToggle={() => toggle(goal.id)}
          />
        ))}
      </motion.div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={selected.length === 0 || submitting}
          className="px-10 py-5 text-base font-semibold"
        >
          {submitting ? "Saving..." : submitLabel}
        </Button>
        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
}
