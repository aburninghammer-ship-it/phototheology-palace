import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle } from "lucide-react";

interface BreadcrumbProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabel?: string;
  onStepClick?: (step: number) => void;
  completedSteps?: number[];
}

export const BreadcrumbProgress = ({
  currentStep,
  totalSteps,
  stepLabel,
  onStepClick,
  completedSteps = [],
}: BreadcrumbProgressProps) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Progress</p>
          <p className="font-semibold">
            Step {currentStep} of {totalSteps}
            {stepLabel && ` • ${stepLabel}`}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{Math.round(progressPercentage)}%</p>
          <p className="text-xs text-muted-foreground">Complete</p>
        </div>
      </div>
      
      <Progress value={progressPercentage} className="h-2" />

      {totalSteps <= 10 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
            const isCompleted = completedSteps.includes(step) || step < currentStep;
            const isCurrent = step === currentStep;
            
            return (
              <button
                key={step}
                onClick={() => onStepClick?.(step)}
                disabled={!onStepClick || (!isCompleted && !isCurrent)}
                className={`flex items-center justify-center min-w-[40px] h-10 rounded-lg border-2 transition-all ${
                  isCurrent
                    ? "border-primary bg-primary/10 text-primary"
                    : isCompleted
                    ? "border-green-500 bg-green-500/10 text-green-500"
                    : "border-muted bg-muted/30 text-muted-foreground"
                } ${onStepClick && (isCompleted || isCurrent) ? "hover:scale-105 cursor-pointer" : "cursor-default"}`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : isCurrent ? (
                  <Circle className="h-5 w-5 fill-current" />
                ) : (
                  <span className="text-sm font-medium">{step}</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
