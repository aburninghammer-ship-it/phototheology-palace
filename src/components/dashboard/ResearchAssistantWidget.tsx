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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { QuickAudioButton } from "@/components/audio/QuickAudioButton";
import { VoiceInput } from "@/components/analyze/VoiceInput";

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

const SYSTEM_INSTRUCTIONS = `You are the Research Assistant for Phototheology Palace — a powerful Bible research tool. Follow these rules:

1. CLARIFYING QUESTIONS: If a user's query is vague or ambiguous, ask 1-2 clarifying questions before researching. Example: if they say "Tell me about the law", ask whether they mean the Mosaic law, natural law, the law of sin and death, etc.

2. FOLLOW-UP SUGGESTIONS: After every substantive answer, end with a "Suggested follow-ups:" section containing 2-3 numbered follow-up questions the user might want to explore next.

3. AUTO-PASTE VERSES: Whenever you reference a Bible verse, ALWAYS quote the full verse text inline. Format each quoted verse on its own line like:
   **Genesis 1:1** — "In the beginning God created the heaven and the earth."
   Never just cite a reference without the full text.

4. WORD STUDIES: When asked about Greek or Hebrew words, include the transliteration, Strong's number if available, root meaning, and how it is translated across different passages.

5. COMMENTARY & DENOMINATIONAL VIEWS: When asked what commentaries or denominations believe, present multiple viewpoints fairly, labeling each source/tradition clearly.

6. CONNECTIONS & CROSS-REFERENCES: When asked to show connections between passages, themes, or doctrines, provide a structured analysis showing how they relate — shared vocabulary, typological links, chiastic structures, intertextual allusions, or thematic parallels. Give your own analytical feedback on the strength and significance of each connection.

7. Be thorough, scholarly, and always cite chapter-and-verse references. Present information in clear sections with headers when the answer is long.`;

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
        <div
          key={key}
          className="my-1.5 rounded-md bg-emerald-900/30 border-l-2 border-emerald-400/60 px-3 py-2"
        >
          <span className="font-semibold text-emerald-300 text-xs">{verseMatch[1]}</span>
          <p className="text-foreground/90 italic text-[13px] mt-0.5">"{verseMatch[2].replace(/[""]$/, "")}"</p>
        </div>
      );
      return;
    }

    // Inline bold
    const boldParts = line.split(/(\*\*[^*]+\*\*)/g);
    const rendered = boldParts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <span key={i} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </span>
        );
      }
      return part;
    });

    parts.push(
      <div key={key} className={line.trim() === "" ? "h-2" : ""}>
        {rendered}
      </div>
    );
  });

  return <>{parts}</>;
}

