import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sparkles, Send, Loader2, ChevronDown, ChevronUp, Search, Save, Copy, BookmarkPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatJeevesResponse } from "@/lib/formatJeevesResponse";
import { trackJeevesInteraction } from "@/hooks/useAnalyticsTracking";
import { getFirstName } from "@/utils/userNameUtils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface JeevesStudyAssistantProps {
  studyContext?: string;
  studyId?: string;
  onContentUpdate?: (content: string, tags: string[]) => void;
  initialConversation?: Message[];
  onConversationChange?: (messages: Message[]) => void;
}

export const JeevesStudyAssistant = ({ 
  studyContext, 
  studyId, 
  onContentUpdate,
  initialConversation,
  onConversationChange
}: JeevesStudyAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialConversation || []);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [researchMode, setResearchMode] = useState(false);
  const [savingMessageIndex, setSavingMessageIndex] = useState<number | null>(null);
  const { toast } = useToast();

  // Sync with initial conversation when it loads
  useEffect(() => {
    if (initialConversation && initialConversation.length > 0 && messages.length === 0) {
      setMessages(initialConversation);
    }
  }, [initialConversation]);

  // Notify parent when messages change
  useEffect(() => {
    if (onConversationChange && messages.length > 0) {
      onConversationChange(messages);
    }
  }, [messages, onConversationChange]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    const updatedMessages = [...messages, { role: "user" as const, content: userMessage }];
    
    setInput("");
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // Get user profile to pass name to Jeeves
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = user ? await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single() : { data: null };

      const userName = getFirstName(profile?.display_name);

      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: researchMode ? "research" : "qa",
          ...(researchMode ? { query: userMessage } : { question: userMessage }),
          context: studyContext || "General Bible study assistance",
          conversationHistory: messages, // Send previous messages for context
          userName, // Pass the user's name
        },
      });

      if (error) throw error;

      // Track the interaction
      const responseContent = data.content || "";
      trackJeevesInteraction(
        userMessage,
        researchMode ? "research" : "study-qa",
        responseContent.substring(0, 200),
        "Study Editor"
      );

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: responseContent || "I'm here to help with your study!" }
      ]);
    } catch (error) {
      console.error("Error asking Jeeves:", error);
      toast({
        title: "Error",
        description: "Failed to get response from Jeeves",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied",
      description: "Response copied to clipboard",
    });
  };

  const saveToMyStudies = async (messageIndex: number) => {
    const message = messages[messageIndex];
    if (message.role !== "assistant") return;

    const userQuestion = messageIndex > 0 ? messages[messageIndex - 1].content : "";

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "Please log in to save",
          variant: "destructive",
        });
        return;
      }

      const date = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const content = `# Jeeves Study Response\n\n**Date:** ${date}\n\n**Mode:** ${researchMode ? 'Research' : 'Q&A'}\n\n---\n\n## Question\n\n${userQuestion}\n\n## Jeeves Response\n\n${message.content}\n`;

      const tags = extractTags(userQuestion + " " + message.content);

      const { error } = await supabase.from('user_studies').insert({
        user_id: user.id,
        title: `Jeeves: ${userQuestion.slice(0, 50)}${userQuestion.length > 50 ? '...' : ''}`,
        content,
        tags: ['jeeves', 'jeeves_response', ...tags],
      });

      if (error) throw error;
      toast({
        title: "Saved",
        description: "Response saved to My Studies",
      });
    } catch (error) {
      console.error("Error saving message:", error);
      toast({
        title: "Error",
        description: "Failed to save response",
        variant: "destructive",
      });
    }
  };

  const extractTags = (text: string): string[] => {
    // Extract potential keywords from the text
    const keywords: string[] = [];
    
    // Common phototheology terms
    const ptTerms = ['sanctuary', 'prophecy', 'daniel', 'revelation', 'dimensions', 'cycles', 
                     'christ', 'typology', 'pattern', 'symbol', 'heaven', 'feast'];
    
    const lowerText = text.toLowerCase();
    ptTerms.forEach(term => {
      if (lowerText.includes(term)) {
        keywords.push(term.charAt(0).toUpperCase() + term.slice(1));
      }
    });
    
    // Extract Bible books mentioned
    const bibleBooks = ['genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy', 
                        'matthew', 'mark', 'luke', 'john', 'acts', 'romans'];
    bibleBooks.forEach(book => {
      if (lowerText.includes(book)) {
        keywords.push(book.charAt(0).toUpperCase() + book.slice(1));
      }
    });
    
    return [...new Set(keywords)].slice(0, 5); // Return unique tags, max 5
  };

  const saveToStudy = async (messageIndex: number) => {
    if (!studyId) {
      toast({
        title: "Error",
        description: "Study ID not found",
        variant: "destructive",
      });
      return;
    }

    const message = messages[messageIndex];
    if (message.role !== "assistant") return;

    setSavingMessageIndex(messageIndex);

    try {
      // Fetch current study data
      const { data: study, error: fetchError } = await supabase
        .from("user_studies")
        .select("content, tags")
        .eq("id", studyId)
        .single();

      if (fetchError) throw fetchError;

      // Get the user's question that prompted this response
      const userQuestion = messageIndex > 0 ? messages[messageIndex - 1].content : "";
      
      // Format the research as a new section
      const timestamp = new Date().toLocaleString();
      const newSection = `\n\n---\n\n### Jeeves Research: ${userQuestion}\n*Saved on ${timestamp}*\n\n${message.content}\n`;
      
      // Append to existing content
      const updatedContent = (study.content || "") + newSection;
      
      // Extract and merge tags
      const newTags = extractTags(userQuestion + " " + message.content);
      const existingTags = study.tags || [];
      const mergedTags = [...new Set([...existingTags, ...newTags])];

      // Update the study
      const { error: updateError } = await supabase
        .from("user_studies")
        .update({
          content: updatedContent,
          tags: mergedTags,
        })
        .eq("id", studyId);

      if (updateError) throw updateError;

      // Notify parent component if callback provided
      if (onContentUpdate) {
        onContentUpdate(updatedContent, mergedTags);
      }

      toast({
        title: "Saved to Study",
        description: `Research saved with ${newTags.length} new tags`,
      });
    } catch (error) {
      console.error("Error saving to study:", error);
      toast({
        title: "Error",
        description: "Failed to save research to study",
        variant: "destructive",
      });
    } finally {
      setSavingMessageIndex(null);
    }
  };

  return (
    <Card className="border-primary/20">
      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full flex items-center justify-between"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-semibold">Ask Jeeves</span>
          </div>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>

        {isOpen && (
          <div className="flex items-center justify-between mt-3 px-2 py-2 bg-muted/50 rounded-md">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-primary" />
              <Label htmlFor="research-mode" className="text-sm font-medium cursor-pointer">
                Research Mode
              </Label>
            </div>
            <Switch
              id="research-mode"
              checked={researchMode}
              onCheckedChange={setResearchMode}
            />
          </div>
        )}
        
        {researchMode && isOpen && (
          <p className="text-xs text-muted-foreground mt-2 px-2">
            🔍 Scholarly research enabled - Jeeves will search academic sources and provide detailed, referenced answers
          </p>
        )}
      </div>

      {isOpen && (
        <div className="px-4 pb-4 pt-0">
          <ScrollArea className="h-[300px] pr-4 mb-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Sparkles className="w-12 h-12 mx-auto mb-3 text-primary/50" />
                <p>Ask me anything about your study!</p>
                <p className="text-sm mt-2">I can help with interpretations, cross-references, and insights.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className="flex flex-col gap-2 max-w-[85%]">
                      <div
                        className={`rounded-lg ${
                          msg.role === "user"
                            ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-3"
                            : "bg-gradient-to-br from-card to-muted/50 border border-border/50 p-4 shadow-sm"
                        }`}
                      >
                        {msg.role === "assistant" ? (
                          <div className="space-y-4">
                            <div className="flex items-start gap-2 mb-4">
                              <span className="text-2xl flex-shrink-0">🤖</span>
                              <span className="font-semibold text-primary">Jeeves says:</span>
                            </div>
                            <div className="jeeves-response space-y-3">
                              {formatJeevesResponse(msg.content)}
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm font-medium">{msg.content}</p>
                        )}
                      </div>
                      {msg.role === "assistant" && (
                        <div className="flex items-center gap-2 self-start">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyMessage(msg.content)}
                            className="gap-1 h-7 text-xs text-muted-foreground hover:text-foreground"
                            title="Copy response"
                          >
                            <Copy className="w-3 h-3" />
                            Copy
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => saveToMyStudies(idx)}
                            className="gap-1 h-7 text-xs text-muted-foreground hover:text-emerald-500"
                            title="Save to My Studies"
                          >
                            <BookmarkPlus className="w-3 h-3" />
                            Save
                          </Button>
                          {studyId && researchMode && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => saveToStudy(idx)}
                              disabled={savingMessageIndex === idx}
                              className="gap-1 h-7 text-xs"
                            >
                              {savingMessageIndex === idx ? (
                                <>
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                  Appending...
                                </>
                              ) : (
                                <>
                                  <Save className="w-3 h-3" />
                                  Append to Study
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask about your study..."
              className="min-h-[60px] resize-none"
              disabled={loading}
            />
            <Button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              size="icon"
              className="h-[60px] w-[60px]"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};
