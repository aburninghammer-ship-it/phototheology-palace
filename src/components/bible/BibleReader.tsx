import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchChapter, Translation } from "@/services/bibleApi";
import { Chapter } from "@/types/bible";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export const BibleReader = () => {
  const { book = "John", chapter: chapterParam = "3" } = useParams();
  const navigate = useNavigate();
  const chapter = parseInt(chapterParam);
  
  const [chapterData, setChapterData] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [selectedVerses, setSelectedVerses] = useState<number[]>([]);
  const [principleMode, setPrincipleMode] = useState(false);
  const [strongsMode, setStrongsMode] = useState(false);
  const [highlightedVerses, setHighlightedVerses] = useState<number[]>([]);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  
  const { trackReading } = useReadingHistory();
  const { addBookmark, isBookmarked } = useBookmarks();
  const { preferences, loading: preferencesLoading } = useUserPreferences();
  const { handleError } = useErrorHandler();
  
  const [translation, setTranslation] = useState<Translation>("kjv");

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
      {/* Chapter Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
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

      {/* Mode Toggles */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={strongsMode ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setStrongsMode(!strongsMode);
            setPrincipleMode(false);
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
            setSelectedVerses([]);
            setSelectedVerse(null);
          }}
          className={principleMode ? "gradient-palace" : ""}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Principle Mode {selectedVerses.length > 0 && `(${selectedVerses.length})`}
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
        <div className="lg:col-span-2">
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

        {/* Right Panel - Jeeves Assistant with Tabs */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <Tabs defaultValue="links" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="links" className="flex items-center gap-2">
                  <Link2 className="h-4 w-4" />
                  Links
                </TabsTrigger>
                <TabsTrigger value="commentary" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Commentary
                </TabsTrigger>
                <TabsTrigger value="jeeves" className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  Jeeves
                </TabsTrigger>
              </TabsList>

              <TabsContent value="links" className="mt-4">
                <ChainReferencePanel
                  book={book}
                  chapter={chapter}
                  verses={chapterData.verses}
                  onHighlight={setHighlightedVerses}
                />
              </TabsContent>

              <TabsContent value="commentary" className="mt-4">
                {selectedVerse ? (
                  <CommentaryPanel
                    book={book}
                    chapter={chapter}
                    verse={selectedVerse}
                    verseText={chapterData.verses.find(v => v.verse === selectedVerse)?.text || ""}
                    onClose={() => setSelectedVerse(null)}
                  />
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 text-primary/50" />
                    <p className="text-sm">Select a verse to view commentary</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="jeeves" className="mt-4">
                {selectedVerse ? (
                  <JeevesVerseAssistant
                    book={book}
                    chapter={chapter}
                    verse={selectedVerse}
                    verseText={chapterData.verses.find(v => v.verse === selectedVerse)?.text || ""}
                    onClose={() => setSelectedVerse(null)}
                  />
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Bot className="h-12 w-12 mx-auto mb-3 text-primary/50" />
                    <p className="text-sm">Select a verse to ask Jeeves</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};
