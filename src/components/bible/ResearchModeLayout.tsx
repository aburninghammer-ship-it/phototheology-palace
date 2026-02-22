import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchChapter, Translation, searchBibleByWord } from "@/services/bibleApi";
import { Chapter, Verse } from "@/types/bible";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
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
  StickyNote,
  Sun,
  Moon,
  Search,
  Loader2
} from "lucide-react";
import { ResearchBooksPanel } from "./ResearchBooksPanel";
import { ResearchVersesPanel } from "./ResearchVersesPanel";
import { ResearchCommentaryPanel } from "./ResearchCommentaryPanel";
import { ResearchDictionaryPanel } from "./ResearchDictionaryPanel";
import { ResearchParallelPanel } from "./research/ResearchParallelPanel";
import { ResearchPTToolsPanel } from "./research/ResearchPTToolsPanel";
import { ResearchVerseGeneticsPanel } from "./research/ResearchVerseGeneticsPanel";
import { ResearchUserNotesPanel } from "./research/ResearchUserNotesPanel";
import { InterlinearPanel } from "./research/InterlinearPanel";
import { cn } from "@/lib/utils";

interface ResearchModeLayoutProps {
  onExitResearchMode: () => void;
}

type CenterView = "single" | "parallel" | "interlinear";
type RightTab = "jeeves" | "principles" | "crossref" | "notes" | "palace" | "cycles" | "heavens" | "sanctuary" | "ascensions" | "genetics";

