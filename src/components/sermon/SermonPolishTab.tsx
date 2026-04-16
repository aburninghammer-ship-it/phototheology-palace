import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Sparkles, Search, ChevronDown, ChevronUp, 
  Scissors, TrendingUp, BookOpen, Church, 
  CheckSquare, Loader2, AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PolishAnalysis {
  snapshot: {
    structureScore: number;
    structureNote: string;
    scriptureDensity: number;
    scriptureDensityNote: string;
    christConnection: number;
    christConnectionNote: string;
    applicationClarity: number;
    applicationClarityNote: string;
    emotionalArc: number;
    emotionalArcNote: string;
    estimatedLength: string;
    pointCount: string;
    scriptureReferences: number;
  };
  amplify: Array<{
    quote: string;
    insight: string;
    suggestion: string;
  }>;
  missed: {
    typological: string[];
    sanctuary: string[];
    prophetic: string[];
    threeHeavens: string[];
  };
  tighten: {
    cut: string[];
    clarify: string[];
    strengthen: string[];
  };
  arc: {
    currentFlow: string;
    issue: string;
    suggestedFix: string;
    climaxPosition: string;
  };
  ptEnhancement: {
    currentDimensions: string[];
    missingDimensions: string[];
    suggestions: {
      observationRoom: string[];
      concentrationRoom: string[];
      symbolsRoom: string[];
      sanctuaryRoom: string[];
      fireRoom: string[];
    };
  };
  checklist: {
    structure: string[];
    content: string[];
    delivery: string[];
    spiritual: string[];
  };
}

interface SermonPolishTabProps {
  initialSermonText?: string;
  themePassage?: string;
  sermonId?: string;
}

