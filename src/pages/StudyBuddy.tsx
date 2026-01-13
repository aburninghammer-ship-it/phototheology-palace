import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useJeevesMessages, JeevesMessage } from "@/hooks/useJeevesMessages";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  Brain, Loader2, Send, Save, Trash2,
  ChevronLeft, ChevronRight, MessageSquare, StickyNote,
  Book, Flame, History, Sparkles
} from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { BIBLE_BOOK_METADATA } from "@/data/bibleBooks";
import { motion } from "framer-motion";
import { fetchChapter } from "@/services/bibleApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function StudyBuddy() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Session state
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(
    searchParams.get("session") || null
  );

  // Bible panel state
  const [selectedBook, setSelectedBook] = useState("Genesis");
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [verses, setVerses] = useState<{ verse: number; text: string }[]>([]);
  const [loadingVerses, setLoadingVerses] = useState(false);

  // Notes panel state
  const [notes, setNotes] = useState("");
  const [sessionTitle, setSessionTitle] = useState("");

  // Jeeves with persistence
  const {
    messages: jeevesMessages,
    setMessages: setJeevesMessages,
    saveMessage,
    saveMessages,
    clearMessages,
    loading: loadingMessages,
  } = useJeevesMessages({ sessionId: currentSessionId || undefined, autoLoad: !!currentSessionId });
  
  const [jeevesInput, setJeevesInput] = useState("");
  const [jeevesLoading, setJeevesLoading] = useState(false);

  // Auto-analysis state
  const lastAnalyzedNotesRef = useRef<string>("");
  const autoAnalysisTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [autoAnalyzing, setAutoAnalyzing] = useState(false);

  // Constants for auto-analysis
  const MIN_NOTES_LENGTH = 50;
  const AUTO_ANALYZE_DELAY_MS = 2000; // 2 seconds after user stops typing
  const MIN_NEW_CONTENT_LENGTH = 30; // Minimum new characters to trigger re-analysis

  // Get chapter count for selected book
  const getChapterCount = () => {
    const book = BIBLE_BOOK_METADATA.find(b => b.name === selectedBook);
    return book?.chapters || 1;
  };

  useEffect(() => {
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

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [jeevesMessages]);

  // Auto-analysis: Generate Jeeves insights in real-time as user types notes
  useEffect(() => {
    // Clear any existing timeout
    if (autoAnalysisTimeoutRef.current) {
      clearTimeout(autoAnalysisTimeoutRef.current);
    }

    // Check if we have enough content to analyze
    const trimmedNotes = notes.trim();
    if (trimmedNotes.length < MIN_NOTES_LENGTH) {
      return;
    }

    // Check if the content has meaningfully changed
    const lastAnalyzed = lastAnalyzedNotesRef.current;
    const newContentLength = trimmedNotes.length - lastAnalyzed.length;
    const hasNewContent = !trimmedNotes.startsWith(lastAnalyzed) || newContentLength >= MIN_NEW_CONTENT_LENGTH;

    if (!hasNewContent) {
      return; // No meaningful change, skip analysis
    }

    // Don't auto-analyze if already analyzing or manually querying
    if (autoAnalyzing || jeevesLoading) {
      return;
    }

    // Set a timeout to analyze after the user stops typing
    autoAnalysisTimeoutRef.current = setTimeout(async () => {
      setAutoAnalyzing(true);
      try {
        // Build context from notes and current Bible passage
        const context = `
Current Bible Passage: ${selectedBook} ${selectedChapter}
${verses.length > 0 ? `Passage Text:\n${verses.slice(0, 20).map(v => `${v.verse}. ${v.text}`).join('\n')}` : ''}

User's Study Notes:
${trimmedNotes}
        `.trim();

        const { data, error } = await supabase.functions.invoke("study-buddy", {
          body: {
            notes: trimmedNotes,
            context,
            mode: 'auto-insight',
            sessionHistory: jeevesMessages.slice(-4).map(m => `${m.role}: ${m.content}`),
          },
        });

        if (error) throw error;

        const response = data.analysis?.overallResponse ||
                        data.analysis?.overallAssessment ||
                        data.response;

        if (response) {
          const insightMsg: JeevesMessage = {
            role: 'assistant',
            content: response
          };
          setJeevesMessages(prev => [...prev, insightMsg]);
          lastAnalyzedNotesRef.current = trimmedNotes;

          // Save if we have a session
          if (currentSessionId) {
            await saveMessage(insightMsg, currentSessionId);
          }
        }
      } catch (error: any) {
        console.error("Auto-analysis error:", error);
        // Silently fail for auto-analysis to avoid spamming
      } finally {
        setAutoAnalyzing(false);
      }
    }, AUTO_ANALYZE_DELAY_MS);

    return () => {
      if (autoAnalysisTimeoutRef.current) {
        clearTimeout(autoAnalysisTimeoutRef.current);
      }
    };
  }, [notes, selectedBook, selectedChapter, verses, autoAnalyzing, jeevesLoading]);

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

  const sendToJeeves = async () => {
    if (!jeevesInput.trim()) return;

    const userMessage = jeevesInput.trim();
    setJeevesInput("");
    
    // Add user message locally first (optimistic update)
    const userMsg: JeevesMessage = { role: 'user', content: userMessage };
    setJeevesMessages(prev => [...prev, userMsg]);
    setJeevesLoading(true);

    try {
      // Build context from notes and current Bible passage
      const context = `
Current Bible Passage: ${selectedBook} ${selectedChapter}
${verses.length > 0 ? `Passage Text:\n${verses.map(v => `${v.verse}. ${v.text}`).join('\n')}` : ''}

User's Study Notes:
${notes || '(No notes yet)'}
      `.trim();

      const { data, error } = await supabase.functions.invoke("study-buddy", {
        body: {
          notes: userMessage,
          context,
          mode: 'chat',
          sessionHistory: jeevesMessages.map(m => `${m.role}: ${m.content}`),
        },
      });

      if (error) throw error;

      const response = data.analysis?.overallResponse || data.analysis?.overallAssessment || data.response || "I'm here to help with your Bible study. What would you like to explore?";
      const assistantMsg: JeevesMessage = { role: 'assistant', content: response };
      setJeevesMessages(prev => [...prev, assistantMsg]);
      
      // Save both messages if we have a session
      if (currentSessionId) {
        await saveMessages([userMsg, assistantMsg], currentSessionId);
      }
    } catch (error: any) {
      console.error("Jeeves error:", error);
      setJeevesMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I apologize, I encountered an error. Please try again." 
      }]);
    } finally {
      setJeevesLoading(false);
    }
  };

  const saveSession = async () => {
    if (!notes.trim() && jeevesMessages.length === 0) {
      toast.error("No notes or conversation to save");
      return;
    }

    try {
      // Create or update session
      if (currentSessionId) {
        // Update existing session
        const { error } = await supabase.from("study_sessions").update({
          title: sessionTitle || `${selectedBook} ${selectedChapter} Study - ${new Date().toLocaleDateString()}`,
          description: notes.substring(0, 200),
          jeeves_context: JSON.parse(JSON.stringify({ book: selectedBook, chapter: selectedChapter, notes })),
          has_jeeves_history: jeevesMessages.length > 0,
        }).eq("id", currentSessionId);

        if (error) throw error;
        toast.success("Session updated!");
      } else {
        // Create new session
        const { data: newSession, error } = await supabase.from("study_sessions").insert([{
          user_id: user?.id!,
          title: sessionTitle || `${selectedBook} ${selectedChapter} Study - ${new Date().toLocaleDateString()}`,
          description: notes.substring(0, 200),
          jeeves_context: JSON.parse(JSON.stringify({ book: selectedBook, chapter: selectedChapter, notes })),
          tabs_data: JSON.parse(JSON.stringify([])),
          has_jeeves_history: jeevesMessages.length > 0,
        }]).select().single();

        if (error) throw error;
        
        // Save Jeeves messages to new session
        if (newSession && jeevesMessages.length > 0) {
          await saveMessages(jeevesMessages, newSession.id);
        }
        
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
    setJeevesMessages([]);
    if (currentSessionId) {
      await clearMessages(currentSessionId);
    }
    setCurrentSessionId(null);
    toast.success("Session cleared");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-950 via-amber-900 to-red-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-950 via-amber-900 to-red-950 relative overflow-hidden flex flex-col">
      {/* Animated Fire Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-orange-500/40 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/2 -right-32 w-80 h-80 bg-red-500/40 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-32 left-1/3 w-72 h-72 bg-amber-500/30 rounded-full blur-3xl"
        />
      </div>

      <Navigation />

      {/* Header */}
      <div className="relative z-10 bg-black/20 backdrop-blur-xl border-b border-orange-500/20 py-4 px-6 flex-shrink-0">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between flex-wrap gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Study Buddy</h1>
              <p className="text-orange-200 text-sm">Bible · Notes · Jeeves</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              onClick={() => navigate("/sermon-simmer")}
              className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white shadow-lg shadow-red-500/30"
            >
              <Flame className="w-4 h-4 mr-1" />
              New Sermon
            </Button>
            <Input
              placeholder="Session title..."
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
              className="w-40 h-9 text-sm bg-black/30 border-orange-500/30 text-white placeholder:text-orange-200/50"
            />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearSession}
              className="bg-black/20 border-orange-500/30 text-orange-200 hover:bg-orange-500/20"
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

      {/* Three Panel Layout */}
      <div className="flex-1 overflow-hidden relative z-10 p-4">
        <ResizablePanelGroup direction="horizontal" className="h-full rounded-xl overflow-hidden">
          {/* Bible Panel */}
          <ResizablePanel defaultSize={35} minSize={20}>
            <Card className="h-full flex flex-col bg-black/30 border-orange-500/20 backdrop-blur-xl rounded-none rounded-l-xl">
              {/* Bible Navigation */}
              <div className="p-4 border-b border-orange-500/20 flex-shrink-0">
                <div className="flex items-center gap-2 mb-3">
                  <Book className="w-5 h-5 text-orange-400" />
                  <span className="font-bold text-white">Bible</span>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={selectedBook} onValueChange={(v) => { setSelectedBook(v); setSelectedChapter(1); }}>
                    <SelectTrigger className="flex-1 h-9 text-sm bg-black/30 border-orange-500/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 bg-amber-950 border-orange-500/30">
                      {BIBLE_BOOK_METADATA.map(book => (
                        <SelectItem key={book.name} value={book.name} className="text-white hover:bg-orange-500/20">{book.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedChapter.toString()} onValueChange={(v) => setSelectedChapter(parseInt(v))}>
                    <SelectTrigger className="w-20 h-9 text-sm bg-black/30 border-orange-500/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 bg-amber-950 border-orange-500/30">
                      {Array.from({ length: getChapterCount() }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()} className="text-white hover:bg-orange-500/20">{i + 1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigateChapter('prev')}
                    className="text-orange-200 hover:bg-orange-500/20 hover:text-white"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Prev
                  </Button>
                  <span className="text-sm text-orange-200">{selectedBook} {selectedChapter}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigateChapter('next')}
                    className="text-orange-200 hover:bg-orange-500/20 hover:text-white"
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
                      <Loader2 className="w-6 h-6 animate-spin text-orange-400" />
                    </div>
                  ) : verses.length === 0 ? (
                    <p className="text-center text-orange-200/60 text-sm py-8">
                      No verses found
                    </p>
                  ) : (
                    verses.map((v) => (
                      <motion.div
                        key={v.verse}
                        whileHover={{ scale: 1.01 }}
                        onClick={() => addVerseToNotes(v.verse, v.text)}
                        className="p-3 rounded-lg bg-amber-500/5 hover:bg-amber-500/15 border border-transparent hover:border-amber-500/30 cursor-pointer transition-all group"
                      >
                        <span className="text-orange-400 font-bold text-sm mr-2">{v.verse}</span>
                        <span className="text-sm text-orange-100 leading-relaxed">{v.text}</span>
                        <span className="text-xs text-orange-200/50 opacity-0 group-hover:opacity-100 ml-2 transition-opacity">
                          (click to add)
                        </span>
                      </motion.div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </Card>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-orange-500/20 hover:bg-orange-500/40 transition-colors" />

          {/* Notes Panel - Emerald/Teal Theme */}
          <ResizablePanel defaultSize={35} minSize={20}>
            <Card className="h-full flex flex-col bg-emerald-950/40 border-emerald-500/20 backdrop-blur-xl rounded-none border-l-0 border-r-0">
              <div className="p-4 border-b border-emerald-500/20 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <StickyNote className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-white">Notes</span>
                </div>
                <p className="text-xs text-emerald-200/60 mt-1">Click verses to add them here</p>
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

          {/* Jeeves Panel - Purple/Violet Theme */}
          <ResizablePanel defaultSize={30} minSize={20}>
            <Card className="h-full flex flex-col bg-violet-950/40 border-violet-500/20 backdrop-blur-xl rounded-none rounded-r-xl border-l-0">
              <div className="p-4 border-b border-violet-500/20 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-violet-400" />
                  <span className="font-bold text-white">Jeeves</span>
                </div>
                <p className="text-xs text-violet-200/60 mt-1">Your Phototheology study assistant</p>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {/* Auto-analyzing indicator */}
                  {autoAnalyzing && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-lg bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30"
                    >
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Brain className="w-5 h-5 text-violet-400" />
                          <Sparkles className="w-3 h-3 text-amber-400 absolute -top-1 -right-1 animate-pulse" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-violet-200">Jeeves is reading your notes...</p>
                        </div>
                        <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                      </div>
                    </motion.div>
                  )}

                  {jeevesMessages.length === 0 && !autoAnalyzing ? (
                    <div className="text-center py-8">
                      <div className="relative inline-block mb-3">
                        <Brain className="w-12 h-12 text-violet-500/50" />
                        <Sparkles className="w-4 h-4 text-amber-400 absolute -top-1 -right-1" />
                      </div>
                      <p className="text-sm text-violet-200/80 font-medium">
                        Jeeves is watching your notes
                      </p>
                      <p className="text-xs text-violet-200/50 mt-2">
                        Insights appear automatically as you write
                      </p>
                      {notes.length > 0 && notes.length < MIN_NOTES_LENGTH && (
                        <p className="text-xs text-amber-400/80 mt-3">
                          {MIN_NOTES_LENGTH - notes.length} more characters for auto-analysis
                        </p>
                      )}
                    </div>
                  ) : jeevesMessages.length > 0 ? (
                    jeevesMessages.map((msg, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3 rounded-lg text-sm ${
                          msg.role === 'user'
                            ? 'bg-violet-500/20 border border-violet-500/30 ml-4 text-violet-100'
                            : 'bg-purple-500/10 border border-purple-500/20 mr-4 text-purple-100'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </motion.div>
                    ))
                  ) : null}
                  {jeevesLoading && (
                    <div className="flex items-center gap-2 text-violet-200/60 p-3">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Jeeves is thinking...</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t border-violet-500/20 flex-shrink-0">
                <div className="flex gap-2">
                  <Input
                    value={jeevesInput}
                    onChange={(e) => setJeevesInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendToJeeves()}
                    placeholder="Ask Jeeves..."
                    className="flex-1 bg-black/30 border-violet-500/30 text-white placeholder:text-violet-200/50"
                    disabled={jeevesLoading}
                  />
                  <Button
                    onClick={sendToJeeves}
                    disabled={jeevesLoading || !jeevesInput.trim()}
                    className="bg-violet-500 hover:bg-violet-600 text-white"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
