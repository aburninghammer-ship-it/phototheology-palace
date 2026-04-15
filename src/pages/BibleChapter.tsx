import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { BibleReader } from "@/components/bible/BibleReader";
import { AtAGlanceSidebar } from "@/components/bible/AtAGlanceSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, Lightbulb, PanelLeft } from "lucide-react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResearchModeLayout } from "@/components/bible/ResearchModeLayout";
import { useIsMobile } from "@/hooks/use-mobile";

const BibleChapter = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);
  const { exercises, fromReadingPlan, planName, dayNumber } = location.state || {};

  const researchMode = searchParams.get("mode") === "research";

  const setResearchMode = (enabled: boolean) => {
    if (enabled) {
      searchParams.set("mode", "research");
    } else {
      searchParams.delete("mode");
    }
    setSearchParams(searchParams);
  };

  if (researchMode) {
    return <ResearchModeLayout onExitResearchMode={() => setResearchMode(false)} />;
  }

  return (
    <div className="min-h-screen gradient-subtle">
      <Navigation />

      <div className="pt-24 pb-16 px-3 sm:px-4 md:px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" asChild>
              <Link to={fromReadingPlan ? "/daily-reading" : "/bible"}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {fromReadingPlan ? t('bibleChapter.backToDailyReading', 'Back to Daily Reading') : t('bibleChapter.backToBible', 'Back to Bible')}
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <PanelLeft className="h-4 w-4 mr-2" />
              {t('bible.atAGlanceShort', 'Books')}
            </Button>
          </div>

          {fromReadingPlan && exercises && exercises.length > 0 && (
            <Card className="p-6 mb-6 bg-primary/5 border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{t('bibleChapter.principlesToApply', 'Principles to Apply')}</h3>
                    {planName && (
                      <p className="text-sm text-muted-foreground">
                        {t('bibleChapter.planDay', '{{planName}} - Day {{dayNumber}}', { planName, dayNumber })}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Tabs defaultValue={`floor-${exercises[0]?.floorNumber}`} className="w-full">
                <TabsList className="grid w-full mb-4" style={{ gridTemplateColumns: `repeat(${exercises.length}, minmax(0, 1fr))` }}>
                  {exercises.map((exercise: any) => (
                    <TabsTrigger
                      key={exercise.floorNumber}
                      value={`floor-${exercise.floorNumber}`}
                      className="flex flex-col items-center gap-1 py-2"
                    >
                      <Building2 className="h-4 w-4" />
                      <span className="text-xs">{t('bibleChapter.floor', 'Floor {{number}}', { number: exercise.floorNumber })}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {exercises.map((exercise: any) => (
                  <TabsContent key={exercise.floorNumber} value={`floor-${exercise.floorNumber}`} className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-background rounded-lg border">
                      <Building2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-foreground">{exercise.floorName}</h4>
                          <Badge variant="outline" className="text-xs">{t('bibleChapter.floor', 'Floor {{number}}', { number: exercise.floorNumber })}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {t('bibleChapter.rooms', 'Rooms:')} {Array.isArray(exercise.rooms) ? exercise.rooms.join(" • ") : (exercise.rooms || t('bibleChapter.variousRooms', 'Various rooms'))}
                        </p>
                      </div>
                    </div>

                    <Card className="p-4 bg-background/50">
                      <h5 className="font-medium text-foreground mb-2 flex items-center gap-2 text-sm">
                        <Lightbulb className="h-4 w-4 text-accent" />
                        {exercise.title}
                      </h5>
                      <p className="text-sm text-muted-foreground mb-3">{exercise.prompt}</p>

                      <div className="space-y-2">
                        <p className="text-xs font-medium text-foreground">{t('bibleChapter.guidingQuestions', 'Guiding Questions:')}</p>
                        <ul className="space-y-1.5">
                          {exercise.questions?.map((q: string, qIdx: number) => (
                            <li key={qIdx} className="text-xs text-muted-foreground flex items-start gap-2">
                              <span className="text-primary mt-0.5">•</span>
                              <span>{q}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </Card>
          )}

          <div className="flex gap-0 relative">
            {sidebarOpen && isMobile && (
              <>
                <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
                <div className="fixed left-0 top-0 bottom-0 w-72 z-50 bg-background shadow-xl overflow-hidden">
                  <AtAGlanceSidebar onClose={() => setSidebarOpen(false)} />
                </div>
              </>
            )}
            {sidebarOpen && !isMobile && (
              <div className="w-56 lg:w-64 shrink-0 h-[calc(100vh-220px)] sticky top-24 rounded-xl border border-border/50 overflow-hidden shadow-lg">
                <AtAGlanceSidebar onClose={() => setSidebarOpen(false)} />
              </div>
            )}
            <div className={`flex-1 min-w-0 ${sidebarOpen && !isMobile ? 'pl-4' : ''}`}>
              <BibleReader />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BibleChapter;
