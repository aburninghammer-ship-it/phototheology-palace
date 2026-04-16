import { Lock } from "lucide-react";
import { MODE_LABELS, type ExperienceMode } from "@/config/featureRegistry";
import { ExperienceModeSelector } from "./ExperienceModeSelector";

interface UpgradePromptPageProps {
  requiredMode: ExperienceMode;
  featureName?: string;
}

/** Full-page prompt shown when a user deep-links to a mode-restricted route. */
export function UpgradePromptPage({ requiredMode, featureName }: UpgradePromptPageProps) {
  return (
    <div className="min-h-screen gradient-dreamy flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-muted/50 border border-border flex items-center justify-center">
          <Lock className="w-7 h-7 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">
            {featureName ? `${featureName} is locked` : "Feature Locked"}
          </h1>
          <p className="text-muted-foreground">
            This feature requires{" "}
            <span className="font-semibold text-foreground">
              {MODE_LABELS[requiredMode]}
            </span>{" "}
            mode or higher. Switch your experience mode below to unlock it.
          </p>
        </div>

        <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-4">
          <ExperienceModeSelector variant="full" />
        </div>
      </div>
    </div>
  );
}
