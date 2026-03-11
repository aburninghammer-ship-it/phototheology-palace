import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, BookOpen, Sparkles, Heart, MessageSquare, Star, Loader2, Share2, Wand2, ExternalLink, Lock, AlertCircle, RefreshCw, Highlighter, Save, Edit } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { SimplifiedNav } from "@/components/SimplifiedNav";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDevotionalPlan, useDevotionals } from "@/hooks/useDevotionals";
import { ShareDevotionalDialog } from "@/components/devotionals/ShareDevotionalDialog";
import { ExtendDevotionalDialog } from "@/components/devotionals/ExtendDevotionalDialog";
import { FreeAudioButton } from "@/components/audio/FreeAudioButton";
import { DevotionalTextHighlighter } from "@/components/devotionals/DevotionalTextHighlighter";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useSparks } from "@/hooks/useSparks";
import { SparkContainer, SparkSettings } from "@/components/sparks";
import { ShareToProfileButton } from "@/components/social/ShareToProfileButton";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const formatGradients: Record<string, string> = {
  standard: "from-blue-500 via-cyan-500 to-teal-500",
  "24fps": "from-purple-500 via-pink-500 to-rose-500",
  blueprint: "from-amber-500 via-orange-500 to-red-500",
  "room-driven": "from-emerald-500 via-teal-500 to-cyan-500",
  "verse-genetics": "from-rose-500 via-pink-500 to-purple-500",
};

// Helper to get the calendar date for a devotional day
const getDayDate = (startedAt: string, dayNumber: number): string => {
  const started = new Date(startedAt);
  const dayDate = new Date(started.getTime() + (dayNumber - 1) * 24 * 60 * 60 * 1000);
  return dayDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
};

// Helper to format time until unlock
const getTimeUntilUnlock = (startedAt: string, dayNumber: number): string => {
  const started = new Date(startedAt);
  const unlockTime = new Date(started.getTime() + (dayNumber - 1) * 24 * 60 * 60 * 1000);
  const now = new Date();
  const hoursLeft = Math.ceil((unlockTime.getTime() - now.getTime()) / (1000 * 60 * 60));
  
  if (hoursLeft <= 1) return "Unlocks in less than an hour";
  if (hoursLeft < 24) return `Unlocks in ${hoursLeft} hours`;
  const daysLeft = Math.ceil(hoursLeft / 24);
  return `Unlocks in ${daysLeft} day${daysLeft > 1 ? 's' : ''}`;
};

