import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Loader2, ChevronDown, ChevronUp, X, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatJeevesResponse } from "@/lib/formatJeevesResponse";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Message {
  role: "user" | "assistant";
  content: string;
  images?: string[];
}

interface RoomInsightChatProps {
  roomCode: string;
  roomName: string;
  roomContent: string;
  book: string;
  chapter: number;
  verse: number;
  verseText: string;
}

export const RoomInsightChat = ({
  roomCode,
  roomName,
  roomContent,
  book,
  chapter,
  verse,
  verseText,
}: RoomInsightChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const askQuestion = async () => {
    if (!question.trim() && images.length === 0) return;

    const userMessage: Message = { 
      role: "user", 
      content: question,
      images: images.length > 0 ? [...images] : undefined
    };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setImages([]);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "room-insight-chat",
          roomCode,
          roomName,
          roomContent,
          book,
          chapter,
          verse,
          verseText,
          question: question,
          images: userMessage.images,
          conversationHistory: messages,
        },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Room insight chat error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to get response",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf("image") !== -1) {
        e.preventDefault();
        const blob = item.getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const base64 = event.target?.result as string;
            setImages((prev) => [...prev, base64]);
          };
          reader.readAsDataURL(blob);
        }
      }
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="border-l-4 border-primary/30 pl-4 mt-4">
      <div className="mb-3">
        <Badge className="gradient-palace text-white text-xs mb-2">
          {roomCode}
        </Badge>
        <h3 className="font-bold text-lg mb-2 text-primary">{roomName}</h3>
        <div className="text-sm leading-relaxed text-foreground/90">
          {roomContent}
        </div>
      </div>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-between hover:bg-primary/5"
          >
            <span className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Ask about this room
              {messages.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {messages.length}
                </Badge>
              )}
            </span>
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-3 space-y-3">
          {messages.length > 0 && (
            <ScrollArea className="h-[200px] rounded-lg border bg-card/50 p-3">
              <div className="space-y-3">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-primary/10 ml-4"
                        : "bg-secondary/50 mr-4"
                    }`}
                  >
                    <div className="text-xs font-semibold mb-1 text-muted-foreground">
                      {msg.role === "user" ? "You" : "Jeeves"}
                    </div>
                    {msg.images && msg.images.length > 0 && (
                      <div className="flex gap-2 mb-2 flex-wrap">
                        {msg.images.map((img, imgIdx) => (
                          <img
                            key={imgIdx}
                            src={img}
                            alt={`Attached image ${imgIdx + 1}`}
                            className="h-16 w-16 object-cover rounded border"
                          />
                        ))}
                      </div>
                    )}
                    <div className="text-sm">
                      {msg.role === "assistant"
                        ? formatJeevesResponse(msg.content)
                        : msg.content}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          <div className="space-y-2">
            {images.length > 0 && (
              <div className="flex gap-2 flex-wrap p-2 bg-muted/50 rounded-lg">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={img}
                      alt={`Pasted image ${idx + 1}`}
                      className="h-16 w-16 object-cover rounded-lg border"
                    />
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex gap-2">
              <div className="flex-1">
                <Textarea
                  ref={textareaRef}
                  placeholder={`Ask a question about ${roomName}...`}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onPaste={handlePaste}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      askQuestion();
                    }
                  }}
                  className="min-h-[60px] resize-none"
                  disabled={loading}
                />
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <ImageIcon className="h-3 w-3" />
                  Paste images with Ctrl+V
                </div>
              </div>
              <Button
                onClick={askQuestion}
                disabled={loading || (!question.trim() && images.length === 0)}
                size="sm"
                className="px-3"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
