import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Brain, Zap, BookOpen, Target, AlertTriangle,
  Lightbulb, ArrowRight, ChevronDown, ChevronUp,
  Loader2, Send, Save, Trash2, RotateCcw, Gem,
  Eye, Repeat, Church, Cross, Heart, Minimize2,
  CheckCircle2, XCircle, AlertCircle, Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

// Types for Study Buddy analysis
interface Spark {
  type: 'clarifying' | 'anchoring' | 'balancing' | 'escalation';
  snippet: string;
  move: string;
  canConvertToGem: boolean;
}

interface Source {
  claim: string;
  title?: string;
  author?: string;
  type?: 'primary' | 'secondary' | 'interpretive';
  tradition?: 'neutral' | 'interested' | 'adversarial';
  supports?: string;
  confidence?: 'high' | 'medium' | 'low' | 'none';
  counterSource?: string;
  needsSource: boolean;
}

interface ActiveBehavior {
  behavior: string;
  evidence: string;
  strength: 'strong' | 'moderate' | 'weak';
  imbalance: string;
  failureMode: string;
}

interface RoomAnalysis {
  activeBehaviors: ActiveBehavior[];
  weakestLink: string;
}

interface ClaimLadder {
  claim: string;
  textualBasis: string[];
  logicalMove: string;
  historicalAnchor?: string;
  theologicalImplication: string;
  missingRungs: string[];
  canPromoteToGem: boolean;
}

interface NextStep {
  goal: string;
  reasoningStep: string;
  constraint: string;
  steps: string[];
  expectedArtifact: string;
}

interface ModeViolation {
  currentMode: string;
  violation: string;
  correction: string;
}

interface Compression {
  userSentence?: string;
  buddySentence: string;
  differences: string;
  isComplete: boolean;
}

interface StudyAnalysis {
  sparks: Spark[];
  sources: Source[];
  roomAnalysis: RoomAnalysis;
  claimLadder: ClaimLadder | null;
  nextSteps: NextStep[];
  modeViolation: ModeViolation | null;
  compression: Compression | null;
  overallAssessment: string;
}

type StudyMode = 'observation' | 'pattern' | 'sanctuary' | 'christological' | 'application' | null;

const STUDY_MODES = [
  { value: 'observation', label: 'Observation', icon: Eye, description: 'No interpretation allowed - pure observation' },
  { value: 'pattern', label: 'Pattern', icon: Repeat, description: 'Repetition and structure only' },
  { value: 'sanctuary', label: 'Sanctuary', icon: Church, description: 'Priestly action and spatial logic required' },
  { value: 'christological', label: 'Christological', icon: Cross, description: 'Christ must be located, not assumed' },
  { value: 'application', label: 'Application', icon: Heart, description: 'Only after interpretation stabilizes' },
];

const SPARK_COLORS = {
  clarifying: 'bg-blue-500/20 border-blue-500/50 text-blue-200',
  anchoring: 'bg-amber-500/20 border-amber-500/50 text-amber-200',
  balancing: 'bg-purple-500/20 border-purple-500/50 text-purple-200',
  escalation: 'bg-red-500/20 border-red-500/50 text-red-200',
};

const SPARK_ICONS = {
  clarifying: Lightbulb,
  anchoring: Target,
  balancing: RotateCcw,
  escalation: ArrowRight,
};

