import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate, useLocation, useSearchParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { BibleReader } from "@/components/bible/BibleReader";
import { AtAGlanceSidebar } from "@/components/bible/AtAGlanceSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowLeft, Building2, Lightbulb, PanelLeft, ChevronLeft, ChevronRight, FlaskConical, Headphones, BookMarked, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResearchModeLayout } from "@/components/bible/ResearchModeLayout";
import { BIBLE_BOOKS } from "@/types/bible";
import { BIBLE_BOOK_METADATA } from "@/data/bibleBooks";
import { useIsMobile } from "@/hooks/use-mobile";

const BibleChapter = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { book: currentBook = "John", chapter: chapterParam = "1" } = useParams();
  const currentChapter = parseInt(chapterParam);
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

  // Get chapter count for current book
  const currentBookMeta = BIBLE_BOOK_METADATA.find(b => b.name === currentBook);
  const maxChapter = currentBookMeta?.chapters || 50;

  const handleBookChange = (book: string) => {
    navigate(`/bible/${encodeURIComponent(book)}/1`);
  };

  const handleChapterChange = (ch: string) => {
    navigate(`/bible/${encodeURIComponent(currentBook)}/${ch}`);
  };

  const handlePrevChapter = () => {
    if (currentChapter > 1) {
      navigate(`/bible/${encodeURIComponent(currentBook)}/${currentChapter - 1}`);
    } else {
      const bookIndex = BIBLE_BOOKS.indexOf(currentBook);
      if (bookIndex > 0) {
        const prevBook = BIBLE_BOOKS[bookIndex - 1];
        const prevMeta = BIBLE_BOOK_METADATA.find(b => b.name === prevBook);
        navigate(`/bible/${encodeURIComponent(prevBook)}/${prevMeta?.chapters || 1}`);
      }
    }
  };

  const handleNextChapter = () => {
    if (currentChapter < maxChapter) {
      navigate(`/bible/${encodeURIComponent(currentBook)}/${currentChapter + 1}`);
    } else {
      const bookIndex = BIBLE_BOOKS.indexOf(currentBook);
      if (bookIndex < BIBLE_BOOKS.length - 1) {
        navigate(`/bible/${encodeURIComponent(BIBLE_BOOKS[bookIndex + 1])}/1`);
      }
    }
  };

  if (researchMode) {
    return <ResearchModeLayout onExitResearchMode={() => setResearchMode(false)} />;
  }

  return (
    <div className="min-h-screen gradient-subtle">
      <Navigation />

      <div className="pt-2 pb-24 md:pb-8 px-2 sm:px-4 md:px-6">
        <div className="container mx-auto max-w-7xl">

          {/* ── Compact Header Bar ── */}
          <div className="glass-card mb-3 p-2 sm:p-3 rounded-xl overflow-hidden">
            <div className="relative z-10 flex items-center gap-1.5 sm:gap-2">
              {/* Back button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 bg-white/5 hover:bg-white/15 border border-white/10 shrink-0" asChild>
                    <Link to={fromReadingPlan ? "/daily-reading" : "/bible"}>
                      <ArrowLeft className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{fromReadingPlan ? 'Back to Daily Reading' : 'Back to Bible'}</p>
                </TooltipContent>
              </Tooltip>

              {/* Inline Book/Chapter Navigation */}
              <Select value={currentBook} onValueChange={handleBookChange}>
                <SelectTrigger className="h-8 sm:h-9 w-[100px] sm:w-[140px] bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 text-xs sm:text-sm font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] bg-card/95 backdrop-blur-xl border-white/20 z-50">
                  {BIBLE_BOOKS.map((book) => (
                    <SelectItem key={book} value={book} className="text-sm">
                      {book}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={String(currentChapter)} onValueChange={handleChapterChange}>
                <SelectTrigger className="h-8 sm:h-9 w-[65px] sm:w-[80px] bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 text-xs sm:text-sm font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] bg-card/95 backdrop-blur-xl border-white/20 z-50">
                  {Array.from({ length: maxChapter }, (_, i) => i + 1).map((ch) => (
                    <SelectItem key={ch} value={String(ch)} className="text-sm">
                      Ch {ch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Prev / Next */}
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 bg-white/5 hover:bg-white/15 border border-white/10" onClick={handlePrevChapter}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 bg-white/5 hover:bg-white/15 border border-white/10" onClick={handleNextChapter}>
                <ChevronRight className="h-4 w-4" />
              </Button>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Icon-only Toolbar */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 sm:h-9 sm:w-9 ${sidebarOpen ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 hover:bg-white/15 border border-white/10'}`}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                  >
                    <PanelLeft className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom"><p>Books</p></TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 bg-white/5 hover:bg-white/15 border border-white/10" onClick={() => setResearchMode(true)}>
                    <FlaskConical className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom"><p>Research Mode</p></TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 bg-white/5 hover:bg-white/15 border border-white/10" asChild>
                    <Link to="/memorization-verses">
                      <BookMarked className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom"><p>Memorization</p></TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30" asChild>
                    <Link to="/audio-bible">
                      <Headphones className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom"><p>Audio Bible</p></TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Reading Plan Exercises (if from reading plan) */}
          {fromReadingPlan && exercises && exercises.length > 0 && (
            <Card className="p-4 sm:p-6 mb-4 bg-primary/5 border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{t('bibleChapter.principlesToApply', 'Principles to Apply')}</h3>
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

          {/* ── Main content with optional sidebar ── */}
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
              <div className="w-48 lg:w-52 shrink-0 h-[calc(100vh-130px)] sticky top-20 rounded-xl border border-border/50 overflow-hidden shadow-lg">
                <AtAGlanceSidebar onClose={() => setSidebarOpen(false)} />
              </div>
            )}

            <div className={`flex-1 min-w-0 ${sidebarOpen && !isMobile ? 'pl-3' : ''}`}>
              <BibleReader />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BibleChapter;
