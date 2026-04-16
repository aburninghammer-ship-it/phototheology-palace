import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, BookOpen, Layers, Link as LinkIcon, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { formatJeevesResponse } from "@/lib/formatJeevesResponse";
import { QuickAudioButton } from "@/components/audio";

interface Article {
  id: string;
  title: string;
  slug: string;
  topic_type: string[];
  summary_1d: string;
  primary_verses: string[];
  historical_background?: string;
  cultural_notes?: string;
  lexical_data?: any;
  pt_floors?: string[];
  pt_rooms?: string[];
  pt_codes?: string[];
  chains?: any;
  pt_commentary?: any;
  adventist_doctrinal_position?: string;
  adventist_controversies?: string[];
  visual_hooks?: any;
  cross_refs?: string[];
}

export default function EncyclopediaArticle() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [jeevesQuestion, setJeevesQuestion] = useState("");
  const [jeevesResponse, setJeevesResponse] = useState("");
  const [jeevesLoading, setJeevesLoading] = useState(false);
  const [explanationLevel, setExplanationLevel] = useState<string>("2");
  const [floorFocus, setFloorFocus] = useState<string>("all");
  const tabsRef = useRef<HTMLDivElement>(null);

  const scrollToTabs = () => {
    tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    if (!slug) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('encyclopedia_articles')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error) {
      console.error("Error fetching article:", error);
      toast.error("Article not found");
      navigate('/bible-encyclopedia');
    } else {
      setArticle(data);
    }
    setLoading(false);
  };

  const askJeeves = async (mode: "explain" | "custom" = "custom") => {
    if (!article) return;
    
    setJeevesLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('jeeves', {
        body: {
          mode: mode === "explain" ? "encyclopedia-explain" : "qa",
          articleId: mode === "explain" ? article.id : undefined,
          explanationLevel: mode === "explain" ? explanationLevel : undefined,
          floorFocus: mode === "explain" && floorFocus !== "all" ? floorFocus : undefined,
          question: mode === "custom" ? jeevesQuestion : undefined,
          context: mode === "custom" ? `Article: ${article.title}\n${article.summary_1d}` : undefined
        }
      });

      if (error) throw error;

      setJeevesResponse(data.explanation || data.response || "No response received");
    } catch (error: any) {
      console.error("Jeeves error:", error);
      toast.error("Failed to get response from Jeeves");
    } finally {
      setJeevesLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">{article.title}</CardTitle>
                <CardDescription className="text-lg">{article.summary_1d}</CardDescription>
              </div>
              <QuickAudioButton 
                text={`${article.title}. ${article.summary_1d}`} 
                variant="outline"
                size="default"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {article.topic_type?.map((type) => (
                <Badge key={type} variant="secondary">{type}</Badge>
              ))}
            </div>
          </CardHeader>
        </Card>

        {/* Primary Verses */}
        {article.primary_verses && article.primary_verses.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Primary Verses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {article.primary_verses.map((verse) => (
                  <Button
                    key={verse}
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/bible-reference?verse=${encodeURIComponent(verse)}`)}
                  >
                    {verse}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Card className="mb-6 scroll-mt-32" ref={tabsRef}>
          <CardContent className="pt-6">
            <Tabs defaultValue="floors" className="w-full" onValueChange={scrollToTabs}>
              <TabsList className="grid w-full grid-cols-4 mb-4">
                <TabsTrigger value="floors">Floors</TabsTrigger>
                <TabsTrigger value="chains">Chains</TabsTrigger>
                <TabsTrigger value="background">Background</TabsTrigger>
                <TabsTrigger value="jeeves">Ask Jeeves</TabsTrigger>
              </TabsList>

              <TabsContent value="floors" className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  PT Floors & Rooms
                </h3>
                {article.pt_floors && article.pt_floors.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">This topic connects to:</p>
                    <div className="flex flex-wrap gap-2">
                      {article.pt_floors.map((floor) => (
                        <Badge key={floor} variant="outline">{floor}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {article.pt_commentary && Object.keys(article.pt_commentary).length > 0 && (
                  <div className="space-y-3 mt-4">
                    {Object.entries(article.pt_commentary).map(([floor, commentary]) => (
                      <div key={floor} className="border-l-4 border-primary pl-4">
                        <h4 className="font-semibold">{floor}</h4>
                        <p className="text-sm text-muted-foreground">{commentary as string}</p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="chains" className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  Scripture Chains
                </h3>
                {article.chains && (
                  <div className="space-y-4">
                    {Object.entries(article.chains).map(([chainType, verses]: [string, any]) => (
                      verses && Array.isArray(verses) && verses.length > 0 && (
                        <div key={chainType} className="space-y-2">
                          <h4 className="font-semibold text-sm uppercase text-primary">
                            {chainType.replace(/_/g, ' ')}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {verses.map((verse: string) => (
                              <Button
                                key={verse}
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/bible-reference?verse=${encodeURIComponent(verse)}`)}
                              >
                                {verse}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="background" className="space-y-4">
                {article.historical_background && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">Historical Background</h3>
                      <QuickAudioButton text={article.historical_background} variant="ghost" size="sm" />
                    </div>
                    <p className="text-muted-foreground">{article.historical_background}</p>
                  </div>
                )}
                {article.cultural_notes && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">Cultural Notes</h3>
                      <QuickAudioButton text={article.cultural_notes} variant="ghost" size="sm" />
                    </div>
                    <p className="text-muted-foreground">{article.cultural_notes}</p>
                  </div>
                )}
                {article.adventist_doctrinal_position && (
                  <div className="mt-4 p-4 bg-secondary/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">SDA Position</h3>
                      <QuickAudioButton text={article.adventist_doctrinal_position} variant="ghost" size="sm" />
                    </div>
                    <p className="text-sm">{article.adventist_doctrinal_position}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="jeeves" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Ask Jeeves to Explain</h3>
                    <div className="flex gap-4 mb-4">
                      <div className="flex-1">
                        <label className="text-sm mb-2 block">Explanation Level</label>
                        <Select value={explanationLevel} onValueChange={setExplanationLevel}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Level 1 (Beginner)</SelectItem>
                            <SelectItem value="2">Level 2 (Intermediate)</SelectItem>
                            <SelectItem value="3">Level 3 (Advanced)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1">
                        <label className="text-sm mb-2 block">Focus Floor (Optional)</label>
                        <Select value={floorFocus} onValueChange={setFloorFocus}>
                          <SelectTrigger>
                            <SelectValue placeholder="All Floors" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Floors</SelectItem>
                            <SelectItem value="Story Floor">Story Floor</SelectItem>
                            <SelectItem value="Detective Floor">Detective Floor</SelectItem>
                            <SelectItem value="Freestyle Floor">Freestyle Floor</SelectItem>
                            <SelectItem value="Christ-Centered Floor">Christ-Centered Floor</SelectItem>
                            <SelectItem value="Prophecy Floor">Prophecy Floor</SelectItem>
                            <SelectItem value="Application Floor">Application Floor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button 
                      onClick={() => askJeeves("explain")} 
                      disabled={jeevesLoading}
                      className="w-full"
                    >
                      {jeevesLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                      Get Explanation
                    </Button>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Or Ask a Custom Question</h3>
                    <Textarea
                      value={jeevesQuestion}
                      onChange={(e) => setJeevesQuestion(e.target.value)}
                      placeholder="Ask Jeeves anything about this topic..."
                      rows={3}
                      className="mb-2"
                    />
                    <Button 
                      onClick={() => askJeeves("custom")} 
                      disabled={!jeevesQuestion.trim() || jeevesLoading}
                      variant="outline"
                      className="w-full"
                    >
                      {jeevesLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Ask Jeeves
                    </Button>
                  </div>

                  {jeevesResponse && (
                    <div className="mt-6 p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border border-primary/20">
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-primary" />
                          <h4 className="font-semibold text-lg">Jeeves Says:</h4>
                        </div>
                        <QuickAudioButton text={jeevesResponse} variant="ghost" size="sm" />
                      </div>
                      <div className="space-y-4 text-foreground">
                        {formatJeevesResponse(jeevesResponse)}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Cross References */}
        {article.cross_refs && article.cross_refs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Related Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {article.cross_refs.map((ref) => (
                  <Badge key={ref} variant="outline" className="cursor-pointer hover:bg-secondary">
                    {ref}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <Footer />
    </div>
  );
}