export default function StudyBuddy() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [notes, setNotes] = useState("");
  const [sessionTitle, setSessionTitle] = useState("");
  const [studyMode, setStudyMode] = useState<StudyMode>(null);
  const [analysis, setAnalysis] = useState<StudyAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [sessionHistory, setSessionHistory] = useState<string[]>([]);
  const [compressionAttempt, setCompressionAttempt] = useState("");
  const [showCompressionDialog, setShowCompressionDialog] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    sparks: true,
    sources: true,
    roomAnalysis: true,
    claimLadder: true,
    nextSteps: true,
  });
  const [activeTab, setActiveTab] = useState("notes");
  const [savedSessions, setSavedSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadSavedSessions();
    }
  }, [user]);

  const loadSavedSessions = async () => {
    setLoadingSessions(true);
    try {
      const { data, error } = await supabase
        .from("study_sessions")
        .select("*")
        .eq("user_id", user?.id)
        .order("updated_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setSavedSessions(data || []);
    } catch (error) {
      console.error("Error loading sessions:", error);
    } finally {
      setLoadingSessions(false);
    }
  };

  const analyzeNotes = async () => {
    if (!notes.trim() || notes.length < 20) {
      toast.error("Please write at least 20 characters of study notes");
      return;
    }

    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("study-buddy", {
        body: {
          notes,
          mode: studyMode,
          sessionHistory,
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setAnalysis(data.analysis);

      // Add to session history
      setSessionHistory(prev => [...prev, notes]);

      toast.success("Analysis complete!");
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast.error(error.message || "Failed to analyze notes");
    } finally {
      setAnalyzing(false);
    }
  };

  const requestCompression = async () => {
    if (!compressionAttempt.trim()) {
      toast.error("Please write your compression attempt");
      return;
    }

    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("study-buddy", {
        body: {
          notes,
          mode: studyMode,
          sessionHistory,
          requestCompression: true,
          userCompression: compressionAttempt,
        },
      });

      if (error) throw error;

      setAnalysis(data.analysis);
      setShowCompressionDialog(false);
      toast.success("Compression evaluated!");
    } catch (error: any) {
      console.error("Compression error:", error);
      toast.error(error.message || "Failed to evaluate compression");
    } finally {
      setAnalyzing(false);
    }
  };

  const saveSession = async () => {
    if (!notes.trim()) {
      toast.error("No notes to save");
      return;
    }

    try {
      const sessionData = {
        user_id: user?.id,
        title: sessionTitle || `Study Session ${new Date().toLocaleDateString()}`,
        notes,
        mode: studyMode,
        analysis: analysis,
        session_history: sessionHistory,
      };

      const { error } = await supabase.from("study_sessions").insert(sessionData);

      if (error) throw error;

      toast.success("Session saved!");
      loadSavedSessions();
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error.message || "Failed to save session");
    }
  };

  const loadSession = (session: any) => {
    setNotes(session.notes || "");
    setSessionTitle(session.title || "");
    setStudyMode(session.mode || null);
    setAnalysis(session.analysis || null);
    setSessionHistory(session.session_history || []);
    setActiveTab("notes");
    toast.success("Session loaded!");
  };

  const clearSession = () => {
    setNotes("");
    setSessionTitle("");
    setStudyMode(null);
    setAnalysis(null);
    setSessionHistory([]);
    setCompressionAttempt("");
  };

  const addToNotes = (text: string) => {
    setNotes(prev => prev + (prev ? "\n\n" : "") + text);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation />

      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Study Buddy</h1>
                <p className="text-slate-400">Method-Enforcement Engine for Rigorous Bible Study</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={clearSession}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
              <Button
                onClick={saveSession}
                className="bg-amber-600 hover:bg-amber-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Session
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Panel - Notes & Controls */}
          <div className="lg:col-span-2 space-y-4">
            {/* Mode Dial */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-300">Study Mode:</span>
                    <Select value={studyMode || "none"} onValueChange={(v) => setStudyMode(v === "none" ? null : v as StudyMode)}>
                      <SelectTrigger className="w-[200px] bg-slate-700/50 border-slate-600">
                        <SelectValue placeholder="Select mode..." />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="none">No Mode (Free Study)</SelectItem>
                        {STUDY_MODES.map(mode => (
                          <SelectItem key={mode.value} value={mode.value}>
                            <div className="flex items-center gap-2">
                              <mode.icon className="w-4 h-4" />
                              {mode.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {studyMode && (
                    <p className="text-xs text-slate-400">
                      {STUDY_MODES.find(m => m.value === studyMode)?.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Notes Editor */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-500" />
                    Study Notes
                  </CardTitle>
                  <Input
                    placeholder="Session title..."
                    value={sessionTitle}
                    onChange={(e) => setSessionTitle(e.target.value)}
                    className="w-48 bg-slate-700/50 border-slate-600 text-sm"
                  />
                </div>
                <CardDescription className="text-slate-400">
                  Write your observations, claims, and questions. Use markers like CLAIM:, QUESTION:, GEM:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Begin your study notes here...

Use markers to structure your thinking:
CLAIM: A statement you're making
QUESTION: Something you're wondering
GEM: A connection you've discovered
OBSERVATION: What you notice in the text

Example:
John 3:14-15 - Jesus compares himself to the bronze serpent

OBSERVATION: Moses lifted up the serpent in the wilderness
CLAIM: This is a typological connection between Numbers 21 and John 3
QUESTION: What other 'lifting up' imagery exists in John's gospel?"
                  className="min-h-[400px] bg-slate-700/30 border-slate-600 text-slate-100 font-mono text-sm"
                />

                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-400">
                    {notes.length} characters | {notes.split(/\s+/).filter(Boolean).length} words
                  </div>
                  <div className="flex items-center gap-2">
                    <Dialog open={showCompressionDialog} onOpenChange={setShowCompressionDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="border-slate-600 text-slate-300">
                          <Minimize2 className="w-4 h-4 mr-2" />
                          Compress
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-800 border-slate-700">
                        <DialogHeader>
                          <DialogTitle className="text-white">Compression Challenge</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-slate-300 text-sm">
                            Compress today's work into ONE sentence without loss of meaning.
                          </p>
                          <Textarea
                            value={compressionAttempt}
                            onChange={(e) => setCompressionAttempt(e.target.value)}
                            placeholder="Your one-sentence compression..."
                            className="bg-slate-700/50 border-slate-600 text-slate-100"
                          />
                        </div>
                        <DialogFooter>
                          <Button onClick={requestCompression} disabled={analyzing}>
                            {analyzing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                            Evaluate
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button
                      onClick={analyzeNotes}
                      disabled={analyzing || notes.length < 20}
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      {analyzing ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      Analyze
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Saved Sessions */}
            <Collapsible>
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <CardTitle className="text-white text-sm flex items-center gap-2">
                      <Search className="w-4 h-4 text-slate-400" />
                      Previous Sessions ({savedSessions.length})
                    </CardTitle>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    {loadingSessions ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
                      </div>
                    ) : savedSessions.length === 0 ? (
                      <p className="text-sm text-slate-500 text-center py-4">No saved sessions yet</p>
                    ) : (
                      <ScrollArea className="h-[200px]">
                        <div className="space-y-2">
                          {savedSessions.map((session) => (
                            <div
                              key={session.id}
                              onClick={() => loadSession(session)}
                              className="p-3 bg-slate-700/30 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-slate-200 text-sm">{session.title}</span>
                                {session.mode && (
                                  <Badge variant="outline" className="text-xs border-slate-600">
                                    {session.mode}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                                {session.notes?.substring(0, 100)}...
                              </p>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </div>

          {/* Right Panel - Analysis Results */}
          <div className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full bg-slate-800/50 border border-slate-700/50">
                <TabsTrigger value="notes" className="flex-1 data-[state=active]:bg-amber-600">
                  Analysis
                </TabsTrigger>
                <TabsTrigger value="ladder" className="flex-1 data-[state=active]:bg-amber-600">
                  Ladder
                </TabsTrigger>
              </TabsList>

              <TabsContent value="notes" className="mt-4 space-y-4">
                {!analysis ? (
                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardContent className="p-8 text-center">
                      <Brain className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400">
                        Write your study notes and click "Analyze" to get feedback.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    {/* Mode Violation Alert */}
                    {analysis.modeViolation && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Card className="bg-red-900/30 border-red-500/50">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-red-300">Mode Violation</h4>
                                <p className="text-sm text-red-200 mt-1">{analysis.modeViolation.violation}</p>
                                <p className="text-sm text-red-300 mt-2">
                                  <strong>Correction:</strong> {analysis.modeViolation.correction}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}

                    {/* Overall Assessment */}
                    <Card className="bg-slate-800/50 border-slate-700/50">
                      <CardContent className="p-4">
                        <p className="text-slate-200 text-sm">{analysis.overallAssessment}</p>
                      </CardContent>
                    </Card>

                    {/* Sparks */}
                    <Collapsible open={expandedSections.sparks} onOpenChange={() => toggleSection('sparks')}>
                      <Card className="bg-slate-800/50 border-slate-700/50">
                        <CollapsibleTrigger className="w-full">
                          <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <CardTitle className="text-white text-sm flex items-center gap-2">
                              <Zap className="w-4 h-4 text-amber-500" />
                              Sparks ({analysis.sparks.length})
                            </CardTitle>
                            {expandedSections.sparks ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <CardContent className="pt-0 space-y-3">
                            <AnimatePresence>
                              {analysis.sparks.map((spark, idx) => {
                                const SparkIcon = SPARK_ICONS[spark.type];
                                return (
                                  <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`p-3 rounded-lg border ${SPARK_COLORS[spark.type]}`}
                                  >
                                    <div className="flex items-start gap-2">
                                      <SparkIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <Badge variant="outline" className="text-xs capitalize">
                                            {spark.type}
                                          </Badge>
                                          {spark.canConvertToGem && (
                                            <Badge className="text-xs bg-purple-600">
                                              <Gem className="w-3 h-3 mr-1" />
                                              GEM-ready
                                            </Badge>
                                          )}
                                        </div>
                                        {spark.snippet && (
                                          <p className="text-xs opacity-70 italic mb-1">"{spark.snippet}"</p>
                                        )}
                                        <p className="text-sm">{spark.move}</p>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="mt-2 text-xs h-7"
                                          onClick={() => addToNotes(`\n\n[SPARK - ${spark.type}]: ${spark.move}`)}
                                        >
                                          Add to Notes
                                        </Button>
                                      </div>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </AnimatePresence>
                          </CardContent>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>

                    {/* Sources */}
                    {analysis.sources.length > 0 && (
                      <Collapsible open={expandedSections.sources} onOpenChange={() => toggleSection('sources')}>
                        <Card className="bg-slate-800/50 border-slate-700/50">
                          <CollapsibleTrigger className="w-full">
                            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                              <CardTitle className="text-white text-sm flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-blue-500" />
                                Sources ({analysis.sources.length})
                              </CardTitle>
                              {expandedSections.sources ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </CardHeader>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <CardContent className="pt-0 space-y-3">
                              {analysis.sources.map((source, idx) => (
                                <div key={idx} className="p-3 bg-slate-700/30 rounded-lg">
                                  <p className="text-sm text-slate-300 italic mb-2">"{source.claim}"</p>
                                  {source.needsSource ? (
                                    <div className="flex items-center gap-2 text-amber-400">
                                      <AlertCircle className="w-4 h-4" />
                                      <span className="text-sm">NEEDS SOURCE</span>
                                    </div>
                                  ) : source.title ? (
                                    <div className="text-sm space-y-1">
                                      <p className="text-slate-200 font-medium">{source.title}</p>
                                      {source.author && <p className="text-slate-400">{source.author}</p>}
                                      <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="outline" className="text-xs">{source.type}</Badge>
                                        <Badge variant="outline" className="text-xs">{source.tradition}</Badge>
                                        <Badge
                                          variant="outline"
                                          className={`text-xs ${
                                            source.confidence === 'high' ? 'border-green-500 text-green-400' :
                                            source.confidence === 'medium' ? 'border-yellow-500 text-yellow-400' :
                                            'border-red-500 text-red-400'
                                          }`}
                                        >
                                          {source.confidence} confidence
                                        </Badge>
                                      </div>
                                    </div>
                                  ) : null}
                                </div>
                              ))}
                            </CardContent>
                          </CollapsibleContent>
                        </Card>
                      </Collapsible>
                    )}

                    {/* Room Analysis */}
                    <Collapsible open={expandedSections.roomAnalysis} onOpenChange={() => toggleSection('roomAnalysis')}>
                      <Card className="bg-slate-800/50 border-slate-700/50">
                        <CollapsibleTrigger className="w-full">
                          <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <CardTitle className="text-white text-sm flex items-center gap-2">
                              <Target className="w-4 h-4 text-purple-500" />
                              Room Analysis
                            </CardTitle>
                            {expandedSections.roomAnalysis ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <CardContent className="pt-0 space-y-3">
                            {analysis.roomAnalysis.activeBehaviors.map((behavior, idx) => (
                              <div key={idx} className="p-3 bg-slate-700/30 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-slate-200">{behavior.behavior}</span>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${
                                      behavior.strength === 'strong' ? 'border-green-500 text-green-400' :
                                      behavior.strength === 'moderate' ? 'border-yellow-500 text-yellow-400' :
                                      'border-red-500 text-red-400'
                                    }`}
                                  >
                                    {behavior.strength}
                                  </Badge>
                                </div>
                                <p className="text-xs text-slate-400 italic mb-1">"{behavior.evidence}"</p>
                                <p className="text-xs text-amber-400">Imbalance: {behavior.imbalance}</p>
                                <p className="text-xs text-red-400">Risk: {behavior.failureMode}</p>
                              </div>
                            ))}

                            {analysis.roomAnalysis.weakestLink && (
                              <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                                <div className="flex items-start gap-2">
                                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <h4 className="text-sm font-medium text-red-300">Weakest Link</h4>
                                    <p className="text-sm text-red-200 mt-1">{analysis.roomAnalysis.weakestLink}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>

                    {/* Next Steps */}
                    <Collapsible open={expandedSections.nextSteps} onOpenChange={() => toggleSection('nextSteps')}>
                      <Card className="bg-slate-800/50 border-slate-700/50">
                        <CollapsibleTrigger className="w-full">
                          <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <CardTitle className="text-white text-sm flex items-center gap-2">
                              <ArrowRight className="w-4 h-4 text-green-500" />
                              Next Steps ({analysis.nextSteps.length})
                            </CardTitle>
                            {expandedSections.nextSteps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <CardContent className="pt-0 space-y-3">
                            {analysis.nextSteps.map((step, idx) => (
                              <div key={idx} className="p-3 bg-slate-700/30 rounded-lg">
                                <h4 className="text-sm font-medium text-green-400 mb-2">{step.goal}</h4>
                                <p className="text-xs text-slate-300 mb-2">
                                  <strong>Reasoning:</strong> {step.reasoningStep}
                                </p>
                                <p className="text-xs text-red-400 mb-2">
                                  <strong>Constraint:</strong> {step.constraint}
                                </p>
                                <div className="space-y-1">
                                  {step.steps.map((s, i) => (
                                    <p key={i} className="text-xs text-slate-400">
                                      {i + 1}. {s}
                                    </p>
                                  ))}
                                </div>
                                <p className="text-xs text-amber-400 mt-2">
                                  <strong>Expected Output:</strong> {step.expectedArtifact}
                                </p>
                              </div>
                            ))}
                          </CardContent>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>

                    {/* Compression Result */}
                    {analysis.compression && (
                      <Card className="bg-slate-800/50 border-slate-700/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-white text-sm flex items-center gap-2">
                            <Minimize2 className="w-4 h-4 text-cyan-500" />
                            Compression Evaluation
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {analysis.compression.userSentence && (
                            <div className="p-3 bg-slate-700/30 rounded-lg">
                              <p className="text-xs text-slate-400 mb-1">Your compression:</p>
                              <p className="text-sm text-slate-200">"{analysis.compression.userSentence}"</p>
                            </div>
                          )}
                          <div className="p-3 bg-cyan-900/20 border border-cyan-500/30 rounded-lg">
                            <p className="text-xs text-cyan-400 mb-1">Study Buddy's compression:</p>
                            <p className="text-sm text-cyan-200">"{analysis.compression.buddySentence}"</p>
                          </div>
                          <div className="p-3 bg-slate-700/30 rounded-lg">
                            <p className="text-xs text-slate-400 mb-1">Differences:</p>
                            <p className="text-sm text-slate-200">{analysis.compression.differences}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {analysis.compression.isComplete ? (
                              <>
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span className="text-sm text-green-400">Clarity achieved!</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-5 h-5 text-red-500" />
                                <span className="text-sm text-red-400">Clarity incomplete. Continue refining.</span>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </TabsContent>

              <TabsContent value="ladder" className="mt-4">
                {!analysis?.claimLadder ? (
                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardContent className="p-8 text-center">
                      <Target className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400">
                        No claim ladder detected yet. Add claims with CLAIM: markers in your notes.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white flex items-center gap-2">
                          <Target className="w-5 h-5 text-amber-500" />
                          Claim Ladder
                        </CardTitle>
                        {analysis.claimLadder.canPromoteToGem && (
                          <Badge className="bg-purple-600">
                            <Gem className="w-3 h-3 mr-1" />
                            Ready for GEM
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Claim */}
                      <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                        <p className="text-xs text-amber-400 mb-1">CLAIM</p>
                        <p className="text-slate-200">{analysis.claimLadder.claim}</p>
                      </div>

                      {/* Arrow */}
                      <div className="flex justify-center">
                        <ChevronDown className="w-6 h-6 text-slate-500" />
                      </div>

                      {/* Textual Basis */}
                      <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <p className="text-xs text-blue-400 mb-1">TEXTUAL BASIS</p>
                        {analysis.claimLadder.textualBasis.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {analysis.claimLadder.textualBasis.map((verse, idx) => (
                              <Badge key={idx} variant="outline" className="border-blue-500/50 text-blue-300">
                                {verse}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-red-400 text-sm">Missing textual basis!</p>
                        )}
                      </div>

                      {/* Arrow */}
                      <div className="flex justify-center">
                        <ChevronDown className="w-6 h-6 text-slate-500" />
                      </div>

                      {/* Logical Move */}
                      <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                        <p className="text-xs text-purple-400 mb-1">LOGICAL MOVE</p>
                        <p className="text-slate-200">
                          {analysis.claimLadder.logicalMove || <span className="text-red-400">Missing logical move!</span>}
                        </p>
                      </div>

                      {/* Arrow */}
                      <div className="flex justify-center">
                        <ChevronDown className="w-6 h-6 text-slate-500" />
                      </div>

                      {/* Historical Anchor */}
                      <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <p className="text-xs text-green-400 mb-1">HISTORICAL ANCHOR</p>
                        <p className="text-slate-200">
                          {analysis.claimLadder.historicalAnchor || <span className="text-slate-500 italic">N/A for this claim</span>}
                        </p>
                      </div>

                      {/* Arrow */}
                      <div className="flex justify-center">
                        <ChevronDown className="w-6 h-6 text-slate-500" />
                      </div>

                      {/* Theological Implication */}
                      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-xs text-red-400 mb-1">THEOLOGICAL IMPLICATION</p>
                        <p className="text-slate-200">
                          {analysis.claimLadder.theologicalImplication || <span className="text-red-400">Missing implication!</span>}
                        </p>
                      </div>

                      {/* Missing Rungs Warning */}
                      {analysis.claimLadder.missingRungs.length > 0 && (
                        <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg mt-4">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="text-sm font-medium text-red-300">Missing Rungs</h4>
                              <ul className="mt-1 space-y-1">
                                {analysis.claimLadder.missingRungs.map((rung, idx) => (
                                  <li key={idx} className="text-sm text-red-200">- {rung}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