export default function DevotionalView() {
  const { t } = useTranslation();
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { preferences } = useUserPreferences();
  const { plan, days, progress, completedDayIds, completeDay, planLoading, isCompleting, isDayUnlocked, unlockedDayNumber } = useDevotionalPlan(planId || "");
  const { generateDevotional, isGenerating } = useDevotionals();

  const { toast } = useToast();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [journalEntry, setJournalEntry] = useState("");
  const [rating, setRating] = useState(0);
  const [hasInitializedDay, setHasInitializedDay] = useState(false);
  const [isRegeneratingDay, setIsRegeneratingDay] = useState(false);
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);
  const [isEditingJournal, setIsEditingJournal] = useState(false);
  const [isSavingJournal, setIsSavingJournal] = useState(false);
  const autoGenerateTriggered = useRef(false);

  // Sparks integration
  const {
    sparks,
    preferences: sparkPreferences,
    openSpark,
    saveSpark,
    dismissSpark,
    exploreSpark,
    updatePreferences: updateSparkPreferences
  } = useSparks({
    surface: 'study',
    contextType: 'study',
    contextId: planId || 'devotional',
    maxSparks: 3,
    debounceMs: 90000
  });

  // Auto-generate missing unlocked days on page load
  useEffect(() => {
    if (autoGenerateTriggered.current) return;
    if (!plan?.id || !plan.started_at || plan.status !== "active") return;
    if (!days) return; // Wait for days to load

    const existingDayNumbers = new Set(days.map(d => d.day_number));
    let hasMissingUnlockedDays = false;
    for (let day = 1; day <= unlockedDayNumber; day++) {
      if (!existingDayNumbers.has(day)) {
        hasMissingUnlockedDays = true;
        break;
      }
    }

    if (hasMissingUnlockedDays) {
      autoGenerateTriggered.current = true;
      setIsAutoGenerating(true);
      supabase.functions.invoke("batch-generate-devotional-days", {
        body: { planId: plan.id, maxDaysPerPlan: 10 },
      }).then(({ data, error }) => {
        if (!error && data?.totalDaysGenerated > 0) {
          queryClient.invalidateQueries({ queryKey: ["devotional-days", plan.id] });
          queryClient.invalidateQueries({ queryKey: ["devotional-plan", plan.id] });
          toast({
            title: t('devotionalView.newDaysReady'),
            description: t('devotionalView.newDaysGenerated', { count: data.totalDaysGenerated }),
          });
        }
      }).catch((err) => {
        console.error("Auto-generate failed:", err);
      }).finally(() => {
        setIsAutoGenerating(false);
      });
    }
  }, [plan?.id, plan?.started_at, plan?.status, days, unlockedDayNumber]);

  // Auto-select the current unlocked day ONLY on initial load
  useEffect(() => {
    if (!hasInitializedDay && days && days.length > 0 && unlockedDayNumber) {
      // Find the first incomplete day that's unlocked, or the latest unlocked day
      const unlockedDays = days.filter((_, idx) => isDayUnlocked(idx + 1));
      const firstIncomplete = unlockedDays.findIndex(d => !completedDayIds.has(d.id));
      if (firstIncomplete >= 0) {
        setSelectedDayIndex(firstIncomplete);
      } else {
        setSelectedDayIndex(Math.min(unlockedDayNumber - 1, days.length - 1));
      }
      setHasInitializedDay(true);
    }
  }, [days, unlockedDayNumber, completedDayIds, isDayUnlocked, hasInitializedDay]);

  // Load existing journal entry when switching to a completed day
  useEffect(() => {
    if (!days || !progress) return;
    const currentDay = days[selectedDayIndex];
    if (!currentDay) return;
    
    const existingProgress = progress.find(p => p.day_id === currentDay.id);
    if (existingProgress?.journal_entry) {
      setJournalEntry(existingProgress.journal_entry);
    } else {
      setJournalEntry("");
    }
    setIsEditingJournal(false);
  }, [selectedDayIndex, days, progress]);

  const handleCrossReferenceClick = (ref: string) => {
    navigator.clipboard.writeText(ref);
    toast({
      title: t('devotionalView.referenceCopied'),
      description: t('devotionalView.referenceCopiedDesc', { ref }),
    });
  };

  const handleGenerate = () => {
    if (!plan) return;
    generateDevotional.mutate({
      planId: plan.id,
      theme: plan.theme,
      format: plan.format,
      duration: plan.duration,
      studyStyle: plan.study_style || "balanced",
    });
  };

  const handleRegenerateDay = async () => {
    if (!plan || !days || days.length === 0) return;

    const dayNumber = selectedDayIndex + 1;
    if (!isDayUnlocked(dayNumber)) {
      toast({
        title: t('devotionalView.dayLocked'),
        description: t('devotionalView.dayLockedDesc'),
        variant: "default",
      });
      return;
    }

    setIsRegeneratingDay(true);
    try {
      const { data, error } = await supabase.functions.invoke("regenerate-devotional-day", {
        body: { planId: plan.id, dayNumber },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      await queryClient.invalidateQueries({ queryKey: ["devotional-days", plan.id] });

      toast({
        title: t('devotionalView.devotionRegenerated'),
        description: t('devotionalView.devotionRegeneratedDesc', { dayNumber }),
      });
    } catch (err: any) {
      console.error("Regenerate day error:", err);
      toast({
        title: t('devotionalView.couldntRegenerate'),
        description: err?.message || t('devotionalView.pleaseTryAgain'),
        variant: "destructive",
      });
    } finally {
      setIsRegeneratingDay(false);
    }
  };

  if (planLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-muted-foreground">{t('devotionalView.loadingDevotional')}</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">{t('devotionalView.notFound')}</h2>
          <p className="text-muted-foreground mb-4">{t('devotionalView.notFoundDesc')}</p>
          <Button onClick={() => navigate("/devotionals")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('devotionalView.backToDevotionals')}
          </Button>
        </div>
      </div>
    );
  }

  // Show generate UI for draft/generating/failed plans
  if (plan.status === "draft" || plan.status === "generating" || plan.status === "failed" || !days || days.length === 0) {
    const gradient = formatGradients[plan.format] || formatGradients.standard;
    return (
      <div className="min-h-screen bg-background">
        <div className={`relative bg-gradient-to-r ${gradient} py-6 px-4`}>
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          <div className="relative max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/devotionals")} className="text-white hover:bg-white/20">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="font-bold text-white text-lg">{plan.title}</h1>
                <p className="text-white/80 text-sm">{plan.theme}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-12">
          <Card className="border-2 border-dashed border-amber-300 dark:border-amber-700 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
            <CardContent className="py-12 text-center">
              {isGenerating || plan.status === "generating" ? (
                <>
                  <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center mb-6 shadow-xl animate-pulse">
                    <Sparkles className="h-10 w-10 text-white animate-spin" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    {t('devotionalView.generatingTitle')}
                  </h3>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    {t('devotionalView.generatingDesc', { duration: plan.duration })}
                  </p>
                  <div className="flex justify-center gap-2">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-3 h-3 rounded-full bg-amber-500 animate-bounce"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </>
              ) : plan.status === "failed" ? (
                <>
                  <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center mb-6 shadow-xl">
                    <RefreshCw className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    {t('devotionalView.generationTimedOut')}
                  </h3>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    {t('devotionalView.generationTimedOutDesc')}
                  </p>
                  <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                    {t('devotionalView.retryHint')}
                  </p>
                  <div className="space-y-4">
                    <Button
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      size="lg"
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    >
                      {isGenerating ? (
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="h-5 w-5 mr-2" />
                      )}
                      {isGenerating ? t('devotionalView.generatingEllipsis') : t('devotionalView.retryGeneration')}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center mb-6 shadow-xl">
                    <Wand2 className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    {t('devotionalView.readyToGenerate')}
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {t('devotionalView.readyToGenerateDesc', { duration: plan.duration })}
                  </p>
                  <div className="space-y-4">
                    <div className="flex flex-wrap justify-center gap-2 text-sm">
                      <Badge variant="outline" className="border-amber-400 text-amber-700 dark:text-amber-300">
                        {t('devotionalView.daysLabel', { count: plan.duration })}
                      </Badge>
                      <Badge variant="outline" className="border-amber-400 text-amber-700 dark:text-amber-300">
                        {t('devotionalView.formatLabel', { format: plan.format })}
                      </Badge>
                    </div>
                    <Button
                      onClick={handleGenerate}
                      size="lg"
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    >
                      <Sparkles className="h-5 w-5 mr-2" />
                      {t('devotionalView.generateDevotional')}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentDay = days?.[selectedDayIndex];
  const isCompleted = currentDay ? completedDayIds.has(currentDay.id) : false;
  const gradient = formatGradients[plan.format] || formatGradients.standard;

  const handleComplete = () => {
    if (!currentDay) return;
    completeDay.mutate({
      dayId: currentDay.id,
      journalEntry: journalEntry || undefined,
      rating: rating || undefined,
    }, {
      onSuccess: () => {
        setJournalEntry("");
        setRating(0);
      },
    });
  };

  const handleSaveJournal = async () => {
    if (!currentDay || !planId) return;
    setIsSavingJournal(true);
    try {
      const { error } = await supabase
        .from("devotional_progress")
        .update({ journal_entry: journalEntry })
        .eq("plan_id", planId)
        .eq("day_id", currentDay.id);
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ["devotional-progress", planId] });
      setIsEditingJournal(false);
      toast({
        title: "Journal Updated",
        description: "Your reflection has been saved.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save journal entry.",
        variant: "destructive",
      });
    } finally {
      setIsSavingJournal(false);
    }
  };

  const goToPrevDay = () => setSelectedDayIndex(Math.max(0, selectedDayIndex - 1));
  const goToNextDay = () => setSelectedDayIndex(Math.min((days?.length || 1) - 1, selectedDayIndex + 1));

  return (
    <div className="min-h-screen bg-background">
      {/* Sparks Container */}
      {sparks.length > 0 && (
        <div className="fixed bottom-24 right-4 md:bottom-auto md:top-20 z-50">
          <SparkContainer
            sparks={sparks}
            onOpen={openSpark}
            onSave={saveSpark}
            onDismiss={dismissSpark}
            onExplore={exploreSpark}
            position="floating"
          />
        </div>
      )}

      {/* Spark Settings */}
      <div className="fixed bottom-24 md:bottom-4 right-4 z-40">
        <SparkSettings
          preferences={sparkPreferences}
          onUpdate={updateSparkPreferences}
        />
      </div>

      {/* Navigation */}
      {preferences.navigation_style === "simplified" ? <SimplifiedNav /> : <Navigation />}

      {/* Colorful Header */}
      <div className={`relative bg-gradient-to-r ${gradient} py-6 px-4`}>
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/devotionals")} className="hidden md:flex text-white hover:bg-white/20">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="font-bold text-white text-lg truncate max-w-[200px] md:max-w-none">{plan.title}</h1>
                <p className="text-white/80 text-sm">
                  {t('devotionalView.dayOfTotal', { day: selectedDayIndex + 1, total: plan.duration })}
                  {plan.started_at && <span className="text-white/60 ml-2">· {getDayDate(plan.started_at, selectedDayIndex + 1)}</span>}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRegenerateDay}
                disabled={isRegeneratingDay}
                className="text-white hover:bg-white/20 disabled:opacity-30"
                aria-label="Regenerate this day's devotional"
              >
                {isRegeneratingDay ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <RefreshCw className="h-5 w-5" />
                )}
              </Button>
              {plan && currentDay && (
                <>
                  <ShareDevotionalDialog
                    plan={plan}
                    day={currentDay}
                    trigger={
                      <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                        <Share2 className="h-5 w-5" />
                      </Button>
                    }
                  />
                  <ShareToProfileButton
                    sharedContent={{
                      source_type: "devotional",
                      source_id: plan.id,
                      source_title: `${plan.title} - Day ${selectedDayIndex + 1}`,
                      source_excerpt: (currentDay.devotional_text || currentDay.application || "").slice(0, 300),
                      verse_reference: currentDay.scripture_reference,
                    }}
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                  />
                </>
              )}
              <Button variant="ghost" size="icon" onClick={goToPrevDay} disabled={selectedDayIndex === 0} className="text-white hover:bg-white/20 disabled:opacity-30">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={goToNextDay} disabled={selectedDayIndex === (days?.length || 1) - 1} className="text-white hover:bg-white/20 disabled:opacity-30">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Day Progress - Colorful Pills with Lock for Future Days */}
      <div className="bg-background/95 backdrop-blur border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          {/* Use native scroll for reliable mobile horizontal scrolling */}
          <div className="overflow-x-auto overflow-y-hidden scrollbar-hide -mx-4 px-4" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="flex gap-2 pb-2 min-w-max">
              <TooltipProvider>
                {days?.map((day, idx) => {
                  const dayNumber = idx + 1;
                  const isUnlocked = isDayUnlocked(dayNumber);
                  const isCompleted = completedDayIds.has(day.id);
                  const isSelected = idx === selectedDayIndex;

                  const button = (
                    <button
                      key={day.id}
                      onClick={() => isUnlocked && setSelectedDayIndex(idx)}
                      disabled={!isUnlocked}
                      className={cn(
                        "w-10 h-10 rounded-full text-xs font-bold flex-shrink-0 transition-all shadow-md relative",
                        isSelected
                          ? `bg-gradient-to-br ${gradient} text-white scale-110`
                          : isCompleted
                          ? "bg-gradient-to-br from-emerald-400 to-teal-400 text-white"
                          : isUnlocked
                          ? "bg-muted hover:bg-muted/80"
                          : "bg-muted/50 cursor-not-allowed opacity-60"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4 mx-auto" />
                      ) : !isUnlocked ? (
                        <Lock className="h-3 w-3 mx-auto text-muted-foreground" />
                      ) : (
                        dayNumber
                      )}
                    </button>
                  );

                  if (!isUnlocked && plan?.started_at) {
                    return (
                      <Tooltip key={day.id}>
                        <TooltipTrigger asChild>
                          {button}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">{getTimeUntilUnlock(plan.started_at, dayNumber)}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return button;
                })}
              </TooltipProvider>
            </div>
          </div>
          {/* Show unlock info */}
          {plan?.started_at && unlockedDayNumber < (days?.length || 0) && (
            <p className="text-xs text-muted-foreground text-center mt-1">
              {t('devotionalView.unlocksTomorrow', { day: unlockedDayNumber + 1 })}
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      {currentDay && (
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Day Header */}
          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground font-medium">
              {currentDay.scripture_reference}
            </p>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
              {currentDay.title}
            </h2>
          </div>

          {/* Essay-style Devotional Content */}
          {currentDay.devotional_text ? (
            // New essay-style format - flowing paragraphs with highlighting
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${gradient}`} />
              <CardHeader className="bg-gradient-to-br from-slate-50 to-purple-50/30 dark:from-slate-950/50 dark:to-purple-950/30 pb-2">
                <CardTitle className="text-base flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {t('devotionalView.todaysReading')}
                    <Badge variant="outline" className="text-xs font-normal gap-1">
                      <Highlighter className="h-3 w-3" />
                      {t('devotionalView.selectToHighlight')}
                    </Badge>
                  </div>
                  <FreeAudioButton 
                    text={currentDay.devotional_text || ''}
                    variant="ghost"
                    size="sm"
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 pb-8">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  {currentDay.devotional_text.split('\n\n').map((paragraph, idx) => (
                    <DevotionalTextHighlighter
                      key={idx}
                      text={paragraph}
                      devotionalDayId={currentDay.id}
                      sectionKey={`p${idx}`}
                      className="mb-6 last:mb-0"
                      textClassName="text-lg leading-relaxed text-slate-800 dark:text-slate-200 font-serif"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            // Legacy format - fragmented sections with highlighting
            <>
              {/* Scripture Card */}
              <Card className="overflow-hidden border-0 shadow-xl">
                <div className={`h-2 bg-gradient-to-r ${gradient}`} />
                <CardHeader className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 pb-2">
                  <CardTitle className="text-base flex items-center justify-between text-indigo-700 dark:text-indigo-300">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      {currentDay.scripture_reference}
                      <Badge variant="outline" className="text-xs font-normal gap-1 border-indigo-300">
                        <Highlighter className="h-3 w-3" />
                        {t('devotionalView.selectToHighlight')}
                      </Badge>
                    </div>
                    <FreeAudioButton 
                      text={`${currentDay.scripture_reference}. ${currentDay.scripture_text || ''}`}
                      variant="ghost"
                      size="sm"
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 pt-0">
                  <DevotionalTextHighlighter
                    text={currentDay.scripture_text || ''}
                    devotionalDayId={currentDay.id}
                    sectionKey="scripture"
                    textClassName="text-xl italic leading-relaxed text-indigo-900 dark:text-indigo-100 font-serif"
                  />
                </CardContent>
              </Card>

              {/* Christ Connection - Legacy format */}
              <Card className="border-0 bg-gradient-to-br from-rose-500 via-pink-500 to-purple-500 text-white shadow-2xl overflow-hidden">
                <CardHeader className="pb-2 relative">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Heart className="h-6 w-6 fill-white" />
                    {t('devotionalView.christConnection')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-lg leading-relaxed font-medium">{currentDay.christ_connection}</p>
                </CardContent>
              </Card>
            </>
          )}

          {/* Memory Hook - Always show if present */}
          {currentDay.memory_hook && (
            <Card className="border-0 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 text-white shadow-lg">
              <CardContent className="py-4">
                <p className="font-bold text-lg text-center italic">
                  "{currentDay.memory_hook}"
                </p>
              </CardContent>
            </Card>
          )}

          {/* Journal Section - Simplified for essay format */}
          <Tabs defaultValue="journal" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950 dark:to-pink-950 relative z-10">
              <TabsTrigger value="journal" className="cursor-pointer data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 transition-all">
                📝 Journal
              </TabsTrigger>
              <TabsTrigger value="more" className="cursor-pointer data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 transition-all">
                📖 More
              </TabsTrigger>
            </TabsList>

            <TabsContent value="journal" className="space-y-4 mt-4">
              {/* Journal Section - Always visible */}
              <Card className="border-pink-200 dark:border-pink-800 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2 text-pink-700 dark:text-pink-300">
                      <MessageSquare className="h-4 w-4" />
                      {currentDay.journal_prompt ? t('devotionalView.reflectionQuestion') : t('devotionalView.yourJournal')}
                    </CardTitle>
                    {isCompleted && !isEditingJournal && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-pink-600 hover:text-pink-700"
                        onClick={() => setIsEditingJournal(true)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {currentDay.journal_prompt && (
                    <p className="mb-4 text-pink-900 dark:text-pink-100 font-medium">{currentDay.journal_prompt}</p>
                  )}
                  <Textarea
                    placeholder={currentDay.journal_prompt ? t('devotionalView.writeReflection') : t('devotionalView.writeThoughts')}
                    value={journalEntry}
                    onChange={(e) => setJournalEntry(e.target.value)}
                    className="min-h-[150px] border-pink-200 dark:border-pink-800 focus:ring-pink-500"
                    disabled={isCompleted && !isEditingJournal}
                  />
                  {isCompleted && isEditingJournal && (
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        onClick={handleSaveJournal}
                        disabled={isSavingJournal}
                        className="bg-pink-600 hover:bg-pink-700 text-white"
                      >
                        {isSavingJournal ? (
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        ) : (
                          <Save className="h-3 w-3 mr-1" />
                        )}
                        Save Journal
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const existingProgress = progress?.find(p => p.day_id === currentDay.id);
                          setJournalEntry(existingProgress?.journal_entry || "");
                          setIsEditingJournal(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Rating */}
              {!isCompleted && (
                <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-amber-700 dark:text-amber-300">{t('devotionalView.rateTodaysDevotion')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className={cn(
                            "p-2 rounded-lg transition-all",
                            star <= rating 
                              ? "text-amber-500 bg-amber-100 dark:bg-amber-900 scale-110" 
                              : "text-gray-300 hover:text-amber-400"
                          )}
                        >
                          <Star className={cn("h-8 w-8", star <= rating && "fill-current")} />
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="more" className="space-y-4 mt-4">
              {/* Cross References */}
              {currentDay.cross_references && currentDay.cross_references.length > 0 && (
                <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 text-blue-700 dark:text-blue-300">
                      <BookOpen className="h-4 w-4" />
                      {t('devotionalView.crossReferences')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {currentDay.cross_references.map((ref, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          className="text-xs border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900"
                          onClick={() => handleCrossReferenceClick(ref)}
                        >
                          {ref}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Challenge */}
              {currentDay.challenge && (
                <Card className="border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                      <Sparkles className="h-4 w-4" />
                      {t('devotionalView.todaysChallenge')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-emerald-900 dark:text-emerald-100">{currentDay.challenge}</p>
                  </CardContent>
                </Card>
              )}

              {/* Prayer */}
              {currentDay.prayer && (
                <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 text-purple-700 dark:text-purple-300">
                      <Heart className="h-4 w-4" />
                      {t('devotionalView.prayer')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-900 dark:text-purple-100 italic">{currentDay.prayer}</p>
                  </CardContent>
                </Card>
              )}

              {/* Share this devotional */}
              <Card className="border-rose-200 dark:border-rose-800 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-rose-700 dark:text-rose-300">
                    <Share2 className="h-4 w-4" />
                    {t('devotionalView.shareThisDevotional')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ShareDevotionalDialog plan={plan} day={currentDay} />
                </CardContent>
              </Card>

              {/* Extend this devotional */}
              {plan?.status === "completed" && (
                <Card className="border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                      <Sparkles className="h-4 w-4" />
                      {t('devotionalView.continueYourJourney')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-2">
                      {t('devotionalView.extendDescription')}
                    </p>
                    <ExtendDevotionalDialog plan={plan} />
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Complete Button */}
          {!isCompleted ? (
            <Button 
              className={`w-full bg-gradient-to-r ${gradient} hover:opacity-90 text-white border-0 shadow-xl`}
              size="lg" 
              onClick={handleComplete} 
              disabled={isCompleting}
            >
              {isCompleting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  {t('devotionalView.saving')}
                </>
              ) : (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  {t('devotionalView.completeDay', { day: selectedDayIndex + 1 })}
                </>
              )}
            </Button>
          ) : (
            <div className="text-center py-4">
              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 text-lg py-2 px-4">
                <Check className="h-4 w-4 mr-2" />
                {t('devotionalView.dayCompleted')}
              </Badge>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
