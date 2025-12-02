import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";
import { useProcessState } from "@/hooks/useProcessState";
import { useProcessTracking } from "@/contexts/ProcessTrackingContext";
import { formatDistanceToNow } from "date-fns";

interface ResumeBannerProps {
  currentFeature: string;
  onResume?: () => void;
  onStartNew?: () => void;
}

export const ResumeBanner = ({ currentFeature, onResume, onStartNew }: ResumeBannerProps) => {
  const { processState } = useProcessState();
  const { clearProcess } = useProcessTracking();

  if (!processState?.active_process) return null;
  
  // Check if the active process is relevant to current feature
  const isRelevant = processState.active_process.toLowerCase().includes(currentFeature.toLowerCase());
  if (!isRelevant) return null;

  const progressText = processState.process_step && processState.process_total_steps
    ? `Step ${processState.process_step} of ${processState.process_total_steps}`
    : "In Progress";

  const timeAgo = processState.last_timestamp
    ? formatDistanceToNow(new Date(processState.last_timestamp), { addSuffix: true })
    : "";

  return (
    <Card className="mb-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Resume Your Last Session
              </span>
              {timeAgo && (
                <span className="text-xs text-muted-foreground">• {timeAgo}</span>
              )}
            </div>
            <p className="font-semibold text-lg">{processState.active_process}</p>
            <p className="text-sm text-muted-foreground">{progressText}</p>
            {processState.notes && (
              <p className="text-sm text-muted-foreground italic">{processState.notes}</p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {onResume && (
              <Button onClick={onResume} className="gap-2">
                Resume
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
            {onStartNew && (
              <Button onClick={onStartNew} variant="outline">
                Start New
              </Button>
            )}
            <Button
              onClick={clearProcess}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
