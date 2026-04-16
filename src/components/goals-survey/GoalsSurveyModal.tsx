import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GoalsSurvey } from "./GoalsSurvey";

interface GoalsSurveyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (goalIds: string[]) => void | Promise<void>;
  initialGoals?: string[];
}

export function GoalsSurveyModal({
  open,
  onOpenChange,
  onComplete,
  initialGoals = [],
}: GoalsSurveyModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Goals Survey</DialogTitle>
        </DialogHeader>
        <GoalsSurvey
          initialGoals={initialGoals}
          submitLabel={initialGoals.length > 0 ? "Update My Goals" : "Personalize My Experience"}
          onComplete={async (ids) => {
            await onComplete(ids);
            onOpenChange(false);
          }}
          onSkip={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
