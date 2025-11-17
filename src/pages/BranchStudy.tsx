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
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { formatJeevesResponse } from "@/lib/formatJeevesResponse";
import { JeevesResponseValidator } from "@/components/bible/JeevesResponseValidator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { OptionCards } from "@/components/branch-study/OptionCards";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface StudyState {
  anchorText?: string;
  usedVerses: string[];
  usedRooms: string[];
  messages: Message[];
  mode: "traditional" | "jeeves-led";
}

export default function BranchStudy() {
  const [verseReference, setVerseReference] = useState("");
  const [userInput, setUserInput] = useState("");
  const [studyState, setStudyState] = useState<StudyState>({
    usedVerses: [],
    usedRooms: [],
    messages: [],
    mode: "traditional",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { handleError } = useErrorHandler();

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
          studyMode: studyState.mode,
        },
      });

      if (error) throw error;
      if (!data || data.error) throw new Error(data?.error || "No response from Jeeves");

      const content = data.content || data.response;
      if (!content) throw new Error("Jeeves did not provide a response");

      setStudyState({
        anchorText: verseReference.trim(),
        usedVerses: [verseReference.trim()],
        usedRooms: [],
        messages: [{ role: "assistant", content }],
        mode: studyState.mode,
      });
    } catch (error: any) {
      handleError(error, { title: "Failed to Start Study", showToast: true });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!userInput.trim() || !studyState.anchorText) return;

    const isOptionSelection = /^[ABCDE]$/i.test(userInput.trim());
    const userMessage: Message = { role: "user", content: userInput.trim() };

    setStudyState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }));

    setUserInput("");
    setLoading(true);

    try {
      // Determine action based on input
      const action = isOptionSelection ? "select_option" : "continue";
      
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "branch_study",
          action,
          anchorText: studyState.anchorText,
          userResponse: userMessage.content,
          usedVerses: studyState.usedVerses,
          usedRooms: studyState.usedRooms,
          conversationHistory: studyState.messages,
          studyMode: studyState.mode,
        },
      });

      if (error) throw error;
      if (!data || data.error) throw new Error(data?.error || "No response");

      const content = data.content || data.response;
      if (!content) throw new Error("Jeeves did not provide a response");
      
      console.log("📨 Jeeves response:", content.substring(0, 200));

      setStudyState((prev) => ({
        ...prev,
        messages: [...prev.messages, { role: "assistant", content }],
        usedVerses: data.usedVerses || prev.usedVerses,
        usedRooms: data.usedRooms || prev.usedRooms,
      }));
    } catch (error: any) {
      handleError(error, { title: "Failed to Continue Study", showToast: true });
    } finally {
      setLoading(false);
    }
  };

  const resetStudy = () => {
    setStudyState({ usedVerses: [], usedRooms: [], messages: [], mode: "traditional" });
    setVerseReference("");
    setUserInput("");
  };

  const parseOptions = (content: string): { type: "verse" | "principle"; options: Array<{ label: string; content: string }> } | null => {
    // Look for options formatted as "A. Genesis 22:8" or "A. CR (Concentration)"
    const optionRegex = /^([A-E])\.\s+([^\n]+)/gm;
    const matches = Array.from(content.matchAll(optionRegex));
    
    // Only parse if we have exactly 5 options (the final verse/principle choices)
    if (matches.length !== 5) {
      console.log(`Found ${matches.length} options, need exactly 5`);
      return null;
    }
    
    const options = matches.map(match => ({
      label: match[1],
      content: match[2].trim()
    }));
    
    // Detect type based on content
    const firstContent = options[0].content;
    const isVerse = /\d+:\d+/.test(firstContent) || /^[1-3]?\s*[A-Z][a-z]+\s+\d+/.test(firstContent);
    
    console.log(`Parsed 5 ${isVerse ? 'verse' : 'principle'} options:`, options);
    
    return {
      type: isVerse ? "verse" : "principle",
      options
    };
  };

  const handleOptionSelect = (label: string) => {
    setUserInput(label);
    setTimeout(() => sendMessage(), 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto p-4 pt-20">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              BranchStudy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!studyState.anchorText ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Enter a verse reference or story name
                  </label>
                  <Input
                    placeholder="e.g., John 3:16 or Parable of the Sower"
                    value={verseReference}
                    onChange={(e) => setVerseReference(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && !loading && startStudy()}
                    disabled={loading}
                  />
                </div>
                
                <div className="flex items-center space-x-2 p-4 bg-muted rounded-lg">
                  <Switch
                    id="study-mode"
                    checked={studyState.mode === "jeeves-led"}
                    onCheckedChange={(checked) =>
                      setStudyState((prev) => ({ ...prev, mode: checked ? "jeeves-led" : "traditional" }))
                    }
                  />
                  <Label htmlFor="study-mode" className="cursor-pointer">
                    <div>
                      <div className="font-medium">Jeeves-Led Study Mode</div>
                      <div className="text-xs text-muted-foreground">
                        Jeeves does most of the studying and shares insights with you
                      </div>
                    </div>
                  </Label>
                </div>
                
                <Button onClick={startStudy} disabled={loading || !verseReference.trim()} className="w-full">
                  {loading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Starting Study...</>
                  ) : (
                    <><BookOpen className="mr-2 h-4 w-4" />Begin BranchStudy</>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">Studying: {studyState.anchorText}</h3>
                    <p className="text-sm text-muted-foreground">
                      Mode: {studyState.mode === "jeeves-led" ? "Jeeves-Led" : "Traditional"}
                    </p>
                  </div>
                  <Button variant="outline" onClick={resetStudy}>New Study</Button>
                </div>

                <ScrollArea className="h-[500px] border rounded-lg p-4">
                  <div className="space-y-4">
                    {studyState.messages.map((msg, idx) => {
                      const parsedOptions = msg.role === "assistant" ? parseOptions(msg.content) : null;
                      
                      if (parsedOptions) {
                        console.log("✅ Displaying option cards for message:", idx);
                      }
                      
                      return (
                        <div key={idx}>
                          <div className={`p-4 rounded-lg ${msg.role === "user" ? "bg-primary text-primary-foreground ml-8" : "bg-muted mr-8"}`}>
                            {parsedOptions ? (
                              <div className="space-y-4">
                                <div>{formatJeevesResponse(msg.content.split(/^[A-E]\./m)[0])}</div>
                                <OptionCards
                                  options={parsedOptions.options}
                                  onSelect={handleOptionSelect}
                                  type={parsedOptions.type}
                                />
                              </div>
                            ) : (
                              formatJeevesResponse(msg.content)
                            )}
                          </div>
                          {msg.role === "assistant" && <JeevesResponseValidator response={msg.content} />}
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>

                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your response or choose A/B/C..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && !loading && (e.preventDefault(), sendMessage())}
                    disabled={loading}
                    rows={3}
                  />
                  <Button onClick={sendMessage} disabled={loading || !userInput.trim()} size="icon" className="self-end">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Used: {studyState.usedVerses.length} verses, {studyState.usedRooms.length} rooms</p>
                  <p>Type "summarize", "end", or "turn this into a study" to conclude</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