export function ResearchAssistantWidget() {
  const isMobile = useIsMobile();
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<
    Array<{ role: string; content: string }>
  >([]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Auto-expand when user has messages
  useEffect(() => {
    if (messages.length > 0 && !expanded) {
      setExpanded(true);
    }
  }, [messages.length]);

  const addMessage = (
    role: "user" | "assistant",
    content: string,
    suggestions?: string[]
  ): ChatMessage => {
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: new Date(),
      suggestions,
    };
    setMessages((prev) => [...prev, msg]);
    return msg;
  };

  const parseSuggestions = (text: string): { cleanText: string; suggestions: string[] } => {
    const patterns = [
      /\n\n(?:Suggested follow-ups?|Follow-up questions?|You might also explore|Next steps?|Related questions?):\s*\n([\s\S]+)$/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const suggestionsBlock = match[0];
        const cleanText = text.slice(0, text.length - suggestionsBlock.length).trim();
        const suggestions = suggestionsBlock
          .split("\n")
          .map((line) => line.replace(/^\d+\.\s*/, "").trim())
          .filter(
            (line) =>
              line.length > 10 &&
              !line.match(/^(Suggested|Follow-up|You might|Next|Related)/i)
          );
        if (suggestions.length >= 2) {
          return { cleanText, suggestions };
        }
      }
    }
    return { cleanText: text, suggestions: [] };
  };

  const sendQuery = async (query: string) => {
    if (!query.trim() || isLoading) return;

    const userMsg = query.trim();
    addMessage("user", userMsg);
    setInput("");
    setIsLoading(true);

    const updatedHistory = [
      ...conversationHistory,
      { role: "user", content: userMsg },
    ];

    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "research",
          question: userMsg,
          conversationHistory: updatedHistory,
          systemInstructions: SYSTEM_INSTRUCTIONS,
        },
      });

      if (error) throw error;

      const rawResponse =
        data?.response || data?.content || data?.answer || "No response received.";

      const { cleanText, suggestions } = parseSuggestions(rawResponse);

      addMessage("assistant", cleanText, suggestions);
      setConversationHistory([
        ...updatedHistory,
        { role: "assistant", content: rawResponse },
      ]);
    } catch (err) {
      console.error("Research query error:", err);
      addMessage(
        "assistant",
        "I encountered an error processing your research request. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendQuery(input);
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    setExpanded(true);
    // If the prefix contains empty quotes "" for user to fill in, place cursor there
    const quoteIdx = action.prefix.indexOf('""');
    if (quoteIdx !== -1) {
      setInput(action.prefix);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          // Place cursor between the quotes
          textareaRef.current.setSelectionRange(quoteIdx + 1, quoteIdx + 1);
        }
      }, 100);
    } else {
      setInput(action.prefix);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendQuery(suggestion);
  };

  const clearChat = () => {
    setMessages([]);
    setConversationHistory([]);
    setInput("");
  };

  const handleVoiceTranscript = useCallback((text: string) => {
    setExpanded(true);
    setInput((prev) => {
      const separator = prev.trim() ? " " : "";
      return prev + separator + text;
    });
  }, []);

  const timeLabel = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  return (
    <Card className="overflow-hidden border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-background to-teal-500/5 shadow-lg shadow-emerald-500/5">
      {/* Header */}
      <CardHeader
        className="cursor-pointer select-none pb-3"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 shadow-lg shadow-emerald-600/30">
                <Search className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-background animate-pulse" />
            </div>
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                Research Assistant
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              </CardTitle>
              <CardDescription className="text-xs">
                Verses, Greek/Hebrew, commentaries, cross-references, and deep dives
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <Badge
                variant="secondary"
                className="text-[10px] bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
              >
                {messages.length} msg
              </Badge>
            )}
            <div className="p-1 rounded-md hover:bg-muted/50 transition-colors">
              {expanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <CardContent className="pt-0 space-y-4">
              {/* Quick Action Chips — scrollable row on mobile, wrap on desktop */}
              <div className={isMobile ? "overflow-x-auto -mx-4 px-4 pb-1" : ""}>
                <div className={`flex gap-2 ${isMobile ? "min-w-max" : "flex-wrap"}`}>
                  {QUICK_ACTIONS.map((action) => (
                    <Badge
                      key={action.label}
                      variant="outline"
                      className={`cursor-pointer py-1.5 px-3 text-[11px] transition-all whitespace-nowrap ${action.color}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickAction(action);
                      }}
                    >
                      <action.icon className="h-3 w-3 mr-1.5 shrink-0" />
                      {action.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Chat Thread */}
              <div
                className={`${
                  isMobile ? "h-[320px]" : "h-[440px]"
                } rounded-xl border border-border/40 bg-gradient-to-b from-black/5 to-black/10 dark:from-black/10 dark:to-black/20 overflow-y-auto`}
              >
                <div ref={scrollRef} className="p-3 space-y-3">
                  {/* Empty State */}
                  {messages.length === 0 && !isLoading && (
                    <div className="flex flex-col items-center justify-center min-h-[240px] text-center px-6">
                      <div className="relative mb-4">
                        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                          <Search className="h-8 w-8 text-emerald-500/50" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/25">
                          <Languages className="h-3.5 w-3.5 text-amber-400/60" />
                        </div>
                      </div>
                      <p className="text-sm font-medium text-foreground/70 mb-1">
                        What would you like to research?
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
                        Ask about word counts, Greek/Hebrew meanings, commentary views,
                        denominational beliefs, cross-references, or any Bible topic.
                        I'll quote verses in full and suggest follow-ups.
                      </p>
                    </div>
                  )}

                  <AnimatePresence>
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[88%] rounded-xl text-sm ${
                            msg.role === "user"
                              ? "bg-blue-600/20 border border-blue-500/30 p-3"
                              : "bg-emerald-950/25 border border-emerald-600/25 p-4"
                          }`}
                        >
                          {/* Message header */}
                          <div className="flex items-center gap-1.5 mb-1.5">
                            {msg.role === "user" ? (
                              <>
                                <span className="text-[11px] font-semibold text-blue-400">
                                  You
                                </span>
                                <span className="text-[10px] text-blue-400/40 ml-auto">
                                  {timeLabel(msg.timestamp)}
                                </span>
                              </>
                            ) : (
                              <>
                                <div className="p-0.5 rounded bg-emerald-500/20">
                                  <Search className="h-2.5 w-2.5 text-emerald-400" />
                                </div>
                                <span className="text-[11px] font-semibold text-emerald-400">
                                  Jeeves Research
                                </span>
                                <span className="text-[10px] text-emerald-400/40 ml-auto mr-1">
                                  {timeLabel(msg.timestamp)}
                                </span>
                                <QuickAudioButton
                                  text={msg.content}
                                  variant="ghost"
                                  size="icon"
                                  className="h-5 w-5 text-emerald-400/50 hover:text-emerald-400"
                                />
                              </>
                            )}
                          </div>

                          {/* Message body */}
                          <div className="text-[13px] leading-relaxed text-foreground/90">
                            {msg.role === "assistant"
                              ? formatContent(msg.content)
                              : msg.content}
                          </div>

                          {/* Suggested Follow-ups */}
                          {msg.suggestions && msg.suggestions.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-emerald-500/20 space-y-1">
                              <p className="text-[10px] font-semibold text-emerald-400/70 uppercase tracking-wider mb-1.5">
                                Continue researching
                              </p>
                              {msg.suggestions.map((s, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, x: -5 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                >
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-xs h-auto py-2 px-2.5 text-left text-emerald-300/70 hover:text-emerald-200 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                    onClick={() => handleSuggestionClick(s)}
                                  >
                                    <ChevronDown className="h-3 w-3 mr-1.5 rotate-[-90deg] shrink-0 text-emerald-500/50" />
                                    <span className="line-clamp-2">{s}</span>
                                  </Button>
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Loading indicator */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-center gap-2.5 rounded-xl bg-emerald-950/20 border border-emerald-600/20 p-3 text-sm">
                        <div className="flex gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                        <span className="text-xs text-emerald-400/70">Researching...</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Input Area */}
              <div className="space-y-2">
                <div className="relative">
                  <Textarea
                    ref={textareaRef}
                    placeholder="Ask about verses, Greek words, commentaries, connections..."
                    className="min-h-[48px] max-h-[120px] bg-background/60 border-border/60 text-sm pr-24 resize-none rounded-xl focus:border-emerald-500/50 focus:ring-emerald-500/20"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <div className="absolute right-2 bottom-2 flex items-center gap-1">
                    <VoiceInput onTranscript={handleVoiceTranscript} variant="icon" />
                    <Button
                      size="icon"
                      disabled={!input.trim() || isLoading}
                      onClick={() => sendQuery(input)}
                      className="h-8 w-8 bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-md shadow-emerald-600/20"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                {messages.length > 0 && (
                  <div className="flex justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearChat}
                      className="text-[11px] text-muted-foreground/60 hover:text-muted-foreground h-6"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Clear conversation
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
