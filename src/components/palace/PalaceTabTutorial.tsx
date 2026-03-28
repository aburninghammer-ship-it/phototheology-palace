import { useState, useCallback, useEffect, useRef } from "react";
import { PALACE_TAB_TUTORIAL, type TutorialStep } from "@/data/palaceTabTutorial";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, ChevronRight, ChevronLeft, Volume2, VolumeX, Loader2, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import reginaldAvatar from "@/assets/avatars/reginald-avatar.png";

interface PalaceTabTutorialProps {
  onClose: () => void;
  onTabChange?: (tab: "explore" | "progress" | "audio-tour") => void;
}

export const PalaceTabTutorial = ({ onClose, onTabChange }: PalaceTabTutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const step = PALACE_TAB_TUTORIAL[currentStep];
  const totalSteps = PALACE_TAB_TUTORIAL.length;

  // Switch tab if needed
  useEffect(() => {
    if (step.activeTab && onTabChange) {
      onTabChange(step.activeTab);
    }
  }, [currentStep, step.activeTab, onTabChange]);

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

  const playNarration = useCallback(async () => {
    if (isLoading) return;
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
            segmentId: `tutorial-${step.id}`,
          }),
        }
      );

      if (!response.ok) throw new Error("TTS request failed");

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onplay = () => { setIsPlaying(true); setIsLoading(false); };
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => { setIsPlaying(false); setIsLoading(false); };
      await audio.play();
    } catch {
      setIsLoading(false);
    }
  }, [step.narration, isLoading, stopAudio]);

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
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  }, [currentStep, stopAudio]);

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
      else if (e.key === "Escape") { stopAudio(); onClose(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev, stopAudio, onClose]);

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
        onClick={onClose}
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
            <Card className="relative overflow-hidden border-amber-500/30 bg-gradient-to-br from-background via-background to-amber-950/10 shadow-2xl shadow-amber-500/10 max-w-lg w-full">
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
                  <div className="h-11 w-11 rounded-full overflow-hidden flex-shrink-0 border-2 border-amber-500/40 shadow-lg">
                    <img src={reginaldAvatar} alt="Reginald" className="h-full w-full object-cover object-top" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-medium text-amber-400">Reginald</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">Step {currentStep + 1} of {totalSteps}</span>
                    </div>
                    <h3 className="font-semibold text-base leading-snug">{step.title}</h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 pl-14">
                  {step.description}
                </p>

                {/* Progress dots */}
                <div className="flex justify-center gap-1.5 mb-4">
                  {PALACE_TAB_TUTORIAL.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === currentStep
                          ? "w-6 bg-amber-400"
                          : i < currentStep
                          ? "w-1.5 bg-amber-400/50"
                          : "w-1.5 bg-muted-foreground/20"
                      }`}
                    />
                  ))}
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
                    onClick={isPlaying ? stopAudio : playNarration}
                    disabled={isLoading}
                    className="h-9 w-9 rounded-full border border-amber-500/30 hover:bg-amber-500/10"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                    ) : isPlaying ? (
                      <VolumeX className="h-4 w-4 text-amber-400" />
                    ) : (
                      <Volume2 className="h-4 w-4 text-amber-400" />
                    )}
                  </Button>

                  <Button
                    size="sm"
                    onClick={goNext}
                    className="gap-1 bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    {currentStep === totalSteps - 1 ? "Finish" : "Next"}
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
