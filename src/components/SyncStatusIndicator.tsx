import { useBackgroundSync } from "@/hooks/useBackgroundSync";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export const SyncStatusIndicator = () => {
  const { pendingCount, isSyncing, processSync } = useBackgroundSync();

  if (pendingCount === 0 && !isSyncing) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="fixed bottom-20 right-4 z-40">
            <Badge
              variant={isSyncing ? "default" : pendingCount > 0 ? "secondary" : "outline"}
              className="flex items-center gap-2 py-2 px-3 cursor-pointer"
              onClick={processSync}
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  <span>Syncing...</span>
                </>
              ) : pendingCount > 0 ? (
                <>
                  <AlertCircle className="h-3 w-3" />
                  <span>{pendingCount} pending</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Synced</span>
                </>
              )}
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {isSyncing
            ? "Syncing your data..."
            : pendingCount > 0
            ? `Click to sync ${pendingCount} pending action${pendingCount !== 1 ? 's' : ''}`
            : "All data synced"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
