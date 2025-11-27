import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Lightbulb, Send, BookOpen, Target, TrendingUp, Sparkles, Building2, Link2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AnalysisResult {
  overall_score: number;
  categories: {
    biblical_accuracy: number;
    theological_depth: number;
    christ_centeredness: number;
    practical_application: number;
  };
  strengths: string[];
  growth_areas: string[];
  palace_rooms: {
    code: string;
    name: string;
    relevance: string;
  }[];
  scripture_connections: {
    reference: string;
    connection: string;
  }[];
  encouragement: string;
}

const AnalyzeThoughts = () => {
  const [input, setInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!input.trim()) {
      toast.error("Please enter your thoughts to analyze");
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('jeeves', {
        body: {
          mode: 'analyze-thoughts',
          message: input
        }
      });

      if (error) throw error;

      // Parse the response
      let analysisResult: AnalysisResult;
      if (typeof data.response === 'string') {
        try {
          analysisResult = JSON.parse(data.response);
        } catch {
          // If parsing fails, create a default structure
          analysisResult = {
            overall_score: 75,
            categories: {
              biblical_accuracy: 70,
              theological_depth: 75,
              christ_centeredness: 80,
              practical_application: 75
            },
            strengths: ["Good foundational understanding"],
            growth_areas: ["Consider deeper connections"],
            palace_rooms: [{ code: "CR", name: "Concentration Room", relevance: "Central to Christ-centered thinking" }],
            scripture_connections: [{ reference: "John 5:39", connection: "All Scripture testifies of Christ" }],
            encouragement: data.response
          };
        }
      } else {
        analysisResult = data.response;
      }

      setResult(analysisResult);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error("Failed to analyze. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-orange-500";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-orange-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Lightbulb className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-serif font-bold">Analyze My Thoughts</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Share your biblical ideas, interpretations, or answers and receive feedback on your theological thinking, 
            connections to Palace principles, and Scripture references.
          </p>
        </div>

        {/* Input Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Share Your Thoughts
            </CardTitle>
            <CardDescription>
              Enter a biblical concept, interpretation, challenge answer, or theological idea you'd like analyzed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Example: I believe the sanctuary in Hebrews represents Christ's mediatorial work in heaven, connecting the earthly types with their heavenly antitype..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[150px]"
            />
            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing || !input.trim()}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Analyze My Thoughts
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        {result && (
          <div className="space-y-6 animate-fade-in">
            {/* Overall Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Overall Score
                  </span>
                  <span className={`text-3xl font-bold ${getScoreColor(result.overall_score)}`}>
                    {result.overall_score}/100
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(result.categories).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm capitalize">
                          {key.replace(/_/g, ' ')}
                        </span>
                        <span className={`text-sm font-medium ${getScoreColor(value)}`}>
                          {value}%
                        </span>
                      </div>
                      <Progress value={value} className={getProgressColor(value)} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Strengths & Growth Areas */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <TrendingUp className="h-5 w-5" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.strengths.map((strength, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-600">
                    <Lightbulb className="h-5 w-5" />
                    Growth Areas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.growth_areas.map((area, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-500 mt-1">→</span>
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Palace Room Mapping */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Palace Room Mapping
                </CardTitle>
                <CardDescription>
                  Phototheology principles that connect to your thoughts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {result.palace_rooms.map((room, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <Badge variant="outline" className="font-mono">
                        {room.code}
                      </Badge>
                      <div>
                        <p className="font-medium">{room.name}</p>
                        <p className="text-sm text-muted-foreground">{room.relevance}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Scripture Connections */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="h-5 w-5 text-primary" />
                  Scripture Connections
                </CardTitle>
                <CardDescription>
                  Bible passages that strengthen your understanding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {result.scripture_connections.map((conn, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <BookOpen className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-primary">{conn.reference}</p>
                        <p className="text-sm text-muted-foreground">{conn.connection}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Encouragement */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-6 w-6 text-primary shrink-0" />
                  <div>
                    <p className="font-medium mb-1">Encouragement from Jeeves</p>
                    <p className="text-muted-foreground">{result.encouragement}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyzeThoughts;
