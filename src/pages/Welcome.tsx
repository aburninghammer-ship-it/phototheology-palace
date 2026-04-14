import { SEO } from "@/components/SEO";
import { ContinueWhereYouLeftOff } from "@/components/ContinueWhereYouLeftOff";
import { ReginaldGreeting } from "@/components/ReginaldGreeting";
import { DailyAudioDevotional } from "@/components/DailyAudioDevotional";
import { OsSpacesWelcome } from "@/components/OsSpacesWelcome";
import { PtGlossaryTable } from "@/components/PtGlossaryTable";
import { UpgradeFloatingCard } from "@/components/UpgradeFloatingCard";
import { WhatsNewTicker } from "@/components/WhatsNewTicker";
import { ExperienceModeSelector } from "@/components/experience-mode";
import { PTSection } from "@/components/experience-mode/PTSection";
import { NewcomerWelcomeBanner } from "@/components/NewcomerWelcomeBanner";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExperienceMode } from "@/contexts/ExperienceModeContext";
import { BasicModeShell } from "@/components/basic-mode/BasicModeShell";
import { FrontPagePodcastPreview } from "@/components/FrontPagePodcastPreview";
import { ExplorerModeShell } from "@/components/explorer-mode/ExplorerModeShell";
import { LoadingScreen } from "@/components/LoadingScreen";

const Welcome = () => {
  const navigate = useNavigate();
  const { isBasic, isExplorer, isLoading } = useExperienceMode();

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Level 1 (Basic) mode: show the ChatGPT-style interface
  if (isBasic) {
    return <BasicModeShell />;
  }

  // Level 2 (Explorer) mode: sidebar with Level 1 tabs + 4 Spaces
  if (isExplorer) {
    return <ExplorerModeShell />;
  }

  return (
    <>
      <SEO 
        title="PhototheologyOS — The Art of Seeing Christ in All Things"
        description="Master the craft of Biblical Intelligence. Study, explore the Memory Palace, refine your craft, and grow as a Phototheologist."
      />

      {/* === EDEN HERO === */}
      <div className="relative overflow-hidden">
        {/* Moving light particles background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="eden-light eden-light-1" />
          <div className="eden-light eden-light-2" />
          <div className="eden-light eden-light-3" />
          <div className="eden-light eden-light-4" />
        </div>

        <div className="relative z-10 text-center px-4 pt-10 pb-6 space-y-4">
          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider leading-tight"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            <span style={{ color: "#d4a017" }}>PHOTOTHEOLOGY</span>
            <span
              className="inline-flex items-center justify-center mx-2 px-2 py-0.5 border rounded text-2xl sm:text-3xl md:text-4xl align-middle"
              style={{
                borderColor: "hsl(var(--muted-foreground) / 0.4)",
                color: "hsl(var(--muted-foreground))",
                fontFamily: "'Cinzel', serif",
              }}
            >
              OS
            </span>
            <span style={{ color: "hsl(var(--foreground))" }}>EDEN</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg sm:text-xl font-bold text-foreground tracking-wide"
          >
            The Choice Is Yours
          </motion.p>

          {/* Phototheology Podcast Episode 1 — visible before entering palace */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}
            className="max-w-lg mx-auto w-full"
          >
            <FrontPagePodcastPreview />
          </motion.div>

          {/* Audio Tour CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <Button
              onClick={() => navigate("/palace/tour")}
              className="rounded-full px-6 py-3 text-base font-semibold gap-2 shadow-lg"
              style={{
                background: "linear-gradient(135deg, #d4a017, #b8860b)",
                color: "#fff",
                border: "1px solid rgba(212, 160, 23, 0.4)",
                boxShadow: "0 0 20px rgba(212, 160, 23, 0.3)",
              }}
            >
              <Headphones className="w-5 h-5" />
              🎙️ Take the Audio Tour
            </Button>
          </motion.div>

          {/* Experience Mode */}
          <ExperienceModeSelector variant="compact" className="justify-center" />
        </div>
      </div>

      {/* === NEWCOMER BANNER (Experience Mode + Bible 101 + Guest House) === */}
      <div className="px-4 space-y-4">
        <NewcomerWelcomeBanner />
        <WhatsNewTicker />
        <ReginaldGreeting />
        <UpgradeFloatingCard />
      </div>

      {/* === SPACES DASHBOARD (Level 3 only) === */}
      <PTSection showIn="immersion">
        <OsSpacesWelcome />
      </PTSection>

      {/* === LOWER CONTENT === */}
      <div className="px-4 space-y-4 pb-6">
        <DailyAudioDevotional />
        <ContinueWhereYouLeftOff />
      </div>

      <PTSection showIn="immersion">
        <PtGlossaryTable />
      </PTSection>
    </>
  );
};

export default Welcome;
