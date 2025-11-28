import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Scale, Link2, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StyledMarkdownSections } from "@/components/ui/styled-markdown";

const CultureControversy = () => {
  const { toast } = useToast();
  const [topic, setTopic] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const quickTopics = [
    "Black Lives Matter",
    "LGBTQ+",
    "Abortion",
    "Artificial Intelligence",
    "Christian Nationalism",
    "Climate Change",
    "Immigration",
    "Social Justice",
    "Transgender Issues",
    "Political Polarization",
  ];

  const analyzeTopic = async (topicText: string) => {
    if (!topicText.trim()) {
      toast({
        title: "Please enter a topic",
        description: "Enter a cultural topic or paste a link to analyze",
        variant: "destructive",
      });
      return;
    }

    setAnalyzing(true);
    setTopic(topicText);

    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "culture-controversy",
          topic: topicText,
        },
      });

      if (error) throw error;

      setAnalysis(data.content);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-red-500 via-orange-500 to-pink-500 text-white py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-start gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <Scale className="h-12 w-12 text-red-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    C&C
                  </Badge>
                  <span className="text-white/90">Floor 0 - Advanced Modes</span>
                </div>
                <h1 className="text-5xl font-bold mb-4">Culture & Controversy</h1>
                <p className="text-xl text-white/90 max-w-4xl">
                  Analyze current events, cultural movements, and political topics through the clear
                  lens of Jesus' teachings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Section */}
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Card className="mb-8">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Analyze a Cultural Topic or Link</h2>
              <p className="text-muted-foreground mb-6">
                Enter any cultural topic, or paste a link to a news article, social media post, or
                YouTube video.
              </p>

              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="e.g., Black Lives Matter, or paste a link..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && analyzeTopic(topic)}
                    className="pl-10 h-14 text-lg"
                  />
                </div>
                <Button
                  onClick={() => analyzeTopic(topic)}
                  disabled={analyzing}
                  className="h-14 px-8 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                >
                  {analyzing ? (
                    <>
                      <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>

              <div>
                <p className="text-sm font-medium mb-3">Or try:</p>
                <div className="flex flex-wrap gap-2">
                  {quickTopics.map((quickTopic) => (
                    <Button
                      key={quickTopic}
                      variant="outline"
                      onClick={() => analyzeTopic(quickTopic)}
                      disabled={analyzing}
                    >
                      {quickTopic}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {analysis && (
            <Card className="border-2 border-primary/20">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-primary/20">
                  <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl">
                    <Scale className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Biblical Analysis</h3>
                    <p className="text-sm text-muted-foreground">Jesus-centered perspective on this topic</p>
                  </div>
                </div>
                <ScrollArea className="h-[700px] pr-4">
                  <StyledMarkdownSections content={analysis} />
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default CultureControversy;
