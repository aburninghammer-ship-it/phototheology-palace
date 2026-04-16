// ─── War College Track View ─────────────────────────────────────────────────
// Shows the 56-day journey for a specific avatar's War College track.
// ALL days are AI-generated on demand. No pre-built manuscripts.

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, CheckCircle2, BookOpen, Swords, Clock,
  GraduationCap, Loader2, Sparkles, Shield,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AudioTrainingPlaylist } from "./AudioTrainingPlaylist";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAATSProgress } from "@/hooks/useAATSProgress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { WarCollegeReader } from "./WarCollegeReader";
import { PersonalArmory } from "./PersonalArmory";
import {
  RANK_CONFIG,
  getRankForDay,
  WAR_COLLEGE_TRACKS,
  type WarCollegeDay,
  type WarCollegeRank,
  type WarCollegeTrack,
} from "@/data/aats/warCollegeTypes";
import { DEFENSE_OPPONENTS } from "@/data/defenseModeOpponents";

interface WarCollegeTrackViewProps {
  track: WarCollegeTrack;
  onBack: () => void;
}

export function WarCollegeTrackView({ track, onBack }: WarCollegeTrackViewProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { ensureEnrolled, completeItem, isItemCompleted, getMaxUnlockedDay } = useAATSProgress();
  const [selectedDay, setSelectedDay] = useState<WarCollegeDay | null>(null);
  const [generating, setGenerating] = useState(false);
  const [showArmory, setShowArmory] = useState(false);
  const opponent = DEFENSE_OPPONENTS.find((o) => o.id === track.avatarId);

  // Ensure enrollment record exists when the track view loads (starts the calendar)
  useEffect(() => {
    ensureEnrolled(track.avatarId);
  }, [track.avatarId, ensureEnrolled]);

  // Group days into weeks
  const weeks = useMemo(() => {
    const w: { week: number; rank: WarCollegeRank; days: number[] }[] = [];
    const totalWeeks = Math.ceil(track.totalDays / 7);
    for (let wk = 1; wk <= totalWeeks; wk++) {
      const days: number[] = [];
      for (let d = (wk - 1) * 7 + 1; d <= Math.min(wk * 7, track.totalDays); d++) {
        days.push(d);
      }
      w.push({ week: wk, rank: getRankForDay(days[0]), days });
    }
    return w;
  }, [track.totalDays]);

  const completedDays = useMemo(() => {
    const set = new Set<number>();
    for (let d = 1; d <= track.totalDays; d++) {
      if (isItemCompleted(track.avatarId, `wc-day-${d}`)) set.add(d);
    }
    return set;
  }, [track.avatarId, isItemCompleted, track.totalDays]);

  const maxDay = useMemo(() => getMaxUnlockedDay(track.avatarId), [getMaxUnlockedDay, track.avatarId]);

  const nextDay = useMemo(() => {
    for (let d = 1; d <= Math.min(maxDay, track.totalDays); d++) {
      if (!completedDays.has(d)) return d;
    }
    return Math.min(maxDay, track.totalDays);
  }, [completedDays, maxDay, track.totalDays]);

  const handleOpenDay = async (dayNumber: number) => {
    setGenerating(true);
    try {
      const study = await loadDayStudy(dayNumber);
      setSelectedDay(study);
    } catch (err: any) {
      console.error("War College generation error:", err);
      toast({
        title: "Generation failed",
        description: err.message || "Could not generate the day study. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  /** Shared loader for both direct open and playlist use */
  const loadDayStudy = async (dayNumber: number, overrideAvatarId?: string, readingLevel?: string): Promise<WarCollegeDay> => {
    const aId = overrideAvatarId || track.avatarId;
    const aTrack = WAR_COLLEGE_TRACKS.find(t => t.avatarId === aId) || track;
    const { data, error } = await supabase.functions.invoke("generate-war-college-day", {
      body: {
        avatarId: aId,
        avatarName: aTrack.avatarName,
        trackTitle: aTrack.title,
        dayNumber,
        rank: getRankForDay(dayNumber),
        weekNumber: Math.ceil(dayNumber / 7),
        ...(readingLevel ? { readingLevel } : {}),
      },
    });
    if (error) throw error;
    if (!data?.study) throw new Error("No study returned");
    return data.study as WarCollegeDay;
  };

  // Cross-track info for "Add Day X — All Avatars"
  const allTracksInfo = useMemo(() =>
    WAR_COLLEGE_TRACKS.map(t => ({
      avatarId: t.avatarId,
      avatarName: t.avatarName,
      trackTitle: t.title,
      emoji: t.emoji,
    })),
  []);

  const handleComplete = () => {
    if (!selectedDay) return;
    completeItem(track.avatarId, `wc-day-${selectedDay.dayNumber}`, track.totalDays);
    toast({ title: `Day ${selectedDay.dayNumber} Complete! 🎓` });
  };

  // ─── Personal Armory View ────────────────────────────────────────────────
  if (showArmory) {
    return (
      <PersonalArmory
        avatarId={track.avatarId}
        avatarName={track.avatarName}
        onBack={() => setShowArmory(false)}
      />
    );
  }

  // ─── Day Reader View ─────────────────────────────────────────────────────
  if (selectedDay) {
    return (
      <WarCollegeReader
        study={selectedDay}
        onBack={() => setSelectedDay(null)}
        onComplete={handleComplete}
        isCompleted={completedDays.has(selectedDay.dayNumber)}
        onLoadAlternateLevel={async (level) => loadDayStudy(selectedDay.dayNumber, undefined, level)}
        avatarId={track.avatarId}
      />
    );
  }

  // ─── Track Overview ──────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3 flex-1">
          {opponent?.avatar ? (
            <img
              src={opponent.avatar}
              alt=""
              className="w-12 h-12 rounded-full object-cover border-2 border-primary/30"
            />
          ) : (
            <div className="w-12 h-12 rounded-full border-2 border-primary/30 flex items-center justify-center text-xl bg-muted">
              {track.emoji}
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold">{track.emoji} {track.title}</h2>
            <p className="text-xs text-muted-foreground">{track.description}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowArmory(true)}
          className="gap-2 border-amber-500/30 text-amber-400 hover:bg-amber-500/10 flex-shrink-0"
        >
          <Shield className="h-4 w-4" /> My Armory
        </Button>
      </div>

      {/* Playlist visibility helper */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Audio playlist lives in this track
            </p>
            <p className="text-xs text-muted-foreground">
              Use “Add Current Week” or “Add All Unlocked” to build your queue fast.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const section = document.getElementById("audio-training-playlist");
              section?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            Jump to playlist
          </Button>
        </CardContent>
      </Card>

      {/* Audio Training Playlist */}
      <div id="audio-training-playlist">
        <AudioTrainingPlaylist
          trackTitle={track.title}
          avatarId={track.avatarId}
          avatarName={track.avatarName}
          maxUnlockedDay={maxDay}
          totalDays={track.totalDays}
          completedDays={completedDays}
          onLoadDay={async (dayNumber) => {
            try {
              return await loadDayStudy(dayNumber);
            } catch {
              return null;
            }
          }}
          allTracks={allTracksInfo}
          onLoadDayCrossTrack={async (aId, dayNumber) => {
            try {
              return await loadDayStudy(dayNumber, aId);
            } catch {
              return null;
            }
          }}
        />
      </div>

      {/* Progress */}
      <Card className="border-primary/20">
        <CardContent className="p-4 flex items-center gap-4">
          <GraduationCap className="h-6 w-6 text-primary flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="font-medium">
                {completedDays.size} / {track.totalDays} days completed
              </span>
              <span className="text-muted-foreground">
                {Math.round((completedDays.size / track.totalDays) * 100)}%
              </span>
            </div>
            <Progress
              value={(completedDays.size / track.totalDays) * 100}
              className="h-2"
            />
          </div>
          {nextDay <= track.totalDays && (
            <Button
              size="sm"
              onClick={() => handleOpenDay(nextDay)}
              disabled={generating}
              className="gap-1.5"
            >
              {generating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <BookOpen className="h-3.5 w-3.5" />
              )}
              Day {nextDay}
            </Button>
          )}
        </CardContent>
      </Card>

      {generating && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-6 text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-sm font-medium">
              Generating War College Manuscript...
            </p>
            <p className="text-xs text-muted-foreground">
              Crafting an immersive, strategic study. This may take 15–30 seconds.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Weekly Grid */}
      <div className="space-y-4">
        {weeks.map(({ week, rank, days }) => {
          const ri = RANK_CONFIG[rank];
          const weekCompleted = days.filter((d) => completedDays.has(d)).length;
          return (
            <div key={week}>
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="outline"
                  className={`${ri.color} border-current/30 text-xs`}
                >
                  {ri.emoji} Week {week} — {ri.label}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {weekCompleted}/{days.length} days
                </span>
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {days.map((d) => {
                  const done = completedDays.has(d);
                  const isNext = d === nextDay;
                  const isUnlocked = done || d <= maxDay;

                  return (
                    <motion.button
                      key={d}
                      whileHover={isUnlocked ? { scale: 1.05 } : {}}
                      whileTap={isUnlocked ? { scale: 0.95 } : {}}
                      disabled={generating || !isUnlocked}
                      onClick={() => isUnlocked && handleOpenDay(d)}
                      className={`
                        relative aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-bold
                        border transition-all
                        ${done
                          ? "bg-green-500/10 border-green-500/30 text-green-400 cursor-pointer"
                          : isNext
                            ? "bg-primary/10 border-primary/50 text-primary ring-2 ring-primary/20 cursor-pointer"
                            : isUnlocked
                              ? "bg-muted/30 border-border/50 text-muted-foreground hover:border-primary/30 cursor-pointer"
                              : "bg-muted/10 border-border/20 text-muted-foreground/30 cursor-not-allowed opacity-50"
                        }
                      `}
                    >
                      {done ? (
                        <CheckCircle2 className="h-4 w-4 mb-0.5" />
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
        })}
      </div>
    </div>
  );
}
