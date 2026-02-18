import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Send,
  Loader2,
  Trash2,
  BookOpen,
  Globe,
  GraduationCap,
  Clock,
  ChevronDown,
  ChevronUp,
  Languages,
  MessageSquareQuote,
  ChurchIcon,
  Link2,
  Hash,
  Sparkles,
  Save,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { QuickAudioButton } from "@/components/audio/QuickAudioButton";
import { VoiceInput } from "@/components/analyze/VoiceInput";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface QuickAction {
  label: string;
  icon: React.ElementType;
  prefix: string;
  color: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { label: "Find verses about...", icon: BookOpen, prefix: "List all Bible verses about ", color: "text-blue-400 border-blue-500/40 hover:bg-blue-500/10" },
  { label: "Word count in book", icon: Hash, prefix: "How many times is the word \"\" used in the book of Genesis? List each occurrence with verse reference.", color: "text-violet-400 border-violet-500/40 hover:bg-violet-500/10" },
  { label: "Greek / Hebrew word", icon: Languages, prefix: "What is the original Greek or Hebrew word for \"\" and what does it mean? Include transliteration, Strong's number, and usage.", color: "text-amber-400 border-amber-500/40 hover:bg-amber-500/10" },
  { label: "Commentary says...", icon: MessageSquareQuote, prefix: "What do major Bible commentaries say about ", color: "text-rose-400 border-rose-500/40 hover:bg-rose-500/10" },
  { label: "Denominational views", icon: ChurchIcon, prefix: "What do Catholics, Protestants, and Adventists each believe about ", color: "text-orange-400 border-orange-500/40 hover:bg-orange-500/10" },
  { label: "Search for links on...", icon: Globe, prefix: "Search the internet for scholarly links discussing ", color: "text-cyan-400 border-cyan-500/40 hover:bg-cyan-500/10" },
  { label: "Deep scholarly dive", icon: GraduationCap, prefix: "Give me a full scholarly research brief on ", color: "text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/10" },
  { label: "Historical context", icon: Clock, prefix: "What is the historical and cultural context of ", color: "text-teal-400 border-teal-500/40 hover:bg-teal-500/10" },
  { label: "Show connections", icon: Link2, prefix: "Show me the thematic and textual connections between ", color: "text-indigo-400 border-indigo-500/40 hover:bg-indigo-500/10" },
];

const SYSTEM_INSTRUCTIONS = `You are a Bible research assistant. Answer EXACTLY what was asked — nothing more.

STRICT RULES — match your response length to the question:
- Simple lookup ("Where does Jeremiah say X?", "Where is the verse about X?", "What verse talks about Y?") → Give the reference and quote the FULL verse text. Short answer only. No intro, no sections, no essays.
- "List verses about X" → List the verses with full text. No intro, no history, no commentary sections.
- "How many times is X used?" → Give the count and list the occurrences. Nothing else.
- "Greek/Hebrew word for X?" → Give the word, transliteration, Strong's number, and meaning. Done.
- "What do commentaries say?" → Present views labeled by source. No padding.
- Deep analysis ONLY when user explicitly says: "deep dive", "explain fully", "full study", "give me analysis", "scholarly brief".

ABSOLUTELY FORBIDDEN unless user explicitly requests it: introductions, "Overview" sections, "Biblical Foundation" sections, "Historical Context" sections, "Theological Perspectives" sections, "Practical Applications" sections, multi-page numbered outlines (1. 2. 3. etc.), repeating the user's name, flattery ("great question!", "fantastic!", "this is fascinating"), or ANY filler padding of any kind.

VERSE FORMAT — always quote the full text inline:
**Jeremiah 31:31** — "Behold, the days come, saith the LORD, that I will make a new covenant with the house of Israel, and with the house of Judah."

END every answer with 2-3 short "Suggested follow-ups:" questions.`;

