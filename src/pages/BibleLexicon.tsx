import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResearchToolsNav } from "@/components/bible/research/ResearchToolsNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { BookOpen, Search, Loader2, Languages, BarChart3, GraduationCap } from "lucide-react";
import { GuidedTourOverlay, primeAudioForTour } from "@/components/guided-tour/GuidedTourOverlay";
import { BIBLE_LEXICON_TOUR } from "@/data/guidedTours";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LexiconEntry {
  word: string;
  transliteration: string;
  strongsNumber: string;
  language: "hebrew" | "greek";
  partOfSpeech: string;
  definition: string;
  extendedDefinition: string;
  usageCount: number;
  semanticRange: { meaning: string; percentage: number; examples: string[] }[];
  relatedWords: { word: string; strongs: string; relation: string }[];
  keyVerses: string[];
}

const BibleLexicon = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [loading, setLoading] = useState(false);
  const [entry, setEntry] = useState<LexiconEntry | null>(null);
  const [activeTab, setActiveTab] = useState("definition");
  const [tourOpen, setTourOpen] = useState(false);

  // Auto-search if ?q= param present
  useEffect(() => {
    const q = searchParams.get("q");
    if (q && q.trim()) {
      setSearch(q);
      handleSearchQuery(q);
    }
  }, [searchParams]);

  const handleSearchQuery = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("lexicon-lookup", {
        body: { query: query.trim() },
      });
      if (error) throw error;
      setEntry(data);
    } catch (err) {
      console.error("Lexicon lookup failed:", err);
      toast.error("Failed to look up word. Try a Strong's number (e.g., H2713) or English word.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => handleSearchQuery(search);

  const maxPercentage = entry ? Math.max(...entry.semanticRange.map(s => s.percentage)) : 100;

  return (
    <>
      <Helmet>
        <title>Bible Lexicon — Hebrew & Greek Word Study | Phototheology</title>
        <meta name="description" content="Study Hebrew and Greek words with semantic ranges, definitions, usage frequency, and related words." />
      </Helmet>

      <div className={cn("min-h-screen flex flex-col", isDark ? "bg-[hsl(225,40%,8%)]" : "bg-gradient-to-br from-slate-50 via-amber-50/20 to-white")}>
        {/* Header */}
        <div className={cn("border-b px-4 py-3 shrink-0 backdrop-blur-xl", isDark ? "border-[hsl(32,70%,45%)/0.3] bg-[hsl(230,35%,12%)/0.95]" : "border-amber-200/50 bg-white/90")}>
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-[hsl(262,60%,50%)] to-[hsl(280,70%,55%)]">
                <Languages className="h-4 w-4 text-white" />
              </div>
              <h1 className={cn("font-serif text-xl font-semibold", isDark ? "text-[hsl(45,80%,70%)]" : "text-amber-900")}>
                Bible Lexicon
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => { primeAudioForTour(); setTourOpen(true); }} className="gap-1">
                <GraduationCap className="h-4 w-4" /> Tour
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
                <BookOpen className="h-4 w-4 mr-1" /> Back
              </Button>
            </div>
          </div>
          {tourOpen && <GuidedTourOverlay steps={BIBLE_LEXICON_TOUR} onClose={() => setTourOpen(false)} />}
          <div className="mt-2 max-w-4xl mx-auto">
            <ResearchToolsNav />
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 mt-3 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search Strong's # (H2713), English word (love), or Hebrew/Greek word..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-8"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading || !search.trim()} size="sm">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Look Up"}
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="max-w-4xl mx-auto px-4 py-6">
            {!entry && !loading && (
              <div className={cn("text-center py-20", isDark ? "text-[hsl(45,20%,50%)]" : "text-slate-400")}>
                <Languages className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-serif">Search for a word to begin</p>
                <p className="text-sm mt-1">Try "H2713" (חקר — to search out), "agape", or "shalom"</p>
              </div>
            )}

            {loading && (
              <div className="text-center py-20">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="text-sm mt-3 text-muted-foreground">Analyzing word...</p>
              </div>
            )}

            {entry && !loading && (
              <div className="space-y-6">
                {/* Word header */}
                <div className={cn("rounded-xl border p-6 text-center", isDark ? "bg-[hsl(230,30%,14%)] border-[hsl(32,70%,45%)/0.2]" : "bg-white border-amber-100")}>
                  <p className="text-4xl font-serif mb-1">{entry.word}</p>
                  <p className={cn("text-lg", isDark ? "text-[hsl(45,60%,65%)]" : "text-amber-700")}>
                    {entry.transliteration}
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Badge variant="outline">{entry.strongsNumber}</Badge>
                    <Badge variant="outline">{entry.language === "hebrew" ? "Hebrew" : "Greek"}</Badge>
                    <Badge variant="outline">{entry.partOfSpeech}</Badge>
                    <Badge variant="secondary">{entry.usageCount}× in Scripture</Badge>
                  </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="definition">Definition</TabsTrigger>
                    <TabsTrigger value="semantic">Semantic Range</TabsTrigger>
                    <TabsTrigger value="related">Related Words</TabsTrigger>
                  </TabsList>

                  <TabsContent value="definition" className="mt-4 space-y-4">
                    <div className={cn("rounded-xl border p-4", isDark ? "bg-[hsl(230,30%,14%)] border-[hsl(32,70%,45%)/0.2]" : "bg-white border-amber-100")}>
                      <h3 className={cn("font-semibold mb-2", isDark ? "text-[hsl(45,80%,85%)]" : "text-amber-900")}>
                        Definition
                      </h3>
                      <p className={cn("text-sm", isDark ? "text-[hsl(45,20%,65%)]" : "text-slate-600")}>{entry.definition}</p>
                    </div>
                    <div className={cn("rounded-xl border p-4", isDark ? "bg-[hsl(230,30%,14%)] border-[hsl(32,70%,45%)/0.2]" : "bg-white border-amber-100")}>
                      <h3 className={cn("font-semibold mb-2", isDark ? "text-[hsl(45,80%,85%)]" : "text-amber-900")}>
                        Extended Definition
                      </h3>
                      <p className={cn("text-sm leading-relaxed", isDark ? "text-[hsl(45,20%,65%)]" : "text-slate-600")}>{entry.extendedDefinition}</p>
                    </div>
                    {entry.keyVerses.length > 0 && (
                      <div className={cn("rounded-xl border p-4", isDark ? "bg-[hsl(230,30%,14%)] border-[hsl(32,70%,45%)/0.2]" : "bg-white border-amber-100")}>
                        <h3 className={cn("font-semibold mb-2", isDark ? "text-[hsl(45,80%,85%)]" : "text-amber-900")}>
                          Key Verses
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                          {entry.keyVerses.map((v) => (
                            <Badge key={v} variant="secondary" className={cn("text-xs", isDark ? "bg-[hsl(32,60%,20%)] text-[hsl(45,70%,70%)]" : "bg-amber-50 text-amber-700")}>
                              <BookOpen className="h-3 w-3 mr-1" /> {v}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="semantic" className="mt-4">
                    <div className={cn("rounded-xl border p-4", isDark ? "bg-[hsl(230,30%,14%)] border-[hsl(32,70%,45%)/0.2]" : "bg-white border-amber-100")}>
                      <div className="flex items-center gap-2 mb-4">
                        <BarChart3 className={cn("h-4 w-4", isDark ? "text-[hsl(45,60%,65%)]" : "text-amber-600")} />
                        <h3 className={cn("font-semibold", isDark ? "text-[hsl(45,80%,85%)]" : "text-amber-900")}>
                          Semantic Range Chart
                        </h3>
                      </div>
                      <div className="space-y-4">
                        {entry.semanticRange.map((s, i) => {
                          const barColors = [
                            "hsl(32, 80%, 50%)",
                            "hsl(200, 60%, 45%)",
                            "hsl(142, 60%, 40%)",
                            "hsl(262, 60%, 50%)",
                            "hsl(0, 60%, 45%)",
                            "hsl(45, 90%, 50%)",
                          ];
                          const color = barColors[i % barColors.length];
                          return (
                            <div key={i}>
                              <div className="flex items-center justify-between mb-1">
                                <span className={cn("text-sm font-medium", isDark ? "text-[hsl(45,80%,85%)]" : "text-slate-700")}>
                                  {s.meaning}
                                </span>
                                <span className={cn("text-xs font-mono", isDark ? "text-[hsl(45,60%,55%)]" : "text-slate-400")}>
                                  {s.percentage}%
                                </span>
                              </div>
                              <div className={cn("h-6 rounded-full overflow-hidden", isDark ? "bg-[hsl(230,30%,20%)]" : "bg-slate-100")}>
                                <div
                                  className="h-full rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-2"
                                  style={{ width: `${(s.percentage / maxPercentage) * 100}%`, backgroundColor: color }}
                                >
                                  <span className="text-[10px] text-white font-bold">{s.percentage}%</span>
                                </div>
                              </div>
                              {s.examples.length > 0 && (
                                <p className={cn("text-xs mt-1", isDark ? "text-[hsl(45,20%,50%)]" : "text-slate-400")}>
                                  e.g. {s.examples.join(", ")}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="related" className="mt-4">
                    <div className={cn("rounded-xl border p-4", isDark ? "bg-[hsl(230,30%,14%)] border-[hsl(32,70%,45%)/0.2]" : "bg-white border-amber-100")}>
                      <h3 className={cn("font-semibold mb-3", isDark ? "text-[hsl(45,80%,85%)]" : "text-amber-900")}>
                        Related Words
                      </h3>
                      <div className="space-y-2">
                        {entry.relatedWords.map((rw, i) => (
                          <div
                            key={i}
                            className={cn("flex items-center justify-between p-2 rounded-lg cursor-pointer hover:opacity-80", isDark ? "bg-[hsl(230,30%,18%)]" : "bg-slate-50")}
                            onClick={() => { setSearch(rw.strongs); handleSearch(); }}
                          >
                            <div>
                              <span className={cn("font-medium text-sm", isDark ? "text-[hsl(45,80%,85%)]" : "text-slate-700")}>
                                {rw.word}
                              </span>
                              <span className={cn("text-xs ml-2", isDark ? "text-[hsl(45,20%,50%)]" : "text-slate-400")}>
                                ({rw.strongs})
                              </span>
                            </div>
                            <Badge variant="outline" className="text-xs">{rw.relation}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default BibleLexicon;
