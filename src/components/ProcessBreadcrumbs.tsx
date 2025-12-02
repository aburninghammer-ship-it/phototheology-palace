import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  name: string;
  number: number;
}

interface ProcessBreadcrumbsProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export const ProcessBreadcrumbs = ({
  steps,
  currentStep,
  className
}: ProcessBreadcrumbsProps) => {
  return (
    <nav className={cn('flex items-center justify-center', className)}>
      <ol className="flex items-center space-x-2">
        {steps.map((step, index) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;

          return (
            <li key={step.number} className="flex items-center">
              {index > 0 && (
                <div
                  className={cn(
                    'w-8 h-0.5 mx-2',
                    isCompleted ? 'bg-primary' : 'bg-muted'
                  )}
                />
              )}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors',
                    isCompleted &&
                      'border-primary bg-primary text-primary-foreground',
                    isCurrent &&
                      'border-primary bg-background text-primary',
                    !isCompleted &&
                      !isCurrent &&
                      'border-muted bg-background text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={cn(
                    'mt-1 text-xs',
                    isCurrent ? 'text-primary font-medium' : 'text-muted-foreground'
                  )}
                >
                  {step.name}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
