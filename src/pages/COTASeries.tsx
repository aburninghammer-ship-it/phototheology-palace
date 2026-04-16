import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { GuidedTourOverlay, primeAudioForTour } from "@/components/guided-tour/GuidedTourOverlay";
import { COTA_TOUR } from "@/data/guidedTours";
import { Navigation } from "@/components/Navigation";
import { SpiritOfProphecyTab } from "@/components/living-manna/SpiritOfProphecyTab";
import { DefenseMode } from "@/components/living-manna/DefenseMode";
import { AATSTraining } from "@/components/living-manna/AATSTraining";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookMarked, Shield, Swords, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const validTabs = ["library", "defense", "aats"] as const;
type TabValue = typeof validTabs[number];

const COTASeries = () => {
  const [searchParams] = useSearchParams();
  const initialTab = validTabs.includes(searchParams.get("tab") as TabValue) ? (searchParams.get("tab") as TabValue) : "library";
  const [activeTab, setActiveTab] = useState<TabValue>(initialTab);
  const [tourOpen, setTourOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={() => { primeAudioForTour(); setTourOpen(true); }} className="gap-1">
            <GraduationCap className="h-4 w-4" /> Guided Tour
          </Button>
        </div>
        {tourOpen && <GuidedTourOverlay steps={COTA_TOUR} onClose={() => setTourOpen(false)} />}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="library" className="gap-2 text-xs sm:text-sm">
              <BookMarked className="h-4 w-4" />
              <span className="hidden sm:inline">COTA</span> Library
            </TabsTrigger>
            <TabsTrigger value="defense" className="gap-2 text-xs sm:text-sm">
              <Shield className="h-4 w-4" />
              Defense Mode
            </TabsTrigger>
            <TabsTrigger value="aats" className="gap-2 text-xs sm:text-sm">
              <Swords className="h-4 w-4" />
              <span className="hidden sm:inline">AATS</span> War College
            </TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="mt-4">
            <SpiritOfProphecyTab />
          </TabsContent>

          <TabsContent value="defense" className="mt-4">
            <DefenseMode churchId="" />
          </TabsContent>

          <TabsContent value="aats" className="mt-4">
            <AATSTraining churchId="" onNavigateToDefense={() => setActiveTab("defense")} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default COTASeries;
