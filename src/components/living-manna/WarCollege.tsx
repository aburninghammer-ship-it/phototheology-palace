import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, CheckCircle2, Circle, Lock, Crown,
  Shield, Swords, BookOpen, Target, Zap, Trophy, Users,
  ChevronRight, Sparkles, Star, Flame, GraduationCap,
  MessageSquare, Hammer, Brain, Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useWarCollege } from "@/hooks/useWarCollege";
import { DEFENSE_OPPONENTS } from "@/data/defenseModeOpponents";
import {
  WAR_COLLEGE_RANKS,
  WARFARE_CLASSIFICATIONS,
  DIFFICULTY_RANGES,
  getDifficultyTier,
  getRank,
  getNextRank,
  type WarCollegeDay,
  type WarCollegeTrack,
  type DifficultyTier,
} from "@/data/warCollegeTypes";
import { AATS_AVATAR_IDS, type AATSAvatarId } from "@/data/aatsTrainingData";
import { getWarCollegeTrack } from "@/data/warCollegeData";

// ── Types ───────────────────────────────────────────────────────────────────

type WCView = "dashboard" | "track-map" | "daily-lesson" | "rank-display";

interface WarCollegeProps {
  churchId: string;
  onNavigateToDefense?: () => void;
  onNavigateToAATS?: (avatarId: string) => void;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function getOpponentAvatar(avatarId: string) {
  return DEFENSE_OPPONENTS.find((o) => o.id === avatarId);
}

const DIFFICULTY_COLORS: Record<DifficultyTier, string> = {
  foundation: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  intermediate: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  advanced: "text-red-400 bg-red-500/10 border-red-500/30",
};

const DIFFICULTY_BG: Record<DifficultyTier, string> = {
  foundation: "from-blue-500/5 to-blue-500/0",
  intermediate: "from-amber-500/5 to-amber-500/0",
  advanced: "from-red-500/5 to-red-500/0",
};

const LESSON_STEPS = [
  { label: "Instructor Voice", icon: BookOpen },
  { label: "Avatar Presence", icon: Eye },
  { label: "Tactical Briefing", icon: Target },
  { label: "Drill", icon: Swords },
  { label: "Forge a Weapon", icon: Hammer },
  { label: "Jeeves Debrief", icon: MessageSquare },
  { label: "Mastery Check", icon: Brain },
];

// ── Main Component ──────────────────────────────────────────────────────────

export function WarCollege({ churchId, onNavigateToDefense, onNavigateToAATS }: WarCollegeProps) {
  const wc = useWarCollege();
  const { toast } = useToast();
  const [view, setView] = useState<WCView>("dashboard");
  const [selectedAvatarId, setSelectedAvatarId] = useState<AATSAvatarId | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const selectedTrack = useMemo(
    () => (selectedAvatarId ? getWarCollegeTrack(selectedAvatarId) : null),
    [selectedAvatarId],
  );

  const selectedDayData = useMemo(
    () => (selectedTrack && selectedDay ? selectedTrack.days.find((d) => d.day === selectedDay) ?? null : null),
    [selectedTrack, selectedDay],
  );

  const navigateToTrack = useCallback((avatarId: AATSAvatarId) => {
    setSelectedAvatarId(avatarId);
    setView("track-map");
  }, []);

  const navigateToDay = useCallback((day: number) => {
    setSelectedDay(day);
    setView("daily-lesson");
  }, []);

  const goBack = useCallback(() => {
    if (view === "daily-lesson") {
      setView("track-map");
      setSelectedDay(null);
    } else if (view === "track-map" || view === "rank-display") {
      setView("dashboard");
      setSelectedAvatarId(null);
    }
  }, [view]);

  const handleEnroll = useCallback(
    async (avatarId: AATSAvatarId) => {
      try {
        await wc.enroll(avatarId);
        toast({ title: "Enrolled!", description: "Your War College training begins. Day 1 is unlocked." });
      } catch {
        toast({ title: "Error", description: "Could not enroll. Try again.", variant: "destructive" });
      }
    },
    [wc, toast],
  );

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait" initial={false}>
        {view === "dashboard" && (
          <motion.div key="dashboard" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}>
            <DashboardView
              wc={wc}
              onSelectAvatar={navigateToTrack}
              onEnroll={handleEnroll}
              onViewRanks={() => setView("rank-display")}
            />
          </motion.div>
        )}
        {view === "track-map" && selectedTrack && selectedAvatarId && (
          <motion.div key="track-map" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            <TrackMapView
              track={selectedTrack}
              avatarId={selectedAvatarId}
              wc={wc}
              onBack={goBack}
              onSelectDay={navigateToDay}
              onEnroll={handleEnroll}
            />
          </motion.div>
        )}
        {view === "daily-lesson" && selectedDayData && selectedAvatarId && selectedTrack && (
          <motion.div key="daily-lesson" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            <DailyLessonView
              dayData={selectedDayData}
              track={selectedTrack}
              avatarId={selectedAvatarId}
              wc={wc}
              onBack={goBack}
              onNavigateToDefense={onNavigateToDefense}
            />
          </motion.div>
        )}
        {view === "rank-display" && (
          <motion.div key="rank-display" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            <RankDisplayView wc={wc} onBack={goBack} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// DASHBOARD VIEW
// ════════════════════════════════════════════════════════════════════════════

function DashboardView({
  wc,
  onSelectAvatar,
  onEnroll,
  onViewRanks,
}: {
  wc: ReturnType<typeof useWarCollege>;
  onSelectAvatar: (id: AATSAvatarId) => void;
  onEnroll: (id: AATSAvatarId) => void;
  onViewRanks: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border/30 bg-gradient-to-br from-primary/10 via-background to-accent/10 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Crown className="h-6 w-6 text-primary" />
              War College
            </h2>
            <p className="text-sm text-muted-foreground mt-1">56-Day Tiered Avatar Training System</p>
          </div>
          <Button variant="outline" size="sm" onClick={onViewRanks} className="gap-1.5">
            <Trophy className="h-4 w-4" />
            Ranks
          </Button>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <StatCard label="Global Rank" value={`${wc.globalRank.emoji} ${wc.globalRank.title}`} />
          <StatCard label="Total XP" value={wc.globalXP.toLocaleString()} />
          <StatCard label="Tracks Active" value={`${wc.totalTracksEnrolled}/20`} />
          <StatCard label="Days Completed" value={wc.totalDaysCompleted.toString()} />
        </div>

        {/* XP Progress to next rank */}
        {wc.nextGlobalRank && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>{wc.globalRank.emoji} {wc.globalRank.title}</span>
              <span>{wc.nextGlobalRank.emoji} {wc.nextGlobalRank.title} ({wc.nextGlobalRank.xpRequired} XP)</span>
            </div>
            <Progress
              value={Math.min(((wc.globalXP - wc.globalRank.xpRequired) / (wc.nextGlobalRank.xpRequired - wc.globalRank.xpRequired)) * 100, 100)}
              className="h-2"
            />
          </div>
        )}
      </div>

      {/* Recommended Path */}
      {wc.totalTracksEnrolled === 0 && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold">Recommended Path</p>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Start with these avatars for the strongest training progression:
            </p>
            <div className="flex flex-wrap gap-2">
              {["atheist", "muslim", "anti-prophet", "former-sda", "bhi"].map((id) => {
                const opp = getOpponentAvatar(id);
                return (
                  <Badge key={id} variant="outline" className="text-xs cursor-pointer hover:bg-primary/10" onClick={() => onSelectAvatar(id as AATSAvatarId)}>
                    {opp?.emoji} {opp?.name?.split("—")[0]?.trim() || id}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Warfare Classifications */}
      {WARFARE_CLASSIFICATIONS.filter((wf) => wf.avatarIds.length > 0).map((classification) => (
        <div key={classification.id} className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className={`h-4 w-4 ${classification.color}`} />
            <h3 className="text-sm font-bold">{classification.title}</h3>
            <span className="text-xs text-muted-foreground">{classification.description}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {classification.avatarIds.map((avatarId) => {
              const opponent = getOpponentAvatar(avatarId);
              const enrollment = wc.getEnrollment(avatarId);
              const progress = wc.getTrackProgress(avatarId);
              const rank = wc.getTrackRank(avatarId);

              return (
                <Card
                  key={avatarId}
                  className="cursor-pointer hover:border-primary/40 transition-colors group"
                  onClick={() => onSelectAvatar(avatarId)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      {opponent?.avatar ? (
                        <img src={opponent.avatar} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-border" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-lg">
                          {opponent?.emoji || "?"}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {opponent?.emoji} {opponent?.name?.split("—")[1]?.trim() || avatarId}
                        </p>
                        {enrollment ? (
                          <div className="space-y-1 mt-1">
                            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                              <span>{rank.emoji} {rank.title}</span>
                              <span>Day {enrollment.current_day}/56</span>
                            </div>
                            <Progress value={progress} className="h-1.5" />
                          </div>
                        ) : (
                          <p className="text-[10px] text-muted-foreground mt-0.5">Not enrolled</p>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/30 bg-muted/30 p-3 text-center">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-sm font-bold mt-0.5">{value}</p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// TRACK MAP VIEW
// ════════════════════════════════════════════════════════════════════════════

function TrackMapView({
  track,
  avatarId,
  wc,
  onBack,
  onSelectDay,
  onEnroll,
}: {
  track: WarCollegeTrack;
  avatarId: AATSAvatarId;
  wc: ReturnType<typeof useWarCollege>;
  onBack: () => void;
  onSelectDay: (day: number) => void;
  onEnroll: (id: AATSAvatarId) => void;
}) {
  const opponent = getOpponentAvatar(avatarId);
  const enrollment = wc.getEnrollment(avatarId);
  const rank = wc.getTrackRank(avatarId);
  const nextRank = getNextRank(wc.getTrackXP(avatarId));
  const progress = wc.getTrackProgress(avatarId);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        {opponent?.avatar ? (
          <img src={opponent.avatar} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/20" />
        ) : (
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-lg">{track.emoji}</div>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold truncate">{track.avatarName}</h2>
          <p className="text-xs text-muted-foreground">{track.description}</p>
        </div>
      </div>

      {/* Enrollment / Stats */}
      {!enrollment ? (
        <Card className="border-primary/30">
          <CardContent className="p-4 text-center space-y-3">
            <Crown className="h-8 w-8 mx-auto text-primary/60" />
            <p className="text-sm font-medium">Begin your 56-day training against {track.avatarName}</p>
            <p className="text-xs text-muted-foreground">{track.description}</p>
            <Button onClick={() => onEnroll(avatarId)} className="gap-2">
              <Swords className="h-4 w-4" /> Enroll Now
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Rank" value={`${rank.emoji} ${rank.title}`} />
          <StatCard label="XP" value={wc.getTrackXP(avatarId).toLocaleString()} />
          <StatCard label="Progress" value={`${progress}%`} />
          <StatCard label="Streak" value={`${enrollment.streak} days`} />
        </div>
      )}

      {/* Rank progress */}
      {enrollment && nextRank && (
        <div className="px-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>{rank.emoji} {rank.title}</span>
            <span>{nextRank.emoji} {nextRank.title} ({nextRank.xpRequired} XP)</span>
          </div>
          <Progress
            value={Math.min(((wc.getTrackXP(avatarId) - rank.xpRequired) / (nextRank.xpRequired - rank.xpRequired)) * 100, 100)}
            className="h-2"
          />
        </div>
      )}

      {/* Difficulty tier legend */}
      <div className="flex flex-wrap gap-2">
        {DIFFICULTY_RANGES.map((d) => (
          <Badge key={d.tier} variant="outline" className={DIFFICULTY_COLORS[d.tier]}>
            {d.label} (Days {d.days[0]}-{d.days[1]}) &middot; {d.minutes}
          </Badge>
        ))}
      </div>

      {/* 8-week calendar grid */}
      <div className="space-y-2">
        {Array.from({ length: 8 }, (_, weekIdx) => {
          const weekNum = weekIdx + 1;
          const startDay = weekIdx * 7 + 1;
          const tier = getDifficultyTier(startDay);

          return (
            <div key={weekNum}>
              <p className="text-[10px] text-muted-foreground font-semibold mb-1 uppercase tracking-wider">
                Week {weekNum} &middot; {tier.charAt(0).toUpperCase() + tier.slice(1)}
              </p>
              <div className="grid grid-cols-7 gap-1.5">
                {Array.from({ length: 7 }, (_, dayIdx) => {
                  const dayNum = startDay + dayIdx;
                  if (dayNum > 56) return <div key={dayIdx} />;
                  const dayData = track.days.find((d) => d.day === dayNum);
                  const completed = wc.isDayCompleted(avatarId, dayNum);
                  const unlocked = enrollment ? wc.isDayUnlocked(avatarId, dayNum) : false;
                  const isCurrent = enrollment?.current_day === dayNum;
                  const dayTier = getDifficultyTier(dayNum);

                  return (
                    <button
                      key={dayNum}
                      onClick={() => unlocked && onSelectDay(dayNum)}
                      disabled={!unlocked}
                      className={`relative rounded-lg border p-2 text-center transition-all ${
                        completed
                          ? "border-green-500/40 bg-green-500/10 text-green-400"
                          : isCurrent
                          ? "border-primary/50 bg-primary/10 text-primary ring-2 ring-primary/30"
                          : unlocked
                          ? `border-border/40 hover:border-primary/40 ${DIFFICULTY_COLORS[dayTier].split(" ")[1]}`
                          : "border-border/20 bg-muted/20 text-muted-foreground/40 cursor-not-allowed"
                      }`}
                    >
                      <div className="text-[10px] font-bold">{dayNum}</div>
                      {completed ? (
                        <CheckCircle2 className="h-3 w-3 mx-auto mt-0.5" />
                      ) : unlocked ? (
                        <Circle className="h-3 w-3 mx-auto mt-0.5 opacity-40" />
                      ) : (
                        <Lock className="h-3 w-3 mx-auto mt-0.5 opacity-30" />
                      )}
                      {dayData && (
                        <div className="text-[8px] mt-0.5 opacity-60">{dayData.xpReward} XP</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// DAILY LESSON VIEW
// ════════════════════════════════════════════════════════════════════════════

function DailyLessonView({
  dayData,
  track,
  avatarId,
  wc,
  onBack,
  onNavigateToDefense,
}: {
  dayData: WarCollegeDay;
  track: WarCollegeTrack;
  avatarId: AATSAvatarId;
  wc: ReturnType<typeof useWarCollege>;
  onBack: () => void;
  onNavigateToDefense?: () => void;
}) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [drillResponse, setDrillResponse] = useState("");
  const [weaponName, setWeaponName] = useState("");
  const [weaponText, setWeaponText] = useState("");
  const [masteryAnswers, setMasteryAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [completing, setCompleting] = useState(false);

  const isCompleted = wc.isDayCompleted(avatarId, dayData.day);
  const opponent = getOpponentAvatar(avatarId);
  const tier = getDifficultyTier(dayData.day);

  const drillDone = drillResponse.trim().length > 20;
  const weaponDone = weaponName.trim().length > 0 && weaponText.trim().length > 20;
  const allMasteryAnswered = dayData.masteryCheck.every((_, i) => masteryAnswers[i] !== undefined);

  const masteryScore = useMemo(() => {
    if (!allMasteryAnswered) return 0;
    const correct = dayData.masteryCheck.filter((q, i) => masteryAnswers[i] === q.correctIndex).length;
    return Math.round((correct / dayData.masteryCheck.length) * 100);
  }, [masteryAnswers, allMasteryAnswered, dayData.masteryCheck]);

  const handleComplete = async () => {
    if (isCompleted || completing) return;
    setCompleting(true);
    try {
      let xp = dayData.xpReward;
      if (drillDone) xp += 25;
      if (weaponDone) xp += 25;

      if (weaponDone) {
        await wc.saveWeapon(avatarId, dayData.day, weaponName, weaponText, dayData.warfareType);
      }

      await wc.completeDay(avatarId, dayData.day, {
        masteryScore,
        drillCompleted: drillDone,
        weaponForged: weaponDone,
        jeevesDebriefUsed: false,
        xpEarned: xp,
      });

      toast({
        title: `Day ${dayData.day} Complete!`,
        description: `+${xp} XP earned. ${dayData.day < 56 ? `Day ${dayData.day + 1} is now unlocked.` : "You have graduated this track!"}`,
      });
    } catch {
      toast({ title: "Error", description: "Could not save progress.", variant: "destructive" });
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={DIFFICULTY_COLORS[tier]}>{tier}</Badge>
            <span className="text-xs text-muted-foreground">Day {dayData.day}/56</span>
            <span className="text-xs text-muted-foreground">{dayData.estimatedMinutes} min</span>
            <span className="text-xs text-muted-foreground">{dayData.xpReward} XP</span>
          </div>
          <h2 className="text-lg font-bold mt-0.5">{dayData.title}</h2>
        </div>
        {isCompleted && (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Done
          </Badge>
        )}
      </div>

      {/* Step navigation */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {LESSON_STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                step === i
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              <Icon className="h-3 w-3" />
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Step content */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              {step === 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <BookOpen className="h-5 w-5" />
                    <h3 className="font-bold">Instructor Voice</h3>
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                    {dayData.instructorVoice}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Eye className="h-5 w-5" />
                    <h3 className="font-bold">Avatar Presence</h3>
                  </div>
                  <div className="relative rounded-xl border border-border/30 bg-gradient-to-br from-muted/50 to-muted/20 p-4">
                    {opponent?.avatar && (
                      <img src={opponent.avatar} alt="" className="h-12 w-12 rounded-full object-cover ring-2 ring-border float-left mr-3 mb-1" />
                    )}
                    <p className="text-sm italic leading-relaxed text-muted-foreground">
                      {dayData.avatarPresence}
                    </p>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Target className="h-5 w-5" />
                    <h3 className="font-bold">Tactical Briefing</h3>
                  </div>
                  <p className="text-sm leading-relaxed">{dayData.tacticalBriefing}</p>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Swords className="h-5 w-5" />
                    <h3 className="font-bold">Drill</h3>
                  </div>
                  <p className="text-sm leading-relaxed">{dayData.drill}</p>
                  <Textarea
                    placeholder="Write your response to the drill scenario..."
                    value={drillResponse}
                    onChange={(e) => setDrillResponse(e.target.value)}
                    className="min-h-[120px]"
                  />
                  {drillDone && <p className="text-xs text-green-500 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Drill completed (+25 XP bonus)</p>}
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Hammer className="h-5 w-5" />
                    <h3 className="font-bold">Forge a Weapon</h3>
                  </div>
                  <p className="text-sm leading-relaxed">{dayData.forgeAWeapon}</p>
                  <input
                    type="text"
                    placeholder="Weapon name..."
                    value={weaponName}
                    onChange={(e) => setWeaponName(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  />
                  <Textarea
                    placeholder="Write your weapon argument..."
                    value={weaponText}
                    onChange={(e) => setWeaponText(e.target.value)}
                    className="min-h-[120px]"
                  />
                  {weaponDone && <p className="text-xs text-green-500 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Weapon forged (+25 XP bonus)</p>}
                </div>
              )}

              {step === 5 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <MessageSquare className="h-5 w-5" />
                    <h3 className="font-bold">Jeeves Debrief</h3>
                  </div>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">{dayData.jeevesDebrief}</div>
                </div>
              )}

              {step === 6 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Brain className="h-5 w-5" />
                    <h3 className="font-bold">Mastery Check</h3>
                  </div>
                  {dayData.masteryCheck.map((q, qIdx) => (
                    <div key={qIdx} className="space-y-2 border-b border-border/20 pb-4 last:border-0">
                      <p className="text-sm font-medium">{q.question}</p>
                      <div className="grid gap-1.5">
                        {q.options.map((opt, oIdx) => {
                          const selected = masteryAnswers[qIdx] === oIdx;
                          const isCorrect = oIdx === q.correctIndex;
                          const revealed = showResults;

                          return (
                            <button
                              key={oIdx}
                              onClick={() => {
                                if (!showResults) {
                                  setMasteryAnswers((prev) => ({ ...prev, [qIdx]: oIdx }));
                                }
                              }}
                              className={`text-left rounded-lg border px-3 py-2 text-sm transition-colors ${
                                revealed && isCorrect
                                  ? "border-green-500/50 bg-green-500/10 text-green-400"
                                  : revealed && selected && !isCorrect
                                  ? "border-red-500/50 bg-red-500/10 text-red-400"
                                  : selected
                                  ? "border-primary/50 bg-primary/10"
                                  : "border-border/30 hover:border-border/60"
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                      {showResults && (
                        <p className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-2 mt-1">
                          {q.explanation}
                        </p>
                      )}
                    </div>
                  ))}

                  {allMasteryAnswered && !showResults && (
                    <Button onClick={() => setShowResults(true)} className="w-full gap-2">
                      <Zap className="h-4 w-4" /> Check Answers
                    </Button>
                  )}

                  {showResults && (
                    <div className="space-y-3">
                      <div className="text-center p-3 rounded-xl bg-muted/30 border border-border/30">
                        <p className="text-2xl font-bold">{masteryScore}%</p>
                        <p className="text-xs text-muted-foreground">Mastery Score</p>
                      </div>

                      {!isCompleted && (
                        <Button onClick={handleComplete} disabled={completing} className="w-full gap-2" size="lg">
                          {completing ? (
                            <>Saving...</>
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4" />
                              Complete Day {dayData.day}
                              <span className="text-xs opacity-70">
                                (+{dayData.xpReward}{drillDone ? "+25" : ""}{weaponDone ? "+25" : ""} XP)
                              </span>
                            </>
                          )}
                        </Button>
                      )}

                      {isCompleted && onNavigateToDefense && (
                        <Button variant="outline" onClick={onNavigateToDefense} className="w-full gap-2">
                          <Swords className="h-4 w-4" /> Test Your Training in Defense Mode
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Step navigation buttons */}
      <div className="flex justify-between">
        <Button variant="ghost" size="sm" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Previous
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setStep(Math.min(6, step + 1))} disabled={step === 6}>
          Next <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// RANK DISPLAY VIEW
// ════════════════════════════════════════════════════════════════════════════

function RankDisplayView({
  wc,
  onBack,
}: {
  wc: ReturnType<typeof useWarCollege>;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          War College Ranks
        </h2>
      </div>

      {/* Current Global Rank */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-transparent">
        <CardContent className="p-6 text-center">
          <p className="text-5xl mb-2">{wc.globalRank.emoji}</p>
          <h3 className="text-xl font-bold">{wc.globalRank.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{wc.globalRank.description}</p>
          <p className="text-2xl font-bold text-primary mt-2">{wc.globalXP.toLocaleString()} XP</p>
        </CardContent>
      </Card>

      {/* All Ranks */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold">Rank Progression</h3>
        {WAR_COLLEGE_RANKS.map((rank) => {
          const isCurrent = wc.globalRank.id === rank.id;
          const isAchieved = wc.globalXP >= rank.xpRequired;

          return (
            <div
              key={rank.id}
              className={`flex items-center gap-3 rounded-xl border p-3 ${
                isCurrent
                  ? "border-primary/50 bg-primary/10"
                  : isAchieved
                  ? "border-green-500/30 bg-green-500/5"
                  : "border-border/20 bg-muted/10 opacity-60"
              }`}
            >
              <span className="text-2xl">{rank.emoji}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold">{rank.title}</p>
                <p className="text-[10px] text-muted-foreground">{rank.description}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold">{rank.xpRequired.toLocaleString()} XP</p>
                {isAchieved && <CheckCircle2 className="h-3.5 w-3.5 text-green-500 ml-auto mt-0.5" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Per-track ranks */}
      {wc.totalTracksEnrolled > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-bold">Track Ranks</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {AATS_AVATAR_IDS.filter((id) => wc.isEnrolled(id)).map((avatarId) => {
              const opponent = getOpponentAvatar(avatarId);
              const rank = wc.getTrackRank(avatarId);
              const xp = wc.getTrackXP(avatarId);
              const progress = wc.getTrackProgress(avatarId);

              return (
                <div key={avatarId} className="flex items-center gap-2 rounded-lg border border-border/30 p-2.5">
                  {opponent?.avatar ? (
                    <img src={opponent.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm">{opponent?.emoji}</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{opponent?.emoji} {avatarId}</p>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <span>{rank.emoji} {rank.title}</span>
                      <span>&middot;</span>
                      <span>{xp} XP</span>
                      <span>&middot;</span>
                      <span>{progress}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
