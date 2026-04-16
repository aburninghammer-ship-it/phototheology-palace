// ─── Manuscript Q&A ─────────────────────────────────────────────────────────
// Text-only follow-up chat with Jeeves about a War College manuscript.

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles, Loader2, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SaveJeevesResponseButton } from "@/components/jeeves/SaveJeevesResponseButton";
import { getFirstName } from "@/utils/userNameUtils";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ManuscriptQAProps {
  manuscript: string;
  dayNumber: number;
  title: string;
  track: string;
  avatarName: string;
}

export function ManuscriptQA({ manuscript, dayNumber, title, track, avatarName }: ManuscriptQAProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = user
        ? await supabase.from("profiles").select("display_name").eq("id", user.id).single()
        : { data: null };

      const userName = getFirstName(profile?.display_name);

      const systemPrompt = `You are Jeeves, ${userName}'s theological study companion inside the Phototheology War College.

The student just finished reading (or is reading) the Day ${dayNumber} manuscript titled "${title}" from the "${track}" track, led by ${avatarName}.

YOUR ROLE:
- Answer follow-up questions, clarify points, and deepen understanding of the manuscript content
- Use the Phototheology framework naturally (Palace rooms, cycles, heavens, ascensions) when relevant
- Keep Christ at the center of every answer (Concentration Room principle)
- Be direct, warm, and scholarly — never preachy or devotional
- Use ${userName}'s name naturally 1-2 times per response
- NEVER use "dear" in any form
- Quote KJV Scripture when referencing Bible verses
- Keep responses focused and concise (2-4 paragraphs unless the question demands more)

MANUSCRIPT CONTENT FOR REFERENCE:
${manuscript.substring(0, 8000)}${manuscript.length > 8000 ? "\n\n[...manuscript continues...]" : ""}`;

      const { data, error } = await supabase.functions.invoke("chat", {
        body: {
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
            userMessage,
          ],
        },
      });

      if (error) throw error;

      const response = data.choices[0].message.content;
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      console.error("Manuscript Q&A error:", error);
      toast.error("Failed to get a response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="border-primary/10">
      <CardContent className="p-4 space-y-4">
        <ScrollArea className="h-[400px] pr-3">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <Sparkles className="h-10 w-10 mx-auto mb-3 text-primary/40" />
                <p className="font-medium mb-2">Ask Jeeves about this manuscript</p>
                <p className="text-sm mb-3">Get clarifications, deeper insights, or explore connections.</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    "Summarize the key argument",
                    "What Palace rooms apply here?",
                    "How does this connect to Daniel?",
                    "Explain the defense strategy",
                  ].map((q) => (
                    <Button
                      key={q}
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => {
                        setInput(q);
                      }}
                    >
                      {q}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:mb-2 prose-p:leading-relaxed">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  )}
                  {msg.role === "assistant" && idx > 0 && (
                    <div className="mt-2 pt-2 border-t border-border/30">
                      <SaveJeevesResponseButton
                        question={messages[idx - 1]?.content || "Manuscript question"}
                        response={msg.content}
                        context={`War College - Day ${dayNumber}: ${title}`}
                        variant="small"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-3 max-w-[85%]">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Jeeves is thinking...
                  </div>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about the manuscript..."
            className="min-h-[56px] text-[16px]"
            disabled={isLoading}
          />
          <div className="flex flex-col gap-1.5">
            <Button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              size="icon"
              className="h-[28px] w-[40px]"
            >
              <Send className="h-4 w-4" />
            </Button>
            {messages.length > 0 && (
              <Button
                onClick={() => setMessages([])}
                disabled={isLoading}
                variant="outline"
                size="icon"
                className="h-[28px] w-[40px]"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
