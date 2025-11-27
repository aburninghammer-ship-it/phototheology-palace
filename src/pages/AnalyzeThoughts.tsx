import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Lightbulb, Send, BookOpen, Target, TrendingUp, Sparkles, Building2, Link2, Loader2,
  ChevronDown, AlertTriangle, CheckCircle2, BookMarked, Layers, Shield, GraduationCap,
  Church, Cross, Moon, Scale, Compass, Save, Download, Copy
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AnalysisResult {
  summary: string;
  overallScore: number;
  categories: {
    biblicalAccuracy: number;
    theologicalDepth: number;
    christCenteredness: number;
    practicalApplication: number;
    doctrinalSoundness: number;
    sanctuaryHarmony: number;
  };
  strengths: string[];
  growthAreas: string[];
  palaceRooms: {
    code: string;
    name: string;
    relevance: string;
  }[];
  scriptureConnections: {
    reference: string;
    connection: string;
  }[];
  typologyLayers: {
    symbol: string;
    meaning: string;
    reference: string;
  }[];
  potentialMisinterpretations: string[];
  alignmentCheck: {
    status: "aligned" | "caution" | "concern";
    notes: string;
  };
  furtherStudy: string[];
  encouragement: string;
}

const scriptureSuggestions = [
  { label: "Sanctuary Typology", icon: Church, prompt: "Consider how this connects to the sanctuary services and furniture." },
  { label: "Gospel/Cross", icon: Cross, prompt: "Explore how this points to Christ's sacrifice and the gospel." },
  { label: "Prophetic Link", icon: Moon, prompt: "Look for connections to Daniel and Revelation prophecies." },
  { label: "Great Controversy", icon: Scale, prompt: "Consider the cosmic conflict dimension of this truth." },
];

const checklistItems = [
  { id: "scripture", label: "Is it rooted in Scripture?", icon: BookOpen },
  { id: "christ", label: "Is it consistent with the character of Christ?", icon: Cross },
  { id: "sanctuary", label: "Does it harmonize with the sanctuary pattern?", icon: Church },
  { id: "private", label: "Does it avoid private interpretations?", icon: Shield },
  { id: "humble", label: "Is it presented humbly, not dogmatically?", icon: Scale },
];

