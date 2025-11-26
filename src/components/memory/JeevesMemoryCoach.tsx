import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface JeevesMemoryCoachProps {
  verses: any[];
  technique: "first-letter" | "memory-palace";
}

export function JeevesMemoryCoach({ verses, technique }: JeevesMemoryCoachProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: technique === "first-letter"
        ? "I'm here to help you master the First Letter technique! I can test you on any verse, explain the technique, or provide custom mnemonics. What would you like to practice?"
        : "I'm your Memory Palace guide! I can help you create vivid visualizations, test your palace walk, or suggest better location associations. What verse would you like to work on?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const systemPrompt = technique === "first-letter"
        ? `You are Jeeves, a memory coach specializing in the First Letter technique. Help users memorize Bible verses by:
- Testing them on specific verses (show first letters, have them recall)
- Explaining how to use first letters effectively
- Creating custom mnemonics for difficult verses
- Encouraging and providing tips

Available verses: ${verses.map(v => `${v.verse_reference}: ${v.verse_text}`).join(" | ")}`
        : `You are Jeeves, a Memory Palace guide. Help users build and practice memory palaces by:
- Suggesting vivid, memorable visualizations for verses
- Testing their palace walk (describe location, ask for verse)
- Improving their location associations
- Teaching Memory Palace principles

Available verses: ${verses.map(v => `${v.verse_reference}: ${v.verse_text}`).join(" | ")}`;

      const { data, error } = await supabase.functions.invoke("chat", {
        body: {
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.filter(m => m.role === "user" || m.role === "assistant"),
            { role: "user", content: userMessage }
          ]
        }
      });

      if (error) throw error;

      const response = data.choices[0].message.content;
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      console.error("Jeeves error:", error);
      toast.error("Failed to get response from Jeeves");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle>Jeeves - Your Memory Coach</CardTitle>
        </div>
        <CardDescription>
          Ask for help, practice tests, or memorization tips
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg ${
                  msg.role === "assistant"
                    ? "bg-primary/10 border border-primary/20"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Jeeves is thinking...</span>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask Jeeves anything about memorizing these verses..."
            className="min-h-[60px]"
            disabled={loading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            size="icon"
            className="h-[60px] w-[60px]"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
