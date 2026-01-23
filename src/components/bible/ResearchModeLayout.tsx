import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchChapter, Translation } from "@/services/bibleApi";
import { Chapter } from "@/types/bible";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  X, 
  Maximize2,
  Minimize2,
  MessageSquare,
  Bot,
  Link2,
  Sparkles,
  Book,
  Languages
} from "lucide-react";
import { ResearchBooksPanel } from "./ResearchBooksPanel";
import { ResearchVersesPanel } from "./ResearchVersesPanel";
import { ResearchCommentaryPanel } from "./ResearchCommentaryPanel";
import { ResearchDictionaryPanel } from "./ResearchDictionaryPanel";
import { cn } from "@/lib/utils";

interface ResearchModeLayoutProps {
  onExitResearchMode: () => void;
}

export const ResearchModeLayout = ({ onExitResearchMode }: ResearchModeLayoutProps) => {
  const { book = "John", chapter: chapterParam = "3" } = useParams();
  const navigate = useNavigate();
  const chapter = parseInt(chapterParam);
  
  const [chapterData, setChapterData] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [translation, setTranslation] = useState<Translation>("kjv");
  const [expandedPanel, setExpandedPanel] = useState<string | null>(null);
  const [activeCommentary, setActiveCommentary] = useState("jeeves");
  const [activeDictionary, setActiveDictionary] = useState("strongs");

  useEffect(() => {
    loadChapter();
  }, [book, chapter, translation]);

  const loadChapter = async () => {
    setLoading(true);
    try {
      const data = await fetchChapter(book, chapter, translation);
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
      navigate(`/bible/${book}/${newChapter}?mode=research`);
      setSelectedVerse(null);
    }
  };

  const handleBookSelect = (selectedBook: string, selectedChapter: number) => {
    navigate(`/bible/${selectedBook}/${selectedChapter}?mode=research`);
    setSelectedVerse(null);
  };

  const toggleExpand = (panel: string) => {
    setExpandedPanel(expandedPanel === panel ? null : panel);
  };

  const selectedVerseText = selectedVerse 
    ? chapterData?.verses.find(v => v.verse === selectedVerse)?.text || ""
    : "";

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
      {/* Top Toolbar - Glass */}
      <div className="h-14 border-b border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-between px-4 shrink-0 shadow-lg shadow-black/5">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onExitResearchMode}
            className="bg-white/10 hover:bg-white/20 border border-white/10"
          >
            <X className="h-4 w-4 mr-2" />
            Exit Research Mode
          </Button>
          <div className="h-6 w-px bg-white/20" />
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="font-serif text-xl font-semibold bg-gradient-palace bg-clip-text text-transparent">
              {book} {chapter}
            </span>
          </div>
          <Badge variant="outline" className="text-xs bg-white/10 border-white/20">
            {chapterData?.verses.length || 0} verses
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateChapter("prev")}
            disabled={chapter <= 1}
            className="bg-white/10 hover:bg-white/20 border border-white/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateChapter("next")}
            className="bg-white/10 hover:bg-white/20 border border-white/10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content - 3 Column Layout */}
      <div className="flex-1 flex overflow-hidden p-2 gap-2">
        {/* Left Panel - Bible Books - Glass */}
        <div 
          className={cn(
            "rounded-xl bg-white/5 backdrop-blur-md border border-white/10 transition-all duration-300 shrink-0 shadow-xl shadow-black/10 overflow-hidden",
            expandedPanel === "books" ? "w-80" : "w-52"
          )}
        >
          <div className="h-10 border-b border-white/10 bg-white/5 flex items-center justify-between px-3">
            <span className="text-sm font-medium flex items-center gap-2">
              <Book className="h-4 w-4 text-primary" />
              Bible Books
            </span>
            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-white/10" onClick={() => toggleExpand("books")}>
              {expandedPanel === "books" ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
            </Button>
          </div>
          <ScrollArea className="h-[calc(100%-2.5rem)]">
            <ResearchBooksPanel 
              currentBook={book} 
              currentChapter={chapter}
              onSelect={handleBookSelect}
              compact={expandedPanel !== "books"}
            />
          </ScrollArea>
        </div>

        {/* Center Panel - Bible Text & Dictionaries - Glass */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden gap-2">
          {/* Bible Text - Top */}
          <div className={cn(
            "rounded-xl bg-white/5 backdrop-blur-md border border-white/10 transition-all duration-300 shadow-xl shadow-black/10 overflow-hidden",
            expandedPanel === "text" ? "flex-1" : "h-1/2"
          )}>
            <div className="h-10 border-b border-white/10 bg-white/5 flex items-center justify-between px-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Scripture</span>
                <Tabs value={translation} onValueChange={(v) => setTranslation(v as Translation)} className="h-8">
                  <TabsList className="h-7 bg-white/10 border border-white/10">
                    <TabsTrigger value="kjv" className="text-xs h-6 px-2 data-[state=active]:bg-primary/30">KJV</TabsTrigger>
                    <TabsTrigger value="asv" className="text-xs h-6 px-2 data-[state=active]:bg-primary/30">ASV</TabsTrigger>
                    <TabsTrigger value="web" className="text-xs h-6 px-2 data-[state=active]:bg-primary/30">WEB</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-white/10" onClick={() => toggleExpand("text")}>
                {expandedPanel === "text" ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
              </Button>
            </div>
            <ScrollArea className="h-[calc(100%-2.5rem)]">
              <ResearchVersesPanel 
                verses={chapterData?.verses || []}
                selectedVerse={selectedVerse}
                onVerseSelect={setSelectedVerse}
                loading={loading}
              />
            </ScrollArea>
          </div>

          {/* Dictionary Panel - Bottom */}
          {expandedPanel !== "text" && (
            <div className="flex-1 min-h-0 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl shadow-black/10 overflow-hidden">
              <div className="h-10 border-b border-white/10 bg-white/5 flex items-center justify-between px-3">
                <div className="flex items-center gap-2">
                  <Languages className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Dictionaries</span>
                  <Tabs value={activeDictionary} onValueChange={setActiveDictionary} className="h-8">
                    <TabsList className="h-7 bg-white/10 border border-white/10">
                      <TabsTrigger value="strongs" className="text-xs h-6 px-2 data-[state=active]:bg-primary/30">Strong's</TabsTrigger>
                      <TabsTrigger value="thayers" className="text-xs h-6 px-2 data-[state=active]:bg-primary/30">Thayer's</TabsTrigger>
                      <TabsTrigger value="bdb" className="text-xs h-6 px-2 data-[state=active]:bg-primary/30">BDB</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-white/10" onClick={() => toggleExpand("dictionary")}>
                  {expandedPanel === "dictionary" ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
                </Button>
              </div>
              <ScrollArea className="h-[calc(100%-2.5rem)]">
                <ResearchDictionaryPanel 
                  book={book}
                  chapter={chapter}
                  verse={selectedVerse}
                  verseText={selectedVerseText}
                  activeDictionary={activeDictionary}
                />
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Right Panel - Commentaries - Glass */}
        <div 
          className={cn(
            "rounded-xl bg-white/5 backdrop-blur-md border border-white/10 transition-all duration-300 shrink-0 shadow-xl shadow-black/10 overflow-hidden",
            expandedPanel === "commentary" ? "w-[500px]" : "w-80"
          )}
        >
          <div className="h-10 border-b border-white/10 bg-white/5 flex items-center justify-between px-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Commentary</span>
              <Tabs value={activeCommentary} onValueChange={setActiveCommentary} className="h-8">
                <TabsList className="h-7 bg-white/10 border border-white/10">
                  <TabsTrigger value="jeeves" className="text-xs h-6 px-2 data-[state=active]:bg-primary/30">
                    <Bot className="h-3 w-3 mr-1" />
                    Jeeves
                  </TabsTrigger>
                  <TabsTrigger value="principles" className="text-xs h-6 px-2 data-[state=active]:bg-primary/30">
                    <Sparkles className="h-3 w-3 mr-1" />
                    PT
                  </TabsTrigger>
                  <TabsTrigger value="crossref" className="text-xs h-6 px-2 data-[state=active]:bg-primary/30">
                    <Link2 className="h-3 w-3 mr-1" />
                    Links
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-white/10" onClick={() => toggleExpand("commentary")}>
              {expandedPanel === "commentary" ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
            </Button>
          </div>
          <ScrollArea className="h-[calc(100%-2.5rem)]">
            <ResearchCommentaryPanel 
              book={book}
              chapter={chapter}
              verse={selectedVerse}
              verseText={selectedVerseText}
              activeTab={activeCommentary}
            />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};
