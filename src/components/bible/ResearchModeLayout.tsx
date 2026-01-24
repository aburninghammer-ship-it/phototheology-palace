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
    <div className="h-screen flex flex-col bg-[hsl(225,40%,8%)] overflow-hidden">
      {/* Warm amber ambient background glow - matching reference image */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Base dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(225,40%,10%)] via-[hsl(30,30%,12%)] to-[hsl(35,35%,10%)]" />
        
        {/* Strong orange glow on edges - like reference image */}
        <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-[hsl(32,90%,50%)/0.25] rounded-full blur-[120px]" />
        <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-[hsl(32,85%,45%)/0.2] rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -left-20 w-[450px] h-[450px] bg-[hsl(35,90%,50%)/0.22] rounded-full blur-[110px]" />
        <div className="absolute -bottom-20 right-1/4 w-[400px] h-[400px] bg-[hsl(38,85%,48%)/0.18] rounded-full blur-[95px]" />
        <div className="absolute top-1/2 right-0 w-[350px] h-[350px] bg-[hsl(28,88%,45%)/0.15] rounded-full blur-[85px]" />
        
        {/* Subtle teal accent for contrast */}
        <div className="absolute bottom-1/3 left-1/3 w-[250px] h-[250px] bg-[hsl(180,50%,30%)/0.06] rounded-full blur-[70px]" />
      </div>

      {/* Top Toolbar - Deep navy with amber accents */}
      <div className="h-14 border-b border-[hsl(32,70%,45%)/0.3] bg-[hsl(230,35%,12%)/0.95] backdrop-blur-xl flex items-center justify-between px-4 shrink-0 shadow-lg shadow-[hsl(32,80%,40%)/0.15]">
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
          <div className="h-6 w-px bg-gradient-to-b from-transparent via-[hsl(32,70%,50%)/0.5] to-transparent" />
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-[hsl(32,80%,50%)] to-[hsl(45,90%,50%)] shadow-lg shadow-[hsl(32,80%,50%)/0.4]">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="font-serif text-xl font-semibold text-[hsl(45,80%,70%)] drop-shadow-sm">
              {book} {chapter}
            </span>
          </div>
          <Badge className="text-xs bg-[hsl(180,50%,40%)/0.2] border-[hsl(180,50%,40%)/0.4] text-[hsl(180,60%,60%)]">
            {chapterData?.verses.length || 0} verses
          </Badge>
          
          {/* Center View Toggle */}
          <div className="h-6 w-px bg-gradient-to-b from-transparent via-[hsl(32,70%,50%)/0.4] to-transparent ml-2" />
          <div className="flex gap-1 p-1 rounded-lg bg-[hsl(230,30%,15%)/0.8] border border-[hsl(32,60%,50%)/0.5] shadow-[0_0_15px_-3px_hsl(32,80%,50%/0.4)]">
            <Button
              variant={centerView === "single" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCenterView("single")}
              className={cn("h-7 text-xs transition-all", centerView === "single" ? "bg-gradient-to-r from-[hsl(32,80%,50%)] to-[hsl(45,90%,50%)] shadow-[0_0_12px_hsl(32,80%,50%/0.5)] text-white" : "hover:bg-[hsl(32,50%,30%)/0.3] text-[hsl(45,60%,70%)]")}
            >
              <BookOpen className="h-3 w-3 mr-1" />
              Single
            </Button>
            <Button
              variant={centerView === "parallel" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCenterView("parallel")}
              className={cn("h-7 text-xs transition-all", centerView === "parallel" ? "bg-gradient-to-r from-[hsl(200,70%,45%)] to-[hsl(180,60%,45%)] shadow-[0_0_12px_hsl(200,70%,45%/0.5)] text-white" : "hover:bg-[hsl(200,40%,30%)/0.3] text-[hsl(200,50%,70%)]")}
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
            className="bg-[hsl(32,50%,30%)/0.2] hover:bg-[hsl(32,50%,40%)/0.3] border border-[hsl(32,60%,50%)/0.3] hover:border-[hsl(32,70%,55%)/0.5] text-[hsl(45,70%,70%)] disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateChapter("next")}
            className="bg-[hsl(32,50%,30%)/0.2] hover:bg-[hsl(32,50%,40%)/0.3] border border-[hsl(32,60%,50%)/0.3] hover:border-[hsl(32,70%,55%)/0.5] text-[hsl(45,70%,70%)]"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content - 3 Column Layout */}
      <div className="flex-1 flex overflow-hidden p-3 gap-3">
        {/* Left Panel - Bible Books - Emerald glow outline */}
        <div
          className={cn(
            "rounded-2xl bg-[hsl(230,35%,12%)/0.95] backdrop-blur-xl border-2 border-[hsl(142,70%,50%)/0.6] transition-all duration-300 shrink-0 overflow-hidden",
            "shadow-[0_0_40px_-5px_hsl(142,70%,50%/0.5),0_0_80px_-10px_hsl(142,60%,45%/0.3),inset_0_1px_0_hsl(142,60%,55%/0.15)]",
            expandedPanel === "books" ? "w-72" : "w-44"
          )}
        >
          <div className="h-10 border-b border-[hsl(142,50%,35%)/0.3] bg-gradient-to-r from-[hsl(142,45%,18%)/0.3] to-[hsl(160,40%,18%)/0.2] flex items-center justify-between px-3">
            <span className="text-sm font-medium flex items-center gap-2">
              <div className="p-1 rounded-md bg-[hsl(142,50%,35%)/0.3]">
                <Book className="h-3.5 w-3.5 text-[hsl(142,60%,55%)]" />
              </div>
              <span className="text-[hsl(142,50%,60%)] font-semibold">Books</span>
            </span>
            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-[hsl(142,45%,35%)/0.2] text-[hsl(142,55%,65%)]" onClick={() => toggleExpand("books")}>
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
          {/* Bible Text - Top - Cyan glow outline */}
          <div className={cn(
            "rounded-2xl bg-[hsl(230,35%,12%)/0.95] backdrop-blur-xl border-2 border-[hsl(200,80%,55%)/0.6] transition-all duration-300 overflow-hidden",
            "shadow-[0_0_40px_-5px_hsl(200,80%,55%/0.5),0_0_80px_-10px_hsl(200,70%,50%/0.3),inset_0_1px_0_hsl(200,70%,60%/0.15)]",
            expandedPanel === "text" ? "flex-1" : "h-1/2"
          )}>
            <div className="h-10 border-b border-[hsl(200,60%,40%)/0.3] bg-gradient-to-r from-[hsl(200,50%,18%)/0.4] via-[hsl(210,40%,16%)/0.3] to-[hsl(190,45%,18%)/0.3] flex items-center justify-between px-3">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-[hsl(200,60%,40%)/0.3]">
                  <BookOpen className="h-3.5 w-3.5 text-[hsl(200,70%,60%)]" />
                </div>
                <span className="text-sm font-semibold text-[hsl(200,60%,65%)]">Scripture</span>
                {centerView === "single" && (
                  <Tabs value={translation} onValueChange={(v) => setTranslation(v as Translation)} className="h-8">
                    <TabsList className="h-7 bg-[hsl(230,30%,15%)/0.8] border border-[hsl(32,60%,50%)/0.5] shadow-[0_0_15px_-3px_hsl(32,80%,50%/0.4)] flex-wrap">
                      <TabsTrigger value="kjv" className="text-[10px] h-5 px-1.5 text-[hsl(45,50%,65%)] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(32,80%,50%)] data-[state=active]:to-[hsl(45,90%,50%)] data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_hsl(32,80%,50%/0.5)]">KJV</TabsTrigger>
                      <TabsTrigger value="nkjv" className="text-[10px] h-5 px-1.5 text-[hsl(45,50%,65%)] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(32,80%,50%)] data-[state=active]:to-[hsl(45,90%,50%)] data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_hsl(32,80%,50%/0.5)]">NKJV</TabsTrigger>
                      <TabsTrigger value="asv" className="text-[10px] h-5 px-1.5 text-[hsl(45,50%,65%)] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(32,80%,50%)] data-[state=active]:to-[hsl(45,90%,50%)] data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_hsl(32,80%,50%/0.5)]">ASV</TabsTrigger>
                      <TabsTrigger value="web" className="text-[10px] h-5 px-1.5 text-[hsl(45,50%,65%)] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(32,80%,50%)] data-[state=active]:to-[hsl(45,90%,50%)] data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_hsl(32,80%,50%/0.5)]">WEB</TabsTrigger>
                      <TabsTrigger value="ylt" className="text-[10px] h-5 px-1.5 text-[hsl(45,50%,65%)] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(32,80%,50%)] data-[state=active]:to-[hsl(45,90%,50%)] data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_hsl(32,80%,50%/0.5)]">YLT</TabsTrigger>
                      <TabsTrigger value="darby" className="text-[10px] h-5 px-1.5 text-[hsl(45,50%,65%)] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(32,80%,50%)] data-[state=active]:to-[hsl(45,90%,50%)] data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_hsl(32,80%,50%/0.5)]">Darby</TabsTrigger>
                      <TabsTrigger value="bbe" className="text-[10px] h-5 px-1.5 text-[hsl(45,50%,65%)] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(32,80%,50%)] data-[state=active]:to-[hsl(45,90%,50%)] data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_hsl(32,80%,50%/0.5)]">BBE</TabsTrigger>
                      <TabsTrigger value="niv" className="text-[10px] h-5 px-1.5 text-[hsl(45,50%,65%)] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(32,80%,50%)] data-[state=active]:to-[hsl(45,90%,50%)] data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_hsl(32,80%,50%/0.5)]">NIV</TabsTrigger>
                      <TabsTrigger value="esv" className="text-[10px] h-5 px-1.5 text-[hsl(45,50%,65%)] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(32,80%,50%)] data-[state=active]:to-[hsl(45,90%,50%)] data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_hsl(32,80%,50%/0.5)]">ESV</TabsTrigger>
                      <TabsTrigger value="nasb" className="text-[10px] h-5 px-1.5 text-[hsl(45,50%,65%)] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(32,80%,50%)] data-[state=active]:to-[hsl(45,90%,50%)] data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_hsl(32,80%,50%/0.5)]">NASB</TabsTrigger>
                      <TabsTrigger value="nlt" className="text-[10px] h-5 px-1.5 text-[hsl(45,50%,65%)] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(32,80%,50%)] data-[state=active]:to-[hsl(45,90%,50%)] data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_hsl(32,80%,50%/0.5)]">NLT</TabsTrigger>
                      <TabsTrigger value="rves" className="text-[10px] h-5 px-1.5 text-[hsl(45,50%,65%)] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(32,80%,50%)] data-[state=active]:to-[hsl(45,90%,50%)] data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_hsl(32,80%,50%/0.5)]">RVE</TabsTrigger>
                    </TabsList>
                  </Tabs>
                )}
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-[hsl(32,50%,40%)/0.2] text-[hsl(45,60%,70%)]" onClick={() => toggleExpand("text")}>
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

          {/* Dictionary Panel - Bottom - Amber/Gold glow outline */}
          {expandedPanel !== "text" && (
            <div className="flex-1 min-h-0 rounded-2xl bg-[hsl(230,35%,12%)/0.95] backdrop-blur-xl border-2 border-[hsl(38,85%,55%)/0.6] shadow-[0_0_40px_-5px_hsl(38,85%,55%/0.5),0_0_80px_-10px_hsl(38,75%,50%/0.3),inset_0_1px_0_hsl(38,75%,60%/0.15)] overflow-hidden">
              <div className="h-10 border-b border-[hsl(38,65%,45%)/0.3] bg-gradient-to-r from-[hsl(38,55%,22%)/0.3] to-[hsl(45,50%,20%)/0.2] flex items-center justify-between px-3">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-[hsl(38,70%,45%)/0.3]">
                    <Languages className="h-3.5 w-3.5 text-[hsl(38,80%,60%)]" />
                  </div>
                  <span className="text-sm font-semibold text-[hsl(45,70%,65%)]">Dictionary</span>
                  <Tabs value={activeDictionary} onValueChange={setActiveDictionary} className="h-8">
                    <TabsList className="h-7 bg-[hsl(230,30%,15%)/0.8] border border-[hsl(32,60%,50%)/0.5] shadow-[0_0_15px_-3px_hsl(32,80%,50%/0.4)]">
                      <TabsTrigger value="strongs" className="text-xs h-6 px-2 text-[hsl(45,50%,65%)] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(32,80%,50%)] data-[state=active]:to-[hsl(45,90%,50%)] data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_hsl(32,80%,50%/0.5)]">Strong's</TabsTrigger>
                      <TabsTrigger value="thayers" className="text-xs h-6 px-2 text-[hsl(45,50%,65%)] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(32,80%,50%)] data-[state=active]:to-[hsl(45,90%,50%)] data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_hsl(32,80%,50%/0.5)]">Thayer's</TabsTrigger>
                      <TabsTrigger value="bdb" className="text-xs h-6 px-2 text-[hsl(45,50%,65%)] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(32,80%,50%)] data-[state=active]:to-[hsl(45,90%,50%)] data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_hsl(32,80%,50%/0.5)]">BDB</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-[hsl(32,50%,40%)/0.2] text-[hsl(45,60%,70%)]" onClick={() => toggleExpand("dictionary")}>
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

        {/* Right Panel - PT Tools & Commentary - Purple glow outline */}
        <div
          className={cn(
            "rounded-2xl bg-[hsl(230,35%,12%)/0.95] backdrop-blur-xl border-2 border-[hsl(270,70%,55%)/0.6] transition-all duration-300 shrink-0 overflow-hidden flex flex-col",
            "shadow-[0_0_40px_-5px_hsl(270,70%,55%/0.5),0_0_80px_-10px_hsl(270,60%,50%/0.3),inset_0_1px_0_hsl(270,60%,60%/0.15)]",
            expandedPanel === "commentary" ? "w-[500px]" : "w-80"
          )}
        >
          {/* Tab Categories */}
          <div className="border-b border-[hsl(270,50%,45%)/0.3] bg-gradient-to-r from-[hsl(270,40%,18%)/0.3] via-[hsl(280,35%,16%)/0.2] to-[hsl(260,35%,18%)/0.3] p-2">
            <div className="flex flex-wrap gap-1 p-1.5 rounded-xl bg-[hsl(230,30%,12%)/0.6] border border-[hsl(270,55%,50%)/0.4] shadow-[0_0_20px_-5px_hsl(270,70%,55%/0.35),inset_0_1px_0_hsl(270,60%,60%/0.08)]">
              {/* AI & Commentary */}
              <Button
                size="sm"
                variant={rightTab === "jeeves" ? "default" : "ghost"}
                onClick={() => setRightTab("jeeves")}
                className={cn("h-6 text-[10px] px-2 transition-all", rightTab === "jeeves" ? "bg-gradient-to-r from-[hsl(210,70%,50%)] to-[hsl(190,60%,45%)] shadow-md shadow-[hsl(210,70%,50%)/0.3] text-white" : "hover:bg-[hsl(210,40%,30%)/0.3] text-[hsl(210,50%,70%)]")}
              >
                <Bot className="h-3 w-3 mr-1" />
                Jeeves
              </Button>
              <Button
                size="sm"
                variant={rightTab === "crossref" ? "default" : "ghost"}
                onClick={() => setRightTab("crossref")}
                className={cn("h-6 text-[10px] px-2 transition-all", rightTab === "crossref" ? "bg-gradient-to-r from-[hsl(200,70%,45%)] to-[hsl(180,60%,45%)] shadow-md shadow-[hsl(200,70%,45%)/0.3] text-white" : "hover:bg-[hsl(200,40%,30%)/0.3] text-[hsl(200,50%,70%)]")}
              >
                <Link2 className="h-3 w-3 mr-1" />
                Links
              </Button>
              <Button
                size="sm"
                variant={rightTab === "genetics" ? "default" : "ghost"}
                onClick={() => setRightTab("genetics")}
                className={cn("h-6 text-[10px] px-2 transition-all", rightTab === "genetics" ? "bg-gradient-to-r from-[hsl(180,60%,40%)] to-[hsl(142,55%,40%)] shadow-md shadow-[hsl(142,55%,40%)/0.3] text-white" : "hover:bg-[hsl(142,35%,25%)/0.3] text-[hsl(142,45%,60%)]")}
              >
                <GitBranch className="h-3 w-3 mr-1" />
                Genetics
              </Button>
              <Button
                size="sm"
                variant={rightTab === "notes" ? "default" : "ghost"}
                onClick={() => setRightTab("notes")}
                className={cn("h-6 text-[10px] px-2 transition-all", rightTab === "notes" ? "bg-gradient-to-r from-[hsl(32,80%,50%)] to-[hsl(45,90%,50%)] shadow-md shadow-[hsl(32,80%,50%)/0.3] text-white" : "hover:bg-[hsl(32,50%,30%)/0.3] text-[hsl(45,60%,70%)]")}
              >
                <StickyNote className="h-3 w-3 mr-1" />
                Notes
              </Button>
              
              <div className="w-px h-4 bg-gradient-to-b from-transparent via-[hsl(32,70%,50%)/0.4] to-transparent mx-1 self-center" />
              
              {/* PT Tools */}
              <Button
                size="sm"
                variant={rightTab === "palace" ? "default" : "ghost"}
                onClick={() => setRightTab("palace")}
                className={cn("h-6 text-[10px] px-2 transition-all", rightTab === "palace" ? "bg-gradient-to-r from-[hsl(270,60%,50%)] to-[hsl(210,70%,50%)] shadow-md shadow-[hsl(270,60%,50%)/0.3] text-white" : "hover:bg-[hsl(270,40%,30%)/0.3] text-[hsl(270,50%,70%)]")}
              >
                <Building2 className="h-3 w-3 mr-1" />
                Palace
              </Button>
              <Button
                size="sm"
                variant={rightTab === "cycles" ? "default" : "ghost"}
                onClick={() => setRightTab("cycles")}
                className={cn("h-6 text-[10px] px-2 transition-all", rightTab === "cycles" ? "bg-gradient-to-r from-[hsl(200,70%,45%)] to-[hsl(180,60%,45%)] shadow-md shadow-[hsl(180,60%,45%)/0.3] text-white" : "hover:bg-[hsl(180,40%,28%)/0.3] text-[hsl(180,50%,65%)]")}
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Cycles
              </Button>
              <Button
                size="sm"
                variant={rightTab === "heavens" ? "default" : "ghost"}
                onClick={() => setRightTab("heavens")}
                className={cn("h-6 text-[10px] px-2 transition-all", rightTab === "heavens" ? "bg-gradient-to-r from-[hsl(210,70%,50%)] to-[hsl(270,60%,50%)] shadow-md shadow-[hsl(210,70%,50%)/0.3] text-white" : "hover:bg-[hsl(210,40%,30%)/0.3] text-[hsl(210,50%,70%)]")}
              >
                <Layers className="h-3 w-3 mr-1" />
                3H
              </Button>
              <Button
                size="sm"
                variant={rightTab === "sanctuary" ? "default" : "ghost"}
                onClick={() => setRightTab("sanctuary")}
                className={cn("h-6 text-[10px] px-2 transition-all", rightTab === "sanctuary" ? "bg-gradient-to-r from-[hsl(32,80%,50%)] to-[hsl(45,90%,50%)] shadow-md shadow-[hsl(45,90%,50%)/0.3] text-white" : "hover:bg-[hsl(45,50%,30%)/0.3] text-[hsl(45,60%,65%)]")}
              >
                <Landmark className="h-3 w-3 mr-1" />
                Sanct.
              </Button>
              <Button
                size="sm"
                variant={rightTab === "ascensions" ? "default" : "ghost"}
                onClick={() => setRightTab("ascensions")}
                className={cn("h-6 text-[10px] px-2 transition-all", rightTab === "ascensions" ? "bg-gradient-to-r from-[hsl(180,60%,40%)] to-[hsl(142,55%,40%)] shadow-md shadow-[hsl(142,55%,40%)/0.3] text-white" : "hover:bg-[hsl(142,35%,25%)/0.3] text-[hsl(142,45%,60%)]")}
              >
                <ArrowUpRight className="h-3 w-3 mr-1" />
                5Asc
              </Button>
            </div>
          </div>

          {/* Panel Header */}
          <div className="h-10 border-b border-[hsl(270,50%,45%)/0.3] bg-gradient-to-r from-[hsl(270,40%,18%)/0.3] to-[hsl(280,35%,16%)/0.2] flex items-center justify-between px-3">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-[hsl(270,55%,45%)/0.3]">
                <MessageSquare className="h-3.5 w-3.5 text-[hsl(270,65%,65%)]" />
              </div>
              <span className="text-sm font-semibold text-[hsl(270,55%,70%)]">
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
            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-[hsl(270,45%,40%)/0.2] text-[hsl(270,55%,70%)]" onClick={() => toggleExpand("commentary")}>
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
