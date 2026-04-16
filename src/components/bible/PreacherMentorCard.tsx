import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, X, Volume2, VolumeX, ChevronDown, ChevronRight, Crown, RefreshCw, AlertTriangle } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useTextToSpeechEnhanced } from "@/hooks/useTextToSpeechEnhanced";
import { usePreacherMentorStudyPrefs } from "@/hooks/usePreacherMentorStudyPrefs";
import { LanguageInsightPanel } from "./LanguageInsightPanel";
import { StudyBuddyPrompts } from "./StudyBuddyPrompts";
import { AdvancedLensOverride } from "./AdvancedLensOverride";
import { getRoomByCode, formatRoomDisplay } from "@/data/canonicalRooms";
import type {
  PassageAnalysis,
  CommentaryResponse,
  CommentarySections,
  ComplianceReport,
  LanguageTerm,
} from "@/types/preacherMentor";

interface PreacherMentorCardProps {
  book: string;
  chapter: number;
  verse: number;
  verseText: string;
  onClose: () => void;
}

export const PreacherMentorCard = ({
  book,
  chapter,
  verse,
  verseText,
  onClose,
}: PreacherMentorCardProps) => {
  const { user } = useAuth();
  const { prefs, updatePref } = usePreacherMentorStudyPrefs();

  const [analysis, setAnalysis] = useState<PassageAnalysis | null>(null);
  const [commentary, setCommentary] = useState<{
    sections: CommentarySections;
    study_buddy_prompts: string[];
    compliance_report: ComplianceReport;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [lensOverride, setLensOverride] = useState<string | null>(null);
  const [lensesOpen, setLensesOpen] = useState(false);

  const passageRef = `${book} ${chapter}:${verse}`;

  const { isPlaying, isLoading: audioLoading, speak, stop } = useTextToSpeechEnhanced({
    defaultVoice: "onyx",
  });

  // Pipeline: analyze → compose
  const runPipeline = useCallback(async (overrideRoom?: string | null) => {
    setLoading(true);
    setError(null);
    setCommentary(null);

    try {
      // Step 1: Passage Analysis
      setLoadingStage("Detecting Palace lenses...");

      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const analyzeRes = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL || ""}/functions/v1/pt-passage-analyzer`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ book, chapter, verse, verseText }),
        }
      );

      if (!analyzeRes.ok) {
        throw new Error(`Analysis failed: ${analyzeRes.status}`);
      }

      const analysisData: PassageAnalysis = await analyzeRes.json();
      setAnalysis(analysisData);

      // Step 2: Commentary Composition
      setLoadingStage("Composing mentor commentary...");

      const effectivePrimary = overrideRoom || analysisData.primary_room;

      const commentaryRes = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL || ""}/functions/v1/jeeves`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            mode: "preacher-mentor-commentary",
            book,
            chapter,
            verseText: { verse, text: verseText },
            primary_room: effectivePrimary,
            secondary_rooms: analysisData.secondary_rooms,
            genre: analysisData.genre,
            override_room: overrideRoom || null,
          }),
        }
      );

      if (!commentaryRes.ok) {
        throw new Error(`Commentary failed: ${commentaryRes.status}`);
      }

      const commentaryData = await commentaryRes.json();
      const content = commentaryData.content;

      setCommentary({
        sections: content.sections || {
          meaning: "",
          language_insight: [],
          cross_scripture: "",
          palace_framing: "",
          preaching_orientation: "",
        },
        study_buddy_prompts: content.study_buddy_prompts || [],
        compliance_report: content.compliance_report || {
          sermon_check_passed: true,
          room_validation_passed: true,
          word_count: 0,
          banned_phrases_found: [],
          invalid_rooms_found: [],
        },
      });
    } catch (err: any) {
      console.error("Preacher Mentor pipeline error:", err);
      setError(err.message || "Failed to generate commentary");
      toast.error("Failed to generate Preacher Mentor commentary");
    } finally {
      setLoading(false);
      setLoadingStage("");
    }
  }, [book, chapter, verse, verseText]);

  // Run pipeline on mount and when verse changes
  useEffect(() => {
    runPipeline(lensOverride);
  }, [book, chapter, verse]);

  // Handle lens override
  const handleLensOverride = useCallback(
    (roomCode: string | null) => {
      setLensOverride(roomCode);

      // Save to DB if user is logged in
      if (user && roomCode && analysis) {
        (supabase as any)
          .from("user_lens_overrides")
          .upsert(
            {
              user_id: user.id,
              passage_ref: passageRef,
              override_primary_room: roomCode,
              ai_original_primary: analysis.primary_room,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id,passage_ref" }
          )
          .then(({ error: e }: any) => {
            if (e) console.error("Error saving lens override:", e);
          });
      } else if (user && !roomCode) {
        // Remove override
        (supabase as any)
          .from("user_lens_overrides")
          .delete()
          .eq("user_id", user.id)
          .eq("passage_ref", passageRef)
          .then(({ error: e }: any) => {
            if (e) console.error("Error removing lens override:", e);
          });
      }

      // Re-run pipeline with new lens
      runPipeline(roomCode);
    },
    [user, analysis, passageRef, runPipeline]
  );

  // Audio: concatenate sections with pauses
  const handleAudio = () => {
    if (isPlaying) {
      stop();
      return;
    }
    if (!commentary) return;

    const sections = commentary.sections;
    const parts = [
      sections.meaning,
      "...",
      sections.cross_scripture,
      "...",
      sections.palace_framing,
      "...",
      sections.preaching_orientation,
    ].filter(Boolean);

    speak(parts.join(" "), { voice: "onyx" });
  };

  const effectivePrimary = lensOverride || analysis?.primary_room || "sr";
  const primaryRoom = getRoomByCode(effectivePrimary);

  return (
    <Card variant="glass" className="overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600/20 via-orange-500/10 to-amber-600/20 border-b border-amber-500/20 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-amber-500" />
            <span className="font-semibold text-sm">Preacher Mentor</span>
            <Badge variant="outline" className="text-[10px] h-4 px-1.5">
              v1.0
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={handleAudio}
              disabled={!commentary || audioLoading}
            >
              {isPlaying ? (
                <VolumeX className="h-3.5 w-3.5" />
              ) : (
                <Volume2 className="h-3.5 w-3.5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => runPipeline(lensOverride)}
              disabled={loading}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={onClose}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {passageRef}
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-8 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
          <p className="text-sm text-muted-foreground">{loadingStage}</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-6 text-center space-y-3">
          <AlertTriangle className="h-8 w-8 mx-auto text-destructive/60" />
          <p className="text-sm text-destructive">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => runPipeline(lensOverride)}
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Content */}
      {commentary && analysis && !loading && (
        <div className="p-4 space-y-4">
          {/* Active Lenses (collapsed by default) */}
          <Collapsible open={lensesOpen} onOpenChange={setLensesOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between px-2 py-1.5 h-auto"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-amber-500/20 text-amber-700 border-amber-500/30 text-xs">
                    {primaryRoom?.code.toUpperCase() || effectivePrimary.toUpperCase()}
                  </Badge>
                  {analysis.secondary_rooms.map((code) => (
                    <Badge key={code} variant="outline" className="text-[10px]">
                      {code.toUpperCase()}
                    </Badge>
                  ))}
                  <Badge variant="secondary" className="text-[10px]">
                    {analysis.genre}
                  </Badge>
                </div>
                {lensesOpen ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-2 pb-2 mt-2">
              <div className="rounded-md bg-muted/30 p-3 space-y-2 text-xs">
                <p>
                  <span className="font-medium">Primary:</span>{" "}
                  {formatRoomDisplay(effectivePrimary)} (Floor{" "}
                  {primaryRoom?.floor})
                </p>
                {analysis.secondary_rooms.length > 0 && (
                  <p>
                    <span className="font-medium">Secondary:</span>{" "}
                    {analysis.secondary_rooms
                      .map((c) => formatRoomDisplay(c))
                      .join(", ")}
                  </p>
                )}
                <p className="text-muted-foreground italic">
                  {analysis.rationale.primary_reason}
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Compliance warnings */}
          {(!commentary.compliance_report.sermon_check_passed ||
            !commentary.compliance_report.room_validation_passed) && (
            <div className="flex items-start gap-2 rounded-md bg-amber-500/10 border border-amber-500/20 p-2">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
              <div className="text-[11px] text-amber-700 dark:text-amber-400 space-y-0.5">
                {!commentary.compliance_report.sermon_check_passed && (
                  <p>
                    Sermon language detected:{" "}
                    {commentary.compliance_report.banned_phrases_found.join(", ")}
                  </p>
                )}
                {!commentary.compliance_report.room_validation_passed && (
                  <p>
                    Invalid room codes:{" "}
                    {commentary.compliance_report.invalid_rooms_found.join(", ")}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 1. Meaning Section (always visible) */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Meaning
            </h4>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {commentary.sections.meaning}
            </p>
          </div>

          {/* 2. Language Insight (expandable) */}
          <LanguageInsightPanel
            terms={commentary.sections.language_insight as LanguageTerm[]}
            scholarlyView={prefs.scholarly_view}
          />

          {/* Scholarly toggle */}
          <div className="flex items-center gap-2 px-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={prefs.scholarly_view}
                onChange={(e) => updatePref("scholarly_view", e.target.checked)}
                className="h-3.5 w-3.5 rounded border-gray-300"
              />
              <span className="text-xs text-muted-foreground">
                Scholarly view
              </span>
            </label>
          </div>

          {/* 3. Cross-Scripture Section */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Cross-Scripture
            </h4>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {commentary.sections.cross_scripture}
            </p>
          </div>

          {/* 4. Palace Framing Section */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Palace Framing
            </h4>
            <div className="flex items-center gap-1.5 mb-1">
              <Badge
                variant="outline"
                className="text-[10px] h-4 px-1.5 border-amber-500/30 text-amber-600"
              >
                {effectivePrimary.toUpperCase()}
              </Badge>
              {analysis.secondary_rooms.map((code) => (
                <Badge
                  key={code}
                  variant="outline"
                  className="text-[10px] h-4 px-1.5"
                >
                  {code.toUpperCase()}
                </Badge>
              ))}
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {commentary.sections.palace_framing}
            </p>
          </div>

          {/* 5. Preaching Orientation Section */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Preaching Orientation
            </h4>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {commentary.sections.preaching_orientation}
            </p>
          </div>

          {/* Study Buddy Prompts */}
          <StudyBuddyPrompts
            prompts={commentary.study_buddy_prompts}
            primaryRoom={effectivePrimary}
            secondaryRooms={analysis.secondary_rooms}
          />

          {/* Advanced Lens Override (only if enabled) */}
          {prefs.advanced_lens && analysis && (
            <AdvancedLensOverride
              aiPrimaryRoom={analysis.primary_room}
              currentOverride={lensOverride}
              onOverride={handleLensOverride}
            />
          )}

          {/* Advanced lens toggle */}
          <div className="flex items-center gap-2 px-1 pt-1 border-t border-border/50">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={prefs.advanced_lens}
                onChange={(e) => updatePref("advanced_lens", e.target.checked)}
                className="h-3.5 w-3.5 rounded border-gray-300"
              />
              <span className="text-xs text-muted-foreground">
                Advanced: Enable lens override
              </span>
            </label>
          </div>

          {/* Word count */}
          <p className="text-[10px] text-muted-foreground text-right">
            {commentary.compliance_report.word_count} words
          </p>
        </div>
      )}
    </Card>
  );
};
