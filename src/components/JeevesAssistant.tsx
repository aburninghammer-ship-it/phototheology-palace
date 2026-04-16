import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { Bot, Sparkles, BookOpen, Dumbbell, Loader2, HelpCircle, Brain, Star, TrendingUp, Building2, BookMarked, CheckCircle2, Lightbulb, Mic } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatJeevesResponse } from "@/lib/formatJeevesResponse";
import { QuickAudioButton } from "@/components/audio";
import { getFirstName } from "@/utils/userNameUtils";
import { VoiceInput } from "@/components/analyze/VoiceInput";

interface JeevesAssistantProps {
  roomTag: string;
  roomName: string;
  principle: string;
  floorNumber: number;
  roomId: string;
  onExerciseComplete?: (type: string) => void;
}

interface AnalysisResult {
  overallScore: number;
  categories: {
    biblicalAccuracy: number;
    depthOfInsight: number;
    christCenteredness: number;
    ptApplication: number;
  };
  strengths: (string | { point: string; expansion?: string })[];
  growthAreas: (string | { point: string; expansion?: string })[];
  palaceMapping: {
    primaryRoom: string;
    relatedRooms: string[];
    floorRecommendation: string;
  };
  scriptureConnections: {
    reference: string;
    connection: string;
  }[];
  encouragement: string;
}

