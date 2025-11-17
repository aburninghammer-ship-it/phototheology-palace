import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, BookOpen, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatJeevesResponse } from "@/lib/formatJeevesResponse";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface StudyState {
  anchorText?: string;
  usedVerses: string[];
  usedRooms: string[];
  messages: Message[];
}

export default function BranchStudy() {
  const [verseReference, setVerseReference] = useState("");
  const [userInput, setUserInput] = useState("");
  const [studyState, setStudyState] = useState<StudyState>({
    usedVerses: [],
    usedRooms: [],
    messages: [],
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const startStudy = async () => {
    if (!verseReference.trim()) {
      toast({
        title: "Verse Required",
        description: "Please enter a verse reference to begin",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "branch_study",
          action: "start",
          verseReference: verseReference.trim(),
        },
      });

      if (error) throw error;
      
      console.log("BranchStudy start response:", data);

      setStudyState({
        anchorText: verseReference.trim(),
        usedVerses: [verseReference.trim()],
        usedRooms: [],
        messages: [
          {
            role: "assistant",
            content: data.content || data.response, // Support both field names
          },
        ],
      });
    } catch (error: any) {
      console.error("Error starting study:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to start study",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!userInput.trim() || !studyState.anchorText) return;

    const userMessage: Message = {
      role: "user",
      content: userInput.trim(),
    };

    setStudyState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }));

    setUserInput("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "branch_study",
          action: "continue",
          anchorText: studyState.anchorText,
          usedVerses: studyState.usedVerses,
          usedRooms: studyState.usedRooms,
          userResponse: userInput.trim(),
          conversationHistory: studyState.messages,
        },
      });

      if (error) throw error;
      
      console.log("BranchStudy continue response:", data);

      // Track new verses and rooms from the response
      const newUsedVerses = [...studyState.usedVerses];
      const newUsedRooms = [...studyState.usedRooms];

      if (data.usedVerse) newUsedVerses.push(data.usedVerse);
      if (data.usedRoom) newUsedRooms.push(data.usedRoom);

      setStudyState((prev) => ({
        ...prev,
        usedVerses: newUsedVerses,
        usedRooms: newUsedRooms,
        messages: [
          ...prev.messages,
          {
            role: "assistant",
            content: data.content || data.response, // Support both field names
          },
        ],
      }));
    } catch (error: any) {
      console.error("Error in study:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to process response",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetStudy = () => {
    setStudyState({
      usedVerses: [],
      usedRooms: [],
      messages: [],
    });
    setVerseReference("");
    setUserInput("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <BookOpen className="h-6 w-6" />
              BranchStudy: Interactive Bible Exposition
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Explore Scripture through branching paths of cross-references and
              Phototheology principles. Start with a verse or story (e.g., "Parable of the Good Samaritan"),
              respond to questions, and choose your next step.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {studyState.messages.length === 0 ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Enter Verse Reference or Story Name
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={verseReference}
                      onChange={(e) => setVerseReference(e.target.value)}
                      placeholder="John 3:16 or 'Parable of the Wheat and Tares'"
                      onKeyDown={(e) => e.key === "Enter" && startStudy()}
                    />
                    <Button onClick={startStudy} disabled={loading}>
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Begin Study"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">
                    Anchor: {studyState.anchorText}
                  </h3>
                  <Button variant="outline" size="sm" onClick={resetStudy}>
                    Start New Study
                  </Button>
                </div>

                <ScrollArea className="h-[500px] border rounded-lg p-4">
                  <div className="space-y-4">
                    {studyState.messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg ${
                          msg.role === "user"
                            ? "bg-primary/10 ml-8"
                            : "bg-muted mr-8"
                        }`}
                      >
                        <div className="font-semibold text-xs mb-2 text-muted-foreground uppercase">
                          {msg.role === "user" ? "You" : "Jeeves"}
                        </div>
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          {formatJeevesResponse(msg.content)}
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Jeeves is thinking...</span>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <div className="flex gap-2">
                  <Textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type your response or choose an option (A, B, or C)..."
                    className="min-h-[80px]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={loading || !userInput.trim()}
                    size="icon"
                    className="h-[80px] w-[80px]"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>
                    <strong>Path tracked:</strong> {studyState.usedVerses.length}{" "}
                    verses, {studyState.usedRooms.length} rooms
                  </p>
                  <p>
                    Type "summarize", "end", or "turn this into a study" to
                    conclude
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
