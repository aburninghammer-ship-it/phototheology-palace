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
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-palace-purple/10 overflow-hidden">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-palace-purple/20 rounded-full blur-3xl animate-pulse-subtle" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-palace-teal/15 rounded-full blur-3xl animate-pulse-subtle" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-palace-orange/10 rounded-full blur-3xl animate-pulse-subtle" style={{ animationDelay: '2s' }} />
      </div>

      {/* Top Toolbar - Enhanced Glass */}
      <div className="h-14 border-b border-white/20 bg-gradient-to-r from-card/80 via-card/60 to-card/80 backdrop-blur-xl flex items-center justify-between px-4 shrink-0 shadow-lg shadow-palace-purple/10">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onExitResearchMode}
            className="bg-destructive/10 hover:bg-destructive/20 border border-destructive/30 text-destructive hover:text-destructive"
          >
            <X className="h-4 w-4 mr-2" />
            Exit
          </Button>
          <div className="h-6 w-px bg-gradient-to-b from-transparent via-palace-purple/40 to-transparent" />
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-palace shadow-lg shadow-palace-purple/30">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="font-serif text-xl font-semibold bg-gradient-palace bg-clip-text text-transparent drop-shadow-sm">
              {book} {chapter}
            </span>
          </div>
          <Badge className="text-xs bg-palace-teal/20 border-palace-teal/40 text-palace-teal">
            {chapterData?.verses.length || 0} verses
          </Badge>
          
          {/* Center View Toggle */}
          <div className="h-6 w-px bg-gradient-to-b from-transparent via-palace-purple/40 to-transparent ml-2" />
          <div className="flex gap-1 p-1 rounded-lg bg-white/5 border border-white/10">
            <Button
              variant={centerView === "single" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCenterView("single")}
              className={cn("h-7 text-xs transition-all", centerView === "single" ? "bg-gradient-palace shadow-md shadow-palace-purple/30" : "hover:bg-white/10")}
            >
              <BookOpen className="h-3 w-3 mr-1" />
              Single
            </Button>
            <Button
              variant={centerView === "parallel" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCenterView("parallel")}
              className={cn("h-7 text-xs transition-all", centerView === "parallel" ? "bg-gradient-ocean shadow-md shadow-palace-blue/30" : "hover:bg-white/10")}
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
            className="bg-palace-purple/10 hover:bg-palace-purple/20 border border-palace-purple/30 hover:border-palace-purple/50 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateChapter("next")}
            className="bg-palace-purple/10 hover:bg-palace-purple/20 border border-palace-purple/30 hover:border-palace-purple/50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content - 3 Column Layout */}
      <div className="flex-1 flex overflow-hidden p-3 gap-3">
        {/* Left Panel - Bible Books */}
        <div 
          className={cn(
            "rounded-2xl bg-gradient-to-b from-card/90 to-card/70 backdrop-blur-xl border border-palace-purple/20 transition-all duration-300 shrink-0 shadow-xl shadow-palace-purple/10 overflow-hidden",
            expandedPanel === "books" ? "w-72" : "w-44"
          )}
        >
          <div className="h-10 border-b border-palace-purple/20 bg-gradient-to-r from-palace-purple/10 to-palace-teal/10 flex items-center justify-between px-3">
            <span className="text-sm font-medium flex items-center gap-2">
              <div className="p-1 rounded-md bg-palace-green/20">
                <Book className="h-3.5 w-3.5 text-palace-green" />
              </div>
              <span className="bg-gradient-forest bg-clip-text text-transparent font-semibold">Books</span>
            </span>
            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-palace-purple/20" onClick={() => toggleExpand("books")}>
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
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden gap-3">
          {/* Bible Text - Top */}
          <div className={cn(
            "rounded-2xl bg-gradient-to-b from-card/90 to-card/70 backdrop-blur-xl border border-palace-blue/20 transition-all duration-300 shadow-xl shadow-palace-blue/10 overflow-hidden",
            expandedPanel === "text" ? "flex-1" : "h-1/2"
          )}>
            <div className="h-10 border-b border-palace-blue/20 bg-gradient-to-r from-palace-blue/10 via-palace-purple/5 to-palace-teal/10 flex items-center justify-between px-3">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-palace-blue/20">
                  <BookOpen className="h-3.5 w-3.5 text-palace-blue" />
                </div>
                <span className="text-sm font-semibold bg-gradient-ocean bg-clip-text text-transparent">Scripture</span>
                {centerView === "single" && (
                  <Tabs value={translation} onValueChange={(v) => setTranslation(v as Translation)} className="h-8">
                    <TabsList className="h-7 bg-palace-purple/10 border border-palace-purple/20 flex-wrap">
                      <TabsTrigger value="kjv" className="text-[10px] h-5 px-1.5 data-[state=active]:bg-gradient-palace data-[state=active]:text-white data-[state=active]:shadow-md">KJV</TabsTrigger>
                      <TabsTrigger value="nkjv" className="text-[10px] h-5 px-1.5 data-[state=active]:bg-gradient-palace data-[state=active]:text-white data-[state=active]:shadow-md">NKJV</TabsTrigger>
                      <TabsTrigger value="asv" className="text-[10px] h-5 px-1.5 data-[state=active]:bg-gradient-palace data-[state=active]:text-white data-[state=active]:shadow-md">ASV</TabsTrigger>
                      <TabsTrigger value="web" className="text-[10px] h-5 px-1.5 data-[state=active]:bg-gradient-palace data-[state=active]:text-white data-[state=active]:shadow-md">WEB</TabsTrigger>
                      <TabsTrigger value="ylt" className="text-[10px] h-5 px-1.5 data-[state=active]:bg-gradient-palace data-[state=active]:text-white data-[state=active]:shadow-md">YLT</TabsTrigger>
                      <TabsTrigger value="darby" className="text-[10px] h-5 px-1.5 data-[state=active]:bg-gradient-palace data-[state=active]:text-white data-[state=active]:shadow-md">Darby</TabsTrigger>
                      <TabsTrigger value="bbe" className="text-[10px] h-5 px-1.5 data-[state=active]:bg-gradient-palace data-[state=active]:text-white data-[state=active]:shadow-md">BBE</TabsTrigger>
                      <TabsTrigger value="niv" className="text-[10px] h-5 px-1.5 data-[state=active]:bg-gradient-palace data-[state=active]:text-white data-[state=active]:shadow-md">NIV</TabsTrigger>
                      <TabsTrigger value="esv" className="text-[10px] h-5 px-1.5 data-[state=active]:bg-gradient-palace data-[state=active]:text-white data-[state=active]:shadow-md">ESV</TabsTrigger>
                      <TabsTrigger value="nasb" className="text-[10px] h-5 px-1.5 data-[state=active]:bg-gradient-palace data-[state=active]:text-white data-[state=active]:shadow-md">NASB</TabsTrigger>
                      <TabsTrigger value="nlt" className="text-[10px] h-5 px-1.5 data-[state=active]:bg-gradient-palace data-[state=active]:text-white data-[state=active]:shadow-md">NLT</TabsTrigger>
                      <TabsTrigger value="rves" className="text-[10px] h-5 px-1.5 data-[state=active]:bg-gradient-palace data-[state=active]:text-white data-[state=active]:shadow-md">RVE</TabsTrigger>
                    </TabsList>
                  </Tabs>
                )}
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-palace-blue/20" onClick={() => toggleExpand("text")}>
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
            <div className="flex-1 min-h-0 rounded-2xl bg-gradient-to-b from-card/90 to-card/70 backdrop-blur-xl border border-palace-orange/20 shadow-xl shadow-palace-orange/10 overflow-hidden">
              <div className="h-10 border-b border-palace-orange/20 bg-gradient-to-r from-palace-orange/10 to-palace-yellow/10 flex items-center justify-between px-3">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-palace-orange/20">
                    <Languages className="h-3.5 w-3.5 text-palace-orange" />
                  </div>
                  <span className="text-sm font-semibold bg-gradient-warmth bg-clip-text text-transparent">Dictionary</span>
                  <Tabs value={activeDictionary} onValueChange={setActiveDictionary} className="h-8">
                    <TabsList className="h-7 bg-palace-orange/10 border border-palace-orange/20">
                      <TabsTrigger value="strongs" className="text-xs h-6 px-2 data-[state=active]:bg-gradient-warmth data-[state=active]:text-white data-[state=active]:shadow-md">Strong's</TabsTrigger>
                      <TabsTrigger value="thayers" className="text-xs h-6 px-2 data-[state=active]:bg-gradient-warmth data-[state=active]:text-white data-[state=active]:shadow-md">Thayer's</TabsTrigger>
                      <TabsTrigger value="bdb" className="text-xs h-6 px-2 data-[state=active]:bg-gradient-warmth data-[state=active]:text-white data-[state=active]:shadow-md">BDB</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-palace-orange/20" onClick={() => toggleExpand("dictionary")}>
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
            "rounded-2xl bg-gradient-to-b from-card/90 to-card/70 backdrop-blur-xl border border-palace-pink/20 transition-all duration-300 shrink-0 shadow-xl shadow-palace-pink/10 overflow-hidden flex flex-col",
            expandedPanel === "commentary" ? "w-[500px]" : "w-80"
          )}
        >
          {/* Tab Categories */}
          <div className="border-b border-palace-pink/20 bg-gradient-to-r from-palace-purple/10 via-palace-pink/10 to-palace-teal/10 p-2">
            <div className="flex flex-wrap gap-1">
              {/* AI & Commentary */}
              <Button
                size="sm"
                variant={rightTab === "jeeves" ? "default" : "ghost"}
                onClick={() => setRightTab("jeeves")}
                className={cn("h-6 text-[10px] px-2 transition-all", rightTab === "jeeves" ? "bg-gradient-palace shadow-md shadow-palace-purple/30 text-white" : "hover:bg-palace-purple/20")}
              >
                <Bot className="h-3 w-3 mr-1" />
                Jeeves
              </Button>
              <Button
                size="sm"
                variant={rightTab === "crossref" ? "default" : "ghost"}
                onClick={() => setRightTab("crossref")}
                className={cn("h-6 text-[10px] px-2 transition-all", rightTab === "crossref" ? "bg-gradient-ocean shadow-md shadow-palace-blue/30 text-white" : "hover:bg-palace-blue/20")}
              >
                <Link2 className="h-3 w-3 mr-1" />
                Links
              </Button>
              <Button
                size="sm"
                variant={rightTab === "genetics" ? "default" : "ghost"}
                onClick={() => setRightTab("genetics")}
                className={cn("h-6 text-[10px] px-2 transition-all", rightTab === "genetics" ? "bg-gradient-forest shadow-md shadow-palace-green/30 text-white" : "hover:bg-palace-green/20")}
              >
                <GitBranch className="h-3 w-3 mr-1" />
                Genetics
              </Button>
              <Button
                size="sm"
                variant={rightTab === "notes" ? "default" : "ghost"}
                onClick={() => setRightTab("notes")}
                className={cn("h-6 text-[10px] px-2 transition-all", rightTab === "notes" ? "bg-gradient-warmth shadow-md shadow-palace-orange/30 text-white" : "hover:bg-palace-orange/20")}
              >
                <StickyNote className="h-3 w-3 mr-1" />
                Notes
              </Button>
              
              <div className="w-px h-4 bg-gradient-to-b from-transparent via-palace-purple/40 to-transparent mx-1 self-center" />
              
              {/* PT Tools */}
              <Button
                size="sm"
                variant={rightTab === "palace" ? "default" : "ghost"}
                onClick={() => setRightTab("palace")}
                className={cn("h-6 text-[10px] px-2 transition-all", rightTab === "palace" ? "bg-gradient-royal shadow-md shadow-palace-purple/30 text-white" : "hover:bg-palace-purple/20")}
              >
                <Building2 className="h-3 w-3 mr-1" />
                Palace
              </Button>
              <Button
                size="sm"
                variant={rightTab === "cycles" ? "default" : "ghost"}
                onClick={() => setRightTab("cycles")}
                className={cn("h-6 text-[10px] px-2 transition-all", rightTab === "cycles" ? "bg-gradient-ocean shadow-md shadow-palace-teal/30 text-white" : "hover:bg-palace-teal/20")}
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Cycles
              </Button>
              <Button
                size="sm"
                variant={rightTab === "heavens" ? "default" : "ghost"}
                onClick={() => setRightTab("heavens")}
                className={cn("h-6 text-[10px] px-2 transition-all", rightTab === "heavens" ? "bg-gradient-to-r from-palace-blue to-palace-purple shadow-md shadow-palace-blue/30 text-white" : "hover:bg-palace-blue/20")}
              >
                <Layers className="h-3 w-3 mr-1" />
                3H
              </Button>
              <Button
                size="sm"
                variant={rightTab === "sanctuary" ? "default" : "ghost"}
                onClick={() => setRightTab("sanctuary")}
                className={cn("h-6 text-[10px] px-2 transition-all", rightTab === "sanctuary" ? "bg-gradient-warmth shadow-md shadow-palace-yellow/30 text-white" : "hover:bg-palace-yellow/20")}
              >
                <Landmark className="h-3 w-3 mr-1" />
                Sanct.
              </Button>
              <Button
                size="sm"
                variant={rightTab === "ascensions" ? "default" : "ghost"}
                onClick={() => setRightTab("ascensions")}
                className={cn("h-6 text-[10px] px-2 transition-all", rightTab === "ascensions" ? "bg-gradient-forest shadow-md shadow-palace-green/30 text-white" : "hover:bg-palace-green/20")}
              >
                <ArrowUpRight className="h-3 w-3 mr-1" />
                5Asc
              </Button>
            </div>
          </div>

          {/* Panel Header */}
          <div className="h-10 border-b border-palace-pink/20 bg-gradient-to-r from-palace-purple/5 to-palace-pink/5 flex items-center justify-between px-3">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-palace-purple/20">
                <MessageSquare className="h-3.5 w-3.5 text-palace-purple" />
              </div>
              <span className="text-sm font-semibold bg-gradient-palace bg-clip-text text-transparent">
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
            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-palace-purple/20" onClick={() => toggleExpand("commentary")}>
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
