import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { usePersistedState, usePreservePageState } from "@/contexts/PageStateContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Brain, Loader2, Save, Trash2,
  ChevronLeft, ChevronRight, StickyNote,
  Book, Flame, Lightbulb, BookOpen, Target, Crosshair, Sparkles, Eye, Send, Search, Sun, Moon
} from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { BIBLE_BOOK_METADATA } from "@/data/bibleBooks";
import { motion, AnimatePresence } from "framer-motion";
import { fetchChapter } from "@/services/bibleApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { StudySimmerWrapper } from "@/components/simmer/StudySimmerWrapper";

// Types for Jeeves analysis
interface Spark {
  type: string;
  insight: string;
  verses?: string[];
  room?: string;
  explorePrompt?: string;
}

interface Source {
  claim: string;
  anchor: string;
  strength: 'strong' | 'moderate' | 'needs_work';
  suggestion?: string;
  explorePrompt?: string;
}

interface RoomSuggestion {
  room: string;
  roomName: string;
  floor: string;
  why: string;
  exercise?: string;
  explorePrompt?: string;
}

interface JeevesAnalysis {
  sparks: Spark[];
  sources: Source[];
  roomSuggestions: RoomSuggestion[];
  christConnection?: { present: boolean; suggestion?: string; explorePrompt?: string };
  cycleAndHeaven?: { cycle?: string; heaven?: string; reasoning?: string; explorePrompt?: string };
  nextStep?: { focus: string; question: string };
  overallResponse?: string;
}

