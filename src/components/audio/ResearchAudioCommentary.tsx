import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Headphones, Play, Pause, SkipBack, SkipForward, Square, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTextToSpeechEnhanced } from "@/hooks/useTextToSpeechEnhanced";
import { globalAudioManager } from "@/lib/globalAudioManager";

interface ResearchAudioCommentaryProps {
  briefText: string;
  className?: string;
}

export function ResearchAudioCommentary({ briefText, className }: ResearchAudioCommentaryProps) {
  const [sections, setSections] = useState<string[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showText, setShowText] = useState(false);

  const currentSectionRef = useRef(0);
  const sectionsRef = useRef<string[]>([]);
  const autoAdvancingRef = useRef(false);
  const ttsSpeakRef = useRef<((text: string) => Promise<void>) | null>(null);
  const ttsPreloadRef = useRef<((text: string) => Promise<void>) | null>(null);

  const updateCurrentSection = useCallback((idx: number) => {
    currentSectionRef.current = idx;
    setCurrentSection(idx);
  }, []);

  const {
    speak: ttsSpeak,
    stop: ttsStop,
    preload: ttsPreload,
    isLoading: ttsLoading,
    isPlaying,
  } = useTextToSpeechEnhanced({
    defaultVoice: "nova",
    onEnd: () => {
      const idx = currentSectionRef.current;
      const secs = sectionsRef.current;
      if (autoAdvancingRef.current && idx < secs.length - 1) {
        const nextIdx = idx + 1;
        updateCurrentSection(nextIdx);
        ttsSpeakRef.current?.(secs[nextIdx]);
        if (nextIdx + 1 < secs.length) {
          ttsPreloadRef.current?.(secs[nextIdx + 1]);
        }
      } else {
        autoAdvancingRef.current = false;
      }
    },
  });

  ttsSpeakRef.current = ttsSpeak;
  ttsPreloadRef.current = ttsPreload;

  const queueSectionPlayback = useCallback(
    (idx: number) => {
      const nextSections = sectionsRef.current;
      const targetSection = nextSections[idx];

      if (!targetSection) return;

      updateCurrentSection(idx);
      autoAdvancingRef.current = true;
      void ttsSpeak(targetSection);

      if (idx + 1 < nextSections.length) {
        void ttsPreload(nextSections[idx + 1]);
      }
    },
    [ttsSpeak, ttsPreload, updateCurrentSection]
  );

  const generateAndPlay = useCallback(async () => {
    if (!briefText.trim()) {
      toast.error("No research brief to convert");
      return;
    }

    globalAudioManager.stopAll();
    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-research-audio", {
        body: { brief_text: briefText },
      });

      if (error) throw error;
      if (!data?.sections?.length) throw new Error("No sections returned");

      const newSections = data.sections as string[];
      setSections(newSections);
      sectionsRef.current = newSections;
      setIsGenerating(false);
      queueSectionPlayback(0);
    } catch (err: any) {
      console.error("Research audio error:", err);
      toast.error(err?.message || "Failed to generate audio commentary");
    } finally {
      setIsGenerating(false);
    }
  }, [briefText, queueSectionPlayback]);

  const playSection = useCallback(
    (idx: number) => {
      queueSectionPlayback(idx);
    },
    [queueSectionPlayback]
  );

  const stopAll = useCallback(() => {
    ttsStop();
    autoAdvancingRef.current = false;
    updateCurrentSection(0);
  }, [ttsStop, updateCurrentSection]);

  // Before sections are generated — show generate button
  if (sections.length === 0) {
    return (
      <div className="mt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={generateAndPlay}
          disabled={isGenerating || ttsLoading}
          className={`gap-1.5 text-[11px] h-7 px-2.5 text-emerald-400/60 hover:text-emerald-400 hover:bg-emerald-500/10 ${className || ""}`}
        >
          {isGenerating || ttsLoading ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Generating commentary…</span>
            </>
          ) : (
            <>
              <Headphones className="h-3 w-3" />
              <span>Listen to Commentary</span>
            </>
          )}
        </Button>
      </div>
    );
  }

  // Sections loaded — inline player
  return (
    <div className="mt-3 pt-3 border-t border-emerald-500/20 space-y-2">
      {/* Progress dots */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-emerald-400/60 font-medium shrink-0">
          {isPlaying ? "Playing" : "Ready"} {currentSection + 1}/{sections.length}
        </span>
        <div className="flex items-center gap-1 flex-1">
          {sections.map((_, idx) => (
            <button
              key={idx}
              className={`flex-1 h-1 rounded-full transition-all cursor-pointer hover:h-2 ${
                idx === currentSection
                  ? "bg-emerald-400 shadow-sm shadow-emerald-400/30"
                  : idx < currentSection
                  ? "bg-emerald-400/40"
                  : "bg-emerald-400/15"
              }`}
              onClick={() => {
                ttsStop();
                setTimeout(() => playSection(idx), 100);
              }}
              title={`Section ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Transport controls */}
      <div className="flex items-center justify-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-emerald-400/60 hover:text-emerald-400"
          disabled={currentSection === 0}
          onClick={() => {
            ttsStop();
            setTimeout(() => playSection(Math.max(0, currentSection - 1)), 100);
          }}
        >
          <SkipBack className="h-3 w-3" />
        </Button>

        {isPlaying ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-emerald-400 hover:text-emerald-300"
            onClick={() => {
              ttsStop();
              autoAdvancingRef.current = false;
            }}
          >
            <Pause className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-emerald-400 hover:text-emerald-300"
            onClick={() => playSection(currentSection)}
            disabled={ttsLoading}
          >
            {ttsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 ml-0.5" />}
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-emerald-400/60 hover:text-emerald-400"
          disabled={currentSection >= sections.length - 1}
          onClick={() => {
            ttsStop();
            setTimeout(() => playSection(Math.min(sections.length - 1, currentSection + 1)), 100);
          }}
        >
          <SkipForward className="h-3 w-3" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-red-400/50 hover:text-red-400"
          onClick={stopAll}
        >
          <Square className="h-3 w-3" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-emerald-400/40 hover:text-emerald-400"
          onClick={() => setShowText((v) => !v)}
          title={showText ? "Hide text" : "Show text"}
        >
          {showText ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </Button>
      </div>

      {/* Collapsible section text */}
      {showText && (
        <div className="text-[12px] leading-relaxed text-emerald-300/70 bg-emerald-950/30 rounded-lg px-3 py-2 max-h-32 overflow-y-auto">
          {sections[currentSection]}
        </div>
      )}
    </div>
  );
}
