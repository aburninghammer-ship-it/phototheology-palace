import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchChapter, Translation } from "@/services/bibleApi";
import { Chapter } from "@/types/bible";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, BookOpen, Loader2, Link2, MessageSquare, Bot, Bookmark, Sparkles, Upload } from "lucide-react";
import { VerseView } from "./VerseView";
import { StrongsVerseView } from "./StrongsVerseView";
import { PrinciplePanel } from "./PrinciplePanel";
import { ChainReferencePanel } from "./ChainReferencePanel";
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
import { PTCodeSearch } from "./PTCodeSearch";
import { ThematicTagging } from "./ThematicTagging";
import { ThemeCrossReference } from "./ThemeCrossReference";
import { MemoryToolsPanel } from "./MemoryToolsPanel";
import { StudyModeSelector } from "./StudyModeSelector";
import { UserMetricsDashboard } from "./UserMetricsDashboard";
import { DimensionFilter } from "./DimensionFilter";

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
  const [studyMode, setStudyMode] = useState<"beginner" | "advanced" | "apologetics">("advanced");
  
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
  } = useBibleState(book, chapterParam);
  
  const { trackReading } = useReadingHistory();
  const { addBookmark, isBookmarked } = useBookmarks();
  const { preferences, loading: preferencesLoading } = useUserPreferences();
  const { handleError } = useErrorHandler();
  
  const [translation, setTranslation] = useState<Translation>("kjv");
  const jeevesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get translation from URL parameter or use preference
    const params = new URLSearchParams(window.location.search);
    const urlTranslation = params.get("t");
    if (urlTranslation) {
      setTranslation(urlTranslation as Translation);
    } else if (!preferencesLoading) {
      setTranslation(preferences.bible_translation as Translation);
    }
  }, [preferences.bible_translation, preferencesLoading]);

  useEffect(() => {
    loadChapter();
    trackReading(book, chapter);
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
            <h3 className="text-lg font-semibold mb-2">Failed to load chapter</h3>
            <p className="text-muted-foreground mb-4">
              {error || "Unable to load the chapter. Please try again."}
            </p>
          </div>
          <RetryButton onRetry={loadChapter}>
            Try Again
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
      {/* Chapter Header - Sticky */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur-sm border-b pb-4 -mx-4 px-4 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold bg-gradient-palace bg-clip-text text-transparent">
            {book} {chapter}
          </h1>
          <p className="text-muted-foreground mt-1">
            {chapterData.verses.length} verses
          </p>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <ReadingControls />
          <Button
            variant="outline"
            size="sm"
            onClick={() => addBookmark(book, chapter)}
            disabled={isBookmarked(book, chapter)}
          >
            <Bookmark className="h-4 w-4 mr-2" />
            {isBookmarked(book, chapter) ? "Bookmarked" : "Bookmark"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateChapter("prev")}
            disabled={chapter <= 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateChapter("next")}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      <PTCodeSearch />

      {/* Mode Toggles */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={strongsMode ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setStrongsMode(!strongsMode);
            setPrincipleMode(false);
            setChainReferenceMode(false);
            setCommentaryMode(false);
            setJeevesMode(false);
          }}
          className={strongsMode ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg" : ""}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Strong's Numbers
        </Button>
        <Button
          variant={principleMode ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setPrincipleMode(!principleMode);
            setStrongsMode(false);
            setChainReferenceMode(false);
            setCommentaryMode(false);
            setJeevesMode(false);
            setSelectedVerses([]);
            setSelectedVerse(null);
          }}
          className={principleMode ? "gradient-palace" : ""}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Principle Mode {selectedVerses.length > 0 && `(${selectedVerses.length})`}
        </Button>
        <Button
          variant={chainReferenceMode ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setChainReferenceMode(!chainReferenceMode);
            setStrongsMode(false);
            setPrincipleMode(false);
            setCommentaryMode(false);
            setJeevesMode(false);
            setHighlightedVerses([]);
          }}
          className={chainReferenceMode ? "gradient-palace" : ""}
        >
          <Link2 className="h-4 w-4 mr-2" />
          Links
        </Button>
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
          Commentary
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
            
            // Scroll to Jeeves section when opening
            if (newJeevesMode) {
              setTimeout(() => {
                jeevesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 100);
            }
          }}
          className={jeevesMode ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg" : ""}
        >
          <Bot className="h-4 w-4 mr-2" />
          Ask Jeeves
        </Button>
        {selectedVerse && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setImportDialogOpen(true)}
            className="gradient-palace"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import to Lesson
          </Button>
        )}
      </div>

      <ImportPassageDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        passage={`${book} ${chapter}:${selectedVerse}`}
        verseText={selectedVerse ? chapterData.verses.find(v => v.verse === selectedVerse)?.text || "" : ""}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Reading Pane */}
        <div className="lg:col-span-2 space-y-6">
          {/* Study Mode & Metrics */}
          <StudyModeSelector activeMode={studyMode} onModeChange={setStudyMode} />
          <UserMetricsDashboard />
          
          <Card className={`p-6 shadow-elegant hover:shadow-hover transition-smooth ${preferences.reading_mode === 'focus' ? 'max-w-3xl mx-auto' : ''}`}>
            <div className={`space-y-4 ${fontSizeClass}`}>
              {strongsMode ? (
                chapterData.verses.map((verse) => (
                  <StrongsVerseView
                    key={`${verse.book}-${verse.chapter}-${verse.verse}`}
                    verse={verse}
                    isSelected={selectedVerse === verse.verse}
                    onSelect={() => handleVerseClick(verse.verse)}
                    showPrinciples={false}
                    isHighlighted={highlightedVerses.includes(verse.verse)}
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
                  />
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Right Panel - Dynamic based on mode - Floating/Sticky */}
        <div className="lg:col-span-1 space-y-6 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto" ref={jeevesRef}>
          {/* Dimension Filter (Advanced Mode Only) */}
          {studyMode === "advanced" && (
            <DimensionFilter 
              activeDimensions={activeDimensions}
              onToggle={toggleDimension}
            />
          )}
          
          {chainReferenceMode ? (
            <ChainReferencePanel
              book={book}
              chapter={chapter}
              verses={chapterData.verses}
              onHighlight={setHighlightedVerses}
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
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Selected Verses ({selectedVerses.length})</h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedVerses([])}>
                  Clear
                </Button>
              </div>
              <div className="space-y-2 max-h-[400px] overflow-auto">
                {selectedVerses.map(v => (
                  <div key={v} className="p-3 rounded-lg border bg-card/50 text-sm">
                    <span className="font-semibold text-primary">{v}.</span>{" "}
                    {chapterData.verses.find(verse => verse.verse === v)?.text}
                  </div>
                ))}
              </div>
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
            </Card>
          ) : selectedVerse ? (
            <>
              {/* Always show Memory Tools */}
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
              
              {/* Apologetics Panel (Apologetics & Advanced modes) */}
              {(studyMode === "apologetics" || studyMode === "advanced") && (
                <ApologeticsPanel
                  book={book}
                  chapter={chapter}
                  verse={selectedVerse}
                  verseText={chapterData.verses.find(v => v.verse === selectedVerse)?.text || ""}
                />
              )}
              
              {/* Thematic Tagging (Advanced & Beginner modes) */}
              {(studyMode === "advanced" || studyMode === "beginner") && (
                <ThematicTagging
                  book={book}
                  chapter={chapter}
                  verse={selectedVerse}
                  verseText={chapterData.verses.find(v => v.verse === selectedVerse)?.text || ""}
                />
              )}
              
              {/* Theme Cross-Reference (Advanced mode) */}
              {studyMode === "advanced" && (
                <ThemeCrossReference
                  currentVerse={`${book} ${chapter}:${selectedVerse}`}
                />
              )}
            </>
          ) : (
            <Card className="p-6 text-center text-muted-foreground sticky top-24">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-primary/50" />
              <p className="text-sm">
                {strongsMode
                  ? "Click on words with ✨ for AI Hebrew/Greek analysis, or click Strong's numbers for definitions"
                  : principleMode
                  ? "Select one or more verses to analyze with Phototheology principles"
                  : (jeevesMode || commentaryMode)
                  ? "Select a verse to interact with AI commentary and ask questions"
                  : "Select a verse to view principles, cross-references, and commentary"}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
