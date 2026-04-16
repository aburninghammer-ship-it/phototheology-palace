import { useState, useEffect, useRef, useCallback } from "react";
import { GuidedTourOverlay, primeAudioForTour } from "@/components/guided-tour/GuidedTourOverlay";
import { SERMON_BUILDER_TOUR } from "@/data/guidedTours";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePreservePage } from "@/hooks/usePreservePage";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Film, Mic, BookOpen, TrendingUp, ArrowRight, CheckCircle2, Loader2, Archive, Gem, Info, Swords, PenLine, FileText, Presentation, Lightbulb, Plus, Sparkles, Calendar, Edit, Trash2, Copy, Clock, Brain, GraduationCap } from "lucide-react";
import { MyIdeaTab } from "@/components/simmer/MyIdeaTab";
import { sermonTitleSchema, sermonThemeSchema, sermonStoneSchema, sermonBridgeSchema } from "@/lib/validationSchemas";
import { sanitizeText, sanitizeHtml } from "@/lib/sanitize";
import { SermonRichTextArea } from "@/components/sermon/SermonRichTextArea";
import { SermonPDFExport } from "@/components/sermon/SermonPDFExport";
import { SermonPPTExport } from "@/components/sermon/SermonPPTExport";
import { ScriptureArmory, ArmoryVerse } from "@/components/sermon/ScriptureArmory";
import { SermonWritingStep } from "@/components/sermon/SermonWritingStep";
import { SermonStartersBrowser } from "@/components/sermon/SermonStartersBrowser";
import { SermonPolishTab } from "@/components/sermon/SermonPolishTab";
import { SimmerEngineWrapper } from "@/components/simmer/SimmerEngineWrapper";
import { StyledMarkdown } from "@/components/ui/styled-markdown";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { useSparks } from "@/hooks/useSparks";
import { SparkContainer } from "@/components/sparks";

const STEP_KEYS = [
  { num: 1, key: "setup", icon: BookOpen },
  { num: 2, key: "smoothStones", icon: TrendingUp },
  { num: 3, key: "buildBridges", icon: ArrowRight },
  { num: 4, key: "movieStructure", icon: Film },
  { num: 5, key: "writeSermon", icon: PenLine },
  { num: 6, key: "complete", icon: CheckCircle2 },
];

const SERMON_STYLES = [
  {
    value: "Inductive (Experience → Principle)",
    label: "Inductive",
    description: "Start with experiences, stories, or observations, then lead the audience to discover the biblical principle. Great for skeptical audiences or complex topics."
  },
  {
    value: "Deductive (Principle → Application)",
    label: "Deductive",
    description: "State the main truth upfront, then explain, illustrate, and apply it. Traditional and clear—ideal when the audience already trusts Scripture."
  },
  {
    value: "Narrative (Story-Driven)",
    label: "Narrative",
    description: "Tell the biblical story with dramatic tension, letting the audience live inside the text. Powerful for emotional engagement and memorable messages."
  },
  {
    value: "Expository (Verse-by-Verse)",
    label: "Expository",
    description: "Walk through a passage systematically, explaining each verse in context. Best for teaching-focused congregations who want deep Bible study."
  },
  {
    value: "Topical (Theme-Focused)",
    label: "Topical",
    description: "Address a specific topic using multiple Scripture references. Useful for practical life issues, doctrinal studies, or current events."
  }
];

interface UserGem {
  id: string;
  title: string;
  verse1: string;
  verse2: string;
  verse3: string;
  connection_explanation: string;
  principle_codes: string[] | null;
}

