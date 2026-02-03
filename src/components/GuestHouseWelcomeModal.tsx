import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Castle,
  Image,
  Heart,
  Brain,
  Gamepad2,
  Trophy,
  Sparkles,
  ChevronRight,
  Check,
} from "lucide-react";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { GUEST_HOUSE_CONFIG } from "@/config/guestHouseConfig";

interface GuestHouseWelcomeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const featureIcons: Record<string, React.ReactNode> = {
  castle: <Castle className="w-5 h-5" />,
  image: <Image className="w-5 h-5" />,
  heart: <Heart className="w-5 h-5" />,
  brain: <Brain className="w-5 h-5" />,
  gamepad: <Gamepad2 className="w-5 h-5" />,
  trophy: <Trophy className="w-5 h-5" />,
};

export function GuestHouseWelcomeModal({
  open,
  onOpenChange,
}: GuestHouseWelcomeModalProps) {
  const { updatePreference } = useUserPreferences();
  const [selectedMode, setSelectedMode] = useState<"guest_house" | "full_suite" | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleSelectMode = (mode: "guest_house" | "full_suite") => {
    setSelectedMode(mode);
  };

  const handleConfirm = () => {
    if (!selectedMode || isConfirming) return;

    setIsConfirming(true);

    // Update both preferences - suite_mode first, then mark as seen
    // Using a slight delay between updates to prevent race conditions
    updatePreference("suite_mode", selectedMode);
    
    // Small delay to let first update process, then mark as seen and close
    setTimeout(() => {
      updatePreference("has_seen_mode_selector", true);
      onOpenChange(false);
      setIsConfirming(false);
    }, 300);
  };

  const { welcomeMessage } = GUEST_HOUSE_CONFIG;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        {/* Header with warm gradient */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-white">
                {welcomeMessage.title}
              </DialogTitle>
              <DialogDescription className="text-amber-100 mt-1">
                {welcomeMessage.subtitle}
              </DialogDescription>
            </div>
          </div>
          <p className="text-sm text-amber-100/90 mt-3">
            {welcomeMessage.description}
          </p>
        </div>

        {/* Mode Selection */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Guest House Option */}
            <button
              onClick={() => handleSelectMode("guest_house")}
              className={`relative p-5 rounded-xl border-2 text-left transition-all ${
                selectedMode === "guest_house"
                  ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700"
              }`}
            >
              {selectedMode === "guest_house" && (
                <div className="absolute top-3 right-3">
                  <div className="p-1 bg-amber-500 rounded-full">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-800/30 rounded-lg">
                  <Home className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Guest House</h3>
                  <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-800/30 dark:text-amber-300">
                    Recommended for beginners
                  </Badge>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                {welcomeMessage.guestHouseDescription}
              </p>

              {/* Feature list */}
              <div className="grid grid-cols-2 gap-2">
                {welcomeMessage.features.map((feature) => (
                  <div
                    key={feature.label}
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                  >
                    <span className="text-amber-500">
                      {featureIcons[feature.icon]}
                    </span>
                    <span>{feature.label}</span>
                  </div>
                ))}
              </div>
            </button>

            {/* Full Suite Option */}
            <button
              onClick={() => handleSelectMode("full_suite")}
              className={`relative p-5 rounded-xl border-2 text-left transition-all ${
                selectedMode === "full_suite"
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
              }`}
            >
              {selectedMode === "full_suite" && (
                <div className="absolute top-3 right-3">
                  <div className="p-1 bg-purple-500 rounded-full">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-800/30 rounded-lg">
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Full Suite</h3>
                  <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-800/30 dark:text-purple-300">
                    Complete experience
                  </Badge>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                {welcomeMessage.fullSuiteDescription}
              </p>

              {/* Feature highlights */}
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ChevronRight className="w-3 h-3 text-purple-500" />
                  <span>30+ study tools & features</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChevronRight className="w-3 h-3 text-purple-500" />
                  <span>Advanced research tools</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChevronRight className="w-3 h-3 text-purple-500" />
                  <span>Community & courses</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChevronRight className="w-3 h-3 text-purple-500" />
                  <span>Sermon building tools</span>
                </div>
              </div>
            </button>
          </div>

          {/* Confirm button and note */}
          <div className="mt-6 space-y-3">
            <Button
              onClick={handleConfirm}
              disabled={!selectedMode || isConfirming}
              className={`w-full h-12 text-lg font-medium ${
                selectedMode === "guest_house"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                  : selectedMode === "full_suite"
                  ? "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                  : ""
              }`}
            >
              {isConfirming ? (
                "Setting up your experience..."
              ) : selectedMode === "guest_house" ? (
                <>
                  <Home className="w-5 h-5 mr-2" />
                  {welcomeMessage.ctaGuestHouse}
                </>
              ) : selectedMode === "full_suite" ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  {welcomeMessage.ctaFullSuite}
                </>
              ) : (
                "Select an option above"
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              {welcomeMessage.switchAnytime}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
