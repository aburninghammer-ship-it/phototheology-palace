import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchChapter, Translation } from "@/services/bibleApi";
import { Chapter } from "@/types/bible";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Languages,
  Columns,
  GitBranch,
  Building2,
  RotateCcw,
  Layers,
  Landmark,
  ArrowUpRight,
  StickyNote
} from "lucide-react";
import { ResearchBooksPanel } from "./ResearchBooksPanel";
import { ResearchVersesPanel } from "./ResearchVersesPanel";
import { ResearchCommentaryPanel } from "./ResearchCommentaryPanel";
import { ResearchDictionaryPanel } from "./ResearchDictionaryPanel";
import { ResearchParallelPanel } from "./research/ResearchParallelPanel";
import { ResearchPTToolsPanel } from "./research/ResearchPTToolsPanel";
import { ResearchVerseGeneticsPanel } from "./research/ResearchVerseGeneticsPanel";
import { ResearchUserNotesPanel } from "./research/ResearchUserNotesPanel";
import { cn } from "@/lib/utils";

interface ResearchModeLayoutProps {
  onExitResearchMode: () => void;
}

type CenterView = "single" | "parallel";
type RightTab = "jeeves" | "principles" | "crossref" | "notes" | "palace" | "cycles" | "heavens" | "sanctuary" | "ascensions" | "genetics";

