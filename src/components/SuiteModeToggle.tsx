import { useState } from "react";
import { Home, Sparkles, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useUserPreferences } from "@/hooks/useUserPreferences";

interface SuiteModeToggleProps {
  variant?: "button" | "menu-item";
  showLabel?: boolean;
  className?: string;
}

export function SuiteModeToggle({
  variant = "menu-item",
  showLabel = true,
  className = "",
}: SuiteModeToggleProps) {
  const { preferences, updatePreference } = useUserPreferences();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isGuestHouse = preferences.suite_mode === "guest_house";
  const targetMode = isGuestHouse ? "full_suite" : "guest_house";

  const handleToggle = () => {
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    updatePreference("suite_mode", targetMode);
    setConfirmOpen(false);
  };

  if (variant === "button") {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          onClick={handleToggle}
          className={`gap-2 ${className}`}
        >
          {isGuestHouse ? (
            <>
              <Sparkles className="w-4 h-4 text-purple-500" />
              {showLabel && "Switch to Full Suite"}
            </>
          ) : (
            <>
              <Home className="w-4 h-4 text-amber-500" />
              {showLabel && "Switch to Guest House"}
            </>
          )}
        </Button>

        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          onConfirm={handleConfirm}
          targetMode={targetMode}
        />
      </>
    );
  }

  // Menu item variant
  return (
    <>
      <button
        onClick={handleToggle}
        className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors ${className}`}
      >
        <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
        <div className="flex-1 text-left">
          <div className="font-medium">
            {isGuestHouse ? "Switch to Full Suite" : "Switch to Guest House"}
          </div>
          <div className="text-xs text-muted-foreground">
            {isGuestHouse
              ? "Unlock 30+ tools & features"
              : "Simplified experience (6 tools)"}
          </div>
        </div>
        {isGuestHouse ? (
          <Sparkles className="w-4 h-4 text-purple-500" />
        ) : (
          <Home className="w-4 h-4 text-amber-500" />
        )}
      </button>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirm}
        targetMode={targetMode}
      />
    </>
  );
}

// Confirmation dialog component
function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  targetMode,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  targetMode: "guest_house" | "full_suite";
}) {
  const isToGuestHouse = targetMode === "guest_house";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                isToGuestHouse
                  ? "bg-amber-100 dark:bg-amber-900/30"
                  : "bg-purple-100 dark:bg-purple-900/30"
              }`}
            >
              {isToGuestHouse ? (
                <Home className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              ) : (
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              )}
            </div>
            <DialogTitle>
              {isToGuestHouse ? "Switch to Guest House?" : "Unlock Full Suite?"}
            </DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            {isToGuestHouse ? (
              <>
                Guest House shows only the essential 6 tools for a focused,
                beginner-friendly experience. Your data and progress will be
                preserved.
              </>
            ) : (
              <>
                The Full Suite unlocks 30+ powerful study tools, research
                features, community access, and more. Ready to explore
                everything?
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className={
              isToGuestHouse
                ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
            }
          >
            {isToGuestHouse ? (
              <>
                <Home className="w-4 h-4 mr-2" />
                Switch to Guest House
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Unlock Full Suite
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Badge component for showing current mode in navigation
export function SuiteModeBadge({ className = "" }: { className?: string }) {
  const { preferences } = useUserPreferences();
  const isGuestHouse = preferences.suite_mode === "guest_house";

  if (!isGuestHouse) return null;

  return (
    <div
      className={`flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-medium ${className}`}
    >
      <Home className="w-3 h-3" />
      <span>Guest House</span>
    </div>
  );
}
