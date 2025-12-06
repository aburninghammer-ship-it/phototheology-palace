import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, Send, Loader2, Sparkles, ThumbsUp, ThumbsDown, 
  Lightbulb, ChevronDown, ChevronUp, BookOpen
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { StyledMarkdown } from "@/components/ui/styled-markdown";
import { QuickAudioButton } from "@/components/audio";

interface Message {
  role: "user" | "assistant";
  content: string;
  helpful?: boolean | null;
}

interface FollowUpChatProps {
  originalThought: string;
  analysisResult: {
    summary: string;
    overallScore: number;
    strengths: string[];
    growthAreas: string[];
    palaceRooms: { code: string; name: string; relevance: string }[];
    encouragement: string;
  };
}

const suggestedQuestions = [
  "Can you explain this concept deeper?",
  "How does this connect to the sanctuary?",
  "What other verses support this idea?",
  "How can I apply this practically?",
  "What's the Christ-centered meaning here?",
];

export const FollowUpChat = ({ originalThought, analysisResult }: FollowUpChatProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text) return;

    const userMessage: Message = { role: "user", content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "analyze-followup",
          message: text,
          context: {
            originalThought,
            previousAnalysis: {
              summary: analysisResult.summary,
              score: analysisResult.overallScore,
              strengths: analysisResult.strengths,
              growthAreas: analysisResult.growthAreas,
              palaceRooms: analysisResult.palaceRooms,
            },
            conversationHistory: messages.slice(-6), // Last 6 messages for context
          },
        },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response || "I apologize, but I couldn't generate a response. Please try again.",
        helpful: null,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Follow-up chat error:", error);
      toast.error("Failed to get response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (messageIndex: number, helpful: boolean) => {
    // Update local state
    setMessages(prev => prev.map((msg, i) => 
      i === messageIndex ? { ...msg, helpful } : msg
    ));

    // Save feedback for learning
    try {
      const message = messages[messageIndex];
      const previousUserMessage = messages[messageIndex - 1]?.content || "";
      
      await supabase.from("jeeves_feedback").insert({
        context_type: "analyze-followup",
        user_question: previousUserMessage,
        jeeves_response: message.content.substring(0, 2000),
        was_helpful: helpful,
        original_context: JSON.stringify({
          thought: originalThought.substring(0, 500),
          score: analysisResult.overallScore,
        }),
      });

      toast.success(helpful ? "Thanks! This helps Jeeves improve." : "Got it! Jeeves will learn from this.");
    } catch (error) {
      console.debug("Feedback save error:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.3 }}
    >
      <Card className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-indigo-500/20">
        <CardHeader 
          className="cursor-pointer border-b border-border/50"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-indigo-400" />
              <span className="bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent">
                Continue the Conversation
              </span>
            </span>
            <Button variant="ghost" size="sm" className="p-0 h-auto">
              {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </Button>
          </CardTitle>
          <CardDescription>
            Ask follow-up questions to deepen your understanding
          </CardDescription>
        </CardHeader>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="pt-4 space-y-4">
                {/* Suggested Questions */}
                {messages.length === 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Lightbulb className="h-3 w-3" /> Quick questions:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedQuestions.map((q, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          className="text-xs bg-indigo-500/10 border-indigo-500/30 hover:bg-indigo-500/20"
                          onClick={() => sendMessage(q)}
                          disabled={isLoading}
                        >
                          {q}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chat Messages */}
                {messages.length > 0 && (
                  <ScrollArea className="h-[300px] pr-4" ref={scrollRef}>
                    <div className="space-y-4">
                      {messages.map((msg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-xl p-3 ${
                              msg.role === "user"
                                ? "bg-indigo-500/20 border border-indigo-500/30"
                                : "bg-background/50 border border-purple-500/20"
                            }`}
                          >
                            {msg.role === "assistant" ? (
                              <>
                                <div className="flex items-start gap-2 mb-2">
                                  <Sparkles className="h-4 w-4 text-amber-400 shrink-0 mt-1" />
                                  <div className="flex-1">
                                    <StyledMarkdown content={msg.content} className="text-sm" />
                                  </div>
                                </div>
                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30">
                                  <QuickAudioButton text={msg.content} variant="ghost" size="sm" />
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-muted-foreground mr-1">Helpful?</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className={`h-7 w-7 p-0 ${msg.helpful === true ? "text-emerald-400" : ""}`}
                                      onClick={() => handleFeedback(i, true)}
                                    >
                                      <ThumbsUp className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className={`h-7 w-7 p-0 ${msg.helpful === false ? "text-red-400" : ""}`}
                                      onClick={() => handleFeedback(i, false)}
                                    >
                                      <ThumbsDown className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <p className="text-sm">{msg.content}</p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-background/50 border border-purple-500/20 rounded-xl p-3">
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                              <span className="text-sm text-muted-foreground">Jeeves is thinking...</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                )}

                {/* Input */}
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Ask a follow-up question..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="min-h-[60px] max-h-[120px] bg-background/50 border-indigo-500/20 focus:border-indigo-500/50"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={() => sendMessage()}
                    disabled={isLoading || !input.trim()}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-4"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};