export const ResearchModeLayout = ({ onExitResearchMode }: ResearchModeLayoutProps) => {
  const { book = "John", chapter: chapterParam = "3" } = useParams();
  const navigate = useNavigate();
  const chapter = parseInt(chapterParam);
  
  const [chapterData, setChapterData] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [translation, setTranslation] = useState<Translation>("kjv");
  const [expandedPanel, setExpandedPanel] = useState<string | null>(null);
  const [centerView, setCenterView] = useState<CenterView>("single");
  const [rightTab, setRightTab] = useState<RightTab>("jeeves");
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

  // Determine which panel to show on the right based on tab
  const isCommentaryTab = ["jeeves", "principles", "crossref"].includes(rightTab);
  const isPTToolTab = ["palace", "cycles", "heavens", "sanctuary", "ascensions"].includes(rightTab);
  const isGeneticsTab = rightTab === "genetics";
  const isNotesTab = rightTab === "notes";

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
            Exit
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
          
          {/* Center View Toggle */}
          <div className="h-6 w-px bg-white/20 ml-2" />
          <div className="flex gap-1">
            <Button
              variant={centerView === "single" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCenterView("single")}
              className={cn("h-7 text-xs", centerView === "single" && "bg-primary/80")}
            >
              <BookOpen className="h-3 w-3 mr-1" />
              Single
            </Button>
            <Button
              variant={centerView === "parallel" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCenterView("parallel")}
              className={cn("h-7 text-xs", centerView === "parallel" && "bg-primary/80")}
            >
              <Columns className="h-3 w-3 mr-1" />
              Parallel
            </Button>
          </div>
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
        {/* Left Panel - Bible Books */}
        <div 
          className={cn(
            "rounded-xl bg-white/5 backdrop-blur-md border border-white/10 transition-all duration-300 shrink-0 shadow-xl shadow-black/10 overflow-hidden",
            expandedPanel === "books" ? "w-72" : "w-44"
          )}
        >
          <div className="h-10 border-b border-white/10 bg-white/5 flex items-center justify-between px-3">
            <span className="text-sm font-medium flex items-center gap-2">
              <Book className="h-4 w-4 text-primary" />
              Books
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

        {/* Center Panel - Bible Text & Dictionaries */}
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
                {centerView === "single" && (
                  <Tabs value={translation} onValueChange={(v) => setTranslation(v as Translation)} className="h-8">
                    <TabsList className="h-7 bg-white/10 border border-white/10">
                      <TabsTrigger value="kjv" className="text-xs h-6 px-2 data-[state=active]:bg-primary/30">KJV</TabsTrigger>
                      <TabsTrigger value="asv" className="text-xs h-6 px-2 data-[state=active]:bg-primary/30">ASV</TabsTrigger>
                      <TabsTrigger value="web" className="text-xs h-6 px-2 data-[state=active]:bg-primary/30">WEB</TabsTrigger>
                      <TabsTrigger value="ylt" className="text-xs h-6 px-2 data-[state=active]:bg-primary/30">YLT</TabsTrigger>
                      <TabsTrigger value="darby" className="text-xs h-6 px-2 data-[state=active]:bg-primary/30">Darby</TabsTrigger>
                    </TabsList>
                  </Tabs>
                )}
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-white/10" onClick={() => toggleExpand("text")}>
                {expandedPanel === "text" ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
              </Button>
            </div>
            
            {centerView === "single" ? (
              <ScrollArea className="h-[calc(100%-2.5rem)]">
                <ResearchVersesPanel 
                  verses={chapterData?.verses || []}
                  selectedVerse={selectedVerse}
                  onVerseSelect={setSelectedVerse}
                  loading={loading}
                />
              </ScrollArea>
            ) : (
              <ResearchParallelPanel
                book={book}
                chapter={chapter}
                selectedVerse={selectedVerse}
                onVerseSelect={setSelectedVerse}
              />
            )}
          </div>

          {/* Dictionary Panel - Bottom */}
          {expandedPanel !== "text" && (
            <div className="flex-1 min-h-0 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl shadow-black/10 overflow-hidden">
              <div className="h-10 border-b border-white/10 bg-white/5 flex items-center justify-between px-3">
                <div className="flex items-center gap-2">
                  <Languages className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Dictionary</span>
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

        {/* Right Panel - PT Tools & Commentary */}
        <div 
          className={cn(
            "rounded-xl bg-white/5 backdrop-blur-md border border-white/10 transition-all duration-300 shrink-0 shadow-xl shadow-black/10 overflow-hidden flex flex-col",
            expandedPanel === "commentary" ? "w-[500px]" : "w-80"
          )}
        >
          {/* Tab Categories */}
          <div className="border-b border-white/10 bg-white/5 p-2">
            <div className="flex flex-wrap gap-1">
              {/* AI & Commentary */}
              <Button
                size="sm"
                variant={rightTab === "jeeves" ? "default" : "ghost"}
                onClick={() => setRightTab("jeeves")}
                className={cn("h-6 text-[10px] px-2", rightTab === "jeeves" && "bg-primary/80")}
              >
                <Bot className="h-3 w-3 mr-1" />
                Jeeves
              </Button>
              <Button
                size="sm"
                variant={rightTab === "crossref" ? "default" : "ghost"}
                onClick={() => setRightTab("crossref")}
                className={cn("h-6 text-[10px] px-2", rightTab === "crossref" && "bg-primary/80")}
              >
                <Link2 className="h-3 w-3 mr-1" />
                Links
              </Button>
              <Button
                size="sm"
                variant={rightTab === "genetics" ? "default" : "ghost"}
                onClick={() => setRightTab("genetics")}
                className={cn("h-6 text-[10px] px-2", rightTab === "genetics" && "bg-primary/80")}
              >
                <GitBranch className="h-3 w-3 mr-1" />
                Genetics
              </Button>
              <Button
                size="sm"
                variant={rightTab === "notes" ? "default" : "ghost"}
                onClick={() => setRightTab("notes")}
                className={cn("h-6 text-[10px] px-2", rightTab === "notes" && "bg-amber-600/80")}
              >
                <StickyNote className="h-3 w-3 mr-1" />
                Notes
              </Button>
              
              <div className="w-px h-4 bg-white/20 mx-1 self-center" />
              
              {/* PT Tools */}
              <Button
                size="sm"
                variant={rightTab === "palace" ? "default" : "ghost"}
                onClick={() => setRightTab("palace")}
                className={cn("h-6 text-[10px] px-2", rightTab === "palace" && "bg-primary/80")}
              >
                <Building2 className="h-3 w-3 mr-1" />
                Palace
              </Button>
              <Button
                size="sm"
                variant={rightTab === "cycles" ? "default" : "ghost"}
                onClick={() => setRightTab("cycles")}
                className={cn("h-6 text-[10px] px-2", rightTab === "cycles" && "bg-primary/80")}
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Cycles
              </Button>
              <Button
                size="sm"
                variant={rightTab === "heavens" ? "default" : "ghost"}
                onClick={() => setRightTab("heavens")}
                className={cn("h-6 text-[10px] px-2", rightTab === "heavens" && "bg-primary/80")}
              >
                <Layers className="h-3 w-3 mr-1" />
                3H
              </Button>
              <Button
                size="sm"
                variant={rightTab === "sanctuary" ? "default" : "ghost"}
                onClick={() => setRightTab("sanctuary")}
                className={cn("h-6 text-[10px] px-2", rightTab === "sanctuary" && "bg-primary/80")}
              >
                <Landmark className="h-3 w-3 mr-1" />
                Sanct.
              </Button>
              <Button
                size="sm"
                variant={rightTab === "ascensions" ? "default" : "ghost"}
                onClick={() => setRightTab("ascensions")}
                className={cn("h-6 text-[10px] px-2", rightTab === "ascensions" && "bg-primary/80")}
              >
                <ArrowUpRight className="h-3 w-3 mr-1" />
                5Asc
              </Button>
            </div>
          </div>

          {/* Panel Header */}
          <div className="h-10 border-b border-white/10 bg-white/5 flex items-center justify-between px-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {rightTab === "jeeves" && "Jeeves AI Commentary"}
                {rightTab === "crossref" && "Cross References"}
                {rightTab === "genetics" && "Verse Genetics"}
                {rightTab === "notes" && "My Study Notes"}
                {rightTab === "palace" && "Palace Floors & Rooms"}
                {rightTab === "cycles" && "8 Covenant Cycles"}
                {rightTab === "heavens" && "Three Heavens"}
                {rightTab === "sanctuary" && "Sanctuary Blueprint"}
                {rightTab === "ascensions" && "Five Ascensions"}
              </span>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-white/10" onClick={() => toggleExpand("commentary")}>
              {expandedPanel === "commentary" ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
            </Button>
          </div>

          {/* Panel Content */}
          <ScrollArea className="flex-1">
            {isCommentaryTab && (
              <ResearchCommentaryPanel 
                book={book}
                chapter={chapter}
                verse={selectedVerse}
                verseText={selectedVerseText}
                activeTab={rightTab}
              />
            )}
            {isPTToolTab && (
              <ResearchPTToolsPanel
                book={book}
                chapter={chapter}
                verse={selectedVerse}
                verseText={selectedVerseText}
                activeTab={rightTab}
              />
            )}
            {isGeneticsTab && (
              <ResearchVerseGeneticsPanel
                book={book}
                chapter={chapter}
                verse={selectedVerse}
                verseText={selectedVerseText}
              />
            )}
            {isNotesTab && (
              <ResearchUserNotesPanel
                book={book}
                chapter={chapter}
                verse={selectedVerse}
                verseText={selectedVerseText}
              />
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};
