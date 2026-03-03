import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Flame, Send, Loader2, Sparkles, Lightbulb, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CopyButton } from "@/components/ui/copy-button";

interface Message {
  id: string;
  role: "user" | "jeeves";
  content: string;
  timestamp: Date;
  type?: "idea" | "question" | "insight" | "refinement";
}

interface SimmerJeevesChatProps {
  sessionId: string;
  theme: string;
  themePassage?: string;
  existingGems?: any[];
  onGemDiscovered?: (gem: any) => void;
  onRefineTheme?: (refinedTheme: string) => void;
}

export function SimmerJeevesChat({
  sessionId,
  theme,
  themePassage,
  existingGems = [],
  onGemDiscovered,
  onRefineTheme,
}: SimmerJeevesChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "jeeves",
      content: `I see you're simmering on: **"${theme}"**${themePassage ? ` with ${themePassage}` : ""}. 

Let's develop this together. What's the **core tension** you want your listeners to feel? What gap between expectation and reality does this sermon address?

Share your raw thoughts — I'll help you find the gems hidden in them.`,
      timestamp: new Date(),
      type: "question",
    },
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke("sermon-simmer", {
        body: {
          mode: "chat",
          sessionId,
          theme,
          themePassage,
          userMessage: userMessage.content,
          conversationHistory: messages.slice(-10).map((m) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.content,
          })),
          existingGems,
        },
      });

      if (error) throw error;

      const jeevesResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "jeeves",
        content: data.response || "Let me think on that...",
        timestamp: new Date(),
        type: data.type || "insight",
      };

      setMessages((prev) => [...prev, jeevesResponse]);

      // Handle discovered gems
      if (data.discoveredGems?.length > 0) {
        data.discoveredGems.forEach((gem: any) => {
          onGemDiscovered?.(gem);
        });
        toast.success(`${data.discoveredGems.length} gem(s) discovered! 💎`);
      }

      // Handle theme refinement suggestion
      if (data.refinedTheme) {
        onRefineTheme?.(data.refinedTheme);
      }
    } catch (error: any) {
      console.error("Simmer chat error:", error);
      toast.error("Failed to get response");
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "jeeves",
        content: "I'm having trouble connecting. Let's try again in a moment.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case "question":
        return <MessageCircle className="w-4 h-4 text-blue-400" />;
      case "insight":
        return <Lightbulb className="w-4 h-4 text-yellow-400" />;
      case "refinement":
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      default:
        return null;
    }
  };

  return (
    <Card className="bg-black/30 border-orange-500/20 backdrop-blur-xl h-[600px] flex flex-col">
      <CardHeader className="pb-2 border-b border-orange-500/20">
        <CardTitle className="text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="block">Simmer with Jeeves</span>
            <span className="text-xs font-normal text-orange-200/60">
              Let's develop your sermon idea together
            </span>
          </div>
        </CardTitle>
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
                        <AvatarFallback className="bg-gradient-to-br from-orange-500 to-amber-600 text-white text-xs">
                          J
                        </AvatarFallback>
                      </>
                    ) : (
                      <AvatarFallback className="bg-orange-500/30 text-orange-200 text-xs">
                        You
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-orange-500/30 text-white"
                        : "bg-black/40 border border-orange-500/20 text-orange-100"
                    }`}
                  >
                    {message.role === "jeeves" && message.type && (
                      <div className="flex items-center gap-1 mb-1">
                        {getMessageIcon(message.type)}
                        <span className="text-xs text-orange-200/60 capitalize">
                          {message.type}
                        </span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-orange-200/40">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {message.role === "jeeves" && (
                        <CopyButton text={message.content} size="sm" className="h-6 text-[10px] text-orange-200/60 hover:text-white" />
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
                  <AvatarFallback className="bg-gradient-to-br from-orange-500 to-amber-600 text-white text-xs">
                    J
                  </AvatarFallback>
                </Avatar>
                <div className="bg-black/40 border border-orange-500/20 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2 text-orange-200/60">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Simmering on your idea...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-orange-500/20">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Share your thoughts, questions, or ideas..."
              className="bg-black/30 border-orange-500/30 text-white placeholder:text-orange-200/50 min-h-[60px] max-h-[120px] resize-none"
              disabled={isProcessing}
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isProcessing}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 self-end"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-orange-200/40 mt-2 text-center">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
