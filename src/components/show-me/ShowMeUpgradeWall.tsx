import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ShowMeUpgradeWallProps {
  feature: string;
  onClose: () => void;
}

const featureDescriptions: Record<string, string> = {
  verse: "Full access unlocks unlimited verse breakdowns across every book of the Bible — with layered analysis that reveals what's hidden in the original text.",
  commentary: "Subscribe to hear every chapter of the Bible narrated as an epic cinematic experience — not just Genesis 1.",
  meditation: "Full access unlocks the complete Night Watch library — guided meditations through every season of Scripture.",
  mindmap: "Unlock unlimited mind maps that reveal the hidden connections between any verse, theme, or principle in Scripture.",
  study: "The full Study Bible gives you five dimensions of analysis, cross-references, PT codes, and AI-powered commentary on every verse.",
};

export function ShowMeUpgradeWall({ feature, onClose }: ShowMeUpgradeWallProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-md w-full rounded-2xl bg-card border border-border/30 p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-4 mb-6">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>

          <h2 className="text-2xl font-bold mb-3">
            You've unlocked a glimpse of what this can do.
          </h2>

          <p className="text-muted-foreground mb-8 leading-relaxed">
            {featureDescriptions[feature] || "Subscribe to unlock the full PhototheologyOS experience."}
          </p>

          <div className="flex flex-col gap-3">
            <Button
              size="lg"
              className="w-full gap-2"
              onClick={() => navigate("/auth")}
            >
              Start Free Trial <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => navigate("/pricing")}
            >
              View Plans
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
