import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchChapter, Translation } from "@/services/bibleApi";
import { Chapter } from "@/types/bible";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, BookOpen, Loader2, Link2, MessageSquare, Bot, Bookmark, Sparkles, Upload, Volume2, Headphones, Copy, Check, Flame, MoreHorizontal, Crown, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { QuickAudioButton } from "@/components/audio";
import { VerseView } from "./VerseView";
import { StrongsVerseView } from "./StrongsVerseView";
import { PrinciplePanel } from "./PrinciplePanel";
import { ChainReferencePanel } from "./ChainReferencePanel";
import { PTChainReferenceBox } from "./PTChainReferenceBox";
import { CommentaryPanel } from "./CommentaryPanel";
import { JeevesVerseAssistant } from "./JeevesVerseAssistant";
import { ReadingControls } from "./ReadingControls";
import { BibleReaderSkeleton } from "@/components/SkeletonLoader";
import { RetryButton } from "@/components/RetryButton";
import { useReadingHistory } from "@/hooks/useReadingHistory";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { ImportPassageDialog } from "@/components/series-builder/ImportPassageDialog";
import { useBibleState } from "@/hooks/useBibleState";
import { VerseImageAttachment } from "./VerseImageAttachment";
import { ApologeticsPanel } from "./ApologeticsPanel";
import { SermonIdeasPanel } from "./SermonIdeasPanel";

import { ThematicTagging } from "./ThematicTagging";
import { ThemeCrossReference } from "./ThemeCrossReference";
import { ThemeVerseSearch } from "./ThemeVerseSearch";
import { MemoryToolsPanel } from "./MemoryToolsPanel";
import { StudyModeSelector } from "./StudyModeSelector";
import { PreacherMentorCard } from "./PreacherMentorCard";
import { ChapterImage } from "./ChapterImage";
import { TagFriendButton } from "@/components/TagFriendButton";

import { DimensionFilter } from "./DimensionFilter";
import { ReadingStreakBadge } from "./ReadingStreakBadge";
import { useVerseHighlights } from "@/hooks/useVerseHighlights";
import { useVerseNotes } from "@/hooks/useVerseNotes";
import { useReadingStreak } from "@/hooks/useReadingStreak";
import { AIPromptBanner } from "@/components/AIPromptBanner";
import { CopyableVersesCard } from "./CopyableVersesCard";
import { useSparks } from "@/hooks/useSparks";
import { SparkContainer, SparkSettings } from "@/components/sparks";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

