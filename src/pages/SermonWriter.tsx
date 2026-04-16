import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { useSermonWriter, OUTLINE_TEMPLATES } from "@/hooks/useSermonWriter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sparkles,
  Search,
  FileText,
  Wand2,
  History,
  Download,
  Plus,
  Trash2,
  MessageCircle,
  Loader2,
  BookOpen,
  PenTool,
  Shield,
  Building2,
  ChevronLeft,
  Star,
  Languages,
  Save,
} from "lucide-react";
import { SermonTextEditor } from "@/components/sermon-writer/SermonTextEditor";
import { motion, AnimatePresence } from "framer-motion";
import { JeevesChat } from "@/components/sermon-writer/jeeves/JeevesChat";
import { toast } from "sonner";
import type { JeevesMode, OutlineTemplateType, CreateSessionInput, SermonWriterSpark, SermonOutline } from "@/types/sermonWriter";
import { VoiceInputButton } from "@/components/ui/VoiceInputButton";

// New Session Form
function NewSessionForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (input: CreateSessionInput) => void;
  isLoading: boolean;
}) {
  const { t } = useTranslation();
  const [theme, setTheme] = useState("");
  const [themePassage, setThemePassage] = useState("");
  const [title, setTitle] = useState("");
  const [template, setTemplate] = useState<OutlineTemplateType>("deductive");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme.trim()) return;
    onSubmit({
      theme: theme.trim(),
      theme_passage: themePassage.trim() || undefined,
      title: title.trim() || undefined,
      outline_template: template,
    });
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <PenTool className="w-5 h-5 text-emerald-400" />
          {t('sermon.writer.newSermonSession')}
        </CardTitle>
        <CardDescription className="text-slate-400">
          {t('sermon.writer.newSessionDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="theme" className="text-slate-300">{t('sermon.writer.themeOrTopic')}</Label>
            <div className="relative">
              <Textarea
                id="theme"
                placeholder="e.g., The transforming power of grace in daily life..."
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 pr-10"
                rows={2}
              />
              <VoiceInputButton
                onTranscript={(text) => setTheme(prev => prev + (prev ? ' ' : '') + text)}
                className="absolute right-2 top-2"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="passage" className="text-slate-300">{t('sermon.writer.keyScripture')}</Label>
            <div className="relative">
              <Input
                id="passage"
                placeholder="e.g., Romans 12:1-2, John 15:1-8"
                value={themePassage}
                onChange={(e) => setThemePassage(e.target.value)}
                className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 pr-10"
              />
              <VoiceInputButton
                onTranscript={(text) => setThemePassage(prev => prev + (prev ? ' ' : '') + text)}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-slate-300">{t('sermon.writer.workingTitle')}</Label>
            <div className="relative">
              <Input
                id="title"
                placeholder="e.g., Living Sacrifices"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 pr-10"
              />
              <VoiceInputButton
                onTranscript={(text) => setTitle(prev => prev + (prev ? ' ' : '') + text)}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">{t('sermon.writer.outlineTemplate')}</Label>
            <Select value={template} onValueChange={(v) => setTemplate(v as OutlineTemplateType)}>
              <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {Object.entries(OUTLINE_TEMPLATES).map(([key, config]) => (
                  <SelectItem key={key} value={key} className="text-white">
                    <div className="flex flex-col">
                      <span>{config.name}</span>
                      <span className="text-xs text-slate-400">{config.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={!theme.trim() || isLoading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('sermon.writer.creating')}
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                {t('sermon.writer.startSession')}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Session List
function SessionList({
  sessions,
  loading,
  onSelect,
  onDelete,
}: {
  sessions: any[];
  loading: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const { t } = useTranslation();
  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
      </div>
    );
  }

  if (!sessions?.length) {
    return (
      <Card className="bg-slate-900/50 border-slate-700">
        <CardContent className="py-8 text-center text-slate-400">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>{t('sermon.writer.noSessionsYet')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white text-lg">{t('sermon.writer.recentSessions')}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <div className="divide-y divide-slate-700">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="p-4 hover:bg-slate-800/50 cursor-pointer transition-colors group"
                onClick={() => onSelect(session.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">
                      {session.title || session.theme}
                    </h3>
                    {session.theme_passage && (
                      <p className="text-sm text-emerald-400 truncate">
                        {session.theme_passage}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(session.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        session.status === 'complete'
                          ? 'border-emerald-500 text-emerald-400'
                          : session.status === 'in_progress'
                          ? 'border-amber-500 text-amber-400'
                          : 'border-slate-500 text-slate-400'
                      }`}
                    >
                      {session.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(session.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Main Page Component
export default function SermonWriter() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("id");
  const [showNewSession, setShowNewSession] = useState(!sessionId);
  const [activeTab, setActiveTab] = useState<string>("sparks");
  const [jeevesMode, setJeevesMode] = useState<JeevesMode>("explorer");

  const {
    session,
    sessions,
    sparks: allSparks,
    loadingSession,
    loadingSessions,
    loadingSparks,
    isProcessing,
    createSession,
    deleteSession,
    setJeevesMode: saveJeevesMode,
    createSpark,
    updateOutline,
    updateContent,
    updateSparkStatus,
  } = useSermonWriter(sessionId || undefined);

  // Filter sparks to ensure they belong to current session (safeguard against stale cache)
  const sparks = allSparks?.filter(spark => spark.session_id === sessionId) || [];

  // Auto-save content with debounce
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [localContent, setLocalContent] = useState('');

  // Initialize local content from session
  useEffect(() => {
    if (session?.content !== undefined) {
      setLocalContent(session.content || '');
    }
  }, [session?.content]);

  const handleContentChange = useCallback((content: string) => {
    setLocalContent(content);

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for auto-save (2 seconds after typing stops)
    saveTimeoutRef.current = setTimeout(async () => {
      setIsSaving(true);
      await updateContent(content);
      setIsSaving(false);
    }, 2000);
  }, [updateContent]);

  // Sync Jeeves mode from session
  useEffect(() => {
    if (session?.last_jeeves_mode) {
      setJeevesMode(session.last_jeeves_mode);
    }
  }, [session?.last_jeeves_mode]);

  const handleCreateSession = async (input: CreateSessionInput) => {
    const newSession = await createSession.mutateAsync(input);
    if (newSession) {
      navigate(`/sermon-writer?id=${newSession.id}`);
      setShowNewSession(false);
    }
  };

  const handleSelectSession = (id: string) => {
    navigate(`/sermon-writer?id=${id}`);
    setShowNewSession(false);
  };

  const handleModeChange = async (mode: JeevesMode) => {
    setJeevesMode(mode);
    await saveJeevesMode(mode);
  };

  // Handle sparks discovered from Jeeves chat
  const handleSparksDiscovered = useCallback(async (newSparks: Partial<SermonWriterSpark>[]) => {
    if (!session) return;

    for (const spark of newSparks) {
      try {
        await createSpark.mutateAsync({
          session_id: session.id,
          spark_type: spark.spark_type || 'connection',
          kind: spark.kind || 'insight',
          title: spark.title || 'Untitled Spark',
          summary: spark.summary || '',
          confidence: spark.confidence || 0.7,
          novelty_score: spark.novelty_score || 0.5,
          source: spark.source || jeevesMode,
          pt_mapping: spark.pt_mapping,
          claim_ladder: spark.claim_ladder,
          evidence: spark.evidence,
          counterpoints: spark.counterpoints,
          status: 'active',
        });
      } catch (error) {
        console.error("Failed to create spark:", error);
      }
    }
  }, [session, createSpark, jeevesMode]);

  // Handle outline update from Architect mode
  const handleOutlineUpdate = useCallback(async (newOutline: SermonOutline) => {
    if (!session) return;

    try {
      await updateOutline(newOutline);
      toast.success(t('sermon.writer.outlineUpdated'));
    } catch (error) {
      console.error("Failed to update outline:", error);
      toast.error(t('sermon.writer.outlineUpdateFailed'));
    }
  }, [session, updateOutline]);

  // Handle logical gaps from Auditor mode
  const handleLogicalGapsFound = useCallback((gaps: any[]) => {
    // For now, just notify - in Phase 3 we'll display these in the UI
    console.log("Logical gaps found:", gaps);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 relative overflow-x-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 -right-32 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl"
        />
      </div>

      <Navigation />

      {/* Header */}
      <div className="relative z-10 bg-black/20 backdrop-blur-xl border-b border-emerald-500/20 py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between flex-wrap gap-4"
          >
            <div className="flex items-center gap-4">
              {sessionId && !showNewSession && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNewSession(true)}
                  className="text-slate-400 hover:text-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              )}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <PenTool className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{t('sermon.writer.title')}</h1>
                <p className="text-emerald-300 text-sm">
                  {session ? session.title || session.theme : t('sermon.writer.subtitle')}
                </p>
              </div>
            </div>

            {session && !showNewSession && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewSession(true)}
                  className="bg-emerald-500/10 border-emerald-500/30 text-white hover:bg-emerald-500/20"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('sermon.writer.newSession')}
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {showNewSession || !sessionId ? (
          <div className="grid md:grid-cols-2 gap-8">
            <NewSessionForm
              onSubmit={handleCreateSession}
              isLoading={createSession.isPending}
            />
            <SessionList
              sessions={sessions || []}
              loading={loadingSessions}
              onSelect={handleSelectSession}
              onDelete={(id) => deleteSession.mutate(id)}
            />
          </div>
        ) : loadingSession ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          </div>
        ) : session ? (
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Left Panel: Sparks */}
            <div className="lg:col-span-3">
              <Card className="bg-slate-900/70 border-slate-700 h-[calc(100vh-220px)] flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      {t('sermon.writer.sparks')}
                    </CardTitle>
                    <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">
                      {sparks?.length || 0}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-3">
                  <ScrollArea className="h-full">
                    {loadingSparks ? (
                      <div className="flex items-center justify-center h-32">
                        <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
                      </div>
                    ) : sparks?.length ? (
                      <div className="space-y-2 pr-2">
                        {sparks.map((spark) => {
                          const kindColors: Record<string, string> = {
                            insight: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
                            claim: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
                            evidence: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                            illustration: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
                            application: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
                            transition: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
                            question: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
                          };
                          const kindClass = kindColors[spark.kind] || kindColors.insight;

                          return (
                            <motion.div
                              key={spark.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className={`bg-slate-800/50 border rounded-lg p-3 hover:bg-slate-800/70 transition-all cursor-pointer group ${
                                spark.status === 'favorite'
                                  ? 'border-amber-500/50'
                                  : 'border-slate-600 hover:border-emerald-500/50'
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 ${kindClass}`}>
                                      {spark.kind}
                                    </Badge>
                                    {spark.source !== 'manual' && (
                                      <span className="text-[10px] text-slate-500">
                                        via {spark.source}
                                      </span>
                                    )}
                                  </div>
                                  <h4 className="text-white text-sm font-medium leading-tight line-clamp-1">
                                    {spark.title}
                                  </h4>
                                  <p className="text-slate-400 text-xs line-clamp-2 mt-1 leading-relaxed">
                                    {spark.summary}
                                  </p>
                                  {/* Confidence bar */}
                                  <div className="mt-2 flex items-center gap-2">
                                    <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                                      <div
                                        className={`h-full rounded-full transition-all ${
                                          spark.confidence > 0.7
                                            ? 'bg-emerald-500'
                                            : spark.confidence > 0.4
                                            ? 'bg-amber-500'
                                            : 'bg-slate-500'
                                        }`}
                                        style={{ width: `${spark.confidence * 100}%` }}
                                      />
                                    </div>
                                    <span className="text-[10px] text-slate-500 w-7">
                                      {Math.round(spark.confidence * 100)}%
                                    </span>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={`shrink-0 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity ${
                                    spark.status === 'favorite'
                                      ? 'opacity-100 text-amber-400'
                                      : 'text-slate-400 hover:text-amber-400'
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateSparkStatus(
                                      spark.id,
                                      spark.status === 'favorite' ? 'active' : 'favorite'
                                    );
                                  }}
                                >
                                  <Star
                                    className={`w-4 h-4 ${spark.status === 'favorite' ? 'fill-current' : ''}`}
                                  />
                                </Button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center text-slate-400 py-8">
                        <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">{t('sermon.writer.noSparksYet')}</p>
                        <p className="text-xs mt-1 text-slate-500">
                          {t('sermon.writer.useExplorerHint')}
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Center: Main Work Area */}
            <div className="lg:col-span-6">
              <Card className="bg-slate-900/70 border-slate-700 h-[calc(100vh-220px)] flex flex-col">
                <CardHeader className="pb-3">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="bg-slate-800/50 border border-slate-700 w-full">
                      <TabsTrigger
                        value="sparks"
                        className="flex-1 data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        {t('sermon.writer.sparks')}
                      </TabsTrigger>
                      <TabsTrigger
                        value="outline"
                        className="flex-1 data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        {t('sermon.writer.outline')}
                      </TabsTrigger>
                      <TabsTrigger
                        value="write"
                        className="flex-1 data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                      >
                        <PenTool className="w-4 h-4 mr-2" />
                        {t('sermon.writer.write')}
                      </TabsTrigger>
                      <TabsTrigger
                        value="polish"
                        className="flex-1 data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                      >
                        <Wand2 className="w-4 h-4 mr-2" />
                        {t('sermon.writer.polish')}
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full">
                    <AnimatePresence mode="wait">
                      {activeTab === "sparks" && (
                        <motion.div
                          key="sparks"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="text-center text-slate-400 py-16"
                        >
                          <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <h3 className="text-lg font-medium text-white mb-2">{t('sermon.writer.sparkManagement')}</h3>
                          <p className="text-sm max-w-md mx-auto">
                            {t('sermon.writer.sparkManagementDescription')}
                          </p>
                        </motion.div>
                      )}

                      {activeTab === "outline" && (
                        <motion.div
                          key="outline"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="text-center text-slate-400 py-16"
                        >
                          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <h3 className="text-lg font-medium text-white mb-2">{t('sermon.writer.outlineBuilder')}</h3>
                          <p className="text-sm max-w-md mx-auto">
                            {t('sermon.writer.outlineBuilderDescription', { template: OUTLINE_TEMPLATES[session.outline_template].name })}
                          </p>
                          <div className="mt-6 space-y-2 max-w-sm mx-auto">
                            {session.outline_data.nodes.map((node, index) => (
                              <div
                                key={node.id}
                                className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-left"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center">
                                    {index + 1}
                                  </span>
                                  <span className="text-white text-sm">{node.label}</span>
                                  <Badge variant="outline" className="ml-auto text-xs text-slate-400 border-slate-600">
                                    {node.sparkIds?.length || 0} sparks
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {activeTab === "write" && (
                        <motion.div
                          key="write"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="h-full"
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Languages className="w-4 h-4 text-emerald-400" />
                              <span className="text-sm text-slate-400">
                                {t('sermon.writer.selectWordHint')}
                              </span>
                            </div>
                            {isSaving && (
                              <div className="flex items-center gap-2 text-slate-400">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span className="text-xs">{t('common.saving')}</span>
                              </div>
                            )}
                            {!isSaving && localContent && (
                              <div className="flex items-center gap-2 text-emerald-400">
                                <Save className="w-3 h-3" />
                                <span className="text-xs">{t('common.saved')}</span>
                              </div>
                            )}
                          </div>
                          <SermonTextEditor
                            content={localContent}
                            onChange={handleContentChange}
                            placeholder="Start writing your sermon here. Select any word to look up its original Greek or Hebrew meaning..."
                          />
                        </motion.div>
                      )}

                      {activeTab === "polish" && (
                        <motion.div
                          key="polish"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="text-center text-slate-400 py-16"
                        >
                          <Wand2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <h3 className="text-lg font-medium text-white mb-2">{t('sermon.writer.polishEngine')}</h3>
                          <p className="text-sm max-w-md mx-auto">
                            {t('sermon.writer.polishEngineDescription')}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Right Panel: Jeeves */}
            <div className="lg:col-span-3">
              <JeevesChat
                sessionId={session.id}
                theme={session.theme}
                themePassage={session.theme_passage}
                currentMode={jeevesMode}
                onModeChange={handleModeChange}
                existingSparks={sparks || []}
                outline={session.outline_data}
                onSparksDiscovered={handleSparksDiscovered}
                onOutlineUpdate={handleOutlineUpdate}
                onLogicalGapsFound={handleLogicalGapsFound}
                className="h-[calc(100vh-220px)]"
              />
            </div>
          </div>
        ) : null}
      </div>

      {/* Onboarding Card - shown for new users */}
      {showNewSession && (
        <div className="max-w-7xl mx-auto px-6 pb-8 relative z-10">
          <Card className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border-emerald-500/20">
            <CardContent className="py-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">{t('sermon.writer.notAGenerator')}</h3>
                  <p className="text-slate-400 text-sm">
                    {t('sermon.writer.thinkingEnvironment')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
