import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb, Send, BookOpen, Target, TrendingUp, Sparkles, Building2, Link2, Loader2,
  ChevronDown, AlertTriangle, CheckCircle2, BookMarked, Layers, Shield, GraduationCap,
  Church, Cross, Moon, Scale, Compass, Save, Download, Copy, Gem, FolderOpen, MessageSquare,
  Zap, ArrowRight, FileText, Brain, Clock, Star, RefreshCw, CalendarDays, Box, Focus, MessageCircle, X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ExportToStudyButton } from "@/components/ExportToStudyButton";
import { QuickShareButton } from "@/components/social/QuickShareButton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useThoughtAnalysisHistory, SavedAnalysis, DeeperInsight } from "@/hooks/useThoughtAnalysisHistory";
import { AnimatedScore } from "@/components/analyze/AnimatedScore";
import { VoiceInput } from "@/components/analyze/VoiceInput";
import { StyledMarkdownSections } from "@/components/ui/styled-markdown";
import { SavedAnalysesList } from "@/components/analyze/SavedAnalysesList";
import { QuickAudioButton } from "@/components/audio";
import { FollowUpChat } from "@/components/analyze/FollowUpChat";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { ChainWitness } from "@/components/analyze/ChainWitness";
import { VerseExtraction } from "@/components/analyze/VerseExtraction";
import { CopyableVerse } from "@/components/analyze/CopyableVerse";
import { useRecentStudies } from "@/hooks/useRecentStudies";
import { useGemLimit } from "@/hooks/useGemLimit";
import { useSparks } from "@/hooks/useSparks";
import { SparkContainer, SparkSettings } from "@/components/sparks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface StrengthItem {
  point: string;
  expansion?: string;
}

interface GrowthItem {
  point: string;
  expansion?: string;
}

interface PalaceRoom {
  code: string;
  name: string;
  relevance: string;
  practicePrompt?: string;
}

interface ScriptureConnection {
  reference: string;
  connection: string;
}

interface TypologyLayer {
  symbol: string;
  meaning: string;
  reference: string;
  insight?: string;
}

interface FurtherStudyItem {
  topic: string;
  whyItMatters?: string;
}

interface AnalysisResult {
  summary: string;
  narrativeAnalysis?: string;
  overallScore: number;
  categories: {
    biblicalAccuracy: number;
    theologicalDepth: number;
    christCenteredness: number;
    practicalApplication: number;
    doctrinalSoundness: number;
    sanctuaryHarmony: number;
  };
  strengths: (string | StrengthItem)[];
  growthAreas: (string | GrowthItem)[];
  palaceRooms: PalaceRoom[];
  scriptureConnections: ScriptureConnection[];
  typologyLayers: TypologyLayer[];
  deeperInsights?: DeeperInsight[];
  potentialMisinterpretations: string[];
  alignmentCheck: { status: "aligned" | "caution" | "concern"; notes: string };
  furtherStudy: (string | FurtherStudyItem)[];
  encouragement: string;
}

const scriptureSuggestions = [
  // Core Theme Walls (4th Floor - TRm)
  { label: "Sanctuary Typology", icon: Church, prompt: "Consider how this connects to the sanctuary services and furniture (BL - Blue Room)." },
  { label: "Gospel/Cross", icon: Cross, prompt: "Explore how this points to Christ's sacrifice and the gospel (Gospel Floor)." },
  { label: "Prophetic Link", icon: Moon, prompt: "Look for connections to Daniel and Revelation prophecies (PR - Prophecy Room)." },
  { label: "Great Controversy", icon: Scale, prompt: "Consider the cosmic conflict dimension of this truth (GC Wall)." },
  // Three Heavens (6th Floor)
  { label: "First Heaven (1H)", icon: Clock, prompt: "Consider DoL¹/NE¹ - the Babylonian judgment and post-exilic restoration under Cyrus." },
  { label: "Second Heaven (2H)", icon: Sparkles, prompt: "Consider DoL²/NE² - the 70 AD destruction and New-Covenant order, Christ's heavenly ministry." },
  { label: "Third Heaven (3H)", icon: Star, prompt: "Consider DoL³/NE³ - the final cosmic judgment and literal new heavens and earth (Rev 21-22)." },
  // Eight Cycles (6th Floor)
  { label: "Cycles (@Ad-@Re)", icon: RefreshCw, prompt: "Which of the eight cycles does this fit? @Ad (Adamic), @No (Noahic), @Ab (Abrahamic), @Mo (Mosaic), @Cy (Cyrusic), @CyC (Cyrus-Christ), @Sp (Spirit), @Re (Remnant)." },
  // Patterns & Parallels (4th Floor)
  { label: "Types & Antitypes", icon: ArrowRight, prompt: "What types/shadows point forward to Christ here? (ST - Symbols/Types Room)" },
  { label: "Parallels", icon: Layers, prompt: "What mirrored actions across time connect here? (P‖ - Parallels Room)" },
  { label: "Patterns", icon: Zap, prompt: "What recurring patterns appear? (40 days, 3 days, deliverer stories) (PRm - Patterns Room)" },
  // Feasts & Time Zones (5th Floor)
  { label: "Feasts Connection", icon: CalendarDays, prompt: "Which feast(s) of Israel does this correlate with? Passover, Unleavened Bread, Firstfruits, Pentecost, Trumpets, Atonement, Tabernacles." },
  // Dimensions (4th Floor - DR)
  { label: "5 Dimensions", icon: Box, prompt: "Apply the five dimensions: Literal, Christ, Me, Church, Heaven (DR - Dimensions Room)." },
  // Christ-Centered (4th Floor - CR)
  { label: "Christ-Centered", icon: Focus, prompt: "How does this text reveal Christ? Pass it through the Concentration Room (CR)." },
  // Three Angels (5th Floor - 3A)
  { label: "Three Angels", icon: MessageCircle, prompt: "How does this connect to the Three Angels' Messages of Revelation 14:6-12? (3A Room)" },
];

