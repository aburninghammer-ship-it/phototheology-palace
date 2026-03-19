import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { GoalsSurveyModal } from "./GoalsSurveyModal";
import { useGoalsSurvey } from "@/hooks/useGoalsSurvey";

export function GoalsSurveyBanner() {
  const { user } = useAuth();
  const { saveGoals } = useGoalsSurvey();
  const [show, setShow] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    const check = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("goals_survey_completed, preferred_features")
        .eq("id", user.id)
        .single();

      if (cancelled) return;
      // Show if survey not completed and no goals set
      const completed = (data as any)?.goals_survey_completed;
      const hasGoals = (((data as any)?.preferred_features as string[]) ?? []).length > 0;
      if (!completed && !hasGoals) {
        setShow(true);
      }
    };

    check();
    return () => { cancelled = true; };
  }, [user]);

  if (!show) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center gap-3"
        >
          <div className="flex-shrink-0 p-2 rounded-full bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">Personalize your experience</p>
            <p className="text-xs text-muted-foreground">
              Tell us your goals and we'll customize your navigation.
            </p>
          </div>
          <Button size="sm" onClick={() => setModalOpen(true)}>
            Set Goals
          </Button>
          <button
            type="button"
            onClick={() => setShow(false)}
            className="text-muted-foreground hover:text-foreground p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      </AnimatePresence>

      <GoalsSurveyModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onComplete={async (ids) => {
          await saveGoals(ids);
          setShow(false);
        }}
      />
    </>
  );
}
