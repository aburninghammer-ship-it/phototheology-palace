import { useState, useCallback, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ChevronRight, ChevronLeft, Pause, Play, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import reginaldAvatar from "@/assets/avatars/reginald-avatar.png";

export interface GuidedTourStep {
  id: string;
  title: string;
  description: string;
  narration: string;
  targetSelector?: string;
  tooltipPosition: "center" | "bottom";
}

interface GuidedTourOverlayProps {
  steps: GuidedTourStep[];
  onClose: () => void;
  accentColor?: string; // e.g. "primary", "amber-500"
}

const SILENT_AUDIO = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAbD/rU9UAAAAAAAAAAAAAAAAAAAAAP/jOMAAABQAJQCAAAhDAH+AIACQA/xQAP/zDAIAAAFPAQD/8wgD/+M4wAAAGMAlAAA";

/**
 * Reusable auto-advancing guided tour overlay with Reginald narration.
 * Prime audio before opening by calling `primeAudioForTour()`.
 */
export function primeAudioForTour() {
  const audio = new Audio();
  audio.src = SILENT_AUDIO;
  audio.volume = 0.01;
  audio.play().then(() => { audio.pause(); audio.currentTime = 0; }).catch(() => {});
}

export const GuidedTourOverlay = ({ steps, onClose, accentColor = "primary" }: GuidedTourOverlayProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const closedRef = useRef(false);
  const totalSteps = steps.length;

  const safeClose = useCallback(() => {
    if (closedRef.current) return;
    closedRef.current = true;
    onClose();
  }, [onClose]);

  const step = currentStep < totalSteps ? steps[currentStep] : null;

  // Highlight target element
  useEffect(() => {
    if (!step?.targetSelector) return;
    const el = document.querySelector(step.targetSelector);
    if (el) {
      el.classList.add("tutorial-highlight");
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return () => {
      if (el) el.classList.remove("tutorial-highlight");
    };
  }, [currentStep, step?.targetSelector]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
    }
    setIsPlaying(false);
    setIsLoading(false);
  }, []);

  const advanceStep = useCallback(() => {
    setCurrentStep((s) => {
      if (s >= totalSteps - 1) {
        setTimeout(() => safeClose(), 0);
        return s;
      }
      return s + 1;
    });
  }, [totalSteps, safeClose]);

  const goNext = useCallback(() => { stopAudio(); advanceStep(); }, [stopAudio, advanceStep]);
  const goPrev = useCallback(() => { stopAudio(); setIsPaused(false); setCurrentStep((s) => (s > 0 ? s - 1 : s)); }, [stopAudio]);

  // Auto-play narration
  useEffect(() => {
    if (isPaused || !step) return;
    let cancelled = false;

    const playNarration = async () => {
      stopAudio();
      setIsLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-palace-tour-audio`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({
              script: step.narration,
              voice: "reginald",
              guide: "reginald",
              segmentId: `tour-${step.id}`,
            }),
          }
        );
        if (cancelled) return;
        if (!response.ok) throw new Error("TTS failed");
        const data = await response.json();
        if (cancelled || !data?.audioUrl) throw new Error("No audio URL");

        const audio = audioRef.current ?? new Audio();
        audioRef.current = audio;
        audio.loop = false;
        audio.onplay = null;
        audio.onended = null;
        audio.onerror = null;
        audio.src = data.audioUrl;
        audio.load();
        audio.onplay = () => { setIsPlaying(true); setIsLoading(false); };
        audio.onended = () => { setIsPlaying(false); if (!cancelled) setTimeout(() => advanceStep(), 1200); };
        audio.onerror = () => { setIsPlaying(false); setIsLoading(false); if (!cancelled) setTimeout(() => advanceStep(), 4000); };
        await audio.play();
      } catch (err) {
        console.error("[GuidedTour] Audio error:", err);
        if (cancelled) return;
        setIsLoading(false);
        setTimeout(() => { if (!cancelled) advanceStep(); }, 5000);
      }
    };

    const timer = setTimeout(playNarration, 500);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [currentStep, isPaused, step, stopAudio, advanceStep]);

  const togglePause = useCallback(() => {
    if (isPaused) {
      setIsPaused(false);
    } else {
      setIsPaused(true);
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isPaused]);

  useEffect(() => () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === " ") { e.preventDefault(); togglePause(); }
      else if (e.key === "Escape") { stopAudio(); safeClose(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev, togglePause, stopAudio, safeClose]);

  if (!step) return null;

  const posClass = step.tooltipPosition === "center"
    ? "fixed inset-0 flex items-center justify-center z-[102]"
    : "fixed bottom-4 left-1/2 -translate-x-1/2 z-[102] w-full max-w-lg px-4";

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-[100]" onClick={() => { stopAudio(); safeClose(); }} />

      <div className={posClass} onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          <motion.div key={step.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}>
            <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-background via-background to-primary/10 shadow-2xl shadow-primary/10 max-w-lg w-full">
              <button onClick={() => { stopAudio(); safeClose(); }}
                className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-accent/80 text-muted-foreground hover:text-foreground transition-colors z-10">
                <X className="h-4 w-4" />
              </button>
              <div className="p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="h-11 w-11 rounded-full overflow-hidden flex-shrink-0 border-2 border-primary/40 shadow-lg">
                    <img src={reginaldAvatar} alt="Reginald" className="h-full w-full object-cover object-top" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-medium text-primary">Reginald</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">Step {currentStep + 1} of {totalSteps}</span>
                      {isLoading && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
                      {isPlaying && (
                        <span className="flex gap-0.5 items-end h-3">
                          {[1, 2, 3].map(i => (
                            <span key={i} className="w-0.5 bg-primary rounded-full animate-pulse"
                              style={{ height: `${6 + i * 3}px`, animationDelay: `${i * 0.15}s` }} />
                          ))}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-base leading-snug">{step.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 pl-14">{step.description}</p>
                <div className="w-full h-1 bg-muted rounded-full mb-4 overflow-hidden">
                  <motion.div className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }} animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                    transition={{ duration: 0.4 }} />
                </div>
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" onClick={goPrev} disabled={currentStep === 0} className="gap-1">
                    <ChevronLeft className="h-4 w-4" /> Back
                  </Button>
                  <Button variant="ghost" size="icon" onClick={togglePause}
                    className="h-9 w-9 rounded-full border border-primary/30 hover:bg-primary/10">
                    {isPaused ? <Play className="h-4 w-4 text-primary" /> : <Pause className="h-4 w-4 text-primary" />}
                  </Button>
                  <Button size="sm" onClick={goNext} className="gap-1">
                    {currentStep === totalSteps - 1 ? "Finish" : "Skip"} <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};