// Format response content: bold headers, verse highlights, etc.
function formatContent(text: string) {
  const parts: React.ReactNode[] = [];
  const lines = text.split("\n");

  lines.forEach((line, idx) => {
    const key = idx;

    // Section headers: **Header** at start of line
    if (/^\*\*[^*]+\*\*\s*[-—:]?\s*$/.test(line.trim()) || /^#+\s/.test(line.trim())) {
      const headerText = line.replace(/^\*\*|\*\*\s*[-—:]?\s*$/g, "").replace(/^#+\s/, "").trim();
      parts.push(
        <div key={key} className="font-semibold text-emerald-300 mt-3 mb-1 text-[13px] tracking-wide uppercase">
          {headerText}
        </div>
      );
      return;
    }

    // Verse quote lines: **Book Ch:V** — "text"
    const verseMatch = line.match(/^\*\*([^*]+)\*\*\s*[-—]\s*["""](.+)["""]?\s*$/);
    if (verseMatch) {
      parts.push(
        <div key={key} className="my-2 pl-3 border-l-2 border-emerald-500/40 bg-emerald-500/5 rounded-r py-1">
          <span className="font-semibold text-emerald-400 text-[12px]">{verseMatch[1]}</span>
          <span className="text-foreground/80 text-[13px]"> — </span>
          <span className="italic text-foreground/90 text-[13px]">"{verseMatch[2]}"</span>
        </div>
      );
      return;
    }

    // Bullet points
    if (line.trim().startsWith("- ") || line.trim().startsWith("• ")) {
      const content = line.trim().slice(2);
      parts.push(
        <div key={key} className="flex gap-2 my-0.5">
          <span className="text-emerald-400/60 mt-1 text-[10px]">◆</span>
          <span className="text-[13px] text-foreground/85">{renderInlineBold(content)}</span>
        </div>
      );
      return;
    }

    // Numbered list
    const numMatch = line.match(/^(\d+)\.\s+(.+)/);
    if (numMatch) {
      parts.push(
        <div key={key} className="flex gap-2 my-0.5">
          <span className="text-emerald-400/70 text-[12px] font-mono w-4 shrink-0">{numMatch[1]}.</span>
          <span className="text-[13px] text-foreground/85">{renderInlineBold(numMatch[2])}</span>
        </div>
      );
      return;
    }

    // Empty lines
    if (!line.trim()) {
      parts.push(<div key={key} className="h-1.5" />);
      return;
    }

    // Regular text with inline bold
    parts.push(
      <div key={key} className="text-[13px] text-foreground/85 leading-relaxed">
        {renderInlineBold(line)}
      </div>
    );
  });

  return parts;
}

function renderInlineBold(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <span key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

interface ResearchAssistantWidgetProps {
  defaultExpanded?: boolean;
}

export function ResearchAssistantWidget({ defaultExpanded = false }: ResearchAssistantWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [sessionName, setSessionName] = useState("Research Session");
  const [savedStudyId, setSavedStudyId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Auto-save after each assistant reply
  useEffect(() => {
    if (messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role === "assistant" && messages.length >= 2) {
      saveSession(messages, sessionName, savedStudyId);
    }
  }, [messages.length]);

  const buildStudyContent = (msgs: ChatMessage[], name: string) => {
    const lines: string[] = [`# ${name}`, `*Research session — ${new Date().toLocaleDateString()}*`, ""];
    for (const msg of msgs) {
      if (msg.role === "user") {
        lines.push(`**Question:** ${msg.content}`, "");
      } else {
        lines.push(msg.content, "");
      }
    }
    return lines.join("\n");
  };

  const sendQuery = async (query: string) => {
    if (!query.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setShowQuickActions(false);

    const newHistory = [
      ...conversationHistory,
      { role: "user", content: query },
    ];

    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "research",
          query: query,
          question: query,
          conversationHistory: newHistory,
          systemInstructions: SYSTEM_INSTRUCTIONS,
        },
      });

      if (error) throw error;

      const responseText =
        data?.response ||
        data?.answer ||
        (typeof data === "string" ? data : "I couldn't find an answer. Please try rephrasing.");

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setConversationHistory([
        ...newHistory,
        { role: "assistant", content: responseText },
      ]);
    } catch (err) {
      console.error("Research error:", err);
      toast.error("Research failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveSession = useCallback(async (msgs: ChatMessage[], name: string, existingId: string | null) => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const content = buildStudyContent(msgs, name);

      if (existingId) {
        await supabase
          .from("user_studies")
          .update({ content, title: name, updated_at: new Date().toISOString() })
          .eq("id", existingId);
      } else {
        const { data } = await supabase
          .from("user_studies")
          .insert({ user_id: user.id, title: name, content, study_type: "research" })
          .select("id")
          .single();
        if (data?.id) setSavedStudyId(data.id);
      }

      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setIsSaving(false);
    }
  }, []);

  const clearChat = () => {
    setMessages([]);
    setConversationHistory([]);
    setShowQuickActions(true);
    setSessionName("Research Session");
    setSavedStudyId(null);
    setJustSaved(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendQuery(input);
    }
  };

  return (
    <Card className="overflow-hidden border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-background to-teal-500/5 shadow-lg shadow-emerald-500/5">
      {/* Header */}
      <CardHeader
        className="pb-3 cursor-pointer select-none"
        onClick={() => !defaultExpanded && setIsExpanded((p) => !p)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
              <Search className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Research Assistant</CardTitle>
              <CardDescription className="text-xs">Bible study, word studies, commentary research</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <div className="flex items-center gap-1.5">
                {isSaving ? (
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Loader2 className="h-2.5 w-2.5 animate-spin" /> Saving...
                  </span>
                ) : justSaved ? (
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <Check className="h-2.5 w-2.5" /> Saved
                  </span>
                ) : (
                  <span className="text-[10px] text-muted-foreground/50">Auto-saved</span>
                )}
              </div>
            )}
            {!defaultExpanded && (
              isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>

      <AnimatePresence>
        {(isExpanded || defaultExpanded) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="pt-0 pb-4 px-4">
              {/* Session name + save status */}
              {messages.length >= 2 && (
                <div className="flex items-center gap-2 mb-3">
                  <Save className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                  <Input
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    placeholder="Name this research..."
                    className="h-8 text-xs bg-background/60 border-border/50 focus:border-emerald-500/50 rounded-lg flex-1"
                    onBlur={() => {
                      if (messages.length >= 2) saveSession(messages, sessionName, savedStudyId);
                    }}
                  />
                </div>
              )}

              {/* Quick Actions */}
              <AnimatePresence>
                {showQuickActions && messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4"
                  >
                    <p className="text-[11px] text-muted-foreground/60 mb-2 font-medium uppercase tracking-wide">Quick Research</p>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_ACTIONS.map((action) => {
                        const Icon = action.icon;
                        return (
                          <button
                            key={action.label}
                            onClick={() => setInput(action.prefix)}
                            className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-lg border transition-all ${action.color}`}
                          >
                            <Icon className="h-3 w-3" />
                            {action.label}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Messages */}
              {messages.length > 0 && (
                <ScrollArea className="h-[400px] mb-4 pr-2">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {msg.role === "user" ? (
                          <div className="max-w-[80%] bg-emerald-500/15 border border-emerald-500/20 rounded-2xl rounded-tr-sm px-3 py-2">
                            <p className="text-[13px] text-foreground/90">{msg.content}</p>
                            <p className="text-[10px] text-emerald-400/40 ml-auto mr-1 text-right mt-1">
                              {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        ) : (
                          <div className="max-w-[92%] bg-background/60 border border-border/40 rounded-2xl rounded-tl-sm px-4 py-3 space-y-1">
                            <div className="flex items-center gap-1.5 mb-2">
                              <Sparkles className="h-3 w-3 text-emerald-400" />
                              <span className="text-[10px] text-emerald-400/70 font-medium">Research Assistant</span>
                            </div>
                            <div className="text-[13px] leading-relaxed text-foreground/90">
                              {formatContent(msg.content)}
                            </div>
                            <div className="flex items-center justify-between mt-2 pt-1">
                              <p className="text-[10px] text-muted-foreground/40">
                                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </p>
                              <QuickAudioButton text={msg.content} size="sm" />
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-background/60 border border-border/40 rounded-2xl rounded-tl-sm px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />
                            <span className="text-[12px] text-muted-foreground">Searching Scripture...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={scrollRef} />
                  </div>
                </ScrollArea>
              )}

              {/* Input area */}
              <div className="relative">
                <Textarea
                  ref={textareaRef}
                  placeholder="Ask about verses, Greek words, commentaries, connections..."
                  className="min-h-[48px] max-h-[120px] bg-background/60 border-border/60 text-sm pr-24 resize-none rounded-xl focus:border-emerald-500/50 focus:ring-emerald-500/20"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                />
                <div className="absolute right-2 bottom-2 flex items-center gap-1">
                  <VoiceInput onTranscript={(t) => setInput((prev) => prev + t)} />
                  <Button
                    size="icon"
                    className="h-8 w-8 bg-emerald-500 hover:bg-emerald-600 rounded-lg"
                    onClick={() => sendQuery(input)}
                    disabled={isLoading || !input.trim()}
                  >
                    {isLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Send className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Clear button */}
              {messages.length > 0 && (
                <div className="flex justify-end mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearChat}
                    className="text-[11px] text-muted-foreground/60 hover:text-muted-foreground h-6"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Clear chat
                  </Button>
                </div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
