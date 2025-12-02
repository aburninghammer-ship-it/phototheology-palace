import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, ArrowRight, RotateCcw, Plus, X } from "lucide-react";
import { useProcessState } from "@/hooks/useProcessState";
import { useProcessTracking } from "@/contexts/ProcessTrackingContext";
import { formatDistanceToNow } from "date-fns";

interface JeevesContinuityPromptProps {
  feature: string;
  onResume?: () => void;
  onRestart?: () => void;
  onStartNew?: () => void;
  onSkip?: () => void;
}

export const JeevesContinuityPrompt = ({
  feature,
  onResume,
  onRestart,
  onStartNew,
  onSkip,
}: JeevesContinuityPromptProps) => {
  const { processState } = useProcessState();
  const { clearProcess } = useProcessTracking();

  if (!processState?.active_process) return null;

  const isRelevant = processState.active_process.toLowerCase().includes(feature.toLowerCase());
  if (!isRelevant) return null;

  const progressText = processState.process_step && processState.process_total_steps
    ? `Step ${processState.process_step}/${processState.process_total_steps}`
    : "";

  const timeAgo = processState.last_timestamp
    ? formatDistanceToNow(new Date(processState.last_timestamp), { addSuffix: true })
    : "";

  return (
    <Card className="mb-8 border-primary/30 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bot className="h-6 w-6 text-primary" />
          Welcome back to {feature}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Before we begin, you left off in the middle of your last task. Here's where you were:
          </p>
          
          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Task</span>
              <span className="text-sm font-semibold">{processState.active_process}</span>
            </div>
            
            {progressText && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Progress</span>
                <span className="text-sm font-semibold">{progressText}</span>
              </div>
            )}
            
            {processState.notes && (
              <div className="flex items-start gap-2 pt-2 border-t border-border/50">
                <span className="text-sm font-medium text-muted-foreground">Last Step:</span>
                <span className="text-sm flex-1">{processState.notes}</span>
              </div>
            )}
            
            {timeAgo && (
              <p className="text-xs text-muted-foreground pt-2">
                Last activity {timeAgo}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Would you like to:</p>
          <div className="grid grid-cols-2 gap-2">
            {onResume && (
              <Button onClick={onResume} className="gap-2 w-full">
                <ArrowRight className="h-4 w-4" />
                Resume
              </Button>
            )}
            {onRestart && (
              <Button onClick={onRestart} variant="outline" className="gap-2 w-full">
                <RotateCcw className="h-4 w-4" />
                Restart
              </Button>
            )}
            {onStartNew && (
              <Button onClick={onStartNew} variant="outline" className="gap-2 w-full">
                <Plus className="h-4 w-4" />
                Start New
              </Button>
            )}
            {onSkip && (
              <Button onClick={onSkip} variant="ghost" className="gap-2 w-full">
                <X className="h-4 w-4" />
                Skip for Now
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
