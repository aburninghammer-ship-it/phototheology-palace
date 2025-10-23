import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchChapter } from "@/services/bibleApi";
import { Chapter } from "@/types/bible";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, BookOpen, Loader2 } from "lucide-react";
import { VerseView } from "./VerseView";
import { PrinciplePanel } from "./PrinciplePanel";

export const BibleReader = () => {
  const { book = "John", chapter: chapterParam = "3" } = useParams();
  const navigate = useNavigate();
  const chapter = parseInt(chapterParam);
  
  const [chapterData, setChapterData] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [principleMode, setPrincipleMode] = useState(false);

  useEffect(() => {
    loadChapter();
  }, [book, chapter]);

  const loadChapter = async () => {
    setLoading(true);
    try {
      const data = await fetchChapter(book, chapter);
      setChapterData(data);
    } catch (error) {
      console.error("Failed to load chapter:", error);
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
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!chapterData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load chapter</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Chapter Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold bg-gradient-palace bg-clip-text text-transparent">
            {book} {chapter}
          </h1>
          <p className="text-muted-foreground mt-1">
            {chapterData.verses.length} verses
          </p>
        </div>
        
        <div className="flex gap-2">
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
          onClick={() => setPrincipleMode(!principleMode)}
          className={principleMode ? "gradient-palace" : ""}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Principle Mode
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Reading Pane */}
        <div className="lg:col-span-2">
          <Card className="p-6 shadow-elegant hover:shadow-hover transition-smooth">
            <div className="space-y-4">
              {chapterData.verses.map((verse) => (
                <VerseView
                  key={`${verse.book}-${verse.chapter}-${verse.verse}`}
                  verse={verse}
                  isSelected={selectedVerse === verse.verse}
                  onSelect={() => setSelectedVerse(verse.verse)}
                  showPrinciples={principleMode}
                />
              ))}
            </div>
          </Card>
        </div>

        {/* Principle/Commentary Panel */}
        <div className="lg:col-span-1">
          {selectedVerse ? (
            <PrinciplePanel
              book={book}
              chapter={chapter}
              verse={selectedVerse}
              onClose={() => setSelectedVerse(null)}
            />
          ) : (
            <Card className="p-6 text-center text-muted-foreground sticky top-24">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-primary/50" />
              <p className="text-sm">
                Select a verse to view principles, cross-references, and commentary
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