// Helper to normalize strength/growth items that may be strings or objects
const normalizeAnalysisItem = (item: string | { point: string; expansion?: string }): string => {
  if (typeof item === 'string') {
    return item;
  }
  return item.point || '';
};

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
  const [userThoughts, setUserThoughts] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const fetchJeevesResponse = async (mode: "example" | "exercise") => {
    setLoading(true);
    try {
      // Get user profile to pass name to Jeeves
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = user ? await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single() : { data: null };

      const userName = getFirstName(profile?.display_name);

      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          roomTag,
          roomName,
          principle,
          mode,
          userName,
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
      // Get user profile to pass name to Jeeves
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = user ? await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single() : { data: null };

      const userName = getFirstName(profile?.display_name);

      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "qa",
          roomTag,
          roomName,
          principle,
          question,
          userName,
        },
      });
      if (error) throw error;
      setAnswer(data.content);
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

  const analyzeThoughts = async () => {
    if (!userThoughts.trim()) return;
    setLoading(true);
    try {
      // Get user profile to pass name to Jeeves
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = user ? await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single() : { data: null };

      const userName = getFirstName(profile?.display_name);

      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "analyze-thoughts",
          roomTag,
          roomName,
          principle,
          userAnswer: userThoughts,
          userName,
        },
      });
      if (error) throw error;
      setAnalysisResult(data.analysis);
      onExerciseComplete?.("analyze");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to analyze your thoughts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-orange-500";
  };

  const renderStars = (score: number) => {
    const stars = [];
    const fullStars = Math.floor(score / 2);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${i < fullStars ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
        />
      );
    }
    return stars;
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
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="examples" className="text-xs px-2">
              <BookOpen className="h-4 w-4 mr-1" />
              Examples
            </TabsTrigger>
            <TabsTrigger value="exercise" className="text-xs px-2">
              <Dumbbell className="h-4 w-4 mr-1" />
              Practice
            </TabsTrigger>
            <TabsTrigger value="analyze" className="text-xs px-2">
              <Brain className="h-4 w-4 mr-1" />
              Analyze
            </TabsTrigger>
            <TabsTrigger value="qa" className="text-xs px-2">
              <HelpCircle className="h-4 w-4 mr-1" />
              Ask
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
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-foreground">Jeeves says:</span>
                    </div>
                    <QuickAudioButton text={exampleContent} variant="ghost" size="sm" />
                  </div>
                  <div className="prose prose-sm max-w-none text-foreground">
                    {formatJeevesResponse(exampleContent)}
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
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-accent" />
                      <span className="font-semibold text-foreground">Practice Exercise:</span>
                    </div>
                    <QuickAudioButton text={exerciseContent} variant="ghost" size="sm" />
                  </div>
                  <div className="prose prose-sm max-w-none text-foreground">
                    {formatJeevesResponse(exerciseContent)}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="analyze" className="mt-0 space-y-4">
              <div className="p-4 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-lg border border-violet-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-5 w-5 text-violet-600" />
                  <h3 className="font-semibold text-foreground">Analyze My Thoughts</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Share your biblical ideas, concepts, or answers. Jeeves will rate your insight and provide detailed feedback with scripture connections.
                </p>
                <div className="space-y-3">
                  <div className="relative">
                    <Textarea
                      value={userThoughts}
                      onChange={(e) => setUserThoughts(e.target.value)}
                      placeholder="Share your biblical insight, connection, or concept here... For example: 'I think the bronze serpent in Numbers 21 is a type of Christ being lifted up on the cross...'"
                      className="bg-background min-h-[120px] resize-none pr-12"
                    />
                    <div className="absolute bottom-3 right-3">
                      <VoiceInput 
                        onTranscript={(text) => setUserThoughts(prev => prev + (prev ? " " : "") + text)} 
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={analyzeThoughts}
                    disabled={loading || !userThoughts.trim()}
                    className="w-full bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-600 hover:to-purple-600"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing your thoughts...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Analyze My Thoughts
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {analysisResult && (
                <div className="space-y-3 animate-fade-in">
                  {/* Overall Score Card */}
                  <Card className="border-2 border-violet-500/30 bg-gradient-to-br from-violet-500/5 to-purple-500/5">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                          <span className="font-semibold">Overall Score</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-2xl font-bold ${getScoreColor(analysisResult.overallScore)}`}>
                            {analysisResult.overallScore}/10
                          </span>
                          <div className="flex">{renderStars(analysisResult.overallScore)}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between p-2 bg-background/50 rounded">
                          <span className="text-muted-foreground">Biblical Accuracy</span>
                          <span className={`font-semibold ${getScoreColor(analysisResult.categories.biblicalAccuracy)}`}>
                            {analysisResult.categories.biblicalAccuracy}/10
                          </span>
                        </div>
                        <div className="flex justify-between p-2 bg-background/50 rounded">
                          <span className="text-muted-foreground">Depth of Insight</span>
                          <span className={`font-semibold ${getScoreColor(analysisResult.categories.depthOfInsight)}`}>
                            {analysisResult.categories.depthOfInsight}/10
                          </span>
                        </div>
                        <div className="flex justify-between p-2 bg-background/50 rounded">
                          <span className="text-muted-foreground">Christ-Centeredness</span>
                          <span className={`font-semibold ${getScoreColor(analysisResult.categories.christCenteredness)}`}>
                            {analysisResult.categories.christCenteredness}/10
                          </span>
                        </div>
                        <div className="flex justify-between p-2 bg-background/50 rounded">
                          <span className="text-muted-foreground">PT Application</span>
                          <span className={`font-semibold ${getScoreColor(analysisResult.categories.ptApplication)}`}>
                            {analysisResult.categories.ptApplication}/10
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Strengths Card */}
                  <Card className="border border-green-500/30 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span className="font-semibold text-green-700">Strengths</span>
                      </div>
                      <ul className="space-y-2">
                        {analysisResult.strengths.map((strength, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-green-600 mt-0.5">•</span>
                            <span>{normalizeAnalysisItem(strength)}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Growth Areas Card */}
                  <Card className="border border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="h-5 w-5 text-amber-600" />
                        <span className="font-semibold text-amber-700">Areas for Growth</span>
                      </div>
                      <ul className="space-y-2">
                        {analysisResult.growthAreas.map((area, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-amber-600 mt-0.5">•</span>
                            <span>{normalizeAnalysisItem(area)}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Palace Room Mapping Card */}
                  {analysisResult.palaceMapping && analysisResult.palaceMapping.primaryRoom && (
                    <Card className="border border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Building2 className="h-5 w-5 text-primary" />
                          <span className="font-semibold">Palace Room Mapping</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="p-2 bg-background/50 rounded">
                            <span className="text-muted-foreground">Primary Room: </span>
                            <span className="font-medium text-primary">{analysisResult.palaceMapping.primaryRoom}</span>
                          </div>
                          <div className="p-2 bg-background/50 rounded">
                            <span className="text-muted-foreground">Related Rooms: </span>
                            <span className="font-medium">{analysisResult.palaceMapping.relatedRooms?.join(", ") || "None"}</span>
                          </div>
                          {analysisResult.palaceMapping.floorRecommendation && (
                            <div className="p-2 bg-background/50 rounded">
                              <span className="text-muted-foreground">Floor Recommendation: </span>
                              <span className="font-medium">{analysisResult.palaceMapping.floorRecommendation}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Scripture Connections Card */}
                  {analysisResult.scriptureConnections && analysisResult.scriptureConnections.length > 0 && (
                    <Card className="border border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 mb-3">
                          <BookMarked className="h-5 w-5 text-blue-600" />
                          <span className="font-semibold text-blue-700">Scripture Connections</span>
                        </div>
                        <div className="space-y-2">
                          {analysisResult.scriptureConnections.map((scripture, idx) => (
                            <div key={idx} className="p-2 bg-background/50 rounded text-sm">
                              <span className="font-semibold text-blue-600">{scripture.reference}</span>
                              <span className="text-muted-foreground"> — {scripture.connection}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Encouragement Card */}
                  {analysisResult.encouragement && (
                    <Card className="border border-pink-500/30 bg-gradient-to-br from-pink-500/5 to-rose-500/5">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Lightbulb className="h-5 w-5 text-pink-600" />
                          <span className="font-semibold text-pink-700">Encouragement</span>
                        </div>
                        <p className="text-sm italic">{analysisResult.encouragement}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="qa" className="mt-0 space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-3">
                  Ask Jeeves any question about <strong className="text-foreground">{roomName}</strong>
                </p>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="e.g., Find Christ in Genesis 5"
                      onKeyDown={(e) => e.key === 'Enter' && askJeeves()}
                      className="bg-background flex-1"
                    />
                    <VoiceInput 
                      onTranscript={(text) => setQuestion(prev => prev + (prev ? " " : "") + text)} 
                      disabled={loading}
                    />
                  </div>
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
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-foreground">Jeeves answers:</span>
                    </div>
                    <QuickAudioButton text={answer} variant="ghost" size="sm" />
                  </div>
                  <div className="prose prose-sm max-w-none text-foreground">
                    {formatJeevesResponse(answer)}
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