import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface BlueprintJeevesChatProps {
  lessonId: number;
  lessonTitle: string;
  lessonContent: string;
}

export function BlueprintJeevesChat({ lessonId, lessonTitle, lessonContent }: BlueprintJeevesChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Get user profile to pass name to Jeeves
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = user ? await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single() : { data: null };

      const userName = profile?.display_name || null;

      const { data, error } = await supabase.functions.invoke("blueprint-mentor", {
        body: {
          messages: [...messages, userMessage],
          lessonId,
          lessonTitle,
          lessonContext: lessonContent,
          userName, // Pass the user's name
        },
      });

      if (error) throw error;

      if (data?.response) {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.response,
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error("Blueprint Jeeves error:", error);
      toast({
        title: "Connection Error",
        description: "I'm having trouble connecting. Please try again.",
        variant: "destructive",
      });
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

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <Card className="mb-6 border-primary/20">
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          Study with Jeeves - {lessonTitle}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Ask questions about the sanctuary, prophecy, or this lesson's content
        </p>
      </CardHeader>
      <CardContent className="pt-4">
        <ScrollArea className="h-[400px] pr-4 mb-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <Sparkles className="h-12 w-12 mx-auto mb-3 text-primary/50" />
                <p className="font-medium mb-2">Ready to explore the Blueprint?</p>
                <p className="text-sm">Ask me about:</p>
                <ul className="text-sm mt-2 space-y-1">
                  <li>• Sanctuary symbolism and Christ</li>
                  <li>• Prophetic timelines (70 weeks, 1260 years, 2300 days)</li>
                  <li>• Discussion questions from this lesson</li>
                  <li>• How it applies to your life today</li>
                </ul>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-2 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <div className="animate-pulse">Jeeves is thinking...</div>
                    <Sparkles className="h-4 w-4 animate-spin" />
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
            placeholder="Ask about the sanctuary, prophecy, or this lesson..."
            className="min-h-[60px]"
            disabled={isLoading}
          />
          <div className="flex flex-col gap-2">
            <Button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
            {messages.length > 0 && (
              <Button
                onClick={clearChat}
                disabled={isLoading}
                variant="outline"
                size="icon"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
