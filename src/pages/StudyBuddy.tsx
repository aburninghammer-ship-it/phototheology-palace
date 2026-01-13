import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  Brain, BookOpen, Loader2, Send, Save, Trash2,
  ChevronLeft, ChevronRight, MessageSquare, StickyNote,
  Book
} from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { BIBLE_BOOK_METADATA } from "@/data/bibleBooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface JeevesMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function StudyBuddy() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Bible panel state
  const [selectedBook, setSelectedBook] = useState("Genesis");
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [verses, setVerses] = useState<{ verse: number; text: string }[]>([]);
  const [loadingVerses, setLoadingVerses] = useState(false);

  // Notes panel state
  const [notes, setNotes] = useState("");
  const [sessionTitle, setSessionTitle] = useState("");

  // Jeeves panel state
  const [jeevesMessages, setJeevesMessages] = useState<JeevesMessage[]>([]);
  const [jeevesInput, setJeevesInput] = useState("");
  const [jeevesLoading, setJeevesLoading] = useState(false);

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

  // Load verses when book/chapter changes
  useEffect(() => {
    loadVerses();
  }, [selectedBook, selectedChapter]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [jeevesMessages]);

  const loadVerses = async () => {
    setLoadingVerses(true);
    try {
      const { data, error } = await supabase
        .from("bible_verses_tokenized")
        .select("verse_num, text_kjv")
        .eq("book", selectedBook)
        .eq("chapter", selectedChapter)
        .order("verse_num", { ascending: true });

      if (error) throw error;
      setVerses((data || []).map(v => ({ verse: v.verse_num, text: v.text_kjv })));
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
    setJeevesMessages(prev => [...prev, { role: 'user', content: userMessage }]);
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

      const response = data.analysis?.overallAssessment || data.response || "I'm here to help with your Bible study. What would you like to explore?";
      setJeevesMessages(prev => [...prev, { role: 'assistant', content: response }]);
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
    if (!notes.trim()) {
      toast.error("No notes to save");
      return;
    }

    try {
      const { error } = await supabase.from("study_sessions").insert([{
        user_id: user?.id!,
        title: sessionTitle || `${selectedBook} ${selectedChapter} Study - ${new Date().toLocaleDateString()}`,
        description: notes.substring(0, 200),
        jeeves_context: JSON.parse(JSON.stringify({ messages: jeevesMessages, book: selectedBook, chapter: selectedChapter, notes })),
        tabs_data: JSON.parse(JSON.stringify([])),
      }]);

      if (error) throw error;
      toast.success("Session saved!");
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error.message || "Failed to save session");
    }
  };

  const clearSession = () => {
    setNotes("");
    setSessionTitle("");
    setJeevesMessages([]);
    toast.success("Session cleared");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      {/* Header */}
      <div className="bg-card/50 backdrop-blur-sm border-b py-4 px-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Study Buddy</h1>
              <p className="text-xs text-muted-foreground">Bible · Notes · Jeeves</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Session title..."
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
              className="w-40 h-8 text-sm"
            />
            <Button variant="outline" size="sm" onClick={clearSession}>
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button size="sm" onClick={saveSession} className="bg-amber-600 hover:bg-amber-700">
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Three Panel Layout */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Bible Panel */}
          <ResizablePanel defaultSize={35} minSize={20}>
            <div className="h-full flex flex-col border-r">
              {/* Bible Navigation */}
              <div className="p-3 border-b bg-card/50 flex-shrink-0">
                <div className="flex items-center gap-2 mb-2">
                  <Book className="w-4 h-4 text-amber-500" />
                  <span className="font-semibold text-sm">Bible</span>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={selectedBook} onValueChange={(v) => { setSelectedBook(v); setSelectedChapter(1); }}>
                    <SelectTrigger className="flex-1 h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {BIBLE_BOOK_METADATA.map(book => (
                        <SelectItem key={book.name} value={book.name}>{book.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedChapter.toString()} onValueChange={(v) => setSelectedChapter(parseInt(v))}>
                    <SelectTrigger className="w-20 h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {Array.from({ length: getChapterCount() }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>{i + 1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <Button variant="ghost" size="sm" onClick={() => navigateChapter('prev')}>
                    <ChevronLeft className="w-4 h-4" />
                    Prev
                  </Button>
                  <span className="text-xs text-muted-foreground">{selectedBook} {selectedChapter}</span>
                  <Button variant="ghost" size="sm" onClick={() => navigateChapter('next')}>
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
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : verses.length === 0 ? (
                    <p className="text-center text-muted-foreground text-sm py-8">
                      No verses found
                    </p>
                  ) : (
                    verses.map((v) => (
                      <div
                        key={v.verse}
                        onClick={() => addVerseToNotes(v.verse, v.text)}
                        className="p-2 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors group"
                      >
                        <span className="text-amber-500 font-semibold text-sm mr-2">{v.verse}</span>
                        <span className="text-sm leading-relaxed">{v.text}</span>
                        <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 ml-2">
                          (click to add)
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Notes Panel */}
          <ResizablePanel defaultSize={35} minSize={20}>
            <div className="h-full flex flex-col border-r">
              <div className="p-3 border-b bg-card/50 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <StickyNote className="w-4 h-4 text-amber-500" />
                  <span className="font-semibold text-sm">Notes</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Click verses to add them here</p>
              </div>
              <div className="flex-1 p-3">
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Start your study notes here...

Click on verses in the Bible panel to add them.

Use markers to structure your thinking:
• OBSERVATION: What you notice
• CLAIM: A statement you're making
• QUESTION: Something to explore
• GEM: A discovered connection"
                  className="h-full resize-none border-0 focus-visible:ring-0 text-sm"
                />
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Jeeves Panel */}
          <ResizablePanel defaultSize={30} minSize={20}>
            <div className="h-full flex flex-col">
              <div className="p-3 border-b bg-card/50 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-500" />
                  <span className="font-semibold text-sm">Jeeves</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Your Phototheology study assistant</p>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-3">
                <div className="space-y-3">
                  {jeevesMessages.length === 0 ? (
                    <div className="text-center py-8">
                      <Brain className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">
                        Ask Jeeves about your study passage or notes
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        He sees your current passage and notes
                      </p>
                    </div>
                  ) : (
                    jeevesMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg text-sm ${
                          msg.role === 'user'
                            ? 'bg-amber-500/10 border border-amber-500/20 ml-4'
                            : 'bg-muted mr-4'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    ))
                  )}
                  {jeevesLoading && (
                    <div className="flex items-center gap-2 text-muted-foreground p-3">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Jeeves is thinking...</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-3 border-t flex-shrink-0">
                <div className="flex gap-2">
                  <Input
                    value={jeevesInput}
                    onChange={(e) => setJeevesInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendToJeeves()}
                    placeholder="Ask Jeeves..."
                    className="flex-1"
                    disabled={jeevesLoading}
                  />
                  <Button
                    onClick={sendToJeeves}
                    disabled={jeevesLoading || !jeevesInput.trim()}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
