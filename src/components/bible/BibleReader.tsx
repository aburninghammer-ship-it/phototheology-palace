import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchChapter, Translation, BIBLE_TRANSLATIONS } from "@/services/bibleApi";
import { Chapter } from "@/types/bible";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft, ChevronRight, BookOpen, Link2,
  MessageSquare, Bot, Bookmark, Sparkles, Upload, Check,
  Flame, MoreHorizontal, Crown, X,
  GraduationCap, Shield,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { PreacherMentorCard } from "./PreacherMentorCard";
import { ChapterImage } from "./ChapterImage";
import { TagFriendButton } from "@/components/TagFriendButton";
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
import { useExperienceMode } from "@/contexts/ExperienceModeContext";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

export const BibleReader = () => {
  const { book = "John", chapter: chapterParam = "3" } = useParams();
  const navigate = useNavigate();
  const chapter = parseInt(chapterParam);
  const { isBasic } = useExperienceMode();

  const [chapterData, setChapterData] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [highlightedVerses, setHighlightedVerses] = useState<number[]>([]);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [studyMode, setStudyMode] = useState<"beginner" | "advanced" | "apologetics" | "preacher-mentor">(isBasic ? "beginner" : "advanced");
  const [sermonIdeasMode, setSermonIdeasMode] = useState(false);

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

  const handleSparkTrigger = useCallback((verseNum: number, verseText: string) => {
    if (sparkTriggerRef.current) {
      clearTimeout(sparkTriggerRef.current);
    }
    if (sparkPreferences?.intensity === 'off') return;
    sparkTriggerRef.current = setTimeout(() => {
      const content = `Studying ${book} ${chapter}:${verseNum} - "${verseText}"`;
      generateSpark(content, `${book} ${chapter}:${verseNum}`);
    }, 5000);
  }, [generateSpark, sparkPreferences?.intensity, book, chapter]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlTranslation = params.get("t");
    const lang = i18n.language?.slice(0, 2);
    if (urlTranslation) {
      setTranslation(urlTranslation as Translation);
    } else if (lang && lang !== "en") {
      setTranslation(getDefaultTranslation());
    } else if (!preferencesLoading && preferences.bible_translation) {
      setTranslation(preferences.bible_translation as Translation);
    } else {
      setTranslation(getDefaultTranslation());
    }
  }, [preferences.bible_translation, preferencesLoading, getDefaultTranslation, i18n.language]);

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
    logReading(book, chapter, 0);
  }, [book, chapter, translation]);

  const loadChapter = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!book || chapter < 1 || chapter > 150) {
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
      setSelectedVerses(prev =>
        prev.includes(verseNum)
          ? prev.filter(v => v !== verseNum)
          : [...prev, verseNum].sort((a, b) => a - b)
      );
    } else {
      setSelectedVerse(verseNum);
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

  // Study mode items for the "More" dropdown
  const studyModes = [
    { id: "beginner" as const, label: "Beginner", icon: BookOpen },
    { id: "advanced" as const, label: "Advanced", icon: GraduationCap },
    { id: "apologetics" as const, label: "Apologetics", icon: Shield },
    { id: "preacher-mentor" as const, label: "Preacher Mentor", icon: Crown },
  ];

  // --- Panel content (shared between desktop and mobile) ---
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
          {!isBasic && (studyMode === "apologetics" || studyMode === "advanced") && (
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

  // --- Idle AI panel (when no verse selected, desktop only) ---
  const idlePanel = (
    <div className="space-y-4">
      {/* Chapter info card */}
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{book} {chapter}</h3>
            <p className="text-xs text-muted-foreground">{chapterData.verses.length} verses</p>
          </div>
        </div>
      </Card>

      {/* Study Tools grid */}
      <Card className="p-4">
        <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Study Tools</p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={commentaryMode ? "default" : "outline"}
            size="sm"
            className="h-auto py-2 flex-col gap-1"
            onClick={() => {
              setCommentaryMode(!commentaryMode);
              setStrongsMode(false); setPrincipleMode(false); setChainReferenceMode(false);
            }}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="text-xs">Commentary</span>
          </Button>
          <Button
            variant={jeevesMode ? "default" : "outline"}
            size="sm"
            className={`h-auto py-2 flex-col gap-1 ${jeevesMode ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white" : ""}`}
            onClick={() => {
              setJeevesMode(!jeevesMode);
              setStrongsMode(false); setPrincipleMode(false); setChainReferenceMode(false);
            }}
          >
            <Bot className="h-4 w-4" />
            <span className="text-xs">Jeeves</span>
          </Button>
          <Button
            variant={preacherMentorMode ? "default" : "outline"}
            size="sm"
            className={`h-auto py-2 flex-col gap-1 ${preacherMentorMode ? "bg-gradient-to-r from-amber-600 to-orange-500 text-white" : ""}`}
            onClick={() => {
              setPreacherMentorMode(!preacherMentorMode);
              if (!preacherMentorMode) {
                setStrongsMode(false); setPrincipleMode(false); setChainReferenceMode(false);
                setCommentaryMode(false); setJeevesMode(false); setSermonIdeasMode(false);
              }
            }}
          >
            <Crown className="h-4 w-4" />
            <span className="text-xs">Mentor</span>
          </Button>
          <Button
            variant={strongsMode ? "default" : "outline"}
            size="sm"
            className="h-auto py-2 flex-col gap-1"
            onClick={() => {
              setStrongsMode(!strongsMode);
              setPrincipleMode(false); setChainReferenceMode(false); setCommentaryMode(false); setJeevesMode(false);
            }}
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-xs">Strong's</span>
          </Button>
        </div>
      </Card>

      {/* Translation switcher */}
      <Card className="p-4">
        <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Translation</p>
        <Select value={translation} onValueChange={(val) => setTranslation(val as Translation)}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {BIBLE_TRANSLATIONS.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      {/* Reading streak full card */}
      <ReadingStreakBadge compact={false} />

      {/* Prompt to select a verse */}
      <Card className="p-4 text-center text-muted-foreground">
        <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary/40" />
        <p className="text-xs">
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
    </div>
  );

  // --- Scripture pane (shared) ---
  const scripturePane = (
    <Card variant="glass" className={`shadow-elegant hover:shadow-hover transition-smooth ${preferences.reading_mode === 'focus' ? 'max-w-3xl mx-auto' : ''}`}>
      {/* Compact Book Title Header */}
      <div className="sticky top-0 z-20 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 backdrop-blur-xl border-b border-primary/30 px-4 py-2.5 rounded-t-xl shadow-sm mx-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
            <BookOpen className="h-4 w-4 text-primary-foreground" />
          </div>
          <h2 className="font-serif text-xl font-bold text-foreground">
            {book} <span className="text-muted-foreground font-normal">· {t('bible.chapterLabel', { chapter })}</span>
          </h2>
        </div>
      </div>

      {/* Chapter Image — reduced padding */}
      <div className="px-4 pt-3">
        <ChapterImage
          book={book}
          chapter={chapter}
          chapterText={chapterData.verses.map(v => v.text).join(' ')}
        />
      </div>

      <div className={`space-y-4 px-4 py-4 ${fontSizeClass}`}>
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
  );

  // --- Bottom nav (shared) ---
  const bottomNav = (
    <div className="flex justify-center gap-3 pt-2">
      <Button
        onClick={() => navigateChapter("prev")}
        disabled={chapter <= 1}
        variant="ghost"
        size="sm"
        className="text-muted-foreground"
      >
        <ChevronLeft className="h-3 w-3 mr-1" />
        {t('bible.previousChapter')}
      </Button>
      <Button
        onClick={() => navigateChapter("next")}
        variant="ghost"
        size="sm"
        className="text-muted-foreground"
      >
        {t('bible.nextChapter')}
        <ChevronRight className="h-3 w-3 ml-1" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* === Single Merged Sticky Header === */}
      <div className="sticky top-16 z-50 space-y-2">
        <div className="isolate glass-card-subtle rounded-xl -mx-4 px-4 py-2.5 flex items-center justify-between flex-wrap gap-2 backdrop-blur-xl">
          {/* Left: compact title + verse count */}
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="font-serif text-xl font-bold bg-gradient-palace bg-clip-text text-transparent truncate">
              {book} {chapter}
            </h1>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {chapterData.verses.length} {t('bible.verses').toLowerCase()}
            </span>
          </div>

          {/* Center: mode buttons + More dropdown */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Button
              variant={commentaryMode ? "default" : "outline"}
              size="sm"
              className={`h-8 ${commentaryMode ? "gradient-ocean" : ""}`}
              onClick={() => {
                setCommentaryMode(!commentaryMode);
                setStrongsMode(false); setPrincipleMode(false); setChainReferenceMode(false);
              }}
            >
              <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
              <span className="hidden sm:inline">{t('bible.study')}</span>
            </Button>
            <Button
              variant={jeevesMode ? "default" : "outline"}
              size="sm"
              className={`h-8 ${jeevesMode ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg" : ""}`}
              onClick={() => {
                const newJeevesMode = !jeevesMode;
                setJeevesMode(newJeevesMode);
                setStrongsMode(false); setPrincipleMode(false); setChainReferenceMode(false);
                if (newJeevesMode) {
                  setTimeout(() => {
                    jeevesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                }
              }}
            >
              <Bot className="h-3.5 w-3.5 mr-1.5" />
              <span className="hidden sm:inline">{t('bible.askJeeves')}</span>
            </Button>
            <Button
              variant={preacherMentorMode ? "default" : "outline"}
              size="sm"
              className={`h-8 ${preacherMentorMode ? "bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-lg" : ""}`}
              onClick={() => {
                const newMode = !preacherMentorMode;
                setPreacherMentorMode(newMode);
                if (newMode) {
                  setStrongsMode(false); setPrincipleMode(false); setChainReferenceMode(false);
                  setCommentaryMode(false); setJeevesMode(false); setSermonIdeasMode(false);
                }
              }}
            >
              <Crown className="h-3.5 w-3.5 mr-1.5" />
              <span className="hidden sm:inline">Mentor</span>
            </Button>

            {/* More Tools Dropdown — absorbs StudyMode, Audio, Tag, and existing items */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <MoreHorizontal className="h-3.5 w-3.5 mr-1.5" />
                  {t('bible.more')}
                  {(strongsMode || principleMode || chainReferenceMode || sermonIdeasMode) && (
                    <span className="ml-1 h-2 w-2 rounded-full bg-primary" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                {/* Study Mode sub-section */}
                {!isBasic && (
                  <>
                    <DropdownMenuLabel className="text-xs text-muted-foreground">Study Mode</DropdownMenuLabel>
                    {studyModes.map((mode) => {
                      const Icon = mode.icon;
                      return (
                        <DropdownMenuItem
                          key={mode.id}
                          onClick={() => setStudyMode(mode.id)}
                          className={studyMode === mode.id ? "bg-primary/10" : ""}
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {mode.label}
                          {studyMode === mode.id && <Check className="h-4 w-4 ml-auto" />}
                        </DropdownMenuItem>
                      );
                    })}
                    <DropdownMenuSeparator />
                  </>
                )}

                {/* Audio */}
                <DropdownMenuItem asChild>
                  <QuickAudioButton
                    text={chapterData.verses.map(v => `Verse ${v.verse}. ${v.text}`).join(' ')}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2 cursor-pointer"
                  />
                </DropdownMenuItem>

                {/* Tag Friend */}
                <DropdownMenuItem asChild>
                  <TagFriendButton
                    pageTitle={`${book} ${chapter} - PT Study Bible`}
                    pageDescription={`Check out ${book} chapter ${chapter} in the Phototheology Study Bible`}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start cursor-pointer"
                  />
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Tool modes */}
                <DropdownMenuItem
                  onClick={() => {
                    setStrongsMode(!strongsMode);
                    setPrincipleMode(false); setChainReferenceMode(false); setCommentaryMode(false); setJeevesMode(false);
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
                    setStrongsMode(false); setChainReferenceMode(false); setCommentaryMode(false); setJeevesMode(false);
                    setSelectedVerses([]); setSelectedVerse(null);
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
                    setStrongsMode(false); setPrincipleMode(false); setCommentaryMode(false); setJeevesMode(false);
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
                        setStrongsMode(false); setPrincipleMode(false); setChainReferenceMode(false);
                        setCommentaryMode(false); setJeevesMode(false);
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

          {/* Right: badges + nav icons */}
          <div className="flex items-center gap-1.5">
            {sparks.length > 0 && (
              <Badge variant="outline" className="text-amber-500 border-amber-500/30 animate-pulse text-xs">
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
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => addBookmark(book, chapter)}
              disabled={isBookmarked(book, chapter)}
              title={isBookmarked(book, chapter) ? t('bible.bookmarked') : t('bible.bookmark')}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked(book, chapter) ? "fill-current text-primary" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => navigateChapter("prev")}
              disabled={chapter <= 1}
              title={t('bible.previous')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => navigateChapter("next")}
              title={t('bible.next')}
            >
              <ChevronRight className="h-4 w-4" />
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
        )}
      </div>

      <ImportPassageDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        passage={`${book} ${chapter}:${selectedVerse}`}
        verseText={selectedVerse ? chapterData.verses.find(v => v.verse === selectedVerse)?.text || "" : ""}
      />

      {/* === Main Content: Resizable on desktop, stacked on mobile === */}
      {isMobile ? (
        // Mobile: single column + drawer
        <div className="space-y-4">
          {scripturePane}
          {bottomNav}

          {/* Mobile Drawer */}
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
        </div>
      ) : (
        // Desktop: resizable split panel
        <div className="space-y-4">
          <ResizablePanelGroup
            direction="horizontal"
            className="rounded-xl border"
            style={{ height: 'calc(100vh - 10rem)' }}
          >
            {/* Scripture panel */}
            <ResizablePanel defaultSize={66} minSize={40}>
              <div className="h-full overflow-y-auto">
                {scripturePane}
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* AI / Study panel */}
            <ResizablePanel defaultSize={34} minSize={20}>
              <div className="h-full overflow-y-auto p-4 space-y-4" ref={jeevesRef}>
                {hasPanelContent ? panelContent : idlePanel}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>

          {bottomNav}
        </div>
      )}
    </div>
  );
};
