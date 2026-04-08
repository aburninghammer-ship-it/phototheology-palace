import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BookOpen, Loader2, Sparkles, Eye, Layers, Link2, Lightbulb, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { callJeeves } from "@/lib/jeevesClient";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";
import type { SavedResult } from "@/hooks/useShowMeUsage";

interface ShowMeVerseBreakdownProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUse: () => void;
  onSave?: (label: string, data: unknown) => void;
  savedResults?: SavedResult[];
  reviewOnly?: boolean;
}

interface BreakdownSection {
  heading: string;
  content: string;
  icon: LucideIcon;
  accent: string;
}

// Map section headings to icons and colors for visual depth
const SECTION_STYLE: Record<string, { icon: LucideIcon; accent: string }> = {
  "Opening Observation": { icon: Eye, accent: "violet" },
  "Dimensions Revealed": { icon: Layers, accent: "amber" },
  "Palace Principles Visible": { icon: Sparkles, accent: "emerald" },
  "Interconnections": { icon: Link2, accent: "sky" },
  "Synthesis": { icon: Lightbulb, accent: "rose" },
};

const ACCENT_CLASSES: Record<string, { border: string; bg: string; text: string }> = {
  violet: { border: "border-violet-500/20", bg: "bg-violet-500/5", text: "text-violet-300" },
  amber: { border: "border-amber-500/20", bg: "bg-amber-500/5", text: "text-amber-300" },
  emerald: { border: "border-emerald-500/20", bg: "bg-emerald-500/5", text: "text-emerald-300" },
  sky: { border: "border-sky-500/20", bg: "bg-sky-500/5", text: "text-sky-300" },
  rose: { border: "border-rose-500/20", bg: "bg-rose-500/5", text: "text-rose-300" },
  indigo: { border: "border-indigo-500/20", bg: "bg-indigo-500/5", text: "text-indigo-300" },
};

const DEFAULT_STYLE = { icon: BookOpen, accent: "indigo" };

