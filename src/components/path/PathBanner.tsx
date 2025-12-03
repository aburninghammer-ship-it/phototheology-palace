import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Route, Sparkles } from "lucide-react";
import { usePath } from "@/hooks/usePath";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { PathSelectionWizard } from "./PathSelectionWizard";

export function PathBanner() {
  const { activePath, isLoading } = usePath();
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem("path_banner_dismissed") === "true";
  });
  const [showWizard, setShowWizard] = useState(false);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem("path_banner_dismissed", "true");
  };

  const handleComplete = () => {
    setShowWizard(false);
  };

  // Don't show if loading, has active path, or dismissed
  if (isLoading || activePath || isDismissed) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="relative bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 rounded-lg p-4 mb-6"
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-6 w-6"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex w-12 h-12 rounded-full bg-primary/20 items-center justify-center">
              <Route className="h-6 w-6 text-primary" />
            </div>
            
            <div className="flex-1 pr-8">
              <h3 className="font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                New: Choose Your Learning Path
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Personalize your 2-year Phototheology journey with one of four unique learning styles.
                Jeeves will adapt his teaching to match how you learn best.
              </p>
            </div>

            <Button onClick={() => setShowWizard(true)} className="shrink-0">
              Explore Paths
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>

      <Dialog open={showWizard} onOpenChange={setShowWizard}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <PathSelectionWizard 
            onComplete={handleComplete}
            onCancel={() => setShowWizard(false)}
            showCancel={true}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
