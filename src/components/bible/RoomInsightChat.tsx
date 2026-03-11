import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Loader2, ChevronDown, ChevronUp, X, Image as ImageIcon, FolderOpen, BookOpen, Quote } from "lucide-react";
import { ExportToStudyButton } from "@/components/ExportToStudyButton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatJeevesResponse } from "@/lib/formatJeevesResponse";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SaveJeevesResponseButton } from "@/components/jeeves/SaveJeevesResponseButton";

/**
 * Format classic commentary text into beautiful, readable paragraphs
 */
const formatClassicCommentary = (text: string): React.ReactNode => {
  if (!text) return null;

  // Clean up the text
  let cleanText = text
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Split into sentences while preserving verse references like "John 3:5"
  const sentencePattern = /(?<=[.!?])\s+(?=[A-Z])|(?<=[.!?])\s+(?=["'])|(?<=[.!?]["'])\s+/g;
  const sentences = cleanText.split(sentencePattern).filter(s => s.trim());

  // Group sentences into paragraphs (3-4 sentences each for readability)
  const paragraphs: string[] = [];
  let currentParagraph: string[] = [];

  sentences.forEach((sentence, idx) => {
    currentParagraph.push(sentence.trim());

    // Create new paragraph every 3-4 sentences, or at natural breaks
    const isNaturalBreak = sentence.includes(':') && sentence.length < 50; // Short clauses with colons
    const sentenceCount = currentParagraph.length;

    if (sentenceCount >= 3 || (sentenceCount >= 2 && isNaturalBreak) || idx === sentences.length - 1) {
      paragraphs.push(currentParagraph.join(' '));
      currentParagraph = [];
    }
  });

  // If we have remaining sentences, add them
  if (currentParagraph.length > 0) {
    paragraphs.push(currentParagraph.join(' '));
  }

  // Format verse references in text
  const formatVerseReferences = (text: string): React.ReactNode => {
    // Match verse references like "John 3:16", "Genesis 1:1-5", "1 Corinthians 13:4"
    const parts: React.ReactNode[] = [];
    const versePattern = /((?:[1-3]\s+)?[A-Z][a-z]+(?:\s+[oO]f\s+[A-Z][a-z]+)?)\s+(\d+:\d+(?:-\d+)?)/g;
    let lastIndex = 0;
    let match;
    let keyIdx = 0;

    while ((match = versePattern.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      // Add styled verse reference
      parts.push(
        <span
          key={`verse-${keyIdx++}`}
          className="font-semibold text-primary/90 hover:text-primary cursor-pointer transition-colors"
          title={`${match[1]} ${match[2]}`}
        >
          {match[1]} {match[2]}
        </span>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? <>{parts}</> : text;
  };

  // Format quoted text (text in double quotes)
  const formatQuotedText = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    const quotePattern = /"([^"]+)"/g;
    let lastIndex = 0;
    let match;
    let keyIdx = 0;

    while ((match = quotePattern.exec(text)) !== null) {
      // Add text before the quote
      if (match.index > lastIndex) {
        parts.push(formatVerseReferences(text.slice(lastIndex, match.index)));
      }

      // Add styled quote
      parts.push(
        <span
          key={`quote-${keyIdx++}`}
          className="italic text-foreground/95"
        >
          "{match[1]}"
        </span>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(formatVerseReferences(text.slice(lastIndex)));
    }

    return parts.length > 0 ? <>{parts}</> : formatVerseReferences(text);
  };

  return (
    <div className="classic-commentary space-y-5">
      {paragraphs.map((paragraph, idx) => {
        const isFirstParagraph = idx === 0;
        const firstChar = paragraph.charAt(0);
        const restOfParagraph = paragraph.slice(1);

        return (
          <p
            key={idx}
            className={`
              leading-[1.9] text-[15px] text-foreground/90
              ${isFirstParagraph ? '' : 'text-justify'}
            `}
          >
            {isFirstParagraph ? (
              <>
                <span className="float-left text-4xl font-serif font-bold leading-none mr-2 mt-1 text-primary/80 drop-shadow-sm">
                  {firstChar}
                </span>
                {formatQuotedText(restOfParagraph)}
              </>
            ) : (
              formatQuotedText(paragraph)
            )}
          </p>
        );
      })}
    </div>
  );
};

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
      // Get user profile to pass name to Jeeves (extract first name for personal touch)
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = user ? await supabase
        .from('profiles')
        .select('display_name, username')
        .eq('id', user.id)
        .single() : { data: null };

      // Extract first name from display_name for more personal address
      let userName: string | null = null;
      if (profile?.display_name) {
        userName = profile.display_name.trim().split(/\s+/)[0] || profile.display_name;
      } else if (profile?.username) {
        userName = profile.username;
      }

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
          userName,
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

  // Check if this is a classic commentary (General Insights from classic commentaries)
  const isClassicCommentary = roomCode === "GEN" && roomName === "General Insights";

  return (
    <div className={`${isClassicCommentary ? 'border-l-4 border-amber-500/50' : 'border-l-4 border-primary/30'} pl-3 mt-4 min-w-0 overflow-hidden`}>
      <div className="mb-3">
        {isClassicCommentary ? (
          // Beautiful classic commentary header
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-foreground">Classic Commentary</h3>
              <p className="text-xs text-muted-foreground">Historical biblical scholarship</p>
            </div>
          </div>
        ) : (
          <>
            <Badge className="gradient-palace text-white text-xs mb-2">
              {roomCode}
            </Badge>
            <h3 className="font-bold text-lg mb-2 text-primary">{roomName}</h3>
          </>
        )}

        {/* Content display - use special formatting for classic commentaries */}
        {isClassicCommentary ? (
          <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-950/20 dark:to-orange-950/10 rounded-lg p-4 border border-amber-200/50 dark:border-amber-800/30 shadow-sm break-words overflow-hidden">
            <Quote className="h-8 w-8 text-amber-400/40 mb-3 -ml-1" />
            {formatClassicCommentary(roomContent)}
          </div>
        ) : (
          <div className="text-sm leading-relaxed text-foreground/90 break-words overflow-hidden">
            {formatJeevesResponse(roomContent)}
          </div>
        )}
      </div>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center gap-2">
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 justify-between hover:bg-primary/5"
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
          {messages.length > 0 && (
            <ExportToStudyButton
              type="room-insight"
              title={`${roomName} Insight — ${book} ${chapter}:${verse}`}
              content={`## Verse\n**${book} ${chapter}:${verse}**\n${verseText}\n\n## Room Analysis (${roomCode})\n${roomContent}\n\n## Discussion\n${messages.map(m => `**${m.role === 'user' ? 'You' : 'Jeeves'}:** ${m.content}`).join('\n\n')}`}
              metadata={{
                book,
                chapter,
                verse: `${verse}`,
                room: roomName,
              }}
              size="sm"
              variant="ghost"
            />
          )}
        </div>
        
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
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-xs font-semibold text-muted-foreground">
                        {msg.role === "user" ? "You" : "Jeeves"}
                      </div>
                      {msg.role === "assistant" && idx > 0 && (
                        <SaveJeevesResponseButton
                          question={messages[idx - 1]?.content || "Room insight question"}
                          response={msg.content}
                          context={`Room Insight - ${roomName} (${roomCode}) — ${book} ${chapter}:${verse}`}
                          variant="icon"
                          className="h-6 w-6"
                        />
                      )}
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
                  spellCheck={true}
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
