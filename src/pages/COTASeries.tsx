import { Navigation } from "@/components/Navigation";
import { SpiritOfProphecyTab } from "@/components/living-manna/SpiritOfProphecyTab";

const COTASeries = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <SpiritOfProphecyTab />
      </main>
    </div>
  );
};

export default COTASeries;
