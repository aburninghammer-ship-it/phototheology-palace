import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface InsightDeepDiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  label: string;
  text: string;
}

export function InsightDeepDiveModal({ open, onOpenChange, label, text }: InsightDeepDiveModalProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async () => {
    setContent("");
    setError(null);
    setLoading(true);

    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/banner-deep-dive`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ label, text }),
      });

      if (!resp.ok || !resp.body) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.error || "Failed to generate insight");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulated = "";

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
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              accumulated += delta;
              setContent(accumulated);
            }
          } catch {
            // partial JSON, wait for more
          }
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [label, text]);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      generate();
    } else {
      setContent("");
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col bg-background/95 backdrop-blur-xl border-amber-500/20">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <span className="text-amber-400 font-bold">{label}</span>
            <span className="text-muted-foreground text-sm font-normal">— Deep Dive</span>
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{text}</p>
        </DialogHeader>

        <ScrollArea className="flex-1 min-h-0 pr-4">
          {error ? (
            <div className="text-red-400 text-sm py-8 text-center">{error}</div>
          ) : !content && loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="h-8 w-8 text-amber-400 animate-spin" />
              <p className="text-sm text-muted-foreground">Jeeves is tracing the pattern...</p>
            </div>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none prose-headings:text-amber-300 prose-strong:text-foreground prose-a:text-blue-400">
              <ReactMarkdown>{content}</ReactMarkdown>
              {loading && (
                <span className="inline-block w-2 h-4 bg-amber-400/60 animate-pulse ml-0.5" />
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