export const BibleReader = () => {
  const { book = "John", chapter: chapterParam = "3" } = useParams();
  const navigate = useNavigate();
  const chapter = parseInt(chapterParam);
  
  const [chapterData, setChapterData] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [highlightedVerses, setHighlightedVerses] = useState<number[]>([]);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [activeDimensions, setActiveDimensions] = useState<string[]>(["1D", "2D", "3D", "4D", "5D"]);
  const [studyMode, setStudyMode] = useState<"beginner" | "advanced" | "apologetics" | "preacher-mentor">("advanced");
  const [sermonIdeasMode, setSermonIdeasMode] = useState(false);
  
  const toggleDimension = (dimension: string) => {
    setActiveDimensions(prev =>
      prev.includes(dimension)
        ? prev.filter(d => d !== dimension)
        : [...prev, dimension]
    );
  };
  
  const {
    selectedVerses,
    setSelectedVerses,
    showStrongs: strongsMode,
    setShowStrongs: setStrongsMode,
    showPrinciples: principleMode,
    setShowPrinciples: setPrincipleMode,
    showChainRef: chainReferenceMode,
    setShowChainRef: setChainReferenceMode,
    showCommentary: commentaryMode,
    setShowCommentary: setCommentaryMode,
    showAI: jeevesMode,
    setShowAI: setJeevesMode,
    showPreacherMentor: preacherMentorMode,
    setShowPreacherMentor: setPreacherMentorMode,
  } = useBibleState(book, chapterParam);
  
  const isMobile = useIsMobile();
  const { trackReading } = useReadingHistory();
  const { addBookmark, isBookmarked } = useBookmarks();
  const { preferences, loading: preferencesLoading } = useUserPreferences();
  const { handleError } = useErrorHandler();
  
  // Highlight and notes hooks
  const { 
    highlights, 
    addHighlight, 
    removeHighlight, 
    getHighlightColor, 
    HIGHLIGHT_COLORS 
  } = useVerseHighlights(book, chapter);
  const { 
    notes, 
    addNote, 
    updateNote, 
    deleteNote, 
    getNotesForVerse 
  } = useVerseNotes(book, chapter);
  const { logReading } = useReadingStreak();
  
  const { i18n, t } = useTranslation();
  
  // Map app language to default Bible translation
  const getDefaultTranslation = useCallback((): Translation => {
    const lang = i18n.language?.slice(0, 2);
    if (lang === "es") return "rvr1960";
    if (lang === "fr") return "lsg";
    if (lang === "de") return "luther";
    if (lang === "pt") return "almeida";
    return "kjv";
  }, [i18n.language]);
  
  const [translation, setTranslation] = useState<Translation>(getDefaultTranslation);
  const jeevesRef = useRef<HTMLDivElement>(null);
  const sparkTriggerRef = useRef<NodeJS.Timeout | null>(null);

  // Sparks integration for verse reading
  const { 
    sparks, 
    preferences: sparkPreferences,
    generateSpark, 
    openSpark, 
    saveSpark, 
    dismissSpark,
    exploreSpark,
    updatePreferences: updateSparkPreferences,
  } = useSparks({
    surface: 'bible_reader',
    contextType: 'chapter',
    contextId: `${book}:${chapter}`
  });

  // Trigger spark when verse is selected for a period
  const handleSparkTrigger = useCallback((verseNum: number, verseText: string) => {
    if (sparkTriggerRef.current) {
      clearTimeout(sparkTriggerRef.current);
    }
    
    if (sparkPreferences?.intensity === 'off') return;
    
    // Trigger after 5 seconds of verse selection
    sparkTriggerRef.current = setTimeout(() => {
      const content = `Studying ${book} ${chapter}:${verseNum} - "${verseText}"`;
      generateSpark(content, `${book} ${chapter}:${verseNum}`);
    }, 5000);
  }, [generateSpark, sparkPreferences?.intensity, book, chapter]);

  useEffect(() => {
    // Get translation from URL parameter, or use language-based default for non-English locales
    const params = new URLSearchParams(window.location.search);
    const urlTranslation = params.get("t");
    const lang = i18n.language?.slice(0, 2);
    if (urlTranslation) {
      setTranslation(urlTranslation as Translation);
    } else if (lang && lang !== "en") {
      // Non-English locale: always use the language-matched Bible translation
      setTranslation(getDefaultTranslation());
    } else if (!preferencesLoading && preferences.bible_translation) {
      setTranslation(preferences.bible_translation as Translation);
    } else {
      setTranslation(getDefaultTranslation());
    }
  }, [preferences.bible_translation, preferencesLoading, getDefaultTranslation, i18n.language]);

  // Scroll to verse from URL query param after chapter loads
  useEffect(() => {
    if (!loading && chapterData) {
      const params = new URLSearchParams(window.location.search);
      const verseParam = params.get("verse");
      if (verseParam) {
        const verseNum = parseInt(verseParam);
        if (!isNaN(verseNum)) {
          setSelectedVerse(verseNum);
          setTimeout(() => {
            const el = document.getElementById(`verse-${verseNum}`);
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }, 300);
        }
      }
    }
  }, [loading, chapterData]);

  useEffect(() => {
    loadChapter();
    trackReading(book, chapter);
    // Log reading for streak tracking
    logReading(book, chapter, 0);
  }, [book, chapter, translation]);

  const loadChapter = async () => {
    setLoading(true);
    setError(null);
    try {
      // Validate book and chapter before API call
      if (!book || chapter < 1 || chapter > 150) {
        // Redirect to default Bible page if invalid
        navigate("/bible/John/3");
        return;
      }
      
      const data = await fetchChapter(book, chapter, translation);
      setChapterData(data);
      setError(null);
    } catch (error) {
      const message = handleError(error, {
        title: "Failed to load chapter",
        showToast: false,
      });
      setError(message);
      
      // Redirect to default if book/chapter doesn't exist
      if (message.includes("not found") || message.includes("does not exist")) {
        setTimeout(() => navigate("/bible/John/3"), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const navigateChapter = (direction: "prev" | "next") => {
    const newChapter = direction === "prev" ? chapter - 1 : chapter + 1;
    if (newChapter > 0) {
      navigate(`/bible/${book}/${newChapter}`);
      setSelectedVerse(null);
      setSelectedVerses([]);
    }
  };

  const handleVerseClick = (verseNum: number) => {
    if (principleMode) {
      // Multi-select in principle mode
      setSelectedVerses(prev => 
        prev.includes(verseNum) 
          ? prev.filter(v => v !== verseNum)
          : [...prev, verseNum].sort((a, b) => a - b)
      );
    } else {
      // Single select in other modes
      setSelectedVerse(verseNum);
      
      // Trigger spark generation after dwelling on verse
      const verseText = chapterData?.verses.find(v => v.verse === verseNum)?.text || '';
      if (verseText) {
        handleSparkTrigger(verseNum, verseText);
      }
    }
  };

  if (loading || preferencesLoading) {
    return <BibleReaderSkeleton />;
  }

  if (error || !chapterData) {
    return (
      <Card className="p-12 text-center">
        <div className="space-y-4">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold mb-2">{t('bible.failedToLoad')}</h3>
            <p className="text-muted-foreground mb-4">
              {error || t('bible.unableToLoad')}
            </p>
          </div>
          <RetryButton onRetry={loadChapter}>
            {t('bible.tryAgain')}
          </RetryButton>
        </div>
      </Card>
    );
  }

  const fontSizeClass = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  }[preferences.bible_font_size];

    return (
      <div className="space-y-6">
        {/* Sticky Header + AI Prompt Banner */}
        <div className="sticky top-16 z-50 space-y-3">
          {/* Chapter Header - Glass */}
          <div className="isolate glass-card-subtle rounded-xl -mx-4 px-6 py-4 flex items-center justify-between flex-wrap gap-4 backdrop-blur-xl">
            <div className="relative">
              <h1 className="font-serif text-3xl md:text-4xl font-bold bg-gradient-palace bg-clip-text text-transparent">
                {book} {chapter}
              </h1>
              <p className="text-muted-foreground mt-1">
                {chapterData.verses.length} {t('bible.verses').toLowerCase()}
              </p>
            </div>

            <div className="relative z-10 flex gap-2 flex-wrap items-center">
              {/* Spark indicators */}
              {sparks.length > 0 && (
                <Badge variant="outline" className="text-amber-500 border-amber-500/30 animate-pulse">
                  🔥 {sparks.length}
                </Badge>
              )}
              <SparkSettings
                preferences={sparkPreferences}
                onUpdate={updateSparkPreferences}
              />
              <ReadingStreakBadge compact />
              <ReadingControls />
              <Button
                variant="outline"
                size="sm"
                onClick={() => addBookmark(book, chapter)}
                disabled={isBookmarked(book, chapter)}
                className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20"
              >
                <Bookmark className="h-4 w-4 mr-2" />
                {isBookmarked(book, chapter) ? t('bible.bookmarked') : t('bible.bookmark')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateChapter("prev")}
                disabled={chapter <= 1}
                className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                {t('bible.previous')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateChapter("next")}
                className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20"
              >
                {t('bible.next')}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Spark Container */}
          {sparks.length > 0 && (
            <div className="fixed bottom-24 right-4 md:bottom-auto md:top-20 z-50">
              <SparkContainer
                sparks={sparks}
                onOpen={openSpark}
                onSave={saveSpark}
                onDismiss={dismissSpark}
                onExplore={exploreSpark}
              />
            </div>
          )}

          {/* AI Prompt Banner - Surface Jeeves */}
          {!jeevesMode && (
            <div className="relative">
              <AIPromptBanner
                context="bible"
                book={book}
                chapter={chapter}
                onAskJeeves={() => {
                  setJeevesMode(true);
                  setTimeout(() => {
                    jeevesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }, 100);
                }}
              />
            </div>
          )}
        </div>

      {/* Compact Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Study Mode Selector */}
        <StudyModeSelector activeMode={studyMode} onModeChange={setStudyMode} />

        <div className="h-6 w-px bg-border" />

        {/* Audio */}
        <QuickAudioButton
          text={chapterData.verses.map(v => `Verse ${v.verse}. ${v.text}`).join(' ')}
          variant="outline"
          size="sm"
          className="gap-2"
        />

        <TagFriendButton
          pageTitle={`${book} ${chapter} - PT Study Bible`}
          pageDescription={`Check out ${book} chapter ${chapter} in the Phototheology Study Bible`}
          variant="outline"
          size="sm"
        />

        <div className="h-6 w-px bg-border" />

        {/* Primary Actions */}
        <Button
          variant={commentaryMode ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setCommentaryMode(!commentaryMode);
            setStrongsMode(false);
            setPrincipleMode(false);
            setChainReferenceMode(false);
          }}
          className={commentaryMode ? "gradient-ocean" : ""}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          {t('bible.study')}
        </Button>
        <Button
          variant={jeevesMode ? "default" : "outline"}
          size="sm"
          onClick={() => {
            const newJeevesMode = !jeevesMode;
            setJeevesMode(newJeevesMode);
            setStrongsMode(false);
            setPrincipleMode(false);
            setChainReferenceMode(false);

            if (newJeevesMode) {
              setTimeout(() => {
                jeevesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 100);
            }
          }}
          className={jeevesMode ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg" : ""}
        >
          <Bot className="h-4 w-4 mr-2" />
          {t('bible.askJeeves')}
        </Button>
        <Button
          variant={preacherMentorMode ? "default" : "outline"}
          size="sm"
          onClick={() => {
            const newMode = !preacherMentorMode;
            setPreacherMentorMode(newMode);
            if (newMode) {
              setStrongsMode(false);
              setPrincipleMode(false);
              setChainReferenceMode(false);
              setCommentaryMode(false);
              setJeevesMode(false);
              setSermonIdeasMode(false);
            }
          }}
          className={preacherMentorMode ? "bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-lg" : ""}
        >
          <Crown className="h-4 w-4 mr-2" />
          Mentor
        </Button>

        {/* More Tools Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4 mr-2" />
              {t('bible.more')}
              {(strongsMode || principleMode || chainReferenceMode || sermonIdeasMode) && (
                <span className="ml-1 h-2 w-2 rounded-full bg-primary" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem
              onClick={() => {
                setStrongsMode(!strongsMode);
                setPrincipleMode(false);
                setChainReferenceMode(false);
                setCommentaryMode(false);
                setJeevesMode(false);
              }}
              className={strongsMode ? "bg-amber-100 dark:bg-amber-900/30" : ""}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {t('bible.strongsNumbers')}
              {strongsMode && <Check className="h-4 w-4 ml-auto" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setPrincipleMode(!principleMode);
                setStrongsMode(false);
                setChainReferenceMode(false);
                setCommentaryMode(false);
                setJeevesMode(false);
                setSelectedVerses([]);
                setSelectedVerse(null);
              }}
              className={principleMode ? "bg-purple-100 dark:bg-purple-900/30" : ""}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              {t('bible.principleMode')}
              {principleMode && <Check className="h-4 w-4 ml-auto" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setChainReferenceMode(!chainReferenceMode);
                setStrongsMode(false);
                setPrincipleMode(false);
                setCommentaryMode(false);
                setJeevesMode(false);
                setHighlightedVerses([]);
              }}
              className={chainReferenceMode ? "bg-blue-100 dark:bg-blue-900/30" : ""}
            >
              <Link2 className="h-4 w-4 mr-2" />
              {t('bible.crossReferencesMode')}
              {chainReferenceMode && <Check className="h-4 w-4 ml-auto" />}
            </DropdownMenuItem>

            {selectedVerse && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setImportDialogOpen(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  {t('bible.importToLesson')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSermonIdeasMode(!sermonIdeasMode);
                    setStrongsMode(false);
                    setPrincipleMode(false);
                    setChainReferenceMode(false);
                    setCommentaryMode(false);
                    setJeevesMode(false);
                  }}
                  className={sermonIdeasMode ? "bg-orange-100 dark:bg-orange-900/30" : ""}
                >
                  <Flame className="h-4 w-4 mr-2" />
                  {t('bible.sermonIdeas')}
                  {sermonIdeasMode && <Check className="h-4 w-4 ml-auto" />}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ImportPassageDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        passage={`${book} ${chapter}:${selectedVerse}`}
        verseText={selectedVerse ? chapterData.verses.find(v => v.verse === selectedVerse)?.text || "" : ""}
      />

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Main Reading Pane */}
        <div className="lg:col-span-3 space-y-6">
          <Card variant="glass" className={`shadow-elegant hover:shadow-hover transition-smooth ${preferences.reading_mode === 'focus' ? 'max-w-3xl mx-auto' : ''}`}>
            {/* Sticky Book Title Header */}
            <div className="sticky top-0 z-20 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 backdrop-blur-xl border-b border-primary/30 px-6 py-4 rounded-t-xl shadow-sm mx-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                  <BookOpen className="h-5 w-5 text-primary-foreground" />
                </div>
                <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground">
                  {book} <span className="text-muted-foreground font-normal">· {t('bible.chapterLabel', { chapter })}</span>
                </h2>
              </div>
            </div>

            {/* Auto-Generated Chapter Image */}
            <div className="px-6 pt-6">
              <ChapterImage
                book={book}
                chapter={chapter}
                chapterText={chapterData.verses.map(v => v.text).join(' ')}
              />
            </div>

            <div className={`space-y-4 p-6 ${fontSizeClass}`}>
              {strongsMode ? (
                chapterData.verses.map((verse) => (
                  <StrongsVerseView
                    key={`${verse.book}-${verse.chapter}-${verse.verse}`}
                    verse={verse}
                    isSelected={selectedVerse === verse.verse}
                    onSelect={() => handleVerseClick(verse.verse)}
                    showPrinciples={false}
                    isHighlighted={highlightedVerses.includes(verse.verse)}
                    isAudioPlaying={false}
                  />
                ))
              ) : (
                chapterData.verses.map((verse) => (
                  <VerseView
                    key={`${verse.book}-${verse.chapter}-${verse.verse}`}
                    verse={verse}
                    book={book}
                    chapter={chapter}
                    isSelected={principleMode ? selectedVerses.includes(verse.verse) : selectedVerse === verse.verse}
                    onSelect={() => handleVerseClick(verse.verse)}
                    showPrinciples={principleMode}
                    isHighlighted={highlightedVerses.includes(verse.verse)}
                    isAudioPlaying={false}
                    highlightColor={getHighlightColor(verse.verse)}
                    highlightColors={HIGHLIGHT_COLORS}
                    onHighlight={addHighlight}
                    onRemoveHighlight={removeHighlight}
                    notes={getNotesForVerse(verse.verse)}
                    onAddNote={addNote}
                    onUpdateNote={updateNote}
                    onDeleteNote={deleteNote}
                    onAskJeeves={(verseNum, verseText) => {
                      setSelectedVerse(verseNum);
                      setJeevesMode(true);
                      setStrongsMode(false);
                      setPrincipleMode(false);
                      setChainReferenceMode(false);
                      setTimeout(() => {
                        jeevesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 100);
                    }}
                  />
                ))
              )}
            </div>
          </Card>
          
          {/* Bottom Navigation */}
          <div className="flex justify-center gap-3 pt-4">
            <Button
              onClick={() => navigateChapter("prev")}
              disabled={chapter <= 1}
              variant="outline"
              className="shadow-lg hover:shadow-xl transition-all"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {t('bible.previousChapter')}
            </Button>
            <Button
              onClick={() => navigateChapter("next")}
              className="gradient-palace text-white shadow-lg hover:shadow-xl transition-all"
            >
              {t('bible.nextChapter')}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Right Panel - Dynamic based on mode */}
        {/* On mobile: opens as a bottom drawer for easy back navigation */}
        {/* On desktop: renders inline as a sticky sidebar */}
        {(() => {
          const hasPanelContent = !!(
            (preacherMentorMode && selectedVerse) ||
            chainReferenceMode ||
            (sermonIdeasMode && selectedVerse) ||
            ((commentaryMode || jeevesMode) && selectedVerse) ||
            (principleMode && selectedVerses.length > 0) ||
            selectedVerse
          );

          const closeMobilePanel = () => {
            setSelectedVerse(null);
            setSelectedVerses([]);
            setPreacherMentorMode(false);
            setSermonIdeasMode(false);
            setCommentaryMode(false);
            setJeevesMode(false);
            setPrincipleMode(false);
            setChainReferenceMode(false);
          };

          const panelContent = (
            <>
              {preacherMentorMode && selectedVerse ? (
                <PreacherMentorCard
                  book={book}
                  chapter={chapter}
                  verse={selectedVerse}
                  verseText={chapterData.verses.find(v => v.verse === selectedVerse)?.text || ""}
                  onClose={() => setPreacherMentorMode(false)}
                />
              ) : chainReferenceMode ? (
                <div className="space-y-6">
                  <PTChainReferenceBox initialVerse={selectedVerse ? `${book} ${chapter}:${selectedVerse}` : `${book} ${chapter}`} />
                  <ChainReferencePanel
                    book={book}
                    chapter={chapter}
                    verses={chapterData.verses}
                    onHighlight={setHighlightedVerses}
                  />
                </div>
              ) : sermonIdeasMode && selectedVerse ? (
                <SermonIdeasPanel
                  book={book}
                  chapter={chapter}
                  verse={selectedVerse}
                  verseText={chapterData.verses.find(v => v.verse === selectedVerse)?.text || ""}
                  onClose={() => setSermonIdeasMode(false)}
                />
              ) : (commentaryMode || jeevesMode) && selectedVerse ? (
                <>
                  {commentaryMode && (
                    <CommentaryPanel
                      book={book}
                      chapter={chapter}
                      verse={selectedVerse}
                      verseText={chapterData.verses.find(v => v.verse === selectedVerse)?.text || ""}
                      onClose={() => setCommentaryMode(false)}
                    />
                  )}
                  {jeevesMode && (
                    <JeevesVerseAssistant
                      book={book}
                      chapter={chapter}
                      verse={selectedVerse}
                      verseText={chapterData.verses.find(v => v.verse === selectedVerse)?.text || ""}
                      onClose={() => setJeevesMode(false)}
                    />
                  )}
                </>
              ) : principleMode && selectedVerses.length > 0 ? (
                <CopyableVersesCard
                  book={book}
                  chapter={chapter}
                  selectedVerses={selectedVerses}
                  verses={chapterData.verses}
                  onClear={() => setSelectedVerses([])}
                >
                  {selectedVerses.length === 1 && (
                    <PrinciplePanel
                      book={book}
                      chapter={chapter}
                      verse={selectedVerses[0]}
                      verseText={chapterData.verses.find(v => v.verse === selectedVerses[0])?.text || ""}
                      onClose={() => setSelectedVerses([])}
                      onHighlight={setHighlightedVerses}
                    />
                  )}
                </CopyableVersesCard>
              ) : selectedVerse ? (
                <>
                  <MemoryToolsPanel
                    book={book}
                    chapter={chapter}
                    verse={selectedVerse}
                    verseText={chapterData.verses.find(v => v.verse === selectedVerse)?.text || ""}
                  />

                  <PrinciplePanel
                    book={book}
                    chapter={chapter}
                    verse={selectedVerse}
                    verseText={chapterData.verses.find(v => v.verse === selectedVerse)?.text || ""}
                    onClose={() => setSelectedVerse(null)}
                    onHighlight={setHighlightedVerses}
                  />
                  <VerseImageAttachment
                    book={book}
                    chapter={chapter}
                    verse={selectedVerse}
                    verseText={chapterData.verses.find(v => v.verse === selectedVerse)?.text || ""}
                  />

                  {(studyMode === "apologetics" || studyMode === "advanced") && (
                    <ApologeticsPanel
                      book={book}
                      chapter={chapter}
                      verse={selectedVerse}
                      verseText={chapterData.verses.find(v => v.verse === selectedVerse)?.text || ""}
                    />
                  )}

                  {(studyMode === "advanced" || studyMode === "beginner") && (
                    <ThematicTagging
                      book={book}
                      chapter={chapter}
                      verse={selectedVerse}
                      verseText={chapterData.verses.find(v => v.verse === selectedVerse)?.text || ""}
                    />
                  )}

                  {studyMode === "advanced" && (
                    <ThemeCrossReference
                      currentVerse={`${book} ${chapter}:${selectedVerse}`}
                    />
                  )}

                  <ThemeVerseSearch />
                </>
              ) : null}
            </>
          );

          // On mobile: render panel in a bottom drawer
          if (isMobile) {
            return (
              <Drawer open={hasPanelContent} onOpenChange={(open) => { if (!open) closeMobilePanel(); }}>
                <DrawerContent className="max-h-[85vh]">
                  <DrawerHeader className="flex items-center justify-between pb-2">
                    <DrawerTitle className="text-sm">
                      {book} {chapter}{selectedVerse ? `:${selectedVerse}` : ""}
                    </DrawerTitle>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={closeMobilePanel}>
                      <X className="h-4 w-4" />
                    </Button>
                  </DrawerHeader>
                  <div className="overflow-y-auto px-4 pb-6 space-y-4">
                    {panelContent}
                  </div>
                </DrawerContent>
              </Drawer>
            );
          }

          // On desktop: render inline as sticky sidebar
          return (
            <div className="lg:col-span-2 space-y-4 lg:space-y-6 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto scrollbar-thin" ref={jeevesRef}>
              {hasPanelContent ? panelContent : (
                <Card className="p-6 text-center text-muted-foreground sticky top-24">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 text-primary/50" />
                  <p className="text-sm">
                    {strongsMode
                      ? t('bible.selectVerseStrongs')
                      : principleMode
                      ? t('bible.selectVersePrinciple')
                      : preacherMentorMode
                      ? "Select a verse for Preacher Mentor analysis"
                      : (jeevesMode || commentaryMode)
                      ? t('bible.selectVerseAI')
                      : t('bible.selectVerseDefault')}
                  </p>
                </Card>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
};
