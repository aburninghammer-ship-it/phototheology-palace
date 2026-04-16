// ─── War College Manuscript Reader ──────────────────────────────────────────
// Immersive, long-form reader for War College Strategic Manuscripts.
// Layout: Level toggle → inline audio → manuscript → Ask Jeeves → drills + quiz

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, BookOpen, Swords, Target, CheckCircle2,
  Flame, Clock, Sparkles, Headphones,
  Loader2, GraduationCap,
} from "lucide-react";
import { AudioNarrator } from "@/components/audio/AudioNarrator";
import { ManuscriptQA } from "./ManuscriptQA";
import { ManuscriptQuiz } from "./ManuscriptQuiz";
import { WeaponForge } from "./WeaponForge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { WarCollegeDay } from "@/data/aats/warCollegeTypes";
import { RANK_CONFIG } from "@/data/aats/warCollegeTypes";
import ReactMarkdown from "react-markdown";

interface WarCollegeReaderProps {
  study: WarCollegeDay;
  onBack: () => void;
  onComplete?: () => void;
  isCompleted?: boolean;
  onLoadAlternateLevel?: (level: string) => Promise<WarCollegeDay>;
  avatarId?: string;
}

export function WarCollegeReader({
  study,
  onBack,
  onComplete,
  isCompleted = false,
  onLoadAlternateLevel,
  avatarId,
}: WarCollegeReaderProps) {
  const [masteryAnswers, setMasteryAnswers] = useState<Record<number, boolean>>({});
  const [autoMarkedComplete, setAutoMarkedComplete] = useState(false);

  // New state for restructured layout
  const [readingLevel, setReadingLevel] = useState<"scholar" | "high-school">("scholar");
  const [hsStudy, setHsStudy] = useState<WarCollegeDay | null>(null);
  const [hsLoading, setHsLoading] = useState(false);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [showQA, setShowQA] = useState(false);

  const rankInfo = RANK_CONFIG[study.rank];

  // Active manuscript based on reading level
  const activeStudy = readingLevel === "high-school" && hsStudy ? hsStudy : study;

  useEffect(() => {
    setAutoMarkedComplete(false);
  }, [study.dayNumber]);

  const handleLevelToggle = async (level: "scholar" | "high-school") => {
    if (level === readingLevel) return;
    setReadingLevel(level);

    // Load high school version on first toggle
    if (level === "high-school" && !hsStudy && onLoadAlternateLevel) {
      setHsLoading(true);
      try {
        const result = await onLoadAlternateLevel("high-school");
        setHsStudy(result);
      } catch (err) {
        console.error("Failed to load high school manuscript:", err);
        setReadingLevel("scholar"); // revert on failure
      } finally {
        setHsLoading(false);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* ─── Header ─── */}
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Track
        </Button>

        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Badge
              variant="outline"
              className={`${rankInfo.color} border-current/30 text-xs`}
            >
              {rankInfo.emoji} {rankInfo.label} — Week {Math.ceil(study.dayNumber / 7)}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Day {study.dayNumber}
            </Badge>
          </div>

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              🎓 Phototheology War College — {activeStudy.track}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
              {activeStudy.title}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{activeStudy.subtitle}</p>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Swords className="h-3.5 w-3.5" /> {activeStudy.avatarName}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> ~{activeStudy.estimatedMinutes} min
            </span>
          </div>

          {isCompleted && (
            <Badge className="bg-green-500/10 text-green-400 border-green-500/30">
              <CheckCircle2 className="h-3 w-3 mr-1" /> Completed
            </Badge>
          )}
        </div>

        <Separator />
      </div>

      {/* ─── Reading Level Toggle ─── */}
      {onLoadAlternateLevel && (
        <div className="flex items-center justify-center gap-1 p-1 rounded-lg bg-muted/50 w-fit mx-auto">
          <button
            onClick={() => handleLevelToggle("scholar")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
              readingLevel === "scholar"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <GraduationCap className="h-4 w-4" /> Scholar
          </button>
          <button
            onClick={() => handleLevelToggle("high-school")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
              readingLevel === "high-school"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookOpen className="h-4 w-4" /> Simplified
          </button>
        </div>
      )}

      {/* ─── Loading indicator for HS manuscript ─── */}
      {hsLoading && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-6 text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-sm font-medium">Generating simplified manuscript...</p>
            <p className="text-xs text-muted-foreground">Simplifying language while preserving depth.</p>
          </CardContent>
        </Card>
      )}

      {/* ─── Inline Audio Player Toggle ─── */}
      {!hsLoading && (
        <div className="text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAudioPlayer(!showAudioPlayer)}
            className="gap-2"
          >
            <Headphones className="h-4 w-4" />
            {showAudioPlayer ? "Hide Audio Player" : "Listen While Reading"}
          </Button>
        </div>
      )}

      {/* ─── Audio Player (collapsible) ─── */}
      <AnimatePresence>
        {showAudioPlayer && !hsLoading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <AudioNarrator
              key={readingLevel}
              text={activeStudy.manuscript}
              title={`🎧 Listen — Day ${activeStudy.dayNumber}: ${activeStudy.title}`}
              voice="onyx"
              showVoiceSelector={true}
              onEnded={() => {
                if (!isCompleted && onComplete && !autoMarkedComplete) {
                  setAutoMarkedComplete(true);
                  onComplete();
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Manuscript Body (always visible) ─── */}
      {!hsLoading && (
        <Card className="border-primary/10 shadow-lg">
          <CardContent className="p-6 sm:p-8 md:p-10">
            <div className="prose prose-lg dark:prose-invert max-w-none
              prose-p:text-foreground/90 prose-p:leading-[1.85] prose-p:mb-6
              prose-blockquote:border-l-primary prose-blockquote:bg-primary/5
              prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
              prose-blockquote:not-italic
              prose-strong:text-primary prose-em:text-foreground/80
              prose-headings:text-foreground
              [&>blockquote_strong]:text-primary [&>blockquote_em]:text-foreground/70
              text-[15px] sm:text-base">
              <ReactMarkdown>{activeStudy.manuscript}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── Ask Jeeves (collapsible) ─── */}
      {!hsLoading && (
        <>
          <div className="text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowQA(!showQA)}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {showQA ? "Hide Ask Jeeves" : "Ask Jeeves"}
            </Button>
          </div>

          <AnimatePresence>
            {showQA && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <ManuscriptQA
                  manuscript={activeStudy.manuscript}
                  dayNumber={activeStudy.dayNumber}
                  title={activeStudy.title}
                  track={activeStudy.track}
                  avatarName={activeStudy.avatarName}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* ─── Mark Complete (always visible) ─── */}
      {!isCompleted && onComplete && (
        <div className="text-center py-2">
          <Button
            size="lg"
            onClick={() => {
              if (!autoMarkedComplete) {
                setAutoMarkedComplete(true);
                onComplete();
              }
            }}
            className="gap-2 bg-gradient-to-r from-primary to-primary/80"
          >
            <CheckCircle2 className="h-5 w-5" />
            Mark Day {study.dayNumber} Complete
          </Button>
        </div>
      )}
      {isCompleted && (
        <div className="text-center py-2">
          <p className="text-sm text-green-500 flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Day {study.dayNumber} Complete
          </p>
        </div>
      )}

      {/* ─── Post-Manuscript Training ─── */}
      <div className="flex items-center gap-2 pt-2">
        <Target className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold">Post-Manuscript Training</h2>
      </div>

      <div className="space-y-5">
        {/* Defense Application */}
        <Card className="border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent">
          <CardContent className="p-5 space-y-3">
            <h3 className="font-bold flex items-center gap-2 text-red-400">
              <Swords className="h-4 w-4" /> Defense Mode Application
            </h3>
            <div>
              <p className="text-xs uppercase text-muted-foreground font-semibold mb-1">
                Common Objection:
              </p>
              <p className="text-sm italic p-3 rounded-lg bg-red-500/5 border border-red-500/15">
                "{activeStudy.defenseApplication.commonObjection}"
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground font-semibold mb-1">
                Elite Strategic Response:
              </p>
              <p className="text-sm p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
                "{activeStudy.defenseApplication.eliteResponse}"
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Weapon Forge */}
        {avatarId ? (
          <WeaponForge
            manuscript={activeStudy.manuscript}
            forgeExercise={activeStudy.forgeExercise}
            dayNumber={activeStudy.dayNumber}
            avatarId={avatarId}
            avatarName={activeStudy.avatarName}
            track={activeStudy.track}
            title={activeStudy.title}
          />
        ) : (
          <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
            <CardContent className="p-5 space-y-3">
              <h3 className="font-bold flex items-center gap-2 text-amber-400">
                <Flame className="h-4 w-4" /> Forge a Weapon Exercise
              </h3>
              <p className="text-sm">{activeStudy.forgeExercise}</p>
            </CardContent>
          </Card>
        )}

        {/* Mastery Checks */}
        <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent">
          <CardContent className="p-5 space-y-3">
            <h3 className="font-bold flex items-center gap-2 text-blue-400">
              <Target className="h-4 w-4" /> Mastery Check
            </h3>
            <div className="space-y-2">
              {activeStudy.masteryChecks.map((q, i) => (
                <button
                  key={i}
                  className="w-full text-left flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:border-primary/30 transition-all"
                  onClick={() =>
                    setMasteryAnswers((prev) => ({
                      ...prev,
                      [i]: !prev[i],
                    }))
                  }
                >
                  <div
                    className={`mt-0.5 ${
                      masteryAnswers[i]
                        ? "text-green-500"
                        : "text-muted-foreground"
                    }`}
                  >
                    {masteryAnswers[i] ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-current" />
                    )}
                  </div>
                  <p className="text-sm">{q}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Manuscript Quiz */}
        <ManuscriptQuiz
          key={readingLevel}
          manuscript={activeStudy.manuscript}
          dayNumber={activeStudy.dayNumber}
          title={activeStudy.title}
          track={activeStudy.track}
          avatarName={activeStudy.avatarName}
        />

        {/* Tomorrow's Teaser */}
        <Card className="border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-transparent">
          <CardContent className="p-5 space-y-2">
            <h3 className="font-bold flex items-center gap-2 text-violet-400">
              <Sparkles className="h-4 w-4" /> Tomorrow's Unlock
            </h3>
            <p className="text-sm text-muted-foreground">
              {activeStudy.tomorrowTeaser}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
