import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle, Send, Loader2, Sparkles, ThumbsUp, ThumbsDown,
  Lightbulb, ChevronDown, ChevronUp, BookOpen, Save, FileText, Copy, BookmarkPlus
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { StyledMarkdown } from "@/components/ui/styled-markdown";
import { QuickAudioButton } from "@/components/audio";
import { useRecentStudies, RecentStudy } from "@/hooks/useRecentStudies";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

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
  analysisId?: string;
  initialConversation?: Message[];
  onConversationChange?: (messages: Message[]) => void;
}

const suggestedQuestions = [
  "Can you explain this concept deeper?",
  "How does this connect to the sanctuary?",
  "What other verses support this idea?",
  "How can I apply this practically?",
  "What's the Christ-centered meaning here?",
];

export const FollowUpChat = ({ 
  originalThought, 
  analysisResult,
  analysisId,
  initialConversation,
  onConversationChange
}: FollowUpChatProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialConversation || []);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingConversation, setIsSavingConversation] = useState(false);
  const [studyContext, setStudyContext] = useState<RecentStudy | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Sync with initial conversation when it loads
  useEffect(() => {
    if (initialConversation && initialConversation.length > 0 && messages.length === 0) {
      setMessages(initialConversation);
    }
  }, [initialConversation]);

  // Notify parent when messages change and persist to database
  useEffect(() => {
    if (onConversationChange && messages.length > 0) {
      onConversationChange(messages);
    }
    
    // Auto-save conversation to thought_analyses if we have an analysisId
    if (analysisId && messages.length > 0) {
      const saveConversation = async () => {
        try {
          console.log('[FollowUpChat] Auto-saving conversation to analysis:', analysisId, 'Messages:', messages.length);
          const { error } = await supabase
            .from('thought_analyses')
            .update({ followup_conversation: messages as any })
            .eq('id', analysisId);
          
          if (error) {
            console.error('[FollowUpChat] Error auto-saving conversation:', error);
          } else {
            console.log('[FollowUpChat] Conversation auto-saved successfully');
          }
        } catch (error) {
          console.error('[FollowUpChat] Error auto-saving conversation:', error);
        }
      };
      // Debounce the save
      const timer = setTimeout(saveConversation, 1500);
      return () => clearTimeout(timer);
    }
  }, [messages, analysisId, onConversationChange]);

  // Save immediately when component unmounts or page changes
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (analysisId && messages.length > 0) {
        // Use synchronous fetch for beforeunload
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        
        navigator.sendBeacon(
          `${supabaseUrl}/rest/v1/thought_analyses?id=eq.${analysisId}`,
          new Blob([JSON.stringify({ followup_conversation: messages })], { type: 'application/json' })
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Also save on unmount
      if (analysisId && messages.length > 0) {
        supabase
          .from('thought_analyses')
          .update({ followup_conversation: messages as any })
          .eq('id', analysisId)
          .then(({ error }) => {
            if (error) console.error('[FollowUpChat] Error saving on unmount:', error);
          });
      }
    };
  }, [analysisId, messages]);

  const { recentStudies, fetchRecentStudies, formatStudyForContext, isLoading: studiesLoading } = useRecentStudies();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Fetch studies when expanded
  useEffect(() => {
    if (isExpanded && recentStudies.length === 0) {
      fetchRecentStudies();
    }
  }, [isExpanded, recentStudies.length, fetchRecentStudies]);

  const loadStudyContext = (study: RecentStudy) => {
    setStudyContext(study);
    toast.success(`Loaded "${study.title}" as context for Jeeves`);
  };

  const clearStudyContext = () => {
    setStudyContext(null);
    toast.success("Study context cleared");
  };

  const saveFullConversation = async () => {
    if (messages.length === 0) {
      toast.error("No conversation to save");
      return;
    }
    
    setIsSavingConversation(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to save");
        return;
      }

      // Format the full conversation
      const conversationContent = [
        `# Thought Analysis Conversation`,
        `**Date:** ${new Date().toLocaleDateString()}`,
        ``,
        `## Original Thought`,
        originalThought,
        ``,
        `## Analysis Summary`,
        `**Score:** ${analysisResult.overallScore}/100`,
        ``,
        analysisResult.summary,
        ``,
        `## Conversation`,
        ...messages.map(msg => 
          msg.role === "user" 
            ? `### You:\n${msg.content}` 
            : `### Jeeves:\n${msg.content}`
        )
      ].join('\n\n');

      const { error } = await supabase.from('user_studies').insert({
        user_id: user.id,
        title: `Thought Analysis — ${new Date().toLocaleDateString()}`,
        content: conversationContent,
        tags: ['thought-analysis', 'jeeves-conversation'],
      });

      if (error) throw error;
      toast.success("Full conversation saved to My Studies!");
    } catch (error) {
      console.error("Error saving conversation:", error);
      toast.error("Failed to save conversation");
    } finally {
      setIsSavingConversation(false);
    }
  };

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text) return;

    const userMessage: Message = { role: "user", content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      console.log("Sending follow-up message:", { text, originalThought: originalThought.substring(0, 50), hasStudyContext: !!studyContext });
      
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
            // Include study context if loaded
            userStudyContext: studyContext ? formatStudyForContext(studyContext) : null,
          },
        },
      });

      console.log("Follow-up response:", { data, error });

      if (error) throw error;

      // Handle different response formats from the edge function
      const responseContent = data?.response || data?.content || data?.message || 
        (typeof data === 'string' ? data : null);
      
      if (!responseContent) {
        console.error("No valid response content found in:", data);
        throw new Error("Empty response from Jeeves");
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: responseContent,
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

    // Save feedback for learning (using type assertion for new table)
    try {
      const message = messages[messageIndex];
      const previousUserMessage = messages[messageIndex - 1]?.content || "";
      const { data: { user } } = await supabase.auth.getUser();
      
      // Direct fetch to bypass type checking for new table
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      
      await fetch(`${supabaseUrl}/rest/v1/jeeves_feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          user_id: user?.id || null,
          context_type: "analyze-followup",
          user_question: previousUserMessage,
          jeeves_response: message.content.substring(0, 2000),
          was_helpful: helpful,
          original_context: {
            thought: originalThought.substring(0, 500),
            score: analysisResult.overallScore,
          },
        })
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

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  };

  const saveIndividualMessage = async (messageIndex: number) => {
    const message = messages[messageIndex];
    if (message.role !== "assistant") return;

    const userQuestion = messageIndex > 0 ? messages[messageIndex - 1]?.content : "Follow-up question";

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to save");
        return;
      }

      const date = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const content = `# Jeeves Follow-up Response\n\n**Date:** ${date}\n\n**Context:** Thought Analysis Follow-up\n\n---\n\n## Question\n\n${userQuestion}\n\n## Jeeves Response\n\n${message.content}\n`;

      const { error } = await supabase.from('user_studies').insert({
        user_id: user.id,
        title: `Follow-up: ${userQuestion.slice(0, 50)}${userQuestion.length > 50 ? '...' : ''}`,
        content,
        tags: ['jeeves', 'follow-up', 'thought-analysis'],
        category: 'jeeves_response',
      });

      if (error) throw error;
      toast.success("Saved to My Studies!");
    } catch (error) {
      console.error("Error saving message:", error);
      toast.error("Failed to save");
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
                {/* Study Context & Save Actions */}
                <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-border/30">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="text-xs bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20">
                        <FileText className="h-3 w-3 mr-1" />
                        {studyContext ? `Context: ${studyContext.title.substring(0, 20)}...` : "Load Study Context"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64">
                      <DropdownMenuLabel>Load a study for Jeeves to reference</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {studiesLoading ? (
                        <DropdownMenuItem disabled>
                          <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                          Loading studies...
                        </DropdownMenuItem>
                      ) : recentStudies.length === 0 ? (
                        <DropdownMenuItem disabled>No studies found</DropdownMenuItem>
                      ) : (
                        recentStudies.slice(0, 5).map((study) => (
                          <DropdownMenuItem 
                            key={study.id} 
                            onClick={() => loadStudyContext(study)}
                            className="flex flex-col items-start"
                          >
                            <span className="font-medium truncate w-full">{study.title}</span>
                            <span className="text-xs text-muted-foreground">
                              {study.tags?.slice(0, 2).join(', ') || 'No tags'}
                            </span>
                          </DropdownMenuItem>
                        ))
                      )}
                      {studyContext && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={clearStudyContext} className="text-red-400">
                            Clear context
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {messages.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={saveFullConversation}
                      disabled={isSavingConversation}
                      className="text-xs bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400"
                    >
                      {isSavingConversation ? (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <Save className="h-3 w-3 mr-1" />
                      )}
                      Save Full Conversation
                    </Button>
                  )}

                  {studyContext && (
                    <Badge variant="outline" className="text-xs bg-purple-500/10 border-purple-500/30">
                      <BookOpen className="h-3 w-3 mr-1" />
                      Jeeves has context
                    </Badge>
                  )}
                </div>

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
                                  <div className="flex items-center gap-1">
                                    <QuickAudioButton text={msg.content} variant="ghost" size="sm" />
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                                      onClick={() => copyMessage(msg.content)}
                                      title="Copy response"
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 w-7 p-0 text-muted-foreground hover:text-emerald-400"
                                      onClick={() => saveIndividualMessage(i)}
                                      title="Save to My Studies"
                                    >
                                      <BookmarkPlus className="h-3 w-3" />
                                    </Button>
                                  </div>
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
