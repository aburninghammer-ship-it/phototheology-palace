import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PlayCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ContinueProcessCardProps {
  featureName: string;
  stepName: string;
  stepNumber: number;
  totalSteps: number;
  lastAccessedAt: string;
  onContinue: () => void;
}

export const ContinueProcessCard = ({
  featureName,
  stepName,
  stepNumber,
  totalSteps,
  lastAccessedAt,
  onContinue
}: ContinueProcessCardProps) => {
  const progress = (stepNumber / totalSteps) * 100;
  const timeAgo = formatDistanceToNow(new Date(lastAccessedAt), { addSuffix: true });

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{featureName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Current step: {stepName}
          </p>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {stepNumber} of {totalSteps} steps complete
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Last accessed {timeAgo}</span>
        </div>

        <Button onClick={onContinue} className="w-full gap-2">
          <PlayCircle className="h-4 w-4" />
          Continue
        </Button>
      </CardContent>
    </Card>
  );
};
