import { SEO } from "@/components/SEO";
import { DailyAudioDevotional } from "@/components/DailyAudioDevotional";

const DailyAudioDevotionalPage = () => {
  return (
    <>
      <SEO
        title="Daily Audio Devotional — Phototheology Chapel"
        description="Listen to today's Phototheology-based audio devotional — deep, Christ-centered, sanctuary-mapped reflections delivered daily."
      />
      <div className="px-4 pt-6 pb-24 max-w-2xl mx-auto">
        <DailyAudioDevotional />
      </div>
    </>
  );
};

export default DailyAudioDevotionalPage;
