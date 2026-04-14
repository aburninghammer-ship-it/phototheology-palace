/**
 * NewcomerWelcomeBanner — Shows experience mode selector and Bible 101 CTA
 * prominently for new/unauthenticated users and those in Simple mode.
 */
import { motion } from "framer-motion";
import { useExperienceMode } from "@/contexts/ExperienceModeContext";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export function NewcomerWelcomeBanner() {
  const { isSimple, mode } = useExperienceMode();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  // Show for new users or those in simple mode who haven't dismissed
  useEffect(() => {
    const key = `newcomer-banner-dismissed-${user?.id || "anon"}`;
    if (localStorage.getItem(key) === "true") setDismissed(true);
  }, [user]);

  const dismiss = () => {
    const key = `newcomer-banner-dismissed-${user?.id || "anon"}`;
    localStorage.setItem(key, "true");
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* Bible 101 CTA — for new users */}
      {isSimple && (
        <Card className="p-4 border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 shrink-0">
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">New to the Bible?</p>
              <p className="text-xs text-muted-foreground">Start with our 30-day visual journey — no experience needed</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/bible-101")}
              className="shrink-0 gap-1 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
            >
              Bible 101 <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
        </Card>
      )}

      {/* Dismiss */}
      <div className="text-center">
        <button onClick={dismiss} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          Dismiss this guide
        </button>
      </div>
    </motion.div>
  );
}
