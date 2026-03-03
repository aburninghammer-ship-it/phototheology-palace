import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Send,
  Loader2,
  Sparkles,
  Lightbulb,
  AlertTriangle,
  FileText,
  Search,
  Shield,
  Building2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CopyButton } from "@/components/ui/copy-button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { JeevesModeSelector } from "./JeevesModeSelector";
import type { JeevesMode, JeevesMessage, SermonWriterSpark, SermonOutline } from "@/types/sermonWriter";

interface JeevesChatProps {
  sessionId: string;
  theme: string;
  themePassage?: string;
  currentMode: JeevesMode;
  onModeChange: (mode: JeevesMode) => void;
  existingSparks?: SermonWriterSpark[];
  outline?: SermonOutline;
  onSparksDiscovered?: (sparks: Partial<SermonWriterSpark>[]) => void;
  onOutlineUpdate?: (outline: SermonOutline) => void;
  onLogicalGapsFound?: (gaps: any[]) => void;
  className?: string;
}

const getModeWelcomeMessage = (mode: JeevesMode, theme: string, themePassage?: string): string => {
  const themeContext = themePassage ? `**"${theme}"** with ${themePassage}` : `**"${theme}"**`;

  switch (mode) {
    case 'explorer':
      return `Ready to explore ${themeContext}.

What angles are you considering? Share a thought, question, or connection you've noticed, and I'll help you find the **sparks** hidden within it.

*Tip: I can also suggest angles if you're not sure where to start.*`;

    case 'auditor':
      return `Let me examine ${themeContext} with a critical eye.

Share a claim, argument, or point you're planning to make, and I'll:
• Test its logical foundations
• Surface potential counterpoints
• Identify questions your congregation might ask

*The goal isn't to tear down—it's to build something that stands firm.*`;

    case 'architect':
      return `Let's structure ${themeContext}.

I can help you:
• Build an outline based on your sparks
• Map existing ideas to sermon structure
• Create smooth transitions between sections

*Share your sparks or ideas, and I'll propose a framework.*`;
  }
};

const getModeIcon = (mode: JeevesMode) => {
  switch (mode) {
    case 'explorer':
      return <Search className="w-4 h-4" />;
    case 'auditor':
      return <Shield className="w-4 h-4" />;
    case 'architect':
      return <Building2 className="w-4 h-4" />;
  }
};

const getModeColor = (mode: JeevesMode) => {
  switch (mode) {
    case 'explorer':
      return 'from-emerald-500 to-teal-600';
    case 'auditor':
      return 'from-amber-500 to-orange-600';
    case 'architect':
      return 'from-violet-500 to-purple-600';
  }
};

const getMessageTypeIcon = (type?: JeevesMessage['type']) => {
  switch (type) {
    case 'question':
      return <MessageCircle className="w-3.5 h-3.5 text-blue-400" />;
    case 'insight':
      return <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />;
    case 'suggestion':
      return <Sparkles className="w-3.5 h-3.5 text-emerald-400" />;
    case 'warning':
      return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
    case 'action':
      return <FileText className="w-3.5 h-3.5 text-violet-400" />;
    default:
      return null;
  }
};

