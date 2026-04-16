import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import {
  Presentation,
  Loader2,
  Sparkles,
  BookOpen,
  Palette,
  ChevronRight,
  FileText,
  Download,
  ArrowLeft,
  Check,
  Wand2,
  ExternalLink,
  GraduationCap,
  PanelRightOpen,
  PanelRightClose,
  Save,
  FolderOpen,
  Check as CheckIcon,
} from "lucide-react";
import {
  PPT_THEMES,
  VENUE_PRESETS,
  SLIDE_COUNT_OPTIONS,
  BIBLE_VERSIONS,
  DEFAULT_EXPORT_SETTINGS,
  type PPTExportSettings,
  type SermonDeck,
  type AudienceType,
  type VenueSize,
} from "@/types/sermonPPT";
import { downloadSermonPPT } from "@/lib/sermonPPTRenderer";
import { extractScriptureReferencesFromSermon } from "@/lib/extractScriptureReferences";
import { SlideEditor } from "@/components/sermon/SlideEditor";
import { StudyContentBuilder, type StudyContentBlock } from "@/components/ppt/StudyContentBuilder";
import { PPTJeevesPanel } from "@/components/ppt/PPTJeevesPanel";
import { usePPTAutoSave } from "@/hooks/usePPTAutoSave";

// ============================================================================
// THEME PREVIEW COMPONENT
// ============================================================================