export default function StudyBuddy() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const { preferences, updatePreference } = useUserPreferences();
  const analysisEndRef = useRef<HTMLDivElement>(null);

  // Theme state
  const isLightTheme = preferences.study_buddy_theme === "light";

  // Session state
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(
    searchParams.get("session") || null
  );

  // Preserve scroll position when switching pages
  usePreservePageState();

  // Bible panel state - persisted so it survives tab switching
  const [selectedBook, setSelectedBook] = usePersistedState("selectedBook", "Genesis");
  const [selectedChapter, setSelectedChapter] = usePersistedState("selectedChapter", 1);
  const [verses, setVerses] = useState<{ verse: number; text: string }[]>([]);
  const [loadingVerses, setLoadingVerses] = useState(false);

  // Notes panel state - persisted
  const [notes, setNotes] = usePersistedState("notes", "");
  const [sessionTitle, setSessionTitle] = usePersistedState("sessionTitle", "");
  const lastAnalyzedNotes = useRef("");
  const analysisTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Jeeves real-time analysis state
  const [jeevesLoading, setJeevesLoading] = useState(false);
  const [analysis, setAnalysis] = useState<JeevesAnalysis | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<string[]>([]);

  // Tab state for Study vs Simmer
  const [activeTab, setActiveTab] = useState<"study" | "simmer">("study");

  // Get chapter count for selected book
  const getChapterCount = () => {
    const book = BIBLE_BOOK_METADATA.find(b => b.name === selectedBook);
    return book?.chapters || 1;
  };

  useEffect(() => {
    console.log("[StudyBuddy] Auth state:", { authLoading, user: !!user });
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Load existing session if session ID provided
  useEffect(() => {
    const loadExistingSession = async () => {
      if (!currentSessionId || !user) return;
      
      try {
        const { data, error } = await supabase
          .from("study_sessions")
          .select("*")
          .eq("id", currentSessionId)
          .eq("user_id", user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setSessionTitle(data.title || "");
          // Load context from jeeves_context if available
          const ctx = data.jeeves_context as { book?: string; chapter?: number; notes?: string } | null;
          if (ctx) {
            if (ctx.book) setSelectedBook(ctx.book);
            if (ctx.chapter) setSelectedChapter(ctx.chapter);
            if (ctx.notes) setNotes(ctx.notes);
          }
        }
      } catch (err) {
        console.error("Error loading session:", err);
      }
    };
    
    loadExistingSession();
  }, [currentSessionId, user]);

  // Load verses when book/chapter changes
  useEffect(() => {
    loadVerses();
  }, [selectedBook, selectedChapter]);

  // Scroll to bottom of analysis
  useEffect(() => {
    analysisEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [analysis]);

  // Real-time analysis as user types - debounced
  useEffect(() => {
    // Clear existing timeout
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
    }

    // Don't analyze if notes are too short or haven't changed significantly
    const trimmedNotes = notes.trim();
    if (trimmedNotes.length < 30) {
      return;
    }

    // Check if notes have changed enough to warrant new analysis
    const significantChange = Math.abs(trimmedNotes.length - lastAnalyzedNotes.current.length) > 20 ||
      trimmedNotes.slice(-50) !== lastAnalyzedNotes.current.slice(-50);

    if (!significantChange && analysis) {
      return;
    }

    // Debounce the analysis call
    analysisTimeoutRef.current = setTimeout(() => {
      analyzeNotes();
    }, 1500); // 1.5 second debounce

    return () => {
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current);
      }
    };
  }, [notes, selectedBook, selectedChapter, verses]);

  const loadVerses = async () => {
    setLoadingVerses(true);
    try {
      const chapter = await fetchChapter(selectedBook, selectedChapter, "kjv");
      setVerses(chapter.verses.map(v => ({ verse: v.verse, text: v.text })));
    } catch (error) {
      console.error("Error loading verses:", error);
      setVerses([]);
    } finally {
      setLoadingVerses(false);
    }
  };

  // Check if notes contain a question
  const isQuestion = (text: string): boolean => {
    const trimmed = text.trim();
    // Check for question mark or common question starters
    if (trimmed.includes('?')) return true;
    const questionStarters = /^(what|who|where|when|why|how|is|are|was|were|do|does|did|can|could|would|should|will|which|list|explain|describe|tell me|show me)/i;
    return questionStarters.test(trimmed);
  };

  const analyzeNotes = useCallback(async (forceAnalysis = false) => {
    const trimmedNotes = notes.trim();
    if (trimmedNotes.length < 10 || jeevesLoading) return;

    // Auto-trigger for questions, otherwise need more content
    const hasQuestion = isQuestion(trimmedNotes);
    if (!hasQuestion && trimmedNotes.length < 30) return;

    // Skip if not forced and notes haven't changed much (unless it's a question)
    if (!forceAnalysis && !hasQuestion && trimmedNotes === lastAnalyzedNotes.current) return;

    setJeevesLoading(true);
    lastAnalyzedNotes.current = trimmedNotes;

    try {
      // Only analyze what's in the notes - no automatic Bible context
      const { data, error } = await supabase.functions.invoke("study-buddy", {
        body: {
          notes: trimmedNotes,
          sessionHistory: analysisHistory.slice(-5), // Last 5 notes for context
        },
      });

      if (error) throw error;

      if (data.analysis) {
        setAnalysis(data.analysis);
        // Add to history for context
        setAnalysisHistory(prev => [...prev.slice(-10), trimmedNotes]);
      }
    } catch (error: any) {
      console.error("Jeeves analysis error:", error);
      toast.error("Jeeves couldn't analyze - try again");
    } finally {
      setJeevesLoading(false);
    }
  }, [notes, selectedBook, selectedChapter, verses, analysisHistory, jeevesLoading]);

  const navigateChapter = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (selectedChapter > 1) {
        setSelectedChapter(selectedChapter - 1);
      } else {
        const bookIndex = BIBLE_BOOK_METADATA.findIndex(b => b.name === selectedBook);
        if (bookIndex > 0) {
          const prevBook = BIBLE_BOOK_METADATA[bookIndex - 1];
          setSelectedBook(prevBook.name);
          setSelectedChapter(prevBook.chapters);
        }
      }
    } else {
      const maxChapters = getChapterCount();
      if (selectedChapter < maxChapters) {
        setSelectedChapter(selectedChapter + 1);
      } else {
        const bookIndex = BIBLE_BOOK_METADATA.findIndex(b => b.name === selectedBook);
        if (bookIndex < BIBLE_BOOK_METADATA.length - 1) {
          setSelectedBook(BIBLE_BOOK_METADATA[bookIndex + 1].name);
          setSelectedChapter(1);
        }
      }
    }
  };

  const addVerseToNotes = (verse: number, text: string) => {
    const reference = `${selectedBook} ${selectedChapter}:${verse}`;
    setNotes(prev => prev + (prev ? "\n\n" : "") + `[${reference}] ${text}`);
    toast.success(`Added ${reference} to notes`);
  };

  // Explore a spark, source, or suggestion by adding its explore prompt to notes
  const exploreItem = (explorePrompt: string, label: string) => {
    setNotes(prev => prev + (prev ? "\n\n" : "") + `--- Exploring: ${label} ---\n${explorePrompt}`);
    toast.success(`Added "${label}" to explore — Jeeves will respond!`);
  };

  const saveSession = async () => {
    if (!notes.trim()) {
      toast.error("No notes to save");
      return;
    }

    try {
      // Create or update session
      if (currentSessionId) {
        // Update existing session
        const { error } = await supabase.from("study_sessions").update({
          title: sessionTitle || `${selectedBook} ${selectedChapter} Study - ${new Date().toLocaleDateString()}`,
          description: notes.substring(0, 200),
          jeeves_context: JSON.parse(JSON.stringify({ book: selectedBook, chapter: selectedChapter, notes, analysis })),
          has_jeeves_history: !!analysis,
        }).eq("id", currentSessionId);

        if (error) throw error;
        toast.success("Session updated!");
      } else {
        // Create new session
        const { data: newSession, error } = await supabase.from("study_sessions").insert([{
          user_id: user?.id!,
          title: sessionTitle || `${selectedBook} ${selectedChapter} Study - ${new Date().toLocaleDateString()}`,
          description: notes.substring(0, 200),
          jeeves_context: JSON.parse(JSON.stringify({ book: selectedBook, chapter: selectedChapter, notes, analysis })),
          tabs_data: JSON.parse(JSON.stringify([])),
          has_jeeves_history: !!analysis,
        }]).select().single();

        if (error) throw error;
        
        setCurrentSessionId(newSession?.id || null);
        toast.success("Session saved!");
      }
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error.message || "Failed to save session");
    }
  };

  const handleClearSession = async () => {
    setNotes("");
    setSessionTitle("");
    setAnalysis(null);
    setAnalysisHistory([]);
    lastAnalyzedNotes.current = "";
    setCurrentSessionId(null);
    toast.success("Session cleared");
  };

  if (authLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isLightTheme 
          ? "bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50" 
          : "bg-gradient-to-br from-orange-950 via-amber-900 to-red-950"
      }`}>
        <Loader2 className={`w-8 h-8 animate-spin ${isLightTheme ? "text-orange-600" : "text-orange-400"}`} />
      </div>
    );
  }

  const toggleTheme = () => {
    updatePreference("study_buddy_theme", isLightTheme ? "dark" : "light");
  };

  return (
    <div className={`min-h-screen relative overflow-hidden flex flex-col ${
      isLightTheme 
        ? "bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50" 
        : "bg-gradient-to-br from-orange-950 via-amber-900 to-red-950"
    }`}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: isLightTheme ? [0.1, 0.2, 0.1] : [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl ${
            isLightTheme ? "bg-orange-300/30" : "bg-orange-500/40"
          }`}
        />
        <motion.div
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: isLightTheme ? [0.15, 0.25, 0.15] : [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className={`absolute top-1/2 -right-32 w-80 h-80 rounded-full blur-3xl ${
            isLightTheme ? "bg-amber-300/30" : "bg-red-500/40"
          }`}
        />
        <motion.div
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: isLightTheme ? [0.1, 0.2, 0.1] : [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className={`absolute -bottom-32 left-1/3 w-72 h-72 rounded-full blur-3xl ${
            isLightTheme ? "bg-yellow-300/30" : "bg-amber-500/30"
          }`}
        />
      </div>

      <Navigation />

      {/* Header */}
      <div className={`relative z-10 backdrop-blur-xl border-b py-4 px-6 flex-shrink-0 ${
        isLightTheme 
          ? "bg-white/60 border-orange-200" 
          : "bg-black/20 border-orange-500/20"
      }`}>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between flex-wrap gap-4"
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg ${
              isLightTheme ? "shadow-orange-300/50" : "shadow-orange-500/30"
            }`}>
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${isLightTheme ? "text-gray-900" : "text-white"}`}>Study Buddy</h1>
              <p className={`text-sm ${isLightTheme ? "text-orange-700" : "text-orange-200"}`}>Bible · Notes · Jeeves</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleTheme}
              className={`${
                isLightTheme 
                  ? "bg-white/80 border-orange-300 text-orange-700 hover:bg-orange-100" 
                  : "bg-black/20 border-orange-500/30 text-orange-200 hover:bg-orange-500/20"
              }`}
              title={isLightTheme ? "Switch to dark mode" : "Switch to light mode"}
            >
              {isLightTheme ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
            <Button 
              size="sm" 
              onClick={() => navigate("/sermon-simmer")}
              className={`bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white shadow-lg ${
                isLightTheme ? "shadow-red-300/50" : "shadow-red-500/30"
              }`}
            >
              <Flame className="w-4 h-4 mr-1" />
              New Sermon
            </Button>
            <Input
              placeholder="Session title..."
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
              className={`w-40 h-9 text-sm ${
                isLightTheme 
                  ? "bg-white/80 border-orange-300 text-gray-900 placeholder:text-orange-400" 
                  : "bg-black/30 border-orange-500/30 text-white placeholder:text-orange-200/50"
              }`}
            />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearSession}
              className={`${
                isLightTheme 
                  ? "bg-white/80 border-orange-300 text-orange-700 hover:bg-orange-100" 
                  : "bg-black/20 border-orange-500/30 text-orange-200 hover:bg-orange-500/20"
              }`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              onClick={saveSession} 
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <div className="relative z-10 px-6">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "study" | "simmer")} className="w-full">
          <TabsList className={`p-1 ${
            isLightTheme 
              ? "bg-white/70 border border-orange-200" 
              : "bg-black/30 border border-orange-500/20"
          }`}>
            <TabsTrigger 
              value="study" 
              className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white ${
                isLightTheme ? "text-orange-700" : "text-orange-200"
              }`}
            >
              <Brain className="w-4 h-4 mr-2" />
              Study
            </TabsTrigger>
            <TabsTrigger 
              value="simmer" 
              className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-orange-500 data-[state=active]:text-white ${
                isLightTheme ? "text-orange-700" : "text-orange-200"
              }`}
            >
              <Flame className="w-4 h-4 mr-2" />
              Simmer
            </TabsTrigger>
          </TabsList>

          {/* Study Tab Content */}
          <TabsContent value="study" className="mt-0 flex-1">
            {/* Three Panel Layout */}
            <div className="flex-1 overflow-hidden relative z-10 py-4" style={{ height: 'calc(100vh - 200px)' }}>
        <ResizablePanelGroup direction="horizontal" className="h-full rounded-xl overflow-hidden">
          {/* Bible Panel */}
          <ResizablePanel defaultSize={35} minSize={20}>
            <Card className={`h-full flex flex-col backdrop-blur-xl rounded-none rounded-l-xl ${
              isLightTheme 
                ? "bg-white/70 border-orange-200" 
                : "bg-black/30 border-orange-500/20"
            }`}>
              {/* Bible Navigation */}
              <div className={`p-4 border-b flex-shrink-0 ${
                isLightTheme ? "border-orange-200" : "border-orange-500/20"
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <Book className={`w-5 h-5 ${isLightTheme ? "text-orange-600" : "text-orange-400"}`} />
                  <span className={`font-bold ${isLightTheme ? "text-gray-900" : "text-white"}`}>Bible</span>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={selectedBook} onValueChange={(v) => { setSelectedBook(v); setSelectedChapter(1); }}>
                    <SelectTrigger className={`flex-1 h-9 text-sm ${
                      isLightTheme 
                        ? "bg-white border-orange-300 text-gray-900" 
                        : "bg-black/30 border-orange-500/30 text-white"
                    }`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={`max-h-60 ${
                      isLightTheme 
                        ? "bg-white border-orange-200" 
                        : "bg-amber-950 border-orange-500/30"
                    }`}>
                      {BIBLE_BOOK_METADATA.map(book => (
                        <SelectItem key={book.name} value={book.name} className={
                          isLightTheme 
                            ? "text-gray-900 hover:bg-orange-100" 
                            : "text-white hover:bg-orange-500/20"
                        }>{book.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedChapter.toString()} onValueChange={(v) => setSelectedChapter(parseInt(v))}>
                    <SelectTrigger className={`w-20 h-9 text-sm ${
                      isLightTheme 
                        ? "bg-white border-orange-300 text-gray-900" 
                        : "bg-black/30 border-orange-500/30 text-white"
                    }`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={`max-h-60 ${
                      isLightTheme 
                        ? "bg-white border-orange-200" 
                        : "bg-amber-950 border-orange-500/30"
                    }`}>
                      {Array.from({ length: getChapterCount() }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()} className={
                          isLightTheme 
                            ? "text-gray-900 hover:bg-orange-100" 
                            : "text-white hover:bg-orange-500/20"
                        }>{i + 1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigateChapter('prev')}
                    className={isLightTheme 
                      ? "text-orange-700 hover:bg-orange-100 hover:text-orange-900" 
                      : "text-orange-200 hover:bg-orange-500/20 hover:text-white"
                    }
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Prev
                  </Button>
                  <span className={`text-sm ${isLightTheme ? "text-orange-700" : "text-orange-200"}`}>{selectedBook} {selectedChapter}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigateChapter('next')}
                    className={isLightTheme 
                      ? "text-orange-700 hover:bg-orange-100 hover:text-orange-900" 
                      : "text-orange-200 hover:bg-orange-500/20 hover:text-white"
                    }
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Verses */}
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-2">
                  {loadingVerses ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className={`w-6 h-6 animate-spin ${isLightTheme ? "text-orange-600" : "text-orange-400"}`} />
                    </div>
                  ) : verses.length === 0 ? (
                    <p className={`text-center text-sm py-8 ${isLightTheme ? "text-orange-600/60" : "text-orange-200/60"}`}>
                      No verses found
                    </p>
                  ) : (
                    verses.map((v) => (
                      <motion.div
                        key={v.verse}
                        whileHover={{ scale: 1.01 }}
                        onClick={() => addVerseToNotes(v.verse, v.text)}
                        className={`p-3 rounded-lg border border-transparent cursor-pointer transition-all group ${
                          isLightTheme 
                            ? "bg-orange-50 hover:bg-orange-100 hover:border-orange-300" 
                            : "bg-amber-500/5 hover:bg-amber-500/15 hover:border-amber-500/30"
                        }`}
                      >
                        <span className={`font-bold text-sm mr-2 ${isLightTheme ? "text-orange-600" : "text-orange-400"}`}>{v.verse}</span>
                        <span className={`text-sm leading-relaxed ${isLightTheme ? "text-gray-800" : "text-orange-100"}`}>{v.text}</span>
                        <span className={`text-xs ml-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                          isLightTheme ? "text-orange-500" : "text-orange-200/50"
                        }`}>
                          (click to add)
                        </span>
                      </motion.div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </Card>
          </ResizablePanel>

          <ResizableHandle withHandle className={isLightTheme 
            ? "bg-orange-200 hover:bg-orange-300 transition-colors" 
            : "bg-orange-500/20 hover:bg-orange-500/40 transition-colors"
          } />

          {/* Notes Panel - Emerald/Teal Theme */}
          <ResizablePanel defaultSize={35} minSize={20}>
            <Card className={`h-full flex flex-col backdrop-blur-xl rounded-none border-l-0 border-r-0 ${
              isLightTheme 
                ? "bg-emerald-50/70 border-emerald-200" 
                : "bg-emerald-950/40 border-emerald-500/20"
            }`}>
              <div className={`p-4 border-b flex-shrink-0 ${
                isLightTheme ? "border-emerald-200" : "border-emerald-500/20"
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StickyNote className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold text-white">Notes</span>
                  </div>
                  {jeevesLoading && (
                    <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
                  )}
                </div>
                <p className="text-xs text-emerald-200/60 mt-1">Write notes or ask questions — Jeeves will auto-respond</p>
              </div>
              <div className="flex-1 p-4">
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Write freely here. Click verses to add them.

Jeeves sees your notes and will spark connections, suggest PT rooms, source claims, and help you think Phototheologically."
                  className="h-full resize-none border-0 focus-visible:ring-0 text-sm bg-transparent text-emerald-100 placeholder:text-emerald-200/40"
                />
              </div>
            </Card>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-emerald-500/20 hover:bg-emerald-500/40 transition-colors" />

          {/* Jeeves Panel - Purple/Violet Theme - Real-time Analysis */}
          <ResizablePanel defaultSize={30} minSize={20}>
            <Card className="h-full flex flex-col bg-violet-950/40 border-violet-500/20 backdrop-blur-xl rounded-none rounded-r-xl border-l-0">
              <div className="p-4 border-b border-violet-500/20 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-violet-400" />
                    <span className="font-bold text-white">Jeeves</span>
                  </div>
                  {jeevesLoading && (
                    <div className="flex items-center gap-2 text-violet-300">
                      <Eye className="w-4 h-4 animate-pulse" />
                      <span className="text-xs">Reading...</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-violet-200/60 mt-1">
                  {notes.trim().length < 30 
                    ? "Start typing in Notes — Jeeves will respond as you write"
                    : "Watching your notes and sparking connections..."}
                </p>
              </div>

              {/* Real-time Analysis Display */}
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                  {!analysis && !jeevesLoading && notes.trim().length < 30 ? (
                    <div className="text-center py-8">
                      <Brain className="w-12 h-12 text-violet-500/30 mx-auto mb-3" />
                      <p className="text-sm text-violet-200/60">
                        Jeeves is watching your notes
                      </p>
                      <p className="text-xs text-violet-200/40 mt-2">
                        Start typing and he'll spark connections, suggest rooms, and apply PT principles automatically
                      </p>
                    </div>
                  ) : (
                    <AnimatePresence mode="wait">
                      {/* Overall Response */}
                      {analysis?.overallResponse && (
                        <motion.div
                          key="response"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/20 text-sm text-violet-100"
                        >
                          <p className="whitespace-pre-wrap">{analysis.overallResponse}</p>
                        </motion.div>
                      )}

                      {/* Sparks */}
                      {analysis?.sparks && analysis.sparks.length > 0 && (
                        <motion.div
                          key="sparks"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-2"
                        >
                          <div className="flex items-center gap-2 text-amber-400">
                            <Lightbulb className="w-4 h-4" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Sparks</span>
                          </div>
                          {analysis.sparks.map((spark, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20"
                            >
                              <div className="flex items-start gap-2">
                                <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-300">
                                      {spark.type}
                                    </Badge>
                                    {spark.room && (
                                      <Badge variant="outline" className="text-[10px] border-violet-500/30 text-violet-300">
                                        {spark.room}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-amber-100">{spark.insight}</p>
                                  {spark.verses && spark.verses.length > 0 && (
                                    <p className="text-xs text-amber-200/60 mt-1">
                                      {spark.verses.join(", ")}
                                    </p>
                                  )}
                                  {spark.explorePrompt && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => exploreItem(spark.explorePrompt!, spark.insight.substring(0, 30) + '...')}
                                      className="mt-2 h-7 text-xs text-amber-300 hover:text-amber-100 hover:bg-amber-500/20 gap-1 px-2"
                                    >
                                      <Search className="w-3 h-3" />
                                      Explore
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}

                      {/* Sources */}
                      {analysis?.sources && analysis.sources.length > 0 && (
                        <motion.div
                          key="sources"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-2"
                        >
                          <div className="flex items-center gap-2 text-blue-400">
                            <BookOpen className="w-4 h-4" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Sources</span>
                          </div>
                          {analysis.sources.map((source, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <Badge 
                                  variant="outline" 
                                  className={`text-[10px] ${
                                    source.strength === 'strong' 
                                      ? 'border-green-500/30 text-green-300'
                                      : source.strength === 'moderate'
                                      ? 'border-yellow-500/30 text-yellow-300'
                                      : 'border-red-500/30 text-red-300'
                                  }`}
                                >
                                  {source.strength}
                                </Badge>
                              </div>
                              <p className="text-sm text-blue-100">"{source.claim}"</p>
                              <p className="text-xs text-blue-200/60 mt-1">
                                Anchor: {source.anchor}
                              </p>
                              {source.suggestion && (
                                <p className="text-xs text-blue-300 mt-1 italic">
                                  💡 {source.suggestion}
                                </p>
                              )}
                              {source.explorePrompt && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => exploreItem(source.explorePrompt!, source.claim.substring(0, 30) + '...')}
                                  className="mt-2 h-7 text-xs text-blue-300 hover:text-blue-100 hover:bg-blue-500/20 gap-1 px-2"
                                >
                                  <Search className="w-3 h-3" />
                                  Explore
                                </Button>
                              )}
                            </motion.div>
                          ))}
                        </motion.div>
                      )}

                      {/* Room Suggestions */}
                      {analysis?.roomSuggestions && analysis.roomSuggestions.length > 0 && (
                        <motion.div
                          key="rooms"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-2"
                        >
                          <div className="flex items-center gap-2 text-emerald-400">
                            <Target className="w-4 h-4" />
                            <span className="text-xs font-semibold uppercase tracking-wider">PT Rooms</span>
                          </div>
                          {analysis.roomSuggestions.map((room, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-300">
                                  {room.room}
                                </Badge>
                                <span className="text-xs text-emerald-200/60">{room.floor}</span>
                              </div>
                              <p className="text-sm font-medium text-emerald-100">{room.roomName}</p>
                              <p className="text-xs text-emerald-200/80 mt-1">{room.why}</p>
                              {room.exercise && (
                                <p className="text-xs text-emerald-300 mt-2 p-2 bg-emerald-500/10 rounded">
                                  Try: {room.exercise}
                                </p>
                              )}
                              {room.explorePrompt && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => exploreItem(room.explorePrompt!, room.roomName)}
                                  className="mt-2 h-7 text-xs text-emerald-300 hover:text-emerald-100 hover:bg-emerald-500/20 gap-1 px-2"
                                >
                                  <Search className="w-3 h-3" />
                                  Explore
                                </Button>
                              )}
                            </motion.div>
                          ))}
                        </motion.div>
                      )}

                      {/* Christ Connection */}
                      {analysis?.christConnection && (
                        <motion.div
                          key="christ"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Crosshair className="w-4 h-4 text-rose-400" />
                            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
                              Christ Connection
                            </span>
                            <Badge 
                              variant="outline" 
                              className={`text-[10px] ${
                                analysis.christConnection.present 
                                  ? 'border-green-500/30 text-green-300'
                                  : 'border-orange-500/30 text-orange-300'
                              }`}
                            >
                              {analysis.christConnection.present ? 'Found' : 'Needs Focus'}
                            </Badge>
                          </div>
                          {analysis.christConnection.suggestion && (
                            <p className="text-sm text-rose-100">{analysis.christConnection.suggestion}</p>
                          )}
                          {analysis.christConnection.explorePrompt && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => exploreItem(analysis.christConnection!.explorePrompt!, 'Christ Connection')}
                              className="mt-2 h-7 text-xs text-rose-300 hover:text-rose-100 hover:bg-rose-500/20 gap-1 px-2"
                            >
                              <Search className="w-3 h-3" />
                              Explore
                            </Button>
                          )}
                        </motion.div>
                      )}

                      {/* Cycle & Heaven */}
                      {analysis?.cycleAndHeaven && (analysis.cycleAndHeaven.cycle || analysis.cycleAndHeaven.heaven) && (
                        <motion.div
                          key="cycle"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                              Cycle & Heaven
                            </span>
                          </div>
                          <div className="flex gap-2 mb-2">
                            {analysis.cycleAndHeaven.cycle && (
                              <Badge variant="outline" className="text-[10px] border-purple-500/30 text-purple-300">
                                {analysis.cycleAndHeaven.cycle}
                              </Badge>
                            )}
                            {analysis.cycleAndHeaven.heaven && (
                              <Badge variant="outline" className="text-[10px] border-indigo-500/30 text-indigo-300">
                                {analysis.cycleAndHeaven.heaven}
                              </Badge>
                            )}
                          </div>
                          {analysis.cycleAndHeaven.reasoning && (
                            <p className="text-sm text-purple-100">{analysis.cycleAndHeaven.reasoning}</p>
                          )}
                          {analysis.cycleAndHeaven.explorePrompt && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => exploreItem(analysis.cycleAndHeaven!.explorePrompt!, 'Cycle & Heaven')}
                              className="mt-2 h-7 text-xs text-purple-300 hover:text-purple-100 hover:bg-purple-500/20 gap-1 px-2"
                            >
                              <Search className="w-3 h-3" />
                              Explore
                            </Button>
                          )}
                        </motion.div>
                      )}

                      {/* Next Step */}
                      {analysis?.nextStep && (
                        <motion.div
                          key="next"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-semibold uppercase tracking-wider text-violet-300">
                              Next Step
                            </span>
                          </div>
                          <p className="text-sm font-medium text-violet-100">{analysis.nextStep.focus}</p>
                          <p className="text-sm text-violet-200 mt-2 italic">
                            "{analysis.nextStep.question}"
                          </p>
                        </motion.div>
                      )}

                      {jeevesLoading && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-2 text-violet-200/60 p-3"
                        >
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Jeeves is analyzing...</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                  <div ref={analysisEndRef} />
                </div>
              </ScrollArea>
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>
            </div>
          </TabsContent>

          {/* Simmer Tab Content */}
          <TabsContent value="simmer" className="mt-0 flex-1">
            <div className="overflow-auto" style={{ height: 'calc(100vh - 200px)' }}>
              <StudySimmerWrapper 
                onExportToNotes={(content) => {
                  setNotes(prev => prev + (prev ? "\n\n---\n\n" : "") + content);
                  setActiveTab("study");
                  toast.success("Exported to Notes!");
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
