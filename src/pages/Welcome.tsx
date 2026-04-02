import { SEO } from "@/components/SEO";
import { ContinueWhereYouLeftOff } from "@/components/ContinueWhereYouLeftOff";
import { ReginaldGreeting } from "@/components/ReginaldGreeting";

import { AudioTourBanner } from "@/components/AudioTourBanner";
import { OsSpacesWelcome } from "@/components/OsSpacesWelcome";
import { PtGlossaryTable } from "@/components/PtGlossaryTable";
import { UpgradeFloatingCard } from "@/components/UpgradeFloatingCard";

const Welcome = () => {
  return (
    <>
      <SEO 
        title="PhototheologyOS — The Art of Seeing Christ in All Things"
        description="Master the craft of Biblical Intelligence. Study, explore the Memory Palace, refine your craft, and grow as a Phototheologist."
      />
      <div className="px-4 pt-6 space-y-4">
        <ReginaldGreeting />
        <UpgradeFloatingCard />
        <AudioTourBanner />
        
        <ContinueWhereYouLeftOff />
      </div>
      <OsSpacesWelcome />
      <PtGlossaryTable />
    </>
  );
};

export default Welcome;
