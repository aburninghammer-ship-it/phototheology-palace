import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Headphones, Moon, Network, GraduationCap, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ShowMeCard } from "@/components/show-me/ShowMeCard";
import { ShowMeVerseBreakdown } from "@/components/show-me/ShowMeVerseBreakdown";
import { ShowMeEpicCommentary } from "@/components/show-me/ShowMeEpicCommentary";
import { ShowMeNightWatch } from "@/components/show-me/ShowMeNightWatch";
import { ShowMeMindMap } from "@/components/show-me/ShowMeMindMap";
import { ShowMeStudyBible } from "@/components/show-me/ShowMeStudyBible";
import { ShowMeUpgradeWall } from "@/components/show-me/ShowMeUpgradeWall";
import { useShowMeUsage } from "@/hooks/useShowMeUsage";
import { GuidedTourOverlay, primeAudioForTour } from "@/components/guided-tour/GuidedTourOverlay";
import { showMeTourSteps } from "@/components/show-me/ShowMeTourSteps";

type Experience = "verse" | "commentary" | "meditation" | "mindmap" | "study" | null;

export default function ShowMe() {
  const navigate = useNavigate();
  const { canUse, use, getRemaining, isTourSeen, markTourSeen } = useShowMeUsage();

  const [activeExperience, setActiveExperience] = useState<Experience>(null);
  const [upgradeFeature, setUpgradeFeature] = useState<string | null>(null);
  const [showTour, setShowTour] = useState(false);

  // Auto-offer tour on first visit
  useEffect(() => {
    if (!isTourSeen()) {
      const timer = setTimeout(() => {
        primeAudioForTour();
        setShowTour(true);
        markTourSeen();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isTourSeen, markTourSeen]);

  const handleCardClick = (feature: Experience) => {
    if (!feature) return;
    if (canUse(feature)) {
      setActiveExperience(feature);
    } else {
      setUpgradeFeature(feature);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Dark cinematic gradient background */}
      <div className="fixed inset-0 bg-gradient-to-b from-background via-background to-background/90 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 md:py-20">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent leading-tight">
            Don't just read the Bible.
            <br />
            <span className="text-primary">See what's been hidden in plain sight.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose one experience below. In less than a minute, you'll understand the difference.
          </p>
        </motion.div>

        {/* 2x3 Card Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-20"
        >
          <div data-showme-card="verse">
            <ShowMeCard
              icon={BookOpen}
              title="Verse Breakdown"
              description="Type any verse. Watch it unfold — layer by layer."
              accent="violet"
              remaining={getRemaining("verse")}
              canUse={canUse("verse")}
              onClick={() => handleCardClick("verse")}
            />
          </div>
          <div data-showme-card="commentary">
            <ShowMeCard
              icon={Headphones}
              title="Epic Commentary"
              description="Genesis 1 — narrated as a cinematic experience."
              accent="amber"
              remaining={null}
              canUse={canUse("commentary")}
              onClick={() => handleCardClick("commentary")}
            />
          </div>
          <div data-showme-card="meditation">
            <ShowMeCard
              icon={Moon}
              title="Night Watch"
              description="15-minute guided meditation at the foot of the cross."
              accent="indigo"
              remaining={null}
              canUse={canUse("meditation")}
              onClick={() => handleCardClick("meditation")}
            />
          </div>
          <div data-showme-card="mindmap">
            <ShowMeCard
              icon={Network}
              title="Mind Map"
              description="See how one verse connects to the entire Bible."
              accent="emerald"
              remaining={getRemaining("mindmap")}
              canUse={canUse("mindmap")}
              onClick={() => handleCardClick("mindmap")}
            />
          </div>
          <div data-showme-card="study">
            <ShowMeCard
              icon={GraduationCap}
              title="Study Bible"
              description="Five dimensions of analysis on every verse."
              accent="rose"
              remaining={null}
              canUse={canUse("study")}
              onClick={() => handleCardClick("study")}
            />
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
          data-showme-cta
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to go deeper?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            These samples are just the surface. The full PhototheologyOS gives you unlimited access to every tool, every floor, every room.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              className="gap-2"
              onClick={() => navigate("/auth")}
            >
              Start Free Trial <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/pricing")}
            >
              View Plans
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Experience Dialogs */}
      <ShowMeVerseBreakdown
        open={activeExperience === "verse"}
        onOpenChange={(open) => !open && setActiveExperience(null)}
        onUse={() => use("verse")}
      />
      <ShowMeEpicCommentary
        open={activeExperience === "commentary"}
        onOpenChange={(open) => !open && setActiveExperience(null)}
        onUse={() => use("commentary")}
      />
      <ShowMeNightWatch
        open={activeExperience === "meditation"}
        onOpenChange={(open) => !open && setActiveExperience(null)}
        onUse={() => use("meditation")}
      />
      <ShowMeMindMap
        open={activeExperience === "mindmap"}
        onOpenChange={(open) => !open && setActiveExperience(null)}
        onUse={() => use("mindmap")}
      />
      <ShowMeStudyBible
        open={activeExperience === "study"}
        onOpenChange={(open) => !open && setActiveExperience(null)}
        onUse={() => use("study")}
      />

      {/* Upgrade Wall */}
      <AnimatePresence>
        {upgradeFeature && (
          <ShowMeUpgradeWall
            feature={upgradeFeature}
            onClose={() => setUpgradeFeature(null)}
          />
        )}
      </AnimatePresence>

      {/* Guided Tour */}
      {showTour && (
        <GuidedTourOverlay
          steps={showMeTourSteps}
          onClose={() => setShowTour(false)}
          accentColor="primary"
        />
      )}
    </div>
  );
}
