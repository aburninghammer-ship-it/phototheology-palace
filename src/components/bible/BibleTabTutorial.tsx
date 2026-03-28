import { useState, useCallback, useEffect, useRef } from "react";
import { BIBLE_TAB_TUTORIAL } from "@/data/bibleTabTutorial";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ChevronRight, ChevronLeft, Pause, Play, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import reginaldAvatar from "@/assets/avatars/reginald-avatar.png";

interface BibleTabTutorialProps {
  onClose: () => void;
}

export const BibleTabTutorial = ({ onClose }: BibleTabTutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const step = BIBLE_TAB_TUTORIAL[currentStep];
  const totalSteps = BIBLE_TAB_TUTORIAL.length;

  // Guard against out-of-bounds
  if (!step) {
    onClose();
    return null;
  }

  // Highlight target element
  useEffect(() => {
    if (!step.targetSelector) return;
    const el = document.querySelector(step.targetSelector);
    if (el) {
      el.classList.add("tutorial-highlight");
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return () => {
      if (el) el.classList.remove("tutorial-highlight");
    };
  }, [currentStep, step.targetSelector]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(false);
    setIsLoading(false);
  }, []);

  const goNext = useCallback(() => {
    stopAudio();
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      onClose();
    }
  }, [currentStep, totalSteps, stopAudio, onClose]);

  const goPrev = useCallback(() => {
    stopAudio();
    setIsPaused(false);
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  }, [currentStep, stopAudio]);

  // Auto-play narration when step changes
  useEffect(() => {
    if (isPaused) return;

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
              segmentId: `bible-tutorial-${step.id}`,
            }),
          }
        );

        if (!response.ok) throw new Error("TTS request failed");

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.onplay = () => {
          setIsPlaying(true);
          setIsLoading(false);
        };
        audio.onended = () => {
          setIsPlaying(false);
          // Auto-advance after narration finishes
          setTimeout(() => {
            if (currentStep < totalSteps - 1) {
              setCurrentStep((s) => s + 1);
            } else {
              onClose();
            }
          }, 1200);
        };
        audio.onerror = () => {
          setIsPlaying(false);
          setIsLoading(false);
          // Auto-advance even on error after delay
          setTimeout(() => {
            if (currentStep < totalSteps - 1) {
              setCurrentStep((s) => s + 1);
            }
          }, 4000);
        };

        await audio.play();
      } catch {
        setIsLoading(false);
        // Fallback: auto-advance after reading time
        setTimeout(() => {
          if (currentStep < totalSteps - 1) {
            setCurrentStep((s) => s + 1);
          }
        }, 5000);
      }
    };

    const timer = setTimeout(playNarration, 500);
    return () => clearTimeout(timer);
  }, [currentStep, isPaused]); // eslint-disable-line react-hooks/exhaustive-deps

  const togglePause = useCallback(() => {
    if (isPaused) {
      setIsPaused(false);
      // Will trigger auto-play via effect
    } else {
      setIsPaused(true);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    }
  }, [isPaused]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === " ") { e.preventDefault(); togglePause(); }
      else if (e.key === "Escape") { stopAudio(); onClose(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev, togglePause, stopAudio, onClose]);

  const tooltipPositionClass = step.tooltipPosition === "center"
    ? "fixed inset-0 flex items-center justify-center z-[102]"
    : "fixed bottom-4 left-1/2 -translate-x-1/2 z-[102] w-full max-w-lg px-4";

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-[100]"
        onClick={() => { stopAudio(); onClose(); }}
      />

      {/* Tutorial Card */}
      <div className={tooltipPositionClass} onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-background via-background to-primary/10 shadow-2xl shadow-primary/10 max-w-lg w-full">
              {/* Close */}
              <button
                onClick={() => { stopAudio(); onClose(); }}
                className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-accent/80 text-muted-foreground hover:text-foreground transition-colors z-10"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="p-5">
                {/* Header with avatar */}
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
                          {[1,2,3].map(i => (
                            <span key={i} className="w-0.5 bg-primary rounded-full animate-pulse" style={{ height: `${6 + i * 3}px`, animationDelay: `${i * 0.15}s` }} />
                          ))}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-base leading-snug">{step.title}</h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 pl-14">
                  {step.description}
                </p>

                {/* Progress bar */}
                <div className="w-full h-1 bg-muted rounded-full mb-4 overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goPrev}
                    disabled={currentStep === 0}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={togglePause}
                    className="h-9 w-9 rounded-full border border-primary/30 hover:bg-primary/10"
                  >
                    {isPaused ? (
                      <Play className="h-4 w-4 text-primary" />
                    ) : (
                      <Pause className="h-4 w-4 text-primary" />
                    )}
                  </Button>

                  <Button
                    size="sm"
                    onClick={goNext}
                    className="gap-1"
                  >
                    {currentStep === totalSteps - 1 ? "Finish" : "Skip"}
                    <ChevronRight className="h-4 w-4" />
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