export const ResearchModeLayout = ({ onExitResearchMode }: ResearchModeLayoutProps) => {
  const { book = "John", chapter: chapterParam = "3" } = useParams();
  const navigate = useNavigate();
  const chapter = parseInt(chapterParam);
  const { theme, setTheme } = useTheme();

  const [chapterData, setChapterData] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [translation, setTranslation] = useState<Translation>("kjv");
  const [expandedPanel, setExpandedPanel] = useState<string | null>(null);
  const [centerView, setCenterView] = useState<CenterView>("single");
  const [rightTab, setRightTab] = useState<RightTab>("jeeves");
  const [activeDictionary, setActiveDictionary] = useState("strongs");

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Verse[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

  const isDark = theme === "dark";

  // Parse verse reference from search query (e.g., "John 3:16", "1 Cor 13:4")
  const parseVerseReference = (query: string): { book: string; chapter: number; verse?: number } | null => {
    // Pattern: Book Chapter:Verse or Book Chapter
    const pattern = /^([1-3]?\s?[A-Za-z]+(?:\s+[A-Za-z]+)?)\s+(\d+)(?::(\d+))?$/i;
    const match = query.trim().match(pattern);
    if (match) {
      return {
        book: match[1].trim(),
        chapter: parseInt(match[2]),
        verse: match[3] ? parseInt(match[3]) : undefined
      };
    }
    return null;
  };

  // Handle search
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    // First check if it's a verse reference
    const verseRef = parseVerseReference(query);
    if (verseRef) {
      // Navigate directly to the verse
      navigate(`/bible/${verseRef.book}/${verseRef.chapter}?mode=research`);
      if (verseRef.verse) {
        setSelectedVerse(verseRef.verse);
      }
      setSearchQuery("");
      setShowSearchResults(false);
      return;
    }

    // Otherwise, search for the word
    setSearchLoading(true);
    setShowSearchResults(true);
    try {
      const { verses } = await searchBibleByWord(query, "all", 1, 20);
      setSearchResults(verses);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, [navigate]);

  // Debounced search
  const handleSearchInput = (value: string) => {
    setSearchQuery(value);
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    searchDebounceRef.current = setTimeout(() => {
      handleSearch(value);
    }, 500);
  };

  // Handle search result click
  const handleResultClick = (verse: Verse) => {
    navigate(`/bible/${verse.book}/${verse.chapter}?mode=research`);
    setSelectedVerse(verse.verse);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <div className={cn(
      "h-screen flex flex-col overflow-hidden transition-colors duration-300",
      isDark ? "bg-[hsl(225,40%,8%)]" : "bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20"
    )}>
      {/* Vibrant multi-color ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Base gradient */}
        <div className={cn(
          "absolute inset-0",
          isDark
            ? "bg-gradient-to-br from-[hsl(270,40%,10%)] via-[hsl(225,35%,10%)] to-[hsl(200,35%,10%)]"
            : "bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30"
        )} />

        {/* Emerald glow (top-left) - Books panel color */}
        <div className={cn(
          "absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full blur-[120px] animate-pulse",
          isDark ? "bg-[hsl(142,70%,45%)/0.25]" : "bg-[hsl(142,70%,70%)/0.3]"
        )} style={{ animationDuration: '8s' }} />

        {/* Cyan glow (top-right) - Scripture panel color */}
        <div className={cn(
          "absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full blur-[120px] animate-pulse",
          isDark ? "bg-[hsl(200,80%,50%)/0.25]" : "bg-[hsl(200,80%,75%)/0.35]"
        )} style={{ animationDuration: '10s' }} />

        {/* Amber/Orange glow (center-right) */}
        <div className={cn(
          "absolute top-1/3 -right-40 w-[550px] h-[550px] rounded-full blur-[100px] animate-pulse",
          isDark ? "bg-[hsl(32,90%,50%)/0.22]" : "bg-[hsl(32,90%,75%)/0.3]"
        )} style={{ animationDuration: '7s' }} />

        {/* Purple glow (center-left) - Commentary panel color */}
        <div className={cn(
          "absolute top-1/2 -left-40 w-[500px] h-[500px] rounded-full blur-[100px] animate-pulse",
          isDark ? "bg-[hsl(270,70%,50%)/0.2]" : "bg-[hsl(270,70%,80%)/0.3]"
        )} style={{ animationDuration: '9s' }} />

        {/* Gold/Amber glow (bottom-left) - Dictionary panel color */}
        <div className={cn(
          "absolute -bottom-40 -left-20 w-[450px] h-[450px] rounded-full blur-[110px] animate-pulse",
          isDark ? "bg-[hsl(38,90%,55%)/0.25]" : "bg-[hsl(38,90%,80%)/0.35]"
        )} style={{ animationDuration: '6s' }} />

        {/* Teal glow (bottom-right) */}
        <div className={cn(
          "absolute -bottom-20 right-1/4 w-[400px] h-[400px] rounded-full blur-[95px] animate-pulse",
          isDark ? "bg-[hsl(180,70%,45%)/0.18]" : "bg-[hsl(180,70%,75%)/0.25]"
        )} style={{ animationDuration: '11s' }} />

        {/* Pink accent (center) */}
        <div className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[80px]",
          isDark ? "bg-[hsl(330,70%,50%)/0.1]" : "bg-[hsl(330,70%,85%)/0.2]"
        )} />
      </div>

      {/* Top Toolbar */}
      <div className={cn(
        "h-14 border-b backdrop-blur-xl flex items-center justify-between px-4 shrink-0 shadow-lg transition-colors duration-300",
        isDark
          ? "border-[hsl(32,70%,45%)/0.3] bg-[hsl(230,35%,12%)/0.95] shadow-[hsl(32,80%,40%)/0.15]"
          : "border-amber-200/50 bg-white/80 shadow-amber-100/50"
      )}>
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

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={cn(
              "h-8 w-8 rounded-lg border transition-all",
              isDark
                ? "bg-slate-800/50 border-amber-500/30 hover:bg-slate-700/50 text-amber-400"
                : "bg-amber-50 border-amber-300 hover:bg-amber-100 text-amber-600"
            )}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <div className={cn(
            "h-6 w-px bg-gradient-to-b from-transparent via-current to-transparent",
            isDark ? "text-[hsl(32,70%,50%)/0.5]" : "text-amber-300"
          )} />
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-[hsl(32,80%,50%)] to-[hsl(45,90%,50%)] shadow-lg shadow-[hsl(32,80%,50%)/0.4]">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className={cn(
              "font-serif text-xl font-semibold drop-shadow-sm",
              isDark ? "text-[hsl(45,80%,70%)]" : "text-amber-800"
            )}>
              {book} {chapter}
            </span>
          </div>
          <Badge className={cn(
            "text-xs",
            isDark
              ? "bg-[hsl(180,50%,40%)/0.2] border-[hsl(180,50%,40%)/0.4] text-[hsl(180,60%,60%)]"
              : "bg-teal-100 border-teal-300 text-teal-700"
          )}>
            {chapterData?.verses.length || 0} verses
          </Badge>

          {/* Search Bar */}
          <div ref={searchRef} className="relative ml-2">
            <div className={cn(
              "flex items-center gap-2 rounded-lg border px-2 py-1",
              isDark
                ? "bg-slate-800/50 border-amber-500/30 focus-within:border-amber-400"
                : "bg-white border-amber-200 focus-within:border-amber-400 shadow-sm"
            )}>
              <Search className={cn("h-4 w-4", isDark ? "text-amber-400/70" : "text-amber-500")} />
              <Input
                type="text"
                placeholder="Search verses or type 'John 3:16'..."
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(searchQuery);
                  }
                }}
                className={cn(
                  "h-6 w-48 border-0 bg-transparent p-0 text-sm focus-visible:ring-0 placeholder:text-muted-foreground/60",
                  isDark ? "text-amber-100" : "text-amber-900"
                )}
              />
              {searchLoading && <Loader2 className="h-4 w-4 animate-spin text-amber-500" />}
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className={cn(
                "absolute top-full left-0 mt-1 w-[400px] max-h-[400px] overflow-y-auto rounded-lg border shadow-xl z-50",
                isDark
                  ? "bg-slate-900/95 border-amber-500/30 backdrop-blur-xl"
                  : "bg-white border-amber-200"
              )}>
                <div className={cn(
                  "px-3 py-2 border-b text-xs font-medium",
                  isDark ? "border-amber-500/20 text-amber-400" : "border-amber-100 text-amber-700"
                )}>
                  {searchResults.length} results for "{searchQuery}"
                </div>
                {searchResults.map((verse, idx) => (
                  <button
                    key={`${verse.book}-${verse.chapter}-${verse.verse}-${idx}`}
                    onClick={() => handleResultClick(verse)}
                    className={cn(
                      "w-full px-3 py-2 text-left border-b last:border-0 transition-colors",
                      isDark
                        ? "border-slate-700/50 hover:bg-amber-500/10"
                        : "border-amber-50 hover:bg-amber-50"
                    )}
                  >
                    <div className={cn(
                      "font-semibold text-sm",
                      isDark ? "text-amber-400" : "text-amber-700"
                    )}>
                      {verse.book} {verse.chapter}:{verse.verse}
                    </div>
                    <div className={cn(
                      "text-xs line-clamp-2 mt-0.5",
                      isDark ? "text-slate-300" : "text-slate-600"
                    )}>
                      {verse.text}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* No results message */}
            {showSearchResults && searchQuery && !searchLoading && searchResults.length === 0 && (
              <div className={cn(
                "absolute top-full left-0 mt-1 w-[300px] rounded-lg border p-4 text-center shadow-xl z-50",
                isDark
                  ? "bg-slate-900/95 border-amber-500/30 text-slate-400"
                  : "bg-white border-amber-200 text-slate-500"
              )}>
                <p className="text-sm">No results found for "{searchQuery}"</p>
                <p className="text-xs mt-1 opacity-70">Try a verse reference like "John 3:16"</p>
              </div>
            )}
          </div>

          {/* Center View Toggle */}
          <div className={cn(
            "h-6 w-px bg-gradient-to-b from-transparent via-current to-transparent ml-2",
            isDark ? "text-[hsl(32,70%,50%)/0.4]" : "text-amber-300"
          )} />
          <div className={cn(
            "flex gap-1 p-1 rounded-lg border",
            isDark
              ? "bg-[hsl(230,30%,15%)/0.8] border-[hsl(32,60%,50%)/0.5] shadow-[0_0_15px_-3px_hsl(32,80%,50%/0.4)]"
              : "bg-white/80 border-amber-200 shadow-sm"
          )}>
            <Button
              variant={centerView === "single" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCenterView("single")}
              className={cn(
                "h-7 text-xs transition-all",
                centerView === "single"
                  ? "bg-gradient-to-r from-[hsl(32,80%,50%)] to-[hsl(45,90%,50%)] shadow-[0_0_12px_hsl(32,80%,50%/0.5)] text-white"
                  : isDark
                    ? "hover:bg-[hsl(32,50%,30%)/0.3] text-[hsl(45,60%,70%)]"
                    : "hover:bg-amber-50 text-amber-700"
              )}
            >
              <BookOpen className="h-3 w-3 mr-1" />
              Single
            </Button>
            <Button
              variant={centerView === "parallel" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCenterView("parallel")}
              className={cn(
                "h-7 text-xs transition-all",
                centerView === "parallel"
                  ? "bg-gradient-to-r from-[hsl(200,70%,45%)] to-[hsl(180,60%,45%)] shadow-[0_0_12px_hsl(200,70%,45%/0.5)] text-white"
                  : isDark
                    ? "hover:bg-[hsl(200,40%,30%)/0.3] text-[hsl(200,50%,70%)]"
                    : "hover:bg-cyan-50 text-cyan-700"
              )}
            >
              <Columns className="h-3 w-3 mr-1" />
              Parallel
            </Button>
            <Button
              variant={centerView === "interlinear" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCenterView("interlinear")}
              className={cn(
                "h-7 text-xs transition-all",
                centerView === "interlinear"
                  ? "bg-gradient-to-r from-[hsl(38,80%,50%)] to-[hsl(32,70%,45%)] shadow-[0_0_12px_hsl(38,80%,50%/0.5)] text-white"
                  : isDark
                    ? "hover:bg-[hsl(38,40%,30%)/0.3] text-[hsl(38,50%,70%)]"
                    : "hover:bg-amber-50 text-amber-700"
              )}
            >
              <Languages className="h-3 w-3 mr-1" />
              Interlinear
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateChapter("prev")}
            disabled={chapter <= 1}
            className={cn(
              "border disabled:opacity-30",
              isDark
                ? "bg-[hsl(32,50%,30%)/0.2] hover:bg-[hsl(32,50%,40%)/0.3] border-[hsl(32,60%,50%)/0.3] hover:border-[hsl(32,70%,55%)/0.5] text-[hsl(45,70%,70%)]"
                : "bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateChapter("next")}
            className={cn(
              "border",
              isDark
                ? "bg-[hsl(32,50%,30%)/0.2] hover:bg-[hsl(32,50%,40%)/0.3] border-[hsl(32,60%,50%)/0.3] hover:border-[hsl(32,70%,55%)/0.5] text-[hsl(45,70%,70%)]"
                : "bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700"
            )}
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
            "rounded-2xl backdrop-blur-xl border-2 transition-all duration-300 shrink-0 overflow-hidden",
            isDark
              ? "bg-[hsl(230,35%,12%)/0.95] border-[hsl(142,70%,50%)/0.6] shadow-[0_0_40px_-5px_hsl(142,70%,50%/0.5),0_0_80px_-10px_hsl(142,60%,45%/0.3),inset_0_1px_0_hsl(142,60%,55%/0.15)]"
              : "bg-white/90 border-emerald-400 shadow-lg shadow-emerald-200/50",
            expandedPanel === "books" ? "w-72" : "w-44"
          )}
        >
          <div className={cn(
            "h-10 border-b flex items-center justify-between px-3",
            isDark
              ? "border-[hsl(142,50%,35%)/0.3] bg-gradient-to-r from-[hsl(142,45%,18%)/0.3] to-[hsl(160,40%,18%)/0.2]"
              : "border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50"
          )}>
            <span className="text-sm font-medium flex items-center gap-2">
              <div className={cn(
                "p-1 rounded-md",
                isDark ? "bg-[hsl(142,50%,35%)/0.3]" : "bg-emerald-100"
              )}>
                <Book className={cn("h-3.5 w-3.5", isDark ? "text-[hsl(142,60%,55%)]" : "text-emerald-600")} />
              </div>
              <span className={cn("font-semibold", isDark ? "text-[hsl(142,50%,60%)]" : "text-emerald-700")}>Books</span>
            </span>
            <Button variant="ghost" size="icon" className={cn(
              "h-6 w-6",
              isDark ? "hover:bg-[hsl(142,45%,35%)/0.2] text-[hsl(142,55%,65%)]" : "hover:bg-emerald-100 text-emerald-600"
            )} onClick={() => toggleExpand("books")}>
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
            "rounded-2xl backdrop-blur-xl border-2 transition-all duration-300 overflow-hidden",
            isDark
              ? "bg-[hsl(230,35%,12%)/0.95] border-[hsl(200,80%,55%)/0.6] shadow-[0_0_40px_-5px_hsl(200,80%,55%/0.5),0_0_80px_-10px_hsl(200,70%,50%/0.3),inset_0_1px_0_hsl(200,70%,60%/0.15)]"
              : "bg-white/90 border-cyan-400 shadow-lg shadow-cyan-200/50",
            expandedPanel === "text" ? "flex-1" : "h-1/2"
          )}>
            <div className={cn(
              "h-10 border-b flex items-center justify-between px-3",
              isDark
                ? "border-[hsl(200,60%,40%)/0.3] bg-gradient-to-r from-[hsl(200,50%,18%)/0.4] via-[hsl(210,40%,16%)/0.3] to-[hsl(190,45%,18%)/0.3]"
                : "border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-50"
            )}>
              <div className="flex items-center gap-2">
                <div className={cn(
                  "p-1 rounded-md",
                  isDark ? "bg-[hsl(200,60%,40%)/0.3]" : "bg-cyan-100"
                )}>
                  <BookOpen className={cn("h-3.5 w-3.5", isDark ? "text-[hsl(200,70%,60%)]" : "text-cyan-600")} />
                </div>
                <span className={cn("text-sm font-semibold", isDark ? "text-[hsl(200,60%,65%)]" : "text-cyan-700")}>Scripture</span>
                {centerView === "single" && (
                  <Tabs value={translation} onValueChange={(v) => setTranslation(v as Translation)} className="h-8">
                    <TabsList className={cn(
                      "h-7 border flex-wrap",
                      isDark
                        ? "bg-[hsl(230,30%,15%)/0.8] border-[hsl(32,60%,50%)/0.5] shadow-[0_0_15px_-3px_hsl(32,80%,50%/0.4)]"
                        : "bg-white/80 border-amber-200 shadow-sm"
                    )}>
                      {["kjv", "kjvs", "nkjv", "asv", "web", "ylt", "darby", "bbe", "niv", "esv", "nasb", "nlt", "rves"].map((t) => (
                        <TabsTrigger
                          key={t}
                          value={t}
                          className={cn(
                            "text-[10px] h-5 px-1.5",
                            t === "kjvs"
                              ? "text-purple-500 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
                              : isDark
                                ? "text-[hsl(45,50%,65%)] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(32,80%,50%)] data-[state=active]:to-[hsl(45,90%,50%)] data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_hsl(32,80%,50%/0.5)]"
                                : "text-amber-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
                          )}
                        >
                          {t.toUpperCase()}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                )}
              </div>
              <Button variant="ghost" size="icon" className={cn(
                "h-6 w-6",
                isDark ? "hover:bg-[hsl(32,50%,40%)/0.2] text-[hsl(45,60%,70%)]" : "hover:bg-amber-100 text-amber-600"
              )} onClick={() => toggleExpand("text")}>
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
                  translation={translation}
                  book={book}
                  chapter={chapter}
                />
              </ScrollArea>
            ) : centerView === "interlinear" ? (
              <ScrollArea className="h-[calc(100%-2.5rem)]">
                <InterlinearPanel
                  verses={chapterData?.verses || []}
                  selectedVerse={selectedVerse}
                  onVerseSelect={setSelectedVerse}
                  loading={loading}
                  book={book}
                  chapter={chapter}
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
            <div className={cn(
              "flex-1 min-h-0 rounded-2xl backdrop-blur-xl border-2 overflow-hidden",
              isDark
                ? "bg-[hsl(230,35%,12%)/0.95] border-[hsl(38,85%,55%)/0.6] shadow-[0_0_40px_-5px_hsl(38,85%,55%/0.5),0_0_80px_-10px_hsl(38,75%,50%/0.3),inset_0_1px_0_hsl(38,75%,60%/0.15)]"
                : "bg-white/90 border-amber-400 shadow-lg shadow-amber-200/50"
            )}>
              <div className={cn(
                "h-10 border-b flex items-center justify-between px-3",
                isDark
                  ? "border-[hsl(38,65%,45%)/0.3] bg-gradient-to-r from-[hsl(38,55%,22%)/0.3] to-[hsl(45,50%,20%)/0.2]"
                  : "border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50"
              )}>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "p-1 rounded-md",
                    isDark ? "bg-[hsl(38,70%,45%)/0.3]" : "bg-amber-100"
                  )}>
                    <Languages className={cn("h-3.5 w-3.5", isDark ? "text-[hsl(38,80%,60%)]" : "text-amber-600")} />
                  </div>
                  <span className={cn("text-sm font-semibold", isDark ? "text-[hsl(45,70%,65%)]" : "text-amber-700")}>Dictionary</span>
                  <Tabs value={activeDictionary} onValueChange={setActiveDictionary} className="h-8">
                    <TabsList className={cn(
                      "h-7 border",
                      isDark
                        ? "bg-[hsl(230,30%,15%)/0.8] border-[hsl(32,60%,50%)/0.5] shadow-[0_0_15px_-3px_hsl(32,80%,50%/0.4)]"
                        : "bg-white/80 border-amber-200 shadow-sm"
                    )}>
                      {["strongs", "thayers", "bdb"].map((dict) => (
                        <TabsTrigger
                          key={dict}
                          value={dict}
                          className={cn(
                            "text-xs h-6 px-2",
                            isDark
                              ? "text-[hsl(45,50%,65%)] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(32,80%,50%)] data-[state=active]:to-[hsl(45,90%,50%)] data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_hsl(32,80%,50%/0.5)]"
                              : "text-amber-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
                          )}
                        >
                          {dict === "strongs" ? "Strong's" : dict === "thayers" ? "Thayer's" : "BDB"}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>
                <Button variant="ghost" size="icon" className={cn(
                  "h-6 w-6",
                  isDark ? "hover:bg-[hsl(32,50%,40%)/0.2] text-[hsl(45,60%,70%)]" : "hover:bg-amber-100 text-amber-600"
                )} onClick={() => toggleExpand("dictionary")}>
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
            "rounded-2xl backdrop-blur-xl border-2 transition-all duration-300 shrink-0 overflow-hidden flex flex-col",
            isDark
              ? "bg-[hsl(230,35%,12%)/0.95] border-[hsl(270,70%,55%)/0.6] shadow-[0_0_40px_-5px_hsl(270,70%,55%/0.5),0_0_80px_-10px_hsl(270,60%,50%/0.3),inset_0_1px_0_hsl(270,60%,60%/0.15)]"
              : "bg-white/90 border-purple-400 shadow-lg shadow-purple-200/50",
            expandedPanel === "commentary" ? "w-[500px]" : "w-80"
          )}
        >
          {/* Tab Categories */}
          <div className={cn(
            "border-b p-2",
            isDark
              ? "border-[hsl(270,50%,45%)/0.3] bg-gradient-to-r from-[hsl(270,40%,18%)/0.3] via-[hsl(280,35%,16%)/0.2] to-[hsl(260,35%,18%)/0.3]"
              : "border-purple-200 bg-gradient-to-r from-purple-50 to-violet-50"
          )}>
            <div className={cn(
              "flex flex-wrap gap-1 p-1.5 rounded-xl border",
              isDark
                ? "bg-[hsl(230,30%,12%)/0.6] border-[hsl(270,55%,50%)/0.4] shadow-[0_0_20px_-5px_hsl(270,70%,55%/0.35),inset_0_1px_0_hsl(270,60%,60%/0.08)]"
                : "bg-white/60 border-purple-200 shadow-sm"
            )}>
              {/* AI & Commentary */}
              <Button
                size="sm"
                variant={rightTab === "jeeves" ? "default" : "ghost"}
                onClick={() => setRightTab("jeeves")}
                className={cn(
                  "h-6 text-[10px] px-2 transition-all",
                  rightTab === "jeeves"
                    ? "bg-gradient-to-r from-[hsl(210,70%,50%)] to-[hsl(190,60%,45%)] shadow-md shadow-[hsl(210,70%,50%)/0.3] text-white"
                    : isDark ? "hover:bg-[hsl(210,40%,30%)/0.3] text-[hsl(210,50%,70%)]" : "hover:bg-blue-100 text-blue-700"
                )}
              >
                <Bot className="h-3 w-3 mr-1" />
                Jeeves
              </Button>
              <Button
                size="sm"
                variant={rightTab === "crossref" ? "default" : "ghost"}
                onClick={() => setRightTab("crossref")}
                className={cn(
                  "h-6 text-[10px] px-2 transition-all",
                  rightTab === "crossref"
                    ? "bg-gradient-to-r from-[hsl(200,70%,45%)] to-[hsl(180,60%,45%)] shadow-md shadow-[hsl(200,70%,45%)/0.3] text-white"
                    : isDark ? "hover:bg-[hsl(200,40%,30%)/0.3] text-[hsl(200,50%,70%)]" : "hover:bg-cyan-100 text-cyan-700"
                )}
              >
                <Link2 className="h-3 w-3 mr-1" />
                Links
              </Button>
              <Button
                size="sm"
                variant={rightTab === "genetics" ? "default" : "ghost"}
                onClick={() => setRightTab("genetics")}
                className={cn(
                  "h-6 text-[10px] px-2 transition-all",
                  rightTab === "genetics"
                    ? "bg-gradient-to-r from-[hsl(180,60%,40%)] to-[hsl(142,55%,40%)] shadow-md shadow-[hsl(142,55%,40%)/0.3] text-white"
                    : isDark ? "hover:bg-[hsl(142,35%,25%)/0.3] text-[hsl(142,45%,60%)]" : "hover:bg-emerald-100 text-emerald-700"
                )}
              >
                <GitBranch className="h-3 w-3 mr-1" />
                Genetics
              </Button>
              <Button
                size="sm"
                variant={rightTab === "notes" ? "default" : "ghost"}
                onClick={() => setRightTab("notes")}
                className={cn(
                  "h-6 text-[10px] px-2 transition-all",
                  rightTab === "notes"
                    ? "bg-gradient-to-r from-[hsl(32,80%,50%)] to-[hsl(45,90%,50%)] shadow-md shadow-[hsl(32,80%,50%)/0.3] text-white"
                    : isDark ? "hover:bg-[hsl(32,50%,30%)/0.3] text-[hsl(45,60%,70%)]" : "hover:bg-amber-100 text-amber-700"
                )}
              >
                <StickyNote className="h-3 w-3 mr-1" />
                Notes
              </Button>

              <div className={cn(
                "w-px h-4 bg-gradient-to-b from-transparent via-current to-transparent mx-1 self-center",
                isDark ? "text-[hsl(32,70%,50%)/0.4]" : "text-purple-300"
              )} />

              {/* PT Tools */}
              <Button
                size="sm"
                variant={rightTab === "palace" ? "default" : "ghost"}
                onClick={() => setRightTab("palace")}
                className={cn(
                  "h-6 text-[10px] px-2 transition-all",
                  rightTab === "palace"
                    ? "bg-gradient-to-r from-[hsl(270,60%,50%)] to-[hsl(210,70%,50%)] shadow-md shadow-[hsl(270,60%,50%)/0.3] text-white"
                    : isDark ? "hover:bg-[hsl(270,40%,30%)/0.3] text-[hsl(270,50%,70%)]" : "hover:bg-purple-100 text-purple-700"
                )}
              >
                <Building2 className="h-3 w-3 mr-1" />
                Palace
              </Button>
              <Button
                size="sm"
                variant={rightTab === "cycles" ? "default" : "ghost"}
                onClick={() => setRightTab("cycles")}
                className={cn(
                  "h-6 text-[10px] px-2 transition-all",
                  rightTab === "cycles"
                    ? "bg-gradient-to-r from-[hsl(200,70%,45%)] to-[hsl(180,60%,45%)] shadow-md shadow-[hsl(180,60%,45%)/0.3] text-white"
                    : isDark ? "hover:bg-[hsl(180,40%,28%)/0.3] text-[hsl(180,50%,65%)]" : "hover:bg-teal-100 text-teal-700"
                )}
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Cycles
              </Button>
              <Button
                size="sm"
                variant={rightTab === "heavens" ? "default" : "ghost"}
                onClick={() => setRightTab("heavens")}
                className={cn(
                  "h-6 text-[10px] px-2 transition-all",
                  rightTab === "heavens"
                    ? "bg-gradient-to-r from-[hsl(210,70%,50%)] to-[hsl(270,60%,50%)] shadow-md shadow-[hsl(210,70%,50%)/0.3] text-white"
                    : isDark ? "hover:bg-[hsl(210,40%,30%)/0.3] text-[hsl(210,50%,70%)]" : "hover:bg-indigo-100 text-indigo-700"
                )}
              >
                <Layers className="h-3 w-3 mr-1" />
                3H
              </Button>
              <Button
                size="sm"
                variant={rightTab === "sanctuary" ? "default" : "ghost"}
                onClick={() => setRightTab("sanctuary")}
                className={cn(
                  "h-6 text-[10px] px-2 transition-all",
                  rightTab === "sanctuary"
                    ? "bg-gradient-to-r from-[hsl(32,80%,50%)] to-[hsl(45,90%,50%)] shadow-md shadow-[hsl(45,90%,50%)/0.3] text-white"
                    : isDark ? "hover:bg-[hsl(45,50%,30%)/0.3] text-[hsl(45,60%,65%)]" : "hover:bg-amber-100 text-amber-700"
                )}
              >
                <Landmark className="h-3 w-3 mr-1" />
                Sanct.
              </Button>
              <Button
                size="sm"
                variant={rightTab === "ascensions" ? "default" : "ghost"}
                onClick={() => setRightTab("ascensions")}
                className={cn(
                  "h-6 text-[10px] px-2 transition-all",
                  rightTab === "ascensions"
                    ? "bg-gradient-to-r from-[hsl(180,60%,40%)] to-[hsl(142,55%,40%)] shadow-md shadow-[hsl(142,55%,40%)/0.3] text-white"
                    : isDark ? "hover:bg-[hsl(142,35%,25%)/0.3] text-[hsl(142,45%,60%)]" : "hover:bg-emerald-100 text-emerald-700"
                )}
              >
                <ArrowUpRight className="h-3 w-3 mr-1" />
                5Asc
              </Button>
            </div>
          </div>

          {/* Panel Header */}
          <div className={cn(
            "h-10 border-b flex items-center justify-between px-3",
            isDark
              ? "border-[hsl(270,50%,45%)/0.3] bg-gradient-to-r from-[hsl(270,40%,18%)/0.3] to-[hsl(280,35%,16%)/0.2]"
              : "border-purple-200 bg-gradient-to-r from-purple-50/50 to-violet-50/50"
          )}>
            <div className="flex items-center gap-2">
              <div className={cn(
                "p-1 rounded-md",
                isDark ? "bg-[hsl(270,55%,45%)/0.3]" : "bg-purple-100"
              )}>
                <MessageSquare className={cn("h-3.5 w-3.5", isDark ? "text-[hsl(270,65%,65%)]" : "text-purple-600")} />
              </div>
              <span className={cn("text-sm font-semibold", isDark ? "text-[hsl(270,55%,70%)]" : "text-purple-700")}>
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
            <Button variant="ghost" size="icon" className={cn(
              "h-6 w-6",
              isDark ? "hover:bg-[hsl(270,45%,40%)/0.2] text-[hsl(270,55%,70%)]" : "hover:bg-purple-100 text-purple-600"
            )} onClick={() => toggleExpand("commentary")}>
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