const checklistItems = [
  { id: "scripture", label: "Is it rooted in Scripture?", icon: BookOpen },
  { id: "christ", label: "Is it consistent with the character of Christ?", icon: Cross },
  { id: "sanctuary", label: "Does it harmonize with the sanctuary pattern?", icon: Church },
  { id: "private", label: "Does it avoid private interpretations?", icon: Shield },
  { id: "humble", label: "Is it presented humbly, not dogmatically?", icon: Scale },
];

const categoryLabels: Record<string, { label: string; icon: React.ReactNode }> = {
  biblicalAccuracy: { label: "Biblical Accuracy", icon: <BookOpen className="h-4 w-4" /> },
  theologicalDepth: { label: "Theological Depth", icon: <Layers className="h-4 w-4" /> },
  christCenteredness: { label: "Christ-Centeredness", icon: <Cross className="h-4 w-4" /> },
  practicalApplication: { label: "Practical Application", icon: <Target className="h-4 w-4" /> },
  doctrinalSoundness: { label: "Doctrinal Soundness", icon: <Shield className="h-4 w-4" /> },
  sanctuaryHarmony: { label: "Sanctuary Harmony", icon: <Compass className="h-4 w-4" /> },
};

// Helper to normalize strength/growth items
const normalizeItem = (item: unknown): { point: string; expansion?: string } => {
  // If it's already a proper object with point property
  if (item && typeof item === 'object' && 'point' in item) {
    const obj = item as { point: string; expansion?: string };
    return { point: String(obj.point || ''), expansion: obj.expansion ? String(obj.expansion) : undefined };
  }
  
  // If it's a string that looks like JSON, try to parse it
  if (typeof item === 'string') {
    const trimmed = item.trim();
    if (trimmed.startsWith('{') && trimmed.includes('"point"')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed && typeof parsed === 'object' && parsed.point) {
          return { point: String(parsed.point), expansion: parsed.expansion ? String(parsed.expansion) : undefined };
        }
      } catch {
        // Not valid JSON, treat as plain string
      }
    }
    return { point: item };
  }
  
  // Fallback
  return { point: String(item || '') };
};

// Helper to normalize further study items
const normalizeFurtherStudy = (item: string | FurtherStudyItem): FurtherStudyItem => {
  if (typeof item === 'string') {
    return { topic: item };
  }
  return item;
};