function parseBreakdown(text: string): BreakdownSection[] {
  const sections: BreakdownSection[] = [];
  // Split on known section labels (plain text headings used by commentary-revealed)
  const knownHeadings = [
    "Opening Observation",
    "Dimensions Revealed",
    "Palace Principles Visible",
    "Interconnections",
    "Synthesis",
  ];

  // Build a regex that splits on these headings at the start of a line
  const headingPattern = new RegExp(
    `^(${knownHeadings.join("|")})\\s*$`,
    "m"
  );

  // Also handle markdown-style headings or bold headings as fallback
  const lines = text.split("\n");
  let currentHeading = "";
  let currentContent: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Strip the PRINCIPLES_REVEALED line
    if (trimmed.startsWith("PRINCIPLES_REVEALED:")) continue;

    // Check if this line is a known section heading
    const matchKnown = knownHeadings.find(
      (h) => trimmed === h || trimmed.replace(/[^\w\s]/g, "").trim() === h
    );
    // Also check markdown headings or bold
    const mdMatch = trimmed.match(/^#{1,3}\s+(.+)/) || trimmed.match(/^\*\*(.+?)\*\*$/);
    const detectedHeading = matchKnown || mdMatch?.[1]?.replace(/\*\*/g, "").trim();

    if (detectedHeading) {
      if (currentHeading && currentContent.length > 0) {
        const style = SECTION_STYLE[currentHeading] || DEFAULT_STYLE;
        sections.push({
          heading: currentHeading,
          content: currentContent.join("\n").trim(),
          icon: style.icon,
          accent: style.accent,
        });
      }
      currentHeading = detectedHeading;
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }
  // Push final section
  if (currentHeading && currentContent.length > 0) {
    const style = SECTION_STYLE[currentHeading] || DEFAULT_STYLE;
    sections.push({
      heading: currentHeading,
      content: currentContent.join("\n").trim(),
      icon: style.icon,
      accent: style.accent,
    });
  }

  // If no sections were parsed (fallback), put everything in one block
  if (sections.length === 0 && text.trim()) {
    sections.push({
      heading: "Analysis",
      content: text.trim(),
      icon: BookOpen,
      accent: "violet",
    });
  }

  return sections;
}

export function ShowMeVerseBreakdown({ open, onOpenChange, onUse, onSave, savedResults = [], reviewOnly }: ShowMeVerseBreakdownProps) {
  const [verseRef, setVerseRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<BreakdownSection[]>([]);
  const [currentLabel, setCurrentLabel] = useState("");
  // Review mode: browse saved results
  const [reviewIndex, setReviewIndex] = useState(0);
  const [isReviewing, setIsReviewing] = useState(false);

  // When opening in review-only mode, show saved results immediately
  const effectiveReviewOnly = reviewOnly && savedResults.length > 0;

  const handleReveal = async () => {
    if (!verseRef.trim()) {
      toast.error("Enter a verse reference first");
      return;
    }
    setLoading(true);
    setSections([]);
    setIsReviewing(false);
    try {
      onUse();
      const ref = verseRef.trim();
      const match = ref.match(/^(.+?)\s+(\d+):(\d+.*)$/);
      const { data, error } = await callJeeves(
        {
          mode: "commentary-revealed",
          message: ref,
          book: match?.[1] || ref,
          chapter: match?.[2] || "",
          verse: match?.[3] || "",
          verseText: { verse: match?.[3] || "", text: ref },
          commentaryDepth: "depth",
          activeDimensions: ["1D", "2D", "3D", "4D", "5D"],
        },
        "show-me"
      );
      if (error) throw error;
      const text = typeof data === "string" ? data : (data as any)?.response || "";
      const parsed = parseBreakdown(text);
      setSections(parsed);
      setCurrentLabel(ref);
      // Save the result
      onSave?.(ref, text);
    } catch (err) {
      toast.error("Something went wrong. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedResult = (index: number) => {
    const result = savedResults[index];
    if (!result) return;
    const text = typeof result.data === "string" ? result.data : "";
    setSections(parseBreakdown(text));
    setCurrentLabel(result.label);
    setReviewIndex(index);
    setIsReviewing(true);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setSections([]);
      setVerseRef("");
      setIsReviewing(false);
    }, 300);
  };

  // Auto-load first saved result when opening in review-only mode
  useEffect(() => {
    if (open && effectiveReviewOnly && sections.length === 0) {
      loadSavedResult(savedResults.length - 1); // show most recent first
    }
  }, [open, effectiveReviewOnly]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 bg-card/95 backdrop-blur-xl overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 flex-shrink-0" />

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-violet-500/20">
              <BookOpen className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Verse Breakdown</h2>
              <p className="text-sm text-muted-foreground">
                {effectiveReviewOnly
                  ? "Reviewing your saved breakdowns"
                  : "Enter any verse to see what's hidden beneath the surface"}
              </p>
            </div>
          </div>

          {/* Input — hidden in review-only mode */}
          {!effectiveReviewOnly && (
            <div className="flex gap-2 mb-6">
              <Input
                placeholder="e.g. John 3:16, Genesis 3:15, Psalm 23:1"
                value={verseRef}
                onChange={(e) => setVerseRef(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !loading && handleReveal()}
                className="flex-1"
              />
              <Button
                onClick={handleReveal}
                disabled={loading || !verseRef.trim()}
                className="gap-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Reveal
              </Button>
            </div>
          )}

          {/* Saved results picker — shown when reviewing or when saved results exist in review-only mode */}
          {(effectiveReviewOnly || isReviewing) && savedResults.length > 0 && (
            <div className="flex items-center justify-between mb-4 px-1">
              <Button
                variant="ghost"
                size="sm"
                disabled={reviewIndex <= 0}
                onClick={() => loadSavedResult(reviewIndex - 1)}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </Button>
              <span className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{currentLabel}</span>
                {" "}({reviewIndex + 1} of {savedResults.length})
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={reviewIndex >= savedResults.length - 1}
                onClick={() => loadSavedResult(reviewIndex + 1)}
                className="gap-1"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Non-review: show saved results button when results exist and viewing fresh content */}
          {!effectiveReviewOnly && !isReviewing && savedResults.length > 0 && sections.length === 0 && !loading && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => loadSavedResult(savedResults.length - 1)}
              className="mb-4 gap-2 text-muted-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Review saved breakdowns ({savedResults.length})
            </Button>
          )}

          {/* Loading state */}
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 gap-3"
              >
                <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
                <p className="text-sm text-muted-foreground">Scanning 5 dimensions, cross-references, and Palace principles...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Current label when showing fresh results */}
          {!isReviewing && !effectiveReviewOnly && currentLabel && sections.length > 0 && (
            <p className="text-sm font-medium text-violet-300 mb-4">{currentLabel}</p>
          )}

          {/* Response sections with staggered fade-in */}
          {sections.length > 0 && (
            <div className="space-y-4">
              {sections.map((section, i) => {
                const Icon = section.icon;
                const colors = ACCENT_CLASSES[section.accent] || ACCENT_CLASSES.violet;
                return (
                  <motion.div
                    key={`${currentLabel}-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className={`rounded-xl border ${colors.border} ${colors.bg} p-4`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`h-4 w-4 ${colors.text}`} />
                      <h3 className={`font-semibold ${colors.text}`}>{section.heading}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {section.content}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