export function SermonPolishTab({ initialSermonText = "", themePassage = "", sermonId: propSermonId }: SermonPolishTabProps) {
  const [searchParams] = useSearchParams();
  // Use prop first, fallback to URL param
  const sermonId = propSermonId || searchParams.get("id") || undefined;

  // Strip HTML from rich-text editor content for the plain textarea
  const stripHtml = (html: string) => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  const [sermonText, setSermonText] = useState(() => stripHtml(initialSermonText));
  const [mainText, setMainText] = useState(themePassage);

  // Keep sermon text in sync when user switches from Write → Polish tab
  useEffect(() => {
    if (initialSermonText) {
      const plain = stripHtml(initialSermonText);
      if (plain.length > 0) {
        setSermonText(plain);
      }
    }
  }, [initialSermonText]);

  // Keep theme passage in sync
  useEffect(() => {
    if (themePassage) setMainText(themePassage);
  }, [themePassage]);
  const [centralTheme, setCentralTheme] = useState("");
  const [analysisDepth, setAnalysisDepth] = useState<"quick" | "deep" | "full">("deep");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<PolishAnalysis | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSavedAnalysis, setHasSavedAnalysis] = useState(false);
  const [isLoadingCheck, setIsLoadingCheck] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    snapshot: true,
    amplify: true,
    missed: false,
    tighten: false,
    arc: false,
    pt: false,
    checklist: false,
  });

  // Check for saved analysis on mount (don't auto-load, just check if exists)
  useEffect(() => {
    const checkForSavedAnalysis = async () => {
      if (!sermonId) {
        setIsLoadingCheck(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from("sermons")
          .select("polish_analysis")
          .eq("id", sermonId)
          .single();
        
        if (error) throw error;
        setHasSavedAnalysis(!!data?.polish_analysis);
      } catch (error) {
        console.error("Error checking for saved analysis:", error);
      } finally {
        setIsLoadingCheck(false);
      }
    };
    
    checkForSavedAnalysis();
  }, [sermonId]);

  const loadSavedAnalysis = async () => {
    if (!sermonId) return;
    
    try {
      const { data, error } = await supabase
        .from("sermons")
        .select("polish_analysis")
        .eq("id", sermonId)
        .single();
      
      if (error) throw error;
      if (data?.polish_analysis) {
        setAnalysis(data.polish_analysis as unknown as PolishAnalysis);
        setExpandedSections({
          snapshot: true,
          amplify: true,
          missed: true,
          tighten: true,
          arc: true,
          pt: true,
          checklist: true,
        });
        toast.success("Loaded saved polish review!");
      }
    } catch (error) {
      console.error("Error loading saved analysis:", error);
      toast.error("Failed to load saved review");
    }
  };
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const saveAnalysis = async (analysisData: PolishAnalysis) => {
    if (!sermonId) {
      toast.info("Analysis complete! Save your sermon first to persist the analysis.");
      return false;
    }

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const payload = JSON.parse(JSON.stringify(analysisData));

      // Use select() to detect "0 rows updated" (common when sermonId is missing/wrong or RLS blocks)
      const { data, error } = await supabase
        .from("sermons")
        .update({ polish_analysis: payload })
        .eq("id", sermonId)
        .eq("user_id", user.id)
        .select("id")
        .maybeSingle();

      if (error) throw error;
      if (!data?.id) {
        throw new Error("Could not save: sermon not found or you don’t have permission.");
      }

      setHasSavedAnalysis(true);
      toast.success("Analysis saved!");
      return true;
    } catch (error: any) {
      console.error("Error saving analysis:", error);
      const msg = error?.message || error?.details || "Failed to save analysis";
      toast.error(msg);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const analyzeSermon = async () => {
    if (!sermonText || sermonText.length < 50) {
      toast.error("Please enter at least 50 characters of sermon content");
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("polish-sermon", {
        body: {
          sermonText: sermonText.replace(/<[^>]*>/g, ""), // Strip HTML
          mainText,
          centralTheme,
          analysisDepth,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setAnalysis(data);
      toast.success("Sermon analysis complete!");

      // Auto-save if we have a sermon ID
      if (sermonId) {
        await saveAnalysis(data as PolishAnalysis);
      }

      // Expand all sections after analysis
      setExpandedSections({
        snapshot: true,
        amplify: true,
        missed: true,
        tighten: true,
        arc: true,
        pt: true,
        checklist: true,
      });
    } catch (error: any) {
      console.error("Error analyzing sermon:", error);
      const msg = error?.message || error?.details || "Failed to analyze sermon";
      toast.error(msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const ScoreBar = ({ score, label, note }: { score: number; label: string; note: string }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className={score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-600"}>
          {score}%
        </span>
      </div>
      <Progress value={score} className="h-2" />
      <p className="text-xs text-muted-foreground">{note}</p>
    </div>
  );

  const SectionHeader = ({ 
    icon: Icon, 
    title, 
    section, 
    emoji 
  }: { 
    icon: any; 
    title: string; 
    section: string;
    emoji: string;
  }) => (
    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50 rounded-lg transition-colors">
      <div className="flex items-center gap-2">
        <span className="text-lg">{emoji}</span>
        <Icon className="w-4 h-4 text-primary" />
        <span className="font-semibold">{title}</span>
      </div>
      {expandedSections[section] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
    </CollapsibleTrigger>
  );

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Saved Analysis Prompt */}
          {!analysis && !isLoadingCheck && hasSavedAnalysis && (
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Previous Polish Review Found</p>
                      <p className="text-sm text-muted-foreground">
                        You have a saved analysis for this sermon
                      </p>
                    </div>
                  </div>
                  <Button onClick={loadSavedAnalysis} variant="default" size="sm">
                    Load Saved Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Input Section */}
          {!analysis && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5 text-primary" />
                  🪞 Polish Your Sermon
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  AI-powered coaching to reveal hidden gems and strengthen your message
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Paste your sermon below (manuscript, outline, or notes)</Label>
                  <Textarea
                    value={sermonText}
                    onChange={(e) => setSermonText(e.target.value)}
                    placeholder="Begin typing or paste your sermon content here..."
                    className="min-h-[200px] font-serif"
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {sermonText.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length} words
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>What's your main text?</Label>
                    <Input
                      value={mainText}
                      onChange={(e) => setMainText(e.target.value)}
                      placeholder="e.g., Genesis 22:1-14"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>What's your central theme?</Label>
                    <Input
                      value={centralTheme}
                      onChange={(e) => setCentralTheme(e.target.value)}
                      placeholder="e.g., God provides when we trust Him"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Analysis Depth</Label>
                  <RadioGroup
                    value={analysisDepth}
                    onValueChange={(value) => setAnalysisDepth(value as "quick" | "deep" | "full")}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="quick" id="quick" />
                      <Label htmlFor="quick" className="cursor-pointer">Quick Review (2-3 min)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="deep" id="deep" />
                      <Label htmlFor="deep" className="cursor-pointer">Deep Analysis (5-7 min)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="full" id="full" />
                      <Label htmlFor="full" className="cursor-pointer">Full PT Treatment (10+ min)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button 
                  onClick={analyzeSermon} 
                  disabled={isAnalyzing || sermonText.length < 50}
                  className="w-full gap-2"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing Your Sermon...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      🔍 Analyze My Sermon
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Results Section */}
          {analysis && (
            <div className="space-y-4">
              {/* Header with save and re-analyze buttons */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  🪞 Sermon Polish Report
                </h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => saveAnalysis(analysis)}
                    disabled={isSaving}
                    className="gap-1"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckSquare className="w-3 h-3" />
                        Save Polish
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setAnalysis(null)}>
                    Analyze Another
                  </Button>
                </div>
              </div>

              {/* Snapshot */}
              <Collapsible open={expandedSections.snapshot} onOpenChange={() => toggleSection("snapshot")}>
                <Card>
                  <SectionHeader icon={TrendingUp} title="Sermon Snapshot" section="snapshot" emoji="📊" />
                  <CollapsibleContent>
                    <CardContent className="pt-0 space-y-4">
                      <ScoreBar 
                        score={analysis.snapshot.structureScore} 
                        label="Structure Score" 
                        note={analysis.snapshot.structureNote} 
                      />
                      <ScoreBar 
                        score={analysis.snapshot.scriptureDensity} 
                        label="Scripture Density" 
                        note={analysis.snapshot.scriptureDensityNote} 
                      />
                      <ScoreBar 
                        score={analysis.snapshot.christConnection} 
                        label="Christ Connection" 
                        note={analysis.snapshot.christConnectionNote} 
                      />
                      <ScoreBar 
                        score={analysis.snapshot.applicationClarity} 
                        label="Application Clarity" 
                        note={analysis.snapshot.applicationClarityNote} 
                      />
                      <ScoreBar 
                        score={analysis.snapshot.emotionalArc} 
                        label="Emotional Arc" 
                        note={analysis.snapshot.emotionalArcNote} 
                      />
                      <div className="grid grid-cols-3 gap-4 pt-2 text-sm">
                        <div className="text-center p-2 bg-muted rounded">
                          <p className="font-semibold">{analysis.snapshot.estimatedLength}</p>
                          <p className="text-xs text-muted-foreground">Est. Length</p>
                        </div>
                        <div className="text-center p-2 bg-muted rounded">
                          <p className="font-semibold">{analysis.snapshot.pointCount}</p>
                          <p className="text-xs text-muted-foreground">Structure</p>
                        </div>
                        <div className="text-center p-2 bg-muted rounded">
                          <p className="font-semibold">{analysis.snapshot.scriptureReferences}</p>
                          <p className="text-xs text-muted-foreground">Scripture Refs</p>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Amplify */}
              <Collapsible open={expandedSections.amplify} onOpenChange={() => toggleSection("amplify")}>
                <Card>
                  <SectionHeader icon={Sparkles} title="Connections You Can Amplify" section="amplify" emoji="🔗" />
                  <CollapsibleContent>
                    <CardContent className="pt-0 space-y-4">
                      {analysis.amplify.map((item, i) => (
                        <div key={i} className="p-3 bg-gradient-to-r from-purple-50 to-transparent dark:from-purple-950/20 rounded-lg border-l-4 border-purple-500">
                          <p className="text-sm italic text-muted-foreground mb-1">"{item.quote}"</p>
                          <p className="text-sm font-medium">✨ {item.insight}</p>
                          <p className="text-sm text-primary mt-1">→ {item.suggestion}</p>
                        </div>
                      ))}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Missed Opportunities */}
              <Collapsible open={expandedSections.missed} onOpenChange={() => toggleSection("missed")}>
                <Card>
                  <SectionHeader icon={Search} title="Connections You May Have Missed" section="missed" emoji="🔍" />
                  <CollapsibleContent>
                    <CardContent className="pt-0 space-y-4">
                      {analysis.missed.typological.length > 0 && (
                        <div>
                          <h4 className="font-medium flex items-center gap-2 mb-2">📖 Typological</h4>
                          <ul className="space-y-1 text-sm">
                            {analysis.missed.typological.map((item, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-primary">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {analysis.missed.sanctuary.length > 0 && (
                        <div>
                          <h4 className="font-medium flex items-center gap-2 mb-2">🏛️ Sanctuary</h4>
                          <ul className="space-y-1 text-sm">
                            {analysis.missed.sanctuary.map((item, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-primary">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {analysis.missed.prophetic.length > 0 && (
                        <div>
                          <h4 className="font-medium flex items-center gap-2 mb-2">📅 Prophetic</h4>
                          <ul className="space-y-1 text-sm">
                            {analysis.missed.prophetic.map((item, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-primary">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {analysis.missed.threeHeavens.length > 0 && (
                        <div>
                          <h4 className="font-medium flex items-center gap-2 mb-2">🌍 Three Heavens Application</h4>
                          <ul className="space-y-1 text-sm">
                            {analysis.missed.threeHeavens.map((item, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-primary">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Tighten */}
              <Collapsible open={expandedSections.tighten} onOpenChange={() => toggleSection("tighten")}>
                <Card>
                  <SectionHeader icon={Scissors} title="Tighten Your Message" section="tighten" emoji="✂️" />
                  <CollapsibleContent>
                    <CardContent className="pt-0 space-y-4">
                      {analysis.tighten.cut.length > 0 && (
                        <div>
                          <h4 className="font-medium text-red-600 mb-2">🔴 Cut or Condense</h4>
                          <ul className="space-y-1 text-sm">
                            {analysis.tighten.cut.map((item, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-red-500">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {analysis.tighten.clarify.length > 0 && (
                        <div>
                          <h4 className="font-medium text-yellow-600 mb-2">🟡 Clarify</h4>
                          <ul className="space-y-1 text-sm">
                            {analysis.tighten.clarify.map((item, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-yellow-500">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {analysis.tighten.strengthen.length > 0 && (
                        <div>
                          <h4 className="font-medium text-green-600 mb-2">🟢 Strengthen</h4>
                          <ul className="space-y-1 text-sm">
                            {analysis.tighten.strengthen.map((item, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-green-500">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Arc Analysis */}
              <Collapsible open={expandedSections.arc} onOpenChange={() => toggleSection("arc")}>
                <Card>
                  <SectionHeader icon={TrendingUp} title="Sermon Arc Analysis" section="arc" emoji="📈" />
                  <CollapsibleContent>
                    <CardContent className="pt-0 space-y-3">
                      <div className="p-3 bg-muted rounded-lg">
                        <h4 className="font-medium mb-1">Current Flow</h4>
                        <p className="text-sm text-muted-foreground">{analysis.arc.currentFlow}</p>
                      </div>
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border-l-4 border-yellow-500">
                        <h4 className="font-medium mb-1 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-600" />
                          Issue
                        </h4>
                        <p className="text-sm">{analysis.arc.issue}</p>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border-l-4 border-green-500">
                        <h4 className="font-medium mb-1">Suggested Fix</h4>
                        <p className="text-sm">{analysis.arc.suggestedFix}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <strong>Climax Position:</strong> {analysis.arc.climaxPosition}
                      </p>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* PT Enhancement */}
              <Collapsible open={expandedSections.pt} onOpenChange={() => toggleSection("pt")}>
                <Card>
                  <SectionHeader icon={Church} title="PhotoTheology Enhancement" section="pt" emoji="🏛️" />
                  <CollapsibleContent>
                    <CardContent className="pt-0 space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <span className="text-sm font-medium">Currently Using:</span>
                        {analysis.ptEnhancement.currentDimensions.map((dim, i) => (
                          <span key={i} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded text-xs">
                            ✓ {dim}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-sm font-medium">Could Add:</span>
                        {analysis.ptEnhancement.missingDimensions.map((dim, i) => (
                          <span key={i} className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs">
                            ○ {dim}
                          </span>
                        ))}
                      </div>

                      {Object.entries(analysis.ptEnhancement.suggestions).map(([room, items]) => (
                        items.length > 0 && (
                          <div key={room} className="pt-2">
                            <h4 className="font-medium text-sm mb-1 capitalize">
                              {room.replace(/([A-Z])/g, ' $1').trim()}
                            </h4>
                            <ul className="space-y-1 text-sm">
                              {items.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-muted-foreground">
                                  <span className="text-primary">•</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )
                      ))}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Checklist */}
              <Collapsible open={expandedSections.checklist} onOpenChange={() => toggleSection("checklist")}>
                <Card>
                  <SectionHeader icon={CheckSquare} title="Pre-Delivery Checklist" section="checklist" emoji="✅" />
                  <CollapsibleContent>
                    <CardContent className="pt-0 grid gap-4 sm:grid-cols-2">
                      <div>
                        <h4 className="font-medium mb-2">Structure</h4>
                        <ul className="space-y-1 text-sm">
                          {analysis.checklist.structure.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-muted-foreground">□</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Content</h4>
                        <ul className="space-y-1 text-sm">
                          {analysis.checklist.content.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-muted-foreground">□</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Delivery</h4>
                        <ul className="space-y-1 text-sm">
                          {analysis.checklist.delivery.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-muted-foreground">□</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Spiritual</h4>
                        <ul className="space-y-1 text-sm">
                          {analysis.checklist.spiritual.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-muted-foreground">□</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
