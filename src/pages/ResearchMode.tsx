import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Search, Sparkles, Plus, Target, Lightbulb } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { QuickAudioButton } from "@/components/audio";

interface ResearchNote {
  id: string;
  sub_topic: string;
  content: string;
  created_at: string;
}

const ResearchMode = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [research, setResearch] = useState("");
  const [researching, setResearching] = useState(false);
  const [deepDiveMode, setDeepDiveMode] = useState(false);
  const [deepDiveTopic, setDeepDiveTopic] = useState("");
  const [deepDivePrompt, setDeepDivePrompt] = useState("");
  const [researchNotes, setResearchNotes] = useState<ResearchNote[]>([]);

  const startResearch = async () => {
    if (!query.trim()) {
      toast({
        title: "Please enter a topic",
        description: "Enter a topic, theme, or scripture to research",
        variant: "destructive",
      });
      return;
    }

    setResearching(true);
    setDeepDiveMode(false);

    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "research",
          query: query,
        },
      });

      if (error) throw error;

      setResearch(data.content);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setResearching(false);
    }
  };

  const startDeepDive = async () => {
    if (!deepDiveTopic.trim() || !deepDivePrompt.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a topic and your focus area",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to use deep dive research",
        variant: "destructive",
      });
      return;
    }

    setResearching(true);

    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "research",
          query: `${query}: Focus on ${deepDiveTopic} - ${deepDivePrompt}`,
        },
      });

      if (error) throw error;

      // Save the research note
      const { error: insertError } = await supabase
        .from("research_notes")
        .insert({
          user_id: user.id,
          parent_research: query,
          sub_topic: deepDiveTopic,
          content: data.content,
        });

      if (insertError) throw insertError;

      // Add to local state
      setResearchNotes([
        ...researchNotes,
        {
          id: crypto.randomUUID(),
          sub_topic: deepDiveTopic,
          content: data.content,
          created_at: new Date().toISOString(),
        },
      ]);

      setDeepDiveTopic("");
      setDeepDivePrompt("");

      toast({
        title: "Deep dive complete!",
        description: "Research saved to your notes",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setResearching(false);
    }
  };

  const parseResearchContent = (content: string) => {
    const lines = content.split("\n");
    const sections: { type: "heading" | "subheading" | "paragraph"; content: string }[] = [];

    lines.forEach((line) => {
      if (!line.trim()) return;

      // Detect headings (lines ending with colon or all caps)
      if (line.trim().endsWith(":") || line === line.toUpperCase()) {
        sections.push({ type: "heading", content: line.trim() });
      }
      // Detect subheadings (lines with numbers or bullets)
      else if (/^\d+\./.test(line.trim()) || /^[•\-]/.test(line.trim())) {
        sections.push({ type: "subheading", content: line.trim() });
      }
      // Regular paragraphs
      else {
        sections.push({ type: "paragraph", content: line.trim() });
      }
    });

    return sections;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white py-12 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <div className="inline-block bg-white rounded-2xl p-6 shadow-lg mb-4">
              <Search className="h-16 w-16 text-blue-600" />
            </div>
            <h1 className="text-5xl font-bold mb-2">Research Mode</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Deep biblical study with interactive deep-dive canvas
            </p>
          </div>
        </div>

        {/* Research Section */}
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <Card className="mb-8">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Start Your Research Journey</h2>
              <p className="text-muted-foreground mb-8">
                Enter a topic to begin comprehensive research, then use the Deep Dive Canvas to explore specific aspects.
              </p>

              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="e.g., 7 churches of Revelation, Sanctuary symbolism..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && startResearch()}
                    className="pl-12 h-16 text-lg"
                  />
                </div>
                <Button
                  onClick={startResearch}
                  disabled={researching}
                  className="h-16 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {researching ? (
                    <>
                      <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                      Researching...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Start Research
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Research Panel */}
            <div className="lg:col-span-2">
              {!research && !researching && (
                <div className="text-center py-20">
                  <Search className="h-32 w-32 text-muted-foreground mx-auto mb-6 opacity-20" />
                  <h2 className="text-3xl font-bold mb-2 text-muted-foreground">
                    Start Your Research Journey
                  </h2>
                  <p className="text-muted-foreground">
                    Enter a topic above to begin your deep biblical research
                  </p>
                </div>
              )}

              {research && (
                <Card>
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <Search className="h-6 w-6 text-primary" />
                        <h3 className="text-3xl font-bold">{query}</h3>
                      </div>
                      <QuickAudioButton text={research} variant="outline" size="sm" />
                    </div>
                    <ScrollArea className="h-[700px] pr-4">
                      <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
                        {parseResearchContent(research).map((section, idx) => (
                          <div key={idx}>
                            {section.type === "heading" && (
                              <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground border-b-2 border-primary pb-2">
                                {section.content.replace(":", "")}
                              </h2>
                            )}
                            {section.type === "subheading" && (
                              <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground flex items-start gap-2">
                                <Lightbulb className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                <span>{section.content}</span>
                              </h3>
                            )}
                            {section.type === "paragraph" && (
                              <p className="text-base leading-relaxed mb-4 text-muted-foreground">
                                {section.content}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    <div className="mt-6 pt-6 border-t">
                      <Button
                        onClick={() => setDeepDiveMode(!deepDiveMode)}
                        variant="outline"
                        className="w-full"
                      >
                        <Target className="mr-2 h-4 w-4" />
                        {deepDiveMode ? "Close Deep Dive Canvas" : "Open Deep Dive Canvas"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Deep Dive Canvas Sidebar */}
            <div className="lg:col-span-1">
              {deepDiveMode && research && (
                <Card className="sticky top-24">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Deep Dive Canvas
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Focus deeper on a specific aspect of {query}
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Focus Area</label>
                        <Input
                          placeholder="e.g., historical context, symbolism..."
                          value={deepDiveTopic}
                          onChange={(e) => setDeepDiveTopic(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Your Question</label>
                        <Textarea
                          placeholder="What specifically would you like to explore?"
                          value={deepDivePrompt}
                          onChange={(e) => setDeepDivePrompt(e.target.value)}
                          rows={4}
                        />
                      </div>

                      <Button
                        onClick={startDeepDive}
                        disabled={researching || !user}
                        className="w-full gradient-palace"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Start Deep Dive
                      </Button>
                    </div>

                    {researchNotes.length > 0 && (
                      <div className="mt-6 pt-6 border-t">
                        <h4 className="font-medium mb-3">Your Deep Dives ({researchNotes.length})</h4>
                        <div className="space-y-2">
                          {researchNotes.map((note) => (
                            <div key={note.id} className="p-3 rounded-lg bg-accent/50 border">
                              <Badge variant="secondary" className="mb-2">
                                {note.sub_topic}
                              </Badge>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {note.content.substring(0, 100)}...
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResearchMode;
