import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send, Trash2, BookOpen, Flame, Dumbbell, GraduationCap, Crown, Clock, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SEO } from "@/components/SEO";
import ReactMarkdown from "react-markdown";

// Book data with 31-day passage clusters
const BOOKS: Record<string, { name: string; passages: string[] }> = {
  daniel: {
    name: "Daniel",
    passages: [
      "Daniel 1:1-8", "Daniel 1:9-21", "Daniel 2:1-16", "Daniel 2:17-30", "Daniel 2:31-49",
      "Daniel 3:1-18", "Daniel 3:19-30", "Daniel 4:1-18", "Daniel 4:19-37", "Daniel 5:1-16",
      "Daniel 5:17-31", "Daniel 6:1-15", "Daniel 6:16-28", "Daniel 7:1-8", "Daniel 7:9-14",
      "Daniel 7:15-28", "Daniel 8:1-14", "Daniel 8:15-27", "Daniel 9:1-14", "Daniel 9:15-19",
      "Daniel 9:20-27", "Daniel 10:1-14", "Daniel 10:15-21", "Daniel 11:1-13", "Daniel 11:14-22",
      "Daniel 11:23-35", "Daniel 11:36-45", "Daniel 12:1-7", "Daniel 12:8-13", "Daniel Review & Synthesis Day 1",
      "Daniel Review & Synthesis Day 2"
    ],
  },
  genesis: {
    name: "Genesis",
    passages: [
      "Genesis 1:1-13", "Genesis 1:14-31", "Genesis 2:1-14", "Genesis 2:15-25", "Genesis 3:1-13",
      "Genesis 3:14-24", "Genesis 4:1-16", "Genesis 4:17-5:32", "Genesis 6:1-22", "Genesis 7:1-24",
      "Genesis 8:1-22", "Genesis 9:1-17", "Genesis 9:18-10:32", "Genesis 11:1-32", "Genesis 12:1-20",
      "Genesis 13-14", "Genesis 15:1-21", "Genesis 16-17", "Genesis 18:1-19:29", "Genesis 19:30-20:18",
      "Genesis 21:1-22:24", "Genesis 23-24", "Genesis 25:1-34", "Genesis 26-27", "Genesis 28-29",
      "Genesis 30-31", "Genesis 32-33", "Genesis 34-36", "Genesis 37-39", "Genesis 40-45",
      "Genesis 46-50"
    ],
  },
  revelation: {
    name: "Revelation",
    passages: [
      "Revelation 1:1-8", "Revelation 1:9-20", "Revelation 2:1-17", "Revelation 2:18-29", "Revelation 3:1-13",
      "Revelation 3:14-22", "Revelation 4:1-11", "Revelation 5:1-14", "Revelation 6:1-11", "Revelation 6:12-7:8",
      "Revelation 7:9-8:6", "Revelation 8:7-9:12", "Revelation 9:13-21", "Revelation 10:1-11:2", "Revelation 11:3-19",
      "Revelation 12:1-9", "Revelation 12:10-17", "Revelation 13:1-10", "Revelation 13:11-18", "Revelation 14:1-5",
      "Revelation 14:6-13", "Revelation 14:14-15:4", "Revelation 15:5-16:11", "Revelation 16:12-21", "Revelation 17:1-18",
      "Revelation 18:1-24", "Revelation 19:1-21", "Revelation 20:1-15", "Revelation 21:1-14", "Revelation 21:15-22:5",
      "Revelation 22:6-21"
    ],
  },
};

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
  const [book, setBook] = useState("daniel");
  const [day, setDay] = useState(1);
  const [level, setLevel] = useState("beginner");
  const [sessionMinutes, setSessionMinutes] = useState(30);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = useCallback(async (userMessage?: string, init = false) => {
    const newMessages = [...messages];
    if (userMessage) {
      newMessages.push({ role: "user", content: userMessage });
      setMessages(newMessages);
    }
    setIsStreaming(true);

    try {
      const selectedBook = BOOKS[book];
      const passages = selectedBook.passages[day - 1] || "";

      const { data, error } = await supabase.functions.invoke("photo31-session", {
        body: {
          messages: newMessages,
          book: selectedBook.name,
          day,
          passages,
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
  }, [messages, book, day, level, sessionMinutes]);

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
                    {BOOKS[book].name} • Day {day}/31 • <span className={selectedLevel.color}>{selectedLevel.label}</span>
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
                31-day deep book study with Jeeves as your personal teacher, trainer, and theological sparring partner.
              </p>
            </div>

            {/* Book Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Choose Your Book</label>
              <Select value={book} onValueChange={setBook}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(BOOKS).map(([key, b]) => (
                    <SelectItem key={key} value={key}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Day Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Day ({BOOKS[book].passages[day - 1]})</label>
              <Select value={day.toString()} onValueChange={(v) => setDay(parseInt(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BOOKS[book].passages.map((p, i) => (
                    <SelectItem key={i} value={(i + 1).toString()}>
                      Day {i + 1}: {p}
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
