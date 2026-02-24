import { useState } from "react";
import { useTranslation } from "react-i18next";
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
import { cn } from "@/lib/utils";

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
  level: "easy" | "intermediate" | "pro" | "master";
}

export default function BranchStudy() {
  const { t } = useTranslation();
  const [verseReference, setVerseReference] = useState("");
  const [userInput, setUserInput] = useState("");
  const [studyState, setStudyState] = useState<StudyState>({
    usedVerses: [],
    usedRooms: [],
    messages: [],
    mode: "traditional",
    level: "easy",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { handleError } = useErrorHandler();

  const startStudy = async () => {
    if (!verseReference.trim()) {
      toast({
        title: t('branchStudy.verseRequired'),
        description: t('branchStudy.pleaseEnterVerse'),
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
          level: studyState.level,
        },
      });

      if (error) throw error;
      
      // Check for validation error (hallucinated principles)
      if (data?.error && data?.invalidPrinciples) {
        console.log("🔄 Hallucination detected on start, auto-retrying...");
        toast({
          title: t('branchStudy.regeneratingResponse'),
          description: t('branchStudy.jeevesError'),
        });
        
        // Auto-retry once
        const { data: retryData, error: retryError } = await supabase.functions.invoke("jeeves", {
          body: {
            mode: "branch_study",
            action: "start",
            verseReference: verseReference.trim(),
            studyMode: studyState.mode,
            level: studyState.level,
          },
        });
        
        if (retryError) throw retryError;
        if (!retryData || retryData.error) {
          throw new Error(retryData?.error || "Failed after retry");
        }
        
        const content = retryData.content || retryData.response;
        if (!content) throw new Error("No response after retry");
        
        console.log("✅ Start retry successful");
        setStudyState({
          anchorText: verseReference.trim(),
          usedVerses: [verseReference.trim()],
          usedRooms: [],
          messages: [{ role: "assistant", content }],
          mode: studyState.mode,
          level: studyState.level,
        });
        return;
      }
      
      if (!data || data.error) throw new Error(data?.error || "No response from Jeeves");

      const content = data.content || data.response;
      if (!content) throw new Error("Jeeves did not provide a response");

      setStudyState({
        anchorText: verseReference.trim(),
        usedVerses: [verseReference.trim()],
        usedRooms: [],
        messages: [{ role: "assistant", content }],
        mode: studyState.mode,
        level: studyState.level,
      });
    } catch (error: any) {
      handleError(error, { title: t('branchStudy.failedToStart'), showToast: true });
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
          level: studyState.level,
        },
      });

      if (error) throw error;
      
      // Check for validation error (hallucinated principles)
      if (data?.error && data?.invalidPrinciples) {
        console.log("🔄 Hallucination detected, auto-retrying...");
        toast({
          title: t('branchStudy.regeneratingResponse'),
          description: t('branchStudy.jeevesError'),
        });
        
        // Auto-retry once
        const { data: retryData, error: retryError } = await supabase.functions.invoke("jeeves", {
          body: {
            mode: "branch_study",
            action,
            anchorText: studyState.anchorText,
            userResponse: userMessage.content,
            usedVerses: studyState.usedVerses,
            usedRooms: studyState.usedRooms,
            conversationHistory: studyState.messages,
            studyMode: studyState.mode,
            level: studyState.level,
          },
        });
        
        if (retryError) throw retryError;
        if (!retryData || retryData.error) {
          throw new Error(retryData?.error || "Failed after retry");
        }
        
        // Use retry data
        const content = retryData.content || retryData.response;
        if (!content) throw new Error("No response after retry");
        
        console.log("✅ Retry successful");
        setStudyState((prev) => ({
          ...prev,
          messages: [...prev.messages, { role: "assistant", content }],
          usedVerses: retryData.usedVerses || prev.usedVerses,
          usedRooms: retryData.usedRooms || prev.usedRooms,
        }));
        return;
      }
      
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
      handleError(error, { title: t('branchStudy.failedToContinue'), showToast: true });
    } finally {
      setLoading(false);
    }
  };

  const resetStudy = () => {
    setStudyState({ usedVerses: [], usedRooms: [], messages: [], mode: "traditional", level: "easy" });
    setVerseReference("");
    setUserInput("");
  };

  const parseOptions = (content: string): { type: "verse" | "principle"; options: Array<{ label: string; content: string }> } | null => {
    // Match options: "A. Genesis 22:8" or "A. Cross-reference verses"
    const optionRegex = /^([A-E])\.\s+(.+?)(?=\n[A-E]\.|$)/gms;
    const matches = Array.from(content.matchAll(optionRegex));
    
    console.log(`🔍 Found ${matches.length} options in content`);
    
    // Accept 2 options (A/B branch) or 5 options (final choices)
    if (matches.length !== 2 && matches.length !== 5) {
      return null;
    }
    
    const options = matches.map(match => ({
      label: match[1],
      content: match[2].trim()
    }));
    
    // Detect type: verses have chapter:verse, principles have room codes or descriptive text
    const firstContent = options[0].content.toLowerCase();
    const isVerse = /\d+:\d+/.test(options[0].content) || /^[1-3]?\s*[A-Z][a-z]+\s+\d+/.test(options[0].content);
    const isBranch = firstContent.includes('verse') || firstContent.includes('principle');
    
    console.log(`✨ Parsed ${matches.length} options (type: ${isBranch ? 'branch' : isVerse ? 'verse' : 'principle'})`);
    
    return {
      type: isBranch ? "principle" : isVerse ? "verse" : "principle",
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
              {t('branchStudy.pageTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!studyState.anchorText ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t('branchStudy.enterVerseLabel')}
                  </label>
                  <Input
                    placeholder={t('branchStudy.versePlaceholder')}
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
                      <div className="font-medium">{t('branchStudy.jeevesLedMode')}</div>
                      <div className="text-xs text-muted-foreground">
                        {t('branchStudy.jeevesLedModeDesc')}
                      </div>
                    </div>
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t('branchStudy.difficultyLevel')}</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['easy', 'intermediate', 'pro', 'master'] as const).map((lvl) => (
                      <Button
                        key={lvl}
                        type="button"
                        variant={studyState.level === lvl ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setStudyState((prev) => ({ ...prev, level: lvl }))}
                        className="capitalize"
                      >
                        {lvl}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {studyState.level === 'easy' && t('branchStudy.levelEasyDesc')}
                    {studyState.level === 'intermediate' && t('branchStudy.levelIntermediateDesc')}
                    {studyState.level === 'pro' && t('branchStudy.levelProDesc')}
                    {studyState.level === 'master' && t('branchStudy.levelMasterDesc')}
                  </p>
                </div>
                
                <Button onClick={startStudy} disabled={loading || !verseReference.trim()} className="w-full">
                  {loading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('branchStudy.startingStudy')}</>
                  ) : (
                    <><BookOpen className="mr-2 h-4 w-4" />{t('branchStudy.beginBranchStudy')}</>

                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{t('branchStudy.studying', { text: studyState.anchorText })}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('branchStudy.mode', { mode: studyState.mode === "jeeves-led" ? t('branchStudy.jeevesLed') : t('branchStudy.traditional') })}
                    </p>
                  </div>
                  <Button variant="outline" onClick={resetStudy}>{t('branchStudy.newStudy')}</Button>
                </div>

                <ScrollArea className="h-[600px] border rounded-lg p-6 bg-gradient-to-b from-background to-muted/20">
                  <div className="space-y-6">
                    {studyState.messages.map((msg, idx) => {
                      const parsedOptions = msg.role === "assistant" ? parseOptions(msg.content) : null;
                      
                      if (parsedOptions) {
                        console.log("✅ Displaying option cards for message:", idx, parsedOptions);
                      }
                      
                      return (
                        <div key={idx} className="animate-in fade-in slide-in-from-bottom-2">
                          <div className={cn(
                            "p-5 rounded-xl shadow-sm",
                            msg.role === "user" 
                              ? "bg-primary text-primary-foreground ml-12" 
                              : "bg-card border-2 mr-12"
                          )}>
                            {parsedOptions ? (
                              <div className="space-y-6">
                                <div className="prose prose-sm max-w-none">
                                  {formatJeevesResponse(msg.content.split(/^[A-E]\./m)[0])}
                                </div>
                                <div className="border-t pt-4">
                                  <h4 className="text-lg font-semibold mb-4 text-center">{t('branchStudy.chooseYourPath')}</h4>
                                  <OptionCards
                                    options={parsedOptions.options}
                                    onSelect={handleOptionSelect}
                                    type={parsedOptions.type}
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="prose prose-sm max-w-none">
                                {formatJeevesResponse(msg.content)}
                              </div>
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
                    placeholder={t('branchStudy.responsePlaceholder')}
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
                  <p>{t('branchStudy.usedStats', { verses: studyState.usedVerses.length, rooms: studyState.usedRooms.length })}</p>
                  <p>{t('branchStudy.endInstructions')}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
