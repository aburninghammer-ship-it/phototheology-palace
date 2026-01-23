import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, BookOpen, Sparkles, Link2, Bot } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ResearchCommentaryPanelProps {
  book: string;
  chapter: number;
  verse: number | null;
  verseText: string;
  activeTab: string;
}

export const ResearchCommentaryPanel = ({
  book,
  chapter,
  verse,
  verseText,
  activeTab
}: ResearchCommentaryPanelProps) => {
  const [loading, setLoading] = useState(false);
  const [commentary, setCommentary] = useState<string>("");
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([]);

  const fetchCommentary = async () => {
    if (!verse) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-jeeves-commentary", {
        body: {
          book,
          chapter,
          verse,
          verseText,
          commentaryLevel: "depth"
        }
      });

      if (error) throw error;
      setCommentary(data.commentary || "No commentary available.");
    } catch (error) {
      console.error("Failed to fetch commentary:", error);
      toast.error("Failed to load commentary");
    } finally {
      setLoading(false);
    }
  };

  const askQuestion = async () => {
    if (!question.trim() || !verse) return;
    
    const newHistory = [...chatHistory, { role: "user", content: question }];
    setChatHistory(newHistory);
    setQuestion("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("jeeves-verse-assistant", {
        body: {
          book,
          chapter,
          verse,
          verseText,
          question,
          conversationHistory: chatHistory
        }
      });

      if (error) throw error;
      setChatHistory([...newHistory, { role: "assistant", content: data.response }]);
    } catch (error) {
      console.error("Failed to ask Jeeves:", error);
      toast.error("Failed to get response");
    } finally {
      setLoading(false);
    }
  };

  if (!verse) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-50" />
        <p className="text-sm">Select a verse to view commentary</p>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-4">
      {/* Verse Reference Header */}
      <div className="bg-muted/50 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            {book} {chapter}:{verse}
          </Badge>
        </div>
        <p className="text-sm italic text-muted-foreground line-clamp-3">
          "{verseText}"
        </p>
      </div>

      {activeTab === "jeeves" && (
        <div className="space-y-4">
          {/* Chat History */}
          {chatHistory.length > 0 && (
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {chatHistory.map((msg, idx) => (
                <div 
                  key={idx}
                  className={`p-3 rounded-lg text-sm ${
                    msg.role === "user" 
                      ? "bg-primary/10 ml-4" 
                      : "bg-muted mr-4"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex items-center gap-1 mb-1 text-xs text-muted-foreground">
                      <Bot className="h-3 w-3" />
                      Jeeves
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Commentary Section */}
          {!chatHistory.length && (
            <>
              {commentary ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{commentary}</p>
                </div>
              ) : (
                <Button
                  onClick={fetchCommentary}
                  disabled={loading}
                  className="w-full"
                  variant="outline"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Bot className="h-4 w-4 mr-2" />
                  )}
                  Generate Jeeves Commentary
                </Button>
              )}
            </>
          )}

          {/* Question Input */}
          <div className="flex gap-2">
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask Jeeves about this verse..."
              className="flex-1 text-sm"
              onKeyDown={(e) => e.key === "Enter" && askQuestion()}
            />
            <Button 
              size="icon" 
              onClick={askQuestion}
              disabled={loading || !question.trim()}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      )}

      {activeTab === "principles" && (
        <div className="space-y-3">
          <div className="grid grid-cols-5 gap-1">
            {["1D", "2D", "3D", "4D", "5D"].map((dim) => (
              <Badge 
                key={dim} 
                variant="outline" 
                className="justify-center text-xs py-1"
              >
                {dim}
              </Badge>
            ))}
          </div>
          <div className="text-xs text-muted-foreground space-y-2">
            <p><strong>1D Literal:</strong> Historical-grammatical meaning</p>
            <p><strong>2D Christ:</strong> Christological connections</p>
            <p><strong>3D Me:</strong> Personal application</p>
            <p><strong>4D Church:</strong> Corporate/ecclesial</p>
            <p><strong>5D Heaven:</strong> Eternal/throne room</p>
          </div>
          <Button variant="outline" size="sm" className="w-full">
            <Sparkles className="h-4 w-4 mr-2" />
            Analyze with PT Principles
          </Button>
        </div>
      )}

      {activeTab === "crossref" && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Cross-references and chain links for {book} {chapter}:{verse}
          </p>
          <Button variant="outline" size="sm" className="w-full">
            <Link2 className="h-4 w-4 mr-2" />
            Find Cross-References
          </Button>
        </div>
      )}
    </div>
  );
};
