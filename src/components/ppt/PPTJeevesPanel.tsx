import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Loader2,
  Sparkles,
  BookOpen,
  Search,
  Lightbulb,
  Copy,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface JeevesMessage {
  id: string;
  role: 'user' | 'jeeves';
  content: string;
  timestamp: Date;
  type?: 'verse' | 'research' | 'insight' | 'general';
  scriptureRefs?: string[];
}

interface PPTJeevesPanelProps {
  studyTitle?: string;
  studyContent?: string;
  onInsertContent?: (content: string, type: 'scripture' | 'insight' | 'teaching') => void;
  className?: string;
}

const QUICK_PROMPTS = [
  { label: 'Find verses', icon: <BookOpen className="w-3 h-3" />, prompt: 'Find relevant Bible verses for: ' },
  { label: 'Research topic', icon: <Search className="w-3 h-3" />, prompt: 'Research and explain: ' },
  { label: 'Get insight', icon: <Lightbulb className="w-3 h-3" />, prompt: 'What insights can you share about: ' },
];

export function PPTJeevesPanel({
  studyTitle,
  studyContent,
  onInsertContent,
  className,
}: PPTJeevesPanelProps) {
  const [messages, setMessages] = useState<JeevesMessage[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: JeevesMessage = {
        id: 'welcome',
        role: 'jeeves',
        content: `I'm here to help you build your study content.

**I can help with:**
• Finding relevant Bible verses
• Researching topics and providing context
• Generating insights and applications
• Suggesting discussion questions

${studyTitle ? `I see you're working on: **"${studyTitle}"**. How can I assist?` : 'What would you like to explore?'}`,
        timestamp: new Date(),
        type: 'general',
      };
      setMessages([welcomeMessage]);
    }
  }, [studyTitle, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = useCallback(async (messageOverride?: string) => {
    const messageText = messageOverride || input.trim();
    if (!messageText || isProcessing) return;

    const userMessage: JeevesMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke("ppt-jeeves-assist", {
        body: {
          userMessage: messageText,
          studyTitle,
          studyContext: studyContent?.substring(0, 2000),
          conversationHistory: messages.slice(-8).map((m) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.content,
          })),
        },
      });

      if (error) throw error;

      const jeevesResponse: JeevesMessage = {
        id: (Date.now() + 1).toString(),
        role: 'jeeves',
        content: data.response || "Let me think on that...",
        timestamp: new Date(),
        type: data.type || 'general',
        scriptureRefs: data.scriptureRefs,
      };

      setMessages((prev) => [...prev, jeevesResponse]);

    } catch (error: any) {
      console.error("Jeeves error:", error);
      toast.error("Failed to get response from Jeeves");

      const errorMessage: JeevesMessage = {
        id: (Date.now() + 1).toString(),
        role: 'jeeves',
        content: "I'm having trouble connecting. Let's try again in a moment.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  }, [input, isProcessing, studyTitle, studyContent, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleInsert = (content: string, type: 'scripture' | 'insight' | 'teaching') => {
    onInsertContent?.(content, type);
    toast.success(`Added as ${type} block`);
  };

  return (
    <Card className={`bg-slate-900/70 border-slate-700 flex flex-col ${className}`}>
      <CardHeader className="pb-2 border-b border-slate-700">
        <CardTitle className="text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="block text-base">Jeeves Assistant</span>
            <span className="text-xs font-normal text-slate-400">
              Research, verses & insights
            </span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {/* Quick Prompts */}
        <div className="px-4 py-2 border-b border-slate-700 flex gap-2 flex-wrap">
          {QUICK_PROMPTS.map((qp, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              onClick={() => handleQuickPrompt(qp.prompt)}
              className="h-7 text-xs bg-slate-800/50 border-slate-600 hover:border-amber-500/50"
            >
              {qp.icon}
              <span className="ml-1">{qp.label}</span>
            </Button>
          ))}
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <Avatar className="w-8 h-8 shrink-0">
                    {message.role === "jeeves" ? (
                      <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white text-xs">
                        J
                      </AvatarFallback>
                    ) : (
                      <AvatarFallback className="bg-slate-700 text-slate-200 text-xs">
                        You
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-slate-700/80 text-white"
                        : "bg-black/40 border border-slate-700 text-slate-100"
                    }`}
                  >
                    {message.role === "jeeves" && message.type && message.type !== 'general' && (
                      <div className="flex items-center gap-1.5 mb-1.5">
                        {message.type === 'verse' && <BookOpen className="w-3.5 h-3.5 text-blue-400" />}
                        {message.type === 'research' && <Search className="w-3.5 h-3.5 text-emerald-400" />}
                        {message.type === 'insight' && <Lightbulb className="w-3.5 h-3.5 text-amber-400" />}
                        <span className="text-xs text-slate-400 capitalize">{message.type}</span>
                      </div>
                    )}
                    
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>

                    {/* Scripture refs */}
                    {message.scriptureRefs && message.scriptureRefs.length > 0 && (
                      <div className="mt-2 flex gap-1 flex-wrap">
                        {message.scriptureRefs.map((ref, idx) => (
                          <Badge key={idx} variant="outline" className="text-[10px] text-blue-400 border-blue-500/30">
                            {ref}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Action buttons for Jeeves messages */}
                    {message.role === 'jeeves' && message.id !== 'welcome' && (
                      <div className="mt-3 pt-2 border-t border-slate-700 flex gap-2 flex-wrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-[10px] text-slate-400 hover:text-white"
                          onClick={() => handleCopy(message.content, message.id)}
                        >
                          {copiedId === message.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span className="ml-1">Copy</span>
                        </Button>
                        {onInsertContent && (
                          <>
                            {message.type === 'verse' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-[10px] text-blue-400 hover:text-blue-300"
                                onClick={() => handleInsert(message.content, 'scripture')}
                              >
                                <BookOpen className="w-3 h-3 mr-1" />
                                Add as Scripture
                              </Button>
                            )}
                            {(message.type === 'insight' || message.type === 'research') && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-[10px] text-amber-400 hover:text-amber-300"
                                onClick={() => handleInsert(message.content, 'insight')}
                              >
                                <Lightbulb className="w-3 h-3 mr-1" />
                                Add as Insight
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    )}

                    <span className="text-xs text-slate-500 mt-2 block">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white text-xs">
                    J
                  </AvatarFallback>
                </Avatar>
                <div className="bg-black/40 border border-slate-700 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Researching...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about verses, topics, or get insights..."
              className="bg-black/30 border-slate-600 text-white placeholder:text-slate-500 min-h-[60px] max-h-[120px] resize-none text-sm"
              disabled={isProcessing}
            />
            <Button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isProcessing}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-90 self-end"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
