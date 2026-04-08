import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Headphones, Moon, Network, GraduationCap, ArrowRight, ArrowLeft, Film, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ShowMeCard } from "@/components/show-me/ShowMeCard";
import { ShowMeVerseBreakdown } from "@/components/show-me/ShowMeVerseBreakdown";
import { ShowMeEpicCommentary } from "@/components/show-me/ShowMeEpicCommentary";
import { ShowMeNightWatch } from "@/components/show-me/ShowMeNightWatch";
import { ShowMeMindMap } from "@/components/show-me/ShowMeMindMap";
import { ShowMeStudyBible } from "@/components/show-me/ShowMeStudyBible";
import { ShowMe24FPS } from "@/components/show-me/ShowMe24FPS";
import { ShowMeUpgradeWall } from "@/components/show-me/ShowMeUpgradeWall";
import { useShowMeUsage } from "@/hooks/useShowMeUsage";
import { useAuth } from "@/hooks/useAuth";
import { GuidedTourOverlay, primeAudioForTour } from "@/components/guided-tour/GuidedTourOverlay";
import { showMeTourSteps } from "@/components/show-me/ShowMeTourSteps";
import type { Feature } from "@/hooks/useShowMeUsage";

type Experience = "verse" | "commentary" | "meditation" | "mindmap" | "study" | "fps" | "study-experience" | null;

export default function ShowMe() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    canUse, use, getRemaining, saveResult, getSavedResults, hasSavedResults,
    isTourSeen, markTourSeen,
  } = useShowMeUsage();

  const [activeExperience, setActiveExperience] = useState<Experience>(null);
  const [reviewMode, setReviewMode] = useState(false);
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
    // Study Experience navigates to its own page
    if (feature === "study-experience") {
      if (canUse(feature)) {
        use(feature);
        navigate("/study-experience");
      } else {
        setUpgradeFeature(feature);
      }
      return;
    }
    if (canUse(feature)) {
      setReviewMode(false);
      setActiveExperience(feature);
    } else if (hasSavedResults(feature as Feature)) {
      setReviewMode(true);
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
        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 mb-8"
        >
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-muted-foreground hover:text-foreground"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          {user && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-muted-foreground hover:text-foreground"
              onClick={() => navigate("/pricing")}
            >
              View Plans
            </Button>
          )}
        </motion.div>

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
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-3">
            PhototheologyOS turns Scripture into a living palace of memory, imagination, and discovery — powered by AI, built for biblical intelligence.
          </p>
          <p className="text-sm text-muted-foreground/70 max-w-xl mx-auto">
            Try any demonstration below. Each one showcases a different dimension of the system — from cinematic narration to mind-mapping connections across all 66 books.
          </p>
        </motion.div>

        {/* 2x3 Card Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="rounded-2xl border border-primary/20 bg-card/20 backdrop-blur-xl p-4 md:p-6 mb-20 shadow-[0_0_40px_-8px_hsl(var(--primary)/0.15)] ring-1 ring-white/5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div data-showme-card="verse">
            <ShowMeCard
              icon={BookOpen}
              title="Verse Breakdown"
              description="Type any verse. Watch it unfold — layer by layer."
              accent="violet"
              remaining={getRemaining("verse")}
              canUse={canUse("verse")}
              hasSaved={hasSavedResults("verse")}
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
              hasSaved={hasSavedResults("commentary")}
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
              hasSaved={hasSavedResults("meditation")}
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
              hasSaved={hasSavedResults("mindmap")}
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
              hasSaved={hasSavedResults("study")}
              onClick={() => handleCardClick("study")}
            />
          </div>
          <div data-showme-card="fps">
            <ShowMeCard
              icon={Film}
              title="24 Frames Per Second"
              description="Flip through Genesis 1–24, one image per chapter."
              accent="sky"
              remaining={null}
              canUse={canUse("fps")}
              hasSaved={hasSavedResults("fps")}
              onClick={() => handleCardClick("fps")}
            />
          </div>
          <div data-showme-card="study-experience">
            <ShowMeCard
              icon={Layers}
              title="Study Experience"
              description="Pick a verse, choose rooms and principles — watch layers of understanding unfold."
              accent="sky"
              remaining={null}
              canUse={canUse("study-experience")}
              hasSaved={false}
              onClick={() => handleCardClick("study-experience")}
            />
          </div>
          </div>
        </motion.div>

        {/* Free Tier Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16 rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-md p-6 md:p-8 text-center"
        >
          <h3 className="text-xl font-bold mb-2">✨ Free Forever Plan</h3>
          <p className="text-muted-foreground mb-4 max-w-lg mx-auto text-sm">
            No credit card needed. Get permanent access to the Bible Reader, Daily Verse, Morning & Night Watch, Floor 1 rooms, achievements, and more.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(user ? "/pricing" : "/auth")}
          >
            {user ? "See What's Included" : "Create Free Account"}
          </Button>
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
              onClick={() => navigate(user ? "/pricing" : "/auth")}
            >
              {user ? "Upgrade Now" : "Start Free Trial"} <ArrowRight className="h-4 w-4" />
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
        onSave={(label, data) => saveResult("verse", label, data)}
        savedResults={getSavedResults("verse")}
        reviewOnly={reviewMode && !canUse("verse")}
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
      <ShowMe24FPS
        open={activeExperience === "fps"}
        onOpenChange={(open) => !open && setActiveExperience(null)}
        onUse={() => use("fps")}
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
