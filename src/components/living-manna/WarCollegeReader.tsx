// ─── War College Manuscript Reader ──────────────────────────────────────────
// Immersive, long-form reader for War College Strategic Manuscripts.

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, BookOpen, Swords, Target, CheckCircle2,
  ChevronDown, ChevronUp, GraduationCap, Flame, Clock, Sparkles, Headphones, ListMusic,
} from "lucide-react";
import { AudioNarrator } from "@/components/audio/AudioNarrator";
import { ManuscriptQA } from "./ManuscriptQA";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { WarCollegeDay } from "@/data/aats/warCollegeTypes";
import { RANK_CONFIG } from "@/data/aats/warCollegeTypes";
import ReactMarkdown from "react-markdown";

interface WarCollegeReaderProps {
  study: WarCollegeDay;
  onBack: () => void;
  onComplete?: () => void;
  isCompleted?: boolean;
}

export function WarCollegeReader({
  study,
  onBack,
  onComplete,
  isCompleted = false,
}: WarCollegeReaderProps) {
  const [showDrills, setShowDrills] = useState(false);
  const [forgeResponse, setForgeResponse] = useState("");
  const [masteryAnswers, setMasteryAnswers] = useState<Record<number, boolean>>({});
  const [activePanel, setActivePanel] = useState<"read" | "audio" | "qa">("read");
  const rankInfo = RANK_CONFIG[study.rank];
  const [autoMarkedComplete, setAutoMarkedComplete] = useState(false);

  useEffect(() => {
    setAutoMarkedComplete(false);
  }, [study.dayNumber]);

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
              🎓 Phototheology War College — {study.track}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
              {study.title}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{study.subtitle}</p>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Swords className="h-3.5 w-3.5" /> {study.avatarName}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> ~{study.estimatedMinutes} min
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

      {/* ─── Reader Panels ─── */}
      <Tabs
        value={activePanel}
        onValueChange={(value) => setActivePanel(value as "read" | "audio" | "qa")}
        className="w-full"
      >
        <TabsList className="w-full">
          <TabsTrigger value="read" className="gap-2">
            <BookOpen className="h-4 w-4" /> Read
          </TabsTrigger>
          <TabsTrigger value="audio" className="gap-2">
            <Headphones className="h-4 w-4" /> Audio
          </TabsTrigger>
          <TabsTrigger value="qa" className="gap-2">
            <Sparkles className="h-4 w-4" /> Ask Jeeves
          </TabsTrigger>
        </TabsList>

        <TabsContent value="audio" className="mt-4 space-y-3">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-3 flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">Playlist controls live in the track view.</p>
              <Button variant="outline" size="sm" className="h-8" onClick={onBack}>
                <ListMusic className="h-3.5 w-3.5 mr-1.5" /> Open Playlist
              </Button>
            </CardContent>
          </Card>

          <AudioNarrator
            text={study.manuscript}
            title={`🎧 Listen — Day ${study.dayNumber}: ${study.title}`}
            voice="onyx"
            showVoiceSelector={true}
            onEnded={() => {
              if (!isCompleted && onComplete && !autoMarkedComplete) {
                setAutoMarkedComplete(true);
                onComplete();
              }
            }}
          />
        </TabsContent>

        <TabsContent value="read" className="mt-4">
          {/* ─── Manuscript Body ─── */}
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
                <ReactMarkdown>{study.manuscript}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qa" className="mt-4">
          <ManuscriptQA
            manuscript={study.manuscript}
            dayNumber={study.dayNumber}
            title={study.title}
            track={study.track}
            avatarName={study.avatarName}
          />
        </TabsContent>
      </Tabs>

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

      {/* ─── Post-Manuscript Tactical Section Toggle ─── */}
      <div className="text-center">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setShowDrills(!showDrills)}
          className="gap-2 border-primary/30"
        >
          {showDrills ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
          {showDrills ? "Hide" : "Open"} Post-Manuscript Drills
          <Target className="h-4 w-4" />
        </Button>
      </div>

      {/* ─── Post-Manuscript Drills ─── */}
      <AnimatePresence>
        {showDrills && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-5 overflow-hidden"
          >
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
                    "{study.defenseApplication.commonObjection}"
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-muted-foreground font-semibold mb-1">
                    Elite Strategic Response:
                  </p>
                  <p className="text-sm p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
                    "{study.defenseApplication.eliteResponse}"
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Forge Exercise */}
            <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
              <CardContent className="p-5 space-y-3">
                <h3 className="font-bold flex items-center gap-2 text-amber-400">
                  <Flame className="h-4 w-4" /> Forge a Weapon Exercise
                </h3>
                <p className="text-sm">{study.forgeExercise}</p>
                <Textarea
                  placeholder="Write your forged weapon here..."
                  value={forgeResponse}
                  onChange={(e) => setForgeResponse(e.target.value)}
                  rows={5}
                  className="bg-background/50"
                />
              </CardContent>
            </Card>

            {/* Mastery Checks */}
            <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent">
              <CardContent className="p-5 space-y-3">
                <h3 className="font-bold flex items-center gap-2 text-blue-400">
                  <Target className="h-4 w-4" /> Mastery Check
                </h3>
                <div className="space-y-2">
                  {study.masteryChecks.map((q, i) => (
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

            {/* Tomorrow's Teaser */}
            <Card className="border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-transparent">
              <CardContent className="p-5 space-y-2">
                <h3 className="font-bold flex items-center gap-2 text-violet-400">
                  <Sparkles className="h-4 w-4" /> Tomorrow's Unlock
                </h3>
                <p className="text-sm text-muted-foreground">
                  {study.tomorrowTeaser}
                </p>
              </CardContent>
            </Card>

            {/* Complete button removed — now always visible above drills */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