const AnalyzeThoughts = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | undefined>();
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string | undefined>();
  const [followUpConversation, setFollowUpConversation] = useState<Array<{role: "user" | "assistant"; content: string}>>([]);
  const [showResults, setShowResults] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['narrative', 'scores']));
  const [loadedStudyTitle, setLoadedStudyTitle] = useState<string | null>(null);
  const [isImportingFile, setIsImportingFile] = useState(false);
  const [isAddingToKnowledgeBank, setIsAddingToKnowledgeBank] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastAutoSaved, setLastAutoSaved] = useState<Date | null>(null);
  const [scholarMode, setScholarMode] = useState(false);
  const [sparksExpanded, setSparksExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { isAdmin } = useIsAdmin();
  const { canCreateGem, gemsRemaining, getLimitMessage, refetch: refetchGemLimit } = useGemLimit();

  // Sparks integration - show all study sparks, not just current context
  const {
    sparks,
    preferences: sparkPreferences,
    generateSpark,
    openSpark,
    saveSpark,
    dismissSpark,
    exploreSpark,
    updatePreferences: updateSparkPreferences
  } = useSparks({
    surface: 'study',
    contextType: 'study',
    contextId: '*', // Show all study sparks
    maxSparks: 5,
    debounceMs: 60000
  });

  // Trigger spark generation when analysis completes
  useEffect(() => {
    if (result && input.length > 280) {
      generateSpark(
        `Analysis: ${result.summary}\nStrengths: ${result.strengths?.slice(0, 3).map(s => typeof s === 'string' ? s : s.point).join(', ')}\nScore: ${result.overallScore}/100`,
        undefined
      );
    }
  }, [result]);

  // Also generate sparks while typing (debounced) - so users get sparks as they study
  useEffect(() => {
    if (input.length > 200 && !isAnalyzing) {
      const timer = setTimeout(() => {
        generateSpark(input.slice(-500), undefined);
      }, 45000); // 45 seconds after typing stops
      return () => clearTimeout(timer);
    }
  }, [input, isAnalyzing, generateSpark]);
  
  // Auto-save input to localStorage every 15 seconds (only when no result yet)
  useEffect(() => {
    if (input.trim() && !result) {
      // Clear existing timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      // Set new timer
      autoSaveTimerRef.current = setTimeout(() => {
        try {
          localStorage.setItem('analyze-thoughts-draft', JSON.stringify({
            input,
            loadedStudyTitle,
            timestamp: new Date().toISOString()
          }));
          setLastAutoSaved(new Date());
          setIsAutoSaving(true);
          setTimeout(() => setIsAutoSaving(false), 1000);
        } catch (e) {
          console.error('Failed to auto-save draft:', e);
        }
      }, 15000); // 15 seconds
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [input, loadedStudyTitle, result]);
  
  // Restore draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('analyze-thoughts-draft');
      if (saved) {
        const { input: savedInput, loadedStudyTitle: savedTitle, timestamp } = JSON.parse(saved);
        // Only restore if less than 24 hours old
        const savedTime = new Date(timestamp);
        const now = new Date();
        const hoursDiff = (now.getTime() - savedTime.getTime()) / (1000 * 60 * 60);
        if (hoursDiff < 24 && savedInput) {
          setInput(savedInput);
          setLoadedStudyTitle(savedTitle || null);
          toast.info("Draft restored from last session");
        }
      }
    } catch (e) {
      console.error('Failed to restore draft:', e);
    }
  }, []);

  const { history, isLoading: historyLoading, saveAnalysis, deleteAnalysis, refetch } = useThoughtAnalysisHistory();
  const { recentStudies, recentNotes, fetchRecentStudies, fetchRecentNotes, isLoading: studiesLoading } = useRecentStudies();

  // Fetch studies on mount
  useEffect(() => {
    fetchRecentStudies();
    fetchRecentNotes();
  }, [fetchRecentStudies, fetchRecentNotes]);

  const loadStudyToAnalyze = (study: { title: string; content: string }) => {
    setInput(study.content);
    setLoadedStudyTitle(study.title);
    setResult(null);
    setSelectedHistoryId(undefined);
    toast.success(`Loaded "${study.title}" for analysis`);
  };

  const loadNoteToAnalyze = (note: { book: string; chapter: number; verse: number; content: string }) => {
    const title = `Note on ${note.book} ${note.chapter}:${note.verse}`;
    setInput(note.content);
    setLoadedStudyTitle(title);
    setResult(null);
    setSelectedHistoryId(undefined);
    toast.success(`Loaded note for analysis`);
  };

  const handleImportFile = async (file: File) => {
    try {
      setIsImportingFile(true);

      const maxBytes = 20 * 1024 * 1024;
      if (file.size > maxBytes) {
        toast.error("File too large (max 20MB)");
        return;
      }

      const ext = file.name.toLowerCase().split('.').pop();
      const buffer = await file.arrayBuffer();

      if (ext === 'pdf') {
        const pdfjsLib: any = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url
        ).toString();

        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
        const pdf = await loadingTask.promise;

        let text = '';
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const content = await page.getTextContent();
          const pageText = (content.items || []).map((it: any) => it.str).join(' ');
          text += pageText + "\n\n";
        }

        const cleaned = text.trim();
        setInput(cleaned);
        setLoadedStudyTitle(file.name);
        setResult(null);
        setSelectedHistoryId(undefined);
        toast.success("PDF imported");
        return;
      }

      if (ext === 'docx') {
        const mammoth: any = await import('mammoth');
        const { value } = await mammoth.extractRawText({ arrayBuffer: buffer });
        const cleaned = (value || '').trim();
        setInput(cleaned);
        setLoadedStudyTitle(file.name);
        setResult(null);
        setSelectedHistoryId(undefined);
        toast.success("Word document imported");
        return;
      }

      toast.error("Supported files: PDF, DOCX");
    } catch (e) {
      console.error('[AnalyzeThoughts] File import error:', e);
      toast.error("Couldn't import that file");
    } finally {
      setIsImportingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  // Trigger animation when result changes
  useEffect(() => {
    if (result) {
      setShowResults(false);
      const timer = setTimeout(() => setShowResults(true), 100);
      return () => clearTimeout(timer);
    }
  }, [result]);

  const handleAnalyze = async () => {
    if (!input.trim()) {
      toast.error("Please enter your thoughts to analyze");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);
    setSelectedHistoryId(undefined);
    
    const analysisMode = scholarMode ? 'analyze-thoughts-scholar' : 'analyze-thoughts';
    
    try {
      const { data, error } = await supabase.functions.invoke('jeeves', {
        body: { mode: analysisMode, message: input }
      });

      if (error) {
        console.error('[AnalyzeThoughts] Edge function error:', error);
        throw error;
      }

      let analysisResult: AnalysisResult;
      if (data.analysis) {
        analysisResult = data.analysis;
      } else if (data.response) {
        analysisResult = typeof data.response === 'string' ? JSON.parse(data.response) : data.response;
      } else if (data.error) {
        // Handle error returned in response body
        toast.error(data.error || "Analysis failed");
        return;
      } else {
        console.error('[AnalyzeThoughts] Unexpected response format:', data);
        toast.error("Unexpected response format");
        return;
      }

      // Ensure overallScore is a valid number (AI might return string or null)
      const rawScore = analysisResult.overallScore;
      const parsedScore = typeof rawScore === 'string' ? parseFloat(rawScore) : (typeof rawScore === 'number' ? rawScore : 0);
      analysisResult.overallScore = !isNaN(parsedScore) ? parsedScore : 0;
      
      setResult(analysisResult);
      
      // Auto-save to history and get the saved ID
      const savedAnalysis = await saveAnalysis(input, analysisResult);
      if (savedAnalysis?.id) {
        setCurrentAnalysisId(savedAnalysis.id);
        setFollowUpConversation([]); // Reset conversation for new analysis
      }
      
      // Clear draft after successful analysis
      localStorage.removeItem('analyze-thoughts-draft');
      
      toast.success("Analysis complete!");
    } catch (error: any) {
      console.error('[AnalyzeThoughts] Analysis error:', error);
      const errorMessage = error?.message || error?.error || "Failed to analyze. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectFromHistory = (analysis: SavedAnalysis) => {
    setInput(analysis.input_text);
    setSelectedHistoryId(analysis.id);
    setCurrentAnalysisId(analysis.id);
    setShowResults(true);
    
    // Load the saved follow-up conversation if it exists
    if (analysis.followup_conversation && Array.isArray(analysis.followup_conversation)) {
      setFollowUpConversation(analysis.followup_conversation);
    } else {
      setFollowUpConversation([]);
    }
    
    // Reconstruct result from saved analysis
    setResult({
      summary: analysis.summary || "",
      narrativeAnalysis: analysis.narrative_analysis || undefined,
      overallScore: analysis.overall_score || 0,
      categories: (analysis.categories as AnalysisResult['categories']) || {
        biblicalAccuracy: 0, theologicalDepth: 0, christCenteredness: 0,
        practicalApplication: 0, doctrinalSoundness: 0, sanctuaryHarmony: 0
      },
      strengths: analysis.strengths || [],
      growthAreas: analysis.growth_areas || [],
      palaceRooms: analysis.palace_rooms || [],
      scriptureConnections: analysis.scripture_connections || [],
      typologyLayers: analysis.typology_layers || [],
      deeperInsights: analysis.deeper_insights || [],
      potentialMisinterpretations: analysis.potential_misinterpretations || [],
      alignmentCheck: (analysis.alignment_check as AnalysisResult['alignmentCheck']) || { status: "aligned", notes: "" },
      furtherStudy: analysis.further_study || [],
      encouragement: analysis.encouragement || "",
    });
    
    // Scroll to results section after a brief delay for render
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const addSuggestion = (prompt: string) => {
    setInput(prev => prev + (prev ? "\n\n" : "") + prompt);
    toast.success("Suggestion added");
  };

  const handleVoiceTranscript = (text: string) => {
    setInput(prev => prev + (prev ? " " : "") + text);
  };

  const toggleCheckItem = (id: string) => {
    setCheckedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSaveToGems = async () => {
    if (!result) return;
    
    // Check gem limit before proceeding
    if (!canCreateGem) {
      toast.error("You've reached your weekly limit of 5 gems. Your limit resets on Sunday.", {
        duration: 5000,
      });
      return;
    }
    
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error("Please log in"); return; }

      // Build gem content from analysis result
      const gemContent = `**Your Thought:**\n${input}\n\n**Summary:**\n${result.summary || 'N/A'}\n\n**Overall Score:** ${result.overallScore}/100\n\n**Strengths:**\n${result.strengths?.map(s => `• ${typeof s === 'string' ? s : s.point}`).join('\n') || 'N/A'}\n\n**Growth Areas:**\n${result.growthAreas?.map(a => `• ${typeof a === 'string' ? a : a.point}`).join('\n') || 'N/A'}\n\n**Encouragement:**\n${result.encouragement || 'N/A'}`;

      const { error } = await supabase.from('user_gems').insert({
        user_id: user.id,
        gem_name: `Thought Analysis - ${new Date().toLocaleDateString()}`,
        gem_content: gemContent,
        room_id: 'gr',
        floor_number: 1,
        category: 'Thought Analysis'
      });
      if (error) throw error;
      
      // Refetch limit after successful save
      refetchGemLimit();
      toast.success(`Saved to Gems Room! 💎 (${gemsRemaining - 1} gems remaining this week)`);
    } catch (error) {
      console.error("Error saving gem:", error);
      toast.error("Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    if (!result) return;
    const content = `PHOTOTHEOLOGY THOUGHT ANALYSIS\n==============================\nDate: ${new Date().toLocaleString()}\n\nYOUR THOUGHT:\n${input}\n\nSUMMARY:\n${result.summary || 'N/A'}\n\nOVERALL SCORE: ${result.overallScore}/100\n\nSTRENGTHS:\n${result.strengths?.map(s => `• ${typeof s === 'string' ? s : s.point}`).join('\n') || 'N/A'}\n\nGROWTH AREAS:\n${result.growthAreas?.map(a => `• ${typeof a === 'string' ? a : a.point}`).join('\n') || 'N/A'}\n\nENCOURAGEMENT:\n${result.encouragement || 'N/A'}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thought-analysis-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported!");
  };

  const handleCopy = () => {
    if (!result) return;
    const strengthsText = result.strengths?.map(s => typeof s === 'string' ? s : s.point).join(', ');
    navigator.clipboard.writeText(`Score: ${result.overallScore}/100\n\nStrengths: ${strengthsText}\n\nEncouragement: ${result.encouragement}`);
    toast.success("Copied!");
  };

  const handleAddToKnowledgeBank = async () => {
    if (!result || !input) return;
    setIsAddingToKnowledgeBank(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error("Please log in"); return; }

      // Extract key insights from various parts of the analysis
      const keyInsights = [
        ...(result.strengths || []).map(s => typeof s === 'string' ? s : s.point),
        ...(result.deeperInsights || []).map(d => d.discovery),
      ].filter(Boolean);

      // Extract tags from palace rooms, scripture connections, etc.
      const tags = [
        ...(result.palaceRooms || []).map(r => r.code),
        ...(result.scriptureConnections || []).map(s => s.reference.split(' ')[0]),
        result.alignmentCheck?.status || 'aligned',
      ].filter(Boolean);

      // Use type assertion since the types may not have regenerated yet
      const { error } = await (supabase.from('pt_knowledge_bank') as any).insert({
        source_analysis_id: selectedHistoryId || null,
        input_text: input,
        summary: result.summary,
        key_insights: keyInsights,
        palace_rooms: result.palaceRooms || [],
        scripture_connections: result.scriptureConnections || [],
        typology_layers: result.typologyLayers || [],
        deeper_insights: result.deeperInsights || [],
        categories: result.categories,
        tags: tags,
        approved_by: user.id,
      });

      if (error) throw error;
      toast.success("Added to Jeeves Knowledge Bank! 🧠", {
        description: "This insight will help Jeeves provide better PT guidance in the future."
      });
    } catch (error) {
      console.error("Error adding to knowledge bank:", error);
      toast.error("Failed to add to knowledge bank");
    } finally {
      setIsAddingToKnowledgeBank(false);
    }
  };

  const getAlignmentBadge = (status: string) => {
    switch (status) {
      case "aligned": return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30"><CheckCircle2 className="h-3 w-3 mr-1" />Aligned</Badge>;
      case "caution": return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30"><AlertTriangle className="h-3 w-3 mr-1" />Caution</Badge>;
      case "concern": return <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><AlertTriangle className="h-3 w-3 mr-1" />Concern</Badge>;
      default: return null;
    }
  };

  // Format narrative analysis with styled markdown (headings, bullets, etc.)
  const formatNarrative = (text: string) => {
    if (!text) return null;
    return <StyledMarkdownSections content={text} className="text-base leading-relaxed" />;
  };

  // Safely get the overall score, defaulting to 0 if null/undefined/NaN
  const safeOverallScore = typeof result?.overallScore === 'number' && !isNaN(result.overallScore) 
    ? result.overallScore 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>
      
      <Navigation />

      {/* Sparks Container - Small non-blocking badge that expands on click */}
      {sparks.length > 0 && (
        <div className="fixed bottom-24 right-4 md:top-20 md:bottom-auto z-50">
          {sparksExpanded ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-amber-500/30 to-orange-500/30 backdrop-blur-lg rounded-2xl p-4 border-2 border-amber-400/50 shadow-xl shadow-amber-500/30 max-w-xs"
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span className="text-sm font-semibold text-amber-100">Insights</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-amber-200 hover:text-white hover:bg-amber-500/30"
                  onClick={() => setSparksExpanded(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <SparkContainer
                sparks={sparks}
                onOpen={openSpark}
                onSave={saveSpark}
                onDismiss={dismissSpark}
                onExplore={exploreSpark}
                position="floating"
                maxDisplay={5}
              />
            </motion.div>
          ) : (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSparksExpanded(true)}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-500/80 to-orange-500/80 backdrop-blur-lg rounded-full border border-amber-400/50 shadow-lg shadow-amber-500/30 text-white hover:from-amber-500 hover:to-orange-500 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">{sparks.length}</span>
            </motion.button>
          )}
        </div>
      )}

      {/* Spark Settings */}
      <div className="fixed bottom-28 md:bottom-4 right-4 z-40">
        <SparkSettings
          preferences={sparkPreferences}
          onUpdate={updateSparkPreferences}
        />
      </div>

      <div className="container mx-auto px-4 py-8 pt-24 md:pt-28 pb-32 md:pb-8 max-w-4xl relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center justify-center gap-3 mb-4 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30">
            <Lightbulb className="h-8 w-8 text-amber-400 animate-pulse" />
            <h1 className="text-3xl md:text-4xl font-serif font-bold bg-gradient-to-r from-amber-200 via-purple-200 to-blue-200 bg-clip-text text-transparent">
              {t('analyze.title', 'Analyze My Thoughts')}
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {t('analyze.subtitle', 'Share your biblical ideas and receive comprehensive feedback grounded in')}
            <span className="text-purple-400 font-medium"> {t('analyze.ptPrinciples', 'Phototheology principles')}</span>.
          </p>
        </motion.div>

        {/* Input Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="mb-8 bg-card/80 backdrop-blur-sm border-purple-500/20 shadow-xl shadow-purple-500/5">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="h-5 w-5 text-amber-400" />
                <span className="bg-gradient-to-r from-amber-200 to-purple-200 bg-clip-text text-transparent">{t('analyze.shareYourThoughts', 'Share Your Thoughts')}</span>
              </CardTitle>
              <CardDescription>{t('analyze.enterConcept', 'Enter a biblical concept, interpretation, or theological idea')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              {/* Load Study/Note + Import File */}
              <div className="flex items-center gap-2 pb-2 border-b border-border/30 flex-wrap">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="bg-sky-500/10 border-sky-500/30 hover:bg-sky-500/20">
                      <FileText className="h-4 w-4 mr-2 text-sky-400" />
                      {t('analyze.loadStudy', 'Load Study or Note')}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-72">
                    <DropdownMenuLabel>Recent Studies</DropdownMenuLabel>
                    {studiesLoading ? (
                      <DropdownMenuItem disabled><Loader2 className="h-3 w-3 mr-2 animate-spin" />Loading...</DropdownMenuItem>
                    ) : recentStudies.length === 0 ? (
                      <DropdownMenuItem disabled>No studies found</DropdownMenuItem>
                    ) : (
                      recentStudies.slice(0, 5).map((study) => (
                        <DropdownMenuItem key={study.id} onClick={() => loadStudyToAnalyze(study)} className="flex flex-col items-start">
                          <span className="font-medium truncate w-full">{study.title}</span>
                          <span className="text-xs text-muted-foreground">{study.tags?.slice(0, 2).join(', ') || 'No tags'}</span>
                        </DropdownMenuItem>
                      ))
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Recent Verse Notes</DropdownMenuLabel>
                    {recentNotes.length === 0 ? (
                      <DropdownMenuItem disabled>No notes found</DropdownMenuItem>
                    ) : (
                      recentNotes.slice(0, 5).map((note) => (
                        <DropdownMenuItem key={note.id} onClick={() => loadNoteToAnalyze(note)}>
                          {note.book} {note.chapter}:{note.verse}
                        </DropdownMenuItem>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void handleImportFile(f);
                  }}
                />

                <Button
                  variant="outline"
                  size="sm"
                  disabled={isImportingFile || isAnalyzing}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isImportingFile ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <FolderOpen className="h-4 w-4 mr-2" />
                      {t('analyze.importFile', 'Import PDF/DOCX')}
                    </>
                  )}
                </Button>

                {loadedStudyTitle && (
                  <Badge variant="outline" className="text-xs bg-sky-500/10 border-sky-500/30">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {loadedStudyTitle.substring(0, 30)}{loadedStudyTitle.length > 30 ? '...' : ''}
                  </Badge>
                )}
              </div>

              {/* Mobile Voice Input - Prominent */}
              <div className="md:hidden py-4 flex flex-col items-center border-b border-purple-500/20 mb-4">
                <p className="text-sm text-muted-foreground mb-3">{t('analyze.speakThoughts', 'Speak your thoughts')}</p>
                <VoiceInput 
                  onTranscript={handleVoiceTranscript} 
                  disabled={isAnalyzing} 
                  variant="large"
                />
              </div>

              <div className="relative">
                <Textarea
                  placeholder={t('analyze.placeholder', "Example: I believe the sanctuary in Hebrews represents Christ's mediatorial work in heaven...")}
                  value={input}
                  onChange={(e) => { setInput(e.target.value); setLoadedStudyTitle(null); }}
                  className="min-h-[150px] bg-background/50 border-purple-500/20 focus:border-purple-500/50 pr-12"
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  {isAutoSaving && (
                    <span className="text-xs text-emerald-400 animate-pulse">Saving...</span>
                  )}
                  {!isAutoSaving && lastAutoSaved && (
                    <span className="text-xs text-muted-foreground/50">Saved</span>
                  )}
                  <span className="text-xs text-muted-foreground/50">{input.length}</span>
                  {/* Desktop Voice Input - Icon */}
                  <div className="hidden md:block">
                    <VoiceInput onTranscript={handleVoiceTranscript} disabled={isAnalyzing} />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Add layer:</span>
                <div className="flex flex-wrap gap-2">
                  {scriptureSuggestions.map((s) => (
                    <Button key={s.label} variant="outline" size="sm" onClick={() => addSuggestion(s.prompt)}
                      className="text-xs bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20 flex-1 sm:flex-none min-w-[calc(50%-4px)] sm:min-w-0">
                      <s.icon className="h-3 w-3 mr-1 text-purple-400" />
                      <span className="truncate">{s.label}</span>
                    </Button>
                  ))}
                </div>
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

              {/* Scholar Mode Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/20">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full transition-all ${scholarMode ? 'bg-amber-500/30' : 'bg-muted/50'}`}>
                    <GraduationCap className={`h-5 w-5 transition-colors ${scholarMode ? 'text-amber-400' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <p className={`font-medium transition-colors ${scholarMode ? 'text-amber-200' : 'text-foreground'}`}>
                       {t('analyze.scholarMode', 'Scholar Mode')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t('analyze.scholarDesc', 'Deep exegetical analysis with verse-by-verse breakdown, scholarly assessment, & typological precision')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setScholarMode(!scholarMode)}
                  className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                    scholarMode 
                      ? 'bg-gradient-to-r from-amber-500 to-purple-500 shadow-lg shadow-amber-500/30' 
                      : 'bg-muted'
                  }`}
                >
                  <motion.div
                    className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md"
                    animate={{ left: scholarMode ? '32px' : '4px' }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              <Button onClick={handleAnalyze} disabled={isAnalyzing || !input.trim()}
                className={`w-full py-6 text-lg shadow-lg transition-all ${
                  scholarMode 
                    ? 'bg-gradient-to-r from-amber-600 via-purple-600 to-blue-600 hover:from-amber-500 hover:via-purple-500 hover:to-blue-500 shadow-amber-500/25' 
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-purple-500/25'
                }`}>
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                     {scholarMode ? t('analyze.deepAnalyzing', 'Performing Deep Analysis...') : t('analyze.analyzing', 'Analyzing...')}
                  </>
                ) : (
                  <>
                    {scholarMode ? <GraduationCap className="h-5 w-5 mr-2" /> : <Send className="h-5 w-5 mr-2" />}
                    {scholarMode ? t('analyze.scholarAnalysis', 'Scholar Analysis') : t('analyze.title', 'Analyze My Thoughts')}
                  </>
                )}
              </Button>

              {/* Chain Witness - Supporting Scripture Engine */}
              <ChainWitness userThought={input} disabled={isAnalyzing} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {result && showResults && (
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Action Buttons */}
              <motion.div className="flex flex-wrap gap-3 justify-center items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                {/* New Analysis Button */}
                <Button 
                  onClick={() => {
                    setInput("");
                    setResult(null);
                    setSelectedHistoryId(undefined);
                    setCurrentAnalysisId(undefined);
                    setFollowUpConversation([]);
                    setLoadedStudyTitle(null);
                    setCheckedItems([]);
                    localStorage.removeItem('analyze-thoughts-draft');
                  }}
                  variant="outline" 
                  className="bg-primary/10 border-primary/30 text-primary hover:bg-primary/20"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  New Analysis
                </Button>
                <div className="flex flex-col items-center gap-1">
                  <Button 
                    onClick={handleSaveToGems} 
                    disabled={isSaving || !canCreateGem} 
                    variant="outline" 
                    className={`bg-emerald-500/10 border-emerald-500/30 text-emerald-400 ${!canCreateGem ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title={getLimitMessage()}
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Gem className="h-4 w-4 mr-2" />}
                    Save to Gems ({gemsRemaining}/5 left)
                  </Button>
                  {!canCreateGem && (
                    <span className="text-xs text-amber-400">Weekly limit reached — resets Sunday</span>
                  )}
                </div>
                <ExportToStudyButton
                  type="thought-analysis"
                  title={`Thought Analysis — ${new Date().toLocaleDateString()}`}
                  content={`## My Thought\n${input}\n\n## Summary\n${result.summary || 'N/A'}\n\n## Overall Score: ${result.overallScore}/100\n\n## Strengths\n${result.strengths?.map(s => `- ${typeof s === 'string' ? s : s.point}`).join('\n') || 'N/A'}\n\n## Growth Areas\n${result.growthAreas?.map(a => `- ${typeof a === 'string' ? a : a.point}`).join('\n') || 'N/A'}\n\n## Palace Rooms\n${result.palaceRooms?.map(r => `- ${r.name}`).join('\n') || 'N/A'}\n\n## Scripture Connections\n${result.scriptureConnections?.map(s => `- ${s.reference}`).join('\n') || 'N/A'}\n\n## Encouragement\n${result.encouragement || 'N/A'}`}
                  metadata={{
                    score: result.overallScore,
                  }}
                  variant="outline"
                  className="bg-sky-500/10 border-sky-500/30 text-sky-400"
                />
                <Button onClick={handleExport} variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-400">
                  <Download className="h-4 w-4 mr-2" />Export
                </Button>
                <Button onClick={handleCopy} variant="outline" className="bg-purple-500/10 border-purple-500/30 text-purple-400">
                  <Copy className="h-4 w-4 mr-2" />Copy
                </Button>
                <VerseExtraction
                  inputText={input}
                  scriptureConnections={result.scriptureConnections}
                  typologyLayers={result.typologyLayers}
                  followUpConversation={followUpConversation}
                />
                <QuickShareButton
                  title="My Thought Analysis"
                  content={result.encouragement || result.summary || "I analyzed my thoughts using Phototheology!"}
                  type="insight"
                  variant="outline"
                  size="sm"
                />
                {/* Drill this Thought - Deep Multi-Route Analysis */}
                <Button 
                  onClick={() => {
                    // Navigate to drill tab with thought pre-loaded and auto-start
                    navigate('/drill-drill', { 
                      state: { 
                        thought: input, 
                        autoStart: true 
                      } 
                    });
                  }}
                  variant="outline" 
                  className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30 text-orange-300 hover:text-orange-200 hover:bg-orange-500/30"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Drill this Thought
                </Button>
                {/* Creator-only: Add to Jeeves Knowledge Bank */}
                {isAdmin && (
                  <Button 
                    onClick={handleAddToKnowledgeBank} 
                    disabled={isAddingToKnowledgeBank} 
                    variant="outline" 
                    className="bg-gradient-to-r from-amber-500/20 to-purple-500/20 border-amber-500/30 text-amber-300 hover:text-amber-200"
                  >
                    {isAddingToKnowledgeBank ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Brain className="h-4 w-4 mr-2" />
                    )}
                    Add to Jeeves Knowledge Bank
                  </Button>
                )}
              </motion.div>

              {/* Narrative Analysis - The Main Teaching Moment */}
              {result.narrativeAnalysis && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                  <Card className="bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-blue-500/10 border-amber-500/30 shadow-xl">
                    <CardHeader className="border-b border-border/50 cursor-pointer" onClick={() => toggleSection('narrative')}>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <MessageSquare className="h-5 w-5 text-amber-400" />
                          <span className="bg-gradient-to-r from-amber-200 via-purple-200 to-blue-200 bg-clip-text text-transparent">
                            Jeeves's Analysis
                          </span>
                        </span>
                        <div className="flex items-center gap-2">
                          <QuickAudioButton text={result.narrativeAnalysis} variant="ghost" size="sm" />
                          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${expandedSections.has('narrative') ? 'rotate-180' : ''}`} />
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <AnimatePresence>
                      {expandedSections.has('narrative') && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CardContent className="pt-6">
                            <div className="prose prose-invert max-w-none">
                              {formatNarrative(result.narrativeAnalysis)}
                            </div>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              )}

              {/* Summary - Compact if narrative exists */}
              {result.summary && !result.narrativeAnalysis && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                  <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-purple-500/20"><BookMarked className="h-5 w-5 text-purple-400" /></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-purple-200">Summary</p>
                            <QuickAudioButton text={result.summary} variant="ghost" size="sm" />
                          </div>
                          <p className="text-muted-foreground">{result.summary}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Animated Scores */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
                <Card className="bg-card/80 backdrop-blur-sm border-purple-500/20 shadow-xl overflow-hidden">
                  <CardHeader className="border-b border-border/50 cursor-pointer" onClick={() => toggleSection('scores')}>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-amber-400" />
                        <span className="bg-gradient-to-r from-amber-200 to-purple-200 bg-clip-text text-transparent">Doctrinal Integrity Score</span>
                      </span>
                      <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${expandedSections.has('scores') ? 'rotate-180' : ''}`} />
                    </CardTitle>
                  </CardHeader>
                  <AnimatePresence>
                    {expandedSections.has('scores') && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent className="pt-6">
                          {/* Main Score */}
                          <div className="flex justify-center mb-8">
                            <AnimatedScore score={safeOverallScore} size="lg" delay={500} />
                          </div>
                          
                          {/* Category Scores Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {Object.entries(result.categories || {}).map(([key, value], index) => {
                              const cat = categoryLabels[key];
                              if (!cat) return null;
                              return (
                                <motion.div 
                                  key={key}
                                  className="flex flex-col items-center"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.6 + index * 0.1 }}
                                >
                                  <AnimatedScore 
                                    score={typeof value === 'number' && !isNaN(value) ? value : 0} 
                                    size="sm" 
                                    delay={700 + index * 150}
                                    showLabel
                                    label={cat.label}
                                  />
                                </motion.div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>

              {/* Alignment Check */}
              {result.alignmentCheck && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                  <Card className={`border-l-4 bg-card/80 ${result.alignmentCheck.status === 'aligned' ? 'border-l-emerald-500' : result.alignmentCheck.status === 'caution' ? 'border-l-amber-500' : 'border-l-red-500'}`}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-base">
                        <span className="flex items-center gap-2"><Shield className="h-5 w-5 text-purple-400" />Theological Alignment</span>
                        {getAlignmentBadge(result.alignmentCheck.status)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent><p className="text-muted-foreground">{result.alignmentCheck.notes}</p></CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Strengths & Growth - Enhanced */}
              <motion.div className="grid md:grid-cols-2 gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
                  <CardHeader><CardTitle className="flex items-center gap-2 text-emerald-400"><TrendingUp className="h-5 w-5" />Strengths</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {(result.strengths || []).map((s, i) => {
                        const item = normalizeItem(s);
                        return (
                          <li key={i} className="group">
                            <div className="flex items-start gap-2">
                              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-medium text-emerald-200">{item.point}</span>
                                {item.expansion && (
                                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{item.expansion}</p>
                                )}
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
                  <CardHeader><CardTitle className="flex items-center gap-2 text-amber-400"><Lightbulb className="h-5 w-5" />Growth Areas</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {(result.growthAreas || []).map((a, i) => {
                        const item = normalizeItem(a);
                        return (
                          <li key={i} className="group">
                            <div className="flex items-start gap-2">
                              <ArrowRight className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-medium text-amber-200">{item.point}</span>
                                {item.expansion && (
                                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{item.expansion}</p>
                                )}
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Misinterpretations */}
              {result.potentialMisinterpretations?.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                  <Card className="border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-red-500/5">
                    <CardHeader><CardTitle className="flex items-center gap-2 text-orange-400"><AlertTriangle className="h-5 w-5" />Misinterpretations to Avoid</CardTitle></CardHeader>
                    <CardContent>
                      <ul className="space-y-2">{result.potentialMisinterpretations.map((w, i) => <li key={i} className="flex items-start gap-2"><span className="text-orange-400">⚠</span><span className="text-sm">{w}</span></li>)}</ul>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Palace Mapping - Enhanced with Practice Prompts */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                <Card className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-purple-400/30">
                  <CardHeader className="border-b border-purple-400/20">
                    <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5 text-purple-300" /><span className="text-white font-bold">Palace Mapping</span></CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid gap-4">
                      {(result.palaceRooms || []).map((r, i) => (
                        <motion.div 
                          key={i} 
                          className="p-4 rounded-xl bg-background/60 border border-purple-400/20 hover:border-purple-400/40 transition-all"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.9 + i * 0.1 }}
                        >
                          <div className="flex items-start gap-3">
                            <Badge variant="outline" className="font-mono bg-purple-600/30 text-white border-purple-400/40 shrink-0">{r.code}</Badge>
                            <div className="flex-1">
                              <p className="font-semibold text-foreground mb-1">{r.name}</p>
                              <p className="text-sm text-foreground/80 mb-2">{r.relevance}</p>
                              {r.practicePrompt && (
                                <div className="flex items-start gap-2 mt-3 p-3 rounded-lg bg-amber-500/15 border border-amber-400/30">
                                  <Zap className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                                  <p className="text-sm text-foreground/90 italic">{r.practicePrompt}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Typology Layers - Enhanced */}
              {result.typologyLayers?.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                  <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
                    <CardHeader className="border-b border-border/50"><CardTitle className="flex items-center gap-2"><Layers className="h-5 w-5 text-blue-400" /><span className="bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">Typology Layers</span></CardTitle></CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid gap-4">
                        {result.typologyLayers.map((l, i) => (
                          <div key={i} className="p-4 rounded-xl bg-background/30 border border-blue-500/10">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-blue-500/20 text-blue-300">{l.symbol}</Badge>
                              <span className="text-blue-400">→</span>
                              <span className="font-medium text-blue-200">{l.meaning}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              <CopyableVerse reference={l.reference} className="text-blue-300" />
                            </p>
                            {l.insight && (
                              <p className="text-sm text-blue-200/80 mt-2 italic border-l-2 border-blue-500/30 pl-3">{l.insight}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Deeper Insights - Hidden Gems */}
              {result.deeperInsights && result.deeperInsights.length > 0 && (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.95 }}>
                  <Card className="bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border-emerald-500/30 shadow-lg shadow-emerald-500/5">
                    <CardHeader className="border-b border-border/50">
                      <CardTitle className="flex items-center gap-2">
                        <Gem className="h-5 w-5 text-emerald-400" />
                        <span className="bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 bg-clip-text text-transparent">
                          Deeper Insights You May Have Missed
                        </span>
                      </CardTitle>
                      <CardDescription className="text-emerald-300/70">
                        Hidden connections from name meanings, Genesis 3:15 echoes, and symbolic patterns
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid gap-4">
                        {result.deeperInsights.map((insight, i) => {
                          const typeLabels: Record<string, { label: string; emoji: string; color: string }> = {
                            name_meaning: { label: "Name/Word Meaning", emoji: "📖", color: "text-teal-400" },
                            genesis_3_15: { label: "Genesis 3:15 Echo", emoji: "🐍", color: "text-red-400" },
                            geography: { label: "Geographic Symbol", emoji: "🏔️", color: "text-sky-400" },
                            number: { label: "Numerical Pattern", emoji: "🔢", color: "text-purple-400" },
                            wordplay: { label: "Hebrew/Greek Wordplay", emoji: "✨", color: "text-amber-400" },
                            type_antitype: { label: "Type-Antitype", emoji: "⚖️", color: "text-blue-400" },
                          };
                          const typeInfo = typeLabels[insight.type] || { label: insight.type, emoji: "💡", color: "text-emerald-400" };
                          
                          return (
                            <motion.div 
                              key={i} 
                              className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/20 hover:border-emerald-500/40 transition-all"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 1.0 + i * 0.1 }}
                            >
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-xl">{typeInfo.emoji}</span>
                                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                                  {typeInfo.label}
                                </Badge>
                              </div>
                              <p className={`font-semibold mb-2 ${typeInfo.color}`}>{insight.discovery}</p>
                              <p className="text-sm text-muted-foreground leading-relaxed">{insight.explanation}</p>
                              {insight.reference && (
                                <p className="text-xs text-emerald-400/70 mt-2 flex items-center gap-1">
                                  <BookOpen className="h-3 w-3" /> 
                                  <CopyableVerse reference={insight.reference} className="text-emerald-300" />
                                </p>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Scripture Connections - Enhanced */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
                <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
                  <CardHeader className="border-b border-border/50"><CardTitle className="flex items-center gap-2"><Link2 className="h-5 w-5 text-amber-400" /><span className="bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">Scripture Connections</span></CardTitle></CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid gap-4">
                      {(result.scriptureConnections || []).map((c, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-background/30 border border-amber-500/10">
                          <BookOpen className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-amber-300 mb-1">
                              <CopyableVerse reference={c.reference} className="text-amber-300" />
                            </p>
                            <p className="text-sm text-muted-foreground leading-relaxed">{c.connection}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Further Study - Enhanced with clickable links */}
              {result.furtherStudy?.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
                  <Card className="bg-card/80 border-purple-500/20">
                    <CardHeader><CardTitle className="flex items-center gap-2"><GraduationCap className="h-5 w-5 text-purple-400" />Further Study</CardTitle></CardHeader>
                    <CardContent>
                      <div className="grid gap-3">
                        {result.furtherStudy.map((item, i) => {
                          const study = normalizeFurtherStudy(item);
                          return (
                            <button
                              key={i}
                              onClick={() => navigate(`/encyclopedia?search=${encodeURIComponent(study.topic)}`)}
                              className="block w-full text-left p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer group active:scale-[0.98]"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <p className="font-medium text-sm sm:text-base text-purple-200 group-hover:text-purple-100 flex-1">{study.topic}</p>
                                <ArrowRight className="h-4 w-4 text-purple-400 flex-shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" />
                              </div>
                              {study.whyItMatters && (
                                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{study.whyItMatters}</p>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Encouragement */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2 }}>
                <Card className="bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-amber-500/20 border-purple-500/30 shadow-xl">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-gradient-to-br from-amber-400 to-purple-400 shadow-lg"><Sparkles className="h-6 w-6 text-white" /></div>
                      <div>
                        <p className="font-medium mb-2 text-lg bg-gradient-to-r from-amber-200 via-purple-200 to-blue-200 bg-clip-text text-transparent">Encouragement from Jeeves</p>
                        <p className="text-foreground/90 leading-relaxed text-base">{result.encouragement}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Follow-up Chat */}
              <FollowUpChat
                originalThought={input}
                analysisResult={{
                  summary: result.summary,
                  overallScore: result.overallScore,
                  strengths: result.strengths?.map(s => typeof s === 'string' ? s : s.point) || [],
                  growthAreas: result.growthAreas?.map(a => typeof a === 'string' ? a : a.point) || [],
                  palaceRooms: result.palaceRooms,
                  encouragement: result.encouragement,
                }}
                analysisId={currentAnalysisId}
                initialConversation={followUpConversation}
                onConversationChange={setFollowUpConversation}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Saved Analyses Section */}
        <div className="mt-10">
          <SavedAnalysesList
            history={history}
            isLoading={historyLoading}
            onSelect={handleSelectFromHistory}
            onDelete={deleteAnalysis}
            selectedId={selectedHistoryId}
          />
        </div>
      </div>
    </div>
  );
};

export default AnalyzeThoughts;