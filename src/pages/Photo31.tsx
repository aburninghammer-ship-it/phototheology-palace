import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send, Trash2, BookOpen, Flame, Dumbbell, GraduationCap, Crown, Clock, Play, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SEO } from "@/components/SEO";
import ReactMarkdown from "react-markdown";
import { BIBLE_BOOKS, type Photo31Book } from "@/data/photo31Books";

const LEVELS = [
  { id: "beginner", label: "Beginner", icon: BookOpen, color: "text-green-500", description: "Foundation — learn rooms & observe" },
  { id: "intermediate", label: "Intermediate", icon: Dumbbell, color: "text-yellow-500", description: "Connection — cross-reference & link" },
  { id: "advanced", label: "Advanced", icon: GraduationCap, color: "text-blue-500", description: "Structure — patterns & logic" },
  { id: "master", label: "Master", icon: Crown, color: "text-red-500", description: "Elite — synthesize & defend" },
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Photo31 = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState("genesis");
  const [day, setDay] = useState(1);
  const [level, setLevel] = useState("beginner");
  const [sessionMinutes, setSessionMinutes] = useState(30);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [bookSearch, setBookSearch] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const selectedBook = BIBLE_BOOKS.find(b => b.key === book)!;

  const filteredBooks = BIBLE_BOOKS.filter(b =>
    b.name.toLowerCase().includes(bookSearch.toLowerCase())
  );

  const sendMessage = useCallback(async (userMessage?: string, init = false) => {
    const newMessages = [...messages];
    if (userMessage) {
      newMessages.push({ role: "user", content: userMessage });
      setMessages(newMessages);
    }
    setIsStreaming(true);

    try {
      const { data, error } = await supabase.functions.invoke("photo31-session", {
        body: {
          messages: newMessages,
          book: selectedBook.name,
          day,
          chapters: selectedBook.chapters,
          bookSummary: selectedBook.summary,
          level,
          sessionMinutes,
          isInit: init,
        },
      });

      if (error) throw error;

      if (data?.response) {
        setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
      }
    } catch (error: any) {
      console.error("Photo31 error:", error);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "I apologize, but I'm having trouble connecting. Please try again." },
      ]);
    } finally {
      setIsStreaming(false);
    }
  }, [messages, selectedBook, day, level, sessionMinutes]);

  const handleStartSession = () => {
    setSessionStarted(true);
    setMessages([]);
    sendMessage(undefined, true);
  };

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    const msg = input;
    setInput("");
    sendMessage(msg);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const selectedLevel = LEVELS.find(l => l.id === level)!;
  const LevelIcon = selectedLevel.icon;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Photo31 | Phototheology"
        description="31-day deep book study powered by Jeeves — your personal Phototheology teacher, trainer, and theological companion."
      />

      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-lg font-bold flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  Photo31
                </h1>
                {sessionStarted && (
                  <p className="text-xs text-muted-foreground">
                    {selectedBook.name} • Day {day}/31 • <span className={selectedLevel.color}>{selectedLevel.label}</span>
                  </p>
                )}
              </div>
            </div>
            {sessionStarted && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {sessionMinutes}min
                </Badge>
                <Badge variant="outline" className={`text-xs ${selectedLevel.color}`}>
                  <LevelIcon className="h-3 w-3 mr-1" />
                  {selectedLevel.label}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Setup Screen */}
      {!sessionStarted ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-white mb-4">
                <Flame className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold">Photo31</h2>
              <p className="text-muted-foreground text-sm">
                31-day picture study through any book of the Bible. Big picture concepts zooming into fine details — with Jeeves as your teacher, trainer, and sparring partner.
              </p>
            </div>

            {/* Book Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Choose Your Book</label>
              <Select value={book} onValueChange={(v) => { setBook(v); setDay(1); }}>
                <SelectTrigger>
                  <SelectValue>{selectedBook.name}</SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <div className="px-2 pb-2 sticky top-0 bg-popover z-10">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Search books..."
                        value={bookSearch}
                        onChange={(e) => setBookSearch(e.target.value)}
                        className="pl-8 h-8 text-sm"
                      />
                    </div>
                  </div>
                  {filteredBooks.length > 0 && (
                    <>
                      {/* OT section */}
                      {filteredBooks.some(b => b.testament === "OT") && (
                        <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Old Testament</div>
                      )}
                      {filteredBooks.filter(b => b.testament === "OT").map(b => (
                        <SelectItem key={b.key} value={b.key}>
                          <div className="flex flex-col">
                            <span>{b.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                      {/* NT section */}
                      {filteredBooks.some(b => b.testament === "NT") && (
                        <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">New Testament</div>
                      )}
                      {filteredBooks.filter(b => b.testament === "NT").map(b => (
                        <SelectItem key={b.key} value={b.key}>
                          <div className="flex flex-col">
                            <span>{b.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground italic">{selectedBook.summary}</p>
            </div>

            {/* Day Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Day ({day} of 31)</label>
              <Select value={day.toString()} onValueChange={(v) => setDay(parseInt(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                    <SelectItem key={d} value={d.toString()}>
                      Day {d}{d >= 30 ? " — Synthesis & Review" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Level Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Training Level</label>
              <div className="grid grid-cols-2 gap-2">
                {LEVELS.map((l) => {
                  const Icon = l.icon;
                  return (
                    <button
                      key={l.id}
                      onClick={() => setLevel(l.id)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        level === l.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`h-4 w-4 ${l.color}`} />
                        <span className="text-sm font-medium">{l.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{l.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Session Time (minutes)</label>
              <div className="flex gap-2">
                {[15, 30, 45, 60].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSessionMinutes(t)}
                    className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                      sessionMinutes === t
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Start */}
            <Button onClick={handleStartSession} className="w-full h-12 text-lg" size="lg">
              <Play className="h-5 w-5 mr-2" />
              Begin Day {day}
            </Button>
          </div>
        </div>
      ) : (
        /* Chat Interface */
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          <ScrollArea className="flex-1 px-4" ref={scrollRef}>
            <div className="py-4 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[90%] rounded-xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {isStreaming && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:100ms]" />
                      <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:200ms]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Bar */}
          <div className="border-t border-border p-4 bg-background">
            <div className="flex gap-2 max-w-4xl mx-auto">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Share your observation, answer, or question..."
                disabled={isStreaming}
                className="flex-1"
                spellCheck
              />
              <Button onClick={handleSend} disabled={isStreaming || !input.trim()} size="icon">
                <Send className="h-4 w-4" />
              </Button>
              {messages.length > 0 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setMessages([]);
                    setSessionStarted(false);
                  }}
                  disabled={isStreaming}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Photo31;
