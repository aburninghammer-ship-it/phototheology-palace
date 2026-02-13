import { WelcomeActionScreen } from "@/components/WelcomeActionScreen";
import { SEO } from "@/components/SEO";
import { ContinueWhereYouLeftOff } from "@/components/ContinueWhereYouLeftOff";

const Welcome = () => {
  return (
    <>
      <SEO 
        title="Welcome to Phototheology"
        description="Choose your path: Study the Bible, explore the Memory Palace, ask Jeeves, take courses, and more."
      />
      <div className="px-4 pt-6">
        <ContinueWhereYouLeftOff />
      </div>
      <WelcomeActionScreen />
    </>
  );
};

export default Welcome;
