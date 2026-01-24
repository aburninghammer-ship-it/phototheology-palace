import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Search, Sparkles, Plus, Target, Lightbulb, BookOpen, Quote, ListOrdered, ChevronRight, Brain, Scroll, GraduationCap, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { QuickAudioButton } from "@/components/audio";

interface ResearchNote {
  id: string;
  sub_topic: string;
  content: string;
  created_at: string;
}

interface ParsedSection {
  type: "main-heading" | "numbered-heading" | "subheading" | "bullet" | "paragraph" | "key-insight" | "scripture" | "quote";
  content: string;
  level?: number;
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

  const parseResearchContent = (content: string): ParsedSection[] => {
    const lines = content.split("\n");
    const sections: ParsedSection[] = [];

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;

      // Main headings: ### Heading or lines with just a few words ending with colon
      if (/^###\s+/.test(trimmedLine)) {
        sections.push({
          type: "main-heading",
          content: trimmedLine.replace(/^###\s+/, "").replace(/:$/, "")
        });
      }
      // Numbered main sections: 1. Heading, 2. Heading, etc.
      else if (/^\d+\.\s+[A-Z]/.test(trimmedLine) && trimmedLine.length < 80) {
        sections.push({
          type: "numbered-heading",
          content: trimmedLine,
          level: 1
        });
      }
      // Sub-numbered items: 1.1, 2.3, etc.
      else if (/^\d+\.\d+/.test(trimmedLine)) {
        sections.push({
          type: "subheading",
          content: trimmedLine,
          level: 2
        });
      }
      // Bullet points: - item or * item or • item
      else if (/^[-*•]\s+/.test(trimmedLine)) {
        sections.push({
          type: "bullet",
          content: trimmedLine.replace(/^[-*•]\s+/, "")
        });
      }
      // Key insights: lines starting with "Key" or containing "Important:" or "Note:"
      else if (/^(Key|Important|Note|Insight|Takeaway):/i.test(trimmedLine)) {
        sections.push({
          type: "key-insight",
          content: trimmedLine
        });
      }
      // Scripture references: lines with book chapter:verse pattern
      else if (/\b(Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|Samuel|Kings|Chronicles|Ezra|Nehemiah|Esther|Job|Psalms?|Proverbs|Ecclesiastes|Song|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|Corinthians|Galatians|Ephesians|Philippians|Colossians|Thessalonians|Timothy|Titus|Philemon|Hebrews|James|Peter|Jude|Revelation)\s+\d+:\d+/i.test(trimmedLine) && trimmedLine.length < 200) {
        sections.push({
          type: "scripture",
          content: trimmedLine
        });
      }
      // Quoted text: lines starting and ending with quotes
      else if (/^["'"'].*["'"']$/.test(trimmedLine) || /^>/.test(trimmedLine)) {
        sections.push({
          type: "quote",
          content: trimmedLine.replace(/^>\s*/, "").replace(/^["'"']|["'"']$/g, "")
        });
      }
      // Short lines ending with colon (sub-headings)
      else if (trimmedLine.endsWith(":") && trimmedLine.length < 60) {
        sections.push({
          type: "subheading",
          content: trimmedLine.replace(/:$/, "")
        });
      }
      // Regular paragraphs
      else {
        sections.push({
          type: "paragraph",
          content: trimmedLine
        });
      }
    });

    return sections;
  };

  // Color palettes for variety
  const headingColors = [
    "from-blue-400 via-cyan-400 to-teal-400",
    "from-purple-400 via-pink-400 to-rose-400",
    "from-amber-400 via-orange-400 to-red-400",
    "from-emerald-400 via-green-400 to-lime-400",
    "from-indigo-400 via-violet-400 to-purple-400",
  ];

  const bulletColors = [
    "from-cyan-400 to-blue-500",
    "from-pink-400 to-rose-500",
    "from-amber-400 to-orange-500",
    "from-emerald-400 to-teal-500",
    "from-violet-400 to-purple-500",
    "from-lime-400 to-green-500",
  ];

  const numberedHeadingStyles = [
    { bg: "from-blue-500/20 to-cyan-500/20", border: "border-blue-400/30", icon: "text-blue-400" },
    { bg: "from-purple-500/20 to-pink-500/20", border: "border-purple-400/30", icon: "text-purple-400" },
    { bg: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-400/30", icon: "text-emerald-400" },
    { bg: "from-amber-500/20 to-orange-500/20", border: "border-amber-400/30", icon: "text-amber-400" },
    { bg: "from-rose-500/20 to-pink-500/20", border: "border-rose-400/30", icon: "text-rose-400" },
  ];

  const renderSection = (section: ParsedSection, idx: number) => {
    switch (section.type) {
      case "main-heading":
        const headingColor = headingColors[idx % headingColors.length];
        return (
          <div key={idx} className="mt-10 mb-6 first:mt-0">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${headingColor.replace('from-', 'from-').split(' ')[0]}/30 to-${headingColor.split(' ')[2]?.replace('to-', '')}/30 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg`}>
                <BookOpen className={`h-6 w-6 ${headingColor.split(' ')[0].replace('from-', 'text-')}`} />
              </div>
              <h2 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${headingColor} bg-clip-text text-transparent drop-shadow-sm`}>
                {section.content}
              </h2>
            </div>
            <div className={`mt-3 h-1.5 bg-gradient-to-r ${headingColor} opacity-50 rounded-full shadow-sm`} />
          </div>
        );

      case "numbered-heading":
        const style = numberedHeadingStyles[idx % numberedHeadingStyles.length];
        return (
          <div key={idx} className="mt-8 mb-4">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${style.bg} backdrop-blur-sm flex items-center justify-center ${style.border} border flex-shrink-0 shadow-md`}>
                <ListOrdered className={`h-5 w-5 ${style.icon}`} />
              </div>
              <h3 className={`text-xl font-semibold pt-1.5 bg-gradient-to-r ${style.bg.replace('/20', '-400').replace(' to-', ' to-')} bg-clip-text text-transparent`}>
                {section.content}
              </h3>
            </div>
          </div>
        );

      case "subheading":
        const subColors = ["border-cyan-500/50", "border-pink-500/50", "border-amber-500/50", "border-emerald-500/50", "border-violet-500/50"];
        const subTextColors = ["text-cyan-400", "text-pink-400", "text-amber-400", "text-emerald-400", "text-violet-400"];
        const subColor = subColors[idx % subColors.length];
        const subTextColor = subTextColors[idx % subTextColors.length];
        return (
          <div key={idx} className={`mt-6 mb-3 pl-4 border-l-3 ${subColor} bg-gradient-to-r from-white/5 to-transparent rounded-r-lg py-2`}>
            <h4 className="text-lg font-medium text-foreground/90 flex items-center gap-2">
              <ChevronRight className={`h-4 w-4 ${subTextColor}`} />
              <span className={subTextColor}>{section.content}</span>
            </h4>
          </div>
        );

      case "bullet":
        const bulletColor = bulletColors[idx % bulletColors.length];
        return (
          <div key={idx} className="flex items-start gap-3 ml-4 my-3 group">
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${bulletColor} mt-2 flex-shrink-0 shadow-sm group-hover:scale-125 transition-transform`} />
            <p className="text-foreground/80 leading-relaxed group-hover:text-foreground transition-colors">{section.content}</p>
          </div>
        );

      case "key-insight":
        return (
          <div key={idx} className="my-6 p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-yellow-500/15 border border-amber-400/30 backdrop-blur-sm shadow-lg shadow-amber-500/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400/30 to-orange-500/30 flex items-center justify-center flex-shrink-0 shadow-md border border-amber-400/30">
                <Lightbulb className="h-6 w-6 text-amber-400 drop-shadow-sm" />
              </div>
              <div>
                <Badge className="mb-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-sm">
                  Key Insight
                </Badge>
                <p className="text-foreground font-medium leading-relaxed">{section.content.replace(/^(Key|Important|Note|Insight|Takeaway):\s*/i, "")}</p>
              </div>
            </div>
          </div>
        );

      case "scripture":
        return (
          <div key={idx} className="my-5 p-5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-cyan-500/15 border border-emerald-400/30 backdrop-blur-sm shadow-lg shadow-emerald-500/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400/30 to-teal-500/30 flex items-center justify-center flex-shrink-0 shadow-md border border-emerald-400/30">
                <Scroll className="h-6 w-6 text-emerald-400 drop-shadow-sm" />
              </div>
              <div>
                <Badge className="mb-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-sm">
                  Scripture
                </Badge>
                <p className="text-foreground italic leading-relaxed">{section.content}</p>
              </div>
            </div>
          </div>
        );

      case "quote":
        return (
          <div key={idx} className="my-5 pl-6 py-4 border-l-4 border-gradient-to-b from-purple-500 to-pink-500 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-rose-500/10 rounded-r-xl shadow-md">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400/30 to-pink-500/30 flex items-center justify-center flex-shrink-0 border border-purple-400/30">
                <Quote className="h-5 w-5 text-purple-400" />
              </div>
              <p className="text-foreground/90 italic leading-relaxed text-lg">{section.content}</p>
            </div>
          </div>
        );

      case "paragraph":
      default:
        return (
          <p key={idx} className="text-foreground/75 leading-relaxed my-4 text-base pl-2 border-l-2 border-white/10 hover:border-blue-400/50 hover:text-foreground/90 transition-all">
            {section.content}
          </p>
        );
    }
  };

  return (
    <div className="min-h-screen gradient-dreamy relative overflow-hidden">
      {/* Animated background glow elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/4 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '4s' }}
        />
        <div
          className="absolute top-1/2 -right-32 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '5s', animationDelay: '1s' }}
        />
        <div
          className="absolute -bottom-32 left-1/3 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '6s', animationDelay: '2s' }}
        />
      </div>

      <Navigation />

      <main className="pt-16 relative z-10">
        {/* Hero Section with glass effect */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative text-white py-16 px-4">
            <div className="container mx-auto max-w-6xl text-center">
              <div className="inline-block bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-2xl mb-6 border border-white/30">
                <Search className="h-16 w-16 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">Research Mode</h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Deep biblical study with interactive deep-dive canvas
              </p>

              {/* Stats badges */}
              <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
                <Badge className="bg-white/20 backdrop-blur-sm border-white/30 text-white px-4 py-2">
                  <Brain className="h-4 w-4 mr-2" />
                  AI-Powered Research
                </Badge>
                <Badge className="bg-white/20 backdrop-blur-sm border-white/30 text-white px-4 py-2">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Scholarly Depth
                </Badge>
                <Badge className="bg-white/20 backdrop-blur-sm border-white/30 text-white px-4 py-2">
                  <Clock className="h-4 w-4 mr-2" />
                  Save Your Research
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Research Section */}
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Search Card with glass effect */}
          <Card variant="glass" className="mb-8 border-white/10">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                Start Your Research Journey
              </h2>
              <p className="text-muted-foreground mb-6">
                Enter a topic to begin comprehensive research, then use the Deep Dive Canvas to explore specific aspects.
              </p>

              <div className="flex gap-4 flex-col sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="e.g., 7 churches of Revelation, Sanctuary symbolism..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && startResearch()}
                    className="pl-12 h-14 md:h-16 text-base md:text-lg bg-background/50 backdrop-blur-sm border-white/10 focus:border-blue-500/50"
                  />
                </div>
                <Button
                  onClick={startResearch}
                  disabled={researching}
                  className="h-14 md:h-16 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25"
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
                <Card variant="glass" className="border-white/10">
                  <CardContent className="text-center py-20">
                    <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center border border-white/10">
                      <Search className="h-16 w-16 text-muted-foreground/40" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-3 text-muted-foreground">
                      Start Your Research Journey
                    </h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Enter a topic above to begin your deep biblical research with AI-powered insights
                    </p>
                  </CardContent>
                </Card>
              )}

              {researching && !research && (
                <Card variant="glass" className="border-white/10">
                  <CardContent className="text-center py-20">
                    <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center border border-blue-500/30 animate-pulse">
                      <Sparkles className="h-16 w-16 text-blue-400 animate-spin" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                      Researching...
                    </h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Gathering scholarly insights on "{query}"
                    </p>
                  </CardContent>
                </Card>
              )}

              {research && (
                <Card variant="glass" className="border-white/10 overflow-hidden">
                  <CardContent className="p-0">
                    {/* Research Header */}
                    <div className="p-6 border-b border-white/10 bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-transparent">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/30 to-indigo-500/30 backdrop-blur-sm flex items-center justify-center border border-blue-400/30">
                            <Search className="h-6 w-6 text-blue-400" />
                          </div>
                          <div>
                            <h3 className="text-xl md:text-2xl font-bold text-foreground">{query}</h3>
                            <p className="text-sm text-muted-foreground">Research Results</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setQuery("");
                              setResearch("");
                              setResearchNotes([]);
                              setDeepDiveMode(false);
                              setDeepDiveTopic("");
                              setDeepDivePrompt("");
                            }}
                            className="bg-background/50 backdrop-blur-sm border-white/20 hover:bg-white/10"
                          >
                            <Search className="h-4 w-4 mr-2" />
                            New Research
                          </Button>
                          <QuickAudioButton text={research} variant="outline" size="sm" className="bg-background/50 backdrop-blur-sm border-white/20 hover:bg-white/10" />
                        </div>
                      </div>
                    </div>

                    {/* Research Content */}
                    <ScrollArea className="h-[700px]">
                      <div className="p-6 md:p-8">
                        {parseResearchContent(research).map((section, idx) => renderSection(section, idx))}
                      </div>
                    </ScrollArea>

                    {/* Deep Dive Toggle */}
                    <div className="p-4 border-t border-white/10 bg-gradient-to-r from-indigo-500/5 to-purple-500/5">
                      <Button
                        onClick={() => setDeepDiveMode(!deepDiveMode)}
                        variant="outline"
                        className="w-full bg-background/50 backdrop-blur-sm border-white/20 hover:bg-white/10 hover:border-indigo-500/50"
                      >
                        <Target className="mr-2 h-4 w-4 text-indigo-400" />
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
                <Card variant="glass" className="sticky top-24 border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center border border-purple-400/30">
                        <Target className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Deep Dive Canvas</h3>
                        <p className="text-xs text-muted-foreground">Explore further</p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
                      Focus deeper on a specific aspect of <span className="font-medium text-foreground">"{query}"</span>
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block text-foreground/80">Focus Area</label>
                        <Input
                          placeholder="e.g., historical context, symbolism..."
                          value={deepDiveTopic}
                          onChange={(e) => setDeepDiveTopic(e.target.value)}
                          className="bg-background/50 backdrop-blur-sm border-white/10 focus:border-purple-500/50"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block text-foreground/80">Your Question</label>
                        <Textarea
                          placeholder="What specifically would you like to explore?"
                          value={deepDivePrompt}
                          onChange={(e) => setDeepDivePrompt(e.target.value)}
                          rows={4}
                          className="bg-background/50 backdrop-blur-sm border-white/10 focus:border-purple-500/50"
                        />
                      </div>

                      <Button
                        onClick={startDeepDive}
                        disabled={researching || !user}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Start Deep Dive
                      </Button>
                    </div>

                    {researchNotes.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-white/10">
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-purple-400" />
                          Your Deep Dives ({researchNotes.length})
                        </h4>
                        <div className="space-y-2">
                          {researchNotes.map((note) => (
                            <div key={note.id} className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/10 hover:border-purple-500/30 transition-colors">
                              <Badge variant="outline" className="mb-2 border-purple-500/30 text-purple-400 bg-purple-500/10">
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
