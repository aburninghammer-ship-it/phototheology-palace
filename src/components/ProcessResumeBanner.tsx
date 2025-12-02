import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PlayCircle, X } from 'lucide-react';

interface ProcessResumeBannerProps {
  featureName: string;
  stepName: string;
  stepNumber: number;
  totalSteps: number;
  onResume: () => void;
  onDismiss: () => void;
}

export const ProcessResumeBanner = ({
  featureName,
  stepName,
  stepNumber,
  totalSteps,
  onResume,
  onDismiss
}: ProcessResumeBannerProps) => {
  const progress = (stepNumber / totalSteps) * 100;

  return (
    <Alert className="border-primary/50 bg-primary/5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <AlertDescription className="font-medium">
            Continue {featureName}
          </AlertDescription>
          <p className="text-sm text-muted-foreground">
            You were at: {stepName}
          </p>
          <div className="space-y-1">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Step {stepNumber} of {totalSteps}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={onResume} size="sm" className="gap-2">
            <PlayCircle className="h-4 w-4" />
            Resume
          </Button>
          <Button onClick={onDismiss} size="sm" variant="ghost">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Alert>
  );
};
