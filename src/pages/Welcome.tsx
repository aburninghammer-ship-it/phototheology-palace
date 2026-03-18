import { WelcomeActionScreen } from "@/components/WelcomeActionScreen";
import { SEO } from "@/components/SEO";
import { ContinueWhereYouLeftOff } from "@/components/ContinueWhereYouLeftOff";
import { ReginaldGreeting } from "@/components/ReginaldGreeting";

const Welcome = () => {
  return (
    <>
      <SEO 
        title="Welcome to Phototheology"
        description="Choose your path: Study the Bible, explore the Memory Palace, ask Jeeves, take courses, and more."
      />
      <div className="px-4 pt-6 space-y-4">
        <ReginaldGreeting />
        <ContinueWhereYouLeftOff />
      </div>
      <WelcomeActionScreen />
    </>
  );
};

export default Welcome;
