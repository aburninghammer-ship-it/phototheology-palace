import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { Bot, Sparkles, BookOpen, Dumbbell, Loader2, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JeevesAssistantProps {
  roomTag: string;
  roomName: string;
  principle: string;
  floorNumber: number;
  roomId: string;
  onExerciseComplete?: (type: string) => void;
}

export const JeevesAssistant = ({ 
  roomTag, 
  roomName, 
  principle,
  floorNumber,
  roomId,
  onExerciseComplete 
}: JeevesAssistantProps) => {
  const [loading, setLoading] = useState(false);
  const [exampleContent, setExampleContent] = useState<string | null>(null);
  const [exerciseContent, setExerciseContent] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchJeevesResponse = async (mode: "example" | "exercise") => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          roomTag,
          roomName,
          principle,
          mode,
        },
      });

      if (error) throw error;

      if (mode === "example") {
        setExampleContent(data.content);
        onExerciseComplete?.("example");
      } else {
        setExerciseContent(data.content);
        onExerciseComplete?.("exercise");
      }
    } catch (error: any) {
      console.error("Jeeves error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to get response from Jeeves",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const askJeeves = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "qa",
          roomTag,
          roomName,
          principle,
          question,
        },
      });
      if (error) throw error;
      setAnswer(data.answer);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to get answer",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="sticky top-24 shadow-elegant hover:shadow-hover transition-smooth border-2 border-primary/20">
      <CardHeader className="gradient-palace text-white">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="font-serif text-2xl flex items-center gap-2">
              Meet Jeeves
              <Sparkles className="h-5 w-5 animate-pulse-glow" />
            </CardTitle>
            <CardDescription className="text-white/90 font-medium">
              Your AI Bible Study Assistant
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <Tabs defaultValue="examples" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="examples">
              <BookOpen className="h-4 w-4 mr-2" />
              Examples
            </TabsTrigger>
            <TabsTrigger value="exercise">
              <Dumbbell className="h-4 w-4 mr-2" />
              Practice
            </TabsTrigger>
            <TabsTrigger value="qa">
              <HelpCircle className="h-4 w-4 mr-2" />
              Ask Jeeves
            </TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[450px]">
            <TabsContent value="examples" className="mt-0 space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-3">
                  Jeeves will demonstrate how <strong className="text-foreground">{principle}</strong> works 
                  with a real verse, providing fresh examples each time.
                </p>
                <Button
                  onClick={() => fetchJeevesResponse("example")}
                  disabled={loading}
                  className="w-full gradient-royal text-white shadow-blue"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Jeeves is thinking...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Show Me an Example
                    </>
                  )}
                </Button>
              </div>
              
              {exampleContent && (
                <div className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border-2 border-primary/30 animate-fade-in">
                  <div className="flex items-center gap-2 mb-3">
                    <Bot className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-foreground">Jeeves says:</span>
                  </div>
                  <div className="prose prose-sm max-w-none text-foreground">
                    {exampleContent.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="mb-3 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="exercise" className="mt-0 space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-3">
                  Practice applying <strong className="text-foreground">{principle}</strong> with 
                  a guided exercise. Jeeves will give you hints!
                </p>
                <Button
                  onClick={() => fetchJeevesResponse("exercise")}
                  disabled={loading}
                  className="w-full gradient-ocean text-white shadow-blue"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Preparing exercise...
                    </>
                  ) : (
                    <>
                      <Dumbbell className="h-4 w-4 mr-2" />
                      Start Practice Exercise
                    </>
                  )}
                </Button>
              </div>
              
              {exerciseContent && (
                <div className="p-4 bg-gradient-to-br from-accent/5 to-palace-orange/5 rounded-xl border-2 border-accent/30 animate-fade-in">
                  <div className="flex items-center gap-2 mb-3">
                    <Bot className="h-5 w-5 text-accent" />
                    <span className="font-semibold text-foreground">Practice Exercise:</span>
                  </div>
                  <div className="prose prose-sm max-w-none text-foreground">
                    {exerciseContent.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="mb-3 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="qa" className="mt-0 space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-3">
                  Ask Jeeves any question about <strong className="text-foreground">{roomName}</strong>
                </p>
                <div className="space-y-3">
                  <Input
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g., Find Christ in Genesis 5"
                    onKeyDown={(e) => e.key === 'Enter' && askJeeves()}
                    className="bg-background"
                  />
                  <Button
                    onClick={askJeeves}
                    disabled={loading || !question.trim()}
                    className="w-full gradient-forest text-white"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Thinking...
                      </>
                    ) : (
                      <>
                        <HelpCircle className="h-4 w-4 mr-2" />
                        Ask Jeeves
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {answer && (
                <div className="p-4 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-xl border-2 border-green-500/30 animate-fade-in">
                  <div className="flex items-center gap-2 mb-3">
                    <Bot className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-foreground">Jeeves answers:</span>
                  </div>
                  <div className="prose prose-sm max-w-none text-foreground">
                    {answer.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="mb-3 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
};
