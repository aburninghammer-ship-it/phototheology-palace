import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchChapter, Translation } from "@/services/bibleApi";
import { Chapter } from "@/types/bible";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, BookOpen, Loader2, Link2, MessageSquare, Bot, Bookmark } from "lucide-react";
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

export const BibleReader = () => {
  const { book = "John", chapter: chapterParam = "3" } = useParams();
  const navigate = useNavigate();
  const chapter = parseInt(chapterParam);
  
  const [chapterData, setChapterData] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [principleMode, setPrincipleMode] = useState(false);
  const [chainReferenceMode, setChainReferenceMode] = useState(false);
  const [commentaryMode, setCommentaryMode] = useState(false);
  const [jeevesMode, setJeevesMode] = useState(false);
  const [highlightedVerses, setHighlightedVerses] = useState<number[]>([]);
  const [translation, setTranslation] = useState<Translation>("kjv");

  useEffect(() => {
    // Get translation from URL parameter
    const params = new URLSearchParams(window.location.search);
    const urlTranslation = params.get("t");
    if (urlTranslation) {
      setTranslation(urlTranslation as Translation);
    }
  }, []);

  const { trackReading } = useReadingHistory();
  const { addBookmark, isBookmarked } = useBookmarks();
  const { preferences } = useUserPreferences();
  const { handleError } = useErrorHandler();

  useEffect(() => {
    loadChapter();
    trackReading(book, chapter);
  }, [book, chapter]);

  const loadChapter = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use 'kjv' for API call even if 'kjv-strongs' is selected
      const apiTranslation = translation === "kjv-strongs" ? "kjv" : translation;
      const data = await fetchChapter(book, chapter, apiTranslation as Translation);
      setChapterData(data);
      setError(null);
    } catch (error) {
      const message = handleError(error, {
        title: "Failed to load chapter",
        showToast: false,
      });
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const navigateChapter = (direction: "prev" | "next") => {
    const newChapter = direction === "prev" ? chapter - 1 : chapter + 1;
    if (newChapter > 0) {
      navigate(`/bible/${book}/${newChapter}`);
      setSelectedVerse(null);
    }
  };

  if (loading) {
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
          variant={principleMode ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setPrincipleMode(!principleMode);
            setChainReferenceMode(false);
            setCommentaryMode(false);
            setJeevesMode(false);
          }}
          className={principleMode ? "gradient-palace" : ""}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Principle Mode
        </Button>
        <Button
          variant={chainReferenceMode ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setChainReferenceMode(!chainReferenceMode);
            setPrincipleMode(false);
            setCommentaryMode(false);
            setJeevesMode(false);
            setHighlightedVerses([]);
          }}
          className={chainReferenceMode ? "gradient-palace" : ""}
        >
          <Link2 className="h-4 w-4 mr-2" />
          Chain Reference
        </Button>
        <Button
          variant={commentaryMode ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setCommentaryMode(!commentaryMode);
            setPrincipleMode(false);
            setChainReferenceMode(false);
            setJeevesMode(false);
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
            setJeevesMode(!jeevesMode);
            setPrincipleMode(false);
            setChainReferenceMode(false);
            setCommentaryMode(false);
          }}
          className={jeevesMode ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg" : ""}
        >
          <Bot className="h-4 w-4 mr-2" />
          Ask Jeeves
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Reading Pane */}
        <div className="lg:col-span-2">
          <Card className={`p-6 shadow-elegant hover:shadow-hover transition-smooth ${preferences.reading_mode === 'focus' ? 'max-w-3xl mx-auto' : ''}`}>
            <div className={`space-y-4 ${fontSizeClass}`}>
              {chapterData.verses.map((verse) => 
                translation === "kjv-strongs" ? (
                  <StrongsVerseView
                    key={`${verse.book}-${verse.chapter}-${verse.verse}`}
                    verse={verse}
                    isSelected={selectedVerse === verse.verse}
                    onSelect={() => setSelectedVerse(verse.verse)}
                    showPrinciples={principleMode}
                    isHighlighted={highlightedVerses.includes(verse.verse)}
                  />
                ) : (
                  <VerseView
                    key={`${verse.book}-${verse.chapter}-${verse.verse}`}
                    verse={verse}
                    isSelected={selectedVerse === verse.verse}
                    onSelect={() => setSelectedVerse(verse.verse)}
                    showPrinciples={principleMode}
                    isHighlighted={highlightedVerses.includes(verse.verse)}
                  />
                )
              )}
            </div>
          </Card>
        </div>

        {/* Right Panel - Dynamic based on mode */}
        <div className="lg:col-span-1">
          {chainReferenceMode ? (
            <ChainReferencePanel
              book={book}
              chapter={chapter}
              verses={chapterData.verses}
              onHighlight={setHighlightedVerses}
            />
          ) : jeevesMode && selectedVerse ? (
            <JeevesVerseAssistant
              book={book}
              chapter={chapter}
              verse={selectedVerse}
              verseText={chapterData.verses.find(v => v.verse === selectedVerse)?.text || ""}
              onClose={() => setSelectedVerse(null)}
            />
          ) : commentaryMode && selectedVerse ? (
            <CommentaryPanel
              book={book}
              chapter={chapter}
              verse={selectedVerse}
              verseText={chapterData.verses.find(v => v.verse === selectedVerse)?.text || ""}
              onClose={() => setSelectedVerse(null)}
            />
          ) : selectedVerse ? (
            <PrinciplePanel
              book={book}
              chapter={chapter}
              verse={selectedVerse}
              verseText={chapterData.verses.find(v => v.verse === selectedVerse)?.text || ""}
              onClose={() => setSelectedVerse(null)}
            />
          ) : (
            <Card className="p-6 text-center text-muted-foreground sticky top-24">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-primary/50" />
              <p className="text-sm">
                {jeevesMode
                  ? "Select a verse to ask Jeeves questions using any room or principle"
                  : commentaryMode
                  ? "Select a verse for AI-powered commentary using your chosen principles"
                  : "Select a verse to view principles, cross-references, and commentary"}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