function ThemePreview({ themeId, selected }: { themeId: string; selected: boolean }) {
  const theme = PPT_THEMES[themeId];
  if (!theme) return null;

  return (
    <div
      className={`relative w-full aspect-video rounded-lg border-2 overflow-hidden cursor-pointer transition-all ${
        selected
          ? "border-purple-500 ring-2 ring-purple-500/30"
          : "border-transparent hover:border-purple-300"
      }`}
      style={{ backgroundColor: theme.colors.background_primary }}
    >
      {/* Selected check */}
      {selected && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}

      {/* Accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: theme.colors.accent }}
      />

      {/* Mini slide content */}
      <div className="p-3 flex flex-col justify-center h-full">
        <div
          className="text-sm font-bold mb-0.5 truncate"
          style={{ color: theme.colors.text_primary }}
        >
          Title
        </div>
        <div
          className="text-[10px]"
          style={{ color: theme.colors.text_secondary }}
        >
          Subtitle text
        </div>
        <div
          className="mt-2 w-8 h-0.5"
          style={{ backgroundColor: theme.colors.accent }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function SermonPowerPoint() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sermonId = searchParams.get("id");
  
  const [activeTab, setActiveTab] = useState<"full" | "verses" | "study">("full");
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"input" | "settings" | "edit" | "preview">("input");
  const [showJeeves, setShowJeeves] = useState(false);

  // Input state
  const [sermonTitle, setSermonTitle] = useState("");
  const [sermonContent, setSermonContent] = useState("");
  const [versesInput, setVersesInput] = useState("");
  
  // Study state
  const [studyTitle, setStudyTitle] = useState("");
  const [studyBlocks, setStudyBlocks] = useState<StudyContentBlock[]>([]);

  // Settings state
  const [settings, setSettings] = useState<PPTExportSettings>(DEFAULT_EXPORT_SETTINGS);

  // Generated deck
  const [generatedDeck, setGeneratedDeck] = useState<SermonDeck | null>(null);

  // Gamma-specific state
  const [useGamma, setUseGamma] = useState(false);
  const [gammaResult, setGammaResult] = useState<{
    success: boolean;
    title: string;
    gammaUrl: string;
    exportUrl?: string;
    numCards: number;
  } | null>(null);
  const [gammaImageStyle, setGammaImageStyle] = useState<"photorealistic" | "illustration" | "none">("photorealistic");
  const [gammaApiKey, setGammaApiKey] = useState("");
  const [gammaKeyLoading, setGammaKeyLoading] = useState(false);
  const [gammaKeySaved, setGammaKeySaved] = useState(false);

  // Auto-save data - memoize to prevent unnecessary re-renders
  const autoSaveData = useMemo(() => ({
    activeTab,
    sermonTitle,
    sermonContent,
    versesInput,
    studyTitle,
    studyBlocks,
    settings,
    generatedDeck,
  }), [activeTab, sermonTitle, sermonContent, versesInput, studyTitle, studyBlocks, settings, generatedDeck]);

  const autoSaveSetters = useMemo(() => ({
    setActiveTab,
    setSermonTitle,
    setSermonContent,
    setVersesInput,
    setStudyTitle,
    setStudyBlocks,
    setSettings,
    setGeneratedDeck,
  }), []);

  // Auto-save hook - saves every 15 seconds
  const { lastSavedTime, saveNow, clearSavedData } = usePPTAutoSave(autoSaveData, autoSaveSetters);

  // Load user's saved Gamma API key
  useEffect(() => {
    const loadGammaKey = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data, error } = await supabase
        .rpc("get_decrypted_gamma_key", { _user_id: user.id });
      
      if (!error && data) {
        setGammaApiKey(data);
        setGammaKeySaved(true);
      }
    };
    loadGammaKey();
  }, []);

  // Save Gamma API key to profile
  const saveGammaApiKey = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error(t('sermon.ppt.signInToSave'));
      return;
    }
    
    if (!gammaApiKey.startsWith("sk-gamma-")) {
      toast.error(t('sermon.ppt.invalidGammaKey'));
      return;
    }
    
    setGammaKeyLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ gamma_api_key: gammaApiKey })
        .eq("id", user.id);
      
      if (error) throw error;
      setGammaKeySaved(true);
      toast.success(t('sermon.ppt.gammaKeySaved'));
    } catch (error) {
      console.error("Error saving Gamma API key:", error);
      toast.error(t('sermon.ppt.saveKeyError'));
    } finally {
      setGammaKeyLoading(false);
    }
  };

  // Load sermon data if ID provided
  useEffect(() => {
    const loadSermon = async () => {
      if (!sermonId) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("sermons")
          .select("title, theme_passage, smooth_stones, bridges, movie_structure, polish_analysis")
          .eq("id", sermonId)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setSermonTitle(data.title || "");
          
          // Build content from available sermon data
          let contentParts: string[] = [];
          
          if (data.theme_passage) {
            contentParts.push(`Theme Passage: ${data.theme_passage}`);
          }
          
          // Extract smooth stones
          if (data.smooth_stones && Array.isArray(data.smooth_stones)) {
            const stones = data.smooth_stones as Array<{ title?: string; content?: string }>;
            stones.forEach((stone, i) => {
              if (stone.title || stone.content) {
                contentParts.push(`\nPoint ${i + 1}: ${stone.title || ''}`);
                if (stone.content) contentParts.push(stone.content);
              }
            });
          }
          
          // Extract bridges
          if (data.bridges && Array.isArray(data.bridges)) {
            const bridges = data.bridges as Array<{ content?: string }>;
            bridges.forEach((bridge) => {
              if (bridge.content) contentParts.push(bridge.content);
            });
          }
          
          // Extract movie structure
          if (data.movie_structure && typeof data.movie_structure === 'object') {
            const movie = data.movie_structure as Record<string, string>;
            Object.entries(movie).forEach(([key, value]) => {
              if (value) contentParts.push(`${key}: ${value}`);
            });
          }
          
          const combinedContent = contentParts.join('\n\n');
          setSermonContent(combinedContent);
          
          // Extract scripture references for verses tab
          const refs = extractScriptureReferencesFromSermon(combinedContent);
          if (data.theme_passage) {
            // Add theme passage if not already included
            if (!refs.some(r => r.toLowerCase().includes(data.theme_passage?.toLowerCase() || ''))) {
              refs.unshift(data.theme_passage);
            }
          }
          if (refs.length > 0) {
            setVersesInput(refs.join('\n'));
          }
          
          toast.success(t('sermon.ppt.sermonLoaded'));
        }
      } catch (error) {
        console.error("Error loading sermon:", error);
        toast.error(t('sermon.ppt.loadSermonError'));
      } finally {
        setLoading(false);
      }
    };
    
    loadSermon();
  }, [sermonId]);

  // Check if input is valid
  const isInputValid = activeTab === "verses"
    ? versesInput.trim().length > 0
    : activeTab === "study"
    ? studyTitle.trim().length > 0 && studyBlocks.length > 0
    : sermonContent.trim().length > 50;

  // Convert study blocks to content for generation
  const getStudyContentForGeneration = useCallback(() => {
    return studyBlocks.map(block => {
      const prefix = block.type === 'scripture' && block.scriptureRef ? `[${block.scriptureRef}] ` : '';
      return `[${block.type.toUpperCase()}] ${prefix}${block.content}`;
    }).join('\n\n');
  }, [studyBlocks]);

  // Handle Jeeves insert
  const handleJeevesInsert = useCallback((content: string, type: 'scripture' | 'insight' | 'teaching') => {
    const newBlock: StudyContentBlock = {
      id: `block-${Date.now()}`,
      type,
      content,
      order: studyBlocks.length,
    };
    setStudyBlocks([...studyBlocks, newBlock]);
  }, [studyBlocks]);

  // Generate presentation structure from AI
  const generatePresentation = async () => {
    setGenerating(true);
    try {
      const isVersesMode = activeTab === "verses";
      const isStudyMode = activeTab === "study";
      const verses = isVersesMode
        ? versesInput.split("\n").filter((v) => v.trim())
        : undefined;
      
      const contentForGeneration = isStudyMode ? getStudyContentForGeneration() : sermonContent;
      const titleForGeneration = isStudyMode ? studyTitle : sermonTitle;

      if (useGamma) {
        // Validate API key is saved
        if (!gammaApiKey || !gammaApiKey.startsWith("sk-gamma-")) {
          toast.error(t('sermon.ppt.enterGammaKeyFirst'));
          setGenerating(false);
          return;
        }

        // Generate with Gamma - pass user's API key
        const { data, error } = await supabase.functions.invoke("gamma-generate", {
          body: {
            apiKey: gammaApiKey,
            mode: isVersesMode ? "verses-only" : isStudyMode ? "study" : "full-sermon",
            sermonData: !isVersesMode ? {
              title: titleForGeneration || "Untitled",
              themePassage: "",
              sermonStyle: isStudyMode ? "teaching" : "expository",
              smoothStones: [],
              bridges: [],
              movieStructure: null,
              fullSermon: contentForGeneration,
            } : undefined,
            verses: isVersesMode ? verses : undefined,
            settings: {
              slideCount: settings.slide_count <= 12 ? 'minimal' : settings.slide_count <= 20 ? 'standard' : 'expanded',
              bibleVersion: settings.bible_version,
              audienceType: settings.audience,
              imageStyle: gammaImageStyle,
              textAmount: 'medium',
              dimensions: '16x9',
              tone: 'reverent, inspiring',
            },
          },
        });

        if (error) throw error;
        if (data.error) throw new Error(data.error);

        setGammaResult(data);
        setStep("preview");
        toast.success(t('sermon.ppt.gammaCreated', { count: data.numCards || 0 }));
      } else {
        // Generate with built-in renderer
        const { data, error } = await supabase.functions.invoke("sermon-to-ppt", {
          body: {
            mode: isVersesMode ? "verses-only" : isStudyMode ? "study" : "full-sermon",
            verses: isVersesMode ? verses : undefined,
            sermonData: !isVersesMode ? {
              title: titleForGeneration || "Untitled",
              themePassage: "",
              sermonStyle: isStudyMode ? "teaching" : "expository",
              smoothStones: [],
              bridges: [],
              movieStructure: null,
              fullSermon: contentForGeneration,
            } : undefined,
            settings: {
              slideCount: settings.slide_count,
              bibleVersion: settings.bible_version,
              audienceType: settings.audience,
              theme: settings.theme_id,
              venue: settings.venue_preset,
            },
          },
        });

        if (error) throw error;

        setGeneratedDeck(data as SermonDeck);
        setStep("edit");
        toast.success(t('sermon.ppt.presentationGenerated'));
      }
    } catch (error: any) {
      console.error("Error generating presentation:", error);
      if (error.message?.includes("401")) {
        toast.error(t('sermon.ppt.invalidGammaKeyCheck'));
      } else if (error.message?.includes("403")) {
        toast.error(t('sermon.ppt.gammaAccessDenied'));
      } else {
        toast.error(error.message || t('sermon.ppt.generateError'));
      }
    } finally {
      setGenerating(false);
    }
  };

  // Save PowerPoint to library
  const [saving, setSaving] = useState(false);
  const [savedToLibrary, setSavedToLibrary] = useState(false);

  const savePPTToLibrary = async () => {
    if (!generatedDeck) return;

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error(t('sermon.ppt.signInToSaveLibrary'));
        return;
      }

      const title = activeTab === 'study' ? studyTitle : sermonTitle || generatedDeck.metadata.sermonTitle || 'Untitled Presentation';

      const { error } = await supabase
        .from('saved_powerpoints')
        .insert([{
          user_id: user.id,
          title,
          content_type: activeTab,
          sermon_id: sermonId || null,
          settings: JSON.parse(JSON.stringify(settings)),
          slide_data: JSON.parse(JSON.stringify(generatedDeck)),
          theme_id: settings.theme_id,
        }]);

      if (error) throw error;

      setSavedToLibrary(true);
      toast.success(t('sermon.ppt.savedToLibrary'));
    } catch (error) {
      console.error("Error saving to library:", error);
      toast.error(t('sermon.ppt.saveToLibraryError'));
    } finally {
      setSaving(false);
    }
  };

  // Download the PowerPoint file
  const downloadPPT = async () => {
    if (!generatedDeck) return;

    setGenerating(true);
    try {
      // Update the deck with current settings before download
      const deckWithSettings: SermonDeck = {
        ...generatedDeck,
        theme: settings.theme_id,
        venue: settings.venue_preset,
      };
      
      await downloadSermonPPT(deckWithSettings);

      toast.success(t('sermon.ppt.downloadSuccess'));
    } catch (error) {
      console.error("Error downloading PPT:", error);
      toast.error(t('sermon.ppt.downloadError'));
    } finally {
      setGenerating(false);
    }
  };

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

      {/* Header */}
      <div className="relative z-10 bg-white/5 backdrop-blur-xl border-b border-white/10 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Presentation className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{t('sermon.ppt.title')}</h1>
                <p className="text-purple-200">{t('sermon.ppt.subtitle')}</p>
              </div>
            </div>
            
            {/* Auto-save indicator */}
            {lastSavedTime && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/70 text-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{t('common.saved')} {lastSavedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-6 py-6 relative z-10">
        <div className="flex items-center justify-center gap-2 mb-8">
          {[
            { id: "input", label: t('sermon.ppt.stepContent'), icon: FileText },
            { id: "settings", label: t('sermon.ppt.stepStyle'), icon: Palette },
            { id: "edit", label: t('common.edit'), icon: Wand2 },
            { id: "preview", label: t('sermon.ppt.stepDownload'), icon: Download },
          ].map((s, idx) => (
            <div key={s.id} className="flex items-center">
              <button
                onClick={() => {
                  if (s.id === "input") setStep("input");
                  else if (s.id === "settings" && isInputValid) setStep("settings");
                  else if (s.id === "edit" && generatedDeck) setStep("edit");
                  else if (s.id === "preview" && generatedDeck) setStep("preview");
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  step === s.id
                    ? "bg-white text-purple-900 shadow-lg"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                <s.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{s.label}</span>
              </button>
              {idx < 3 && (
                <ChevronRight className="w-5 h-5 text-white/30 mx-1" />
              )}
            </div>
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
              <p className="text-white/70">{t('sermon.ppt.loadingSermon')}</p>
            </div>
          </div>
        )}

        {/* Step 1: Input */}
        {step === "input" && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-white/90 dark:bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-purple-600" />
                  {sermonId ? t('sermon.ppt.sermonLoadedReady') : t('sermon.ppt.whatToTurnIntoSlides')}
                </CardTitle>
                <CardDescription>
                  {sermonId ? t('sermon.ppt.sermonLoadedDescription', { title: sermonTitle }) : t('sermon.ppt.pasteContentDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Input Mode Tabs */}
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "full" | "verses" | "study")}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="full" className="gap-2">
                      <Sparkles className="w-4 h-4" />
                      {t('sermon.ppt.fullSermon')}
                    </TabsTrigger>
                    <TabsTrigger value="verses" className="gap-2">
                      <BookOpen className="w-4 h-4" />
                      {t('sermon.ppt.versesOnly')}
                    </TabsTrigger>
                    <TabsTrigger value="study" className="gap-2">
                      <GraduationCap className="w-4 h-4" />
                      {t('sermon.ppt.buildStudy')}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="full" className="mt-4 space-y-4">
                    <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                      <p className="text-sm text-purple-700 dark:text-purple-300">
                        {t('sermon.ppt.fullSermonHint')}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>{t('sermon.ppt.sermonTitleLabel')}</Label>
                      <Input
                        placeholder={t('sermon.ppt.sermonTitlePlaceholder')}
                        value={sermonTitle}
                        onChange={(e) => setSermonTitle(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>{t('sermon.ppt.sermonContentLabel')}</Label>
                      <Textarea
                        placeholder={`Paste your sermon manuscript, outline, or notes here...

Example:
Title: The Prodigal's Return
Text: Luke 15:11-32

Introduction:
Every family has a story of someone who wandered...

Point 1: The Father's Heart Never Changes
Even while the son was far away...

Point 2: Grace Meets Us Where We Are
The father didn't wait for the son to clean up...

Conclusion:
No matter how far you've wandered...`}
                        value={sermonContent}
                        onChange={(e) => setSermonContent(e.target.value)}
                        className="min-h-[300px] font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        {t('sermon.ppt.characterCount', { count: sermonContent.length })}
                        {sermonContent.length < 50 && ` (${t('sermon.ppt.minimumCharacters', { count: 50 })})`}
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="verses" className="mt-4 space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {t('sermon.ppt.versesHint')}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>{t('sermon.ppt.scriptureRefsLabel')}</Label>
                      <Textarea
                        placeholder={`Enter Scripture references, one per line:

John 1:1-5
John 1:14
Colossians 1:15-17
Hebrews 1:1-3

You can also include the verse text:

John 3:16 - "For God so loved the world..."`}
                        value={versesInput}
                        onChange={(e) => setVersesInput(e.target.value)}
                        className="min-h-[250px] font-mono text-sm"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="study" className="mt-4">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800 mb-4">
                          <p className="text-sm text-emerald-700 dark:text-emerald-300">
                            {t('sermon.ppt.studyHint')}
                          </p>
                        </div>
                        <StudyContentBuilder
                          title={studyTitle}
                          blocks={studyBlocks}
                          onTitleChange={setStudyTitle}
                          onBlocksChange={setStudyBlocks}
                          onAskJeeves={() => setShowJeeves(true)}
                          className="min-h-[400px]"
                        />
                      </div>
                      <AnimatePresence>
                        {showJeeves && (
                          <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 380, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <PPTJeevesPanel
                              studyTitle={studyTitle}
                              studyContent={studyBlocks.map(b => b.content).join('\n')}
                              onInsertContent={handleJeevesInsert}
                              className="h-[500px]"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowJeeves(!showJeeves)}
                        className="gap-2"
                      >
                        {showJeeves ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
                        {showJeeves ? t('sermon.ppt.hideJeeves') : t('sermon.ppt.showJeeves')}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>

                <Button
                  onClick={() => setStep("settings")}
                  disabled={!isInputValid}
                  className="w-full gap-2"
                  size="lg"
                >
                  {t('sermon.ppt.continueToStyle')}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Settings */}
        {step === "settings" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-white/90 dark:bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-purple-600" />
                  {t('sermon.ppt.chooseStyle')}
                </CardTitle>
                <CardDescription>
                  {t('sermon.ppt.chooseStyleDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Generator Selection - Gamma Toggle */}
                <div className="p-4 rounded-xl border-2 border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center">
                        <Wand2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <Label className="text-base font-semibold">{t('sermon.ppt.useGamma')}</Label>
                        <p className="text-xs text-muted-foreground">
                          {useGamma ? t('sermon.ppt.gammaDescription') : t('sermon.ppt.builtInDescription')}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={useGamma}
                      onCheckedChange={setUseGamma}
                    />
                  </div>

                  {useGamma && (
                    <div className="mt-4 space-y-4 pt-4 border-t border-purple-500/20">
                      {/* Per-user API key input */}
                      <div className="space-y-2">
                        <Label className="text-sm">{t('sermon.ppt.gammaApiKeyLabel')}</Label>
                        <div className="flex gap-2">
                          <Input
                            type="password"
                            placeholder="sk-gamma-..."
                            value={gammaApiKey}
                            onChange={(e) => {
                              setGammaApiKey(e.target.value);
                              setGammaKeySaved(false);
                            }}
                            className="flex-1"
                          />
                          <Button
                            variant={gammaKeySaved ? "outline" : "default"}
                            size="sm"
                            onClick={saveGammaApiKey}
                            disabled={gammaKeyLoading || !gammaApiKey}
                          >
                            {gammaKeyLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : gammaKeySaved ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              t('common.save')
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {t('sermon.ppt.getKeyAt')}{" "}
                          <a
                            href="https://gamma.app/settings/developers"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:underline"
                          >
                            gamma.app/settings/developers
                          </a>
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">{t('sermon.ppt.imageStyle')}</Label>
                        <Select value={gammaImageStyle} onValueChange={(v) => setGammaImageStyle(v as typeof gammaImageStyle)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="photorealistic">{t('sermon.ppt.photorealistic')}</SelectItem>
                            <SelectItem value="illustration">{t('sermon.ppt.illustration')}</SelectItem>
                            <SelectItem value="none">{t('sermon.ppt.noAiImages')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Theme Selection Grid - only show for built-in */}
                {!useGamma && (
                <div className="space-y-3">
                  <Label>{t('sermon.ppt.visualTheme')}</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.values(PPT_THEMES).map((theme) => (
                      <div
                        key={theme.id}
                        onClick={() => setSettings({ ...settings, theme_id: theme.id })}
                        className="cursor-pointer"
                      >
                        <ThemePreview
                          themeId={theme.id}
                          selected={settings.theme_id === theme.id}
                        />
                        <p className="text-xs text-center mt-1 font-medium">{theme.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
                )}

                {/* Other Settings */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {!useGamma && (
                  <div className="space-y-2">
                    <Label>{t('sermon.ppt.venueSize')}</Label>
                    <Select
                      value={settings.venue_preset}
                      onValueChange={(v) => setSettings({ ...settings, venue_preset: v as VenueSize })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(VENUE_PRESETS).map((venue) => (
                          <SelectItem key={venue.id} value={venue.id}>
                            {venue.name} - {venue.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  )}

                  <div className="space-y-2">
                    <Label>{t('sermon.ppt.slideCount')}</Label>
                    <Select
                      value={String(settings.slide_count)}
                      onValueChange={(v) => setSettings({ ...settings, slide_count: parseInt(v) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SLIDE_COUNT_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('sermon.ppt.bibleVersion')}</Label>
                    <Select
                      value={settings.bible_version}
                      onValueChange={(v) => setSettings({ ...settings, bible_version: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BIBLE_VERSIONS.map((version) => (
                          <SelectItem key={version.value} value={version.value}>
                            {version.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('sermon.ppt.audienceType')}</Label>
                    <Select
                      value={settings.audience}
                      onValueChange={(v) => setSettings({ ...settings, audience: v as AudienceType })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="evangelistic">{t('sermon.ppt.evangelistic')}</SelectItem>
                        <SelectItem value="discipleship">{t('sermon.ppt.discipleship')}</SelectItem>
                        <SelectItem value="doctrinal">{t('sermon.ppt.doctrinal')}</SelectItem>
                        <SelectItem value="devotional">{t('sermon.ppt.devotional')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <Label>{t('sermon.ppt.includeSpeakerNotes')}</Label>
                    <p className="text-xs text-muted-foreground">
                      {t('sermon.ppt.speakerNotesDescription')}
                    </p>
                  </div>
                  <Switch
                    checked={settings.include_speaker_notes}
                    onCheckedChange={(v) =>
                      setSettings({ ...settings, include_speaker_notes: v })
                    }
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep("input")}
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('common.back')}
                  </Button>
                  <Button
                    onClick={generatePresentation}
                    disabled={generating}
                    className={`flex-1 gap-2 ${useGamma ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700' : ''}`}
                    size="lg"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {useGamma ? t('sermon.ppt.creatingWithGamma') : t('sermon.ppt.generatingLabel')}
                      </>
                    ) : (
                      <>
                        {useGamma ? <Wand2 className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                        {useGamma ? t('sermon.ppt.generateWithGamma') : t('sermon.ppt.generatePresentation')}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Edit Slides */}
        {step === "edit" && generatedDeck && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-white/20 overflow-hidden">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Wand2 className="w-5 h-5 text-purple-600" />
                      {t('sermon.ppt.customizeSlides')}
                    </CardTitle>
                    <CardDescription>
                      {t('sermon.ppt.customizeSlidesDescription')}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setStep("settings")}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      {t('common.back')}
                    </Button>
                    <Button onClick={() => setStep("preview")} className="gap-2">
                      {t('sermon.ppt.continueToDownload')}
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[600px]">
                  <SlideEditor
                    deck={generatedDeck}
                    onDeckUpdate={setGeneratedDeck}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 4: Preview & Download - Gamma Result */}
        {step === "preview" && gammaResult && useGamma && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Success Card */}
            <Card className="bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 border-purple-400/30 backdrop-blur-xl">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-full flex items-center justify-center">
                    <Wand2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{t('sermon.ppt.gammaPresentationReady')}</h3>
                    <p className="text-purple-200">
                      {t('sermon.ppt.gammaSlideCount', { count: gammaResult.numCards })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gamma Result Card */}
            <Card className="bg-white/90 dark:bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-purple-500" />
                  {gammaResult.title}
                </CardTitle>
                <CardDescription>
                  {t('sermon.ppt.readyInGamma')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Preview illustration */}
                <div className="p-8 rounded-xl bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 border border-purple-500/20 text-center">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">{t('sermon.ppt.presentationLive')}</h4>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    {t('sermon.ppt.openInGammaDescription')}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep("settings")}
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('sermon.ppt.backToSettings')}
                  </Button>
                  {gammaResult.exportUrl && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(gammaResult.exportUrl, '_blank')}
                      className="flex-1"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {t('sermon.ppt.downloadPptx')}
                    </Button>
                  )}
                  <Button
                    onClick={() => window.open(gammaResult.gammaUrl, '_blank')}
                    className="flex-1 gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700"
                    size="lg"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {t('sermon.ppt.openInGamma')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Start Over */}
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => {
                  setStep("input");
                  setGammaResult(null);
                }}
                className="text-white/70 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('sermon.ppt.createAnother')}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Preview & Download - Built-in */}
        {step === "preview" && generatedDeck && !useGamma && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Success Card */}
            <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/30 backdrop-blur-xl">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{t('sermon.ppt.presentationReady')}</h3>
                    <p className="text-green-200">
                      {generatedDeck.slides.length} slides generated using{" "}
                      {PPT_THEMES[settings.theme_id]?.name || "Modern Dark"} theme
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Deck Info */}
            <Card className="bg-white/90 dark:bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle>{generatedDeck.metadata.sermonTitle}</CardTitle>
                {generatedDeck.metadata.themePassage && (
                  <CardDescription>{generatedDeck.metadata.themePassage}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Slide Structure */}
                <div className="space-y-2">
                  <Label>{t('sermon.ppt.slideStructure', { count: generatedDeck.slides.length })}</Label>
                  <ScrollArea className="h-[300px] rounded-lg border bg-muted/30 p-2">
                    <div className="space-y-1">
                      {generatedDeck.slides.map((slide, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-2 bg-background rounded border text-sm"
                        >
                          <span className="w-7 h-7 flex items-center justify-center bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded text-xs font-bold">
                            {idx + 1}
                          </span>
                          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
                            {slide.type}
                          </span>
                          <span className="flex-1 truncate text-muted-foreground">
                            {slide.title || slide.body?.substring(0, 60) || "—"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep("edit")}
                    className="flex-1"
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    {t('sermon.ppt.editSlides')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={savePPTToLibrary}
                    disabled={saving || savedToLibrary}
                    className="flex-1"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        {t('common.saving')}
                      </>
                    ) : savedToLibrary ? (
                      <>
                        <CheckIcon className="w-4 h-4 mr-2 text-green-500" />
                        {t('sermon.ppt.savedToLibraryLabel')}
                      </>
                    ) : (
                      <>
                        <FolderOpen className="w-4 h-4 mr-2" />
                        {t('sermon.ppt.saveToLibrary')}
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={downloadPPT}
                    disabled={generating}
                    className="flex-1 gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700"
                    size="lg"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t('sermon.ppt.downloading')}
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        {t('sermon.ppt.downloadPowerPoint')}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Start Over */}
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => {
                  setStep("input");
                  setGeneratedDeck(null);
                }}
                className="text-white/70 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('sermon.ppt.createAnother')}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
