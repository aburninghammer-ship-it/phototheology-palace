import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertTriangle, CheckCircle, Video, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { QuickAudioButton } from "@/components/audio";

interface AnalysisResult {
  videoType: "pro-SDA" | "anti-SDA";
  summary: string;
  mainClaims: Array<{
    claim: string;
    timestamp?: string;
    rebuttal: string;
  }>;
  logicalFallacies: Array<{
    fallacy: string;
    explanation: string;
    example: string;
  }>;
  biblicalResponses: Array<{
    topic: string;
    response: string;
    verses: string[];
  }>;
  additionalNotes: string;
}

export default function CriticsAnalysis() {
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [jeevesLoading, setJeevesLoading] = useState(false);
  const [jeevesContent, setJeevesContent] = useState<{ example?: string; exercise?: string }>({});
  
  const fetchJeevesContent = async (mode: "example" | "exercise") => {
    setJeevesLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: { 
          room: {
            name: "Critical Analysis",
            tag: "CA",
            purpose: "Defend Seventh-day Adventist theology against critics using biblical evidence, historical apologetics, scientific harmony, and philosophical reasoning.",
            coreQuestion: "How do we respond to anti-SDA arguments with robust biblical and apologetic defense?",
            method: "Extract specific claims from critics → Provide detailed biblical rebuttals with 4-6 verses → Identify logical fallacies → Apply apologetics frameworks (biblical, historical, scientific, philosophical) → Show superior explanatory power of SDA interpretation"
          },
          mode 
        }
      });

      if (error) throw error;
      
      setJeevesContent(prev => ({
        ...prev,
        [mode]: data.content
      }));
      
      toast.success(`${mode === "example" ? "Example" : "Exercise"} loaded!`);
    } catch (error: any) {
      console.error("Jeeves error:", error);
      toast.error(error.message || "Failed to load content");
    } finally {
      setJeevesLoading(false);
    }
  };

  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleAnalyze = async () => {
    if (!videoUrl.trim()) {
      toast.error("Please enter a YouTube URL");
      return;
    }

    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      toast.error("Invalid YouTube URL");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-critic-video", {
        body: { videoUrl: videoUrl.trim() }
      });

      if (error) throw error;

      setAnalysis(data.analysis);
      toast.success("Analysis complete!");
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast.error(error.message || "Failed to analyze video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
            <Video className="w-8 h-8" />
            Critics Analysis
          </h1>
          <p className="text-muted-foreground">
            Jeeves analyzes videos to defend Seventh-day Adventist theology and debunk anti-SDA critics with biblical evidence and sound doctrine.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Analyze Video</CardTitle>
            <CardDescription>
              Enter a YouTube video URL to receive a detailed SDA apologetic analysis defending biblical truth against critics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                disabled={loading}
              />
              <Button onClick={handleAnalyze} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Jeeves Apologetics Assistant
            </CardTitle>
            <CardDescription>
              Get examples and practice exercises for defending SDA theology against critics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="examples" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="examples">Examples</TabsTrigger>
                <TabsTrigger value="practice">Practice</TabsTrigger>
              </TabsList>
              
              <TabsContent value="examples" className="space-y-4">
                {!jeevesContent.example ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Get a detailed example of how to respond to a common anti-SDA argument
                    </p>
                    <Button 
                      onClick={() => fetchJeevesContent("example")}
                      disabled={jeevesLoading}
                    >
                      {jeevesLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "Get Example"
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Example Response</span>
                      <QuickAudioButton text={jeevesContent.example || ""} variant="ghost" size="sm" />
                    </div>
                    <div className="whitespace-pre-wrap bg-muted/50 p-4 rounded-lg">
                      {jeevesContent.example}
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => fetchJeevesContent("example")}
                      disabled={jeevesLoading}
                      className="mt-4"
                    >
                      Get Another Example
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="practice" className="space-y-4">
                {!jeevesContent.exercise ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Practice defending SDA doctrine with a challenging exercise
                    </p>
                    <Button 
                      onClick={() => fetchJeevesContent("exercise")}
                      disabled={jeevesLoading}
                    >
                      {jeevesLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "Get Exercise"
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Practice Exercise</span>
                      <QuickAudioButton text={jeevesContent.exercise || ""} variant="ghost" size="sm" />
                    </div>
                    <div className="whitespace-pre-wrap bg-muted/50 p-4 rounded-lg">
                      {jeevesContent.exercise}
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => fetchJeevesContent("exercise")}
                      disabled={jeevesLoading}
                      className="mt-4"
                    >
                      Get Another Exercise
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {analysis && (
          <Tabs defaultValue="summary" className="w-full">
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
              <TabsList className="inline-flex min-w-full md:w-auto">
                <TabsTrigger value="summary" className="flex-1 md:flex-initial">Summary</TabsTrigger>
                <TabsTrigger value="claims" className="flex-1 md:flex-initial">Claims & Rebuttals</TabsTrigger>
                <TabsTrigger value="fallacies" className="flex-1 md:flex-initial">Logical Fallacies</TabsTrigger>
                <TabsTrigger value="biblical" className="flex-1 md:flex-initial">Biblical Responses</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="summary" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      Video Summary
                      <Badge variant={
                        analysis.videoType === "pro-SDA" ? "default" : "destructive"
                      }>
                        {analysis.videoType === "pro-SDA" ? "Pro-SDA" : "Anti-SDA"}
                      </Badge>
                    </div>
                    <QuickAudioButton text={analysis.summary} variant="ghost" size="sm" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{analysis.summary}</p>
                </CardContent>
              </Card>
              
              {analysis.additionalNotes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Additional Notes
                      <QuickAudioButton text={analysis.additionalNotes} variant="ghost" size="sm" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{analysis.additionalNotes}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="claims" className="space-y-4">
              {analysis.mainClaims.map((claim, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">Claim #{idx + 1}</CardTitle>
                      {claim.timestamp && (
                        <Badge variant="outline">{claim.timestamp}</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                        Claim:
                      </h4>
                      <p className="text-muted-foreground">{claim.claim}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Rebuttal:
                      </h4>
                      <p className="whitespace-pre-wrap">{claim.rebuttal}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="fallacies" className="space-y-4">
              {analysis.logicalFallacies.map((fallacy, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Badge variant="destructive">{fallacy.fallacy}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Explanation:</h4>
                      <p className="text-muted-foreground">{fallacy.explanation}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Example from Video:</h4>
                      <p className="italic">{fallacy.example}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="biblical" className="space-y-4">
              {analysis.biblicalResponses.map((response, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-lg">{response.topic}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="whitespace-pre-wrap mb-4">{response.response}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Supporting Verses:</h4>
                      <div className="flex flex-wrap gap-2">
                        {response.verses.map((verse, vIdx) => (
                          <Badge key={vIdx} variant="secondary">
                            {verse}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}
