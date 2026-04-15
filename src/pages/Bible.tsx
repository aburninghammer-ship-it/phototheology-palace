import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { BibleReader } from "@/components/bible/BibleReader";
import { BibleNavigation } from "@/components/bible/BibleNavigation";
import { AtAGlanceSidebar } from "@/components/bible/AtAGlanceSidebar";
import { Button } from "@/components/ui/button";
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
import {
  BookMarked,
  HelpCircle,
  Headphones,
  FlaskConical,
  PanelLeft,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import { StudyBibleDemoDialog } from "@/components/bible/StudyBibleDemoDialog";
import { VoiceChatWidget } from "@/components/voice/VoiceChatWidget";
import { useAuth } from "@/hooks/useAuth";
import { OfflineIndicator } from "@/components/bible/OfflineIndicator";
import { usePreservePage } from "@/hooks/usePreservePage";
import { ResearchModeLayout } from "@/components/bible/ResearchModeLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import { BibleTabTutorial } from "@/components/bible/BibleTabTutorial";
import { BIBLE_BOOKS } from "@/types/bible";
import { BIBLE_BOOK_METADATA } from "@/data/bibleBooks";

const Bible = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { book: currentBook = "John", chapter: chapterParam = "3" } = useParams();
  const currentChapter = parseInt(chapterParam);

  const [demoOpen, setDemoOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Auto-close sidebar on mobile, auto-open on desktop
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const [searchParams, setSearchParams] = useSearchParams();
  const researchMode = searchParams.get("mode") === "research";

  const setResearchMode = (enabled: boolean) => {
    if (enabled) {
      setSearchParams({ mode: "research" });
    } else {
      setSearchParams({});
    }
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
      // Go to previous book's last chapter
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
      // Go to next book's first chapter
      const bookIndex = BIBLE_BOOKS.indexOf(currentBook);
      if (bookIndex < BIBLE_BOOKS.length - 1) {
        navigate(`/bible/${encodeURIComponent(BIBLE_BOOKS[bookIndex + 1])}/1`);
      }
    }
  };

  const primeAudio = () => {
    const audio = new Audio();
    audio.src = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAbD/rU9UAAAAAAAAAAAAAAAAAAAAAP/jOMAAABQAJQCAAAhDAH+AIACQA/xQAP/zDAIAAAFPAQD/8wgD/+M4wAAAGMAlAAA";
    audio.volume = 0.01;
    audio.play().then(() => {
      audio.pause();
      audio.currentTime = 0;
    }).catch(() => {});
  };

  // Enable scroll position preservation for this page
  usePreservePage();

  // Research Mode - Full screen multi-panel layout
  if (researchMode) {
    return <ResearchModeLayout onExitResearchMode={() => setResearchMode(false)} />;
  }

  // Icon-only toolbar buttons config
  const toolbarButtons = [
    {
      icon: GraduationCap,
      label: t('bible.guidedTour', 'Guided Tour'),
      onClick: () => { primeAudio(); setTutorialOpen(true); },
      "data-tutorial": "bible-tutorial-btn",
    },
    {
      icon: PanelLeft,
      label: t('bible.atAGlance', 'At a Glance'),
      onClick: () => setSidebarOpen(!sidebarOpen),
      "data-tutorial": "at-a-glance-btn",
      active: sidebarOpen,
    },
    {
      icon: Search,
      label: t('bible.search', 'Search & Navigate'),
      onClick: () => setSearchOpen(!searchOpen),
      active: searchOpen,
    },
    {
      icon: FlaskConical,
      label: t('bible.researchMode', 'Research Mode'),
      onClick: () => setResearchMode(true),
      "data-tutorial": "research-mode-btn",
    },
    {
      icon: HelpCircle,
      label: t('bible.howToUse', 'How to Use'),
      onClick: () => setDemoOpen(true),
    },
  ];

  const linkButtons = [
    {
      icon: BookMarked,
      label: t('bible.myMemorizationVerses', 'Memorization Verses'),
      to: "/memorization-verses",
      "data-tutorial": "memorization-btn",
    },
    {
      icon: Headphones,
      label: t('bible.audioBibleCommentary', 'Audio Bible & Commentary'),
      to: "/audio-bible",
      "data-tutorial": "audio-bible-btn",
      primary: true,
    },
  ];

  return (
    <div className="min-h-screen gradient-subtle">
      <Navigation />

      <div className="pt-2 pb-24 md:pb-8 px-2 sm:px-4 md:px-6">
        <div className="container mx-auto max-w-7xl">

          {/* ── Compact Header Bar ── */}
          <div className="glass-card mb-3 sm:mb-4 p-2 sm:p-3 rounded-xl overflow-hidden">
            <div className="relative z-10 flex items-center gap-2 sm:gap-3">
              {/* Logo + Title (compact) */}
              <img
                src="/pwa-192x192.png"
                alt="Phototheology"
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg shadow-md shadow-primary/20 shrink-0"
              />
              <div className="hidden md:block min-w-0 shrink-0">
                <h1 className="font-serif text-base lg:text-lg font-bold bg-gradient-palace bg-clip-text text-transparent whitespace-nowrap">
                  {t('bible.title', 'Phototheology Study Bible')}
                </h1>
              </div>

              {/* Inline Book/Chapter Navigation */}
              <div className="flex items-center gap-1 sm:gap-1.5 flex-1 min-w-0">
                <Select value={currentBook} onValueChange={handleBookChange}>
                  <SelectTrigger className="h-8 sm:h-9 w-[110px] sm:w-[140px] bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 text-xs sm:text-sm font-medium">
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
                  <SelectTrigger className="h-8 sm:h-9 w-[70px] sm:w-[80px] bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 text-xs sm:text-sm font-medium">
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 sm:h-9 sm:w-9 bg-white/5 hover:bg-white/15 border border-white/10"
                  onClick={handlePrevChapter}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 sm:h-9 sm:w-9 bg-white/5 hover:bg-white/15 border border-white/10"
                  onClick={handleNextChapter}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Icon-only Toolbar */}
              <div className="flex items-center gap-1 shrink-0">
                {toolbarButtons.map((btn) => (
                  <Tooltip key={btn.label}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 sm:h-9 sm:w-9 ${
                          btn.active
                            ? 'bg-primary/20 text-primary border border-primary/30'
                            : 'bg-white/5 hover:bg-white/15 border border-white/10'
                        }`}
                        onClick={btn.onClick}
                        data-tutorial={btn["data-tutorial"]}
                      >
                        <btn.icon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>{btn.label}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}

                <div className="w-px h-6 bg-white/10 mx-0.5 hidden sm:block" />

                {linkButtons.map((btn) => (
                  <Tooltip key={btn.label}>
                    <TooltipTrigger asChild>
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 sm:h-9 sm:w-9 ${
                          btn.primary
                            ? 'bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30'
                            : 'bg-white/5 hover:bg-white/15 border border-white/10'
                        }`}
                        data-tutorial={btn["data-tutorial"]}
                      >
                        <Link to={btn.to}>
                          <btn.icon className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>{btn.label}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>

          <StudyBibleDemoDialog open={demoOpen} onOpenChange={setDemoOpen} />

          {tutorialOpen && (
            <BibleTabTutorial onClose={() => setTutorialOpen(false)} />
          )}

          {user && (
            <VoiceChatWidget
              roomType="bible"
              roomId="study"
              className="mb-4"
            />
          )}

          {/* ── Search & Navigation Panel (collapsible) ── */}
          {searchOpen && (
            <div className="mb-4 relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 z-10 h-7 w-7"
                onClick={() => setSearchOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              <BibleNavigation />
            </div>
          )}

          {/* ── Main content with optional sidebar ── */}
          <div className="flex gap-0 relative">
            {/* At a Glance Sidebar - overlay on mobile, inline on desktop */}
            {sidebarOpen && isMobile && (
              <>
                <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
                <div className="fixed left-0 top-0 bottom-0 w-72 z-50 bg-background shadow-xl overflow-hidden">
                  <AtAGlanceSidebar onClose={() => setSidebarOpen(false)} />
                </div>
              </>
            )}
            {sidebarOpen && !isMobile && (
              <div className="w-48 lg:w-52 shrink-0 h-[calc(100vh-160px)] sticky top-20 rounded-xl border border-border/50 overflow-hidden shadow-lg">
                <AtAGlanceSidebar onClose={() => setSidebarOpen(false)} />
              </div>
            )}

            <div className={`flex-1 min-w-0 ${sidebarOpen && !isMobile ? 'pl-3' : ''}`}>
              {/* Bible Reader */}
              <div className="bible-reader-area">
                <BibleReader />
              </div>
            </div>
          </div>
        </div>
      </div>

      <OfflineIndicator />
    </div>
  );
};

export default Bible;
