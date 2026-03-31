import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WarCollegeTrackView } from "./WarCollegeTrackView";
import { WarCollegeReader } from "./WarCollegeReader";
import { WAR_COLLEGE_TRACKS, WAR_COLLEGE_RINGS, RANK_CONFIG, type WarCollegeTrack, type WarCollegeDay, getRankForDay } from "@/data/aats/warCollegeTypes";
import {
  BookOpen, Shield, Brain, Zap, Swords, Flame, ArrowLeft, ArrowRight,
  CheckCircle2, Circle, ChevronDown, ChevronUp, ChevronRight, GraduationCap,
  Target, Eye, Sparkles, Trophy, Users, Lightbulb, HelpCircle, Loader2, Headphones,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useAATSProgress } from "@/hooks/useAATSProgress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  AATS_PHASES,
  AATS_AVATAR_IDS,
  ARENA_RINGS,
  CROSS_AVATAR_SUBJECTS,
  getAvatarTraining,
  UNIVERSAL_MIND_GAMES,
  UNIVERSAL_FALLACIES,
  DETECTION_EXERCISES,
  type AATSAvatarId,
  type AATSModule,
  type AATSAvatarTraining,
} from "@/data/aatsTrainingData";
import { DEFENSE_OPPONENTS } from "@/data/defenseModeOpponents";

// ── Icon map for phases ─────────────────────────────────────────────────────
const PHASE_ICONS: Record<string, LucideIcon> = {
  BookOpen, Shield, Brain, Zap, Swords, Flame,
};

function getPhaseIcon(iconName: string) {
  return PHASE_ICONS[iconName] || BookOpen;
}

// ── Types ───────────────────────────────────────────────────────────────────

type AATSView =
  | "overview"
  | "avatar-path"
  | "phase-content"
  | "module-viewer"
  | "cross-avatar"
  | "mind-games-lab"
  | "war-college";

interface AATSTrainingProps {
  churchId: string;
  onNavigateToDefense?: () => void;
  initialAvatarId?: string;
}

// ── Component ───────────────────────────────────────────────────────────────