export default function SermonBuilder() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const editId = searchParams.get("id");
  const isNewSermon = searchParams.get("new") === "true";
  const { setCustomState, getCustomState } = usePreservePage();
  const hasRestoredState = useRef(false);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<"builder" | "library" | "simmer" | "starters" | "myidea">("builder");
  const [loading, setLoading] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [asking, setAsking] = useState(false);
  const [librarySermons, setLibrarySermons] = useState<any[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  
  const [sermon, setSermon] = useState({
    title: "",
    theme_passage: "",
    sermon_style: SERMON_STYLES[0].value,
    smooth_stones: [] as string[],
    bridges: [] as string[],
    movie_structure: {} as any,
    full_sermon: "" as string,
  });

  const [newStone, setNewStone] = useState("");
  const [newBridge, setNewBridge] = useState("");
  const [aiHelp, setAiHelp] = useState("");
  const [userGems, setUserGems] = useState<UserGem[]>([]);
  const [loadingGems, setLoadingGems] = useState(false);
  const [gemsDialogOpen, setGemsDialogOpen] = useState(false);
  const [scriptureArmory, setScriptureArmory] = useState<Record<number, ArmoryVerse[]>>({});
  
  // Auto-save to database state
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [currentSermonId, setCurrentSermonId] = useState<string | null>(editId);
  const currentSermonIdRef = useRef<string | null>(editId);
  const isAutoSavingRef = useRef(false);

  // Sparks for sermon building insights - use unique context per session
  // Generate a stable unique ID for new sermons based on timestamp to prevent gem mixing
  const [newSermonContextId] = useState(() => `new-sermon-${Date.now()}`);
  const {
    sparks,
    generateSpark,
    openSpark,
    saveSpark,
    dismissSpark,
    exploreSpark,
  } = useSparks({
    surface: 'study',
    contextType: 'study',
    contextId: editId || newSermonContextId,
  });
  // Handle new sermon flag - clear persisted state when starting fresh
  // Also treat navigating without an editId as a new sermon (always start blank)
  useEffect(() => {
    if (isNewSermon || !editId) {
      // Clear persisted state directly from localStorage to avoid race conditions
      try {
        const stored = localStorage.getItem("pt_page_states");
        if (stored) {
          const states = JSON.parse(stored);
          if (states["/sermon-builder"]) {
            delete states["/sermon-builder"].customState;
            localStorage.setItem("pt_page_states", JSON.stringify(states));
          }
        }
        // Also clear the sermon autosave content
        localStorage.removeItem("sermon_autosave_content");
      } catch (e) {
        console.warn("Failed to clear sermon state:", e);
      }

      if (isNewSermon) {
        // Remove the ?new param from URL without causing navigation
        setSearchParams({}, { replace: true });
      }
      hasRestoredState.current = true; // Prevent any restoration
    }
  }, [isNewSermon, editId, setSearchParams]);

  useEffect(() => {
    // Skip restoration if there's no editId (new sermon) or already restored
    if (!editId || hasRestoredState.current) {
      hasRestoredState.current = true;
      return;
    }

    const savedStep = getCustomState<number>('sermon_currentStep');
    const savedSermon = getCustomState<typeof sermon>('sermon_data');
    const savedNewStone = getCustomState<string>('sermon_newStone');
    const savedNewBridge = getCustomState<string>('sermon_newBridge');
    const savedAiHelp = getCustomState<string>('sermon_aiHelp');

    if (savedStep) setCurrentStep(savedStep);
    if (savedSermon) {
      // Merge with default state to ensure all properties exist
      setSermon(prev => ({
        ...prev,
        ...savedSermon,
        full_sermon: savedSermon.full_sermon || prev.full_sermon || "",
        smooth_stones: savedSermon.smooth_stones || prev.smooth_stones || [],
        bridges: savedSermon.bridges || prev.bridges || [],
      }));
    }
    if (savedNewStone) setNewStone(savedNewStone);
    if (savedNewBridge) setNewBridge(savedNewBridge);
    if (savedAiHelp) setAiHelp(savedAiHelp);

    hasRestoredState.current = true;
  }, [editId, getCustomState]);

  // Persist state changes (only for new sermons)
  useEffect(() => {
    if (!editId) {
      setCustomState('sermon_currentStep', currentStep);
    }
  }, [currentStep, editId, setCustomState]);

  useEffect(() => {
    if (!editId) {
      setCustomState('sermon_data', sermon);
    }
  }, [sermon, editId, setCustomState]);

  useEffect(() => {
    if (!editId) {
      setCustomState('sermon_newStone', newStone);
      setCustomState('sermon_newBridge', newBridge);
      setCustomState('sermon_aiHelp', aiHelp);
    }
  }, [newStone, newBridge, aiHelp, editId, setCustomState]);

  useEffect(() => {
    checkAuth();
    if (editId) {
      loadSermon(editId);
      setCurrentSermonId(editId);
      currentSermonIdRef.current = editId;
    }
  }, [editId]);

  // Auto-save to database every 15 seconds when there's content
  const hasAnyContent = sermon.title || sermon.theme_passage || sermon.smooth_stones.length > 0 || sermon.bridges.length > 0 || sermon.full_sermon || Object.keys(sermon.movie_structure).length > 0;

  const performAutoSave = useCallback(async () => {
    // Auto-save if we have ANY meaningful content
    if (!hasAnyContent) return;
    // Prevent concurrent auto-saves
    if (isAutoSavingRef.current) return;
    
    isAutoSavingRef.current = true;
    setIsAutoSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const sermonData = {
        user_id: user.id,
        title: sermon.title || "Untitled Sermon",
        theme_passage: sermon.theme_passage,
        sermon_style: sermon.sermon_style,
        smooth_stones: sermon.smooth_stones,
        bridges: sermon.bridges,
        movie_structure: sermon.movie_structure,
        full_sermon: sermon.full_sermon,
        current_step: currentStep,
        status: currentStep >= 5 ? "complete" : "in_progress",
      };

      const idToUse = currentSermonIdRef.current;

      if (idToUse) {
        // Update existing sermon
        const { error } = await supabase
          .from("sermons")
          .update(sermonData)
          .eq("id", idToUse);
        if (error) throw error;
      } else {
        // Create new sermon and store the ID
        const { data, error } = await supabase
          .from("sermons")
          .insert(sermonData)
          .select('id')
          .single();
        if (error) throw error;
        if (data?.id) {
          currentSermonIdRef.current = data.id;
          setCurrentSermonId(data.id);
          // Update URL without full navigation to preserve state
          window.history.replaceState({}, '', `/sermon-builder?id=${data.id}`);
        }
      }

      setLastAutoSave(new Date());
    } catch (error) {
      console.error("Auto-save failed:", error);
    } finally {
      isAutoSavingRef.current = false;
      setIsAutoSaving(false);
    }
  }, [sermon, currentStep, hasAnyContent]);

  // Set up auto-save timer — save every 10 seconds when there's content
  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current);
    }

    if (hasAnyContent) {
      autoSaveTimerRef.current = setInterval(() => {
        performAutoSave();
      }, 10000); // 10 seconds
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    };
  }, [performAutoSave, hasAnyContent]);

  // Save immediately when leaving the page (beforeunload + cleanup)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (hasAnyContent) {
        performAutoSave();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Also save on component unmount (navigation away)
      if (hasAnyContent) {
        performAutoSave();
      }
    };
  }, [performAutoSave, hasAnyContent]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) navigate("/auth");
  };

  const loadSermon = async (id: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("sermons")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (data) {
        setSermon({
          title: data.title,
          theme_passage: data.theme_passage,
          sermon_style: data.sermon_style,
          smooth_stones: Array.isArray(data.smooth_stones) ? (data.smooth_stones as string[]) : [],
          bridges: Array.isArray(data.bridges) ? (data.bridges as string[]) : [],
          movie_structure: data.movie_structure || {},
          full_sermon: (data as any).full_sermon || "",
        });
        setCurrentStep(data.current_step || 1);
      }
    } catch (error) {
      console.error("Error loading sermon:", error);
      toast.error(t('sermon.builder.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const askJeeves = async (mode: string, context: any) => {
    setAsking(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: { mode, ...context },
      });

      if (error) throw error;
      setAiHelp(data.content);
      toast.success(t('sermon.builder.jeevesGuidance'));
    } catch (error) {
      console.error("Error getting help:", error);
      toast.error(t('sermon.builder.aiAssistError'));
    } finally {
      setAsking(false);
    }
  };

  const addSmoothStone = () => {
    const plainText = newStone.replace(/<[^>]*>/g, '').trim();
    try {
      const validated = sermonStoneSchema.parse(plainText);
      const sanitized = sanitizeText(validated);
      setSermon({ ...sermon, smooth_stones: [...sermon.smooth_stones, newStone] });
      setNewStone("");
      toast.success(t('sermon.builder.stoneAdded'));
    } catch (error: any) {
      toast.error(error.errors?.[0]?.message || "Invalid stone format");
    }
  };

  const addBridge = () => {
    const plainText = newBridge.replace(/<[^>]*>/g, '').trim();
    try {
      const validated = sermonBridgeSchema.parse(plainText);
      const sanitized = sanitizeText(validated);
      setSermon({ ...sermon, bridges: [...sermon.bridges, newBridge] });
      setNewBridge("");
      toast.success(t('sermon.builder.bridgeAdded'));
    } catch (error: any) {
      toast.error(error.errors?.[0]?.message || "Invalid bridge format");
    }
  };

  const loadUserGems = async () => {
    setLoadingGems(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("gems")
        .select("id, title, verse1, verse2, verse3, connection_explanation, principle_codes")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUserGems(data || []);
      setGemsDialogOpen(true);
    } catch (error) {
      console.error("Error loading gems:", error);
      toast.error(t('sermon.builder.loadGemsError'));
    } finally {
      setLoadingGems(false);
    }
  };

  const addGemAsStone = (gem: UserGem) => {
    if (sermon.smooth_stones.length >= 5) {
      toast.error(t('sermon.builder.maxStonesReached'));
      return;
    }
    const gemContent = `<strong>${gem.title}</strong><br/><em>Verses: ${gem.verse1}, ${gem.verse2}, ${gem.verse3}</em><br/>${gem.connection_explanation}`;
    setSermon({ ...sermon, smooth_stones: [...sermon.smooth_stones, gemContent] });
    setGemsDialogOpen(false);
    toast.success(t('sermon.builder.gemAddedAsStone'));
  };

  const nextStep = () => {
    // Allow skipping - only validate step 1 if we're on it and have data
    if (currentStep === 1 && (sermon.title || sermon.theme_passage)) {
      try {
        if (sermon.title) sermonTitleSchema.parse(sermon.title);
        if (sermon.theme_passage) sermonThemeSchema.parse(sermon.theme_passage.replace(/<[^>]*>/g, ''));
      } catch (error: any) {
        toast.error(error.errors?.[0]?.message || "Invalid input");
        return;
      }
    }
    // All other steps can be skipped freely
    setCurrentStep(Math.min(currentStep + 1, 6));
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const prevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const saveSermon = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Generate a default title if empty
      const defaultTitle = sermon.title || `Sermon Draft - ${new Date().toLocaleDateString()}`;

      const sermonData = {
        user_id: user.id,
        title: defaultTitle,
        theme_passage: sermon.theme_passage || null,
        sermon_style: sermon.sermon_style || SERMON_STYLES[0].value,
        smooth_stones: sermon.smooth_stones || [],
        bridges: sermon.bridges || [],
        movie_structure: sermon.movie_structure || {},
        full_sermon: sermon.full_sermon || "",
        current_step: currentStep,
        status: currentStep >= 5 ? "complete" : "in_progress",
      };

      if (editId) {
        const { error } = await supabase
          .from("sermons")
          .update(sermonData)
          .eq("id", editId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("sermons").insert(sermonData).select('id').single();
        if (error) throw error;
        // Navigate to the new sermon so user can continue editing
        if (data?.id) {
          currentSermonIdRef.current = data.id;
          setCurrentSermonId(data.id);
          navigate(`/sermon-builder?id=${data.id}`, { replace: true });
        }
      }

      toast.success(t('sermon.builder.sermonSaved'));
    } catch (error) {
      console.error("Error saving sermon:", error);
      toast.error(t('sermon.builder.saveError'));
    } finally {
      setLoading(false);
    }
  };

  const startNewSermon = () => {
    // Clear auto-save timer
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current);
    }
    
    // Clear all sermon state
    const emptySermon = {
      title: "",
      theme_passage: "",
      sermon_style: SERMON_STYLES[0].value,
      smooth_stones: [] as string[],
      bridges: [] as string[],
      movie_structure: {},
      full_sermon: "",
    };
    setSermon(emptySermon);
    setCurrentStep(1);
    setActiveTab("builder"); // Reset to builder tab
    setNewStone("");
    setNewBridge("");
    setAiHelp("");
    setScriptureArmory({});
    setCurrentSermonId(null); // Reset sermon ID for new sermon
    currentSermonIdRef.current = null;
    setLastAutoSave(null);

    // Clear persisted state directly from localStorage to avoid race conditions
    try {
      const stored = localStorage.getItem("pt_page_states");
      if (stored) {
        const states = JSON.parse(stored);
        if (states["/sermon-builder"]) {
          delete states["/sermon-builder"].customState;
          localStorage.setItem("pt_page_states", JSON.stringify(states));
        }
      }
      // Also clear the sermon autosave content
      localStorage.removeItem("sermon_autosave_content");
    } catch (e) {
      console.warn("Failed to clear sermon state:", e);
    }

    // Navigate with ?new=true to signal fresh start (prevents state restoration)
    navigate("/sermon-builder?new=true", { replace: true });
    toast.success(t('sermon.builder.startingNew'));
  };

  const loadLibrarySermons = async () => {
    setLoadingLibrary(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("sermons")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setLibrarySermons(data || []);
    } catch (error) {
      console.error("Error loading sermons:", error);
      toast.error(t('sermon.builder.loadSermonsError'));
    } finally {
      setLoadingLibrary(false);
    }
  };

  const deleteLibrarySermon = async (id: string) => {
    try {
      const { error } = await supabase.from("sermons").delete().eq("id", id);
      if (error) throw error;
      setLibrarySermons(librarySermons.filter(s => s.id !== id));
      // If we deleted the currently edited sermon, start a new one
      if (editId === id) {
        startNewSermon();
      }
      toast.success(t('sermon.builder.sermonDeleted'));
    } catch (error) {
      console.error("Error deleting sermon:", error);
      toast.error(t('sermon.builder.deleteError'));
    }
  };

  const duplicateLibrarySermon = async (sermonToDuplicate: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.from("sermons").insert({
        user_id: user.id,
        title: `${sermonToDuplicate.title} (Copy)`,
        theme_passage: sermonToDuplicate.theme_passage,
        sermon_style: sermonToDuplicate.sermon_style,
        smooth_stones: sermonToDuplicate.smooth_stones,
        bridges: sermonToDuplicate.bridges,
        movie_structure: sermonToDuplicate.movie_structure,
        full_sermon: sermonToDuplicate.full_sermon,
        status: "in_progress",
        current_step: sermonToDuplicate.current_step,
      }).select('id').single();

      if (error) throw error;
      toast.success(t('sermon.builder.sermonDuplicated'));
      loadLibrarySermons();
      // Open the duplicated sermon
      if (data?.id) {
        navigate(`/sermon-builder?id=${data.id}`);
      }
    } catch (error) {
      console.error("Error duplicating sermon:", error);
      toast.error(t('sermon.builder.duplicateError'));
    }
  };

  // Load library when tab changes to library
  useEffect(() => {
    if (activeTab === "library") {
      loadLibrarySermons();
    }
  }, [activeTab]);

  if (loading && editId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-x-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
        <Navigation />
        <div className="flex items-center justify-center h-[60vh] relative z-10">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-x-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-purple-500/40 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.25, 0.4, 0.25],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/3 -right-32 w-80 h-80 bg-indigo-500/40 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-32 left-1/4 w-72 h-72 bg-fuchsia-500/30 rounded-full blur-3xl"
        />
      </div>
      <Navigation />
      {tourOpen && <GuidedTourOverlay steps={SERMON_BUILDER_TOUR} onClose={() => setTourOpen(false)} />}
      {/* Header */}
      <div className="relative z-10 bg-white/5 backdrop-blur-xl border-b border-white/10 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between flex-wrap gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Film className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">{t('sermon.builder.title')}</h1>
                <div className="flex items-center gap-3">
                  <p className="text-purple-200 text-lg">{t('sermon.builder.subtitle')}</p>
                  {isAutoSaving && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1 animate-pulse">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      {t('common.saving')}
                    </span>
                  )}
                  {!isAutoSaving && lastAutoSave && (
                    <span className="text-xs text-purple-300">
                      {t('common.saved')} {lastAutoSave.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { primeAudioForTour(); setTourOpen(true); }}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 gap-1"
              >
                <GraduationCap className="w-4 h-4" /> Tour
              </Button>
              <Button
                onClick={startNewSermon}
                className="bg-white text-purple-900 hover:bg-white/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('sermon.builder.newSermon')}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const sermonId = searchParams.get("id");
                  navigate(sermonId ? `/sermon-powerpoint?id=${sermonId}` : "/sermon-powerpoint");
                }}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <Presentation className="w-4 h-4 mr-2" />
                {t('sermon.builder.powerPoint')}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="max-w-7xl mx-auto px-6 pt-6 relative z-10">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "builder" | "library" | "simmer" | "starters" | "myidea")}>
          <TabsList className="bg-white/10 border border-white/20">
            <TabsTrigger
              value="builder"
              className="data-[state=active]:bg-white data-[state=active]:text-purple-900 text-white"
            >
              <Film className="w-4 h-4 mr-2" />
              {t('sermon.builder.tabBuilder')}
            </TabsTrigger>
            <TabsTrigger
              value="library"
              className="data-[state=active]:bg-white data-[state=active]:text-purple-900 text-white"
            >
              <Archive className="w-4 h-4 mr-2" />
              {t('sermon.builder.tabLibrary')}
            </TabsTrigger>
            <TabsTrigger
              value="simmer"
              className="data-[state=active]:bg-white data-[state=active]:text-purple-900 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {t('sermon.builder.tabSimmer')}
            </TabsTrigger>
            <TabsTrigger
              value="myidea"
              className="data-[state=active]:bg-white data-[state=active]:text-purple-900 text-white"
            >
              <Brain className="w-4 h-4 mr-2" />
              {t('sermon.builder.tabMyIdea')}
            </TabsTrigger>
            <TabsTrigger
              value="starters"
              className="data-[state=active]:bg-white data-[state=active]:text-purple-900 text-white"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              {t('sermon.builder.tabIdeaStarters')}
            </TabsTrigger>
          </TabsList>

          {/* Library Tab */}
          <TabsContent value="library" className="mt-6">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Archive className="w-5 h-5" />
                  {t('sermon.builder.mySermonLibrary')}
                  <span className="text-sm font-normal text-purple-200">({t('sermon.builder.sermonCount', { count: librarySermons.length })})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingLibrary ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                ) : librarySermons.length === 0 ? (
                  <div className="text-center py-12 text-white/60">
                    <Film className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">{t('sermon.builder.noSermonsYet')}</p>
                    <p className="text-sm">{t('sermon.builder.startBuildingFirst')}</p>
                    <Button onClick={startNewSermon} className="mt-4 bg-white text-purple-900 hover:bg-white/90">
                      <Plus className="w-4 h-4 mr-2" />
                      {t('sermon.builder.newSermon')}
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {librarySermons.map((s) => (
                      <Card key={s.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-white line-clamp-1">{s.title || "Untitled Sermon"}</h3>
                            <Badge variant={s.status === "complete" ? "default" : "secondary"} className="ml-2 shrink-0">
                              {s.status === "complete" ? (
                                <><CheckCircle2 className="w-3 h-3 mr-1" />{t('sermon.builder.complete')}</>
                              ) : (
                                <><Clock className="w-3 h-3 mr-1" />{t('sermon.builder.inProgress')}</>
                              )}
                            </Badge>
                          </div>
                          <p className="text-sm text-white/60 line-clamp-1 mb-2">
                            {s.theme_passage ? s.theme_passage.replace(/<[^>]*>/g, '') : t('sermon.builder.noPassageSet')}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-white/40 mb-3">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(s.updated_at), "MMM d, yyyy")}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                navigate(`/sermon-builder?id=${s.id}`);
                                setActiveTab("builder");
                              }}
                              className="flex-1 text-white hover:bg-white/20"
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              {t('common.edit')}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => duplicateLibrarySermon(s)}
                              className="text-white hover:bg-white/20"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-300 hover:bg-red-500/20 hover:text-red-200"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>{t('sermon.builder.deleteConfirmTitle')}</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {t('sermon.builder.deleteConfirmDescription', { title: s.title || t('sermon.builder.untitledSermon') })}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteLibrarySermon(s.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    {t('common.delete')}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Simmer Tab - Now with Engine Dashboard */}
          <TabsContent value="simmer" className="mt-6">
            <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-white/20 dark:border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between border-b border-white/10 dark:border-slate-700 pb-4">
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  {t('sermon.builder.simmerEngine')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <SimmerEngineWrapper 
                  onExportToSermon={(content) => {
                    // Append exported content to the full sermon
                    setSermon(prev => ({
                      ...prev,
                      full_sermon: prev.full_sermon 
                        ? prev.full_sermon + "\n\n---\n\n## Simmer Export\n\n" + content
                        : "## Simmer Export\n\n" + content
                    }));
                    setActiveTab("builder");
                    setCurrentStep(5); // Go to writing step
                    toast.success(t('sermon.builder.contentAddedToSermon'));
                  }}
                  sermonId={editId || undefined}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Idea Tab */}
          <TabsContent value="myidea" className="mt-6">
            <MyIdeaTab />
          </TabsContent>

          {/* Idea Starters Tab */}
          <TabsContent value="starters" className="mt-6">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardContent className="p-6">
                <SermonStartersBrowser />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="builder" className="mt-0">
            {/* Progress Steps */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex gap-4 mb-8 mt-6 overflow-x-auto pb-2"
            >
              {STEP_KEYS.map((step, index) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant={currentStep === step.num ? "default" : "outline"}
                    className={`min-w-[150px] ${
                      currentStep === step.num
                        ? "bg-white text-purple-900 shadow-lg shadow-white/20"
                        : currentStep > step.num
                        ? "bg-white/20 text-white border-white/40 backdrop-blur-sm"
                        : "bg-white/5 text-white/60 border-white/20 backdrop-blur-sm"
                    }`}
                    onClick={() => goToStep(step.num)}
                  >
                    {step.num}. {t(`sermon.steps.${step.key}`, step.key)}
                  </Button>
                </motion.div>
              ))}
            </motion.div>

        <div className={`grid gap-6 ${currentStep === 5 ? 'lg:grid-cols-1' : 'lg:grid-cols-2'}`}>
          {/* Main Content */}
          <Card variant="glass" className={`bg-white/90 dark:bg-white/10 backdrop-blur-xl border-white/20 ${currentStep === 5 ? 'lg:col-span-1' : ''}`}>
            <CardHeader>
              <CardTitle className="text-2xl">
                {currentStep === 1 && t('sermon.builder.step1Title')}
                {currentStep === 2 && t('sermon.builder.step2Title')}
                {currentStep === 3 && t('sermon.builder.step3Title')}
                {currentStep === 4 && t('sermon.builder.step4Title')}
                {currentStep === 5 && t('sermon.builder.step5Title')}
                {currentStep === 6 && t('sermon.builder.step6Title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep === 1 && (
                <>
                  <div>
                    <label className="text-sm font-medium mb-2 block">{t('sermon.builder.sermonTitle')}</label>
                    <div className="relative">
                      <Input
                        placeholder={t('sermon.builder.titlePlaceholder')}
                        value={sermon.title}
                        onChange={(e) => setSermon({ ...sermon, title: e.target.value })}
                        className="pr-10"
                        maxLength={200}
                      />
                      <Mic className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">{t('sermon.builder.themePassage')}</label>
                    <SermonRichTextArea
                      content={sermon.theme_passage}
                      onChange={(content) => setSermon({ ...sermon, theme_passage: content })}
                      placeholder="Enter Bible passage or main theme (e.g., 'John 3:16' or 'God's love for humanity')"
                      minHeight="100px"
                      themePassage={sermon.theme_passage}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                      {t('sermon.builder.sermonStyle')}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <p className="text-sm">{t('sermon.builder.styleTooltip')}</p>
                        </TooltipContent>
                      </Tooltip>
                    </label>
                    <Select value={sermon.sermon_style} onValueChange={(v) => setSermon({ ...sermon, sermon_style: v })}>
                      <SelectTrigger className="h-auto py-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border">
                        {SERMON_STYLES.map((style) => (
                          <SelectItem 
                            key={style.value} 
                            value={style.value}
                            className="py-3 cursor-pointer data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
                          >
                            <div className="flex flex-col gap-1">
                              <span className="font-semibold text-foreground">{style.label}</span>
                              <span className="text-xs text-muted-foreground whitespace-normal max-w-[300px]">{style.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {sermon.sermon_style && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {SERMON_STYLES.find(s => s.value === sermon.sermon_style)?.description}
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={() => askJeeves("sermon-setup", { title: sermon.title, theme: sermon.theme_passage, style: sermon.sermon_style })}
                    disabled={asking || !sermon.title || !sermon.theme_passage}
                    variant="outline"
                    className="w-full"
                  >
                    {asking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {t('sermon.builder.askJeevesSetup')}
                  </Button>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <p className="text-sm text-muted-foreground">
                    {t('sermon.builder.stonesDescription')}
                  </p>
                  
                  <div className="space-y-2">
                    {sermon.smooth_stones.map((stone, idx) => (
                      <div key={idx} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-start gap-2">
                          <span className="font-bold text-purple-900">{t('sermon.builder.stoneNumber', { num: idx + 1 })}:</span>
                          <div className="text-sm text-foreground flex-1 prose prose-sm" dangerouslySetInnerHTML={{ __html: sanitizeHtml(stone) }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <SermonRichTextArea
                      content={newStone}
                      onChange={setNewStone}
                      placeholder="Enter a Phototheology insight or AHA moment..."
                      minHeight="80px"
                      themePassage={sermon.theme_passage}
                    />
                    <div className="flex gap-2">
                      <Button onClick={addSmoothStone} className="flex-1">
                        {t('sermon.builder.addStone', { current: sermon.smooth_stones.length, max: 5 })}
                      </Button>
                      <Dialog open={gemsDialogOpen} onOpenChange={setGemsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            onClick={loadUserGems} 
                            variant="secondary"
                            disabled={loadingGems || sermon.smooth_stones.length >= 5}
                            className="gap-2"
                          >
                            {loadingGems ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gem className="w-4 h-4" />}
                            {t('sermon.builder.pullFromGems')}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh]">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Gem className="w-5 h-5 text-purple-600" />
                              {t('sermon.builder.selectGemAsStone')}
                            </DialogTitle>
                          </DialogHeader>
                          <ScrollArea className="max-h-[60vh] pr-4">
                            {userGems.length === 0 ? (
                              <div className="text-center py-8 text-muted-foreground">
                                <Gem className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p>{t('sermon.builder.noGemsFound')}</p>
                                <p className="text-sm">{t('sermon.builder.createGemsHint')}</p>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {userGems.map((gem) => (
                                  <div 
                                    key={gem.id}
                                    className="p-4 border rounded-lg hover:bg-purple-50 cursor-pointer transition-colors"
                                    onClick={() => addGemAsStone(gem)}
                                  >
                                    <h4 className="font-semibold text-purple-900">{gem.title}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {gem.verse1} • {gem.verse2} • {gem.verse3}
                                    </p>
                                    <p className="text-sm mt-2 line-clamp-2">{gem.connection_explanation}</p>
                                    {gem.principle_codes && gem.principle_codes.length > 0 && (
                                      <div className="flex gap-1 mt-2 flex-wrap">
                                        {gem.principle_codes.map((code, i) => (
                                          <span key={i} className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded">
                                            {code}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </ScrollArea>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  <Button
                    onClick={() => askJeeves("sermon-stones", { theme: sermon.theme_passage, existingStones: sermon.smooth_stones })}
                    disabled={asking}
                    variant="outline"
                    className="w-full"
                  >
                    {asking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {t('sermon.builder.askJeevesStones')}
                  </Button>

                  {/* Scripture Armory Section */}
                  {sermon.smooth_stones.length > 0 && (
                    <div className="mt-6 pt-6 border-t">
                      <ScriptureArmory
                        stones={sermon.smooth_stones}
                        themePassage={sermon.theme_passage}
                        armory={scriptureArmory}
                        setArmory={setScriptureArmory}
                      />
                    </div>
                  )}
                </>
              )}

              {currentStep === 3 && (
                <>
                  <p className="text-sm text-muted-foreground">
                    {t('sermon.builder.bridgesDescription')}
                  </p>
                  
                  <div className="space-y-2">
                    {sermon.bridges.map((bridge, idx) => (
                      <div key={idx} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start gap-2">
                          <ArrowRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-foreground prose prose-sm" dangerouslySetInnerHTML={{ __html: sanitizeHtml(bridge) }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <SermonRichTextArea
                      content={newBridge}
                      onChange={setNewBridge}
                      placeholder="Enter a bridge connection (e.g., 'This leads us to understand...')"
                      minHeight="80px"
                      themePassage={sermon.theme_passage}
                    />
                    <Button onClick={addBridge} className="w-full">
                      {t('sermon.builder.addBridge', { current: sermon.bridges.length })}
                    </Button>
                  </div>

                  <Button
                    onClick={() => askJeeves("sermon-bridges", { stones: sermon.smooth_stones, existingBridges: sermon.bridges })}
                    disabled={asking}
                    variant="outline"
                    className="w-full"
                  >
                    {asking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {t('sermon.builder.askJeevesBridges')}
                  </Button>
                </>
              )}

              {currentStep === 4 && (
                <>
                  <p className="text-sm text-muted-foreground">
                    {t('sermon.builder.movieDescription')}
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">{t('sermon.builder.openingHook')}</label>
                      <SermonRichTextArea
                        content={sermon.movie_structure.opening || ""}
                        onChange={(content) => setSermon({ ...sermon, movie_structure: { ...sermon.movie_structure, opening: content }})}
                        placeholder="How will you grab attention in the first 2 minutes?"
                        minHeight="80px"
                        themePassage={sermon.theme_passage}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">{t('sermon.builder.climax')}</label>
                      <SermonRichTextArea
                        content={sermon.movie_structure.climax || ""}
                        onChange={(content) => setSermon({ ...sermon, movie_structure: { ...sermon.movie_structure, climax: content }})}
                        placeholder="What's the transformative moment?"
                        minHeight="100px"
                        themePassage={sermon.theme_passage}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">{t('sermon.builder.resolution')}</label>
                      <SermonRichTextArea
                        content={sermon.movie_structure.resolution || ""}
                        onChange={(content) => setSermon({ ...sermon, movie_structure: { ...sermon.movie_structure, resolution: content }})}
                        placeholder="How does everything come together?"
                        minHeight="80px"
                        themePassage={sermon.theme_passage}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">{t('sermon.builder.callToAction')}</label>
                      <SermonRichTextArea
                        content={sermon.movie_structure.call_to_action || ""}
                        onChange={(content) => setSermon({ ...sermon, movie_structure: { ...sermon.movie_structure, call_to_action: content }})}
                        placeholder="What should the audience do now?"
                        minHeight="80px"
                        themePassage={sermon.theme_passage}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={() => askJeeves("sermon-structure", { stones: sermon.smooth_stones, bridges: sermon.bridges })}
                    disabled={asking}
                    variant="outline"
                    className="w-full"
                  >
                    {asking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {t('sermon.builder.askJeevesStructure')}
                  </Button>
                </>
              )}

              {currentStep === 5 && (
                <SermonWritingStep
                  sermon={sermon}
                  setSermon={setSermon}
                  themePassage={sermon.theme_passage}
                  sermonId={currentSermonId || editId || undefined}
                  onSermonCreated={(newId) => {
                    currentSermonIdRef.current = newId;
                    setCurrentSermonId(newId);
                  }}
                  isAutoSavingToDb={isAutoSaving}
                  lastDbAutoSave={lastAutoSave}
                  onTriggerDbSave={performAutoSave}
                />
              )}

              {currentStep === 6 && (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle2 className="w-8 h-8 text-green-600 mb-2" />
                    <h3 className="font-bold text-green-900 mb-1">{t('sermon.builder.sermonComplete')}</h3>
                    <p className="text-sm text-green-800">
                      {t('sermon.builder.sermonCompleteDescription')}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-card rounded border">
                      <p className="font-medium text-sm">{t('sermon.builder.reviewTitle')}:</p>
                      <p className="text-foreground">{sermon.title}</p>
                    </div>
                    <div className="p-3 bg-card rounded border">
                      <p className="font-medium text-sm">{t('sermon.builder.reviewStones')}: {sermon.smooth_stones.length}</p>
                    </div>
                    <div className="p-3 bg-card rounded border">
                      <p className="font-medium text-sm">{t('sermon.builder.reviewBridges')}: {sermon.bridges.length}</p>
                    </div>
                    <div className="p-3 bg-card rounded border">
                      <p className="font-medium text-sm">{t('sermon.builder.reviewMovieStructure')}: {t('sermon.builder.complete')}</p>
                    </div>
                    {sermon.full_sermon && (
                      <div className="p-3 bg-card rounded border">
                        <p className="font-medium text-sm">{t('sermon.builder.reviewFullSermon')}: {t('sermon.builder.written')}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Button onClick={saveSermon} disabled={loading} className="flex-1 min-w-[120px]" size="lg">
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      {t('sermon.builder.saveSermon')}
                    </Button>
                    <SermonPDFExport sermon={sermon} size="lg" variant="secondary" />
                    <SermonPPTExport sermon={sermon} size="lg" variant="secondary" />
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex flex-col gap-3 pt-4 border-t">
                <div className="flex gap-2">
                  <Button onClick={prevStep} disabled={currentStep === 1} variant="outline" className="flex-1">
                    {t('common.previous')}
                  </Button>
                  <Button onClick={nextStep} disabled={currentStep === 6} className="flex-1">
                    {t('sermon.builder.nextStep')}
                  </Button>
                </div>
                {currentStep < 5 && (
                  <Button
                    onClick={() => setCurrentStep(5)}
                    variant="ghost"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    <PenLine className="w-4 h-4 mr-2" />
                    {t('sermon.builder.skipToWrite')}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Info Panel - Hidden on step 5 since SermonWritingStep has its own assistant */}
          {currentStep !== 5 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <Card variant="glass" className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-400/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    {t('sermon.builder.smoothStonesApproach')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-white/90">
                  <p>
                    {t('sermon.builder.approachDescription')}
                  </p>
                  <div className="space-y-2">
                    <div className="flex gap-2 items-start">
                      <TrendingUp className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-300" />
                      <p className="text-sm">{t('sermon.builder.approachStone')}</p>
                    </div>
                    <div className="flex gap-2 items-start">
                      <ArrowRight className="w-5 h-5 flex-shrink-0 mt-0.5 text-cyan-300" />
                      <p className="text-sm">{t('sermon.builder.approachBridge')}</p>
                    </div>
                    <div className="flex gap-2 items-start">
                      <Film className="w-5 h-5 flex-shrink-0 mt-0.5 text-purple-300" />
                      <p className="text-sm">{t('sermon.builder.approachMovie')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Help Display */}
              {aiHelp && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card variant="glass" className="bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 border-purple-400/30 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-white">{t('sermon.builder.jeevesGuidanceTitle')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none text-white/90 dark:prose-invert">
                        <StyledMarkdown content={aiHelp} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Sparks Container */}
      {sparks.length > 0 && (
        <div className="fixed bottom-24 right-4 md:bottom-auto md:top-20 z-50">
          <SparkContainer
            sparks={sparks}
            onOpen={openSpark}
            onSave={saveSpark}
            onDismiss={dismissSpark}
            onExplore={exploreSpark}
          />
        </div>
      )}
    </div>
  );
}