const AnalyzeThoughts = () => {
  const [input, setInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

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

      // The edge function returns { analysis: {...} }
      let analysisResult: AnalysisResult;
      if (data.analysis) {
        analysisResult = data.analysis;
      } else if (data.response) {
        if (typeof data.response === 'string') {
          try {
            analysisResult = JSON.parse(data.response);
          } catch {
            toast.error("Failed to parse analysis. Please try again.");
            return;
          }
        } else {
          analysisResult = data.response;
        }
      } else {
        console.error("Unexpected response format:", data);
        toast.error("Unexpected response format. Please try again.");
        return;
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

  const addSuggestion = (prompt: string) => {
    setInput(prev => prev + (prev ? "\n\n" : "") + prompt);
    toast.success("Suggestion added");
  };

  const toggleCheckItem = (id: string) => {
    setCheckedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSaveAnalysis = async () => {
    if (!result) return;
    
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to save your analysis");
        return;
      }

      const { error } = await supabase.from('gems').insert({
        user_id: user.id,
        title: `Thought Analysis - ${new Date().toLocaleDateString()}`,
        verse1: input.substring(0, 500),
        verse2: result.summary || '',
        verse3: result.encouragement || '',
        connection_explanation: JSON.stringify({
          overallScore: result.overallScore,
          strengths: result.strengths,
          growthAreas: result.growthAreas,
          palaceRooms: result.palaceRooms,
          scriptureConnections: result.scriptureConnections
        }),
        principle_codes: result.palaceRooms?.map(r => r.code) || []
      });

      if (error) throw error;
      toast.success("Analysis saved to your gems!");
    } catch (error) {
      console.error('Save error:', error);
      toast.error("Failed to save analysis");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    if (!result) return;
    
    const content = `PHOTOTHEOLOGY THOUGHT ANALYSIS
==============================
Date: ${new Date().toLocaleString()}

YOUR THOUGHT:
${input}

SUMMARY:
${result.summary || 'N/A'}

OVERALL SCORE: ${result.overallScore}/100

CATEGORY SCORES:
- Biblical Accuracy: ${result.categories?.biblicalAccuracy || 0}%
- Theological Depth: ${result.categories?.theologicalDepth || 0}%
- Christ-Centeredness: ${result.categories?.christCenteredness || 0}%
- Practical Application: ${result.categories?.practicalApplication || 0}%
- Doctrinal Soundness: ${result.categories?.doctrinalSoundness || 0}%
- Sanctuary Harmony: ${result.categories?.sanctuaryHarmony || 0}%

THEOLOGICAL ALIGNMENT: ${result.alignmentCheck?.status?.toUpperCase() || 'N/A'}
${result.alignmentCheck?.notes || ''}

STRENGTHS:
${result.strengths?.map(s => `• ${s}`).join('\n') || 'N/A'}

AREAS FOR GROWTH:
${result.growthAreas?.map(a => `• ${a}`).join('\n') || 'N/A'}

PALACE ROOM MAPPING:
${result.palaceRooms?.map(r => `• [${r.code}] ${r.name}: ${r.relevance}`).join('\n') || 'N/A'}

SCRIPTURE CONNECTIONS:
${result.scriptureConnections?.map(s => `• ${s.reference}: ${s.connection}`).join('\n') || 'N/A'}

ENCOURAGEMENT:
${result.encouragement || 'N/A'}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thought-analysis-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Analysis exported!");
  };

  const handleCopy = () => {
    if (!result) return;
    const content = `Thought Analysis (Score: ${result.overallScore}/100)\n\nStrengths:\n${result.strengths?.join('\n')}\n\nGrowth Areas:\n${result.growthAreas?.join('\n')}\n\nEncouragement:\n${result.encouragement}`;
    navigator.clipboard.writeText(content);
    toast.success("Copied!");
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "from-emerald-500 to-emerald-400";
    if (score >= 60) return "from-amber-500 to-amber-400";
    if (score >= 40) return "from-orange-500 to-orange-400";
    return "from-red-500 to-red-400";
  };

  const getAlignmentBadge = (status: string) => {
    switch (status) {
      case "aligned":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-3 py-1"><CheckCircle2 className="h-3 w-3 mr-1" /> Aligned</Badge>;
      case "caution":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 px-3 py-1"><AlertTriangle className="h-3 w-3 mr-1" /> Caution</Badge>;
      case "concern":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30 px-3 py-1"><AlertTriangle className="h-3 w-3 mr-1" /> Concern</Badge>;
      default:
        return null;
    }
  };

  const categoryLabels: Record<string, { label: string; icon: React.ReactNode }> = {
    biblicalAccuracy: { label: "Biblical Accuracy", icon: <BookOpen className="h-4 w-4" /> },
    theologicalDepth: { label: "Theological Depth", icon: <Layers className="h-4 w-4" /> },
    christCenteredness: { label: "Christ-Centeredness", icon: <Cross className="h-4 w-4" /> },
    practicalApplication: { label: "Practical Application", icon: <Target className="h-4 w-4" /> },
    doctrinalSoundness: { label: "Doctrinal Soundness", icon: <Shield className="h-4 w-4" /> },
    sanctuaryHarmony: { label: "Sanctuary Harmony", icon: <Compass className="h-4 w-4" /> },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>
      
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center gap-3 mb-4 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30">
            <Lightbulb className="h-8 w-8 text-amber-400 animate-pulse" />
            <h1 className="text-3xl md:text-4xl font-serif font-bold bg-gradient-to-r from-amber-200 via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Analyze My Thoughts
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Share your biblical ideas and receive comprehensive feedback grounded in 
            <span className="text-purple-400 font-medium"> Phototheology principles</span> and sound biblical hermeneutics.
          </p>
        </div>

        <Card className="mb-8 bg-card/80 backdrop-blur-sm border-purple-500/20 shadow-xl shadow-purple-500/5">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <span className="bg-gradient-to-r from-amber-200 to-purple-200 bg-clip-text text-transparent">Share Your Thoughts</span>
            </CardTitle>
            <CardDescription>Enter a biblical concept, interpretation, or theological idea you'd like analyzed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="relative">
              <Textarea
                placeholder="Example: I believe the sanctuary in Hebrews represents Christ's mediatorial work in heaven..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[150px] bg-background/50 border-purple-500/20 focus:border-purple-500/50"
              />
              <div className="absolute bottom-3 right-3 text-xs text-muted-foreground/50">{input.length} chars</div>
            </div>
            
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground">Add layer:</span>
              {scriptureSuggestions.map((s) => (
                <Button key={s.label} variant="outline" size="sm" onClick={() => addSuggestion(s.prompt)}
                  className="text-xs bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20">
                  <s.icon className="h-3 w-3 mr-1 text-purple-400" />{s.label}
                </Button>
              ))}
            </div>

            <Collapsible open={checklistOpen} onOpenChange={setChecklistOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-between text-muted-foreground hover:bg-purple-500/10">
                  <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" />Before You Submit Checklist</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${checklistOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 p-4 bg-purple-500/5 rounded-lg border border-purple-500/20">
                <div className="space-y-2">
                  {checklistItems.map((item) => (
                    <label key={item.id} className="flex items-center gap-3 cursor-pointer hover:bg-purple-500/10 p-2 rounded" onClick={() => toggleCheckItem(item.id)}>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${checkedItems.includes(item.id) ? 'bg-emerald-500 border-emerald-400' : 'border-muted-foreground/30'}`}>
                        {checkedItems.includes(item.id) && <CheckCircle2 className="h-3 w-3 text-white" />}
                      </div>
                      <item.icon className="h-4 w-4 text-purple-400" />
                      <span className="text-sm">{item.label}</span>
                    </label>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Button onClick={handleAnalyze} disabled={isAnalyzing || !input.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 py-6 text-lg shadow-lg shadow-purple-500/25">
              {isAnalyzing ? <><Loader2 className="h-5 w-5 mr-2 animate-spin" />Analyzing...</> : <><Send className="h-5 w-5 mr-2" />Analyze My Thoughts</>}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-wrap gap-3 justify-center">
              <Button onClick={handleSaveAnalysis} disabled={isSaving} variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}Save to Gems
              </Button>
              <Button onClick={handleExport} variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-400">
                <Download className="h-4 w-4 mr-2" />Export
              </Button>
              <Button onClick={handleCopy} variant="outline" className="bg-purple-500/10 border-purple-500/30 text-purple-400">
                <Copy className="h-4 w-4 mr-2" />Copy
              </Button>
            </div>

            {result.summary && (
              <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-purple-500/20"><BookMarked className="h-5 w-5 text-purple-400" /></div>
                    <div>
                      <p className="font-medium mb-1 text-purple-200">Summary</p>
                      <p className="text-muted-foreground">{result.summary}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-card/80 backdrop-blur-sm border-purple-500/20 shadow-xl">
              <CardHeader className="border-b border-border/50">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-amber-400" />
                    <span className="bg-gradient-to-r from-amber-200 to-purple-200 bg-clip-text text-transparent">Doctrinal Integrity Score</span>
                  </span>
                  <span className={`text-4xl font-bold ${getScoreColor(result.overallScore)}`}>{result.overallScore}<span className="text-lg text-muted-foreground">/100</span></span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {Object.entries(result.categories || {}).map(([key, value]) => {
                    const cat = categoryLabels[key];
                    if (!cat) return null;
                    return (
                      <div key={key} className="space-y-2 p-3 rounded-lg bg-background/30">
                        <div className="flex items-center justify-between">
                          <span className="text-sm flex items-center gap-2"><span className="text-purple-400">{cat.icon}</span>{cat.label}</span>
                          <span className={`text-sm font-bold ${getScoreColor(value)}`}>{value}%</span>
                        </div>
                        <div className="h-2 bg-background/50 rounded-full overflow-hidden">
                          <div className={`h-full bg-gradient-to-r ${getProgressColor(value)}`} style={{ width: `${value}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {result.alignmentCheck && (
              <Card className={`border-l-4 bg-card/80 ${result.alignmentCheck.status === 'aligned' ? 'border-l-emerald-500' : result.alignmentCheck.status === 'caution' ? 'border-l-amber-500' : 'border-l-red-500'}`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    <span className="flex items-center gap-2"><Shield className="h-5 w-5 text-purple-400" />Theological Alignment</span>
                    {getAlignmentBadge(result.alignmentCheck.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent><p className="text-muted-foreground">{result.alignmentCheck.notes}</p></CardContent>
              </Card>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
                <CardHeader><CardTitle className="flex items-center gap-2 text-emerald-400"><TrendingUp className="h-5 w-5" />Strengths</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-2">{(result.strengths || []).map((s, i) => <li key={i} className="flex items-start gap-2"><span className="text-emerald-400">✓</span><span className="text-sm">{s}</span></li>)}</ul>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
                <CardHeader><CardTitle className="flex items-center gap-2 text-amber-400"><Lightbulb className="h-5 w-5" />Growth Areas</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-2">{(result.growthAreas || []).map((a, i) => <li key={i} className="flex items-start gap-2"><span className="text-amber-400">→</span><span className="text-sm">{a}</span></li>)}</ul>
                </CardContent>
              </Card>
            </div>

            {result.potentialMisinterpretations?.length > 0 && (
              <Card className="border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-red-500/5">
                <CardHeader><CardTitle className="flex items-center gap-2 text-orange-400"><AlertTriangle className="h-5 w-5" />Misinterpretations to Avoid</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-2">{result.potentialMisinterpretations.map((w, i) => <li key={i} className="flex items-start gap-2"><span className="text-orange-400">⚠</span><span className="text-sm">{w}</span></li>)}</ul>
                </CardContent>
              </Card>
            )}

            <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
              <CardHeader className="border-b border-border/50">
                <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5 text-purple-400" /><span className="bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">Palace Mapping</span></CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-3">
                  {(result.palaceRooms || []).map((r, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-background/30 border border-purple-500/10">
                      <Badge variant="outline" className="font-mono bg-purple-500/20 text-purple-300 border-purple-500/30">{r.code}</Badge>
                      <div><p className="font-medium text-purple-200">{r.name}</p><p className="text-sm text-muted-foreground">{r.relevance}</p></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {result.typologyLayers?.length > 0 && (
              <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
                <CardHeader className="border-b border-border/50"><CardTitle className="flex items-center gap-2"><Layers className="h-5 w-5 text-blue-400" /><span className="bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">Typology Layers</span></CardTitle></CardHeader>
                <CardContent className="pt-6">
                  <div className="grid gap-3">
                    {result.typologyLayers.map((l, i) => (
                      <div key={i} className="p-4 rounded-lg bg-background/30 border border-blue-500/10">
                        <div className="flex items-center gap-2 mb-2"><Badge className="bg-blue-500/20 text-blue-300">{l.symbol}</Badge><span className="text-blue-400">→</span><span className="font-medium text-blue-200">{l.meaning}</span></div>
                        <p className="text-sm text-muted-foreground">{l.reference}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
              <CardHeader className="border-b border-border/50"><CardTitle className="flex items-center gap-2"><Link2 className="h-5 w-5 text-amber-400" /><span className="bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">Scripture Connections</span></CardTitle></CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-3">
                  {(result.scriptureConnections || []).map((c, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-background/30 border border-amber-500/10">
                      <BookOpen className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                      <div><p className="font-medium text-amber-300">{c.reference}</p><p className="text-sm text-muted-foreground">{c.connection}</p></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {result.furtherStudy?.length > 0 && (
              <Card className="bg-card/80 border-purple-500/20">
                <CardHeader><CardTitle className="flex items-center gap-2"><GraduationCap className="h-5 w-5 text-purple-400" />Further Study</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">{result.furtherStudy.map((t, i) => <Badge key={i} className="py-2 px-4 bg-purple-500/20 border-purple-500/30 text-purple-200">{t}</Badge>)}</div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-amber-500/20 border-purple-500/30 shadow-xl">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-gradient-to-br from-amber-400 to-purple-400 shadow-lg"><Sparkles className="h-6 w-6 text-white" /></div>
                  <div>
                    <p className="font-medium mb-2 text-lg bg-gradient-to-r from-amber-200 via-purple-200 to-blue-200 bg-clip-text text-transparent">Encouragement from Jeeves</p>
                    <p className="text-muted-foreground leading-relaxed">{result.encouragement}</p>
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
