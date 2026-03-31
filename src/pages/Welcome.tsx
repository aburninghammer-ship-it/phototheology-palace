import { SEO } from "@/components/SEO";
import { ContinueWhereYouLeftOff } from "@/components/ContinueWhereYouLeftOff";
import { ReginaldGreeting } from "@/components/ReginaldGreeting";
import { DailyAudioDevotional } from "@/components/DailyAudioDevotional";
import { AudioTourBanner } from "@/components/AudioTourBanner";
import { OsSpacesWelcome } from "@/components/OsSpacesWelcome";

const Welcome = () => {
  return (
    <>
      <SEO 
        title="PhototheologyOS — The Art of Seeing Christ in All Things"
        description="Master the craft of Biblical Intelligence. Study, explore the Memory Palace, refine your craft, and grow as a Phototheologist."
      />
      <div className="px-4 pt-6 space-y-4">
        <ReginaldGreeting />
        <AudioTourBanner />
        <DailyAudioDevotional />
        <ContinueWhereYouLeftOff />
      </div>
      <OsSpacesWelcome />
    </>
  );
};

export default Welcome;