export function JeevesChat({
  sessionId,
  theme,
  themePassage,
  currentMode,
  onModeChange,
  existingSparks = [],
  outline,
  onSparksDiscovered,
  onOutlineUpdate,
  onLogicalGapsFound,
  className,
}: JeevesChatProps) {
  const [messages, setMessages] = useState<JeevesMessage[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevModeRef = useRef<JeevesMode>(currentMode);
  const prevSessionRef = useRef<string>(sessionId);

  // Clear messages when session changes
  useEffect(() => {
    if (prevSessionRef.current !== sessionId) {
      setMessages([]);
      setInput("");
      prevSessionRef.current = sessionId;
    }
  }, [sessionId]);

  // Initialize or update welcome message when mode changes
  useEffect(() => {
    if (prevModeRef.current !== currentMode || messages.length === 0) {
      const welcomeMessage: JeevesMessage = {
        id: `welcome-${currentMode}-${Date.now()}`,
        role: 'jeeves',
        content: getModeWelcomeMessage(currentMode, theme, themePassage),
        timestamp: new Date(),
        mode: currentMode,
        type: 'question',
      };

      if (prevModeRef.current !== currentMode && messages.length > 0) {
        // Mode changed - add mode switch indicator
        setMessages((prev) => [
          ...prev,
          {
            id: `mode-switch-${Date.now()}`,
            role: 'jeeves',
            content: `*Switching to **${currentMode.charAt(0).toUpperCase() + currentMode.slice(1)}** mode...*`,
            timestamp: new Date(),
            mode: currentMode,
          },
          welcomeMessage,
        ]);
      } else if (messages.length === 0) {
        // Initial load
        setMessages([welcomeMessage]);
      }

      prevModeRef.current = currentMode;
    }
  }, [currentMode, theme, themePassage, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage: JeevesMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
      mode: currentMode,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke("sermon-writer-jeeves", {
        body: {
          mode: currentMode,
          sessionId,
          theme,
          themePassage,
          userMessage: userMessage.content,
          conversationHistory: messages.slice(-10).map((m) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.content,
          })),
          existingSparks: existingSparks.map(s => ({
            id: s.id,
            title: s.title,
            summary: s.summary,
            kind: s.kind,
            confidence: s.confidence,
          })),
          outline,
        },
      });

      if (error) throw error;

      const jeevesResponse: JeevesMessage = {
        id: (Date.now() + 1).toString(),
        role: 'jeeves',
        content: data.response || "Let me think on that...",
        timestamp: new Date(),
        mode: currentMode,
        type: data.type || 'insight',
        metadata: {
          sparksGenerated: data.sparks?.length,
          gapsIdentified: data.logicalGaps?.length,
          outlineChanges: data.outlineUpdated ? 1 : 0,
        },
      };

      setMessages((prev) => [...prev, jeevesResponse]);

      // Handle discovered sparks (Explorer mode)
      if (data.sparks?.length > 0 && onSparksDiscovered) {
        onSparksDiscovered(data.sparks);
        toast.success(`${data.sparks.length} spark${data.sparks.length > 1 ? 's' : ''} discovered!`, {
          icon: <Sparkles className="w-4 h-4 text-amber-400" />,
        });
      }

      // Handle logical gaps (Auditor mode)
      if (data.logicalGaps?.length > 0 && onLogicalGapsFound) {
        onLogicalGapsFound(data.logicalGaps);
        toast.info(`${data.logicalGaps.length} area${data.logicalGaps.length > 1 ? 's' : ''} to strengthen`, {
          icon: <Shield className="w-4 h-4 text-amber-400" />,
        });
      }

      // Handle outline update (Architect mode)
      if (data.suggestedOutline && onOutlineUpdate) {
        onOutlineUpdate(data.suggestedOutline);
        toast.success("Outline structure updated", {
          icon: <Building2 className="w-4 h-4 text-violet-400" />,
        });
      }

    } catch (error: any) {
      console.error("Jeeves chat error:", error);
      toast.error("Failed to get response from Jeeves");

      const errorMessage: JeevesMessage = {
        id: (Date.now() + 1).toString(),
        role: 'jeeves',
        content: "I'm having trouble connecting. Let's try again in a moment.",
        timestamp: new Date(),
        mode: currentMode,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  }, [input, isProcessing, currentMode, sessionId, theme, themePassage, messages, existingSparks, outline, onSparksDiscovered, onOutlineUpdate, onLogicalGapsFound]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const modeColor = getModeColor(currentMode);

  return (
    <Card className={`bg-black/30 border-slate-700 backdrop-blur-xl flex flex-col ${className}`}>
      <CardHeader className="pb-2 border-b border-slate-700">
        <CardTitle className="text-white flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${modeColor} flex items-center justify-center`}>
            {getModeIcon(currentMode)}
          </div>
          <div className="flex-1 min-w-0">
            <span className="block">Jeeves</span>
            <span className="text-xs font-normal text-slate-400">
              {currentMode.charAt(0).toUpperCase() + currentMode.slice(1)} Mode
            </span>
          </div>
        </CardTitle>
        <JeevesModeSelector
          currentMode={currentMode}
          onModeChange={onModeChange}
          disabled={isProcessing}
        />
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
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
                      <>
                        <AvatarImage src="/jeeves-avatar.png" />
                        <AvatarFallback className={`bg-gradient-to-br ${getModeColor(message.mode)} text-white text-xs`}>
                          J
                        </AvatarFallback>
                      </>
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
                    {message.role === "jeeves" && message.type && (
                      <div className="flex items-center gap-1.5 mb-1.5">
                        {getMessageTypeIcon(message.type)}
                        <span className="text-xs text-slate-400 capitalize">
                          {message.type}
                        </span>
                        {message.metadata && (
                          <div className="flex gap-1 ml-2">
                            {message.metadata.sparksGenerated && message.metadata.sparksGenerated > 0 && (
                              <Badge variant="outline" className="text-xs py-0 h-5 text-amber-400 border-amber-500/30">
                                {message.metadata.sparksGenerated} sparks
                              </Badge>
                            )}
                            {message.metadata.gapsIdentified && message.metadata.gapsIdentified > 0 && (
                              <Badge variant="outline" className="text-xs py-0 h-5 text-amber-400 border-amber-500/30">
                                {message.metadata.gapsIdentified} gaps
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-500">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {message.role === "jeeves" && (
                        <CopyButton text={message.content} size="sm" className="h-6 text-[10px] text-slate-400 hover:text-white" />
                      )}
                    </div>
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
                  <AvatarFallback className={`bg-gradient-to-br ${modeColor} text-white text-xs`}>
                    J
                  </AvatarFallback>
                </Avatar>
                <div className="bg-black/40 border border-slate-700 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">
                      {currentMode === 'explorer' && "Exploring connections..."}
                      {currentMode === 'auditor' && "Analyzing arguments..."}
                      {currentMode === 'architect' && "Building structure..."}
                    </span>
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
              placeholder={
                currentMode === 'explorer'
                  ? "Share a thought, question, or passage to explore..."
                  : currentMode === 'auditor'
                  ? "Share a claim or argument to examine..."
                  : "Describe what you'd like to structure..."
              }
              className="bg-black/30 border-slate-600 text-white placeholder:text-slate-500 min-h-[60px] max-h-[120px] resize-none text-sm"
              disabled={isProcessing}
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isProcessing}
              className={`bg-gradient-to-r ${modeColor} hover:opacity-90 self-end`}
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
