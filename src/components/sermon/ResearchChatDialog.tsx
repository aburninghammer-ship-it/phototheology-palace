import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, MessageSquare, X } from "lucide-react";
import { formatJeevesResponse } from "@/lib/formatJeevesResponse";
import { toast } from "sonner";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ResearchChatDialogProps {
  sermonTitle: string;
  scripture: string;
  research: string;
}

export function ResearchChatDialog({ sermonTitle, scripture, research }: ResearchChatDialogProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage = input.trim();
    setInput("");
    const newMessages: ChatMessage[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsStreaming(true);

    let assistantContent = "";

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sermon-research-chat`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          sermonTitle,
          scripture,
          research,
        }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || `Error ${resp.status}`);
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      // Add empty assistant message
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              const finalContent = assistantContent;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: finalContent };
                return updated;
              });
            }
          } catch {
            // partial JSON, skip
          }
        }
      }
    } catch (err: any) {
      console.error("Research chat error:", err);
      toast.error(err.message || "Failed to get response");
      if (!assistantContent) {
        setMessages(prev => {
          const updated = [...prev];
          if (updated[updated.length - 1]?.role === "assistant" && !updated[updated.length - 1].content) {
            updated.pop();
          }
          return updated;
        });
      }
    } finally {
      setIsStreaming(false);
    }
  };

  if (!open) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="text-amber-700 border-amber-300 hover:bg-amber-50 gap-2"
        onClick={() => setOpen(true)}
      >
        <MessageSquare className="h-4 w-4" />
        Continue Dialogue
      </Button>
    );
  }

  return (
    <div className="mt-3 border border-amber-200 dark:border-amber-800 rounded-lg bg-amber-50/30 dark:bg-amber-950/20">
      <div className="flex items-center justify-between px-4 py-2 border-b border-amber-200/50">
        <span className="text-sm font-medium text-amber-700 flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Research Dialogue
        </span>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setOpen(false)}>
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div ref={scrollRef} className="max-h-[400px] overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Ask follow-up questions about this research — dive deeper into any section, request more Scripture, or explore new angles.
          </p>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg text-sm ${
              msg.role === "user"
                ? "bg-muted ml-8"
                : "bg-primary/5 border border-primary/10 mr-4"
            }`}
          >
            {msg.role === "assistant" ? (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {formatJeevesResponse(msg.content || "...")}
              </div>
            ) : (
              <p className="whitespace-pre-wrap">{msg.content}</p>
            )}
          </div>
        ))}
        {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex items-center gap-2 text-amber-600 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            Jeeves is thinking...
          </div>
        )}
      </div>

      <div className="p-3 border-t border-amber-200/50 flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask about the research..."
          className="min-h-[50px] max-h-[100px] text-sm"
          disabled={isStreaming}
        />
        <Button
          onClick={handleSend}
          disabled={!input.trim() || isStreaming}
          size="icon"
          className="h-[50px] w-[50px] shrink-0"
        >
          {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
