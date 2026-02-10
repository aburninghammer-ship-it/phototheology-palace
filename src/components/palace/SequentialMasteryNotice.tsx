import { Info, Lock, Unlock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSequentialMastery } from "@/hooks/useSequentialMastery";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface SequentialMasteryNoticeProps {
  floorNumber: number;
  variant?: "compact" | "full";
}

export const SequentialMasteryNotice = ({ 
  floorNumber, 
  variant = "full" 
}: SequentialMasteryNoticeProps) => {
  const { t } = useTranslation();
  const { canMaster, nextFloorToMaster, loading, masteryMessage } = useSequentialMastery(floorNumber);

  if (loading) return null;

  // Floor 1 always shows the welcome message
  if (floorNumber === 1) {
    if (variant === "compact") return null;
    return (
      <Alert className="border-primary/30 bg-primary/5">
        <Unlock className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary">{t('sequentialMastery.welcomeTitle')}</AlertTitle>
        <AlertDescription className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: t('sequentialMastery.welcomeDesc') }} />
      </Alert>
    );
  }

  // If they can master this floor
  if (canMaster) {
    if (variant === "compact") return null;
    return (
      <Alert className="border-emerald-500/30 bg-emerald-500/5">
        <Unlock className="h-4 w-4 text-emerald-500" />
        <AlertTitle className="text-emerald-600 dark:text-emerald-400">{t('sequentialMastery.readyTitle')}</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          {t('sequentialMastery.readyDesc')}
        </AlertDescription>
      </Alert>
    );
  }

  // If they cannot master this floor yet
  if (variant === "compact") {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-sm">
        <Info className="h-4 w-4 text-amber-500 shrink-0" />
        <span className="text-amber-600 dark:text-amber-400">
          {t('sequentialMastery.exploreFreely', { floor: nextFloorToMaster })}
        </span>
      </div>
    );
  }

  return (
    <Alert className="border-amber-500/30 bg-amber-500/5">
      <Info className="h-4 w-4 text-amber-500" />
      <AlertTitle className="text-amber-600 dark:text-amber-400">{t('sequentialMastery.explorationTitle')}</AlertTitle>
      <AlertDescription className="text-muted-foreground space-y-2">
        <p dangerouslySetInnerHTML={{ __html: t('sequentialMastery.explorationDesc1') }} />
        <p className="text-sm">
          {masteryMessage}
        </p>
        <div className="pt-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/palace/floor/${nextFloorToMaster}`}>
              {t('sequentialMastery.goToFloor', { floor: nextFloorToMaster })}
            </Link>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