export function AATSTraining({ churchId, onNavigateToDefense, initialAvatarId }: AATSTrainingProps) {
  const { completeItem, isItemCompleted, getAvatarProgress, getPhaseProgress, getOverallProgress, getMaxUnlockedDay, loading } = useAATSProgress();
  const { toast } = useToast();

  const [view, setView] = useState<AATSView>(initialAvatarId ? "avatar-path" : "overview");
  const [selectedAvatarId, setSelectedAvatarId] = useState<AATSAvatarId | null>(
    initialAvatarId && AATS_AVATAR_IDS.includes(initialAvatarId as AATSAvatarId)
      ? (initialAvatarId as AATSAvatarId)
      : null,
  );
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [selectedModule, setSelectedModule] = useState<AATSModule | null>(null);
  const [moduleStep, setModuleStep] = useState(0);
  const [selectedCrossSubject, setSelectedCrossSubject] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<string, string>>({});
  const [revealedExercises, setRevealedExercises] = useState<Set<string>>(new Set());
  const [selectedWarCollegeTrack, setSelectedWarCollegeTrack] = useState<WarCollegeTrack | null>(null);
  
  // Manuscript generation state
  const [generatingPhaseDay, setGeneratingPhaseDay] = useState<number | null>(null);
  const [phaseManuscript, setPhaseManuscript] = useState<WarCollegeDay | null>(null);

  const selectedTraining = useMemo(
    () => (selectedAvatarId ? getAvatarTraining(selectedAvatarId) : null),
    [selectedAvatarId],
  );

  // Get opponent data from DefenseMode for avatar images
  const getOpponent = (avatarId: string) => DEFENSE_OPPONENTS.find((o) => o.id === avatarId);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Count total training items for an avatar
  const getTotalItems = (training: AATSAvatarTraining): number => {
    return (
      training.subjects.length +
      training.steelmanArguments.length +
      training.mindGames.length +
      training.fallacies.length +
      training.counterStrategies.length +
      training.modules.length
    );
  };

  const handleMarkComplete = (avatarId: string, itemId: string, total: number) => {
    completeItem(avatarId, itemId, total);
  };

  const navigateBack = () => {
    if (view === "module-viewer") {
      setView("phase-content");
      setSelectedModule(null);
      setModuleStep(0);
    } else if (view === "phase-content") {
      setView("avatar-path");
      setSelectedPhase(null);
    } else if (view === "avatar-path") {
      if (phaseManuscript) {
        setPhaseManuscript(null);
      } else {
        setView("overview");
        setSelectedAvatarId(null);
      }
    } else if (view === "cross-avatar") {
      setView("overview");
      setSelectedCrossSubject(null);
    } else if (view === "mind-games-lab") {
      setView("overview");
    } else if (view === "war-college") {
      setView("overview");
      setSelectedWarCollegeTrack(null);
    }
  };

  // Generate a War College manuscript for a specific phase/day
  const handleGeneratePhaseManuscript = async (phaseNumber: number) => {
    if (!selectedTraining || generatingPhaseDay) return;
    
    // Map phase number to War College day
    const dayNumber = phaseNumber;
    setGeneratingPhaseDay(phaseNumber);
    
    try {
      // Find the matching War College track
      const trackTitle = WAR_COLLEGE_TRACKS.find(t => t.avatarId === selectedTraining.avatarId)?.title 
        || `${selectedTraining.avatarName} Warfare`;
      
      const { data, error } = await supabase.functions.invoke("generate-war-college-day", {
        body: {
          avatarId: selectedTraining.avatarId,
          avatarName: selectedTraining.avatarName,
          trackTitle,
          dayNumber,
          rank: getRankForDay(dayNumber),
          weekNumber: Math.ceil(dayNumber / 7),
        },
      });

      if (error) throw error;
      if (!data?.study) throw new Error("No study returned");

      setPhaseManuscript(data.study);
    } catch (err: any) {
      console.error("Manuscript generation error:", err);
      toast({
        title: "Generation failed",
        description: err.message || "Could not generate the manuscript. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingPhaseDay(null);
    }
  };

  // ─── OVERVIEW ─────────────────────────────────────────────────────────────

  const renderOverview = () => {
    const overall = getOverallProgress();
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-bold">Apologetics Avatar Training System</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Master 6 phases of training against every opponent worldview. Study their doctrines, steelman their arguments,
            detect their mind games, expose their fallacies, and enter combat prepared.
          </p>
          {overall > 0 && (
            <div className="max-w-xs mx-auto pt-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Overall Progress</span>
                <span>{overall}%</span>
              </div>
              <Progress value={overall} className="h-2" />
            </div>
          )}
        </div>

        {/* Arena Rings */}
        {ARENA_RINGS.map((ring) => (
          <div key={ring.id}>
            <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
              <Target className={`h-5 w-5 ${ring.color}`} />
              {ring.title}
              <Badge variant="secondary" className="text-[10px]">{ring.avatarIds.length}</Badge>
            </h3>
            <p className="text-xs text-muted-foreground mb-3">{ring.description}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {ring.avatarIds.map((avatarId) => {
                const training = getAvatarTraining(avatarId);
                const opponent = getOpponent(avatarId);
                const progress = getAvatarProgress(avatarId);
                return (
                  <motion.div
                    key={avatarId}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Card
                      className="cursor-pointer hover:border-primary/50 transition-all group overflow-hidden"
                      onClick={() => {
                        setSelectedAvatarId(avatarId);
                        setView("avatar-path");
                      }}
                    >
                      <CardContent className="p-3 text-center space-y-2">
                        <div className="relative mx-auto w-14 h-14">
                          {opponent?.avatar ? (
                            <img
                              src={opponent.avatar}
                              alt={training.avatarName}
                              className={`w-14 h-14 rounded-full object-cover border-2 ${training.color}`}
                            />
                          ) : (
                            <div className={`w-14 h-14 rounded-full border-2 ${training.color} flex items-center justify-center text-2xl bg-muted`}>
                              {training.emoji}
                            </div>
                          )}
                          {/* Progress ring overlay */}
                          <svg className="absolute inset-0 w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                            <circle cx="28" cy="28" r="26" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted/30" />
                            <circle
                              cx="28" cy="28" r="26" fill="none" stroke="currentColor" strokeWidth="2.5"
                              className="text-primary"
                              strokeDasharray={`${(progress / 100) * 163.4} 163.4`}
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-semibold truncate">{training.avatarName}</p>
                          <p className="text-[10px] text-muted-foreground">{progress}% complete</p>
                        </div>

                        {/* Training course summary */}
                        <div className="text-[10px] text-muted-foreground space-y-1.5 pt-1 border-t border-border/30">
                          <p className="font-medium text-foreground/70">
                            {training.subjects.length} subjects &middot; {training.modules.length} modules
                          </p>
                          <p className="truncate leading-snug" title={training.subjects.map(s => s.title).join(', ')}>
                            {training.subjects.slice(0, 3).map(s => s.title).join(', ')}
                            {training.subjects.length > 3 ? '...' : ''}
                          </p>
                          {/* Mini phase progress bars */}
                          <div className="grid grid-cols-6 gap-0.5 pt-1">
                            {AATS_PHASES.map((phase) => {
                              const pp = getPhaseProgress(avatarId, phase.number);
                              return (
                                <div key={phase.number} title={`P${phase.number}: ${phase.title} — ${pp}%`}>
                                  <div className="h-1 rounded-full bg-muted/40 overflow-hidden">
                                    <div
                                      className="h-full rounded-full bg-primary transition-all"
                                      style={{ width: `${pp}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}

        {/* ─── War College — All 20 Avatars ─── */}
        <div className="space-y-5">
          <div>
            <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              War College — 56-Day Formation
            </h3>
            <p className="text-xs text-muted-foreground">
              Ultra-immersive strategic manuscripts for every opponent. 25–30 minute deep studies that train the mind like a War College reading assignment.
            </p>
          </div>

          {WAR_COLLEGE_RINGS.map((ring) => (
            <div key={ring.id}>
              <h4 className={`text-sm font-semibold mb-2 flex items-center gap-2 ${ring.color}`}>
                <Target className="h-4 w-4" />
                {ring.title}
                <Badge variant="secondary" className="text-[10px]">{ring.tracks.length}</Badge>
              </h4>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {ring.tracks.map((track) => {
                  const opponent = DEFENSE_OPPONENTS.find((o) => o.id === track.avatarId);
                  return (
                    <Card
                      key={track.id}
                      className="cursor-pointer hover:border-primary/50 transition-all group"
                      onClick={() => {
                        setSelectedWarCollegeTrack(track);
                        setView("war-college");
                      }}
                    >
                      <CardContent className="p-3 flex items-center gap-3">
                        {opponent?.avatar ? (
                          <img src={opponent.avatar} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-primary/30" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-lg">
                            {track.emoji}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{track.title}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{track.avatarName} — {track.totalDays} days</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Mind Games Lab Card */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Brain className="h-5 w-5 text-violet-400" />
            Special Training
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <Card
              className="cursor-pointer hover:border-violet-500/50 transition-all"
              onClick={() => setView("mind-games-lab")}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-violet-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Mind Games & Fallacy Lab</p>
                  <p className="text-xs text-muted-foreground">
                    {UNIVERSAL_MIND_GAMES.length} mind games, {UNIVERSAL_FALLACIES.length} fallacies, {DETECTION_EXERCISES.length}+ exercises
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:border-amber-500/50 transition-all"
              onClick={() => {
                setSelectedCrossSubject(CROSS_AVATAR_SUBJECTS[0]?.id || null);
                setView("cross-avatar");
              }}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Users className="h-6 w-6 text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Cross-Avatar Analysis</p>
                  <p className="text-xs text-muted-foreground">
                    See how {CROSS_AVATAR_SUBJECTS.length} key subjects are attacked from multiple worldviews
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  // ─── AVATAR PATH (6-phase timeline) ───────────────────────────────────────

  const renderAvatarPath = () => {
    if (!selectedTraining) return null;
    const opponent = getOpponent(selectedTraining.avatarId);
    const progress = getAvatarProgress(selectedTraining.avatarId);
    const warCollegeTrackForAvatar = WAR_COLLEGE_TRACKS.find((t) => t.avatarId === selectedTraining.avatarId) || null;

    // If a manuscript is being viewed, show the reader
    if (phaseManuscript) {
      return (
        <WarCollegeReader
          study={phaseManuscript}
          onBack={() => setPhaseManuscript(null)}
          onComplete={() => {
            completeItem(selectedTraining.avatarId, `wc-day-${phaseManuscript.dayNumber}`, selectedTraining.modules.length + 6);
            toast({ title: `Day ${phaseManuscript.dayNumber} Complete! 🎓` });
          }}
          isCompleted={isItemCompleted(selectedTraining.avatarId, `wc-day-${phaseManuscript.dayNumber}`)}
          avatarId={selectedTraining.avatarId}
          onLoadAlternateLevel={async (level) => {
            const trackTitle = WAR_COLLEGE_TRACKS.find(t => t.avatarId === selectedTraining.avatarId)?.title
              || `${selectedTraining.avatarName} Warfare`;
            const { data, error } = await supabase.functions.invoke("generate-war-college-day", {
              body: {
                avatarId: selectedTraining.avatarId,
                avatarName: selectedTraining.avatarName,
                trackTitle,
                dayNumber: phaseManuscript.dayNumber,
                rank: getRankForDay(phaseManuscript.dayNumber),
                weekNumber: Math.ceil(phaseManuscript.dayNumber / 7),
                readingLevel: level,
              },
            });
            if (error) throw error;
            if (!data?.study) throw new Error("No study returned");
            return data.study;
          }}
        />
      );
    }

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={navigateBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3 flex-1">
            {opponent?.avatar ? (
              <img src={opponent.avatar} alt="" className={`w-12 h-12 rounded-full object-cover border-2 ${selectedTraining.color}`} />
            ) : (
              <div className={`w-12 h-12 rounded-full border-2 ${selectedTraining.color} flex items-center justify-center text-xl bg-muted`}>
                {selectedTraining.emoji}
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold">{selectedTraining.emoji} {selectedTraining.avatarName} Training</h2>
              <div className="flex items-center gap-3 mt-1">
                <Progress value={progress} className="h-2 w-32" />
                <span className="text-xs text-muted-foreground">{progress}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Generating overlay */}
        {generatingPhaseDay && (
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-6 text-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
              <p className="text-sm font-medium">
                Generating War College Manuscript — Day {generatingPhaseDay}...
              </p>
              <p className="text-xs text-muted-foreground">
                Crafting an immersive, strategic study. This may take 15–30 seconds.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Playlist quick access */}
        {warCollegeTrackForAvatar && (
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold">Looking for Audio Playlist?</p>
                <p className="text-xs text-muted-foreground">
                  Open this avatar’s 56-day War College track to use Add Current Week / Add All Unlocked.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => {
                  setSelectedWarCollegeTrack(warCollegeTrackForAvatar);
                  setView("war-college");
                }}
              >
                <Headphones className="h-3.5 w-3.5" /> Open Playlist
              </Button>
            </CardContent>
          </Card>
        )}

        {/* 6-Phase Timeline */}
        <div className="space-y-3">
          {AATS_PHASES.map((phase, idx) => {
            const PhaseIcon = getPhaseIcon(phase.icon);
            const isLast = phase.number === 6;
            const isGenerating = generatingPhaseDay === phase.number;
            return (
              <motion.div
                key={phase.number}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
              >
                <Card
                  className={`cursor-pointer hover:border-primary/50 transition-all ${
                    isLast ? "border-orange-500/30 bg-orange-500/5" : ""
                  }`}
                  onClick={() => {
                    if (isLast && onNavigateToDefense) {
                      onNavigateToDefense();
                    } else {
                      setSelectedPhase(phase.number);
                      setView("phase-content");
                    }
                  }}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {/* Phase number circle */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                        isLast
                          ? "bg-gradient-to-br from-orange-500 to-red-600 text-white"
                          : "bg-primary/10 text-primary border border-primary/30"
                      }`}>
                        {phase.number}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <PhaseIcon className={`h-4 w-4 ${isLast ? "text-orange-400" : "text-primary"}`} />
                        <p className="font-semibold text-sm">{phase.title}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{phase.description}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Manuscript generation button — not on phase 6 (combat) */}
                      {!isLast && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5 text-xs border-primary/30 hover:bg-primary/10"
                          disabled={!!generatingPhaseDay}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGeneratePhaseManuscript(phase.number);
                          }}
                        >
                          {isGenerating ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Headphones className="h-3.5 w-3.5" />
                          )}
                          <span className="hidden sm:inline">Day {phase.number}</span>
                        </Button>
                      )}
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* ─── 56-Day War College Manuscripts ─── */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Daily Manuscripts — 56-Day War College
          </h3>
          <p className="text-xs text-muted-foreground">
            Each day has a full in-depth strategic manuscript (25–30 min). Generated on first access, then cached for instant replay.
          </p>
          {(() => {
            const maxDay = getMaxUnlockedDay(selectedTraining.avatarId);
            return Array.from({ length: 8 }, (_, wIdx) => {
            const week = wIdx + 1;
            const rank = getRankForDay((week - 1) * 7 + 1);
            const ri = RANK_CONFIG[rank];
            const days = Array.from({ length: 7 }, (_, d) => (week - 1) * 7 + d + 1).filter(d => d <= 56);
            const weekCompleted = days.filter(d => isItemCompleted(selectedTraining.avatarId, `wc-day-${d}`)).length;
            return (
              <div key={week}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant="outline" className={`${ri.color} border-current/30 text-[10px]`}>
                    {ri.emoji} Week {week} — {ri.label}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">{weekCompleted}/{days.length}</span>
                </div>
        <div className="grid grid-cols-7 gap-1.5">
                  {days.map(d => {
                    const done = isItemCompleted(selectedTraining.avatarId, `wc-day-${d}`);
                    const isUnlocked = done || d <= maxDay;
                    const isGenerating = generatingPhaseDay === d;
                    return (
                      <motion.button
                        key={d}
                        whileHover={isUnlocked ? { scale: 1.05 } : {}}
                        whileTap={isUnlocked ? { scale: 0.95 } : {}}
                        disabled={!!generatingPhaseDay || !isUnlocked}
                        onClick={() => isUnlocked && handleGeneratePhaseManuscript(d)}
                        className={`
                          relative aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-bold
                          border transition-all
                          ${done
                            ? "bg-green-500/10 border-green-500/30 text-green-400 cursor-pointer"
                            : isUnlocked
                              ? "bg-muted/30 border-border/50 text-muted-foreground hover:border-primary/30 cursor-pointer"
                              : "bg-muted/10 border-border/20 text-muted-foreground/30 cursor-not-allowed opacity-50"
                          }
                        `}
                      >
                        {isGenerating ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : done ? (
                          <CheckCircle2 className="h-3.5 w-3.5 mb-0.5" />
                        ) : !isUnlocked ? (
                          <Shield className="h-3 w-3 mb-0.5 opacity-40" />
                        ) : null}
                        <span className="text-xs">{d}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            );
          });
          })()}
        </div>

        {/* Modules Quick Access */}
        {selectedTraining.modules.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-400" />
              Subject Modules ({selectedTraining.modules.length})
            </h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {selectedTraining.modules.map((mod) => (
                <Card
                  key={mod.id}
                  className="cursor-pointer hover:border-primary/50 transition-all"
                  onClick={() => {
                    setSelectedModule(mod);
                    setModuleStep(0);
                    setView("module-viewer");
                  }}
                >
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs">
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{mod.title}</p>
                      <p className="text-[10px] text-muted-foreground">8-step deep dive</p>
                    </div>
                    {isItemCompleted(selectedTraining.avatarId, mod.id) && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ─── PHASE CONTENT ────────────────────────────────────────────────────────

  const renderPhaseContent = () => {
    if (!selectedTraining || !selectedPhase) return null;
    const phase = AATS_PHASES.find((p) => p.number === selectedPhase);
    if (!phase) return null;
    const PhaseIcon = getPhaseIcon(phase.icon);
    const total = getTotalItems(selectedTraining);
    const warCollegeTrackForAvatar = WAR_COLLEGE_TRACKS.find((t) => t.avatarId === selectedTraining.avatarId) || null;

    const renderPhaseItems = () => {
      switch (selectedPhase) {
        case 1: // Know Their Doctrine — subjects
          return selectedTraining.subjects.map((subject) => {
            const itemId = `p1-subject-${subject.id}`;
            const done = isItemCompleted(selectedTraining.avatarId, itemId);
            return (
              <Card key={subject.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <button
                    className="w-full p-4 text-left flex items-start gap-3"
                    onClick={() => toggleExpand(subject.id)}
                  >
                    <div className={`mt-0.5 ${done ? "text-green-500" : "text-muted-foreground"}`}>
                      {done ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{subject.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{subject.description}</p>
                    </div>
                    {expandedItems.has(subject.id) ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedItems.has(subject.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-0 space-y-3">
                          <Separator />
                          <p className="text-sm text-foreground/80">{subject.description}</p>
                          {/* Find the matching module for deeper content */}
                          {selectedTraining.modules.filter((m) => m.subjectId === subject.id).map((mod) => (
                            <div key={mod.id} className="space-y-2">
                              <p className="text-sm leading-relaxed">{mod.doctrineBrief}</p>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedModule(mod);
                                  setModuleStep(0);
                                  setView("module-viewer");
                                }}
                              >
                                <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                                Full 8-Step Module
                              </Button>
                            </div>
                          ))}
                          {!done && (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkComplete(selectedTraining.avatarId, itemId, total);
                              }}
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                              Mark Complete
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            );
          });

        case 2: // Steelman Arguments
          return selectedTraining.steelmanArguments.map((arg) => {
            const itemId = `p2-steelman-${arg.id}`;
            const done = isItemCompleted(selectedTraining.avatarId, itemId);
            return (
              <Card key={arg.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <button
                    className="w-full p-4 text-left flex items-start gap-3"
                    onClick={() => toggleExpand(arg.id)}
                  >
                    <div className={`mt-0.5 ${done ? "text-green-500" : "text-muted-foreground"}`}>
                      {done ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">"{arg.title}"</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{arg.argument}</p>
                    </div>
                    {expandedItems.has(arg.id) ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedItems.has(arg.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-0 space-y-3">
                          <Separator />
                          <div>
                            <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Their Argument (Steelmanned)</p>
                            <p className="text-sm">{arg.argument}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Hidden Assumptions</p>
                            <ul className="space-y-1">
                              {arg.hiddenAssumptions.map((a, i) => (
                                <li key={i} className="text-sm flex items-start gap-2">
                                  <Eye className="h-3.5 w-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                                  {a}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">SDA Response</p>
                            <p className="text-sm p-3 rounded-lg bg-primary/5 border border-primary/15">{arg.sdaResponse}</p>
                          </div>
                          {!done && (
                            <Button size="sm" onClick={(e) => { e.stopPropagation(); handleMarkComplete(selectedTraining.avatarId, itemId, total); }}>
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Mark Complete
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            );
          });

        case 3: // Mind Games
          return selectedTraining.mindGames.map((mg) => {
            const itemId = `p3-mindgame-${mg.id}`;
            const done = isItemCompleted(selectedTraining.avatarId, itemId);
            return (
              <Card key={mg.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <button className="w-full p-4 text-left flex items-start gap-3" onClick={() => toggleExpand(mg.id)}>
                    <div className={`mt-0.5 ${done ? "text-green-500" : "text-muted-foreground"}`}>
                      {done ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{mg.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{mg.description}</p>
                    </div>
                    {expandedItems.has(mg.id) ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </button>
                  <AnimatePresence>
                    {expandedItems.has(mg.id) && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="px-4 pb-4 pt-0 space-y-3">
                          <Separator />
                          <div>
                            <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Example</p>
                            <p className="text-sm italic p-3 rounded-lg bg-violet-500/5 border border-violet-500/15">"{mg.example}"</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">How to Detect It</p>
                            <p className="text-sm p-3 rounded-lg bg-amber-500/5 border border-amber-500/15">{mg.detectionTip}</p>
                          </div>
                          {!done && (
                            <Button size="sm" onClick={(e) => { e.stopPropagation(); handleMarkComplete(selectedTraining.avatarId, itemId, total); }}>
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Mark Complete
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            );
          });

        case 4: // Fallacies
          return selectedTraining.fallacies.map((f) => {
            const itemId = `p4-fallacy-${f.id}`;
            const done = isItemCompleted(selectedTraining.avatarId, itemId);
            return (
              <Card key={f.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <button className="w-full p-4 text-left flex items-start gap-3" onClick={() => toggleExpand(f.id)}>
                    <div className={`mt-0.5 ${done ? "text-green-500" : "text-muted-foreground"}`}>
                      {done ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{f.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{f.definition}</p>
                    </div>
                    {expandedItems.has(f.id) ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </button>
                  <AnimatePresence>
                    {expandedItems.has(f.id) && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="px-4 pb-4 pt-0 space-y-3">
                          <Separator />
                          <div>
                            <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Example</p>
                            <p className="text-sm italic p-3 rounded-lg bg-red-500/5 border border-red-500/15">"{f.example}"</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Counter Move</p>
                            <p className="text-sm p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15">{f.counterMove}</p>
                          </div>
                          {!done && (
                            <Button size="sm" onClick={(e) => { e.stopPropagation(); handleMarkComplete(selectedTraining.avatarId, itemId, total); }}>
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Mark Complete
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            );
          });

        case 5: // Counter Strategies
          return selectedTraining.counterStrategies.map((cs) => {
            const itemId = `p5-counter-${cs.subjectId}`;
            const done = isItemCompleted(selectedTraining.avatarId, itemId);
            return (
              <Card key={cs.subjectId} className="overflow-hidden">
                <CardContent className="p-0">
                  <button className="w-full p-4 text-left flex items-start gap-3" onClick={() => toggleExpand(cs.subjectId)}>
                    <div className={`mt-0.5 ${done ? "text-green-500" : "text-muted-foreground"}`}>
                      {done ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{cs.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{cs.sdaPosition}</p>
                    </div>
                    {expandedItems.has(cs.subjectId) ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </button>
                  <AnimatePresence>
                    {expandedItems.has(cs.subjectId) && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="px-4 pb-4 pt-0 space-y-3">
                          <Separator />
                          <div>
                            <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">SDA Position</p>
                            <p className="text-sm">{cs.sdaPosition}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Key Scriptures</p>
                            <div className="flex flex-wrap gap-1.5">
                              {cs.keyScriptures.map((ref, i) => (
                                <Badge key={i} variant="outline" className="text-xs border-emerald-500/30 text-emerald-400 bg-emerald-500/5">
                                  {ref}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Counter Arguments</p>
                            <ul className="space-y-1.5">
                              {cs.counterArguments.map((ca, i) => (
                                <li key={i} className="text-sm flex items-start gap-2">
                                  <Swords className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                                  {ca}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="p-3 rounded-lg bg-primary/5 border border-primary/15">
                            <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Closing Statement</p>
                            <p className="text-sm italic">{cs.closingStatement}</p>
                          </div>
                          {!done && (
                            <Button size="sm" onClick={(e) => { e.stopPropagation(); handleMarkComplete(selectedTraining.avatarId, itemId, total); }}>
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Mark Complete
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            );
          });

        default:
          return null;
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={navigateBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-primary/10 text-primary border border-primary/30`}>
              {phase.number}
            </div>
            <PhaseIcon className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">{phase.title}</h2>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{phase.description}</p>

        {warCollegeTrackForAvatar && (
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                Need the playlist? Open this avatar’s 56-day War College track.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5"
                onClick={() => {
                  setSelectedWarCollegeTrack(warCollegeTrackForAvatar);
                  setView("war-college");
                }}
              >
                <Headphones className="h-3.5 w-3.5" /> Open Playlist
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="space-y-2">{renderPhaseItems()}</div>
      </div>
    );
  };

  // ─── MODULE VIEWER (8-step walkthrough) ───────────────────────────────────

  const MODULE_STEPS = [
    { label: "Doctrine Brief", icon: BookOpen },
    { label: "Steelman Arguments", icon: Shield },
    { label: "Hidden Assumptions", icon: Eye },
    { label: "Mind Games", icon: Brain },
    { label: "Fallacies", icon: Zap },
    { label: "Counter Strategy", icon: Swords },
    { label: "Debate Simulation", icon: Flame },
    { label: "Debrief", icon: Trophy },
  ];

  const renderModuleViewer = () => {
    if (!selectedModule || !selectedTraining) return null;
    const step = MODULE_STEPS[moduleStep];
    const total = getTotalItems(selectedTraining);

    const renderStepContent = () => {
      const mod = selectedModule;
      switch (moduleStep) {
        case 0: // Doctrine Brief
          return (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed whitespace-pre-line">{mod.doctrineBrief}</p>
            </div>
          );

        case 1: // Steelman Arguments
          return (
            <div className="space-y-3">
              {mod.steelmanArguments.map((arg) => (
                <Card key={arg.id} className="bg-muted/30">
                  <CardContent className="p-4 space-y-2">
                    <p className="font-semibold text-sm">"{arg.title}"</p>
                    <p className="text-sm">{arg.argument}</p>
                    <div>
                      <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">SDA Response</p>
                      <p className="text-sm text-primary/80">{arg.sdaResponse}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          );

        case 2: // Hidden Assumptions
          return (
            <div className="space-y-2">
              {mod.hiddenAssumptions.map((a, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/15">
                  <Eye className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{a}</p>
                </div>
              ))}
            </div>
          );

        case 3: // Mind Games
          return (
            <div className="space-y-3">
              {mod.mindGames.map((mg) => (
                <Card key={mg.id} className="bg-violet-500/5 border-violet-500/15">
                  <CardContent className="p-4 space-y-2">
                    <p className="font-semibold text-sm flex items-center gap-2">
                      <Brain className="h-4 w-4 text-violet-400" /> {mg.name}
                    </p>
                    <p className="text-sm">{mg.description}</p>
                    <p className="text-sm italic text-muted-foreground">Example: "{mg.example}"</p>
                    <p className="text-sm text-amber-400">Tip: {mg.detectionTip}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          );

        case 4: // Fallacies
          return (
            <div className="space-y-3">
              {mod.fallacies.map((f) => (
                <Card key={f.id} className="bg-red-500/5 border-red-500/15">
                  <CardContent className="p-4 space-y-2">
                    <p className="font-semibold text-sm flex items-center gap-2">
                      <Zap className="h-4 w-4 text-red-400" /> {f.name}
                    </p>
                    <p className="text-sm">{f.definition}</p>
                    <p className="text-sm italic text-muted-foreground">Example: "{f.example}"</p>
                    <p className="text-sm text-emerald-400">Counter: {f.counterMove}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          );

        case 5: // Counter Strategy
          return (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">SDA Position</p>
                <p className="text-sm">{mod.counterStrategy.sdaPosition}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Key Scriptures</p>
                <div className="flex flex-wrap gap-1.5">
                  {mod.counterStrategy.keyScriptures.map((ref, i) => (
                    <Badge key={i} variant="outline" className="text-xs border-emerald-500/30 text-emerald-400 bg-emerald-500/5">{ref}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Counter Arguments</p>
                <ul className="space-y-1.5">
                  {mod.counterStrategy.counterArguments.map((ca, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <Swords className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" /> {ca}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/15">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Closing Statement</p>
                <p className="text-sm italic">{mod.counterStrategy.closingStatement}</p>
              </div>
            </div>
          );

        case 6: // Debate Simulation
          return (
            <div className="text-center space-y-4 py-6">
              <Flame className="h-12 w-12 text-orange-500 mx-auto" />
              <h3 className="text-lg font-bold">Ready for Battle?</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                You've studied the doctrine, steelmanned the arguments, detected mind games, exposed fallacies, and mastered counter strategies.
                Time to put your training to the test.
              </p>
              {onNavigateToDefense ? (
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white"
                  onClick={onNavigateToDefense}
                >
                  <Swords className="h-5 w-5 mr-2" />
                  Enter Defense Mode — Spar with {selectedTraining.avatarName}
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">Navigate to the Defense tab to begin sparring.</p>
              )}
            </div>
          );

        case 7: // Debrief
          return (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-amber-500/5 border border-primary/15">
                <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Debrief Reflection</p>
                <p className="text-sm leading-relaxed">{mod.debriefPrompt}</p>
              </div>
              <Button
                onClick={() => handleMarkComplete(selectedTraining.avatarId, mod.id, total)}
                disabled={isItemCompleted(selectedTraining.avatarId, mod.id)}
              >
                {isItemCompleted(selectedTraining.avatarId, mod.id) ? (
                  <><CheckCircle2 className="h-4 w-4 mr-2" /> Module Completed</>
                ) : (
                  <><Trophy className="h-4 w-4 mr-2" /> Complete This Module</>
                )}
              </Button>
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={navigateBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-bold flex-1 truncate">{selectedModule.title}</h2>
        </div>

        {/* Step Indicator */}
        <div className="flex gap-1 overflow-x-auto pb-2">
          {MODULE_STEPS.map((s, i) => {
            const StepIcon = s.icon;
            return (
              <button
                key={i}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs whitespace-nowrap transition-all ${
                  i === moduleStep
                    ? "bg-primary text-primary-foreground font-semibold"
                    : i < moduleStep
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
                onClick={() => setModuleStep(i)}
              >
                <StepIcon className="h-3 w-3" />
                <span className="hidden sm:inline">{s.label}</span>
                <span className="sm:hidden">{i + 1}</span>
              </button>
            );
          })}
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              {(() => { const StepIcon = step.icon; return <StepIcon className="h-5 w-5 text-primary" />; })()}
              Step {moduleStep + 1}: {step.label}
            </CardTitle>
          </CardHeader>
          <CardContent>{renderStepContent()}</CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            disabled={moduleStep === 0}
            onClick={() => setModuleStep((s) => s - 1)}
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Previous
          </Button>
          <Button
            disabled={moduleStep === MODULE_STEPS.length - 1}
            onClick={() => setModuleStep((s) => s + 1)}
          >
            Next <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </div>
      </div>
    );
  };

  // ─── CROSS-AVATAR VIEW ────────────────────────────────────────────────────

  const renderCrossAvatar = () => {
    const subjects = CROSS_AVATAR_SUBJECTS;
    const current = subjects.find((s) => s.id === selectedCrossSubject);

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={navigateBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-bold">Cross-Avatar Analysis</h2>
        </div>

        {/* Subject selector */}
        <div className="flex flex-wrap gap-2">
          {subjects.map((s) => (
            <Badge
              key={s.id}
              variant={s.id === selectedCrossSubject ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCrossSubject(s.id)}
            >
              {s.title} ({s.avatarIds.length})
            </Badge>
          ))}
        </div>

        {/* Content for selected subject */}
        {current && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">{current.title} — Attacked from {current.avatarIds.length} Worldviews</h3>
            {current.avatarIds.map((avatarId) => {
              const training = getAvatarTraining(avatarId);
              const opponent = getOpponent(avatarId);
              // Find steelman arguments related to this cross-subject
              const relatedArgs = training.steelmanArguments.slice(0, 2);
              const relatedCounter = training.counterStrategies[0];

              return (
                <Card key={avatarId} className="overflow-hidden">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      {opponent?.avatar ? (
                        <img src={opponent.avatar} alt="" className={`w-10 h-10 rounded-full object-cover border-2 ${training.color}`} />
                      ) : (
                        <div className={`w-10 h-10 rounded-full border-2 ${training.color} flex items-center justify-center bg-muted`}>
                          {training.emoji}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-sm">{training.avatarName}</p>
                        <p className="text-xs text-muted-foreground">
                          {training.subjects.length} subjects, {training.steelmanArguments.length} arguments
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="ml-auto"
                        onClick={() => {
                          setSelectedAvatarId(avatarId);
                          setView("avatar-path");
                        }}
                      >
                        Train <ChevronRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </div>

                    {/* Sample attacks */}
                    {relatedArgs.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-xs font-semibold text-muted-foreground">Sample Attacks:</p>
                        {relatedArgs.map((arg) => (
                          <p key={arg.id} className="text-xs p-2 rounded bg-red-500/5 border border-red-500/10">
                            "{arg.title}"
                          </p>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // ─── MIND GAMES LAB ───────────────────────────────────────────────────────

  const renderMindGamesLab = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={navigateBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Brain className="h-6 w-6 text-violet-400" /> Mind Games & Fallacy Detection Lab
            </h2>
            <p className="text-sm text-muted-foreground">Universal tactics and exercises across all worldviews</p>
          </div>
        </div>

        {/* Mind Games */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Brain className="h-5 w-5 text-violet-400" /> Universal Mind Games ({UNIVERSAL_MIND_GAMES.length})
          </h3>
          <div className="space-y-2">
            {UNIVERSAL_MIND_GAMES.map((mg) => (
              <Card key={mg.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <button className="w-full p-3 text-left flex items-start gap-3" onClick={() => toggleExpand(`lab-mg-${mg.id}`)}>
                    <Brain className="h-4 w-4 text-violet-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{mg.name}</p>
                      <p className="text-xs text-muted-foreground">{mg.description}</p>
                    </div>
                    {expandedItems.has(`lab-mg-${mg.id}`) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  <AnimatePresence>
                    {expandedItems.has(`lab-mg-${mg.id}`) && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="px-3 pb-3 space-y-2">
                          <p className="text-xs italic p-2 rounded bg-violet-500/5 border border-violet-500/10">"{mg.example}"</p>
                          <p className="text-xs p-2 rounded bg-amber-500/5 border border-amber-500/10">Detection: {mg.detectionTip}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Fallacies */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Zap className="h-5 w-5 text-red-400" /> Universal Fallacies ({UNIVERSAL_FALLACIES.length})
          </h3>
          <div className="space-y-2">
            {UNIVERSAL_FALLACIES.map((f) => (
              <Card key={f.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <button className="w-full p-3 text-left flex items-start gap-3" onClick={() => toggleExpand(`lab-f-${f.id}`)}>
                    <Zap className="h-4 w-4 text-red-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{f.name}</p>
                      <p className="text-xs text-muted-foreground">{f.definition}</p>
                    </div>
                    {expandedItems.has(`lab-f-${f.id}`) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  <AnimatePresence>
                    {expandedItems.has(`lab-f-${f.id}`) && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="px-3 pb-3 space-y-2">
                          <p className="text-xs italic p-2 rounded bg-red-500/5 border border-red-500/10">"{f.example}"</p>
                          <p className="text-xs p-2 rounded bg-emerald-500/5 border border-emerald-500/10">Counter: {f.counterMove}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Detection Exercises */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-amber-400" /> Detection Exercises ({DETECTION_EXERCISES.length})
          </h3>
          <div className="space-y-3">
            {DETECTION_EXERCISES.map((ex, idx) => {
              const revealed = revealedExercises.has(ex.id);
              return (
                <Card key={ex.id} className="overflow-hidden">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <Badge variant="secondary" className="text-[10px] flex-shrink-0">#{idx + 1}</Badge>
                      <p className="text-sm">{ex.scenario}</p>
                    </div>
                    <p className="text-sm font-semibold text-primary">{ex.question}</p>

                    {!revealed ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setRevealedExercises((prev) => new Set([...prev, ex.id]))}
                      >
                        <Eye className="h-3.5 w-3.5 mr-1.5" /> Reveal Answer
                      </Button>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2"
                      >
                        <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
                          <p className="text-xs font-semibold text-emerald-400 mb-1">Answer: {ex.correctAnswer}</p>
                          <p className="text-sm">{ex.explanation}</p>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // ─── MAIN RENDER ──────────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {view === "overview" && renderOverview()}
          {view === "avatar-path" && renderAvatarPath()}
          {view === "phase-content" && renderPhaseContent()}
          {view === "module-viewer" && renderModuleViewer()}
          {view === "cross-avatar" && renderCrossAvatar()}
          {view === "mind-games-lab" && renderMindGamesLab()}
          {view === "war-college" && selectedWarCollegeTrack && (
            <WarCollegeTrackView
              track={selectedWarCollegeTrack}
              onBack={() => { setView("overview"); setSelectedWarCollegeTrack(null); }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
